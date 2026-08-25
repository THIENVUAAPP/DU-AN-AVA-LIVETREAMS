import React, { useRef, useState } from 'react';
import DanceFloorStage from './dancefloor/DanceFloorStage';
import Dance3DStage from './dancefloor/Dance3DStage';
import DanceFloorGiftShowcase from './dancefloor/DanceFloorGiftShowcase';
import DanceFloorVideoOverlay from './dancefloor/DanceFloorVideoOverlay';
import { useDanceFloorEngine } from '../hooks/useDanceFloorEngine';
import { STAGE_PRESETS_3D } from '../lib/dance3d/stagePresets3D';
import DanceFloorAdminModal from './DanceFloorAdminModal';
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

      {/* MODAL LINK OVERLAY CHO OBS & TIKTOK LIVE STUDIO */}
      {linksModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-pink-500/40 max-w-2xl w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/98 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-glow-purple">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">🔗 DANH SÁCH LINK OVERLAY DÁN VÀO STUDIO & OBS</h3>
                  <p className="text-xs text-gray-400">Dán vào TikTok Live Studio, OBS Studio, vMix làm Browser Source</p>
                </div>
              </div>
              <button 
                onClick={() => setLinksModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {overlayLinksList.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-pink-500/40 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      {item.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/10 text-pink-300 border border-pink-500/30">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{item.desc}</p>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      type="text" 
                      readOnly 
                      value={item.url}
                      className="flex-1 px-3 py-2 rounded-xl bg-black/80 border border-white/15 text-xs text-pink-200 font-mono focus:outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopyLink(item.id, item.url)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-glow-pink"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>ĐÃ COPY!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-white" />
                          <span>COPY LINK</span>
                        </>
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
                      title="Mở tab mới xem thử"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-[11px] text-pink-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-pink-400" />
              <span>Cách dùng: Mở TikTok Live Studio hoặc OBS Studio → Thêm Nguồn (Source) → <strong>Trình duyệt (Browser Source)</strong> → Dán đường link trên vào (Kích thước khuyên dùng: 1080x1920 hoặc 1920x1080).</span>
            </div>
          </div>
        </div>
      )}

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
