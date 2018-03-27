'use strict';

class GenericGameStateStore {
  constructor(ConnectionManager) {
    this.GenericGameState = ConnectionManager.get('GenericGameState');
  }

  findGenericGameStateById(id) {

  }
}
module.exports = GenericGameStateStore;
