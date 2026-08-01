const { WebcastPushConnection } = require('tiktok-live-connector');

const tiktokUsername = "tiktok";
const connection = new WebcastPushConnection(tiktokUsername);

connection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
    console.log(state);
    process.exit(0);
}).catch(err => {
    console.error('Failed to connect', err);
    process.exit(1);
})
