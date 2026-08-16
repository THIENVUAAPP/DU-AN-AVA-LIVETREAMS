#!/bin/bash
# ==============================================================================
# AVALIVE VIP PRO - 1-CLICK LAUNCHER CHO MACOS & LINUX
# Tự động khởi động máy chủ và mở trình duyệt web điều khiển + game livestream
# ==============================================================================

# Chuyển đến thư mục hiện tại của file chạy
cd "$(dirname "$0")"

echo "================================================================="
echo "  🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (MAC/LINUX)"
echo "================================================================="
echo ""

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy của bạn."
    echo "👉 Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org (Bản LTS)"
    echo "Sau khi cài xong, chỉ cần nhấn đúp chuột vào file này một lần nữa để chạy!"
    echo ""
    read -p "Bấm phím Enter để đóng cửa sổ..."
    exit 1
fi

echo "✅ Đã phát hiện Node.js phiên bản: $(node -v)"
echo "📡 Đang khởi chạy Server TikTok Live Connector & Giao Diện Game..."

# Mở trình duyệt web sau 2 giây
(sleep 2 && open "http://localhost:3001") &

# Chạy Backend Server
node backend/server.cjs
