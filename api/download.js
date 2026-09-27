let _cachedUrls = {};
let _lastCacheTime = 0;

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
    const cacheKey = `${osPrefix}_latest`;

    let finalDownloadUrl = null;
    let targetFileName = isMac ? 'AvaLive_VIP_PRO_Mac_v4.9.54.zip' : 'AvaLive_VIP_PRO_Windows_v4.9.54.zip';

    // 1. Kiểm tra cache trong bộ nhớ (hết hạn sau 60 giây)
    if (_cachedUrls[cacheKey] && (Date.now() - _lastCacheTime < 60000)) {
      finalDownloadUrl = _cachedUrls[cacheKey].url;
      targetFileName = _cachedUrls[cacheKey].fileName;
    } else {
      // 2. Tự động truy vấn danh sách Releases mới nhất từ GitHub API
      try {
        const ghRes = await fetch('https://api.github.com/repos/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases', {
          headers: {
            'User-Agent': 'AvaLive-Download-Agent/1.0',
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (ghRes.ok) {
          const releases = await ghRes.json();
          if (Array.isArray(releases)) {
            for (const rel of releases) {
              const asset = (rel.assets || []).find(a => a.name && a.name.startsWith(osPrefix) && a.name.endsWith('.zip'));
              if (asset && asset.browser_download_url) {
                finalDownloadUrl = asset.browser_download_url;
                targetFileName = asset.name;
                _cachedUrls[cacheKey] = { url: finalDownloadUrl, fileName: targetFileName };
                _lastCacheTime = Date.now();
                break;
              }
            }
          }
        }
      } catch (ghErr) {
        console.warn('[Download API] GitHub API query error:', ghErr.message);
      }
    }

    // 3. Fallback an toàn tuyệt đối nếu GitHub API không phản hồi (đảm bảo không bao giờ bị 404 trên github.com)
    if (!finalDownloadUrl) {
      finalDownloadUrl = isMac
        ? 'https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v4.9.54/AvaLive_VIP_PRO_Mac_v4.9.54.zip'
        : 'https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v4.9.54/AvaLive_VIP_PRO_Windows_v4.9.54.zip';
      targetFileName = isMac ? 'AvaLive_VIP_PRO_Mac_v4.9.54.zip' : 'AvaLive_VIP_PRO_Windows_v4.9.54.zip';
    }

    // Redirect trực tiếp tới asset stream với Header ép tải file
    res.setHeader('Location', finalDownloadUrl);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.status(302).end();
  } catch (err) {
    console.error('Download handler error:', err);
    return res.status(500).json({ error: 'Download failed', message: err.message });
  }
}
