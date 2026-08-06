import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Radio, 
  Server, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  RefreshCcw,
  Sliders,
  BadgeCheck,
  TrendingUp,
  Power,
  Lock,
  Cpu,
  Zap,
  Globe,
  Mail
} from 'lucide-react';

export default function AdminDashboard({ currentUser, aiAvatarFeatureEnabled, setAiAvatarFeatureEnabled }) {
  const [activeSubTab, setActiveSubTab] = useState('users');

  // Stats State
  const [adminStats, setAdminStats] = useState({
    revenue: 0,
    users: 0,
    streams: 0,
    commission: 0,
    pendingWithdrawals: 0
  });


  // Admin Gmail quocthiencr90@gmail.com
  const adminGmail = currentUser?.email || 'quocthiencr90@gmail.com';

  // System Nodes Power Switches
  const [nodePowers, setNodePowers] = useState({
    sepayWebhook: true,
    stripeGateway: true,
    aiSpeechEngine: true,
    multistreamProxy: true,
  });

  // User Accounts State
  const [users, setUsers] = useState([]);

  // SePay Payment Logs
  const [sepayLogs, setSepayLogs] = useState([]);

  // Affiliate Payout Requests (30% Commission)
  const [affiliatePayouts, setAffiliatePayouts] = useState([]);

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'HOẠT ĐỘNG' ? 'TẠM KHÓA' : 'HOẠT ĐỘNG' } : u));
  };

  const approveAffiliatePayout = (id) => {
    setAffiliatePayouts(affiliatePayouts.map(a => a.id === id ? { ...a, status: 'ĐÃ CHUYỂN SEPAY' } : a));
    alert("Đã duyệt chuyển tiền hoa hồng 30% qua SePay VietQR thành công!");
  };

  const toggleNodePower = (key) => {
    setNodePowers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar with Admin Gmail Gate */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#EF4444]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">
              TRANG QUẢN TRỊ KẾT NỐI GOOGLE GMAIL ADMIN
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            🛡️ Trang Quản Trị Hệ Thống Super VIP (Admin Control Panel)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tài khoản Gmail Admin: <strong className="text-emerald-400 font-mono">{adminGmail}</strong> • Giám sát tổng quan hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121216] px-3 py-2 rounded-xl border border-white/10 text-xs font-bold">
          <Mail className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-gray-300">Admin Gmail:</span>
          <span className="text-[#EF4444] font-mono">{adminGmail}</span>
        </div>
      </div>

      {/* Admin Real-time Telemetry Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold block">Tổng Doanh Thu Hóa Đơn:</span>
          <span className="text-xl font-black text-[#EF4444]">{adminStats.revenue.toLocaleString()}₫</span>
          <p className="text-[10px] text-emerald-400 font-mono">Tự Động Nhận Tiền SePay 3s</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold block">Tổng Tài Khoản Đã Đăng Ký:</span>
          <span className="text-xl font-black text-[#3B82F6]">{adminStats.users} Users</span>
          <p className="text-[10px] text-gray-400 font-mono">Xác thực Google Auth 100%</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold block">Luồng Multistream Live:</span>
          <span className="text-xl font-black text-[#8B5CF6]">{adminStats.streams} Streams</span>
          <p className="text-[10px] text-emerald-400 font-mono">4 Cụm Máy Chủ Online</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-bold block">Quỹ Hoa Hồng Affiliate 30%:</span>
          <span className="text-xl font-black text-amber-400">{adminStats.commission.toLocaleString()}₫</span>
          <p className="text-[10px] text-amber-400 font-mono">{adminStats.pendingWithdrawals} Yêu cầu chờ chuyển tiền</p>
        </div>
      </div>

      {/* Admin Node Switches */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <Power className="w-4 h-4 text-[#EF4444]" /> Bật/Tắt Dịch Vụ Hệ Thống
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#121216] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="font-bold text-gray-300">Cổng SePay Webhook:</span>
            <button
              onClick={() => toggleNodePower('sepayWebhook')}
              className={`p-1.5 rounded-lg text-[10px] font-bold ${
                nodePowers.sepayWebhook ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {nodePowers.sepayWebhook ? 'ĐANG BẬT' : 'TẮT'}
            </button>
          </div>

          <div className="p-3 bg-[#121216] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="font-bold text-gray-300">Cổng Stripe Gateway:</span>
            <button
              onClick={() => toggleNodePower('stripeGateway')}
              className={`p-1.5 rounded-lg text-[10px] font-bold ${
                nodePowers.stripeGateway ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {nodePowers.stripeGateway ? 'ĐANG BẬT' : 'TẮT'}
            </button>
          </div>

          <div className="p-3 bg-[#121216] rounded-xl border border-purple-500/30 flex items-center justify-between col-span-2 md:col-span-1">
            <div>
              <span className="font-bold text-white block text-[11px]">Cơ Chế MC AI Avatar:</span>
              <span className={`text-[10px] font-black ${aiAvatarFeatureEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {aiAvatarFeatureEnabled ? '● ĐANG BẬT' : '🔒 ĐANG KHÓA / ẨN'}
              </span>
            </div>
            <button
              onClick={() => {
                if (setAiAvatarFeatureEnabled) {
                  setAiAvatarFeatureEnabled(!aiAvatarFeatureEnabled);
                  alert(aiAvatarFeatureEnabled ? "🔒 Đã ĐÓNG KHÓA & ẨN tính năng MC AI Avatar trên toàn hệ thống!" : "⚡ Đã MỞ KÍCH HOẠT LẠI tính năng MC AI Avatar!");
                }
              }}
              className={`p-1.5 px-3 rounded-lg text-[10px] font-black cursor-pointer ${
                aiAvatarFeatureEnabled ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white shadow-glow-emerald'
              }`}
            >
              {aiAvatarFeatureEnabled ? 'KHOÁ / TẮT' : 'MỞ BẬT LẠI'}
            </button>
          </div>

          <div className="p-3 bg-[#121216] rounded-xl border border-white/5 flex items-center justify-between">
            <span className="font-bold text-gray-300">Cụm Proxy Multistream:</span>
            <button
              onClick={() => toggleNodePower('multistreamProxy')}
              className={`p-1.5 rounded-lg text-[10px] font-bold ${
                nodePowers.multistreamProxy ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {nodePowers.multistreamProxy ? 'ĐANG BẬT' : 'TẮT'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Sub-tabs Navigation */}
      <div className="flex items-center gap-2 bg-[#121216] p-1.5 rounded-xl border border-white/10 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSubTab === 'users' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          👥 QUẢN LÝ NGƯỜI DÙNG
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSubTab === 'payments' ? 'bg-[#3B82F6] text-white shadow-glow-blue' : 'text-gray-400 hover:text-white'
          }`}
        >
          💳 GIAO DỊCH SEPAY & STRIPE
        </button>

        <button
          onClick={() => setActiveSubTab('affiliates')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeSubTab === 'affiliates' ? 'bg-[#8B5CF6] text-white shadow-glow-purple' : 'text-gray-400 hover:text-white'
          }`}
        >
          🎁 DUYỆT RÚT HOA HỒNG 30%
        </button>
      </div>

      {/* User Management Table */}
      {activeSubTab === 'users' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#EF4444]" /> DANH SÁCH TÀI KHOẢN GMAIL & GÓI SỬ DỤNG
            </h3>
            <span className="text-xs text-gray-400 font-mono">Hiển thị {users.length} tài khoản gần nhất</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#121216]">
                  <th className="p-3 text-gray-300 font-bold">Họ & Tên</th>
                  <th className="p-3 text-gray-300 font-bold">Email Gmail</th>
                  <th className="p-3 text-gray-300 font-bold">Gói Đăng Ký</th>
                  <th className="p-3 text-gray-300 font-bold">Tổng Chi Tiêu</th>
                  <th className="p-3 text-gray-300 font-bold">Trạng Thái</th>
                  <th className="p-3 text-gray-300 font-bold text-right">Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-all">
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 text-gray-400 font-mono">{u.email}</td>
                    <td className="p-3 font-bold text-[#EF4444]">{u.plan}</td>
                    <td className="p-3 font-bold text-emerald-400">{u.totalSpent}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'HOẠT ĐỘNG' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                          u.status === 'HOẠT ĐỘNG' 
                            ? 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white' 
                            : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {u.status === 'HOẠT ĐỘNG' ? 'KHOÁ ACC' : 'MỞ KHOÁ'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SePay Logs */}
      {activeSubTab === 'payments' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#3B82F6]" /> NHẬT KÝ GIAO DỊCH SEPAY VIETQR & STRIPE
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Webhook Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#121216]">
                  <th className="p-3 text-gray-300 font-bold">Mã GD</th>
                  <th className="p-3 text-gray-300 font-bold">Khách Hàng</th>
                  <th className="p-3 text-gray-300 font-bold">Số Tiền</th>
                  <th className="p-3 text-gray-300 font-bold">Kênh Thanh Toán</th>
                  <th className="p-3 text-gray-300 font-bold">Thời Gian</th>
                  <th className="p-3 text-gray-300 font-bold">Trạng Thái Webhook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sepayLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-all font-mono">
                    <td className="p-3 font-bold text-[#EF4444]">{log.id}</td>
                    <td className="p-3 text-white font-sans font-bold">{log.user}</td>
                    <td className="p-3 font-bold text-emerald-400">{log.amount}</td>
                    <td className="p-3 text-gray-300">{log.method}</td>
                    <td className="p-3 text-gray-400">{log.time}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Affiliate 30% Approvals */}
      {activeSubTab === 'affiliates' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#8B5CF6]" /> DUYỆT RÚT HOA HỒNG AFFILIATE 30%
            </h3>
            <span className="text-xs text-amber-400 font-mono">Quy tắc: Hưởng 1 Lần Duy Nhất Trên Mỗi Gói</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#121216]">
                  <th className="p-3 text-gray-300 font-bold">Người Tiếp Thị</th>
                  <th className="p-3 text-gray-300 font-bold">Số Tiền HOA HỒNG 30%</th>
                  <th className="p-3 text-gray-300 font-bold">Tài Khoản Nhận (SePay VietQR)</th>
                  <th className="p-3 text-gray-300 font-bold">Trạng Thái</th>
                  <th className="p-3 text-gray-300 font-bold text-right">Duyệt Chuyển Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {affiliatePayouts.map((aff) => (
                  <tr key={aff.id} className="hover:bg-white/5 transition-all">
                    <td className="p-3">
                      <span className="font-bold text-white block">{aff.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{aff.email}</span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{aff.commission}</td>
                    <td className="p-3 text-gray-300 font-mono text-[11px]">{aff.bank}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        aff.status === 'ĐÃ CHUYỂN SEPAY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {aff.status === 'CHỜ DUYỆT' ? (
                        <button
                          onClick={() => approveAffiliatePayout(aff.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg transition-all shadow-md"
                        >
                          CHUYỂN SEPAY 3S
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-mono">ĐÃ HOÀN TẤT</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
