#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================="
echo "  🍏 ĐANG KHỞI ĐỘNG HỆ THỐNG AVALIVE LIVESTREAM VIP PRO (macOS)"
echo "================================================================="
echo ""

# 1. Nạp môi trường Shell profiles của người dùng
[ -f "$HOME/.zprofile" ] && source "$HOME/.zprofile" 2>/dev/null || true
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null || true
[ -f "$HOME/.bash_profile" ] && source "$HOME/.bash_profile" 2>/dev/null || true
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/local/sbin:$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$HOME/.cargo/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 2. Tự động đóng tiến trình cũ đang chiếm cổng 3001 nếu có
if command -v lsof &>/dev/null; then
    OLD_PID=$(lsof -ti :3001 2>/dev/null)
    if [ -n "$OLD_PID" ]; then
        echo "🔄 Đang giải phóng cổng 3001 (PID: $OLD_PID)..."
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 0.5
    fi
fi

# 3. Ẩn thư mục system để không gây rối mắt
chflags hidden "$DIR/system" 2>/dev/null || true

cd "$DIR/system"
chmod +x "$DIR/system/cloudflared" 2>/dev/null || true

# 4. Tìm Node.js trên tất cả các vị trí của macOS
NODE_CMD=""
for p in \
    "$(command -v node 2>/dev/null)" \
    "/opt/homebrew/bin/node" \
    "/usr/local/bin/node" \
    "/usr/bin/node" \
    "$HOME/.nvm/versions/node/$(ls -t "$HOME/.nvm/versions/node" 2>/dev/null | head -n 1)/bin/node" \
    "$HOME/.volta/bin/node" \
    "$HOME/.fnm/current/bin/node"
do
    if [ -n "$p" ] && [ -x "$p" ]; then
        NODE_CMD="$p"
        export PATH="$(dirname "$p"):$PATH"
        break
    fi
done

# 5. Theo dõi máy chủ sẵn sàng và tự động mở trình duyệt
(
    APP_URL="http://127.0.0.1:3001"
    for i in {1..40}; do
        if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3001" 2>/dev/null | grep -qE "200|304|302|301"; then
            echo "✨ Máy chủ đã sẵn sàng! Đang mở giao diện điều khiển..."
            if [ -d "/Applications/Google Chrome.app" ]; then
                open -na "Google Chrome" --args --app="$APP_URL" 2>/dev/null || open "$APP_URL"
            elif [ -d "/Applications/Microsoft Edge.app" ]; then
                open -na "Microsoft Edge" --args --app="$APP_URL" 2>/dev/null || open "$APP_URL"
            else
                open "$APP_URL"
            fi
            exit 0
        fi
        sleep 0.5
    done
    open "$APP_URL" 2>/dev/null || open "http://localhost:3001" 2>/dev/null || open "https://avalivepro.vercel.app" 2>/dev/null
) &

# 6. Khởi động Server Node.js Core
if [ -n "$NODE_CMD" ] && [ -f "core.cjs" ]; then
    echo "✅ Đang chạy máy chủ với Node.js: $($NODE_CMD -v)"
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo "💡 Mẹo: Bấm phím Control + C trong cửa sổ này để tắt máy chủ khi dùng xong."
    echo ""
    "$NODE_CMD" core.cjs
elif command -v python3 &>/dev/null && [ -d "app" ]; then
    echo "⚡ Đang chạy Web Server với Python3..."
    echo "🌐 Giao diện ứng dụng đang mở tại: http://127.0.0.1:3001"
    echo ""
    python3 -m http.server 3001 --directory app
else
    echo "⚠️ Không tìm thấy Node.js trên máy Mac của bạn."
    echo "👉 Đang mở phiên bản trực tuyến tại: https://avalivepro.vercel.app"
    open "https://avalivepro.vercel.app" 2>/dev/null || true
fi
