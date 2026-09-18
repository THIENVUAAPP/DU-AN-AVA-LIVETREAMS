const fs = require('fs');
const path = './src/components/AdminDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

// I need to add Lucide icons to the import if they aren't there.
// Let's first ensure we have enough icons.
const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
content = content.replace(importRegex, "import { User, Mail, Phone, MapPin, CheckCircle2, Copy, Link as LinkIcon, Menu, Bell, Crown, ShieldCheck, Database, Calendar, Search, CreditCard, DollarSign, Wallet, FileText, Share2, Zap, Settings, Save, ArrowUpRight, ArrowDownRight, ChevronDown, Package, Activity, Monitor, LogOut, TrendingUp, Download, Eye, RefreshCw } from 'lucide-react';");

const newRenderPlaceholder = `  const renderPlaceholder = (title) => {
    if (title === 'Thống kê Doanh thu') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full">
          <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Thống Kê Doanh Thu</h2>
                <p className="text-gray-400 text-sm">Báo cáo tài chính chi tiết theo thời gian thực.</p>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-xs font-bold transition-colors border border-white/10">
                <Download className="w-4 h-4" /> Xuất Báo Cáo
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: 'Tổng Doanh Thu (Tháng)', value: '145.500.000 đ', trend: '+12.5%', color: 'emerald' },
               { label: 'Doanh Thu Hôm Nay', value: '8.250.000 đ', trend: '+5.2%', color: 'cyan' },
               { label: 'Chờ Đối Soát (Hold)', value: '12.400.000 đ', trend: '-2.1%', color: 'amber' }
             ].map((stat, i) => (
               <div key={i} className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                  <div className={"absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 " + (stat.color === 'emerald' ? 'from-emerald-500 to-transparent' : stat.color === 'cyan' ? 'from-cyan-500 to-transparent' : 'from-amber-500 to-transparent')}></div>
                  <h4 className="text-gray-400 text-sm font-bold mb-2">{stat.label}</h4>
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className={"text-xs font-bold " + (stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>{stat.trend} so với kỳ trước</div>
               </div>
             ))}
          </div>
          
          <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 h-64 flex flex-col items-center justify-center relative overflow-hidden">
             <Activity className="w-16 h-16 text-cyan-500/20 mb-4 animate-pulse" />
             <p className="text-gray-500 font-bold text-sm">Biểu đồ doanh thu đang được đồng bộ dữ liệu...</p>
          </div>
        </div>
      );
    }
    
    if (title === 'Lịch sử nạp/rút') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full">
           <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Giao Dịch Nạp / Rút</h2>
                <p className="text-gray-400 text-sm">Quản lý và duyệt yêu cầu rút tiền của Affiliate.</p>
             </div>
          </div>
          
          <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden">
             <div className="p-4 border-b border-white/5 flex gap-4">
                <input type="text" placeholder="Tìm mã giao dịch, username..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-64 focus:outline-none focus:border-cyan-500" />
                <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500">
                   <option>Tất cả trạng thái</option>
                   <option>Chờ xử lý</option>
                   <option>Hoàn tất</option>
                </select>
             </div>
             <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1A24] text-gray-400">
                   <tr>
                      <th className="p-4 font-bold">Mã GD</th>
                      <th className="p-4 font-bold">Người Dùng</th>
                      <th className="p-4 font-bold">Loại Giao Dịch</th>
                      <th className="p-4 font-bold">Số Tiền</th>
                      <th className="p-4 font-bold">Thời Gian</th>
                      <th className="p-4 font-bold">Trạng Thái</th>
                      <th className="p-4 font-bold text-right">Thao Tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                   {[
                     { id: 'WD-0921', user: 'Hoang Nam', type: 'Rút Tiền (Affiliate)', amount: '2.500.000 đ', date: 'Vừa xong', status: 'PENDING' },
                     { id: 'DEP-8832', user: 'Minh Tuan', type: 'Nạp Credits', amount: '500.000 đ', date: '10 phút trước', status: 'SUCCESS' },
                     { id: 'WD-0919', user: 'Thanh Huyen', type: 'Rút Tiền (Affiliate)', amount: '1.200.000 đ', date: '2 giờ trước', status: 'SUCCESS' },
                   ].map(tx => (
                     <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-cyan-400">{tx.id}</td>
                        <td className="p-4 font-bold text-white">{tx.user}</td>
                        <td className="p-4">{tx.type}</td>
                        <td className="p-4 font-bold text-emerald-400">{tx.amount}</td>
                        <td className="p-4 text-gray-500">{tx.date}</td>
                        <td className="p-4">
                           <span className={"px-2 py-1 rounded text-[10px] font-black " + (tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400')}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           {tx.status === 'PENDING' ? (
                              <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition-colors">Duyệt</button>
                           ) : (
                              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Chi Tiết</button>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      );
    }

    if (title === 'Cấu hình Website') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-4xl mx-auto h-full">
           <h2 className="text-2xl font-black text-white mb-6">Cấu Hình & Cài Đặt Hệ Thống</h2>
           <div className="space-y-6">
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Settings className="w-4 h-4 text-cyan-400" /> Cấu Hình Chung</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Tên Trang Web</label>
                       <input type="text" defaultValue="AVA LiveStreams - Nền Tảng Bán Hàng" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Email Hỗ Trợ</label>
                       <input type="text" defaultValue="support@avalive.vn" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><CreditCard className="w-4 h-4 text-emerald-400" /> Cấu Hình Thanh Toán (SePay)</h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">SePay API Key</label>
                       <input type="password" defaultValue="*************************" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-mono" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Tài Khoản Nhận Tiền Mặc Định</label>
                       <input type="text" defaultValue="MB Bank - 0987654321 - QUOC THIEN" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-bold" />
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-end">
                 <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                    LƯU CẤU HÌNH HỆ THỐNG
                 </button>
              </div>
           </div>
        </div>
      );
    }

    if (title === 'Nhật ký Hoạt động') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-4xl mx-auto h-full">
           <h2 className="text-2xl font-black text-white mb-6">Nhật Ký Hoạt Động (Audit Log)</h2>
           <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative">
              <div className="absolute left-[39px] top-6 bottom-6 w-px bg-white/10"></div>
              <div className="space-y-6 relative z-10">
                 {[
                   { time: '10:45 06/08/2026', user: 'Admin', action: 'Thay đổi cấu hình thanh toán SePay', type: 'warn' },
                   { time: '09:20 06/08/2026', user: 'Admin', action: 'Duyệt lệnh rút tiền WD-0920 cho Hoang Nam', type: 'info' },
                   { time: '08:15 06/08/2026', user: 'System', action: 'Backup cơ sở dữ liệu hàng ngày thành công', type: 'success' },
                   { time: '23:50 05/08/2026', user: 'Security', action: 'Phát hiện đăng nhập bất thường từ IP lạ (103.14.x.x)', type: 'error' },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-4">
                       <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-[#141419] z-10 " + (log.type==='warn'?'bg-amber-500 text-white':log.type==='error'?'bg-red-500 text-white':log.type==='success'?'bg-emerald-500 text-white':'bg-cyan-500 text-white')}>
                          {log.type === 'error' ? <ShieldCheck className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                       </div>
                       <div className="pt-1.5 pb-4">
                          <p className="text-sm text-white font-bold mb-1">{log.action}</p>
                          <p className="text-xs text-gray-500 font-mono">{log.user} • {log.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      );
    }

    // Default Placeholder (fallback)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
         <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-glow-purple">
            <svg className="w-10 h-10 text-purple-400 animate-spin-slow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
         </div>
         <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Phát Triển</h2>
         <p className="text-gray-400 max-w-md">Khu vực <span className="text-purple-400 font-bold">{title}</span> đang được nâng cấp để mang lại trải nghiệm tối ưu nhất.</p>
      </div>
    );
  };`;

const regex = /const renderPlaceholder = \(title\) => \([\s\S]*?\n  \);/g;
content = content.replace(regex, newRenderPlaceholder);
fs.writeFileSync(path, content);
