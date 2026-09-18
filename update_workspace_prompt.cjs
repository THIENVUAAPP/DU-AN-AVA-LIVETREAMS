const fs = require('fs');
let content = fs.readFileSync('src/components/genaidol/WorkspaceTacVu.jsx', 'utf8');
const newPrompt = fs.readFileSync('/tmp/prompt.txt', 'utf8');

const oldStr = "aiPrompt: 'TRong vai là một nhân viên sale chuyên nghiệp hãy đọc bình luận và đem ra câu trả lời để chốt đơn, giá phần mềm là 3 triệu rưỡi/1 năm, hoặc gói dùng thử là 500000 đồng trên 1 tháng. Chốt sale hoặc cần tư vấn thêm thì hãy liên hệ với đội ngũ admin'";

const escapedPrompt = newPrompt.replace(/'/g, "\\'").replace(/\n/g, '\\n');

const newStr = `aiPrompt: '${escapedPrompt}'`;

if (content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync('src/components/genaidol/WorkspaceTacVu.jsx', content, 'utf8');
  console.log('Successfully updated WorkspaceTacVu.jsx');
} else {
  console.log('oldStr not found in WorkspaceTacVu.jsx!');
}
