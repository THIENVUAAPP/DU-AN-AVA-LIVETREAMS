import re

with open('vite.config.js', 'r') as f:
    content = f.read()

old_resolver = """               // We only need the headers to get the 'location' header
               const request = client.request(queryUrl, { method: 'HEAD' }, (response) => {
                  let finalUrl = queryUrl;
                  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                      finalUrl = response.headers.location;
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: finalUrl }));
               });"""

new_resolver = """               const options = {
                  method: 'HEAD',
                  headers: {
                     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                     'Accept-Language': 'en-US,en;q=0.5'
                  }
               };
               const request = client.request(queryUrl, options, (response) => {
                  let finalUrl = queryUrl;
                  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                      finalUrl = response.headers.location;
                  }
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: finalUrl }));
               });"""

content = content.replace(old_resolver, new_resolver)

with open('vite.config.js', 'w') as f:
    f.write(content)
