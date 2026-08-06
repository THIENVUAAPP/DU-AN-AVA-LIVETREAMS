async function test() {
    const fetch = global.fetch;
    const testUrl = 'https://download.samplelib.com/mp4/sample-5s.mp4';
    const response = await fetch(testUrl);
    
    if (response.body.pipe) {
        console.log("Has pipe");
    } else {
        console.log("No pipe, using fromWeb");
        const { Readable } = require('stream');
        const readable = Readable.fromWeb(response.body);
        let bytes = 0;
        readable.on('data', chunk => {
            bytes += chunk.length;
            console.log("Received chunk:", chunk.length, "Total:", bytes);
            if (bytes > 100000) readable.destroy();
        });
    }
}
test();
