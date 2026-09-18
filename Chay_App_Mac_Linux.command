#!/bin/bash
# ==============================================================================
# AVALIVE VIP PRO - 1-CLICK LAUNCHER CHO MACOS & LINUX
# Tự động khởi động máy chủ và mở trình duyệt web điều khiển + game livestream
# ==============================================================================

# 1. Chuyển đến thư mục hiện tại của file chạy
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "================================================================="
echo "  🚀 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (MAC/LINUX)"
echo "================================================================="
echo ""

# 2. Tự động nạp môi trường Terminal và Shell Profiles (NVM, Homebrew, Volta, FNM)
[ -f "$HOME/.zprofile" ] && source "$HOME/.zprofile" 2>/dev/null || true
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null || true
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" 2>/dev/null || true
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 3. Tự động gỡ cờ bảo mật Gatekeeper và cấp quyền thực thi
xattr -dr com.apple.quarantine "$SCRIPT_DIR" 2>/dev/null || true
chmod +x "$0" 2>/dev/null || true
chmod +x "$SCRIPT_DIR"/*.command "$SCRIPT_DIR"/*.sh 2>/dev/null || true

# 4. Tìm Node.js trong tất cả các đường dẫn tiêu chuẩn trên macOS & Linux
NODE_CMD=""
for p in \
    "$(command -v node 2>/dev/null)" \
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

# 5. Xác định chính xác thư mục chứa backend/server.cjs
if [ -f "backend/server.cjs" ]; then
    # Đang ở thư mục gốc chứa backend
    APP_ROOT="$SCRIPT_DIR"
elif [ -d "app_data" ] && [ -f "app_data/backend/server.cjs" ]; then
    cd "app_data"
    APP_ROOT="$SCRIPT_DIR/app_data"
elif [ -d "../Resources/app_data" ] && [ -f "../Resources/app_data/backend/server.cjs" ]; then
    cd "../Resources/app_data"
    APP_ROOT="$(pwd)"
fi

# Khởi tạo .env nếu chưa có
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env 2>/dev/null || true
fi

# 6. Dọn dẹp tiến trình cũ chiếm cổng 3001 nếu có
if command -v lsof &>/dev/null; then
    OLD_PID=$(lsof -ti :3001 2>/dev/null)
    if [ -n "$OLD_PID" ]; then
        echo "🔄 Đang giải phóng cổng 3001 (PID: $OLD_PID)..."
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 0.5
    fi
fi

# 7. Mở trình duyệt web tự động ngay khi máy chủ sẵn sàng
(
    APP_URL="http://127.0.0.1:3001/?update_cache=$RANDOM"
    for i in {1..40}; do
        if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3001" 2>/dev/null | grep -qE "200|304|302|301"; then
            echo "✨ Máy chủ đã sẵn sàng! Đang mở trình duyệt..."
            open "$APP_URL" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || xdg-open "$APP_URL" 2>/dev/null
            exit 0
        fi
        sleep 0.5
    done
    open "http://127.0.0.1:3001" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app" 2>/dev/null
) &

# 8. Khởi động Server
if [ -n "$NODE_CMD" ] && [ -f "backend/server.cjs" ]; then
    echo "✅ Đang chạy máy chủ với Node.js: $($NODE_CMD -v)"
    
    # Tự động cài đặt dependencies nếu chưa có
    if [ ! -d "node_modules" ]; then
        echo "⏳ Lần đầu chạy: Đang tự động cài đặt thư viện cần thiết (vui lòng đợi một lát)..."
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
    echo "💡 Mẹo: Bấm phím Control + C trong cửa sổ này để tắt máy chủ khi dùng xong."
    echo ""
    "$NODE_CMD" backend/server.cjs
elif [ -n "$NODE_CMD" ] && [ -f "package.json" ]; then
    echo "✅ Đang khởi động AvaLive qua Node/NPM..."
    NPM_CMD="$(dirname "$NODE_CMD")/npm"
    if [ -x "$NPM_CMD" ]; then
        "$NPM_CMD" run dev
    else
        npm run dev
    fi
elif command -v python3 &> /dev/null && [ -d "dist" ]; then
    echo "⚡ Đang mở giao diện với Python Web Server..."
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo ""
    python3 -m http.server 3001 --directory dist
else
    echo "⚠️ Đang mở phiên bản Cloud trực tuyến tại: https://avalivepro.vercel.app"
    open "https://avalivepro.vercel.app" 2>/dev/null || true
fi
