const fs = require('fs');
const path = 'src/lib/geminiClient.js';
let content = fs.readFileSync(path, 'utf8');

// Thêm trừ token cho proxy
content = content.replace(
  /if \(text && text.trim\(\)\) {/g,
  `if (text && text.trim()) {
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 5, reason: 'AI LLM (Gemini) Response' } }));`
);

// Thêm trừ token cho direct API
content = content.replace(
  /if \(txt\) return \{ text: txt, audioUrl: null \};/g,
  `if (txt) {
          if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('avalive:deduct_token', { detail: { amount: 5, reason: 'AI LLM (Gemini) Direct Response' } }));
          return { text: txt, audioUrl: null };
        }`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched geminiClient.js successfully.');
