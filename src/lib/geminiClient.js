import { pcmBase64ToWavUrl } from './pcmToWav';

/**
 * Tạo câu trả lời thông minh dự phòng khi mất kết nối mạng hoặc chưa cấu hình API key
 */
function generateContextualFallbackReply({ question = '', username = 'bạn', role = 'assistant', gameType = '' }) {
  const q = (question || '').toLowerCase().trim();
  const user = username || 'bạn';

  if (q.includes('chào') || q.includes('hi') || q.includes('hello')) {
    return `Dạ em chào bạn ${user} nha! Chúc bạn có một buổi xem live thật vui vẻ và ngập tràn năng lượng nhé!`;
  }
  if (q.includes('game') || q.includes('chơi') || q.includes('cách')) {
    if (gameType === 'battle') {
      return `Dạ chào bạn ${user}! Đây là trận đại chiến PK kịch tính. Bạn hãy chọn phe và tiếp sức cho chiến binh nhé!`;
    }
    return `Dạ chào bạn ${user}! Trận đại chiến Cắm Cờ Việt Nam đang rất sôi động, bạn hãy chọn ô và cắm cờ cùng mọi người nhé!`;
  }
  if (q.includes('ai') || q.includes('tên') || q.includes('bot')) {
    return `Dạ em là Trợ Lý AI của phiên live hôm nay, rất vui được đồng hành và hỗ trợ bạn ${user} ạ!`;
  }
  if (q.includes('quà') || q.includes('gift') || q.includes('xu') || q.includes('tặng')) {
    return `Em cảm ơn bạn ${user} rất nhiều! Từng phần quà của bạn là nguồn động lực cực lớn cho cả phòng live!`;
  }
  if (q.includes('thắng') || q.includes('thua') || q.includes('ai dẫn') || q.includes('top')) {
    return `Trận đấu đang ở giai đoạn quyết liệt nhất! Bạn ${user} hãy tiếp tục cổ vũ hết mình nhé!`;
  }
  if (q.includes('đẹp') || q.includes('xinh') || q.includes('hay') || q.includes('giỏi')) {
    return `Dạ em cảm ơn lời khen cực kỳ dễ thương của bạn ${user}! Yêu bạn rất nhiều!`;
  }

  // Câu trả lời giao tiếp thông minh tổng quát
  const smartGenericReplies = [
    `Câu hỏi của bạn ${user} rất thú vị! Cảm ơn bạn đã luôn đồng hành và ủng hộ phiên live hôm nay!`,
    `Dạ em chào bạn ${user} nha! Bạn có những ý tưởng thật tuyệt vời, cùng tiếp tục theo dõi livestream nhé!`,
    `Dạ em đã ghi nhận bình luận của bạn ${user}! Chúc bạn ${user} một ngày ngập tràn niềm vui và may mắn nha!`,
    `Em cảm ơn bạn ${user} đã tương tác nhiệt tình! Hãy thả tim và chia sẻ live để cùng tạo nên kỷ lục mới nhé!`
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
        return { text: text.trim(), audioUrl: audioBase64 ? pcmBase64ToWavUrl(audioBase64) : null };
      }
    }
  } catch (proxyErr) {
    // Proxy server offline hoặc không phản hồi
  }

  // 2. Thử gọi trực tiếp Google Generative Language API (Gemini 1.5 Flash)
  if (apiKey && apiKey.trim()) {
    try {
      const promptText = `Bạn là Trợ lý Livestream / Bình luận viên AI thông minh, hài hước, năng lượng cao cho sự kiện livestream Việt Nam.
Khán giả tên là "${username || 'bạn'}" vừa bình luận: "${question || giftName || 'Xin chào'}".
Bối cảnh: ${context || 'Livestream tương tác minigame'}.
Yêu cầu: Trả lời tự nhiên, thân thiện, ngắn gọn (1-2 câu ngắn, tối đa 25 từ). QUY TẮC XƯNG HÔ BẮT BUỘC: Bạn luôn tự xưng là "em" và gọi khán giả là "bạn" hoặc "chào bạn ${username || 'bạn'}". Đây là quy tắc tuyệt đối, chỉ dùng đại từ "em" và "bạn" trong mọi trường hợp. Tuyệt đối không nói tục. Chỉ trả về đúng 1 câu thoại tiếng Việt không dấu ngoặc kép.`;

      const directRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: promptText }]
          }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 100 }
        })
      });
      if (directRes.ok) {
        const directData = await directRes.json();
        const txt = directData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.replace(/^["“]|["”]$/g, '');
        if (txt) return { text: txt, audioUrl: null };
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

