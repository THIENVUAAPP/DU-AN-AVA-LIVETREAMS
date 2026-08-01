import re

with open('src/components/LivePlayer.jsx', 'r') as f:
    content = f.read()

old_func = "export default function LivePlayer({ url, playing, muted }) {"
new_func = "export default function LivePlayer({ url, playing, muted, onVideoMount }) {"

content = content.replace(old_func, new_func)

old_flv = """        flvPlayerRef.current.attachMediaElement(videoElement);
        flvPlayerRef.current.load();
        
        if (playing) {"""

new_flv = """        flvPlayerRef.current.attachMediaElement(videoElement);
        flvPlayerRef.current.load();
        if (onVideoMount) onVideoMount(videoElement);
        
        if (playing) {"""

content = content.replace(old_flv, new_flv)

old_hls = """        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {"""

new_hls = """        hls.loadSource(url);
        hls.attachMedia(videoElement);
        if (onVideoMount) onVideoMount(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {"""

content = content.replace(old_hls, new_hls)

with open('src/components/LivePlayer.jsx', 'w') as f:
    f.write(content)
