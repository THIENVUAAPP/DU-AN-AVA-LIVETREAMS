import React, { useRef, useState } from 'react';
import { Clapperboard, UploadCloud, Loader2, Trash2, Play } from 'lucide-react';
import { captureVideoThumbnail } from '../../lib/videoThumbnail';

// Thư viện Video Nền Vũ Trường — tải hàng loạt (giữ đúng thứ tự tải lên, đánh số #1,#2...), mỗi video
// có thumbnail riêng để dễ nhận biết. Bấm vào 1 video là chọn NGAY làm nền đang phát trực tiếp (lặp
// liên tục) cho cả Sàn 2D lẫn Sàn 3D — nhân vật sẽ nhảy đè lên trên nền đó.
export default function DanceFloorBackgroundVideoPanel({ videos, activeId, onAdd, onDelete, onSetActive }) {
  const inputRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [progressLabel, setProgressLabel] = useState('');

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setProcessing(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgressLabel(`Đang xử lý ${i + 1}/${files.length}...`);
      try {
        // eslint-disable-next-line no-await-in-loop
        const thumbnail = await captureVideoThumbnail(file);
        onAdd({
          id: `bgvideo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, '').slice(0, 40),
          url: URL.createObjectURL(file),
          thumbnail,
        });
      } catch (err) {
        console.error(`Tạo thumbnail video nền "${file.name}" lỗi:`, err);
      }
    }
    setProcessing(false);
    setProgressLabel('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white flex items-center gap-2 mb-2">
        <Clapperboard className="w-4 h-4 text-fuchsia-400" /> Video Nền Vũ Trường ({videos.length})
      </h4>
      <p className="text-[10px] text-gray-500 mb-2">
        Tải hàng loạt video sàn nhảy/vũ trường làm nền — chọn 1 video để phát lặp liên tục làm nền trực
        tiếp cho cả Sàn 2D và Sàn 3D, nhân vật sẽ nhảy đè lên trên nền đó. Chỉ dùng trong phiên hiện tại.
      </p>
      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-black cursor-pointer hover:bg-fuchsia-500/30 mb-3">
        {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
        {processing ? progressLabel : 'Tải Video Nền (chọn nhiều được)'}
        <input ref={inputRef} type="file" accept="video/*" multiple onChange={handleFiles} disabled={processing} className="hidden" />
      </label>

      {videos.length === 0 ? (
        <p className="text-xs text-gray-500">Chưa có video nền nào — sàn đang dùng màu/preset mặc định.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
          {videos.map((v, idx) => {
            const isActive = v.id === activeId;
            return (
              <div key={v.id} className={`relative rounded-xl overflow-hidden border-2 group ${isActive ? 'border-emerald-400' : 'border-white/10'}`}>
                <button onClick={() => onSetActive(v.id)} className="block w-full cursor-pointer" title={`Chọn "${v.name}" làm nền`}>
                  <img src={v.thumbnail} alt={v.name} className="w-full aspect-video object-cover" />
                </button>
                <div className="absolute top-1 left-1 text-[8px] font-black text-white bg-black/70 px-1.5 py-0.5 rounded-full">#{idx + 1}</div>
                {isActive && (
                  <div className="absolute bottom-6 left-1 flex items-center gap-1 text-[8px] font-black text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded-full">
                    <Play className="w-2.5 h-2.5" /> ĐANG PHÁT
                  </div>
                )}
                <button onClick={() => onDelete(v.id)} className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                </button>
                <p className="text-[8px] text-gray-300 truncate px-1 pb-1 pt-0.5 bg-black/50">{v.name}</p>
              </div>
            );
          })}
        </div>
      )}
      {activeId && (
        <button onClick={() => onSetActive(null)} className="mt-2 text-[10px] text-gray-400 hover:text-white cursor-pointer">
          Tắt video nền (dùng lại màu/preset mặc định)
        </button>
      )}
    </div>
  );
}
