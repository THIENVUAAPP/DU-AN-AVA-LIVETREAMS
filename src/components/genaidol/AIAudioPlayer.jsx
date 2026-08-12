import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Settings, Mic, Volume2 } from 'lucide-react';

export default function AIAudioPlayer({ isLive, onAudioPlayStateChange }) {
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
      
      // GIẢ LẬP GỌI API TTS (Text to Speech)
      // Trong thực tế sẽ fetch tới /api/tts?text=...&voice=...
      // Ở đây ta dùng SpeechSynthesis (Giọng đọc trình duyệt) để giả lập ngay lập tức cho anh Thùy test
      
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      
      utterance.onend = () => {
        if (isPlaying) {
          setCurrentIndex(prev => prev + 1);
        }
      };
      
      speechSynthesis.speak(utterance);
      
    } catch (err) {
      console.error("Lỗi phát audio:", err);
      setCurrentIndex(prev => prev + 1);
    }
  };

  // 3. Hàm Bắn Sự Kiện (Bình luận, Quà) -> Chen ngang kịch bản
  const handleSimulateEvent = (type) => {
    let text = "";
    if (type === 'gift') text = "Cảm ơn bạn đã tặng quà nhé! Trân trọng cảm ơn.";
    if (type === 'comment') text = "Xin chào bạn mới vào phòng live, có câu hỏi gì cứ bình luận nhé!";
    
    // Tạm dừng phát hiện tại
    speechSynthesis.cancel();
    
    // Chèn vào đầu hàng đợi chưa phát
    const newQueue = [...queue];
    newQueue.splice(currentIndex, 0, { type: 'event', text });
    setQueue(newQueue);
    
    setIsPlaying(true);
  };

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

      <div className="mt-3 grid grid-cols-2 gap-2">
         <button onClick={() => handleSimulateEvent('gift')} className="py-1.5 bg-pink-500/20 text-pink-500 border border-pink-500/30 rounded text-[10px] font-bold hover:bg-pink-500/30">Giả lập: Nhận quà</button>
         <button onClick={() => handleSimulateEvent('comment')} className="py-1.5 bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded text-[10px] font-bold hover:bg-blue-500/30">Giả lập: Có Comment</button>
      </div>
    </div>
  );
}
