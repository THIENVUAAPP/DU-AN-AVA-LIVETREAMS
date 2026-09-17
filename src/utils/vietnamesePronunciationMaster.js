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
  // Thương hiệu độc quyền AvaLive
  { pattern: /\b(AVA\s*LIVE\s*PRO|AVALIVEPRO)\b/gi, replacement: 'Ava Live Pro' },
  { pattern: /\b(AVA\s*LIVE|AVALIVE)\b/gi, replacement: 'Ava Live' },
  { pattern: /\b(THIEN\s*VUA\s*APP|THIENVUAAPP)\b/gi, replacement: 'Thiên Vua App' },
  
  // Nền tảng mạng xã hội & Livestream (Phát âm chuẩn xác, không dùng tiếng lóng làm sai lệch từ ngữ)
  { pattern: /\b(TikTok\s*Live\s*Studio|Tik\s*Tok\s*Live\s*Studio)\b/gi, replacement: 'TikTok Live Studio' },
  { pattern: /\b(TikTok\s*Shop|Tik\s*Tok\s*Shop)\b/gi, replacement: 'TikTok Shop' },
  { pattern: /\b(TikTok|Tik\s*Tok)\b/gi, replacement: 'TikTok' },
  { pattern: /\b(Facebook\s*Live|FB\s*Live)\b/gi, replacement: 'Facebook Live' },
  { pattern: /\b(Facebook|FB)\b/gi, replacement: 'Facebook' },
  { pattern: /\b(YouTube|Youtube|YT)\b/gi, replacement: 'YouTube' },
  { pattern: /\b(Shopee\s*Live)\b/gi, replacement: 'Shopee Live' },
  { pattern: /\b(Shopee)\b/gi, replacement: 'Shopee' },
  { pattern: /\b(Lazada)\b/gi, replacement: 'Lazada' },
  { pattern: /\b(Zalo)\b/gi, replacement: 'Zalo' },
  { pattern: /\b(OBS\s*Studio|OBS)\b/gi, replacement: 'OBS Studio' },

  // Thuật ngữ AI & Công nghệ
  { pattern: /\bAI\b/g, replacement: 'AI' },
  { pattern: /\bTTS\b/g, replacement: 'TTS' },
  { pattern: /\bAPI\b/g, replacement: 'API' },
  { pattern: /\bUI\b/g, replacement: 'giao diện' },
  { pattern: /\bUX\b/g, replacement: 'trải nghiệm' },
  { pattern: /\bCRM\b/g, replacement: 'CRM' },
  { pattern: /\bERP\b/g, replacement: 'ERP' },
  { pattern: /\bSaaS\b/gi, replacement: 'phần mềm dịch vụ' },
  { pattern: /\bKOL\b/g, replacement: 'KOL' },
  { pattern: /\bKOC\b/g, replacement: 'KOC' },
  { pattern: /\bCEO\b/g, replacement: 'CEO' },
  { pattern: /\bCTO\b/g, replacement: 'CTO' },
  { pattern: /\bOTP\b/gi, replacement: 'OTP' },
  { pattern: /\bSKU\b/gi, replacement: 'mã sản phẩm' },
  { pattern: /\bID\b/g, replacement: 'mã số' },
  { pattern: /\bPK\b/g, replacement: 'PK' },
  { pattern: /\bPRO\b/gi, replacement: 'Pro' },
  { pattern: /\bVIP\b/gi, replacement: 'VIP' },
  { pattern: /\bLIP-?SYNC\b/gi, replacement: 'khớp khẩu hình' },
  { pattern: /\bAVATAR\b/gi, replacement: 'Avatar' },
  { pattern: /\bLIVESTREAM\b/gi, replacement: 'livestream' },
  { pattern: /\bLIVE\s*STREAM\b/gi, replacement: 'livestream' },
  { pattern: /\bSTREAM\b/gi, replacement: 'stream' },
  { pattern: /\bSTREAMER\b/gi, replacement: 'streamer' },
  { pattern: /\bFEEDBACK\b/gi, replacement: 'phản hồi' },
  { pattern: /\bREVIEW\b/gi, replacement: 'đánh giá' },
  { pattern: /\bFREESHIP\b/gi, replacement: 'miễn phí giao hàng' },
  { pattern: /\bFREE\s*SHIP\b/gi, replacement: 'miễn phí giao hàng' },
  { pattern: /\bFLASH\s*SALE\b/gi, replacement: 'giảm giá chớp nhoáng' },
  { pattern: /\bSALE\b/gi, replacement: 'giảm giá' },
  { pattern: /\bDEAL\b/gi, replacement: 'ưu đãi' },
  { pattern: /\bCOMBO\b/gi, replacement: 'combo' },
  { pattern: /\bHOT\s*TREND\b/gi, replacement: 'xu hướng' },
  { pattern: /\bTREND\b/gi, replacement: 'xu hướng' },
  { pattern: /\bVOUCHER\b/gi, replacement: 'phiếu giảm giá' },
  { pattern: /\bORDER\b/gi, replacement: 'đặt hàng' },
  { pattern: /\bSERUM\b/gi, replacement: 'serum' },
  { pattern: /\bSKINCARE\b/gi, replacement: 'chăm sóc da' },
  { pattern: /\bAPP\b/gi, replacement: 'ứng dụng' },
  { pattern: /\bWEBSITE\b/gi, replacement: 'trang web' },
  { pattern: /\bWEB\b/gi, replacement: 'trang web' },
  { pattern: /\bLINK\b/gi, replacement: 'đường link' },
  { pattern: /\bFPS\b/gi, replacement: 'khung hình trên giây' },
  { pattern: /\b4K\b/gi, replacement: 'bốn ca siêu nét' },
  { pattern: /\b8K\b/gi, replacement: 'tám ca siêu nét' },
  { pattern: /\b1080P\b/gi, replacement: 'full HD 1080p' },
  { pattern: /\b720P\b/gi, replacement: '720p' }
];

