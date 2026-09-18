with open('vite.config.js', 'r') as f:
    content = f.read()

content = content.replace("const fetch = (await import('node-fetch')).default || fetch;", "const fetch = global.fetch;")

with open('vite.config.js', 'w') as f:
    f.write(content)
