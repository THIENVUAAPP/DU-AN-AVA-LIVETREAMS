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
      console.error('Lỗi xử lý sự kiện:', err);
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
