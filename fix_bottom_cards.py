import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix Thống kê người dùng
user_stats_pattern = r'<div className="flex-1 text-center">.*?<div className="relative w-28 h-28 rounded-full'
user_stats_replacement = """<div className="flex-1 text-center">
                  <div className="text-3xl font-black text-white mb-1">{totalUsers}</div>
                  <div className="text-xs text-gray-500 mb-2">Tổng người dùng</div>
                  <div className="text-[11px] text-emerald-500 font-bold flex items-center justify-center gap-1"><ArrowUpRight className="w-3 h-3"/> +0% so với kỳ trước</div>
                </div>
                <div className="relative w-28 h-28 rounded-full"""
content = re.sub(user_stats_pattern, user_stats_replacement, content, flags=re.DOTALL)

user_breakdown_pattern = r'<div className="space-y-3 flex-1">.*?</div>\n              </div>'
user_breakdown_replacement = """<div className="space-y-3 flex-1">
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
              </div>"""
content = re.sub(user_breakdown_pattern, user_breakdown_replacement, content, flags=re.DOTALL)

# 2. Fix Thông tin hệ thống
sys_info_pattern = r'<div className="space-y-5">.*?<div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 mt-4">'
sys_info_replacement = """<div className="space-y-5">
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
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 mt-4">"""
content = re.sub(sys_info_pattern, sys_info_replacement, content, flags=re.DOTALL)

# 3. Fix Hoạt động gần đây
recent_activity_pattern = r'<div className="space-y-4 flex-1">.*?</div>\n            </div>\n\n          </div>'
recent_activity_replacement = """<div className="space-y-4 flex-1">
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

          </div>"""
content = re.sub(recent_activity_pattern, recent_activity_replacement, content, flags=re.DOTALL)

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated bottom cards successfully.")
