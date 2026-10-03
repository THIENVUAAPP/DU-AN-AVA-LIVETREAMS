import { supabase } from './supabaseClient.js';

/**
 * ⚡ MASTER LIVE REALTIME SYNCHRONIZER (UNIVERSAL SINGLE-LINK ENGINE)
 * Đồng bộ 1 link duy nhất cho toàn bộ: Live Studio, AI Idol, Sàn Nhảy 3D, Game Bản Đồ, Game PK
 * Hỗ trợ đồng bộ trên cả: macOS, Windows, Web Vercel Cloud, OBS Studio, TikTok Live Studio
 * Kênh truyền: Supabase Realtime Broadcast + Socket.io + BroadcastChannel + LocalStorage + REST API
 */

const STORAGE_KEY = 'avalive_master_live_state';
const BROADCAST_CHANNEL_NAME = 'avalive_master_live_stream';
const SUPABASE_REALTIME_TOPIC = 'avalive_master_live_realtime';

// Singleton Supabase Realtime Broadcast Channel
let supabaseBroadcastChannel = null;
try {
  if (supabase && typeof supabase.channel === 'function') {
    supabaseBroadcastChannel = supabase.channel(SUPABASE_REALTIME_TOPIC, {
      config: { broadcast: { self: true } }
    });

    supabaseBroadcastChannel.on('broadcast', { event: 'REQUEST_MASTER_LIVE_STATE' }, () => {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const currentState = JSON.parse(raw);
            let tunnelUrl = currentState.tunnelUrl || localStorage.getItem('avalive_tunnel_url') || null;
            let exportMedia = currentState.mediaUrl || currentState.mainMediaUrl;
            if (exportMedia && typeof exportMedia === 'string' && tunnelUrl) {
              if (exportMedia.includes('localhost') || exportMedia.includes('127.0.0.1')) {
                exportMedia = exportMedia.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, tunnelUrl);
              } else if (exportMedia.startsWith('/uploads/')) {
                exportMedia = `${tunnelUrl.replace(/\/$/, '')}${exportMedia}`;
              }
            }
            supabaseBroadcastChannel.send({
              type: 'broadcast',
              event: 'MASTER_LIVE_STATE_UPDATE',
              payload: { ...currentState, mediaUrl: exportMedia, tunnelUrl, updatedAt: Date.now() }
            }).catch(() => {});
          }
        } catch (e) {}
      }
    });

    supabaseBroadcastChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Send initial state immediately when connected
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const currentState = JSON.parse(raw);
            supabaseBroadcastChannel.send({
              type: 'broadcast',
              event: 'MASTER_LIVE_STATE_UPDATE',
              payload: currentState
            }).catch(() => {});
          }
        } catch (e) {}
      }
    });
  }
} catch (e) {
  console.warn('[MasterSync] Supabase broadcast init note:', e.message);
}

export function getMasterLiveState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    stage: 'idol', // 'idol' | 'bando' | 'battle' | 'camera' | 'broadcast'
    aspectRatio: '9:16',
    characterName: 'AvaLive VIP PRO',
    mediaUrl: null,
    isVideo: true,
    videoPlaybackEvent: 'play',
    isPlaying: true,
    flvUrl: null,
    isConnected: true,
    isDarkMode: true,
    updatedAt: Date.now()
  };
}

