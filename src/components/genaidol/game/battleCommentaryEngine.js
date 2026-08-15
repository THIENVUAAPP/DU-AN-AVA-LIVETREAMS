// AI Voice & Brain Commentary Engine for TikTok LIVE Battle Game
// Powerful, Responsive, Multi-trigger Live Commentator with Audio Ducking & Web Speech / TTS

const DEFAULT_COMMENTARY_SCRIPTS = [
  "Trận chiến đang diễn ra vô cùng nảy lửa! Hai bên đang dồn toàn lực giao tranh!",
  "Phe Xanh đang dâng cao đội hình tấn công dồn dập! Anh em ơi cố lên!",
  "Phe Đỏ phản công cực kỳ mãnh liệt! Đao kiếm chạm nhau tóe lửa hào quang!",
  "Khán giả hãy nhanh tay bình luận Xanh hoặc Đỏ để tiếp sức cho chiến binh của mình!",
  "Một pha giao tranh nghẹt thở! Ai sẽ là người trụ vững đến phút cuối cùng?",
  "Hãy thả tim và gửi quà để triệu hồi Chiến Thần Vạn Kiếm xoay chuyển cờ tàn!",
  "Tướng quân hai bên đã sẵn sàng tung tuyệt kỹ! Mời tất cả anh em theo dõi!",
  "Không khí trên phiên live đang nóng hơn bao giờ hết! Mau gia nhập phe bạn yêu thích!"
];

