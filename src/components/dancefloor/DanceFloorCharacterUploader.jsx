import React, { useState, useRef } from 'react';
import { ImagePlus, Video, Smile, Loader2, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { segmentImageToCutout } from '../../lib/mediaSegmentation';

const PERSONALITY_LABELS = {
  cute: '🥰 Dễ Thương', cool: '😎 Ngầu', funny: '😂 Hài Hước',
  luxury: '👑 Sang Chảnh', energetic: '⚡ Sôi Động', sassy: '💅 Cá Tính',
};

const PERSONALITY_SOUND_MAP = {
  cute: 'sfx_cute', cool: 'sfx_default', funny: 'sfx_funny', luxury: 'sfx_gold', energetic: 'sfx_energy', sassy: 'sfx_energy',
};

const GRADIENT_POOL = [
  'from-pink-500 to-purple-600', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500',
  'from-amber-500 to-yellow-500', 'from-red-500 to-orange-500', 'from-fuchsia-500 to-pink-500',
  'from-indigo-500 to-purple-700', 'from-slate-500 to-cyan-700',
];

const KEY_COLOR_PRESETS = [
  { label: 'Phông Xanh Lá', value: '#00FF00' },
  { label: 'Phông Xanh Dương', value: '#0047FF' },
];

const EMPTY_FORM = { name: '', emoji: '⭐', personality: 'funny', callNamesText: '' };

function nameFromFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim().slice(0, 30) || 'Nhân Vật Mới';
}

function buildCharacterBase(name, personality, mediaUrl) {
  const slugCallName = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').trim();
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    emoji: '🧑',
    gender: 'neutral',
    style: 'custom',
    gradient: GRADIENT_POOL[Math.floor(Math.random() * GRADIENT_POOL.length)],
    personality,
    signatureSoundId: PERSONALITY_SOUND_MAP[personality] || 'sfx_default',
    callNames: slugCallName ? [slugCallName] : [],
    mediaType: 'image',
    mediaUrl,
  };
}

