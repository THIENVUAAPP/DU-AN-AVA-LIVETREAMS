const fs = require('fs');

const path = 'src/hooks/useLiveCoordinator.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /setLipSyncVideoUrl\(videoUrl\);/,
  `setLipSyncVideoUrl(videoUrl);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 10, reason: 'AI Video LipSync Generation' } }));`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched lipsync token.');
