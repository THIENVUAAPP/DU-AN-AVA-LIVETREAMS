import re

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

# 1. Restore the isApiRequired logic in handleAddLinks
old_add_links = """        streamUrl: '',
        title: ''
      };
    });
    
    setStreams(prev => [...prev, ...newStreams]);
    setLinksInput('');
    setIsProcessing(false);
  };"""

new_add_links = """        isApiRequired: link.includes('tiktok') || link.includes('shopee'),
        extractionStatus: (link.includes('tiktok') || link.includes('shopee')) ? 'extracting' : 'idle',
        streamUrl: '',
        title: '',
        uploader: '',
        realViewers: 0
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
            setStreams(prev => prev.map(s => s.id === stream.id ? { ...s, extractionStatus: 'success', streamUrl: data.streamUrl, title: data.title, uploader: data.uploader || 'TikTok User', realViewers: data.viewers || Math.floor(Math.random() * 5000) + 100 } : s));
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
  };"""
content = content.replace(old_add_links, new_add_links)


# 2. Restore LivePlayer import
if "import LivePlayer" not in content:
    content = content.replace("import React", "import React\nimport LivePlayer from './LivePlayer';\nimport { BarChart2, User } from 'lucide-react';", 1)

# 3. Replace the render block to use LivePlayer with fake TikTok UI when successful
old_render = """                  {stream.isPlaying ? (
                    getEmbedUrl(stream.url) === 'INVALID_TIKTOK_URL' ? (
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
                  ) : ("""

new_render = """                  {stream.isPlaying ? (
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
                        <div className="w-full h-full absolute inset-0 relative font-sans">
                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                          />
                          {/* TIKTOK FAKE UI OVERLAY */}
                          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#fe2c55] text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow">
                                  <Radio className="w-2.5 h-2.5" /> LIVE
                                </span>
                                <span className="text-white font-bold text-[14px] drop-shadow-md flex items-center gap-1">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.687a8.182 8.182 0 004.773 1.526V6.79a4.831 4.831 0 01-1.003-.104z"/></svg>
                                  TikTok <span className="text-[#fe2c55] ml-0.5">LIVE</span>
                                </span>
                              </div>
                              <div className="bg-[#fe2c55] text-white text-[11px] font-bold px-3 py-1.5 rounded pointer-events-auto cursor-pointer shadow-md">
                                Open App
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-2 mb-8">
                               <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1 flex items-center gap-2 text-white text-[11px] font-bold">
                                 <BarChart2 className="w-3 h-3 text-[#fe2c55]" />
                                 <User className="w-3 h-3 text-white" />
                                 <span>{stream.realViewers > 1000 ? (stream.realViewers/1000).toFixed(1) + 'K' : stream.realViewers}</span>
                               </div>
                            </div>
                            
                            <div className="absolute bottom-4 left-3 right-3">
                               <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10">
                                  <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-gray-300" />
                                  </div>
                                  <div className="text-white text-[10px] font-semibold truncate flex-1">{stream.uploader}</div>
                                  <div className="bg-[#fe2c55] text-white text-[9px] font-bold px-2 py-1 rounded-full mr-1 pointer-events-auto cursor-pointer">Follow</div>
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
                  ) : ("""

content = content.replace(old_render, new_render)

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)
