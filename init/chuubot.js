'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//

const TwentyOneSlackConnector = require(PROJECT_ROOT + '/lib/TwentyOneGame/SlackConnector');
const GachaSlackConnector = require('../lib/SchoolIdo.lu/SlackConnector');
const slackbotBuilder = require(PROJECT_ROOT + '/lib/SlackbotFramework');

module.exports = (config) => {
  // Boot up chuubot
  const chuu = slackbotBuilder(config.slack);

  // This attaches all !gacha listeners to chuu
  GachaSlackConnector.connectChuubot(chuu);

  // This attaches all !21 listeners to chuu
  TwentyOneSlackConnector.connectChuubot(chuu);

  // Dumb sanity check
  chuu.on(/^chuu$/, (message, send) => { send('baaaaaaaaaa'); });

  // Logger
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
