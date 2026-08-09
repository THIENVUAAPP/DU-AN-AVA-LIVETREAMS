// Đọc bình luận/phản hồi bằng giọng nói ngay trong trình duyệt (Web Speech API) — miễn phí, không cần
// API key. Mỗi "tính cách" nhân vật có tông/tốc độ giọng riêng để nghe khác biệt rõ giữa các nhân vật.
import { VOICE_PROFILES } from "./danceFloorData";

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

function pickVietnameseVoice() {
  const voices = loadVoices();
  return voices.find((v) => v.lang?.toLowerCase().startsWith("vi")) || voices[0] || null;
}

export function isVoiceSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Đọc 1 câu bằng giọng theo tính cách. Không throw — lỗi giọng đọc không được làm gãy luồng xử lý chính.
export function speakLine(text, personality) {
  if (!isVoiceSupported() || !text) return;
  try {
    window.speechSynthesis.cancel(); // tránh giọng đọc chồng chéo khi trigger dồn dập
    const utter = new SpeechSynthesisUtterance(text);
    const profile = VOICE_PROFILES[personality] || VOICE_PROFILES.funny;
    utter.pitch = profile.pitch;
    utter.rate = profile.rate;
    utter.volume = 0.9;
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
