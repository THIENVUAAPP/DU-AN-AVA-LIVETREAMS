import { useState, useEffect, useMemo, useCallback } from 'react';
import { DANCE_EFFECTS, DANCE_SOUNDS, DANCE_STYLES } from '../lib/danceFloorData';

const CUSTOM_CHARACTERS_KEY = 'avalive_dancefloor_custom_characters';
const CUSTOM_EFFECTS_KEY = 'avalive_dancefloor_custom_effects';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`loadJSON(${key}) lỗi:`, e);
  }
  return fallback;
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`saveJSON(${key}) lỗi:`, e);
  }
}

// Quản lý nhân vật / hiệu ứng / âm thanh / điệu nhảy do admin tự thêm — tách khỏi useDanceFloorEngine.js
// để giữ mỗi file dưới 500 dòng. Nhân vật + hiệu ứng lưu bền (JSON nhỏ gọn); âm thanh & điệu nhảy sao
// chép từ video (mocap) chỉ giữ trong phiên (blob URL / mảng khung hình quá lớn để lưu localStorage).
export function useCustomLibraryItems() {
  const [customCharacters, setCustomCharacters] = useState(() => loadJSON(CUSTOM_CHARACTERS_KEY, []));
  const [customEffects, setCustomEffects] = useState(() => loadJSON(CUSTOM_EFFECTS_KEY, []));
  const [customSounds, setCustomSounds] = useState([]);
  const [customDanceStyles, setCustomDanceStyles] = useState([]);
  const [backgroundVideos, setBackgroundVideos] = useState([]);
  const [activeBackgroundVideoId, setActiveBackgroundVideoId] = useState(null);

  useEffect(() => saveJSON(CUSTOM_CHARACTERS_KEY, customCharacters.filter((c) => !c.isSessionOnly)), [customCharacters]);
  useEffect(() => saveJSON(CUSTOM_EFFECTS_KEY, customEffects), [customEffects]);

  // KHÔNG còn nhân vật mẫu demo — chỉ dùng nhân vật admin tự tải ảnh/video lên. Sắp xếp theo tên, nhóm
  // Thường trước rồi tới VIP (VIP chỉ mở khi được nâng cấp bằng quà tặng giá trị).
  const allCharacters = useMemo(
    () =>
      [...customCharacters].sort((a, b) => {
        const tierRank = (c) => (c.tier === 'vip' ? 1 : 0);
        const rankDiff = tierRank(a) - tierRank(b);
        return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name, 'vi');
      }),
    [customCharacters]
  );
  const allEffects = useMemo(() => [...DANCE_EFFECTS, ...customEffects], [customEffects]);
  const allSounds = useMemo(() => [...DANCE_SOUNDS, ...customSounds], [customSounds]);
  const allDanceStyles = useMemo(() => [...DANCE_STYLES, ...customDanceStyles], [customDanceStyles]);

  const addCustomCharacter = useCallback((character) => setCustomCharacters((prev) => [...prev, character]), []);
  const deleteCustomCharacter = useCallback((id) => setCustomCharacters((prev) => prev.filter((c) => c.id !== id)), []);
  const editCustomCharacter = useCallback((id, patch) => {
    setCustomCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addCustomEffect = useCallback((effect) => setCustomEffects((prev) => [...prev, effect]), []);
  const deleteCustomEffect = useCallback((id) => setCustomEffects((prev) => prev.filter((e) => e.id !== id)), []);

  const addCustomSound = useCallback((file) => {
    // Random suffix (không chỉ dựa vào Date.now()) — tải hàng loạt nhiều file cùng lúc có thể rơi vào
    // cùng 1 mili-giây, trùng id nếu chỉ dùng timestamp.
    setCustomSounds((prev) => [
      ...prev,
      { id: `custom_sound_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, name: file.name, audioUrl: URL.createObjectURL(file), isSessionOnly: true },
    ]);
  }, []);
  const deleteCustomSound = useCallback((id) => setCustomSounds((prev) => prev.filter((s) => s.id !== id)), []);

  // Điệu nhảy "sao chép" từ video mẫu (motion capture) — mảng khung hình góc-khớp trích từ PoseLandmarker.
  const addCustomDanceStyle = useCallback((clip) => setCustomDanceStyles((prev) => [...prev, clip]), []);
  const deleteCustomDanceStyle = useCallback((id) => setCustomDanceStyles((prev) => prev.filter((d) => d.id !== id)), []);

  // Video Nền Vũ Trường — tải hàng loạt, giữ đúng thứ tự tải lên, chọn 1 video làm nền đang phát trực
  // tiếp (lặp liên tục) cho cả Sàn 2D lẫn Sàn 3D. Chỉ giữ trong phiên (blob URL, dung lượng lớn).
  const addBackgroundVideo = useCallback((video) => {
    setBackgroundVideos((prev) => [...prev, video]);
    setActiveBackgroundVideoId((prev) => prev || video.id);
  }, []);
  const deleteBackgroundVideo = useCallback((id) => {
    setBackgroundVideos((prev) => prev.filter((v) => v.id !== id));
    setActiveBackgroundVideoId((prev) => (prev === id ? null : prev));
  }, []);

  return {
    customCharacters, allCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    customEffects, allEffects, addCustomEffect, deleteCustomEffect,
    customSounds, allSounds, addCustomSound, deleteCustomSound,
    customDanceStyles, allDanceStyles, addCustomDanceStyle, deleteCustomDanceStyle,
    backgroundVideos, addBackgroundVideo, deleteBackgroundVideo,
    activeBackgroundVideoId, setActiveBackgroundVideoId,
  };
}