// Nhân vật "người thật" — tải ảnh (tách nền bằng AI) hoặc video (chroma-key phông xanh) để dùng làm
// nhân vật lên sàn nhảy, thay cho nhân vật emoji minh hoạ mặc định. Chọn nhiều ảnh cùng lúc (hàng trăm
// tấm) sẽ tự xử lý theo lô, mỗi ảnh có thumbnail riêng để dễ nhận biết đang xử lý ảnh nào.
export default function DanceFloorCharacterUploader({ onAddCustomCharacter }) {
  const [mode, setMode] = useState('photo'); // 'photo' | 'video' | 'emoji'
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [keyColor, setKeyColor] = useState(KEY_COLOR_PRESETS[0].value);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [batch, setBatch] = useState([]); // [{id, fileName, thumbUrl, status: pending|processing|done|error}]
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Chọn 1 ảnh → điền form để đặt tên/tính cách/biệt danh tay như cũ. Chọn NHIỀU ảnh → chạy hàng loạt,
  // mỗi ảnh tự động thành 1 nhân vật (tên lấy từ tên file), không cần điền form từng cái.
  const handlePhotoSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError('');

    if (files.length === 1) {
      setProcessing(true);
      try {
        const cutoutDataUrl = await segmentImageToCutout(files[0]);
        setPhotoPreview(cutoutDataUrl);
      } catch (err) {
        console.error('Tách nền ảnh lỗi:', err);
        setError(err.message || 'Tách nền ảnh thất bại, vui lòng thử ảnh khác.');
      } finally {
        setProcessing(false);
      }
      return;
    }

    const items = files.map((file) => ({
      id: `batch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      fileName: file.name,
      thumbUrl: URL.createObjectURL(file),
      status: 'pending',
      file,
    }));
    setBatch(items);
    setProcessing(true);

    let addedCount = 0;
    for (const item of items) {
      setBatch((prev) => prev.map((b) => (b.id === item.id ? { ...b, status: 'processing' } : b)));
      try {
        // eslint-disable-next-line no-await-in-loop
        const cutoutDataUrl = await segmentImageToCutout(item.file);
        const character = buildCharacterBase(nameFromFileName(item.fileName), form.personality, cutoutDataUrl);
        onAddCustomCharacter(character);
        addedCount += 1;
        setBatch((prev) => prev.map((b) => (b.id === item.id ? { ...b, status: 'done', thumbUrl: cutoutDataUrl } : b)));
      } catch (err) {
        console.error(`Tách nền ảnh "${item.fileName}" lỗi:`, err);
        setBatch((prev) => prev.map((b) => (b.id === item.id ? { ...b, status: 'error' } : b)));
      }
    }
    setProcessing(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (addedCount === 0) setError('Không thêm được nhân vật nào — vui lòng thử lại với ảnh khác.');
  };

  const handleVideoSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setError('');
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setPhotoPreview(null);
    setVideoFile(null);
    setBatch([]);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      alert('Vui lòng nhập tên nhân vật!');
      return;
    }
    if (mode === 'photo' && !photoPreview) {
      alert('Vui lòng tải ảnh và chờ tách nền xong trước khi thêm!');
      return;
    }
    if (mode === 'video' && !videoFile) {
      alert('Vui lòng tải video trước khi thêm!');
      return;
    }

    const callNames = form.callNamesText.split(',').map((s) => s.trim()).filter(Boolean);
    const base = {
      id: `custom_${Date.now()}`,
      name,
      emoji: mode === 'photo' ? '🧑' : mode === 'video' ? '🎬' : (form.emoji || '⭐'),
      gender: 'neutral',
      style: 'custom',
      gradient: GRADIENT_POOL[Math.floor(Math.random() * GRADIENT_POOL.length)],
      personality: form.personality,
      signatureSoundId: PERSONALITY_SOUND_MAP[form.personality] || 'sfx_default',
      callNames,
      mediaType: mode,
    };

    if (mode === 'photo') base.mediaUrl = photoPreview;
    if (mode === 'video') {
      base.mediaUrl = URL.createObjectURL(videoFile);
      base.chromaKeyColor = keyColor;
      // Video không lưu bền vào localStorage (dung lượng quá lớn cho JSON) — lưu bền qua IndexedDB
      // thay thế (xem useCustomLibraryItems.js), vẫn sống sót qua lần tải lại trang.
      base.isSessionOnly = true;
      base.mediaFile = videoFile;
    }

    onAddCustomCharacter(base);
    resetForm();
  };

  const doneCount = batch.filter((b) => b.status === 'done').length;
  const errorCount = batch.filter((b) => b.status === 'error').length;

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-4 rounded-2xl border border-dashed border-white/20 space-y-3">
      <div className="flex items-center gap-2">
        <ModeButton icon={ImagePlus} label="Ảnh Người Thật (Tách Nền AI)" active={mode === 'photo'} onClick={() => setMode('photo')} />
        <ModeButton icon={Video} label="Video (Phông Xanh)" active={mode === 'video'} onClick={() => setMode('video')} />
        <ModeButton icon={Smile} label="Emoji Minh Hoạ" active={mode === 'emoji'} onClick={() => setMode('emoji')} />
      </div>

      {mode === 'photo' && (
        <div className="space-y-2">
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Tính Cách (áp dụng ngay khi tải nhiều ảnh cùng lúc — chọn trước khi chọn ảnh)</label>
            <select
              value={form.personality}
              onChange={(ev) => setForm((f) => ({ ...f, personality: ev.target.value }))}
              className="w-full sm:w-64 px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
              disabled={processing}
            >
              {Object.entries(PERSONALITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoSelected} className="text-xs text-gray-300" />
            {processing && batch.length === 0 && <Loader2 className="w-5 h-5 text-[#EF4444] animate-spin" />}
            {photoPreview && batch.length === 0 && (
              <img src={photoPreview} alt="preview" className="w-14 h-14 rounded-xl object-cover border border-white/20" />
            )}
          </div>
          <p className="text-[9px] text-gray-500">Chọn 1 ảnh để tự đặt tên/biệt danh riêng bên dưới trước khi thêm, hoặc chọn NHIỀU ảnh cùng lúc (hàng trăm tấm) để tự động tạo 1 nhân vật cho mỗi ảnh theo tên file — mỗi ảnh có thumbnail riêng để dễ nhận biết đang xử lý ảnh nào.</p>

          {batch.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black text-white">
                {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                Đang xử lý hàng loạt: {doneCount + errorCount}/{batch.length} {errorCount > 0 && <span className="text-red-400">({errorCount} lỗi)</span>}
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-1">
                {batch.map((b) => (
                  <div key={b.id} className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40" title={b.fileName}>
                    <img src={b.thumbUrl} alt={b.fileName} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 right-0 p-0.5 rounded-tl-lg bg-black/70">
                      {b.status === 'pending' && <Clock className="w-3 h-3 text-gray-400" />}
                      {b.status === 'processing' && <Loader2 className="w-3 h-3 text-[#8B5CF6] animate-spin" />}
                      {b.status === 'done' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {b.status === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'video' && (
        <div className="space-y-2">
          <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoSelected} className="text-xs text-gray-300" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400">Màu phông cần xoá:</span>
            {KEY_COLOR_PRESETS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setKeyColor(c.value)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${keyColor === c.value ? 'border-white text-white' : 'border-white/10 text-gray-400'}`}
                style={{ backgroundColor: c.value + '33' }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-gray-500">Lưu ý: video quay trước phông xanh/xanh dương cho kết quả tách nền sạch nhất. Hiển thị đúng video thật (không chỉ ảnh tĩnh) trên cả Sàn 2D lẫn Sàn 3D. Video chỉ dùng trong phiên hiện tại (không lưu lại khi tải lại trang vì dung lượng lớn).</p>
        </div>
      )}

      {error && <p className="text-[10px] text-red-400">⚠️ {error}</p>}

      {mode !== 'photo' || batch.length === 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Tên Nhân Vật</label>
            <input
              value={form.name}
              onChange={(ev) => setForm((f) => ({ ...f, name: ev.target.value }))}
              placeholder="vd: Bé Sữa"
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
          </div>
          {mode === 'emoji' && (
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Emoji</label>
              <input
                value={form.emoji}
                onChange={(ev) => setForm((f) => ({ ...f, emoji: ev.target.value }))}
                className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm text-center outline-none"
                maxLength={4}
              />
            </div>
          )}
          {mode !== 'photo' && (
            <div>
              <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Tính Cách</label>
              <select
                value={form.personality}
                onChange={(ev) => setForm((f) => ({ ...f, personality: ev.target.value }))}
                className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
              >
                {Object.entries(PERSONALITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Biệt Danh (cách nhau dấu phẩy)</label>
            <input
              value={form.callNamesText}
              onChange={(ev) => setForm((f) => ({ ...f, callNamesText: ev.target.value }))}
              placeholder="vd: be sua, bs"
              className="w-full px-2.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
          </div>
          <button type="submit" className="px-3 py-2 rounded-xl bg-[#EF4444] hover:bg-red-600 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Thêm Nhân Vật
          </button>
        </div>
      ) : (
        !processing && (
          <button type="button" onClick={resetForm} className="text-[10px] text-gray-400 hover:text-white cursor-pointer">
            Xong — dọn danh sách đã xử lý
          </button>
        )
      )}
    </form>
  );
}

function ModeButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all ${
        active ? 'bg-[#8B5CF6] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}
