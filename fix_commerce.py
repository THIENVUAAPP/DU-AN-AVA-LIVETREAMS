import re

with open('src/components/LiveCommerceStudio.jsx', 'r') as f:
    content = f.read()

empty_session = """  const [liveSessions, setLiveSessions] = useState([
    {
      id: 'session_empty',
      title: 'Phiên Live Trống (Vui lòng cấu hình)',
      platform: 'Chưa kết nối nền tảng',
      status: 'idle',
      viewers: '0',
      bannerText: 'SẴN SÀNG PHÁT LIVE - HÃY THÊM SẢN PHẨM VÀO GIỎ HÀNG!',
      countdown: '00:00',
      pinnedProductId: null,
      products: []
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session_empty');"""

content = re.sub(r'  const \[liveSessions, setLiveSessions\] = useState\(\[.*?\]\);\n\n  const \[activeSessionId, setActiveSessionId\] = useState\([^)]+\);', empty_session, content, flags=re.DOTALL)

empty_chat = """  const [chatMessages, setChatMessages] = useState([]);"""
content = re.sub(r'  const \[chatMessages, setChatMessages\] = useState\(\[.*?\]\);', empty_chat, content, flags=re.DOTALL)

with open('src/components/LiveCommerceStudio.jsx', 'w') as f:
    f.write(content)

