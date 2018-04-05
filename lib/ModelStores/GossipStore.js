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
            return res.status(404).send({
              success: false,
              message: 'No gossip found',
              system_code: '4000201804040320UEUPEWWQBQWDW',
              id,
            });
          }

          req.gossip = gossip;
          return next();
        })
        .catch(error => {
          return res.status(500).send({
            success: false,
            message: 'Whoops, something went wrong!',
            system_code: '5000201804040320JWIQBNPWDLWDW',
            error,
          });
        });
    };
    return gossipParameterConverter;
  }
}
module.exports = GossipStore;
