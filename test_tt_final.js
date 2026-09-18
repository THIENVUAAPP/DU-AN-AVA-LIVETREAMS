import { TikTokLiveConnection } from 'tiktok-live-connector';
import fs from 'fs';

let tiktokLiveConnection = new TikTokLiveConnection('thukabi1', { processInitialData: false });

tiktokLiveConnection.connect().then(state => {
    fs.writeFileSync('room_info.json', JSON.stringify(state.roomInfo, null, 2));
    console.log("Written to room_info.json");
    process.exit(0);
}).catch(err => {
    console.error("Failed:", err.message);
    process.exit(1);
})
