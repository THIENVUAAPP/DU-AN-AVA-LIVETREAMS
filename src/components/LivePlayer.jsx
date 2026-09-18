import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import flvjs from 'flv.js';
import Hls from 'hls.js';
export default function LivePlayer({ url, playing, muted, onVideoMount, isFlv, isM3u8, videoId }) {
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
          url: url,
          hasAudio: true, // LUÔN bật giải mã audio để khi quay màn hình (captureStream) vẫn bắt được tiếng dù người dùng Tắt Tiếng trên web
          hasVideo: true,
        }, {
          enableWorker: true, // Chạy trong worker để không làm đơ giao diện chính
          enableStashBuffer: false,
          stashInitialSize: 32, // Giảm kích thước stash ban đầu để load nhanh hơn
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 10,
          autoCleanupMinBackwardDuration: 5,
          fixAudioTimestampGap: false,
          isLive: true,
          lazyLoad: false
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
        
        // Cơ chế chống giật/lag (Catch-up Mechanism)
        // Khi chạy nhiều luồng cùng lúc CPU có thể xử lý không kịp làm buffer bị phình to
        let lagCheckInterval = setInterval(() => {
            if (videoElement && videoElement.buffered.length > 0) {
                const end = videoElement.buffered.end(videoElement.buffered.length - 1);
                const current = videoElement.currentTime;
                const diff = end - current;
                // Nếu độ trễ lớn hơn 2 giây, nhảy cóc video về thời gian thực để không bị đứng hình
                if (diff >= 2) {
                    videoElement.currentTime = end - 0.5;
                }
            }
        }, 3000);
        
        // Lưu ID vào object để clear sau
        flvPlayerRef.current._lagCheckInterval = lagCheckInterval;
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
        if (flvPlayerRef.current._lagCheckInterval) {
            clearInterval(flvPlayerRef.current._lagCheckInterval);
        }
        try {
            flvPlayerRef.current.destroy();
        } catch (e) {}
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
        id={videoId}
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
      src={url}
      playing={playing}
      controls={true}
      muted={muted}
      width="100%"
      height="100%"
      style={{ backgroundColor: '#000' }}
      onError={(e) => console.error('Lỗi phát video (LivePlayer):', url, e)}
    />
  );
}
