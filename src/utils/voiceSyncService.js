/**
 * AVA LIVE - Unified High-Definition Multi-Voice & Distinct Acoustic DSP Architecture
 * 
 * HỆ THỐNG 89 GIỌNG ĐỌC AI CAO CẤP CHUYÊN NGHIỆP:
 * 1. 21 Giọng Nữ Việt Nam Đỉnh Cao (MC, BTV VTV, ASMR, Kể Chuyện, Idol Live, Gen Z, Quý Bà...)
 * 2. 20 Giọng Nam Việt Nam Trầm Hùng & Nam Tính (BLV Game PK, Phóng Sự VTV, Doanh Nhân, Chiến Binh, Lão Niên...)
 * 3. 20 Giọng Chuyên Biệt Bán Hàng Sản Phẩm & Dịch Vụ Đa Ngành (Mỹ Phẩm, Thời Trang, BĐS, Xe Hơi, Khóa Học, Sức Khỏe, Mẹ & Bé, Ẩm Thực, Phong Thủy, Spa...)
 * 4. 28 Giọng Quốc Tế Đa Ngôn Ngữ (Mỹ, Anh, Pháp, Đức, Ý, Tây Ban Nha, Nga, Trung, Nhật, Hàn, Thái...)
 * 
 * - 100% KHÁC BIỆT HOÀN TOÀN: Chuẩn Nam ra Nam (trầm ấm, uy lực, hào sảng), Chuẩn Nữ ra Nữ (ngọt ngào, trong trẻo, sang trọng).
 * - Cảm xúc đỉnh cao, nhấn nhá điêu luyện, thần thái chuyên nghiệp.
 * - Tích hợp hệ thống Yêu Thích (⭐ Star Favorite) lưu trữ kho giọng yêu thích tức thì.
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

// ==================== 1. 21 GIỌNG NỮ VIỆT NAM CAO CẤP (ĐA VÙNG MIỀN BẮC - TRUNG - NAM - TÂY) ====================
export const VIETNAMESE_FEMALE_VOICES = [
  {
    id: 'vn_nu_bientapvien',
    name: 'Mai Phương 👑 (Nữ - BTV Thời Sự VTV [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'BTV Thời Sự • Miền Bắc',
    pitch: 1.04,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn biên tập viên truyền hình quốc gia Hà Nội, đĩnh đạc, phát âm chuẩn mực, sang trọng.',
    sampleText: 'Kính chào quý vị và các bạn! Bản tin thời sự trực tiếp trên sóng livestream xin được phép bắt đầu với những tin tức quan trọng nhất.',
    edgePitch: '+2%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.2, midFreq: 1100, midGain: 2.2, presenceFreq: 3500, presenceGain: 3.8, highGain: 2.0, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -20, ratio: 4, attack: 0.008, release: 0.2 } }
  },
  {
    id: 'vn_nu_mctruyenhinh',
    name: 'Thanh Trúc 👑 (Nữ - MC Sự Kiện Hà Nội Thanh Lịch)',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'MC Sự Kiện • Miền Bắc',
    pitch: 1.08,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nữ dẫn chương trình truyền hình sang trọng, cuốn hút, phát âm tròn vành rõ chữ.',
    sampleText: 'Chào mừng toàn thể quý khán giả đang theo dõi phiên phát sóng trực tiếp đặc biệt và ngập tràn ưu đãi ngày hôm nay!',
    edgePitch: '+6%',
    edgeRate: '+3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1250, midGain: 2.5, presenceFreq: 3900, presenceGain: 4.5, highGain: 3.2, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.25 } }
  },
  {
    id: 'vn_nu_kechuyen',
    name: 'Hương Giang 👑 (Nữ - Kể Chuyện & Podcast Tâm Sự [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Podcast • Miền Bắc',
    pitch: 0.96,
    rate: 0.95,
    recommendedFor: 'idol',
    desc: 'Giọng nữ truyền cảm, ấm áp, sâu lắng, thích hợp đọc sách, podcast tâm sự đêm muộn.',
    sampleText: 'Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện tuyệt vời lắng đọng cảm xúc nhé.',
    edgePitch: '-6%',
    edgeRate: '-5%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.8, midFreq: 950, midGain: 2.0, presenceFreq: 3000, presenceGain: 2.5, highGain: 1.0, reverb: 0.08, reverbDecay: 0.45, compressor: { threshold: -14, ratio: 2.5, attack: 0.03, release: 0.4 } }
  },
  {
    id: 'vn_nu_banhang',
    name: 'Ngọc Huyền 👑 (Nữ - Chốt Đơn Siêu Tốc [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng Sắc Bén • Miền Bắc',
    pitch: 1.14,
    rate: 1.06,
    recommendedFor: 'manager',
    desc: 'Giọng nữ chốt đơn livestream TikTok Shop tốc độ, năng động, thúc đẩy mua hàng dứt khoát.',
    sampleText: 'Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k trong giỏ hàng, các bạn đặt ngay kẻo lỡ nhé!',
    edgePitch: '+12%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.0, midFreq: 1400, midGain: 2.8, presenceFreq: 4000, presenceGain: 5.5, highGain: 3.5, reverb: 0.03, reverbDecay: 0.25, compressor: { threshold: -22, ratio: 5, attack: 0.004, release: 0.15 } }
  },
  {
    id: 'vn_nu_quangcao_tvc',
    name: 'Lan Anh 👑 (Nữ - TVC Quảng Cáo & Giục Đơn Flash Sale [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'TVC Quảng Cáo • Miền Bắc',
    pitch: 1.10,
    rate: 1.04,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quảng cáo TVC chuyên nghiệp, cuốn hút, tạo cảm giác cấp bách chốt sale.',
    sampleText: 'Cơ hội săn sale vàng chỉ còn trong ít phút, hãy nhanh tay bấm vào giỏ hàng chốt đơn ngay kẻo hết quà tặng!',
    edgePitch: '+8%',
    edgeRate: '+5%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1200, midGain: 2.5, presenceFreq: 4100, presenceGain: 4.8, highGain: 3.0, reverb: 0.05, reverbDecay: 0.32, compressor: { threshold: -20, ratio: 4.5, attack: 0.006, release: 0.18 } }
  },
  {
    id: 'vn_nu_hue_diudang',
    name: 'Mỹ Tâm 👑 (Nữ - Huế Dịu Dàng, Ngọt Ngào [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Giọng Xứ Huế • Miền Trung',
    pitch: 1.06,
    rate: 0.96,
    recommendedFor: 'both',
    desc: 'Giọng nữ xứ Huế đằm thắm, ngọt ngào, e ấp, âm điệu da diết chạm đến trái tim người nghe.',
    sampleText: 'Dạ em xin kính chào quý anh chị nì! Áo dài lụa thêu tay xứ Huế mười phân vẹn mười đây ạ, mời anh chị ghé xem ủng hộ em hí!',
    edgePitch: '+4%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.0, midFreq: 1180, midGain: 2.6, presenceFreq: 3600, presenceGain: 4.2, highGain: 3.0, reverb: 0.07, reverbDecay: 0.42, compressor: { threshold: -16, ratio: 3.2, attack: 0.015, release: 0.3 } }
  },
  {
    id: 'vn_nu_danang_duyendang',
    name: 'Thanh Vân 👑 (Nữ - Đà Nẵng Trẻ Trung, Duyên Dáng [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Giọng Đà Nẵng • Miền Trung',
    pitch: 1.10,
    rate: 1.03,
    recommendedFor: 'both',
    desc: 'Giọng nữ Đà Nẵng trong sáng, tươi tắn, gần gũi và mến khách.',
    sampleText: 'Dạ em chào mọi người nghe! Hôm nay shop em có chương trình ưu đãi cực khủng cho khách đặt hàng sớm nhất nè!',
    edgePitch: '+8%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1300, midGain: 2.6, presenceFreq: 3800, presenceGain: 4.6, highGain: 3.5, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -19, ratio: 3.8, attack: 0.008, release: 0.2 } }
  },
  {
    id: 'vn_nu_nghean_damda',
    name: 'Phương Oanh 👑 (Nữ - Nghệ Tĩnh Đậm Đà Tình Cảm [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Giọng Nghệ Tĩnh • Miền Trung',
    pitch: 0.98,
    rate: 1.01,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Trung Nghệ Tĩnh mộc mạc, chân thành, sâu lắng và giàu nghĩa tình.',
    sampleText: 'Em chào bà con cô bác đang xem live nha, đặc sản quê nhà sạch sẽ tinh tươm gửi trao tận tay mọi người đây ạ!',
    edgePitch: '-2%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1150, midGain: 2.4, presenceFreq: 3500, presenceGain: 3.8, highGain: 2.2, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -17, ratio: 3.4, attack: 0.012, release: 0.26 } }
  },
  {
    id: 'vn_nu_idol_live',
    name: 'Ngọc Nhi 👑 (Nữ - Idol Live Sài Gòn Trendy [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Sài Gòn • Miền Nam',
    pitch: 1.14,
    rate: 1.04,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Idol livestream Sài Gòn ngọt ngào, thời thượng, thu hút mọi ánh nhìn.',
    sampleText: 'Dạ em Ngọc Nhi xin chào cả nhà mình nha! Mọi người thả tim và chấm một cái vào phần bình luận để em thấy tương tác nè!',
    edgePitch: '+12%',
    edgeRate: '+5%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.5, midFreq: 1500, midGain: 3.0, presenceFreq: 4200, presenceGain: 5.8, highGain: 4.5, reverb: 0.06, reverbDecay: 0.36, compressor: { threshold: -21, ratio: 4.2, attack: 0.005, release: 0.15 } }
  },
  {
    id: 'vn_nu_koc_review',
    name: 'Khánh Linh 👑 (Nữ - KOC Sài Gòn Năng Động [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'KOC Năng Động • Miền Nam',
    pitch: 1.12,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng nữ KOC Sài Gòn bắt trend, nói chuyện có duyên, review sản phẩm cực kỳ chân thật.',
    sampleText: 'Món này cưng xỉu luôn mấy bà ơi! Chất lượng 10 điểm không có nhưng nha, bấm vô giỏ hàng hốt liền kẻo hết deal hời!',
    edgePitch: '+10%',
    edgeRate: '+7%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.8, midFreq: 1380, midGain: 2.8, presenceFreq: 3900, presenceGain: 4.8, highGain: 3.5, reverb: 0.04, reverbDecay: 0.30, compressor: { threshold: -20, ratio: 4.0, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nu_mientay_giongia',
    name: 'Út Mai 👑 (Nữ - Miền Tây Giòn Giã, Dễ Mến [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Giọng Sông Nước • Miền Tây',
    pitch: 1.16,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Tây sông nước ngọt ngào, chất phác, vui tươi, nghe là thấy mến thương liền.',
    sampleText: 'Dạ em Út Mai chào bà con cô bác mình nghen! Trái cây vườn nhà em hái tươi rói luôn nè, bà con đặt liền tay em gửi hỏa tốc nghen!',
    edgePitch: '+14%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.8, midFreq: 1350, midGain: 2.8, presenceFreq: 4000, presenceGain: 5.2, highGain: 3.8, reverb: 0.05, reverbDecay: 0.32, compressor: { threshold: -19, ratio: 3.8, attack: 0.007, release: 0.2 } }
  },
  {
    id: 'vn_nu_mientay_cantho',
    name: 'Cô Ba Cần Thơ 👑 (Nữ - Sông Nước Ngọt Lịm [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Sông Nước Cần Thơ • Miền Tây',
    pitch: 1.04,
    rate: 0.97,
    recommendedFor: 'both',
    desc: 'Giọng nữ Cần Thơ đôn hậu, ngọt lịm như mía lùi, chuyên tư vấn đặc sản và nông sản miệt vườn.',
    sampleText: 'Dạ Cô Ba mến chào cả nhà mình nha! Bánh mứt kẹo dừa thơm ngon đặc sản miệt vườn bảo đảm ăn là ghiền nghen!',
    edgePitch: '+3%',
    edgeRate: '-3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1200, midGain: 2.5, presenceFreq: 3600, presenceGain: 4.2, highGain: 2.8, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.24 } }
  },
  {
    id: 'vn_nu_quyco_doanhnhan',
    name: 'Hồng Nhung 👑 (Nữ - Quý Bà Doanh Nhân Quyền Quý [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'mature',
    styleCategory: 'doanhnhan',
    category: 'Quý Bà Doanh Nhân • Miền Bắc',
    pitch: 0.94,
    rate: 0.96,
    recommendedFor: 'both',
    desc: 'Giọng nữ doanh nhân Hà Nội thành đạt, đĩnh đạc, bản lĩnh và đầy sức hút.',
    sampleText: 'Chất lượng tạo nên đẳng cấp và uy tín bền vững. Chúng tôi luôn cam kết mang lại những giá trị hoàn hảo nhất cho khách hàng.',
    edgePitch: '-8%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.0, midFreq: 1050, midGain: 2.5, presenceFreq: 3300, presenceGain: 3.5, highGain: 1.8, reverb: 0.06, reverbDecay: 0.40, compressor: { threshold: -18, ratio: 3.8, attack: 0.01, release: 0.25 } }
  },
  {
    id: 'vn_nu_ngotngao',
    name: 'Bảo Ngọc 👑 (Nữ - Dễ Thương, Kẹo Ngọt Sài Gòn [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Kẹo Ngọt • Miền Nam',
    pitch: 1.18,
    rate: 1.03,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung ngọt ngào, dịu dàng, giao lưu trò chuyện thân thiết.',
    sampleText: 'Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim và tương tác cùng em nhé!',
    edgePitch: '+15%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -2.0, midFreq: 1550, midGain: 3.0, presenceFreq: 4300, presenceGain: 6.0, highGain: 4.8, reverb: 0.06, reverbDecay: 0.36, compressor: { threshold: -20, ratio: 3.8, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nu_asmr_thitham',
    name: 'Hải Yến 👑 (Nữ - ASMR Thì Thầm Thư Giãn [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'ASMR & Thư Giãn • Miền Bắc',
    pitch: 0.96,
    rate: 0.92,
    recommendedFor: 'idol',
    desc: 'Giọng nữ thì thầm êm ái, mang lại cảm giác thư thái dễ chịu cho giấc ngủ.',
    sampleText: 'Hãy nhắm mắt lại, thả lỏng toàn bộ cơ thể và tận hưởng những phút giây bình yên sâu lắng nhất nhé...',
    edgePitch: '-4%',
    edgeRate: '-8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.5, midFreq: 950, midGain: 1.8, presenceFreq: 3100, presenceGain: 2.2, highGain: 1.5, reverb: 0.09, reverbDecay: 0.48, compressor: { threshold: -12, ratio: 2.0, attack: 0.05, release: 0.5 } }
  },
  {
    id: 'vn_nu_truyencamhung',
    name: 'Ánh Dương 👑 (Nữ - Truyền Cảm Hứng & Năng Lượng Tích Cực)',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'truyencamhung',
    category: 'Truyền Cảm Hứng • Miền Bắc',
    pitch: 1.06,
    rate: 1.03,
    recommendedFor: 'both',
    desc: 'Giọng nữ truyền cảm hứng mạnh mẽ, kích thích ý chí vươn lên và năng lượng tích cực.',
    sampleText: 'Mỗi ngày mới là một cơ hội để bạn bứt phá, nỗ lực hết mình và chạm tới đỉnh cao thành công rực rỡ!',
    edgePitch: '+5%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.2, midFreq: 1150, midGain: 2.6, presenceFreq: 3500, presenceGain: 4.0, highGain: 2.5, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.22 } }
  },
  {
    id: 'vn_nu_video_viral',
    name: 'Thu Trang 👑 (Nữ - Video Viral & TikTok Review [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Viral Review • Miền Nam',
    pitch: 1.10,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng nữ review sản phẩm, video viral triệu view trên mạng xã hội.',
    sampleText: 'Review chân thật cho cả nhà đây! Sản phẩm hôm nay cực kỳ đỉnh, mọi người cùng xem ngay nhé!',
    edgePitch: '+9%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1300, midGain: 2.5, presenceFreq: 3600, presenceGain: 4.2, highGain: 3.0, reverb: 0.04, reverbDecay: 0.30, compressor: { threshold: -20, ratio: 4, attack: 0.006, release: 0.18 } }
  },
  {
    id: 'vn_nu_phongsu_vtv',
    name: 'Tuyết Mai 👑 (Nữ - Phóng Sự Tài Liệu VTV Hà Nội)',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Phóng Sự Tài Liệu • Miền Bắc',
    pitch: 0.98,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ thuyết minh phóng sự tài liệu chuyên sâu, sâu sắc và thuyết phục.',
    sampleText: 'Hành trình khám phá văn hóa và con người Việt Nam luôn mang đến những giá trị sâu sắc và bài học vô giá.',
    edgePitch: '-2%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1000, midGain: 2.4, presenceFreq: 3300, presenceGain: 3.5, highGain: 1.5, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -19, ratio: 4, attack: 0.01, release: 0.22 } }
  },
  {
    id: 'vn_nu_giucdon_tocbien',
    name: 'Cẩm Tú 👑 (Nữ - Giục Đơn Tốc Biến Hàng Khủng Sài Gòn)',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Giục Đơn Sôi Sục • Miền Nam',
    pitch: 1.15,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng nữ giục đơn dồn dập, tạo hiệu ứng đám đông mua sắm cuồng nhiệt.',
    sampleText: 'Chỉ còn đúng 5 suất quà tặng độc quyền trong hôm nay, các bác bấm mua ngay góc trái màn hình kẻo hết nhé!',
    edgePitch: '+14%',
    edgeRate: '+10%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.5, midFreq: 1450, midGain: 3.0, presenceFreq: 4100, presenceGain: 5.8, highGain: 3.8, reverb: 0.03, reverbDecay: 0.25, compressor: { threshold: -23, ratio: 5.5, attack: 0.003, release: 0.12 } }
  },
  {
    id: 'vn_nu_vtuber_nhinhanh',
    name: 'Nhật Hạ 👑 (Nữ - Anime / VTuber Nhí Nhảnh Gen Z [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Anime VTuber • Miền Nam',
    pitch: 1.45,
    rate: 1.14,
    recommendedFor: 'idol',
    desc: 'Giọng nữ phong cách VTuber dễ thương, bắt trend giới trẻ.',
    sampleText: 'Cảm ơn các bạn đã ghé xem live của em! Nhớ bấm theo dõi kênh để không bỏ lỡ buổi live tiếp theo nha!',
        edgePitch: '+38%',
    edgeRate: '+10%',
dspProfile: { semitones: 6.8, rate: 1.14, lowGain: -5.0, midFreq: 2100, midGain: 4.2, presenceFreq: 4900, presenceGain: 8.5, highGain: 7.5, compressor: { threshold: -23, ratio: 4.2, attack: 0.003, release: 0.14 } }
  },
  {
    id: 'free_vi_female',
    name: 'Hoài My 👑 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Chuẩn Tiếng Việt • Toàn Quốc',
    pitch: 1.10,
    rate: 1.05,
    recommendedFor: 'idol',
    desc: 'Giọng nữ chuẩn tiếng Việt truyền cảm, phát âm mượt mà, cảm xúc tự nhiên.',
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng tích cực ạ!',
        edgePitch: '+2%',
    edgeRate: '+2%',
dspProfile: { semitones: 1.8, rate: 1.05, lowGain: 0.0, midFreq: 1150, midGain: 2.2, presenceFreq: 3400, presenceGain: 3.8, highGain: 2.8, compressor: { threshold: -18, ratio: 3.5, attack: 0.008, release: 0.2 } }
  }
];

// ==================== 2. 20 GIỌNG NAM VIỆT NAM CAO CẤP (NAM TÍNH, TRẦM HÙNG, TỐC ĐỘ CHUẨN XÁC 100%) ====================
export const VIETNAMESE_MALE_VOICES = [
  {
    id: 'el_adam',
    name: 'Adam 👑 (Nam - Thuyết Trình Điềm Đạm Chuẩn Quốc Gia [Miền Bắc])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Thương Mại & Thuyết Trình • Miền Bắc',
    pitch: 0.75,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nam trầm ấm, điềm đạm, phong thái chững chạc cực kỳ thuyết phục.',
    sampleText: 'Chào mừng tất cả các bạn đã đến với buổi phát sóng hôm nay! Chúc mọi người một ngày tràn đầy năng lượng và gặt hái nhiều thành công!',
        edgePitch: '-4%',
    edgeRate: '+4%',
dspProfile: { semitones: -7.5, rate: 1.06, lowGain: 9.0, midFreq: 450, midGain: 3.5, presenceFreq: 2200, presenceGain: -2.0, highGain: -4.0, compressor: { threshold: -18, ratio: 4.5, attack: 0.015, release: 0.3 } }
  },
  {
    id: 'vn_nam_blv_bungno',
    name: 'Quang Huy 👑 (Nam - BLV Game PK Bùng Nổ [Miền Bắc])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Game Sôi Động • Miền Bắc',
    pitch: 0.82,
    rate: 1.25,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên game PK bùng nổ, tốc độ cực nhanh khi combat nghẹt thở.',
    sampleText: 'Pha combat đỉnh cao! Cả hai đội đang tung toàn bộ chiêu thức, hãy cùng bùng nổ năng lượng nào anh em ơi!',
        edgePitch: '+22%',
    edgeRate: '+24%',
dspProfile: { semitones: -6.5, rate: 1.25, lowGain: 7.0, midFreq: 600, midGain: 4.0, presenceFreq: 2600, presenceGain: 3.5, highGain: -1.0, compressor: { threshold: -26, ratio: 8, attack: 0.002, release: 0.08 } }
  },
  {
    id: 'vn_nam_mc_haosang',
    name: 'Minh Quân 👑 (Nam - MC Sự Kiện Truyền Hình Hào Sảng [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'MC Sự Kiện • Miền Bắc',
    pitch: 0.78,
    rate: 1.08,
    recommendedFor: 'both',
    desc: 'Giọng MC dẫn chương trình truyền hình cuốn hút, hoạt náo, tràn đầy năng lượng.',
    sampleText: 'Xin nhiệt liệt chào mừng toàn thể quý vị đại biểu và quý khán giả đã có mặt tại sự kiện trực tiếp ngày hôm nay!',
        edgePitch: '+6%',
    edgeRate: '+8%',
dspProfile: { semitones: -7.2, rate: 1.08, lowGain: 8.5, midFreq: 500, midGain: 3.0, presenceFreq: 2400, presenceGain: 1.0, highGain: -2.0, compressor: { threshold: -20, ratio: 4.5, attack: 0.006, release: 0.2 } }
  },
  {
    id: 'vn_nam_phongsu_vtv',
    name: 'Đức Thắng 👑 (Nam - Phóng Sự Tài Liệu VTV Đĩnh Đạc [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Phóng Sự & Truyền Hình • Miền Bắc',
    pitch: 0.70,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nam chuẩn phóng sự tài liệu, chín chắn, sâu sắc và đáng tin cậy.',
    sampleText: 'Góc nhìn chân thực, thông tin đa chiều và những câu chuyện lay động hàng triệu trái tim người xem truyền hình.',
        edgePitch: '-12%',
    edgeRate: '+0%',
dspProfile: { semitones: -8.5, rate: 1.02, lowGain: 10.5, midFreq: 380, midGain: 3.5, presenceFreq: 1900, presenceGain: -2.5, highGain: -5.0, compressor: { threshold: -18, ratio: 4, attack: 0.012, release: 0.28 } }
  },
  {
    id: 'vn_nam_chotsale',
    name: 'Thành Nam 👑 (Nam - Chốt Sale Thần Tốc Sài Gòn [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Bán Hàng Chốt Đơn • Miền Nam',
    pitch: 0.80,
    rate: 1.18,
    recommendedFor: 'manager',
    desc: 'Giọng nam bán hàng chốt đơn livestream dứt khoát, thuyết phục khách mua ngay.',
    sampleText: 'Cơ hội duy nhất trong ngày hôm nay! Giá sốc tận đáy kèm quà tặng khủng, anh em chốt đơn ngay kẻo hết nhé!',
        edgePitch: '+12%',
    edgeRate: '+18%',
dspProfile: { semitones: -7.0, rate: 1.18, lowGain: 7.5, midFreq: 550, midGain: 3.5, presenceFreq: 2500, presenceGain: 2.0, highGain: -2.0, compressor: { threshold: -24, ratio: 6, attack: 0.003, release: 0.12 } }
  },
  {
    id: 'vn_nam_thuyetminh_dienanh',
    name: 'Hoàng Bách 👑 (Nam - Thuyết Minh Điện Ảnh Hollywood [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Thuyết Minh Điện Ảnh • Miền Bắc',
    pitch: 0.65,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng thuyết minh phim điện ảnh Hollywood đầy kịch tính, trầm hùng vang dội.',
    sampleText: 'Một cuộc chiến định mệnh đã bắt đầu, thay đổi toàn bộ dòng chảy thời gian và vận mệnh của cả vũ trụ!',
        edgePitch: '-28%',
    edgeRate: '-6%',
dspProfile: { semitones: -9.5, rate: 1.02, lowGain: 12.0, midFreq: 320, midGain: 4.5, presenceFreq: 1800, presenceGain: -2.0, highGain: -6.0, compressor: { threshold: -22, ratio: 5.5, attack: 0.015, release: 0.35 } }
  },
  {
    id: 'vn_nam_kechuyen_tramam',
    name: 'Hữu Phước 👑 (Nam - Kể Chuyện & Podcast Trầm Ấm [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Tâm Sự • Miền Bắc',
    pitch: 0.68,
    rate: 1.0,
    recommendedFor: 'idol',
    desc: 'Giọng nam trầm ấm, truyền cảm, thích hợp đọc truyện đêm khuya, podcast lắng đọng.',
    sampleText: 'Đêm tĩnh lặng, những kỷ niệm xưa lại ùa về mang theo bao nỗi niềm chất chứa trong tâm hồn.',
        edgePitch: '-20%',
    edgeRate: '-10%',
dspProfile: { semitones: -8.8, rate: 1.0, lowGain: 11.0, midFreq: 360, midGain: 3.0, presenceFreq: 1900, presenceGain: -3.0, highGain: -6.5, compressor: { threshold: -14, ratio: 2.8, attack: 0.03, release: 0.45 } }
  },
  {
    id: 'vn_nam_quanly_uyquyen',
    name: 'Quốc Cường 👑 (Nam - Giám Đốc Thúc Giục Chốt Đơn [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Giục Đơn Uy Quyền • Miền Nam',
    pitch: 0.74,
    rate: 1.12,
    recommendedFor: 'manager',
    desc: 'Giọng quản lý bán hàng uy quyền, thúc giục khán giả đặt hàng ngay.',
    sampleText: 'Bộ phận kho thông báo số lượng chỉ còn dưới 10 sản phẩm, quý khách nhanh tay hoàn tất đơn hàng ngay lập tức!',
        edgePitch: '-14%',
    edgeRate: '+10%',
dspProfile: { semitones: -7.8, rate: 1.12, lowGain: 9.0, midFreq: 460, midGain: 3.5, presenceFreq: 2300, presenceGain: 1.0, highGain: -3.0, compressor: { threshold: -22, ratio: 5.5, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nam_doanhnhan',
    name: 'Việt Hưng 👑 (Nam - Doanh Nhân Thành Đạt Hà Nội [Miền Bắc])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Doanh Nhân & Giám Đốc • Miền Bắc',
    pitch: 0.72,
    rate: 1.02,
    recommendedFor: 'manager',
    desc: 'Giọng giám đốc điều hành, doanh nhân thành đạt, đĩnh đạc và quyết đoán.',
    sampleText: 'Chiến lược đúng đắn và sự quyết đoán chính là chìa khóa mở ra cánh cửa thành công vượt bậc trong kinh doanh.',
        edgePitch: '-16%',
    edgeRate: '+2%',
dspProfile: { semitones: -8.2, rate: 1.02, lowGain: 10.0, midFreq: 400, midGain: 3.8, presenceFreq: 2000, presenceGain: -1.0, highGain: -4.5, compressor: { threshold: -19, ratio: 4.2, attack: 0.01, release: 0.3 } }
  },
  {
    id: 'vn_nam_quyong_lichlam',
    name: 'Tuấn Kiệt 👑 (Nam - Quý Ông Lịch Lãm Sang Trọng [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Sang Trọng & Thương Hiệu • Miền Nam',
    pitch: 0.75,
    rate: 1.04,
    recommendedFor: 'idol',
    desc: 'Giọng nam quý phái, thanh lịch, phù hợp các sản phẩm cao cấp xa xỉ.',
    sampleText: 'Sự sang trọng tinh tế không nằm ở vẻ hào nhoáng, mà toát ra từ thần thái và đẳng cấp đích thực.',
        edgePitch: '-8%',
    edgeRate: '+5%',
dspProfile: { semitones: -7.6, rate: 1.04, lowGain: 8.5, midFreq: 480, midGain: 2.8, presenceFreq: 2200, presenceGain: 0.0, highGain: -3.5, compressor: { threshold: -17, ratio: 3.5, attack: 0.012, release: 0.25 } }
  },
  {
    id: 'vn_nam_mientay_bacthanh',
    name: 'Chú Năm Miền Tây 👑 (Nam - Mộc Mạc, Chân Chất [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'elder',
    styleCategory: 'mientay',
    category: 'Miền Tây & Dân Dã',
    pitch: 0.74,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng chú Năm chân quê, bình dị, chất phác miền Tây sông nước.',
    sampleText: 'Bà con cô bác ghé qua kênh livestream ủng hộ mấy món đặc sản miệt vườn quê mình nghen!',
    edgePitch: '-12%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.5, rate: 1.02, lowGain: 8.5, midFreq: 450, midGain: 3.2, presenceFreq: 2200, presenceGain: 1.0, highGain: -3.0 }
  }
];

// ==================== 3. KHO 30 GIỌNG BÁN HÀNG & CHỐT ĐƠN ĐA NGÀNH, ĐA VÙNG MIỀN, ĐA ĐỘ TUỔI (20-70 TUỔI) ====================
export const VIETNAMESE_SALES_VOICES = [
  // ==========================================
  // 1. MIỀN NAM (SÀI GÒN PHỒN HOA) - 8 NHÂN VẬT ĐỈNH CAO
  // ==========================================
  {
    id: 'vn_sales_mypham_trangda',
    name: 'Minh Thảo 👑 (Nữ Trẻ - Mỹ Phẩm & Dưỡng Trắng Skincare [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Mỹ Phẩm & Skincare • Miền Nam',
    pitch: 1.24,
    rate: 1.12,
    recommendedFor: 'both',
    desc: 'Giọng nữ Sài Gòn trẻ trung, ngọt ngào, quyến rũ, am hiểu chuyên sâu về kem dưỡng, serum, son môi và mỹ phẩm Hàn Quốc.',
    sampleText: 'Dạ nè chị em ơi! Da căng bóng mịn màng chuẩn gái Hàn luôn nha! Hôm nay shop em trợ giá voucher giảm tới 40% lận, mấy chế chốt liền tay trong giỏ hàng góc trái nha!',
    edgePitch: '+22%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.8, rate: 1.12, lowGain: -2.0, midFreq: 1420, midGain: 3.2, presenceFreq: 4200, presenceGain: 6.2, highGain: 5.2 }
  },
  {
    id: 'vn_sales_congnghe_genz',
    name: 'Hoàng Nam 👑 (Nam Trẻ - Smartphone, Laptop Gaming & Phụ Kiện [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Công Nghệ & Smartphone • Miền Nam',
    pitch: 0.82,
    rate: 1.18,
    recommendedFor: 'both',
    desc: 'Giọng nam Sài Gòn trẻ trung, tốc độ, am hiểu sâu về cấu hình gaming, iPhone, laptop, tai nghe chống ồn.',
    sampleText: 'Màn hình 120Hz siêu mượt, quất chip Snapdragon thế hệ mới cân mọi tựa game max setting mát rượi anh em ơi! Giá sale sốc độc quyền duy nhất phiên live tối nay, quẹo lựa quẹo lựa nha!',
    edgePitch: '-8%',
    edgeRate: '+18%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -6.5, rate: 1.18, lowGain: 7.5, midFreq: 580, midGain: 3.8, presenceFreq: 2600, presenceGain: 1.5, highGain: -1.5 }
  },
  {
    id: 'vn_sales_chotdeal_livestream_nam',
    name: 'Quốc Tuấn 👑 (Nam Trẻ - Chốt Deal TikTok Shop Siêu Tốc [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Chốt Deal Livestream • Miền Nam',
    pitch: 0.88,
    rate: 1.25,
    recommendedFor: 'manager',
    desc: 'Giọng nam Sài Gòn hối hả giục đơn, năng lượng bùng nổ, thúc đẩy người xem bấm nút mua hàng ngay tức thì.',
    sampleText: 'Chỉ còn đúng 15 suất quà tặng độc quyền trong giỏ hàng thôi anh em ơi! Bấm vô mua liền tay kẻo hệ thống khóa deal giá hời nha, đếm ngược 3, 2, 1 chốt liền chốt liền!',
    edgePitch: '+8%',
    edgeRate: '+25%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -5.0, rate: 1.25, lowGain: 6.0, midFreq: 640, midGain: 4.2, presenceFreq: 2800, presenceGain: 3.0, highGain: 0.0 }
  },
  {
    id: 'vn_sales_mevabe_diudang',
    name: 'Bảo Trân 👑 (Nữ Trẻ - Mẹ & Bé, Bỉm Sữa Hữu Cơ Dinh Dưỡng [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Mẹ & Bé • Miền Nam',
    pitch: 1.18,
    rate: 1.08,
    recommendedFor: 'idol',
    desc: 'Giọng nữ mẹ bỉm Sài Gòn ấm áp, thấu cảm, tư vấn tã bỉm hữu cơ, sữa tăng chiều cao và đồ dùng cho bé.',
    sampleText: 'Dạ chất liệu bông hữu cơ mềm mại nâng niu làn da non nớt của bé yêu nè mẹ ơi, thấm hút siêu khô thoáng suốt 12 tiếng, mẹ yên tâm tuyệt đối nha!',
    edgePitch: '+16%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 2.8, rate: 1.08, lowGain: -1.2, midFreq: 1280, midGain: 2.8, presenceFreq: 3750, presenceGain: 5.0, highGain: 3.8 }
  },
  {
    id: 'vn_sales_thethao_fitness',
    name: 'Cường Kevin 👑 (Nam Trẻ - Gym Fitness, Whey Protein & Thể Hình [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Thể Thao & Gym Fitness • Miền Nam',
    pitch: 0.80,
    rate: 1.22,
    recommendedFor: 'both',
    desc: 'Giọng nam HLV thể hình Sài Gòn tràn trề cơ bắp và năng lượng, tư vấn whey protein, creatine, máy tập.',
    sampleText: 'Bứt phá giới hạn, siết cơ giảm mỡ cực đỉnh với dòng whey protein tinh khiết hấp thu siêu tốc anh em ơi! Uống vô là tràn trề sinh lực, đặt liền tay có quà nha!',
    edgePitch: '-12%',
    edgeRate: '+16%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -6.2, rate: 1.22, lowGain: 8.0, midFreq: 620, midGain: 4.0, presenceFreq: 2450, presenceGain: 1.2, highGain: -2.0 }
  },
  {
    id: 'vn_sales_noithat_kientruc',
    name: 'Chí Bảo 👑 (Nam Trung Niên 45t - Nội Thất Gỗ & Thiết Kế Nhà Phố [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Nội Thất & Kiến Trúc • Miền Nam',
    pitch: 0.75,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nam kiến trúc sư trung niên 45 tuổi đĩnh đạc, tư vấn bàn ghế sofa da bò Ý, tủ gỗ óc chó tự nhiên và không gian sống đẳng cấp.',
    sampleText: 'Dạ nội thất gỗ óc chó tự nhiên nguyên khối gia công tỉ mỉ từng chi tiết, đường nét sang trọng kiến tạo không gian sống đẳng cấp cho tổ ấm của gia đình mình anh chị nha.',
    edgePitch: '-16%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.5, rate: 1.02, lowGain: 9.0, midFreq: 460, midGain: 3.5, presenceFreq: 2150, presenceGain: -1.0, highGain: -3.5 }
  },
  {
    id: 'vn_sales_dongho_quyba_saigon',
    name: 'Bích Loan 👑 (Nữ Quý Bà 48t - Trang Sức Kim Cương, Nước Hoa Niche [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Trang Sức & Nước Hoa VIP • Miền Nam',
    pitch: 1.05,
    rate: 0.98,
    recommendedFor: 'idol',
    desc: 'Giọng nữ quý bà thành đạt 48 tuổi đài các, sang trọng, am hiểu trang sức đá quý, kim cương và nước hoa niche cao cấp.',
    sampleText: 'Mùi hương nước hoa niche quý phái lưu hương trên 12 tiếng nè quý cô ơi, toát lên thần thái sang trọng, quyến rũ và đẳng cấp độc bản của người phụ nữ thành đạt nha.',
    edgePitch: '-4%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 0.8, rate: 0.98, lowGain: 1.5, midFreq: 1150, midGain: 2.2, presenceFreq: 3200, presenceGain: 3.2, highGain: 2.0 }
  },
  {
    id: 'vn_sales_ongtu_saigon_xua',
    name: 'Ông Bảy Sài Gòn 👑 (Nam Lão Niên 65t - Thuốc Xương Khớp & Trà Thảo Mộc Gia Truyền [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Sức Khỏe & Thảo Mộc Lão Niên • Miền Nam',
    pitch: 0.68,
    rate: 0.92,
    recommendedFor: 'both',
    desc: 'Giọng ông cụ 65 tuổi phúc hậu, từng trải, chân thành chia sẻ bài thuốc xương khớp gia truyền và trà thảo mộc dưỡng sinh.',
    sampleText: 'Bà con mình ai đau lưng mỏi gối, đi đứng khó khăn thì uống thảo dược gia truyền này mỗi tối nghen, khí huyết lưu thông, ngủ một mạch tới sáng khỏe re bà con nha!',
    edgePitch: '-24%',
    edgeRate: '-14%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -9.0, rate: 0.92, lowGain: 10.5, midFreq: 380, midGain: 4.0, presenceFreq: 1800, presenceGain: -2.0, highGain: -5.0 }
  },

  // ==========================================
  // 2. MIỀN BẮC (HÀ NỘI KINH KỲ & ĐÔNG TÂY BẮC) - 8 NHÂN VẬT ĐỈNH CAO
  // ==========================================
  {
    id: 'vn_sales_thoitrang_congso',
    name: 'Mai Phương 👑 (Nữ Trẻ - Thời Trang Công Sở & Đầm Thiết Kế [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Thời Trang & May Mặc • Miền Bắc',
    pitch: 1.20,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng nữ Hà Nội thanh lịch, chuẩn mực, tư vấn đầm thiết kế cao cấp, váy công sở và phụ kiện thời trang.',
    sampleText: 'Dạ vâng, chất vải lụa tơ tằm cao cấp mềm mát chống nhăn, form dáng tôn eo thanh lịch chuẩn quý cô Hà Thành diện đi làm hay dự tiệc đều sang hết nấc nhé các chị đẹp ơi!',
    edgePitch: '+18%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.2, rate: 1.10, lowGain: -1.5, midFreq: 1350, midGain: 3.0, presenceFreq: 4100, presenceGain: 5.8, highGain: 4.8 }
  },
  {
    id: 'vn_sales_oto_xediahinh',
    name: 'Tuấn Hưng 👑 (Nam Trẻ - Ô Tô, Phụ Kiện Xe Hơi & Đồ Chơi Xe [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Ô Tô & Xe Sang • Miền Bắc',
    pitch: 0.84,
    rate: 1.14,
    recommendedFor: 'both',
    desc: 'Giọng nam Hà Nội tự tin, am hiểu xe hơi, phụ kiện camera hành trình 4K, phim cách nhiệt và đồ chơi xe sang.',
    sampleText: 'Trang bị camera hành trình 4K quay đêm siêu nét, tích hợp cảnh báo giao thông giọng nói thông minh, các bác tài lái xe đường dài cứ gọi là an tâm tuyệt đối nhé!',
    edgePitch: '-6%',
    edgeRate: '+10%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -5.8, rate: 1.14, lowGain: 7.0, midFreq: 600, midGain: 3.5, presenceFreq: 2500, presenceGain: 1.8, highGain: -1.0 }
  },
  {
    id: 'vn_sales_bds_trieudo',
    name: 'Minh Trí 👑 (Nam Doanh Nhân 42t - Bất Động Sản Biệt Thự & Căn Hộ VIP [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Bất Động Sản Triệu Đô • Miền Bắc',
    pitch: 0.76,
    rate: 1.00,
    recommendedFor: 'both',
    desc: 'Giọng nam chuyên gia bất động sản 42 tuổi trầm ấm, uy lực, tạo niềm tin lớn cho các thương vụ biệt thự triệu đô.',
    sampleText: 'Vị trí kim cương trung tâm đắc địa, pháp lý minh bạch sổ đỏ trao tay, tiềm năng sinh lời và tăng giá vượt trội cho các nhà đầu tư thông thái thưa quý vị.',
    edgePitch: '-14%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.2, rate: 1.00, lowGain: 8.5, midFreq: 480, midGain: 3.6, presenceFreq: 2300, presenceGain: 0.5, highGain: -2.5 }
  },
  {
    id: 'vn_sales_bacsi_duocpham',
    name: 'Bác Sĩ Trọng 👑 (Nam Bác Sĩ 50t - Dược Phẩm & TPCN Chuẩn Y Khoa [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Dược Phẩm & Y Khoa • Miền Bắc',
    pitch: 0.74,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nam bác sĩ chuyên khoa điềm đạm, khoa học, tạo niềm tin tuyệt đối cho người mua hàng.',
    sampleText: 'Sản phẩm đạt chuẩn GMP của Bộ Y Tế, thành phần chiết xuất tự nhiên lành tính giúp tăng cường sức đề kháng và bảo vệ sức khỏe toàn diện cho cả gia đình thưa các bác.',
    edgePitch: '-12%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.8, rate: 1.04, lowGain: 9.0, midFreq: 450, midGain: 3.6, presenceFreq: 2200, presenceGain: -1.0, highGain: -3.5 }
  },
  {
    id: 'vn_sales_phongthuy_tramhuong',
    name: 'Hương Lan 👑 (Nữ Quý Cô 46t - Trầm Hương Phong Thủy & Đá Quý [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Trang Sức & Phong Thủy • Miền Bắc',
    pitch: 1.08,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ đằm thắm, sang trọng, tư vấn vòng tay trầm hương, ngọc bích, vàng bạc chiêu tài hút lộc.',
    sampleText: 'Trầm hương tự nhiên tích tụ linh khí đất trời, mang lại vượng khí bình an và may mắn tài lộc cho chủ nhân sở hữu, kính mời các anh chị chiêm ngưỡng ạ.',
    edgePitch: '-4%',
    edgeRate: '-8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 1.2, rate: 1.04, lowGain: 0.8, midFreq: 1080, midGain: 2.4, presenceFreq: 3300, presenceGain: 3.8, highGain: 2.5 }
  },
  {
    id: 'vn_sales_giadung_thongminh',
    name: 'Phương Thảo 👑 (Nữ Trẻ - Gia Dụng Thông Minh, Nồi Chiên & Robot Hút Bụi [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Gia Dụng & Đời Sống • Miền Bắc',
    pitch: 1.22,
    rate: 1.12,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Hà Nội tươi tắn, gần gũi, chuyên review nồi chiên không dầu, robot hút bụi và thiết bị gia đình thông minh.',
    sampleText: 'Nồi chiên không dầu dung tích lớn với công nghệ nhiệt đối lưu 360 độ giúp món ăn chín vàng giòn rụm mà giảm đến 85% lượng dầu mỡ thừa nhé các mẹ ơi!',
    edgePitch: '+18%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.4, rate: 1.12, lowGain: -1.6, midFreq: 1380, midGain: 3.0, presenceFreq: 4150, presenceGain: 5.6, highGain: 4.6 }
  },
  {
    id: 'vn_sales_cuong_traco',
    name: 'Cụ Ông Phúc 👑 (Nam Lão Niên 68t - Trà Shan Tuyết Cổ Thụ & Gốm Sứ Bát Tràng [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Trà Đạo & Gốm Sứ Cổ Truyền • Miền Bắc',
    pitch: 0.65,
    rate: 0.90,
    recommendedFor: 'both',
    desc: 'Giọng cụ ông 68 tuổi trầm ấm, đượm nét văn hóa kinh kỳ, am hiểu sâu sắc về nghệ thuật thưởng trà và gốm sứ cổ.',
    sampleText: 'Búp trà Shan tuyết cổ thụ ngậm sương non trên đỉnh Tây Côn Lĩnh, hương thơm thanh khiết tiền chát hậu ngọt lắng sâu, kính mời các bác cùng đàm đạo thưởng trà ạ.',
    edgePitch: '-26%',
    edgeRate: '-16%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -9.5, rate: 0.90, lowGain: 11.0, midFreq: 360, midGain: 4.2, presenceFreq: 1750, presenceGain: -2.5, highGain: -5.5 }
  },
  {
    id: 'vn_sales_baphuong_dongy',
    name: 'Bà Cụ Thoa 👑 (Nữ Lão Niên 66t - Bột Sắn Dây & Ô Mai Cổ Truyền [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Đặc Sản Cổ Truyền Lão Niên • Miền Bắc',
    pitch: 0.96,
    rate: 0.92,
    recommendedFor: 'idol',
    desc: 'Giọng bà cụ 66 tuổi phúc hậu, từ tốn, tư vấn bột sắn ướp hoa bưởi, ô mai Hàng Đường gia truyền chuẩn vị phố cổ.',
    sampleText: 'Bột sắn dây nguyên chất ướp hương hoa bưởi thanh mát, mùa hè khuấy một bát giải nhiệt, thanh lọc cơ thể rất tốt cho sức khỏe các bác và các cháu nhé.',
    edgePitch: '-10%',
    edgeRate: '-12%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: -0.8, rate: 0.92, lowGain: 3.5, midFreq: 920, midGain: 2.0, presenceFreq: 2800, presenceGain: 2.0, highGain: 0.5 }
  },

  // ==========================================
  // 3. MIỀN TRUNG (HUẾ CỐ ĐÔ, ĐÀ NẴNG, NGHỆ AN, QUẢNG NAM) - 6 NHÂN VẬT ĐỈNH CAO
  // ==========================================
  {
    id: 'vn_sales_dacsanhue_ngocan',
    name: 'Ngọc Hân 👑 (Nữ Trẻ - Trà Cung Đình & Đặc Sản Cố Đô [Huế])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Đặc Sản Cố Đô • Miền Trung',
    pitch: 1.15,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Huế dịu dàng, ngọt ngào, say đắm, tư vấn trà Cung Đình Huế, mè xửng giòn rụm và nón bài thơ.',
    sampleText: 'Dạ thưa quý anh chị, ghé thăm xứ Huế mộng mơ nì, nhấp một ngụm trà Cung Đình thanh ngọt thơm lừng, đậm đà nghĩa tình miền Trung xứ Huế thương nì!',
    edgePitch: '+12%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 2.2, rate: 1.02, lowGain: -0.5, midFreq: 1250, midGain: 2.6, presenceFreq: 3800, presenceGain: 4.8, highGain: 3.6 }
  },
  {
    id: 'vn_sales_dulich_resort',
    name: 'Yến Nhi 👑 (Nữ Trẻ - Vé Máy Bay, Tour Du Lịch & Resort 5 Sao [Đà Nẵng])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Du Lịch & Nghỉ Dưỡng • Miền Trung',
    pitch: 1.20,
    rate: 1.12,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Đà Nẵng năng động, hiếu khách, tư vấn combo du lịch Bà Nà Hills, Hội An, vé máy bay và resort biển.',
    sampleText: 'Combo nghỉ dưỡng 3 ngày 2 đêm tại resort 5 sao view biển Đà Nẵng cực đẹp nì mọi người ơi, bao trọn vé máy bay khứ hồi và buffet sáng sang chảnh giá hời lắm nì!',
    edgePitch: '+16%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.0, rate: 1.12, lowGain: -1.2, midFreq: 1320, midGain: 2.8, presenceFreq: 3950, presenceGain: 5.2, highGain: 4.2 }
  },
  {
    id: 'vn_sales_haisan_danang',
    name: 'Văn Hào 👑 (Nam Trẻ - Hải Sản Tươi Sống & Chả Bò Đà Nẵng [Đà Nẵng])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Hải Sản & Đặc Sản Biển • Miền Trung',
    pitch: 0.85,
    rate: 1.16,
    recommendedFor: 'both',
    desc: 'Giọng nam Đà Nẵng khỏe khoắn, hào sảng miền biển, tư vấn mực một nắng, chả bò cây nguyên chất và tôm cá tươi.',
    sampleText: 'Chả bò Đà Nẵng loại 1 nguyên chất 100% không hàn the, thơm lừng mùi tiêu sọ, cắn ngập răng giòn sần sật bao ngon bao chuẩn vị miền Trung nì anh em ơi!',
    edgePitch: '-4%',
    edgeRate: '+14%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -5.5, rate: 1.16, lowGain: 6.8, midFreq: 620, midGain: 3.6, presenceFreq: 2550, presenceGain: 2.0, highGain: -0.8 }
  },
  {
    id: 'vn_sales_giochame_nghean',
    name: 'Hải Đăng 👑 (Nam Trung Niên 42t - Giò Me Nam Đàn & Tương Sa Nam [Nghệ An])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Đặc Sản Xứ Nghệ • Miền Trung',
    pitch: 0.78,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nam xứ Nghệ chân tình, mộc mạc, chất phác, tư vấn giò bê Nam Đàn, tương Sa Nam và kẹo cu đơ Hà Tĩnh.',
    sampleText: 'Giò me Nam Đàn thịt bê tươi mềm ngọt tự nhiên, bì giòn thơm phức tiêu rừng, làm mồi nhậu hay quà biếu tết thì ngon hết ý bà con xứ Nghệ mình ơi!',
    edgePitch: '-10%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -6.8, rate: 1.04, lowGain: 8.0, midFreq: 500, midGain: 3.4, presenceFreq: 2350, presenceGain: 0.8, highGain: -2.0 }
  },
  {
    id: 'vn_sales_thaylang_quangnam',
    name: 'Thầy Lang Thọ 👑 (Nam Lão Niên 62t - Dầu Tràm & Thảo Dược Cung Đình [Huế])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Thảo Dược Dân Gian Lão Niên • Miền Trung',
    pitch: 0.68,
    rate: 0.94,
    recommendedFor: 'both',
    desc: 'Giọng thầy lang cao tuổi xứ Huế điềm đạm, ấm cúng, tư vấn tinh dầu tràm nguyên chất, cao xoa bóp thảo dược bí truyền.',
    sampleText: 'Dầu tràm Huế nguyên chất nấu thủ công giữ trọn tinh dầu tràm gió, giữ ấm cho mẹ và bé, xoa bóp đau nhức xương khớp công hiệu vô cùng thưa bà con nì.',
    edgePitch: '-22%',
    edgeRate: '-12%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -8.8, rate: 0.94, lowGain: 10.0, midFreq: 400, midGain: 3.8, presenceFreq: 1900, presenceGain: -1.5, highGain: -4.5 }
  },
  {
    id: 'vn_sales_yensao_quangnam',
    name: 'Cô Nguyệt 👑 (Nữ Trung Niên 52t - Yến Sào Rút Lông & Sâm Ngọc Linh [Quảng Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Yến Sào & Sâm Quý VIP • Miền Trung',
    pitch: 1.06,
    rate: 0.98,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trung niên 52 tuổi ấm áp, phúc hậu xứ Quảng, tư vấn tổ yến tinh chế, yến rút lông nguyên tổ và sâm Ngọc Linh đại bổ.',
    sampleText: 'Tổ yến đảo thiên nhiên nguyên chất sợi yến dai nở nhiều nì, giàu protein và khoáng chất bồi bổ sức khỏe cho cha mẹ, bà con đặt hàng kiểm tra ưng ý mới thanh toán nì.',
    edgePitch: '-2%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 1.0, rate: 0.98, lowGain: 1.2, midFreq: 1100, midGain: 2.4, presenceFreq: 3300, presenceGain: 3.5, highGain: 2.2 }
  },

  // ==========================================
  // 4. MIỀN TÂY (ĐỒNG BẰNG SÔNG CỬU LONG DÂN DÃ) - 8 NHÂN VẬT ĐỈNH CAO
  // ==========================================
  {
    id: 'vn_sales_saurieng_bentre',
    name: 'Cô Út Sầu Riêng 👑 (Nữ Trẻ - Sầu Riêng Ri6 & Trái Cây Miệt Vườn [Bến Tre])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Trái Cây Miệt Vườn • Miền Tây',
    pitch: 1.22,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng cô Út Bến Tre ngọt lịm như mía lùi, dễ thương, bán sầu riêng Ri6, chôm chôm, bưởi da xanh bao ăn từng múi.',
    sampleText: 'Dạ nè bà con cô bác ơi! Sầu riêng Ri6 Bến Tre cơm vàng hạt lép bao ngọt béo ngậy, shop em bao ăn một đổi một nếu sượng, bà con nhanh tay đặt hàng liền nghen!',
    edgePitch: '+20%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.5, rate: 1.10, lowGain: -1.8, midFreq: 1400, midGain: 3.2, presenceFreq: 4200, presenceGain: 6.0, highGain: 5.0 }
  },
  {
    id: 'vn_sales_khoca_mientay',
    name: 'Hai Lúa Miệt Vườn 👑 (Nam Trẻ - Khô Cá Lóc, Khô Cá Sặc Bổi [Cần Thơ])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Đặc Sản Khô & Mắm • Miền Tây',
    pitch: 0.82,
    rate: 1.14,
    recommendedFor: 'both',
    desc: 'Giọng nam miền Tây chân chất, rộn ràng tiếng cười, tư vấn khô cá lóc đồng, mắm cá linh, mắm tép xịn xò.',
    sampleText: 'Khô cá lóc đồng miền Tây ướp vừa ăn, phơi đủ ba nắng vàng ươm, nướng lên chấm mắm me cay ngọt thì nhức nách luôn á anh em ơi, quẹo lựa nghen!',
    edgePitch: '-8%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -6.0, rate: 1.14, lowGain: 7.2, midFreq: 590, midGain: 3.6, presenceFreq: 2500, presenceGain: 1.6, highGain: -1.2 }
  },
  {
    id: 'vn_sales_banhpia_soctrang',
    name: 'Út Diệu 👑 (Nữ Trẻ - Bánh Pía Trứng Muối & Lạp Xưởng Tươi [Sóc Trăng])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Bánh Kẹo Đặc Sản • Miền Tây',
    pitch: 1.25,
    rate: 1.08,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Sóc Trăng tươi rói, ngọt ngào duyên dáng, tư vấn bánh pía sầu riêng trứng muối, lạp xưởng Mai Quế Lộ.',
    sampleText: 'Bánh pía Sóc Trăng vỏ mỏng nhiều lớp ôm trọn nhân sầu riêng tươi béo ngậy và trứng muối đỏ au nè, ăn vô là nhớ mãi hương vị ngọt ngào quê em nghen!',
    edgePitch: '+22%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 3.8, rate: 1.08, lowGain: -2.0, midFreq: 1450, midGain: 3.2, presenceFreq: 4300, presenceGain: 6.2, highGain: 5.2 }
  },
  {
    id: 'vn_sales_matong_dongthap',
    name: 'Bác Ba Thành 👑 (Nam Trung Niên 54t - Mật Ong Rừng Tràm & Sen Tháp Mười [Đồng Tháp])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Mật Ong & Nông Sản Sạch • Miền Tây',
    pitch: 0.74,
    rate: 1.00,
    recommendedFor: 'both',
    desc: 'Giọng bác Ba 54 tuổi mộc mạc đậm chất nông dân Đồng Tháp, tư vấn mật ong hoa tràm nguyên chất, hạt sen tươi sấy giòn.',
    sampleText: 'Mật ong rừng tràm U Minh nguyên chất vàng sánh, thơm lừng mùi hoa tràm tự nhiên, bồi bổ sức khỏe cho người lớn tuổi và trẻ nhỏ rất tốt nghen bà con cô bác mình.',
    edgePitch: '-16%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.6, rate: 1.00, lowGain: 8.8, midFreq: 460, midGain: 3.5, presenceFreq: 2200, presenceGain: 0.0, highGain: -3.0 }
  },
  {
    id: 'vn_sales_cuabien_camau',
    name: 'Cô Ba Cà Mau 👑 (Nữ Trung Niên 49t - Cua Biển Năm Căn & Tôm Khô Rạch Gốc [Cà Mau])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Hải Sản & Cua Cà Mau • Miền Tây',
    pitch: 1.08,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng cô Ba 49 tuổi hào sảng, xởi lởi, nhiệt tình, tư vấn cua gạch Năm Căn chắc nịch, tôm khô đất sinh thái cao cấp.',
    sampleText: 'Cua gạch Năm Căn chính gốc Cà Mau thịt chắc ngọt lịm gạch son đầy ắp nè, bao trói dây không trọng lượng, nhận hàng mở ra kiểm tra thoải mái nghen bà con!',
    edgePitch: '+0%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 1.5, rate: 1.02, lowGain: 0.5, midFreq: 1180, midGain: 2.6, presenceFreq: 3400, presenceGain: 4.0, highGain: 2.8 }
  },
  {
    id: 'vn_sales_gao_st25_angiang',
    name: 'Ông Năm Lão Nông 👑 (Nam Lão Niên 67t - Gạo Thơm ST25 & Mắm Châu Đốc [An Giang])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Gạo Ngon & Nông Sản Lão Nông • Miền Tây',
    pitch: 0.66,
    rate: 0.90,
    recommendedFor: 'both',
    desc: 'Giọng lão nông 67 tuổi thật thà, đôn hậu xứ Bảy Núi An Giang, tư vấn gạo ngon nhất thế giới ST25 và mắm cá lóc Châu Đốc.',
    sampleText: 'Gạo ST25 chính gốc hạt dài trắng trong, cơm dẻo thơm phức mùi lá dứa tự nhiên, để nguội vẫn mềm ngon chuẩn vị lúa thơm miệt vườn nghen con cháu mình.',
    edgePitch: '-25%',
    edgeRate: '-15%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -9.2, rate: 0.90, lowGain: 10.8, midFreq: 370, midGain: 4.0, presenceFreq: 1800, presenceGain: -2.0, highGain: -5.0 }
  },
  {
    id: 'vn_sales_mutduanon_tiengiang',
    name: 'Bà Ngoại Út Lành 👑 (Nữ Lão Niên 68t - Mứt Dừa Non & Kẹo Dừa Bến Tre [Tiền Giang])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Mứt Quê & Bánh Mứt Lão Niên • Miền Tây',
    pitch: 0.98,
    rate: 0.90,
    recommendedFor: 'both',
    desc: 'Giọng bà ngoại 68 tuổi ân cần, ấm áp hiền từ, tư vấn mứt dừa non sên tay lá dứa, kẹo chuối gừng truyền thống đậm đà tình quê.',
    sampleText: 'Mứt dừa non làm từ cơm dừa dẻo mềm sên đường phèn ít ngọt, nhai dẻo béo ngậy thơm lừng mùi lá dứa quê nhà, ăn hoài hổng thấy ngán đâu nghen con cháu.',
    edgePitch: '-8%',
    edgeRate: '-14%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: -0.5, rate: 0.90, lowGain: 3.0, midFreq: 950, midGain: 2.2, presenceFreq: 2900, presenceGain: 2.2, highGain: 0.8 }
  },
  {
    id: 'vn_sales_buoidaxanh_vinhlong',
    name: 'Chú Sáu Vườn Bưởi 👑 (Nam Trung Niên 52t - Bưởi Da Xanh & Vú Sữa Lò Rèn [Vĩnh Long])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Bưởi Da Xanh & Cây Trái • Miền Tây',
    pitch: 0.73,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng chú Sáu 52 tuổi chủ vườn bưởi Vĩnh Long cởi mở, chân chất, cam kết bưởi da xanh múi hồng mọng nước ngọt thanh không hạt.',
    sampleText: 'Bưởi da xanh hái tận vườn tép bưởi mọng nước ngọt thanh ráo trọi, bao ngọt lịm từng múi, đặt hàng hôm nay nhà vườn chú Sáu ship tận nơi nghen bà con cô bác!',
    edgePitch: '-15%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { semitones: -7.8, rate: 1.02, lowGain: 9.0, midFreq: 450, midGain: 3.5, presenceFreq: 2200, presenceGain: -0.5, highGain: -3.2 }
  }
];

// ==================== 4. BỘ 20 GIỌNG AI TIẾNG VIỆT SIÊU CAO CẤP HOT TREND (TIKTOK / YOUTUBE / LIVESTREAM / CINEMATIC) ====================
export const VIETNAMESE_HOTTREND_VOICES = [
  {
    id: 'hottrend_adam',
    name: 'Adam 👑 (Nam Authority - Bán Hàng, Review & Storytelling Mạnh)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'standard',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Authority & Bán Hàng VIP',
    pitch: 0.92,
    rate: 0.96,
    recommendedFor: 'both',
    desc: 'Giọng nam trung niên đĩnh đạc, trầm ấm, quyền lực, nói chắc nịch có trọng lượng, chuyên trị video review, chốt sale tài chính và trailer.',
    sampleText: 'Đừng bao giờ lãng phí ngân sách vào những giải pháp nửa vời. Đây chính là bước đột phá duy nhất giúp bạn nhân ba doanh số ngay hôm nay!',
    edgePitch: '-8%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 3.5, midFreq: 1100, midGain: 2.2, presenceFreq: 3400, presenceGain: 3.8, highGain: 1.5, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_brian',
    name: 'Brian 👑 (Nam Creator Tự Nhiên - YouTube, TikTok, Vlog Đời Sống)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Creator & Vlog Tự Nhiên',
    pitch: 0.96,
    rate: 0.99,
    recommendedFor: 'both',
    desc: 'Giọng nam creator đối thoại tự nhiên như đang ngồi nói chuyện trực tiếp trước ống kính, chân thành, cuốn hút và rất gần gũi.',
    sampleText: 'Chào mọi người, hôm nay mình sẽ giải mã một bí mật mà rất ít creator dám chia sẻ thật với các bạn trên mạng xã hội nè!',
    edgePitch: '-4%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1200, midGain: 2.0, presenceFreq: 3600, presenceGain: 3.5, highGain: 2.0, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_liam',
    name: 'Liam 👑 (Nam Trẻ Bắt Trend - Shorts, Reels, Review Công Nghệ)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Viral Shorts & Công Nghệ',
    pitch: 1.04,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nam trẻ trung, bắt tai, nhịp điệu nhanh, nhấn nhá từ khóa đắt giá, chuyên trị video ngắn triệu view TikTok và Shorts.',
    sampleText: 'Dừng lại 3 giây lướt TikTok ngay! Chiếc máy này vừa phá đảo toàn bộ phân khúc giá rẻ với hiệu năng không thể tin nổi anh em ơi!',
    edgePitch: '+4%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1350, midGain: 2.5, presenceFreq: 3900, presenceGain: 4.2, highGain: 2.5, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_jessica',
    name: 'Jessica 👑 (Nữ Social & Lifestyle - Mỹ Phẩm, Thời Trang & Bán Hàng)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Mỹ Phẩm & Lifestyle Social',
    pitch: 1.10,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng nữ ngọt ngào, nữ tính, rạng rỡ, tự tin, chuyên tư vấn skincare, thời trang và trình bày sản phẩm trên livestream.',
    sampleText: 'Dạ em chào cả nhà yêu nha! Tone màu son này đánh lên là tôn da cực kỳ, vừa sang vừa ngọt ngào, mấy nàng rinh liền tay kẻo hết size nha!',
    edgePitch: '+10%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.0, midFreq: 1400, midGain: 2.5, presenceFreq: 4000, presenceGain: 4.5, highGain: 3.0, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_matilda',
    name: 'Matilda 👑 (Nữ Trưởng Thành Sang Trọng - Luxury, Story & Kể Chuyện)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Luxury & Storytelling Sang Trọng',
    pitch: 1.02,
    rate: 0.96,
    recommendedFor: 'both',
    desc: 'Giọng nữ quý phái, đằm thắm, sang trọng chuẩn quý cô cao cấp, chuyên dùng cho sản phẩm luxury, giáo dục và video chiều sâu.',
    sampleText: 'Sự tinh tế không nằm ở vẻ phô trương, mà ẩn hiện trong từng chi tiết thủ công hoàn hảo và giá trị vượt thời gian.',
    edgePitch: '+2%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1250, midGain: 2.2, presenceFreq: 3700, presenceGain: 3.8, highGain: 2.2, reverb: 0.06, reverbDecay: 0.4 }
  },
  {
    id: 'hottrend_sarah',
    name: 'Sarah 👑 (Nữ Gần Gũi & Sincere - Tâm Sự, CSKH & Sales Mềm)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Tâm Sự & Chăm Sóc Khách Hàng',
    pitch: 1.06,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ ấm áp, chân thành, mềm mại, giàu cảm xúc, tạo cảm giác tin cậy tuyệt đối và thư thái cho người nghe.',
    sampleText: 'Cảm ơn bạn đã luôn đồng hành cùng chúng mình. Dù ngày hôm nay có mệt mỏi thế nào, hãy nhớ bạn luôn xứng đáng được yêu thương nhé.',
    edgePitch: '+6%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1300, midGain: 2.0, presenceFreq: 3800, presenceGain: 3.6, highGain: 2.5, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_trieuduong',
    name: 'Triệu Dương 👑 (Nam Trầm Lắng & Resonant - Phim, Documentary & Tài Chính)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Documentary & Tài Chính VIP',
    pitch: 0.86,
    rate: 0.94,
    recommendedFor: 'both',
    desc: 'Giọng nam Việt âm vực trầm sâu tự nhiên, bình tĩnh, vang vọng lồng ngực đĩnh đạc, hoàn hảo cho phim tài liệu, thương hiệu lớn và tài chính.',
    sampleText: 'Trên hành trình kiến tạo những công trình vĩ đại, sự kiên định và bản lĩnh tiên phong là chìa khóa mở lối cho mọi thành công.',
    edgePitch: '-14%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 4.0, midFreq: 950, midGain: 2.5, presenceFreq: 3200, presenceGain: 3.5, highGain: 1.0, reverb: 0.06, reverbDecay: 0.4 }
  },
  {
    id: 'hottrend_trungcaha',
    name: 'Trung Caha 👑 (Nam Rõ Chắc & Informative - Bản Tin, Giáo Dục & Kiến Thức)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Kiến Thức & Bản Tin Chuyên Sâu',
    pitch: 0.94,
    rate: 0.97,
    recommendedFor: 'both',
    desc: 'Giọng nam phát âm chuẩn chỉ từng phụ âm, đĩnh đạc, rõ ràng, giàu tính thông tin và uy tín khoa học.',
    sampleText: 'Sau đây là phân tích toàn diện và chi tiết nhất về cơ chế hoạt động thực sự mà mọi người cần nắm rõ trước khi bắt đầu.',
    edgePitch: '-6%',
    edgeRate: '-3%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 2.2, midFreq: 1200, midGain: 2.4, presenceFreq: 3500, presenceGain: 4.0, highGain: 1.8, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_kenh',
    name: 'Kênh Social 👑 (Nam Đa Năng - Review Đại Chúng & Kênh Tổng Hợp)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Social & Review Đại Chúng',
    pitch: 0.98,
    rate: 1.0,
    recommendedFor: 'both',
    desc: 'Giọng nam đa năng, cân bằng, nói chuyện tự nhiên, dễ nghe, phù hợp với mọi thể loại nội dung số trên TikTok và YouTube.',
    sampleText: 'Đừng quên bấm theo dõi kênh để không bỏ lỡ những video thú vị và cập nhật hữu ích mỗi ngày nha mọi người!',
    edgePitch: '-2%',
    edgeRate: '0%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1200, midGain: 2.0, presenceFreq: 3500, presenceGain: 3.5, highGain: 2.0, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_huyen',
    name: 'Huyền 👑 (Nữ Dịu Dàng, Calm & Clear - CSKH, Giáo Dục & Gia Đình)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'CSKH & Giáo Dục Tận Tâm',
    pitch: 1.08,
    rate: 0.96,
    recommendedFor: 'idol',
    desc: 'Giọng nữ êm đềm, hòa nhã, phát âm tròn trịa, tạo cảm giác an tâm, chuyên dùng cho chăm sóc khách hàng và khóa học.',
    sampleText: 'Dạ em chào anh chị ạ, mọi thắc mắc của mình đều đã được hệ thống ghi nhận và hỗ trợ xử lý chu đáo nhất ngay bây giờ nhé ạ.',
    edgePitch: '+8%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1350, midGain: 2.2, presenceFreq: 3800, presenceGain: 3.8, highGain: 2.5, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_tungdang',
    name: 'Tùng Đặng 👑 (Nam Warm & Resonant - Thương Hiệu Lớn & Chốt Sale VIP)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Thương Hiệu & Chốt Deal VIP',
    pitch: 0.88,
    rate: 0.94,
    recommendedFor: 'manager',
    desc: 'Giọng nam dầy ấm thượng lưu, âm trầm đầy nội lực và sức thuyết phục, chuyên gia định vị thương hiệu và chốt deal tiền tỷ.',
    sampleText: 'Sở hữu ngay cơ hội đầu tư vượt trội hôm nay để khẳng định vị thế và kiến tạo di sản bền vững cho tương lai.',
    edgePitch: '-12%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 4.2, midFreq: 900, midGain: 2.6, presenceFreq: 3200, presenceGain: 3.6, highGain: 1.0, reverb: 0.06, reverbDecay: 0.4 }
  },
  {
    id: 'hottrend_anika_lively',
    name: 'Anika 👑 (Nữ Hoạt Ngôn Bắt Trend - Livestream Viral, TikTok & GenZ)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Livestream Bắt Trend & TikTok',
    pitch: 1.14,
    rate: 1.06,
    recommendedFor: 'idol',
    desc: 'Giọng nữ MC livestream siêu hoạt ngôn, tươi cười rộn rã trong từng câu chữ, năng lượng tràn đầy, giữ chân người xem 100%.',
    sampleText: 'Hello hello cả nhà mình ơi! Mau mau thả tim và nhấn giỏ hàng để săn deal độc quyền chỉ xuất hiện duy nhất 5 phút thôi nè!',
    edgePitch: '+14%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1500, midGain: 2.8, presenceFreq: 4200, presenceGain: 4.8, highGain: 3.5, reverb: 0.04, reverbDecay: 0.28 }
  },
  {
    id: 'hottrend_sales_high_energy',
    name: 'Nữ Chốt Sale Cao Năng Lượng 👑 (Giục Đơn Siêu Tốc & CTA Bùng Nổ)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Chốt Sale Năng Lượng Đỉnh Cao',
    pitch: 1.12,
    rate: 1.04,
    recommendedFor: 'manager',
    desc: 'Giọng nữ bán hàng chuyên nghiệp, dồn dập, thôi thúc hành động chốt đơn ngay lập tức với kỹ thuật CTA bén ngót.',
    sampleText: 'Chỉ còn đúng 10 suất quà tặng cuối cùng trong giỏ hàng thôi! Ai bấm mua ngay bây giờ là được miễn phí giao hàng toàn quốc nha!',
    edgePitch: '+12%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.0, midFreq: 1400, midGain: 2.6, presenceFreq: 4000, presenceGain: 4.5, highGain: 3.0, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_sales_authority_male',
    name: 'Nam Chốt Sale Authority 👑 (Bán Hàng Quyết Đoán & Uy Quyền)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'Chốt Sale Quyết Đoán',
    pitch: 0.90,
    rate: 0.96,
    recommendedFor: 'manager',
    desc: 'Giọng nam bán hàng chắc nịch, phân tích sắc sảo, tạo niềm tin tuyệt đối khiến khách hàng không thể từ chối.',
    sampleText: 'Nếu các bác đang tìm kiếm chất lượng chuẩn chỉ và chế độ bảo hành 1 đổi 1 tận nơi, hãy bấm đặt hàng ngay không cần do dự ạ!',
    edgePitch: '-10%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 3.8, midFreq: 1050, midGain: 2.6, presenceFreq: 3300, presenceGain: 3.8, highGain: 1.2, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_review_beauty_female',
    name: 'Nữ Review Mỹ Phẩm 👑 (Beauty Blogger, Skincare & Son Môi)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Beauty Blogger & Skincare',
    pitch: 1.12,
    rate: 1.0,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung, mềm mại, sáng trong, nụ cười trong giọng nói, chuyên gia đập hộp mỹ phẩm và trải nghiệm làm đẹp.',
    sampleText: 'Chất serum mỏng nhẹ thấm ngay sau 3 giây, da căng bóng mướt mịn chuẩn gái Hàn, mê thực sự luôn mấy chế ơi!',
    edgePitch: '+12%',
    edgeRate: '0%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1450, midGain: 2.5, presenceFreq: 4100, presenceGain: 4.5, highGain: 3.2, reverb: 0.05, reverbDecay: 0.32 }
  },
  {
    id: 'hottrend_review_tech_male',
    name: 'Nam Review Công Nghệ 👑 (Tech Reviewer, Gaming & Thiết Bị Số)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Tech Reviewer & Gaming',
    pitch: 0.96,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nam công nghệ dứt khoát, thông minh, chuẩn thuật ngữ kỹ thuật, đánh giá chi tiết cấu hình và benchmark phần cứng.',
    sampleText: 'Trang bị tản nhiệt buồng hơi thế hệ mới, FPS duy trì ổn định không tụt một khung hình nào, xứng đáng là ông vua phân khúc!',
    edgePitch: '-4%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1250, midGain: 2.4, presenceFreq: 3600, presenceGain: 4.0, highGain: 2.2, reverb: 0.04, reverbDecay: 0.3 }
  },
  {
    id: 'hottrend_storytelling_female',
    name: 'Nữ Storytelling Cảm Xúc 👑 (Kể Chuyện, Drama & Chạm Đáy Trái Tim)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện & Drama Cảm Xúc',
    pitch: 1.04,
    rate: 0.94,
    recommendedFor: 'both',
    desc: 'Giọng nữ giàu biểu cảm, tiếng thở tinh tế, dẫn dắt câu chuyện kịch tính, lôi cuốn và lay động mọi cung bậc cảm xúc.',
    sampleText: 'Có những kỷ niệm dù năm tháng có trôi qua bao lâu, chỉ cần một khoảnh khắc vô tình chạm lại, lòng ta vẫn vẹn nguyên thổn thức.',
    edgePitch: '+4%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1250, midGain: 2.4, presenceFreq: 3600, presenceGain: 3.8, highGain: 2.0, reverb: 0.08, reverbDecay: 0.45 }
  },
  {
    id: 'hottrend_cinematic_male',
    name: 'Nam Cinematic Documentary 👑 (Thuyết Minh Phim, Trailer & Sử Thi)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'standard',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Thuyết Minh Phim & Trailer',
    pitch: 0.84,
    rate: 0.92,
    recommendedFor: 'both',
    desc: 'Giọng nam âm vực cinema đĩnh đạc, trầm hùng tự nhiên, vang vọng như phòng chiếu phim, chuyên trị phim tài liệu và trailer bom tấn.',
    sampleText: 'Khi bóng tối bao trùm khắp đại lục, chỉ những kẻ sở hữu ý chí sắt đá nhất mới có thể thắp lên ngọn lửa của hy vọng và chiến thắng.',
    edgePitch: '-16%',
    edgeRate: '-8%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 4.5, midFreq: 850, midGain: 2.8, presenceFreq: 3100, presenceGain: 3.5, highGain: 1.0, reverb: 0.08, reverbDecay: 0.5 }
  },
  {
    id: 'hottrend_news_mc_female',
    name: 'Nữ MC Truyền Hình VIP 👑 (BTV Thời Sự, Sự Kiện & Hội Nghị Quốc Gia)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'BTV Thời Sự & MC VIP',
    pitch: 1.06,
    rate: 0.97,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn phát thanh viên truyền hình quốc gia, tròn vành rõ chữ, thanh lịch tuyệt đối, cực kỳ trang trọng.',
    sampleText: 'Kính chào quý vị khán giả đang theo dõi chương trình truyền hình trực tiếp đặc biệt phát sóng hôm nay.',
    edgePitch: '+6%',
    edgeRate: '-3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.0, midFreq: 1300, midGain: 2.5, presenceFreq: 3800, presenceGain: 4.2, highGain: 2.5, reverb: 0.05, reverbDecay: 0.35 }
  },
  {
    id: 'hottrend_villain_character',
    name: 'Nhân Vật / Villain Cinema 👑 (Nam Quyền Lực, Bí Ẩn & Phim Ngắn Drama)',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Hot Trend VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'standard',
    ageGroup: 'senior',
    styleCategory: 'sales_services',
    category: 'Nhân Vật Phim & Drama Kịch Tính',
    pitch: 0.82,
    rate: 0.90,
    recommendedFor: 'both',
    desc: 'Giọng nam phản diện quyền lực, bí ẩn, ma mị, nhấn nhá từng từ lạnh lùng đanh thép, chuẩn chất điện ảnh.',
    sampleText: 'Ngươi nghĩ ngươi có thể trốn thoát khỏi bàn cờ này sao? Mọi nước đi của ngươi đã nằm trong toan tính của ta từ ban đầu.',
    edgePitch: '-18%',
    edgeRate: '-10%',
    neuralVoice: 'vi-VN-NamMinhNeural',
    dspProfile: { lowGain: 4.8, midFreq: 850, midGain: 3.0, presenceFreq: 3000, presenceGain: 3.5, highGain: 0.8, reverb: 0.08, reverbDecay: 0.5 }
  }
];

// ==================== 5. 28 GIỌNG QUỐC TẾ PRO ĐA QUỐC GIA ====================
export const INTERNATIONAL_VOICES = [
  // Bắc Mỹ & Anh Quốc 🇺🇸 🇬🇧 🇨🇦 🇦🇺
  { 
    id: 'el_us_female', 
    name: 'Sarah 🇺🇸 (Nữ - US English Native)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'en-US', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.78, 
    rate: 1.05, 
    recommendedFor: 'game', 
    desc: 'Giọng nam tiếng Anh phong cách streamer năng động Mỹ.',
    sampleText: 'What is up guys! Get ready for an epic interactive battle today!',
    dspProfile: { semitones: -7.2, rate: 1.08, lowGain: 7.5, midFreq: 550, midGain: 3.0, presenceFreq: 2400, presenceGain: 2.0, highGain: -2 }
  },
  { 
    id: 'el_uk_female', 
    name: 'Victoria 🇬🇧 (Nữ - UK British Royal)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'en-GB', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.72, 
    rate: 0.98, 
    recommendedFor: 'game', 
    desc: 'Giọng nam quý ông Anh Quốc lịch lãm, đẳng cấp.',
    sampleText: 'Welcome to the broadcast. Prepare yourselves for an extraordinary journey.',
    dspProfile: { semitones: -8.5, rate: 0.98, lowGain: 9.5, midFreq: 420, midGain: 3.5, presenceFreq: 2000, presenceGain: 0.5, highGain: -3.5 }
  },
  { 
    id: 'el_ca_male', 
    name: 'Liam 🇨🇦 (Nam - Canada English Friendly)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'en-CA', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.78, 
    rate: 1.02, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Canada thân thiện, giao lưu cởi mở.',
    sampleText: 'Hey everyone, so glad you could drop by our stream today! Have fun!',
    dspProfile: { semitones: -7.0, rate: 1.02, lowGain: 7.5, midFreq: 520, midGain: 2.8, presenceFreq: 2300, presenceGain: 1.5, highGain: -2.0 }
  },
  { 
    id: 'el_au_male', 
    name: 'Oliver 🇦🇺 (Nam - Australian English)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'en-AU', 
    region: 'us_uk', 
    category: 'Bắc Mỹ & Châu Âu', 
    pitch: 0.76, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam bản xứ Úc tự nhiên, phóng khoáng.',
    sampleText: 'G day mate! Welcome to the show, let us get this party started right now!',
    dspProfile: { semitones: -7.5, rate: 1.05, lowGain: 8.0, midFreq: 500, midGain: 3.0, presenceFreq: 2400, presenceGain: 2.0, highGain: -2.0 }
  },

  // Châu Âu 🇫🇷 🇮🇹 🇩🇪 🇪🇸 🇷🇺
  { 
    id: 'el_fr_female', 
    name: 'Camille 🇫🇷 (Nữ - Français Paris Chic)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'fr-FR', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.74, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Pháp trầm ấm, lịch thiệp.',
    sampleText: 'Bienvenue à tous mes chers amis, c est un plaisir de vous accueillir.',
    dspProfile: { semitones: -8.0, rate: 0.98, lowGain: 9.0, midFreq: 450, midGain: 3.0, presenceFreq: 2100, presenceGain: 0.5, highGain: -3.0 }
  },
  { 
    id: 'el_it_female', 
    name: 'Elsa 🇮🇹 (Nữ - Italiano Dolce)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'it-IT', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.76, 
    rate: 1.04, 
    recommendedFor: 'both', 
    desc: 'Giọng nam Ý nồng nhiệt, giàu cảm xúc.',
    sampleText: 'Buonasera a tutti quanti, iniziamo questa grande avventura cùng nhau!',
    dspProfile: { semitones: -7.8, rate: 1.04, lowGain: 8.5, midFreq: 480, midGain: 3.2, presenceFreq: 2300, presenceGain: 1.5, highGain: -2.5 }
  },
  { 
    id: 'el_de_female', 
    name: 'Katja 🇩🇪 (Nữ - Deutsch Präzise)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'de-DE', 
    region: 'eu', 
    category: 'Châu Âu', 
    pitch: 0.68, 
    rate: 0.98, 
    recommendedFor: 'manager', 
    desc: 'Giọng nam Đức dõng dạc, uy lực và đĩnh đạc.',
    sampleText: 'Guten Tag meine Damen und Herren, wir starten jetzt die Übertragung!',
    dspProfile: { semitones: -9.5, rate: 0.98, lowGain: 11.5, midFreq: 350, midGain: 4.2, presenceFreq: 1800, presenceGain: -1.5, highGain: -5.0 }
  },
  { 
    id: 'el_es_female', 
    name: 'Lucia 🇪🇸 (Nữ - Español Madrid)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'es-MX', 
    region: 'latam', 
    category: 'Nam Mỹ & Mỹ Latin', 
    pitch: 0.78, 
    rate: 1.08, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Mexico Latin sôi động, nhiệt huyết.',
    sampleText: '¡Qué onda amigos! ¡Bienvenidos al show más prendido de la noche!',
    dspProfile: { semitones: -7.5, rate: 1.08, lowGain: 7.5, midFreq: 550, midGain: 3.2, presenceFreq: 2400, presenceGain: 2.0, highGain: -2.0 }
  },
  { 
    id: 'el_br_female', 
    name: 'Francisca 🇧🇷 (Nữ - Português Brasil)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'zh-CN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.74, 
    rate: 1.08, 
    recommendedFor: 'game', 
    desc: 'Giọng nam bình luận viên võ thuật Trung Hoa.',
    sampleText: '直播间的家人们大家晚上好！精彩对决马上开始！',
    dspProfile: { semitones: -8.0, rate: 1.08, lowGain: 9.0, midFreq: 460, midGain: 3.5, presenceFreq: 2200, presenceGain: 1.5, highGain: -3.0 }
  },
  { 
    id: 'el_tw_female', 
    name: 'Ting-Ting 🇹🇼 (Nữ - 臺灣國語 甜美)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'ja-JP', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.65, 
    rate: 1.02, 
    recommendedFor: 'game', 
    desc: 'Giọng nam Samurai dũng mãnh chuẩn điện ảnh Nhật Bản.',
    sampleText: '皆様、ようこそお越しくださいました！熱き戦いを始めよう！',
    dspProfile: { semitones: -9.8, rate: 1.02, lowGain: 12.0, midFreq: 340, midGain: 4.2, presenceFreq: 1900, presenceGain: 0.0, highGain: -5.0 }
  },
  { 
    id: 'el_kr_female', 
    name: 'Min-ji 🇰🇷 (Nữ - 한국어 K-Pop Idol)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'ko-KR', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.75, 
    rate: 0.98, 
    recommendedFor: 'both', 
    desc: 'Giọng nam MC truyền hình Hàn Quốc ấm áp.',
    sampleText: '반갑습니다 여러분! 오늘 라이브도 즐겁게 함께해요!',
    dspProfile: { semitones: -7.6, rate: 0.98, lowGain: 8.5, midFreq: 480, midGain: 3.0, presenceFreq: 2200, presenceGain: 1.0, highGain: -3.0 }
  },
  { 
    id: 'el_th_female', 
    name: 'Premwadee 🇹🇭 (Nữ - ภาษาไทย)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
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
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male', 
    lang: 'en-IN', 
    region: 'asia', 
    category: 'Châu Á', 
    pitch: 0.78, 
    rate: 1.05, 
    recommendedFor: 'both', 
    desc: 'Giọng nam tiếng Anh chuẩn Ấn Độ lưu loát.',
    sampleText: 'Namaste everyone! Welcome to our live broadcast session today!',
    dspProfile: { semitones: -7.2, rate: 1.05, lowGain: 7.5, midFreq: 520, midGain: 3.0, presenceFreq: 2300, presenceGain: 1.5, highGain: -2.0 }
  },
  { 
    id: 'el_ar_female', 
    name: 'Amira 🇸🇦 (Nữ - العربية)', 
    provider: 'system', 
    tier: 'pro',
    badge: '👑 Studio VIP',
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

// Toàn bộ danh sách 109 giọng AI Studio Pro (bao gồm 20 giọng Hot Trend)
export const ALL_SYSTEM_VOICES = [
  ...VIETNAMESE_HOTTREND_VOICES,
  ...VIETNAMESE_SALES_VOICES,
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...INTERNATIONAL_VOICES
];

export const ELEVENLABS_VOICES = ALL_SYSTEM_VOICES;
export const FREE_VOICES = ALL_SYSTEM_VOICES;
export const CURATED_VOICES = ALL_SYSTEM_VOICES;

export const DEFAULT_VOICE_CONFIG = {
  idolVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 👑 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'idol',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng tích cực ạ!',
    edgePitch: '+2%',
    edgeRate: '+2%',

  },
  managerVoice: {
    id: 'vn_nam_quanly_uyquyen',
    name: 'Quốc Cường 👑 (Nam - Quản Lý Giục Chốt Đơn Uy Quyền)',
    provider: 'system',
    tier: 'pro',
    gender: 'Male',
    role: 'manager',
    pitch: 1.0,
    rate: 1.05,
    volume: 1.0,
    enabled: true,
    sampleText: 'Bộ phận kho thông báo số lượng chỉ còn dưới 10 sản phẩm, quý khách nhanh tay hoàn tất đơn hàng ngay lập tức!',
    edgePitch: '-14%',
    edgeRate: '+10%',

  },
  commentVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 👑 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'comment',
    pitch: 1.05,
    rate: 1.0,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng tích cực ạ!',
    edgePitch: '+2%',
    edgeRate: '+2%',

  },
  gameBlvVoice: {
    id: 'vn_nam_blv_bungno',
    name: 'Quang Huy 👑 (Nam - BLV Game PK Bùng Nổ, Siêu Tốc)',
    provider: 'system',
    tier: 'pro',
    gender: 'Male',
    role: 'game',
    pitch: 1.0,
    rate: 1.1,
    volume: 1.0,
    enabled: true,
    sampleText: 'Pha combat đỉnh cao! Cả hai đội đang tung toàn bộ chiêu thức, hãy cùng bùng nổ năng lượng nào anh em ơi!',
    edgePitch: '+22%',
    edgeRate: '+24%',

  },
  generalVoice: {
    id: 'free_vi_female',
    name: 'Hoài My 👑 (Nữ - Chuẩn Tiếng Việt Quốc Dân)',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'both',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em chào bạn đang theo dõi livestream nha! Chúc bạn xem live thật vui vẻ và ngập tràn năng lượng tích cực ạ!',
    edgePitch: '+2%',
    edgeRate: '+2%',

  },
  selectedLanguage: 'vi',
  elevenLabsApiKey: '',
  openaiApiKey: '',
  geminiApiKey: ''
};

// ==================== FAVORITE VOICES STORAGE ====================
export function getFavoriteVoiceIds() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('avalive_favorite_voices');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

export function toggleFavoriteVoiceId(voiceId) {
  if (typeof window === 'undefined' || !voiceId) return [];
  try {
    const list = getFavoriteVoiceIds();
    const idx = list.indexOf(voiceId);
    let updated;
    if (idx >= 0) {
      updated = list.filter(id => id !== voiceId);
    } else {
      updated = [...list, voiceId];
    }
    localStorage.setItem('avalive_favorite_voices', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('avalive_favorite_voices_changed', { detail: updated }));
    return updated;
  } catch (e) {
    return [];
  }
}

export function isVoiceFavorite(voiceId) {
  return getFavoriteVoiceIds().includes(voiceId);
}

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
let activeMasterGainNode = null;
const audioBufferMemoryCache = new Map();

/**
 * ⚡ ĐIỀU CHỈNH ÂM LƯỢNG & TỐC ĐỘ REAL-TIME KHI ĐANG PHÁT AUDIO
 */
