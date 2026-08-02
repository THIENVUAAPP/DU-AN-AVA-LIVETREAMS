const { spawn } = require('child_process');
const pythonProcess = spawn('python3', [
    '-c',
    `
import yt_dlp
import json
import sys

url = "https://www.tiktok.com/@bf_doran_05/live"
ydl_opts = {'quiet': True, 'format': 'best[protocol^=m3u8]/best', 'no_warnings': True}
try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        print(json.dumps({'streamUrl': info.get('url'), 'title': info.get('title'), 'viewers': info.get('view_count'), 'uploader': info.get('uploader'), 'thumbnail': info.get('thumbnail')}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
    `
]);
let data = '';
let err = '';
pythonProcess.stdout.on('data', chunk => data += chunk);
pythonProcess.stderr.on('data', chunk => err += chunk);
pythonProcess.on('close', () => {
    console.log("STDOUT:", JSON.stringify(data));
    console.log("STDERR:", JSON.stringify(err));
});
