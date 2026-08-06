const http = require('http');
const req = http.request({
  hostname: 's12.localhost',
  port: 3000,
  path: '/',
  method: 'GET'
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
     if(chunk.toString().includes('Vite')) console.log('Vite responded successfully');
  });
});
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});
req.end();
