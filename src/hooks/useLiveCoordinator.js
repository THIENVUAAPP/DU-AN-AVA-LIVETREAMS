import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllLiveMedia } from '../lib/liveKhoDB';

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
    idleTimerRef.current = setTimeout(() => {
      handleLiveEvent('IDLE', { note: 'No user interaction for 45s' });
    }, 45000); // 45s
  }, [isConnected]);

// Helper đọc cấu hình sự kiện đã lưu từ WorkspaceTacVu
function getSavedEventConfigs() {
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
          productName: 'aidol',
          keywords: 'aidol;phần mềm;giá;liên hệ;bao nhiêu',
          videoFolder: 'bình luận',
          supportVideoFolder: '',
          useAi: true,
          useTTS: true,
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
      muteSourceVideo: true,
      videoCategory: 'comment',
      useAi: true,
      commentReplyMode: 'hybrid',
      repeatCommentFirst: true,
      repeatCommentPrefix: 'Dạ bạn {user} vừa hỏi là: "{comment}". ',
      unknownFallbackReply: 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!',
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

  try {
    const raw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultEventConfigs, ...parsed };
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

function fillTemplate(template, vars = {}) {
  let result = template || '';
  Object.keys(vars).forEach(key => {
    const regex = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(regex, vars[key]);
  });
  return result;
}

  // Hàm kích hoạt xử lý sự kiện Live từ TikTok / Chat / Giả lập
  const handleLiveEvent = (type, payload) => {
    if (!isConnected) return;
    resetIdleTimer();

    const configs = getSavedEventConfigs();
    let replyText = '';
    let shouldAction = null;
    const userName = (payload?.name || payload?.username || 'Bạn').trim();

    try {
      // 1. XỬ LÝ SỰ KIỆN BÌNH LUẬN (COMMENT) - QUY TRÌNH 4 BƯỚC THÔNG MINH
      if (type === 'COMMENT') {
        const commentText = (payload?.text || payload?.comment || '').trim();
        const commentConfig = configs.comment || {};
        const scriptConfig = configs.script_broadcast || configs.checkout || {};
        const checkoutConfig = configs.checkout || {};
        const replySource = scriptConfig.commentReplySource || checkoutConfig.commentReplySource || 'knowledge_base';
        const replyMode = commentConfig.commentReplyMode || 'hybrid';

        // A. Kiểm tra từ khóa bị cấm (Banned Words)
        if (commentConfig.bannedWords) {
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

        if (replyMode !== 'ai_only' || replySource === 'knowledge_base' || replySource === 'both') {
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
        if (!isHandled && commentConfig.active !== false && replyMode !== 'ai_only') {
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

        // E. BỘ NÃO AI SÁNG TẠO / XỬ LÝ KHÉO LÉO KHI KHÔNG BIẾT CÂU HỎI
        if (!isHandled) {
          if (lowerComment.includes('xinh') || lowerComment.includes('đẹp') || lowerComment.includes('chào') || lowerComment.includes('dễ thương') || lowerComment.includes('hello') || lowerComment.includes('hi')) {
            bodyAnswer = `Em cảm ơn bạn rất nhiều nha! Chúc bạn xem livestream thật vui và săn được nhiều deal hời cùng shop ạ!`;
            isHandled = true;
          } else if (commentConfig.sampleAnswers && replyMode === 'keywords_only') {
            const rawSample = getRandomSample(commentConfig.sampleAnswers);
            bodyAnswer = fillTemplate(rawSample, { user: userName, comment: commentText });
            isHandled = true;
          } else if (replyMode === 'keywords_only') {
            // Chế độ chỉ kịch bản từ khóa mà không khớp -> dùng câu fallback khéo léo
            const fbTpl = commentConfig.unknownFallbackReply || 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!';
            bodyAnswer = fillTemplate(fbTpl, { user: userName, comment: commentText });
            isHandled = true;
          } else {
            // BỘ NÃO AI PHÂN TÍCH THÔNG MINH HOẶC DÙNG Ô XỬ LÝ KHÉO LÉO (FALLBACK)
            const fbTpl = commentConfig.unknownFallbackReply || 'Dạ bạn {user} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để hỏi lại shop và phản hồi chi tiết cho mình sau nha! Bạn có thể nhắn tin (inbox) trực tiếp cho shop để nhận hỗ trợ nhanh nhất ạ!';
            bodyAnswer = fillTemplate(fbTpl, { user: userName, comment: commentText });
            isHandled = true;
          }
        }

        // BƯỚC 3: HẬU TỐ CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG & CẢM ƠN (INBOX SHOP)
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

      // 3. XỬ LÝ CHÀO NGƯỜI MỚI (VIEWER_JOIN / WELCOME)
      else if (type === 'VIEWER_JOIN') {
        const welcomeConfig = configs.welcome || {};
        if (welcomeConfig.active !== false) {
          if (welcomeConfig.sampleAnswers) {
            replyText = fillTemplate(getRandomSample(welcomeConfig.sampleAnswers), { user: userName, count: 1 });
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

      // 9. TỰ ĐỘNG TÌM & PHÁT VIDEO CÓ SẴN TRONG KHO MEDIA (PRE-RECORDED VIDEO EVENT)
      let matchedEventVideo = null;
      if (Array.isArray(liveMedia) && liveMedia.length > 0) {
        const evKey = type === 'GIFT' ? 'gift' : 
                      type === 'VIEWER_JOIN' ? 'welcome' : 
                      type === 'COMMENT' ? 'comment' : 
                      type === 'LIKE' ? 'thanks_heart' : 
                      type === 'FOLLOW' ? 'follow' : 
                      type === 'PURCHASE' ? 'checkout' : '';
        const evConf = evKey ? (configs[evKey] || {}) : {};
        const targetCategory = evConf.videoCategory || (evKey === 'welcome' ? 'join' : evKey);
        const targetFolder = evConf.videoFolder || '';

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

      // 10. PHÁT GIỌNG NÓI VOICE AI & LIP-SYNC KHI CÓ CÂU TRẢ LỜI
      if (replyText && replyText.trim()) {
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

        onVoiceReply({
          text: replyText,
          action: shouldAction,
          baseVideoItem: matchedEventVideo || activeVideoItem,
          preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null)
        });
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
