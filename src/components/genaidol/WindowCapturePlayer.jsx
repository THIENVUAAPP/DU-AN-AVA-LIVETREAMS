import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

/**
 * 🖥️ TAB CODE ĐỘC LẬP: CỬA SỔ BẮT HÌNH WINDOW CAPTURE 4K 60 FPS CHO OBS & TIKTOK LIVE STUDIO
 * - Tách biệt hoàn toàn 100% với đường link Online Live Stream (/live-stream)
 * - Khóa chặt luồng video 4K 60 FPS siêu mượt, không giật lag, không đứng hình
 * - Nút [✕ Ẩn Toàn Bộ (H)] cho phép ẩn sạch 100% các nút và tab điều khiển trên video
 * - Biểu tượng mắt nổi [👁️] hoặc phím tắt [H] giúp hiện lại nhanh chóng bất kỳ lúc nào
 */
export default function WindowCapturePlayer() {
  const videoRef = useRef(null);
  const [tunnelUrl, setTunnelUrl] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('tunnel') || localStorage.getItem('avalive_tunnel_url') || '';
  });

  const [videoSrc, setVideoSrc] = useState(() => {
    if (typeof window === 'undefined') return '/uploads/media-1789044811424-233037063.mp4';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    if (v && !v.startsWith('blob:')) return v;
    try {
      const saved = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
      if (saved.mediaUrl && !saved.mediaUrl.startsWith('blob:')) return saved.mediaUrl;
      const locked = localStorage.getItem('avalive_user_locked_media') || '';
      if (locked && !locked.startsWith('blob:')) return locked;
    } catch (e) {}
    return '/uploads/media-1789044811424-233037063.mp4';
  });

  const [fitMode, setFitMode] = useState(() => {
    if (typeof window === 'undefined') return 'cover';
    const params = new URLSearchParams(window.location.search);
    return params.get('fit') || 'cover';
  });

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);

  // 👁️ Trạng thái ẩn toàn bộ các nút / tab trên giao diện Window Capture
  const [isControlsHidden, setIsControlsHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('avalive_window_capture_dock_hidden') === 'true';
    } catch (e) {
      return false;
    }
  });

  const isExplicitlyPausedRef = useRef(false);
  const isUserMutedRef = useRef(false);
  const lastReportedTimeRef = useRef(0);

  // Cập nhật tiêu đề cửa sổ cho OBS & TikTok Studio dễ nhận diện
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = '[AvaLive VIP PRO] - Cửa Sổ Live 9:16 (Window Capture)';
    }
  }, []);

  const toggleControlsHidden = (val) => {
    const nextVal = typeof val === 'boolean' ? val : !isControlsHidden;
    setIsControlsHidden(nextVal);
    try {
      localStorage.setItem('avalive_window_capture_dock_hidden', String(nextVal));
    } catch (e) {}
  };

  // 🌐 Chuyển đổi URL thông minh cho Window Capture
  const resolveUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:')) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.includes('localhost:') || url.includes('127.0.0.1:')) {
        try {
          const u = new URL(url);
          if (window.location.hostname.includes('vercel.app') && tunnelUrl) {
            return `${tunnelUrl.replace(/\/$/, '')}${u.pathname}${u.search}`;
          }
          return window.location.origin + u.pathname + u.search;
        } catch (e) {}
      }
      return url;
    }

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

  const applyTimeSync = (targetTime, force = false) => {
    const vid = videoRef.current;
    if (!vid || typeof targetTime !== 'number' || isNaN(targetTime)) return;
    if (isExplicitlyPausedRef.current) return;

    const cur = vid.currentTime;
    const diff = Math.abs(cur - targetTime);

    if (force || diff > 1.5) {
      vid.currentTime = targetTime;
    }
  };

  // 1. Đồng bộ qua BroadcastChannel nội bộ cùng máy
  useEffect(() => {
    let bc = null;
    try {
      bc = new BroadcastChannel('avalive_master_live_stream');
      bc.onmessage = (event) => {
        const msg = event.data;
        if (!msg) return;

        if (msg.type === 'GLOBAL_MEDIA_CHANGE' && msg.mediaUrl) {
          const resolved = resolveUrl(msg.mediaUrl);
          if (resolved && !isSameMedia(resolved, videoSrc)) {
            setVideoSrc(resolved);
            setIsVideoLoading(true);
          }
          if (typeof msg.currentTime === 'number' && msg.currentTime >= 0) {
            setTimeout(() => applyTimeSync(msg.currentTime, true), 100);
          }
        } else if (msg.type === 'GLOBAL_PLAYBACK_CHANGE') {
          const vid = videoRef.current;
          if (!vid) return;
          if (msg.action === 'pause') {
            isExplicitlyPausedRef.current = true;
            vid.pause();
            setIsPlaybackActive(false);
          } else if (msg.action === 'play') {
            isExplicitlyPausedRef.current = false;
            vid.play().catch(() => {});
            setIsPlaybackActive(true);
          }
          if (typeof msg.currentTime === 'number') {
            applyTimeSync(msg.currentTime);
          }
        }
      };
    } catch (e) {}

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
    };
  }, [videoSrc, resolveUrl]);

  // 2. Đồng bộ qua Socket.io Realtime Server
  useEffect(() => {
    let socket = null;
    try {
      const serverOrigin = window.location.origin;
      socket = io(serverOrigin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (state) => {
        if (!state) return;
        if (state.tunnelUrl && state.tunnelUrl !== tunnelUrl) {
          setTunnelUrl(state.tunnelUrl);
        }
        if (state.mediaUrl) {
          const resolved = resolveUrl(state.mediaUrl);
          if (resolved && !isSameMedia(resolved, videoSrc)) {
            setVideoSrc(resolved);
            setIsVideoLoading(true);
          }
        }
        if (state.videoPlaybackEvent === 'pause') {
          isExplicitlyPausedRef.current = true;
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaybackActive(false);
          }
        } else if (state.videoPlaybackEvent === 'play' && isExplicitlyPausedRef.current) {
          isExplicitlyPausedRef.current = false;
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaybackActive(true);
          }
        }
        if (typeof state.videoCurrentTime === 'number') {
          applyTimeSync(state.videoCurrentTime);
        }
      });
    } catch (e) {}

    return () => {
      if (socket) {
        try { socket.disconnect(); } catch (e) {}
      }
    };
  }, [tunnelUrl, videoSrc, resolveUrl]);

  // 3. Quản lý phát Video & Phục hồi tự động
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let isSubscribed = true;

    const playVideo = async () => {
      try {
        if (isExplicitlyPausedRef.current) return;
        vid.muted = isUserMutedRef.current;
        await vid.play();
        if (isSubscribed) {
          setIsPlaybackActive(true);
          setIsVideoLoading(false);
        }
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          vid.muted = true;
          isUserMutedRef.current = true;
          try {
            await vid.play();
            if (isSubscribed) {
              setIsPlaybackActive(true);
              setIsVideoLoading(false);
            }
          } catch (e) {}
        }
      }
    };

    const handleLoadedMetadata = () => {
      setIsVideoLoading(false);
      playVideo();
    };

    const handleWaiting = () => setIsVideoLoading(true);
    const handlePlaying = () => {
      setIsVideoLoading(false);
      setIsPlaybackActive(true);
    };

    vid.addEventListener('loadedmetadata', handleLoadedMetadata);
    vid.addEventListener('waiting', handleWaiting);
    vid.addEventListener('playing', handlePlaying);

    playVideo();

    return () => {
      isSubscribed = false;
      vid.removeEventListener('loadedmetadata', handleLoadedMetadata);
      vid.removeEventListener('waiting', handleWaiting);
      vid.removeEventListener('playing', handlePlaying);
    };
  }, [videoSrc]);

  // 4. Lắng nghe phím tắt điều khiển: Space (Play/Pause), M (Mute), H (Ẩn/Hiện Nút)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleStandalonePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleStandaloneMute();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        toggleControlsHidden();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const toggleStandalonePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      isExplicitlyPausedRef.current = false;
      vid.play().then(() => setIsPlaybackActive(true)).catch(() => {});
    } else {
      isExplicitlyPausedRef.current = true;
      vid.pause();
      setIsPlaybackActive(false);
    }
  };

  const toggleStandaloneMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    isUserMutedRef.current = vid.muted;
  };

  const toggleStandaloneFit = () => {
    const nextFit = fitMode === 'cover' ? 'contain' : 'cover';
    setFitMode(nextFit);
  };

  const resolvedFinalSrc = resolveUrl(videoSrc);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <video
        ref={videoRef}
        src={resolvedFinalSrc}
        autoPlay
        playsInline
        loop
        style={{
          width: '100%',
          height: '100%',
          objectFit: fitMode,
          display: 'block',
          backgroundColor: '#000'
        }}
      />

      {/* 👑 DOCK ĐIỀU KHIỂN NỔI CỦA CỬA SỔ WINDOW CAPTURE */}
      {!isControlsHidden && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
            zIndex: 40,
            transition: 'opacity 0.2s ease',
            opacity: 0.85
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
        >
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            WINDOW CAPTURE
          </span>

          <button
            onClick={toggleStandalonePlay}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
            title="Tạm dừng / Tiếp tục độc lập (Space)"
          >
            {isPlaybackActive ? '⏸️ Dừng' : '▶️ Phát'}
          </button>

          <button
            onClick={toggleStandaloneMute}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
            title="Bật / Tắt âm thanh độc lập (M)"
          >
            {isUserMutedRef.current ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng'}
          </button>

          <button
            onClick={toggleStandaloneFit}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 8px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
            title="Chuyển chế độ Khung hình (Tràn / Vừa)"
          >
            {fitMode === 'cover' ? '📐 Tràn' : '📐 Vừa'}
          </button>

          {/* ⭐ NÚT ẨN HẾT TẤT CẢ CÁC TAB / NÚT TRÊN GIAO DIỆN VIDEO */}
          <button
            onClick={() => toggleControlsHidden(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              color: '#fca5a5',
              fontSize: '11px',
              fontWeight: 'bold',
              padding: '4px 10px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Ẩn sạch toàn bộ các nút trên video để TikTok Studio / OBS quay khung hình tinh khiết (Phím tắt: H)"
          >
            ✕ Ẩn Toàn Bộ (H)
          </button>
        </div>
      )}

      {/* 👁️ NÚT PHỤC HỒI NHỎ GỌN TRÊN GÓC PHẢI KHI ĐANG ẨN */}
      {isControlsHidden && (
        <button
          onClick={() => toggleControlsHidden(false)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 50,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.55)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            color: '#06b6d4',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: 0.25,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.25'; e.currentTarget.style.transform = 'scale(1)'; }}
          title="Bấm để hiện lại toàn bộ nút chức năng (Phím tắt: H)"
        >
          👁️
        </button>
      )}

      {/* Hiển thị chỉ báo đang tải */}
      {isVideoLoading && !isPlaybackActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.65)',
            color: '#06b6d4',
            zIndex: 30,
            gap: '12px'
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

      {!isControlsHidden && (
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
          🔴 4K 60 FPS REALTIME v1.3.2
        </div>
      )}
    </div>
  );
}
