//
// index.js
//
//   Global front controller for this project!
//
const http = require('http');
const port = 80;

const requestHandler = (request, response) => {
  console.log(request.url);
  response.end('Hello, I am a Node.js Server! Welcome!')
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});

