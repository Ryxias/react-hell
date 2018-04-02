'use strict';

class GossipStore {
  constructor(ConnectionManager) {
    this.Gossip = ConnectionManager.get('Gossip');
  }

  getThreeRandom() {
    return this.Gossip.findAll({
      order: [

      ],
      limit: 3,
    });
  }

  addGossip(text) {
    return this.Gossip.create({
      text: text,
    });
  }
}
module.exports = GossipStore;
