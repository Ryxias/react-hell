'use strict';

const Game = require('./Game');

class SlackConnector {

  static connectGame(channel_id, send, send_private = null) {
    return new Game('slack', channel_id, send, send_private);
  }


  static connectChuubot(chuu) {
    chuu.on(/^!21 help$/, (message, send) => {
      send(
        `
-- TwentyOneGame --

Usage:
* !21 join
* !21 leave
* !21 whos-turn
* !21 start
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
        .then(player => {
          return [player, player.startGame()];
        })
        .delay(1000) // Brief sleep for UI-friendliness
        .spread((player, game_state) => {
          send('Dealing cards...');
          return [player, game_state];
        })
        .delay(1000)
        .spread((player, game_state) => {
          return [player, game_state, player.gameInfo()];
        });
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
          game.getPlayer(player_id).then(player => {
            return player.gameInfo();
          });
        });
    });

    chuu.on(/^!21 nuke$/, (message, send) => {
      let channel_id = message.channel;
      let game = SlackConnector.connectGame(channel_id, send);
      game.debugSetGameState({})
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
    });

    chuu.on(/^!21 debug$/, (message, send) => {
      let channel_id = message.channel;
      let game = SlackConnector.connectGame(channel_id, send);
      game.debugGetGameState()
        .then(game_state => {
          send('--- !21 game DEBUG INFORMATION ---');
          send(
`
\`\`\`
${JSON.stringify(game_state, null, 2)}
\`\`\`
`
          );
          send('--- !21 game DEBUG INFORMATION ---');
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
      game.getPlayer(player_id).then(player => {
        return player.stay();
      });
    });
  }
}

module.exports = SlackConnector;
