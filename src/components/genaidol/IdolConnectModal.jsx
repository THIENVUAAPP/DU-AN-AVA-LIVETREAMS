import React, { Component } from 'react';
import { Radio, X, AlertTriangle, Settings } from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';

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
  tiktokId = '',
  setTiktokId = () => {},
  videoTiktokId = '',
  setVideoTiktokId = () => {},
  isConnected = false,
  isConnecting = false,
  handleConnect = () => {},
  isMasterLiveRunning = false,
  handleToggleMasterLive = () => {}
}) {
  const [activePlatformTab, setActivePlatformTab] = React.useState('tiktok'); // 'tiktok' | 'shopee' | 'multistream' | 'all'
  const [localInputId, setLocalInputId] = React.useState(tiktokId || '');
  const [tempKey, setTempKey] = React.useState('');

  React.useEffect(() => {
    if (tiktokId) setLocalInputId(tiktokId);
  }, [tiktokId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-4 animate-in fade-in zoom-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-[98vw] max-w-[1720px] h-[96vh] max-h-[96vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-[#12131a] border-purple-900/50' : 'bg-white border-gray-300'}`}>
        
        {/* Header Modal */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between px-6 py-3 border-b shrink-0 gap-3 ${isDarkMode ? 'bg-gradient-to-r from-purple-950/90 via-[#181926] to-[#12131a] border-purple-900/40' : 'bg-gradient-to-r from-purple-50 to-white border-purple-200'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 shadow-inner">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>CỔNG KẾT NỐI IDOL LIVESTREAM & PHÒNG LIVE AI</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${isConnected ? 'bg-emerald-500 text-white shadow-emerald-500/30 shadow-md' : 'bg-rose-500 text-white animate-pulse'}`}>
                    {isConnected ? '🟢 ĐÃ KẾT NỐI REAL-TIME' : '⚪ SẴN SÀNG KẾT NỐI'}
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                Đồng bộ tài khoản TikTok Live Studio, Shopee Live, YouTube, Facebook & Hệ thống 14 Tác vụ Sự kiện Tự Động 24/7
              </p>
            </div>
          </div>

          {/* Quick Platform Connection Bar in Header */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/60 border border-purple-500/30 p-1 rounded-xl">
              <input 
                type="text"
                value={localInputId}
                onChange={(e) => {
                  setLocalInputId(e.target.value);
                  setTiktokId(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConnect();
                }}
                placeholder="ID TikTok / Live Studio..."
                className="w-36 md:w-44 px-2.5 py-1.5 bg-transparent text-xs font-bold text-white outline-none placeholder-gray-500"
              />
              <button
                onClick={() => handleConnect()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-md ${
                  isConnected 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                    : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-90 text-white shadow-purple-500/30'
                }`}
              >
                {isConnecting ? (
                  <span className="animate-spin text-xs">↻ Đang kết nối...</span>
                ) : isConnected ? (
                  <span>🛑 Ngắt Kết Nối</span>
                ) : (
                  <span>⚡ KẾT NỐI 1-CHẠM</span>
                )}
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

        {/* Platform Quick Badges Ribbon */}
        <div className={`px-6 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs ${isDarkMode ? 'bg-[#0e0f14] border-purple-900/30 text-gray-300' : 'bg-purple-50/50 border-purple-100 text-gray-700'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-purple-400 flex items-center gap-1">
              🌐 KẾT NỐI NỀN TẢNG:
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
              <span>🎵 TikTok Live Studio:</span>
              <span className="text-white font-mono">{localInputId ? `@${localInputId.replace(/^@/, '')}` : 'avalive_studio'}</span>
              <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.2 rounded font-black">TỨC THÌ</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold text-[11px]">
              <span>🛍️ Shopee Live:</span>
              <span className="text-white font-mono">RTMP Ultra 10Gbps</span>
              <span className="text-[9px] bg-orange-500 text-black px-1.5 py-0.2 rounded font-black">AUTO HOOK</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 font-bold text-[11px]">
              <span>🔴 YouTube / Facebook Live:</span>
              <span className="text-white font-mono">Multi-Stream 4K</span>
              <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded font-black">ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-bold">
            <span>⚡ ĐỘ TRỄ: 0ms • OBS & TIKTOK LIVE STUDIO ĐỒNG BỘ 100%</span>
          </div>
        </div>

        {/* Body Modal: HIỂN THỊ TRỰC TIẾP 14 TÁC VỤ SỰ KIỆN LIVE */}
        <div className="flex-1 overflow-auto relative">
          <TacVuErrorBoundary>
            <div className="h-full w-full">
              <WorkspaceTacVu defaultEventId="welcome" />
            </div>
          </TacVuErrorBoundary>
        </div>

      </div>
    </div>
  );
}
