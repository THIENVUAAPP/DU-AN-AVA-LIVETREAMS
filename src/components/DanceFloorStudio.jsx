import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, BookOpen, MessageSquareText, TrendingUp, Users, Trophy, Volume2, VolumeX, Radio, MessagesSquare, Layers, Move3d } from 'lucide-react';

import DanceFloorStage from './dancefloor/DanceFloorStage';
import Dance3DStage from './dancefloor/Dance3DStage';
import DanceFloorGiftPinPanel from './dancefloor/DanceFloorGiftPinPanel';
import DanceFloorVideoOverlay from './dancefloor/DanceFloorVideoOverlay';
import DanceFloorGiftShowcase from './dancefloor/DanceFloorGiftShowcase';
import DanceFloorRuleBuilder from './dancefloor/DanceFloorRuleBuilder';
import DanceFloorLibraryPanel from './dancefloor/DanceFloorLibraryPanel';
import DanceFloorChannelLivePanel from './dancefloor/DanceFloorChannelLivePanel';
import DanceFloorCallPanel from './dancefloor/DanceFloorCallPanel';
import DanceFloorQuickTestPanel from './dancefloor/DanceFloorQuickTestPanel';
import DanceFloorAutomationPanel from './dancefloor/DanceFloorAutomationPanel';
import DanceFloorReactionFeed from './dancefloor/DanceFloorReactionFeed';
import DanceFloorCommentFeed from './dancefloor/DanceFloorCommentFeed';
import DanceFloorManualComboPanel from './dancefloor/DanceFloorManualComboPanel';
import DanceFloorAutoReplyPanel from './dancefloor/DanceFloorAutoReplyPanel';
import DanceFloorAnimateDiffPanel from './dancefloor/DanceFloorAnimateDiffPanel';
import { useDanceFloorEngine } from '../hooks/useDanceFloorEngine';
import { STAGE_PRESETS_3D } from '../lib/dance3d/stagePresets3D';
import { platformFromChannelId } from '../lib/danceFloorEngine';

const SECTIONS = [
  { id: 'stage', label: 'Sàn Diễn', icon: Sparkles },
  { id: 'rules', label: 'Luật Từ Khoá', icon: Zap },
  { id: 'autoreply', label: 'Trả Lời Tự Động', icon: MessagesSquare },
  { id: 'library', label: 'Thư Viện & Gift-Tier', icon: BookOpen },
];

