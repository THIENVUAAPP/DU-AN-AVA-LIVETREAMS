import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Settings, CreditCard, Video, Moon, Sun, 
  MessageCircle, Play, Pause, Mic, MicOff, X, Download, Plus,
  Brain, Radio, Coins, AlertTriangle, Eye, Clock, List, Zap, AlertCircle, FileText, CheckSquare,
  Gift, ShoppingBag, Sparkles, RotateCcw, Send, Trash2, Heart, Share2, UserPlus, Users, Swords, Shield, Gamepad2, Flag, MapPin,
  Smartphone, MonitorPlay
} from 'lucide-react';
import WorkspaceTacVu from './WorkspaceTacVu';
import GeneralSettings from './GeneralSettings';
import ThanhToanCoin from './ThanhToanCoin';
import TokenHistoryModal from './TokenHistoryModal';
import { useToken, TOKEN_RATES } from './TokenContext';
import { useLiveCoordinator } from '../../hooks/useLiveCoordinator';
import AIAudioPlayer from './AIAudioPlayer';
import QuickResponseModal from './QuickResponseModal';
import TemplateLibraryModal from './TemplateLibraryModal';
import GameChienDau from './game/GameChienDau';
import GameChienDauAdminModal from './game/GameChienDauAdminModal';
import GameBanDoVietNam from './game/GameBanDoVietNam';
import GameBanDoAdminModal from './game/GameBanDoAdminModal';
import { saveCharacterToIDB, loadAllCharactersFromIDB, deleteCharacterFromIDB } from '../../utils/idbHelper';
export default function DesktopAppUI() {
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); 
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCommMode, setIsCommMode] = useState(false);
  const [tiktokId, setTiktokId] = useState(() => {
    try {
      return localStorage.getItem('aidol_tiktok_id') || '';
    } catch (e) {
      return '';
    }
  });
  const [selectedCharacter, setSelectedCharacter] = useState('aidol_lan_huong');
  const [showTokenHistory, setShowTokenHistory] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [autoSimActive, setAutoSimActive] = useState(false);
  const [simTab, setSimTab] = useState('quick');
  const autoSimTimerRef = useRef(null);
  
  // Game Chiến Đấu States
  const [isGameBattleActive, setIsGameBattleActive] = useState(false);
  const [isGameAdminOpen, setIsGameAdminOpen] = useState(false);
  const [lastGameEvent, setLastGameEvent] = useState(null);

  // Game Bản Đồ Hình Chữ S States
  const [isGameBanDoActive, setIsGameBanDoActive] = useState(false);
  const [isGameBanDoAdminOpen, setIsGameBanDoAdminOpen] = useState(false);

  // Tỷ Lệ Khung Hình Toàn Cục (9:16 TikTok Dọc vs 16:9 OBS Ngang)
  const [globalAspectRatio, setGlobalAspectRatio] = useState(() => {
    try {
      return localStorage.getItem('avalive_global_aspect_ratio') || '9:16';
    } catch (e) {
      return '9:16';
    }
  });

  const toggleGlobalAspectRatio = () => {
    const next = globalAspectRatio === '9:16' ? '16:9' : '9:16';
    setGlobalAspectRatio(next);
    try {
      localStorage.setItem('avalive_global_aspect_ratio', next);
    } catch (e) {}
  };

  // States cho Menu Theo dõi
  const [isMonitorDropdownOpen, setIsMonitorDropdownOpen] = useState(false);
  const [activeMonitorModal, setActiveMonitorModal] = useState(null);
  const [quickResponseActiveVideo, setQuickResponseActiveVideo] = useState(null);
  
  const [systemLogs, setSystemLogs] = useState([]);
  const [tiktokLogs, setTiktokLogs] = useState([]);

  const [toast, setToast] = useState(null);
  
  const [customCharacters, setCustomCharacters] = useState([]);
  const [hiddenBuiltins, setHiddenBuiltins] = useState(() => {
    try {
      const saved = localStorage.getItem('aidol_hidden_builtins');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const fileInputRef = useRef(null);
  const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);

  // Load & Sync custom characters from Unified AIDOL_DB
  const reloadCharacters = () => {
    loadAllCharactersFromIDB().then(chars => {
      const loadedChars = chars.map(c => {
        let url = c.url || c.mediaUrl;
        if (c.fileData) {
          try {
            url = URL.createObjectURL(c.fileData);
          } catch (e) {
            url = c.url || c.mediaUrl;
          }
        }
        return {
          id: c.id,
          name: c.name || 'AIDOL của tôi',
          type: c.type || 'image',
          url
        };
      });
      setCustomCharacters(loadedChars);
    });
  };

  useEffect(() => {
    reloadCharacters();
    const handleUpdate = () => reloadCharacters();
    window.addEventListener('aidol_db_updated', handleUpdate);
    return () => window.removeEventListener('aidol_db_updated', handleUpdate);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aidol_hidden_builtins', JSON.stringify(hiddenBuiltins));
    } catch (e) {}
  }, [hiddenBuiltins]);

  const { balance, deductToken, setNotifyCallback } = useToken();
  
  // Audio Player Ref
  const audioPlayerRef = useRef(null);

  // Connection state (phải khai báo trước useEffect)
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
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
    setActiveVideoItem,
    setViewerHistory
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

  // Danh sách sự kiện giả lập đa dạng
  const SIMULATION_EVENTS = [
    { type: 'VIEWER_JOIN', payload: { name: 'Thanh Nhàn (Khách mới)' } },
    { type: 'VIEWER_JOIN', payload: { name: 'Vip_HoangNam (VIP)' } },
    { type: 'GIFT', payload: { name: 'Bảo Trâm', gift: 'Hoa hồng 🌹 (1 xu)' } },
    { type: 'GIFT', payload: { name: 'Đại Gia Phố Cổ', gift: 'Tên lửa vũ trụ 🚀' } },
    { type: 'COMMENT', payload: { name: 'Minh Thảo', text: 'Chào idol, hôm nay xinh và năng lượng quá!' } },
    { type: 'COMMENT', payload: { name: 'Hải Đăng', text: 'Mẫu áo này chất liệu gì và còn size L không shop?' } },
    { type: 'COMMENT', payload: { name: 'Ngọc Mai', text: 'Sản phẩm này có voucher freeship hôm nay không ạ?' } },
    { type: 'PURCHASE', payload: { name: 'Quốc Cường', item: 'Combo 2 Áo Thun Cao Cấp' } },
    { type: 'LIKE', payload: { count: '10.000 tim' } },
    { type: 'FOLLOW', payload: { name: 'Hồng Ánh' } },
    { type: 'SHARE', payload: { name: 'Thu Hằng' } }
  ];

  // Auto-simulation timer
  useEffect(() => {
    if (autoSimActive && showSimulator) {
      autoSimTimerRef.current = setInterval(() => {
        const randomEvent = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        handleLiveEvent(randomEvent.type, randomEvent.payload);
      }, 9000);
    } else {
      if (autoSimTimerRef.current) clearInterval(autoSimTimerRef.current);
    }
    return () => {
      if (autoSimTimerRef.current) clearInterval(autoSimTimerRef.current);
    };
  }, [autoSimActive, showSimulator]);

  // Toast helper
  const showToast = (msg, type = 'warn') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Register low-balance callback
  useEffect(() => {
    setNotifyCallback(({ message }) => showToast(message, 'warn'));
  }, [setNotifyCallback]);

  // Auto-deduct tokens when live session is active (AI Brain & Server 유지)
  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      deductToken(TOKEN_RATES.AI_LIVE_PER_30S || 5, 'AI LLM Brain & Duy trì Live (30s)');
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

  // Trạng thái Chạy Demo / Test Toàn Cục (1 Nút Duy Nhất cho tất cả Game / Idol)
  const [isGlobalDemoRunning, setIsGlobalDemoRunning] = useState(false);
  const globalDemoTimerRef = useRef(null);

  const handleGlobalRunDemo = useCallback(() => {
    if (isGlobalDemoRunning) {
      if (globalDemoTimerRef.current) {
        clearInterval(globalDemoTimerRef.current);
        globalDemoTimerRef.current = null;
      }
      setIsGlobalDemoRunning(false);
      return;
    }

    setIsGlobalDemoRunning(true);

    if (isGameBanDoActive) {
      // 1. Kích hoạt Demo Game Bản Đồ Cắm Cờ
      window.dispatchEvent(new CustomEvent('bando-trigger-demo'));
      globalDemoTimerRef.current = setInterval(() => {
        window.dispatchEvent(new CustomEvent('bando-trigger-demo'));
      }, 1200);
    } else if (isGameBattleActive) {
      // 2. Kích hoạt Demo Game Chiến Đấu PK
      window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
      globalDemoTimerRef.current = setInterval(() => {
        window.dispatchEvent(new CustomEvent('battle-trigger-demo'));
      }, 1500);
    } else {
      // 3. Kích hoạt Demo AI Idol Live
      const mockEvt = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
      handleLiveEvent(mockEvt.type, mockEvt.payload);
      globalDemoTimerRef.current = setInterval(() => {
        const rand = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];
        handleLiveEvent(rand.type, rand.payload);
      }, 3500);
    }
  }, [isGlobalDemoRunning, isGameBanDoActive, isGameBattleActive, handleLiveEvent, SIMULATION_EVENTS]);

  // Clean up global demo timer on unmount
  useEffect(() => {
    return () => {
      if (globalDemoTimerRef.current) clearInterval(globalDemoTimerRef.current);
    };
  }, []);

  const ALL_CHARACTERS = {
    'aidol_lan_huong': { 
      name: 'Lan Hương (AI)', 
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80', 
      type: 'image' 
    },
    'aidol_ngoc_trinh': { 
      name: 'Ngọc Trinh (AI)', 
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', 
      type: 'image' 
    },
    'aidol_mai_anh': { 
      name: 'Mai Anh (KOL)', 
      url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80', 
      type: 'image' 
    }
  };

  // Lọc bỏ các nhân vật đã bị ẩn và gộp nhân vật tuỳ chỉnh
  const CHARACTERS = {};
  Object.keys(ALL_CHARACTERS).forEach(id => {
    if (!hiddenBuiltins.includes(id)) CHARACTERS[id] = ALL_CHARACTERS[id];
  });
  if (Array.isArray(customCharacters)) {
    customCharacters.forEach(c => {
      if (c && c.id) {
        CHARACTERS[c.id] = { name: c.name || 'Custom AI', url: c.url, type: c.type || 'image' };
      }
    });
  }
  // Đảm bảo luôn có ít nhất 1 nhân vật hiển thị
  if (Object.keys(CHARACTERS).length === 0) {
    CHARACTERS['aidol_lan_huong'] = ALL_CHARACTERS['aidol_lan_huong'];
  }


  // Đồng bộ hoá luồng video sạch sang TikTok LIVE Studio / OBS qua BroadcastChannel và localStorage
  useEffect(() => {
    const char = CHARACTERS[selectedCharacter] || { url: '', type: 'image', name: 'AI Idol' };
    const currentMedia = (isConnected || showSimulator) && activeVideoItem ? activeVideoItem.mediaUrl : char.url;
    const isVid = char.type === 'video' || (activeVideoItem && activeVideoItem.type === 'video');

    const streamPayload = {
      type: 'STREAM_MEDIA_UPDATE',
      mediaUrl: currentMedia,
      isVideo: !!isVid,
      characterName: char.name || 'AI Idol',
      isConnected: !!(isConnected || showSimulator)
    };

    try {
      localStorage.setItem('aidol_clean_stream_state', JSON.stringify(streamPayload));
    } catch (e) {}

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('avalive_clean_stream_channel');
      channel.postMessage(streamPayload);
      channel.close();
    }
  }, [selectedCharacter, activeVideoItem, isConnected, showSimulator, CHARACTERS]);

  const handleConnect = async () => {
    if (isConnected) {
      // Dừng AI & Ngắt kết nối
      setIsConnected(false);
      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [`[${timeStr}] 🛑 Đã dừng phiên Live & ngắt kết nối`, ...prev.slice(0, 49)]);
      setTiktokLogs(prev => [`[${timeStr}] 🛑 Phiên Live TikTok đã tạm dừng`, ...prev.slice(0, 49)]);
      return;
    }
    
    setIsConnecting(true);
    const cleanId = tiktokId.trim().replace(/^@/, '');
    if (cleanId) {
      try {
        localStorage.setItem('aidol_tiktok_id', cleanId);
      } catch (e) {}
    }
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setConnectionError('');
      const targetChan = cleanId ? `@${cleanId}` : 'Kênh TikTok Live';
      setToast({
        type: 'success',
        message: `Đã kết nối thành công với ${targetChan}! Sẵn sàng phát live TikTok Studio.`
      });
      setTimeout(() => setToast(null), 4000);

      const timeStr = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `[${timeStr}] 🟢 KẾT NỐI THÀNH CÔNG: ${targetChan}`,
        `[${timeStr}] ⚡ Đang đồng bộ hóa luồng video sang TikTok Live Studio / OBS`,
        ...prev.slice(0, 48)
      ]);
      setTiktokLogs(prev => [
        `[${timeStr}] 🟢 Đã kết nối với TikTok Live: ${targetChan}`,
        `[${timeStr}] 📡 Sẵn sàng bắt sự kiện Quà tặng, Bình luận, Follow và Thả tim`,
        ...prev.slice(0, 48)
      ]);
      
      // Bắt đầu sự kiện chào mừng
      handleLiveEvent('VIEWER_JOIN', { name: cleanId ? `@${cleanId}` : 'Mọi người' });
    }, 1200);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const charName = prompt("Nhập tên cho nhân vật (để dễ quản lý):");
      if (!charName) {
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
      
      // Update UI first
      setCustomCharacters(prev => [...prev, newChar]);
      setSelectedCharacter(newChar.id);

      // Save to IDB
      await saveCharacterToIDB({
        id: newChar.id,
        name: newChar.name,
        type: newChar.type,
        fileData: file
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeCustomCharacter = async (e, id) => {
    e.stopPropagation();
    setCustomCharacters(prev => prev.filter(c => c.id !== id));
    if (selectedCharacter === id) {
      setSelectedCharacter('aidol_lan_huong');
    }
    await deleteCharacterFromIDB(id);
  };

  const renderAiIdolLiveStage = () => {
    // 0. Ưu tiên phát Video Phản hồi Nhanh khẩn cấp (Override Live Screen)
    if (quickResponseActiveVideo) {
      return (
        <div className="relative w-full h-full">
          <video 
            key={quickResponseActiveVideo.url}
            src={quickResponseActiveVideo.url} 
            className="w-full h-full object-contain bg-black"
            autoPlay 
            loop={quickResponseActiveVideo.loop}
            muted={quickResponseActiveVideo.muted}
            controls={false}
            onEnded={() => {
              if (!quickResponseActiveVideo.loop) {
                setQuickResponseActiveVideo(null);
                showToast('Đã phát xong video phản hồi nhanh!', 'info');
              }
            }}
            onError={() => {
              setQuickResponseActiveVideo(null);
              showToast('Lỗi tải video phản hồi nhanh!', 'warn');
            }}
            playsInline 
          />
          <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-pulse z-20">
            <Zap size={14} /> ĐANG PHÁT VIDEO PHẢN HỒI: {quickResponseActiveVideo.name || 'Video Khẩn cấp'}
            <button 
              onClick={() => {
                setQuickResponseActiveVideo(null);
                showToast('Đã dừng video phản hồi!', 'warn');
              }}
              className="ml-2 bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded text-[10px] text-white"
            >
              Dừng phát ✕
            </button>
          </div>
        </div>
      );
    }

    // 1. Ưu tiên phát Video LipSync từ AI (chạy đè lên tất cả)
    if (lipSyncVideoUrl) {
      return (
        <video 
          src={lipSyncVideoUrl} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          controls={false}
          onEnded={handleVideoEnded}
          onError={() => {
            setLipSyncVideoUrl(null);
            handleVideoEnded();
          }}
          playsInline 
        />
      );
    }
    
    // 2. Nếu đang kết nối Live và có video nền (Story/Idle/Reaction)
    if (isConnected && activeVideoItem && activeVideoItem.mediaUrl) {
      return (
        <video 
          key={activeVideoItem.id || activeVideoItem.mediaUrl}
          src={activeVideoItem.mediaUrl} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          loop={!isProcessingEvent} // Nếu ko bận thì loop
          controls={false}
          onEnded={handleVideoEnded}
          onError={() => {
            console.warn('Lỗi tải video nền live, chuyển về nhân vật mặc định');
            setActiveVideoItem(null);
          }}
          playsInline 
        />
      );
    }

    // 3. Mặc định: Hiển thị nhân vật được chọn từ Topbar với fallback an toàn
    const selected = CHARACTERS[selectedCharacter] 
      || Object.values(CHARACTERS)[0] 
      || ALL_CHARACTERS['aidol_lan_huong'];

    if (!selected) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#121218] text-white p-6">
           <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-3 text-purple-400">
             <Video size={32} />
           </div>
           <h3 className="text-base font-bold text-white mb-1">AIDOL Livestream Studio</h3>
           <p className="text-xs text-gray-400">Vui lòng chọn hoặc tải nhân vật từ thanh công cụ bên trên.</p>
        </div>
      );
    }

    if (selected.type === 'video') {
      return (
        <video 
          key={selected.url}
          src={selected.url} 
          className="w-full h-full object-contain bg-black"
          autoPlay 
          loop 
          muted 
          controls 
          playsInline 
          onError={(e) => {
            console.warn("Video failed to load, fallback to default character image");
          }}
        />
      );
    } else {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#0d0d12] overflow-hidden select-none">
          <img 
            src={selected.url} 
            className="w-full h-full object-contain drop-shadow-2xl transition-all"
            alt={selected.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          {/* Subtle gradient vignette to blend naturally */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
      );
    }
  };

  const renderCharacterContent = () => {
    // -1. Chế độ Game Chiến Đấu (TikTok LIVE Battle Overlay)
    if (isGameBattleActive) {
      return (
        <GameChienDau 
          isPopout={false}
          onOpenAdmin={() => setIsGameAdminOpen(true)}
          externalLiveEvent={lastGameEvent}
          aspectRatio={globalAspectRatio}
          onToggleAspectRatio={toggleGlobalAspectRatio}
        />
      );
    }

    // -2. Chế độ Game Đất Nước Bản Đồ Hình Chữ S (Việt Nam Ghép Cờ LIVE)
    if (isGameBanDoActive) {
      return (
        <GameBanDoVietNam 
          isPopout={false}
          onOpenAdmin={() => setIsGameBanDoAdminOpen(true)}
          aspectRatio={globalAspectRatio}
          onToggleAspectRatio={toggleGlobalAspectRatio}
        />
      );
    }

    // 0. Chế độ AI Idol Livestream Video / Live Screen
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#05070c] p-2 sm:p-3 overflow-hidden">
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            globalAspectRatio === '9:16'
              ? 'w-full max-w-[440px] h-full max-h-[860px] aspect-[9/16] rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
          }`}
        >
          {renderAiIdolLiveStage()}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* 1. Fake Window Title Bar (Đã gộp nút Tải ZIP và Game Chiến Đấu lên đây) */}
      <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-[#1c1c23]' : 'bg-gray-300'} select-none z-30`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
            <Video size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium">Livestream AI (Clone) - Profile: {CHARACTERS[selectedCharacter]?.name || 'Không xác định'}</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Nút Kích hoạt Game Chiến Đấu (Đã chuyển lên thanh tiêu đề trên cùng) */}
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              isGameBattleActive 
                ? 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/40 ring-2 ring-purple-400/50 animate-pulse' 
                : (isDarkMode ? 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100')
            }`}
            onClick={() => {
              const next = !isGameBattleActive;
              setIsGameBattleActive(next);
              if (next && isGameBanDoActive) setIsGameBanDoActive(false);
            }}
            title="Bật/Tắt chế độ Game Chiến Đấu (TikTok LIVE Battle Game) trên màn hình chính"
          >
            <Swords size={14} className={isGameBattleActive ? 'text-yellow-300' : 'text-indigo-400'} />
            <span>Game Chiến Đấu</span>
            {isGameBattleActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Bảng Quản trị Admin của Game Chiến Đấu */}
          {isGameBattleActive && (
            <button 
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 transition-colors"
              onClick={() => setIsGameAdminOpen(true)}
              title="Mở Bảng Quản trị Admin của Game Chiến Đấu (Tách biệt hoàn toàn với Live Stream)"
            >
              <Shield size={13} className="text-purple-400" />
              <span>Admin PK</span>
            </button>
          )}

          {/* Nút Kích hoạt Game Ghép Cờ Bản Đồ Việt Nam (Hình Chữ S) */}
          <button 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              isGameBanDoActive 
                ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-white border-yellow-300 shadow-yellow-500/40 ring-2 ring-yellow-400/50 animate-pulse' 
                : (isDarkMode ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60' : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100')
            }`}
            onClick={() => {
              const next = !isGameBanDoActive;
              setIsGameBanDoActive(next);
              if (next && isGameBattleActive) setIsGameBattleActive(false);
            }}
            title="Bật/Tắt Game Ghép Cờ Bản Đồ Việt Nam (Đất Nước Hình Chữ S) trên màn hình chính"
          >
            <Flag size={14} className={isGameBanDoActive ? 'text-yellow-200' : 'text-amber-400'} />
            <span>Bản Đồ Chữ S</span>
            {isGameBanDoActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Bảng Quản trị Admin của Game Bản Đồ */}
          {isGameBanDoActive && (
            <button 
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 transition-colors"
              onClick={() => setIsGameBanDoAdminOpen(true)}
              title="Mở Bảng Quản trị Admin của Game Ghép Cờ Bản Đồ Việt Nam"
            >
              <Shield size={13} className="text-amber-400" />
              <span>Admin Bản Đồ</span>
            </button>
          )}

          {/* Nút Chuyển Tỷ Lệ Khung Hình Toàn Cục: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}
          <button
            onClick={toggleGlobalAspectRatio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all border shadow-sm ${
              globalAspectRatio === '9:16'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 ring-2 ring-pink-400/50 shadow-pink-500/30'
                : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-cyan-300 border-white/10' : 'bg-gray-200 hover:bg-gray-300 text-slate-800 border-gray-300')
            }`}
            title={globalAspectRatio === '9:16' ? "Đang ở Khung Hình 9:16 (Chuẩn TikTok Live Dọc) — Bấm chuyển sang 16:9 (Ngang OBS/PC)" : "Đang ở Khung Hình 16:9 (Ngang OBS/PC) — Bấm chuyển sang 9:16 (Chuẩn TikTok Live Dọc)"}
          >
            <Smartphone size={13} className={globalAspectRatio === '9:16' ? 'text-yellow-300' : 'text-cyan-300'} />
            <span>{globalAspectRatio === '9:16' ? '9:16 TikTok' : '16:9 OBS'}</span>
          </button>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-1.5 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'}`}>
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

          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20'}`}>
            <MessageCircle size={16} />
            Zalo
          </button>

          <button onClick={() => setActiveSettingsModal('payment')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-500/10 text-green-700 hover:bg-green-500/20'}`}>
            <CreditCard size={16} />
            Thanh toán
          </button>

          {/* Nút Tải phần mềm (ZIP) đã được đưa lên góc này */}
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded shadow-sm flex items-center gap-1.5 transition-colors"
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
              MENU ▼
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

          {/* Nút Studio đặt cạnh MENU */}
          <button onClick={toggleWebcam} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isWebcamActive ? 'bg-pink-600 text-white hover:bg-pink-500' : isDarkMode ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
            <Video size={16} />
            Studio
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Middle: Controls */}
        <div className="flex items-center justify-center gap-3 shrink-0">
          
          <div className="flex items-center gap-2 border-r border-gray-500/30 pr-3">
            <span className="text-sm font-medium text-gray-400">Nhân vật:</span>
            <div className="flex gap-2">
              {Object.keys(CHARACTERS).map((charId) => (
                CHARACTERS[charId] ? (
                  <div 
                    key={charId}
                    onClick={() => setSelectedCharacter(charId)}
                    className={`w-10 h-10 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group ${selectedCharacter === charId ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/30' : 'border border-gray-600 opacity-60 hover:opacity-100'}`}
                    title={CHARACTERS[charId]?.name || ''}
                  >
                    {CHARACTERS[charId]?.type === 'video' ? (
                      <video src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" alt={CHARACTERS[charId]?.name || ''} />
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
                      title={`Xoá ${CHARACTERS[charId]?.name || ''}`}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : null
              ))}
              <button className="w-8 h-8 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50 shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Plus size={16} />
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors border ${isDarkMode ? 'border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50' : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                onClick={() => setIsTemplateLibraryOpen(true)}
              >
                Thư viện Mẫu
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*,image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 shrink-0">
            <input type="text" value={tiktokId} onChange={(e) => setTiktokId(e.target.value)} className={`w-32 px-3 py-1.5 rounded text-sm outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`} placeholder="ID TikTok..." />
            <button onClick={handleConnect} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {isConnecting ? <span className="animate-spin text-lg leading-none">↻</span> : (isConnected ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />)}
              {isConnecting ? 'Đang xử lý...' : (isConnected ? 'Dừng AI' : 'Kết nối')}
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Right Side: Toggles & Stream Window */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* 1 Nút Mở Cửa Sổ Live Sạch DUY NHẤT (Tự động thích ứng 9:16 TikTok Dọc vs 16:9 OBS Ngang) */}
          <button 
            onClick={() => {
              let overlayUrl = `?overlay=cleanlive&ratio=${globalAspectRatio}`;
              let winName = 'AvaliveCleanStream';
              if (isGameBanDoActive) {
                overlayUrl = `?overlay=bando&ratio=${globalAspectRatio}`;
                winName = 'AvaliveMapOverlay';
              } else if (isGameBattleActive) {
                overlayUrl = `?overlay=gamebattle&ratio=${globalAspectRatio}`;
                winName = 'AvaliveBattleOverlay';
              }
              const w = globalAspectRatio === '9:16' ? 450 : 1280;
              const h = globalAspectRatio === '9:16' ? 800 : 720;
              window.open(overlayUrl, winName, `width=${w},height=${h},menubar=no,toolbar=no,location=no,status=no`);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black transition-all bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-md shadow-pink-500/25 border border-pink-400/40 active:scale-95"
            title={`Mở cửa sổ ${globalAspectRatio} sạch độc lập (không chứa bất kỳ nút bấm quản trị hay cài đặt nào) để đưa thẳng vào TikTok LIVE Studio hoặc OBS Studio`}
          >
            <Video size={16} />
            <span>{globalAspectRatio === '9:16' ? 'Khung Live 9:16' : 'Khung Live 16:9'}</span>
          </button>

          {/* 1 Nút Chạy Demo DUY NHẤT dùng chung cho toàn bộ App và các Game */}
          <button 
            onClick={handleGlobalRunDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-black transition-all border shadow-md active:scale-95 ${
              isGlobalDemoRunning
                ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-yellow-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-500/20'
            }`}
            title="Chạy Demo / Kiểm thử tự động quà tặng & tương tác cho chế độ đang mở (AI Idol, Bản Đồ, Game Chiến Đấu)"
          >
            <Zap size={16} className={isGlobalDemoRunning ? 'text-yellow-300 animate-bounce' : 'text-yellow-300'} />
            <span>{isGlobalDemoRunning ? '⚡ Dừng Demo' : '⚡ Chạy Demo'}</span>
          </button>

          {/* Menu Theo dõi: Sắp xếp theo thứ tự ưu tiên hay dùng nhất lên đầu */}
          <div className="relative">
            <button 
              onClick={() => setIsMonitorDropdownOpen(!isMonitorDropdownOpen)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isMonitorDropdownOpen ? 'bg-orange-600 text-white' : (isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200')}`}>
              <Eye size={16} />
              Theo dõi ▼
            </button>
            {isMonitorDropdownOpen && (
              <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                {/* 1. Ưu tiên hàng đầu khi live: Phản hồi nhanh */}
                <button onClick={() => { setActiveMonitorModal('quick_response'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-bold transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-yellow-500/20 text-yellow-400' : 'hover:bg-yellow-100 text-yellow-800'}`}>
                  <Zap size={16} className="text-yellow-500" /> 
                  <span>Phản hồi Nhanh</span>
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/30 text-yellow-300 font-mono">Ưu tiên #1</span>
                </button>

                {/* 2. Dòng thời gian sự kiện (xem quà & cmt) */}
                <button onClick={() => { setActiveMonitorModal('timeline'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Clock size={16} className="text-blue-400" /> 
                  <span>Dòng thời gian Sự kiện</span>
                </button>

                {/* 3. Giám sát hàng đợi AI */}
                <button onClick={() => { setActiveMonitorModal('queue'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <List size={16} className="text-purple-400" /> 
                  <span>Giám sát Hàng đợi</span>
                </button>

                {/* 4. Log sự kiện TikTok */}
                <button onClick={() => { setActiveMonitorModal('tiktok_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 mb-1 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <FileText size={16} className="text-pink-400" /> 
                  <span>Log Sự kiện TikTok</span>
                </button>

                {/* 5. Log hệ thống lỗi (khi có sự cố) */}
                <button onClick={() => { setActiveMonitorModal('sys_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <AlertCircle size={16} className="text-orange-400" /> 
                  <span>Log Hệ thống Lỗi</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSimulator(!showSimulator)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${showSimulator ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}`}>
            <Brain size={16} />
            Công cụ Test
          </button>
          
          <button onClick={() => setIsCommMode(!isCommMode)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${isCommMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`} title="Bật/Tắt Giao tiếp bằng Giọng nói 2 chiều với AI">
            {isCommMode ? <Mic size={16} /> : <MicOff size={16} />}
            Giao tiếp
          </button>
        </div>
        
      </div>

      {/* 3. Main Video Area */}
      <div className={`flex-1 relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-[#0f0f13]' : 'bg-white'}`}>
        
        {renderCharacterContent()}

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

        {/* Cửa sổ Nổi: Công cụ Giả lập Live (Pre-Live Simulator) */}
        {showSimulator && (
          <div className="absolute right-6 top-4 w-[420px] max-h-[90vh] flex flex-col bg-[#16161e] border border-purple-500/40 rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-right-4 overflow-hidden backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-b border-purple-500/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg border border-purple-400/30 text-purple-300">
                  <Brain size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    Công cụ Giả lập Live
                  </h3>
                  <p className="text-[10px] text-purple-200/70">Test phản hồi AI, âm thanh & video trước khi Live</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Nút bật tắt Auto Simulate */}
                <button
                  onClick={() => setAutoSimActive(!autoSimActive)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    autoSimActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 animate-pulse' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                  }`}
                  title="Tự động phát sinh người vào, bình luận, tặng quà mỗi 9s"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${autoSimActive ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                  Auto Test: {autoSimActive ? 'BẬT' : 'TẮT'}
                </button>
                <button onClick={() => setShowSimulator(false)} className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-black/40 border-b border-white/10 p-1 gap-1 text-[11px] font-semibold">
              <button
                onClick={() => setSimTab('quick')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'quick' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Zap size={12} /> Tương tác
              </button>
              <button
                onClick={() => setSimTab('comments')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'comments' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <MessageCircle size={12} /> Bình luận
              </button>
              <button
                onClick={() => setSimTab('orders')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'orders' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ShoppingBag size={12} /> Chốt đơn
              </button>
              <button
                onClick={() => setSimTab('director')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'director' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Mic size={12} /> Đạo diễn
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-3 space-y-3 overflow-y-auto max-h-[300px]">
              {/* TAB 1: TƯƠNG TÁC (Khán giả, Quà, Thả tim, Follow) */}
              {simTab === 'quick' && (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Users size={11} className="text-blue-400" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })}
                        className="py-1.5 px-2 bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-medium transition-all text-center truncate"
                      >
                        👋 Khách mới vào
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })}
                        className="py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-medium transition-all text-center truncate"
                      >
                        ⭐ VIP vào phòng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })}
                        className="py-1.5 px-2 bg-purple-500/10 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-medium transition-all text-center truncate"
                      >
                        ❤️ Fan Cứng vào
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Gift size={11} className="text-pink-400" /> Tặng quà Live:
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Tuấn Anh', gift: 'Hoa hồng 🌹 (1 xu)' })}
                        className="py-1.5 bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        🌹 Hoa hồng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Lan Anh', gift: 'Du thuyền 🛥️' })}
                        className="py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        🛥️ Du thuyền
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia Phố Cổ', gift: 'Tên lửa vũ trụ 🚀' })}
                        className="py-1.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        🚀 Tên lửa
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Chủ Tịch VIP', gift: 'Sư tử hoàng gia 🦁' })}
                        className="py-1.5 bg-orange-500/10 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        🦁 Sư tử VIP
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <Heart size={11} className="text-red-400" /> Tương tác kênh:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '10.000 tim' })}
                        className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        💖 Đạt 10.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('FOLLOW', { name: 'Khánh Vy' })}
                        className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ➕ Follow kênh
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('SHARE', { name: 'Minh Trang' })}
                        className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ↗️ Chia sẻ live
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BÌNH LUẬN */}
              {simTab === 'comments' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bình luận mẫu thường gặp:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Minh Thảo', text: 'Chào idol, hôm nay xinh và dễ thương quá!' })}
                      className="w-full text-left p-2 bg-[#00FF66]/10 hover:bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/20 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>💬 "Chào idol, hôm nay xinh và dễ thương quá!"</span>
                      <span className="text-[9px] bg-[#00FF66]/20 px-1.5 py-0.5 rounded text-white">Khen</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Hải Đăng', text: 'Mẫu này chất liệu gì và còn size L không shop?' })}
                      className="w-full text-left p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>🛒 "Mẫu này chất liệu gì và còn size L không shop?"</span>
                      <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded text-white">Hỏi Size</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Quỳnh Như', text: 'Sản phẩm này giá bao nhiêu và có freeship không ạ?' })}
                      className="w-full text-left p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>💰 "Giá bao nhiêu và có freeship không ạ?"</span>
                      <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded text-white">Hỏi Giá</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Bảo Long', text: 'Mình 1m70 nặng 65kg mặc size nào vừa chuẩn bạn ơi?' })}
                      className="w-full text-left p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>📏 "Mình 1m70 nặng 65kg mặc size nào chuẩn?"</span>
                      <span className="text-[9px] bg-purple-500/20 px-1.5 py-0.5 rounded text-white">Tư Vấn</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CHỐT ĐƠN */}
              {simTab === 'orders' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sự kiện chốt đơn mua hàng:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Hoàng Nam', item: '1 Áo Polo Cao Cấp' })}
                      className="w-full text-left p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>🎉 Khách Hoàng Nam vừa chốt 1 Áo Polo</span>
                      <span className="text-[9px] bg-emerald-500/30 px-1.5 py-0.5 rounded text-white font-bold">1 Đơn</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Thanh Thảo VIP', item: 'Combo 2 Váy Thiết Kế Dạ Hội' })}
                      className="w-full text-left p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>🎁 Khách Thanh Thảo vừa chốt Combo 2 Váy</span>
                      <span className="text-[9px] bg-purple-500/30 px-1.5 py-0.5 rounded text-white font-bold">Combo VIP</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Đoàn Khách Sỉ', item: 'Set 5 Áo Sơ Mi Hàn Quốc' })}
                      className="w-full text-left p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between"
                    >
                      <span>🔥 Khách Sỉ vừa chốt Set 5 Áo Sơ Mi</span>
                      <span className="text-[9px] bg-amber-500/30 px-1.5 py-0.5 rounded text-white font-bold">Đơn Sỉ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ĐẠO DIỄN NHẮC THOẠI */}
              {simTab === 'director' && (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Lệnh nhanh 1-chạm:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc mọi người bấm vào giỏ hàng góc trái đang có ưu đãi lớn!' })}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-[10px] font-medium text-left truncate"
                      >
                        🛒 Giục xem giỏ hàng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc voucher giảm 50k chỉ còn 3 suất duy nhất!' })}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-[10px] font-medium text-left truncate"
                      >
                        🔥 Nhắc mã còn 3 suất
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Cảm ơn toàn thể khán giả đang theo dõi và kêu gọi thả tim!' })}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-[10px] font-medium text-left truncate"
                      >
                        🙏 Cảm ơn khán giả
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Kể một câu chuyện vui hoặc hát một đoạn ngắn giao lưu!' })}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-[10px] font-medium text-left truncate"
                      >
                        🎶 Hát / Kể chuyện vui
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <label className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-1.5">
                      <Mic size={11} className="text-red-400" /> Nhập lệnh Đạo diễn bất kỳ:
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={assistantPrompt}
                        onChange={(e) => setAssistantPrompt(e.target.value)}
                        placeholder="VD: Nhắc idol giới thiệu áo sơ mi trắng..."
                        className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
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
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-600/30 flex items-center gap-1"
                      >
                        <Send size={11} /> Gửi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status processing indicator */}
              {isProcessingEvent && (
                <div className="flex items-center justify-center gap-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 text-[11px] font-semibold animate-pulse">
                  <Sparkles size={12} className="text-purple-400 animate-spin" /> AI đang suy nghĩ & chuẩn bị phản hồi...
                </div>
              )}
            </div>
            
            {/* Lịch sử sự kiện */}
            <div className="border-t border-white/10 bg-black/30 p-3 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <List size={11} /> Lịch sử giả lập ({viewerHistory.length})
                </span>
                {viewerHistory.length > 0 && (
                  <button 
                    onClick={() => setViewerHistory([])}
                    className="text-[9px] text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={10} /> Xoá log
                  </button>
                )}
              </div>
              <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-[10px]">
                {viewerHistory.length === 0 ? (
                  <div className="text-gray-500 text-center py-4 italic text-[11px]">
                    Chưa có sự kiện nào. Hãy bấm một nút ở trên để thử nghiệm!
                  </div>
                ) : (
                  viewerHistory.slice().reverse().map((h, i) => (
                    <div key={i} className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="font-semibold text-white">
                          [{h.time}] {h.payload?.name || 'Hệ thống'}: {h.type === 'COMMENT' ? `"${h.payload.text}"` : h.type === 'GIFT' ? `tặng ${h.payload.gift}` : h.type === 'PURCHASE' ? `đã mua ${h.payload.item}` : h.type === 'LIKE' ? 'thả tim' : h.type === 'FOLLOW' ? 'theo dõi' : h.type === 'ASSISTANT_PROMPT' ? `[Lệnh Đạo diễn]: ${h.payload.prompt}` : 'vào phòng live'}
                        </span>
                      </div>
                      {h.ai_reply && (
                        <div className="text-[#00FF66] pl-2 border-l-2 border-[#00FF66]/40 leading-relaxed font-medium">
                          ↳ AI: {h.ai_reply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
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

      {/* Payment & Token Packages Modal */}
      {(activeSettingsModal === 'payment' || activeSettingsModal === 'coins') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#0f0f1a] border border-gray-800 relative">
            <button 
              onClick={() => setActiveSettingsModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex-1 overflow-y-auto">
              <ThanhToanCoin 
                initialTab={activeSettingsModal === 'coins' ? 'tokens' : 'subscription'} 
                onClose={() => setActiveSettingsModal(null)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Token History Modal */}
      {showTokenHistory && (
        <TokenHistoryModal 
          onClose={() => setShowTokenHistory(false)} 
          onOpenPayment={() => setActiveSettingsModal('coins')}
        />
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

      {/* Modal Phản hồi Nhanh Trực Tiếp Trên Live */}
      <QuickResponseModal 
        isOpen={activeMonitorModal === 'quick_response'}
        onClose={() => setActiveMonitorModal(null)}
        isDarkMode={isDarkMode}
        isConnected={isConnected || showSimulator}
        audioPlayerRef={audioPlayerRef}
        handleLiveEvent={handleLiveEvent}
        onPlayLiveVideo={(videoData) => {
          setQuickResponseActiveVideo(videoData);
        }}
        onStopLiveVideo={() => {
          setQuickResponseActiveVideo(null);
        }}
        activeQuickVideo={quickResponseActiveVideo}
        showToast={showToast}
        addViewerHistory={(item) => {
          if (setViewerHistory) {
            setViewerHistory(prev => [...prev, item].slice(-10));
          }
        }}
      />

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

      {/* Template Library Modal */}
      <TemplateLibraryModal 
        isOpen={isTemplateLibraryOpen}
        onClose={() => setIsTemplateLibraryOpen(false)}
        onAddTemplate={(newChar) => {
          setCustomCharacters(prev => [...prev, newChar]);
          setSelectedCharacter(newChar.id);
        }}
      />

      {/* Game Chiến Đấu Admin Control Modal */}
      <GameChienDauAdminModal
        isOpen={isGameAdminOpen}
        onClose={() => setIsGameAdminOpen(false)}
        onTriggerRefereeAction={(action) => {
          const names = ['Hoàng Long', 'Bảo Trâm', 'Tuấn Kiệt', 'Minh Quân', 'Khánh Linh', 'Hồng Hạnh', 'Trần Mai', 'Gia Bảo', 'Phương Thảo', 'Quang Huy', 'Thành Đạt', 'Ngọc Ánh'];
          const randName = names[Math.floor(Math.random() * names.length)];
          const t = Date.now() + Math.random();

          if (action === 'RESET_MATCH') {
            setLastGameEvent({ type: 'ADMIN_RESET', data: {}, timestamp: t });
          } else if (action === 'ADD_BLUE_20') {
            setLastGameEvent({ type: 'COMMENT', data: { nickname: randName, comment: 'xanh', score: 20 }, timestamp: t });
          } else if (action === 'ADD_RED_20') {
            setLastGameEvent({ type: 'COMMENT', data: { nickname: randName, comment: 'đỏ', score: 20 }, timestamp: t });
          } else if (action === 'TRIGGER_VAN_KIEM_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_VAN_KIEM', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_VAN_KIEM_RED') {
            setLastGameEvent({ type: 'TRIGGER_VAN_KIEM', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_GIANG_LONG_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_GIANG_LONG', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_GIANG_LONG_RED') {
            setLastGameEvent({ type: 'TRIGGER_GIANG_LONG', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_THAI_CUC_BLUE') {
            setLastGameEvent({ type: 'TRIGGER_THAI_CUC', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_THAI_CUC_RED') {
            setLastGameEvent({ type: 'TRIGGER_THAI_CUC', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TEST_TIER_1_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 1 }, timestamp: t });
          } else if (action === 'TEST_TIER_1_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 1 }, timestamp: t });
          } else if (action === 'TEST_TIER_2_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 2 }, timestamp: t });
          } else if (action === 'TEST_TIER_2_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 2 }, timestamp: t });
          } else if (action === 'TEST_TIER_3_BLUE' || action === 'UPGRADE_HERO_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 3 }, timestamp: t });
          } else if (action === 'TEST_TIER_3_RED' || action === 'UPGRADE_HERO_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 3 }, timestamp: t });
          } else if (action === 'TEST_TIER_4_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 4 }, timestamp: t });
          } else if (action === 'TEST_TIER_4_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 4 }, timestamp: t });
          } else if (action === 'TEST_TIER_5_BLUE') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'blue', tier: 5 }, timestamp: t });
          } else if (action === 'TEST_TIER_5_RED') {
            setLastGameEvent({ type: 'UPGRADE_HERO', data: { nickname: randName, faction: 'red', tier: 5 }, timestamp: t });
          } else if (action === 'TRIGGER_AOE_BLUE') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 300, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_AOE_RED') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 300, faction: 'red' }, timestamp: t });
          } else if (action === 'SUMMON_BOSS_BLUE') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 1500, faction: 'blue' }, timestamp: t });
          } else if (action === 'SUMMON_BOSS_RED') {
            setLastGameEvent({ type: 'GIFT', data: { nickname: randName, diamondCount: 1500, faction: 'red' }, timestamp: t });
          } else if (action === 'TRIGGER_DANCE_BLUE') {
            setLastGameEvent({ type: 'DANCE', data: { nickname: randName, faction: 'blue' }, timestamp: t });
          } else if (action === 'TRIGGER_DANCE_RED') {
            setLastGameEvent({ type: 'DANCE', data: { nickname: randName, faction: 'red' }, timestamp: t });
          } else if (action === 'TOGGLE_PAUSE') {
            setLastGameEvent({ type: 'PAUSE_TOGGLE', data: {}, timestamp: t });
          } else if (action === 'FINISH_MATCH_BLUE') {
            setLastGameEvent({ type: 'FORCE_WIN', data: { faction: 'blue' }, timestamp: t });
          } else if (action === 'FINISH_MATCH_RED') {
            setLastGameEvent({ type: 'FORCE_WIN', data: { faction: 'red' }, timestamp: t });
          }
        }}
      />

      {/* Game Ghép Cờ Bản Đồ Admin Control Modal */}
      <GameBanDoAdminModal
        isOpen={isGameBanDoAdminOpen}
        onClose={() => setIsGameBanDoAdminOpen(false)}
      />

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
