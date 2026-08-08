import React from 'react';
import { Monitor, Columns, PictureInPicture2 } from 'lucide-react';

const LAYOUTS = [
  { id: 'fullscreen', label: '🖥️ Toàn Màn Hình', icon: Monitor },
  { id: 'pip', label: '📌 Cam Bubble (PIP)', icon: PictureInPicture2 },
  { id: 'sidebyside', label: '▥ Chia Đôi', icon: Columns },
];

export default function ScreenShareControls({ isSharing, layout, onStart, onStop, onChangeLayout }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={isSharing ? onStop : onStart}
        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
          isSharing
            ? 'bg-red-600 text-white border-red-500 shadow-glow-red animate-pulse'
            : 'bg-cyan-600/30 hover:bg-cyan-600/60 text-cyan-200 border-cyan-500/40'
        }`}
        title="Chia sẻ màn hình kiểu Zoom"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>{isSharing ? '🔴 DỪNG CHIA SẺ MÀN HÌNH' : '🖥️ CHIA SẺ MÀN HÌNH'}</span>
      </button>

      {isSharing && (
        <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/10">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => onChangeLayout(l.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                layout === l.id ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