export function setRealtimeAudioParams({ volume, rate, pitch } = {}) {
  if (volume !== undefined && !isNaN(Number(volume))) {
    const volNum = Math.max(0, Math.min(2.0, Number(volume)));
    if (activeMasterGainNode && activeAudioContext) {
      try {
        activeMasterGainNode.gain.setValueAtTime(volNum, activeAudioContext.currentTime);
      } catch (e) {}
    }
    if (activePreviewAudio) {
      try {
        activePreviewAudio.volume = Math.max(0, Math.min(1.0, volNum));
      } catch (e) {}
    }
  }

  if (rate !== undefined && !isNaN(Number(rate))) {
    const rateNum = Math.max(0.5, Math.min(2.0, Number(rate)));
    if (activeSourceNode && activeAudioContext) {
      try {
        activeSourceNode.playbackRate.setValueAtTime(rateNum, activeAudioContext.currentTime);
      } catch (e) {}
    }
    if (activePreviewAudio) {
      try {
        activePreviewAudio.playbackRate = rateNum;
      } catch (e) {}
    }
  }
}

// Initialize native browser speech synthesis voices immediately
function initSpeechVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const updateVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          preloadedVoices = v;
        }
      } catch (e) {}
    };
    updateVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }
}

if (typeof window !== 'undefined') {
  initSpeechVoices();
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initSpeechVoices);
  }
}

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
  activeMasterGainNode = null;
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
 * 🌺 BỘ XỬ LÝ CHUYỂN ĐỔI NGỮ ĐIỆU VÀ CẢM XÚC TIẾNG VIỆT 100% NHƯ NGƯỜI THẬT
 * - Chuyển đổi số tiền, tỷ lệ %, tiền tệ: 199k -> 199 nghìn đồng, 2tr5 -> 2 triệu 500 nghìn đồng...
 * - Dịch thuật từ viết tắt livestream / mạng xã hội: sp -> sản phẩm, đc -> được, cmt -> bình luận, deal -> ưu đãi...
 * - Chèn dấu ngắt nhịp thở tự nhiên (Micro-Pauses) sau các từ đệm: "Dạ,", "Cả nhà mình ơi,", "Đặc biệt là,"...
 * - Nâng cao ngữ điệu cảm xúc, ngọt ngào, hoạt ngôn và uyển chuyển cho giọng nữ.
 */
