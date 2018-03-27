'use strict';

/**
 *  Base exception for our system
 *
 *  The idea behind the system_code is every throw call in our application that uses this BaseError should have
 *  a unique system_code. This makes it very easy to identify where exceptions from, especially in situations
 *  where an exception has the same error code or error message as a bunch of other throw locations.
 */
class BaseError extends Error {
  constructor(message, system_code = 'Unspecified') {
    super(message);

    this.system_code = system_code;
  }

  getSystemCode() {
    return this.system_code;
  }
}

module.exports = BaseError;
