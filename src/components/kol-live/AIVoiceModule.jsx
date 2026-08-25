import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Play, Settings2, SlidersHorizontal, Upload, Volume2, Globe, 
  Sparkles, AudioLines, UserSquare2, Download, Copy, RefreshCw, 
  Flame, Heart, Music, Check, Zap, MessageSquare, Radio, Shield, Smile, Eye
} from 'lucide-react';
import { previewVoiceAudio, ALL_SYSTEM_VOICES } from '../../utils/voiceSyncService';

const EMOTION_STYLES = [
  { id: 'natural', name: 'Tự nhiên', icon: '🎭', desc: 'Tròn vành rõ chữ, chuẩn mực tự nhiên' },
  { id: 'excited', name: 'Hào hứng', icon: '✨', desc: 'Năng động, tươi vui, kích thích tương tác' },
  { id: 'warm', name: 'Ấm áp', icon: '💖', desc: 'Tâm sự, nhẹ nhàng, gần gũi' },
  { id: 'sad', name: 'U buồn', icon: '🥺', desc: 'Lắng đọng, cảm động, sâu sắc' },
  { id: 'dramatic', name: 'Kịch tính', icon: '🎬', desc: 'Hồi hộp, điểm nhấn mạnh mẽ' },
  { id: 'asmr', name: 'Thủ thỉ ASMR', icon: '🤫', desc: 'Thì thầm êm dịu, thư giãn' },
  { id: 'power', name: 'Quyền lực', icon: '👑', desc: 'Uy nghiêm, đĩnh đạc, bản lĩnh' },
  { id: 'historic', name: 'Cổ trang', icon: '📜', desc: 'Kiếm hiệp, hào hùng, trầm hùng' },
  { id: 'sweet', name: 'Ngọt ngào', icon: '🌸', desc: 'Dễ thương, nũng nịu, cuốn hút' },
  { id: 'narrator', name: 'Thuyết minh', icon: '🗣️', desc: 'Chuyên nghiệp, thời sự, phóng sự' },
  { id: 'angry', name: 'Tức giận', icon: '🔥', desc: 'Mạnh mẽ, bộc phát, dồn dập' },
  { id: 'fear', name: 'Sợ hãi', icon: '😨', desc: 'Run rẩy, giật gân, ma mị' },
  { id: 'humor', name: 'Hài hước', icon: '😂', desc: 'Vui nhộn, hóm hỉnh, bắt trend' },
  { id: 'heroic', name: 'Hào hùng', icon: '⚔️', desc: 'Sục sôi, khí thế xung trận' },
  { id: 'romantic', name: 'Lãng mạn', icon: '🌹', desc: 'Ngọt ngào, say đắm' },
  { id: 'choked', name: 'Nghẹn ngào', icon: '😢', desc: 'Xúc động trào dâng' },
];

const SAMPLE_SCRIPTS = [
  { label: 'Chào Mở Live', text: 'Chào mừng tất cả các bạn đã có mặt trong phiên livestream hôm nay! Mọi người bấm theo dõi kênh và thả tim liên tục giúp em nha!' },
  { label: 'Chốt Sale Ưu Đãi', text: 'Duy nhất trong phiên live hôm nay, sản phẩm đang có mã giảm giá 50k kèm quà tặng đặc biệt trong giỏ hàng góc trái màn hình, các bạn bấm đặt ngay kẻo hết suất nhé!' },
  { label: 'Cảm Ơn Quà Tặng', text: 'Ôi đỉnh quá! Em cảm ơn đại gia đã gửi tặng món quà vô cùng tuyệt vời cho phiên live! Yêu bạn nhiều lắm luôn!' },
  { label: 'Kêu Gọi Thả Tim', text: 'Mọi người ơi, chạm 2 lần liên tục vào màn hình để đẩy lượt thả tim lên 50.000 tim giúp em mở rương quà may mắn tiếp theo nào!' },
  { label: 'Hỏi Đáp & Tư Vấn', text: 'Các bạn có câu hỏi nào về sản phẩm hay cần em tư vấn chiều cao cân nặng để chọn size chuẩn nhất thì cứ bình luận bên dưới nhé!' }
];

