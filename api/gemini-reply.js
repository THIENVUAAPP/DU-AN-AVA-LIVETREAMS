// Proxy server cho Gemini API (text + TTS miễn phí) — GIẤU API key ở server, không bao giờ gửi key
// xuống trình duyệt. Chỉ dùng cho 2 tình huống: cảm ơn người tặng quà & chào mừng người bình luận mới
// (theo đúng yêu cầu "API chỉ sử dụng cho trò chuyện giao tiếp với người tặng quà và người mới").
//
// Model: gemini-2.5-flash (sinh câu thoại) + gemini-2.5-flash-preview-tts (đọc giọng, cả 2 đều nằm
// trong hạn mức miễn phí của Google AI Studio tại thời điểm viết — xem ai.google.dev/gemini-api/docs).
// trong hạn mức miễn phí của Google AI Studio tại thời điểm viết — xem ai.google.dev/gemini-api/docs).
const TEXT_MODEL = 'gemini-2.5-flash';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const PERSONALITY_VOICE_HINT = {
  cute: 'nhẹ nhàng, ngọt ngào, dễ thương',
  cool: 'ngầu, chất, tự tin',
  funny: 'hài hước, lầy lội, tấu hài',
  luxury: 'sang chảnh, quý phái',
  energetic: 'sôi động, hào hứng, tràn đầy năng lượng',
  sassy: 'cá tính, lanh lợi, có chút "gắt"',
};

function buildPrompt({ kind, username, characterName, giftName, personality }) {
  const tone = PERSONALITY_VOICE_HINT[personality] || 'vui vẻ, thân thiện';
  const safeUsername = String(username || 'bạn khán giả').slice(0, 40);
  if (kind === 'gift') {
    const safeGift = String(giftName || 'món quà').slice(0, 40);
    return `Bạn là MC dẫn chương trình livestream bán hàng/giải trí trên TikTok tại Việt Nam, giọng điệu ${tone}. Một khán giả tên "${safeUsername}" vừa tặng quà "${safeGift}", nhân vật đại diện của họ trên sàn nhảy là "${characterName || 'một vũ công'}". Viết 1 câu cảm ơn thật tự nhiên, hài hước, có duyên, nhắc tên khán giả, KHÔNG quá 25 từ, KHÔNG dùng dấu ngoặc kép, chỉ trả về đúng 1 câu thoại tiếng Việt, không giải thích gì thêm.`;
  }
  return `Bạn là MC dẫn chương trình livestream trên TikTok tại Việt Nam, giọng điệu ${tone}. Một khán giả tên "${safeUsername}" vừa vào xem và bình luận lần đầu, nhân vật đại diện của họ trên sàn nhảy là "${characterName || 'một vũ công'}". Viết 1 câu chào mừng thật tự nhiên, dí dỏm, có duyên, nhắc tên khán giả, KHÔNG quá 25 từ, KHÔNG dùng dấu ngoặc kép, chỉ trả về đúng 1 câu thoại tiếng Việt, không giải thích gì thêm.`;
}

async function generateText(prompt, apiKey) {
  const res = await fetch(`${API_BASE}/${TEXT_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1, maxOutputTokens: 100 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini text lỗi ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini text: không có nội dung trả về');
  return text.replace(/^["“]|["”]$/g, '');
}

async function generateSpeech(text, apiKey) {
  const res = await fetch(`${API_BASE}/${TTS_MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
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
  return audioBase64; // PCM 16-bit, mono, 24kHz — client tự bọc header WAV để phát.
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { kind, username, characterName, giftName, personality, apiKey: clientApiKey } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || clientApiKey;

    if (!apiKey) {
      return res.status(503).json({ error: 'Chưa cấu hình GEMINI_API_KEY trên server hoặc client.' });
    }

    if (kind !== 'gift' && kind !== 'welcome') {
      return res.status(400).json({ error: 'Thiếu hoặc sai "kind" (chỉ nhận "gift" hoặc "welcome").' });
    }

    const prompt = buildPrompt({ kind, username, characterName, giftName, personality });
    const text = await generateText(prompt, apiKey);

    let audioBase64 = null;
    try {
      audioBase64 = await generateSpeech(text, apiKey);
    } catch (ttsError) {
      // Có câu thoại vẫn hữu ích dù giọng đọc AI lỗi — client sẽ tự đọc bằng Web Speech API thay thế.
      console.error('Gemini TTS lỗi (dùng giọng đọc dự phòng ở client):', ttsError.message);
    }

    return res.status(200).json({ text, audioBase64 });
  } catch (error) {
    console.error('gemini-reply lỗi:', error);
    return res.status(500).json({ error: error.message });
  }
}
