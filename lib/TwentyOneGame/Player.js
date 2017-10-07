'use strict';

const Output = require('./Output');

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
      this.output.send(err.message);
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
      .then(() => {
        this.output.send(`Player <@${this.player_id}> joined!`);
      })
      .catch(this.error_handler);
  }

  leaveGame() {
    return this.engine.removePlayer(this)
      .then(() => {
        this.output.send(`Player <@${this.player_id}> left!`);
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
        this.output.send(`The game has begun!`);
        return initial_game_state;
      })
      .catch(this.error_handler);
  }

  whoami() {
    this.output.send(`You're player ${this.player_id}, <@${this.player_id}>!`);
  }

  /**
   * @returns {Promise}
   */
  whosTurn() {
    return this.engine.whosTurn()
      .then(player_id => {
        if (this.getId() === player_id) {
          this.output.send('Your turn!');
        } else {
          this.output.send(`Player <@${player_id}>'s turn`);
        }
      })
      .catch(this.error_handler);
  }

  /**
   * FIXME I'm definitely going to regret the fucking fact this is not promisified
   * - Derek 2017-09-30
   */
  whosPlaying() {
    this.output.send(`Players are: [<@${this.engine.getPlayerIds().join('>,<@')}>]`);
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
    //FIXME this is just extracting shit because proof of concept
    let game_state = this.engine.game_state;

    let player_ids = this.engine.getPlayerIds();
    let first_player = this.getId();
    let rest_players = [];
    player_ids.forEach(player_id => {
      if (this.getId() === player_id) {
        // Do nothing
      } else {
        rest_players.push(player_id);
      }
    });

    const renderPlayer = function (player_id, cards) {
      let string = '';
      cards.forEach(card => {
        if (card.hidden && !show_hidden) {
          string += '[?]';
        } else {
          string += `[${card.card}]`;
        }
      });
      return `
Player <@${player_id}>
  
  ${string}

`
    };

    let player_info_strings = '';
    player_info_strings += renderPlayer(first_player, game_state.getPlayerHand(first_player));
    rest_players.forEach(player_id => {
      player_info_strings += renderPlayer(player_id, game_state.getPlayerHand(first_player));
    });
    let deck_string = 'Deck: ' + '[ ]'.repeat(game_state.getDeck().length);

    this.output.send(
`
\`\`\`
-- Game Info --
${player_info_strings}

${deck_string}
\`\`\`
`
    );
  }

  hit() {
    return this.isMyTurn()
      .then(my_turn => {
        if (!my_turn) {
          this.output.send('It is not your turn!');
          return Promise.reject('It is not your turn! [0041QSIPCJWQ]');
        }
        return this.engine.playerHit(this);
      })
      .then(card => {
        this.output.send(`You drew a ${card}!`);
      })
      .delay(500)
      .then(() => {
        this.output.send(`End of your turn`);
      })
      .delay(500)
      .then(() => this.whosTurn());
  }

  /**
   * @returns {Promise}
   *
   * Returns TRUE if the game is over.  FALSE otherwise.
   */
  stay() {
    return this.isMyTurn()
      .then(my_turn => {
        if (!my_turn) {
          this.output.send('It is not your turn!');
          return Promise.reject('It is not your turn! [0041QSIPCJWQ]');
        }
        return this.engine.playerStay(this);
      })
      .then(() => {
        this.output.send('You stay');
      })
      .delay(500)
      .then(() => {
        if (!this.engine.isGameOver()) {
          return this.whosTurn()
        }
      })
      .then(() => {
        return this.engine.isGameOver();
      });
  }

  myCards() {
    let my_hand = this.engine.playerGetHand(this.getId());

    let cards_string = '';
    my_hand.forEach(card => {
      if (card.hidden) {
        cards_string += `_*[${card.card}]*_`;
      } else {
        cards_string += `[${card.card}]`;
      }
    });

    this.output.privateSend(
`
Your cards: ${cards_string}
`
    );
  }

  getOpponentCards() {

  }

  getPowerWords() {

  }

  playPowerWord(power_word) {

  }
}

module.exports = Player;
