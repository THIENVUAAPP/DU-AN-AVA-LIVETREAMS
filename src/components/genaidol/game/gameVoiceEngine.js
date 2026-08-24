import { ALL_SYSTEM_VOICES, ELEVENLABS_VOICES, getElevenLabsApiKey, previewVoiceAudio, stopVoiceAudio, isSpeechActive } from '../../../utils/voiceSyncService';
import { askGeminiLiveAi } from '../../../lib/geminiClient';

export const DEFAULT_MAP_PROMPTS = [
  { id: 'p1', text: "Đại chiến cắm cờ Tổ Quốc đang diễn ra vô cùng sôi động! Mọi người mau thả tim và tặng quà để phủ đỏ bản đồ nào!", role: 'game', enabled: true },
  { id: 'p2', text: "Xin chào toàn thể khán giả đang theo dõi livestream! Hãy cùng chọn tỉnh thành quê hương bạn yêu thích để cắm cờ rạng rỡ nhé!", role: 'assistant', enabled: true },
  { id: 'p3', text: "Một pha tặng quà cực khủng! Vùng đất linh thiêng vừa được thắp sáng hào quang đỏ thắm!", role: 'game', enabled: true },
  { id: 'p4', text: "Thông báo từ trợ lý hệ thống: Chỉ còn vài trăm ô cờ nữa là hoàn thành phủ kín bản đồ, các bạn cùng chung tay tăng tốc nhé!", role: 'assistant', enabled: true },
  { id: 'p5', text: "Em cảm ơn các bạn đã tích cực ủng hộ phiên live! Chúc mọi người luôn gặp nhiều may mắn và bình an!", role: 'assistant', enabled: true },
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
    replyText: 'Dạ em chào bạn [user] đã ghé thăm phiên livestream rực lửa hôm nay nhé! Chúc bạn xem live thật vui và nhận nhiều phần quà hấp dẫn ạ!',
    role: 'assistant',
    cooldownSec: 5,
    enabled: true
  },
  {
    id: 'k2',
    name: 'Hỏi luật chơi & Hướng dẫn',
    keywords: ['luật chơi', 'chơi sao', 'cách chơi', 'hướng dẫn', 'làm sao', 'chơi thế nào', 'giải thích'],
    replyText: 'Chào bạn [user]! Luật chơi vô cùng đơn giản: Bạn chỉ cần bình luận để chọn phe hoặc tỉnh thành, sau đó thả tim và tặng quà để cắm cờ hoặc triệu hồi tuyệt kỹ nhé!',
    role: 'assistant',
    cooldownSec: 6,
    enabled: true
  },
  {
    id: 'k3',
    name: 'Tặng quà & Triệu hồi sức mạnh',
    keywords: ['tặng quà', 'quà', 'gift', 'hoa hồng', 'tim', 'thả tim', 'ủng hộ', 'kim cương'],
    replyText: 'Em cảm ơn bạn [user] đã gửi tặng món quà vô cùng quý giá! Toàn quân đang được tăng 1000 chiến lực và hào quang bừng sáng!',
    role: 'game',
    cooldownSec: 4,
    enabled: true
  },
  {
    id: 'k4',
    name: 'Cổ vũ Phe Xanh',
    keywords: ['1', 'xanh', 'phe xanh', 'rồng xanh', 'xanh cố lên', 'xanh win'],
    replyText: 'Chiến binh [user] vừa gia nhập và tiếp lửa cho Phe Xanh! Toàn quân Phe Xanh dâng cao đội hình xung phong!',
    role: 'game',
    cooldownSec: 4,
    enabled: true
  },
  {
    id: 'k5',
    name: 'Cổ vũ Phe Đỏ',
    keywords: ['2', 'đỏ', 'phe đỏ', 'hổ đỏ', 'đỏ cố lên', 'đỏ win'],
    replyText: 'Chiến tướng [user] vừa gia nhập Phe Đỏ! Hổ Đỏ gầm vang chiến trường, sức mạnh đang bùng nổ vượt bậc!',
    role: 'game',
    cooldownSec: 4,
    enabled: true
  },
  {
    id: 'k6',
    name: 'Quốc kỳ & Tỉnh thành',
    keywords: ['hà nội', 'sài gòn', 'tp hcm', 'đà nẵng', 'cờ', 'quốc kỳ', 'việt nam', 'yêu việt nam'],
    replyText: 'Vị trí cờ của bạn [user] vừa được cắm rạng rỡ và uy nghiêm trên bản đồ Tổ Quốc! Mọi người hãy cùng phủ kín cờ đỏ sao vàng nhé!',
    role: 'game',
    cooldownSec: 4,
    enabled: true
  }
];

