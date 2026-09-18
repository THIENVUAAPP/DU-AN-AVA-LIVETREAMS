import { WebcastPushConnection } from 'tiktok-live-connector';

let tiktokLiveConnection = new WebcastPushConnection('thukabi1');

tiktokLiveConnection.connect().then(state => {
    console.log("Room ID:", state.roomId);
    console.log("Stream URL:", state.roomInfo.stream_url.flv_pull_url);
    process.exit(0);
}).catch(err => {
    console.error("Failed:", err);
    process.exit(1);
})
