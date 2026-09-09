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
    pitch: 1.05,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn biên tập viên truyền hình quốc gia Hà Nội, đĩnh đạc, phát âm chuẩn mực, sang trọng.',
    sampleText: 'Kính chào quý vị và các bạn! Bản tin thời sự trực tiếp trên sóng livestream xin được phép bắt đầu với những tin tức quan trọng nhất.',
        edgePitch: '+2%',
    edgeRate: '+4%',
dspProfile: { semitones: 1.2, rate: 1.04, lowGain: 0.5, midFreq: 1100, midGain: 2.5, presenceFreq: 3500, presenceGain: 4.0, highGain: 2.5, compressor: { threshold: -20, ratio: 4, attack: 0.008, release: 0.2 } }
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
    pitch: 1.10,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ dẫn chương trình truyền hình sang trọng, cuốn hút, phát âm tròn vành rõ chữ.',
    sampleText: 'Chào mừng toàn thể quý khán giả đang theo dõi phiên phát sóng trực tiếp đặc biệt và ngập tràn ưu đãi ngày hôm nay!',
        edgePitch: '+10%',
    edgeRate: '+8%',
dspProfile: { semitones: 2.0, rate: 1.06, lowGain: -1.0, midFreq: 1250, midGain: 2.8, presenceFreq: 3900, presenceGain: 5.0, highGain: 3.5, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.25 } }
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
    pitch: 0.98,
    rate: 1.0,
    recommendedFor: 'idol',
    desc: 'Giọng nữ truyền cảm, ấm áp, sâu lắng, thích hợp đọc sách, podcast tâm sự đêm muộn.',
    sampleText: 'Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện tuyệt vời lắng đọng cảm xúc nhé.',
        edgePitch: '-14%',
    edgeRate: '-10%',
dspProfile: { semitones: 0.2, rate: 1.0, lowGain: 3.5, midFreq: 850, midGain: 2.0, presenceFreq: 2800, presenceGain: 1.5, highGain: -0.5, compressor: { threshold: -14, ratio: 2.5, attack: 0.03, release: 0.4 } }
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
    pitch: 1.25,
    rate: 1.15,
    recommendedFor: 'manager',
    desc: 'Giọng nữ chốt đơn livestream TikTok Shop tốc độ, năng động, thúc đẩy mua hàng dứt khoát.',
    sampleText: 'Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k trong giỏ hàng, các bạn đặt ngay kẻo lỡ nhé!',
        edgePitch: '+24%',
    edgeRate: '+22%',
dspProfile: { semitones: 3.8, rate: 1.15, lowGain: -2.0, midFreq: 1450, midGain: 3.2, presenceFreq: 3700, presenceGain: 6.5, highGain: 4.5, compressor: { threshold: -24, ratio: 6, attack: 0.003, release: 0.12 } }
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
    pitch: 1.20,
    rate: 1.14,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quảng cáo TVC chuyên nghiệp, cuốn hút, tạo cảm giác cấp bách chốt sale.',
    sampleText: 'Cơ hội săn sale vàng chỉ còn trong ít phút, hãy nhanh tay bấm vào giỏ hàng chốt đơn ngay kẻo hết quà tặng!',
        edgePitch: '+16%',
    edgeRate: '+18%',
dspProfile: { semitones: 3.0, rate: 1.14, lowGain: 0.0, midFreq: 1200, midGain: 2.5, presenceFreq: 4100, presenceGain: 5.5, highGain: 3.8, compressor: { threshold: -22, ratio: 5, attack: 0.004, release: 0.15 } }
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
    pitch: 1.14,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ xứ Huế đằm thắm, ngọt ngào, e ấp, âm điệu da diết chạm đến trái tim người nghe.',
    sampleText: 'Dạ em xin kính chào quý anh chị nì! Áo dài lụa thêu tay xứ Huế mười phân vẹn mười đây ạ, mời anh chị ghé xem ủng hộ em hí!',
        edgePitch: '+6%',
    edgeRate: '-5%',
dspProfile: { semitones: 2.2, rate: 1.04, lowGain: 1.0, midFreq: 1180, midGain: 2.6, presenceFreq: 3600, presenceGain: 4.8, highGain: 3.2, compressor: { threshold: -16, ratio: 3.2, attack: 0.015, release: 0.3 } }
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
    pitch: 1.20,
    rate: 1.08,
    recommendedFor: 'both',
    desc: 'Giọng nữ Đà Nẵng trong sáng, tươi tắn, gần gũi và mến khách.',
    sampleText: 'Dạ em chào mọi người nghe! Hôm nay shop em có chương trình ưu đãi cực khủng cho khách đặt hàng sớm nhất nè!',
        edgePitch: '+14%',
    edgeRate: '+10%',
dspProfile: { semitones: 2.8, rate: 1.08, lowGain: -0.5, midFreq: 1300, midGain: 2.8, presenceFreq: 3800, presenceGain: 5.2, highGain: 4.0, compressor: { threshold: -19, ratio: 3.8, attack: 0.008, release: 0.2 } }
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
    pitch: 1.12,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Trung Nghệ Tĩnh mộc mạc, chân thành, sâu lắng và giàu nghĩa tình.',
    sampleText: 'Em chào bà con cô bác đang xem live nha, đặc sản quê nhà sạch sẽ tinh tươm gửi trao tận tay mọi người đây ạ!',
        edgePitch: '-4%',
    edgeRate: '+4%',
dspProfile: { semitones: 1.8, rate: 1.05, lowGain: 0.8, midFreq: 1150, midGain: 2.5, presenceFreq: 3500, presenceGain: 4.2, highGain: 2.8, compressor: { threshold: -17, ratio: 3.4, attack: 0.012, release: 0.26 } }
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
    pitch: 1.28,
    rate: 1.12,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Idol livestream Sài Gòn ngọt ngào, thời thượng, thu hút mọi ánh nhìn.',
    sampleText: 'Dạ em Ngọc Nhi xin chào cả nhà mình nha! Mọi người thả tim và chấm một cái vào phần bình luận để em thấy tương tác nè!',
        edgePitch: '+20%',
    edgeRate: '+14%',
