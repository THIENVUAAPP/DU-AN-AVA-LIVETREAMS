const fs = require('fs');
const path = 'src/components/genaidol/CleanLiveOverlay.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace default cover with fill
content = content.replace(
  /return 'cover'; \/\/ Luôn mặc định là cover/g,
  "return 'fill'; // Luôn mặc định là fill để khớp vừa y khung hình, không dư không thiếu"
);

// We should also replace the style object for the outer container to guarantee it perfectly fills the screen
// style={{ 
//   aspectRatio: ratio === '16:9' ? '16/9' : '9/16',
//   height: ratio === '16:9' ? 'min(100%, calc(100vw * 9 / 16))' : '100%',
//   maxHeight: '100%',
//   width: ratio === '16:9' ? '100%' : 'min(100%, calc(100vh * 9 / 16))',
//   maxWidth: '100%',
//   margin: '0 auto',
//   position: 'relative'
// }}
// Let's just make it stretch 100% width and 100% height because WindowCapturePlayer already gives it exactly the screen dimension.
content = content.replace(
  /aspectRatio: ratio === '16:9' \? '16\/9' : '9\/16',\s*height: ratio === '16:9' \? 'min\(100%, calc\(100vw \* 9 \/ 16\)\)' : '100%',\s*maxHeight: '100%',\s*width: ratio === '16:9' \? '100%' : 'min\(100%, calc\(100vh \* 9 \/ 16\)\)',\s*maxWidth: '100%',\s*margin: '0 auto',\s*position: 'relative'/g,
  "width: '100%', height: '100%', position: 'relative'"
);

// Also we should ensure video objectFit defaults to 'fill'
content = content.replace(
  /objectFit: singleTrans\?\.objectFit \|\| objectFitState \|\| 'cover'/g,
  "objectFit: singleTrans?.objectFit || objectFitState || 'fill'"
);

content = content.replace(
  /objectFit: objectFitState \|\| 'cover'/g,
  "objectFit: objectFitState || 'fill'"
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched CleanLiveOverlay.jsx successfully.');
