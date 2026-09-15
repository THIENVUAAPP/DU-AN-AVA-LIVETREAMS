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
    let currentVersion = '3.0.0';
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
    let targetFileName = `${osPrefix}_v${currentVersion}.zip`;
    const githubToken = process.env.GITHUB_TOKEN || '';

    const headers = {
      'User-Agent': 'AvaLive-Download-Agent/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Link tải trực tiếp mặc định theo phiên bản mới nhất
    let downloadUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${currentVersion}/${targetFileName}`;

    try {
      // 1. Kiểm tra release của phiên bản hiện tại v1.3.7
      const tagRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/tags/v${currentVersion}`, { headers });
      if (tagRes.ok) {
        const release = await tagRes.json();
        const asset = (release.assets || []).find(a => a.name.startsWith(osPrefix) && a.name.endsWith('.zip'));
        if (asset && asset.browser_download_url) {
          downloadUrl = asset.browser_download_url;
          targetFileName = asset.name;
        }
      } else {
        // 2. Dự phòng: Tự động quét danh sách releases để lấy bản phát hành MỚI NHẤT có file zip tương ứng
        const allRelRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases?per_page=10`, { headers });
        if (allRelRes.ok) {
          const releases = await allRelRes.json();
          for (const rel of releases) {
            const asset = (rel.assets || []).find(a => a.name.startsWith(osPrefix) && a.name.endsWith('.zip'));
            if (asset && asset.browser_download_url) {
              downloadUrl = asset.browser_download_url;
              targetFileName = asset.name;
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn('GitHub API query error:', e);
    }

    // Redirect trực tiếp tới asset stream với Header ép tải file
    res.setHeader('Location', downloadUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
