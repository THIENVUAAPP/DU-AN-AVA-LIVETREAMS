import React from 'react';
import { MessageCircleHeart } from 'lucide-react';

// Nhật ký phản hồi trực tiếp — log các câu "nhân vật đáp lại" theo giọng tính cách khi bị gọi tên/trigger,
// giúp sàn nhảy sinh động, hài hước, thực tế hơn thay vì chỉ hiện hiệu ứng im lặng.
export default function DanceFloorReactionFeed({ feed }) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/10">
      <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
        <MessageCircleHeart className="w-4 h-4 text-pink-400" /> Nhật Ký Phản Hồi Trực Tiếp
      </h4>
      {feed.length === 0 ? (
        <p className="text-xs text-gray-500">Chưa có phản hồi nào — thử gọi tên 1 nhân vật hoặc bấm nút Test bên dưới.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {feed.map((entry) => (
            <div key={entry.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 animate-fadeIn">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-black text-emerald-400">{entry.characterName}</span>
                <span className="text-[9px] text-gray-500">gửi tới {entry.username}</span>
              </div>
              <p className="text-xs text-gray-200 leading-snug">{entry.line}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
