const tt = require('tiktok-live-connector');
console.log(tt.WebcastPushConnection);
// let's try to initialize it
try {
  let conn = new tt.WebcastPushConnection('thoitrangmevabe');
  conn.getRoomInfo().then(info => console.log(info)).catch(e => console.log(e));
} catch(e) {
  console.log('Constructor failed:', e);
}
