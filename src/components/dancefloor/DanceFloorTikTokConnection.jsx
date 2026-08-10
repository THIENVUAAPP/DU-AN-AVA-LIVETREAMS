import React, { useState, useEffect } from 'react';
import { Radio, Wifi, WifiOff, Users, Heart, Gift, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function DanceFloorTikTokConnection({ onEvent }) {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  
  // Stats for UI
  const [stats, setStats] = useState({ likes: 0, comments: 0, gifts: 0, members: 0 });

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('tiktok_connected', (data) => {
      setStatus('connected');
      setError(null);
      alert(`✅ Đã kết nối thành công tới phiên Live của: @${data.username}`);
    });

    newSocket.on('tiktok_disconnected', (msg) => {
      setStatus('disconnected');
    });

    newSocket.on('tiktok_error', (err) => {
      setStatus('disconnected');
      setError(err);
      alert(`❌ Lỗi kết nối TikTok Live: ${err}`);
    });

    newSocket.on('tiktok_chat', (data) => {
      setStats(s => ({ ...s, comments: s.comments + 1 }));
      if (onEvent) onEvent('chat', data);
    });

    newSocket.on('tiktok_gift', (data) => {
      setStats(s => ({ ...s, gifts: s.gifts + 1 }));
      if (onEvent) onEvent('gift', data);
    });

    newSocket.on('tiktok_like', (data) => {
      setStats(s => ({ ...s, likes: s.likes + data.likeCount }));
      if (onEvent) onEvent('like', data);
    });

    newSocket.on('tiktok_member', (data) => {
      setStats(s => ({ ...s, members: s.members + 1 }));
      if (onEvent) onEvent('member', data);
    });

    return () => newSocket.close();
  }, [onEvent]);

  const handleConnect = () => {
    if (!username.trim()) return;
    setStatus('connecting');
    setError(null);
    socket?.emit('connect_tiktok', username.trim());
  };

  const handleDisconnect = () => {
    socket?.emit('disconnect_tiktok');
  };

  return (
    <div className="bg-[#121218] border border-pink-500/30 rounded-2xl p-5 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-pink-500/20 text-pink-400 border border-pink-500/40'}`}>
          {status === 'connected' ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">Kết Nối TikTok Live (Auto)</h3>
          <p className="text-xs text-gray-400">Tự động bắt tim, quà, bình luận từ máy chủ thật</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Nhập TikTok Username (vd: thaygiao.tiktok)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={status !== 'disconnected'}
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-pink-500/50"
        />
        {status === 'connected' ? (
          <button onClick={handleDisconnect} className="bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-300 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer">
            Ngắt
          </button>
        ) : (
          <button onClick={handleConnect} disabled={status === 'connecting' || !username.trim()} className="bg-pink-600 hover:bg-pink-500 text-white font-bold px-5 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50">
            {status === 'connecting' ? 'Đang nối...' : 'Kết Nối'}
          </button>
        )}
      </div>

      {status === 'connected' && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-black/30 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
            <Heart className="w-4 h-4 text-pink-500 mb-1" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Thả Tim</span>
            <span className="text-sm font-black">{stats.likes}</span>
          </div>
          <div className="bg-black/30 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
            <MessageCircle className="w-4 h-4 text-blue-500 mb-1" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Bình Luận</span>
            <span className="text-sm font-black">{stats.comments}</span>
          </div>
          <div className="bg-black/30 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
            <Gift className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Tặng Quà</span>
            <span className="text-sm font-black">{stats.gifts}</span>
          </div>
          <div className="bg-black/30 rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
            <Users className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[10px] text-gray-400 uppercase font-bold">Vào Phòng</span>
            <span className="text-sm font-black">{stats.members}</span>
          </div>
        </div>
      )}
    </div>
  );
}
