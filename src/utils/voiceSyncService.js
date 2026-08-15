/**
 * AVA LIVE - Dual Synchronized Voice Architecture
 * Hệ thống đồng bộ 2 kênh giọng nói:
 * 1. VOICE IDOL (Giọng Idol Livestream chính - Kịch bản chính, tương tác live)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ (Giọng Quản lý / Thiết bị / Trợ lý hậu trường - Bán hàng, giục chốt đơn, tư vấn, chăm sóc, phát nhanh 1-chạm)
 */

export const CURATED_VOICES = [
  // 1. Giọng Nữ (Thích hợp cho Idol / Trợ lý nữ)
  { 
    id: 'el_rachel', 
    name: 'Rachel (Nữ - Ngọt ngào, Tự nhiên)', 
    provider: 'elevenlabs', 
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ trẻ trung, ấm áp, cực kỳ hợp cho Idol Livestream bán hàng thời trang, mỹ phẩm.' 
  },
  { 
    id: 'el_bella', 
    name: 'Bella (Nữ - Nhẹ nhàng, Dễ thương)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ êm ái, truyền cảm, tâm sự và giao lưu thân thiện.' 
  },
  { 
    id: 'el_domi', 
    name: 'Domi (Nữ - Năng động, Tươi vui)', 
    provider: 'elevenlabs', 
    voiceId: 'AZnzlk1XvdvUeBnXmlld',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ hoạt náo, nhịp điệu nhanh, hợp livestream sự kiện & minigame.' 
  },
  { 
    id: 'el_emily', 
    name: 'Emily (Nữ - Sang trọng, Thanh lịch)', 
    provider: 'elevenlabs', 
    voiceId: 'LcfcDJNigL5wcJAoLJq7',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ chuẩn chỉnh, điềm đạm, phù hợp livestream thương hiệu cao cấp.' 
  },
  { 
    id: 'openai_nova', 
    name: 'Nova (OpenAI - Nữ Hiện đại, Rõ nét)', 
    provider: 'openai_tts', 
    voiceId: 'nova',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng OpenAI TTS chuẩn xác, phát âm tiếng Việt trôi chảy.' 
  },
  { 
    id: 'openai_shimmer', 
    name: 'Shimmer (OpenAI - Nữ Trầm ấm, Quyến rũ)', 
    provider: 'openai_tts', 
    voiceId: 'shimmer',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ sâu lắng, phù hợp phiên live đêm muộn hoặc tư vấn chuyên sâu.' 
  },
  { 
    id: 'vbee_hn_female', 
    name: 'Mai Phương (Vbee - Nữ Hà Nội Chuẩn)', 
    provider: 'vbee', 
    voiceId: 'vi_hn_maiphuong',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng chuẩn thủ đô Hà Nội, phát âm tròn vành rõ chữ.' 
  },
  { 
    id: 'vbee_sg_female', 
    name: 'Mỹ An (Vbee - Nữ Sài Gòn Duyên dáng)', 
    provider: 'vbee', 
    voiceId: 'vi_sg_myan',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng miền Nam dễ thương, gần gũi và thu hút người xem.' 
  },

  // 2. Giọng Nam / Quản Lý / Trợ Lý Bán Hàng (Thích hợp cho Quản lý / Thiết bị / Giục đơn)
  { 
    id: 'el_callum', 
    name: 'Callum (Nam - Mạnh mẽ, Quyết đoán)', 
    provider: 'elevenlabs', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng quản lý bán hàng đầy uy lực, giục chốt đơn và thông báo giảm giá cực tốt.' 
  },
  { 
    id: 'el_adam', 
    name: 'Adam (Nam - Điềm tĩnh, Đáng tin cậy)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng quản lý hỗ trợ kỹ thuật, chăm sóc khách hàng và giải đáp thắc mắc.' 
  },
  { 
    id: 'el_antoni', 
    name: 'Antoni (Nam - Chuyên nghiệp, Tự tin)', 
    provider: 'elevenlabs', 
    voiceId: 'ErXwobaYiN019PkySvjV',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng trợ lý hậu trường thông báo sự kiện, minigame và quà tặng.' 
  },
  { 
    id: 'openai_onyx', 
    name: 'Onyx (OpenAI - Nam Trầm, Uy lực)', 
    provider: 'openai_tts', 
    voiceId: 'onyx',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng phát thanh viên nam OpenAI, rất rõ ràng khi phát thông báo đè lên Live.' 
  },
  { 
    id: 'openai_echo', 
    name: 'Echo (OpenAI - Nam Năng lượng, Sôi nổi)', 
    provider: 'openai_tts', 
    voiceId: 'echo',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng nam bán hàng dồn dập, đẩy nhịp độ phiên livestream.' 
  },
  { 
    id: 'openai_alloy', 
    name: 'Alloy (OpenAI - Trung tính, Linh hoạt)', 
    provider: 'openai_tts', 
    voiceId: 'alloy',
    gender: 'Neutral', 
    recommendedFor: 'manager', 
    desc: 'Giọng thiết bị AI chuẩn, chuyên nghiệp cho mọi tính năng phụ trợ.' 
  },
  { 
    id: 'browser_google_vi', 
    name: 'Google Tiếng Việt (Miễn phí / Trình duyệt)', 
    provider: 'browser', 
    voiceId: 'Google Tiếng Việt',
    gender: 'Female', 
    recommendedFor: 'both', 
    desc: 'Giọng TTS tích hợp sẵn của Google / Trình duyệt máy tính, không tốn token.' 
  }
];

