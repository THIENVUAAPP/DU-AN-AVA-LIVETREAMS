import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, 
  Plus, 
  Trash2, 
  Play, 
  Square,
  Pause,
  Download,
  Scissors,
  Zap,
  CheckCircle2,
  RefreshCw,
  Globe,
  Radio,
  Eye,
  Maximize2,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import LivePlayer from './LivePlayer';

// Cấu hình API Euler để lách bản quyền TikTok Live
const EULER_API_KEY = "euler_ZmE5ODQzZmM0MzZlMDNlODBkNWEzNTUwZGFhZjQxMjNmN2RjMTA3ZjU2YWE0ZGNlOGU2MTQ1";

// Hàm hỗ trợ tự động bóc tách link thành dạng nhúng (iframe embed) hỗ trợ xem trực tiếp
const getEmbedUrl = (url) => {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  
  // YouTube
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    let videoId = '';
    if (lowerUrl.includes('watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (lowerUrl.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (lowerUrl.includes('/live/')) videoId = url.split('/live/')[1]?.split('?')[0];
    
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  }
  
  // Twitch
  if (lowerUrl.includes('twitch.tv/')) {
    const channel = url.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
    if (channel) return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true&muted=true`;
  }
  
  // Facebook
  if (lowerUrl.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=true&mute=1`;
  }
  
  // TikTok
  if (lowerUrl.includes('tiktok.com')) {
    const usernameMatch = url.match(/@([a-zA-Z0-9_.-]+)/);
    if (usernameMatch && usernameMatch[0]) {
      // Bắt buộc dùng /embed/ vì /player/v1/live bị chặn X-Frame-Options / Cookie
      return `https://www.tiktok.com/embed/${usernameMatch[0]}/live?autoplay=1&muted=1`;
    } else {
      return 'INVALID_TIKTOK_URL';
    }
  }
  
  // Mặc định trả về link gốc
  return url;
};

export default function LivestreamClonerStudio() {
  const [linksInput, setLinksInput] = useState('');
  const [streams, setStreams] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTabId, setActiveTabId] = useState(null);
  
  // History State
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('avalive_stream_history') || '[]');
    } catch {
      return [];
    }
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Parse pasted links
  const handleAddLinks = () => {
    if (!linksInput.trim()) return;
    setIsProcessing(true);
    
    const links = linksInput.split('\n').filter(l => l.trim() !== '');
    const newStreams = links.map((link, index) => {
      const isApiRequired = link.includes('tiktok') || link.includes('shopee');
      return {
        id: Date.now() + index,
        url: link.trim(),
        platform: link.includes('tiktok') ? 'TikTok' : link.includes('facebook') ? 'Facebook' : link.includes('shopee') ? 'Shopee' : 'Khác',
        status: 'live', // 'live', 'ended', 'downloading', 'downloaded'
        viewers: Math.floor(Math.random() * 5000) + 100,
        autoDownload: true,
        showHighlights: false,
        highlights: [],
        isPlaying: true, // Default to true to immediately load the real live stream
        isApiRequired,
        extractionStatus: isApiRequired ? 'extracting' : 'idle',
        streamUrl: '',
        title: ''
      };
    });
    
    setStreams(prev => [...prev, ...newStreams]);
    setLinksInput('');
    setIsProcessing(false);

    // Xử lý gọi API Serverless ngầm cho các luồng cần bóc tách (TikTok, Shopee)
    newStreams.forEach(async (stream) => {
      if (stream.isApiRequired) {
        try {
          const res = await fetch(`/api/extract?url=${encodeURIComponent(stream.url)}`);
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          if (data.streamUrl) {
            setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'success', streamUrl: data.streamUrl, title: data.title } : s));
          } else if (data.error === 'OFFLINE' || (data.error && data.error.includes('not currently live'))) {
            setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'offline' } : s));
          } else {
            setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
          }
        } catch (error) {
          console.error("Extraction error:", error);
          setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
        }
      }
    });
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ trình giám sát Live?')) {
      setStreams([]);
    }
  };

  const toggleAutoDownload = (id) => {
    setStreams(prev => prev.map(s => s.id === id ? { ...s, autoDownload: !s.autoDownload } : s));
  };

  const handleRemoveStream = (id) => {
    setStreams(prev => prev.filter(s => s.id !== id));
  };

  const simulateEndLive = (id) => {
    setStreams(prev => prev.map(s => {
      if (s.id === id) {
        // If it was live, and autoDownload is true, trigger download state immediately
        if (s.status === 'live' && s.autoDownload) {
          return { ...s, status: 'downloading', isPlaying: false };
        }
        return { ...s, status: 'ended', isPlaying: false };
      }
      return s;
    }));
  };

  const togglePlay = (id) => {
    setStreams(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, isPlaying: !s.isPlaying };
      }
      return s;
    }));
  };

  // Effect to handle auto-download progression
  useEffect(() => {
    const downloadingStreams = streams.filter(s => s.status === 'downloading');
    
    if (downloadingStreams.length > 0) {
      downloadingStreams.forEach(stream => {
        setTimeout(() => {
          setStreams(prev => prev.map(s => {
            if (s.id === stream.id) {
              // SAVE TO HISTORY WHEN DOWNLOADED
              const newHistoryItem = {
                ...s,
                status: 'downloaded',
                savedAt: new Date().toISOString()
              };
              setHistory(prevHistory => {
                // Prevent duplicate saves
                if (prevHistory.some(h => h.id === s.id)) return prevHistory;
                const updated = [newHistoryItem, ...prevHistory];
                localStorage.setItem('avalive_stream_history', JSON.stringify(updated));
                return updated;
              });
              return { ...s, status: 'downloaded' };
            }
            return s;
          }));
        }, 3000); // Simulate 3s download time
      });
    }
  }, [streams]);

  const extractHighlights = (id) => {
    setStreams(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          showHighlights: true,
          highlights: [
            { id: 1, title: 'Chốt Sale Đỉnh Điểm', duration: '45s', time: '00:15:30' },
            { id: 2, title: 'Tương tác cao nhất', duration: '60s', time: '01:05:10' },
            { id: 3, title: 'Viral Moment', duration: '15s', time: '01:45:00' }
          ]
        };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 lg:p-8 space-y-6 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-black relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <MonitorPlay className="w-32 h-32 text-blue-400" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <MonitorPlay className="w-8 h-8 text-blue-400" />
            MULTI-LIVE CLONER (SAO CHÉP ĐA LUỒNG)
          </h2>
          <p className="text-sm text-gray-400 font-mono leading-relaxed">
            Dán hàng chục hoặc hàng trăm liên kết Livestream vào bên dưới để tự động phát, giám sát, và Auto-Download Video về máy ngay khi phiên Live kết thúc. AI tự động nhận diện tương tác để gợi ý cắt Highlights tái sử dụng.
          </p>
          
          <div className="flex flex-col gap-3 pt-4">
            <textarea 
              value={linksInput}
              onChange={(e) => setLinksInput(e.target.value)}
              placeholder="Dán hàng loạt link Livestream tại đây (mỗi link 1 dòng)...&#10;https://www.tiktok.com/@user/live&#10;https://www.facebook.com/watch/live..."
              className="w-full h-32 bg-[#121216] border border-white/10 focus:border-blue-500/50 rounded-2xl p-4 text-xs font-mono text-gray-300 outline-none resize-none"
            />
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddLinks}
                disabled={isProcessing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-glow-blue transition-all cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                THÊM & GIÁM SÁT {linksInput.split('\n').filter(l => l.trim()).length || 0} LUỒNG
              </button>
              
              <button
                onClick={handleClearAll}
                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> XÓA TẤT CẢ
              </button>
              
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ml-auto"
              >
                <CheckCircle2 className="w-4 h-4" /> LỊCH SỬ ĐÃ LƯU
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STREAMS GRID */}
      {streams.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              ĐANG GIÁM SÁT {streams.length} LUỒNG LIVESTREAM ĐỒNG THỜI
            </h3>
            
            <div className="flex items-center gap-2 bg-[#121216] p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Chế độ Lưới (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setViewMode('tabs');
                  if (!activeTabId && streams.length > 0) setActiveTabId(streams[0].id);
                }}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'tabs' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Chế độ Từng Tab (Tabs)"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {viewMode === 'tabs' && streams.length > 0 && (
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {streams.map(s => (
                <button
                  key={`tab-${s.id}`}
                  onClick={() => setActiveTabId(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeTabId === s.id ? 'bg-blue-600 border-blue-500 text-white shadow-glow-blue' : 'bg-[#121216] border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                  {s.url.replace('https://www.', '').replace('https://', '')}
                </button>
              ))}
            </div>
          )}

          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
            {streams.map((stream) => (
              <div key={stream.id} className={`glass-panel rounded-2xl border border-white/10 bg-[#121216] overflow-hidden flex flex-col relative group transition-all hover:border-blue-500/50 hover:shadow-glow-blue-sm ${viewMode === 'tabs' && activeTabId !== stream.id ? 'hidden' : ''}`}>

                
                {/* DELETE INDIVIDUAL STREAM BUTTON */}
                <button 
                  onClick={() => handleRemoveStream(stream.id)}
                  className="absolute top-2 right-2 z-50 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
                  title="Xóa luồng này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* REAL-TIME VIDEO PLAYER IFRAME / NATIVE PLAYER */}
                <div className={`relative bg-black flex items-center justify-center overflow-hidden group/player ${
                  stream.url.toLowerCase().includes('tiktok.com') 
                    ? (viewMode === 'tabs' ? 'h-[75vh] aspect-[9/16] mx-auto' : 'aspect-[9/16] w-full') 
                    : 'aspect-video w-full'
                }`}>
                  {stream.isPlaying ? (
                    stream.isApiRequired ? (
                      stream.extractionStatus === 'extracting' ? (
                        <div className="text-white flex flex-col items-center justify-center h-full w-full bg-[#121216]">
                          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                          <span className="text-xs font-mono text-blue-400 font-bold uppercase">Đang Bóc Tách API...</span>
                        </div>
                      ) : stream.extractionStatus === 'success' && stream.streamUrl ? (
                        <div className="w-full h-full absolute inset-0">
                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                          />
                        </div>
                      ) : stream.extractionStatus === 'offline' ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-gray-500/20">
                          <MonitorPlay className="w-10 h-10 mb-2 opacity-50 text-gray-500" />
                          <span className="text-[12px] font-black uppercase text-white">TÀI KHOẢN ĐANG OFFLINE</span>
                          <span className="text-[9px] mt-1 uppercase text-gray-400">Người dùng này hiện không phát trực tiếp</span>
                        </div>
                      ) : getEmbedUrl(stream.url) === 'INVALID_TIKTOK_URL' ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-orange-500/20">
                          <span className="text-[12px] font-black uppercase text-orange-500 mb-2">LINK TIKTOK KHÔNG HỢP LỆ</span>
                          <span className="text-[10px] text-gray-300">Vui lòng nhập link chứa tên người dùng (VD: tiktok.com/@user/live)</span>
                        </div>
                      ) : (
                        <iframe 
                          src={getEmbedUrl(stream.url)}
                          title="Real-time Livestream Player"
                          className="w-full h-full border-none absolute inset-0"
                          allowFullScreen
                          allow="autoplay; encrypted-media; fullscreen"
                        />
                      )
                    ) : getEmbedUrl(stream.url) === 'INVALID_TIKTOK_URL' ? (
                      <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-orange-500/20">
                        <span className="text-[12px] font-black uppercase text-orange-500 mb-2">LINK TIKTOK KHÔNG HỢP LỆ</span>
                        <span className="text-[10px] text-gray-300">Vui lòng nhập link chứa tên người dùng (VD: tiktok.com/@user/live)</span>
                      </div>
                    ) : (
                      <iframe 
                        src={getEmbedUrl(stream.url)}
                        title="Real-time Livestream Player"
                        className="w-full h-full border-none absolute inset-0"
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen"
                      />
                    )
                  ) : (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center text-white/70">
                        <MonitorPlay className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider text-center px-4">
                          Đã tạm dừng xem luồng trực tiếp<br/>
                          <span className="text-[9px] text-gray-500 lowercase mt-1 block">{stream.url}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
                    {stream.status === 'live' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white flex items-center gap-1 shadow-glow-red animate-pulse">
                        <Radio className="w-3 h-3" /> LIVE
                      </span>
                    )}
                    {stream.status === 'ended' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-gray-600 text-white">ĐÃ KẾT THÚC</span>
                    )}
                    {stream.status === 'downloading' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-black flex items-center gap-1 shadow-glow-amber">
                        <RefreshCw className="w-3 h-3 animate-spin" /> ĐANG TẢI...
                      </span>
                    )}
                    {stream.status === 'downloaded' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-glow-emerald">
                        <CheckCircle2 className="w-3 h-3" /> ĐÃ LƯU MÁY
                      </span>
                    )}
                    
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono border border-white/20 backdrop-blur-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {stream.viewers}
                    </span>
                  </div>


                  <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all ${stream.isPlaying ? 'opacity-0 group-hover/player:opacity-100 bg-black/40 pointer-events-none' : ''}`}>
                    <button
                      onClick={(e) => {
                        const container = e.currentTarget.closest('.group\\/player');
                        if (container) {
                          if (document.fullscreenElement) {
                            document.exitFullscreen();
                          } else {
                            container.requestFullscreen();
                          }
                        }
                      }}
                      className="absolute top-2 left-2 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white pointer-events-auto cursor-pointer transition-all z-50"
                      title="Phóng to toàn màn hình"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {stream.status === 'live' ? (
                      <button 
                        onClick={() => togglePlay(stream.id)} 
                        className={`p-4 rounded-full transition-all cursor-pointer group hover:scale-110 shadow-2xl ${stream.isPlaying ? 'bg-red-500/80 hover:bg-red-500 pointer-events-auto' : 'bg-emerald-500/80 hover:bg-emerald-500'}`}
                        title={stream.isPlaying ? "Tạm dừng xem trực tiếp" : "Xem Live trực tiếp (Real-time)"}
                      >
                        {stream.isPlaying ? (
                          <Pause className="w-8 h-8 text-white transition-all" fill="currentColor" />
                        ) : (
                          <Play className="w-8 h-8 text-white transition-all ml-1" fill="currentColor" />
                        )}
                      </button>
                    ) : stream.status === 'downloading' ? (
                      <Download className="w-12 h-12 text-amber-400 animate-bounce pointer-events-none" />
                    ) : stream.status === 'downloaded' ? (
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 pointer-events-none" />
                    ) : (
                      <Square className="w-12 h-12 text-gray-500 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* INFO AND CONTROLS */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-[10px] font-mono text-gray-400 truncate mb-1 bg-white/5 p-1 rounded" title={stream.url}>{stream.url}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{stream.platform} Stream</span>
                      <label className="flex items-center gap-1.5 cursor-pointer" title="Hệ thống sẽ tự động tải video ngay khi luồng live ngắt kết nối">
                        <input 
                          type="checkbox" 
                          checked={stream.autoDownload} 
                          onChange={() => toggleAutoDownload(stream.id)}
                          className="accent-blue-500 w-3 h-3 cursor-pointer"
                        />
                        <span className="text-[10px] text-blue-300 font-bold">Tự Auto-Download khi Off</span>
                      </label>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                    <button 
                      onClick={() => simulateEndLive(stream.id)}
                      disabled={stream.status !== 'live'}
                      className="py-1.5 px-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-[10px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3" /> SIMULATE END LIVE
                    </button>
                    
                    <button 
                      onClick={() => extractHighlights(stream.id)}
                      disabled={stream.showHighlights || stream.status === 'downloading'}
                      className="py-1.5 px-2 bg-blue-600/30 border border-blue-500/40 hover:bg-blue-600/50 disabled:opacity-30 rounded-lg text-[10px] font-black text-blue-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Scissors className="w-3 h-3" /> CẮT HIGHLIGHT (AI)
                    </button>
                  </div>

                  {/* HIGHLIGHTS SECTION */}
                  {stream.showHighlights && (
                    <div className="mt-2 space-y-2 pt-2 border-t border-white/10">
                      <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> AI ĐỀ XUẤT CẮT (REUSE)
                      </div>
                      <div className="space-y-1.5">
                        {stream.highlights.map(hl => (
                          <div key={hl.id} className="bg-black/40 border border-white/5 p-1.5 rounded-lg flex items-center justify-between group/hl hover:border-amber-500/30">
                            <div>
                              <p className="text-[9px] font-bold text-white">{hl.title}</p>
                              <p className="text-[8px] text-gray-400 font-mono">Tại: {hl.time} • Dài: {hl.duration}</p>
                            </div>
                            <button 
                              className="p-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all cursor-pointer" 
                              title="Tải đoạn cắt này"
                              onClick={() => alert(`✂️ Đã tải về đoạn cắt "${hl.title}" độ dài ${hl.duration}.`)}
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    
      {/* HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-white/10 rounded-3xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[80vh] shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                LỊCH SỬ VIDEO ĐÃ LƯU
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
              >
                ĐÓNG
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <Square className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Chưa có video nào được lưu lại.</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                    <div>
                      <p className="text-blue-400 font-mono text-sm break-all">{item.url}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.savedAt).toLocaleString('vi-VN')} • {item.platform} • Lượt xem max: {item.viewers}
                      </p>
                    </div>
                    <button className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/50">
                      <Download className="w-4 h-4" /> MỞ THƯ MỤC
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-white/10 bg-black/40 text-right">
              <button 
                onClick={() => {
                  if(window.confirm('Xóa sạch lịch sử?')) {
                    setHistory([]);
                    localStorage.removeItem('avalive_stream_history');
                  }
                }}
                className="text-xs text-red-500 hover:text-red-400 font-bold"
              >
                XÓA TOÀN BỘ LỊCH SỬ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
