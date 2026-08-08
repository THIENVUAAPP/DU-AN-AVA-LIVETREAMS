import React from 'react';
import { Grid, RefreshCw, X } from 'lucide-react';

// Panel "Lưới Đa Camera THẬT" — độc lập với Director Suite mô phỏng sẵn có.
// Cho phép gán tối đa 4 camera vật lý thật (qua deviceId) vào lưới 2x2,
// hiển thị đồng thời trong khung hình phát live (composite ở processFrame()).
export default function MultiCameraGrid({
  active,
  onToggleActive,
  devices,
  slots,
  onAssignSlot,
  onRefreshDevices,
  videoRefsRef,
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Grid className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              🎥 Lưới Đa Camera Thật
            </h3>
            <p className="text-[10px] text-gray-500 font-mono">
              Gán tối đa 4 camera vật lý để hiển thị đồng thời trên khung hình phát live
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshDevices}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer"
            title="Quét lại danh sách camera"
          >
            <RefreshCw className="w-3 h-3" />
            <span>QUÉT CAMERA</span>
          </button>
          <button
            onClick={onToggleActive}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              active ? 'bg-cyan-500 text-white shadow-glow-blue' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {active ? '🟢 ĐANG BẬT LƯỚI ĐA CAM' : '⚪ BẬT LƯỚI ĐA CAM'}
          </button>
        </div>
      </div>

      {devices.length <= 1 && (
        <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          ⚠️ Chỉ phát hiện {devices.length} camera trên máy này. Cần cắm thêm camera vật lý (USB webcam, capture card...) để dùng lưới đa góc.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {slots.map((deviceId, i) => (
          <div key={i} className="space-y-1">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
              <video
                ref={(el) => { videoRefsRef.current[i] = el; }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: deviceId ? 'block' : 'none' }}
              />
              {!deviceId && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px] font-black">
                  Ô {i + 1} — Trống
                </div>
              )}
              {deviceId && (
                <button
                  onClick={() => onAssignSlot(i, null)}
                  className="absolute top-1 right-1 w-5 h-5 rounded bg-black/70 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
                  title="Bỏ gán camera này"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <select
              value={deviceId || ''}
              onChange={(e) => onAssignSlot(i, e.target.value || null)}
              className="w-full text-[10px] bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-gray-300"
            >
              <option value="">— Chọn camera cho Ô {i + 1} —</option>
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
