'use strict';

const Game = require('./Game');

class SlackConnector {

  static connect(channel_id, send) {
    return new Game('slack', channel_id, send);
  }

}

module.exports = SlackConnector;
