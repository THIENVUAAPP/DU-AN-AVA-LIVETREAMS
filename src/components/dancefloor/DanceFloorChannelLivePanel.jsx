import React from 'react';
import { Radio, RadioTower, Music2, Youtube, Facebook } from 'lucide-react';

const PLATFORM_ICON = { tiktok: Music2, youtube: Youtube, facebook: Facebook };

// Nguồn kênh live + nút Phát Live Đa Kênh — chức năng dùng thường xuyên nhất, đặt cạnh sàn diễn.
// Dùng thẳng kênh TikTok/YouTube/Facebook đã kết nối sẵn ở Restream Đa Nền Tảng, không đăng nhập lại.
export default function DanceFloorChannelLivePanel({ connectedChannels, selectedChannelIds, onToggleChannel, isLive, onToggleLive }) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <Radio className="w-4 h-4 text-[#EF4444]" /> Nguồn Kênh Live
      </h4>
      {connectedChannels.length === 0 ? (
        <p className="text-xs text-gray-500">
          Chưa có kênh nào được kết nối. Vào tab "Restream Đa Nền Tảng" để kết nối TikTok / YouTube / Facebook trước.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {connectedChannels.map((ch) => {
            const platformKey = ch.id.startsWith('tiktok') ? 'tiktok' : ch.id.startsWith('youtube') ? 'youtube' : ch.id.startsWith('facebook') ? 'facebook' : null;
            const Icon = PLATFORM_ICON[platformKey] || Radio;
            const isSelected = selectedChannelIds.includes(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => onToggleChannel(ch.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-black/30 border-white/10 opacity-60'
                }`}
              >
                <Icon className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-white truncate">{ch.name}</p>
                  <span className={`text-[9px] font-bold ${ch.status === 'connected' ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {ch.status === 'connected' ? '● Đã Kết Nối' : '○ Chưa Kết Nối'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
        <p className="text-xs font-black text-white">
          {isLive ? `🔴 ĐANG PHÁT LIVE TRÊN ${selectedChannelIds.length} KÊNH` : 'Chưa Phát Live'}
        </p>
        <p className="text-[9px] text-gray-500">Dùng đúng tài khoản/stream key đã kết nối sẵn — không cần đăng nhập lại.</p>
        <button
          onClick={onToggleLive}
          disabled={connectedChannels.length === 0}
          className={`w-full px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            isLive ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' : 'bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white'
          }`}
        >
          <RadioTower className="w-3.5 h-3.5" /> {isLive ? 'DỪNG PHÁT LIVE' : 'BẮT ĐẦU PHÁT LIVE'}
        </button>
      </div>
    </div>
  );
}
