//
// index.js
//
//   Global front controller for this project!
//
'use strict';

const http = require('http');
const port = 80;

const requestHandler = (request, response) => {
  // Log information about the request
  console.log('----');
  console.log(request.connection.remoteAddress);
  console.log('  ' + request.method + ' ' + request.url);
  console.log('----');

  if (isBlacklisted(request)) {
    response.end('Hello, I am a Node.js Server!'); // Show them a dead site
  } else {
    response.end('Hello, I am a Node.js Server, welcome!');  // For non-blacklisted users, show them everything
  }
};

const isBlacklisted = (request) => {
  let ipblacklist = [
    '::ffff:84.198.14.161', // Some scanner

    //'::ffff:76.218.105.69', // Tiffany's ip address, only use for testing
  ];

  return ipblacklist.includes(request.connection.remoteAddress);
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});

