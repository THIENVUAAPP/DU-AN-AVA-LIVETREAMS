import React, { useState, useEffect, useRef } from 'react';
import LivePlayer from './LivePlayer';
import AutoCaptchaSolver from './AutoCaptchaSolver';
import { BarChart2, User, MonitorPlay, Plus, Trash2, Play, Square, Pause, Download, Scissors, Zap, CheckCircle2, RefreshCw, Globe, Radio, Eye, Maximize2, LayoutGrid, LayoutList, AlertTriangle, AlertCircle, Settings, RotateCcw, X, LayoutTemplate, VolumeX, Volume2 } from 'lucide-react';


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
      const username = usernameMatch[0].replace('@', '');
      return `https://www.tiktok.com/@${username}/live`;
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
  const [showAutoCaptcha, setShowAutoCaptcha] = useState({});
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
        status: 'live',
        viewers: Math.floor(Math.random() * 5000) + 100,
        autoDownload: true,
        showHighlights: false,
        highlights: [],
        isPlaying: true, // Tự động phát khi trích xuất thành công
        isApiRequired: isApiRequired,
        extractionStatus: isApiRequired ? 'extracting' : 'success',
        streamUrl: '',
        title: '',
        isRecording: false,
        isMuted: true // Mặc định tắt tiếng để AutoPlay hoạt động
      };
    });
    
    setStreams(prev => [...prev, ...newStreams]);
    setLinksInput('');
    setIsProcessing(false);

    // Xử lý song song để các luồng không phải chờ đợi nhau (giảm thiểu tình trạng load lâu)
    const processExtractions = async () => {
      await Promise.allSettled(
        newStreams.map(async (stream) => {
          if (stream.isApiRequired) {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 60000); // Giảm timeout xuống 60s
              const res = await fetch(`/api/extract?url=${encodeURIComponent(stream.url)}`, { signal: controller.signal });
              clearTimeout(timeoutId);
              
              if (!res.ok) throw new Error('API Error');
              const data = await res.json();
              if (data.streamUrl) {
                setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'success', streamUrl: data.streamUrl, title: data.title } : s));
              } else if (data.error === 'OFFLINE' || (data.error && data.error.includes('not currently live')) || (data.stderr && data.stderr.includes('not currently live'))) {
                setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'offline' } : s));
              } else {
                setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
              }
            } catch (error) {
              console.error("Extraction error:", error);
              setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
            }
          }
        })
      );
    };
    processExtractions();
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

  const toggleMute = (id) => {
    setStreams(prev => prev.map(s => s.id === id ? { ...s, isMuted: !s.isMuted } : s));
  };

  const handleRetryExtraction = async (stream) => {
    setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'extracting' } : s));
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(`/api/extract?url=${encodeURIComponent(stream.url)}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (data.streamUrl) {
        setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'success', streamUrl: data.streamUrl, title: data.title } : s));
      } else if (data.error === 'OFFLINE' || (data.error && data.error.includes('not currently live')) || (data.stderr && data.stderr.includes('not currently live'))) {
        setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'offline' } : s));
      } else {
        setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
      }
    } catch (error) {
      console.error("Retry Extraction error:", error);
      setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'error' } : s));
    }
  };

  const mediaRecorders = useRef({});
  const recordedChunks = useRef({});

  const handleManualRecord = (id, start) => {
    setStreams(prev => {
      const stream = prev.find(s => s.id === id);
      if (!stream) return prev;

      if (start) {
        try {
          const videoEl = document.getElementById(`video-${id}`);
          if (!videoEl) throw new Error("Video element not found");
          
          const mediaStream = videoEl.captureStream();
          const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
          
          recordedChunks.current[id] = [];
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.current[id].push(e.data);
          };
          
          recorder.onstop = () => {
            const blob = new Blob(recordedChunks.current[id], { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording-${id}-${new Date().getTime()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
          };
          
          recorder.start();
          mediaRecorders.current[id] = recorder;
          console.log(`🔴 Đã bắt đầu ghi hình luồng: ${stream.url}`);
          return prev.map(s => s.id === id ? { ...s, isRecording: true } : s);
        } catch (e) {
          console.error(`Lỗi ghi hình: ${e.message}`);
          return prev;
        }
      } else {
        const recorder = mediaRecorders.current[id];
        if (recorder && recorder.state !== 'inactive') {
          recorder.stop();
        }
        console.log(`⏹️ Đã dừng ghi hình luồng: ${stream.url}. Video đang được lưu...`);
        return prev.map(s => s.id === id ? { ...s, isRecording: false } : s);
      }
    });
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

                
                {/* HEADER CONTROLS (MUTE & DELETE) */}
                <div className="absolute top-2 right-2 z-50 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleMute(stream.id)}
                    className={`p-1.5 rounded-md text-white transition-colors shadow-lg backdrop-blur-sm ${stream.isMuted !== false ? 'bg-gray-600/80 hover:bg-gray-500' : 'bg-blue-600/80 hover:bg-blue-500'}`}
                    title={stream.isMuted !== false ? "Mở âm thanh" : "Tắt âm thanh"}
                  >
                    {stream.isMuted !== false ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleRemoveStream(stream.id)}
                    className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md shadow-lg backdrop-blur-sm"
                    title="Xóa luồng này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

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
                           {/* FAKE TIKTOK LOADING */}
                           <div className="flex items-center gap-1 mb-4">
                             <div className="w-4 h-4 rounded-full bg-[#00f2fe] animate-ping opacity-75"></div>
                             <div className="w-4 h-4 rounded-full bg-[#fe0979] animate-ping opacity-75" style={{animationDelay: '0.2s'}}></div>
                           </div>
                           <span className="text-[10px] text-gray-400">Đang kết nối luồng siêu tốc...</span>
                        </div>
                      ) : stream.extractionStatus === 'success' && stream.streamUrl ? (
                        <div className="w-full h-full absolute inset-0 font-sans group overflow-hidden">
                          <LivePlayer 
                            url={(() => {
                              if (stream.ext === 'flv' || stream.protocol === 'http_dash_segments' || stream.streamUrl.includes('.flv')) {
                                return stream.streamUrl;
                              }
                              const proxyBase = '';
                              const isM3u8 = stream.protocol?.includes('m3u8') || stream.streamUrl.includes('.m3u8');
                              return `${proxyBase}/proxy-${isM3u8 ? 'hls' : 'ts'}?url=${encodeURIComponent(stream.streamUrl)}`;
                            })()}
                            playing={true} 
                            muted={stream.isMuted !== false} 
                            videoId={`video-${stream.id}`}
                            isFlv={stream.ext === 'flv' || stream.protocol === 'http_dash_segments' || stream.streamUrl.includes('.flv')}
                            isM3u8={stream.protocol?.includes('m3u8') || stream.streamUrl.includes('.m3u8')}
                            onVideoMount={(v) => {
                              if (stream.autoDownload && !stream.isRecording) {
                                setTimeout(() => handleManualRecord(stream.id, true), 2000);
                              }
                            }}
                          />
                          
                          {/* Giao diện TikTok Mobile Ảo (Overlay) - Dùng % để tự co giãn theo mọi kích thước khung */}
                          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-[3%]" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 15%, transparent 70%, rgba(0,0,0,0.6) 100%)' }}>
                             <div className="flex items-start justify-between">
                                <div className="flex items-center bg-black/30 backdrop-blur-md rounded-full p-[1%] pr-[3%] border border-white/10 max-w-[60%]">
                                   <div className="w-[15%] aspect-square min-w-[20px] rounded-full bg-gradient-to-br from-blue-400 to-pink-500 p-[2%]">
                                      <div className="w-full h-full bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                                         <User className="w-[70%] h-[70%] text-white/50" />
                                      </div>
                                   </div>
                                   <div className="ml-[4%] flex flex-col flex-1 overflow-hidden">
                                      <span className="text-white text-[8px] sm:text-[10px] font-bold truncate">{stream.title || 'Host'}</span>
                                      <span className="text-white/80 text-[6px] sm:text-[8px]">1.2K người xem</span>
                                   </div>
                                   <div className="ml-[4%] bg-[#fe2c55] text-white text-[7px] sm:text-[9px] font-bold px-[4%] py-[2%] rounded-full whitespace-nowrap">+ Theo dõi</div>
                                </div>
                                
                             </div>
                             
                             {/* Right Icons */}
                             <div className="absolute right-[3%] bottom-[15%] flex flex-col items-center gap-[10%] h-[40%] justify-end">
                                <div className="flex flex-col items-center gap-[5%] mb-[20%]">
                                   <div className="w-[8cqw] min-w-[24px] max-w-[40px] aspect-square rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                                      <User className="w-[50%] h-[50%] text-white" />
                                   </div>
                                </div>
                                <div className="flex flex-col items-center gap-[5%] mb-[15%]">
                                   <svg viewBox="0 0 24 24" className="w-[8cqw] min-w-[24px] max-w-[40px] aspect-square text-white drop-shadow-md" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                   <span className="text-white text-[7px] sm:text-[9px] font-bold drop-shadow-md">14.5K</span>
                                </div>
                                <div className="flex flex-col items-center gap-[5%] mb-[15%]">
                                   <svg viewBox="0 0 24 24" className="w-[8cqw] min-w-[24px] max-w-[40px] aspect-square text-white drop-shadow-md" fill="currentColor"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                                   <span className="text-white text-[7px] sm:text-[9px] font-bold drop-shadow-md">324</span>
                                </div>
                                <div className="flex flex-col items-center gap-[5%]">
                                   <svg viewBox="0 0 24 24" className="w-[8cqw] min-w-[24px] max-w-[40px] aspect-square text-white drop-shadow-md" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                                   <span className="text-white text-[7px] sm:text-[9px] font-bold drop-shadow-md">Share</span>
                                </div>
                             </div>
                             
                             {/* Bottom Chat */}
                             <div className="absolute bottom-[3%] left-[3%] right-[15%]">
                                <p className="text-white text-[8px] sm:text-xs font-medium mb-[2%] drop-shadow-md truncate">Cửa hàng TikTok chính hãng...</p>
                                <div className="flex items-center gap-[2%]">
                                   <div className="bg-black/20 backdrop-blur-md rounded-full px-[4%] py-[2%] text-[7px] sm:text-[10px] text-white/60 border border-white/10 flex-1 truncate">
                                      Thêm bình luận...
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      ) : stream.extractionStatus === 'offline' ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-gray-500/20">
                          <MonitorPlay className="w-10 h-10 mb-2 opacity-50 text-gray-500" />
                          <span className="text-[12px] font-black uppercase text-white">TÀI KHOẢN ĐANG OFFLINE</span>
                          <span className="text-[9px] mt-1 uppercase text-gray-400">Người dùng này hiện không phát trực tiếp</span>
                        </div>
                      ) : stream.extractionStatus === 'error' && getEmbedUrl(stream.url) !== 'INVALID_TIKTOK_URL' ? (
                        <div className="w-full h-full absolute inset-0 font-sans bg-[#121216] flex flex-col items-center justify-center overflow-hidden border border-red-500/20">
                          {showAutoCaptcha[stream.id] ? (
                            <AutoCaptchaSolver onSolved={() => setShowAutoCaptcha(prev => ({ ...prev, [stream.id]: false }))} />
                          ) : null}
                          
                          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4 text-center">
                            <AlertTriangle className="w-12 h-12 mb-3 opacity-80 text-red-500" />
                            <span className="text-[14px] font-black uppercase text-red-500">KHÔNG THỂ TRÍCH XUẤT</span>
                            <span className="text-[10px] mt-2 text-gray-400 max-w-[80%]">Hệ thống mạng vừa bị TikTok chặn (Yêu cầu Captcha). Vui lòng thử lại để nhận video gốc chuẩn Mobile.</span>
                            
                            <button 
                              onClick={() => handleRetryExtraction(stream)}
                              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-glow-blue cursor-pointer"
                            >
                              BẤM ĐỂ THỬ LẠI (RETRY)
                            </button>
                          </div>
                        </div>
                      ) : getEmbedUrl(stream.url) === 'INVALID_TIKTOK_URL' ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-orange-500/20">
                          <span className="text-[12px] font-black uppercase text-orange-500 mb-2">LINK TIKTOK KHÔNG HỢP LỆ</span>
                          <span className="text-[10px] text-gray-300">Vui lòng nhập link chứa tên người dùng (VD: tiktok.com/@user/live)</span>
                        </div>
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-red-500/20">
                          <AlertTriangle className="w-8 h-8 mb-2 opacity-70 text-red-500" />
                          <span className="text-[12px] font-black uppercase text-red-500">LỖI KẾT NỐI API TRÍCH XUẤT</span>
                          <p className="text-[9px] mt-2 text-gray-400 text-center px-4">
                            Hệ thống mạng của bạn vừa bị TikTok yêu cầu giải Captcha.<br/>
                            Vui lòng đổi IP mạng (Tắt bật lại Wifi/4G) rồi tải lại trang!
                          </p>
                        </div>
                      )
                    ) : getEmbedUrl(stream.url) === 'INVALID_TIKTOK_URL' ? (
                      <div className="text-gray-400 flex flex-col items-center justify-center p-4 text-center h-full w-full bg-[#121216] border border-orange-500/20">
                        <span className="text-[12px] font-black uppercase text-orange-500 mb-2">LINK TIKTOK KHÔNG HỢP LỆ</span>
                        <span className="text-[10px] text-gray-300">Vui lòng nhập link chứa tên người dùng (VD: tiktok.com/@user/live)</span>
                      </div>
                    ) : (
                      <iframe 
                        src={getEmbedUrl(stream.url)}
                        title="Livestream Player"
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
                        title={stream.isPlaying ? "Tạm dừng xem trực tiếp" : "Xem trực tiếp"}
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
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    <button 
                      onClick={() => toggleAutoDownload(stream.id)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${stream.autoDownload ? 'bg-blue-600/50 text-blue-200 border border-blue-500/50' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
                    >
                      <Zap className="w-3 h-3" /> AUTO REC
                    </button>
                    
                    <button 
                      onClick={() => handleManualRecord(stream.id, true)}
                      disabled={stream.isRecording}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${stream.isRecording ? 'bg-red-600/50 text-red-200 border border-red-500/50 animate-pulse' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                      <Play className="w-3 h-3" /> REC
                    </button>

                    <button 
                      onClick={() => handleManualRecord(stream.id, false)}
                      disabled={!stream.isRecording}
                      className="py-1.5 px-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-[10px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Square className="w-3 h-3" /> STOP
                    </button>
                  </div>

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
