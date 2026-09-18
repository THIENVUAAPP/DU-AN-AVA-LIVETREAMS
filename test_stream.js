const { Readable } = require('stream');
async function run() {
    const res = await fetch("https://www.google.com");
    console.log(res.body);
    const readable = Readable.fromWeb(res.body);
    let size = 0;
    readable.on('data', chunk => size += chunk.length);
    readable.on('end', () => console.log("Done! Size:", size));
}
run().catch(console.error);
