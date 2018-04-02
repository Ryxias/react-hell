'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class GossipStore {
  constructor(ConnectionManager) {
    this.Gossip = ConnectionManager.get('Gossip');
  }

  findOneRandom() {
    return this.Gossip.find({
      order: [
        Sequelize.fn( 'RAND' ),
      ],
    });
  }

  findThreeRandom() {
    return this.Gossip.findAll({
      order: [
        Sequelize.fn( 'RAND' ),
      ],
      limit: 3,
    });
  }

  findOneLikeText(text) {
    return this.Gossip.findOne({
      where: {
        text: {
          [Op.like]: `%${text}%`,
        }
      }
    });
  }

  addGossip(text) {
    return this.Gossip.create({
      text: text,
    });
  }
}
module.exports = GossipStore;