// "Sàn Nhảy TikTok" — Realtime Comment-Driven Animation Engine.
// Bố cục tab Sàn Diễn: khung canvas nằm GIỮA làm trọng tâm; chức năng hay dùng (kênh+phát live, gọi
// tên, test 1-chạm) nằm 2 BÊN; chức năng ít dùng hơn (tự động hoá, YouTube bridge) nằm PHÍA DƯỚI.
// Logic điều phối nằm trong useDanceFloorEngine — file này chỉ lo hiển thị.
export default function DanceFloorStudio({ isLive, setIsLive }) {
  const [activeSection, setActiveSection] = useState('stage');
  const [renderMode, setRenderMode] = useState('2d'); // '2d' | '3d'
  const [stagePresetId, setStagePresetId] = useState(STAGE_PRESETS_3D[0].id);
  const stageContainerRef = useRef(null);
  const engine = useDanceFloorEngine();

  const {
    rules, setRules, giftTiers, setGiftTiers, settings, setSettings,
    autoReplyRules, setAutoReplyRules,
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    enabledNormalCharacters, enabledVipCharacters,
    allEffects, customEffects, addCustomEffect, deleteCustomEffect,
    allSounds, addCustomSound, deleteCustomSound, setCustomBackgroundImage,
    allDanceStyles, customDanceStyles, addCustomDanceStyle, deleteCustomDanceStyle,
    backgroundVideos, addBackgroundVideo, deleteBackgroundVideo, activeBackgroundVideoId, setActiveBackgroundVideoId,
    instances, effectTriggers, sceneId, leaderboard, reactionFeed, commentFeed, giftShowcase,
    connectedChannelList, selectedChannelIds, toggleChannel,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift, handleManualCombo, handleManualHighlight,
    playSound, runAutoShuffle, toggleLibraryItem, suggestDance, musicPlaylist,
  } = engine;

  const activeBackgroundVideoUrl = backgroundVideos.find((v) => v.id === activeBackgroundVideoId)?.url || null;

  // Tự đổi định kỳ theo phút — kết hợp AUTO 1-CHẠM (nhân vật/nhạc/điệu nhảy/hiệu ứng) với đổi luôn
  // Video Nền Vũ Trường + Sàn 3D ngẫu nhiên (nếu có nhiều lựa chọn), chạy liên tục đến khi tắt.
  useEffect(() => {
    if (!settings.autoShuffleIntervalEnabled) return undefined;
    const ms = Math.max(1, settings.autoShuffleIntervalMinutes) * 60000;
    const interval = setInterval(() => {
      runAutoShuffle();
      if (STAGE_PRESETS_3D.length > 1) {
        setStagePresetId(STAGE_PRESETS_3D[Math.floor(Math.random() * STAGE_PRESETS_3D.length)].id);
      }
      if (backgroundVideos.length > 1) {
        setActiveBackgroundVideoId(backgroundVideos[Math.floor(Math.random() * backgroundVideos.length)].id);
      }
    }, ms);
    return () => clearInterval(interval);
  }, [settings.autoShuffleIntervalEnabled, settings.autoShuffleIntervalMinutes, runAutoShuffle, backgroundVideos, setActiveBackgroundVideoId]);

  // Phát Live Đa Kênh — dùng đúng các kênh TikTok/YouTube/Facebook đã kết nối sẵn từ Restream Đa Nền
  // Tảng (streamKey/token đã lưu), không yêu cầu đăng nhập lại. Dùng chung state isLive toàn cục để
  // đồng bộ với badge "PHÁT LIVE" trên Header và các module khác.
  const handleToggleLive = () => {
    if (!isLive && selectedChannelIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 kênh đã kết nối (TikTok/YouTube/Facebook...) trước khi phát live!');
      return;
    }
    setIsLive(!isLive);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#181020] via-[#0A0A0A] to-[#121218]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shadow-glow-red">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black mb-1.5 border border-purple-500/30">
              <Radio className="w-3 h-3" /> {isLive ? 'ĐANG ĐỒNG BỘ LIVE' : 'CHẾ ĐỘ CHUẨN BỊ / TEST'}
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">Sàn Nhảy TikTok</h2>
            <p className="text-xs text-gray-400">Bình luận, gọi tên & quà tặng realtime tự động sinh nhân vật nhảy múa + phản hồi vui nhộn</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <StatPill icon={MessageSquareText} label="Comment/phút" value={commentsPerMin} color="text-blue-400" />
          <StatPill icon={TrendingUp} label="Trigger/phút" value={triggersPerMin} color="text-emerald-400" />
          <StatPill icon={Users} label="Trên Sàn" value={`${instances.length}/${settings.maxSlots}`} color="text-purple-400" />
          <button
            onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isActive ? 'bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" /> {s.label}
            </button>
          );
        })}
      </div>

      {activeSection === 'stage' && (
        <div className="space-y-5">
          {/* Hàng chính: canvas sàn diễn rộng, cột phải gom Gọi Tên + Test Nhanh */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="lg:col-span-3 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    onClick={() => setRenderMode('2d')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 ${renderMode === '2d' ? 'bg-[#EF4444] text-white' : 'text-gray-400'}`}
                  >
                    <Layers className="w-3 h-3" /> Sàn 2D
                  </button>
                  <button
                    onClick={() => setRenderMode('3d')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer flex items-center gap-1 ${renderMode === '3d' ? 'bg-[#8B5CF6] text-white' : 'text-gray-400'}`}
                  >
                    <Move3d className="w-3 h-3" /> Sàn 3D
                  </button>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  {[{ id: 'small', label: 'Nhỏ' }, { id: 'medium', label: 'Vừa' }, { id: 'large', label: 'To' }].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSettings((prev) => ({ ...prev, characterSizeScale: s.id }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                        settings.characterSizeScale === s.id ? 'bg-cyan-500 text-white' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  {[{ id: '16:9', label: '16:9 Ngang' }, { id: '9:16', label: '9:16 Dọc' }].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSettings((prev) => ({ ...prev, stageAspectRatio: r.id }))}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer ${
                        settings.stageAspectRatio === r.id ? 'bg-amber-500 text-black' : 'text-gray-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                ref={stageContainerRef}
                className={`relative mx-auto ${settings.stageAspectRatio === '9:16' ? 'max-w-md' : 'w-full'}`}
                style={{ aspectRatio: settings.stageAspectRatio === '9:16' ? '9 / 16' : '16 / 9' }}
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
                    stagePresetId={stagePresetId}
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
                <DanceFloorGiftPinPanel rules={rules} giftTiers={giftTiers} characters={allCharacters} />
                <DanceFloorVideoOverlay containerRef={stageContainerRef} />
                <DanceFloorGiftShowcase giftShowcase={giftShowcase} />
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <DanceFloorCallPanel
                normalCharacters={enabledNormalCharacters}
                vipCharacters={enabledVipCharacters}
                onManualTrigger={handleManualTrigger}
                onManualHighlight={handleManualHighlight}
              />
              <DanceFloorQuickTestPanel onManualTrigger={handleManualTrigger} onManualGift={handleManualGift} />
            </div>
          </div>

          {/* Bình luận trực tiếp — siêu vui, hiển thị mọi comment thô đổ về, không chỉ comment trúng luật */}
          <DanceFloorCommentFeed feed={commentFeed} activePlatforms={[...new Set(selectedChannelIds.map(platformFromChannelId))]} />

          {/* Hàng dưới: ít dùng hơn — bảng xếp hạng, nhật ký phản hồi, tự động hoá, tổ hợp thủ công */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/10">
                <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Bảng Xếp Hạng Người Tặng Quà (Phiên Hiện Tại)
                </h4>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-gray-500">Chưa có dữ liệu quà tặng trong phiên này.</p>
                ) : (
                  <div className="space-y-1.5">
                    {leaderboard.map((l, idx) => (
                      <div key={l.userId} className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5">
                        <span className="text-xs font-bold text-white">
                          {idx === 0 ? '👑' : `#${idx + 1}`} {l.username}
                        </span>
                        <span className="text-xs font-black text-amber-400">{l.points.toLocaleString('vi-VN')} điểm</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <DanceFloorReactionFeed feed={reactionFeed} />
            </div>

            <DanceFloorAnimateDiffPanel 
              onApplyAiEffect={(config) => {
                // Future integration to pass AI effect configurations to the canvas renderer
                console.log('Applied AI Effect:', config);
              }} 
            />

            <DanceFloorAutomationPanel
              simulationEnabled={settings.simulationEnabled}
              onToggleSimulation={() => setSettings((s) => ({ ...s, simulationEnabled: !s.simulationEnabled }))}
              voiceEnabled={settings.voiceEnabled}
              onToggleVoice={() => setSettings((s) => ({ ...s, voiceEnabled: !s.voiceEnabled }))}
              commentaryStyleId={settings.commentaryStyleId}
              onChangeCommentaryStyle={(id) => setSettings((s) => ({ ...s, commentaryStyleId: id }))}
              onRunAutoShuffle={runAutoShuffle}
              musicPlaylist={musicPlaylist}
              musicLoopMode={settings.musicLoopMode}
              onUpdateMusicLoopMode={(mode) => setSettings((s) => ({ ...s, musicLoopMode: mode }))}
              keepCharactersPermanently={settings.keepCharactersPermanently}
              onToggleKeepCharacters={() => setSettings((s) => ({ ...s, keepCharactersPermanently: !s.keepCharactersPermanently }))}
              autoCameraEnabled={settings.autoCameraEnabled}
              onToggleAutoCamera={() => setSettings((s) => ({ ...s, autoCameraEnabled: !s.autoCameraEnabled }))}
              autoShuffleIntervalEnabled={settings.autoShuffleIntervalEnabled}
              autoShuffleIntervalMinutes={settings.autoShuffleIntervalMinutes}
              onUpdateAutoShuffleInterval={(patch) => setSettings((s) => ({ ...s, ...patch }))}
              scheduleEnabled={settings.scheduleEnabled}
              scheduleStartHour={settings.scheduleStartHour}
              scheduleEndHour={settings.scheduleEndHour}
              onUpdateSchedule={(patch) => setSettings((s) => ({ ...s, ...patch }))}
            />

            <DanceFloorManualComboPanel
              characters={allCharacters}
              danceStyles={allDanceStyles}
              sounds={allSounds}
              onApplyCombo={handleManualCombo}
            />
          </div>

          {/* Xuống dưới cùng: Nguồn Kênh Live + Phát Live Đa Kênh — ít thao tác nhất trong phiên live */}
          <div className="max-w-3xl mx-auto w-full">
            <DanceFloorChannelLivePanel
              connectedChannels={connectedChannelList}
              selectedChannelIds={selectedChannelIds}
              onToggleChannel={toggleChannel}
              isLive={isLive}
              onToggleLive={handleToggleLive}
            />
          </div>
        </div>
      )}

      {activeSection === 'rules' && (
        <DanceFloorRuleBuilder rules={rules} setRules={setRules} characters={allCharacters} sounds={allSounds} onTestRule={(rule) => handleManualTrigger(rule.keyword)} onSuggestDance={suggestDance} />
      )}

      {activeSection === 'autoreply' && (
        <DanceFloorAutoReplyPanel autoReplyRules={autoReplyRules} setAutoReplyRules={setAutoReplyRules} />
      )}

      {activeSection === 'library' && (
        <DanceFloorLibraryPanel
          characters={allCharacters}
          customCharacters={customCharacters}
          onAddCustomCharacter={addCustomCharacter}
          onDeleteCustomCharacter={deleteCustomCharacter}
          onEditCustomCharacter={editCustomCharacter}
          danceStyles={allDanceStyles}
          customDanceStyles={customDanceStyles}
          onAddCustomDanceStyle={addCustomDanceStyle}
          onPreviewDance={(danceId) => allCharacters.length > 0 && handleManualCombo({ characterId: allCharacters[Math.floor(Math.random() * allCharacters.length)].id, danceId })}
          onDeleteCustomDanceStyle={deleteCustomDanceStyle}
          effects={allEffects}
          customEffects={customEffects}
          onAddCustomEffect={addCustomEffect}
          onDeleteCustomEffect={deleteCustomEffect}
          sounds={allSounds}
          onAddCustomSound={addCustomSound}
          onDeleteCustomSound={deleteCustomSound}
          giftTiers={giftTiers}
          setGiftTiers={setGiftTiers}
          onPreviewSound={playSound}
          disabledCharacterIds={settings.disabledCharacterIds}
          disabledDanceIds={settings.disabledDanceIds}
          disabledEffectIds={settings.disabledEffectIds}
          disabledSceneIds={settings.disabledSceneIds}
          disabledSoundIds={settings.disabledSoundIds}
          onToggleLibraryItem={toggleLibraryItem}
          customBackgroundImage={settings.customBackgroundImage}
          onSetCustomBackgroundImage={setCustomBackgroundImage}
          backgroundVideos={backgroundVideos}
          activeBackgroundVideoId={activeBackgroundVideoId}
          onAddBackgroundVideo={addBackgroundVideo}
          onDeleteBackgroundVideo={deleteBackgroundVideo}
          onSetActiveBackgroundVideoId={setActiveBackgroundVideoId}
        />
      )}
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
      <Icon className={`w-4 h-4 ${color}`} />
      <div className="leading-tight">
        <p className="text-sm font-black text-white">{value}</p>
        <p className="text-[9px] text-gray-500 uppercase font-bold">{label}</p>
      </div>
    </div>
  );
}