class BattleCommentaryEngine {
  constructor() {
    this.isEnabled = true;
    this.intervalSeconds = 15;
    this.volume = 0.9;
    this.pitch = 1.05;
    this.rate = 1.1; // Slightly energetic speaking rate
    this.selectedVoiceURI = null;
    this.customPrompts = [...DEFAULT_COMMENTARY_SCRIPTS];
    this.timerId = null;
    this.isSpeaking = false;
    this.onSpeechStateChange = null;
    this.onDuckAudio = null;
    this.lastSpokenIndex = -1;
    this.isGameActive = false;

    // Load saved settings
    this.loadSettings();

    // Init voices
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.getAvailableVoices();
      };
    }
  }

  loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('GAME_COMMENTARY_SETTINGS');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isEnabled !== undefined) this.isEnabled = parsed.isEnabled;
        if (parsed.intervalSeconds !== undefined) this.intervalSeconds = parsed.intervalSeconds;
        if (parsed.volume !== undefined) this.volume = parsed.volume;
        if (parsed.pitch !== undefined) this.pitch = parsed.pitch;
        if (parsed.rate !== undefined) this.rate = parsed.rate;
        if (parsed.selectedVoiceURI !== undefined) this.selectedVoiceURI = parsed.selectedVoiceURI;
        if (Array.isArray(parsed.customPrompts) && parsed.customPrompts.length > 0) {
          this.customPrompts = parsed.customPrompts;
        }
      }
    } catch (e) {
      console.warn('Failed to load commentary settings:', e);
    }
  }

  saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      const settings = {
        isEnabled: this.isEnabled,
        intervalSeconds: this.intervalSeconds,
        volume: this.volume,
        pitch: this.pitch,
        rate: this.rate,
        selectedVoiceURI: this.selectedVoiceURI,
        customPrompts: this.customPrompts
      };
      localStorage.setItem('GAME_COMMENTARY_SETTINGS', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save commentary settings:', e);
    }
  }

  getAvailableVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Vietnamese voices
    const viVoices = voices.filter(v => v.lang.startsWith('vi') || v.lang.includes('VI'));
    return viVoices.length > 0 ? viVoices : voices;
  }

  startPeriodicCommentary(isGameActive = true) {
    this.isGameActive = isGameActive;
    this.stopPeriodicCommentary();

    if (!this.isEnabled || !this.isGameActive) return;

    const intervalMs = Math.max(5, this.intervalSeconds) * 1000;
    this.timerId = setInterval(() => {
      if (!this.isSpeaking && this.isEnabled && this.isGameActive) {
        this.speakRandomPrompt();
      }
    }, intervalMs);
  }

  stopPeriodicCommentary() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  speak(text, priority = false) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!this.isEnabled && !priority) return;
    if (!text || typeof text !== 'string') return;

    if (priority) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    } else if (this.isSpeaking) {
      // Don't overlap speech
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.volume;
      utterance.pitch = this.pitch;
      utterance.rate = this.rate;
      utterance.lang = 'vi-VN';

      const voices = window.speechSynthesis.getVoices();
      if (this.selectedVoiceURI) {
        const found = voices.find(v => v.voiceURI === this.selectedVoiceURI);
        if (found) utterance.voice = found;
      } else {
        const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('vietnamese'));
        if (viVoice) utterance.voice = viVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (this.onDuckAudio) this.onDuckAudio(true); // Lower BGM
        if (this.onSpeechStateChange) this.onSpeechStateChange(true, text);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onDuckAudio) this.onDuckAudio(false); // Restore BGM
        if (this.onSpeechStateChange) this.onSpeechStateChange(false, '');
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis error:', err);
        this.isSpeaking = false;
        if (this.onDuckAudio) this.onDuckAudio(false);
        if (this.onSpeechStateChange) this.onSpeechStateChange(false, '');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Failed to speak text:', e);
      this.isSpeaking = false;
    }
  }

  speakRandomPrompt() {
    if (this.customPrompts.length === 0) return;
    let nextIndex = Math.floor(Math.random() * this.customPrompts.length);
    if (nextIndex === this.lastSpokenIndex && this.customPrompts.length > 1) {
      nextIndex = (nextIndex + 1) % this.customPrompts.length;
    }
    this.lastSpokenIndex = nextIndex;
    this.speak(this.customPrompts[nextIndex]);
  }

  // Event triggers for live games
  triggerGiftCommentary(userName, giftName, tier, faction) {
    const factionName = faction === 'blue' ? 'Phe Xanh' : 'Phe Đỏ';
    let line = '';
    if (tier.includes('Chí Tôn') || tier.includes('Rồng') || giftName.includes('Rồng')) {
      line = `Tuyệt vời! Đại hiệp ${userName} vừa tặng ${giftName}, triệu hồi Thần Long Chí Tôn tiếp sức cho ${factionName}!`;
    } else if (tier.includes('Chiến Thần') || giftName.includes('Sét') || giftName.includes('Xe')) {
      line = `Uy lực vô song! ${userName} đã tặng ${giftName}, kích hoạt Chiến Thần Vạn Kiếm cho ${factionName}!`;
    } else if (tier.includes('Kim Khải') || giftName.includes('Vương Miện')) {
      line = `Kim Khải Thần Tướng xuất trận! Cảm ơn ${userName} đã nâng cấp trang bị hoàng kim cho ${factionName}!`;
    } else {
      line = `Cảm ơn ${userName} đã gửi tặng ${giftName} để tiếp viện cho ${factionName}!`;
    }
    this.speak(line, true);
  }

  triggerSkillCommentary(skillName, faction) {
    const factionName = faction === 'blue' ? 'Phe Xanh' : 'Phe Đỏ';
    let line = '';
    if (skillName === 'van_kiem') {
      line = `Vạn Kiếm Quy Tông vừa xuất thế! Hàng ngàn thanh phi kiếm xé gió tung hoành cho ${factionName}!`;
    } else if (skillName === 'giang_long') {
      line = `Giáng Long Thập Bát Chưởng! Long ngâm chấn động đất trời, sát thương cực khủng cho ${factionName}!`;
    } else if (skillName === 'thai_cuc') {
      line = `Thái Cực Kiếm Trận hộ thể! Bất khả xâm phạm cho ${factionName}!`;
    }
    if (line) this.speak(line, true);
  }

  triggerLowHpWarning(faction, factionName) {
    const line = `Cảnh báo nguy cấp! ${factionName} chỉ còn dưới ba mươi phần trăm máu! Các đồng đội hãy mau gửi tim và quà để hồi sinh cứu nguy!`;
    this.speak(line, true);
  }

  triggerVictoryCommentary(winnerFactionName) {
    const line = `Khải hoàn toàn thắng! Xin chúc mừng ${winnerFactionName} đã xuất sắc giành chiến thắng oanh liệt trong trận đại chiến này!`;
    this.speak(line, true);
  }

  stopAll() {
    this.stopPeriodicCommentary();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.onDuckAudio) this.onDuckAudio(false);
  }
}

export const battleCommentary = new BattleCommentaryEngine();
