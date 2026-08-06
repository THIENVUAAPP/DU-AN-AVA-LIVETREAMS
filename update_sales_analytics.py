import re

with open('src/components/SalesAnalyticsManager.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_analytics = """  // Per-Live Session Analytics Data
  const liveAnalytics = [
    {
      session: '⚡ Phiên Live 01: Flash Sale Đón Tết',
      channel: 'TikTok Shop & FB Fanpage',
      viewers: '12,450 lượt xem',
      ordersCount: 86,
      revenue: '128.490.000₫',
      paidRevenue: '105.500.000₫',
      codRevenue: '22.990.000₫',
      topProduct: 'Áo Khoác Chống Nước AvaLive Pro'
    },
    {
      session: '💄 Phiên Live 02: Mỹ Phẩm Skincare Hàn Quốc',
      channel: 'Shopee Live & Instagram',
      viewers: '8,120 lượt xem',
      ordersCount: 54,
      revenue: '48.060.000₫',
      paidRevenue: '42.000.000₫',
      codRevenue: '6.060.000₫',
      topProduct: 'Bộ Serum Skincare Luxe 5in1'
    },
    {
      session: '🏡 Phiên Live 03: Đồ Gia Dụng Smart Home',
      channel: 'YouTube 4K Channel',
      viewers: '5,900 lượt xem',
      ordersCount: 32,
      revenue: '79.680.000₫',
      paidRevenue: '79.680.000₫',
      codRevenue: '0₫',
      topProduct: 'Nồi Chiên Không Dầu SmartCook 12L'
    }
  ];"""

new_analytics = """  // Per-Live Session Analytics Data State
  const [liveAnalytics, setLiveAnalytics] = useState([
    {
      session: '⚡ Phiên Live 01: Flash Sale Đón Tết',
      channel: 'TikTok Shop & FB Fanpage',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    },
    {
      session: '💄 Phiên Live 02: Mỹ Phẩm Skincare Hàn Quốc',
      channel: 'Shopee Live & Instagram',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    },
    {
      session: '🏡 Phiên Live 03: Đồ Gia Dụng Smart Home',
      channel: 'YouTube 4K Channel',
      viewers: 0,
      ordersCount: 0,
      revenue: 0,
      paidRevenue: 0,
      codRevenue: 0,
      topProduct: 'Chưa có dữ liệu'
    }
  ]);"""

content = content.replace(old_analytics, new_analytics)

# Also need to replace how it renders them since they were strings and now they are numbers
content = content.replace('{session.viewers}', '{session.viewers.toLocaleString()} lượt xem')
content = content.replace('{session.ordersCount} Đơn Thành Công', '{session.ordersCount} Đơn Thành Công') # already numbers in old code? No, ordersCount was a number 86.
content = content.replace('{session.revenue}', '{session.revenue.toLocaleString()}₫')
content = content.replace('{session.paidRevenue}', '{session.paidRevenue.toLocaleString()}₫')
content = content.replace('{session.codRevenue}', '{session.codRevenue.toLocaleString()}₫')

with open('src/components/SalesAnalyticsManager.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("SalesAnalyticsManager updated!")
