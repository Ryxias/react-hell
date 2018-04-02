'use strict';

const Script = require('./Script');

class Gossip extends Script {

  handles(message) {
    if (message.text().startsWith('!gossip')) {
      return true;
    }
    return false;
  }

  run(message, send) {
    send(JSON.stringify(message));
  }

}

module.exports = Gossip;
