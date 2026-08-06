import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add state for captions if not exists
if "const [captionsEnabled, setCaptionsEnabled]" not in content:
    content = content.replace(
        "const [activeVideoUrl, setActiveVideoUrl] = useState(\"\");",
        "const [activeVideoUrl, setActiveVideoUrl] = useState(\"\");\n  const [captionsEnabled, setCaptionsEnabled] = useState(false);"
    )

# Update Single Monitor iframe src to include cc_load_policy
old_iframe_src = """src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}`}"""
new_iframe_src = """src={`https://www.youtube.com/embed/${getYoutubeId(activeVideoUrl)}?autoplay=1&mute=0&controls=1&loop=1&playlist=${getYoutubeId(activeVideoUrl)}&cc_load_policy=${captionsEnabled ? 1 : 0}`}"""
content = content.replace(old_iframe_src, new_iframe_src)


# Add buttons to Single Monitor overlays
# Locate the overlay section
old_overlay = """<div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
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
                      </div>"""

new_overlay = """<div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
                        <button
                          onClick={() => setCaptionsEnabled(!captionsEnabled)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md ${captionsEnabled ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-700/80 hover:bg-gray-600 text-white'}`}
                          title="Bật/Tắt Phụ Đề"
                        >
                          {captionsEnabled ? 'TẮT PHỤ ĐỀ (CC)' : 'BẬT PHỤ ĐỀ (CC)'}
                        </button>
                        <button
                          onClick={() => {
                            const ytId = getYoutubeId(activeVideoUrl);
                            if (ytId) {
                               window.open(`https://ssyoutube.com/watch?v=${ytId}`, '_blank');
                            } else {
                               const a = document.createElement('a');
                               a.href = activeVideoUrl;
                               a.download = 'video.mp4';
                               a.target = '_blank';
                               a.click();
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                        >
                          ⬇️ TẢI VIDEO
                        </button>
                        <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 backdrop-blur-md hidden md:block">
                          Xem Trước
                        </span>
                        <button 
                          onClick={() => {
                             setActiveVideoUrl('');
                          }} 
                          className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs shadow-glow-red transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg> XÓA
                        </button>
                      </div>"""

content = content.replace(old_overlay, new_overlay)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

