'use strict';

/**
 * FIXME this isn't really an "output" nor a "buffer" but acts more like a "SlackReplyContext" kind of thing.
 * It contains an interface of convenience methods used by the Scripts to respond to incoming messages.
 */
class OutputBuffer {
  /**
   * sendMessage must be a function that accepts 2 arguments; the full message text and the channel_id/conversation_id
   */
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
   * Promifised
   *
   * Sends message to the channel from which the message originated from
   */
  reply(text) {
    return this.message(text, this.original_message.getChannel());
  }

  /**
   * Promifised
   */
  message(text, channel_id) {
    return this.sendMessage(text, channel_id)
  }

}
module.exports = OutputBuffer;
