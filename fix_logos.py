import os
import re

files_to_check = [
    "src/components/Header.jsx",
    "src/components/SalesLandingPage.jsx",
    "src/components/AdminDashboard.jsx",
    "src/components/EnterprisePayment.jsx"
]

for file_path in files_to_check:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Fix Header.jsx logo
    if "Header.jsx" in file_path:
        # replace:
        # AvaLive <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,1)]">PRO</span>
        # with: AVA LIVESTREAM (in a cool way)
        pattern = r"AvaLive <span className=\"text-\[\#EF4444\].*?PRO<\/span>"
        replacement = r"""AVA <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,1)]">LIVESTREAM</span>"""
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # also update the alt text
        content = content.replace('alt="AvaLive PRO Official Logo"', 'alt="AVA LIVESTREAM Official Logo"')
        
    # 2. Fix SalesLandingPage.jsx logo (Header)
    if "SalesLandingPage.jsx" in file_path:
        pattern_header = r"""<h1 className="text-xl font-black text-white tracking-tight flex flex-col leading-none">\s*<span className="text-\[\#FBBF24\] drop-shadow-\[0_0_8px_rgba\(251,191,36,0\.6\)\]">AVA<\/span>\s*<span className="text-\[10px\] text-purple-400 font-bold uppercase tracking-widest mt-1">Live<\/span>\s*<\/h1>"""
        replacement_header = r"""<h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5 leading-none">
              <span className="text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">AVA</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">LIVESTREAM</span>
            </h1>"""
        content = re.sub(pattern_header, replacement_header, content)
        
        # SalesLandingPage footer
        pattern_footer = r"""<h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-4">\s*<div className="w-8 h-8 rounded bg-gradient-to-br from-\[\#EF4444\] to-\[\#8B5CF6\] flex items-center justify-center"\>\s*<span className="text-\[\#FBBF24\]"\>AVA<\/span>\s*<\/div>\s*AVA LIVE\s*<\/h2>"""
        replacement_footer = r"""<h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EF4444] to-[#8B5CF6] flex items-center justify-center p-0.5 overflow-hidden">
                 <img src="/official_logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
              </div>
              AVA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">LIVESTREAM</span>
            </h2>"""
        content = re.sub(pattern_footer, replacement_footer, content)

    # 3. Fix AdminDashboard.jsx logo
    if "AdminDashboard.jsx" in file_path:
        pattern_admin = r"""AvaLive <span className="text-\[\#EF4444\].*?PRO<\/span>"""
        replacement_admin = r"""AVA <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">LIVESTREAM</span>"""
        content = re.sub(pattern_admin, replacement_admin, content, flags=re.DOTALL)
        content = content.replace('alt="AvaLive PRO"', 'alt="AVA LIVESTREAM"')

    # 4. Fix EnterprisePayment.jsx logo
    if "EnterprisePayment.jsx" in file_path:
        pattern_ep = r"""AvaLive <span className="text-\[\#EF4444\].*?PRO<\/span>"""
        replacement_ep = r"""AVA <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">LIVESTREAM</span>"""
        content = re.sub(pattern_ep, replacement_ep, content, flags=re.DOTALL)
        content = content.replace('alt="AvaLive PRO Official Logo"', 'alt="AVA LIVESTREAM Official Logo"')
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed logos in all files")
