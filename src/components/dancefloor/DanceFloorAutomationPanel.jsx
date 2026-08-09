import React from 'react';
import { Shuffle, Volume2, VolumeX, Clock, MonitorPlay, Music4, SkipForward } from 'lucide-react';
import { COMMENTARY_STYLES } from '../../lib/danceFloorData';

// Cấu hình tự động hoá — ít bấm lại hơn sau khi setup xong, đặt ở khu vực phía dưới sàn diễn.
export default function DanceFloorAutomationPanel({
  simulationEnabled, onToggleSimulation,
  voiceEnabled, onToggleVoice,
  commentaryStyleId, onChangeCommentaryStyle,
  onRunAutoShuffle,
  autoShuffleIntervalEnabled, autoShuffleIntervalMinutes, onUpdateAutoShuffleInterval,
  scheduleEnabled, scheduleStartHour, scheduleEndHour, onUpdateSchedule,
  musicPlaylist, musicLoopMode, onUpdateMusicLoopMode,
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

      {musicPlaylist && (
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Music4 className="w-3.5 h-3.5 text-emerald-400" /> Playlist Nhạc Nền ({musicPlaylist.trackCount} bài)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={musicPlaylist.toggle}
                disabled={musicPlaylist.trackCount === 0}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer disabled:opacity-30 ${musicPlaylist.isPlaying ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                {musicPlaylist.isPlaying ? '● ĐANG PHÁT' : 'PHÁT'}
              </button>
              <button onClick={musicPlaylist.skipNext} disabled={musicPlaylist.trackCount === 0} className="p-1.5 rounded-full bg-white/10 text-gray-300 cursor-pointer disabled:opacity-30" title="Qua bài kế tiếp">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <button
              onClick={() => onUpdateMusicLoopMode('playlist')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-black cursor-pointer ${musicLoopMode === 'playlist' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              Tuần Tự Hết Bài
            </button>
            <button
              onClick={() => onUpdateMusicLoopMode('single')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-black cursor-pointer ${musicLoopMode === 'single' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}
            >
              Lặp Lại 1 Bài
            </button>
          </div>
          <p className="text-[9px] text-gray-500 truncate">
            {musicPlaylist.trackCount === 0
              ? 'Chưa có bài nào — tải nhạc/video ở Thư Viện Âm Thanh và bật tick dùng.'
              : musicPlaylist.isPlaying
              ? `Đang phát: ${musicPlaylist.currentTrackName} — ${musicLoopMode === 'single' ? 'lặp lại đúng bài này liên tục' : 'hết bài tự động qua bài kế tiếp'}, chạy đến khi tắt.`
              : 'Đã tạm dừng — bấm PHÁT để chạy playlist nền cho nhân vật nhảy.'}
          </p>
        </div>
      )}

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

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-300">Tự Đổi Định Kỳ Theo Phút</p>
          <p className="text-[9px] text-gray-500 max-w-xs">Bật thì cứ hết mỗi khoảng phút này lại tự chạy AUTO 1-CHẠM + đổi luôn Video Nền/Sàn 3D ngẫu nhiên, chạy liên tục đến khi tắt.</p>
        </div>
        <button
          onClick={() => onUpdateAutoShuffleInterval({ autoShuffleIntervalEnabled: !autoShuffleIntervalEnabled })}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black shrink-0 cursor-pointer transition-all ${
            autoShuffleIntervalEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {autoShuffleIntervalEnabled ? '● ĐANG TỰ ĐỘNG' : 'BẬT'}
        </button>
      </div>
      {autoShuffleIntervalEnabled && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Mỗi</span>
          <input
            type="number"
            min={1}
            max={120}
            value={autoShuffleIntervalMinutes}
            onChange={(e) => onUpdateAutoShuffleInterval({ autoShuffleIntervalMinutes: Math.max(1, Number(e.target.value) || 1) })}
            className="w-16 px-2 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold outline-none text-center"
          />
          <span className="text-[10px] text-gray-400">phút</span>
        </div>
      )}

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
