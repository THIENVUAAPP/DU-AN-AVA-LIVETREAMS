import React, { useRef, useState } from 'react';
import DanceFloorStage from './dancefloor/DanceFloorStage';
import Dance3DStage from './dancefloor/Dance3DStage';
import DanceFloorGiftShowcase from './dancefloor/DanceFloorGiftShowcase';
import DanceFloorVideoOverlay from './dancefloor/DanceFloorVideoOverlay';
import { useDanceFloorEngine } from '../hooks/useDanceFloorEngine';
import { STAGE_PRESETS_3D } from '../lib/dance3d/stagePresets3D';
import DanceFloorAdminModal from './DanceFloorAdminModal';
import UniversalMasterOverlayModal from './UniversalMasterOverlayModal';
import { Settings, Radio, Sparkles, Share2, Copy, Check, ExternalLink, CheckCircle2, Box, Move3d } from 'lucide-react';

// "Sàn Nhảy TikTok" — Bản nâng cấp đầy đủ: Trình diễn 2D/3D + Ghép Camera Overlay + Cấu hình Admin + Sao chép Link Overlay OBS/TikTok
export default function DanceFloorStudio({ isLive, setIsLive, isAdminOpen: propAdminOpen, onCloseAdmin: propCloseAdmin }) {
  const engine = useDanceFloorEngine();
  const {
    instances, settings, effectTriggers, sceneId, allCharacters, allEffects,
    activeBackgroundVideoUrl, connectedChannelList, selectedChannelIds,
    allDanceStyles, giftShowcase, rules, giftTiers
  } = engine;
  
  // Render Mode 2D / 3D
  const [renderMode, setRenderMode] = useState('2d');
  const [localAdminOpen, setLocalAdminOpen] = useState(false);
  const [linksModalOpen, setLinksModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const stageContainerRef = useRef(null);

  const isAdminOpen = typeof propAdminOpen === 'boolean' ? propAdminOpen : localAdminOpen;
  const handleCloseAdmin = () => {
    if (propCloseAdmin) propCloseAdmin();
    setLocalAdminOpen(false);
  };

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const overlayLinksList = [
    {
      id: 'dancefloor',
      title: '💃 Link Sàn Nhảy TikTok Tương Tác 2D & 3D (Khuyên dùng)',
      url: `${originUrl}/?overlay=dancefloor`,
      tag: 'BROWSER SOURCE CHO OBS / TIKTOK LIVE STUDIO',
      desc: 'Hiển thị sân khấu nhảy theo quà, comment, like realtime trong suốt không dính nút bấm.'
    },
    {
      id: 'cleanlive',
      title: '🌐 Link Sân Khấu Sạch Tổng Hợp (Clean Stage)',
      url: `${originUrl}/?overlay=live`,
      tag: 'CLEAN OUTPUT OVERLAY',
      desc: 'Màn hình Studio phát sóng chuẩn OBS Studio không viền giao diện.'
    },
    {
      id: 'gamebattle',
      title: '⚔️ Link Đấu Trường PK Quà Tặng Game Battle',
      url: `${originUrl}/?overlay=gamebattle`,
      tag: 'GAME BATTLE OVERLAY',
      desc: 'Đấu trường 2 phe tích điểm thi đấu so kè quà tặng TikTok.'
    },
    {
      id: 'bando',
      title: '🗺️ Link Bản Đồ Việt Nam Check-in Live',
      url: `${originUrl}/?overlay=bando`,
      tag: 'VIETNAM MAP LIVE',
      desc: 'Bản đồ tương tác check-in 63 tỉnh thành phố theo comment.'
    }
  ];

  const handleCopyLink = (id, url) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans select-none pb-6">
      
      {/* TOP CONTROL BAR */}
      <div className="glass-panel p-3 rounded-2xl border border-pink-500/30 flex flex-wrap items-center justify-between gap-3 bg-black/85 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLocalAdminOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-pink-900/40 border border-pink-400/50 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span>⚙️ CÀI ĐẶT & KẾT NỐI TIKTOK</span>
          </button>

          <button
            onClick={() => setRenderMode(m => m === '2d' ? '3d' : '2d')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-300 font-black text-xs border border-pink-500/30 flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all"
          >
            {renderMode === '2d' ? <Move3d className="w-4 h-4 text-purple-400" /> : <Box className="w-4 h-4 text-pink-400" />}
            <span>{renderMode === '2d' ? 'Chuyển sang 3D Stage' : 'Chuyển sang 2D Stage'}</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setLinksModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-purple-200 border border-purple-400/50 text-xs font-black flex items-center gap-1.5 cursor-pointer backdrop-blur-md transition-all shadow-glow-purple"
          >
            <Share2 className="w-4 h-4 text-purple-300" />
            <span>🔗 LINK OVERLAY OBS / TIKTOK</span>
          </button>

          <button
            onClick={() => setIsLive && setIsLive(!isLive)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
              isLive 
                ? 'bg-red-600 text-white shadow-glow-red animate-pulse' 
                : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isLive ? '🔴 ĐANG LIVE' : '⚪ PHÁT LIVE'}</span>
          </button>
        </div>
      </div>

      {/* STAGE CONTAINER WITH GUARANTEED RESPONSIVE HEIGHT */}
      <div className="w-full h-[75vh] min-h-[580px] max-h-[880px] relative rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
        <div
          ref={stageContainerRef}
          className={`relative ${settings.stageAspectRatio === '9:16' ? 'h-full aspect-[9/16] w-auto max-w-full' : 'w-full h-full'}`}
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

        {/* Real Camera / Custom Video PiP Overlay */}
        <DanceFloorVideoOverlay containerRef={stageContainerRef} />

        {/* Gift Showcase */}
        <DanceFloorGiftShowcase giftShowcase={giftShowcase} />
      </div>
    </div>

      {/* 👑 MODAL 1 ĐƯỜNG LINK DUY NHẤT TOÀN NĂNG CHO TIKTOK LIVE STUDIO & OBS STUDIO */}
      <UniversalMasterOverlayModal
        isOpen={linksModalOpen}
        onClose={() => setLinksModalOpen(false)}
      />

      {/* Render bảng Admin Modal khi được gọi */}
      <DanceFloorAdminModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        engine={engine}
        renderMode={renderMode}
        setRenderMode={setRenderMode}
        isLive={isLive}
        setIsLive={setIsLive}
      />
    </div>
  );
}