dspProfile: { semitones: 4.0, rate: 1.12, lowGain: -2.5, midFreq: 1550, midGain: 3.5, presenceFreq: 4200, presenceGain: 6.5, highGain: 5.5, compressor: { threshold: -21, ratio: 4.2, attack: 0.005, release: 0.15 } }
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
    pitch: 1.22,
    rate: 1.15,
    recommendedFor: 'both',
    desc: 'Giọng nữ KOC Sài Gòn bắt trend, nói chuyện có duyên, review sản phẩm cực kỳ chân thật.',
    sampleText: 'Món này cưng xỉu luôn mấy bà ơi! Chất lượng 10 điểm không có nhưng nha, bấm vô giỏ hàng hốt liền kẻo hết deal hời!',
        edgePitch: '+16%',
    edgeRate: '+16%',
dspProfile: { semitones: 3.2, rate: 1.15, lowGain: -1.5, midFreq: 1400, midGain: 3.0, presenceFreq: 3900, presenceGain: 5.5, highGain: 4.2, compressor: { threshold: -22, ratio: 4.8, attack: 0.004, release: 0.14 } }
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
    pitch: 1.24,
    rate: 1.12,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Tây sông nước ngọt ngào, chất phác, vui tươi, nghe là thấy mến thương liền.',
    sampleText: 'Dạ em Út Mai chào bà con cô bác mình nghen! Trái cây vườn nhà em hái tươi rói luôn nè, bà con đặt liền tay em gửi hỏa tốc nghen!',
        edgePitch: '+26%',
    edgeRate: '+12%',
dspProfile: { semitones: 3.4, rate: 1.12, lowGain: -1.0, midFreq: 1380, midGain: 3.0, presenceFreq: 4100, presenceGain: 6.0, highGain: 4.8, compressor: { threshold: -20, ratio: 4.0, attack: 0.006, release: 0.18 } }
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
    pitch: 1.16,
    rate: 1.08,
    recommendedFor: 'both',
    desc: 'Giọng nữ Cần Thơ đôn hậu, ngọt lịm như mía lùi, chuyên tư vấn đặc sản và nông sản miệt vườn.',
    sampleText: 'Dạ Cô Ba mến chào cả nhà mình nha! Bánh mứt kẹo dừa thơm ngon đặc sản miệt vườn bảo đảm ăn là ghiền nghen!',
        edgePitch: '+8%',
    edgeRate: '-2%',
dspProfile: { semitones: 2.4, rate: 1.08, lowGain: 0.5, midFreq: 1220, midGain: 2.8, presenceFreq: 3700, presenceGain: 5.0, highGain: 3.5, compressor: { threshold: -18, ratio: 3.6, attack: 0.01, release: 0.22 } }
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
    pitch: 1.04,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nữ doanh nhân Hà Nội thành đạt, đĩnh đạc, bản lĩnh và đầy sức hút.',
    sampleText: 'Chất lượng tạo nên đẳng cấp và uy tín bền vững. Chúng tôi luôn cam kết mang lại những giá trị hoàn hảo nhất cho khách hàng.',
        edgePitch: '-18%',
    edgeRate: '-4%',
dspProfile: { semitones: 1.0, rate: 1.02, lowGain: 2.0, midFreq: 1050, midGain: 2.5, presenceFreq: 3300, presenceGain: 3.5, highGain: 2.0, compressor: { threshold: -17, ratio: 3.5, attack: 0.01, release: 0.25 } }
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
    pitch: 1.34,
    rate: 1.08,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung ngọt ngào, dịu dàng, giao lưu trò chuyện thân thiết.',
    sampleText: 'Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim và tương tác cùng em nhé!',
        edgePitch: '+22%',
    edgeRate: '+6%',
dspProfile: { semitones: 4.8, rate: 1.08, lowGain: -3.0, midFreq: 1650, midGain: 3.5, presenceFreq: 4400, presenceGain: 7.0, highGain: 6.0, compressor: { threshold: -20, ratio: 3.8, attack: 0.005, release: 0.16 } }
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
    rate: 0.98,
    recommendedFor: 'idol',
    desc: 'Giọng nữ thì thầm êm ái, mang lại cảm giác thư thái dễ chịu cho giấc ngủ.',
    sampleText: 'Hãy nhắm mắt lại, thả lỏng toàn bộ cơ thể và tận hưởng những phút giây bình yên sâu lắng nhất nhé...',
        edgePitch: '-8%',
    edgeRate: '-14%',
dspProfile: { semitones: -0.5, rate: 0.98, lowGain: 3.0, midFreq: 900, midGain: 2.0, presenceFreq: 3000, presenceGain: 2.0, highGain: 1.0, compressor: { threshold: -12, ratio: 2.0, attack: 0.05, release: 0.5 } }
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
    pitch: 1.10,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ truyền cảm hứng mạnh mẽ, kích thích ý chí vươn lên và năng lượng tích cực.',
    sampleText: 'Mỗi ngày mới là một cơ hội để bạn bứt phá, nỗ lực hết mình và chạm tới đỉnh cao thành công rực rỡ!',
        edgePitch: '+6%',
    edgeRate: '+8%',
dspProfile: { semitones: 1.8, rate: 1.06, lowGain: 1.2, midFreq: 1080, midGain: 2.8, presenceFreq: 3350, presenceGain: 4.0, highGain: 2.5, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.22 } }
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
    pitch: 1.18,
    rate: 1.14,
    recommendedFor: 'both',
    desc: 'Giọng nữ review sản phẩm, video viral triệu view trên mạng xã hội.',
    sampleText: 'Review chân thật cho cả nhà đây! Sản phẩm hôm nay cực kỳ đỉnh, mọi người cùng xem ngay nhé!',
        edgePitch: '+18%',
    edgeRate: '+15%',
