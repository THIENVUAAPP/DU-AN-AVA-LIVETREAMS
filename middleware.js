export const config = {
  matcher: ['/proxy-hls', '/proxy-ts'],
};

export default async function middleware(request) {
  const url = new URL(request.url);
  
  if (url.pathname === '/proxy-hls') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) return new Response('Missing URL', { status: 400 });
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Origin', 'https://www.tiktok.com');
    requestHeaders.set('Referer', 'https://www.tiktok.com/');
    requestHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const response = await fetch(targetUrl, { headers: requestHeaders });
    let text = await response.text();
    
    // Replace all URIs in the M3U8 file
    const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
    
    // Replace TS chunk lines
    text = text.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (trimmed.startsWith('#')) {
        // Handle nested M3U8
        if (trimmed.includes('URI="')) {
          return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
            const absoluteUri = uri.startsWith('http') ? uri : baseUrl + uri;
            return `URI="/proxy-hls?url=${encodeURIComponent(absoluteUri)}"`;
          });
        }
        return line;
      }
      // This is a TS chunk URL
      const absoluteUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
      return `/proxy-ts?url=${encodeURIComponent(absoluteUrl)}`;
    }).join('\n');
    
    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl');
    
    return new Response(text, { status: 200, headers: responseHeaders });
  }
  
  if (url.pathname === '/proxy-ts') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) return new Response('Missing URL', { status: 400 });
    
    const requestHeaders = new Headers();
    requestHeaders.set('Origin', 'https://www.tiktok.com');
    requestHeaders.set('Referer', 'https://www.tiktok.com/');
    requestHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const response = await fetch(targetUrl, { headers: requestHeaders });
    
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  }
}
