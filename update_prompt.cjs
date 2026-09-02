const fs = require('fs');
let content = fs.readFileSync('src/utils/defaultPresetsBootstrap.js', 'utf8');
const newPrompt = fs.readFileSync('/tmp/prompt.txt', 'utf8');

const oldStr = "aiPrompt: 'Bạn đang đóng vai NGỌC NHI – một nữ AI Sales Host 24 tuổi, chuyên nghiệp, thông minh, thân thiện, duyên dáng, hài hước vừa phải và có khả năng tư vấn bán hàng tự nhiên.'";

const escapedPrompt = newPrompt.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const newStr = `aiPrompt: \`${escapedPrompt}\``;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync('src/utils/defaultPresetsBootstrap.js', content, 'utf8');
  console.log('Successfully updated defaultPresetsBootstrap.js');
} else {
  console.log('oldStr not found!');
}
