/**
 * AVA LIVE - Unified High-Definition Multi-Voice & Distinct Acoustic DSP Architecture
 * 
 * HỆ THỐNG GIỌNG ĐỌC AI CAO CẤP CHUYÊN NGHIỆP:
 * 1. 25 Giọng Nữ Việt Nam Đỉnh Cao phân chia theo 3 độ tuổi (20-28t Trẻ trung | 28-40t Trưởng thành | 40-70t Trung/Lão niên)
 * 2. 20 Giọng Nam Việt Nam Trầm Hùng & Nam Tính (BLV Game PK, Phóng Sự VTV, Doanh Nhân, Chiến Binh, Lão Niên...)
 * 3. 20 Giọng Chuyên Biệt Bán Hàng Sản Phẩm & Dịch Vụ Đa Ngành
 * 4. 28 Giọng Quốc Tế Đa Ngôn Ngữ (Mỹ, Anh, Pháp, Đức, Ý, Tây Ban Nha, Nga, Trung, Nhật, Hàn, Thái...)
 * 
 * - 100% KHÁC BIỆT HOÀN TOÀN: Chuẩn Nam ra Nam (trầm ấm, uy lực, hào sảng), Chuẩn Nữ ra Nữ (ngọt ngào, trong trẻo, sang trọng).
 * - Cảm xúc đỉnh cao, nhấn nhá điêu luyện, thần thái chuyên nghiệp.
 * - Tích hợp hệ thống Yêu Thích (⭐ Star Favorite) lưu trữ kho giọng yêu thích tức thì.
 */

import { globalLipSyncEngine } from '../lib/avatar-sync/AvatarLipSyncEngine';

