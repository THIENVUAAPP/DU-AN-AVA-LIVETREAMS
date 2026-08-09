import React, { useState } from 'react';
import { Sparkles, Zap, BookOpen, MessageSquareText, TrendingUp, Users, Trophy, Volume2, VolumeX, Radio, MessagesSquare } from 'lucide-react';

import DanceFloorStage from './dancefloor/DanceFloorStage';
import DanceFloorRuleBuilder from './dancefloor/DanceFloorRuleBuilder';
import DanceFloorLibraryPanel from './dancefloor/DanceFloorLibraryPanel';
import DanceFloorTestPanel from './dancefloor/DanceFloorTestPanel';
import DanceFloorReactionFeed from './dancefloor/DanceFloorReactionFeed';
import DanceFloorAutoReplyPanel from './dancefloor/DanceFloorAutoReplyPanel';
import { useDanceFloorEngine } from '../hooks/useDanceFloorEngine';

const SECTIONS = [
  { id: 'stage', label: 'Sàn Diễn', icon: Sparkles },
  { id: 'rules', label: 'Luật Từ Khoá', icon: Zap },
  { id: 'autoreply', label: 'Trả Lời Tự Động', icon: MessagesSquare },
  { id: 'library', label: 'Thư Viện & Gift-Tier', icon: BookOpen },
];

// "Sàn Nhảy TikTok" — Realtime Comment-Driven Animation Engine.
// Pipeline: Ingestion (mô phỏng + cầu nối YouTube thật) → Gọi Tên/Rule Engine → Gift-Tier Resolver
// → State Manager (slot/priority queue) → Render Engine (DanceFloorStage). Logic điều phối nằm trong
// useDanceFloorEngine — file này chỉ lo hiển thị.
export default function DanceFloorStudio({ isLive, setIsLive }) {
  const [activeSection, setActiveSection] = useState('stage');
  const engine = useDanceFloorEngine();

  const {
    rules, setRules, giftTiers, setGiftTiers, settings, setSettings,
    autoReplyRules, setAutoReplyRules,
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter,
    allSounds, addCustomSound, setCustomBackgroundImage,
    instances, effectTriggers, sceneId, leaderboard, reactionFeed,
    connectedChannelList, selectedChannelIds, toggleChannel,
    ytBridge, handleYtConnect, handleYtDisconnect,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift, playSound, runAutoShuffle, toggleLibraryItem,
  } = engine;

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <DanceFloorStage
              instances={instances}
              maxSlots={settings.maxSlots}
              effectTriggers={effectTriggers}
              sceneId={sceneId}
              characters={allCharacters}
              customBackgroundImage={settings.customBackgroundImage}
              isConnected={isLive || connectedChannelList.length > 0}
              connectionLabel={
                isLive
                  ? `🔴 ĐANG LIVE TRÊN ${selectedChannelIds.length} KÊNH`
                  : connectedChannelList.length > 0
                  ? `${connectedChannelList.length} Kênh Sẵn Sàng`
                  : 'Chưa Kết Nối Kênh'
              }
            />

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

          <DanceFloorTestPanel
            connectedChannels={connectedChannelList}
            selectedChannelIds={selectedChannelIds}
            onToggleChannel={toggleChannel}
            isLive={isLive}
            onToggleLive={handleToggleLive}
            simulationEnabled={settings.simulationEnabled}
            onToggleSimulation={() => setSettings((s) => ({ ...s, simulationEnabled: !s.simulationEnabled }))}
            onManualTrigger={handleManualTrigger}
            onManualGift={handleManualGift}
            ytBridge={ytBridge}
            onYtConnect={handleYtConnect}
            onYtDisconnect={handleYtDisconnect}
            characters={allCharacters}
            voiceEnabled={settings.voiceEnabled}
            onToggleVoice={() => setSettings((s) => ({ ...s, voiceEnabled: !s.voiceEnabled }))}
            commentaryStyleId={settings.commentaryStyleId}
            onChangeCommentaryStyle={(id) => setSettings((s) => ({ ...s, commentaryStyleId: id }))}
            onRunAutoShuffle={runAutoShuffle}
            scheduleEnabled={settings.scheduleEnabled}
            scheduleStartHour={settings.scheduleStartHour}
            scheduleEndHour={settings.scheduleEndHour}
            onUpdateSchedule={(patch) => setSettings((s) => ({ ...s, ...patch }))}
          />
        </div>
      )}

      {activeSection === 'rules' && (
        <DanceFloorRuleBuilder rules={rules} setRules={setRules} characters={allCharacters} sounds={allSounds} onTestRule={(rule) => handleManualTrigger(rule.keyword)} />
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
          sounds={allSounds}
          onAddCustomSound={addCustomSound}
          giftTiers={giftTiers}
          setGiftTiers={setGiftTiers}
          onPreviewSound={playSound}
          disabledCharacterIds={settings.disabledCharacterIds}
          disabledDanceIds={settings.disabledDanceIds}
          disabledEffectIds={settings.disabledEffectIds}
          disabledSceneIds={settings.disabledSceneIds}
          onToggleLibraryItem={toggleLibraryItem}
          customBackgroundImage={settings.customBackgroundImage}
          onSetCustomBackgroundImage={setCustomBackgroundImage}
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
