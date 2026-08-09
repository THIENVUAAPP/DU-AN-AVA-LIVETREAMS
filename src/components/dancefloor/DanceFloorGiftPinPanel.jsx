import React, { useState } from 'react';
import { Pin, PinOff, Gift, Zap } from 'lucide-react';

// Bảng ghim hướng dẫn "quà/từ khoá nào → nhân vật nào" — hiển thị nổi ngay trên sàn diễn để người xem
// dễ biết cần tặng gì/gõ gì để gọi đúng nhân vật mong muốn. Thu gọn/mở rộng bằng 1 nút bấm, không
// chiếm nhiều diện tích khi không cần dùng.
export default function DanceFloorGiftPinPanel({ rules, giftTiers, characters }) {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(true);

  // Neo giữa-trái theo chiều dọc, KHÔNG neo bottom — vùng đáy sàn diễn là nơi nhân vật xuất hiện
  // (content-end/spiral layout), ghim ở đó sẽ che khuất nhân vật hoàn toàn.
  if (!pinned) {
    return (
      <button
        onClick={() => setPinned(true)}
        className="absolute top-1/2 left-3 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 border border-white/20 text-white cursor-pointer"
        title="Ghim lại bảng hướng dẫn quà/từ khoá"
      >
        <Pin className="w-4 h-4" />
      </button>
    );
  }

  const activeRules = rules.filter((r) => r.enabled && r.characterId).slice(0, 8);

  return (
    <div className="absolute top-1/2 left-3 -translate-y-1/2 z-30 w-64 max-h-[70%] rounded-2xl bg-black/75 backdrop-blur border border-white/20 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-[11px] font-black text-white flex items-center gap-1.5">
          <Pin className="w-3.5 h-3.5 text-amber-400" /> Hướng Dẫn Quà & Từ Khoá
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded((e) => !e)} className="text-[10px] text-gray-300 hover:text-white cursor-pointer px-1.5">
            {expanded ? '▾' : '▸'}
          </button>
          <button onClick={() => setPinned(false)} className="text-gray-400 hover:text-red-400 cursor-pointer" title="Ẩn bảng này">
            <PinOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="overflow-y-auto p-2 space-y-2">
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase mb-1 flex items-center gap-1"><Gift className="w-3 h-3" /> Quà Tặng Theo Cấp</p>
            {giftTiers.map((tier) => (
              <div key={tier.level} className="flex items-center justify-between text-[10px] text-gray-200 py-0.5">
                <span>🎁 {tier.name} ({tier.minPoints}+ điểm)</span>
                <span className="text-gray-500 truncate max-w-[110px]">
                  {tier.characterIds.slice(0, 2).map((id) => characters.find((c) => c.id === id)?.name).filter(Boolean).join(', ')}...
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Từ Khoá Nhanh</p>
            {activeRules.map((rule) => {
              const character = characters.find((c) => c.id === rule.characterId);
              return (
                <div key={rule.id} className="flex items-center justify-between text-[10px] text-gray-200 py-0.5">
                  <span className="font-black text-white uppercase">{rule.keyword}</span>
                  <span className="text-gray-500">{character ? `${character.emoji} ${character.name}` : '—'}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
