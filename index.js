//
// index.js
//
//   Global front controller for this project!
//
'use strict';

// include packages
const express = require('express');
const app = express();
const port = 80;

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


