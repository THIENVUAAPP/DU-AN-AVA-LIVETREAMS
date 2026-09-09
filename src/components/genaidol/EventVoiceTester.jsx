import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles, ChevronDown, Check, Gauge, Sliders } from 'lucide-react';
import { ALL_SYSTEM_VOICES, FREE_VOICES, ELEVENLABS_VOICES, previewVoiceAudio, stopVoiceAudio, updateActiveVoiceAudio, cleanTextForVoiceSpeech } from '../../utils/voiceSyncService';

/**
 * Universal Voice Selector & Tester Component
 * - Tích hợp đầy đủ: Chọn giọng, Tăng/Giảm Âm lượng, Tăng/Giảm Tốc độ đọc (Speed Rate)
 * - Tương tác siêu tốc: Kéo âm lượng hoặc chọn tốc độ là ăn ngay tức thời (0ms lag)
 * - Tự động lọc sạch 100% các tag cử chỉ [Vỗ tay], [Cười tươi], [Chỉ giỏ hàng], chỉ đọc nội dung chính
 * - Phát ĐẦY ĐỦ 100% toàn bộ kịch bản từ câu đầu đến câu cuối (tuần tự từng câu với tiến trình hiển thị rõ ràng)
 * - Nút Dừng lại ngắt tức thì toàn bộ chuỗi phát âm thanh.
 */
