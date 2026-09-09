/**
 * AVA LIVE - Unified Free Multi-Voice & Distinct Acoustic DSP Architecture
 * 
 * HỆ THỐNG 41 GIỌNG ĐỌC VIỆT NAM CAO CẤP (21 NỮ & 20 NAM) + 28 GIỌNG QUỐC TẾ:
 * - 100% MIỄN PHÍ - Không yêu cầu API Key trả phí để nghe thử và sử dụng.
 * - 100% KHÁC BIỆT HOÀN TOÀN - Mỗi giọng có một bản sắc âm thanh (Acoustic DSP Profile), độ cao (Pitch/Semitone),
 *   tốc độ (Tempo/Rate), cộng hưởng thanh quản (Formant EQ) và động lực âm học (Dynamics Compression) riêng biệt.
 * - Đúng chuẩn Nam / Nữ, đúng tên nhân vật, đúng chủ đề (BTV VTV, MC, Bán Hàng TikTok Shop, TVC, BLV Game PK, ASMR, Kể chuyện, Doanh nhân...).
 * - Tự động đồng bộ hóa khẩu hình Avatar (Lip-Sync Realtime) mượt mà 60 FPS.
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

// ==================== 1. 21 GIỌNG NỮ VIỆT NAM CAO CẤP ====================
export const VIETNAMESE_FEMALE_VOICES = [
  {
    id: 'vn_nu_bientapvien',
    name: 'Mai Phương 🎤 (Nữ - Biên Tập Viên Thời Sự VTV)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Biên Tập Viên & Thời Sự',
    pitch: 1.02,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn biên tập viên truyền hình quốc gia, đĩnh đạc, rõ ràng, uy tín.',
    sampleText: 'Kính chào quý vị và các bạn, bản tin thời sự trực tiếp trên sóng livestream xin được phép bắt đầu.',
    dspProfile: {
      semitones: 0.8,
      rate: 1.0,
      lowGain: 1.0,
      midFreq: 1000,
      midGain: 2.0,
      presenceFreq: 3400,
      presenceGain: 3.5,
      highGain: 2.0,
      compressor: { threshold: -20, ratio: 4, attack: 0.008, release: 0.2 }
    }
  },
  {
    id: 'vn_nu_mctruyenhinh',
    name: 'Thanh Trúc 🎤 (Nữ - MC Truyền Hình Sang Trọng)',
    provider: 'system',
    tier: 'free',
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
    dspProfile: {
      semitones: 2.2,
      rate: 1.02,
      lowGain: -1.0,
      midFreq: 1200,
      midGain: 2.5,
      presenceFreq: 3800,
      presenceGain: 4.5,
      highGain: 3.0,
      compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.25 }
    }
  },
  {
    id: 'vn_nu_kechuyen',
    name: 'Hương Giang 🎤 (Nữ - Kể Chuyện Cảm Xúc & Đọc Sách)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Tâm Sự',
    pitch: 0.96,
    rate: 0.92,
    recommendedFor: 'idol',
    desc: 'Giọng nữ truyền cảm, ấm áp, sâu lắng, thích hợp đọc sách, podcast tâm sự đêm muộn.',
    sampleText: 'Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện tuyệt vời nhé.',
    dspProfile: {
      semitones: -1.2,
      rate: 0.92,
      lowGain: 4.0,
      midFreq: 750,
      midGain: 1.5,
      presenceFreq: 2600,
      presenceGain: 0.5,
      highGain: -1.5,
      compressor: { threshold: -14, ratio: 2.5, attack: 0.03, release: 0.4 }
    }
  },
  {
    id: 'vn_nu_banhang',
    name: 'Ngọc Huyền 🎤 (Nữ - Bán Hàng Chốt Đơn TikTok Shop)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 1.22,
    rate: 1.15,
    recommendedFor: 'manager',
    desc: 'Giọng nữ chốt đơn livestream TikTok Shop tốc độ, năng động, thúc đẩy mua hàng.',
    sampleText: 'Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k trong giỏ hàng, các bạn đặt ngay nhé!',
    dspProfile: {
      semitones: 3.5,
      rate: 1.16,
      lowGain: -2.0,
      midFreq: 1400,
      midGain: 3.0,
      presenceFreq: 3600,
      presenceGain: 6.0,
      highGain: 4.0,
      compressor: { threshold: -24, ratio: 6, attack: 0.003, release: 0.12 }
    }
  },
  {
    id: 'vn_nu_quangcao_tvc',
    name: 'Lan Anh 🎤 (Nữ - Quảng Cáo TVC & Flash Sale)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Quảng Cáo & Giục Đơn',
    pitch: 1.18,
    rate: 1.12,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quảng cáo TVC chuyên nghiệp, cuốn hút, tạo cảm giác cấp bách chốt sale.',
    sampleText: 'Cơ hội săn sale vàng chỉ còn trong ít phút, hãy nhanh tay bấm vào giỏ hàng chốt đơn ngay kẻo lỡ!',
    dspProfile: {
      semitones: 2.8,
      rate: 1.12,
      lowGain: 0.5,
      midFreq: 1100,
      midGain: 2.0,
      presenceFreq: 4000,
      presenceGain: 5.0,
      highGain: 3.5,
      compressor: { threshold: -22, ratio: 5, attack: 0.004, release: 0.15 }
    }
  },
  {
    id: 'vn_nu_video_viral',
    name: 'Thu Trang 🎤 (Nữ - Quay Video Quảng Cáo Viral)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Video Quảng Cáo & Viral',
    pitch: 1.14,
    rate: 1.08,
    recommendedFor: 'both',
    desc: 'Giọng nữ review sản phẩm, video viral triệu view trên mạng xã hội.',
    sampleText: 'Review chân thật cho cả nhà đây! Sản phẩm hôm nay cực kỳ đỉnh, mọi người cùng xem ngay nhé!',
    dspProfile: {
      semitones: 2.0,
      rate: 1.08,
      lowGain: -1.0,
      midFreq: 1300,
      midGain: 2.2,
      presenceFreq: 3300,
      presenceGain: 4.0,
      highGain: 3.0,
      compressor: { threshold: -20, ratio: 4, attack: 0.006, release: 0.18 }
    }
  },
  {
    id: 'vn_nu_truyencamhung',
    name: 'Ánh Dương 🎤 (Nữ - Truyền Cảm Hứng & Động Lực)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'truyencamhung',
    category: 'Truyền Cảm Hứng & Doanh Nhân',
    pitch: 1.06,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ truyền cảm hứng mạnh mẽ, kích thích ý chí vươn lên và năng lượng tích cực.',
    sampleText: 'Mỗi ngày mới là một cơ hội để bạn bứt phá và chạm tới đỉnh cao thành công!',
    dspProfile: {
      semitones: 1.2,
      rate: 0.98,
      lowGain: 2.0,
      midFreq: 950,
      midGain: 2.5,
      presenceFreq: 3100,
      presenceGain: 3.5,
      highGain: 2.0,
      compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.22 }
    }
  },
  {
    id: 'vn_nu_ngotngao',
    name: 'Bảo Ngọc 🎤 (Nữ - Ngọt Ngào, Dễ Thương KOC)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Live & Giao Lưu',
    pitch: 1.28,
    rate: 1.04,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung ngọt ngào, gần gũi, giao lưu trò chuyện thân thiết.',
    sampleText: 'Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim giúp em nhé!',
    dspProfile: {
      semitones: 4.2,
      rate: 1.04,
      lowGain: -3.0,
      midFreq: 1600,
      midGain: 3.2,
      presenceFreq: 4200,
      presenceGain: 6.5,
      highGain: 5.0,
      compressor: { threshold: -20, ratio: 3.8, attack: 0.005, release: 0.16 }
    }
  },
  {
    id: 'vn_nu_ngaytho',
    name: 'Mỹ Uyên 🎤 (Nữ - Ngây Thơ, Trong Trẻo Gen Z)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Live & Giao Lưu',
    pitch: 1.35,
    rate: 1.06,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trong trẻo như pha lê, ngây thơ, đáng yêu chuẩn phong cách idol teen.',
    sampleText: 'A hello mọi người ơi! Hôm nay em live vui lắm nè, cả nhà cùng tương tác với em nha!',
    dspProfile: {
      semitones: 5.4,
      rate: 1.06,
      lowGain: -4.0,
      midFreq: 1800,
      midGain: 3.5,
      presenceFreq: 4500,
      presenceGain: 7.0,
      highGain: 6.0,
      compressor: { threshold: -22, ratio: 4, attack: 0.004, release: 0.15 }
    }
  },
  {
    id: 'vn_nu_thuhut',
    name: 'Diễm My 🎤 (Nữ - Thu Hút, Quyến Rũ Quyền Lực)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Thu Hút & Quyến Rũ',
    pitch: 0.98,
    rate: 0.95,
    recommendedFor: 'idol',
    desc: 'Giọng nữ đằm thắm, quyến rũ, mê hoặc người nghe trong từng câu nói.',
    sampleText: 'Cảm ơn người xem đã ghé thăm phiên livestream, hãy ở lại cùng trò chuyện với em nhé.',
    dspProfile: {
      semitones: -0.8,
      rate: 0.95,
      lowGain: 3.0,
      midFreq: 850,
      midGain: 2.0,
      presenceFreq: 2800,
      presenceGain: 2.5,
      highGain: 1.0,
      compressor: { threshold: -16, ratio: 3.0, attack: 0.02, release: 0.3 }
    }
  },
  {
    id: 'vn_nu_asmr',
    name: 'Hà My 🎤 (Nữ - Thủ Thỉ ASMR Chữa Lành)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Đọc Sách & Chữa Lành',
    pitch: 0.94,
    rate: 0.88,
    recommendedFor: 'idol',
    desc: 'Giọng nữ thì thầm êm dịu, mang lại cảm giác bình yên và thư thái tâm hồn.',
    sampleText: 'Thả lỏng cơ thể, hít thở thật sâu và cảm nhận sự thư thái bình yên trong từng phút giây.',
    dspProfile: {
      semitones: -1.8,
      rate: 0.88,
      lowGain: 4.5,
      midFreq: 650,
      midGain: 1.0,
      presenceFreq: 2200,
      presenceGain: -1.0,
      highGain: -3.0,
      compressor: { threshold: -12, ratio: 2.0, attack: 0.05, release: 0.5 }
    }
  },
  {
    id: 'vn_nu_quyba',
    name: 'Kim Ngân 🎤 (Nữ - Quý Bà Doanh Nhân Đẳng Cấp)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'mature',
    styleCategory: 'doanhnhan',
    category: 'Doanh Nhân & Thương Hiệu',
    pitch: 0.92,
    rate: 0.96,
    recommendedFor: 'manager',
    desc: 'Giọng nữ trung niên uy tín, sang trọng, quyền lực của nữ giám đốc tập đoàn.',
    sampleText: 'Uy tín và chất lượng luôn là kim chỉ nam hàng đầu mà thương hiệu của chúng tôi cam kết tới quý khách hàng.',
    dspProfile: {
      semitones: -2.0,
      rate: 0.96,
      lowGain: 5.0,
      midFreq: 800,
      midGain: 3.0,
      presenceFreq: 2900,
      presenceGain: 2.0,
      highGain: 0.5,
      compressor: { threshold: -18, ratio: 3.8, attack: 0.015, release: 0.28 }
    }
  },
  {
    id: 'vn_nu_chuyengia_yte',
    name: 'Bích Thủy 🎤 (Nữ - Chuyên Gia Y Tế & Sức Khỏe)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Chuyên Gia & Y Tế',
    pitch: 1.04,
    rate: 0.97,
    recommendedFor: 'manager',
    desc: 'Giọng nữ tư vấn y khoa, chăm sóc sức khỏe sắc đẹp đầy tin cậy.',
    sampleText: 'Sức khỏe và vẻ đẹp bền vững bắt đầu từ việc chăm sóc bản thân đúng cách mỗi ngày.',
    dspProfile: {
      semitones: 0.5,
      rate: 0.97,
      lowGain: 2.0,
      midFreq: 1050,
      midGain: 2.2,
      presenceFreq: 3200,
      presenceGain: 3.0,
      highGain: 1.5,
      compressor: { threshold: -17, ratio: 3.2, attack: 0.01, release: 0.2 }
    }
  },
  {
    id: 'vn_nu_blv_game',
    name: 'Yến Nhi 🎤 (Nữ - BLV Thể Thao & PK Sôi Động)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Game & Trận Đấu',
    pitch: 1.25,
    rate: 1.18,
    recommendedFor: 'game',
    desc: 'Giọng nữ bình luận viên thể thao, PK game kịch tính, bốc lửa.',
    sampleText: 'Trận đấu đang bước vào những phút combat nghẹt thở nhất, hãy cùng cổ vũ hết mình nào!',
    dspProfile: {
      semitones: 3.8,
      rate: 1.18,
      lowGain: -1.0,
      midFreq: 1500,
      midGain: 3.5,
      presenceFreq: 3700,
      presenceGain: 6.5,
      highGain: 4.5,
      compressor: { threshold: -26, ratio: 7, attack: 0.002, release: 0.1 }
    }
  },
  {
    id: 'vn_nu_hoatnao',
    name: 'Khánh Linh 🎤 (Nữ - Hoạt Náo Viên Minigame)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Sự Kiện & Minigame',
    pitch: 1.20,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng nữ hoạt náo, dẫn dắt các trò chơi minigame tặng quà sôi nổi.',
    sampleText: 'Minigame nhận quà may mắn bắt đầu, mọi người nhanh tay comment đáp án chính xác nào!',
    dspProfile: {
      semitones: 3.0,
      rate: 1.10,
      lowGain: -1.5,
      midFreq: 1350,
      midGain: 2.8,
      presenceFreq: 3900,
      presenceGain: 5.0,
      highGain: 4.0,
      compressor: { threshold: -21, ratio: 4.5, attack: 0.005, release: 0.15 }
    }
  },
  {
    id: 'vn_nu_troly_ai',
    name: 'Minh Thư 🎤 (Nữ - Trợ Lý AI Thông Minh CSKH)',
    provider: 'system',
    tier: 'free',
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
    dspProfile: {
      semitones: 1.8,
      rate: 1.0,
      lowGain: 0.0,
      midFreq: 1150,
      midGain: 2.0,
      presenceFreq: 3400,
      presenceGain: 3.5,
      highGain: 2.5,
      compressor: { threshold: -18, ratio: 3.5, attack: 0.008, release: 0.2 }
    }
  },
  {
    id: 'vn_nu_thoca',
    name: 'Thùy Chi 🎤 (Nữ - Giọng Đọc Thơ Ca Lãng Mạn)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Đọc Thơ',
    pitch: 1.08,
    rate: 0.90,
    recommendedFor: 'idol',
    desc: 'Giọng nữ giàu chất thơ, lãng mạn, ngân vang cảm xúc nghệ thuật.',
    sampleText: 'Gió đưa cành trúc la đà, tiếng chuông Trấn Vũ canh gà Thọ Xương.',
    dspProfile: {
      semitones: 1.0,
      rate: 0.90,
      lowGain: 2.5,
      midFreq: 900,
      midGain: 2.0,
      presenceFreq: 3000,
      presenceGain: 3.0,
      highGain: 2.5,
      compressor: { threshold: -15, ratio: 2.8, attack: 0.02, release: 0.35 }
    }
  },
  {
    id: 'vn_nu_phongsu_vtv',
    name: 'Tuyết Mai 🎤 (Nữ - Phóng Sự Tài Liệu VTV)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Biên Tập Viên & Phóng Sự',
    pitch: 0.98,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nữ thuyết minh phóng sự tài liệu chuyên sâu, sâu sắc và thuyết phục.',
    sampleText: 'Hành trình khám phá văn hóa và con người Việt Nam luôn mang đến những giá trị sâu sắc.',
    dspProfile: {
      semitones: -0.5,
      rate: 1.0,
      lowGain: 3.0,
      midFreq: 900,
      midGain: 2.5,
      presenceFreq: 3100,
      presenceGain: 3.0,
      highGain: 1.0,
      compressor: { threshold: -19, ratio: 4, attack: 0.01, release: 0.22 }
    }
  },
  {
    id: 'vn_nu_giucdon_tocbien',
    name: 'Cẩm Tú 🎤 (Nữ - Giục Đơn Tốc Biến Hàng Khủng)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 1.26,
    rate: 1.22,
    recommendedFor: 'manager',
    desc: 'Giọng nữ giục đơn dồn dập, tạo hiệu ứng đám đông mua sắm cuồng nhiệt.',
    sampleText: 'Chỉ còn đúng 5 suất quà tặng độc quyền, các bác bấm mua ngay góc trái màn hình nhé!',
    dspProfile: {
      semitones: 4.0,
      rate: 1.22,
      lowGain: -2.5,
      midFreq: 1450,
      midGain: 3.2,
      presenceFreq: 3800,
      presenceGain: 6.2,
      highGain: 4.2,
      compressor: { threshold: -25, ratio: 6.5, attack: 0.002, release: 0.1 }
    }
  },
  {
    id: 'vn_nu_vtuber_nhinhanh',
    name: 'Nhật Hạ 🎤 (Nữ - Anime / VTuber Nhí Nhảnh)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Anime & VTuber',
    pitch: 1.45,
    rate: 1.10,
    recommendedFor: 'idol',
    desc: 'Giọng nữ phong cách VTuber dễ thương, bắt trend giới trẻ.',
    sampleText: 'Cảm ơn các bạn đã ghé xem live! Nhớ bấm theo dõi kênh để không bỏ lỡ buổi live tiếp theo nha!',
    dspProfile: {
      semitones: 6.5,
      rate: 1.10,
      lowGain: -5.0,
      midFreq: 2000,
      midGain: 4.0,
      presenceFreq: 4800,
      presenceGain: 8.0,
      highGain: 7.0,
      compressor: { threshold: -23, ratio: 4.2, attack: 0.003, release: 0.14 }
    }
  },
  {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
    provider: 'system',
    tier: 'free',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Chuẩn Tiếng Việt',
    pitch: 1.05,
    rate: 1.0,
    recommendedFor: 'idol',
    desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, cảm xúc tự nhiên, miễn phí 100%.',
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng ạ!',
    dspProfile: {
      semitones: 1.0,
      rate: 1.0,
      lowGain: 0.5,
      midFreq: 1100,
      midGain: 2.0,
      presenceFreq: 3300,
      presenceGain: 3.5,
      highGain: 2.5,
      compressor: { threshold: -18, ratio: 3.5, attack: 0.008, release: 0.2 }
    }
  }
];

// ==================== 2. 20 GIỌNG NAM VIỆT NAM CAO CẤP ====================
export const VIETNAMESE_MALE_VOICES = [
  {
    id: 'el_adam',
    name: 'Adam 🎤 (Nam - Giọng Quốc Dân, Bán Hàng & Thuyết Trình)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Thương Mại & Bán Hàng',
    pitch: 0.88,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nam biểu tượng quốc dân, ấm áp, điềm đạm, cực kỳ thuyết phục.',
    sampleText: 'Chào mừng tất cả các bạn đã đến với buổi phát sóng hôm nay! Chúc mọi người một ngày tràn đầy năng lượng và thành công!',
    dspProfile: {
      semitones: -2.5,
      rate: 1.0,
      lowGain: 6.0,
      midFreq: 600,
      midGain: 2.0,
      presenceFreq: 2400,
      presenceGain: 2.0,
      highGain: 0.0,
      compressor: { threshold: -18, ratio: 4, attack: 0.01, release: 0.25 }
    }
  },
  {
    id: 'vn_nam_blv_bungno',
    name: 'Quang Huy 🎤 (Nam - BLV Game PK Bùng Nổ, Siêu Tốc)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Game Sôi Động',
    pitch: 0.95,
    rate: 1.22,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên game PK bùng nổ, tốc độ cực nhanh khi combat nghẹt thở.',
    sampleText: 'Pha combat đỉnh cao! Cả hai đội đang tung toàn bộ chiêu thức, hãy cùng bùng nổ năng lượng nào anh em ơi!',
    dspProfile: {
      semitones: -0.5,
      rate: 1.24,
      lowGain: 3.5,
      midFreq: 900,
      midGain: 3.5,
      presenceFreq: 3100,
      presenceGain: 6.5,
      highGain: 3.5,
      compressor: { threshold: -26, ratio: 8, attack: 0.002, release: 0.08 }
    }
  },
  {
    id: 'vn_nam_mc_haosang',
    name: 'Minh Quân 🎤 (Nam - MC Sự Kiện Truyền Hình Hào Sảng)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'MC Sự Kiện & Hội Trường',
    pitch: 0.92,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng MC dẫn chương trình truyền hình cuốn hút, hoạt náo, tràn đầy năng lượng.',
    sampleText: 'Xin nhiệt liệt chào mừng toàn thể quý vị đại biểu và quý khán giả đã có mặt tại sự kiện trực tiếp hôm nay!',
    dspProfile: {
      semitones: -1.8,
      rate: 1.05,
      lowGain: 4.5,
      midFreq: 700,
      midGain: 2.5,
      presenceFreq: 2700,
      presenceGain: 3.8,
      highGain: 1.5,
      compressor: { threshold: -20, ratio: 4.5, attack: 0.006, release: 0.2 }
    }
  },
  {
    id: 'vn_nam_phongsu_vtv',
    name: 'Đức Thắng 🎤 (Nam - Phóng Sự Tài Liệu VTV Đĩnh Đạc)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Phóng Sự & Truyền Hình',
    pitch: 0.82,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nam chuẩn phóng sự tài liệu, chín chắn, sâu sắc và đáng tin cậy.',
    sampleText: 'Góc nhìn chân thực, thông tin đa chiều và những câu chuyện lay động hàng triệu trái tim người xem.',
    dspProfile: {
      semitones: -3.8,
      rate: 0.98,
      lowGain: 7.0,
      midFreq: 500,
      midGain: 2.8,
      presenceFreq: 2200,
      presenceGain: 1.5,
      highGain: -0.5,
      compressor: { threshold: -18, ratio: 4, attack: 0.012, release: 0.28 }
    }
  },
  {
    id: 'vn_nam_chotsale',
    name: 'Thành Nam 🎤 (Nam - Bán Hàng Chốt Sale Thần Tốc)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng & Chốt Đơn',
    pitch: 0.94,
    rate: 1.15,
    recommendedFor: 'manager',
    desc: 'Giọng nam bán hàng chốt đơn livestream dứt khoát, thuyết phục khách mua ngay.',
    sampleText: 'Cơ hội duy nhất trong ngày hôm nay! Giá sốc tận đáy kèm quà tặng khủng, anh em chốt đơn ngay kẻo hết!',
    dspProfile: {
      semitones: -1.0,
      rate: 1.16,
      lowGain: 2.5,
      midFreq: 1000,
      midGain: 3.0,
      presenceFreq: 3200,
      presenceGain: 5.5,
      highGain: 2.5,
      compressor: { threshold: -24, ratio: 6, attack: 0.003, release: 0.12 }
    }
  },
  {
    id: 'vn_nam_thuyetminh_dienanh',
    name: 'Hoàng Bách 🎤 (Nam - Thuyết Minh Phim Điện Ảnh Bom Tấn)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Thuyết Minh Điện Ảnh',
    pitch: 0.76,
    rate: 0.90,
    recommendedFor: 'idol',
    desc: 'Giọng thuyết minh phim điện ảnh Hollywood đầy kịch tính, hùng tráng.',
    sampleText: 'Một cuộc chiến định mệnh đã bắt đầu, thay đổi toàn bộ vận mệnh của cả vũ trụ!',
    dspProfile: {
      semitones: -5.2,
      rate: 0.90,
      lowGain: 9.0,
      midFreq: 450,
      midGain: 3.5,
      presenceFreq: 2000,
      presenceGain: 2.0,
      highGain: -1.0,
      compressor: { threshold: -22, ratio: 5, attack: 0.015, release: 0.35 }
    }
  },
  {
    id: 'vn_nam_kechuyen_tramam',
    name: 'Hữu Phước 🎤 (Nam - Kể Chuyện Đêm Khuya Trầm Ấm)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Tâm Sự',
    pitch: 0.80,
    rate: 0.90,
    recommendedFor: 'idol',
    desc: 'Giọng nam trầm ấm, truyền cảm, thích hợp đọc truyện đêm khuya, podcast lắng đọng.',
    sampleText: 'Đêm tĩnh lặng, những kỷ niệm xưa lại ùa về, mang theo bao nỗi niềm chất chứa.',
    dspProfile: {
      semitones: -4.2,
      rate: 0.90,
      lowGain: 7.5,
      midFreq: 550,
      midGain: 2.0,
      presenceFreq: 2100,
      presenceGain: 0.5,
      highGain: -2.0,
      compressor: { threshold: -14, ratio: 2.8, attack: 0.03, release: 0.45 }
    }
  },
  {
    id: 'vn_nam_quanly_uyquyen',
    name: 'Quốc Cường 🎤 (Nam - Quản Lý Giục Chốt Đơn Uy Quyền)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Giục Đơn & Cảnh Báo',
    pitch: 0.86,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng quản lý bán hàng uy quyền, thúc giục khán giả đặt hàng ngay.',
    sampleText: 'Bộ phận kho thông báo số lượng chỉ còn dưới 10 sản phẩm, quý khách nhanh tay hoàn tất đơn hàng!',
    dspProfile: {
      semitones: -2.8,
      rate: 1.08,
      lowGain: 5.5,
      midFreq: 750,
      midGain: 3.0,
      presenceFreq: 2800,
      presenceGain: 4.5,
      highGain: 1.0,
      compressor: { threshold: -22, ratio: 5.5, attack: 0.005, release: 0.16 }
    }
  },
  {
    id: 'vn_nam_doanhnhan',
    name: 'Việt Hưng 🎤 (Nam - Doanh Nhân Giám Đốc Uy Quyền)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Doanh Nhân & Giám Đốc',
    pitch: 0.80,
    rate: 0.96,
    recommendedFor: 'manager',
    desc: 'Giọng giám đốc điều hành, doanh nhân thành đạt, đĩnh đạc và quyết đoán.',
    sampleText: 'Chiến lược đúng đắn và sự quyết đoán chính là chìa khóa mở ra cánh cửa thành công vượt bậc.',
    dspProfile: {
      semitones: -4.5,
      rate: 0.96,
      lowGain: 8.0,
      midFreq: 500,
      midGain: 3.2,
      presenceFreq: 2300,
      presenceGain: 2.2,
      highGain: 0.0,
      compressor: { threshold: -19, ratio: 4.2, attack: 0.01, release: 0.3 }
    }
  },
  {
    id: 'vn_nam_quyong_lichlam',
    name: 'Tuấn Kiệt 🎤 (Nam - Quý Ông Lịch Lãm Sang Trọng)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Sang Trọng & Thương Hiệu',
    pitch: 0.86,
    rate: 0.96,
    recommendedFor: 'idol',
    desc: 'Giọng nam quý phái, thanh lịch, phù hợp các sản phẩm cao cấp xa xỉ.',
    sampleText: 'Sự sang trọng tinh tế không nằm ở vẻ hào nhoáng, mà toát ra từ đẳng cấp đích thực.',
    dspProfile: {
      semitones: -3.0,
      rate: 0.96,
      lowGain: 6.0,
      midFreq: 650,
      midGain: 2.2,
      presenceFreq: 2600,
      presenceGain: 2.8,
      highGain: 1.5,
      compressor: { threshold: -17, ratio: 3.5, attack: 0.012, release: 0.25 }
    }
  },
  {
    id: 'vn_nam_chienbinh',
    name: 'Duy Long 🎤 (Nam - Chiến Binh Hùng Tráng Hào Hùng)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'blv_game',
    category: 'Chiến Trận & Hào Hùng',
    pitch: 0.74,
    rate: 1.02,
    recommendedFor: 'game',
    desc: 'Giọng nam tướng quân uy nghi, hào sảng, vang dội như tiếng sấm.',
    sampleText: 'Vì màu cờ sắc áo, toàn quân ta quyết chí xung trận, giành lấy vinh quang vang dội!',
    dspProfile: {
      semitones: -5.5,
      rate: 1.02,
      lowGain: 9.5,
      midFreq: 480,
      midGain: 4.0,
      presenceFreq: 2500,
      presenceGain: 5.0,
      highGain: 0.5,
      compressor: { threshold: -25, ratio: 7, attack: 0.003, release: 0.15 }
    }
  },
  {
    id: 'vn_nam_thaygiao',
    name: 'Gia Bảo 🎤 (Nam - Thầy Giáo Giảng Bài Khoa Học)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'truyencamhung',
    category: 'Giảng Dạy & Tri Thức',
    pitch: 0.90,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng giảng viên rõ ràng, mạch lạc, truyền tải kiến thức dễ hiểu.',
    sampleText: 'Chào các bạn, hôm nay chúng ta sẽ cùng nhau tìm hiểu về những nguyên lý khoa học vô cùng thú vị.',
    dspProfile: {
      semitones: -2.0,
      rate: 0.98,
      lowGain: 4.0,
      midFreq: 750,
      midGain: 2.0,
      presenceFreq: 2800,
      presenceGain: 3.0,
      highGain: 1.0,
      compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.22 }
    }
  },
  {
    id: 'vn_nam_streamer_genz',
    name: 'Khánh Hoàng 🎤 (Nam - Streamer Gen Z Dí Dỏm)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Streamer & Gen Z',
    pitch: 1.02,
    rate: 1.14,
    recommendedFor: 'idol',
    desc: 'Giọng nam trẻ phong cách streamer TikTok, dí dỏm, hài hước và gần gũi.',
    sampleText: 'Anh em thấy thế nào? Quá đỉnh chóp luôn đúng không? Nhớ thả tim và chia sẻ live cho mình nhé!',
    dspProfile: {
      semitones: 0.8,
      rate: 1.14,
      lowGain: 0.5,
      midFreq: 1100,
      midGain: 2.5,
      presenceFreq: 3300,
      presenceGain: 4.8,
      highGain: 3.0,
      compressor: { threshold: -22, ratio: 5, attack: 0.004, release: 0.14 }
    }
  },
  {
    id: 'vn_nam_blv_thethao',
    name: 'Bảo Long 🎤 (Nam - BLV Thể Thao Đỉnh Cao)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Thể Thao',
    pitch: 0.96,
    rate: 1.20,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên bóng đá/eSports hừng hực lửa, truyền lửa người xem.',
    sampleText: 'Vào! Một siêu phẩm không thể cản phá! Khán đài đang vỡ òa trong niềm vui sướng tột cùng!',
    dspProfile: {
      semitones: -0.2,
      rate: 1.22,
      lowGain: 3.0,
      midFreq: 950,
      midGain: 3.2,
      presenceFreq: 3000,
      presenceGain: 6.0,
      highGain: 3.0,
      compressor: { threshold: -25, ratio: 7.5, attack: 0.002, release: 0.09 }
    }
  },
  {
    id: 'vn_nam_tuvan_khachhang',
    name: 'Trọng Nhân 🎤 (Nam - Chuyên Viên Tư Vấn Tận Tụy)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Tư Vấn Khách Hàng',
    pitch: 0.92,
    rate: 1.0,
    recommendedFor: 'manager',
    desc: 'Giọng nam tư vấn nhẹ nhàng, nhiệt tình hỗ trợ giải đáp mọi thắc mắc.',
    sampleText: 'Dạ em chào anh chị ạ! Em rất hân hạnh được hỗ trợ giải đáp mọi thắc mắc của mình hôm nay ạ!',
    dspProfile: {
      semitones: -1.5,
      rate: 1.0,
      lowGain: 3.5,
      midFreq: 800,
      midGain: 2.0,
      presenceFreq: 2600,
      presenceGain: 2.5,
      highGain: 1.0,
      compressor: { threshold: -17, ratio: 3.2, attack: 0.01, release: 0.2 }
    }
  },
  {
    id: 'vn_nam_video_viral',
    name: 'Hải Đăng 🎤 (Nam - Video Viral & TikTok Review)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Video Quảng Cáo & Viral',
    pitch: 0.98,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng nam review công nghệ, sản phẩm hot trend thu hút triệu view.',
    sampleText: 'Review cực kỳ chi tiết cho anh em! Món này thực sự đáng đồng tiền bát gạo, trải nghiệm quá đã!',
    dspProfile: {
      semitones: 0.0,
      rate: 1.10,
      lowGain: 1.5,
      midFreq: 1050,
      midGain: 2.4,
      presenceFreq: 3100,
      presenceGain: 4.2,
      highGain: 2.5,
      compressor: { threshold: -21, ratio: 4.5, attack: 0.005, release: 0.15 }
    }
  },
  {
    id: 'vn_nam_truyencamhung',
    name: 'Công Danh 🎤 (Nam - Truyền Cảm Hứng Làm Giàu)',
    provider: 'system',
    tier: 'free',
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
    dspProfile: {
      semitones: -2.6,
      rate: 1.0,
      lowGain: 5.5,
      midFreq: 700,
      midGain: 2.8,
      presenceFreq: 2600,
      presenceGain: 3.2,
      highGain: 1.0,
      compressor: { threshold: -19, ratio: 4.0, attack: 0.008, release: 0.24 }
    }
  },
  {
    id: 'vn_nam_bantin_quocte',
    name: 'Đình Vũ 🎤 (Nam - Bản Tin Thời Sự Quốc Tế)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Bản Tin & Thời Sự',
    pitch: 0.84,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng đọc bản tin nhịp nhàng, thông tin rõ ràng, chuẩn phong cách quốc tế.',
    sampleText: 'Cập nhật diễn biến thị trường và những sự kiện nổi bật nhất trên toàn thế giới trong 24 giờ qua.',
    dspProfile: {
      semitones: -3.2,
      rate: 1.02,
      lowGain: 6.0,
      midFreq: 620,
      midGain: 2.5,
      presenceFreq: 2500,
      presenceGain: 2.8,
      highGain: 0.5,
      compressor: { threshold: -20, ratio: 4.2, attack: 0.008, release: 0.22 }
    }
  },
  {
    id: 'vn_nam_caotuoi_tritue',
    name: 'Thái Sơn 🎤 (Nam - Cao Tuổi Thông Thái Trí Tuệ)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'mature',
    styleCategory: 'doanhnhan',
    category: 'Cao Tuổi & Tri Thức',
    pitch: 0.70,
    rate: 0.84,
    recommendedFor: 'both',
    desc: 'Giọng nam cao tuổi từng trải, đưa ra những lời khuyên sâu sắc và thấu đáo.',
    sampleText: 'Đời người như dòng sông chảy mãi, biết bao trải nghiệm mới gom tụ thành vốn sống quý giá.',
    dspProfile: {
      semitones: -6.8,
      rate: 0.84,
      lowGain: 10.0,
      midFreq: 400,
      midGain: 4.0,
      presenceFreq: 1800,
      presenceGain: 0.5,
      highGain: -3.0,
      compressor: { threshold: -15, ratio: 3.0, attack: 0.04, release: 0.5 }
    }
  },
  {
    id: 'vn_nam_minigame_bungchay',
    name: 'Văn Hậu 🎤 (Nam - MC Minigame Bùng Cháy)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Sự Kiện & Minigame',
    pitch: 1.04,
    rate: 1.15,
    recommendedFor: 'game',
    desc: 'Giọng nam hoạt náo viên khuấy động không khí minigame quà tặng livestream.',
    sampleText: 'Đếm ngược 3 2 1 để nhận phần quà may mắn cực lớn từ phòng live của chúng ta nào!',
    dspProfile: {
      semitones: 1.5,
      rate: 1.16,
      lowGain: 1.0,
      midFreq: 1100,
      midGain: 2.8,
      presenceFreq: 3200,
      presenceGain: 5.0,
      highGain: 3.0,
      compressor: { threshold: -23, ratio: 5.5, attack: 0.003, release: 0.12 }
    }
  }
];

// ==================== 3. 28 GIỌNG QUỐC TẾ PRO ĐA QUỐC GIA ====================
export const INTERNATIONAL_VOICES = [
  // Bắc Mỹ & Anh Quốc 🇺🇸 🇬🇧 🇨🇦 🇦🇺
  { 
    id: 'el_us_female', 
    name: 'Sarah 🇺🇸 (Nữ - US English Native)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ bản xứ Mỹ truyền cảm chuẩn quốc tế.',
    sampleText: 'Hello everyone! Welcome to our special interactive livestream today!',
    dspProfile: { semitones: 2.0, rate: 1.0, lowGain: 0, midFreq: 1200, midGain: 2, presenceFreq: 3500, presenceGain: 4, highGain: 3 }
  },
  { 
    id: 'el_us_male', 
    name: 'David 🇺🇸 (Nam - US English Streamer)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.92, 
    rate: 1.05, 
    recommendedFor: 'game', 
    desc: 'Giọng nam tiếng Anh phong cách streamer năng động Mỹ.',
    sampleText: 'What is up guys! Get ready for an epic interactive battle today!',
    dspProfile: { semitones: -1.5, rate: 1.08, lowGain: 4, midFreq: 800, midGain: 2.5, presenceFreq: 3000, presenceGain: 4.5, highGain: 2 }
  },
  { 
    id: 'el_uk_female', 
    name: 'Victoria 🇬🇧 (Nữ - UK British Royal)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 1.06, 
    rate: 0.98, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý tộc Anh Quốc sang trọng, chuẩn mực.',
    sampleText: 'Good evening ladies and gentlemen. It is a pleasure to have you here with us.',
    dspProfile: { semitones: 1.5, rate: 0.98, lowGain: 1, midFreq: 1100, midGain: 2, presenceFreq: 3400, presenceGain: 3.5, highGain: 2.5 }
  },
  { 
    id: 'el_uk_male', 
    name: 'Arthur 🇬🇧 (Nam - UK British Gentleman)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.82, 
    rate: 0.98, 
    recommendedFor: 'game', 
    desc: 'Giọng nam quý ông Anh Quốc lịch lãm, đẳng cấp.',
    sampleText: 'Welcome to the broadcast. Prepare yourselves for an extraordinary journey.',
    dspProfile: { semitones: -3.5, rate: 0.98, lowGain: 6, midFreq: 600, midGain: 2.5, presenceFreq: 2400, presenceGain: 2.5, highGain: 0.5 }
  },
  { 
    id: 'el_ca_male', 
    name: 'Liam 🇨🇦 (Nam - Canada English Friendly)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'en-CA', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.94, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Canada thân thiện, giao lưu cởi mở.',
    sampleText: 'Hey everyone, so glad you could drop by our stream today! Have fun!',
    dspProfile: { semitones: -1.0, rate: 1.02, lowGain: 3, midFreq: 850, midGain: 2, presenceFreq: 2800, presenceGain: 3.5, highGain: 1.5 }
  },
  { 
    id: 'el_au_male', 
    name: 'Oliver 🇦🇺 (Nam - Australian English)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'en-AU', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.90, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam bản xứ Úc tự nhiên, phóng khoáng.',
    sampleText: 'G day mate! Welcome to the show, let us get this party started right now!',
    dspProfile: { semitones: -2.0, rate: 1.05, lowGain: 4, midFreq: 800, midGain: 2.5, presenceFreq: 2900, presenceGain: 4, highGain: 2 }
  },

  // Châu Âu 🇫🇷 🇮🇹 🇩🇪 🇪🇸 🇷🇺
  { 
    id: 'el_fr_female', 
    name: 'Camille 🇫🇷 (Nữ - Français Paris Chic)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ quý phái phong cách Paris lãng mạn.',
    sampleText: 'Bonjour à tous et bienvenue sur notre diffusion en direct !',
    dspProfile: { semitones: 2.4, rate: 1.0, lowGain: 0, midFreq: 1300, midGain: 2.5, presenceFreq: 3700, presenceGain: 4.5, highGain: 3.5 }
  },
  { 
    id: 'el_fr_male', 
    name: 'Henri 🇫🇷 (Nam - Français Élégant)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.86, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Pháp trầm ấm, lịch thiệp.',
    sampleText: 'Bienvenue à tous mes chers amis, c est un plaisir de vous accueillir.',
    dspProfile: { semitones: -2.8, rate: 0.98, lowGain: 5, midFreq: 650, midGain: 2, presenceFreq: 2500, presenceGain: 2.5, highGain: 1 }
  },
  { 
    id: 'el_it_female', 
    name: 'Elsa 🇮🇹 (Nữ - Italiano Dolce)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.16, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Ý du dương, ngọt ngào và cuốn hút.',
    sampleText: 'Ciao a tutti e benvenuti nella nostra meravigliosa diretta live!',
    dspProfile: { semitones: 3.0, rate: 1.02, lowGain: -1, midFreq: 1400, midGain: 3, presenceFreq: 3900, presenceGain: 5, highGain: 4 }
  },
  { 
    id: 'el_it_male', 
    name: 'Marco 🇮🇹 (Nam - Italiano Passione)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.88, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Ý nồng nhiệt, giàu cảm xúc.',
    sampleText: 'Buonasera a tutti quanti, iniziamo questa grande avventura insieme!',
    dspProfile: { semitones: -2.2, rate: 1.04, lowGain: 4.5, midFreq: 750, midGain: 2.5, presenceFreq: 2800, presenceGain: 3.8, highGain: 1.5 }
  },
  { 
    id: 'el_de_female', 
    name: 'Katja 🇩🇪 (Nữ - Deutsch Präzise)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.04, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đức chính xác, chuẩn mực.',
    sampleText: 'Hallo zusammen! Herzlich willkommen zu unserem offiziellen Livestream!',
    dspProfile: { semitones: 1.0, rate: 1.0, lowGain: 1, midFreq: 1100, midGain: 2, presenceFreq: 3300, presenceGain: 3.5, highGain: 2 }
  },
  { 
    id: 'el_de_male', 
    name: 'Hans 🇩🇪 (Nam - Deutsch Kraftvoll)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.76, 
    rate: 0.98, 
    recommendedFor: 'manager', 
    desc: 'Giọng nam Đức dõng dạc, uy lực và đĩnh đạc.',
    sampleText: 'Guten Tag meine Damen und Herren, wir starten jetzt die Übertragung!',
    dspProfile: { semitones: -5.0, rate: 0.98, lowGain: 8, midFreq: 450, midGain: 3.5, presenceFreq: 2200, presenceGain: 2, highGain: 0 }
  },
  { 
    id: 'el_es_female', 
    name: 'Lucia 🇪🇸 (Nữ - Español Madrid)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'es-ES', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.18, 
    rate: 1.06, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Tây Ban Nha rực rỡ, tràn đầy sức sống.',
    sampleText: '¡Hola a todos! ¡Bienvenidos a nuestra emocionante transmisión en vivo!',
    dspProfile: { semitones: 3.2, rate: 1.06, lowGain: -1.5, midFreq: 1500, midGain: 3, presenceFreq: 4000, presenceGain: 5.5, highGain: 4.5 }
  },
  { 
    id: 'el_ru_female', 
    name: 'Tatiana 🇷🇺 (Nữ - Русский)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'ru-RU', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 1.04, 
    rate: 0.96, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nga sâu lắng, truyền cảm.',
    sampleText: 'Всем привет! Добро пожаловать на наш прямой эфир!',
    dspProfile: { semitones: 0.8, rate: 0.96, lowGain: 2, midFreq: 950, midGain: 2.2, presenceFreq: 3000, presenceGain: 3, highGain: 1.5 }
  },

  // Nam Mỹ & Mỹ Latin 🇲🇽 🇧🇷
  { 
    id: 'el_mx_male', 
    name: 'Diego 🇲🇽 (Nam - Español México)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'es-MX', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 0.90, 
    rate: 1.08, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Mexico Latin sôi động, nhiệt huyết.',
    sampleText: '¡Qué onda amigos! ¡Bienvenidos al show más prendido de la noche!',
    dspProfile: { semitones: -1.8, rate: 1.08, lowGain: 4, midFreq: 850, midGain: 2.8, presenceFreq: 2900, presenceGain: 4.5, highGain: 2 }
  },
  { 
    id: 'el_br_female', 
    name: 'Francisca 🇧🇷 (Nữ - Português Brasil)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'pt-BR', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 1.18, 
    rate: 1.04, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Brazil mượt mà, gợi cảm.',
    sampleText: 'Olá a todos! Sejam muito bem-vindos à nossa transmissão ao vivo!',
    dspProfile: { semitones: 3.2, rate: 1.04, lowGain: -1, midFreq: 1400, midGain: 3, presenceFreq: 3800, presenceGain: 5, highGain: 4 }
  },

  // Châu Á 🇨🇳 🇹🇼 🇯🇵 🇰🇷 🇹🇭 🇮🇩 🇵🇭 🇮🇳 🇸🇦
  { 
    id: 'el_cn_female', 
    name: 'Mei-Ling 🇨🇳 (Nữ - 中文普通话 带货主播)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.20, 
    rate: 1.10, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ livestream bán hàng thương mại điện tử Trung Quốc.',
    sampleText: '各位直播间的朋友们大家好！欢迎来到我们的互动直播间！',
    dspProfile: { semitones: 3.6, rate: 1.10, lowGain: -2, midFreq: 1500, midGain: 3.2, presenceFreq: 4000, presenceGain: 6, highGain: 4.5 }
  },
  { 
    id: 'el_cn_male', 
    name: 'Zhang-Wei 🇨🇳 (Nam - 中文普通话 Caster)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.86, 
    rate: 1.08, 
    recommendedFor: 'game', 
    desc: 'Giọng nam bình luận viên võ thuật Trung Hoa.',
    sampleText: '直播间的家人们大家晚上好！精彩对决马上开始！',
    dspProfile: { semitones: -2.8, rate: 1.08, lowGain: 5.5, midFreq: 700, midGain: 3, presenceFreq: 2800, presenceGain: 4.5, highGain: 1.5 }
  },
  { 
    id: 'el_tw_female', 
    name: 'Ting-Ting 🇹🇼 (Nữ - 臺灣國語 甜美)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'zh-TW', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.24, 
    rate: 1.02, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Đài Loan ngọt ngào, nhẹ nhàng.',
    sampleText: '哈囉大家好！歡迎來到今天的直播，記得幫我點個愛心喔！',
    dspProfile: { semitones: 4.0, rate: 1.02, lowGain: -2.5, midFreq: 1600, midGain: 3.5, presenceFreq: 4200, presenceGain: 6.5, highGain: 5 }
  },
  { 
    id: 'el_jp_female', 
    name: 'Sakura 🇯🇵 (Nữ - 日本語 Anime Kawaii)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.40, 
    rate: 1.06, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Nhật Bản ngọt ngào chuẩn Anime VTuber.',
    sampleText: 'みなさん、こんにちは！ライブ配信へようこそ！一緒に盛り上がりましょう！',
    dspProfile: { semitones: 6.0, rate: 1.06, lowGain: -4.5, midFreq: 1900, midGain: 4, presenceFreq: 4600, presenceGain: 7.5, highGain: 6.5 }
  },
  { 
    id: 'el_jp_male', 
    name: 'Kenji 🇯🇵 (Nam - 日本語 Samurai Caster)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.74, 
    rate: 1.02, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Samurai dũng mãnh chuẩn điện ảnh Nhật Bản.',
    sampleText: '皆様、ようこそお越しくださいました！熱き戦いを始めよう！',
    dspProfile: { semitones: -5.5, rate: 1.02, lowGain: 9, midFreq: 500, midGain: 3.8, presenceFreq: 2400, presenceGain: 4.8, highGain: 0.5 }
  },
  { 
    id: 'el_kr_female', 
    name: 'Min-ji 🇰🇷 (Nữ - 한국어 K-Pop Idol)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.22, 
    rate: 1.04, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ idol K-Pop thanh thoát, trẻ trung.',
    sampleText: '안녕하세요 여러분! 라이브 방송에 오신 것을 진심으로 환영합니다!',
    dspProfile: { semitones: 3.8, rate: 1.04, lowGain: -2, midFreq: 1500, midGain: 3.2, presenceFreq: 4100, presenceGain: 6, highGain: 4.5 }
  },
  { 
    id: 'el_kr_male', 
    name: 'Hyun-woo 🇰🇷 (Nam - 한국어 K-Drama)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.84, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam MC truyền hình Hàn Quốc ấm áp.',
    sampleText: '반갑습니다 여러분! 오늘 라이브도 즐겁게 함께해요!',
    dspProfile: { semitones: -3.2, rate: 0.98, lowGain: 6, midFreq: 600, midGain: 2.5, presenceFreq: 2600, presenceGain: 3, highGain: 1 }
  },
  { 
    id: 'el_th_female', 
    name: 'Premwadee 🇹🇭 (Nữ - ภาษาไทย)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'th-TH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.18, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ Thái Lan dịu dàng, trong trẻo.',
    sampleText: 'สวัสดีค่ะทุกคน ยินดีต้อนรับสู่การถ่ายทอดสดของเราค่ะ!',
    dspProfile: { semitones: 3.0, rate: 1.0, lowGain: -1, midFreq: 1350, midGain: 2.8, presenceFreq: 3800, presenceGain: 5, highGain: 4 }
  },
  { 
    id: 'el_id_female', 
    name: 'Gadis 🇮🇩 (Nữ - Bahasa Indonesia)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'id-ID', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.12, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Indonesia tự nhiên.',
    sampleText: 'Halo semuanya! Selamat datang di siaran langsung kami!',
    dspProfile: { semitones: 2.0, rate: 1.0, lowGain: 0, midFreq: 1200, midGain: 2.2, presenceFreq: 3500, presenceGain: 4, highGain: 3 }
  },
  { 
    id: 'el_ph_female', 
    name: 'Rosa 🇵🇭 (Nữ - Tagalog Philippines)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'tl-PH', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.14, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Tagalog Philippines sinh động.',
    sampleText: 'Kumusta sa lahat! Maligayang pagdating sa ating livestream!',
    dspProfile: { semitones: 2.4, rate: 1.0, lowGain: -0.5, midFreq: 1300, midGain: 2.5, presenceFreq: 3600, presenceGain: 4.5, highGain: 3.5 }
  },
  { 
    id: 'el_in_male', 
    name: 'Aarav 🇮🇳 (Nam - Indian English Host)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Male', 
    lang: 'en-IN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.90, 
    rate: 1.05, 
    recommendedFor: 'both', 
    desc: 'Giọng nam tiếng Anh chuẩn Ấn Độ lưu loát.',
    sampleText: 'Namaste everyone! Welcome to our live broadcast session today!',
    dspProfile: { semitones: -1.8, rate: 1.05, lowGain: 4, midFreq: 800, midGain: 2.5, presenceFreq: 2900, presenceGain: 4, highGain: 2 }
  },
  { 
    id: 'el_ar_female', 
    name: 'Amira 🇸🇦 (Nữ - العربية)', 
    provider: 'system', 
    tier: 'free',
    gender: 'Female', 
    lang: 'ar-SA', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 1.10, 
    rate: 1.0, 
    recommendedFor: 'idol', 
    desc: 'Giọng nữ tiếng Ả Rập truyền cảm.',
    sampleText: 'مرحبًا بالجميع! أهلاً بكم في البث المباشر التفاعلي!',
    dspProfile: { semitones: 1.8, rate: 1.0, lowGain: 1, midFreq: 1100, midGain: 2.2, presenceFreq: 3400, presenceGain: 3.8, highGain: 2.5 }
  }
];

// Toàn bộ giọng Pro & Miễn phí đều được mở khóa 100%
export const ELEVENLABS_VOICES = [
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...INTERNATIONAL_VOICES
].map(v => ({ ...v, tier: 'free', icon: '🎤', badge: '🇻🇳 AI Studio' }));

export const FREE_VOICES = [
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...INTERNATIONAL_VOICES
];

export const ALL_SYSTEM_VOICES = [
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...INTERNATIONAL_VOICES
];

export const CURATED_VOICES = ALL_SYSTEM_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  idolVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
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
    name: 'Quốc Cường 🎤 (Nam - Quản Lý Giục Chốt Đơn Uy Quyền)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    role: 'manager',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0,
    enabled: true
  },
  commentVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
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
    name: 'Quang Huy 🎤 (Nam - BLV Game PK Bùng Nổ, Siêu Tốc)',
    provider: 'system',
    tier: 'free',
    gender: 'Male',
    role: 'game',
    pitch: 1.0,
    rate: 1.1,
    volume: 1.0,
    enabled: true
  },
  generalVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 🇻🇳 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
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

export function updateActiveVoiceAudio(role, voiceObj) {
  const current = getSavedVoiceConfig();
  if (role === 'idol') current.idolVoice = { ...current.idolVoice, ...voiceObj };
  else if (role === 'manager' || role === 'assistant') current.managerVoice = { ...current.managerVoice, ...voiceObj };
  else if (role === 'game') current.gameBlvVoice = { ...current.gameBlvVoice, ...voiceObj };
  else if (role === 'comment') current.commentVoice = { ...current.commentVoice, ...voiceObj };
  saveVoiceConfig(current);
}

// Global active audio & utterance references
let activePreviewAudio = null;
let activeUtterance = null;
let preloadedVoices = [];
let activeAudioContext = null;
let activeSourceNode = null;
const audioBufferMemoryCache = new Map();

// Queue management
const globalSpeechQueue = [];
let isProcessingGlobalQueue = false;
export let isGlobalSpeaking = false;

export function isSpeechActive() {
  return isGlobalSpeaking || !!activePreviewAudio || !!activeUtterance || !!activeSourceNode;
}

export function clearGlobalSpeechQueue() {
  globalSpeechQueue.length = 0;
  isProcessingGlobalQueue = false;
}

function getOrCreateAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!activeAudioContext || activeAudioContext.state === 'closed') {
    activeAudioContext = new AudioContextClass();
  }
  if (activeAudioContext.state === 'suspended') {
    activeAudioContext.resume().catch(() => {});
  }
  return activeAudioContext;
}

export function stopVoiceAudio() {
  if (activeSourceNode) {
    try { activeSourceNode.stop(); } catch(e) {}
    try { activeSourceNode.disconnect(); } catch(e) {}
    activeSourceNode = null;
  }
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
 * 🧹 Bộ lọc làm sạch văn bản thông minh trước khi đưa vào Voice Engine / TTS
 */
