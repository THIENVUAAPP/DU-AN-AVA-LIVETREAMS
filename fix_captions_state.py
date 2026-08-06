import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

if "const [captionsEnabled, setCaptionsEnabled]" not in content:
    content = content.replace(
        "const [activeVideoUrl, setActiveVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');",
        "const [activeVideoUrl, setActiveVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');\n  const [captionsEnabled, setCaptionsEnabled] = useState(false);"
    )
    with open('src/components/MultistreamStudio.jsx', 'w') as f:
        f.write(content)

