'use strict';

const Script = require('./Script');

/**
 * This script listens for specific keys
 */
class SlackUserConnector extends Script {
  constructor(UserStore, SlackUserStore, TokenStore) {
    super();
    this.UserStore = UserStore;
    this.SlackUserStore = SlackUserStore;
    this.TokenStore = TokenStore;
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
          return this._sendTestAcknowledgement(message, output);
        }
        else {
          return this._connectUser(key.trim(), message, output);
        }
      });
  }

  _sendTestAcknowledgement(message, output) {
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

  _connectUser(key, message, output) {
    return this.TokenStore.findByToken(key)
      .then(token => {
        if (!token
          || token.context !== 'slack_connector_handoff_token'
          || token.isExpired()) {
          return null;
        }

        const data = JSON.parse(token.metadata);
        const user_id = data.user_id;
        if (!user_id) {
          return null;
        }

        const getUser = this.UserStore.findUserById(user_id);
        const getExistingSlackUser = getUser.then(user => this.SlackUserStore.findSlackUserByUserId(user.id));
        const destroyToken = token.destroy();

        return Promise.all([ getUser, getExistingSlackUser, destroyToken ])
          .spread((user, slack_user, _) => {
            if (!user) {
              return null;
            }

            if (!slack_user) {
              return this.SlackUserStore.createNewForUserId(user.id, message.getChannel(), message.getUser())
                .then(successfulReply);
            } else {
              slack_user.slack_channel_id = message.getChannel();
              slack_user.slack_user_id = message.getUser();
              return slack_user.save().then(successfulReply);
            }

            function successfulReply() {
              return output.reply(`Roger that, ${user.email}! I'll now private message you in this channel: ${message.getChannel()}!`);
            }
          });
      });
  }
}

module.exports = SlackUserConnector;
