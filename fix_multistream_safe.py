import re

with open('src/components/MultistreamStudio.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Restore the crash fix!
content = content.replace(
    'const activeMonitorChannelObj = channels.find(c => c.id === selectedMonitorChannel) || channels[0];',
    'const activeMonitorChannelObj = channels.find(c => c.id === selectedMonitorChannel) || (channels.length > 0 ? channels[0] : { id: "fallback", name: "Chưa kết nối", streamKey: "", viewers: 0 });'
)
content = content.replace('activeMonitorChannelObj.streamKey', 'activeMonitorChannelObj?.streamKey')
content = content.replace('activeMonitorChannelObj.icon', 'activeMonitorChannelObj?.icon')
content = content.replace('activeMonitorChannelObj.name', 'activeMonitorChannelObj?.name')
content = content.replace('activeMonitorChannelObj.viewers', 'activeMonitorChannelObj?.viewers')

# 2. Text Replacements
replacements = [
    ('BÀN NẠP VIDEO PHÁT LIVESTREAM ĐA KÊNH UNLIMITED', 'Nguồn Phát Video'),
    ('Hỗ trợ 2 loại video: 1. Video đã live (Gắn Link) & 2. Video quay sẵn (Nạp File).', 'Hỗ trợ link video và file tải lên.'),
    ('🎛️ BÀN CHUYỂN MÀN HÌNH LIVE REAL-TIME MULTICAM SWITCHER', 'Bảng Điều Khiển Đa Luồng'),
    ('🔴 KÊNH ĐANG PHÁT LIVE REAL-TIME (ON AIR)', 'Đang phát sóng'),
    ('🟢 CHẾ ĐỘ XEM TRƯỚC (PREVIEW MODE) • CHƯA PHÁT SÓNG', 'Chế độ xem trước (Preview)'),
    ('🚀 PHÁT TẤT CẢ KÊNH CÙNG LÚC (UNLIMITED)', 'Phát Tất Cả'),
    ('🔴 DỪNG PHÁT TẤT CẢ KÊNH', 'Dừng Phát Tất Cả'),
    ('🔴 ĐANG PHÁT LIVE REAL-TIME (60 FPS)', 'Đang phát trực tiếp'),
    ('DANH SÁCH VIDEO PHÁT LIVESTREAM UNLIMITED', 'Danh sách Video'),
    ('THÊM TÀI KHOẢN / KÊNH MỚI UNLIMITED', 'Thêm Kênh Phát'),
    ('KẾT NỐI ĐA KÊNH LIVE UNLIMITED', 'Kết Nối Đa Kênh')
]

for old, new in replacements:
    content = content.replace(old, new)

# 3. Safely remove the banners by targeting just the inner contents or the exact wrappers, not using .*? loosely.

# Enterprise Security Banner (Line ~790-815)
# Find it by specific strings
security_banner_regex = r'\{\/\*\s*Enterprise Anti-Hack & Security Guard Banner\s*\*\/.*?SECURITY ACTIVE 100%[^<]*<\/span>\s*<\/div>'
content = re.sub(security_banner_regex, '', content, flags=re.DOTALL)

# Auto-Captcha Banner (Line ~816-838)
captcha_banner_regex = r'\{\/\*\s*Auto-Captcha Solver Banner\s*\*\/.*?HỆ THỐNG GIẢI MÃ CAPTCHA TỰ ĐỘNG BẰNG AI.*?<\/button>\s*<\/div>\s*<\/div>'
content = re.sub(captcha_banner_regex, '', content, flags=re.DOTALL)

# 4. Remove FPS and Stream Key
content = re.sub(r'<span className="[^"]*hidden md:inline-block[^"]*">\s*FPS: 60 • BITRATE: 12\.5 Mbps • 4K 2160p\s*<\/span>', '', content)
content = re.sub(r'<span className="[^"]*">\s*Stream Key: [^<]*\s*<\/span>', '', content)

with open('src/components/MultistreamStudio.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("MultistreamStudio fixed safely!")
