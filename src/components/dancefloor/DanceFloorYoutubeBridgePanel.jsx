import React, { useState } from 'react';
import { Youtube, Wifi, Loader2 } from 'lucide-react';

// Cầu nối YouTube Live Chat API thật — chỉ dùng khi thực sự phát trên YouTube, đặt ở khu ít dùng hơn.
export default function DanceFloorYoutubeBridgePanel({ ytBridge, onYtConnect, onYtDisconnect }) {
  const [ytApiKey, setYtApiKey] = useState('');
  const [ytChatId, setYtChatId] = useState('');

  const handleYtSubmit = (e) => {
    e.preventDefault();
    if (!ytApiKey.trim() || !ytChatId.trim()) {
      alert('Vui lòng nhập đủ YouTube API Key và Live Chat ID!');
      return;
    }
    onYtConnect(ytApiKey.trim(), ytChatId.trim());
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-red-500/20">
      <h4 className="text-sm font-black text-white mb-1 flex items-center gap-2">
        <Youtube className="w-4 h-4 text-red-500" /> Kết Nối YouTube Live Chat Thật
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
  );
}
