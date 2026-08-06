import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add a ref for the player and downloading state
if "const ytPlayerRef = useRef(null);" not in content:
    content = content.replace(
        "const [captionsEnabled, setCaptionsEnabled] = useState(false);",
        "const [captionsEnabled, setCaptionsEnabled] = useState(false);\n  const ytPlayerRef = useRef(null);\n  const [isDownloading, setIsDownloading] = useState(false);"
    )

# Replace the Download and Caption buttons
old_buttons = """<button
                          onClick={() => setCaptionsEnabled(!captionsEnabled)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${captionsEnabled ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700/80 hover:bg-gray-600 text-white'}`}
                          title="Bật/Tắt Phụ Đề"
                        >
                          {captionsEnabled ? 'TẮT PHỤ ĐỀ (CC)' : 'BẬT PHỤ ĐỀ (CC)'}
                        </button>
                        <a
                          href={getYoutubeId(activeVideoUrl) ? `https://ssyoutube.com/watch?v=${getYoutubeId(activeVideoUrl)}` : activeVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={getYoutubeId(activeVideoUrl) ? undefined : 'video.mp4'}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                        >
                          ⬇️ TẢI VIDEO
                        </a>"""

new_buttons = """<button
                          onClick={() => {
                            const newState = !captionsEnabled;
                            setCaptionsEnabled(newState);
                            if (ytPlayerRef.current) {
                               const internal = ytPlayerRef.current.getInternalPlayer();
                               if (internal && internal.loadModule) {
                                  if (newState) {
                                     internal.loadModule("captions");
                                     internal.setOption("captions", "track", {languageCode: "vi"});
                                  } else {
                                     internal.unloadModule("captions");
                                  }
                               }
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${captionsEnabled ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700/80 hover:bg-gray-600 text-white'}`}
                          title="Bật/Tắt Phụ Đề"
                        >
                          {captionsEnabled ? 'TẮT PHỤ ĐỀ (CC)' : 'BẬT PHỤ ĐỀ (CC)'}
                        </button>
                        <button
                          onClick={async () => {
                            if (isDownloading) return;
                            setIsDownloading(true);
                            try {
                              const ytId = getYoutubeId(activeVideoUrl);
                              if (ytId) {
                                const res = await fetch('https://co.wuk.sh/api/json', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                                  body: JSON.stringify({ url: activeVideoUrl, vQuality: '720', filenamePattern: 'classic' })
                                });
                                const data = await res.json();
                                if (data && data.url) {
                                   const a = document.createElement('a');
                                   a.href = data.url;
                                   a.target = '_blank';
                                   a.download = 'video.mp4';
                                   document.body.appendChild(a);
                                   a.click();
                                   document.body.removeChild(a);
                                } else {
                                   window.open(`https://ssyoutube.com/watch?v=${ytId}`, '_blank');
                                }
                              } else {
                                const res = await fetch(activeVideoUrl);
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'downloaded_video.mp4';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              }
                            } catch (e) {
                              const ytId = getYoutubeId(activeVideoUrl);
                              if (ytId) window.open(`https://ssyoutube.com/watch?v=${ytId}`, '_blank');
                              else window.open(activeVideoUrl, '_blank');
                            }
                            setIsDownloading(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg ${isDownloading ? 'bg-emerald-800' : 'bg-emerald-600/80 hover:bg-emerald-500'} text-white font-bold text-xs shadow-glow-emerald transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md`}
                        >
                          {isDownloading ? '⏳ ĐANG XỬ LÝ...' : '⬇️ TẢI VIDEO'}
                        </button>"""

content = content.replace(old_buttons, new_buttons)

# Replace iframe with ReactPlayer + ref
old_iframe = """{getYoutubeId(activeVideoUrl) ? (
                        <iframe 
                           key={activeVideoUrl}
                           src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}&cc_load_policy=${captionsEnabled ? 1 : 0}&cc_lang_pref=vi&hl=vi`} 
                           width="100%" 
                           height="100%" 
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                           className="w-full h-full"
                        ></iframe>
                     ) : (
                        <ReactPlayer 
                           key={activeVideoUrl} 
                           url={activeVideoUrl} 
                           playing={true} 
                           loop={true} 
                           muted={false} 
                           controls={true} 
                           width="100%" 
                           height="100%" 
                        />
                     )}"""

new_reactplayer = """<ReactPlayer 
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
                        />"""

content = content.replace(old_iframe, new_reactplayer)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

