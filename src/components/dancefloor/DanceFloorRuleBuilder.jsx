import React, { useState } from 'react';
import { Plus, Trash2, Zap, Power, Sparkles } from 'lucide-react';
import { DANCE_STYLES, DANCE_EFFECTS, SCENE_BACKGROUNDS } from '../../lib/danceFloorData';

function buildEmptyRule(characters, sounds) {
  return {
    keyword: '',
    platform: 'all',
    characterId: characters[0]?.id || null,
    danceId: DANCE_STYLES[0].id,
    effectId: DANCE_EFFECTS[0].id,
    soundId: sounds[0].id,
    sceneId: '',
    spawnsCharacter: true,
    spawnCount: 1,
    duration: 8,
    priority: 3,
    cooldownSec: 3,
    enabled: true,
  };
}

// Rule Builder — bảng "trigger_rules" no-code: admin tạo/sửa/xoá luật từ khoá không cần code lại (Mục 26/28 kế hoạch).
export default function DanceFloorRuleBuilder({ rules, setRules, characters, sounds, onTestRule }) {
  const [form, setForm] = useState(() => buildEmptyRule(characters, sounds));
  const [showForm, setShowForm] = useState(false);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleAddRule = (e) => {
    e.preventDefault();
    const keyword = form.keyword.trim();
    if (!keyword) {
      alert('Vui lòng nhập từ khoá kích hoạt!');
      return;
    }
    const newRule = {
      ...form,
      id: `rule_custom_${Date.now()}`,
      keyword,
      sceneId: form.sceneId || null,
      characterId: form.spawnsCharacter ? form.characterId : null,
      danceId: form.spawnsCharacter ? form.danceId : null,
    };
    setRules((prev) => [...prev, newRule]);
    setForm(buildEmptyRule(characters, sounds));
    setShowForm(false);
  };

  const handleToggleEnabled = (id) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleDeleteRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#EF4444]" /> Bộ Luật Từ Khoá ({rules.length})
          </h3>
          <p className="text-xs text-gray-400">Bình luận chứa từ khoá → tự động sinh nhân vật + điệu nhảy + hiệu ứng. Không cần sửa code.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-xs font-black transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Thêm Luật Mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddRule} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Từ Khoá</label>
              <input
                value={form.keyword}
                onChange={(e) => updateField('keyword', e.target.value)}
                placeholder="vd: zombie"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-[#EF4444] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Nền Tảng</label>
              <select
                value={form.platform}
                onChange={(e) => updateField('platform', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              >
                <option value="all">Tất Cả</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Độ Ưu Tiên (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.priority}
                onChange={(e) => updateField('priority', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Cooldown (giây/user)</label>
              <input
                type="number"
                min={1}
                value={form.cooldownSec}
                onChange={(e) => updateField('cooldownSec', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={form.spawnsCharacter}
              onChange={(e) => updateField('spawnsCharacter', e.target.checked)}
              className="w-4 h-4 accent-[#EF4444]"
            />
            Sinh nhân vật lên sàn (bỏ chọn nếu chỉ muốn kích hoạt hiệu ứng, vd: FIRE/RAIN)
          </label>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {form.spawnsCharacter && (
              <>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Nhân Vật</label>
                  <select
                    value={form.characterId}
                    onChange={(e) => updateField('characterId', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
                  >
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Điệu Nhảy</label>
                  <select
                    value={form.danceId}
                    onChange={(e) => updateField('danceId', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
                  >
                    {DANCE_STYLES.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Số Lượng Sinh</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.spawnCount}
                    onChange={(e) => updateField('spawnCount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Hiệu Ứng</label>
              <select
                value={form.effectId}
                onChange={(e) => updateField('effectId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              >
                {DANCE_EFFECTS.map((f) => (
                  <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Âm Thanh</label>
              <select
                value={form.soundId}
                onChange={(e) => updateField('soundId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              >
                {sounds.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Đổi Bối Cảnh</label>
              <select
                value={form.sceneId}
                onChange={(e) => updateField('sceneId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              >
                <option value="">Giữ Nguyên</option>
                {SCENE_BACKGROUNDS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Thời Lượng (giây)</label>
              <input
                type="number"
                min={2}
                value={form.duration}
                onChange={(e) => updateField('duration', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white text-xs font-black cursor-pointer"
          >
            💾 LƯU LUẬT
          </button>
        </form>
      )}

      <div className="glass-panel rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] font-black">
              <th className="text-left p-3">Từ Khoá</th>
              <th className="text-left p-3">Nền Tảng</th>
              <th className="text-left p-3">Nhân Vật</th>
              <th className="text-left p-3">Hiệu Ứng</th>
              <th className="text-left p-3">Ưu Tiên</th>
              <th className="text-left p-3">Cooldown</th>
              <th className="text-left p-3">Trạng Thái</th>
              <th className="text-left p-3">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => {
              const character = characters.find((c) => c.id === rule.characterId);
              const effect = DANCE_EFFECTS.find((f) => f.id === rule.effectId);
              return (
                <tr key={rule.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-black text-white uppercase">{rule.keyword}</td>
                  <td className="p-3 text-gray-400">{rule.platform === 'all' ? 'Tất Cả' : rule.platform}</td>
                  <td className="p-3 text-gray-300">{character ? `${character.emoji} ${character.name}` : '— (không sinh)'}</td>
                  <td className="p-3 text-gray-300">{effect ? `${effect.emoji} ${effect.name}` : '—'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-black">{rule.priority}</span>
                  </td>
                  <td className="p-3 text-gray-400">{rule.cooldownSec}s</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleEnabled(rule.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                        rule.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600/20 text-gray-500'
                      }`}
                    >
                      <Power className="w-3 h-3" /> {rule.enabled ? 'BẬT' : 'TẮT'}
                    </button>
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    {onTestRule && (
                      <button
                        onClick={() => onTestRule(rule)}
                        title="Chạy thử luật này ngay"
                        className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
