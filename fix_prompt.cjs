const fs = require('fs');
const targetFile = '/Users/nguyenthien/Downloads/DỰ ÁN AVA LIVETREAMS/src/components/genaidol/GeneralSettings.jsx';
const mdFile = '/Users/nguyenthien/Downloads/SỰ KIỆN NGỌC NHI.md';

let content = fs.readFileSync(targetFile, 'utf8');
const mdContent = fs.readFileSync(mdFile, 'utf8');
const escapedMdContent = mdContent.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

// We'll replace systemPrompt with the content.
const sysPromptRegex = /systemPrompt:\s*`[\s\S]*?`,/;
if (sysPromptRegex.test(content)) {
    content = content.replace(sysPromptRegex, `systemPrompt: \`${escapedMdContent}\`,`);
}

// We'll also empty out backgroundContext so it doesn't duplicate 1000 lines if he only wants it in systemPrompt
// But wait, what if he wants it in both? Let's put it in systemPrompt and leave backgroundContext empty or with a default string.
const bgRegex = /backgroundContext:\s*`[\s\S]*?`,/;
if (bgRegex.test(content)) {
    content = content.replace(bgRegex, `backgroundContext: \`\`,`);
}

// Add a mechanism to force update the localstorage if the old prompt is found
const useEffectRegex = /setSettings\(prev => \(\{ \.\.\.prev, \.\.\.parsed \}\)\);/;
const replacement = `
        // Force update the system prompt if it's the old one
        if (parsed.systemPrompt && parsed.systemPrompt.includes('Ngọc Nhi không được thể hiện giống một chatbot máy móc')) {
          parsed.systemPrompt = \`${escapedMdContent}\`;
          parsed.backgroundContext = '';
        }
        setSettings(prev => ({ ...prev, ...parsed }));`;

if (content.includes('setSettings(prev => ({ ...prev, ...parsed }));')) {
    content = content.replace('setSettings(prev => ({ ...prev, ...parsed }));', replacement);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log("Successfully fixed GeneralSettings.jsx");
