/**
 * AVA LIVE - Unified ElevenLabs & Multi-Language Voice Architecture
 * Chuẩn hóa hệ thống âm thanh & Giọng đọc cho toàn bộ ứng dụng:
 * 1. VOICE IDOL: Giọng nhân vật Idol Livestream chính (Kịch bản chính, lip-sync, trả lời comment)
 * 2. VOICE QUẢN LÝ / TRỢ LÝ: Giọng Quản lý / Thiết bị / Trợ lý hậu trường (Bán hàng, giục chốt đơn, thông báo hệ thống)
 * 3. VOICE BÌNH LUẬN VIÊN GAME: Giọng BLV trận đấu & tương tác game livestream (Kịch tính, năng lượng, hò reo)
 * 
 * HỆ THỐNG 41 GIỌNG ĐỌC VIỆT NAM CAO CẤP (21 NỮ & 20 NAM) + 28 GIỌNG QUỐC TẾ:
 * - 100% Giọng Việt Nam Test Nghe Thử bằng TIẾNG VIỆT chuẩn xác, cảm xúc, không đọc tiếng Anh.
 * - Đúng chuẩn Nam / Nữ, ngữ điệu, phong cách chuyên nghiệp (BTV, MC, Bán Hàng, TVC, Game BLV, ASMR...).
 * - Phân loại rõ ràng Tab Việt Nam (Tách Nam, Nữ, Giọng Trẻ Gen Z, Giọng Doanh Nhân, Cao Tuổi).
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

// ==================== 1. 20 GIỌNG NỮ VIỆT NAM PRO STUDIO ====================
export const VIETNAMESE_FEMALE_VOICES = [
  {
    id: 'vn_nu_bientapvien',
    name: 'Mai Phương 💎 (Nữ - Biên Tập Viên Thời Sự VTV)',
    provider: 'elevenlabs',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Biên Tập Viên & Thời Sự',
    pitch: 1.05,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn biên tập viên truyền hình quốc gia, đĩnh đạc, rõ ràng, uy tín.',
    sampleText: 'Kính chào quý vị và các bạn, bản tin thời sự trực tiếp trên sóng livestream xin được phép bắt đầu.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Kính chào quý vị và các bạn, bản tin thời sự trực tiếp trên sóng livestream xin được phép bắt đầu.')
  },
  {
    id: 'vn_nu_mctruyenhinh',
    name: 'Thanh Trúc 💎 (Nữ - MC Truyền Hình Sang Trọng)',
    provider: 'elevenlabs',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'MC Truyền Hình & Sự Kiện',
    pitch: 1.10,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nữ dẫn chương trình truyền hình sang trọng, cuốn hút, phát âm chuẩn mực.',
    sampleText: 'Chào mừng toàn thể quý khán giả đang theo dõi phiên phát sóng trực tiếp đặc biệt ngày hôm nay!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Chào mừng toàn thể quý khán giả đang theo dõi phiên phát sóng trực tiếp đặc biệt ngày hôm nay!')
  },
  {
    id: 'vn_nu_kechuyen',
    name: 'Hương Giang 💎 (Nữ - Kể Chuyện Cảm Xúc & Đọc Sách)',
    provider: 'elevenlabs',
    voiceId: 'hpp4J3VqNfWAUOO0d1Us',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Tâm Sự',
    pitch: 1.04,
    rate: 0.95,
    recommendedFor: 'idol',
    desc: 'Giọng nữ truyền cảm, ấm áp, sâu lắng, thích hợp đọc sách, podcast tâm sự đêm muộn.',
    sampleText: 'Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện tuyệt vời nhé.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện tuyệt vời nhé.')
  },
  {
    id: 'vn_nu_banhang',
    name: 'Ngọc Huyền 💎 (Nữ - Bán Hàng Chốt Đơn TikTok Shop)',
    provider: 'elevenlabs',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 1.18,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng nữ chốt đơn livestream TikTok Shop tốc độ, năng động, thúc đẩy mua hàng.',
    sampleText: 'Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k trong giỏ hàng, các bạn đặt ngay nhé!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k trong giỏ hàng, các bạn đặt ngay nhé!')
  },
  {
    id: 'vn_nu_quangcao_tvc',
    name: 'Lan Anh 💎 (Nữ - Quảng Cáo TVC & Flash Sale)',
    provider: 'elevenlabs',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Quảng Cáo & Giục Đơn',
    pitch: 1.15,
    rate: 1.10,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quảng cáo TVC chuyên nghiệp, cuốn hút, tạo cảm giác cấp bách chốt sale.',
    sampleText: 'Cơ hội săn sale vàng chỉ còn trong ít phút, hãy nhanh tay bấm vào giỏ hàng chốt đơn ngay kẻo lỡ!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Cơ hội săn sale vàng chỉ còn trong ít phút, hãy nhanh tay bấm vào giỏ hàng chốt đơn ngay kẻo lỡ!')
  },
  {
    id: 'vn_nu_video_viral',
    name: 'Thu Trang 💎 (Nữ - Quay Video Quảng Cáo Viral)',
    provider: 'elevenlabs',
    voiceId: 'FGY2WhTYpPnrIDTdsKH5',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Video Quảng Cáo & Viral',
    pitch: 1.20,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ review sản phẩm, video viral triệu view trên mạng xã hội.',
    sampleText: 'Review chân thật cho cả nhà đây! Sản phẩm hôm nay cực kỳ đỉnh, mọi người cùng xem ngay nhé!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Review chân thật cho cả nhà đây! Sản phẩm hôm nay cực kỳ đỉnh, mọi người cùng xem ngay nhé!')
  },
  {
    id: 'vn_nu_truyencamhung',
    name: 'Ánh Dương 💎 (Nữ - Truyền Cảm Hứng & Động Lực)',
    provider: 'elevenlabs',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'truyencamhung',
    category: 'Truyền Cảm Hứng & Doanh Nhân',
    pitch: 1.08,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ truyền cảm hứng mạnh mẽ, kích thích ý chí vươn lên và năng lượng tích cực.',
    sampleText: 'Mỗi ngày mới là một cơ hội để bạn bứt phá và chạm tới đỉnh cao thành công!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Mỗi ngày mới là một cơ hội để bạn bứt phá và chạm tới đỉnh cao thành công!')
  },
  {
    id: 'vn_nu_ngotngao',
    name: 'Bảo Ngọc 💎 (Nữ - Ngọt Ngào, Dễ Thương KOC)',
    provider: 'elevenlabs',
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Live & Giao Lưu',
    pitch: 1.22,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung ngọt ngào, gần gũi, giao lưu trò chuyện thân thiết.',
    sampleText: 'Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim giúp em nhé!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim giúp em nhé!')
  },
  {
    id: 'vn_nu_ngaytho',
    name: 'Mỹ Uyên 💎 (Nữ - Ngây Thơ, Trong Trẻo Gen Z)',
    provider: 'elevenlabs',
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Live & Giao Lưu',
    pitch: 1.30,
    rate: 1.05,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trong trẻo như pha lê, ngây thơ, đáng yêu chuẩn phong cách idol teen.',
    sampleText: 'A hello mọi người ơi! Hôm nay em live vui lắm nè, cả nhà cùng tương tác với em nha!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('A hello mọi người ơi! Hôm nay em live vui lắm nè, cả nhà cùng tương tác với em nha!')
  },
  {
    id: 'vn_nu_thuhut',
    name: 'Diễm My 💎 (Nữ - Thu Hút, Quyến Rũ Quyền Lực)',
    provider: 'elevenlabs',
    voiceId: 'SAz9YHcvj6GT2YYXdXww',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Thu Hút & Quyến Rũ',
    pitch: 1.06,
    rate: 0.96,
    recommendedFor: 'idol',
    desc: 'Giọng nữ đằm thắm, quyến rũ, mê hoặc người nghe trong từng câu nói.',
    sampleText: 'Cảm ơn người xem đã ghé thăm phiên livestream, hãy ở lại cùng trò chuyện với em nhé.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Cảm ơn người xem đã ghé thăm phiên livestream, hãy ở lại cùng trò chuyện với em nhé.')
  },
  {
    id: 'vn_nu_asmr',
    name: 'Hà My 💎 (Nữ - Thủ Thỉ ASMR Chữa Lành)',
    provider: 'elevenlabs',
    voiceId: 'hpp4J3VqNfWAUOO0d1Us',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Đọc Sách & Chữa Lành',
    pitch: 1.02,
    rate: 0.92,
    recommendedFor: 'idol',
    desc: 'Giọng nữ thì thầm êm dịu, mang lại cảm giác bình yên và thư thái tâm hồn.',
    sampleText: 'Thả lỏng cơ thể, hít thở thật sâu và cảm nhận sự thư thái bình yên trong từng phút giây.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Thả lỏng cơ thể, hít thở thật sâu và cảm nhận sự thư thái bình yên trong từng phút giây.')
  },
  {
    id: 'vn_nu_quyba',
    name: 'Kim Ngân 💎 (Nữ - Quý Bà Doanh Nhân Đẳng Cấp)',
    provider: 'elevenlabs',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'mature',
    styleCategory: 'doanhnhan',
    category: 'Doanh Nhân & Thương Hiệu',
    pitch: 1.02,
    rate: 0.98,
    recommendedFor: 'manager',
    desc: 'Giọng nữ trung niên uy tín, sang trọng, quyền lực của nữ giám đốc tập đoàn.',
    sampleText: 'Uy tín và chất lượng luôn là kim chỉ nam hàng đầu mà thương hiệu của chúng tôi cam kết tới quý khách hàng.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Uy tín và chất lượng luôn là kim chỉ nam hàng đầu mà thương hiệu của chúng tôi cam kết tới quý khách hàng.')
  },
  {
    id: 'vn_nu_chuyengia_yte',
    name: 'Bích Thủy 💎 (Nữ - Chuyên Gia Y Tế & Sức Khỏe)',
    provider: 'elevenlabs',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Chuyên Gia & Y Tế',
    pitch: 1.04,
    rate: 0.98,
    recommendedFor: 'manager',
    desc: 'Giọng nữ tư vấn y khoa, chăm sóc sức khỏe sắc đẹp đầy tin cậy.',
    sampleText: 'Sức khỏe và vẻ đẹp bền vững bắt đầu từ việc chăm sóc bản thân đúng cách mỗi ngày.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Sức khỏe và vẻ đẹp bền vững bắt đầu từ việc chăm sóc bản thân đúng cách mỗi ngày.')
  },
  {
    id: 'vn_nu_blv_game',
    name: 'Yến Nhi 💎 (Nữ - BLV Thể Thao & PK Sôi Động)',
    provider: 'elevenlabs',
    voiceId: 'FGY2WhTYpPnrIDTdsKH5',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Game & Trận Đấu',
    pitch: 1.25,
    rate: 1.12,
    recommendedFor: 'game',
    desc: 'Giọng nữ bình luận viên thể thao, PK game kịch tính, bốc lửa.',
    sampleText: 'Trận đấu đang bước vào những phút combat nghẹt thở nhất, hãy cùng cổ vũ hết mình nào!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Trận đấu đang bước vào những phút combat nghẹt thở nhất, hãy cùng cổ vũ hết mình nào!')
  },
  {
    id: 'vn_nu_hoatnao',
    name: 'Khánh Linh 💎 (Nữ - Hoạt Náo Viên Minigame)',
    provider: 'elevenlabs',
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Sự Kiện & Minigame',
    pitch: 1.20,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ hoạt náo, dẫn dắt các trò chơi minigame tặng quà sôi nổi.',
    sampleText: 'Minigame nhận quà may mắn bắt đầu, mọi người nhanh tay comment đáp án chính xác nào!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Minigame nhận quà may mắn bắt đầu, mọi người nhanh tay comment đáp án chính xác nào!')
  },
  {
    id: 'vn_nu_troly_ai',
    name: 'Minh Thư 💎 (Nữ - Trợ Lý AI Thông Minh CSKH)',
    provider: 'elevenlabs',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Trợ Lý & CSKH',
    pitch: 1.12,
    rate: 1.0,
    recommendedFor: 'manager',
    desc: 'Giọng nữ trợ lý thông minh, ân cần giải đáp mọi thắc mắc của khách hàng.',
    sampleText: 'Dạ em là Trợ lý AI, em luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của quý khách hàng ạ.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Dạ em là Trợ lý AI, em luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc của quý khách hàng ạ.')
  },
  {
    id: 'vn_nu_thoca',
    name: 'Thùy Chi 💎 (Nữ - Giọng Đọc Thơ Ca Lãng Mạn)',
    provider: 'elevenlabs',
    voiceId: 'hpp4J3VqNfWAUOO0d1Us',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Đọc Thơ',
    pitch: 1.06,
    rate: 0.94,
    recommendedFor: 'idol',
    desc: 'Giọng nữ giàu chất thơ, lãng mạn, ngân vang cảm xúc nghệ thuật.',
    sampleText: 'Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương.')
  },
  {
    id: 'vn_nu_phongsu_vtv',
    name: 'Tuyết Mai 💎 (Nữ - Phóng Sự Tài Liệu VTV)',
    provider: 'elevenlabs',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Biên Tập Viên & Phóng Sự',
    pitch: 1.06,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nữ thuyết minh phóng sự tài liệu chuyên sâu, sâu sắc và thuyết phục.',
    sampleText: 'Hành trình khám phá văn hóa và con người Việt Nam luôn mang đến những giá trị sâu sắc.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Hành trình khám phá văn hóa và con người Việt Nam luôn mang đến những giá trị sâu sắc.')
  },
  {
    id: 'vn_nu_giucdon_tocbien',
    name: 'Cẩm Tú 💎 (Nữ - Giục Đơn Tốc Biến Hàng Khủng)',
    provider: 'elevenlabs',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 1.20,
    rate: 1.12,
    recommendedFor: 'manager',
    desc: 'Giọng nữ giục đơn dồn dập, tạo hiệu ứng đám đông mua sắm cuồng nhiệt.',
    sampleText: 'Chỉ còn đúng 5 suất quà tặng độc quyền, các bác bấm mua ngay góc trái màn hình nhé!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Chỉ còn đúng 5 suất quà tặng độc quyền, các bác bấm mua ngay góc trái màn hình nhé!')
  },
  {
    id: 'vn_nu_vtuber_nhinhanh',
    name: 'Nhật Hạ 💎 (Nữ - Anime / VTuber Nhí Nhảnh)',
    provider: 'elevenlabs',
    voiceId: 'FGY2WhTYpPnrIDTdsKH5',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Anime & VTuber',
    pitch: 1.35,
    rate: 1.10,
    recommendedFor: 'idol',
    desc: 'Giọng nữ phong cách VTuber dễ thương, bắt trend giới trẻ.',
    sampleText: 'Cảm ơn các bạn đã ghé xem live! Nhớ bấm theo dõi kênh để không bỏ lỡ buổi live tiếp theo nha!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Cảm ơn các bạn đã ghé xem live! Nhớ bấm theo dõi kênh để không bỏ lỡ buổi live tiếp theo nha!')
  }
];

// ==================== 2. 20 GIỌNG NAM VIỆT NAM PRO STUDIO ====================
export const VIETNAMESE_MALE_VOICES = [
  {
    id: 'el_adam',
    name: 'Adam 💎 (Nam - Giọng Quốc Dân, Bán Hàng & Thuyết Trình)',
    provider: 'elevenlabs',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Thương Mại & Bán Hàng',
    pitch: 0.88,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nam biểu tượng quốc dân của ElevenLabs, ấm áp, điềm đạm, cực kỳ thuyết phục.',
    sampleText: 'Chào mừng tất cả các bạn đã đến với buổi phát sóng hôm nay! Chúc mọi người một ngày tràn đầy năng lượng và thành công!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Chào mừng tất cả các bạn đã đến với buổi phát sóng hôm nay! Chúc mọi người một ngày tràn đầy năng lượng và thành công!')
  },
  {
    id: 'vn_nam_blv_bungno',
    name: 'Quang Huy 💎 (Nam - BLV Game PK Bùng Nổ, Siêu Tốc)',
    provider: 'elevenlabs',
    voiceId: 'SOYHLrjzK2X1ezoPC6cr',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Game Sôi Động',
    pitch: 0.87,
    rate: 1.12,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên game PK bùng nổ, tốc độ cực nhanh khi combat nghẹt thở.',
    sampleText: 'Pha combat đỉnh cao! Cả hai đội đang tung toàn bộ chiêu thức, hãy cùng bùng nổ năng lượng nào anh em ơi!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Pha combat đỉnh cao! Cả hai đội đang tung toàn bộ chiêu thức, hãy cùng bùng nổ năng lượng nào anh em ơi!')
  },
  {
    id: 'vn_nam_mc_haosang',
    name: 'Minh Quân 💎 (Nam - MC Sự Kiện Truyền Hình Hào Sảng)',
    provider: 'elevenlabs',
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'MC Sự Kiện & Hội Trường',
    pitch: 0.94,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng MC dẫn chương trình truyền hình cuốn hút, hoạt náo, tràn đầy năng lượng.',
    sampleText: 'Xin nhiệt liệt chào mừng toàn thể quý vị đại biểu và quý khán giả đã có mặt tại sự kiện trực tiếp hôm nay!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Xin nhiệt liệt chào mừng toàn thể quý vị đại biểu và quý khán giả đã có mặt tại sự kiện trực tiếp hôm nay!')
  },
  {
    id: 'vn_nam_phongsu_vtv',
    name: 'Đức Thắng 💎 (Nam - Phóng Sự Tài Liệu VTV Đĩnh Đạc)',
    provider: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Phóng Sự & Truyền Hình',
    pitch: 0.84,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nam chuẩn phóng sự tài liệu, chín chắn, sâu sắc và đáng tin cậy.',
    sampleText: 'Góc nhìn chân thực, thông tin đa chiều và những câu chuyện lay động hàng triệu trái tim người xem.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Góc nhìn chân thực, thông tin đa chiều và những câu chuyện lay động hàng triệu trái tim người xem.')
  },
  {
    id: 'vn_nam_chotsale',
    name: 'Thành Nam 💎 (Nam - Bán Hàng Chốt Sale Thần Tốc)',
    provider: 'elevenlabs',
    voiceId: 'bIHbv24MWmeRgasZH58o',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 0.92,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng nam bán hàng chốt đơn livestream dứt khoát, thuyết phục khách mua ngay.',
    sampleText: 'Cơ hội duy nhất trong ngày hôm nay! Giá sốc tận đáy kèm quà tặng khủng, anh em chốt đơn ngay kẻo hết!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Cơ hội duy nhất trong ngày hôm nay! Giá sốc tận đáy kèm quà tặng khủng, anh em chốt đơn ngay kẻo hết!')
  },
  {
    id: 'vn_nam_thuyetminh_dienanh',
    name: 'Hoàng Bách 💎 (Nam - Thuyết Minh Phim Điện Ảnh Bom Tấn)',
    provider: 'elevenlabs',
    voiceId: 'pqHfZKP75CvOlQylNhV4',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Thuyết Minh Điện Ảnh',
    pitch: 0.82,
    rate: 0.95,
    recommendedFor: 'idol',
    desc: 'Giọng thuyết minh phim điện ảnh Hollywood đầy kịch tính, hùng tráng.',
    sampleText: 'Một cuộc chiến định mệnh đã bắt đầu, thay đổi toàn bộ vận mệnh của cả vũ trụ!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Một cuộc chiến định mệnh đã bắt đầu, thay đổi toàn bộ vận mệnh của cả vũ trụ!')
  },
  {
    id: 'vn_nam_kechuyen_tramam',
    name: 'Hữu Phước 💎 (Nam - Kể Chuyện Đêm Khuya Trầm Ấm)',
    provider: 'elevenlabs',
    voiceId: 'IKne3meq5aSn9XLyUdCD',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Tâm Sự',
    pitch: 0.80,
    rate: 0.92,
    recommendedFor: 'idol',
    desc: 'Giọng nam trầm ấm, truyền cảm, thích hợp đọc truyện đêm khuya, podcast lắng đọng.',
    sampleText: 'Đêm tĩnh lặng, những kỷ niệm xưa lại ùa về, mang theo bao nỗi niềm chất chứa.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Đêm tĩnh lặng, những kỷ niệm xưa lại ùa về, mang theo bao nỗi niềm chất chứa.')
  },
  {
    id: 'vn_nam_quanly_uyquyen',
    name: 'Quốc Cường 💎 (Nam - Quản Lý Giục Chốt Đơn Uy Quyền)',
    provider: 'elevenlabs',
    voiceId: 'N2lVS1w4EtoT3dr4eOWO',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Giục Đơn & Cảnh Báo',
    pitch: 0.85,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng quản lý bán hàng uy quyền, thúc giục khán giả đặt hàng ngay.',
    sampleText: 'Bộ phận kho thông báo số lượng chỉ còn dưới 10 sản phẩm, quý khách nhanh tay hoàn tất đơn hàng!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Bộ phận kho thông báo số lượng chỉ còn dưới 10 sản phẩm, quý khách nhanh tay hoàn tất đơn hàng!')
  },
  {
    id: 'vn_nam_doanhnhan',
    name: 'Việt Hưng 💎 (Nam - Doanh Nhân Giám Đốc Uy Quyền)',
    provider: 'elevenlabs',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Doanh Nhân & Giám Đốc',
    pitch: 0.78,
    rate: 0.98,
    recommendedFor: 'manager',
    desc: 'Giọng giám đốc điều hành, doanh nhân thành đạt, đĩnh đạc và quyết đoán.',
    sampleText: 'Chiến lược đúng đắn và sự quyết đoán chính là chìa khóa mở ra cánh cửa thành công vượt bậc.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Chiến lược đúng đắn và sự quyết đoán chính là chìa khóa mở ra cánh cửa thành công vượt bậc.')
  },
  {
    id: 'vn_nam_quyong_lichlam',
    name: 'Tuấn Kiệt 💎 (Nam - Quý Ông Lịch Lãm Sang Trọng)',
    provider: 'elevenlabs',
    voiceId: 'cjVigY5qzO86Huf0OWal',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Sang Trọng & Thương Hiệu',
    pitch: 0.83,
    rate: 0.97,
    recommendedFor: 'idol',
    desc: 'Giọng nam quý phái, thanh lịch, phù hợp các sản phẩm cao cấp xa xỉ.',
    sampleText: 'Sự sang trọng tinh tế không nằm ở vẻ hào nhoáng, mà toát ra từ đẳng cấp đích thực.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Sự sang trọng tinh tế không nằm ở vẻ hào nhoáng, mà toát ra từ đẳng cấp đích thực.')
  },
  {
    id: 'vn_nam_chienbinh',
    name: 'Duy Long 💎 (Nam - Chiến Binh Hùng Tráng Hào Hùng)',
    provider: 'elevenlabs',
    voiceId: 'pNInz6obpgDQGcFmaJgB',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'blv_game',
    category: 'Chiến Trận & Hào Hùng',
    pitch: 0.72,
    rate: 1.0,
    recommendedFor: 'game',
    desc: 'Giọng nam tướng quân uy nghi, hào sảng, vang dội như tiếng sấm.',
    sampleText: 'Vì màu cờ sắc áo, toàn quân ta quyết chí xung trận, giành lấy vinh quang vang dội!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Vì màu cờ sắc áo, toàn quân ta quyết chí xung trận, giành lấy vinh quang vang dội!')
  },
  {
    id: 'vn_nam_thaygiao',
    name: 'Gia Bảo 💎 (Nam - Thầy Giáo Giảng Bài Khoa Học)',
    provider: 'elevenlabs',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'truyencamhung',
    category: 'Giảng Dạy & Tri Thức',
    pitch: 0.86,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng giảng viên rõ ràng, mạch lạc, truyền tải kiến thức dễ hiểu.',
    sampleText: 'Chào các bạn, hôm nay chúng ta sẽ cùng nhau tìm hiểu về những nguyên lý khoa học vô cùng thú vị.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Chào các bạn, hôm nay chúng ta sẽ cùng nhau tìm hiểu về những nguyên lý khoa học vô cùng thú vị.')
  },
  {
    id: 'vn_nam_streamer_genz',
    name: 'Khánh Hoàng 💎 (Nam - Streamer Gen Z Dí Dỏm)',
    provider: 'elevenlabs',
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Streamer & Gen Z',
    pitch: 0.98,
    rate: 1.06,
    recommendedFor: 'idol',
    desc: 'Giọng nam trẻ phong cách streamer TikTok, dí dỏm, hài hước và gần gũi.',
    sampleText: 'Anh em thấy thế nào? Quá đỉnh chóp luôn đúng không? Nhớ thả tim và chia sẻ live cho mình nhé!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Anh em thấy thế nào? Quá đỉnh chóp luôn đúng không? Nhớ thả tim và chia sẻ live cho mình nhé!')
  },
  {
    id: 'vn_nam_blv_thethao',
    name: 'Bảo Long 💎 (Nam - BLV Thể Thao Đỉnh Cao)',
    provider: 'elevenlabs',
    voiceId: 'nPczCjzI2devNBz1zQrb',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Thể Thao',
    pitch: 0.90,
    rate: 1.10,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên bóng đá/eSports hừng hực lửa, truyền lửa người xem.',
    sampleText: 'Vào! Một siêu phẩm không thể cản phá! Khán đài đang vỡ òa trong niềm vui sướng tột cùng!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Vào! Một siêu phẩm không thể cản phá! Khán đài đang vỡ òa trong niềm vui sướng tột cùng!')
  },
  {
    id: 'vn_nam_tuvan_khachhang',
    name: 'Trọng Nhân 💎 (Nam - Chuyên Viên Tư Vấn Tận Tụy)',
    provider: 'elevenlabs',
    voiceId: 'iP95p4xoKVk53GoZ742B',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Tư Vấn Khách Hàng',
    pitch: 0.89,
    rate: 1.0,
    recommendedFor: 'manager',
    desc: 'Giọng nam tư vấn nhẹ nhàng, nhiệt tình hỗ trợ giải đáp mọi thắc mắc.',
    sampleText: 'Dạ em chào anh chị ạ! Em rất hân hạnh được hỗ trợ giải đáp mọi thắc mắc của mình hôm nay ạ!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Dạ em chào anh chị ạ! Em rất hân hạnh được hỗ trợ giải đáp mọi thắc mắc của mình hôm nay ạ!')
  },
  {
    id: 'vn_nam_video_viral',
    name: 'Hải Đăng 💎 (Nam - Video Viral & TikTok Review)',
    provider: 'elevenlabs',
    voiceId: 'bIHbv24MWmeRgasZH58o',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Video Quảng Cáo & Viral',
    pitch: 0.95,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nam review công nghệ, sản phẩm hot trend thu hút triệu view.',
    sampleText: 'Review cực kỳ chi tiết cho anh em! Món này thực sự đáng đồng tiền bát gạo, trải nghiệm quá đã!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Review cực kỳ chi tiết cho anh em! Món này thực sự đáng đồng tiền bát gạo, trải nghiệm quá đã!')
  },
  {
    id: 'vn_nam_truyencamhung',
    name: 'Công Danh 💎 (Nam - Truyền Cảm Hứng Làm Giàu)',
    provider: 'elevenlabs',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'truyencamhung',
    category: 'Truyền Cảm Hứng & Doanh Nhân',
    pitch: 0.88,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nam diễn giả truyền lửa, khơi dậy đam mê khởi nghiệp và thành công.',
    sampleText: 'Không có giới hạn nào cho ước mơ của bạn, hãy đứng dậy và hành động ngay hôm nay!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Không có giới hạn nào cho ước mơ của bạn, hãy đứng dậy và hành động ngay hôm nay!')
  },
  {
    id: 'vn_nam_bantin_quocte',
    name: 'Đình Vũ 💎 (Nam - Bản Tin Thời Sự Quốc Tế)',
    provider: 'elevenlabs',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Bản Tin & Thời Sự',
    pitch: 0.86,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng đọc bản tin nhịp nhàng, thông tin rõ ràng, chuẩn phong cách quốc tế.',
    sampleText: 'Cập nhật diễn biến thị trường và những sự kiện nổi bật nhất trên toàn thế giới trong 24 giờ qua.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Cập nhật diễn biến thị trường và những sự kiện nổi bật nhất trên toàn thế giới trong 24 giờ qua.')
  },
  {
    id: 'vn_nam_caotuoi_tritue',
    name: 'Thái Sơn 💎 (Nam - Cao Tuổi Thông Thái Trí Tuệ)',
    provider: 'elevenlabs',
    voiceId: 'pqHfZKP75CvOlQylNhV4',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'mature',
    styleCategory: 'doanhnhan',
    category: 'Cao Tuổi & Tri Thức',
    pitch: 0.74,
    rate: 0.90,
    recommendedFor: 'both',
    desc: 'Giọng nam cao tuổi từng trải, đưa ra những lời khuyên sâu sắc và thấu đáo.',
    sampleText: 'Đời người như dòng sông chảy mãi, biết bao trải nghiệm mới gom tụ thành vốn sống quý giá.',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Đời người như dòng sông chảy mãi, biết bao trải nghiệm mới gom tụ thành vốn sống quý giá.')
  },
  {
    id: 'vn_nam_minigame_bungchay',
    name: 'Văn Hậu 💎 (Nam - MC Minigame Bùng Cháy)',
    provider: 'elevenlabs',
    voiceId: 'SOYHLrjzK2X1ezoPC6cr',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Sự Kiện & Minigame',
    pitch: 0.96,
    rate: 1.08,
    recommendedFor: 'game',
    desc: 'Giọng nam hoạt náo viên khuấy động không khí minigame quà tặng livestream.',
    sampleText: 'Đếm ngược 3 2 1 để nhận phần quà may mắn cực lớn từ phòng live của chúng ta nào!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Đếm ngược 3 2 1 để nhận phần quà may mắn cực lớn từ phòng live của chúng ta nào!')
  }
];

// ==================== 3. 28 GIỌNG QUỐC TẾ PRO ĐA QUỐC GIA ====================
export const INTERNATIONAL_VOICES = [
  // Bắc Mỹ & Anh Quốc 🇺🇸 🇬🇧 🇨🇦 🇦🇺
  { 
    id: 'el_us_female', 
    name: 'Sarah 🇺🇸 (Nữ - US English Native)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ bản xứ Mỹ truyền cảm chuẩn quốc tế.',
    sampleText: 'Hello everyone! Welcome to our special interactive livestream today!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_us_male', 
    name: 'David 🇺🇸 (Nam - US English Streamer)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.95, 
    rate: 1.05, 
    recommendedFor: 'game', 
    desc: 'Giọng nam tiếng Anh phong cách streamer năng động Mỹ.',
    sampleText: 'What is up guys! Get ready for an epic interactive battle today!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_uk_female', 
    name: 'Victoria 🇬🇧 (Nữ - UK British Royal)', 
    provider: 'elevenlabs', 
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', 
    gender: 'Female', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.08, 
    rate: 0.98, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý tộc Anh Quốc sang trọng, chuẩn mực.',
    sampleText: 'Good evening ladies and gentlemen. It is a pleasure to have you here with us.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'
  },
  { 
    id: 'el_uk_male', 
    name: 'Arthur 🇬🇧 (Nam - UK British Gentleman)', 
    provider: 'elevenlabs', 
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', 
    gender: 'Male', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.85, 
    rate: 1.0, 
    recommendedFor: 'game', 
    desc: 'Giọng nam quý ông Anh Quốc lịch lãm, đẳng cấp.',
    sampleText: 'Welcome to the broadcast. Prepare yourselves for an extraordinary journey.',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_ca_male', 
    name: 'Liam 🇨🇦 (Nam - Canada English Friendly)', 
    provider: 'elevenlabs', 
    voiceId: 'bIHbv24MWmeRgasZH58o', 
    gender: 'Male', 
    lang: 'en-CA', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.96, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Canada thân thiện, giao lưu cởi mở.',
    sampleText: 'Hey everyone, so glad you could drop by our stream today! Have fun!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3'
  },
  { 
    id: 'el_au_male', 
    name: 'Oliver 🇦🇺 (Nam - Australian English)', 
    provider: 'elevenlabs', 
    voiceId: 'IKne3meq5aSn9XLyUdCD', 
    gender: 'Male', 
    lang: 'en-AU', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.92, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam bản xứ Úc tự nhiên, phóng khoáng.',
    sampleText: 'G day mate! Welcome to the show, let us get this party started right now!',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/IKne3meq5aSn9XLyUdCD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIxMDJkZTZmMi0yMmVkLTQzZTAtYTFmMS0xMTFmYTc1YzU0ODEubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },

  // Châu Âu 🇫🇷 🇮🇹 🇩🇪 🇪🇸 🇷🇺
  { 
    id: 'el_fr_female', 
    name: 'Camille 🇫🇷 (Nữ - Français Paris Chic)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý phái phong cách Paris lãng mạn.',
    sampleText: 'Bonjour à tous et bienvenue sur notre diffusion en direct !',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  },
  { 
    id: 'el_fr_male', 
    name: 'Henri 🇫🇷 (Nam - Français Élégant)', 
    provider: 'elevenlabs', 
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', 
    gender: 'Male', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.88, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Pháp trầm ấm, lịch thiệp.',
    sampleText: 'Bienvenue à tous mes chers amis, c est un plaisir de vous accueillir.',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3'
  },
  { 
    id: 'el_it_female', 
    name: 'Elsa 🇮🇹 (Nữ - Italiano Dolce)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.14, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Ý du dương, ngọt ngào và cuốn hút.',
    sampleText: 'Ciao a tutti e benvenuti nella nostra meravigliosa diretta live!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_it_male', 
    name: 'Marco 🇮🇹 (Nam - Italiano Passione)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.86, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Ý nồng nhiệt, giàu cảm xúc.',
    sampleText: 'Buonasera a tutti quanti, iniziamo questa grande avventura insieme!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_de_female', 
    name: 'Katja 🇩🇪 (Nữ - Deutsch Präzise)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.05, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đức chính xác, chuẩn mực.',
    sampleText: 'Hallo zusammen! Herzlich willkommen zu unserem offiziellen Livestream!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_de_male', 
    name: 'Hans 🇩🇪 (Nam - Deutsch Kraftvoll)', 
    provider: 'elevenlabs', 
    voiceId: 'N2lVS1w4EtoT3dr4eOWO', 
    gender: 'Male', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.78, 
    rate: 1.0, 
    recommendedFor: 'manager', 
    desc: 'Giọng nam Đức dõng dạc, uy lực và đĩnh đạc.',
    sampleText: 'Guten Tag meine Damen und Herren, wir starten jetzt die Übertragung!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'
  },
  { 
    id: 'el_es_female', 
    name: 'Lucia 🇪🇸 (Nữ - Español Madrid)', 
    provider: 'elevenlabs', 
    voiceId: 'FGY2WhTYpPnrIDTdsKH5', 
    gender: 'Female', 
    lang: 'es-ES', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.15, 
    rate: 1.05, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Tây Ban Nha rực rỡ, tràn đầy sức sống.',
    sampleText: '¡Hola a todos! ¡Bienvenidos a nuestra emocionante transmisión en vivo!',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_ru_female', 
    name: 'Tatiana 🇷🇺 (Nữ - Русский)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'ru-RU', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.06, 
    rate: 0.98, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nga sâu lắng, truyền cảm.',
    sampleText: 'Всем привет! Добро пожаловать на наш прямой эфир!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },

  // Nam Mỹ & Mỹ Latin 🇲🇽 🇧🇷
  { 
    id: 'el_mx_male', 
    name: 'Diego 🇲🇽 (Nam - Español México)', 
    provider: 'elevenlabs', 
    voiceId: 'onwK4e9ZLuTAKqWW03F9', 
    gender: 'Male', 
    lang: 'es-MX', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 0.90, 
    rate: 1.06, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Mexico Latin sôi động, nhiệt huyết.',
    sampleText: '¡Qué onda amigos! ¡Bienvenidos al show más prendido de la noche!',
    previewUrl: 'https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzg4OTE1NjAwMDAwMDAwfQ%3D%3D'
  },
  { 
    id: 'el_br_female', 
    name: 'Francisca 🇧🇷 (Nữ - Português Brasil)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'pt-BR', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 1.16, 
    rate: 1.04, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Brazil mượt mà, gợi cảm.',
    sampleText: 'Olá a todos! Sejam muito bem-vindos à nossa transmissão ao vivo!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },

  // Châu Á 🇨🇳 🇹🇼 🇯🇵 🇰🇷 🇹🇭 🇮🇩 🇵🇭 🇮🇳 🇸🇦
  { 
    id: 'el_cn_female', 
    name: 'Mei-Ling 🇨🇳 (Nữ - 中文普通话 带货主播)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.16, 
    rate: 1.08, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc.',
    sampleText: '各位直播间的朋友们大家好！欢迎来到我们的互动直播间！',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_cn_male', 
    name: 'Zhang-Wei 🇨🇳 (Nam - 中文普通话 Caster)', 
    provider: 'elevenlabs', 
    voiceId: 'SOYHLrjzK2X1ezoPC6cr', 
    gender: 'Male', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.88, 
    rate: 1.06, 
    recommendedFor: 'game', 
    desc: 'Giọng nam bình luận viên võ thuật Trung Hoa.',
    sampleText: '直播间的家人们大家晚上好！精彩对决马上开始！',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'
  },
  { 
    id: 'el_tw_female', 
    name: 'Ting-Ting 🇹🇼 (Nữ - 臺灣國語 甜美)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'zh-TW', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.20, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đài Loan ngọt ngào, nhẹ nhàng.',
    sampleText: '哈囉大家好！歡迎來到今天的直播，記得幫我點個愛心喔！',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_jp_female', 
    name: 'Sakura 🇯🇵 (Nữ - 日本語 Anime Kawaii)', 
    provider: 'elevenlabs', 
    voiceId: 'cgSgspJ2msm6clMCkdW9', 
    gender: 'Female', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.32, 
    rate: 1.06, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nhật Bản ngọt ngào chuẩn Anime VTuber.',
    sampleText: 'みなさん、こんにちは！ライブ配信へようこそ！一緒に盛り上がりましょう！',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'
  },
  { 
    id: 'el_jp_male', 
    name: 'Kenji 🇯🇵 (Nam - 日本語 Samurai Caster)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.76, 
    rate: 1.02, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Samurai dũng mãnh chuẩn điện ảnh Nhật Bản.',
    sampleText: '皆様、ようこそお越しくださいました！熱き戦いを始めよう！',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_kr_female', 
    name: 'Min-ji 🇰🇷 (Nữ - 한국어 K-Pop Idol)', 
    provider: 'elevenlabs', 
    voiceId: 'EXAVITQu4vr4xnSDxMaL', 
    gender: 'Female', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.18, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung.',
    sampleText: '안녕하세요 여러분! 라이브 방송에 오신 것을 진심으로 환영합니다!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'
  },
  { 
    id: 'el_kr_male', 
    name: 'Hyun-woo 🇰🇷 (Nam - 한국어 K-Drama)', 
    provider: 'elevenlabs', 
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', 
    gender: 'Male', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.86, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam MC truyền hình Hàn Quốc ấm áp.',
    sampleText: '반갑습니다 여러분! 오늘 라이브도 즐겁게 함께해요!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'
  },
  { 
    id: 'el_th_female', 
    name: 'Premwadee 🇹🇭 (Nữ - ภาษาไทย)', 
    provider: 'elevenlabs', 
    voiceId: 'XrExE9yKIg1WjnnlVkGX', 
    gender: 'Female', 
    lang: 'th-TH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.15, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Thái Lan dịu dàng, trong trẻo.',
    sampleText: 'สวัสดีค่ะทุกคน ยินดีต้อนรับสู่การถ่ายทอดสดของเราค่ะ!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3'
  },
  { 
    id: 'el_id_female', 
    name: 'Gadis 🇮🇩 (Nữ - Bahasa Indonesia)', 
    provider: 'elevenlabs', 
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', 
    gender: 'Female', 
    lang: 'id-ID', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Indonesia tự nhiên.',
    sampleText: 'Halo semuanya! Selamat datang di siaran langsung kami!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'
  },
  { 
    id: 'el_ph_female', 
    name: 'Rosa 🇵🇭 (Nữ - Tagalog Philippines)', 
    provider: 'elevenlabs', 
    voiceId: 'SAz9YHcvj6GT2YYXdXww', 
    gender: 'Female', 
    lang: 'tl-PH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Tagalog Philippines sinh động.',
    sampleText: 'Kumusta sa lahat! Maligayang pagdating sa ating livestream!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'
  },
  { 
    id: 'el_in_male', 
    name: 'Aarav 🇮🇳 (Nam - Indian English Host)', 
    provider: 'elevenlabs', 
    voiceId: 'pNInz6obpgDQGcFmaJgB', 
    gender: 'Male', 
    lang: 'en-IN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.92, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam tiếng Anh chuẩn Ấn Độ lưu loát.',
    sampleText: 'Namaste everyone! Welcome to our live broadcast session today!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3'
  },
  { 
    id: 'el_ar_female', 
    name: 'Amira 🇸🇦 (Nữ - العربية)', 
    provider: 'elevenlabs', 
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', 
    gender: 'Female', 
    lang: 'ar-SA', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.08, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Ả Rập truyền cảm.',
    sampleText: 'مرحبًا بالجميع! أهلاً بكم في البث المباشر التفاعلي!',
    previewUrl: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3'
  }
];

export const ELEVENLABS_VOICES = [
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...INTERNATIONAL_VOICES
].map(v => ({ ...v, tier: 'pro', icon: '💎', badge: '💎 ElevenLabs Pro' }));

// ==================== 4. GIỌNG ĐỌC MIỄN PHÍ VIỆT NAM (DUY NHẤT HOÀI MY) ====================
export const FREE_VOICES = [
  // Duy nhất Hoài My ở vị trí đầu tiên chuẩn theo yêu cầu
  { 
    id: 'free_vi_female', 
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)', 
    provider: 'system', 
    tier: 'free', 
    icon: '🎤', 
    badge: '🇻🇳 Miễn Phí', 
    gender: 'Female', 
    lang: 'vi-VN', 
    region: 'vi', 
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Chuẩn Tiếng Việt', 
    pitch: 1.08, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, cảm xúc tự nhiên, miễn phí 100%.',
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng ạ!',
    previewUrl: 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=' + encodeURIComponent('Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng ạ!')
  }
];

export const ALL_SYSTEM_VOICES = [...FREE_VOICES, ...ELEVENLABS_VOICES];
export const CURATED_VOICES = ALL_SYSTEM_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  idolVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'idol',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  managerVoice: {
    id: 'vn_nam_quanly_uyquyen',
    name: 'Quốc Cường 💎 (Nam - Quản Lý Giục Chốt Đơn Uy Quyền)',
    provider: 'elevenlabs',
    tier: 'pro',
    gender: 'Male',
    role: 'manager',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0,
    enabled: true
  },
  commentVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'comment',
    pitch: 1.05,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  gameBlvVoice: {
    id: 'vn_nam_blv_bungno',
    name: 'Quang Huy 💎 (Nam - BLV Game PK Bùng Nổ, Siêu Tốc)',
    provider: 'elevenlabs',
    tier: 'pro',
    gender: 'Male',
    role: 'game',
    pitch: 1.0,
    rate: 1.1,
    volume: 1.0,
    enabled: true
  },
  generalVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    role: 'both',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true
  },
  selectedLanguage: 'vi',
  elevenLabsApiKey: '',
  openaiApiKey: '',
  geminiApiKey: ''
};

// ==================== STORAGE & CONFIG HELPERS ====================
export function getSavedVoiceConfig() {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  try {
    const saved = localStorage.getItem('ava_live_voice_config_v2');
    if (saved) {
      return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Lỗi đọc voice config:', e);
  }
  return DEFAULT_VOICE_CONFIG;
}

export function saveVoiceConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ava_live_voice_config_v2', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('ava_voice_config_updated', { detail: config }));
    window.dispatchEvent(new CustomEvent('aidol_voice_sync_updated', { detail: config }));
  } catch (e) {
    console.warn('Lỗi lưu voice config:', e);
  }
}

export function getElevenLabsApiKey() {
  if (typeof window === 'undefined') return '';
  const config = getSavedVoiceConfig();
  if (config.elevenLabsApiKey) return config.elevenLabsApiKey;
  return localStorage.getItem('elevenlabs_api_key') || localStorage.getItem('VITE_ELEVENLABS_API_KEY') || '';
}

// Global active audio & utterance references
let activePreviewAudio = null;
let activeUtterance = null;
let preloadedVoices = [];

// Initialize & keep voices ready in background
if (typeof window !== 'undefined') {
  window._activeVoiceSet = window._activeVoiceSet || new Set();
  
  const refreshVoices = () => {
    if ('speechSynthesis' in window) {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          preloadedVoices = v;
        }
      } catch (e) {}
    }
  };

  if ('speechSynthesis' in window) {
    refreshVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
  }
}

export function stopVoiceAudio() {
  if (activePreviewAudio) {
    try {
      activePreviewAudio.pause();
      activePreviewAudio.currentTime = 0;
    } catch (e) {}
    activePreviewAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && window._activeVoiceSet) {
    window._activeVoiceSet.clear();
  }
  activeUtterance = null;
  isGlobalSpeaking = false;
}

/**
 * 🧹 Bộ lọc làm sạch văn bản thông minh trước khi đưa vào Voice Engine / TTS:
 * - Loại bỏ 100% tất cả các thẻ cử chỉ / chỉ dẫn sân khấu trong ngoặc vuông: [Vỗ tay], [Cười tươi], [Chỉ tay vào giỏ hàng], [Đếm ngược 3 2 1], [user], v.v.
 * - Loại bỏ các ghi chú trong ngoặc đơn: (cười), (cười tươi), (vỗ tay), (nháy mắt), (chỉ giỏ hàng), (hành động...)
 * - Loại bỏ ký tự Markdown, bullet points, số thứ tự đầu dòng
 * - Đảm bảo nhân vật AI CHỈ đọc đúng nội dung câu thoại chính của phiên live!
 */
