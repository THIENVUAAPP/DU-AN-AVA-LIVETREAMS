const fs = require('fs');
let code = fs.readFileSync('scripts/create_standalone_zip.cjs', 'utf-8');
const search = `    exit 1
fi`;
const replace = `    exit 1
fi

NODE_VER=$("$NODE_CMD" -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VER" -lt 18 ]; then
    echo "❌ Phiên bản Node.js của bạn quá cũ ($("$NODE_CMD" -v))!"
    echo "👉 Phần mềm yêu cầu Node.js v18 trở lên (để hỗ trợ Fetch API)."
    echo "👉 Vui lòng tải và cài đặt bản mới nhất tại https://nodejs.org/"
    read -p "Nhấn Enter để thoát..."
    exit 1
fi`;
code = code.replace(search, replace);
fs.writeFileSync('scripts/create_standalone_zip.cjs', code);
