import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

import { loadAllAidolItems } from '../../utils/idbHelper';
import { getActiveMedia } from '../../utils/activeMediaStore';
import { SvgChromaFilters } from './MultiAvatarStudioModal';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameBattleOverlay from './game/GameBattleOverlay';
import GameChienDau from './game/GameChienDau';
import { getMultiAvatarConfig, isImageMedia, getChromaStyle } from '../../utils/voiceSyncService';
import { getMasterLiveState, syncMasterLiveState } from '../../lib/masterLiveSync';

/**
 * 🖥️ TAB CODE ĐỘC LẬP: CỬA SỔ BẮT HÌNH WINDOW CAPTURE 4K 60 FPS CHO OBS & TIKTOK LIVE STUDIO
 * - Bê nguyên xi 100% luồng video gốc từ phần mềm chính với độ trễ 0ms
 * - Sử dụng Direct GPU Stream Cloner (captureStream) & In-Memory Hardware Blob 
 * - Tách biệt hoàn toàn 100% với đường link Online Live Stream (/live-stream)
 * - Khóa chặt luồng video 4K 60 FPS siêu mượt, không giật lag, không đứng hình, không đen màn hình
 * - Nút [✕ Ẩn Toàn Bộ (H)] cho phép ẩn sạch 100% các nút và tab điều khiển trên video
 * - Biểu tượng mắt nổi [👁️] hoặc phím tắt [H] giúp hiện lại nhanh chóng bất kỳ lúc nào
 */