export function syncMasterLiveState(partialState, socket = null) {
  if (typeof window === 'undefined') return;

  // 🛑 FIX: KHI NGƯỜI DÙNG ĐÃ NGẮT KẾT NỐI SÂN KHẤU CHÍNH, CHẶN MỌI TÍN HIỆU TỰ ĐỘNG KHÁC.
  // NHƯNG video/nhân vật do CHÍNH NGƯỜI DÙNG tải lên / chọn trên Sân Khấu Chính luôn phải đồng bộ ngay lập tức ra OBS & TikTok Live Studio.
  const isMasterStageSynced = localStorage.getItem('avalive_master_sync_active') === 'true';
  let hasUserStageMedia = false;
  try {
    const lockedMedia = localStorage.getItem('avalive_user_locked_media');
    hasUserStageMedia = !!(lockedMedia && lockedMedia !== 'null' && lockedMedia !== 'undefined' && lockedMedia.trim() !== '');
  } catch (e) {}
  const isExplicitUserMedia = partialState.userInitiated === true || (
    typeof partialState.mediaUrl === 'string' && partialState.mediaUrl.trim() !== '' &&
    partialState.clearMedia !== true &&
    (partialState.isMasterSynced === true || partialState.force === true || !!partialState.videoPlaybackEvent)
  );
  if (!isMasterStageSynced && !hasUserStageMedia && !isExplicitUserMedia && partialState.type !== 'CLEAR_STAGE' && partialState.clearMedia !== true && partialState.stage !== 'offline') {
    return;
  }

  const current = getMasterLiveState() || {};
  let tunnelUrl = partialState.tunnelUrl || current.tunnelUrl;
  if (!tunnelUrl && typeof window !== 'undefined') {
    try {
      const savedTunnel = localStorage.getItem('avalive_tunnel_data');
      if (savedTunnel) {
        const parsed = JSON.parse(savedTunnel);
        if (parsed.tunnelUrl) tunnelUrl = parsed.tunnelUrl;
      }
      if (!tunnelUrl) {
        const directTunnel = localStorage.getItem('avalive_tunnel_url');
        if (directTunnel) tunnelUrl = directTunnel;
      }
    } catch (e) {}
  }

  const updated = {
    ...current,
    ...partialState,
    tunnelUrl: tunnelUrl || current.tunnelUrl || null,
    type: 'MASTER_LIVE_STATE_UPDATE',
    updatedAt: Date.now()
  };

  // Bản gửi cho các kênh từ xa (Supabase / Socket / REST / Cloud): blob: chỉ có tác dụng trên máy cục bộ,
  // nên KHÔNG đẩy blob: ra ngoài để tránh ghi đè URL server hợp lệ bằng URL không phát được (màn hình đen).
  const isBlobMedia = typeof updated.mediaUrl === 'string' && updated.mediaUrl.startsWith('blob:');
  const remoteUpdated = isBlobMedia
    ? { ...updated, mediaUrl: (typeof current.mediaUrl === 'string' && !current.mediaUrl.startsWith('blob:')) ? current.mediaUrl : undefined }
    : updated;
  if (isBlobMedia && remoteUpdated.mediaUrl === undefined) delete remoteUpdated.mediaUrl;

  // TỰ ĐỘNG CHUYỂN ĐỔI LINK LOCALHOST THÀNH LINK CLOUDFLARE TUNNEL (ĐỂ VERCEL HTTPS CÓ THỂ ĐỌC ĐƯỢC - TRÁNH LỖI MIXED CONTENT)
  if (remoteUpdated.mediaUrl && typeof remoteUpdated.mediaUrl === 'string' && updated.tunnelUrl) {
    if (remoteUpdated.mediaUrl.includes('localhost') || remoteUpdated.mediaUrl.includes('127.0.0.1')) {
      remoteUpdated.mediaUrl = remoteUpdated.mediaUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, updated.tunnelUrl);
    } else if (remoteUpdated.mediaUrl.startsWith('/uploads/')) {
      remoteUpdated.mediaUrl = `${updated.tunnelUrl.replace(/\/$/, '')}${remoteUpdated.mediaUrl}`;
    }
  }


  // 1. Lưu LocalStorage (Kích hoạt storage event giữa các tab/cửa sổ)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem('aidol_clean_stream_state', JSON.stringify(updated));
  } catch (e) {}

  // 2. Gửi qua Supabase Realtime Cloud Broadcast (Đồng bộ siêu tốc OBS & TikTok Live Studio trên toàn thế giới)
  try {
    if (supabaseBroadcastChannel) {
      supabaseBroadcastChannel.send({
        type: 'broadcast',
        event: 'MASTER_LIVE_STATE_UPDATE',
        payload: remoteUpdated
      });
    }
  } catch (e) {}

  // 3. Gửi qua BroadcastChannel cục bộ trình duyệt
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage(updated);
      setTimeout(() => channel.close(), 100);
    } catch (e) {}
    try {
      const cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
      cleanChannel.postMessage({
        type: 'STREAM_MEDIA_UPDATE',
        mediaUrl: updated.mediaUrl,
        flvUrl: updated.flvUrl,
        isVideo: !!updated.isVideo,
        characterName: updated.characterName,
        isConnected: !!updated.isConnected
      });
      setTimeout(() => cleanChannel.close(), 100);
    } catch (e) {}
  }

  // 4. Gửi Socket.io nếu có kết nối
  if (socket && socket.connected) {
    try {
      socket.emit('MASTER_LIVE_STATE_UPDATE', remoteUpdated);
      // Chỉ bắn sự kiện điều khiển video khi người dùng thực sự bấm Play/Pause/Seek
      if (partialState.videoPlaybackEvent || (partialState.force && typeof partialState.videoCurrentTime === 'number')) {
        socket.emit('VIDEO_PLAYBACK_CONTROL', {
          action: partialState.videoPlaybackEvent || (partialState.isPlaying ? 'play' : 'pause'),
          isPlaying: partialState.isPlaying !== undefined ? partialState.isPlaying : updated.isPlaying,
          currentTime: partialState.videoCurrentTime,
          force: !!partialState.force,
          mediaUrl: remoteUpdated.mediaUrl,
          timestamp: Date.now()
        });
      }
    } catch (e) {}
  }

  // 5. Gửi REST API tới Backend Server (Đồng bộ tức thì trên Electron, Web, Mac & Windows)
  let backendUrl = 'http://localhost:3001';
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('aidol_backend_url');
    if (custom && custom.startsWith('http')) {
      backendUrl = custom;
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
    } else if (window.location.protocol === 'file:') {
      backendUrl = 'http://localhost:3001';
    } else if (window.location.port === '5173' || window.location.port === '3000') {
      backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
    } else if (window.location.origin && window.location.origin.startsWith('http')) {
      backendUrl = window.location.origin;
    }
  }
  const apiEndpoint = `${backendUrl.replace(/\/$/, '')}/api/live-state`;
  fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(remoteUpdated)
  }).catch(() => {});

  fetch('https://avalivepro.vercel.app/api/live-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(remoteUpdated)
  }).catch(() => {});

  // 6. Dispatch CustomEvent nội bộ window
  try {
    window.dispatchEvent(new CustomEvent('avalive_master_state_changed', { detail: updated }));
  } catch (e) {}

  return updated;
}

