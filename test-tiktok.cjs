(async () => {
    let TikTokConnector = null;
    const legacy = await import('tiktok-live-connector/legacy');
    TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
    
    let chatConnection = new TikTokConnector("elizale676", {});
    let videoConnection = new TikTokConnector("nglinggg_", {});
    
    try {
        let chatState = await chatConnection.connect();
        console.log("Chat connected:", chatState.roomId);
        let videoState = await videoConnection.connect();
        console.log("Video connected:", videoState.roomId);
    } catch(err) {
        console.error('Failed', err);
    }
    process.exit(0);
})();
