import re

with open('src/components/LivestreamClonerStudio.jsx', 'r') as f:
    content = f.read()

# 1. Remove API fetch block
api_block_pattern = r"// Xử lý gọi API Serverless ngầm cho các luồng cần bóc tách \(TikTok, Shopee\).*?}\);\n    }\);\n  };"
content = re.sub(r"// Xử lý gọi API Serverless ngầm cho các luồng cần bóc tách \(TikTok, Shopee\)[\s\S]*?}\);\n    }\);\n  };", "  };", content)

# 2. Simplify initial state in handleAddLinks
old_state = """        isApiRequired,
        extractionStatus: isApiRequired ? 'extracting' : 'idle',
        streamUrl: '',
        title: ''"""
new_state = """        streamUrl: '',
        title: ''"""
content = content.replace(old_state, new_state)
content = content.replace("const isApiRequired = link.includes('tiktok') || link.includes('shopee');", "")

# 3. Simplify rendering block
old_render_block = """                  {stream.isPlaying ? (
                    stream.isApiRequired ? (
                      stream.extractionStatus === 'extracting' ? (
                        <div className="text-white flex flex-col items-center justify-center h-full w-full bg-[#121216]">
                          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                          <span className="text-xs font-mono text-blue-400 font-bold uppercase">Đang Bóc Tách API...</span>
                        </div>
                      ) : stream.extractionStatus === 'success' && stream.streamUrl ? (
                        <div className="w-full h-full absolute inset-0">
                          <LivePlayer 
                            url={stream.streamUrl} 
                            playing={true} 
                            muted={true} 
                          />
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

new_render_block = """                  {stream.isPlaying ? (
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

content = content.replace(old_render_block, new_render_block)

# 4. Remove fake viewers since we are using native iframe viewer count?
# Actually, we overlay `stream.viewers` (random fake number) on top of the iframe.
# If he wants "mắt xem thật" (real viewer count), we should NOT overlay a fake viewer count!
# Let's remove the fake viewer overlay.
fake_viewer_pattern = """                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono border border-white/20 backdrop-blur-sm flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {stream.viewers}
                    </span>"""
content = content.replace(fake_viewer_pattern, "")

with open('src/components/LivestreamClonerStudio.jsx', 'w') as f:
    f.write(content)
