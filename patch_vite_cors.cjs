const fs = require('fs');
const file = 'vite.config.js';
let content = fs.readFileSync(file, 'utf8');

const targetHls = `              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');`;
const replacementHls = `              res.setHeader('Access-Control-Allow-Origin', '*');
              if (req.method === 'OPTIONS') {
                  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                  res.setHeader('Access-Control-Allow-Headers', '*');
                  res.statusCode = 200;
                  res.end();
                  return;
              }
              res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');`;

const targetTs = `              res.setHeader('Access-Control-Allow-Origin', '*');
              
              const contentType = response.headers.get('content-type');`;
const replacementTs = `              res.setHeader('Access-Control-Allow-Origin', '*');
              if (req.method === 'OPTIONS') {
                  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                  res.setHeader('Access-Control-Allow-Headers', '*');
                  res.statusCode = 200;
                  res.end();
                  return;
              }
              
              const contentType = response.headers.get('content-type');`;

if (content.includes(targetHls)) {
    content = content.replace(targetHls, replacementHls);
    content = content.replace(targetTs, replacementTs);
    fs.writeFileSync(file, content);
    console.log("Successfully patched vite.config.js for CORS!");
} else {
    console.log("Target not found!");
}
