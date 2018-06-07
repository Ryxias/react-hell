'use strict';

class HangmanGameStore extends require('./BaseStore') {
  constructor(ConnectionManager) {
    super(ConnectionManager, 'HangmanGame');
  }

  /**
   * Promisified
   *
   * @param slack_channel {string}
   * @returns {Promise.<HangmanGame>}
   */
  findBySlackChannel(slack_channel) {
    return this.HangmanGame.findOne({
      where: {
        game_id: `slack-channel:${slack_channel}`,
      },
    });
  }

  createForSlackChannel(slack_channel) {
    return this.HangmanGame.create({
      game_id: `slack-channel:${slack_channel}`,
      phrase: 'default',
      guesses: '',
      active: false,
    });
  }
}
module.exports = HangmanGameStore;
