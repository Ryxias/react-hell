'use strict';

const Output = require('./Output');
const { EventTypes } = require('./EventTypes');

/**
 * An encapsulation of Actors in the game that can connectGame to the gamestate.
 *
 * Players should not contain any logic and should only tap into the game engine.
 */
class Player {
  constructor(player_id, engine, output = null) {
    this.player_id = player_id;
    this.engine = engine;
    this.output = output || new Output();

    this.error_handler = (function(err) {
      this.output.sendError(err);
    }).bind(this);
  }

  setOutput(output) {
    this.output = output;
  }

  getId() {
    return this.player_id;
  }

  joinGame() {
    return this.engine.addPlayer(this)
      .then(() => this.output.notifyPlayerJoined(this.player_id))
      .catch(this.error_handler);
  }

  leaveGame() {
    return this.engine.removePlayer(this)
      .then(() => {
        this.output.notifyPlayerLeft(this.player_id);
      })
      .catch(this.error_handler);
  }

  kickPlayer(player_id) {
    // FIXME
  }

  /**
   * @returns {Promise}
   *
   * Returns a complex data structure representing the initial state of the game
   * after the first hand is dealt.
   */
  startGame() {
    return this.engine.startGame()
      .then(initial_game_state => {
        let hands = getPlayerHands(this.engine);
        let deck = this.engine.game_state.getDeck();
        this.output.notifyGameBegin(hands, deck);
      })
      .catch(this.error_handler);
  }

  whoami() {
    this.output.notifyWhoAmI(this.player_id);
  }

  /**
   * @returns {Promise}
   */
  whosTurn() {
    return this.engine.whosTurn()
      .then(player_id => {
        if (this.getId() === player_id) {
          this.output.notifyYourTurn();
        } else {
          this.output.notifyPlayersTurn(player_id);
        }
      })
      .catch(this.error_handler);
  }

  /**
   * FIXME I'm definitely going to regret the fucking fact this is not promisified
   * - Derek 2017-09-30
   */
  whosPlaying() {
    this.output.displayPlayers(this.engine.getPlayerIds());
  }

  /**
   * @returns {Promise}
   */
  isMyTurn() {
    return this.engine.whosTurn()
      .then(player_id => {
        return this.getId() === player_id;
      })
  }

  /**
   * Not promisified
   */
  gameInfo(show_hidden = false) {
    let game_state = this.engine.game_state;
    let player_hands = getPlayerHands(this.engine, this.getId());

    return this.output.renderGameInfo(
      player_hands,
      game_state.getDeck(),
      show_hidden
    );
  }

  hit() {
    return this.engine.playerHit(this)
      .then(events => {
        let card = undefined;
        events.forEach(event => {
          if (event.type === EventTypes.receive_card) {
            card = event.card;
          }
        });
        return [card, this.engine.whosTurn()]
      })
      .spread((card, next_player_turn) => {
        return this.output.notifyDrawThenMoveToNextTurn(card, next_player_turn);
      })
      .catch(this.error_handler);
  }

  /**
   * @returns {Promise}
   *
   * Returns TRUE if the game is over.  FALSE otherwise.
   */
  stay() {
    return this.engine.playerStay(this)
      .then(events => this.engine.whosTurn())
      .then(next_player_turn => {
        if (this.engine.game_state.isRoundOver()) {
          const round_results = this.engine.roundResults();
          const deck = this.engine.game_state.getDeck();
          const player_hands = getPlayerHands(this.engine, round_results.winner);

          return this.output.notifyStayThenRoundIsOver(round_results, player_hands, deck)
        } else {
          return this.output.notifyStayThenMoveToNextTurn(next_player_turn);
        }
      })
      .then(() => {
        if (this.engine.game_state.isGameOver()) {
          const game_results = this.engine.gameResults();
          return this.output.notifyStayThenGameIsOver(game_results);
        }
      })
      .catch(this.error_handler);
  }

  myCards() {
    let my_hand = this.engine.playerGetHand(this.getId());
    this.output.privateSendHand(my_hand);
  }

  nextRound() {
    this.engine.nextRound()
      .then(() => {
        let hands = getPlayerHands(this.engine);
        let deck = this.engine.game_state.getDeck();
        return this.output.notifyNextRound(hands, deck);
      })
      .catch(this.error_handler);
  }
}

function getPlayerHands(engine, first_player = null) {
  let game_state = engine.game_state;

  let player_ids = engine.getPlayerIds();
  let rest_players = [];
  player_ids.forEach(player_id => {
    if (first_player === player_id) {
      // Do nothing
    } else {
      rest_players.push(player_id);
    }
  });

  let player_hands = {};
  if (first_player) {
    player_hands[first_player] = game_state.getPlayerHand(first_player);
  }
  rest_players.forEach(player_id => {
    player_hands[player_id] = game_state.getPlayerHand(player_id);
  });

  return player_hands;
}

module.exports = Player;
