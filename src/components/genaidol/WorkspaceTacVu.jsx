import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, MessageCircle, Plus, Gift, Clock, Megaphone, 
  Hand, ShoppingCart, Share, Sparkles, Mic, Heart, Play, HelpCircle, ChevronDown
} from 'lucide-react';

const EVENTS = [
  { id: 'checkout', label: 'Chốt đơn', icon: ShoppingCart, color: 'text-blue-500', desc: 'Aldol sẽ thực hiện các câu kêu gọi mua hàng, chốt đơn khi có người hỏi mua.' },
  { id: 'special_gift', label: 'Quà tặng Đặc biệt', icon: Sparkles, color: 'text-yellow-500', desc: 'Tạo ra các phản ứng độc đáo và ấn tượng cho những món quà giá trị (Sư tử, Du thuyền...) để tri ân những người hâm mộ lớn.' },
  { id: 'gift', label: 'Quà tặng (Thường)', icon: Gift, color: 'text-yellow-500', desc: 'Cấu hình phản ứng chung của Aldol khi nhận được các món quà không được liệt kê trong mục "Quà tặng Đặc biệt".' },
  { id: 'comment', label: 'Bình luận', icon: MessageCircle, color: 'text-gray-400', desc: 'Aldol sẽ tự động đọc và trả lời các bình luận của người xem trên phiên live.' },
  { id: 'follow', label: 'Theo dõi', icon: Plus, color: 'text-purple-600', desc: 'Aldol sẽ gửi lời cảm ơn đặc biệt mỗi khi có người xem mới nhấn theo dõi kênh của bạn, giúp tăng tỷ lệ chuyển đổi người xem thành người theo dõi.' },
  { id: 'share', label: 'Chia sẻ', icon: Share, color: 'text-blue-400', desc: 'Cảm ơn người xem đã chia sẻ phiên live.' },
  { id: 'thanks_heart', label: 'Cảm ơn Tim', icon: Heart, color: 'text-red-500', desc: 'Cảm ơn khi người xem thả tim cho phiên live.' },
  { id: 'welcome', label: 'Chào người mới', icon: Hand, color: 'text-yellow-500', desc: 'Aldol sẽ gom nhóm và chào những người xem mới vào phòng sau một khoảng thời gian nhất định, tạo cảm giác thân thiện và được chào đón.' },
  { id: 'call_to_action', label: 'Kêu gọi tương tác', icon: Megaphone, color: 'text-red-500', desc: 'Aldol chủ động kêu gọi mọi người thả tim, share, follow.' },
  { id: 'talking', label: 'Nói chuyện (AI)', icon: Mic, color: 'text-gray-500', desc: 'Giúp livestream không bị "chết". Aldol sẽ tự động bắt chuyện khi không có sự kiện nào xảy ra trong một khoảng thời gian dài.' },
  { id: 'apology', label: 'Xin lỗi', icon: CheckSquare, color: 'text-green-500', desc: 'Cấu hình phản ứng của Aldol khi nó không hiểu một bình luận hoặc gặp phải lỗi không mong muốn.' },
  { id: 'idle', label: 'Im lặng (Chờ)', icon: Clock, color: 'text-orange-500', desc: 'Cấu hình các hành động của Aldol khi ở trạng thái chờ, không có sự kiện nào cần xử lý.' }
];

const GIFT_TYPES = ['Finger Heart', 'Cap', 'Confetti', 'Corgi', 'Crystal Rose', 'Crystal Shoe', "Cupid's Bow", "Don't cry", 'Doughnut', 'Encore Clap', 'Lucky pig', 'Lion', 'Yacht'];

