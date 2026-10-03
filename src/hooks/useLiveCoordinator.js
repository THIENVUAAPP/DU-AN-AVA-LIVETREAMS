import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllLiveMedia } from '../lib/liveKhoDB';
import { askGeminiLiveAi } from '../lib/geminiClient';
import autoPinProductService from '../utils/autoPinProductService';
import { resolveEffectiveVoice } from '../utils/voiceSyncService';
import { isSmartSpamOrToxicComment, cleanUserNameForSpeech, isMeaningfulCommercialOrEngagingComment } from '../utils/vietnamesePronunciationMaster';
import { syncMasterLiveState, sendVideoControl } from '../lib/masterLiveSync';
import { ensureServerMediaUrl } from '../utils/mediaUploadService';

export function useLiveCoordinator({ isConnected, onVoiceReply, onChatReply, activeBrainPack = 'talk' }) {
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
      repeatCommentFirst: true,
      repeatCommentPrefix: 'Dạ em cảm ơn bạn {user} đã bình luận là: "{comment}". ',
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

    // Luôn cho phép chạy sự kiện khi đã kết nối Live hoặc khi bấm Chạy Test / Giả lập sự kiện
    resetIdleTimer();

    const configs = getSavedEventConfigs();
    let replyText = '';
    let chatText = '';
    let shouldAction = null;
    let currentMatchedSpecialGiftSlot = null;
    let currentMatchedCheckoutProduct = null;
    let isSpecialGift = false;
    const rawUserName = (payload?.name || payload?.username || 'Bạn').trim();
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
      return;
    }

    // Nếu sự kiện bị tắt trong cấu hình và không phải đang test thủ công, không xử lý
    if (currentEvConfig.active === false && !isTestMode) {
      return;
    }

    try {
      // 1. XỬ LÝ SỰ KIỆN BÌNH LUẬN (COMMENT) - BỘ NÃO AI GEMINI FLASH + QUY TRÌNH 4 BƯỚC
      if (type === 'COMMENT') {
        const commentText = (payload?.text || payload?.comment || '').trim();
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

        // 🎯 THU THẬP TẤT CẢ QUY TẮC TỪ KHÓA TỪ MỌI NGUỒN (ƯU TIÊN CAO NHẤT: TAB BÌNH LUẬN)
        const allKeywordRules = [];
        if (Array.isArray(commentConfig.keywordRules)) allKeywordRules.push(...commentConfig.keywordRules);
        try {
          const comKws = JSON.parse(localStorage.getItem('avalive_comment_keyword_rules') || '[]');
          if (Array.isArray(comKws)) allKeywordRules.push(...comKws);
        } catch (e) {}
        try {
          const shared = JSON.parse(localStorage.getItem('AVALIVE_KEYWORD_RULES_SHARED') || '[]');
          if (Array.isArray(shared)) allKeywordRules.push(...shared);
        } catch (e) {}
        if (Array.isArray(scriptConfig.keywordRules)) allKeywordRules.push(...scriptConfig.keywordRules);
        if (Array.isArray(checkoutConfig.keywordRules)) allKeywordRules.push(...checkoutConfig.keywordRules);
        try {
          const qr = JSON.parse(localStorage.getItem('aidol_quick_rules') || '[]');
          if (Array.isArray(qr)) allKeywordRules.push(...qr);
        } catch (e) {}

        // Hàm chuẩn hóa tiếng Việt hỗ trợ so khớp cả có dấu, không dấu và loại bỏ dấu câu
        const normStr = (str) => {
          const s = String(str || '').toLowerCase().trim();
          const cleanPunct = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'“”«»]/g, ' ').replace(/\s+/g, ' ').trim();
          const noAcc = cleanPunct
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'd')
            .replace(/\s+/g, ' ')
            .trim();
          return { raw: s, clean: cleanPunct, noAcc };
        };
        const commentNorm = normStr(commentText);

        // 🎯 A1.3. KIỂM TRA NHANH: Bình luận có khớp bất kỳ quy tắc từ khóa nào không?
        // Nếu khớp thì TUYỆT ĐỐI BỎ QUA bộ lọc trivial (A1.5) để đảm bảo luôn phản hồi từ khóa đã nạp
        let hasKeywordRuleMatch = false;
        let matchedRulePre = null;

        if (useKw && commentText) {
          // 1. Kiểm tra toàn bộ Keyword Rules từ file tải lên & cấu hình
          for (const rule of allKeywordRules) {
            if (!rule || rule.enabled === false || !rule.keywords) continue;
            const kwArr = Array.isArray(rule.keywords) ? rule.keywords : String(rule.keywords).split(/[;,]\s*|\n/);
            const matched = kwArr.some(k => {
              const kNorm = normStr(k);
              if (!kNorm.clean) return false;
              return commentNorm.raw.includes(kNorm.raw) || 
                     commentNorm.clean.includes(kNorm.clean) || 
                     (kNorm.noAcc.length >= 2 && commentNorm.noAcc.includes(kNorm.noAcc));
            });
            if (matched && (rule.replyText || rule.reply)) {
              hasKeywordRuleMatch = true;
              matchedRulePre = rule;
              break;
            }
          }

          // 2. Kiểm tra Knowledge Base keywords nếu chưa khớp rule
          if (!hasKeywordRuleMatch) {
            const kbActive = (scriptConfig.commentReplySource || checkoutConfig.commentReplySource || 'knowledge_base');
            if (kbActive === 'knowledge_base' || kbActive === 'both') {
              if (commentNorm.raw.includes('giá') || commentNorm.raw.includes('bao nhiêu') || commentNorm.raw.includes('tiền') || commentNorm.raw.includes('chi phí') || commentNorm.raw.includes('sale') ||
                  commentNorm.raw.includes('bảo hành') || commentNorm.raw.includes('đổi trả') || commentNorm.raw.includes('ship') || commentNorm.raw.includes('giao hàng') || commentNorm.raw.includes('vận chuyển') ||
                  commentNorm.raw.includes('mua') || commentNorm.raw.includes('đặt hàng') || commentNorm.raw.includes('chốt') || commentNorm.raw.includes('lấy') || commentNorm.raw.includes('order') ||
                  commentNorm.raw.includes('dùng') || commentNorm.raw.includes('tính năng') || commentNorm.raw.includes('chức năng') || commentNorm.raw.includes('như thế nào') || commentNorm.raw.includes('chất liệu') || commentNorm.raw.includes('công dụng')) {
                hasKeywordRuleMatch = true;
              }
            }
          }

          // 3. Kiểm tra Checkout Products keywords
          if (!hasKeywordRuleMatch && checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
            for (const prod of checkoutConfig.checkoutProducts) {
              if (prod.active !== false && prod.keywords) {
                const kws = prod.keywords.toLowerCase().split(/[;,]/).map(k => k.trim()).filter(Boolean);
                const pNorm = normStr(prod.productName);
                if (kws.some(k => commentNorm.raw.includes(k)) || (pNorm.raw && (commentNorm.raw.includes(pNorm.raw) || (pNorm.noAcc.length >= 3 && commentNorm.noAcc.includes(pNorm.noAcc))))) {
                  hasKeywordRuleMatch = true;
                  break;
                }
              }
            }
          }
        }

        // 🛡️ A1.5. BỘ LỌC BÌNH LUẬN VÔ NGHĨA / LỜI CHÀO THÔNG THƯỜNG
        // CHỈ LỌC khi KHÔNG khớp bất kỳ keyword rule nào đã cài đặt
        if (!hasKeywordRuleMatch && commentConfig.filterTrivialComments !== false && !isTestMode && commentText) {
          const trimmed = commentText.trim().toLowerCase();
          const trivialPatterns = /^(ch[aà]o|hi+|hello|helo|helu|hey|xin ch[aà]o|alo|[eê]|[oơ]i|a l[oô]|ch[aà]o em|ch[aà]o b[aạ]n|ch[aà]o shop|ch[aà]o m[oọ]i ng[uư][oờ]i|m[oọ]i ng[uư][oờ]i|c[aả] nh[aà]|ok|okie|oke|v[aâ]ng|d[aạ]|[uư]|[uừ]|[oờ]|ha+|hihi|hehe|huhu|kk+|lol|ơ+|ê+|ủa|\d{1,3}|\.+|!+|\?+|❤️*|😀*|😊*|😂*|💕*|👋*|🥰*|👏*|🔥*|💯*|dot|ch[aấ]m)\.?\s*$/i;
          if (trivialPatterns.test(trimmed) && trimmed.length < 20) {
            console.log('🛡️ [AvaLive AI] Bỏ qua bình luận chào hỏi/vô nghĩa:', commentText);
            setIsProcessingEvent(false);
            return;
          }
        }

        // ⏱️ A2. KIỂM TRA GIÃN CÁCH TRẢ LỜI BÌNH LUẬN
        const cooldownSec = Math.max(5, parseInt(commentConfig.waitBetweenEvents ?? commentConfig.commentReplyCooldown) || 5);
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

        // =========================================================================
        // 🎯 QUY TRÌNH 4 BƯỚC PHẢN HỒI BÌNH LUẬN CHUẨN XÁC
        // =========================================================================
        
        // BƯỚC 1: TIỀN TỐ ĐỌC LẠI BÌNH LUẬN TRƯỚC KHI TRẢ LỜI
        const userSalutation = (userName && userName.toLowerCase() !== 'bạn') ? `bạn ${userName}` : 'bạn';
        const isQuestion = commentText.includes('?') || 
          /^(ai|sao|gì|đâu|nào|bao nhiêu|thế nào|không|hả|chưa|khi nào|bao giờ|mấy)/i.test(commentText) ||
          /(không|ko|hả|chưa|nhỉ|nhé|ạ|sao)\?*$/i.test(commentText);
        
        let repeatPrefix = '';
        if (commentConfig.repeatCommentFirst !== false) {
          if (commentConfig.repeatCommentPrefix && commentConfig.repeatCommentPrefix.trim()) {
            repeatPrefix = fillTemplate(commentConfig.repeatCommentPrefix, { user: userName, comment: commentText });
          } else {
            repeatPrefix = isQuestion
              ? `Dạ em cảm ơn ${userSalutation} đã hỏi: "${commentText}". `
              : `Dạ em cảm ơn ${userSalutation} đã bình luận: "${commentText}". `;
          }
        }

        let bodyAnswer = '';
        let isHandled = false;
        let isKeywordMatched = false;
        const lowerComment = commentText.toLowerCase();

        // 🎯 BƯỚC 2: ƯU TIÊN SỐ 1 (100% TUYỆT ĐỐI) - ĐỐI CHIẾU DANH SÁCH TỪ KHÓA FILE TẢI LÊN & CẤU HÌNH (KHÔNG DÙNG AI)
        if (!isHandled && commentConfig.active !== false && useKw) {
          if (matchedRulePre) {
            const replyTpl = matchedRulePre.replyText || matchedRulePre.reply;
            bodyAnswer = fillTemplate(replyTpl, { user: userName, comment: commentText });
            isHandled = true;
            isKeywordMatched = true;
            if (matchedRulePre.role || matchedRulePre.voiceId) {
              currentEvConfig._matchedRuleRole = matchedRulePre.role;
              currentEvConfig._matchedRuleVoiceId = matchedRulePre.voiceId;
            }
          } else {
            const seenRules = new Set();
            for (const rule of allKeywordRules) {
              if (!rule || rule.enabled === false || !rule.keywords) continue;
              const rKey = (rule.id || '') + '_' + String(rule.keywords);
              if (seenRules.has(rKey)) continue;
              seenRules.add(rKey);

              const kwArr = Array.isArray(rule.keywords) ? rule.keywords : String(rule.keywords).split(/[;,]\s*|\n/);
              const matched = kwArr.some(k => {
                const kNorm = normStr(k);
                if (!kNorm.clean) return false;
                return commentNorm.raw.includes(kNorm.raw) || 
                       commentNorm.clean.includes(kNorm.clean) || 
                       (kNorm.noAcc.length >= 2 && commentNorm.noAcc.includes(kNorm.noAcc));
              });
              if (matched && (rule.replyText || rule.reply)) {
                const replyTpl = rule.replyText || rule.reply;
                bodyAnswer = fillTemplate(replyTpl, { user: userName, comment: commentText });
                isHandled = true;
                isKeywordMatched = true;
                if (rule.role || rule.voiceId) {
                  currentEvConfig._matchedRuleRole = rule.role;
                  currentEvConfig._matchedRuleVoiceId = rule.voiceId;
                }
                break;
              }
            }
          }
        }

        // 2.1. Kiểm tra Kho Tri Thức Doanh Nghiệp & Sản Phẩm (Knowledge Base)
        const company = scriptConfig.companyName || checkoutConfig.companyName || 'Shop';
        const product = scriptConfig.productName || checkoutConfig.productName || 'Sản phẩm';
        const price = scriptConfig.productPrice || checkoutConfig.productPrice || 'ưu đãi cực sốc';
        const promo = scriptConfig.promotions || checkoutConfig.promotions || 'freeship toàn quốc';
        const features = scriptConfig.keyFeatures || checkoutConfig.keyFeatures || 'chất lượng cao, cam kết chính hãng';
        const warranty = scriptConfig.warrantyPolicy || checkoutConfig.warrantyPolicy || 'bảo hành đổi trả uy tín';

        if (!isHandled && (replySource === 'knowledge_base' || replySource === 'both')) {
          if (lowerComment.includes('giá') || lowerComment.includes('bao nhiêu') || lowerComment.includes('tiền') || lowerComment.includes('chi phí') || lowerComment.includes('sale') || commentNorm.noAcc.includes('gia bao nhieu')) {
            bodyAnswer = `Sản phẩm ${product} của ${company} đang có giá ${price} kèm khuyến mãi: ${promo}. Bạn bấm ngay vào giỏ hàng góc trái màn hình để nhận ưu đãi nha!`;
            isHandled = true;
            isKeywordMatched = true;
          } else if (lowerComment.includes('bảo hành') || lowerComment.includes('đổi trả') || lowerComment.includes('ship') || lowerComment.includes('giao hàng') || lowerComment.includes('vận chuyển') || commentNorm.noAcc.includes('bao hanh') || commentNorm.noAcc.includes('giao hang')) {
            bodyAnswer = `Bạn yên tâm nha, bên em có chính sách: ${warranty} và hỗ trợ giao hàng tận nơi ạ!`;
            isHandled = true;
            isKeywordMatched = true;
          } else if (lowerComment.includes('mua') || lowerComment.includes('đặt hàng') || lowerComment.includes('chốt') || lowerComment.includes('lấy') || lowerComment.includes('order') || commentNorm.noAcc.includes('dat hang') || commentNorm.noAcc.includes('chot')) {
            bodyAnswer = `Em cảm ơn bạn đã tin tưởng ${company}! Bạn bấm trực tiếp vào giỏ hàng góc trái màn hình để chốt đơn ${product} nhận ngay mã quà tặng nha!`;
            isHandled = true;
            isKeywordMatched = true;
          } else if (lowerComment.includes('dùng') || lowerComment.includes('tính năng') || lowerComment.includes('chức năng') || lowerComment.includes('sao') || lowerComment.includes('như thế nào') || lowerComment.includes('chất liệu') || lowerComment.includes('công dụng')) {
            bodyAnswer = `${product} nổi bật với tính năng: ${features.split('\n')[0] || features}. Sử dụng rất thích và hiệu quả cao ạ!`;
            isHandled = true;
            isKeywordMatched = true;
          }
        }

        // 2.2. Kiểm tra kịch bản Chốt Đơn Sản Phẩm (Checkout Products)
        if (!isHandled && checkoutConfig.active !== false && Array.isArray(checkoutConfig.checkoutProducts)) {
          for (const prod of checkoutConfig.checkoutProducts) {
            if (prod.active !== false && prod.keywords) {
              const kws = prod.keywords.toLowerCase().split(/[;,]/).map(k => k.trim()).filter(Boolean);
              const pNorm = normStr(prod.productName);
              const matched = kws.some(k => {
                const kNorm = normStr(k);
                return commentNorm.raw.includes(kNorm.raw) || 
                       commentNorm.clean.includes(kNorm.clean) || 
                       (kNorm.noAcc.length >= 2 && commentNorm.noAcc.includes(kNorm.noAcc));
              }) || (pNorm.raw && (commentNorm.raw.includes(pNorm.raw) || commentNorm.clean.includes(pNorm.clean) || (pNorm.noAcc.length >= 3 && commentNorm.noAcc.includes(pNorm.noAcc))));

              if (matched) {
                isHandled = true;
                isKeywordMatched = true;
                currentMatchedCheckoutProduct = prod;
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

        // 🧠 BƯỚC 3: DỰ PHÒNG BỘ NÃO AI GEMINI (CHỈ CHẠY KHI HOÀN TOÀN KHÔNG KHỚP TỪ KHÓA TRONG FILE/CẤU HÌNH)
        if (!isHandled) {
          if (lowerComment.includes('xinh') || lowerComment.includes('đẹp') || lowerComment.includes('dễ thương')) {
            bodyAnswer = `Em cảm ơn lời khen cực kỳ ngọt ngào của ${userSalutation} nha! Rất vui được đồng hành cùng bạn trong buổi live hôm nay!`;
            isHandled = true;
          } else if (useAi && commentConfig.useAi !== false) {
            // GỌI BỘ NÃO AI GEMINI TRẢ LỜI ĐÚNG TRỌNG TÂM TRONG DUY NHẤT 1 CÂU (10-15 TỪ)
            try {
              const liveContext = `Livestream bán hàng và tương tác trực tuyến. Sản phẩm: ${product}. Cửa hàng: ${company}. Giá: ${price}. Ưu đãi: ${promo}.`;
              const aiPrompt = commentConfig.aiPrompt 
                ? fillTemplate(commentConfig.aiPrompt, { user: userName, comment: commentText, product })
                : `Khán giả "${userName}" vừa hỏi: "${commentText}". ĐÃ CÓ TIỀN TỐ ĐỌC TÊN VÀ NHẮC LẠI CÂU HỎI RỒI. Hãy trả lời cực kỳ ngắn gọn, súc tích, đúng trọng tâm trong DUY NHẤT 1 CÂU từ 10 đến 15 từ. Tự xưng là "em", trả lời thẳng vào câu hỏi, tuyệt đối không nhắc lại câu hỏi, không lan man dài dòng.`;

              const aiRes = await askGeminiLiveAi({
                question: commentText,
                username: userName,
                role: commentConfig.ttsVoiceRole || commentConfig.speaker || 'assistant',
                context: `${liveContext}. Hướng dẫn AI: ${aiPrompt}`
              });

              if (aiRes && aiRes.text && aiRes.text.trim()) {
                const cleanAiText = aiRes.text.trim();
                // Bỏ qua câu generic chúc bạn... nếu AI fallback
                if (!cleanAiText.startsWith('Dạ em đã ghi nhận bình luận của bạn') || !cleanAiText.includes('ngập tràn niềm vui')) {
                  bodyAnswer = cleanAiText;
                  isHandled = true;
                }
              }
            } catch (aiErr) {
              console.warn('AI Brain call error:', aiErr);
            }
          }
        }

        // 🛡️ BƯỚC 4: DỰ PHÒNG AN TOÀN CHĂM SÓC KHÁCH HÀNG (KHI AI LỖI HOẶC KHÔNG PHẢN HỒI)
        if (!isHandled || !bodyAnswer) {
          if (commentConfig.useUnknownFallbackReply !== false && commentConfig.unknownFallbackReply && commentConfig.unknownFallbackReply.trim()) {
            bodyAnswer = fillTemplate(commentConfig.unknownFallbackReply, { user: userName, comment: commentText });
            isHandled = true;
          } else if (Array.isArray(commentConfig.prompts) && commentConfig.prompts.length > 0) {
            const activePrompts = commentConfig.prompts.filter(p => p && p.enabled !== false && p.text);
            if (activePrompts.length > 0) {
              const pItem = activePrompts[Math.floor(Math.random() * activePrompts.length)];
              bodyAnswer = fillTemplate(pItem.text, { user: userName, comment: commentText });
              if (pItem.role) currentEvConfig._matchedRuleRole = pItem.role;
              isHandled = true;
            }
          } else if (commentConfig.sampleAnswers && commentConfig.sampleAnswers.trim()) {
            bodyAnswer = fillTemplate(getRandomSample(commentConfig.sampleAnswers), { user: userName, comment: commentText });
            isHandled = true;
          } else {
            bodyAnswer = `Dạ bạn ${userSalutation} ơi, câu hỏi này em là trợ lý live nên xin phép ghi nhận lại để shop tư vấn chi tiết cho mình trong tin nhắn nhé!`;
            isHandled = true;
          }
        }

        // BƯỚC 3: GHÉP CÂU HỎI GỢI MỞ CHĂM SÓC KHÁCH HÀNG NẾU ĐƯỢC BẬT
        if (commentConfig.appendFollowUpQuestion !== false && commentConfig.followUpQuestionText && commentConfig.followUpQuestionText.trim()) {
          const followUp = fillTemplate(commentConfig.followUpQuestionText, { user: userName, comment: commentText }).trim();
          if (followUp && !bodyAnswer.toLowerCase().includes(followUp.toLowerCase())) {
            bodyAnswer = `${bodyAnswer} ${followUp}`.trim();
          }
        }

        // GHÉP TOÀN BỘ CÂU THOẠI HOÀN CHỈNH
        replyText = `${repeatPrefix} ${bodyAnswer}`.replace(/\s+/g, ' ').trim();
        chatText = bodyAnswer.trim() || replyText;
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
        // Tuyệt đối không chào nếu không có tên thật hoặc là tên ảo/placeholder (ngoại trừ khi test thủ công)
        if (!isTestMode) {
          const rawTrimmed = (rawUserName || '').trim();
          if (!rawTrimmed || rawTrimmed === 'Bạn' || rawTrimmed === 'Khách mới' || rawTrimmed === 'Khán Giả' || rawTrimmed === 'Khán giả' || rawTrimmed === 'Viewer') {
            return;
          }
        }
        const viewerKey = (rawUserName || '').toLowerCase().trim();
        
        // 🛡️ Mỗi người xem chỉ được chào ĐÚNG 1 LẦN duy nhất trong suốt phiên live
        if (!isTestMode && viewerKey && greetedViewersRef.current.has(viewerKey)) {
          console.log(`[AvaLive] Đã chào rồi, bỏ qua: ${viewerKey}`);
          return;
        }
        if (viewerKey) {
          greetedViewersRef.current.add(viewerKey);
          // Giới hạn bộ nhớ tối đa 1000 viewer
          if (greetedViewersRef.current.size > 1000) {
            const first = greetedViewersRef.current.values().next().value;
            greetedViewersRef.current.delete(first);
          }
        }
        
        // Chào luân phiên từng câu (Round-Robin tuần tự, không random)
        if (welcomeConfig.sampleAnswers) {
          replyText = fillTemplate(getSequentialSample(welcomeConfig.sampleAnswers, welcomeIndexRef, 'Dạ em chào bạn {user} mới vào xem live nha!'), { user: userName, count: 1 });
        }
        if (!replyText || !replyText.trim()) {
          const greetName = (userName && userName.toLowerCase() !== 'bạn') ? `bạn ${userName}` : 'bạn';
          replyText = `Dạ em chào ${greetName} mới vào xem live nha! Chúc mình xem live thật vui và săn được nhiều deal hời cùng shop ạ!`;
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
          // ⚡ Bắn trực tiếp text lên màn hình Sân Khấu Chính bằng Overlay Text
          syncMasterLiveState({
            stage: 'idol',
            overlayText: chatText || replyText,
            overlayTextTransform: { x: 5, y: 75, width: 90, height: 20 },
            overlayTextStyle: 'neon_cyber',
            overlayTextFontSize: 18,
            overlayTextColor: '#38bdf8'
          });
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
        } else {
          setIsProcessingEvent(false);
        }
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
    setIsProcessingEvent(false);
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
