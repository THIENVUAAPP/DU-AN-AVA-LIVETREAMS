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
  MousePointer,
  CreditCard
} from 'lucide-react';

export default function AffiliateDashboard({ currentUser }) {
  const userGmail = currentUser?.email || 'quocthiencr90@gmail.com';
  const refCode = userGmail.split('@')[0];
  const refLink = `https://avalive.pro/ref/${refCode}`;

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState('PENDING'); // 'PENDING' | 'REQUESTED' | 'PAID'

  // User's Referrals Table
  const [referrals] = useState([
    { id: 1, name: 'Shop Thời Trang Sài Gòn', package: 'Enterprise VIP (19.990.000₫)', commission: '5.997.000 VNĐ', date: '20/07/2026', status: 'ĐÃ CHUYỂN TIỀN SEPAY' },
    { id: 2, name: 'Công Ty Mỹ Phẩm Skincare', package: 'Business Growth (4.990.000₫)', commission: '1.497.000 VNĐ', date: '21/07/2026', status: 'CHỜ DUYỆT SEPAY' },
    { id: 3, name: 'KOL Linh Bi Studio', package: 'Enterprise VIP (19.990.000₫)', commission: '5.997.000 VNĐ', date: '22/07/2026', status: 'CHỜ DUYỆT SEPAY' },
  ]);

  const copyRefLink = () => {
    navigator.clipboard.writeText(refLink);
    alert(`Đã sao chép đường dẫn Tiếp Thị Liên Kết 30% dành riêng cho ${userGmail}!`);
  };

  const handleConfirmPayoutRequest = () => {
    setPayoutStatus('REQUESTED');
    setPayoutModalOpen(false);
    alert("Đã gửi yêu cầu rút 7.494.000 VNĐ hoa hồng về tài khoản ngân hàng! Admin đang xử lý duyệt qua SePay VietQR 3s.");
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#8B5CF6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40">
              TRANG QUẢN TRỊ TIẾP THỊ LIÊN KẾT CÁ NHÂN (AFF DEDICATED DASHBOARD)
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            📊 Bảng Điều Khiển Tiếp Thị Liên Kết (Affiliate Dashboard)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tài khoản Gmail tiếp thị: <strong className="text-emerald-400 font-mono">{userGmail}</strong> • Đồng bộ real-time với hệ thống duyệt chi trả SePay VietQR 3s.
          </p>
        </div>

        <button 
          onClick={() => setPayoutModalOpen(true)}
          className="px-5 py-3 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-xs rounded-xl shadow-glow-red hover:opacity-90 transition-all flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" /> RÚT HOA HỒNG SEPAY VIETQR 3S
        </button>
      </div>

      {/* Unique Referral Link Box */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EF4444]" /> ĐƯỜNG DẪN GIỚI THIỆU CHÍNH THỨC CỦA BẠN
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">Mã Định Danh: <strong className="text-white">{refCode}</strong></span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-[#3B82F6] flex items-center justify-between">
            <span>{refLink}</span>
            <span className="text-[10px] text-emerald-400 font-sans font-bold">● Hoa Hồng 30% Active</span>
          </div>

          <button 
            onClick={copyRefLink}
            className="w-full sm:w-auto px-6 py-3 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-glow-red transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Copy className="w-4 h-4" /> SAO CHÉP LINK
          </button>
        </div>
      </div>

      {/* Performance Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Tổng Click Chuột:</span>
            <MousePointer className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <span className="text-2xl font-black text-white">418 Clicks</span>
          <p className="text-[10px] text-emerald-400 font-mono">Tỷ lệ chuyển đổi: 4.8%</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Tổng Hoa Hồng Tích Lũy:</span>
            <DollarSign className="w-4 h-4 text-[#EF4444]" />
          </div>
          <span className="text-2xl font-black text-[#EF4444]">13.491.000₫</span>
          <p className="text-[10px] text-emerald-400 font-mono">Quy tắc: 30% Hưởng 1 Lần</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Số Tiền Chờ Duyệt Rút:</span>
            <QrCode className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400">7.494.000₫</span>
          <p className="text-[10px] text-amber-400 font-mono">
            {payoutStatus === 'REQUESTED' ? '● Đang chờ Admin duyệt SePay' : '● Sẵn sàng gửi yêu cầu'}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>Đã Rút Về Ngân Hàng:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400">5.997.000₫</span>
          <p className="text-[10px] text-gray-400 font-mono">Đã nhận khoản qua SePay VietQR</p>
        </div>
      </div>

      {/* Referrals & Commissions Tracking Table */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#3B82F6]" /> KHÁCH HÀNG ĐĂNG KÝ GÓI BẰNG LINK GIỚI THIỆU CỦA BẠN
          </h3>
          <span className="text-xs text-gray-400 font-mono">Đồng bộ trực tiếp với Admin Dashboard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#121216]">
                <th className="p-3 text-gray-300 font-bold">Khách Hàng Mua</th>
                <th className="p-3 text-gray-300 font-bold">Gói Cước Đăng Ký</th>
                <th className="p-3 text-gray-300 font-bold">Hoa Hồng 30% Nhận Được</th>
                <th className="p-3 text-gray-300 font-bold">Ngày Thanh Toán</th>
                <th className="p-3 text-gray-300 font-bold">Trạng Thái Chi Trả</th>
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
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      ref.status.includes('ĐÃ CHUYỂN') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
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

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl border border-[#8B5CF6] max-w-md w-full text-center space-y-4 shadow-glow-purple">
            <h3 className="text-lg font-black text-white">YÊU CẦU RÚT HOA HỒNG SEPAY VIETQR 3S</h3>
            <p className="text-xs text-gray-300">
              Tài khoản Gmail Tiếp Thị: <strong className="text-emerald-400 font-mono">{userGmail}</strong>
            </p>
            <p className="text-xs text-gray-300">
              Số tiền hoa hồng rút: <strong className="text-[#EF4444] font-mono text-base">7.494.000 VNĐ</strong>
            </p>

            <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/10 text-left font-mono text-xs space-y-1 text-gray-300">
              <p>Ngân hàng nhận: <strong className="text-white">MBBank (Ngân Hàng Quân Đội)</strong></p>
              <p>Số Tài Khoản: <strong className="text-[#3B82F6]">998124419999</strong></p>
              <p>Chủ Tài Khoản: <strong className="text-white">QUOC THIEN</strong></p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setPayoutModalOpen(false)} className="flex-1 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold">HỦY BỎ</button>
              <button onClick={handleConfirmPayoutRequest} className="flex-1 py-2.5 bg-[#8B5CF6] hover:bg-purple-600 text-white rounded-xl text-xs font-black transition-all">GỬI YÊU CẦU RÚT 7.494.000 VNĐ</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
