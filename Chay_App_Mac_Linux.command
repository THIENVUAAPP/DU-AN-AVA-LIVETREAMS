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

# 3. Đi vào thư mục dữ liệu app_data
# Kiểm tra xem có đang chạy trong MacOS .app bundle không
if [ -d "../Resources/app_data" ]; then
    cd "../Resources/app_data"
elif [ -d "app_data" ]; then
    cd "app_data"
fi

# Khởi tạo .env nếu chưa có
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env 2>/dev/null || true
fi

# 3.5. Tự động tin cậy chứng chỉ HTTPS nội bộ vào Keychain của tài khoản hiện tại
# (để trình duyệt KHÔNG hiện cảnh báo bảo mật khi mở app — cần thiết để Camera hoạt động qua HTTPS)
if [ -f "certs/dev-cert.pem" ]; then
    security add-trusted-cert -r trustRoot -p ssl -k "$HOME/Library/Keychains/login.keychain-db" "certs/dev-cert.pem" >/dev/null 2>&1 || true
fi

# 4. Mở trình duyệt web tự động ngay khi máy chủ sẵn sàng
(
    APP_URL="http://127.0.0.1:3001/?update_cache=$RANDOM"
    for i in {1..30}; do
        if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3001" 2>/dev/null | grep -qE "200|304|302|301"; then
            open "$APP_URL" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || xdg-open "$APP_URL" 2>/dev/null
            exit 0
        fi
        sleep 0.5
    done
    open "http://127.0.0.1:3001" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app" 2>/dev/null
) &

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
    
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo ""
    "$NODE_CMD" backend/server.cjs
elif command -v python3 &> /dev/null; then
    echo "⚡ Đang mở giao diện với Python Web Server..."
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo ""
    python3 -m http.server 3001 --directory dist
else
    echo "⚠️ Đang mở phiên bản Cloud trực tuyến tại: https://avalivepro.vercel.app"
    open "https://avalivepro.vercel.app" 2>/dev/null || true
fi

