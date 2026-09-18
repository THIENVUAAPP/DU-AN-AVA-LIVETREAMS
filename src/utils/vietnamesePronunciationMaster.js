/**
 * VIETNAMESE AI VOICE — MASTER PRONUNCIATION & TEXT NORMALIZATION ENGINE
 * Xây dựng dựa trên chuẩn tài liệu Master Pronunciation Prompt:
 * 1. Đọc đúng chính tả, ngữ nghĩa, đúng 6 thanh điệu tiếng Việt (ngang, huyền, sắc, hỏi, ngã, nặng).
 * 2. Phân biệt chính xác phụ âm đầu (b/p, c/k/q, d/gi/r, g/gh, ng/ngh, s/x, ch/tr, l/n, v/d, t/th, kh/h, ph/f, nh/n).
 * 3. Bảo toàn 100% âm cuối (m, n, ng, nh, p, t, c, ch), không nuốt âm, không đứt tiếng.
 * 4. Chuyển đổi chuẩn xác số tiền (VND, $, €, K, cành, củ, triệu, tỷ), số đếm, số thứ tự, phiên bản phần mềm.
 * 5. Chuyển đổi số điện thoại theo nhóm (3-3-4), OTP/mã số từng ký tự, mã đơn hàng.
 * 6. Chuẩn hóa đơn vị đo (kg, g, mg, km, m, cm, mm, l, ml, °C, °F, GB, MB, KB, TB, Hz, W, V...).
 * 7. Phát âm chuẩn từ viết tắt công nghệ & thương hiệu: AVA LIVE, TikTok, Facebook, YouTube, AI, TTS, API, UI, UX, CRM, ERP, SaaS, B2B, B2C, KOL, KOC...
 * 8. Làm sạch ký hiệu trình bày (markdown, hashtag, mention, emoji, ngoặc, gạch ngang) không đọc tên ký hiệu ra tiếng.
 * 9. Phân đoạn ngữ nghĩa, nhịp thở, ngắt nghỉ mượt mà, cảm xúc tự nhiên, không đọc rời rạc kiểu robot.
 */

