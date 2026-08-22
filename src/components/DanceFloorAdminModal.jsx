import React, { useState } from 'react';
import { 
  X, Shield, Play, Pause, Square, RotateCcw, Repeat, Award, Globe, Music, Music2, Volume2, 
  Sparkles, Gift, MapPin, Flag, CheckCircle, Copy, AlertTriangle, 
  Settings, RefreshCw, Zap, Sliders, ExternalLink, Trophy, Type,
  Compass, Sun, Eye, Trash2, Plus, PlusCircle, VolumeX, Save, Check, Grid,
  Upload, UploadCloud, Image, Search, Mic, Radio, Volume1, FileAudio, ZoomIn, ZoomOut, Move, Camera, BookmarkPlus, Layers,
  Palette, Minimize2, Maximize2, Columns, Edit2, MessageSquare, Bot, Key, Move3d, MessageSquareText, TrendingUp, Users, MessagesSquare, BookOpen
} from 'lucide-react';

import DanceFloorTikTokConnection from './dancefloor/DanceFloorTikTokConnection';
import DanceFloorCallPanel from './dancefloor/DanceFloorCallPanel';
import DanceFloorQuickTestPanel from './dancefloor/DanceFloorQuickTestPanel';
import DanceFloorRuleBuilder from './dancefloor/DanceFloorRuleBuilder';
import DanceFloorAutoReplyPanel from './dancefloor/DanceFloorAutoReplyPanel';
import DanceFloorLibraryPanel from './dancefloor/DanceFloorLibraryPanel';
import DanceFloorReactionFeed from './dancefloor/DanceFloorReactionFeed';
import DanceFloorCommentFeed from './dancefloor/DanceFloorCommentFeed';
import DanceFloorAnimateDiffPanel from './dancefloor/DanceFloorAnimateDiffPanel';
import DanceFloorAutomationPanel from './dancefloor/DanceFloorAutomationPanel';
import DanceFloorManualComboPanel from './dancefloor/DanceFloorManualComboPanel';
import { platformFromChannelId } from '../lib/danceFloorEngine';
import DanceFloorChannelLivePanel from './dancefloor/DanceFloorChannelLivePanel';

