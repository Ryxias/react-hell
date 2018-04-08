'use strict';
//
// Connect Chuubot and provide an example of how to create a listener
//


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

    nico.addScript(service_container.get('slackbot.scripts.gossip'));

    return nico;
  });

  //
  // chuubot configuration
  //
  service_container.set('chuubot.config', service_container.get('ConfigurationManager').getObject('slack'));
  service_container.registerFactory('chuubot', service_container => {
    const slack_config = service_container.get('chuubot.config');

    // Boot up chuubot
    const { bot_token, bot_user_id } = slack_config;
    const verbose = true;
    const chuu = new Slackbot(bot_token, bot_user_id, verbose);

    chuu.addScript(service_container.get('slackbot.scripts.baaachuu'));
    chuu.addScript(service_container.get('slackbot.scripts.gacha'));
    chuu.addScript(service_container.get('slackbot.scripts.user_connector'));

    return chuu;
  });

  // Scripts go down here
  service_container.autowire('slackbot.scripts.baaachuu', require('../../lib/Slack/BotScripts/Baaachuu'));
  service_container.autowire('slackbot.scripts.gacha', require('../../lib/Slack/BotScripts/Gacha'));
  service_container.autowire('slackbot.scripts.mimic', require('../../lib/Slack/BotScripts/MimicScript'));
  service_container.autowire('slackbot.scripts.user_connector', require('../../lib/Slack/BotScripts/SlackUserConnector'));
  service_container.autowire('slackbot.scripts.gossip', require('../../lib/Slack/BotScripts/Gossip'));
};
