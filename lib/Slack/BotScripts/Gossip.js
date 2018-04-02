'use strict';

class Gossip {

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
