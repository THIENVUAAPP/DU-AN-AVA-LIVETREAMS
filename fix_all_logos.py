import os
import glob
import re

components = glob.glob("src/components/**/*.jsx", recursive=True)
components.append("src/App.jsx")

pattern1 = r'AvaLive\s*<span[^>]*>PRO<\/span>'
pattern2 = r'AVA\s*<span[^>]*>LIVE<\/span>'
pattern3 = r'<span[^>]*>AVA<\/span>\s*<span[^>]*>Live<\/span>'
pattern4 = r'AVA LIVE'

replacement_html = r"""AVA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">LIVESTREAM</span>"""

for filepath in components:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    
    # We will replace all AvaLive PRO variations that we missed
    if re.search(pattern1, content, re.IGNORECASE):
        content = re.sub(pattern1, replacement_html, content, flags=re.IGNORECASE)
        modified = True
        
    if re.search(pattern2, content, re.IGNORECASE):
        content = re.sub(pattern2, replacement_html, content, flags=re.IGNORECASE)
        modified = True
        
    # check for exact string "AVA LIVE" (except in caps where it might be in text)
    # Let's replace the AffiliateLanding one specifically.
    
    if "AffiliateLanding.jsx" in filepath:
        content = re.sub(r'AvaLive <span className="text-\[\#EF4444\]">PRO</span>', replacement_html, content)
        modified = True
        
    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Fixed logos in {filepath}")

