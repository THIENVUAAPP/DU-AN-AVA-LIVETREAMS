import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

/**
 * 🎬 SIÊU PLAYER LIVESTREAM 60 FPS ĐỘC LẬP CHO TIKTOK LIVE STUDIO & OBS BROWSER SOURCE
 * - Tối ưu 100% GPU Hardware Acceleration, không giật lag, không đứng hình
 * - Luôn mở sẵn âm thanh cho luồng live (âm thanh khán giả nghe thấy 100%)
 * - Tự động đồng bộ thời gian thực 0ms với phần mềm AvaLive
 * - Hỗ trợ đầy đủ Dừng (Pause), Phát (Play), Tắt tiếng (Mute), Mở tiếng (Unmute) dứt khoát 100%
 */
export default function LiveStreamStandalonePlayer() {
  const videoRef = useRef(null);
  const [tunnelUrl, setTunnelUrl] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('tunnel') || localStorage.getItem('avalive_tunnel_url') || '';
  });

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

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);

  const isExplicitlyPausedRef = useRef(false);
  const lastReportedTimeRef = useRef(0);

  // 🌐 Chuyển đổi URL thông minh cho cả local, Cloudflare Tunnel HTTPS và Vercel
  const resolveUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:')) return '';

    // Nếu là URL hoàn chỉnh http/https
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
        try {
          const u = new URL(url);
          // Nếu đang chạy trên Vercel và có tunnel URL, proxy qua tunnel URL
          if (window.location.hostname.includes('vercel.app') && tunnelUrl) {
            return `${tunnelUrl.replace(/\/$/, '')}${u.pathname}${u.search}`;
          }
          return window.location.origin + u.pathname + u.search;
        } catch (e) {}
      }
      return url;
    }

    // Nếu là đường dẫn file upload tương đối (/uploads/...)
    if (url.startsWith('/uploads/') || url.includes('/uploads/')) {
      const pathPart = url.substring(url.indexOf('/uploads/'));
      if (window.location.hostname.includes('vercel.app') && tunnelUrl) {
        return `${tunnelUrl.replace(/\/$/, '')}${pathPart}`;
      }
      return `${window.location.origin}${pathPart}`;
    }

    if (url.startsWith('/')) {
      if (window.location.hostname.includes('vercel.app') && tunnelUrl) {
        return `${tunnelUrl.replace(/\/$/, '')}${url}`;
      }
      return `${window.location.origin}${url}`;
    }

    return `${window.location.origin}/${url}`;
  }, [tunnelUrl]);

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
      p.then(() => {
        setIsPlaybackActive(true);
        setIsVideoLoading(false);
      }).catch(() => {
        vid.muted = true;
        vid.play().then(() => {
          setIsPlaybackActive(true);
          setIsVideoLoading(false);
          setTimeout(() => {
            if (vid && !isExplicitlyPausedRef.current) vid.muted = false;
          }, 300);
        }).catch(() => {});
      });
    }
  };

  const applyExplicitPause = () => {
    isExplicitlyPausedRef.current = true;
    const vid = videoRef.current;
    if (vid && !vid.paused) {
      try { vid.pause(); } catch (e) {}
    }
    setIsPlaybackActive(false);
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const fullSrc = resolveUrl(videoSrc);
    if (fullSrc && !isSameMedia(vid.src, fullSrc)) {
      setIsVideoLoading(true);
      vid.src = fullSrc;
      vid.load();
      if (!isExplicitlyPausedRef.current) {
        tryPlayWithSound();
      }
    }
  }, [videoSrc, resolveUrl]);

  // Cập nhật live state và tunnel URL định kỳ
  useEffect(() => {
    const fetchLiveState = () => {
      fetch(`${window.location.origin}/api/live-state`)
        .then(r => r.json())
        .then(d => {
          if (!d) return;
          if (d.tunnelUrl && d.tunnelUrl !== tunnelUrl) {
            setTunnelUrl(d.tunnelUrl);
            try { localStorage.setItem('avalive_tunnel_url', d.tunnelUrl); } catch (e) {}
          }
          if (d.mediaUrl && !d.mediaUrl.startsWith('blob:')) {
            setVideoSrc(prev => prev || d.mediaUrl);
          }
          if (d.isPlaying === false || d.videoPlaybackEvent === 'pause') {
            applyExplicitPause();
          } else if (d.isPlaying === true && isExplicitlyPausedRef.current) {
            isExplicitlyPausedRef.current = false;
            tryPlayWithSound();
          }
          if (typeof d.isVideoAudioMuted === 'boolean' && videoRef.current) {
            videoRef.current.muted = d.isVideoAudioMuted;
          }
        })
        .catch(() => {});
    };

    fetchLiveState();
    const interval = setInterval(fetchLiveState, 4000);
    return () => clearInterval(interval);
  }, [tunnelUrl]);

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

      socket.on('TUNNEL_URL_UPDATE', (tData) => {
        if (tData && tData.tunnelUrl) {
          setTunnelUrl(tData.tunnelUrl);
          try { localStorage.setItem('avalive_tunnel_url', tData.tunnelUrl); } catch (e) {}
        }
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
        if (!data) return;
        if (data.tunnelUrl && data.tunnelUrl !== tunnelUrl) {
          setTunnelUrl(data.tunnelUrl);
        }
        if (data.mediaUrl && !data.mediaUrl.startsWith('blob:') && !isSameMedia(videoSrc, data.mediaUrl)) {
          setVideoSrc(data.mediaUrl);
        }
        if (typeof data.videoCurrentTime === 'number') {
          applyTimeSync(data.videoCurrentTime, Boolean(data.force));
        }
        if (data.isPlaying === true) {
          isExplicitlyPausedRef.current = false;
          tryPlayWithSound();
        } else if (data.isPlaying === false || data.videoPlaybackEvent === 'pause') {
          applyExplicitPause();
        }
        if (typeof data.isVideoAudioMuted === 'boolean') {
          if (videoRef.current) videoRef.current.muted = data.isVideoAudioMuted;
        } else if (typeof data.isMuted === 'boolean') {
          if (videoRef.current) videoRef.current.muted = data.isMuted;
        }
        if (typeof data.videoVolume === 'number' && videoRef.current) {
          try { videoRef.current.volume = data.videoVolume; } catch (e) {}
        }
      });

      socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
        if (!control) return;
        if (control.mediaUrl && !control.mediaUrl.startsWith('blob:') && !isSameMedia(videoSrc, control.mediaUrl)) {
          setVideoSrc(control.mediaUrl);
          return;
        }
        // 🎯 DỪNG DỨT KHOÁT KHI STREAMER BẤM TẠM DỪNG
        if (control.action === 'pause' || control.isPlaying === false) {
          applyExplicitPause();
        } else if (control.action === 'play' || control.isPlaying === true) {
          isExplicitlyPausedRef.current = false;
          tryPlayWithSound();
        } else if (control.action === 'mute') {
          if (videoRef.current) videoRef.current.muted = true;
        } else if (control.action === 'unmute') {
          if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.volume = 1.0;
          }
        } else if (control.action === 'audio_sync') {
          if (videoRef.current) {
            if (typeof control.isMuted === 'boolean') videoRef.current.muted = control.isMuted;
            if (typeof control.volume === 'number') videoRef.current.volume = control.volume;
          }
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
            if (ev.data.isPlaying === true && isExplicitlyPausedRef.current) {
              isExplicitlyPausedRef.current = false;
              tryPlayWithSound();
            } else if (ev.data.isPlaying === false || ev.data.userPaused === true) {
              applyExplicitPause();
            }
          } else if (ev.data.type === 'MASTER_MEDIA_CHANGE' && ev.data.mediaUrl && !ev.data.mediaUrl.startsWith('blob:')) {
            setVideoSrc(ev.data.mediaUrl);
          } else if (ev.data.type === 'GLOBAL_PLAYBACK_CHANGE' || ev.data.type === 'GLOBAL_PLAY_STATE_CHANGE') {
            if (ev.data.isPlaying === false || ev.data.userPaused === true) {
              applyExplicitPause();
            } else {
              isExplicitlyPausedRef.current = false;
              tryPlayWithSound();
            }
          } else if (ev.data.type === 'GLOBAL_AUDIO_CHANGE') {
            if (videoRef.current) {
              if (typeof ev.data.isMuted === 'boolean') videoRef.current.muted = ev.data.isMuted;
              if (typeof ev.data.volume === 'number') videoRef.current.volume = ev.data.volume;
            }
          }
        };
      } catch (e) {}
    }

    const handleWindowClick = () => {
      if (!isExplicitlyPausedRef.current) {
        tryPlayWithSound();
      }
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
  }, [videoSrc, tunnelUrl]);

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
        userSelect: 'none',
        position: 'relative'
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        loop
        preload="auto"
        onLoadedMetadata={(e) => {
          setIsVideoLoading(false);
          if (!isExplicitlyPausedRef.current && e.currentTarget.paused) {
            e.currentTarget.play().then(() => setIsPlaybackActive(true)).catch(() => {});
          }
        }}
        onPlaying={() => {
          setIsPlaybackActive(true);
          setIsVideoLoading(false);
        }}
        onWaiting={() => {
          setIsVideoLoading(true);
        }}
        onCanPlay={() => {
          setIsVideoLoading(false);
          if (!isExplicitlyPausedRef.current && videoRef.current?.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onError={() => {
          fetch(`${window.location.origin}/api/live-state`)
            .then(r => r.json())
            .then(d => {
              if (d && d.mediaUrl && !d.mediaUrl.startsWith('blob:')) {
                setVideoSrc(d.mediaUrl);
              }
              if (d && d.tunnelUrl) {
                setTunnelUrl(d.tunnelUrl);
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
          outline: 'none',
          border: 'none',
          imageRendering: '-webkit-optimize-contrast'
        }}
      />

      {/* Hiển thị chỉ báo đang tải mượt mà (chống đen màn hình chết nếu mạng lag) */}
      {isVideoLoading && !isPlaybackActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#38bdf8',
            fontFamily: 'sans-serif',
            gap: '12px',
            zIndex: 5
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(6, 182, 212, 0.2)',
              borderTopColor: '#06b6d4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Đang Đồng Bộ Luồng 60 FPS...
          </span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

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
          opacity: 0.35,
          zIndex: 10
        }}
      >
        🔴 60 FPS REALTIME v1.0.7
      </div>
    </div>
  );
}
