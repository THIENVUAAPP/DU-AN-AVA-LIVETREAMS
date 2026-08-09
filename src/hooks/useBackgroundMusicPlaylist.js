import { useState, useRef, useEffect, useCallback } from 'react';

// Playlist nhạc nền tự động chuyển bài — phát liên tục các bài nhạc đã tải lên (mp3 hoặc audio trích từ
// video), hết bài tự động qua bài kế tiếp, hết danh sách quay lại từ đầu. Độc lập với hiệu ứng âm thanh
// ngắn (playSound) — đây là kênh nhạc nền chạy xuyên suốt phiên live, làm nền cho nhân vật nhảy.
export function useBackgroundMusicPlaylist(playlist) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    const handleEnded = () => setCurrentIndex((i) => (playlist.length > 0 ? (i + 1) % playlist.length : 0));
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playlist.length]);

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
