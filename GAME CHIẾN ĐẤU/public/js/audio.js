/**
 * Nhạc nền + SFX cho overlay. Tự đọc cấu hình từ /config/audio.json.
 * Nếu file nhạc chưa được thêm vào public/audio/ (xem public/audio/README.md),
 * lỗi tải file bị im lặng bỏ qua — KHÔNG làm crash overlay, chỉ đơn giản
 * không có âm thanh cho tới khi anh thêm file thật vào.
 */

const DEFAULT_TRACKS = {
  background: '/audio/background-music.wav',
  victory: '/audio/victory-fanfare.wav',
  aoe: '/audio/sfx-aoe.wav',
  boss: '/audio/sfx-boss.wav',
  joinSmall: '/audio/sfx-join.wav',
};

class AudioManager {
  constructor() {
    this.tracks = { ...DEFAULT_TRACKS };
    this.musicVolume = 0.35;
    this.sfxVolume = 0.6;
    this.muted = false;
    this.backgroundAudio = null;
    this.backgroundStarted = false;
  }

  async loadConfig() {
    try {
      const response = await fetch('/config/audio.json');
      if (!response.ok) return;
      const config = await response.json();
      if (config.tracks) this.tracks = { ...DEFAULT_TRACKS, ...config.tracks };
      if (typeof config.musicVolume === 'number') this.musicVolume = config.musicVolume;
      if (typeof config.sfxVolume === 'number') this.sfxVolume = config.sfxVolume;
    } catch (error) {
      console.warn('[audio] Không tải được config/audio.json, dùng mặc định:', error);
    }
  }

  _createAudio(path) {
    const audio = new Audio(path);
    audio.onerror = () => {
      /* File nhạc chưa tồn tại — im lặng bỏ qua, xem public/audio/README.md */
    };
    return audio;
  }

  startBackgroundMusic() {
    if (this.backgroundStarted) return;
    this.backgroundStarted = true;

    this.backgroundAudio = this._createAudio(this.tracks.background);
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = this.muted ? 0 : this.musicVolume;

    const attemptPlay = () => this.backgroundAudio.play().catch(() => {});
    attemptPlay();

    const resumeOnInteraction = () => {
      attemptPlay();
      window.removeEventListener('click', resumeOnInteraction);
      window.removeEventListener('keydown', resumeOnInteraction);
    };
    window.addEventListener('click', resumeOnInteraction, { once: true });
    window.addEventListener('keydown', resumeOnInteraction, { once: true });
  }

  playSfx(key) {
    if (this.muted) return;
    const path = this.tracks[key];
    if (!path) return;
    const audio = this._createAudio(path);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  /** Phát audio giọng đọc AI (ElevenLabs) nhận từ server qua base64. */
  playAnnouncerClip(audioBase64, mimeType) {
    if (this.muted || !audioBase64) return;
    const audio = new Audio(`data:${mimeType || 'audio/mpeg'};base64,${audioBase64}`);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  setMusicVolume(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    this.musicVolume = Math.max(0, Math.min(1, parsed));
    if (this.backgroundAudio) this.backgroundAudio.volume = this.muted ? 0 : this.musicVolume;
  }

  setSfxVolume(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    this.sfxVolume = Math.max(0, Math.min(1, parsed));
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.backgroundAudio) this.backgroundAudio.volume = this.muted ? 0 : this.musicVolume;
  }
}

export const audioManager = new AudioManager();
