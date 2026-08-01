import re

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

old_player = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            isFlv={true}
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""

new_player = """                          <LivePlayer 
                            url={stream.streamUrl.includes('tiktokcdn') ? `https://corsproxy.io/?${encodeURIComponent(stream.streamUrl)}` : stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            isFlv={true}
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""

content = content.replace(old_player, new_player)

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)
