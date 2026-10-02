const fs = require('fs');
let code = fs.readFileSync('scripts/create_standalone_zip.cjs', 'utf-8');

const search = `    if [ -n "$p" ] && [ -x "$p" ]; then
        NODE_CMD="$p"
        export PATH="$(dirname "$p"):$PATH"
        break
    fi`;

const replace = `    if [ -n "$p" ] && [ -x "$p" ]; then
        NODE_VER=$("$p" -v | tr -d 'v' | cut -d '.' -f 1)
        if [ "$NODE_VER" -ge 18 ]; then
            NODE_CMD="$p"
            export PATH="$(dirname "$p"):$PATH"
            break
        fi
    fi`;

if (code.includes(search)) {
    code = code.replace(search, replace);
    fs.writeFileSync('scripts/create_standalone_zip.cjs', code);
    console.log('Patched NODE_VER loop!');
} else {
    console.log('Search string not found!');
}

const search2 = `else
    echo "⚠️ Không tìm thấy Node.js trên máy Mac của bạn."`;
const replace2 = `else
    echo "⚠️ KHÔNG TÌM THẤY NODE.JS (hoặc phiên bản hiện tại quá cũ, yêu cầu >= v18)!"
    echo "👉 BẠN CẦN PHẢI CÀI ĐẶT NODE.JS v18+ ĐỂ CHẠY PHẦN MỀM NÀY."
    echo "👉 Hãy tải bản mới nhất từ: https://nodejs.org/"
    echo "👉 (Đang tự động mở trang tải Node.js cho bạn...)"
    open "https://nodejs.org/" 2>/dev/null
    sleep 5`;

if (code.includes(search2)) {
    code = code.replace(search2, replace2);
    fs.writeFileSync('scripts/create_standalone_zip.cjs', code);
    console.log('Patched final fallback!');
} else {
    console.log('Search2 string not found!');
}

