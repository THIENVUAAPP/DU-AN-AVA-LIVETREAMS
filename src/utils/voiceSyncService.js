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
    desc: 'Giọng game thủ Gen Z nhiệt huyết, tràn đầy đam mê và máu lửa.'
  },

  // ==================== 4. GIỌNG ĐỌC QUỐC TẾ (ĐA QUỐC GIA / MULTILINGUAL) ====================
  {
    id: 'el_intl_us_female',
    name: 'Sarah (Nữ - US English Native)',
    provider: 'elevenlabs',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    gender: 'Female',
    recommendedFor: 'idol',
    lang: 'en-US',
    desc: 'Giọng nữ bản xứ Mỹ truyền cảm, mượt mà chuẩn quốc tế.'
  },
  {
    id: 'el_intl_uk_male',
    name: 'Arthur (Nam - UK British Gentleman)',
    provider: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    gender: 'Male',
    recommendedFor: 'manager',
    lang: 'en-GB',
    desc: 'Giọng nam quý ông Anh Quốc lịch lãm, phong thái hoàng gia.'
  },
  {
    id: 'el_intl_jp_female',
    name: 'Sakura (Nữ - Nhật Bản 🇯🇵 Kawaii Anime)',
    provider: 'elevenlabs',
    voiceId: 'jBpfuIE2acCO8z3wKNLl',
    gender: 'Female',
    recommendedFor: 'idol',
    lang: 'ja-JP',
    desc: 'Giọng nữ Nhật Bản ngọt ngào, dễ thương chuẩn Anime VTuber.'
  },
  {
    id: 'el_intl_jp_male',
    name: 'Kenji (Nam - Nhật Bản 🇯🇵 Samurai Warrior)',
    provider: 'elevenlabs',
    voiceId: '2EiwWnXFnvU5JabPnv8n',
    gender: 'Male',
    recommendedFor: 'game',
    lang: 'ja-JP',
    desc: 'Giọng nam Samurai dũng mãnh, khí chất điện ảnh Nhật Bản.'
  },
  {
    id: 'el_intl_kr_female',
    name: 'Min-ji (Nữ - Hàn Quốc 🇰🇷 K-Pop Idol)',
    provider: 'elevenlabs',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    gender: 'Female',
    recommendedFor: 'idol',
    lang: 'ko-KR',
    desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung và hiện đại.'
  },
  {
    id: 'el_intl_kr_male',
    name: 'Hyun-woo (Nam - Hàn Quốc 🇰🇷 K-Drama MC)',
    provider: 'elevenlabs',
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    gender: 'Male',
    recommendedFor: 'manager',
    lang: 'ko-KR',
    desc: 'Giọng nam dẫn chương trình truyền hình Hàn Quốc ấm áp, truyền cảm.'
  },
  {
    id: 'el_intl_cn_female',
    name: 'Mei-Ling (Nữ - Trung Quốc 🇨🇳 Livestream Chốt Đơn)',
    provider: 'elevenlabs',
    voiceId: 'piTKgcLEGmPE4e6mEKli',
    gender: 'Female',
    recommendedFor: 'idol',
    lang: 'zh-CN',
    desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc siêu tốc độ.'
  },
  {
    id: 'el_intl_fr_female',
    name: 'Camille (Nữ - Pháp 🇫🇷 Paris Chic)',
    provider: 'elevenlabs',
    voiceId: 'LcfcDJNigL5wcJAoLJq7',
    gender: 'Female',
    recommendedFor: 'idol',
    lang: 'fr-FR',
    desc: 'Giọng nữ quý phái phong cách Paris nước Pháp lãng mạn và tinh tế.'
  }
].map(v => ({ ...v, tier: 'pro', icon: '💎', badge: '💎 Pro' }));

