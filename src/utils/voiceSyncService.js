/**
 * AVA LIVE - Unified ElevenLabs Multi-Channel Voice Architecture
 * Chuẩn hóa 100% nền tảng ElevenLabs cho toàn bộ hệ thống âm thanh:
 * 1. VOICE IDOL: Giọng nhân vật Idol Livestream chính (Kịch bản chính, lip-sync, trả lời comment)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ: Giọng Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, giục chốt đơn, thông báo hệ thống)
 * 3. VOICE BÌNH LUẬN VIÊN GAME: Giọng BLV trận đấu & tương tác game livestream (Kịch tính, năng lượng, hò reo)
 */

export const ELEVENLABS_VOICES = [
  // ==================== 1. GIỌNG NỮ (Idol Livestream / Giao lưu / Bán hàng) ====================
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
    recommendedFor: 'both', 
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
    id: 'el_elli', 
    name: 'Elli (Nữ - Cảm xúc, Truyền cảm)', 
    provider: 'elevenlabs', 
    voiceId: 'MF3mGyEYCl7XYWbV9V6O',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ giàu cảm xúc, hợp kể chuyện, đọc tâm sự và review sản phẩm.' 
  },
  { 
    id: 'el_charlotte', 
    name: 'Charlotte (Nữ - Duyên dáng, Tinh tế)', 
    provider: 'elevenlabs', 
    voiceId: 'XB0fDUnXU5powFXDhCwa',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ trong trẻo, phong cách phương Tây hiện đại và cuốn hút.' 
  },
  { 
    id: 'el_matilda', 
    name: 'Matilda (Nữ - Ấm áp, Chân thành)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ mộc mạc, tạo cảm giác tin cậy khi chia sẻ kinh nghiệm.' 
  },
  { 
    id: 'el_gigi', 
    name: 'Gigi (Nữ - Hoạt hình, Dễ thương)', 
    provider: 'elevenlabs', 
    voiceId: 'jBpfuIE2acCO8z3wKNLl',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ anime nhí nhảnh, phù hợp idol giải trí, game thủ nữ.' 
  },
  { 
    id: 'el_freya', 
    name: 'Freya (Nữ - Lôi cuốn, Bí ẩn)', 
    provider: 'elevenlabs', 
    voiceId: 'jsCqWAovK2LkecY7zXl4',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ ma mị, hấp dẫn, rất hợp cho live bói bài, tâm linh hoặc game.' 
  },
  { 
    id: 'el_grace', 
    name: 'Grace (Nữ - Nhã nhặn, Quý phái)', 
    provider: 'elevenlabs', 
    voiceId: 'oWAxZDx7w5VEj9dCyTzz',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ trưởng thành, uyển chuyển, thích hợp livestream trang sức.' 
  },
  { 
    id: 'el_lily', 
    name: 'Lily (Nữ - Trong sáng, Hồn nhiên)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ thanh khiết, gần gũi như bạn thân nói chuyện.' 
  },
  { 
    id: 'el_nicole', 
    name: 'Nicole (Nữ - Hiện đại, Nhanh nhẹn)', 
    provider: 'elevenlabs', 
    voiceId: 'piTKgcLEGmPE4e6mEKli',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ năng động thế hệ mới, chốt sale dứt khoát.' 
  },
  { 
    id: 'el_serena', 
    name: 'Serena (Nữ - Trầm ấm, Sâu lắng)', 
    provider: 'elevenlabs', 
    voiceId: 'pMsXgVXv3BLzUgSXRplE',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ sâu lắng, thích hợp cho livestream đêm muộn, tâm sự.' 
  },
  { 
    id: 'el_glinda', 
    name: 'Glinda (Nữ - Nữ hoàng Quyền lực)', 
    provider: 'elevenlabs', 
    voiceId: 'z9fAnlkOXvlPwwBMtIwu',
    gender: 'Female', 
    recommendedFor: 'game', 
    desc: 'Giọng nữ tướng quân đanh thép, thông báo sự kiện bùng nổ.' 
  },
  { 
    id: 'el_dorothy', 
    name: 'Dorothy (Nữ - Dịu êm, Truyện kể)', 
    provider: 'elevenlabs', 
    voiceId: 'ThT5KcBeYPX3keUQqHPh',
    gender: 'Female', 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ êm ái như đọc truyện, ru ngủ và chữa lành tâm hồn.' 
  },

  // ==================== 2. GIỌNG NAM / QUẢN LÝ / TRỢ LÝ BÁN HÀNG ====================
  { 
    id: 'el_callum', 
    name: 'Callum (Nam - Quyết đoán, Giục chốt đơn)', 
    provider: 'elevenlabs', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng quản lý bán hàng đầy uy lực, giục chốt đơn và thông báo giảm giá cực tốt.' 
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
    id: 'el_adam', 
    name: 'Adam (Nam - Điềm tĩnh, Đáng tin cậy)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng quản lý hỗ trợ kỹ thuật, chăm sóc khách hàng và giải đáp thắc mắc.' 
  },
  { 
    id: 'el_patrick', 
    name: 'Patrick (Nam - Thuyết phục, Uy lực)', 
    provider: 'elevenlabs', 
    voiceId: 'ODq5zmih8GrVes37Dizd',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng nam đanh thép, thích hợp tuyên bố quà độc quyền và deal sốc.' 
  },
  { 
    id: 'el_drew', 
    name: 'Drew (Nam - Tin tức, Trịnh trọng)', 
    provider: 'elevenlabs', 
    voiceId: '29vD33N1CtxCmqQRPOHJ',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng đọc bản tin trang trọng, thích hợp thông báo chính sách bán hàng.' 
  },
  { 
    id: 'el_paul', 
    name: 'Paul (Nam - Phóng viên, Ấm áp)', 
    provider: 'elevenlabs', 
    voiceId: '5Q0t7uMcjvnagumLfvZi',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng nam dẫn chương trình truyền cảm, tạo sự ấm cúng trong phiên live.' 
  },
  { 
    id: 'el_matthew', 
    name: 'Matthew (Nam - Điềm đạm, Chắc chắn)', 
    provider: 'elevenlabs', 
    voiceId: 'Yko7PKHZNXotIFUBG7I9',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng cố vấn kinh doanh, giải thích thông số sản phẩm chuyên sâu.' 
  },
  { 
    id: 'el_james', 
    name: 'James (Nam - Phát thanh viên)', 
    provider: 'elevenlabs', 
    voiceId: 'ZQe5CZNOzWyzPSCn5a3c',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng đài truyền hình chuẩn, rõ ràng sắc nét từng câu chữ.' 
  },
  { 
    id: 'el_sam', 
    name: 'Sam (Nam - Sinh động, Thân thiện)', 
    provider: 'elevenlabs', 
    voiceId: 'yoZ06aMxZJJ28mfd3POQ',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng nam vui tươi, hòa đồng, tư vấn nhiệt tình như anh em trong nhà.' 
  },
  { 
    id: 'el_george', 
    name: 'George (Nam - Uyên bác, Lịch lãm)', 
    provider: 'elevenlabs', 
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    gender: 'Male', 
    recommendedFor: 'manager', 
    desc: 'Giọng quý ông từng trải, chuyên gia đánh giá sản phẩm cao cấp.' 
  },

  // ==================== 3. GIỌNG BÌNH LUẬN VIÊN TRẬN ĐẤU & GAME LIVESTREAM ====================
  { 
    id: 'el_josh', 
    name: 'Josh (Nam - BLV Game Siêu Tốc, Năng Lượng)', 
    provider: 'elevenlabs', 
    voiceId: 'TxGEqnHWrfWFTfGW9XjX',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng caster game thể thao điện tử, nhịp độ dồn dập, cực kỳ bùng nổ khi combat.' 
  },
  { 
    id: 'el_clyde', 
    name: 'Clyde (Nam - Chiến Binh Bá Đạo, Trầm Hùng)', 
    provider: 'elevenlabs', 
    voiceId: '2EiwWnXFnvU5JabPnv8n',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng tướng quân chiến trận, uy nghiêm vang dội, cực hợp PK đại chiến.' 
  },
  { 
    id: 'el_harry', 
    name: 'Harry (Nam - Kịch Tính, Rượt Đuổi Tỷ Số)', 
    provider: 'elevenlabs', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng hồi hộp gay cấn khi hai phe rượt đuổi tỷ số và lật kèo ngoạn mục.' 
  },
  { 
    id: 'el_jeremy', 
    name: 'Jeremy (Nam - MC Sôi Nổi, Hoạt Náo Live)', 
    provider: 'elevenlabs', 
    voiceId: 'bVMeCyTHy58xNoL34h3p',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng MC minigame hăng say, khuấy động không khí livestream nhận quà.' 
  },
  { 
    id: 'el_daniel', 
    name: 'Daniel (Nam - Quyết Liệt, Hùng Dũng)', 
    provider: 'elevenlabs', 
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng chiến binh xông pha, kích hoạt tuyệt kỹ và triệu hồi thần thú.' 
  },
  { 
    id: 'el_arnold', 
    name: 'Arnold (Nam - Uy Nghiêm, Trọng Tài Tối Cao)', 
    provider: 'elevenlabs', 
    voiceId: 'VR6AewLTigWG4xSOukaG',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng trọng tài tối cao, tuyên bố kết quả và vinh danh đại hiệp.' 
  },
  { 
    id: 'el_charlie', 
    name: 'Charlie (Nam - Hài Hước, Trêu Chọc Đối Thủ)', 
    provider: 'elevenlabs', 
    voiceId: 'IKne3meq5aSn9XLyUdCD',
    gender: 'Male', 
    recommendedFor: 'both', 
    desc: 'Giọng trêu chọc đối thủ, tạo tiếng cười sảng khoái cho khán giả.' 
  },
  { 
    id: 'el_thomas', 
    name: 'Thomas (Nam - Hùng Hồn, Sử Thi Tráng Lệ)', 
    provider: 'elevenlabs', 
    voiceId: 'GBv7mTt0atIp3Br8iCZE',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng kể sử thi hào hùng, tôn vinh các chiến tích vang dội trên bản đồ.' 
  },
  { 
    id: 'el_liam', 
    name: 'Liam (Nam - Trẻ trung, Nhiệt huyết Game Thủ)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    gender: 'Male', 
    recommendedFor: 'game', 
    desc: 'Giọng streamer game Gen Z, nhạy bén và cực kỳ bắt trend.' 
  }
];

