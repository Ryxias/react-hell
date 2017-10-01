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

  // This attaches all !21 listeners to chuu
  TwentyOneSlackConnector.connectChuubot(chuu);

  // Setting up Chuu to recognize your private channel
  chuu.on(/^!chuuconfig private$/, (message, send) => {
    let private_channel_id = message.channel;
    let user_id = message.user;

    chuu.registerPrivateChannelMapping(user_id, private_channel_id)
      .then(() => {
        send(`Understood!  I will now message this channel, ${private_channel_id}, when private messaging you!`);
      });
  });
  chuu.on(/^!private$/, (message, send) => {
    let user_id = message.user;
    chuu.getPrivateMessageChannel(user_id)
      .then(private_channel_id => {
        if (private_channel_id === undefined) {
          send(`You don't seem to have private messaging configured!  Please send me a *_private message_* with the command: \`!chuuconfig private\``);
        }
        send('Psst!  Over here!', private_channel_id);
      })
      .catch(err => send(`Whoops, something went wrong: ${err.message} [0035HQPWCLA]`));
  });

  return chuu;
};
