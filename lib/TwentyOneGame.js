'use strict';

class TwentyOneGame {
  /**
   * Currently it's bound to the channel so we don't archive old games
   */
  constructor(channel_id) {
    this.channel_id = channel_id;
    this.document = null;
  };

  getDatabaseDocumentName() {
    return `twenty_one:${this.channel_id}`
  }

  /**
   * Initializes game state, either loading it from a previous configuration
   * or initializing a new one
   *
   * Returns promise!
   */
  loadGameState() {
    let document_name = this.getDatabaseDocumentName();

    let loadState = function loadState(document) {
      this.document = document;
      return this;
    };
    let loadStateFromDocument = loadState.bind(this);

    let createIfNotExists = function createIfNotExists(document) {
      if (!document) {
        return Document.create({
          name: document_name,
          content: '{}',
          expiry: '2000-01-01 00:00:00',
        });
      }
      return document;
    };

    return Document.findOne({where: {name: document_name}})
      .then(createIfNotExists)
      .then(loadStateFromDocument);
  }

  persistGameState() {
    this.document.save();
  }

  addPlayer(player) {
    this.document.state.num_players += 1;
  }

  isPlayerTurn(player) {
    return false;
  }

}

TwentyOneGame.STATES = {
  new:  1,
  done: 2,
};

TwentyOneGame.TURN = {
  p1: 1,
  p2: 2,
};

module.exports = TwentyOneGame;
