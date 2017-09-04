//
// server.js (renamed from index.js)
//
//   Global front controller for this project!
//
'use strict';

// include packages
const express = require('express');
const Sequelize = require('sequelize');

// Initialize the express app
const app = express();

app.set('view engine', 'pug');

// Sequelize
//   Yep those are the credentials in plaintext, luckily the instance
//   is not accessible from the internet :)
global.db = new Sequelize(
  'chuuni',
  'web',
  'mss_x[48UejfpaNb',
  {
    host: 'rds.chuuni.me',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false
  }
);


//
// Build routes
//
require('./routes/base')(app);

//
// Error handlers
//
app.use(function (req, res, next) {
  res.status(404).send("Whoops! I can't seem to find what you're looking for!")
});


// Install Slackbot Hook
let RtmClient = require('@slack/client').RtmClient;
let CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const SLACK_BOT_TOKEN = 'xoxb-235188197473-o4GOUJ31DVDjLMHIr6NWDreW';
let rtm = new RtmClient(SLACK_BOT_TOKEN);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
let channel;
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  for (const c of rtmStartData.channels) {
    if (c.is_member && c.name ==='gamedev') {
      channel = c.id
    }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log('Chuubot connection established');
});

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  console.log('[BOT] Received Message:', message);

  // Messages look like:
  // { type: 'message',
  //   channel: 'C12Q4F3JA',
  //   user: 'U12NYUYQK',
  //   text: 'test',
  //   ts: '1504492662.000048',
  //   source_team: 'T12NWKTEF',
  //   team: 'T12NWKTEF' }

  let message_text = message.text;
  if (message_text.toUpperCase() === '<@U6X5J5TDX> ARE YOU THERE?') {
    rtm.sendMessage("Hello <@" + message.user + ">, I am here!", message.channel);
  }
});

rtm.start();

const runServer = () => {
  const port = 80;

  // We only listen to port 80
  //   On AWS, the application is fronted by a load balancer which terminates all inbound connections
  //   and forwards them to the webservers on port 80.
  require('http').createServer(app).listen(port, () => {
    console.log('Server started, listening on port ' + port + '...');
  });
};

runServer();