export function humanizeVoiceSpeechText(rawText, voice = null) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = cleanTextForVoiceSpeech(rawText);
  if (!text) return '';

  const isVietnamese = !voice || voice?.lang === 'vi-VN' || voice?.region === 'vi' || voice?.id?.startsWith('vn_') || voice?.id === 'free_vi_female' || voice?.id === 'el_adam';
  if (!isVietnamese) return text;

  const isFemale = !checkIsMale(voice);

  // 1. Chuyển đổi tiền tệ & số đếm livestream tự nhiên
  text = text
    .replace(/\b(\d+)\s*k\b/gi, '$1 nghìn đồng')
    .replace(/\b(\d+)\s*cành\b/gi, '$1 nghìn đồng')
    .replace(/\b(\d+)[,\.](\d+)\s*(tr|triệu)\b/gi, '$1 triệu $2 trăm nghìn đồng')
    .replace(/\b(\d+)\s*(tr|triệu)\b/gi, '$1 triệu đồng')
    .replace(/\b(\d+)\s*%\b/g, '$1 phần trăm')
    .replace(/\b(\d+)\s*(đ|vnd|vnđ)\b/gi, '$1 đồng')
    .replace(/\b(\d+)\s*lít\b/gi, '$1 trăm nghìn đồng')
    .replace(/\b(\d+)\s*củ\b/gi, '$1 triệu đồng');

  // 2. Chuyển đổi từ viết tắt livestream & thương mại điện tử
  text = text
    .replace(/\bsp\b/gi, 'sản phẩm')
    .replace(/\bđc\b/gi, 'được')
    .replace(/\bdc\b/gi, 'được')
    .replace(/\bko\b/gi, 'không')
    .replace(/\bk\b/gi, 'không')
    .replace(/\bkhg\b/gi, 'không')
    .replace(/\bmn\b/gi, 'mọi người')
    .replace(/\bmng\b/gi, 'mọi người')
    .replace(/\bsz\b/gi, 'size')
    .replace(/\bib\b/gi, 'nhắn tin')
    .replace(/\binbox\b/gi, 'nhắn tin trực tiếp')
    .replace(/\bcmt\b/gi, 'bình luận')
    .replace(/\bcomment\b/gi, 'bình luận')
    .replace(/\bdeal\b/gi, 'ưu đãi')
    .replace(/\bfreeship\b/gi, 'miễn phí giao hàng')
    .replace(/\bfree ship\b/gi, 'miễn phí giao hàng')
    .replace(/\bvoucher\b/gi, 'mã giảm giá')
    .replace(/\bflash\s*sale\b/gi, 'ưu đãi chớp nhoáng')
    .replace(/\bfollow\b/gi, 'theo dõi')
    .replace(/\bfl\b/gi, 'theo dõi')
    .replace(/\btiktok\b/gi, 'Tóp Tóp')
    .replace(/\btik tok\b/gi, 'Tóp Tóp')
    .replace(/\bzalo\b/gi, 'Da-lô')
    .replace(/\bfb\b/gi, 'Phây Búc')
    .replace(/\bfacebook\b/gi, 'Phây Búc')
    .replace(/\bcod\b/gi, 'nhận hàng thanh toán')
    .replace(/\bstk\b/gi, 'số tài khoản')
    .replace(/\bcombo\b/gi, 'gói combo');

  // 3. Tinh chỉnh nhịp thở (Micro-Pauses), cảm xúc và dấu câu tự nhiên cho kịch bản
  if (isFemale) {
    text = text
      .replace(/\b(Hello cả nhà|Chào cả nhà|Cả nhà ơi|Mọi người ơi|Quý vị ơi|Các bạn ơi|Bà con ơi|Chị em ơi|Các mẹ ơi|Ai đang lướt qua)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(Dạ|Vâng|Em xin chào|Em cam kết|Đặc biệt là|Hơn thế nữa|Thật sự là|Nhanh tay lên nào|Đúng rồi ạ|Chính xác luôn|Tuyệt vời luôn|Quá đã luôn)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(ạ)\b(?!\s*[,.!?])/gi, 'ạ.')
      .replace(/\b(nha cả nhà|nha mọi người|nha các bạn|nha mấy chế|nha các mẹ|nha cả nhà mình)(?!\s*[,.!?])/gi, '$1!')
      .replace(/\b(nè nghen|nè bà con|nè mọi người|nè các bạn)(?!\s*[,.!?])/gi, '$1!')
      .replace(/\b(ạ nghen|ạ nhen|ạ nè)(?!\s*[,.!?])/gi, '$1!')
      .replace(/\b(khoan lướt nha|đừng lướt nha|ở lại xem live nha)(?!\s*[,.!?])/gi, '$1!');
  } else {
    text = text
      .replace(/\b(Hello cả nhà|Xin chào tất cả các bạn|Chào anh em|Anh em ơi|Mọi người ơi|Cả nhà ơi|Bà con ơi)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(Đặc biệt là|Cực kỳ hấp dẫn|Chú ý chú ý|Duy nhất hôm nay|Cam kết 100%|Chính hãng 100%)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(nha anh em|nha mọi người|nha các bạn|nha cả nhà)(?!\s*[,.!?])/gi, '$1!')
      .replace(/\b(chốt ngay|mua ngay|đặt ngay)(?!\s*[,.!?])/gi, '$1!');
  }

  // Chuyển dấu chấm ba chấm thành nhịp ngân nhẹ nhàng
  text = text.replace(/\.{3,}/g, '... ');

  // Dọn dẹp khoảng trắng thừa và dấu phẩy liên tiếp
  text = text
    .replace(/,\s*,+/g, ', ')
    .replace(/\.\s*\.+/g, '. ')
    .replace(/!\s*!+/g, '! ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * 🌾 CHUẨN HÓA NGỮ ĐIỆU & PHƯƠNG NGỮ 4 VÙNG MIỀN VIỆT NAM THÔNG MINH
 * Tự động chuyển đổi ngữ khí, trợ từ cảm thán và nhịp điệu phát âm bản xứ:
 * - Miền Tây: Mộc mạc, ngọt ngào, ấm áp, nhịp điệu từ tốn sông nước (nghen, nè nghen, hén, thiệt tình á, hết sảy bà con ơi...)
 * - Miền Trung: Đậm đà, sâu lắng, chuẩn vị Huế/Đà Nẵng/Quảng Nam/Nghệ Tĩnh (nì, quý anh chị nì, ngon xuất sắc nì...)
 * - Miền Nam (Sài Gòn): Năng động, tốc độ, nhiệt huyết chốt đơn (nha mọi người ơi, chốt liền tay nè, xịn sò, quá đã luôn á...)
 * - Miền Bắc (Hà Nội): Chuẩn chỉ, thanh lịch, rành mạch, uy tín (dạ vâng thưa các bác, chuẩn chỉ từng chi tiết, chính hãng nhé các bác...)
 */
export function formatTextForRegionalSpeech(rawText, voice) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = humanizeVoiceSpeechText(rawText, voice);
  if (!text) return '';

  const isVietnameseVoice = voice?.lang === 'vi-VN' || voice?.region === 'vi' || voice?.id?.startsWith('vn_') || voice?.id === 'free_vi_female' || voice?.id === 'el_adam';
  if (!isVietnameseVoice) return text;

  // Xác định phương ngữ (dialect)
  let dialect = voice?.dialect;
  if (!dialect) {
    const vName = (voice?.name || '').toLowerCase();
    const vCat = (voice?.category || '').toLowerCase();
    const vDesc = (voice?.desc || '').toLowerCase();
    const vId = (voice?.id || '').toLowerCase();

    if (vName.includes('miền tây') || vCat.includes('miền tây') || vDesc.includes('miền tây') || vName.includes('sông nước') || vId.includes('_tay_') || vId.includes('_taynambo')) {
      dialect = 'tay';
    } else if (vName.includes('miền trung') || vCat.includes('miền trung') || vDesc.includes('miền trung') || vName.includes('huế') || vName.includes('đà nẵng') || vName.includes('nghệ an') || vId.includes('_trung_')) {
      dialect = 'trung';
    } else if (vName.includes('miền bắc') || vCat.includes('miền bắc') || vDesc.includes('miền bắc') || vName.includes('hà nội') || vId.includes('_bac_')) {
      dialect = 'bac';
    } else if (vName.includes('miền nam') || vCat.includes('miền nam') || vDesc.includes('miền nam') || vName.includes('sài gòn') || vId.includes('_nam_')) {
      dialect = 'nam';
    } else {
      dialect = 'standard';
    }
  }

  // 1. PHƯƠNG NGỮ MIỀN TÂY (Sông Nước Nam Bộ)
  if (dialect === 'tay') {
    text = text
      .replace(/\b(nhé|nhé bạn|nhé mọi người|nha các bạn|nhé các bạn)\b/gi, 'nghen bà con')
      .replace(/\b(nha bạn|nha bạn ơi)\b/gi, 'nhen cô chú anh chị')
      .replace(/\b(rất ngon|quá ngon)\b/gi, 'ngon hết sảy luôn')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'đẹp mê ly')
      .replace(/\b(rất tốt|tuyệt vời)\b/gi, 'tốt dữ dằn à nghen')
      .replace(/\b(thật sự|thật đấy)\b/gi, 'thiệt tình á')
      .replace(/\b(chắc chắn)\b/gi, 'chắc ăn 100% luôn')
      .replace(/\b(nhiều lắm|rất nhiều)\b/gi, 'quá trời quá đất luôn')
      .replace(/\b(không ạ|không bạn)\b/gi, 'hông nè nghen')
      .replace(/\b(được không)\b/gi, 'được hông nè bà con');
  } 
  // 2. PHƯƠNG NGỮ MIỀN TRUNG (Huế, Đà Nẵng, Quảng Nam, Nghệ An)
  else if (dialect === 'trung') {
    text = text
      .replace(/\b(nhé|nhé bạn|nhé mọi người)\b/gi, 'nì cả nhà ơi')
      .replace(/\b(nha bạn|nha các bạn)\b/gi, 'nè quý anh chị nì')
      .replace(/\b(rất ngon|quá ngon)\b/gi, 'ngon xuất sắc nì')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'đẹp sắc sảo lắm nì')
      .replace(/\b(thật sự|thật đấy)\b/gi, 'thiệt luôn nì')
      .replace(/\b(tuyệt vời)\b/gi, 'tuyệt cú mèo lắm nì')
      .replace(/\b(chắc chắn)\b/gi, 'chuẩn chỉ 100% nì');
  } 
  // 3. PHƯƠNG NGỮ MIỀN NAM (Sài Gòn Phồn Hoa - Năng Động & Chốt Deal)
  else if (dialect === 'nam') {
    text = text
      .replace(/\b(nhé|nhé bạn)\b/gi, 'nha mọi người ơi')
      .replace(/\b(nhé cả nhà)\b/gi, 'nha cả nhà mình ơi')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'siêu đẹp xịn sò')
      .replace(/\b(rất tốt|tuyệt vời)\b/gi, 'cực kì đỉnh chóp luôn')
      .replace(/\b(mua ngay)\b/gi, 'chốt liền tay kẻo lỡ nha');
  } 
  // 4. PHƯƠNG NGỮ MIỀN BẮC (Hà Nội - Thanh Lịch & Sang Trọng Chuẩn Mực)
  else if (dialect === 'bac') {
    text = text
      .replace(/\b(nha bạn|nha cả nhà|nha mọi người)\b/gi, 'nhé các bác và anh chị')
      .replace(/\b(hông)\b/gi, 'không')
      .replace(/\b(xịn xò|xịn sò)\b/gi, 'cao cấp chuẩn chỉ')
      .replace(/\b(chắc ăn)\b/gi, 'chắc chắn 100%')
      .replace(/\b(ngon hết sảy)\b/gi, 'ngon tuyệt đỉnh');
  }

  return text;
}

