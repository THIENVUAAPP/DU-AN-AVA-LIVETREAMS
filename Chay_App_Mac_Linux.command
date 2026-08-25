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

# 1. Tự động gỡ cờ bảo mật Gatekeeper cho thư mục (nếu có)
xattr -dr com.apple.quarantine . 2>/dev/null || true

# 2. Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    # Thử tìm các đường dẫn Node.js phổ biến trên macOS (Homebrew M1/M2/M3 hoặc Intel hoặc NVM)
    if [ -f "/usr/local/bin/node" ]; then
        export PATH="/usr/local/bin:$PATH"
    elif [ -f "/opt/homebrew/bin/node" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
    elif [ -d "$HOME/.nvm" ]; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
fi

if ! command -v node &> /dev/null; then
    echo "⚠️ CHÚ Ý: Chưa tìm thấy Node.js trên máy Mac của bạn."
    echo "👉 Vui lòng tải và cài đặt Node.js miễn phí tại: https://nodejs.org (Bản LTS khuyên dùng)"
    echo "Sau khi cài xong, chỉ cần nhấn đúp chuột vào file này một lần nữa để chạy!"
    echo ""
    read -p "Bấm phím Enter để đóng cửa sổ..."
    exit 1
fi

echo "✅ Đã phát hiện Node.js phiên bản: $(node -v)"

# Đi vào thư mục dữ liệu app_data nếu có
if [ -d "app_data" ]; then
    cd app_data
fi

# 3. Tạo file cấu hình .env nếu chưa có
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "⚙️ Đã tự động khởi tạo file cấu hình .env"
fi

# 3. Tự động cài đặt thư viện cần thiết nếu chưa có
if [ ! -d "node_modules" ] || [ ! -d "node_modules/express" ]; then
    echo "📦 Đang tự động nạp thư viện hệ thống lần đầu (chỉ mất vài giây)..."
    npm install --omit=dev --no-audit --no-fund
    echo "✅ Cài đặt thư viện hoàn tất!"
fi

echo "📡 Đang khởi chạy Server TikTok Live Connector & Giao Diện Game..."
echo "🌐 Ứng dụng sẽ tự động mở tại: http://localhost:3001"
echo ""

# 4. Mở trình duyệt web sau 2 giây
(sleep 2 && (open "http://localhost:3001" || xdg-open "http://localhost:3001")) &

# 5. Chạy Backend Server
node backend/server.cjs
