const fs = require('fs');
const path = require('path');

const targetFile = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/src/components/genaidol/GeneralSettings.jsx';
const mdFile = '/Users/nguyenthien/Downloads/SỰ KIỆN NGỌC NHI.md';

let content = fs.readFileSync(targetFile, 'utf8');
const mdContent = fs.readFileSync(mdFile, 'utf8');

// We need to escape backticks and ${} in the markdown content to safely put it inside a template literal
const escapedMdContent = mdContent.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const regex = /backgroundContext:\s*`[\s\S]*?`,/;
if (regex.test(content)) {
    content = content.replace(regex, `backgroundContext: \`${escapedMdContent}\`,`);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log("Successfully updated backgroundContext");
} else {
    console.error("Could not find backgroundContext");
}
