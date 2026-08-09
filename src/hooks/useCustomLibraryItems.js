import { useState, useEffect, useMemo, useCallback } from 'react';
import { DANCE_CHARACTERS, DANCE_EFFECTS, DANCE_SOUNDS } from '../lib/danceFloorData';

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

// Quản lý nhân vật / hiệu ứng / âm thanh do admin tự thêm — tách khỏi useDanceFloorEngine.js để giữ
// mỗi file dưới 500 dòng. Nhân vật + hiệu ứng lưu bền (JSON nhỏ gọn); âm thanh tải lên chỉ giữ trong
// phiên (blob URL không sống sót qua lần tải lại trang và file nhạc quá lớn để lưu localStorage).
export function useCustomLibraryItems() {
  const [customCharacters, setCustomCharacters] = useState(() => loadJSON(CUSTOM_CHARACTERS_KEY, []));
  const [customEffects, setCustomEffects] = useState(() => loadJSON(CUSTOM_EFFECTS_KEY, []));
  const [customSounds, setCustomSounds] = useState([]);

  useEffect(() => saveJSON(CUSTOM_CHARACTERS_KEY, customCharacters.filter((c) => !c.isSessionOnly)), [customCharacters]);
  useEffect(() => saveJSON(CUSTOM_EFFECTS_KEY, customEffects), [customEffects]);

  const allCharacters = useMemo(() => [...DANCE_CHARACTERS, ...customCharacters], [customCharacters]);
  const allEffects = useMemo(() => [...DANCE_EFFECTS, ...customEffects], [customEffects]);
  const allSounds = useMemo(() => [...DANCE_SOUNDS, ...customSounds], [customSounds]);

  const addCustomCharacter = useCallback((character) => setCustomCharacters((prev) => [...prev, character]), []);
  const deleteCustomCharacter = useCallback((id) => setCustomCharacters((prev) => prev.filter((c) => c.id !== id)), []);
  const editCustomCharacter = useCallback((id, patch) => {
    setCustomCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addCustomEffect = useCallback((effect) => setCustomEffects((prev) => [...prev, effect]), []);
  const deleteCustomEffect = useCallback((id) => setCustomEffects((prev) => prev.filter((e) => e.id !== id)), []);

  const addCustomSound = useCallback((file) => {
    setCustomSounds((prev) => [...prev, { id: `custom_sound_${Date.now()}`, name: file.name, audioUrl: URL.createObjectURL(file), isSessionOnly: true }]);
  }, []);
  const deleteCustomSound = useCallback((id) => setCustomSounds((prev) => prev.filter((s) => s.id !== id)), []);

  return {
    customCharacters, allCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    customEffects, allEffects, addCustomEffect, deleteCustomEffect,
    customSounds, allSounds, addCustomSound, deleteCustomSound,
  };
}
