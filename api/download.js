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

    const prefix = isMac ? 'AvaLive_VIP_PRO_Mac' : 'AvaLive_VIP_PRO_Windows';
    const fallbackFileName = isMac ? 'AvaLive_VIP_PRO_Mac.zip' : 'AvaLive_VIP_PRO_Windows.zip';
    const githubToken = process.env.GITHUB_TOKEN;

    const headers = {
      'User-Agent': 'AvaLive-Download-Agent/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    let downloadUrl = null;

    // 1. Quét GitHub Releases tìm file ZIP mới nhất
    try {
      const relRes = await fetch('https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases', { headers });
      if (relRes.ok) {
        const releases = await relRes.json();
        if (Array.isArray(releases)) {
          for (const rel of releases) {
            const asset = (rel.assets || []).find(a => a.name.startsWith(prefix) && a.name.endsWith('.zip'));
            if (asset && asset.browser_download_url) {
              downloadUrl = asset.browser_download_url;
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn('GitHub API query error:', e);
    }

    // 2. Dự phòng đường link bản phát hành chuẩn nếu API bị giới hạn
    if (!downloadUrl) {
      downloadUrl = isMac 
        ? 'https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v2.0.9/AvaLive_VIP_PRO_Mac_v2.0.9.zip'
        : 'https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v2.0.9/AvaLive_VIP_PRO_Windows_v2.0.9.zip';
    }

    res.setHeader('Location', downloadUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fallbackFileName}"`);
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
