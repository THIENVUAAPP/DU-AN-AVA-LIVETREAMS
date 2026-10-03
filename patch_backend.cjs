const fs = require('fs');
const path = 'backend/server.cjs';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /io\.emit\('tiktok_status', \{ connected: false, username: targetUser, note: 'Tài khoản chưa phát Live hoặc đã tắt\. Đang chờ kết nối\.\.\.' \}\);/g,
  "io.emit('tiktok_status', { connected: true, username: targetUser, note: 'Tài khoản chưa phát Live. Hệ thống vẫn đang chờ và theo dõi...', flvUrl: finalFlv });\n      io.emit('tiktok_connected', { username: targetUser, note: 'Tài khoản chưa phát Live. Hệ thống vẫn đang chờ và theo dõi...', flvUrl: finalFlv });"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched backend/server.cjs successfully.');
