import React, { useState } from 'react';
import { 
  Home, BarChart2, Users, Package, ShoppingCart, CreditCard, DollarSign, Wallet, FileText, Share2, 
  Settings, ShieldCheck, Database, Calendar, Search, Bell, Mail, ArrowUpRight, ArrowDownRight,
  Menu, X, Zap, Crown, CheckCircle2, ChevronDown
} from 'lucide-react';

export default function AdminDashboard({ currentUser, aiAvatarFeatureEnabled, setAiAvatarFeatureEnabled }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Stats mock data from design
  const stats = [
    { label: 'TỔNG DOANH THU', value: '2.450.789.000đ', icon: <DollarSign className="w-5 h-5 text-amber-500"/>, change: '+ 18.6%', color: 'text-emerald-500' },
    { label: 'LỢI NHUẬN RÒNG', value: '1.256.890.000đ', icon: <BarChart2 className="w-5 h-5 text-purple-500"/>, change: '+ 20.4%', color: 'text-emerald-500' },
    { label: 'NGƯỜI DÙNG', value: '42.854', icon: <Users className="w-5 h-5 text-blue-500"/>, change: '+ 15.7%', color: 'text-emerald-500' },
    { label: 'ĐƠN HÀNG', value: '8.746', icon: <ShoppingCart className="w-5 h-5 text-emerald-500"/>, change: '+ 12.3%', color: 'text-emerald-500' },
    { label: 'TỶ LỆ CHUYỂN ĐỔI', value: '6.23%', icon: <Share2 className="w-5 h-5 text-orange-500"/>, change: '+ 9.5%', color: 'text-emerald-500' }
  ];

  const miniStats = [
    { label: 'TỔNG CREDITS ĐÃ DÙNG', value: '1.785.432', icon: <Zap className="w-5 h-5 text-purple-500" />, change: '+ 17.3%', isUp: true },
    { label: 'KHÁCH HÀNG MỚI', value: '2.854', icon: <Users className="w-5 h-5 text-blue-500" />, change: '+ 16.1%', isUp: true },
    { label: 'TỶ LỆ GIỮ CHÂN (7 NGÀY)', value: '72.6%', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, change: '+ 8.6%', isUp: true },
    { label: 'GIÁ TRỊ ĐƠN HÀNG TB', value: '280.320đ', icon: <Package className="w-5 h-5 text-amber-500" />, change: '+ 11.8%', isUp: true },
    { label: 'HOA HỒNG ĐÃ TRẢ', value: '312.450.000đ', icon: <DollarSign className="w-5 h-5 text-pink-500" />, change: '+ 14.2%', isUp: true }
  ];

  const recentTransactions = [
    { id: '#48752', name: 'Nguyễn Văn A', product: 'Gói VIP PRO', amount: '799.000đ', method: 'MoMo', status: 'Thành công', statusColor: 'text-emerald-500' },
    { id: '#48751', name: 'Trần Thị B', product: 'App Tết 2026', amount: '599.000đ', method: 'VNPay', status: 'Thành công', statusColor: 'text-emerald-500' },
    { id: '#48750', name: 'Lê Văn C', product: 'Nạp 1.000 Credits', amount: '200.000đ', method: 'Thẻ ATM', status: 'Thành công', statusColor: 'text-emerald-500' },
    { id: '#48749', name: 'Phạm Thị D', product: 'Gói KIM CƯƠNG', amount: '2.990.000đ', method: 'PayPal', status: 'Thành công', statusColor: 'text-emerald-500' },
    { id: '#48748', name: 'Hoàng Văn E', product: 'App Noel 2025', amount: '599.000đ', method: 'MoMo', status: 'Thành công', statusColor: 'text-emerald-500' }
  ];

  const topAffiliates = [
    { rank: 1, name: 'NGUYENHUNG', commission: '124.560.000đ', clients: 256, conversion: '12.4%' },
    { rank: 2, name: 'PHAMGIANG', commission: '98.750.000đ', clients: 198, conversion: '10.1%' },
    { rank: 3, name: 'LANANH', commission: '72.430.000đ', clients: 156, conversion: '8.7%' },
    { rank: 4, name: 'HOANGNAM', commission: '58.320.000đ', clients: 134, conversion: '7.2%' },
    { rank: 5, name: 'MINHTUAN', commission: '45.210.000đ', clients: 112, conversion: '6.4%' }
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
            <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 rounded-lg border-l-2 border-purple-500"><Home className="w-4 h-4"/> Tổng quan</button>
            <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><BarChart2 className="w-4 h-4"/> Thống kê</button>
            <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Users className="w-4 h-4"/> Người dùng</button>
            <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors">
              <div className="flex items-center gap-3"><Package className="w-4 h-4"/> Sản phẩm / Ứng dụng</div>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors">
              <div className="flex items-center gap-3"><ShoppingCart className="w-4 h-4"/> Đơn hàng</div>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">THANH TOÁN</p>
            <div className="space-y-1">
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><CreditCard className="w-4 h-4"/> Giao dịch</button>
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><DollarSign className="w-4 h-4"/> Doanh thu</button>
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Wallet className="w-4 h-4"/> Nạp tiền / Rút tiền</button>
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><FileText className="w-4 h-4"/> Phương thức thanh toán</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">AFFILIATE</p>
            <div className="space-y-1">
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors"><Share2 className="w-4 h-4"/> Tổng quan AFF</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">HỆ THỐNG</p>
            <div className="space-y-1">
              <button onClick={() => alert("Chức năng đang cập nhật")} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors">
                <div className="flex items-center gap-3"><Settings className="w-4 h-4"/> Cài đặt</div>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-xl border border-purple-500/30 m-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 blur-xl rounded-full"></div>
             <h4 className="text-white font-bold flex items-center gap-2 mb-1"><Crown className="w-4 h-4 text-amber-400" /> GÓI SIÊU CẤP VIP PRO</h4>
             <p className="text-[10px] text-purple-200 mb-3">Hiệu lực đến: 30/12/2026</p>
             <button className="w-full py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-xs font-bold text-white shadow-glow-purple">Nâng cấp ngay</button>
          </div>
          
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A0A0E]">
        {/* Top Navbar */}
        <header className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-[#111118]/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white"><Menu className="w-6 h-6"/></button>
            <div className="relative hidden md:block w-96">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="w-full bg-[#1A1A24] border border-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">Ctrl + K</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer"><Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">12</span></div>
            <div className="relative cursor-pointer"><Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">6</span></div>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10 cursor-pointer">
              <img src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&h=32"} className="w-9 h-9 rounded-full border border-white/10" alt="Admin" />
              <div className="hidden md:block text-sm">
                <p className="font-bold text-white leading-tight">Admin Master</p>
                <p className="text-xs text-gray-500 leading-tight">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab("overview")} className="flex items-center gap-3 group cursor-pointer mr-6">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform">
      C
    </div>
    <div className="text-left">
      <h2 className="text-white font-black text-xl leading-none group-hover:text-amber-400 transition-colors">CAPRO</h2>
      <span className="text-[10px] text-amber-500 tracking-[0.3em] font-bold">— TRANG CHỦ —</span>
    </div>
  </button>
              <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-1">Xin chào, Admin Master <span className="animate-wave inline-block origin-bottom-right">👋</span></h1>
                <p className="text-sm text-gray-400">Đây là tổng quan hệ thống của bạn hôm nay.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-300 font-medium cursor-pointer hover:bg-white/5 transition-colors">
              <Calendar className="w-4 h-4 text-gray-400" /> 20/07/2025 - 27/07/2025 <ChevronDown className="w-4 h-4 ml-2" />
            </div>
          </div>

          {/* Top KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {stats.map((s, i) => (
              <div key={i} className="bg-[#141419] border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[11px] font-bold text-gray-500 tracking-wider whitespace-nowrap">{s.label}</span>
                  <div className="w-10 h-10 rounded-full bg-[#1A1A24] flex items-center justify-center border border-white/5 shrink-0">{s.icon}</div>
                </div>
                <div className="text-2xl font-black text-white mb-2">{s.value}</div>
                <div className={`text-xs font-bold flex items-center gap-1 ${s.color}`}>
                  <ArrowUpRight className="w-3 h-3"/> {s.change} <span className="text-gray-500 font-medium">so với 7 ngày trước</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Line Chart Panel */}
            <div className="lg:col-span-2 bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">DOANH THU</span>
                  <div className="text-3xl font-black text-white flex items-end gap-3">
                    2.450.789.000₫ 
                    <span className="text-sm text-emerald-500 font-bold flex items-center mb-1"><ArrowUpRight className="w-4 h-4 mr-0.5"/> 18.6% so với kỳ trước</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300 font-medium cursor-pointer">
                    7 ngày qua <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                  <div className="flex gap-5">
                     <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div><span className="text-gray-300">Doanh thu</span></div>
                     <div className="flex items-center gap-2 text-xs font-medium"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><span className="text-gray-300">Lợi nhuận</span></div>
                  </div>
                </div>
              </div>
              {/* Mock Line Chart */}
              <div className="h-64 w-full relative flex items-end justify-between border-b border-l border-white/5 pb-2 pl-3">
                 <div className="absolute inset-0 bg-gradient-to-t from-purple-500/15 to-transparent z-0" style={{clipPath: 'polygon(0% 100%, 0% 60%, 15% 40%, 30% 50%, 45% 30%, 60% 45%, 75% 20%, 90% 35%, 100% 10%, 100% 100%)'}}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-amber-500/15 to-transparent z-0" style={{clipPath: 'polygon(0% 100%, 0% 80%, 15% 70%, 30% 75%, 45% 50%, 60% 60%, 75% 40%, 90% 55%, 100% 30%, 100% 100%)'}}></div>
                 
                 {/* SVG Lines */}
                 <svg className="absolute inset-0 w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polyline points="0,60 15,40 30,50 45,30 60,45 75,20 90,35 100,10" fill="none" stroke="#A855F7" strokeWidth="1.5" />
                    <polyline points="0,80 15,70 30,75 45,50 60,60 75,40 90,55 100,30" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                    {/* Points */}
                    <circle cx="15" cy="40" r="1.5" fill="#A855F7" />
                    <circle cx="45" cy="30" r="1.5" fill="#A855F7" />
                    <circle cx="75" cy="20" r="1.5" fill="#A855F7" />
                    <circle cx="100" cy="10" r="1.5" fill="#A855F7" />
                    <circle cx="45" cy="50" r="1.5" fill="#F59E0B" />
                    <circle cx="75" cy="40" r="1.5" fill="#F59E0B" />
                 </svg>

                 {/* Y Axis labels */}
                 <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-[10px] text-gray-500 font-mono">
                    <span>3B</span><span>2.5B</span><span>2B</span><span>1.5B</span><span>1B</span><span>500M</span><span>0</span>
                 </div>
                 {/* X Axis labels */}
                 <div className="absolute -bottom-7 left-0 w-full flex justify-between text-[11px] text-gray-500 font-mono pr-2 pl-2">
                    <span>20/07</span><span>21/07</span><span>22/07</span><span>23/07</span><span>24/07</span><span>25/07</span><span>26/07</span><span>27/07</span>
                 </div>
              </div>
            </div>

            {/* Donut Chart Panel */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">PHÂN BỔ DOANH THU</h3>
                <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-lg px-2 py-1 text-[10px] text-gray-300 font-medium cursor-pointer">
                  7 ngày qua <ChevronDown className="w-3 h-3 ml-1" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center pt-4">
                 <div className="relative w-48 h-48 rounded-full border-[16px] border-transparent shadow-lg" style={{background: 'conic-gradient(#8B5CF6 0% 45%, #3B82F6 45% 70%, #06B6D4 70% 85%, #10B981 85% 95%, #6366F1 95% 100%)', borderRadius: '50%', padding: '16px', WebkitMask: 'radial-gradient(transparent 58%, black 59%)'}}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-xs text-gray-400 font-bold mb-1">Tổng</span>
                       <span className="text-2xl font-black text-white">2.45B</span>
                       <span className="text-[10px] text-gray-500 font-bold mt-1">VND</span>
                    </div>
                 </div>
                 <div className="w-full mt-8 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-gray-300 font-medium">Ứng dụng / Sản phẩm</span></div>
                      <div className="text-right"><div className="font-bold text-white">45%</div><div className="text-[10px] text-gray-500">1.102.850.000đ</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-gray-300 font-medium">Gói thành viên</span></div>
                      <div className="text-right"><div className="font-bold text-white">25%</div><div className="text-[10px] text-gray-500">612.697.000đ</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-gray-300 font-medium">Nạp tiền / Credits</span></div>
                      <div className="text-right"><div className="font-bold text-white">15%</div><div className="text-[10px] text-gray-500">367.618.000đ</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-gray-300 font-medium">Dịch vụ khác</span></div>
                      <div className="text-right"><div className="font-bold text-white">10%</div><div className="text-[10px] text-gray-500">245.624.000đ</div></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Mini Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {miniStats.map((s, i) => (
              <div key={i} className="bg-[#141419] border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{s.label}</span>
                <div className="text-xl font-black text-white mb-2">{s.value}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${s.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {s.isUp ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>} {s.change}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#1A1A24] flex items-center justify-center border border-white/5">
                    {s.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions Table */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">GIAO DỊCH GẦN NHẤT</h3>
                <button onClick={() => alert("Chức năng đang cập nhật")} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Khách hàng</th>
                      <th className="pb-3 font-medium">Sản phẩm</th>
                      <th className="pb-3 font-medium">Số tiền</th>
                      <th className="pb-3 font-medium">Phương thức</th>
                      <th className="pb-3 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTransactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 text-gray-400">{tx.id}</td>
                        <td className="py-4 font-medium text-gray-300">{tx.name}</td>
                        <td className="py-4 text-gray-400">{tx.product}</td>
                        <td className="py-4 font-bold text-white">{tx.amount}</td>
                        <td className="py-4">
                          <span className="flex items-center gap-1 text-gray-300"><Wallet className="w-3 h-3 text-purple-400"/> {tx.method}</span>
                        </td>
                        <td className="py-4">
                          <span className={`${tx.statusColor} font-medium`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Affiliates Table */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">TOP AFFILIATE</h3>
                <button onClick={() => alert("Chức năng đang cập nhật")} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Xem tất cả</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      <th className="pb-3 font-medium w-10">#</th>
                      <th className="pb-3 font-medium">Affiliate</th>
                      <th className="pb-3 font-medium text-right">Hoa hồng</th>
                      <th className="pb-3 font-medium text-right">Khách hàng</th>
                      <th className="pb-3 font-medium text-right">Chuyển đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topAffiliates.map((aff, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-black">
                          {i === 0 ? <Crown className="w-4 h-4 text-amber-500" /> : i === 1 ? <Crown className="w-4 h-4 text-gray-300" /> : i === 2 ? <Crown className="w-4 h-4 text-orange-600" /> : <span className="text-gray-500">{aff.rank}</span>}
                        </td>
                        <td className="py-4 flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-400">{aff.name.charAt(0)}</div>
                           <span className="font-bold text-gray-300">{aff.name}</span>
                        </td>
                        <td className="py-4 font-bold text-white text-right">{aff.commission}</td>
                        <td className="py-4 text-gray-400 text-right">{aff.clients}</td>
                        <td className="py-4 text-gray-400 text-right">{aff.conversion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Thống kê người dùng */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">THỐNG KÊ NGƯỜI DÙNG</h3>
                <button onClick={() => alert("Chức năng đang cập nhật")} className="text-xs text-purple-400 hover:text-purple-300">Xem báo cáo</button>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-1 text-center">
                  <div className="text-3xl font-black text-white mb-1">42.854</div>
                  <div className="text-xs text-gray-500 mb-2">Tổng người dùng</div>
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center justify-center gap-1"><ArrowUpRight className="w-3 h-3"/> 15.7% so với kỳ trước</div>
                </div>
                <div className="relative w-28 h-28 rounded-full border-[10px] border-transparent flex-shrink-0" style={{background: 'conic-gradient(#8B5CF6 0% 65%, #06B6D4 65% 90%, #EC4899 90% 100%)', borderRadius: '50%', padding: '10px', WebkitMask: 'radial-gradient(transparent 62%, black 63%)'}}></div>
                <div className="space-y-3 flex-1">
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-gray-300 font-bold text-[10px]">Hoạt động</span></div>
                     <span className="text-gray-500 pl-4">65% (27.856)</span>
                   </div>
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-cyan-500"></div><span className="text-gray-300 font-bold text-[10px]">Mới</span></div>
                     <span className="text-gray-500 pl-4">25% (10.713)</span>
                   </div>
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div><span className="text-gray-300 font-bold text-[10px]">Không hoạt động</span></div>
                     <span className="text-gray-500 pl-4">10% (4.285)</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Thông tin hệ thống */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">THÔNG TIN HỆ THỐNG</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">CPU Usage</span><span className="text-white font-bold">32%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full w-[32%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">RAM Usage</span><span className="text-white font-bold">48%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[48%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">Disk Usage</span><span className="text-white font-bold">26%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[26%]"></div></div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 mt-4">
                  <div className="flex items-center gap-4">
                     <div><span className="text-gray-500 mr-2 text-[10px]">Server Status</span><span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Online</span></div>
                     <div><span className="text-gray-500 mr-2 text-[10px]">Database</span><span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Online</span></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] mt-2">
                   <span className="text-gray-500 text-[10px]">Backup</span>
                   <span className="text-emerald-500 font-bold">Thành công <span className="text-gray-600 font-normal ml-1">27/07/2025 - 02:00 AM</span></span>
                </div>
              </div>
            </div>

            {/* Hoạt động gần đây */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">HOẠT ĐỘNG GẦN ĐÂY</h3>
                <button onClick={() => alert("Chức năng đang cập nhật")} className="text-xs text-purple-400 hover:text-purple-300">Xem tất cả</button>
              </div>
              <div className="space-y-4 flex-1">
                
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=32&h=32" className="w-8 h-8 rounded-full" alt="avatar" />
                    <div>
                      <p className="text-xs font-bold text-white">Admin Master</p>
                      <p className="text-[11px] text-gray-500">Đăng nhập hệ thống</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600">2 phút trước</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Database className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-bold text-white">Hệ thống</p>
                      <p className="text-[11px] text-gray-500">Sao lưu dữ liệu thành công</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600">30 phút trước</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Users className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-bold text-white">Nguyễn Văn A</p>
                      <p className="text-[11px] text-gray-500">Đã mua Gói VIP PRO</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600">45 phút trước</span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><CheckCircle2 className="w-4 h-4"/></div>
                    <div>
                      <p className="text-xs font-bold text-white">Trần Thị B</p>
                      <p className="text-[11px] text-gray-500">Đăng ký tài khoản mới</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-600">1 giờ trước</span>
                </div>
                
              </div>
            </div>

          </div>

          <div className="text-center pt-8 border-t border-white/5 flex justify-between items-center text-xs text-gray-600">
             <span>© 2025 CAPRO AUTO. All rights reserved.</span>
             <span className="flex items-center gap-2">Phiên bản 2.5.0 <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">Ổn định</span></span>
          </div>

        </div>
      </main>
    </div>
  );
}
