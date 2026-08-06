import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Fix Matrix Grid
old_matrix = """                    {streamSourceMode === "video" && activeVideo?.url ? (
                      <video src={activeVideo.url} controls autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (
                      <LiveCameraFeed className="w-full h-full object-cover" />
                    )}"""

new_matrix = """                    {streamSourceMode === "url" && videoUrlInput ? (
                      <video src={videoUrlInput} controls autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (streamSourceMode === "video" && activeVideo?.url) ? (
                      <video src={activeVideo.url} controls autoPlay loop muted className="w-full h-full object-cover" />
                    ) : streamSourceMode === "direct" ? (
                      <LiveCameraFeed className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white/50 text-xs">
                         <span className="animate-pulse">VUI LÒNG CHỌN NGUỒN PHÁT</span>
                      </div>
                    )}"""

content = content.replace(old_matrix, new_matrix)

# Fix Single Monitor
old_single_monitor_start = """              /* SINGLE DETAILED CHANNEL LIVE MONITOR */
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black">
                {(activeVideo && activeVideo.url && streamSourceMode === 'video') || streamSourceMode === 'url' ? (
                  <video
                    key={streamSourceMode === "url" ? videoUrlInput : activeVideo?.id}
                    src={streamSourceMode === "url" ? videoUrlInput : activeVideo?.url}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <LiveCameraFeed className="w-full h-full object-cover" />"""

new_single_monitor_start = """              /* SINGLE DETAILED CHANNEL LIVE MONITOR */
              <div className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-white/15 bg-black">
                
                {/* VIDEO / CAMERA SOURCE */}
                {streamSourceMode === "url" && videoUrlInput ? (
                  <video
                    key={videoUrlInput}
                    src={videoUrlInput}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-contain absolute inset-0 z-0"
                  />
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
                <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">"""

content = content.replace(old_single_monitor_start, new_single_monitor_start)

# Now find the end of the overlays in the single monitor
old_single_monitor_end = """                      </div>
                    </div>
                  </div>
                )}
              </div>"""

new_single_monitor_end = """                      </div>
                    </div>
                </div>
              </div>"""
content = content.replace(old_single_monitor_end, new_single_monitor_end)


with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

