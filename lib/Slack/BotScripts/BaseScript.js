'use strict';

const Script = require('./Script');

class BaseScript extends Script {
  constructor(user_id) {
    super();

    this.user_id = user_id;
  }

  handles(message) {
    let message_text = message.text();

    pp('----------');
    pp(message_text);
    pp(`<@${this.user_id}> ARE YOU THERE?`);

    return message_text.toUpperCase() === `<@${this.user_id}> ARE YOU THERE?`;
  }

  run(message, output) {
    output.reply(`Hello ${output.at(message.getUser())} I am here!`);
  }
}
module.exports = BaseScript;
