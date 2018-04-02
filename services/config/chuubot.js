'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//


const GachaSlackConnector = require('../../lib/SchoolIdo.lu/SlackConnector');
const Slackbot = require('../../lib/Slack/Slackbot');

module.exports = service_container => {

  //
  // nicobot scripts configuration
  //
  service_container.registerFactory('nicobot', service_container => {
    const slack_config = service_container.get('ConfigurationManager').getObject('nicobot');

    const { bot_token, bot_user_id } = slack_config;
    const verbose = true;
    const nico = new Slackbot(bot_token, bot_user_id, verbose);

    // const MimicScript = require('../../lib/Slack/BotScripts/MimicScript');
    // nico.addScript(new MimicScript());

    return nico;
  });

  service_container.set('chuubot.config', service_container.get('ConfigurationManager').getObject('slack'));

  service_container.registerFactory('chuubot', service_container => {
    const slack_config = service_container.get('chuubot.config');

    // Boot up chuubot
    const { bot_token, bot_user_id } = slack_config;
    const verbose = true;
    const chuu = new Slackbot(bot_token, bot_user_id, verbose);

    const GachaScript = require('../../lib/Slack/BotScripts/Gacha');
    chuu.addScript(new GachaScript());


    // This attaches all !gacha listeners to chuu
    //GachaSlackConnector.connectChuubot(chuu);

    // Dumb sanity check
    chuu.on(/^chuu$/, (message, output) => { output.reply('baaaaaaaaaa'); });

    // // Setting up Chuu to recognize your private channel
    // chuu.on(/^!chuuconfig private$/, (message, send) => {
    //   let private_channel_id = message.channel;
    //   let user_id = message.user;
    //
    //   chuu.registerPrivateChannelMapping(user_id, private_channel_id)
    //     .then(() => {
    //       send(`Understood!  I will now message this channel, ${private_channel_id}, when private messaging you!`);
    //     });
    // });
    // chuu.on(/^!private$/, (message, send) => {
    //   let user_id = message.user;
    //   chuu.getPrivateMessageChannel(user_id)
    //     .then(private_channel_id => {
    //       if (private_channel_id === undefined) {
    //         send(`You don't seem to have private messaging configured!  Please send me a *_private message_* with the command: \`!chuuconfig private\``);
    //       }
    //       send('Psst!  Over here!', private_channel_id);
    //     })
    //     .catch(err => send(`Whoops, something went wrong: ${err.message} [0035HQPWCLA]`));
    // });

    return chuu;
  });
};
