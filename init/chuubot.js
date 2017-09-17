'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//

const TwentyOneGame = require(PROJECT_ROOT + '/lib/TwentyOneGame');

module.exports = (config) => {
  const LoveLiveClient = require(PROJECT_ROOT + '/lib/love_live_client');
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
  chuu.on(/!21/, (message, send) => {
    let channel_id = message.channel;
    let game = new TwentyOneGame(channel_id);
    game.loadGameState().then(send('Something Happened?'));
  });

  return chuu;
};
