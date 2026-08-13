import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Eye, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Maximize, Minus, Download, Plus
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';

export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); // 'general' | 'workspace' | 'payment' | null
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAiPaused, setIsAiPaused] = useState(false);
  const [isCommMode, setIsCommMode] = useState(false);
  const [tiktokId, setTiktokId] = useState('');
  const [volume, setVolume] = useState(80);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('aidol_lan_huong');
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  
  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const CHARACTERS = {
    'aidol_lan_huong': 'https://images.unsplash.com/photo-1627885408985-618d2ff36c64?q=80&w=600&auto=format&fit=crop',
    'aidol_ngoc_trinh': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop'
  };

  const handleConnect = async () => {
    if (isConnected) {
      setIsConnected(false);
      return;
    }
    
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionError('');
    }, 1500);
  };

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
      } catch (err) {
        alert("Không thể truy cập Webcam: " + err.message);
      }
    }
  };

  useEffect(() => {
    // Re-attach video stream if ref changes but stream exists (e.g. re-render)
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamActive]);

  useEffect(() => {
    // Cleanup webcam on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleDownload = () => {
    alert("Bắt đầu tải bộ cài đặt phần mềm Livestream AI (ZIP)...");
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* 1. Fake Window Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-[#1c1c23]' : 'bg-gray-300'} select-none z-30`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
            <Video size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium">Livestream AI (Clone) - Profile: NhanVatB</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Minus size={16} className="cursor-pointer hover:text-white" />
          <Maximize size={14} className="cursor-pointer hover:text-white" />
          <X size={18} className="cursor-pointer hover:text-red-500" />
        </div>
      </div>

      {/* 2. Top Control Bar (Moved to top based on user request) */}
      <div className={`flex flex-col gap-2 p-3 ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} z-20 shadow-sm`}>
        
        {/* Row 1 */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            
            {/* Cài đặt Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              >
                <Settings size={16} />
                Cài đặt ▼
              </button>
              
              {/* Dropdown Menu */}
              {isSettingsDropdownOpen && (
                <div className={`absolute top-full left-0 mt-1 w-64 rounded-md shadow-xl border z-30 py-1 ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button 
                    onClick={() => { setActiveSettingsModal('general'); setIsSettingsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-600/20 text-gray-200' : 'hover:bg-blue-50 text-gray-700'}`}
                  >
                    Cấu hình Chung (AI, Giọng nói...)
                  </button>
                  <button 
                    onClick={() => { setActiveSettingsModal('workspace'); setIsSettingsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDarkMode ? 'hover:bg-blue-600/20 text-gray-200' : 'hover:bg-blue-50 text-gray-700'}`}
                  >
                    Quản lý Sự kiện Video
                  </button>
                </div>
              )}
            </div>

            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#00d2ff]/20 text-[#00d2ff] hover:bg-[#00d2ff]/30' : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'}`}>
              <Eye size={16} />
              Theo dõi ▼
            </button>

            <button onClick={() => setActiveSettingsModal('payment')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
              <CreditCard size={16} />
              Thanh toán
            </button>

            <button 
              onClick={toggleWebcam}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isWebcamActive ? 'bg-pink-600 text-white hover:bg-pink-500' : isDarkMode ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
            >
              <Video size={16} />
              Tun Studio {isWebcamActive ? '(Đang bật)' : ''}
            </button>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              Giao diện tối
            </button>

            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              <MessageCircle size={16} />
              Hỗ trợ (Zalo)
            </button>

          </div>

          <div className="flex items-center gap-4">
             {/* Xóa số Coin và Xóa nút Webcam con theo yêu cầu */}
            <div className="flex items-center gap-2">
              <button className={`p-1.5 rounded transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}><Settings size={16} /></button>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center text-sm font-medium text-gray-400">
            TikTok:
          </div>
          <input 
            type="text" 
            value={tiktokId}
            onChange={(e) => setTiktokId(e.target.value)}
            className={`w-48 px-3 py-1.5 rounded text-sm outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
            placeholder="Nhập ID TikTok..."
          />
          
          <button 
            onClick={handleConnect}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors ${isConnected ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {isConnecting ? <span className="animate-spin text-lg leading-none">↻</span> : <Play size={16} fill="currentColor" />}
            {isConnecting ? 'Đang kết nối...' : (isConnected ? 'Ngắt kết nối' : 'Kết nối')}
          </button>

          <button 
            onClick={() => setIsAiPaused(!isAiPaused)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors ${isAiPaused ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'}`}
          >
            <Pause size={16} fill={isAiPaused ? "currentColor" : "none"} />
            Tạm dừng AI
          </button>

          <button 
            onClick={() => setIsCommMode(!isCommMode)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors ${isCommMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
          >
            {isCommMode ? <Mic size={16} /> : <MicOff size={16} />}
            Bật Chế độ Giao tiếp
          </button>

          {/* Character Selector */}
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm font-medium text-gray-400">Chọn Nhân vật:</span>
            <div className="flex gap-2">
              <img 
                src={CHARACTERS['aidol_lan_huong']}
                className={`w-8 h-8 rounded object-cover cursor-pointer ${selectedCharacter === 'aidol_lan_huong' ? 'border-2 border-blue-500' : 'border border-gray-600 opacity-50 hover:opacity-100'}`} 
                onClick={() => setSelectedCharacter('aidol_lan_huong')}
                title="aidol_lan_huong" 
                alt="aidol_lan_huong" 
              />
              <img 
                src={CHARACTERS['aidol_ngoc_trinh']} 
                className={`w-8 h-8 rounded object-cover cursor-pointer ${selectedCharacter === 'aidol_ngoc_trinh' ? 'border-2 border-blue-500' : 'border border-gray-600 opacity-50 hover:opacity-100'}`} 
                onClick={() => setSelectedCharacter('aidol_ngoc_trinh')}
                title="aidol_ngoc_trinh" 
                alt="aidol_ngoc_trinh" 
              />
              <button 
                className="w-8 h-8 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50" 
                title="Tải lên nhân vật mới..."
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'video/*,image/*';
                  input.click();
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-3 mr-2">
            <span className="text-sm font-medium text-gray-400">Âm lượng:</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-24 h-1.5 rounded-full appearance-none bg-gray-600 outline-none"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${volume}%, ${isDarkMode ? '#4b5563' : '#d1d5db'} ${volume}%)`
              }}
            />
          </div>
        </div>

        {/* Connection Status Text */}
        <div className="mt-1">
          {connectionError ? (
            <span className="text-xs font-semibold text-red-500">Lỗi kết nối: {connectionError}</span>
          ) : (
            <span className={`text-xs font-semibold ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
              Trạng thái: {isConnected ? `Đã kết nối (${tiktokId || 'Đang chờ'})` : 'Đã ngắt kết nối'}
            </span>
          )}
        </div>

      </div>

      {/* 3. Main Video Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-[#0f0f13]' : 'bg-white'}`}>
        
        {/* Nền hiển thị Avatar Nhân vật (Thay cho nền màu xanh) */}
        {selectedCharacter && CHARACTERS[selectedCharacter] ? (
          <img 
            src={CHARACTERS[selectedCharacter]} 
            className="w-full h-full object-cover opacity-90"
            alt="Character Stream Background" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
             <span className="text-gray-500 font-medium text-lg">Vui lòng chọn nhân vật</span>
          </div>
        )}
        
        {/* Lớp phủ phụ thêm (Ví dụ tên nhân vật hiển thị nhỏ ở dưới) */}
        <div className="absolute bottom-6 left-6 flex flex-col pointer-events-none">
          <h2 className="text-4xl font-bold text-white mb-1 drop-shadow-lg">AIDOL</h2>
          <p className="text-white drop-shadow-md font-medium px-2 py-1 bg-black/40 rounded inline-block backdrop-blur-sm">
             {selectedCharacter} - Sẵn sàng Livestream
          </p>
        </div>

        {/* Cửa sổ nổi hiển thị Webcam từ Tun Studio */}
        {isWebcamActive && (
          <div className="absolute top-4 left-4 w-64 aspect-video rounded-xl overflow-hidden shadow-2xl border-[3px] border-green-500 bg-black z-30 group cursor-move">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur">
              Trực tiếp (Tun Studio)
            </div>
            <button 
              onClick={toggleWebcam} 
              className="absolute top-2 left-2 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Floating Download Button (For User Experience) */}
        <button 
          onClick={handleDownload}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-colors z-10"
        >
          <Download size={18} />
          <span>Tải phần mềm (ZIP)</span>
        </button>
      </div>

      {/* General Settings Modal */}
      {activeSettingsModal === 'general' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
          <div className={`w-[900px] h-[700px] flex flex-col rounded-lg overflow-hidden shadow-2xl border bg-[#f0f2f5] border-gray-300`}>
            <div className={`flex items-center justify-between px-4 py-2 border-b bg-gray-200 border-gray-300`}>
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Settings size={14} className="text-gray-600" />
                Cấu hình AI, Giọng nói & API
              </h2>
              <button 
                onClick={() => setActiveSettingsModal(null)}
                className="hover:bg-gray-300 p-1 rounded transition-colors text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 relative">
              <GeneralSettings onClose={() => setActiveSettingsModal(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (WorkspaceTacVu / Event Manager) */}
      {activeSettingsModal === 'workspace' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className={`w-full max-w-6xl h-[95vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border ${isDarkMode ? 'bg-[#141419] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="text-blue-500" />
                Cài đặt Hệ thống Sự kiện Livestream
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => alert("Đang kiểm tra bản cập nhật từ Admin...")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium"
                >
                  Kiểm tra cập nhật
                </button>
                <button 
                  onClick={() => setActiveSettingsModal(null)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">
              <WorkspaceTacVu />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {activeSettingsModal === 'payment' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl bg-white relative">
            <button 
              onClick={() => setActiveSettingsModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex-1 overflow-y-auto">
              <ThanhToanCoin />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
