const fs = require('fs');
const file = './src/components/UserProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state and placeholder renderer
content = content.replace(
  /const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);/,
  `const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('profile');

  const renderPlaceholder = (title) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
       <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <Settings className="w-10 h-10 text-purple-400 animate-spin-slow" />
       </div>
       <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Phát Triển</h2>
       <p className="text-gray-400 max-w-md">Chức năng <span className="text-purple-400 font-bold">{title}</span> hiện đang được đội ngũ kỹ sư của CAPRO hoàn thiện và sẽ sớm ra mắt trong bản cập nhật tiếp theo.</p>
       <button onClick={() => setActiveSidebarTab('profile')} className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:shadow-glow-purple">Quay Về Hồ Sơ</button>
    </div>
  );`
);

// 2. Change all alert buttons to setActiveSidebarTab
const tabMapping = {
  "Hồ sơ của tôi": "profile",
  "Thông tin cá nhân": "Thông tin cá nhân",
  "Bảo mật tài khoản": "Bảo mật tài khoản",
  "Đổi mật khẩu": "Đổi mật khẩu",
  "Xác minh danh tính": "Xác minh danh tính (KYC)",
  "Gói của tôi": "Quản lý gói dịch vụ",
  "Thanh toán tự động": "Thanh toán tự động",
  "Số dư tài khoản": "Số dư tài khoản",
  "Phương thức thanh toán": "Phương thức thanh toán",
  "Lịch sử thanh toán": "Lịch sử thanh toán",
  "Rút tiền": "Rút tiền về ngân hàng",
  "Lịch sử đăng nhập": "Lịch sử đăng nhập",
  "Thiết bị đăng nhập": "Quản lý Thiết bị"
};

for (const [key, val] of Object.entries(tabMapping)) {
  const safeVal = val.replace(/'/g, "\\'");
  const regex1 = new RegExp(`<button onClick=\\{\\(\\) => alert\\("Chức năng đang cập nhật"\\)\\} (className="[^"]+")>(<[^>]+>\\s*${key})<\\/button>`, 'g');
  content = content.replace(regex1, `<button onClick={() => setActiveSidebarTab('${safeVal}')} $1>$2</button>`);
  
  // also handle the active style one if it had it
  const regex2 = new RegExp(`<button onClick=\\{\\(\\) => alert\\("Chức năng đang cập nhật"\\)\\} (className="[^"]+")>(<[^>]+>\\s*${key})<\\/button>`, 'g');
  content = content.replace(regex2, `<button onClick={() => setActiveSidebarTab('${safeVal}')} $1>$2</button>`);
}

// 3. Conditionally render the main content block
// Find the start of the main profile view which is `<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">`
const mainContentStart = `<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">`;
content = content.replace(mainContentStart, 
`{activeSidebarTab === 'profile' ? (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">`);

// 4. Find the END of the main profile view and close the ternary
// The end is before `</div>\n      </main>\n    </div>\n  );\n}`
const mainContentEnd = `</div>
      </main>
    </div>
  );
}`;
content = content.replace(mainContentEnd, 
`</div>
) : (
  renderPlaceholder(activeSidebarTab)
)}
      </main>
    </div>
  );
}`);

fs.writeFileSync(file, content);
