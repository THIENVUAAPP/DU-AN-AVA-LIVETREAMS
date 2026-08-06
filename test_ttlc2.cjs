const { TikTokLiveConnection } = require('tiktok-live-connector');
async function test() {
    try {
        let connection = new TikTokLiveConnection('nx.cielo9', {processInitialData: false});
        const roomInfo = await connection.fetchRoomInfo();
        console.log("Is Live:", roomInfo.status === 2);
        if (roomInfo.stream_url) {
            console.log("STREAM:", roomInfo.stream_url.flv_pull_url || roomInfo.stream_url.hls_pull_url);
        } else {
            console.log("No stream url", Object.keys(roomInfo));
        }
    } catch(e) { console.log("ERROR:", e); }
}
test();
