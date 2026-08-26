import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, CheckCircle2, Copy, Link as LinkIcon, Menu, Bell, Crown, 
  ShieldCheck, Database, Calendar, Search, CreditCard, DollarSign, Wallet, FileText, 
  Share2, Zap, Settings, Save, ArrowUpRight, ArrowDownRight, ChevronDown, Package, 
  Activity, Monitor, LogOut, TrendingUp, Download, Eye, RefreshCw, Smartphone, Laptop, 
  History, LogIn, Lock, Camera, ChevronLeft, Radio, Coins, Clock, Sparkles, ArrowRight
} from 'lucide-react';
import TeamPermissionsManager from './TeamPermissionsManager';
import SalesAnalyticsManager from './SalesAnalyticsManager';
import AffiliateProgram from './AffiliateProgram';

export default function UserProfile({ currentUser, setActiveTab }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

  // Token & Point Management State - Always synced with currentUser
  const userTokens = currentUser?.tokens || 0;
  
  const liveMinutesUsed = currentUser?.liveMinutesUsed || 0;
  const liveMinutesRemaining = currentUser?.liveMinutesRemaining || (currentUser?.plan === 'VIP PRO' ? 9999 : 4320);

  const profile = {
    name: currentUser?.name || 'Người dùng mới',
    email: currentUser?.email || 'Chưa cập nhật',
    phone: currentUser?.phone || 'Chưa cập nhật',
    planName: currentUser?.isAdmin ? 'SUPER ADMIN ENTERPRISE VIP' : (currentUser?.plan || 'GÓI MIỄN PHÍ (DÙNG THỬ)'),
    planStatus: 'ACTIVE',
    bankName: 'MBBank',
    accountNumber: 'Chưa cập nhật',
    accountHolder: currentUser?.name || ''
  };
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('avalive_current_user');
    window.location.reload();
  };

  const tokenLogs = [
    { id: 'TK-9921', action: 'Livestream AI Idol Lan Hương (45 phút)', tokenCost: '-450 Tokens', time: '10 phút trước', type: 'deduct' },
    { id: 'TK-9918', action: 'Tự động phản hồi Chatbot AI (28 bình luận)', tokenCost: '-140 Tokens', time: '25 phút trước', type: 'deduct' },
    { id: 'TK-9905', action: 'Kích hoạt Game Sàn Nhảy 3D TikTok Live', tokenCost: '-200 Tokens', time: '1 giờ trước', type: 'deduct' },
    { id: 'TK-8832', action: 'Nạp thêm Token Gói Doanh Nghiệp VIP', tokenCost: '+50,000 Tokens', time: 'Hôm qua', type: 'add' }
  ];

  return (
    <div className="w-full bg-[#07090E] text-gray-200 font-sans min-h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row">
      
      {/* ─── SIDEBAR ─── */}
      <aside className={`w-64 bg-[#0C0F17] border-r border-white/10 flex flex-col shrink-0 transition-all duration-300 z-30 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full'}`}>
        
        {/* Brand Logo Header */}
        <div 
          onClick={() => setActiveTab && setActiveTab('overview')} 
          className="p-5 flex items-center justify-between border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors group"
          title="Về Trang Chủ"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg group-hover:scale-105 transition-all">
              <img src="/official_logo.jpg" alt="AVA LIVE" className="w-full h-full object-cover rounded-[14px] border border-white/30" />
            </div>
            <div>
              <h2 className="text-white font-black text-base leading-none tracking-tight">AVA LIVE</h2>
              <span className="text-[9px] text-[#EF4444] font-black uppercase tracking-widest block mt-0.5">QUẢN TRỊ HỒ SƠ</span>
            </div>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
        </div>
        
        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar text-xs font-semibold">
          
          <div className="space-y-1">
            <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-gray-500">TÀI KHOẢN & ĐIỂM</div>
            
            <button 
              onClick={() => setActiveSidebarTab('overview')} 
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarTab === 'overview' 
                  ? 'bg-gradient-to-r from-red-500/20 via-purple-500/15 to-transparent text-white border-l-2 border-red-500 font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-red-400" /> 
              <span>Tổng Quan Hồ Sơ</span>
            </button>

            <button 
              onClick={() => setActiveSidebarTab('points-tokens')} 
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarTab === 'points-tokens' 
                  ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent text-white border-l-2 border-amber-500 font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400 animate-pulse" /> 
                <span>Điểm & Token Live</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[9px] font-black">
                {userTokens.toLocaleString()}
              </span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-gray-500">QUẢN TRỊ KINH DOANH</div>
            
            <button 
              onClick={() => setActiveSidebarTab('affiliate-dashboard')} 
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarTab === 'affiliate-dashboard' 
                  ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent text-white border-l-2 border-emerald-500 font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-400" /> 
              <span>Tiếp Thị 30% (Affiliate)</span>
            </button>

            <button 
              onClick={() => setActiveSidebarTab('sales-orders')} 
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarTab === 'sales-orders' 
                  ? 'bg-gradient-to-r from-blue-500/20 to-transparent text-white border-l-2 border-blue-500 font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-blue-400" /> 
              <span>Quản Lý Đơn Hàng</span>
            </button>

            <button 
              onClick={() => setActiveSidebarTab('team')} 
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeSidebarTab === 'team' 
                  ? 'bg-gradient-to-r from-purple-500/20 to-transparent text-white border-l-2 border-purple-500 font-bold' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" /> 
              <span>Phân Quyền Đội Ngũ</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button 
            onClick={() => setActiveTab && setActiveTab('overview')} 
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Về Trang Chủ Web
          </button>

          <button 
            onClick={handleLogout} 
            className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE CONTENT ─── */}
      <main className="flex-1 flex flex-col min-h-[85vh] overflow-hidden bg-[#0A0A0E]">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0D0D15]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer">
              <Menu className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-gray-300">Tài khoản kết nối Realtime</span>
            </div>
          </div>

          <div className="flex items-center gap-4">



          </div>
        </header>

        {/* ─── TAB CONTENT ROUTER ─── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          
          {/* TAB 1: OVERVIEW */}
          {activeSidebarTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              
              {/* Profile Card & Membership Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#12121c] to-black border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center gap-4 z-10">
                  <div className="relative">
                    <img src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} className="w-16 h-16 rounded-2xl border-2 border-purple-500 object-cover shadow-glow-purple" alt="Avatar" />
                    <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-black uppercase">Active</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white">{profile.name}</h2>
                      {currentUser?.isAdmin && <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black">SUPER ADMIN</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{profile.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-black">
                      👑 GÓI HIỆN TẠI: {profile.planName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 z-10">
                  <button 
                    onClick={() => setActiveTab && setActiveTab('enterprise')}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Coins className="w-4 h-4" /> Nâng Cấp Gói
                  </button>

                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#12141F] border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-bold uppercase">Token Khả Dụng</span>
                    <Coins className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{userTokens.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">Tự động trừ khi livestream AI</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12141F] border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-xs font-bold uppercase">Hoa Hồng Tích Lũy</span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">15.850.000đ</p>
                  <p className="text-[10px] text-gray-400">Tỉ lệ chia sẻ hoa hồng 30%</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12141F] border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between text-cyan-400">
                    <span className="text-xs font-bold uppercase">Thời Gian Live</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">{liveMinutesUsed} phút</p>
                  <p className="text-[10px] text-gray-400">Còn lại {liveMinutesRemaining} phút {profile.planName.includes('MIỄN PHÍ') ? '(Dùng thử)' : ''}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12141F] border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-purple-400">
                    <span className="text-xs font-bold uppercase">Khách Đăng Ký</span>
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-black text-white font-mono">128 người</p>
                  <p className="text-[10px] text-gray-400">Qua link giới thiệu Affiliate</p>
                </div>
              </div>

              {/* Referral Link & Bank Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Referral Link Box */}
                <div className="p-6 rounded-2xl bg-[#12141F] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase">
                    <LinkIcon className="w-4 h-4" /> Link Tiếp Thị Liên Kết Của Bạn
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl p-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://avalivepro.vercel.app/?ref=${currentUser?.email?.split('@')[0] || 'user'}`}
                      className="flex-1 bg-transparent text-xs text-cyan-300 font-mono pl-2 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://avalivepro.vercel.app/?ref=${currentUser?.email?.split('@')[0] || 'user'}`);
                        alert("✅ Đã sao chép link giới thiệu!");
                      }} 
                      className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">Chia sẻ link này nhận ngay hoa hồng 30% trọn đời mỗi khi có khách nâng cấp bản quyền.</p>
                </div>

                {/* Bank Account for Payouts */}
                <div className="p-6 rounded-2xl bg-[#12141F] border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                    <CreditCard className="w-4 h-4" /> Tài Khoản Nhận Tiền Rút
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ngân Hàng:</span>
                      <span className="font-bold text-white">{profile.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Số Tài Khoản:</span>
                      <span className="font-bold text-emerald-400 font-mono">{profile.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Chủ Tài Khoản:</span>
                      <span className="font-bold text-white uppercase">{profile.accountHolder}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: POINTS & TOKENS LIVE */}
          {activeSidebarTab === 'points-tokens' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
              
              {/* Big Token Balance Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/50 via-[#18120c] to-black border border-amber-500/40 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                      <Sparkles className="w-4 h-4 animate-spin" /> QUẢN TRỊ ĐIỂM TOKEN & THỜI GIAN LIVE
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white font-mono mt-2">
                      {userTokens.toLocaleString()} <span className="text-amber-400 text-xl">TOKENS</span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Được cấp phát và tự động trừ hao khi vận hành phòng Live AI, Sàn nhảy & Game TikTok.</p>
                  </div>

                  <button 
                    onClick={() => alert("⚡ Đang mở cổng nạp VietQR SePay tự động...")}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <Coins className="w-5 h-5" /> NẠP THÊM TOKEN NGAY
                  </button>
                </div>

                {/* Token Deduction Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-amber-300 font-bold">🎙️ Giọng Nói & Trò Chuyện:</span>
                    <p className="text-[11px] text-gray-400">Trừ 5 Tokens / câu thoại AI</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-cyan-300 font-bold">🎬 Livestream AI Idol 4K:</span>
                    <p className="text-[11px] text-gray-400">Trừ 10 Tokens / phút phát sóng</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-purple-300 font-bold">🕺 Game Sàn Nhảy 3D PK:</span>
                    <p className="text-[11px] text-gray-400">Trừ 20 Tokens / bài nhảy tương tác</p>
                  </div>
                </div>
              </div>

              {/* Realtime Token Usage Logs */}
              <div className="p-6 rounded-2xl bg-[#12141F] border border-white/10 space-y-4">
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" /> Nhật Ký Trừ Điểm & Token Thời Gian Thực
                </h3>
                
                <div className="divide-y divide-white/5">
                  {tokenLogs.map((log) => (
                    <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-white">{log.action}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{log.id} • {log.time}</p>
                      </div>
                      <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg ${
                        log.type === 'add' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.tokenCost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: AFFILIATE DASHBOARD */}
          {activeSidebarTab === 'affiliate-dashboard' && (
            <div className="max-w-6xl mx-auto">
              <AffiliateProgram currentUser={currentUser} setGoogleLoginModalOpen={() => {}} />
            </div>
          )}

          {/* TAB 4: SALES ORDERS */}
          {activeSidebarTab === 'sales-orders' && (
            <div className="max-w-6xl mx-auto">
              <SalesAnalyticsManager currentUser={currentUser} />
            </div>
          )}

          {/* TAB 5: TEAM PERMISSIONS */}
          {activeSidebarTab === 'team' && (
            <div className="max-w-6xl mx-auto">
              <TeamPermissionsManager currentUser={currentUser} setCurrentUser={() => {}} setActiveTab={setActiveTab} />
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
