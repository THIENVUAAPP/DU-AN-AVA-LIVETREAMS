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

# 1. Tự động gỡ cờ bảo mật Gatekeeper cho thư mục
xattr -dr com.apple.quarantine . 2>/dev/null || true

# 2. Tìm Node.js trong các đường dẫn tiêu chuẩn
if ! command -v node &> /dev/null; then
    if [ -f "/usr/local/bin/node" ]; then
        export PATH="/usr/local/bin:$PATH"
    elif [ -f "/opt/homebrew/bin/node" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
    elif [ -d "$HOME/.nvm" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
fi

# 3. Đi vào thư mục dữ liệu app_data nếu có
if [ -d "app_data" ]; then
    cd app_data
fi

# Khởi tạo .env nếu chưa có
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
fi

# 4. Mở trình duyệt web ngay lập tức
(sleep 1 && (open "http://localhost:3001" || xdg-open "http://localhost:3001")) &

# 5. Khởi động Server
if command -v node &> /dev/null; then
    echo "✅ Đang chạy máy chủ với Node.js: $(node -v)"
    echo "🌐 Giao diện ứng dụng đang mở tại: http://localhost:3001"
    echo ""
    node backend/server.cjs
else
    echo "⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy Mac."
    echo "👉 Vui lòng cài đặt Node.js miễn phí tại: https://nodejs.org"
    echo "Sau khi cài xong, nhấp đúp lại vào file này để khởi chạy."
    read -p "Bấm phím Enter để đóng cửa sổ..."
fi
