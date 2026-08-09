import React, { useState } from 'react';
import { PlayCircle, Radio, Send, Gift, Youtube, Music2, Facebook, Wifi, WifiOff, Loader2, UserRound } from 'lucide-react';

const QUICK_TESTS = [
  { label: 'TEST HEY', text: 'hey', color: 'from-pink-500 to-purple-500' },
  { label: 'TEST HAY', text: 'hay', color: 'from-blue-500 to-cyan-500' },
  { label: 'TEST DANCE', text: 'dance', color: 'from-fuchsia-500 to-pink-500' },
  { label: 'TEST FIRE', text: 'fire', color: 'from-orange-500 to-red-600' },
  { label: 'TEST RAIN', text: 'rain', color: 'from-slate-500 to-blue-600' },
  { label: 'TEST VIP', text: 'vip', color: 'from-amber-400 to-yellow-600' },
];

const GIFT_TESTS = [
  { label: 'Quà Cơ Bản', points: 20 },
  { label: 'Quà Bạc', points: 150 },
  { label: 'Quà Vàng', points: 800 },
  { label: 'Quà Kim Cương', points: 3000 },
];

const PLATFORM_ICON = { tiktok: Music2, youtube: Youtube, facebook: Facebook };

// Bảng điều khiển: kết nối nền tảng (tái sử dụng channels đã kết nối ở Restream Đa Nền Tảng),
// Test Panel bấm 1-chạm không cần LIVE thật, và cầu nối YouTube Live Chat API thật (REST công khai, gọi được từ trình duyệt).
export default function DanceFloorTestPanel({
  connectedChannels,
  selectedChannelIds,
  onToggleChannel,
  simulationEnabled,
  onToggleSimulation,
  onManualTrigger,
  onManualGift,
  ytBridge,
  onYtConnect,
  onYtDisconnect,
  characters,
}) {
  const [customText, setCustomText] = useState('');
  const [ytApiKey, setYtApiKey] = useState('');
  const [ytChatId, setYtChatId] = useState('');
  const [callCharacterId, setCallCharacterId] = useState(characters[0]?.id || '');

  const handleCallCharacter = () => {
    const character = characters.find((c) => c.id === callCharacterId);
    if (!character) return;
    onManualTrigger(character.callNames?.[0] || character.name);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onManualTrigger(customText.trim());
    setCustomText('');
  };

  const handleYtSubmit = (e) => {
    e.preventDefault();
    if (!ytApiKey.trim() || !ytChatId.trim()) {
      alert('Vui lòng nhập đủ YouTube API Key và Live Chat ID!');
      return;
    }
    onYtConnect(ytApiKey.trim(), ytChatId.trim());
  };

  return (
    <div className="space-y-5">
      {/* Kết nối nền tảng — đồng bộ từ Restream Đa Nền Tảng */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#EF4444]" /> Nguồn Kênh Live (Đồng Bộ Restream Đa Nền Tảng)
        </h4>
        {connectedChannels.length === 0 ? (
          <p className="text-xs text-gray-500">
            Chưa có kênh nào được kết nối. Vào tab "Restream Đa Nền Tảng" để kết nối TikTok / YouTube / Facebook trước.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {connectedChannels.map((ch) => {
              const platformKey = ch.id.startsWith('tiktok') ? 'tiktok' : ch.id.startsWith('youtube') ? 'youtube' : ch.id.startsWith('facebook') ? 'facebook' : null;
              const Icon = PLATFORM_ICON[platformKey] || Radio;
              const isSelected = selectedChannelIds.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => onToggleChannel(ch.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected ? 'bg-emerald-500/15 border-emerald-500/40' : 'bg-black/30 border-white/10 opacity-60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gray-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white truncate">{ch.name}</p>
                    <span className={`text-[9px] font-bold ${ch.status === 'connected' ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {ch.status === 'connected' ? '● Đã Kết Nối' : '○ Chưa Kết Nối'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chế độ mô phỏng thời gian thực */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-white">Chế Độ Mô Phỏng Bình Luận Realtime</h4>
          <p className="text-[10px] text-gray-500 max-w-md">
            TikTok/Facebook chưa có API bình luận công khai chính thức cho bên thứ ba, nên hệ thống chạy ở chế độ mô phỏng đầy đủ pipeline (Ingestion → Rule Engine → Sàn Diễn) trên các kênh đã chọn ở trên. Riêng YouTube có thể kết nối dữ liệu thật bên dưới.
          </p>
        </div>
        <button
          onClick={onToggleSimulation}
          className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 cursor-pointer transition-all ${
            simulationEnabled ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'
          }`}
        >
          {simulationEnabled ? '● ĐANG CHẠY MÔ PHỎNG' : 'BẬT MÔ PHỎNG'}
        </button>
      </div>

      {/* Cầu nối YouTube Live Chat API thật */}
      <div className="glass-panel p-4 rounded-2xl border border-red-500/20">
        <h4 className="text-sm font-black text-white mb-1 flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" /> Kết Nối YouTube Live Chat Thật (YouTube Data API v3)
        </h4>
        <p className="text-[10px] text-gray-500 mb-3">
          Nhập API Key (Google Cloud Console) và Live Chat ID của buổi live YouTube đang chạy để lấy bình luận thật, đưa thẳng vào Rule Engine.
        </p>
        {ytBridge.connected ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-xs font-black text-emerald-400 flex items-center gap-2">
              <Wifi className="w-4 h-4" /> Đã kết nối Live Chat ID: {ytBridge.liveChatId}
            </span>
            <button onClick={onYtDisconnect} className="text-[10px] font-black text-red-400 hover:text-red-300 cursor-pointer">
              NGẮT KẾT NỐI
            </button>
          </div>
        ) : (
          <form onSubmit={handleYtSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <input
              value={ytApiKey}
              onChange={(e) => setYtApiKey(e.target.value)}
              placeholder="YouTube API Key"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
            <input
              value={ytChatId}
              onChange={(e) => setYtChatId(e.target.value)}
              placeholder="Live Chat ID"
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
            />
            <button type="submit" className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-1.5">
              {ytBridge.connecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
              KẾT NỐI THẬT
            </button>
          </form>
        )}
        {ytBridge.lastError && <p className="text-[10px] text-red-400 mt-2">⚠️ {ytBridge.lastError}</p>}
      </div>

      {/* Gọi tên nhân vật trực tiếp */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
          <UserRound className="w-4 h-4 text-pink-400" /> Gọi Tên Nhân Vật Lên Sàn
        </h4>
        <p className="text-[10px] text-gray-500 mb-2">Viewer chỉ cần gõ đúng tên/biệt danh nhân vật trong comment là triệu hồi được, không cần chờ luật từ khoá.</p>
        <div className="flex gap-2">
          <select
            value={callCharacterId}
            onChange={(e) => setCallCharacterId(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
          >
            {characters.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
          <button
            onClick={handleCallCharacter}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <UserRound className="w-3.5 h-3.5" /> Gọi Ngay
          </button>
        </div>
      </div>

      {/* Test Panel 1-chạm */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10">
        <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-[#8B5CF6]" /> Test Panel — Chạy Thử Không Cần LIVE Thật
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
          {QUICK_TESTS.map((t) => (
            <button
              key={t.text}
              onClick={() => onManualTrigger(t.text)}
              className={`py-2.5 rounded-xl bg-gradient-to-r ${t.color} text-white text-xs font-black shadow-lg hover:opacity-90 transition-all cursor-pointer`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {GIFT_TESTS.map((g) => (
            <button
              key={g.label}
              onClick={() => onManualGift(g.points)}
              className="py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-pink-400" /> {g.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Gõ bình luận thử bất kỳ..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-bold outline-none"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
