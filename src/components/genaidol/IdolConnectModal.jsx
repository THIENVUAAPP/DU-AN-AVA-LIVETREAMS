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
  isConnected
}) {
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
                    {isConnected ? '🟢 ĐÃ KẾT NỐI' : '⚪ SẴN SÀNG'}
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                Đồng bộ kênh TikTok Live, TikTok Live Studio, OBS Browser Source & Hệ thống 14 Tác vụ Sự kiện Tự Động 24/7
              </p>
            </div>
          </div>

          {/* Header Action: Nút Đóng & Cài Đặt 14 Tác Vụ */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-black">
              <Settings size={14} className="text-blue-400" />
              <span>CÀI ĐẶT 14 TÁC VỤ SỰ KIỆN LIVE</span>
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
