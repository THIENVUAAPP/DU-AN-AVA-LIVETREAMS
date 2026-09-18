const { WebcastPushConnection } = require('tiktok-live-connector');

async function test() {
    try {
        const tiktokLiveConnection = new WebcastPushConnection('phuonglenxx', {
            processInitialData: true,
            enableExtendedGiftInfo: true
        });
        const state = await tiktokLiveConnection.connect();
        console.log("Connected to room:", state.roomId);
        console.log("Stream URL:", state.roomInfo?.stream_url?.hls_pull_url);
        process.exit(0);
    } catch (err) {
        console.error("Failed:", err.message);
        process.exit(1);
    }
}
test();
