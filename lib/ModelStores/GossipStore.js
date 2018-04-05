'use strict';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class GossipStore {
  constructor(ConnectionManager) {
    this.Gossip = ConnectionManager.get('Gossip');
  }

  findById(id) {
    if (!id) {
      throw new Error('Missing id');
    }
    return this.Gossip.findById(id);
  }

  getCount() {
    return this.Gossip.count();
  }

  /**
   * NOTE: page_number is 1-indexed (human readable) NOT ZERO INDEXED
   */
  findAllPaginated(page_number, page_size) {
    const offset = (page_number - 1) * page_size;
    const limit = page_size;

    return this.Gossip.findAll({
      offset,
      limit,
      order: [ [ 'id', 'ASC' ]],
    });
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

  parameterConverter() {
    const gossipParameterConverter = (req, res, next, id) => {
      return this.findById(id)
        .then(gossip => {
          if (!gossip) {
            // Can be missing!!
          }
          req.gossip = gossip;
          return next();
        })
        .catch(error => next(error));
    };
    return gossipParameterConverter;
  }
}
module.exports = GossipStore;
