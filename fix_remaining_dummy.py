import re
from datetime import datetime, timedelta

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix notification counts
# Pattern: <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">12</span>
# Pattern: <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">6</span>
content = re.sub(r'bg-red-500 rounded-full(.*?)>12</span>', r'bg-red-500 rounded-full\1>0</span>', content)
content = re.sub(r'bg-purple-500 rounded-full(.*?)>6</span>', r'bg-purple-500 rounded-full\1>0</span>', content)

# 2. Fix Date Range (20/07/2025 - 27/07/2025)
now = datetime.now()
seven_days_ago = now - timedelta(days=7)
date_str = f"{seven_days_ago.strftime('%d/%m/%Y')} - {now.strftime('%d/%m/%Y')}"
content = content.replace("20/07/2025 - 27/07/2025", date_str)

# 3. Fix "100%" retention rate
# Pattern: { label: 'TỶ LỆ GIỮ CHÂN (7 NGÀY)', value: '100%', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, change: '0%', isUp: true }
content = content.replace("value: '100%'", "value: '0%'")

# 4. Fix other potential date ranges, like the backup success text.
content = content.replace("27/07/2025 - 02:00 AM", now.strftime("%d/%m/%Y - %I:%M %p"))

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
