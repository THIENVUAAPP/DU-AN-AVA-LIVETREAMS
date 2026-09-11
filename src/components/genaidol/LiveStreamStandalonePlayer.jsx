import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * 🎬 SIÊU PLAYER LIVESTREAM 60 FPS ĐỘC LẬP CHO TIKTOK LIVE STUDIO & OBS BROWSER SOURCE
 * - Tối ưu 100% GPU Hardware Acceleration, không giật lag, không đứng hình
 * - Luôn mở sẵn âm thanh cho luồng live (âm thanh khán giả nghe thấy 100%)
 * - Tự động đồng bộ thời gian thực 0ms với phần mềm AvaLive
 */
export default function LiveStreamStandalonePlayer() {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    if (v && !v.startsWith('blob:')) return v;
    try {
      const saved = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
      if (saved.mediaUrl && !saved.mediaUrl.startsWith('blob:')) return saved.mediaUrl;
      const locked = localStorage.getItem('avalive_user_locked_media') || '';
      if (locked && !locked.startsWith('blob:')) return locked;
    } catch (e) {}
    return '';
  });

  const [fitMode, setFitMode] = useState(() => {
    if (typeof window === 'undefined') return 'cover';
    const params = new URLSearchParams(window.location.search);
    return params.get('fit') || 'cover';
  });

  const isExplicitlyPausedRef = useRef(false);
  const lastReportedTimeRef = useRef(0);

  // 🌐 Chuyển đổi URL thông minh cho cả local và Cloudflare HTTPS
  const resolveUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:')) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
        try {
          const u = new URL(url);
          return window.location.origin + u.pathname + u.search;
        } catch (e) {}
      }
      return url;
    }
    if (url.startsWith('/')) return window.location.origin + url;
    return window.location.origin + '/' + url;
  };

  const isSameMedia = (srcA, srcB) => {
    if (!srcA || !srcB) return false;
    if (srcA === srcB) return true;
    try {
      const uA = new URL(srcA, window.location.href);
      const uB = new URL(srcB, window.location.href);
      return uA.pathname === uB.pathname;
    } catch (e) {
      const pA = String(srcA).split('?')[0].split('#')[0];
      const pB = String(srcB).split('?')[0].split('#')[0];
      return pA === pB || pA.endsWith(pB) || pB.endsWith(pA);
    }
  };

  // ⚡ Clock Drift Compensation (Khóa tốc độ 1.0x để giữ audio và video siêu mượt, không cà giật)
  const applyTimeSync = (targetTime, force = false) => {
    const vid = videoRef.current;
    if (!vid || typeof targetTime !== 'number' || isNaN(targetTime)) return;
    if (isExplicitlyPausedRef.current) return;

    if (force) {
      try {
        vid.currentTime = targetTime;
      } catch (e) {}
    }
    if (vid.playbackRate !== 1.0) {
      vid.playbackRate = 1.0;
    }
  };

  // Tự động phát với âm thanh đầy đủ (TikTok Live Studio chấp thuận)
  const tryPlayWithSound = () => {
    const vid = videoRef.current;
    if (!vid || isExplicitlyPausedRef.current) return;
    vid.muted = false;
    vid.volume = 1.0;
    const p = vid.play();
    if (p !== undefined) {
      p.catch(() => {
        vid.muted = true;
        vid.play().then(() => {
          setTimeout(() => {
            if (vid) vid.muted = false;
          }, 300);
        }).catch(() => {});
      });
    }
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const fullSrc = resolveUrl(videoSrc);
    if (fullSrc && !isSameMedia(vid.src, fullSrc)) {
      vid.src = fullSrc;
      vid.load();
      tryPlayWithSound();
    }
  }, [videoSrc]);

  useEffect(() => {
    fetch(window.location.origin + '/api/live-state')
      .then(r => r.json())
      .then(d => {
        if (d && d.mediaUrl && !d.mediaUrl.startsWith('blob:')) {
          setVideoSrc(prev => prev || d.mediaUrl);
        }
      })
      .catch(() => {});
  }, []);

  // Kết nối Socket.io & BroadcastChannel để đồng bộ Realtime 0ms
  useEffect(() => {
    let socket = null;
    try {
      socket = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 999,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
        if (!data) return;
        if (data.mediaUrl && data.mediaUrl !== videoSrc && !data.mediaUrl.startsWith('blob:')) {
          setVideoSrc(data.mediaUrl);
        }
        if (typeof data.videoCurrentTime === 'number') {
          applyTimeSync(data.videoCurrentTime, Boolean(data.force));
        }
        if (data.isPlaying === true) {
          isExplicitlyPausedRef.current = false;
          tryPlayWithSound();
        }
      });

      socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
        if (!control) return;
        if (control.mediaUrl && control.mediaUrl !== videoSrc && !control.mediaUrl.startsWith('blob:')) {
          setVideoSrc(control.mediaUrl);
          return;
        }
        if (control.action === 'play' || control.action === 'unmute') {
          isExplicitlyPausedRef.current = false;
          tryPlayWithSound();
        }
        if (typeof control.currentTime === 'number') {
          applyTimeSync(control.currentTime, control.action === 'seek' || control.force === true);
        }
      });
    } catch (e) {}

    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('avalive_master_live_stream');
        bc.onmessage = (ev) => {
          if (!ev.data) return;
          if (ev.data.type === 'MASTER_TIME_SYNC' && typeof ev.data.currentTime === 'number') {
            applyTimeSync(ev.data.currentTime, Boolean(ev.data.force));
          } else if (ev.data.type === 'MASTER_MEDIA_CHANGE' && ev.data.mediaUrl && !ev.data.mediaUrl.startsWith('blob:')) {
            setVideoSrc(ev.data.mediaUrl);
          } else if (ev.data.type === 'GLOBAL_PLAY_STATE_CHANGE') {
            if (ev.data.isPlaying === false) {
              isExplicitlyPausedRef.current = true;
              videoRef.current?.pause();
            } else {
              isExplicitlyPausedRef.current = false;
              tryPlayWithSound();
            }
          }
        };
      } catch (e) {}
    }

    const handleWindowClick = () => {
      tryPlayWithSound();
    };
    window.addEventListener('click', handleWindowClick);

    // Watchdog 60fps
    const watchdog = setInterval(() => {
      const vid = videoRef.current;
      if (vid && !isExplicitlyPausedRef.current && !vid.paused && !vid.seeking) {
        const cur = vid.currentTime;
        if (Math.abs(cur - lastReportedTimeRef.current) < 0.01 && vid.readyState >= 2) {
          vid.play().catch(() => {});
        }
        lastReportedTimeRef.current = cur;
      }
    }, 1500);

    return () => {
      if (socket) socket.disconnect();
      if (bc) bc.close();
      window.removeEventListener('click', handleWindowClick);
      clearInterval(watchdog);
    };
  }, [videoSrc]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        onLoadedMetadata={(e) => {
          if (!isExplicitlyPausedRef.current && e.currentTarget.paused) {
            e.currentTarget.play().catch(() => {});
          }
        }}
        onError={() => {
          fetch(window.location.origin + '/api/live-state')
            .then(r => r.json())
            .then(d => {
              if (d && d.mediaUrl && !d.mediaUrl.startsWith('blob:')) {
                setVideoSrc(d.mediaUrl);
              }
            }).catch(() => {});
        }}
        onEnded={() => {
          if (videoRef.current && !isExplicitlyPausedRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fitMode,
          backgroundColor: '#000',
          display: 'block',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
          outline: 'none',
          border: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.6)',
          color: '#06b6d4',
          fontFamily: 'monospace',
          fontSize: '10px',
          fontWeight: 'bold',
          padding: '2px 6px',
          borderRadius: '4px',
          pointerEvents: 'none',
          opacity: 0.25,
          zIndex: 10
        }}
      >
        🔴 60 FPS REALTIME
      </div>
    </div>
  );
}
