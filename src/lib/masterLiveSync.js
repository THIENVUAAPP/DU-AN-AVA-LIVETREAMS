/**
 * ⚡ MASTER LIVE REALTIME SYNCHRONIZER (UNIVERSAL SINGLE-LINK ENGINE)
 * Đồng bộ 1 link duy nhất cho toàn bộ: Live Studio, AI Idol, Sàn Nhảy 3D, Game Bản Đồ, Game PK
 * Hỗ trợ đồng bộ trên cả: macOS, Windows, Web Vercel Cloud, OBS Studio, TikTok Live Studio
 */

const STORAGE_KEY = 'avalive_master_live_state';
const BROADCAST_CHANNEL_NAME = 'avalive_master_live_stream';

export function getMasterLiveState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    stage: 'idol', // 'idol' | 'dancefloor' | 'bando' | 'battle' | 'camera' | 'broadcast'
    aspectRatio: '9:16',
    characterName: 'AI Idol Lan Hương',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
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

  // 2. Gửi qua BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage(updated);
      channel.close();
    } catch (e) {}
  }

  // 3. Gửi Socket.io nếu có
  if (socket && socket.connected) {
    try {
      socket.emit('MASTER_LIVE_STATE_UPDATE', updated);
    } catch (e) {}
  }

  // 4. Gửi REST API tới Backend Server nếu có
  const backendUrl = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001') ? `${window.location.protocol}//${window.location.hostname}:3001` : '';
  if (backendUrl) {
    fetch(`${backendUrl}/api/live-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(() => {});
  }

  // 5. Dispatch CustomEvent nội bộ
  try {
    window.dispatchEvent(new CustomEvent('avalive_master_state_changed', { detail: updated }));
  } catch (e) {}

  return updated;
}