// 2. TỪ ĐIỂN TỪ VIẾT TẮT TIẾNG VIỆT
export const VIETNAMESE_ABBREVIATIONS = [
  { pattern: /\bsp\b/gi, replacement: 'sản phẩm' },
  { pattern: /\bđc\b/gi, replacement: 'được' },
  { pattern: /\bdc\b/gi, replacement: 'được' },
  { pattern: /\bko\b/gi, replacement: 'không' },
  { pattern: /\bk\b/gi, replacement: 'không' },
  { pattern: /\bkhg\b/gi, replacement: 'không' },
  { pattern: /\bkh\b/gi, replacement: 'không' },
  { pattern: /\bmn\b/gi, replacement: 'mọi người' },
  { pattern: /\bmng\b/gi, replacement: 'mọi người' },
  { pattern: /\bsz\b/gi, replacement: 'size' },
  { pattern: /\bstk\b/gi, replacement: 'số tài khoản' },
  { pattern: /\bcod\b/gi, replacement: 'nhận hàng thanh toán C-O-D' },
  { pattern: /\bbtv\b/gi, replacement: 'biên tập viên' },
  { pattern: /\bmc\b/gi, replacement: 'người dẫn chương trình' },
  { pattern: /\bvtv\b/gi, replacement: 'đài truyền hình' },
  { pattern: /\bkm\b/gi, replacement: 'khuyến mãi' },
  { pattern: /\bhsd\b/gi, replacement: 'hạn sử dụng' },
  { pattern: /\bnsx\b/gi, replacement: 'ngày sản xuất' },
  { pattern: /\bnv\b/gi, replacement: 'nhân viên' },
  { pattern: /\blh\b/gi, replacement: 'liên hệ' },
  { pattern: /\btp\b/gi, replacement: 'thành phố' },
  { pattern: /\bhcm\b/gi, replacement: 'Hồ Chí Minh' },
  { pattern: /\bhn\b/gi, replacement: 'Hà Nội' },
  { pattern: /\bib\b/gi, replacement: 'nhắn tin trực tiếp' },
  { pattern: /\binbox\b/gi, replacement: 'nhắn tin trực tiếp' },
  { pattern: /\bcmt\b/gi, replacement: 'bình luận' },
  { pattern: /\bcomment\b/gi, replacement: 'bình luận' },
  { pattern: /\bauth\b/gi, replacement: 'chính hãng chuẩn gốc' },
  { pattern: /\breal\b/gi, replacement: 'hàng thật chính hãng' },
  { pattern: /\bsetup\b/gi, replacement: 'cài đặt' },
  { pattern: /\bok\b/gi, replacement: 'dạ vâng được ạ' },
  { pattern: /\bokay\b/gi, replacement: 'dạ vâng được ạ' },
  { pattern: /\bts\.\b/gi, replacement: 'Tiến sĩ ' },
  { pattern: /\bbs\.\b/gi, replacement: 'Bác sĩ ' },
  { pattern: /\bpgs\.ts\.\b/gi, replacement: 'Phó Giáo sư Tiến sĩ ' },
  { pattern: /\bthcs\b/gi, replacement: 'trung học cơ sở' },
  { pattern: /\bthpt\b/gi, replacement: 'trung học phổ thông' },
  { pattern: /\bđh\b/gi, replacement: 'đại học' }
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

// 5. CHUẨN HÓA TIỀN TỆ & ĐƠN VỊ ĐO LƯỜNG
export function normalizeCurrenciesAndUnits(text) {
  if (!text) return '';
  let s = text;

  // Tiền tệ có dấu chấm phân cách hàng nghìn/triệu
  s = s.replace(/\b(\d{1,3}(?:\.\d{3})+)\s*(?:đ|vnd|vnđ|đồng)\b/gi, (match, p1) => {
    const rawNum = parseInt(p1.replace(/\./g, ''), 10);
    return `${numberToVietnameseWords(rawNum)} đồng`;
  });

  // Tiền tệ có dấu phẩy: 1,000,000đ
  s = s.replace(/\b(\d{1,3}(?:,\d{3})+)\s*(?:đ|vnd|vnđ|đồng)\b/gi, (match, p1) => {
    const rawNum = parseInt(p1.replace(/,/g, ''), 10);
    return `${numberToVietnameseWords(rawNum)} đồng`;
  });

  // Số k / cành / củ / tr / triệu
  s = s.replace(/\b(\d+)\s*k\b/gi, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} nghìn đồng`);
  s = s.replace(/\b(\d+)\s*cành\b/gi, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} nghìn đồng`);
  s = s.replace(/\b(\d+)\s*củ\b/gi, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu đồng`);
  s = s.replace(/\b(\d+)\s*(?:tr|triệu)\b/gi, (m, p1) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu đồng`);
  s = s.replace(/\b(\d+)[,\.](\d+)\s*(?:tr|triệu)\b/gi, (m, p1, p2) => `${numberToVietnameseWords(parseInt(p1, 10))} triệu ${numberToVietnameseWords(parseInt(p2, 10))} trăm nghìn đồng`);

  // Tiền tệ quốc tế
  s = s.replace(/\$(\d+(?:\.\d+)?)/g, (m, p1) => `${p1} đô la`);
  s = s.replace(/(\d+(?:\.\d+)?)\s*(?:usd|\$)/gi, (m, p1) => `${p1} đô la`);
  s = s.replace(/€(\d+(?:\.\d+)?)/g, (m, p1) => `${p1} ơ-rô`);
  s = s.replace(/(\d+(?:\.\d+)?)\s*(?:eur|€)/gi, (m, p1) => `${p1} ơ-rô`);

  // Đơn vị đo lường
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*kg\b/gi, '$1 ki-lô-gam');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*g\b/gi, '$1 gam');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*mg\b/gi, '$1 mi-li-gam');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*km\b/gi, '$1 ki-lô-mét');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*m\b/gi, '$1 mét');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*cm\b/gi, '$1 xen-ti-mét');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*mm\b/gi, '$1 mi-li-mét');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*ml\b/gi, '$1 mi-li-lít');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*l\b/gi, '$1 lít');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*°C\b/gi, '$1 độ C');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*°F\b/gi, '$1 độ F');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*inch\b/gi, '$1 inch');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*%\b/g, '$1 phần trăm');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*GB\b/gi, '$1 gi-ga-bai');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*MB\b/gi, '$1 mê-ga-bai');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*KB\b/gi, '$1 ki-lô-bai');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*TB\b/gi, '$1 tê-ra-bai');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*GHz\b/gi, '$1 gi-ga-héc');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*MHz\b/gi, '$1 mê-ga-héc');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*kHz\b/gi, '$1 ki-lô-héc');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*Hz\b/gi, '$1 héc');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*W\b/g, '$1 oát');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*kW\b/gi, '$1 ki-lô-oát');
  s = s.replace(/\b(\d+(?:[,\.]\d+)?)\s*V\b/g, '$1 vôn');

  // Tỷ lệ / Đổi trả / Giờ
  s = s.replace(/\b1\/1\b/g, 'một đổi một');
  s = s.replace(/\b1-1\b/g, 'một đổi một');
  s = s.replace(/\b24\/7\b/g, 'hai mươi tư trên bảy phục vụ suốt ngày đêm');
  s = s.replace(/\b24\/24\b/g, 'hai mươi tư trên hai mươi tư');

  // Ngày tháng năm: 16/09/2026 -> ngày 16 tháng 9 năm 2026
  s = s.replace(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g, (m, d, mo, y) => {
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

  // Loại bỏ các ký tự Markdown
  s = s.replace(/[*_~`]/g, '');

  // Loại bỏ emoji để không đọc thành tên emoji (vd: 'mặt cười', 'ngọn lửa')
  s = s.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  // Chuẩn hóa dấu câu lặp
  s = s.replace(/!{2,}/g, '!');
  s = s.replace(/\?{2,}/g, '?');
  s = s.replace(/\.{2,}/g, '...');
  s = s.replace(/,\s*,+/g, ', ');

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

  // 3. Tra cứu từ điển phát âm thương hiệu & thuật ngữ công nghệ
  for (const item of PRONUNCIATION_DICTIONARY) {
    text = text.replace(item.pattern, item.replacement);
  }

  // 4. Tra cứu từ điển viết tắt tiếng Việt
  for (const item of VIETNAMESE_ABBREVIATIONS) {
    text = text.replace(item.pattern, item.replacement);
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

  // 8. LOẠI BỎ TRIỆT ĐỂ LỖI XƯNG HÔ CHỮ CÁI ĐƠN KIỂU "Bạn N", "Bạn En-nờ", "Anh T", "Chị H"
  text = text.replace(/\b(bạn|anh|chị|em|cô|chú|bác|đại gia|khách hàng)\s+[A-Za-z]\b/gi, '$1');
  text = text.replace(/\b(bạn|anh|chị|em|cô|chú|bác|đại gia|khách hàng)\s+(?:En-nờ|Tê|Hát|Vê|Xê|Đê|Ít|Y-dài|Dê|Ca|Em-mờ|Quy)\b/gi, '$1');
  text = text.replace(/\b(bạn)\s+bạn\b/gi, 'bạn');

  // 9. Định dạng dấu câu và khoảng trắng
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
