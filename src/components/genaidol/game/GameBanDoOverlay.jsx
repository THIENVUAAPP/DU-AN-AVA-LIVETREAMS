import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import GameBanDoVietNam from './GameBanDoVietNam';
import bandoEngine from './bandoGameEngine';

export default function GameBanDoOverlay() {
  const [liveEvent, setLiveEvent] = useState(null);
  const ratio = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ratio') || '9:16' : '9:16';

  useEffect(() => {
    document.title = 'AVA Bản Đồ Việt Nam (Realtime Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    const backendUrl = typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:3001' : '';

    // 1. WebSocket Socket.io cho TikTok Live Studio & OBS
    let socket = null;
    try {
      socket = io(backendUrl || window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true
      });
      socket.on('LIVE_EVENT', (data) => {
        if (data) setLiveEvent(data);
      });
      socket.on('bando_event', (data) => {
        if (data) setLiveEvent(data);
      });
    } catch (err) {}

    // 2. BroadcastChannel
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

    // 3. Storage Event
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
