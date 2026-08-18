import { pcmBase64ToWavUrl } from './pcmToWav';

// Gọi AI trò chuyện & trả lời câu hỏi thông minh (Gemini, qua proxy server api/gemini-reply.js hoặc trực tiếp).
export async function fetchAiReply({ kind = 'question', username, characterName, giftName, personality, question, role, context, gameType }) {
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  try {
    const res = await fetch('/api/gemini-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, username, characterName, giftName, personality, question, role, context, gameType, apiKey }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `AI reply lỗi HTTP ${res.status}`);
    }
    const { text, audioBase64 } = await res.json();
    return { text, audioUrl: audioBase64 ? pcmBase64ToWavUrl(audioBase64) : null };
  } catch (err) {
    // Fallback thông minh trực tiếp từ Google API nếu dev server proxy gặp vấn đề
    if (apiKey) {
      try {
        const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{
                text: `Bạn là trợ lý livestream/bình luận viên thông minh, vui vẻ. Khán giả "${username || 'bạn'}" vừa hỏi: "${question || giftName}". Trả lời tự nhiên, ngắn gọn (1-2 câu, dưới 25 từ), lịch sự, tuyệt đối không nói tục. Chỉ trả về đúng 1 câu thoại tiếng Việt không dấu ngoặc kép.`
              }]
            }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 100 }
          })
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          const txt = directData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["“]|["”]$/g, '');
          if (txt) return { text: txt, audioUrl: null };
        }
      } catch (e) {}
    }
    throw err;
  }
}

export async function askGeminiLiveAi({ question, username = 'Khán Giả', role = 'assistant', context = '', gameType = '' }) {
  return fetchAiReply({
    kind: 'question',
    username,
    question,
    role,
    context,
    gameType
  });
}

export default {
  fetchAiReply,
  askGeminiLiveAi
};
