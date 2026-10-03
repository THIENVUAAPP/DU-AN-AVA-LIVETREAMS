import fs from 'fs';
import path from 'path';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const queryOS = req.query.os || req.query.targetOS || '';
    const pathname = (req.url || '').toLowerCase();
    
    let isMac = false;
    if (pathname.includes('/mac') || queryOS === 'mac') {
      isMac = true;
    } else if (pathname.includes('/win') || queryOS === 'win' || queryOS === 'windows') {
      isMac = false;
    } else {
      isMac = userAgent.includes('mac');
    }

    const osPrefix = isMac ? 'AvaLive_VIP_PRO_Mac' : 'AvaLive_VIP_PRO_Windows';
    let pkgVersion = '5.4.52';
    try {
      const pkgPath = path.join(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.version) pkgVersion = pkg.version;
    } catch(e) {
      // Fallback khi chạy serverless có thể path khác
      try {
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        if (pkg.version) pkgVersion = pkg.version;
      } catch(err) {}
    }
    
    // Tự động phân giải tên file kèm phiên bản mới nhất từ package.json
    let targetFileName = `${osPrefix}_v${pkgVersion}.zip`;
    let downloadUrl = '';

    try {
      const token = process.env.GITHUB_TOKEN || '';
      const headers = { 'User-Agent': 'AvaLive-Download-Agent/1.0', 'Accept': 'application/vnd.github.v3+json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // LUÔN LẤY LATEST RELEASE TRỰC TIẾP TỪ GITHUB (TRÁNH LỖI VERCEL CACHE / CHƯA DEPLOY)
      const latestRes = await fetch('https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/latest', { headers });
      if (latestRes.ok) {
        const release = await latestRes.json();
        const asset = (release.assets || []).find(a => a.name && (a.name.startsWith(osPrefix) && a.name.endsWith('.zip')));
        if (asset && asset.browser_download_url) {
          downloadUrl = asset.browser_download_url;
          targetFileName = asset.name;
        }
      }
    } catch (e) {
      console.warn('API releases fetch warning:', e.message);
    }

    if (!downloadUrl) {
      // Fallback
      downloadUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/latest/download/${targetFileName}`;
    }

    // TĂNG TỐC DOWNLOAD
    let acceleratedUrl = `https://gh-proxy.com/${downloadUrl}`;

    // Xóa bộ nhớ đệm trình duyệt & Vercel để khách luôn tải bản mới
    res.setHeader('Location', acceleratedUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
