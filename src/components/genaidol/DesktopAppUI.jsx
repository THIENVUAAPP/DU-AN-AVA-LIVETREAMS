import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';

export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommMode, setIsCommMode] = useState(false);
  const [tiktokId, setTiktokId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('aidol_lan_huong');
  
  const [customCharacters, setCustomCharacters] = useState([]);
  const fileInputRef = useRef(null);

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  
  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const CHARACTERS = {
    'aidol_lan_huong': { name: 'Lan Hương', url: 'https://images.unsplash.com/photo-1627885408985-618d2ff36c64?q=80&w=600&auto=format&fit=crop', type: 'image' },
    'aidol_ngoc_trinh': { name: 'Ngọc Trinh', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', type: 'image' }
  };
  customCharacters.forEach(c => {
    CHARACTERS[c.id] = { name: c.name, url: c.url, type: c.type };
  });

  const handleConnect = async () => {
    if (isConnected) {
      // Dừng AI & Ngắt kết nối
      setIsConnected(false);
      return;
    }
    
    setIsConnecting(true);
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
    if (isWebcamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isWebcamActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleDownload = () => {
    alert("Bắt đầu tải bộ cài đặt phần mềm Livestream AI (ZIP)...");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const charName = prompt("Nhập tên cho nhân vật (để dễ quản lý):");
      if (!charName) {
        // Hủy bỏ nếu người dùng không nhập tên
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const newChar = {
        id: `custom_${Date.now()}`,
        name: charName,
        url,
        type: isVideo ? 'video' : 'image'
      };
      setCustomCharacters(prev => [...prev, newChar]);
      setSelectedCharacter(newChar.id);
    }
    // clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCustomCharacter = (e, id) => {
    e.stopPropagation();
    setCustomCharacters(prev => prev.filter(c => c.id !== id));
    if (selectedCharacter === id) {
      setSelectedCharacter('aidol_lan_huong');
    }
  };

  const renderCharacterContent = () => {
    const selected = CHARACTERS[selectedCharacter];
    if (!selected) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
           <span className="text-gray-500 font-medium text-lg">Vui lòng chọn nhân vật</span>
        </div>
      );
    }

    if (selected.type === 'video') {
      return (
        <video 
          src={selected.url} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          loop 
          controls 
          playsInline 
        />
      );
    } else {
      return (
        <img 
          src={selected.url} 
          className="w-full h-full object-cover opacity-90"
          alt={selected.name} 
        />
      );
    }
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* 1. Fake Window Title Bar (Đã gộp nút Tải ZIP lên đây) */}
      <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-[#1c1c23]' : 'bg-gray-300'} select-none z-30`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
            <Video size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium">Livestream AI (Clone) - Profile: NhanVatB</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Nút Tải phần mềm (ZIP) đã được đưa lên góc này */}
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Tải phần mềm (ZIP)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Control Bar (Single Row) */}
      <div className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} z-20 shadow-sm overflow-x-auto whitespace-nowrap custom-scrollbar`}>
        
        <button onClick={() => setActiveSettingsModal('payment')} className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
          <CreditCard size={16} />
          Thanh toán
        </button>

        <button 
          onClick={toggleWebcam}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isWebcamActive ? 'bg-pink-600 text-white hover:bg-pink-500' : isDarkMode ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}
        >
          <Video size={16} />
          Tun Studio
        </button>

        {/* Connection Group (Đã gộp nút Tạm Dừng AI vào Kết nối) */}
        <div className="flex items-center gap-2 border-l border-r border-gray-500/30 px-2 shrink-0">
          <input 
            type="text" 
            value={tiktokId}
            onChange={(e) => setTiktokId(e.target.value)}
            className={`w-32 px-3 py-1.5 rounded text-sm outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`}
            placeholder="ID TikTok..."
          />
          <button 
            onClick={handleConnect}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
          >
            {isConnecting ? <span className="animate-spin text-lg leading-none">↻</span> : (isConnected ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />)}
            {isConnecting ? 'Đang xử lý...' : (isConnected ? 'Dừng AI' : 'Kết nối')}
          </button>
        </div>

        <button 
          onClick={() => setIsCommMode(!isCommMode)}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isCommMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
        >
          {isCommMode ? <Mic size={16} /> : <MicOff size={16} />}
          Giao tiếp
        </button>

        {/* Character Selector */}
        <div className="flex items-center gap-2 shrink-0 border-l border-gray-500/30 pl-3">
          <span className="text-sm font-medium text-gray-400">Nhân vật:</span>
          <div className="flex gap-2">
            {Object.keys(CHARACTERS).map((charId) => (
              <div 
                key={charId}
                onClick={() => setSelectedCharacter(charId)}
                className={`w-8 h-8 rounded overflow-hidden cursor-pointer flex-shrink-0 relative group ${selectedCharacter === charId ? 'border-2 border-blue-500' : 'border border-gray-600 opacity-50 hover:opacity-100'}`}
                title={CHARACTERS[charId].name}
              >
                {CHARACTERS[charId].type === 'video' ? (
                  <video src={CHARACTERS[charId].url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={CHARACTERS[charId].url} className="w-full h-full object-cover" alt={CHARACTERS[charId].name} />
                )}
                
                {charId.startsWith('custom_') && (
                  <button 
                    onClick={(e) => removeCustomCharacter(e, charId)}
                    className="absolute top-0 right-0 p-0.5 bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-bl"
                    title="Xóa nhân vật này"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            ))}
            
            <button 
              className="w-8 h-8 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50 shrink-0" 
              title="Tải lên nhân vật mới (Ảnh/Video)..."
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="video/*,image/*" 
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        {/* Right Aligned Items */}
        <div className="flex-1 min-w-[20px]"></div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`shrink-0 p-1.5 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
          title="Giao diện sáng/tối"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button 
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          title="Hỗ trợ Zalo"
        >
          <MessageCircle size={16} />
          Zalo
        </button>
        
        {/* Nút Cài đặt (Bánh răng nhỏ) thay thế cho nút Cài đặt bự đã bị gỡ */}
        <button 
          onClick={() => setActiveSettingsModal('workspace')} 
          className={`shrink-0 flex items-center gap-1.5 p-1.5 rounded transition-colors ${isDarkMode ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/40' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          title="Quản lý Sự kiện Video (Cài đặt chính)"
        >
          <Settings size={16} />
        </button>
        
        {/* Có thể giữ một bánh răng nhỏ thứ 2 cho Cài đặt chung nếu muốn, hoặc dùng 1 cái. */}
      </div>

      {/* 3. Main Video Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-[#0f0f13]' : 'bg-white'}`}>
        
        {renderCharacterContent()}
        
        {/* Lớp phủ phụ thêm */}
        <div className="absolute bottom-6 left-6 flex flex-col pointer-events-none z-10">
          <h2 className="text-4xl font-bold text-white mb-1 drop-shadow-lg">AIDOL</h2>
          <p className="text-white drop-shadow-md font-medium px-2 py-1 bg-black/40 rounded inline-block backdrop-blur-sm">
             {CHARACTERS[selectedCharacter]?.name || 'Không xác định'} - Sẵn sàng Livestream
          </p>
        </div>

        {/* Cửa sổ nổi hiển thị Webcam từ Tun Studio (Góc phải trên) */}
        {isWebcamActive && (
          <div className="absolute top-4 right-4 w-48 aspect-video rounded-lg overflow-hidden shadow-2xl border-[2px] border-green-500 bg-black z-30 group">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur">
              Tun Studio
            </div>
            <button 
              onClick={toggleWebcam} 
              className="absolute top-1 left-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        )}
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
