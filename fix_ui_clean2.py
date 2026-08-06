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

# 3. ProductionStudio
replace_in_file('src/components/ProductionStudio.jsx', [
    ('alert("⚡ ĐÃ TỐI ƯU HÓA SIÊU MƯỢT 60FPS! Bitrate 24 Mbps (Tăng tốc GPU Hardware Engine, chống đứng hình giật lag).");', ''),
    ('🚀 BÀN ĐIỀU KHIỂN LIVE ĐA LUỒNG UNLIMITED 1-CHẠM', 'Bàn Điều Khiển Live Đa Luồng'),
    ('Đang nhận tín hiệu 0ms delay trực tiếp từ nguồn camera phần cứng với độ phân giải cao nhất 4K 60FPS.', 'Đang nhận tín hiệu camera trực tiếp.'),
    ('alert(`🔴 ĐÃ KẾT NỐI PHÁT LIVE SANG ZOOM WEBINAR/MEETING!\\n\\nKhóa luồng: ${zoomStreamKey}\\nTín hiệu: 4K Ultra HD 60fps (Bitrate: 12,000 Kbps - 0ms Delay)`);', 'alert(`🔴 ĐÃ KẾT NỐI PHÁT LIVE SANG ZOOM WEBINAR/MEETING!\\n\\nKhóa luồng: ${zoomStreamKey}`);'),
    ('⚡ SIÊU MƯỢT 60FPS', '60FPS'),
    ('🔴 ĐANG LIVE ĐA LUỒNG UNLIMITED (FB/TIKTOK/YT/SHOPEE)', 'Đang Phát Đa Kênh'),
    ('🚀 1-CHẠM KẾT NỐI LIVE ĐA NỀN TẢNG', 'Kết Nối Live Đa Nền Tảng'),
    ('🔴 ĐANG PHÁT LIVE REAL-TIME (ON AIR)', 'Đang phát sóng'),
    ('🟢 CHẾ ĐỘ XEM TRƯỚC (PREVIEW MODE) • CHƯA PHÁT SÓNG', 'Chế độ xem trước (Preview)'),
    ('XÓA & THAY PHÔNG NỀN REAL-TIME', 'Thay phông nền')
])

# 4. UnifiedChatHub
replace_in_file('src/components/UnifiedChatHub.jsx', [
    ('THỬ XỬ LÝ REAL-TIME AI TRẢ LỜI', 'Thử AI Trả Lời')
])

# 5. AdminDashboard
replace_in_file('src/components/AdminDashboard.jsx', [
    ('Giám sát real-time toàn bộ doanh thu, SePay VietQR, máy chủ & hoa hồng 30%.', 'Giám sát tổng quan hệ thống.'),
    ('CÔNG TẮC BẬT/TẮT DỊCH VỤ HỆ THỐNG REAL-TIME', 'Bật/Tắt Dịch Vụ Hệ Thống'),
    ('Real-time Webhook Idempotency Active', 'Webhook Active')
])

# 6. AffiliateLanding
replace_in_file('src/components/AffiliateLanding.jsx', [
    ('Thống Kê Real-time', 'Thống Kê Trực Tuyến')
])

# 7. TeamPermissionsManager
replace_in_file('src/components/TeamPermissionsManager.jsx', [
    ('trả lời bình luận khán giả real-time.', 'trả lời bình luận khán giả.')
])

# 8. UserProfile
replace_in_file('src/components/UserProfile.jsx', [
    ('Gói Doanh Nghiệp (Enterprise VIP)', 'Gói Doanh Nghiệp'),
    ('Chưa Đăng Ký Mua Gói Nào (Dùng Thử Miễn Phí)', 'Chưa Đăng Ký Gói'),
    ('CHƯA MUA GÓI NÀO (GÓI MIỄN PHÍ)', 'Chưa đăng ký gói'),
    ('⚡ Ưu Đãi SePay VietQR: Mua Gói Năm Tặng 2 Tháng Miễn Phí (Tiết kiệm 20%)!', 'Ưu đãi: Mua Gói Năm Tặng 2 Tháng (Tiết kiệm 20%)')
])

# 9. AffiliateDashboard
replace_in_file('src/components/AffiliateDashboard.jsx', [
    ('Đồng bộ real-time với hệ thống duyệt chi trả SePay VietQR 3s.', 'Đồng bộ thanh toán SePay.')
])

# 10. SalesAnalyticsManager
replace_in_file('src/components/SalesAnalyticsManager.jsx', [
    ('● CẬP NHẬT REAL-TIME', '● Đã Cập Nhật')
])

# 11. LivestreamClonerStudio
replace_in_file('src/components/LivestreamClonerStudio.jsx', [
    ('Real-time Livestream Player', 'Livestream Player'),
    ('Xem Live trực tiếp (Real-time)', 'Xem trực tiếp')
])

# 12. AIAvatarStudio
replace_in_file('src/components/AIAvatarStudio.jsx', [
    ('Phát Replay Video & Restream Live 24/7 (Unlimited)', 'Phát Replay & Restream'),
    ('Công nghệ AI (Lip-Sync Real-Time) sẽ tự động đồng bộ cử động môi chuẩn 100%.', 'Công nghệ AI sẽ đồng bộ cử động môi tự động.'),
    ('Bấm <strong>"PHÁT MULTISTREAM UNLIMITED"</strong> để đẩy luồng live sang TikTok, FB, YT, Shopee cùng lúc!', 'Bấm <strong>"Phát Tất Cả Kênh"</strong> để đẩy luồng live sang đa nền tảng.'),
    ('● REAL-TIME LIP SYNC ACTIVE', '● LIP SYNC ACTIVE')
])

# 13. LiveCommerceStudio
replace_in_file('src/components/LiveCommerceStudio.jsx', [
    ('🔥 SỰ KIỆN LIVESTREAM BÁN HÀNG — GIẢM GIÁ KHỦNG HÔM NAY!', 'Sự Kiện Livestream Bán Hàng'),
    ('KHÁN GIẢ COMMENT REAL-TIME', 'Bình Luận Gần Đây')
])

print("Additional replacements applied successfully!")
