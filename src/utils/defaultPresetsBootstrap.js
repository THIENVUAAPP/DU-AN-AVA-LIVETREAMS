/**
 * 👑 DEFAULT PRESETS BOOTSTRAP FOR AVALIVE STUDIO
 * Đảm bảo khi người dùng tải phần mềm về giải nén lần đầu tiên,
 * tất cả: BỘ NÃO AI, KỊCH BẢN 1-CHẠM, CẤU HÌNH VOICE, SỰ KIỆN LIVE IDOL
 * đều được nạp sẵn 100% chuyên nghiệp và đầy đủ nhất!
 */

export const DEFAULT_BRAIN_PACKS = [
  {
    id: 'sales',
    name: 'Bán Hàng & Chốt Sale Đỉnh Cao',
    icon: '🛒',
    desc: 'Chuyên gia livestream bán hàng thời trang, mỹ phẩm, công nghệ, chốt đơn thần tốc.',
    prompt: `Bạn là một chuyên gia Livestream Bán Hàng & Chốt Đơn hàng đầu Việt Nam.
Tính cách: Năng lượng đỉnh cao, hoạt ngôn, đáng tin cậy, hài hước, kích thích khách hàng hành động ngay.
Sản phẩm chính: Phần mềm AvaLive Studio VIP PRO (Giá ưu đãi 3.500.000đ/năm, gói dùng thử 500.000đ/tháng).
Quy tắc:
1. Luôn kêu gọi khách hàng bấm vào giỏ hàng góc trái màn hình để săn deal sốc.
2. Trả lời bình luận ngắn gọn, súc tích (1-2 câu), lồng ghép câu giục chốt đơn khéo léo.
3. Luôn cảm ơn nồng nhiệt khi có người tặng quà, thả tim, hoặc follow kênh.`
  },
  {
    id: 'talk',
    name: 'Tương Tác & Trò Chuyện Duyên Dáng',
    icon: '💬',
    desc: 'Idol giao lưu hài hước, duyên dáng, giữ chân người xem ở lại livestream cực lâu.',
    prompt: `Bạn là một Nữ Streamer / AI Idol vô cùng xinh đẹp, duyên dáng và đáng yêu.
Tính cách: Vui vẻ, ngọt ngào, lễ phép, nói chuyện dí dỏm, luôn biết cách quan tâm khán giả.
Nhiệm vụ: Giao lưu với mọi người, giải đáp thắc mắc, hỏi thăm công việc, cuộc sống của người xem, kêu gọi mọi người thả tim và trò chuyện cùng bạn.
Phản hồi tự nhiên như một streamer người thật, xưng hô 'em' và gọi người xem là 'anh/chị' hoặc 'cả nhà'.`
  },
  {
    id: 'dance',
    name: 'Idol Nhảy & Cổ Vũ Tặng Quà',
    icon: '💃',
    desc: 'Idol biểu diễn vũ đạo sôi động, cảm ơn quà tặng PK đại chiến kịch tính.',
    prompt: `Bạn là một Vũ Công / Idol Nhảy chuyên nghiệp đang biểu diễn trên livestream.
Tính cách: Năng lượng bùng nổ, quyến rũ, cực kỳ phấn khích khi nhận quà tặng và tim.
Nhiệm vụ: Kêu gọi fan hâm mộ bắn tim, tặng quà hoa hồng, vương miện, pháo hoa để mở khóa các điệu nhảy và màn trình diễn đỉnh cao hơn.`
  },
  {
    id: 'sing',
    name: 'Idol Ca Sĩ & Giao Lưu Âm Nhạc',
    icon: '🎤',
    desc: 'Idol ca sĩ hát live, giao lưu âm nhạc, nhận yêu cầu bài hát từ người xem.',
    prompt: `Bạn là một Ca Sĩ / Idol Âm Nhạc tài năng đang hát live giao lưu cùng khán giả.
Tính cách: Giọng nói truyền cảm, ấm áp, đam mê âm nhạc, biết lắng nghe.
Nhiệm vụ: Hát các đoạn nhạc ngắn, giao lưu về các ca khúc hot trend, cảm ơn khán giả đã yêu thương và ủng hộ giọng hát của bạn.`
  }
];

