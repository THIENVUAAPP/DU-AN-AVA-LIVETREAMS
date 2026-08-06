import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Delete CAPRO TRANG CHỦ (Image 1)
capro_trang_chu_pattern = r'<button onClick=\{\(\) => setActiveTab\("overview"\)\} className="flex items-center gap-3 group cursor-pointer mr-6">.*?— TRANG CHỦ —</span>\n    </div>\n  </button>'
content = re.sub(capro_trang_chu_pattern, "", content, flags=re.DOTALL)

# 2. Replace CAPRO AUTO (Image 2) with AvaLive PRO
capro_auto_pattern = r'<div onClick=\{\(\) => window.location.href=\'/\'\} className="p-6 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors">.*?— AUTO —</span>\n          </div>\n        </div>'
avalive_logo = """<div onClick={() => window.location.href='/'} className="p-6 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-xl group-hover:scale-105 transition-all">
              <img 
                src="/official_logo.jpg" 
                alt="AvaLive PRO" 
                className="w-full h-full object-cover rounded-[10px] border border-white/40"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-black text-xl leading-none tracking-tight flex items-center gap-1 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              AvaLive <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">PRO</span>
            </h2>
          </div>
        </div>"""
content = re.sub(capro_auto_pattern, avalive_logo, content, flags=re.DOTALL)

# Also fix the bottom copyright from CAPRO AUTO to AvaLive PRO
content = content.replace("© 2025 CAPRO AUTO.", "© 2025 AvaLive PRO.")

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated logos successfully.")
