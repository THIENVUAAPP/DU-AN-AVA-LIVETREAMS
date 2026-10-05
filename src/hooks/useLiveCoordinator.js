import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllLiveMedia } from '../lib/liveKhoDB';
import { askGeminiLiveAi } from '../lib/geminiClient';
import autoPinProductService from '../utils/autoPinProductService';
import { resolveEffectiveVoice } from '../utils/voiceSyncService';
import { isSmartSpamOrToxicComment, cleanUserNameForSpeech, isMeaningfulCommercialOrEngagingComment } from '../utils/vietnamesePronunciationMaster';
import { syncMasterLiveState, sendVideoControl } from '../lib/masterLiveSync';
import { ensureServerMediaUrl } from '../utils/mediaUploadService';
import { DEFAULT_140_KEYWORD_RULES } from '../utils/defaultSampleKeywordRules';
import { parseUniversalRulePairs } from '../utils/universalDocumentParser';

export function useLiveCoordinator({ isConnected, onVoiceReply, onChatReply, activeBrainPack = 'talk' }) {
  const [liveMedia, setLiveMedia] = useState([]);
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [previousVideoItem, setPreviousVideoItem] = useState(null);
  
  // Trạng thái AI/Video
  const [lipSyncVideoUrl, setLipSyncVideoUrl] = useState(null);
  const [viewerHistory, setViewerHistory] = useState([]);
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const isProcessingEventRef = useRef(false);
  const eventQueueRef = useRef([]);
  const idleTimerRef = useRef(null);
  const greetedViewersRef = useRef(new Map()); // viewerKey -> timestamp (cooldown 60s)
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

  // Lắng nghe cập nhật video chờ (Idle video) từ Workspace Tác Vụ
  useEffect(() => {
    const handleIdleUpdate = (e) => {
      const { videoUrl } = e.detail || {};
      if (videoUrl) {
        setActiveVideoItem({
          id: 'custom_idle_video',
          name: 'Video Chờ Mặc Định',
          mediaUrl: videoUrl,
          url: videoUrl,
          type: 'video'
        });
      }
    };
    window.addEventListener('avalive:idle_video_updated', handleIdleUpdate);
    return () => {
      window.removeEventListener('avalive:idle_video_updated', handleIdleUpdate);
    };
  }, []);

  // 🛡️ LẮNG NGHE TÍN HIỆU TẮT/DỪNG KỊCH BẢN ĐỂ HỦY NGAY BỘ ĐẾM IDLE TIMER
  useEffect(() => {
    const handleStopSignals = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
    const handleStorageChange = (e) => {
      if (e.key === 'aidol_user_paused_script' || e.key === 'avalive_user_paused' || e.key === 'aidol_is_script_live_running') {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
          idleTimerRef.current = null;
        }
      }
    };
    window.addEventListener('aidol_script_updated', handleStopSignals);
    window.addEventListener('avalive_emergency_stop_all', handleStopSignals);
    window.addEventListener('avalive:stop_all_audio_and_voice', handleStopSignals);
    window.addEventListener('global-stop-demo', handleStopSignals);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('aidol_script_updated', handleStopSignals);
      window.removeEventListener('avalive_emergency_stop_all', handleStopSignals);
      window.removeEventListener('avalive:stop_all_audio_and_voice', handleStopSignals);
      window.removeEventListener('global-stop-demo', handleStopSignals);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Xử lý khi bắt đầu kết nối Live (Bảo toàn 100% video/sân khấu của người dùng, không bao giờ tự ý đổi video)
  useEffect(() => {
    if (isConnected) {
      resetIdleTimer();
    } else {
      clearTimeout(idleTimerRef.current);
      setActiveVideoItem(null);
      setLipSyncVideoUrl(null);
    }
    return () => clearTimeout(idleTimerRef.current);
  }, [isConnected]);

  // Vòng lặp Idle (tự động tương tác)
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    if (!isConnected) return;
    
    // 🛡️ BẢO VỆ TUYỆT ĐỐI: Nếu người dùng đã Tắt / Tạm dừng hoặc đang phát kịch bản,
    // HỦY BỎ 100% IDLE TIMER để không bao giờ tự ý nói hoặc xen ngang
    const isUserPaused = typeof localStorage !== 'undefined' && (
      localStorage.getItem('avalive_user_paused') === 'true' || 
      localStorage.getItem('avalive_window_capture_paused') === 'true' ||
      localStorage.getItem('avalive_master_live_running') === 'false'
    );
    if (isUserPaused) {
      return;
    }

    const isScriptActive = (typeof localStorage !== 'undefined' && localStorage.getItem('aidol_is_script_live_running') === 'true') ||
                           (typeof window !== 'undefined' && (window.__isScriptTestingRunning || window.__isScriptLiveRunning));
    if (isScriptActive) {
      return;
    }
    const isScriptStoppedByUser = typeof localStorage !== 'undefined' && (
      localStorage.getItem('aidol_user_paused_script') === 'true' ||
      localStorage.getItem('aidol_is_script_live_running') === 'false'
    );
    if (isScriptStoppedByUser) {
      return;
    }

    const configs = getSavedEventConfigs();
    if (configs.idle?.active === false) return;
    const idleSeconds = Math.max(300, Number(configs.idle?.speakAfterIdleSeconds) || 300);
    idleTimerRef.current = setTimeout(() => {
      const stillUserPaused = typeof localStorage !== 'undefined' && (
        localStorage.getItem('avalive_user_paused') === 'true' || 
        localStorage.getItem('avalive_window_capture_paused') === 'true' ||
        localStorage.getItem('avalive_master_live_running') === 'false'
      );
      if (stillUserPaused) return;

      const stillScriptStopped = typeof localStorage !== 'undefined' && (
        localStorage.getItem('aidol_user_paused_script') === 'true' ||
        localStorage.getItem('aidol_is_script_live_running') === 'false'
      );
      if (stillScriptStopped) return;

      const stillScriptActive = (typeof localStorage !== 'undefined' && localStorage.getItem('aidol_is_script_live_running') === 'true') ||
                                (typeof window !== 'undefined' && (window.__isScriptTestingRunning || window.__isScriptLiveRunning));
      if (stillScriptActive) return;
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
      repeatCommentFirst: false,
      repeatCommentPrefix: '',
      unknownFallbackReply: 'Dạ em xin phép ghi nhận câu hỏi của bạn {user} để shop tư vấn chi tiết cho mình nha!',
      appendFollowUpQuestion: false,
      followUpQuestionText: '',
      aiPrompt: 'Bạn là trợ lý AI livestream bán hàng chuyên nghiệp. Khán giả "{user}" vừa hỏi/bình luận: "{comment}". Hãy trả lời cực kỳ ngắn gọn, súc tích, đúng trọng tâm trong DUY NHẤT 1 CÂU từ 10 đến 15 từ. Tự xưng là "em", trả lời thẳng vào câu hỏi, tuyệt đối không nhắc lại câu hỏi, không hỏi ngược lại dài dòng, không lan man.',
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
    const val = vars[key] ?? '';
    if (key === 'user') {
      const cleanUser = cleanUserNameForSpeech(val);
      if (cleanUser === 'bạn' || cleanUser === 'Bạn') {
        result = result.replace(/\bbạn\s+\{user\}/gi, 'bạn');
        result = result.replace(/\banh\s+\{user\}/gi, 'anh');
        result = result.replace(/\bchị\s+\{user\}/gi, 'chị');
        result = result.replace(/\{user\}/gi, 'bạn');
        result = result.replace(/\bbạn\s+\[user\]/gi, 'bạn');
        result = result.replace(/\banh\s+\[user\]/gi, 'anh');
        result = result.replace(/\bchị\s+\[user\]/gi, 'chị');
        result = result.replace(/\[user\]/gi, 'bạn');
      } else {
        result = result.replace(/\{user\}/gi, cleanUser);
        result = result.replace(/\[user\]/gi, cleanUser);
      }
    } else {
      const regex1 = new RegExp(`\\{${key}\\}`, 'gi');
      const regex2 = new RegExp(`\\[${key}\\]`, 'gi');
      result = result.replace(regex1, val).replace(regex2, val);
    }
  });
  return result;
}

  // Bộ điều phối hàng đợi sự kiện Live (Event Queue Processor)
  const processNextQueuedEvent = useCallback(() => {
    isProcessingEventRef.current = false;
    setIsProcessingEvent(false);
    if (eventQueueRef.current && eventQueueRef.current.length > 0) {
      const nextEvt = eventQueueRef.current.shift();
      if (nextEvt) {
        setTimeout(() => {
          handleLiveEvent(nextEvt.type, nextEvt.payload);
        }, 120);
      }
    }
  }, []);

  // Hàm kích hoạt xử lý sự kiện Live từ TikTok / Chat / Giả lập (Hỗ trợ AI Brain Bất Đồng Bộ)
  const handleLiveEvent = async (type, payload = {}) => {
    const isTestMode = payload?.isTest === true;
    const isExplicitlyPaused = typeof localStorage !== 'undefined' && localStorage.getItem('avalive_user_paused') === 'true';
    if (!isTestMode && isExplicitlyPaused) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      return;
    }

    // Mọi sự kiện đều được xử lý ngay lập tức (hàng đợi giọng nói do AIAudioPlayer đảm nhiệm), không chặn/nuốt sự kiện
    isProcessingEventRef.current = false;
    setIsProcessingEvent(true);

    // Luôn cho phép chạy sự kiện khi đã kết nối Live hoặc khi bấm Chạy Test / Giả lập sự kiện
    resetIdleTimer();

    const configs = getSavedEventConfigs();
    let replyText = '';
    let chatText = '';
    let shouldAction = null;
    let currentMatchedSpecialGiftSlot = null;
    let currentMatchedCheckoutProduct = null;
    let isSpecialGift = false;
    const rawUserName = (payload?.name || payload?.nickname || payload?.username || payload?.user || payload?.author || 'Khán giả').trim();
    const userName = cleanUserNameForSpeech(rawUserName);
    const userDisplay = (userName === 'bạn' || userName === 'Bạn') ? 'bạn' : (userName.startsWith('bạn ') || userName.startsWith('anh ') || userName.startsWith('chị ') ? userName : `bạn ${userName}`);

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

    const currentEvConfig = (evKey && configs[evKey]) ? configs[evKey] : {};

    // 🛡️ CHẶN SỰ KIỆN XEN VÀO KHI ĐANG CHẠY THỬ KỊCH BẢN (SCRIPT PREVIEW / TESTER)
    const isScriptTestingActive = typeof window !== 'undefined' && (
      window.__isScriptTestingRunning === true || 
      localStorage.getItem('avalive_script_testing_active') === 'true'
    );
    if (isScriptTestingActive && !isTestMode) {
      processNextQueuedEvent();
      return;
    }

    // Nếu sự kiện bị tắt trong cấu hình và không phải đang test thủ công, không xử lý
    if (currentEvConfig.active === false && !isTestMode) {
      processNextQueuedEvent();
      return;
    }

    try {
      // 1. XỬ LÝ SỰ KIỆN BÌNH LUẬN (COMMENT) - BỘ NÃO AI GEMINI FLASH + QUY TRÌNH 4 BƯỚC
      if (type === 'COMMENT') {
        const commentText = (payload?.comment || payload?.text || payload?.message || payload?.content || payload?.commentText || '').trim();
        // CHỐNG LẶP: Không xử lý comment do chính AI tự động gửi lên!
        if (rawUserName === 'Trợ lý AvaLive' || rawUserName === 'AVA Live AI' || rawUserName === 'Hệ Thống' || payload?.isModerator === true) {
          return;
        }
        
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

        // 🎯 THU THẬP TẤT CẢ QUY TẮC TỪ KHÓA TỪ MỌI NGUỒN (ƯU TIÊN SỐ 1: FILE TẢI LÊN & TAB BÌNH LUẬN)
        const allKeywordRules = [];
        
        // 1. Tệp từ khóa tải lên từ file mẫu (.txt, .docx, .pdf, .csv, .md)
        try {
          const fileKws = JSON.parse(localStorage.getItem('avalive_uploaded_file_keywords') || '[]');
          if (Array.isArray(fileKws)) allKeywordRules.push(...fileKws);
        } catch (e) {}
        try {
          const uploadedKws = JSON.parse(localStorage.getItem('aidol_uploaded_keywords') || '[]');
          if (Array.isArray(uploadedKws)) allKeywordRules.push(...uploadedKws);
        } catch (e) {}
        try {
          const rawKnowledge = localStorage.getItem('aidol_company_knowledge_text') || scriptConfig.companyKnowledgeText || checkoutConfig.companyKnowledgeText;
          if (rawKnowledge && typeof rawKnowledge === 'string' && rawKnowledge.length > 10) {
            const parsedKnowledgePairs = parseUniversalRulePairs(rawKnowledge);
            if (Array.isArray(parsedKnowledgePairs) && parsedKnowledgePairs.length > 0) {
              allKeywordRules.push(...parsedKnowledgePairs);
            }
          }
        } catch (e) {}

        // 2. Quy tắc người dùng cài đặt trong Tab Bình luận & Kịch bản
        if (Array.isArray(commentConfig.keywordRules)) allKeywordRules.push(...commentConfig.keywordRules);
        try {
          const comKws = JSON.parse(localStorage.getItem('avalive_comment_keyword_rules') || '[]');
          if (Array.isArray(comKws)) allKeywordRules.push(...comKws);
        } catch (e) {}
        try {
          const shared = JSON.parse(localStorage.getItem('AVALIVE_KEYWORD_RULES_SHARED') || '[]');
          if (Array.isArray(shared)) allKeywordRules.push(...shared);
        } catch (e) {}
        try {
          const qr = JSON.parse(localStorage.getItem('aidol_quick_rules') || '[]');
          if (Array.isArray(qr)) allKeywordRules.push(...qr);
        } catch (e) {}
        try {
          const customKws = JSON.parse(localStorage.getItem('aidol_custom_keywords') || '[]');
          if (Array.isArray(customKws)) allKeywordRules.push(...customKws);
        } catch (e) {}
        try {
          const kwAnswers = JSON.parse(localStorage.getItem('aidol_keyword_answers') || '[]');
          if (Array.isArray(kwAnswers)) allKeywordRules.push(...kwAnswers);
        } catch (e) {}
        try {
          const eventRules = JSON.parse(localStorage.getItem('aidol_event_configs') || '{}');
          if (eventRules && eventRules.comment && Array.isArray(eventRules.comment.keywordRules)) {
            allKeywordRules.push(...eventRules.comment.keywordRules);
          }
        } catch (e) {}
        if (Array.isArray(scriptConfig.keywordRules)) allKeywordRules.push(...scriptConfig.keywordRules);
        if (Array.isArray(checkoutConfig.keywordRules)) allKeywordRules.push(...checkoutConfig.keywordRules);

        // 3. Nạp bộ 140 câu quy tắc mẫu chuẩn vào hệ thống
        allKeywordRules.push(...DEFAULT_140_KEYWORD_RULES);

        // Helper trích xuất toàn bộ từ khóa từ mọi định dạng thuộc tính
        const getRuleKeywords = (rule) => {
          if (!rule) return [];
          const raw = rule.keywords ?? rule.keyword ?? rule.words ?? rule.keys ?? rule.key ?? rule.pattern ?? rule.from ?? rule.q ?? rule.text;
          if (!raw) return [];
          if (Array.isArray(raw)) {
            return raw.flatMap(k => String(k || '').split(/[;,|/\n\r\t]+/)).map(k => k.trim()).filter(Boolean);
          }
          return String(raw).split(/[;,|/\n\r\t]+/).map(k => k.trim()).filter(Boolean);
        };

        // Helper trích xuất câu phản hồi từ mọi định dạng thuộc tính
        const getRuleReply = (rule) => {
          if (!rule) return '';
          const raw = rule.replyText ?? rule.reply ?? rule.answer ?? rule.response ?? rule.to ?? rule.a ?? rule.sampleAnswers ?? rule.output;
          if (!raw) return '';
          if (Array.isArray(raw)) {
            return raw.length > 0 ? getRandomSample(raw) : '';
          }
          if (typeof raw === 'string') {
            if (raw.includes('\n')) {
              const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
              return lines.length > 0 ? getRandomSample(lines) : raw.trim();
            }
            return raw.trim();
          }
          return String(raw).trim();
        };

        // Hàm chuẩn hóa tiếng Việt siêu nhạy hỗ trợ so khớp cả có dấu, không dấu, viết tắt
        const normStr = (str) => {
          let s = String(str || '').toLowerCase().trim();
          // Mở rộng từ viết tắt thường gặp trên TikTok Live
          s = s.replace(/\bib\b|\binb\b/g, 'inbox')
               .replace(/\brep\b/g, 'trả lời')
               .replace(/\bbn\b|\bbnh\b|\bbnhieu\b|\bbao nhiu\b/g, 'bao nhiêu')
               .replace(/\bko\b|\bk\b|\bkhum\b|\bhong\b|\bhem\b/g, 'không')
               .replace(/\bdc\b|\bđc\b/g, 'được')
               .replace(/\bsp\b/g, 'sản phẩm')
               .replace(/\bsz\b/g, 'size')
               .replace(/\bfs\b/g, 'freeship')
               .replace(/\bstk\b/g, 'số tài khoản')
               .replace(/\bsdt\b/g, 'số điện thoại');

          const cleanPunct = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”«»<>?]/g, ' ').replace(/\s+/g, ' ').trim();
          const noAcc = cleanPunct
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd')
            .replace(/\s+/g, ' ')
            .trim();
          const cleanTokens = cleanPunct ? cleanPunct.split(' ').filter(Boolean) : [];
          const noAccTokens = noAcc ? noAcc.split(' ').filter(Boolean) : [];
          return { raw: s, clean: cleanPunct, noAcc, cleanTokens, noAccTokens };
        };
        const commentNorm = normStr(commentText);

        // Thuật toán so khớp từ khóa 4 tầng chính xác tuyệt đối
        const isKeywordMatch = (cNorm, kNorm) => {
          if (!kNorm.clean) return false;
          // 1. So khớp chính xác 100% cả câu (có dấu hoặc không dấu)
          if (cNorm.clean === kNorm.clean || cNorm.noAcc === kNorm.noAcc) return true;
          // 2. Từ khóa nhiều từ (cụm từ, vd: "giá bao nhiêu", "bảo hành", "áo sơ mi"): kiểm tra chuỗi con
          if (kNorm.cleanTokens.length > 1) {
            if (cNorm.clean.includes(kNorm.clean)) return true;
            if (kNorm.noAcc.length >= 3 && cNorm.noAcc.includes(kNorm.noAcc)) return true;
            // Kiểm tra từng token trong cụm từ khóa có xuất hiện trong comment không
            const allTokensPresent = kNorm.noAccTokens.every(tok => cNorm.noAccTokens.includes(tok));
            if (allTokensPresent && kNorm.noAccTokens.length >= 2) return true;
          }
          // 3. Từ khóa đơn lẻ (vd: "giá", "ship", "size", "tiền", "mua", "đặt", "chốt", "shop"):
          if (kNorm.cleanTokens.length === 1) {
            const singleClean = kNorm.clean;
            const singleNoAcc = kNorm.noAcc;
            if (cNorm.cleanTokens.includes(singleClean)) return true;
            if (singleNoAcc.length >= 2 && cNorm.noAccTokens.includes(singleNoAcc)) return true;
            // Chuỗi con nếu từ khóa có dấu >= 3 ký tự (vd: "tiền", "chốt", "đẹp")
            if (singleClean.length >= 3 && cNorm.clean.includes(singleClean)) return true;
            if (singleNoAcc.length >= 3 && cNorm.noAcc.includes(singleNoAcc)) return true;
          }
          return false;
        };

        // 🎯 A1.3. KIỂM TRA TOÀN DIỆN: Bình luận có khớp bất kỳ quy tắc từ khóa cấu hình sẵn không?
        let hasKeywordRuleMatch = false;
        let matchedRulePre = null;

        if (commentText) {
          // 1. Quét toàn bộ Keyword Rules từ file tải lên & cấu hình
          for (const rule of allKeywordRules) {
            if (!rule || rule.enabled === false) continue;
            const kws = getRuleKeywords(rule);
            if (kws.length === 0) continue;
            const reply = getRuleReply(rule);
            if (!reply) continue;

            const matched = kws.some(k => isKeywordMatch(commentNorm, normStr(k)));
            if (matched) {
              hasKeywordRuleMatch = true;
              matchedRulePre = { ...rule, replyText: reply };
              break;
            }
          }

          // 2. Kiểm tra Checkout Products keywords nếu chưa khớp rule
          if (!hasKeywordRuleMatch && checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
            for (const prod of checkoutConfig.checkoutProducts) {
              if (prod.active !== false && prod.keywords) {
                const kws = getRuleKeywords(prod);
                const pNorm = normStr(prod.productName);
                if (kws.some(k => isKeywordMatch(commentNorm, normStr(k))) || (pNorm.raw && isKeywordMatch(commentNorm, pNorm))) {
                  hasKeywordRuleMatch = true;
                  break;
                }
              }
            }
          }

          // 3. Kiểm tra Knowledge Base keywords nếu chưa khớp rule (chỉ khi cấu hình có hỏi mua hàng cụ thể)
          if (!hasKeywordRuleMatch) {
            const kbActive = (scriptConfig.commentReplySource || checkoutConfig.commentReplySource);
            if (kbActive === 'knowledge_base' || kbActive === 'both') {
              if (commentNorm.raw.includes('giá bao nhiêu') || commentNorm.raw.includes('bao nhiêu tiền') || commentNorm.raw.includes('giá thế nào') ||
                  commentNorm.raw.includes('bảo hành') || commentNorm.raw.includes('đổi trả') ||
                  commentNorm.raw.includes('đặt hàng') || commentNorm.raw.includes('chốt đơn')) {
                hasKeywordRuleMatch = true;
              }
            }
          }
        }

        const userSalutation = (userName && userName.toLowerCase() !== 'bạn') ? `bạn ${userName}` : 'bạn';
        let bodyAnswer = '';
        let isHandled = false;
        let isKeywordMatched = false;

        // ⏱️ A2. KIỂM TRA GIÃN CÁCH TRẢ LỜI BÌNH LUẬN (CHỈ ÁP DỤNG CHO BÌNH LUẬN THƯỜNG / KHÔNG PHẢI TỪ KHÓA)
        const cooldownSec = Math.max(2, parseInt(commentConfig.waitBetweenEvents ?? commentConfig.commentReplyCooldown) || 3);
        const now = Date.now();
        if (!isTestMode && !hasKeywordRuleMatch && (now - lastCommentReplyTimeRef.current < cooldownSec * 1000)) {
          console.log(`⏱️ [AvaLive AI] Đang trong khoảng giãn cách (${cooldownSec}s), bỏ qua dồn dập.`);
          processNextQueuedEvent();
          return;
        }
        lastCommentReplyTimeRef.current = now;

        // A3. Kiểm tra từ khóa bị cấm (Banned Words)
        if (commentConfig.bannedWords && !isTestMode) {
          const bannedList = commentConfig.bannedWords.split(/[\n;,]/).map(w => w.trim().toLowerCase()).filter(Boolean);
          if (bannedList.some(b => commentText.toLowerCase().includes(b))) {
            processNextQueuedEvent();
            return; // Bỏ qua comment chứa từ cấm
          }
        }

        // =========================================================================
        // 🌟 HỆ THỐNG AI PHẢN HỒI COMMENT TIKTOK LIVE THEO ĐÚNG 4 TẦNG ƯU TIÊN 🌟
        // =========================================================================
        const lowerComment = commentText.toLowerCase();
        const trimmedComment = commentText.trim();
        const isTrivialGreeting = /^(ch[aà]o|hi+|hello|helo|helu|hey|xin ch[aà]o|alo|[eê]|[oơ]i|a l[oô]|ch[aà]o em|ch[aà]o b[aạ]n|ch[aà]o shop|ch[aà]o m[oọ]i ng[uư][oờ]i|m[oọ]i ng[uư][oờ]i|c[aả] nh[aà]|hi shop|alo shop)\.?\s*$/i.test(trimmedComment);

        // -------------------------------------------------------------------------
        // 👑 BƯỚC 1 — NHẬN DIỆN VÀ MỞ ĐẦU PHẢN HỒI:
        // Hệ thống đọc chính xác comment và nhận diện tên USER thực tế từ luồng TikTok Live.
        // Phản hồi LUÔN BẮT ĐẦU bằng việc chào tên USER, sau đó nhắc lại hoặc xác nhận
        // nội dung comment nguyên bản của USER: CHÀO TÊN USER → NHẮC/XÁC NHẬN COMMENT.
        // -------------------------------------------------------------------------
        const isQuestion = commentText.includes('?') || 
          /^(ai|sao|gì|đâu|nào|bao nhiêu|thế nào|không|hả|chưa|khi nào|bao giờ|mấy|cho hỏi|em ơi|shop ơi|giá|bn|ib|có|được)/i.test(commentText) ||
          /(không|ko|hả|chưa|nhỉ|nhé|ạ|sao)\?*$/i.test(commentText);
        
        const actionVerb = isQuestion ? 'đang hỏi là' : 'vừa bình luận là';
        let step1Intro = '';
        if (commentConfig.repeatCommentPrefix && commentConfig.repeatCommentPrefix.trim()) {
          step1Intro = fillTemplate(commentConfig.repeatCommentPrefix, { user: userSalutation, comment: commentText, commentText }).trim();
          if (commentText && !commentConfig.repeatCommentPrefix.includes('{comment}') && !commentConfig.repeatCommentPrefix.includes('[comment]')) {
            step1Intro = `${step1Intro} Em thấy mình ${actionVerb}: "${commentText}".`;
          }
        } else {
          // Cấu trúc chuẩn: "Chào [Tên USER] nha! Em thấy mình đang hỏi "[COMMENT CỦA USER]"."
          step1Intro = `Chào ${userSalutation} nha! Em thấy mình ${actionVerb} "${commentText}".`;
        }

        // -------------------------------------------------------------------------
        // 👑 BƯỚC 2 — KIỂM TRA TỪ KHÓA ĐÃ CÀI ĐẶT & FILE TẢI LÊN:
        // Phân tích kỹ toàn bộ comment và đối chiếu với danh sách TỪ KHÓA MÀ NGƯỜI DÙNG TẢI FILE MẪU TẢI LÊN
        // hoặc đã thiết lập trong hệ thống. Hỗ trợ nhận diện theo ngữ nghĩa, không dấu/có dấu, chữ hoa/thường,
        // cách viết gần giống và các biến thể hợp lý.
        // 👉 NẾU KHỚP: ƯU TIÊN TUYỆT ĐỐI câu phản hồi đã được cấu hình sẵn tương ứng với từ khóa đó.
        // 👉 TUYỆT ĐỐI KHÔNG tự tạo câu trả lời mới khi đã tìm thấy phản hồi được cấu hình.
        // -------------------------------------------------------------------------
        let step2Reply = '';
        let stepMatched = 0;

        if (commentConfig.active !== false) {
          if (matchedRulePre) {
            const replyTpl = matchedRulePre.replyText;
            if (replyTpl) {
              step2Reply = fillTemplate(replyTpl, { user: userSalutation, comment: commentText, product: matchedRulePre.productName || '' });
              isHandled = true;
              isKeywordMatched = true;
              stepMatched = 2;
              if (matchedRulePre.role || matchedRulePre.voiceId) {
                currentEvConfig._matchedRuleRole = matchedRulePre.role;
                currentEvConfig._matchedRuleVoiceId = matchedRulePre.voiceId;
              }
            }
          } else {
            const seenRules = new Set();
            for (const rule of allKeywordRules) {
              if (!rule || rule.enabled === false) continue;
              const rKey = (rule.id || '') + '_' + String(rule.keywords || rule.keyword || '');
              if (seenRules.has(rKey)) continue;
              seenRules.add(rKey);

              const kws = getRuleKeywords(rule);
              if (kws.length === 0) continue;
              const reply = getRuleReply(rule);
              if (!reply) continue;

              const matched = kws.some(k => isKeywordMatch(commentNorm, normStr(k)));
              if (matched) {
                step2Reply = fillTemplate(reply, { user: userSalutation, comment: commentText, product: rule.productName || '' });
                isHandled = true;
                isKeywordMatched = true;
                stepMatched = 2;
                if (rule.role || rule.voiceId) {
                  currentEvConfig._matchedRuleRole = rule.role;
                  currentEvConfig._matchedRuleVoiceId = rule.voiceId;
                }
                break;
              }
            }
          }

          // 2.1. Kiểm tra kịch bản Chốt Đơn Sản Phẩm (Checkout Products) nếu comment khớp từ khóa sản phẩm
          if (!isHandled && checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
            for (const prod of checkoutConfig.checkoutProducts) {
              if (prod.active !== false && prod.keywords) {
                const kws = getRuleKeywords(prod);
                const pNorm = normStr(prod.productName);
                const matched = kws.some(k => isKeywordMatch(commentNorm, normStr(k))) || (pNorm.raw && isKeywordMatch(commentNorm, pNorm));

                if (matched) {
                  isHandled = true;
                  isKeywordMatched = true;
                  stepMatched = 2;
                  currentMatchedCheckoutProduct = prod;
                  const prodReply = getRuleReply(prod);
                  if (prodReply) {
                    step2Reply = fillTemplate(prodReply, { user: userSalutation, comment: commentText, product: prod.productName });
                  } else {
                    step2Reply = `Sản phẩm ${prod.productName || 'này'} đang có ưu đãi trong giỏ hàng góc trái màn hình, bạn bấm vào đặt hàng ngay nhé!`;
                  }
                  shouldAction = 'gift_reaction';
                  break;
                }
              }
            }
          }

          // 2.2. Kiểm tra Kho Tri Thức Doanh Nghiệp (chỉ kích hoạt khi hỏi trực tiếp về giá, bảo hành, đặt hàng)
          const company = scriptConfig.companyName || checkoutConfig.companyName || 'Shop';
          const product = scriptConfig.productName || checkoutConfig.productName || 'Sản phẩm';
          const price = scriptConfig.productPrice || checkoutConfig.productPrice || 'ưu đãi';
          const promo = scriptConfig.promotions || checkoutConfig.promotions || 'freeship toàn quốc';
          const warranty = scriptConfig.warrantyPolicy || checkoutConfig.warrantyPolicy || 'bảo hành đổi trả uy tín';

          if (!isHandled && (replySource === 'knowledge_base' || replySource === 'both')) {
            if (commentNorm.raw.includes('giá bao nhiêu') || commentNorm.raw.includes('bao nhiêu tiền') || commentNorm.raw.includes('giá thế nào') || commentNorm.noAcc.includes('gia bao nhieu')) {
              step2Reply = `Dạ ${product} đang có giá ${price} kèm khuyến mãi: ${promo}. Bạn bấm ngay vào giỏ hàng góc trái màn hình để nhận ưu đãi nha!`;
              isHandled = true;
              isKeywordMatched = true;
              stepMatched = 2;
            } else if (commentNorm.raw.includes('bảo hành') || commentNorm.raw.includes('đổi trả') || commentNorm.noAcc.includes('bao hanh') || commentNorm.noAcc.includes('doi tra')) {
              step2Reply = `Dạ bạn yên tâm nha, bên em có chính sách: ${warranty} và hỗ trợ đổi trả uy tín ạ!`;
              isHandled = true;
              isKeywordMatched = true;
              stepMatched = 2;
            } else if (commentNorm.raw.includes('đặt hàng') || commentNorm.raw.includes('chốt đơn') || commentNorm.noAcc.includes('dat hang') || commentNorm.noAcc.includes('chot don')) {
              step2Reply = `Dạ em cảm ơn bạn! Bạn bấm trực tiếp vào giỏ hàng góc trái màn hình để chốt đơn ${product} nhận quà tặng nha!`;
              isHandled = true;
              isKeywordMatched = true;
              stepMatched = 2;
            }
          }
        }

        if (step2Reply) {
          bodyAnswer = step2Reply;
        }

        // -------------------------------------------------------------------------
        // 👑 BƯỚC 3 — AI TỰ PHÂN TÍCH VÀ TRẢ LỜI (CHỈ KHI BƯỚC 2 KHÔNG KHỚP TỪ KHÓA NÀO):
        // Nếu comment không khớp với bất kỳ từ khóa đã cài đặt có trong file nào,
        // sử dụng AI để tự hiểu ngữ cảnh và trả lời.
        // YÊU CẦU: Câu trả lời phải NGẮN GỌN, THÔNG MINH, TỰ NHIÊN, DỄ HIỂU, XÚC TÍCH
        // và BÁM SÁT TRỰC TIẾP vào nội dung comment trong 10 đến 15 từ.
        // Không lan man, không trả lời chung chung, không tự suy diễn ngoài ngữ cảnh.
        // ⛔ TUYỆT ĐỐI KHÔNG ĐƯỢC NÓI TRẢ LỜI LIÊN QUAN ĐẾN SẢN PHẨM MÀ CÂU COMMENT KHÔNG LIÊN QUAN.
        // -------------------------------------------------------------------------
        if (!isHandled && useAi && commentConfig.useAi !== false) {
          if (isTrivialGreeting) {
            bodyAnswer = `Dạ em chào ${userSalutation} nha! Chúc bạn xem live thật vui vẻ và có một ngày tuyệt vời ạ!`;
            isHandled = true;
            stepMatched = 3;
          } else if (lowerComment.includes('xinh') || lowerComment.includes('đẹp') || lowerComment.includes('dễ thương') || lowerComment.includes('cute')) {
            bodyAnswer = `Em cảm ơn lời khen cực kỳ ngọt ngào của ${userSalutation} nha! Chúc bạn xem live thật vui vẻ ạ!`;
            isHandled = true;
            stepMatched = 3;
          } else {
            try {
              const liveContext = `Livestream tương tác trực tiếp. Người đang xem live bình luận. Trả lời đúng nội dung câu hỏi một cách thông minh, tự nhiên, thân thiện.`;
              const aiPrompt = `Bạn là trợ lý AI livestream thông minh. Khán giả "${userName}" vừa hỏi/bình luận: "${commentText}". Hãy phân tích kỹ nội dung câu hỏi/bình luận và trả lời trực tiếp, chính xác đúng nội dung đó trong DUY NHẤT 1 CÂU ngắn gọn từ 10 đến 15 từ. Tự xưng là "em", nói chuyện tự nhiên, thân thiện. Tuyệt đối không nhắc lại câu chào, không hỏi ngược lại, và TUYỆT ĐỐI KHÔNG tự ý giới thiệu sản phẩm hay bán hàng trừ khi câu hỏi của khán giả trực tiếp hỏi về sản phẩm/mua hàng/giá cả.`;

              const aiRes = await askGeminiLiveAi({
                question: commentText,
                username: userName,
                role: commentConfig.ttsVoiceRole || commentConfig.speaker || 'assistant',
                context: `${liveContext}. Hướng dẫn AI: ${aiPrompt}`
              });

              if (aiRes && aiRes.text && aiRes.text.trim()) {
                bodyAnswer = aiRes.text.trim();
                isHandled = true;
                stepMatched = 3;
              }
            } catch (aiErr) {
              console.warn('AI Brain call error:', aiErr);
            }
          }
        }

        // -------------------------------------------------------------------------
        // 👑 BƯỚC 4 — PHẢN HỒI DỰ PHÒNG (KHI AI KHÔNG HIỂU / LỖI MẠNG / TIMEOUT):
        // Nếu AI không đủ khả năng xác định ý nghĩa, ngữ cảnh hoặc mục đích của comment,
        // KHÔNG được cố đoán. Chuyển sang bộ câu PHẢN HỒI DỰ PHÒNG đã được cấu hình sẵn trong hệ thống.
        // -------------------------------------------------------------------------
        if (!isHandled || !bodyAnswer) {
          stepMatched = 4;
          if (commentConfig.unknownFallbackReply && commentConfig.unknownFallbackReply.trim()) {
            bodyAnswer = fillTemplate(commentConfig.unknownFallbackReply, { user: userSalutation, comment: commentText });
            isHandled = true;
          } else if (Array.isArray(commentConfig.prompts) && commentConfig.prompts.length > 0) {
            const activePrompts = commentConfig.prompts.filter(p => p && p.enabled !== false && p.text);
            if (activePrompts.length > 0) {
              const pItem = activePrompts[Math.floor(Math.random() * activePrompts.length)];
              bodyAnswer = fillTemplate(pItem.text, { user: userSalutation, comment: commentText });
              if (pItem.role) currentEvConfig._matchedRuleRole = pItem.role;
              isHandled = true;
            }
          } else if (commentConfig.sampleAnswers && commentConfig.sampleAnswers.trim()) {
            bodyAnswer = fillTemplate(getRandomSample(commentConfig.sampleAnswers), { user: userSalutation, comment: commentText });
            isHandled = true;
          } else {
            const smartFallbacks = [
              `Dạ em cảm ơn ${userSalutation} đã tương tác và gửi bình luận, mình có thể chia sẻ cụ thể hơn để em hỗ trợ chu đáo nhất nhé!`,
              `Dạ em đã ghi nhận ý kiến của ${userSalutation} rồi ạ, cảm ơn bạn rất nhiều vì đã theo dõi và ủng hộ phiên live!`,
              `Dạ em rất vui được đồng hành cùng ${userSalutation} trong phiên live hôm nay, chúc bạn xem live thật vui vẻ ạ!`
            ];
            bodyAnswer = smartFallbacks[Math.floor(Math.random() * smartFallbacks.length)];
            isHandled = true;
          }
        }

        // -------------------------------------------------------------------------
        // 🎯 ĐÓNG GÓI CÂU THOẠI PHẢN HỒI HOÀN CHỈNH:
        // [BƯỚC 1: Chào tên USER + Xác nhận comment] + [Nội dung phản hồi từ BƯỚC 2 / BƯỚC 3 / BƯỚC 4]
        // -------------------------------------------------------------------------
        let cleanBodyAnswer = (bodyAnswer || '').trim();
        if (step1Intro && cleanBodyAnswer) {
          cleanBodyAnswer = cleanBodyAnswer.replace(/^(dạ\s+)?(em\s+)?cảm\s+ơn\s+([^\.,!\n]+)[\.,!\s]+/i, '').trim();
          cleanBodyAnswer = cleanBodyAnswer.replace(/^(dạ\s+)?(em\s+)?chào\s+([^\.,!\n]+)[\.,!\s]+/i, '').trim();
          if (!cleanBodyAnswer) cleanBodyAnswer = bodyAnswer.trim();
        }

        replyText = (step1Intro ? `${step1Intro} ${cleanBodyAnswer}` : cleanBodyAnswer).replace(/\s+/g, ' ').trim();
        chatText = cleanBodyAnswer || replyText;
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
            currentMatchedSpecialGiftSlot = matchedSlot;
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
        if (welcomeConfig.active === false && !isTestMode) {
          processNextQueuedEvent();
          return;
        }

        const effectiveUser = (rawUserName && rawUserName !== 'Khán Giả' && rawUserName !== 'Viewer') ? userName : 'bạn';
        const viewerKey = (rawUserName || '').toLowerCase().trim();
        const now = Date.now();
        const lastGreetTime = greetedViewersRef.current.get(viewerKey) || 0;
        
        // Cooldown 30s cho mỗi viewer để không chào liên tiếp dồn dập
        if (!isTestMode && viewerKey && (now - lastGreetTime < 30000)) {
          processNextQueuedEvent();
          return;
        }
        if (viewerKey) {
          greetedViewersRef.current.set(viewerKey, now);
          if (greetedViewersRef.current.size > 1000) {
            const first = greetedViewersRef.current.keys().next().value;
            greetedViewersRef.current.delete(first);
          }
        }
        
        // Chào luân phiên từng câu (Round-Robin tuần tự)
        if (welcomeConfig.sampleAnswers) {
          replyText = fillTemplate(getSequentialSample(welcomeConfig.sampleAnswers, welcomeIndexRef, 'Dạ em chào bạn {user} mới vào xem live nha!'), { user: effectiveUser, count: 1 });
        }
        if (!replyText || !replyText.trim()) {
          const greetName = (effectiveUser && effectiveUser.toLowerCase() !== 'bạn') ? `bạn ${effectiveUser}` : 'bạn';
          replyText = `Dạ em chào ${greetName} mới vào xem live nha! Chúc mình xem live thật vui và săn được nhiều deal hời cùng shop ạ!`;
        }
        chatText = replyText;
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
        const isScriptActive = (typeof localStorage !== 'undefined' && localStorage.getItem('aidol_is_script_live_running') === 'true') ||
                               (typeof window !== 'undefined' && (window.__isScriptTestingRunning || window.__isScriptLiveRunning));
        if (isScriptActive) {
          console.log('[useLiveCoordinator] Đang phát kịch bản live, hủy hoàn toàn sự kiện IDLE');
          return;
        }
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

      // 12. TỰ ĐỘNG TÌM & PHÁT VIDEO TỪ CẤU HÌNH SỰ KIỆN HOẶC KHO MEDIA (TỰ ĐỘNG KHỚP SÂN KHẤU CHÍNH)
      let matchedEventVideo = null;
      const directVideoUrl = currentEvConfig?.videoFile || currentEvConfig?.videoUrl || currentEvConfig?.supportVideoFile;

      if (directVideoUrl) {
        matchedEventVideo = {
          id: `event_vid_${evKey}_${Date.now()}`,
          name: currentEvConfig.videoFolder || `${evKey} Video`,
          mediaUrl: directVideoUrl,
          url: directVideoUrl,
          type: 'video',
          category: evKey
        };
      } else if (isSpecialGift && currentMatchedSpecialGiftSlot?.videoFile) {
        matchedEventVideo = {
          id: `special_gift_vid_${currentMatchedSpecialGiftSlot.id}`,
          name: currentMatchedSpecialGiftSlot.videoFolder || currentMatchedSpecialGiftSlot.giftName,
          mediaUrl: currentMatchedSpecialGiftSlot.videoFile,
          url: currentMatchedSpecialGiftSlot.videoFile,
          type: 'video',
          category: 'special_gift'
        };
      } else if (currentMatchedCheckoutProduct?.videoFile || currentMatchedCheckoutProduct?.videoUrl) {
        const prodVid = currentMatchedCheckoutProduct.videoFile || currentMatchedCheckoutProduct.videoUrl;
        matchedEventVideo = {
          id: `checkout_prod_vid_${currentMatchedCheckoutProduct.id}`,
          name: currentMatchedCheckoutProduct.productName || 'Checkout Video',
          mediaUrl: prodVid,
          url: prodVid,
          type: 'video',
          category: 'checkout'
        };
      } else if (Array.isArray(liveMedia) && liveMedia.length > 0) {
        // Chỉ tìm video sự kiện nếu được người dùng cấu hình rõ ràng là phản ứng reaction đặc biệt (gift, checkout, hoặc chế độ prerecorded)
        // BẢO VỆ STREAMER 24/7: Sự kiện comment CHỈ phát video khi người dùng cài đặt/tải video riêng trong Tab Bình luận (directVideoUrl)
        const isCommentEvent = evKey === 'comment';
        const isInteractiveLiveEvent = evKey === 'comment' || evKey === 'welcome';
        const allowEventVideo = !isCommentEvent && (currentEvConfig?.videoMode === 'prerecorded' || (!isInteractiveLiveEvent && (shouldAction === 'gift_reaction' || type === 'GIFT' || evKey === 'gift' || evKey === 'checkout')));

        if (allowEventVideo) {
          const targetCategory = currentEvConfig?.videoCategory || (evKey === 'welcome' ? 'join' : evKey);
          const targetFolder = currentEvConfig?.videoFolder || '';

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
      }

      const isPreRecorded = currentEvConfig?.videoMode === 'prerecorded' || (!currentEvConfig?.useVoice && !!matchedEventVideo);
      const muteSourceVideo = currentEvConfig?.muteSourceVideo === true;

      if (matchedEventVideo) {
        if (!previousVideoItem && activeVideoItem && activeVideoItem.id !== matchedEventVideo.id) {
          setPreviousVideoItem(activeVideoItem);
        }
        setActiveVideoItem(matchedEventVideo);

        // ⚡ Đồng bộ tuyệt đối sang Sân Khấu Chính, Window Capture OBS & Đường Link Online HTTPS
        syncMasterLiveState({
          stage: 'idol',
          mediaUrl: matchedEventVideo.mediaUrl,
          characterName: matchedEventVideo.name || `${evKey} Video`,
          isVideo: true,
          videoPlaybackEvent: 'play',
          isPlaying: true,
          eventType: type,
          eventKey: evKey,
          eventVideoUrl: matchedEventVideo.mediaUrl,
          captions: replyText || ''
        });
        sendVideoControl({
          action: 'play',
          mediaUrl: matchedEventVideo.mediaUrl,
          currentTime: 0,
          force: true
        });

        // 🚀 Tự động chuyển đổi sang link uploads server nếu là blob hoặc data URL
        if (matchedEventVideo.mediaUrl && (matchedEventVideo.mediaUrl.startsWith('blob:') || matchedEventVideo.mediaUrl.startsWith('data:'))) {
          ensureServerMediaUrl(matchedEventVideo.mediaUrl, matchedEventVideo.name || `${evKey}_video.mp4`).then(srvUrl => {
            if (srvUrl && srvUrl !== matchedEventVideo.mediaUrl) {
              syncMasterLiveState({
                stage: 'idol',
                mediaUrl: srvUrl,
                eventVideoUrl: srvUrl,
                updatedAt: Date.now()
              });
              sendVideoControl({
                action: 'play',
                mediaUrl: srvUrl,
                currentTime: 0,
                force: true
              });
            }
          }).catch(() => {});
        }

        // Bắn sự kiện toàn cục để Sân Khấu Chính lập tức hiển thị video sự kiện này tràn khớp màn hình
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('avalive:event_video_trigger', {
            detail: {
              videoUrl: matchedEventVideo.mediaUrl,
              eventType: type,
              eventKey: evKey,
              name: matchedEventVideo.name,
              isPreRecorded,
              muteSourceVideo
            }
          }));
        }
      }

      // 13. PHÁT GIỌNG NÓI VOICE AI & LIP-SYNC (ƯU TIÊN 100% TAB BỘ NÃO -> FALLBACK 14 TÁC VỤ)
      const isCommentVoiceDisabled = evKey === 'comment' && (currentEvConfig.speakVoice === false || currentEvConfig.commentResponseFormat === 'text_only');
      const isCommentTextDisabled = evKey === 'comment' && (currentEvConfig.sendChatText === false || currentEvConfig.commentResponseFormat === 'voice_only');

      // Nếu video là loại có sẵn Voice (Pre-recorded), không phát Voice AI đè lên
      const shouldSpeakVoice = !isPreRecorded && !isCommentVoiceDisabled && ((currentEvConfig.useVoice !== false) || isTestMode);
      const shouldSendChat = !isCommentTextDisabled;
      const targetVoiceRole = currentEvConfig._matchedRuleRole || currentEvConfig.ttsVoiceRole || currentEvConfig.speaker || (evKey === 'comment' ? 'comment' : evKey === 'checkout' ? 'manager' : 'idol');
      const voiceTargetId = currentEvConfig._matchedRuleVoiceId || currentEvConfig.voiceId || currentEvConfig.voiceObj?.id;
      const effectiveVoice = resolveEffectiveVoice(targetVoiceRole, voiceTargetId, currentEvConfig.avatarId, { isLiveEvent: true, eventKey: evKey });

      if (replyText && replyText.trim()) {
        if (shouldSendChat) {
          setViewerHistory(prev => [
            ...prev, 
            { 
              time: new Date().toLocaleTimeString(), 
              type, 
              payload, 
              ai_intent: 'STRUCTURED_CONFIG', 
              ai_reply: chatText || replyText 
            }
          ].slice(-20));
          if (onChatReply) onChatReply(chatText || replyText);
        }

        if (shouldSpeakVoice && onVoiceReply) {
          let rawVol = currentEvConfig.voiceVolume !== undefined ? Number(currentEvConfig.voiceVolume) : (currentEvConfig.volume !== undefined ? Number(currentEvConfig.volume) : (effectiveVoice.volume ?? 1.0));
          const effectiveVolume = (rawVol > 1 && rawVol <= 100) ? rawVol / 100 : Math.max(0, Math.min(1.0, rawVol));
          const effectiveRate = currentEvConfig.voiceRate !== undefined ? Number(currentEvConfig.voiceRate) : (effectiveVoice.rate ?? 1.0);
          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume,
            rate: effectiveRate
          };
          
          // LƯU Ý QUAN TRỌNG: Gửi chat text lên trước, sau đó chờ 800ms mới phát voice để đúng trình tự Text trước -> Voice sau
          setTimeout(() => {
            onVoiceReply({
              text: replyText,
              action: shouldAction,
              baseVideoItem: matchedEventVideo || activeVideoItem,
              preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null),
              voiceId: effectiveVoice.id,
              voiceObj: finalVoiceObj,
              voiceChannel: targetVoiceRole,
              volume: effectiveVolume,
              isTest: isTestMode
            });
          }, 800);

          // Tự động chuyển tiếp xử lý sự kiện tiếp theo trong hàng đợi khi phát xong
          const estDuration = Math.max(2500, Math.min(10000, (replyText.length || 20) * 110 + 1000));
          setTimeout(() => {
            processNextQueuedEvent();
          }, estDuration);
        } else {
          processNextQueuedEvent();
        }
      } else {
        // Luôn đảm bảo có câu thoại phản hồi tự nhiên cho sự kiện
        let fallbackMsg = '';
        if (type === 'VIEWER_JOIN') fallbackMsg = `Dạ em chào bạn ${userName} mới vào xem live nha! Chúc bạn xem live thật vui vẻ ạ!`;
        else if (type === 'COMMENT') fallbackMsg = `Dạ em cảm ơn câu hỏi của bạn ${userName} nha! Shop tư vấn mình ngay ạ!`;
        else if (type === 'GIFT') fallbackMsg = `Em cảm ơn bạn ${userName} đã gửi tặng món quà vô cùng ngọt ngào cho em nha!`;
        else if (type === 'LIKE') fallbackMsg = `Em cảm ơn bạn ${userName} và cả nhà đã nhiệt tình thả tim live cho em nhé!`;
        else if (type === 'FOLLOW') fallbackMsg = `Dạ em cảm ơn bạn ${userName} đã bấm theo dõi kênh của em nha!`;
        else if (type === 'SHARE') fallbackMsg = `Em cảm ơn bạn ${userName} đã chia sẻ phiên live này đến bạn bè nha!`;

        if (fallbackMsg && shouldSpeakVoice && onVoiceReply) {
          let rawVol2 = currentEvConfig.voiceVolume !== undefined ? Number(currentEvConfig.voiceVolume) : (currentEvConfig.volume !== undefined ? Number(currentEvConfig.volume) : (effectiveVoice.volume ?? 1.0));
          const effectiveVolume = (rawVol2 > 1 && rawVol2 <= 100) ? rawVol2 / 100 : Math.max(0, Math.min(1.0, rawVol2));
          const effectiveRate = currentEvConfig.voiceRate !== undefined ? Number(currentEvConfig.voiceRate) : (effectiveVoice.rate ?? 1.0);
          const finalVoiceObj = {
            ...effectiveVoice,
            volume: effectiveVolume,
            rate: effectiveRate
          };
          onVoiceReply({
            text: fallbackMsg,
            action: shouldAction,
            baseVideoItem: matchedEventVideo || activeVideoItem,
            preRecordedCat: matchedEventVideo ? matchedEventVideo.category : (shouldAction === 'gift_reaction' ? 'reaction' : null),
            voiceId: effectiveVoice.id,
            voiceObj: finalVoiceObj,
            voiceChannel: targetVoiceRole,
            volume: effectiveVolume,
            isTest: isTestMode
          });
          const estDuration2 = Math.max(2500, Math.min(8000, (fallbackMsg.length || 20) * 110 + 1000));
          setTimeout(() => {
            processNextQueuedEvent();
          }, estDuration2);
        } else {
          processNextQueuedEvent();
        }
      }
    } catch (err) {
      console.warn('Lỗi xử lý sự kiện live kịch bản:', err);
      processNextQueuedEvent();
    }
  };

  // Gọi hàm này từ AIAudioPlayer khi đã load xong LipSync Video hoặc Reaction Video
  const handleActionVideoReady = (videoUrl, isLipSync) => {
    if (isLipSync) {
      setLipSyncVideoUrl(videoUrl);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 10, reason: 'AI Video LipSync Generation' } }));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive:lipsync_video_trigger', {
          detail: { videoUrl }
        }));
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ type: 'LIP_SYNC_VIDEO', lipSyncVideoUrl: videoUrl, timestamp: Date.now() });
          bc.close();
        } catch (e) {}
      }
    } else {
      // Tìm video reaction trong kho
      // (Bản demo đơn giản: AIAudioPlayer tự manage, hook này chỉ cấp state)
    }
  };

  const handleVideoEnded = () => {
    processNextQueuedEvent();
    if (lipSyncVideoUrl) {
      setLipSyncVideoUrl(null); // Trở về video nền
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive:lipsync_video_trigger', {
          detail: { videoUrl: null }
        }));
        try {
          const bc = new BroadcastChannel('avalive_master_live_stream');
          bc.postMessage({ type: 'LIP_SYNC_VIDEO', lipSyncVideoUrl: null, timestamp: Date.now() });
          bc.close();
        } catch (e) {}
      }
    } else if (previousVideoItem) {
      setActiveVideoItem(previousVideoItem);
      setPreviousVideoItem(null);
    }

    // ⚡ Đồng bộ phục hồi video nền gốc sang Sân Khấu Chính, Window Capture OBS & Đường Link Online
    const fallbackMediaUrl = previousVideoItem?.mediaUrl || (typeof window !== 'undefined' ? (localStorage.getItem('avalive_user_locked_media') || localStorage.getItem('avalive_active_video_src')) : null);
    syncMasterLiveState({
      stage: 'idol',
      mediaUrl: fallbackMediaUrl,
      isVideo: true,
      videoPlaybackEvent: 'play',
      isPlaying: true,
      eventVideoUrl: null
    });
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
