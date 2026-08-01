import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import flvjs from 'flv.js';

export default function LivePlayer({ url, playing, muted }) {
  const videoRef = useRef(null);
  const flvPlayerRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    if (url.includes('.flv')) {
      if (flvjs.isSupported()) {
        const videoElement = videoRef.current;
        flvPlayerRef.current = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: url
        });
        flvPlayerRef.current.attachMediaElement(videoElement);
        flvPlayerRef.current.load();
        
        if (playing) {
          const playPromise = flvPlayerRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => console.log('FLV Play error:', error));
          }
        }
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
    if (flvPlayerRef.current) {
      if (playing) {
        flvPlayerRef.current.play().catch(e => console.log(e));
      } else {
        flvPlayerRef.current.pause();
      }
    }
  }, [playing]);

  if (!url) return null;

  if (url.includes('.flv')) {
    return (
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
        controls={true}
        muted={muted}
        autoPlay={playing}
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
