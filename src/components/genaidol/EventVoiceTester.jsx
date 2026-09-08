import React, { useState, useEffect } from 'react';
import { Volume2, Play, Square, Sparkles, ChevronDown, Check } from 'lucide-react';
import { ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio } from '../../utils/voiceSyncService';

/**
 * Universal Voice Selector & Tester Component
 * Cho phép người dùng chọn BẤT KỲ giọng đọc nào (Idol, Trợ lý, BLV, ElevenLabs Pro, System Voice)
 * và nghe thử âm thanh trực tiếp từng kịch bản cài sẵn trong tất cả các tab phản hồi sự kiện.
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

  useEffect(() => {
    if (defaultVoiceId) {
      setSelectedVoiceId(defaultVoiceId);
    }
  }, [defaultVoiceId]);

  const handleVoiceSelect = (voiceId) => {
    setSelectedVoiceId(voiceId);
    if (onVoiceChange) {
      onVoiceChange(voiceId);
    }
  };

  const handleTogglePlay = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isPlaying) {
      stopVoiceAudio();
      setIsPlaying(false);
      return;
    }

    if (!text || !text.trim()) {
      alert('Chưa có nội dung câu thoại hoặc kịch bản để nghe thử. Vui lòng nhập nội dung trước!');
      return;
    }

    // Chuẩn hóa biến đại diện {user}, [user], {gift_name}, {count} thành dữ liệu mẫu nghe thử sinh động
    const rawText = (text && text.trim()) ? text : 'Dạ em chào bạn nha! Chúc bạn xem livestream thật vui vẻ!';
    const cleanedText = rawText
      .replace(/\[user\]|\{user\}/gi, 'Quốc Thiện')
      .replace(/\{comment\}|\[comment\]/gi, 'Sản phẩm này giá bao nhiêu shop?')
      .replace(/\{gift_name\}|\[gift_name\]/gi, 'Cờ Tổ Quốc')
      .replace(/\{count\}|\[count\]/gi, '5')
      .replace(/\{milestone\}|\[milestone\]/gi, '10,000')
      .replace(/\{item\}|\[item\]/gi, 'Phần mềm AvaLive Pro')
      .replace(/\{product\}|\[product\]/gi, 'AvaLive Pro')
      .trim();

    // Đọc TOÀN BỘ kịch bản (nối các câu lại liền mạch tự nhiên để giọng đọc AI phát trọn vẹn từ đầu đến cuối)
    const sentences = cleanedText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const fullSpeechText = sentences.length > 0 ? sentences.join('. ') : cleanedText;

    const voiceObj = ALL_SYSTEM_VOICES.find(v => v.id === selectedVoiceId) || 
      (selectedVoiceId === 'idol' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'idol') :
       selectedVoiceId === 'game' ? ALL_SYSTEM_VOICES.find(v => v.recommendedFor === 'game') :
       ALL_SYSTEM_VOICES.find(v => v.id === 'free_vi_female'));

    setIsPlaying(true);
    previewVoiceAudio(
      voiceObj || { id: 'free_vi_female', lang: 'vi-VN', provider: 'system', gender: 'Female' },
      fullSpeechText,
      {
        priority: true,
        isTest: true,
        onEnd: () => {
          setIsPlaying(false);
        }
      }
    );
  };

  const isDark = theme === 'dark';

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
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
          <optgroup label="🇻🇳 Giọng Đọc Tiếng Việt">
            <option value="free_vi_female">🎤 Hoài My (Nữ - Chuẩn Tiếng Việt)</option>
            <option value="free_vi_female2">💬 Mai Miền Nam (Nữ - Ngọt Ngào)</option>
            <option value="free_vi_male">🎮 Nam Minh (Nam - Hào Sảng BLV)</option>
          </optgroup>
          <optgroup label="💎 Giọng Đọc ElevenLabs Pro">
            <option value="el_rachel">💎 Rachel (Nữ - Ngọt ngào Idol)</option>
            <option value="el_bella">💎 Bella (Nữ - Nhẹ nhàng)</option>
            <option value="el_domi">💎 Domi (Nữ - Năng động)</option>
            <option value="el_josh">💎 Josh (Nam - BLV Game Năng Lượng)</option>
            <option value="el_clyde">💎 Clyde (Nam - Chiến Binh)</option>
            <option value="el_adam">💎 Adam (Nam - Điềm Tĩnh Bán Hàng)</option>
            <option value="el_callum">💎 Callum (Nam - Quản Lý Giục Đơn)</option>
          </optgroup>
          <optgroup label="🌍 Giọng Quốc Tế">
            <option value="el_us_female">Sarah 🇺🇸 (US English)</option>
            <option value="el_uk_male">Arthur 🇬🇧 (UK English)</option>
            <option value="el_cn_female">Mei-Ling 🇨🇳 (中文)</option>
            <option value="el_jp_female">Sakura 🇯🇵 (日本語 Anime)</option>
            <option value="el_kr_female">Min-ji 🇰🇷 (한국어 K-Pop)</option>
            <option value="el_th_female">Premwadee 🇹🇭 (ภาษาไทย)</option>
          </optgroup>
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
          title={isPlaying ? 'Dừng phát âm thanh' : 'Nghe thử câu thoại này với giọng đã chọn'}
        >
          {isPlaying ? <Square size={11} className="fill-current" /> : <Volume2 size={12} />}
          <span>{isPlaying ? 'DỪNG' : 'NGHE THỬ'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2.5 transition-all ${
      isDark 
        ? 'bg-[#161a24] border-white/10 text-white shadow-sm' 
        : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border-blue-200 text-gray-800 shadow-2xs'
    } ${className}`}>
      
      {/* Label & Description */}
      <div className="flex items-center gap-2 min-w-0">
        <span className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
          <Volume2 size={14} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-bold truncate flex items-center gap-1.5">
            <span>{label}</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-600 text-[10px] rounded-full font-bold animate-pulse border border-emerald-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang phát voice...
              </span>
            )}
          </div>
          <div className={`text-[10.5px] truncate max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Bấm "Nghe Thử" để kiểm tra âm thanh trực tiếp kịch bản với bất kỳ giọng đọc AI nào.
          </div>
        </div>
      </div>

      {/* Voice Dropdown Selector & Play Button */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Chọn giọng:
          </span>
          <select
            value={selectedVoiceId}
            onChange={(e) => handleVoiceSelect(e.target.value)}
            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 ${
              isDark 
                ? 'bg-[#1e2230] text-amber-300 border-white/10 hover:border-amber-500/50' 
                : 'bg-white text-gray-800 border-gray-300 hover:border-purple-400 shadow-xs'
            }`}
          >
            <optgroup label="🇻🇳 Giọng Đọc Tiếng Việt">
              <option value="free_vi_female">🎤 Hoài My (Nữ - Chuẩn Tiếng Việt)</option>
              <option value="free_vi_female2">💬 Mai Miền Nam (Nữ - Ngọt Ngào)</option>
              <option value="free_vi_male">🎮 Nam Minh (Nam - Hào Sảng BLV)</option>
            </optgroup>
            <optgroup label="💎 Giọng Đọc ElevenLabs Pro">
              <option value="el_rachel">💎 Rachel (Nữ - Ngọt ngào Idol)</option>
              <option value="el_bella">💎 Bella (Nữ - Nhẹ nhàng)</option>
              <option value="el_domi">💎 Domi (Nữ - Năng động)</option>
              <option value="el_josh">💎 Josh (Nam - BLV Game Năng Lượng)</option>
              <option value="el_clyde">💎 Clyde (Nam - Chiến Binh)</option>
              <option value="el_adam">💎 Adam (Nam - Điềm Tĩnh Bán Hàng)</option>
              <option value="el_callum">💎 Callum (Nam - Quản Lý Giục Đơn)</option>
            </optgroup>
            <optgroup label="🌍 Giọng Quốc Tế">
              <option value="el_us_female">Sarah 🇺🇸 (US English)</option>
              <option value="el_uk_male">Arthur 🇬🇧 (UK English)</option>
              <option value="el_cn_female">Mei-Ling 🇨🇳 (中文)</option>
              <option value="el_jp_female">Sakura 🇯🇵 (日本語 Anime)</option>
              <option value="el_kr_female">Min-ji 🇰🇷 (한국어 K-Pop)</option>
              <option value="el_th_female">Premwadee 🇹🇭 (ภาษาไทย)</option>
            </optgroup>
          </select>
        </div>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
            isPlaying
              ? 'bg-purple-600 text-white animate-pulse shadow-lg ring-2 ring-purple-400'
              : isDark
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md'
          }`}
          title={isPlaying ? 'Dừng phát âm thanh' : 'Nghe thử câu thoại này với giọng đã chọn'}
        >
          {isPlaying ? <Square size={13} className="fill-current" /> : <Play size={13} className="fill-current" />}
          <span>{isPlaying ? 'DỪNG LẠI' : 'NGHE THỬ VOICE'}</span>
        </button>
      </div>

    </div>
  );
}
