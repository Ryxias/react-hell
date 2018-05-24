'use strict';

const Script = require('./Script');

/**
 * The bot simply replies to all messages with the same text (he mimics you)
 */
class MimicScript extends Script {
  constructor() {
    super();
  }

  handles(message) {
    return true;
  }

  run(message, output) {
    return output.reply(message.text());
  }
}
module.exports = MimicScript;
