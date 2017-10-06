'use strict';

const Player = require('./Player');

const POWER_WORD_CARD = 'P';
const CARD_VALUE_HIDDEN = '?';

/**
 * This class contains all of the logic and state of the game
 */
class Engine {
  constructor(context, context_id) {
    // One game per channel
    this.key = `21-game-${context}-${context_id}`;

    this.model = null;
    this.model_data = {};
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
          this.model_data = JSON.parse(this.model.state) || {};
        } else {
          this.model_data = {
            key: this.key,
            player_data: {},
            deck: [],
            game_started: false,
          };

          return GenericGameState.create(
            {
              name: this.key,
              state: JSON.stringify(this.model_data),
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
    if (!this.model_data.player_data) {
      return [];
    }
    return Object.keys(this.model_data.player_data);
  }

  getPlayer(player_id) {
    if (this.model_data.player_data && this.model_data.player_data[player_id]) {
      return Promise.resolve(new Player(player_id, this));
    }
    return Promise.reject(new Error(`You are not part of this game! The players are: [${this.getPlayerIds()}] [0007JPWQJD]`));
  }

  startGame() {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0004WQPWHFEW]'));
    }

    this.model_data.game_started = true;

    // FIXME
    // Shuffle the deck
    this.model_data.deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.deckShuffle();

    // select first player
    let players = this.getPlayerIds();
    this.model_data.player_turn = players[Math.floor(Math.random() * 2)];
    this.model_data.player_acted = {};
    players.forEach(id => {
      // Ensure all players get one turn at least
      this.model_data.player_acted[id] = true;
    });

    // Deal cards
    let deal = this.dealInitialCards();

    return this.saveGame()
      .then(() => {
        return {
          players: this.getPlayerIds(),
          deck_count: this.model_data.deck.length,
          deal: deal,
        };
      });
  }

  /**
   * Deals cards to each player; 1 face down and 1 face up.  Also converts
   * any power words drawn.  Alters the players' hand states, and then
   * returns all cards drawn in the order they were drawn and to which
   * player they were dealt.
   */
  dealInitialCards() {
    // Assertion: There are few enough players such that the entire deck is
    // not dealt away on turn 0...

    let player_ids = this.getPlayerIds();
    let deal = [];

    // Deal cards for all players, one face up and one hidden
    player_ids.forEach(player_id => {
      let card = this.dealPlayerCard(player_id, true);
      deal.push(card);
      card = this.dealPlayerCard(player_id, false);
      deal.push(card);
    });

    return deal;
  }

  /**
   * Does not promise; also does not save the game!
   */
  dealPlayerCard(player_id, hidden = false) {
    let card = this.deckNextCard();

    // FIXME fuck power words
    if (false && POWER_WORD_CARD === card) {
      // Assumes only one power word per deck
      this.model_data.player_data[player_id].power_words = this.model_data.player_data[player_id].power_words || [];
      this.model_data.player_data[player_id].power_words.push(
        {
          word: '???',
        }
      );
    }

    // Add the card to the player's hand
    this.model_data.player_data[player_id].hand = this.model_data.player_data[player_id].hand || [];
    this.model_data.player_data[player_id].hand.push(
      {
        card: card,
        hidden: hidden,
      }
    );

    return {
      card: card,
      hidden: hidden,
    }
  }

  /**
   * @returns {boolean}
   */
  isGameOver() {
    return this.model_data.game_over;
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
    return this.playerAction(player)
      .then(() => {
        let card = this.dealPlayerCard(player.getId());
        this.nextPlayerTurn(player);
        return [card, this.saveGame()];
      })
      .spread((card, none) => card);
  }

  /**
   * Promise
   *
   * End's the player's turn with no draw.  Returns the id of the next player.
   */
  playerStay(player) {
    let next_player_id = this.nextPlayerTurn(player);
    return this.saveGame()
      .then(() => {
        return next_player_id;
      });
  }

  /**
   * Synchronous
   */
  playerGetHand(player_id) {
    return this.model_data.player_data[player_id].hand;
  }

  /**
   * Does not promise; also does not save the game!
   */
  nextPlayerTurn(player) {
    if (player.getId() !== this.model_data.player_turn) {
      throw new Error('It is not your turn!');
    }

    // Check if everybody has done nothing, if so mark the game as over
    // So the client can stop rendering stuff
    let ended = true;
    this.getPlayerIds().forEach(player_id => {
      if (this.model_data.player_acted[player_id]) {
        ended = false;
      }
    });
    if (ended) {
      this.model_data.game_over = true;
    }

    //
    let current_player = player.getId();
    let player_ids = this.getPlayerIds();
    let index_of = player_ids.indexOf(current_player);
    if (index_of >= player_ids.length - 1) {
      index_of = 0;
    } else {
      // DAVID SAVE ME WTFFF
      index_of += 1;
    }

    // Move to the next player, and then set their "player acted" state to false
    // and change it to true if they decide to do something
    let next_player_id = player_ids[index_of];
    this.model_data.player_turn = next_player_id;
    this.model_data.player_acted[next_player_id] = false;

    return next_player_id;
  }

  /**
   * Promise.  Doesn't actually have to do be but it's nice for syntactic sugar
   *
   * Sets the player action to true for this turn
   */
  playerAction(player) {
    if (player.getId() !== this.model_data.player_turn) {
      return Promise.reject(new Error('It is not your turn!'));
    }
    this.model_data.player_acted[player.getId()] = true;
    return Promise.resolve(this);
  }

  /**
   * Returns the top card of the deck and then removes it from the deck.
   * Returns undefined if no cards left in the deck.
   */
  deckNextCard() {
    return this.model_data.deck.shift();
  }

  deckShuffle() {
    let pivot, swap1, swap2;
    for (swap2 = this.model_data.deck.length; swap2; swap2--) {
      pivot = Math.floor(Math.random() * swap2);
      swap1 = this.model_data.deck[swap2-1];
      this.model_data.deck[swap2-1] = this.model_data.deck[pivot];
      this.model_data.deck[pivot] = swap1;
    }
  }

  /**
   * @returns {Promise}
   */
  whosTurn() {
    if (!this.model_data.game_started) {
      return Promise.reject(new Error('The game has not yet started [0001ABFEURQWJ]'));
    }
    return Promise.resolve(this.model_data.player_turn);
  }

  addPlayer(player) {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0017PMQCNWPW]'));
    }
    this.model_data.player_data = this.model_data.player_data || {};
    this.model_data.player_data[player.getId()] = {
      player_id: player.getId(),
    };

    return this.saveGame().then(() => player);
  }

  removePlayer(player) {
    if (this.model_data.game_started) {
      return Promise.reject(new Error('The game has already started... [0022QOQSMMPS]'));
    }
    this.model_data.player_data[player.getId()] = undefined;

    return this.saveGame();
  }

  /**
   * Promise
   *
   * Pushes this.model_data and this.model to the database
   */
  saveGame() {
    this.model.state = JSON.stringify(this.model_data);
    return this.model.save();
  }
}

module.exports = Engine;
