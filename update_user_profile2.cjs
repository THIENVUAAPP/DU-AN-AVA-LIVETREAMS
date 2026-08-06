const fs = require('fs');
const file = './src/components/UserProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace alerts with state changes
content = content.replace(/onClick=\{\(\) => alert\("Chức năng đang cập nhật"\)\}/g, '');
content = content.replace(/<button  className="flex items-center gap-3/g, '<button onClick={() => setActiveSidebarTab("other")} className="w-full flex items-center gap-3');

// Inject state
content = content.replace(
  /const \[isSidebarOpen, setIsSidebarOpen\] = useState\(true\);/,
  `const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('profile');

  const renderPlaceholder = (title) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
       <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-glow-purple">
          <Settings className="w-10 h-10 text-purple-400 animate-spin-slow" />
       </div>
       <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Phát Triển</h2>
       <p className="text-gray-400 max-w-md">Chức năng <span className="text-purple-400 font-bold">{title}</span> hiện đang được đội ngũ kỹ sư của CAPRO hoàn thiện và sẽ sớm ra mắt trong bản cập nhật tiếp theo.</p>
       <button onClick={() => setActiveSidebarTab('profile')} className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all">Quay Về Hồ Sơ</button>
    </div>
  );`
);

// Map Sidebar Buttons
content = content.replace(
  /<button className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-600\/20 to-transparent text-purple-400/g,
  `<button onClick={() => setActiveSidebarTab('profile')} className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400`
);

// We'll just replace all 'other' with proper names based on text
const replacements = [
  { text: "Thông tin cá nhân", id: "thong_tin" },
  { text: "Bảo mật tài khoản", id: "bao_mat" },
  { text: "Đổi mật khẩu", id: "doi_mat_khau" },
  { text: "Xác minh danh tính", id: "xac_minh" },
  { text: "Gói của tôi", id: "goi_cua_toi" },
  { text: "Thanh toán tự động", id: "thanh_toan_tu_dong" },
  { text: "Số dư tài khoản", id: "so_du" },
  { text: "Phương thức thanh toán", id: "phuong_thuc" },
  { text: "Lịch sử thanh toán", id: "lich_su_thanh_toan" },
  { text: "Rút tiền", id: "rut_tien" },
  { text: "Lịch sử đăng nhập", id: "lich_su_dang_nhap" },
  { text: "Thiết bị đăng nhập", id: "thiet_bi" }
];

replacements.forEach(r => {
  const regex = new RegExp(`<button onClick=\\{\\(\\) => setActiveSidebarTab\\("other"\\)\\} (className="w-full flex items-center gap-3 px-4 py-2\\.5 hover:bg-white\\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><[^>]+>\\s*${r.text}<\\/button>)`, 'g');
  content = content.replace(regex, `<button onClick={() => setActiveSidebarTab('${r.id}')} $1`);
});

// Wrap Main content block to conditionally render
content = content.replace(
  /\{(\/\* Top Profile Header \*\/)[\s\S]*?(?={?\/\*)/,
  `
          {activeSidebarTab === 'profile' ? (
            <>
              {/* Top Profile Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">`
);

// The end of the main content needs closing tags
content = content.replace(
  /<\/div>\n\s*<\/div>\n\s*<\/main>\n\s*<\/div>\n\s*\);\n\}\n/g,
  `            </>
          ) : activeSidebarTab === 'thong_tin' ? renderPlaceholder('Thông tin cá nhân')
            : activeSidebarTab === 'bao_mat' ? renderPlaceholder('Bảo mật tài khoản')
            : activeSidebarTab === 'doi_mat_khau' ? renderPlaceholder('Đổi mật khẩu')
            : activeSidebarTab === 'xac_minh' ? renderPlaceholder('Xác minh danh tính (KYC)')
            : activeSidebarTab === 'goi_cua_toi' ? renderPlaceholder('Quản lý gói dịch vụ')
            : activeSidebarTab === 'thanh_toan_tu_dong' ? renderPlaceholder('Thanh toán tự động')
            : activeSidebarTab === 'so_du' ? renderPlaceholder('Số dư tài khoản')
            : activeSidebarTab === 'phuong_thuc' ? renderPlaceholder('Phương thức thanh toán')
            : activeSidebarTab === 'lich_su_thanh_toan' ? renderPlaceholder('Lịch sử thanh toán')
            : activeSidebarTab === 'rut_tien' ? renderPlaceholder('Rút tiền về ngân hàng')
            : activeSidebarTab === 'lich_su_dang_nhap' ? renderPlaceholder('Lịch sử đăng nhập')
            : renderPlaceholder('Quản lý Thiết bị')
          }
        </div>
      </main>
    </div>
  );
}
`
);

fs.writeFileSync(file, content);
