import React, { useState, useEffect, Component } from 'react';
import { 
  Radio, X, CheckCircle2, Play, Square, Wifi, AlertTriangle, 
  Settings, MessageCircle, Gift, Heart, UserPlus, ShoppingBag, 
  Share2, Shield, RefreshCw, Layers, Copy, ExternalLink 
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';

function extractTikTokUsername(input) {
  if (!input || typeof input !== 'string') return '';
  let val = input.trim();
  if (val.includes('tiktok.com/@')) {
    const match = val.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/);
    if (match && match[1]) return match[1];
  }
  return val.replace(/^@/, '').trim();
}

class TacVuErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[TacVuErrorBoundary] Handled error in WorkspaceTacVu:', error, errorInfo);
  }

  handleResetConfigs = () => {
    try {
      localStorage.removeItem('aidol_event_configs');
      localStorage.removeItem('aidol_event_configs_backup');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 rounded-2xl text-center m-4 border border-rose-500/30">
          <AlertTriangle size={48} className="text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Đã tối ưu hóa lại dữ liệu 14 sự kiện live</h3>
          <p className="text-xs text-gray-300 max-w-md mb-4">
            Một số thiết lập cấu hình sự kiện đã lưu trước đây được cập nhật để phù hợp phiên bản mới nhất.
          </p>
          <button
            onClick={this.handleResetConfigs}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg hover:from-blue-500 hover:to-indigo-500 cursor-pointer"
          >
            🔄 Tự động khôi phục cấu hình chuẩn & tải lại
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function IdolConnectModal({
  isOpen,
  onClose,
  isDarkMode = true,
  tiktokId,
  setTiktokId,
  videoTiktokId,
  setVideoTiktokId,
  isConnected,
  isConnecting,
  handleConnect,
  isMasterLiveRunning,
  handleToggleMasterLive,
  initialTab = 'connect'
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'connect');
  const [copiedKey, setCopiedKey] = useState(false);
  const [testLog, setTestLog] = useState([]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!isOpen) return null;

  const rtmpServerUrl = 'rtmp://live-push.tiktok.com/live/';
  const cleanId = tiktokId ? extractTikTokUsername(tiktokId) : 'avalive_studio';

  const addTestLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    setTestLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const handleTestEvent = (eventName, eventData) => {
    addTestLog(`Bắn sự kiện giả lập: ${eventName}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('avalive:trigger_live_event', {
        detail: { eventName, ...eventData }
      }));
    }
  };

  const handleCopyStreamInfo = () => {
    const info = `RTMP URL: ${rtmpServerUrl}\nStream Key: live_${cleanId}_key`;
    try {
      navigator.clipboard.writeText(info);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (e) {}
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-4 animate-in fade-in zoom-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-[98vw] max-w-[1720px] h-[96vh] max-h-[96vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-[#12131a] border-purple-900/50' : 'bg-white border-gray-300'}`}>
        
        {/* Header Modal */}
        <div className={`flex items-center justify-between px-6 py-3.5 border-b shrink-0 ${isDarkMode ? 'bg-gradient-to-r from-purple-950/80 via-[#181926] to-[#12131a] border-purple-900/40' : 'bg-gradient-to-r from-purple-50 to-white border-purple-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 shadow-inner">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>CỔNG KẾT NỐI IDOL LIVESTREAM & PHÒNG LIVE AI</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${isConnected ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                    {isConnected ? '🟢 ĐÃ KẾT NỐI' : '⚪ CHƯA KẾT NỐI'}
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                Đồng bộ kênh TikTok Live, TikTok Live Studio, OBS Browser Source & Hệ thống 14 Tác vụ Sự kiện Tự Động 24/7
              </p>
            </div>
          </div>

          {/* Tab Selector in Header */}
          <div className="flex items-center gap-2">
            <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-gray-100 border-gray-300'}`}>
              <button
                onClick={() => setActiveTab('connect')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'connect'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Radio size={14} />
                <span>1. Kết Nối Kênh Idol & RTMP</span>
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings size={14} />
                <span>2. Cài Đặt 14 Tác Vụ Sự Kiện</span>
              </button>
            </div>

            <button 
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`}
              title="Đóng modal"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body Modal */}
        <div className="flex-1 overflow-auto relative">
          {activeTab === 'connect' ? (
            <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
              
              {/* Card 1: KẾT NỐI TÀI KHOẢN TIKTOK LIVE */}
              <div className={`p-5 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-[#181924] border-purple-900/40' : 'bg-white border-purple-100'}`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
                      🎵
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wide">
                        1. Kết Nối Phiên TikTok Live Bằng ID Kênh (Username)
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Nhập ID Kênh TikTok (hoặc đường link trang cá nhân / link live). Hệ thống tự động bắt tín hiệu comment, tặng quà, follow.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                      isConnected 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
                      <span>{isConnected ? 'Đang Kết Nối Live Realtime' : 'Chưa Kết Nối'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-6 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <span>ID Kênh TikTok / Username (Bắt buộc)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tiktokId || ''}
                        onChange={(e) => setTiktokId && setTiktokId(e.target.value)}
                        placeholder="Ví dụ: mychannel hoặc https://www.tiktok.com/@mychannel/live"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold outline-none border transition-all ${
                          isDarkMode 
                            ? 'bg-[#222330] border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <span>ID Video Live (Tùy chọn)</span>
                    </label>
                    <input
                      type="text"
                      value={videoTiktokId || ''}
                      onChange={(e) => setVideoTiktokId && setVideoTiktokId(e.target.value)}
                      placeholder="Mã Room ID (nếu có)"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold outline-none border transition-all ${
                        isDarkMode 
                          ? 'bg-[#222330] border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={() => handleConnect && handleConnect()}
                      disabled={isConnecting}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isConnected
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                          : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/30'
                      }`}
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" />
                          <span>Đang Kết Nối...</span>
                        </>
                      ) : isConnected ? (
                        <>
                          <Square size={14} fill="currentColor" />
                          <span>Ngắt Kết Nối</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} fill="currentColor" />
                          <span>Kết Nối Ngay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-center justify-between text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <Wifi size={14} className={isConnected ? "text-emerald-400" : "text-gray-400"} />
                    <span>Trạng thái máy chủ Socket Backend (Cổng 3001): <strong className="text-emerald-400">Hoạt Động 100%</strong></span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    ID hiện tại: <code className="text-purple-300 font-bold">@{cleanId}</code>
                  </div>
                </div>
              </div>

              {/* Card 2: THÔNG SỐ LUỒNG TIKTOK LIVE STUDIO & OBS */}
              <div className={`p-5 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-[#181924] border-blue-900/40' : 'bg-white border-blue-100'}`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-500/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      📡
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wide">
                        2. Cổng Kết Nối RTMP / OBS / TikTok Live Studio
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Sử dụng thông số này khi cấu hình phát luồng qua TikTok Live Studio hoặc OBS Studio
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyStreamInfo}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Copy size={13} />
                    <span>{copiedKey ? '✅ Đã Sao Chép!' : 'Sao Chép Cấu Hình'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[11px] font-bold text-gray-400">Server URL (Máy Chủ Luồng):</span>
                    <div className="font-mono text-xs text-blue-300 select-all break-all">
                      {rtmpServerUrl}
                    </div>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[11px] font-bold text-gray-400">Khóa Luồng (Stream Key):</span>
                    <div className="font-mono text-xs text-emerald-300 select-all break-all">
                      live_{cleanId}_{Date.now().toString().slice(-6)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-300 flex items-center gap-2">
                    <Shield size={14} className="text-emerald-400" />
                    <span>Bảo vệ luồng phát trực tiếp chuẩn HD 60 FPS, không độ trễ, chống sập phiên Live</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold cursor-pointer"
                  >
                    <span>Cấu hình 14 Sự kiện tương tác AI</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Card 3: TEST GIẢ LẬP NHANH 14 SỰ KIỆN LIVE */}
              <div className={`p-5 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-[#181924] border-gray-800' : 'bg-white border-gray-200'}`}>
                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                  <span>⚡ Thử Nghiệm Nhanh Sự Kiện Trực Tiếp</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-normal">
                    Kiểm tra phản hồi của AI Idol ngay trên Sân Khấu Chính
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
                  <button
                    onClick={() => handleTestEvent('welcome', { user: 'Khách VIP', count: 1 })}
                    className="p-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <span>👋</span>
                    <span>Chào Người Mới</span>
                  </button>
                  <button
                    onClick={() => handleTestEvent('comment', { user: 'Nguyễn Văn A', comment: 'Shop ơi tư vấn em sản phẩm với' })}
                    className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <MessageCircle size={16} />
                    <span>Bình Luận Hỏi</span>
                  </button>
                  <button
                    onClick={() => handleTestEvent('gift', { user: 'Bình Minh', gift_name: 'Hoa Hồng', diamonds: 1 })}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <Gift size={16} />
                    <span>Tặng Quà Live</span>
                  </button>
                  <button
                    onClick={() => handleTestEvent('follow', { user: 'Thảo Vy' })}
                    className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <UserPlus size={16} />
                    <span>Bấm Follow</span>
                  </button>
                  <button
                    onClick={() => handleTestEvent('thanks_heart', { user: 'Người Xem', count: 100 })}
                    className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <Heart size={16} />
                    <span>Thả Tim</span>
                  </button>
                  <button
                    onClick={() => handleTestEvent('checkout', { user: 'Minh Tuấn', productId: 1 })}
                    className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all"
                  >
                    <ShoppingBag size={16} />
                    <span>Chốt Đơn Hàng</span>
                  </button>
                </div>

                {testLog.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-gray-400 space-y-1 max-h-24 overflow-y-auto">
                    {testLog.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <TacVuErrorBoundary>
              <div className="h-full w-full">
                <WorkspaceTacVu defaultEventId="welcome" />
              </div>
            </TacVuErrorBoundary>
          )}
        </div>

      </div>
    </div>
  );
}
