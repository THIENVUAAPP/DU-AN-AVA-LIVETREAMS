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
const getBackendUrl = () => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const backendParam = urlParams ? urlParams.get('backend') : null;
  return backendParam || (typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://localhost:3001');
};

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
      mediaUrl: saved?.mediaUrl || null,
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

  useEffect(() => {
    document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    // 5 TẦNG ĐỒNG BỘ: KẾT NỐI VÀ TỰ ĐỘNG PHỤC HỒI
    let isSubscribed = true;

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
    
    // Polling liên tục mỗi 2s để đề phòng WebSocket bị chặn trên OBS / TikTok Studio CEF
    const httpPollInterval = setInterval(fetchLiveState, 2000);

    // 3. WEBSOCKET REALTIME (SOCKET.IO)
    let socket = null;
    try {
      socket = io(getBackendUrl(), {
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

      socket.on('battle_event', (data) => {
        if (data) setLiveEvent({ ...data, _ts: Date.now() });
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

    // 5. POLLING REALTIME STUDIO CAM FRAME (Hỗ trợ 100% CEF Browser Source trong TikTok LIVE Studio)
    const frameInterval = setInterval(() => {
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

  // Tự động kích hoạt Camera khi mở chế độ Studio
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

    // 3. Không dùng fallback mặc định nữa theo yêu cầu của user
    if (!candidateUrl) {
      candidateUrl = '';
    }

    // Làm sạch và chuẩn hóa URL (Loại bỏ các tiền tố http lặp lại nếu có)
    if (typeof candidateUrl === 'string') {
      if (candidateUrl.includes('http://') && candidateUrl.lastIndexOf('http://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('http://'));
      } else if (candidateUrl.includes('https://') && candidateUrl.lastIndexOf('https://') > 0) {
        candidateUrl = candidateUrl.substring(candidateUrl.lastIndexOf('https://'));
      }

      // Chuẩn hoá URL video tải lên (Đồng bộ hostname để tránh CORS trên OBS / CEF browser)
      if (candidateUrl.includes('/uploads/')) {
        const pathPart = candidateUrl.substring(candidateUrl.indexOf('/uploads/'));
        const backendBase = getBackendUrl() ? getBackendUrl().replace(/\/$/, '') : (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:3001` : 'http://127.0.0.1:3001');
        candidateUrl = `${backendBase}${pathPart}`;
      }

      // TỪ CHỐI TUYỆT ĐỐI BLOB URL NẾU NÓ ĐẾN TỪ CỬA SỔ KHÁC (vì CEF TikTok Studio không đọc được blob của Chrome)
      if (candidateUrl.startsWith('blob:')) {
        console.warn('[CleanLiveOverlay] Blob URL is not supported across windows. Falling back to empty.');
        candidateUrl = '';
      }
    }

    // Xác định chính xác video hay ảnh
    if (typeof candidateUrl === 'string') {
      const cleanLower = candidateUrl.split('?')[0].toLowerCase();
      const isExplicitImg = cleanLower.endsWith('.jpg') || cleanLower.endsWith('.jpeg') || cleanLower.endsWith('.png') || cleanLower.endsWith('.webp') || cleanLower.endsWith('.svg') || cleanLower.endsWith('.gif') || candidateUrl.startsWith('data:image');
      isVideo = !isExplicitImg;
    }

    return { url: candidateUrl, isVideo };
  };

  const activeMedia = resolveActiveMedia();

  // 3. RENDER STAGE: PHÒNG DỰNG LIVE STUDIO 4K — 100% CAMERA THỰC & GÓC MÁY STUDIO
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
              ref={(el) => {
                overlayWebcamVideoRef.current = el;
                if (el && overlayWebcamStreamRef.current && el.srcObject !== overlayWebcamStreamRef.current) {
                  el.srcObject = overlayWebcamStreamRef.current;
                }
              }}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover select-none scale-x-[-1] bg-black"
            />
          ) : hasStudioFrame ? (
            /* Luồng Camera thật 30FPS trực tiếp từ Bảng điều khiển Studio */
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

          {/* Badge trạng thái phát sóng góc màn hình */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/40">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[11px] font-black text-white tracking-wider uppercase">LIVE STUDIO 4K</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. RENDER STAGE: AI IDOL LIVESTREAM — 100% CLEAN VIDEO / NGƯỜI DUY NHẤT (THEO VIDEO NGƯỜI DÙNG CHỌN)
  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden flex items-center justify-center select-none bg-black"
      style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0 }}
    >
      {activeStreamUrl ? (
        <video
          ref={flvVideoRef}
          key={activeStreamUrl}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover select-none bg-black absolute inset-0"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : activeMedia.url && activeMedia.isVideo ? (
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.playsInline = true;
              const playPromise = el.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  el.muted = true;
                  el.play().catch(() => {});
                });
              }
            }
          }}
          key={activeMedia.url}
          src={activeMedia.url}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={(e) => {
            e.target.muted = true;
            e.target.play().catch(() => {});
          }}
          onCanPlay={(e) => {
            e.target.muted = true;
            e.target.play().catch(() => {});
          }}
          onEnded={(e) => {
            e.target.currentTime = 0;
            e.target.play().catch(() => {});
          }}
          onError={(e) => {
            console.warn('[CleanLiveOverlay] Video playback failed:', e);
            // Bỏ fallback mặc định theo yêu cầu
          }}
          className="w-full h-full object-cover select-none bg-black absolute inset-0"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : activeMedia.url ? (
        /* Ảnh Idol Sắc Nét 4K (Chống Màn Hình Đen Tuyệt Đối) */
        <img 
          src={activeMedia.url} 
          className="w-full h-full object-cover select-none absolute inset-0"
          style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: '-webkit-optimize-contrast' }}
          alt="AI Idol"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/demo_dancer.mp4';
          }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F1016] via-[#151824] to-[#0A0A0F] text-center p-6 select-none">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-600 to-red-600 flex items-center justify-center mb-5 shadow-2xl shadow-rose-500/30 animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">MÀN HÌNH CHỜ LIVE IDOL</h3>
        </div>
      )}

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
