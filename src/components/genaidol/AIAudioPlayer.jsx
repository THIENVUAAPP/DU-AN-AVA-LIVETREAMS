import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, FastForward, Settings, Mic, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { getDualVoiceConfig, previewVoiceAudio, stopVoiceAudio } from '../../utils/voiceSyncService';

const AIAudioPlayer = forwardRef(({ isLive, onAudioPlayStateChange, onActionTriggered, currentVideoUrl }, ref) => {
  const [job, setJob] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState(getDualVoiceConfig());
  const audioRef = useRef(null);

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

  // 1. Lấy Job từ LocalStorage khi Live bắt đầu
  useEffect(() => {
    if (isLive) {
      try {
        const savedJob = localStorage.getItem('aidol_active_job');
        if (savedJob) {
          const parsed = JSON.parse(savedJob);
          setJob(parsed);
          // Tách kịch bản thành từng câu ngắn an toàn
          if (parsed && typeof parsed.scriptContent === 'string' && parsed.scriptContent.trim()) {
            const sentences = parsed.scriptContent.split(/[.?!]/).filter(s => s.trim().length > 0);
            setQueue(sentences.map(s => ({ type: 'script', text: s.trim(), voiceChannel: 'idol' })));
            setCurrentIndex(0);
            setIsPlaying(true);
          }
        }
      } catch (err) {
        console.warn("AIAudioPlayer failed to parse active job:", err);
      }
    } else {
      setIsPlaying(false);
      const aud = getAudio();
      if (aud) {
        aud.pause();
      }
    }
  }, [isLive]);

  // 2. Vòng lặp phát Audio
  useEffect(() => {
    if (!isPlaying || queue.length === 0 || currentIndex >= queue.length) {
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      return;
    }

    const currentItem = queue[currentIndex];
    playItem(currentItem);
  }, [currentIndex, isPlaying, queue]);

  const playItem = async (item) => {
    try {
      if (onAudioPlayStateChange) onAudioPlayStateChange(true);
      
      const channel = item.voiceChannel || (item.type === 'script' ? 'idol' : item.type === 'comment' ? 'comment' : 'manager');
      const activeVoice = channel === 'idol' 
        ? voiceConfig.idolVoice 
        : (channel === 'comment' ? (voiceConfig.commentVoice || voiceConfig.idolVoice) : voiceConfig.managerVoice);
      
      if (activeVoice?.enabled === false) {
        // Kênh giọng đọc này đang bị tắt
        if (isPlaying) setCurrentIndex(prev => prev + 1);
        return;
      }

      const provider = activeVoice?.provider || job?.voiceProvider || 'gemini';
      const apiKey = provider === 'openai_tts' ? localStorage.getItem('openai_api_key') : localStorage.getItem('gemini_api_key');

      // GỌI API TTS THẬT HOẶC PHÁT QUA UNIFIED VOICE ENGINE
      const charLen = (item.text || '').length || 30;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avalive:deduct_token', {
          detail: {
            amount: charLen,
            reason: `Voice AI (${channel === 'idol' ? 'Idol' : channel === 'comment' ? 'Bình Luận AI' : 'Quản Lý'}): "${(item.text || '').slice(0, 20)}..."`
          }
        }));
      }

      await previewVoiceAudio(activeVoice || { id: 'el_rachel', provider: 'elevenlabs', gender: 'Female' }, item.text, () => {
        if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
        if (isPlaying) {
          setCurrentIndex(prev => prev + 1);
        }
      });
    } catch (err) {
      console.error('Audio play error, falling back to Web Speech with synced voice settings:', err);
      if (isPlaying) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    enqueueItem: (text, action, isImmediate = false, options = {}) => {
      const voiceChannel = options?.voiceChannel || (action?.includes('COMMENT') ? 'comment' : action?.includes('IDOL') ? 'idol' : 'manager');
      const newItem = { type: 'dynamic', text, action, voiceChannel };
      if (isImmediate) {
        const aud = getAudio();
        if (aud) {
          aud.pause();
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setQueue(prev => {
          const next = [...prev];
          next.splice(currentIndex, 0, newItem);
          return next;
        });
        setIsPlaying(true);
        playItem(newItem);
      } else {
        setQueue(prev => {
          const next = [...prev];
          next.splice(currentIndex + 1, 0, newItem);
          return next;
        });
        setIsPlaying(true);
      }
    },
    playDirectAudio: (audioSrc, onEndedCallback) => {
      try {
        const aud = getAudio();
        if (aud) {
          aud.pause();
        }
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
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
      const aud = getAudio();
      if (aud) {
        aud.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      if (onAudioPlayStateChange) onAudioPlayStateChange(false);
      if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
    }
  }));

  return (
    <div className="bg-[#121216] border border-white/10 rounded-xl p-4 shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className={`w-4 h-4 ${isPlaying ? 'text-[#00FF66] animate-pulse' : 'text-gray-400'}`} />
          <h3 className="text-sm font-bold text-white">AI Director (Hàng đợi)</h3>
        </div>
        <div className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-2 py-1 rounded">
          {job ? job.voiceProvider : 'Chưa có Job'}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mb-3 line-clamp-2">
        {queue[currentIndex] ? queue[currentIndex].text : 'Đang chờ...'}
      </div>
      
      <div className="flex items-center gap-2 border-t border-white/10 pt-3">
        <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 ${isPlaying ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[#00FF66]/20 text-[#00FF66] hover:bg-[#00FF66]/30'}`}>
          {isPlaying ? <Pause className="w-3 h-3"/> : <Play className="w-3 h-3"/>}
          {isPlaying ? 'Tạm dừng' : 'Tiếp tục'}
        </button>
        <button onClick={() => setCurrentIndex(prev => prev + 1)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors">
          <FastForward className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
});

export default AIAudioPlayer;