// ==================== 5. DANH SÁCH GIỌNG ĐỌC MIỄN PHÍ (HỆ THỐNG / EDGE TTS) ====================
export const FREE_VOICES = [
  {
    id: 'free_hoaimy',
    name: 'Hoài My (Nữ - Edge TTS Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Female',
    lang: 'vi-VN',
    recommendedFor: 'idol',
    style: 'Tự nhiên, trong trẻo',
    desc: 'Giọng nữ chuẩn tiếng Việt miền Bắc, phát âm mượt mà, sẵn sàng 24/7 hoàn toàn miễn phí.'
  },
  {
    id: 'free_namminh',
    name: 'Nam Minh (Nam - Edge TTS Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Male',
    lang: 'vi-VN',
    recommendedFor: 'game',
    style: 'Trầm ấm, mạnh mẽ',
    desc: 'Giọng nam chuẩn tiếng Việt miền Bắc, hào sảng, bình luận trận đấu dõng dạc, miễn phí.'
  },
  {
    id: 'free_mai',
    name: 'Mai (Nữ - Miền Nam Dễ Thương)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Female',
    lang: 'vi-VN',
    recommendedFor: 'idol',
    style: 'Dễ thương, miền Nam',
    desc: 'Giọng nữ miền Nam ngọt ngào, gần gũi, giao lưu người xem thân thiện, miễn phí.'
  },
  {
    id: 'free_minh',
    name: 'Minh (Nam - Miền Nam Quyết Đoán)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Male',
    lang: 'vi-VN',
    recommendedFor: 'manager',
    style: 'Chững chạc, uy tín',
    desc: 'Giọng nam miền Nam dõng dạc, giục chốt đơn linh hoạt, thông báo tức thì, miễn phí.'
  },
  {
    id: 'free_google_vi',
    name: 'Google Tiếng Việt (Chuẩn Hệ Thống)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Female',
    lang: 'vi-VN',
    recommendedFor: 'both',
    style: 'Tròn vành rõ chữ',
    desc: 'Giọng đọc Google Tiếng Việt tích hợp mặc định trên trình duyệt Web Speech API.'
  },
  {
    id: 'free_zira_en',
    name: 'Microsoft Zira (Nữ - US English)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Female',
    lang: 'en-US',
    recommendedFor: 'idol',
    style: 'Fluent English',
    desc: 'Giọng nữ tiếng Anh chuẩn Mỹ miễn phí cho livestream quốc tế.'
  },
  {
    id: 'free_david_en',
    name: 'Microsoft David (Nam - US English)',
    provider: 'system',
    tier: 'free',
    icon: '🆓',
    badge: '🆓 Miễn Phí',
    gender: 'Male',
    lang: 'en-US',
    recommendedFor: 'game',
    style: 'Dynamic Game English',
    desc: 'Giọng nam tiếng Anh phong cách streamer năng động miễn phí.'
  },
  {
    id: 'free_kyoko_jp',
    name: 'Kyoko (Nữ - 日本語 Japanese)',
    provider: 'system',
    tier: 'free',
    icon: '🇯🇵',
    badge: '🇯🇵 Free',
    gender: 'Female',
    lang: 'ja-JP',
    recommendedFor: 'idol',
    style: 'Anime & Live',
    desc: 'Giọng nữ tiếng Nhật tiêu chuẩn trình duyệt miễn phí.'
  },
  {
    id: 'free_sunhi_kr',
    name: 'Sun-Hi (Nữ - 한국어 Korean)',
    provider: 'system',
    tier: 'free',
    icon: '🇰🇷',
    badge: '🇰🇷 Free',
    gender: 'Female',
    lang: 'ko-KR',
    recommendedFor: 'idol',
    style: 'K-Pop Live',
    desc: 'Giọng nữ tiếng Hàn Quốc tự nhiên miễn phí.'
  }
];

export const ALL_SYSTEM_VOICES = [...ELEVENLABS_VOICES, ...FREE_VOICES];
export const CURATED_VOICES = ALL_SYSTEM_VOICES;

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

const STORAGE_KEY = 'aidol_unified_voice_config';

/**
 * Lấy cấu hình âm thanh đồng bộ hiện tại của toàn hệ thống
 */
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

/**
 * Cập nhật và lưu cấu hình âm thanh cho toàn bộ các kênh
 */
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
    console.error('Lỗi lưu cấu hình Voice:', err);
  }
}

