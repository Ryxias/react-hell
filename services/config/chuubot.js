'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//


const GachaSlackConnector = require('../../lib/SchoolIdo.lu/SlackConnector');
const slackbotBuilder = require('../../lib/SlackbotFramework');

module.exports = service_container => {

  service_container.registerFactory('chuubot', service_container => {
    const slack_config = service_container.get('ConfigurationManager').getObject('slack');

    // Boot up chuubot
    const chuu = slackbotBuilder(slack_config);

    // This attaches all !gacha listeners to chuu
    GachaSlackConnector.connectChuubot(chuu);

    // Dumb sanity check
    chuu.on(/^chuu$/, (message, send) => { send('baaaaaaaaaa'); });

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
  });
};
