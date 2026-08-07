import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle2, Copy, Link as LinkIcon, Menu, Bell, Crown, ShieldCheck, Database, Calendar, Search, CreditCard, DollarSign, Wallet, FileText, Share2, Zap, Settings, Save, ArrowUpRight, ArrowDownRight, ChevronDown, Package, Activity, Monitor, LogOut, TrendingUp, Download, Eye, RefreshCw, Smartphone, Laptop, History, LogIn, Lock, Camera, ChevronLeft } from 'lucide-react';
import TeamPermissionsManager from './TeamPermissionsManager';
import SalesAnalyticsManager from './SalesAnalyticsManager';
import AffiliateProgram from './AffiliateProgram';

export default function UserProfile({ currentUser, setActiveTab }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

    const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    planName: currentUser?.plan || 'MIỄN PHÍ',
    planStatus: 'FREE',
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

    if (title === 'affiliate-dashboard') {
      return (
        <div className="animate-fade-in flex-1 h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
           <AffiliateProgram currentUser={currentUser} setGoogleLoginModalOpen={() => {}} />
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
  const currentPlan = currentUser?.plan || 'MIỄN PHÍ';
  const userId = "#CAP102938";

  const stats = [
    { label: 'Doanh thu Affiliate', value: '0đ', icon: <DollarSign className="w-5 h-5 text-purple-400" />, btnText: 'Rút tiền', btnColor: 'bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white' },
    { label: 'Lượt click link', value: '0', icon: <Share2 className="w-5 h-5 text-amber-400" />, btnText: 'Xem chi tiết', btnColor: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white' },
    { label: 'Lượt đăng ký', value: '0', icon: <User className="w-5 h-5 text-emerald-400" />, btnText: 'Tháng này', isDropdown: true },
    { label: 'Khách mua gói', value: '0', icon: <Crown className="w-5 h-5 text-pink-400" />, btnText: 'Tất cả', isDropdown: true }
  ];

  return (
    <div className="flex h-screen bg-[#0F0F13] text-gray-300 font-sans overflow-hidden fixed inset-0 z-[200]">
      
      {/* Sidebar */}
      <aside className={`w-64 bg-[#141419] border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20 shadow-2xl'}`}>
        <div onClick={() => setActiveTab && setActiveTab('overview')} className="p-6 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-[#111] p-0.5 shadow-glow-purple relative group-hover:scale-105 transition-all">
            <img src="/official_logo.jpg" alt="AVA LIVE" className="w-full h-full object-cover rounded-[10px] border border-white/20" />
          </div>
          <div>
            <h2 className="text-white font-black text-xl leading-none">AVA LIVE</h2>
            <span className="text-[10px] text-[#EF4444] tracking-[0.3em] font-bold">— AUTO —</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-sm font-medium">
          <div className="space-y-1">
            <button onClick={() => setActiveSidebarTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${activeSidebarTab === 'overview' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}><User className="w-4 h-4"/> Tổng quan hồ sơ</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">TIẾP THỊ LIÊN KẾT</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab("affiliate-dashboard")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${activeSidebarTab === 'affiliate-dashboard' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}><Share2 className="w-4 h-4"/> Dashboard Affiliate</button>
            </div>
          </div>
          
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0E]">
        {/* Top Navbar */}
        <header className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-[#111118]/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white"><Menu className="w-6 h-6"/></button>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => { setActiveTab && setActiveTab('overview'); setTimeout(() => { document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'}) }, 100); }} className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer">
               <Crown className="w-4 h-4" /> Nâng cấp gói
            </button>
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer">
              <div className="hidden md:block text-sm text-right">
                <p className="font-bold text-white leading-tight">{currentUser?.name || "Người dùng"}</p>
                <p className="text-[10px] text-gray-500 leading-tight">ID: #{currentUser?.email?.split('@')[0] || "102938"}</p>
              </div>
              <img src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} className="w-9 h-9 rounded-full border border-white/10" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeSidebarTab === 'overview' ? (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {/* ROW 1: HUGE NEON FINANCIAL OVERVIEW */}
          <div className="bg-[#141419] border border-emerald-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
             
             <div className="flex items-center justify-between mb-8 relative z-10">
               <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase tracking-widest flex items-center gap-3">
                 <DollarSign className="w-8 h-8 text-emerald-400 animate-pulse" /> TỔNG QUAN TÀI CHÍNH (TIẾP THỊ LIÊN KẾT)
               </h3>
               <button onClick={() => alert('Đã gửi yêu cầu rút tiền!')} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black rounded-xl shadow-glow-emerald transition-all transform hover:scale-105 flex items-center gap-2">
                 <Wallet className="w-5 h-5" /> RÚT TIỀN NGAY
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <div className="bg-[#0A0A0E]/80 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 shadow-lg group">
                   <div className="absolute inset-0 bg-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                   <p className="text-sm text-emerald-500/80 font-bold uppercase tracking-widest mb-3">Hôm nay</p>
                   <p className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">0đ</p>
                   <p className="text-xs text-gray-500 mt-3 font-mono">0% so với hôm qua</p>
                </div>
                
                <div className="bg-[#0A0A0E]/80 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 shadow-lg group">
                   <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                   <p className="text-sm text-cyan-500/80 font-bold uppercase tracking-widest mb-3">Tuần này</p>
                   <p className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">0đ</p>
                   <p className="text-xs text-gray-500 mt-3 font-mono">0% so với tuần trước</p>
                </div>

                <div className="bg-[#0A0A0E]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 shadow-lg group">
                   <div className="absolute inset-0 bg-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                   <p className="text-sm text-purple-500/80 font-bold uppercase tracking-widest mb-3">Tháng này</p>
                   <p className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">0đ</p>
                   <p className="text-xs text-gray-500 mt-3 font-mono">0% so với tháng trước</p>
                </div>

                <div className="bg-[#0A0A0E]/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300 shadow-lg group">
                   <div className="absolute inset-0 bg-amber-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                   <p className="text-sm text-amber-500/80 font-bold uppercase tracking-widest mb-3">Tổng tích lũy</p>
                   <p className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">0đ</p>
                   <p className="text-xs text-gray-500 mt-3 font-mono">Toàn thời gian</p>
                </div>
             </div>
          </div>

          {/* ROW 2: 4 STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#141419] border border-white/5 p-5 rounded-2xl hover:border-amber-500/30 transition-colors shadow-lg group">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lượt Click Link</span>
                 <Share2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">0</div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">0% chuyển đổi</p>
            </div>
            <div className="bg-[#141419] border border-white/5 p-5 rounded-2xl hover:border-blue-500/30 transition-colors shadow-lg group">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Người Đăng Ký</span>
                 <User className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">0</div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">0% mua gói</p>
            </div>
            <div className="bg-[#141419] border border-white/5 p-5 rounded-2xl hover:border-pink-500/30 transition-colors shadow-lg group">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Khách Mua Gói</span>
                 <Crown className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">0</div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">Tất cả</p>
            </div>
            <div className="bg-[#141419] border border-white/5 p-5 rounded-2xl hover:border-emerald-500/30 transition-colors shadow-lg group">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Thu Nhập Aff</span>
                 <DollarSign className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">0đ</div>
              <p className="text-[10px] text-gray-500 mt-2 font-mono">Đã thanh toán</p>
            </div>
          </div>

          {/* ROW 3: PROFILE & BANK ACCOUNT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Profile */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col hover:border-purple-500/20 transition-colors relative">
                {savedSuccess && <div className="absolute top-4 right-4 text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-fade-in bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> Đã lưu</div>}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-4 h-4 text-purple-400"/> THÔNG TIN CÁ NHÂN (CÓ THỂ SỬA)</h3>
                <div className="flex items-center gap-4 mb-4">
                   <div className="relative group cursor-pointer shrink-0">
                      <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"} className="w-16 h-16 rounded-full border-2 border-[#1A1A24] object-cover" alt="Avatar" />
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-5 h-5 text-white" /></div>
                   </div>
                   <div className="flex-1 min-w-0">
                       <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="bg-[#0A0A0E] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-purple-500 focus:outline-none w-full font-black placeholder-gray-500" placeholder="Họ và tên" />
                       <div className="flex items-center gap-2 mt-2">
                           <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded text-[9px] font-bold">Hoạt động</span>
                           <p className="text-[10px] text-gray-400 truncate">ID: <span className="font-mono text-white">{userId}</span></p>
                       </div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block uppercase">Số điện thoại / Zalo:</label>
                      <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="Nhập số điện thoại" className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                   </div>
                   <div className="space-y-1 opacity-70">
                      <label className="text-[10px] text-gray-400 font-bold block uppercase">Email (Mặc định):</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="email" disabled value={profile.email} className="w-full bg-[#1A1A24] border border-transparent rounded-lg pl-9 pr-3 py-2 text-emerald-400 text-xs font-mono font-bold cursor-not-allowed" />
                      </div>
                   </div>
                   
                   <button onClick={handleSaveProfile} className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-glow-purple transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2">
                      <Save className="w-3.5 h-3.5" /> LƯU THÔNG TIN
                   </button>
                </div>
             </div>
             
             {/* Bank Account */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col hover:border-purple-500/20 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-purple-400"/> TÀI KHOẢN NGÂN HÀNG (RÚT TIỀN)</h3>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block uppercase">Tên Ngân Hàng:</label>
                      <input type="text" value={profile.bankName} onChange={(e) => setProfile({ ...profile, bankName: e.target.value })} placeholder="VD: MBBank" className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block uppercase">Số Tài Khoản:</label>
                      <input type="text" value={profile.accountNumber} onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })} placeholder="VD: 998124419999" className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block uppercase">Tên Chủ Tài Khoản:</label>
                      <input type="text" value={profile.accountHolder} onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })} placeholder="VD: NGUYEN VAN A" className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg px-3 py-2 text-white uppercase text-xs focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                   </div>
                   <button onClick={() => alert('Đã cập nhật số tài khoản nhận tiền!')} className="w-full mt-2 py-2.5 bg-white/5 hover:bg-[#8B5CF6] hover:shadow-glow-purple border border-white/10 hover:border-transparent text-white font-bold text-xs rounded-lg transition-all">LƯU TÀI KHOẢN</button>
                </div>
             </div>
          </div>

          {/* ROW 4: LINK AFFILIATE & HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

             {/* Links & Level */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col justify-between hover:border-cyan-500/20 transition-colors">
                <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-cyan-400"/> LINK GIỚI THIỆU CỦA BẠN</h3>
                   <div className="flex items-center gap-2 bg-[#0A0A0E] border border-white/10 rounded-lg p-1.5 mb-6">
                      <input type="text" readOnly value={`https://avalive.pro/ref/${currentUser?.email?.split('@')[0] || 'user'}`} className="flex-1 bg-transparent text-xs text-gray-300 pl-2 focus:outline-none" />
                      <button onClick={() => { navigator.clipboard.writeText(`https://avalive.pro/ref/${currentUser?.email?.split('@')[0] || 'user'}`); alert("Đã copy link giới thiệu!"); }} className="p-2 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors"><Copy className="w-4 h-4"/></button>
                   </div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400"/> CẤP BẬC AFFILIATE</h3>
                   <div className="flex items-center gap-4 bg-[#0A0A0E] border border-white/5 rounded-xl p-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                         <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                         <h4 className="text-sm font-black text-white mb-1">DIAMOND <span className="text-[10px] text-emerald-400 font-normal ml-1">Hoa hồng 30%</span></h4>
                         <div className="w-full bg-white/10 rounded-full h-1">
                            <div className="bg-cyan-400 h-1 rounded-full w-[0%] shadow-glow-blue"></div>
                         </div>
                         <p className="text-[9px] text-gray-500 mt-1 text-right">0đ / 50.000.000đ</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* History */}
             <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col hover:border-pink-500/20 transition-colors">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><History className="w-4 h-4 text-pink-400"/> LỊCH SỬ HOA HỒNG</h3>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 h-48">
                   <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                      <FileText className="w-8 h-8 mb-2" />
                      <p className="text-[10px]">Chưa có giao dịch nào.</p>
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