class GameVoiceEngine {
  constructor(gameType = 'map') {
    this.gameType = gameType; // 'map' | 'battle'
    this.storageKey = `GAME_VOICE_CONFIG_${gameType.toUpperCase()}`;
    
    // Core Voice Role Configurations (Mặc định dùng giọng Việt Nam native 100% miễn phí & tức thì)
    this.gameVoice = { 
      id: 'free_vi_male', 
      name: 'Nam Minh 🇻🇳 (Nam - BLV Game)', 
      voiceId: 'free_vi_male', 
      provider: 'system', 
      tier: 'free',
      gender: 'Male',
      rate: 1.08,
      pitch: 0.9,
      volume: 1.0,
      enabled: true
    };
    this.assistantVoice = { 
      id: 'free_vi_female', 
      name: 'Hoài My 🇻🇳 (Nữ - Ngọt ngào)', 
      voiceId: 'free_vi_female', 
      provider: 'system', 
      tier: 'free',
      gender: 'Female',
      rate: 1.0,
      pitch: 1.1,
      volume: 1.0,
      enabled: true
    };
    
    // Auto Periodic Commentary Config
    this.isAutoEnabled = false;
    this.isAutoLoop = true; // Loop endlessly throughout livestream
    this.intervalSeconds = 25; // 25s
    this.playbackOrder = 'sequential'; // 'sequential' | 'random'
    this.prompts = gameType === 'battle' ? [...DEFAULT_BATTLE_PROMPTS] : [...DEFAULT_MAP_PROMPTS];
    this.lastSpokenIndex = -1;
    this.timerId = null;
    
    // Keyword Auto Reply Config & Gemini Q&A
    this.isKeywordAutoReplyEnabled = true;
    this.useGeminiAI = true;
    this.responseDelaySec = 0.5;
    this.replyCooldownSec = 3; // Giãn cách tối thiểu giữa 2 lần trả lời bình luận
    this.lastReplyTime = 0;
    this.keywordRules = [...DEFAULT_KEYWORD_RULES];
    this.lastKeywordTriggerTimes = new Map();
    
    // Auto Greeting Config (Tự động chào khán giả mới vào Live)
    this.isAutoGreetingEnabled = true;
    
    // Audio State
    this.volume = 0.9;
    this.speedRate = 1.0;
    this.pitch = 1.0;
    this.isMuted = false;
    this.isSpeaking = false;
    
    // Voice Queue Management (KHÔNG ĐỂ CHỒNG CHÉO)
    this.speechQueue = [];
    this.isProcessingQueue = false;
    
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
      if (e.key === this.storageKey || e.key === 'AVALIVE_KEYWORD_RULES_SHARED') {
        this.loadSettings();
      }
    });
    window.addEventListener('game_voice_settings_updated', (e) => {
      if (e.detail?.settings) {
        this.loadSettings();
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
        if (parsed.isAutoGreetingEnabled !== undefined) this.isAutoGreetingEnabled = parsed.isAutoGreetingEnabled;
        if (parsed.useGeminiAI !== undefined) this.useGeminiAI = parsed.useGeminiAI;
        if (parsed.responseDelaySec !== undefined) this.responseDelaySec = parsed.responseDelaySec;
        if (parsed.replyCooldownSec !== undefined) this.replyCooldownSec = parsed.replyCooldownSec;
        if (Array.isArray(parsed.keywordRules) && parsed.keywordRules.length > 0) this.keywordRules = parsed.keywordRules;
        if (parsed.volume !== undefined) this.volume = parsed.volume;
        if (parsed.speedRate !== undefined) this.speedRate = parsed.speedRate;
        if (parsed.pitch !== undefined) this.pitch = parsed.pitch;
        if (parsed.isMuted !== undefined) this.isMuted = parsed.isMuted;
      }
      const sharedRulesRaw = localStorage.getItem('AVALIVE_KEYWORD_RULES_SHARED');
      if (sharedRulesRaw) {
        const sharedRules = JSON.parse(sharedRulesRaw);
        if (Array.isArray(sharedRules) && sharedRules.length > this.keywordRules.length) {
          this.keywordRules = sharedRules;
        }
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
        isAutoGreetingEnabled: this.isAutoGreetingEnabled,
        useGeminiAI: this.useGeminiAI,
        responseDelaySec: this.responseDelaySec,
        replyCooldownSec: this.replyCooldownSec,
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

  setIntervalSeconds(sec) {
    this.intervalSeconds = Math.max(5, Math.min(300, Number(sec) || 25));
    if (this.timerId && this.isAutoEnabled) {
      this.startPeriodicCommentary(this.isGameActive);
    }
    this.saveSettings();
  }

  setReplyCooldownSec(sec) {
    this.replyCooldownSec = Math.max(1, Math.min(60, Number(sec) || 3));
    this.saveSettings();
  }

  setAutoGreetingEnabled(enabled) {
    this.isAutoGreetingEnabled = !!enabled;
    this.saveSettings();
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
  }

  startPeriodicCommentary(isGameActive = false) {
    this.isGameActive = isGameActive;
    this.stopPeriodicCommentary();
    if (!this.isAutoEnabled) return;

    const intervalMs = Math.max(5000, this.intervalSeconds * 1000);
    this.timerId = setInterval(() => {
      this.speakNextPrompt();
    }, intervalMs);
  }

  stopPeriodicCommentary() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Thuật toán xoay vòng thông minh: Đảm bảo các câu bình luận luôn tươi mới, không lặp lại nhàm chán
  speakNextPrompt() {
    const activePrompts = (this.prompts || []).filter(p => p.enabled !== false);
    if (activePrompts.length === 0) return;

    let targetPrompt;
    if (this.playbackOrder === 'sequential') {
      const nextIdx = this.lastSpokenIndex + 1;
      if (nextIdx >= activePrompts.length) {
        if (this.isAutoLoop !== false) {
          this.lastSpokenIndex = 0;
          targetPrompt = activePrompts[0];
        } else {
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

    let activeVoice = null;
    let effectiveRole = 'game';

    if (roleOrVoice === 'assistant') {
      activeVoice = this.assistantVoice;
      effectiveRole = 'assistant';
    } else if (roleOrVoice === 'game') {
      activeVoice = this.gameVoice;
      effectiveRole = 'game';
    } else if (typeof roleOrVoice === 'string') {
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

    if (activeVoice?.enabled === false) return;

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

    this.isSpeaking = true;
    if (this.onDuckAudio) this.onDuckAudio(true);
    if (this.onSpeechStateChange) this.onSpeechStateChange(true, text, effectiveRole);

    return previewVoiceAudio(voiceObj, text, () => {
      this.isSpeaking = false;
      if (this.onDuckAudio) this.onDuckAudio(false);
      if (this.onSpeechStateChange) this.onSpeechStateChange(false, '', effectiveRole);
    }, priority);
  }

  cancelSpeech() {
    stopVoiceAudio();
    this.speechQueue = [];
    this.isProcessingQueue = false;
    this.isSpeaking = false;
    if (this.onDuckAudio) this.onDuckAudio(false);
    if (this.onSpeechStateChange) this.onSpeechStateChange(false, '', 'game');
  }

  stopAll() {
    this.stopPeriodicCommentary();
    this.cancelSpeech();
    this.isGameActive = false;
  }

  // Khớp Từ Khóa & Bộ Não AI Gemini Tự Động Trả Lời Câu Hỏi Ngoài Vùng Cài Đặt (Smart Real-time Q&A)
  async handleUserComment(commentText, userName = 'Khán Giả') {
    if (this.isKeywordAutoReplyEnabled === false || !commentText) return false;
    
    const normalize = (str) => {
      const s = String(str || '').toLowerCase().trim();
      const noAcc = s
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d");
      return { raw: s, noAcc };
    };

    const { raw: lower, noAcc } = normalize(commentText);
    const now = Date.now();
    const effectiveUser = userName || 'bạn';

    // 1. Khớp từ khóa cố định trong danh sách cài sẵn (Ưu tiên số 1)
    const activeRules = (this.keywordRules || []).filter(r => r && r.enabled !== false);
    for (const rule of activeRules) {
      const rawKeywords = Array.isArray(rule.keywords)
        ? rule.keywords
        : (typeof rule.keywords === 'string' ? rule.keywords.split(',').map(s => s.trim()) : []);

      const matched = rawKeywords.some(k => {
        if (!k) return false;
        const kNorm = normalize(k);
        return lower.includes(kNorm.raw) || noAcc.includes(kNorm.noAcc);
      });

      if (matched) {
        // Khử lặp theo từng User: Mỗi người xem chỉ trả lời 1 lần duy nhất cho cùng 1 quy tắc (giãn cách 25s cho cùng 1 user)
        if (!this.lastUserKeywordTriggerTimes) this.lastUserKeywordTriggerTimes = new Map();
        const userRuleKey = `${effectiveUser.toLowerCase().trim()}_${rule.id}`;
        const lastUserTime = this.lastUserKeywordTriggerTimes.get(userRuleKey) || 0;
        if (now - lastUserTime < 25000) {
          continue; // Người này vừa được trả lời câu này rồi, không nhắc lại
        }

        const lastTime = this.lastKeywordTriggerTimes.get(rule.id) || 0;
        const cooldownMs = (rule.cooldownSec || 2) * 1000;
        if (now - lastTime < cooldownMs) {
          continue; // Cooldown protection toàn cục cho quy tắc này
        }

        this.lastUserKeywordTriggerTimes.set(userRuleKey, now);
        this.lastKeywordTriggerTimes.set(rule.id, now);
        this.lastReplyTime = now;

        let reply = String(rule.replyText || '')
          .replace(/\[user\]/gi, effectiveUser)
          .replace(/\[game\]/gi, this.gameType === 'battle' ? 'Đại Chiến PK' : 'Bản Đồ Cắm Cờ');

        const voiceTarget = rule.voiceId || rule.role || 'assistant';
        this.speak(reply, voiceTarget, false);
        return true;
      }
    }

    // 2. Nếu không khớp từ khóa: Phản hồi thông minh câu hỏi ngoài vùng (Mỗi User giãn cách tối thiểu 15s)
    if (!this.lastUserAiReplyTimes) this.lastUserAiReplyTimes = new Map();
    const userAiKey = effectiveUser.toLowerCase().trim();
    const lastUserAiTime = this.lastUserAiReplyTimes.get(userAiKey) || 0;
    if (now - lastUserAiTime < 15000) {
      return false; // Người này vừa được AI trả lời, không trả lời dồn dập
    }

    const globalCooldownMs = Math.max(1, this.replyCooldownSec || 2) * 1000;
    if (now - (this.lastReplyTime || 0) < globalCooldownMs) {
      return false;
    }

    if (lower.length >= 1) {
      this.lastUserAiReplyTimes.set(userAiKey, now);
      this.lastReplyTime = now;

      // Nếu bật Gemini AI:
      if (this.useGeminiAI !== false) {
        try {
          const aiResponse = await askGeminiLiveAi({
            question: commentText,
            username: effectiveUser,
            role: this.assistantVoice?.gender === 'Female' ? 'assistant' : 'game',
            context: this.gameType === 'battle' ? 'Đại Chiến PK Rồng Xanh vs Hổ Đỏ' : 'Đại Chiến Cắm Cờ Bản Đồ Tổ Quốc Việt Nam',
            gameType: this.gameType
          });

          if (aiResponse?.text) {
            this.speak(aiResponse.text, this.assistantVoice || 'assistant', false);
            return true;
          }
        } catch (geminiErr) {}
      }

      // Phản hồi thông minh có sẵn dự phòng (100% Free)
      const smartFallbacks = [
        `Dạ em chào bạn ${effectiveUser}! Chúc bạn xem livestream vui vẻ và cùng thả tim để phủ kín cờ đỏ sao vàng nhé!`,
        `Em cảm ơn bạn ${effectiveUser} đã tương tác rất nhiệt tình cùng phòng live hôm nay nha!`,
        `Dạ chào bạn ${effectiveUser}! Bạn hãy chọn vùng đất quê hương yêu thích và tiếp sức cùng mọi người nhé!`,
        `Dạ cảm ơn bạn ${effectiveUser}! Mọi người cùng chung tay cắm cờ để rạng rỡ non sông Việt Nam nào!`
      ];
      const chosen = smartFallbacks[Math.floor(Math.random() * smartFallbacks.length)];
      this.speak(chosen, 'assistant', false);
      return true;
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
