'use strict';

/**
 * Message is a JSON-decoded objects with 7 keys:
 *  - type (usually says "message")
 *  - subtype (not always)
 *  - channel
 *  - user (the user ID)
 *  - text (this is what you care about)
 *  - ts (timestamp with milliseconds)
 *  - source_team
 *  - team
 */
class Message {
  constructor(message) {
    this.message = message; // A slack message structure
  }

  getSubtype() {
    return this.message.subtype || '';
  }

  /**
   * Returns the channel id (e.g. C93472938) from which this message originated
   */
  getChannel() {
    return this.message.channel;
  }

  /**
   * Returns the user id (e.g. U3859723) that originally sent this message
   *
   *
   */
  getUser() {
    return this.message.user;
  }

  /**
   * TRUE when the "message" is actually a user editing an already existing message
   *
   * @returns {boolean}
   */
  isEditMessage() {
    return 'message_changed' === this.getSubtype();
  }

  isDeleteMessage() {
    return 'message_deleted' === this.getSubtype();
  }
  isBotMessage() {
    return 'bot_message' === this.getSubtype() || this.getUser() === 'U6X5J5TDX' || this.getUser() === 'U5YDC4Y21';
  }

  /**
   * Gotta be very very careful. Replies are actually received as two messages; one "normal" looking message
   * in the channel. Then, an additional "message_replied" message event that contains a reference to the
   * message thread. It's pretty stupid.
   *
   * @returns {boolean}
   */
  isReplyMessage() {
    return 'message_replied' === this.getSubtype();
  }

  text() {
    return this.message.text || '';
  }

  operator() {

  }

}
module.exports = Message;
