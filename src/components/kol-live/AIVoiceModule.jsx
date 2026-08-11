import React, { useState } from 'react';
import { Mic, Play, Settings2, SlidersHorizontal, Upload, Volume2, Globe, Sparkles, AudioLines, UserSquare2 } from 'lucide-react';

const MOCK_VOICES = [
  { id: 'v1', name: 'Ngọc Mai', lang: 'Tiếng Việt', gender: 'Nữ', type: 'Premium TTS', emotion: 'Vui vẻ' },
  { id: 'v2', name: 'Hoàng Nam', lang: 'Tiếng Việt', gender: 'Nam', type: 'Premium TTS', emotion: 'Trầm ấm' },
  { id: 'v3', name: 'Emma', lang: 'English (US)', gender: 'Nữ', type: 'Standard TTS', emotion: 'Năng động' },
  { id: 'v4', name: 'Thanh Trúc', lang: 'Tiếng Việt', gender: 'Nữ', type: 'Voice Clone (My Voice)', emotion: 'Tự nhiên' },
  { id: 'v5', name: 'Akira', lang: '日本語 (Nhật)', gender: 'Nam', type: 'Premium TTS', emotion: 'Lịch sự' },
];

export default function AIVoiceModule() {
  const [selectedVoice, setSelectedVoice] = useState('v1');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [emotion, setEmotion] = useState('neutral');

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              AI Voice Engine
            </h1>
            <p className="text-xs text-gray-400">Quản lý và tổng hợp giọng nói đa ngôn ngữ, Voice Clone, Cảm xúc</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left Column: Voice Library */}
        <div className="w-2/3 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Thư viện Giọng đọc</h2>
              <div className="flex gap-2">
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors">
                  <option>Tất cả ngôn ngữ</option>
                  <option>Tiếng Việt</option>
                  <option>English</option>
                </select>
                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors">
                  <option>Tất cả giới tính</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {MOCK_VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                    selectedVoice === voice.id 
                      ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  {selectedVoice === voice.id && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-white relative z-10">{voice.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full relative z-10 ${
                      voice.type.includes('Clone') ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>{voice.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 relative z-10">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {voice.lang}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><UserSquare2 className="w-3 h-3" /> {voice.gender}</span>
                  </div>
                  <div className="absolute right-3 bottom-3 p-1.5 rounded-full bg-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-blue-500 transition-all z-20">
                    <Play className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice Cloning Section */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/20 to-black relative overflow-hidden">
            <Sparkles className="absolute top-5 right-5 w-24 h-24 text-purple-500/10 pointer-events-none" />
            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><AudioLines className="w-5 h-5 text-purple-400" /> Voice Clone (Nhân bản giọng nói)</h2>
            <p className="text-xs text-gray-400 mb-4 max-w-md">Upload 1 file ghi âm khoảng 30s-1p của bạn để hệ thống AI học và nhân bản chính xác giọng nói của bạn dùng cho Livestream.</p>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Upload className="w-4 h-4" /> Tải lên File Ghi Âm (WAV/MP3)
            </button>
          </div>
        </div>

        {/* Right Column: Voice Settings */}
        <div className="w-1/3 flex flex-col gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><Settings2 className="w-5 h-5 text-pink-400" /> Tinh chỉnh Giọng (Realtime)</h2>
            
            <div className="space-y-6">
              {/* Emotion */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Trạng thái cảm xúc</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['neutral', 'happy', 'sad', 'angry'].map(emo => (
                    <button
                      key={emo}
                      onClick={() => setEmotion(emo)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                        emotion === emo ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {emo.charAt(0).toUpperCase() + emo.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Slider */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Tốc độ đọc (Speed)</span>
                  <span className="text-white">{speed.toFixed(1)}x</span>
                </label>
                <input 
                  type="range" min="0.5" max="2.0" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500"><span>Chậm</span><span>Bình thường</span><span>Nhanh</span></div>
              </div>

              {/* Pitch Slider */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
                  <span>Cao độ (Pitch)</span>
                  <span className="text-white">{pitch.toFixed(1)}</span>
                </label>
                <input 
                  type="range" min="0.5" max="1.5" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500"><span>Trầm</span><span>Chuẩn</span><span>Thanh</span></div>
              </div>
            </div>

            <hr className="border-white/5 my-6" />

            {/* Test TTS */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nghe thử Test TTS</label>
              <textarea 
                className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500 resize-none"
                placeholder="Nhập nội dung bất kỳ để nghe thử giọng đọc với cấu hình bên trên..."
                defaultValue="Xin chào các bạn, tôi là một trợ lý AI đọc kịch bản tự động cho Livestream."
              />
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <Volume2 className="w-4 h-4" /> Phát âm thanh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