export const DEFAULT_PRESET_SCRIPTS = [
  {
    category: '🛍️ Giục Chốt Đơn / Flash Sale',
    items: [
      'Mọi người nhanh tay bấm vào giỏ hàng góc trái màn hình nhé, deal sốc này bên em chỉ còn đúng 5 suất ưu đãi cuối cùng thôi ạ!',
      'Dạ chỉ còn đúng 2 phút cuối cùng trước khi sản phẩm quay trở về giá gốc, các tình yêu tranh thủ chốt ngay nhé!',
      'Anh chị em đặt hàng nhớ bấm áp mã voucher giảm thêm 50k của shop ngay trong giỏ hàng để được giá tốt nhất nha!',
      'Kho vừa báo về chỉ còn đúng 3 bộ duy nhất cho size L, ai bấm mua trước em ưu tiên xuất kho trước nha!'
    ]
  },
  {
    category: '🎁 Cảm Ơn Quà Tặng & Follower',
    items: [
      'Em cảm ơn bạn đã gửi tặng hoa hồng cho em nhé! Chúc bạn và gia đình có một ngày thật nhiều niềm vui và may mắn!',
      'Cảm ơn cả nhà đã ghé xem livestream! Mọi người đừng quên nhấn follow kênh và thả tim giúp em lên 50.000 tim nha!',
      'Dạ em cảm ơn anh chị VIP đã ghé thăm phòng live hôm nay, chúc mọi người săn được thật nhiều deal hời ạ!'
    ]
  },
  {
    category: '👋 Chào Đón & Tư Vấn Khách Hàng',
    items: [
      'Dạ em chào tất cả anh chị mới vừa vào phòng live nha! Hôm nay shop em đang xả kho toàn bộ mã hot với giá sỉ cực sốc đó ạ!',
      'Mọi người đang quan tâm mẫu nào cứ bình luận chiều cao cân nặng xuống dưới, em sẽ tư vấn chọn size chuẩn chỉnh ngay cho mình nhé!',
      'Sản phẩm bên em cam kết bảo hành 12 tháng, lỗi 1 đổi 1 tận nhà hoàn toàn miễn phí nên mọi người yên tâm đặt hàng nha!'
    ]
  },
  {
    category: '⚠️ Nhắc Nhở & Xử Lý Khẩn Cấp',
    items: [
      'Mọi người tương tác văn minh lịch sự giúp em nha, những bình luận spam hoặc tiêu cực hệ thống bên em sẽ tự động lọc bỏ ạ.',
      'Đường truyền mạng vừa được bên em ổn định lại rồi ạ, cảm ơn mọi người đã kiên nhẫn đồng hành cùng em trong phiên live nha!',
      'Lưu ý mọi người chỉ đặt hàng qua giỏ hàng chính thức trên livestream để tránh trường hợp bị lừa đảo giả mạo shop ạ!'
    ]
  }
];

export const DEFAULT_SOUNDBOARD = [
  { title: 'Chốt đơn thành công', text: 'Cảm ơn quý khách đã chốt đơn thành công! Shop sẽ đóng gói và gửi đi ngay hôm nay ạ.' },
  { title: 'Tặng kèm quà VIP', text: 'Duy nhất trên phiên live này, khách đặt hàng sẽ được tặng kèm phần quà VIP từ shop nha!' },
  { title: 'Kêu gọi thả tim', text: 'Cả nhà ơi bấm liên tục vào màn hình để thả tim giúp em tăng tương tác nha!' },
  { title: 'Số lượng có hạn', text: 'Mẫu này bên em hiện tại kho chỉ còn đúng 3 chiếc thôi, ai nhanh tay thì còn nha!' },
  { title: 'Freeship toàn quốc', text: 'Duy nhất trong 10 phút tới, shop em hỗ trợ miễn phí vận chuyển toàn quốc cho tất cả đơn hàng!' },
  { title: 'Bảo hành 1 đổi 1', text: 'Cam kết hàng chính hãng 100%, nhận hàng kiểm tra ưng ý mới thanh toán ạ!' }
];

