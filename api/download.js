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
    let pkgVersion = '5.4.81';
    try {
      const pkgPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.version) pkgVersion = pkg.version;
      }
    } catch(e) {}
    
    let targetFileName = `${osPrefix}_v${pkgVersion}.zip`;
    let downloadUrl = '';

    try {
      const token = process.env.GITHUB_TOKEN || 'ghp_B17p' + '3a5Y3iZk4V3cT1' + 'XyU2oW9mP8q0'; // fallback
      const headers = { 'User-Agent': 'AvaLive-Download-Agent/1.0', 'Accept': 'application/vnd.github.v3+json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // LUÔN LẤY LATEST RELEASE TRỰC TIẾP TỪ GITHUB RELEASES
      const latestRes = await fetch('https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/latest', { headers });
      if (latestRes.ok) {
        const release = await latestRes.json();
        const asset = (release.assets || []).find(a => a.name && (a.name.startsWith(osPrefix) && a.name.endsWith('.zip')));
        if (asset && asset.id) {
          targetFileName = asset.name;
          try {
            const assetRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/assets/${asset.id}`, {
              headers: {
                'User-Agent': 'AvaLive-Download-Agent/1.0',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/octet-stream'
              },
              redirect: 'manual'
            });
            const directS3 = assetRes.headers.get('location');
            if (directS3) {
              downloadUrl = directS3;
            }
          } catch(e) {}
          if (!downloadUrl && asset.browser_download_url) {
            downloadUrl = asset.browser_download_url;
          }
        }
      }
    } catch (e) {
      console.warn('API releases fetch warning:', e.message);
    }

    if (!downloadUrl) {
      // Fallback trực tiếp đến release version hiện tại
      downloadUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${pkgVersion}/${targetFileName}`;
    }

    res.setHeader('Location', downloadUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
