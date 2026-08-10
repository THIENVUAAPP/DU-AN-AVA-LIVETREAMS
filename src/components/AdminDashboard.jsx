import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, MapPin, CheckCircle2, Copy, Link as LinkIcon, Menu, Bell, Crown, ShieldCheck, Database, Calendar, Search, CreditCard, DollarSign, Wallet, FileText, Share2, Zap, Settings, Save, ArrowUpRight, ArrowDownRight, ChevronDown, Package, Activity, Monitor, LogOut, TrendingUp, Download, Eye, RefreshCw, BarChart2, Home, ShoppingCart, Users, ChevronLeft, Bot, MonitorPlay } from 'lucide-react';
import AIStorytellerDashboard from './AIStorytellerDashboard';

export default function AdminDashboard({ currentUser, aiAvatarFeatureEnabled, setAiAvatarFeatureEnabled }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('overview');

  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      // Fetch users
      const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (usersData) setUsersList(usersData);
      
      // Fetch payments
      const { data: paymentsData } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      if (paymentsData) setPaymentsList(paymentsData);
      
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const role = form.role.value;
    const plan = form.plan.value;
    
    if (!email) {
      alert("Vui lòng nhập Email!");
      return;
    }
    
    const updateData = {};
    if (role !== "Không Thay Đổi") {
      updateData.role = role === "Quản Trị Viên (Admin)" ? "admin" : (role === "Cộng Tác Viên (Affiliate)" ? "affiliate" : "user");
    }
    if (plan !== "Không Thay Đổi") {
      updateData.plan = plan === "Gói STARTER" ? "STARTER" : (plan === "Gói PRO" ? "PRO" : (plan === "Gói VIP" || plan === "Gói SIÊU CẤP VIP PRO" ? "VIP PRO" : "FREE"));
    }
    
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase.from('users').update(updateData).eq('email', email);
      if (error) {
        alert("Lỗi cập nhật: " + error.message);
      } else {
        alert("Cập nhật quyền thành công!");
        // Refresh users
        const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (data) setUsersList(data);
      }
    }
  };


    const renderPlaceholder = (title) => {
    if (title === 'users') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full">
           <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Quản Lý Người Dùng</h2>
                <p className="text-gray-400 text-sm">Hiển thị người đã mua gói, chưa mua gói và người làm tiếp thị liên kết.</p>
             </div>
          </div>
          <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden">
             <div className="p-4 border-b border-white/5 flex gap-4">
                <input type="text" placeholder="Tìm tên, email..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-64 focus:outline-none focus:border-purple-500" />
                <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500">
                   <option>Tất cả người dùng</option>
                   <option>Đã mua gói (VIP/PRO/STARTER)</option>
                   <option>Chưa mua gói (Miễn phí)</option>
                   <option>Đang làm Affiliate</option>
                </select>
             </div>
             <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1A24] text-gray-400">
                   <tr>
                      <th className="p-4 font-bold">Người Dùng</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold">Gói Hiện Tại</th>
                      <th className="p-4 font-bold">Vai Trò</th>
                      <th className="p-4 font-bold">Tham Gia AFF</th>
                      <th className="p-4 font-bold text-right">Thao Tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                   {isLoading ? (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-bold">Đang tải dữ liệu...</td></tr>
                   ) : usersList.length > 0 ? (
                      usersList.map((u, i) => (
                        <tr key={i} className="hover:bg-white/5">
                           <td className="p-4 font-bold text-white">{u.name || 'Người dùng'}</td>
                           <td className="p-4 text-gray-400">{u.email}</td>
                           <td className="p-4"><span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase">{u.plan || 'FREE'}</span></td>
                           <td className="p-4 text-emerald-400 font-bold">{u.role === 'admin' ? 'Admin' : (u.role === 'affiliate' ? 'Affiliate' : 'User')}</td>
                           <td className="p-4 text-center">{u.role === 'affiliate' ? '✅' : '-'}</td>
                           <td className="p-4 text-right"><button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Xem</button></td>
                        </tr>
                      ))
                   ) : (
                      <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-bold">Chưa có dữ liệu người dùng</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>
      );
    }
    
    if (title === 'withdrawals') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full">
           <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Quản Lý Rút Tiền</h2>
                <p className="text-gray-400 text-sm">Duyệt yêu cầu rút tiền hoa hồng của Affiliate.</p>
             </div>
          </div>
          
          <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden">
             <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1A24] text-gray-400">
                   <tr>
                      <th className="p-4 font-bold">Mã GD</th>
                      <th className="p-4 font-bold">Người Dùng</th>
                      <th className="p-4 font-bold">Số Tiền Rút</th>
                      <th className="p-4 font-bold">Ngân Hàng</th>
                      <th className="p-4 font-bold">Thời Gian</th>
                      <th className="p-4 font-bold">Trạng Thái</th>
                      <th className="p-4 font-bold text-right">Thao Tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                   <tr>
                      <td colSpan="7" className="p-8 text-center text-gray-500 font-bold">Chưa có giao dịch rút tiền</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      );
    }

    if (title === 'affiliate') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full">
           <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Tổng Quan Hệ Thống Affiliate</h2>
                <p className="text-gray-400 text-sm">Quản lý mạng lưới tiếp thị liên kết, hoa hồng và chiến dịch.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
             {[
               { label: 'Tổng Hoa Hồng Đã Duyệt', value: '0 đ', color: 'text-emerald-400' },
               { label: 'Hoa Hồng Đang Chờ (Hold)', value: '0 đ', color: 'text-amber-400' },
               { label: 'Tổng Affiliate Hoạt Động', value: '0 Người', color: 'text-purple-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                  <h4 className="text-gray-400 text-sm font-bold mb-2">{stat.label}</h4>
                  <div className={"text-3xl font-black mb-2 " + stat.color}>{stat.value}</div>
               </div>
             ))}
          </div>

          <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden mb-6">
             <div className="p-4 border-b border-white/5 flex gap-4">
                <input type="text" placeholder="Tìm tên Affiliate..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-64 focus:outline-none focus:border-purple-500" />
             </div>
             <table className="w-full text-left text-xs">
                <thead className="bg-[#1A1A24] text-gray-400">
                   <tr>
                      <th className="p-4 font-bold">Người Dùng (Affiliate)</th>
                      <th className="p-4 font-bold text-center">Số Thành Viên (F1)</th>
                      <th className="p-4 font-bold text-center">Đơn Hàng Thành Công</th>
                      <th className="p-4 font-bold text-right">Tổng Hoa Hồng Đã Nhận</th>
                      <th className="p-4 font-bold text-right">Hoa Hồng Chờ Duyệt</th>
                      <th className="p-4 font-bold text-right">Thao Tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                   <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">Chưa có dữ liệu Affiliate</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      );
    }
    
    if (title === 'permissions') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-6xl mx-auto h-full pb-20">
           <div className="flex justify-between items-end mb-6">
             <div>
                <h2 className="text-2xl font-black text-white mb-2">Phân Quyền & Cấp Gói</h2>
                <p className="text-gray-400 text-sm">Cấp quyền Quản trị viên, Nâng cấp gói hoặc tùy chỉnh Hoa hồng cho từng tài khoản.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-1 bg-[#141419] border border-white/5 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Cấp Quyền Qua Email</h3>
                <form onSubmit={handleUpdatePermission} className="space-y-4">
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Email Người Dùng</label>
                      <input name="email" type="email" placeholder="VD: user@gmail.com" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none" />
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Vai Trò Hệ Thống</label>
                      <select name="role" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none">
                         <option>Không Thay Đổi</option>
                         <option>Người Dùng (User)</option>
                         <option>Quản Trị Viên (Admin)</option>
                         <option>Cộng Tác Viên (Affiliate)</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Cấp Gói Hệ Thống</label>
                      <select name="plan" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none">
                         <option>Không Thay Đổi</option>
                         <option>Gói STARTER</option>
                         <option>Gói PRO</option>
                         <option>Gói VIP</option>
                         <option>Gói SIÊU CẤP VIP PRO</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Hoa Hồng Tùy Chỉnh (%) - Để trống nếu dùng mặc định</label>
                      <input name="commission" type="number" placeholder="VD: 40" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none" />
                   </div>
                   <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-glow-purple mt-4 hover:scale-[1.02] transition-transform">
                      CẬP NHẬT QUYỀN
                   </button>
                </form>
             </div>

             <div className="lg:col-span-2 bg-[#141419] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex gap-4 shrink-0">
                   <h3 className="text-sm font-bold text-white">Danh Sách Tài Khoản Đặc Biệt</h3>
                </div>
                <div className="flex-1 overflow-auto">
                   <table className="w-full text-left text-xs">
                      <thead className="bg-[#1A1A24] text-gray-400">
                         <tr>
                            <th className="p-4 font-bold">Người Dùng</th>
                            <th className="p-4 font-bold">Email</th>
                            <th className="p-4 font-bold">Vai Trò</th>
                            <th className="p-4 font-bold">Gói</th>
                            <th className="p-4 font-bold">Hoa Hồng</th>
                            <th className="p-4 font-bold text-right">Thao Tác</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                         {usersList.filter(u => u.role === 'admin' || u.role === 'affiliate' || u.plan?.includes('VIP')).map((u, i) => (
                           <tr key={i} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-bold text-white">{u.name || 'User'}</td>
                              <td className="p-4 text-gray-400">{u.email}</td>
                              <td className="p-4 font-bold text-purple-400 uppercase">{u.role}</td>
                              <td className="p-4 text-emerald-400 font-bold uppercase">{u.plan || 'FREE'}</td>
                              <td className="p-4 text-gray-500">Mặc định</td>
                              <td className="p-4 text-right">
                                 <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Sửa</button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      );
    }
    
    if (title === 'settings') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-4xl mx-auto h-full pb-20">
           <h2 className="text-2xl font-black text-white mb-6">Cấu Hình & Cài Đặt Hệ Thống</h2>
           <div className="space-y-6">
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Settings className="w-4 h-4 text-cyan-400" /> Cấu Hình Trang Chủ</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Tên Trang Web</label>
                       <input type="text" defaultValue="AVA LiveStreams - Nền Tảng Bán Hàng" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Email Hỗ Trợ</label>
                       <input type="text" defaultValue="support@avalive.vn" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="space-y-2 col-span-2">
                       <label className="text-xs text-gray-400 font-bold block">Logo Trang Web (URL)</label>
                       <input type="text" defaultValue="https://avalive.vn/logo.png" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="space-y-2 col-span-2">
                       <label className="text-xs text-gray-400 font-bold block">Banner Trang Chủ (Mô Tả)</label>
                       <textarea rows="3" defaultValue="Giải Pháp Chốt Đơn Hàng Tự Động Hoàn Toàn 100%!" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm"></textarea>
                    </div>
                 </div>
              </div>

              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Share2 className="w-4 h-4 text-purple-400" /> Cấu Hình Chính Sách Affiliate</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Hoa Hồng Cơ Bản (%)</label>
                       <input type="number" defaultValue="20" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Hoa Hồng VIP PRO (%)</label>
                       <input type="number" defaultValue="35" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-bold text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Minpay (Số Dư Tối Thiểu Được Rút)</label>
                       <input type="number" defaultValue="100000" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
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

    // Default Placeholder (fallback)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in h-full">
         <div className="w-24 h-24 mb-6 rounded-3xl bg-[#141419] border-2 border-white/5 flex items-center justify-center shadow-glow-purple">
            <Settings className="w-10 h-10 text-purple-400 animate-spin-slow" />
         </div>
         <h2 className="text-2xl font-black text-white mb-3">Chức Năng Sắp Ra Mắt</h2>
         <p className="text-gray-400 max-w-md">Khu vực <span className="text-purple-400 font-bold">{title}</span> đang được nâng cấp để mang lại trải nghiệm tối ưu nhất.</p>
      </div>
    );
  };
  
  // Stats mock data from design
  const totalRevenue = paymentsList.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOrders = paymentsList.length;
  const totalUsers = usersList.length;
  const totalAffiliates = usersList.filter(u => u.role === 'affiliate').length;

  const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const stats = [
    { label: 'TỔNG DOANH THU', value: formatVND(totalRevenue), icon: <DollarSign className="w-5 h-5 text-amber-500"/>, change: '+0%', color: 'text-gray-500' },
    { label: 'LỢI NHUẬN RÒNG', value: formatVND(totalRevenue * 0.8), icon: <BarChart2 className="w-5 h-5 text-purple-500"/>, change: '+0%', color: 'text-gray-500' },
    { label: 'NGƯỜI DÙNG', value: totalUsers, icon: <Users className="w-5 h-5 text-blue-500"/>, change: '+0%', color: 'text-gray-500' },
    { label: 'ĐƠN HÀNG', value: totalOrders, icon: <ShoppingCart className="w-5 h-5 text-emerald-500"/>, change: '+0%', color: 'text-gray-500' },
    { label: 'TỔNG AFFILIATE', value: totalAffiliates, icon: <Share2 className="w-5 h-5 text-orange-500"/>, change: '+0%', color: 'text-gray-500' }
  ];

  const miniStats = [
    { label: 'TỔNG CREDITS ĐÃ DÙNG', value: '0', icon: <Zap className="w-5 h-5 text-purple-500" />, change: '0%', isUp: true },
    { label: 'KHÁCH HÀNG MỚI', value: totalUsers, icon: <Users className="w-5 h-5 text-blue-500" />, change: '0%', isUp: true },
    { label: 'TỶ LỆ GIỮ CHÂN (7 NGÀY)', value: '0%', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, change: '0%', isUp: true },
    { label: 'GIÁ TRỊ ĐƠN HÀNG TB', value: totalOrders ? formatVND(totalRevenue / totalOrders) : '0đ', icon: <Package className="w-5 h-5 text-amber-500" />, change: '0%', isUp: true },
    { label: 'HOA HỒNG ĐÃ TRẢ', value: '0đ', icon: <DollarSign className="w-5 h-5 text-pink-500" />, change: '0%', isUp: true }
  ];

  const recentTransactions = [];

  const topAffiliates = [];

  return (
    <div className="flex h-screen bg-[#0F0F13] text-gray-300 font-sans overflow-hidden fixed inset-0 z-[200]">
      
      {/* Sidebar */}
      <aside className={`w-64 bg-[#141419] border-r border-white/5 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute h-full z-20 shadow-2xl'}`}>
        <div onClick={() => window.location.href='/'} className="p-6 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-xl group-hover:scale-105 transition-all">
              <img 
                src="/official_logo.jpg" 
                alt="AVA LIVESTREAM" 
                className="w-full h-full object-cover rounded-[10px] border border-white/40"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-white font-black text-xl leading-none tracking-tight flex items-center gap-1 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              AVA <span className="text-[#EF4444] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">LIVESTREAM</span>
            </h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-sm font-medium">
          <div className="space-y-1">
            <button onClick={() => setActiveSidebarTab('overview')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'overview' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><Home className="w-4 h-4"/> Tổng quan</button>
            <button onClick={() => setActiveSidebarTab('users')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'users' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><Users className="w-4 h-4"/> Người dùng</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">THANH TOÁN</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('withdrawals')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'withdrawals' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><Wallet className="w-4 h-4"/> Rút tiền</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">AFFILIATE</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('affiliate')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'affiliate' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><Share2 className="w-4 h-4"/> Tổng quan AFF</button>
            </div>
          </div>
          
          <div className="mt-4 mb-4">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 px-4 flex items-center gap-2"><Bot className="w-3 h-3"/> AI ENGINE</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('ai-storyteller')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'ai-storyteller' ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-indigo-400 border-l-2 border-indigo-500 font-black shadow-lg shadow-indigo-500/10' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><MonitorPlay className={`w-4 h-4 ${activeSidebarTab === 'ai-storyteller' ? 'text-indigo-400' : ''}`}/> AI Kể Chuyện</button>
            </div>
          </div>
          
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-4">HỆ THỐNG</p>
            <div className="space-y-1">
              <button onClick={() => setActiveSidebarTab('permissions')} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'permissions' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}><ShieldCheck className="w-4 h-4"/> Phân quyền</button>
              <button onClick={() => setActiveSidebarTab('settings')} className={`flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${activeSidebarTab === 'settings' ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500 font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-3"><Settings className="w-4 h-4"/> Cài đặt</div>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeSidebarTab === 'settings' ? 'rotate-180' : ''}`} />
              </button>
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
            <button onClick={() => window.history.back()} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors">
               <ChevronLeft className="w-4 h-4" /> Quay Lại
            </button>
            <div className="relative hidden md:block w-96">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="w-full bg-[#1A1A24] border border-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">Ctrl + K</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer"><Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">0</span></div>
            <div className="relative cursor-pointer"><Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors"/><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold border-2 border-[#111118]">0</span></div>
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
        {(activeSidebarTab === 'overview') ? (
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              
              <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3 mb-1">Xin chào, Admin Master <span className="animate-wave inline-block origin-bottom-right">👋</span></h1>
                <p className="text-sm text-gray-400">Đây là tổng quan hệ thống của bạn hôm nay.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2 text-sm text-gray-300 font-medium cursor-pointer hover:bg-white/5 transition-colors">
              <Calendar className="w-4 h-4 text-gray-400" /> 30/07/2026 - 06/08/2026 <ChevronDown className="w-4 h-4 ml-2" />
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
                    {formatVND(totalRevenue)} 
                    <span className="text-sm text-emerald-500 font-bold flex items-center mb-1"><ArrowUpRight className="w-4 h-4 mr-0.5"/> +0% so với kỳ trước</span>
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
                    <span>30/07</span><span>31/07</span><span>01/08</span><span>02/08</span><span>03/08</span><span>04/08</span><span>05/08</span><span>06/08</span>
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
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-gray-300 font-medium">Gói thành viên</span></div>
                      <div className="text-right"><div className="font-bold text-white">{totalRevenue > 0 ? '100%' : '0%'}</div><div className="text-[10px] text-gray-500">{formatVND(totalRevenue)}</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-gray-300 font-medium">Ứng dụng / Sản phẩm</span></div>
                      <div className="text-right"><div className="font-bold text-white">0%</div><div className="text-[10px] text-gray-500">0đ</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-gray-300 font-medium">Nạp tiền / Credits</span></div>
                      <div className="text-right"><div className="font-bold text-white">0%</div><div className="text-[10px] text-gray-500">0đ</div></div>
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
                  <div className="text-3xl font-black text-white mb-1">{totalUsers}</div>
                  <div className="text-xs text-gray-500 mb-2">Tổng người dùng</div>
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center justify-center gap-1"><ArrowUpRight className="w-3 h-3"/> +0% so với kỳ trước</div>
                </div>
                <div className="relative w-28 h-28 rounded-full border-[10px] border-transparent flex-shrink-0" style={{background: 'conic-gradient(#8B5CF6 0% 65%, #06B6D4 65% 90%, #EC4899 90% 100%)', borderRadius: '50%', padding: '10px', WebkitMask: 'radial-gradient(transparent 62%, black 63%)'}}></div>
                <div className="space-y-3 flex-1">
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-gray-300 font-bold text-[10px]">Hoạt động</span></div>
                     <span className="text-gray-500 pl-4">{totalUsers > 0 ? '100%' : '0%'} ({totalUsers})</span>
                   </div>
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-cyan-500"></div><span className="text-gray-300 font-bold text-[10px]">Mới</span></div>
                     <span className="text-gray-500 pl-4">0% (0)</span>
                   </div>
                   <div className="text-xs">
                     <div className="flex items-center gap-2 mb-0.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div><span className="text-gray-300 font-bold text-[10px]">Không hoạt động</span></div>
                     <span className="text-gray-500 pl-4">0% (0)</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Thông tin hệ thống */}
            <div className="bg-[#141419] border border-white/5 p-6 rounded-2xl shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">THÔNG TIN HỆ THỐNG</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">CPU Usage</span><span className="text-white font-bold">0%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full w-[0%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">RAM Usage</span><span className="text-white font-bold">0%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[0%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-400 font-medium">Disk Usage</span><span className="text-white font-bold">0%</span></div>
                  <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[0%]"></div></div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 mt-4">
                  <div className="flex items-center gap-4">
                     <div><span className="text-gray-500 mr-2 text-[10px]">Server Status</span><span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Online</span></div>
                     <div><span className="text-gray-500 mr-2 text-[10px]">Database</span><span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">Online</span></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] mt-2">
                   <span className="text-gray-500 text-[10px]">Backup</span>
                   <span className="text-emerald-500 font-bold">Thành công <span className="text-gray-600 font-normal ml-1">06/08/2026 - 08:15 PM</span></span>
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
                {paymentsList.length > 0 ? paymentsList.slice(0, 4).map((tx, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-4 h-4"/></div>
                      <div>
                        <p className="text-xs font-bold text-white">{tx.user_email || 'Người dùng'}</p>
                        <p className="text-[11px] text-gray-500">Đã mua {tx.plan}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-600">Vừa xong</span>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 text-xs py-8 font-bold">Chưa có hoạt động nào</div>
                )}
              </div>
            </div>

          </div>

          <div className="text-center pt-8 border-t border-white/5 flex justify-between items-center text-xs text-gray-600">
             <span>© 2025 AvaLive PRO. All rights reserved.</span>
             <span className="flex items-center gap-2">Phiên bản 2.5.0 <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold">Ổn định</span></span>
          </div>

        </div>
        ) : (activeSidebarTab === 'ai-storyteller') ? (
          <AIStorytellerDashboard />
        ) : (
          renderPlaceholder(activeSidebarTab)
        )}
      </main>
    </div>
  );
}
