const { WebcastPushConnection } = require('tiktok-live-connector');

let tiktokLiveConnection = new WebcastPushConnection('thoitrangmevabe');
tiktokLiveConnection.getRoomInfo().then(roomInfo => {
    // try to get stream url
    console.log("Room ID:", roomInfo.room_id);
    if (roomInfo.stream_url) {
        console.log("Stream URL found in roomInfo");
        // Print it deeply if it exists
        console.log(roomInfo.stream_url.flv_pull_url);
    } else {
        console.log("No stream_url in roomInfo");
    }
}).catch(err => {
    console.error("Error:", err);
});
