'use strict';

const Script = require('./Script');

class BaseScript extends Script {
  constructor(user_id) {
    super();

    this.user_id = user_id;
  }

  handles(message) {
    let message_text = message.text();

    return message_text.toUpperCase().startsWith(`HEY <@${this.user_id}>`);
  }

  run(message, output) {
    output.reply(`Hello ${output.at(message.getUser())}!`);
  }
}
module.exports = BaseScript;
