//
// server.js (renamed from index.js)
//
//   Global front controller for this project!
//
'use strict';

// include packages
const express = require('express');

// Load configs
const app_config = require('../configuration_loader');
global.PROJECT_ROOT = __dirname + '/../';

// Setup middleware
const { redirect_http_to_https } = require(PROJECT_ROOT + 'init/custom_app_redirects');
const { not_found_handler } = require(PROJECT_ROOT + 'init/error_handlers');
const statics_middleware = express.static(PROJECT_ROOT + 'public'); // Express to serve static files easily without nginx
const app_routes = require('./routes');
const chuubot = require(PROJECT_ROOT + 'init/chuubot')(app_config);

// Initialize the express app
const app = express();

// View Engine
app.engine('handlebars', require('express-handlebars')({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

// Sequelize (we don't even use it right now
//const sequelize = require(PROJECT_ROOT + 'init/sequelize')(app_config.db);

// Attach middleware
app.use(redirect_http_to_https);
app.use('/statics', statics_middleware);
app.use(app_routes);
app.use(not_found_handler);

// Connect chuubot
chuubot.connect();

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
