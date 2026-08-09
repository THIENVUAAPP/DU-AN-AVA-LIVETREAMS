import React from 'react';
import { Shuffle, Volume2, VolumeX, Clock, MonitorPlay } from 'lucide-react';
import { COMMENTARY_STYLES } from '../../lib/danceFloorData';

// Cấu hình tự động hoá — ít bấm lại hơn sau khi setup xong, đặt ở khu vực phía dưới sàn diễn.
export default function DanceFloorAutomationPanel({
  simulationEnabled, onToggleSimulation,
  voiceEnabled, onToggleVoice,
  commentaryStyleId, onChangeCommentaryStyle,
  onRunAutoShuffle,
  scheduleEnabled, scheduleStartHour, scheduleEndHour, onUpdateSchedule,
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-sm font-black text-white flex items-center gap-2">
        <Shuffle className="w-4 h-4 text-[#8B5CF6]" /> Tự Động Hoá Sàn Nhảy
      </h4>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-300">Chế Độ Mô Phỏng Bình Luận</p>
          <p className="text-[9px] text-gray-500 max-w-xs">TikTok/Facebook chưa có API bình luận công khai — chạy mô phỏng đầy đủ pipeline trên kênh đã chọn.</p>
        </div>
        <button
          onClick={onToggleSimulation}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black shrink-0 cursor-pointer transition-all ${
            simulationEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {simulationEnabled ? '● ĐANG CHẠY' : 'BẬT'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
          Giọng Đọc Bình Luận
        </span>
        <button
          onClick={onToggleVoice}
          className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${voiceEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
        >
          {voiceEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}
        </button>
      </div>

      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Phong Cách Bình Luận Phiên Này</label>
        <select
          value={commentaryStyleId}
          onChange={(e) => onChangeCommentaryStyle(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
        >
          {COMMENTARY_STYLES.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onRunAutoShuffle}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EF4444] text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5"
      >
        <Shuffle className="w-3.5 h-3.5" /> AUTO 1-CHẠM (Đổi Nhân Vật + Nhạc + Điệu Nhảy + Sàn Ngẫu Nhiên)
      </button>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-400" /> Chạy 24/24 Giới Hạn Khung Giờ
        </span>
        <button
          onClick={() => onUpdateSchedule({ scheduleEnabled: !scheduleEnabled })}
          className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${scheduleEnabled ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'}`}
        >
          {scheduleEnabled ? 'ĐANG GIỚI HẠN' : 'CHẠY LIÊN TỤC 24/24'}
        </button>
      </div>
      {scheduleEnabled && (
        <div className="flex items-center gap-2">
          <select
            value={scheduleStartHour}
            onChange={(e) => onUpdateSchedule({ scheduleStartHour: Number(e.target.value) })}
            className="flex-1 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
          >
            {Array.from({ length: 24 }).map((_, h) => <option key={h} value={h}>{h}h</option>)}
          </select>
          <span className="text-gray-500 text-xs">đến</span>
          <select
            value={scheduleEndHour}
            onChange={(e) => onUpdateSchedule({ scheduleEndHour: Number(e.target.value) })}
            className="flex-1 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs outline-none"
          >
            {Array.from({ length: 24 }).map((_, h) => <option key={h} value={h}>{h}h</option>)}
          </select>
        </div>
      )}

      <button
        onClick={() => window.open('?overlay=dancefloor', '_blank', 'width=900,height=700')}
        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5"
      >
        <MonitorPlay className="w-3.5 h-3.5" /> Mở Cửa Sổ Overlay (Capture vào OBS/LIVE Studio)
      </button>
    </div>
  );
}