export function cleanTextForVoiceSpeech(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  
  let cleaned = rawText;

  // 1. Loại bỏ tất cả các chỉ dẫn hành động / ghi chú trong ngoặc vuông
  cleaned = cleaned.replace(/\[[^\]]*\]/g, ' ');

  // 2. Loại bỏ các chỉ dẫn biểu cảm trong ngoặc đơn
  cleaned = cleaned.replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ');

  // 3. Loại bỏ Markdown formatting
  cleaned = cleaned.replace(/[*_#`~>]/g, ' ');
  cleaned = cleaned.replace(/^\s*[-*+]\s+/gm, ''); // bullet points
  cleaned = cleaned.replace(/^\s*\d+[\.\)]\s+/gm, ''); // numbering at start of line: "1. ", "2) "

  // 4. Chuẩn hóa biến đại diện còn sót lại
  cleaned = cleaned
    .replace(/\{user\}/gi, 'bạn')
    .replace(/\{comment\}/gi, 'câu hỏi của bạn')
    .replace(/\{gift_name\}/gi, 'món quà')
    .replace(/\{count\}/gi, 'nhiều')
    .replace(/\{product\}/gi, 'sản phẩm')
    .replace(/\{item\}/gi, 'sản phẩm');

  // 5. Loại bỏ emoji gây ngắt quãng hoặc đọc mã unicode
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');

  // 6. Rút gọn khoảng trắng thừa và dấu chấm lặp
  cleaned = cleaned.replace(/\s+/g, ' ').replace(/\.{2,}/g, '.').trim();

  return cleaned;
}

