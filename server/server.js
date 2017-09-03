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
