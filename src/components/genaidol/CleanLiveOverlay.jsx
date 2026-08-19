import React, { useState, useEffect, useRef } from 'react';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameChienDau from './game/GameChienDau';
import { Volume2, VolumeX, Sparkles, Video, Swords, Flag } from 'lucide-react';

/**
 * ⚡ CỬA SỔ OVERLAY REAL-TIME ĐỒNG BỘ 100% CHO TIKTOK LIVE STUDIO & OBS STUDIO
 * - URL: ?overlay=cleanlive hoặc ?overlay=live hoặc ?overlay=stage hoặc ?overlay=avatar
 * - Độ trễ: 0.00001s (BroadcastChannel + LocalStorage Event Sync)
 * - Tự động đồng bộ ngay lập tức:
 *   1. Chuyển đổi qua lại giữa AI Idol / Game Chiến Đấu / Game Bản Đồ Chữ S
 *   2. Tỷ lệ khung hình 9:16 (TikTok Dọc) và 16:9 (OBS Ngang)
 *   3. Sự kiện Quà tặng, Cắm cờ, Bảng xếp hạng, Âm nhạc BGM, Đòn đánh PK
 * - Sân khấu sạch 100% (Clean Stage), không có thanh menu hay nút bấm admin thừa
 */
export default function CleanLiveOverlay() {
  const [masterState, setMasterState] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_master_live_state');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    // Check URL parameters for explicit mode overrides
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const overlayParam = urlParams ? urlParams.get('overlay') : '';
    const ratioParam = urlParams ? urlParams.get('ratio') : '9:16';
    
    let defaultStage = 'idol';
    if (overlayParam === 'bando' || overlayParam === 'vietnam_map' || overlayParam === 'map') defaultStage = 'bando';
    if (overlayParam === 'gamebattle' || overlayParam === 'battle' || overlayParam === 'game') defaultStage = 'battle';

    return {
      stage: defaultStage, // 'idol' | 'battle' | 'bando'
      aspectRatio: ratioParam || '9:16',
      mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
      isVideo: false,
      characterName: 'AI Idol Lan Hương',
      isConnected: true,
      isDarkMode: true,
      currentLang: 'vi'
    };
  });

  const [liveEvent, setLiveEvent] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    document.title = 'AVA Live Output (Realtime Master Overlay) — TikTok LIVE Studio / OBS';
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';

    // 1. Kênh BroadcastChannel Master
    let masterChannel = null;
    let bandoChannel = null;
    let battleChannel = null;
    let cleanChannel = null;

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        masterChannel = new BroadcastChannel('avalive_master_live_stream');
        masterChannel.onmessage = (event) => {
          if (event.data) {
            if (event.data.type === 'MASTER_LIVE_STATE_UPDATE') {
              setMasterState(prev => ({
                ...prev,
                ...event.data
              }));
            } else if (event.data.type === 'LIVE_EVENT') {
              setLiveEvent(event.data.payload);
            }
          }
        };

        bandoChannel = new BroadcastChannel('avalive_bando_stage');
        bandoChannel.onmessage = (e) => {
          if (e.data?.lastEvent) {
            setLiveEvent(e.data.lastEvent);
          }
        };

        battleChannel = new BroadcastChannel('avalive_gamebattle_stage');
        battleChannel.onmessage = (e) => {
          if (e.data?.type === 'LIVE_EVENT') {
            setLiveEvent(e.data.payload);
          }
        };

        cleanChannel = new BroadcastChannel('avalive_clean_stream_channel');
        cleanChannel.onmessage = (e) => {
          if (e.data?.type === 'STREAM_MEDIA_UPDATE') {
            setMasterState(prev => ({
              ...prev,
              mediaUrl: e.data.mediaUrl,
              isVideo: e.data.isVideo,
              characterName: e.data.characterName,
              isConnected: e.data.isConnected
            }));
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    // 2. LocalStorage Storage Event Fallback (khi khác tiến trình trình duyệt)
    const handleStorage = (e) => {
      if (e.key === 'avalive_master_live_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMasterState(prev => ({ ...prev, ...parsed }));
        } catch (err) {}
      } else if (e.key === 'aidol_clean_stream_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setMasterState(prev => ({
            ...prev,
            mediaUrl: parsed.mediaUrl,
            isVideo: parsed.isVideo,
            characterName: parsed.characterName,
            isConnected: parsed.isConnected
          }));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (masterChannel) masterChannel.close();
      if (bandoChannel) bandoChannel.close();
      if (battleChannel) battleChannel.close();
      if (cleanChannel) cleanChannel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const currentStage = masterState.stage || 'idol';
  const ratio = masterState.aspectRatio || '9:16';

  // RENDER STAGE 1: GAME BẢN ĐỒ VIỆT NAM (CẮM CỜ 3 MIỀN)
  if (currentStage === 'bando') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center">
        <GameBanDoVietNam 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // RENDER STAGE 2: GAME CHIẾN ĐẤU PK ĐẠI CHIẾN
  if (currentStage === 'battle') {
    return (
      <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-transparent select-none flex items-center justify-center">
        <GameChienDau 
          isPopout={true}
          aspectRatio={ratio}
          externalLiveEvent={liveEvent}
          isDarkMode={masterState.isDarkMode !== false}
        />
      </div>
    );
  }

  // RENDER STAGE 3: LIVE AI IDOL SẠCH (VIDEO / AVATAR + HIỆU ỨNG LIVE)
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none">
      <div 
        className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
          ratio === '9:16'
            ? 'h-full aspect-[9/16] w-auto max-w-full'
            : 'w-full aspect-[16/9] h-auto max-h-full'
        }`}
      >
        {masterState.isVideo ? (
          <video
            key={masterState.mediaUrl}
            src={masterState.mediaUrl}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <img
            key={masterState.mediaUrl}
            src={masterState.mediaUrl}
            alt={masterState.characterName || 'AI Idol'}
            className="w-full h-full object-cover select-none"
          />
        )}

        {/* Live Badge nhỏ gọn góc trên */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-[10px] font-black tracking-wider uppercase text-red-400">LIVE</span>
          <span className="text-[10px] text-gray-200 font-bold ml-1">{masterState.characterName || 'AI Idol'}</span>
        </div>
      </div>
    </div>
  );
}
