const fs = require('fs');

const oldProfileFile = '/tmp/old_user_profile.jsx';
const newProfileFile = './src/components/UserProfile.jsx';

const oldContent = fs.readFileSync(oldProfileFile, 'utf8');
let newContent = fs.readFileSync(newProfileFile, 'utf8');

// We know the old content has:
// 1. Profile form
// 2. Financial Invoices
// 3. Bank Account

// Let's create a solid placeholder function that incorporates the old features
const newRenderPlaceholder = `  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    planName: currentUser?.plan || 'VIP PRO',
    planStatus: 'PAID',
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };
  
  const userInvoices = [
    { id: '#INV-8832', plan: 'VIP PRO - 3 Tháng', method: 'SePay VietQR', date: '10/10/2023 14:30', status: 'HOÀN TẤT' },
    { id: '#INV-8105', plan: 'Nạp 50,000 Credits', method: 'Momo', date: '05/09/2023 09:15', status: 'HOÀN TẤT' }
  ];

  const renderPlaceholder = (title) => {
    if (title === 'Thông tin cá nhân') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-2">Thông Tin Của Bạn</h2>
          <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Họ Tên Hiển Thị:</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#EF4444] focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Email Gmail Kết Nối:</label>
                <input type="email" disabled value={profile.email} className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Số Điện Thoại / Zalo:</label>
                <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#EF4444] focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Gói Cước Đang Sử Dụng:</label>
                <input type="text" disabled value={profile.planName} className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-bold" />
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Đã lưu thông tin hồ sơ thành công!</span> : <span />}
              <button type="submit" className="px-6 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-glow-red transition-all flex items-center gap-2">LƯU THÔNG TIN HỒ SƠ</button>
            </div>
          </form>
        </div>
      );
    }
    
    if (title === 'Lịch sử thanh toán') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-5xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><FileText className="w-4 h-4 text-[#3B82F6]" /> LỊCH SỬ NẠP TIỀN & HÓA ĐƠN THANH TOÁN</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#121216]">
                    <th className="p-3 text-gray-300 font-bold">Mã Hóa Đơn</th>
                    <th className="p-3 text-gray-300 font-bold">Gói Thanh Toán</th>
                    <th className="p-3 text-gray-300 font-bold">Kênh Thanh Toán</th>
                    <th className="p-3 text-gray-300 font-bold">Ngày Nạp</th>
                    <th className="p-3 text-gray-300 font-bold">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {userInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/5 transition-all">
                      <td className="p-3 font-bold text-[#EF4444]">{inv.id}</td>
                      <td className="p-3 text-white font-sans font-bold">{inv.plan}</td>
                      <td className="p-3 text-gray-300">{inv.method}</td>
                      <td className="p-3 text-gray-400">{inv.date}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{inv.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (title === 'Phương thức thanh toán' || title === 'Rút tiền về ngân hàng') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-5xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
             <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3"><CreditCard className="w-4 h-4 text-[#8B5CF6]" /> TÀI KHOẢN NGÂN HÀNG NHẬN HOA HỒNG RÚT (SEPAY VIETQR)</h3>
            <div className="space-y-3 text-xs max-w-2xl">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Tên Ngân Hàng:</label>
                <input type="text" value={profile.bankName} onChange={(e) => setProfile({ ...profile, bankName: e.target.value })} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">Số Tài Khoản Ngân Hàng:</label>
                  <input type="text" value={profile.accountNumber} onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">Tên Chủ Tài Khoản:</label>
                  <input type="text" value={profile.accountHolder} onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })} className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-bold" />
                </div>
              </div>
            </div>
            <button onClick={() => alert("Đã lưu thông tin tài khoản ngân hàng nhận tiền hoa hồng!")} className="mt-4 px-5 py-2 bg-[#8B5CF6] hover:bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-glow-purple transition-all">LƯU TÀI KHOẢN NGÂN HÀNG</button>
          </div>
        </div>
      );
    }

    // Default Placeholder
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
         <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)]">
            <svg className="w-10 h-10 text-purple-400 animate-spin-slow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
         </div>
         <h2 className="text-2xl font-black text-white mb-3">Tính Năng Đang Cập Nhật</h2>
         <p className="text-gray-400 max-w-md">Khu vực <span className="text-purple-400 font-bold">{title}</span> đang được nâng cấp để mang lại trải nghiệm tối ưu nhất.</p>
         <button onClick={() => setActiveSidebarTab('overview')} className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:shadow-glow-purple">Quay Lại Tổng Quan</button>
      </div>
    );
  };`;

// Replace the old renderPlaceholder block with the new one
const regex = /const renderPlaceholder = \(title\) => \([\s\S]*?\n  \);/g;
newContent = newContent.replace(regex, newRenderPlaceholder);

fs.writeFileSync(newProfileFile, newContent);
