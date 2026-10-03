const fs = require('fs');
const path = 'src/components/genaidol/DesktopAppUI.jsx';
let content = fs.readFileSync(path, 'utf8');

// Thêm useEffect để bắt buộc mở modal nếu chưa login
const forceLoginEffect = `
  // BẮT BUỘC ĐĂNG NHẬP GMAIL: Khóa ứng dụng nếu chưa kết nối
  useEffect(() => {
    if (currentUser?.email === 'khachhang@avalive.com') {
      setIsGmailLoginModalOpen(true);
    }
  }, [currentUser]);
`;

// Chèn sau useEffect nào đó, ví dụ sau useEffect của currentUser
content = content.replace(
  /const \[isGmailLoginModalOpen, setIsGmailLoginModalOpen\] = useState\(false\);/,
  `const [isGmailLoginModalOpen, setIsGmailLoginModalOpen] = useState(false);
${forceLoginEffect}`
);

// Ẩn nút X đóng modal nếu bắt buộc login
content = content.replace(
  /<button onClick=\{\(\) => setIsGmailLoginModalOpen\(false\)\} className="p-2 text-slate-400 hover:text-white transition-colors">/,
  `{currentUser?.email !== 'khachhang@avalive.com' && (
                  <button onClick={() => setIsGmailLoginModalOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">`
);
content = content.replace(
  /<X className="w-5 h-5"\/>\n\s*<\/button>/,
  `<X className="w-5 h-5"/>
                  </button>
                )}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched auth gate');
