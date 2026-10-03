const fs = require('fs');
const path = 'src/lib/masterLiveSync.js';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `  if (isBlobMedia && remoteUpdated.mediaUrl === undefined) delete remoteUpdated.mediaUrl;`;
const replacementStr = `  if (isBlobMedia && remoteUpdated.mediaUrl === undefined) delete remoteUpdated.mediaUrl;

  // TỰ ĐỘNG CHUYỂN ĐỔI LINK LOCALHOST THÀNH LINK CLOUDFLARE TUNNEL (ĐỂ VERCEL HTTPS CÓ THỂ ĐỌC ĐƯỢC - TRÁNH LỖI MIXED CONTENT)
  if (remoteUpdated.mediaUrl && typeof remoteUpdated.mediaUrl === 'string' && updated.tunnelUrl) {
    if (remoteUpdated.mediaUrl.includes('localhost') || remoteUpdated.mediaUrl.includes('127.0.0.1')) {
      remoteUpdated.mediaUrl = remoteUpdated.mediaUrl.replace(/https?:\\/\\/(localhost|127\\.0\\.0\\.1)(:\\d+)?/, updated.tunnelUrl);
    } else if (remoteUpdated.mediaUrl.startsWith('/uploads/')) {
      remoteUpdated.mediaUrl = \`\${updated.tunnelUrl.replace(/\\/$/, '')}\${remoteUpdated.mediaUrl}\`;
    }
  }`;

if (content.includes(targetStr) && !content.includes('TỰ ĐỘNG CHUYỂN ĐỔI LINK LOCALHOST')) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Patched masterLiveSync.js successfully.');
} else {
  console.log('Already patched or target string not found.');
}