/**
 * Helper: Xác định chính xác 100% giới tính Nam (Male)
 */
export function checkIsMale(voice) {
  if (!voice) return false;
  if (voice.neuralVoice) {
    const nv = String(voice.neuralVoice).toLowerCase();
    if (nv.includes('namminh') || nv.includes('guy') || nv.includes('keita') || nv.includes('yunxi') || nv.includes('yunjian') || nv.includes('injoon') || nv.includes('henri') || nv.includes('conrad') || nv.includes('alvaro') || nv.includes('dmitry') || nv.includes('diego') || nv.includes('niwat') || nv.includes('hans') || nv.includes('marco') || nv.includes('arthur') || nv.includes('david') || nv.includes('liam') || nv.includes('oliver')) {
      return true;
    }
  }
  const g = String(voice.gender || '').toLowerCase().trim();
  const id = String(voice.id || '').toLowerCase();
  const name = String(voice.name || '').toLowerCase();
  if (g === 'male' || g === 'nam' || g === 'm') return true;
  if (id.includes('_nam_') || id.includes('_male_') || id.includes('el_adam') || id.includes('el_josh') || id.includes('el_us_male') || id.includes('el_uk_male') || id.includes('el_ca_male') || id.includes('el_au_male') || id.includes('el_fr_male') || id.includes('el_it_male') || id.includes('el_de_male')) return true;
  if (name.includes('(nam') || name.includes('nam -') || name.includes('👨') || name.includes('thầy') || name.includes('bác') || name.includes('anh hai')) return true;
  return false;
}

