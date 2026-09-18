const http = require('http');
const { Readable } = require('stream');

const server = http.createServer(async (req, res) => {
    if (req.url === '/proxy') {
        const response = await fetch("https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png");
        res.setHeader('Content-Type', 'image/png');
        if (response.body.pipe) {
            response.body.pipe(res);
        } else {
            Readable.fromWeb(response.body).pipe(res);
        }
    } else {
        res.end("Hello");
    }
});
server.listen(4000, () => console.log("Test server running on 4000"));
