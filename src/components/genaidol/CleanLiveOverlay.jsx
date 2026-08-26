import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameChienDau from './game/GameChienDau';
import ProductionStudio from '../ProductionStudio';
import { supabase } from '../../lib/supabaseClient';
import { Volume2, VolumeX, Sparkles, Video, Swords, Flag, Music, Radio, Mic } from 'lucide-react';

/**
 * ⚡ CỬA SỔ MASTER OVERLAY 1 LINK DUY NHẤT TOÀN NĂNG — CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=live hoặc /overlay-live hoặc /live
 * - Đồng bộ 5 tầng: Supabase Cloud Realtime + WebSocket (Socket.io) + REST API Polling + BroadcastChannel + LocalStorage
 * - Tự động chuyển đổi giữa: AI Idol / Sàn Nhảy 3D / Game Bản Đồ 63 Tỉnh / Game Chiến Đấu PK / Live Camera Studio
 * - Hỗ trợ mượt mà trên macOS, Windows, Web Cloud Vercel, OBS Studio, TikTok LIVE Studio CEF
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
    const ratioParam = urlParams ? urlParams.get('ratio') : (saved?.aspectRatio || '9:16');
    const directVideoUrl = urlParams ? urlParams.get('v') : null;
    
    let defaultStage = 'idol'; // Mặc định AI Idol
    if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map') defaultStage = 'bando';
    else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game') defaultStage = 'battle';
    else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor') defaultStage = 'dancefloor';
    else if (overlayParam === 'avatar' || overlayParam === 'idol') defaultStage = 'idol';
    else if (overlayParam === 'broadcast' || overlayParam === 'studio') defaultStage = 'broadcast';
    else if (saved && saved.stage) {
      defaultStage = saved.stage;
    }

    return {
      stage: defaultStage, // 'idol' | 'dancefloor' | 'battle' | 'bando' | 'broadcast'
      aspectRatio: ratioParam || '9:16',
      mediaUrl: saved?.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      flvUrl: directVideoUrl || saved?.flvUrl || null,
      isVideo: saved?.isVideo || false,
      characterName: saved?.characterName || 'AI Idol Linh Anh',
      isConnected: true,
      isSpeaking: saved?.isSpeaking || false,
      speechText: saved?.speechText || '',
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const [liveEvent, setLiveEvent] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

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
        // URL Parameter Override check
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const overlayParam = urlParams ? urlParams.get('overlay') : '';
        if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map') {
          next.stage = 'bando';
        } else if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game') {
          next.stage = 'battle';
        } else if (overlayParam === 'dancefloor' || overlayParam === 'dance' || overlayParam === 'dance-floor') {
          next.stage = 'dancefloor';
        }
        return next;
      });

      if (data.speechText) {
        setCurrentSubtitle(data.speechText);
        setTimeout(() => setCurrentSubtitle(''), 8000);
      }
    };

    // 1. SUPABASE REALTIME CLOUD BROADCAST (Đồng bộ siêu tốc cho OBS & TikTok Live Studio từ khắp nơi trên thế giới)
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

        supabaseChannel.subscribe();
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

      socket.on('tiktok_chat', (data) => {
        if (data) {
          setLiveEvent({ 
            type: 'COMMENT', 
            data: { 
              username: data.username || data.nickname, 
              text: data.comment, 
              comment: data.comment,
              userId: data.userId || 'user_' + Date.now(),
              avatar: data.profilePictureUrl || '',
              _ts: Date.now() 
            } 
          });
        }
      });

      socket.on('tiktok_gift', (data) => {
        if (data) {
          setLiveEvent({ 
            type: 'GIFT', 
            data: { 
              giftId: data.giftName || data.giftId || 'rose', 
              count: data.diamondCount || data.repeatCount || 1,
              userId: data.userId || 'guest_' + Date.now(),
              username: data.username || data.nickname || 'Khách Live',
              avatar: data.profilePictureUrl || '',
              _ts: Date.now()
            } 
          });
        }
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

      // Polling REST nhẹ
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
  const flvCanvasRef = useRef(null);
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

  // Handle autoPlay block in TikTok Live Studio / OBS CEF by forcing mute if play fails
  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(vid => {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked (usually due to audio) -> force mute and retry
          vid.muted = true;
          setIsAudioMuted(true);
          vid.play().catch(e => console.warn("Overlay Video Play Error:", e));
        });
      }
    });
  }, [masterState.mediaUrl, activeStreamUrl, overlayCamActive]);

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

  // 3. RENDER STAGE: PHÒNG DỰNG LIVE STUDIO CHUYÊN NGHIỆP
  if (currentStage === 'broadcast' || currentStage === 'studio') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center pointer-events-auto">
        <ProductionStudio 
          globalAspectRatio={ratio}
        />
      </div>
    );
  }

  // 4. RENDER STAGE: AI IDOL LIVESTREAM (CLEAN VIDEO ONLY)
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#070913] flex items-center justify-center select-none">
      
      {/* Background Dynamic Ambient Lighting */}
      <div className="absolute inset-0 bg-radial-at-t from-blue-900/30 via-purple-950/20 to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Frame Container Responsive theo Tỷ Lệ 9:16 (TikTok Dọc) hoặc 16:9 (OBS Ngang) */}
      <div 
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          ratio === '9:16'
            ? 'h-full aspect-[9/16] w-auto max-w-full'
            : 'w-full aspect-[16/9] h-auto max-h-full'
        }`}
        style={ratio === '9:16' ? { aspectRatio: '9 / 16', height: '100%', maxWidth: 'calc(100vh * 9 / 16)' } : { aspectRatio: '16 / 9', width: '100%' }}
      >
        
        {/* 1. Nguồn Webcam Live nếu được kích hoạt trên Overlay */}
        {overlayCamActive ? (
          <video
            ref={overlayWebcamVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover select-none z-10 scale-x-[-1] bg-black"
          />
        ) : activeStreamUrl ? (
          /* 2. Nguồn Video Trực Tiếp FLV / HLS nếu có */
          <video
            ref={flvVideoRef}
            key={activeStreamUrl}
            autoPlay
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-contain select-none z-10 bg-black"
          />
        ) : (masterState.isVideo || (masterState.mediaUrl && masterState.mediaUrl.endsWith('.mp4'))) ? (
          /* 3. Video MP4 Lặp Lại Mượt Mà 60FPS */
          <video
            key={masterState.mediaUrl || '/demo_dancer.mp4'}
            src={masterState.mediaUrl || '/demo_dancer.mp4'}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-contain select-none z-10 bg-black"
          />
        ) : (
          /* 4. Hình Ảnh AI Idol Sinh Động Có Chuyển Động Float & Ánh Sáng */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0e101f] via-[#090b16] to-[#04050a]">
            {/* Ambient Avatar Glow */}
            <div className="absolute inset-0 bg-radial-at-c from-cyan-500/20 via-transparent to-transparent animate-pulse" />
            
            <img
              key={masterState.mediaUrl || 'default-avatar'}
              src={masterState.mediaUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
              alt={masterState.characterName || 'AI Idol Linh Anh'}
              className="w-full h-full object-contain select-none z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-700 transform hover:scale-[1.02]"
              style={{
                animation: 'idolBreathing 4s ease-in-out infinite'
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Gradient Overlay phía dưới */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          </div>
        )}

        {/* 🔴 LIVE STATUS BADGE TOP-LEFT (CHỈNH CHU CHUẨN TIKTOK STUDIO) */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 uppercase tracking-wider text-[11px]">
              {currentStage === 'broadcast' ? '🔴 LIVE STUDIO 4K' : '🔴 LIVE AI IDOL'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300 text-xs font-bold shadow-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>{masterState.characterName || 'AI Idol Linh Anh'}</span>
          </div>
        </div>

        {/* Phụ đề MC AI khi đọc thoại */}
        {currentSubtitle && (
          <div className="absolute bottom-6 left-4 right-4 z-40 animate-fadeIn pointer-events-none">
            <div className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-cyan-400/50 text-white text-center shadow-2xl space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-cyan-300 uppercase">
                <Mic className="w-3 h-3 text-cyan-400 animate-bounce" />
                <span>MC AI ĐANG NÓI:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-yellow-200 leading-relaxed drop-shadow">
                "{currentSubtitle}"
              </p>
            </div>
          </div>
        )}

        {/* Nút Điều Khiển Camera & Âm Thanh Overlay Góc Phải Dưới */}
        <div className="absolute bottom-3 right-3 z-30 pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleOverlayCam}
            className={`p-2.5 rounded-full border shadow-xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer ${
              overlayCamActive 
                ? 'bg-pink-600/90 text-white border-pink-400 animate-pulse' 
                : 'bg-black/70 hover:bg-black/90 text-gray-300 border-white/20'
            }`}
            title={overlayCamActive ? 'Tắt Camera Overlay' : 'Bật Camera Webcam Trực Tiếp trên Overlay'}
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 shadow-xl backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            title={isAudioMuted ? 'Bật âm thanh Live' : 'Tắt tiếng Live'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

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
