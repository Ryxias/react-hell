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
    };
    this.deleteLimit = 50; // Default: 50 to match API quota
  }

  /**
   * Initializes the program.
   */
  start() {
    this.printWelcome();
  }

  /**
   * Exits the program.
   */
  leave() {
    console.log('\nThanks for using Slack File Sweeper! Goodbye!\n');
    process.exit(0);
  }

  /**
   * Starts the API quota timer.
   */
  startTimer() {
    let self = this;
    this.interval = setInterval(() => { self.elapsed += 1 }, 1000);
  }

  /**
   * Resets the API quota timer.
   */
  resetTimer() {
    this.elapsed = 0;
    clearInterval(this.interval);
  }

  /**
   * Used to fetch the list of files that exist on the current workspace using the Slack API.
   * This automatically filters out any starred/pinned files deemed as important and provides
   * a list of 50 files at a time to satisfy the maximum API quota for deletion (50).
   *
   * @param eventType: to match the correct filter and action functions required for query and deletion
   * @param types: type of file used to sort the search query
   * @param itemCount: current item number on the file list
   * @param ignoreCount: number of skipped files due to it being starred/pinned
   * @param page: current page of the search query
   * @returns {*}
   */
  fetchList(eventType, types = 'all', itemCount = 1, ignoreCount = 0, page = 1) {
    const params = {
      count: this.deleteLimit,
      ts_from: 0,
      ts_to: (Math.floor(Date.now()/1000) - 5259492) // Two months ago in seconds
    };
    let api_url = `https://slack.com/api/files.list?token=${token}&count=${params.count}&ts_to=${params.ts_to}&types=${types}&page=${page}`;
    return axios.get(api_url)
      .then(res => {
        let result = res.data;
        result.files.forEach(file => {
          if (file.is_starred !== true && !file.pinned_to) {
            if (this.list.length < this.deleteLimit) {
              this.list.push(file);
              console.log(itemCount + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
              itemCount += 1;
            }
          } else {
            ignoreCount += 1;
          }
        });
        if ((page * params.count) - ignoreCount >= this.deleteLimit) {
          return this.printDeleteConfirmation(eventType);
        } else {
          if (page < result.paging.pages) {
            page += 1;
            return this.fetchList(eventType, types, itemCount, ignoreCount, page);
          } else {
            return this.printDeleteConfirmation(eventType);
          }
        }
      }).catch(err => {
      console.error(err);
    });
  }

  /**
   * Deletes all of the files on list.
   * @param eventType: used to print the appropriate message.
   */
  deleteFiles(eventType) {
    let deleteCount = 0;
    this.list.forEach(file => {
      let api_url = `https://slack.com/api/files.delete?token=${token}&file=${file.id}`;
      axios.post(api_url)
        .then(res => {
          deleteCount += 1;
          console.log(`Deleted ${file.name}.`);
          if (deleteCount === this.deleteLimit) {
            switch (eventType) {
              case 'all':
                console.log('\nAll files in list are deleted.\n');
                break;
              case 'images':
                console.log('\nAll images in list are deleted.\n');
                break;
              case 'videos':
                console.log('\nAll videos in list are deleted.\n');
                break;
              default:
            }
            this.list = [];
            this.startTimer();
            return this.printMainMenu();
          }
        }).catch(err => console.error(err));
    });
  }

  /**
   * Only runs once in the beginning of the program.  Informs user about API quota for deletion.
   */
  printWelcome() {
    console.log('\nWelcome to the Slack File Sweeper.\n' +
      '(NOTE: Please keep in mind Slack API quota is 50 requests per minute for file deletions.\n' +
      'Therefore, only 50 files can be displayed and deleted at a time every minute.\n' +
      'Starred/Pinned messages are filtered out as they should be deemed to be important.)\n');
    this.printMainMenu();
  }

  /**
   * Prints the available main filtering options for user to use for file deletion.
   */
  printMainMenu() {
    console.log('Please choose one of the following options.\n' +
      'You may quit anytime by entering "quit" or "exit".\n');
    menuTypes['mainMenu'].forEach((item) => {
      console.log(item);
    });
    this.startListener('mainMenu');
  }

  /**
   * Prints all the non-starred/pinned files the Slack API server can see that can be marked for deletion.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns {*}
   */
  printFilterAllMenu(eventType) {
    console.log('\nThe following files will be deleted of ALL types:\n');
    // list of ALL stuff
    if (this.list.length > 0) {
      let count = 1;
      this.list.forEach(file => {
        console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
        count += 1;
      });
      return this.printDeleteConfirmation(eventType);
    } else {
      return this.fetchList(eventType);
    }
  }

  /**
   * Prints all the non-starred/pinned images the Slack API server can see that can be marked for deletion.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns {*}
   */
  printFilterImagesMenu(eventType) {
    console.log('\nThe following image files will be deleted:');
    // list of all IMAGES
    if (this.list.length > 0) {
      let count = 1;
      this.list.forEach(file => {
        console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
        count += 1;
      });
      return this.printDeleteConfirmation(eventType);
    } else {
      return this.fetchList(eventType, 'images');
    }
  }

  /**
   * Prints all the non-starred/pinned videos the Slack API server can see that can be marked for deletion.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns {*}
   */
  printFilterVideosMenu(eventType) {
    console.log('\nThe following video files will be deleted:');
    // list of all VIDEOS
    if (this.list.length > 0) {
      let count = 1;
      this.list.forEach(file => {
        console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
        count += 1;
      });
      return this.printDeleteConfirmation(eventType);
    } else {
      return this.fetchList(eventType, 'videos');
    }
  }

  /**
   * Prompts the user for confirmation if they want those files deleted or return to the main menu.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns call to startListener()
   */
  printDeleteConfirmation(eventType) {
    console.log('\nAre you sure you want to delete the items above? (Y/N)');
    return this.startListener(eventType);
  }

  /**
   * Tries an action based on user input for deletion confirmation event.
   * @param input: user's input that is used to determine the appropriate action to take
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
  checkInput(input, eventType) {
    if (input === 'N' || input === 'n') {
      this.list = []; // Clears the list
      console.log('\nReturning to main menu...\n');
      this.printMainMenu();
    } else if (input !== 'Y' && input !== 'y') {
      this.handleInvalidInput(eventType);
    } else {
      this.deleteFiles(eventType);
    }
  }

  /**
   * Tries the option selected by the user from the main menu.
   * @param input: user's input that is used to determine the appropriate action to take
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
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

  /**
   * handleInvalidInput
   * Informs the user that an invalid input was detected and returns to previous menu action.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
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

  /**
   * Enables input listener for user input after program prompt.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
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