export const CURATED_VOICES = ELEVENLABS_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  // Voice 1: Giọng Idol Trực Tiếp
  idolVoice: {
    id: 'el_rachel',
    name: 'Rachel (Nữ - Ngọt ngào, Tự nhiên)',
    provider: 'elevenlabs',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    gender: 'Female',
    role: 'idol',
    pitch: 1.0,
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
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0
  },
  // Voice 3: Giọng Bình Luận Viên Trận Đấu Game (Game Live Commentary)
  gameVoice: {
    id: 'el_josh',
    name: 'Josh (Nam - BLV Game Siêu Tốc, Năng Lượng)',
    provider: 'elevenlabs',
    voiceId: 'TxGEqnHWrfWFTfGW9XjX',
    gender: 'Male',
    role: 'game',
    pitch: 1.05,
    rate: 1.15,
    volume: 1.0
  }
};

const STORAGE_KEY = 'aidol_unified_elevenlabs_voice_config';

/**
 * Lấy cấu hình 3 kênh giọng ElevenLabs hiện tại của hệ thống
 */
export function getDualVoiceConfig() {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        idolVoice: { ...DEFAULT_VOICE_CONFIG.idolVoice, ...(parsed.idolVoice || {}) },
        managerVoice: { ...DEFAULT_VOICE_CONFIG.managerVoice, ...(parsed.managerVoice || {}) },
        gameVoice: { ...DEFAULT_VOICE_CONFIG.gameVoice, ...(parsed.gameVoice || {}) }
      };
    }

    // Đọc từ aidol_general_settings nếu có
    const generalSettingsStr = localStorage.getItem('aidol_general_settings');
    if (generalSettingsStr) {
      const gs = JSON.parse(generalSettingsStr);
      const idolMatch = ELEVENLABS_VOICES.find(v => v.id === gs.mainVoiceId);
      const managerMatch = ELEVENLABS_VOICES.find(v => v.id === gs.assistantVoiceId);
      const gameMatch = ELEVENLABS_VOICES.find(v => v.id === gs.gameVoiceId);
      
      const config = {
        idolVoice: idolMatch ? { ...DEFAULT_VOICE_CONFIG.idolVoice, ...idolMatch } : DEFAULT_VOICE_CONFIG.idolVoice,
        managerVoice: managerMatch ? { ...DEFAULT_VOICE_CONFIG.managerVoice, ...managerMatch } : DEFAULT_VOICE_CONFIG.managerVoice,
        gameVoice: gameMatch ? { ...DEFAULT_VOICE_CONFIG.gameVoice, ...gameMatch } : DEFAULT_VOICE_CONFIG.gameVoice
      };
      saveDualVoiceConfig(config);
      return config;
    }
  } catch (err) {
    console.warn('Lỗi đọc cấu hình ElevenLabs Voice:', err);
  }
  return DEFAULT_VOICE_CONFIG;
}

