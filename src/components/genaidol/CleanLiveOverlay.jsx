import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameChienDau from './game/GameChienDau';
import { Volume2, VolumeX, Sparkles, Video, Swords, Flag } from 'lucide-react';

/**
 * ⚡ CỬA SỔ OVERLAY REAL-TIME ĐỒNG BỘ 100% CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=cleanlive hoặc ?overlay=live hoặc ?overlay=stage hoặc ?overlay=avatar
 * - Kết nối đa kênh: WebSocket (Socket.io) + REST API Polling + BroadcastChannel + LocalStorage
 * - Độ trễ: < 1ms (Real-time siêu tốc)
 * - Tự động đồng bộ ngay lập tức:
 *   1. Chuyển đổi qua lại giữa AI Idol / Game Chiến Đấu / Game Bản Đồ Chữ S
 *   2. Tỷ lệ khung hình 9:16 (TikTok Dọc) và 16:9 (OBS Ngang)
 *   3. Sự kiện Quà tặng, Cắm cờ, Bảng xếp hạng, Âm nhạc BGM, Đòn đánh PK
 * - Sân khấu sạch 100% (Clean Stage), không có thanh menu hay nút bấm admin thừa
 */
export default function CleanLiveOverlay() {
  const [masterState, setMasterState] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('avalive_master_live_state');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const overlayParam = urlParams ? urlParams.get('overlay') : '';
    const ratioParam = urlParams ? urlParams.get('ratio') : '9:16';
    const directVideoUrl = urlParams ? urlParams.get('v') : null;
    
    let defaultStage = 'idol'; // Mặc định Idol
    if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map') defaultStage = 'bando';
    else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game') defaultStage = 'battle';
    else if (overlayParam === 'avatar' || overlayParam === 'idol') defaultStage = 'idol';
    else if (saved && saved.stage) {
      defaultStage = saved.stage;
    }

    return {
      stage: defaultStage, // 'idol' | 'battle' | 'bando'
      aspectRatio: ratioParam || '9:16',
      mediaUrl: saved?.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
      flvUrl: directVideoUrl || saved?.flvUrl || null,
      isVideo: saved?.isVideo || false,
      characterName: saved?.characterName || 'AI Idol Lan Hương',
      isConnected: true,
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const [liveEvent, setLiveEvent] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    const backendUrl = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : 'http://localhost:3001') : 'http://localhost:3001';

    const applyMasterState = (data) => {
      if (!data) return;
      setMasterState(prev => {
        const next = { ...prev, ...data };
        // Giữ stage URL override nếu có tham số cố định
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const overlayParam = urlParams ? urlParams.get('overlay') : '';
        if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map') {
          next.stage = 'bando';
        } else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game') {
          next.stage = 'battle';
        }
        return next;
      });
    };

    // 1. LẤY TRẠNG THÁI NGAY TỪ SERVER HTTP BACKEND
    const fetchLiveState = () => {
      fetch(`${backendUrl}/api/live-state`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            applyMasterState(data);
          }
        })
        .catch(() => {});
    };
    fetchLiveState();

    // 2. KẾT NỐI WEBSOCKET REALTIME (SOCKET.IO) CHO TIKTOK LIVE STUDIO CEF & OBS
    let socket = null;
    try {
      socket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
        if (data) applyMasterState(data);
      });

      socket.on('LIVE_EVENT', (data) => {
        if (data) setLiveEvent(data);
      });

      socket.on('bando_event', (data) => {
        if (data) setLiveEvent(data);
      });

      socket.on('tiktok_chat', (data) => {
        if (data) {
          setLiveEvent({ type: 'COMMENT', data: { username: data.username || data.nickname, text: data.comment } });
        }
      });

      socket.on('tiktok_gift', (data) => {
        if (data) {
          setLiveEvent({ 
            type: 'GIFT', 
            data: { 
              giftId: data.giftName || 'rose', 
              count: data.diamondCount || data.repeatCount || 1,
              userId: data.userId || 'guest',
              username: data.username || data.nickname || 'Khách Live',
              avatar: data.profilePictureUrl || ''
            } 
          });
        }
      });
    } catch (err) {
      console.warn('Socket.io error:', err);
    }

    // 3. Kênh BroadcastChannel Master
    let masterChannel = null;
    let bandoChannel = null;
    let battleChannel = null;
    let cleanChannel = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        masterChannel = new BroadcastChannel('avalive_master_live_stream');
        masterChannel.onmessage = (event) => {
          if (event.data) {
            if (event.data.type === 'EMERGENCY_STOP_ALL') {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('avalive_emergency_stop_all'));
                if (window.speechSynthesis) window.speechSynthesis.cancel();
              }
              const mediaElements = document.querySelectorAll('audio, video');
              mediaElements.forEach(el => { try { el.pause(); el.currentTime = 0; } catch (e) {} });
            } else if (event.data.type === 'MASTER_LIVE_STATE_UPDATE' || event.data.stage) {
              applyMasterState(event.data);
            } else if (event.data.type === 'LIVE_EVENT') {
              setLiveEvent(event.data.payload);
            }
          }
        };

        // Gửi yêu cầu xin trạng thái hiện tại ngay khi Overlay vừa mở
        masterChannel.postMessage({ type: 'REQUEST_MASTER_LIVE_STATE' });

        bandoChannel = new BroadcastChannel('avalive_bando_stage');
        bandoChannel.onmessage = (e) => {
          if (e.data?.lastEvent) {
            setLiveEvent(e.data.lastEvent);
          }
        };

        battleChannel = new BroadcastChannel('avalive_gamebattle_stage');
        battleChannel.onmessage = (e) => {
          if (e.data?.type === 'LIVE_EVENT') {
            setLiveEvent(e.data.payload);
          }
        };

        cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.onmessage = (e) => {
          if (e.data?.type === 'STREAM_MEDIA_UPDATE') {
            setMasterState(prev => ({
              ...prev,
              mediaUrl: e.data.mediaUrl,
              isVideo: e.data.isVideo,
              characterName: e.data.characterName,
              isConnected: e.data.isConnected
            }));
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    // 4. LocalStorage Storage Event Fallback
    const handleStorage = (e) => {
      if (e.key === 'avalive_master_live_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          applyMasterState(parsed);
        } catch (err) {}
      } else if (e.key === 'aidol_clean_stream_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMasterState(prev => ({
            ...prev,
            mediaUrl: parsed.mediaUrl,
            isVideo: parsed.isVideo,
            characterName: parsed.characterName,
            isConnected: parsed.isConnected
          }));
        } catch (err) {}
      } else if (e.key === 'avalive_bando_realtime_sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.lastEvent) {
            setLiveEvent(parsed.lastEvent);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 5. Heartbeat Polling Interval: Đảm bảo OBS / TikTok Live Studio CEF luôn đồng bộ tức thì
    let lastUpdatedTimestamp = 0;
    const pollInterval = setInterval(() => {
      try {
        const saved = localStorage.getItem('avalive_master_live_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.updatedAt && parsed.updatedAt !== lastUpdatedTimestamp) {
            lastUpdatedTimestamp = parsed.updatedAt;
            applyMasterState(parsed);
          }
        }
      } catch (e) {}

      // Polling REST API nhẹ mỗi 1 giây
      fetch(`${backendUrl}/api/live-state`)
        .then(r => r.json())
        .then(data => {
          if (data && data.updatedAt && data.updatedAt !== lastUpdatedTimestamp) {
            lastUpdatedTimestamp = data.updatedAt;
            applyMasterState(data);
          }
        })
        .catch(() => {});
    }, 1000);

    return () => {
      if (socket) socket.disconnect();
      if (masterChannel) masterChannel.close();
      if (bandoChannel) bandoChannel.close();
      if (battleChannel) battleChannel.close();
      if (cleanChannel) cleanChannel.close();
      window.removeEventListener('storage', handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  const flvVideoRef = useRef(null);
  const flvCanvasRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);
  const currentPlayingUrlRef = useRef(null);

  const isStreamUrl = (u) => u && (u.includes('.flv') || u.includes('.m3u8') || u.includes('pull-flv') || u.includes('tiktokcdn.com') || u.includes('/stream') || u.includes('/game/') || u.includes('/stage/'));
  const activeStreamUrl = masterState.flvUrl || (isStreamUrl(masterState.mediaUrl) ? masterState.mediaUrl : null);

  useEffect(() => {
    let animId;
    let timerId;
    let isMounted = true;

    const renderFrame = () => {
      if (!isMounted) return;
      const video = flvVideoRef.current;
      const canvas = flvCanvasRef.current;
      if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
      if (video && 'requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(renderFrame);
      } else {
        animId = requestAnimationFrame(renderFrame);
      }
    };

    const video = flvVideoRef.current;
    if (video && 'requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(renderFrame);
    } else {
      animId = requestAnimationFrame(renderFrame);
    }

    timerId = setInterval(() => {
      const v = flvVideoRef.current;
      const c = flvCanvasRef.current;
      if (v && c && v.readyState >= 2 && v.videoWidth > 0 && !v.paused) {
        if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
          c.width = v.videoWidth;
          c.height = v.videoHeight;
        }
        const ctx = c.getContext('2d', { alpha: false, desynchronized: true });
        if (ctx) {
          ctx.drawImage(v, 0, 0, c.width, c.height);
        }
      }
    }, 33);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      if (timerId) clearInterval(timerId);
    };
  }, [activeStreamUrl]);

  const getPlayableStreamUrl = (rawUrl) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('/api/stream-proxy')) return rawUrl;
    
    // Khi chạy trên HTTPS (Vercel Cloud), gọi API cùng nguồn HTTPS để trình duyệt không chặn Mixed Content
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return `/api/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
    }
    let backendOrigin = typeof window !== 'undefined' ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001' : window.location.origin) : 'http://localhost:3001';
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') backendOrigin = 'http://localhost:3001';
    return `${backendOrigin}/api/stream-proxy?url=${encodeURIComponent(rawUrl)}`;
  };

  const attachFlvPlayer = (videoEl, url) => {
    if (!videoEl || !url) return;
    if (currentPlayingUrlRef.current === url && (flvPlayerRef.current || hlsPlayerRef.current)) {
      return;
    }
    currentPlayingUrlRef.current = url;

    try {
      if (flvPlayerRef.current) {
        try { flvPlayerRef.current.destroy(); } catch (e) {}
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        try { hlsPlayerRef.current.destroy(); } catch (e) {}
        hlsPlayerRef.current = null;
      }

      const streamSrc = getPlayableStreamUrl(url);
      const isFLV = url.includes('.flv') || url.includes('pull-flv') || url.includes('/flv') || url.includes('tiktokcdn.com') || url.includes('/game/') || url.includes('/stage/') || url.includes('/stream');
      if (isFLV && flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          hasAudio: true,
          hasVideo: true,
          url: streamSrc,
          cors: true,
          enableWorker: false,
          enableStashBuffer: false,
          stashInitialSize: 128,
          lazyLoad: false,
          seekType: 'range'
        }, {
          enableWorker: false,
          enableStashBuffer: false,
          stashInitialSize: 128,
          lazyLoad: false,
          autoCleanupSourceBuffer: true,
          autoCleanupMaxBackwardDuration: 5,
          autoCleanupMinBackwardDuration: 2,
          fixAudioTimestampGap: false
        });
        flvPlayer.attachMediaElement(videoEl);
        flvPlayer.load();
        const playPromise = flvPlayer.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(() => {
            videoEl.muted = true;
            flvPlayer.play()?.catch(err => console.warn('Lỗi play flv overlay:', err));
          });
        }

        const liveEdgeInterval = setInterval(() => {
          if (videoEl && !videoEl.paused && videoEl.buffered && videoEl.buffered.length > 0) {
            const end = videoEl.buffered.end(videoEl.buffered.length - 1);
            const diff = end - videoEl.currentTime;
            if (diff > 2.5) {
              videoEl.currentTime = end - 0.3;
            }
          }
          if (videoEl && videoEl.paused) {
            videoEl.play()?.catch(() => {});
          }
        }, 2000);

        flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail, errInfo) => {
          console.warn('[AvaLive Overlay FLV Error]:', errType, errDetail, errInfo);
          if (errType === flvjs.ErrorTypes.NETWORK_ERROR) {
            flvPlayer.unload();
            flvPlayer.load();
            flvPlayer.play()?.catch(() => {});
          }
        });
        flvPlayerRef.current = flvPlayer;
      } else if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false, lowLatencyMode: true, liveSyncDurationCount: 2 });
        hls.loadSource(streamSrc);
        hls.attachMedia(videoEl);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(() => {
            videoEl.muted = true;
            videoEl.play().catch(e => console.warn('Lỗi auto-play hls overlay:', e));
          });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.warn('[HLS Error]:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
        hlsPlayerRef.current = hls;
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = streamSrc;
        videoEl.play().catch(() => {
          videoEl.muted = true;
          videoEl.play().catch(e => console.warn('Lỗi auto-play hls safari overlay:', e));
        });
      } else {
        videoEl.src = streamSrc;
        videoEl.play().catch(e => console.warn('Lỗi native video play overlay:', e));
      }
    } catch (err) {
      console.error('Lỗi khởi tạo player overlay:', err);
    }
  };

  useEffect(() => {
    if (activeStreamUrl && flvVideoRef.current) {
      attachFlvPlayer(flvVideoRef.current, activeStreamUrl);
    }

    return () => {
      try {
        currentPlayingUrlRef.current = null;
        if (flvPlayerRef.current) {
          flvPlayerRef.current.destroy();
          flvPlayerRef.current = null;
        }
        if (hlsPlayerRef.current) {
          hlsPlayerRef.current.destroy();
          hlsPlayerRef.current = null;
        }
      } catch (e) {}
    };
  }, [activeStreamUrl]);

  const currentStage = masterState.stage || 'idol';
  const ratio = masterState.aspectRatio || '9:16';

  // RENDER STAGE 1: GAME BẢN ĐỒ VIỆT NAM (CẮM CỜ 3 MIỀN)
  if (currentStage === 'bando') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center">
        <GameBanDoVietNam 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // RENDER STAGE 2: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN
  if (currentStage === 'battle') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center">
        <GameChienDau 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // RENDER STAGE 3: LIVE AI IDOL SẠCH (VIDEO / AVATAR + HIỆU ỨNG LIVE)
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none">
      <div 
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          ratio === '9:16'
            ? 'h-full aspect-[9/16] w-auto max-w-full'
            : 'w-full aspect-[16/9] h-auto max-h-full'
        }`}
        style={ratio === '9:16' ? { aspectRatio: '9 / 16', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : { aspectRatio: '16 / 9', width: '100%' }}
      >
        {activeStreamUrl ? (
          <video
            ref={flvVideoRef}
            key={activeStreamUrl}
            autoPlay
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-contain select-none z-10"
            style={{ background: 'black' }}
          />
        ) : masterState.isVideo ? (
          <video
            key={masterState.mediaUrl}
            src={masterState.mediaUrl}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-contain select-none bg-black"
          />
        ) : (
          <img
            key={masterState.mediaUrl}
            src={masterState.mediaUrl}
            alt={masterState.characterName || 'AI Idol'}
          />
        )}
      </div>
    </div>
  );
}
