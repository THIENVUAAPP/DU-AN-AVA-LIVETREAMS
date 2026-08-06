import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, CheckCircle2, Copy, Link as LinkIcon, 
  Menu, Bell, Crown, ShieldCheck, Database, Calendar, Search, 
  CreditCard, DollarSign, Wallet, FileText, Share2, Zap, Settings, Save,
  ArrowUpRight, ArrowDownRight, ChevronDown, Package, Activity, Monitor, LogOut
} from 'lucide-react';
import TeamPermissionsManager from './TeamPermissionsManager';
import SalesAnalyticsManager from './SalesAnalyticsManager';

export default function UserProfile({ currentUser, setActiveTab }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

    const [profile, setProfile] = useState({
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
  };

  // Mock data for UI 
  const currentPlan = currentUser?.plan || 'VIP PRO';
  const userId = "#CAP102938";

  const stats = [
    { label: 'Số dư tài khoản', value: '2.450.000đ', icon: <Wallet className="w-5 h-5 text-purple-400" />, btnText: 'Nạp tiền', btnColor: 'bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white' },
    { label: 'Credits còn lại', value: '12.450', icon: <Zap className="w-5 h-5 text-amber-400" />, btnText: 'Mua thêm', btnColor: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white' },
    { label: 'Tổng chi tiêu', value: '18.750.000đ', icon: <CreditCard className="w-5 h-5 text-emerald-400" />, btnText: 'Tất cả thời gian', isDropdown: true },
    { label: 'Điểm thưởng', value: '1.250', icon: <Crown className="w-5 h-5 text-pink-400" />, btnText: 'Đổi quà', btnColor: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white' }
  ];

  return (
    <div className="flex h-screen bg-[#0F0F13] text-gray-300 font-sans overflow-hidden fixed inset-0 z-[200]">
      
      {/* Sidebar */}
      <aside className={`w-64 bg-[#141419] border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20 shadow-2xl'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-glow-purple">C</div>
          <div>
            <h2 className="text-white font-black text-xl leading-none">CAPRO</h2>
            <span className="text-[10px] text-gray-500 tracking-[0.3em] font-bold">— AUTO —</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-sm font-medium">
          <div className="space-y-1">
            <button onClick={() => setActiveSidebarTab('overview')} className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 rounded-lg border-l-2 border-purple-500"><User className="w-4 h-4"/> Hồ sơ của tôi</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">TÀI KHOẢN</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('Thông tin cá nhân')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><User className="w-4 h-4"/> Thông tin cá nhân</button>
              <button onClick={() => setActiveSidebarTab('Bảo mật tài khoản')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><ShieldCheck className="w-4 h-4"/> Bảo mật tài khoản</button>
              <button onClick={() => setActiveSidebarTab('Đổi mật khẩu')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Settings className="w-4 h-4"/> Đổi mật khẩu</button>
              <button onClick={() => setActiveSidebarTab('Xác minh danh tính (KYC)')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><CheckCircle2 className="w-4 h-4"/> Xác minh danh tính</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">GÓI DỊCH VỤ</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('Quản lý gói dịch vụ')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Package className="w-4 h-4"/> Gói của tôi</button>
              <button onClick={() => setActiveTab("sales-analytics")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><FileText className="w-4 h-4"/> Lịch sử giao dịch</button>
              <button onClick={() => setActiveSidebarTab('Thanh toán tự động')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Zap className="w-4 h-4"/> Thanh toán tự động</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">VÍ & THANH TOÁN</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('Số dư tài khoản')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Wallet className="w-4 h-4"/> Số dư tài khoản</button>
              <button onClick={() => setActiveSidebarTab('Phương thức thanh toán')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><CreditCard className="w-4 h-4"/> Phương thức thanh toán</button>
              <button onClick={() => setActiveSidebarTab('Lịch sử thanh toán')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Calendar className="w-4 h-4"/> Lịch sử thanh toán</button>
              <button onClick={() => setActiveSidebarTab('Rút tiền về ngân hàng')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><DollarSign className="w-4 h-4"/> Rút tiền</button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">AFFILIATE</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab("affiliate-dashboard")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Share2 className="w-4 h-4"/> Dashboard Affiliate</button>
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><LinkIcon className="w-4 h-4"/> Link giới thiệu</button>
              <button onClick={() => setActiveTab("affiliate-dashboard")} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><DollarSign className="w-4 h-4"/> Hoa hồng của tôi</button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">HOẠT ĐỘNG</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('Lịch sử đăng nhập')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Activity className="w-4 h-4"/> Lịch sử đăng nhập</button>
              <button onClick={() => setActiveSidebarTab('Quản lý Thiết bị')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Monitor className="w-4 h-4"/> Thiết bị đăng nhập</button>
              <button onClick={() => setActiveTab && setActiveTab('captcha')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-500/10 text-cyan-400 font-bold rounded-lg transition-colors"><ShieldCheck className="w-4 h-4"/> Bảng điều khiển Captcha</button>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-xl border border-purple-500/30 m-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 blur-xl rounded-full"></div>
             <p className="text-[10px] text-purple-300 mb-1">Nâng cấp lên</p>
             <h4 className="text-white font-black text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">VIP PRO</h4>
             <p className="text-[10px] text-purple-200 mb-4">Trải nghiệm đầy đủ tính năng</p>
             <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-xs font-bold text-white shadow-glow-purple flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">Nâng cấp ngay &rarr;</button>
          </div>
          
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0E]">
        {/* Top Navbar */}
        <header className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-[#111118]/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white"><Menu className="w-6 h-6"/></button>
            <button onClick={() => setActiveTab("overview")} className="flex items-center gap-3 group cursor-pointer ml-4">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
      C
    </div>
    <div className="text-left">
      <h2 className="text-white font-black text-xl leading-none group-hover:text-cyan-400 transition-colors">CAPRO</h2>
      <span className="text-[10px] text-cyan-500 tracking-[0.3em] font-bold">— TRANG CHỦ —</span>
    </div>
  </button>
          </div>
          <div className="flex items-center gap-6">
            <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-xs font-bold transition-colors">
               <Crown className="w-4 h-4" /> Nâng cấp gói
            </button>
            <div className="relative cursor-pointer"><Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">12</span></div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer">
              <div className="hidden md:block text-sm text-right">
                <p className="font-bold text-white leading-tight">Nguyễn Văn A</p>
                <p className="text-[10px] text-gray-500 leading-tight">ID: {userId}</p>
              </div>
              <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&h=32"} className="w-9 h-9 rounded-full border border-white/10" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeSidebarTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          
          {/* Top Profile Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             <div className="lg:col-span-5 bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full"></div>
                <div className="relative">
                   <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"} className="w-24 h-24 rounded-full border-4 border-[#1A1A24] object-cover" alt="Avatar" />
                   <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#141419] flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white"/></div>
                </div>
                <div className="space-y-2 z-10">
                   <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-white">Nguyễn Văn A</h2>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-[9px] font-bold">VIP PRO</span>
                   </div>
                   <div className="text-xs text-gray-400 space-y-1">
                      <p>ID người dùng: <span className="font-mono text-white">{userId}</span></p>
                      <p className="flex items-center gap-2"><Mail className="w-3 h-3"/> nguyenvana@gmail.com <span className="text-emerald-500 ml-1">Đã xác minh</span></p>
                      <p className="flex items-center gap-2"><Phone className="w-3 h-3"/> 0988 123 456 <span className="text-emerald-500 ml-1">Đã xác minh</span></p>
                      <p className="flex items-center gap-2"><Calendar className="w-3 h-3"/> Tham gia: 12/03/2024</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3"/> Việt Nam</p>
                   </div>
                   <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Hoạt động
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-[#141419] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-colors shadow-lg">
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider mb-2">{s.label}</span>
                    <div className="text-xl font-black text-white mb-4">{s.value}</div>
                    <div className="flex items-center justify-between">
                       {s.icon}
                       {s.isDropdown ? (
                         <div className="px-2 py-1 bg-[#1A1A24] border border-white/5 rounded text-[10px] text-gray-400 flex items-center gap-1 cursor-pointer">
                            {s.btnText} <ChevronDown className="w-3 h-3" />
                         </div>
                       ) : (
                         <button className={`px-3 py-1 rounded border border-transparent text-[10px] font-bold transition-colors ${s.btnColor}`}>
                            {s.btnText}
                         </button>
                       )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          {/* Middle Row: Gói dịch vụ & Thống kê sử dụng */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             
             {/* VIP PRO Card */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">GÓI DỊCH VỤ HIỆN TẠI</h3>
                <div className="flex-1 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-2xl border border-amber-500/30 p-6 relative overflow-hidden flex flex-col justify-between">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full"></div>
                   
                   <div className="flex items-start justify-between relative z-10 mb-6">
                      <div className="flex gap-4">
                         <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                            <Crown className="w-8 h-8 text-[#1E1B4B]" />
                         </div>
                         <div>
                            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">VIP PRO</h2>
                            <p className="text-xs text-purple-200 mt-1">Trải nghiệm tất cả tính năng cao cấp</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-purple-300">Thời hạn gói</p>
                         <p className="text-sm font-bold text-white mb-1">12/07/2025</p>
                         <p className="text-[10px] text-purple-300">đến</p>
                         <p className="text-sm font-bold text-white">12/07/2026</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-4 gap-4 relative z-10 border-t border-purple-500/30 pt-6">
                      <div className="text-center space-y-1">
                         <div className="w-8 h-8 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"><Monitor className="w-4 h-4 text-purple-300"/></div>
                         <p className="text-xs font-bold text-white">Không giới hạn</p>
                         <p className="text-[9px] text-purple-300">Số lượng dự án</p>
                      </div>
                      <div className="text-center space-y-1">
                         <div className="w-8 h-8 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30"><Database className="w-4 h-4 text-cyan-300"/></div>
                         <p className="text-xs font-bold text-white">500GB</p>
                         <p className="text-[9px] text-purple-300">Dung lượng</p>
                      </div>
                      <div className="text-center space-y-1">
                         <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"><ShieldCheck className="w-4 h-4 text-emerald-300"/></div>
                         <p className="text-xs font-bold text-white">Ưu tiên cao</p>
                         <p className="text-[9px] text-purple-300">Hỗ trợ</p>
                      </div>
                      <div className="text-center space-y-1">
                         <div className="w-8 h-8 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30"><Activity className="w-4 h-4 text-pink-300"/></div>
                         <p className="text-xs font-bold text-white">99.9%</p>
                         <p className="text-[9px] text-purple-300">Uptime</p>
                      </div>
                   </div>

                   <div className="absolute bottom-6 right-6 flex items-center gap-3">
                      <p className="text-xs font-bold text-amber-400">Còn lại 365 ngày</p>
                      <button className="px-4 py-1.5 rounded-lg bg-[#1A1A24]/80 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">Quản lý gói</button>
                   </div>
                </div>
             </div>

             {/* Thống kê sử dụng */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">THỐNG KÊ SỬ DỤNG</h3>
                  <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-lg px-2 py-1 text-[10px] text-gray-300 font-medium cursor-pointer">
                    7 ngày qua <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                   {/* Mini chart card 1 */}
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-purple-500/30 transition-colors relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-full h-12">
                         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-50"><polyline points="0,40 20,30 40,35 60,15 80,20 100,5" fill="none" stroke="#A855F7" strokeWidth="2"/><circle cx="100" cy="5" r="2" fill="#A855F7"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Dự án đã tạo</p>
                        <p className="text-2xl font-black text-white">24</p>
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 z-10"><ArrowUpRight className="w-3 h-3"/> 20%</div>
                   </div>
                   {/* Mini chart card 2 */}
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-amber-500/30 transition-colors relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-full h-12">
                         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-50"><polyline points="0,30 25,25 50,35 75,10 100,15" fill="none" stroke="#F59E0B" strokeWidth="2"/><circle cx="100" cy="15" r="2" fill="#F59E0B"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Video đã xuất</p>
                        <p className="text-2xl font-black text-white">86</p>
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 z-10"><ArrowUpRight className="w-3 h-3"/> 35%</div>
                   </div>
                   {/* Mini chart card 3 */}
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-blue-500/30 transition-colors relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-full h-12">
                         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-50"><polyline points="0,10 33,20 66,15 100,30" fill="none" stroke="#3B82F6" strokeWidth="2"/><circle cx="100" cy="30" r="2" fill="#3B82F6"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Credits đã dùng</p>
                        <p className="text-2xl font-black text-white">1.250</p>
                      </div>
                      <div className="text-[10px] text-red-500 font-bold flex items-center gap-1 z-10"><ArrowDownRight className="w-3 h-3"/> 10%</div>
                   </div>
                   {/* Mini chart card 4 */}
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex flex-col justify-between group hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                      <div className="absolute bottom-0 right-0 w-full h-12">
                         <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full opacity-50"><polyline points="0,35 30,25 60,30 90,5 100,10" fill="none" stroke="#10B981" strokeWidth="2"/><circle cx="100" cy="10" r="2" fill="#10B981"/></svg>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Dung lượng đã dùng</p>
                        <p className="text-2xl font-black text-white">128GB</p>
                      </div>
                      <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 z-10"><ArrowUpRight className="w-3 h-3"/> 15%</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Tổng quan tài chính */}
          <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">TỔNG QUAN TÀI CHÍNH</h3>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Metrics */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="border-r border-white/5 pr-4 flex flex-col justify-between">
                      <div>
                         <p className="text-[10px] text-gray-500 mb-1">Tổng nạp tiền</p>
                         <p className="text-lg font-black text-white">15.200.000đ</p>
                      </div>
                      <div className="mt-4 text-[10px]">
                         <p className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> 18.5%</p>
                         <p className="text-gray-600">So với tháng trước</p>
                      </div>
                   </div>
                   <div className="border-r border-white/5 px-4 flex flex-col justify-between">
                      <div>
                         <p className="text-[10px] text-gray-500 mb-1">Tổng chi tiêu</p>
                         <p className="text-lg font-black text-white">18.750.000đ</p>
                      </div>
                      <div className="mt-4 text-[10px]">
                         <p className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> 12.3%</p>
                         <p className="text-gray-600">So với tháng trước</p>
                      </div>
                   </div>
                   <div className="border-r border-white/5 px-4 flex flex-col justify-between">
                      <div>
                         <p className="text-[10px] text-gray-500 mb-1">Hoa hồng nhận được</p>
                         <p className="text-lg font-black text-white">3.450.000đ</p>
                      </div>
                      <div className="mt-4 text-[10px]">
                         <p className="text-emerald-500 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> 25.6%</p>
                         <p className="text-gray-600">So với tháng trước</p>
                      </div>
                   </div>
                   <div className="pl-4 flex flex-col justify-between">
                      <div>
                         <p className="text-[10px] text-gray-500 mb-1">Chờ thanh toán</p>
                         <p className="text-lg font-black text-amber-400">1.250.000đ</p>
                      </div>
                      <div className="mt-4 text-[10px]">
                         <p className="text-gray-400 font-medium">Sẽ thanh toán vào</p>
                         <p className="text-gray-600">01/08/2025</p>
                      </div>
                   </div>
                </div>

                {/* Thu nhập Affiliate Donut */}
                <div className="lg:col-span-2 bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">THU NHẬP AFFILIATE</p>
                      <p className="text-[10px] text-gray-500 mb-2">Tổng hoa hồng</p>
                      <p className="text-xl font-black text-white mb-2">3.450.000đ</p>
                      <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> 25.6% <span className="text-gray-600 font-normal">so với tháng trước</span></p>
                      <button className="mt-3 px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold hover:bg-purple-600 hover:text-white transition-colors">Xem chi tiết</button>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full border-[6px] border-transparent" style={{background: 'conic-gradient(#8B5CF6 0% 75%, #10B981 75% 100%)', borderRadius: '50%', padding: '6px', WebkitMask: 'radial-gradient(transparent 60%, black 61%)'}}>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-black text-white">75%</span>
                            <span className="text-[8px] text-gray-400">Đã thanh toán</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px]">
                            <div className="flex items-center gap-1 mb-0.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-white font-bold">75%</span></div>
                            <span className="text-gray-500">Đã thanh toán</span>
                         </div>
                         <div className="text-[10px]">
                            <div className="flex items-center gap-1 mb-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-white font-bold">25%</span></div>
                            <span className="text-gray-500">Chờ thanh toán</span>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </div>

          {/* Bottom Grid: Link, Cấp bậc, Lịch sử */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Link giới thiệu */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">LINK GIỚI THIỆU CỦA BẠN</h3>
                <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-lg p-1.5 mb-6">
                   <input type="text" readOnly value="https://caproauto.com/ref/nguyenvana" className="flex-1 bg-transparent text-xs text-gray-300 pl-2 focus:outline-none" />
                   <button className="p-2 rounded bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                   <div>
                     <p className="text-[10px] text-gray-500 mb-1">Lượt click</p>
                     <p className="text-sm font-bold text-white mb-1">1.250</p>
                     <p className="text-[10px] text-emerald-500 font-bold flex items-center"><ArrowUpRight className="w-3 h-3"/> 18.7%</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-500 mb-1">Người đăng ký</p>
                     <p className="text-sm font-bold text-white mb-1">156</p>
                     <p className="text-[10px] text-emerald-500 font-bold flex items-center"><ArrowUpRight className="w-3 h-3"/> 22.3%</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-gray-500 mb-1">Tỷ lệ chuyển đổi</p>
                     <p className="text-sm font-bold text-white mb-1">12.48%</p>
                     <p className="text-[10px] text-red-500 font-bold flex items-center"><ArrowDownRight className="w-3 h-3"/> 5.4%</p>
                   </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                   <span className="text-[10px] text-gray-500">Chia sẻ nhanh:</span>
                   <div className="flex gap-2">
                      <button className="w-7 h-7 rounded bg-[#1877F2] text-white flex items-center justify-center"><User className="w-3 h-3"/></button>
                      <button className="w-7 h-7 rounded bg-[#1DA1F2] text-white flex items-center justify-center"><User className="w-3 h-3"/></button>
                      <button className="w-7 h-7 rounded bg-[#25D366] text-white flex items-center justify-center"><User className="w-3 h-3"/></button>
                      <button className="w-7 h-7 rounded bg-gray-700 text-white flex items-center justify-center"><LinkIcon className="w-3 h-3"/></button>
                   </div>
                </div>
             </div>

             {/* Cấp bậc */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">CẤP BẬC AFFILIATE</h3>
                  <span className="text-[10px] text-gray-500">Saf</span>
                </div>
                <div className="flex gap-4 items-center bg-[#1A1A24] border border-white/5 rounded-xl p-4 mb-4">
                   <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] rotate-12">
                      <Crown className="w-8 h-8 text-white -rotate-12" />
                   </div>
                   <div className="flex-1">
                      <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">DIAMOND</h4>
                      <div className="flex justify-between items-center text-[9px] text-gray-400 mb-1 mt-2">
                         <span>Điều kiện lên cấp: Doanh số yêu cầu 50.000.000đ</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
                         <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full w-[65%] shadow-glow-blue"></div>
                      </div>
                      <p className="text-[9px] text-gray-400 text-right">32.450.000đ / 50.000.000đ</p>
                   </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 mb-4">
                   <span className="text-xs text-gray-400">Hoa hồng hiện tại</span>
                   <span className="text-lg font-black text-white">30%</span>
                </div>
                <button className="w-full py-2 rounded-lg bg-[#1A1A24] border border-white/5 hover:bg-white/5 text-xs text-gray-300 transition-colors mt-auto">Xem chi tiết cấp bậc</button>
             </div>

             {/* Lịch sử */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">LỊCH SỬ HOA HỒNG</h3>
                  <button onClick={() => alert("Chức năng đang cập nhật")} className="text-[10px] text-purple-400 hover:text-purple-300">Xem tất cả</button>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                   {[
                     { date: '01/07/2025', desc: 'Hoa hồng từ đơn hàng #12345', amount: '+250.000đ', status: 'Đã thanh toán', color: 'text-emerald-500' },
                     { date: '28/06/2025', desc: 'Hoa hồng từ đơn hàng #12312', amount: '+180.000đ', status: 'Đã thanh toán', color: 'text-emerald-500' },
                     { date: '25/06/2025', desc: 'Hoa hồng từ đơn hàng #12298', amount: '+320.000đ', status: 'Chờ thanh toán', color: 'text-amber-500' },
                     { date: '22/06/2025', desc: 'Hoa hồng từ đơn hàng #12258', amount: '+150.000đ', status: 'Đã thanh toán', color: 'text-emerald-500' },
                     { date: '18/06/2025', desc: 'Hoa hồng từ đơn hàng #12125', amount: '+200.000đ', status: 'Đã thanh toán', color: 'text-emerald-500' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-xs pb-3 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex gap-3 items-center">
                           <span className="text-[10px] text-gray-500">{item.date}</span>
                           <span className="text-gray-300">{item.desc}</span>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-white">{item.amount}</p>
                           <p className={`text-[9px] ${item.color}`}>{item.status}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
          
          {/* Final Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">PHƯƠNG THỨC THANH TOÁN</h3>
                  <button onClick={() => alert("Chức năng đang cập nhật")} className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1">+ Thêm mới</button>
                </div>
                <div className="space-y-3">
                   <div className="bg-[#1A1A24] border border-purple-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-[10px] font-black text-blue-800 italic">VISA</div>
                         <div>
                           <p className="text-xs font-bold text-white">**** **** **** 4242</p>
                           <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold">Mặc định</span>
                         </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-purple-500 flex items-center justify-center"><div className="w-3 h-3 bg-purple-500 rounded-full"></div></div>
                   </div>
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-lg bg-[#A50064] flex items-center justify-center text-white text-[10px] font-bold">MoMo</div>
                         <div>
                           <p className="text-xs font-bold text-white">0988 123 456</p>
                           <span className="px-2 py-0.5 rounded bg-gray-600/30 text-gray-400 text-[8px] font-bold">Đã liên kết</span>
                         </div>
                      </div>
                      <button onClick={() => alert("Chức năng đang cập nhật")} className="text-[10px] text-red-400 hover:text-red-300">Hủy</button>
                   </div>
                   <div className="bg-[#1A1A24] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-lg bg-[#00524E] flex items-center justify-center text-white text-[8px] font-bold text-center leading-tight">Vietcom<br/>bank</div>
                         <div>
                           <p className="text-xs font-bold text-white">Ngân hàng Vietcombank</p>
                           <p className="text-[10px] text-gray-400 font-mono">**** **** **** 1234</p>
                           <span className="px-2 py-0.5 rounded bg-gray-600/30 text-gray-400 text-[8px] font-bold mt-1 inline-block">Đã liên kết</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">THIẾT BỊ ĐĂNG NHẬP</h3>
                  <button onClick={() => alert("Chức năng đang cập nhật")} className="text-[10px] text-purple-400 hover:text-purple-300">Xem tất cả</button>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Monitor className="w-4 h-4 text-gray-400" /></div>
                         <div>
                            <p className="text-xs font-bold text-white">Chrome - Windows</p>
                            <p className="text-[10px] text-gray-500">Hà Nội, Việt Nam</p>
                         </div>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold">Đang hoạt động</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Monitor className="w-4 h-4 text-gray-400" /></div>
                         <div>
                            <p className="text-xs font-bold text-white">Safari - iPhone 15 Pro</p>
                            <p className="text-[10px] text-gray-500">Hồ Chí Minh, Việt Nam</p>
                         </div>
                      </div>
                      <span className="text-[10px] text-gray-500">2 giờ trước</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Monitor className="w-4 h-4 text-gray-400" /></div>
                         <div>
                            <p className="text-xs font-bold text-white">Chrome - MacOS</p>
                            <p className="text-[10px] text-gray-500">Đà Nẵng, Việt Nam</p>
                         </div>
                      </div>
                      <span className="text-[10px] text-gray-500">1 ngày trước</span>
                   </div>
                </div>
             </div>

             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">HOẠT ĐỘNG GẦN ĐÂY</h3>
                  <button onClick={() => alert("Chức năng đang cập nhật")} className="text-[10px] text-purple-400 hover:text-purple-300">Xem tất cả</button>
                </div>
                <div className="space-y-4">
                   <div className="flex items-start justify-between">
                     <div className="flex gap-3">
                       <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Monitor className="w-3 h-3"/></div>
                       <div>
                         <p className="text-[11px] font-bold text-white">Đăng nhập tài khoản</p>
                         <p className="text-[9px] text-gray-500">Hà Nội, Việt Nam</p>
                       </div>
                     </div>
                     <span className="text-[9px] text-gray-600">10 phút trước</span>
                   </div>
                   <div className="flex items-start justify-between">
                     <div className="flex gap-3">
                       <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Settings className="w-3 h-3"/></div>
                       <div>
                         <p className="text-[11px] font-bold text-white">Tạo dự án mới</p>
                         <p className="text-[9px] text-gray-500">Tạo dự án "Video Marketing"</p>
                       </div>
                     </div>
                     <span className="text-[9px] text-gray-600">1 giờ trước</span>
                   </div>
                   <div className="flex items-start justify-between">
                     <div className="flex gap-3">
                       <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400"><CreditCard className="w-3 h-3"/></div>
                       <div>
                         <p className="text-[11px] font-bold text-white">Thanh toán thành công</p>
                         <p className="text-[9px] text-gray-500">Gói VIP PRO - 12 tháng</p>
                       </div>
                     </div>
                     <span className="text-[9px] text-gray-600">1 ngày trước</span>
                   </div>
                   <div className="flex items-start justify-between">
                     <div className="flex gap-3">
                       <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><User className="w-3 h-3"/></div>
                       <div>
                         <p className="text-[11px] font-bold text-white">Cập nhật thông tin cá nhân</p>
                         <p className="text-[9px] text-gray-500">Thay đổi số điện thoại</p>
                       </div>
                     </div>
                     <span className="text-[9px] text-gray-600">2 ngày trước</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
        ) : (
          renderPlaceholder(activeSidebarTab)
        )}
      </main>
    </div>
  );
}
