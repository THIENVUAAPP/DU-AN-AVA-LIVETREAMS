import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Edit3, Check, MessageSquare, Zap,
  Upload, FileText, ArrowUp, ArrowDown, Copy, Download
} from 'lucide-react';
import { readUniversalFile, parseUniversalRulePairs } from '../../utils/universalDocumentParser';
import { ALL_SYSTEM_VOICES } from '../../utils/voiceSyncService';

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

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKeywords, setNewRuleKeywords] = useState('');
  const [newRuleReply, setNewRuleReply] = useState('');
  const [newRuleRole, setNewRuleRole] = useState('idol');
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingRuleData, setEditingRuleData] = useState(null);

  const [showBulkPromptModal, setShowBulkPromptModal] = useState(false);
  const [bulkPromptText, setBulkPromptText] = useState('');
  const [bulkPromptRole, setBulkPromptRole] = useState('idol');
  const promptFileInputRef = useRef(null);

  const [showBulkRuleModal, setShowBulkRuleModal] = useState(false);
  const [bulkRuleText, setBulkRuleText] = useState('');
  const ruleFileInputRef = useRef(null);

  const syncConfig = (partial) => {
    onUpdateConfig(partial);
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
    alert(`Đã nạp thành công ${newItems.length} câu thoại từ file!`);
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
      id: 'k_' + Date.now(), name: newRuleName.trim() || kwList[0] || 'Rule mới',
      keywords: kwList, replyText: newRuleReply.trim(), role: newRuleRole, enabled: true
    };
    syncConfig({ keywordRules: [item, ...keywordRules] });
    setNewRuleName(''); setNewRuleKeywords(''); setNewRuleReply('');
  };

  const handleSaveEditRule = (id) => {
    if (!editingRuleData) return;
    const updated = keywordRules.map(r => r.id === id ? {
      ...r, name: editingRuleData.name,
      keywords: typeof editingRuleData.keywords === 'string' ? editingRuleData.keywords.split(',').map(s => s.trim()).filter(Boolean) : editingRuleData.keywords,
      replyText: editingRuleData.replyText, role: editingRuleData.role
    } : r);
    syncConfig({ keywordRules: updated });
    setEditingRuleId(null); setEditingRuleData(null);
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
      alert('Không tìm thấy quy tắc hợp lệ trong văn bản hoặc file');
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
    <div className="mt-4 p-4 rounded-xl border border-gray-700 bg-gray-900/50 space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'keywords' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          <Zap size={16} /> 🎯 Từ Khóa & Trả Lời Tự Động ({keywordRules.length})
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${activeTab === 'prompts' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
        >
          <MessageSquare size={16} /> 📝 Kịch Bản Đọc Liên Tục ({prompts.length})
        </button>
      </div>

      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Quản lý Kịch bản
            </h4>
            <div className="flex gap-2">
              <button onClick={() => setShowBulkPromptModal(true)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Upload size={14} /> Tải File Kịch Bản (.TXT, .MD, .DOCX)
              </button>
              {prompts.length > 0 && (
                <button onClick={() => { if(window.confirm('Xóa sạch?')) syncConfig({prompts: []}) }} className="px-3 py-1.5 bg-red-600/30 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Trash2 size={14} /> Xóa Tất Cả
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <input type="text" value={newPromptText} onChange={(e) => setNewPromptText(e.target.value)} placeholder="Nhập câu thoại..." className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-white focus:border-purple-500" />
            <select value={newPromptRole} onChange={(e) => setNewPromptRole(e.target.value)} className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-purple-300">
              <option value="idol">🎤 Giọng Idol Chính</option>
              <option value="assistant">💬 Giọng Trợ Lý</option>
              <option value="game">🎮 Giọng BLV</option>
            </select>
            <button onClick={handleAddPrompt} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Thêm
            </button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {prompts.map((p, idx) => (
              <div key={p.id || idx} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleMovePrompt(idx, -1)} disabled={idx === 0} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowUp size={12} /></button>
                  <button onClick={() => handleMovePrompt(idx, 1)} disabled={idx === prompts.length - 1} className="text-gray-500 hover:text-white disabled:opacity-30"><ArrowDown size={12} /></button>
                </div>
                <div className="text-xs font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded w-8 text-center">{idx + 1}</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-200">{p.text}</div>
                  <div className="text-xs text-gray-400 mt-1">Giọng: {p.role === 'idol' ? 'Idol' : p.role === 'assistant' ? 'Trợ Lý' : 'BLV'}</div>
                </div>
                <button onClick={() => handleRemovePrompt(idx)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          {showBulkPromptModal && (
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-600 mt-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-purple-400">
                <div className="flex items-center gap-2"><FileText size={16} /> Tải Lên Kịch Bản (Tự Chia Dòng)</div>
                <button onClick={() => setShowBulkPromptModal(false)} className="text-gray-400 hover:text-white">✕ Đóng</button>
              </div>
              <textarea rows={5} value={bulkPromptText} onChange={(e) => setBulkPromptText(e.target.value)} placeholder="Dán nội dung vào đây..." className="w-full bg-black p-3 rounded-lg text-sm text-white" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <input type="file" ref={promptFileInputRef} onChange={handleFileUploadPrompts} className="hidden" />
                  <button onClick={() => promptFileInputRef.current?.click()} className="px-4 py-2 bg-gray-700 rounded-lg text-sm text-white font-bold flex items-center gap-2"><Upload size={14}/> Chọn File</button>
                  <select value={bulkPromptRole} onChange={(e) => setBulkPromptRole(e.target.value)} className="px-3 py-2 bg-black border border-gray-600 rounded-lg text-sm text-white">
                    <option value="idol">Cho: Idol</option>
                    <option value="assistant">Cho: Trợ Lý</option>
                  </select>
                </div>
                <button onClick={() => handleBulkImportPrompts(bulkPromptText, bulkPromptRole)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Check size={14}/> Xử Lý</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">Quản lý Từ Khóa & Phản Hồi</h4>
            <div className="flex gap-2">
              <button onClick={() => setShowBulkRuleModal(true)} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Upload size={14} /> Tải File Từ Khóa
              </button>
              {keywordRules.length > 0 && (
                <button onClick={() => { if(window.confirm('Xóa sạch?')) syncConfig({keywordRules: []}) }} className="px-3 py-1.5 bg-red-600/30 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Trash2 size={14} /> Xóa Tất Cả
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" value={newRuleName} onChange={(e) => setNewRuleName(e.target.value)} placeholder="Tên bộ (VD: Hỏi giá)" className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-white" />
            <input type="text" value={newRuleKeywords} onChange={(e) => setNewRuleKeywords(e.target.value)} placeholder="Từ khóa (cách nhau dấu phẩy: giá, bao nhiêu)" className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-white" />
            <input type="text" value={newRuleReply} onChange={(e) => setNewRuleReply(e.target.value)} placeholder="Câu trả lời (dùng [user] để gọi tên)" className="px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-white md:col-span-2" />
            <div className="md:col-span-2 flex gap-2">
              <select value={newRuleRole} onChange={(e) => setNewRuleRole(e.target.value)} className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-sm text-amber-300">
                <option value="idol">🎤 Giọng Idol Chính</option>
                <option value="assistant">💬 Giọng Trợ Lý</option>
                <option value="game">🎮 Giọng BLV</option>
              </select>
              <button onClick={handleAddKeywordRule} className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Thêm Rule
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {keywordRules.map((r, idx) => (
              <div key={r.id || idx} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="bg-gray-700 px-2 rounded text-xs">{idx + 1}</span> {r.name}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => handleMoveKeywordRule(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-white"><ArrowUp size={14}/></button>
                    <button onClick={() => handleMoveKeywordRule(idx, 1)} disabled={idx === keywordRules.length - 1} className="text-gray-400 hover:text-white"><ArrowDown size={14}/></button>
                    <button onClick={() => handleRemoveKeywordRule(idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="text-xs text-amber-400 font-mono">Từ khóa: {r.keywords?.join(', ')}</div>
                <div className="text-sm text-gray-300 italic">" {r.replyText} "</div>
                <div className="text-xs text-gray-500">Giọng: {r.role === 'idol' ? 'Idol' : r.role === 'assistant' ? 'Trợ Lý' : 'BLV'}</div>
              </div>
            ))}
          </div>

          {showBulkRuleModal && (
            <div className="p-4 bg-gray-800 rounded-xl border border-gray-600 mt-4 space-y-3">
              <div className="flex justify-between items-center font-bold text-amber-400">
                <div className="flex items-center gap-2"><FileText size={16} /> Tải Lên / Dán Bộ Từ Khóa</div>
                <button onClick={() => setShowBulkRuleModal(false)} className="text-gray-400 hover:text-white">✕ Đóng</button>
              </div>
              <textarea rows={5} value={bulkRuleText} onChange={(e) => setBulkRuleText(e.target.value)} placeholder="giá, bao nhiêu, fee: Dạ giá là 3tr5 ạ&#10;luật, chơi sao: Dạ bạn thả tim nhé" className="w-full bg-black p-3 rounded-lg text-sm text-white" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <input type="file" ref={ruleFileInputRef} onChange={handleFileUploadRules} className="hidden" />
                  <button onClick={() => ruleFileInputRef.current?.click()} className="px-4 py-2 bg-gray-700 rounded-lg text-sm text-white font-bold flex items-center gap-2"><Upload size={14}/> Chọn File</button>
                </div>
                <button onClick={() => handleBulkImportRules(bulkRuleText)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Check size={14}/> Xử Lý Nạp File</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
