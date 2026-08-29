import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import GameChienDau from './GameChienDau';

// Cửa Sổ Overlay Trận Đấu Trong Suốt Cho TikTok LIVE Studio / OBS Studio
// Mở đường dẫn "?overlay=gamebattle" trên trình duyệt, rồi dùng Window Capture / Browser Source trong TikTok LIVE Studio.
export default function GameBattleOverlay() {
  const [lastLiveEvent, setLastLiveEvent] = useState(null);
  const ratio = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ratio') || '9:16' : '9:16';

  useEffect(() => {
    document.title = 'AVA Battle Overlay — TikTok LIVE Studio';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    // 1. KẾT NỐI SOCKET.IO TRỰC TIẾP ĐẾN BACKEND (bắt buộc khi Overlay mở qua host khác
    // với Bảng Điều Khiển — ví dụ 127.0.0.1.nip.io cho OBS/TikTok LIVE Studio — vì lúc đó
    // BroadcastChannel/localStorage không còn hoạt động do khác origin)
    let backendUrl = '';
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const customBackend = urlParams.get('backend') || localStorage.getItem('aidol_backend_url');
      if (customBackend && customBackend.startsWith('http')) {
        backendUrl = customBackend;
      } else {
        backendUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
      }
    }

    let socket = null;
    try {
      socket = io(backendUrl || window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      socket.on('tiktok_chat', (data) => {
        if (!data) return;
        setLastLiveEvent({
          type: 'COMMENT',
          data: {
            comment: data.comment,
            text: data.comment,
            nickname: data.nickname || data.username,
            username: data.nickname || data.username,
            userId: data.userId || 'user_' + Date.now()
          }
        });
      });

      socket.on('tiktok_gift', (data) => {
        if (!data) return;
        setLastLiveEvent({
          type: 'GIFT',
          data: {
            nickname: data.nickname || data.username,
            username: data.nickname || data.username,
            diamondCount: data.diamondCount || data.repeatCount || 1,
            userId: data.userId || 'guest_' + Date.now()
          }
        });
      });

      socket.on('battle_event', (data) => {
        if (data) setLastLiveEvent(data);
      });
    } catch (err) {
      console.warn('[BattleOverlay] Socket init error:', err);
    }

    // 2. BroadcastChannel (đồng bộ khi Overlay và Bảng Điều Khiển cùng origin)
    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('avalive_gamebattle_stage');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LIVE_EVENT') {
          setLastLiveEvent(event.data.payload);
        }
      };
    }

    return () => {
      if (socket) socket.disconnect();
      if (channel) channel.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent">
      <GameChienDau 
        isPopout={true}
        onOpenAdmin={null}
        externalLiveEvent={lastLiveEvent}
        aspectRatio={ratio}
      />
    </div>
  );
}
