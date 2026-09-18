import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { supabase } from '../lib/supabaseClient';")

# 2. Add state variables inside component
state_vars = """
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
"""
content = content.replace("const [activeSidebarTab, setActiveSidebarTab] = useState('overview');", "const [activeSidebarTab, setActiveSidebarTab] = useState('overview');\n" + state_vars)

# 3. Replace users table body
users_table_regex = r'<tbody className="divide-y divide-white/5 text-gray-300">.*?</tbody>'
dynamic_users_table = """<tbody className="divide-y divide-white/5 text-gray-300">
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
                </tbody>"""
content = re.sub(users_table_regex, dynamic_users_table, content, count=1, flags=re.DOTALL)

# 4. Replace permissions block form and table
permissions_form_regex = r'<div className="space-y-4">.*?CẬP NHẬT QUYỀN\n                   </button>\n                </div>'
new_permissions_form = """<form onSubmit={handleUpdatePermission} className="space-y-4">
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
                </form>"""
content = re.sub(permissions_form_regex, new_permissions_form, content, flags=re.DOTALL)

permissions_table_regex = r'<tbody className="divide-y divide-white/5 text-gray-300">.*?</tbody>'
# We have 4 tables in the file (users, withdrawals, affiliate, permissions). Let's use string replace for the specific permissions table row.
permissions_tr_old = """<tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">Admin Master</td>
                            <td className="p-4 text-gray-400">admin@avalive.vn</td>
                            <td className="p-4 font-bold text-purple-400">Admin</td>
                            <td className="p-4 text-emerald-400 font-bold">VIP PRO</td>
                            <td className="p-4 text-gray-500">Mặc định</td>
                            <td className="p-4 text-right">
                               <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Sửa</button>
                            </td>
                         </tr>"""
permissions_tr_new = """{usersList.filter(u => u.role === 'admin' || u.role === 'affiliate' || u.plan?.includes('VIP')).map((u, i) => (
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
                         ))}"""
content = content.replace(permissions_tr_old, permissions_tr_new)


# 5. Compute dynamic stats at the bottom
stats_regex = r"  const stats = \[.*?\];"
dynamic_stats = """  const totalRevenue = paymentsList.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
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
  ];"""
content = re.sub(stats_regex, dynamic_stats, content, flags=re.DOTALL)

ministats_regex = r"  const miniStats = \[.*?\];"
dynamic_ministats = """  const miniStats = [
    { label: 'TỔNG CREDITS ĐÃ DÙNG', value: '0', icon: <Zap className="w-5 h-5 text-purple-500" />, change: '0%', isUp: true },
    { label: 'KHÁCH HÀNG MỚI', value: totalUsers, icon: <Users className="w-5 h-5 text-blue-500" />, change: '0%', isUp: true },
    { label: 'TỶ LỆ GIỮ CHÂN (7 NGÀY)', value: '100%', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, change: '0%', isUp: true },
    { label: 'GIÁ TRỊ ĐƠN HÀNG TB', value: totalOrders ? formatVND(totalRevenue / totalOrders) : '0đ', icon: <Package className="w-5 h-5 text-amber-500" />, change: '0%', isUp: true },
    { label: 'HOA HỒNG ĐÃ TRẢ', value: '0đ', icon: <DollarSign className="w-5 h-5 text-pink-500" />, change: '0%', isUp: true }
  ];"""
content = re.sub(ministats_regex, dynamic_ministats, content, flags=re.DOTALL)


with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Injected supabase logic into AdminDashboard successfully.")
