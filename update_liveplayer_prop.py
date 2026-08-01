import re

with open('src/components/LivePlayer.jsx', 'r') as f:
    content = f.read()

old_func = "export default function LivePlayer({ url, playing, muted, onVideoMount }) {"
new_func = "export default function LivePlayer({ url, playing, muted, onVideoMount, isFlv }) {"
content = content.replace(old_func, new_func)

old_if = "if (url.includes('.flv') || url.includes('.m3u8')) {"
new_if = "if (isFlv || url.includes('.flv') || url.includes('.m3u8')) {"
content = content.replace(old_if, new_if)

old_if_2 = "if (url.includes('.flv')) {"
new_if_2 = "if (isFlv || url.includes('.flv')) {"
content = content.replace(old_if_2, new_if_2)

with open('src/components/LivePlayer.jsx', 'w') as f:
    f.write(content)

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    studio_content = f.read()

old_player = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""

new_player = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            isFlv={true}
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""
studio_content = studio_content.replace(old_player, new_player)

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(studio_content)
