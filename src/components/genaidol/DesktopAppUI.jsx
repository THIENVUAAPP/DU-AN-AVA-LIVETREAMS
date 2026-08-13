import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';
import TokenHistoryModal from './TokenHistoryModal';
import { useToken, TOKEN_RATES } from './TokenContext';

export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); 
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommMode, setIsCommMode] = useState(false);
  const [tiktokId, setTiktokId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('aidol_lan_huong');
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [customCharacters, setCustomCharacters] = useState([]);
  const [hiddenBuiltins, setHiddenBuiltins] = useState([]);
  const fileInputRef = useRef(null);

  const { balance, deductToken, setNotifyCallback } = useToken();

  // Connection state (phải khai báo trước useEffect)
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Toast helper
  const showToast = (msg, type = 'warn') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Register low-balance callback
  useEffect(() => {
    setNotifyCallback(({ message }) => showToast(message, 'warn'));
  }, [setNotifyCallback]);

  // Auto-deduct tokens when live session is active
  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      deductToken(TOKEN_RATES.AI_PER_30S, 'AI Gemini (phiên live)');
    }, 30000);
    return () => clearInterval(timer);
  }, [isConnected, deductToken]);

  // Stop session when tokens run out
  useEffect(() => {
    if (isConnected && balance === 0) {
      setIsConnected(false);
      showToast('🔴 Hết token! Phiên live đã tự động dừng. Vui lòng nạp thêm token.', 'error');
    }
  }, [balance, isConnected]);

  // Connection state đã khai báo ở trên
  
  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Draggable Webcam State
  const [webcamPos, setWebcamPos] = useState({ x: 800, y: 80 });
  const [isDraggingWebcam, setIsDraggingWebcam] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial position based on window width to place it on the right side
    setWebcamPos({ x: window.innerWidth - 300, y: 80 });
  }, []);

  useEffect(() => {
    const handleDrag = (e) => {
      if (isDraggingWebcam) {
        setWebcamPos({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y
        });
      }
    };
    const handleDragEnd = () => setIsDraggingWebcam(false);
    
    if (isDraggingWebcam) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDraggingWebcam]);

  const handleDragStart = (e) => {
    // Prevent drag if clicking on the close button or resize handle
    if (e.target.closest('button') || e.target.closest('.resize-handle')) return;
    setIsDraggingWebcam(true);
    dragStartPos.current = {
      x: e.clientX - webcamPos.x,
      y: e.clientY - webcamPos.y
    };
  };

  const ALL_CHARACTERS = {
    'aidol_lan_huong': { name: 'Lan Hương', url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop', type: 'image' },
    'aidol_ngoc_trinh': { name: 'Ngọc Trinh', url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600&h=900&fit=crop', type: 'image' }
  };

  // Lọc bỏ các nhân vật đã bị ẩn và gộp nhân vật tuỳ chỉnh
  const CHARACTERS = {};
  Object.keys(ALL_CHARACTERS).forEach(id => {
    if (!hiddenBuiltins.includes(id)) CHARACTERS[id] = ALL_CHARACTERS[id];
  });
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
    const link = document.createElement('a');
    link.href = '/Livestream_AI_Software.zip';
    link.download = 'Livestream_AI_Software.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <span className="text-sm font-medium">Livestream AI (Clone) - Profile: {CHARACTERS[selectedCharacter]?.name || 'Không xác định'}</span>
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
      <div className={`flex items-center gap-3 p-3 ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} z-40 shadow-sm overflow-visible whitespace-nowrap`}>
        
        {/* Left Side: Settings & Payment */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Settings size={16} />
              Cài đặt ▼
            </button>
            
            {isSettingsDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button 
                  onClick={() => { setActiveSettingsModal('general'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 mb-2 rounded-lg text-sm font-bold transition-all flex items-center gap-3 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 hover:from-blue-600 hover:to-blue-500 text-blue-100 hover:text-white border border-blue-800/50 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600 text-blue-800 hover:text-white border border-blue-200 hover:border-blue-500 hover:shadow-lg'}`}
                >
                  <div className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-blue-900/50 text-blue-400 group-hover:text-white' : 'bg-white/80 text-blue-600'}`}>
                    <Brain size={20} />
                  </div>
                  BỘ NÃO AI
                </button>
                <button 
                  onClick={() => { setActiveSettingsModal('workspace'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-3 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/20 hover:from-purple-600 hover:to-purple-500 text-purple-100 hover:text-white border border-purple-800/50 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-500 hover:to-purple-600 text-purple-800 hover:text-white border border-purple-200 hover:border-purple-500 hover:shadow-lg'}`}
                >
                  <div className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-purple-900/50 text-purple-400 group-hover:text-white' : 'bg-white/80 text-purple-600'}`}>
                    <Radio size={20} />
                  </div>
                  KẾT NỐI IDOL
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setActiveSettingsModal('payment')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            <CreditCard size={16} />
            Thanh toán
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Middle: Controls */}
        <div className="flex items-center justify-center gap-3 shrink-0">
          
          <div className="flex items-center gap-2 border-r border-gray-500/30 pr-3">
            <span className="text-sm font-medium text-gray-400">Nhân vật:</span>
            <div className="flex gap-2">
              {Object.keys(CHARACTERS).map((charId) => (
                <div 
                  key={charId}
                  onClick={() => setSelectedCharacter(charId)}
                  className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group ${selectedCharacter === charId ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/30' : 'border border-gray-600 opacity-60 hover:opacity-100'}`}
                  title={CHARACTERS[charId].name}
                >
                  {CHARACTERS[charId].type === 'video' ? (
                    <video src={CHARACTERS[charId].url} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={CHARACTERS[charId].url} className="w-full h-full object-cover" alt={CHARACTERS[charId].name} />
                  )}
                  {/* Nút Xoá – hiển thị khi hover cho TẤT CẢ nhân vật */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (charId.startsWith('custom_')) {
                        removeCustomCharacter(e, charId);
                      } else {
                        // Xoá nhân vật mẫu bằng cách lọc ra khỏi danh sách
                        const allKeys = Object.keys(CHARACTERS);
                        const remaining = allKeys.filter(k => k !== charId);
                        if (remaining.length > 0) setSelectedCharacter(remaining[0]);
                        // Đánh dấu ẩn built-in char
                        setHiddenBuiltins(prev => [...(prev || []), charId]);
                      }
                    }}
                    className="absolute top-0 right-0 p-0.5 bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-bl"
                    title={`Xoá ${CHARACTERS[charId].name}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button className="w-8 h-8 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50 shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Plus size={16} />
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*,image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <button onClick={toggleWebcam} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isWebcamActive ? 'bg-pink-600 text-white hover:bg-pink-500' : isDarkMode ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
            <Video size={16} />
            Studio
          </button>

          <div className="flex items-center gap-2 px-2 shrink-0">
            <input type="text" value={tiktokId} onChange={(e) => setTiktokId(e.target.value)} className={`w-32 px-3 py-1.5 rounded text-sm outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`} placeholder="ID TikTok..." />
            <button onClick={handleConnect} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {isConnecting ? <span className="animate-spin text-lg leading-none">↻</span> : (isConnected ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />)}
              {isConnecting ? 'Đang xử lý...' : (isConnected ? 'Dừng AI' : 'Kết nối')}
            </button>
          </div>

          <button onClick={() => setIsCommMode(!isCommMode)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isCommMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`} title="Bật/Tắt Giao tiếp bằng Giọng nói 2 chiều với AI">
            {isCommMode ? <Mic size={16} /> : <MicOff size={16} />}
            Giao tiếp
          </button>

        </div>

        <div className="flex-1"></div>

        {/* Right Side: Toggles */}
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-1.5 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Token Widget */}
          <button
            onClick={() => setShowTokenHistory(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
              balance === 0
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                : balance < TOKEN_RATES.LOW_BALANCE_WARN
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Xem lịch sử Token"
          >
            {balance < TOKEN_RATES.LOW_BALANCE_WARN && <AlertTriangle size={13} />}
            <Coins size={14} />
            <span>{balance.toLocaleString()}</span>
          </button>

          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
            <MessageCircle size={16} />
            Zalo
          </button>
        </div>
        
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

        {/* Cửa sổ nổi hiển thị Webcam từ Studio (Draggable & Resizable) */}
        {isWebcamActive && (
          <div 
            className="absolute rounded-lg overflow-hidden shadow-2xl border-[2px] border-green-500 bg-black z-30 group"
            style={{ 
              left: webcamPos.x, 
              top: webcamPos.y, 
              width: '200px', 
              minWidth: '150px',
              minHeight: '100px',
              aspectRatio: '16/9',
              resize: 'both',
              position: 'absolute'
            }}
          >
            {/* Thanh tiêu đề để kéo thả */}
            <div 
              onMouseDown={handleDragStart}
              className={`w-full h-6 bg-gradient-to-r from-gray-800 to-gray-900 cursor-move flex items-center justify-between px-2 ${isDraggingWebcam ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity absolute top-0 left-0 z-40`}
            >
              <span className="text-white text-[10px] font-medium flex items-center gap-1 pointer-events-none">
                <Video size={10} />
                Studio
              </span>
              <button onClick={toggleWebcam} className="text-gray-300 hover:text-white p-0.5 hover:bg-red-500 rounded">
                <X size={12} />
              </button>
            </div>

            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover pointer-events-none" 
            />
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
          <div className="w-full max-w-5xl h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl bg-[#0f0f1a] relative">
            <button 
              onClick={() => setActiveSettingsModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex-1 overflow-y-auto">
              <ThanhToanCoin onClose={() => setActiveSettingsModal(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Token History Modal */}
      {showTokenHistory && (
        <TokenHistoryModal
          onClose={() => setShowTokenHistory(false)}
          onOpenPayment={() => { setShowTokenHistory(false); setActiveSettingsModal('payment'); }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-bottom-4 duration-300 max-w-sm ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
        }`}>
          <AlertTriangle size={18} />
          <span>{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
