import React, { useState } from 'react';
import { Shuffle, Wand2 } from 'lucide-react';

const SIZE_OPTIONS = [
  { value: 'small', label: 'Nhỏ' },
  { value: 'medium', label: 'Vừa' },
  { value: 'large', label: 'To' },
];

// Tổ hợp thủ công — chọn tay từng thành phần (nhân vật / điệu nhảy kể cả điệu "sao chép" từ video mẫu /
// nhạc / cỡ hiển thị) rồi áp dụng ngay bằng 1 nút, thay vì chỉ trông chờ luật tự động hoặc Auto-Shuffle
// ngẫu nhiên. Mọi thành phần kết hợp tự do với nhau — đúng yêu cầu "tất cả kết hợp được hết với nhau".
export default function DanceFloorManualComboPanel({ characters, danceStyles, sounds, onApplyCombo }) {
  const [characterId, setCharacterId] = useState(characters[0]?.id || '');
  const [danceId, setDanceId] = useState('');
  const [soundId, setSoundId] = useState('');
  const [sizeScale, setSizeScale] = useState('medium');

  const handleApply = () => {
    if (!characterId) return;
    onApplyCombo({ characterId, danceId: danceId || null, soundId: soundId || null, sizeScale });
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-fuchsia-400" /> Tổ Hợp Thủ Công — Chọn Từng Thứ
      </h4>
      <div className="space-y-2">
        <ComboSelect
          label="Nhân Vật"
          value={characterId}
          onChange={setCharacterId}
          options={characters.map((c) => ({ value: c.id, label: `${c.tier === 'vip' ? '👑' : ''} ${c.name}` }))}
        />
        <ComboSelect
          label="Điệu Nhảy"
          value={danceId}
          onChange={setDanceId}
          options={[
            { value: '', label: 'Ngẫu nhiên theo mặc định' },
            ...danceStyles.map((d) => ({ value: d.id, label: d.type === 'mocap' ? `🎥 ${d.name} (sao chép video)` : d.name })),
          ]}
        />
        <ComboSelect
          label="Nhạc / Âm Thanh"
          value={soundId}
          onChange={setSoundId}
          options={[{ value: '', label: 'Không phát nhạc riêng' }, ...sounds.map((s) => ({ value: s.id, label: s.name }))]}
        />
        <ComboSelect label="Cỡ Nhân Vật" value={sizeScale} onChange={setSizeScale} options={SIZE_OPTIONS} />
      </div>
      <button
        onClick={handleApply}
        disabled={!characterId}
        className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-black cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
      >
        <Shuffle className="w-3.5 h-3.5" /> Áp Dụng Tổ Hợp Ngay
      </button>
    </div>
  );
}

function ComboSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
