const { TikTokLiveConnection, fetchRoomInfoFromEulerRoute } = require('tiktok-live-connector');

async function test() {
    try {
        const connection = new TikTokLiveConnection('rcaeterna', { signApiKey: 'euler_ZmE5ODQzZmM0MzZlMDNlODBkNWEzNTUwZGFhZjQxMjNmN2RjMTA3ZjU2YWE0ZGNlOGU2MTQ1' });
        
        const res = await fetchRoomInfoFromEulerRoute({
            webClient: connection.webClient,
            apiClient: connection.apiClient,
            uniqueId: "rcaeterna"
        });
        
        if (res.data && res.data.stream_url) {
            console.log("SUCCESS:", res.data.stream_url.flv_pull_url);
            console.log("HLS:", res.data.stream_url.hls_pull_url);
        } else {
            console.log("No stream_url in response");
        }
    } catch(e) {
        console.log("Error:", e.message || e);
    }
}
test();