// Tương thích ngược với các component sử dụng getDualVoiceConfig / saveDualVoiceConfig
export const getDualVoiceConfig = getVoiceSyncConfig;
export const saveDualVoiceConfig = saveVoiceSyncConfig;

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

// Bảng cấu hình Pitch & Rate đặc trưng cho từng Model Voice của ElevenLabs
const VOICE_ACOUSTIC_PROFILES = {
  // Nữ Idol
  'el_rachel': { pitch: 1.15, rate: 1.05, text: 'Xin chào quý khán giả! Em là Rachel, chúc các bạn xem livestream cắm cờ thật vui và săn được thật nhiều quà nhé!' },
  'el_bella': { pitch: 1.25, rate: 1.00, text: 'Chào mọi người nha! Giọng của Bella ngọt ngào dễ thương, cùng nhau tương tác thật rôm rả nào!' },
  'el_domi': { pitch: 1.28, rate: 1.18, text: 'Hế lô cả nhà ơi! Domi năng động sẵn sàng khuấy động không khí livestream bùng nổ ngay bây giờ!' },
  'el_emily': { pitch: 1.08, rate: 1.00, text: 'Kính chào quý vị! Emily rất vinh hạnh được đồng hành trong buổi phát sóng trực tiếp hôm nay.' },
  'el_elli': { pitch: 1.12, rate: 0.98, text: 'Chào các bạn thân yêu! Elli gửi trọn cảm xúc ngọt ngào đến tất cả khán giả đang theo dõi.' },
  'el_charlotte': { pitch: 1.18, rate: 1.06, text: 'Hello mọi người! Charlotte mang phong cách hiện đại, tinh tế và cực kỳ cuốn hút.' },
  'el_matilda': { pitch: 1.05, rate: 0.96, text: 'Thân chào các bạn, Matilda chân thành gửi lời cảm ơn những món quà quý giá của mọi người.' },
  'el_gigi': { pitch: 1.35, rate: 1.20, text: 'Yayyy! Gigi siêu nhí nhảnh đây, các anh chị ơi bấm tim và tặng quà ủng hộ em nha!' },
  'el_freya': { pitch: 0.95, rate: 0.95, text: 'Chào mừng bạn bước vào không gian livestream huyền bí và lôi cuốn cùng Freya.' },
  'el_grace': { pitch: 1.06, rate: 0.98, text: 'Grace xin gửi lời chào trang trọng và quý phái nhất tới tất cả quý khách hàng.' },
  'el_lily': { pitch: 1.22, rate: 1.04, text: 'Chào bạn nhé! Lily trong sáng và hồn nhiên, rất vui được làm quen với mọi người!' },
  'el_nicole': { pitch: 1.14, rate: 1.12, text: 'Nicole chốt đơn siêu tốc! Cơ hội vàng cho các chiến binh trong phiên live hôm nay!' },
  'el_serena': { pitch: 1.00, rate: 0.94, text: 'Serena dịu êm như làn gió, chúc quý vị có những giây phút thư giãn tuyệt vời.' },
  'el_glinda': { pitch: 1.15, rate: 1.08, text: 'Glinda quyền lực xin gửi lời tuyên chiến bùng nổ đến tất cả anh hùng trên bản đồ!' },
  'el_dorothy': { pitch: 1.20, rate: 0.95, text: 'Dorothy dịu dàng gửi lời chúc an lành và niềm vui đến mọi người đang xem live.' },
  
  // Nam BLV & Quản lý
  'el_josh': { pitch: 0.82, rate: 1.18, text: 'VÀOOOO! Tôi là BLV Josh, chiến trường cắm cờ đang nóng hơn bao giờ hết! Ai sẽ là người thống trị bản đồ?' },
  'el_clyde': { pitch: 0.75, rate: 1.05, text: 'Toàn quân xung phong! Phủ kín cờ đỏ sao vàng lên mọi cứ điểm trên bản đồ Việt Nam!' },
  'el_adam': { pitch: 0.76, rate: 1.08, text: 'Adam lên tiếng! Đẳng cấp, chiều sâu và sức mạnh của một thủ lĩnh thực thụ trên livestream!' },
  'el_antoni': { pitch: 0.88, rate: 1.10, text: 'Chào toàn thể anh em! Antoni nhiệt huyết và bùng nổ, hãy cùng nhau công phá bảng xếp hạng!' },
  'el_arnold': { pitch: 0.70, rate: 1.02, text: 'Arnold hùng hồn thông báo: Chiến dịch cắm cờ toàn quốc đã chính thức bước vào giai đoạn quyết định!' },
  'el_sam': { pitch: 0.84, rate: 1.15, text: 'Sam đang trực tiếp bình luận! Một pha tặng quà cực khủng vừa làm thay đổi toàn bộ cục diện trận đấu!' },
  'el_callum': { pitch: 0.80, rate: 1.10, text: 'Quản lý Callum thông báo: Các chiến binh hãy nhanh tay cắm cờ để nhận nhân đôi điểm danh vọng!' },
  'el_charlie': { pitch: 0.90, rate: 1.05, text: 'Charlie thân chào các bạn! Hãy cùng đoàn kết cắm cờ phủ đỏ khắp 63 tỉnh thành Việt Nam!' },
  'el_george': { pitch: 0.85, rate: 0.98, text: 'George kính chào quý vị khán giả đang theo dõi bản đồ trực tiếp trên sóng livestream.' },
  'el_harry': { pitch: 0.92, rate: 1.12, text: 'Harry năng động tràn đầy nhiệt huyết! Anh em sẵn sàng bứt phá top 1 hôm nay chưa?' },
  'el_liam': { pitch: 0.88, rate: 1.08, text: 'Liam xin chào! Từng tấc đất quê hương đều là niềm tự hào của mỗi người con đất Việt!' },
  'el_james': { pitch: 0.78, rate: 1.00, text: 'James phong độ lịch lãm, trân trọng cảm ơn sự ủng hộ nhiệt tình của tất cả các bạn.' },
  'el_brian': { pitch: 0.82, rate: 1.02, text: 'Brian xin chào! Hãy giữ vững tinh thần đồng đội để đưa lá cờ Tổ Quốc lên vị trí cao nhất!' },
  'el_daniel': { pitch: 0.85, rate: 1.06, text: 'Daniel phát biểu: Cảm ơn tình cảm to lớn của các bạn dành cho bản đồ Việt Nam tươi đẹp!' },

  // Quốc Tế
  'el_intl_us_female': { pitch: 1.10, rate: 1.05, lang: 'en-US', text: 'Hello everyone! Welcome to our special livestream event! Enjoy the game!' },
  'el_intl_uk_male': { pitch: 0.85, rate: 1.00, lang: 'en-GB', text: 'Good evening ladies and gentlemen. Welcome to the official national map stream.' },
  'el_intl_jp_female': { pitch: 1.25, rate: 1.10, lang: 'ja-JP', text: 'みなさん、こんにちは！ライブ配信へようこそ！一緒に盛り上がりましょう！' },
  'el_intl_jp_male': { pitch: 0.80, rate: 1.00, lang: 'ja-JP', text: '我が戦士たちよ、いざ出陣！勝利をこの手に掴み取れ！' },
  'el_intl_kr_female': { pitch: 1.18, rate: 1.05, lang: 'ko-KR', text: '안녕하세요 여러분! 라이브 방송에 오신 것을 진심으로 환영합니다!' },
  'el_intl_kr_male': { pitch: 0.85, rate: 1.02, lang: 'ko-KR', text: '전국의 모든 시청자 여러분, 최고의 배틀이 지금 시작됩니다!' },
  'el_intl_cn_female': { pitch: 1.20, rate: 1.15, lang: 'zh-CN', text: '各位直播间的朋友们大家好！赶紧抢购，好礼送不停！' },
  'el_intl_fr_female': { pitch: 1.10, rate: 1.00, lang: 'fr-FR', text: 'Bonjour à tous et bienvenue sur notre diffusion en direct!' }
};

