'use strict';

// Import Slack Client
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const RegexpScript = require('./BotScripts/RegexpScript');
const Script = require('./BotScripts/Script');
const Message = require('./Message');
const OutputBuffer = require('./OutputBuffer');
const BaseScript = require('./BotScripts/BaseScript');

/**
 * Slackbots always RESPOND to incoming messages on Slack.
 *
 * Slackbot is powered by Slack's RTM API. Documentation can be found here:
 * @doc https://slackapi.github.io/node-slack-sdk/rtm_api
 */
class Slackbot {
  constructor(bot_token, bot_user_id, verbose = false) {
    this.bot_token = bot_token;
    this.user_id = bot_user_id;
    this.listeners = [];
    this.verbose = verbose;
    this.is_connected = false;

    this.scripts = [];

    // Add a basic listener
    this.addScript(new BaseScript(this.user_id));

    this.sendMessage = this.sendMessage.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
  }

  setupRtmConnection() {
    // Setup the client and its listeners
    this.rtm = new RtmClient(this.bot_token);
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this.log('Chuubot RTM authentication successful');
    });
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this.log('Chuubot RTM connection established');
      this.is_connected = true;
    });

    // Add the base listener framework
    this.rtm.on(RTM_EVENTS.MESSAGE, this.receiveMessage);
  }

  connect() {
    this.setupRtmConnection();
    this.rtm.start();
  }

  /**
   * Promisified
   *
   * Call this method to have the current Slackbot send a message out to the slack that it is connected to.
   *
   * Resolves into a result object containing information about the message that was sent (including timestamp etc).
   */
  sendMessage(message_text, channel_id) {
    if (!this.is_connected) {
      return Promise.reject(new Error('Cannot use Slackbot to send messages as slackbot is not connected'));
    }

    return this.rtm.sendMessage(message_text, channel_id);
  }

  /**
   * Callback function
   */
  receiveMessage(slack_message) {
    if (!this.is_connected) {
      throw new Error('Cannot use Slackbot to send messages as slackbot is not connected');
    }
    const message = new Message(slack_message);

    if (message.isEditMessage()) {
      this.log('Edit message. Disregard.');
      return;
    }
    if (message.isDeleteMessage()) {
      this.log('Delete message. Disregard.');
      return;
    }

    this.log('Received message: ', message);
    this.scripts.forEach(script => {
      this.log('Considering script...', script.constructor.name);
      if (script.handles(message)) {
        this.log('Match');
        script.run(
          message,
          new OutputBuffer(this.sendMessage, message)
        );
        return;
      }
      this.log('Pass');
    });
  }

  /**
   * Adds a script to the bot. All bots are fired in order they are registered.
   *
   * The script must be an instance of the "Script" class.
   *
   * @param script
   */
  addScript(script) {
    if (!(script instanceof Script)) {
      this.log(`Invalid Script: ${script.constructor.name}`);
      return;
    }
    this.scripts.push(script);
  }

  /**
   * Simplified syntax to add a new regex listener
   *
   * @param regex REMEMBER THAT THIS ARGUMENT MUST BE A JS REGEX; IF IT IS A STRING IT CANNOT HAVE DELIMITERS
   * @param callback
   */
  on(regex, callback) {
    this.addScript(new RegexpScript(regex, callback));
  }

  /**
   * Equivalent to console.log but can be suppressed with the this.verbose flag
   *
   * @param args
   */
  log(args) {
    if (this.verbose) {
      console.log.apply(this, arguments);
    }
  }
}

module.exports = Slackbot;
