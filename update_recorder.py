import re

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

# Add MediaRecorder ref to stream state
old_add_links = """        isApiRequired: link.includes('tiktok') || link.includes('shopee'),
        extractionStatus: (link.includes('tiktok') || link.includes('shopee')) ? 'extracting' : 'idle',
        streamUrl: '',
        title: '',
        uploader: '',
        realViewers: 0
      };
    });"""

new_add_links = """        isApiRequired: link.includes('tiktok') || link.includes('shopee'),
        extractionStatus: (link.includes('tiktok') || link.includes('shopee')) ? 'extracting' : 'idle',
        streamUrl: '',
        title: '',
        uploader: '',
        realViewers: 0,
        recordedChunks: []
      };
    });"""

if "recordedChunks: []" not in content:
    content = content.replace(old_add_links, new_add_links)


with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)
