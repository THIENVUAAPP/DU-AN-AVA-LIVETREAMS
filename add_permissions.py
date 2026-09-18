import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

permissions_block = """    if (title === 'permissions') {
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
                <div className="space-y-4">
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Email Người Dùng</label>
                      <input type="email" placeholder="VD: user@gmail.com" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none" />
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Vai Trò Hệ Thống</label>
                      <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none">
                         <option>Người Dùng (User)</option>
                         <option>Quản Trị Viên (Admin)</option>
                         <option>Cộng Tác Viên (Affiliate)</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Cấp Gói Hệ Thống</label>
                      <select className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none">
                         <option>Không Thay Đổi</option>
                         <option>Gói STARTER</option>
                         <option>Gói PRO</option>
                         <option>Gói VIP</option>
                         <option>Gói SIÊU CẤP VIP PRO</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-xs text-gray-400 font-bold block mb-2">Hoa Hồng Tùy Chỉnh (%) - Để trống nếu dùng mặc định</label>
                      <input type="number" placeholder="VD: 40" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:border-purple-500 focus:outline-none" />
                   </div>
                   <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-glow-purple mt-4 hover:scale-[1.02] transition-transform">
                      CẬP NHẬT QUYỀN
                   </button>
                </div>
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
                         <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">Admin Master</td>
                            <td className="p-4 text-gray-400">admin@avalive.vn</td>
                            <td className="p-4 font-bold text-purple-400">Admin</td>
                            <td className="p-4 text-emerald-400 font-bold">VIP PRO</td>
                            <td className="p-4 text-gray-500">Mặc định</td>
                            <td className="p-4 text-right">
                               <button className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition-colors">Sửa</button>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      );
    }
    
"""

content = content.replace("    if (title === 'settings') {", permissions_block + "    if (title === 'settings') {")

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added permissions tab successfully.")
