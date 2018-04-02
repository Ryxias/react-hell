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

class Slackbot {
  constructor(bot_token, bot_user_id, verbose = false) {
    this.user_id = bot_user_id;
    this.listeners = [];
    this.verbose = verbose;

    this.scripts = [];

    // Setup the client and its listeners
    this.rtm = new RtmClient(bot_token);
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this.log('Chuubot RTM authentication successful');
    });
    this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this.log('Chuubot RTM connection established');
    });

    // Add the base listener framework
    this.rtm.on(RTM_EVENTS.MESSAGE, slack_message => {
      const message = new Message(slack_message);

      if (message.isEditMessage()) {
        // Disregard these
        return;
      }

      this.log('Received message: ', message);
      this.scripts.forEach(script => {
        this.log('Considering script...', script.name);
        if (script.handles(message)) {
          this.log('Match');
          script.run(
            message,
            new OutputBuffer(this.rtm, message)
          );
          return;
        }
        this.log('Pass');

      });
    });

    // Add a basic listener
    this.addScript(new BaseScript(this.user_id));
  }

  connect() {
    this.rtm.start();
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
