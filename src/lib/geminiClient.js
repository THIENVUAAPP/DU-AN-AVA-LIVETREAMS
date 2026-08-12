import { pcmBase64ToWavUrl } from './pcmToWav';

// Gọi AI trò chuyện (Gemini, qua proxy server api/gemini-reply.js — key không lộ ra trình duyệt).
// CHỈ dùng cho quà tặng & người bình luận mới, đúng phạm vi yêu cầu — không gọi cho mọi bình luận
// thường (vừa tốn hạn mức miễn phí, vừa không cần thiết vì đã có kho câu thoại có sẵn REACTION_LINES).
// Luôn có thể lỗi (chưa cấu hình key, hết hạn mức, mất mạng...) — nơi gọi hàm này PHẢI tự lo phương án
// dự phòng (giọng đọc Web Speech + câu thoại local), không được để vỡ luồng chính của sàn nhảy.
export async function fetchAiReply({ kind, username, characterName, giftName, personality }) {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  const res = await fetch('/api/gemini-reply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, username, characterName, giftName, personality, apiKey }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `AI reply lỗi HTTP ${res.status}`);
  }
  const { text, audioBase64 } = await res.json();
  return { text, audioUrl: audioBase64 ? pcmBase64ToWavUrl(audioBase64) : null };
}
