'use strict';

class MazeGameStore extends require('./BaseStore') {
  constructor(ConnectionManager) {
    super(ConnectionManager, 'MazeGame');
  }

  /**
   * Promisified
   *
   * @param slack_channel {string}
   * @returns {Promise.<MazeGame>}
   */
  findBySlackChannel(slack_channel) {
    return this.MazeGame.findOne({
      where: {
        game_id: `slack-channel:${slack_channel}`,
      },
    });
  }

  createForSlackChannel(slack_channel) {
    return this.MazeGame.create({
      game_id: `slack-channel:${slack_channel}`,
      random_seed: 'aaaaaaaaa',
      data: '{}',
      state: '{}',
      log: '[]',
    });
  }
}
module.exports = MazeGameStore;
