import {
  Settings, Eye, Play, Square, RefreshCw, Download, Upload, Trash2,
  Video, Mic2, Volume2, Wifi, WifiOff, Radio, CheckCircle, AlertCircle,
  Plus, Search, X, ChevronDown, Monitor, Zap, SkipForward, Pause,
  Sliders, Globe, Sparkles, Bot, VolumeX, Edit3, Check, MonitorPlay, StopCircle
} from 'lucide-react';
import AIAudioPlayer from './AIAudioPlayer';
import WorkspaceTacVu from './WorkspaceTacVu';
import {
  LIVE_CATEGORIES, initLiveDB, addLiveMedia, getAllLiveMedia, deleteLiveMedia, importFromAIDOLDB
} from '../../lib/liveKhoDB';
import {
  ALL_SYSTEM_VOICES, previewVoiceAudio, stopVoiceAudio, getSavedVoiceConfig, saveVoiceConfig
} from '../../utils/voiceSyncService';
import { askGeminiLiveAi } from '../../lib/geminiClient';
import { COUNTRY_FILTERS } from './game/GameVoiceConfigPanel';
import { DEFAULT_BRAIN_PACKS } from '../../utils/defaultPresetsBootstrap';
import { syncMasterLiveState } from '../../lib/masterLiveSync';

// ──────────────────────────────────────────────
// AIDOL_DB (dùng lại kho AIDOL của tôi)
// ──────────────────────────────────────────────
const AIDOL_DB_NAME = 'AIDOL_DB';
const AIDOL_STORE = 'library_items';
const initAIDOLDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open(AIDOL_DB_NAME, 1);
  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(AIDOL_STORE)) db.createObjectStore(AIDOL_STORE, { keyPath: 'id' });
  };
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});
const getAllAIDOL = async () => {
  const db = await initAIDOLDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(AIDOL_STORE, 'readonly').objectStore(AIDOL_STORE).getAll();
    req.onsuccess = () => {
      resolve(req.result.map(i => ({ ...i, mediaUrl: i.fileBlob ? URL.createObjectURL(i.fileBlob) : i.mediaUrl })));
    };
    req.onerror = () => reject(req.error);
  });
};

// ──────────────────────────────────────────────
// SAVED JOBS từ localStorage
// ──────────────────────────────────────────────
const getSavedJobs = () => {
  const jobs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('aidol_')) {
      try { jobs.push({ key, ...JSON.parse(localStorage.getItem(key)) }); } catch(e) {}
    }
  }
  return jobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

