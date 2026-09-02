const fs = require('fs');
const content = fs.readFileSync('/tmp/prompt.txt', 'utf8');
const escaped = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
fs.writeFileSync('src/utils/defaultAIPrompt.js', 'export const NEW_AI_PROMPT = `' + escaped + '`;', 'utf8');
