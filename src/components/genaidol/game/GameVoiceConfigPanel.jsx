import React, { useState, useEffect } from 'react';
import { 
  Mic, Volume2, Sparkles, Play, Square, Plus, Trash2, Edit3, Check, 
  Clock, MessageSquare, Zap, Radio, Shuffle, ListOrdered, Bot, RefreshCw,
  Send, HelpCircle, ShieldCheck, UserCheck, Flame
} from 'lucide-react';
import { 
  ELEVENLABS_VOICES, previewVoiceAudio, stopVoiceAudio 
} from '../../../utils/voiceSyncService';

export default function GameVoiceConfigPanel({ 
  engine, 
  gameType = 'map', // 'map' | 'battle'
  onClose = null 
}) {
  // Local reactive states
  const [activeSubTab, setActiveSubTab] = useState('roles'); // 'roles' | 'timers' | 'prompts' | 'keywords'
  const [gameVoice, setGameVoice] = useState(engine.gameVoice);
  const [assistantVoice, setAssistantVoice] = useState(engine.assistantVoice);
  const [isAutoEnabled, setIsAutoEnabled] = useState(engine.isAutoEnabled);
  const [intervalSeconds, setIntervalSeconds] = useState(engine.intervalSeconds);
  const [playbackOrder, setPlaybackOrder] = useState(engine.playbackOrder || 'random');
  const [volume, setVolume] = useState(engine.volume || 0.9);
  const [responseDelaySec, setResponseDelaySec] = useState(engine.responseDelaySec || 1.0);
  const [prompts, setPrompts] = useState([...engine.prompts]);
  const [isKeywordAutoReplyEnabled, setIsKeywordAutoReplyEnabled] = useState(engine.isKeywordAutoReplyEnabled);
  const [useGeminiAI, setUseGeminiAI] = useState(engine.useGeminiAI !== false);
  const [keywordRules, setKeywordRules] = useState([...engine.keywordRules]);
  
  // Voice filters & preview state
  const [voiceFilter, setVoiceFilter] = useState('all'); // 'all' | 'pro' | 'free' | 'female' | 'male'
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  
  // Form states
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptRole, setNewPromptRole] = useState('game');
  
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');
  const [newRuleRole, setNewRuleRole] = useState('assistant');
  const [newRuleCooldown, setNewRuleCooldown] = useState(4);

  // Test Simulator state
  const [testComment, setTestComment] = useState('');
  const [testUsername, setTestUsername] = useState('Đại Gia VIP');
  const [simulatorStatus, setSimulatorStatus] = useState('');

  // Sync to engine whenever states change
  const syncToEngine = (partial = {}) => {
    Object.assign(engine, partial);
    engine.saveSettings();
  };

  const handleAssignVoice = (voice, roleKey) => {
    if (roleKey === 'game') {
      const updated = {
        id: voice.id,
        name: voice.name,
        voiceId: voice.voiceId || voice.id,
        provider: voice.provider || 'elevenlabs',
        gender: voice.gender || 'Male'
      };
      setGameVoice(updated);
      syncToEngine({ gameVoice: updated });
    } else {
      const updated = {
        id: voice.id,
        name: voice.name,
        voiceId: voice.voiceId || voice.id,
        provider: voice.provider || 'elevenlabs',
        gender: voice.gender || 'Female'
      };
      setAssistantVoice(updated);
      syncToEngine({ assistantVoice: updated });
    }
  };

  const handlePreviewVoice = (voice, customSample = null) => {
    if (previewingVoiceId === voice.id) {
      stopVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }

    setPreviewingVoiceId(voice.id);
    const sample = customSample || (
      voice.gender === 'Female' 
        ? `Dạ em chào anh chị! Em là Trợ Lý AI của phiên live, chúc mọi người xem live thật vui ạ!`
        : `Chào mừng tất cả anh em chiến binh! Bình luận viên đã sẵn sàng tiếp lửa trận đấu!`
    );

    previewVoiceAudio(voice, sample, () => {
      setPreviewingVoiceId(null);
    });
  };

  const handleAddPrompt = () => {
    if (!newPromptText.trim()) return;
    const item = {
      id: 'p_' + Date.now(),
      text: newPromptText.trim(),
      role: newPromptRole,
      enabled: true
    };
    const updated = [item, ...prompts];
    setPrompts(updated);
    setNewPromptText('');
    syncToEngine({ prompts: updated });
  };

  const handleRemovePrompt = (idx) => {
    const updated = prompts.filter((_, i) => i !== idx);
    setPrompts(updated);
    syncToEngine({ prompts: updated });
  };

  const handleTogglePrompt = (idx) => {
    const updated = prompts.map((p, i) => i === idx ? { ...p, enabled: !p.enabled } : p);
    setPrompts(updated);
    syncToEngine({ prompts: updated });
  };

  const handleAddKeywordRule = () => {
    if (!newRuleKeywords.trim() || !newRuleReply.trim()) return;
    const kwList = newRuleKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const item = {
      id: 'k_' + Date.now(),
      name: newRuleName.trim() || kwList[0] || 'Rule mới',
      keywords: kwList,
      replyText: newRuleReply.trim(),
      role: newRuleRole,
      cooldownSec: Number(newRuleCooldown) || 4,
      enabled: true
    };
    const updated = [item, ...keywordRules];
    setKeywordRules(updated);
    setNewRuleName('');
    setNewRuleKeywords('');
    setNewRuleReply('');
    syncToEngine({ keywordRules: updated });
  };

  const handleRemoveKeywordRule = (idx) => {
    const updated = keywordRules.filter((_, i) => i !== idx);
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
  };

  const handleToggleKeywordRule = (idx) => {
    const updated = keywordRules.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r);
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
  };

  const handleRunSimulator = async () => {
    if (!testComment.trim()) return;
    setSimulatorStatus('Đang phân tích bộ não AI & Từ khóa...');
    const handled = await engine.handleUserComment(testComment.trim(), testUsername.trim() || 'Khán Giả');
    if (handled) {
      setSimulatorStatus('✅ Đã khớp từ khóa và kích hoạt Voice AI phát âm thanh!');
    } else {
      setSimulatorStatus('⚠️ Không khớp từ khóa nào trong danh sách cài sẵn.');
    }
    setTimeout(() => setSimulatorStatus(''), 4000);
  };

  const filteredVoices = ELEVENLABS_VOICES.filter(v => {
    if (voiceFilter === 'pro') return v.tier === 'pro';
    if (voiceFilter === 'free') return v.tier === 'free';
    if (voiceFilter === 'female') return v.gender === 'Female';
    if (voiceFilter === 'male') return v.gender === 'Male';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Executive Overview */}
      <div className="p-4 bg-gradient-to-r from-purple-950/70 via-slate-900/80 to-indigo-950/70 border border-purple-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-400/30">
              <Mic size={20} className="animate-pulse text-purple-300" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                Hệ Thống Voice AI Đa Vai Trò, Bình Luận & Tự Động Trả Lời
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                  ElevenLabs + Gemini AI
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                2 Kênh Giọng riêng biệt (BLV Trận Đấu & Trợ Lý AI) • Tự Động Bình Luận Theo Chu Kỳ • Tự Động Bắt Từ Khóa Phản Hồi 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={() => {
              const updated = !isAutoEnabled;
              setIsAutoEnabled(updated);
              syncToEngine({ isAutoEnabled: updated });
              if (updated) {
                engine.startPeriodicCommentary(true);
              } else {
                engine.stopPeriodicCommentary();
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
              isAutoEnabled 
                ? 'bg-emerald-500 text-black shadow-emerald-500/30 ring-2 ring-emerald-400' 
                : 'bg-white/10 text-gray-400 border border-white/10 hover:bg-white/20'
            }`}
          >
            <Radio size={14} className={isAutoEnabled ? 'animate-pulse text-black' : 'text-gray-400'} />
            {isAutoEnabled ? 'AUTO BÌNH LUẬN: ĐANG BẬT' : 'AUTO BÌNH LUẬN: ĐÃ TẮT'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'roles', label: '🎙️ 1. Gán Giọng 2 Vai Trò', icon: Mic },
          { id: 'timers', label: '⏱️ 2. Cài Đặt Khung Thời Gian', icon: Clock },
          { id: 'prompts', label: '📝 3. Danh Sách Câu Nói Cài Sẵn', icon: MessageSquare, count: prompts.length },
          { id: 'keywords', label: '🎯 4. Từ Khóa Auto Trả Lời', icon: Zap, count: keywordRules.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: GÁN GIỌNG 2 VAI TRÒ (BLV & TRỢ LÝ) */}
      {/* ========================================================================= */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          {/* Executive Active Roles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Card 1: BLV Game */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <Flame size={70} className="text-blue-400" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={14} className="text-yellow-400" /> 🎙️ VAI TRÒ 1: BÌNH LUẬN VIÊN GAME
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 font-mono border border-blue-500/30">
                  Game Commentator
                </span>
              </div>
              <div className="text-base font-black text-white flex items-center gap-2 mb-1">
                <span>{gameVoice?.name || 'Josh (Nam - BLV Kịch Tính)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {gameVoice?.provider?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Chuyên bình luận combat, hô hào cắm cờ Tổ Quốc, tiếp sức năng lượng và nâng tầm kịch tính cho phiên live.
              </p>
              <button
                onClick={() => {
                  const voice = ELEVENLABS_VOICES.find(v => v.id === gameVoice?.id) || ELEVENLABS_VOICES[0];
                  handlePreviewVoice(voice, 'Đại chiến đang diễn ra vô cùng nảy lửa! Toàn quân hãy cùng tiến lên xung trận chốt hạ chiến thắng!');
                }}
                className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Volume2 size={13} /> Nghe Thử Giọng BLV Này
              </button>
            </div>

            {/* Card 2: Trợ Lý AI / MC */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-950/60 via-slate-900 to-rose-950/60 border border-pink-500/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-15">
                <Sparkles size={70} className="text-pink-400" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-pink-400" /> 💼 VAI TRÒ 2: TRỢ LÝ AI & MC HỆ THỐNG
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-200 font-mono border border-pink-500/30">
                  AI Assistant & Host
                </span>
              </div>
              <div className="text-base font-black text-white flex items-center gap-2 mb-1">
                <span>{assistantVoice?.name || 'Rachel (Nữ - Ngọt ngào)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                  {assistantVoice?.provider?.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Chuyên chào đón khán giả, giải đáp luật chơi, kêu gọi tặng quà, cảm ơn đại gia và thông báo hoàn thành nhiệm vụ.
              </p>
              <button
                onClick={() => {
                  const voice = ELEVENLABS_VOICES.find(v => v.id === assistantVoice?.id) || ELEVENLABS_VOICES[1];
                  handlePreviewVoice(voice, 'Dạ em chào cả nhà yêu nha! Mọi người hãy thả tim và gửi quà để ủng hộ phiên live rực rỡ của em nhé!');
                }}
                className="px-3 py-1.5 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/40 text-pink-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Volume2 size={13} /> Nghe Thử Giọng Trợ Lý Này
              </button>
            </div>
          </div>

          {/* Filter Bar for Voice Catalog */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Tất Cả (37+)' },
                { id: 'pro', label: '💎 Trả Phí (ElevenLabs Pro)' },
                { id: 'free', label: '🆓 Miễn Phí (Web Speech)' },
                { id: 'female', label: '♀ Giọng Nữ' },
                { id: 'male', label: '♂ Giọng Nam' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setVoiceFilter(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    voiceFilter === cat.id
                      ? (cat.id === 'pro' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black shadow' : cat.id === 'free' ? 'bg-emerald-600 text-white font-black shadow' : 'bg-purple-600 text-white shadow')
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto custom-scrollbar pr-1">
            {filteredVoices.map(v => {
              const isBLV = gameVoice?.id === v.id;
              const isAssistant = assistantVoice?.id === v.id;
              const isPreviewing = previewingVoiceId === v.id;

              return (
                <div
                  key={v.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isBLV
                      ? 'bg-gradient-to-tr from-blue-950/80 via-slate-900 to-black border-blue-400 ring-2 ring-blue-400/50 shadow-xl'
                      : isAssistant
                        ? 'bg-gradient-to-tr from-pink-950/80 via-slate-900 to-black border-pink-400 ring-2 ring-pink-400/50 shadow-xl'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          v.gender === 'Female' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {v.gender === 'Female' ? '♀ Nữ' : '♂ Nam'} • {v.recommendedFor?.toUpperCase()}
                        </span>
                        {v.tier === 'pro' ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                            💎 PRO
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            🆓 FREE
                          </span>
                        )}
                      </div>

                      {/* Active Badges */}
                      <div className="flex items-center gap-1">
                        {isBLV && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-black">
                            🎙️ ĐANG LÀ BLV
                          </span>
                        )}
                        {isAssistant && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-black">
                            💼 ĐANG LÀ TRỢ LÝ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm font-black text-white">{v.name}</div>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mb-2.5">{v.desc}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => handlePreviewVoice(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isPreviewing 
                          ? 'bg-amber-500 text-black font-black animate-pulse shadow-lg shadow-amber-500/40' 
                          : 'bg-white/10 hover:bg-white/20 text-gray-200'
                      }`}
                    >
                      {isPreviewing ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
                      <span>{isPreviewing ? 'Dừng' : 'Nghe Thử'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAssignVoice(v, 'game')}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                          isBLV 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-blue-900/30 hover:bg-blue-600/60 text-blue-200 border border-blue-500/30'
                        }`}
                      >
                        {isBLV ? '✓ BLV' : '+ Gán BLV'}
                      </button>
                      <button
                        onClick={() => handleAssignVoice(v, 'assistant')}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                          isAssistant 
                            ? 'bg-pink-600 text-white shadow-md' 
                            : 'bg-pink-900/30 hover:bg-pink-600/60 text-pink-200 border border-pink-500/30'
                        }`}
                      >
                        {isAssistant ? '✓ Trợ Lý' : '+ Gán Trợ Lý'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: CÀI ĐẶT KHUNG THỜI GIAN & CHU KỲ AUTO */}
      {/* ========================================================================= */}
      {activeSubTab === 'timers' && (
        <div className="space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
          {/* Card 1: Interval Time & Auto Broadcast */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
              <Clock size={15} className="text-yellow-400" />
              1. Chu Kỳ Tự Động Phát Bình Luận (Timer Interval)
            </h4>
            <p className="text-xs text-gray-300">
              Cài đặt khoảng cách thời gian giữa các lần AI tự động cất tiếng nói bình luận, cổ vũ trận đấu hoặc kêu gọi tặng quà.
            </p>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              {[10, 15, 20, 30, 45, 60, 90, 120].map(sec => (
                <button
                  key={sec}
                  onClick={() => {
                    setIntervalSeconds(sec);
                    syncToEngine({ intervalSeconds: sec });
                    if (isAutoEnabled) engine.startPeriodicCommentary(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                    intervalSeconds === sec 
                      ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-600/40 ring-1 ring-purple-400' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  {sec}s {sec === 15 ? '⭐ Chuẩn' : ''}
                </button>
              ))}
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-200 mb-1.5">
                <span>Tùy chỉnh chính xác số giây:</span>
                <span className="font-mono text-purple-400 font-black text-sm">{intervalSeconds} Giây / 1 lần phát</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="1"
                value={intervalSeconds}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setIntervalSeconds(val);
                  syncToEngine({ intervalSeconds: val });
                  if (isAutoEnabled) engine.startPeriodicCommentary(true);
                }}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Card 2: Playback Order Mode & Response Delay */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Playback Mode */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Shuffle size={14} className="text-cyan-400" />
                2. Thứ Tự Chọn Câu Nói
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setPlaybackOrder('random');
                    syncToEngine({ playbackOrder: 'random' });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    playbackOrder === 'random' 
                      ? 'bg-cyan-950/60 border-cyan-400 text-white ring-1 ring-cyan-400' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                    <Shuffle size={13} className="text-cyan-400" /> Phát Ngẫu Nhiên
                  </div>
                  <p className="text-[10px] text-gray-400">Chọn ngẫu nhiên 1 câu trong danh sách để tạo sự tự nhiên, không lặp lại nhàm chán.</p>
                </button>

                <button
                  onClick={() => {
                    setPlaybackOrder('sequential');
                    syncToEngine({ playbackOrder: 'sequential' });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    playbackOrder === 'sequential' 
                      ? 'bg-purple-950/60 border-purple-400 text-white ring-1 ring-purple-400' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                    <ListOrdered size={13} className="text-purple-400" /> Phát Tuần Tự
                  </div>
                  <p className="text-[10px] text-gray-400">Đọc lần lượt từ câu 1 đến câu cuối cùng theo đúng kịch bản bài bản.</p>
                </button>
              </div>
            </div>

            {/* Response Delay */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-pink-400" />
                3. Độ Trễ Phản Hồi Từ Khóa (Response Delay)
              </h4>
              <p className="text-xs text-gray-400">
                Khoảng thời gian suy nghĩ giả lập trước khi AI cất tiếng trả lời bình luận (tạo cảm giác như streamer thật).
              </p>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1.5">
                  <span>Thời gian delay:</span>
                  <span className="font-mono text-pink-400 font-black">{responseDelaySec.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={responseDelaySec}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setResponseDelaySec(val);
                    syncToEngine({ responseDelaySec: val });
                  }}
                  className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Volume & Audio Ducking */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Volume2 size={15} className="text-emerald-400" />
              4. Âm Lượng Giọng Đọc & Tự Động Hạ Nhạc Nền (Audio Ducking)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1.5">
                  <span>Âm lượng Voice AI:</span>
                  <span className="font-mono text-emerald-400 font-black">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    syncToEngine({ volume: val });
                  }}
                  className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400 shrink-0" />
                <span>Hệ thống tự động hạ nhỏ nhạc nền BGM khi Voice AI phát âm thanh và tự khôi phục sau khi nói xong.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: DANH SÁCH CÂU NÓI & KỊCH BẢN CÀI SẴN */}
      {/* ========================================================================= */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-4">
          {/* Add Prompt Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus size={14} className="text-purple-400" /> Thêm Câu Thoại / Kịch Bản Bình Luận Mới (Không Giới Hạn)
              </h4>
              <span className="text-xs text-gray-400 font-mono">
                Tổng cộng: <strong className="text-purple-300">{prompts.length}</strong> câu
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
                placeholder="Nhập nội dung câu nói kích thích người xem hoặc kêu gọi cắm cờ / tặng quà..."
                className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />

              <select
                value={newPromptRole}
                onChange={(e) => setNewPromptRole(e.target.value)}
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-purple-300 font-bold focus:outline-none focus:border-purple-500 shrink-0"
              >
                <option value="game">🎙️ Giọng BLV Game</option>
                <option value="assistant">💼 Giọng Trợ Lý AI</option>
              </select>

              <button
                onClick={handleAddPrompt}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/30 shrink-0 transition-all"
              >
                <Plus size={14} /> Thêm Câu Này
              </button>
            </div>
          </div>

          {/* Prompts List */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
            {prompts.map((p, idx) => (
              <div 
                key={p.id || idx}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  p.enabled !== false 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleTogglePrompt(idx)}
                    className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                      p.enabled !== false ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-500'
                    }`}
                    title="Bật/Tắt câu này"
                  >
                    {idx + 1}
                  </button>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    p.role === 'assistant' 
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {p.role === 'assistant' ? '💼 Trợ Lý' : '🎙️ BLV Game'}
                  </span>

                  <span className="text-xs text-gray-200 font-medium truncate">
                    "{p.text}"
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => engine.speak(p.text, p.role || 'game', true)}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 transition-all"
                    title="Nghe thử câu này"
                  >
                    <Play size={12} className="fill-current" />
                  </button>
                  <button
                    onClick={() => handleRemovePrompt(idx)}
                    className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-all"
                    title="Xóa câu này"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: TỪ KHÓA TỰ ĐỘNG TRẢ LỜI (KEYWORD RULES & GEMINI AI) */}
      {/* ========================================================================= */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-4">
          {/* Top Config Cards: Keyword Master Toggle & Gemini AI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" /> Bắt Từ Khóa Tự Động (Keyword Trigger)
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Tự động nhận diện từ khóa trong comment và phát âm thanh câu trả lời tương ứng.
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = !isKeywordAutoReplyEnabled;
                  setIsKeywordAutoReplyEnabled(updated);
                  syncToEngine({ isKeywordAutoReplyEnabled: updated });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  isKeywordAutoReplyEnabled 
                    ? 'bg-amber-500 text-black shadow-md' 
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {isKeywordAutoReplyEnabled ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bot size={14} className="text-cyan-400" /> Bộ Não Gemini AI Thông Minh
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Tự động trả lời câu hỏi lạ của khán giả khi không khớp từ khóa cố định.
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = !useGeminiAI;
                  setUseGeminiAI(updated);
                  syncToEngine({ useGeminiAI: updated });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  useGeminiAI 
                    ? 'bg-cyan-500 text-black shadow-md' 
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {useGeminiAI ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
              </button>
            </div>
          </div>

          {/* Live Comment Simulator (Hộp thoại Thử Nghiệm Từ Khóa Trực Tiếp) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 space-y-3">
            <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" />
              ⚡ Thử Nghiệm Bắn Comment Giả Lập Để Nghe AI Trả Lời Trực Tiếp
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                placeholder="Tên khán giả (VD: Anh Hùng VIP)..."
                className="w-full sm:w-44 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                value={testComment}
                onChange={(e) => setTestComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSimulator()}
                placeholder="Nhập comment thử nghiệm (VD: 'chào shop', 'hướng dẫn chơi', 'phe xanh cố lên', 'quốc kỳ')..."
                className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={handleRunSimulator}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/30 transition-all shrink-0"
              >
                <Send size={13} /> Thử Nghiệm Ngay
              </button>
            </div>
            {simulatorStatus && (
              <div className="text-xs font-bold text-yellow-300 animate-fadeIn">
                {simulatorStatus}
              </div>
            )}
          </div>

          {/* Add New Keyword Rule Form */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Plus size={14} className="text-amber-400" /> Thêm Bộ Từ Khóa & Câu Trả Lời Mới
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
                placeholder="Tên bộ quy tắc (VD: Chào mừng, Hỏi quà)..."
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newRuleKeywords}
                onChange={(e) => setNewRuleKeywords(e.target.value)}
                placeholder="Từ khóa (cách nhau bằng dấu phẩy: chào, hi, xin chào)..."
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 sm:col-span-2"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                value={newRuleReply}
                onChange={(e) => setNewRuleReply(e.target.value)}
                placeholder="Nội dung câu trả lời (Hỗ trợ biến [user], [game])..."
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 sm:col-span-2"
              />
              <select
                value={newRuleRole}
                onChange={(e) => setNewRuleRole(e.target.value)}
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="assistant">💼 Giọng Trợ Lý AI</option>
                <option value="game">🎙️ Giọng BLV Game</option>
              </select>
              <button
                onClick={handleAddKeywordRule}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all"
              >
                <Plus size={14} /> Thêm Rule
              </button>
            </div>
          </div>

          {/* Keyword Rules List */}
          <div className="space-y-2.5 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
            {keywordRules.map((rule, idx) => (
              <div
                key={rule.id || idx}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  rule.enabled !== false 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white">{idx + 1}. {rule.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      rule.role === 'assistant' 
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {rule.role === 'assistant' ? '💼 Trợ Lý' : '🎙️ BLV Game'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Cooldown: {rule.cooldownSec || 4}s
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleKeywordRule(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        rule.enabled !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-500'
                      }`}
                    >
                      {rule.enabled !== false ? 'BẬT' : 'TẮT'}
                    </button>
                    <button
                      onClick={() => engine.speak(rule.replyText.replace(/\[user\]/gi, 'Đại Gia VIP'), rule.role || 'assistant', true)}
                      className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40"
                      title="Nghe thử phản hồi này"
                    >
                      <Play size={12} className="fill-current" />
                    </button>
                    <button
                      onClick={() => handleRemoveKeywordRule(idx)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40"
                      title="Xóa rule này"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Keywords Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-bold">Từ khóa:</span>
                  {rule.keywords.map((kw, kidx) => (
                    <span key={kidx} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      "{kw}"
                    </span>
                  ))}
                </div>

                {/* Reply preview */}
                <div className="text-xs text-gray-300 bg-black/40 p-2 rounded-xl border border-white/5 italic">
                  💬 Phản hồi: "{rule.replyText}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
