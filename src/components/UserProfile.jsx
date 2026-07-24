import React, { useState } from 'react';
import TeamPermissionsManager from './TeamPermissionsManager';
import SalesAnalyticsManager from './SalesAnalyticsManager';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  ShieldCheck, 
  CreditCard, 
  Save, 
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Zap,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function UserProfile({ currentUser }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'finance' | 'bank' | 'security'

  // User Profile Data
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Quốc Thiên Admin',
    email: currentUser?.email || 'quocthiencr90@gmail.com',
    phone: '0981 244 812',
    planStatus: currentUser?.email === 'quocthiencr90@gmail.com' ? 'PAID' : 'FREE',
    planName: currentUser?.email === 'quocthiencr90@gmail.com' ? 'Gói Doanh Nghiệp (Enterprise VIP)' : 'Chưa Đăng Ký Mua Gói Nào (Dùng Thử Miễn Phí)',
    bankName: 'MBBank (Ngân Hàng Quân Đội)',
    accountNumber: '998124419999',
    accountHolder: 'QUOC THIEN',
  });

  // Financial History
  const [userInvoices] = useState([
    { id: 'INV-9812', plan: 'Enterprise VIP (19.990.000₫)', method: 'SePay VietQR', status: 'ĐÃ THÀNH CÔNG', date: '20/07/2026' },
    { id: 'INV-4410', plan: 'Gói Dùng Thử 7 Ngày', method: 'Miễn Phí', status: 'HOÀN TẤT', date: '12/07/2026' },
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#EF4444]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
              QUẢN TRỊ HỒ SƠ & TÀI CHÍNH GMAIL CÁ NHÂN
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            👤 Bảng Quản Trị Hồ Sơ & Tài Chính Khách Hàng
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Quản lý tài khoản Gmail: <strong className="text-emerald-400 font-mono">{profile.email}</strong> • Kiểm tra gói cước đã đăng ký, lịch sử hóa đơn SePay & tài khoản ngân hàng.
          </p>
        </div>

        {/* Subscription Status Badge */}
        {profile.planStatus === 'PAID' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-black">
            <CheckCircle2 className="w-4 h-4" /> ĐÃ ĐĂNG KÝ GÓI ENTERPRISE VIP
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-black">
            <AlertCircle className="w-4 h-4" /> CHƯA MUA GÓI NÀO (GÓI MIỄN PHÍ)
          </div>
        )}
      </div>

      {/* Profile Sub-tabs */}
      <div className="flex items-center gap-2 bg-[#121216] p-1.5 rounded-xl border border-white/10 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'profile' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          👤 HỒ SƠ & GÓI ĐĂNG KÝ
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'finance' ? 'bg-[#3B82F6] text-white shadow-glow-blue' : 'text-gray-400 hover:text-white'
          }`}
        >
          💳 LỊCH SỬ NẠP TIỀN & HÓA ĐƠN
        </button>

        <button
          onClick={() => setActiveTab('bank')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'bank' ? 'bg-[#8B5CF6] text-white shadow-glow-purple' : 'text-gray-400 hover:text-white'
          }`}
        >
          🏦 NGÂN HÀNG NHẬN HOA HỒNG
        </button>

        <button
          onClick={() => setActiveTab('sales-analytics')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'sales-analytics' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>🛍️ QUẢN TRỊ BÁN HÀNG & BÁO CÁO</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'team' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>🛡️ PHÂN QUYỀN NHÂN VIÊN</span>
        </button>
      </div>

      {/* Tab 1: Profile & Subscription Status */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card Summary */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-center">
            <div className="relative w-24 h-24 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#3B82F6]">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{profile.name}</h3>
              <p className="text-xs text-gray-400 font-mono">{profile.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-[#121216] border border-white/10 text-xs text-left space-y-1.5">
              <span className="text-[10px] text-gray-400 font-bold block">TRẠNG THÁI GÓI ĐĂNG KÝ:</span>
              <p className={`font-black text-xs ${profile.planStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {profile.planName}
              </p>
              <div className="pt-1 text-[10px] text-emerald-400 font-bold">
                ⚡ Ưu Đãi SePay VietQR: Mua Gói Năm Tặng 2 Tháng Miễn Phí (Tiết kiệm 20%)!
              </div>
              {profile.planStatus === 'FREE' && (
                <button 
                  onClick={() => alert("Chuyển tới trang đăng ký mua gói SePay 3s (Tặng 2 tháng khi chọn gói năm)!")}
                  className="w-full mt-2 py-2 bg-[#EF4444] text-white text-xs font-black rounded-lg shadow-glow-red hover:bg-red-600 transition-all cursor-pointer"
                >
                  ⚡ MUA GÓI SEPAY (TẶNG 2 THÁNG NĂM)
                </button>
              )}
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSaveProfile} className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#EF4444]" /> THÔNG TIN TÀI KHOẢN GMAIL CÁ NHÂN
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Họ & Tên:</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#EF4444] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Email Gmail Kết Nối:</label>
                <input 
                  type="email" 
                  disabled
                  value={profile.email}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Số Điện Thoại / Zalo:</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#EF4444] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold block">Gói Cước Đang Sử Dụng:</label>
                <input 
                  type="text" 
                  disabled
                  value={profile.planName}
                  className={`w-full bg-[#121216] border border-white/10 rounded-xl px-3 py-2 font-bold ${
                    profile.planStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã lưu thông tin hồ sơ thành công!
                </span>
              ) : <span />}

              <button 
                type="submit"
                className="px-6 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-glow-red transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> LƯU THÔNG TIN HỒ SƠ
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Tab 2: Financial Invoices */}
      {activeTab === 'finance' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3B82F6]" /> LỊCH SỬ NẠP TIỀN & HÓA ĐƠN THANH TOÁN
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Tự động nhận diện SePay VietQR 3s</span>
          </div>

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
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bank Account Settings */}
      {activeTab === 'bank' && (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <CreditCard className="w-4 h-4 text-[#8B5CF6]" /> TÀI KHOẢN NGÂN HÀNG NHẬN HOA HỒNG RÚT (SEPAY VIETQR)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-bold block">Tên Ngân Hàng:</label>
              <input 
                type="text" 
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-bold block">Số Tài Khoản Ngân Hàng:</label>
              <input 
                type="text" 
                value={profile.accountNumber}
                onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-bold block">Tên Chủ Tài Khoản:</label>
              <input 
                type="text" 
                value={profile.accountHolder}
                onChange={(e) => setProfile({ ...profile, accountHolder: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          <button 
            onClick={() => alert("Đã lưu thông tin tài khoản ngân hàng nhận tiền hoa hồng!")}
            className="px-5 py-2 bg-[#8B5CF6] hover:bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-glow-purple transition-all"
          >
            LƯU TÀI KHOẢN NGÂN HÀNG
          </button>
        </div>
      )}

      {/* Tab 4: Sales & Shipping Analytics Control Center */}
      {activeTab === 'sales-analytics' && (
        <SalesAnalyticsManager currentUser={currentUser} />
      )}

      {/* Tab 5: Team Permissions Management */}
      {activeTab === 'team' && (
        <TeamPermissionsManager currentUser={currentUser} />
      )}

    </div>
  );
}
