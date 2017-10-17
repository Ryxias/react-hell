'use strict';

const Game = require('./Game');
const Output = require('./Output');

class SlackConnector {

  static connectGame(channel_id, send, send_private = null) {
    let default_output = new Output(send, send_private);
    return new Game('slack', channel_id, default_output);
  }


  static connectChuubot(chuu) {
    chuu.on(/^!21 help$/, (message, send) => {
      send(
        `
\`\`\`
-- Twenty One Game --

Usage (Game setup):
* !21 rules
* !21 join
* !21 leave
* !21 whos-turn
* !21 whos-playing
* !21 start

Usage (In game):
* !21 hit
* !21 stay
* !21 my-cards
* !21 game-info
\`\`\`
`
      );
    });

    chuu.on(/^!21 rules$/, (message, send) => {
      send(
`
\`\`\`
-- Twenty One Game --
Two players take turns drawing cards, trying to total the sum of the cards in their
hands to 21.  The deck from which cards are drawn is shared, and only one of each
card, numbered 1 through 11, exists in the deck.

On their turns, players may choose to "hit", drawing another card and adding it
to their hand, or "stay" to pass their turn.  Once all players "stay" consecutively,
the game is over and the resulting hands are compared.

The player whose hand totals closest to 21--but not over--wins the game.  Going
over 21 is considered "busting", and is an automatic loss.
\`\`\`
`
      );
    });

    chuu.on(/^!21 join$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.addPlayer(player_id);
    });

    chuu.on(/^!21 whoami$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id).then(player => {
        return player.whoami();
      });
    });

    chuu.on(/^!21 whos-turn$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id).then(player => {
        return player.whosTurn();
      });
    });

    chuu.on(/^!21 whos-playing$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id).then(player => {
        return player.whosPlaying();
      });
    });

    chuu.on(/^!21 leave/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id).then(player => {
        return player.leaveGame();
      });
    });

    chuu.on(/^!21 start$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id)
        .then(player => player.startGame());
    });

    chuu.on(/^!21 game-info$/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;
      chuu.getPrivateMessageChannel(player_id)
        .then(private_channel_id => {
          const private_send = function(message) {
            send(message, private_channel_id);
          };
          let game = SlackConnector.connectGame(channel_id, send, private_send);
          game.getPlayer(player_id)
            .then(player => player.gameInfo());
        });
    });

    chuu.on(/^!21 nuke$/, (message, send) => {
      let channel_id = message.channel;
      let game = SlackConnector.connectGame(channel_id, send);
      meguminDestroysTheGameState(game, send);
    });

    chuu.on(/^!21 debug$/, (message, send) => {
      let channel_id = message.channel;
      let game = SlackConnector.connectGame(channel_id, send);
      game.debugGetGameState()
        .then(game_state => {
          let output = new Output(send);
          return output.sendDebugGameState(game_state)
        });
    });

    chuu.on(/^!21 hit/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id).then(player => {
        return player.hit();
      });
    });

    chuu.on(/^!21 stay/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      let game = SlackConnector.connectGame(channel_id, send);
      game.getPlayer(player_id)
        .then(player => {
          return player.stay();
        })
    });

    chuu.on(/^!21 my-cards/, (message, send) => {
      let channel_id = message.channel;
      let player_id = message.user;

      chuu.getPrivateMessageChannel(player_id)
        .then(private_channel_id => {
          const private_send = function(message) {
            send(message, private_channel_id);
          };
          let game = SlackConnector.connectGame(channel_id, send, private_send);
          game.getPlayer(player_id).then(player => {
            return player.myCards();
          });
        });
    });

    function meguminDestroysTheGameState(game, send) {
      return game.debugSetGameState({})
        .then(() => {
          send('EXPLOOOOOOOOO....');
        })
        .delay(1000)
        .then(() => {
          send(
            `
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
        });
    }
  }
}

module.exports = SlackConnector;