/**
 * Lưu cấu hình 3 kênh giọng ElevenLabs và bắn sự kiện đồng bộ toàn bộ app
 */
export function saveDualVoiceConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    const updated = {
      idolVoice: { ...DEFAULT_VOICE_CONFIG.idolVoice, ...(config.idolVoice || {}) },
      managerVoice: { ...DEFAULT_VOICE_CONFIG.managerVoice, ...(config.managerVoice || {}) },
      gameVoice: { ...DEFAULT_VOICE_CONFIG.gameVoice, ...(config.gameVoice || {}) }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Đồng bộ ngược vào aidol_general_settings
    try {
      const gsStr = localStorage.getItem('aidol_general_settings');
      const gs = gsStr ? JSON.parse(gsStr) : {};
      gs.mainVoiceId = updated.idolVoice.id;
      gs.assistantVoiceId = updated.managerVoice.id;
      gs.gameVoiceId = updated.gameVoice.id;
      localStorage.setItem('aidol_general_settings', JSON.stringify(gs));
    } catch {}

    // Bắn CustomEvent để tất cả component nhận biết ngay
    window.dispatchEvent(new CustomEvent('aidol_voice_sync_updated', { detail: updated }));
    return updated;
  } catch (err) {
    console.error('Lỗi lưu cấu hình ElevenLabs Voice:', err);
  }
}

