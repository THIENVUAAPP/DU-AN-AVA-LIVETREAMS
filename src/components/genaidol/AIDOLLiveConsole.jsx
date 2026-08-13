import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Settings, Eye, Play, Square, RefreshCw, Download, Upload, Trash2,
  Video, Mic2, Volume2, Wifi, WifiOff, Radio, CheckCircle, AlertCircle,
  Plus, Search, X, ChevronDown, Monitor, Zap, SkipForward, Pause
} from 'lucide-react';
import AIAudioPlayer from './AIAudioPlayer';
import {
  LIVE_CATEGORIES, initLiveDB, addLiveMedia, getAllLiveMedia, deleteLiveMedia, importFromAIDOLDB
} from '../../lib/liveKhoDB';

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
  const [rtmpKey, setRtmpKey] = useState('');
  const [streamStatus, setStreamStatus] = useState('idle'); // idle | connecting | live | error
  const videoRef = useRef(null);
  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [activeJobItem, setActiveJobItem] = useState(null);
  const [videoQueue, setVideoQueue] = useState([]);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);

  // ── Simulator State ──
  const [simName, setSimName] = useState('Minh');
  const [simComment, setSimComment] = useState('');
  const [simGift, setSimGift] = useState('Hoa hồng (Rose)');
  const [isProcessingEvent, setIsProcessingEvent] = useState(false);
  const audioPlayerRef = useRef(null);
  const [viewerHistory, setViewerHistory] = useState([]); // Lịch sử 10 tương tác gần nhất
  const [activeBrainPack, setActiveBrainPack] = useState('talk'); // Bộ não chủ đề
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
          apiKey: localStorage.getItem('gemini_api_key'),
          eventType: type,
          payload,
          viewerHistory,
          brainPack: activeBrainPack
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
  };

  // ── Build video queue for live ──
  const handleStartLive = () => {
    const storyItems = liveMedia.filter(i => i.category === 'story' && (i.type === 'video' || i.type === 'audio'));
    if (storyItems.length > 0) {
      setVideoQueue(storyItems);
      setCurrentVideoIdx(0);
      handlePlayFromKho(storyItems[0]);
    }
    setIsAILive(true);
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
                  <button className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${rtmpKey ? 'bg-[#ff0050] hover:bg-[#cc0040] text-white' : 'bg-white/5 text-slate-500 border border-slate-700'}`}>
                    {rtmpKey ? <><Wifi className="w-3.5 h-3.5"/> Kết nối TikTok Live</> : <><WifiOff className="w-3.5 h-3.5"/> Nhập Stream Key để kết nối</>}
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
          <div className="flex border-b border-slate-700/50 bg-[#1a1b26]/80 px-4 pt-2 flex-shrink-0">
            {[['kho','📦 Kho Video Live'],['ai-player','🤖 AI Director'],['scripts','📄 Kịch bản'],['stream','📡 Stream Setup']].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-lg mr-1 transition-all ${activeTab === id ? 'bg-[#0D0F1A] text-[#00FF66] border-t border-l border-r border-slate-700/50' : 'text-slate-500 hover:text-slate-300'}`}>
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

            {/* ══ TAB: AI DIRECTOR ══ */}
            {activeTab === 'ai-player' && (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-black text-white mb-1">🤖 AI Director</h3>
                  <p className="text-[10px] text-slate-500">Điều phối hàng đợi TTS, xen kẽ bình luận và tặng quà tự động.</p>
                </div>

                {/* ── CHỌN BRAIN PACK ── */}
                <div className="bg-[#1a1b26] border border-slate-700 rounded-xl p-4">
                  <div className="text-xs font-black text-white mb-3">🧠 Bộ não Chủ đề (Brain Pack)</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { id: 'talk', label: 'Tương tác', icon: '💬' },
                      { id: 'sales', label: 'Bán hàng', icon: '🛒' },
                      { id: 'dance', label: 'Idol Nhảy', icon: '💃' },
                      { id: 'sing', label: 'Idol Hát', icon: '🎤' }
                    ].map(pack => (
                      <button key={pack.id} onClick={() => setActiveBrainPack(pack.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold transition-all border ${activeBrainPack === pack.id ? 'bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50 shadow-glow-green' : 'bg-[#0D0F1A] text-slate-400 border-slate-700 hover:text-white'}`}>
                        <span className="text-sm">{pack.icon}</span>
                        {pack.label}
                      </button>
                    ))}
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
                      <option value="Hoa hồng (Rose)">🌹 Hoa hồng (1 xu)</option>
                      <option value="Trái tim (Heart)">❤️ Trái tim (10 xu)</option>
                      <option value="Kính râm (Sunglasses)">🕶️ Kính râm (199 xu)</option>
                      <option value="Sư tử (Lion)">🦁 Sư tử (29999 xu)</option>
                      <option value="Siêu xe (Sports Car)">🏎️ Siêu xe (39999 xu)</option>
                    </select>
                    <button onClick={() => handleLiveEvent('GIFT', { name: simName, gift: simGift })} className="px-4 bg-pink-500/20 text-pink-400 border border-pink-500/40 rounded text-xs font-bold hover:bg-pink-500/30 transition-colors">Tặng Quà</button>
                  </div>

                  <div className="bg-[#0D0F1A] border border-slate-700 rounded p-2 h-32 overflow-y-auto custom-scrollbar flex flex-col-reverse">
                    {viewerHistory.length === 0 ? <div className="text-[10px] text-slate-600 text-center py-4">Chưa có sự kiện nào</div> : (
                      viewerHistory.slice().reverse().map((h, i) => (
                        <div key={i} className="mb-2 text-[10px] border-b border-slate-800 pb-2">
                          <div className="text-slate-400">[{h.time}] <span className="font-bold text-white">{h.payload.name}</span> {h.type === 'GIFT' ? <span className="text-pink-400">đã tặng {h.payload.gift}</span> : h.type === 'COMMENT' ? <span className="text-blue-400">đã bình luận: "{h.payload.text}"</span> : 'đã tham gia Live'}</div>
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

            {/* ══ TAB: KỊCH BẢN ══ */}
            {activeTab === 'scripts' && (
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-black text-white mb-1">📄 Kịch bản đã lưu</h3>
                  <p className="text-[10px] text-slate-500">Các kịch bản được tạo từ ChatGPT/Gemini trong tab "Giọng nói".</p>
                </div>

                {savedJobs.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                    <div className="text-3xl mb-3">📄</div>
                    <div className="text-sm font-bold text-slate-400 mb-2">Chưa có kịch bản nào</div>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">Vào tab "Giọng nói" → Soạn kịch bản AI → Bấm "Lưu Kịch Bản & Giọng (Đẩy lên Live)"</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedJobs.map((job, idx) => (
                      <div key={idx} className={`p-4 border rounded-xl transition-all cursor-pointer hover:border-[#00FF66]/50 ${activeJobItem?.key === job.key ? 'border-[#00FF66] bg-[#00FF66]/5' : 'border-slate-700 bg-[#1a1b26] hover:bg-[#1f2335]'}`}
                        onClick={() => setActiveJobItem(job)}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-bold text-white truncate">{job.jobName || 'Kịch bản AI'}</div>
                          {activeJobItem?.key === job.key && <span className="text-[9px] text-[#00FF66] font-black px-2 py-0.5 bg-[#00FF66]/20 rounded-full">✓ Đang dùng</span>}
                        </div>
                        <div className="text-[10px] text-slate-500">🎙️ {job.voiceProvider || 'TTS'} • {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : ''}</div>
                        {job.scriptContent && <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{job.scriptContent.slice(0, 150)}...</p>}
                      </div>
                    ))}
                  </div>
                )}
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
