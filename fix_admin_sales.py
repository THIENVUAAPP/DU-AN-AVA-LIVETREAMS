import re

with open('src/components/SalesAnalyticsManager.jsx', 'r') as f:
    content = f.read()

# Empty orders array
content = re.sub(r'const \[orders, setOrders\] = useState\(\[.*?\]\);', 'const [orders, setOrders] = useState([]);', content, flags=re.DOTALL)

with open('src/components/SalesAnalyticsManager.jsx', 'w') as f:
    f.write(content)

with open('src/components/AdminDashboard.jsx', 'r') as f:
    content2 = f.read()

# Empty Admin Dashboard arrays
content2 = re.sub(r'const \[users, setUsers\] = useState\(\[.*?\]\);', 'const [users, setUsers] = useState([]);', content2, flags=re.DOTALL)
content2 = re.sub(r'const \[sepayLogs, setSepayLogs\] = useState\(\[.*?\]\);', 'const [sepayLogs, setSepayLogs] = useState([]);', content2, flags=re.DOTALL)
content2 = re.sub(r'const \[affiliatePayouts, setAffiliatePayouts\] = useState\(\[.*?\]\);', 'const [affiliatePayouts, setAffiliatePayouts] = useState([]);', content2, flags=re.DOTALL)

with open('src/components/AdminDashboard.jsx', 'w') as f:
    f.write(content2)

