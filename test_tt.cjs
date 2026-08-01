const { WebcastPushConnection } = require('tiktok-live-connector');
async function test() {
  let tiktokLiveConnection = new WebcastPushConnection('lequynh.68');
  try {
    const state = await tiktokLiveConnection.connect();
    console.log(state);
  } catch (e) { console.error(e); }
}
test();
