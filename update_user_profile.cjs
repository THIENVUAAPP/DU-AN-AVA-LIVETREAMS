const fs = require('fs');
const file = './src/components/UserProfile.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the generic back button and "Hồ sơ người dùng" with the Logo Back Button
content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\("overview"\)\} className="mr-4 px-3 py-1.5 bg-white\/10 hover:bg-white\/20 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-2">\&larr; Trang Chủ<\/button>\n\s*<h1 className="text-lg font-bold text-white hidden md:block">Hồ sơ người dùng <span className="text-xs text-gray-500 font-normal block">Quản lý thông tin tài khoản và hoạt động cá nhân<\/span><\/h1>/g,
  `<button onClick={() => setActiveTab("overview")} className="flex items-center gap-3 group cursor-pointer ml-4">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
      C
    </div>
    <div className="text-left">
      <h2 className="text-white font-black text-xl leading-none group-hover:text-cyan-400 transition-colors">CAPRO</h2>
      <span className="text-[10px] text-cyan-500 tracking-[0.3em] font-bold">— TRANG CHỦ —</span>
    </div>
  </button>`
);

// Update sidebar links to actually navigate
content = content.replace(
  /<a href="#" className="flex items-center gap-3 px-4 py-2\.5 hover:bg-white\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><FileText className="w-4 h-4"\/> Lịch sử giao dịch<\/a>/g,
  `<button onClick={() => setActiveTab("sales-analytics")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><FileText className="w-4 h-4"/> Lịch sử giao dịch</button>`
);

content = content.replace(
  /<a href="#" className="flex items-center gap-3 px-4 py-2\.5 hover:bg-white\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Share2 className="w-4 h-4"\/> Dashboard Affiliate<\/a>/g,
  `<button onClick={() => setActiveTab("affiliate-dashboard")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Share2 className="w-4 h-4"/> Dashboard Affiliate</button>`
);

content = content.replace(
  /<a href="#" className="flex items-center gap-3 px-4 py-2\.5 hover:bg-white\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><DollarSign className="w-4 h-4"\/> Hoa hồng của tôi<\/a>/g,
  `<button onClick={() => setActiveTab("affiliate-dashboard")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><DollarSign className="w-4 h-4"/> Hoa hồng của tôi</button>`
);

// Any other <a href="#"> replace with button doing nothing or alert to prevent scroll to top
content = content.replace(/<a href="#" /g, `<button onClick={() => alert("Chức năng đang cập nhật")} `);
content = content.replace(/<\/a>/g, `</button>`);

fs.writeFileSync(file, content);
