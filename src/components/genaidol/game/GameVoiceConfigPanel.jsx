import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Volume2, Sparkles, Play, Square, Plus, Trash2, Edit3, Check, 
  Clock, MessageSquare, Zap, Radio, Shuffle, ListOrdered, Bot, RefreshCw,
  Send, HelpCircle, ShieldCheck, UserCheck, Flame, Globe, Sliders, VolumeX,
  Upload, FileText, ArrowUp, ArrowDown, Copy, CheckCircle2, Download,
  Save, Wand2, Volume1
} from 'lucide-react';
import { 
  ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio 
} from '../../../utils/voiceSyncService';
import { askGeminiLiveAi } from '../../../lib/geminiClient';
import { readUniversalFile, parseUniversalRulePairs } from '../../../utils/universalDocumentParser';

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
  const [isAutoLoop, setIsAutoLoop] = useState(engine.isAutoLoop ?? true);
  const [intervalSeconds, setIntervalSeconds] = useState(engine.intervalSeconds);
  const [playbackOrder, setPlaybackOrder] = useState(engine.playbackOrder || 'sequential');
  const [volume, setVolume] = useState(engine.volume || 0.9);
  const [speedRate, setSpeedRate] = useState(engine.speedRate || 1.0);
  const [pitch, setPitch] = useState(engine.pitch || 1.0);
  const [responseDelaySec, setResponseDelaySec] = useState(engine.responseDelaySec || 0.5);
  const [replyCooldownSec, setReplyCooldownSec] = useState(engine.replyCooldownSec || 3);
  const [prompts, setPrompts] = useState([...engine.prompts]);
  const [isKeywordAutoReplyEnabled, setIsKeywordAutoReplyEnabled] = useState(engine.isKeywordAutoReplyEnabled);
  const [useGeminiAI, setUseGeminiAI] = useState(engine.useGeminiAI !== false);
  const [keywordRules, setKeywordRules] = useState([...engine.keywordRules]);
  
  // Voice filters & preview state
  const [voiceFilter, setVoiceFilter] = useState('all'); // 'all' | 'pro' | 'free' | 'female' | 'male'
  const [countryFilter, setCountryFilter] = useState('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  const [playingRuleId, setPlayingRuleId] = useState(null);
  const [syncAllVoiceChoice, setSyncAllVoiceChoice] = useState('assistant');
  
  // Form & Editing states for Prompts
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptRole, setNewPromptRole] = useState('game');
  const [editingPromptId, setEditingPromptId] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  const [editingPromptRole, setEditingPromptRole] = useState('game');
  
  // Form & Editing states for Keyword Rules
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');
  const [newRuleRole, setNewRuleRole] = useState('assistant');
  const [newRuleCooldown, setNewRuleCooldown] = useState(4);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleData, setEditingRuleData] = useState(null);

  // Bulk Import Modal States
  const [showBulkPromptModal, setShowBulkPromptModal] = useState(false);
  const [bulkPromptText, setBulkPromptText] = useState('');
  const [bulkPromptRole, setBulkPromptRole] = useState('game');
  const promptFileInputRef = useRef(null);

  const [showBulkRuleModal, setShowBulkRuleModal] = useState(false);
  const [bulkRuleText, setBulkRuleText] = useState('');
  const ruleFileInputRef = useRef(null);

  // Test Simulator state
  const [testComment, setTestComment] = useState('');
  const [testUsername, setTestUsername] = useState('Đại Gia VIP');
  const [simulatorStatus, setSimulatorStatus] = useState('');
  const [lastAiReply, setLastAiReply] = useState('');
  const [simSelectedVoiceRole, setSimSelectedVoiceRole] = useState('assistant'); // 'assistant' | 'game' | specific voice id
  const [simVoiceVolume, setSimVoiceVolume] = useState(1.0);
  const [simVoiceRate, setSimVoiceRate] = useState(1.0);
  const [copiedStatus, setCopiedStatus] = useState('');
  const [saveToast, setSaveToast] = useState('');

  const showToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3500);
  };

  // Sync to engine whenever states change and save to localStorage
  const syncToEngine = (partial = {}) => {
    Object.assign(engine, partial);
    engine.saveSettings();
    try {
      if (partial.keywordRules) {
        localStorage.setItem('AVALIVE_KEYWORD_RULES_SHARED', JSON.stringify(partial.keywordRules));
      }
    } catch (e) {}
  };

  // Manual permanent save across all tabs
  const handleSaveAllConfigPermanently = () => {
    const fullData = {
      gameVoice,
      assistantVoice,
      prompts,
      keywordRules,
      isAutoEnabled,
      isAutoLoop,
      intervalSeconds,
      playbackOrder,
      isKeywordAutoReplyEnabled,
      useGeminiAI,
      responseDelaySec,
      volume,
      speedRate,
      pitch
    };
    syncToEngine(fullData);
    try {
      localStorage.setItem(`GAME_VOICE_CONFIG_${(engine.gameType || gameType).toUpperCase()}`, JSON.stringify(fullData));
      localStorage.setItem('AVALIVE_KEYWORD_RULES_SHARED', JSON.stringify(keywordRules));
      window.dispatchEvent(new CustomEvent('game_voice_settings_updated', {
        detail: { gameType: engine.gameType || gameType, settings: fullData }
      }));
    } catch (e) {
      console.warn('Permanent save error:', e);
    }
    showToast(`💾 ĐÃ LƯU TOÀN BỘ CẤU HÌNH VĨNH VIỄN! (${keywordRules.length} quy tắc & toàn bộ giọng đọc đã lưu an toàn vào máy)`);
  };

  // Bulk Apply 1 Voice to ALL Rules in 1 Click
  const handleSyncVoiceToAllRules = (targetChoice) => {
    if (!keywordRules || keywordRules.length === 0) {
      showToast('⚠️ Chưa có quy tắc nào trong danh sách để đồng bộ giọng!');
      return;
    }
    const isSpecial = targetChoice === 'assistant' || targetChoice === 'game';
    const updated = keywordRules.map(r => ({
      ...r,
      role: isSpecial ? targetChoice : targetChoice,
      voiceId: isSpecial ? undefined : targetChoice
    }));
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
    try {
      localStorage.setItem(`GAME_VOICE_CONFIG_${(engine.gameType || gameType).toUpperCase()}`, JSON.stringify({
        ...engine,
        keywordRules: updated
      }));
      localStorage.setItem('AVALIVE_KEYWORD_RULES_SHARED', JSON.stringify(updated));
    } catch (e) {}

    const voiceName = isSpecial 
      ? (targetChoice === 'assistant' ? 'Giọng Trợ Lý AI' : 'Giọng Bình Luận Viên Game') 
      : (ALL_SYSTEM_VOICES.find(v => v.id === targetChoice)?.name || targetChoice);
    showToast(`✨ ĐÃ ĐỒNG BỘ 1 GIỌNG CHO TẤT CẢ ${updated.length} QUY TẮC: [${voiceName}]!`);
  };

  // Preview Audio for a single Keyword Rule
  const handlePlayRuleAudio = async (rule, idx) => {
    const id = rule.id || idx;
    if (playingRuleId === id) {
      stopVoiceAudio();
      setPlayingRuleId(null);
      return;
    }
    setPlayingRuleId(id);
    const textToSpeak = (rule.replyText || 'Xin chào bạn!').replace(/\[user\]/gi, 'Khán Giả VIP');

    let voiceToUse = assistantVoice;
    if (rule.voiceId) {
      const found = ALL_SYSTEM_VOICES.find(v => v.id === rule.voiceId || v.voiceId === rule.voiceId);
      if (found) voiceToUse = found;
    } else if (rule.role === 'game') {
      voiceToUse = gameVoice;
    } else if (rule.role === 'assistant') {
      voiceToUse = assistantVoice;
    } else if (typeof rule.role === 'string') {
      const found = ALL_SYSTEM_VOICES.find(v => v.id === rule.role);
      if (found) voiceToUse = found;
    }

    const voiceObj = {
      ...voiceToUse,
      rate: speedRate,
      pitch: pitch,
      volume: volume
    };

    try {
      await previewVoiceAudio(voiceObj, textToSpeak, () => {
        setPlayingRuleId(null);
      });
    } catch (e) {
      console.warn('Play rule audio error:', e);
      setPlayingRuleId(null);
    }
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
      showToast(`✅ Đã gán giọng "${voice.name}" cho Bình Luận Viên!`);
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
      showToast(`✅ Đã gán giọng "${voice.name}" cho Trợ Lý AI!`);
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
        ? `Dạ em chào bạn! Em là Trợ Lý AI của phiên live, chúc bạn xem live thật vui ạ!`
        : `Chào mừng tất cả các bạn! Bình luận viên đã sẵn sàng tiếp lửa trận đấu!`
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

  // -------------------------------------------------------------
  // PROMPTS OPERATIONS (Thêm, Sửa trực tiếp, Đổi thứ tự, Bulk Split)
  // -------------------------------------------------------------
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
    showToast('✅ Đã thêm câu thoại mới vào kịch bản!');
  };

  const handleSaveEditPrompt = (id) => {
    if (!editingPromptText.trim()) return;
    const updated = prompts.map(p => p.id === id ? { ...p, text: editingPromptText.trim(), role: editingPromptRole } : p);
    setPrompts(updated);
    setEditingPromptId(null);
    setEditingPromptText('');
    syncToEngine({ prompts: updated });
    showToast('✅ Đã lưu kịch bản thành công và áp dụng cho phiên Live thật!');
  };

  const handleMovePrompt = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= prompts.length) return;
    const updated = [...prompts];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPrompts(updated);
    syncToEngine({ prompts: updated });
  };

  const handleRemovePrompt = (idx) => {
    const updated = prompts.filter((_, i) => i !== idx);
    setPrompts(updated);
    syncToEngine({ prompts: updated });
    showToast('🗑️ Đã xóa câu thoại khỏi kịch bản!');
  };

  const handleClearAllPrompts = () => {
    if (prompts.length === 0) return;
    if (window.confirm(`⚠️ Anh có chắc chắn muốn XÓA SẠCH TẤT CẢ ${prompts.length} câu thoại trong kịch bản không?\n(Hành động này sẽ dọn sạch danh sách ngay lập tức)`)) {
      setPrompts([]);
      syncToEngine({ prompts: [] });
      showToast('🗑️ Đã xóa sạch toàn bộ kịch bản câu thoại!');
    }
  };

  const handleTogglePrompt = (idx) => {
    const updated = prompts.map((p, i) => i === idx ? { ...p, enabled: !p.enabled } : p);
    setPrompts(updated);
    syncToEngine({ prompts: updated });
  };

  // Bulk split prompts from Text or Universal File (TXT/CSV/JSON/MD/PDF/DOCX)
  const handleBulkImportPrompts = (rawText, defaultRole = 'game') => {
    if (!rawText || !rawText.trim()) return;
    const lines = rawText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 2);

    if (lines.length === 0) return;

    const newItems = lines.map((line, idx) => {
      // Clean leading numbers like "1. ", "1/ ", "- "
      const cleaned = line.replace(/^(\d+[\.\/\:\-\)]\s*|[\-\*\•\#\>\~]\s*)/, '').trim();
      let role = defaultRole;
      if (cleaned.toLowerCase().startsWith('[trợ lý]') || cleaned.toLowerCase().startsWith('[assistant]')) {
        role = 'assistant';
      } else if (cleaned.toLowerCase().startsWith('[blv]') || cleaned.toLowerCase().startsWith('[game]')) {
        role = 'game';
      }
      return {
        id: 'p_' + (Date.now() + idx),
        text: cleaned.replace(/^\[(trợ lý|assistant|blv|game)\]\s*/i, ''),
        role,
        enabled: true
      };
    });

    const updated = [...newItems, ...prompts];
    setPrompts(updated);
    syncToEngine({ prompts: updated });
    setShowBulkPromptModal(false);
    setBulkPromptText('');
    showToast(`✅ Đã nạp thành công ${newItems.length} câu thoại từ file!`);
  };

  const handleFileUploadPrompts = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast(`⏳ Đang đọc và bóc tách dữ liệu từ file ${file.name}...`);
      const lines = await readUniversalFile(file);
      if (lines && lines.length > 0) {
        handleBulkImportPrompts(lines.join('\n'), bulkPromptRole);
      } else {
        showToast(`⚠️ Không tìm thấy nội dung văn bản trong file ${file.name}`);
      }
    } catch (err) {
      console.error('File upload prompts error:', err);
      showToast(`❌ Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  // -------------------------------------------------------------
  // KEYWORD RULES OPERATIONS (Thêm, Sửa trực tiếp, Đổi thứ tự, Bulk Split)
  // -------------------------------------------------------------
  const handleAddKeywordRule = () => {
    if (!newRuleKeywords.trim() || !newRuleReply.trim()) return;
    const kwList = newRuleKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const item = {
      id: 'k_' + Date.now(),
      name: newRuleName.trim() || kwList[0] || 'Rule mới',
      keywords: kwList,
      replyText: newRuleReply.trim(),
      role: newRuleRole,
      voiceId: newRuleRole !== 'assistant' && newRuleRole !== 'game' ? newRuleRole : undefined,
      cooldownSec: Number(newRuleCooldown) || 4,
      enabled: true
    };
    const updated = [item, ...keywordRules];
    setKeywordRules(updated);
    setNewRuleName('');
    setNewRuleKeywords('');
    setNewRuleReply('');
    syncToEngine({ keywordRules: updated });
    showToast('✅ Đã thêm quy tắc từ khóa mới!');
  };

  const handleSaveEditRule = (id) => {
    if (!editingRuleData) return;
    const updated = keywordRules.map(r => r.id === id ? {
      ...r,
      name: editingRuleData.name,
      keywords: typeof editingRuleData.keywords === 'string' ? editingRuleData.keywords.split(',').map(s => s.trim()).filter(Boolean) : editingRuleData.keywords,
      replyText: editingRuleData.replyText,
      role: editingRuleData.role,
      voiceId: editingRuleData.voiceId,
      cooldownSec: Number(editingRuleData.cooldownSec) || 4
    } : r);
    setKeywordRules(updated);
    setEditingRuleId(null);
    setEditingRuleData(null);
    syncToEngine({ keywordRules: updated });
    showToast('✅ Đã lưu thay đổi quy tắc từ khóa & áp dụng real-time!');
  };

  const handleMoveKeywordRule = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= keywordRules.length) return;
    const updated = [...keywordRules];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
  };

  const handleRemoveKeywordRule = (idx) => {
    const updated = keywordRules.filter((_, i) => i !== idx);
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
    showToast('🗑️ Đã xóa quy tắc từ khóa!');
  };

  const handleClearAllKeywordRules = () => {
    if (keywordRules.length === 0) return;
    if (window.confirm(`⚠️ Anh có chắc chắn muốn XÓA SẠCH TẤT CẢ ${keywordRules.length} quy tắc từ khóa không?\n(Hành động này sẽ dọn sạch danh sách từ khóa ngay lập tức)`)) {
      setKeywordRules([]);
      syncToEngine({ keywordRules: [] });
      showToast('🗑️ Đã xóa sạch toàn bộ quy tắc từ khóa!');
    }
  };

  const handleToggleKeywordRule = (idx) => {
    const updated = keywordRules.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r);
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
  };

  // Bulk split keyword rules from Text or Universal File (TXT/CSV/JSON/MD/PDF/DOCX)
  const handleBulkImportRules = (rawInput) => {
    if (!rawInput) return;
    const newRules = parseUniversalRulePairs(rawInput);
    if (!newRules || newRules.length === 0) {
      showToast('⚠️ Không tìm thấy quy tắc hợp lệ trong văn bản hoặc file');
      return;
    }

    const updated = [...newRules, ...keywordRules];
    setKeywordRules(updated);
    syncToEngine({ keywordRules: updated });
    setShowBulkRuleModal(false);
    setBulkRuleText('');
    showToast(`✅ Đã nạp thành công ${newRules.length} quy tắc từ khóa chuẩn xác 100%!`);
  };

  const handleFileUploadRules = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast(`⏳ Đang đọc và bóc tách quy tắc từ file ${file.name}...`);
      const raw = await readUniversalFile(file);
      if (raw) {
        handleBulkImportRules(raw);
      } else {
        showToast(`⚠️ Không tìm thấy nội dung văn bản trong file ${file.name}`);
      }
    } catch (err) {
      console.error('File upload rules error:', err);
      showToast(`❌ Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  // Xuất kịch bản ra file (.md hoặc .json)
  const handleExportRules = (format = 'md') => {
    if (!keywordRules || keywordRules.length === 0) {
      showToast('⚠️ Chưa có quy tắc nào trong danh sách để xuất!');
      return;
    }
    let content = '';
    const fileName = `KICH_BAN_TU_KHOA_AVA_${Date.now()}.${format}`;
    const mimeType = format === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8';

    if (format === 'json') {
      content = JSON.stringify(keywordRules, null, 2);
    } else {
      content = `# KỊCH BẢN TỪ KHÓA & PHẢN HỒI LIVESTREAM AVA\n# Tổng số quy tắc: ${keywordRules.length}\n# Ngày xuất: ${new Date().toLocaleString('vi-VN')}\n\n`;
      keywordRules.forEach((r, idx) => {
        const kws = (r.keywords || []).map(k => `"${k}"`).join(', ');
        content += `## ${idx + 1}. ${r.name || `Quy tắc ${idx + 1}`}\n${kws}\n“${r.replyText || ''}”\n\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✅ Đã xuất thành công ${keywordRules.length} quy tắc ra file ${fileName}!`);
  };

  // Tải file mẫu kịch bản chuẩn (.md)
  const handleDownloadSampleTemplate = () => {
    const sampleContent = `# KỊCH BẢN TỪ KHÓA & PHẢN HỒI MẪU CHO LIVESTREAM AVA
# Hướng dẫn: Bạn có thể chỉnh sửa thêm bớt các câu hỏi và phản hồi tùy ý, sau đó bấm Tải Lên File để nạp vào hệ thống.

## 1. CHÀO HỎI & GIA NHẬP GAME
"chào", "xin chào", "hello", "hi", "hé lô", "chào ad", "chào em", "mới vào", "mới vô live"
“Chào mừng bạn đã đến với tinh thần yêu nước lấp đầy lãnh thổ Việt Nam! Bạn hãy ở lại cùng cắm cờ đỏ sao vàng nhé! 🇻🇳🔥”

## 2. HƯỚNG DẪN LUẬT CHƠI
"luật chơi", "chơi sao", "cách chơi", "hướng dẫn", "làm sao chơi", "cách tham gia"
“Luật chơi rất đơn giản! Bạn chỉ cần tương tác hoặc gửi quà 5 xu theo từng miền để cắm cờ phủ đỏ Tổ Quốc! 🇻🇳”

## 3. TẶNG QUÀ CẮM CỜ 3 MIỀN
"quà 5 xu", "cắm cờ miền bắc", "cắm cờ miền trung", "cắm cờ miền nam", "chọn miền"
“Bạn có thể chọn cắm cờ theo 3 vùng miền: Ngón Tay Tim cho Miền Bắc, Bánh Donut cho Miền Trung, Gấu Con cho Miền Nam nhé! 🇻🇳✨”
`;
    const blob = new Blob([sampleContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FILE_MAU_KICH_BAN_TU_KHOA_AVA.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Đã tải về file mẫu kịch bản chuẩn .md!');
  };

  // -------------------------------------------------------------
  // SIMULATOR RUNNER
  // -------------------------------------------------------------
  const handleRunSimulator = async () => {
    if (!testComment.trim()) return;
    setSimulatorStatus('🧠 Đang kết nối Bộ não AI Gemini & quét từ khóa...');
    setLastAiReply('');

    // Determine voice to play
    let targetVoice = assistantVoice;
    if (simSelectedVoiceRole === 'game') {
      targetVoice = gameVoice;
    } else if (simSelectedVoiceRole !== 'assistant') {
      const found = ALL_SYSTEM_VOICES.find(v => v.id === simSelectedVoiceRole);
      if (found) targetVoice = found;
    }

    try {
      const handled = await engine.handleUserComment(testComment.trim(), testUsername.trim() || 'Khán Giả');
      if (handled) {
        setSimulatorStatus('✅ Đã nhận diện từ khóa và kích hoạt phát Voice AI trực tiếp ra loa!');
      } else {
        setSimulatorStatus('⚡ Đang gọi trực tiếp Bộ Não AI Gemini 1.5 Flash...');
        const aiRes = await askGeminiLiveAi({
          question: testComment.trim(),
          username: testUsername.trim() || 'Khán Giả',
          role: simSelectedVoiceRole === 'game' ? 'game' : 'assistant',
          context: gameType === 'battle' ? 'Đại Chiến PK Phe Xanh vs Phe Đỏ' : 'Đại Chiến Cắm Cờ Tổ Quốc Việt Nam',
          gameType
        });
        if (aiRes?.text) {
          setLastAiReply(aiRes.text);
          const voiceWithParams = {
            ...targetVoice,
            volume: simVoiceVolume,
            rate: simVoiceRate
          };
          previewVoiceAudio(voiceWithParams, aiRes.text);
          setSimulatorStatus('✅ Bộ não Gemini AI đã phản hồi thông minh và phát giọng đọc trực tiếp!');
        }
      }
    } catch (e) {
      setSimulatorStatus('❌ Lỗi kết nối: ' + e.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus('Đã sao chép!');
    setTimeout(() => setCopiedStatus(''), 2000);
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
    <div className="space-y-4 relative">
      {/* Floating Save Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-xs shadow-2xl border border-emerald-300/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-white shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Banner & Executive Overview */}
      <div className="p-4 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-400/30">
              <Mic size={22} className="animate-pulse text-purple-300" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                Hệ Thống Voice AI Đa Vai Trò, Tải File Hàng Loạt & Bộ Não Gemini
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                  Gemini 1.5 Flash + ElevenLabs
                </span>
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                Tùy chỉnh Volume, Tốc độ (0.5x - 2.0x) • Upload file TXT/CSV/JSON tự động chia tách câu • Bắt từ khóa & Trả lời ngoài vùng 24/7.
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Toggle & Save Button */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          <button
            onClick={handleSaveAllConfigPermanently}
            title="Lưu vĩnh viễn toàn bộ cấu hình, kịch bản, giọng đọc vào máy (F5/Reload không mất)"
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Save size={14} /> 💾 LƯU TẤT CẢ CẤU HÌNH
          </button>

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
          { id: 'prompts', label: '📝 2. Câu Thoại & Tải File Kịch Bản (Auto-Split)', icon: MessageSquare, count: prompts.length },
          { id: 'keywords', label: '🎯 3. Bắt Từ Khóa & Tải File Phản Hồi', icon: Zap, count: keywordRules.length },
          { id: 'gemini', label: '🧠 4. Bộ Não AI Gemini & Simulator Thử Nghiệm', icon: Bot },
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

          {/* Voice Catalog Grid with 20+ Countries */}
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
                        ? 'bg-purple-600 text-white font-black shadow'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

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
                      <div className="flex items-center gap-1">
                        {isBLV && <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-black">🎙️ BLV</span>}
                        {isAssistant && <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500 text-white font-black">💼 TRỢ LÝ</span>}
                      </div>
                    </div>
                    <div className="text-sm font-black text-white">{v.name}</div>
                    <p className="text-[11px] text-gray-400 line-clamp-1 mb-2.5">{v.desc}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => handlePreviewVoice(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isPreviewing ? 'bg-amber-500 text-black font-black animate-pulse' : 'bg-white/10 hover:bg-white/20 text-gray-200'
                      }`}
                    >
                      {isPreviewing ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
                      <span>{isPreviewing ? 'Dừng' : 'Nghe Thử'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAssignVoice(v, 'game')}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                          isBLV ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-900/30 hover:bg-blue-600/60 text-blue-200 border border-blue-500/30'
                        }`}
                      >
                        {isBLV ? '✓ BLV' : '+ Gán BLV'}
                      </button>
                      <button
                        onClick={() => handleAssignVoice(v, 'assistant')}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                          isAssistant ? 'bg-pink-600 text-white shadow-md' : 'bg-pink-900/30 hover:bg-pink-600/60 text-pink-200 border border-pink-500/30'
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
      {/* SUB-TAB 2: CÂU THOẠI, KỊCH BẢN & TẢI FILE HÀNG LOẠT (AUTO-SPLIT) */}
      {/* ========================================================================= */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-4">
          {/* Header Action Bar: Add Single + Bulk Upload/Paste + Loop 24/7 + Clear All */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus size={14} className="text-purple-400" /> Thêm & Quản Lý Kịch Bản (Tự Động Chia Theo Dòng)
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {/* 24/7 Loop Toggle Button */}
                <button
                  onClick={() => {
                    const nextLoop = !isAutoLoop;
                    setIsAutoLoop(nextLoop);
                    syncToEngine({ isAutoLoop: nextLoop });
                    showToast(nextLoop ? '🔁 Đã BẬT chế độ lặp lại vô tận suốt live!' : '⏹️ Đã TẮT chế độ lặp lại vô tận!');
                  }}
                  title="Khi BẬT: AI sẽ tự động đọc lặp lại kịch bản liên tục đến khi tắt phiên live"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                    isAutoLoop
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-1 ring-emerald-400'
                      : 'bg-white/10 hover:bg-white/20 text-gray-400 border border-white/10'
                  }`}
                >
                  <RefreshCw size={13} className={isAutoLoop ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
                  {isAutoLoop ? '🔁 LẶP LẠI SUỐT LIVE: BẬT' : '⏹️ LẶP LẠI: TẮT'}
                </button>

                {/* Bulk Import Button */}
                <button
                  onClick={() => setShowBulkPromptModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Upload size={13} /> 📁 Tải Lên File (.MD, .PDF, .DOCX, .DOC, .TXT, .CSV, .JSON)
                </button>

                {/* Clear All Prompts Button */}
                {prompts.length > 0 && (
                  <button
                    onClick={handleClearAllPrompts}
                    title="Dọn sạch toàn bộ các câu thoại kịch bản hiện tại"
                    className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Trash2 size={13} /> 🗑️ XÓA TẤT CẢ ({prompts.length})
                  </button>
                )}

                <span className="text-xs text-gray-400 font-mono">
                  Tổng: <strong className="text-purple-300">{prompts.length}</strong> câu
                </span>
              </div>
            </div>

            {/* Quick Add Single Prompt Form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
                placeholder="Nhập nội dung câu nói hoặc dán nội dung kịch bản vào đây..."
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

          {/* Bulk Import Prompt Modal Supporting All Document Formats */}
          {showBulkPromptModal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/95 via-slate-900 to-indigo-950/95 border border-purple-500/50 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase">
                  <FileText size={15} /> 
                  Tải Lên File Đa Định Dạng / Dán Kịch Bản (Tự Động Chia Tách Theo Dòng)
                </div>
                <button onClick={() => setShowBulkPromptModal(false)} className="text-gray-400 hover:text-white text-xs">
                  ✕ Đóng
                </button>
              </div>

              {/* Supported formats badges */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                <span className="text-gray-400 font-bold">Hỗ trợ định dạng:</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">📄 .MD (Markdown)</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">📑 .PDF (Tài liệu)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">📘 .DOCX / .DOC (Word)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">📝 .TXT</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">📊 .CSV</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">🏷️ .JSON</span>
              </div>

              <textarea
                rows={6}
                value={bulkPromptText}
                onChange={(e) => setBulkPromptText(e.target.value)}
                placeholder="Dán hàng chục hoặc hàng trăm câu thoại vào đây (mỗi câu 1 dòng)...&#10;Hệ thống tự động trích xuất nội dung và sắp xếp theo thứ tự 1, 2, 3...&#10;Ví dụ:&#10;1. Đại chiến cắm cờ đang diễn ra cực kỳ sôi động!&#10;2. Chào mừng tất cả anh em vào xem live nhé!&#10;3. Mau thả tim để triệu hồi hào quang nào!"
                className="w-full p-3 bg-black/70 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-mono custom-scrollbar"
              />

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={promptFileInputRef}
                    accept=".txt,.csv,.json,.md,.pdf,.docx,.doc"
                    onChange={handleFileUploadPrompts}
                    className="hidden"
                  />
                  <button
                    onClick={() => promptFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Upload size={13} /> 📁 Chọn File (.md, .pdf, .docx, .doc, .txt, .csv, .json)
                  </button>

                  <select
                    value={bulkPromptRole}
                    onChange={(e) => setBulkPromptRole(e.target.value)}
                    className="px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-purple-300 font-bold focus:outline-none"
                  >
                    <option value="game">Gán cho: 🎙️ BLV Game</option>
                    <option value="assistant">Gán cho: 💼 Trợ Lý AI</option>
                  </select>
                </div>

                <button
                  onClick={() => handleBulkImportPrompts(bulkPromptText, bulkPromptRole)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Check size={14} /> Tự Động Chia Tách & Nạp Vào Kịch Bản
                </button>
              </div>
            </div>
          )}

          {/* Prompts List with Ordering & Spacious Dedicated Edit Card */}
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
            {prompts.map((p, idx) => {
              const isEditing = editingPromptId === (p.id || idx);

              if (isEditing) {
                return (
                  <div 
                    key={p.id || idx}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-2 border-purple-400 shadow-2xl space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 size={13} /> Chỉnh Sửa Câu Thoại #{idx + 1}
                      </span>
                      <span className="text-[10px] text-gray-400">Thay đổi có hiệu lực ngay khi bấm Lưu</span>
                    </div>

                    <textarea
                      rows={2}
                      value={editingPromptText}
                      onChange={(e) => setEditingPromptText(e.target.value)}
                      placeholder="Nội dung câu nói..."
                      className="w-full p-2.5 bg-black/80 border border-purple-400/60 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-300 font-medium"
                    />

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 font-bold">Vai trò:</span>
                        <select
                          value={editingPromptRole}
                          onChange={(e) => setEditingPromptRole(e.target.value)}
                          className="px-3 py-1.5 bg-black/80 border border-purple-400/50 rounded-xl text-xs text-purple-300 font-bold focus:outline-none"
                        >
                          <option value="game">🎙️ BLV Game</option>
                          <option value="assistant">💼 Trợ Lý AI</option>
                        </select>
                        <button
                          onClick={() => engine.speak(editingPromptText, editingPromptRole, true)}
                          className="px-3 py-1.5 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1"
                          title="Nghe thử câu vừa chỉnh sửa"
                        >
                          <Volume2 size={12} /> Nghe Thử Câu Này
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPromptId(null);
                            setEditingPromptText('');
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-bold"
                        >
                          ✕ Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEditPrompt(p.id || idx)}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
                        >
                          <Check size={14} /> ✓ Lưu Thay Đổi Ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={p.id || idx}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    p.enabled !== false 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-black/20 border-white/5 opacity-50'
                  }`}
                >
                  {/* Order controls & Badge */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => handleMovePrompt(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded bg-white/5 hover:bg-white/20 text-gray-300 disabled:opacity-20 text-[10px]"
                        title="Di chuyển lên trên"
                      >
                        <ArrowUp size={10} />
                      </button>
                      <button
                        onClick={() => handleMovePrompt(idx, 1)}
                        disabled={idx === prompts.length - 1}
                        className="p-1 rounded bg-white/5 hover:bg-white/20 text-gray-300 disabled:opacity-20 text-[10px]"
                        title="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={10} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleTogglePrompt(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        p.enabled !== false ? 'bg-purple-600 text-white shadow' : 'bg-white/10 text-gray-500'
                      }`}
                      title="Bấm để Bật/Tắt câu này"
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
                      title="Bấm để đổi vai trò giọng đọc"
                    >
                      {p.role === 'assistant' ? '💼 Trợ Lý' : '🎙️ BLV Game'}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-200 font-medium truncate block">
                      "{p.text}"
                    </span>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => copyToClipboard(p.text)}
                      className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/15"
                      title="Sao chép câu này"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingPromptId(p.id || idx);
                        setEditingPromptText(p.text);
                        setEditingPromptRole(p.role || 'game');
                      }}
                      className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 transition-all font-bold text-xs flex items-center gap-1"
                      title="Sửa trực tiếp câu này"
                    >
                      <Edit3 size={12} /> Sửa
                    </button>
                    <button
                      onClick={() => engine.speak(p.text, p.role || 'game', true)}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 transition-all"
                      title="Nghe thử câu này"
                    >
                      <Play size={12} className="fill-current" />
                    </button>
                    <button
                      onClick={() => handleRemovePrompt(idx)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-all"
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
      {/* SUB-TAB 3: TỪ KHÓA, PHẢN HỒI REAL-TIME, GIỌNG TRỢ LÝ & TẢI FILE ĐA DẠNG */}
      {/* ========================================================================= */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-4">
          {/* Top Assistant Voice & Real-time Delay Config Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-orange-950/70 border border-amber-500/40 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400" /> Bắt Từ Khóa Real-time & Phản Hồi Tức Thì
                </h4>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Tùy chỉnh Giọng Trợ Lý • Thiết lập độ trễ (0s - Tức thì) • Tải file .md, .pdf, .docx, .txt, .csv, .json
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSaveAllConfigPermanently}
                  title="Lưu vĩnh viễn toàn bộ kịch bản và cài đặt hiện tại vào máy (F5/Reload không mất)"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                  <Save size={13} /> 💾 LƯU KỊCH BẢN VĨNH VIỄN
                </button>
                <button
                  onClick={() => setShowBulkRuleModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Upload size={13} /> 📁 Tải Lên / Dán File Kịch Bản
                </button>
                <button
                  onClick={handleDownloadSampleTemplate}
                  title="Tải về file mẫu .md chuẩn để chỉnh sửa trên máy tính"
                  className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download size={13} /> 📥 Tải File Mẫu (.md)
                </button>
                {keywordRules.length > 0 && (
                  <>
                    <button
                      onClick={() => handleExportRules('md')}
                      title="Xuất danh sách kịch bản hiện tại ra file .md"
                      className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Download size={13} /> 📤 Xuất File (.md)
                    </button>
                    <button
                      onClick={handleClearAllKeywordRules}
                      title="Dọn sạch toàn bộ các quy tắc từ khóa hiện tại"
                      className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600 border border-red-500/40 hover:border-red-500 text-red-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Trash2 size={13} /> 🗑️ XÓA TẤT CẢ ({keywordRules.length})
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    const updated = !isKeywordAutoReplyEnabled;
                    setIsKeywordAutoReplyEnabled(updated);
                    syncToEngine({ isKeywordAutoReplyEnabled: updated });
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isKeywordAutoReplyEnabled 
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' 
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isKeywordAutoReplyEnabled ? '● PHẢN HỒI: ĐANG BẬT' : '○ PHẢN HỒI: ĐÃ TẮT'}
                </button>
              </div>
            </div>

            {/* Global Assistant Voice & Response Time Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
              {/* Voice Picker for Assistant */}
              <div>
                <label className="text-[11px] text-gray-300 font-bold block mb-1">
                  💼 Giọng Đọc Trợ Lý AI:
                </label>
                <select
                  value={assistantVoice?.id || 'free_vi_female'}
                  onChange={(e) => {
                    const found = ALL_SYSTEM_VOICES.find(v => v.id === e.target.value);
                    if (found) {
                      handleAssignVoice(found, 'assistant');
                    }
                  }}
                  className="w-full px-2.5 py-1.5 bg-black/80 border border-amber-400/40 rounded-xl text-xs text-amber-300 font-bold focus:outline-none"
                >
                  <optgroup label="── Giọng Tiếng Việt ──">
                    {ALL_SYSTEM_VOICES.filter(v => v.lang?.startsWith('vi') || v.id.includes('_vi_')).map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.provider})</option>
                    ))}
                  </optgroup>
                  <optgroup label="── 20+ Quốc Gia & Giọng Đọc Khác ──">
                    {ALL_SYSTEM_VOICES.filter(v => !v.lang?.startsWith('vi') && !v.id.includes('_vi_')).map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.lang})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Response Delay Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-gray-300 font-bold mb-1">
                  <span>⏱️ Thời Gian Phản Hồi (Delay):</span>
                  <span className="font-mono text-amber-400 font-black">
                    {responseDelaySec === 0 ? '0s (Tức thì / Real-time)' : `${responseDelaySec.toFixed(1)}s`}
                  </span>
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
                  className="w-full accent-amber-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>

              {/* Gemini AI Auto Reply Toggle */}
              <div className="flex flex-col justify-center">
                <span className="text-[11px] text-gray-300 font-bold mb-1">🧠 Bộ Não AI Gemini:</span>
                <button
                  onClick={() => {
                    const updated = !useGeminiAI;
                    setUseGeminiAI(updated);
                    syncToEngine({ useGeminiAI: updated });
                  }}
                  className={`w-full py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    useGeminiAI 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  <Bot size={13} />
                  {useGeminiAI ? 'Bộ Não AI: ĐANG BẬT' : 'Bộ Não AI: TẮT'}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Synchronize 1 Voice to ALL Rules Section */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30">
                <Wand2 size={18} className="text-purple-300 animate-pulse" />
              </span>
              <div>
                <h5 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  ⚡ Đồng Bộ 1 Giọng Cho Toàn Bộ ({keywordRules.length}) Quy Tắc
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-normal">
                    1-Click Sync All
                  </span>
                </h5>
                <p className="text-[11px] text-gray-300 mt-0.5">
                  Chọn 1 giọng bên dưới và bấm áp dụng — toàn bộ các ô quy tắc sẽ được đổi sang giọng này cùng lúc!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
              <select
                value={syncAllVoiceChoice}
                onChange={(e) => setSyncAllVoiceChoice(e.target.value)}
                className="px-3 py-2 bg-black/80 border border-purple-400/50 rounded-xl text-xs text-purple-200 font-bold focus:outline-none focus:border-purple-400 flex-1 md:w-64"
              >
                <optgroup label="── Vai Trò Mặc Định ──">
                  <option value="assistant">💼 Giọng Trợ Lý AI ({assistantVoice?.name || 'Mặc định'})</option>
                  <option value="game">🎙️ Giọng Bình Luận Viên Game ({gameVoice?.name || 'Mặc định'})</option>
                </optgroup>
                <optgroup label="── Giọng Tiếng Việt ──">
                  {ALL_SYSTEM_VOICES.filter(v => v.lang?.startsWith('vi') || v.id.includes('_vi_')).map(v => (
                    <option key={v.id} value={v.id}>🔊 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.provider})</option>
                  ))}
                </optgroup>
                <optgroup label="── Giọng Quốc Tế ──">
                  {ALL_SYSTEM_VOICES.filter(v => !v.lang?.startsWith('vi') && !v.id.includes('_vi_')).map(v => (
                    <option key={v.id} value={v.id}>🌐 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.lang})</option>
                  ))}
                </optgroup>
              </select>

              <button
                onClick={() => handleSyncVoiceToAllRules(syncAllVoiceChoice)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30 shrink-0 transition-all active:scale-95"
              >
                <Sparkles size={14} /> ✨ ÁP DỤNG CHO TẤT CẢ ({keywordRules.length})
              </button>
            </div>
          </div>

          {/* Bulk Import Rules Modal */}
          {showBulkRuleModal && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/95 via-slate-900 to-orange-950/95 border border-amber-500/50 shadow-2xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase">
                  <FileText size={15} /> 
                  Tải Lên File / Dán Danh Sách Từ Khóa & Phản Hồi Hàng Loạt
                </div>
                <button onClick={() => setShowBulkRuleModal(false)} className="text-gray-400 hover:text-white text-xs">
                  ✕ Đóng
                </button>
              </div>

              {/* Formats badges */}
              <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                <span className="text-gray-400 font-bold">Hỗ trợ:</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">📄 .MD</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">📑 .PDF</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">📘 .DOCX / .DOC</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">📝 .TXT</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">📊 .CSV</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">🏷️ .JSON</span>
              </div>

              <textarea
                rows={6}
                value={bulkRuleText}
                onChange={(e) => setBulkRuleText(e.target.value)}
                placeholder="Định dạng mỗi dòng: Từ khóa 1, từ khóa 2: Câu phản hồi&#10;Ví dụ:&#10;chào, hi, hello: Dạ em chào [user] đã đến với livestream nha!&#10;luật chơi, hướng dẫn: Luật chơi là bạn thả tim và cắm cờ để phủ đỏ bản đồ!&#10;xanh, phe xanh: Chiến binh [user] vừa tiếp lửa cho Phe Xanh!"
                className="w-full p-3 bg-black/70 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono custom-scrollbar"
              />

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <input
                  type="file"
                  ref={ruleFileInputRef}
                  accept=".txt,.csv,.json,.md,.pdf,.docx,.doc"
                  onChange={handleFileUploadRules}
                  className="hidden"
                />
                <button
                  onClick={() => ruleFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/40 text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Upload size={13} /> 📁 Chọn File (.md, .pdf, .docx, .doc, .txt, .csv, .json)
                </button>

                <button
                  onClick={() => handleBulkImportRules(bulkRuleText)}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Check size={14} /> Tự Động Chia Tách & Nạp Quy Tắc
                </button>
              </div>
            </div>
          )}

          {/* Add New Keyword Rule Form */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Plus size={14} className="text-amber-400" /> Thêm Bộ Từ Khóa & Câu Trả Lời Thủ Công
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
                {ALL_SYSTEM_VOICES.map(v => (
                  <option key={v.id} value={v.id}>🔊 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'})</option>
                ))}
              </select>
              <button
                onClick={handleAddKeywordRule}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all"
              >
                <Plus size={14} /> Thêm Rule
              </button>
            </div>
          </div>

          {/* Keyword Rules List with Ordering & Dedicated Edit Card */}
          <div className="space-y-2.5 max-h-[48vh] overflow-y-auto custom-scrollbar pr-1">
            {keywordRules.map((rule, idx) => {
              const isEditing = editingRuleId === (rule.id || idx);

              if (isEditing && editingRuleData) {
                return (
                  <div 
                    key={rule.id || idx}
                    className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-orange-950/90 border-2 border-amber-400 shadow-2xl space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 size={13} /> Chỉnh Sửa Quy Tắc #{idx + 1}
                      </span>
                      <span className="text-[10px] text-gray-400">Áp dụng real-time ngay khi bấm Lưu</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-300 font-bold block mb-1">Tên bộ quy tắc:</label>
                        <input
                          type="text"
                          value={editingRuleData.name}
                          onChange={(e) => setEditingRuleData({ ...editingRuleData, name: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black/80 border border-white/20 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-300 font-bold block mb-1">Từ khóa (cách nhau bằng dấu phẩy):</label>
                        <input
                          type="text"
                          value={editingRuleData.keywords}
                          onChange={(e) => setEditingRuleData({ ...editingRuleData, keywords: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black/80 border border-white/20 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-300 font-bold block mb-1">Câu thoại phản hồi (Hỗ trợ [user]):</label>
                      <textarea
                        rows={2}
                        value={editingRuleData.replyText}
                        onChange={(e) => setEditingRuleData({ ...editingRuleData, replyText: e.target.value })}
                        className="w-full p-2.5 bg-black/80 border border-white/20 rounded-xl text-xs text-white font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-300 font-bold block mb-1">Giọng đọc riêng cho câu này:</label>
                        <select
                          value={editingRuleData.role}
                          onChange={(e) => setEditingRuleData({ ...editingRuleData, role: e.target.value, voiceId: e.target.value !== 'assistant' && e.target.value !== 'game' ? e.target.value : undefined })}
                          className="w-full px-3 py-1.5 bg-black/80 border border-white/20 rounded-xl text-xs text-amber-300 font-bold"
                        >
                          <option value="assistant">💼 Giọng Trợ Lý Mặc Định</option>
                          <option value="game">🎙️ Giọng BLV Game</option>
                          {ALL_SYSTEM_VOICES.map(v => (
                            <option key={v.id} value={v.id}>🔊 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-300 font-bold block mb-1">Thời gian chờ lặp lại (Cooldown):</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={editingRuleData.cooldownSec || 4}
                          onChange={(e) => setEditingRuleData({ ...editingRuleData, cooldownSec: Number(e.target.value) })}
                          className="w-full px-3 py-1.5 bg-black/80 border border-white/20 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => engine.speak(editingRuleData.replyText.replace(/\[user\]/gi, 'Khán Giả VIP'), editingRuleData.role || 'assistant', true)}
                        className="px-3.5 py-1.5 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/40 text-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Volume2 size={13} /> Nghe Thử Phản Hồi Này
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingRuleId(null);
                            setEditingRuleData(null);
                          }}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-bold"
                        >
                          ✕ Hủy
                        </button>
                        <button
                          onClick={() => handleSaveEditRule(rule.id || idx)}
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
                        >
                          <Check size={14} /> ✓ Lưu Thay Đổi Ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveKeywordRule(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-white/5 hover:bg-white/20 text-gray-300 disabled:opacity-20 text-[10px]"
                          title="Di chuyển lên"
                        >
                          <ArrowUp size={10} />
                        </button>
                        <button
                          onClick={() => handleMoveKeywordRule(idx, 1)}
                          disabled={idx === keywordRules.length - 1}
                          className="p-1 rounded bg-white/5 hover:bg-white/20 text-gray-300 disabled:opacity-20 text-[10px]"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown size={10} />
                        </button>
                      </div>

                      <span className="text-xs font-black text-white">{idx + 1}. {rule.name}</span>
                      {(() => {
                        let voiceLabel = rule.role === 'assistant' ? '💼 Giọng Trợ Lý' : '🎙️ BLV Game';
                        if (rule.voiceId) {
                          const v = ALL_SYSTEM_VOICES.find(x => x.id === rule.voiceId || x.voiceId === rule.voiceId);
                          if (v) voiceLabel = `🔊 ${v.name}`;
                        } else if (typeof rule.role === 'string' && rule.role !== 'assistant' && rule.role !== 'game') {
                          const v = ALL_SYSTEM_VOICES.find(x => x.id === rule.role);
                          if (v) voiceLabel = `🔊 ${v.name}`;
                        }
                        return (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            rule.role === 'assistant' 
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {voiceLabel}
                          </span>
                        );
                      })()}
                      <span className="text-[10px] text-gray-400 font-mono">
                        Cooldown: {rule.cooldownSec || 4}s
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(`${rule.keywords.join(', ')}: ${rule.replyText}`)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/15"
                        title="Sao chép quy tắc này"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRuleId(rule.id || idx);
                          setEditingRuleData({
                            name: rule.name,
                            keywords: Array.isArray(rule.keywords) ? rule.keywords.join(', ') : rule.keywords,
                            replyText: rule.replyText,
                            role: rule.role || 'assistant',
                            voiceId: rule.voiceId,
                            cooldownSec: rule.cooldownSec || 4
                          });
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/40 font-bold text-xs flex items-center gap-1"
                        title="Sửa trực tiếp quy tắc này"
                      >
                        <Edit3 size={12} /> Sửa
                      </button>
                      <button
                        onClick={() => handleToggleKeywordRule(idx)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                          rule.enabled !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-500'
                        }`}
                      >
                        {rule.enabled !== false ? 'BẬT' : 'TẮT'}
                      </button>
                      <button
                        onClick={() => handlePlayRuleAudio(rule, idx)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                          playingRuleId === (rule.id || idx)
                            ? 'bg-purple-600 text-white animate-pulse shadow-md shadow-purple-600/50'
                            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/40'
                        }`}
                        title={playingRuleId === (rule.id || idx) ? 'Dừng phát âm thanh' : 'Nghe thử câu thoại này với đúng giọng đã gán'}
                      >
                        {playingRuleId === (rule.id || idx) ? (
                          <>
                            <Square size={11} className="fill-current text-white" />
                            <span>DỪNG</span>
                          </>
                        ) : (
                          <>
                            <Play size={11} className="fill-current" />
                            <span>NGHE THỬ</span>
                          </>
                        )}
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
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: BỘ NÃO AI GEMINI & SIMULATOR THỬ NGHIỆM TÙY CHỌN GIỌNG ĐỌC */}
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
          </div>

          {/* Live Comment Simulator With Voice Selector, Volume, Speed Controls */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" />
                ⚡ Thử Nghiệm Bắn Câu Hỏi Bất Kỳ Để Nghe AI Trả Lời Trực Tiếp
              </h4>

              {/* Voice Selector for Simulator */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-300 font-bold">Giọng AI Trả Lời:</span>
                <select
                  value={simSelectedVoiceRole}
                  onChange={(e) => setSimSelectedVoiceRole(e.target.value)}
                  className="px-2.5 py-1 bg-black/80 border border-yellow-400/40 rounded-lg text-xs text-yellow-300 font-bold focus:outline-none"
                >
                  <option value="assistant">💼 Giọng Trợ Lý ({assistantVoice?.name || 'Nữ'})</option>
                  <option value="game">🎙️ Giọng BLV Game ({gameVoice?.name || 'Nam'})</option>
                  <optgroup label="── 20+ Quốc Gia & Giọng Đọc Khác ──">
                    {ALL_SYSTEM_VOICES.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'} • {v.lang})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Volume & Speed Sliders for Simulator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span className="flex items-center gap-1"><Volume2 size={12} className="text-purple-400" /> Âm Lượng Phát:</span>
                  <span className="font-mono text-purple-300 font-black">{Math.round(simVoiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={simVoiceVolume}
                  onChange={(e) => setSimVoiceVolume(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span className="flex items-center gap-1"><Sliders size={12} className="text-yellow-400" /> Tốc Độ Đọc (Speed):</span>
                  <span className="font-mono text-yellow-300 font-black">{simVoiceRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={simVoiceRate}
                  onChange={(e) => setSimVoiceRate(parseFloat(e.target.value))}
                  className="w-full accent-yellow-500 h-1.5 bg-white/10 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Input fields */}
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
                placeholder="Nhập câu hỏi bất kỳ (VD: 'Bạn là ai hay người?', 'Bản đồ cắm cờ thế nào?', 'Shop bán gì?')..."
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
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
              <Clock size={15} className="text-yellow-400" />
              1. Chu Kỳ Tự Động Phát Bình Luận (Timer Interval)
            </h4>
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
                      ? 'bg-purple-600 text-white font-black shadow-lg ring-1 ring-purple-400' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                  }`}
                >
                  {sec}s {sec === 15 ? '⭐ Chuẩn' : ''}
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-200 mb-1.5">
                <span>Tùy chỉnh số giây:</span>
                <span className="font-mono text-purple-400 font-black text-sm">{intervalSeconds} Giây / lần</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-pink-400" />
                3. Độ Trễ Phản Hồi Từ Khóa
              </h4>
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

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                4. Giãn Cách Trả Lời Bình Luận (Cooldown Throttle)
              </h4>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-200 mb-1.5">
                  <span>Giãn cách giữa 2 câu trả lời:</span>
                  <span className="font-mono text-cyan-400 font-black">{replyCooldownSec} Giây</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={replyCooldownSec}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setReplyCooldownSec(val);
                    syncToEngine({ replyCooldownSec: val });
                  }}
                  className="w-full accent-cyan-500 h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Lặp lại vô tận suốt phiên Live */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw size={14} className="text-emerald-400" />
                  4. Chế Độ Lặp Lại Vô Tận Suốt Phiên Live (24/7 Loop)
                </h4>
                <p className="text-[11px] text-gray-300">
                  Khi bật, AI sẽ tự động đọc lặp tuần hoàn toàn bộ kịch bản liên tục đến khi tắt live, không bao giờ dừng lại.
                </p>
              </div>

              <button
                onClick={() => {
                  const nextLoop = !isAutoLoop;
                  setIsAutoLoop(nextLoop);
                  syncToEngine({ isAutoLoop: nextLoop });
                  showToast(nextLoop ? '🔁 Đã BẬT chế độ lặp lại vô tận!' : '⏹️ Đã TẮT chế độ lặp lại vô tận!');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg ${
                  isAutoLoop
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30 ring-2 ring-emerald-400'
                    : 'bg-white/10 hover:bg-white/20 text-gray-400'
                }`}
              >
                <RefreshCw size={13} className={isAutoLoop ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
                {isAutoLoop ? '● LẶP LẠI 24/7: ĐANG BẬT' : '○ LẶP LẠI 24/7: ĐÃ TẮT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
