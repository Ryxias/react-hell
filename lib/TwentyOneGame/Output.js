'use strict';

/**
 * This class currently encapsulates all user-facing interactions with regards
 * to slack-specific rendering of certain events.
 */
class Output {
  /**
   * Pass callables for each of the public/private outputs
   * If no callables are passed it simply outputs to console.log()
   */
  constructor(public_output = null, private_output = null) {
    this.public_output = public_output || console.log;
    this.private_output = private_output || public_output || console.log;
  }

  sendError(err) {
    return this.send(err.message);
  }

  sendDebugGameState(game_state) {
    this.send(
`\`--- !21 game DEBUG INFORMATION ---\`

\`\`\`
${JSON.stringify(game_state, null, 2)}
\`\`\`

\`--- !21 game DEBUG INFORMATION ---\``
    );
  }

  notifyPlayerJoined(player_id) {
    return this.send(`Player <@${player_id}> joined!`);
  }

  notifyPlayerLeft(player_id) {
    return this.send(`Player <@${player_id}> left!`);
  }

  notifyGameBegin(player_hands, deck) {
    return this.send(`The game has begun!`)
      .delay(1000) // Brief sleep for UI-friendliness
      .then(() => this.send('Dealing cards...'))
      .delay(1000)
      .then(() => this.renderGameInfo(player_hands, deck, false));
  }

  notifyNextRound(player_hands, deck) {
    return this.send('Starting next round...')
      .delay(1000) // Brief sleep for UI-friendliness
      .then(() => this.send('Dealing cards...'))
      .delay(1000)
      .then(() => this.renderGameInfo(player_hands, deck, false));
  }

  notifyWhoAmI(player_id) {
    return this.send(`You're player ${player_id}, <@${player_id}>!`);
  }

  notifyYourTurn() {
    return this.send('Your turn!');
  }

  notifyPlayersTurn(player_id) {
    return this.send(`Player <@${player_id}>'s turn`);
  }

  displayPlayers(player_ids) {
    return this.send(`Players are: [<@${player_ids.join('>,<@')}>]`);
  }

  /**
   * @param player_hands  Maps player_id keys to their hands, ordered by intended appearance
   * @param deck
   * @param show_hidden
   */
  renderGameInfo(player_hands, deck, show_hidden = false) {
    let player_info_strings = '';
    Object.keys(player_hands).forEach(player_id => {
      let hand = player_hands[player_id];
      player_info_strings += renderPlayer(player_id, hand);
    });
    let deck_string = 'Deck: ' + '[ ]'.repeat(deck.length);

    return this.send(
      `
\`\`\`
-- Game Info --
${player_info_strings}

${deck_string}
\`\`\`
`
    );

    // Helper function
    function renderPlayer(player_id, cards) {
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
    }
  }

  notifyDrawThenMoveToNextTurn(card_value, next_player_turn) {
    return this.notifyDrawCard(card_value)
      .delay(500)
      .then(() => this.notifyEndOfTurn())
      .delay(500)
      .then(() => this.notifyPlayersTurn(next_player_turn));
  }

  notifyStayThenMoveToNextTurn(next_player_turn) {
    return this.send('You stay')
      .delay(500)
      .then(() => this.notifyEndOfTurn())
      .delay(500)
      .then(() => this.notifyPlayersTurn(next_player_turn));
  }

  notifyStayThenGameIsOver() {
    return this.send('The game is done!')
      .then(() => this.send('But this part is UNDER CONSTRUCTION'))
      .delay(3000)
      .then(() => this.send('Thank you for playing!'))
      .delay(3000)
      .then(() => this.send('Now say goodbye to your gamestate'))
      .delay(2000)
      .then(() => this.send('EXPLOOOOOOOOO....'))
      .delay(1000)
      .then(() => {
        return this.send(`
\`\`\`


                             ____
                     __,-~~/~    \`---.
                   _/_,---(      ,    )
               __ /        <    /   )  \\___
- ------===;;;'====------------------===;;;===----- -  -
                  \\/  ~"~"~"~"~"~\\~"~)~"/
                  (_ (   \\  (     >    \\)
                   \\_( _ <         >_>'
                      ~ \`-i' ::>|--"
                          I;|.|.|
                         <|i::|i|\`.
                        (\` ^'"\`-' ")
------------------------------------------------------------------
\`\`\`
`
        );
      })
  }

  notifyStayThenRoundIsOver(game_results, player_hands, deck) {
    return this.send('You stay')
      .delay(500)
      .then(() => this.send('All players stayed, the game is over!'))
      .delay(1000)
      .then(() => this.send('And the winner is...'))
      .delay(3000) // Long delay for dramatic effect
      .then(() => {
        if (game_results.winner) {
          // Have a winner
          return this.send(`<@${game_results.winner}>!`);
        } else if (game_results.tie) {
          // Tie
          return this.send(`It's a tie!`);
        } else {
          // ??? wtf
          return this.send(`Something went wrong! I don't know who won!`);
        }
      })
      .delay(1000)
      .then(() => {
        return this.renderGameInfo(player_hands, deck, true)
      });
  }

  notifyNotYourTurn() {
    return this.send('It is not your turn!');
  }

  notifyDrawCard(card_value) {
    return this.send(`You drew a ${card_value}!`);
  }

  notifyEndOfTurn() {
    return this.send(`End of your turn`);
  }

  privateSendHand(hand) {
    let cards_string = '';
    hand.forEach(card => {
      if (card.hidden) {
        cards_string += `_*[${card.card}]*_`;
      } else {
        cards_string += `[${card.card}]`;
      }
    });

    this.privateSend(
`
Your cards: ${cards_string}
`
    );
  }

  send(message) {
    return Promise.resolve(this.public_output(message));
  }

  privateSend(message) {
    return Promise.resolve(this.private_output(message));
  }

}

module.exports = Output;
