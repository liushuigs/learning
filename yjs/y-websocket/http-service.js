const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log('new request')
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});

server.listen(1337, '127.0.0.1')