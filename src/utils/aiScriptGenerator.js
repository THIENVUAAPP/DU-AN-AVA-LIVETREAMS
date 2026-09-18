// =========================================================================================
// 🚀 AVALIVE AI SCRIPT GENERATOR - BỘ NÃO AI SÁNG TẠO KỊCH BẢN THEO TRI THỨC DOANH NGHIỆP & SỐ PHÚT
// Tự động phân tích toàn diện: Doanh Nghiệp, Sản Phẩm, Giá, Quà Tặng, Tính Năng, Bảo Hành, Tri Thức Tự Do, 
// Phong Cách Dẫn Live & Nền Tảng (TikTok Live / Shopee Live) theo đúng Thời Lượng (Số Phút).
// =========================================================================================

export const LIVE_STYLES = [
  { id: 'sales_fast', label: '🔥 1. Hào Hứng - Năng Động - Chốt Sale Thần Tốc' },
  { id: 'skincare_expert', label: '🌸 2. Thân Thiện - Dịu Dàng - Chuyên Gia Da Liễu' },
  { id: 'tiktok_funny', label: '😂 3. Hài Hước - Duyên Dáng - Bắt Trend TikTok' },
  { id: 'luxury_elegant', label: '💎 4. Sang Trọng - Quyến Rũ - Đẳng Cấp Thượng Lưu' },
  { id: 'tech_expert', label: '🎓 5. Giáo Dục - Chia Sẻ Giá Trị - Chuyên Gia Công Nghệ' },
  { id: 'countdown_urgent', label: '⏳ 6. Giục Giã - Đếm Ngược Khẩn Cấp - Flash Sale' },
  { id: 'emotional_story', label: '💖 7. Tâm Sự - Chân Thành - Chia Sẻ Cảm Xúc' },
  { id: 'motivational_fire', label: '📢 8. Hùng Biện - Năng Lượng Đỉnh Cao - Truyền Lửa' },
  { id: 'gen_z_vibes', label: '🛹 9. Gen Z Năng Động - Trẻ Trung - Phá Cách' },
  { id: 'vip_master', label: '👑 10. VIP Master Streamer - Đỉnh Cao Thuyết Phục' }
];

export const DURATION_OPTIONS = [
  { value: 1, label: '⚡ 1 Phút (Siêu Ngắn / Hook Chớp Nhoáng)' },
  { value: 2, label: '⏱️ 2 Phút (Giới Thiệu Deal Nhanh)' },
  { value: 3, label: '🎯 3 Phút (Kịch Bản Chốt Nhanh)' },
  { value: 5, label: '🔥 5 Phút (Giới Thiệu Siêu Phẩm Toàn Diện)' },
  { value: 10, label: '🚀 10 Phút (Phiên Live Chớp Nhoáng)' },
  { value: 15, label: '💫 15 Phút (Phiên Live Chuẩn Chỉnh)' },
  { value: 30, label: '🌟 30 Phút (Showroom Trực Tuyến Chuyên Nghiệp)' },
  { value: 45, label: '✨ 45 Phút (Bùng Nổ Doanh Số)' },
  { value: 60, label: '👑 60 Phút (1 Tiếng - Phiên Live Đỉnh Cao)' },
  { value: 90, label: '💎 90 Phút (1.5 Tiếng - Mega Live)' },
  { value: 120, label: '🏆 120 Phút (2 Tiếng - Siêu Đại Hội Sale)' },
  { value: 180, label: '🌌 180 Phút (3 Tiếng - LiveStream Xuyên Màn Đêm)' }
];

/**
 * Tạo kịch bản hoàn chỉnh từ Bộ Não AI và Tri Thức Doanh Nghiệp theo đúng số phút đã chọn.
 */
