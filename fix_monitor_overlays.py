import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Define the start and end of the block to replace
start_marker = "/* SINGLE DETAILED CHANNEL LIVE MONITOR */"
end_marker = "{/* Connected Channels List */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """/* SINGLE DETAILED CHANNEL LIVE MONITOR */
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black">
                
                {/* VIDEO / CAMERA SOURCE */}
                {streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full absolute inset-0 z-0">
                     <ReactPlayer key={activeVideoUrl} url={activeVideoUrl} playing loop muted controls width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }} />
                  </div>
                ) : (streamSourceMode === "video" && activeVideo?.url) ? (
                  <video
                    key={activeVideo?.id}
                    src={activeVideo?.url}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain absolute inset-0 z-0"
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
                
                {/* OVERLAYS (ALWAYS VISIBLE OVER ANY SOURCE) */}
                <div className="absolute inset-0 pointer-events-none z-10">

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
                    
                </div>
              </div>
            )}
          </div>

          """
    # Note: I included closing tags for the `selectedMonitorChannel === 'matrix'` block.
    # The end marker `end_idx` corresponds to `          {/* Connected Channels List */}`.
    
    content = content[:start_idx] + new_block + content[end_idx:]
    with open('src/components/MultistreamStudio.jsx', 'w') as f:
        f.write(content)
else:
    print("Markers not found.")

