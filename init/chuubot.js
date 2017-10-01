'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//

const TwentyOneSlackConnector = require(PROJECT_ROOT + '/lib/TwentyOneGame/SlackConnector');

module.exports = (config) => {
  const LoveLiveClient = require(PROJECT_ROOT + '/lib/LoveLiveClient');
  const ll_client = new LoveLiveClient();
  const chuu = require(PROJECT_ROOT + '/lib/SlackbotFramework')(config.slack);

  chuu.on(/.*/, (message, send) => {
    SlackMessage.create(
      {
        type:     message.type || 'unknown',
        channel:  message.channel || 'unknown',
        user:     message.user || 'unknown',
        text:     message.text || '',
      }
    );
  });

  // Add dumb listener for baachuu
  chuu.on(/^chuu$/, (message, send) => { send('baaaaaaaaaa'); });

  // gacha
  //   Provide `!gacha`
  //   You can add 'sr' or 'aqours' to change the mode of the bot
  chuu.on(/^!gacha/, (message, send) => {
    let message_text = message.text.toLowerCase();

    let unit = 'mus';
    if (message_text.includes('aqours')) {
      unit = 'aqours';
    }

    let promise;
    if (message_text.includes('sr')) {
      promise = ll_client.gachaSRCard(unit);
    } else {
      promise = ll_client.gachaRCard(unit);
    }

    promise.then((card) => {
      send('[' + card.getId() + '] ' + card.getName() + ' - ' + card.getImageUrl());
    });
  });

  // 21 game
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

  // FIXME -- Eventually move this all to the Slackbot connector
  chuu.on(/^!21 join$/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.addPlayer(player_id);
  });

  chuu.on(/^!21 start$/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.startGame();
    });
  });

  chuu.on(/^!21 whoami$/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.whoami();
    });
  });

  chuu.on(/^!21 whos-turn$/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.whosTurn();
    });
  });

  chuu.on(/^!21 whos-playing$/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.whosPlaying();
    });
  });

  // 21 game
  chuu.on(/^!21 leave/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.leaveGame();
    });
  });
  // FIXME -- end

  // Setting up Chuu to recognize your private channel
  chuu.on(/^!chuuconfig private$/, (message, send) => {
    let private_channel_id = message.channel;
    let user_id = message.user;

    Document.findOne({ where: { name: 'chuu-config' } })
      .then(chuu_config => {
        if (!chuu_config) {
          return Document.create(
            {
              name: 'chuu-config',
              content: '{}',
              expiry: '2999-12-31 23:59:59',
            }
          );
        }
        return chuu_config;
      })
      .then(chuu_config => {
        let chuu_config_data = JSON.parse(chuu_config.content) || {};
        chuu_config_data.private_messaging = chuu_config_data.private_messaging || {};
        chuu_config_data.private_messaging[user_id] = private_channel_id;
        chuu_config.content = JSON.stringify(chuu_config_data);
        return chuu_config.save();
      })
      .then(() => {
        send(`Understood!  I will now message this channel, ${private_channel_id}, when private messaging you!`);
      });
  });
  chuu.on(/^!private$/, (message, send) => {
    let user_id = message.user;
    Document.findOne({ where: { name: 'chuu-config' }})
      .then(chuu_config => {
        if (!chuu_config) {
          throw new Error('Nope');
        }
        let chuu_config_data = JSON.parse(chuu_config.content);
        if (!chuu_config_data.private_messaging) {
          throw new Error('Huh');
        }
        let private_channel_id = chuu_config_data.private_messaging[user_id];
        if (!private_channel_id) {
          send(`You don't seem to have private messaging configured!  Please send me a *_private message_* with the command: \`!chuuconfig private\``);
        }
        send('This is a private message!', private_channel_id);
      })
      .catch(err => send('Whoops? ' + err.message));
  });

  return chuu;
};
