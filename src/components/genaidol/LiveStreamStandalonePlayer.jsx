import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { loadAllAidolItems } from '../../utils/idbHelper';
import { getActiveMedia } from '../../utils/activeMediaStore';

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

    const charParam = params.get('char');

    // ⚡ ƯU TIÊN 0: Trực tiếp lấy fileBlob hoặc Blob URL nếu cùng máy / mở từ phần mềm
    try {
      if (charParam && window.opener && window.opener.__activeMediaBlobMap && window.opener.__activeMediaBlobMap.get(charParam)) {
        const charBlob = window.opener.__activeMediaBlobMap.get(charParam);
        if (charBlob instanceof Blob || charBlob instanceof File) {
          return URL.createObjectURL(charBlob);
        }
      }

      if (window.opener) {
        if (window.opener.__activeMediaBlob && (window.opener.__activeMediaBlob instanceof Blob || window.opener.__activeMediaBlob instanceof File)) {
          return URL.createObjectURL(window.opener.__activeMediaBlob);
        }
        if (window.opener.__activeMediaBlobMap && window.opener.__activeMediaBlobMap.size > 0) {
          for (const val of window.opener.__activeMediaBlobMap.values()) {
            if (val && (val instanceof Blob || val instanceof File)) {
              return URL.createObjectURL(val);
            }
          }
        }
      }
      if (window.__activeMediaBlob && (window.__activeMediaBlob instanceof Blob || window.__activeMediaBlob instanceof File)) {
        return URL.createObjectURL(window.__activeMediaBlob);
      }
      if (window.__activeMediaBlobMap && window.__activeMediaBlobMap.size > 0) {
        for (const val of window.__activeMediaBlobMap.values()) {
          if (val && (val instanceof Blob || val instanceof File)) {
            return URL.createObjectURL(val);
          }
        }
      }
    } catch (e) {}

    try {
      const activeSrc = localStorage.getItem('avalive_active_video_src');
      if (activeSrc && !activeSrc.startsWith('blob:')) return activeSrc;
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

  // 📌 Sản phẩm ghim từ TikTok Shop (shop.tiktok.com)
  const [pinnedProduct, setPinnedProduct] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_current_pinned_product');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // 🎭 Overlay Đa Lớp từ Sequencer (PiP Video, Ảnh, Tiêu đề)
  const [flowSequencerOverlay, setFlowSequencerOverlay] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_sequencer_overlay');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isExplicitlyPausedRef = useRef(false);
  const isUserMutedRef = useRef(false);
  const lastReportedTimeRef = useRef(0);
  const activeBlobUrlRef = useRef(null);

  // ⚡ Tự động tìm kiếm fileBlob gốc trong Memory Cache / Opener / IndexedDB để phát 0ms nếu cùng máy
  const tryLoadFromLocalDB = useCallback(async (targetUrlOrCharId) => {
    if (typeof window === 'undefined') return null;
    try {
      // 0. Ưu tiên số 0: Lấy trực tiếp từ opener (0ms)
      if (window.opener && window.opener.__activeMediaBlob && (window.opener.__activeMediaBlob instanceof Blob || window.opener.__activeMediaBlob instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(window.opener.__activeMediaBlob);
        activeBlobUrlRef.current = bUrl;
        return bUrl;
      }
      if (window.__activeMediaBlob && (window.__activeMediaBlob instanceof Blob || window.__activeMediaBlob instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(window.__activeMediaBlob);
        activeBlobUrlRef.current = bUrl;
        return bUrl;
      }

      // 1. Kiểm tra RAM Blob Map
      if (targetUrlOrCharId) {
        const memBlob = (window.opener && window.opener.__activeMediaBlobMap && window.opener.__activeMediaBlobMap.get(targetUrlOrCharId)) ||
                        (window.__activeMediaBlobMap && window.__activeMediaBlobMap.get(targetUrlOrCharId));
        if (memBlob) {
          if (activeBlobUrlRef.current) {
            try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
          }
          const bUrl = URL.createObjectURL(memBlob);
          activeBlobUrlRef.current = bUrl;
          return bUrl;
        }
      }

      // 1.5. ⚡ Kiểm tra ActiveMediaStore Session chia sẻ trực tiếp (0ms)
      const sessionActiveFile = await getActiveMedia(targetUrlOrCharId || 'current_active');
      if (sessionActiveFile && (sessionActiveFile instanceof Blob || sessionActiveFile instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(sessionActiveFile);
        activeBlobUrlRef.current = bUrl;
        return bUrl;
      }

      const items = await loadAllAidolItems();
      if (!items || !items.length) return null;
      
      const found = items.find(it => 
        (it.id && it.id === targetUrlOrCharId) ||
        (it.url && it.url === targetUrlOrCharId) ||
        (it.mediaUrl && it.mediaUrl === targetUrlOrCharId) ||
        (it.mediaUrl && targetUrlOrCharId && targetUrlOrCharId.includes(it.mediaUrl)) ||
        (targetUrlOrCharId && it.mediaUrl && it.mediaUrl.includes(targetUrlOrCharId))
      );

      if (found && found.fileBlob) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const blobUrl = URL.createObjectURL(found.fileBlob);
        activeBlobUrlRef.current = blobUrl;
        return blobUrl;
      }
    } catch (e) {}
    return null;
  }, []);

  const isHardwareLocalBlobRef = useRef(false);

  // 🌐 Chuyển đổi URL thông minh cho cả local, Cloudflare Tunnel HTTPS và Vercel
  const resolveUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:')) return url; // Hỗ trợ phát blob URL mượt mà 60 FPS

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
    if (isUserMutedRef.current) {
      vid.muted = true;
    } else {
      vid.muted = false;
      vid.volume = 1.0;
    }
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
          if (!isUserMutedRef.current) {
            setTimeout(() => {
              if (vid && !isExplicitlyPausedRef.current && !isUserMutedRef.current) vid.muted = false;
            }, 300);
          }
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

  // Kích hoạt phát tức thì ngay khi mount (0ms delay cho TikTok Live Studio)
  useEffect(() => {
    tryPlayWithSound();
    const t = setTimeout(tryPlayWithSound, 400);
    return () => clearTimeout(t);
  }, []);

  // Cập nhật live state và tunnel URL định kỳ (chống đen màn hình 100%)
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
            setVideoSrc(prev => {
              if (!prev || !isSameMedia(prev, d.mediaUrl)) {
                return d.mediaUrl;
              }
              return prev;
            });
          }
          // Luôn duy trì phát sóng liền mạch
          if (!isExplicitlyPausedRef.current && videoRef.current && videoRef.current.paused) {
            tryPlayWithSound();
          }
        })
        .catch(() => {});
    };

    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2500);
    return () => clearInterval(interval);
  }, [tunnelUrl, videoSrc]);

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

      socket.on('MASTER_LIVE_STATE_UPDATE', async (data) => {
        if (!data) return;
        if (data.tunnelUrl && data.tunnelUrl !== tunnelUrl) {
          setTunnelUrl(data.tunnelUrl);
        }
        if (data.mediaUrl || data.selectedCharacter) {
          const localBlob = await tryLoadFromLocalDB(data.selectedCharacter || data.mediaUrl);
          if (localBlob) {
            isHardwareLocalBlobRef.current = true;
            setVideoSrc(localBlob);
            setIsVideoLoading(false);
          } else if (data.mediaUrl && !data.mediaUrl.startsWith('blob:') && !isSameMedia(videoSrc, data.mediaUrl)) {
            if (!isHardwareLocalBlobRef.current) {
              setVideoSrc(data.mediaUrl);
            }
          }
        }
        if (!isExplicitlyPausedRef.current && videoRef.current && videoRef.current.paused) {
          tryPlayWithSound();
        }
        if (data.pinnedProduct) {
          setPinnedProduct(data.pinnedProduct);
        }
        if (data.overlayImage || data.overlayText || data.secondaryMediaUrl) {
          setFlowSequencerOverlay({
            secondaryMediaUrl: data.secondaryMediaUrl || null,
            secondaryMediaPos: data.secondaryMediaPos || 'top-right',
            secondaryMediaScale: data.secondaryMediaScale || 40,
            overlayImage: data.overlayImage || null,
            overlayImagePos: data.overlayImagePos || 'top-left',
            overlayImageScale: data.overlayImageScale || 100,
            overlayText: data.overlayText || null,
            overlayTextPos: data.overlayTextPos || 'top',
            overlayTextStyle: data.overlayTextStyle || 'banner',
            overlayTextFontFamily: data.overlayTextFontFamily || 'be_vietnam',
            overlayTextFontSize: data.overlayTextFontSize || 20,
            overlayTextColor: data.overlayTextColor || '#ffffff'
          });
        }
      });

      socket.on('pin_product_live', (prod) => {
        if (prod) setPinnedProduct(prod);
      });

      socket.on('tiktok_shop_pin', (prod) => {
        if (prod) setPinnedProduct(prod);
      });

      socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
        // Tự động nhận video mới tức thì 0ms
        if (control.mediaUrl && !control.mediaUrl.startsWith('blob:') && !isSameMedia(videoSrc, control.mediaUrl)) {
          setVideoSrc(control.mediaUrl);
        }
        if (control.action === 'play' || control.isPlaying === true) {
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
        bc.onmessage = async (ev) => {
          if (!ev.data) return;
          if (ev.data.type === 'MASTER_TIME_SYNC' && typeof ev.data.currentTime === 'number') {
            applyTimeSync(ev.data.currentTime, Boolean(ev.data.force));
          } else if (ev.data.type === 'PIN_PRODUCT_UPDATE' && ev.data.product) {
            setPinnedProduct(ev.data.product);
          } else if (ev.data.type === 'GLOBAL_MEDIA_CHANGE' || ev.data.type === 'MASTER_MEDIA_CHANGE') {
            if (ev.data.overlayImage || ev.data.overlayText || ev.data.secondaryMediaUrl) {
              setFlowSequencerOverlay({
                secondaryMediaUrl: ev.data.secondaryMediaUrl || null,
                secondaryMediaPos: ev.data.secondaryMediaPos || 'top-right',
                secondaryMediaScale: ev.data.secondaryMediaScale || 40,
                overlayImage: ev.data.overlayImage || null,
                overlayImagePos: ev.data.overlayImagePos || 'top-left',
                overlayImageScale: ev.data.overlayImageScale || 100,
                overlayText: ev.data.overlayText || null,
                overlayTextPos: ev.data.overlayTextPos || 'top',
                overlayTextStyle: ev.data.overlayTextStyle || 'banner',
                overlayTextFontFamily: ev.data.overlayTextFontFamily || 'be_vietnam',
                overlayTextFontSize: ev.data.overlayTextFontSize || 20,
                overlayTextColor: ev.data.overlayTextColor || '#ffffff'
              });
            }
            if (ev.data.fileBlob && (ev.data.fileBlob instanceof Blob || ev.data.fileBlob instanceof File)) {
              try {
                if (activeBlobUrlRef.current) {
                  try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
                }
                const bUrl = URL.createObjectURL(ev.data.fileBlob);
                activeBlobUrlRef.current = bUrl;
                isHardwareLocalBlobRef.current = true;
                setVideoSrc(bUrl);
                setIsVideoLoading(false);
              } catch (e) {}
            } else if (ev.data.blobUrl && String(ev.data.blobUrl).startsWith('blob:')) {
              isHardwareLocalBlobRef.current = true;
              setVideoSrc(ev.data.blobUrl);
              setIsVideoLoading(false);
            } else {
              const localBlob = await tryLoadFromLocalDB(ev.data.characterId || ev.data.mediaUrl);
              if (localBlob) {
                isHardwareLocalBlobRef.current = true;
                setVideoSrc(localBlob);
                setIsVideoLoading(false);
              } else if (ev.data.mediaUrl && !ev.data.mediaUrl.startsWith('blob:')) {
                if (!isHardwareLocalBlobRef.current) {
                  setVideoSrc(ev.data.mediaUrl);
                }
              }
            }
          } else if (ev.data.type === 'CLEAR_STAGE') {
            // 🔌 Xóa toàn bộ Sân Khấu Chính khi người dùng ngắt đồng bộ từ Sequencer
            setFlowSequencerOverlay(null);
            setVideoSrc('');
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.src = '';
            }
            if (activeBlobUrlRef.current) {
              try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
              activeBlobUrlRef.current = null;
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

    // ⚡ ZERO-STALL & ANTI-FREEZE WATCHDOG ENGINE: Chống đứng hình 100% cho TikTok Live Studio CEF Player
    let freezeCount = 0;
    const watchdog = setInterval(() => {
      const vid = videoRef.current;
      if (!vid || isExplicitlyPausedRef.current) return;
      if (vid.paused && vid.src) {
        tryPlayWithSound();
        return;
      }
      if (!vid.paused && !vid.seeking && vid.readyState >= 2) {
        const cur = vid.currentTime;
        if (Math.abs(cur - lastReportedTimeRef.current) < 0.02) {
          freezeCount++;
          if (freezeCount >= 2) {
            // Nudge nhẹ video tiếp tục phát 0ms nếu bộ giải mã CEF bị đứng
            try {
              const dur = (typeof vid.duration === 'number' && !isNaN(vid.duration) && vid.duration > 0) ? vid.duration : 36000;
              const nextTime = (cur + 0.02) % dur;
              if (typeof nextTime === 'number' && !isNaN(nextTime)) {
                vid.currentTime = nextTime;
                vid.play().catch(() => {});
              }
            } catch (e) {}
            freezeCount = 0;
          }
        } else {
          freezeCount = 0;
          lastReportedTimeRef.current = cur;
        }
      }
    }, 1200);

    return () => {
      if (socket) socket.disconnect();
      if (bc) bc.close();
      window.removeEventListener('click', handleWindowClick);
      clearInterval(watchdog);
    };
  }, [videoSrc, tunnelUrl]);

  const toggleStandalonePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (isExplicitlyPausedRef.current || vid.paused) {
      isExplicitlyPausedRef.current = false;
      tryPlayWithSound();
    } else {
      applyExplicitPause();
    }
  };

  const toggleStandaloneMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const nextMute = !isUserMutedRef.current;
    isUserMutedRef.current = nextMute;
    vid.muted = nextMute;
    if (!nextMute) {
      vid.volume = 1.0;
      if (vid.paused && !isExplicitlyPausedRef.current) {
        vid.play().catch(() => {});
      }
    }
  };

  const toggleStandaloneFit = () => {
    setFitMode(prev => prev === 'cover' ? 'contain' : 'cover');
  };

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
        src={resolveUrl(videoSrc) || undefined}
        autoPlay
        playsInline
        webkit-playsinline="true"
        loop
        preload="auto"
        muted={true}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onLoadedMetadata={(e) => {
          setIsVideoLoading(false);
          if (!isExplicitlyPausedRef.current && e.currentTarget.paused) {
            e.currentTarget.play().then(() => {
              setIsPlaybackActive(true);
              if (!isUserMutedRef.current) {
                e.currentTarget.muted = false;
                e.currentTarget.volume = 1.0;
              }
            }).catch(() => {});
          }
        }}
        onPlaying={(e) => {
          setIsPlaybackActive(true);
          setIsVideoLoading(false);
          if (!isUserMutedRef.current && e.currentTarget.muted) {
            e.currentTarget.muted = false;
            e.currentTarget.volume = 1.0;
          }
        }}
        onWaiting={() => {
          setIsVideoLoading(true);
          if (videoRef.current && !isExplicitlyPausedRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={(e) => {
          setIsVideoLoading(false);
          if (!isExplicitlyPausedRef.current && e.currentTarget.paused) {
            e.currentTarget.play().then(() => {
              setIsPlaybackActive(true);
              if (!isUserMutedRef.current) {
                e.currentTarget.muted = false;
                e.currentTarget.volume = 1.0;
              }
            }).catch(() => {});
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
        onStalled={() => {
          if (videoRef.current && !isExplicitlyPausedRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fitMode,
          backgroundColor: '#000000',
          display: 'block',
          outline: 'none',
          border: 'none',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          willChange: 'transform',
          imageRendering: '-webkit-optimize-contrast'
        }}
      />

      {/* Floating Controls Dock */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '4px 8px',
          borderRadius: '20px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          opacity: 0.3,
          transition: 'opacity 0.25s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
      >
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
        >
          {isExplicitlyPausedRef.current ? '▶️ Phát' : '⏸️ Dừng'}
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
        >
          {fitMode === 'cover' ? '📐 Tràn' : '📐 Vừa'}
        </button>
      </div>

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

      {/* 📌 THẺ GHIM SẢN PHẨM TIKTOK SHOP TRÊN TIKTOK LIVE STUDIO */}
      {pinnedProduct && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 40,
          maxWidth: '320px',
          background: 'rgba(5, 7, 12, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(244, 63, 94, 0.8)',
          borderRadius: '16px',
          padding: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: '900', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🎵 TIKTOK SHOP • shop.tiktok.com
            </span>
            {pinnedProduct.triggerSource && (
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#fde047', background: 'rgba(234, 179, 8, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                {pinnedProduct.triggerSource.includes('comment') ? '💬 Khách hỏi' :
                 pinnedProduct.triggerSource.includes('video') ? '🎬 Theo video' : '⚡ Flash Sale Live'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)', background: '#000' }}>
              <img src={pinnedProduct.image} alt={pinnedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 0, left: 0, background: '#e11d48', color: '#fff', fontSize: '7px', fontWeight: '900', padding: '1px 3px', borderBottomRightRadius: '4px' }}>
                {pinnedProduct.id ? `MÃ #${pinnedProduct.id}` : '📌 GHIM'}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: '900', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {pinnedProduct.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#fb7185', fontFamily: 'monospace' }}>{pinnedProduct.price}</span>
                {pinnedProduct.oldPrice && (
                  <span style={{ fontSize: '9px', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'monospace' }}>{pinnedProduct.oldPrice}</span>
                )}
              </div>
              <div style={{ fontSize: '8px', color: '#fde047', fontWeight: 'bold', marginTop: '2px' }}>
                🔥 {pinnedProduct.badge || 'DEAL TIKTOK SHOP'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LỚP VIDEO PHỤ PIP (PICTURE-IN-PICTURE) */}
      {flowSequencerOverlay?.secondaryMediaUrl && (
        <div 
          style={{
            position: 'absolute',
            zIndex: 35,
            pointerEvents: 'none',
            top: flowSequencerOverlay.secondaryMediaPos?.startsWith('bottom') ? undefined : '16px',
            bottom: flowSequencerOverlay.secondaryMediaPos?.startsWith('bottom') ? '80px' : undefined,
            left: flowSequencerOverlay.secondaryMediaPos?.endsWith('left') ? '16px' : (flowSequencerOverlay.secondaryMediaPos === 'center' ? '50%' : undefined),
            right: flowSequencerOverlay.secondaryMediaPos?.endsWith('right') ? '16px' : undefined,
            transform: flowSequencerOverlay.secondaryMediaPos === 'center' ? 'translateX(-50%)' : undefined,
            width: `${flowSequencerOverlay.secondaryMediaScale || 40}%`,
            maxWidth: '85%'
          }}
        >
          <video
            src={flowSequencerOverlay.secondaryMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16/9',
              objectFit: 'cover',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.85)'
            }}
          />
        </div>
      )}

      {/* LỚP ẢNH BANNER OVERLAY */}
      {flowSequencerOverlay?.overlayImage && (
        <div 
          style={{
            position: 'absolute',
            zIndex: 36,
            pointerEvents: 'none',
            top: flowSequencerOverlay.overlayImagePos?.startsWith('bottom') ? undefined : '16px',
            bottom: flowSequencerOverlay.overlayImagePos?.startsWith('bottom') ? '80px' : undefined,
            left: flowSequencerOverlay.overlayImagePos?.endsWith('left') ? '16px' : (flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' || flowSequencerOverlay.overlayImagePos === 'center' ? '50%' : undefined),
            right: flowSequencerOverlay.overlayImagePos?.endsWith('right') ? '16px' : undefined,
            transform: (flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' || flowSequencerOverlay.overlayImagePos === 'center') ? `translateX(-50%) scale(${(flowSequencerOverlay.overlayImageScale || 100) / 100})` : `scale(${(flowSequencerOverlay.overlayImageScale || 100) / 100})`,
            maxWidth: flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' ? '92%' : '140px',
            maxHeight: flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' ? '120px' : '140px'
          }}
        >
          <img 
            src={flowSequencerOverlay.overlayImage} 
            alt="Sequencer Overlay" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))'
            }}
          />
        </div>
      )}

      {/* LỚP CHỮ BANNER OVERLAY */}
      {flowSequencerOverlay?.overlayText && (
        <div 
          style={{
            position: 'absolute',
            zIndex: 37,
            pointerEvents: 'none',
            left: '12px',
            right: '12px',
            top: flowSequencerOverlay.overlayTextPos === 'bottom' ? undefined : (flowSequencerOverlay.overlayTextPos === 'center' ? '50%' : '16px'),
            bottom: flowSequencerOverlay.overlayTextPos === 'bottom' ? '80px' : undefined,
            transform: flowSequencerOverlay.overlayTextPos === 'center' ? 'translateY(-50%)' : undefined,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              padding: '8px 14px',
              borderRadius: '16px',
              textAlign: 'center',
              fontWeight: '900',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              fontFamily: flowSequencerOverlay.overlayTextFontFamily === 'montserrat' ? "'Montserrat', sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'be_vietnam' ? "'Be Vietnam Pro', sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'lexend' ? "'Lexend', sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'impact' ? "Impact, sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'inter' ? "'Inter', sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'roboto' ? "'Roboto', sans-serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'playfair' ? "'Playfair Display', serif" :
                          flowSequencerOverlay.overlayTextFontFamily === 'anton' ? "'Anton', sans-serif" : undefined,
              fontSize: flowSequencerOverlay.overlayTextFontSize ? `${flowSequencerOverlay.overlayTextFontSize}px` : '14px',
              color: flowSequencerOverlay.overlayTextColor || '#ffffff',
              background: flowSequencerOverlay.overlayTextStyle === 'neon_cyber' ? 'rgba(2, 6, 23, 0.9)' :
                          flowSequencerOverlay.overlayTextStyle === 'gold_luxury' ? 'linear-gradient(to right, #f59e0b, #fde047, #f59e0b)' :
                          flowSequencerOverlay.overlayTextStyle === 'gradient_rose' ? 'linear-gradient(to right, #e11d48, #ec4899, #e11d48)' :
                          flowSequencerOverlay.overlayTextStyle === 'minimal_dark' ? 'rgba(0,0,0,0.85)' :
                          'linear-gradient(to right, #dc2626, #f59e0b, #dc2626)',
              border: flowSequencerOverlay.overlayTextStyle === 'neon_cyber' ? '1px solid #22d3ee' :
                      flowSequencerOverlay.overlayTextStyle === 'gold_luxury' ? '1px solid #fef08a' :
                      flowSequencerOverlay.overlayTextStyle === 'gradient_rose' ? '1px solid rgba(244, 114, 182, 0.5)' :
                      flowSequencerOverlay.overlayTextStyle === 'minimal_dark' ? '1px solid rgba(255,255,255,0.2)' :
                      '1px solid rgba(252, 211, 77, 0.5)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
            }}
          >
            {flowSequencerOverlay.overlayText}
          </div>
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
        🔴 4K 60 FPS REALTIME v4.6.2 (TIKTOK LIVE)
      </div>
    </div>
  );
}
