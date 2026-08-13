import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle, Eye, Clock, List, Zap, AlertCircle, FileText, CheckSquare
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';
import TokenHistoryModal from './TokenHistoryModal';
import { useToken, TOKEN_RATES } from './TokenContext';
import { useLiveCoordinator } from '../../hooks/useLiveCoordinator';
import AIAudioPlayer from './AIAudioPlayer';

export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); 
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommMode, setIsCommMode] = useState(false);
  const [tiktokId, setTiktokId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('aidol_lan_huong');
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  
  // States cho Menu Theo dõi
  const [isMonitorDropdownOpen, setIsMonitorDropdownOpen] = useState(false);
  const [activeMonitorModal, setActiveMonitorModal] = useState(null);
  const [quickResponseText, setQuickResponseText] = useState('');
  const [quickResponseOriginalAudio, setQuickResponseOriginalAudio] = useState(false);
  const quickResponseVideoRef = useRef(null);
  
  const [systemLogs, setSystemLogs] = useState([]);
  const [tiktokLogs, setTiktokLogs] = useState([]);

  const [toast, setToast] = useState(null);
  
  const [customCharacters, setCustomCharacters] = useState(() => {
    const saved = localStorage.getItem('aidol_custom_chars');
    return saved ? JSON.parse(saved) : [];
  });
  const [hiddenBuiltins, setHiddenBuiltins] = useState(() => {
    const saved = localStorage.getItem('aidol_hidden_builtins');
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef(null);

  // Lưu trạng thái mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('aidol_custom_chars', JSON.stringify(customCharacters));
  }, [customCharacters]);

  useEffect(() => {
    localStorage.setItem('aidol_hidden_builtins', JSON.stringify(hiddenBuiltins));
  }, [hiddenBuiltins]);

  const { balance, deductToken, setNotifyCallback } = useToken();
  
  // Audio Player Ref
  const audioPlayerRef = useRef(null);

  // Connection state (phải khai báo trước useEffect)
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  // Tích hợp Live Coordinator (Xử lý AI, Video, Idle Timer)
  const {
    activeVideoItem,
    lipSyncVideoUrl,
    viewerHistory,
    isProcessingEvent,
    handleLiveEvent,
    handleVideoEnded,
    handleActionVideoReady,
    setLipSyncVideoUrl,
    setActiveVideoItem
  } = useLiveCoordinator({
    isConnected: isConnected || showSimulator, // Cho phép Simulator chạy độc lập
    activeBrainPack: 'talk', // mặc định
    onVoiceReply: ({ text, action, baseVideoItem, preRecordedCat }) => {
      // Gọi AIAudioPlayer để phát giọng nói
      if (audioPlayerRef.current) {
        audioPlayerRef.current.enqueueItem(text, action);
      }
      
      // Nếu có video reaction quay sẵn thì đổi video nền ngay
      if (preRecordedCat && baseVideoItem) {
        // Tạm thời bỏ qua logic tìm video reaction (AIAudioPlayer sẽ gọi handleActionVideoReady sau khi LipSync xong)
      }
    }
  });

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
      
      // Bắt đầu sự kiện chào mừng
      handleLiveEvent('VIEWER_JOIN', { name: 'Mọi người' });
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

  const exportTimelineCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFFThời gian,Tên Sự kiện,Nội dung Sự kiện,Phản ứng của AI\n";
    viewerHistory.slice().reverse().forEach(row => {
      let time = row.time || '';
      let type = row.type === 'COMMENT' ? 'Bình luận' : row.type === 'GIFT' ? 'Tặng quà' : 'Vào phòng';
      let content = row.type === 'COMMENT' ? row.payload.text : row.type === 'GIFT' ? row.payload.gift : row.payload.name;
      let ai = row.ai_reply || '';
      // escape quotes
      content = content.replace(/"/g, '""');
      ai = ai.replace(/"/g, '""');
      csvContent += `"${time}","${type}","${content}","${ai}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Dong_thoi_gian_su_kien.csv");
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
    // 1. Ưu tiên phát Video LipSync từ AI (chạy đè lên tất cả)
    if (lipSyncVideoUrl) {
      return (
        <video 
          src={lipSyncVideoUrl} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          controls={false}
          onEnded={handleVideoEnded}
          playsInline 
        />
      );
    }
    
    // 2. Nếu đang kết nối Live và có video nền (Story/Idle/Reaction)
    if (isConnected && activeVideoItem) {
      return (
        <video 
          key={activeVideoItem.id}
          src={activeVideoItem.mediaUrl} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          loop={!isProcessingEvent} // Nếu ko bận thì loop
          controls={false}
          onEnded={handleVideoEnded}
          playsInline 
        />
      );
    }

    // 3. Mặc định: Hiển thị nhân vật được chọn từ Topbar
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
          className="w-full h-full object-contain"
          alt={selected.name} 
          style={{ background: '#0f0f13' }}
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

          <div className="relative">
            <button 
              onClick={() => setIsMonitorDropdownOpen(!isMonitorDropdownOpen)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isMonitorDropdownOpen ? 'bg-orange-600 text-white' : (isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200')}`}>
              <Eye size={16} />
              Theo dõi ▼
            </button>
            {isMonitorDropdownOpen && (
              <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button onClick={() => { setActiveMonitorModal('timeline'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}><Clock size={16} className="text-blue-400" /> Dòng thời gian Sự kiện</button>
                <button onClick={() => { setActiveMonitorModal('queue'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}><List size={16} className="text-gray-400" /> Giám sát Hàng đợi</button>
                <button onClick={() => { setActiveMonitorModal('quick_response'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}><Zap size={16} className="text-yellow-500" /> Phản hồi Nhanh</button>
                <button onClick={() => { setActiveMonitorModal('sys_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}><AlertCircle size={16} className="text-orange-400" /> Log Hệ thống Lỗi</button>
                <button onClick={() => { setActiveMonitorModal('tiktok_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}><FileText size={16} className="text-pink-400" /> Log Sự kiện TikTok</button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSimulator(!showSimulator)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${showSimulator ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}`}>
            <Brain size={16} />
            Công cụ Test
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
             {isConnected ? (lipSyncVideoUrl ? 'Đang trả lời (Lip-sync)...' : 'Chế độ chờ (Sẵn sàng)') : (CHARACTERS[selectedCharacter]?.name || 'Không xác định')} 
          </p>
        </div>

        {/* Ẩn AIAudioPlayer đi, chỉ dùng nó để quản lý logic giọng nói ngầm */}
        <div className="hidden">
          <AIAudioPlayer 
            ref={audioPlayerRef} 
            isLive={isConnected || showSimulator} 
            currentVideoUrl={(isConnected || showSimulator) && activeVideoItem ? activeVideoItem.mediaUrl : null}
            onActionTriggered={(e) => {
              if (e.type === 'LIPSYNC_READY') handleActionVideoReady(e.videoUrl, true);
              if (e.type === 'LIPSYNC_ENDED') setLipSyncVideoUrl(null);
            }} 
          />
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

        {/* Cửa sổ Nổi: Công cụ Simulator */}
        {showSimulator && (
          <div className="absolute right-6 top-6 w-80 bg-[#1c1c23] border border-gray-700 rounded-xl shadow-2xl p-4 z-40 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Brain size={14} className="text-purple-400" /> Công cụ Giả lập Live</h3>
              <button onClick={() => setShowSimulator(false)} className="text-gray-400 hover:text-white"><X size={14} /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })} className="flex-1 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded text-xs font-medium border border-blue-500/30">👋 Có người vào</button>
                  <button onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia', gift: 'Hoa hồng (Rose)' })} className="flex-1 py-1.5 bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 rounded text-xs font-medium border border-pink-500/30">🌹 Tặng quà</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleLiveEvent('COMMENT', { name: 'Fan Cứng', text: 'Chào idol, hôm nay xinh quá!' })} className="w-full py-1.5 bg-[#00FF66]/20 hover:bg-[#00FF66]/40 text-[#00FF66] rounded text-xs font-medium border border-[#00FF66]/30">💬 Comment: Xinh quá</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleLiveEvent('COMMENT', { name: 'Khách', text: 'Sản phẩm này dùng thế nào?' })} className="w-full py-1.5 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded text-xs font-medium border border-purple-500/30">🛒 Hỏi mua hàng</button>
                </div>
                
                {/* Trợ lý ngầm nhắc nhở */}
                <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-gray-700">
                  <label className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><Mic size={12} className="text-red-400" /> Trợ lý nhắc nhở (Đạo diễn):</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={assistantPrompt}
                      onChange={(e) => setAssistantPrompt(e.target.value)}
                      placeholder="VD: Nhắc idol cảm ơn user..."
                      className="flex-1 bg-black/40 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && assistantPrompt.trim()) {
                          handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() });
                          setAssistantPrompt('');
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        if (assistantPrompt.trim()) {
                          handleLiveEvent('ASSISTANT_PROMPT', { prompt: assistantPrompt.trim() });
                          setAssistantPrompt('');
                        }
                      }}
                      className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium"
                    >
                      Gửi lệnh
                    </button>
                  </div>
                </div>

              {isProcessingEvent && <div className="text-[10px] text-yellow-400 animate-pulse text-center pt-2">AI đang suy nghĩ...</div>}
            </div>
            
            <div className="mt-4 pt-2 border-t border-gray-700 h-32 overflow-y-auto">
              <div className="text-[10px] font-medium text-gray-400 mb-1">Lịch sử sự kiện:</div>
              {viewerHistory.slice().reverse().map((h, i) => (
                 <div key={i} className="mb-2 text-[10px] bg-black/30 p-1.5 rounded border border-gray-800">
                    <span className="text-gray-300">[{h.time}] <strong className="text-white">{h.payload.name}</strong> {h.type === 'COMMENT' ? `bình luận: ${h.payload.text}` : h.type === 'GIFT' ? `tặng: ${h.payload.gift}` : 'vào phòng'}</span>
                    {h.ai_reply && <div className="text-[#00FF66] mt-0.5 ml-2 border-l border-[#00FF66]/30 pl-1">↳ AI: {h.ai_reply}</div>}
                 </div>
              ))}
            </div>
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
            <div className="flex-1 overflow-hidden">
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
        <TokenHistoryModal onClose={() => setShowTokenHistory(false)} />
      )}

      {/* ---------------- MONITOR MODALS ---------------- */}
      {activeMonitorModal === 'timeline' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#e5e5e5] rounded shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border border-gray-400">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#f0f0f0]">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Clock size={16} className="text-blue-800" /> Dòng thời gian Sự kiện & Phản ứng</h2>
              <button onClick={() => setActiveMonitorModal(null)} className="p-1 hover:bg-gray-300 rounded transition-colors"><X size={16} className="text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f0f0f0] text-gray-700 font-semibold border-b border-gray-300 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 w-32 text-center text-[#a53b3b]">Thời gian</th>
                    <th className="px-4 py-2 w-48 text-[#a53b3b]">Tên Sự kiện</th>
                    <th className="px-4 py-2 w-1/3 text-[#a53b3b]">Nội dung Sự kiện</th>
                    <th className="px-4 py-2 text-[#a53b3b]">Phản ứng của AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {viewerHistory.slice().reverse().map((h, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-2 text-center text-gray-500">{h.time}</td>
                      <td className="px-4 py-2 font-medium text-gray-700">{h.type === 'COMMENT' ? 'Bình luận' : h.type === 'GIFT' ? 'Tặng quà' : 'Vào phòng'}</td>
                      <td className="px-4 py-2 text-gray-800">{h.type === 'COMMENT' ? h.payload.text : h.type === 'GIFT' ? h.payload.gift : h.payload.name}</td>
                      <td className="px-4 py-2 text-green-700">{h.ai_reply || ''}</td>
                    </tr>
                  ))}
                  {viewerHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-400">Chưa có sự kiện nào trong phiên live này.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-[#f0f0f0] border-t border-gray-300 flex justify-center">
              <button onClick={exportTimelineCSV} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-sm font-medium transition-colors shadow-sm">
                <Download size={14} className="text-purple-600" /> Xuất ra file CSV...
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'quick_response' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#e5e5e5] rounded shadow-2xl w-[500px] flex flex-col border border-gray-400">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#f0f0f0]">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Zap size={16} className="text-blue-800" /> Phản hồi Nhanh</h2>
              <button onClick={() => setActiveMonitorModal(null)} className="p-1 hover:bg-gray-300 rounded transition-colors"><X size={16} className="text-gray-600" /></button>
            </div>
            <div className="p-4 bg-white space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#a53b3b] mb-1 block">Nhập nội dung cần nói (bỏ trống nếu chỉ muốn phát video):</label>
                <textarea 
                  value={quickResponseText}
                  onChange={(e) => setQuickResponseText(e.target.value)}
                  className="w-full h-40 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => quickResponseVideoRef.current?.click()} className="px-3 py-1 bg-white border border-gray-400 rounded text-xs text-green-700 hover:bg-gray-50 flex-shrink-0">
                  Chọn Video (Bắt buộc)...
                </button>
                <input type="file" accept="video/*" ref={quickResponseVideoRef} className="hidden" onChange={(e) => setQuickResponseVideo(e.target.files[0])} />
                <span className="text-xs text-gray-500 truncate">{quickResponseVideo ? quickResponseVideo.name : 'Chưa chọn video.'}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={quickResponseOriginalAudio}
                  onChange={(e) => setQuickResponseOriginalAudio(e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                <span className="text-xs text-[#a53b3b] font-medium">Phát âm thanh gốc của video (không dùng TTS)</span>
              </label>
            </div>
            <div className="p-3 bg-white border-t border-gray-200">
              <button 
                onClick={() => {
                  if (audioPlayerRef.current && quickResponseText.trim()) {
                     audioPlayerRef.current.enqueueItem(quickResponseText.trim(), 'QUICK_RESPONSE');
                     setToast({ msg: 'Đã gửi lệnh phản hồi nhanh!', type: 'success' });
                     setQuickResponseText('');
                     setActiveMonitorModal(null);
                  } else if (quickResponseVideo) {
                     // Fake logic for now if only video
                     setToast({ msg: 'Đã tải video phản hồi khẩn cấp!', type: 'success' });
                     setActiveMonitorModal(null);
                  } else {
                     setToast({ msg: 'Vui lòng nhập nội dung TTS hoặc chọn video.', type: 'warn' });
                  }
                }}
                className={`w-full py-2 hover:bg-red-600 text-white rounded font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-red-600' : 'bg-[#ef4444]'}`}
              >
                <Play size={16} /> PHÁT NGAY
              </button>
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'queue' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#e5e5e5] rounded shadow-2xl w-[600px] h-[400px] flex flex-col border border-gray-400">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#f0f0f0]">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <List size={16} className="text-blue-800" /> Giám sát Hàng đợi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className="p-1 hover:bg-gray-300 rounded transition-colors"><X size={16} className="text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-white p-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Đang xử lý / Chờ AI</h3>
              {isProcessingEvent ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold text-blue-800">Sự kiện gần nhất</div>
                    <div className="text-xs text-blue-600">Đang sinh phản hồi AI...</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">Hàng đợi đang trống.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'sys_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#e5e5e5] rounded shadow-2xl w-[800px] h-[500px] flex flex-col border border-gray-400">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#f0f0f0]">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-600" /> Log Hệ thống Lỗi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className="p-1 hover:bg-gray-300 rounded transition-colors"><X size={16} className="text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-white text-gray-800 p-4 text-sm">
              {systemLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Hệ thống đang hoạt động ổn định. Chưa ghi nhận lỗi nào.</div>
              ) : (
                systemLogs.map((log, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-red-50 border border-red-200 rounded">
                    <span className="text-gray-500 text-xs font-mono">[{log.time}]</span> <span className="font-bold text-red-600">ERROR:</span> <span className="text-red-800">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'tiktok_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-[#e5e5e5] rounded shadow-2xl w-[800px] h-[500px] flex flex-col border border-gray-400">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-[#f0f0f0]">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <FileText size={16} className="text-pink-600" /> Log Sự kiện TikTok
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className="p-1 hover:bg-gray-300 rounded transition-colors"><X size={16} className="text-gray-600" /></button>
            </div>
            <div className="flex-1 overflow-auto bg-white text-gray-800 p-4 text-sm">
              {tiktokLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Đang chờ sự kiện thô từ TikTok...</div>
              ) : (
                tiktokLogs.map((log, idx) => (
                  <div key={idx} className="mb-3 border border-gray-200 rounded bg-gray-50 p-2">
                    <div className="text-blue-600 font-bold mb-1 border-b border-gray-200 pb-1">[{log.time}] {log.type}</div>
                    <pre className="text-gray-600 overflow-x-auto font-mono text-xs">{JSON.stringify(log.payload, null, 2)}</pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
