import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Fix Matrix Grid
old_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 z-0">
                         <ReactPlayer url={activeVideoUrl} playing loop muted controls width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                      </div>
                    )"""
new_matrix_video = """{streamSourceMode === "url" && activeVideoUrl ? (
                      <div className="w-full h-full absolute inset-0 z-0 bg-black flex items-center justify-center pointer-events-auto">
                         <ReactPlayer url={activeVideoUrl} playing loop muted controls width="100%" height="100%" />
                      </div>
                    )"""
content = content.replace(old_matrix_video, new_matrix_video)

# Replace overlays in Matrix Grid to hide them if url
old_matrix_overlay = """                    <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">"""
new_matrix_overlay = """                    {streamSourceMode !== "url" && (
                      <>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">"""
content = content.replace(old_matrix_overlay, new_matrix_overlay)

old_matrix_overlay_end = """                      <span className="text-emerald-400 font-mono text-[9px] flex-shrink-0">● 60 FPS</span>
                    </div>"""
new_matrix_overlay_end = """                      <span className="text-emerald-400 font-mono text-[9px] flex-shrink-0">● 60 FPS</span>
                    </div>
                      </>
                    )}"""
content = content.replace(old_matrix_overlay_end, new_matrix_overlay_end)

# Fix Single Monitor
start_marker = "/* SINGLE DETAILED CHANNEL LIVE MONITOR */"
end_marker = "{/* Connected Channels List */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """/* SINGLE DETAILED CHANNEL LIVE MONITOR */
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black flex items-center justify-center">
                
                {/* VIDEO / CAMERA SOURCE */}
                {streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto flex items-center justify-center">
                     <ReactPlayer key={activeVideoUrl} url={activeVideoUrl} playing loop muted controls width="100%" height="100%" />
                  </div>
                ) : (streamSourceMode === "video" && activeVideo?.url) ? (
                  <video
                    key={activeVideo?.id}
                    src={activeVideo?.url}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain absolute inset-0 z-0 pointer-events-auto"
                  />
                ) : streamSourceMode === "direct" ? (
                  <div className="absolute inset-0 z-0">
                     <LiveCameraFeed className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white/50 text-xs absolute inset-0 z-0">
                     <span className="animate-pulse">⚠️ VUI LÒNG CHỌN NGUỒN PHÁT</span>
                  </div>
                )}
                
                {/* OVERLAYS (CONDITIONAL BASED ON SOURCE MODE) */}
                <div className="absolute inset-0 pointer-events-none z-10">

                    {streamSourceMode === "url" && activeVideoUrl ? (
                      /* SIMPLIFIED OVERLAYS FOR URL PREVIEW & DELETE BUTTON */
                      <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
                        <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 backdrop-blur-md">
                          Xem Trước Video Từ Link
                        </span>
                        <button 
                          onClick={() => {
                             setActiveVideoUrl('');
                          }} 
                          className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs shadow-glow-red transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg> XÓA VIDEO
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Stream status overlay info (BOTTOM) */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                          <div className="flex items-center gap-3">
                            {isLive || liveChannelIds.includes(activeMonitorChannelObj?.id) ? (
                              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black flex items-center gap-1.5 shadow-glow-red animate-pulse">
                                <Radio className="w-3.5 h-3.5 animate-spin" /> 🔴 KÊNH ĐANG PHÁT LIVE REAL-TIME (ON AIR)
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-emerald-400" /> 🟢 CHẾ ĐỘ XEM TRƯỚC (PREVIEW MODE) • CHƯA PHÁT SÓNG
                              </span>
                            )}
                            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40 hidden md:inline-block">
                              FPS: 60 • BITRATE: 12.5 Mbps • 4K 2160p
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold font-mono">
                            Stream Key: {activeMonitorChannelObj.streamKey ? "••••••••" + activeMonitorChannelObj.streamKey.slice(-4) : "••••2401"}
                          </span>
                        </div>

                        {/* Top overlay badge (TOP LEFT) */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-auto">
                          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                            <span>{activeMonitorChannelObj.icon}</span>
                            <span>{activeMonitorChannelObj.name}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{activeMonitorChannelObj.viewers} ĐANG XEM</span>
                          </span>
                        </div>
                          
                        {/* Fullscreen Button (TOP RIGHT) */}
                        <button
                          onClick={(e) => {
                            const container = e.currentTarget.closest('.aspect-video');
                            if (container) {
                              if (document.fullscreenElement) {
                                document.exitFullscreen();
                              } else {
                                container.requestFullscreen();
                              }
                            }
                          }}
                          className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white pointer-events-auto cursor-pointer transition-all"
                          title="Phóng to toàn màn hình"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                </div>
              </div>
            )}
          </div>

          """
    content = content[:start_idx] + new_block + content[end_idx:]

# Also update the Xóa Video logic in URL input section so that they can clear it there too if they want
content = content.replace(
"""                  <button
                    onClick={() => setActiveVideoUrl(videoUrlInput)}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 shadow-glow-amber"
                  >
                    <Play className="w-4 h-4" /> MỞ VIDEO
                  </button>""",
"""                  <button
                    onClick={() => setActiveVideoUrl(videoUrlInput)}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 shadow-glow-amber"
                  >
                    <Play className="w-4 h-4" /> MỞ VIDEO
                  </button>
                  <button
                    onClick={() => { setVideoUrlInput(""); setActiveVideoUrl(""); }}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 border border-red-500/30"
                  >
                    XÓA
                  </button>"""
)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)