export function sendVideoControl(control, socket = null) {
  if (typeof window === 'undefined' || !control) return;



  const payload = {
    ...control,
    timestamp: control.timestamp || Date.now()
  };

  // 1. Gửi qua socket.io
  if (socket && socket.connected) {
    try {
      socket.emit('VIDEO_PLAYBACK_CONTROL', payload);
    } catch (e) {}
  }

  // 2. Gửi qua BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({
        type: 'VIDEO_PLAYBACK_CONTROL',
        ...payload
      });
      setTimeout(() => bc.close(), 50);
    } catch (e) {}
  }

  // 3. Gửi qua Supabase Realtime
  try {
    if (supabaseBroadcastChannel) {
      supabaseBroadcastChannel.send({
        type: 'broadcast',
        event: 'VIDEO_PLAYBACK_CONTROL',
        payload
      }).catch(() => {});
    }
  } catch (e) {}

  // 4. Gửi REST API nhanh
  let backendUrl = 'http://localhost:3001';
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('aidol_backend_url');
    if (custom && custom.startsWith('http')) {
      backendUrl = custom;
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
    } else if (window.location.origin && window.location.origin.startsWith('http')) {
      backendUrl = window.location.origin;
    }
  }
  const endpoint = `${backendUrl.replace(/\/$/, '')}/api/video-control`;
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

export function broadcastAiVoice(audioUrlOrPayload) {
  if (typeof window === 'undefined' || !audioUrlOrPayload) return;
  
  let payload = typeof audioUrlOrPayload === 'string' ? { audioUrl: audioUrlOrPayload } : { ...audioUrlOrPayload };
  payload.timestamp = payload.timestamp || Date.now();

  let finalUrl = payload.audioUrl || '';
  if (finalUrl && typeof finalUrl === 'string') {
    let tunnelUrl = localStorage.getItem('avalive_tunnel_url') || '';
    if (finalUrl.startsWith('/api/')) {
      finalUrl = `https://avalivepro.vercel.app${finalUrl}`;
    } else if (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1')) {
      if (tunnelUrl) {
        finalUrl = finalUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, tunnelUrl);
      } else {
        finalUrl = finalUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, 'https://avalivepro.vercel.app');
      }
    }
    payload.audioUrl = finalUrl;
  }

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'AI_VOICE_PLAY', ...payload });
      setTimeout(() => bc.close(), 50);
    } catch (e) {}
  }
  try {
    if (supabaseBroadcastChannel) {
      supabaseBroadcastChannel.send({ type: 'broadcast', event: 'AI_VOICE_PLAY', payload }).catch(()=>{});
    }
  } catch (e) {}
}
