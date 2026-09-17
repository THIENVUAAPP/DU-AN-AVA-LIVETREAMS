import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllLiveMedia } from '../lib/liveKhoDB';
import { askGeminiLiveAi } from '../lib/geminiClient';
import autoPinProductService from '../utils/autoPinProductService';
import { resolveEffectiveVoice } from '../utils/voiceSyncService';
import { isSmartSpamOrToxicComment, cleanUserNameForSpeech, isMeaningfulCommercialOrEngagingComment } from '../utils/vietnamesePronunciationMaster';

export function useLiveCoordinator({ isConnected, onVoiceReply, activeBrainPack = 'talk' }) {
  const [liveMedia, setLiveMedia] = useState([]);
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [previousVideoItem, setPreviousVideoItem] = useState(null);
  
  // Trạng thái AI/Video
  const [lipSyncVideoUrl, setLipSyncVideoUrl] = useState(null);
  const [viewerHistory, setViewerHistory] = useState([]);
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const idleTimerRef = useRef(null);
  const greetedViewersRef = useRef(new Set());
  const welcomeIndexRef = useRef(0); // Chỉ mục tuần tự vòng tròn không trùng lặp cho Chào Người Mới
  const lastCommentReplyTimeRef = useRef(0); // Bộ đếm thời gian giãn cách trả lời bình luận (10s - 120s)


  // Load kho video live
  useEffect(() => {
    const load = async () => {
      try {
        const items = await getAllLiveMedia();
        setLiveMedia(items);
      } catch (err) {
        console.error("Failed to load live media:", err);
      }
    };
    load();
  }, []);

  // Xử lý khi bắt đầu kết nối Live
  useEffect(() => {
    if (isConnected) {
      // Tìm video 'story' (chế độ chờ)
      const storyItems = liveMedia.filter(i => i.category === 'story' && i.type === 'video');
      if (storyItems.length > 0) {
        // Chọn random hoặc video đầu tiên
        setActiveVideoItem(storyItems[Math.floor(Math.random() * storyItems.length)]);
      }
      resetIdleTimer();
    } else {
      clearTimeout(idleTimerRef.current);
      setActiveVideoItem(null);
      setLipSyncVideoUrl(null);
    }
    return () => clearTimeout(idleTimerRef.current);
  }, [isConnected, liveMedia]);

  // Vòng lặp Idle (tự động tương tác)
  const resetIdleTimer = useCallback(() => {
    if (!isConnected) return;
    clearTimeout(idleTimerRef.current);
    const configs = getSavedEventConfigs();
    const idleSeconds = Number(configs.idle?.speakAfterIdleSeconds) || 30;
    idleTimerRef.current = setTimeout(() => {
      handleLiveEvent('IDLE', { note: `No user interaction for ${idleSeconds}s` });
    }, Math.max(10, idleSeconds) * 1000);
  }, [isConnected]);

// Helper đọc cấu hình sự kiện đã lưu từ WorkspaceTacVu
function getSavedEventConfigs() {
  const defaultEventConfigs = {
    script_broadcast: {
      priority: 80,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      loopScript: true,
      videoCategory: 'script_broadcast'
    },
    checkout: {
      priority: 100,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'checkout',
      useAi: true,
      checkoutProducts: [
        {
          id: 1,
          active: true,
          productName: 'aidol',
          keywords: 'aidol;phần mềm;giá;liên hệ;bao nhiêu;dùng thử',
          videoFolder: 'bình luận',
          supportVideoFolder: '',
          useAi: true,
          useTTS: true,
          voiceId: 'free_vi_female',
          ttsVoiceRole: 'idol',
          muteSourceVideo: true,
          aiPrompt: 'Trong vai là một nhân viên sale chuyên nghiệp hãy đọc bình luận và đem ra câu trả lời để chốt đơn, giá phần mềm là 3 triệu rưỡi/1 năm, hoặc gói dùng thử là'
        }
      ]
    },
    comment: {
      priority: 50,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'comment',
      useAi: true,
      commentReplyMode: 'hybrid',
      repeatCommentFirst: true,
      repeatCommentPrefix: 'Dạ bạn {user} vừa hỏi là: "{comment}". ',
      unknownFallbackReply: 'Dạ bạn {user} ơi, câu hỏi này em xin phép ghi nhận lại để phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!',
      appendFollowUpQuestion: true,
      followUpQuestionText: ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!',
      aiPrompt: '### NHIỆM VỤ: Trả lời bình luận của người dùng tên {user} ngắn gọn, thông minh, lịch sự và thu hút.',
      sampleAnswers: 'Cảm ơn bạn {user} đã bình luận nhé!\nMình đã nhận được bình luận của {user} rồi ạ.',
      assistantPrompt: 'A, có bạn {user} vừa mới bình luận là: {comment}'
    },
    gift: {
      priority: 90,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: false,
      videoCategory: 'gift',
      useAi: true,
      aiPrompt: 'Bạn là streamer AI. Hãy viết lời cảm ơn sáng tạo và chân thành tới {user} vì đã tặng {gift_name}.',
      sampleAnswers: 'Ôi em cảm ơn bạn {user} đã gửi tặng {gift_name} x{count} cho em nha! Cảm ơn món quà vô cùng ngọt ngào của bạn!\nCảm ơn bạn {user} rất nhiều vì món quà {gift_name} x{count} tuyệt vời ạ!'
    },
    special_gift: {
      priority: 999,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: false,
      videoCategory: 'special_gift',
      useAi: true,
      sampleAnswers: 'Ôi đỉnh quá! Em cảm ơn đại gia {user} vừa tặng siêu phẩm {gift_name} cực khủng cho em nha! Yêu bạn nhiều lắm luôn!\nTrời ơi siêu phẩm {gift_name}! Cảm ơn đại gia {user} đã ưu ái dành tặng em món quà đẳng cấp này ạ!'
    },
    follow: {
      priority: 70,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'follow',
      useAi: true,
      aiPrompt: 'Hãy nói một câu cảm ơn bạn {user} đã theo dõi kênh.',
      sampleAnswers: 'A, cảm ơn bạn {user} đã theo dõi mình. Yêu bạn!\nCảm ơn {user} đã follow kênh của mình nhé!\nDạ em cảm ơn {user} đã bấm follow kênh, nhớ bật thông báo đón xem live nha!'
    },
    welcome: {
      priority: 60,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: false,
      videoCategory: 'join',
      sampleAnswers: 'Chào mừng bạn {user} đã đến với livestream!\nXin chào {user} mới vào xem nhé! Chúc bạn xem live vui vẻ.\nHelu {user}! Cảm ơn bạn đã ghé thăm kênh của mình nha.\nDạ em chào bạn {user}! Hôm nay shop có rất nhiều deal hời, bạn ở lại xem cùng em nha.\nChào mừng bạn {user} thân yêu! Rất vui được gặp bạn trong phiên live hôm nay.'
    },
    share: {
      priority: 50,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'share',
      sampleAnswers: 'Em cảm ơn bạn {user} đã chia sẻ phiên livestream này đến bạn bè nha! Yêu bạn nhiều!\nCảm ơn {user} đã nhiệt tình share live giúp em ạ!'
    },
    thanks_heart: {
      priority: 15,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'thank_for_likes',
      sampleAnswers: 'Em cảm ơn mọi người đã thả tim nhiệt tình cho em nha! Cả nhà bấm liên tục vào màn hình giúp em đẩy tương tác live nhé!\nCảm ơn cả nhà đã thả {milestone} cho em ạ!'
    },
    talking: {
      priority: 40,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'talking',
      useAi: true,
      sampleAnswers: 'Chào mọi người, hôm nay thật vui được đồng hành cùng cả nhà! Mọi người có câu hỏi hay muốn giao lưu gì cứ bình luận nhé!\nKhông khí hôm nay thật tuyệt vời, cảm ơn tất cả các bạn đang theo dõi live!'
    },
    idle: {
      priority: 10,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'idle',
      speakAfterIdleSeconds: 30,
      useAi: true,
      sampleAnswers: 'Cả nhà ơi, mọi người bấm liên tục vào màn hình thả tim và để lại bình luận giúp em đẩy tương tác live lên nhé!\nAi đang xem live cho em xin một chấm hoặc một câu chào dưới phần bình luận nha cả nhà!'
    },
    apology: {
      priority: 20,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'apology',
      sampleAnswers: 'Cả nhà ơi, đôi khi bình luận đông quá em không chào hết được, có lỡ bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu cả nhà nhiều!\nDạ em xin lỗi cả nhà nếu vừa nãy đường truyền có chút chập chờn nhé, em đã quay trở lại rồi đây ạ!'
    },
    call_to_action: {
      priority: 65,
      active: true,
      useVoice: true,
      voiceId: 'free_vi_female',
      muteSourceVideo: true,
      videoCategory: 'interaction',
      sampleAnswers: 'Mọi người ơi, hãy bấm ngay vào giỏ hàng góc trái săn mã giảm giá giờ vàng ngay kẻo hết nhé!\nCả nhà đừng quên bấm theo dõi kênh để không bỏ lỡ những buổi live đầy ưu đãi tiếp theo nha!'
    }
  };

  try {
    const raw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
    if (raw) {
      const parsed = JSON.parse(raw);
      const merged = { ...defaultEventConfigs };
      Object.keys(parsed).forEach(k => {
        merged[k] = {
          ...(defaultEventConfigs[k] || {}),
          ...parsed[k]
        };
      });
      // Đảm bảo active và useVoice luôn mặc định là true
      Object.keys(merged).forEach(k => {
        if (merged[k].active === undefined) merged[k].active = true;
        if (merged[k].useVoice === undefined) merged[k].useVoice = true;
        if (merged[k].useAi === undefined) merged[k].useAi = true;
      });
      return merged;
    }
  } catch (e) {
    console.warn('Lỗi đọc cấu hình live:', e);
  }
  return defaultEventConfigs;
}

function getRandomSample(sampleAnswers, fallback = '') {
  if (!sampleAnswers || typeof sampleAnswers !== 'string') return fallback;
  const lines = sampleAnswers.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return fallback;
  return lines[Math.floor(Math.random() * lines.length)];
}

// Thuật toán duyệt tuần tự vòng tròn không trùng lặp (Round-Robin) cho Chào Người Mới
function getSequentialSample(sampleAnswers, indexRef, fallback = '') {
  if (!sampleAnswers || typeof sampleAnswers !== 'string') return fallback;
  const lines = sampleAnswers.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return fallback;
  const currentIdx = Math.abs(indexRef?.current || 0) % lines.length;
  const chosen = lines[currentIdx];
  if (indexRef) {
    indexRef.current = (currentIdx + 1) % lines.length;
  }
  return chosen;
}

function fillTemplate(template, vars = {}) {
  let result = template || '';
  Object.keys(vars).forEach(key => {
    const val = vars[key];
    if (key === 'user') {
      const cleanUser = cleanUserNameForSpeech(val);
      if (cleanUser === 'bạn' || cleanUser === 'Bạn') {
        result = result.replace(/\bbạn\s+\{user\}/gi, 'bạn');
        result = result.replace(/\banh\s+\{user\}/gi, 'anh');
        result = result.replace(/\bchị\s+\{user\}/gi, 'chị');
        result = result.replace(/\{user\}/gi, 'bạn');
      } else {
        result = result.replace(/\{user\}/gi, cleanUser);
      }
    } else {
      const regex = new RegExp(`\\{${key}\\}`, 'gi');
      result = result.replace(regex, val);
    }
  });
  return result;
}

  // Hàm kích hoạt xử lý sự kiện Live từ TikTok / Chat / Giả lập (Hỗ trợ AI Brain Bất Đồng Bộ)
  const handleLiveEvent = async (type, payload = {}) => {
    // Luôn cho phép chạy sự kiện khi đã kết nối Live hoặc khi bấm Chạy Test / Giả lập sự kiện
    resetIdleTimer();

    const configs = getSavedEventConfigs();
    let replyText = '';
    let shouldAction = null;
    const rawUserName = (payload?.name || payload?.username || 'Bạn').trim();
    const userName = cleanUserNameForSpeech(rawUserName);
    const userDisplay = (userName === 'bạn' || userName === 'Bạn') ? 'bạn' : (userName.startsWith('bạn ') || userName.startsWith('anh ') || userName.startsWith('chị ') ? userName : `bạn ${userName}`);
    const isTestMode = payload?.isTest === true;

    // Xác định tab sự kiện tương ứng để lấy cấu hình và giọng đọc (Voice) riêng biệt
    const evKey = type === 'GIFT' ? (payload?.isSpecial ? 'special_gift' : 'gift') : 
                  type === 'VIEWER_JOIN' ? 'welcome' : 
                  type === 'COMMENT' ? 'comment' : 
                  type === 'LIKE' ? 'thanks_heart' : 
                  type === 'FOLLOW' ? 'follow' : 
                  type === 'PURCHASE' ? 'checkout' : 
                  type === 'SHARE' ? 'share' : 
                  type === 'TALKING' || type === 'AI_TALK' ? 'talking' : 
                  type === 'IDLE' ? 'idle' : 
                  type === 'APOLOGY' ? 'apology' : 
                  type === 'CALL_TO_ACTION' ? 'call_to_action' : '';

    const currentEvConfig = evKey ? (configs[evKey] || {}) : {};

    // 🛡️ CHẶN 100% BÌNH LUẬN VÀ SỰ KIỆN XEN VÀO KHI ĐANG CHẠY THỬ KỊCH BẢN (SCRIPT PREVIEW / TESTER)
    // Đảm bảo kịch bản chạy thử được đọc liên tục, trọn vẹn, không ngắt quãng
    const isScriptTestingActive = typeof window !== 'undefined' && (
      window.__isScriptTestingRunning === true || 
      localStorage.getItem('avalive_script_testing_active') === 'true'
    );
    if (isScriptTestingActive && !isTestMode) {
      return;
    }

    // Nếu sự kiện bị tắt và không phải đang test thủ công, không xử lý
    if (currentEvConfig.active === false && !isTestMode) {
      return;
    }

    try {
      // 1. XỬ LÝ SỰ KIỆN BÌNH LUẬN (COMMENT) - BỘ NÃO AI GEMINI FLASH + QUY TRÌNH 4 BƯỚC
      if (type === 'COMMENT') {
        const commentText = (payload?.text || payload?.comment || '').trim();
        
        // 📌 TỰ ĐỘNG GHIM SẢN PHẨM KHI KHÁCH HÀNG COMMENT MÃ SỐ / TÊN SP / TỪ KHÓA
        if (commentText) {
          autoPinProductService.detectAndAutoPinByText(commentText, 'viewer_comment');
        }

        const commentConfig = configs.comment || {};
        const scriptConfig = configs.script_broadcast || configs.checkout || {};
        const checkoutConfig = configs.checkout || {};
        const replySource = scriptConfig.commentReplySource || checkoutConfig.commentReplySource || 'knowledge_base';
        const replyMode = commentConfig.commentReplyMode || 'hybrid';
        const useKw = commentConfig.useKeywords !== false && replyMode !== 'ai_only';
        const useAi = commentConfig.useAiBrain !== false && replyMode !== 'keywords_only';

        // 🛡️ A1. BỘ LỌC THÔNG MINH AI (SMART SPAM / TOXIC / GIBBERISH FILTER)
        if (commentConfig.smartFilterSpam !== false && !isTestMode && commentText) {
          const spamCheck = isSmartSpamOrToxicComment(commentText);
          if (spamCheck.isFiltered) {
            console.log('🛡️ [AvaLive AI] Đã lọc và bỏ qua bình luận rác / spam / thô tục:', commentText, spamCheck.reason);
            setIsProcessingEvent(false);
            return;
          }
        }

        // ⏱️ A2. KIỂM TRA GIÃN CÁCH TRẢ LỜI BÌNH LUẬN (10s – 120s)
        const cooldownSec = Math.max(10, Math.min(120, parseInt(commentConfig.commentReplyCooldown) || 15));
        const now = Date.now();
        if (!isTestMode && (now - lastCommentReplyTimeRef.current < cooldownSec * 1000)) {
          console.log(`⏱️ [AvaLive AI] Đang trong khoảng giãn cách (${cooldownSec}s), bỏ qua dồn dập.`);
          setIsProcessingEvent(false);
          return;
        }
        lastCommentReplyTimeRef.current = now;

        // A3. Kiểm tra từ khóa bị cấm (Banned Words)
        if (commentConfig.bannedWords && !isTestMode) {
          const bannedList = commentConfig.bannedWords.split(/[\n;,]/).map(w => w.trim().toLowerCase()).filter(Boolean);
          if (bannedList.some(b => commentText.toLowerCase().includes(b))) {
            setIsProcessingEvent(false);
            return; // Bỏ qua comment chứa từ cấm
          }
        }

        // BƯỚC 1: TIỀN TỐ ĐỌC LẠI BÌNH LUẬN / CÂU HỎI CỦA KHÁCH
        let repeatPrefix = '';
        if (commentConfig.repeatCommentFirst !== false && commentText) {
          const tpl = commentConfig.repeatCommentPrefix || 'Dạ bạn {user} vừa hỏi là: "{comment}". ';
          repeatPrefix = fillTemplate(tpl, { user: userName, comment: commentText });
        }

        let bodyAnswer = '';
        let isHandled = false;
        const lowerComment = commentText.toLowerCase();

        // BƯỚC 2: PHẢN HỒI THEO KHO TRI THỨC DOANH NGHIỆP & SẢN PHẨM (AI KNOWLEDGE BASE)
        const company = scriptConfig.companyName || checkoutConfig.companyName || 'Shop';
        const product = scriptConfig.productName || checkoutConfig.productName || 'Sản phẩm';
        const price = scriptConfig.productPrice || checkoutConfig.productPrice || 'ưu đãi cực sốc';
        const promo = scriptConfig.promotions || checkoutConfig.promotions || 'freeship toàn quốc';
        const features = scriptConfig.keyFeatures || checkoutConfig.keyFeatures || 'chất lượng cao, cam kết chính hãng';
        const warranty = scriptConfig.warrantyPolicy || checkoutConfig.warrantyPolicy || 'bảo hành đổi trả uy tín';

        if (useKw && (replySource === 'knowledge_base' || replySource === 'both')) {
          if (lowerComment.includes('giá') || lowerComment.includes('bao nhiêu') || lowerComment.includes('tiền') || lowerComment.includes('chi phí') || lowerComment.includes('sale')) {
            bodyAnswer = `Sản phẩm ${product} của ${company} đang có giá ${price} kèm khuyến mãi: ${promo}. Bạn bấm ngay vào giỏ hàng góc trái màn hình để nhận ưu đãi nha!`;
            isHandled = true;
          } else if (lowerComment.includes('bảo hành') || lowerComment.includes('đổi trả') || lowerComment.includes('ship') || lowerComment.includes('giao hàng') || lowerComment.includes('vận chuyển')) {
            bodyAnswer = `Bạn yên tâm nha, bên em có chính sách: ${warranty} và hỗ trợ giao hàng tận nơi ạ!`;
            isHandled = true;
          } else if (lowerComment.includes('mua') || lowerComment.includes('đặt hàng') || lowerComment.includes('chốt') || lowerComment.includes('lấy') || lowerComment.includes('order')) {
            bodyAnswer = `Em cảm ơn bạn đã tin tưởng ${company}! Bạn bấm trực tiếp vào giỏ hàng góc trái màn hình để chốt đơn ${product} nhận ngay mã quà tặng nha!`;
            isHandled = true;
          } else if (lowerComment.includes('dùng') || lowerComment.includes('tính năng') || lowerComment.includes('chức năng') || lowerComment.includes('sao') || lowerComment.includes('như thế nào') || lowerComment.includes('chất liệu') || lowerComment.includes('công dụng')) {
            bodyAnswer = `${product} nổi bật với tính năng: ${features.split('\n')[0] || features}. Sử dụng rất thích và hiệu quả cao ạ!`;
            isHandled = true;
          }
        }

        // C. Kiểm tra kịch bản Chốt Đơn (Checkout Products)
        if (!isHandled && checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
          for (const prod of checkoutConfig.checkoutProducts) {
            if (prod.active !== false && prod.keywords) {
              const kws = prod.keywords.toLowerCase().split(/[;,]/).map(k => k.trim()).filter(Boolean);
              if (kws.some(k => commentText.toLowerCase().includes(k)) || (prod.productName && commentText.toLowerCase().includes(prod.productName.toLowerCase()))) {
                isHandled = true;
                if (prod.sampleAnswers) {
                  bodyAnswer = fillTemplate(getRandomSample(prod.sampleAnswers), { user: userName, comment: commentText, product: prod.productName });
                } else {
                  bodyAnswer = `Sản phẩm ${prod.productName || 'này'} đang có ưu đãi cực sốc trong giỏ hàng góc trái màn hình, bạn bấm vào đặt hàng ngay nhé!`;
                }
                shouldAction = 'gift_reaction';
                break;
              }
            }
          }
        }

        // D. Kiểm tra bộ quy tắc từ khóa (Keyword Rules)
        if (!isHandled && commentConfig.active !== false && useKw) {
          if (Array.isArray(commentConfig.keywordRules) && commentConfig.keywordRules.length > 0) {
            for (const rule of commentConfig.keywordRules) {
              if (rule.enabled !== false && rule.keywords) {
                const kwArr = Array.isArray(rule.keywords) ? rule.keywords : String(rule.keywords).split(/[,;]/);
                const matched = kwArr.some(k => k.trim() && lowerComment.includes(k.trim().toLowerCase()));
                if (matched && rule.replyText) {
                  bodyAnswer = fillTemplate(rule.replyText, { user: userName, comment: commentText });
                  isHandled = true;
                  break;
                }
              }
            }
          }
        }

        // E. BỘ NÃO AI SÁNG TẠO / TRẢ LỜI MỌI CÂU HỎI THÔNG MINH KHI KHÔNG KHỚP TỪ KHÓA
        if (!isHandled) {
          if (lowerComment.includes('xinh') || lowerComment.includes('đẹp') || lowerComment.includes('dễ thương')) {
            bodyAnswer = `Em cảm ơn lời khen cực kỳ ngọt ngào của bạn ${userName} nha! Chúc bạn xem livestream thật vui và săn được nhiều deal hời cùng shop ạ!`;
            isHandled = true;
          } else if (replyMode === 'keywords_only' && !useAi && commentConfig.sampleAnswers) {
            const rawSample = getRandomSample(commentConfig.sampleAnswers);
            bodyAnswer = fillTemplate(rawSample, { user: userName, comment: commentText });
            isHandled = true;
          } else if (useAi && commentConfig.useAi !== false) {
            // GỌI BỘ NÃO AI GEMINI FLASH PHÂN TÍCH & TRẢ LỜI CÂU HỎI THÔNG MINH
            try {
              const liveContext = `Livestream bán hàng và tương tác trực tuyến. Sản phẩm chính: ${product}. Giá: ${price}. Ưu đãi: ${promo}. Tính năng: ${features}. Cửa hàng: ${company}.`;
              const aiPrompt = commentConfig.aiPrompt 
                ? fillTemplate(commentConfig.aiPrompt, { user: userName, comment: commentText, product })
                : `Khán giả "${userName}" vừa hỏi trên livestream: "${commentText}". Hãy trả lời ngắn gọn, thông minh, lịch sự, thân thiện trong 1-2 câu ngắn (tối đa 25 từ). Tự xưng là "em" và gọi khán giả là "bạn ${userName}".`;

              const aiRes = await askGeminiLiveAi({
                question: commentText,
                username: userName,
                role: commentConfig.ttsVoiceRole || 'assistant',
                context: `${liveContext}. Chỉ đạo AI: ${aiPrompt}`
              });

              if (aiRes && aiRes.text && aiRes.text.trim()) {
                bodyAnswer = aiRes.text.trim();
                isHandled = true;
              }
            } catch (aiErr) {
              console.warn('AI Brain call error:', aiErr);
            }
          }

          // Fallback khéo léo thông minh nếu AI ngoại tuyến hoặc không trả lời
          if (!isHandled) {
            if (commentConfig.useUnknownFallbackReply !== false) {
              const fbTpl = commentConfig.unknownFallbackReply || 'Dạ bạn {user} ơi, câu hỏi này em xin phép ghi nhận lại để phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!';
              bodyAnswer = fillTemplate(fbTpl, { user: userName, comment: commentText });
              isHandled = true;
            } else if (commentConfig.sampleAnswers) {
              const rawSample = getRandomSample(commentConfig.sampleAnswers);
              bodyAnswer = fillTemplate(rawSample, { user: userName, comment: commentText });
              isHandled = true;
            } else {
              bodyAnswer = `Dạ em cảm ơn câu hỏi của bạn ${userName} nha! Shop đã nhận được và hỗ trợ mình ngay ạ!`;
              isHandled = true;
            }
          }
        }

        // BƯỚC 4: HẬU TỐ CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN (INBOX SHOP)
        let followUpPart = '';
        if (commentConfig.appendFollowUpQuestion !== false) {
          const tpl = commentConfig.followUpQuestionText || ' Dạ không biết bạn {user} có cần em hỗ trợ thêm điều gì nữa không ạ? Bạn có thể nhắn tin trực tiếp cho shop để nhận tư vấn chi tiết và nhiều ưu đãi nha!';
          followUpPart = fillTemplate(tpl, { user: userName, comment: commentText });
        }

        // GHÉP TOÀN BỘ CÂU THOẠI 4 BƯỚC HOÀN HẢO
        replyText = `${repeatPrefix} ${bodyAnswer} ${followUpPart}`.replace(/\s+/g, ' ').trim();
      }

      // 2. XỬ LÝ SỰ KIỆN QUÀ TẶNG (GIFT)
      else if (type === 'GIFT') {
        const giftName = payload?.gift || payload?.giftName || 'quà';
        const count = payload?.count || 1;
        const giftConfig = configs.gift || {};
        const specialGiftConfig = configs.special_gift || {};

        // Kiểm tra slot quà đặc biệt
        let isSpecialGift = false;
        if (specialGiftConfig.active !== false && Array.isArray(specialGiftConfig.specialGiftSlots)) {
          const matchedSlot = specialGiftConfig.specialGiftSlots.find(s => s.active !== false && s.giftName && giftName.toLowerCase().includes(s.giftName.toLowerCase().split('(')[0].trim()));
          if (matchedSlot) {
            isSpecialGift = true;
            shouldAction = 'gift_reaction';
            if (matchedSlot.sampleAnswers) {
              replyText = fillTemplate(getRandomSample(matchedSlot.sampleAnswers), { user: userName, gift_name: giftName, count });
            } else {
              replyText = `Ôi đỉnh quá! Em cảm ơn đại gia ${userName} vừa tặng siêu phẩm ${giftName} cực khủng cho em nha! Yêu bạn nhiều lắm luôn!`;
            }
          }
        }

        // Kiểm tra các slot quà thường
        if (!isSpecialGift && giftConfig.active !== false) {
          shouldAction = 'gift_reaction';
          if (Array.isArray(giftConfig.giftSlots) && giftConfig.giftSlots.length > 0) {
            const activeGiftSlot = giftConfig.giftSlots.find(gs => gs.active !== false && gs.sampleAnswers);
            if (activeGiftSlot && activeGiftSlot.sampleAnswers) {
              replyText = fillTemplate(getRandomSample(activeGiftSlot.sampleAnswers), { user: userName, gift_name: giftName, count });
            } else if (giftConfig.sampleAnswers) {
              replyText = fillTemplate(getRandomSample(giftConfig.sampleAnswers), { user: userName, gift_name: giftName, count });
            } else {
              replyText = `Ôi em cảm ơn bạn ${userName} đã gửi tặng ${giftName} x${count} cho em nha! Cảm ơn món quà vô cùng ngọt ngào của bạn!`;
            }
          } else if (giftConfig.sampleAnswers) {
            replyText = fillTemplate(getRandomSample(giftConfig.sampleAnswers), { user: userName, gift_name: giftName, count });
          } else {
            replyText = `Ôi em cảm ơn bạn ${userName} đã gửi tặng ${giftName} x${count} cho em nha! Cảm ơn món quà vô cùng ngọt ngào của bạn!`;
          }
        }
      }

      // 3. XỬ LÝ CHÀO NGƯỜI MỚI (VIEWER_JOIN / WELCOME) - DUYỆT TUẦN TỰ VÒNG TRÒN KHÔNG TRÙNG LẶP
      else if (type === 'VIEWER_JOIN') {
        const welcomeConfig = configs.welcome || {};
        if (welcomeConfig.active !== false) {
          if (welcomeConfig.sampleAnswers) {
            replyText = fillTemplate(getSequentialSample(welcomeConfig.sampleAnswers, welcomeIndexRef, 'Dạ em chào bạn {user} mới vào xem live nha!'), { user: userName, count: 1 });
          } else {
            replyText = `Dạ em chào bạn ${userName} mới vào xem live nha! Chúc bạn có những phút giây xem live thật vui vẻ ạ!`;
          }
        }
      }

      // 4. XỬ LÝ THEO DÕI KÊNH (FOLLOW)
      else if (type === 'FOLLOW') {
        const followConfig = configs.follow || {};
        if (followConfig.active !== false) {
          if (followConfig.sampleAnswers) {
            replyText = fillTemplate(getRandomSample(followConfig.sampleAnswers), { user: userName });
          } else {
            replyText = `Dạ em cảm ơn bạn ${userName} vừa nhấn theo dõi kênh của em nha! Nhớ bật thông báo để đón xem các phiên live tiếp theo nhé!`;
          }
        }
      }

      // 5. XỬ LÝ CHIA SẺ LIVE (SHARE)
      else if (type === 'SHARE') {
        const shareConfig = configs.share || {};
        if (shareConfig.active !== false) {
          if (shareConfig.sampleAnswers) {
            replyText = fillTemplate(getRandomSample(shareConfig.sampleAnswers), { user: userName });
          } else {
            replyText = `Em cảm ơn bạn ${userName} đã chia sẻ phiên livestream này đến bạn bè nha! Yêu bạn nhiều!`;
          }
        }
      }

      // 6. XỬ LÝ CẢM ƠN TIM (LIKE / THANKS_HEART)
      else if (type === 'LIKE') {
        const heartConfig = configs.thanks_heart || {};
        if (heartConfig.active !== false) {
          if (heartConfig.sampleAnswers) {
            replyText = fillTemplate(getRandomSample(heartConfig.sampleAnswers), { user: userName, milestone: payload?.count || '1000' });
          } else {
            replyText = `Em cảm ơn mọi người đã thả tim nhiệt tình cho em nha! Cả nhà bấm liên tục vào màn hình giúp em đẩy tương tác live nhé!`;
          }
        }
      }

      // 7. XỬ LÝ CHỐT ĐƠN THÀNH CÔNG (PURCHASE)
      else if (type === 'PURCHASE') {
        const checkoutConfig = configs.checkout || {};
        shouldAction = 'gift_reaction';
        if (checkoutConfig.sampleAnswers) {
          replyText = fillTemplate(getRandomSample(checkoutConfig.sampleAnswers), { user: userName, item: payload?.item || 'sản phẩm' });
        } else {
          replyText = `Chúc mừng và cảm ơn bạn ${userName} đã chốt đơn thành công ${payload?.item || 'sản phẩm'} nha! Đơn hàng sẽ được đóng gói gửi đi sớm nhất ạ!`;
        }
      }

      // 8. ĐẠO DIỄN NHẮC THOẠI / KÊU GỌI (ASSISTANT_PROMPT / CALL_TO_ACTION)
      else if (type === 'ASSISTANT_PROMPT') {
        replyText = payload?.prompt || 'Dạ vâng, em cảm ơn tất cả các bạn đang theo dõi phiên live ạ!';
      } else if (type === 'CALL_TO_ACTION') {
        const ctaConfig = configs.call_to_action || {};
        if (ctaConfig.sampleAnswers) {
          replyText = getRandomSample(ctaConfig.sampleAnswers);
        } else {
          replyText = `Mọi người ơi, hãy thả tim và bình luận nhiệt tình để cùng đẩy phiên live lên xu hướng nhé! Yêu cả nhà!`;
        }
      }

      // 9. XỬ LÝ NÓI CHUYỆN AI / DẪN CHUYỆN (TALKING / AI_TALK)
      else if (type === 'TALKING' || type === 'AI_TALK') {
        const talkingConfig = configs.talking || {};
        if (talkingConfig.active !== false) {
          if (talkingConfig.useAi !== false) {
            try {
              const aiRes = await askGeminiLiveAi({
                question: payload?.topic || 'Hãy chia sẻ một câu chuyện ngắn hài hước hoặc một mẹo hữu ích thu hút người xem livestream',
                username: userName || 'cả nhà',
                role: 'idol',
                context: 'Idol đang livestream nói chuyện giao lưu cùng người xem'
              });
              if (aiRes?.text) replyText = aiRes.text;
            } catch (e) {}
          }
          if (!replyText && talkingConfig.sampleAnswers) {
            replyText = getRandomSample(talkingConfig.sampleAnswers);
          }
          if (!replyText) {
            replyText = payload?.text || 'Chào mọi người, hôm nay thật vui được đồng hành cùng cả nhà! Mọi người có câu hỏi hay muốn giao lưu gì cứ bình luận nhé!';
          }
        }
      }

      // 10. XỬ LÝ IM LẶNG - TỰ ĐỘNG NÓI KHUẤY ĐỘNG PHÒNG LIVE (IDLE)
      else if (type === 'IDLE') {
        const idleConfig = configs.idle || {};
        if (idleConfig.active !== false) {
          if (idleConfig.sampleAnswers) {
            replyText = getRandomSample(idleConfig.sampleAnswers);
          } else if (idleConfig.useAi !== false) {
            try {
              const aiRes = await askGeminiLiveAi({
                question: 'Phòng live đang yên ắng trong vài giây, hãy nói 1 câu ngắn gọn sôi động kêu gọi mọi người tương tác hoặc thả tim',
                username: 'cả nhà',
                role: 'idol',
                context: 'Idol livestream hâm nóng không khí'
              });
              if (aiRes?.text) replyText = aiRes.text;
            } catch (e) {}
          }
          if (!replyText) {
            replyText = 'Cả nhà ơi, mọi người bấm liên tục vào màn hình thả tim và để lại bình luận giúp em đẩy tương tác live lên nhé!';
          }
        }
      }

      // 11. XỬ LÝ XIN LỖI KHI BỎ SÓT COMMENT HOẶC LỖI (APOLOGY)
      else if (type === 'APOLOGY') {
        const apologyConfig = configs.apology || {};
        if (apologyConfig.active !== false) {
          if (apologyConfig.sampleAnswers) {
            replyText = getRandomSample(apologyConfig.sampleAnswers);
          } else {
            replyText = 'Cả nhà ơi, đôi khi bình luận đông quá em không chào hết được, có lỡ bỏ sót ai thì mọi người thông cảm cho em nhé. Yêu cả nhà nhiều!';
          }
        }
      }

      // 12. TỰ ĐỘNG TÌM & PHÁT VIDEO CÓ SẴN TRONG KHO MEDIA (PRE-RECORDED VIDEO EVENT)
      let matchedEventVideo = null;
      if (Array.isArray(liveMedia) && liveMedia.length > 0) {
        const targetCategory = currentEvConfig.videoCategory || (evKey === 'welcome' ? 'join' : evKey);
        const targetFolder = currentEvConfig.videoFolder || '';

        // Ưu tiên 1: Khớp folder người dùng chỉ định
        if (targetFolder) {
          matchedEventVideo = liveMedia.find(m => m.type === 'video' && (m.folder === targetFolder || m.name?.toLowerCase().includes(targetFolder.toLowerCase())));
        }
        // Ưu tiên 2: Khớp danh mục video (category)
        if (!matchedEventVideo && targetCategory) {
          matchedEventVideo = liveMedia.find(m => m.type === 'video' && (m.category === targetCategory || m.name?.toLowerCase().includes(targetCategory.toLowerCase())));
        }
        // Ưu tiên 3: Video reaction chung
        if (!matchedEventVideo && (shouldAction === 'gift_reaction' || type === 'GIFT')) {
          matchedEventVideo = liveMedia.find(m => m.type === 'video' && (m.category === 'reaction' || m.category === 'gift'));
        }
      }

      if (matchedEventVideo) {
        if (!previousVideoItem && activeVideoItem && activeVideoItem.id !== matchedEventVideo.id) {
          setPreviousVideoItem(activeVideoItem);
        }
        setActiveVideoItem(matchedEventVideo);
      }

      // 13. PHÁT GIỌNG NÓI VOICE AI & LIP-SYNC (ƯU TIÊN 100% TAB BỘ NÃO -> FALLBACK 14 TÁC VỤ)
      const isCommentVoiceDisabled = evKey === 'comment' && (currentEvConfig.speakVoice === false || currentEvConfig.commentResponseFormat === 'text_only');
      const isCommentTextDisabled = evKey === 'comment' && (currentEvConfig.sendChatText === false || currentEvConfig.commentResponseFormat === 'voice_only');

      // 🛡️ SÀNG LỌC BÌNH LUẬN: Bình luận sáo rỗng ("hi", "123", "chấm"...) chỉ trả lời bằng chữ, KHÔNG dừng giọng đọc kịch bản AI
      const isCommentType = type === 'COMMENT';
      const isCommentMeaningful = isCommentType ? isMeaningfulCommercialOrEngagingComment(payload?.text || payload?.comment || '') : true;

      const shouldSpeakVoice = !isCommentVoiceDisabled && (isTestMode || (isCommentType ? isCommentMeaningful : true)) && ((currentEvConfig.useVoice !== false) || isTestMode);
      const shouldSendChat = !isCommentTextDisabled;
      const targetVoiceRole = isTestMode ? 'idol' : (currentEvConfig.ttsVoiceRole || (evKey === 'comment' ? 'comment' : evKey === 'checkout' ? 'manager' : 'idol'));
      const effectiveVoice = resolveEffectiveVoice(targetVoiceRole, isTestMode ? null : currentEvConfig.voiceId, currentEvConfig.avatarId);

      if (replyText && replyText.trim()) {
        if (shouldSendChat) {
          setViewerHistory(prev => [
            ...prev, 
            { 
              time: new Date().toLocaleTimeString(), 
              type, 
              payload, 
              ai_intent: 'STRUCTURED_CONFIG', 
              ai_reply: replyText 
            }
          ].slice(-20));
        }

        if (shouldSpeakVoice && onVoiceReply) {
          onVoiceReply({
            text: replyText,
            action: shouldAction,
            baseVideoItem: matchedEventVideo || activeVideoItem,
            preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null),
            voiceId: effectiveVoice.id,
            voiceObj: effectiveVoice,
            voiceChannel: targetVoiceRole,
            isTest: isTestMode
          });
        }
      } else {
        // Không có cấu hình kịch bản phản hồi -> Bỏ qua và kết thúc sự kiện
        setIsProcessingEvent(false);
      }
    } catch (err) {
      console.warn('Lỗi xử lý sự kiện live kịch bản:', err);
      setIsProcessingEvent(false);
    }
  };

  // Gọi hàm này từ AIAudioPlayer khi đã load xong LipSync Video hoặc Reaction Video
  const handleActionVideoReady = (videoUrl, isLipSync) => {
    if (isLipSync) {
      setLipSyncVideoUrl(videoUrl);
    } else {
      // Tìm video reaction trong kho
      // (Bản demo đơn giản: AIAudioPlayer tự manage, hook này chỉ cấp state)
    }
  };

  const handleVideoEnded = () => {
    setIsProcessingEvent(false);
    if (lipSyncVideoUrl) {
      setLipSyncVideoUrl(null); // Trở về video nền
    } else if (previousVideoItem) {
      setActiveVideoItem(previousVideoItem);
      setPreviousVideoItem(null);
    } else {
      // Về mặc định video gốc mà người dùng đã chọn
      setActiveVideoItem(null);
    }
  };

  return {
    liveMedia,
    activeVideoItem,
    lipSyncVideoUrl,
    viewerHistory,
    isProcessingEvent,
    handleLiveEvent,
    handleVideoEnded,
    handleActionVideoReady,
    setLipSyncVideoUrl,
    setActiveVideoItem,
    setPreviousVideoItem,
    setViewerHistory
  };
}
