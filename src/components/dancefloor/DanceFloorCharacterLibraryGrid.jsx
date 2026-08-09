import React, { useState, useMemo } from 'react';
import { Users, Trash2, Pencil, Check, X, CheckCircle2, XCircle, Search } from 'lucide-react';
import DanceFloorCharacterUploader from './DanceFloorCharacterUploader';

const PERSONALITY_LABELS = {
  cute: '🥰 Dễ Thương', cool: '😎 Ngầu', funny: '😂 Hài Hước',
  luxury: '👑 Sang Chảnh', energetic: '⚡ Sôi Động', sassy: '💅 Cá Tính',
};

const CATEGORY_LABELS = {
  all: 'Tất Cả', animal: '🐾 Thú Vật', human: '🧑 Người', artist: '🎤 Nghệ Sĩ',
  celebrity: '🌟 Nổi Tiếng', vip: '💎 VIP Gốc', cartoon: '🎨 Cartoon', robot: '🤖 Robot',
  fantasy: '🧚 Fantasy', mythical: '🐉 Huyền Thoại', custom: '✨ Tuỳ Chỉnh',
};

function CharacterCard({ character, isCustom, isEnabled, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: character.name,
    personality: character.personality,
    callNamesText: (character.callNames || []).join(', '),
    tier: character.tier === 'vip' ? 'vip' : 'normal',
  });

  const saveEdit = () => {
    if (!draft.name.trim()) return;
    onEdit(character.id, {
      name: draft.name.trim(),
      personality: draft.personality,
      callNames: draft.callNamesText.split(',').map((s) => s.trim()).filter(Boolean),
      tier: draft.tier,
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="glass-panel p-3 rounded-2xl border border-[#8B5CF6]/50 space-y-1.5">
        <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-[11px] font-bold outline-none" />
        <select value={draft.personality} onChange={(e) => setDraft((d) => ({ ...d, personality: e.target.value }))} className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-[10px] outline-none">
          {Object.entries(PERSONALITY_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input value={draft.callNamesText} onChange={(e) => setDraft((d) => ({ ...d, callNamesText: e.target.value }))} placeholder="biệt danh, cách nhau dấu phẩy" className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-[10px] outline-none" />
        <select value={draft.tier} onChange={(e) => setDraft((d) => ({ ...d, tier: e.target.value }))} className="w-full px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-[10px] outline-none">
          <option value="normal">Cấp Thường</option>
          <option value="vip">Cấp VIP (mở khi tặng quà giá trị)</option>
        </select>
        <div className="flex gap-1.5 justify-end">
          <button onClick={saveEdit} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
          <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg bg-gray-500/20 text-gray-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-3 rounded-2xl border border-white/10 text-center relative group">
      <button onClick={onToggle} title={isEnabled ? 'Đang dùng — bấm để tắt' : 'Đã tắt — bấm để bật lại'} className={`absolute top-1.5 left-1.5 p-1 rounded-lg cursor-pointer ${isEnabled ? 'text-emerald-400' : 'text-gray-600'}`}>
        {isEnabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      </button>
      {isCustom && (
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="p-1 rounded-lg bg-blue-500/20 text-blue-400 cursor-pointer"><Pencil className="w-3 h-3" /></button>
          <button onClick={onDelete} className="p-1 rounded-lg bg-red-500/20 text-red-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
        </div>
      )}
      {character.tier === 'vip' && (
        <span className="absolute -top-1.5 -right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-black shadow">VIP</span>
      )}
      {character.mediaType === 'image' && character.mediaUrl ? (
        <img src={character.mediaUrl} alt={character.name} className="w-14 h-14 mx-auto rounded-xl object-cover mb-2 mt-2" />
      ) : (
        <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${character.gradient} flex items-center justify-center text-2xl mb-2 mt-2`}>
          {character.emoji}
        </div>
      )}
      <p className="text-xs font-black text-white truncate">{character.name}</p>
      <span className="text-[9px] text-gray-400 font-bold block">{PERSONALITY_LABELS[character.personality] || character.style}</span>
      {character.callNames?.length > 0 && (
        <span className="text-[8px] text-gray-600 truncate block mt-0.5" title={character.callNames.join(', ')}>Gọi: {character.callNames[0]}</span>
      )}
    </div>
  );
}

// Thư viện nhân vật — tìm kiếm/lọc theo loại vì thư viện đã mở rộng lên hàng chục nhân vật (thú vật,
// nghệ sĩ, người, huyền thoại...), phân theo hạng Thường/VIP, hỗ trợ sửa/xoá nhân vật tuỳ chỉnh.
export default function DanceFloorCharacterLibraryGrid({ characters, customCharacters, disabledCharacterIds, onToggleLibraryItem, onDeleteCustomCharacter, onEditCustomCharacter, onAddCustomCharacter }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return characters.filter((c) => {
      const matchCategory = category === 'all' || c.style === category || (category === 'custom' && customCharacters.some((cc) => cc.id === c.id));
      if (!matchCategory) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return c.name.toLowerCase().includes(q) || (c.callNames || []).some((cn) => cn.toLowerCase().includes(q));
    });
  }, [characters, category, search, customCharacters]);

  const availableCategories = useMemo(() => ['all', ...new Set(characters.map((c) => c.style))], [characters]);

  return (
    <section>
      <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
        <Users className="w-5 h-5 text-[#EF4444]" /> Thư Viện Nhân Vật ({characters.length})
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Gõ đúng tên hoặc biệt danh (vd: "hot girl", "cun", "messi") trong bình luận để triệu hồi thẳng nhân vật đó lên sàn. Người xem mới bình luận cũng tự động nhận 1 nhân vật Thường đại diện riêng — tặng quà để nâng lên nhóm VIP.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm nhân vật theo tên hoặc biệt danh..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none">
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {characters.length === 0 ? (
          <p className="col-span-full text-xs text-gray-500 py-4 text-center">Chưa có nhân vật nào — tải ảnh/video lên ở khung bên dưới để bắt đầu.</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-xs text-gray-500 py-4 text-center">Không tìm thấy nhân vật phù hợp.</p>
        ) : (
          filtered.map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              isCustom={customCharacters.some((cc) => cc.id === c.id)}
              isEnabled={!disabledCharacterIds.includes(c.id)}
              onToggle={() => onToggleLibraryItem('character', c.id)}
              onDelete={() => onDeleteCustomCharacter(c.id)}
              onEdit={onEditCustomCharacter}
            />
          ))
        )}
      </div>

      <div className="mt-3">
        <DanceFloorCharacterUploader onAddCustomCharacter={onAddCustomCharacter} />
      </div>
    </section>
  );
}
