with open('src/components/LivePlayer.jsx', 'r') as f:
    content = f.read()

old_flv = """        flvPlayerRef.current = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: url
        });
        flvPlayerRef.current.attachMediaElement(videoElement);
        flvPlayerRef.current.load();
        if (onVideoMount) onVideoMount(videoElement);"""

new_flv = """        flvPlayerRef.current = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: url
        }, {
          enableStashBuffer: false,
          stashInitialSize: 128,
          autoCleanupSourceBuffer: true,
          fixAudioTimestampGap: false,
          isLive: true
        });
        
        flvPlayerRef.current.on(flvjs.Events.ERROR, (errType, errDetail) => {
            console.log("FLV Error, trying to reconnect...", errType, errDetail);
            if (flvPlayerRef.current) {
                flvPlayerRef.current.unload();
                flvPlayerRef.current.load();
                flvPlayerRef.current.play().catch(e => console.log(e));
            }
        });
        
        flvPlayerRef.current.attachMediaElement(videoElement);
        flvPlayerRef.current.load();
        if (onVideoMount) onVideoMount(videoElement);"""

content = content.replace(old_flv, new_flv)

with open('src/components/LivePlayer.jsx', 'w') as f:
    f.write(content)
