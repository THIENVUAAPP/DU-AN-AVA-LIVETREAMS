import re

with open('src/components/AdminDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variable
state_injection = """  const [activeSubTab, setActiveSubTab] = useState('users');

  // Stats State
  const [adminStats, setAdminStats] = useState({
    revenue: 0,
    users: 0,
    streams: 0,
    commission: 0,
    pendingWithdrawals: 0
  });
"""
content = content.replace("  const [activeSubTab, setActiveSubTab] = useState('users');", state_injection)

# 2. Replace hardcoded numbers in the grid
content = content.replace(
    '<span className="text-xl font-black text-[#EF4444]">45.960.000₫</span>',
    '<span className="text-xl font-black text-[#EF4444]">{adminStats.revenue.toLocaleString()}₫</span>'
)
content = content.replace(
    '<span className="text-xl font-black text-[#3B82F6]">1.280 Users</span>',
    '<span className="text-xl font-black text-[#3B82F6]">{adminStats.users} Users</span>'
)
content = content.replace(
    '<span className="text-xl font-black text-[#8B5CF6]">84 Streams</span>',
    '<span className="text-xl font-black text-[#8B5CF6]">{adminStats.streams} Streams</span>'
)
content = content.replace(
    '<span className="text-xl font-black text-amber-400">7.494.000₫</span>',
    '<span className="text-xl font-black text-amber-400">{adminStats.commission.toLocaleString()}₫</span>'
)
content = content.replace(
    '<p className="text-[10px] text-amber-400 font-mono">1 Yêu cầu chờ chuyển tiền</p>',
    '<p className="text-[10px] text-amber-400 font-mono">{adminStats.pendingWithdrawals} Yêu cầu chờ chuyển tiền</p>'
)

with open('src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("AdminDashboard updated!")
