'use strict';

const { ActionTypes } = require('./EventTypes');
const {
  gameEndedEvent,
  gameInitializedEvent,
  playerReceiveCard,
  roundResolutionEvent,
} = require('./Events');

/**
 * This reducer does nothing more than record all actions that occur
 * mostly for debugging purposes
 */
function actionRecordingReducer(game_state, action) {
  game_state.events.push(action);
}

/**
 * This reducer fires during game starting events
 */
function gameInitializationReducer(game_state, action) {
  switch (action.type) {
    case ActionTypes.start_game:
      if (game_state.game_started) {
        // Nothing
        return;
      }
      game_state.game_started = true;
      game_state.game_over = false;
      game_state.deck = shuffle([1,2,3,4,5,6,7,8,9,10,11]);

      let players = game_state.getPlayerIds();
      game_state.player_turn = players[Math.floor(Math.random() * 2)];

      // Player acted... ok so bear with me
      //   We detect when a player has done something during their turn.  We assume
      //   they do nothing until they do something.  If they stay, we simply keep the
      //   value at "did nothing" (false).  When all players do nothing (false) then
      //   we know that the game is over.  This is because players can wage war with
      //   power words.
      //
      //   To ensure that everybody gets a turn in the beginning, we set all values
      //   to true.  For the first player up to bat, we set their value to false,
      //   in the case they pass.
      //
      //   Whenever a player turn shifts, we change the acted value of that player to
      //   false, again assuming they-do-nothing-until-they-do-something.
      game_state.player_acted = {};
      players.forEach(id => game_state.player_acted[id] = true);
      game_state.player_acted[game_state.player_turn] = false;

      players.forEach(id => {
        dealPlayerCard(game_state, id, true);
        dealPlayerCard(game_state, id, false);
      });

      game_state.triggerEvent(gameInitializedEvent());

      break;
  }

  function shuffle(deck) {
    let pivot, swap1, swap2;
    for (swap2 = deck.length; swap2; swap2--) {
      // I have no fuckin clue what this algorithm does I found it on stack overflow
      pivot = Math.floor(Math.random() * swap2);
      swap1 = deck[swap2-1];
      deck[swap2-1] = deck[pivot];
      deck[pivot] = swap1;
    }
    return deck;
  }
}

function playerManagementReducer(game_state, action) {
  if (game_state.game_started) {
    // Do nothing; you can't join or leave once the game starts
    return;
  }
  switch (action.type) {
    case ActionTypes.player_join:
      game_state.player_data[action.player_id] = {
        player_id: action.player_id,
      };
      break;
    case ActionTypes.player_leave:
      delete game_state.player_data[action.player_id];
      break;
  }
}

function playerPlayReducer(game_state, action) {
  if (!game_state.game_started) {
    // Can't play when not started
    return;
  }
  switch (action.type) {
    case ActionTypes.player_hit:
      dealPlayerCard(game_state, action.player_id, false);
      break;
    case ActionTypes.player_stay:
      break;
  }
}

function playerActedReducer(game_state, action) {
  if (!game_state.game_started) {
    return;
  }
  switch (action.type) {
    // FIXME Power words go here too
    case ActionTypes.player_hit:
      game_state.player_acted[action.player_id] = true;
      break;
    case ActionTypes.player_stay:
      // Do nothing; because they may have played a non-turn-ending power word
      break;
  }
}

/**
 * Flips the game_over flag and fires the game end event
 */
function endGameReducer(game_state, action) {
  switch (action.type) {
    case ActionTypes.player_hit: // Even though this is turn-ending, it is impossible to trigger a game end
    case ActionTypes.player_stay:
      if (game_state.allPlayersStayed()) {
        game_state.game_over = true;
        game_state.triggerEvent(gameEndedEvent());

        // The game is over! Compute the results
        const goal = 21; // FIXME later we fetch this from the model_state

        let winner = false;
        let tie = false;
        let player_totals = {};
        let player_busts = {};
        let player_losses = {};
        let player_hands = {};
        game_state.getPlayerIds().forEach(player_id => {
          let hand = player_hands[player_id] = game_state.getPlayerHand(player_id);
          let total = 0;
          hand.forEach(card => {
            total += card.card;
          });
          player_totals[player_id] = total;
          player_busts[player_id] = total > goal;
        });

        let winning_amount = -1;
        game_state.getPlayerIds().forEach(player_id => {
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

        // Ok, if we got a winner, then deduct points from everybody else
        game_state.getPlayerIds().forEach(player_id => {
          if (winner !== player_id) {
            player_losses[player_id] = 1; // FIXME figure this out later
          }
        });

        // Get all of the results and smash them into this event
        game_state.triggerEvent(roundResolutionEvent(
          goal, winner, tie,
          player_totals, player_hands, player_losses
        ));
      }
      break;
  }
}

/**
 * This reducer figures out whos turn it is next
 */
function nextPlayerTurnReducer(game_state, action) {
  if (!game_state.game_started) {
    return;
  }

  switch (action.type) {
    case ActionTypes.player_hit:
    case ActionTypes.player_stay:
      let current_player = game_state.player_turn;
      let player_ids = game_state.getPlayerIds();
      let index_of = player_ids.indexOf(current_player);

      // Move forward by 1 unless you're at the end of the array, otherwise go back to 0
      if (index_of >= player_ids.length - 1) {
        index_of = 0;
      } else {
        // DAVID SAVE ME WTFFF
        index_of += 1;
      }
      let next_player_id = player_ids[index_of];

      // Move to the next player, and then set their "player acted" state to false
      // and change it to true if they decide to do something
      game_state.player_turn = next_player_id;
      game_state.player_acted[next_player_id] = false;
      break;
  }
}


function dealPlayerCard(game_state, player_id, hidden = false) {
  let card = game_state.deck.shift();

  // Add the card to the player's hand
  game_state.player_data[player_id].hand = game_state.player_data[player_id].hand || [];
  game_state.player_data[player_id].hand.push(
    {
      card: card,
      hidden: hidden,
    }
  );

  game_state.triggerEvent(playerReceiveCard(player_id, card, hidden));
}


// Note the export is an array of reducers ORDERED BY PRIORITY
module.exports = [
  actionRecordingReducer,
  gameInitializationReducer,
  playerManagementReducer,
  playerPlayReducer,
  playerActedReducer,
  endGameReducer,
  nextPlayerTurnReducer,
];
