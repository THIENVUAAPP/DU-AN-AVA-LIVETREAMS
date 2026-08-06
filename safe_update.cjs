const fs = require('fs');

function updateFile(file, isProfile) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Inject State
  const stateInjection = `  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

  const renderPlaceholder = (title) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
       <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-glow-purple">
          <svg className="w-10 h-10 text-purple-400 animate-spin-slow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
       </div>
       <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Phát Triển</h2>
       <p className="text-gray-400 max-w-md">Khu vực <span className="text-purple-400 font-bold">{title}</span> đang được nâng cấp để mang lại trải nghiệm tối ưu nhất.</p>
       <button onClick={() => setActiveSidebarTab('overview')} className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:shadow-glow-purple">Quay Lại Tổng Quan</button>
    </div>
  );`;

  content = content.replace(/const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);/, stateInjection);

  // 2. Change all alert buttons to setActiveSidebarTab
  const tabMapping = {
    "Hồ sơ của tôi": "overview",
    "Tổng quan": "overview",
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
    "Thiết bị đăng nhập": "Quản lý Thiết bị",
    "Thống kê Doanh thu": "Thống kê Doanh thu",
    "Lịch sử nạp/rút": "Lịch sử nạp/rút",
    "Cấu hình Website": "Cấu hình Website",
    "Nhật ký Hoạt động": "Nhật ký Hoạt động"
  };

  for (const [key, val] of Object.entries(tabMapping)) {
    const safeVal = val.replace(/'/g, "\\'");
    
    // Replace the alert ones
    const regex1 = new RegExp(`<button onClick=\\{\\(\\) => alert\\("Chức năng đang cập nhật"\\)\\} (className="[^"]+")>(<[^>]+>\\s*${key})<\\/button>`, 'g');
    content = content.replace(regex1, `<button onClick={() => setActiveSidebarTab('${safeVal}')} $1>$2</button>`);
    
    // Replace the active ones which don't have alert
    const regex2 = new RegExp(`<button (className="flex items-center gap-3 px-4 py-2\\.5 bg-gradient-to-r from-[^"]+")>(<[^>]+>\\s*${key})<\\/button>`, 'g');
    content = content.replace(regex2, `<button onClick={() => setActiveSidebarTab('${safeVal}')} $1>$2</button>`);
  }

  // 3. Wrap entire scrollable area
  const mainContentStartRegex = /<div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar/;
  
  if (isProfile) {
    content = content.replace(mainContentStartRegex, 
`{activeSidebarTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar`
    );
  } else {
    content = content.replace(/<div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">/, 
`{activeSidebarTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">`
    );
  }

  // Find the closing of this div. It is right before </main>
  content = content.replace(/\s*<\/main>/, 
`
        ) : (
          renderPlaceholder(activeSidebarTab)
        )}
      </main>`);

  fs.writeFileSync(file, content);
}

updateFile('./src/components/UserProfile.jsx', true);
updateFile('./src/components/AdminDashboard.jsx', false);
