import React, { useState, useEffect } from 'react';
import { 
  Mic, Volume2, Sparkles, Play, Square, Plus, Trash2, Edit3, Check, 
  Clock, MessageSquare, Zap, Radio, Shuffle, ListOrdered, Bot, RefreshCw,
  Send, HelpCircle, ShieldCheck, UserCheck, Flame, Globe, Sliders, VolumeX
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio 
} from '../../../utils/voiceSyncService';
import { askGeminiLiveAi } from '../../../lib/geminiClient';

export const COUNTRY_FILTERS = [
  { id: 'all', label: 'Tất Cả', icon: '🌐' },
  { id: 'vi', label: 'Việt Nam', icon: '🇻🇳', code: 'vi-VN' },
  { id: 'en', label: 'US / UK', icon: '🇺🇸', code: 'en' },
  { id: 'zh', label: 'Trung Quốc', icon: '🇨🇳', code: 'zh' },
  { id: 'ja', label: 'Nhật Bản', icon: '🇯🇵', code: 'ja' },
  { id: 'ko', label: 'Hàn Quốc', icon: '🇰🇷', code: 'ko' },
  { id: 'fr', label: 'Pháp', icon: '🇫🇷', code: 'fr' },
  { id: 'es', label: 'Tây Ban Nha', icon: '🇪🇸', code: 'es' },
  { id: 'th', label: 'Thái Lan', icon: '🇹🇭', code: 'th' },
  { id: 'de', label: 'Đức', icon: '🇩🇪', code: 'de' },
];

