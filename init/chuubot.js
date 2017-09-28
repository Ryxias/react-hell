'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//

const TwentyOneSlackConnector = require(PROJECT_ROOT + '/lib/TwentyOneGame/SlackConnector');

module.exports = (config) => {
  const LoveLiveClient = require(PROJECT_ROOT + '/lib/LoveLiveClient');
  const ll_client = new LoveLiveClient();
  const chuu = require(PROJECT_ROOT + '/lib/slackbot_framework')(config.slack);

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
  chuu.on(/chuu/, (message, send) => { send('baaaaaaaaaa'); });

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

  chuu.on(/^!21 join/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.addPlayer(player_id);
  });

  chuu.on(/^!21 start/, (message, send) => {
    let channel_id = message.channel;
    let player_id = message.user;

    let game = TwentyOneSlackConnector.connect(channel_id, send);
    game.getPlayer(player_id).then(player => {
      return player.startGame();
    });
  });

  chuu.on(/^!21 whoami/, (message, send) => {
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


  return chuu;
};
