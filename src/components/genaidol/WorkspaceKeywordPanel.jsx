import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, Check, MessageSquare, Zap,
  Upload, FileText, ArrowUp, ArrowDown, Copy, Download,
  Volume2, Play, Square, Sparkles, CheckCircle2, Globe, Clock, Bot
} from 'lucide-react';
import { readUniversalFile, parseUniversalRulePairs } from '../../utils/universalDocumentParser';
import { ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio } from '../../utils/voiceSyncService';

export default function WorkspaceKeywordPanel({ currentConfig, onUpdateConfig }) {
  const [activeTab, setActiveTab] = useState('keywords'); // 'keywords' | 'prompts'
  
  // States
  const prompts = currentConfig.prompts || [];
  const keywordRules = currentConfig.keywordRules || [];

  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptRole, setNewPromptRole] = useState('idol');
  const [editingPromptId, setEditingPromptId] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  const [editingPromptRole, setEditingPromptRole] = useState('idol');

  // Form & Editing states for Keyword Rules
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');
  const [newRuleRole, setNewRuleRole] = useState('assistant');
  const [newRuleCooldown, setNewRuleCooldown] = useState(5);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleData, setEditingRuleData] = useState(null);

  const [showBulkPromptModal, setShowBulkPromptModal] = useState(false);
  const [bulkPromptText, setBulkPromptText] = useState('');
  const [bulkPromptRole, setBulkPromptRole] = useState('idol');
  const promptFileInputRef = useRef(null);

  const [showBulkRuleModal, setShowBulkRuleModal] = useState(false);
  const [bulkRuleText, setBulkRuleText] = useState('');
  const ruleFileInputRef = useRef(null);

  const [previewingRuleId, setPreviewingRuleId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const syncConfig = (partial) => {
    onUpdateConfig(partial);
  };

  // Helper function to play audio preview for a rule
  const handlePreviewRuleAudio = (rule, idx) => {
    const ruleKey = rule.id || idx;
    if (previewingRuleId === ruleKey) {
      stopVoiceAudio();
      setPreviewingRuleId(null);
      return;
    }

    setPreviewingRuleId(ruleKey);
    const sampleText = (rule.replyText || '').replace(/\[user\]|\{user\}/gi, 'Quốc Thiện');
    const role = rule.role || 'assistant';
    
    // Find voice object if assigned
    const targetVoice = ALL_SYSTEM_VOICES.find(v => v.id === role || v.id === rule.voiceId) || ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'assistant' || v.id === 'el_callum' || v.id === 'free_vi_female');

    previewVoiceAudio(
      targetVoice || { id: 'free_vi_female', lang: 'vi-VN', provider: 'system', gender: 'Female' },
      sampleText,
      () => {
        setPreviewingRuleId(null);
      },
      true
    );
  };

  const copyToClipboard = (text, id) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  // Prompts Handlers
  const handleAddPrompt = () => {
    if (!newPromptText.trim()) return;
    const item = { id: 'p_' + Date.now(), text: newPromptText.trim(), role: newPromptRole, enabled: true };
    syncConfig({ prompts: [item, ...prompts] });
    setNewPromptText('');
  };

  const handleSaveEditPrompt = (id) => {
    if (!editingPromptText.trim()) return;
    const updated = prompts.map(p => p.id === id ? { ...p, text: editingPromptText.trim(), role: editingPromptRole } : p);
    syncConfig({ prompts: updated });
    setEditingPromptId(null);
    setEditingPromptText('');
  };

  const handleMovePrompt = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= prompts.length) return;
    const updated = [...prompts];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    syncConfig({ prompts: updated });
  };

  const handleRemovePrompt = (idx) => {
    syncConfig({ prompts: prompts.filter((_, i) => i !== idx) });
  };

  const handleBulkImportPrompts = (rawText, defaultRole = 'idol') => {
    if (!rawText || !rawText.trim()) return;
    const lines = rawText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 2);
    if (lines.length === 0) return;
    const newItems = lines.map((line, idx) => {
      const cleaned = line.replace(/^(\d+[\.\/\:\-\)]\s*|[\-\*\•\#\>\~]\s*)/, '').trim();
      let role = defaultRole;
      if (cleaned.toLowerCase().startsWith('[trợ lý]') || cleaned.toLowerCase().startsWith('[assistant]')) role = 'assistant';
      else if (cleaned.toLowerCase().startsWith('[blv]') || cleaned.toLowerCase().startsWith('[game]')) role = 'game';
      else if (cleaned.toLowerCase().startsWith('[idol]')) role = 'idol';
      return { id: 'p_' + (Date.now() + idx), text: cleaned.replace(/^\[(trợ lý|assistant|blv|game|idol)\]\s*/i, ''), role, enabled: true };
    });
    syncConfig({ prompts: [...newItems, ...prompts] });
    setShowBulkPromptModal(false);
    setBulkPromptText('');
    alert(`Đã nạp thành công ${newItems.length} câu thoại kịch bản!`);
  };

  const handleFileUploadPrompts = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const lines = await readUniversalFile(file);
      if (lines && lines.length > 0) handleBulkImportPrompts(lines.join('\n'), bulkPromptRole);
      else alert(`Không tìm thấy nội dung văn bản trong file ${file.name}`);
    } catch (err) {
      alert(`Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  // Rules Handlers
  const handleAddKeywordRule = () => {
    if (!newRuleKeywords.trim() || !newRuleReply.trim()) return;
    const kwList = newRuleKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const item = {
      id: 'k_' + Date.now(),
      name: newRuleName.trim() || kwList[0] || `Bộ từ khóa ${keywordRules.length + 1}`,
      keywords: kwList,
      replyText: newRuleReply.trim(),
      role: newRuleRole,
      cooldownSec: Number(newRuleCooldown) || 5,
      enabled: true
    };
    syncConfig({ keywordRules: [item, ...keywordRules] });
    setNewRuleName(''); 
    setNewRuleKeywords(''); 
    setNewRuleReply('');
  };

  const handleToggleRule = (idx) => {
    const updated = keywordRules.map((r, i) => i === idx ? { ...r, enabled: r.enabled === false ? true : false } : r);
    syncConfig({ keywordRules: updated });
  };

  const handleSaveEditRule = (id) => {
    if (!editingRuleData) return;
    const updated = keywordRules.map(r => r.id === id ? {
      ...r,
      name: editingRuleData.name,
      keywords: typeof editingRuleData.keywords === 'string' 
        ? editingRuleData.keywords.split(',').map(s => s.trim()).filter(Boolean) 
        : editingRuleData.keywords,
      replyText: editingRuleData.replyText,
      role: editingRuleData.role,
      cooldownSec: Number(editingRuleData.cooldownSec) || 5
    } : r);
    syncConfig({ keywordRules: updated });
    setEditingRuleId(null);
    setEditingRuleData(null);
  };

  const handleMoveKeywordRule = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= keywordRules.length) return;
    const updated = [...keywordRules];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    syncConfig({ keywordRules: updated });
  };

  const handleRemoveKeywordRule = (idx) => {
    syncConfig({ keywordRules: keywordRules.filter((_, i) => i !== idx) });
  };

  const handleBulkImportRules = (rawInput) => {
    if (!rawInput) return;
    const newRules = parseUniversalRulePairs(rawInput);
    if (!newRules || newRules.length === 0) {
      alert('Không tìm thấy quy tắc hợp lệ trong văn bản hoặc file. Hãy nhập theo định dạng: "từ khóa 1, từ khóa 2: câu trả lời"');
      return;
    }
    syncConfig({ keywordRules: [...newRules, ...keywordRules] });
    setShowBulkRuleModal(false);
    setBulkRuleText('');
    alert(`Đã nạp thành công ${newRules.length} quy tắc từ khóa!`);
  };

  const handleFileUploadRules = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const raw = await readUniversalFile(file);
      if (raw) handleBulkImportRules(raw);
      else alert(`Không tìm thấy nội dung văn bản trong file ${file.name}`);
    } catch (err) {
      alert(`Lỗi đọc file: ${err.message}`);
    }
    e.target.value = '';
  };

  return (
    <div className="mt-4 p-4 rounded-2xl border border-gray-800 bg-[#0f1117] text-gray-100 space-y-4 shadow-xl">
      {/* TAB SELECTOR HEADER */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'keywords' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20 scale-105' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Zap size={15} className={activeTab === 'keywords' ? 'text-black' : 'text-amber-400'} /> 
            🎯 TỪ KHÓA & TRẢ LỜI TỰ ĐỘNG ({keywordRules.length})
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'prompts' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 scale-105' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MessageSquare size={15} className={activeTab === 'prompts' ? 'text-white' : 'text-purple-400'} /> 
            📝 KỊCH BẢN ĐỌC LIÊN TỤC ({prompts.length})
          </button>
        </div>

        {activeTab === 'keywords' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowBulkRuleModal(true)} 
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Upload size={13} /> 📁 Tải File Từ Khóa
            </button>
            {keywordRules.length > 0 && (
              <button 
                onClick={() => { if (window.confirm(`Anh có chắc muốn xóa sạch toàn bộ ${keywordRules.length} quy tắc không?`)) syncConfig({ keywordRules: [] }); }} 
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 size={13} /> Xóa Tất Cả
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TỪ KHÓA & TRẢ LỜI TỰ ĐỘNG (CHUẨN THIẾT KẾ ẢNH 4) */}
      {/* ========================================================================= */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          
          {/* Form Thêm Bộ Từ Khóa Thủ Công */}
          <div className="p-4 rounded-2xl bg-[#161922] border border-amber-500/30 space-y-3 shadow-md">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Plus size={15} className="text-amber-400" /> THÊM BỘ TỪ KHÓA & CÂU TRẢ LỜI THỦ CÔNG
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input 
                type="text" 
                value={newRuleName} 
                onChange={(e) => setNewRuleName(e.target.value)} 
                placeholder="Tên bộ quy tắc (VD: Chào hỏi & Gia nhập)..." 
                className="px-3 py-2 bg-black/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400" 
              />
              <input 
                type="text" 
                value={newRuleKeywords} 
                onChange={(e) => setNewRuleKeywords(e.target.value)} 
                placeholder="Từ khóa (cách nhau bằng dấu phẩy: chào, hi, xin chào, hello)..." 
                className="px-3 py-2 bg-black/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 sm:col-span-2" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input 
                type="text" 
                value={newRuleReply} 
                onChange={(e) => setNewRuleReply(e.target.value)} 
                placeholder="Nội dung câu trả lời (Hỗ trợ biến [user] để gọi tên người xem)..." 
                className="px-3 py-2 bg-black/70 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 sm:col-span-6" 
              />
              
              <select 
                value={newRuleRole} 
                onChange={(e) => setNewRuleRole(e.target.value)} 
                className="px-3 py-2 bg-black/80 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-bold focus:outline-none sm:col-span-3 cursor-pointer"
              >
                <option value="idol">🎤 Giọng Idol Chính</option>
                <option value="assistant">💼 Giọng Trợ Lý</option>
                <option value="game">🎮 Giọng BLV Game</option>
                {ALL_SYSTEM_VOICES.map(v => (
                  <option key={v.id} value={v.id}>🔊 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'})</option>
                ))}
              </select>

              <button 
                onClick={handleAddKeywordRule} 
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 sm:col-span-3 transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} /> Thêm Rule
              </button>
            </div>
          </div>

          {/* Modal Tải Lên / Dán Bộ Từ Khóa Đa Định Dạng */}
          {showBulkRuleModal && (
            <div className="p-4 rounded-2xl bg-[#161922] border border-amber-500/40 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase">
                  <FileText size={15} /> 
                  Tải Lên File / Dán Danh Sách Từ Khóa & Phản Hồi Đa Định Dạng
                </div>
                <button onClick={() => setShowBulkRuleModal(false)} className="text-gray-400 hover:text-white text-xs cursor-pointer">
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
                placeholder="Định dạng mỗi dòng: Từ khóa 1, từ khóa 2: Câu phản hồi&#10;Ví dụ:&#10;chào, hi, hello, xin chào: Dạ em chào bạn [user] đã đến xem livestream rực rỡ hôm nay nhé!&#10;giá, bao nhiêu, tư vấn: Dạ sản phẩm đang có giá cực sốc trong giỏ hàng góc trái, [user] bấm vào đặt ngay nha!&#10;luật chơi, hướng dẫn: Luật chơi rất đơn giản: Bạn bình luận và thả tim để phủ đỏ bản đồ nhé!" 
                className="w-full p-3 bg-black/80 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono" 
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
                  className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload size={13} /> 📁 Chọn File (.md, .pdf, .docx, .doc, .txt, .csv, .json)
                </button>

                <button 
                  onClick={() => handleBulkImportRules(bulkRuleText)} 
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  <Check size={14} /> Tự Động Chia Tách & Nạp Quy Tắc
                </button>
              </div>
            </div>
          )}

          {/* Danh Sách Thẻ Quy Tắc (Chuẩn Phong Cách Ảnh 4) */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {keywordRules.length === 0 ? (
              <div className="p-8 text-center bg-[#161922] border border-dashed border-gray-700 rounded-2xl">
                <Zap size={32} className="mx-auto text-amber-400/50 mb-2" />
                <p className="text-sm font-bold text-gray-300">Chưa có bộ từ khóa nào</p>
                <p className="text-xs text-gray-500 mt-1">Hãy thêm bộ từ khóa thủ công hoặc bấm "Tải File Từ Khóa" để nạp hàng loạt kịch bản có sẵn.</p>
              </div>
            ) : (
              keywordRules.map((rule, idx) => {
                const isEditing = editingRuleId === (rule.id || idx);
                const isPreviewing = previewingRuleId === (rule.id || idx);
                const roleLabel = rule.role === 'idol' ? '🎤 Giọng Idol Chính' : rule.role === 'game' ? '🎮 Giọng BLV Game' : '💼 Giọng Trợ Lý';
                const roleBadgeClass = rule.role === 'idol' 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                  : rule.role === 'game' 
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
                    : 'bg-pink-500/20 text-pink-300 border-pink-500/30';

                // Trình chỉnh sửa In-place khi bấm nút "Sửa"
                if (isEditing && editingRuleData) {
                  return (
                    <div 
                      key={rule.id || idx} 
                      className="p-4 rounded-2xl bg-[#1a1d27] border-2 border-amber-400 shadow-2xl space-y-3 animate-in fade-in duration-150"
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
                            className="w-full px-3 py-1.5 bg-black/80 border border-white/10 rounded-xl text-xs text-white" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-300 font-bold block mb-1">Từ khóa (cách nhau bằng dấu phẩy):</label>
                          <input 
                            type="text" 
                            value={editingRuleData.keywords} 
                            onChange={(e) => setEditingRuleData({ ...editingRuleData, keywords: e.target.value })} 
                            className="w-full px-3 py-1.5 bg-black/80 border border-white/10 rounded-xl text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-300 font-bold block mb-1">Câu thoại phản hồi (Hỗ trợ [user]):</label>
                        <textarea 
                          rows={2} 
                          value={editingRuleData.replyText} 
                          onChange={(e) => setEditingRuleData({ ...editingRuleData, replyText: e.target.value })} 
                          className="w-full p-2.5 bg-black/80 border border-white/10 rounded-xl text-xs text-white font-medium" 
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-300 font-bold block mb-1">Giọng đọc riêng:</label>
                          <select 
                            value={editingRuleData.role} 
                            onChange={(e) => setEditingRuleData({ ...editingRuleData, role: e.target.value })} 
                            className="w-full px-3 py-1.5 bg-black/80 border border-white/10 rounded-xl text-xs text-amber-300 font-bold cursor-pointer"
                          >
                            <option value="idol">🎤 Giọng Idol Chính</option>
                            <option value="assistant">💼 Giọng Trợ Lý</option>
                            <option value="game">🎮 Giọng BLV Game</option>
                            {ALL_SYSTEM_VOICES.map(v => (
                              <option key={v.id} value={v.id}>🔊 {v.name} ({v.gender === 'Female' ? 'Nữ' : 'Nam'})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-300 font-bold block mb-1">Cooldown (giây):</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="60" 
                            value={editingRuleData.cooldownSec || 5} 
                            onChange={(e) => setEditingRuleData({ ...editingRuleData, cooldownSec: Number(e.target.value) })} 
                            className="w-full px-3 py-1.5 bg-black/80 border border-white/10 rounded-xl text-xs text-white" 
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button 
                          onClick={() => { setEditingRuleId(null); setEditingRuleData(null); }} 
                          className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={() => handleSaveEditRule(rule.id || idx)} 
                          className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Check size={14} /> Lưu Thay Đổi
                        </button>
                      </div>
                    </div>
                  );
                }

                // Thẻ Card Hiển Thị Chuẩn Phong Cách Ảnh 4
                return (
                  <div 
                    key={rule.id || idx} 
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      rule.enabled !== false 
                        ? 'bg-[#151822] border-gray-700/80 shadow-lg hover:border-gray-600' 
                        : 'bg-[#10121a]/80 border-gray-800 opacity-60'
                    }`}
                  >
                    {/* Header Row: Number & Title, Badges, Action Buttons */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Up/Down buttons */}
                        <div className="flex items-center gap-0.5">
                          <button 
                            onClick={() => handleMoveKeywordRule(idx, -1)} 
                            disabled={idx === 0} 
                            className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-20 text-[10px] cursor-pointer"
                            title="Di chuyển lên trên"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button 
                            onClick={() => handleMoveKeywordRule(idx, 1)} 
                            disabled={idx === keywordRules.length - 1} 
                            className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-20 text-[10px] cursor-pointer"
                            title="Di chuyển xuống dưới"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>

                        {/* Heading */}
                        <h4 className="text-sm font-black text-white flex items-center gap-2">
                          <span>{idx + 1}. {rule.name || `Bộ Quy Tắc ${idx + 1}`}</span>
                        </h4>

                        {/* Badges */}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${roleBadgeClass}`}>
                          {roleLabel}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          Cooldown: {rule.cooldownSec || 5}s
                        </span>
                      </div>

                      {/* Right Action Icons (Copy, Sửa, BẬT/TẮT, NGHE THỬ, Xóa) */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => copyToClipboard(rule.replyText, rule.id || idx)} 
                          className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 transition-all cursor-pointer"
                          title="Sao chép câu trả lời"
                        >
                          {copiedId === (rule.id || idx) ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>

                        <button 
                          onClick={() => {
                            setEditingRuleId(rule.id || idx);
                            setEditingRuleData({
                              name: rule.name || '',
                              keywords: Array.isArray(rule.keywords) ? rule.keywords.join(', ') : (rule.keywords || ''),
                              replyText: rule.replyText || '',
                              role: rule.role || 'assistant',
                              cooldownSec: rule.cooldownSec || 5
                            });
                          }} 
                          className="px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          title="Chỉnh sửa quy tắc này"
                        >
                          <Edit3 size={12} /> Sửa
                        </button>

                        <button 
                          onClick={() => handleToggleRule(idx)} 
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            rule.enabled !== false 
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50' 
                              : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}
                          title="Bật / Tắt quy tắc này"
                        >
                          {rule.enabled !== false ? 'BẬT' : 'TẮT'}
                        </button>

                        <button 
                          onClick={() => handlePreviewRuleAudio(rule, idx)} 
                          className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                            isPreviewing 
                              ? 'bg-purple-600 text-white animate-pulse shadow-md' 
                              : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40'
                          }`}
                          title="Nghe thử giọng đọc trực tiếp"
                        >
                          {isPreviewing ? <Square size={11} className="fill-current" /> : <Play size={11} className="fill-current" />}
                          {isPreviewing ? 'DỪNG' : 'NGHE THỬ'}
                        </button>

                        <button 
                          onClick={() => handleRemoveKeywordRule(idx)} 
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                          title="Xóa quy tắc này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Keywords Tag Cloud */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-gray-400 font-semibold mr-1">Từ khóa:</span>
                      {(Array.isArray(rule.keywords) ? rule.keywords : (rule.keywords || '').split(',')).map((kw, kIdx) => (
                        <span 
                          key={kIdx} 
                          className="px-2.5 py-0.5 rounded-lg bg-[#252016] text-amber-300 text-xs font-medium border border-amber-500/30 shadow-xs"
                        >
                          "{kw.trim()}"
                        </span>
                      ))}
                    </div>

                    {/* Response Preview Box */}
                    <div className="p-3 bg-black/50 rounded-xl border border-white/5 text-xs text-gray-200 leading-relaxed font-normal">
                      <span className="text-amber-400 font-bold mr-1.5">💬 Phản hồi:</span>
                      <span className="italic">"{rule.replyText}"</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KỊCH BẢN ĐỌC LIÊN TỤC */}
      {/* ========================================================================= */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={15} className="text-purple-400" /> DANH SÁCH CÂU THOẠI KỊCH BẢN TỰ ĐỘNG
            </h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBulkPromptModal(true)} 
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Upload size={13} /> Tải File Kịch Bản (.TXT, .MD, .DOCX)
              </button>
              {prompts.length > 0 && (
                <button 
                  onClick={() => { if (window.confirm('Anh có chắc muốn xóa sạch danh sách kịch bản không?')) syncConfig({ prompts: [] }); }} 
                  className="px-3 py-1.5 bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} /> Xóa Tất Cả
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input 
              type="text" 
              value={newPromptText} 
              onChange={(e) => setNewPromptText(e.target.value)} 
              placeholder="Nhập câu thoại mới cho phiên live..." 
              className="flex-1 px-3 py-2 bg-black/70 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500" 
            />
            <select 
              value={newPromptRole} 
              onChange={(e) => setNewPromptRole(e.target.value)} 
              className="px-3 py-2 bg-black/80 border border-purple-500/40 rounded-xl text-xs text-purple-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="idol">🎤 Giọng Idol Chính</option>
              <option value="assistant">💼 Giọng Trợ Lý</option>
              <option value="game">🎮 Giọng BLV Game</option>
            </select>
            <button 
              onClick={handleAddPrompt} 
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-1 shrink-0 shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              <Plus size={15} /> Thêm
            </button>
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
            {prompts.map((p, idx) => (
              <div 
                key={p.id || idx} 
                className="p-3 bg-[#161922] border border-gray-800 rounded-xl flex items-center justify-between gap-3 hover:border-gray-700"
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button 
                      onClick={() => handleMovePrompt(idx, -1)} 
                      disabled={idx === 0} 
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-20 text-[10px] cursor-pointer"
                    >
                      <ArrowUp size={10} />
                    </button>
                    <button 
                      onClick={() => handleMovePrompt(idx, 1)} 
                      disabled={idx === prompts.length - 1} 
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-20 text-[10px] cursor-pointer"
                    >
                      <ArrowDown size={10} />
                    </button>
                  </div>
                  <div className="text-xs font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded-lg w-8 text-center">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs text-gray-200 font-medium">{p.text}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Giọng: {p.role === 'idol' ? 'Idol Chính' : p.role === 'assistant' ? 'Trợ Lý' : 'BLV Game'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => copyToClipboard(p.text, p.id || idx)} 
                    className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-white/15 cursor-pointer"
                  >
                    <Copy size={12} />
                  </button>
                  <button 
                    onClick={() => handleRemovePrompt(idx)} 
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showBulkPromptModal && (
            <div className="p-4 bg-[#161922] rounded-2xl border border-purple-500/40 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-purple-300">
                <div className="flex items-center gap-2"><FileText size={15} /> Tải Lên Kịch Bản (Tự Động Tách Dòng)</div>
                <button onClick={() => setShowBulkPromptModal(false)} className="text-gray-400 hover:text-white cursor-pointer">✕ Đóng</button>
              </div>
              <textarea 
                rows={5} 
                value={bulkPromptText} 
                onChange={(e) => setBulkPromptText(e.target.value)} 
                placeholder="Dán nội dung kịch bản vào đây (mỗi câu một dòng)..." 
                className="w-full bg-black/80 p-3 rounded-xl text-xs text-white border border-white/10" 
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-2">
                  <input type="file" ref={promptFileInputRef} onChange={handleFileUploadPrompts} className="hidden" />
                  <button 
                    onClick={() => promptFileInputRef.current?.click()} 
                    className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs text-white font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={13} /> Chọn File
                  </button>
                  <select 
                    value={bulkPromptRole} 
                    onChange={(e) => setBulkPromptRole(e.target.value)} 
                    className="px-3 py-2 bg-black/80 border border-gray-700 rounded-xl text-xs text-white cursor-pointer"
                  >
                    <option value="idol">Cho: Idol Chính</option>
                    <option value="assistant">Cho: Trợ Lý</option>
                    <option value="game">Cho: BLV Game</option>
                  </select>
                </div>
                <button 
                  onClick={() => handleBulkImportPrompts(bulkPromptText, bulkPromptRole)} 
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> Xử Lý Nạp
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