export default function GameVoiceConfigPanel({ 
  engine, 
  gameType = 'map', // 'map' | 'battle'
  onClose = null 
}) {
  // Local reactive states
  const [activeSubTab, setActiveSubTab] = useState('roles'); // 'roles' | 'timers' | 'prompts' | 'keywords' | 'gemini'
  const [gameVoice, setGameVoice] = useState(engine.gameVoice || { enabled: true, rate: 1.05, pitch: 1.0, volume: 1.0 });
  const [assistantVoice, setAssistantVoice] = useState(engine.assistantVoice || { enabled: true, rate: 1.0, pitch: 1.05, volume: 1.0 });
  const [isAutoEnabled, setIsAutoEnabled] = useState(engine.isAutoEnabled);
  const [intervalSeconds, setIntervalSeconds] = useState(engine.intervalSeconds);
  const [playbackOrder, setPlaybackOrder] = useState(engine.playbackOrder || 'random');
  const [volume, setVolume] = useState(engine.volume || 0.9);
  const [speedRate, setSpeedRate] = useState(engine.speedRate || 1.0);
  const [pitch, setPitch] = useState(engine.pitch || 1.0);
  const [responseDelaySec, setResponseDelaySec] = useState(engine.responseDelaySec || 1.0);
  const [prompts, setPrompts] = useState([...engine.prompts]);
  const [isKeywordAutoReplyEnabled, setIsKeywordAutoReplyEnabled] = useState(engine.isKeywordAutoReplyEnabled);
  const [useGeminiAI, setUseGeminiAI] = useState(engine.useGeminiAI !== false);
  const [keywordRules, setKeywordRules] = useState([...engine.keywordRules]);
  
  // Voice filters & preview state
  const [voiceFilter, setVoiceFilter] = useState('all'); // 'all' | 'pro' | 'free' | 'female' | 'male'
  const [countryFilter, setCountryFilter] = useState('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  
  // Form states
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptRole, setNewPromptRole] = useState('game');
  const [editingPromptId, setEditingPromptId] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');
  const [newRuleRole, setNewRuleRole] = useState('assistant');
  const [newRuleCooldown, setNewRuleCooldown] = useState(4);

  // Test Simulator state
  const [testComment, setTestComment] = useState('');
  const [testUsername, setTestUsername] = useState('Đại Gia VIP');
  const [simulatorStatus, setSimulatorStatus] = useState('');
  const [lastAiReply, setLastAiReply] = useState('');

  // Sync to engine whenever states change
  const syncToEngine = (partial = {}) => {
    Object.assign(engine, partial);
    engine.saveSettings();
  };

  const handleAssignVoice = (voice, roleKey) => {
    if (roleKey === 'game') {
      const updated = {
        ...gameVoice,
        id: voice.id,
        name: voice.name,
        voiceId: voice.voiceId || voice.id,
        provider: voice.provider || 'elevenlabs',
        gender: voice.gender || 'Male',
        lang: voice.lang || 'vi-VN'
      };
      setGameVoice(updated);
      syncToEngine({ gameVoice: updated });
    } else {
      const updated = {
        ...assistantVoice,
        id: voice.id,
        name: voice.name,
        voiceId: voice.voiceId || voice.id,
        provider: voice.provider || 'elevenlabs',
        gender: voice.gender || 'Female',
        lang: voice.lang || 'vi-VN'
      };
      setAssistantVoice(updated);
      syncToEngine({ assistantVoice: updated });
    }
  };

  const handlePreviewVoice = (voice, customSample = null, customConfig = null) => {
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

    const voiceToPlay = {
      ...voice,
      rate: customConfig?.rate || voice.rate || speedRate,
      pitch: customConfig?.pitch || voice.pitch || pitch,
      volume: customConfig?.volume || voice.volume || volume
    };

    previewVoiceAudio(voiceToPlay, sample, () => {
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

  const handleSaveEditPrompt = (id) => {
    if (!editingPromptText.trim()) return;
    const updated = prompts.map(p => p.id === id ? { ...p, text: editingPromptText.trim() } : p);
    setPrompts(updated);
    setEditingPromptId(null);
    setEditingPromptText('');
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
    setSimulatorStatus('🧠 Đang kết nối Bộ não AI Gemini & quét từ khóa...');
    setLastAiReply('');

    try {
      const handled = await engine.handleUserComment(testComment.trim(), testUsername.trim() || 'Khán Giả');
      if (handled) {
        setSimulatorStatus('✅ Đã nhận diện và kích hoạt phát Voice AI trực tiếp ra loa!');
      } else {
        setSimulatorStatus('⚠️ Đang gọi trực tiếp Gemini AI Flash...');
        const aiRes = await askGeminiLiveAi({
          question: testComment.trim(),
          username: testUsername.trim() || 'Khán Giả',
          role: 'assistant',
          context: gameType === 'battle' ? 'Đại Chiến PK Phe Xanh vs Phe Đỏ' : 'Đại Chiến Cắm Cờ Tổ Quốc',
          gameType
        });
        if (aiRes?.text) {
          setLastAiReply(aiRes.text);
          engine.speak(aiRes.text, 'assistant', true);
          setSimulatorStatus('✅ Bộ não Gemini AI đã trả lời và phát giọng đọc thành công!');
        }
      }
    } catch (e) {
      setSimulatorStatus('❌ Lỗi kết nối: ' + e.message);
    }
  };

  const filteredVoices = ALL_SYSTEM_VOICES.filter(v => {
    if (voiceFilter === 'pro' && v.tier !== 'pro') return false;
    if (voiceFilter === 'free' && v.tier !== 'free') return false;
    if (voiceFilter === 'female' && v.gender !== 'Female') return false;
    if (voiceFilter === 'male' && v.gender !== 'Male') return false;
    if (countryFilter !== 'all') {
      const target = COUNTRY_FILTERS.find(c => c.id === countryFilter);
      if (target && target.code && !v.lang?.startsWith(target.code) && !v.id.includes(`_${countryFilter}_`)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Executive Overview */}
      <div className="p-4 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-400/30">
              <Mic size={22} className="animate-pulse text-purple-300" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                Hệ Thống Voice AI Đa Vai Trò, Âm Lượng, Tốc Độ & Bộ Não Gemini
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                  Gemini 1.5 Flash + ElevenLabs
                </span>
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Tùy chỉnh Volume, Tốc độ (0.5x - 2.0x), Cao độ • BLV & Trợ Lý Bán Hàng • Trả lời tự động câu hỏi ngoài vùng 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
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
          { id: 'roles', label: '🎙️ 1. Gán Giọng & Tùy Chỉnh Âm Lượng / Tốc Độ', icon: Mic },
          { id: 'prompts', label: '📝 2. Câu Thoại & Kịch Bản Cài Sẵn', icon: MessageSquare, count: prompts.length },
          { id: 'keywords', label: '🎯 3. Bắt Từ Khóa Phản Hồi', icon: Zap, count: keywordRules.length },
          { id: 'gemini', label: '🧠 4. Bộ Não AI Gemini Trả Lời Câu Hỏi Ngoài Vùng', icon: Bot },
          { id: 'timers', label: '⏱️ 5. Chu Kỳ & Delay', icon: Clock },
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
      {/* SUB-TAB 1: GÁN GIỌNG & TÙY CHỈNH ÂM LƯỢNG / TỐC ĐỘ 2 VAI TRÒ */}
      {/* ========================================================================= */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          {/* Executive Active Roles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Card 1: BLV Game */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 shadow-xl relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio size={14} className="text-yellow-400" /> 🎙️ VAI TRÒ 1: BÌNH LUẬN VIÊN GAME
                </span>
                <button
                  onClick={() => {
                    const updated = { ...gameVoice, enabled: gameVoice.enabled === false ? true : false };
                    setGameVoice(updated);
                    syncToEngine({ gameVoice: updated });
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-black transition-all ${
                    gameVoice.enabled !== false 
                      ? 'bg-emerald-500 text-black shadow-md' 
                      : 'bg-red-500/30 text-red-300 border border-red-500/40'
                  }`}
                >
                  {gameVoice.enabled !== false ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </button>
              </div>

              <div className="text-base font-black text-white flex items-center gap-2">
                <span>{gameVoice?.name || 'Josh (Nam - BLV Kịch Tính)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {gameVoice?.provider?.toUpperCase()}
                </span>
              </div>

              {/* Sliders: Volume, Speed, Pitch cho BLV */}
              <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-200">
                  <span className="flex items-center gap-1 font-bold">
                    <Volume2 size={12} className="text-blue-400" /> Âm Lượng BLV:
                  </span>
                  <span className="font-mono text-blue-300 font-black">
                    {Math.round((gameVoice.volume !== undefined ? gameVoice.volume : 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={gameVoice.volume !== undefined ? gameVoice.volume : 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...gameVoice, volume: val };
                    setGameVoice(updated);
                    syncToEngine({ gameVoice: updated });
                  }}
                  className="w-full accent-blue-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Sliders size={12} className="text-yellow-400" /> Tốc Độ Đọc (Speed):
                  </span>
                  <span className="font-mono text-yellow-300 font-black">
                    {(gameVoice.rate !== undefined ? gameVoice.rate : 1.05).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={gameVoice.rate !== undefined ? gameVoice.rate : 1.05}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...gameVoice, rate: val };
                    setGameVoice(updated);
                    syncToEngine({ gameVoice: updated });
                  }}
                  className="w-full accent-yellow-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles size={12} className="text-cyan-400" /> Cao Độ (Pitch):
                  </span>
                  <span className="font-mono text-cyan-300 font-black">
                    {(gameVoice.pitch !== undefined ? gameVoice.pitch : 1.0).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={gameVoice.pitch !== undefined ? gameVoice.pitch : 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...gameVoice, pitch: val };
                    setGameVoice(updated);
                    syncToEngine({ gameVoice: updated });
                  }}
                  className="w-full accent-cyan-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  const voice = ALL_SYSTEM_VOICES.find(v => v.id === gameVoice?.id) || gameVoice;
                  handlePreviewVoice(voice, 'Đại chiến đang diễn ra vô cùng nảy lửa! Toàn quân hãy cùng tiến lên xung trận chốt hạ chiến thắng!', gameVoice);
                }}
                className="w-full py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Volume2 size={13} /> Nghe Thử Giọng BLV Này Với Cài Đặt Hiện Tại
              </button>
            </div>

            {/* Card 2: Trợ Lý AI / MC */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-pink-950/60 via-slate-900 to-rose-950/60 border border-pink-500/40 shadow-xl relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-pink-400" /> 💼 VAI TRÒ 2: TRỢ LÝ AI & BÁN HÀNG
                </span>
                <button
                  onClick={() => {
                    const updated = { ...assistantVoice, enabled: assistantVoice.enabled === false ? true : false };
                    setAssistantVoice(updated);
                    syncToEngine({ assistantVoice: updated });
                  }}
                  className={`text-[10px] px-2.5 py-1 rounded-full font-black transition-all ${
                    assistantVoice.enabled !== false 
                      ? 'bg-emerald-500 text-black shadow-md' 
                      : 'bg-red-500/30 text-red-300 border border-red-500/40'
                  }`}
                >
                  {assistantVoice.enabled !== false ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                </button>
              </div>

              <div className="text-base font-black text-white flex items-center gap-2">
                <span>{assistantVoice?.name || 'Rachel (Nữ - Ngọt ngào)'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                  {assistantVoice?.provider?.toUpperCase()}
                </span>
              </div>

              {/* Sliders: Volume, Speed, Pitch cho Trợ Lý */}
              <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-200">
                  <span className="flex items-center gap-1 font-bold">
                    <Volume2 size={12} className="text-pink-400" /> Âm Lượng Trợ Lý:
                  </span>
                  <span className="font-mono text-pink-300 font-black">
                    {Math.round((assistantVoice.volume !== undefined ? assistantVoice.volume : 1.0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={assistantVoice.volume !== undefined ? assistantVoice.volume : 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...assistantVoice, volume: val };
                    setAssistantVoice(updated);
                    syncToEngine({ assistantVoice: updated });
                  }}
                  className="w-full accent-pink-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Sliders size={12} className="text-amber-400" /> Tốc Độ Đọc (Speed):
                  </span>
                  <span className="font-mono text-amber-300 font-black">
                    {(assistantVoice.rate !== undefined ? assistantVoice.rate : 1.0).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={assistantVoice.rate !== undefined ? assistantVoice.rate : 1.0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...assistantVoice, rate: val };
                    setAssistantVoice(updated);
                    syncToEngine({ assistantVoice: updated });
                  }}
                  className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />

                <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles size={12} className="text-rose-400" /> Cao Độ (Pitch):
                  </span>
                  <span className="font-mono text-rose-300 font-black">
                    {(assistantVoice.pitch !== undefined ? assistantVoice.pitch : 1.05).toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={assistantVoice.pitch !== undefined ? assistantVoice.pitch : 1.05}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    const updated = { ...assistantVoice, pitch: val };
                    setAssistantVoice(updated);
                    syncToEngine({ assistantVoice: updated });
                  }}
                  className="w-full accent-rose-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  const voice = ALL_SYSTEM_VOICES.find(v => v.id === assistantVoice?.id) || assistantVoice;
                  handlePreviewVoice(voice, 'Dạ em chào cả nhà yêu nha! Mọi người hãy thả tim và gửi quà để ủng hộ phiên live rực rỡ của em nhé!', assistantVoice);
                }}
                className="w-full py-2 bg-pink-600/30 hover:bg-pink-600/50 border border-pink-400/40 text-pink-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Volume2 size={13} /> Nghe Thử Giọng Trợ Lý Này Với Cài Đặt Hiện Tại
              </button>
            </div>
          </div>

          {/* Filter Bar for Voice Catalog: Gender, Tier & Country */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'Tất Cả Giọng' },
                  { id: 'pro', label: '💎 ElevenLabs Pro' },
                  { id: 'free', label: '🆓 Miễn Phí (TTS Chuẩn)' },
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

            {/* Country Filters Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0">
                <Globe size={13} className="text-cyan-400" /> Quốc Gia:
              </span>
              {COUNTRY_FILTERS.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCountryFilter(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                    countryFilter === c.id 
                      ? 'bg-cyan-500 text-black font-black shadow-md' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[44vh] overflow-y-auto custom-scrollbar pr-1">
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
                          {v.gender === 'Female' ? '♀ Nữ' : '♂ Nam'} • {v.lang || 'vi-VN'}
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
      {/* SUB-TAB 2: DANH SÁCH CÂU NÓI & KỊCH BẢN CÀI SẴN */}
      {/* ========================================================================= */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-4">
          {/* Add Prompt Box */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus size={14} className="text-purple-400" /> Thêm Câu Thoại / Kịch Bản Bình Luận Mới (Tùy Biến Linh Hoạt)
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
            {prompts.map((p, idx) => {
              const isEditing = editingPromptId === (p.id || idx);

              return (
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

                    <button
                      onClick={() => {
                        const newRole = p.role === 'assistant' ? 'game' : 'assistant';
                        const updated = prompts.map((item, i) => i === idx ? { ...item, role: newRole } : item);
                        setPrompts(updated);
                        syncToEngine({ prompts: updated });
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 cursor-pointer transition-all ${
                        p.role === 'assistant' 
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/40' 
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/40'
                      }`}
                      title="Bấm để đổi vai trò"
                    >
                      {p.role === 'assistant' ? '💼 Trợ Lý' : '🎙️ BLV Game'}
                    </button>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingPromptText}
                          onChange={(e) => setEditingPromptText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEditPrompt(p.id || idx)}
                          className="flex-1 px-2.5 py-1 bg-black/80 border border-purple-400 rounded-lg text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEditPrompt(p.id || idx)}
                          className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                          title="Lưu sửa đổi"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-200 font-medium truncate flex-1">
                        "{p.text}"
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        if (isEditing) {
                          setEditingPromptId(null);
                        } else {
                          setEditingPromptId(p.id || idx);
                          setEditingPromptText(p.text);
                        }
                      }}
                      className="p-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
                      title="Sửa nội dung câu này"
                    >
                      <Edit3 size={12} />
                    </button>
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
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: TỪ KHÓA TỰ ĐỘNG PHẢN HỒI */}
      {/* ========================================================================= */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" /> Bắt Từ Khóa Tự Động (Keyword Trigger)
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Tự động nhận diện từ khóa trong bình luận và phát âm thanh câu trả lời chuẩn xác.
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

      {/* ========================================================================= */}
      {/* SUB-TAB 4: BỘ NÃO AI GEMINI TRẢ LỜI CÂU HỎI NGOÀI VÙNG */}
      {/* ========================================================================= */}
      {activeSubTab === 'gemini' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-400/30">
                  <Bot size={20} className="animate-pulse text-cyan-300" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                    Bộ Não AI Gemini Flash Xử Lý Câu Hỏi Khán Giả Ngoài Vùng Cài Đặt
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Tự động trả lời thông minh, đúng trọng tâm, ngắn gọn, lịch sự, chuẩn văn hóa livestream, tuyệt đối không nói bậy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const updated = !useGeminiAI;
                  setUseGeminiAI(updated);
                  syncToEngine({ useGeminiAI: updated });
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  useGeminiAI 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400' 
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {useGeminiAI ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="text-cyan-400 font-bold flex items-center gap-1">⚡ Tốc độ siêu tốc</span>
                <p className="text-gray-400 text-[11px]">Gemini 1.5 Flash phản hồi trong &lt;500ms, không làm gián đoạn nhịp phiên live.</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">🛡️ An toàn 100%</span>
                <p className="text-gray-400 text-[11px]">Hệ thống bảo vệ nghiêm ngặt: không chửi tục, không nói bậy, không xúc phạm.</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs space-y-1">
                <span className="text-yellow-400 font-bold flex items-center gap-1">🎙️ Tự Động Đọc Thành Tiếng</span>
                <p className="text-gray-400 text-[11px]">Câu trả lời sinh ra được phát ngay ra loa với giọng đọc Trợ Lý AI hoặc BLV.</p>
              </div>
            </div>
          </div>

          {/* Live Comment Simulator (Hộp thoại Thử Nghiệm Từ Khóa & Gemini Trực Tiếp) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 space-y-3">
            <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-yellow-400" />
              ⚡ Thử Nghiệm Bắn Câu Hỏi Bất Kỳ Để Nghe AI Trả Lời Trực Tiếp
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                placeholder="Tên khán giả..."
                className="w-full sm:w-44 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                value={testComment}
                onChange={(e) => setTestComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunSimulator()}
                placeholder="Nhập câu hỏi bất kỳ (VD: 'Bản đồ này cắm cờ thế nào?', 'Shop bán đồ gì?', 'Hà Nội cắm được chưa?')..."
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
              <div className="text-xs font-bold text-yellow-300 animate-fadeIn bg-black/40 p-2.5 rounded-xl border border-yellow-500/30">
                {simulatorStatus}
              </div>
            )}

            {lastAiReply && (
              <div className="text-xs text-cyan-200 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold uppercase">Phản hồi từ Bộ Não Gemini AI:</span>
                <p className="italic font-medium">"{lastAiReply}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: CÀI ĐẶT KHUNG THỜI GIAN & CHU KỲ AUTO */}
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
        </div>
      )}
    </div>
  );
}