/**
 * ⚡ CẬP NHẬT TỨC THÌ ÂM LƯỢNG (0% - 100%) VÀ TỐC ĐỘ ĐỌC (0.75x - 1.5x) KHI ĐANG PHÁT (REAL-TIME 0ms LAG)
 * Hỗ trợ cả 2 cách gọi: updateActiveVoiceAudio({ volume, rate }) HOẶC updateActiveVoiceAudio(volume, rate, pitch)
 */
export function updateActiveVoiceAudio(param1, param2, param3) {
  let volume, rate;
  if (typeof param1 === 'object' && param1 !== null) {
    volume = param1.volume;
    rate = param1.rate;
  } else {
    volume = param1;
    rate = param2;
  }

  if (volume !== undefined) {
    const clampedVol = Math.max(0, Math.min(1.0, Number(volume)));
    if (activePreviewAudio) {
      try {
        activePreviewAudio.volume = clampedVol;
        activePreviewAudio.muted = clampedVol === 0;
      } catch (e) {}
    }
    if (activeUtterance) {
      try {
        activeUtterance.volume = clampedVol;
      } catch (e) {}
    }
  }
  if (rate !== undefined) {
    const clampedRate = Math.max(0.5, Math.min(2.0, Number(rate)));
    if (activePreviewAudio) {
      try {
        activePreviewAudio.playbackRate = clampedRate;
      } catch (e) {}
    }
  }
}

