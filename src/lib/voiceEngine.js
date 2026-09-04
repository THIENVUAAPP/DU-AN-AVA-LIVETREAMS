// Đọc bình luận/phản hồi bằng giọng nói ngay trong trình duyệt (Web Speech API) — miễn phí, không cần
// API key. Mỗi "tính cách" nhân vật có tông/tốc độ giọng riêng + rung động nhẹ ngẫu nhiên mỗi lần đọc
// để đỡ đều đều máy móc.
//
// Giới hạn thật cần biết: Web Speech API dùng giọng đọc hệ thống (chất lượng tuỳ trình duyệt/OS),
// không có khả năng "diễn cảm" như giọng AI thần kinh (neural TTS) thật. Muốn giọng tự nhiên/nhấn nhá
// như người thật 100%, cần tích hợp API TTS trả phí (ElevenLabs, Google Cloud TTS, Azure Speech) —
// đây là quyết định cần anh cung cấp API key riêng, không phải giới hạn có thể sửa bằng code không.
export const VOICE_PROFILES = {
  cute: { pitch: 1.7, rate: 1.05 },
  cool: { pitch: 0.75, rate: 0.92 },
  funny: { pitch: 1.5, rate: 1.15 },
  luxury: { pitch: 0.85, rate: 0.85 },
  energetic: { pitch: 1.4, rate: 1.25 },
  sassy: { pitch: 1.25, rate: 1.05 },
};

let cachedVoices = [];

function loadVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) cachedVoices = voices;
  return cachedVoices;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Ưu tiên giọng tiếng Việt "chất lượng cao" nếu trình duyệt/OS có sẵn (Google/Microsoft/Natural/
// Neural thường tự nhiên hơn hẳn giọng robot mặc định), rồi mới rơi về giọng vi-VN bất kỳ, cuối cùng
// mới dùng giọng mặc định của máy.
function pickVietnameseVoice() {
  const voices = loadVoices();
  const viVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("vi"));
  const premium = viVoices.find((v) => /google|microsoft|natural|neural|premium/i.test(v.name));
  return premium || viVoices[0] || voices[0] || null;
}

export function isVoiceSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function listAvailableVietnameseVoices() {
  return loadVoices().filter((v) => v.lang?.toLowerCase().startsWith("vi"));
}

// Đọc 1 câu bằng giọng theo tính cách. Không throw — lỗi giọng đọc không được làm gãy luồng xử lý chính.
export function speakLine(text, personality) {
  if (!isVoiceSupported() || !text) return;
  try {
    window.speechSynthesis.cancel(); // tránh giọng đọc chồng chéo khi trigger dồn dập
    const utter = new SpeechSynthesisUtterance(text);
    const profile = VOICE_PROFILES[personality] || VOICE_PROFILES.funny;
    // Rung động nhẹ ngẫu nhiên quanh tông/tốc độ gốc — nghe "sống" hơn thay vì lặp lại y hệt mỗi lần.
    const jitter = () => (Math.random() - 0.5) * 0.12;
    utter.pitch = Math.min(2, Math.max(0.5, profile.pitch + jitter()));
    utter.rate = Math.min(1.5, Math.max(0.6, profile.rate + jitter()));
    utter.volume = 0.95;
    const voice = pickVietnameseVoice();
    if (voice) utter.voice = voice;
    utter.lang = voice?.lang || "vi-VN";
    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.error("speakLine lỗi:", e);
  }
}

export function stopSpeaking() {
  if (isVoiceSupported()) window.speechSynthesis.cancel();
}