export default function WindowCapturePlayer() {
  const videoRef = useRef(null);
  const isDirectStreamActiveRef = useRef(false);
  const activeBlobUrlRef = useRef(null);
  const isHardwareLocalBlobRef = useRef(false);
  const isExplicitlyPausedRef = useRef(false);
  const isUserMutedRef = useRef(false);
  const currentCharIdRef = useRef(null);

  const [tunnelUrl, setTunnelUrl] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('tunnel') || localStorage.getItem('avalive_tunnel_url') || '';
  });

  const [videoSrc, setVideoSrc] = useState(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    const v = params.get('v');
    if (v && !v.startsWith('blob:') && !v.startsWith('data:')) return v;

    const charParam = params.get('char');

    // ⚡ NẠP TỨC THÌ NGUỒN VIDEO GỐC TỪ PHẦN MỀM CHÍNH (0ms, 0 byte mạng, nguyên bản siêu nét)
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
        try {
          const openerVid = window.opener.document.querySelector('video[data-main-player="true"]') || window.opener.document.querySelector('video');
          if (openerVid && (openerVid.currentSrc || openerVid.src)) {
            return openerVid.currentSrc || openerVid.src;
          }
        } catch (e) {}
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
      if (activeSrc && typeof activeSrc === 'string' && activeSrc.trim()) return activeSrc;
      const saved = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
      if (saved.mediaUrl && typeof saved.mediaUrl === 'string' && saved.mediaUrl.trim()) return saved.mediaUrl;
      const locked = localStorage.getItem('avalive_user_locked_media') || '';
      if (locked && typeof locked === 'string' && locked.trim()) return locked;
    } catch (e) {}
    return '';
  });

  const [fitMode, setFitMode] = useState(() => {
    if (typeof window === 'undefined') return 'cover';
    const params = new URLSearchParams(window.location.search);
    return params.get('fit') || 'cover';
  });

  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);

  // 🎭 Sân khấu hiển thị hiện tại ('idol' | 'bando' | 'battle' | 'camera' | 'broadcast')
  const [currentStage, setCurrentStage] = useState(() => {
    try {
      const saved = getMasterLiveState();
      return saved?.stage || 'idol';
    } catch (e) {
      return 'idol';
    }
  });

  // 👥 Cấu hình Multi-Avatar 1–4 nhân vật
  const [multiAvatarConfig, setMultiAvatarConfig] = useState(() => {
    try {
      return getMultiAvatarConfig();
    } catch (e) {
      return { enabled: false, activeCount: 1, layout: 'auto', avatars: [] };
    }
  });
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isSpeakerActive, setIsSpeakerActive] = useState(false);

  // ⚡ Video sự kiện và video lớp trên cùng (Topmost Priority Layers)
  const [activeEventVideo, setActiveEventVideo] = useState(null);
  const [lipSyncVideoUrl, setLipSyncVideoUrl] = useState(null);
  const [quickResponseVideo, setQuickResponseVideo] = useState(null);
  const [captions, setCaptions] = useState('');
  const [liveEventNotice, setLiveEventNotice] = useState(null);

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

  // 👁️ Trạng thái ẩn toàn bộ các nút / tab trên giao diện Window Capture
  const [isControlsHidden, setIsControlsHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('avalive_window_capture_dock_hidden') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Cập nhật tiêu đề cửa sổ cho OBS & TikTok Studio dễ nhận diện
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = '[AvaLive VIP PRO] - Cửa Sổ Live 9:16 (Window Capture)';
    }
  }, []);

  // 🌐 Chuyển đổi URL thông minh cho Window Capture (Tuyệt đối không trả về URL rỗng hoặc '/')
  // ⚡ FIX: Khi chạy trên Vite dev (port 5173), /uploads/ phải trỏ về backend (port 3001)
  const resolveUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) return trimmed;

    // Xác định base origin cho uploads (backend server, KHÔNG PHẢI Vite dev server)
    const getUploadsOrigin = () => {
      if (window.location.hostname.includes('vercel.app') && tunnelUrl) {
        return tunnelUrl.replace(/\/$/, '');
      }
      // Nếu đang chạy trên Vite dev port (5173) -> redirect về backend port 3001
      const port = window.location.port;
      if (port === '5173' || port === '5174') {
        return `${window.location.protocol}//${window.location.hostname}:3001`;
      }
      return window.location.origin;
    };

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      if (trimmed.includes('localhost:') || trimmed.includes('127.0.0.1:')) {
        try {
          const u = new URL(trimmed);
          // Nếu URL chứa /uploads/, luôn dùng backend origin
          if (u.pathname.startsWith('/uploads/')) {
            return `${getUploadsOrigin()}${u.pathname}${u.search}`;
          }
          return `${getUploadsOrigin()}${u.pathname}${u.search}`;
        } catch (e) {}
      }
      return trimmed;
    }

    if (trimmed.startsWith('/uploads/') || trimmed.includes('/uploads/')) {
      const pathPart = trimmed.substring(trimmed.indexOf('/uploads/'));
      return `${getUploadsOrigin()}${pathPart}`;
    }

    if (trimmed.startsWith('/')) {
      return `${getUploadsOrigin()}${trimmed}`;
    }

    return `${getUploadsOrigin()}/${trimmed}`;
  }, [tunnelUrl]);

  const [isDirectStreamActive, setIsDirectStreamActive] = useState(false);

  // ⚡ 1. Direct GPU Stream Cloner: Bê nguyên xi luồng video của phần mềm chính qua GPU Pipeline (0ms, 0 byte)
  const attachOpenerDirectStream = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.opener || window.opener.closed) return false;
      const openerVid = window.opener.document.querySelector('video[data-main-player="true"]') || window.opener.document.querySelector('video');
      if (openerVid && openerVid.readyState >= 2 && openerVid.videoWidth > 0 && (openerVid.captureStream || openerVid.mozCaptureStream)) {
        const stream = openerVid.captureStream ? openerVid.captureStream() : openerVid.mozCaptureStream();
        if (stream && stream.getVideoTracks().length > 0) {
          const targetVid = videoRef.current;
          if (targetVid) {
            if (activeBlobUrlRef.current) {
              try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
              activeBlobUrlRef.current = null;
            }
            targetVid.removeAttribute('src');
            targetVid.src = '';
            targetVid.srcObject = stream;
            targetVid.muted = isUserMutedRef.current;
            targetVid.play().catch(() => {});
            isDirectStreamActiveRef.current = true;
            setIsDirectStreamActive(true);
            setIsVideoLoading(false);
            setIsPlaybackActive(true);
            return true;
          }
        }
      }
    } catch (e) {
      console.warn('[WindowCapture] directStream clone error/fallback:', e);
    }
    return false;
  }, []);

  // ⚡ 2. Tự động tìm kiếm fileBlob gốc trong Memory Cache / Opener / IndexedDB để phát 0ms không cần mạng
  const tryLoadFromLocalDB = useCallback(async (targetUrlOrCharId) => {
    if (typeof window === 'undefined') return null;
    try {
      // 0. Ưu tiên số 0: Lấy trực tiếp __activeMediaBlob từ opener (0ms tức thì)
      if (window.opener && window.opener.__activeMediaBlob && (window.opener.__activeMediaBlob instanceof Blob || window.opener.__activeMediaBlob instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(window.opener.__activeMediaBlob);
        activeBlobUrlRef.current = bUrl;
        isHardwareLocalBlobRef.current = true;
        return bUrl;
      }
      if (window.__activeMediaBlob && (window.__activeMediaBlob instanceof Blob || window.__activeMediaBlob instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(window.__activeMediaBlob);
        activeBlobUrlRef.current = bUrl;
        isHardwareLocalBlobRef.current = true;
        return bUrl;
      }

      // 1. Kiểm tra RAM Blob Map trực tiếp từ Opener hoặc Window hiện tại theo ID / Key
      if (targetUrlOrCharId) {
        const memBlob = (window.opener && window.opener.__activeMediaBlobMap && window.opener.__activeMediaBlobMap.get(targetUrlOrCharId)) ||
                        (window.__activeMediaBlobMap && window.__activeMediaBlobMap.get(targetUrlOrCharId));
        if (memBlob && (memBlob instanceof Blob || memBlob instanceof File)) {
          if (activeBlobUrlRef.current) {
            try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
          }
          const bUrl = URL.createObjectURL(memBlob);
          activeBlobUrlRef.current = bUrl;
          isHardwareLocalBlobRef.current = true;
          return bUrl;
        }
      }

      // 1.5. ⚡ ĐỘT PHÁ: Kiểm tra ActiveMediaStore Session chia sẻ trực tiếp giữa các tab/cửa sổ (0ms)
      const sessionActiveFile = await getActiveMedia(targetUrlOrCharId || 'current_active');
      if (sessionActiveFile && (sessionActiveFile instanceof Blob || sessionActiveFile instanceof File)) {
        if (activeBlobUrlRef.current) {
          try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
        }
        const bUrl = URL.createObjectURL(sessionActiveFile);
        activeBlobUrlRef.current = bUrl;
        isHardwareLocalBlobRef.current = true;
        return bUrl;
      }

      // 2. Kiểm tra IndexedDB trên máy (Bê nguyên xi file gốc từ IndexedDB)
      const items = await loadAllAidolItems();
      if (items && items.length > 0) {
        let found = null;
        if (targetUrlOrCharId) {
          found = items.find(it => 
            (it.id && it.id === targetUrlOrCharId) ||
            (it.url && it.url === targetUrlOrCharId) ||
            (it.mediaUrl && it.mediaUrl === targetUrlOrCharId) ||
            (it.mediaUrl && targetUrlOrCharId && targetUrlOrCharId.includes(it.mediaUrl)) ||
            (targetUrlOrCharId && it.mediaUrl && it.mediaUrl.includes(targetUrlOrCharId))
          );
        }
        if (!found && !targetUrlOrCharId) {
          found = items.slice().reverse().find(it => it && it.fileBlob && (it.fileBlob instanceof Blob || it.fileBlob instanceof File));
        }

        if (found && found.fileBlob && (found.fileBlob instanceof Blob || found.fileBlob instanceof File)) {
          if (activeBlobUrlRef.current) {
            try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
          }
          const blobUrl = URL.createObjectURL(found.fileBlob);
          activeBlobUrlRef.current = blobUrl;
          isHardwareLocalBlobRef.current = true;
          return blobUrl;
        }
      }
    } catch (e) {}
    return null;
  }, []);

  const toggleControlsHidden = (val) => {
    const nextVal = typeof val === 'boolean' ? val : !isControlsHidden;
    setIsControlsHidden(nextVal);
    try {
      localStorage.setItem('avalive_window_capture_dock_hidden', String(nextVal));
    } catch (e) {}
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

  const applyTimeSync = (targetTime, force = false) => {
    const vid = videoRef.current;
    if (!vid || typeof targetTime !== 'number' || isNaN(targetTime)) return;
    if (isExplicitlyPausedRef.current || isDirectStreamActiveRef.current) return;

    const cur = vid.currentTime;
    const diff = Math.abs(cur - targetTime);

    if (force || diff > 2.0) {
      vid.currentTime = targetTime;
    }
  };

  // Khởi động nạp video ngay tức khắc khi mở cửa sổ Window Capture
  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const charParam = params ? params.get('char') : null;
    const vParam = params ? params.get('v') : null;

    // 1. Thử nạp local blob trước (0ms, GPU hardware decoded trực tiếp)
    tryLoadFromLocalDB(charParam || vParam || null).then(localBlob => {
      if (localBlob) {
        isHardwareLocalBlobRef.current = true;
        setVideoSrc(localBlob);
        setIsVideoLoading(false);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = localBlob;
          videoRef.current.play().catch(() => {});
        }
        return;
      }

      // 2. Thử direct stream clone nếu opener đang phát sẵn sàng
      const streamAttached = attachOpenerDirectStream();
      if (streamAttached) return;

      // 3. Fallback lấy URL từ param ?v=
      if (vParam && !vParam.startsWith('blob:')) {
        const serverUrl = resolveUrl(vParam);
        if (serverUrl) {
          isHardwareLocalBlobRef.current = false;
          setVideoSrc(serverUrl);
          setIsVideoLoading(true);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = serverUrl;
            videoRef.current.play().catch(() => {});
          }
          return;
        }
      }

      // 4. Fallback lấy URL mới nhất từ /api/live-state
      const backendOrigin = (() => {
        const port = window.location.port;
        if (port === '5173' || port === '5174') {
          return `${window.location.protocol}//${window.location.hostname}:3001`;
        }
        return window.location.origin;
      })();

      fetch(`${backendOrigin}/api/live-state`)
        .then(res => res.json())
        .then(data => {
          if (data && data.mediaUrl && !isDirectStreamActiveRef.current) {
            const serverUrl = resolveUrl(data.mediaUrl);
            if (serverUrl) {
              isHardwareLocalBlobRef.current = false;
              setVideoSrc(serverUrl);
              setIsVideoLoading(true);
              if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = serverUrl;
                videoRef.current.play().catch(() => {});
              }
              console.log('[WindowCapture] ✅ Fallback thành công! Phát video từ server:', serverUrl);
            }
          }
        })
        .catch(() => {});
    });
  }, [attachOpenerDirectStream, tryLoadFromLocalDB, resolveUrl]);

  // 🔄 Lắng nghe sự kiện toàn cục nội bộ trong cùng cửa sổ / opener
  useEffect(() => {
    const handleMultiAvatarChange = (e) => {
      if (e?.detail) {
        setMultiAvatarConfig(e.detail);
      } else {
        setMultiAvatarConfig(getMultiAvatarConfig());
      }
    };

    const handleSpeakerChange = (e) => {
      const { avatarId, isSpeaking, role } = e?.detail || {};
      if (isSpeaking) {
        setActiveSpeakerId(avatarId || role || 'idol');
        setIsSpeakerActive(true);
      } else {
        setIsSpeakerActive(false);
      }
    };

    const handleCaptionUpdate = (e) => {
      if (e?.detail?.caption !== undefined) {
        setCaptions(e.detail.caption || '');
      } else if (e?.detail?.text !== undefined) {
        setCaptions(e.detail.text || '');
      }
    };

    const handleEventVideoTrigger = (e) => {
      if (e?.detail?.videoUrl) {
        const resolved = resolveUrl(e.detail.videoUrl);
        setActiveEventVideo({
          url: resolved,
          name: e.detail.name || 'Event Video',
          eventType: e.detail.eventType
        });
        if (e.detail.name || e.detail.eventType) {
          setLiveEventNotice({
            type: e.detail.eventType,
            name: e.detail.name,
            timestamp: Date.now()
          });
          setTimeout(() => setLiveEventNotice(null), 8000);
        }
      }
    };

    const handleLipSyncVideoTrigger = (e) => {
      if (e?.detail?.videoUrl) {
        setLipSyncVideoUrl(resolveUrl(e.detail.videoUrl));
      } else {
        setLipSyncVideoUrl(null);
      }
    };

    const handleQuickResponseVideo = (e) => {
      if (e?.detail?.quickResponseVideo?.url) {
        setQuickResponseVideo({
          ...e.detail.quickResponseVideo,
          url: resolveUrl(e.detail.quickResponseVideo.url)
        });
      } else {
        setQuickResponseVideo(null);
      }
    };

    const handleStageChange = (e) => {
      if (e?.detail?.stage) {
        setCurrentStage(e.detail.stage);
      }
    };

    window.addEventListener('avalive_multi_avatar_changed', handleMultiAvatarChange);
    window.addEventListener('avalive_active_speaker_changed', handleSpeakerChange);
    window.addEventListener('avalive_speaker_change', handleSpeakerChange);
    window.addEventListener('avalive_caption_updated', handleCaptionUpdate);
    window.addEventListener('avalive:event_video_trigger', handleEventVideoTrigger);
    window.addEventListener('avalive:lipsync_video_trigger', handleLipSyncVideoTrigger);
    window.addEventListener('avalive:quick_response_video', handleQuickResponseVideo);
    window.addEventListener('avalive:stage_change', handleStageChange);

    return () => {
      window.removeEventListener('avalive_multi_avatar_changed', handleMultiAvatarChange);
      window.removeEventListener('avalive_active_speaker_changed', handleSpeakerChange);
      window.removeEventListener('avalive_speaker_change', handleSpeakerChange);
      window.removeEventListener('avalive_caption_updated', handleCaptionUpdate);
      window.removeEventListener('avalive:event_video_trigger', handleEventVideoTrigger);
      window.removeEventListener('avalive:lipsync_video_trigger', handleLipSyncVideoTrigger);
      window.removeEventListener('avalive:quick_response_video', handleQuickResponseVideo);
      window.removeEventListener('avalive:stage_change', handleStageChange);
    };
  }, [resolveUrl]);

  // Đồng bộ qua BroadcastChannel nội bộ cùng máy
  useEffect(() => {
    let bc = null;
    try {
      bc = new BroadcastChannel('avalive_master_live_stream');

      // ⚡ Yêu cầu lấy ngay Video và trạng thái hiện tại từ phần mềm chính (0ms)
      try {
        bc.postMessage({ type: 'REQUEST_CURRENT_MEDIA', timestamp: Date.now() });
        bc.postMessage({ type: 'REQUEST_MASTER_LIVE_STATE', timestamp: Date.now() });
      } catch (e) {}

      bc.onmessage = async (event) => {
        const msg = event.data;
        if (!msg) return;

        // 🎭 Đồng bộ Sân Khấu (Idol / Game Bản Đồ / Game Chiến Đấu / Broadcast)
        if (msg.type === 'GLOBAL_STAGE_CHANGE' && msg.stage) {
          setCurrentStage(msg.stage);
        } else if (msg.stage) {
          setCurrentStage(msg.stage);
        }

        // 👥 Đồng bộ Multi-Avatar 1–4 nhân vật
        if (msg.multiAvatarConfig || msg.type === 'MULTI_AVATAR_UPDATE') {
          setMultiAvatarConfig(msg.multiAvatarConfig || getMultiAvatarConfig());
        }
        if (msg.activeSpeakerId !== undefined) {
          setActiveSpeakerId(msg.activeSpeakerId);
          setIsSpeakerActive(Boolean(msg.isSpeaking));
        }

        // 💬 Đồng bộ phụ đề / Captions AI Brain & Voice đọc kịch bản
        if (msg.captions !== undefined || msg.caption !== undefined || msg.speechText !== undefined) {
          setCaptions(msg.captions || msg.caption || msg.speechText || '');
        }

        // ⚡ Đồng bộ video LipSync Voice AI
        if (msg.type === 'LIP_SYNC_VIDEO' || msg.lipSyncVideoUrl !== undefined) {
          setLipSyncVideoUrl(msg.lipSyncVideoUrl ? resolveUrl(msg.lipSyncVideoUrl) : null);
        }

        // ⚡ Đồng bộ video Phản Hồi Nhanh
        if (msg.type === 'QUICK_RESPONSE_VIDEO' || msg.quickResponseVideo !== undefined) {
          if (msg.quickResponseVideo?.url) {
            setQuickResponseVideo({
              ...msg.quickResponseVideo,
              url: resolveUrl(msg.quickResponseVideo.url)
            });
          } else {
            setQuickResponseVideo(null);
          }
        }

        // ⚡ Đồng bộ video sự kiện 14 Tab & Event Triggers
        if (msg.type === 'EVENT_VIDEO_PLAY' || msg.type === 'EVENT_VIDEO_TRIGGER' || msg.eventVideoUrl || (msg.eventType && msg.videoUrl)) {
          const evUrl = resolveUrl(msg.eventVideoUrl || msg.videoUrl);
          if (evUrl) {
            setActiveEventVideo({
              url: evUrl,
              name: msg.name || 'Event Video',
              eventType: msg.eventType
            });
            isHardwareLocalBlobRef.current = false;
            isDirectStreamActiveRef.current = false;
            setIsDirectStreamActive(false);
            if (videoRef.current) {
              videoRef.current.srcObject = null;
              videoRef.current.src = evUrl;
              videoRef.current.play().catch(() => {});
            }
            setVideoSrc(evUrl);
            setIsVideoLoading(false);
            if (msg.name || msg.eventType) {
              setLiveEventNotice({
                type: msg.eventType,
                name: msg.name,
                timestamp: Date.now()
              });
              setTimeout(() => setLiveEventNotice(null), 8000);
            }
          }
        }

        if (msg.type === 'CLEAR_STAGE' || msg.clearMedia) {
          setActiveEventVideo(null);
          setLipSyncVideoUrl(null);
          setQuickResponseVideo(null);
          setVideoSrc('');
          if (videoRef.current) {
            try {
              videoRef.current.pause();
              videoRef.current.srcObject = null;
              videoRef.current.src = '';
            } catch (e) {}
          }
        }

        if ((msg.type === 'GLOBAL_MEDIA_CHANGE' || msg.type === 'RESPONSE_CURRENT_MEDIA') && (msg.fileBlob || msg.mediaUrl || msg.blobUrl || msg.characterId)) {
          // ⚡ ƯU TIÊN 1: File/Blob object trực tiếp qua Structured Clone (0ms, 60 FPS chuẩn GPU)
          if (msg.fileBlob && (msg.fileBlob instanceof Blob || msg.fileBlob instanceof File)) {
            try {
              if (activeBlobUrlRef.current) {
                try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
              }
              const url = URL.createObjectURL(msg.fileBlob);
              activeBlobUrlRef.current = url;
              isHardwareLocalBlobRef.current = true;
              isDirectStreamActiveRef.current = false;
              setIsDirectStreamActive(false);
              if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = url;
                videoRef.current.play().catch(() => {});
              }
              setVideoSrc(url);
              setIsVideoLoading(false);
            } catch (e) {}
          } else {
            // Thử nạp tức thì 0ms từ Memory Cache / Opener / IndexedDB trước nếu có file gốc
            const localBlob = await tryLoadFromLocalDB(msg.characterId || msg.mediaUrl);
            if (localBlob) {
              isHardwareLocalBlobRef.current = true;
              isDirectStreamActiveRef.current = false;
              setIsDirectStreamActive(false);
              if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = localBlob;
                videoRef.current.play().catch(() => {});
              }
              setVideoSrc(localBlob);
              setIsVideoLoading(false);
            } else if (msg.mediaUrl) {
              const resolved = resolveUrl(msg.mediaUrl);
              if (resolved && !isSameMedia(resolved, videoSrc)) {
                isHardwareLocalBlobRef.current = false;
                isDirectStreamActiveRef.current = false;
                setIsDirectStreamActive(false);
                if (activeBlobUrlRef.current) {
                  try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
                  activeBlobUrlRef.current = null;
                }
                if (videoRef.current) {
                  videoRef.current.srcObject = null;
                  videoRef.current.src = resolved;
                  videoRef.current.play().catch(() => {});
                }
                setVideoSrc(resolved);
                setIsVideoLoading(false);
              }
            } else {
              attachOpenerDirectStream();
            }
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
        } else if (msg.type === 'PIN_PRODUCT_UPDATE' && msg.product) {
          setPinnedProduct(msg.product);
        }

        if (msg.overlayImage || msg.overlayText || msg.secondaryMediaUrl) {
          setFlowSequencerOverlay({
            secondaryMediaUrl: msg.secondaryMediaUrl || null,
            secondaryMediaPos: msg.secondaryMediaPos || 'top-right',
            secondaryMediaScale: msg.secondaryMediaScale || 40,
            secondaryMediaTransform: msg.secondaryMediaTransform || null,
            secondaryMediaChromaKey: msg.secondaryMediaChromaKey || null,
            overlayImage: msg.overlayImage || null,
            overlayImagePos: msg.overlayImagePos || 'top-left',
            overlayImageScale: msg.overlayImageScale || 100,
            overlayImageTransform: msg.overlayImageTransform || null,
            overlayImageChromaKey: msg.overlayImageChromaKey || null,
            overlayText: msg.overlayText || null,
            overlayTextPos: msg.overlayTextPos || 'top',
            overlayTextStyle: msg.overlayTextStyle || 'banner',
            overlayTextFontFamily: msg.overlayTextFontFamily || 'be_vietnam',
            overlayTextFontSize: msg.overlayTextFontSize || 20,
            overlayTextColor: msg.overlayTextColor || '#ffffff',
            overlayTextTransform: msg.overlayTextTransform || null
          });
        }

        // 🔌 CLEAR_STAGE / clearMedia: Xóa sạch toàn bộ video khi người dùng xóa trên phần mềm chính
        if (msg.type === 'CLEAR_STAGE' || msg.clearMedia || (msg.type === 'GLOBAL_MEDIA_CHANGE' && msg.mediaUrl === null)) {
          if (videoRef.current) {
            try {
              videoRef.current.pause();
              videoRef.current.removeAttribute('src');
              videoRef.current.src = '';
              videoRef.current.srcObject = null;
              videoRef.current.load();
            } catch (e) {}
          }
          setVideoSrc('');
          setActiveEventVideo(null);
          setCaptions('');
          setFlowSequencerOverlay(null);
          setIsDirectStreamActive(false);
          isDirectStreamActiveRef.current = false;
          isHardwareLocalBlobRef.current = false;
          setIsPlaybackActive(false);
          setIsVideoLoading(false);
          if (activeBlobUrlRef.current) {
            try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
            activeBlobUrlRef.current = null;
          }
          try {
            localStorage.removeItem('avalive_active_video_src');
            localStorage.removeItem('avalive_user_locked_media');
          } catch (e) {}
        }
      };
    } catch (e) {}

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
    };
  }, [videoSrc, resolveUrl, tryLoadFromLocalDB, attachOpenerDirectStream]);

  // Đồng bộ qua Socket.io Realtime Server
  useEffect(() => {
    let socket = null;
    try {
      // ⚡ FIX: Kết nối socket.io đến backend server, KHÔNG PHẢI Vite dev server
      const port = window.location.port;
      const serverOrigin = (port === '5173' || port === '5174')
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : window.location.origin;
      socket = io(serverOrigin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000
      });

      socket.on('connect', () => {
        socket.emit('REQUEST_MASTER_LIVE_STATE');
      });

      socket.on('MASTER_LIVE_STATE_UPDATE', async (state) => {
        if (!state) return;
        if (state.tunnelUrl && state.tunnelUrl !== tunnelUrl) {
          setTunnelUrl(state.tunnelUrl);
        }
        if (state.overlayImage || state.overlayText || state.secondaryMediaUrl) {
          setFlowSequencerOverlay({
            secondaryMediaUrl: state.secondaryMediaUrl || null,
            secondaryMediaPos: state.secondaryMediaPos || 'top-right',
            secondaryMediaScale: state.secondaryMediaScale || 40,
            secondaryMediaTransform: state.secondaryMediaTransform || null,
            secondaryMediaChromaKey: state.secondaryMediaChromaKey || null,
            overlayImage: state.overlayImage || null,
            overlayImagePos: state.overlayImagePos || 'top-left',
            overlayImageScale: state.overlayImageScale || 100,
            overlayImageTransform: state.overlayImageTransform || null,
            overlayImageChromaKey: state.overlayImageChromaKey || null,
            overlayText: state.overlayText || null,
            overlayTextPos: state.overlayTextPos || 'top',
            overlayTextStyle: state.overlayTextStyle || 'banner',
            overlayTextFontFamily: state.overlayTextFontFamily || 'be_vietnam',
            overlayTextFontSize: state.overlayTextFontSize || 20,
            overlayTextColor: state.overlayTextColor || '#ffffff',
            overlayTextTransform: state.overlayTextTransform || null
          });
        }
        if (state.clearMedia || state.mediaUrl === null) {
          if (videoRef.current) {
            try {
              videoRef.current.pause();
              videoRef.current.removeAttribute('src');
              videoRef.current.src = '';
              videoRef.current.srcObject = null;
              videoRef.current.load();
            } catch (e) {}
          }
          setVideoSrc('');
          setActiveEventVideo(null);
          setCaptions('');
          setFlowSequencerOverlay(null);
          setIsDirectStreamActive(false);
          isDirectStreamActiveRef.current = false;
          isHardwareLocalBlobRef.current = false;
          setIsPlaybackActive(false);
          setIsVideoLoading(false);
          if (activeBlobUrlRef.current) {
            try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
            activeBlobUrlRef.current = null;
          }
          try {
            localStorage.removeItem('avalive_active_video_src');
            localStorage.removeItem('avalive_user_locked_media');
          } catch (e) {}
        } else if (state.mediaUrl || state.selectedCharacter) {
          if (state.selectedCharacter) {
            currentCharIdRef.current = state.selectedCharacter;
          }
          if (!isDirectStreamActiveRef.current) {
            const localBlob = await tryLoadFromLocalDB(state.selectedCharacter || state.mediaUrl);
            if (localBlob) {
              isHardwareLocalBlobRef.current = true;
              if (videoRef.current) {
                videoRef.current.srcObject = null;
              }
              setVideoSrc(localBlob);
              setIsVideoLoading(false);
            } else if (state.mediaUrl) {
              const resolved = resolveUrl(state.mediaUrl);
              if (resolved && !isSameMedia(resolved, videoSrc)) {
                isHardwareLocalBlobRef.current = false;
                if (activeBlobUrlRef.current) {
                  try { URL.revokeObjectURL(activeBlobUrlRef.current); } catch (e) {}
                  activeBlobUrlRef.current = null;
                }
                if (videoRef.current) {
                  videoRef.current.srcObject = null;
                  videoRef.current.src = resolved;
                  videoRef.current.play().catch(() => {});
                }
                setVideoSrc(resolved);
                setIsVideoLoading(true);
              }
            }
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

      // ⚡ Nhận lệnh điều khiển video trực tiếp 0ms từ Sân Khấu Chính / Sân Khấu Phụ
      socket.on('VIDEO_PLAYBACK_CONTROL', (control) => {
        if (!control) return;
        const vid = videoRef.current;
        if (!vid) return;

        if (control.mediaUrl) {
          const resolved = resolveUrl(control.mediaUrl);
          if (resolved && !isSameMedia(resolved, videoSrc)) {
            isHardwareLocalBlobRef.current = false;
            vid.srcObject = null;
            vid.src = resolved;
            vid.play().catch(() => {});
            setVideoSrc(resolved);
          }
        }

        if (control.action === 'pause') {
          isExplicitlyPausedRef.current = true;
          vid.pause();
          setIsPlaybackActive(false);
        } else if (control.action === 'play') {
          isExplicitlyPausedRef.current = false;
          vid.play().catch(() => {});
          setIsPlaybackActive(true);
        }

        if (typeof control.currentTime === 'number') {
          applyTimeSync(control.currentTime, !!control.force);
        }
      });

      // ⚡ Nhận 14 sự kiện Live và video sự kiện trực tiếp
      socket.on('LIVE_EVENT', (data) => {
        if (!data) return;
        if (data.eventVideoUrl || data.videoUrl) {
          const evUrl = resolveUrl(data.eventVideoUrl || data.videoUrl);
          if (evUrl) {
            setActiveEventVideo({
              url: evUrl,
              name: data.name || 'Event Video',
              eventType: data.eventType || data.type
            });
          }
        }
        if (data.name || data.type) {
          setLiveEventNotice({
            type: data.eventType || data.type,
            name: data.name || data.author || 'Khán giả',
            timestamp: Date.now()
          });
          setTimeout(() => setLiveEventNotice(null), 8000);
        }
      });

      socket.on('EVENT_VIDEO_PLAY', (data) => {
        if (!data) return;
        const evUrl = resolveUrl(data.videoUrl || data.mediaUrl);
        if (evUrl) {
          setActiveEventVideo({
            url: evUrl,
            name: data.name || 'Event Video',
            eventType: data.eventType
          });
        }
      });

      socket.on('LIP_SYNC_VIDEO', (data) => {
        if (!data) return;
        setLipSyncVideoUrl(data.lipSyncVideoUrl ? resolveUrl(data.lipSyncVideoUrl) : null);
      });

      socket.on('QUICK_RESPONSE_VIDEO', (data) => {
        if (!data) return;
        if (data.quickResponseVideo?.url) {
          setQuickResponseVideo({
            ...data.quickResponseVideo,
            url: resolveUrl(data.quickResponseVideo.url)
          });
        } else {
          setQuickResponseVideo(null);
        }
      });
    } catch (e) {}

    return () => {
      if (socket) {
        try { socket.disconnect(); } catch (e) {}
      }
    };
  }, [tunnelUrl, videoSrc, resolveUrl, tryLoadFromLocalDB, applyTimeSync, isSameMedia]);

  // Quản lý phát Video & Phục hồi tự động
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

    const handleWaiting = () => {
      if (!isDirectStreamActiveRef.current && (!vid.readyState || vid.readyState < 2)) {
        setIsVideoLoading(true);
      }
    };

    const handlePlaying = () => {
      setIsVideoLoading(false);
      setIsPlaybackActive(true);
    };

    vid.addEventListener('loadedmetadata', handleLoadedMetadata);
    vid.addEventListener('waiting', handleWaiting);
    vid.addEventListener('playing', handlePlaying);

    playVideo();

    // ⚡ ANTI-FREEZE & ZERO-STALL WATCHDOG ENGINE: Chống đứng hình 100% khi TikTok Live Studio quay cửa sổ
    let lastTime = -1;
    let stuckCount = 0;
    const watchdog = setInterval(() => {
      if (!isSubscribed || isExplicitlyPausedRef.current || !videoRef.current) return;
      const v = videoRef.current;
      if (v.paused && v.src) {
        v.play().catch(() => {});
        return;
      }
      if (!v.paused && v.readyState >= 2) {
        if (Math.abs(v.currentTime - lastTime) < 0.05) {
          stuckCount++;
          if (stuckCount >= 2) {
            // Nudge nhẹ 0.01s để đánh thức GPU decoder nếu bị đứng khung hình
            try {
              const dur = (typeof v.duration === 'number' && !isNaN(v.duration) && v.duration > 0) ? v.duration : 36000;
              const nextTime = (v.currentTime + 0.01) % dur;
              if (typeof nextTime === 'number' && !isNaN(nextTime)) {
                v.currentTime = nextTime;
                v.play().catch(() => {});
              }
            } catch (e) {}
            stuckCount = 0;
          }
        } else {
          stuckCount = 0;
          lastTime = v.currentTime;
        }
      }
    }, 1200);

    return () => {
      isSubscribed = false;
      clearInterval(watchdog);
      vid.removeEventListener('loadedmetadata', handleLoadedMetadata);
      vid.removeEventListener('waiting', handleWaiting);
      vid.removeEventListener('playing', handlePlaying);
    };
  }, [videoSrc]);

  // Lắng nghe phím tắt điều khiển: Space (Play/Pause), M (Mute), H (Ẩn/Hiện Nút)
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
      <SvgChromaFilters />
      {/* ⚡ 1. TOPMOST LAYER: VIDEO PHẢN HỒI NHANH KHẨN CẤP */}
      {quickResponseVideo?.url ? (
        <video
          key={`quick_${quickResponseVideo.url}`}
          src={quickResponseVideo.url}
          autoPlay
          playsInline
          webkit-playsinline="true"
          loop={Boolean(quickResponseVideo.loop)}
          muted={isUserMutedRef.current || quickResponseVideo.muted}
          preload="auto"
          onEnded={() => {
            if (!quickResponseVideo.loop) setQuickResponseVideo(null);
          }}
          onError={() => setQuickResponseVideo(null)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fitMode,
            display: 'block',
            backgroundColor: '#000',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            imageRendering: '-webkit-optimize-contrast'
          }}
        />
      ) : activeEventVideo?.url ? (
        /* ⚡ 2. TOPMOST LAYER: VIDEO SỰ KIỆN 14 TAB (QUÀ TẶNG, CHÀO MỪNG, CHECKOUT...) */
        <video
          key={`event_${activeEventVideo.url}`}
          src={activeEventVideo.url}
          autoPlay
          playsInline
          webkit-playsinline="true"
          loop={false}
          muted={isUserMutedRef.current}
          preload="auto"
          onEnded={() => setActiveEventVideo(null)}
          onError={() => setActiveEventVideo(null)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fitMode,
            display: 'block',
            backgroundColor: '#000',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            imageRendering: '-webkit-optimize-contrast'
          }}
        />
      ) : lipSyncVideoUrl ? (
        /* ⚡ 3. TOPMOST LAYER: VIDEO NHÉP MIỆNG LIPSYNC VOICE AI */
        <video
          key={`lipsync_${lipSyncVideoUrl}`}
          src={lipSyncVideoUrl}
          autoPlay
          playsInline
          webkit-playsinline="true"
          loop
          muted={isUserMutedRef.current}
          preload="auto"
          onError={() => setLipSyncVideoUrl(null)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fitMode,
            display: 'block',
            backgroundColor: '#000',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            imageRendering: '-webkit-optimize-contrast'
          }}
        />
      ) : (currentStage === 'bando' || currentStage === 'vietnam_map' || currentStage === 'map') ? (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'transparent' }}>
          <GameBanDoVietNam isPopout={true} aspectRatio="9:16" isDarkMode={true} />
        </div>
      ) : (currentStage === 'battle' || currentStage === 'gamebattle' || currentStage === 'game') ? (
        /* 🎮 SÂN KHẤU 3: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN */
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'transparent' }}>
          <GameChienDau isPopout={true} aspectRatio="9:16" isDarkMode={true} />
        </div>
      ) : (multiAvatarConfig?.enabled && multiAvatarConfig?.activeCount >= 2 && Array.isArray(multiAvatarConfig?.avatars) && multiAvatarConfig.avatars.some(a => a.talkVideo || a.idleVideo || a.videoUrl)) ? (() => {
        /* 👥 MULTI-AVATAR STUDIO (2-4 NHÂN VẬT AI IDOL ĐỒNG BỘ) */
        const activeList = (multiAvatarConfig.avatars || []).filter(a => a.enabled).slice(0, multiAvatarConfig.activeCount);
        const count = activeList.length;
        const isGridOnly = multiAvatarConfig.layoutMode === 'grid';

        if (isGridOnly) {
          const gridStyle = count === 2 
            ? { display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', height: '100%', gap: '4px', padding: '4px', backgroundColor: '#000' }
            : count === 3 
            ? { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', height: '100%', gap: '4px', padding: '4px', backgroundColor: '#000' }
            : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '100%', height: '100%', gap: '4px', padding: '4px', backgroundColor: '#000' };

          return (
            <div style={gridStyle}>
              {activeList.map((avatar, idx) => {
                const isSpeakingNow = isSpeakerActive && (activeSpeakerId === avatar.id || (!activeSpeakerId && avatar.id === 'idol'));
                const talkSrc = avatar.talkVideo || avatar.videoUrl || avatar.mediaUrl || '';
                const idleSrc = avatar.idleVideo || avatar.videoUrl || avatar.mediaUrl || '';
                const rawSrc = isSpeakingNow ? (talkSrc || idleSrc || (idx === 0 ? videoSrc : '')) : (idleSrc || talkSrc || (idx === 0 ? videoSrc : ''));
                const avatarVidSrc = resolveUrl(rawSrc);
                const isImg = isImageMedia(avatarVidSrc);

                return (
                  <div 
                    key={avatar.id} 
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      backgroundColor: '#020617',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: isSpeakingNow ? '0 0 20px rgba(251, 191, 36, 0.4)' : 'none',
                      border: isSpeakingNow ? '2px solid rgba(251, 191, 36, 0.8)' : 'none',
                      zIndex: isSpeakingNow ? 10 : 1
                    }}
                  >
                    {avatarVidSrc ? (
                      isImg ? (
                        <img src={avatarVidSrc} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <video
                          key={`${avatar.id}_${isSpeakingNow ? 'talk' : 'idle'}_${avatarVidSrc}`}
                          src={avatarVidSrc}
                          autoPlay
                          loop
                          muted={isUserMutedRef.current}
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
                        />
                      )
                    ) : (
                      <div style={{ textAlign: 'center', color: '#fff', fontSize: '12px' }}>
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}>🎭</span>
                        <span style={{ fontWeight: 'bold' }}>{avatar.name}</span>
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: '8px', left: '8px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontWeight: 'bold', color: '#fff' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSpeakingNow ? '#fbbf24' : '#10b981' }} />
                      <span>{avatar.name}</span>
                      {isSpeakingNow && <span style={{ color: '#fde047', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}>Đang nói</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        /* Freeform Visual Studio Stage Canvas */
        return (
          <div 
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: multiAvatarConfig.backgroundColor || '#0a0c14'
            }}
          >
            {/* Background Layer */}
            {multiAvatarConfig.backgroundUrl && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: `${multiAvatarConfig.backgroundTransform?.x ?? 0}%`,
                  top: `${multiAvatarConfig.backgroundTransform?.y ?? 0}%`,
                  width: `${multiAvatarConfig.backgroundTransform?.width ?? 100}%`,
                  height: `${multiAvatarConfig.backgroundTransform?.height ?? 100}%`,
                  transform: (multiAvatarConfig.backgroundTransform?.scale && multiAvatarConfig.backgroundTransform?.scale !== 100) ? `scale(${multiAvatarConfig.backgroundTransform.scale / 100})` : 'none',
                  transformOrigin: 'center center',
                  zIndex: 0
                }}
              >
                <img 
                  src={resolveUrl(multiAvatarConfig.backgroundUrl)}
                  alt="Studio Background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: multiAvatarConfig.backgroundTransform?.objectFit || 'cover',
                    filter: `${multiAvatarConfig.backgroundTransform?.blur ? `blur(${multiAvatarConfig.backgroundTransform.blur}px)` : ''} ${multiAvatarConfig.backgroundTransform?.brightness ? `brightness(${multiAvatarConfig.backgroundTransform.brightness}%)` : ''}`.trim() || 'none'
                  }}
                />
              </div>
            )}

            {/* Extra Layers */}
            {(multiAvatarConfig.extraImageLayers || []).map(layer => {
              const layerUrl = resolveUrl(layer.url);
              const isImg = layer.type !== 'video' && (isImageMedia(layerUrl) || !layer.type);
              const chromaStyle = getChromaStyle(layer.chromaKey);
              return (
                <div
                  key={layer.id}
                  style={{
                    position: 'absolute',
                    pointerEvents: 'none',
                    left: `${layer.x ?? 20}%`,
                    top: `${layer.y ?? 20}%`,
                    width: `${layer.width ?? 30}%`,
                    height: `${layer.height ?? 30}%`,
                    zIndex: layer.zIndex || 10,
                    borderRadius: `${layer.borderRadius ?? 0}px`,
                    opacity: (layer.opacity !== undefined ? layer.opacity : 100) / 100,
                    overflow: 'hidden',
                    ...chromaStyle
                  }}
                >
                  {isImg ? (
                    <img src={layerUrl} alt={layer.name || 'Extra Layer'} style={{ width: '100%', height: '100%', objectFit: layer.objectFit || 'contain', ...chromaStyle }} />
                  ) : (
                    <video src={layerUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: layer.objectFit || 'contain', ...chromaStyle }} />
                  )}
                </div>
              );
            })}

            {/* Avatar Characters */}
            {activeList.map((avatar, idx) => {
              const transform = avatar.transform || { 
                x: idx === 0 ? 4 : idx === 1 ? 48 : idx === 2 ? 25 : 65, 
                y: idx === 0 ? 8 : idx === 1 ? 28 : idx === 2 ? 60 : 10, 
                width: 48, 
                height: 75, 
                zIndex: 5, 
                objectFit: 'cover',
                borderRadius: 16
              };
              const isSpeakingNow = isSpeakerActive && (activeSpeakerId === avatar.id || (!activeSpeakerId && avatar.id === 'idol'));
              const talkSrc = avatar.talkVideo || avatar.videoUrl || avatar.mediaUrl || '';
              const idleSrc = avatar.idleVideo || avatar.videoUrl || avatar.mediaUrl || '';
              const rawSrc = isSpeakingNow ? (talkSrc || idleSrc || (idx === 0 ? videoSrc : '')) : (idleSrc || talkSrc || (idx === 0 ? videoSrc : ''));
              const avatarVidSrc = resolveUrl(rawSrc);
              const isImg = isImageMedia(avatarVidSrc);
              const chromaStyle = getChromaStyle(avatar.chromaKey || multiAvatarConfig.chromaKey);

              return (
                <div 
                  key={avatar.id} 
                  style={{
                    position: 'absolute',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    left: `${transform.x ?? (idx === 0 ? 4 : idx === 1 ? 48 : 25)}%`,
                    top: `${transform.y ?? (idx === 0 ? 8 : idx === 1 ? 28 : 50)}%`,
                    width: `${transform.width ?? 48}%`,
                    height: `${transform.height ?? 75}%`,
                    zIndex: isSpeakingNow ? (transform.zIndex || 5) + 10 : (transform.zIndex || 5),
                    borderRadius: `${transform.borderRadius ?? 16}px`,
                    boxShadow: isSpeakingNow ? '0 0 25px rgba(251, 191, 36, 0.6)' : 'none',
                    border: isSpeakingNow ? '2px solid rgba(251, 191, 36, 0.9)' : 'none'
                  }}
                >
                  <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit', backgroundColor: 'transparent', ...chromaStyle }}>
                    {avatarVidSrc ? (
                      isImg ? (
                        <img src={avatarVidSrc} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: transform.objectFit || 'cover', ...chromaStyle }} />
                      ) : (
                        <video
                          key={`${avatar.id}_${isSpeakingNow ? 'talk' : 'idle'}_${avatarVidSrc}`}
                          src={avatarVidSrc}
                          autoPlay
                          loop
                          muted={isUserMutedRef.current}
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: transform.objectFit || 'cover', backgroundColor: 'transparent', ...chromaStyle }}
                        />
                      )
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <span style={{ fontSize: '24px', marginBottom: '4px' }}>🧍</span>
                        <span style={{ fontSize: '11px', fontWeight: '900' }}>{avatar.name}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ position: 'absolute', bottom: '6px', left: '6px', zIndex: 20, display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '9px', fontWeight: '900', color: '#fff', pointerEvents: 'none' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSpeakingNow ? '#fbbf24' : '#10b981' }} />
                    <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{avatar.name}</span>
                    {isSpeakingNow && <span style={{ color: '#fde047', fontSize: '8px', textTransform: 'uppercase' }}>Nói</span>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })() : (resolvedFinalSrc || isDirectStreamActive) ? (
        /* 🎬 SINGLE VIDEO (0MS DIRECT GPU CLONE & IN-MEMORY BLOB) */
        <video
          ref={videoRef}
          src={isDirectStreamActive ? undefined : (resolvedFinalSrc || undefined)}
          autoPlay
          playsInline
          webkit-playsinline="true"
          loop
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onLoadedData={() => setIsVideoLoading(false)}
          onCanPlay={() => setIsVideoLoading(false)}
          onWaiting={() => {
            if (!isDirectStreamActiveRef.current && (!videoRef.current?.readyState || videoRef.current.readyState < 2)) {
              setIsVideoLoading(true);
            }
          }}
          onPlaying={() => {
            setIsVideoLoading(false);
            setIsPlaybackActive(true);
          }}
          onError={async (e) => {
            console.warn('[WindowCapture] Video loading error, attempting fallback:', e);
            const attached = attachOpenerDirectStream();
            if (!attached) {
              const fallback = await tryLoadFromLocalDB();
              if (fallback) {
                isHardwareLocalBlobRef.current = true;
                if (videoRef.current) videoRef.current.srcObject = null;
                setVideoSrc(fallback);
                setIsVideoLoading(false);
              } else {
                try {
                  const port = window.location.port;
                  const backendOrigin = (port === '5173' || port === '5174')
                    ? `${window.location.protocol}//${window.location.hostname}:3001`
                    : window.location.origin;
                  const res = await fetch(`${backendOrigin}/api/live-state`);
                  const data = await res.json();
                  if (data && data.mediaUrl && !data.clearMedia) {
                    const serverUrl = resolveUrl(data.mediaUrl);
                    if (serverUrl && videoRef.current) {
                      isHardwareLocalBlobRef.current = false;
                      videoRef.current.srcObject = null;
                      videoRef.current.src = serverUrl;
                      setVideoSrc(serverUrl);
                      videoRef.current.play().catch(() => {});
                      console.log('[WindowCapture] ✅ Ultimate fallback: Đã khôi phục video từ server:', serverUrl);
                    }
                  }
                } catch (fetchErr) {
                  console.warn('[WindowCapture] Server fallback also failed:', fetchErr);
                }
              }
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fitMode,
            display: 'block',
            backgroundColor: '#000',
            transform: 'translate3d(0, 0, 0)',
            WebkitTransform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            imageRendering: '-webkit-optimize-contrast',
            willChange: 'transform'
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#05070c', color: '#fff', textAlign: 'center', padding: '24px', userSelect: 'none' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '12px' }}>
            🎬
          </div>
          <div style={{ fontSize: '13px', fontWeight: '900', color: '#22d3ee', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            WINDOW CAPTURE SẴN SÀNG (9:16)
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', maxWidth: '240px', lineHeight: '1.4' }}>
            Đang chờ phát video từ phần mềm AvaLive...
          </div>
        </div>
      )}

      {/* 💬 OVERLAY PHỤ ĐỀ / CAPTIONS AI BRAIN & VOICE KỊCH BẢN */}
      {captions && !isControlsHidden && (
        <div
          style={{
            position: 'absolute',
            bottom: pinnedProduct ? '110px' : '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '85%',
            zIndex: 45,
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 'bold',
            lineHeight: '1.4',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🎙️ AI Live Voice
            </span>
          </div>
          <span>{captions}</span>
        </div>
      )}

      {/* 🔔 OVERLAY THÔNG BÁO SỰ KIỆN LIVE TỪ 14 TAB */}
      {liveEventNotice && !isControlsHidden && (
        <div
          style={{
            position: 'absolute',
            top: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 45,
            padding: '6px 14px',
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.95), rgba(244, 63, 94, 0.95))',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 20px rgba(225, 29, 72, 0.5)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '900',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none'
          }}
        >
          <span style={{ fontSize: '13px' }}>⚡</span>
          <span>{liveEventNotice.name || 'SỰ KIỆN LIVE ĐANG DIỄN RA'}</span>
        </div>
      )}

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

      {/* 📌 THẺ GHIM SẢN PHẨM TIKTOK SHOP TRÊN WINDOW CAPTURE 4K */}
      {pinnedProduct && !isControlsHidden && (
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
      {flowSequencerOverlay?.secondaryMediaUrl && !isControlsHidden && (() => {
        const trans = flowSequencerOverlay.secondaryMediaTransform;
        const chroma = getChromaStyle(flowSequencerOverlay.secondaryMediaChromaKey);
        const style = trans ? {
          position: 'absolute',
          zIndex: trans.zIndex || 35,
          pointerEvents: 'none',
          left: `${trans.x}%`,
          top: `${trans.y}%`,
          width: `${trans.width}%`,
          height: trans.height ? `${trans.height}%` : 'auto',
          ...chroma
        } : {
          position: 'absolute',
          zIndex: 35,
          pointerEvents: 'none',
          top: flowSequencerOverlay.secondaryMediaPos?.startsWith('bottom') ? undefined : '16px',
          bottom: flowSequencerOverlay.secondaryMediaPos?.startsWith('bottom') ? '80px' : undefined,
          left: flowSequencerOverlay.secondaryMediaPos?.endsWith('left') ? '16px' : (flowSequencerOverlay.secondaryMediaPos === 'center' ? '50%' : undefined),
          right: flowSequencerOverlay.secondaryMediaPos?.endsWith('right') ? '16px' : undefined,
          transform: flowSequencerOverlay.secondaryMediaPos === 'center' ? 'translateX(-50%)' : undefined,
          width: `${flowSequencerOverlay.secondaryMediaScale || 40}%`,
          maxWidth: '85%',
          ...chroma
        };

        return (
          <div style={style}>
            <video
              src={flowSequencerOverlay.secondaryMediaUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.5)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.85)',
                ...chroma
              }}
            />
          </div>
        );
      })()}

      {/* LỚP ẢNH BANNER OVERLAY */}
      {flowSequencerOverlay?.overlayImage && !isControlsHidden && (() => {
        const trans = flowSequencerOverlay.overlayImageTransform;
        const chroma = getChromaStyle(flowSequencerOverlay.overlayImageChromaKey);
        const style = trans ? {
          position: 'absolute',
          zIndex: trans.zIndex || 36,
          pointerEvents: 'none',
          left: `${trans.x}%`,
          top: `${trans.y}%`,
          width: `${trans.width}%`,
          height: trans.height ? `${trans.height}%` : 'auto',
          ...chroma
        } : {
          position: 'absolute',
          zIndex: 36,
          pointerEvents: 'none',
          top: flowSequencerOverlay.overlayImagePos?.startsWith('bottom') ? undefined : '16px',
          bottom: flowSequencerOverlay.overlayImagePos?.startsWith('bottom') ? '80px' : undefined,
          left: flowSequencerOverlay.overlayImagePos?.endsWith('left') ? '16px' : (flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' || flowSequencerOverlay.overlayImagePos === 'center' ? '50%' : undefined),
          right: flowSequencerOverlay.overlayImagePos?.endsWith('right') ? '16px' : undefined,
          transform: (flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' || flowSequencerOverlay.overlayImagePos === 'center') ? `translateX(-50%) scale(${(flowSequencerOverlay.overlayImageScale || 100) / 100})` : `scale(${(flowSequencerOverlay.overlayImageScale || 100) / 100})`,
          maxWidth: flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' ? '92%' : '140px',
          maxHeight: flowSequencerOverlay.overlayImagePos === 'top' || flowSequencerOverlay.overlayImagePos === 'bottom' ? '120px' : '140px',
          ...chroma
        };

        return (
          <div style={style}>
            <img 
              src={flowSequencerOverlay.overlayImage} 
              alt="Sequencer Overlay" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))',
                ...chroma
              }}
            />
          </div>
        );
      })()}

      {/* LỚP CHỮ BANNER OVERLAY */}
      {flowSequencerOverlay?.overlayText && !isControlsHidden && (() => {
        const trans = flowSequencerOverlay.overlayTextTransform;
        const style = trans ? {
          position: 'absolute',
          zIndex: trans.zIndex || 37,
          pointerEvents: 'none',
          left: `${trans.x}%`,
          top: `${trans.y}%`,
          width: `${trans.width}%`,
          display: 'flex',
          justifyContent: 'center'
        } : {
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
        };

        return (
          <div style={style}>
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
      );
    })()}

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
          🔴 4K 60 FPS REALTIME v4.6.2 (OBS ZERO-COPY)
        </div>
      )}
    </div>
  );
}
