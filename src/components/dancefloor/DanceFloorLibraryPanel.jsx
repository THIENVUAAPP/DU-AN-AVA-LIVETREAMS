import React, { useRef, useState } from 'react';
import { Volume2, Gem, Music4, Sparkles as SparklesIcon, Trash2, Image as ImageIcon, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { DANCE_STYLES, SCENE_BACKGROUNDS, DANCE_MODE_LABELS } from '../../lib/danceFloorData';
import DanceFloorCharacterLibraryGrid from './DanceFloorCharacterLibraryGrid';

const TIER_STYLES = [
  { border: 'border-gray-500/30', badge: 'bg-gray-500/20 text-gray-300' },
  { border: 'border-slate-400/30', badge: 'bg-slate-400/20 text-slate-200' },
  { border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' },
  { border: 'border-cyan-400/50', badge: 'bg-cyan-400/20 text-cyan-200' },
];

const PARTICLE_TYPES = [
  { id: 'burst', label: 'Nổ Tung (burst)' },
  { id: 'fall', label: 'Rơi Xuống (fall)' },
  { id: 'rise', label: 'Bay Lên (rise)' },
];

const EMPTY_EFFECT_FORM = { name: '', emoji: '✨', particle: 'burst', color: '#EF4444' };

function ToggleBadge({ enabled, onClick }) {
  return (
    <button
      onClick={onClick}
      title={enabled ? 'Đang dùng — bấm để tắt' : 'Đã tắt — bấm để bật lại'}
      className={`absolute top-1.5 left-1.5 p-1 rounded-lg cursor-pointer ${enabled ? 'text-emerald-400' : 'text-gray-600'}`}
    >
      {enabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
    </button>
  );
}

// Thư viện Nhân Vật / Điệu Nhảy / Hiệu Ứng / Âm Thanh / Bối Cảnh + Cấu Hình Gift-Tier. Mỗi item có
// nút tick BẬT/TẮT — tắt thì không xuất hiện trong mô phỏng, Auto-Shuffle hay gọi tên tự động nữa.
export default function DanceFloorLibraryPanel({
  characters, customCharacters, onAddCustomCharacter, onDeleteCustomCharacter, onEditCustomCharacter,
  effects, customEffects, onAddCustomEffect, onDeleteCustomEffect,
  sounds, onAddCustomSound, onDeleteCustomSound,
  giftTiers, setGiftTiers, onPreviewSound,
  disabledCharacterIds, disabledDanceIds, disabledEffectIds, disabledSceneIds, disabledSoundIds, onToggleLibraryItem,
  customBackgroundImage, onSetCustomBackgroundImage,
}) {
  const bgInputRef = useRef(null);
  const soundInputRef = useRef(null);
  const [effectForm, setEffectForm] = useState(EMPTY_EFFECT_FORM);

  const handleSoundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAddCustomSound(file);
    if (soundInputRef.current) soundInputRef.current.value = '';
  };

  const handleAddEffect = (e) => {
    e.preventDefault();
    if (!effectForm.name.trim()) {
      alert('Vui lòng nhập tên hiệu ứng!');
      return;
    }
    onAddCustomEffect({ id: `custom_fx_${Date.now()}`, name: effectForm.name.trim(), emoji: effectForm.emoji || '✨', particle: effectForm.particle, color: effectForm.color });
    setEffectForm(EMPTY_EFFECT_FORM);
  };

  const updateTierField = (level, field, value) => {
    setGiftTiers((prev) => prev.map((t) => (t.level === level ? { ...t, [field]: value } : t)));
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onSetCustomBackgroundImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <DanceFloorCharacterLibraryGrid
        characters={characters}
        customCharacters={customCharacters}
        disabledCharacterIds={disabledCharacterIds}
        onToggleLibraryItem={onToggleLibraryItem}
        onDeleteCustomCharacter={onDeleteCustomCharacter}
        onEditCustomCharacter={onEditCustomCharacter}
        onAddCustomCharacter={onAddCustomCharacter}
      />

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <SparklesIcon className="w-5 h-5 text-[#8B5CF6]" /> Thư Viện Điệu Nhảy ({DANCE_STYLES.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DANCE_STYLES.map((d) => (
            <div key={d.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative">
              <ToggleBadge enabled={!disabledDanceIds.includes(d.id)} onClick={() => onToggleLibraryItem('dance', d.id)} />
              <div className={`text-2xl mb-1 ${d.animationClass}`}>🕺</div>
              <p className="text-[11px] font-black text-white">{d.name}</p>
              <span className="text-[9px] text-gray-500">{d.durationSeconds}s mặc định</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#3B82F6]" /> Thư Viện Hiệu Ứng ({effects.length})
          </h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-3">
          {effects.map((f) => (
            <div key={f.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative group">
              <ToggleBadge enabled={!disabledEffectIds.includes(f.id)} onClick={() => onToggleLibraryItem('effect', f.id)} />
              {customEffects.some((ce) => ce.id === f.id) && (
                <button onClick={() => onDeleteCustomEffect(f.id)} className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <div className="text-2xl mb-1">{f.emoji}</div>
              <p className="text-[11px] font-black text-white truncate">{f.name}</p>
              <span className="text-[9px] text-gray-500 uppercase">{f.particle}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddEffect} className="glass-panel p-3 rounded-2xl border border-dashed border-white/20 grid grid-cols-2 lg:grid-cols-5 gap-2 items-end">
          <input value={effectForm.name} onChange={(e) => setEffectForm((f) => ({ ...f, name: e.target.value }))} placeholder="Tên hiệu ứng" className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none" />
          <input value={effectForm.emoji} onChange={(e) => setEffectForm((f) => ({ ...f, emoji: e.target.value }))} maxLength={4} className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm text-center outline-none" />
          <select value={effectForm.particle} onChange={(e) => setEffectForm((f) => ({ ...f, particle: e.target.value }))} className="px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none">
            {PARTICLE_TYPES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <input type="color" value={effectForm.color} onChange={(e) => setEffectForm((f) => ({ ...f, color: e.target.value }))} className="w-full h-9 rounded-xl bg-black/40 border border-white/10 cursor-pointer" />
          <button type="submit" className="px-3 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Thêm
          </button>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <ImageIcon className="w-5 h-5 text-pink-400" /> Bối Cảnh Sàn Nhảy ({SCENE_BACKGROUNDS.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {SCENE_BACKGROUNDS.map((s) => (
            <div key={s.id} className={`relative h-16 rounded-2xl bg-gradient-to-br ${s.gradient} border border-white/10 flex items-end p-2`}>
              <ToggleBadge enabled={!disabledSceneIds.includes(s.id)} onClick={() => onToggleLibraryItem('scene', s.id)} />
              <span className="text-[10px] font-black text-white">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBackgroundUpload} className="text-xs text-gray-300" />
          {customBackgroundImage && (
            <>
              <img src={customBackgroundImage} alt="bg" className="w-12 h-12 rounded-lg object-cover border border-white/20" />
              <button onClick={() => onSetCustomBackgroundImage(null)} className="text-[10px] text-red-400 font-bold cursor-pointer">Bỏ ảnh nền tuỳ chỉnh</button>
            </>
          )}
        </div>
        <p className="text-[9px] text-gray-500 mt-1">Tải ảnh nền riêng sẽ thay toàn bộ bối cảnh gradient có sẵn cho sàn diễn.</p>
      </section>

      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <Music4 className="w-5 h-5 text-emerald-400" /> Thư Viện Âm Thanh ({sounds.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
          {sounds.map((s) => (
            <div key={s.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative group">
              <ToggleBadge enabled={!disabledSoundIds.includes(s.id)} onClick={() => onToggleLibraryItem('sound', s.id)} />
              {s.isSessionOnly && (
                <button onClick={() => onDeleteCustomSound(s.id)} className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              <button onClick={() => onPreviewSound(s.id)} className="w-full cursor-pointer">
                <Volume2 className="w-5 h-5 mx-auto mb-1 mt-2 text-emerald-400" />
                <p className="text-[11px] font-black text-white truncate">{s.name}</p>
                <span className="text-[9px] text-gray-500">{s.isSessionOnly ? 'Nhạc Đã Tải Lên' : 'Nghe Thử'}</span>
              </button>
            </div>
          ))}
        </div>
        <input ref={soundInputRef} type="file" accept="audio/*" onChange={handleSoundUpload} className="text-xs text-gray-300" />
        <p className="text-[9px] text-gray-500 mt-1">Tải nhạc trend thật (mp3, cả bài — có lời/không lời/nhạc sàn) để dùng làm nhạc nền riêng cho luật/nhân vật — chỉ dùng trong phiên hiện tại.</p>
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
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase block">Chế Độ Nhảy</label>
                  <select
                    value={tier.danceMode || 'solo'}
                    onChange={(e) => updateTierField(tier.level, 'danceMode', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
                  >
                    {Object.entries(DANCE_MODE_LABELS).map(([id, label]) => (
                      <option key={id} value={id}>{label}</option>
                    ))}
                  </select>
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
