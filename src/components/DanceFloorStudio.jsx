import React, { useRef, useState } from 'react';
import DanceFloorStage from './dancefloor/DanceFloorStage';
import Dance3DStage from './dancefloor/Dance3DStage';
import DanceFloorGiftShowcase from './dancefloor/DanceFloorGiftShowcase';
import { useDanceFloorEngine } from '../hooks/useDanceFloorEngine';
import { STAGE_PRESETS_3D } from '../lib/dance3d/stagePresets3D';
import DanceFloorAdminModal from './DanceFloorAdminModal';

// "Sàn Nhảy TikTok" — Bản rút gọn sạch sẽ, chỉ hiển thị trình diễn. Cấu hình đưa vào Admin Modal.
export default function DanceFloorStudio({ isLive, setIsLive, isAdminOpen, onCloseAdmin }) {
  const engine = useDanceFloorEngine();
  const {
    instances, settings, effectTriggers, sceneId, allCharacters, allEffects,
    activeBackgroundVideoUrl, connectedChannelList, selectedChannelIds,
    allDanceStyles, giftShowcase, rules, giftTiers
  } = engine;
  
  // Render Mode được đưa ra ngoài engine state trong bản cũ, ta tạm lưu ở local
  const [renderMode, setRenderMode] = useState('2d');
  const stageContainerRef = useRef(null);

  return (
    <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden font-sans">
      <div
        ref={stageContainerRef}
        className={`relative ${settings.stageAspectRatio === '9:16' ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full' : 'w-full h-full'}`}
      >
        {renderMode === '2d' ? (
          <DanceFloorStage
            instances={instances}
            maxSlots={settings.maxSlots}
            effectTriggers={effectTriggers}
            sceneId={sceneId}
            characters={allCharacters}
            effects={allEffects}
            customBackgroundImage={settings.customBackgroundImage}
            backgroundVideoUrl={activeBackgroundVideoUrl}
            isConnected={isLive || connectedChannelList.length > 0}
            connectionLabel={
              isLive
                ? `🔴 ĐANG LIVE TRÊN ${selectedChannelIds.length} KÊNH`
                : connectedChannelList.length > 0
                ? `${connectedChannelList.length} Kênh Sẵn Sàng`
                : 'Chưa Kết Nối Kênh'
            }
          />
        ) : (
          <Dance3DStage
            instances={instances}
            characters={allCharacters}
            effects={allEffects}
            danceStyles={allDanceStyles}
            effectTriggers={effectTriggers}
            stagePresetId={STAGE_PRESETS_3D[0].id}
            customBackgroundImage={settings.customBackgroundImage}
            backgroundVideoUrl={activeBackgroundVideoUrl}
            autoCameraEnabled={settings.autoCameraEnabled}
            isConnected={isLive || connectedChannelList.length > 0}
            connectionLabel={
              isLive
                ? `🔴 ĐANG LIVE TRÊN ${selectedChannelIds.length} KÊNH`
                : connectedChannelList.length > 0
                ? `${connectedChannelList.length} Kênh Sẵn Sàng`
                : 'Chưa Kết Nối Kênh'
            }
          />
        )}
        <DanceFloorGiftShowcase giftShowcase={giftShowcase} />
      </div>

      {/* Render bảng Admin Modal khi được gọi */}
      <DanceFloorAdminModal
        isOpen={isAdminOpen}
        onClose={onCloseAdmin}
        engine={engine}
        renderMode={renderMode}
        setRenderMode={setRenderMode}
        isLive={isLive}
        setIsLive={setIsLive}
      />
    </div>
  );
}
