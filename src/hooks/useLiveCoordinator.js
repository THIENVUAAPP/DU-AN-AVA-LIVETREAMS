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

  // Hàm xử lý sự kiện chính (gọi API Gemini)
  const handleLiveEvent = async (type, payload) => {
    if (!isConnected) return;
    setIsProcessingEvent(true);
    resetIdleTimer(); // reset lại timer mỗi khi có event

    try {
      const res = await fetch('/api/process-live-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain: 'gemini',
          model: localStorage.getItem('gemini_model') || 'gemini-1.5-flash',
          apiKey: localStorage.getItem('gemini_api_key'),
          eventType: type,
          payload,
          viewerHistory,
          brainPack: activeBrainPack,
          systemPrompt: localStorage.getItem(`aidol_prompt_${activeBrainPack}`) || ''
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Lưu lịch sử
      setViewerHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), type, payload, ai_intent: data.intent, ai_reply: data.replyText }].slice(-10));

      let shouldPlayPreRecordedReaction = false;
      let targetReactionCat = null;

      if (data.shouldTriggerAction === 'dance' || data.shouldTriggerAction === 'gift_reaction') {
        shouldPlayPreRecordedReaction = true;
        targetReactionCat = data.shouldTriggerAction === 'dance' ? 'dance' : 'reaction';
      }

      // Xử lý Audio/Video
      if (data.replyText) {
        // Nếu AI trả về text, gọi TTS và LipSync
        onVoiceReply({
          text: data.replyText, 
          action: data.shouldTriggerAction,
          baseVideoItem: activeVideoItem, // Truyền video hiện tại để làm base cho LipSync
          preRecordedCat: shouldPlayPreRecordedReaction ? targetReactionCat : null
        });
      }

      // Đổi video reaction nếu cần và nếu KO dùng lipsync đè lên (để sau khi lipsync xong nó chạy video reaction)
      // Nhưng thường LipSync sẽ đè lên reaction. Tuỳ logic bên AIAudioPlayer.
      
    } catch (err) {
      console.warn('Lỗi gọi API Live Event, kích hoạt phản hồi mô phỏng thông minh:', err);
      // Xử lý phản hồi giả lập thông minh khi chưa có API Key hoặc mạng chập chờn
      let fallbackReply = '';
      let shouldAction = 'none';

      if (type === 'VIEWER_JOIN') {
        fallbackReply = `Dạ em chào anh/chị ${payload?.name || 'bạn'} mới vào xem live nha! Chúc bạn có buổi tối xem live vui vẻ ạ!`;
      } else if (type === 'GIFT') {
        fallbackReply = `Ôi em cảm ơn ${payload?.name || 'bạn'} đã tặng ${payload?.gift || 'quà'} cho em nha! Yêu bạn nhiều lắm luôn ạ!`;
        shouldAction = 'gift_reaction';
      } else if (type === 'COMMENT') {
        const text = payload?.text || '';
        if (text.toLowerCase().includes('giá') || text.toLowerCase().includes('mua') || text.toLowerCase().includes('size') || text.toLowerCase().includes('hàng')) {
          fallbackReply = `Dạ ${payload?.name || 'bạn'} ơi, mẫu này đang có giá cực ưu đãi trong giỏ hàng góc trái màn hình, bạn bấm vào xem chi tiết ngay nhé!`;
        } else if (text.toLowerCase().includes('xinh') || text.toLowerCase().includes('đẹp') || text.toLowerCase().includes('chào')) {
          fallbackReply = `Dạ em cảm ơn ${payload?.name || 'bạn'} nhiều nha! Bạn comment làm em có thêm bao nhiêu năng lượng luôn á!`;
        } else {
          fallbackReply = `Dạ em chào ${payload?.name || 'bạn'}, em đã thấy bình luận của bạn rồi nha!`;
        }
      } else if (type === 'PURCHASE') {
        fallbackReply = `Chúc mừng và cảm ơn ${payload?.name || 'quý khách'} đã chốt đơn thành công ${payload?.item || 'sản phẩm'} nha! Đơn hàng sẽ được đóng gói gửi đi sớm nhất ạ!`;
        shouldAction = 'gift_reaction';
      } else if (type === 'LIKE') {
        fallbackReply = `Em cảm ơn mọi người đã thả tim nhiệt tình cho em nha! Cả nhà bấm liên tục vào màn hình giúp em đạt mục tiêu hôm nay nhé!`;
      } else if (type === 'FOLLOW') {
        fallbackReply = `Dạ em cảm ơn ${payload?.name || 'bạn'} vừa bấm theo dõi kênh của em nha! Nhớ bật thông báo để đón xem các phiên live tiếp theo nhé!`;
      } else if (type === 'SHARE') {
        fallbackReply = `Cảm ơn ${payload?.name || 'bạn'} đã chia sẻ phiên livestream này đến bạn bè nha!`;
      } else if (type === 'ASSISTANT_PROMPT') {
        fallbackReply = payload?.prompt || 'Dạ vâng, em cảm ơn tất cả các anh chị đang theo dõi phiên live ạ!';
      }

      if (fallbackReply) {
        setViewerHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), type, payload, ai_intent: 'SIMULATED', ai_reply: fallbackReply }].slice(-10));
        onVoiceReply({
          text: fallbackReply,
          action: shouldAction,
          baseVideoItem: activeVideoItem,
          preRecordedCat: shouldAction === 'gift_reaction' ? 'reaction' : null
        });
      }
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
