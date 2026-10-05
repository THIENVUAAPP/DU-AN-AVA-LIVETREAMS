import { pcmBase64ToWavUrl } from './pcmToWav';

/**
 * Tạo câu trả lời thông minh dự phòng khi mất kết nối mạng hoặc chưa cấu hình API key
 */
function generateContextualFallbackReply({ question = '', username = 'bạn', role = 'assistant', gameType = '' }) {
  const q = (question || '').toLowerCase().trim();
  const user = username || 'bạn';

  if (q.includes('chào') || q.includes('hi') || q.includes('hello')) {
    return `Shop em rất vui được đón tiếp bạn trong buổi live hôm nay nha!`;
  }
  if (q.includes('game') || q.includes('chơi') || q.includes('cách')) {
    if (gameType === 'battle') {
      return `Trận đại chiến PK đang rất kịch tính, bạn hãy chọn phe tiếp sức nhé!`;
    }
    return `Trận đại chiến Cắm Cờ đang rất sôi động, bạn hãy chọn ô cắm cờ cùng mọi người nhé!`;
  }
  if (q.includes('ai') || q.includes('tên') || q.includes('bot')) {
    return `Em là Trợ Lý AI của phiên live hôm nay, rất vui được hỗ trợ bạn ạ!`;
  }
  if (q.includes('quà') || q.includes('gift') || q.includes('xu') || q.includes('tặng')) {
    return `Từng phần quà của bạn là nguồn động lực cực lớn cho cả phòng live ạ!`;
  }
  if (q.includes('thắng') || q.includes('thua') || q.includes('ai dẫn') || q.includes('top')) {
    return `Trận đấu đang ở giai đoạn quyết liệt nhất, bạn cùng cổ vũ hết mình nhé!`;
  }
  if (q.includes('đẹp') || q.includes('xinh') || q.includes('hay') || q.includes('giỏi')) {
    return `Em cảm ơn lời khen cực kỳ dễ thương của bạn nha!`;
  }

  // Câu trả lời giao tiếp thông minh tổng quát ngắn gọn 10-15 từ (Tuyệt đối không ép bán hàng)
  const smartGenericReplies = [
    `Dạ em cảm ơn ${user} đã tương tác và gửi bình luận trong phiên live của em nha!`,
    `Dạ em rất vui được đồng hành cùng ${user} hôm nay, chúc bạn xem live thật vui vẻ ạ!`,
    `Dạ em đã ghi nhận ý kiến của ${user} rồi ạ, cảm ơn bạn rất nhiều!`,
    `Dạ vâng đúng rồi bạn nha, cảm ơn ${user} đã chia sẻ cùng phòng live ạ!`
  ];
  return smartGenericReplies[Math.floor(Math.random() * smartGenericReplies.length)];
}

// Gọi AI trò chuyện & trả lời câu hỏi thông minh (Gemini, qua proxy server api/gemini-reply.js hoặc trực tiếp).
export async function fetchAiReply({ kind = 'question', username, characterName, giftName, personality, question, role, context, gameType }) {
  const apiKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('GEMINI_API_KEY') || import.meta.env?.VITE_GEMINI_API_KEY || '';
  
  // 1. Thử gọi qua Backend Server API Proxy
  try {
    const res = await fetch('/api/gemini-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, username, characterName, giftName, personality, question, role, context, gameType, apiKey }),
    });
    if (res.ok) {
      const { text, audioBase64 } = await res.json();
      if (text && text.trim()) {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 5, reason: 'AI LLM (Gemini) Response' } }));
        return { text: text.trim(), audioUrl: audioBase64 ? pcmBase64ToWavUrl(audioBase64) : null };
      }
    }
  } catch (proxyErr) {
    // Proxy server offline hoặc không phản hồi
  }

  // 2. Thử gọi trực tiếp Google Generative Language API (Gemini 2.0 Flash — Thông minh nhất, Tiết kiệm chi phí)
  if (apiKey && apiKey.trim()) {
    try {
      const promptText = `Bạn là Trợ lý Livestream bán hàng chuyên nghiệp.
Khán giả "${username || 'bạn'}" vừa hỏi/bình luận: "${question || giftName || 'Xin chào'}".
Bối cảnh: ${context || 'Livestream bán hàng trực tuyến'}.
YÊU CẦU BẮT BUỘC:
1. Trả lời thẳng vào câu hỏi, cực kỳ ngắn gọn, súc tích trong DUY NHẤT 1 CÂU từ 10 đến 15 từ.
2. Tự xưng là "em", gọi khách là "bạn" hoặc xưng hô lịch sự.
3. Tuyệt đối KHÔNG lặp lại câu hỏi của khách, KHÔNG hỏi ngược lại dài dòng, KHÔNG lan man.
4. Chỉ trả về đúng 1 câu thoại tiếng Việt không dấu ngoặc kép.`;

      const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: promptText }]
          }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 80 }
        })
      });
      if (directRes.ok) {
        const directData = await directRes.json();
        const txt = directData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["“]|["”]$/g, '');
        if (txt) {
          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 5, reason: 'AI LLM (Gemini) Direct Response' } }));
          return { text: txt, audioUrl: null };
        }
      }
    } catch (e) {
      console.warn('Direct Gemini Flash call error:', e);
    }
  }

  // 3. Phản hồi thông minh dự phòng (Zero-Fail Offline Fallback)
  const fallbackText = generateContextualFallbackReply({ question: question || giftName, username, role, gameType });
  return { text: fallbackText, audioUrl: null };
}

export async function askGeminiLiveAi(questionOrParams, options = {}) {
  if (typeof questionOrParams === 'string') {
    return fetchAiReply({
      kind: 'question',
      question: questionOrParams,
      username: options.username || 'Khán Giả',
      role: options.role || 'assistant',
      context: options.context || '',
      gameType: options.gameType || '',
      apiKey: options.apiKey || ''
    });
  }
  return fetchAiReply({
    kind: 'question',
    username: questionOrParams?.username || 'Khán Giả',
    question: questionOrParams?.question || '',
    role: questionOrParams?.role || 'assistant',
    context: questionOrParams?.context || '',
    gameType: questionOrParams?.gameType || '',
    apiKey: questionOrParams?.apiKey || ''
  });
}

export default {
  fetchAiReply,
  askGeminiLiveAi
};

