const fs = require('fs');
const file = './src/components/UserProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Find the stray `}` before `</main>` and remove it.
content = content.replace(/}\s*<\/main>/, '</main>');

fs.writeFileSync(file, content);