export function generateAiKnowledgeScript(params = {}) {
  const {
    companyName = 'Cửa Hàng Trực Tuyến Chính Hãng',
    productName = 'Siêu Phẩm Cao Cấp',
    productPrice = 'Giá Niêm Yết Tiền Triệu - Giá Live Siêu Ưu Đãi',
    promotions = 'Tặng Kèm Quà Tri Ân Thượng Hạng + Miễn Phí Vận Chuyển Toàn Quốc',
    keyFeatures = 'Thành phần an toàn tự nhiên, hiệu quả rõ rệt sau thời gian ngắn, chuẩn chất lượng quốc tế',
    warrantyPolicy = 'Cam kết chính hãng 100%, bảo hành 1 đổi 1 trong 30 ngày, hoàn tiền nếu không đúng mô tả',
    companyKnowledgeText = '',
    aiLiveStyle = 'sales_fast',
    scriptDurationMinutes = 60,
    livePlatform = 'tiktok' // 'tiktok' | 'shopee'
  } = params;

  const durationMin = Number(scriptDurationMinutes) || 60;
  const platformName = livePlatform === 'shopee' ? 'Shopee Live' : 'TikTok Live';
  const cartLocation = livePlatform === 'shopee' ? 'nút Mua Ngay ở góc dưới bên trái' : 'nút Giỏ Hàng màu vàng góc trái màn hình';
  const platformAction = livePlatform === 'shopee' 
    ? 'Áp ngay mã Miễn Phí Vận Chuyển Shopee và Voucher Giảm Giá của Shop' 
    : 'Thả tim liên tục vào màn hình và chạm ngay vào Giỏ Hàng';

  const cleanFeatures = keyFeatures.split(/\r?\n/).map(f => f.replace(/^(\d+[\.\/\:\-\)]\s*|[\-\*\•\#\>\~]\s*)/, '').trim()).filter(Boolean);
  const primaryFeature = cleanFeatures[0] || 'chất lượng dẫn đầu và hiệu quả vượt trội';
  const secondaryFeature = cleanFeatures[1] || 'thiết kế tinh tế, an toàn và lành tính 100%';
  const thirdFeature = cleanFeatures[2] || 'tiết kiệm chi phí và nâng tầm trải nghiệm';

  // Trích xuất thông tin từ kho tri thức tự do nếu có
  const cleanKnowledge = companyKnowledgeText
    ? companyKnowledgeText.split(/\r?\n/).map(k => k.trim()).filter(k => k.length > 5)
    : [];

  // Các khối kịch bản theo phong cách
  const getStyleBlocks = (round = 1) => {
    switch (aiLiveStyle) {
      case 'skincare_expert':
        return [
          `Dạ em xin kính chào tất cả quý khách hàng và các chị em yêu quý đang theo dõi phiên tư vấn chăm sóc da chuyên sâu hôm nay của ${companyName} trên ${platformName} ạ!`,
          `Các chị có biết tại sao dù mình dưỡng nhiều mỹ phẩm đắt tiền nhưng da vẫn bị khô sạm và không đều màu không ạ? Đó là vì cấu trúc biểu bì thiếu dưỡng chất chuyên sâu và chưa được tái sinh từ gốc rễ!`,
          `Và giải pháp hoàn hảo chuẩn y khoa da liễu hôm nay em mang đến chính là siêu phẩm ${productName}!`,
          `Ưu điểm vượt trội nhất của ${productName} chính là: ${primaryFeature}!`,
          `Không chỉ vậy, sản phẩm còn được tích hợp công dụng tuyệt vời: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Đặc biệt hơn cả: ${thirdFeature}!` : `Sản phẩm đã được kiểm định an toàn và phù hợp cho mọi loại da dù là da nhạy cảm nhất!`,
          `Duy nhất trong phiên phát sóng trực tiếp hôm nay, ${companyName} trợ giá đặc quyền: ${productPrice}!`,
          `Chưa hết đâu ạ, các chị chốt đơn ngay bây giờ còn được nhận trọn bộ quà tặng tri ân: ${promotions}!`,
          `Về uy tín và chính sách bảo hành, các chị hoàn toàn yên tâm với cam kết vàng: ${warrantyPolicy}!`,
          `Các chị hãy nhanh tay chạm nhẹ vào ${cartLocation}, ${platformAction} để làn da được chăm sóc và tái sinh ngay hôm nay nhé!`
        ];

      case 'tiktok_funny':
        return [
          `Ú òa! Em chào 500 anh chị em đang lướt ${platformName} lọt ngay vào phiên live siêu cấp vũ trụ của ${companyName} nha!`,
          `Ai mà đi ngang lướt qua không dừng lại thả tim là tí nữa tiếc hùi hụi đứt ruột luôn á, vì hôm nay có cơn bão deal sốc chấn động địa cầu!`,
          `Em lên sàn ngay siêu phẩm ${productName} đang làm mưa làm gió khắp cõi mạng đây ạ!`,
          `Công dụng xịn mịn hết nước chấm của em nó là: ${primaryFeature}!`,
          `Thêm một điểm cộng cực đỉnh mà ai dùng xong cũng mê: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Và điều bất ngờ nhất chính là: ${thirdFeature}!` : `Dùng thử một lần là đảm bảo nghiện luôn, cả nhà không thể tìm thấy ở đâu sản phẩm xịn sò như vậy!`,
          `Bình thường giá tiền triệu ngoài showroom, duy nhất trên live hôm nay giảm chạm đáy chỉ còn: ${productPrice}!`,
          `Lại còn được tặng kèm thêm phần quà cực đã: ${promotions}!`,
          `Bên em cam kết uy tín 100 điểm không có nhưng: ${warrantyPolicy}!`,
          `Tay đâu tay đâu cả nhà ơi! Nhấp liền tay vào ${cartLocation} để săn deal kẻo hết hàng là em không chịu trách nhiệm đâu nha!`
        ];

      case 'luxury_elegant':
        return [
          `Kính chào quý khách hàng thượng lưu đang hiện diện trong không gian phát sóng trực tiếp độc quyền của thương hiệu ${companyName} trên ${platformName}.`,
          `Khí chất và đẳng cấp của người thành đạt luôn được khẳng định qua những lựa chọn tinh tế, chuẩn mực và vượt trội.`,
          `Hôm nay, chúng tôi vinh dự giới thiệu kiệt tác đỉnh cao ${productName} - biểu tượng của sự hoàn mỹ và chất lượng thượng hạng.`,
          `Giá trị độc bản đầu tiên: ${primaryFeature}.`,
          `Cùng với công năng tinh tế vượt bậc: ${secondaryFeature}.`,
          cleanFeatures.length > 2 ? `Và sự hoàn hảo tuyệt đối từ: ${thirdFeature}.` : `Từng chi tiết đều được trau chuốt tỉ mỉ nhằm đem lại trải nghiệm hoàn mỹ nhất cho quý khách.`,
          `Đặc quyền tri ân dành riêng cho quý khách trong khung giờ vàng hôm nay: ${productPrice}.`,
          `Đi kèm bộ quà tặng cao cấp phiên bản giới hạn: ${promotions}.`,
          `Chính sách bảo chứng chất lượng và chăm sóc trọn đời: ${warrantyPolicy}.`,
          `Kính mời quý khách chạm vào ${cartLocation} để xác nhận đặc quyền sở hữu ngay hôm nay.`
        ];

      case 'tech_expert':
        return [
          `Chào mừng toàn thể quý khách hàng và các nhà sáng tạo nội dung đang theo dõi phiên trình diễn công nghệ đột phá của ${companyName} trên ${platformName}!`,
          `Trong kỷ nguyên chuyển đổi số và tự động hóa, việc sở hữu công cụ chuẩn xác và giải pháp tiên tiến chính là chìa khóa then chốt để dẫn đầu thị trường!`,
          `Và hôm nay, ${companyName} trân trọng giới thiệu siêu giải pháp ${productName} - bước đột phá công nghệ thế hệ mới!`,
          `Điểm sáng công nghệ thứ nhất: ${primaryFeature}!`,
          `Tính năng cải tiến vượt bậc: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Hiệu năng tối ưu ấn tượng: ${thirdFeature}!` : `Khả năng tương thích linh hoạt, vận hành mượt mà 24/7 không độ trễ!`,
          `Mức chi phí đầu tư vô cùng ưu đãi chỉ có trong buổi phát sóng trực tuyến này: ${productPrice}!`,
          `Đi kèm gói quà tặng tài nguyên độc quyền: ${promotions}!`,
          `Cam kết đồng hành hỗ trợ kỹ thuật và bảo hành uy tín: ${warrantyPolicy}!`,
          `Anh chị hãy nhấp ngay vào ${cartLocation} để nâng cấp giải pháp công nghệ dẫn đầu ngay hôm nay nhé!`
        ];

      case 'countdown_urgent':
        return [
          `KHẨN CẤP KHẨN CẤP CẢ NHÀ ƠI! Đồng hồ đếm ngược Flash Sale của ${companyName} trên ${platformName} chỉ còn vài phút cuối cùng!`,
          `Siêu phẩm ${productName} đang cháy hàng liên tục trên hệ thống, số lượng trong kho chỉ còn đúng vài suất mở bán!`,
          `Công dụng đỉnh cao mà ai cũng đang săn đón: ${primaryFeature}!`,
          `Cùng tính năng đột phá: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Và ưu điểm độc quyền: ${thirdFeature}!` : `Hiệu quả rõ rệt ngay từ lần trải nghiệm đầu tiên!`,
          `Giá gốc niêm yết tiền triệu, hôm nay giảm kịch sàn xả kho chỉ còn: ${productPrice}!`,
          `Tặng ngay bộ quà tặng độc quyền cho ai bấm chốt nhanh nhất: ${promotions}!`,
          `Cam kết vàng bảo hành chính hãng: ${warrantyPolicy}!`,
          `Nhanh tay nhìn ngay xuống ${cartLocation}, bấm Chọn Mua và Xác Nhận trước khi đồng hồ về số 0 và hệ thống đóng cổng ưu đãi nhé!`
        ];

      case 'emotional_story':
        return [
          `Dạ em xin chào mọi người. Hôm nay ngồi lại trên phiên live ${platformName} này, em muốn tâm sự chân thành với cả nhà một chút.`,
          `Cuộc sống bận rộn đôi khi khiến chúng ta quên đi việc chăm sóc và yêu thương chính bản thân mình và những người thân yêu.`,
          `Và đó cũng chính là tất cả tâm huyết mà ${companyName} đã gửi gắm vào từng sản phẩm ${productName}.`,
          `Sản phẩm mang lại giá trị trọn vẹn: ${primaryFeature}.`,
          `Giúp bạn an tâm và tự tin hơn mỗi ngày với: ${secondaryFeature}.`,
          cleanFeatures.length > 2 ? `Cùng trải nghiệm tuyệt vời: ${thirdFeature}.` : `Mỗi trải nghiệm đều mang lại sự hài lòng và niềm vui trọn vẹn.`,
          `Hôm nay em xin phép tri ân mức giá yêu thương và ấm áp nhất: ${productPrice}.`,
          `Gửi tặng thêm món quà chăm sóc tri ân: ${promotions}.`,
          `Chính sách bảo hành đổi trả chân tình và chu đáo: ${warrantyPolicy}.`,
          `Hãy yêu thương và trân quý bản thân bằng cách chạm vào ${cartLocation} và mang món quà này về nhà nhé!`
        ];

      case 'motivational_fire':
        return [
          `CHÀO TẤT CẢ CÁC CHIẾN BINH NĂNG LƯỢNG ĐỈNH CAO CỦA PHIÊN LIVE ${companyName} TRÊN ${platformName}!`,
          `Hôm nay chúng ta hội tụ ở đây để cùng nhau bứt phá mọi giới hạn và đón nhận những cơ hội tuyệt vời nhất!`,
          `Siêu phẩm ${productName} chính là vũ khí chiến lược giúp bạn nâng tầm vị thế và tỏa sáng rực rỡ!`,
          `Sức mạnh vượt trội đã được chứng minh: ${primaryFeature}!`,
          `Tính năng đột phá giúp bạn tăng tốc dẫn đầu: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Giá trị khẳng định đẳng cấp: ${thirdFeature}!` : `Giải pháp hoàn hảo giúp bạn đạt được hiệu quả vượt trên mong đợi!`,
          `Cơ hội duy nhất trong năm được trợ giá kỷ lục: ${productPrice}!`,
          `Đi kèm gói quà tặng đỉnh cao không thể bỏ lỡ: ${promotions}!`,
          `Cam kết vững chắc như kiềng ba chân: ${warrantyPolicy}!`,
          `Hành động tạo nên kết quả! Hãy chạm ngay vào ${cartLocation} và bứt phá thành công ngay bây giờ nào!`
        ];

      case 'gen_z_vibes':
        return [
          `Hế lô các keo lì, các đồng boi đang lướt trúng live của ${companyName} trên ${platformName} nha!`,
          `Hôm nay shop em drop một siêu phẩm đỉnh nóc kịch trần bay phấp phới luôn á cả nhà ơi!`,
          `Đó chính là em ${productName} bao mượt mà bao cháy phố!`,
          `Công dụng xịn mịn hết nước chấm: ${primaryFeature}!`,
          `Thêm quả tính năng cưng xỉu: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Và bảo bối độc quyền: ${thirdFeature}!` : `Dùng thử một lần là dính chặt luôn không thể rời mắt!`,
          `Giá rẻ hú hồn chim én: ${productPrice}!`,
          `Lại còn được tặng kèm thêm quà siêu đỉnh: ${promotions}!`,
          `Bảo hành uy tín 100 điểm không có nhưng: ${warrantyPolicy}!`,
          `Mấy bồ nhấp liền tay vào ${cartLocation} để múc liền kẻo sold out là tiếc xỉu up xỉu down nha!`
        ];

      case 'vip_master':
        return [
          `Chào mừng quý khách hàng VIP đã tham gia phiên trình diễn và mở bán đặc quyền của thương hiệu ${companyName} trên ${platformName}.`,
          `Chúng tôi tự hào là đơn vị tiên phong kiến tạo nên những chuẩn mực xuất sắc hàng đầu với siêu phẩm ${productName}.`,
          `Sản phẩm hội tụ tinh hoa và giá trị thực chứng: ${primaryFeature}.`,
          `Công năng đẳng cấp mang lại hiệu quả vượt trội: ${secondaryFeature}.`,
          cleanFeatures.length > 2 ? `Điểm nhấn đắt giá tạo nên sự khác biệt: ${thirdFeature}.` : `Đáp ứng hoàn hảo mọi tiêu chuẩn khắt khe nhất của thị trường.`,
          `Trong khung giờ vàng hôm nay, chúng tôi dành tặng mức trợ giá độc quyền: ${productPrice}.`,
          `Cùng bộ quà tặng thượng lưu tri ân khách hàng: ${promotions}.`,
          `Chính sách bảo chứng chất lượng và cam kết dịch vụ trọn đời: ${warrantyPolicy}.`,
          `Kính mời quý vị bấm vào ${cartLocation} để hoàn tất xác nhận đơn hàng đặc quyền ngay hôm nay.`
        ];

      case 'sales_fast':
      default:
        return [
          `Dạ em chào toàn thể các tình yêu đã có mặt trong phiên livestream săn deal cực khủng của ${companyName} trên ${platformName} hôm nay nha!`,
          `Các chị em nhanh tay thả tim và chia sẻ live để em mở bát tung quà tặng siêu to khổng lồ nào!`,
          `Hôm nay em mang đến siêu phẩm vạn người mê đang cháy hàng khắp nơi: ${productName}!`,
          `Tính năng và công dụng vượt trội đầu tiên: ${primaryFeature}!`,
          `Thêm một điểm cộng cực lớn mà ai dùng cũng phải khen: ${secondaryFeature}!`,
          cleanFeatures.length > 2 ? `Và điều đặc biệt nhất: ${thirdFeature}!` : `Sản phẩm chuẩn xịn, mang lại hiệu quả bất ngờ ngay từ lần đầu tiên sử dụng!`,
          `Giá niêm yết tiền triệu ngoài store, hôm nay trên live giảm sốc chỉ còn: ${productPrice}!`,
          `Đặc biệt tặng kèm trọn gói quà tặng: ${promotions} cho ai chốt nhanh nhất!`,
          `Chính sách cam kết vàng bảo hành uy tín: ${warrantyPolicy}!`,
          `Chỉ còn đúng vài suất ưu đãi cuối cùng, các chị nhìn ngay xuống ${cartLocation} bấm chọn mua ngay nhé!`
        ];
    }
  };

  // Khối bổ trợ: Tri thức doanh nghiệp & Câu hỏi thường gặp FAQ
  const getKnowledgeFaqBlocks = (index = 0) => {
    const faqBlocks = [
      [
        `Có rất nhiều anh chị đang bình luận hỏi em là sản phẩm ${productName} có dùng được lâu dài và an toàn không?`,
        `Dạ em xin khẳng định là sản phẩm được chiết xuất và sản xuất theo quy trình nghiêm ngặt, đạt chuẩn chất lượng cao nhất nên cực kỳ an toàn và bền bỉ ạ!`,
        `Nếu anh chị phát hiện hàng không đúng chuẩn, bên em cam kết hoàn tiền 200% ngay lập tức theo đúng chính sách: ${warrantyPolicy}!`,
        `Nên cả nhà cứ yên tâm bấm vào ${cartLocation} săn ngay kẻo lỡ đợt giảm giá này nha!`
      ],
      [
        `Một câu hỏi nữa mà shop nhận được rất nhiều là: "Mua trên live có được miễn phí vận chuyển và kiểm tra hàng trước không?"`,
        `Dạ chắc chắn rồi ạ! ${companyName} luôn hỗ trợ ${promotions} và cho phép khách hàng kiểm tra hàng thoải mái trước khi thanh toán!`,
        `Mức giá ưu đãi ${productPrice} chỉ áp dụng trực tiếp trong phiên live này thôi ạ!`,
        `Các bạn hãy nhanh tay đặt hàng ngay tại ${cartLocation} để kịp nhận mã freeship nha!`
      ],
      [
        `Nhiều chị em còn phân vân chưa biết cách dùng ${productName} sao cho đạt hiệu quả cao nhất.`,
        `Dạ rất đơn giản thôi ạ, mỗi ngày các chị chỉ cần sử dụng đều đặn theo hướng dẫn kèm theo là sẽ thấy sự khác biệt rõ rệt từng ngày!`,
        `Sản phẩm này bên em đã bán ra hàng chục nghìn đơn và nhận về toàn bộ đánh giá 5 sao từ khách hàng khắp cả nước!`,
        `Hãy cho bản thân cơ hội trải nghiệm sản phẩm tuyệt vời này bằng cách đặt mua ngay ở ${cartLocation} nhé!`
      ]
    ];
    return faqBlocks[index % faqBlocks.length];
  };

  // Khối bổ trợ từ Kho Tri Thức Tự Do nếu người dùng đã tải lên file
  const getCustomKnowledgeSentences = () => {
    if (cleanKnowledge.length === 0) return [];
    return cleanKnowledge.slice(0, 10).map(k => `Thông tin từ kho tri thức của ${companyName}: ${k}`);
  };

  // Tính toán số vòng lặp kịch bản cần thiết theo số phút
  // Trung bình 1 block cơ bản 10 câu đọc trong ~1.5 - 2 phút (tính cả ngắt nghỉ tự nhiên)
  let targetRounds = Math.max(1, Math.round(durationMin / 2));
  if (durationMin <= 1) targetRounds = 1;
  else if (durationMin <= 3) targetRounds = 1;
  else if (durationMin <= 5) targetRounds = 2;
  else if (durationMin <= 10) targetRounds = 3;
  else if (durationMin <= 15) targetRounds = 5;
  else if (durationMin <= 30) targetRounds = 10;
  else if (durationMin <= 60) targetRounds = 18;
  else targetRounds = Math.min(50, Math.round(durationMin / 3));

  let finalSentences = [];
  const baseBlock = getStyleBlocks(1);

  if (durationMin <= 1) {
    // 1 phút: Rút gọn 5-6 câu súc tích nhất
    finalSentences = [
      baseBlock[0],
      baseBlock[2],
      baseBlock[3],
      baseBlock[6],
      baseBlock[7],
      baseBlock[9]
    ];
  } else if (durationMin <= 3) {
    // 2-3 phút: 10 câu cơ bản hoàn chỉnh
    finalSentences = [...baseBlock];
  } else {
    // > 3 phút: Xây dựng chuỗi kịch bản vòng lặp bán hàng kết hợp FAQ & Tri thức doanh nghiệp
    const customDocs = getCustomKnowledgeSentences();
    for (let r = 0; r < targetRounds; r++) {
      // Vòng lặp phong cách chính
      finalSentences.push(...getStyleBlocks(r + 1));
      
      // Chèn thêm khối FAQ xử lý từ chối & tạo niềm tin
      finalSentences.push(...getKnowledgeFaqBlocks(r));

      // Nếu có dữ liệu tri thức tự do, chèn xen kẽ 1-2 câu
      if (customDocs.length > 0) {
        const docSentence = customDocs[r % customDocs.length];
        if (docSentence) finalSentences.push(docSentence);
      }

      // Câu neo chốt sale ở cuối mỗi vòng
      if (r < targetRounds - 1) {
        finalSentences.push(`Em xin nhắc lại với cả nhà là ưu đãi ${productPrice} và quà tặng ${promotions} chỉ còn đúng vài suất trong ${cartLocation}, các bạn nhanh tay chốt đơn nha!`);
      }
    }
  }

  return finalSentences.filter(Boolean).join('\n');
}
