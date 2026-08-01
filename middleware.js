export default async function middleware(request) {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/proxy-video/')) {
    // The path will be something like /proxy-video/pull-f5-ms.tiktokcdn.com/stream.flv
    const targetUrl = url.pathname.replace('/proxy-video/', 'https://') + url.search;
    
    // Create a new request with modified headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Origin', 'https://www.tiktok.com');
    requestHeaders.set('Referer', 'https://www.tiktok.com/');
    requestHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Fetch from the target URL
    const response = await fetch(targetUrl, {
      headers: requestHeaders,
    });
    
    // Create a new response to stream back to the client
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  }
}
