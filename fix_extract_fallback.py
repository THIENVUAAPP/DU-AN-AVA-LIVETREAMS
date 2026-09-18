import re

with open('vite.config.js', 'r') as f:
    content = f.read()

# Replace the OFFLINE return with a continue to yt-dlp
old_offline = """                // Nếu không lấy được hoặc không live
                res.end(JSON.stringify({ error: 'OFFLINE', stderr: 'The channel is not currently live' }));
              } catch (e) {
                 res.setHeader('Content-Type', 'application/json');
                 res.end(JSON.stringify({ error: 'OFFLINE', stderr: 'The channel is not currently live' }));
              }
              return;"""

new_offline = """                // Nếu không lấy được hoặc không live, để nó rơi xuống yt-dlp xử lý tiếp cho video thường
              } catch (e) {
                 console.log('Puppeteer extraction failed, falling back to yt-dlp', e.message);
              }"""

content = content.replace(old_offline, new_offline)

with open('vite.config.js', 'w') as f:
    f.write(content)
