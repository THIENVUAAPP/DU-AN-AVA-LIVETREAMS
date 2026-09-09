import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, FastForward, Mic, Volume2, Sparkles } from 'lucide-react';
import { getDualVoiceConfig, previewVoiceAudio, stopVoiceAudio } from '../../utils/voiceSyncService';

/**
 * AIAudioPlayer - Quản lý hàng đợi phát âm thanh thông minh trong Livestream
 * - Tự động phát tuần tự kịch bản bán hàng (Fixed Script) từ câu đầu đến câu cuối.
 * - Khi có sự kiện ưu tiên (Trả lời comment, Chào viewer mới, Cảm ơn quà tặng):
 *   Tạm dừng câu thoại kịch bản hiện tại, phát câu trả lời ngay lập tức,
 *   sau đó tự động tiếp tục phát đúng câu thoại kịch bản tiếp theo mà không bị lặp hay mất vị trí.
 * - Tự động lặp lại kịch bản khi đọc hết (nếu cấu hình loopScript = true).
 */
const AIAudioPlayer = forwardRef(({ isLive, onAudioPlayStateChange, onActionTriggered, currentVideoUrl }, ref) => {
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

  // 1. Lấy Job & Kịch bản từ LocalStorage khi Live bắt đầu
  useEffect(() => {
    if (isLive) {
      try {
        const savedJob = localStorage.getItem('aidol_active_job');
        if (savedJob) {
          const parsed = JSON.parse(savedJob);
          setJob(parsed);
          
          if (parsed && typeof parsed.scriptContent === 'string' && parsed.scriptContent.trim()) {
            const rawSentences = parsed.scriptContent
              .split(/\r?\n/)
              .map(s => s.trim())
              .filter(Boolean);

            const expandedSentences = [];
            for (const line of rawSentences) {
              if (line.length > 140) {
                const parts = line.split(/(?<=[.!?;\n])\s+/).map(p => p.trim()).filter(Boolean);
                if (parts.length > 1) {
                  expandedSentences.push(...parts);
                  continue;
                }
              }
              expandedSentences.push(line);
            }

            const scriptItems = expandedSentences.map((s, idx) => ({
              id: `script_${idx}`,
              type: 'script',
              text: s.trim(),
              voiceChannel: 'idol',
              index: idx
            }));

            setQueue(scriptItems);
            queueRef.current = scriptItems;
            setCurrentIndex(0);
            currentIndexRef.current = 0;
            setIsPlaying(true);
            isPlayingRef.current = true;
          }
        }
      } catch (err) {
        console.warn("AIAudioPlayer failed to parse active job:", err);
      }
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
      isBusyRef.current = false;
      stopVoiceAudio();
      const aud = getAudio();
      if (aud) aud.pause();
    }
  }, [isLive]);

  // 2. Vòng lặp phát âm thanh
  useEffect(() => {
    if (!isPlaying || isBusyRef.current || queue.length === 0) {
      if (!isPlaying && onAudioPlayStateChange) onAudioPlayStateChange(false);
      return;
    }

    if (currentIndex >= queue.length) {
      // Đã đọc hết kịch bản: Kiểm tra xem có lặp lại không
      const savedConfig = localStorage.getItem('aidol_live_event_configs');
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
        if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      }
      return;
    }

    const currentItem = queue[currentIndex];
    if (currentItem) {
      playItem(currentItem);
    }
  }, [currentIndex, isPlaying, queue]);

  const playItem = async (item) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;

    try {
      if (onAudioPlayStateChange) onAudioPlayStateChange(true);
      
      const channel = item.voiceChannel || (item.type === 'script' ? 'idol' : item.type === 'comment' ? 'comment' : 'manager');
      const activeVoice = channel === 'idol' 
        ? (voiceConfig.idolVoice || { id: 'free_vi_female', lang: 'vi-VN', gender: 'Female' })
        : (channel === 'comment' ? (voiceConfig.commentVoice || voiceConfig.idolVoice) : voiceConfig.managerVoice);
      
      if (activeVoice?.enabled === false) {
        isBusyRef.current = false;
        if (isPlayingRef.current) {
          setCurrentIndex(prev => prev + 1);
        }
        return;
      }

      // Trừ token trải nghiệm AI
      const charLen = (item.text || '').length || 30;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive:deduct_token', {
          detail: {
            amount: charLen,
            reason: `Voice AI (${channel === 'idol' ? 'Idol' : channel === 'comment' ? 'Bình Luận AI' : 'Quản Lý'}): "${(item.text || '').slice(0, 20)}..."`
          }
        }));
      }

      await previewVoiceAudio(activeVoice, item.text, {
        priority: item.type === 'dynamic',
        isTest: false,
        onEnd: () => {
          if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
          isBusyRef.current = false;
          if (isPlayingRef.current) {
            setCurrentIndex(prev => prev + 1);
          }
        }
      });
    } catch (err) {
      console.error('Audio play error:', err);
      isBusyRef.current = false;
      if (isPlayingRef.current) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    enqueueItem: (text, action, isImmediate = false, options = {}) => {
      const voiceChannel = options?.voiceChannel || (action?.includes('COMMENT') ? 'comment' : action?.includes('IDOL') ? 'idol' : 'manager');
      const newItem = { id: `dyn_${Date.now()}`, type: 'dynamic', text, action, voiceChannel };
      
      if (isImmediate) {
        // Ngắt câu hiện tại, chèn vào ngay sau vị trí hiện tại và phát lập tức
        stopVoiceAudio();
        const aud = getAudio();
        if (aud) aud.pause();

        isBusyRef.current = false;
        setQueue(prev => {
          const next = [...prev];
          const insertIdx = currentIndexRef.current;
          next.splice(insertIdx, 0, newItem);
          return next;
        });
        setIsPlaying(true);
        isPlayingRef.current = true;
      } else {
        setQueue(prev => {
          const next = [...prev];
          const insertIdx = currentIndexRef.current + 1;
          next.splice(insertIdx, 0, newItem);
          return next;
        });
        setIsPlaying(true);
        isPlayingRef.current = true;
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
