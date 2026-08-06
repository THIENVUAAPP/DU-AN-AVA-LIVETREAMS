import re

with open('src/components/UniversalFileUploader.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('Miễn phí 24/7 (Unlimited)', 'Miễn phí'),
    ('Miễn Phí 24/7 (Unlimited)', 'Miễn phí'),
    ('⚡ TỐC ĐỘ SIÊU TỐC REAL-TIME: Đã nạp', 'Đã nạp'),
    (' tức thì (0ms độ trễ) sẵn sàng phát livestream!', ''),
    ('<Zap className="w-3.5 h-3.5 text-yellow-400" /> ⚡ STREAMING VIDEO KHỦNG (HÀNG CHỤC GB & VÀI TIẾNG ĐỒNG HỒ SIÊU MƯỢT)', 'Quản lý luồng video'),
    ('<Check className="w-3.5 h-3.5" /> 🟢 PHÁT LIVESTREAM 24/7 UNLIMITED (MIỄN PHÍ TẤT CẢ GÓI)', 'Live 24/7')
]

for old, new in replacements:
    content = content.replace(old, new)

with open('src/components/UniversalFileUploader.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
