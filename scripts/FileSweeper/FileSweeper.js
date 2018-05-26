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

class FileSweeper {
  constructor(Menus, Timer, handleInvalidInput, Fetcher, HttpClient, token) {
    // initialize input listener
    this.rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Class variables
    this.list = []; // Storage
    this.deleteLimit = process.env.NODE_ENV === 'production' ? 50 : 5; // Default: 50 to match API quota
    this.ageLimit = Math.floor(Date.now()/1000) - 5259492; // Up to two months ago in seconds
    this.menus = Menus;
    this.httpClient = HttpClient;
    this.timer = Timer;
    this.handleInvalidInput = handleInvalidInput;
    this.fetchList = Fetcher;
    this.token = token;
  }

  /**
   * Initializes the program.
   */
  start() {
    console.log('\nWelcome to the Slack File Sweeper.\n' +
      '(NOTE: Please keep in mind Slack API quota is 50 requests per minute for file deletions.\n' +
      'Therefore, only 50 files can be displayed and deleted at a time every minute.\n' +
      'Starred/Pinned messages are filtered out as they should be deemed to be important.)\n');
    this.mainMenu();
  }

  /**
   * Exits the program.
   */
  leave() {
    console.log('\nThanks for using Slack File Sweeper! Goodbye!\n');
    process.exit(0);
  }

  /**
   * Prints the available main filtering options for user to use for file deletion.
   * @param eventType: to match the correct filter and action functions required for query and deletion
   */
  mainMenu(eventType = 'mainMenu') {
    console.log(
      '\n~~~~~~~~~~~~~~~~ MAIN MENU ~~~~~~~~~~~~~~~~\n' +
      'Please choose one of the following options.\n' +
      'You may quit anytime by typing "quit" or "exit".\n'
    );
    this.menus[eventType].forEach((item) => {
      console.log(item);
    });
    let self = this;
    this.rl.question('\nChoose one of the options above: ', (input) => {
      if (input === 'quit' || input === 'exit') {
        self.leave();
      } else if (this.timer.elapsed === 0 || this.timer.elapsed >= 60) {
        this.timer.reset();
        switch(input) {
          case '1':
            this.filterMenu('all');
            break;
          case '2':
            this.filterMenu('images');
            break;
          case '3':
            this.filterMenu('videos');
            break;
          default:
            this.handleInvalidInput(eventType, this.mainMenu, this);
        };
      } else {
        console.log('\nAPI Quota has been reached for this minute.\n' +
          'Please wait ' + (60 - this.timer.elapsed) + ' more seconds before trying again.\n');
        this.mainMenu();
      }
    });
  }

  /**
   * Prints a list of the non-starred/pinned files that can be marked for deletion.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @returns this.confirmDeletion(eventType, this.filterMenu).
   */
  filterMenu(eventType) {
    console.log('\nFetching list...\n');
    if (this.list.length === 0) {
      this.fetchList(this, eventType)
        .then(() => {
          return this.confirmDeletion(eventType, this.filterMenu);
        });
    } else {
      let count = 1;
      this.list.forEach(file => {
        console.log(count + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
        count += 1;
      });
      return this.confirmDeletion(eventType, this.filterMenu);
    }
  }

  /**
   * Prompts the user for confirmation if they want those files deleted or return to the main menu
   * and then tries an action based on user input for deletion confirmation event.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @param caller: previous caller function.
   */
  confirmDeletion(eventType, caller) {
    let self = this;
    this.rl.question('\nAre you sure you want to delete the items above?\nEnter your choice (Y/N): ', (input) => {
      if (input === 'quit' || input === 'exit') {
        self.leave();
      } else if (this.timer.elapsed === 0 || this.timer.elapsed >= 60) {
        this.timer.reset();
        if (input === 'N' || input === 'n') {
          this.list = []; // Clears the list
          console.log('\nReturning to main menu...\n');
          this.mainMenu();
        } else if (input !== 'Y' && input !== 'y') {
          this.handleInvalidInput(eventType, caller, this);
        } else {
          this.deleteFiles();
        }
      }
    });
  }

  /**
   * Deletes all of the files on list.
   */
  deleteFiles() {
    let deleteCount = 0;
    this.list.forEach(file => {
      let api_url = `https://slack.com/api/files.delete?token=${this.token}&file=${file.id}`;
      this.httpClient.post(api_url)
        .then(res => {
          deleteCount += 1;
          console.log(`Deleted ${file.name}.`);
          if (deleteCount === this.deleteLimit) {
            console.log('\nAll files in list are now deleted.\n');
            this.list = [];
            this.timer.start();
            return this.mainMenu();
          }
        }).catch(err => console.error(err));
    });
  }
}

module.exports = FileSweeper;
