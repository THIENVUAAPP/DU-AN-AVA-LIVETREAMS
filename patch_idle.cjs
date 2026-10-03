const fs = require('fs');

const path = 'src/components/genaidol/DesktopAppUI.jsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /const idleVid = typeof localStorage !== 'undefined' \? \(localStorage\.getItem\('aidol_idle_media_url'\) \|\| localStorage\.getItem\('avalive_user_locked_media'\)\) : null;/g,
  "const idleVid = typeof localStorage !== 'undefined' ? (localStorage.getItem('avalive_user_locked_media') || localStorage.getItem('aidol_idle_media_url')) : null;"
);

fs.writeFileSync(path, content, 'utf8');

const path2 = 'src/components/genaidol/CleanLiveOverlay.jsx';
let content2 = fs.readFileSync(path2, 'utf8');
content2 = content2.replace(
  /const idleVid = typeof localStorage !== 'undefined' \? \(localStorage\.getItem\('aidol_idle_media_url'\) \|\| localStorage\.getItem\('avalive_user_locked_media'\)\) : null;/g,
  "const idleVid = typeof localStorage !== 'undefined' ? (localStorage.getItem('avalive_user_locked_media') || localStorage.getItem('aidol_idle_media_url')) : null;"
);
fs.writeFileSync(path2, content2, 'utf8');

console.log('Patched idle fallback logic.');
