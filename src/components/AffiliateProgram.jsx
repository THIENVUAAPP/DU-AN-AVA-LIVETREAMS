import React, { useState } from 'react';
import { 
  Award, 
  Copy, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  QrCode, 
  ArrowUpRight, 
  ShieldCheck,
  Sparkles,
  Zap,
  UserCheck,
  Info,
  Check,
  Mail,
  CreditCard,
  FileText
} from 'lucide-react';

export default function AffiliateProgram({ currentUser, setGoogleLoginModalOpen }) {
  const [activeTab, setActiveTab] = useState(currentUser ? 'dashboard' : 'intro'); // 'intro' | 'dashboard'
  const [isAffiliateRegistered, setIsAffiliateRegistered] = useState(true);

  const [refLink] = useState(`https://avalive.pro/ref/${currentUser ? currentUser.email.split('@')[0] : 'quocthien90'}`);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  const [referrals] = useState([]);
  
  // Affiliate Stats State
  const [affiliateStats, setAffiliateStats] = useState({
    totalEarnings: 0,
    pendingWithdrawal: 0,
    paidOut: 0,
    successfulOrders: 0
  });

  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });

  const withdrawalHistory = [
    { id: '#WD-1092', amount: '2.500.000đ', bank: 'MBBank - 998124419999', date: '01/08/2025 14:30', status: 'HOÀN TẤT', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { id: '#WD-1085', amount: '1.250.000đ', bank: 'Vietcombank - 0011004123456', date: '15/07/2025 09:15', status: 'HOÀN TẤT', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { id: '#WD-1078', amount: '3.450.000đ', bank: 'Momo - 0988123456', date: '01/07/2025 10:20', status: 'ĐANG XỬ LÝ', color: 'text-amber-400', bg: 'bg-amber-500/20' }
  ];

  const copyRefLink = () => {
    navigator.clipboard.writeText(refLink);
    alert("Đã sao chép đường dẫn Tiếp Thị Liên Kết 30% Hoa Hồng!");
  };

  const handleRequestPayout = () => {
    setPayoutModalOpen(false);
    alert("Đã gửi yêu cầu rút tiền hoa hồng 30% qua SePay VietQR! Admin sẽ duyệt trong 15 phút.");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#8B5CF6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
              CHƯƠNG TRÌNH ĐỐI TÁC: 30% HOA HỒNG TRỌN ĐỜI • THANH TOÁN TỰ ĐỘNG 3S QUA SEPAY
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            🎁 Chương Trình Tiếp Thị Liên Kết AvaLive PRO (Affiliate 30%)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Giới thiệu khách mua gói Tháng hoặc gói Năm (Tặng 2 tháng) & nhận ngay <strong className="text-emerald-400 font-bold">30% hoa hồng rút tiền tự động qua SePay VietQR</strong> trực tiếp về tài khoản ngân hàng của bạn.
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-[#8B5CF6] text-white shadow-glow-purple' : 'bg-[#121216] text-gray-300'
              }`}
            >
              BẢNG QUẢN TRỊ CỦA TÔI
            </button>
            <button 
              onClick={() => setActiveTab('intro')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'intro' ? 'bg-[#8B5CF6] text-white shadow-glow-purple' : 'bg-[#121216] text-gray-300'
              }`}
            >
              GIỚI THIỆU & ĐIỀU KHOẢN
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setGoogleLoginModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-xs rounded-xl shadow-glow-red hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" /> KẾT NỐI GMAIL ĐỂ LÀM TIẾP THỊ 30%
          </button>
        )}
      </div>

      {/* Sub-view 1: Giới Thiệu & Đăng Ký Trở Thành Đối Tác Tiếp Thị */}
      {activeTab === 'intro' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center font-bold text-lg">
                30%
              </div>
              <h3 className="text-sm font-bold text-white">Hoa Hồng 30% Cao Nhất</h3>
              <p className="text-xs text-gray-400">
                Nhận ngay 30% giá trị hóa đơn (Hưởng 1 lần duy nhất) khi người dùng thanh toán gói qua SePay VietQR hoặc Stripe.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <h3 className="text-sm font-bold text-white">Rút Tiền SePay 3s Tự Động</h3>
              <p className="text-xs text-gray-400">
                Rút tiền hoa hồng về tài khoản ngân hàng cá nhân bất kỳ lúc nào qua cổng thanh toán tự động SePay VietQR.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-bold text-lg">
                🔗
              </div>
              <h3 className="text-sm font-bold text-white">Link & Mã Giới Thiệu Gmail</h3>
              <p className="text-xs text-gray-400">
                Khi kết nối tài khoản Gmail thật, hệ thống tự động khởi tạo link tiếp thị và mã giới thiệu riêng cho bạn.
              </p>
            </div>
          </div>

          {/* Registration Box for Publisher */}
          <div className="glass-panel p-6 rounded-2xl border border-white/15 text-center space-y-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-black text-white">ĐĂNG KÝ TRỞ THÀNH ĐỐI TÁC TIẾP THỊ 30% HOA HỒNG</h3>
            <p className="text-xs text-gray-300">
              Chỉ cần kết nối tài khoản Gmail thật để nhận ngay link giới thiệu riêng và truy cập Bảng Quản Trị Tiếp Thị.
            </p>

            {currentUser ? (
              <button 
                onClick={() => {
                  setIsAffiliateRegistered(true);
                  setActiveTab('dashboard');
                  alert("Đã đăng ký Đối tác Tiếp thị liên kết thành công!");
                }}
                className="px-6 py-3 bg-[#EF4444] text-white font-extrabold text-xs rounded-xl shadow-glow-red hover:bg-red-600 transition-all"
              >
                ⚡ MỞ BẢNG QUẢN TRỊ TIẾP THỊ CỦA TÔI
              </button>
            ) : (
              <button 
                onClick={() => setGoogleLoginModalOpen(true)}
                className="px-6 py-3 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-gray-200 transition-all shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                KẾT NỐI TÀI KHOẢN GMAIL THẬT ĐỂ ĐĂNG KÝ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub-view 2: Bảng Quản Trị Tiếp Thị Của Người Dùng Đã Kết Nối Gmail */}
      {activeTab === 'dashboard' && currentUser && (
        <div className="space-y-6">
          
          {/* User Referral Link Box */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EF4444]" /> ĐƯỜNG DẪN GIỚI THIỆU CỦA: <strong className="text-emerald-400">{currentUser.email}</strong>
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">Trạng thái: ĐÃ KÍCH HOẠT 30%</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 font-mono text-xs text-[#3B82F6] flex items-center justify-between">
                <span>{refLink}</span>
              </div>

              <button 
                onClick={copyRefLink}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-glow-red transition-all flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" /> SAO CHÉP LINK 30%
              </button>
            </div>
          </div>

          {/* Earnings Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-bold block">Tổng Hoa Hồng Tích Lũy (30%):</span>
              <span className="text-2xl font-black text-[#EF4444]">{affiliateStats.totalEarnings.toLocaleString()} VNĐ</span>
              <p className="text-[10px] text-emerald-400 font-mono">{affiliateStats.successfulOrders} Đơn Hàng Mua Gói Thành Công</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-bold block">Số Tiền Chờ Rút Về Ngân Hàng:</span>
              <span className="text-2xl font-black text-amber-400">{affiliateStats.pendingWithdrawal.toLocaleString()} VNĐ</span>
              <button 
                onClick={() => setPayoutModalOpen(true)}
                className="mt-1 px-3 py-1 bg-amber-500 text-black font-extrabold text-[10px] rounded-lg shadow-md hover:bg-amber-400 block"
              >
                RÚT TIỀN SEPAY VIETQR 3S
              </button>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs text-gray-400 font-bold block">Đã Chuyển Về Tài Khoản:</span>
              <span className="text-2xl font-black text-emerald-400">{affiliateStats.paidOut.toLocaleString()} VNĐ</span>
              <p className="text-[10px] text-gray-400 font-mono">Chuyển khoản SePay thành công</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bank Account Info */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <CreditCard className="w-4 h-4 text-[#8B5CF6]" /> TÀI KHOẢN NGÂN HÀNG NHẬN HOA HỒNG (SEPAY)
              </h3>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-bold block">Tên Ngân Hàng (VD: MBBank, Vietcombank):</label>
                  <input type="text" value={bankInfo.bankName} onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })} placeholder="Nhập tên ngân hàng..." className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">Số Tài Khoản:</label>
                    <input type="text" value={bankInfo.accountNumber} onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })} placeholder="VD: 998124419999" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-300 font-bold block">Tên Chủ Tài Khoản:</label>
                    <input type="text" value={bankInfo.accountHolder} onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })} placeholder="VD: NGUYEN VAN A" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:border-[#8B5CF6] focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>
              <button onClick={() => alert("Đã lưu thông tin tài khoản ngân hàng nhận tiền hoa hồng và đồng bộ với hệ thống Admin!")} className="w-full mt-2 px-5 py-2.5 bg-[#8B5CF6] hover:bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-glow-purple transition-all">LƯU TÀI KHOẢN NGÂN HÀNG & ĐỒNG BỘ</button>
            </div>

            {/* Withdrawal History */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
                <FileText className="w-4 h-4 text-amber-400" /> LỊCH SỬ RÚT TIỀN HOA HỒNG
              </h3>
              <div className="flex-1 overflow-y-auto mt-4 pr-2 custom-scrollbar space-y-3">
                {withdrawalHistory.map((wd, index) => (
                  <div key={index} className="bg-[#121216] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{wd.amount}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{wd.id} • {wd.date}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{wd.bank}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-[9px] font-bold ${wd.bg} ${wd.color}`}>
                        {wd.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referrals List Table */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3B82F6]" /> KHÁCH HÀNG ĐÃ MUA GÓI BẰNG LINK GIỚI THIỆU CỦA BẠN
              </h3>
              <span className="text-xs text-gray-400 font-mono">Hưởng 1 Lần Duy Nhất / Mỗi Gói</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#121216]">
                    <th className="p-3 text-gray-300 font-bold">Tên Khách Hàng Mua</th>
                    <th className="p-3 text-gray-300 font-bold">Gói Cước Đăng Ký</th>
                    <th className="p-3 text-gray-300 font-bold">Hoa Hồng 30% Nhận Được</th>
                    <th className="p-3 text-gray-300 font-bold">Ngày Thanh Toán</th>
                    <th className="p-3 text-gray-300 font-bold">Trạng Thái Rút Tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/5 transition-all">
                      <td className="p-3 font-bold text-white">{ref.name}</td>
                      <td className="p-3 text-[#EF4444] font-bold">{ref.package}</td>
                      <td className="p-3 font-black text-emerald-400">{ref.commission}</td>
                      <td className="p-3 text-gray-400 font-mono">{ref.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ref.status.includes('ĐÃ DUYỆT') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-[#8B5CF6] max-w-md w-full text-center space-y-4 shadow-glow-purple">
            <h3 className="text-lg font-black text-white">YÊU CẦU RÚT HOA HỒNG SEPAY (30%)</h3>
            <p className="text-xs text-gray-300">
              Tài khoản Gmail: <strong className="text-emerald-400 font-mono">{currentUser?.email}</strong>
            </p>
            <p className="text-xs text-gray-300">
              Số tiền rút: <strong className="text-emerald-400 font-mono">7.494.000 VNĐ</strong>
            </p>

            <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/10 text-left font-mono text-xs space-y-1 text-gray-300">
              <p>Ngân hàng nhận: <strong className="text-white">MBBank</strong></p>
              <p>Số TK: <strong className="text-[#3B82F6]">998124419999</strong></p>
              <p>Chủ TK: <strong className="text-white">QUOC THIEN</strong></p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setPayoutModalOpen(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold">HỦY</button>
              <button onClick={handleRequestPayout} className="flex-1 py-2.5 bg-[#8B5CF6] text-white rounded-xl text-xs font-black hover:bg-purple-600 transition-all">XÁC NHẬN RÚT 7.494.000 VNĐ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
