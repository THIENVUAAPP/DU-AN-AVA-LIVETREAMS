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

    const currentVersion = '2.3.1';
    const prefix = isMac ? `AvaLive_VIP_PRO_Mac_v${currentVersion}` : `AvaLive_VIP_PRO_Windows_v${currentVersion}`;
    const fallbackFileName = isMac ? `AvaLive_VIP_PRO_Mac_v${currentVersion}.zip` : `AvaLive_VIP_PRO_Windows_v${currentVersion}.zip`;
    const githubToken = process.env.GITHUB_TOKEN;

    const headers = {
      'User-Agent': 'AvaLive-Download-Agent/1.0',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    let downloadUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${currentVersion}/${fallbackFileName}`;

    // 1. Quét GitHub Releases tag chính xác v2.1.0
    try {
      const relRes = await fetch(`https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/tags/v${currentVersion}`, { headers });
      if (relRes.ok) {
        const release = await relRes.json();
        const asset = (release.assets || []).find(a => a.name.includes(currentVersion) && a.name.startsWith(isMac ? 'AvaLive_VIP_PRO_Mac' : 'AvaLive_VIP_PRO_Windows') && a.name.endsWith('.zip'));
        if (asset && asset.browser_download_url) {
          downloadUrl = asset.browser_download_url;
        }
      }
    } catch (e) {
      console.warn('GitHub API query error:', e);
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
