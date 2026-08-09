import React from 'react';
import { MessagesSquare } from 'lucide-react';

const PLATFORM_ORDER = ['tiktok', 'youtube', 'facebook', 'system'];

const PLATFORM_STYLE = {
  tiktok: { label: 'TikTok', badge: 'bg-black text-cyan-300 border-pink-500/40', emoji: '🎵', accent: 'from-[#EF4444]/20 to-transparent border-[#EF4444]/30' },
  youtube: { label: 'YouTube', badge: 'bg-red-600/20 text-red-300 border-red-500/40', emoji: '▶️', accent: 'from-red-500/20 to-transparent border-red-500/30' },
  facebook: { label: 'Facebook', badge: 'bg-blue-600/20 text-blue-300 border-blue-500/40', emoji: '📘', accent: 'from-[#3B82F6]/20 to-transparent border-[#3B82F6]/30' },
  system: { label: 'Hệ Thống', badge: 'bg-purple-600/20 text-purple-300 border-purple-500/40', emoji: '⚙️', accent: 'from-[#8B5CF6]/20 to-transparent border-[#8B5CF6]/30' },
};

// Bình luận trực tiếp thô — hiển thị MỌI dòng chat đổ về (không chỉ dòng trúng luật/sinh nhân vật ở
// Nhật Ký Phản Hồi). Gom riêng theo TỪNG nền tảng (TikTok/YouTube/Facebook đứng cụm riêng, không trộn
// lẫn) và CHỈ hiện cột của nền tảng đang thực sự kết nối/phát live — linh hoạt theo đúng kênh đang dùng,
// không hiện dư cột trống.
export default function DanceFloorCommentFeed({ feed, activePlatforms }) {
  const feedPlatforms = [...new Set(feed.map((e) => e.platform))];
  const platformsToShow = (activePlatforms && activePlatforms.length > 0 ? activePlatforms : feedPlatforms)
    .filter((p) => PLATFORM_STYLE[p]);
  const orderedPlatforms = PLATFORM_ORDER.filter((p) => platformsToShow.includes(p));

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#181020] via-[#0A0A0A] to-[#121218]">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <MessagesSquare className="w-4 h-4 text-cyan-400" /> Bình Luận Trực Tiếp
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
          ● LIVE
        </span>
      </h4>
      {feed.length === 0 || orderedPlatforms.length === 0 ? (
        <p className="text-xs text-gray-500">Chưa có bình luận nào — bật Mô Phỏng hoặc kết nối kênh thật để xem chat đổ về đây.</p>
      ) : (
        <div className={`grid grid-cols-1 ${orderedPlatforms.length >= 3 ? 'lg:grid-cols-3' : orderedPlatforms.length === 2 ? 'sm:grid-cols-2' : ''} gap-3`}>
          {orderedPlatforms.map((platformId) => {
            const platform = PLATFORM_STYLE[platformId];
            const entries = feed.filter((e) => e.platform === platformId);
            return (
              <div key={platformId} className="space-y-1.5">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit font-bold text-[10px] ${platform.badge}`}>
                  {platform.emoji} {platform.label} <span className="opacity-60">({entries.length})</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {entries.length === 0 ? (
                    <p className="text-[10px] text-gray-600 px-1">Chưa có bình luận trên {platform.label}.</p>
                  ) : (
                    entries.map((entry) => (
                      <div key={entry.id} className={`p-2.5 rounded-2xl border bg-gradient-to-br ${platform.accent} animate-fadeIn`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {entry.username?.[0]?.toUpperCase() || '?'}
                          </span>
                          <span className="text-[10px] font-black text-white truncate flex-1">{entry.username}</span>
                        </div>
                        <p className="text-xs text-gray-100 leading-snug break-words">{entry.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
