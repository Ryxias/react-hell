'use strict';

/**
 * Abstract class
 */
class Script {
  constructor() {
    if (new.target === Script) {
      throw new Error('Do not instantiate this abstract class directly!');
    }
  }

  /**
   * Return TRUE if the given message object is handled. FALSE otherwise.
   *
   * @param message
   */
  handles(message) {
    throw new Error('Not implemented');
  }

  /**
   * This method is executed on messages where handles() returns TRUE.
   * The output argument is an instance of the OutputBuffer, and is intended for the code
   * to use to send replies.
   *
   * @return void
   */
  run(message, output) {
    throw new Error('Not implemented');
  }

}
module.exports = Script;