// 1. TỪ ĐIỂN PHÁT ÂM THƯƠNG HIỆU & THUẬT NGỮ CÔNG NGHỆ (PRONUNCIATION DICTIONARY)
export const PRONUNCIATION_DICTIONARY = [
  // 🛡️ BẢO VỆ TUYỆT ĐỐI CÁC TỪ KHÓA TIẾNG VIỆT GỐC, KHỬ TÁCH CHỮ RỜI RẠC & CHỮA LỖI CHÍNH TẢ
  { pattern: /(?<![\p{L}\p{N}_])dừng\s*lại\s*đây\s*một\s*chút\s*thôi(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại đây một chút thôi' },
  { pattern: /(?<![\p{L}\p{N}_])dừng\s*lại\s*đây\s*một\s*chút(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại đây một chút' },
  { pattern: /(?<![\p{L}\p{N}_])dừng\s*lại\s*đây(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại đây' },
  { pattern: /(?<![\p{L}\p{N}_])dừng\s*lại\s*một\s*chút\s*thôi(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại một chút thôi' },
  { pattern: /(?<![\p{L}\p{N}_])dừng\s*lại\s*một\s*chút(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại một chút' },
  { pattern: /(?<![\p{L}\p{N}_])dừ\s*ng\s*lạ\s*i(?![\p{L}\p{N}_])/giu, replacement: 'dừng lại' },
  { pattern: /(?<![\p{L}\p{N}_])hiệ\s*n\s*tạ\s*i(?![\p{L}\p{N}_])/giu, replacement: 'hiện tại' },
  { pattern: /(?<![\p{L}\p{N}_])hiện\s*tại(?![\p{L}\p{N}_])/giu, replacement: 'hiện tại' },
  { pattern: /(?<![\p{L}\p{N}_])nhắ\s*c\s*lạ\s*i(?![\p{L}\p{N}_])/giu, replacement: 'nhắc lại' },
  { pattern: /(?<![\p{L}\p{N}_])nhắc\s*lại(?![\p{L}\p{N}_])/giu, replacement: 'nhắc lại' },
  { pattern: /(?<![\p{L}\p{N}_])nhắt\s*lại(?![\p{L}\p{N}_])/giu, replacement: 'nhắc lại' },
  { pattern: /(?<![\p{L}\p{N}_])ăn\s*nhạ\s*t(?![\p{L}\p{N}_])/giu, replacement: 'ăn nhạt' },
  { pattern: /(?<![\p{L}\p{N}_])ăn\s*nhạt(?![\p{L}\p{N}_])/giu, replacement: 'ăn nhạt' },
  { pattern: /(?<![\p{L}\p{N}_])ăn\s*nhạc(?![\p{L}\p{N}_])/giu, replacement: 'ăn nhạt' },
  { pattern: /(?<![\p{L}\p{N}_])bánh\s*gạ\s*[\-_]?\s*[oô]\s*[\-_]?\s*lứ[ct](?![\p{L}\p{N}_])/giu, replacement: 'bánh gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])bánh\s*gạo\s*lức(?![\p{L}\p{N}_])/giu, replacement: 'bánh gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])bánh\s*gạo\s*lứt(?![\p{L}\p{N}_])/giu, replacement: 'bánh gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])bánh\s*gạ\s*[\-_]?\s*[oô](?![\p{L}\p{N}_])/giu, replacement: 'bánh gạo' },
  { pattern: /(?<![\p{L}\p{N}_])bánh\s*gạo(?![\p{L}\p{N}_])/giu, replacement: 'bánh gạo' },
  { pattern: /(?<![\p{L}\p{N}_])gạ\s*[\-_]?\s*[oô]\s*[\-_]?\s*lứ[ct](?![\p{L}\p{N}_])/giu, replacement: 'gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*lức(?![\p{L}\p{N}_])/giu, replacement: 'gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*lứt(?![\p{L}\p{N}_])/giu, replacement: 'gạo lứt' },
  { pattern: /(?<![\p{L}\p{N}_])gạ\s*[\-_]?\s*[oô](?![\p{L}\p{N}_])/giu, replacement: 'gạo' },
  { pattern: /(?<![\p{L}\p{N}_])lức(?![\p{L}\p{N}_])/giu, replacement: 'lứt' },
  { pattern: /(?<![\p{L}\p{N}_])lứ\s*t(?![\p{L}\p{N}_])/giu, replacement: 'lứt' },
  { pattern: /(?<![\p{L}\p{N}_])lứ\s*c(?![\p{L}\p{N}_])/giu, replacement: 'lứt' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*st25(?![\p{L}\p{N}_])/giu, replacement: 'gạo ST25' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*st-?25(?![\p{L}\p{N}_])/giu, replacement: 'gạo ST25' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*thơm(?![\p{L}\p{N}_])/giu, replacement: 'gạo thơm' },
  { pattern: /(?<![\p{L}\p{N}_])gạo\s*nàng\s*thơm(?![\p{L}\p{N}_])/giu, replacement: 'gạo nàng thơm' },
  { pattern: /(?<![\p{L}\p{N}_])lúa\s*gạo(?![\p{L}\p{N}_])/giu, replacement: 'lúa gạo' },
  { pattern: /(?<![\p{L}\p{N}_])gạo(?![\p{L}\p{N}_])/giu, replacement: 'gạo' },
  { pattern: /(?<![\p{L}\p{N}_])bạ\s*[\-_]?\s*[nN](?![\p{L}\p{N}_])/giu, replacement: 'bạn' },
  { pattern: /(?<![\p{L}\p{N}_])b\s*ạ\s*n(?![\p{L}\p{N}_])/giu, replacement: 'bạn' },
  { pattern: /(?<![\p{L}\p{N}_])bạn(?![\p{L}\p{N}_])/giu, replacement: 'bạn' },
  { pattern: /(?<![\p{L}\p{N}_])kị\s*ch\s*bả\s*n(?![\p{L}\p{N}_])/giu, replacement: 'kịch bản' },
  { pattern: /(?<![\p{L}\p{N}_])kịch\s*bản(?![\p{L}\p{N}_])/giu, replacement: 'kịch bản' },
  { pattern: /(?<![\p{L}\p{N}_])khá\s*ch\s*hà\s*ng(?![\p{L}\p{N}_])/giu, replacement: 'khách hàng' },
  { pattern: /(?<![\p{L}\p{N}_])khách\s*hàng(?![\p{L}\p{N}_])/giu, replacement: 'khách hàng' },
  { pattern: /(?<![\p{L}\p{N}_])khách(?![\p{L}\p{N}_])/giu, replacement: 'khách' },
  { pattern: /(?<![\p{L}\p{N}_])chào\s*bạn(?![\p{L}\p{N}_])/giu, replacement: 'chào bạn' },
  { pattern: /(?<![\p{L}\p{N}_])cảm\s*ơn\s*bạn(?![\p{L}\p{N}_])/giu, replacement: 'cảm ơn bạn' },
  { pattern: /(?<![\p{L}\p{N}_])bạn\s*ơi(?![\p{L}\p{N}_])/giu, replacement: 'bạn ơi' },
  { pattern: /(?<![\p{L}\p{N}_])sả\s*n\s*phẩ\s*m(?![\p{L}\p{N}_])/giu, replacement: 'sản phẩm' },
  { pattern: /(?<![\p{L}\p{N}_])liê\s*n\s*tụ\s*c(?![\p{L}\p{N}_])/giu, replacement: 'liên tục' },
  { pattern: /(?<![\p{L}\p{N}_])liên\s*tục(?![\p{L}\p{N}_])/giu, replacement: 'liên tục' },
  { pattern: /(?<![\p{L}\p{N}_])chí\s*nh\s*tả(?![\p{L}\p{N}_])/giu, replacement: 'chính tả' },
  { pattern: /(?<![\p{L}\p{N}_])chính\s*tả(?![\p{L}\p{N}_])/giu, replacement: 'chính tả' },
  { pattern: /(?<![\p{L}\p{N}_])phá\s*t\s*âm(?![\p{L}\p{N}_])/giu, replacement: 'phát âm' },
  { pattern: /(?<![\p{L}\p{N}_])giọ\s*ng\s*đọ\s*c(?![\p{L}\p{N}_])/giu, replacement: 'giọng đọc' },
  { pattern: /(?<![\p{L}\p{N}_])không(?![\p{L}\p{N}_])/giu, replacement: 'không' },
  { pattern: /(?<![\p{L}\p{N}_])khoong6(?![\p{L}\p{N}_])/giu, replacement: 'không' },
  { pattern: /(?<![\p{L}\p{N}_])đôc(?![\p{L}\p{N}_])/giu, replacement: 'đọc' },
  { pattern: /(?<![\p{L}\p{N}_])đoc(?![\p{L}\p{N}_])/giu, replacement: 'đọc' },

  // Thương hiệu độc quyền AvaLive
  { pattern: /(?<![\p{L}\p{N}_])(AVA\s*LIVE\s*PRO|AVALIVEPRO)(?![\p{L}\p{N}_])/giu, replacement: 'Ava Live Pro' },
  { pattern: /(?<![\p{L}\p{N}_])(AVA\s*LIVE|AVALIVE)(?![\p{L}\p{N}_])/giu, replacement: 'Ava Live' },
  { pattern: /(?<![\p{L}\p{N}_])(THIEN\s*VUA\s*APP|THIENVUAAPP)(?![\p{L}\p{N}_])/giu, replacement: 'Thiên Vua App' },
  
  // Nền tảng mạng xã hội & Livestream (Phát âm chuẩn xác, không dùng tiếng lóng làm sai lệch từ ngữ)
  { pattern: /(?<![\p{L}\p{N}_])(TikTok\s*Live\s*Studio|Tik\s*Tok\s*Live\s*Studio)(?![\p{L}\p{N}_])/giu, replacement: 'TikTok Live Studio' },
  { pattern: /(?<![\p{L}\p{N}_])(TikTok\s*Shop|Tik\s*Tok\s*Shop)(?![\p{L}\p{N}_])/giu, replacement: 'TikTok Shop' },
  { pattern: /(?<![\p{L}\p{N}_])(TikTok|Tik\s*Tok)(?![\p{L}\p{N}_])/giu, replacement: 'TikTok' },
  { pattern: /(?<![\p{L}\p{N}_])(Facebook\s*Live|FB\s*Live)(?![\p{L}\p{N}_])/giu, replacement: 'Facebook Live' },
  { pattern: /(?<![\p{L}\p{N}_])(Facebook|FB)(?![\p{L}\p{N}_])/giu, replacement: 'Facebook' },
  { pattern: /(?<![\p{L}\p{N}_])(YouTube|Youtube|YT)(?![\p{L}\p{N}_])/giu, replacement: 'YouTube' },
  { pattern: /(?<![\p{L}\p{N}_])(Shopee\s*Live)(?![\p{L}\p{N}_])/giu, replacement: 'Shopee Live' },
  { pattern: /(?<![\p{L}\p{N}_])(Shopee)(?![\p{L}\p{N}_])/giu, replacement: 'Shopee' },
  { pattern: /(?<![\p{L}\p{N}_])(Lazada)(?![\p{L}\p{N}_])/giu, replacement: 'Lazada' },
  { pattern: /(?<![\p{L}\p{N}_])(Zalo)(?![\p{L}\p{N}_])/giu, replacement: 'Zalo' },
  { pattern: /(?<![\p{L}\p{N}_])(OBS\s*Studio|OBS)(?![\p{L}\p{N}_])/giu, replacement: 'OBS Studio' },

  // Thuật ngữ AI & Công nghệ
  { pattern: /(?<![\p{L}\p{N}_])AI(?![\p{L}\p{N}_])/gu, replacement: 'AI' },
  { pattern: /(?<![\p{L}\p{N}_])TTS(?![\p{L}\p{N}_])/gu, replacement: 'TTS' },
  { pattern: /(?<![\p{L}\p{N}_])API(?![\p{L}\p{N}_])/gu, replacement: 'API' },
  { pattern: /(?<![\p{L}\p{N}_])UI(?![\p{L}\p{N}_])/gu, replacement: 'giao diện' },
  { pattern: /(?<![\p{L}\p{N}_])UX(?![\p{L}\p{N}_])/gu, replacement: 'trải nghiệm' },
  { pattern: /(?<![\p{L}\p{N}_])CRM(?![\p{L}\p{N}_])/gu, replacement: 'CRM' },
  { pattern: /(?<![\p{L}\p{N}_])ERP(?![\p{L}\p{N}_])/gu, replacement: 'ERP' },
  { pattern: /(?<![\p{L}\p{N}_])SaaS(?![\p{L}\p{N}_])/giu, replacement: 'phần mềm dịch vụ' },
  { pattern: /(?<![\p{L}\p{N}_])KOL(?![\p{L}\p{N}_])/gu, replacement: 'KOL' },
  { pattern: /(?<![\p{L}\p{N}_])KOC(?![\p{L}\p{N}_])/gu, replacement: 'KOC' },
  { pattern: /(?<![\p{L}\p{N}_])CEO(?![\p{L}\p{N}_])/gu, replacement: 'CEO' },
  { pattern: /(?<![\p{L}\p{N}_])CTO(?![\p{L}\p{N}_])/gu, replacement: 'CTO' },
  { pattern: /(?<![\p{L}\p{N}_])OTP(?![\p{L}\p{N}_])/giu, replacement: 'OTP' },
  { pattern: /(?<![\p{L}\p{N}_])SKU(?![\p{L}\p{N}_])/giu, replacement: 'mã sản phẩm' },
  { pattern: /(?<![\p{L}\p{N}_])ID(?![\p{L}\p{N}_])/gu, replacement: 'mã số' },
  { pattern: /(?<![\p{L}\p{N}_])PK(?![\p{L}\p{N}_])/gu, replacement: 'PK' },
  { pattern: /(?<![\p{L}\p{N}_])PRO(?![\p{L}\p{N}_])/giu, replacement: 'Pro' },
  { pattern: /(?<![\p{L}\p{N}_])VIP(?![\p{L}\p{N}_])/giu, replacement: 'VIP' },
  { pattern: /(?<![\p{L}\p{N}_])LIP-?SYNC(?![\p{L}\p{N}_])/giu, replacement: 'khớp khẩu hình' },
  { pattern: /(?<![\p{L}\p{N}_])AVATAR(?![\p{L}\p{N}_])/giu, replacement: 'Avatar' },
  { pattern: /(?<![\p{L}\p{N}_])LIVESTREAM(?![\p{L}\p{N}_])/giu, replacement: 'livestream' },
  { pattern: /(?<![\p{L}\p{N}_])LIVE\s*STREAM(?![\p{L}\p{N}_])/giu, replacement: 'livestream' },
  { pattern: /(?<![\p{L}\p{N}_])STREAM(?![\p{L}\p{N}_])/giu, replacement: 'stream' },
  { pattern: /(?<![\p{L}\p{N}_])STREAMER(?![\p{L}\p{N}_])/giu, replacement: 'streamer' },
  { pattern: /(?<![\p{L}\p{N}_])FEEDBACK(?![\p{L}\p{N}_])/giu, replacement: 'phản hồi' },
  { pattern: /(?<![\p{L}\p{N}_])REVIEW(?![\p{L}\p{N}_])/giu, replacement: 'đánh giá' },
  { pattern: /(?<![\p{L}\p{N}_])FREESHIP(?![\p{L}\p{N}_])/giu, replacement: 'miễn phí giao hàng' },
  { pattern: /(?<![\p{L}\p{N}_])FREE\s*SHIP(?![\p{L}\p{N}_])/giu, replacement: 'miễn phí giao hàng' },
  { pattern: /(?<![\p{L}\p{N}_])FLASH\s*SALE(?![\p{L}\p{N}_])/giu, replacement: 'giảm giá chớp nhoáng' },
  { pattern: /(?<![\p{L}\p{N}_])SALE(?![\p{L}\p{N}_])/giu, replacement: 'giảm giá' },
  { pattern: /(?<![\p{L}\p{N}_])DEAL(?![\p{L}\p{N}_])/giu, replacement: 'ưu đãi' },
  { pattern: /(?<![\p{L}\p{N}_])COMBO(?![\p{L}\p{N}_])/giu, replacement: 'combo' },
  { pattern: /(?<![\p{L}\p{N}_])HOT\s*TREND(?![\p{L}\p{N}_])/giu, replacement: 'xu hướng' },
  { pattern: /(?<![\p{L}\p{N}_])TREND(?![\p{L}\p{N}_])/giu, replacement: 'xu hướng' },
  { pattern: /(?<![\p{L}\p{N}_])VOUCHER(?![\p{L}\p{N}_])/giu, replacement: 'phiếu giảm giá' },
  { pattern: /(?<![\p{L}\p{N}_])ORDER(?![\p{L}\p{N}_])/giu, replacement: 'đặt hàng' },
  { pattern: /(?<![\p{L}\p{N}_])SERUM(?![\p{L}\p{N}_])/giu, replacement: 'serum' },
  { pattern: /(?<![\p{L}\p{N}_])SKINCARE(?![\p{L}\p{N}_])/giu, replacement: 'chăm sóc da' },
  { pattern: /(?<![\p{L}\p{N}_])APP(?![\p{L}\p{N}_])/giu, replacement: 'ứng dụng' },
  { pattern: /(?<![\p{L}\p{N}_])WEBSITE(?![\p{L}\p{N}_])/giu, replacement: 'trang web' },
  { pattern: /(?<![\p{L}\p{N}_])WEB(?![\p{L}\p{N}_])/giu, replacement: 'trang web' },
  { pattern: /(?<![\p{L}\p{N}_])LINK(?![\p{L}\p{N}_])/giu, replacement: 'đường link' },
  { pattern: /(?<![\p{L}\p{N}_])FPS(?![\p{L}\p{N}_])/giu, replacement: 'khung hình trên giây' },
  { pattern: /(?<![\p{L}\p{N}_])2K(?![\p{L}\p{N}_])/giu, replacement: 'hai ca siêu nét' },
  { pattern: /(?<![\p{L}\p{N}_])4K(?![\p{L}\p{N}_])/giu, replacement: 'bốn ca siêu nét' },
  { pattern: /(?<![\p{L}\p{N}_])8K(?![\p{L}\p{N}_])/giu, replacement: 'tám ca siêu nét' },
  { pattern: /(?<![\p{L}\p{N}_])1080P(?![\p{L}\p{N}_])/giu, replacement: 'full HD 1080p' },
  { pattern: /(?<![\p{L}\p{N}_])720P(?![\p{L}\p{N}_])/giu, replacement: '720p' }
];

// 2. TỪ ĐIỂN TỪ VIẾT TẮT TIẾNG VIỆT (UNICODE-AWARE BOUNDARIES)
export const VIETNAMESE_ABBREVIATIONS = [
  { pattern: /(?<![\p{L}\p{N}_])sp(?![\p{L}\p{N}_])/giu, replacement: 'sản phẩm' },
  { pattern: /(?<![\p{L}\p{N}_])đc(?![\p{L}\p{N}_])/giu, replacement: 'được' },
  { pattern: /(?<![\p{L}\p{N}_])dc(?![\p{L}\p{N}_])/giu, replacement: 'được' },
  { pattern: /(?<![\p{L}\p{N}_])ko(?![\p{L}\p{N}_])/giu, replacement: 'không' },
  { pattern: /(?<![\p{L}\p{N}_])khg(?![\p{L}\p{N}_])/giu, replacement: 'không' },
  { pattern: /(?<![\p{L}\p{N}_])mn(?![\p{L}\p{N}_])/giu, replacement: 'mọi người' },
  { pattern: /(?<![\p{L}\p{N}_])mng(?![\p{L}\p{N}_])/giu, replacement: 'mọi người' },
  { pattern: /(?<![\p{L}\p{N}_])sz(?![\p{L}\p{N}_])/giu, replacement: 'size' },
  { pattern: /(?<![\p{L}\p{N}_])stk(?![\p{L}\p{N}_])/giu, replacement: 'số tài khoản' },
  { pattern: /(?<![\p{L}\p{N}_])cod(?![\p{L}\p{N}_])/giu, replacement: 'nhận hàng thanh toán' },
  { pattern: /(?<![\p{L}\p{N}_])btv(?![\p{L}\p{N}_])/giu, replacement: 'biên tập viên' },
  { pattern: /(?<![\p{L}\p{N}_])mc(?![\p{L}\p{N}_])/giu, replacement: 'người dẫn chương trình' },
  { pattern: /(?<![\p{L}\p{N}_])vtv(?![\p{L}\p{N}_])/giu, replacement: 'đài truyền hình' },
  { pattern: /(?<![\p{L}\p{N}_])km(?![\p{L}\p{N}_])/giu, replacement: 'khuyến mãi' },
  { pattern: /(?<![\p{L}\p{N}_])hsd(?![\p{L}\p{N}_])/giu, replacement: 'hạn sử dụng' },
  { pattern: /(?<![\p{L}\p{N}_])nsx(?![\p{L}\p{N}_])/giu, replacement: 'ngày sản xuất' },
  { pattern: /(?<![\p{L}\p{N}_])nv(?![\p{L}\p{N}_])/giu, replacement: 'nhân viên' },
  { pattern: /(?<![\p{L}\p{N}_])lh(?![\p{L}\p{N}_])/giu, replacement: 'liên hệ' },
  { pattern: /(?<![\p{L}\p{N}_])tp(?![\p{L}\p{N}_])/giu, replacement: 'thành phố' },
  { pattern: /(?<![\p{L}\p{N}_])hcm(?![\p{L}\p{N}_])/giu, replacement: 'Hồ Chí Minh' },
  { pattern: /(?<![\p{L}\p{N}_])hn(?![\p{L}\p{N}_])/giu, replacement: 'Hà Nội' },
  { pattern: /(?<![\p{L}\p{N}_])ib(?![\p{L}\p{N}_])/giu, replacement: 'nhắn tin trực tiếp' },
  { pattern: /(?<![\p{L}\p{N}_])inbox(?![\p{L}\p{N}_])/giu, replacement: 'nhắn tin trực tiếp' },
  { pattern: /(?<![\p{L}\p{N}_])cmt(?![\p{L}\p{N}_])/giu, replacement: 'bình luận' },
  { pattern: /(?<![\p{L}\p{N}_])comment(?![\p{L}\p{N}_])/giu, replacement: 'bình luận' },
  { pattern: /(?<![\p{L}\p{N}_])auth(?![\p{L}\p{N}_])/giu, replacement: 'chính hãng chuẩn gốc' },
  { pattern: /(?<![\p{L}\p{N}_])real(?![\p{L}\p{N}_])/giu, replacement: 'hàng thật chính hãng' },
  { pattern: /(?<![\p{L}\p{N}_])setup(?![\p{L}\p{N}_])/giu, replacement: 'cài đặt' },
  { pattern: /(?<![\p{L}\p{N}_])ok(?![\p{L}\p{N}_])/giu, replacement: 'dạ vâng được ạ' },
  { pattern: /(?<![\p{L}\p{N}_])okay(?![\p{L}\p{N}_])/giu, replacement: 'dạ vâng được ạ' },
  { pattern: /(?<![\p{L}\p{N}_])ts\.(?![\p{L}\p{N}_])/giu, replacement: 'Tiến sĩ ' },
  { pattern: /(?<![\p{L}\p{N}_])bs\.(?![\p{L}\p{N}_])/giu, replacement: 'Bác sĩ ' },
  { pattern: /(?<![\p{L}\p{N}_])pgs\.ts\.(?![\p{L}\p{N}_])/giu, replacement: 'Phó Giáo sư Tiến sĩ ' },
  { pattern: /(?<![\p{L}\p{N}_])thcs(?![\p{L}\p{N}_])/giu, replacement: 'trung học cơ sở' },
  { pattern: /(?<![\p{L}\p{N}_])thpt(?![\p{L}\p{N}_])/giu, replacement: 'trung học phổ thông' },
  { pattern: /(?<![\p{L}\p{N}_])đh(?![\p{L}\p{N}_])/giu, replacement: 'đại học' }
];

// 3. CHUYỂN ĐỔI SỐ NGUYÊN TIẾNG VIỆT THÀNH CHỮ CHUẨN XÁC
const DIGIT_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

export function numberToVietnameseWords(num) {
  if (isNaN(num)) return '';
  num = Math.floor(Math.abs(num));
  if (num === 0) return 'không';

  const readHundreds = (n, showFull = false) => {
    let result = '';
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (h > 0 || showFull) {
      result += DIGIT_WORDS[h] + ' trăm ';
      if (t === 0 && u > 0) result += 'lẻ ';
    }

    if (t === 1) {
      result += 'mười ';
    } else if (t > 1) {
      result += DIGIT_WORDS[t] + ' mươi ';
    }

    if (u === 1) {
      if (t > 1) result += 'mốt ';
      else result += 'một ';
    } else if (u === 5 && t > 0) {
      result += 'lăm ';
    } else if (u > 0 || (h === 0 && t === 0 && !showFull)) {
      if (u > 0 || result === '') result += DIGIT_WORDS[u] + ' ';
    }

    return result.trim();
  };

  const BILLION = 1000000000;
  const MILLION = 1000000;
  const THOUSAND = 1000;

  let result = '';
  if (num >= BILLION) {
    const billions = Math.floor(num / BILLION);
    result += numberToVietnameseWords(billions) + ' tỷ ';
    num %= BILLION;
  }
  if (num >= MILLION) {
    const millions = Math.floor(num / MILLION);
    result += readHundreds(millions, result.length > 0) + ' triệu ';
    num %= MILLION;
  }
  if (num >= THOUSAND) {
    const thousands = Math.floor(num / THOUSAND);
    result += readHundreds(thousands, result.length > 0) + ' nghìn ';
    num %= THOUSAND;
  }
  if (num > 0 || result === '') {
    result += readHundreds(num, result.length > 0);
  }

  return result.trim().replace(/\s+/g, ' ');
}

// 4. CHUYỂN ĐỔI CHUỖI SỐ ĐIỆN THOẠI THÀNH NHÓM PHÁT ÂM DỄ NGHE (3-3-4)
export function normalizePhoneNumber(phoneStr) {
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.length === 10) {
    const g1 = digits.substring(0, 3).split('').map(d => DIGIT_WORDS[d]).join(' ');
    const g2 = digits.substring(3, 6).split('').map(d => DIGIT_WORDS[d]).join(' ');
    const g3 = digits.substring(6, 10).split('').map(d => DIGIT_WORDS[d]).join(' ');
    return `${g1}, ${g2}, ${g3}`;
  } else if (digits.length === 11) {
    const g1 = digits.substring(0, 4).split('').map(d => DIGIT_WORDS[d]).join(' ');
    const g2 = digits.substring(4, 7).split('').map(d => DIGIT_WORDS[d]).join(' ');
    const g3 = digits.substring(7, 11).split('').map(d => DIGIT_WORDS[d]).join(' ');
    return `${g1}, ${g2}, ${g3}`;
  }
  return digits.split('').map(d => DIGIT_WORDS[d] || d).join(' ');
}

// 5. CHUẨN HÓA TIỀN TỆ & ĐƠN VỊ ĐO LƯỜNG (UNICODE-AWARE BOUNDARIES)
export function normalizeCurrenciesAndUnits(text) {
  if (!text) return '';
  let s = text;

  // Tiền tệ có dấu chấm phân cách hàng nghìn/triệu
  s = s.replace(/(?<![\p{L}\p{N}_])(\d{1,3}(?:\.\d{3})+)\s*(?:đ|vnd|vnđ|đồng)(?![\p{L}\p{N}_])/giu, (match, p1) => {
    const rawNum = parseInt(p1.replace(/\./g, ''), 10);
    return `${numberToVietnameseWords(rawNum)} đồng`;
  });

  // Tiền tệ có dấu phẩy: 1,000,000đ
  s = s.replace(/(?<![\p{L}\p{N}_])(\d{1,3}(?:,\d{3})+)\s*(?:đ|vnd|vnđ|đồng)(?![\p{L}\p{N}_])/giu, (match, p1) => {
    const rawNum = parseInt(p1.replace(/,/g, ''), 10);
    return `${numberToVietnameseWords(rawNum)} đồng`;
  });

  // Số k / cành / củ / tr / triệu (chỉ sau số đếm)
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+)\s*k(?![\p{L}\p{N}_])/giu, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} nghìn đồng`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+)\s*cành(?![\p{L}\p{N}_])/giu, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} nghìn đồng`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+)\s*củ(?![\p{L}\p{N}_])/giu, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu đồng`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+)\s*(?:tr|triệu)(?![\p{L}\p{N}_])/giu, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu đồng`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+)[,\.](\d+)\s*(?:tr|triệu)(?![\p{L}\p{N}_])/giu, (m, p1, p2) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu ${numberToVietnameseWords(parseInt(p2, 10))} trăm nghìn đồng`);

  // Tiền tệ quốc tế
  s = s.replace(/\$(\d+(?:\.\d+)?)/g, (m, p1) => `${p1} đô la`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:\.\d+)?)\s*(?:usd|\$)(?![\p{L}\p{N}_])/giu, (m, p1) => `${p1} đô la`);
  s = s.replace(/€(\d+(?:\.\d+)?)/g, (m, p1) => `${p1} ơ-rô`);
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:\.\d+)?)\s*(?:eur|€)(?![\p{L}\p{N}_])/giu, (m, p1) => `${p1} ơ-rô`);

  // Đơn vị đo lường (chỉ sau số đếm)
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*kg(?![\p{L}\p{N}_])/giu, '$1 ki-lô-gam');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*g(?![\p{L}\p{N}_])/giu, '$1 gam');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*mg(?![\p{L}\p{N}_])/giu, '$1 mi-li-gam');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*km(?![\p{L}\p{N}_])/giu, '$1 ki-lô-mét');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*m(?![\p{L}\p{N}_])/giu, '$1 mét');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*cm(?![\p{L}\p{N}_])/giu, '$1 xen-ti-mét');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*mm(?![\p{L}\p{N}_])/giu, '$1 mi-li-mét');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*ml(?![\p{L}\p{N}_])/giu, '$1 mi-li-lít');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*l(?![\p{L}\p{N}_])/giu, '$1 lít');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*°C(?![\p{L}\p{N}_])/giu, '$1 độ C');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*°F(?![\p{L}\p{N}_])/giu, '$1 độ F');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*inch(?![\p{L}\p{N}_])/giu, '$1 inch');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*%(?![\p{L}\p{N}_])/gu, '$1 phần trăm');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*GB(?![\p{L}\p{N}_])/giu, '$1 gi-ga-bai');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*MB(?![\p{L}\p{N}_])/giu, '$1 mê-ga-bai');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*KB(?![\p{L}\p{N}_])/giu, '$1 ki-lô-bai');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*TB(?![\p{L}\p{N}_])/giu, '$1 tê-ra-bai');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*GHz(?![\p{L}\p{N}_])/giu, '$1 gi-ga-héc');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*MHz(?![\p{L}\p{N}_])/giu, '$1 mê-ga-héc');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*kHz(?![\p{L}\p{N}_])/giu, '$1 ki-lô-héc');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*Hz(?![\p{L}\p{N}_])/giu, '$1 héc');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*W(?![\p{L}\p{N}_])/gu, '$1 oát');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*kW(?![\p{L}\p{N}_])/giu, '$1 ki-lô-oát');
  s = s.replace(/(?<![\p{L}\p{N}_])(\d+(?:[,\.]\d+)?)\s*V(?![\p{L}\p{N}_])/gu, '$1 vôn');

  // Tỷ lệ / Đổi trả / Giờ
  s = s.replace(/(?<![\p{L}\p{N}_])1\/1(?![\p{L}\p{N}_])/gu, 'một đổi một');
  s = s.replace(/(?<![\p{L}\p{N}_])1-1(?![\p{L}\p{N}_])/gu, 'một đổi một');
  s = s.replace(/(?<![\p{L}\p{N}_])24\/7(?![\p{L}\p{N}_])/gu, 'hai mươi tư trên bảy phục vụ suốt ngày đêm');
  s = s.replace(/(?<![\p{L}\p{N}_])24\/24(?![\p{L}\p{N}_])/gu, 'hai mươi tư trên hai mươi tư');

  // Ngày tháng năm: 16/09/2026 -> ngày 16 tháng 9 năm 2026
  s = s.replace(/(?<![\p{L}\p{N}_])(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?![\p{L}\p{N}_])/gu, (m, d, mo, y) => {
    return `ngày ${d} tháng ${mo} năm ${y}`;
  });

  return s;
}

// 6. LÀM SẠCH KÝ HIỆU TRÌNH BÀY & HASHTAG / MENTION / EMOJI
export function cleanUserNameForSpeech(rawName) {
  if (!rawName || typeof rawName !== 'string') return 'bạn';
  let name = rawName.trim();
  
  // Loại bỏ @, dấu chấm, gạch dưới ở đầu/cuối
  name = name.replace(/^[@#\._\-]+/, '').replace(/[\._\-]+$/, '').trim();
  
  // Nếu rỗng hoặc chỉ có 1 ký tự (vd: 'N', 'n', 'A', 'T', 'x') -> quy về 'bạn'
  if (!name || name.length <= 1) return 'bạn';
  
  // Nếu là username mặc định kiểu tiktok user (user123456, id888, live_user...) -> 'bạn'
  if (/^(?:user|tiktok|tiktokuser|id|khach|viewer|member|account)[\d_]*$/i.test(name)) {
    return 'bạn';
  }
  
  // Nếu chỉ toàn chữ số hoặc ký tự đặc biệt -> 'bạn'
  if (/^[\d\W_]+$/.test(name)) {
    return 'bạn';
  }
  
  // Nếu đã có tiền tố xưng hô (bạn/anh/chị/em...)
  if (/^(?:bạn|anh|chị|em|cô|chú|bác|quý khách|khách hàng)\s+/i.test(name)) {
    const sub = name.replace(/^(?:bạn|anh|chị|em|cô|chú|bác|quý khách|khách hàng)\s+/i, '').trim();
    if (sub.length <= 1) return 'bạn';
    return name;
  }
  
  // Cắt bớt đuôi số ngẫu nhiên quá dài (vd: "hoanglong9827364" -> "hoanglong")
  name = name.replace(/\d{4,}$/, '').trim();
  if (name.length <= 1) return 'bạn';
  
  return name;
}

export function cleanSpokenPunctuation(text) {
  if (!text) return '';
  let s = text;

  // Loại bỏ các ký tự vô hình, zero-width, non-breaking spaces gây đứt gãy âm
  s = s.replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u00A0\u202F\u180E\u2000-\u200A]/g, ' ');

  // Loại bỏ chỉ dẫn kịch bản trong ngoặc
  s = s.replace(/\((?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\)]*\)/gi, ' ');
  s = s.replace(/\[(?:cười|cười tươi|vỗ tay|hành động|chỉ tay|nháy mắt|nói to|nói nhỏ|thì thầm|hào hứng|nhấn mạnh|chỉ giỏ hàng|chốt đơn|đếm ngược|action|smile|clap)[^\]]*\]/gi, ' ');

  // Hashtag #AI -> AI
  s = s.replace(/#([\p{L}\d_]+)/gu, '$1');

  // Mention @username -> bạn hoặc tên user chuẩn hóa
  s = s.replace(/@([\p{L}\d_\.]+)/gu, (match, p1) => {
    const cleaned = cleanUserNameForSpeech(p1);
    return cleaned === 'bạn' ? 'bạn' : `bạn ${cleaned}`;
  });

  // Loại bỏ các ký tự Markdown & dấu ngoặc kép trích dẫn làm ngập ngừng voice
  s = s.replace(/[*_~`"'\u201C\u201D\u2018\u2019\u00AB\u00BB\u201E]/g, '');

  // Loại bỏ hoàn toàn emoji để không đọc thành tên emoji (vd: 'mặt cười', 'ngọn lửa', 'mặt thèm ăn')
  s = s.replace(/\p{Extended_Pictographic}/gu, '');
  s = s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1FA00}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, '');

  // Chuẩn hóa dấu câu: thay thế dấu chấm lửng ..., … bằng khoảng trắng mềm mại, không ngắt câu
  s = s.replace(/[…]+/g, ' ');
  s = s.replace(/\.{2,}/g, ' ');
  s = s.replace(/!{2,}/g, '! ');
  s = s.replace(/\?{2,}/g, '? ');
  s = s.replace(/[;:]+/g, ' ');
  s = s.replace(/,\s*,+/g, ', ');
  // Chuẩn hóa khoảng trắng nhưng bảo toàn tuyệt đối ngắt dòng (\r, \n) cho kịch bản nhiều câu
  s = s.replace(/[^\S\r\n]+/g, ' ');

  return s;
}

// 7. PIPELINE CHUẨN HÓA MASTER PHÁT ÂM TIẾNG VIỆT ĐỈNH CAO
export function masterNormalizeVietnameseSpeech(rawText, options = {}) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText.trim();
  if (!text) return '';

  // 1. Unicode Normalization (NFC chuẩn tiếng Việt)
  text = text.normalize('NFC');

  // 2. Làm sạch ký hiệu trình bày
  text = cleanSpokenPunctuation(text);

  // 3. Tra cứu từ điển phát âm thương hiệu & thuật ngữ công nghệ (Bảo tồn chữ hoa)
  for (const item of PRONUNCIATION_DICTIONARY) {
    if (typeof item.replacement === 'function') {
      text = text.replace(item.pattern, item.replacement);
    } else {
      text = text.replace(item.pattern, (match) => {
        if (match && match[0] === match[0].toUpperCase() && item.replacement && item.replacement[0] !== item.replacement[0].toUpperCase()) {
          return item.replacement[0].toUpperCase() + item.replacement.slice(1);
        }
        return item.replacement;
      });
    }
  }

  // 4. Tra cứu từ điển viết tắt tiếng Việt
  for (const item of VIETNAMESE_ABBREVIATIONS) {
    if (typeof item.replacement === 'function') {
      text = text.replace(item.pattern, item.replacement);
    } else {
      text = text.replace(item.pattern, (match) => {
        if (match && match[0] === match[0].toUpperCase() && item.replacement && item.replacement[0] !== item.replacement[0].toUpperCase()) {
          return item.replacement[0].toUpperCase() + item.replacement.slice(1);
        }
        return item.replacement;
      });
    }
  }

  // 5. Chuẩn hóa tiền tệ, số, đơn vị đo
  text = normalizeCurrenciesAndUnits(text);

  // 6. Số điện thoại (nếu có chuỗi 10-11 số đứng riêng)
  text = text.replace(/\b(0\d{9,10})\b/g, (m, p1) => normalizePhoneNumber(p1));

  // 7. Mã OTP
  text = text.replace(/\bOTP\s*(\d{4,6})\b/gi, (m, code) => {
    const spelled = code.split('').map(d => DIGIT_WORDS[d]).join(' ');
    return `mã O-T-P là ${spelled}`;
  });

  // 8. Định dạng dấu câu và khoảng trắng
  text = text.replace(/[^\S\r\n]+/g, ' ');
  text = text.replace(/\s+([,\.!?:;])/g, '$1');
  text = text.replace(/([,\.!?:;])(?!\s|$)/g, '$1 ');

  return text.trim();
}

// 8. BỘ LỌC BÌNH LUẬN THÔNG MINH (SMART COMMENT FILTER & ANTI-SPAM / ANTI-TOXICITY)
const TOXIC_PATTERNS = [
  /\b(lừa đảo|scam|đm|đkm|vcl|vcll|clmm|đmm|dmm|cc|đéo|mẹ mày|bố mày|súc vật|chó đẻ|ngu|óc chó|chó cắn|bố láo|mất dạy|cút|hãm l|thằng điên|con điên)\b/i,
  /\b(cờ bạc|tài xỉu|casino|nhà cái|lô đề|soi cầu|kèo bóng|vay tiền|bốc bát họ|bắn cá|nổ hũ)\b/i
];

export function isSmartSpamOrToxicComment(commentText) {
  if (!commentText || typeof commentText !== 'string') return { isFiltered: true, reason: 'empty' };
  const text = commentText.trim();
  if (text.length === 0) return { isFiltered: true, reason: 'empty' };

  // 1. Quá ngắn vô nghĩa (< 2 ký tự và chỉ gồm ký hiệu)
  if (text.length <= 2 && /^[\d\W_]+$/.test(text)) {
    return { isFiltered: true, reason: 'too_short_gibberish' };
  }

  // 2. Lặp ký tự vô nghĩa (vd: aaaaaaaa, 111111111, ???????, .......)
  if (/([a-zA-Z0-9\W_])\1{5,}/.test(text)) {
    return { isFiltered: true, reason: 'repetitive_spam' };
  }

  // 3. Kiểm tra từ ngữ thô tục / cờ bạc / lừa đảo
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(text)) {
      return { isFiltered: true, reason: 'toxic_or_gambling' };
    }
  }

  // 4. Toàn bộ là icon/emoji không có chữ
  const withoutEmojis = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\s\.,!?]/gu, '');
  if (withoutEmojis.length === 0 && text.length > 0) {
    return { isFiltered: true, reason: 'emoji_only_spam' };
  }

  return { isFiltered: false, cleanText: text };
}

