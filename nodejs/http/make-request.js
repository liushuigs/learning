const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 3003,
  path: '/length_request'
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});