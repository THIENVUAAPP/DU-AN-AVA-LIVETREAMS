import re

with open('src/components/MultistreamStudio.jsx', 'r') as f:
    content = f.read()

# Add activeVideoUrl state right after videoUrlInput
content = content.replace(
    "const [videoUrlInput, setVideoUrlInput] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');",
    "const [videoUrlInput, setVideoUrlInput] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');\n  const [activeVideoUrl, setActiveVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');"
)

# Replace the input section in URL mode
old_url_input = """            {streamSourceMode === "url" && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs animate-fadeIn">
                <label className="font-bold text-amber-300 block">DÁN LINK STREAM VIDEO HOẶC LUỒNG LIVE TRỰC TUYẾN (.m3u8, .mp4, RTSP, HLS Link):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="https://server.com/live-stream.m3u8..."
                    className="flex-1 bg-black/80 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => alert("🔗 ĐÃ ĐỒNG BỘ NGUỒN STREAM LINK VIDEO CHO TOÀN BỘ CÁC KÊNH LIVE!")}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0"
                  >
                    🚀 ĐỒNG BỘ TẤT CẢ KÊNH
                  </button>
                </div>
              </div>
            )}"""

new_url_input = """            {streamSourceMode === "url" && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2 text-xs animate-fadeIn">
                <label className="font-bold text-amber-300 block">DÁN LINK VIDEO TỪ BẤT KỲ NỀN TẢNG NÀO (TikTok, YouTube, Facebook, .mp4, ...):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    placeholder="Dán đường link video vào đây để phát luôn không cần tải về..."
                    className="flex-1 bg-black/80 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => setActiveVideoUrl(videoUrlInput)}
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white font-black text-xs rounded-xl transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 shadow-glow-amber"
                  >
                    <Play className="w-4 h-4" /> MỞ VIDEO
                  </button>
                </div>
              </div>
            )}"""

content = content.replace(old_url_input, new_url_input)

# Replace usage of videoUrlInput with activeVideoUrl in the video player sources
content = content.replace(
    """{streamSourceMode === "url" && videoUrlInput ? (
                      <video src={videoUrlInput} controls autoPlay loop muted className="w-full h-full object-cover" />""",
    """{streamSourceMode === "url" && activeVideoUrl ? (
                      <video src={activeVideoUrl} controls autoPlay loop muted className="w-full h-full object-cover" />"""
)

content = content.replace(
    """{streamSourceMode === "url" && videoUrlInput ? (
                  <video
                    key={videoUrlInput}
                    src={videoUrlInput}""",
    """{streamSourceMode === "url" && activeVideoUrl ? (
                  <video
                    key={activeVideoUrl}
                    src={activeVideoUrl}"""
)

with open('src/components/MultistreamStudio.jsx', 'w') as f:
    f.write(content)

