import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import GameBanDoVietNam from './GameBanDoVietNam';
import bandoEngine from './bandoGameEngine';
import bandoAudio from './bandoAudioEngine';
import { mapVoiceEngine } from './gameVoiceEngine';

export default function GameBanDoOverlay() {
  const [liveEvent, setLiveEvent] = useState(null);
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const ratio = params ? params.get('ratio') || '9:16' : '9:16';
  const isClean = params ? params.get('clean') === 'true' : false;

  useEffect(() => {
    // Trên Overlay OBS Studio / TikTok Live Studio: Luôn luôn mở khóa âm thanh 100%
    try {
      bandoAudio.setLocalSpeakerMute(false);
      bandoAudio.unlock();
    } catch (e) {}
    if (isClean && typeof localStorage !== 'undefined') {
      localStorage.setItem('avalive_bando_ultra_clean', 'true');
    }
    document.title = 'AVA Bản Đồ Việt Nam (Realtime Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    let backendUrl = '';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const customUrl = urlParams.get('backend') || localStorage.getItem('aidol_backend_url') || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL);
      if (customUrl && customUrl.startsWith('http')) {
        backendUrl = customUrl;
      } else {
        backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
      }
    }

    // ============================
    // HÀM XỬ LÝ COMMENT TIKTOK LIVE
    // → Gọi đúng processComment (thay vì handleUserComment không tồn tại trên bandoEngine)
    // → Kích hoạt AI Voice Engine phản hồi bình luận
    // ============================
    const handleComment = (data) => {
      if (!data) return;
      const text = data.comment || data.text || '';
      const author = data.nickname || data.username || data.uniqueId || 'Khán Giả';
      const userId = data.userId || data.uniqueId || 'chat_user';
      const avatar = data.profilePictureUrl || '';
      if (!text) return;

      // Xử lý comment & tự động kích hoạt Voice Engine qua bandoEngine.processComment
      try {
        bandoEngine.processComment(text, { id: userId, username: author, avatar });
      } catch (e) {
        console.warn('[BandoOverlay] processComment error:', e);
      }

      setLiveEvent({
        type: 'COMMENT',
        data: { comment: text, text, username: author, nickname: author, userId, avatar },
        _seq: Date.now() + Math.random()
      });
    };

    // ============================
    // HÀM XỬ LÝ QUÀ TẶNG TIKTOK LIVE
    // → Cắm cờ bản đồ theo số xu/quà
    // ============================
    const handleGift = (data) => {
      if (!data) return;
      const payload = {
        giftId: data.giftId,
        giftName: data.giftName,
        count: data.repeatCount || data.count || 1,
        diamondCount: data.diamondCount || 1,
        userId: data.userId || data.uniqueId || 'tiktok_viewer',
        username: data.nickname || data.uniqueId || data.username || 'Khách Live',
        avatar: data.profilePictureUrl || data.avatar || '',
        regionTarget: data.regionTarget || null
      };

      try {
        bandoEngine.processGift(payload);
      } catch (e) {
        console.warn('[BandoOverlay] processGift error:', e);
      }

      setLiveEvent({
        type: 'GIFT',
        data: payload,
        _seq: Date.now() + Math.random()
      });
    };

    // ============================
    // 1. KẾT NỐI WEBSOCKET ĐẾN BACKEND
    // ============================
    let socket = null;
    try {
      socket = io(backendUrl || (window.location.origin !== 'file://' ? window.location.origin : 'http://localhost:3001'), {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('[BandoOverlay] ✅ Kết nối Socket.io thành công:', socket.id);
      });

      socket.on('connect_error', (err) => {
        console.warn('[BandoOverlay] ❌ Lỗi kết nối socket:', err.message);
      });

      // ✅ Nhận trực tiếp sự kiện quà tặng TikTok
      socket.on('tiktok_gift', handleGift);

      // ✅ Nhận trực tiếp sự kiện comment TikTok
      socket.on('tiktok_chat', handleComment);

      socket.on('tiktok_connected', (data) => {
        console.log('[BandoOverlay] 🎉 TikTok kết nối thành công:', data?.username, '| RoomID:', data?.roomId);
      });

      socket.on('tiktok_error', (err) => {
        console.warn('[BandoOverlay] ⚠️ TikTok lỗi kết nối:', err);
      });

    } catch (err) {
      console.warn('[BandoOverlay] Socket init error:', err);
    }

    // 2. BroadcastChannel (đồng bộ giữa các tab/cửa sổ)
    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('avalive_bando_stage');
        bc.onmessage = (e) => {
          if (e.data && e.data.lastEvent) {
            setLiveEvent(e.data.lastEvent);
          }
        };
      } catch (err) {}
    }

    // 3. Storage Event (đồng bộ qua localStorage)
    const handleStorage = (e) => {
      if (e.key === 'avalive_bando_realtime_sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.lastEvent) setLiveEvent(parsed.lastEvent);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (socket) socket.disconnect();
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // 🎯 WINDOW SURFACE INVALIDATOR — Ép Chrome flush frame cho TikTok LIVE Studio bắt hình
  useEffect(() => {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;pointer-events:none;opacity:0.001;z-index:99999;background:white;';
    document.body.appendChild(div);
    let fc = 0;
    const interval = setInterval(() => {
      fc++;
      div.style.background = fc % 2 === 0 ? '#000000' : '#ffffff';
    }, 100);
    return () => { clearInterval(interval); if (div.parentNode) div.parentNode.removeChild(div); };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent select-none">
      <GameBanDoVietNam 
        isPopout={true}
        externalLiveEvent={liveEvent}
        aspectRatio={ratio}
      />
    </div>
  );
}
