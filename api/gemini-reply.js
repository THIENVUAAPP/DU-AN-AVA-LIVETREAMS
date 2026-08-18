// Proxy server cho Gemini API (text + TTS) — GIẤU API key ở server, không bao giờ gửi key
// xuống trình duyệt. Hỗ trợ: cảm ơn tặng quà, chào mừng người mới, và trả lời thông minh câu hỏi ngoài vùng của khán giả.
//
// Model: gemini-1.5-flash (Bộ não nhanh nhất <500ms, thông minh nhất và chi phí rẻ nhất của Google AI Studio)
const TEXT_MODEL = 'gemini-1.5-flash';
const TTS_MODEL = 'gemini-1.5-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const PERSONALITY_VOICE_HINT = {
  cute: 'nhẹ nhàng, ngọt ngào, dễ thương',
  cool: 'ngầu, chất, tự tin',
  funny: 'hài hước, lầy lội, tấu hài',
  luxury: 'sang chảnh, quý phái',
  energetic: 'sôi động, hào hứng, tràn đầy năng lượng',
  sassy: 'cá tính, lanh lợi, có chút "gắt"',
};

function buildPrompt({ kind, username, characterName, giftName, personality, question, role, context, gameType }) {
  const tone = PERSONALITY_VOICE_HINT[personality] || 'vui vẻ, thân thiện, duyên dáng';
  const safeUsername = String(username || 'bạn khán giả').slice(0, 40);
  const safeQuestion = String(question || giftName || '').slice(0, 200);

  if (kind === 'gift') {
    const safeGift = String(giftName || 'món quà').slice(0, 40);
    return `Bạn là MC / Idol dẫn chương trình livestream giải trí trên TikTok tại Việt Nam, phong cách ${tone}. Một khán giả tên "${safeUsername}" vừa tặng quà "${safeGift}". Viết 1 câu cảm ơn thật tự nhiên, chân thành, hài hước, có duyên, nhắc tên khán giả. KHÔNG quá 25 từ, KHÔNG dùng dấu ngoặc kép, tuyệt đối KHÔNG nói tục, KHÔNG nói bậy. Chỉ trả về đúng 1 câu thoại tiếng Việt, không giải thích gì thêm.`;
  }
  
  if (kind === 'welcome') {
    return `Bạn là MC / Idol dẫn chương trình livestream trên TikTok tại Việt Nam, phong cách ${tone}. Một khán giả tên "${safeUsername}" vừa vào xem và bình luận lần đầu. Viết 1 câu chào mừng thật tự nhiên, dí dỏm, có duyên, nhắc tên khán giả. KHÔNG quá 25 từ, KHÔNG dùng dấu ngoặc kép, tuyệt đối KHÔNG nói tục, KHÔNG nói bậy. Chỉ trả về đúng 1 câu thoại tiếng Việt, không giải thích gì thêm.`;
  }

  // Tình huống: Khán giả đặt câu hỏi ngoài vùng cài đặt hoặc tương tác tự do (Out-of-scope Q&A)
  const roleTitle = role === 'game' || role === 'blv' 
    ? 'Bình Luận Viên Game Livestream (hào hùng, sôi động, khích lệ)' 
    : (role === 'assistant' ? 'Trợ Lý Livestream & Quản Lý Bán Hàng (ngọt ngào, chu đáo, hỗ trợ)' : 'Idol Livestream Chính (duyên dáng, thông minh, gần gũi)');

  const contextInfo = context || (gameType === 'map' ? 'Đại chiến cắm cờ Bản Đồ Tổ Quốc' : gameType === 'battle' ? 'Đại Chiến PK Phe Xanh vs Phe Đỏ' : 'Phiên Livestream Tương Tác & Bán Hàng AIDOL');

  return `Bạn là ${roleTitle} trong phiên ${contextInfo}.
Khán giả "${safeUsername}" vừa hỏi/bình luận: "${safeQuestion}".

QUY TẮC PHẢN HỒI BẮT BUỘC:
1. Trả lời trực tiếp, thông minh, đúng trọng tâm câu hỏi của khán giả.
2. Độ dài: Ngắn gọn, súc tích (1 đến 2 câu ngắn, DƯỚI 30 TỪ) để phát bằng giọng đọc mượt mà.
3. Ngôn phong: Lịch sự, văn minh, duyên dáng, truyền cảm hứng.
4. AN TOÀN TUYỆT ĐỐI: Tuyệt đối KHÔNG nói tục, KHÔNG nói bậy, KHÔNG dùng từ ngữ xúc phạm hay thô thiển.
5. Định dạng: Chỉ trả về đúng 1 câu thoại tiếng Việt thuần túy, KHÔNG có dấu ngoặc kép "", KHÔNG có tiêu đề hay lời giải thích phụ.`;
}

async function generateText(prompt, apiKey) {
  const res = await fetch(`${API_BASE}/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 120 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini text lỗi ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini text: không có nội dung trả về');
  return text.replace(/^["“]|["”]$/g, '');
}

async function generateSpeech(text, apiKey) {
  const res = await fetch(`${API_BASE}/${TTS_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini TTS lỗi ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const audioBase64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!audioBase64) throw new Error('Gemini TTS: không có audio trả về');
  return audioBase64; // PCM 16-bit, mono, 24kHz
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { kind, username, characterName, giftName, personality, question, role, context, gameType, apiKey: clientApiKey } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      return res.status(503).json({ error: 'Chưa cấu hình GEMINI_API_KEY trên server hoặc client.' });
    }

    const prompt = buildPrompt({ kind: kind || 'question', username, characterName, giftName, personality, question, role, context, gameType });
    const text = await generateText(prompt, apiKey);

    let audioBase64 = null;
    try {
      audioBase64 = await generateSpeech(text, apiKey);
    } catch (ttsError) {
      // Client sẽ tự đọc qua /api/tts hoặc Web Speech API
    }

    return res.status(200).json({ text, audioBase64 });
  } catch (error) {
    console.error('gemini-reply lỗi:', error);
    return res.status(500).json({ error: error.message });
  }
}
