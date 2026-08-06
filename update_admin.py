import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# I want to replace the `renderPlaceholder` implementation with my new one.
# Looking at the code, it starts at `const renderPlaceholder = (title) => {`
# And ends before `// Stats mock data from design`

start_marker = "const renderPlaceholder = (title) => {"
end_marker = "// Stats mock data from design"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Error finding markers")
    exit(1)

new_render_placeholder = """const renderPlaceholder = (title) => {
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
                   {[
                     { name: 'Hoàng Nam', email: 'nam.hoang@gmail.com', plan: 'VIP PRO', role: 'User', isAff: true },
                     { name: 'Nguyễn Thị B', email: 'nguyenthib@gmail.com', plan: 'STARTER', role: 'User', isAff: false },
                     { name: 'Trần Văn C', email: 'tranvanc@gmail.com', plan: 'MIỄN PHÍ', role: 'User', isAff: true },
                     { name: 'Lê Minh', email: 'leminh@gmail.com', plan: 'STARTER', role: 'User', isAff: false }
                   ].map((u, i) => (
                     <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-amber-500 flex items-center justify-center text-white">{u.name.charAt(0)}</div>
                            {u.name}
                        </td>
                        <td className="p-4 text-gray-400">{u.email}</td>
                        <td className="p-4 font-bold text-emerald-400">{u.plan}</td>
                        <td className="p-4">{u.role}</td>
                        <td className="p-4">{u.isAff ? <span className="text-emerald-400 font-bold">Có</span> : <span className="text-gray-500">Không</span>}</td>
                        <td className="p-4 text-right">
                           <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Sửa</button>
                        </td>
                     </tr>
                   ))}
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
                   {[
                     { id: 'WD-0921', user: 'Hoang Nam', bank: 'Vietcombank - 123456789', amount: '2.500.000 đ', date: 'Vừa xong', status: 'PENDING' },
                     { id: 'WD-0919', user: 'Thanh Huyen', bank: 'MBBank - 987654321', amount: '1.200.000 đ', date: '2 giờ trước', status: 'SUCCESS' },
                   ].map((tx, i) => (
                     <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono font-bold text-cyan-400">{tx.id}</td>
                        <td className="p-4 font-bold text-white">{tx.user}</td>
                        <td className="p-4 font-bold text-amber-400">{tx.amount}</td>
                        <td className="p-4 text-gray-400">{tx.bank}</td>
                        <td className="p-4 text-gray-400">{tx.date}</td>
                        <td className="p-4">
                           <span className={"px-2 py-1 rounded text-[10px] font-black " + (tx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500')}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           {tx.status === 'PENDING' ? (
                              <button className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded font-bold transition-colors">Duyệt</button>
                           ) : (
                              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Chi Tiết</button>
                           )}
                        </td>
                     </tr>
                   ))}
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
               { label: 'Tổng Hoa Hồng Đã Duyệt', value: '312.450.000 đ', color: 'text-emerald-400' },
               { label: 'Hoa Hồng Đang Chờ (Hold)', value: '45.200.000 đ', color: 'text-amber-400' },
               { label: 'Tổng Affiliate Hoạt Động', value: '1.245 Người', color: 'text-purple-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                  <h4 className="text-gray-400 text-sm font-bold mb-2">{stat.label}</h4>
                  <div className={"text-3xl font-black mb-2 " + stat.color}>{stat.value}</div>
               </div>
             ))}
          </div>

          <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 h-64 flex flex-col items-center justify-center relative overflow-hidden">
             <Share2 className="w-16 h-16 text-purple-500/20 mb-4 animate-pulse" />
             <p className="text-gray-500 font-bold text-sm">Sơ đồ mạng lưới Affiliate đang được cập nhật...</p>
          </div>
        </div>
      );
    }
    
    if (title === 'settings') {
      return (
        <div className="animate-fade-in text-left space-y-6 w-full max-w-4xl mx-auto h-full">
           <h2 className="text-2xl font-black text-white mb-6">Cấu Hình & Cài Đặt Hệ Thống</h2>
           <div className="space-y-6">
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Settings className="w-4 h-4 text-cyan-400" /> Cấu Hình Chung</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Tên Trang Web</label>
                       <input type="text" defaultValue="AVA LiveStreams - Nền Tảng Bán Hàng" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-400 font-bold block">Email Hỗ Trợ</label>
                       <input type="text" defaultValue="support@avalive.vn" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 space-y-4">
                 <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><CreditCard className="w-4 h-4 text-emerald-400" /> Cấu Hình Thanh Toán</h3>
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
  
  """

new_content = content[:start_idx] + new_render_placeholder + content[end_idx:]

# Also we need to change activeSidebarTab === 'overview' to (activeSidebarTab === 'overview' || activeSidebarTab === 'statistics')
# Let's find it.
old_cond = "{activeSidebarTab === 'overview' ? ("
new_cond = "{(activeSidebarTab === 'overview' || activeSidebarTab === 'statistics') ? ("
new_content = new_content.replace(old_cond, new_cond)

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated AdminDashboard.jsx successfully.")
