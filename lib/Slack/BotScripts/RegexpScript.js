'use strict';

const Script = require('./Script');

/**
 * Basic implementation
 */
class RegexpScript extends Script {
  constructor(regex, callback_function) {
    super();

    this.regex = regex;
    this.callback_function = callback_function;
  }

  handles(message) {
    const message_text = message.text();
    if (!message_text) {
      return false;
    }
    return null !== message_text.match(this.regex);
  }

  run(message, output) {
    this.callback_function(message, output);
  }
}
module.exports = RegexpScript;
