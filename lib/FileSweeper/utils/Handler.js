'use strict';

class Handler {
  constructor() {
  }

  /**
   * Informs the user that an invalid input was detected and returns to previous menu action.
   * @param eventType: used to route to the appropriate method and print the appropriate messages to the user.
   * @callback: callback function to execute after printing error.
   */
  invalidInput(eventType, callback, context) {
    console.log('\nSorry, I could not recognize that input. Please try again.\n');
    callback.call(context, eventType);
  }
}

module.exports = Handler;
