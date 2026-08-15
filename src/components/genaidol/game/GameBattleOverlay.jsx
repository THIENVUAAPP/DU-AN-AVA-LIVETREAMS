import React, { useState, useEffect } from 'react';
import GameChienDau from './GameChienDau';

// Cửa Sổ Overlay Trận Đấu Trong Suốt Cho TikTok LIVE Studio / OBS Studio
// Mở đường dẫn "?overlay=gamebattle" trên trình duyệt, rồi dùng Window Capture / Browser Source trong TikTok LIVE Studio.
export default function GameBattleOverlay() {
  const [lastLiveEvent, setLastLiveEvent] = useState(null);

  useEffect(() => {
    document.title = 'AVA Battle Overlay — TikTok LIVE Studio';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    if (typeof BroadcastChannel === 'undefined') return undefined;
    const channel = new BroadcastChannel('avalive_gamebattle_stage');
    channel.onmessage = (event) => {
      if (event.data?.type === 'LIVE_EVENT') {
        setLastLiveEvent(event.data.payload);
      }
    };
    return () => channel.close();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent">
      <GameChienDau 
        isPopout={true}
        onOpenAdmin={null}
        externalLiveEvent={lastLiveEvent}
      />
    </div>
  );
}
