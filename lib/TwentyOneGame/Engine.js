'use strict';

const Player = require('./Player');
const GameState = require('./GameState');
const { GenericError } = require('./Errors');
const { EventTypes } = require('./EventTypes');
const {
  gameStartAction,
  playerJoinAction,
  playerLeaveAction,
  playerHitAction,
  playerStayAction,
  startNextRoundAction,
} = require('./Actions');

/**
 * This class contains all of the logic and state of the game
 */
class Engine {
  constructor(context, context_id) {
    // One game per channel
    this.key = `21-game-${context}-${context_id}`;

    this.model = null;
    this.game_state = null;
  }

  /**
   * Promise
   *
   * Populates this.model and this.model_data properly
   */
  load() {
    return GenericGameState.findOne({ where: { name: this.key } })
      .then(model => {
        if (model) {
          this.model = model;

          this.game_state = new GameState();
          this.game_state.unserialize(this.model.state);
        } else {
          this.game_state = new GameState();

          return GenericGameState.create(
            {
              name: this.key,
              state: this.game_state.serialize(),
            }
          )
            .then(model => {
              this.model = model;
            });
        }

        return null;
      })
      .then(() => this); // Return the engine's self
  }

  getPlayerIds() {
    return this.game_state.getPlayerIds();
  }

  getPlayer(player_id) {
    if (this.game_state.playerExists(player_id)) {
      return Promise.resolve(new Player(player_id, this));
    }
    return Promise.reject(new Error(`You are not part of this game! The players are: [${this.game_state.getPlayerIds()}] [0007JPWQJD]`));
  }

  startGame() {
    if (this.game_state.isGameStarted()) {
      return Promise.reject(new Error('The game has already started... [0004WQPWHFEW]'));
    }

    let events = this.game_state.dispatch(gameStartAction());

    let deal = [];
    events.forEach(event => {
      if (event.type === EventTypes.receive_card) {
        deal.push(event); // FIXME i guess...?
      }
    });

    return this.saveGame()
      .then(() => {
        return {
          players: this.getPlayerIds(),
          deck_count: this.game_state.getDeck().length,
          deal: deal, // FIXME figure out the deal from the events fired
        };
      });
  }

  /**
   * Does not promise; also does not save the game!
   */
  dealPlayerCard(player_id, hidden = false) {
    // Not quite but basically the same idea..
    this.game_state.dispatch(playerHitAction(player_id));

    return {
      card: card,
      hidden: hidden,
    }
  }

  /**
   * @returns {boolean}
   */
  isGameOver() {
    return this.game_state.isGameOver();
  }

  /**
   *
   */
  roundResults() {
    if (this.game_state.isRoundOver()) {
      // The game state should have a "resolution" event, which we can simply
      // extract and return as a summary of results.  This is PROBABLY the last
      // element in the events
      let event = this.game_state.events[this.game_state.events.length - 1];
      if (EventTypes.round_resolution !== event.type) {
        // try again
        event = this.game_state.events[this.game_state.events.length - 2];

        if (EventTypes.round_resolution !== event.type) {
          throw new Error('Unrecognized resolution event at end of round [0109IIEOWPLQQ]');
        }
      }

      return event;
    }

    return false;
  }

  gameResults() {
    if (this.game_state.isGameOver()) {
      // The game state should have a "resolution" event, which we can simply
      // extract and return as a summary of results.  This is PROBABLY the last
      // element in the events
      const event = this.game_state.events[this.game_state.events.length - 1];

      if (EventTypes.game_ended !== event.type) {
        throw new Error('Unrecognized resolution event at end of game [0107YQPFJEI]');
      }

      return event;
    }

    return false;
  }

  /**
   * Promise
   *
   * Hits a card for the player then saves the game.  Returns the card that they
   * just drew.  End's the player's turn
   */
  playerHit(player) {
    if (!this.game_state.isPlayerTurn(player.getId())) {
      return Promise.reject(new Error('It is not your turn [0041QSIPCJWQ]'));
    }

    const events = this.game_state.dispatch(playerHitAction(player.getId()));

    return this.saveGame().then(() => events);
  }

  /**
   * Promise
   *
   * End's the player's turn with no draw.  Returns the id of the next player.
   */
  playerStay(player) {
    if (!this.game_state.isPlayerTurn(player.getId())) {
      return Promise.reject(new Error('It is not your turn [0101QJCPAMAPM]'));
    }

    const events = this.game_state.dispatch(playerStayAction(player.getId()));

    return this.saveGame().then(() => events);
  }

  /**
   * Synchronous
   */
  playerGetHand(player_id) {
    return this.game_state.getPlayerHand(player_id);
  }

  /**
   * @returns {Promise}
   */
  whosTurn() {
    if (!this.game_state.isGameStarted()) {
      return Promise.reject(new Error('The game has not yet started [0001ABFEURQWJ]'));
    }
    return Promise.resolve(this.game_state.whosTurn());
  }

  addPlayer(player) {
    if (this.game_state.isGameStarted()) {
      return Promise.reject(new Error('The game has already started... [0017PMQCNWPW]'));
    }

    this.game_state.dispatch(playerJoinAction(player.getId()));

    return this.saveGame().then(() => player);
  }

  removePlayer(player) {
    if (this.game_state.isGameStarted()) {
      return Promise.reject(new Error('The game has already started... [0022QOQSMMPS]'));
    }

    this.game_state.dispatch(playerLeaveAction(player.getId()));

    return this.saveGame();
  }

  nextRound() {
    if (this.game_state.isGameStarted()) {
      return Promise.reject(new Error('The game has not yet started [0087ABCEHOEF]'));
    }
    if (!this.game_state.isRoundOver()) {
      return Promise.reject(new Error(`The round hasn't ended yet [0089PQOWELSKW]`));
    }

    this.game_state.dispatch(startNextRoundAction());

    return this.saveGame();
  }

  /**
   * Promise
   *
   * Pushes this.model_data and this.model to the database
   */
  saveGame() {
    this.model.state = this.game_state.serialize();
    return this.model.save();
  }
}

module.exports = Engine;
