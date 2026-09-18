import { useState, useRef, useEffect, useCallback } from 'react';

// Playlist nhạc nền — 2 chế độ: 'playlist' (hết bài tự động qua bài kế tiếp, hết danh sách quay lại từ
// đầu) hoặc 'single' (lặp lại đúng 1 bài đang phát liên tục). Độc lập với hiệu ứng âm thanh ngắn
// (playSound) — đây là kênh nhạc nền chạy xuyên suốt phiên live, làm nền cho nhân vật nhảy.
export function useBackgroundMusicPlaylist(playlist, loopMode = 'playlist') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const handleEnded = () => {
      if (loopMode === 'single') return; // audio.loop=true đã tự lặp, không cần xử lý thêm ở đây
      setCurrentIndex((i) => (playlist.length > 0 ? (i + 1) % playlist.length : 0));
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playlist.length, loopMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loopMode === 'single';
  }, [loopMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying || playlist.length === 0) {
      audio.pause();
      return;
    }
    const track = playlist[currentIndex % playlist.length];
    if (!track) return;
    if (audio.src !== track.audioUrl) audio.src = track.audioUrl;
    audio.play().catch((err) => console.error('Phát playlist nhạc nền lỗi:', err));
  }, [isPlaying, currentIndex, playlist]);

  const toggle = useCallback(() => setIsPlaying((p) => !p), []);
  const skipNext = useCallback(() => {
    setCurrentIndex((i) => (playlist.length > 0 ? (i + 1) % playlist.length : 0));
  }, [playlist.length]);

  const currentTrackName = playlist.length > 0 ? playlist[currentIndex % playlist.length]?.name : null;

  return { isPlaying, toggle, skipNext, currentTrackName, trackCount: playlist.length };
}
