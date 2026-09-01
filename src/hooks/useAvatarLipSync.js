import { useState, useEffect } from 'react';
import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

export function useAvatarLipSync() {
  const [blendshapes, setBlendshapes] = useState({
    jawOpen: 0,
    viseme_aa: 0,
    viseme_E: 0,
    viseme_I: 0,
    viseme_O: 0,
    viseme_U: 0,
    viseme_sil: 1
  });

  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    // Khởi tạo engine nếu chưa có
    if (!globalLipSyncEngine.isInitialized) {
      // Phải chạy sau một tương tác của user (tự động init có thể bị block bởi browser)
      const initAudio = () => {
        globalLipSyncEngine.init();
        window.removeEventListener('click', initAudio);
        window.removeEventListener('keydown', initAudio);
      };
      window.addEventListener('click', initAudio);
      window.addEventListener('keydown', initAudio);
    }

    let animationFrameId;
    let lastTime = performance.now();
    let lastUpdateMs = 0;

    const renderLoop = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const newBlendshapes = globalLipSyncEngine.update(delta);
      
      // Giới hạn tần số update state React xuống 30fps (mỗi 33ms) để tránh giật lag UI, 
      // vì DOM render quá nhanh sẽ ăn CPU. (Bản thân engine vẫn chạy 60fps).
      if (time - lastUpdateMs > 33) {
        setBlendshapes({ ...newBlendshapes });
        setCurrentVolume(globalLipSyncEngine.currentVolume);
        lastUpdateMs = time;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return { blendshapes, currentVolume, engine: globalLipSyncEngine };
}