// ==================== 1. 25 GIỌNG NỮ VIỆT NAM CAO CẤP PHÂN THEO 3 ĐỘ TUỔI (20-28t | 28-40t | 40-70t) ====================
export const VIETNAMESE_FEMALE_VOICES = [
  // ---------------------------------------------------------------------------------------------------------
  // 🌸 PHÂN KHÚC 1: ĐỘ TUỔI 20 - 28 TUỔI (15 GIỌNG NỮ ĐỘC BẢN • ĐA VÙNG MIỀN • IDOL VIRAL • TÔNG SẮC HOÀN TOÀN KHÁC BIỆT)
  // ---------------------------------------------------------------------------------------------------------
  {
    id: 'free_vi_female',
    name: 'Hoài My 👑 (Nữ 20-28t - Quốc Dân Trong Trẻo Chuẩn Mực [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Quốc Dân Chuẩn Mực (20-28t) • Miền Bắc',
    pitch: 1.03,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trẻ trung trong trẻo quốc dân, phát âm mượt mà chuẩn mực Hà Thành, cảm xúc tươi tắn tự nhiên.',
    sampleText: 'Dạ em Hoài My xin chào các bác và anh chị đang xem live nha! Chúc mọi người một ngày mới tràn ngập niềm vui và năng lượng tích cực ạ!',
    edgePitch: '+3%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1200, midGain: 2.2, presenceFreq: 3600, presenceGain: 4.0, highGain: 2.8, reverb: 0.05, reverbDecay: 0.32, compressor: { threshold: -18, ratio: 3.5, attack: 0.008, release: 0.2 } }
  },
  {
    id: 'vn_nu_idol_live',
    name: 'Ngọc Nhi 👑 (Nữ 20-28t - Idol Livestream Trendy Sài Gòn [TP.HCM])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Idol Sài Gòn (20-28t) • Miền Nam',
    pitch: 1.08,
    rate: 1.05,
    recommendedFor: 'idol',
    desc: 'Giọng nữ Idol livestream Sài Gòn ngọt ngào, nũng nịu bắt trend TikTok, cuốn hút người xem từng giây.',
    sampleText: 'Dạ em Ngọc Nhi xin chào cả nhà mình nha! Mọi người thả tim và chấm một cái vào bình luận để em thấy tương tác nè!',
    edgePitch: '+8%',
    edgeRate: '+5%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.8, midFreq: 1400, midGain: 3.0, presenceFreq: 4200, presenceGain: 5.5, highGain: 4.0, reverb: 0.06, reverbDecay: 0.35, compressor: { threshold: -20, ratio: 4.2, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nu_anika_hoatngon',
    name: 'Anika Hoạt Ngôn 👑 (Nữ 20-28t - Creator Top 1 Trending TikTok & Reels [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Top 1 Trending',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Creator Viral (20-28t) • Miền Nam',
    pitch: 1.13,
    rate: 1.11,
    recommendedFor: 'idol',
    desc: 'Giọng nữ hoạt ngôn lanh lẹ, năng lượng bùng nổ, nói chuyện lưu loát bắt nhịp Gen Z đỉnh cao mạng xã hội.',
    sampleText: 'Hello cả nhà iu nha! Bật mí cho mấy bà deal siêu hời hôm nay nè, lướt qua là tiếc hùi hụi luôn đó nha!',
    edgePitch: '+13%',
    edgeRate: '+11%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.2, midFreq: 1550, midGain: 3.2, presenceFreq: 4600, presenceGain: 6.0, highGain: 4.5, reverb: 0.04, reverbDecay: 0.25, compressor: { threshold: -22, ratio: 4.5, attack: 0.003, release: 0.12 } }
  },
  {
    id: 'vn_nu_quynhluong_danhthiep',
    name: 'Quỳnh Lương 👑 (Nữ 20-28t - Nữ Hoàng Chốt Đơn Đanh Thép, Quyến Rũ [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'banhang',
    category: 'Chốt Đơn Đanh Thép (20-28t) • Miền Bắc',
    pitch: 0.97,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ quý cô sang trọng, sắc sảo đanh thép, phong thái tự tin bản lĩnh, chốt deal dứt khoát không trượt phát nào.',
    sampleText: 'Ai vào live của em thì chốt luôn và ngay giùm em nhé! Hàng chuẩn chính hãng nguyên seal, chần chừ là hết suất ưu đãi ngay đấy!',
    edgePitch: '-3%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.2, midFreq: 950, midGain: 2.8, presenceFreq: 3300, presenceGain: 4.2, highGain: 2.0, reverb: 0.05, reverbDecay: 0.30, compressor: { threshold: -19, ratio: 4.0, attack: 0.006, release: 0.18 } }
  },
  {
    id: 'vn_nu_jessica_sangchanh',
    name: 'Jessica Sang Chảnh 👑 (Nữ 20-28t - Reviewer Mỹ Phẩm & Luxury [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '💎 Luxury VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Mỹ Phẩm Luxury (20-28t) • Miền Nam',
    pitch: 1.10,
    rate: 1.00,
    recommendedFor: 'idol',
    desc: 'Giọng nữ điệu đà sang chảnh, hơi thở ASMR ngọt lịm thì thầm quyến rũ, chuyên mỹ phẩm, nước hoa và thời trang cao cấp.',
    sampleText: 'Mùi hương này thật sự sang chảnh xỉu luôn mấy chị ơi, xịt một cái là khí chất tiểu thư toát ra ngút ngàn liền nè!',
    edgePitch: '+10%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -0.5, midFreq: 1350, midGain: 2.5, presenceFreq: 4000, presenceGain: 5.0, highGain: 5.0, reverb: 0.10, reverbDecay: 0.45, compressor: { threshold: -18, ratio: 3.2, attack: 0.010, release: 0.22 } }
  },
  {
    id: 'vn_nu_khanhlinh_trendy',
    name: 'Khánh Linh 👑 (Nữ 20-28t - Cô Em Trendy Thời Trang Phố Cổ [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Fashion Trendy (20-28t) • Miền Bắc',
    pitch: 1.04,
    rate: 1.03,
    recommendedFor: 'both',
    desc: 'Giọng nữ thời trang thanh lịch phố cổ Hà Nội, từ ngữ tinh tế, phát âm tròn trịa sang trọng mười phân vẹn mười.',
    sampleText: 'Bộ outfit này phối lên chuẩn form tôn dáng cực kỳ luôn các chị đẹp ơi, diện đi tiệc hay đi cà phê đều đẹp xuất sắc nhé!',
    edgePitch: '+4%',
    edgeRate: '+3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.8, midFreq: 1250, midGain: 2.6, presenceFreq: 3700, presenceGain: 4.4, highGain: 3.2, reverb: 0.05, reverbDecay: 0.34, compressor: { threshold: -18, ratio: 3.6, attack: 0.007, release: 0.18 } }
  },
  {
    id: 'vn_nu_vienvibi_haihuoc',
    name: 'Viên Vibi 👑 (Nữ 20-28t - Cây Hài Livestream Duyên Dáng, Tếu Táo [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '🔥 Triệu View',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Hài Hước Duyên Dáng (20-28t) • Miền Nam',
    pitch: 1.15,
    rate: 1.08,
    recommendedFor: 'idol',
    desc: 'Giọng nữ hài hước, tếu táo lanh lẹ, tương tác cười giòn tan giữ chân người xem hàng giờ liền trên live.',
    sampleText: 'Trời đất ơi coi cái deal này nè mọi người ơi! Giá rẻ muốn xỉu luôn á, hổng bấm vô giỏ hàng mua là đêm về ngủ hổng yên đâu nha!',
    edgePitch: '+15%',
    edgeRate: '+8%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.5, midFreq: 1600, midGain: 3.5, presenceFreq: 4400, presenceGain: 5.8, highGain: 4.2, reverb: 0.04, reverbDecay: 0.28, compressor: { threshold: -21, ratio: 4.2, attack: 0.004, release: 0.14 } }
  },
  {
    id: 'vn_nu_mientay_giongia',
    name: 'Út Mai 👑 (Nữ 20-28t - Gái Miền Tây Sông Nước Ngọt Ngào, Mộc Mạc [Cần Thơ])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Sông Nước Cần Thơ (20-28t) • Miền Tây',
    pitch: 1.06,
    rate: 1.01,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Tây sông nước ngọt như mía lùi Cần Thơ, dạ thưa lễ phép dễ thương, đậm đà tình cảm miệt vườn.',
    sampleText: 'Dạ em Út Mai chào bà con cô bác mình nghen! Trái cây vườn nhà em hái tươi rói luôn nè, bà con đặt liền tay em gửi hỏa tốc nghen!',
    edgePitch: '+6%',
    edgeRate: '+1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.0, midFreq: 1280, midGain: 2.8, presenceFreq: 3600, presenceGain: 4.4, highGain: 2.8, reverb: 0.06, reverbDecay: 0.36, compressor: { threshold: -18, ratio: 3.4, attack: 0.008, release: 0.22 } }
  },
  {
    id: 'vn_nu_beba_bentre',
    name: 'Bé Ba Bến Tre 👑 (Nữ 20-28t - Khúc Khích Bán Nông Sản & Trái Cây [Bến Tre])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Gái Bến Tre Xứ Dừa (20-28t) • Miền Tây',
    pitch: 1.18,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ Bến Tre xứ dừa giòn giã chơn chất, nũng nịu mến khách ríu rít như chim hót, nghe là muốn mua ủng hộ ngay.',
    sampleText: 'Dạ em Bé Ba xứ dừa chào cả nhà nghen! Bánh phồng kẹo dừa béo ngậy thơm lừng nè, cô chú anh chị chốt liền tay ủng hộ em nghen!',
    edgePitch: '+18%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -1.0, midFreq: 1450, midGain: 3.0, presenceFreq: 4100, presenceGain: 5.2, highGain: 4.2, reverb: 0.05, reverbDecay: 0.30, compressor: { threshold: -20, ratio: 3.8, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nu_lananh_hue',
    name: 'Lan Anh Cố Đô 👑 (Nữ 20-28t - Nàng Thơ Xứ Huế Dịu Dàng, E Ấp [Thừa Thiên Huế])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'tam_su',
    category: 'Nàng Thơ Cố Đô Huế (20-28t) • Miền Trung',
    pitch: 0.98,
    rate: 0.97,
    recommendedFor: 'both',
    desc: 'Giọng nữ xứ Huế đằm thắm da diết, trầm bổng nhẹ nhàng, ngữ điệu "dạ nì dạ hí" thỏ thẻ làm say đắm lòng người.',
    sampleText: 'Dạ em Lan Anh kính chào quý anh chị nì! Mời anh chị ghé xem tà áo dài lụa thêu tay xứ Huế mười phân vẹn mười ủng hộ em hí!',
    edgePitch: '-2%',
    edgeRate: '-3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1100, midGain: 2.7, presenceFreq: 3400, presenceGain: 4.0, highGain: 2.5, reverb: 0.08, reverbDecay: 0.42, compressor: { threshold: -17, ratio: 3.2, attack: 0.012, release: 0.26 } }
  },
  {
    id: 'vn_nu_danang_duyendang',
    name: 'Ánh Tuyết 👑 (Nữ 20-28t - Nữ Sinh Đà Nẵng Trong Sáng, Tươi Tắn [Đà Nẵng])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Phố Biển Đà Nẵng (20-28t) • Miền Trung',
    pitch: 1.05,
    rate: 1.04,
    recommendedFor: 'both',
    desc: 'Giọng nữ Đà Nẵng rộn ràng tươi vui, mến khách miền biển, tiếng cười trong veo với phát âm đặc trưng Đà Thành duyên dáng.',
    sampleText: 'Dạ em chào mọi người nghe! Hôm nay shop em có chương trình ưu đãi cực khủng cho khách đặt hàng sớm nhất nè nì!',
    edgePitch: '+5%',
    edgeRate: '+4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.5, midFreq: 1280, midGain: 2.6, presenceFreq: 3800, presenceGain: 4.5, highGain: 3.2, reverb: 0.05, reverbDecay: 0.32, compressor: { threshold: -18, ratio: 3.6, attack: 0.007, release: 0.18 } }
  },
  {
    id: 'vn_nu_huonggiang_nghean',
    name: 'Hương Giang 👑 (Nữ 20-28t - Xứ Nghệ Nồng Nàn, Chân Thật [Nghệ An - Hà Tĩnh])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'young',
    styleCategory: 'sales_services',
    category: 'Gái Xứ Nghệ Nồng Nàn (20-28t) • Miền Trung',
    pitch: 1.01,
    rate: 1.01,
    recommendedFor: 'both',
    desc: 'Giọng nữ Nghệ Tĩnh đậm đà bản sắc, mộc mạc tha thiết giàu tình cảm, tạo sự tin tưởng tuyệt đối khi bán hàng & tư vấn.',
    sampleText: 'Dạ em Hương Giang xin chào các bác và anh chị nì! Hàng nhà em chuẩn xịn từng đường kim mũi chỉ, mọi người yên tâm ủng hộ em nhé!',
    edgePitch: '+1%',
    edgeRate: '+1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.5, midFreq: 1150, midGain: 2.5, presenceFreq: 3500, presenceGain: 4.0, highGain: 2.4, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -18, ratio: 3.5, attack: 0.009, release: 0.20 } }
  },
  {
    id: 'vn_nu_thaotam_songngu',
    name: 'Thảo Tâm 👑 (Nữ 20-28t - Hotgirl Học Bá Song Ngữ Anh - Việt [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '🌐 Song Ngữ Pro',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'young',
    styleCategory: 'mc_btv',
    category: 'Học Bá Song Ngữ (20-28t) • Miền Bắc',
    pitch: 1.04,
    rate: 1.06,
    recommendedFor: 'both',
    desc: 'Giọng nữ hiện đại tự tin, phát âm chuẩn cả tiếng Việt và thuật ngữ tiếng Anh, thích hợp cho đồ công nghệ, thời trang và giáo dục.',
    sampleText: 'Hi everyone, chào mừng các bạn đến với phiên live hôm nay! Sản phẩm này cực kỳ trendy với công nghệ đỉnh cao luôn nhé!',
    edgePitch: '+4%',
    edgeRate: '+6%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 0.6, midFreq: 1250, midGain: 2.5, presenceFreq: 3800, presenceGain: 4.8, highGain: 3.5, reverb: 0.05, reverbDecay: 0.30, compressor: { threshold: -19, ratio: 3.8, attack: 0.006, release: 0.16 } }
  },
  {
    id: 'vn_nu_ngotngao',
    name: 'Bảo Ngọc 👑 (Nữ 20-28t - Kẹo Ngọt Nũng Nịu Hút Hồn [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Kẹo Ngọt Nũng Nịu (20-28t) • Miền Nam',
    pitch: 1.22,
    rate: 1.02,
    recommendedFor: 'idol',
    desc: 'Giọng nữ điệu đà nũng nịu, mềm như nhung, ngọt lịm đốn tim người nghe khiến ai cũng muốn nhắn tin tương tác.',
    sampleText: 'Dạ em chào các anh chị em thân yêu đang xem live nha, mọi người thả tim và nhắn tin trò chuyện cùng em cho vui nhé!',
    edgePitch: '+22%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: -2.0, midFreq: 1700, midGain: 3.2, presenceFreq: 4500, presenceGain: 6.0, highGain: 4.8, reverb: 0.08, reverbDecay: 0.38, compressor: { threshold: -20, ratio: 3.6, attack: 0.005, release: 0.16 } }
  },
  {
    id: 'vn_nu_vtuber_nhinhanh',
    name: 'Nhật Hạ 👑 (Nữ 20-28t - Anime / VTuber Nhí Nhảnh Siêu Cute [Gen Z])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'young',
    styleCategory: 'idol_genz',
    category: 'Anime VTuber (20-28t) • Miền Nam',
    pitch: 1.26,
    rate: 1.12,
    recommendedFor: 'idol',
    desc: 'Giọng nữ phong cách Anime / VTuber nhí nhảnh cao vút líu lo, siêu cute, cực kỳ thu hút cộng đồng trẻ và game thủ.',
    sampleText: 'Cảm ơn các bạn đã ghé xem buổi live siêu cute của em nha! Nhớ bấm theo dõi kênh để nhận quà độc quyền nhé!',
    edgePitch: '+26%',
    edgeRate: '+12%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { semitones: 4.0, rate: 1.12, lowGain: -3.5, midFreq: 1900, midGain: 3.8, presenceFreq: 4800, presenceGain: 7.0, highGain: 5.5, compressor: { threshold: -23, ratio: 4.5, attack: 0.003, release: 0.12 } }
  },

  // ---------------------------------------------------------------------------------------------------------
  // 💎 PHÂN KHÚC 2: ĐỘ TUỔI 28 - 40 TUỔI (TRƯỞNG THÀNH • BTV VTV • MC SỰ KIỆN • DOANH NHÂN • LÃNH ĐẠO)
  // ---------------------------------------------------------------------------------------------------------
  {
    id: 'vn_nu_bientapvien',
    name: 'Mai Phương 👑 (Nữ 28-40t - BTV Thời Sự VTV Đĩnh Đạc [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'BTV Thời Sự (28-40t) • Miền Bắc',
    pitch: 1.01,
    rate: 0.99,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuẩn biên tập viên truyền hình quốc gia Hà Nội, đĩnh đạc, phát âm chuẩn mực và sang trọng tuyệt đối.',
    sampleText: 'Kính chào quý vị và các bạn! Bản tin phát sóng trực tiếp xin được phép bắt đầu với những thông tin quan trọng nhất.',
    edgePitch: '+1%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.8, midFreq: 1100, midGain: 2.4, presenceFreq: 3500, presenceGain: 3.8, highGain: 2.2, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -20, ratio: 3.8, attack: 0.008, release: 0.20 } }
  },
  {
    id: 'vn_nu_phongsu_vtv',
    name: 'Tuyết Mai 👑 (Nữ 28-40t - Phóng Sự & Tài Liệu VTV [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'Phóng Sự Tài Liệu (28-40t) • Miền Bắc',
    pitch: 0.99,
    rate: 0.99,
    recommendedFor: 'both',
    desc: 'Giọng nữ thuyết minh phóng sự tài liệu chuyên sâu, sâu sắc, ngữ điệu chững chạc và đầy sức thuyết phục.',
    sampleText: 'Hành trình khám phá văn hóa và chiều sâu con người Việt Nam luôn mang đến những giá trị và bài học vô giá.',
    edgePitch: '-1%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.4, midFreq: 1020, midGain: 2.5, presenceFreq: 3350, presenceGain: 3.6, highGain: 1.8, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -19, ratio: 3.8, attack: 0.010, release: 0.22 } }
  },
  {
    id: 'vn_nu_quyco_doanhnhan',
    name: 'Hồng Nhung 👑 (Nữ 28-40t - Nữ Doanh Nhân Quyền Quý [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'doanhnhan',
    category: 'Quý Bà Doanh Nhân (28-40t) • Miền Bắc',
    pitch: 0.97,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ doanh nhân Hà Nội thành đạt, đĩnh đạc, bản lĩnh, quyền uy và xây dựng niềm tin đối tác VIP.',
    sampleText: 'Chất lượng tạo nên đẳng cấp và uy tín bền vững. Chúng tôi luôn cam kết mang lại những giá trị hoàn hảo nhất cho quý khách hàng.',
    edgePitch: '-3%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.0, midFreq: 1050, midGain: 2.6, presenceFreq: 3300, presenceGain: 3.6, highGain: 1.8, reverb: 0.06, reverbDecay: 0.40, compressor: { threshold: -18, ratio: 3.8, attack: 0.010, release: 0.25 } }
  },
  {
    id: 'vn_nu_truyencamhung',
    name: 'Ánh Dương 👑 (Nữ 28-40t - Diễn Giả Truyền Cảm Hứng & Động Lực [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'truyencamhung',
    category: 'Truyền Cảm Hứng (28-40t) • Miền Bắc',
    pitch: 1.02,
    rate: 1.02,
    recommendedFor: 'both',
    desc: 'Giọng nữ diễn giả truyền cảm hứng mạnh mẽ, kích thích ý chí vươn lên và lan tỏa năng lượng tích cực.',
    sampleText: 'Mỗi ngày mới là một cơ hội để bạn bứt phá, nỗ lực hết mình và chạm tới những đỉnh cao thành công rực rỡ!',
    edgePitch: '+2%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.6, midFreq: 1150, midGain: 2.6, presenceFreq: 3500, presenceGain: 4.0, highGain: 2.5, reverb: 0.05, reverbDecay: 0.35, compressor: { threshold: -18, ratio: 3.5, attack: 0.010, release: 0.22 } }
  },
  {
    id: 'vn_nu_quangcao_tvc',
    name: 'Lan Anh 👑 (Nữ 28-40t - TVC Quảng Cáo & Giới Thiệu Cao Cấp [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'middle',
    styleCategory: 'banhang',
    category: 'TVC Quảng Cáo (28-40t) • Miền Bắc',
    pitch: 1.02,
    rate: 1.02,
    recommendedFor: 'manager',
    desc: 'Giọng nữ quảng cáo TVC chuyên nghiệp, cuốn hút, sang trọng và thúc đẩy hành động mua hàng tinh tế.',
    sampleText: 'Cơ hội sở hữu dòng sản phẩm thượng lưu với ưu đãi độc quyền chỉ dành riêng cho quý khách hàng trong hôm nay!',
    edgePitch: '+2%',
    edgeRate: '+2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.2, midFreq: 1200, midGain: 2.5, presenceFreq: 3900, presenceGain: 4.5, highGain: 2.8, reverb: 0.05, reverbDecay: 0.32, compressor: { threshold: -19, ratio: 4.0, attack: 0.007, release: 0.18 } }
  },
  {
    id: 'vn_nu_saigon_thanhlich',
    name: 'Minh Thư 👑 (Nữ 28-40t - MC Sự Kiện & Hội Nghị Sài Gòn [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'mc_btv',
    category: 'MC Hội Nghị (28-40t) • Miền Nam',
    pitch: 1.01,
    rate: 1.01,
    recommendedFor: 'both',
    desc: 'Giọng nữ MC sự kiện Sài Gòn sang trọng, nhẹ nhàng, thanh lịch, tạo sự chuyên nghiệp cho buổi lễ.',
    sampleText: 'Kính thưa quý vị đại biểu và quý khách hàng, chương trình hội nghị trực tuyến xin trân trọng kính chào toàn thể quý vị!',
    edgePitch: '+1%',
    edgeRate: '+1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.4, midFreq: 1180, midGain: 2.4, presenceFreq: 3550, presenceGain: 3.9, highGain: 2.6, reverb: 0.05, reverbDecay: 0.36, compressor: { threshold: -18, ratio: 3.6, attack: 0.009, release: 0.22 } }
  },
  {
    id: 'vn_nu_hue_diudang',
    name: 'Mỹ Tâm 👑 (Nữ 28-40t - Cố Đô Huế Dịu Dàng, Ngọt Ngào [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'middle',
    styleCategory: 'tam_su',
    category: 'Giọng Xứ Huế (28-40t) • Miền Trung',
    pitch: 1.01,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng nữ xứ Huế đằm thắm, ngọt ngào, e ấp, âm điệu da diết chạm đến từng ngóc ngách tâm hồn.',
    sampleText: 'Dạ em xin kính chào quý anh chị nì! Áo dài lụa thêu tay xứ Huế mười phân vẹn mười đây ạ, mời anh chị ghé xem ủng hộ em hí!',
    edgePitch: '+1%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1150, midGain: 2.6, presenceFreq: 3500, presenceGain: 4.0, highGain: 2.6, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -16, ratio: 3.0, attack: 0.012, release: 0.28 } }
  },
  {
    id: 'vn_nu_mientay_cantho',
    name: 'Cô Ba Cần Thơ 👑 (Nữ 28-40t - Sông Nước Ngọt Lịm [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Sông Nước Cần Thơ (28-40t) • Miền Tây',
    pitch: 1.01,
    rate: 0.99,
    recommendedFor: 'both',
    desc: 'Giọng nữ Cần Thơ đôn hậu, ngọt lịm như mía lùi, chuyên gia tư vấn đặc sản và nông sản miệt vườn.',
    sampleText: 'Dạ Cô Ba mến chào cả nhà mình nha! Bánh mứt kẹo dừa thơm ngon đặc sản miệt vườn bảo đảm ăn là ghiền nghen!',
    edgePitch: '+1%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.0, midFreq: 1180, midGain: 2.5, presenceFreq: 3550, presenceGain: 4.0, highGain: 2.6, reverb: 0.06, reverbDecay: 0.36, compressor: { threshold: -17, ratio: 3.4, attack: 0.010, release: 0.24 } }
  },
  {
    id: 'vn_nu_chuyengia_tuvan',
    name: 'Diễm My 👑 (Nữ 28-40t - Chuyên Gia Tư Vấn Phong Thủy & Thẩm Mỹ [Sài Gòn])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'middle',
    styleCategory: 'sales_services',
    category: 'Chuyên Gia Tư Vấn (28-40t) • Miền Nam',
    pitch: 1.00,
    rate: 1.00,
    recommendedFor: 'both',
    desc: 'Giọng nữ chuyên gia Sài Gòn điềm tĩnh, sâu sắc, phân tích thấu đáo, độ tin cậy tuyệt đối.',
    sampleText: 'Mỗi chi tiết đều mang ý nghĩa phong thủy và giá trị thẩm mỹ bền lâu. Hãy để chúng tôi đồng hành cùng sự thịnh vượng của bạn.',
    edgePitch: '+0%',
    edgeRate: '+0%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 1.8, midFreq: 1120, midGain: 2.4, presenceFreq: 3450, presenceGain: 3.7, highGain: 2.3, reverb: 0.06, reverbDecay: 0.36, compressor: { threshold: -18, ratio: 3.5, attack: 0.010, release: 0.22 } }
  },

  // ---------------------------------------------------------------------------------------------------------
  // 🌾 PHÂN KHÚC 3: ĐỘ TUỔI 40 - 70 TUỔI (TRUNG NIÊN & LÃO NIÊN • ĐIỀM ĐẠM • TRẦM ẤM • TÂM SỰ & BÁC SĨ)
  // ---------------------------------------------------------------------------------------------------------
  {
    id: 'vn_nu_kechuyen',
    name: 'Hương Giang 👑 (Nữ 40-70t - Đọc Truyện Đêm Khuya & Podcast [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'elder',
    styleCategory: 'tam_su',
    category: 'Kể Chuyện Đêm Khuya (40-70t) • Miền Bắc',
    pitch: 0.96,
    rate: 0.96,
    recommendedFor: 'idol',
    desc: 'Giọng nữ trung niên truyền cảm, ấm áp, sâu lắng, thích hợp đọc sách, truyện đêm muộn và podcast chữa lành.',
    sampleText: 'Đêm đã về khuya, hãy cùng lắng đọng tâm hồn và thưởng thức những câu chuyện ấm áp nghĩa tình bạn nhé.',
    edgePitch: '-4%',
    edgeRate: '-4%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.4, midFreq: 950, midGain: 2.6, presenceFreq: 3100, presenceGain: 2.8, highGain: 1.5, reverb: 0.08, reverbDecay: 0.44, compressor: { threshold: -16, ratio: 3.0, attack: 0.020, release: 0.32 } }
  },
  {
    id: 'vn_nu_asmr_thitham',
    name: 'Hải Yến 👑 (Nữ 40-70t - ASMR Thiền Định & Chữa Lành [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'elder',
    styleCategory: 'tam_su',
    category: 'ASMR Thiền Định (40-70t) • Miền Bắc',
    pitch: 0.97,
    rate: 0.93,
    recommendedFor: 'idol',
    desc: 'Giọng nữ thì thầm êm ái, mang lại cảm giác an yên tĩnh tại và giấc ngủ sâu.',
    sampleText: 'Hãy nhắm mắt lại, thả lỏng toàn bộ cơ thể và tận hưởng những phút giây bình yên sâu lắng nhất trong tâm hồn...',
    edgePitch: '-3%',
    edgeRate: '-7%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.0, midFreq: 920, midGain: 2.2, presenceFreq: 3000, presenceGain: 2.2, highGain: 1.4, reverb: 0.09, reverbDecay: 0.48, compressor: { threshold: -14, ratio: 2.4, attack: 0.035, release: 0.42 } }
  },
  {
    id: 'vn_nu_bacsi_tamly',
    name: 'Bác Sĩ Thu Cúc 👑 (Nữ 40-70t - Bác Sĩ Tâm Lý & Sức Khỏe Gia Đình [Hà Nội])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'bac',
    ageGroup: 'elder',
    styleCategory: 'sales_services',
    category: 'Bác Sĩ Sức Khỏe (40-70t) • Miền Bắc',
    pitch: 0.95,
    rate: 0.97,
    recommendedFor: 'both',
    desc: 'Giọng nữ bác sĩ trung niên điềm đạm, ân cần, lương y từ mẫu, tư vấn chăm sóc sức khỏe và tâm lý gia đình.',
    sampleText: 'Sức khỏe là tài sản quý giá nhất của mỗi người. Bác sĩ chúc bạn và gia đình luôn an khang, dồi dào sinh lực.',
    edgePitch: '-5%',
    edgeRate: '-3%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.2, midFreq: 980, midGain: 2.5, presenceFreq: 3200, presenceGain: 3.2, highGain: 1.6, reverb: 0.07, reverbDecay: 0.40, compressor: { threshold: -17, ratio: 3.2, attack: 0.015, release: 0.28 } }
  },
  {
    id: 'vn_nu_bame_mientay',
    name: 'Má Bảy Bến Tre 👑 (Nữ 40-70t - Má Bảy Miệt Vườn Phúc Hậu [Miền Tây])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'tay',
    ageGroup: 'elder',
    styleCategory: 'sales_services',
    category: 'Má Bảy Miệt Vườn (40-70t) • Miền Tây',
    pitch: 0.98,
    rate: 0.98,
    recommendedFor: 'both',
    desc: 'Giọng người mẹ miền Tây phúc hậu, mộc mạc, thương yêu con cháu, chân chất hiền từ.',
    sampleText: 'Dạ Má Bảy chào các con các cháu nghen! Nông sản quê mình trồng sạch sẽ, ngon lành Má gửi trao tận tay nghen!',
    edgePitch: '-2%',
    edgeRate: '-2%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.8, midFreq: 1050, midGain: 2.5, presenceFreq: 3350, presenceGain: 3.5, highGain: 2.0, reverb: 0.07, reverbDecay: 0.40, compressor: { threshold: -17, ratio: 3.2, attack: 0.012, release: 0.26 } }
  },
  {
    id: 'vn_nu_nghean_damda',
    name: 'Phương Oanh 👑 (Nữ 40-70t - Nghệ Tĩnh Đậm Đà Tình Quê [Miền Trung])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'trung',
    ageGroup: 'elder',
    styleCategory: 'tam_su',
    category: 'Nghệ Tĩnh Tình Quê (40-70t) • Miền Trung',
    pitch: 0.97,
    rate: 0.99,
    recommendedFor: 'both',
    desc: 'Giọng nữ miền Trung Nghệ Tĩnh trung niên mộc mạc, chân thành, sâu lắng và giàu nghĩa tình quê hương.',
    sampleText: 'Tôi xin chào bà con cô bác đang xem live nha, đặc sản quê nhà sạch sẽ tinh tươm gửi trao tận tay mọi người đây ạ!',
    edgePitch: '-3%',
    edgeRate: '-1%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 2.8, midFreq: 1060, midGain: 2.5, presenceFreq: 3350, presenceGain: 3.4, highGain: 2.0, reverb: 0.06, reverbDecay: 0.38, compressor: { threshold: -17, ratio: 3.4, attack: 0.012, release: 0.25 } }
  },
  {
    id: 'vn_nu_quocdan_laonien',
    name: 'Bà Tư Cổ Tích 👑 (Nữ 40-70t - Kể Chuyện Xưa & Ca Dao Nam Bộ [Miền Nam])',
    provider: 'system',
    tier: 'pro',
    badge: '👑 Studio VIP',
    gender: 'Female',
    lang: 'vi-VN',
    region: 'vi',
    dialect: 'nam',
    ageGroup: 'elder',
    styleCategory: 'tam_su',
    category: 'Bà Tư Cổ Tích (40-70t) • Miền Nam',
    pitch: 0.94,
    rate: 0.95,
    recommendedFor: 'both',
    desc: 'Giọng bà cụ Nam Bộ trầm ấm, đôn hậu, đọc ca dao cổ tích và chia sẻ kinh nghiệm sống lắng đọng.',
    sampleText: 'Bà Tư mến chào các cháu thân thương nghen! Ngồi quây quần lại đây bà kể cho nghe chuyện đời xưa tích cũ nghen các con.',
    edgePitch: '-6%',
    edgeRate: '-5%',
    neuralVoice: 'vi-VN-HoaiMyNeural',
    dspProfile: { lowGain: 3.6, midFreq: 920, midGain: 2.6, presenceFreq: 3000, presenceGain: 2.8, highGain: 1.4, reverb: 0.08, reverbDecay: 0.45, compressor: { threshold: -16, ratio: 3.0, attack: 0.020, release: 0.35 } }
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

// ==================== 4. BỘ 40 GIỌNG NỮ MASTER VOICE DNA & HOT TREND VIỆT NAM (5 TẦNG DNA CHUẨN) ====================
export const MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES = [
  {
    "id": "vn_f_sales_south_sweet_01",
    "name": "01. Sweet Spark 👑 (Miền Nam Ngọt Ngào, Bắt Tai)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.06,
    "rate": 1.04,
    "recommendedFor": "both",
    "desc": "Giọng nữ miền Nam 20-24t ngọt ngào, tươi sáng, mở âm nụ cười thu hút ngay từ từ đầu tiên, chốt đơn tự nhiên và dễ mến.",
    "sampleText": "Dạ em chào cả nhà mình nha! Hôm nay em mang đến một bất ngờ siêu ngọt ngào luôn nè, ai chốt đơn liền tay trên live là có quà xịn liền nha!",
    "edgePitch": "+6%",
    "edgeRate": "+4%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Neutral",
        "accent_strength": 55
      },
      "persona": {
        "age": "20-24",
        "personality": "ngọt ngào, tươi vui, gần gũi, cuốn hút",
        "authority": 72,
        "friendliness": 98
      },
      "style": {
        "primary": "livestream_sales",
        "secondary": [
          "sweet_consulting",
          "soft_cta",
          "smile_closing"
        ]
      },
      "emotion": {
        "warmth": 96,
        "happiness": 91,
        "excitement": 82,
        "confidence": 82,
        "urgency": 58,
        "empathy": 90
      },
      "acoustic": {
        "pitch": 78,
        "pitch_range": 72,
        "depth": 25,
        "warmth": 94,
        "resonance": 48,
        "breathiness": 18,
        "clarity": 93,
        "articulation": 91,
        "speed": 79,
        "rhythm": 87,
        "intonation": 94,
        "energy": 86,
        "emphasis": 86,
        "pause": 43
      },
      "performance": {
        "vocal_placement": "head/oral-forward",
        "texture": "silky-bright",
        "mouth_profile": "rounded-medium",
        "onset": "smile + gentle pitch lift",
        "ending": "warm-fall",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.5,
      "midFreq": 1350,
      "midGain": 2.8,
      "presenceFreq": 4200,
      "presenceGain": 5.2,
      "highGain": 3.8,
      "reverb": 0.05,
      "reverbDecay": 0.32,
      "compressor": {
        "threshold": -20,
        "ratio": 3.8,
        "attack": 0.005,
        "release": 0.15
      }
    }
  },
  {
    "id": "vn_f_sales_north_energy_02",
    "name": "02. Bright Bullet 👑 (Nữ Bắc Hoạt Ngôn Siêu Tốc)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.08,
    "rate": 1.12,
    "recommendedFor": "both",
    "desc": "Giọng nữ Bắc trẻ cực kỳ nhanh nhạy, phụ âm bật sắc nét, năng lượng bùng nổ xử lý mọi tương tác bình luận trong chớp mắt.",
    "sampleText": "Chào mừng các bác đã ghé livestream của em! Deal độc quyền giá sốc chỉ mở đúng trong 60 giây thôi, các bác nhanh tay bấm mua ngay kẻo lỡ nha!",
    "edgePitch": "+8%",
    "edgeRate": "+12%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Conversational",
        "accent_strength": 65
      },
      "persona": {
        "age": "20-24",
        "personality": "nhanh nhạy, sắc sảo, tự tin, hoạt ngôn",
        "authority": 80,
        "friendliness": 90
      },
      "style": {
        "primary": "rapid_sales",
        "secondary": [
          "fast_reaction",
          "flash_sale",
          "comment_interaction"
        ]
      },
      "emotion": {
        "warmth": 81,
        "happiness": 92,
        "excitement": 98,
        "confidence": 88,
        "urgency": 88,
        "empathy": 75
      },
      "acoustic": {
        "pitch": 81,
        "pitch_range": 86,
        "depth": 21,
        "warmth": 81,
        "resonance": 44,
        "breathiness": 12,
        "clarity": 95,
        "articulation": 94,
        "speed": 96,
        "rhythm": 98,
        "intonation": 98,
        "energy": 99,
        "emphasis": 96,
        "pause": 20
      },
      "performance": {
        "vocal_placement": "oral-forward",
        "texture": "crisp-bright",
        "mouth_profile": "compact-fast",
        "onset": "rapid onset + punchy consonants",
        "ending": "energetic fall",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 0.2,
      "midFreq": 1450,
      "midGain": 3.2,
      "presenceFreq": 4400,
      "presenceGain": 5.8,
      "highGain": 4.2,
      "reverb": 0.04,
      "reverbDecay": 0.24,
      "compressor": {
        "threshold": -22,
        "ratio": 4.5,
        "attack": 0.003,
        "release": 0.12
      }
    }
  },
  {
    "id": "vn_f_sales_cute_03",
    "name": "03. Cute Wave 👑 (Dễ Thương Tự Nhiên, Hút Fan)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.11,
    "rate": 1.02,
    "recommendedFor": "both",
    "desc": "Giọng nữ trẻ dễ thương tự nhiên, không làm nũng giả tạo, âm hơi nhẹ nhàng tạo cảm giác cưng xỉu cho sản phẩm phụ kiện, thời trang.",
    "sampleText": "Hihi chiếc áo này xinh xỉu luôn á mọi người ơi! Mặc lên tôn dáng cực kỳ, nhìn là mê liền luôn đó nha!",
    "edgePitch": "+11%",
    "edgeRate": "+2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Youthful",
        "accent_strength": 52
      },
      "persona": {
        "age": "20-24",
        "personality": "dễ thương, trong sáng, đáng yêu, vui tươi",
        "authority": 60,
        "friendliness": 100
      },
      "style": {
        "primary": "cute_sales",
        "secondary": [
          "fashion_accessories",
          "fan_magnet",
          "lifestyle"
        ]
      },
      "emotion": {
        "warmth": 95,
        "happiness": 97,
        "excitement": 88,
        "confidence": 78,
        "playfulness": 94,
        "empathy": 88
      },
      "acoustic": {
        "pitch": 86,
        "pitch_range": 82,
        "depth": 18,
        "warmth": 92,
        "resonance": 36,
        "breathiness": 27,
        "clarity": 89,
        "articulation": 86,
        "speed": 76,
        "rhythm": 85,
        "intonation": 99,
        "energy": 89,
        "emphasis": 82,
        "pause": 38
      },
      "performance": {
        "vocal_placement": "head-forward",
        "texture": "airy-soft",
        "mouth_profile": "soft-round",
        "onset": "cute smile breath",
        "ending": "playful lift",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -1.8,
      "midFreq": 1600,
      "midGain": 3,
      "presenceFreq": 4800,
      "presenceGain": 6,
      "highGain": 4.6,
      "reverb": 0.06,
      "reverbDecay": 0.32,
      "compressor": {
        "threshold": -20,
        "ratio": 3.5,
        "attack": 0.005,
        "release": 0.16
      }
    }
  },
  {
    "id": "vn_f_sales_south_energy_04",
    "name": "04. Live Queen 👑 (Nữ Hoàng Livestream Hoạt Náo)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.07,
    "rate": 1.09,
    "recommendedFor": "both",
    "desc": "Giọng nữ livestream chuyên nghiệp, tương phản âm lượng và nhịp điệu đỉnh cao, kéo view giữ chân từ đầu tới cuối phiên.",
    "sampleText": "Cả nhà mình ơi bấm tim liên tục giúp em nha! Chuẩn bị đếm ngược 3 giây để mở kho 50 suất giảm nửa giá đây ạ!",
    "edgePitch": "+7%",
    "edgeRate": "+9%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Live Pro",
        "accent_strength": 55
      },
      "persona": {
        "age": "20-24",
        "personality": "hoạt náo, nhiệt huyết, lôi cuốn, chuyên nghiệp",
        "authority": 85,
        "friendliness": 95
      },
      "style": {
        "primary": "live_hosting",
        "secondary": [
          "mega_sales",
          "audience_retention",
          "fast_cta"
        ]
      },
      "emotion": {
        "warmth": 83,
        "happiness": 94,
        "excitement": 97,
        "confidence": 92,
        "urgency": 86,
        "empathy": 80
      },
      "acoustic": {
        "pitch": 77,
        "pitch_range": 88,
        "depth": 26,
        "warmth": 83,
        "resonance": 51,
        "breathiness": 11,
        "clarity": 94,
        "articulation": 92,
        "speed": 89,
        "rhythm": 95,
        "intonation": 97,
        "energy": 99,
        "emphasis": 95,
        "pause": 27
      },
      "performance": {
        "vocal_placement": "forward",
        "texture": "bright-punchy",
        "mouth_profile": "open-energetic",
        "onset": "hook contrast lift",
        "ending": "firm punch landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.8,
      "midFreq": 1400,
      "midGain": 3.2,
      "presenceFreq": 4300,
      "presenceGain": 5.6,
      "highGain": 4.2,
      "reverb": 0.05,
      "reverbDecay": 0.28,
      "compressor": {
        "threshold": -21,
        "ratio": 4.2,
        "attack": 0.004,
        "release": 0.14
      }
    }
  },
  {
    "id": "vn_f_sales_meko_sweet_05",
    "name": "05. Mekong Honey 👑 (Gái Miền Tây Ngọt Ngào, Chân Tình)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "tay",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.05,
    "rate": 0.98,
    "recommendedFor": "both",
    "desc": "Giọng nữ miền Tây ngọt lịm, mộc mạc, chân thành như người nhà, chinh phục lòng tin cho đặc sản vùng miền, nông sản sạch.",
    "sampleText": "Dạ bà con cô bác ơi, mẻ bánh với trái cây này nhà em tự tay chọn lựa kỹ càng lắm, bà con ủng hộ em gái nhỏ một đơn nha!",
    "edgePitch": "+5%",
    "edgeRate": "-2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "MEKONG",
        "accent": "Mekong River Native",
        "accent_strength": 75
      },
      "persona": {
        "age": "20-24",
        "personality": "chân chất, ngọt ngào, hiền lành, dễ thương",
        "authority": 66,
        "friendliness": 99
      },
      "style": {
        "primary": "sincere_sales",
        "secondary": [
          "local_specialties",
          "family_products",
          "natural_story"
        ]
      },
      "emotion": {
        "warmth": 99,
        "happiness": 88,
        "excitement": 72,
        "confidence": 80,
        "urgency": 35,
        "empathy": 94
      },
      "acoustic": {
        "pitch": 74,
        "pitch_range": 65,
        "depth": 28,
        "warmth": 99,
        "resonance": 49,
        "breathiness": 23,
        "clarity": 87,
        "articulation": 85,
        "speed": 71,
        "rhythm": 76,
        "intonation": 91,
        "energy": 75,
        "emphasis": 79,
        "pause": 55
      },
      "performance": {
        "vocal_placement": "relaxed oral",
        "texture": "rounded-warm",
        "mouth_profile": "soft-mellow",
        "onset": "warm intimate smile",
        "ending": "soft fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.2,
      "midFreq": 1150,
      "midGain": 2.6,
      "presenceFreq": 3700,
      "presenceGain": 4.4,
      "highGain": 2.8,
      "reverb": 0.07,
      "reverbDecay": 0.38,
      "compressor": {
        "threshold": -18,
        "ratio": 3.2,
        "attack": 0.01,
        "release": 0.22
      }
    }
  },
  {
    "id": "vn_f_sales_fomo_06",
    "name": "06. FOMO Flash 👑 (Tạo Khẩn Cấp Bùng Nổ Săn Deal)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.08,
    "rate": 1.14,
    "recommendedFor": "both",
    "desc": "Giọng tạo áp lực khan hiếm đỉnh cao, tăng tốc dồn dập trước CTA, kích thích bấm mua ngay kẻo hết trong 3 giây.",
    "sampleText": "Chỉ còn đúng 3 suất quà cuối cùng trong giỏ hàng thôi cả nhà ơi! Nhanh tay bấm đặt hàng ngay bây giờ kẻo hệ thống khóa giá nè!",
    "edgePitch": "+8%",
    "edgeRate": "+14%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Flash",
        "accent_strength": 55
      },
      "persona": {
        "age": "20-24",
        "personality": "hối hả, quyết liệt, kích thích, lôi cuốn",
        "authority": 82,
        "friendliness": 88
      },
      "style": {
        "primary": "flash_sale",
        "secondary": [
          "fomo_trigger",
          "scarcity_closing",
          "countdowns"
        ]
      },
      "emotion": {
        "warmth": 76,
        "happiness": 86,
        "excitement": 97,
        "confidence": 91,
        "urgency": 100,
        "empathy": 68
      },
      "acoustic": {
        "pitch": 79,
        "pitch_range": 88,
        "depth": 22,
        "warmth": 76,
        "resonance": 43,
        "breathiness": 7,
        "clarity": 95,
        "articulation": 93,
        "speed": 94,
        "rhythm": 96,
        "intonation": 99,
        "energy": 100,
        "emphasis": 100,
        "pause": 18
      },
      "performance": {
        "vocal_placement": "forward",
        "texture": "crisp",
        "mouth_profile": "tight-rapid",
        "onset": "urgent shock hook",
        "ending": "sudden acceleration before CTA",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.6,
      "midFreq": 1450,
      "midGain": 3.5,
      "presenceFreq": 4500,
      "presenceGain": 5.8,
      "highGain": 4.2,
      "reverb": 0.04,
      "reverbDecay": 0.22,
      "compressor": {
        "threshold": -23,
        "ratio": 4.8,
        "attack": 0.003,
        "release": 0.1
      }
    }
  },
  {
    "id": "vn_f_sales_friend_07",
    "name": "07. Bestie Live 👑 (Bán Hàng Như Bạn Thân Tâm Sự)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.04,
    "rate": 1.01,
    "recommendedFor": "both",
    "desc": "Giọng nữ chia sẻ bí quyết tự nhiên 100% như hội bạn thân rủ nhau mua sắm, tạo sự gắn kết bền chặt và tin cậy.",
    "sampleText": "Mấy bà ơi dùng cái này bao ưng luôn á, tui xài suốt mấy tháng nay rồi mới dám mách cho mấy bà đó nha, thích xỉu luôn!",
    "edgePitch": "+4%",
    "edgeRate": "+1%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Conversational",
        "accent_strength": 58
      },
      "persona": {
        "age": "20-24",
        "personality": "thân mật, chân thật, vui tính, dễ gần",
        "authority": 68,
        "friendliness": 100
      },
      "style": {
        "primary": "conversational_sales",
        "secondary": [
          "peer_review",
          "honest_advice",
          "bestie_sharing"
        ]
      },
      "emotion": {
        "warmth": 98,
        "happiness": 92,
        "excitement": 80,
        "confidence": 85,
        "urgency": 32,
        "empathy": 92
      },
      "acoustic": {
        "pitch": 72,
        "pitch_range": 66,
        "depth": 27,
        "warmth": 98,
        "resonance": 40,
        "breathiness": 21,
        "clarity": 88,
        "articulation": 84,
        "speed": 74,
        "rhythm": 81,
        "intonation": 90,
        "energy": 73,
        "emphasis": 70,
        "pause": 45
      },
      "performance": {
        "vocal_placement": "relaxed-forward",
        "texture": "casual-soft",
        "mouth_profile": "relaxed-natural",
        "onset": "casual friendly whisper-smile",
        "ending": "natural conversational variation",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 0,
      "midFreq": 1250,
      "midGain": 2.2,
      "presenceFreq": 3900,
      "presenceGain": 4.2,
      "highGain": 3.2,
      "reverb": 0.05,
      "reverbDecay": 0.3,
      "compressor": {
        "threshold": -18,
        "ratio": 3.2,
        "attack": 0.008,
        "release": 0.2
      }
    }
  },
  {
    "id": "vn_f_sales_viral_08",
    "name": "08. Viral Pop 👑 (Siêu Sao Bắt Trend Triệu View TikTok)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "idol_genz",
    "category": "Creator & Viral",
    "pitch": 1.1,
    "rate": 1.12,
    "recommendedFor": "both",
    "desc": "Giọng nữ bắt tai, quãng pitch rộng biến thiên cực nhanh, giật hook giữ trọn 3 giây vàng của Shorts & Reels.",
    "sampleText": "Dừng lại 3 giây lướt màn hình ngay! Thứ này vừa cập bến là khiến dân tình phát sốt, xem hết video để nhận quà bí mật nha!",
    "edgePitch": "+10%",
    "edgeRate": "+12%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Viral",
        "accent_strength": 60
      },
      "persona": {
        "age": "20-24",
        "personality": "bùng nổ, trendy, bất ngờ, cuốn hút",
        "authority": 76,
        "friendliness": 96
      },
      "style": {
        "primary": "viral_shorts",
        "secondary": [
          "hook_master",
          "tiktok_trend",
          "pop_culture"
        ]
      },
      "emotion": {
        "warmth": 84,
        "happiness": 98,
        "excitement": 100,
        "confidence": 92,
        "energy": 100,
        "humor": 82
      },
      "acoustic": {
        "pitch": 83,
        "pitch_range": 94,
        "depth": 19,
        "warmth": 84,
        "resonance": 38,
        "breathiness": 14,
        "clarity": 91,
        "articulation": 89,
        "speed": 93,
        "rhythm": 100,
        "intonation": 100,
        "energy": 100,
        "emphasis": 98,
        "pause": 15
      },
      "performance": {
        "vocal_placement": "head-forward",
        "texture": "bright-punchy",
        "mouth_profile": "dynamic-wide",
        "onset": "shock hook explosion",
        "ending": "unexpected pitch jump",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -1.2,
      "midFreq": 1550,
      "midGain": 3.4,
      "presenceFreq": 4600,
      "presenceGain": 6,
      "highGain": 4.5,
      "reverb": 0.04,
      "reverbDecay": 0.22,
      "compressor": {
        "threshold": -23,
        "ratio": 4.6,
        "attack": 0.003,
        "release": 0.1
      }
    }
  },
  {
    "id": "vn_f_story_warm_09",
    "name": "09. Soft Heart 👑 (Tâm Sự Sâu Lắng Chạm Trái Tim)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 1.01,
    "rate": 0.92,
    "recommendedFor": "both",
    "desc": "Giọng nữ Hà Thành dịu dàng, âm hơi thở chạm sâu vào cảm xúc, làm dịu lòng người nghe trong các video chữa lành, radio đêm.",
    "sampleText": "Nếu hôm nay bạn cảm thấy mệt mỏi, hãy cho phép mình được nghỉ ngơi một chút nhé. Mọi chuyện rồi sẽ nhẹ nhàng trôi qua thôi.",
    "edgePitch": "+1%",
    "edgeRate": "-8%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Gentle Warm",
        "accent_strength": 62
      },
      "persona": {
        "age": "20-24",
        "personality": "dịu dàng, sâu sắc, thấu cảm, vỗ về",
        "authority": 70,
        "friendliness": 98
      },
      "style": {
        "primary": "healing_radio",
        "secondary": [
          "emotional_monologue",
          "poetry_story",
          "soft_whisper"
        ]
      },
      "emotion": {
        "warmth": 99,
        "happiness": 65,
        "excitement": 40,
        "confidence": 82,
        "empathy": 98,
        "emotional_depth": 94
      },
      "acoustic": {
        "pitch": 68,
        "pitch_range": 70,
        "depth": 31,
        "warmth": 99,
        "resonance": 58,
        "breathiness": 29,
        "clarity": 91,
        "articulation": 89,
        "speed": 58,
        "rhythm": 62,
        "intonation": 92,
        "energy": 55,
        "emphasis": 74,
        "pause": 82
      },
      "performance": {
        "vocal_placement": "intimate oral",
        "texture": "airy-warm",
        "mouth_profile": "soft-whisper-open",
        "onset": "breath-led intimate touch",
        "ending": "emotional fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.8,
      "midFreq": 1050,
      "midGain": 2.2,
      "presenceFreq": 3400,
      "presenceGain": 3.8,
      "highGain": 2.8,
      "reverb": 0.1,
      "reverbDecay": 0.52,
      "compressor": {
        "threshold": -16,
        "ratio": 2.8,
        "attack": 0.02,
        "release": 0.3
      }
    }
  },
  {
    "id": "vn_f_ad_tech_10",
    "name": "10. Smart Sell 👑 (Nữ Công Nghệ & Khóa Học Rõ Ràng)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "chuyengia",
    "category": "Tri Thức & Công Nghệ",
    "pitch": 0.99,
    "rate": 1.02,
    "recommendedFor": "both",
    "desc": "Giọng đọc thông minh, khúc chiết, chuẩn xác từng thuật ngữ, lý tưởng cho video giới thiệu ứng dụng, phần mềm và khóa học số.",
    "sampleText": "Tính năng tự động hóa thông minh này sẽ giúp bạn tiết kiệm tới 80% thời gian xử lý công việc hàng ngày mà vẫn đạt hiệu quả tối đa.",
    "edgePitch": "-1%",
    "edgeRate": "+2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Modern Tech",
        "accent_strength": 65
      },
      "persona": {
        "age": "20-24",
        "personality": "thông minh, logic, rành mạch, hiện đại",
        "authority": 90,
        "friendliness": 82
      },
      "style": {
        "primary": "tech_software",
        "secondary": [
          "app_demo",
          "e_learning",
          "smart_consulting"
        ]
      },
      "emotion": {
        "warmth": 76,
        "happiness": 70,
        "excitement": 72,
        "confidence": 96,
        "curiosity": 87,
        "empathy": 75
      },
      "acoustic": {
        "pitch": 64,
        "pitch_range": 59,
        "depth": 38,
        "warmth": 76,
        "resonance": 67,
        "breathiness": 5,
        "clarity": 99,
        "articulation": 99,
        "speed": 72,
        "rhythm": 73,
        "intonation": 78,
        "energy": 73,
        "emphasis": 87,
        "pause": 61
      },
      "performance": {
        "vocal_placement": "oral-centered",
        "texture": "clean-precise",
        "mouth_profile": "sharp-clear",
        "onset": "precise crisp attack",
        "ending": "controlled firm finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.5,
      "midFreq": 1200,
      "midGain": 2.8,
      "presenceFreq": 3800,
      "presenceGain": 5,
      "highGain": 3.2,
      "reverb": 0.04,
      "reverbDecay": 0.25,
      "compressor": {
        "threshold": -19,
        "ratio": 3.8,
        "attack": 0.005,
        "release": 0.15
      }
    }
  },
  {
    "id": "vn_f_sales_sunny_11",
    "name": "11. Sunny Seller 👑 (Năng Lượng Tích Cực Tỏa Nắng)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.09,
    "rate": 1.05,
    "recommendedFor": "both",
    "desc": "Giọng nói tràn đầy nụ cười, ấm áp và tươi tắn như ánh nắng mai, truyền nguồn năng lượng sảng khoái kích thích mua sắm.",
    "sampleText": "Một ngày mới thật tuyệt vời nha cả nhà! Cùng em khám phá bộ sưu tập mới toanh giúp nâng tầm phong cách ngay hôm nay nhé!",
    "edgePitch": "+9%",
    "edgeRate": "+5%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Cheerful",
        "accent_strength": 55
      },
      "persona": {
        "age": "20-24",
        "personality": "rạng rỡ, tích cực, vui tươi, lan tỏa",
        "authority": 75,
        "friendliness": 100
      },
      "style": {
        "primary": "positive_sales",
        "secondary": [
          "morning_live",
          "sunshine_lifestyle",
          "joyful_closing"
        ]
      },
      "emotion": {
        "warmth": 91,
        "happiness": 100,
        "excitement": 92,
        "confidence": 88,
        "positivity": 99,
        "empathy": 88
      },
      "acoustic": {
        "pitch": 80,
        "pitch_range": 76,
        "depth": 21,
        "warmth": 91,
        "resonance": 42,
        "breathiness": 17,
        "clarity": 92,
        "articulation": 90,
        "speed": 81,
        "rhythm": 86,
        "intonation": 95,
        "energy": 94,
        "emphasis": 87,
        "pause": 34
      },
      "performance": {
        "vocal_placement": "bright-forward",
        "texture": "sunny-clean",
        "mouth_profile": "wide-smile",
        "onset": "smile resonance attack",
        "ending": "uplifting warm finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.5,
      "midFreq": 1400,
      "midGain": 3,
      "presenceFreq": 4400,
      "presenceGain": 5.5,
      "highGain": 4,
      "reverb": 0.05,
      "reverbDecay": 0.3,
      "compressor": {
        "threshold": -20,
        "ratio": 3.8,
        "attack": 0.005,
        "release": 0.15
      }
    }
  },
  {
    "id": "vn_f_sales_bold_12",
    "name": "12. Bold Girl 👑 (Nữ Trẻ Quyết Đoán & Sắc Sảo)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1,
    "rate": 1.04,
    "recommendedFor": "both",
    "desc": "Giọng nữ cá tính, đanh thép, phát âm chắc nịch và quyết liệt, không khoan nhượng khi chốt các deal số lượng có hạn.",
    "sampleText": "Đã thích là phải nhích liền tay! Cơ hội giá tốt như thế này không có lần thứ hai đâu, bấm nút đặt ngay bây giờ nhé!",
    "edgePitch": "+0%",
    "edgeRate": "+4%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Bold",
        "accent_strength": 68
      },
      "persona": {
        "age": "20-24",
        "personality": "cá tính, bản lĩnh, quyết đoán, sắc bén",
        "authority": 91,
        "friendliness": 78
      },
      "style": {
        "primary": "bold_closing",
        "secondary": [
          "assertive_sales",
          "limited_edition",
          "trend_setter"
        ]
      },
      "emotion": {
        "warmth": 70,
        "happiness": 75,
        "excitement": 85,
        "confidence": 99,
        "urgency": 85,
        "authority": 91
      },
      "acoustic": {
        "pitch": 65,
        "pitch_range": 58,
        "depth": 42,
        "warmth": 70,
        "resonance": 73,
        "breathiness": 3,
        "clarity": 98,
        "articulation": 98,
        "speed": 78,
        "rhythm": 78,
        "intonation": 74,
        "energy": 85,
        "emphasis": 97,
        "pause": 64
      },
      "performance": {
        "vocal_placement": "oral-chest",
        "texture": "firm-clean",
        "mouth_profile": "firm-articulated",
        "onset": "bold direct strike",
        "ending": "hard consonant landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.2,
      "midFreq": 1150,
      "midGain": 3,
      "presenceFreq": 3700,
      "presenceGain": 5,
      "highGain": 2.8,
      "reverb": 0.04,
      "reverbDecay": 0.26,
      "compressor": {
        "threshold": -22,
        "ratio": 4.2,
        "attack": 0.004,
        "release": 0.14
      }
    }
  },
  {
    "id": "vn_f_sales_playful_13",
    "name": "13. Playful Closer 👑 (Chốt Deal Tinh Nghịch, Dí Dỏm)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.1,
    "rate": 1.08,
    "recommendedFor": "both",
    "desc": "Giọng nữ trêu đùa duyên dáng, nhử deal thông minh: tease nhẹ -> ngưng 1 nhịp -> chốt hạ khiến người nghe không thể cưỡng lại.",
    "sampleText": "Ai mà còn chần chừ là tí nữa hết hàng ngồi tiếc hùi hụi ráng chịu nha, em bấm mở cổng giỏ hàng ngay bây giờ nè!",
    "edgePitch": "+10%",
    "edgeRate": "+8%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Playful",
        "accent_strength": 58
      },
      "persona": {
        "age": "20-24",
        "personality": "tinh nghịch, hóm hỉnh, duyên dáng, lém lỉnh",
        "authority": 74,
        "friendliness": 98
      },
      "style": {
        "primary": "playful_closing",
        "secondary": [
          "tease_and_close",
          "humor_sales",
          "viral_cta"
        ]
      },
      "emotion": {
        "warmth": 87,
        "happiness": 96,
        "excitement": 91,
        "confidence": 90,
        "humor": 95,
        "urgency": 78
      },
      "acoustic": {
        "pitch": 82,
        "pitch_range": 91,
        "depth": 20,
        "warmth": 87,
        "resonance": 39,
        "breathiness": 18,
        "clarity": 91,
        "articulation": 88,
        "speed": 87,
        "rhythm": 96,
        "intonation": 100,
        "energy": 95,
        "emphasis": 92,
        "pause": 30
      },
      "performance": {
        "vocal_placement": "forward-head",
        "texture": "bright-elastic",
        "mouth_profile": "playful-moving",
        "onset": "tease pitch jump",
        "ending": "dramatic pause before CTA",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -1,
      "midFreq": 1500,
      "midGain": 3.2,
      "presenceFreq": 4600,
      "presenceGain": 5.8,
      "highGain": 4.4,
      "reverb": 0.04,
      "reverbDecay": 0.25,
      "compressor": {
        "threshold": -21,
        "ratio": 4.2,
        "attack": 0.004,
        "release": 0.12
      }
    }
  },
  {
    "id": "vn_f_sales_calm_14",
    "name": "14. Calm Girl 👑 (Nhẹ Nhàng Thanh Khiết Nhưng Có Lực)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1,
    "rate": 0.9,
    "recommendedFor": "both",
    "desc": "Giọng nữ thanh khiết, nói năng từ tốn, khoảng nghỉ dài kiểm soát, rất hợp nến thơm, skincare, trà sữa cao cấp và sách.",
    "sampleText": "Chăm sóc bản thân từ những điều giản dị nhất sẽ mang lại cho bạn sự an yên và tự tin rạng ngời suốt cả ngày dài.",
    "edgePitch": "+0%",
    "edgeRate": "-10%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Serene",
        "accent_strength": 60
      },
      "persona": {
        "age": "20-24",
        "personality": "thanh khiết, điềm đạm, an yên, tinh tế",
        "authority": 80,
        "friendliness": 95
      },
      "style": {
        "primary": "calm_sales",
        "secondary": [
          "wellness_spa",
          "lifestyle_zen",
          "soft_consulting"
        ]
      },
      "emotion": {
        "warmth": 93,
        "happiness": 75,
        "excitement": 40,
        "confidence": 87,
        "calm": 94,
        "empathy": 95
      },
      "acoustic": {
        "pitch": 67,
        "pitch_range": 49,
        "depth": 32,
        "warmth": 94,
        "resonance": 60,
        "breathiness": 15,
        "clarity": 95,
        "articulation": 93,
        "speed": 55,
        "rhythm": 58,
        "intonation": 76,
        "energy": 48,
        "emphasis": 71,
        "pause": 85
      },
      "performance": {
        "vocal_placement": "soft oral",
        "texture": "silky",
        "mouth_profile": "calm-relaxed",
        "onset": "gentle air-cushioned onset",
        "ending": "long controlled pauses",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.5,
      "midFreq": 1000,
      "midGain": 2.2,
      "presenceFreq": 3500,
      "presenceGain": 4,
      "highGain": 2.8,
      "reverb": 0.08,
      "reverbDecay": 0.45,
      "compressor": {
        "threshold": -16,
        "ratio": 2.8,
        "attack": 0.015,
        "release": 0.28
      }
    }
  },
  {
    "id": "vn_f_motivation_young_15",
    "name": "15. Empower Girl 👑 (Truyền Cảm Hứng & Thắp Lửa Đam Mê)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 1.01,
    "rate": 0.99,
    "recommendedFor": "both",
    "desc": "Giọng đọc nữ trẻ tràn đầy nhiệt huyết, cao trào cảm xúc dâng trào truyền động lực mạnh mẽ cho giới trẻ bứt phá vươn lên.",
    "sampleText": "Đừng bao giờ để bất kỳ ai giới hạn ước mơ của bạn! Hãy mạnh dạn bước tới và chứng minh năng lực tuyệt vời của chính mình!",
    "edgePitch": "+1%",
    "edgeRate": "-1%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Inspiring",
        "accent_strength": 65
      },
      "persona": {
        "age": "20-24",
        "personality": "truyền lửa, tự tin, nhiệt huyết, khát vọng",
        "authority": 88,
        "friendliness": 90
      },
      "style": {
        "primary": "youth_empowerment",
        "secondary": [
          "breakthrough_speech",
          "habit_building",
          "study_motivation"
        ]
      },
      "emotion": {
        "warmth": 82,
        "happiness": 85,
        "excitement": 92,
        "confidence": 98,
        "positivity": 99,
        "energy": 94
      },
      "acoustic": {
        "pitch": 68,
        "pitch_range": 72,
        "depth": 35,
        "warmth": 82,
        "resonance": 73,
        "breathiness": 4,
        "clarity": 97,
        "articulation": 96,
        "speed": 68,
        "rhythm": 76,
        "intonation": 88,
        "energy": 95,
        "emphasis": 98,
        "pause": 63
      },
      "performance": {
        "vocal_placement": "chest-oral",
        "texture": "resonant-bright",
        "mouth_profile": "open-projected",
        "onset": "confident resonant onset",
        "ending": "rising emotional build landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.5,
      "midFreq": 1150,
      "midGain": 3,
      "presenceFreq": 3700,
      "presenceGain": 5,
      "highGain": 3,
      "reverb": 0.06,
      "reverbDecay": 0.35,
      "compressor": {
        "threshold": -20,
        "ratio": 4,
        "attack": 0.005,
        "release": 0.16
      }
    }
  },
  {
    "id": "vn_f_ad_beauty_16",
    "name": "16. Beauty Glow 👑 (Quảng Cáo Mỹ Phẩm Mượt Mà Như Lụa)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "quangcao",
    "category": "Quảng Cáo & TVC",
    "pitch": 1.06,
    "rate": 0.96,
    "recommendedFor": "both",
    "desc": "Giọng đọc TVC mỹ phẩm mềm mại, âm thanh lụa là thoáng khí, gợi tả làn da mọng nước và phong cách sang chảnh.",
    "sampleText": "Chạm nhẹ để cảm nhận làn da căng bóng mịn màng, rạng rỡ tỏa sáng tự nhiên không tì vết suốt 24 giờ.",
    "edgePitch": "+6%",
    "edgeRate": "-4%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Beauty Glow",
        "accent_strength": 50
      },
      "persona": {
        "age": "20-24",
        "personality": "thanh lịch, quyến rũ, tươi trẻ, mịn màng",
        "authority": 80,
        "friendliness": 95
      },
      "style": {
        "primary": "beauty_advertising",
        "secondary": [
          "skincare_tvc",
          "spa_glow",
          "luxury_cosmetic"
        ]
      },
      "emotion": {
        "warmth": 96,
        "happiness": 85,
        "excitement": 65,
        "confidence": 88,
        "elegance": 94,
        "empathy": 90
      },
      "acoustic": {
        "pitch": 76,
        "pitch_range": 67,
        "depth": 24,
        "warmth": 96,
        "resonance": 54,
        "breathiness": 30,
        "clarity": 94,
        "articulation": 91,
        "speed": 64,
        "rhythm": 70,
        "intonation": 90,
        "energy": 67,
        "emphasis": 75,
        "pause": 67
      },
      "performance": {
        "vocal_placement": "soft-forward",
        "texture": "silky-airy",
        "mouth_profile": "soft-aesthetic",
        "onset": "silky air breath",
        "ending": "elegant fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.2,
      "midFreq": 1200,
      "midGain": 2.5,
      "presenceFreq": 4100,
      "presenceGain": 5.2,
      "highGain": 4.2,
      "reverb": 0.08,
      "reverbDecay": 0.4,
      "compressor": {
        "threshold": -18,
        "ratio": 3.2,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_comedy_young_17",
    "name": "17. Comedy Pop 👑 (Tấu Hài Viral, Nhả Chữ Cực Duyên)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "idol_genz",
    "category": "Creator & Viral",
    "pitch": 1.1,
    "rate": 1.1,
    "recommendedFor": "both",
    "desc": "Bậc thầy tấu hài, thả punchline bất ngờ kèm micro-pause kịch tính, biến mọi khoảnh khắc livestream thành tràng cười triệu view.",
    "sampleText": "Trời đất ơi coi nè! Tui nói thiệt chứ không mua cái này là tối về ngủ không có yên giấc đâu nha quý vị ơi!",
    "edgePitch": "+10%",
    "edgeRate": "+10%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Comedy Club",
        "accent_strength": 65
      },
      "persona": {
        "age": "20-24",
        "personality": "hài hước, lầy lội, diễn xuất cực duyên, sáng tạo",
        "authority": 75,
        "friendliness": 100
      },
      "style": {
        "primary": "comedy_viral",
        "secondary": [
          "entertainment_live",
          "tiktok_sketch",
          "punchline_master"
        ]
      },
      "emotion": {
        "warmth": 90,
        "happiness": 99,
        "excitement": 98,
        "confidence": 90,
        "humor": 100,
        "energy": 99
      },
      "acoustic": {
        "pitch": 84,
        "pitch_range": 97,
        "depth": 18,
        "warmth": 90,
        "resonance": 36,
        "breathiness": 10,
        "clarity": 90,
        "articulation": 87,
        "speed": 90,
        "rhythm": 100,
        "intonation": 100,
        "energy": 99,
        "emphasis": 97,
        "pause": 25
      },
      "performance": {
        "vocal_placement": "forward",
        "texture": "bright-elastic",
        "mouth_profile": "wide-playful",
        "onset": "comic sudden attack",
        "ending": "punchline drop + dramatic micro-pause",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -1,
      "midFreq": 1450,
      "midGain": 3.2,
      "presenceFreq": 4500,
      "presenceGain": 5.8,
      "highGain": 4.4,
      "reverb": 0.05,
      "reverbDecay": 0.28,
      "compressor": {
        "threshold": -21,
        "ratio": 4.2,
        "attack": 0.004,
        "release": 0.14
      }
    }
  },
  {
    "id": "vn_f_curious_young_18",
    "name": "18. Curious Girl 👑 (Kích Thích Tò Mò, Giữ Chân Khán Giả)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.07,
    "rate": 1.02,
    "recommendedFor": "both",
    "desc": "Giọng đọc mở đầu bằng câu hỏi lôi cuốn, intonation thắc mắc treo cao (suspended rise), thôi thúc người xem tò mò xem tiếp.",
    "sampleText": "Bạn có bao giờ tự hỏi vì sao sản phẩm này vừa ra mắt đã cháy hàng liên tục trên mọi nền tảng không? Bí mật nằm ở đây!",
    "edgePitch": "+7%",
    "edgeRate": "+2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Mystery Conversational",
        "accent_strength": 60
      },
      "persona": {
        "age": "20-24",
        "personality": "tò mò, hào hứng, cuốn hút, tinh tế",
        "authority": 80,
        "friendliness": 92
      },
      "style": {
        "primary": "curiosity_hook",
        "secondary": [
          "teaser_sales",
          "unboxing_secret",
          "interactive_question"
        ]
      },
      "emotion": {
        "warmth": 83,
        "happiness": 85,
        "excitement": 85,
        "confidence": 90,
        "curiosity": 100,
        "urgency": 65
      },
      "acoustic": {
        "pitch": 79,
        "pitch_range": 91,
        "depth": 23,
        "warmth": 83,
        "resonance": 47,
        "breathiness": 13,
        "clarity": 93,
        "articulation": 92,
        "speed": 75,
        "rhythm": 84,
        "intonation": 100,
        "energy": 82,
        "emphasis": 89,
        "pause": 47
      },
      "performance": {
        "vocal_placement": "oral-forward",
        "texture": "bright-curious",
        "mouth_profile": "questioning-open",
        "onset": "curious pitch rise",
        "ending": "suspended rise",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 0.5,
      "midFreq": 1350,
      "midGain": 2.8,
      "presenceFreq": 4100,
      "presenceGain": 5.2,
      "highGain": 3.8,
      "reverb": 0.05,
      "reverbDecay": 0.3,
      "compressor": {
        "threshold": -19,
        "ratio": 3.8,
        "attack": 0.005,
        "release": 0.16
      }
    }
  },
  {
    "id": "vn_f_sales_trust_young_19",
    "name": "19. Trust Girl 👑 (Tạo Niềm Tin An Tâm Tuyệt Đối)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.01,
    "rate": 0.96,
    "recommendedFor": "both",
    "desc": "Giọng nữ ấm áp, cao độ ổn định không lên xuống thất thường, cam kết chân thành giúp khách hàng an tâm tuyệt đối khi xuống tiền.",
    "sampleText": "Shop em cam kết hoàn tiền 100% nếu sản phẩm có bất kỳ lỗi nhỏ nào, các bác hoàn toàn yên tâm nhận hàng kiểm tra thoải mái nha!",
    "edgePitch": "+1%",
    "edgeRate": "-4%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Trustworthy",
        "accent_strength": 52
      },
      "persona": {
        "age": "20-24",
        "personality": "thật thà, trách nhiệm, chu đáo, an tâm",
        "authority": 82,
        "friendliness": 98
      },
      "style": {
        "primary": "trust_sales",
        "secondary": [
          "warranty_commit",
          "honest_store",
          "customer_peace_of_mind"
        ]
      },
      "emotion": {
        "warmth": 96,
        "happiness": 75,
        "excitement": 55,
        "confidence": 95,
        "trust": 99,
        "empathy": 94
      },
      "acoustic": {
        "pitch": 66,
        "pitch_range": 54,
        "depth": 34,
        "warmth": 96,
        "resonance": 63,
        "breathiness": 8,
        "clarity": 96,
        "articulation": 94,
        "speed": 64,
        "rhythm": 67,
        "intonation": 73,
        "energy": 60,
        "emphasis": 75,
        "pause": 74
      },
      "performance": {
        "vocal_placement": "centered-oral",
        "texture": "warm-stable",
        "mouth_profile": "calm-sincere",
        "onset": "reassuring warm onset",
        "ending": "stable pitch + reassuring landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.6,
      "midFreq": 1100,
      "midGain": 2.5,
      "presenceFreq": 3600,
      "presenceGain": 4.5,
      "highGain": 2.8,
      "reverb": 0.05,
      "reverbDecay": 0.32,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_sales_closer_young_20",
    "name": "20. Mini Closer 👑 (Chốt Đơn Gọn Chắc, Nhanh Gọn Lẹ)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "20-24",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.04,
    "rate": 1.06,
    "recommendedFor": "both",
    "desc": "Giọng chốt sale ngắn gọn, dứt khoát, âm sắc đặc và chắc, chuyển đổi giỏ hàng siêu tốc cho các sản phẩm tiêu dùng nhanh.",
    "sampleText": "Thêm vào giỏ hàng và thanh toán ngay thôi cả nhà ơi! Mã giảm 50k chỉ áp dụng cho 10 đơn hàng đầu tiên trong phiên này thôi nè!",
    "edgePitch": "+4%",
    "edgeRate": "+6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Direct Closer",
        "accent_strength": 50
      },
      "persona": {
        "age": "20-24",
        "personality": "nhanh nhẹn, dứt khoát, tự tin, thực tế",
        "authority": 88,
        "friendliness": 85
      },
      "style": {
        "primary": "quick_closing",
        "secondary": [
          "instant_checkout",
          "flash_voucher",
          "direct_cta"
        ]
      },
      "emotion": {
        "warmth": 79,
        "happiness": 85,
        "excitement": 90,
        "confidence": 99,
        "urgency": 86,
        "energy": 91
      },
      "acoustic": {
        "pitch": 70,
        "pitch_range": 61,
        "depth": 29,
        "warmth": 79,
        "resonance": 60,
        "breathiness": 5,
        "clarity": 98,
        "articulation": 98,
        "speed": 84,
        "rhythm": 87,
        "intonation": 83,
        "energy": 91,
        "emphasis": 99,
        "pause": 57
      },
      "performance": {
        "vocal_placement": "oral-forward",
        "texture": "crisp-dense",
        "mouth_profile": "clean-firm",
        "onset": "sharp decisive onset",
        "ending": "decisive CTA landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.8,
      "midFreq": 1250,
      "midGain": 3,
      "presenceFreq": 3900,
      "presenceGain": 5.2,
      "highGain": 3.2,
      "reverb": 0.04,
      "reverbDecay": 0.24,
      "compressor": {
        "threshold": -22,
        "ratio": 4.5,
        "attack": 0.003,
        "release": 0.12
      }
    }
  },
  {
    "id": "vn_f_sales_luxury_21",
    "name": "21. Premium Lady 👑 (Bán Hàng Cao Cấp & Hàng Hiệu)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Sang Trọng & Đẳng Cấp",
    "pitch": 0.97,
    "rate": 0.94,
    "recommendedFor": "both",
    "desc": "Giọng nữ sang trọng, điềm tĩnh, ấm dày và thanh tao, tôn vinh đẳng cấp sản phẩm thời trang thiết kế, trang sức và bất động sản.",
    "sampleText": "Mỗi chi tiết đều được chế tác tinh xảo với tiêu chuẩn hoàn thiện cao nhất, mang lại vẻ đẹp thanh lịch và độc bản cho người sở hữu.",
    "edgePitch": "-3%",
    "edgeRate": "-6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Luxury Tone",
        "accent_strength": 62
      },
      "persona": {
        "age": "24-28",
        "personality": "thanh lịch, quý phái, điềm đạm, đẳng cấp",
        "authority": 92,
        "friendliness": 85
      },
      "style": {
        "primary": "luxury_sales",
        "secondary": [
          "high_ticket",
          "jewelry_fashion",
          "exclusive_consulting"
        ]
      },
      "emotion": {
        "warmth": 88,
        "happiness": 70,
        "excitement": 55,
        "confidence": 97,
        "elegance": 98,
        "empathy": 82
      },
      "acoustic": {
        "pitch": 58,
        "pitch_range": 47,
        "depth": 52,
        "warmth": 88,
        "resonance": 83,
        "breathiness": 9,
        "clarity": 99,
        "articulation": 98,
        "speed": 61,
        "rhythm": 65,
        "intonation": 71,
        "energy": 63,
        "emphasis": 83,
        "pause": 78
      },
      "performance": {
        "vocal_placement": "low oral-chest",
        "texture": "velvety-dense",
        "mouth_profile": "refined-calm",
        "onset": "velvet elegant breath",
        "ending": "elegant fall",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 3.2,
      "midFreq": 980,
      "midGain": 2.4,
      "presenceFreq": 3300,
      "presenceGain": 4.2,
      "highGain": 2.2,
      "reverb": 0.08,
      "reverbDecay": 0.44,
      "compressor": {
        "threshold": -17,
        "ratio": 3.2,
        "attack": 0.012,
        "release": 0.24
      }
    }
  },
  {
    "id": "vn_f_south_charme_22",
    "name": "22. Southern Charme 👑 (Nữ Sài Gòn Quyến Rũ Tinh Tế)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.02,
    "rate": 0.98,
    "recommendedFor": "both",
    "desc": "Giọng nữ Sài Gòn trưởng thành, duyên dáng, ngọt ngào có chiều sâu, tạo sức hút tự nhiên không thể rời tai.",
    "sampleText": "Dạ em chào các anh chị nha! Hôm nay em lựa được mấy mẫu đầm thiết kế form dáng siêu chuẩn, mặc lên là thần thái ngút ngàn luôn nè!",
    "edgePitch": "+2%",
    "edgeRate": "-2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Sophisticated",
        "accent_strength": 52
      },
      "persona": {
        "age": "24-28",
        "personality": "quyến rũ, tinh tế, nữ tính, tự tin",
        "authority": 82,
        "friendliness": 97
      },
      "style": {
        "primary": "charme_sales",
        "secondary": [
          "beauty_lifestyle",
          "soft_persuasion",
          "perfume_fashion"
        ]
      },
      "emotion": {
        "warmth": 97,
        "happiness": 85,
        "excitement": 70,
        "confidence": 92,
        "charm": 96,
        "empathy": 90
      },
      "acoustic": {
        "pitch": 64,
        "pitch_range": 61,
        "depth": 42,
        "warmth": 97,
        "resonance": 61,
        "breathiness": 22,
        "clarity": 94,
        "articulation": 92,
        "speed": 65,
        "rhythm": 71,
        "intonation": 89,
        "energy": 72,
        "emphasis": 80,
        "pause": 65
      },
      "performance": {
        "vocal_placement": "oral-soft",
        "texture": "silky-warm",
        "mouth_profile": "soft-expressive",
        "onset": "charming silky onset",
        "ending": "warm lingering finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.5,
      "midFreq": 1150,
      "midGain": 2.6,
      "presenceFreq": 3700,
      "presenceGain": 4.8,
      "highGain": 3.2,
      "reverb": 0.07,
      "reverbDecay": 0.38,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.2
      }
    }
  },
  {
    "id": "vn_f_ceo_23",
    "name": "23. Executive Woman 👑 (Nữ Doanh Nhân Khí Chất & Quyền Lực)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "doanhnhan",
    "category": "Doanh Nhân & Lãnh Đạo",
    "pitch": 0.94,
    "rate": 0.94,
    "recommendedFor": "both",
    "desc": "Giọng nói trầm chắc từ lồng ngực, quyền uy và đĩnh đạc, truyền tải thông điệp chiến lược, tầm nhìn và quản trị đỉnh cao.",
    "sampleText": "Sự kiên định với chất lượng cốt lõi và tư duy đột phá chính là chìa khóa giúp chúng ta bứt phá và dẫn đầu thị trường.",
    "edgePitch": "-6%",
    "edgeRate": "-6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Executive Pro",
        "accent_strength": 68
      },
      "persona": {
        "age": "24-28",
        "personality": "lãnh đạo, quyền lực, đĩnh đạc, quyết đoán",
        "authority": 100,
        "friendliness": 70
      },
      "style": {
        "primary": "executive_leadership",
        "secondary": [
          "corporate_vision",
          "business_pitch",
          "strategic_message"
        ]
      },
      "emotion": {
        "warmth": 73,
        "happiness": 55,
        "excitement": 50,
        "confidence": 100,
        "authority": 100,
        "empathy": 72
      },
      "acoustic": {
        "pitch": 51,
        "pitch_range": 38,
        "depth": 68,
        "warmth": 73,
        "resonance": 89,
        "breathiness": 2,
        "clarity": 100,
        "articulation": 100,
        "speed": 59,
        "rhythm": 63,
        "intonation": 64,
        "energy": 69,
        "emphasis": 94,
        "pause": 86
      },
      "performance": {
        "vocal_placement": "chest-led",
        "texture": "dense-authoritative",
        "mouth_profile": "firm-controlled",
        "onset": "authoritative chest resonance",
        "ending": "decisive low fall",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 4,
      "midFreq": 900,
      "midGain": 2.8,
      "presenceFreq": 3100,
      "presenceGain": 4,
      "highGain": 2,
      "reverb": 0.05,
      "reverbDecay": 0.32,
      "compressor": {
        "threshold": -18,
        "ratio": 4,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_founder_24",
    "name": "24. Founder Spirit 👑 (Nữ Sáng Lập Khởi Nghiệp Đam Mê)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "standard",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "doanhnhan",
    "category": "Doanh Nhân & Lãnh Đạo",
    "pitch": 0.98,
    "rate": 1,
    "recommendedFor": "both",
    "desc": "Giọng nữ founder giàu hoài bão, ấm áp và truyền cảm, thắp sáng niềm tin và tinh thần phụng sự trong từng dự án kinh doanh.",
    "sampleText": "Mỗi sản phẩm chúng tôi tạo ra không chỉ là công nghệ, mà là tâm huyết mang lại giải pháp tốt nhất cho cộng đồng.",
    "edgePitch": "-2%",
    "edgeRate": "+0%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "Neutral",
        "accent": "Standard Vietnamese Modern",
        "accent_strength": 38
      },
      "persona": {
        "age": "24-28",
        "personality": "khát vọng, truyền cảm hứng, đam mê, ấm áp",
        "authority": 92,
        "friendliness": 90
      },
      "style": {
        "primary": "founder_story",
        "secondary": [
          "startup_vision",
          "brand_mission",
          "investor_pitch"
        ]
      },
      "emotion": {
        "warmth": 86,
        "happiness": 80,
        "excitement": 85,
        "confidence": 98,
        "positivity": 97,
        "empathy": 85
      },
      "acoustic": {
        "pitch": 57,
        "pitch_range": 63,
        "depth": 49,
        "warmth": 86,
        "resonance": 76,
        "breathiness": 5,
        "clarity": 98,
        "articulation": 97,
        "speed": 69,
        "rhythm": 76,
        "intonation": 84,
        "energy": 89,
        "emphasis": 92,
        "pause": 67
      },
      "performance": {
        "vocal_placement": "mixed chest/oral",
        "texture": "rich-confident",
        "mouth_profile": "open-sincere",
        "onset": "warm confident inspiration",
        "ending": "vision words receive emotional rise",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.5,
      "midFreq": 1100,
      "midGain": 2.8,
      "presenceFreq": 3600,
      "presenceGain": 4.8,
      "highGain": 2.8,
      "reverb": 0.06,
      "reverbDecay": 0.32,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_ad_luxury_25",
    "name": "25. Luxury Voice 👑 (Quảng Cáo TVC Chuẩn Điện Ảnh Quốc Tế)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "quangcao",
    "category": "Quảng Cáo & TVC",
    "pitch": 0.94,
    "rate": 0.88,
    "recommendedFor": "both",
    "desc": "Giọng đọc TVC thương hiệu thượng lưu, trầm sâu, sang quý như nhung, tôn vinh kiệt tác kiến trúc và phong cách sống xa hoa.",
    "sampleText": "Không gian sống hoàn mỹ, nơi hội tụ những giá trị trường tồn và khẳng định vị thế độc tôn của chủ nhân xứng tầm.",
    "edgePitch": "-6%",
    "edgeRate": "-12%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Luxury Cinematic",
        "accent_strength": 65
      },
      "persona": {
        "age": "24-28",
        "personality": "thượng lưu, quý phái, điềm tĩnh, sang trọng",
        "authority": 95,
        "friendliness": 72
      },
      "style": {
        "primary": "luxury_tvc",
        "secondary": [
          "cinematic_brand",
          "real_estate_luxury",
          "masterpiece"
        ]
      },
      "emotion": {
        "warmth": 85,
        "happiness": 55,
        "excitement": 40,
        "confidence": 92,
        "elegance": 100,
        "calm": 94
      },
      "acoustic": {
        "pitch": 52,
        "pitch_range": 41,
        "depth": 67,
        "warmth": 85,
        "resonance": 91,
        "breathiness": 11,
        "clarity": 99,
        "articulation": 98,
        "speed": 52,
        "rhythm": 56,
        "intonation": 67,
        "energy": 55,
        "emphasis": 76,
        "pause": 89
      },
      "performance": {
        "vocal_placement": "low chest/oral",
        "texture": "cinematic-velvet",
        "mouth_profile": "aristocratic-calm",
        "onset": "cinematic deep velvet breath",
        "ending": "deep cinematic fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 3.8,
      "midFreq": 920,
      "midGain": 2.2,
      "presenceFreq": 3100,
      "presenceGain": 4,
      "highGain": 2.2,
      "reverb": 0.12,
      "reverbDecay": 0.55,
      "compressor": {
        "threshold": -16,
        "ratio": 3,
        "attack": 0.015,
        "release": 0.28
      }
    }
  },
  {
    "id": "vn_f_expert_26",
    "name": "26. Expert Pro 👑 (Chuyên Gia Phân Tích Thuyết Phục)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "standard",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "chuyengia",
    "category": "Tri Thức & Công Nghệ",
    "pitch": 0.96,
    "rate": 0.97,
    "recommendedFor": "both",
    "desc": "Giọng đọc chuẩn mực, đĩnh đạc, dựa trên số liệu và cơ chế khoa học, tạo độ tin cậy tuyệt đối cho tài chính, y dược, thẩm mỹ.",
    "sampleText": "Kết quả kiểm nghiệm lâm sàng đã chứng minh sản phẩm cải thiện độ đàn hồi rõ rệt sau 2 tuần sử dụng liên tục.",
    "edgePitch": "-4%",
    "edgeRate": "-3%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "Neutral",
        "accent": "Standard Scientific",
        "accent_strength": 32
      },
      "persona": {
        "age": "24-28",
        "personality": "uyên bác, khoa học, điềm đạm, thuyết phục",
        "authority": 96,
        "friendliness": 78
      },
      "style": {
        "primary": "expert_consulting",
        "secondary": [
          "scientific_proof",
          "medical_finance",
          "analytical_sales"
        ]
      },
      "emotion": {
        "warmth": 76,
        "happiness": 60,
        "excitement": 50,
        "confidence": 98,
        "trust": 96,
        "authority": 96
      },
      "acoustic": {
        "pitch": 55,
        "pitch_range": 45,
        "depth": 55,
        "warmth": 76,
        "resonance": 78,
        "breathiness": 3,
        "clarity": 100,
        "articulation": 100,
        "speed": 66,
        "rhythm": 68,
        "intonation": 72,
        "energy": 64,
        "emphasis": 88,
        "pause": 74
      },
      "performance": {
        "vocal_placement": "centered-chest",
        "texture": "dense-clean",
        "mouth_profile": "precise-objective",
        "onset": "scientific articulate attack",
        "ending": "firm objective finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.6,
      "midFreq": 1050,
      "midGain": 2.8,
      "presenceFreq": 3500,
      "presenceGain": 4.8,
      "highGain": 2.5,
      "reverb": 0.04,
      "reverbDecay": 0.28,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_story_emotional_27",
    "name": "27. Heart Story 👑 (Kể Chuyện Cảm Động Chạm Tới Trái Tim)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 0.98,
    "rate": 0.88,
    "recommendedFor": "both",
    "desc": "Giọng kể chuyện đong đầy cảm xúc, ấm áp lắng đọng từng hơi thở, chạm sâu vào những góc khuất tâm hồn người nghe.",
    "sampleText": "Có những kỷ niệm dù đã qua đi rất lâu, nhưng mỗi khi nhớ lại, lòng ta vẫn vẹn nguyên cảm xúc ngọt ngào như ngày đầu.",
    "edgePitch": "-2%",
    "edgeRate": "-12%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Deep Storyteller",
        "accent_strength": 55
      },
      "persona": {
        "age": "24-28",
        "personality": "truyền cảm, sâu sắc, bao dung, ấm áp",
        "authority": 75,
        "friendliness": 98
      },
      "style": {
        "primary": "deep_storytelling",
        "secondary": [
          "emotional_audiobook",
          "heart_connection",
          "memory_lane"
        ]
      },
      "emotion": {
        "warmth": 100,
        "happiness": 65,
        "excitement": 35,
        "confidence": 85,
        "emotional_depth": 100,
        "empathy": 98
      },
      "acoustic": {
        "pitch": 58,
        "pitch_range": 68,
        "depth": 51,
        "warmth": 100,
        "resonance": 66,
        "breathiness": 28,
        "clarity": 93,
        "articulation": 91,
        "speed": 52,
        "rhythm": 57,
        "intonation": 93,
        "energy": 48,
        "emphasis": 78,
        "pause": 92
      },
      "performance": {
        "vocal_placement": "intimate oral",
        "texture": "warm-breathy",
        "mouth_profile": "soft-expressive",
        "onset": "heartfelt breath-led touch",
        "ending": "deep emotional resonance fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.8,
      "midFreq": 980,
      "midGain": 2.4,
      "presenceFreq": 3300,
      "presenceGain": 4.2,
      "highGain": 2.8,
      "reverb": 0.12,
      "reverbDecay": 0.58,
      "compressor": {
        "threshold": -16,
        "ratio": 2.8,
        "attack": 0.02,
        "release": 0.3
      }
    }
  },
  {
    "id": "vn_f_story_cinema_28",
    "name": "28. Cinema Narrator 👑 (Thuyết Minh Review Phim Bom Tấn)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 0.92,
    "rate": 0.86,
    "recommendedFor": "both",
    "desc": "Giọng đọc điện ảnh kịch tính, trầm tối ma mị, khoảng lặng hồi hộp tạo cảm giác điện ảnh đỉnh cao cho review phim và trinh thám.",
    "sampleText": "Khi sự thật dần hé lộ sau bức màn bí ẩn, tất cả những kẻ đứng sau kế hoạch tàn nhẫn đều không ngờ tới kết cục này.",
    "edgePitch": "-8%",
    "edgeRate": "-14%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Cinema Suspense",
        "accent_strength": 65
      },
      "persona": {
        "age": "24-28",
        "personality": "hồi hộp, bí ẩn, cuốn hút, điện ảnh",
        "authority": 92,
        "friendliness": 65
      },
      "style": {
        "primary": "cinematic_narration",
        "secondary": [
          "movie_recap",
          "mystery_thriller",
          "suspense_story"
        ]
      },
      "emotion": {
        "warmth": 78,
        "happiness": 40,
        "excitement": 70,
        "confidence": 96,
        "depth": 98,
        "suspense": 91
      },
      "acoustic": {
        "pitch": 49,
        "pitch_range": 54,
        "depth": 72,
        "warmth": 78,
        "resonance": 94,
        "breathiness": 10,
        "clarity": 97,
        "articulation": 95,
        "speed": 48,
        "rhythm": 53,
        "intonation": 84,
        "energy": 60,
        "emphasis": 91,
        "pause": 95
      },
      "performance": {
        "vocal_placement": "chest-low",
        "texture": "cinematic-dark-warm",
        "mouth_profile": "suspense-low",
        "onset": "dramatic dark onset",
        "ending": "cinematic low drop",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 4.4,
      "midFreq": 850,
      "midGain": 2.6,
      "presenceFreq": 2900,
      "presenceGain": 4.4,
      "highGain": 2,
      "reverb": 0.14,
      "reverbDecay": 0.65,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.015,
        "release": 0.3
      }
    }
  },
  {
    "id": "vn_f_sales_soft_29",
    "name": "29. Soft Seller 👑 (Bán Hàng Mềm Mại Thuyết Phục)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1,
    "rate": 0.94,
    "recommendedFor": "both",
    "desc": "Bán hàng không tạo áp lực, nhịp điệu thuyết phục êm dịu, mưa dầm thấm lâu, khách nghe là tự động muốn chốt đơn.",
    "sampleText": "Chị em mình đầu tư cho bản thân một sản phẩm chất lượng như vầy thì vừa tiết kiệm thời gian mà kết quả lại vượt mong đợi nè.",
    "edgePitch": "+0%",
    "edgeRate": "-6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Soft Persuasion",
        "accent_strength": 52
      },
      "persona": {
        "age": "24-28",
        "personality": "thuyết phục, êm ái, thấu hiểu, kiên nhẫn",
        "authority": 82,
        "friendliness": 98
      },
      "style": {
        "primary": "soft_selling",
        "secondary": [
          "consultative_sales",
          "gentle_closing",
          "home_wellness"
        ]
      },
      "emotion": {
        "warmth": 98,
        "happiness": 75,
        "excitement": 50,
        "confidence": 89,
        "trust": 97,
        "empathy": 95
      },
      "acoustic": {
        "pitch": 61,
        "pitch_range": 48,
        "depth": 43,
        "warmth": 98,
        "resonance": 60,
        "breathiness": 18,
        "clarity": 96,
        "articulation": 94,
        "speed": 58,
        "rhythm": 62,
        "intonation": 78,
        "energy": 52,
        "emphasis": 78,
        "pause": 81
      },
      "performance": {
        "vocal_placement": "soft-oral",
        "texture": "soft-mellow",
        "mouth_profile": "relaxed-gentle",
        "onset": "low-pressure gentle onset",
        "ending": "low-pressure persuasive cadence",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.8,
      "midFreq": 1100,
      "midGain": 2.2,
      "presenceFreq": 3600,
      "presenceGain": 4.2,
      "highGain": 2.8,
      "reverb": 0.07,
      "reverbDecay": 0.38,
      "compressor": {
        "threshold": -17,
        "ratio": 3,
        "attack": 0.01,
        "release": 0.22
      }
    }
  },
  {
    "id": "vn_f_sales_closer_elite_30",
    "name": "30. Closer Elite 👑 (Nữ Hoàng Chốt Sale Thượng Đỉnh)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 0.97,
    "rate": 1.05,
    "recommendedFor": "both",
    "desc": "Quy trình chốt sale hoàn hảo: ngưng lặng -> báo giá -> ngưng lặng -> dứt khoát kêu gọi hành động, biến mọi lưỡng lự thành đơn hàng.",
    "sampleText": "Cơ hội duy nhất trong ngày hôm nay: đúng 500 nghìn đồng. Bấm vào nút Mua Ngay để nhận ưu đãi trước khi kết thúc phiên!",
    "edgePitch": "-3%",
    "edgeRate": "+5%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Elite Closing",
        "accent_strength": 65
      },
      "persona": {
        "age": "24-28",
        "personality": "sắc sảo, tự tin tuyệt đối, làm chủ tình thế",
        "authority": 96,
        "friendliness": 78
      },
      "style": {
        "primary": "elite_closing",
        "secondary": [
          "deal_breaker",
          "high_conversion",
          "objection_crusher"
        ]
      },
      "emotion": {
        "warmth": 78,
        "happiness": 75,
        "excitement": 88,
        "confidence": 100,
        "urgency": 91,
        "authority": 96
      },
      "acoustic": {
        "pitch": 56,
        "pitch_range": 48,
        "depth": 57,
        "warmth": 78,
        "resonance": 81,
        "breathiness": 2,
        "clarity": 100,
        "articulation": 100,
        "speed": 77,
        "rhythm": 83,
        "intonation": 80,
        "energy": 90,
        "emphasis": 100,
        "pause": 69
      },
      "performance": {
        "vocal_placement": "chest-oral balanced",
        "texture": "firm-resonant",
        "mouth_profile": "clean-sharp",
        "onset": "silence → price → silence → CTA",
        "ending": "decisive conversion landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.8,
      "midFreq": 1150,
      "midGain": 3.2,
      "presenceFreq": 3700,
      "presenceGain": 5.4,
      "highGain": 3,
      "reverb": 0.04,
      "reverbDecay": 0.25,
      "compressor": {
        "threshold": -23,
        "ratio": 4.8,
        "attack": 0.003,
        "release": 0.1
      }
    }
  },
  {
    "id": "vn_f_ad_beauty_lux_31",
    "name": "31. Beauty Lux 👑 (Mỹ Phẩm Thượng Lưu, Spa Hoàng Gia)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "quangcao",
    "category": "Quảng Cáo & TVC",
    "pitch": 1.03,
    "rate": 0.94,
    "recommendedFor": "both",
    "desc": "Giọng đọc làm đẹp thượng lưu, thanh tao quý phái, hơi thở nhẹ êm gợi cảm giác đắm mình trong liệu trình spa cao cấp.",
    "sampleText": "Khơi nguồn nét thanh xuân bất tận cùng tinh chất vàng hoàng gia, nuôi dưỡng từng tế bào da căng tràn sức sống.",
    "edgePitch": "+3%",
    "edgeRate": "-6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Royal Beauty",
        "accent_strength": 50
      },
      "persona": {
        "age": "24-28",
        "personality": "quý tộc, tao nhã, kiêu sa, mượt mà",
        "authority": 88,
        "friendliness": 92
      },
      "style": {
        "primary": "luxury_beauty",
        "secondary": [
          "royal_spa",
          "anti_aging",
          "aesthetic_clinic"
        ]
      },
      "emotion": {
        "warmth": 95,
        "happiness": 80,
        "excitement": 60,
        "confidence": 91,
        "elegance": 98,
        "empathy": 90
      },
      "acoustic": {
        "pitch": 67,
        "pitch_range": 59,
        "depth": 35,
        "warmth": 95,
        "resonance": 62,
        "breathiness": 27,
        "clarity": 96,
        "articulation": 93,
        "speed": 61,
        "rhythm": 67,
        "intonation": 88,
        "energy": 65,
        "emphasis": 78,
        "pause": 71
      },
      "performance": {
        "vocal_placement": "forward-soft",
        "texture": "silky-airy",
        "mouth_profile": "elegant-aesthetic",
        "onset": "royal breath whisper",
        "ending": "silky floating fade",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 0.5,
      "midFreq": 1150,
      "midGain": 2.6,
      "presenceFreq": 3900,
      "presenceGain": 5,
      "highGain": 4,
      "reverb": 0.09,
      "reverbDecay": 0.45,
      "compressor": {
        "threshold": -17,
        "ratio": 3,
        "attack": 0.01,
        "release": 0.22
      }
    }
  },
  {
    "id": "vn_f_ad_tech_future_32",
    "name": "32. Tech Future 👑 (Trí Tuệ Nhân Tạo & Công Nghệ Tương Lai)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "standard",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "quangcao",
    "category": "Quảng Cáo & TVC",
    "pitch": 0.99,
    "rate": 1.02,
    "recommendedFor": "both",
    "desc": "Giọng đọc sắc sảo, siêu hiện đại, biểu tượng của trí tuệ nhân tạo thế hệ mới, giải pháp công nghệ đám mây và tương lai số.",
    "sampleText": "Khám phá kỷ nguyên trí tuệ nhân tạo toàn diện, tự động hóa mọi quy trình và mở khóa tiềm năng phát triển không giới hạn.",
    "edgePitch": "-1%",
    "edgeRate": "+2%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "Neutral",
        "accent": "Standard AI Modern Tech",
        "accent_strength": 32
      },
      "persona": {
        "age": "24-28",
        "personality": "thông tuệ, sắc sảo, hiện đại, tương lai",
        "authority": 96,
        "friendliness": 80
      },
      "style": {
        "primary": "ai_technology",
        "secondary": [
          "future_software",
          "cloud_computing",
          "smart_device"
        ]
      },
      "emotion": {
        "warmth": 69,
        "happiness": 65,
        "excitement": 74,
        "confidence": 96,
        "intelligence": 98,
        "curiosity": 86
      },
      "acoustic": {
        "pitch": 59,
        "pitch_range": 49,
        "depth": 48,
        "warmth": 69,
        "resonance": 78,
        "breathiness": 4,
        "clarity": 100,
        "articulation": 100,
        "speed": 73,
        "rhythm": 75,
        "intonation": 77,
        "energy": 74,
        "emphasis": 86,
        "pause": 61
      },
      "performance": {
        "vocal_placement": "oral-forward",
        "texture": "clean-modern",
        "mouth_profile": "sharp-precise",
        "onset": "high-tech articulate attack",
        "ending": "crisp modern finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.8,
      "midFreq": 1250,
      "midGain": 3,
      "presenceFreq": 3800,
      "presenceGain": 5.2,
      "highGain": 3.4,
      "reverb": 0.04,
      "reverbDecay": 0.26,
      "compressor": {
        "threshold": -19,
        "ratio": 3.8,
        "attack": 0.005,
        "release": 0.15
      }
    }
  },
  {
    "id": "vn_f_motivation_queen_33",
    "name": "33. Motivation Queen 👑 (Diễn Giả Truyền Động Lực Quyền Uy)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 0.98,
    "rate": 0.99,
    "recommendedFor": "both",
    "desc": "Giọng đọc hùng tráng của nữ thủ lĩnh, nội lực cuồn cuộn, tuyên bố mạnh mẽ giúp người nghe thức tỉnh và hành động ngay lập tức.",
    "sampleText": "Thành công không tự nhiên đến với người chỉ biết ngồi chờ đợi! Hãy đứng dậy, dấn thân và kiến tạo tương lai của chính bạn!",
    "edgePitch": "-2%",
    "edgeRate": "-1%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Powerful Keynote",
        "accent_strength": 68
      },
      "persona": {
        "age": "24-28",
        "personality": "thủ lĩnh, hùng hồn, mạnh mẽ, truyền cảm",
        "authority": 98,
        "friendliness": 85
      },
      "style": {
        "primary": "keynote_motivational",
        "secondary": [
          "life_coaching",
          "high_energy_speech",
          "unstoppable_mindset"
        ]
      },
      "emotion": {
        "warmth": 86,
        "happiness": 85,
        "excitement": 95,
        "confidence": 100,
        "positivity": 100,
        "energy": 96
      },
      "acoustic": {
        "pitch": 58,
        "pitch_range": 70,
        "depth": 55,
        "warmth": 86,
        "resonance": 82,
        "breathiness": 3,
        "clarity": 98,
        "articulation": 98,
        "speed": 68,
        "rhythm": 73,
        "intonation": 91,
        "energy": 97,
        "emphasis": 100,
        "pause": 71
      },
      "performance": {
        "vocal_placement": "chest-oral",
        "texture": "powerful-resonant",
        "mouth_profile": "wide-projected",
        "onset": "resonant thunderous onset",
        "ending": "powerful authoritative impact",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 3.2,
      "midFreq": 1100,
      "midGain": 3.2,
      "presenceFreq": 3600,
      "presenceGain": 5.2,
      "highGain": 3,
      "reverb": 0.06,
      "reverbDecay": 0.35,
      "compressor": {
        "threshold": -20,
        "ratio": 4.2,
        "attack": 0.005,
        "release": 0.15
      }
    }
  },
  {
    "id": "vn_f_trusted_advisor_34",
    "name": "34. Trusted Advisor 👑 (Cố Vấn Cao Cấp Chân Thành)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "chuyengia",
    "category": "Tri Thức & Công Nghệ",
    "pitch": 0.96,
    "rate": 0.95,
    "recommendedFor": "both",
    "desc": "Giọng tư vấn trung thực, trầm ấm, chuẩn mực, đem lại sự tin cậy tuyệt đối cho các hợp đồng lớn, bảo hiểm và giải pháp tài chính.",
    "sampleText": "Chúng tôi luôn đồng hành và bảo vệ quyền lợi tối đa của bạn với những giải pháp tài chính an toàn và bền vững nhất.",
    "edgePitch": "-4%",
    "edgeRate": "-5%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Trusted Advisor",
        "accent_strength": 62
      },
      "persona": {
        "age": "24-28",
        "personality": "đáng tin cậy, chân thành, trách nhiệm, điềm tĩnh",
        "authority": 95,
        "friendliness": 92
      },
      "style": {
        "primary": "trusted_advisory",
        "secondary": [
          "wealth_management",
          "financial_consulting",
          "insurance_advisor"
        ]
      },
      "emotion": {
        "warmth": 95,
        "happiness": 65,
        "excitement": 45,
        "confidence": 96,
        "trust": 100,
        "empathy": 91
      },
      "acoustic": {
        "pitch": 55,
        "pitch_range": 43,
        "depth": 51,
        "warmth": 95,
        "resonance": 75,
        "breathiness": 5,
        "clarity": 99,
        "articulation": 98,
        "speed": 62,
        "rhythm": 65,
        "intonation": 70,
        "energy": 57,
        "emphasis": 75,
        "pause": 79
      },
      "performance": {
        "vocal_placement": "centered",
        "texture": "warm-dense",
        "mouth_profile": "calm-sincere",
        "onset": "reassuring solid attack",
        "ending": "firm comforting landing",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.8,
      "midFreq": 1000,
      "midGain": 2.6,
      "presenceFreq": 3400,
      "presenceGain": 4.4,
      "highGain": 2.2,
      "reverb": 0.05,
      "reverbDecay": 0.3,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_mc_elegance_35",
    "name": "35. MC Elegance 👑 (MC Đài Các, Sự Kiện Vinh Danh Thảm Đỏ)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "mc_btv",
    "category": "MC, BTV & Sự Kiện",
    "pitch": 1.01,
    "rate": 0.99,
    "recommendedFor": "both",
    "desc": "Giọng nữ MC đài các, uyển chuyển, giới thiệu có độ nâng thanh lịch, tôn vinh các lễ trao giải, dạ tiệc và lễ kỷ niệm trang trọng.",
    "sampleText": "Kính thưa quý vị đại biểu, giây phút trang trọng nhất đêm nay: xin được vinh danh những gương mặt xuất sắc và tiêu biểu nhất!",
    "edgePitch": "+1%",
    "edgeRate": "-1%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern High Gala MC",
        "accent_strength": 65
      },
      "persona": {
        "age": "24-28",
        "personality": "đài các, lộng lẫy, chuẩn mực, trang trọng",
        "authority": 94,
        "friendliness": 90
      },
      "style": {
        "primary": "gala_mc",
        "secondary": [
          "award_ceremony",
          "red_carpet",
          "grand_opening"
        ]
      },
      "emotion": {
        "warmth": 87,
        "happiness": 88,
        "excitement": 82,
        "confidence": 98,
        "elegance": 98,
        "empathy": 82
      },
      "acoustic": {
        "pitch": 62,
        "pitch_range": 60,
        "depth": 44,
        "warmth": 87,
        "resonance": 80,
        "breathiness": 6,
        "clarity": 100,
        "articulation": 100,
        "speed": 68,
        "rhythm": 85,
        "intonation": 93,
        "energy": 79,
        "emphasis": 85,
        "pause": 63
      },
      "performance": {
        "vocal_placement": "oral-mask",
        "texture": "polished-silky",
        "mouth_profile": "refined-mask",
        "onset": "grand gala lift",
        "ending": "elegant noble finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2,
      "midFreq": 1150,
      "midGain": 2.8,
      "presenceFreq": 3800,
      "presenceGain": 5,
      "highGain": 3.2,
      "reverb": 0.08,
      "reverbDecay": 0.42,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.2
      }
    }
  },
  {
    "id": "vn_f_podcast_intimate_36",
    "name": "36. Podcast Intimate 👑 (Host Podcast Phòng Thu Gần Gũi)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "standard",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "podcast",
    "category": "Kể Chuyện & Podcast",
    "pitch": 0.96,
    "rate": 0.93,
    "recommendedFor": "both",
    "desc": "Giọng host podcast ấm áp chuẩn phòng thu close-mic, tĩnh lặng và sâu lắng, dẫn dắt các cuộc trò chuyện nhân sinh đa chiều.",
    "sampleText": "Chào mừng bạn quay trở lại với không gian podcast, nơi chúng ta cùng ngồi lại và chia sẻ những góc nhìn chân thật nhất về cuộc sống.",
    "edgePitch": "-4%",
    "edgeRate": "-7%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "Neutral",
        "accent": "Standard Studio Close-Mic",
        "accent_strength": 35
      },
      "persona": {
        "age": "24-28",
        "personality": "lắng nghe, thấu cảm, đĩnh đạc, ấm áp",
        "authority": 88,
        "friendliness": 95
      },
      "style": {
        "primary": "intimate_podcast",
        "secondary": [
          "deep_talk",
          "life_reflections",
          "thought_sharing"
        ]
      },
      "emotion": {
        "warmth": 96,
        "happiness": 70,
        "excitement": 45,
        "confidence": 90,
        "trust": 94,
        "calm": 91
      },
      "acoustic": {
        "pitch": 55,
        "pitch_range": 43,
        "depth": 58,
        "warmth": 96,
        "resonance": 72,
        "breathiness": 20,
        "clarity": 96,
        "articulation": 94,
        "speed": 55,
        "rhythm": 61,
        "intonation": 79,
        "energy": 54,
        "emphasis": 69,
        "pause": 82
      },
      "performance": {
        "vocal_placement": "close oral-chest",
        "texture": "warm-rich",
        "mouth_profile": "close-mic-warm",
        "onset": "intimate close-mic breath",
        "ending": "calm lingering finish",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 3.4,
      "midFreq": 980,
      "midGain": 2.6,
      "presenceFreq": 3400,
      "presenceGain": 4.5,
      "highGain": 2.5,
      "reverb": 0.05,
      "reverbDecay": 0.28,
      "compressor": {
        "threshold": -19,
        "ratio": 3.8,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_comedy_muse_37",
    "name": "37. Comedy Muse 👑 (Hài Hước Trưởng Thành, Châm Biếm Duyên Dáng)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "idol_genz",
    "category": "Creator & Viral",
    "pitch": 1.07,
    "rate": 1.06,
    "recommendedFor": "both",
    "desc": "Hài hước sâu cay và duyên dáng của phụ nữ trưởng thành, timing nhả chữ đỉnh cao, biến video drama thành tiếng cười dí dỏm.",
    "sampleText": "Đời người ngắn ngủi lắm mấy bà ơi, rảnh đâu mà buồn phiền, cứ sắm sửa cho đẹp rạng ngời rồi tự tin bước tiếp nha!",
    "edgePitch": "+7%",
    "edgeRate": "+6%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Witty Adult",
        "accent_strength": 58
      },
      "persona": {
        "age": "24-28",
        "personality": "hài hước, duyên dáng, thông minh, châm biếm nhẹ",
        "authority": 82,
        "friendliness": 98
      },
      "style": {
        "primary": "mature_comedy",
        "secondary": [
          "witty_commentary",
          "satirical_talk",
          "lifestyle_humor"
        ]
      },
      "emotion": {
        "warmth": 90,
        "happiness": 96,
        "excitement": 92,
        "confidence": 95,
        "humor": 100,
        "energy": 96
      },
      "acoustic": {
        "pitch": 75,
        "pitch_range": 91,
        "depth": 29,
        "warmth": 90,
        "resonance": 47,
        "breathiness": 10,
        "clarity": 94,
        "articulation": 91,
        "speed": 84,
        "rhythm": 99,
        "intonation": 100,
        "energy": 96,
        "emphasis": 96,
        "pause": 34
      },
      "performance": {
        "vocal_placement": "forward",
        "texture": "bright-elastic",
        "mouth_profile": "witty-playful",
        "onset": "witty conversational onset",
        "ending": "comedic timing drop",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": -0.5,
      "midFreq": 1400,
      "midGain": 3,
      "presenceFreq": 4400,
      "presenceGain": 5.6,
      "highGain": 4.2,
      "reverb": 0.05,
      "reverbDecay": 0.28,
      "compressor": {
        "threshold": -21,
        "ratio": 4,
        "attack": 0.004,
        "release": 0.14
      }
    }
  },
  {
    "id": "vn_f_calm_authority_38",
    "name": "38. Calm Authority 👑 (Điềm Tĩnh Quyền Uy, Uy Lực Lắng Đọng)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "bac",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "doanhnhan",
    "category": "Doanh Nhân & Lãnh Đạo",
    "pitch": 0.93,
    "rate": 0.91,
    "recommendedFor": "both",
    "desc": "Giọng nói không cần lên gân nhưng toát ra uy lực tối cao, khoảng dừng chiến lược làm chủ toàn bộ khán phòng.",
    "sampleText": "Chất lượng đích thực không cần phải phô trương. Nó tự khẳng định giá trị bằng sự tin tưởng và trải nghiệm của khách hàng.",
    "edgePitch": "-7%",
    "edgeRate": "-9%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "NORTH",
        "accent": "Northern Calm Authority",
        "accent_strength": 68
      },
      "persona": {
        "age": "24-28",
        "personality": "uy lực, điềm đạm, sâu sắc, không lay chuyển",
        "authority": 99,
        "friendliness": 68
      },
      "style": {
        "primary": "calm_authority",
        "secondary": [
          "deep_statement",
          "executive_closing",
          "premium_counsel"
        ]
      },
      "emotion": {
        "warmth": 79,
        "happiness": 50,
        "excitement": 40,
        "confidence": 98,
        "authority": 99,
        "calm": 97
      },
      "acoustic": {
        "pitch": 50,
        "pitch_range": 37,
        "depth": 65,
        "warmth": 79,
        "resonance": 88,
        "breathiness": 2,
        "clarity": 99,
        "articulation": 99,
        "speed": 56,
        "rhythm": 59,
        "intonation": 65,
        "energy": 62,
        "emphasis": 88,
        "pause": 90
      },
      "performance": {
        "vocal_placement": "chest-led",
        "texture": "deep-clean",
        "mouth_profile": "calm-commanding",
        "onset": "unshakable chest onset",
        "ending": "low authoritative silence",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 3.8,
      "midFreq": 900,
      "midGain": 2.8,
      "presenceFreq": 3100,
      "presenceGain": 4.2,
      "highGain": 2,
      "reverb": 0.06,
      "reverbDecay": 0.35,
      "compressor": {
        "threshold": -18,
        "ratio": 4,
        "attack": 0.01,
        "release": 0.2
      }
    }
  },
  {
    "id": "vn_f_desire_sales_39",
    "name": "39. Desire Voice 👑 (Khơi Gợi Khao Khát Sở Hữu Đỉnh Cao)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.03,
    "rate": 0.97,
    "recommendedFor": "both",
    "desc": "Âm sắc mượt mà, nhấn nhá lưu luyến ở từ khóa lợi ích rồi chốt hạ dứt khoát, kích hoạt khao khát sở hữu sản phẩm mãnh liệt.",
    "sampleText": "Hãy tưởng tượng cảm giác tuyệt vời khi bạn bước ra phố với diện mạo quyến rũ và tự tin nhất. Đừng chần chừ, sở hữu ngay hôm nay nhé!",
    "edgePitch": "+3%",
    "edgeRate": "-3%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH",
        "accent": "Southern Alluring Sales",
        "accent_strength": 54
      },
      "persona": {
        "age": "24-28",
        "personality": "quyến rũ, khơi gợi, tự tin, cuốn hút",
        "authority": 85,
        "friendliness": 95
      },
      "style": {
        "primary": "desire_sales",
        "secondary": [
          "aspirational_closing",
          "premium_lifestyle",
          "fashion_allure"
        ]
      },
      "emotion": {
        "warmth": 94,
        "happiness": 85,
        "excitement": 82,
        "confidence": 92,
        "desire": 98,
        "empathy": 90
      },
      "acoustic": {
        "pitch": 65,
        "pitch_range": 64,
        "depth": 39,
        "warmth": 94,
        "resonance": 61,
        "breathiness": 24,
        "clarity": 95,
        "articulation": 93,
        "speed": 63,
        "rhythm": 69,
        "intonation": 90,
        "energy": 75,
        "emphasis": 91,
        "pause": 68
      },
      "performance": {
        "vocal_placement": "intimate-forward",
        "texture": "silky-warm",
        "mouth_profile": "alluring-warm",
        "onset": "linger on benefit words",
        "ending": "decisive conversion CTA",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 1.5,
      "midFreq": 1150,
      "midGain": 2.8,
      "presenceFreq": 3800,
      "presenceGain": 5,
      "highGain": 3.5,
      "reverb": 0.08,
      "reverbDecay": 0.4,
      "compressor": {
        "threshold": -18,
        "ratio": 3.5,
        "attack": 0.008,
        "release": 0.18
      }
    }
  },
  {
    "id": "vn_f_master_closer_40",
    "name": "40. Master Closer 👑 (Siêu Bậc Thầy Bán Hàng & Chốt Đơn Toàn Diện)",
    "provider": "system",
    "tier": "pro",
    "badge": "🔥 Hot Trend VIP",
    "gender": "Female",
    "lang": "vi-VN",
    "region": "vi",
    "dialect": "nam",
    "ageGroup": "young",
    "ageRange": "24-28",
    "styleCategory": "banhang",
    "category": "Bán Hàng & Chốt Deal",
    "pitch": 1.01,
    "rate": 1.03,
    "recommendedFor": "both",
    "desc": "Giọng đọc đỉnh cao hội tụ toàn bộ 5 tầng DNA: Hook sáng -> Lợi ích ấm -> Báo giá sâu -> Khẩn cấp nhanh -> CTA đanh -> Chốt hạ quyết đoán.",
    "sampleText": "Duy nhất trong phiên live này: cơ hội sở hữu trọn bộ giải pháp cao cấp với mức giá độc quyền! Bấm Mua Ngay để nhận trọn bộ quà tặng đặc quyền!",
    "edgePitch": "+1%",
    "edgeRate": "+3%",
    "neuralVoice": "vi-VN-HoaiMyNeural",
    "dna": {
      "region": {
        "country": "VN",
        "region": "SOUTH/NORTH neutral blend",
        "accent": "Vietnamese Master Live Blend",
        "accent_strength": 45
      },
      "persona": {
        "age": "24-28",
        "personality": "bậc thầy chuyển đổi, uy lực, ấm áp, hoàn hảo",
        "authority": 98,
        "friendliness": 96
      },
      "style": {
        "primary": "master_sales",
        "secondary": [
          "all_round_closer",
          "mega_conversion",
          "irresistible_offer"
        ]
      },
      "emotion": {
        "warmth": 91,
        "happiness": 92,
        "excitement": 90,
        "confidence": 100,
        "urgency": 93,
        "trust": 96
      },
      "acoustic": {
        "pitch": 61,
        "pitch_range": 69,
        "depth": 46,
        "warmth": 91,
        "resonance": 72,
        "breathiness": 7,
        "clarity": 99,
        "articulation": 99,
        "speed": 80,
        "rhythm": 88,
        "intonation": 93,
        "energy": 94,
        "emphasis": 100,
        "pause": 67
      },
      "performance": {
        "vocal_placement": "mixed chest/oral",
        "texture": "rich-crisp",
        "mouth_profile": "precise-open",
        "onset": "warm-confident mastery onset",
        "ending": "HOOK bright → BENEFIT warm → PRICE deep → URGENCY fast → CTA firm → CLOSE warm decisive",
        "attention_curve": true,
        "emotional_micro_dynamics": true
      }
    },
    "dspProfile": {
      "lowGain": 2.5,
      "midFreq": 1100,
      "midGain": 3.2,
      "presenceFreq": 3700,
      "presenceGain": 5.5,
      "highGain": 3.5,
      "reverb": 0.05,
      "reverbDecay": 0.3,
      "compressor": {
        "threshold": -22,
        "ratio": 4.5,
        "attack": 0.004,
        "release": 0.12
      }
    }
  }
];

