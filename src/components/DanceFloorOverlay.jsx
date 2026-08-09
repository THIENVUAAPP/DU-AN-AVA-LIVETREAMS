import React, { useState, useEffect } from 'react';
import DanceFloorStage from './dancefloor/DanceFloorStage';

const CHANNEL_NAME = 'avalive_dancefloor_stage';

// Cửa Sổ Overlay Trong Suốt — mở URL "?overlay=dancefloor" trong 1 cửa sổ trình duyệt riêng, rồi dùng
// chức năng Capture Cửa Sổ/Màn Hình có sẵn của TikTok LIVE Studio / OBS / YouTube Studio để ghép lên
// livestream thật. Đồng bộ trạng thái với tab điều khiển chính qua BroadcastChannel (cùng trình duyệt,
// không cần backend/WebSocket riêng).
export default function DanceFloorOverlay() {
  const [stageState, setStageState] = useState({
    instances: [], effectTriggers: [], sceneId: null, maxSlots: 10, customBackgroundImage: null, allCharacters: [],
  });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    document.title = 'AVA Overlay — Sàn Nhảy TikTok';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    if (typeof BroadcastChannel === 'undefined') return undefined;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      setStageState(event.data);
      setConnected(true);
    };
    return () => channel.close();
  }, []);

  return (
    <div className="fixed inset-0">
      {!connected && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-black z-50">
          ⏳ Đang chờ đồng bộ từ tab "Sàn Nhảy TikTok"... (mở tab đó và giữ đang bật)
        </div>
      )}
      <DanceFloorStage
        instances={stageState.instances}
        maxSlots={stageState.maxSlots}
        effectTriggers={stageState.effectTriggers}
        sceneId={stageState.sceneId}
        characters={stageState.allCharacters}
        customBackgroundImage={stageState.customBackgroundImage}
        isConnected={connected}
        connectionLabel="OVERLAY"
        transparent
      />
    </div>
  );
}
