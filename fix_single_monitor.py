import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Locate the Single Monitor ReactPlayer
old_single_monitor = """                {/* VIDEO / CAMERA SOURCE */}
                {streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full pointer-events-auto flex items-center justify-center bg-black">
                     <ReactPlayer 
                           ref={ytPlayerRef}
                           key={activeVideoUrl} 
                           url={activeVideoUrl} 
                           playing={true} 
                           loop={true} 
                           muted={false} 
                           controls={true} 
                           width="100%" 
                           height="100%" 
                           config={{
                             youtube: {
                               playerVars: {
                                 cc_load_policy: captionsEnabled ? 1 : 0,
                                 hl: 'vi',
                                 enablejsapi: 1
                               }
                             }
                           }}
                        />
                  </div>
                ) : (streamSourceMode === "video" && activeVideo?.url) ? ("""

new_single_monitor = """                {/* VIDEO / CAMERA SOURCE */}
                {streamSourceMode === "url" && activeVideoUrl ? (
                  <div className="w-full h-full pointer-events-auto flex items-center justify-center bg-black">
                        {getYoutubeId(activeVideoUrl) ? (
                           <ReactPlayer 
                              ref={ytPlayerRef}
                              key={activeVideoUrl} 
                              url={activeVideoUrl} 
                              playing={true} 
                              loop={true} 
                              muted={false} 
                              controls={true} 
                              width="100%" 
                              height="100%" 
                              config={{
                                youtube: {
                                  playerVars: {
                                    cc_load_policy: captionsEnabled ? 1 : 0,
                                    hl: 'vi',
                                    enablejsapi: 1
                                  }
                                }
                              }}
                           />
                        ) : getTiktokId(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.tiktok.com/embed/v2/${getTiktokId(activeVideoUrl)}`}
                              width="100%"
                              height="100%"
                              allow="fullscreen"
                              className="w-full h-full border-none pointer-events-auto"
                           ></iframe>
                        ) : activeVideoUrl.includes('tiktok.com') ? (
                           <TikTokEmbed url={activeVideoUrl} />
                        ) : isFacebookUrl(activeVideoUrl) ? (
                           <iframe 
                              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideoUrl)}&show_text=false&width=auto`}
                              width="100%"
                              height="100%"
                              style={{ border: 'none', overflow: 'hidden' }}
                              scrolling="no"
                              frameBorder="0"
                              allowFullScreen={true}
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              className="w-full h-full pointer-events-auto"
                           ></iframe>
                        ) : (
                           <ReactPlayer 
                              ref={ytPlayerRef}
                              key={activeVideoUrl} 
                              url={activeVideoUrl} 
                              playing={true} 
                              loop={true} 
                              muted={false} 
                              controls={true} 
                              width="100%" 
                              height="100%" 
                           />
                        )}
                  </div>
                ) : (streamSourceMode === "video" && activeVideo?.url) ? ("""

content = content.replace(old_single_monitor, new_single_monitor)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)
