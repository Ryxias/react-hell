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
    this.deleteLimit = 5; // Default: 50 to match API quota
  }

  /**
   * Initializes the program.
   */
  start() {
    console.log('\nWelcome to the Slack File Sweeper.\n' +
      '(NOTE: Please keep in mind Slack API quota is 50 requests per minute for file deletions.\n' +
      'Therefore, only 50 files can be displayed and deleted at a time every minute.\n' +
      'Starred/Pinned messages are filtered out as they should be deemed to be important.)\n');
    this.printMainMenu();
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
          return this.list;
        } else {
          if (page < result.paging.pages) {
            page += 1;
            return this.fetchList(eventType, types, itemCount, ignoreCount, page);
          } else {
            return this.list;
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
  deleteFiles() {
    let deleteCount = 0;
    this.list.forEach(file => {
      let api_url = `https://slack.com/api/files.delete?token=${token}&file=${file.id}`;
      axios.post(api_url)
        .then(res => {
          deleteCount += 1;
          console.log(`Deleted ${file.name}.`);
          if (deleteCount === this.deleteLimit) {
            console.log('\nAll files in list are now deleted.\n');
            this.list = [];
            this.startTimer();
            return this.printMainMenu();
          }
        }).catch(err => console.error(err));
    });
  }

  /**
   * Prints the available main filtering options for user to use for file deletion.
   */
  printMainMenu(eventType = 'mainMenu') {
    console.log(
      '~~~~~~~~~~~~~~~~ MAIN MENU ~~~~~~~~~~~~~~~~\n' +
      'Please choose one of the following options.\n' +
      'You may quit anytime by typing "quit" or "exit".\n'
    );
    menuTypes['mainMenu'].forEach((item) => {
      console.log(item);
    });
    let self = this;
    this.rl.question('\nChoose one of the options above: ', (input) => {
      if (input === 'quit' || input === 'exit') {
        self.leave();
      } else if (this.elapsed === 0 || this.elapsed >= 60) {
        this.resetTimer();
        switch(input) {
          case '1':
            this.printFilterMenu('all');
            break;
          case '2':
            this.printFilterMenu('images');
            break;
          case '3':
            this.printFilterMenu('videos');
            break;
          default:
            this.handleInvalidInput(eventType, this.printMainMenu);
        };
      } else {
        console.log('\nAPI Quota has been reached for this minute.\n' +
          'Please wait ' + (60 - this.elapsed) + ' more seconds before trying again.\n');
        this.printMainMenu();
      }
    });
  }

  /**
   * Prints a list of the non-starred/pinned files that can be marked for deletion.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns {*}
   */
  printFilterMenu(eventType) {
    console.log('\nThe following files will be deleted:\n');
    if (this.list.length === 0) {
      this.fetchList(eventType)
        .then(() => {
          return this.confirmDeletion(eventType, this.printFilterMenu);
        });
    } else {
      let count = 1;
      this.list.forEach(file => {
        console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
        count += 1;
      });
      return this.confirmDeletion(eventType, this.printFilterMenu);
    }
  }

  /**
   * Prompts the user for confirmation if they want those files deleted or return to the main menu
   * and then tries an action based on user input for deletion confirmation event.
   * @param input: user's input that is used to determine the appropriate action to take
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
  confirmDeletion(eventType, caller) {
    let self = this;
    this.rl.question('\nAre you sure you want to delete the items above?\nEnter your choice (Y/N): ', (input) => {
      if (input === 'quit' || input === 'exit') {
        self.leave();
      } else if (this.elapsed === 0 || this.elapsed >= 60) {
        this.resetTimer();
        if (input === 'N' || input === 'n') {
          this.list = []; // Clears the list
          console.log('\nReturning to main menu...\n');
          this.printMainMenu();
        } else if (input !== 'Y' && input !== 'y') {
          this.handleInvalidInput(eventType, caller);
        } else {
          this.deleteFiles();
        }
      }
    });
  }

  /**
   * handleInvalidInput
   * Informs the user that an invalid input was detected and returns to previous menu action.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   */
  handleInvalidInput(eventType, callback) {
    console.log('\nSorry, I could not recognize that input. Please try again.');
    callback(eventType);
  }
}

module.exports = FileSweeper;
