import React, { useState } from 'react';
import { PlayCircle, Send, Gift } from 'lucide-react';

const QUICK_TESTS = [
  { label: 'TEST HEY', text: 'hey', color: 'from-pink-500 to-purple-500' },
  { label: 'TEST HAY', text: 'hay', color: 'from-blue-500 to-cyan-500' },
  { label: 'TEST DANCE', text: 'dance', color: 'from-fuchsia-500 to-pink-500' },
  { label: 'TEST FIRE', text: 'fire', color: 'from-orange-500 to-red-600' },
  { label: 'TEST RAIN', text: 'rain', color: 'from-slate-500 to-blue-600' },
  { label: 'TEST VIP', text: 'vip', color: 'from-amber-400 to-yellow-600' },
];

const GIFT_TESTS = [
  { label: 'Quà Cơ Bản', points: 20 },
  { label: 'Quà Bạc', points: 150 },
  { label: 'Quà Vàng', points: 800 },
  { label: 'Quà Kim Cương', points: 3000 },
];

// Test Panel 1-chạm — chức năng dùng thường xuyên khi setup/kiểm tra sàn nhảy trước khi lên live thật.
export default function DanceFloorQuickTestPanel({ onManualTrigger, onManualGift }) {
  const [customText, setCustomText] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onManualTrigger(customText.trim());
    setCustomText('');
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <PlayCircle className="w-4 h-4 text-[#8B5CF6]" /> Test Panel — Chạy Thử Không Cần LIVE Thật
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
        {QUICK_TESTS.map((t) => (
          <button
            key={t.text}
            onClick={() => onManualTrigger(t.text)}
            className={`py-2.5 rounded-xl bg-gradient-to-r ${t.color} text-white text-xs font-black shadow-lg hover:opacity-90 transition-all cursor-pointer`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {GIFT_TESTS.map((g) => (
          <button
            key={g.label}
            onClick={() => onManualGift(g.points)}
            className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-pink-400" /> {g.label}
          </button>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Gõ bình luận thử bất kỳ..."
          className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
        />
        <button type="submit" className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> Gửi
        </button>
      </form>
    </div>
  );
}