const getDefaultEventConfigs = () => {
  const defaults = {};
  EVENTS.forEach(ev => {
    defaults[ev.id] = {
      priority: ev.id === 'apology' ? 20 : ev.id === 'comment' ? 50 : ev.id === 'follow' ? 70 : ev.id === 'gift' ? 90 : ev.id === 'welcome' ? 60 : ev.id === 'special_gift' ? 999 : ev.id === 'checkout' ? 100 : ev.id === 'share' ? 50 : ev.id === 'thanks_heart' ? 15 : 50,
      active: ev.id !== 'welcome' && ev.id !== 'share' && ev.id !== 'thanks_heart', 
      useVoice: ev.id !== 'gift' && ev.id !== 'welcome',
      muteSourceVideo: ev.id !== 'gift' && ev.id !== 'welcome',
      videoCategory: ev.id === 'welcome' ? 'join' : ev.id === 'call_to_action' ? 'interaction' : ev.id === 'thanks_heart' ? 'thank_for_likes' : ev.id,
      videoFolder: '',
      useAi: ev.id !== 'gift',
      aiPrompt: '',
      sampleAnswers: '',
      assistantPrompt: '',
      assistantUseMainVoice: false,
      
      greetMinutes: ev.id === 'apology' || ev.id === 'welcome' ? 1 : '',
      waitBetweenEvents: ev.id === 'comment' ? 1 : ev.id === 'follow' ? 60 : ev.id === 'gift' ? 0 : '',
      replyRate: ev.id === 'comment' ? 70 : '',
      bannedWords: ev.id === 'comment' ? 'scam\ngiả' : '',
      priorityWords: ev.id === 'comment' ? 'mua\nbán' : '',
      smartSpamFilter: ev.id === 'comment' ? true : false,
      waitBetweenSpam: ev.id === 'comment' ? 3 : '',
      maxRepeatChars: ev.id === 'comment' ? 0.7 : '',
      speakAfterIdleSeconds: ev.id === 'idle' ? 5 : '',
      likeThreshold: ev.id === 'thanks_heart' ? 10 : '',
      
      // Special gifts
      specialGiftSlots: ev.id === 'special_gift' ? [
        { id: 1, active: true, giftName: 'Finger Heart', videoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: true, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true },
        { id: 2, active: true, giftName: 'Lucky pig', videoFolder: '', useTTS: false, muteSourceVideo: false, useAssistant: false, assistantPrompt: '', assistantVideoFolder: '', useMainVoice: true }
      ] : [],

      // Checkout Products
      checkoutProducts: ev.id === 'checkout' ? [
        { id: 1, active: true, productName: 'aidol', keywords: 'aidol;phần mềm;giá;liên hệ', videoFolder: 'bình luận', useAi: true, useTTS: false, muteSourceVideo: true, aiPrompt: 'TRong vai là một nhân viên sale chuyên nghiệp hãy đọc bình luận và đem ra câu trả lời để chốt đơn, giá phần mềm là 3 triệu rưỡi/1 năm, hoặc gói dùng thử là 500000 đồng trên 1 tháng. Chốt sale hoặc cần tư vấn thêm thì hãy liên hệ với đội ngũ admin' },
        { id: 2, active: false, productName: '', keywords: '', videoFolder: '', useAi: false, useTTS: false, muteSourceVideo: false, aiPrompt: '' },
        { id: 3, active: false, productName: '', keywords: '', videoFolder: '', useAi: false, useTTS: false, muteSourceVideo: false, aiPrompt: '' }
      ] : []
    };
  });
  
  defaults['apology'].sampleAnswers = "Cả nhà ơi, đôi khi bình luận và người tham gia mới đông quá em không chào hết được, có bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu mọi người nhiều!\nMọi người thông cảm nha, nếu em có lỡ bỏ qua bình luận của ai thì nhắn lại giúp em với nhé, do nhiều tin nhắn quá em không xem kịp ạ.";
  defaults['comment'].aiPrompt = "### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user}.";
  defaults['comment'].sampleAnswers = "Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.";
  defaults['follow'].aiPrompt = "Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.";
  defaults['follow'].sampleAnswers = "A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!";
  defaults['talking'].aiPrompt = "Bạn là một streamer AI, đang không có ai tương tác. Hãy chủ động nói một điều gì đó thật thú vị, đặt một câu hỏi mở, nói một cách hài hước...";
  defaults['talking'].sampleAnswers = "xin chào các bn\ncác bạn ơi nói chuyện đi";
  defaults['comment'].assistantPrompt = "A, có bạn {user} vừa mới bình luận là: {comment}";
  defaults['gift'].aiPrompt = "Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo tới {user} vì đã tặng 1 {gift_name}.";
  defaults['call_to_action'].sampleAnswers = "Mọi người ơi, đừng xem chùa nữa, hãy thả tim và bình luận để mình có thêm động lực nhé!\nCác bạn có câu hỏi nào cho mình không ạ? Đừng ngại hỏi nha!\nNếu thấy buổi live thú vị, mọi người hãy giúp mình một lượt chia sẻ nhé. Yêu mọi người!";
  defaults['welcome'].sampleAnswers = "Chào mừng bạn {user} và {count} người mới đã đến với livestream!\nXin chào {user} và mọi người mới vào xem nhé! Chúc mọi người xem live vui vẻ.\nHelu {user}! Cảm ơn {count} bạn mới đã ghé thăm kênh của mình nha.";
  defaults['share'].aiPrompt = "Hãy cảm ơn người dùng tên {user} vì đã chia sẻ livestream.";
  defaults['share'].sampleAnswers = "Cảm ơn bạn {user} đã chia sẻ live giúp mình nhé!\nMình cảm ơn bạn {user} rất nhiều!";
  defaults['thanks_heart'].sampleAnswers = "Cảm ơn mọi người đã giúp mình đạt mốc {milestone} tim!\nWow, chúng ta đã đạt {milestone} tim rồi! Yêu các bạn nhiều!";

  return defaults;
};