/**
 * 🎯 NHẬN DIỆN BÌNH LUẬN THỰC SỰ CÓ Ý NGHĨA / LIÊN QUAN ĐẾN SẢN PHẨM & BÁN HÀNG
 * - Bỏ qua các câu sáo rỗng vô thưởng vô phạt ("hi", "hello", "123", "chấm", "ok"...)
 * - Chỉ ưu tiên ngắt kịch bản để trả lời khi có câu hỏi về: giá cả, tư vấn, đặt hàng, khuyến mãi, chất lượng, bảo hành.
 */
export function isMeaningfulCommercialOrEngagingComment(commentText) {
  if (!commentText || typeof commentText !== 'string') return false;
  const clean = commentText.trim().toLowerCase();
  if (clean.length < 2) return false;

  // 1. Bình luận sáo rỗng / spam đơn thuần
  const shallowPatterns = [
    /^(hi|hello|helo|chào|chao|alo|xin chào|2|hí|hii|hiii|chấm|\.|\.\.|\.\.\.|1|123|ok|oke|okee|oki|hay|xinh|đẹp|quá|tuyệt|tuyệt vời|thả tim|tym|top|fl|follow|haha|huhu|kkk|kkkk)$/i
  ];
  for (const p of shallowPatterns) {
    if (p.test(clean)) return false;
  }

  // 2. Bình luận chứa từ khóa thương mại, sản phẩm, bán hàng, bảo hành, giá cả
  const commercialPatterns = [
    /giá|bao nhiêu|nhiêu|tiền|chi phí|cost|price|sale|ưu đãi|khuyến mãi|km|voucher|mã giảm/,
    /mua|đặt|chốt|order|ship|giao hàng|vận chuyển|freeship|lấy|gửi/,
    /bảo hành|đổi trả|chính hãng|auth|real|xuất xứ|nguồn gốc|ở đâu|địa chỉ/,
    /tính năng|chức năng|cách dùng|sử dụng|công dụng|hiệu quả|thành phần|chất liệu|bánh|bánh gạo/,
    /size|kích thước|màu|mẫu|loại|còn không|còn hàng|hết hàng|hết chưa/,
    /tư vấn|hỗ trợ|shop ơi|shop cho mình hỏi|cho hỏi|\?|được không|có không|như thế nào/
  ];

  for (const p of commercialPatterns) {
    if (p.test(clean)) return true;
  }

  // 3. Câu hỏi hoặc tương tác thật có độ dài đủ lớn
  if (clean.length >= 12 && !/^[\d\W_]+$/.test(clean)) {
    return true;
  }

  return false;
}
