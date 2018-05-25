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

class FileSweeper {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.elapsed = 0;
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
    console.log('\nThe following files will be deleted of ALL types:');
    // list of ALL stuff
    this.printDeleteConfirmation(eventType);
  }

  printFilterImagesMenu(eventType) {
    console.log('\nThe following image files will be deleted:');
    this.printDeleteConfirmation(eventType);
  }

  printFilterVideosMenu(eventType) {
    console.log('\nThe following video files will be deleted:');
    this.printDeleteConfirmation(eventType);
  }

  printDeleteConfirmation(eventType) {
    console.log('Are you sure you want to delete the items above? (Y/N)');
    this.startListener(eventType);
  }

  checkInput(input, eventType) {
    if (input === 'N' || input === 'n') {
      console.log('Returning to main menu...');
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