// ==================== GLOBAL SPEECH QUEUE & MUTUAL EXCLUSION LOCK ====================
let isGlobalSpeaking = false;
const globalSpeechQueue = [];
let isProcessingGlobalQueue = false;

export function isSpeechActive() {
  return isGlobalSpeaking || globalSpeechQueue.length > 0;
}

export function clearGlobalSpeechQueue() {
  globalSpeechQueue.length = 0;
  isProcessingGlobalQueue = false;
  isGlobalSpeaking = false;
  stopVoiceAudio();
}

/**
 * Tạo âm thanh phản hồi bằng Web Audio API phòng trường hợp trình duyệt không hỗ trợ Web Speech
 */
function playFallbackHarmonicChime(gender = 'Female') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const isFemale = gender === 'Female' || gender === 'Nữ';
    const freqs = isFemale ? [523.25, 659.25, 783.99, 1046.5] : [261.63, 329.63, 392.0, 523.25];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isFemale ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
    });
  } catch (e) {
    console.warn('Fallback harmonic chime error:', e);
  }
}

/**
 * Phát Voice AI Âm Thanh Cho Mọi Mục Đích (Preview, Idol nói, Game BLV, Trợ lý)
 */
export async function previewVoiceAudio(voiceOrId, sampleText = null, optionsOrOnEnd = null, onEndOrPriority = null) {
  if (typeof window === 'undefined') {
    if (typeof optionsOrOnEnd === 'function') optionsOrOnEnd();
    if (typeof onEndOrPriority === 'function') onEndOrPriority();
    return true;
  }

  // Chuẩn hóa voice object từ string ID hoặc role nếu cần
  let voiceObj = voiceOrId;
  if (typeof voiceOrId === 'string') {
    voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === voiceOrId) ||
      (voiceOrId === 'idol' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'idol') :
       voiceOrId === 'manager' || voiceOrId === 'assistant' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'manager' || v.id === 'vn_nam_quanly_uyquyen' || v.id === 'el_adam') :
       voiceOrId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game' || v.id === 'vn_nam_blv_bungno') :
       ALL_SYSTEM_VOICES.find(v => v.id === 'free_vi_female'));
  }
  voiceObj = voiceObj || { id: 'free_vi_female', name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt)', lang: 'vi-VN', provider: 'system', gender: 'Female' };

  // Chuẩn hóa callback onEnd và options
  let onEnd = null;
  let priority = false;
  let isTest = false;
  let customOptions = {};

  if (typeof optionsOrOnEnd === 'function') {
    onEnd = optionsOrOnEnd;
    if (typeof onEndOrPriority === 'boolean') {
      priority = onEndOrPriority;
      isTest = onEndOrPriority;
    } else if (typeof onEndOrPriority === 'object' && onEndOrPriority !== null) {
      priority = !!onEndOrPriority.priority;
      isTest = !!onEndOrPriority.isTest;
    }
  } else if (typeof optionsOrOnEnd === 'boolean') {
    priority = optionsOrOnEnd;
    isTest = optionsOrOnEnd;
    if (typeof onEndOrPriority === 'function') {
      onEnd = onEndOrPriority;
    }
  } else if (typeof optionsOrOnEnd === 'object' && optionsOrOnEnd !== null) {
    customOptions = optionsOrOnEnd;
    onEnd = typeof onEndOrPriority === 'function' ? onEndOrPriority : optionsOrOnEnd.onEnd;
    priority = !!optionsOrOnEnd.priority;
    isTest = !!optionsOrOnEnd.isTest;
  } else if (typeof onEndOrPriority === 'function') {
    onEnd = onEndOrPriority;
  } else if (typeof onEndOrPriority === 'boolean') {
    priority = onEndOrPriority;
    isTest = onEndOrPriority;
  }

  const mergedVoice = {
    ...voiceObj,
    isTest: isTest || priority || voiceObj.isTest,
    priority: priority || voiceObj.priority,
    volume: customOptions.volume !== undefined ? customOptions.volume : (voiceObj.volume !== undefined ? voiceObj.volume : 1.0),
    rate: customOptions.rate !== undefined ? customOptions.rate : (voiceObj.rate !== undefined ? voiceObj.rate : 1.0),
    pitch: customOptions.pitch !== undefined ? customOptions.pitch : (voiceObj.pitch !== undefined ? voiceObj.pitch : 1.0),
    apiKey: customOptions.apiKey || voiceObj.apiKey || getElevenLabsApiKey()
  };

  // Kiểm tra nếu kênh giọng này bị tắt hoặc âm lượng về 0 (trừ khi đang nghe thử isTest)
  if (!mergedVoice.isTest && (mergedVoice?.enabled === false || mergedVoice?.isMuted === true || (mergedVoice?.volume !== undefined && mergedVoice.volume <= 0.001))) {
    if (onEnd) onEnd();
    return true;
  }

  if (priority || isTest || mergedVoice.isTest) {
    clearGlobalSpeechQueue();
    return executeSingleSpeech(mergedVoice, sampleText, onEnd, true);
  }

  return new Promise((resolve) => {
    if (globalSpeechQueue.length > 10) {
      globalSpeechQueue.shift();
    }

    globalSpeechQueue.push({
      voice: mergedVoice,
      sampleText,
      onEnd,
      resolve
    });

    processGlobalSpeechQueue();
  });
}