export const VIETNAMESE_HOTTREND_VOICES = [
  ...MASTER_DNA_FEMALE_VIETNAMESE_40_VOICES,
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
    neuralVoice: 'en-US-JennyNeural',
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
    neuralVoice: 'en-US-GuyNeural',
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
    neuralVoice: 'en-GB-SoniaNeural',
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
    neuralVoice: 'en-GB-RyanNeural',
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
    neuralVoice: 'en-CA-LiamNeural',
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
    neuralVoice: 'en-AU-WilliamNeural',
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
    neuralVoice: 'fr-FR-DeniseNeural',
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
    neuralVoice: 'fr-FR-HenriNeural',
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
    neuralVoice: 'it-IT-ElsaNeural',
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
    neuralVoice: 'it-IT-DiegoNeural',
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
    neuralVoice: 'de-DE-KatjaNeural',
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
    neuralVoice: 'de-DE-ConradNeural',
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
    neuralVoice: 'es-ES-ElviraNeural',
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
    neuralVoice: 'ru-RU-SvetlanaNeural',
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
    neuralVoice: 'zh-CN-XiaoxiaoNeural',
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
    neuralVoice: 'zh-CN-YunxiNeural',
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
    neuralVoice: 'ja-JP-NanamiNeural',
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
    neuralVoice: 'ja-JP-KeitaNeural',
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
    neuralVoice: 'ko-KR-SunHiNeural',
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
    neuralVoice: 'ko-KR-InJoonNeural',
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
    neuralVoice: 'th-TH-PremwadeeNeural',
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
    name: 'Hoài My 👑 (Nữ 20-28t - Quốc Dân Trong Trẻo [Toàn Quốc])',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'idol',
    pitch: 1.04,
    rate: 1.02,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em Hoài My xin chào các bạn đang xem live nha! Chúc mọi người một ngày mới tràn ngập niềm vui và năng lượng tích cực ạ!',
    edgePitch: '+4%',
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
    name: 'Hoài My 👑 (Nữ 20-28t - Quốc Dân Trong Trẻo [Toàn Quốc])',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'comment',
    pitch: 1.04,
    rate: 1.02,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em Hoài My xin chào các bạn đang xem live nha! Chúc mọi người một ngày mới tràn ngập niềm vui và năng lượng tích cực ạ!',
    edgePitch: '+4%',
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
    name: 'Hoài My 👑 (Nữ 20-28t - Quốc Dân Trong Trẻo [Toàn Quốc])',
    provider: 'system',
    tier: 'pro',
    gender: 'Female',
    role: 'both',
    pitch: 1.04,
    rate: 1.02,
    volume: 1.0,
    enabled: true,
    sampleText: 'Dạ em Hoài My xin chào các bạn đang xem live nha! Chúc mọi người một ngày mới tràn ngập niềm vui và năng lượng tích cực ạ!',
    edgePitch: '+4%',
    edgeRate: '+2%',
  },
  selectedLanguage: 'vi',
  elevenLabsApiKey: '',
  openaiApiKey: '',
  geminiApiKey: ''
};

