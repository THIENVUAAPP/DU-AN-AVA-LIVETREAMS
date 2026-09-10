import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, FastForward, Mic, Volume2, Sparkles } from 'lucide-react';
import { 
  getDualVoiceConfig, 
  previewVoiceAudio, 
  stopVoiceAudio, 
  prefetchTTSAudio,
  getMultiAvatarConfig,
  parseMultiCharacterScript,
  ALL_SYSTEM_VOICES
} from '../../utils/voiceSyncService';

/**
 * AIAudioPlayer - Quản lý hàng đợi phát âm thanh thông minh trong Livestream
 * - Tự động phát tuần tự kịch bản bán hàng (Fixed Script) từ câu đầu đến câu cuối xuyên suốt 100%.
 * - Hỗ trợ phân vai đa nhân vật (Idol, Trợ lý, BLV Game, Khách mời) và chuyển đổi giọng đọc + nhép miệng tương ứng.
 * - Khi có sự kiện ưu tiên (Trả lời bình luận, Chào viewer mới, Cảm ơn quà tặng):
 *   Đọc dứt điểm hết câu thoại kịch bản hiện tại (không ngắt ngang giữa chừng),
 *   sau đó phát câu trả lời/chào hỏi ngay lập tức,
 *   rồi tự động tiếp tục phát đúng câu thoại kịch bản tiếp theo mà không bị lặp hay mất vị trí.
 * - Tự động lặp lại kịch bản khi đọc hết (nếu cấu hình loopScript = true).
 */
