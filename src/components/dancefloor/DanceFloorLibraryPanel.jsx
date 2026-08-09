import React, { useRef } from 'react';
import { Volume2, Gem, Users, Music4, Sparkles as SparklesIcon, Trash2, Image as ImageIcon, CheckCircle2, XCircle } from 'lucide-react';
import { DANCE_STYLES, DANCE_EFFECTS, SCENE_BACKGROUNDS } from '../../lib/danceFloorData';
import DanceFloorCharacterUploader from './DanceFloorCharacterUploader';

const TIER_STYLES = [
  { border: 'border-gray-500/30', badge: 'bg-gray-500/20 text-gray-300' },
  { border: 'border-slate-400/30', badge: 'bg-slate-400/20 text-slate-200' },
  { border: 'border-amber-500/40', badge: 'bg-amber-500/20 text-amber-300' },
  { border: 'border-cyan-400/50', badge: 'bg-cyan-400/20 text-cyan-200' },
];

const PERSONALITY_LABELS = {
  cute: '🥰 Dễ Thương', cool: '😎 Ngầu', funny: '😂 Hài Hước',
  luxury: '👑 Sang Chảnh', energetic: '⚡ Sôi Động', sassy: '💅 Cá Tính',
};

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
  characters, customCharacters, onAddCustomCharacter, onDeleteCustomCharacter,
  sounds, onAddCustomSound,
  giftTiers, setGiftTiers, onPreviewSound,
  disabledCharacterIds, disabledDanceIds, disabledEffectIds, disabledSceneIds, onToggleLibraryItem,
  customBackgroundImage, onSetCustomBackgroundImage,
}) {
  const bgInputRef = useRef(null);
  const soundInputRef = useRef(null);

  const handleSoundUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAddCustomSound(file);
    if (soundInputRef.current) soundInputRef.current.value = '';
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
      <section>
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#EF4444]" /> Thư Viện Nhân Vật ({characters.length})
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Gõ đúng tên hoặc biệt danh (vd: "hot girl", "cun", "messi") trong bình luận để triệu hồi thẳng nhân vật đó lên sàn. Nhân vật ảnh/video người thật tải lên sẽ tự động tách nền + nhảy theo điệu đã chọn.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {characters.map((c) => {
            const enabled = !disabledCharacterIds.includes(c.id);
            return (
              <div key={c.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative group">
                <ToggleBadge enabled={enabled} onClick={() => onToggleLibraryItem('character', c.id)} />
                {customCharacters.some((cc) => cc.id === c.id) && (
                  <button
                    onClick={() => onDeleteCustomCharacter(c.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {c.mediaType === 'image' && c.mediaUrl ? (
                  <img src={c.mediaUrl} alt={c.name} className="w-14 h-14 mx-auto rounded-xl object-cover mb-2" />
                ) : (
                  <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl mb-2`}>
                    {c.emoji}
                  </div>
                )}
                <p className="text-xs font-black text-white truncate">{c.name}</p>
                <span className="text-[9px] text-gray-400 font-bold block">{PERSONALITY_LABELS[c.personality] || c.style}</span>
                {c.callNames?.length > 0 && (
                  <span className="text-[8px] text-gray-600 truncate block mt-0.5" title={c.callNames.join(', ')}>
                    Gọi: {c.callNames[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <DanceFloorCharacterUploader onAddCustomCharacter={onAddCustomCharacter} />
        </div>
      </section>

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
        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-3">
          <SparklesIcon className="w-5 h-5 text-[#3B82F6]" /> Thư Viện Hiệu Ứng ({DANCE_EFFECTS.length})
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {DANCE_EFFECTS.map((f) => (
            <div key={f.id} className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative">
              <ToggleBadge enabled={!disabledEffectIds.includes(f.id)} onClick={() => onToggleLibraryItem('effect', f.id)} />
              <div className="text-2xl mb-1">{f.emoji}</div>
              <p className="text-[11px] font-black text-white">{f.name}</p>
              <span className="text-[9px] text-gray-500 uppercase">{f.particle}</span>
            </div>
          ))}
        </div>
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
            <button
              key={s.id}
              onClick={() => onPreviewSound(s.id)}
              className="glass-panel p-3 rounded-2xl border border-white/10 text-center hover:border-emerald-500/40 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              <p className="text-[11px] font-black text-white truncate">{s.name}</p>
              <span className="text-[9px] text-gray-500">{s.isSessionOnly ? 'Nhạc Đã Tải Lên' : 'Nghe Thử'}</span>
            </button>
          ))}
        </div>
        <input ref={soundInputRef} type="file" accept="audio/*" onChange={handleSoundUpload} className="text-xs text-gray-300" />
        <p className="text-[9px] text-gray-500 mt-1">Tải nhạc trend thật (mp3, cả bài) để dùng làm nhạc nền riêng cho luật/nhân vật — chỉ dùng trong phiên hiện tại.</p>
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
