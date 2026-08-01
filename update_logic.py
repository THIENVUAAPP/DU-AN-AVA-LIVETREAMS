with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

old_state = """              ...s,
              streamUrl: data.streamUrl,
              title: data.title || stream.title,"""

new_state = """              ...s,
              streamUrl: data.streamUrl,
              ext: data.ext,
              title: data.title || stream.title,"""
content = content.replace(old_state, new_state)

old_player = """                          <LivePlayer 
                            url={stream.streamUrl.includes('tiktokcdn') ? `https://corsproxy.io/?${encodeURIComponent(stream.streamUrl)}` : stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            isFlv={true}
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""

new_player = """                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                            isFlv={stream.ext === 'flv' || stream.streamUrl.includes('.flv')}
                            isM3u8={stream.ext === 'm3u8' || stream.ext === 'mp4' || stream.streamUrl.includes('.m3u8')}
                            onVideoMount={(v) => console.log('Video mounted for:', stream.id)}
                          />"""
content = content.replace(old_player, new_player)

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)

with open('src/components/LivePlayer.jsx', 'r') as f:
    player_content = f.read()

old_p_func = "export default function LivePlayer({ url, playing, muted, onVideoMount, isFlv }) {"
new_p_func = "export default function LivePlayer({ url, playing, muted, onVideoMount, isFlv, isM3u8 }) {"
player_content = player_content.replace(old_p_func, new_p_func)

old_if1 = "if (isFlv || url.includes('.flv') || url.includes('.m3u8')) {"
new_if1 = "if (isFlv || isM3u8 || url.includes('.flv') || url.includes('.m3u8')) {"
player_content = player_content.replace(old_if1, new_if1)

old_if3 = "if (url.includes('.m3u8')) {"
new_if3 = "if (isM3u8 || url.includes('.m3u8')) {"
player_content = player_content.replace(old_if3, new_if3)

with open('src/components/LivePlayer.jsx', 'w') as f:
    f.write(player_content)
