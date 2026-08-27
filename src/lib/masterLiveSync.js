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
            supabaseBroadcastChannel.send({
              type: 'broadcast',
              event: 'MASTER_LIVE_STATE_UPDATE',
              payload: currentState
            }).catch(() => {});
          }
        } catch (e) {}
      }
    });

    supabaseBroadcastChannel.subscribe();
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
    stage: 'idol', // 'idol' | 'dancefloor' | 'bando' | 'battle' | 'camera' | 'broadcast'
    aspectRatio: '9:16',
    characterName: 'AI Idol Linh Anh',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    isVideo: false,
    flvUrl: null,
    isConnected: true,
    isDarkMode: true,
    updatedAt: Date.now()
  };
}

export function syncMasterLiveState(partialState, socket = null) {
  if (typeof window === 'undefined') return;

  const current = getMasterLiveState() || {};
  const updated = {
    ...current,
    ...partialState,
    type: 'MASTER_LIVE_STATE_UPDATE',
    updatedAt: Date.now()
  };

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
        payload: updated
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
      socket.emit('MASTER_LIVE_STATE_UPDATE', updated);
    } catch (e) {}
  }

  // 5. Gửi REST API tới Backend Server hoặc Vercel Serverless
  const backendUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') ? `${window.location.protocol}//${window.location.hostname}:3001` : '';
  const apiEndpoint = backendUrl ? `${backendUrl}/api/live-state` : '/api/live-state';
  fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  }).catch(() => {});

  // 6. Dispatch CustomEvent nội bộ window
  try {
    window.dispatchEvent(new CustomEvent('avalive_master_state_changed', { detail: updated }));
  } catch (e) {}

  return updated;
}
