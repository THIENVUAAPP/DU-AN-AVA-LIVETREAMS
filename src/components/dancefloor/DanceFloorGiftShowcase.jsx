import React from 'react';
import { Gift, PartyPopper } from 'lucide-react';

// Bảng "WOW" siêu to hiện nổi giữa sàn diễn vài giây mỗi khi có quà tặng — ảnh nhân vật to, tên người
// tặng, tên quà, hiệu ứng lấp lánh — làm điểm nhấn ăn mừng thật sự nổi bật thay vì chỉ 1 dòng chữ nhỏ.
export default function DanceFloorGiftShowcase({ giftShowcase }) {
  if (!giftShowcase) return null;
  const { username, giftName, characterName, character } = giftShowcase;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" />
      <div className="relative flex flex-col items-center gap-3 px-8 py-6 rounded-3xl bg-gradient-to-br from-amber-500/90 via-orange-500/90 to-pink-600/90 border-2 border-amber-300 shadow-[0_0_60px_20px_rgba(250,204,21,0.5)] animate-fadeIn">
        <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest">
          <PartyPopper className="w-4 h-4" /> Quà Xịn Vừa Về <PartyPopper className="w-4 h-4" />
        </div>

        {character?.mediaType === 'image' && character.mediaUrl ? (
          <img src={character.mediaUrl} alt={characterName} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl" />
        ) : (
          <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-5xl shadow-2xl">
            {character?.emoji || '🎉'}
          </div>
        )}

        <div className="text-center">
          <p className="text-2xl font-black text-white drop-shadow-lg">{username}</p>
          <p className="text-sm font-bold text-amber-100 flex items-center justify-center gap-1.5 mt-1">
            <Gift className="w-4 h-4" /> vừa tặng {giftName} — {characterName} lên sàn ngay!
          </p>
        </div>
      </div>
    </div>
  );
}
