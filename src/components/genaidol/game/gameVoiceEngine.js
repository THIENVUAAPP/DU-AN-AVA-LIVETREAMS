import { ALL_SYSTEM_VOICES, ELEVENLABS_VOICES, getElevenLabsApiKey, previewVoiceAudio, stopVoiceAudio } from '../../../utils/voiceSyncService';
import { askGeminiLiveAi } from '../../../lib/geminiClient';

export const DEFAULT_MAP_PROMPTS = [
  { id: 'p1', text: "Đại chiến cắm cờ Tổ Quốc đang diễn ra vô cùng sôi động! Mọi người mau thả tim và tặng quà để phủ đỏ bản đồ nào!", role: 'game', enabled: true },
  { id: 'p2', text: "Xin chào toàn thể khán giả đang theo dõi livestream! Hãy cùng chọn tỉnh thành quê hương bạn yêu thích để cắm cờ rạng rỡ nhé!", role: 'assistant', enabled: true },
  { id: 'p3', text: "Một pha tặng quà cực khủng! Vùng đất linh thiêng vừa được thắp sáng hào quang đỏ thắm!", role: 'game', enabled: true },
  { id: 'p4', text: "Thông báo từ trợ lý hệ thống: Chỉ còn vài trăm ô cờ nữa là hoàn thành phủ kín bản đồ, anh em cùng chung tay tăng tốc!", role: 'assistant', enabled: true },
  { id: 'p5', text: "Cảm ơn các đại gia đã tích cực ủng hộ phiên live! Chúc mọi người luôn gặp nhiều may mắn và bình an!", role: 'assistant', enabled: true },
  { id: 'p6', text: "Tiếng trống trận vang lừng, từng ô cờ đỏ sao vàng vươn cao hùng tráng giữa biển trời quê hương!", role: 'game', enabled: true },
];

export const DEFAULT_BATTLE_PROMPTS = [
  { id: 'b1', text: "Trận đại chiến PK đang diễn ra vô cùng nảy lửa! Hai phe Rồng Xanh và Hổ Đỏ đang dồn toàn lực giao tranh!", role: 'game', enabled: true },
  { id: 'b2', text: "Dạ em chào cả nhà yêu nha! Khán giả hãy bình luận Xanh hoặc Đỏ để gia nhập phe và tiếp sức cho chiến binh nhé!", role: 'assistant', enabled: true },
  { id: 'b3', text: "Phe Xanh đang dâng cao đội hình tấn công dồn dập! Đao kiếm chạm nhau tóe lửa hào quang!", role: 'game', enabled: true },
  { id: 'b4', text: "Phe Đỏ phản công cực kỳ mãnh liệt! Hãy thả tim và gửi quà để triệu hồi Chiến Thần Vạn Kiếm xoay chuyển cờ tàn!", role: 'game', enabled: true },
  { id: 'b5', text: "Thông báo từ trợ lý trận đấu: Đấu trường đang bước vào giai đoạn quyết định, phe nào sẽ đoạt ngôi vương hôm nay?", role: 'assistant', enabled: true },
  { id: 'b6', text: "Một tuyệt kỹ Chí Tôn giáng thế! Sức mạnh hủy diệt đang làm rung chuyển toàn bộ chiến trường!", role: 'game', enabled: true },
];

