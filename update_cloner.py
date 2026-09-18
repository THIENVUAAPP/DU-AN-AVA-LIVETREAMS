import re

content = open('src/components/LivestreamClonerStudio.jsx').read()

# 1. Add states
state_addition = """  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTabId, setActiveTabId] = useState(null);"""
content = content.replace("  const [isProcessing, setIsProcessing] = useState(false);", state_addition)

# 2. Add Fullscreen button to LivestreamClonerStudio video container
fullscreen_btn = """
                  <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all ${stream.isPlaying ? 'opacity-0 group-hover/player:opacity-100 bg-black/40 pointer-events-none' : ''}`}>
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
                      className="absolute top-2 left-2 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white pointer-events-auto cursor-pointer transition-all z-50"
                      title="Phóng to toàn màn hình"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
"""
content = content.replace("""                  <div className={`absolute inset-0 flex items-center justify-center z-30 transition-all ${stream.isPlaying ? 'opacity-0 group-hover/player:opacity-100 bg-black/40 pointer-events-none' : ''}`}>""", fullscreen_btn)

# 3. Add import Maximize2, LayoutGrid, LayoutList
import_addition = """  Radio,
  Eye,
  Maximize2,
  LayoutGrid,
  LayoutList"""
content = content.replace("""  Radio,
  Eye""", import_addition)

# 4. View mode toggle and Tabs UI
header = """              ĐANG GIÁM SÁT {streams.length} LUỒNG LIVESTREAM ĐỒNG THỜI
            </h3>
            
            <div className="flex items-center gap-2 bg-[#121216] p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Chế độ Lưới (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setViewMode('tabs');
                  if (!activeTabId && streams.length > 0) setActiveTabId(streams[0].id);
                }}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'tabs' ? 'bg-blue-600 text-white shadow-glow-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title="Chế độ Từng Tab (Tabs)"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {viewMode === 'tabs' && streams.length > 0 && (
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {streams.map(s => (
                <button
                  key={`tab-${s.id}`}
                  onClick={() => setActiveTabId(s.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeTabId === s.id ? 'bg-blue-600 border-blue-500 text-white shadow-glow-blue' : 'bg-[#121216] border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                  {s.url.replace('https://www.', '').replace('https://', '')}
                </button>
              ))}
            </div>
          )}

          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-4"}>
            {streams.map((stream) => (
              <div key={stream.id} className={`glass-panel rounded-2xl border border-white/10 bg-[#121216] overflow-hidden flex flex-col relative group transition-all hover:border-blue-500/50 hover:shadow-glow-blue-sm ${viewMode === 'tabs' && activeTabId !== stream.id ? 'hidden' : ''}`}>
"""

content = content.replace("""              ĐANG GIÁM SÁT {streams.length} LUỒNG LIVESTREAM ĐỒNG THỜI
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {streams.map((stream) => (
              <div key={stream.id} className="glass-panel rounded-2xl border border-white/10 bg-[#121216] overflow-hidden flex flex-col relative group transition-all hover:border-blue-500/50 hover:shadow-glow-blue-sm">""", header)

open('src/components/LivestreamClonerStudio.jsx', 'w').write(content)
