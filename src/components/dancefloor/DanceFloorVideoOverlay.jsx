import React, { useState, useRef, useCallback } from 'react';
import { Video, Camera, X, Move } from 'lucide-react';

const DEFAULT_TILE = { x: 68, y: 62, width: 26, height: 26 };

// Ghép video thực tế (tải lên hoặc webcam) vào phiên live — kéo thả tự do + chỉnh kích thước, chồng
// lên sàn diễn. Toạ độ lưu theo % để luôn đúng vị trí dù đổi kích thước khung sàn diễn.
export default function DanceFloorVideoOverlay({ containerRef }) {
  const [tile, setTile] = useState(null); // { srcType: 'file'|'webcam', url, ...DEFAULT_TILE }
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dragStateRef = useRef(null);

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTile({ srcType: 'file', url: URL.createObjectURL(file), ...DEFAULT_TILE });
    setMenuOpen(false);
  };

  const handleUseWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setTile({ srcType: 'webcam', stream, ...DEFAULT_TILE });
      setMenuOpen(false);
    } catch (err) {
      console.error('Không mở được webcam:', err);
      alert('Không thể truy cập webcam — vui lòng cấp quyền camera cho trình duyệt!');
    }
  };

  const closeTile = () => {
    if (tile?.stream) tile.stream.getTracks().forEach((t) => t.stop());
    setTile(null);
  };

  const getBounds = useCallback(() => containerRef.current?.getBoundingClientRect(), [containerRef]);

  const startDrag = (e) => {
    e.preventDefault();
    dragStateRef.current = { mode: 'move', startX: e.clientX, startY: e.clientY, tile: { ...tile } };
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', endDrag);
  };

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragStateRef.current = { mode: 'resize', startX: e.clientX, startY: e.clientY, tile: { ...tile } };
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', endDrag);
  };

  const onDragMove = (e) => {
    const bounds = getBounds();
    const drag = dragStateRef.current;
    if (!bounds || !drag) return;
    const dxPct = ((e.clientX - drag.startX) / bounds.width) * 100;
    const dyPct = ((e.clientY - drag.startY) / bounds.height) * 100;

    if (drag.mode === 'move') {
      setTile((prev) => (prev ? { ...prev, x: Math.min(95, Math.max(0, drag.tile.x + dxPct)), y: Math.min(95, Math.max(0, drag.tile.y + dyPct)) } : prev));
    } else {
      setTile((prev) => (prev ? { ...prev, width: Math.min(70, Math.max(12, drag.tile.width + dxPct)), height: Math.min(70, Math.max(12, drag.tile.height + dyPct)) } : prev));
    }
  };

  const endDrag = () => {
    dragStateRef.current = null;
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', endDrag);
  };

  return (
    <>
      <div className="absolute bottom-3 right-3 z-30">
        {!tile ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2.5 rounded-full bg-black/70 border border-white/20 text-white cursor-pointer hover:bg-black/90"
              title="Ghép video/webcam vào phiên live"
            >
              <Video className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute bottom-12 right-0 w-48 rounded-2xl bg-black/85 backdrop-blur border border-white/20 p-2 space-y-1">
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold text-white hover:bg-white/10 cursor-pointer">
                  <Video className="w-3.5 h-3.5" /> Tải Video Lên
                </button>
                <button onClick={handleUseWebcam} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold text-white hover:bg-white/10 cursor-pointer">
                  <Camera className="w-3.5 h-3.5" /> Dùng Webcam
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelected} className="hidden" />
          </div>
        ) : null}
      </div>

      {tile && (
        <div
          className="absolute z-40 rounded-xl overflow-hidden border-2 border-white/40 shadow-2xl group"
          style={{ left: `${tile.x}%`, top: `${tile.y}%`, width: `${tile.width}%`, height: `${tile.height}%` }}
        >
          <video
            autoPlay
            muted
            loop={tile.srcType === 'file'}
            playsInline
            className="w-full h-full object-cover bg-black"
            src={tile.srcType === 'file' ? tile.url : undefined}
            ref={(el) => {
              if (el && tile.srcType === 'webcam' && el.srcObject !== tile.stream) el.srcObject = tile.stream;
            }}
          />
          <div
            onPointerDown={startDrag}
            className="absolute top-0 left-0 right-0 h-6 bg-black/60 flex items-center justify-between px-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Move className="w-3 h-3 text-white" />
            <button onPointerDown={(e) => e.stopPropagation()} onClick={closeTile} className="text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div
            onPointerDown={startResize}
            className="absolute bottom-0 right-0 w-4 h-4 bg-white/30 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      )}
    </>
  );
}