/**
 * 🏛️ Bộ tạo Impulse Response không gian phòng thu / âm vang (Acoustic Space Reverb)
 */
function createReverbImpulseBuffer(audioCtx, duration = 0.45, decay = 2.0) {
  const sampleRate = audioCtx.sampleRate;
  const length = Math.max(128, Math.floor(sampleRate * duration));
  const impulse = audioCtx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const factor = Math.pow(1 - i / length, decay);
    left[i] = (Math.random() * 2 - 1) * factor;
    right[i] = (Math.random() * 2 - 1) * factor;
  }
  return impulse;
}

/**
 * 🎵 TÍNH TOÁN HỆ SỐ BIẾN ĐỔI CAO ĐỘ & FORMANT THANH QUẢN (PITCH SHIFT FACTOR)
 * Giúp từng nhân vật (Bà Cụ, Cụ Ông, Nữ Trẻ Gia Dụng, KOC, Idol, Nam Uy Quyền, BLV...)
 * phát ra âm sắc, cao độ và thanh quản độc bản 100% không ai giống ai.
 */
export function getVoicePitchShiftFactor(voice, isMale) {
  if (voice?.pitchShiftFactor !== undefined && !isNaN(Number(voice.pitchShiftFactor))) {
    return Number(voice.pitchShiftFactor);
  }
  if (voice?.dspProfile?.pitchShiftFactor !== undefined && !isNaN(Number(voice.dspProfile.pitchShiftFactor))) {
    return Number(voice.dspProfile.pitchShiftFactor);
  }
  if (voice?.dspProfile?.semitones !== undefined && !isNaN(Number(voice.dspProfile.semitones))) {
    const st = Number(voice.dspProfile.semitones);
    return Math.max(0.75, Math.min(1.45, Math.pow(2, st / 12)));
  }
  if (voice?.pitch !== undefined && !isNaN(Number(voice.pitch)) && Number(voice.pitch) !== 1.0) {
    return Math.max(0.75, Math.min(1.45, Number(voice.pitch)));
  }
  
  const id = (voice?.id || '').toLowerCase();
  const cat = (voice?.category || '').toLowerCase();
  const name = (voice?.name || '').toLowerCase();
  const age = voice?.ageGroup;

  // 1. Nhóm Lão Niên / Cụ Ông / Bà Cụ (Trầm khàn, đục ấm cổ điển)
  if (age === 'senior' || age === 'elder' || id.includes('traco') || id.includes('dongy') || id.includes('ongbay') || id.includes('bacu') || id.includes('laonien') || name.includes('cụ') || name.includes('bà bẩy') || name.includes('ông bẩy')) {
    return isMale ? 0.82 : 0.86;
  }

  // 2. Nhóm Trẻ Em / Anime / Cute (Trong veo, líu lo)
  if (id.includes('embe') || id.includes('cute') || cat.includes('trẻ em') || name.includes('bé ') || id.includes('bap') || id.includes('bana')) {
    return 1.28;
  }

  // 3. Nhóm Nữ Trẻ / KOC / Hot Trend / Gia Dụng / Skincare / Mỹ Phẩm (Tươi sáng, ngọt ngào, hoạt ngôn)
  if (id.includes('giadung') || id.includes('mypham') || id.includes('koc') || id.includes('genz') || id.includes('idol') || id.includes('tiktok') || id.includes('shorts') || id.includes('jessica') || id.includes('thao') || id.includes('nhi')) {
    return isMale ? 1.04 : 1.12;
  }

  // 4. Nhóm Nam Trầm / Uy Quyền / Bất Động Sản / Cinematic / Trailer (Trầm hùng, đanh thép)
  if (id.includes('uyquyen') || id.includes('chotsale') || id.includes('batdongsan') || id.includes('docu') || id.includes('cinema') || id.includes('trailer') || id.includes('adam') || id.includes('trieuduong')) {
    return isMale ? 0.88 : 0.96;
  }

  // 5. Nhóm Tâm Sự / Kể Chuyện / Podcast / Luxury / Trầm Hương (Sâu lắng, truyền cảm)
  if (id.includes('tam_su') || id.includes('kechuyen') || id.includes('podcast') || id.includes('luxury') || id.includes('tramhuong') || id.includes('giang') || id.includes('matilda') || id.includes('sarah')) {
    return isMale ? 0.92 : 0.98;
  }

  // 6. Nhóm Thể Thao / BLV / Gym / Ô Tô (Bùng nổ, rực lửa)
  if (id.includes('thethao') || id.includes('fitness') || id.includes('blv') || id.includes('oto') || id.includes('hung') || id.includes('kevin')) {
    return isMale ? 1.06 : 1.08;
  }

  return isMale ? 0.94 : 1.06;
}

