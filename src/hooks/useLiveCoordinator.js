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
  try {
    const raw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
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

  // Hàm xử lý sự kiện chính (theo đúng 100% kịch bản người dùng đã cài đặt trong Workspace)
  const handleLiveEvent = async (type, payload) => {
    if (!type) return;

    const configs = getSavedEventConfigs() || {};

    if (type === 'VIEWER_JOIN') {
      const viewerName = (payload?.name || '').trim().toLowerCase();
      if (!viewerName || viewerName === 'khách mới' || greetedViewersRef.current.has(viewerName)) {
        return; // Đã chào rồi, không chào lặp lại cùng 1 người
      }
      greetedViewersRef.current.add(viewerName);
      if (greetedViewersRef.current.size > 500) {
        const first = greetedViewersRef.current.values().next().value;
        greetedViewersRef.current.delete(first);
      }
    }

    setIsProcessingEvent(true);
    resetIdleTimer();

    let replyText = '';
    let shouldAction = 'none';
    const userName = (payload?.name || payload?.username || 'Bạn').trim();

    try {
      // 1. XỬ LÝ SỰ KIỆN BÌNH LUẬN (COMMENT)
      if (type === 'COMMENT') {
        const commentText = (payload?.text || payload?.comment || '').trim();
        const commentConfig = configs.comment || {};
        const checkoutConfig = configs.checkout || {};

        // A. Kiểm tra từ khóa bị cấm (Banned Words)
        if (commentConfig.bannedWords) {
          const bannedList = commentConfig.bannedWords.split(/[\n;,]/).map(w => w.trim().toLowerCase()).filter(Boolean);
          if (bannedList.some(b => commentText.toLowerCase().includes(b))) {
            setIsProcessingEvent(false);
            return; // Bỏ qua comment chứa từ cấm
          }
        }

        // B. Kiểm tra kịch bản Chốt Đơn (Checkout Products)
        let isCheckoutMatched = false;
        if (checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
          for (const prod of checkoutConfig.checkoutProducts) {
            if (prod.active !== false && prod.keywords) {
              const kws = prod.keywords.toLowerCase().split(/[;,]/).map(k => k.trim()).filter(Boolean);
              if (kws.some(k => commentText.toLowerCase().includes(k)) || (prod.productName && commentText.toLowerCase().includes(prod.productName.toLowerCase()))) {
                isCheckoutMatched = true;
                // Nếu có câu trả lời mẫu cho sản phẩm
                if (prod.sampleAnswers) {
                  replyText = fillTemplate(getRandomSample(prod.sampleAnswers), { user: userName, comment: commentText, product: prod.productName });
                } else if (prod.aiPrompt) {
                  replyText = `Dạ bạn ${userName} ơi, sản phẩm ${prod.productName || ''} đang có ưu đãi cực sốc trong giỏ hàng góc trái màn hình, bạn bấm vào xem chi tiết và đặt ngay nhé!`;
                } else {
                  replyText = `Dạ em chào bạn ${userName}! Mẫu ${prod.productName || 'này'} đang có sẵn trong giỏ hàng góc trái, bạn bấm vào giỏ hàng để chọn size và nhận mã freeship nha!`;
                }
                shouldAction = 'gift_reaction';
                break;
              }
            }
          }
        }

        // C. Nếu không khớp Chốt Đơn, xử lý theo kịch bản Bình Luận (Comment Rules)
        if (!isCheckoutMatched && commentConfig.active !== false) {
          if (commentConfig.sampleAnswers) {
            const rawSample = getRandomSample(commentConfig.sampleAnswers);
            replyText = fillTemplate(rawSample, { user: userName, comment: commentText });
          } else {
            // Câu trả lời ngữ cảnh thông minh tự nhiên
            const lowerComment = commentText.toLowerCase();
            if (lowerComment.includes('giá') || lowerComment.includes('mua') || lowerComment.includes('size') || lowerComment.includes('hàng')) {
              replyText = `Dạ bạn ${userName} ơi, mẫu này đang có giá cực ưu đãi trong giỏ hàng góc trái màn hình, bạn bấm vào xem chi tiết ngay nhé!`;
            } else if (lowerComment.includes('xinh') || lowerComment.includes('đẹp') || lowerComment.includes('chào') || lowerComment.includes('dễ thương')) {
              replyText = `Dạ em cảm ơn bạn ${userName} nhiều nha! Bạn comment làm em có thêm bao nhiêu năng lượng luôn á!`;
            } else {
              replyText = `Dạ em chào bạn ${userName}, em đã thấy bình luận của bạn rồi nha! Cảm ơn bạn đã tương tác với live ạ!`;
            }
          }
        }
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

        if (!isSpecialGift && giftConfig.active !== false) {
          shouldAction = 'gift_reaction';
          if (giftConfig.sampleAnswers) {
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

      // 9. PHÁT GIỌNG NÓI VOICE AI & LIP-SYNC KHI CÓ CÂU TRẢ LỜI
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
          baseVideoItem: activeVideoItem,
          preRecordedCat: shouldAction === 'gift_reaction' ? 'reaction' : null
        });
      }
    } catch (err) {
      console.warn('Lỗi xử lý sự kiện live kịch bản:', err);
    } finally {
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
    if (lipSyncVideoUrl) {
      setLipSyncVideoUrl(null); // Trở về video nền
    } else if (previousVideoItem) {
      setActiveVideoItem(previousVideoItem);
      setPreviousVideoItem(null);
    } else {
      // Loop video nền (story)
      const storyItems = liveMedia.filter(i => i.category === 'story' && i.type === 'video');
      if (storyItems.length > 0) {
        setActiveVideoItem(storyItems[Math.floor(Math.random() * storyItems.length)]);
      }
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
