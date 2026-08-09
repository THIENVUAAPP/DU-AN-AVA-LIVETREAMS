import React, { useState } from 'react';
import { Plus, Trash2, Power, MessagesSquare } from 'lucide-react';

const EMPTY_FORM = { matchKeywordsText: '', replyTemplatesText: '' };

// Trả Lời Tự Động (Q&A) — admin tự thêm mẫu câu hỏi + câu trả lời hài hước riêng, áp dụng cho MỌI
// bình luận khớp mẫu (không cần trigger nhân vật). Đây là lớp "trò chuyện" độc lập với Rule Builder.
export default function DanceFloorAutoReplyPanel({ autoReplyRules, setAutoReplyRules }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    const matchKeywords = form.matchKeywordsText.split(',').map((s) => s.trim()).filter(Boolean);
    const replyTemplates = form.replyTemplatesText.split('\n').map((s) => s.trim()).filter(Boolean);
    if (matchKeywords.length === 0 || replyTemplates.length === 0) {
      alert('Vui lòng nhập ít nhất 1 mẫu câu hỏi và 1 câu trả lời!');
      return;
    }
    setAutoReplyRules((prev) => [...prev, { id: `qa_custom_${Date.now()}`, matchKeywords, replyTemplates, enabled: true }]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const toggleEnabled = (id) => {
    setAutoReplyRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const deleteRule = (id) => {
    setAutoReplyRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <MessagesSquare className="w-5 h-5 text-[#3B82F6]" /> Trả Lời Tự Động Theo Câu Hỏi ({autoReplyRules.length})
          </h3>
          <p className="text-xs text-gray-400">Bình luận chứa 1 trong các mẫu câu hỏi → tự động trả lời hài hước, dùng {'{username}'} để chèn tên người bình luận.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-black transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thêm Mẫu Câu Hỏi
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 animate-fadeIn">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Mẫu Câu Hỏi (cách nhau dấu phẩy)</label>
            <input
              value={form.matchKeywordsText}
              onChange={(e) => setForm((f) => ({ ...f, matchKeywordsText: e.target.value }))}
              placeholder="vd: freeship khong, co ship khong"
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Câu Trả Lời (mỗi dòng 1 câu, chọn ngẫu nhiên)</label>
            <textarea
              value={form.replyTemplatesText}
              onChange={(e) => setForm((f) => ({ ...f, replyTemplatesText: e.target.value }))}
              placeholder={'{username} ơi freeship toàn quốc luôn nha!\n{username} yên tâm ship tận nơi, khỏi lo!'}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none resize-none"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white text-xs font-black cursor-pointer">
            💾 LƯU MẪU
          </button>
        </form>
      )}

      <div className="space-y-2">
        {autoReplyRules.map((rule) => (
          <div key={rule.id} className="glass-panel p-3 rounded-2xl border border-white/10 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-1 mb-1">
                {rule.matchKeywords.map((kw) => (
                  <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">{kw}</span>
                ))}
              </div>
              <p className="text-xs text-gray-300 truncate">{rule.replyTemplates[0]}</p>
              {rule.replyTemplates.length > 1 && <span className="text-[9px] text-gray-500">+{rule.replyTemplates.length - 1} câu khác</span>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleEnabled(rule.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                  rule.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600/20 text-gray-500'
                }`}
              >
                <Power className="w-3 h-3" /> {rule.enabled ? 'BẬT' : 'TẮT'}
              </button>
              <button onClick={() => deleteRule(rule.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
