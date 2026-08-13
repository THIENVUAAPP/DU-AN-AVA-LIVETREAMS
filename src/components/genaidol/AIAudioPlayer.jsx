import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, FastForward, Settings, Mic, Volume2 } from 'lucide-react';

const AIAudioPlayer = forwardRef(({ isLive, onAudioPlayStateChange, onActionTriggered, currentVideoUrl }, ref) => {
  const [job, setJob] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  
  // 1. Lấy Job từ LocalStorage khi Live bắt đầu
  useEffect(() => {
    if (isLive) {
      const savedJob = localStorage.getItem('aidol_active_job');
      if (savedJob) {
        const parsed = JSON.parse(savedJob);
        setJob(parsed);
        // Tách kịch bản thành từng câu ngắn
        const sentences = parsed.scriptContent.split(/[.?!]/).filter(s => s.trim().length > 0);
        setQueue(sentences.map(s => ({ type: 'script', text: s.trim() })));
        setCurrentIndex(0);
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
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
      
      const provider = job?.voiceProvider || 'gemini';
      const apiKey = provider === 'openai_tts' ? localStorage.getItem('openai_api_key') : localStorage.getItem('gemini_api_key');

      // GỌI API TTS THẬT
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.text,
          platform: provider.includes('openai') ? 'openai' : 'gemini',
          apiKey
        })
      });

      if (!res.ok) {
        throw new Error('TTS API failed');
      }
      
      const data = await res.json();
      if (!data.audioBase64) throw new Error('No audio returned');

      // Chuyển base64 thành Blob URL cho Audio
      const isPcm = provider === 'gemini';
      let audioUrl = '';
      if (isPcm) {
        const binaryStr = atob(data.audioBase64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
        
        const wavBuffer = new ArrayBuffer(44 + bytes.length);
        const view = new DataView(wavBuffer);
        const writeString = (offset, string) => { for(let i=0; i<string.length; i++) view.setUint8(offset+i, string.charCodeAt(i)); };
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + bytes.length, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, 24000, true);
        view.setUint32(28, 24000 * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, bytes.length, true);
        new Uint8Array(wavBuffer, 44).set(bytes);
        
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
      } else {
        const blob = await fetch(`data:audio/mp3;base64,${data.audioBase64}`).then(r => r.blob());
        audioUrl = URL.createObjectURL(blob);
      }

      // --- GỌI API LIP-SYNC ĐỂ TẠO VIDEO NHÉP MIỆNG KHỚP AUDIO ---
      if (currentVideoUrl && onActionTriggered) {
        try {
          const lipSyncRes = await fetch('/api/lip-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: data.audioBase64,
              videoUrl: currentVideoUrl,
              platform: 'synclabs' // hoặc heygen
            })
          });
          const lipSyncData = await lipSyncRes.json();
          if (lipSyncData.success && lipSyncData.lipSyncVideoUrl) {
            // Gửi URL video đã nhép miệng lên UI chính để phát
            onActionTriggered({ type: 'LIPSYNC_READY', videoUrl: lipSyncData.lipSyncVideoUrl });
          }
        } catch (e) {
          console.warn('LipSync API Error (falling back to audio only):', e);
        }
      }

      audioRef.current.src = audioUrl;
      
      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (onActionTriggered) onActionTriggered({ type: 'LIPSYNC_ENDED' });
        if (isPlaying) {
          setCurrentIndex(prev => prev + 1);
        }
      };

      await audioRef.current.play();

    } catch (err) {
      console.error('Audio play error, falling back to Web Speech:', err);
      // Fallback nếu API lỗi hoặc thiếu Key
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'vi-VN';
      utterance.onend = () => {
        if (isPlaying) setCurrentIndex(prev => prev + 1);
      };
      speechSynthesis.speak(utterance);
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    enqueueItem: (text, action) => {
      // Dừng phát hiện tại nếu là sự kiện khẩn cấp (vd: gift) hoặc chỉ đơn giản thêm vào hàng đợi
      const newItem = { type: 'dynamic', text, action };
      setQueue(prev => {
        const next = [...prev];
        next.splice(currentIndex + 1, 0, newItem); // Chèn vào ngay sau câu hiện tại
        return next;
      });
      setIsPlaying(true);
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
