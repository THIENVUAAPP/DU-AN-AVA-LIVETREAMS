import React, { useState } from 'react';
import { Volume2, Gem, Users, Music4, Sparkles as SparklesIcon, Plus, Trash2 } from 'lucide-react';
import { DANCE_STYLES, DANCE_EFFECTS, DANCE_SOUNDS } from '../../lib/danceFloorData';

const TIER_STYLES = [
  { border: 'border-gray-500/30', badge: 'bg-gray-500/20 text-gray-300' },
  { border: 'border-slate-400/30', badge: 'bg-slate-400/20 text-slate-200' },
  { border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' },
  { border: 'border-cyan-400/50', badge: 'bg-cyan-400/20 text-cyan-200' },
];

const PERSONALITY_LABELS = {
  cute: '🥰 Dễ Thương',
  cool: '😎 Ngầu',
  funny: '😂 Hài Hước',
  luxury: '👑 Sang Chảnh',
  energetic: '⚡ Sôi Động',
  sassy: '💅 Cá Tính',
};

const GRADIENT_POOL = [
  'from-pink-500 to-purple-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500',
  'from-amber-500 to-yellow-500', 'from-red-500 to-orange-500', 'from-fuchsia-500 to-pink-500',
  'from-indigo-500 to-purple-700', 'from-slate-500 to-cyan-700',
];

const PERSONALITY_SOUND_MAP = {
  cute: 'sfx_cute', cool: 'sfx_default', funny: 'sfx_funny', luxury: 'sfx_gold', energetic: 'sfx_energy', sassy: 'sfx_energy',
};

const EMPTY_CUSTOM_CHARACTER = { name: '', emoji: '⭐', personality: 'funny', callNamesText: '' };

// Thư viện Nhân Vật / Điệu Nhảy / Hiệu Ứng / Âm Thanh + Cấu Hình Gift-Tier + Tạo Nhân Vật Tuỳ Chỉnh
// (viewer/admin có thể "gọi tên" bất kỳ nhân vật nào lên sàn qua callNames — kể cả tên do admin tự đặt).
export default function DanceFloorLibraryPanel({ characters, customCharacters, onAddCustomCharacter, onDeleteCustomCharacter, giftTiers, setGiftTiers, onPreviewSound }) {
  const [form, setForm] = useState(EMPTY_CUSTOM_CHARACTER);

  const updateTierField = (level, field, value) => {
    setGiftTiers((prev) => prev.map((t) => (t.level === level ? { ...t, [field]: value } : t)));
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      alert('Vui lòng nhập tên nhân vật!');
      return;
    }
    const callNames = form.callNamesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onAddCustomCharacter({
      id: `custom_${Date.now()}`,
      name,
      emoji: form.emoji || '⭐',
      gender: 'neutral',
      style: 'custom',
      gradient: GRADIENT_POOL[Math.floor(Math.random() * GRADIENT_POOL.length)],
      personality: form.personality,
      signatureSoundId: PERSONALITY_SOUND_MAP[form.personality] || 'sfx_default',
      callNames,
    });
    setForm(EMPTY_CUSTOM_CHARACTER);
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#EF4444]" /> Thư Viện Nhân Vật ({characters.length})
          </h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Gõ đúng tên hoặc biệt danh (vd: "hot girl", "cun", "messi") trong bình luận để triệu hồi thẳng nhân vật đó lên sàn, không cần đợi luật từ khoá.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {characters.map((c) => (
            <div key={c.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative group">
              {customCharacters.some((cc) => cc.id === c.id) && (
                <button
                  onClick={() => onDeleteCustomCharacter(c.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl mb-2`}>
                {c.emoji}
              </div>
              <p className="text-xs font-black text-white truncate">{c.name}</p>
              <span className="text-[9px] text-gray-400 font-bold block">{PERSONALITY_LABELS[c.personality] || c.style}</span>
              {c.callNames?.length > 0 && (
                <span className="text-[8px] text-gray-600 truncate block mt-0.5" title={c.callNames.join(', ')}>
                  Gọi: {c.callNames[0]}
                </span>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAddCustom} className="glass-panel p-4 rounded-2xl border border-dashed border-white/20 mt-3 grid grid-cols-2 lg:grid-cols-5 gap-2 items-end">
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Tên Nhân Vật</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="vd: Bé Sữa"
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Emoji</label>
            <input
              value={form.emoji}
              onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm text-center outline-none"
              maxLength={4}
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Tính Cách</label>
            <select
              value={form.personality}
              onChange={(e) => setForm((f) => ({ ...f, personality: e.target.value }))}
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            >
              {Object.entries(PERSONALITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Biệt Danh (cách nhau dấu phẩy)</label>
            <input
              value={form.callNamesText}
              onChange={(e) => setForm((f) => ({ ...f, callNamesText: e.target.value }))}
              placeholder="vd: be sua, bs"
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
          </div>
          <button type="submit" className="px-3 py-2 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Thêm
          </button>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <SparklesIcon className="w-5 h-5 text-[#8B5CF6]" /> Thư Viện Điệu Nhảy ({DANCE_STYLES.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DANCE_STYLES.map((d) => (
            <div key={d.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center">
              <div className={`text-2xl mb-1 ${d.animationClass}`}>🕺</div>
              <p className="text-[11px] font-black text-white">{d.name}</p>
              <span className="text-[9px] text-gray-500">{d.durationSeconds}s mặc định</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <SparklesIcon className="w-5 h-5 text-[#3B82F6]" /> Thư Viện Hiệu Ứng ({DANCE_EFFECTS.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {DANCE_EFFECTS.map((f) => (
            <div key={f.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-2xl mb-1">{f.emoji}</div>
              <p className="text-[11px] font-black text-white">{f.name}</p>
              <span className="text-[9px] text-gray-500 uppercase">{f.particle}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <Music4 className="w-5 h-5 text-emerald-400" /> Thư Viện Âm Thanh ({DANCE_SOUNDS.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DANCE_SOUNDS.map((s) => (
            <button
              key={s.id}
              onClick={() => onPreviewSound(s.id)}
              className="glass-panel p-3 rounded-2xl border border-white/10 text-center hover:border-emerald-500/40 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              <p className="text-[11px] font-black text-white">{s.name}</p>
              <span className="text-[9px] text-gray-500">Nghe Thử</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <Gem className="w-5 h-5 text-amber-400" /> Cấu Hình Cấp Bậc Quà Tặng (Gift-Tier)
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Quà tặng quy đổi thành "điểm sàn nhảy" nội bộ (xem GIFT_POINT_MAPPING) → đạt mốc điểm nào thì mở đặc quyền hiển thị + nhạc hiệu riêng theo nhân vật được chọn ngẫu nhiên trong nhóm.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {giftTiers.map((tier, idx) => {
            const style = TIER_STYLES[idx] || TIER_STYLES[0];
            return (
              <div key={tier.level} className={`glass-panel p-4 rounded-2xl border ${style.border} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${style.badge}`}>CẤP {tier.level}</span>
                  <span className="text-sm font-black text-white">{tier.name}</span>
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block">Điểm Tối Thiểu</label>
                  <input
                    type="number"
                    min={0}
                    value={tier.minPoints}
                    onChange={(e) => updateTierField(tier.level, 'minPoints', Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block">Thời Lượng Xuất Hiện (giây)</label>
                  <input
                    type="number"
                    min={5}
                    value={tier.durationSeconds}
                    onChange={(e) => updateTierField(tier.level, 'durationSeconds', Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {tier.customization?.outfitColor && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">🎨 Chọn màu trang phục</span>
                  )}
                  {tier.customization?.danceStyleChoice && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">💃 Chọn điệu nhảy</span>
                  )}
                  {tier.customization?.priorityStageSlot && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">👑 Ưu Tiên Slot</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