dspProfile: { semitones: 2.6, rate: 1.14, lowGain: -1.0, midFreq: 1350, midGain: 2.6, presenceFreq: 3500, presenceGain: 4.5, highGain: 3.5, compressor: { threshold: -20, ratio: 4, attack: 0.006, release: 0.18 } }
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
    pitch: 1.02,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ thuyết minh phóng sự tài liệu chuyên sâu, sâu sắc và thuyết phục.',
    sampleText: 'Hành trình khám phá văn hóa và con người Việt Nam luôn mang đến những giá trị sâu sắc và bài học vô giá.',
        edgePitch: '-6%',
    edgeRate: '+0%',
dspProfile: { semitones: 0.5, rate: 1.04, lowGain: 2.0, midFreq: 980, midGain: 2.5, presenceFreq: 3250, presenceGain: 3.5, highGain: 1.5, compressor: { threshold: -19, ratio: 4, attack: 0.01, release: 0.22 } }
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
    pitch: 1.30,
    rate: 1.22,
    recommendedFor: 'manager',
    desc: 'Giọng nữ giục đơn dồn dập, tạo hiệu ứng đám đông mua sắm cuồng nhiệt.',
    sampleText: 'Chỉ còn đúng 5 suất quà tặng độc quyền trong hôm nay, các bác bấm mua ngay góc trái màn hình kẻo hết nhé!',
        edgePitch: '+28%',
    edgeRate: '+25%',
dspProfile: { semitones: 4.5, rate: 1.22, lowGain: -2.5, midFreq: 1520, midGain: 3.6, presenceFreq: 4000, presenceGain: 6.8, highGain: 4.8, compressor: { threshold: -25, ratio: 6.5, attack: 0.002, release: 0.1 } }
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
    ageGroup: 'mature',
    styleCategory: 'sales_services',
    category: 'Giọng Sông Nước • Miền Tây',
    pitch: 0.72,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nam miền Tây mộc mạc, chân chất, ấm áp, đậm đà tình làng nghĩa xóm.',
    sampleText: 'Bà con mình yên tâm nha, hàng vườn nhà tôi tuyển chọn kỹ càng, chuẩn chỉ từng trái bao ăn ngọt lịm nghen!',
        edgePitch: '-10%',
    edgeRate: '+6%',