async function processGlobalSpeechQueue() {
  if (isProcessingGlobalQueue) return;
  isProcessingGlobalQueue = true;

  while (globalSpeechQueue.length > 0) {
    const item = globalSpeechQueue.shift();
    if (!item) continue;

    try {
      isGlobalSpeaking = true;
      await executeSingleSpeech(item.voice, item.sampleText, item.onEnd, false);
      if (item.resolve) item.resolve(true);
    } catch (err) {
      console.warn('[voiceSyncService] Queue execution error:', err);
      if (item.resolve) item.resolve(false);
    } finally {
      isGlobalSpeaking = false;
    }

    await new Promise((r) => setTimeout(r, 600));
  }

  isProcessingGlobalQueue = false;
}

async function executeSingleSpeech(voice, sampleText = null, onEnd = null, isTest = false) {
  stopVoiceAudio();

  const isTestingMode = isTest === true || voice?.isTest === true || voice?.priority === true;

  const isUserPaused = typeof localStorage !== 'undefined' && (
    localStorage.getItem('avalive_user_paused') === 'true' || 
    localStorage.getItem('avalive_window_capture_paused') === 'true'
  );
  if (!isTestingMode && isUserPaused) {
    if (onEnd) onEnd();
    return true;
  }

  const requestedVolume = voice?.volume !== undefined ? Math.max(0, Math.min(1.0, Number(voice.volume))) : 1.0;
  const requestedRate = voice?.rate !== undefined ? Math.max(0.5, Math.min(2.0, Number(voice.rate))) : 1.0;
  
  const savedGlobalVol = typeof localStorage !== 'undefined' && localStorage.getItem('avalive_global_volume') 
    ? parseFloat(localStorage.getItem('avalive_global_volume')) 
    : (typeof localStorage !== 'undefined' && localStorage.getItem('avalive_video_volume') ? parseFloat(localStorage.getItem('avalive_video_volume')) : 1.0);
  const isLocalSpeakerMuted = typeof localStorage !== 'undefined' && (
    localStorage.getItem('avalive_local_speaker_muted') === 'true' ||
    localStorage.getItem('avalive_audio_muted') === 'true'
  );

  const effectiveVoiceVolume = isTestingMode 
    ? requestedVolume 
    : (isLocalSpeakerMuted ? 0 : Math.max(0, Math.min(1.0, requestedVolume * (savedGlobalVol !== null && !isNaN(savedGlobalVol) ? savedGlobalVol : 1.0))));

  const isVietnameseVoice = voice?.lang === 'vi-VN' || voice?.region === 'vi' || voice?.id?.startsWith('vn_') || voice?.id === 'free_vi_female' || voice?.id === 'el_adam';

  const rawLang = voice?.lang || (isVietnameseVoice ? 'vi-VN' : 'en-US');
  const langCode = rawLang || (isVietnameseVoice ? 'vi-VN' : 'en-US');
  const shortLang = langCode.split('-')[0].toLowerCase() || (isVietnameseVoice ? 'vi' : 'en');

  // Chuẩn bị câu thoại chuẩn xác (ưu tiên câu tiếng Việt riêng của giọng nếu là voice Việt Nam)
  let candidateText = sampleText;
  if (!candidateText || !candidateText.trim()) {
    candidateText = voice?.sampleText || (
      isVietnameseVoice 
        ? ((voice?.gender === 'Male' || voice?.gender === 'Nam') 
            ? 'Chào mừng tất cả các bạn đã đến với phiên livestream hôm nay! Hãy cùng tương tác và bùng nổ năng lượng nhé!' 
            : 'Dạ em chào bạn đang theo dõi live nha! Em là Trợ Lý AI của phiên live, chúc bạn xem live thật vui vẻ ạ!')
        : 'Hello everyone! Thank you for joining our livestream today!'
    );
  }

  const textToSpeak = cleanTextForVoiceSpeech(candidateText) || candidateText;
  const apiKey = getElevenLabsApiKey();
  const voiceId = voice?.voiceId || '21m00Tcm4TlvDq8ikWAM';

  // =========================================================================
  // TIER 1: ElevenLabs API (Khi cấu hình ElevenLabs và có API Key hợp lệ)
  // =========================================================================
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
        audio.volume = effectiveVoiceVolume;
        audio.playbackRate = requestedRate;
        audio.muted = effectiveVoiceVolume === 0;
        
        if (!isTestingMode) {
          try { globalLipSyncEngine.connectAudioElement(audio); } catch(e) {}
        }
        
        activePreviewAudio = audio;
        return new Promise((resolve) => {
          let finished = false;
          const finish = () => {
            if (finished) return;
            finished = true;
            activePreviewAudio = null;
            try { URL.revokeObjectURL(audioUrl); } catch {}
            if (onEnd) onEnd();
            resolve(true);
          };
          audio.onended = finish;
          audio.onerror = finish;
          audio.play().catch(finish);
        });
      }
    } catch (e) {
      console.warn('ElevenLabs API direct fetch error, falling back:', e);
    }
  }

  // =========================================================================
  // TIER 2: Instant Client Web Speech API (Ưu tiên phản hồi tức thì 0ms)
  // =========================================================================
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      activeUtterance = utterance;
      
      window._activeVoiceSet = window._activeVoiceSet || new Set();
      window._activeVoiceSet.add(utterance);

      utterance.lang = langCode;

      const isMale = voice?.gender === 'Male' || voice?.gender === 'Nam';
      const isFemale = !isMale;

      utterance.rate = requestedRate;
      utterance.pitch = voice?.pitch !== undefined ? Number(voice.pitch) : (isFemale ? 1.12 : 0.88);
      utterance.volume = effectiveVoiceVolume;

      const availableVoices = (preloadedVoices.length > 0 ? preloadedVoices : window.speechSynthesis.getVoices()) || [];
      if (availableVoices.length > 0) {
        let matched = availableVoices.find(v => {
          const vLang = (v.lang || '').toLowerCase().replace('_', '-');
          const matchesLang = vLang.startsWith(shortLang) || vLang.includes(shortLang);
          const vName = (v.name || '').toLowerCase();
          if (isMale) {
            return matchesLang && (vName.includes('male') || vName.includes('nam') || vName.includes('david') || vName.includes('george') || vName.includes('james') || vName.includes('henri') || vName.includes('hans'));
          } else {
            return matchesLang && (vName.includes('female') || vName.includes('nữ') || vName.includes('linh') || vName.includes('mai') || vName.includes('zira') || vName.includes('samantha') || vName.includes('camille') || vName.includes('elsa'));
          }
        });

        if (!matched) {
          matched = availableVoices.find(v => {
            const vLang = (v.lang || '').toLowerCase().replace('_', '-');
            return vLang.startsWith(shortLang) || vLang.includes(shortLang);
          });
        }

        if (!matched && availableVoices.length > 0) {
          matched = availableVoices[0];
        }

        if (matched) {
          utterance.voice = matched;
        }
      }

      return new Promise((resolve) => {
        let hasEnded = false;
        const finish = (ok) => {
          if (hasEnded) return;
          hasEnded = true;
          if (window._activeVoiceSet) {
            window._activeVoiceSet.delete(utterance);
          }
          activeUtterance = null;
          if (onEnd) onEnd();
          resolve(ok);
        };

        utterance.onend = () => finish(true);
        utterance.onerror = (e) => {
          console.warn('Web Speech synthesis error, trying stream audio:', e);
          finish(false);
        };

        const maxDurationMs = Math.max(4000, textToSpeak.length * 150);
        const watchdog = setTimeout(() => finish(true), maxDurationMs);
        utterance.addEventListener('end', () => clearTimeout(watchdog));

        try {
          window.speechSynthesis.speak(utterance);
        } catch (spkErr) {
          finish(false);
        }
      });
    } catch (synthErr) {
      console.warn('Web Speech API execution catch:', synthErr);
    }
  }

  // =========================================================================
  // TIER 3: Streaming Audio TTS Fallback (100% Tiếng Việt Chuẩn & Đa Ngữ)
  // =========================================================================
  const ttsCandidateUrls = [
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(shortLang || 'vi')}&q=${encodeURIComponent(textToSpeak.slice(0, 200))}`,
    `/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`,
    `http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(textToSpeak)}&lang=${encodeURIComponent(shortLang || 'vi')}`
  ];

  for (const ttsUrl of ttsCandidateUrls) {
    try {
      const streamAudio = new Audio(ttsUrl);
      streamAudio.volume = effectiveVoiceVolume;
      streamAudio.playbackRate = requestedRate;
      streamAudio.muted = effectiveVoiceVolume === 0;
      
      activePreviewAudio = streamAudio;

      const playPromise = new Promise((resolve) => {
        let isDone = false;
        const cleanup = (success) => {
          if (isDone) return;
          isDone = true;
          activePreviewAudio = null;
          if (success && onEnd) onEnd();
          resolve(success);
        };

        streamAudio.onended = () => cleanup(true);
        streamAudio.onerror = () => cleanup(false);
        
        const playAttempt = streamAudio.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(() => cleanup(false));
        }
      });

      const isSuccess = await playPromise;
      if (isSuccess) return true;
    } catch (audioStreamErr) {}
  }

  // =========================================================================
  // TIER 4: Web Audio API Tone Fallback
  // =========================================================================
  playFallbackHarmonicChime(voice?.gender);
  if (onEnd) setTimeout(onEnd, 1200);
  return true;
}

export const speakVoiceAudio = previewVoiceAudio;
export const getDualVoiceConfig = getSavedVoiceConfig;
export const saveDualVoiceConfig = saveVoiceConfig;

export default {
  VIETNAMESE_FEMALE_VOICES,
  VIETNAMESE_MALE_VOICES,
  INTERNATIONAL_VOICES,
  ELEVENLABS_VOICES,
  FREE_VOICES,
  ALL_SYSTEM_VOICES,
  CURATED_VOICES,
  DEFAULT_VOICE_CONFIG,
  getSavedVoiceConfig,
  saveVoiceConfig,
  getDualVoiceConfig,
  saveDualVoiceConfig,
  getElevenLabsApiKey,
  stopVoiceAudio,
  previewVoiceAudio,
  speakVoiceAudio,
  updateActiveVoiceAudio
};
