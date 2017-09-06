//
// server.js (renamed from index.js)
//
//   Global front controller for this project!
//
'use strict';

// include packages
const express = require('express');
const Sequelize = require('sequelize');
const express_handlebars = require('express-handlebars');
const path = require('path');

// Load configs
global.config = require('../configuration_loader');

// Initialize the express app
const app = express();

// View Engine
app.engine('handlebars', express_handlebars({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

// Sequelize
global.db = new Sequelize(
  config.db.db,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    logging: false
  }
);

// Add a listener that redirects incoming HTTP requests to HTTPS
app.use((req, res, next) => {
  // As it turns out this is extremely not-trivial since the environments upon which this
  // application operates are behind TLS-terminating devices, which forward the request
  // as HTTP.
  //
  // Instead, we rely on a specific headers that the services provide.  AWS ELB provides
  // a header called X-FORWARDED-PROTO
  // @see https://www.allcloud.io/how-to/how-to-force-https-behind-aws-elb/
  //
  // The caveat here is that `req.protocol` is permanently broken :(
  if (req.header('x-https-protocol') // Sometimes Nginx
    || req.header('x-forwarded-proto') === 'https' // AWS ELB
  ) {
    next();
    return;
  }
  res.redirect('https://' + req.hostname + req.originalUrl);
});

// Express to serve static files easily without nginx
app.use('/statics', express.static(path.join(__dirname, '..', 'public')));


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

// Connect Chuubot and provide an example of how to create a listener
//
const chuu = require('../lib/slackbot_framework');
chuu.on(/chuu/, (message, send) => { send('baaaaaaaaaa'); });
chuu.on(/!gacha/, (message, send) => {
  const LoveLiveClient = require('../lib/love_live_client');
  let ll_client = new LoveLiveClient();
  ll_client.gachaRCard().then((card) => {
    send('[' + card.getId() + '] ' + card.getName() + ' - ' + card.getImageUrl());
  });
});

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
