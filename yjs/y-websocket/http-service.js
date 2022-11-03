const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log('new request')
  let data = ''
  req.on('data', chunk => {
    data += chunk
  })
  req.on('end', () => {
    console.log(data)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('success');
  })
});

server.listen(1337, '127.0.0.1')