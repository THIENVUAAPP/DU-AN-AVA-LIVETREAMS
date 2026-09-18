import os

files_to_patch = [
    "src/components/genaidol/DesktopAppUI.jsx",
    "src/components/SalesLandingPage.jsx",
    "src/components/KOLLiveDashboard.jsx",
    "src/components/LandingHero.jsx",
    "src/components/Header.jsx"
]

import_statement = "import { handleOSDownload } from '../utils/downloadOS';\n"
import_statement_nested = "import { handleOSDownload } from '../../utils/downloadOS';\n"

for f in files_to_patch:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add import
    if "handleOSDownload" not in content:
        if "genaidol" in f:
            content = content.replace("import React", import_statement_nested + "import React", 1)
        else:
            content = content.replace("import React", import_statement + "import React", 1)

    # Replace anchor tags
    # Example: <a href="/Livestream_AI_Software.zip" download="AvaLive_VIP_PRO_Full_Package_MacWin.zip"
    import re
    
    # Replace standard anchor links with onClick
    content = re.sub(r'<a[^>]*href="/Livestream_AI_Software.zip"[^>]*>', lambda m: m.group(0).replace('href="/Livestream_AI_Software.zip"', 'href="#" onClick={handleOSDownload}').replace('download="AvaLive_VIP_PRO_Full_Package_MacWin.zip"', ''), content)
    
    # Replace programmed link creation
    content = content.replace("link.href = '/Livestream_AI_Software.zip';", "return handleOSDownload();")
    content = content.replace("link.download = 'AvaLive_VIP_PRO_Full_Package_MacWin.zip';", "")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Patched all files!")
