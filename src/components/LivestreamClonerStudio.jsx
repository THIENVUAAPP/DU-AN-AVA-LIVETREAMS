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
  Eye
} from 'lucide-react';

export default function LivestreamClonerStudio() {
  const [linksInput, setLinksInput] = useState('');
  const [streams, setStreams] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse pasted links
  const handleAddLinks = () => {
    if (!linksInput.trim()) return;
    setIsProcessing(true);
    
    setTimeout(() => {
      const links = linksInput.split('\n').filter(l => l.trim() !== '');
      const newStreams = links.map((link, index) => ({
        id: Date.now() + index,
        url: link.trim(),
        platform: link.includes('tiktok') ? 'TikTok' : link.includes('facebook') ? 'Facebook' : link.includes('shopee') ? 'Shopee' : 'Khác',
        status: 'live', // 'live', 'ended', 'downloading', 'downloaded'
        viewers: Math.floor(Math.random() * 5000) + 100,
        thumbnail: 'https://images.unsplash.com/photo-1516280440502-6014b2d131eb?auto=format&fit=crop&w=300&q=80',
        autoDownload: true,
        showHighlights: false,
        highlights: [],
        isPlaying: false
      }));
      
      setStreams(prev => [...prev, ...newStreams]);
      setLinksInput('');
      setIsProcessing(false);
    }, 1000);
  };

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ trình giám sát Live?')) {
      setStreams([]);
    }
  };

  const toggleAutoDownload = (id) => {
    setStreams(prev => prev.map(s => s.id === id ? { ...s, autoDownload: !s.autoDownload } : s));
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {streams.map((stream) => (
              <div key={stream.id} className="glass-panel rounded-2xl border border-white/10 bg-[#121216] overflow-hidden flex flex-col relative group transition-all hover:border-blue-500/50 hover:shadow-glow-blue-sm">
                
                {/* VIDEO PLAYER SIMULATION */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                  {stream.isPlaying ? (
                    <video 
                      src="https://www.w3schools.com/html/mov_bbb.mp4" 
                      autoPlay 
                      loop 
                      muted 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={stream.thumbnail} alt="Stream Thumbnail" className="w-full h-full object-cover opacity-60" />
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

                  <div className="absolute inset-0 flex items-center justify-center">
                    {stream.status === 'live' ? (
                      <button 
                        onClick={() => togglePlay(stream.id)} 
                        className={`p-3 rounded-full transition-all cursor-pointer group ${stream.isPlaying ? 'bg-transparent hover:bg-black/50 opacity-0 hover:opacity-100' : 'bg-black/50 hover:bg-black/80'}`}
                      >
                        {stream.isPlaying ? (
                          <Pause className="w-10 h-10 text-white/70 group-hover:text-white transition-all" fill="currentColor" />
                        ) : (
                          <Play className="w-10 h-10 text-white/70 group-hover:text-emerald-400 transition-all ml-1" fill="currentColor" />
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

    </div>
  );
}
