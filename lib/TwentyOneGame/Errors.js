'use strict';

/**
 * The base marker class for all Errors thrown by the TwentyOneGame
 */
class GenericError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = {
  GenericError
};