export const DEFAULT_KEYWORD_RULES = [
  {
    id: 'k1',
    name: 'Chào hỏi & Gia nhập',
    keywords: ['chào', 'hi', 'hello', 'xin chào', 'chào shop', 'chào idol', 'chào blv', 'hé lô'],
    replyText: 'Dạ em chào anh/chị [user] đã ghé thăm phiên livestream rực lửa hôm nay nhé! Chúc anh/chị xem live thật vui và nhận nhiều phần quà hấp dẫn ạ!',
    role: 'assistant',
    cooldownSec: 4,
    enabled: true
  },
  {
    id: 'k2',
    name: 'Hỏi luật chơi & Hướng dẫn',
    keywords: ['luật chơi', 'chơi sao', 'cách chơi', 'hướng dẫn', 'làm sao', 'chơi thế nào', 'giải thích'],
    replyText: 'Chào [user]! Luật chơi vô cùng đơn giản: Bạn chỉ cần bình luận để chọn phe hoặc tỉnh thành, sau đó thả tim và tặng quà để cắm cờ hoặc triệu hồi tuyệt kỹ tướng quân nhé!',
    role: 'assistant',
    cooldownSec: 6,
    enabled: true
  },
  {
    id: 'k3',
    name: 'Tặng quà & Triệu hồi sức mạnh',
    keywords: ['tặng quà', 'quà', 'gift', 'hoa hồng', 'tim', 'thả tim', 'ủng hộ', 'kim cương'],
    replyText: 'Cảm ơn đại gia [user] đã gửi tặng món quà vô cùng quý giá! Toàn quân đang được tăng 1000 chiến lực và hào quang bừng sáng!',
    role: 'game',
    cooldownSec: 3,
    enabled: true
  },
  {
    id: 'k4',
    name: 'Cổ vũ Phe Xanh',
    keywords: ['1', 'xanh', 'phe xanh', 'rồng xanh', 'xanh cố lên', 'xanh win'],
    replyText: 'Chiến binh [user] vừa gia nhập và tiếp lửa cho Phe Xanh! Toàn quân Phe Xanh dâng cao đội hình xung phong!',
    role: 'game',
    cooldownSec: 3,
    enabled: true
  },
  {
    id: 'k5',
    name: 'Cổ vũ Phe Đỏ',
    keywords: ['2', 'đỏ', 'phe đỏ', 'hổ đỏ', 'đỏ cố lên', 'đỏ win'],
    replyText: 'Chiến tướng [user] vừa gia nhập Phe Đỏ! Hổ Đỏ gầm vang chiến trường, sức mạnh đang bùng nổ vượt bậc!',
    role: 'game',
    cooldownSec: 3,
    enabled: true
  },
  {
    id: 'k6',
    name: 'Quốc kỳ & Tỉnh thành',
    keywords: ['hà nội', 'sài gòn', 'tp hcm', 'đà nẵng', 'cờ', 'quốc kỳ', 'việt nam', 'yêu việt nam'],
    replyText: 'Vị trí cờ của [user] vừa được cắm rạng rỡ và uy nghiêm trên bản đồ Tổ Quốc! Hãy cùng phủ kín cờ đỏ sao vàng nhé!',
    role: 'game',
    cooldownSec: 4,
    enabled: true
  }
];

class GameVoiceEngine {
  constructor(gameType = 'map') {
    this.gameType = gameType; // 'map' | 'battle'
    this.storageKey = `GAME_VOICE_CONFIG_${gameType.toUpperCase()}`;
    
    // Core Voice Role Configurations
    this.gameVoice = { 
      id: 'el_josh', 
      name: 'Josh (Nam - BLV Game)', 
      voiceId: 'TxGEqnHWrfWFTfGW9XjX', 
      provider: 'elevenlabs', 
      gender: 'Male',
      rate: 1.05,
      pitch: 1.0,
      volume: 1.0,
      enabled: true
    };
    this.assistantVoice = { 
      id: 'el_rachel', 
      name: 'Rachel (Nữ - Ngọt ngào)', 
      voiceId: '21m00Tcm4TlvDq8ikWAM', 
      provider: 'elevenlabs', 
      gender: 'Female',
      rate: 1.0,
      pitch: 1.05,
      volume: 1.0,
      enabled: true
    };
    
    // Auto Periodic Commentary Config
    this.isAutoEnabled = true;
    this.isAutoLoop = true; // Loop endlessly throughout livestream
    this.intervalSeconds = 25; // 25s
    this.playbackOrder = 'sequential'; // 'sequential' | 'random'
    this.prompts = gameType === 'battle' ? [...DEFAULT_BATTLE_PROMPTS] : [...DEFAULT_MAP_PROMPTS];
    this.lastSpokenIndex = -1;
    this.timerId = null;
    
    // Keyword Auto Reply Config & Gemini Q&A
    this.isKeywordAutoReplyEnabled = true;
    this.useGeminiAI = true;
    this.responseDelaySec = 1.0;
    this.keywordRules = [...DEFAULT_KEYWORD_RULES];
    this.lastKeywordTriggerTimes = new Map();
    
    // Audio State
    this.volume = 0.9;
    this.speedRate = 1.0;
    this.pitch = 1.0;
    this.isMuted = false;
    this.isSpeaking = false;
    this.onDuckAudio = null;
    this.onSpeechStateChange = null;
    this.activeAudio = null;
    this.isGameActive = false;
    
    this.loadSettings();
    this.setupEmergencyStopListener();
  }