const VOICE_PRESETS = [
  { id: 'el_adam', name: 'Adam (ElevenLabs Pro)', gender: 'male', pitch: 0.72, speed: 0.95, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'el_rachel', name: 'Rachel (ElevenLabs Pro)', gender: 'female', pitch: 1.05, speed: 1.00, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'el_antoni', name: 'Antoni (ElevenLabs Pro)', gender: 'male', pitch: 1.08, speed: 1.14, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'el_bella', name: 'Bella (ElevenLabs Pro)', gender: 'female', pitch: 1.28, speed: 0.92, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'el_elli', name: 'Elli (ElevenLabs Cảm Xúc)', gender: 'female', pitch: 1.00, speed: 1.00, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'el_josh', name: 'Josh (ElevenLabs Hùng Hồn)', gender: 'male', pitch: 0.90, speed: 1.05, tag: 'THIẾT KẾ', lang: 'Tiếng Việt / Đa ngữ' },
  { id: 'vi_ngocmai', name: 'Ngọc Mai (MiniMax AI Studio)', gender: 'female', pitch: 1.00, speed: 1.00, tag: 'PRO NEURAL', lang: 'Tiếng Việt' },
  { id: 'vi_hoangnam', name: 'Hoàng Nam (MiniMax MC Live)', gender: 'male', pitch: 0.95, speed: 1.00, tag: 'PRO NEURAL', lang: 'Tiếng Việt' }
];

