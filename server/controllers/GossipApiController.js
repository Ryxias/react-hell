'use strict';

const { Controller } = require('express-route-registry');

class GossipApiController extends Controller {

  /**
   * Gets all gossips with no filter, paginated by "page" and "page_size"
   */
  index_action(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const page_size = parseInt(req.query.page_size) || 20;

    const getGossips = this.get('GossipStore').findAllPaginated(page, page_size);
    const getCount = this.get('GossipStore').getCount();

    return Promise.all([ getGossips, getCount ])
      .spread((gossips, count) => {
        const result = {
          success: true,
          message: 'Found the gossips',
          system_code: '2000201804040316POIUYTEFVBNJD',
          page,
          page_size,
          page_count: Math.ceil(count / page_size),
          items: [],
        };

        gossips.forEach(gossip => {
          result.items.push(gossip.publish());
        });

        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send({
          success: false,
          message: 'Whoops, something went wrong!',
          system_code: '5000201804040314PIQWDYEWDB',
          error,
        });
      });
  }

  /**
   * Get a single gossip
   */
  get_single_gossip_action(req, res, next) {
    const gossip = req.gossip;

    return res.status(200).send({
      success: true,
      message: 'Gossip found',
      system_code: '2000201804040318IBWQPNWDW',
      gossip: gossip.publish(),
    });
  }

  /**
   * Modify a single gossip's text
   */
  edit_single_gossip_action(req, res, next) {
    const gossip = req.gossip;

    const new_text = req.body.text;
    const old_text = gossip.text;

    gossip.text = new_text;
    return gossip.save()
      .then(g => g.reload())
      .then(gossip => {
        return res.status(200).send({
          success: true,
          message: 'Gossip changed',
          system_code: '2000201804040323QLQLWOWFBQPXMZMZMZ',
          old_text,
          new_text,
          gossip: gossip.publish(),
        });
      })
      .catch(error => {
        return res.status(500).send({
          success: false,
          message: 'Whoops, something went wrong!',
          system_code: '5000201804040323WWFQPWLLWALAWBWBWB',
          error,
        });
      });
  }

  /**
   * Delete a single gossip
   */
  delete_single_gossip_action(req, res, next) {
    const gossip = req.gossip;
    const id = gossip.id;

    return gossip.destroy()
      .then(() => {
        return res.status(200).send({
          success: true,
          message: 'Gossip successfully deleted',
          system_code: '2000201804040336PLWLBUUGIRIRIRR',
          id,
        });
      })
      .catch(error => {
        return res.status(500).send({
          success: false,
          message: 'Whoops, something went wrong!',
          system_code: '5000201804040338YRTWVQWDWDWOUH',
          error,
        });
      });
  }

  /**
   * This is middleware, not a route action
   */
  requiresGossipMiddleware() {
    const requiresGossipMiddleware = (req, res, next) => {
      if (!req.gossip) {
        return res.status(404).send({
          success: false,
          message: 'No gossip found',
          system_code: '4000201804040320UEUPEWWQBQWDW',
          id: req.params.gossip_id,
        });
      }
      next();
    };
    return requiresGossipMiddleware;
  }
}
module.exports = GossipApiController;
