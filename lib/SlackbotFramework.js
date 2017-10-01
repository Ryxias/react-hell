//
// slackbot_framework
//   Provides all the setup for connecting and activating a new slackbot
//

// Import Slack Client
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;


module.exports = (slack_config) => {
  // Configuration
  const SLACK_BOT_TOKEN = slack_config.bot_token;
  const CHUUBOT_USER_ID = slack_config.bot_user_id;
  const VERBOSE = false;

  class Chuubot {
    constructor(bot_token, user_id, verbose = false) {
      this.user_id = user_id;
      this.listeners = [];
      this.verbose = verbose;

      // Setup the client and its listeners
      this.rtm = new RtmClient(bot_token);
      this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
        this.log('Chuubot RTM authentication successful');
      });
      this.rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
        this.log('Chuubot RTM connection established');
      });

      // Add the base listener framework
      this.rtm.on(RTM_EVENTS.MESSAGE, (message) => {
        // Message is a JSON-decoded objects with 7 keys:
        //  - type (usually says "message")
        //  - channel
        //  - user (the user ID)
        //  - text (this is what you care about)
        //  - ts (timestamp with milliseconds)
        //  - source_team
        //  - team
        if (message.subtype && 'message_changed' === message.subtype) {
          // Disregard these
          return;
        }

        this.log('Received message: ', message);
        this.listeners.forEach((listener) => {
          this.log('Considering listener...', listener);
          if (listener.matches(message)) {
            this.log('Match');
            listener.callback(
              message,
              (text, channel_id = null) => {
                let channel = channel_id || message.channel;
                this.rtm.sendMessage(text, channel);
              }
            );
            return;
          }
          this.log('Pass');
        });
      });

      // Add a basic listener
      let base_listener = {};
      base_listener.matches = (message) => {
        let message_text = message.text || '';
        return message_text.toUpperCase() === '<@' + this.user_id + '> ARE YOU THERE?';
      };
      base_listener.callback = (message) => {
        return "Hello <@" + message.user + ">, I am here!";
      };
      this.registerListener(base_listener);
    }

    connect() {
      this.rtm.start();
    }

    /**
     * Adds a listener to the list that attempts to match messages sent to Chuubot.
     * A listener must be an object with 2 methods defined:
     *
     * - matches: Accepts a single argument, message, which is a Slackbot message object.  Returns true or false.
     * - callback: Accepts a two arguments:
     *     - message, the Slackbot message object
     *     - send,    An executable.  The callback is expected to call send(STRING) to reply
     *
     * @param listener
     */
    registerListener(listener) {
      if ('function' !== typeof listener.matches ||
        'function' !== typeof listener.callback) {
        this.log('Invalid listener');
        return;
      }
      this.listeners.push(listener);
    }

    /**
     * Simplified syntax to add a new regex listener
     *
     * @param regex REMEMBER THAT THIS ARGUMENT MUST BE A JS REGEX; IF IT IS A STRING IT CANNOT HAVE DELIMITERS
     * @param callback
     */
    on(regex, callback) {
      this.registerListener(new ChuubotListenerRegexp(regex, callback));
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

  /**
   * Basic implementation
   */
  class ChuubotListenerRegexp {
    constructor(regex, callback_function) {
      this.regex = regex;
      this.callback_function = callback_function;
    }

    matches(message) {
      let message_text = message.text;
      return null !== message_text.match(this.regex);
    }

    callback(message, send) {
      this.callback_function(message, send);
    }
  }

  return new Chuubot(SLACK_BOT_TOKEN, CHUUBOT_USER_ID, VERBOSE);
};
