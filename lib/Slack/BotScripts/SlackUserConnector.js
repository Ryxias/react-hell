'use strict';

const Script = require('./Script');

/**
 * This script listens for specific keys
 */
class SlackUserConnector extends Script {
  constructor(UserStore, SlackUserStore) {
    super();
    this.UserStore = UserStore;
    this.SlackUserStore = SlackUserStore;
  }

  handles(message) {
    return message.text().startsWith('!connect-me');
  }

  run(message, output) {
    const message_text = message.text();

    const tokens = message_text.split(' ');
    const operator = tokens.shift();
    const key = tokens.shift();

    if (!key) {
      return Promise.resolve(false);
    }

    return Promise.resolve()
      .then(() => {
        if ('test' === key) {
          // Find the
          const slack_user = message.getUser();
          return this.SlackUserStore.findSlackUserBySlackUserId(slack_user)
            .then(slack_user => {
              if (!slack_user) {
                return output.reply(`Sorry! You haven't configured private messaging yet!`);
              }
              const slack_channel = slack_user.slack_channel_id;
              return output.message('Psst! Hello!', slack_channel);
            });
        }

        else if (key === 'iamryxias') {
          return this.UserStore.findUserById(user_id)
            .then(user => {
              if (!user) {
                return null;
              }
              return this.SlackUserStore.createNewForUserId(user.id, message.getChannel(), message.getUser())
                .then(() => {
                  output.reply(`Roger that, ${user.email}! I'll now private message you in this channel: ${message.getChannel()}!`);
                });
            });
        }
        return null;
      });
  }

}

module.exports = SlackUserConnector;
