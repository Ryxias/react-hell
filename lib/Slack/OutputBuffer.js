'use strict';

class OutputBuffer {
  constructor(sendMessage, original_message) {
    this.sendMessage = sendMessage;
    this.original_message = original_message;
  }

  /**
   * Constructs a string that @ mentions the user with the given user id
   */
  at(user_id) {
    return `<@${user_id}>`;
  }

  /**
   * Sends message to the channel from which the message originated from
   */
  reply(text) {
    return this.message(text, this.original_message.getChannel());
  }

  /**
   *
   */
  message(text, channel_id) {
    return this.sendMessage(text, channel_id)
  }

}
module.exports = OutputBuffer;
