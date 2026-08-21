(async () => {
    let TikTokConnector = null;
    const legacy = await import('tiktok-live-connector/legacy');
    TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
    let tiktokUsername = "hian8668";
    let tiktokLiveConnection = new TikTokConnector(tiktokUsername, {});
    try {
        let state = await tiktokLiveConnection.connect();
        const data = state.roomInfo.data;
        if(data && data.stream_url) {
            let flvUrl = null;
            // check flv_pull_url object
            if (data.stream_url.flv_pull_url) {
                const urls = Object.values(data.stream_url.flv_pull_url);
                if (urls.length > 0) flvUrl = urls[0];
            }
            if (!flvUrl && data.stream_url.rtmp_pull_url) {
                flvUrl = data.stream_url.rtmp_pull_url; // fallback
            }
            console.log("BEST FLV URL:", flvUrl);
        }
    } catch(err) {
        console.error('Failed to connect', err);
    }
    process.exit(0);
})();