export default function WorkspaceTacVu() {
  const [selectedEventId, setSelectedEventId] = useState('checkout');
  
  // Khởi tạo và nạp bền vững vĩnh viễn dữ liệu người dùng đã cài đặt
  const [eventConfigs, setEventConfigs] = useState(() => {
    const defaults = getDefaultEventConfigs();
    try {
      const saved = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const merged = { ...defaults };
          Object.keys(defaults).forEach(key => {
            if (parsed[key]) {
              merged[key] = {
                ...defaults[key],
                ...parsed[key],
                // Giữ nguyên các slot quà tặng và sản phẩm người dùng đã tùy chỉnh
                specialGiftSlots: (Array.isArray(parsed[key]?.specialGiftSlots) && parsed[key].specialGiftSlots.length > 0)
                  ? parsed[key].specialGiftSlots
                  : defaults[key].specialGiftSlots,
                checkoutProducts: (Array.isArray(parsed[key]?.checkoutProducts) && parsed[key].checkoutProducts.length > 0)
                  ? parsed[key].checkoutProducts
                  : defaults[key].checkoutProducts,
              };
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.warn("Lỗi load cấu hình sự kiện đã lưu:", e);
    }
    return defaults;
  });

  // Tự động sao lưu và bảo lưu liên tục vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    if (eventConfigs && Object.keys(eventConfigs).length > 0) {
      try {
        const json = JSON.stringify(eventConfigs);
        localStorage.setItem('aidol_event_configs', json);
        localStorage.setItem('aidol_event_configs_backup', json);
      } catch (e) {
        console.warn("Lỗi tự động lưu cấu hình:", e);
      }
    }
  }, [eventConfigs]);

  const currentConfig = eventConfigs[selectedEventId] || {};

  const handleSave = () => {
    try {
      const json = JSON.stringify(eventConfigs);
      localStorage.setItem('aidol_event_configs', json);
      localStorage.setItem('aidol_event_configs_backup', json);
      alert('✅ Đã bảo lưu toàn bộ cấu hình sự kiện & kịch bản thành công vĩnh viễn!');
    } catch (e) {
      alert('Lỗi lưu cấu hình: ' + e.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventConfigs(prev => ({
      ...prev,
      [selectedEventId]: {
        ...prev[selectedEventId],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSlotChange = (slotId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const newSlots = prev[selectedEventId].specialGiftSlots.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, [name]: isCheckbox ? value : value };
        }
        return slot;
      });
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          specialGiftSlots: newSlots
        }
      };
    });
  };

  const handleProductChange = (productId, name, value, isCheckbox = false) => {
    setEventConfigs(prev => {
      const newProducts = prev[selectedEventId].checkoutProducts.map(prod => {
        if (prod.id === productId) {
          return { ...prod, [name]: isCheckbox ? value : value };
        }
        return prod;
      });
      return {
        ...prev,
        [selectedEventId]: {
          ...prev[selectedEventId],
          checkoutProducts: newProducts
        }
      };
    });
  };

  const selectFolder = async (fieldName = 'videoFolder') => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleChange({ target: { name: fieldName, value: dirHandle.name } });
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục (Dữ liệu này sẽ được giả lập lưu để sử dụng với file zip/unzip sau này):", "C:/Videos/");
        if (folderPath) {
          handleChange({ target: { name: fieldName, value: folderPath } });
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectSlotFolder = async (slotId, fieldName) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleSlotChange(slotId, fieldName, dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục cho Slot này:", "C:/Videos/");
        if (folderPath) {
          handleSlotChange(slotId, fieldName, folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectProductFolder = async (productId) => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        handleProductChange(productId, 'videoFolder', dirHandle.name);
      } else {
        const folderPath = prompt("Hãy nhập đường dẫn thư mục Video cho Sản phẩm này:", "C:/Videos/");
        if (folderPath) {
          handleProductChange(productId, 'videoFolder', folderPath);
        }
      }
    } catch (e) {
      console.log('Folder selection cancelled');
    }
  };

  const selectedEventInfo = EVENTS.find(e => e.id === selectedEventId);

const HELP_DATA = {
  // General & Common Fields
  priority: {
    title: '⭐ Độ ưu tiên',
    desc: 'Quyết định sự kiện nào được phát trước khi có nhiều sự kiện xảy ra cùng lúc.',
    tip: 'Số càng lớn ưu tiên càng cao (VD: Quà đặc biệt 999 > Chốt đơn 100 > Quà thường 90 > Comment 50 > Chờ 10).'
  },
  active: {
    title: '✅ Kích hoạt',
    desc: 'Bật hoặc tắt tính năng xử lý sự kiện này trong suốt phiên livestream.',
    tip: 'Bỏ chọn nếu bạn tạm thời không muốn Idol phản hồi sự kiện này.'
  },
  videoCategory: {
    title: '🎥 Danh mục Video',
    desc: 'Tên phân nhóm video dùng để ghép khớp với kịch bản hành động của Idol.',
    tip: 'Ví dụ: comment, gift, checkout, follow, idle...'
  },
  videoFolder: {
    title: '📁 Thư mục Video Cục bộ',
    desc: 'Đường dẫn thư mục chứa các file video (.mp4, .webm) thực tế trên máy của bạn.',
    tip: 'Bấm nút "Chọn..." để duyệt thư mục chứa clip động tác của Idol.'
  },
  useAi: {
    title: '🧠 Dùng AI Trả lời (Bộ não Gemini)',
    desc: 'Kích hoạt bộ não AI Gemini 1.5 Flash tự động phân tích ngữ cảnh và sáng tạo câu trả lời tức thì.',
    tip: 'Giúp câu nói của Idol tự nhiên, thông minh, không bị lặp lại nhàm chán.'
  },
  useVoice: {
    title: '🗣️ Dùng Giọng nói (TTS Voice)',
    desc: 'Bật chuyển văn bản câu trả lời thành giọng đọc AI tự nhiên (ElevenLabs).',
    tip: 'Nếu tắt, Idol sẽ chỉ diễn video mà không phát âm thanh giọng nói.'
  },
  useTTS: {
    title: '🗣️ Dùng TTS (Giọng đọc AI)',
    desc: 'Tự động phát âm thanh lời thoại được tạo ra bằng giọng nói trí tuệ nhân tạo.',
    tip: 'Nên bật để người xem nghe rõ tên của họ và thông điệp cá nhân hóa.'
  },
  muteSourceVideo: {
    title: '🔇 Tắt âm gốc Video',
    desc: 'Tự động tắt tiếng sẵn có trong file clip để không bị đè lên giọng đọc AI.',
    tip: 'Khuyên dùng BẬT để giọng nói của Idol và Trợ lý nghe trong trẻo, rõ nét nhất.'
  },
  aiPrompt: {
    title: '✍️ Kịch bản cho AI (System Prompt)',
    desc: 'Lời chỉ dẫn đóng vai cho AI (tính cách, vai trò, quy tắc trả lời, thông tin sản phẩm).',
    tip: 'Dùng cú pháp {user}, {comment}, {gift_name} để AI tự điền tên người xem thời gian thực.'
  },
  sampleAnswers: {
    title: '📄 Câu trả lời mẫu (Dự phòng)',
    desc: 'Danh sách các câu thoại soạn sẵn (mỗi câu 1 dòng), hệ thống sẽ chọn ngẫu nhiên khi không dùng AI.',
    tip: 'Hữu ích khi muốn câu thoại chuẩn chỉnh $100\\%$ theo kịch bản có sẵn.'
  },
  waitBetweenEvents: {
    title: '⏳ Thời gian chờ giữa các lần (Cooldown)',
    desc: 'Khoảng thời gian nghỉ (giây) giữa 2 lần kích hoạt sự kiện liên tiếp.',
    tip: 'Tránh việc Idol nói liên tục dồn dập khi lượng tương tác vào quá đông.'
  },

  // Checkout Fields (Chốt đơn)
  productName: {
    title: '🏷️ Tên Sản Phẩm',
    desc: 'Tên định danh của mặt hàng cần tư vấn / bán trong phiên live.',
    tip: 'Ví dụ: Khóa học, Son môi, Áo thun, Phần mềm AvaLive...'
  },
  keywords: {
    title: '🔑 Từ khóa Chốt Đơn',
    desc: 'Danh sách từ người xem hay gõ khi muốn mua hàng (cách nhau bởi dấu chấm phẩy ;).',
    tip: 'Ví dụ: mua;giá;tư vấn;bao nhiêu;inbox;chốt đơn;order. Khi comment có từ này, AI sẽ ưu tiên bán sản phẩm này.'
  },

  // Special Gift Fields
  giftName: {
    title: '🎁 Tên Quà Tặng',
    desc: 'Loại quà tặng đặc biệt trên nền tảng (TikTok/Facebook) cần gán phản ứng độc quyền.',
    tip: 'Ví dụ: Lion (Sư tử), Yacht (Du thuyền), Finger Heart, Lucky pig...'
  },
  useAssistant: {
    title: '👥 Cấu hình Trợ Lý Riêng',
    desc: 'Bật nhân vật phụ / trợ lý ảo lên tiếng tung hứng, cảm ơn phụ họa cùng Idol chính.',
    tip: 'Tăng không khí sôi động và chuyên nghiệp như các phiên livestream lớn.'
  },
  assistantPrompt: {
    title: '💬 Câu mẫu của Trợ Lý',
    desc: 'Lời thoại của trợ lý ảo khi sự kiện xảy ra (VD: "Cảm ơn đại gia {user} đã ủng hộ!").',
    tip: 'Có thể dùng thẻ {user} để gọi tên người xem.'
  },
  assistantVideoFolder: {
    title: '🎬 Video của Trợ Lý',
    desc: 'Thư mục chứa clip hoạt cảnh phản ứng riêng của nhân vật trợ lý.',
    tip: 'Chọn video có động tác vỗ tay, hoan hô của trợ lý.'
  },
  assistantUseMainVoice: {
    title: '🎙️ Dùng giọng nhân vật chính',
    desc: 'Chọn xem Trợ lý có dùng chung voice AI với Idol chính hay dùng voice riêng biệt.',
    tip: 'Bật nếu muốn đồng bộ giọng, tắt nếu muốn Trợ lý có âm sắc giọng riêng.'
  },

  // Comment Specific Fields
  replyRate: {
    title: '📊 Tỷ lệ Trả lời (%)',
    desc: 'Tỷ lệ phần trăm bình luận được chọn để phản hồi (từ 0% đến 100%).',
    tip: 'Khuyên đặt 60% - 80% để Idol chọn lọc comment chất lượng, tránh nói quá tải phiên live.'
  },
  bannedWords: {
    title: '🚫 Từ khóa Cấm (Blacklist)',
    desc: 'Danh sách từ ngữ thô tục, tiêu cực, lừa đảo... (mỗi từ 1 dòng).',
    tip: 'Khi bình luận chứa từ này, AI sẽ tự động bỏ qua tuyệt đối, không đọc và không phản hồi.'
  },
  priorityWords: {
    title: '⭐ Từ khóa Ưu tiên',
    desc: 'Danh sách từ khóa quan trọng liên quan đến chốt đơn, đặt hàng (mỗi từ 1 dòng).',
    tip: 'Bình luận chứa các từ này sẽ được ưu tiên xếp lên đầu hàng đợi để Idol trả lời ngay.'
  },
  smartSpamFilter: {
    title: '🛡️ Bộ lọc Spam Thông minh',
    desc: 'Tự động nhận diện và chặn các tài khoản bình luận liên tục hoặc gửi nội dung vô nghĩa.',
    tip: 'Bảo vệ phiên live khỏi bot spam phá hoại và giữ luồng trò chuyện mượt mà.'
  },
  waitBetweenSpam: {
    title: '⏱️ Thời gian chờ phạt Spam (giây)',
    desc: 'Số giây hệ thống tạm ngưng nhận comment từ tài khoản có hành vi spam liên tục.',
    tip: 'Khuyên đặt 3 - 5 giây.'
  },
  maxRepeatChars: {
    title: '🔤 Tỷ lệ Ký tự lặp lại tối đa (0.0 - 1.0)',
    desc: 'Ngưỡng phát hiện chuỗi ký tự vô nghĩa bị lặp (VD: aaaaaaaa, 1111111111).',
    tip: 'Đặt 0.7 nghĩa là nếu trên 70% nội dung là ký tự lặp, comment sẽ tự động bị bỏ qua.'
  },

  // Specific Timers & Thresholds
  likeThreshold: {
    title: '❤️ Ngưỡng Tim để Cảm ơn',
    desc: 'Số lượng lượt thích (tim) tích lũy để Idol kích hoạt 1 lần cảm ơn mốc tim.',
    tip: 'Ví dụ: Đặt 50 hoặc 100 nghĩa là cứ tăng thêm 50-100 tim thì Idol sẽ cảm ơn 1 lần.'
  },
  greetMinutes: {
    title: '⏱️ Số phút Gom nhóm Chào / Xin lỗi',
    desc: 'Khoảng thời gian định kỳ gom người mới vào phòng để chào một lượt.',
    tip: 'Giúp không bị ngắt quãng phiên live khi người xem ra vào liên tục.'
  },
  speakAfterIdleSeconds: {
    title: '⏱️ Tự nói sau khoảng thời gian Im lặng (giây)',
    desc: 'Số giây không có tương tác trước khi Idol tự động tìm chủ đề bắt chuyện cứu live.',
    tip: 'Khuyên đặt 5 - 10 giây để giữ phiên live luôn sôi động, không bị chết thời gian.'
  }
};

// Reusable Interactive Help Tooltip Component
const HelpTooltip = ({ helpKey, customText, customTitle, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = HELP_DATA[helpKey] || {
    title: customTitle || 'Hướng dẫn chức năng',
    desc: customText || 'Chức năng hỗ trợ tùy chỉnh hoạt động của Idol trong phiên livestream.',
    tip: 'Nhấp để xem hướng dẫn chi tiết.'
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-[10px] font-bold transition-all shadow-xs ml-1 focus:outline-none ring-1 ring-blue-300 hover:scale-110"
        title="Bấm hoặc rê chuột để xem hướng dẫn"
      >
        ?
      </button>

      {isOpen && (
        <div 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute z-50 left-6 -top-2 w-72 p-3 bg-[#1e293b] text-white rounded-lg shadow-2xl border border-blue-500/40 text-left pointer-events-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-700/60 mb-2">
            <span className="font-bold text-xs text-blue-300 flex items-center gap-1.5">
              {info.title}
            </span>
            <span className="text-[10px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded font-mono border border-blue-400/30">
              HDSD
            </span>
          </div>

          <p className="text-[11.5px] text-gray-200 leading-relaxed mb-2 font-normal">
            {info.desc}
          </p>

          {info.tip && (
            <div className="bg-blue-950/70 p-2 rounded border border-blue-800/50 text-[10.5px] text-cyan-200 flex items-start gap-1.5 leading-snug">
              <span className="text-yellow-400 font-bold shrink-0">💡 Mẹo:</span>
              <span>{info.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FieldLabel = ({ icon, text, helpKey, customHelpText, minW = "min-w-[220px]" }) => (
  <div className={`flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 ${minW}`}>
    {icon && <span className="text-[#a53b3b]">{icon}</span>}
    <span>{text}:</span>
    <HelpTooltip helpKey={helpKey} customText={customHelpText} customTitle={text} />
  </div>
);

  return (
    <div className="flex w-full h-[95vh] bg-[#f0f2f5] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-[240px] bg-[#f0f2f5] border-r border-gray-300 flex flex-col h-full">
        <div className="p-3 border-b border-gray-300">
          <div className="border border-gray-300 rounded bg-white overflow-hidden shadow-sm h-[calc(95vh-24px)]">
            <div className="px-3 py-1.5 bg-[#e0e3e8] border-b border-gray-300 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Sự kiện có sẵn
            </div>
            <div className="overflow-y-auto h-full pb-8">
              {EVENTS.map(ev => {
                const Icon = ev.icon;
                const isSelected = selectedEventId === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEventId(ev.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${isSelected ? 'bg-[#d5e2f2]' : 'hover:bg-gray-100'}`}
                  >
                    <Icon size={16} className={`${ev.color}`} />
                    <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{ev.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f0f2f5] p-3">
        
        {/* Header Info Box */}
        <div className="bg-[#e6f0fa] border border-[#b3d4f5] rounded-md p-3 mb-3">
          <p className="text-[13px] text-gray-800 mb-2">
            <span className="font-bold">{selectedEventInfo?.label}: </span>
            {selectedEventInfo?.desc}
          </p>
          <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#14539a] hover:underline">
            <Play size={14} fill="currentColor" /> Xem video hướng dẫn cấu hình
          </button>
        </div>

        {selectedEventId === 'thanks_heart' && (
          <div className="bg-[#fdebea] border border-[#f5c2c7] rounded-md p-3 mb-3 text-[13px] text-[#842029]">
             <span className="font-bold">⚠️ Lưu ý Quan trọng:</span> Tính năng này phụ thuộc vào kết nối ổn định tới TikTok. Do các thay đổi gần đây từ phía TikTok, kết nối có thể không ổn định, khiến tính năng hoạt động không như mong đợi. Hãy cân nhắc kỹ khi sử dụng.
          </div>
        )}

        {/* Scrollable Config Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* SPECIAL GIFT */}
          {selectedEventId === 'special_gift' ? (
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Cấu hình Logic Chung
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                      <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[150px]" />
                      <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-64 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                    </div>
                    <div className="flex items-center">
                      <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[150px]" />
                      <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                    Phản ứng Quà tặng Đặc biệt
                  </legend>
                  
                  <div className="flex flex-col gap-4">
                    {currentConfig.specialGiftSlots?.map(slot => (
                      <div key={slot.id} className="border border-gray-300 rounded p-3 bg-[#f8f9fa] shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <input type="checkbox" checked={slot.active} onChange={(e) => handleSlotChange(slot.id, 'active', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                          <span className="font-bold text-gray-800 text-[13px]">Slot {slot.id}</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-4 items-center">
                          
                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#a53b3b]">Tên Quà tặng:</label>
                            <HelpTooltip helpKey="giftName" />
                          </div>
                          <select value={slot.giftName} onChange={(e) => handleSlotChange(slot.id, 'giftName', e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500 max-w-xs">
                            {GIFT_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                          </select>

                          <div className="flex items-center gap-1">
                            <label className="text-[13px] font-semibold text-[#a53b3b]">Thư mục Video Chính:</label>
                            <HelpTooltip helpKey="videoFolder" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium min-w-[150px]">{slot.videoFolder || 'Chưa chọn'}</span>
                            <button onClick={() => selectSlotFolder(slot.id, 'videoFolder')} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">Chọn...</button>
                            <div className="ml-auto flex gap-4">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={slot.useTTS} onChange={(e) => handleSlotChange(slot.id, 'useTTS', e.target.checked, true)} /> 
                                <span className="text-[13px]">Dùng TTS</span>
                                <HelpTooltip helpKey="useTTS" />
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input type="checkbox" checked={slot.muteSourceVideo} onChange={(e) => handleSlotChange(slot.id, 'muteSourceVideo', e.target.checked, true)} /> 
                                <span className="text-[13px]">Tắt âm gốc video</span>
                                <HelpTooltip helpKey="muteSourceVideo" />
                              </label>
                            </div>
                          </div>

                          <div className="col-span-2 border-t border-gray-300 my-1"></div>

                          <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={slot.useAssistant} onChange={(e) => handleSlotChange(slot.id, 'useAssistant', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="font-bold text-gray-800 text-[13px]">Cấu hình Trợ lý riêng</span>
                              </label>
                              <HelpTooltip helpKey="useAssistant" />
                            </div>
                            
                            {slot.useAssistant && (
                              <div className="pl-6 grid grid-cols-[150px_1fr] gap-y-3 gap-x-4">
                                <div className="flex items-center gap-1">
                                  <label className="text-[13px] font-semibold text-gray-700">Câu mẫu của Trợ lý:</label>
                                  <HelpTooltip helpKey="assistantPrompt" />
                                </div>
                                <textarea value={slot.assistantPrompt} onChange={(e) => handleSlotChange(slot.id, 'assistantPrompt', e.target.value)} className="w-full h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                                
                                <div className="flex items-center gap-1">
                                  <label className="text-[13px] font-semibold text-gray-700">Video của Trợ lý:</label>
                                  <HelpTooltip helpKey="assistantVideoFolder" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-medium min-w-[150px]">{slot.assistantVideoFolder || 'Chưa chọn'}</span>
                                  <button onClick={() => selectSlotFolder(slot.id, 'assistantVideoFolder')} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">Chọn...</button>
                                </div>

                                <div className="col-span-2 flex justify-center mt-1">
                                  <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input type="checkbox" checked={slot.useMainVoice} onChange={(e) => handleSlotChange(slot.id, 'useMainVoice', e.target.checked, true)} /> 
                                    <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                                    <HelpTooltip helpKey="assistantUseMainVoice" />
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </fieldset>
              </div>
            </>
          ) : selectedEventId === 'checkout' ? (
            // CHECKOUT EVENTS (CHỐT ĐƠN)
            <>
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <div className="flex items-center gap-8 mb-4 ml-4">
                  <div className="flex items-center">
                    <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[120px]" />
                    <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                  </div>
                  <div className="flex items-center">
                    <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[100px]" />
                    <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="w-32 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {currentConfig.checkoutProducts?.map(prod => (
                    <fieldset key={prod.id} className="border border-gray-300 rounded p-4 pt-4 relative bg-[#f8f9fa] shadow-sm">
                      <legend className="absolute -top-3 left-3 bg-[#f8f9fa] px-1 text-sm font-bold text-gray-700 flex items-center gap-2">
                        <input type="checkbox" checked={prod.active} onChange={(e) => handleProductChange(prod.id, 'active', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded" />
                        Sản phẩm {prod.id}
                      </legend>
                      
                      <div className="grid grid-cols-[200px_1fr] gap-y-3 gap-x-4 items-center">
                        <div className="flex items-center gap-1">
                          <label className="text-[13px] font-semibold text-gray-700">Tên sản phẩm:</label>
                          <HelpTooltip helpKey="productName" />
                        </div>
                        <input type="text" value={prod.productName} onChange={(e) => handleProductChange(prod.id, 'productName', e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] bg-white focus:outline-blue-500 w-full" />

                        <div className="flex items-center gap-1">
                          <label className="text-[13px] font-semibold text-[#a53b3b]">Từ khóa <span className="font-normal text-gray-500">(cách nhau bởi ;)</span>:</label>
                          <HelpTooltip helpKey="keywords" />
                        </div>
                        <input type="text" value={prod.keywords} onChange={(e) => handleProductChange(prod.id, 'keywords', e.target.value)} className="border border-gray-300 rounded px-2 py-1.5 text-[13px] bg-white focus:outline-blue-500 w-full" />

                        <div className="flex items-center gap-1">
                          <label className="text-[13px] font-semibold text-gray-700">Thư mục Video:</label>
                          <HelpTooltip helpKey="videoFolder" />
                        </div>
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-[13px] font-medium min-w-[200px] flex-1 truncate">{prod.videoFolder || 'Chưa chọn'}</span>
                          <button onClick={() => selectProductFolder(prod.id)} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted bg-gray-200 px-3 py-1 rounded">Chọn...</button>
                        </div>

                        <div className="flex items-center gap-1 mt-2 self-start">
                          <label className="text-[13px] font-semibold text-gray-700">Kịch bản cho AI:</label>
                          <HelpTooltip helpKey="aiPrompt" />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                          <textarea value={prod.aiPrompt} onChange={(e) => handleProductChange(prod.id, 'aiPrompt', e.target.value)} className="w-full h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-white focus:outline-blue-500" />
                          
                          <div className="flex items-center justify-center gap-6 mt-1">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" checked={prod.useAi} onChange={(e) => handleProductChange(prod.id, 'useAi', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> 
                              <span className="text-[13px] font-medium">Dùng AI</span>
                              <HelpTooltip helpKey="useAi" />
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" checked={prod.useTTS} onChange={(e) => handleProductChange(prod.id, 'useTTS', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> 
                              <span className="text-[13px] font-medium">Dùng TTS</span>
                              <HelpTooltip helpKey="useTTS" />
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" checked={prod.muteSourceVideo} onChange={(e) => handleProductChange(prod.id, 'muteSourceVideo', e.target.checked, true)} className="w-4 h-4 text-blue-600 rounded"/> 
                              <span className="text-[13px] font-medium">Tắt âm gốc video</span>
                              <HelpTooltip helpKey="muteSourceVideo" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* NORMAL EVENTS - Cấu hình Chung */}
              {selectedEventId === 'gift' ? (
                // GIFT (THƯỜNG) has special groupings: "Cấu hình Logic Chung" and "Cấu hình Phản ứng Quà tặng Chung"
                <>
                  <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                        Cấu hình Logic Chung (Ưu tiên, Cooldown)
                      </legend>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                          <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" minW="min-w-[180px]" />
                          <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" minW="min-w-[180px]" />
                          <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="⏳" text="Chờ giữa các quà tặng (giây)" helpKey="waitBetweenEvents" minW="min-w-[180px]" />
                          <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700">
                        Cấu hình Phản ứng Quà tặng Chung
                      </legend>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center">
                          <FieldLabel icon="🎥" text="Danh mục video" helpKey="videoCategory" minW="min-w-[180px]" />
                          <input type="text" name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🧠" text="Dùng AI trả lời" helpKey="useAi" minW="min-w-[180px]" />
                          <input type="checkbox" name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" minW="min-w-[180px]" />
                          <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-center">
                          <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" minW="min-w-[180px]" />
                          <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                        </div>
                        <div className="flex items-start mt-2">
                          <FieldLabel icon="✍️" text="Kịch bản cho AI" helpKey="aiPrompt" minW="min-w-[180px]" />
                          <textarea name="aiPrompt" value={currentConfig.aiPrompt} onChange={handleChange} className="flex-1 min-h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                        <div className="flex items-start mt-2">
                          <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" helpKey="sampleAnswers" minW="min-w-[180px]" />
                          <textarea name="sampleAnswers" value={currentConfig.sampleAnswers} onChange={handleChange} className="flex-1 min-h-[100px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </>
              ) : (
                // STANDARD EVENTS (Bình luận, Xin lỗi, Theo dõi, Kêu gọi, Chào người mới, etc)
                <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm">
                  <div className="relative px-3 py-4">
                    <fieldset className="border border-gray-300 rounded p-4 pt-6 mt-2 relative">
                      <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                        Cấu hình Chung - <span className="text-[#a53b3b]"><selectedEventInfo.icon size={14} className={selectedEventInfo.color} /></span> {selectedEventInfo?.label}
                      </legend>
                      
                      <div className="flex flex-col gap-3">
                        
                        {/* Common fields for all standard events */}
                        
                        {currentConfig.videoCategory !== undefined && (
                          <div className="flex items-center">
                            <FieldLabel icon="🎥" text="Danh mục video" helpKey="videoCategory" />
                            <input type="text" name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {currentConfig.priority !== undefined && (
                          <div className="flex items-center">
                            <FieldLabel icon="⭐" text="Độ ưu tiên" helpKey="priority" />
                            <input type="number" name="priority" value={currentConfig.priority} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}
                        
                        {currentConfig.active !== undefined && (
                          <div className="flex items-center">
                            <FieldLabel icon="✅" text="Kích hoạt" helpKey="active" />
                            <input type="checkbox" name="active" checked={currentConfig.active} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                          </div>
                        )}

                        {currentConfig.useVoice !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                          <div className="flex items-center">
                            <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" />
                            <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                          </div>
                        )}

                        {currentConfig.muteSourceVideo !== undefined && selectedEventId !== 'talking' && selectedEventId !== 'idle' && (
                          <div className="flex items-center">
                            <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" />
                            <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                          </div>
                        )}

                        {currentConfig.useAi !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && (
                          <div className="flex items-center">
                            <FieldLabel icon="🧠" text="Dùng AI trả lời" helpKey="useAi" />
                            <input type="checkbox" name="useAi" checked={currentConfig.useAi} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                          </div>
                        )}
                        
                        {selectedEventId === 'thanks_heart' && (
                          <div className="flex items-center">
                            <FieldLabel icon="❤️" text="Ngưỡng tim để cảm ơn" helpKey="likeThreshold" />
                            <input type="number" name="likeThreshold" value={currentConfig.likeThreshold} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {/* Specific fields */}
                        {(selectedEventId === 'apology' || selectedEventId === 'welcome') && (
                          <div className="flex items-center">
                            <FieldLabel icon="⏱️" text="Số phút để chào" helpKey="greetMinutes" />
                            <input type="number" name="greetMinutes" value={currentConfig.greetMinutes} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {(selectedEventId === 'comment' || selectedEventId === 'follow') && (
                          <div className="flex items-center">
                            <FieldLabel icon="⏳" text={`Chờ giữa các ${selectedEventId === 'comment' ? 'comment' : 'follow'} (giây)`} helpKey="waitBetweenEvents" />
                            <input type="number" name="waitBetweenEvents" value={currentConfig.waitBetweenEvents} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {selectedEventId === 'comment' && (
                          <>
                            <div className="flex items-center">
                              <FieldLabel icon="📊" text="Tỷ lệ trả lời (%)" helpKey="replyRate" />
                              <input type="number" name="replyRate" value={currentConfig.replyRate} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                            </div>
                            <div className="flex items-start mt-1">
                              <FieldLabel icon="🚫" text="Từ khóa cấm" helpKey="bannedWords" />
                              <textarea name="bannedWords" value={currentConfig.bannedWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                            </div>
                            <div className="flex items-start mt-1">
                              <FieldLabel icon="⭐" text="Từ khóa ưu tiên" helpKey="priorityWords" />
                              <textarea name="priorityWords" value={currentConfig.priorityWords} onChange={handleChange} className="flex-1 h-[60px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                            </div>
                            <div className="flex items-center mt-1">
                              <FieldLabel icon="🛡️" text="Bật bộ lọc spam thông minh" helpKey="smartSpamFilter" />
                              <input type="checkbox" name="smartSpamFilter" checked={currentConfig.smartSpamFilter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                            </div>
                            <div className="flex items-center">
                              <FieldLabel icon="⏱️" text="Chờ giữa các comment spam (giây)" helpKey="waitBetweenSpam" />
                              <input type="number" name="waitBetweenSpam" value={currentConfig.waitBetweenSpam} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                            </div>
                            <div className="flex items-center">
                              <FieldLabel icon="🔤" text="Tỷ lệ ký tự lặp lại tối đa (0.0-1.0)" helpKey="maxRepeatChars" />
                              <input type="number" step="0.1" name="maxRepeatChars" value={currentConfig.maxRepeatChars} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                            </div>
                          </>
                        )}

                        {selectedEventId === 'idle' && (
                          <div className="flex items-center">
                            <FieldLabel icon="⏱️" text="Tự nói sau (giây) im lặng" helpKey="speakAfterIdleSeconds" />
                            <input type="number" name="speakAfterIdleSeconds" value={currentConfig.speakAfterIdleSeconds} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {currentConfig.aiPrompt !== undefined && selectedEventId !== 'idle' && selectedEventId !== 'apology' && selectedEventId !== 'welcome' && (
                          <div className="flex items-start mt-2">
                            <FieldLabel icon="✍️" text="Kịch bản cho AI" helpKey="aiPrompt" />
                            <textarea name="aiPrompt" value={currentConfig.aiPrompt} onChange={handleChange} className="flex-1 min-h-[120px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}

                        {currentConfig.sampleAnswers !== undefined && selectedEventId !== 'idle' && (
                          <div className="flex items-start mt-2">
                            <FieldLabel icon="📄" text="Câu trả lời mẫu (mỗi câu 1 dòng)" helpKey="sampleAnswers" />
                            <textarea name="sampleAnswers" value={currentConfig.sampleAnswers} onChange={handleChange} className="flex-1 min-h-[100px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" />
                          </div>
                        )}
                        
                        {selectedEventId === 'talking' && (
                          <>
                            <div className="flex items-center mt-2">
                              <FieldLabel icon="🗣️" text="Dùng giọng nói" helpKey="useVoice" />
                              <input type="checkbox" name="useVoice" checked={currentConfig.useVoice} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                            </div>
                            <div className="flex items-center">
                              <FieldLabel icon="🔇" text="Tắt âm gốc video" helpKey="muteSourceVideo" />
                              <input type="checkbox" name="muteSourceVideo" checked={currentConfig.muteSourceVideo} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                            </div>
                          </>
                        )}

                      </div>
                    </fieldset>
                  </div>
                </div>
              )}

              {/* Cấu hình Video Chung & Cài đặt Trợ lý cho các Tab còn lại */}
              <div className="border border-gray-300 rounded-md bg-white mb-3 shadow-sm px-3 py-4">
                <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                  <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <span>Cấu hình Video Chung (Dự phòng)</span>
                    <HelpTooltip helpKey="videoFolder" />
                  </legend>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Danh mục video cho sự kiện này:</span>
                      <select name="videoCategory" value={currentConfig.videoCategory} onChange={handleChange} className="flex-1 border border-gray-300 rounded px-2 py-1 text-[13px] bg-white focus:outline-blue-500">
                        <option value={currentConfig.videoCategory}>{currentConfig.videoCategory}</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-4">
                        <span className="text-[13px] text-[#a53b3b] font-semibold min-w-[200px]">Thư mục video tương ứng:</span>
                        <span className="text-[13px] text-gray-800 font-medium truncate max-w-sm">{currentConfig.videoFolder || 'Chưa chọn thư mục'}</span>
                      </div>
                      <button onClick={() => selectFolder()} className="text-[13px] text-gray-600 font-medium hover:text-gray-900 transition-colors underline decoration-dotted">
                        Chọn thư mục...
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              {currentConfig.assistantPrompt !== undefined && (
                <div className="border border-gray-300 rounded-md bg-white shadow-sm px-3 py-4 mb-4">
                  <fieldset className="border border-gray-300 rounded p-4 pt-4 mt-2 relative">
                    <legend className="absolute -top-3 left-3 bg-white px-1 text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <input type="checkbox" className="w-3.5 h-3.5" checked readOnly />
                      <span>Cài đặt Trợ lý</span>
                      <HelpTooltip helpKey="useAssistant" />
                    </legend>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        <label className="text-[13px] text-gray-700 font-semibold">Câu mẫu của Trợ lý:</label>
                        <HelpTooltip helpKey="assistantPrompt" />
                      </div>
                      <textarea 
                        name="assistantPrompt" value={currentConfig.assistantPrompt} onChange={handleChange}
                        className="w-full h-[80px] border border-gray-300 rounded p-2 text-[13px] resize-none bg-gray-50 focus:bg-white focus:outline-blue-500" 
                      />
                      <label className="flex items-center gap-2 justify-center mt-2 cursor-pointer">
                        <input type="checkbox" name="assistantUseMainVoice" checked={currentConfig.assistantUseMainVoice} onChange={handleChange} className="w-4 h-4 rounded" />
                        <span className="text-[13px] text-gray-600 font-medium">Dùng giọng của nhân vật chính</span>
                        <HelpTooltip helpKey="assistantUseMainVoice" />
                      </label>
                    </div>
                  </fieldset>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer Save Button */}
        <div className="mt-3">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold rounded shadow transition-colors text-[14px] uppercase tracking-wide flex justify-center items-center gap-2"
          >
            <CheckSquare size={18} /> Lưu thay đổi cho sự kiện này
          </button>
        </div>

      </div>
    </div>
  );
}
