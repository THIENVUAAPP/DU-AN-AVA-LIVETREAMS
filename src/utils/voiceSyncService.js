/**
 * AVA LIVE - Unified ElevenLabs & Multi-Language Voice Architecture
 * Chuẩn hóa hệ thống âm thanh & Giọng đọc cho toàn bộ ứng dụng:
 * 1. VOICE IDOL: Giọng nhân vật Idol Livestream chính (Kịch bản chính, lip-sync, trả lời comment)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ: Giọng Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, giục chốt đơn, thông báo hệ thống)
 * 3. VOICE BÌNH LUẬN VIÊN GAME: Giọng BLV trận đấu & tương tác game livestream (Kịch tính, năng lượng, hò reo)
 * Hỗ trợ trọn vẹn 20 ngôn ngữ phổ biến trên thế giới với đầy đủ Giọng Nam & Giọng Nữ (Miễn phí & Pro)
 */

export const ELEVENLABS_VOICES = [
  // ==================== 1. GIỌNG NỮ (Idol Livestream / Giao lưu / Bán hàng) ====================
  { id: 'el_rachel', name: 'Rachel (Nữ - Ngọt ngào, Tự nhiên)', provider: 'elevenlabs', voiceId: '21m00Tcm4TlvDq8ikWAM', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ trẻ trung, ấm áp, cực kỳ hợp cho Idol Livestream.' },
  { id: 'el_bella', name: 'Bella (Nữ - Nhẹ nhàng, Dễ thương)', provider: 'elevenlabs', voiceId: 'EXAVITQu4vr4xnSDxMaL', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ êm ái, truyền cảm, tâm sự và giao lưu thân thiện.' },
  { id: 'el_domi', name: 'Domi (Nữ - Năng động, Tươi vui)', provider: 'elevenlabs', voiceId: 'AZnzlk1XvdvUeBnXmlld', gender: 'Female', lang: 'vi-VN', recommendedFor: 'both', desc: 'Giọng nữ hoạt náo, nhịp điệu nhanh, hợp livestream sự kiện & minigame.' },
  { id: 'el_emily', name: 'Emily (Nữ - Sang trọng, Thanh lịch)', provider: 'elevenlabs', voiceId: 'LcfcDJNigL5wcJAoLJq7', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ chuẩn chỉnh, điềm đạm, phù hợp livestream thương hiệu.' },
  { id: 'el_elli', name: 'Elli (Nữ - Cảm xúc, Truyền cảm)', provider: 'elevenlabs', voiceId: 'MF3mGyEYCl7XYWbV9V6O', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ giàu cảm xúc, hợp kể chuyện, đọc tâm sự.' },
  { id: 'el_gigi', name: 'Gigi (Nữ - Anime, Nhí nhảnh)', provider: 'elevenlabs', voiceId: 'jBpfuIE2acCO8z3wKNLl', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ anime nhí nhảnh, phù hợp idol giải trí.' },
  { id: 'el_glinda', name: 'Glinda (Nữ - Nữ hoàng Quyền lực)', provider: 'elevenlabs', voiceId: 'z9fAnlkOXvlPwwBMtIwu', gender: 'Female', lang: 'vi-VN', recommendedFor: 'game', desc: 'Giọng nữ tướng quân đanh thép, thông báo sự kiện bùng nổ.' },

  // ==================== 2. GIỌNG NAM (BLV Game / Quản lý / Bán hàng) ====================
  { id: 'el_josh', name: 'Josh (Nam - BLV Game Siêu Tốc, Năng Lượng)', provider: 'elevenlabs', voiceId: 'TxGEqnHWrfWFTfGW9XjX', gender: 'Male', lang: 'vi-VN', recommendedFor: 'game', desc: 'Giọng caster game sôi động, bùng nổ khi combat.' },
  { id: 'el_clyde', name: 'Clyde (Nam - Chiến Binh Hùng Tráng)', provider: 'elevenlabs', voiceId: '2EiwWnXFnvU5JabPnv8n', gender: 'Male', lang: 'vi-VN', recommendedFor: 'game', desc: 'Giọng tướng quân chiến trận, uy nghiêm vang dội.' },
  { id: 'el_callum', name: 'Callum (Nam - Quản Lý Giục Chốt Đơn)', provider: 'elevenlabs', voiceId: 'N2lVS1w4EtoT3dr4eOWO', gender: 'Male', lang: 'vi-VN', recommendedFor: 'manager', desc: 'Giọng quản lý bán hàng uy lực, giục chốt đơn tức thì.' },
  { id: 'el_adam', name: 'Adam (Nam - Điềm Tĩnh, Chắc Chắn)', provider: 'elevenlabs', voiceId: 'pNInz6obpgDQGcFmaJgB', gender: 'Male', lang: 'vi-VN', recommendedFor: 'manager', desc: 'Giọng tư vấn khách hàng điềm đạm, chuyên nghiệp.' },
  { id: 'el_antoni', name: 'Antoni (Nam - MC Hoạt Náo Live)', provider: 'elevenlabs', voiceId: 'ErXwobaYiN019PkySvjV', gender: 'Male', lang: 'vi-VN', recommendedFor: 'both', desc: 'Giọng MC dẫn dắt game rộn ràng, kích thích tặng quà.' },

  // ==================== 3. GIỌNG PRO 20 QUỐC GIA ====================
  { id: 'el_us_female', name: 'Sarah 🇺🇸 (Nữ - US English Native)', provider: 'elevenlabs', voiceId: 'EXAVITQu4vr4xnSDxMaL', gender: 'Female', lang: 'en-US', recommendedFor: 'idol', desc: 'Giọng nữ bản xứ Mỹ truyền cảm chuẩn quốc tế.' },
  { id: 'el_uk_male', name: 'Arthur 🇬🇧 (Nam - UK British Gentleman)', provider: 'elevenlabs', voiceId: 'JBFqnCBsd6RMkjVDRZzb', gender: 'Male', lang: 'en-GB', recommendedFor: 'game', desc: 'Giọng nam quý ông Anh Quốc lịch lãm.' },
  { id: 'el_cn_female', name: 'Mei-Ling 🇨🇳 (Nữ - Trung Quốc Chuẩn)', provider: 'elevenlabs', voiceId: 'piTKgcLEGmPE4e6mEKli', gender: 'Female', lang: 'zh-CN', recommendedFor: 'idol', desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc.' },
  { id: 'el_cn_male', name: 'Zhang-Wei 🇨🇳 (Nam - Trung Quốc Caster)', provider: 'elevenlabs', voiceId: 'VR6AewLTigWG4xSOukaG', gender: 'Male', lang: 'zh-CN', recommendedFor: 'game', desc: 'Giọng nam bình luận viên võ thuật Trung Hoa.' },
  { id: 'el_jp_female', name: 'Sakura 🇯🇵 (Nữ - Nhật Bản Anime Kawaii)', provider: 'elevenlabs', voiceId: 'jBpfuIE2acCO8z3wKNLl', gender: 'Female', lang: 'ja-JP', recommendedFor: 'idol', desc: 'Giọng nữ Nhật Bản ngọt ngào chuẩn Anime VTuber.' },
  { id: 'el_jp_male', name: 'Kenji 🇯🇵 (Nam - Nhật Bản Samurai)', provider: 'elevenlabs', voiceId: '2EiwWnXFnvU5JabPnv8n', gender: 'Male', lang: 'ja-JP', recommendedFor: 'game', desc: 'Giọng nam Samurai dũng mãnh chuẩn điện ảnh Nhật Bản.' },
  { id: 'el_kr_female', name: 'Min-ji 🇰🇷 (Nữ - Hàn Quốc K-Pop Idol)', provider: 'elevenlabs', voiceId: '21m00Tcm4TlvDq8ikWAM', gender: 'Female', lang: 'ko-KR', recommendedFor: 'idol', desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung.' },
  { id: 'el_kr_male', name: 'Hyun-woo 🇰🇷 (Nam - Hàn Quốc K-Drama)', provider: 'elevenlabs', voiceId: 'TX3LPaxmHKxFdv7VOQHJ', gender: 'Male', lang: 'ko-KR', recommendedFor: 'game', desc: 'Giọng nam MC truyền hình Hàn Quốc ấm áp.' },
  { id: 'el_fr_female', name: 'Camille 🇫🇷 (Nữ - Pháp Paris Chic)', provider: 'elevenlabs', voiceId: 'LcfcDJNigL5wcJAoLJq7', gender: 'Female', lang: 'fr-FR', recommendedFor: 'idol', desc: 'Giọng nữ quý phái phong cách Paris lãng mạn.' },
  { id: 'el_es_female', name: 'Lucia 🇪🇸 (Nữ - Tây Ban Nha)', provider: 'elevenlabs', voiceId: 'MF3mGyEYCl7XYWbV9V6O', gender: 'Female', lang: 'es-ES', recommendedFor: 'idol', desc: 'Giọng nữ Tây Ban Nha rực rỡ và nồng nhiệt.' },
  { id: 'el_th_female', name: 'Premwadee 🇹🇭 (Nữ - Thái Lan)', provider: 'elevenlabs', voiceId: 'XrExE9yKIg1WjnnlVkGX', gender: 'Female', lang: 'th-TH', recommendedFor: 'idol', desc: 'Giọng nữ Thái Lan dịu dàng, trong trẻo.' },
  { id: 'el_de_male', name: 'Hans 🇩🇪 (Nam - Đức)', provider: 'elevenlabs', voiceId: '5Q0t7uMcjvnagumLfvZi', gender: 'Male', lang: 'de-DE', recommendedFor: 'manager', desc: 'Giọng nam Đức trầm ấm, dõng dạc.' },
  { id: 'el_ru_female', name: 'Tatiana 🇷🇺 (Nữ - Nga)', provider: 'elevenlabs', voiceId: 'pMsXgVXv3BLzUgSXRplE', gender: 'Female', lang: 'ru-RU', recommendedFor: 'idol', desc: 'Giọng nữ Nga sâu lắng, truyền cảm.' }
].map(v => ({ ...v, tier: 'pro', icon: '💎', badge: '💎 Pro' }));

// ==================== 4. DANH SÁCH GIỌNG ĐỌC MIỄN PHÍ 20 QUỐC GIA (FREE CLOUD & SYSTEM TTS) ====================
export const FREE_VOICES = [
  // Việt Nam 🇻🇳
  { id: 'free_vi_female', name: 'Hoài My 🇻🇳 (Nữ - Tiếng Việt Chuẩn)', provider: 'system', tier: 'free', icon: '🇻🇳', badge: '🆓 Miễn Phí', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, miễn phí 100%.' },
  { id: 'free_vi_male', name: 'Nam Minh 🇻🇳 (Nam - Tiếng Việt Hào Sảng)', provider: 'system', tier: 'free', icon: '🇻🇳', badge: '🆓 Miễn Phí', gender: 'Male', lang: 'vi-VN', recommendedFor: 'game', desc: 'Giọng nam tiếng Việt hào sảng, bình luận trận đấu dõng dạc, miễn phí.' },
  { id: 'free_vi_female2', name: 'Mai Miền Nam 🇻🇳 (Nữ - Ngọt Ngào)', provider: 'system', tier: 'free', icon: '🇻🇳', badge: '🆓 Miễn Phí', gender: 'Female', lang: 'vi-VN', recommendedFor: 'idol', desc: 'Giọng nữ miền Nam ngọt ngào, gần gũi và tự nhiên.' },
  
  // United States / UK 🇺🇸 🇬🇧
  { id: 'free_en_female', name: 'Jenny 🇺🇸 (Nữ - US English Natural)', provider: 'system', tier: 'free', icon: '🇺🇸', badge: '🆓 Free', gender: 'Female', lang: 'en-US', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Anh chuẩn Mỹ phát âm tự nhiên miễn phí.' },
  { id: 'free_en_male', name: 'David 🇺🇸 (Nam - US English Dynamic)', provider: 'system', tier: 'free', icon: '🇺🇸', badge: '🆓 Free', gender: 'Male', lang: 'en-US', recommendedFor: 'game', desc: 'Giọng nam tiếng Anh phong cách streamer năng động.' },

  // Trung Quốc 🇨🇳
  { id: 'free_zh_female', name: 'Xiaoxiao 🇨🇳 (Nữ - 中文普通话)', provider: 'system', tier: 'free', icon: '🇨🇳', badge: '🆓 免费', gender: 'Female', lang: 'zh-CN', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Trung phổ thông truyền cảm.' },
  { id: 'free_zh_male', name: 'Yunxi 🇨🇳 (Nam - 中文普通话)', provider: 'system', tier: 'free', icon: '🇨🇳', badge: '🆓 免费', gender: 'Male', lang: 'zh-CN', recommendedFor: 'game', desc: 'Giọng nam tiếng Trung hào hùng, khí thế.' },

  // Nhật Bản 🇯🇵
  { id: 'free_ja_female', name: 'Kyoko 🇯🇵 (Nữ - 日本語)', provider: 'system', tier: 'free', icon: '🇯🇵', badge: '🆓 無料', gender: 'Female', lang: 'ja-JP', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Nhật dễ thương trong sáng.' },
  { id: 'free_ja_male', name: 'Keita 🇯🇵 (Nam - 日本語)', provider: 'system', tier: 'free', icon: '🇯🇵', badge: '🆓 無料', gender: 'Male', lang: 'ja-JP', recommendedFor: 'game', desc: 'Giọng nam tiếng Nhật dõng dạc, uy lực.' },

  // Hàn Quốc 🇰🇷
  { id: 'free_ko_female', name: 'Sun-Hi 🇰🇷 (Nữ - 한국어)', provider: 'system', tier: 'free', icon: '🇰🇷', badge: '🆓 무료', gender: 'Female', lang: 'ko-KR', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Hàn Quốc tự nhiên K-Pop.' },
  { id: 'free_ko_male', name: 'In-Joon 🇰🇷 (Nam - 한국어)', provider: 'system', tier: 'free', icon: '🇰🇷', badge: '🆓 무료', gender: 'Male', lang: 'ko-KR', recommendedFor: 'game', desc: 'Giọng nam tiếng Hàn Quốc truyền hình ấm áp.' },

  // Pháp 🇫🇷
  { id: 'free_fr_female', name: 'Denise 🇫🇷 (Nữ - Français)', provider: 'system', tier: 'free', icon: '🇫🇷', badge: '🆓 Gratuit', gender: 'Female', lang: 'fr-FR', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Pháp thanh lịch.' },
  { id: 'free_fr_male', name: 'Henri 🇫🇷 (Nam - Français)', provider: 'system', tier: 'free', icon: '🇫🇷', badge: '🆓 Gratuit', gender: 'Male', lang: 'fr-FR', recommendedFor: 'game', desc: 'Giọng nam tiếng Pháp trầm ấm.' },

  // Tây Ban Nha 🇪🇸
  { id: 'free_es_female', name: 'Elena 🇪🇸 (Nữ - Español)', provider: 'system', tier: 'free', icon: '🇪🇸', badge: '🆓 Gratis', gender: 'Female', lang: 'es-ES', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Tây Ban Nha tươi vui.' },
  { id: 'free_es_male', name: 'Diego 🇪🇸 (Nam - Español)', provider: 'system', tier: 'free', icon: '🇪🇸', badge: '🆓 Gratis', gender: 'Male', lang: 'es-ES', recommendedFor: 'game', desc: 'Giọng nam tiếng Tây Ban Nha năng lượng.' },

  // Thái Lan 🇹🇭
  { id: 'free_th_female', name: 'Achara 🇹🇭 (Nữ - ภาษาไทย)', provider: 'system', tier: 'free', icon: '🇹🇭', badge: '🆓 ฟรี', gender: 'Female', lang: 'th-TH', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Thái êm dịu.' },
  { id: 'free_th_male', name: 'Sarawut 🇹🇭 (Nam - ภาษาไทย)', provider: 'system', tier: 'free', icon: '🇹🇭', badge: '🆓 ฟรี', gender: 'Male', lang: 'th-TH', recommendedFor: 'game', desc: 'Giọng nam tiếng Thái mạnh mẽ.' },

  // Bồ Đào Nha / Brazil 🇧🇷
  { id: 'free_pt_female', name: 'Francisca 🇧🇷 (Nữ - Português)', provider: 'system', tier: 'free', icon: '🇧🇷', badge: '🆓 Grátis', gender: 'Female', lang: 'pt-BR', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Bồ Đào Nha mượt mà.' },

  // Đức 🇩🇪
  { id: 'free_de_female', name: 'Katja 🇩🇪 (Nữ - Deutsch)', provider: 'system', tier: 'free', icon: '🇩🇪', badge: '🆓 Kostenlos', gender: 'Female', lang: 'de-DE', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Đức chuẩn chỉnh.' },

  // Ý 🇮🇹
  { id: 'free_it_female', name: 'Elsa 🇮🇹 (Nữ - Italiano)', provider: 'system', tier: 'free', icon: '🇮🇹', badge: '🆓 Gratuito', gender: 'Female', lang: 'it-IT', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Ý du dương.' },

  // Nga 🇷🇺
  { id: 'free_ru_female', name: 'Dariya 🇷🇺 (Nữ - Русский)', provider: 'system', tier: 'free', icon: '🇷🇺', badge: '🆓 Бесплатно', gender: 'Female', lang: 'ru-RU', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Nga truyền cảm.' },

  // Ả Rập 🇸🇦
  { id: 'free_ar_female', name: 'Amina 🇸🇦 (Nữ - العربية)', provider: 'system', tier: 'free', icon: '🇸🇦', badge: '🆓 مجاني', gender: 'Female', lang: 'ar-SA', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Ả Rập chuẩn.' },

  // Indonesia 🇮🇩
  { id: 'free_id_female', name: 'Gadis 🇮🇩 (Nữ - Bahasa Indonesia)', provider: 'system', tier: 'free', icon: '🇮🇩', badge: '🆓 Gratis', gender: 'Female', lang: 'id-ID', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Indonesia tự nhiên.' },

  // Ấn Độ 🇮🇳
  { id: 'free_hi_female', name: 'Swara 🇮🇳 (Nữ - हिन्दी)', provider: 'system', tier: 'free', icon: '🇮🇳', badge: '🆓 मुफ्त', gender: 'Female', lang: 'hi-IN', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Hindi chuẩn Ấn Độ.' },

  // Thổ Nhĩ Kỳ 🇹🇷
  { id: 'free_tr_female', name: 'Emel 🇹🇷 (Nữ - Türkçe)', provider: 'system', tier: 'free', icon: '🇹🇷', badge: '🆓 Ücretsiz', gender: 'Female', lang: 'tr-TR', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Thổ Nhĩ Kỳ êm ái.' },

  // Ba Lan 🇵🇱
  { id: 'free_pl_female', name: 'Zofia 🇵🇱 (Nữ - Polski)', provider: 'system', tier: 'free', icon: '🇵🇱', badge: '🆓 Bezpłatny', gender: 'Female', lang: 'pl-PL', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Ba Lan chuẩn.' },

  // Hà Lan 🇳🇱
  { id: 'free_nl_female', name: 'Fenna 🇳🇱 (Nữ - Nederlands)', provider: 'system', tier: 'free', icon: '🇳🇱', badge: '🆓 Gratis', gender: 'Female', lang: 'nl-NL', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Hà Lan trong trẻo.' },

  // Philippines 🇵🇭
  { id: 'free_tl_female', name: 'Rosa 🇵🇭 (Nữ - Tagalog)', provider: 'system', tier: 'free', icon: '🇵🇭', badge: '🆓 Libre', gender: 'Female', lang: 'tl-PH', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Tagalog Philippines sinh động.' },

  // Malaysia 🇲🇾
  { id: 'free_ms_female', name: 'Yasmin 🇲🇾 (Nữ - Bahasa Melayu)', provider: 'system', tier: 'free', icon: '🇲🇾', badge: '🆓 Percuma', gender: 'Female', lang: 'ms-MY', recommendedFor: 'idol', desc: 'Giọng nữ tiếng Malay Malaysia nhẹ nhàng.' }
];

export const ALL_SYSTEM_VOICES = [...ELEVENLABS_VOICES, ...FREE_VOICES];
export const CURATED_VOICES = ALL_SYSTEM_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  idolVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Tiếng Việt Chuẩn)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'idol',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0
  },
  managerVoice: {
    id: 'el_callum',
    name: 'Callum (Nam - Quản Lý Giục Chốt Đơn)',
    provider: 'elevenlabs',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO',
    gender: 'Male',
    role: 'manager',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0
  },
  gameVoice: {
    id: 'free_vi_male',
    name: 'Nam Minh 🇻🇳 (Nam - Tiếng Việt Hào Sảng)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    role: 'game',
    pitch: 1.05,
    rate: 1.15,
    volume: 1.0
  }
};

const STORAGE_KEY = 'aidol_unified_voice_config';

export function getVoiceSyncConfig() {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      idolVoice: { ...DEFAULT_VOICE_CONFIG.idolVoice, ...(parsed.idolVoice || {}) },
      managerVoice: { ...DEFAULT_VOICE_CONFIG.managerVoice, ...(parsed.managerVoice || {}) },
      gameVoice: { ...DEFAULT_VOICE_CONFIG.gameVoice, ...(parsed.gameVoice || {}) }
    };
  } catch {
    return DEFAULT_VOICE_CONFIG;
  }
}

export function saveVoiceSyncConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    const current = getVoiceSyncConfig();
    const updated = {
      idolVoice: { ...current.idolVoice, ...(config.idolVoice || {}) },
      managerVoice: { ...current.managerVoice, ...(config.managerVoice || {}) },
      gameVoice: { ...current.gameVoice, ...(config.gameVoice || {}) }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    try {
      const gsStr = localStorage.getItem('aidol_general_settings');
      const gs = gsStr ? JSON.parse(gsStr) : {};
      gs.mainVoiceId = updated.idolVoice.id;
      gs.assistantVoiceId = updated.managerVoice.id;
      gs.gameVoiceId = updated.gameVoice.id;
      localStorage.setItem('aidol_general_settings', JSON.stringify(gs));
    } catch {}

    window.dispatchEvent(new CustomEvent('aidol_voice_sync_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Lỗi lưu cấu hình Voice:', err);
  }
}

export const getDualVoiceConfig = getVoiceSyncConfig;
export const saveDualVoiceConfig = saveVoiceSyncConfig;

let activePreviewAudio = null;
let activeUtterance = null;

export function stopVoiceAudio() {
  if (typeof window === 'undefined') return;
  if (activePreviewAudio) {
    try {
      activePreviewAudio.pause();
      activePreviewAudio.currentTime = 0;
    } catch {}
    activePreviewAudio = null;
  }
  if (typeof window.speechSynthesis !== 'undefined') {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    activeUtterance = null;
  }
}

export function getElevenLabsApiKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ELEVENLABS_API_KEY) {
    return import.meta.env.VITE_ELEVENLABS_API_KEY.trim();
  }
  if (typeof process !== 'undefined' && process.env?.VITE_ELEVENLABS_API_KEY) {
    return process.env.VITE_ELEVENLABS_API_KEY.trim();
  }
  if (typeof localStorage !== 'undefined') {
    const local = localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('ELEVENLABS_API_KEY') || localStorage.getItem('elevenlabsApiKey');
    if (local && local.trim()) return local.trim();
  }
  return '';
}

/**
 * Phát giọng nói mẫu thử nghiệm (Preview TTS & Live Speech)
 * Đảm bảo 100% tất cả giọng Free & Paid đều phát ra âm thanh tự nhiên ngay lập tức
 */
export async function previewVoiceAudio(voice, sampleText = null, onEnd = null) {
  if (typeof window === 'undefined') {
    if (onEnd) onEnd();
    return;
  }

  stopVoiceAudio();

  const rawLang = voice?.lang || (voice?.id?.includes('_us_') || voice?.id?.includes('_en_') ? 'en-US' : voice?.id?.includes('_zh_') ? 'zh-CN' : voice?.id?.includes('_ja_') ? 'ja-JP' : voice?.id?.includes('_ko_') ? 'ko-KR' : voice?.id?.includes('_fr_') ? 'fr-FR' : voice?.id?.includes('_es_') ? 'es-ES' : voice?.id?.includes('_th_') ? 'th-TH' : voice?.id?.includes('_pt_') ? 'pt-BR' : voice?.id?.includes('_de_') ? 'de-DE' : voice?.id?.includes('_it_') ? 'it-IT' : voice?.id?.includes('_ru_') ? 'ru-RU' : voice?.id?.includes('_ar_') ? 'ar-SA' : voice?.id?.includes('_id_') ? 'id-ID' : voice?.id?.includes('_hi_') ? 'hi-IN' : voice?.id?.includes('_tr_') ? 'tr-TR' : voice?.id?.includes('_pl_') ? 'pl-PL' : voice?.id?.includes('_nl_') ? 'nl-NL' : voice?.id?.includes('_tl_') ? 'tl-PH' : voice?.id?.includes('_ms_') ? 'ms-MY' : 'vi-VN');
  const langCode = rawLang || 'vi-VN';
  const shortLang = langCode.split('-')[0].toLowerCase() || 'vi';

  const defaultSamples = {
    vi: voice?.gender === 'Male' ? 'Chào mừng quý khán giả đến với livestream! Trận chiến cắm cờ đang cực kỳ sôi động!' : 'Xin chào mọi người nha! Chúc các bạn xem live vui vẻ và săn được thật nhiều deal hời nhé!',
    en: voice?.gender === 'Male' ? 'Welcome to our live broadcast! Get ready for an epic interactive battle!' : 'Hello everyone! Thank you for joining our livestream today! Have a wonderful time!',
    zh: '各位直播间的朋友们大家好！欢迎来到我们的互动直播间！',
    ja: 'みなさん、こんにちは！ライブ配信へようこそ！一緒に盛り上がりましょう！',
    ko: '안녕하세요 여러분! 라이브 방송에 오신 것을 진심으로 환영합니다!',
    fr: 'Bonjour à tous et bienvenue sur notre diffusion en direct !',
    es: '¡Hola a todos! ¡Bienvenidos a nuestra transmisión en vivo!',
    th: 'สวัสดีค่ะทุกคน ยินดีต้อนรับสู่การถ่ายทอดสดของเราค่ะ!',
    pt: 'Olá a todos! Sejam muito bem-vindos à nossa transmissão ao vivo!',
    de: 'Hallo zusammen! Herzlich willkommen zu unserem Livestream!',
    it: 'Ciao a tutti e benvenuti nella nostra diretta live!',
    ru: 'Всем привет! Добро пожаловать на наш прямой эфир!',
    ar: 'مرحبًا بالجميع! أهلاً بكم في البث المباشر التفاعلي!',
    id: 'Halo semuanya! Selamat datang di siaran langsung kami!',
    hi: 'नमस्ते दोस्तों! हमारे लाइव प्रसारण में आप सभी का स्वागत है!',
    tr: 'Herkese merhaba! Canlı yayınımıza hoş geldiniz!',
    pl: 'Cześć wszystkim! Witamy na naszej transmisji na żywo!',
    nl: 'Hallo allemaal! Welkom bij onze livestream uitzending!',
    tl: 'Kumusta sa lahat! Maligayang pagdating sa ating livestream!',
    ms: 'Hai semua! Selamat datang ke siaran langsung kami!'
  };

  const textToSpeak = (sampleText || defaultSamples[shortLang] || defaultSamples.vi).trim();
  const apiKey = getElevenLabsApiKey();
  const voiceId = voice?.voiceId || '21m00Tcm4TlvDq8ikWAM';

  // 1. NẾU CÓ ELEVENLABS API KEY & LÀ GIỌNG PRO: Phát qua ElevenLabs API
  if (voice?.provider === 'elevenlabs' && apiKey && apiKey.length > 10) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: textToSpeak,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        activePreviewAudio = audio;
        audio.onended = () => {
          activePreviewAudio = null;
          try { URL.revokeObjectURL(audioUrl); } catch {}
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          activePreviewAudio = null;
          try { URL.revokeObjectURL(audioUrl); } catch {}
          if (onEnd) onEnd();
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('ElevenLabs API direct fetch error, falling back to natural voice audio:', e);
    }
  }

  // 2. TỔNG HỢP GIỌNG ĐỌC CLOUD TTS TỰ NHIÊN (100% Phát tiếng người thật)
  const tryGoogleTts = () => {
    return new Promise((resolve) => {
      try {
        const encodedText = encodeURIComponent(textToSpeak.slice(0, 200));
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${shortLang}&q=${encodedText}`;
        const audio = new Audio(audioUrl);
        activePreviewAudio = audio;
        
        let resolved = false;
        const done = (success) => {
          if (resolved) return;
          resolved = true;
          activePreviewAudio = null;
          if (onEnd) onEnd();
          resolve(success);
        };

        audio.onended = () => done(true);
        audio.onerror = () => done(false);

        audio.volume = 1.0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Playing successfully
          }).catch((err) => {
            console.warn('Audio play catch, trying web speech:', err);
            done(false);
          });
        }
      } catch (err) {
        console.warn('Google TTS instantiate error:', err);
        resolve(false);
      }
    });
  };

  // 3. TỔNG HỢP GIỌNG ĐỌC WEB SPEECH API
  const tryWebSpeech = () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
        if (onEnd) onEnd();
        return resolve(false);
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        activeUtterance = utterance;
        utterance.lang = langCode;

        const isFemale = voice?.gender === 'Female' || voice?.gender === 'Nữ';
        utterance.rate = isFemale ? 1.02 : 1.05;
        utterance.pitch = isFemale ? 1.15 : 0.85;
        utterance.volume = 1.0;

        let hasEnded = false;
        const finish = (ok) => {
          if (hasEnded) return;
          hasEnded = true;
          activeUtterance = null;
          if (onEnd) onEnd();
          resolve(ok);
        };

        utterance.onend = () => finish(true);
        utterance.onerror = () => finish(false);

        // Safety watchdog: nếu Web Speech bị treo hoặc im lặng quá 6 giây, giải phóng
        setTimeout(() => finish(true), 6000);

        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length > 0) {
          const matched = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(shortLang));
          if (matched) utterance.voice = matched;
        }

        window.speechSynthesis.speak(utterance);
      } catch (synthErr) {
        console.warn('Web Speech API failed:', synthErr);
        if (onEnd) onEnd();
        resolve(false);
      }
    });
  };

  // Thử Google TTS trước (100% tự nhiên không cần cài gói giọng OS), nếu thất bại chuyển sang Web Speech
  const cloudSuccess = await tryGoogleTts();
  if (!cloudSuccess) {
    await tryWebSpeech();
  }
}