/**
 * 🎛️ BỘ XỬ LÝ ÂM THANH MASTERING BROADCAST DSP ĐA KHÔNG GIAN:
 * Phân tách 100% âm sắc, độ vang, độ trầm, độ sắc và cao độ giữa các giọng đọc:
 * - Chuỗi EQ 4 băng tầng Parametric chuyên sâu theo từng tính cách, vùng miền và độ tuổi.
 * - Bộ tái tạo không gian phòng thu / âm vang (Acoustic Space Reverb Convolver).
 * - Bộ định hình cao độ & Formant tự nhiên (Playback Rate & Resonator).
 * - Bộ nén động lực Broadcast Dynamic Compressor chống vỡ âm, đanh dày và rõ chữ.
 */
async function playAudioBufferWithDSP(audioBuffer, voice, requestedVolume, requestedRate, onEnd, isTestingMode) {
  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return false;

  stopVoiceAudio();

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  activeSourceNode = source;

  const isMale = checkIsMale(voice);
  const dsp = voice?.dspProfile || {};

  // 1. PLAYBACK RATE & PITCH SHIFT THEO ĐÚNG ĐẶC TÍNH CỦA TỪNG GIỌNG ĐỌC
  const pitchFactor = getVoicePitchShiftFactor(voice, isMale);
  const userRate = requestedRate !== undefined && !isNaN(requestedRate) ? Number(requestedRate) : 1.0;
  source.playbackRate.value = Math.max(0.5, Math.min(2.0, pitchFactor * userRate));

  // 2. LOW-SHELF FILTER (Độ trầm, độ dày lồng ngực & âm ấm)
  const lowFilter = audioCtx.createBiquadFilter();
  lowFilter.type = 'lowshelf';
  lowFilter.frequency.value = dsp.lowFreq || (isMale ? 135 : 240);
  lowFilter.gain.value = dsp.lowGain !== undefined ? dsp.lowGain : (isMale ? 4.5 : 0.5);

  // 3. MID-PEAKING / CHEST RESONANCE FILTER (Độ đầy đặn & nội lực)
  const midFilter = audioCtx.createBiquadFilter();
  midFilter.type = 'peaking';
  midFilter.frequency.value = dsp.midFreq || (isMale ? 950 : 1450);
  midFilter.Q.value = dsp.midQ || 1.2;
  midFilter.gain.value = dsp.midGain !== undefined ? dsp.midGain : 2.0;

  // 4. PRESENCE PEAKING FILTER (Độ sắc nét, ăn micro & rõ chữ)
  const presenceFilter = audioCtx.createBiquadFilter();
  presenceFilter.type = 'peaking';
  presenceFilter.frequency.value = dsp.presenceFreq || (isMale ? 2800 : 3600);
  presenceFilter.Q.value = dsp.presenceQ || 1.3;
  presenceFilter.gain.value = dsp.presenceGain !== undefined ? dsp.presenceGain : 3.0;

  // 5. HIGH-SHELF FILTER (Độ thoáng không gian và hơi thở tự nhiên)
  const highFilter = audioCtx.createBiquadFilter();
  highFilter.type = 'highshelf';
  highFilter.frequency.value = dsp.highFreq || 6500;
  highFilter.gain.value = dsp.highGain !== undefined ? dsp.highGain : (isMale ? 0.0 : 2.0);

  // 6. DYNAMICS BROADCAST COMPRESSOR
  const compressor = audioCtx.createDynamicsCompressor();
  const compConf = dsp.compressor || {};
  compressor.threshold.value = compConf.threshold !== undefined ? compConf.threshold : (isMale ? -22 : -18);
  compressor.knee.value = compConf.knee !== undefined ? compConf.knee : 6;
  compressor.ratio.value = compConf.ratio !== undefined ? compConf.ratio : 3.5;
  compressor.attack.value = compConf.attack !== undefined ? compConf.attack : 0.005;
  compressor.release.value = compConf.release !== undefined ? compConf.release : 0.15;

  // 7. MASTER GAIN
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = Math.max(0, Math.min(1.0, requestedVolume));
  activeMasterGainNode = masterGain;

  // 8. ACOUSTIC SPACE REVERB CONVOLVER (Tạo độ vang phòng / studio khác biệt)
  const reverbAmount = dsp.reverb !== undefined ? dsp.reverb : (
    voice?.ageGroup === 'elder' ? 0.18 :
    voice?.styleCategory === 'tam_su' || voice?.category?.includes('Podcast') ? 0.20 :
    voice?.styleCategory === 'banhang' || voice?.category?.includes('TikTok') ? 0.08 : 0.12
  );
  const reverbDecay = dsp.reverbDecay || (voice?.ageGroup === 'elder' ? 1.0 : 0.5);

  const dryGain = audioCtx.createGain();
  dryGain.gain.value = Math.max(0.2, 1.0 - (reverbAmount * 0.6));

  const wetGain = audioCtx.createGain();
  wetGain.gain.value = reverbAmount;

  const convolver = audioCtx.createConvolver();
  try {
    convolver.buffer = createReverbImpulseBuffer(audioCtx, Math.max(0.2, reverbDecay), 2.2);
  } catch (e) {}

  // NỐI DÂY TÍN HIỆU ÂM THANH
  source.connect(lowFilter);
  lowFilter.connect(midFilter);
  midFilter.connect(presenceFilter);
  presenceFilter.connect(highFilter);
  highFilter.connect(compressor);
  compressor.connect(masterGain);

  // Phân nhánh Dry & Wet (Reverb)
  masterGain.connect(dryGain);
  dryGain.connect(audioCtx.destination);

  if (reverbAmount > 0.01 && convolver.buffer) {
    masterGain.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(audioCtx.destination);
  }

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
 * ⚡ TẢI VÀ GIẢI MÃ ÂM THANH MICROSOFT NEURAL TTS (CÓ BỘ NHỚ ĐỆM TỰ ĐỘNG)
 */
async function fetchAndDecodeTTSAudio(text, voice = null) {
  const isMale = checkIsMale(voice);
  const gender = isMale ? 'male' : 'female';
  const lang = voice?.lang || 'vi-VN';
  const shortLang = lang.split('-')[0].toLowerCase();

  // Chọn đúng Neural Voice ID chuẩn xác cho từng giới tính & quốc gia
  let neuralVoice = voice?.neuralVoice;
  if (!neuralVoice) {
    if (shortLang === 'vi') neuralVoice = isMale ? 'vi-VN-NamMinhNeural' : 'vi-VN-HoaiMyNeural';
    else if (shortLang === 'en') neuralVoice = isMale ? 'en-US-GuyNeural' : 'en-US-JennyNeural';
    else if (shortLang === 'ja') neuralVoice = isMale ? 'ja-JP-KeitaNeural' : 'ja-JP-NanamiNeural';
    else if (shortLang === 'zh') neuralVoice = isMale ? 'zh-CN-YunxiNeural' : 'zh-CN-XiaoxiaoNeural';
    else if (shortLang === 'ko') neuralVoice = isMale ? 'ko-KR-InJoonNeural' : 'ko-KR-SunHiNeural';
    else if (shortLang === 'fr') neuralVoice = isMale ? 'fr-FR-HenriNeural' : 'fr-FR-DeniseNeural';
    else if (shortLang === 'de') neuralVoice = isMale ? 'de-DE-ConradNeural' : 'de-DE-KatjaNeural';
    else if (shortLang === 'es') neuralVoice = isMale ? 'es-ES-AlvaroNeural' : 'es-ES-ElviraNeural';
    else if (shortLang === 'ru') neuralVoice = isMale ? 'ru-RU-DmitryNeural' : 'ru-RU-SvetlanaNeural';
    else if (shortLang === 'it') neuralVoice = isMale ? 'it-IT-DiegoNeural' : 'it-IT-ElsaNeural';
    else if (shortLang === 'th') neuralVoice = isMale ? 'th-TH-NiwatNeural' : 'th-TH-PremwadeeNeural';
    else neuralVoice = isMale ? 'vi-VN-NamMinhNeural' : 'vi-VN-HoaiMyNeural';
  }

  // 1. TÍNH TOÁN CAO ĐỘ (PITCH) HOÀN TOÀN KHÁC BIỆT DẠNG %
  let effectivePitch = voice?.edgePitch;
  if (!effectivePitch) {
    if (voice?.dspProfile?.semitones !== undefined) {
      const st = voice.dspProfile.semitones;
      const pct = Math.round(st * 5);
      effectivePitch = (pct >= 0 ? '+' : '') + pct + '%';
    } else if (voice?.pitch !== undefined) {
      const pDiff = Math.round((Number(voice.pitch) - 1.0) * 100);
      effectivePitch = (pDiff >= 0 ? '+' : '') + pDiff + '%';
    } else {
      effectivePitch = isMale ? '-10%' : '+10%';
    }
  }

  // 2. TÍNH TOÁN TỐC ĐỘ (RATE) DẠNG % (KẾT HỢP GIỮA TÍNH CÁCH GIỌNG & TÙY CHỈNH TỪ UI)
  let baseRateNum = 0;
  if (voice?.edgeRate && voice.edgeRate.includes('%')) {
    baseRateNum = parseInt(voice.edgeRate.replace('%', ''), 10) || 0;
  }
  
  // Nếu người dùng có thanh trượt tốc độ (voice.rate khác 1.0)
  let userRateOffset = 0;
  if (voice?.rate !== undefined && !isNaN(Number(voice.rate))) {
    userRateOffset = Math.round((Number(voice.rate) - 1.0) * 100);
  }

  const finalRateNum = Math.max(-50, Math.min(80, baseRateNum + userRateOffset));
  const effectiveRate = (finalRateNum >= 0 ? '+' : '') + finalRateNum + '%';

  // Khóa bộ nhớ đệm độc bản theo từng ID giọng đọc riêng biệt để không bao giờ bị phát nhầm giọng khác
  const voiceIdKey = voice?.id || neuralVoice;
  const cacheKey = `${voiceIdKey}_${neuralVoice}_${effectivePitch}_${effectiveRate}_${text.trim()}`;
  if (audioBufferMemoryCache.has(cacheKey)) {
    return audioBufferMemoryCache.get(cacheKey);
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return null;

  const currentOrigin = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') && !window.location.origin.startsWith('file:')
    ? window.location.origin
    : '';

  const ttsQuery = `text=${encodeURIComponent(text)}&voice=${encodeURIComponent(neuralVoice)}&voiceId=${encodeURIComponent(voice?.id || '')}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(effectivePitch)}&rate=${encodeURIComponent(effectiveRate)}&lang=${encodeURIComponent(shortLang)}`;

  const candidateUrls = [
    ...(currentOrigin ? [`${currentOrigin}/api/tts?${ttsQuery}`] : []),
    `/api/tts?${ttsQuery}`,
    `http://127.0.0.1:3001/api/tts?${ttsQuery}`,
    `http://localhost:3001/api/tts?${ttsQuery}`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        if (arrayBuf && arrayBuf.byteLength > 100) {
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
          if (audioBuffer) {
            if (audioBufferMemoryCache.size > 250) {
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
 * 🎙️ Phát Voice AI Âm Thanh Cho Mọi Mục Đích (Preview, Idol nói, Game BLV, Trợ lý, Bán hàng)
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
  const isMale = checkIsMale(voice);

  // Chuẩn bị câu thoại chuẩn xác (ưu tiên câu thoại đặc trưng riêng biệt của từng giọng)
  let candidateText = sampleText;
  if (!candidateText || !candidateText.trim()) {
    candidateText = voice?.sampleText || (
      isVietnameseVoice 
        ? (isMale
            ? 'Chào mừng tất cả các bạn đã đến với phiên livestream hôm nay! Chúc mọi người luôn tràn đầy năng lượng!' 
            : 'Dạ em chào bạn đang theo dõi live nha! Em là Trợ Lý AI của phiên live, chúc bạn xem live thật vui vẻ ạ!')
        : 'Hello everyone! Thank you for joining our livestream today!'
    );
  }

  const textToSpeak = humanizeVoiceSpeechText(candidateText, voice) || cleanTextForVoiceSpeech(candidateText) || candidateText;
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
      console.warn('ElevenLabs fetch error, falling back to Microsoft Neural TTS:', e);
    }
  }

  // =========================================================================
  // TIER 2: MICROSOFT AZURE NEURAL TTS (CHUẨN 100% NAM RA NAM, NỮ RA NỮ)
  // =========================================================================
  try {
    const audioBuffer = await fetchAndDecodeTTSAudio(textToSpeak, voice);
    if (audioBuffer) {
      const success = await playAudioBufferWithDSP(audioBuffer, voice, effectiveVoiceVolume, requestedRate, onEnd, isTestingMode);
      if (success) return true;
    }
  } catch (dspErr) {
    console.warn('[voiceSyncService] Neural Voice synthesis error, fallback to WebSpeech:', dspErr);
  }

  // =========================================================================
  // TIER 3: CLIENT WEB SPEECH API (Dự phòng khi hoàn toàn ngoại tuyến)
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

      const voiceRate = voice?.rate || 1.05;
      const userRate = requestedRate !== undefined && !isNaN(requestedRate) ? Number(requestedRate) : 1.0;
      utterance.rate = Math.max(0.9, Math.min(1.3, voiceRate * userRate));
      utterance.volume = effectiveVoiceVolume;

      const availableVoices = (preloadedVoices.length > 0 ? preloadedVoices : window.speechSynthesis.getVoices()) || [];
      if (availableVoices.length > 0) {
        let matched = availableVoices.find(v => {
          const vLang = (v.lang || '').toLowerCase().replace('_', '-');
          const matchesLang = vLang.startsWith(shortLang) || vLang.includes(shortLang) || vLang === langCode.toLowerCase();
          const vName = (v.name || '').toLowerCase();
          if (isMale) {
            return matchesLang && (
              vName.includes('namminh') || vName.includes('male') || vName.includes('nam') ||
              vName.includes('david') || vName.includes('george') || vName.includes('james') ||
              vName.includes('mark') || vName.includes('guy') || vName.includes('alex')
            );
          } else {
            return matchesLang && (
              vName.includes('hoaimy') || vName.includes('female') || vName.includes('nữ') ||
              vName.includes('linh') || vName.includes('mai') || vName.includes('zira') ||
              vName.includes('samantha') || vName.includes('jenny')
            );
          }
        });

        if (!matched) {
          matched = availableVoices.find(v => {
            const vLang = (v.lang || '').toLowerCase().replace('_', '-');
            return vLang.startsWith(shortLang) || vLang.includes(shortLang);
          });
        }

        if (matched) {
          utterance.voice = matched;
        }
      }

      // Áp dụng pitch và rate đặc thù của từng giọng đọc
      utterance.pitch = voice?.pitch !== undefined ? Math.max(0.5, Math.min(1.8, Number(voice.pitch))) : (isMale ? 0.85 : 1.15);

      const playedSuccessfully = await new Promise((resolve) => {
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

        const maxDurationMs = Math.max(4500, textToSpeak.length * 160);
        const watchdog = setTimeout(() => finish(true), maxDurationMs);
        utterance.addEventListener('end', () => clearTimeout(watchdog));

        try {
          window.speechSynthesis.speak(utterance);
        } catch (spkErr) {
          finish(false);
        }
      });

      if (playedSuccessfully) {
        return true;
      }
    } catch (synthErr) {
      console.warn('Native Web Speech API error:', synthErr);
    }
  }

  if (onEnd) onEnd();
  return true;
}

export const speakVoiceAudio = previewVoiceAudio;
export const getDualVoiceConfig = getSavedVoiceConfig;
export const saveDualVoiceConfig = saveVoiceConfig;

export default {
  VIETNAMESE_HOTTREND_VOICES,
  VIETNAMESE_SALES_VOICES,
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
  humanizeVoiceSpeechText,
  formatTextForRegionalSpeech,
  updateActiveVoiceAudio,
  isSpeechActive,
  clearGlobalSpeechQueue,
  getFavoriteVoiceIds,
  toggleFavoriteVoiceId,
  isVoiceFavorite
};
