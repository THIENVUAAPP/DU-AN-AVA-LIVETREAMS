import { useCallback } from 'react';
import { fetchAiReply } from '../lib/geminiClient';

// Gọi Gemini AI để có câu thoại "siêu tự nhiên, hài hước" — CHỈ dùng cho quà tặng & người bình luận mới
// (đúng phạm vi yêu cầu, không tốn hạn mức miễn phí cho mọi bình luận thường). Tách khỏi
// useDanceFloorEngine.js để giữ file dưới 500 dòng. Luôn có fallback: nếu API lỗi/hết hạn mức/chưa cấu
// hình key, câu thoại local (REACTION_LINES/GIFT_THANK_LINES) đã hiện ngay từ trước đó vẫn đứng vững —
// đây chỉ là 1 lời chào/cảm ơn AI "cộng thêm" đến sau vài giây.
export function useAiReplyTrigger(pushReaction) {
  return useCallback(
    ({ kind, username, characterName, giftName, personality }) => {
      fetchAiReply({ kind, username, characterName, giftName, personality })
        .then(({ text, audioUrl }) => {
          pushReaction({ username, characterName: characterName || 'MC AI', line: text, platform: 'ai', personality: personality || 'funny', audioUrl });
        })
        .catch((err) => console.error('Gọi AI trò chuyện (Gemini) lỗi — bỏ qua, giữ câu thoại local:', err.message));
    },
    [pushReaction]
  );
}
