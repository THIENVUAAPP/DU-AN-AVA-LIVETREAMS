const fs = require('fs');
const file = './src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state and placeholder renderer
content = content.replace(
  /const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);/,
  `const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

  const renderPlaceholder = (title) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
       <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-glow-amber">
          <Settings className="w-10 h-10 text-amber-400 animate-spin-slow" />
       </div>
       <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Phát Triển</h2>
       <p className="text-gray-400 max-w-md">Khu vực quản trị <span className="text-amber-400 font-bold">{title}</span> đang được nâng cấp để mang lại trải nghiệm tối ưu nhất.</p>
       <button onClick={() => setActiveSidebarTab('overview')} className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:shadow-glow-amber">Quay Lại Tổng Quan</button>
    </div>
  );`
);

// 2. Change all alert buttons to setActiveSidebarTab
const tabMapping = {
  "Tổng quan": "overview",
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
  
  // Replace the active one (Tổng quan)
  const regex2 = new RegExp(`<button className="flex items-center gap-3 px-4 py-2\\.5 bg-gradient-to-r from-amber-600\\/20 to-transparent text-amber-400 rounded-lg border-l-2 border-amber-500">(<[^>]+>\\s*${key})<\\/button>`, 'g');
  content = content.replace(regex2, `<button onClick={() => setActiveSidebarTab('${safeVal}')} className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-amber-600/20 to-transparent text-amber-400 rounded-lg border-l-2 border-amber-500">$1</button>`);
}

// 3. Wrap main content area
const mainContentStartRegex = /<div className="flex items-end justify-between">/;

content = content.replace(mainContentStartRegex, 
`{activeSidebarTab === 'overview' ? (
            <>
              <div className="flex items-end justify-between">`
);

const mainContentEndRegex = /<\/div>\s*<\/main>\s*<\/div>\s*\);\s*\}/;
content = content.replace(mainContentEndRegex,
`            </>
          ) : (
            renderPlaceholder(activeSidebarTab)
          )}
        </div>
      </main>
    </div>
  );
}`);

fs.writeFileSync(file, content);
