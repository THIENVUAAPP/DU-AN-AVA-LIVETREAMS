import React, { useState, useEffect, useRef } from 'react';
import DanceFloorStage from './dancefloor/DanceFloorStage';
import { DEFAULT_CHARACTERS, DANCE_EFFECTS, SCENE_BACKGROUNDS } from '../lib/danceFloorData';
import { io } from 'socket.io-client';

const CHANNEL_NAME = 'avalive_dancefloor_stage';

export default function DanceFloorOverlay() {
  const [stageState, setStageState] = useState(() => {
    // Khởi tạo ngay với 3 nhân vật nhảy múa sinh động để OBS luôn có chuyển động 60FPS
    const initialDancers = DEFAULT_CHARACTERS.slice(0, 3).map((char, index) => ({
      slotId: `init_slot_${index}`,
      characterId: char.id,
      danceStyleId: index === 0 ? 'dance_groove' : index === 1 ? 'dance_bounce' : 'dance_spin',
      userName: `Vũ Công #${index + 1}`,
      userAvatar: null,
      size: 'medium',
      createdAt: Date.now() - index * 1000
    }));

    return {
      instances: initialDancers,
      effectTriggers: [{ id: 'init_fx', effectId: 'fx_confetti', x: 50, y: 50, timestamp: Date.now() }],
      sceneId: 'scene_neon_club',
      maxSlots: 10,
      customBackgroundImage: null,
      allCharacters: DEFAULT_CHARACTERS,
      allEffects: DANCE_EFFECTS,
    };
  });

  const [connected, setConnected] = useState(true);

  useEffect(() => {
    document.title = 'AVA Overlay — Sàn Nhảy TikTok';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    // 1. Lắng nghe BroadcastChannel từ tab chính
    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data && Array.isArray(event.data.instances)) {
          setStageState(prev => ({ ...prev, ...event.data }));
          setConnected(true);
        }
      };
    }

    // 2. Kết nối Socket.io để nhận sự kiện Quà tặng & Bình luận TikTok Live
    const backendUrl = typeof window !== 'undefined' ? (window.location.port === '5173' || window.location.port === '3000' || window.location.port === '3001' ? `${window.location.protocol}//${window.location.hostname}:3001` : window.location.origin) : 'http://localhost:3001';
    let socket = null;
    try {
      socket = io(backendUrl, { transports: ['websocket', 'polling'], reconnection: true });
      socket.on('tiktok_gift', (gift) => {
        // Tự động triệu hồi nhân vật nhảy + pháo hoa ăn mừng khi có quà
        const randomChar = DEFAULT_CHARACTERS[Math.floor(Math.random() * DEFAULT_CHARACTERS.length)];
        const newInstance = {
          slotId: `gift_${Date.now()}`,
          characterId: randomChar?.id || 'char_meo2k4',
          danceStyleId: 'dance_victory',
          userName: gift.username || gift.nickname || 'Khách Tặng Quà',
          userAvatar: gift.profilePictureUrl || null,
          size: 'large',
          createdAt: Date.now()
        };

        const newFx = {
          id: `fx_${Date.now()}`,
          effectId: 'fx_fireworks',
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          timestamp: Date.now()
        };

        setStageState(prev => ({
          ...prev,
          instances: [newInstance, ...prev.instances.slice(0, 7)],
          effectTriggers: [newFx, ...prev.effectTriggers.slice(0, 5)]
        }));
      });

      socket.on('tiktok_chat', (chat) => {
        // Hiệu ứng pháo giấy / tim khi có bình luận
        const newFx = {
          id: `fx_${Date.now()}`,
          effectId: Math.random() > 0.5 ? 'fx_hearts' : 'fx_confetti',
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          timestamp: Date.now()
        };
        setStageState(prev => ({
          ...prev,
          effectTriggers: [newFx, ...prev.effectTriggers.slice(0, 5)]
        }));
      });
    } catch (e) {}

    return () => {
      if (channel) channel.close();
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent select-none pointer-events-auto">
      <DanceFloorStage
        instances={stageState.instances}
        maxSlots={stageState.maxSlots}
        effectTriggers={stageState.effectTriggers}
        sceneId={stageState.sceneId}
        characters={stageState.allCharacters}
        effects={stageState.allEffects}
        customBackgroundImage={stageState.customBackgroundImage}
        isConnected={connected}
        connectionLabel="LIVE OVERLAY"
        transparent
      />
    </div>
  );
}
