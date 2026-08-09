import React, { useState } from 'react';
import { UserRound } from 'lucide-react';

// Gọi tên nhân vật trực tiếp — chức năng dùng thường xuyên, nhóm theo hạng Thường/VIP cho dễ chọn
// giữa hàng chục nhân vật trong thư viện.
export default function DanceFloorCallPanel({ normalCharacters, vipCharacters, onManualTrigger }) {
  const allOptions = [...normalCharacters, ...vipCharacters];
  const [callCharacterId, setCallCharacterId] = useState(allOptions[0]?.id || '');

  const handleCallCharacter = () => {
    const character = allOptions.find((c) => c.id === callCharacterId);
    if (!character) return;
    onManualTrigger(character.callNames?.[0] || character.name);
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <UserRound className="w-4 h-4 text-pink-400" /> Gọi Tên Nhân Vật Lên Sàn
      </h4>
      <p className="text-[10px] text-gray-500 mb-2">Viewer chỉ cần gõ đúng tên/biệt danh nhân vật trong comment là triệu hồi được, không cần chờ luật từ khoá.</p>
      <div className="space-y-2">
        <select
          value={callCharacterId}
          onChange={(e) => setCallCharacterId(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
        >
          {normalCharacters.length > 0 && (
            <optgroup label="🙂 Nhân Vật Thường">
              {normalCharacters.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </optgroup>
          )}
          {vipCharacters.length > 0 && (
            <optgroup label="👑 Nhân Vật VIP">
              {vipCharacters.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
              ))}
            </optgroup>
          )}
        </select>
        <button
          onClick={handleCallCharacter}
          className="w-full px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5"
        >
          <UserRound className="w-3.5 h-3.5" /> Gọi Ngay
        </button>
      </div>
    </div>
  );
}
