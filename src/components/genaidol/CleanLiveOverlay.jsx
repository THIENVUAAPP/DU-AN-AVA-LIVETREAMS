import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import flvjs from 'flv.js';
import Hls from 'hls.js';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameBattleOverlay from './game/GameBattleOverlay';
import GameChienDau from './game/GameChienDau';
import { supabase } from '../../lib/supabaseClient';
import { loadAllAidolItems } from '../../utils/idbHelper';
import { 
  Play, Pause, Volume2, VolumeX, 
  Video, Flag, Swords, Tv, Eye, EyeOff, Sparkles, Monitor
} from 'lucide-react';

/**
 * ⚡ CỬA SỔ MASTER OVERLAY 1 LINK DUY NHẤT TOÀN NĂNG — CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=live hoặc /overlay-live hoặc /live
 * - Đồng bộ 5 tầng: Supabase Cloud Realtime + WebSocket (Socket.io) + REST API Polling + BroadcastChannel + LocalStorage
 * - Tự động chuyển đổi giữa: AI Idol / Sàn Nhảy 3D / Game Bản Đồ 63 Tỉnh / Game Chiến Đấu PK / Live Camera Studio
 * - Hiển thị 100% VIDEO / STREAM SẠCH, không dính bất kỳ badge hay rác thông tin nào
 */
const getBackendUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  const urlParams = new URLSearchParams(window.location.search);
  // Nếu có tham số ?backend= thì dùng luôn (override thủ công)
  const backendParam = urlParams.get('backend');
  if (backendParam) return backendParam;
  
  const hostname = window.location.hostname;
  const port = window.location.port;
  const proto = window.location.protocol;
  
  // Tunnel domains (trycloudflare.com, loca.lt, ngrok.io, v.v.)
  // => Cloudflare Tunnel PROXY MỌI REQUEST (HTTP + WebSocket) về localhost:3001 tự động
  // => PHẢI dùng same-origin (cùng domain tunnel), KHÔNG dùng localhost
  // => Vì HTTPS page → HTTP localhost = MIXED CONTENT bị chặn 100%!
  const isTunnelDomain = (
    hostname.includes('trycloudflare.com') ||
    hostname.includes('loca.lt') ||
    hostname.includes('ngrok') ||
    hostname.includes('serveo.net')
  );
  
  const isCloudDomain = (
    hostname.includes('vercel.app') ||
    hostname.includes('netlify.app')
  );
  
  if (isTunnelDomain) {
    // Same-origin: tất cả request đi qua tunnel → proxy về localhost:3001
    // WebSocket: wss://xxx.trycloudflare.com → tunnel → ws://localhost:3001
    // API: https://xxx.trycloudflare.com/api/... → tunnel → http://localhost:3001/api/...
    return `${proto}//${hostname}`;
  }
  
  if (isCloudDomain) {
    // Cloud deployment: API và WS cũng ở cùng origin
    return `${proto}//${hostname}`;
  }
  
  // Trường hợp chạy trực tiếp trên máy (localhost / IP local)
  const usePort = port && port !== '5173' && port !== '3000' ? port : '3001';
  return `http://${hostname}:${usePort}`;
};

