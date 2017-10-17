'use strict';

const Player = require('./Player');
const GameState = require('./GameState');
const { ActionTypes, EventTypes } = require('./EventTypes');
const {
  gameStartAction,
  playerJoinAction,
  playerLeaveAction,
  playerHitAction,
  playerStayAction,
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
  gameResults() {
    if (this.isGameOver()) {
      let goal = 21; // FIXME later we fetch this from the model_state
      let winner = '?';
      let tie = false;
      let player_totals = {};
      let player_busts = {};
      this.getPlayerIds().forEach(player_id => {
        let hand = this.playerGetHand(player_id);
        let total = 0;
        hand.forEach(card => {
          total += card.card;
        });
        player_totals[player_id] = total;
        player_busts[player_id] = total > goal;
      });

      let winning_amount = -1;
      this.getPlayerIds().forEach(player_id => {
        if (!player_busts[player_id]) {
          if (player_totals[player_id] > winning_amount) {
            winning_amount = player_totals[player_id];
            winner = player_id;
            tie = false;
          } else if (player_totals[player_id] === winning_amount) {
            winner = null;
            tie = true;
          }
        }
      });

      return {
        goal: goal,
        winner: winner,
        tie: tie,
        player_totals: player_totals,
      };
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
    let events = this.game_state.dispatch(playerHitAction(player.getId()));

    let card = undefined;
    events.forEach(event => {
      if (event.type === EventTypes.receive_card) {
        card = event.card;
      }
    });

    return this.saveGame().then(() => card);
  }

  /**
   * Promise
   *
   * End's the player's turn with no draw.  Returns the id of the next player.
   */
  playerStay(player) {
    this.game_state.dispatch(playerStayAction(player.getId()));

    let next_player_id = 'TBD?';
    return this.saveGame()
      .then(() => {
        return next_player_id;
      });
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
