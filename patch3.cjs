const fs = require('fs');
const file = 'src/components/LivestreamClonerStudio.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = 'const proxyBase = isLocal ? `http://s${stream.id % 15}.localhost:${window.location.port}` : \'\';';
const replacement = 'const proxyBase = isLocal ? `http://s${String(stream.id).split(\'\').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 15}.localhost:${window.location.port}` : \'\';';

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Successfully patched domain sharding!");
} else {
    console.log("Target not found!");
}
