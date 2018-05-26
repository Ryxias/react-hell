'use strict';

/*
 *
 *  File Sweeper
 *  Manages and deletes files from the Slack workspace
 *  When filtering files from the team workspace, the files
 *  are filtered by file type and whether or not they are pinned/starred.
 *  User can quit anytime by typing 'quit' or 'exit' on the command line.
 *
 */

const menuTypes = require('./lib/menuTypes');
const readline = require('readline');
const axios = require('axios');
const token = process.env.NODE_ENV === 'production' ? require('/etc/chuuni/config').fsd_workspace.legacy_token
                                                    : require('../../config/config').fsd_workspace.legacy_token;

class FileSweeper {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.list = [];
    this.elapsed = 0;
    this.config = {
      headers: {
        'Authorization': 'bearer ' + token,
      },
    }
  }

  start() {
    this.printWelcome();
  }

  leave() {
    console.log('\nThanks for using Slack File Sweeper! Goodbye!\n');
    process.exit(0);
  }

  resetTimer() {
    this.elapsed = 0;
    clearInterval(this.interval);
  }

  startTimer() {
    let self = this;
    this.interval = setInterval(() => { self.elapsed += 1 }, 1000);
  }

  printWelcome() {
    console.log('\nWelcome to the Slack File Sweeper.\n' +
      '(NOTE: Please keep in mind Slack API quota is 50 requests per minute for file deletions.\n' +
      'Therefore, only 50 files can be displayed and deleted at a time every minute.)\n');
    this.printMainMenu();
  }

  printMainMenu() {
    console.log('Please choose one of the following options.\n' +
      'You may quit anytime by entering "quit" or "exit".\n');
    menuTypes['mainMenu'].forEach((item) => {
      console.log(item);
    });
    this.startListener('mainMenu');
  }

  printFilterAllMenu(eventType) {
    console.log('\nThe following files will be deleted of ALL types:\n');
    // list of ALL stuff
    const params = {
      count: 50,
      ts_from: 0,
      ts_to: (Math.floor(Date.now()/1000) - 5259492) // Two months ago in seconds
    };
    return axios.get(`https://slack.com/api/files.list?token=${token}&count=${params.count}&ts_from=${params.ts_from}&ts_to=${params.ts_to}`)
      .then(res => {
        let count = 1;
        res.data.files.forEach(file => {
          this.list.push(file);
          console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
          count += 1;
        });
        this.printDeleteConfirmation(eventType);
      }).catch(err => console.error(err));
  }

  printFilterImagesMenu(eventType) {
    console.log('\nThe following image files will be deleted:');
    const params = {
      count: 50,
      types: 'images',
      ts_from: 0,
      ts_to: (Math.floor(Date.now()/1000) - 5259492) // Two months ago in seconds
    };
    return axios.get(`https://slack.com/api/files.list?token=${token}&count=${params.count}&ts_from=${params.ts_from}&ts_to=${params.ts_to}&types=${params.types}`)
      .then(res => {
        let count = 1;
        res.data.files.forEach(file => {
          this.list.push(file);
          console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
          count += 1;
        });
        this.printDeleteConfirmation(eventType);
      }).catch(err => console.error(err));
  }

  printFilterVideosMenu(eventType) {
    console.log('\nThe following video files will be deleted:');
    const params = {
      count: 50,
      types: 'videos',
      ts_from: 0,
      ts_to: (Math.floor(Date.now()/1000) - 5259492) // Two months ago in seconds
    };
    return axios.get(`https://slack.com/api/files.list?token=${token}&count=${params.count}&ts_from=${params.ts_from}&ts_to=${params.ts_to}&types=${params.types}`)
      .then(res => {
        let count = 1;
        res.data.files.forEach(file => {
          this.list.push(file);
          console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
          count += 1;
        });
        this.printDeleteConfirmation(eventType);
      }).catch(err => console.error(err));
  }

  printDeleteConfirmation(eventType) {
    console.log('\nAre you sure you want to delete the items above?');
    console.log('(NOTE: Starred/pinned messages will not be deleted.) (Y/N)');
    this.startListener(eventType);
  }

  checkInput(input, eventType) {
    if (input === 'N' || input === 'n') {
      console.log('\nReturning to main menu...\n');
      this.printMainMenu();
    } else if (input !== 'Y' && input !== 'y') {
      this.handleInvalidInput(eventType);
    } else {
      switch(eventType) {
        case 'all':
          this.handleFilterAllAction();
          break;
        case 'images':
          this.handleFilterImagesAction();
          break;
        case 'videos':
          this.handleFilterVideosAction();
          break;
        default:
      }
    }
  }

  handleMainMenuAction(input, eventType) {
    switch(input) {
      case '1':
        this.printFilterAllMenu('all');
        break;
      case '2':
        this.printFilterImagesMenu('images');
        break;
      case '3':
        this.printFilterVideosMenu('videos');
        break;
      default:
        this.handleInvalidInput(eventType);
    };
  }

  handleFilterAllAction(input, eventType) {
    // delete all the stuff
    console.log('\nAll files deleted.\n');
    this.startTimer();
    this.printMainMenu();
  }

  handleFilterImagesAction(input, eventType) {
    // delete all the images
    console.log('\nAll images deleted.\n');
    this.startTimer();
    this.printMainMenu();
  }

  handleFilterVideosAction(input, eventType) {
    // delete all the videos
    console.log('\nAll videos deleted.\n');
    this.startTimer();
    this.printMainMenu();
  }

  handleInvalidInput(eventType) {
    console.log('\nSorry, I could not recognize that input. Please try again.');
    switch(eventType) {
      case 'all':
        this.printFilterAllMenu(eventType);
        break;
      case 'images':
        this.printFilterImagesMenu(eventType);
        break;
      case 'videos':
        this.printFilterVideosMenu(eventType);
        break;
      default:
    }
  }

  startListener(eventType) {
    let self = this;
    this.rl.question('\nEnter your choice: ', (input) => {
      if (input === 'quit' || input === 'exit') {
        self.leave();
      } else if (this.elapsed === 0 || this.elapsed >= 60) {
        this.resetTimer();
        switch(eventType) {
          case 'mainMenu':
            self.handleMainMenuAction(input, eventType);
            break;
          case 'all':
            self.checkInput(input, eventType);
            break;
          case 'images':
            self.checkInput(input, eventType);
            break;
          case 'videos':
            self.checkInput(input, eventType);
            break;
          default:
        }
      } else {
        console.log('\nAPI Quota has been reached for this minute.\n' +
                    'Please wait ' + (60 - this.elapsed) + ' more seconds before trying again.\n');
        this.printMainMenu();
      }
    });
  }
}

module.exports = FileSweeper;
