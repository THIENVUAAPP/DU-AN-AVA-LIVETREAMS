import { useState, useEffect, useMemo, useCallback } from 'react';
import { DANCE_EFFECTS, DANCE_STYLES, DEFAULT_CHARACTERS } from '../lib/danceFloorData';
import { saveMediaBlob, deleteMediaBlob, loadMediaBlobsByCategory } from '../lib/mediaDb';
import { loadJSON, saveJSON } from '../lib/localStorageJson';

const CUSTOM_CHARACTERS_KEY = 'avalive_dancefloor_custom_characters';
const CUSTOM_EFFECTS_KEY = 'avalive_dancefloor_custom_effects';
const ACTIVE_BG_VIDEO_KEY = 'avalive_dancefloor_active_bg_video_id';

// Quản lý nhân vật / hiệu ứng / âm thanh / điệu nhảy / video nền do admin tự thêm — tách khỏi
// useDanceFloorEngine.js để giữ mỗi file dưới 500 dòng. Nhân vật ảnh + hiệu ứng lưu bền qua localStorage
// (JSON nhỏ gọn). Nhân vật VIDEO, âm thanh & video nền (file lớn) lưu bền qua IndexedDB (mediaDb.js) —
// sống sót qua lần tải lại trang/chạy lại code, đúng yêu cầu "lưu lại để dùng dù có load lại". Điệu
// nhảy sao chép từ video mẫu (mocap) vẫn chỉ giữ trong phiên vì mảng khung hình quá lớn/không cần bền.
export function useCustomLibraryItems() {
  const [customCharacters, setCustomCharacters] = useState(() => loadJSON(CUSTOM_CHARACTERS_KEY, []));
  const [customEffects, setCustomEffects] = useState(() => loadJSON(CUSTOM_EFFECTS_KEY, []));
  const [customSounds, setCustomSounds] = useState([]);
  const [customDanceStyles, setCustomDanceStyles] = useState([]);
  const [backgroundVideos, setBackgroundVideos] = useState([]);
  const [activeBackgroundVideoId, setActiveBackgroundVideoId] = useState(null);

  useEffect(() => saveJSON(CUSTOM_CHARACTERS_KEY, customCharacters.filter((c) => !c.isSessionOnly)), [customCharacters]);
  useEffect(() => saveJSON(CUSTOM_EFFECTS_KEY, customEffects), [customEffects]);
  useEffect(() => saveJSON(ACTIVE_BG_VIDEO_KEY, activeBackgroundVideoId), [activeBackgroundVideoId]);

  // Nạp lại video nền / âm thanh / nhân vật video đã lưu bền trong IndexedDB — chạy đúng 1 lần lúc mở
  // trang. Nếu trình duyệt không hỗ trợ IndexedDB thì bỏ qua êm, không làm vỡ các thư viện khác.
  useEffect(() => {
    (async () => {
      try {
        const bgRecords = await loadMediaBlobsByCategory('backgroundVideo');
        if (bgRecords.length > 0) {
          const loadedVideos = bgRecords.map((r) => ({ id: r.id, name: r.meta.name, thumbnail: r.meta.thumbnail, url: URL.createObjectURL(r.blob) }));
          setBackgroundVideos(loadedVideos);
          const savedActiveId = loadJSON(ACTIVE_BG_VIDEO_KEY, null);
          setActiveBackgroundVideoId(loadedVideos.some((v) => v.id === savedActiveId) ? savedActiveId : loadedVideos[0].id);
        }
      } catch (e) {
        console.error('Nạp lại Video Nền Vũ Trường từ IndexedDB lỗi:', e);
      }
      try {
        const soundRecords = await loadMediaBlobsByCategory('customSound');
        if (soundRecords.length > 0) {
          setCustomSounds(soundRecords.map((r) => ({ id: r.id, name: r.meta.name, audioUrl: URL.createObjectURL(r.blob), isSessionOnly: true })));
        }
      } catch (e) {
        console.error('Nạp lại Thư Viện Âm Thanh từ IndexedDB lỗi:', e);
      }
      try {
        const videoCharRecords = await loadMediaBlobsByCategory('videoCharacter');
        if (videoCharRecords.length > 0) {
          setCustomCharacters((prev) => [...prev, ...videoCharRecords.map((r) => ({ ...r.meta, mediaUrl: URL.createObjectURL(r.blob) }))]);
        }
      } catch (e) {
        console.error('Nạp lại nhân vật video từ IndexedDB lỗi:', e);
      }
    })();
  }, []);

  // KHÔNG còn nhân vật mẫu demo — chỉ dùng nhân vật admin tự tải ảnh/video lên. Sắp xếp theo tên, nhóm
  // Thường trước rồi tới VIP (VIP chỉ mở khi được nâng cấp bằng quà tặng giá trị).
  const allCharacters = useMemo(
    () =>
      [...DEFAULT_CHARACTERS, ...customCharacters].sort((a, b) => {
        const tierRank = (c) => (c.tier === 'vip' ? 1 : 0);
        const rankDiff = tierRank(a) - tierRank(b);
        return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name, 'vi');
      }),
    [customCharacters]
  );
  const allEffects = useMemo(() => [...DANCE_EFFECTS, ...customEffects], [customEffects]);
  // KHÔNG còn âm thanh demo — chỉ dùng nhạc/âm thanh thật admin đã tải lên.
  const allSounds = customSounds;
  const allDanceStyles = useMemo(() => [...DANCE_STYLES, ...customDanceStyles], [customDanceStyles]);

  const addCustomCharacter = useCallback((character) => {
    const { mediaFile, ...rest } = character;
    if (mediaFile) {
      saveMediaBlob({ id: rest.id, category: 'videoCharacter', blob: mediaFile, meta: rest }).catch((e) =>
        console.error('Lưu bền nhân vật video vào IndexedDB lỗi:', e)
      );
    }
    setCustomCharacters((prev) => [...prev, rest]);
  }, []);
  const deleteCustomCharacter = useCallback((id) => {
    setCustomCharacters((prev) => prev.filter((c) => c.id !== id));
    deleteMediaBlob(id).catch(() => {});
  }, []);
  const editCustomCharacter = useCallback((id, patch) => {
    setCustomCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const addCustomEffect = useCallback((effect) => setCustomEffects((prev) => [...prev, effect]), []);
  const deleteCustomEffect = useCallback((id) => setCustomEffects((prev) => prev.filter((e) => e.id !== id)), []);

  const addCustomSound = useCallback((file) => {
    // Random suffix (không chỉ dựa vào Date.now()) — tải hàng loạt nhiều file cùng lúc có thể rơi vào
    // cùng 1 mili-giây, trùng id nếu chỉ dùng timestamp.
    const id = `custom_sound_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    saveMediaBlob({ id, category: 'customSound', blob: file, meta: { name: file.name } }).catch((e) =>
      console.error('Lưu bền âm thanh vào IndexedDB lỗi:', e)
    );
    setCustomSounds((prev) => [...prev, { id, name: file.name, audioUrl: URL.createObjectURL(file), isSessionOnly: true }]);
  }, []);
  const deleteCustomSound = useCallback((id) => {
    setCustomSounds((prev) => prev.filter((s) => s.id !== id));
    deleteMediaBlob(id).catch(() => {});
  }, []);

  // Điệu nhảy "sao chép" từ video mẫu (motion capture) — mảng khung hình góc-khớp trích từ PoseLandmarker.
  const addCustomDanceStyle = useCallback((clip) => setCustomDanceStyles((prev) => [...prev, clip]), []);
  const deleteCustomDanceStyle = useCallback((id) => setCustomDanceStyles((prev) => prev.filter((d) => d.id !== id)), []);

  // Video Nền Vũ Trường — tải hàng loạt, giữ đúng thứ tự tải lên, chọn 1 video làm nền đang phát trực
  // tiếp (lặp liên tục) cho cả Sàn 2D lẫn Sàn 3D. Lưu bền qua IndexedDB, sống sót qua lần tải lại trang.
  const addBackgroundVideo = useCallback((video) => {
    const { file, ...rest } = video;
    if (file) {
      saveMediaBlob({ id: rest.id, category: 'backgroundVideo', blob: file, meta: { name: rest.name, thumbnail: rest.thumbnail } }).catch((e) =>
        console.error('Lưu bền video nền vào IndexedDB lỗi:', e)
      );
    }
    setBackgroundVideos((prev) => [...prev, rest]);
    setActiveBackgroundVideoId((prev) => prev || rest.id);
  }, []);
  const deleteBackgroundVideo = useCallback((id) => {
    setBackgroundVideos((prev) => prev.filter((v) => v.id !== id));
    setActiveBackgroundVideoId((prev) => (prev === id ? null : prev));
    deleteMediaBlob(id).catch(() => {});
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