export function cleanTextForVoiceSpeech(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let cleaned = rawText;
  cleaned = cleaned.replace(/\[[^\]]*\]/g, ' ');
  cleaned = cleaned.replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ');
  cleaned = cleaned.replace(/[#*`_~]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

/**
 * 🎛️ BỘ XỬ LÝ ÂM THANH ACOUSTIC DSP CHUYÊN NGHIỆP:
 * Biến đổi âm thanh qua đồ thị Web Audio Graph (Parametric EQ + Formant Shift + Multi-Band Compressor)
 * Tạo nên sự khác biệt âm sắc 100% rõ rệt cho từng nhân vật!
 */
async function playAudioBufferWithDSP(audioBuffer, voice, requestedVolume, requestedRate, onEnd, isTestingMode) {
  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return false;

  stopVoiceAudio();

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  activeSourceNode = source;

  const dsp = voice?.dspProfile || {};
  const semitones = dsp.semitones !== undefined ? dsp.semitones : (voice.gender === 'Female' ? 2.0 : -2.5);
  const baseRate = dsp.rate !== undefined ? dsp.rate : 1.0;
  
  // Tính toán tỷ lệ dịch chuyển tần số F0 & tốc độ
  const pitchFactor = Math.pow(2, semitones / 12);
  const finalPlaybackRate = Math.max(0.65, Math.min(1.65, pitchFactor * baseRate * (requestedRate || 1.0)));
  source.playbackRate.value = finalPlaybackRate;

  // 1. Low Shelf (Cộng hưởng ngực / Body Warmth)
  const lowFilter = audioCtx.createBiquadFilter();
  lowFilter.type = 'lowshelf';
  lowFilter.frequency.value = voice.gender === 'Male' ? 220 : 320;
  lowFilter.gain.value = dsp.lowGain !== undefined ? dsp.lowGain : (voice.gender === 'Male' ? 5.0 : -1.0);

  // 2. Formant F1 (Peaking Filter - Trọng tâm giọng)
  const midFilter = audioCtx.createBiquadFilter();
  midFilter.type = 'peaking';
  midFilter.frequency.value = dsp.midFreq || (voice.gender === 'Male' ? 650 : 1200);
  midFilter.Q.value = 1.2;
  midFilter.gain.value = dsp.midGain !== undefined ? dsp.midGain : 2.5;

  // 3. Formant F2 (Peaking Filter - Độ sắc nét & Bite của nhân vật)
  const presenceFilter = audioCtx.createBiquadFilter();
  presenceFilter.type = 'peaking';
  presenceFilter.frequency.value = dsp.presenceFreq || (voice.gender === 'Male' ? 2600 : 3800);
  presenceFilter.Q.value = 1.5;
  presenceFilter.gain.value = dsp.presenceGain !== undefined ? dsp.presenceGain : 4.0;

  // 4. High Shelf (Độ thoáng & Sparkle không khí)
  const highFilter = audioCtx.createBiquadFilter();
  highFilter.type = 'highshelf';
  highFilter.frequency.value = 6500;
  highFilter.gain.value = dsp.highGain !== undefined ? dsp.highGain : (voice.gender === 'Female' ? 3.5 : 0.5);

  // 5. Dynamics Broadcast Compressor (Nén động lực & Tăng uy lực giọng)
  const compressor = audioCtx.createDynamicsCompressor();
  const compCfg = dsp.compressor || {};
  compressor.threshold.value = compCfg.threshold !== undefined ? compCfg.threshold : -20;
  compressor.knee.value = 6;
  compressor.ratio.value = compCfg.ratio !== undefined ? compCfg.ratio : 4.5;
  compressor.attack.value = compCfg.attack !== undefined ? compCfg.attack : 0.005;
  compressor.release.value = compCfg.release !== undefined ? compCfg.release : 0.18;

  // 6. Master Gain
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = Math.max(0, Math.min(1.0, requestedVolume));

  // Nối chuỗi âm thanh: Source -> Low -> Mid -> Presence -> High -> Compressor -> MasterGain -> Destination
  source.connect(lowFilter);
  lowFilter.connect(midFilter);
  midFilter.connect(presenceFilter);
  presenceFilter.connect(highFilter);
  highFilter.connect(compressor);
  compressor.connect(masterGain);
  masterGain.connect(audioCtx.destination);

  // Kết nối LipSync Engine nếu không phải chế độ test preview
  if (!isTestingMode) {
    try {
      globalLipSyncEngine.connectAudioNode(masterGain, audioCtx);
    } catch (e) {}
  }

  return new Promise((resolve) => {
    let hasEnded = false;
    const finish = () => {
      if (hasEnded) return;
      hasEnded = true;
      activeSourceNode = null;
      if (onEnd) onEnd();
      resolve(true);
    };

    source.onended = finish;
    try {
      source.start(0);
    } catch (e) {
      finish();
    }
  });
}

/**
 * ⚡ TẢI VÀ GIẢI MÃ ÂM THANH TTS (CÓ BỘ NHỚ ĐỆM TỰ ĐỘNG)
 */
async function fetchAndDecodeTTSAudio(text, lang = 'vi') {
  const cacheKey = `${lang}_${text.trim().slice(0, 100)}`;
  if (audioBufferMemoryCache.has(cacheKey)) {
    return audioBufferMemoryCache.get(cacheKey);
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return null;

  const candidateUrls = [
    `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`,
    `http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text.slice(0, 200))}`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        if (arrayBuf && arrayBuf.byteLength > 100) {
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
          if (audioBuffer) {
            if (audioBufferMemoryCache.size > 80) {
              const firstKey = audioBufferMemoryCache.keys().next().value;
              audioBufferMemoryCache.delete(firstKey);
            }
            audioBufferMemoryCache.set(cacheKey, audioBuffer);
            return audioBuffer;
          }
        }
      }
    } catch (e) {}
  }

  return null;
}

/**
 * 🎙️ Phát Voice AI Âm Thanh Cho Mọi Mục Đích (Preview, Idol nói, Game BLV, Trợ lý)
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
  voiceObj = voiceObj || ALL_SYSTEM_VOICES[0];

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

    await new Promise((r) => setTimeout(r, 400));
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

  // Chuẩn bị câu thoại chuẩn xác (ưu tiên câu tiếng Việt riêng của từng giọng)
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
  // TIER 1: ElevenLabs API (Nếu người dùng có cấu hình ElevenLabs API Key)
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
      console.warn('ElevenLabs fetch error, falling back to Acoustic DSP:', e);
    }
  }

  // =========================================================================
  // TIER 2: ACOUSTIC DSP SYNTHESIZER (100% MIỄN PHÍ & KHÁC BIỆT RÕ RỆT)
  // =========================================================================
  try {
    const audioBuffer = await fetchAndDecodeTTSAudio(textToSpeak, shortLang);
    if (audioBuffer) {
      const success = await playAudioBufferWithDSP(audioBuffer, voice, effectiveVoiceVolume, requestedRate, onEnd, isTestingMode);
      if (success) return true;
    }
  } catch (dspErr) {
    console.warn('Acoustic DSP synthesis error, fallback to WebSpeech:', dspErr);
  }

  // =========================================================================
  // TIER 3: Client Web Speech API (Fallback dự phòng)
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
      const dsp = voice?.dspProfile || {};
      const semitones = dsp.semitones !== undefined ? dsp.semitones : (isMale ? -2.5 : 2.0);
      const pitchRatio = Math.pow(2, semitones / 12);

      utterance.rate = Math.max(0.7, Math.min(1.5, requestedRate * (dsp.rate || 1.0)));
      utterance.pitch = Math.max(0.5, Math.min(2.0, pitchRatio * (voice?.pitch || 1.0)));
      utterance.volume = effectiveVoiceVolume;

      const availableVoices = (preloadedVoices.length > 0 ? preloadedVoices : window.speechSynthesis.getVoices()) || [];
      if (availableVoices.length > 0) {
        let matched = availableVoices.find(v => {
          const vLang = (v.lang || '').toLowerCase().replace('_', '-');
          const matchesLang = vLang.startsWith(shortLang) || vLang.includes(shortLang);
          const vName = (v.name || '').toLowerCase();
          if (isMale) {
            return matchesLang && (vName.includes('male') || vName.includes('nam') || vName.includes('david') || vName.includes('george') || vName.includes('james'));
          } else {
            return matchesLang && (vName.includes('female') || vName.includes('nữ') || vName.includes('linh') || vName.includes('mai') || vName.includes('zira') || vName.includes('samantha'));
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
        utterance.onerror = () => finish(false);

        const maxDurationMs = Math.max(4000, textToSpeak.length * 150);
        const watchdog = setTimeout(() => finish(true), maxDurationMs);
        utterance.addEventListener('end', () => clearTimeout(watchdog));

        try {
          window.speechSynthesis.speak(utterance);
        } catch (spkErr) {
          finish(false);
        }
      });
    } catch (synthErr) {}
  }

  if (onEnd) onEnd();
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
  previewVoiceAudio,
  speakVoiceAudio,
  stopVoiceAudio,
  cleanTextForVoiceSpeech,
  updateActiveVoiceAudio,
  isSpeechActive,
  clearGlobalSpeechQueue
};