export default function DanceFloorAdminModal({ isOpen, onClose, engine, renderMode, setRenderMode, isLive, setIsLive }) {
  const [activeTab, setActiveTab] = useState('operations');
  const [modalWidthMode, setModalWidthMode] = useState('medium'); // 'compact' | 'medium' | 'wide'
  const [isMinimized, setIsMinimized] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveAll = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const {
    rules, setRules, giftTiers, setGiftTiers, settings, setSettings,
    autoReplyRules, setAutoReplyRules,
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    enabledNormalCharacters, enabledVipCharacters,
    allEffects, customEffects, addCustomEffect, deleteCustomEffect,
    allSounds, addCustomSound, deleteCustomSound, setCustomBackgroundImage,
    allDanceStyles, customDanceStyles, addCustomDanceStyle, deleteCustomDanceStyle,
    backgroundVideos, addBackgroundVideo, deleteBackgroundVideo, activeBackgroundVideoId, setActiveBackgroundVideoId,
    instances, setInstances, effectTriggers, sceneId, leaderboard, reactionFeed, commentFeed, giftShowcase,
    connectedChannelList, selectedChannelIds, toggleChannel,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift, handleManualCombo, handleManualHighlight, handleManualCrowdTest,
    playSound, runAutoShuffle, toggleLibraryItem, suggestDance, musicPlaylist,
  } = engine;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl shadow-2xl shadow-pink-900/50 border border-pink-400/50 font-black text-xs transition-all hover:scale-105"
        >
          <Music size={16} className="animate-pulse" />
          <span>Mở Lại Admin Sàn Nhảy</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-start justify-end p-2 sm:p-3 animate-in fade-in duration-200">
      <div 
        style={{
          width: modalWidthMode === 'compact' ? '400px' : modalWidthMode === 'medium' ? '560px' : '820px',
          maxWidth: 'calc(100vw - 16px)'
        }}
        className="pointer-events-auto h-[95vh] bg-[#0f1118]/98 backdrop-blur-2xl border border-pink-500/40 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden text-gray-100 font-sans transition-all duration-200 ml-auto"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 flex items-center justify-center shadow-md shadow-pink-500/20 shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-black text-white tracking-wide truncate">
                  ADMIN SÀN NHẢY TIKTOK
                </h2>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-pink-600 text-white shadow-sm shrink-0 flex items-center gap-1">
                  <Radio size={10} /> {isLive ? 'ĐANG LIVE' : 'PREVIEW'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 truncate">
                Realtime Comment-Driven Animation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Width Size Switcher */}
            <div className="hidden sm:flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[10px]">
              <button
                onClick={() => setModalWidthMode('compact')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'compact' ? 'bg-pink-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Gọn (400px)"
              >
                Gọn
              </button>
              <button
                onClick={() => setModalWidthMode('medium')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'medium' ? 'bg-pink-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Vừa (560px)"
              >
                Vừa
              </button>
              <button
                onClick={() => setModalWidthMode('wide')}
                className={`px-1.5 py-0.5 rounded transition-colors ${modalWidthMode === 'wide' ? 'bg-pink-500 text-white font-black' : 'text-gray-400 hover:text-white'}`}
                title="Khung Rộng (820px)"
              >
                Rộng
              </button>
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Thu nhỏ cửa sổ góc phải"
            >
              <Minimize2 size={14} />
            </button>

            <button
              onClick={handleSaveAll}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-md ${
                saveSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black'
              }`}
            >
              {saveSuccess ? <Check size={13} /> : <Save size={13} />}
              <span className="hidden sm:inline">{saveSuccess ? 'Đã Lưu!' : 'Lưu'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Đóng bảng Admin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#141722] border-b border-white/10 overflow-x-auto shrink-0 custom-scrollbar">
          {[
            { id: 'operations', label: '🎮 Vận Hành & TikTok' },
            { id: 'stage', label: '🎥 Sàn Diễn & Camera' },
            { id: 'rules', label: '⚡ Luật Từ Khóa' },
            { id: 'autoreply', label: '💬 Trả Lời Tự Động' },
            { id: 'library', label: '📚 Thư Viện & Gift-Tier' },
            { id: 'logs', label: '📜 Log & Thống Kê' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-white/10 text-pink-400 shadow-sm' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cột chính (Nội dung) */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/30">
          <div className="max-w-4xl mx-auto space-y-6">

            {activeTab === 'operations' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4">
                  <DanceFloorTikTokConnection 
                    onEvent={(type, data) => {
                      if (type === 'chat') {
                        handleManualTrigger('__generic__', 1, data.nickname, data.comment);
                      } else if (type === 'gift') {
                        handleManualGift(data.giftId || 'gift_rose', data.repeatCount || 1, data.nickname);
                      } else if (type === 'like') {
                        handleManualTrigger('__generic__', 1, data.nickname, 'Đã thả tim');
                      } else if (type === 'member') {
                        handleManualTrigger('__generic__', 1, data.nickname, 'Vừa tham gia phòng');
                      }
                    }} 
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                    <DanceFloorCallPanel
                      normalCharacters={enabledNormalCharacters}
                      vipCharacters={enabledVipCharacters}
                      onManualTrigger={handleManualTrigger}
                      onManualHighlight={handleManualHighlight}
                    />
                  </div>
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                    <DanceFloorQuickTestPanel onManualTrigger={handleManualTrigger} onManualGift={handleManualGift} onManualCrowdTest={handleManualCrowdTest} />
                  </div>
                </div>

                <DanceFloorChannelLivePanel
                  isLive={isLive}
                  setIsLive={setIsLive}
                  selectedChannelIds={selectedChannelIds}
                  toggleChannel={toggleChannel}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <DanceFloorAutomationPanel
                    settings={settings}
                    setSettings={setSettings}
                    runAutoShuffle={runAutoShuffle}
                  />
                  <DanceFloorManualComboPanel 
                    characters={allCharacters} 
                    danceStyles={allDanceStyles} 
                    sounds={allSounds} 
                    onApplyCombo={handleManualCombo} 
                  />
                </div>
              </div>
            )}

            {activeTab === 'stage' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Move3d className="w-4 h-4 text-pink-400" /> Thiết Lập Sàn Diễn
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">Chế Độ Render</label>
                      <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => setRenderMode('2d')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${renderMode === '2d' ? 'bg-pink-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          Sàn 2D
                        </button>
                        <button
                          onClick={() => setRenderMode('3d')}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${renderMode === '3d' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          Sàn 3D
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">Tỷ Lệ Khung Hình</label>
                      <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                        <button
                          onClick={() => setSettings((prev) => ({ ...prev, stageAspectRatio: '16:9' }))}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.stageAspectRatio === '16:9' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          16:9 Ngang
                        </button>
                        <button
                          onClick={() => setSettings((prev) => ({ ...prev, stageAspectRatio: '9:16' }))}
                          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settings.stageAspectRatio === '9:16' ? 'bg-amber-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                          9:16 Dọc
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">Kích Thước Nhân Vật</label>
                      <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                        {[{ id: 'small', label: 'Nhỏ' }, { id: 'medium', label: 'Vừa' }, { id: 'large', label: 'To' }].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSettings((prev) => ({ ...prev, characterSizeScale: s.id }))}
                            className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
                              settings.characterSizeScale === s.id ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300 block">Âm Thanh BGM / SFX</label>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          settings.soundEnabled ? 'bg-emerald-600 text-white' : 'bg-red-900/50 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        {settings.soundEnabled ? 'Đang Bật Âm Thanh' : 'Đã Tắt Âm Thanh'}
                      </button>
                    </div>
                  </div>
                </div>

                <DanceFloorAnimateDiffPanel 
                  onApplyAiEffect={(config) => {
                    if (config.type === 'animatediff' && config.imageUrl) {
                      const now = Date.now();
                      setCustomBackgroundImage(config.imageUrl);
                      setSettings(s => ({ ...s, autoShuffleIntervalEnabled: false }));
                    }
                  }} 
                />
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DanceFloorRuleBuilder rules={rules} setRules={setRules} />
              </div>
            )}

            {activeTab === 'autoreply' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DanceFloorAutoReplyPanel autoReplyRules={autoReplyRules} setAutoReplyRules={setAutoReplyRules} />
              </div>
            )}

            {activeTab === 'library' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <DanceFloorLibraryPanel
                  allCharacters={allCharacters} customCharacters={customCharacters} addCustomCharacter={addCustomCharacter} deleteCustomCharacter={deleteCustomCharacter} editCustomCharacter={editCustomCharacter}
                  allEffects={allEffects} customEffects={customEffects} addCustomEffect={addCustomEffect} deleteCustomEffect={deleteCustomEffect}
                  allSounds={allSounds} addCustomSound={addCustomSound} deleteCustomSound={deleteCustomSound}
                  backgroundVideos={backgroundVideos} addBackgroundVideo={addBackgroundVideo} deleteBackgroundVideo={deleteBackgroundVideo} activeBackgroundVideoId={activeBackgroundVideoId} setActiveBackgroundVideoId={setActiveBackgroundVideoId}
                  settings={settings} setSettings={setSettings}
                  giftTiers={giftTiers} setGiftTiers={setGiftTiers}
                  toggleLibraryItem={toggleLibraryItem}
                  allDanceStyles={allDanceStyles} customDanceStyles={customDanceStyles} addCustomDanceStyle={addCustomDanceStyle} deleteCustomDanceStyle={deleteCustomDanceStyle}
                  runAutoShuffle={runAutoShuffle}
                />
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Comment / Phút</p>
                      <p className="text-2xl font-black text-blue-400">{commentsPerMin}</p>
                    </div>
                    <MessageSquareText size={24} className="text-blue-500/50" />
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tương tác / Phút</p>
                      <p className="text-2xl font-black text-emerald-400">{triggersPerMin}</p>
                    </div>
                    <TrendingUp size={24} className="text-emerald-500/50" />
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Người trên sàn</p>
                      <p className="text-2xl font-black text-purple-400">{instances.length} / {settings.maxSlots}</p>
                    </div>
                    <Users size={24} className="text-purple-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-4 rounded-2xl border border-white/10">
                    <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Bảng Xếp Hạng Người Tặng Quà
                    </h4>
                    {leaderboard.length === 0 ? (
                      <p className="text-xs text-gray-500">Chưa có dữ liệu quà tặng trong phiên này.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
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

                  <div className="h-[300px] rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                    <DanceFloorReactionFeed feed={reactionFeed} />
                  </div>
                </div>

                <div className="h-[300px] rounded-2xl overflow-hidden border border-white/10">
                  <DanceFloorCommentFeed feed={commentFeed} activePlatforms={[...new Set(selectedChannelIds.map(platformFromChannelId))]} />
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
