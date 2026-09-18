const { spawn } = require('child_process');
const pythonProcess = spawn('python3', [
    '-c',
    `
import yt_dlp
import json
print(json.dumps({'hello': 'world'}))
    `
]);
let data = '';
pythonProcess.stdout.on('data', chunk => data += chunk);
pythonProcess.on('close', () => console.log("STDOUT DATA:", JSON.stringify(data)));
