# Extending Chuubot

## Source

Firstly, you can find all of the framework code [here](../lib/SlackbotFramework.js).

## Listeners

Chuubot is a lightweight Javascript framework that wraps the Slack client integration.  It is designed to be easily
extensible.

Chuubot figures out how to reply to Slack messages a la strategy pattern with a list of _listeners_.  Slackbot
passes the Slack message bundle to each listener in order.  The first listener to match the message will determine
what reply Chuubot sends.  If no listeners match the message (which should be for most cases...), Chuubot will not
reply.


## Adding More Listeners

If you want to add more listeners to Chuubot, simply add a call like this:

```javascript
chuu.on(/some_regex/, (message) => {
  return 'Some reply';
});
```
