with open('vite.config.js', 'r') as f:
    content = f.read()

content = content.replace("response.body.pipe(res);", """
              if (response.body.pipe) {
                  response.body.pipe(res);
              } else {
                  const { Readable } = await import('stream');
                  Readable.fromWeb(response.body).pipe(res);
              }
""")

with open('vite.config.js', 'w') as f:
    f.write(content)
