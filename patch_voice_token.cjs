const fs = require('fs');

const vsPath = 'src/utils/voiceSyncService.js';
let vs = fs.readFileSync(vsPath, 'utf8');
vs = vs.replace(
  /const directApiGetUrl = \(currentOrigin \? `\$\{currentOrigin\}\/api\/tts` : '\/api\/tts'\) \+ `\?text=\$\{encodedText\}&lang=\$\{gLang\}&voice=\$\{encodeURIComponent\(voice\?\.neuralVoice \|\| 'vi-VN-HoaiMyNeural'\)\}`;/,
  `const directApiGetUrl = (currentOrigin ? \`\$\{currentOrigin\}/api/tts\` : '/api/tts') + \`?text=\$\{encodedText\}&lang=\$\{gLang\}&voice=\$\{encodeURIComponent(voice?.neuralVoice || 'vi-VN-HoaiMyNeural')}\`;
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 1, reason: 'AI Voice TTS' } }));`
);
fs.writeFileSync(vsPath, vs, 'utf8');

const lsPath = 'src/hooks/useAvatarLipSync.js';
let ls = fs.readFileSync(lsPath, 'utf8');
ls = ls.replace(
  /const data = await response\.json\(\);/,
  `const data = await response.json();
          if (data && data.url) {
            window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 10, reason: 'AI Video LipSync' } }));
          }`
);
fs.writeFileSync(lsPath, ls, 'utf8');

console.log('Patched voice token deductions');
