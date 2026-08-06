import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Zero out mock data variables
stats_new = """  const stats = [
    { label: 'TỔNG DOANH THU', value: '0đ', icon: <DollarSign className="w-5 h-5 text-amber-500"/>, change: '0%', color: 'text-gray-500' },
    { label: 'LỢI NHUẬN RÒNG', value: '0đ', icon: <BarChart2 className="w-5 h-5 text-purple-500"/>, change: '0%', color: 'text-gray-500' },
    { label: 'NGƯỜI DÙNG', value: '0', icon: <Users className="w-5 h-5 text-blue-500"/>, change: '0%', color: 'text-gray-500' },
    { label: 'ĐƠN HÀNG', value: '0', icon: <ShoppingCart className="w-5 h-5 text-emerald-500"/>, change: '0%', color: 'text-gray-500' },
    { label: 'TỶ LỆ CHUYỂN ĐỔI', value: '0%', icon: <Share2 className="w-5 h-5 text-orange-500"/>, change: '0%', color: 'text-gray-500' }
  ];"""
content = re.sub(r"  const stats = \[.*?\];", stats_new, content, flags=re.DOTALL)

miniStats_new = """  const miniStats = [
    { label: 'TỔNG CREDITS ĐÃ DÙNG', value: '0', icon: <Zap className="w-5 h-5 text-purple-500" />, change: '0%', isUp: true },
    { label: 'KHÁCH HÀNG MỚI', value: '0', icon: <Users className="w-5 h-5 text-blue-500" />, change: '0%', isUp: true },
    { label: 'TỶ LỆ GIỮ CHÂN (7 NGÀY)', value: '0%', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, change: '0%', isUp: true },
    { label: 'GIÁ TRỊ ĐƠN HÀNG TB', value: '0đ', icon: <Package className="w-5 h-5 text-amber-500" />, change: '0%', isUp: true },
    { label: 'HOA HỒNG ĐÃ TRẢ', value: '0đ', icon: <DollarSign className="w-5 h-5 text-pink-500" />, change: '0%', isUp: true }
  ];"""
content = re.sub(r"  const miniStats = \[.*?\];", miniStats_new, content, flags=re.DOTALL)

content = re.sub(r"  const recentTransactions = \[.*?\];", "  const recentTransactions = [];", content, flags=re.DOTALL)
content = re.sub(r"  const topAffiliates = \[.*?\];", "  const topAffiliates = [];", content, flags=re.DOTALL)

# 2. Update renderPlaceholder users & withdrawals & affiliate & settings
users_regex = r"    if \(title === 'users'\) \{.*?      \);\n    \}"
new_users = """    if (title === 'users') {
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
                   <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">Chưa có dữ liệu người dùng</td>
                   </tr>
                </tbody>
             </table>
          </div>
        </div>
      );
    }"""
content = re.sub(users_regex, new_users, content, flags=re.DOTALL)

withdrawals_regex = r"    if \(title === 'withdrawals'\) \{.*?      \);\n    \}"
new_withdrawals = """    if (title === 'withdrawals') {
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
    }"""
content = re.sub(withdrawals_regex, new_withdrawals, content, flags=re.DOTALL)

affiliate_regex = r"    if \(title === 'affiliate'\) \{.*?      \);\n    \}"
new_affiliate = """    if (title === 'affiliate') {
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
    }"""
content = re.sub(affiliate_regex, new_affiliate, content, flags=re.DOTALL)


settings_regex = r"    if \(title === 'settings'\) \{.*?      \);\n    \}"
new_settings = """    if (title === 'settings') {
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
    }"""
content = re.sub(settings_regex, new_settings, content, flags=re.DOTALL)


# 3. Remove Thống Kê button from Sidebar
# <button onClick={() => setActiveSidebarTab('statistics')} ...><BarChart2 className="w-4 h-4"/> Thống kê</button>
content = re.sub(r"            <button onClick=\{\(\) => setActiveSidebarTab\('statistics'\)\}.*?</button>\n", "", content)

# 4. Remove GÓI SIÊU CẤP VIP PRO banner
vip_pro_regex = r'          <div className="p-4 bg-gradient-to-br from-\[#1E1B4B\].*?</div>'
content = re.sub(vip_pro_regex, "", content, flags=re.DOTALL)


# 5. Fix overview active class since we removed statistics, the 'overview || statistics' check is no longer needed but it doesnt hurt. Let's change it back to 'overview'
content = content.replace("activeSidebarTab === 'overview' || activeSidebarTab === 'statistics'", "activeSidebarTab === 'overview'")

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AdminDashboard.jsx successfully.")