export default function EventVoiceTester({
  text = '',
  defaultVoiceId = 'free_vi_female',
  onVoiceChange = null,
  label = 'Nghe thử câu thoại',
  theme = 'light', // 'light' | 'dark'
  compact = false,
  className = ''
}) {
  const [selectedVoiceId, setSelectedVoiceId] = useState(defaultVoiceId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [speed, setSpeed] = useState(1.0); // 0.75 to 1.5

  const isPlayingRef = useRef(false);
  const queueTimeoutRef = useRef(null);
  const volumeRef = useRef(1.0);
  const speedRef = useRef(1.0);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (defaultVoiceId) {
      setSelectedVoiceId(defaultVoiceId);
    }
  }, [defaultVoiceId]);

  // Cập nhật âm lượng tức thì khi kéo thanh trượt (0ms phản hồi)
  const handleVolumeChange = (newVol) => {
    const val = parseFloat(newVol);
    setVolume(val);
    volumeRef.current = val;
    updateActiveVoiceAudio({ volume: val });
  };

  // Cập nhật tốc độ đọc tức thì khi chọn dropdown (0ms phản hồi)
  const handleSpeedChange = (newSpeed) => {
    const rate = Number(newSpeed);
    setSpeed(rate);
    speedRef.current = rate;
    updateActiveVoiceAudio({ rate });
  };

  // Dọn dẹp khi unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
      stopVoiceAudio();
    };
  }, []);

  const handleVoiceSelect = (voiceId) => {
    setSelectedVoiceId(voiceId);
    if (onVoiceChange) {
      onVoiceChange(voiceId);
    }
  };

  /**
   * Phân tách kịch bản dài thành các câu thoại hoàn chỉnh chuẩn ngữ nghĩa
   * Tự động loại bỏ hoàn toàn các chỉ dẫn sân khấu [Vỗ tay], [Cười tươi], [Chỉ giỏ hàng]...
   */
  const splitIntoSentences = (raw) => {
    if (!raw || !raw.trim()) return [];
    
    // Làm sạch thẻ cử chỉ & chuẩn hóa biến đại diện
    const cleanedText = cleanTextForVoiceSpeech(raw)
      .replace(/\[user\]|\{user\}/gi, 'Quốc Thiện')
      .replace(/\{comment\}|\[comment\]/gi, 'Sản phẩm này giá bao nhiêu shop?')
      .replace(/\{gift_name\}|\[gift_name\]/gi, 'Cờ Tổ Quốc')
      .replace(/\{count\}|\[count\]/gi, '5')
      .replace(/\{milestone\}|\[milestone\]/gi, '10,000')
      .replace(/\{item\}|\[item\]/gi, 'Bộ Đôi Serum Tế Bào Gốc')
      .replace(/\{product\}|\[product\]/gi, 'Bộ Đôi Serum Tế Bào Gốc')
      .trim();

    // Tách theo dòng hoặc dấu chấm/chấm than/chấm hỏi
    const lines = cleanedText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const result = [];

    for (const line of lines) {
      // Nếu dòng quá dài (> 120 ký tự), tiếp tục tách nhỏ theo dấu câu . ! ? ; để đọc biểu cảm
      if (line.length > 120) {
        const subParts = line.split(/(?<=[.!?;\n])\s+/).map(p => p.trim()).filter(Boolean);
        if (subParts.length > 1) {
          result.push(...subParts);
          continue;
        }
      }
      result.push(line);
    }

    return result.length > 0 ? result : [cleanedText];
  };

  const handleStop = () => {
    isPlayingRef.current = false;
    if (queueTimeoutRef.current) {
      clearTimeout(queueTimeoutRef.current);
      queueTimeoutRef.current = null;
    }
    stopVoiceAudio();
    setIsPlaying(false);
    setCurrentSentenceIdx(0);
  };

  const handleTogglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isPlaying) {
      handleStop();
      return;
    }

    if (!text || !text.trim()) {
      alert('Chưa có nội dung câu thoại hoặc kịch bản để nghe thử. Vui lòng nhập nội dung trước!');
      return;
    }

    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) return;

    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === selectedVoiceId) || 
      (selectedVoiceId === 'idol' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'idol') :
       selectedVoiceId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game') :
       ALL_SYSTEM_VOICES.find(v => v.id === 'free_vi_female')) || { id: 'free_vi_female', lang: 'vi-VN', provider: 'system', gender: 'Female' };

    isPlayingRef.current = true;
    setIsPlaying(true);
    setTotalSentences(sentences.length);
    setCurrentSentenceIdx(0);

    // Bắt đầu chuỗi phát tuần tự từng câu cho đến hết toàn bộ kịch bản
    const playSentenceAtIndex = (index) => {
      if (!isPlayingRef.current) return;

      if (index >= sentences.length) {
        // Đã hoàn tất phát toàn bộ kịch bản
        handleStop();
        return;
      }

      setCurrentSentenceIdx(index);
      const sentenceText = sentences[index];

      previewVoiceAudio(
        voiceObj,
        sentenceText,
        {
          priority: true,
          isTest: true,
          volume: volumeRef.current,
          rate: speedRef.current,
          onEnd: () => {
            if (!isPlayingRef.current) return;
            // Nghỉ ngắn giữa 2 câu (350ms) để nhịp thở tự nhiên
            queueTimeoutRef.current = setTimeout(() => {
              playSentenceAtIndex(index + 1);
            }, 350);
          }
        }
      );
    };

    playSentenceAtIndex(0);
  };

  const isDark = theme === 'dark';

  const femaleVnVoices = ALL_SYSTEM_VOICES.filter(v => (v.gender === 'Female' || v.gender === 'Nữ') && (v.region === 'vi' || v.lang === 'vi-VN' || v.id?.startsWith('vn_') || v.id === 'free_vi_female'));
  const maleVnVoices = ALL_SYSTEM_VOICES.filter(v => (v.gender === 'Male' || v.gender === 'Nam') && (v.region === 'vi' || v.lang === 'vi-VN' || v.id?.startsWith('vn_') || v.id === 'el_adam'));
  const intlVoices = ALL_SYSTEM_VOICES.filter(v => v.region !== 'vi' && v.lang !== 'vi-VN' && !v.id?.startsWith('vn_') && v.id !== 'free_vi_female' && v.id !== 'el_adam');

  const renderVoiceOptions = () => (
    <>
      <optgroup label="🇻🇳 Giọng Nữ Việt Nam (21 Giọng)">
        {femaleVnVoices.map(v => (
          <option key={v.id} value={v.id}>♀ {v.name.replace(/ 💎| 🇻🇳/g, '')}</option>
        ))}
      </optgroup>
      <optgroup label="🇻🇳 Giọng Nam Việt Nam (20 Giọng)">
        {maleVnVoices.map(v => (
          <option key={v.id} value={v.id}>♂ {v.name.replace(/ 💎| 🇻🇳/g, '')}</option>
        ))}
      </optgroup>
      <optgroup label="🌐 Giọng Đọc Quốc Tế (28 Giọng)">
        {intlVoices.map(v => (
          <option key={v.id} value={v.id}>{v.name.replace(/ 💎| ⚡/g, '')}</option>
        ))}
      </optgroup>
    </>
  );

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
        {/* Voice Selector */}
        <select
          value={selectedVoiceId}
          onChange={(e) => handleVoiceSelect(e.target.value)}
          className={`text-[11px] font-bold rounded-lg px-2 py-1 border transition-all cursor-pointer focus:outline-none ${
            isDark 
              ? 'bg-[#1e2230] text-amber-300 border-white/10 hover:border-amber-500/50' 
              : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 shadow-2xs'
          }`}
          title="Chọn giọng đọc để nghe thử"
        >
          {renderVoiceOptions()}
        </select>

        {/* Speed Selector */}
        <select
          value={speed}
          onChange={(e) => handleSpeedChange(e.target.value)}
          className={`text-[11px] font-bold rounded-lg px-1.5 py-1 border transition-all cursor-pointer focus:outline-none ${
            isDark ? 'bg-[#1e2230] text-blue-300 border-white/10' : 'bg-white text-blue-700 border-gray-300'
          }`}
          title="Tốc độ đọc của AI"
        >
          <option value="0.75">⚡ 0.75x (Chậm)</option>
          <option value="0.9">⚡ 0.9x (Vừa)</option>
          <option value="1.0">⚡ 1.0x (Chuẩn)</option>
          <option value="1.1">⚡ 1.1x (Nhanh nhẹ)</option>
          <option value="1.25">⚡ 1.25x (Nhanh)</option>
          <option value="1.5">⚡ 1.5x (Rất nhanh)</option>
        </select>

        {/* Play/Stop Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
            isPlaying
              ? 'bg-purple-600 text-white animate-pulse shadow-md ring-2 ring-purple-400'
              : isDark
                ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40'
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300'
          }`}
          title={isPlaying ? 'Dừng phát âm thanh' : 'Nghe thử toàn bộ câu thoại này'}
        >
          {isPlaying ? <Square size={11} className="fill-current" /> : <Volume2 size={12} />}
          <span>{isPlaying ? `DỪNG (${currentSentenceIdx + 1}/${totalSentences || 1})` : 'NGHE THỬ'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-all ${
      isDark 
        ? 'bg-[#161a24] border-white/10 text-white shadow-sm' 
        : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 border-blue-200 text-gray-800 shadow-2xs'
    } ${className}`}>
      
      {/* Label & Progress Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
          <Volume2 size={16} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-black truncate flex items-center gap-2 flex-wrap">
            <span>{label}</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 text-emerald-700 text-[10.5px] rounded-full font-bold animate-pulse border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Đang đọc: <b>Câu {currentSentenceIdx + 1}/{totalSentences}</b></span>
              </span>
            )}
          </div>
          <div className={`text-[11px] truncate max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Đọc trọn vẹn 100% kịch bản từ câu đầu đến câu cuối với ngữ điệu và khẩu hình miệng AI chuẩn xác.
          </div>
        </div>
      </div>

      {/* Voice Dropdown + Speed Selector + Volume Slider + Play Button */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0 justify-start lg:justify-end">
        
        {/* 1. Chọn giọng */}
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Giọng:
          </span>
          <select
            value={selectedVoiceId}
            onChange={(e) => handleVoiceSelect(e.target.value)}
            className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 ${
              isDark 
                ? 'bg-[#1e2230] text-amber-300 border-white/10 hover:border-amber-500/50' 
                : 'bg-white text-gray-800 border-gray-300 hover:border-purple-400 shadow-xs'
            }`}
          >
            {renderVoiceOptions()}
          </select>
        </div>

        {/* 2. Tốc độ đọc (Speed Rate) */}
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-gray-300 shadow-2xs">
          <Gauge size={13} className="text-blue-600 shrink-0" />
          <select
            value={speed}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className="text-xs font-bold bg-transparent text-blue-900 focus:outline-none cursor-pointer"
            title="Tốc độ đọc của AI (Rate)"
          >
            <option value="0.75">0.75x</option>
            <option value="0.9">0.9x</option>
            <option value="1.0">1.0x (Chuẩn)</option>
            <option value="1.1">1.1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>

        {/* 3. Âm lượng (Volume Slider: 0% - 100%) */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-300 shadow-2xs">
          {volume === 0 ? <VolumeX size={13} className="text-gray-400 shrink-0" /> : <Volume2 size={13} className="text-purple-600 shrink-0" />}
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(e.target.value)}
            className="w-16 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title={`Âm lượng giọng đọc: ${Math.round(volume * 100)}%`}
          />
          <span className="text-[10px] font-bold text-gray-600 min-w-[28px] text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* 4. Nút Nghe Thử Voice / Dừng Lại */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
            isPlaying
              ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-2 ring-rose-400'
              : isDark
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md'
          }`}
          title={isPlaying ? 'Dừng phát âm thanh kịch bản' : 'Nghe thử toàn bộ kịch bản này với giọng đã chọn'}
        >
          {isPlaying ? <Square size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
          <span>{isPlaying ? `DỪNG LẠI (${currentSentenceIdx + 1}/${totalSentences || 1})` : 'NGHE THỬ VOICE'}</span>
        </button>
      </div>

    </div>
  );
}

