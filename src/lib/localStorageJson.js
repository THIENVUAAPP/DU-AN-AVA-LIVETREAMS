// Đọc/ghi JSON qua localStorage — dùng chung cho các hook Sàn Nhảy TikTok (tránh lặp code).
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`loadJSON(${key}) lỗi:`, e);
  }
  return fallback;
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`saveJSON(${key}) lỗi:`, e);
  }
}
