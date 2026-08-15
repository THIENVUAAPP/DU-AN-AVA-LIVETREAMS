// AI Voice & Brain Commentary Engine for TikTok LIVE Battle Game
// Powerful, Responsive, Multi-trigger Live Commentator with ElevenLabs TTS, Audio Ducking & Web Speech fallback

export const ELEVENLABS_GAME_VOICES = [
  { id: 'el_josh', name: 'Josh (BLV Game Siêu Tốc - Năng Lượng Bùng Nổ)', voiceId: 'TxGEqnHWrfWFTfGW9XjX', gender: 'Male' },
  { id: 'el_clyde', name: 'Clyde (Chiến Binh Bá Đạo - Trầm Hùng Uy Nghiêm)', voiceId: '2EiwWnXFnvU5JabPnv8n', gender: 'Male' },
  { id: 'el_harry', name: 'Harry (Kịch Tính Hồi Hộp - Rượt Đuổi Tỷ Số)', voiceId: 'SOYHLrjzK2X1ezoPC6cr', gender: 'Male' },
  { id: 'el_jeremy', name: 'Jeremy (MC Sôi Nổi - Hoạt Náo Live Minigame)', voiceId: 'bVMeCyTHy58xNoL34h3p', gender: 'Male' },
  { id: 'el_callum', name: 'Callum (Nam Quyết Đoán - Hùng Hồn Trợ Lực)', voiceId: 'N2lVS1w4EtoT3dr4eOWO', gender: 'Male' },
  { id: 'el_domi', name: 'Domi (Nữ Nhiệt Huyết - Hào Hứng Cổ Vũ)', voiceId: 'AZnzlk1XvdvUeBnXmlld', gender: 'Female' },
  { id: 'el_rachel', name: 'Rachel (Nữ MC Sắc Sảo - Giao Lưu Khán Giả)', voiceId: '21m00Tcm4TlvDq8ikWAM', gender: 'Female' },
  { id: 'el_patrick', name: 'Patrick (Uy Lực Đanh Thép - Thách Đấu PK)', voiceId: 'ODq5zmih8GrVes37Dizd', gender: 'Male' },
  { id: 'el_arnold', name: 'Arnold (Thần Tướng - Trọng Tài Tối Cao)', voiceId: 'VR6AewLTigWG4xSOukaG', gender: 'Male' },
  { id: 'el_charlie', name: 'Charlie (Hài Hước Tếu Táo - Trêu Chọc Đối Thủ)', voiceId: 'IKne3meq5aSn9XLyUdCD', gender: 'Male' }
];

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
    this.selectedVoiceId = 'el_josh';
    this.selectedElevenLabsVoiceId = 'TxGEqnHWrfWFTfGW9XjX';
    this.selectedVoiceURI = null;
    this.customPrompts = [...DEFAULT_COMMENTARY_SCRIPTS];
    this.timerId = null;
    this.isSpeaking = false;
    this.onSpeechStateChange = null;
    this.onDuckAudio = null;
    this.lastSpokenIndex = -1;
    this.isGameActive = false;
    this.activeAudio = null;

    // Load saved settings
    this.loadSettings();

    // Init browser speech voices as fallback
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
        if (parsed.selectedVoiceId !== undefined) this.selectedVoiceId = parsed.selectedVoiceId;
        if (parsed.selectedElevenLabsVoiceId !== undefined) this.selectedElevenLabsVoiceId = parsed.selectedElevenLabsVoiceId;
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
        selectedVoiceId: this.selectedVoiceId,
        selectedElevenLabsVoiceId: this.selectedElevenLabsVoiceId,
        selectedVoiceURI: this.selectedVoiceURI,
        customPrompts: this.customPrompts
      };
      localStorage.setItem('GAME_COMMENTARY_SETTINGS', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save commentary settings:', e);
    }
  }

  setElevenLabsVoice(voiceId) {
    const found = ELEVENLABS_GAME_VOICES.find(v => v.id === voiceId || v.voiceId === voiceId);
    if (found) {
      this.selectedVoiceId = found.id;
      this.selectedElevenLabsVoiceId = found.voiceId;
      this.saveSettings();
    }
  }

  getAvailableVoices() {
    return ELEVENLABS_GAME_VOICES;
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

  async speak(text, priority = false) {
    if (typeof window === 'undefined') return;
    if (!this.isEnabled && !priority) return;
    if (!text || typeof text !== 'string') return;

    if (priority) {
      this.cancelSpeech();
    } else if (this.isSpeaking) {
      // Don't overlap speech
      return;
    }

    this.isSpeaking = true;
    if (this.onDuckAudio) this.onDuckAudio(true); // Lower BGM
    if (this.onSpeechStateChange) this.onSpeechStateChange(true, text);

    // 1. Thử gọi API ElevenLabs TTS siêu thực
    try {
      const apiKey = localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('ELEVENLABS_API_KEY');
      const voiceId = this.selectedElevenLabsVoiceId || 'TxGEqnHWrfWFTfGW9XjX';

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          platform: 'elevenlabs',
          voiceId,
          apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
          audio.volume = this.volume;
          this.activeAudio = audio;

          // Trừ token tự động theo ký tự BLV Game PK ElevenLabs
          if (typeof window !== 'undefined') {
            const charCount = (text || '').length || 30;
            window.dispatchEvent(new CustomEvent('avalive:deduct_token', {
              detail: {
                amount: charCount,
                reason: `ElevenLabs Game PK (${this.selectedVoiceId}): "${(text || '').slice(0, 20)}..."`
              }
            }));
          }

          audio.onended = () => {
            this.isSpeaking = false;
            this.activeAudio = null;
            if (this.onDuckAudio) this.onDuckAudio(false); // Restore BGM
            if (this.onSpeechStateChange) this.onSpeechStateChange(false, '');
          };

          audio.onerror = () => {
            this.fallbackWebSpeech(text);
          };

          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('ElevenLabs Commentary API fallback to Web Speech:', err);
    }

    // 2. Fallback sang Web Speech Synthesis khi chưa có API key / offline
    this.fallbackWebSpeech(text);
  }

  fallbackWebSpeech(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (this.onDuckAudio) this.onDuckAudio(false);
      if (this.onSpeechStateChange) this.onSpeechStateChange(false, '');
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = this.volume;
      utterance.pitch = this.pitch;
      utterance.rate = this.rate;
      utterance.lang = 'vi-VN';

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('vietnamese'));
      if (viVoice) utterance.voice = viVoice;

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.onDuckAudio) this.onDuckAudio(false);
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
      console.warn('Failed to fallback speak text:', e);
      this.isSpeaking = false;
      if (this.onDuckAudio) this.onDuckAudio(false);
      if (this.onSpeechStateChange) this.onSpeechStateChange(false, '');
    }
  }

  cancelSpeech() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
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
    this.cancelSpeech();
    if (this.onDuckAudio) this.onDuckAudio(false);
  }
}

export const battleCommentary = new BattleCommentaryEngine();