// ==================== MULTI-AVATAR LIVE STUDIO CONFIG (2 - 4 NHÂN VẬT TƯƠNG TÁC) ====================
export const STUDIO_BACKGROUND_PRESETS = [
  { id: 'bg_transparent', name: 'Nền Trong Suốt / Tự Động', url: '', color: '#000000', preview: '🎬' },
  { id: 'bg_greenscreen', name: 'Phông Xanh Chuẩn (Chroma Key)', url: '', color: '#00B140', preview: '🟩' },
  { id: 'bg_modern_studio', name: 'Phòng Studio Neon 4K', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop', color: '#0f111a', preview: '🎙️' },
  { id: 'bg_luxury_sales', name: 'Showroom Bán Hàng Cao Cấp', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop', color: '#161922', preview: '🛍️' },
  { id: 'bg_talkshow_lounge', name: 'Sân Khấu Talkshow Sang Trọng', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1920&auto=format&fit=crop', color: '#1a1824', preview: '🛋️' },
  { id: 'bg_cyber_pk', name: 'Đấu Trường PK Thách Đấu LED', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop', color: '#080a14', preview: '🎮' }
];

export const STUDIO_STAGE_PRESETS = {
  custom_canvas: {
    id: 'custom_canvas',
    name: '🎨 Tự Do Kéo Thả (Freeform Canvas)',
    desc: 'Di chuyển, thay đổi kích thước và xếp lớp tự do từng nhân vật theo ý muốn.'
  },
  sales_duo: {
    id: 'sales_duo',
    name: '🛍️ Bán Hàng Live (Idol Đứng + Trợ Lý Ngồi)',
    desc: 'Idol đứng chính diện tương tác, Trợ lý ngồi bàn máy tính bên cạnh chốt đơn.',
    transforms: {
      avatar_1: { x: 4, y: 8, width: 54, height: 88, zIndex: 10, pose: 'stand', objectFit: 'cover' },
      avatar_2: { x: 50, y: 28, width: 46, height: 68, zIndex: 5, pose: 'sit', objectFit: 'cover' },
      avatar_3: { x: 70, y: 5, width: 26, height: 35, zIndex: 2, pose: 'sit', objectFit: 'cover' },
      avatar_4: { x: 70, y: 45, width: 26, height: 35, zIndex: 2, pose: 'sit', objectFit: 'cover' }
    }
  },
  talkshow: {
    id: 'talkshow',
    name: '🎙️ Tọa Đàm Talkshow (MC Đứng/Giữa + Khách Mời Ngồi 2 Bên)',
    desc: 'Bố cục cân đối trường quay: MC ở trung tâm, khách mời ngồi ghế 2 bên.',
    transforms: {
      avatar_1: { x: 26, y: 10, width: 48, height: 85, zIndex: 10, pose: 'stand', objectFit: 'cover' },
      avatar_2: { x: 2, y: 30, width: 38, height: 65, zIndex: 5, pose: 'sit', objectFit: 'cover' },
      avatar_3: { x: 60, y: 30, width: 38, height: 65, zIndex: 5, pose: 'sit', objectFit: 'cover' },
      avatar_4: { x: 76, y: 8, width: 22, height: 35, zIndex: 2, pose: 'sit', objectFit: 'cover' }
    }
  },
  pk_caster: {
    id: 'pk_caster',
    name: '🎮 PK Game Đối Kháng (2 Đấu Thủ + BLV Phía Dưới)',
    desc: '2 Đấu thủ đứng/ngồi 2 bên màn hình, BLV hoạt náo ngồi ở góc dưới.',
    transforms: {
      avatar_1: { x: 2, y: 4, width: 47, height: 62, zIndex: 5, pose: 'stand', objectFit: 'cover' },
      avatar_2: { x: 51, y: 4, width: 47, height: 62, zIndex: 5, pose: 'stand', objectFit: 'cover' },
      avatar_3: { x: 22, y: 58, width: 56, height: 40, zIndex: 10, pose: 'sit', objectFit: 'cover' },
      avatar_4: { x: 74, y: 60, width: 24, height: 36, zIndex: 8, pose: 'sit', objectFit: 'cover' }
    }
  },
  grid: {
    id: 'grid',
    name: '🔲 Chia Khung Đều (Grid Split)',
    desc: 'Chia đều các ô màn hình tự động theo 2, 3 hoặc 4 nhân vật.',
    transforms: {
      avatar_1: { x: 0, y: 0, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover' },
      avatar_2: { x: 50, y: 0, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover' },
      avatar_3: { x: 0, y: 50, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover' },
      avatar_4: { x: 50, y: 50, width: 50, height: 50, zIndex: 1, pose: 'stand', objectFit: 'cover' }
    }
  },
  pip: {
    id: 'pip',
    name: '🖼️ Picture-in-Picture (Idol Toàn Khung + Phụ Nhỏ Góc)',
    desc: 'Idol chiếm trọn màn hình, các trợ lý/khách mời nằm ở góc nhỏ.',
    transforms: {
      avatar_1: { x: 0, y: 0, width: 100, height: 100, zIndex: 1, pose: 'stand', objectFit: 'cover' },
      avatar_2: { x: 64, y: 64, width: 34, height: 34, zIndex: 10, pose: 'sit', objectFit: 'cover' },
      avatar_3: { x: 64, y: 28, width: 34, height: 34, zIndex: 10, pose: 'sit', objectFit: 'cover' },
      avatar_4: { x: 2, y: 64, width: 34, height: 34, zIndex: 10, pose: 'sit', objectFit: 'cover' }
    }
  }
};

export const DEFAULT_MULTI_AVATAR_CONFIG = {
  enabled: false, // 🛡️ Mặc định TẮT để chạy 1 Avatar tiêu chuẩn; khi BẬT mới kích hoạt sân khấu 2-4 Avatar
  activeCount: 2, // 2, 3, or 4
  layoutMode: 'custom_canvas', // 'custom_canvas' | 'sales_duo' | 'talkshow' | 'pk_caster' | 'grid' | 'pip'
  backgroundUrl: '',
  backgroundColor: '#0a0c14',
  backgroundTransform: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    scale: 100,
    objectFit: 'cover',
    blur: 0,
    brightness: 100
  },
  chromaKey: {
    enabled: false,
    color: '#00ff00',
    similarity: 0.45,
    smoothness: 0.15,
    spill: 0.15,
    mode: 'green' // 'green' | 'blue' | 'black' | 'white' | 'custom'
  },
  extraImageLayers: [],
  avatars: [
    {
      id: 'avatar_1',
      role: 'idol',
      tag: 'Idol',
      label: 'Nhân Vật 1 (Idol Chính)',
      name: 'Ngọc Nhi',
      voiceId: 'vn_nu_idol_live',
      idleVideo: '',
      talkVideo: '',
      volume: 1.0,
      rate: 1.0,
      enabled: true,
      chromaKey: {
        enabled: false,
        color: '#00ff00',
        similarity: 0.45,
        smoothness: 0.15,
        spill: 0.15,
        mode: 'green'
      },
      transform: {
        x: 4,
        y: 8,
        width: 52,
        height: 88,
        zIndex: 10,
        pose: 'stand', // 'stand' (Đứng), 'sit' (Ngồi), 'half' (Nửa người)
        objectFit: 'cover',
        borderRadius: 16
      }
    },
    {
      id: 'avatar_2',
      role: 'assistant',
      tag: 'Trợ Lý',
      label: 'Nhân Vật 2 (Trợ Lý / Quản Lý)',
      name: 'Quốc Cường',
      voiceId: 'vn_nam_quanly_uyquyen',
      idleVideo: '',
      talkVideo: '',
      volume: 1.0,
      rate: 1.05,
      enabled: true,
      chromaKey: {
        enabled: false,
        color: '#00ff00',
        similarity: 0.45,
        smoothness: 0.15,
        spill: 0.15,
        mode: 'green'
      },
      transform: {
        x: 48,
        y: 28,
        width: 48,
        height: 68,
        zIndex: 5,
        pose: 'sit',
        objectFit: 'cover',
        borderRadius: 16
      }
    },
    {
      id: 'avatar_3',
      role: 'game',
      tag: 'BLV Game',
      label: 'Nhân Vật 3 (BLV Game PK / Hoạt Náo)',
      name: 'Quang Huy',
      voiceId: 'vn_nam_blv_bungno',
      idleVideo: '',
      talkVideo: '',
      volume: 1.0,
      rate: 1.1,
      enabled: false,
      chromaKey: {
        enabled: false,
        color: '#00ff00',
        similarity: 0.45,
        smoothness: 0.15,
        spill: 0.15,
        mode: 'green'
      },
      transform: {
        x: 22,
        y: 58,
        width: 56,
        height: 40,
        zIndex: 12,
        pose: 'sit',
        objectFit: 'cover',
        borderRadius: 16
      }
    },
    {
      id: 'avatar_4',
      role: 'guest',
      tag: 'Khách Mời',
      label: 'Nhân Vật 4 (Khách Mời / Chuyên Gia)',
      name: 'Victoria',
      voiceId: 'el_uk_female',
      idleVideo: '',
      talkVideo: '',
      volume: 1.0,
      rate: 1.0,
      enabled: false,
      chromaKey: {
        enabled: false,
        color: '#00ff00',
        similarity: 0.45,
        smoothness: 0.15,
        spill: 0.15,
        mode: 'green'
      },
      transform: {
        x: 68,
        y: 8,
        width: 30,
        height: 45,
        zIndex: 2,
        pose: 'sit',
        objectFit: 'cover',
        borderRadius: 16
      }
    }
  ]
};

export const isImageMedia = (url) => {
  if (!url || typeof url !== 'string') return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith('data:image/');
};

export const getChromaStyle = (chromaConfig) => {
  if (!chromaConfig || !chromaConfig.enabled) return {};
  const color = (chromaConfig.color || '#00ff00').toLowerCase();
  if (color === '#000000' || chromaConfig.mode === 'black') {
    return { mixBlendMode: 'screen' };
  }
  if (color === '#ffffff' || chromaConfig.mode === 'white') {
    return { mixBlendMode: 'multiply' };
  }
  if (color.includes('00ff00') || chromaConfig.mode === 'green' || color === '#00ff00') {
    return { filter: 'url(#avalive-chroma-green)' };
  }
  if (color.includes('0000ff') || chromaConfig.mode === 'blue' || color === '#0000ff') {
    return { filter: 'url(#avalive-chroma-blue)' };
  }
  return { filter: 'url(#avalive-chroma-green)' };
};

export function getMultiAvatarConfig() {
  if (typeof window === 'undefined') return DEFAULT_MULTI_AVATAR_CONFIG;
  try {
    const saved = localStorage.getItem('avalive_multi_avatar_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_MULTI_AVATAR_CONFIG,
        ...parsed,
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : false,
        extraImageLayers: Array.isArray(parsed.extraImageLayers) ? parsed.extraImageLayers : [],
        backgroundTransform: {
          ...DEFAULT_MULTI_AVATAR_CONFIG.backgroundTransform,
          ...(parsed.backgroundTransform || {})
        },
        avatars: DEFAULT_MULTI_AVATAR_CONFIG.avatars.map((defaultAv, idx) => {
          const matched = parsed.avatars?.find(a => a.id === defaultAv.id) || parsed.avatars?.[idx];
          if (!matched) return defaultAv;
          return {
            ...defaultAv,
            ...matched,
            chromaKey: {
              ...defaultAv.chromaKey,
              ...(matched.chromaKey || {})
            },
            transform: {
              ...defaultAv.transform,
              ...(matched.transform || {})
            }
          };
        })
      };
    }
    return DEFAULT_MULTI_AVATAR_CONFIG;
  } catch (e) {
    return DEFAULT_MULTI_AVATAR_CONFIG;
  }
}

export function saveMultiAvatarConfig(config) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('avalive_multi_avatar_config', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('avalive_multi_avatar_changed', { detail: config }));
  } catch (e) {
    console.error('Failed to save multi avatar config:', e);
  }
}

/**
 * 🎯 Phân tích kịch bản đa nhân vật & ánh xạ từng câu thoại sang Avatar + Voice tương ứng
 */
export function parseMultiCharacterScript(text, config = null) {
  if (!text || !text.trim()) return [];
  const multiConfig = config || getMultiAvatarConfig();
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 🛡️ NẾU CHẾ ĐỘ MULTI-AVATAR ĐANG TẮT (ENABLED === FALSE): TRẢ VỀ CHẾ ĐỘ 1 AVATAR ĐƠN TIÊU CHUẨN
  if (!multiConfig.enabled) {
    const idolAvatar = multiConfig.avatars?.[0] || DEFAULT_MULTI_AVATAR_CONFIG.avatars[0];
    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === idolAvatar.voiceId) || { id: idolAvatar.voiceId || 'free_vi_female', lang: 'vi-VN', gender: 'Female' };
    return rawLines.map((line, idx) => {
      let cleanText = line.replace(/^\[([^\]]+)\]\s*:\s*/i, '').replace(/^([a-zA-Z0-9_\u00C0-\u1EF9\s]{2,20})\s*:\s*/i, '').trim();
      if (!cleanText) cleanText = line;
      return {
        index: idx,
        rawLine: line,
        text: cleanText,
        avatarId: idolAvatar.id,
        avatarName: idolAvatar.name,
        role: idolAvatar.role,
        voiceId: idolAvatar.voiceId,
        voiceObj,
        volume: idolAvatar.volume ?? 1.0,
        rate: idolAvatar.rate ?? 1.0
      };
    });
  }

  return rawLines.map((line, idx) => {
    let matchedAvatar = null;
    let cleanText = line;

    // Kiểm tra các tag [Idol]:, [Trợ Lý]:, [BLV Game]:, [Khách Mời]: hoặc Idol:, Trợ Lý:, etc.
    const tagMatch = line.match(/^\[([^\]]+)\]\s*:\s*(.*)$/i) || line.match(/^([a-zA-Z0-9_\u00C0-\u1EF9\s]{2,20})\s*:\s*(.*)$/i);

    if (tagMatch) {
      const roleOrName = tagMatch[1].trim().toLowerCase();
      cleanText = tagMatch[2].trim();

      const activeAvatars = (multiConfig.avatars || []).slice(0, multiConfig.activeCount || 2);

      matchedAvatar = activeAvatars.find(a => 
        a.role.toLowerCase() === roleOrName ||
        a.tag.toLowerCase() === roleOrName ||
        a.name.toLowerCase() === roleOrName ||
        roleOrName.includes(a.name.toLowerCase()) ||
        a.name.toLowerCase().includes(roleOrName) ||
        (roleOrName.includes('1') && a.id === 'avatar_1') ||
        (roleOrName.includes('2') && a.id === 'avatar_2') ||
        (roleOrName.includes('3') && a.id === 'avatar_3') ||
        (roleOrName.includes('4') && a.id === 'avatar_4') ||
        (roleOrName.includes('idol') && a.role === 'idol') ||
        ((roleOrName.includes('trợ lý') || roleOrName.includes('quản lý') || roleOrName.includes('assistant')) && a.role === 'assistant') ||
        ((roleOrName.includes('game') || roleOrName.includes('blv') || roleOrName.includes('pk')) && a.role === 'game') ||
        ((roleOrName.includes('khách') || roleOrName.includes('guest') || roleOrName.includes('host 2')) && a.role === 'guest')
      );
    }

    if (!matchedAvatar) {
      const activeAvatars = (multiConfig.avatars || []).slice(0, multiConfig.activeCount || 2);
      const activeCount = Math.max(1, activeAvatars.length);
      matchedAvatar = activeAvatars[idx % activeCount] || multiConfig.avatars[0];
    }

    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === matchedAvatar.voiceId) || { id: matchedAvatar.voiceId || 'free_vi_female', lang: 'vi-VN', gender: 'Female' };

    return {
      index: idx,
      rawLine: line,
      text: cleanText,
      avatarId: matchedAvatar.id,
      avatarName: matchedAvatar.name,
      avatarRole: matchedAvatar.role,
      avatarTag: matchedAvatar.tag,
      voiceId: matchedAvatar.voiceId,
      voiceObj,
      idleVideo: matchedAvatar.idleVideo,
      talkVideo: matchedAvatar.talkVideo,
      volume: matchedAvatar.volume || 1.0,
      rate: matchedAvatar.rate || 1.0
    };
  });
}

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
    if (activePreviewAudio) {
      try {
        activePreviewAudio.preservesPitch = true;
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
    try {
      activeSourceNode.onended = null;
      activeSourceNode.stop();
    } catch(e) {}
    try { activeSourceNode.disconnect(); } catch(e) {}
    activeSourceNode = null;
  }
  activeMasterGainNode = null;
  if (activePreviewAudio) {
    try {
      activePreviewAudio.onended = null;
      activePreviewAudio.onerror = null;
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
  // Loại bỏ các chỉ dẫn sân khấu trong ngoặc đơn/vuông như (cười), [hành động], v.v. nhưng GIỮ LẠI các placeholder biến số
  cleaned = cleaned.replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ');
  cleaned = cleaned.replace(/\[(?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\]]*\]/gi, ' ');
  cleaned = cleaned.replace(/[#*`_~]/g, '');
  // Gom khoảng trắng ngang nhưng BẢO TOÀN ký tự xuống dòng \n để phục vụ phân tách kịch bản
  cleaned = cleaned.replace(/[^\S\r\n]+/g, ' ').trim();
  return cleaned;
}

/**
 * ✂️ BỘ CẮT TỈA KHOẢNG LẶNG ĐẦU & CUỐI AUDIO BUFFER (SILENCE TRIMMER)
 * Loại bỏ triệt để khoảng lặng chết (400ms - 1500ms) do TTS tự sinh ra sau các dấu !, ?, ...
 * Giúp âm thanh bắt đầu phát ngay tức thì và kết thúc dứt điểm đúng miligiây, chuyển câu 0ms liền mạch!
 */
export function trimAudioBufferSilence(audioBuffer, silenceThreshold = 0.003) {
  if (!audioBuffer) return audioBuffer;
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  
  if (length <= 1000) return audioBuffer;
  
  const channelData = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(audioBuffer.getChannelData(c));
  }
  
  // 1. Tìm vị trí âm thanh bắt đầu (Trim Leading Silence)
  let startIdx = 0;
  const maxLeadingScan = Math.min(length, Math.floor(sampleRate * 0.5)); // scan tối đa 0.5s đầu
  for (let i = 0; i < maxLeadingScan; i++) {
    let hasSound = false;
    for (let c = 0; c < numChannels; c++) {
      if (Math.abs(channelData[c][i]) > silenceThreshold) {
        hasSound = true;
        break;
      }
    }
    if (hasSound) {
      // Giữ lại 10ms đệm trước âm thanh để tránh bị giật hoặc cụt âm đầu
      startIdx = Math.max(0, i - Math.floor(sampleRate * 0.01));
      break;
    }
  }

  // 2. Tìm vị trí âm thanh kết thúc (Trim Trailing Silence)
  let endIdx = length - 1;
  const maxTrailingScan = Math.min(length, Math.floor(sampleRate * 2.5)); // scan tối đa 2.5s cuối
  const scanLimit = Math.max(startIdx + 100, length - maxTrailingScan);
  for (let i = length - 1; i >= scanLimit; i--) {
    let hasSound = false;
    for (let c = 0; c < numChannels; c++) {
      if (Math.abs(channelData[c][i]) > silenceThreshold) {
        hasSound = true;
        break;
      }
    }
    if (hasSound) {
      // Giữ lại 25ms đệm sau âm thanh để dứt câu tự nhiên, không bị khựng
      endIdx = Math.min(length - 1, i + Math.floor(sampleRate * 0.025));
      break;
    }
  }

  const trimmedLength = endIdx - startIdx + 1;
  if (trimmedLength <= 100) return audioBuffer;

  // Nếu không có khoảng lặng thừa đáng kể thì giữ nguyên buffer
  if (startIdx === 0 && endIdx >= length - 100) {
    return audioBuffer;
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return audioBuffer;

  try {
    const trimmedBuffer = audioCtx.createBuffer(numChannels, trimmedLength, sampleRate);
    const fadeLen = Math.min(trimmedLength, Math.floor(sampleRate * 0.015)); // 15ms fade out

    for (let c = 0; c < numChannels; c++) {
      const src = channelData[c];
      const dest = trimmedBuffer.getChannelData(c);
      dest.set(src.subarray(startIdx, endIdx + 1));

      // Áp dụng fade-out 15ms siêu êm ở cuối để không bao giờ bị tiếng lách cách (anti-pop)
      for (let f = 0; f < fadeLen; f++) {
        const factor = (fadeLen - f) / fadeLen;
        dest[trimmedLength - 1 - f] *= factor;
      }
    }
    return trimmedBuffer;
  } catch (e) {
    return audioBuffer;
  }
}

/**
 * 🌺 BỘ XỬ LÝ CHUYỂN ĐỔI NGỮ ĐIỆU VÀ CẢM XÚC TIẾNG VIỆT 100% NHƯ NGƯỜI THẬT (EMPATHY & BREATHING PROSODY)
 * - Tự động tạo nhịp thở, lấy hơi tự nhiên, ngữ điệu nhấn nhá, thăng trầm cao trào cuốn hút như một người bạn trò chuyện.
 * - Chuyển đổi chính xác 100% số tiền, số đếm, %, phân số, hotline: 10,000 -> mười nghìn, 890.000đ -> tám trăm chín mươi nghìn đồng, 50k -> năm mươi nghìn đồng...
 * - Phát âm chuẩn xác các thuật ngữ tiếng Anh & livestream: serum, skincare, deal, flash sale, review, combo, freeship, feedback, order, live, video...
 * - Dịch thuật từ viết tắt livestream / mạng xã hội: sp -> sản phẩm, đc -> được, cmt -> bình luận, btv -> biên tập viên, mc -> người dẫn chương trình...
 * - Chuẩn hóa dấu câu (!, ?, ...) không gây ngắt quãng quá lâu, đọc liền mạch dứt khoát.
 */
export function humanizeVoiceSpeechText(rawText, voice = null) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = cleanTextForVoiceSpeech(rawText);
  if (!text) return '';

  const isVietnamese = !voice || voice?.lang === 'vi-VN' || voice?.region === 'vi' || voice?.id?.startsWith('vn_') || voice?.id === 'free_vi_female' || voice?.id === 'el_adam';
  if (!isVietnamese) return text;

  const isFemale = !checkIsMale(voice);

  // 1. CHUYỂN ĐỔI TIỀN TỆ, SỐ ĐẾM, GIÁ BÁN & ĐƠN VỊ ĐO LƯỜNG CHÍNH XÁC 100%
  text = text
    // Số tiền định dạng hàng triệu có dấu chấm: 1.000.000đ / 1,000,000đ
    .replace(/\b(\d+)[,\.]000[,\.]000\s*(đ|vnd|vnđ|đồng)?\b/gi, '$1 triệu đồng')
    .replace(/\b(\d+)[,\.](\d{3})[,\.]000\s*(đ|vnd|vnđ|đồng)?\b/gi, '$1 triệu $2 nghìn đồng')
    // Số tiền định dạng hàng trăm nghìn có dấu chấm: 890.000đ / 890,000đ / 50.000đ
    .replace(/\b(\d+)[,\.](\d{3})\s*(đ|vnd|vnđ|đồng)\b/gi, '$1 nghìn $2 đồng')
    .replace(/\b(\d+)[,\.]000\s*(đ|vnd|vnđ|đồng)?\b/gi, '$1 nghìn đồng')
    // Số đếm có dấu phẩy/chấm hàng nghìn: 10,000 / 10.000
    .replace(/\b10[,\.]000\b/g, 'mười nghìn')
    .replace(/\b20[,\.]000\b/g, 'hai mươi nghìn')
    .replace(/\b50[,\.]000\b/g, 'năm mươi nghìn')
    .replace(/\b100[,\.]000\b/g, 'một trăm nghìn')
    .replace(/\b500[,\.]000\b/g, 'năm trăm nghìn')
    .replace(/\b1[,\.]000[,\.]000\b/g, 'một triệu')
    // Đơn vị k, cành, lít, củ, chai
    .replace(/\b(\d+)\s*k\b/gi, '$1 nghìn đồng')
    .replace(/\b(\d+)\s*cành\b/gi, '$1 nghìn đồng')
    .replace(/\b(\d+)[,\.](\d+)\s*(tr|triệu)\b/gi, '$1 triệu $2 trăm nghìn đồng')
    .replace(/\b(\d+)\s*(tr|triệu)\b/gi, '$1 triệu đồng')
    .replace(/\b(\d+)\s*%\b/g, '$1 phần trăm')
    .replace(/\b(\d+)\s*(đ|vnd|vnđ)\b/gi, '$1 đồng')
    .replace(/\b(\d+)\s*lít\b/gi, '$1 trăm nghìn đồng')
    .replace(/\b(\d+)\s*củ\b/gi, '$1 triệu đồng')
    .replace(/\b(\d+)\s*chai\b/gi, '$1 triệu đồng')
    .replace(/\b(\d+)\s*(sao|\*)\b/g, '$1 sao')
    .replace(/\b1\/1\b/g, 'một đổi một')
    .replace(/\b1-1\b/g, 'một đổi một')
    .replace(/\b24\/7\b/g, 'hai mươi tư trên bảy')
    .replace(/\b1st\b/gi, 'thứ nhất')
    .replace(/\b2nd\b/gi, 'thứ hai')
    .replace(/\b3rd\b/gi, 'thứ ba');

  // 2. PHÁT ÂM TIẾNG ANH & THUẬT NGỮ LIVESTREAM / THƯƠNG MẠI CHUẨN XÁC
  text = text
    .replace(/\bserum\b/gi, 'sê-rum')
    .replace(/\bskincare\b/gi, 'xkin-ke')
    .replace(/\bbody\b/gi, 'bo-đi')
    .replace(/\bfeedback\b/gi, 'phít-bách')
    .replace(/\bflash\s*sale\b/gi, 'flát seo ưu đãi chớp nhoáng')
    .replace(/\bsale\b/gi, 'seo giảm giá')
    .replace(/\bdeal\b/gi, 'điu ưu đãi')
    .replace(/\bhot\s*trend\b/gi, 'hót tren xu hướng')
    .replace(/\btrend\b/gi, 'tren xu hướng')
    .replace(/\breview\b/gi, 'ri-viu')
    .replace(/\bfreeship\b/gi, 'phi-síp miễn phí vận chuyển')
    .replace(/\bfree\s*ship\b/gi, 'phi-síp miễn phí vận chuyển')
    .replace(/\bvoucher\b/gi, 'vâu-chờ mã giảm giá')
    .replace(/\border\b/gi, 'ót-đờ đặt hàng')
    .replace(/\bcombo\b/gi, 'com-bo')
    .replace(/\blivestream\b/gi, 'lai-chim phát trực tiếp')
    .replace(/\blive\s*stream\b/gi, 'lai-chim phát trực tiếp')
    .replace(/\blive\b/gi, 'lai')
    .replace(/\bvideo\b/gi, 'vi-đê-ô')
    .replace(/\baudio\b/gi, 'ô-đi-ô')
    .replace(/\bviewer\b/gi, 'người xem')
    .replace(/\bview\b/gi, 'lượt xem')
    .replace(/\bstream\b/gi, 'chim')
    .replace(/\bapp\b/gi, 'áp ứng dụng')
    .replace(/\bgame\b/gi, 'gêm')
    .replace(/\bpk\b/gi, 'p-k thi đấu')
    .replace(/\bidol\b/gi, 'ai-đồ thần tượng')
    .replace(/\bkoc\b/gi, 'k-o-c')
    .replace(/\bkol\b/gi, 'k-o-l')
    .replace(/\blink\b/gi, 'đường linh')
    .replace(/\bpro\b/gi, 'pờ-rô chuyên nghiệp')
    .replace(/\bvip\b/gi, 'víp cao cấp')
    .replace(/\bshop\b/gi, 'shop')
    .replace(/\bgift\b/gi, 'quà tặng')
    .replace(/\bfollow\b/gi, 'theo dõi')
    .replace(/\bfl\b/gi, 'theo dõi')
    .replace(/\btiktok\b/gi, 'Tóp Tóp')
    .replace(/\btik\s*tok\b/gi, 'Tóp Tóp')
    .replace(/\bzalo\b/gi, 'Da-lô')
    .replace(/\bfb\b/gi, 'Phây Búc')
    .replace(/\bfacebook\b/gi, 'Phây Búc');

  // 3. CHUYỂN ĐỔI TỪ VIẾT TẮT TIẾNG VIỆT CHÍNH XÁC 100%
  text = text
    .replace(/\bsp\b/gi, 'sản phẩm')
    .replace(/\bđc\b/gi, 'được')
    .replace(/\bdc\b/gi, 'được')
    .replace(/\bko\b/gi, 'không')
    .replace(/\bk\b/gi, 'không')
    .replace(/\bkhg\b/gi, 'không')
    .replace(/\bkh\b/gi, 'không')
    .replace(/\bmn\b/gi, 'mọi người')
    .replace(/\bmng\b/gi, 'mọi người')
    .replace(/\bsz\b/gi, 'size')
    .replace(/\bstk\b/gi, 'số tài khoản')
    .replace(/\bcod\b/gi, 'nhận hàng thanh toán')
    .replace(/\bbtv\b/gi, 'biên tập viên')
    .replace(/\bmc\b/gi, 'người dẫn chương trình')
    .replace(/\bvtv\b/gi, 'đài truyền hình')
    .replace(/\bcta\b/gi, 'kêu gọi hành động')
    .replace(/\bkm\b/gi, 'khuyến mãi')
    .replace(/\bkg\b/gi, 'ki-lô-gam')
    .replace(/\bml\b/gi, 'mi-li-lít')
    .replace(/\bhsd\b/gi, 'hạn sử dụng')
    .replace(/\bnsx\b/gi, 'ngày sản xuất')
    .replace(/\bnv\b/gi, 'nhân viên')
    .replace(/\blh\b/gi, 'liên hệ')
    .replace(/\btp\b/gi, 'thành phố')
    .replace(/\bhcm\b/gi, 'Hồ Chí Minh')
    .replace(/\bhn\b/gi, 'Hà Nội')
    .replace(/\bib\b/gi, 'nhắn tin')
    .replace(/\binbox\b/gi, 'nhắn tin trực tiếp')
    .replace(/\bcmt\b/gi, 'bình luận')
    .replace(/\bcomment\b/gi, 'bình luận')
    .replace(/\bauth\b/gi, 'chính hãng')
    .replace(/\breal\b/gi, 'hàng thật chính hãng')
    .replace(/\bsetup\b/gi, 'cài đặt')
    .replace(/\bok\b/gi, 'dạ vâng được ạ');

  // 4. TINH CHỈNH CẢM XÚC, THĂNG TRẦM & NGẮT NHỊP TỰ NHIÊN
  if (isFemale) {
    text = text
      .replace(/\b(Hello cả nhà|Chào cả nhà|Cả nhà ơi|Mọi người ơi|Quý vị ơi|Các bạn ơi|Bà con ơi|Chị em ơi|Các mẹ ơi|Ai đang lướt qua)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(Dạ|Vâng|Em xin chào|Em cam kết|Đặc biệt là|Hơn thế nữa|Thật sự luôn|Tin em đi|Nhanh tay lên nào|Đúng rồi ạ|Chính xác luôn|Tuyệt vời luôn|Quá đã luôn|Trời ơi)(?!\s*[,!?:])/gi, '$1, ');
  } else {
    text = text
      .replace(/\b(Hello cả nhà|Xin chào tất cả các bạn|Chào anh em|Anh em ơi|Mọi người ơi|Cả nhà ơi|Bà con ơi)(?!\s*[,!?:])/gi, '$1, ')
      .replace(/\b(Đặc biệt là|Cực kỳ hấp dẫn|Chú ý chú ý|Duy nhất hôm nay|Cam kết 100%|Chính hãng 100%|Anh em nhớ lưu ý|Tin mình đi)(?!\s*[,!?:])/gi, '$1, ');
  }

  // 5. DỌN DẸP DẤU CÂU TRÙNG LẶP ĐỂ KHÔNG GÂY KHỰNG / TREO KHOẢNG LẶNG
  text = text
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    .replace(/\.{2,}/g, '.')
    .replace(/,\s*,+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * ✨ TỰ ĐỘNG TỐI ƯU & NÂNG CẤP KỊCH BẢN LIVESTREAM ĐỈNH CAO (AI SCRIPT POLISHER & OPTIMIZER)
 * - Tự động sắp xếp cấu trúc kịch bản bán hàng chuẩn triệu view:
 *   1. Hook Giữ Chân Khán Giả Đầu Live (Gây tò mò, kêu gọi thả tim/chia sẻ)
 *   2. Thấu Hiểu Nỗi Đau & Nhu Cầu Khách Hàng (Đồng cảm, tâm sự như người bạn)
 *   3. Giới Thiệu Sản Phẩm & Điểm Độc Bản Đỉnh Cao (Giải quyết vấn đề triệt để)
 *   4. Ưu Đãi Độc Quyền & Cam Kết Uy Tín (Bảo hành 1 đổi 1, quà tặng mini, freeship)
 *   5. Kêu Gọi Hành Động Chốt Đơn Dứt Khoát (Thúc giục cấp bách, bấm giỏ hàng ngay)
 */
export function polishAndOptimizeScript(rawScript) {
  if (!rawScript || typeof rawScript !== 'string' || !rawScript.trim()) {
    return `Chào mừng tất cả các tình yêu đã có mặt trong phiên livestream đặc biệt ngày hôm nay của shop em nha!
Các anh chị đẹp ơi, ai đang lướt qua phiên live thì cho em xin một nút thả tim và một lượt chia sẻ để nhận quà mở bát đầu live nào!
Hôm nay shop em mang đến cho cả nhà một siêu phẩm cực kỳ đỉnh cao và độc quyền duy nhất trên sóng livestream!
Chị nào mà đang gặp vấn đề khô ráp, thâm sạm hoặc chưa tìm được giải pháp ưng ý thì nhất định không được bỏ qua nhé!
Chỉ sau một liệu trình ngắn sử dụng, mọi người sẽ cảm nhận sự thay đổi rõ rệt, mịn màng và tự tin hơn rất nhiều luôn ạ!
Duy nhất trong phiên live hôm nay, giảm sốc 50% tặng kèm phần quà hấp dẫn và miễn phí vận chuyển tận nhà!
Bên em cam kết 100% hàng chính hãng, bảo hành một đổi một trong 30 ngày, bấm vào Giỏ Hàng góc trái săn ngay kẻo hết quà nha!`;
  }

  const lines = rawScript.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return rawScript;

  // Chuẩn hóa từng câu thoại với ngôn từ biểu cảm, nhịp điệu cuốn hút
  const polishedLines = lines.map((line, idx) => {
    let clean = cleanTextForVoiceSpeech(line);
    clean = humanizeVoiceSpeechText(clean);

    // Bổ sung cảm xúc tự nhiên nếu câu còn ngắn hoặc khô khan
    if (idx === 0 && !clean.match(/(chào|hello|chúc|mừng|xin chào)/i)) {
      clean = `Chào mừng tất cả mọi người đã có mặt trong phiên live hôm nay nha! ${clean}`;
    }
    if (idx === lines.length - 1 && !clean.match(/(giỏ hàng|chốt|săn|đặt ngay|mua ngay|kẻo lỡ)/i)) {
      clean = `${clean} Mọi người nhanh tay bấm vào giỏ hàng góc trái chốt đơn ngay kẻo lỡ ưu đãi nhé!`;
    }

    return clean;
  });

  return polishedLines.join('\n');
}

/**
 * 🌾 CHUẨN HÓA NGỮ ĐIỆU & PHƯƠNG NGỮ 4 VÙNG MIỀN VIỆT NAM THÔNG MINH
 * Tự động chuyển đổi ngữ khí, trợ từ cảm thán và nhịp điệu phát âm bản xứ:
 * - Miền Tây: Mộc mạc, ngọt ngào, ấm áp, nhịp điệu từ tốn sông nước (nghen bà con, nhen cô chú, hết sảy bà con ơi, mê ly dữ dằn à nghen...)
 * - Miền Trung: Đậm đà, sâu lắng, chuẩn vị Huế/Đà Nẵng/Quảng Nam/Nghệ Tĩnh (nì cả nhà ơi, quý anh chị nì, ngon xuất sắc nì, sắc sảo lắm nì...)
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

    if (vName.includes('miền tây') || vCat.includes('miền tây') || vDesc.includes('miền tây') || vName.includes('sông nước') || vId.includes('_tay_') || vId.includes('_taynambo') || vName.includes('cần thơ') || vName.includes('út mai')) {
      dialect = 'tay';
    } else if (vName.includes('miền trung') || vCat.includes('miền trung') || vDesc.includes('miền trung') || vName.includes('huế') || vName.includes('đà nẵng') || vName.includes('nghệ an') || vName.includes('nghệ tĩnh') || vId.includes('_trung_') || vId.includes('hue') || vId.includes('danang') || vId.includes('nghean')) {
      dialect = 'trung';
    } else if (vName.includes('miền bắc') || vCat.includes('miền bắc') || vDesc.includes('miền bắc') || vName.includes('hà nội') || vId.includes('_bac_') || vName.includes('vtv') || vName.includes('thời sự')) {
      dialect = 'bac';
    } else if (vName.includes('miền nam') || vCat.includes('miền nam') || vDesc.includes('miền nam') || vName.includes('sài gòn') || vId.includes('_nam_') || vId.includes('koc') || vId.includes('idol_live') || vId.includes('giucdon')) {
      dialect = 'nam';
    } else {
      dialect = 'standard';
    }
  }

  // 1. PHƯƠNG NGỮ MIỀN TÂY (Sông Nước Nam Bộ - Ngọt ngào, mộc mạc, tha thiết)
  if (dialect === 'tay') {
    text = text
      .replace(/\b(nhé|nhé bạn|nhé mọi người|nha các bạn|nhé các bạn|nhe các bạn)\b/gi, 'nghen bà con cô bác')
      .replace(/\b(nha bạn|nha bạn ơi|nhé bạn ơi)\b/gi, 'nhen cô chú anh chị')
      .replace(/\b(rất ngon|quá ngon)\b/gi, 'ngon hết sảy con bà bảy luôn')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'đẹp mê ly dữ dằn')
      .replace(/\b(rất tốt|tuyệt vời)\b/gi, 'tốt dữ dằn à nghen')
      .replace(/\b(thật sự|thật đấy|thật mà)\b/gi, 'thiệt tình á bà con')
      .replace(/\b(chắc chắn)\b/gi, 'chắc ăn một trăm phần trăm luôn')
      .replace(/\b(nhiều lắm|rất nhiều)\b/gi, 'quá trời quá đất luôn nghen')
      .replace(/\b(không ạ|không bạn)\b/gi, 'hông nè nghen')
      .replace(/\b(được không)\b/gi, 'được hông nè bà con')
      .replace(/\b(mua ngay|đặt ngay)\b/gi, 'chốt liền tay kẻo lỡ nghen');
  } 
  // 2. PHƯƠNG NGỮ MIỀN TRUNG (Huế, Đà Nẵng, Quảng Nam, Nghệ An - Dịu dàng, sâu lắng, đậm tình)
  else if (dialect === 'trung') {
    text = text
      .replace(/\b(nhé|nhé bạn|nhé mọi người|nhé cả nhà)\b/gi, 'nì cả nhà ơi')
      .replace(/\b(nha bạn|nha các bạn|nha mọi người)\b/gi, 'nè quý anh chị nì')
      .replace(/\b(rất ngon|quá ngon)\b/gi, 'ngon xuất sắc nì')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'đẹp sắc sảo mười phân vẹn mười nì')
      .replace(/\b(thật sự|thật đấy|thật mà)\b/gi, 'thiệt luôn nì')
      .replace(/\b(tuyệt vời)\b/gi, 'tuyệt cú mèo lắm nì')
      .replace(/\b(chắc chắn)\b/gi, 'chuẩn chỉ một trăm phần trăm nì')
      .replace(/\b(mua ngay|đặt ngay)\b/gi, 'ủng hộ em liền tay nì')
      .replace(/\b(xin chào)\b/gi, 'dạ em kính chào');
  } 
  // 3. PHƯƠNG NGỮ MIỀN NAM (Sài Gòn Phồn Hoa - Năng Động & Chốt Deal Cuốn Hút)
  else if (dialect === 'nam') {
    text = text
      .replace(/\b(nhé|nhé bạn)\b/gi, 'nha mọi người ơi')
      .replace(/\b(nhé cả nhà)\b/gi, 'nha cả nhà mình ơi')
      .replace(/\b(rất đẹp|quá đẹp)\b/gi, 'siêu đẹp xịn sò')
      .replace(/\b(rất tốt|tuyệt vời)\b/gi, 'cực kì đỉnh chóp luôn')
      .replace(/\b(mua ngay|đặt ngay)\b/gi, 'chốt liền tay kẻo lỡ nha cả nhà')
      .replace(/\b(không ạ)\b/gi, 'hổng có đâu nè')
      .replace(/\b(cảm ơn bạn)\b/gi, 'cảm ơn bạn iu nhiều nha');
  } 
  // 4. PHƯƠNG NGỮ MIỀN BẮC (Hà Nội - Thanh Lịch, Đĩnh Đạc & Sang Trọng Chuẩn Mực)
  else if (dialect === 'bac') {
    text = text
      .replace(/\b(nha bạn|nha cả nhà|nha mọi người)\b/gi, 'nhé các bác và anh chị')
      .replace(/\b(hông|hổng)\b/gi, 'không')
      .replace(/\b(xịn xò|xịn sò)\b/gi, 'cao cấp chuẩn chỉ')
      .replace(/\b(chắc ăn)\b/gi, 'chắc chắn một trăm phần trăm')
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
 * Đảm bảo giọng Nữ tự nhiên, ấm áp, trong trẻo, mượt mà (không bị nâng cao quá mức gây khựng/the thé).
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
    return Math.max(0.80, Math.min(1.30, Math.pow(2, st / 12)));
  }
  if (voice?.pitch !== undefined && !isNaN(Number(voice.pitch)) && Number(voice.pitch) !== 1.0) {
    return Math.max(0.80, Math.min(1.30, Number(voice.pitch)));
  }
  
  const id = (voice?.id || '').toLowerCase();
  const cat = (voice?.category || '').toLowerCase();
  const name = (voice?.name || '').toLowerCase();
  const age = voice?.ageGroup;

  // 1. Nhóm Lão Niên / Cụ Ông / Bà Cụ (Trầm khàn, đục ấm cổ điển)
  if (age === 'senior' || age === 'elder' || id.includes('traco') || id.includes('dongy') || id.includes('ongbay') || id.includes('bacu') || id.includes('laonien') || name.includes('cụ') || name.includes('bà bẩy') || name.includes('ông bẩy')) {
    return isMale ? 0.85 : 0.90;
  }

  // 2. Nhóm Trẻ Em / Anime / Cute (Trong veo, líu lo)
  if (id.includes('embe') || id.includes('cute') || cat.includes('trẻ em') || name.includes('bé ') || id.includes('bap') || id.includes('bana')) {
    return 1.18;
  }

  // 3. Nhóm Nữ Trẻ / KOC / Hot Trend / Gia Dụng / Skincare / Mỹ Phẩm (Tươi sáng, tự nhiên, ngọt ngào)
  if (id.includes('giadung') || id.includes('mypham') || id.includes('koc') || id.includes('genz') || id.includes('idol') || id.includes('tiktok') || id.includes('shorts') || id.includes('jessica') || id.includes('thao') || id.includes('nhi')) {
    return isMale ? 1.01 : 1.01;
  }

  // 4. Nhóm Nam Trầm / Uy Quyền / Bất Động Sản / Cinematic / Trailer (Trầm hùng, đanh thép)
  if (id.includes('uyquyen') || id.includes('chotsale') || id.includes('batdongsan') || id.includes('docu') || id.includes('cinema') || id.includes('trailer') || id.includes('adam') || id.includes('trieuduong')) {
    return isMale ? 0.90 : 0.98;
  }

  // 5. Nhóm Tâm Sự / Kể Chuyện / Podcast / Luxury / Trầm Hương (Sâu lắng, truyền cảm)
  if (id.includes('tam_su') || id.includes('kechuyen') || id.includes('podcast') || id.includes('luxury') || id.includes('tramhuong') || id.includes('giang') || id.includes('matilda') || id.includes('sarah')) {
    return isMale ? 0.94 : 0.99;
  }

  // 6. Nhóm Thể Thao / BLV / Gym / Ô Tô (Bùng nổ, rực lửa)
  if (id.includes('thethao') || id.includes('fitness') || id.includes('blv') || id.includes('oto') || id.includes('hung') || id.includes('kevin')) {
    return isMale ? 1.03 : 1.02;
  }

  return isMale ? 0.96 : 1.01;
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

  try {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume().catch(() => {});
    }
  } catch (e) {}

  stopVoiceAudio();

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  activeSourceNode = source;

  const isMale = checkIsMale(voice);
  const dsp = voice?.dspProfile || {};

  // 1. PLAYBACK RATE: Giữ nguyên 1.0 để bảo toàn tuyệt đối 100% âm sắc gốc của nhân vật
  // Tốc độ đọc (rate) và cao độ (pitch) tự nhiên đã được xử lý hoàn hảo bởi Microsoft Neural TTS Engine
  source.playbackRate.value = 1.0;

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

// Bộ nhớ đệm các Promise fetch đang chạy ngầm để chống trùng lặp (Deduplication)
const activeFetchPromises = new Map();

/**
 * ⚡ TẢI VÀ GIẢI MÃ ÂM THANH MICROSOFT NEURAL TTS (CÓ BỘ NHỚ ĐỆM TỰ ĐỘNG & HỖ TRỢ POST/GET)
 */
export async function fetchAndDecodeTTSAudio(text, voice = null) {
  if (!text || !text.trim()) return null;

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

  if (activeFetchPromises.has(cacheKey)) {
    return activeFetchPromises.get(cacheKey);
  }

  const audioCtx = getOrCreateAudioContext();
  if (!audioCtx) return null;

  try {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume().catch(() => {});
    }
  } catch (e) {}

  const currentOrigin = typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null') && !window.location.origin.startsWith('file:')
    ? window.location.origin
    : '';

  // Chuẩn hóa văn bản gửi đến TTS engine: Loại bỏ việc Azure TTS tự động chèn khoảng lặng 1-2s sau các dấu !, ?, :, ;, ...
  let ttsText = text.trim();
  ttsText = ttsText
    .replace(/[!?]+/g, ' ')
    .replace(/[;:]+/g, ', ')
    .replace(/\.{2,}/g, '. ')
    .replace(/,\s*,+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
  ttsText = ttsText.replace(/[,.]\s*$/, '').trim() || text.trim();

  const postPayload = JSON.stringify({
    text: ttsText,
    voice: neuralVoice,
    voiceId: voice?.id || '',
    gender,
    pitch: effectivePitch,
    rate: effectiveRate,
    lang: shortLang
  });

  const ttsQuery = `text=${encodeURIComponent(ttsText)}&voice=${encodeURIComponent(neuralVoice)}&voiceId=${encodeURIComponent(voice?.id || '')}&gender=${encodeURIComponent(gender)}&pitch=${encodeURIComponent(effectivePitch)}&rate=${encodeURIComponent(effectiveRate)}&lang=${encodeURIComponent(shortLang)}`;

  const endpointCandidates = Array.from(new Set([
    ...(currentOrigin ? [`${currentOrigin}/api/tts`] : []),
    `/api/tts`,
    `http://127.0.0.1:3001/api/tts`,
    `http://localhost:3001/api/tts`
  ]));

  const doFetch = async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      for (const endpoint of endpointCandidates) {
        try {
          let res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: postPayload
          }).catch(() => null);

          if (!res || !res.ok) {
            const getUrl = endpoint.includes('?') ? `${endpoint}&${ttsQuery}` : `${endpoint}?${ttsQuery}`;
            res = await fetch(getUrl).catch(() => null);
          }

          if (res && res.ok) {
            const contentType = res.headers.get('content-type') || '';
            let arrayBuf = null;

            if (contentType.includes('application/json')) {
              const data = await res.json();
              if (data?.audioBase64) {
                const binaryString = atob(data.audioBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                arrayBuf = bytes.buffer;
              }
            } else {
              arrayBuf = await res.arrayBuffer();
            }

            if (arrayBuf && arrayBuf.byteLength > 100) {
              const rawAudioBuffer = await audioCtx.decodeAudioData(arrayBuf);
              if (rawAudioBuffer) {
                const audioBuffer = trimAudioBufferSilence(rawAudioBuffer);
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
      if (attempt === 0) {
        await new Promise(r => setTimeout(r, 150));
      }
    }
    return null;
  };

  const fetchPromise = doFetch();
  activeFetchPromises.set(cacheKey, fetchPromise);
  try {
    const result = await fetchPromise;
    return result;
  } finally {
    activeFetchPromises.delete(cacheKey);
  }
}

/**
 * 🚀 LOOKAHEAD PRE-FETCHING & RAM CACHING: Tải trước và giải mã âm thanh ngầm vào RAM Cache
 * Giúp phát câu tiếp theo NGAY LẬP TỨC 0ms, loại bỏ hoàn toàn khoảng dừng 1-2 giây giữa các câu!
 */
export async function prefetchTTSAudio(text, voice = null, options = {}) {
  if (!text || !text.trim()) return null;
  try {
    const isVietnameseVoice = voice?.lang === 'vi-VN' || voice?.region === 'vi' || voice?.id?.startsWith('vn_') || voice?.id === 'free_vi_female' || voice?.id === 'el_adam';
    const textToSpeak = isVietnameseVoice 
      ? (formatTextForRegionalSpeech(text, voice) || humanizeVoiceSpeechText(text, voice) || cleanTextForVoiceSpeech(text) || text)
      : (humanizeVoiceSpeechText(text, voice) || cleanTextForVoiceSpeech(text) || text);

    const mergedVoice = {
      ...(voice || {}),
      rate: options.rate !== undefined ? options.rate : voice?.rate,
      volume: options.volume !== undefined ? options.volume : voice?.volume
    };

    return await fetchAndDecodeTTSAudio(textToSpeak, mergedVoice);
  } catch (e) {
    return null;
  }
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

  // Tự động chuẩn hóa phương ngữ, thán từ và nhịp điệu vùng miền cho mọi câu thoại
  const textToSpeak = isVietnameseVoice
    ? (formatTextForRegionalSpeech(candidateText, voice) || humanizeVoiceSpeechText(candidateText, voice) || cleanTextForVoiceSpeech(candidateText) || candidateText)
    : (humanizeVoiceSpeechText(candidateText, voice) || cleanTextForVoiceSpeech(candidateText) || candidateText);

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
  // TIER 2: MICROSOFT AZURE NEURAL TTS (CHUẨN 100% ĐÚNG GIỌNG NGƯỜI DÙNG CHỌN)
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

  // Kết thúc an toàn mà TUYỆT ĐỐI KHÔNG BAO GIỜ phát giọng mặc định của máy tính
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
  fetchAndDecodeTTSAudio,
  prefetchTTSAudio,
  cleanTextForVoiceSpeech,
  humanizeVoiceSpeechText,
  polishAndOptimizeScript,
  formatTextForRegionalSpeech,
  trimAudioBufferSilence,
  updateActiveVoiceAudio,
  isSpeechActive,
  clearGlobalSpeechQueue,
  getFavoriteVoiceIds,
  toggleFavoriteVoiceId,
  isVoiceFavorite,
  DEFAULT_MULTI_AVATAR_CONFIG,
  STUDIO_BACKGROUND_PRESETS,
  STUDIO_STAGE_PRESETS,
  getMultiAvatarConfig,
  saveMultiAvatarConfig,
  parseMultiCharacterScript
};