export default function AIVoiceModule() {
  const [selectedVoiceId, setSelectedVoiceId] = useState('el_adam');
  const [searchVoice, setSearchVoice] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('natural');
  
  // 6 Thanh trượt cảm xúc & thông số (y hệt ảnh)
  const [emotionIntensity, setEmotionIntensity] = useState(80); // Cường độ cảm xúc
  const [stability, setStability] = useState(75); // Độ ổn định
  const [styleExaggeration, setStyleExaggeration] = useState(70); // Khuếch đại phong cách
  const [clarity, setClarity] = useState(80); // Độ rõ nét & Khắc họa
  const [warmth, setWarmth] = useState(80); // Độ trầm ấm & Hơi thở
  const [studioAcoustics, setStudioAcoustics] = useState('studio'); // Không gian phòng thu
  const [speed, setSpeed] = useState(0.95);
  const [pitch, setPitch] = useState(0.72);

  // Kịch bản thoại
  const [scriptText, setScriptText] = useState('Chào mừng tất cả các bạn đã đến với phiên Livestream hôm nay! Mọi người thả tim và bấm vào giỏ hàng góc trái màn hình để nhận ưu đãi đặc biệt nhé!');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const selectedVoice = VOICE_PRESETS.find(v => v.id === selectedVoiceId) || VOICE_PRESETS[0];

  const filteredVoices = VOICE_PRESETS.filter(v => 
    v.name.toLowerCase().includes(searchVoice.toLowerCase()) || 
    v.lang.toLowerCase().includes(searchVoice.toLowerCase())
  );

  const handleResetDefaults = () => {
    setSelectedEmotion('natural');
    setEmotionIntensity(80);
    setStability(75);
    setStyleExaggeration(70);
    setClarity(80);
    setWarmth(80);
    setStudioAcoustics('studio');
    setSpeed(selectedVoice.speed || 1.0);
    setPitch(selectedVoice.pitch || 1.0);
  };

  const handlePlayVoice = async () => {
    if (!scriptText || !scriptText.trim()) return;
    setIsPlaying(true);
    try {
      await previewVoiceAudio(selectedVoice.id, scriptText.trim());
    } catch (e) {
      console.warn('Lỗi phát giọng đọc:', e);
    } finally {
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const charCount = scriptText.length;
  const estimatedSeconds = Math.max(1, Math.round(wordCount / 2.8));

  return (
    <div className="flex flex-col h-full bg-[#0d0d12] text-white font-sans select-none">
      {/* Top Header */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-white/10 bg-[#12121a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-white">VoiceStudio</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">PRO NEURAL</span>
            </div>
            <p className="text-[11px] text-gray-400">Phòng thu âm thanh & Tùy biến giọng đọc AI đa sắc thái cảm xúc cho Livestream</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-all border border-white/10"
          >
            <RefreshCw size={12} />
            <span>Mặc định</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 overflow-hidden p-4 flex gap-4">
        
        {/* ========================================================= */}
        {/* CỘT 1 (BÊN TRÁI): DANH SÁCH GIỌNG NÓI & TÌM KIẾM */}
        {/* ========================================================= */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3 h-full">
          {/* Card Giọng Đang Dùng */}
          <div className="p-3.5 rounded-xl border border-pink-500/30 bg-[#161622] shadow-lg">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>GIỌNG ĐANG DÙNG</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black">{selectedVoice.tag}</span>
            </div>
            <div className="font-black text-sm text-white">{selectedVoice.name}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              {selectedVoice.gender}, pitch: {pitch.toFixed(2)}, speed: {speed.toFixed(2)}
            </div>
            <button className="w-full mt-2.5 py-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 rounded-lg transition-all border border-pink-500/20">
              + Giọng mới
            </button>
          </div>

          {/* Danh Sách Giọng Được Thiết Kế */}
          <div className="flex-1 rounded-xl border border-white/10 bg-[#161622] p-3 flex flex-col overflow-hidden">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">GIỌNG NÓI ĐƯỢC THIẾT KẾ</div>
            
            {/* Ô tìm kiếm */}
            <div className="relative mb-2">
              <input 
                type="text" 
                placeholder="🔍 Tìm kiếm..."
                value={searchVoice}
                onChange={(e) => setSearchVoice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-500 outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* List voice items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredVoices.map(v => {
                const isSelected = v.id === selectedVoiceId;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedVoiceId(v.id);
                      setPitch(v.pitch);
                      setSpeed(v.speed);
                    }}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-pink-500/15 border-pink-500/60 shadow-[0_0_12px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/40' 
                        : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white truncate">{v.name}</span>
                      <span className="text-[9px] font-black text-emerald-400 px-1 py-0.2 bg-emerald-500/10 rounded">
                        {v.tag}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between">
                      <span>{v.gender}, pitch: {v.pitch}, speed: {v.speed}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          previewVoiceAudio(v.id, "Xin chào bạn, tôi là giọng đọc AI chuyên nghiệp.");
                        }}
                        className="p-1 rounded bg-white/10 hover:bg-pink-600 text-white transition-all"
                        title="Nghe thử giọng này"
                      >
                        <Play size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CỘT 2 (Ở GIỮA): Ô NHẬP THOẠI KỊCH BẢN & PHÁT THỬ */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col gap-3 h-full overflow-hidden">
          <div className="flex-1 rounded-2xl border border-white/10 bg-[#161622] p-4 flex flex-col shadow-xl">
            {/* Header của Ô nhập kịch bản */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></div>
                <span className="font-bold text-sm text-white">Ô NHẬP THOẠI KỊCH BẢN LIVESTREAM</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
                  title="Sao chép kịch bản"
                >
                  {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
                <button 
                  onClick={() => setScriptText('')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-white/10"
                >
                  Xóa
                </button>
              </div>
            </div>

            {/* Các mẫu kịch bản nhanh 1-chạm */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
              <span className="text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">Mẫu nhanh:</span>
              {SAMPLE_SCRIPTS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setScriptText(s.text)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-gray-300 rounded-lg border border-white/5 hover:border-pink-500/30 whitespace-nowrap transition-all"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Textarea nhập kịch bản chính */}
            <div className="flex-1 relative">
              <textarea 
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Nhập nội dung kịch bản livestream, lời chào khán giả, câu chuyện, câu chốt sale hoặc câu trả lời bình luận vào đây..."
                className="w-full h-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/40 resize-none font-medium leading-relaxed custom-scrollbar"
              />
            </div>

            {/* Footer của ô nhập: Đếm từ & nút phát âm thanh */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/10">
              <div className="text-[11px] text-gray-400 flex items-center gap-3">
                <span>{charCount} ký tự</span>
                <span>•</span>
                <span>{wordCount} từ</span>
                <span>•</span>
                <span>Ước tính: ~{estimatedSeconds}s</span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePlayVoice}
                  disabled={isPlaying || !scriptText.trim()}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-xs transition-all shadow-lg active:scale-95 ${
                    isPlaying 
                      ? 'bg-pink-600 text-white animate-pulse' 
                      : 'bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-500/25'
                  }`}
                >
                  <Volume2 size={15} />
                  <span>{isPlaying ? 'Đang phát âm thanh...' : 'Phát Thử Giọng Nói'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CỘT 3 (BÊN PHẢI): CÁC Ô ĐIỀU CHỈNH GIỌNG NÓI & CẢM XÚC */}
        {/* ========================================================= */}
        <div className="w-96 flex-shrink-0 flex flex-col gap-3 h-full overflow-y-auto pr-1 custom-scrollbar">
          
          {/* Card Tùy Chỉnh Cảm Xúc & Thanh Âm Chuẩn ElevenLabs / MiniMax */}
          <div className="rounded-2xl border border-white/10 bg-[#161622] p-4 shadow-xl flex flex-col gap-4">
            
            {/* Header của Box Điều chỉnh */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                    <Flame size={15} />
                  </div>
                  <span className="font-bold text-xs text-white">Tùy Chỉnh Cảm Xúc & Thanh Âm</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[10px] font-black border border-pink-500/30">PRO NEURAL</span>
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">
                Đang chọn: <span className="text-pink-300 font-bold">
                  {EMOTION_STYLES.find(e => e.id === selectedEmotion)?.icon} {EMOTION_STYLES.find(e => e.id === selectedEmotion)?.name}
                </span> • Tròn vành rõ chữ, ngữ điệu tự nhiên chuẩn mực ElevenLabs & MiniMax
              </p>
            </div>

            {/* CHỌN PHONG CÁCH CẢM XÚC (10 SẮC THÁI CHUYÊN SÂU) */}
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={11} className="text-pink-400" />
                <span>CHỌN PHONG CÁCH CẢM XÚC</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {EMOTION_STYLES.map(emo => {
                  const isSelected = selectedEmotion === emo.id;
                  return (
                    <button
                      key={emo.id}
                      onClick={() => setSelectedEmotion(emo.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border text-left ${
                        isSelected 
                          ? 'bg-pink-500/20 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
                          : 'bg-black/30 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm">{emo.icon}</span>
                      <span className="truncate">{emo.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GRID CÁC THANH TRƯỢT THÔNG SỐ (6 Ô ĐIỀU CHỈNH CHUYÊN SÂU) */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              
              {/* 1. Cường độ cảm xúc */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <Flame size={12} className="text-pink-400" /> Cường độ cảm xúc
                  </span>
                  <span className="text-pink-400 font-black">{emotionIntensity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={emotionIntensity} 
                  onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                  className="w-full accent-pink-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Nhẹ nhàng</span>
                  <span>Mãnh liệt</span>
                </div>
              </div>

              {/* 2. Độ ổn định (Stability) */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <AudioLines size={12} className="text-blue-400" /> Độ ổn định (Stability)
                  </span>
                  <span className="text-blue-400 font-black">{stability}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={stability} 
                  onChange={(e) => setStability(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Biến hóa cảm xúc</span>
                  <span>Đều & Chuẩn mực</span>
                </div>
              </div>

              {/* 3. Khuếch đại phong cách */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <SlidersHorizontal size={12} className="text-amber-400" /> Khuếch đại phong cách
                  </span>
                  <span className="text-amber-400 font-black">{styleExaggeration}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={styleExaggeration} 
                  onChange={(e) => setStyleExaggeration(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Tự nhiên</span>
                  <span>Kịch tính hóa</span>
                </div>
              </div>

              {/* 4. Độ rõ nét & Khắc họa */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <Volume2 size={12} className="text-emerald-400" /> Độ rõ nét & Khắc họa
                  </span>
                  <span className="text-emerald-400 font-black">{clarity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={clarity} 
                  onChange={(e) => setClarity(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Mềm mại</span>
                  <span>Sắc nét chuẩn HD</span>
                </div>
              </div>

              {/* 5. Độ trầm ấm & Hơi thở */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <Mic size={12} className="text-purple-400" /> Độ trầm ấm & Hơi thở
                  </span>
                  <span className="text-purple-400 font-black">{warmth}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={warmth} 
                  onChange={(e) => setWarmth(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Thanh thoát</span>
                  <span>Trầm ấm truyền cảm</span>
                </div>
              </div>

              {/* 6. Không gian phòng thu */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold flex items-center gap-1">
                    <Music size={12} className="text-indigo-400" /> Không gian phòng thu
                  </span>
                  <span className="text-indigo-400 font-black uppercase text-[10px]">STUDIO</span>
                </div>
                <select 
                  value={studioAcoustics}
                  onChange={(e) => setStudioAcoustics(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-pink-500 cursor-pointer"
                >
                  <option value="studio">🎙️ Phòng thu chuyên nghiệp (Studio)</option>
                  <option value="stage">🏟️ Sân khấu biểu diễn lớn (Stage Reverb)</option>
                  <option value="room">🏠 Phòng kín cách âm (Dry Booth)</option>
                  <option value="livestream">📱 Không gian Livestream gần gũi</option>
                </select>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
