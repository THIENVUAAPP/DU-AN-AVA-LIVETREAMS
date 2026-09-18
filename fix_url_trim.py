import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Trim the URL when setting it
content = content.replace(
    'onClick={() => setActiveVideoUrl(videoUrlInput)}',
    'onClick={() => setActiveVideoUrl(videoUrlInput.trim())}'
)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