dspProfile: { semitones: -8.0, rate: 1.06, lowGain: 9.5, midFreq: 440, midGain: 3.6, presenceFreq: 2100, presenceGain: -1.0, highGain: -4.0, compressor: { threshold: -18, ratio: 4.0, attack: 0.012, release: 0.28 } }
  },
  {
    id: 'vn_nam_mientay_giongia',
    name: 'Anh Ba Cần Thơ 👑 (Nam - Sông Nước Hào Sảng [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Trai Miệt Vườn • Miền Tây',
    pitch: 0.78,
    rate: 1.12,
    recommendedFor: 'both',
    desc: 'Giọng nam miền Tây trẻ trung, hào sảng, vui tươi, bán hàng năng động cực duyên.',
    sampleText: 'Dạ anh Ba chào mấy anh mấy chị nghen! Vô live xem hàng rồi chốt lẹ tay để em gửi quà tặng khủng luôn nè!',
        edgePitch: '+4%',
    edgeRate: '+12%',
dspProfile: { semitones: -7.0, rate: 1.12, lowGain: 8.0, midFreq: 520, midGain: 3.2, presenceFreq: 2400, presenceGain: 1.5, highGain: -2.5, compressor: { threshold: -21, ratio: 4.6, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nam_danang_nhiethuyet',
    name: 'Văn Hùng 👑 (Nam - Đà Nẵng Trẻ Trung, Nhiệt Huyết [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Đà Nẵng Nhiệt Huyết • Miền Trung',
    pitch: 0.79,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng nam Đà Nẵng năng động, phóng khoáng, giọng điệu thân thiện và mến khách.',
    sampleText: 'Chào cả nhà mình nghe! Hôm nay gian hàng tụi mình có rất nhiều deal cực hot, anh em ghé qua xem liền nghe!',
        edgePitch: '+8%',
    edgeRate: '+10%',
dspProfile: { semitones: -6.8, rate: 1.10, lowGain: 7.8, midFreq: 560, midGain: 3.2, presenceFreq: 2500, presenceGain: 1.8, highGain: -2.0, compressor: { threshold: -20, ratio: 4.2, attack: 0.006, release: 0.18 } }
  },
  {
    id: 'vn_nam_hue_tramlang',
    name: 'Bảo Duy 👑 (Nam - Xứ Huế Trầm Lắng, Uy Nghi [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Xứ Huế Trầm Lắng • Miền Trung',
    pitch: 0.71,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nam cố đô Huế từ tốn, uy nghi, sâu lắng, đậm chất văn hóa cổ kính.',
    sampleText: 'Kính thưa quý vị, nét đẹp văn hóa cố đô trầm mặc ngàn năm luôn là niềm tự hào sâu sắc của mỗi người con đất Việt.',
        edgePitch: '-10%',
    edgeRate: '-4%',
dspProfile: { semitones: -8.5, rate: 1.02, lowGain: 10.2, midFreq: 390, midGain: 3.4, presenceFreq: 2000, presenceGain: -1.5, highGain: -4.5, compressor: { threshold: -17, ratio: 3.8, attack: 0.015, release: 0.3 } }
  },
  {
    id: 'vn_nam_chienbinh',
    name: 'Duy Long 👑 (Nam - Chiến Binh Hùng Tráng Hào Hùng [Miền Bắc])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'blv_game',
    category: 'Chiến Trận & Hào Hùng • Miền Bắc',
    pitch: 0.64,
    rate: 1.06,
    recommendedFor: 'game',
    desc: 'Giọng nam tướng quân uy nghi, hào sảng, vang dội như tiếng sấm.',
    sampleText: 'Vì màu cờ sắc áo, toàn quân ta quyết chí xung trận, giành lấy vinh quang vang dội ngàn thu!',
        edgePitch: '-24%',
    edgeRate: '+8%',
dspProfile: { semitones: -9.8, rate: 1.06, lowGain: 12.5, midFreq: 340, midGain: 4.5, presenceFreq: 2100, presenceGain: 1.5, highGain: -4.0, compressor: { threshold: -25, ratio: 7, attack: 0.003, release: 0.15 } }
  },
  {
    id: 'vn_nam_thaygiao',
    name: 'Gia Bảo 👑 (Nam - Thầy Giáo Giảng Bài Khoa Học [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'truyencamhung',
    category: 'Giảng Dạy & Tri Thức • Miền Bắc',
    pitch: 0.77,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng giảng viên rõ ràng, mạch lạc, truyền tải kiến thức dễ hiểu.',
    sampleText: 'Chào các bạn, hôm nay chúng ta sẽ cùng nhau tìm hiểu về những nguyên lý khoa học vô cùng thú vị và bổ ích.',
        edgePitch: '-2%',
    edgeRate: '+0%',
dspProfile: { semitones: -7.2, rate: 1.04, lowGain: 7.5, midFreq: 520, midGain: 2.5, presenceFreq: 2300, presenceGain: 0.5, highGain: -3.0, compressor: { threshold: -18, ratio: 3.5, attack: 0.01, release: 0.22 } }
  },
  {
    id: 'vn_nam_streamer_genz',
    name: 'Khánh Hoàng 👑 (Nam - Streamer Gen Z Sài Gòn Hài Hước [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Streamer & Gen Z • Miền Nam',
    pitch: 0.85,
    rate: 1.16,
    recommendedFor: 'idol',
    desc: 'Giọng nam trẻ phong cách streamer TikTok, dí dỏm, hài hước và gần gũi.',
    sampleText: 'Anh em thấy thế nào? Quá đỉnh chóp luôn đúng không? Nhớ thả tim và chia sẻ phiên live cho mình nhé!',
        edgePitch: '+16%',
    edgeRate: '+18%',
dspProfile: { semitones: -6.0, rate: 1.16, lowGain: 5.5, midFreq: 680, midGain: 3.0, presenceFreq: 2700, presenceGain: 2.5, highGain: -1.5, compressor: { threshold: -22, ratio: 5, attack: 0.004, release: 0.14 } }
  },
  {
    id: 'vn_nam_blv_thethao',
    name: 'Bảo Long 👑 (Nam - BLV Thể Thao Đỉnh Cao [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'blv_game',
    category: 'BLV Thể Thao • Miền Nam',
    pitch: 0.80,
    rate: 1.22,
    recommendedFor: 'game',
    desc: 'Giọng bình luận viên bóng đá/eSports hừng hực lửa, truyền lửa người xem.',
    sampleText: 'Vào! Một siêu phẩm không thể cản phá! Khán đài đang vỡ òa trong niềm vui sướng tột cùng anh em ơi!',
        edgePitch: '+18%',
    edgeRate: '+22%',
dspProfile: { semitones: -6.8, rate: 1.22, lowGain: 7.0, midFreq: 620, midGain: 3.8, presenceFreq: 2600, presenceGain: 3.8, highGain: -1.0, compressor: { threshold: -25, ratio: 7.5, attack: 0.002, release: 0.09 } }
  },
  {
    id: 'vn_nam_tuvan_khachhang',
    name: 'Trọng Nhân 👑 (Nam - Tư Vấn Tận Tâm Sài Gòn [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Tư Vấn Khách Hàng • Miền Nam',
    pitch: 0.78,
    rate: 1.06,
    recommendedFor: 'manager',
    desc: 'Giọng nam tư vấn nhẹ nhàng, nhiệt tình hỗ trợ giải đáp mọi thắc mắc.',
    sampleText: 'Dạ em chào anh chị ạ! Em rất hân hạnh được đồng hành và hỗ trợ giải đáp mọi thắc mắc của mình hôm nay ạ!',
        edgePitch: '+2%',
    edgeRate: '+4%',
dspProfile: { semitones: -7.2, rate: 1.06, lowGain: 7.0, midFreq: 540, midGain: 2.5, presenceFreq: 2200, presenceGain: -0.5, highGain: -3.0, compressor: { threshold: -17, ratio: 3.2, attack: 0.01, release: 0.2 } }
  },
  {
    id: 'vn_nam_video_viral',
    name: 'Hải Đăng 👑 (Nam - Review Triệu View Sài Gòn [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Video Viral • Miền Nam',
    pitch: 0.82,
    rate: 1.14,
    recommendedFor: 'both',
    desc: 'Giọng nam review công nghệ, sản phẩm hot trend thu hút triệu view.',
    sampleText: 'Review cực kỳ chi tiết cho anh em! Món này thực sự đáng đồng tiền bát gạo, trải nghiệm quá đã luôn!',
        edgePitch: '+10%',
    edgeRate: '+15%',
dspProfile: { semitones: -6.5, rate: 1.14, lowGain: 6.0, midFreq: 640, midGain: 3.0, presenceFreq: 2600, presenceGain: 1.8, highGain: -2.0, compressor: { threshold: -21, ratio: 4.5, attack: 0.005, release: 0.15 } }
  }
];

// ==================== 3. 20 GIỌNG CHUYÊN BIỆT BÁN HÀNG SẢN PHẨM & DỊCH VỤ ĐA NGÀNH (BẮC - TRUNG - NAM - TÂY) ====================
export const VIETNAMESE_SALES_VOICES = [
  {
    id: 'vn_sales_mypham_trangda',
    name: 'Minh Thảo 👑 (Nữ - Mỹ Phẩm, Skincare & Dưỡng Trắng Da [Sài Gòn])',
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
    desc: 'Giọng nữ ngọt ngào, tinh tế, am hiểu chuyên sâu về kem dưỡng, serum, son môi và mỹ phẩm cao cấp.',
    sampleText: 'Dạ làn da căng bóng mịn màng chuẩn Hàn Quốc chỉ sau 7 ngày! Hôm nay shop có voucher giảm 40% trong giỏ hàng, chị em chốt ngay nhé!',
        edgePitch: '+18%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 3.5, rate: 1.12, lowGain: -2.0, midFreq: 1420, midGain: 3.2, presenceFreq: 4200, presenceGain: 6.2, highGain: 5.2 }
  },
  {
    id: 'vn_sales_thoitrang_sangtrong',
    name: 'Khánh Vân 👑 (Nữ - Thời Trang Thiết Kế & Váy Hàng Hiệu [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Thời Trang & Hàng Hiệu • Miền Bắc',
    pitch: 1.16,
    rate: 1.10,
    recommendedFor: 'both',
    desc: 'Giọng nữ sang trọng, quý phái, tư vấn phối đồ, váy đầm thiết kế và túi xách hàng hiệu.',
    sampleText: 'Mẫu đầm lụa thiết kế cao cấp tôn dáng cực đỉnh, chất liệu mềm mịn thoáng mát, diện đi tiệc hay đi làm đều sang hết nấc luôn ạ!',
        edgePitch: '+6%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 2.2, rate: 1.10, lowGain: -0.5, midFreq: 1260, midGain: 2.8, presenceFreq: 3850, presenceGain: 5.0, highGain: 4.0 }
  },
  {
    id: 'vn_sales_giadung_tienich',
    name: 'Thanh Mai 👑 (Nữ - Đồ Gia Dụng & Bếp Tiện Ích Thông Minh [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Gia Dụng & Nhà Cửa • Miền Bắc',
    pitch: 1.10,
    rate: 1.14,
    recommendedFor: 'manager',
    desc: 'Giọng nữ nội trợ hiện đại, tư vấn nồi chiên không dầu, máy hút bụi, robot lau nhà cực kỳ uy tín.',
    sampleText: 'Nồi chiên không dầu dung tích lớn 8 lít, công nghệ nhiệt đối lưu giòn rụm không cần dầu mỡ, bảo hành chính hãng 2 năm đổi mới!',
        edgePitch: '+12%',
    edgeRate: '+10%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 1.6, rate: 1.14, lowGain: 0.5, midFreq: 1120, midGain: 2.5, presenceFreq: 3450, presenceGain: 4.5, highGain: 3.0 }
  },
  {
    id: 'vn_sales_congnghe_genz',
    name: 'Hoàng Nam 👑 (Nam - Đồ Công Nghệ, Smartphone & Gaming [Sài Gòn])',
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
    pitch: 0.85,
    rate: 1.18,
    recommendedFor: 'both',
    desc: 'Giọng nam nhạy bén, tốc độ, tư vấn cấu hình gaming, iPhone, laptop, tai nghe chống ồn siêu mượt.',
    sampleText: 'Màn hình 120Hz siêu mượt, chip xử lý thế hệ mới nhất chiến game max setting không nóng máy, giá sale sốc duy nhất tối nay!',
        edgePitch: '+14%',
    edgeRate: '+18%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -6.0, rate: 1.18, lowGain: 7.0, midFreq: 580, midGain: 3.8, presenceFreq: 2600, presenceGain: 1.0, highGain: -2.0 }
  },
  {
    id: 'vn_sales_batdongsan_thuongluu',
    name: 'Tuấn Phong 👑 (Nam - Bất Động Sản & Biệt Thự Triệu Đô [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Bất Động Sản Cao Cấp • Miền Bắc',
    pitch: 0.72,
    rate: 1.06,
    recommendedFor: 'manager',
    desc: 'Giọng nam chuyên gia bất động sản thượng lưu, phân tích vị trí vàng, tiềm năng sinh lời triệu đô.',
    sampleText: 'Khu đô thị sinh thái ven sông đẳng cấp bậc nhất, pháp lý minh bạch sổ đỏ trao tay, chính sách thanh toán ưu đãi 0% lãi suất!',
        edgePitch: '-16%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -8.0, rate: 1.06, lowGain: 10.5, midFreq: 420, midGain: 4.5, presenceFreq: 2100, presenceGain: -2.0, highGain: -4.5 }
  },
  {
    id: 'vn_sales_xehoi_uyquyen',
    name: 'Mạnh Hùng 👑 (Nam - Xe Hơi Ô Tô & Showroom Xe Sang [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Ô Tô & Xe Sang • Miền Bắc',
    pitch: 0.68,
    rate: 1.08,
    recommendedFor: 'manager',
    desc: 'Giọng nam trầm hùng đầy uy lực, tư vấn SUV, sedan hạng sang và chính sách lăn bánh tối ưu.',
    sampleText: 'Động cơ tăng áp mạnh mẽ, nội thất bọc da cao cấp cùng hệ thống an toàn đạt chuẩn 5 sao quốc tế, lái thử miễn phí tận nhà!',
        edgePitch: '-20%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -8.8, rate: 1.08, lowGain: 11.5, midFreq: 380, midGain: 4.5, presenceFreq: 1950, presenceGain: -3.0, highGain: -5.0 }
  },
  {
    id: 'vn_sales_thucpham_suckhoe',
    name: 'Bác Ba Thành 👑 (Nam - Thuốc Nam & Sức Khỏe Lão Niên [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'mature',
    styleCategory: 'sales_services',
    category: 'Sức Khỏe & Thuốc Nam • Miền Tây',
    pitch: 0.65,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nam cao tuổi mộc mạc, ân cần tư vấn thảo dược đông y, bổ xương khớp, dưỡng tâm an thần.',
    sampleText: 'Sức khỏe dồi dào, ăn ngon ngủ sâu giấc nhờ công thức thảo dược tự nhiên gia truyền, bà con mình an tâm đặt hàng dùng thử nghen!',
        edgePitch: '-30%',
    edgeRate: '-12%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -9.2, rate: 1.04, lowGain: 12.0, midFreq: 340, midGain: 4.5, presenceFreq: 1800, presenceGain: -4.0, highGain: -6.0 }
  },
  {
    id: 'vn_sales_mientay_nongsan',
    name: 'Cô Út Vườn 👑 (Nữ - Trái Cây & Nông Sản Miệt Vườn [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Nông Sản Miệt Vườn • Miền Tây',
    pitch: 1.22,
    rate: 1.12,
    recommendedFor: 'both',
    desc: 'Giọng nữ miệt vườn miền Tây xởi lởi, ngọt ngào, chuyên chốt đơn sầu riêng, bưởi da xanh, vú sữa hỏa tốc.',
    sampleText: 'Dạ sầu riêng cơm vàng hạt lép thơm lừng vườn nhà em mới cắt sáng nay, bao ăn 1 đổi 1 bà con đặt liền tay nghen!',
        edgePitch: '+26%',
    edgeRate: '+10%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 3.2, rate: 1.12, lowGain: -1.0, midFreq: 1350, midGain: 3.0, presenceFreq: 4000, presenceGain: 5.8, highGain: 4.5 }
  },
  {
    id: 'vn_sales_hue_dacsan',
    name: 'Mỹ Hạnh 👑 (Nữ - Trà Cung Đình & Đặc Sản Xứ Huế [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Đặc Sản Xứ Huế • Miền Trung',
    pitch: 1.15,
    rate: 1.05,
    recommendedFor: 'both',
    desc: 'Giọng nữ xứ Huế đằm thắm, ngọt ngào, giới thiệu trà cung đình, mắm ruốc, kẹo mè xửng trứ danh.',
    sampleText: 'Dạ trà cung đình xứ Huế thanh nhiệt giải độc, an thần ngủ ngon, kính mời quý khách đặt hàng thưởng thức vị ngon truyền thống ạ!',
        edgePitch: '+4%',
    edgeRate: '-6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 2.2, rate: 1.05, lowGain: 0.8, midFreq: 1180, midGain: 2.6, presenceFreq: 3600, presenceGain: 4.6, highGain: 3.2 }
  },
  {
    id: 'vn_sales_danang_haisan',
    name: 'Quốc Bảo 👑 (Nam - Hải Sản & Đặc Sản Biển Đà Nẵng [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Hải Sản Đà Nẵng • Miền Trung',
    pitch: 0.78,
    rate: 1.12,
    recommendedFor: 'both',
    desc: 'Giọng nam miền Trung hào sảng, tư vấn mực một nắng, chả bò Đà Nẵng, cá thu một nắng tươi ngon.',
    sampleText: 'Chả bò Đà Nẵng loại 1 thơm lừng giòn dai, mực một nắng dày thịt nướng lên là nhức nách, anh em đặt nhanh kẻo hết nghe!',
        edgePitch: '+6%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -7.0, rate: 1.12, lowGain: 8.0, midFreq: 520, midGain: 3.4, presenceFreq: 2400, presenceGain: 1.5, highGain: -2.2 }
  },
  {
    id: 'vn_sales_khoahoc_kinhdoanh',
    name: 'Thầy Tuấn 👑 (Nam - Khóa Học & Phát Triển Bản Thân [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Male',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Khóa Học & Kỹ Năng • Miền Bắc',
    pitch: 0.76,
    rate: 1.08,
    recommendedFor: 'both',
    desc: 'Giọng nam diễn giả truyền cảm hứng, hướng dẫn tư duy kinh doanh và phát triển bản thân vượt bậc.',
    sampleText: 'Lộ trình thực chiến từ con số 0 đến tự do tài chính! Tặng ngay bộ bí kíp chốt sale đỉnh cao cho 10 bạn đăng ký đầu tiên trên live!',
        edgePitch: '-6%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -7.2, rate: 1.08, lowGain: 8.5, midFreq: 480, midGain: 3.8, presenceFreq: 2300, presenceGain: 0.5, highGain: -2.5 }
  },
  {
    id: 'vn_sales_mevabe_diudang',
    name: 'Bảo Trân 👑 (Nữ - Mẹ & Bé, Bỉm Sữa Dinh Dưỡng [Sài Gòn])',
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
    desc: 'Giọng nữ mẹ bỉm ấm áp, thấu cảm, tư vấn tã bỉm hữu cơ, sữa tăng chiều cao và đồ chơi an toàn cho bé.',
    sampleText: 'Chất liệu bông hữu cơ mềm mại nâng niu làn da nhạy cảm của bé yêu, thấm hút siêu khô thoáng suốt 12 tiếng mẹ hoàn toàn yên tâm nhé!',
        edgePitch: '+16%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 2.8, rate: 1.08, lowGain: -1.2, midFreq: 1280, midGain: 2.8, presenceFreq: 3750, presenceGain: 5.0, highGain: 3.8 }
  },
  {
    id: 'vn_sales_amthuc_dacsan',
    name: 'Thảo Linh 👑 (Nữ - Ẩm Thực & Đặc Sản Ba Miền [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Ẩm Thực & Đặc Sản • Miền Bắc',
    pitch: 1.22,
    rate: 1.16,
    recommendedFor: 'both',
    desc: 'Giọng nữ giòn giã, xông xáo, vui tươi, kích thích vị giác người xem muốn đặt đồ ăn ngay lập tức.',
    sampleText: 'Đặc sản chuẩn vị gia truyền thơm ngon đậm đà, đóng gói hút chân không sạch sẽ giao hỏa tốc đến tận bàn ăn của các bác đây ạ!',
        edgePitch: '+10%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 3.0, rate: 1.16, lowGain: -0.8, midFreq: 1380, midGain: 3.0, presenceFreq: 4200, presenceGain: 5.8, highGain: 4.2 }
  },
  {
    id: 'vn_sales_spa_thammy',
    name: 'Bích Ngọc 👑 (Nữ - Spa & Thẩm Mỹ Viện Làm Đẹp VIP [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Spa & Thẩm Mỹ Viện • Miền Nam',
    pitch: 1.12,
    rate: 1.05,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quyến rũ, quý phái, ân cần tư vấn liệu trình trẻ hóa da, cấy collagen và nha khoa thẩm mỹ.',
    sampleText: 'Công nghệ nâng cơ trẻ hóa da không xâm lấn chuẩn Hàn, xóa mờ nếp nhăn tức thì trả lại 10 năm thanh xuân cho phái đẹp!',
        edgePitch: '+8%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 1.8, rate: 1.05, lowGain: 0.0, midFreq: 1100, midGain: 2.6, presenceFreq: 3400, presenceGain: 4.0, highGain: 3.2 }
  },
  {
    id: 'vn_sales_thethao_fitness',
    name: 'Cường Kevin 👑 (Nam - Gym Fitness & Thực Phẩm Thể Hình [Sài Gòn])',
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
    pitch: 0.82,
    rate: 1.22,
    recommendedFor: 'both',
    desc: 'Giọng nam HLV thể hình máu lửa, tràn trề năng lượng, tư vấn whey protein, máy chạy bộ, tạ tay.',
    sampleText: 'Bứt phá giới hạn bản thân, tăng cơ giảm mỡ nhanh chóng với dòng whey protein tinh khiết hấp thu siêu tốc anh em ơi!',
        edgePitch: '-8%',
    edgeRate: '+16%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -6.2, rate: 1.22, lowGain: 8.0, midFreq: 620, midGain: 4.0, presenceFreq: 2450, presenceGain: 1.2, highGain: -2.0 }
  },
  {
    id: 'vn_sales_dulich_nghiduong',
    name: 'Yến Nhi 👑 (Nữ - Vé Máy Bay, Tour Du Lịch & Resort 5 Sao [Đà Nẵng])',
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
    pitch: 1.18,
    rate: 1.14,
    recommendedFor: 'both',
    desc: 'Giọng nữ hướng dẫn viên tươi vui, năng động, tư vấn combo vé máy bay, resort biển và tour quốc tế.',
    sampleText: 'Combo nghỉ dưỡng 3 ngày 2 đêm tại resort 5 sao view biển cực đẹp, bao gồm vé máy bay khứ hồi và buffet sáng sang chảnh!',
        edgePitch: '+14%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 2.6, rate: 1.14, lowGain: -1.0, midFreq: 1320, midGain: 2.8, presenceFreq: 3950, presenceGain: 5.2, highGain: 4.0 }
  },
  {
    id: 'vn_sales_bacsi_duocpham',
    name: 'Bác Sĩ Trọng 👑 (Nam - Dược Mỹ Phẩm & TPCN Chuẩn Y Khoa [Hà Nội])',
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
    sampleText: 'Sản phẩm đạt chuẩn GMP của Bộ Y Tế, thành phần chiết xuất tự nhiên lành tính giúp tăng cường đề kháng và bảo vệ sức khỏe toàn diện.',
        edgePitch: '-12%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -7.8, rate: 1.04, lowGain: 9.0, midFreq: 450, midGain: 3.6, presenceFreq: 2200, presenceGain: -1.0, highGain: -3.5 }
  },
  {
    id: 'vn_sales_phongthuy_tramhuong',
    name: 'Hương Lan 👑 (Nữ - Trang Sức Kim Hoàn & Đá Phong Thủy [Hà Nội])',
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
    sampleText: 'Trầm hương tự nhiên tích tụ tinh hoa đất trời, mang lại vượng khí bình an và may mắn tài lộc cho chủ nhân sở hữu.',
        edgePitch: '-4%',
    edgeRate: '-8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 1.2, rate: 1.04, lowGain: 0.8, midFreq: 1080, midGain: 2.4, presenceFreq: 3300, presenceGain: 3.8, highGain: 2.5 }
  },
  {
    id: 'vn_sales_noithat_kientruc',
    name: 'Chí Bảo 👑 (Nam - Nội Thất Gỗ & Kiến Trúc Nhà Phố [Sài Gòn])',
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
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nam kiến trúc sư tinh tế, tư vấn bàn ghế sofa da bò Ý, tủ gỗ tự nhiên và thiết kế không gian sống.',
    sampleText: 'Nội thất gỗ tự nhiên nguyên khối gia công tỉ mỉ, đường nét tinh tế kiến tạo không gian sống tiện nghi và đẳng cấp cho tổ ấm.',
        edgePitch: '-14%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-NamMinhNeural',
dspProfile: { semitones: -7.5, rate: 1.06, lowGain: 9.0, midFreq: 460, midGain: 3.5, presenceFreq: 2150, presenceGain: -1.0, highGain: -3.5 }
  },
  {
    id: 'vn_sales_dochoi_thongminh',
    name: 'Thảo My 👑 (Nữ - Đồ Chơi Thông Minh & Giáo Dục Trẻ Em [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Đồ Chơi & Giáo Dục • Miền Nam',
    pitch: 1.32,
    rate: 1.10,
    recommendedFor: 'idol',
    desc: 'Giọng nữ hoạt bát, vui nhộn, tư vấn lego xếp hình, bảng vẽ điện tử và đồ chơi phát triển trí tuệ sớm.',
    sampleText: 'Bộ đồ chơi lắp ráp tư duy thông minh giúp bé tránh xa màn hình điện thoại, rèn luyện tính kiên nhẫn và sáng tạo vô hạn!',
        edgePitch: '+30%',
    edgeRate: '+10%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
dspProfile: { semitones: 4.8, rate: 1.10, lowGain: -3.0, midFreq: 1700, midGain: 3.5, presenceFreq: 4400, presenceGain: 7.0, highGain: 6.0 }
  }
];

// ==================== 4. 28 GIỌNG QUỐC TẾ PRO ĐA QUỐC GIA ====================
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

// Toàn bộ danh sách 89 giọng AI Studio Pro
export const ALL_SYSTEM_VOICES = [
  ...VIETNAMESE_FEMALE_VOICES,
  ...VIETNAMESE_MALE_VOICES,
  ...VIETNAMESE_SALES_VOICES,
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
const audioBufferMemoryCache = new Map();

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
 * Biến đổi âm thanh qua đồ thị Web Audio Graph (Parametric EQ + Formant Shift + Multi-Band Dynamics Compressor)
 * Đảm bảo: Giọng Nam ra đúng 100% Nam (trầm ấm, uy lực, nói nhanh dứt khoát, không bị kéo lê), 
 * Giọng Nữ ra đúng 100% Nữ (trong trẻo, ngọt ngào, nhấn nhá siêu đỉnh).
 */
/**
 * 🎛️ BỘ XỬ LÝ ÂM THANH MASTERING BROADCAST DSP CHUYÊN NGHIỆP:
 * Xuất tín hiệu chuẩn phòng thu livestream:
 * - Bảo toàn 100% âm sắc tự nhiên của giọng đọc AI (Không làm méo tiếng, không giả giọng).
 * - Chuỗi Parametric EQ + Dynamics Compressor tạo độ dầy, ấm, nét và uy lực cho livestream.
 */
async function playAudioBufferWithDSP(audioBuffer, voice, requestedVolume, requestedRate, onEnd, isTestingMode) {
  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return false;

  stopVoiceAudio();

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  activeSourceNode = source;

  const isMale = voice?.gender === 'Male' || voice?.gender === 'Nam';

  // Tốc độ phát đã được Edge TTS tổng hợp hoàn hảo bằng neural time-stretch
  // Giữ source.playbackRate = 1.0 để bảo toàn 100% âm sắc tự nhiên không bị méo tiếng
  source.playbackRate.value = 1.0;

  // 1. Low Shelf (Tăng độ ấm ngực cho giọng Nam / Giữ độ trong cho giọng Nữ)
  const lowFilter = audioCtx.createBiquadFilter();
  lowFilter.type = 'lowshelf';
  lowFilter.frequency.value = isMale ? 150 : 260;
  lowFilter.gain.value = isMale ? 3.0 : 0.5;

  // 2. Formant F1 / Mid Clarity (Nội lực âm thanh)
  const midFilter = audioCtx.createBiquadFilter();
  midFilter.type = 'peaking';
  midFilter.frequency.value = isMale ? 1100 : 1600;
  midFilter.Q.value = 1.2;
  midFilter.gain.value = isMale ? 1.5 : 1.5;

  // 3. Formant F2 / Presence Filter (Độ nét và bắt tai)
  const presenceFilter = audioCtx.createBiquadFilter();
  presenceFilter.type = 'peaking';
  presenceFilter.frequency.value = isMale ? 3000 : 3800;
  presenceFilter.Q.value = 1.4;
  presenceFilter.gain.value = isMale ? 1.5 : 2.5;

  // 4. High Shelf (Độ thoáng không gian)
  const highFilter = audioCtx.createBiquadFilter();
  highFilter.type = 'highshelf';
  highFilter.frequency.value = 6500;
  highFilter.gain.value = isMale ? 0.0 : 1.5;

  // 5. Dynamics Broadcast Compressor (Nén động lực livestream chuẩn đài phát thanh)
  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = isMale ? -22 : -18;
  compressor.knee.value = 6;
  compressor.ratio.value = 3.5;
  compressor.attack.value = 0.005;
  compressor.release.value = 0.15;

  // 6. Master Gain
  const masterGain = audioCtx.createGain();
  masterGain.gain.value = Math.max(0, Math.min(1.0, requestedVolume));

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
 * ⚡ TẢI VÀ GIẢI MÃ ÂM THANH MICROSOFT NEURAL TTS (CÓ BỘ NHỚ ĐỆM TỰ ĐỘNG)
 */
async function fetchAndDecodeTTSAudio(text, voice = null) {
  const isMale = voice?.gender === 'Male' || voice?.gender === 'Nam';
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

  const cacheKey = `${neuralVoice}_${effectivePitch}_${effectiveRate}_${text.trim().slice(0, 100)}`;
  if (audioBufferMemoryCache.has(cacheKey)) {
    return audioBufferMemoryCache.get(cacheKey);
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return null;

  const candidateUrls = [
    `/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(neuralVoice)}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(effectivePitch)}&rate=${encodeURIComponent(effectiveRate)}&lang=${encodeURIComponent(shortLang)}`,
    `http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(neuralVoice)}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(effectivePitch)}&rate=${encodeURIComponent(effectiveRate)}&lang=${encodeURIComponent(shortLang)}`,
    `/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(neuralVoice)}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(pitchHz)}&rate=${encodeURIComponent(ratePercent)}&lang=${encodeURIComponent(shortLang)}`,
    `http://127.0.0.1:3001/api/tts?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(neuralVoice)}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(pitchHz)}&rate=${encodeURIComponent(ratePercent)}&lang=${encodeURIComponent(shortLang)}`,
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(shortLang)}&q=${encodeURIComponent(text.slice(0, 200))}`
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

  // Chuẩn bị câu thoại chuẩn xác (ưu tiên câu thoại đặc trưng riêng biệt của từng giọng)
  let candidateText = sampleText;
  if (!candidateText || !candidateText.trim()) {
    candidateText = voice?.sampleText || (
      isVietnameseVoice 
        ? ((voice?.gender === 'Male' || voice?.gender === 'Nam') 
            ? 'Chào mừng tất cả các bạn đã đến với phiên livestream hôm nay! Chúc mọi người luôn tràn đầy năng lượng!' 
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

      const isMale = voice?.gender === 'Male' || voice?.gender === 'Nam';
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

      // Giữ pitch tự nhiên 1.0 tránh làm méo âm sắc giọng nói
      utterance.pitch = 1.0;

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
  VIETNAMESE_FEMALE_VOICES,
  VIETNAMESE_MALE_VOICES,
  VIETNAMESE_SALES_VOICES,
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
  clearGlobalSpeechQueue,
  getFavoriteVoiceIds,
  toggleFavoriteVoiceId,
  isVoiceFavorite
};
