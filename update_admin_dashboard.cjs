const fs = require('fs');
const file = './src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the generic back button with the Logo Back Button
content = content.replace(
  /<button onClick=\{\(\) => setActiveTab\("overview"\)\} className="mr-4 px-3 py-1.5 bg-white\/10 hover:bg-white\/20 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-2">\&larr; Trang Chủ<\/button>/g,
  `<button onClick={() => setActiveTab("overview")} className="flex items-center gap-3 group cursor-pointer mr-6">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
      C
    </div>
    <div className="text-left">
      <h2 className="text-white font-black text-xl leading-none group-hover:text-amber-400 transition-colors">CAPRO</h2>
      <span className="text-[10px] text-amber-500 tracking-[0.3em] font-bold">— TRANG CHỦ —</span>
    </div>
  </button>`
);

// Replace side bar dead links
content = content.replace(/<a href="#" /g, `<button onClick={() => alert("Chức năng đang cập nhật")} `);
content = content.replace(/<\/a>/g, `</button>`);

// Update sidebar links to navigate if relevant (Admin can go to Team, Affiliate, Captcha etc)
content = content.replace(
  /<button onClick=\{\(\) => alert\("Chức năng đang cập nhật"\)\} className="flex items-center gap-3 px-4 py-2\.5 hover:bg-white\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><ShieldCheck className="w-4 h-4"\/> Quản lý phân quyền<\/button>/g,
  `<button onClick={() => setActiveTab("team")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><ShieldCheck className="w-4 h-4"/> Quản lý phân quyền</button>`
);

content = content.replace(
  /<button onClick=\{\(\) => alert\("Chức năng đang cập nhật"\)\} className="flex items-center gap-3 px-4 py-2\.5 hover:bg-white\/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Monitor className="w-4 h-4"\/> Giao dịch Hệ thống<\/button>/g,
  `<button onClick={() => setActiveTab("sales-analytics")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Monitor className="w-4 h-4"/> Giao dịch Hệ thống</button>`
);

fs.writeFileSync(file, content);
