import re
import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. UniversalFileUploader
replace_in_file('src/components/UniversalFileUploader.jsx', [
    ('Miễn phí 24/7 (Unlimited)', 'Miễn phí'),
    ('Miễn Phí 24/7 (Unlimited)', 'Miễn phí'),
    ('⚡ TỐC ĐỘ SIÊU TỐC REAL-TIME: Đã nạp', 'Đã nạp'),
    (' tức thì (0ms độ trễ) sẵn sàng phát livestream!', ''),
    ('<Zap className="w-3.5 h-3.5 text-yellow-400" /> ⚡ STREAMING VIDEO KHỦNG (HÀNG CHỤC GB & VÀI TIẾNG ĐỒNG HỒ SIÊU MƯỢT)', ''),
    ('<Check className="w-3.5 h-3.5" /> 🟢 PHÁT LIVESTREAM 24/7 UNLIMITED (MIỄN PHÍ TẤT CẢ GÓI)', ''),
])

# 2. MultistreamStudio
replace_in_file('src/components/MultistreamStudio.jsx', [
    ('BÀN NẠP VIDEO PHÁT LIVESTREAM ĐA KÊNH UNLIMITED', 'Nguồn Phát Video'),
    ('Hỗ trợ 2 loại video: 1. Video đã live (Gắn Link) & 2. Video quay sẵn (Nạp File).', 'Hỗ trợ link video và file tải lên.'),
    ('🎛️ BÀN CHUYỂN MÀN HÌNH LIVE REAL-TIME MULTICAM SWITCHER', 'Bảng Điều Khiển Đa Luồng'),
    ('🔴 KÊNH ĐANG PHÁT LIVE REAL-TIME (ON AIR)', 'Đang phát sóng'),
    ('🟢 CHẾ ĐỘ XEM TRƯỚC (PREVIEW MODE) • CHƯA PHÁT SÓNG', 'Chế độ xem trước (Preview)'),
    ('<span className="font-black text-white block text-xs">🔒 BẢO VỆ LUỒNG STREAM REAL-TIME & CHỐNG GIẢM TẢI DELAY</span>', ''),
    ('<span className="text-[11px] text-gray-300">Mã hóa AES-256 Stream Key • Chống Hack/Spam Luồng • Chống Gian Lận Bản Quyền DRM 4K</span>', ''),
    ('<div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">\n                  ● SECURITY ACTIVE 100%\n                </div>', ''),
    ('🚀 PHÁT TẤT CẢ KÊNH CÙNG LÚC (UNLIMITED)', 'Phát Tất Cả'),
    ('🔴 DỪNG PHÁT TẤT CẢ KÊNH', 'Dừng Phát Tất Cả'),
    ('🔴 ĐANG PHÁT LIVE REAL-TIME (60 FPS)', 'Đang phát trực tiếp'),
    ('DANH SÁCH VIDEO PHÁT LIVESTREAM UNLIMITED', 'Danh sách Video'),
    ('THÊM TÀI KHOẢN / KÊNH MỚI UNLIMITED', 'Thêm Kênh Phát'),
    ('KẾT NỐI ĐA KÊNH LIVE UNLIMITED', 'Kết Nối Đa Kênh')
])

print("Replacements applied successfully!")