  setupEmergencyStopListener() {
    if (typeof window === 'undefined') return;
    window.addEventListener('avalive_emergency_stop_all', () => {
      this.stopAll();
    });
    window.addEventListener('storage', (e) => {
      if (e.key === 'avalive_emergency_stop_trigger') {
        this.stopAll();
      }
    });
  }

  loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gameVoice) this.gameVoice = { ...this.gameVoice, ...parsed.gameVoice };
        if (parsed.assistantVoice) this.assistantVoice = { ...this.assistantVoice, ...parsed.assistantVoice };
        if (parsed.isAutoEnabled !== undefined) this.isAutoEnabled = parsed.isAutoEnabled;
        if (parsed.isAutoLoop !== undefined) this.isAutoLoop = parsed.isAutoLoop;
        if (parsed.intervalSeconds !== undefined) this.intervalSeconds = parsed.intervalSeconds;
        if (parsed.playbackOrder) this.playbackOrder = parsed.playbackOrder;
        if (Array.isArray(parsed.prompts) && parsed.prompts.length > 0) this.prompts = parsed.prompts;
        if (parsed.isKeywordAutoReplyEnabled !== undefined) this.isKeywordAutoReplyEnabled = parsed.isKeywordAutoReplyEnabled;
        if (parsed.useGeminiAI !== undefined) this.useGeminiAI = parsed.useGeminiAI;
        if (parsed.responseDelaySec !== undefined) this.responseDelaySec = parsed.responseDelaySec;
        if (Array.isArray(parsed.keywordRules) && parsed.keywordRules.length > 0) this.keywordRules = parsed.keywordRules;
        if (parsed.volume !== undefined) this.volume = parsed.volume;
        if (parsed.speedRate !== undefined) this.speedRate = parsed.speedRate;
        if (parsed.pitch !== undefined) this.pitch = parsed.pitch;
        if (parsed.isMuted !== undefined) this.isMuted = parsed.isMuted;
      }
    } catch (e) {
      console.warn(`[GameVoiceEngine:${this.gameType}] Load settings failed:`, e);
    }
  }

  saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      const data = {
        gameVoice: this.gameVoice,
        assistantVoice: this.assistantVoice,
        isAutoEnabled: this.isAutoEnabled,
        isAutoLoop: this.isAutoLoop,
        intervalSeconds: this.intervalSeconds,
        playbackOrder: this.playbackOrder,
        prompts: this.prompts,
        isKeywordAutoReplyEnabled: this.isKeywordAutoReplyEnabled,
        useGeminiAI: this.useGeminiAI,
        responseDelaySec: this.responseDelaySec,
        keywordRules: this.keywordRules,
        volume: this.volume,
        speedRate: this.speedRate,
        pitch: this.pitch,
        isMuted: this.isMuted
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('game_voice_settings_updated', { detail: { gameType: this.gameType, settings: data } }));
    } catch (e) {
      console.warn(`[GameVoiceEngine:${this.gameType}] Save settings failed:`, e);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gameVoice) this.gameVoice.volume = this.volume;
    if (this.assistantVoice) this.assistantVoice.volume = this.volume;
    this.saveSettings();
  }

  setMuted(isMuted) {
    this.isMuted = !!isMuted;
    if (this.isMuted) {
      this.cancelSpeech();
    }
    this.saveSettings();
  }

  toggleMuted() {
    this.setMuted(!this.isMuted);
    return !this.isMuted;
  }

  startPeriodicCommentary(isGameActive = true) {
    this.isGameActive = isGameActive;
    this.stopPeriodicCommentary();
    if (!this.isAutoEnabled || !this.isGameActive) return;

    const intervalMs = Math.max(5, this.intervalSeconds) * 1000;
    this.timerId = setInterval(() => {
      if (!this.isSpeaking && this.isAutoEnabled && this.isGameActive) {
        this.speakNextPrompt();
      }
    }, intervalMs);
  }

  stopPeriodicCommentary() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  speakNextPrompt() {
    const activePrompts = (this.prompts || []).filter(p => p.enabled !== false);
    if (activePrompts.length === 0) return;

    let targetPrompt;
    if (this.playbackOrder === 'sequential') {
      const nextIdx = this.lastSpokenIndex + 1;
      if (nextIdx >= activePrompts.length) {
        if (this.isAutoLoop !== false) {
          // Loop indefinitely
          this.lastSpokenIndex = 0;
          targetPrompt = activePrompts[0];
        } else {
          // Stop when finished
          return;
        }
      } else {
        this.lastSpokenIndex = nextIdx;
        targetPrompt = activePrompts[this.lastSpokenIndex];
      }
    } else {
      const idx = Math.floor(Math.random() * activePrompts.length);
      targetPrompt = activePrompts[idx];
    }

    if (targetPrompt) {
      this.speak(targetPrompt.text, targetPrompt.role || 'game', false);
    }
  }

  async speak(text, roleOrVoice = 'game', priority = false) {
    if (typeof window === 'undefined') return;
    if (!text || typeof text !== 'string') return;
    if (this.isMuted || this.volume <= 0.001) return;
    if (this.isSpeaking && !priority) return;

    let activeVoice = null;
    let effectiveRole = 'game';

    if (roleOrVoice === 'assistant') {
      activeVoice = this.assistantVoice;
      effectiveRole = 'assistant';
    } else if (roleOrVoice === 'game') {
      activeVoice = this.gameVoice;
      effectiveRole = 'game';
    } else if (typeof roleOrVoice === 'string') {
      // Direct voice ID provided
      const foundVoice = ALL_SYSTEM_VOICES.find(v => v.id === roleOrVoice || v.voiceId === roleOrVoice);
      if (foundVoice) {
        activeVoice = foundVoice;
        effectiveRole = foundVoice.gender === 'Female' ? 'assistant' : 'game';
      } else {
        activeVoice = this.assistantVoice;
        effectiveRole = 'assistant';
      }
    } else if (typeof roleOrVoice === 'object' && roleOrVoice !== null) {
      activeVoice = roleOrVoice;
      effectiveRole = roleOrVoice.gender === 'Female' ? 'assistant' : 'game';
    }

    if (activeVoice?.enabled === false) return; // Nếu giọng vai trò này bị tắt

    if (priority) {
      this.cancelSpeech();
    }

    this.isSpeaking = true;
    if (this.onDuckAudio) this.onDuckAudio(true);
    if (this.onSpeechStateChange) this.onSpeechStateChange(true, text, effectiveRole);

    const baseVoice = ALL_SYSTEM_VOICES.find(v => v.id === activeVoice?.id || v.voiceId === activeVoice?.voiceId) || activeVoice || {
      id: effectiveRole === 'assistant' ? 'free_vi_female' : 'free_vi_male',
      provider: 'system',
      tier: 'free',
      gender: effectiveRole === 'assistant' ? 'Female' : 'Male',
      role: effectiveRole
    };

    const voiceObj = {
      ...baseVoice,
      volume: (activeVoice?.volume !== undefined ? activeVoice.volume : this.volume),
      rate: (activeVoice?.rate !== undefined ? activeVoice.rate : this.speedRate),
      pitch: (activeVoice?.pitch !== undefined ? activeVoice.pitch : this.pitch)
    };

    try {
      const charCount = (text || '').length || 30;
      window.dispatchEvent(new CustomEvent('avalive:deduct_token', {
        detail: {
          amount: charCount,
          reason: `Game Voice AI (${effectiveRole === 'assistant' ? 'Trợ Lý' : 'BLV'} - ${voiceObj.name || voiceObj.id}): "${text.slice(0, 20)}..."`
        }
      }));

      await previewVoiceAudio(voiceObj, text, () => {
        this.isSpeaking = false;
        if (this.onDuckAudio) this.onDuckAudio(false);
        if (this.onSpeechStateChange) this.onSpeechStateChange(false, '', effectiveRole);
      });
    } catch (err) {
      console.warn(`[GameVoiceEngine:${this.gameType}] Speak error:`, err);
      this.isSpeaking = false;
      if (this.onDuckAudio) this.onDuckAudio(false);
      if (this.onSpeechStateChange) this.onSpeechStateChange(false, '', effectiveRole);
    }
  }

  cancelSpeech() {
    stopVoiceAudio();
    this.isSpeaking = false;
    if (this.onDuckAudio) this.onDuckAudio(false);
    if (this.onSpeechStateChange) this.onSpeechStateChange(false, '', 'game');
  }

  stopAll() {
    this.stopPeriodicCommentary();
    this.cancelSpeech();
    this.isGameActive = false;
    this.isSpeaking = false;
  }

  // Khớp Từ Khóa & Bộ Não AI Gemini Tự Động Trả Lời Câu Hỏi Ngoài Vùng Cài Đặt (Smart Real-time Q&A)
  async handleUserComment(commentText, userName = 'Khán Giả') {
    if (!this.isKeywordAutoReplyEnabled || !commentText) return false;
    const lower = commentText.toLowerCase().trim();
    const now = Date.now();

    // 1. Khớp từ khóa cố định trong danh sách cài sẵn
    const activeRules = (this.keywordRules || []).filter(r => r.enabled !== false);
    for (const rule of activeRules) {
      const matched = rule.keywords.some(k => lower.includes(k.toLowerCase().trim()));
      if (matched) {
        const lastTime = this.lastKeywordTriggerTimes.get(rule.id) || 0;
        const cooldownMs = (rule.cooldownSec || 4) * 1000;
        if (now - lastTime < cooldownMs) {
          continue; // Cooldown protection
        }

        this.lastKeywordTriggerTimes.set(rule.id, now);
        let reply = rule.replyText
          .replace(/\[user\]/gi, userName)
          .replace(/\[game\]/gi, this.gameType === 'battle' ? 'Đại Chiến PK' : 'Bản Đồ Cắm Cờ');

        const delayMs = Math.max(0, (this.responseDelaySec !== undefined ? this.responseDelaySec : 1.0) * 1000);
        const voiceTarget = rule.voiceId || rule.role || 'assistant';

        if (delayMs <= 50) {
          this.speak(reply, voiceTarget, true);
        } else {
          setTimeout(() => {
            this.speak(reply, voiceTarget, true);
          }, delayMs);
        }

        return true;
      }
    }

    // 2. Nếu không khớp từ khóa cố định & Bật Gemini AI: Tự động trả lời thông minh câu hỏi ngoài vùng
    if (this.useGeminiAI && lower.length >= 2) {
      try {
        const aiResponse = await askGeminiLiveAi({
          question: commentText,
          username: userName,
          role: this.assistantVoice?.gender === 'Female' ? 'assistant' : 'game',
          context: this.gameType === 'battle' ? 'Đại Chiến PK Rồng Xanh vs Hổ Đỏ' : 'Đại Chiến Cắm Cờ Bản Đồ Tổ Quốc Việt Nam',
          gameType: this.gameType
        });

        if (aiResponse?.text) {
          const delayMs = Math.max(0, (this.responseDelaySec !== undefined ? this.responseDelaySec : 1.0) * 1000);
          if (delayMs <= 50) {
            this.speak(aiResponse.text, this.assistantVoice || 'assistant', true);
          } else {
            setTimeout(() => {
              this.speak(aiResponse.text, this.assistantVoice || 'assistant', true);
            }, delayMs);
          }
          return true;
        }
      } catch (geminiErr) {
        console.warn(`[GameVoiceEngine:${this.gameType}] Gemini Q&A error, using safe fallback:`, geminiErr);
        const fallbackReply = `Dạ em chào anh chị ${userName}! Mọi người cùng thả tim và tiếp sức nhiệt tình cho trận đấu nha!`;
        const delayMs = Math.max(0, (this.responseDelaySec !== undefined ? this.responseDelaySec : 1.0) * 1000);
        if (delayMs <= 50) {
          this.speak(fallbackReply, 'assistant', false);
        } else {
          setTimeout(() => {
            this.speak(fallbackReply, 'assistant', false);
          }, delayMs);
        }
        return true;
      }
    }

    return false;
  }
}

export const mapVoiceEngine = new GameVoiceEngine('map');
export const battleVoiceEngine = new GameVoiceEngine('battle');

export default {
  mapVoiceEngine,
  battleVoiceEngine,
  GameVoiceEngine,
  DEFAULT_MAP_PROMPTS,
  DEFAULT_BATTLE_PROMPTS,
  DEFAULT_KEYWORD_RULES
};