export const DEFAULT_VOICE_CONFIG = {
  // Voice 1: Giọng Idol Trực Tiếp
  idolVoice: {
    id: 'el_rachel',
    name: 'Rachel (Nữ - Ngọt ngào, Tự nhiên)',
    provider: 'elevenlabs',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    gender: 'Female',
    role: 'idol',
    pitch: 1.05,
    rate: 1.0,
    volume: 1.0
  },
  // Voice 2: Giọng Quản Lý / Trợ Lý Bán Hàng (Hậu trường / Thiết bị)
  managerVoice: {
    id: 'el_callum',
    name: 'Callum (Nam - Quyết đoán, Giục chốt đơn)',
    provider: 'elevenlabs',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO',
    gender: 'Male',
    role: 'manager',
    pitch: 0.95,
    rate: 1.08,
    volume: 1.0
  }
};

const STORAGE_KEY = 'aidol_dual_voice_config';

/**
 * Lấy cấu hình 2 giọng voice hiện tại của hệ thống
 */
export function getDualVoiceConfig() {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        idolVoice: { ...DEFAULT_VOICE_CONFIG.idolVoice, ...(parsed.idolVoice || {}) },
        managerVoice: { ...DEFAULT_VOICE_CONFIG.managerVoice, ...(parsed.managerVoice || {}) }
      };
    }

    // Nếu chưa có, thử đồng bộ từ GeneralSettings
    const generalSettingsStr = localStorage.getItem('aidol_general_settings');
    if (generalSettingsStr) {
      const gs = JSON.parse(generalSettingsStr);
      const idolMatch = CURATED_VOICES.find(v => v.id === gs.mainVoiceId);
      const managerMatch = CURATED_VOICES.find(v => v.id === gs.assistantVoiceId);
      
      const config = {
        idolVoice: idolMatch ? { ...DEFAULT_VOICE_CONFIG.idolVoice, ...idolMatch } : DEFAULT_VOICE_CONFIG.idolVoice,
        managerVoice: managerMatch ? { ...DEFAULT_VOICE_CONFIG.managerVoice, ...managerMatch } : DEFAULT_VOICE_CONFIG.managerVoice
      };
      saveDualVoiceConfig(config);
      return config;
    }
  } catch (err) {
    console.warn('Lỗi đọc cấu hình Dual Voice:', err);
  }
  return DEFAULT_VOICE_CONFIG;
}

/**
 * Lưu cấu hình 2 giọng voice và bắn sự kiện đồng bộ toàn bộ app
 */
export function saveDualVoiceConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      idolVoice: { ...DEFAULT_VOICE_CONFIG.idolVoice, ...(config.idolVoice || {}) },
      managerVoice: { ...DEFAULT_VOICE_CONFIG.managerVoice, ...(config.managerVoice || {}) }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Đồng bộ ngược vào aidol_general_settings nếu có
    try {
      const gsStr = localStorage.getItem('aidol_general_settings');
      const gs = gsStr ? JSON.parse(gsStr) : {};
      gs.mainVoiceId = updated.idolVoice.id;
      gs.assistantVoiceId = updated.managerVoice.id;
      localStorage.setItem('aidol_general_settings', JSON.stringify(gs));
    } catch {}

    // Bắn CustomEvent để tất cả component nhận biết ngay
    window.dispatchEvent(new CustomEvent('aidol_voice_sync_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Lỗi lưu cấu hình Dual Voice:', err);
  }
}

/**
 * Phát giọng nói mẫu thử nghiệm (Preview TTS)
 */
export function previewVoiceAudio(voice, sampleText = 'Xin chào, đây là giọng đọc thử nghiệm của hệ thống AVA Live!') {
  if (typeof window === 'undefined') return;

  if (typeof window.speechSynthesis !== 'undefined') {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.lang = 'vi-VN';
    utterance.rate = voice.rate || 1.0;
    utterance.pitch = voice.pitch || 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => 
      (voice.gender === 'Female' && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Linh') || v.name.includes('Google Tiếng Việt'))) ||
      (voice.gender === 'Male' && (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Nam') || v.name.includes('Minh'))) ||
      v.lang.includes('vi')
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    window.speechSynthesis.speak(utterance);
  }
}
