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

    // Đọc phiên bản mới nhất từ package.json hoặc fallback version hiện tại
    let currentVersion = '4.9.33';
    try {
      const fs = await import('fs');
      const path = await import('path');
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.version) currentVersion = pkg.version;
      }
    } catch (e) {}

    const osPrefix = isMac ? 'AvaLive_VIP_PRO_Mac' : 'AvaLive_VIP_PRO_Windows';
    const targetFileName = `${osPrefix}_v${currentVersion}.zip`;

    // ⚡ LINK TẢI TRỰC TIẾP SIÊU TỐC TỪ GITHUB RELEASES (0ms LATENCY, KHÔNG GẶP RATE LIMIT API)
    const downloadUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${currentVersion}/${targetFileName}`;

    // Redirect trực tiếp tới asset stream với Header ép tải file
    res.setHeader('Location', downloadUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
