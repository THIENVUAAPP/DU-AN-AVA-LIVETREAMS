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
          isDarkMode={isDarkMode}
        />
      );
    }

    // -2. Chế độ Game Đất Nước Bản Đồ Hình Chữ S (Việt Nam Ghép Cờ LIVE)
    if (isGameBanDoActive) {
      return (
        <GameBanDoVietNam 
          isPopout={false}
          onOpenAdmin={() => setIsGameBanDoAdminOpen(true)}
          externalLiveEvent={lastGameEvent}
          aspectRatio={globalAspectRatio}
          onToggleAspectRatio={toggleGlobalAspectRatio}
          isDarkMode={isDarkMode}
        />
      );
    }

    // 0. Chế độ AI Idol Livestream Video / Live Screen
    return (
      <div className={`w-full h-full flex items-center justify-center p-2 sm:p-3 overflow-hidden ${isDarkMode ? 'bg-[#05070c]' : 'bg-slate-200'}`}>
        <div 
          className={`relative flex flex-col overflow-hidden transition-all duration-300 ${
            globalAspectRatio === '9:16'
              ? 'h-full max-h-full aspect-[9/16] w-auto max-w-full mx-auto rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
              : 'w-full max-w-[1200px] h-auto max-h-full aspect-[16/9] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.85)] bg-black'
          }`}
        >
          {renderAiIdolLiveStage()}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-[#0f0f13] text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* 1. Fake Window Title Bar (Thu nhỏ ~30% cực kỳ thanh thoát) */}
      <div className={`flex items-center justify-between px-3 py-1.5 ${isDarkMode ? 'bg-[#1c1c23] border-gray-800 text-white' : 'bg-slate-200 border-slate-300 text-slate-800'} select-none z-30 border-b`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
            <Video size={10} className="text-white" />
          </div>
          <span className="text-xs font-semibold">Livestream AI (Clone) - Profile: {CHARACTERS[selectedCharacter]?.name || 'Không xác định'}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {/* Nút Chế độ Live AI Idol */}
          <button 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              !isGameBattleActive && !isGameBanDoActive 
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white border-cyan-300 shadow-cyan-500/40 ring-2 ring-cyan-400/50' 
                : (isDarkMode ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50' : 'border-cyan-300 bg-cyan-50 text-cyan-700 hover:bg-cyan-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(false);
              setIsGameBanDoActive(false);
            }}
            title="Chuyển sang màn hình Livestream AI Idol"
          >
            <Video size={12} className={!isGameBattleActive && !isGameBanDoActive ? 'text-yellow-300' : 'text-cyan-400'} />
            <span>Live AI Idol</span>
            {!isGameBattleActive && !isGameBanDoActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Kích hoạt Game Chiến Đấu */}
          <button 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              isGameBattleActive 
                ? 'bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white border-purple-400 shadow-purple-500/40 ring-2 ring-purple-400/50 animate-pulse' 
                : (isDarkMode ? 'border-indigo-500/50 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60' : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100')
            }`}
            onClick={() => {
              setIsGameBattleActive(true);
              setIsGameBanDoActive(false);
            }}
            title="Chuyển sang chế độ Game Chiến Đấu (TikTok LIVE Battle Game) trên màn hình chính"
          >
            <Swords size={12} className={isGameBattleActive ? 'text-yellow-300' : 'text-indigo-400'} />
            <span>Game Chiến Đấu</span>
            {isGameBattleActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Cài đặt Game Chiến Đấu - Nằm KẾ BÊN Game Chiến Đấu khi đang mở */}
          {isGameBattleActive && (
            <button
              onClick={() => setIsGameAdminOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-900/90 to-indigo-900/90 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white border border-purple-400/80 shadow-md transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Chiến Đấu"
            >
              <Settings size={12} className="text-yellow-300" />
              <span>Game</span>
            </button>
          )}

          {/* Nút Kích hoạt Game Ghép Cờ Bản Đồ Việt Nam (Hình Chữ S) */}
          <button 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border shadow-sm ${
              isGameBanDoActive 
                ? 'bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 text-white border-yellow-300 shadow-yellow-500/40 ring-2 ring-yellow-400/50 animate-pulse' 
                : (isDarkMode ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60' : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100')
            }`}
            onClick={() => {
              setIsGameBanDoActive(true);
              setIsGameBattleActive(false);
            }}
            title="Chuyển sang Game Ghép Cờ Bản Đồ Việt Nam (Đất Nước Hình Chữ S) trên màn hình chính"
          >
            <Flag size={12} className={isGameBanDoActive ? 'text-yellow-200' : 'text-amber-400'} />
            <span>Bản Đồ Chữ S</span>
            {isGameBanDoActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>

          {/* Nút Cài đặt Game Bản Đồ - Nằm KẾ BÊN Game Bản Đồ khi đang mở */}
          {isGameBanDoActive && (
            <button
              onClick={() => setIsGameBanDoAdminOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-900/90 to-red-900/90 hover:from-amber-800 hover:to-red-800 text-amber-200 hover:text-white border border-amber-400/80 shadow-md transition-all animate-in fade-in duration-200"
              title="Cài đặt Game Bản Đồ"
            >
              <Settings size={12} className="text-yellow-300" />
              <span>Game</span>
            </button>
          )}

          {/* 1 Nút Chuyển Tỷ Lệ Khung Hình Toàn Cục DUY NHẤT CHO TOÀN BỘ HỆ THỐNG: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}
          <button
            onClick={toggleGlobalAspectRatio}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all border shadow-sm ${
              globalAspectRatio === '9:16'
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white border-pink-300 ring-2 ring-pink-400/50 shadow-pink-500/30'
                : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-cyan-300 border-white/10' : 'bg-gray-200 hover:bg-gray-300 text-slate-800 border-gray-300')
            }`}
            title={globalAspectRatio === '9:16' ? "Đang ở Khung Hình 9:16 (Chuẩn TikTok Live Dọc) — Bấm chuyển sang 16:9 (Ngang OBS/PC)" : "Đang ở Khung Hình 16:9 (Ngang OBS/PC) — Bấm chuyển sang 9:16 (Chuẩn TikTok Live Dọc)"}
          >
            <Smartphone size={12} className={globalAspectRatio === '9:16' ? 'text-yellow-300' : 'text-cyan-300'} />
            <span>{globalAspectRatio === '9:16' ? '9:16 TikTok' : '16:9 OBS'}</span>
          </button>

          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-1 rounded transition-colors ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-400 text-gray-800 hover:bg-gray-500'}`}>
            {isDarkMode ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Token Widget */}
          <button
            onClick={() => setShowTokenHistory(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              balance === 0
                ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                : balance < TOKEN_RATES.LOW_BALANCE_WARN
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="Xem lịch sử Token"
          >
            {balance < TOKEN_RATES.LOW_BALANCE_WARN && <AlertTriangle size={12} />}
            <Coins size={12} />
            <span>{balance.toLocaleString()}</span>
          </button>

          <button className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isDarkMode ? 'bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc]/30' : 'bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20'}`}>
            <MessageCircle size={13} />
            <span>Zalo</span>
          </button>

          <button onClick={() => setActiveSettingsModal('payment')} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-500/10 text-green-700 hover:bg-green-500/20'}`}>
            <CreditCard size={13} />
            <span>Thanh toán</span>
          </button>

          {/* Nút Tải phần mềm (ZIP) */}
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-xs rounded shadow-sm flex items-center gap-1 transition-colors"
          >
            <Download size={12} />
            <span>Tải ZIP</span>
          </button>
        </div>
      </div>

      {/* 2. Top Control Bar (Thu nhỏ ~30% để không gian live to rộng) */}
      <div className={`flex items-center gap-2 px-3 py-1.5 ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-200'} border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-300'} z-40 shadow-sm overflow-visible whitespace-nowrap`}>
        
        {/* Left Side: Settings & Payment */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <Settings size={13} />
              <span>MENU ▼</span>
            </button>
            
            {isSettingsDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button 
                  onClick={() => { setActiveSettingsModal('general'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 mb-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 hover:from-blue-600 hover:to-blue-500 text-blue-100 hover:text-white border border-blue-800/50' : 'bg-blue-50 hover:bg-blue-500 text-blue-800 hover:text-white'}`}
                >
                  <Brain size={16} />
                  <span>BỘ NÃO AI</span>
                </button>
                <button 
                  onClick={() => { setActiveSettingsModal('workspace'); setIsSettingsDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 ${isDarkMode ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/20 hover:from-purple-600 hover:to-purple-500 text-purple-100 hover:text-white border border-purple-800/50' : 'bg-purple-50 hover:bg-purple-500 text-purple-800 hover:text-white'}`}
                >
                  <Radio size={16} />
                  <span>KẾT NỐI IDOL</span>
                </button>
              </div>
            )}
          </div>

          {/* Nút Studio đặt cạnh MENU */}
          <button onClick={toggleWebcam} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isWebcamActive ? 'bg-pink-600 text-white hover:bg-pink-500' : isDarkMode ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'}`}>
            <Video size={13} />
            <span>Studio</span>
          </button>
        </div>

        <div className="flex-1"></div>

        {/* Middle: Controls */}
        <div className="flex items-center justify-center gap-2 shrink-0">
          
          <div className="flex items-center gap-1.5 border-r border-gray-500/30 pr-2">
            <span className="text-xs font-medium text-gray-400">Nhân vật:</span>
            <div className="flex gap-1.5">
              {Object.keys(CHARACTERS).map((charId) => (
                CHARACTERS[charId] ? (
                  <div 
                    key={charId}
                    onClick={() => {
                      setSelectedCharacter(charId);
                      setIsGameBattleActive(false);
                      setIsGameBanDoActive(false);
                    }}
                    className={`w-7 h-7 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 relative group ${selectedCharacter === charId ? 'border-2 border-blue-500 shadow-md shadow-blue-500/30' : 'border border-gray-600 opacity-60 hover:opacity-100'}`}
                    title={CHARACTERS[charId]?.name || ''}
                  >
                    {CHARACTERS[charId]?.type === 'video' ? (
                      <video src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={CHARACTERS[charId]?.url} className="w-full h-full object-cover" alt={CHARACTERS[charId]?.name || ''} />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (charId.startsWith('custom_')) {
                          removeCustomCharacter(e, charId);
                        } else {
                          const allKeys = Object.keys(CHARACTERS);
                          const remaining = allKeys.filter(k => k !== charId);
                          if (remaining.length > 0) setSelectedCharacter(remaining[0]);
                          setHiddenBuiltins(prev => [...(prev || []), charId]);
                        }
                      }}
                      className="absolute top-0 right-0 p-0.5 bg-red-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-150 rounded-bl"
                      title={`Xoá ${CHARACTERS[charId]?.name || ''}`}
                    >
                      <X size={8} />
                    </button>
                  </div>
                ) : null
              ))}
              <button className="w-7 h-7 rounded border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors hover:bg-gray-700/50 shrink-0" onClick={() => fileInputRef.current?.click()}>
                <Plus size={13} />
              </button>
              <button 
                className={`px-2 py-1 rounded text-xs font-medium transition-colors border ${isDarkMode ? 'border-purple-500/50 bg-purple-900/30 text-purple-300 hover:bg-purple-800/50' : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                onClick={() => setIsTemplateLibraryOpen(true)}
              >
                Mẫu
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="video/*,image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1 shrink-0">
            <input type="text" value={tiktokId} onChange={(e) => setTiktokId(e.target.value)} className={`w-28 px-2 py-1 rounded text-xs outline-none border ${isDarkMode ? 'bg-[#2a2a35] border-gray-700 text-white focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'}`} placeholder="ID TikTok..." />
            <button onClick={handleConnect} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {isConnecting ? <span className="animate-spin text-sm leading-none">↻</span> : (isConnected ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />)}
              <span>{isConnecting ? 'Đang xử lý...' : (isConnected ? 'Dừng AI' : 'Kết nối')}</span>
            </button>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Right Side: Toggles & Stream Window */}
        <div className="flex items-center gap-1.5 shrink-0">
          

          {/* 1 Nút Chạy Demo DUY NHẤT dùng chung */}
          <button 
            onClick={handleGlobalRunDemo}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all border shadow-md active:scale-95 ${
              isGlobalDemoRunning
                ? 'bg-red-600 text-white border-yellow-300 ring-2 ring-yellow-400 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-400/40 shadow-emerald-500/20'
            }`}
            title="Chạy Demo / Kiểm thử tự động quà tặng & tương tác"
          >
            <Zap size={13} className={isGlobalDemoRunning ? 'text-yellow-300 animate-bounce' : 'text-yellow-300'} />
            <span>{isGlobalDemoRunning ? 'Dừng Demo' : 'Chạy Demo'}</span>
          </button>

          {/* Menu Theo dõi */}
          <div className="relative">
            <button 
              onClick={() => setIsMonitorDropdownOpen(!isMonitorDropdownOpen)} 
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isMonitorDropdownOpen ? 'bg-orange-600 text-white' : (isDarkMode ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-700 hover:bg-orange-200')}`}>
              <Eye size={13} />
              <span>Theo dõi ▼</span>
            </button>
            {isMonitorDropdownOpen && (
              <div className={`absolute top-full right-0 mt-2 w-56 rounded-xl shadow-2xl border z-50 p-2 overflow-hidden ${isDarkMode ? 'bg-[#1c1c23] border-gray-700' : 'bg-white border-gray-200'} animate-in fade-in slide-in-from-top-2 duration-200`}>
                <button onClick={() => { setActiveMonitorModal('quick_response'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-bold transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-yellow-500/20 text-yellow-400' : 'hover:bg-yellow-100 text-yellow-800'}`}>
                  <Zap size={13} className="text-yellow-500" /> 
                  <span>Phản hồi Nhanh</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('timeline'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <Clock size={13} className="text-blue-400" /> 
                  <span>Dòng thời gian</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('queue'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <List size={13} className="text-purple-400" /> 
                  <span>Hàng đợi AI</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('tiktok_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 mb-1 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <FileText size={13} className="text-pink-400" /> 
                  <span>Log TikTok</span>
                </button>
                <button onClick={() => { setActiveMonitorModal('sys_log'); setIsMonitorDropdownOpen(false); }} className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
                  <AlertCircle size={13} className="text-orange-400" /> 
                  <span>Log Lỗi</span>
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowSimulator(!showSimulator)} 
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${showSimulator ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200')}`}>
            <Brain size={13} />
            <span>Công cụ Test</span>
          </button>
          
          <button onClick={() => setIsCommMode(!isCommMode)} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isCommMode ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`} title="Bật/Tắt Giao tiếp bằng Giọng nói 2 chiều với AI">
            {isCommMode ? <Mic size={13} /> : <MicOff size={13} />}
            <span>Giao tiếp</span>
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
          <div className={`absolute right-6 top-4 w-[420px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-right-4 overflow-hidden backdrop-blur-md border ${
            isDarkMode ? 'bg-[#16161e] border-purple-500/40 text-white' : 'bg-white border-purple-300 text-slate-800'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              isDarkMode ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-purple-500/30 text-white' : 'bg-purple-50 border-purple-200 text-purple-900'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${isDarkMode ? 'bg-purple-500/20 border-purple-400/30 text-purple-300' : 'bg-purple-100 border-purple-300 text-purple-700'}`}>
                  <Brain size={16} />
                </div>
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-purple-950'}`}>
                    Công cụ Giả lập Live
                  </h3>
                  <p className={`text-[10px] ${isDarkMode ? 'text-purple-200/70' : 'text-purple-700/80'}`}>Test phản hồi AI, âm thanh & video trước khi Live</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Nút bật tắt Auto Simulate */}
                <button
                  onClick={() => setAutoSimActive(!autoSimActive)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
                    autoSimActive 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20 animate-pulse' 
                      : (isDarkMode ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200')
                  }`}
                  title="Tự động phát sinh người vào, bình luận, tặng quà mỗi 9s"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${autoSimActive ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                  Auto Test: {autoSimActive ? 'BẬT' : 'TẮT'}
                </button>
                <button onClick={() => setShowSimulator(false)} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`flex border-b p-1 gap-1 text-[11px] font-semibold ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setSimTab('quick')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'quick' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <Zap size={12} /> Tương tác
              </button>
              <button
                onClick={() => setSimTab('comments')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'comments' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <MessageCircle size={12} /> Bình luận
              </button>
              <button
                onClick={() => setSimTab('orders')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'orders' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                }`}
              >
                <ShoppingBag size={12} /> Chốt đơn
              </button>
              <button
                onClick={() => setSimTab('director')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1 ${
                  simTab === 'director' ? 'bg-purple-600 text-white shadow-md' : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
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
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Users size={11} className="text-blue-500" /> Khán giả vào phòng:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Thanh Nhàn' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/25 text-blue-300 border-blue-500/30' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'}`}
                      >
                        👋 Khách mới vào
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Vip_HoàngNam 👑' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'}`}
                      >
                        ⭐ VIP vào phòng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('VIEWER_JOIN', { name: 'Bảo Trâm ❤️' })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all text-center truncate border ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/25 text-pink-300 border-pink-500/30' : 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200'}`}
                      >
                        ❤️ Fan cứng vào
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Gift size={11} className="text-amber-500" /> Tặng quà TikTok:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Anh Tuấn', gift: 'Hoa Hồng', count: 1 })}
                        className={`py-1.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-500 border border-amber-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        🌹 Hoa Hồng (1 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Hoàng Long VIP', gift: 'Nước Hoa Thiết Giáp', count: 50 })}
                        className={`py-1.5 bg-purple-500/10 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        🛡️ Thiết Giáp (50 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Đại Gia Phố Núi', gift: 'Vương Miện Hoàng Kim', count: 200 })}
                        className={`py-1.5 bg-yellow-500/10 hover:bg-yellow-500/25 text-yellow-500 border border-yellow-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        👑 Thần Tướng (200 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Thần Kiếm', gift: 'Kiếm Sấm Sét', count: 500 })}
                        className={`py-1.5 bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate`}
                      >
                        ⚔️ Vạn Kiếm (500 xu)
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('GIFT', { name: 'Chủ Tịch Tập Đoàn', gift: 'Thần Long Vũ Trụ', count: 1000 })}
                        className={`col-span-2 py-1.5 bg-red-500/15 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-lg text-[10px] font-bold transition-all text-center truncate`}
                      >
                        🐉 Giáng Long Chưởng (1000 xu)
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      <Heart size={11} className="text-red-500" /> Tương tác kênh:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('LIKE', { count: '10.000 tim' })}
                        className="py-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        💖 Đạt 10.000 Tim
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('FOLLOW', { name: 'Khánh Vy' })}
                        className="py-1.5 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
                      >
                        ➕ Follow kênh
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('SHARE', { name: 'Minh Trang' })}
                        className="py-1.5 bg-violet-500/10 hover:bg-violet-500/25 text-violet-500 border border-violet-500/30 rounded-lg text-[10px] font-medium transition-all text-center truncate"
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
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Bình luận mẫu thường gặp:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Minh Thảo', text: 'Chào idol, hôm nay xinh và dễ thương quá!' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                    >
                      <span>💬 "Chào idol, hôm nay xinh và dễ thương quá!"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>Khen</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Hải Đăng', text: 'Mẫu này chất liệu gì và còn size L không shop?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/20' : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'}`}
                    >
                      <span>🛒 "Mẫu này chất liệu gì và còn size L không shop?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-blue-500/20 text-white' : 'bg-blue-200 text-blue-900'}`}>Hỏi Size</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Quỳnh Như', text: 'Sản phẩm này giá bao nhiêu và có freeship không ạ?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
                    >
                      <span>💰 "Giá bao nhiêu và có freeship không ạ?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/20 text-white' : 'bg-amber-200 text-amber-900'}`}>Hỏi Giá</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('COMMENT', { name: 'Bảo Long', text: 'Mình 1m70 nặng 65kg mặc size nào vừa chuẩn bạn ơi?' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}
                    >
                      <span>📏 "Mình 1m70 nặng 65kg mặc size nào chuẩn?"</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/20 text-white' : 'bg-purple-200 text-purple-900'}`}>Tư Vấn</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CHỐT ĐƠN */}
              {simTab === 'orders' && (
                <div className="space-y-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Sự kiện chốt đơn mua hàng:</span>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Hoàng Nam', item: '1 Áo Polo Cao Cấp' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'}`}
                    >
                      <span>🎉 Khách Hoàng Nam vừa chốt 1 Áo Polo</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-emerald-500/30 text-white' : 'bg-emerald-200 text-emerald-900'}`}>1 Đơn</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Thanh Thảo VIP', item: 'Combo 2 Váy Thiết Kế Dạ Hội' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200'}`}
                    >
                      <span>🎁 Khách Thanh Thảo vừa chốt Combo 2 Váy</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-purple-500/30 text-white' : 'bg-purple-200 text-purple-900'}`}>Combo VIP</span>
                    </button>
                    <button 
                      onClick={() => handleLiveEvent('PURCHASE', { name: 'Đoàn Khách Sỉ', item: 'Set 5 Áo Sơ Mi Hàn Quốc' })}
                      className={`w-full text-left p-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between border ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'}`}
                    >
                      <span>🔥 Khách Sỉ vừa chốt Set 5 Áo Sơ Mi</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isDarkMode ? 'bg-amber-500/30 text-white' : 'bg-amber-200 text-amber-900'}`}>Đơn Sỉ</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: ĐẠO DIỄN NHẮC THOẠI */}
              {simTab === 'director' && (
                <div className="space-y-2.5">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Lệnh nhanh 1-chạm:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc mọi người bấm vào giỏ hàng góc trái đang có ưu đãi lớn!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🛒 Giục xem giỏ hàng
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Nhắc voucher giảm 50k chỉ còn 3 suất duy nhất!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🔥 Nhắc mã còn 3 suất
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Cảm ơn toàn thể khán giả đang theo dõi và kêu gọi thả tim!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🙏 Cảm ơn khán giả
                      </button>
                      <button 
                        onClick={() => handleLiveEvent('ASSISTANT_PROMPT', { prompt: 'Kể một câu chuyện vui hoặc hát một đoạn ngắn giao lưu!' })}
                        className={`p-1.5 rounded-lg text-[10px] font-medium text-left truncate border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'}`}
                      >
                        🎶 Hát / Kể chuyện vui
                      </button>
                    </div>
                  </div>

                  <div className={`pt-2 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <label className={`text-[10px] font-medium flex items-center gap-1 mb-1.5 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      <Mic size={11} className="text-red-500" /> Nhập lệnh Đạo diễn bất kỳ:
                    </label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={assistantPrompt}
                        onChange={(e) => setAssistantPrompt(e.target.value)}
                        placeholder="VD: Nhắc idol giới thiệu áo sơ mi trắng..."
                        className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs outline-none border ${isDarkMode ? 'bg-black/50 border-gray-700 text-white placeholder-gray-500 focus:border-red-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500'}`}
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
                <div className="flex items-center justify-center gap-2 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-500 text-[11px] font-semibold animate-pulse">
                  <Sparkles size={12} className="text-purple-500 animate-spin" /> AI đang suy nghĩ & chuẩn bị phản hồi...
                </div>
              )}
            </div>
            
            {/* Lịch sử sự kiện */}
            <div className={`border-t p-3 flex flex-col ${isDarkMode ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  <List size={11} /> Lịch sử giả lập ({viewerHistory.length})
                </span>
                {viewerHistory.length > 0 && (
                  <button 
                    onClick={() => setViewerHistory([])}
                    className="text-[9px] text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 size={10} /> Xoá log
                  </button>
                )}
              </div>
              <div className="h-28 overflow-y-auto space-y-1.5 pr-1 text-[10px]">
                {viewerHistory.length === 0 ? (
                  <div className="text-gray-400 text-center py-4 italic text-[11px]">
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
          <div className={`rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Dòng thời gian Sự kiện & Phản ứng</h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              <table className="w-full text-sm text-left">
                <thead className={`font-semibold border-b sticky top-0 ${isDarkMode ? 'bg-[#252532] text-gray-300 border-gray-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <tr>
                    <th className="px-4 py-2 w-32 text-center text-red-400">Thời gian</th>
                    <th className="px-4 py-2 w-48 text-red-400">Tên Sự kiện</th>
                    <th className="px-4 py-2 w-1/3 text-red-400">Nội dung Sự kiện</th>
                    <th className="px-4 py-2 text-red-400">Phản ứng của AI</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800 text-gray-300' : 'divide-slate-200 text-slate-700'}`}>
                  {viewerHistory.slice().reverse().map((h, i) => (
                    <tr key={i} className={isDarkMode ? 'hover:bg-white/5 transition-colors' : 'hover:bg-blue-50 transition-colors'}>
                      <td className="px-4 py-2 text-center opacity-70">{h.time}</td>
                      <td className="px-4 py-2 font-medium">{h.type === 'COMMENT' ? 'Bình luận' : h.type === 'GIFT' ? 'Tặng quà' : 'Vào phòng'}</td>
                      <td className="px-4 py-2">{h.type === 'COMMENT' ? h.payload.text : h.type === 'GIFT' ? h.payload.gift : h.payload.name}</td>
                      <td className="px-4 py-2 text-emerald-500 font-medium">{h.ai_reply || ''}</td>
                    </tr>
                  ))}
                  {viewerHistory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">Chưa có sự kiện nào trong phiên live này.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={`px-4 py-2.5 border-t flex justify-center ${isDarkMode ? 'bg-[#252532] border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
              <button onClick={exportTimelineCSV} className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}>
                <Download size={14} className="text-purple-500" /> Xuất ra file CSV...
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
          <div className={`rounded-xl shadow-2xl w-[600px] h-[400px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <List size={16} className="text-blue-500" /> Giám sát Hàng đợi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              <h3 className="text-xs font-semibold opacity-60 mb-3 uppercase">Đang xử lý / Chờ AI</h3>
              {isProcessingEvent ? (
                <div className={`p-3 border rounded-lg flex items-center gap-3 animate-pulse ${isDarkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold text-blue-500">Sự kiện gần nhất</div>
                    <div className="text-xs text-blue-400">Đang sinh phản hồi AI...</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Hàng đợi đang trống.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'sys_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-[800px] h-[500px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" /> Log Hệ thống Lỗi
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 text-sm ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              {systemLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Hệ thống đang hoạt động ổn định. Chưa ghi nhận lỗi nào.</div>
              ) : (
                systemLogs.map((log, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <span className="opacity-70 text-xs font-mono">[{log.time}]</span> <span className="font-bold text-red-500">ERROR:</span> <span className="text-red-400">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeMonitorModal === 'tiktok_log' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className={`rounded-xl shadow-2xl w-[800px] h-[500px] flex flex-col border ${isDarkMode ? 'bg-[#1c1c24] text-white border-gray-700' : 'bg-white text-slate-800 border-slate-300'}`}>
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${isDarkMode ? 'border-gray-700 bg-[#252532]' : 'border-slate-200 bg-slate-100'}`}>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <FileText size={16} className="text-pink-500" /> Log Sự kiện TikTok
              </h2>
              <button onClick={() => setActiveMonitorModal(null)} className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-gray-600'}`}><X size={16} /></button>
            </div>
            <div className={`flex-1 overflow-auto p-4 text-sm ${isDarkMode ? 'bg-[#16161e]' : 'bg-white'}`}>
              {tiktokLogs.length === 0 ? (
                <div className="text-gray-500 italic flex items-center justify-center h-full">Đang chờ sự kiện thô từ TikTok...</div>
              ) : (
                tiktokLogs.map((log, idx) => (
                  <div key={idx} className={`mb-3 border rounded-lg p-2.5 ${isDarkMode ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="text-blue-500 font-bold mb-1 border-b border-gray-500/20 pb-1">[{log.time}] {log.type}</div>
                    <pre className="opacity-80 overflow-x-auto font-mono text-xs">{JSON.stringify(log.payload, null, 2)}</pre>
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