export function bootstrapDefaultPresets() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Nạp Bộ Não AI mặc định nếu chưa có
    if (!localStorage.getItem('aidol_custom_brains')) {
      localStorage.setItem('aidol_custom_brains', JSON.stringify(DEFAULT_BRAIN_PACKS));
    }
    DEFAULT_BRAIN_PACKS.forEach(b => {
      const key = `aidol_prompt_${b.id}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, b.prompt);
      }
    });

    // 2. Nạp Kịch Bản 1-chạm mặc định nếu chưa có
    if (!localStorage.getItem('aidol_custom_preset_scripts')) {
      localStorage.setItem('aidol_custom_preset_scripts', JSON.stringify(DEFAULT_PRESET_SCRIPTS));
      localStorage.setItem('aidol_custom_preset_scripts_backup', JSON.stringify(DEFAULT_PRESET_SCRIPTS));
    }

    // 3. Nạp Bảng Voice Soundboard mặc định nếu chưa có
    if (!localStorage.getItem('aidol_custom_voice_soundboard')) {
      localStorage.setItem('aidol_custom_voice_soundboard', JSON.stringify(DEFAULT_SOUNDBOARD));
      localStorage.setItem('aidol_custom_voice_soundboard_backup', JSON.stringify(DEFAULT_SOUNDBOARD));
    }

    // 4. Nạp Cấu hình Sự kiện & Kịch bản Chốt đơn mặc định nếu chưa có
    if (!localStorage.getItem('aidol_event_configs')) {
      const defaultEventConfigs = {
        checkout: {
          priority: 100,
          active: true,
          useVoice: true,
          muteSourceVideo: true,
          videoCategory: 'checkout',
          useAi: true,
          checkoutProducts: [
            {
              id: 1,
              active: true,
              productName: 'AVA LIVE',
              keywords: 'ava live;ava;phần mềm ava live;phần mềm livestream ai;livestream ai;livestream bằng ai;nhân vật',
              videoFolder: 'bình luận',
              supportVideoFolder: '',
              useAi: true,
              useTTS: true,
              ttsVoiceRole: 'comment',
              muteSourceVideo: true,
              aiPrompt: 'Bạn đang đóng vai NGỌC NHI – một nữ AI Sales Host 24 tuổi, chuyên nghiệp, thông minh, thân thiện, duyên dáng, hài hước vừa phải và có khả năng tư vấn bán hàng tự nhiên.'
            }
          ]
        },
        comment: {
          priority: 50,
          active: true,
          useVoice: true,
          muteSourceVideo: true,
          videoCategory: 'comment',
          useAi: true,
          aiPrompt: '### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user} ngắn gọn, thông minh, lịch sự và thu hút.',
          sampleAnswers: 'Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.',
          assistantPrompt: 'A, có bạn {user} vừa mới bình luận là: {comment}'
        },
        gift: {
          priority: 90,
          active: true,
          useVoice: true,
          muteSourceVideo: false,
          videoCategory: 'gift',
          useAi: true,
          aiPrompt: 'Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo và chân thành tới {user} vì đã tặng {gift_name}.'
        },
        follow: {
          priority: 70,
          active: true,
          useVoice: true,
          muteSourceVideo: true,
          videoCategory: 'follow',
          useAi: true,
          aiPrompt: 'Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.',
          sampleAnswers: 'A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!'
        },
        welcome: {
          priority: 60,
          active: true,
          useVoice: false,
          muteSourceVideo: false,
          videoCategory: 'join',
          sampleAnswers: 'Chào mừng bạn {user} và {count} người mới đã đến với livestream!\nXin chào {user} và mọi người mới vào xem nhé! Chúc mọi người xem live vui vẻ.'
        },
        apology: {
          priority: 20,
          active: true,
          useVoice: true,
          muteSourceVideo: true,
          sampleAnswers: 'Cả nhà ơi, đôi khi bình luận đông quá em không chào hết được, có lỡ bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu cả nhà nhiều!'
        }
      };
      localStorage.setItem('aidol_event_configs', JSON.stringify(defaultEventConfigs));
      localStorage.setItem('aidol_event_configs_backup', JSON.stringify(defaultEventConfigs));
    }
  } catch (e) {
    console.warn('[BootstrapPresets] Note:', e.message);
  }
}