export default function CleanLiveOverlay({ customStyle = {} }) {
  const overlayVideoRef = useRef(null);
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
      mediaUrl: directVideoUrl || (saved?.mediaUrl && !saved.mediaUrl.includes('nhep_mieng.mp4') && !saved.mediaUrl.includes('demo_dancer.mp4') ? saved.mediaUrl : null),
      flvUrl: directVideoUrl || saved?.flvUrl || null,
      isVideo: saved?.isVideo !== false,
      selectedCharacter: saved?.selectedCharacter || '',
      characterName: saved?.characterName || 'AvaLive VIP PRO',
      isConnected: true,
      isSpeaking: saved?.isSpeaking || false,
      speechText: saved?.speechText || '',
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const socketRef = useRef(null);
  const [liveEvent, setLiveEvent] = useState(null);
  const [isVideoAudioMuted, setIsVideoAudioMuted] = useState(() => {
    try {
      return localStorage.getItem('avalive_overlay_audio_muted') === 'true';
    } catch (e) {
      return false; // Mặc định mở tiếng để phát âm thanh
    }
  });
  const [videoVolume, setVideoVolume] = useState(() => {
    try {
      const v = localStorage.getItem('avalive_overlay_volume');
      return v ? parseFloat(v) : 1.0;
    } catch (e) {
      return 1.0;
    }
  });
  const [isPlayingState, setIsPlayingState] = useState(true);
  const [showControlDock, setShowControlDock] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (params?.get('clean') === '1' || params?.get('controls') === '0') return false;
    return true; // Mặc định hiển thị thanh điều khiển ngoại khung
  });
  const [objectFitState, setObjectFitState] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return params?.get('fit') === 'contain' ? 'contain' : 'cover';
  });

  const togglePlayPause = () => {
    const vid = overlayVideoRef.current;
    if (vid) {
      if (vid.paused) {
        vid.dataset.userPaused = 'false';
        vid.play().then(() => setIsPlayingState(true)).catch(() => {});
        if (socketRef.current) {
          socketRef.current.emit('UPDATE_MASTER_LIVE_STATE', { videoPlaybackEvent: 'play', isPlaying: true });
        }
        try {
          const bc = new BroadcastChannel('avalive_master_sync');
          bc.postMessage({ type: 'UPDATE_MASTER_LIVE_STATE', payload: { videoPlaybackEvent: 'play', isPlaying: true } });
          bc.close();
        } catch (e) {}
      } else {
        vid.dataset.userPaused = 'true';
        vid.pause();
        setIsPlayingState(false);
        if (socketRef.current) {
          socketRef.current.emit('UPDATE_MASTER_LIVE_STATE', { videoPlaybackEvent: 'pause', isPlaying: false, videoCurrentTime: vid.currentTime });
        }
        try {
          const bc = new BroadcastChannel('avalive_master_sync');
          bc.postMessage({ type: 'UPDATE_MASTER_LIVE_STATE', payload: { videoPlaybackEvent: 'pause', isPlaying: false, videoCurrentTime: vid.currentTime } });
          bc.close();
        } catch (e) {}
      }
    }
  };

  const toggleAudioMute = () => {
    setIsVideoAudioMuted(prev => {
      const next = !prev;
      try { localStorage.setItem('avalive_overlay_audio_muted', String(next)); } catch (e) {}
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach(v => {
        try {
          v.muted = next;
          if (!next) {
            v.volume = videoVolume;
          }
        } catch (e) {}
      });
      return next;
    });
  };

  const handleVolumeChange = (newVol) => {
    setVideoVolume(newVol);
    try { localStorage.setItem('avalive_overlay_volume', String(newVol)); } catch (e) {}
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      try {
        v.volume = newVol;
        if (newVol > 0) {
          v.muted = false;
        }
      } catch (e) {}
    });
    if (newVol > 0 && isVideoAudioMuted) {
      setIsVideoAudioMuted(false);
      try { localStorage.setItem('avalive_overlay_audio_muted', 'false'); } catch (e) {}
    }
  };

  const handleStageSwitch = (newStage) => {
    setMasterState(prev => ({ ...prev, stage: newStage }));
    if (socketRef.current) {
      socketRef.current.emit('UPDATE_MASTER_LIVE_STATE', { stage: newStage });
    }
    try {
      const bc = new BroadcastChannel('avalive_master_sync');
      bc.postMessage({ type: 'UPDATE_MASTER_LIVE_STATE', payload: { stage: newStage } });
      bc.close();
    } catch (e) {}
    try {
      localStorage.setItem('avalive_active_stage', newStage);
    } catch (e) {}
  };

  const toggleFitMode = () => {
    setObjectFitState(prev => prev === 'cover' ? 'contain' : 'cover');
  };

  const toggleAspectRatio = () => {
    setMasterState(prev => {
      const nextRatio = prev.aspectRatio === '9:16' ? '16:9' : '9:16';
      if (socketRef.current) {
        socketRef.current.emit('UPDATE_MASTER_LIVE_STATE', { aspectRatio: nextRatio });
      }
      return { ...prev, aspectRatio: nextRatio };
    });
  };
  const [localDbItems, setLocalDbItems] = useState([]);
  const [hasStudioFrame, setHasStudioFrame] = useState(false);
  const studioImageRef = useRef(null);

  const updateStudioFrame = (frameData) => {
    if (frameData) {
      if (!hasStudioFrame) setHasStudioFrame(true);
      if (studioImageRef.current) {
        studioImageRef.current.src = frameData;
      }
    }
  };

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

  // ⚡ ANTI-OCCLUSION & ANTI-FREEZE KEEP-ALIVE ENGINE CHO TIKTOK LIVE STUDIO & OBS WINDOW CAPTURE
  // Khắc phục triệt để lỗi đứng hình khi cửa sổ bị che khuất hoặc không nằm đè lên trên
  useEffect(() => {
    // 1. Silent Web Audio API Heartbeat: Báo cho Chromium biết cửa sổ đang phát âm thanh ngầm
    // khiến Chromium KHÔNG BAO GIỜ ngắt / đóng băng tiến trình dù bị che khuất hoặc nằm dưới
    let audioCtx = null;
    let osc = null;
    const startAudioKeepAlive = () => {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        if (AudioCtxClass && !audioCtx) {
          audioCtx = new AudioCtxClass();
          osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          gain.gain.value = 0.00001; // Âm lượng siêu nhỏ không thể nghe thấy
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
      } catch (e) {}
    };
    startAudioKeepAlive();
    window.addEventListener('click', startAudioKeepAlive, { once: true });
    window.addEventListener('focus', startAudioKeepAlive);

    // 2. Off-Thread Web Worker 60FPS Ticker: Web Worker chạy trên luồng riêng, không bị ảnh hưởng bởi Windows DWM Occlusion
    let worker = null;
    let flushCanvas = null;
    try {
      const workerCode = `
        let t = null;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            if (t) clearInterval(t);
            t = setInterval(function() { self.postMessage('tick'); }, 16.6); // 60 FPS
          } else if (e.data === 'stop') {
            if (t) clearInterval(t);
            t = null;
          }
        };
      `;
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      worker = new Worker(URL.createObjectURL(blob));

      // Tạo canvas 2x2 siêu nhẹ ép Windows Compositor luôn nhận khung hình mới liên tục
      flushCanvas = document.createElement('canvas');
      flushCanvas.width = 2;
      flushCanvas.height = 2;
      flushCanvas.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:999999;';
      document.body.appendChild(flushCanvas);
      const ctx = flushCanvas.getContext('2d');
      let flip = false;

      worker.onmessage = () => {
        if (ctx) {
          flip = !flip;
          ctx.fillStyle = flip ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.01)';
          ctx.fillRect(0, 0, 2, 2);
        }
        // Kiểm tra giữ luồng video luôn chạy
        const v = overlayVideoRef.current;
        if (v && v.paused && v.dataset.userPaused !== 'true') {
          v.play().catch(() => {});
        }
      };
      worker.postMessage('start');
    } catch (e) {
      console.warn('[KeepAlive Worker] Note:', e);
    }

    // 3. Spoof Document Visibility: Đánh lừa Chromium để luôn báo cửa sổ đang hiển thị chính
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}

    // 4. Wake Lock: Chống tắt màn hình / sleep máy
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').catch(() => {});
    }

    return () => {
      if (worker) {
        worker.postMessage('stop');
        worker.terminate();
      }
      if (flushCanvas && flushCanvas.parentNode) {
        flushCanvas.parentNode.removeChild(flushCanvas);
      }
      if (osc) {
        try { osc.stop(); } catch (e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
      }
      window.removeEventListener('focus', startAudioKeepAlive);
    };
  }, []);

  useEffect(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isCapture = urlParams?.get('mode') === 'window_capture' || urlParams?.get('capture') === '1';
    if (isCapture) {
      document.title = '[AvaLive VIP PRO] - Cửa Sổ Live 9:16 (Window Capture)';
    } else {
      document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
    }
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    // 5 TẦNG ĐỒNG BỘ: KẾT NỐI VÀ TỰ ĐỘNG PHỤC HỒI
    let isSubscribed = true;

    const applyMasterState = (data) => {
      if (!data) return;

      // 🎬 ĐỒNG BỘ PLAY / PAUSE LẬP TỨC VỚI PHẦN MỀM (Phần mềm chạy -> TikTok Studio chạy, phần mềm dừng -> dừng)
      const vid = overlayVideoRef.current;
      if (vid) {
        if (data.videoPlaybackEvent === 'pause' || data.isPlaying === false) {
          vid.dataset.userPaused = 'true';
          if (!vid.paused) vid.pause();
          setIsPlayingState(false);
        } else if (data.videoPlaybackEvent === 'play' || data.isPlaying === true) {
          vid.dataset.userPaused = 'false';
          vid.muted = isVideoAudioMuted;
          vid.volume = videoVolume;
          if (vid.paused) vid.play().then(() => setIsPlayingState(true)).catch(() => {});
          setIsPlayingState(true);
        }
      }

      setMasterState(prev => {
        // Kiểm tra xem có trường dữ liệu quan trọng nào thực sự thay đổi không
        let hasDiff = false;
        const keys = ['stage', 'aspectRatio', 'mediaUrl', 'flvUrl', 'isVideo', 'selectedCharacter', 'characterName', 'videoPlaybackEvent', 'isPlaying', 'isDarkMode'];
        for (const k of keys) {
          if (data[k] !== undefined && data[k] !== prev[k]) {
            hasDiff = true;
            break;
          }
        }
        if (data.videoPlaybackEvent === 'seeked' && data.videoCurrentTime !== undefined) {
          hasDiff = true;
        }

        if (!hasDiff) return prev; // Không thay đổi thì giữ nguyên reference, tránh kích hoạt re-render

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
        
        // Cập nhật lại IDB nếu nhân vật thay đổi (vì sự kiện tải file không bắn chéo cửa sổ được)
        if (prev.selectedCharacter !== next.selectedCharacter) {
           loadAllAidolItems().then(items => {
             if (Array.isArray(items) && items.length > 0) setLocalDbItems(items);
           }).catch(() => {});
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

    // Xoá Fast Preload Media sau khi React đã mount và chuẩn bị phát video thật (tránh màn hình đen 0.5s)
    setTimeout(() => {
      const preload = document.getElementById('fast-preload-media');
      if (preload) {
        preload.style.transition = 'opacity 0.3s ease';
        preload.style.opacity = '0';
        setTimeout(() => preload.remove(), 300);
      }
    }, 800);

    // 2. HTTP REST API POLING
    const fetchLiveState = () => {
      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/live-state` : '/api/live-state';
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
    
    // Polling siêu tốc mỗi 200ms để đảm bảo nhận video mới ngay lập tức
    const httpPollInterval = setInterval(fetchLiveState, 200);

    // 3. WEBSOCKET REALTIME (SOCKET.IO)
    let socket = null;
    try {
      socket = io(getBackendUrl(), {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
        if (data) applyMasterState(data);
      });

      socket.on('LIVE_EVENT', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('battle_event', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
      });

      socket.on('tiktok_gift', (data) => {
        if (!data) return;
        setLiveEvent({
          type: 'GIFT',
          data: {
            giftId: data.giftId,
            giftName: data.giftName,
            count: data.repeatCount || data.count || 1,
            diamondCount: data.diamondCount || 1,
            userId: data.userId || data.uniqueId || 'tiktok_guest',
            username: data.nickname || data.username || data.uniqueId || 'Khách Live',
            avatar: data.profilePictureUrl || data.avatar || '',
            regionTarget: data.regionTarget || null,
            faction: data.faction || (Math.random() < 0.5 ? 'blue' : 'red')
          },
          _ts: Date.now()
        });
      });

      socket.on('tiktok_chat', (data) => {
        if (!data) return;
        const text = data.comment || data.text || '';
        const author = data.nickname || data.username || data.uniqueId || 'Khán Giả';
        const userId = data.userId || data.uniqueId || 'chat_user';
        const avatar = data.profilePictureUrl || data.avatar || '';
        setLiveEvent({
          type: 'COMMENT',
          data: { comment: text, text, username: author, nickname: author, userId, avatar },
          _ts: Date.now()
        });
      });

      socket.on('bando_sync', (data) => {
        if (data) setLiveEvent({ type: 'BANDO_SYNC', data, _ts: Date.now() });
      });

      socket.on('battle_sync', (data) => {
        if (data) setLiveEvent({ type: 'BATTLE_SYNC', data, _ts: Date.now() });
      });

      socket.on('STUDIO_CAM_FRAME', (frameData) => {
        if (frameData) updateStudioFrame(frameData);
      });
    } catch (err) {
      console.warn('Socket.io note:', err);
    }

    // 4. BROADCAST CHANNELS
    let masterChannel = null;
    let bandoChannel = null;
    let battleChannel = null;
    let cleanChannel = null;
    let studioCamBc = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        studioCamBc = new BroadcastChannel('avalive_studio_cam_feed');
        studioCamBc.onmessage = (e) => {
          if (e.data?.frame) {
            updateStudioFrame(e.data.frame);
          }
        };

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

    // 5. POLLING REALTIME STUDIO CAM FRAME (Truyền hình thời gian thực cho OBS & TikTok Live Studio)
    const frameInterval = setInterval(() => {
      const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
      const isStudio = pathname.includes('/studio') || window.location.search.includes('studio') || window.location.search.includes('broadcast') || masterState?.stage === 'broadcast' || masterState?.stage === 'studio' || masterState?.isScreenSharing;
      if (!isStudio) return;

      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/studio-frame?t=${Date.now()}` : `/api/studio-frame?t=${Date.now()}`;
      fetch(endpoint, { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data && data.frame) {
            updateStudioFrame(data.frame);
          }
        })
        .catch(() => {});
    }, 100);

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

      const endpoint = getBackendUrl() ? `${getBackendUrl()}/api/live-state` : '/api/live-state';
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
      clearInterval(httpPollInterval);
      clearInterval(frameInterval);
      clearInterval(pollInterval);
      if (supabaseChannel) supabaseChannel.unsubscribe();
      if (socket) socket.disconnect();
      socketRef.current = null;
      if (studioCamBc) studioCamBc.close();
      if (masterChannel) masterChannel.close();
      if (bandoChannel) bandoChannel.close();
      if (battleChannel) battleChannel.close();
      if (cleanChannel) cleanChannel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const flvVideoRef = useRef(null);
  const flvPlayerRef = useRef(null);
  const hlsPlayerRef = useRef(null);

  const isStreamUrl = (u) => typeof u === 'string' && (u.endsWith('.flv') || u.endsWith('.m3u8') || u.includes('.flv?') || u.includes('.m3u8?') || u.includes('pull-flv'));
  const activeStreamUrl = masterState.flvUrl && isStreamUrl(masterState.flvUrl) ? masterState.flvUrl : null;

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

  // Tự động phát hoặc tạm dừng video theo điều khiển từ Dashboard
  useEffect(() => {
    if (masterState.videoPlaybackEvent === 'pause' || masterState.isPlaying === false) {
      if (overlayVideoRef.current) {
        overlayVideoRef.current.dataset.userPaused = 'true';
        overlayVideoRef.current.pause();
      }
      return;
    }
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(vid => {
      vid.muted = isVideoAudioMuted;
      if (!isVideoAudioMuted) vid.volume = videoVolume;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    });
  }, [masterState.mediaUrl, activeStreamUrl, overlayCamActive, isVideoAudioMuted, videoVolume, masterState.videoPlaybackEvent, masterState.isPlaying]);

  // Tự động kích hoạt Camera khi mở chế độ Studio (phải nằm trước các early return để tuân thủ React Rules of Hooks)
  useEffect(() => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const isStudioRoute = masterState.stage === 'broadcast' || masterState.stage === 'studio' || pathname.includes('/studio');
    
    if (isStudioRoute) {
      if (!overlayWebcamStreamRef.current && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
          .then(stream => {
            overlayWebcamStreamRef.current = stream;
            if (overlayWebcamVideoRef.current) {
              overlayWebcamVideoRef.current.srcObject = stream;
            }
            setOverlayCamActive(true);
          })
          .catch(err => {
            console.warn('[Studio Camera] Notice:', err.message);
          });
      }
    } else {
      // STOP NATIVE CAMERA WHEN LEAVING STUDIO MODE TO PREVENT OVERRIDING
      if (overlayWebcamStreamRef.current) {
        overlayWebcamStreamRef.current.getTracks().forEach(track => {
          try { track.stop(); } catch (e) {}
        });
        overlayWebcamStreamRef.current = null;
      }
      if (overlayWebcamVideoRef.current) {
        overlayWebcamVideoRef.current.srcObject = null;
      }
      setOverlayCamActive(false);
    }
  }, [masterState.stage]);

  // Đồng bộ Play/Pause & Tua video theo thời gian thực từ phần mềm (Dashboard)
  useEffect(() => {
    if (overlayVideoRef.current && masterState.videoPlaybackEvent) {
      try {
        const v = overlayVideoRef.current;
        if (masterState.videoPlaybackEvent === 'play' || masterState.isPlaying === true) {
          v.dataset.userPaused = 'false';
          if (v.paused) v.play().catch(() => {});
        } else if (masterState.videoPlaybackEvent === 'pause' || masterState.isPlaying === false) {
          v.dataset.userPaused = 'true';
          if (!v.paused) v.pause();
        }
        
        // 🚀 CHỈ ĐỒNG BỘ SEEK KHI STREAMER THỰC SỰ TUA (seeked)
        // Tuyệt đối không can thiệp currentTime khi đang phát bình thường, tránh loop reset về 0 làm đứng/giật video 1-2 tiếng!
        if (masterState.videoPlaybackEvent === 'seeked' && typeof masterState.videoCurrentTime === 'number') {
           const timeDiff = Math.abs(v.currentTime - masterState.videoCurrentTime);
           if (timeDiff > 2.0) {
              v.currentTime = masterState.videoCurrentTime;
           }
        }
      } catch (e) {}
    }
  }, [masterState.videoPlaybackEvent, masterState.videoCurrentTime, masterState.isPlaying]);

  // 🎯 WINDOW SURFACE INVALIDATOR & ANTI-THROTTLING
  // Giúp OBS/TikTok Studio bắt được hình khi dùng Window Capture, kể cả khi Chrome bị ẩn (minimized/background).
  useEffect(() => {
    const antiSleepDiv = document.createElement('div');
    antiSleepDiv.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0.001;z-index:99999;background:white;';
    document.body.appendChild(antiSleepDiv);
    
    let frameCount = 0;
    const invalidate = () => {
      frameCount++;
      antiSleepDiv.style.background = frameCount % 2 === 0 ? '#000000' : '#ffffff';
    };

    // Web Worker Lightweight Keep-Alive (Không ngốn CPU, giữ video hoạt động mượt 60FPS)
    let bgWorker = null;
    try {
      const blob = new Blob([
        "let t; self.onmessage=e=>{ if(e.data==='start'){ if(!t) t=setInterval(()=>self.postMessage('tick'), 200); } else if(e.data==='stop'){ clearInterval(t); t=null; } };"
      ], { type: 'application/javascript' });
      bgWorker = new Worker(URL.createObjectURL(blob));
      let tickCounter = 0;
      bgWorker.onmessage = () => {
        invalidate();
        tickCounter++;
        if (tickCounter % 3 === 0 && document.hidden) {
          if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
              if (v.paused && !v.ended && v.readyState >= 2) {
                v.play().catch(() => {});
              }
            });
          }
        }
      };
      bgWorker.postMessage('start');
    } catch (e) {}

    return () => {
      if (bgWorker) {
        try { bgWorker.postMessage('stop'); bgWorker.terminate(); } catch (e) {}
      }
      if (antiSleepDiv.parentNode) antiSleepDiv.parentNode.removeChild(antiSleepDiv);
    };
  }, []);

  // 🕒 24/7 CONTINUOUS PLAYBACK WATCHDOG (TỰ ĐỘNG PHỤC HỒI & PHÁT LIÊN TỤC 24/24)
  useEffect(() => {
    const watchdogTimer = setInterval(() => {
      const vid = overlayVideoRef.current;
      if (!vid) return;

      // Nếu không có lệnh tạm dừng từ streamer và video bị dừng ngoài ý muốn trong khi đã nạp đủ buffer
      if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
        if (vid.paused && vid.readyState >= 2 && !vid.seeking) {
          vid.muted = isVideoAudioMuted;
          if (!isVideoAudioMuted) vid.volume = videoVolume;
          vid.play().catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      }
    }, 2000);

    return () => clearInterval(watchdogTimer);
  }, [masterState.videoPlaybackEvent, masterState.isPlaying, isVideoAudioMuted, videoVolume]);

  // Helper giải mã URL media chính xác (tôn trọng 100% video/nhân vật người dùng chọn)
  const resolveActiveMedia = () => {
    let candidateUrl = masterState.mediaUrl || null;
    let isVideo = masterState.isVideo !== false;

    // 1. Ưu tiên số 1: Trực tiếp từ masterState.mediaUrl (được Dashboard bắn sang thời gian thực)
    if (masterState.mediaUrl) {
      candidateUrl = masterState.mediaUrl;
    } else if (masterState.selectedCharacter && localDbItems.length > 0) {
      const match = localDbItems.find(i => i.id === masterState.selectedCharacter);
      if (match && (match.mediaUrl || match.url)) {
        candidateUrl = match.mediaUrl || match.url;
      }
    }

    // 2. Kiểm tra trong danh sách custom characters người dùng đã tải lên
    if (!candidateUrl) {
      try {
        const customRaw = localStorage.getItem('avalive_custom_characters');
        if (customRaw) {
          const customList = JSON.parse(customRaw);
          const customFound = customList.find(c => c.id === masterState.selectedCharacter);
          if (customFound && (customFound.url || customFound.mediaUrl)) {
            candidateUrl = customFound.url || customFound.mediaUrl;
          }
        }
      } catch (e) {}
    }

    // 2.5. Kiểm tra video đã được người dùng chọn phát cố định (Persistent Lock)
    if (!candidateUrl) {
      try {
        const locked = localStorage.getItem('avalive_user_locked_media');
        if (locked && typeof locked === 'string') {
          candidateUrl = locked;
        }
      } catch (e) {}
    }

    // 3. Khôi phục Blob URL từ IndexedDB nếu là video tùy chỉnh, hoặc bỏ qua nếu blob không tồn tại ở cửa sổ này
    if (typeof candidateUrl === 'string' && candidateUrl.startsWith('blob:')) {
      const match = localDbItems.find(i => i.id === masterState.selectedCharacter);
      if (match && match.fileBlob) {
        try {
          candidateUrl = URL.createObjectURL(match.fileBlob);
        } catch (e) {}
      } else if (match && (match.mediaUrl || match.url) && !match.mediaUrl?.startsWith('blob:')) {
        candidateUrl = match.mediaUrl || match.url;
      } else {
        candidateUrl = null;
      }
    }

    // 4. Tuyệt đối loại bỏ video nền cũ nếu có trong cache
    if (typeof candidateUrl === 'string' && (candidateUrl.includes('nhep_mieng.mp4') || candidateUrl.includes('demo_dancer.mp4'))) {
      candidateUrl = null;
    }

    // 5. Chuẩn hoá tuyệt đối URL cho HTTPS Overlay (TikTok Live Studio / OBS Browser Source)
    if (typeof candidateUrl === 'string') {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

      // Loại bỏ tiền tố http/https lặp lại
      if (candidateUrl.includes('http://') && candidateUrl.lastIndexOf('http://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('http://'));
      } else if (candidateUrl.includes('https://') && candidateUrl.lastIndexOf('https://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('https://'));
      }

      // Chuẩn hoá đường dẫn file upload sang origin hiện tại (Tránh Mixed Content và CORS 100%)
      if (candidateUrl.includes('/uploads/')) {
        const pathPart = candidateUrl.substring(candidateUrl.indexOf('/uploads/'));
        candidateUrl = currentOrigin ? `${currentOrigin}${pathPart}` : pathPart;
      } else if (candidateUrl.startsWith('/')) {
        candidateUrl = currentOrigin ? `${currentOrigin}${candidateUrl}` : candidateUrl;
      } else if (isHttps && candidateUrl.startsWith('http://')) {
        try {
          const parsed = new URL(candidateUrl);
          if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.includes('nip.io')) {
            candidateUrl = `${currentOrigin}${parsed.pathname}${parsed.search}`;
          }
        } catch (e) {}
      }
    }

    // 6. Xác định chính xác video hay ảnh
    if (typeof candidateUrl === 'string') {
      const lower = candidateUrl.toLowerCase();
      if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.includes('/uploads/')) {
        isVideo = true;
      } else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
        isVideo = false;
      }
    }

    return { url: candidateUrl, isVideo };
  };

  const activeMedia = resolveActiveMedia();

  // 🎬 TỰ ĐỘNG PHÁT NGAY KHI ĐỔI VIDEO / NHÂN VẬT TỪ PHẦN MỀM
  useEffect(() => {
    const vid = overlayVideoRef.current;
    if (vid && activeMedia.url && activeMedia.isVideo) {
      if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
        vid.dataset.userPaused = 'false';
        vid.muted = isVideoAudioMuted;
        if (!isVideoAudioMuted) vid.volume = videoVolume;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            vid.muted = true;
            vid.play().catch(() => {});
          });
        }
      }
    }
  }, [activeMedia.url, isVideoAudioMuted, videoVolume]);

  // 4 SÂN KHẤU: ĐƯỢC LỒNG TRONG KHUNG PHÁT SÓNG SẠCH 100% CỐ ĐỊNH TỈ LỆ
  // BÊN TRÊN LÀ THANH ĐIỀU KHIỂN NGOẠI KHUNG (NẰM NGOÀI KHUNG HÌNH LIVE ĐỂ KHÔNG CHÈN VÀO OBS)
  const currentStage = masterState.stage || 'idol';
  const ratio = masterState.aspectRatio || '9:16';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col bg-black select-none font-sans">
      {/* 1. THANH ĐIỀU KHIỂN NGOẠI KHUNG (NẰM HOÀN TOÀN BÊN NGOÀI KHUNG HÌNH PHÁT VIDEO OBS) */}
      {showControlDock && (
        <header className="w-full h-12 min-h-[48px] bg-gradient-to-r from-[#0a0c16] via-[#101426] to-[#0a0c16] border-b border-cyan-500/40 px-3 flex items-center justify-between z-50 text-white shadow-2xl select-none">
          {/* Trái: Trạng thái Live & Tỷ lệ */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 text-[10px] font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>LIVE 60FPS</span>
            </div>
            <button
              onClick={toggleAspectRatio}
              className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 px-2 py-1 rounded-md transition-all cursor-pointer"
              title="Chuyển đổi tỷ lệ: 9:16 Dọc (TikTok Live) vs 16:9 Ngang (OBS)"
            >
              {ratio === '9:16' ? '📱 9:16 DỌC (TIKTOK)' : '🖥️ 16:9 NGANG (OBS)'}
            </button>
          </div>

          {/* Giữa: CÁC NÚT ĐIỀU KHIỂN CỐT LÕI (DỪNG/CHẠY, BẬT/TẮT ÂM THANH, CHUYỂN SÂN KHẤU) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Nút Play / Pause */}
            <button
              onClick={togglePlayPause}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0 ${
                isPlayingState 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 border border-emerald-400/50' 
                  : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-amber-500/30 border border-amber-400/50 animate-pulse'
              }`}
              title={isPlayingState ? "Tạm dừng video phát sóng" : "Tiếp tục phát video"}
            >
              {isPlayingState ? <Pause size={13} className="fill-white" /> : <Play size={13} className="fill-white" />}
              <span>{isPlayingState ? 'TẠM DỪNG' : 'TIẾP TỤC'}</span>
            </button>

            {/* Nút Bật / Tắt Âm Thanh (Mute / Unmute) */}
            <button
              onClick={toggleAudioMute}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer shrink-0 ${
                !isVideoAudioMuted 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/30 border border-cyan-400/50' 
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/50'
              }`}
              title={isVideoAudioMuted ? "Bấm để MỞ TIẾNG cho video (Phát âm thanh siêu thực ra loa / OBS)" : "Bấm để TẮT TIẾNG (Mute)"}
            >
              {!isVideoAudioMuted ? <Volume2 size={14} className="text-yellow-300 animate-pulse" /> : <VolumeX size={14} className="text-rose-400" />}
              <span>{!isVideoAudioMuted ? 'MỞ TIẾNG (HD)' : 'TẮT TIẾNG'}</span>
            </button>

            {/* Thanh chỉnh âm lượng (khi đang mở tiếng) */}
            {!isVideoAudioMuted && (
              <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-lg border border-white/10 shrink-0" title="Chỉnh âm lượng">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={videoVolume} 
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} 
                  className="w-16 h-1.5 accent-cyan-400 cursor-pointer"
                />
                <span className="text-[9.5px] font-mono font-bold text-gray-300 w-6 text-right">
                  {Math.round(videoVolume * 100)}%
                </span>
              </div>
            )}

            {/* Vách ngăn */}
            <div className="w-px h-5 bg-white/20 mx-1 shrink-0"></div>

            {/* BỘ CHUYỂN TRANG / SÂN KHẤU LIVE 1-CLICK (KHÔNG GÂY LỆCH TỌA ĐỘ TRÊN OBS) */}
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/10 shrink-0">
              <button
                onClick={() => handleStageSwitch('idol')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentStage === 'idol' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Chuyển sang màn hình Idol AI Livestream"
              >
                <Video size={12} className={currentStage === 'idol' ? 'text-yellow-300' : 'text-gray-400'} />
                <span>Idol AI</span>
              </button>

              <button
                onClick={() => handleStageSwitch('bando')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  (currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') 
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-md shadow-amber-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Chuyển sang Game Ghép Cờ Bản Đồ Việt Nam"
              >
                <Flag size={12} className={(currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') ? 'text-yellow-200' : 'text-gray-400'} />
                <span>Bản Đồ</span>
              </button>

              <button
                onClick={() => handleStageSwitch('battle')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  (currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') 
                    ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md shadow-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Chuyển sang Game Chiến Đấu PK Đại Chiến"
              >
                <Swords size={12} className={(currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') ? 'text-yellow-300' : 'text-gray-400'} />
                <span>Chiến Đấu</span>
              </button>

              <button
                onClick={() => handleStageSwitch('broadcast')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  (currentStage === 'broadcast' || currentStage === 'studio') 
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Chuyển sang Phòng Dựng Camera Studio 4K"
              >
                <Tv size={12} className={(currentStage === 'broadcast' || currentStage === 'studio') ? 'text-yellow-300' : 'text-gray-400'} />
                <span>Studio 4K</span>
              </button>
            </div>
          </div>

          {/* Phải: Chế độ Fit & Thu gọn bar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleFitMode}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Chuyển đổi cách hiển thị video: Cover (Phủ kín 100%) vs Contain (Vừa vặn nguyên bản)"
            >
              {objectFitState === 'contain' ? 'Fit: Vừa Vặn' : 'Fit: Phủ Kín'}
            </button>

            <button
              onClick={() => setShowControlDock(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Thu gọn thanh điều khiển (Di chuột lên mép trên để mở lại)"
            >
              <EyeOff size={14} />
            </button>
          </div>
        </header>
      )}

      {/* Floating Toggle Button khi thanh Dock bị thu gọn */}
      {!showControlDock && (
        <button
          onClick={() => setShowControlDock(true)}
          className="absolute top-2 right-2 z-50 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-cyan-400 hover:text-white border border-cyan-500/40 text-[10px] font-bold shadow-lg transition-all opacity-40 hover:opacity-100 flex items-center gap-1 cursor-pointer"
          title="Mở thanh điều khiển Play/Pause, Âm thanh & Chuyển Sân Khấu"
        >
          <Eye size={12} />
          <span>Mở Điều Khiển</span>
        </button>
      )}

      {/* 2. KHUNG PHÁT SÓNG SẠCH 100% (CHUẨN 9:16 HOẶC 16:9 - KHÔNG CÓ BẤT KỲ NÚT BẤM NÀO ĐÈ LÊN) */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
        <div 
          className={`relative flex items-center justify-center overflow-hidden transition-all duration-200 ${
            ratio === '9:16'
              ? 'h-full aspect-[9/16] w-auto max-w-full'
              : 'w-full aspect-[16/9] h-auto max-h-full'
          }`}
          style={
            ratio === '9:16' 
              ? { 
                  aspectRatio: '9 / 16', 
                  height: '100%', 
                  maxWidth: showControlDock ? 'calc((100vh - 48px) * 9 / 16)' : 'calc(100vh * 9 / 16)' 
                } 
              : { aspectRatio: '16 / 9', width: '100%' }
          }
        >
          {/* SÂN KHẤU 1: LIVE AI IDOL (Duy trì thường trực trong DOM để không bao giờ bị reset video) */}
          <div 
            style={{ display: currentStage === 'idol' ? 'flex' : 'none' }}
            className="w-full h-full absolute inset-0 items-center justify-center overflow-hidden bg-black"
          >
            {activeMedia.url && activeMedia.isVideo ? (
              <video
                ref={overlayVideoRef}
                key={activeMedia.url}
                src={activeMedia.url}
                autoPlay={masterState.videoPlaybackEvent !== 'pause'}
                loop
                muted={isVideoAudioMuted}
                playsInline
                controls={false}
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  v.muted = isVideoAudioMuted;
                  v.volume = videoVolume;
                  if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
                    v.dataset.userPaused = 'false';
                    v.play().then(() => setIsPlayingState(true)).catch(() => {});
                  } else {
                    v.dataset.userPaused = 'true';
                    v.pause();
                    setIsPlayingState(false);
                  }
                }}
                onPlay={() => setIsPlayingState(true)}
                onPause={() => setIsPlayingState(false)}
                onCanPlay={(e) => {
                  const v = e.currentTarget;
                  v.muted = isVideoAudioMuted;
                  v.volume = videoVolume;
                  if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false && v.paused) {
                    v.dataset.userPaused = 'false';
                    v.play().then(() => setIsPlayingState(true)).catch(() => {});
                  }
                }}
                onWaiting={() => {}}
                onStalled={() => {
                  const v = overlayVideoRef.current;
                  if (v && v.paused && masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
                    v.play().then(() => setIsPlayingState(true)).catch(() => {});
                  }
                }}
                onEnded={(e) => {
                  e.currentTarget.currentTime = 0;
                  if (masterState.videoPlaybackEvent !== 'pause' && masterState.isPlaying !== false) {
                    e.currentTarget.play().then(() => setIsPlayingState(true)).catch(() => {});
                  }
                }}
                onError={(e) => {
                  console.warn('[CleanLiveOverlay] Video reconnecting in 500ms...', e);
                  setTimeout(() => {
                    const v = overlayVideoRef.current;
                    if (v && activeMedia.url) {
                      v.src = activeMedia.url;
                      v.load();
                      v.play().catch(() => {});
                    }
                  }, 500);
                }}
                className="w-full h-full select-none absolute inset-0 transform-gpu"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: objectFitState || 'cover',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  imageRendering: '-webkit-optimize-contrast',
                  willChange: 'transform'
                }}
              />
            ) : activeStreamUrl ? (
              <video
                ref={flvVideoRef}
                key={activeStreamUrl}
                autoPlay
                muted={isVideoAudioMuted}
                playsInline
                className="w-full h-full object-cover select-none bg-black absolute inset-0"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : activeMedia.url ? (
              <img 
                src={activeMedia.url} 
                className="w-full h-full object-cover select-none absolute inset-0"
                style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: '-webkit-optimize-contrast' }}
                alt="AI Idol"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1016] via-[#151824] to-[#0A0A0F] text-center p-6 select-none">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-600 to-red-600 flex items-center justify-center mb-5 shadow-2xl shadow-rose-500/30 animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">MÀN HÌNH CHỜ LIVE IDOL (9:16)</h3>
                <p className="text-gray-400 text-xs mt-2">Đang kết nối nhận video chuẩn 1080x1920 từ phần mềm...</p>
              </div>
            )}
          </div>

          {/* SÂN KHẤU 2: GAME BẢN ĐỒ VIỆT NAM (CẮM CỜ 63 TỈNH THÀNH) */}
          <div 
            style={{ display: (currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') ? 'block' : 'none' }}
            className="w-full h-full absolute inset-0 overflow-hidden bg-transparent select-none pointer-events-auto"
          >
            <GameBanDoVietNam 
              isPopout={true}
              aspectRatio={ratio}
              externalLiveEvent={liveEvent}
              isDarkMode={masterState.isDarkMode !== false}
            />
          </div>

          {/* SÂN KHẤU 3: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN */}
          <div 
            style={{ display: (currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') ? 'block' : 'none' }}
            className="w-full h-full absolute inset-0 overflow-hidden bg-transparent select-none pointer-events-auto"
          >
            <GameChienDau 
              isPopout={true}
              aspectRatio={ratio}
              externalLiveEvent={liveEvent}
              isDarkMode={masterState.isDarkMode !== false}
            />
          </div>

          {/* SÂN KHẤU 4: PHÒNG DỰNG LIVE STUDIO 4K */}
          <div 
            style={{ display: (currentStage === 'broadcast' || currentStage === 'studio') ? 'block' : 'none' }}
            className="w-full h-full absolute inset-0 overflow-hidden bg-black flex items-center justify-center select-none"
          >
            {overlayCamActive ? (
              <video
                ref={(el) => {
                  overlayWebcamVideoRef.current = el;
                  if (el && overlayWebcamStreamRef.current && el.srcObject !== overlayWebcamStreamRef.current) {
                    el.srcObject = overlayWebcamStreamRef.current;
                  }
                }}
                autoPlay
                playsInline
                muted={isVideoAudioMuted}
                className="w-full h-full object-cover select-none scale-x-[-1] bg-black"
              />
            ) : hasStudioFrame ? (
              <img
                ref={studioImageRef}
                alt="Live Studio Realtime Camera Stream"
                className="w-full h-full object-cover select-none bg-black transform-gpu"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1016] via-[#151824] to-[#0A0A0F] text-center p-6 select-none">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/30 animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">PHÒNG DỰNG LIVE STUDIO 4K</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Góc máy Camera đang chờ tín hiệu kết nối từ Bảng điều khiển Studio...</p>
                <div className="mt-4 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10.5px] font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>TÍN HIỆU LIVE STUDIO SẴN SÀNG</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes idolBreathing {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.015) translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
