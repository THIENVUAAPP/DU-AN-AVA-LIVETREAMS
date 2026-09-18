with open('vite.config.js', 'r') as f:
    content = f.read()

import re

old_chunk = """
            let data = '';
            pythonProcess.stdout.on('data', (chunk) => data += chunk);
            pythonProcess.on('close', () => {
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            });
"""

new_chunk = """
            let data = '';
            pythonProcess.stdout.on('data', (chunk) => data += chunk);
            pythonProcess.on('close', () => {
              res.setHeader('Content-Type', 'application/json');
              try {
                const parsed = JSON.parse(data);
                if (parsed.url) {
                    res.end(JSON.stringify({
                        streamUrl: parsed.url,
                        title: parsed.title,
                        viewers: parsed.view_count,
                        uploader: parsed.uploader,
                        thumbnail: parsed.thumbnail
                    }));
                } else {
                    res.end(JSON.stringify({ error: 'No URL found' }));
                }
              } catch (e) {
                res.end(JSON.stringify({ error: e.toString() }));
              }
            });
"""

if old_chunk.strip() in content:
    content = content.replace(old_chunk.strip(), new_chunk.strip())
else:
    print("Could not find old chunk to replace")

with open('vite.config.js', 'w') as f:
    f.write(content)
