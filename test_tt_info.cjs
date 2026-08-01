const { TikTokLiveConnection } = require('tiktok-live-connector');

async function getStreamUrl(username) {
  let connection = new TikTokLiveConnection(username, {});
  try {
    const roomInfo = await connection.connect();
    console.log(roomInfo.room_info.stream_url.flv_pull_url);
    console.log(roomInfo.room_info.owner.nickname);
    console.log(roomInfo.room_info.user_count);
  } catch (e) {
    console.error(e);
  }
}
getStreamUrl('thukabi1');
