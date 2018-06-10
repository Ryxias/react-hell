'use strict';

const lodash = require('lodash');
const { Op } = require('sequelize');

/**
 * The BaseStore is an abstract store. It is intended to enforce conventions around the structure
 * of our Model Stores
 */
class BaseStore {
  constructor(ConnectionManager, model_name) {
    this.model_name = model_name;
    this[this.model_name] = ConnectionManager.get(model_name);
  }

  create(params) {
    return this.getModel().create(params);
  }

  build(params) {
    return this.getModel().build(params);
  }

  findById(params) {
    return this.getModel().findById(params);
  }

  // Get by a list of ids.  Keep the order of the returned objects preserved.
  findByIds(ids) {
    if (!ids || ids.length <= 0) {
      return Promise.resolve([]);
    }
    return this.getModel().findAll({
      where: {
        id: {
          [Op.in]: ids,
        }
      }
    }).then(objs => {
      return lodash.sortBy(objs, [(obj) => {
        return ids.indexOf(obj.id);
      }]);
    });
  }

  getModel() {
    return this[this.model_name];
  }
}

module.exports = BaseStore;
