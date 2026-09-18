import re

with open('src/components/MultistreamStudio.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the FPS span
content = re.sub(r'<span className="[^"]*hidden md:inline-block[^"]*">\s*FPS: 60 • BITRATE: 12\.5 Mbps • 4K 2160p\s*<\/span>', '', content)

# Remove the Stream Key span right below it
content = re.sub(r'<span className="[^"]*">\s*Stream Key: [^<]*\s*<\/span>', '', content)

with open('src/components/MultistreamStudio.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