export default function AIDOLLiveConsole() {
  const [activeSource, setActiveSource] = useState('tiktok');
  const [activeTab, setActiveTab] = useState('kho');
  const [isAILive, setIsAILive] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // ── Live Kho state ──
  const [liveMedia, setLiveMedia] = useState([]);
  const [khoLoaded, setKhoLoaded] = useState(false);
  const [activeKhoCat, setActiveKhoCat] = useState('story');
  const [uploadingCat, setUploadingCat] = useState(null);
  const uploadRefs = useRef({});
  LIVE_CATEGORIES.forEach(c => { if (!uploadRefs.current[c.id]) uploadRefs.current[c.id] = React.createRef(); });

  // ── Import from AIDOL ──
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTargetCat, setImportTargetCat] = useState('story');
  const [aidolItems, setAidolItems] = useState([]);

  // ── Saved Jobs state ──
  const [savedJobs, setSavedJobs] = useState([]);

  // ── Live Stream state ──
  const [rtmpKey, setRtmpKey] = useState(() => {
    try {
      return localStorage.getItem('aidol_rtmp_key') || '';
    } catch (e) {
      return '';
    }
  });
  const [streamStatus, setStreamStatus] = useState('idle'); // idle | connecting | live | error
  const videoRef = useRef(null);
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [activeJobItem, setActiveJobItem] = useState(null);
  const [videoQueue, setVideoQueue] = useState([]);

  // ── Restream / Screen Record State ──
  const [restreamUrl, setRestreamUrl] = useState('');
  const [restreamEmbedUrl, setRestreamEmbedUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const handleToggleStream = (platform = 'tiktok') => {
    if (streamStatus === 'live') {
      setStreamStatus('idle');
      setIsAILive(false);
      return;
    }
    setStreamStatus('connecting');
    if (rtmpKey) {
      try { localStorage.setItem('aidol_rtmp_key', rtmpKey); } catch(e) {}
    }
    setTimeout(() => {
      setStreamStatus('live');
      setIsAILive(true);
    }, 1000);
  };
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  // ── Simulator State ──
  const [simName, setSimName] = useState('Minh');
  const [simComment, setSimComment] = useState('');
  const [simGift, setSimGift] = useState('Hoa hồng (Rose)');
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const audioPlayerRef = useRef(null);
  const [viewerHistory, setViewerHistory] = useState([]); // Lịch sử 10 tương tác gần nhất
  
  const [activeBrainPack, setActiveBrainPack] = useState('talk'); // Bộ não chủ đề
  const [customBrains, setCustomBrains] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('aidol_custom_brains');
    if (saved && saved !== 'null') {
      try { setCustomBrains(JSON.parse(saved) || []); } catch(e) {}
    }
  }, []);
  
  const allBrains = [
    { id: 'talk', label: 'Tương tác', icon: '💬' },
    { id: 'sales', label: 'Bán hàng', icon: '🛒' },
    { id: 'dance', label: 'Idol Nhảy', icon: '💃' },
    { id: 'sing', label: 'Idol Hát', icon: '🎤' },
    ...customBrains.map(b => ({ id: b.id, label: b.name, icon: b.icon || '🧠' }))
  ];

  // ── 3-Role Voice Configuration States ──
  const [voiceConfig, setVoiceConfig] = useState(() => getSavedVoiceConfig());
  const [activeVoiceRoleTab, setActiveVoiceRoleTab] = useState('idol'); // 'idol' | 'manager' | 'comment' | 'events'
  const [voiceFilterCategory, setVoiceFilterCategory] = useState('all'); // 'all' | 'pro' | 'free' | 'female' | 'male'
  const [voiceCountryFilter, setVoiceCountryFilter] = useState('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState(null);
  
  // Event script prompts
  const [eventPrompts, setEventPrompts] = useState([
    { id: 'ev_1', event: 'Chào mừng người mới vào xem', text: 'Dạ em chào anh chị [user] đã đến với livestream của em! Thả tim ủng hộ em nhé!', role: 'manager', enabled: true },
    { id: 'ev_2', event: 'Cảm ơn tặng quà', text: 'Ôi em cảm ơn đại gia [user] rất nhiều vì đã tặng [gift] siêu đẹp cho em ạ!', role: 'idol', enabled: true },
    { id: 'ev_3', event: 'Thông báo chốt đơn & Deal sốc', text: 'Dạ các bác ơi, số lượng deal giảm giá có hạn, mọi người mau bấm giỏ hàng chốt đơn nha!', role: 'manager', enabled: true },
    { id: 'ev_4', event: 'Trả lời bình luận & câu hỏi', text: 'Cảm ơn câu hỏi của [user] nha, để em giải đáp ngay cho mọi người cùng nghe nè!', role: 'comment', enabled: true },
  ]);
  const [editingEventPromptId, setEditingEventPromptId] = useState(null);
  const [editingEventPromptText, setEditingEventPromptText] = useState('');

  // Gemini Live Q&A test
  const [testVoiceQuestion, setTestVoiceQuestion] = useState('');
  const [testVoiceUser, setTestVoiceUser] = useState('Khán Giả VIP');
  const [testVoiceStatus, setTestVoiceStatus] = useState('');

  useEffect(() => {
    const handleVoiceSync = (e) => {
      if (e.detail) setVoiceConfig(e.detail);
    };
    window.addEventListener('aidol_voice_sync_updated', handleVoiceSync);
    window.addEventListener('ava_voice_config_updated', handleVoiceSync);
    return () => {
      window.removeEventListener('aidol_voice_sync_updated', handleVoiceSync);
      window.removeEventListener('ava_voice_config_updated', handleVoiceSync);
    };
  }, []);

  const updateAndSaveVoiceConfig = (newConfig) => {
    setVoiceConfig(newConfig);
    saveVoiceConfig(newConfig);
  };

  const handleExportBrainAndScripts = () => {
    try {
      const data = {
        version: '1.0.9',
        exportedAt: new Date().toISOString(),
        brains: allBrains,
        prompts: {
          sales: localStorage.getItem('aidol_prompt_sales') || DEFAULT_BRAIN_PACKS[0].prompt,
          talk: localStorage.getItem('aidol_prompt_talk') || DEFAULT_BRAIN_PACKS[1].prompt,
          dance: localStorage.getItem('aidol_prompt_dance') || DEFAULT_BRAIN_PACKS[2].prompt,
          sing: localStorage.getItem('aidol_prompt_sing') || DEFAULT_BRAIN_PACKS[3].prompt
        },
        presetScripts: JSON.parse(localStorage.getItem('aidol_custom_preset_scripts') || '[]'),
        eventConfigs: JSON.parse(localStorage.getItem('aidol_event_configs') || '{}'),
        voiceConfig: JSON.parse(localStorage.getItem('ava_live_voice_config_v2') || '{}')
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AvaLive_KichBan_BoNao_${activeBrainPack}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Lỗi xuất file: ' + e.message);
    }
  };

  const handleImportBrainAndScripts = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result);
        if (imported) {
          if (imported.prompts) {
            Object.keys(imported.prompts).forEach(k => {
              localStorage.setItem(`aidol_prompt_${k}`, imported.prompts[k]);
            });
          }
          if (imported.presetScripts) {
            localStorage.setItem('aidol_custom_preset_scripts', JSON.stringify(imported.presetScripts));
          }
          if (imported.eventConfigs) {
            localStorage.setItem('aidol_event_configs', JSON.stringify(imported.eventConfigs));
          }
          if (imported.voiceConfig) {
            localStorage.setItem('ava_live_voice_config_v2', JSON.stringify(imported.voiceConfig));
          }
          alert('✅ Đã nạp thành công bộ kịch bản & cấu hình mới!');
          window.location.reload();
        }
      } catch (err) {
        alert('File không hợp lệ: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePreviewRoleVoice = (voice, sampleText = null, configOverride = null) => {
    if (previewingVoiceId === voice.id) {
      stopVoiceAudio();
      setPreviewingVoiceId(null);
      return;
    }
    setPreviewingVoiceId(voice.id);
    const sample = sampleText || (
      voice.gender === 'Female'
        ? `Dạ em chào cả nhà yêu! Em là Idol AI của phiên live hôm nay, chúc mọi người xem live thật vui ạ!`
        : `Chào mừng toàn thể anh em đến với phiên livestream đỉnh cao ngày hôm nay!`
    );
    const voiceToPlay = {
      ...voice,
      rate: configOverride?.rate || voice.rate || 1.0,
      pitch: configOverride?.pitch || voice.pitch || 1.0,
      volume: configOverride?.volume || voice.volume || 1.0
    };
    previewVoiceAudio(voiceToPlay, sample, () => {
      setPreviewingVoiceId(null);
    });
  };

  const [previousVideoItem, setPreviousVideoItem] = useState(null); // Lưu video nền trước khi có sự kiện

  const handleLiveEvent = async (type, payload) => {
    if (!isAILive) return alert('Vui lòng Bắt đầu AI Live trước!');
    setIsProcessingEvent(true);
    try {
      const res = await fetch('/api/process-live-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brain: 'gemini',
          model: localStorage.getItem('gemini_model') || 'gemini-1.5-flash',
          apiKey: localStorage.getItem('gemini_api_key'),
          eventType: type,
          payload,
          viewerHistory,
          brainPack: activeBrainPack,
          systemPrompt: localStorage.getItem(`aidol_prompt_${activeBrainPack}`) || (DEFAULT_BRAIN_PACKS.find(b => b.id === activeBrainPack)?.prompt || '')
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setViewerHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), type, payload, ai_intent: data.intent, ai_reply: data.replyText }].slice(-10));

      if (audioPlayerRef.current && data.replyText) {
        audioPlayerRef.current.enqueueItem(data.replyText, data.shouldTriggerAction);
      }

      if (data.shouldTriggerAction === 'dance' || data.shouldTriggerAction === 'gift_reaction') {
        const cat = data.shouldTriggerAction === 'dance' ? 'dance' : 'reaction';
        const items = liveMedia.filter(i => i.category === cat);
        if (items.length > 0) {
          // Lưu lại video nền hiện tại để quay về sau khi hết reaction
          setPreviousVideoItem(activeVideoItem);
          handlePlayFromKho(items[0]);
        }
      }

    } catch (err) {
      alert('Lỗi xử lý sự kiện: ' + err.message);
    } finally {
      setIsProcessingEvent(false);
    }
  };

  // ── Load Live Kho ──
  const loadLiveKho = useCallback(async () => {
    try {
      const items = await getAllLiveMedia();
      setLiveMedia(items);
      setKhoLoaded(true);
    } catch (err) { console.error('Load Live Kho error:', err); }
  }, []);

  useEffect(() => { loadLiveKho(); }, [loadLiveKho]);
  useEffect(() => { setSavedJobs(getSavedJobs()); }, []);

  // ── Upload video/audio to kho ──
  const handleUploadToKho = async (e, category) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingCat(category);
    try {
      for (const file of files) {
        let type = 'video';
        if (file.type.startsWith('audio')) type = 'audio';
        else if (file.type.startsWith('image')) type = 'image';
        const item = {
          id: 'live_' + Date.now() + '_' + Math.random().toString(36).slice(2),
          name: file.name.replace(/\.[^/.]+$/, ''),
          category,
          type,
          fileBlob: file,
          mediaUrl: URL.createObjectURL(file),
          createdAt: new Date().toISOString(),
          size: file.size
        };
        await addLiveMedia(item);
      }
      await loadLiveKho();
    } catch (err) { alert('Lỗi upload: ' + err.message); }
    setUploadingCat(null);
    e.target.value = '';
  };

  // ── Delete from kho ──
  const handleDeleteMedia = async (id) => {
    if (!confirm('Xóa file này khỏi Kho Live?')) return;
    await deleteLiveMedia(id);
    await loadLiveKho();
    if (activeVideoItem?.id === id) setActiveVideoItem(null);
  };

  // ── Import từ AIDOL ──
  const handleOpenImport = async (cat) => {
    setImportTargetCat(cat);
    const items = await getAllAIDOL();
    setAidolItems(items);
    setShowImportModal(true);
  };
  const handleImportAIDOL = async (item) => {
    try {
      await importFromAIDOLDB(item, importTargetCat);
      await loadLiveKho();
      setShowImportModal(false);
      alert('✅ Đã import "' + item.name + '" vào kho ' + importTargetCat + '!');
    } catch (err) { alert('Lỗi import: ' + err.message); }
  };

  // ── Play video from kho ──
  const handlePlayFromKho = (item) => {
    setActiveVideoItem(item);
    if (videoRef.current && item.mediaUrl) {
      videoRef.current.src = item.mediaUrl;
      videoRef.current.play().catch(() => {});
    }
    syncMasterLiveState({
      stage: 'idol',
      mediaUrl: item.mediaUrl,
      isVideo: item.type === 'video',
      characterName: item.name,
      isPlaying: true,
      updatedAt: Date.now()
    });
  };

  // ── Build video queue for live ──
  const handleStartLive = () => {
    const storyItems = liveMedia.filter(i => i.category === 'story' && (i.type === 'video' || i.type === 'audio'));
    if (storyItems.length > 0) {
      setVideoQueue(storyItems);
      setCurrentVideoIdx(0);
      handlePlayFromKho(storyItems[0]);
    } else if (activeVideoItem) {
      handlePlayFromKho(activeVideoItem);
    }
    setIsAILive(true);
    syncMasterLiveState({
      stage: 'idol',
      isPlaying: true,
      updatedAt: Date.now()
    });
  };

  // ── Auto-next video in queue or resume previous ──
  const handleVideoEnded = () => {
    if (previousVideoItem) {
      // Quay lại video nền trước đó (Story/Idle)
      handlePlayFromKho(previousVideoItem);
      setPreviousVideoItem(null);
      return;
    }
    const nextIdx = (currentVideoIdx + 1) % videoQueue.length;
    if (videoQueue.length > 0) {
      setCurrentVideoIdx(nextIdx);
      handlePlayFromKho(videoQueue[nextIdx]);
    }
  };

  const handleSkipVideo = () => {
    const nextIdx = (currentVideoIdx + 1) % videoQueue.length;
    if (videoQueue.length > 0) {
      setCurrentVideoIdx(nextIdx);
      handlePlayFromKho(videoQueue[nextIdx]);
    }
  };

  const catMedia = (cat) => liveMedia.filter(i => i.category === cat);
  const formatSize = (bytes) => bytes ? (bytes > 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : (bytes / 1024).toFixed(0) + ' KB') : '';

  const handleLoadRestream = () => {
    if (!restreamUrl) return;
    let url = restreamUrl.trim();
    if (url.includes('/video/')) {
      const match = url.match(/\/video\/(\d+)/);
      if (match && match[1]) {
        url = `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
    } else {
      let cleanId = url.split('?')[0].split('#')[0];
      const matchAt = cleanId.match(/@([a-zA-Z0-9_.-]+)/);
      if (matchAt && matchAt[1]) {
        cleanId = matchAt[1];
      } else {
        const parts = cleanId.split('/').filter(Boolean);
        if (parts.length > 0) {
          const last = parts[parts.length - 1];
          cleanId = (last === 'live' && parts.length > 1) ? parts[parts.length - 2].replace(/^@/, '') : last.replace(/^@/, '');
        } else {
          cleanId = cleanId.replace(/^@/, '');
        }
      }
      url = `https://www.tiktok.com/@${cleanId}/live`;
    }
    setRestreamEmbedUrl(url);
  };

  const handleOpenRestreamPopout = () => {
    if (!restreamEmbedUrl) return;
    window.open(restreamEmbedUrl, 'TiktokLivePopout', 'width=450,height=800,menubar=no,toolbar=no,location=no,status=no');
  };

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true
      });
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = `AVA-Live-Record-${new Date().getTime()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      };
    } catch(err) {
      console.error("Lỗi khi quay màn hình:", err);
      alert("Không thể bắt đầu quay màn hình. Vui lòng cấp quyền chia sẻ màn hình.");
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] bg-[#0D0F1A] text-slate-300 font-sans flex flex-col rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl">
      
      {/* ── TOP HEADER ── */}
      <div className="h-14 bg-[#1a1b26]/90 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00FF66]/20 to-blue-500/20 border border-[#00FF66]/30 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-pulse"></span>
            <span className="text-xs font-black text-[#00FF66] uppercase tracking-wider">AVA AI LIVE CONSOLE</span>
          </div>
          <button onClick={() => setIsAILive(!isAILive)}
            className={`px-5 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all shadow-lg ${isAILive ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/30' : 'bg-[#00FF66] hover:bg-[#00DD55] text-black shadow-[#00FF66]/30'}`}>
            {isAILive ? <><Square className="w-3.5 h-3.5"/> Dừng Live AI</> : <><Play className="w-3.5 h-3.5"/> Bắt đầu Live AI</>}
          </button>
          {isAILive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-red-400">ĐANG LIVE</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {['tiktok','shopee','youtube','facebook'].map(src => (
              <button key={src} onClick={() => setActiveSource(src)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${activeSource === src
                  ? src === 'tiktok' ? 'bg-[#ff0050] text-white' : src === 'shopee' ? 'bg-orange-500 text-white' : src === 'youtube' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                  : 'bg-[#24283b] text-slate-400 border border-slate-700 hover:text-white'}`}>
                {src === 'tiktok' ? '♪ TikTok' : src === 'shopee' ? '🛒 Shopee' : src === 'youtube' ? '▶ YouTube' : '📘 Facebook'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <span className="text-[10px] text-amber-400 font-bold">💰 1,200 KOL Coin</span>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ═══ LEFT: VIDEO PLAYER + CONTROLS ═══ */}
        <div className="w-[320px] flex-shrink-0 bg-[#0D0F1A] border-r border-slate-700/50 flex flex-col">
          {/* Video Screen */}
          <div className="relative bg-black flex-shrink-0" style={{aspectRatio:'9/16', maxHeight:'380px'}}>
            {activeVideoItem ? (
              activeVideoItem.type === 'video' ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay loop={videoQueue.length <= 1} onEnded={handleVideoEnded}
                  src={activeVideoItem.mediaUrl}/>
              ) : activeVideoItem.type === 'audio' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/40 to-[#0D0F1A]">
                  <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center mb-3 animate-pulse">
                    <Volume2 className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="text-xs font-bold text-white">{activeVideoItem.name}</div>
                  <audio ref={videoRef} autoPlay loop={videoQueue.length <= 1} onEnded={handleVideoEnded} src={activeVideoItem.mediaUrl} className="w-full mt-3 px-4"/>
                </div>
              ) : (
                <img src={activeVideoItem.mediaUrl} alt={activeVideoItem.name} className="w-full h-full object-cover"/>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1b26] to-[#0D0F1A]">
                <div className="w-16 h-16 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center mb-3">
                  <Video className="w-8 h-8 text-[#00FF66]" />
                </div>
                <p className="text-xs text-slate-500 font-medium text-center px-4">Chọn video từ Kho<br/>hoặc bấm Bắt đầu Live</p>
              </div>
            )}

            {/* Overlay status */}
            {isAILive && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                <span className="text-[9px] font-black text-white">LIVE</span>
              </div>
            )}
            {isAudioPlaying && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
                {[3,5,4,6,3,5,4,3].map((h,i) => (
                  <div key={i} className="flex-1 bg-[#00FF66] rounded-full animate-pulse" style={{height: h * 2 + 'px', animationDelay: i * 0.1 + 's'}}/>
                ))}
              </div>
            )}
            {activeVideoItem && (
              <div className="absolute bottom-2 right-2 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono truncate max-w-[120px]">
                {activeVideoItem.name}
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="p-3 bg-[#1a1b26] border-b border-slate-700/50 flex gap-2">
            {!isAILive ? (
              <button onClick={handleStartLive}
                className="flex-1 py-2 bg-[#00FF66] hover:bg-[#00DD55] text-black rounded-lg text-xs font-black flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all">
                <Play className="w-3.5 h-3.5"/> Bắt đầu AI Live
              </button>
            ) : (
              <button onClick={() => setIsAILive(false)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all">
                <Square className="w-3.5 h-3.5"/> Dừng AI Live
              </button>
            )}
            <button onClick={handleSkipVideo} disabled={videoQueue.length === 0}
              className="px-3 py-2 bg-[#24283b] border border-slate-700 hover:bg-[#2f354d] rounded-lg text-xs transition-colors disabled:opacity-40">
              <SkipForward className="w-4 h-4"/>
            </button>
          </div>

          {/* Platform Connection */}
          <div className="p-3 bg-[#1a1b26] flex-1 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Kết nối {activeSource.toUpperCase()}</div>

            {activeSource === 'tiktok' && (
              <div className="space-y-2">
                <div className="p-3 bg-[#ff0050]/10 border border-[#ff0050]/30 rounded-xl">
                  <div className="text-[10px] font-black text-[#ff0050] mb-2 flex items-center gap-1.5">
                    <Radio className="w-3 h-3"/> TikTok Live Studio (RTMP)
                  </div>
                  <div className="text-[10px] text-slate-400 mb-3 leading-relaxed">
                    Kết nối qua TikTok Live Studio app. Dùng RTMP URL + Stream Key từ TikTok Studio.
                  </div>
                  <input type="text" placeholder="Stream Key từ TikTok Studio..." value={rtmpKey} onChange={e => setRtmpKey(e.target.value)}
                    className="w-full bg-black/40 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white mb-2 outline-none focus:border-[#ff0050]"/>
                  <div className="text-[9px] text-slate-500 mb-2">RTMP URL: <span className="text-[#ff0050] font-mono">rtmp://live.tiktok.com/live/</span></div>
                  <button 
                    onClick={() => handleToggleStream('tiktok')}
                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      streamStatus === 'live'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : streamStatus === 'connecting'
                        ? 'bg-yellow-600 text-white animate-pulse'
                        : rtmpKey
                        ? 'bg-[#ff0050] hover:bg-[#cc0040] text-white shadow-lg shadow-[#ff0050]/20'
                        : 'bg-white/5 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {streamStatus === 'live' ? (
                      <><CheckCircle className="w-3.5 h-3.5 text-white"/> Đang Live TikTok Studio (Bấm để Dừng)</>
                    ) : streamStatus === 'connecting' ? (
                      <><RefreshCw className="w-3.5 h-3.5 animate-spin"/> Đang kết nối...</>
                    ) : rtmpKey ? (
                      <><Wifi className="w-3.5 h-3.5"/> Kết nối TikTok Live Studio</>
                    ) : (
                      <><WifiOff className="w-3.5 h-3.5"/> Nhập Stream Key để kết nối</>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-[#24283b] border border-slate-700 rounded-xl">
                  <div className="text-[10px] font-black text-blue-400 mb-2">📋 Cách lấy Stream Key TikTok:</div>
                  <ol className="text-[10px] text-slate-400 space-y-1 leading-relaxed list-decimal list-inside">
                    <li>Mở TikTok Live Studio app trên máy tính</li>
                    <li>Đăng nhập tài khoản TikTok của bạn</li>
                    <li>Vào Settings → Stream Key</li>
                    <li>Copy Stream Key và dán vào ô trên</li>
                    <li>Bấm "Kết nối TikTok Live" để bắt đầu</li>
                  </ol>
                </div>
              </div>
            )}

            {activeSource === 'shopee' && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <div className="text-[10px] font-black text-orange-400 mb-2">🛒 Shopee Live</div>
                <p className="text-[10px] text-slate-400 mb-3">Kết nối qua Shopee Seller Center → Live → RTMP Key.</p>
                <input type="text" placeholder="Shopee Stream Key..." className="w-full bg-black/40 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white mb-2 outline-none focus:border-orange-500"/>
                <button className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg text-xs font-bold">Kết nối Shopee Live</button>
              </div>
            )}

            {(activeSource === 'youtube' || activeSource === 'facebook') && (
              <div className="p-3 bg-white/5 border border-slate-700 rounded-xl">
                <div className="text-[10px] font-black text-white mb-2">{activeSource === 'youtube' ? '▶ YouTube Live' : '📘 Facebook Live'}</div>
                <p className="text-[10px] text-slate-400 mb-3">Lấy Stream Key từ {activeSource === 'youtube' ? 'YouTube Studio → Go Live → Stream' : 'Facebook → Live Producer → Thiết lập Live'}.</p>
                <input type="text" placeholder="Stream Key..." className="w-full bg-black/40 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white mb-2 outline-none focus:border-blue-500"/>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">Kết nối</button>
              </div>
            )}
          </div>
        </div>

        {/* ═══ CENTER + RIGHT: KHO + AI CONTROLS ═══ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/50 bg-[#1a1b26]/80 px-4 pt-2 flex-shrink-0 overflow-x-auto custom-scrollbar">
            {[
              ['kho','📦 Kho Video Live'],
              ['ai-voice', '🎙️ Giọng Đọc'],
              ['ai-player','🤖 AI Director'],
              ['ai-setup','⚙️ Cài đặt'],
              ['stream','📡 Stream Setup'],
              ['restream','🔄 Re-Stream']
            ].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg mr-1 whitespace-nowrap transition-all ${activeTab === id ? 'bg-[#0D0F1A] text-[#00FF66] border-t border-l border-r border-slate-700/50 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {/* ══ TAB: KHO VIDEO LIVE ══ */}
            {activeTab === 'kho' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">📦 Kho Video Live</h3>
                    <p className="text-[10px] text-slate-500">Upload video/audio vào từng loại. AI sẽ tự phát đúng loại khi có sự kiện.</p>
                  </div>
                  <div className="text-[10px] text-[#00FF66] font-bold">{liveMedia.length} file trong kho</div>
                </div>

                {/* Category tabs */}
                <div className="flex gap-2 flex-wrap">
                  {LIVE_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveKhoCat(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeKhoCat === cat.id ? 'bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40' : 'bg-[#24283b] text-slate-400 border border-slate-700 hover:text-white'}`}>
                      {cat.emoji} {cat.name}
                      <span className="bg-white/10 px-1.5 rounded-full text-[9px]">{catMedia(cat.id).length}</span>
                    </button>
                  ))}
                </div>

                {/* Active category panel */}
                {LIVE_CATEGORIES.filter(c => c.id === activeKhoCat).map(cat => (
                  <div key={cat.id} className={`border ${cat.border} rounded-2xl overflow-hidden`}>
                    <div className={`px-5 py-3 ${cat.bg} flex items-center justify-between`}>
                      <div>
                        <div className={`text-sm font-black ${cat.color} flex items-center gap-2`}>{cat.emoji} {cat.name}</div>
                        <div className="text-[10px] text-slate-400">{cat.desc}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenImport(cat.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-500/30 transition-colors">
                          <Download className="w-3 h-3"/> Import từ AIDOL
                        </button>
                        <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded-lg text-[10px] font-bold hover:bg-[#00FF66]/30 transition-colors cursor-pointer ${uploadingCat === cat.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingCat === cat.id ? <><RefreshCw className="w-3 h-3 animate-spin"/> Đang upload...</> : <><Upload className="w-3 h-3"/> Tải lên</>}
                          <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden"
                            onChange={(e) => handleUploadToKho(e, cat.id)}/>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0D0F1A]">
                      {catMedia(cat.id).length === 0 ? (
                        <label className="block border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-[#00FF66]/50 hover:bg-[#00FF66]/5 transition-all">
                          <div className="text-3xl mb-2">{cat.emoji}</div>
                          <div className="text-xs font-bold text-slate-400 mb-1">Kéo thả hoặc bấm để tải lên</div>
                          <div className="text-[10px] text-slate-600">Hỗ trợ: MP4, WebM, MOV, MP3, WAV, JPG, PNG</div>
                          <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden"
                            onChange={(e) => handleUploadToKho(e, cat.id)}/>
                        </label>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {catMedia(cat.id).map(item => (
                            <div key={item.id} className="bg-[#1a1b26] border border-slate-700 rounded-xl overflow-hidden group hover:border-[#00FF66]/50 transition-all">
                              <div className="aspect-video relative bg-black flex items-center justify-center overflow-hidden">
                                {item.type === 'video' ? (
                                  <video src={item.mediaUrl} className="w-full h-full object-cover" muted/>
                                ) : item.type === 'audio' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-purple-900/30">
                                    <Mic2 className="w-8 h-8 text-purple-400"/>
                                  </div>
                                ) : (
                                  <img src={item.mediaUrl} alt={item.name} className="w-full h-full object-cover"/>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2">
                                  <button onClick={() => handlePlayFromKho(item)}
                                    className="opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-[#00FF66] flex items-center justify-center hover:scale-110">
                                    <Play className="w-3.5 h-3.5 text-black ml-0.5"/>
                                  </button>
                                  <button onClick={() => handleDeleteMedia(item.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:scale-110">
                                    <Trash2 className="w-3.5 h-3.5 text-white"/>
                                  </button>
                                </div>
                                {activeVideoItem?.id === item.id && (
                                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#00FF66] text-black text-[8px] font-black rounded-full">▶ PLAYING</div>
                                )}
                              </div>
                              <div className="p-2">
                                <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                                <div className="text-[9px] text-slate-500 flex justify-between">
                                  <span className="capitalize">{item.type}</span>
                                  <span>{formatSize(item.size)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Add more button */}
                          <label className="aspect-video rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-[#00FF66]/50 hover:bg-[#00FF66]/5 transition-all">
                            <Plus className="w-6 h-6 text-slate-600 mb-1"/>
                            <span className="text-[9px] text-slate-600">Thêm</span>
                            <input type="file" multiple accept="video/*,audio/*,image/*" className="hidden"
                              onChange={(e) => handleUploadToKho(e, cat.id)}/>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══ TAB: 3-ROLE VOICE & LIVE EVENTS ══ */}
            {activeTab === 'ai-voice' && (
              <div className="p-5 space-y-5">
                {/* Header overview */}
                <div className="p-4 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/40 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-400/30">
                      <Mic2 className="w-6 h-6 animate-pulse text-purple-300" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        Studio Giọng Đọc 3 Vai Trò & Sự Kiện Livestream
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                          20+ Quốc Gia • Gemini AI + ElevenLabs
                        </span>
                      </h3>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Tùy chỉnh Âm lượng, Tốc độ (0.5x - 2.0x), Bật/Tắt riêng biệt cho Giọng Idol, Giọng Trợ Lý & Giọng Trả Lời Bình Luận.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub Role Navigation */}
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'idol', label: '👑 1. Giọng Live Idol Chính', roleKey: 'idolVoice', icon: Sparkles, color: 'text-purple-400' },
                    { id: 'manager', label: '💼 2. Giọng Trợ Lý & Bán Hàng', roleKey: 'managerVoice', icon: Zap, color: 'text-blue-400' },
                    { id: 'caster', label: '🎙️ 3. Giọng Bình Luận Viên Game PK', roleKey: 'casterVoice', icon: Radio, color: 'text-amber-400' },
                    { id: 'comment', label: '💬 4. Giọng Trả Lời Bình Luận AI', roleKey: 'commentVoice', icon: Bot, color: 'text-pink-400' },
                    { id: 'events', label: '⚡ 5. Kịch Bản Câu Thoại Sự Kiện', roleKey: null, icon: Radio, color: 'text-yellow-400' },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeVoiceRoleTab === tab.id;
                    const activeVoice = tab.roleKey ? (voiceConfig[tab.roleKey] || {}) : null;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveVoiceRoleTab(tab.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
                          isActive 
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400' 
                            : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-white' : tab.color} />
                        <span>{tab.label}</span>
                        {activeVoice && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                            activeVoice.enabled !== false ? 'bg-emerald-500 text-black font-black' : 'bg-red-500/30 text-red-300'
                          }`}>
                            {activeVoice.enabled !== false ? 'ON' : 'OFF'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Role Specific Configuration Body */}
                {activeVoiceRoleTab !== 'events' ? (
                  <div className="space-y-4">
                    {/* Active Voice Card */}
                    {(() => {
                      const roleKey = activeVoiceRoleTab === 'idol' ? 'idolVoice' : (activeVoiceRoleTab === 'manager' ? 'managerVoice' : (activeVoiceRoleTab === 'caster' ? 'casterVoice' : 'commentVoice'));
                      const currentVoice = voiceConfig[roleKey] || {
                        id: 'free_vi_female',
                        name: 'Hoài My 🇻🇳 (Nữ)',
                        rate: 1.0,
                        pitch: 1.0,
                        volume: 1.0,
                        enabled: true
                      };

                      return (
                        <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 shadow-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                              🎙️ Giọng Đang Chọn Cho: {activeVoiceRoleTab === 'idol' ? 'Idol Chính' : (activeVoiceRoleTab === 'manager' ? 'Trợ Lý Bán Hàng' : (activeVoiceRoleTab === 'caster' ? 'Bình Luận Viên Game' : 'Trả Lời Bình Luận'))}
                            </span>
                            <button
                              onClick={() => {
                                const updated = {
                                  ...voiceConfig,
                                  [roleKey]: {
                                    ...currentVoice,
                                    enabled: currentVoice.enabled === false ? true : false
                                  }
                                };
                                updateAndSaveVoiceConfig(updated);
                              }}
                              className={`text-[10px] px-3 py-1 rounded-full font-black transition-all ${
                                currentVoice.enabled !== false 
                                  ? 'bg-emerald-500 text-black shadow-md' 
                                  : 'bg-red-500/30 text-red-300 border border-red-500/40'
                              }`}
                            >
                              {currentVoice.enabled !== false ? '● ĐANG BẬT' : '○ ĐÃ TẮT'}
                            </button>
                          </div>

                          <div className="text-base font-black text-white flex items-center gap-2">
                            <span>{currentVoice.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                              {currentVoice.provider?.toUpperCase()}
                            </span>
                          </div>

                          {/* Sliders for Volume, Speed, Pitch */}
                          <div className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between text-xs text-gray-200">
                              <span className="flex items-center gap-1 font-bold">
                                <Volume2 size={12} className="text-purple-400" /> Âm Lượng (Volume):
                              </span>
                              <span className="font-mono text-purple-300 font-black">
                                {Math.round((currentVoice.volume !== undefined ? currentVoice.volume : 1.0) * 100)}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={currentVoice.volume !== undefined ? currentVoice.volume : 1.0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateAndSaveVoiceConfig({
                                  ...voiceConfig,
                                  [roleKey]: { ...currentVoice, volume: val }
                                });
                              }}
                              className="w-full accent-purple-500 h-1.5 bg-white/10 rounded cursor-pointer"
                            />

                            <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                              <span className="flex items-center gap-1 font-bold">
                                <Sliders size={12} className="text-yellow-400" /> Tốc Độ Đọc (Speed):
                              </span>
                              <span className="font-mono text-yellow-300 font-black">
                                {(currentVoice.rate !== undefined ? currentVoice.rate : 1.0).toFixed(2)}x
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="2.0"
                              step="0.05"
                              value={currentVoice.rate !== undefined ? currentVoice.rate : 1.0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateAndSaveVoiceConfig({
                                  ...voiceConfig,
                                  [roleKey]: { ...currentVoice, rate: val }
                                });
                              }}
                              className="w-full accent-yellow-500 h-1.5 bg-white/10 rounded cursor-pointer"
                            />

                            <div className="flex items-center justify-between text-xs text-gray-200 pt-1">
                              <span className="flex items-center gap-1 font-bold">
                                <Sparkles size={12} className="text-cyan-400" /> Cao Độ (Pitch):
                              </span>
                              <span className="font-mono text-cyan-300 font-black">
                                {(currentVoice.pitch !== undefined ? currentVoice.pitch : 1.0).toFixed(2)}x
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="1.5"
                              step="0.05"
                              value={currentVoice.pitch !== undefined ? currentVoice.pitch : 1.0}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateAndSaveVoiceConfig({
                                  ...voiceConfig,
                                  [roleKey]: { ...currentVoice, pitch: val }
                                });
                              }}
                              className="w-full accent-cyan-500 h-1.5 bg-white/10 rounded cursor-pointer"
                            />
                          </div>

                          <button
                            onClick={() => {
                              const voice = ALL_SYSTEM_VOICES.find(v => v.id === currentVoice.id) || currentVoice;
                              handlePreviewRoleVoice(voice, null, currentVoice);
                            }}
                            className="w-full py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-purple-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <Volume2 size={13} /> Nghe Thử Giọng Này Với Tốc Độ & Âm Lượng Hiện Tại
                          </button>
                        </div>
                      );
                    })()}

                    {/* Filter Bar for 20+ Countries & Tiers */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {[
                            { id: 'all', label: 'Tất Cả Giọng' },
                            { id: 'pro', label: '💎 ElevenLabs Pro' },
                            { id: 'free', label: '🆓 Miễn Phí (TTS Chuẩn)' },
                            { id: 'female', label: '♀ Giọng Nữ' },
                            { id: 'male', label: '♂ Giọng Nam' },
                          ].map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => setVoiceFilterCategory(cat.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                voiceFilterCategory === cat.id
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-300'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Country Filters Bar */}
                      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0">
                          <Globe size={13} className="text-cyan-400" /> Quốc Gia:
                        </span>
                        {COUNTRY_FILTERS.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setVoiceCountryFilter(c.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                              voiceCountryFilter === c.id 
                                ? 'bg-cyan-500 text-black font-black shadow-md' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                            }`}
                          >
                            <span>{c.icon}</span>
                            <span>{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice Catalog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[44vh] overflow-y-auto custom-scrollbar pr-1">
                      {ALL_SYSTEM_VOICES.filter(v => {
                        if (voiceFilterCategory === 'pro' && v.tier !== 'pro') return false;
                        if (voiceFilterCategory === 'free' && v.tier !== 'free') return false;
                        if (voiceFilterCategory === 'female' && v.gender !== 'Female') return false;
                        if (voiceFilterCategory === 'male' && v.gender !== 'Male') return false;
                        if (voiceCountryFilter !== 'all') {
                          const target = COUNTRY_FILTERS.find(c => c.id === voiceCountryFilter);
                          if (target && target.code && !v.lang?.startsWith(target.code) && !v.id.includes(`_${voiceCountryFilter}_`)) {
                            return false;
                          }
                        }
                        return true;
                      }).map(v => {
                        const roleKey = activeVoiceRoleTab === 'idol' ? 'idolVoice' : (activeVoiceRoleTab === 'manager' ? 'managerVoice' : 'commentVoice');
                        const isCurrentAssigned = voiceConfig[roleKey]?.id === v.id;
                        const isPreviewing = previewingVoiceId === v.id;

                        return (
                          <div
                            key={v.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                              isCurrentAssigned
                                ? 'bg-gradient-to-tr from-purple-950/80 via-slate-900 to-black border-purple-400 ring-2 ring-purple-400/50 shadow-xl'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    v.gender === 'Female' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
                                  }`}>
                                    {v.gender === 'Female' ? '♀ Nữ' : '♂ Nam'} • {v.lang || 'vi-VN'}
                                  </span>
                                  {v.tier === 'pro' ? (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black">
                                      💎 PRO
                                    </span>
                                  ) : (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                      🆓 FREE
                                    </span>
                                  )}
                                </div>

                                {isCurrentAssigned && (
                                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500 text-white font-black">
                                    ✓ ĐANG DÙNG
                                  </span>
                                )}
                              </div>

                              <div className="text-sm font-black text-white">{v.name}</div>
                              <p className="text-[11px] text-gray-400 line-clamp-1 mb-2.5">{v.desc}</p>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                              <button
                                onClick={() => handlePreviewRoleVoice(v)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                  isPreviewing 
                                    ? 'bg-amber-500 text-black font-black animate-pulse' 
                                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                                }`}
                              >
                                {isPreviewing ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
                                <span>{isPreviewing ? 'Dừng' : 'Nghe Thử'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  const updated = {
                                    ...voiceConfig,
                                    [roleKey]: {
                                      id: v.id,
                                      name: v.name,
                                      voiceId: v.voiceId || v.id,
                                      provider: v.provider || 'elevenlabs',
                                      gender: v.gender || 'Female',
                                      lang: v.lang || 'vi-VN',
                                      rate: voiceConfig[roleKey]?.rate || 1.0,
                                      pitch: voiceConfig[roleKey]?.pitch || 1.0,
                                      volume: voiceConfig[roleKey]?.volume || 1.0,
                                      enabled: true
                                    }
                                  };
                                  updateAndSaveVoiceConfig(updated);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                  isCurrentAssigned 
                                    ? 'bg-purple-600 text-white shadow-md' 
                                    : 'bg-white/10 hover:bg-purple-600/60 text-gray-200'
                                }`}
                              >
                                {isCurrentAssigned ? '✓ Đã Chọn' : '+ Chọn Giọng Này'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* SUB-TAB 4: KỊCH BẢN SỰ KIỆN LIVESTREAM & BỘ NÃO GEMINI SMART Q&A */
                  /* ========================================================================= */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                      <h4 className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-400" />
                        Danh Sách Kịch Bản Sự Kiện Livestream Tự Động
                      </h4>
                      <p className="text-xs text-gray-400">
                        Tùy biến câu chào, lời cảm ơn khi nhận quà, thông báo chốt deal và xử lý bình luận của khán giả.
                      </p>

                      <div className="space-y-2.5">
                        {eventPrompts.map((p, idx) => {
                          const isEditing = editingEventPromptId === p.id;

                          return (
                            <div key={p.id} className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white">{p.event}</span>
                                  
                                  {/* Dropdown Lựa Chọn Người Đọc (Idol, Trợ Lý, Caster, Tương Tác) */}
                                  <select
                                    value={p.role || 'idol'}
                                    onChange={(e) => {
                                      const newRole = e.target.value;
                                      const updated = eventPrompts.map(item => item.id === p.id ? { ...item, role: newRole } : item);
                                      setEventPrompts(updated);
                                      try { localStorage.setItem('aidol_custom_event_prompts', JSON.stringify(updated)); } catch(err) {}
                                    }}
                                    className="text-[10px] px-2 py-0.5 rounded-lg font-black bg-black/60 border border-purple-400/40 text-purple-200 outline-none cursor-pointer"
                                  >
                                    <option value="idol" className="bg-[#121420] text-purple-300">👑 Giọng AI Idol Chính</option>
                                    <option value="manager" className="bg-[#121420] text-blue-300">💼 Giọng Trợ Lý Bán Hàng</option>
                                    <option value="caster" className="bg-[#121420] text-amber-300">🎙️ Giọng Bình Luận Viên Game</option>
                                    <option value="comment" className="bg-[#121420] text-pink-300">💬 Giọng Trả Lời Bình Luận</option>
                                  </select>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => {
                                      if (isEditing) {
                                        setEditingEventPromptId(null);
                                      } else {
                                        setEditingEventPromptId(p.id);
                                        setEditingEventPromptText(p.text);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20"
                                    title="Sửa câu thoại"
                                  >
                                    <Edit3 size={12} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const voice = p.role === 'idol' 
                                        ? voiceConfig.idolVoice 
                                        : (p.role === 'manager' 
                                            ? voiceConfig.managerVoice 
                                            : (p.role === 'caster' ? (voiceConfig.casterVoice || voiceConfig.managerVoice) : voiceConfig.commentVoice));
                                      handlePreviewRoleVoice(voice, p.text.replace(/\[user\]/gi, 'Khán Giả').replace(/\[gift\]/gi, 'Hoa Hồng'));
                                    }}
                                    className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40"
                                    title="Nghe thử"
                                  >
                                    <Play size={12} className="fill-current" />
                                  </button>
                                </div>
                              </div>

                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editingEventPromptText}
                                    onChange={(e) => setEditingEventPromptText(e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-black/80 border border-purple-400 rounded-lg text-xs text-white focus:outline-none"
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = eventPrompts.map(item => item.id === p.id ? { ...item, text: editingEventPromptText } : item);
                                      setEventPrompts(updated);
                                      setEditingEventPromptId(null);
                                    }}
                                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                                  >
                                    <Check size={14} />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-300 italic bg-black/40 p-2 rounded-lg">
                                  "{p.text}"
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gemini AI Live Q&A Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-400/30">
                          <Bot size={18} className="animate-pulse text-cyan-300" />
                        </span>
                        <div>
                          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                            🧠 Thử Nghiệm Bộ Não AI Gemini Flash Trả Lời Trực Tiếp
                          </h4>
                          <p className="text-[11px] text-gray-300">
                            Tự động trả lời thông minh mọi câu hỏi ngoài vùng của người xem livestream, phát giọng đọc ra loa ngay tức thì.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={testVoiceUser}
                          onChange={(e) => setTestVoiceUser(e.target.value)}
                          placeholder="Tên người hỏi..."
                          className="w-full sm:w-40 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          value={testVoiceQuestion}
                          onChange={(e) => setTestVoiceQuestion(e.target.value)}
                          placeholder="Nhập câu hỏi khán giả (VD: 'Shop còn mẫu áo màu xanh không?', 'Idol hát bài gì đi?')..."
                          className="flex-1 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={async () => {
                            if (!testVoiceQuestion.trim()) return;
                            setTestVoiceStatus('🧠 Gemini AI đang phân tích và tạo câu thoại...');
                            try {
                              const aiRes = await askGeminiLiveAi({
                                question: testVoiceQuestion.trim(),
                                username: testVoiceUser.trim() || 'Khán Giả',
                                role: 'comment',
                                context: 'Phiên Livestream AIDOL'
                              });
                              if (aiRes?.text) {
                                setTestVoiceStatus('✅ AI trả lời: "' + aiRes.text + '"');
                                const voice = voiceConfig.commentVoice || voiceConfig.idolVoice;
                                handlePreviewRoleVoice(voice, aiRes.text);
                              }
                            } catch (e) {
                              setTestVoiceStatus('❌ Lỗi: ' + e.message);
                            }
                          }}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all shrink-0"
                        >
                          <Play size={12} className="fill-current" /> Hỏi & Nghe Đọc
                        </button>
                      </div>

                      {testVoiceStatus && (
                        <div className="text-xs font-bold text-cyan-300 bg-black/40 p-2.5 rounded-xl border border-cyan-500/30 animate-fadeIn">
                          {testVoiceStatus}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ TAB: AI DIRECTOR ══ */}
            {activeTab === 'ai-player' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white mb-1">🤖 AI Director</h3>
                  <p className="text-[10px] text-slate-500">Điều phối hàng đợi TTS, xen kẽ bình luận và tặng quà tự động.</p>
                </div>

                {/* ── CHỌN BRAIN PACK ── */}
                <div className="bg-[#1a1b26] border border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>🧠 Bộ Não AI & Kịch Bản Mẫu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportBrainAndScripts}
                        title="Xuất file kịch bản & bộ não để lưu sang file mới hoặc chuyển sang máy khác"
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Xuất File Mới</span>
                      </button>
                      <label
                        title="Mở file kịch bản & bộ não đã lưu (.json) vào phần mềm"
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Nạp File</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportBrainAndScripts}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {allBrains.map(pack => (
                      <button key={pack.id} onClick={() => setActiveBrainPack(pack.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${activeBrainPack === pack.id ? 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50 shadow-glow-green' : 'bg-[#0D0F1A] text-slate-400 border-slate-700 hover:text-white'}`}>
                        <span className="text-sm">{pack.icon}</span>
                        {pack.label}
                      </button>
                    ))}
                  </div>

                  {/* Hiển thị tóm tắt kịch bản của bộ não đang chọn */}
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-300 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">Đang áp dụng: </span>
                      <span>{DEFAULT_BRAIN_PACKS.find(b => b.id === activeBrainPack)?.name || 'Bộ não chuyên gia'}</span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {DEFAULT_BRAIN_PACKS.find(b => b.id === activeBrainPack)?.desc || 'Tự động phản hồi thông minh theo kịch bản chuẩn của hệ thống.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avatar + Speaking indicator */}
                <div className="bg-[#1a1b26] border border-slate-700 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#00FF66]/50 relative flex-shrink-0">
                    {activeVideoItem && activeVideoItem.type === 'image' ? (
                      <img src={activeVideoItem.mediaUrl} alt="Avatar" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[#1f2335] to-[#0D0F1A] flex items-center justify-center">
                        <span className="text-2xl">🤖</span>
                      </div>
                    )}
                    {isAudioPlaying && (
                      <div className="absolute bottom-1 inset-x-0 flex justify-center gap-0.5">
                        {[2,4,3,5,2].map((h,i) => (
                          <div key={i} className="w-1 bg-[#00FF66] rounded-full animate-pulse" style={{height: h*3+'px', animationDelay: i*0.1+'s'}}/>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white mb-1">AI AIDOL</div>
                    <div className={`text-xs font-bold ${isAILive ? 'text-[#00FF66]' : 'text-slate-500'}`}>
                      {isAILive ? (isAudioPlaying ? '🔊 Đang đọc kịch bản...' : '⏳ Chờ lượt đọc tiếp...') : '⏹ AI chưa bắt đầu'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {videoQueue.length > 0 ? `📹 Hàng đợi: ${videoQueue.length} video • Đang phát: ${currentVideoIdx + 1}/${videoQueue.length}` : 'Chưa có video trong hàng đợi'}
                    </div>
                  </div>
                </div>

                <AIAudioPlayer ref={audioPlayerRef} isLive={isAILive} onAudioPlayStateChange={setIsAudioPlaying} />

                {/* ── LIVE INTERACTION SIMULATOR ── */}
                <div className="bg-[#1a1b26] border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-black text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Giả lập Tương tác Người xem
                    </div>
                    {isProcessingEvent && <span className="text-[10px] text-yellow-400 animate-pulse">Đang phân tích...</span>}
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={simName} onChange={e => setSimName(e.target.value)} placeholder="Tên người xem..." className="w-1/3 bg-[#0D0F1A] border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#00FF66]" />
                    <button onClick={() => handleLiveEvent('VIEWER_JOIN', { name: simName })} className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded text-xs font-bold hover:bg-blue-500/30 transition-colors">
                      👋 {simName} vào phòng
                    </button>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <input type="text" value={simComment} onChange={e => setSimComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLiveEvent('COMMENT', { name: simName, text: simComment })} placeholder="Nhập comment..." className="flex-1 bg-[#0D0F1A] border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#00FF66]" />
                    <button onClick={() => handleLiveEvent('COMMENT', { name: simName, text: simComment })} className="px-4 bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 rounded text-xs font-bold hover:bg-[#00FF66]/30 transition-colors">Gửi</button>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <select value={simGift} onChange={e => setSimGift(e.target.value)} className="flex-1 bg-[#0D0F1A] border border-slate-700 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-pink-500">
                      <option value="🇻🇳 Cờ Tổ Quốc (1 xu)">🇻🇳 Cờ Tổ Quốc (1 xu)</option>
                      <option value="🌹 Hoa hồng (1 xu)">🌹 Hoa hồng (1 xu)</option>
                      <option value="🧡 Thả tim (1 xu)">🧡 Thả tim (1 xu)</option>
                      <option value="👍 Rất tốt (1 xu)">👍 Rất tốt (1 xu)</option>
                      <option value="🍰 Bánh sinh nhật (1 xu)">🍰 Bánh sinh nhật (1 xu)</option>
                      <option value="🍦 Bing Chilling (5 xu)">🍦 Bing Chilling (5 xu)</option>
                      <option value="🪖 Mũ cối yêu nước (10 xu)">🪖 Mũ cối yêu nước (10 xu)</option>
                      <option value="☕ Trà đào (20 xu)">☕ Trà đào (20 xu)</option>
                      <option value="🌸 Nước hoa (50 xu)">🌸 Nước hoa (50 xu)</option>
                      <option value="👑 Vương miện (99 xu)">👑 Vương miện (99 xu)</option>
                      <option value="🎖️ Xe tăng 390 (99 xu)">🎖️ Xe tăng 390 (99 xu)</option>
                      <option value="🐶 Corgi đáng yêu (100 xu)">🐶 Corgi đáng yêu (100 xu)</option>
                      <option value="🥁 Trống bùng nổ (249 xu)">🥁 Trống bùng nổ (249 xu)</option>
                      <option value="⚡ Xe thể thao (500 xu)">⚡ Xe thể thao (500 xu)</option>
                      <option value="🏛️ Trống đồng Đông Sơn (999 xu)">🏛️ Trống đồng Đông Sơn (999 xu)</option>
                      <option value="⚓ Cột mốc Trường Sa (1999 xu)">⚓ Cột mốc Trường Sa (1999 xu)</option>
                      <option value="🚚 Xe tải kem (2988 xu)">🚚 Xe tải kem (2988 xu)</option>
                      <option value="🧸 Gấu nhịp điệu (2999 xu)">🧸 Gấu nhịp điệu (2999 xu)</option>
                      <option value="🐉 Rồng vàng Thăng Long (5000 xu)">🐉 Rồng vàng Thăng Long (5000 xu)</option>
                      <option value="🤖 Rust tái sinh (6000 xu)">🤖 Rust tái sinh (6000 xu)</option>
                      <option value="🏁 Vững vàng về đích (6000 xu)">🏁 Vững vàng về đích (6000 xu)</option>
                      <option value="🏎️ Đường đua hoàng hôn (10000 xu)">🏎️ Đường đua hoàng hôn (10000 xu)</option>
                      <option value="🌠 Mưa sao băng kìa! (15000 xu)">🌠 Mưa sao băng kìa! (15000 xu)</option>
                      <option value="🎡 Công viên giải trí (17000 xu)">🎡 Công viên giải trí (17000 xu)</option>
                      <option value="🚀 Tàu con thoi TikTok (20000 xu)">🚀 Tàu con thoi TikTok (20000 xu)</option>
                      <option value="🦅 Phoenix Phượng hoàng (25999 xu)">🦅 Phoenix Phượng hoàng (25999 xu)</option>
                      <option value="🐲 Ngọn lửa rồng thiêng (26999 xu)">🐲 Ngọn lửa rồng thiêng (26999 xu)</option>
                      <option value="🦁 Sư tử (29999 xu)">🦁 Sư tử (29999 xu)</option>
                      <option value="👑🦁 Leon và Sư tử (34000 xu)">👑🦁 Leon và Sư tử (34000 xu)</option>
                      <option value="✨💫 TikTok Stars (39999 xu)">✨💫 TikTok Stars (39999 xu)</option>
                      <option value="🪐🌌 TikTok Universe (44999 xu)">🪐🌌 TikTok Universe (44999 xu)</option>
                    </select>
                    <button onClick={() => {
                      const isSpecial = simGift.includes('Sư tử') || simGift.includes('Universe') || simGift.includes('Phoenix') || simGift.includes('Rồng') || simGift.includes('Xe');
                      handleLiveEvent(isSpecial ? 'SPECIAL_GIFT' : 'GIFT', { name: simName, gift: simGift });
                    }} className="px-4 bg-pink-500/20 text-pink-400 border border-pink-500/40 rounded text-xs font-bold hover:bg-pink-500/30 transition-colors">Tặng Quà</button>
                  </div>

                  <div className="bg-[#0D0F1A] border border-slate-700 rounded p-2 h-32 overflow-y-auto custom-scrollbar flex flex-col-reverse">
                    {viewerHistory.length === 0 ? <div className="text-[10px] text-slate-600 text-center py-4">Chưa có sự kiện nào</div> : (
                      viewerHistory.slice().reverse().map((h, i) => (
                        <div key={i} className="mb-2 text-[10px] border-b border-slate-800 pb-2">
                          <div className="text-slate-400">[{h.time}] <span className="font-bold text-white">{h.payload.name}</span> {(h.type === 'GIFT' || h.type === 'SPECIAL_GIFT') ? <span className="text-pink-400">đã tặng {h.payload.gift}</span> : h.type === 'COMMENT' ? <span className="text-blue-400">đã bình luận: "{h.payload.text}"</span> : 'đã tham gia Live'}</div>
                          {h.ai_reply && (
                            <div className="mt-1 flex gap-2 items-start">
                              <span className="text-[#00FF66] font-bold">↳ AI ({h.ai_intent}):</span>
                              <span className="text-slate-300">"{h.ai_reply}"</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══ TAB: KỊCH BẢN (NAY LÀ EVENT MANAGER) ══ */}
            {activeTab === 'ai-setup' && (
              <div className="h-full overflow-y-auto">
                 <WorkspaceTacVu />
              </div>
            )}

            {/* ══ TAB: STREAM SETUP ══ */}
            {activeTab === 'stream' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white mb-1">📡 Hướng dẫn Kết nối Live Studio</h3>
                  <p className="text-[10px] text-slate-500">Kết nối phiên live với TikTok, YouTube, Facebook qua RTMP.</p>
                </div>

                {/* TikTok guide */}
                <div className="bg-[#ff0050]/10 border border-[#ff0050]/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#ff0050] flex items-center justify-center"><Radio className="w-4 h-4 text-white"/></div>
                    <div>
                      <div className="text-sm font-black text-[#ff0050]">TikTok Live Studio</div>
                      <div className="text-[10px] text-slate-400">Kết nối trực tiếp qua RTMP</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      {step:'1', title:'Tải TikTok Live Studio', desc:'Tải app tại livestudio.tiktok.com → Cài đặt và đăng nhập TikTok'},
                      {step:'2', title:'Lấy Stream Key', desc:'Vào TikTok Live Studio → Settings → "Go Live" → Copy Stream Key'},
                      {step:'3', title:'Cấu hình RTMP', desc:'RTMP URL: rtmp://live.tiktok.com/live/ + Stream Key của bạn'},
                      {step:'4', title:'Chọn Camera nguồn', desc:'Trong TikTok Studio: Thêm nguồn → Window Capture → Chọn cửa sổ AVA Live Console'},
                      {step:'5', title:'Bắt đầu Live', desc:'Bấm "Bắt đầu AI Live" ở AVA Console → Bấm "Go Live" trong TikTok Studio'},
                    ].map(item => (
                      <div key={item.step} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#ff0050]/30 border border-[#ff0050]/50 flex items-center justify-center text-[9px] font-black text-[#ff0050] flex-shrink-0">{item.step}</div>
                        <div>
                          <div className="text-xs font-bold text-white">{item.title}</div>
                          <div className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="text-[10px] font-bold text-slate-300 mb-1">RTMP Server URL:</div>
                    <div className="flex items-center gap-2 bg-black/40 border border-slate-600 rounded-lg px-3 py-2">
                      <code className="text-[10px] text-[#ff0050] font-mono flex-1">rtmp://live.tiktok.com/live/</code>
                      <button onClick={() => { navigator.clipboard.writeText('rtmp://live.tiktok.com/live/'); }} className="text-[9px] text-slate-400 hover:text-white font-bold">COPY</button>
                    </div>
                  </div>
                </div>

                {/* OBS guide */}
                <div className="bg-white/5 border border-slate-700 rounded-2xl p-5">
                  <div className="text-sm font-black text-white mb-3 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-400"/> OBS Studio (Nâng cao)
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed mb-3">
                    Dùng OBS Studio để stream đến nhiều nền tảng cùng lúc (TikTok + YouTube + Facebook).
                  </div>
                  <div className="space-y-2">
                    {[
                      'Thêm nguồn Window Capture → Chọn cửa sổ trình duyệt AVA Live',
                      'Vào Settings → Stream → Service: Custom RTMP',
                      'Server: rtmp://live.tiktok.com/live/ + Stream Key',
                      'Bật Virtual Camera (Tools → Start Virtual Camera) nếu cần',
                      'Bấm "Start Streaming" trong OBS để bắt đầu phát'
                    ].map((s, i) => (
                      <div key={i} className="flex gap-2 text-[10px] text-slate-400">
                        <CheckCircle className="w-3 h-3 text-[#00FF66] flex-shrink-0 mt-0.5"/>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* ══ TAB: RESTREAM / SCREEN RECORD ══ */}
            {activeTab === 'restream' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white mb-1">🔄 Phát Song Song & Quay Màn Hình</h3>
                  <p className="text-[10px] text-slate-500">Nhập link TikTok Live hoặc Video để hiển thị giao diện sạch và quay màn hình lưu lại.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={restreamUrl}
                    onChange={(e) => setRestreamUrl(e.target.value)}
                    placeholder="Dán link TikTok (VD: https://www.tiktok.com/@aidol/live)"
                    className="flex-1 bg-[#1a1b26] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                  />
                  <button onClick={handleLoadRestream} className="bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-[#00FF66]/30 whitespace-nowrap">
                    Tải Video
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleOpenRestreamPopout} disabled={!restreamEmbedUrl} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${restreamEmbedUrl ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                    <MonitorPlay className="w-5 h-5"/>
                    Mở Cửa Sổ Sạch (Pop-out)
                  </button>
                  <button onClick={isRecording ? stopScreenRecording : startScreenRecording} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${isRecording ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)]' : 'bg-[#ff0050] hover:bg-[#ff0050]/80 text-white shadow-[0_0_15px_rgba(255,0,80,0.4)]'}`}>
                    {isRecording ? <><StopCircle className="w-5 h-5"/> Dừng Quay & Tải Xuống</> : <><Video className="w-5 h-5"/> Bắt đầu Quay Màn Hình</>}
                  </button>
                </div>

                <div className="bg-black/50 border border-slate-700/50 rounded-2xl flex items-center justify-center overflow-hidden w-full relative" style={{ minHeight: '500px' }}>
                  {restreamEmbedUrl ? (
                    <iframe
                      src={restreamEmbedUrl}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="text-center text-slate-500 p-10 flex flex-col items-center">
                      <MonitorPlay className="w-16 h-16 mb-4 opacity-20"/>
                      <p className="text-base font-bold text-slate-300">Chưa có luồng Video/Live</p>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm">
                        Dán link và bấm "Tải Video" để xem trước, sau đó bấm "Mở Cửa Sổ Sạch" để hiện popup, hoặc dùng tính năng Quay Màn Hình để lưu video lại.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ MODAL: IMPORT TỪ AIDOL ══ */}
      {showImportModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1a1b26] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#0D0F1A]">
              <div>
                <h3 className="text-sm font-black text-white">Import từ AIDOL của tôi → Kho {importTargetCat}</h3>
                <p className="text-[10px] text-slate-400">{aidolItems.length} file có sẵn trong AIDOL Library</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {aidolItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-2">Chưa có file trong AIDOL Library</p>
                  <p className="text-slate-600 text-xs">Vào tab "AIDOL của tôi" → "Tạo mới" để upload file trước</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {aidolItems.map(item => (
                    <div key={item.id} onClick={() => handleImportAIDOL(item)}
                      className="bg-[#0D0F1A] border border-slate-700 rounded-xl overflow-hidden cursor-pointer hover:border-[#00FF66] transition-all group">
                      <div className="aspect-video relative bg-black flex items-center justify-center">
                        {item.type === 'video' ? <video src={item.mediaUrl} className="w-full h-full object-cover" muted/>
                        : item.type === 'audio' ? <div className="w-full h-full flex items-center justify-center bg-purple-900/30"><Mic2 className="w-8 h-8 text-purple-400"/></div>
                        : <img src={item.mediaUrl} alt={item.name} className="w-full h-full object-cover"/>}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-[#00FF66]/20 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 text-xs font-bold text-white bg-[#00FF66] text-black px-3 py-1.5 rounded-lg">Import →</div>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-white truncate">{item.name}</div>
                        <div className="text-[9px] text-slate-500 capitalize">{item.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
