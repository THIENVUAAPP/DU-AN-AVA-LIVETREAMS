#!/bin/bash
# ==============================================================================
# AVALIVE VIP PRO - 1-CLICK LAUNCHER CHO MACOS & LINUX
# Tự động khởi động máy chủ và mở trình duyệt web điều khiển + game livestream
# ==============================================================================

# Chuyển đến thư mục hiện tại của file chạy
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "================================================================="
echo "  🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (MAC/LINUX)"
echo "================================================================="
echo ""

# 1. Tự động gỡ cờ bảo mật Gatekeeper và cấp quyền thực thi
xattr -dr com.apple.quarantine "$SCRIPT_DIR" 2>/dev/null || true
chmod -R 755 "$SCRIPT_DIR" 2>/dev/null || true

# 2. Tìm Node.js trong tất cả các đường dẫn tiêu chuẩn trên macOS
NODE_CMD=""
for p in \
    "$(which node 2>/dev/null)" \
    "/opt/homebrew/bin/node" \
    "/usr/local/bin/node" \
    "/usr/bin/node" \
    "$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin/node" \
    "$HOME/.volta/bin/node" \
    "$HOME/.fnm/current/bin/node" \
    "$HOME/.asdf/shims/node"
do
    if [ -n "$p" ] && [ -x "$p" ]; then
        NODE_CMD="$p"
        export PATH="$(dirname "$p"):$PATH"
        break
    fi
done

# 3. Đi vào thư mục dữ liệu app_data nếu có
if [ -d "app_data" ]; then
    cd app_data
fi

# Khởi tạo .env nếu chưa có
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env 2>/dev/null || true
fi

# 4. Mở trình duyệt web tự động
(sleep 1 && (open "http://localhost:3001" 2>/dev/null || xdg-open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app")) &

# 5. Khởi động Server
if [ -n "$NODE_CMD" ]; then
    echo "✅ Đang chạy máy chủ với Node.js: $($NODE_CMD -v)"
    
    # Tự động cài đặt dependencies nếu chưa có
    if [ ! -d "node_modules" ]; then
        echo "⏳ Lần đầu chạy: Đang tự động cài đặt thư viện cần thiết (vui lòng đợi khoảng 1 phút)..."
        NPM_CMD="$(dirname "$NODE_CMD")/npm"
        if [ -x "$NPM_CMD" ]; then
            "$NPM_CMD" install --omit=dev
        else
            npm install --omit=dev
        fi
        echo "✅ Cài đặt hoàn tất!"
        echo ""
    fi
    
    echo "🌐 Giao diện ứng dụng đang mở tại: http://localhost:3001"
    echo ""
    "$NODE_CMD" backend/server.cjs
elif command -v python3 &> /dev/null; then
    echo "⚡ Đang mở giao diện với Python Web Server..."
    echo "🌐 Giao diện ứng dụng đang mở tại: http://localhost:3001"
    echo ""
    python3 -m http.server 3001 --directory dist
else
    echo "⚠️ Đang mở phiên bản Cloud trực tuyến tại: https://avalivepro.vercel.app"
    open "https://avalivepro.vercel.app" 2>/dev/null || true
fi

