import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameChienDau from './game/GameChienDau';
import { supabase } from '../../lib/supabaseClient';
import { loadAllAidolItems } from '../../utils/idbHelper';

/**
 * ⚡ CỬA SỔ MASTER OVERLAY 1 LINK DUY NHẤT TOÀN NĂNG — CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=live hoặc /overlay-live hoặc /live
 * - Đồng bộ 5 tầng: Supabase Cloud Realtime + WebSocket (Socket.io) + REST API Polling + BroadcastChannel + LocalStorage
 * - Tự động chuyển đổi giữa: AI Idol / Sàn Nhảy 3D / Game Bản Đồ 63 Tỉnh / Game Chiến Đấu PK / Live Camera Studio
 * - Hiển thị 100% VIDEO / STREAM SẠCH, không dính bất kỳ badge hay rác thông tin nào
 */
export default function CleanLiveOverlay() {
  const [masterState, setMasterState] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('avalive_master_live_state');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {}

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const overlayParam = urlParams ? urlParams.get('overlay') : '';
    const ratioParam = urlParams ? urlParams.get('ratio') : (saved?.aspectRatio || '9:16');
    const directVideoUrl = urlParams ? urlParams.get('v') : null;
    
    let defaultStage = 'idol'; // Mặc định AI Idol
    if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map' || pathname.includes('/bando')) defaultStage = 'bando';
    else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game' || pathname.includes('/battle')) defaultStage = 'battle';
    else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor' || pathname.includes('/dance')) defaultStage = 'dancefloor';
    else if (overlayParam === 'avatar' || overlayParam === 'idol' || pathname.includes('/idol')) defaultStage = 'idol';
    else if (overlayParam === 'broadcast' || overlayParam === 'studio' || pathname.includes('/studio')) defaultStage = 'broadcast';
    else if (saved && saved.stage) {
      defaultStage = saved.stage;
    }

    return {
      stage: defaultStage, // 'idol' | 'dancefloor' | 'battle' | 'bando' | 'broadcast'
      aspectRatio: ratioParam || '9:16',
      mediaUrl: saved?.mediaUrl || '/demo_dancer.mp4',
      flvUrl: directVideoUrl || saved?.flvUrl || null,
      isVideo: saved?.isVideo !== false,
      selectedCharacter: saved?.selectedCharacter || '',
      characterName: saved?.characterName || 'AI Idol Linh Anh',
      isConnected: true,
      isSpeaking: saved?.isSpeaking || false,
      speechText: saved?.speechText || '',
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const [liveEvent, setLiveEvent] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [localDbItems, setLocalDbItems] = useState([]);

  // Tải danh sách item từ IndexedDB của cửa sổ này để tái tạo Blob URL cục bộ
  useEffect(() => {
    loadAllAidolItems().then(items => {
      if (Array.isArray(items) && items.length > 0) {
        setLocalDbItems(items);
      }
    }).catch(() => {});

    const handleDbUpdate = () => {
      loadAllAidolItems().then(items => {
        if (Array.isArray(items) && items.length > 0) {
          setLocalDbItems(items);
        }
      }).catch(() => {});
    };
    window.addEventListener('aidol_db_updated', handleDbUpdate);
    return () => window.removeEventListener('aidol_db_updated', handleDbUpdate);
  }, []);

  // 📷 Webcam Stream Support cho OBS Studio & TikTok Live Studio
  const [overlayCamActive, setOverlayCamActive] = useState(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return urlParams?.get('cam') === '1' || urlParams?.get('webcam') === 'true';
  });
  const overlayWebcamVideoRef = useRef(null);
  const overlayWebcamStreamRef = useRef(null);

  const toggleOverlayCam = async () => {
    if (overlayCamActive) {
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(t => t.stop());
        overlayWebcamStreamRef.current = null;
      }
      setOverlayCamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        overlayWebcamStreamRef.current = stream;
        if (overlayWebcamVideoRef.current) {
          overlayWebcamVideoRef.current.srcObject = stream;
        }
        setOverlayCamActive(true);
      } catch (err) {
        console.warn('Overlay Camera notice:', err.message);
      }
    }
  };

  useEffect(() => {
    if (overlayCamActive && overlayWebcamVideoRef.current && overlayWebcamStreamRef.current) {
      overlayWebcamVideoRef.current.srcObject = overlayWebcamStreamRef.current;
    }
  }, [overlayCamActive]);

  useEffect(() => {
    return () => {
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    const backendUrl = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://localhost:3001';

    const applyMasterState = (data) => {
      if (!data) return;
      setMasterState(prev => {
        const next = { ...prev, ...data };
        // URL Parameter & Path Override check (nếu link là link chuyên dụng của 1 dự án thì cố định dự án đó)
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
        const overlayParam = urlParams ? urlParams.get('overlay') : '';
        if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map' || pathname.includes('/bando')) {
          next.stage = 'bando';
        } else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game' || pathname.includes('/battle')) {
          next.stage = 'battle';
        } else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor' || pathname.includes('/dance')) {
          next.stage = 'dancefloor';
        } else if (overlayParam === 'avatar' || overlayParam === 'idol' || pathname.includes('/idol')) {
          next.stage = 'idol';
        } else if (overlayParam === 'broadcast' || overlayParam === 'studio' || pathname.includes('/studio')) {
          next.stage = 'broadcast';
        }
        return next;
      });
    };

    // 1. SUPABASE REALTIME CLOUD BROADCAST
    let supabaseChannel = null;
    try {
      if (supabase && typeof supabase.channel === 'function') {
        supabaseChannel = supabase.channel('avalive_master_live_realtime', {
          config: { broadcast: { self: true } }
        });

        supabaseChannel.on('broadcast', { event: 'MASTER_LIVE_STATE_UPDATE' }, (payload) => {
          if (payload?.payload) {
            applyMasterState(payload.payload);
          }
        });

        supabaseChannel.on('broadcast', { event: 'LIVE_EVENT' }, (payload) => {
          if (payload?.payload) {
            setLiveEvent(payload.payload);
          }
        });

        supabaseChannel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            supabaseChannel.send({
              type: 'broadcast',
              event: 'REQUEST_MASTER_LIVE_STATE'
            }).catch(() => {});
          }
        });
      }
    } catch (e) {
      console.warn('[Overlay] Supabase Realtime note:', e.message);
    }

    // 2. HTTP REST API POLING
    const fetchLiveState = () => {
      const endpoint = backendUrl ? `${backendUrl}/api/live-state` : '/api/live-state';
      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          if (data && data.stage) {
            applyMasterState(data);
          }
        })
        .catch(() => {});
    };
    fetchLiveState();

    // 3. WEBSOCKET REALTIME (SOCKET.IO)
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
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('bando_event', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('battle_event', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });
    } catch (err) {
      console.warn('Socket.io note:', err);
    }

    // 4. BROADCAST CHANNELS
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

        masterChannel.postMessage({ type: 'REQUEST_MASTER_LIVE_STATE' });

        bandoChannel = new BroadcastChannel('avalive_bando_stage');
        bandoChannel.onmessage = (e) => {
          if (e.data?.lastEvent) setLiveEvent(e.data.lastEvent);
        };

        battleChannel = new BroadcastChannel('avalive_gamebattle_stage');
        battleChannel.onmessage = (e) => {
          if (e.data?.type === 'LIVE_EVENT') setLiveEvent(e.data.payload);
        };

        cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.onmessage = (e) => {
          if (e.data?.type === 'STREAM_MEDIA_UPDATE') {
            setMasterState(prev => ({
              ...prev,
              mediaUrl: e.data.mediaUrl,
              flvUrl: e.data.flvUrl,
              isVideo: e.data.isVideo,
              characterName: e.data.characterName,
              isConnected: e.data.isConnected
            }));
          }
        };
      } catch (err) {}
    }

    // 5. LOCAL STORAGE SYNC
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
            flvUrl: parsed.flvUrl,
            isVideo: parsed.isVideo,
            characterName: parsed.characterName,
            isConnected: parsed.isConnected
          }));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    // 6. HEARTBEAT POLLING
    let lastUpdatedTimestamp = 0;
    const pollInterval = setInterval(() => {
      try {
        const saved = localStorage.getItem('avalive_master_live_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.updatedAt && parsed.updatedAt > lastUpdatedTimestamp) {
            lastUpdatedTimestamp = parsed.updatedAt;
            applyMasterState(parsed);
          }
        }
      } catch (e) {}

      const endpoint = backendUrl ? `${backendUrl}/api/live-state` : '/api/live-state';
      fetch(endpoint)
        .then(r => r.json())
        .then(data => {
          if (data && data.updatedAt && data.updatedAt > lastUpdatedTimestamp) {
            lastUpdatedTimestamp = data.updatedAt;
            applyMasterState(data);
          }
        })
        .catch(() => {});
    }, 1500);

    return () => {
      if (supabaseChannel) supabaseChannel.unsubscribe();
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
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);

  const isStreamUrl = (u) => u && (u.includes('.flv') || u.includes('.m3u8') || u.includes('pull-flv') || u.includes('tiktokcdn.com') || u.includes('/stream') || u.includes('/game/') || u.includes('/stage/'));
  const activeStreamUrl = masterState.flvUrl || (isStreamUrl(masterState.mediaUrl) ? masterState.mediaUrl : null);

  const attachFlvPlayer = (videoEl, url) => {
    if (!videoEl || !url) return;
    try {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.destroy();
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        hlsPlayerRef.current.destroy();
        hlsPlayerRef.current = null;
      }

      if (url.includes('.m3u8') || url.includes('/hls')) {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(url);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoEl.play().catch(() => {});
          });
          hlsPlayerRef.current = hls;
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          videoEl.src = url;
          videoEl.play().catch(() => {});
        }
      } else if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url,
          isLive: true,
          cors: true,
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128
        });
        flvPlayer.attachMediaElement(videoEl);
        flvPlayer.load();
        flvPlayer.play().catch(() => {});
        flvPlayerRef.current = flvPlayer;
      }
    } catch (e) {
      console.warn('[Overlay Player error]:', e);
    }
  };

  useEffect(() => {
    if (activeStreamUrl && flvVideoRef.current) {
      attachFlvPlayer(flvVideoRef.current, activeStreamUrl);
    }
    return () => {
      if (flvPlayerRef.current) {
        try { flvPlayerRef.current.destroy(); } catch (e) {}
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        try { hlsPlayerRef.current.destroy(); } catch (e) {}
        hlsPlayerRef.current = null;
      }
    };
  }, [activeStreamUrl]);

  // Tự động phát video liên tục chống dừng
  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(vid => {
      vid.muted = isAudioMuted;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    });
  }, [masterState.mediaUrl, activeStreamUrl, overlayCamActive, isAudioMuted]);

  // Stage hiện tại
  const currentStage = masterState.stage || 'idol';
  const ratio = masterState.aspectRatio || '9:16';

  // 1. RENDER STAGE: GAME BẢN ĐỒ VIỆT NAM (CẮM CỜ 63 TỈNH THÀNH)
  if (currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center pointer-events-auto">
        <GameBanDoVietNam 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // 2. RENDER STAGE: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN
  if (currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center pointer-events-auto">
        <GameChienDau 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // Helper giải mã URL media chính xác (xử lý cross-window IndexedDB Blob)
  const resolveActiveMedia = () => {
    // 1. Nếu mediaUrl là HTTP URL bình thường hoặc base64 Data URL
    if (masterState.mediaUrl && !masterState.mediaUrl.startsWith('blob:')) {
      const cleanUrl = masterState.mediaUrl.split('?')[0].toLowerCase();
      const isImg = cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.png') || cleanUrl.endsWith('.webp') || cleanUrl.includes('unsplash') || masterState.mediaUrl.startsWith('data:image');
      const isVid = cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov') || cleanUrl.includes('demo_dancer') || cleanUrl.includes('preview/mixkit');

      return { 
        url: masterState.mediaUrl, 
        isVideo: isVid ? true : (isImg ? false : masterState.isVideo !== false)
      };
    }

    // 2. Tìm trong IndexedDB theo selectedCharacter
    if (masterState.selectedCharacter && localDbItems.length > 0) {
      const match = localDbItems.find(i => i.id === masterState.selectedCharacter);
      if (match && match.url) {
        return { url: match.url, isVideo: match.type === 'video' };
      }
    }

    // 3. Nếu là blob URL, tìm item tương ứng trong DB
    if (masterState.mediaUrl && masterState.mediaUrl.startsWith('blob:')) {
      if (localDbItems.length > 0) {
        const match = localDbItems.find(i => i.mediaUrl === masterState.mediaUrl || i.id === masterState.selectedCharacter);
        if (match && match.url) {
          return { url: match.url, isVideo: match.type === 'video' };
        }
      }
    }

    // 4. Mặc định Video Idol Dance Loop cực sắc nét
    return { url: '/demo_dancer.mp4', isVideo: true };
  };

  const activeMedia = resolveActiveMedia();

  // 3. RENDER STAGE: PHÒNG DỰNG LIVE STUDIO — 100% CLEAN VIDEO KHÔNG RÁC
  if (currentStage === 'broadcast' || currentStage === 'studio') {
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
          {overlayCamActive ? (
            <video
              ref={overlayWebcamVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover select-none bg-black"
            />
          ) : activeStreamUrl ? (
            <video
              ref={flvVideoRef}
              key={activeStreamUrl}
              autoPlay
              muted={isAudioMuted}
              playsInline
              className="w-full h-full object-cover select-none bg-black"
            />
          ) : activeMedia.isVideo ? (
            <video
              key={activeMedia.url}
              src={activeMedia.url}
              autoPlay
              loop
              muted={isAudioMuted}
              playsInline
              onError={(e) => {
                if (e.target.src !== window.location.origin + '/demo_dancer.mp4') {
                  e.target.src = '/demo_dancer.mp4';
                  e.target.play().catch(() => {});
                }
              }}
              onCanPlay={(e) => {
                e.target.play().catch(() => {});
              }}
              className="w-full h-full object-cover select-none bg-black"
            />
          ) : (
            <img
              src={activeMedia.url}
              alt="Studio Background"
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/demo_dancer.mp4';
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // 4. RENDER STAGE: AI IDOL LIVESTREAM — 100% CLEAN VIDEO / NGƯỜI DUY NHẤT (KHÔNG BADGE, KHÔNG RÁC)
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none">
      {/* Frame Container Responsive theo Tỷ Lệ 9:16 (TikTok Dọc) hoặc 16:9 (OBS Ngang) */}
      <div 
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          ratio === '9:16'
            ? 'h-full aspect-[9/16] w-auto max-w-full'
            : 'w-full aspect-[16/9] h-auto max-h-full'
        }`}
        style={ratio === '9:16' ? { aspectRatio: '9 / 16', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : { aspectRatio: '16 / 9', width: '100%' }}
      >
        {overlayCamActive ? (
          <video
            ref={overlayWebcamVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover select-none scale-x-[-1] bg-black"
          />
        ) : activeStreamUrl ? (
          <video
            ref={flvVideoRef}
            key={activeStreamUrl}
            autoPlay
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-cover select-none bg-black"
          />
        ) : activeMedia.isVideo ? (
          /* Video AI Idol MP4 60FPS Mặc Định Siêu Sắc Nét */
          <video
            key={activeMedia.url}
            src={activeMedia.url}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            onError={(e) => {
              if (e.target.src !== window.location.origin + '/demo_dancer.mp4') {
                e.target.src = '/demo_dancer.mp4';
                e.target.play().catch(() => {});
              }
            }}
            onCanPlay={(e) => {
              e.target.play().catch(() => {});
            }}
            className="w-full h-full object-cover select-none bg-black"
          />
        ) : (
          /* Ảnh Idol Sắc Nét 4K (Chống Màn Hình Đen Tuyệt Đối) */
          <img 
            src={activeMedia.url} 
            className="w-full h-full object-contain select-none"
            style={{ imageRendering: '-webkit-optimize-contrast', animation: 'idolBreathing 4s ease-in-out infinite' }}
            alt="AI Idol"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
            }}
          />
        )}
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes idolBreathing {
          0%, 100% {
            transform: scale(1) translateY(0px);
          }
          50% {
            transform: scale(1.015) translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