const AIAudioPlayer = forwardRef(({ isLive, isScriptRunning = false, onAudioPlayStateChange, onActionTriggered, currentVideoUrl }, ref) => {
  const [job, setJob] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState(getDualVoiceConfig());
  
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isBusyRef = useRef(false);
  const queueRef = useRef([]);
  const currentIndexRef = useRef(0);
  const priorityQueueRef = useRef([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Đồng bộ cấu hình Voice toàn app khi có cập nhật
  useEffect(() => {
    const handleVoiceUpdate = (e) => {
      if (e.detail) {
        setVoiceConfig(e.detail);
      } else {
        setVoiceConfig(getDualVoiceConfig());
      }
    };
    window.addEventListener('aidol_voice_sync_updated', handleVoiceUpdate);
    return () => window.removeEventListener('aidol_voice_sync_updated', handleVoiceUpdate);
  }, []);

  const getAudio = () => {
    if (!audioRef.current && typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  };

  // 1. Lấy Job & Kịch bản từ Workspace Sự Kiện hoặc LocalStorage khi Live bắt đầu
  const loadScriptFromStorage = (customText = null) => {
    let scriptRaw = typeof customText === 'string' && customText.trim() ? customText : '';
    
    // Ưu tiên 1: Kịch bản persistent của người dùng
    if (!scriptRaw) {
      const persistentTabsRaw = localStorage.getItem('aidol_user_script_tabs_persistent');
      if (persistentTabsRaw) {
        try {
          const pTabs = JSON.parse(persistentTabsRaw);
          if (Array.isArray(pTabs) && pTabs.length > 0) {
            const activeTab = pTabs.find(t => t.active) || pTabs[0];
            if (activeTab && activeTab.fixedScriptText) {
              scriptRaw = activeTab.fixedScriptText;
            }
          }
        } catch (e) {}
      }
    }

    // Ưu tiên 2: Kịch bản trong aidol_event_configs
    if (!scriptRaw) {
      const eventConfigsRaw = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      if (eventConfigsRaw) {
        try {
          const evConf = JSON.parse(eventConfigsRaw);
          if (evConf.script_broadcast) {
            if (Array.isArray(evConf.script_broadcast.scriptTabs) && evConf.script_broadcast.scriptTabs.length > 0) {
              const activeTab = evConf.script_broadcast.scriptTabs.find(t => t.active) || 
                evConf.script_broadcast.scriptTabs.find(t => t.id === evConf.script_broadcast.activeScriptTabId) || 
                evConf.script_broadcast.scriptTabs[0];
              if (activeTab && activeTab.fixedScriptText) {
                scriptRaw = activeTab.fixedScriptText;
              }
            }
            if (!scriptRaw && evConf.script_broadcast.fixedScriptText) {
              scriptRaw = evConf.script_broadcast.fixedScriptText;
            }
          }
        } catch (e) {}
      }
    }

    // Ưu tiên 3: Kịch bản trong aidol_active_job
    if (!scriptRaw) {
      const savedJob = localStorage.getItem('aidol_active_job');
      if (savedJob) {
        try {
          const parsed = JSON.parse(savedJob);
          setJob(parsed);
          if (parsed && typeof parsed.scriptContent === 'string' && parsed.scriptContent.trim()) {
            scriptRaw = parsed.scriptContent;
          }
        } catch (e) {}
      }
    }

    // Ưu tiên 4: Kịch bản mẫu mặc định
    if (!scriptRaw) {
      scriptRaw = `Chào mừng tất cả các tình yêu đã có mặt trong phiên livestream làm đẹp đặc biệt ngày hôm nay của shop em nha!
Các chị đẹp ơi, ai đang lướt qua phiên live thì cho em xin một nút thả tim và một lượt chia sẻ để nhận quà mở bát đầu live nào!
Hôm nay shop em mang đến cho cả nhà một siêu phẩm chăm sóc sắc đẹp và nâng tầm khí chất cực kỳ đỉnh cao luôn ạ!
Đó chính là Bộ Đôi Tinh Chất Serum Tế Bào Gốc Phục Hồi Da Trẻ Hóa và Nước Hoa Pháp Cao Cấp lưu hương suốt 12 giờ đồng hồ!
Chị nào mà da đang bị khô ráp, thâm sạm, không đều màu hoặc bắt đầu xuất hiện nếp nhăn lão hóa thì nhất định không được bỏ qua live này nhé!
Chỉ sau đúng 7 ngày sử dụng, làn da của các chị sẽ căng bóng, mịn màng và mướt như da em bé luôn ạ!
Duy nhất trong phiên livestream ngày hôm nay, giảm sốc 50% chỉ còn 890.000đ tặng kèm kem dưỡng ẩm mini và freeship toàn quốc!
Bên em cam kết 100% hàng chính hãng, bảo hành 1 đổi 1 trong 30 ngày, bấm vào Giỏ Hàng góc trái săn ngay nhé!`;
    }

    const multiConf = getMultiAvatarConfig();
    const hasRoleTags = /\[([^\]]+)\]\s*:/i.test(scriptRaw) || /^(Idol|Trợ Lý|Quản Lý|BLV|Game|Khách Mời|Host)\s*:/im.test(scriptRaw);

    if (multiConf.enabled || hasRoleTags) {
      const parsedMulti = parseMultiCharacterScript(scriptRaw, multiConf);
      if (parsedMulti.length > 0) {
        return parsedMulti.map((pItem, idx) => ({
          id: `script_${idx}`,
          type: 'script',
          text: pItem.text,
          rawLine: pItem.rawLine,
          avatarId: pItem.avatarId,
          avatarName: pItem.avatarName,
          role: pItem.role,
          voiceId: pItem.voiceId,
          voiceObj: pItem.voiceObj,
          volume: pItem.volume,
          rate: pItem.rate,
          voiceChannel: pItem.role || 'idol',
          index: idx
        }));
      }
    }

    const rawSentences = scriptRaw
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);

    return rawSentences.map((s, idx) => ({
      id: `script_${idx}`,
      type: 'script',
      text: s.trim(),
      voiceChannel: 'idol',
      index: idx
    }));
  };

  // Khởi động khi isScriptRunning được kích hoạt
  useEffect(() => {
    if (isScriptRunning) {
      try {
        const scriptItems = loadScriptFromStorage();
        setQueue(scriptItems);
        queueRef.current = scriptItems;
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        priorityQueueRef.current = [];
        setIsPlaying(true);
        isPlayingRef.current = true;
        isBusyRef.current = false;
        if (scriptItems.length > 0) {
          playItem(scriptItems[0], true);
        }
      } catch (err) {
        console.warn("AIAudioPlayer failed to parse script:", err);
      }
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
      isBusyRef.current = false;
      stopVoiceAudio();
      const aud = getAudio();
      if (aud) aud.pause();
    }
  }, [isScriptRunning]);

  // Lắng nghe sự kiện cập nhật / chuyển tab kịch bản từ WorkspaceTacVu hoặc bên ngoài
  useEffect(() => {
    const handleScriptUpdate = (e) => {
      try {
        const customText = e?.detail?.fixedScriptText || null;
        const scriptItems = loadScriptFromStorage(customText);
        setQueue(scriptItems);
        queueRef.current = scriptItems;
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        priorityQueueRef.current = [];
        if (isScriptRunning || isPlayingRef.current) {
          setIsPlaying(true);
          isPlayingRef.current = true;
          isBusyRef.current = false;
          stopVoiceAudio();
          if (scriptItems.length > 0) {
            playItem(scriptItems[0], true);
          }
        }
      } catch (err) {
        console.warn("Lỗi đồng bộ kịch bản mới:", err);
      }
    };

    window.addEventListener('aidol_script_updated', handleScriptUpdate);
    return () => window.removeEventListener('aidol_script_updated', handleScriptUpdate);
  }, [isScriptRunning]);

  // 2. Vòng lặp phát âm thanh
  useEffect(() => {
    if (!isPlaying || isBusyRef.current) {
      if (!isPlaying && onAudioPlayStateChange) onAudioPlayStateChange(false);
      return;
    }

    // Kiểm tra nếu có sự kiện ưu tiên trong hàng đợi
    if (priorityQueueRef.current.length > 0) {
      const priorityItem = priorityQueueRef.current.shift();
      playItem(priorityItem, false);
      return;
    }

    if (queue.length === 0) return;

    if (currentIndex >= queue.length) {
      // Đã đọc hết kịch bản: Tự động lặp lại kịch bản
      const savedConfig = localStorage.getItem('aidol_event_configs') || localStorage.getItem('aidol_event_configs_backup');
      let shouldLoop = true;
      try {
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          if (parsed.script_broadcast && parsed.script_broadcast.loopScript === false) {
            shouldLoop = false;
          }
        }
      } catch (e) {}

      if (shouldLoop && queue.length > 0) {
        setCurrentIndex(0);
        currentIndexRef.current = 0;
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      }
      return;
    }

    const currentItem = queue[currentIndex];
    if (currentItem) {
      playItem(currentItem, true);
    }
  }, [currentIndex, isPlaying, queue]);

  const playItem = async (item, isScriptItem = true) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      if (onAudioPlayStateChange) onAudioPlayStateChange(true);
      
      const channel = item.voiceChannel || (item.type === 'script' ? 'idol' : item.type === 'comment' ? 'comment' : 'manager');
      const latestDualVoices = getDualVoiceConfig();
      
      let activeVoice = item.voiceObj;
      if (!activeVoice) {
        activeVoice = channel === 'idol' 
          ? (latestDualVoices.idolVoice || voiceConfig.idolVoice || { id: 'free_vi_female', lang: 'vi-VN', gender: 'Female' })
          : (channel === 'comment' ? (latestDualVoices.commentVoice || voiceConfig.commentVoice || latestDualVoices.idolVoice) : (latestDualVoices.managerVoice || voiceConfig.managerVoice));
      }
      
      if (activeVoice?.enabled === false) {
        isBusyRef.current = false;
        if (isScriptItem && isPlayingRef.current) {
          setCurrentIndex(prev => prev + 1);
        }
        return;
      }

      // Thông báo cho toàn bộ hệ thống (DesktopAppUI, CleanLiveOverlay, OBS) nhân vật nào đang nói
      const speakingAvatarId = item.avatarId || (channel === 'idol' ? 'avatar_1' : channel === 'manager' || channel === 'assistant' ? 'avatar_2' : channel === 'game' ? 'avatar_3' : 'avatar_1');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_speaker_change', {
          detail: {
            avatarId: speakingAvatarId,
            role: item.role || channel,
            avatarName: item.avatarName,
            isSpeaking: true
          }
        }));
      }

      if (onActionTriggered) {
        onActionTriggered({ 
          type: 'LIPSYNC_STARTED', 
          avatarId: speakingAvatarId, 
          role: item.role || channel 
        });
      }

      // Trừ token trải nghiệm AI
      const charLen = (item.text || '').length || 30;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive:deduct_token', {
          detail: {
            amount: charLen,
            reason: `Voice AI (${item.avatarName || (channel === 'idol' ? 'Idol' : channel === 'comment' ? 'Bình Luận AI' : 'Quản Lý')}): "${(item.text || '').slice(0, 20)}..."`
          }
        }));
      }

      // Lookahead pre-fetching câu tiếp theo trong kịch bản livestream vào RAM
      if (isScriptItem) {
        const nextIdx = currentIndexRef.current + 1;
        if (queueRef.current && queueRef.current[nextIdx]) {
          const nextItem = queueRef.current[nextIdx];
          const nextVoice = nextItem.voiceObj || (nextItem.voiceChannel === 'idol' ? (latestDualVoices.idolVoice || voiceConfig.idolVoice) : (latestDualVoices.managerVoice || voiceConfig.managerVoice));
          if (nextVoice) prefetchTTSAudio(nextItem.text, nextVoice);
        }
      } else if (priorityQueueRef.current.length > 0) {
        const nextPri = priorityQueueRef.current[0];
        const nextPriVoice = nextPri.voiceObj || (nextPri.voiceChannel === 'idol' ? (latestDualVoices.idolVoice || voiceConfig.idolVoice) : (latestDualVoices.managerVoice || voiceConfig.managerVoice));
        if (nextPriVoice) prefetchTTSAudio(nextPri.text, nextPriVoice);
      }

      await previewVoiceAudio(activeVoice, item.text, {
        priority: true,
        isTest: false,
        volume: item.volume !== undefined ? item.volume : activeVoice?.volume,
        rate: item.rate !== undefined ? item.rate : activeVoice?.rate,
        onEnd: () => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('avalive_speaker_change', {
              detail: {
                avatarId: null,
                role: null,
                isSpeaking: false
              }
            }));
          }
          if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
          isBusyRef.current = false;
          
          if (!isPlayingRef.current) return;

          // Nếu có sự kiện ưu tiên đang chờ, phát sự kiện ưu tiên
          if (priorityQueueRef.current.length > 0) {
            const nextPriority = priorityQueueRef.current.shift();
            playItem(nextPriority, false);
            return;
          }

          // Tiếp tục đọc câu thoại kịch bản tiếp theo
          if (isScriptItem) {
            setCurrentIndex(prev => prev + 1);
          } else {
            // Sau khi phát xong sự kiện ưu tiên, tiếp tục kịch bản tại vị trí hiện tại
            const curIdx = currentIndexRef.current;
            if (curIdx < queueRef.current.length) {
              playItem(queueRef.current[curIdx], true);
            }
          }
        }
      });
    } catch (err) {
      console.error('Audio play error:', err);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive_speaker_change', {
          detail: { avatarId: null, role: null, isSpeaking: false }
        }));
      }
      isBusyRef.current = false;
      if (isPlayingRef.current && isScriptItem) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startScript: (customScriptText = null) => {
      try {
        stopVoiceAudio();
        const scriptItems = loadScriptFromStorage(customScriptText);
        setQueue(scriptItems);
        queueRef.current = scriptItems;
        setCurrentIndex(0);
        currentIndexRef.current = 0;
        priorityQueueRef.current = [];
        setIsPlaying(true);
        isPlayingRef.current = true;
        isBusyRef.current = false;
        if (scriptItems.length > 0) {
          playItem(scriptItems[0], true);
        }
      } catch (e) {
        console.error('startScript error:', e);
      }
    },
    stopScript: () => {
      stopVoiceAudio();
      const aud = getAudio();
      if (aud) aud.pause();
      isBusyRef.current = false;
      priorityQueueRef.current = [];
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
    },
    reloadScript: (customScriptText = null) => {
      const scriptItems = loadScriptFromStorage(customScriptText);
      setQueue(scriptItems);
      queueRef.current = scriptItems;
    },
    enqueueItem: (text, action, isImmediate = false, options = {}) => {
      const voiceChannel = options?.voiceChannel || (action?.includes('COMMENT') ? 'comment' : action?.includes('IDOL') ? 'idol' : 'manager');
      const newItem = { id: `dyn_${Date.now()}`, type: 'dynamic', text, action, voiceChannel };
      
      // Cho vào hàng đợi ưu tiên: Đợi câu hiện tại đọc xong dứt điểm rồi phát ngay, không ngắt giữa chừng
      priorityQueueRef.current.push(newItem);
      
      if (!isBusyRef.current && isPlayingRef.current) {
        const nextPriority = priorityQueueRef.current.shift();
        if (nextPriority) {
          playItem(nextPriority, false);
        }
      }
    },
    playDirectAudio: (audioSrc, onEndedCallback) => {
      try {
        stopVoiceAudio();
        const aud = getAudio();
        if (aud) aud.pause();

        if (onAudioPlayStateChange) onAudioPlayStateChange(true);
        if (aud) {
          aud.src = audioSrc;
          aud.onended = () => {
            if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
            if (onAudioPlayStateChange) onAudioPlayStateChange(false);
            if (onEndedCallback) onEndedCallback();
          };
          aud.play().catch(e => console.warn('Direct audio play error:', e));
        }
      } catch (e) {
        console.error('playDirectAudio failed:', e);
      }
    },
    stopCurrent: () => {
      stopVoiceAudio();
      const aud = getAudio();
      if (aud) aud.pause();
      isBusyRef.current = false;
      priorityQueueRef.current = [];
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
    }
  }));

  return (
    <div className="bg-[#121216] border border-white/10 rounded-xl p-4 shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${isPlaying ? 'text-[#00FF66] animate-pulse' : 'text-gray-400'}`} />
          <h3 className="text-sm font-bold text-white">AI Director (Hàng Đợi Kịch Bản Live)</h3>
        </div>
        <div className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-2 py-1 rounded font-bold">
          {queue.length > 0 ? `Câu ${Math.min(currentIndex + 1, queue.length)} / ${queue.length}` : 'Đang chờ kịch bản...'}
        </div>
      </div>
      
      <div className="text-xs text-gray-300 mb-3 line-clamp-2 bg-black/40 p-2 rounded-lg border border-white/5">
        {queue[currentIndex] ? queue[currentIndex].text : 'Chưa có câu thoại nào trong hàng đợi...'}
      </div>
      
      <div className="flex items-center gap-2 border-t border-white/10 pt-3">
        <button 
          onClick={() => {
            const nextState = !isPlaying;
            setIsPlaying(nextState);
            isPlayingRef.current = nextState;
            if (!nextState) stopVoiceAudio();
          }} 
          className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
            isPlaying ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-[#00FF66]/20 text-[#00FF66] hover:bg-[#00FF66]/30'
          }`}
        >
          {isPlaying ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
          {isPlaying ? 'Tạm dừng đọc kịch bản' : 'Tiếp tục đọc kịch bản'}
        </button>
        <button 
          onClick={() => {
            stopVoiceAudio();
            isBusyRef.current = false;
            setCurrentIndex(prev => prev + 1);
          }} 
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors cursor-pointer"
          title="Bỏ qua câu này, chuyển sang câu tiếp theo"
        >
          <FastForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
});

export default AIAudioPlayer;