/**
 * Tự động lấy ElevenLabs API Key từ Biến môi trường (Environment Variable) hoặc lưu trữ
 */
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
 * Phát giọng nói mẫu thử nghiệm ElevenLabs / AI Voice (Preview TTS) với hỗ trợ dừng tức thì & onEnd callback
 * Đảm bảo 100% các giọng đọc đều phát được ngay lập tức, sử dụng giọng nói tự nhiên chân thực, KHÔNG phát tiếng bíp.
 */
export async function previewVoiceAudio(voice, sampleText = null, onEnd = null) {
  if (typeof window === 'undefined') return;

  // Dừng âm thanh preview đang chạy trước đó
  stopVoiceAudio();

  const profile = VOICE_ACOUSTIC_PROFILES[voice.id] || {};
  const langCode = voice.lang || profile.lang || 'vi-VN';
  
  const defaultSample = profile.text || (
    langCode.startsWith('en') 
      ? 'Hello! Welcome to our live interactive broadcast!'
      : langCode.startsWith('ja')
        ? 'こんにちは！ライブ配信へようこそ！'
        : langCode.startsWith('ko')
          ? '안녕하세요! 라이브에 오신 것을 환영합니다!'
          : (voice.role === 'game' 
              ? 'Đại chiến cắm cờ đang diễn ra cực kỳ kịch tính! Toàn quân hãy cùng sẵn sàng xung trận!'
              : (voice.gender === 'Female' 
                  ? 'Xin chào quý khán giả đang xem livestream! Hãy cùng cắm cờ Tổ Quốc rực rỡ và nhận thật nhiều quà nhé!'
                  : 'Chào mừng tất cả anh em chiến binh đã gia nhập chiến trường livestream rực lửa hôm nay!'))
  );

  const textToSpeak = sampleText || defaultSample;
  const voiceId = voice.voiceId || voice.id?.replace('el_', '') || '21m00Tcm4TlvDq8ikWAM';
  const apiKey = getElevenLabsApiKey();

  // 1. NẾU CÓ ELEVENLABS API KEY TỪ BIẾN MÔI TRƯỜNG: Gọi trực tiếp máy chủ ElevenLabs TTS High-Fidelity
  if (voice.provider === 'elevenlabs' && apiKey && apiKey.length > 10) {
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
      console.warn('ElevenLabs API direct fetch error, fallback to natural Web Speech TTS:', e);
    }
  }

  // 2. TỔNG HỢP GIỌNG ĐỌC TỰ NHIÊN WEB SPEECH API (Không có tiếng bíp, phát âm chuẩn tự nhiên 100%)
  if (typeof window.speechSynthesis !== 'undefined') {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtterance = utterance;
      utterance.lang = langCode;

      // Áp dụng thông số nhịp điệu & tông giọng riêng biệt cho từng loại Model ElevenLabs
      const isFemale = voice.gender === 'Female' || voice.gender === 'Nữ';
      utterance.rate = profile.rate || (isFemale ? 1.05 : 1.08);
      utterance.pitch = profile.pitch || (isFemale ? 1.15 : 0.85);
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
        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length > 0) {
          const langPrefix = langCode.split('-')[0].toLowerCase();
          const matchedLangVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));

          if (matchedLangVoices.length > 0) {
            const genderMatch = matchedLangVoices.find(v => 
              isFemale ? (v.name.includes('Female') || v.name.includes('HoaiMy') || v.name.includes('Mai') || v.name.includes('Linh') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Kyoko') || v.name.includes('Yuna'))
                       : (v.name.includes('Male') || v.name.includes('NamMinh') || v.name.includes('Minh') || v.name.includes('David') || v.name.includes('Alex') || v.name.includes('Keita') || v.name.includes('InJoon'))
            );
            utterance.voice = genderMatch || matchedLangVoices[0];
          } else {
            const generalMatch = voices.find(v => 
              isFemale ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha'))
                       : (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Alex'))
            );
            if (generalMatch) utterance.voice = generalMatch;
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
        setTimeout(() => {
          if (activeUtterance) {
            window.speechSynthesis.speak(utterance);
          }
        }, 120);
      }
      return;
    } catch (synthErr) {
      console.warn('Web Speech API failed:', synthErr);
    }
  }

  // Cuối cùng nếu không hỗ trợ Web Speech
  if (onEnd) onEnd();
}

