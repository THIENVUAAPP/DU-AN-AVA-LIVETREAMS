import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import flvjs from 'flv.js';
import Hls from 'hls.js';
export default function LivePlayer({ url, playing, muted, onVideoMount, isFlv, isM3u8 }) {
  const videoRef = useRef(null);
  const flvPlayerRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    if (isFlv || url.includes('.flv')) {
      if (flvjs.isSupported()) {
        const videoElement = videoRef.current;
        flvPlayerRef.current = flvjs.createPlayer({
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
        if (onVideoMount) onVideoMount(videoElement);
        
        if (playing) {
          const playPromise = flvPlayerRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => console.log('FLV Play error:', error));
          }
        }
      }
    } else if (isM3u8 || url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const videoElement = videoRef.current;
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        flvPlayerRef.current = hls; // Reuse the same ref variable for cleanup
        
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        if (onVideoMount) onVideoMount(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (playing) {
            videoElement.play().catch(e => console.log('HLS Play error:', e));
          }
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("fatal network error encountered, try to recover");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("fatal media error encountered, try to recover");
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari
        const videoElement = videoRef.current;
        videoElement.src = url;
        videoElement.addEventListener('loadedmetadata', () => {
          if (playing) {
            videoElement.play().catch(e => console.log('Safari HLS Play error:', e));
          }
        });
      }
    }

    return () => {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.destroy();
        flvPlayerRef.current = null;
      }
    };
  }, [url]);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        if (flvPlayerRef.current && typeof flvPlayerRef.current.play === 'function') {
           flvPlayerRef.current.play().catch(e => console.log(e));
        } else {
           videoRef.current.play().catch(e => console.log(e));
        }
      } else {
        if (flvPlayerRef.current && typeof flvPlayerRef.current.pause === 'function') {
           flvPlayerRef.current.pause();
        } else {
           videoRef.current.pause();
        }
      }
    }
  }, [playing]);

  if (!url) return null;

  if (isFlv || isM3u8 || url.includes('.flv') || url.includes('.m3u8')) {
    return (
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
        controls={true}
        muted={muted}
        autoPlay={playing}
        playsInline
      />
    );
  }

  return (
    <ReactPlayer 
      url={url} 
      playing={playing} 
      controls={true} 
      muted={muted} 
      width="100%" 
      height="100%" 
      style={{ backgroundColor: '#000' }}
    />
  );
}