let activePreviewAudio = null;
let activeUtterance = null;

/**
 * Dừng phát giọng nói xem trước ngay lập tức
 */
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

/**
 * Phát giọng nói mẫu thử nghiệm ElevenLabs / AI Voice (Preview TTS) với hỗ trợ dừng tức thì & onEnd callback
 * Đảm bảo 100% các giọng đọc đều phát được ngay lập tức, không phụ thuộc API key.
 */
export async function previewVoiceAudio(voice, sampleText = null, onEnd = null) {
  if (typeof window === 'undefined') return;

  // Dừng âm thanh preview đang chạy trước đó
  stopVoiceAudio();

  const defaultSample = voice.role === 'game' 
    ? 'Đại chiến cắm cờ đang diễn ra cực kỳ kịch tính! Ai sẽ là người dẫn đầu?'
    : (voice.gender === 'Female' 
        ? 'Xin chào quý khán giả đang xem livestream! Hãy cùng cắm cờ Tổ Quốc rực rỡ nào!'
        : 'Chào mừng tất cả anh em chiến binh đã gia nhập chiến trường livestream hôm nay!');

  const textToSpeak = sampleText || defaultSample;
  const voiceId = voice.voiceId || voice.id?.replace('el_', '') || '21m00Tcm4TlvDq8ikWAM';
  const apiKey = localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('ELEVENLABS_API_KEY');

  // Thử gọi ElevenLabs API nếu có config
  if (apiKey) {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          platform: 'elevenlabs',
          voiceId: voiceId,
          apiKey: apiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
          activePreviewAudio = audio;
          audio.onended = () => {
            activePreviewAudio = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            activePreviewAudio = null;
            if (onEnd) onEnd();
          };
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('ElevenLabs API fetch error, fallback to Web Speech:', e);
    }
  }

  // Fallback 1: Web Speech API siêu tốc, tuỳ biến pitch / rate theo đặc trưng từng giọng
  if (typeof window.speechSynthesis !== 'undefined') {
    try {
      window.speechSynthesis.cancel(); // Reset hàng đợi
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtterance = utterance;
      utterance.lang = 'vi-VN';

      // Điều chỉnh nhịp điệu & tông giọng riêng biệt cho từng loại nhân vật
      const isFemale = voice.gender === 'Female' || voice.gender === 'Nữ';
      const isGame = voice.role === 'game' || voice.recommendedFor === 'game' || voice.id?.includes('blv');
      
      utterance.rate = isGame ? 1.15 : (voice.rate || 1.02);
      utterance.pitch = isFemale ? (voice.pitch || 1.12) : (voice.pitch || 0.92);
      utterance.volume = 1.0;

      utterance.onend = () => {
        activeUtterance = null;
        if (onEnd) onEnd();
      };
      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis error:', err);
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      // Chọn voice phù hợp trong danh sách có sẵn của trình duyệt
      const assignVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const viVoice = voices.find(v => v.lang && (v.lang.startsWith('vi') || v.lang.includes('VIE')));
          if (viVoice) {
            utterance.voice = viVoice;
          } else {
            const genderMatch = voices.find(v => 
              isFemale ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Linh'))
                       : (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Nam'))
            );
            if (genderMatch) utterance.voice = genderMatch;
          }
        }
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        assignVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          assignVoice();
        };
        // Timeout an toàn nếu onvoiceschanged không kích hoạt
        setTimeout(() => {
          if (activeUtterance) {
            window.speechSynthesis.speak(utterance);
          }
        }, 100);
      }
      return;
    } catch (synthErr) {
      console.warn('Web Speech API failed:', synthErr);
    }
  }

  // Cuối cùng nếu không hỗ trợ Web Speech
  if (onEnd) onEnd();
}
