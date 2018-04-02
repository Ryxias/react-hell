'use strict';

const Script = require('./Script');

class Gossip extends Script {
  constructor(GossipStore) {
    super();
    this.GossipStore = GossipStore;
  }

  handles(message) {
    return message.text().startsWith('!gossip');
  }

  run(message, output) {
    const message_text = message.text();

    const tokens = message_text.split(' ');
    const gossip = tokens.shift();
    const operator = tokens.shift();
    const operands = tokens.join(' ');

    if (!operator) {
      // Get random 1 mode
      return this.GossipStore.findOneRandom()
        .then(gossip => {
          output.reply(gossip.text);
        });
    }
    else {
      switch (operator.toLowerCase()) {
        case 'add':
          return this.GossipStore.addGossip(operands)
            .then(gossip => {
              output.reply('Gossip added');
            });
          break;
        case 'haiku':
          return this.GossipStore.findThreeRandom()
            .then(three_gossips => {
              const delimiter = "\n";
              const haiku = three_gossips
                .map(gossip => gossip.text)
                .reduce((acc, cur) => acc + delimiter + cur, '');

              output.reply(haiku);
            });
          break;
        case 'find':
          return this.GossipStore.findOneLikeText(operands)
            .then(gossip => {
              output.reply(gossip.text);
            });
          break;
        default:

      }
    }
  }

}

module.exports = Gossip;
