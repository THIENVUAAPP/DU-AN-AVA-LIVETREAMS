import re

with open('src/components/MultiAccountManager.jsx', 'r') as f:
    content = f.read()

# 1. Empty the arrays
content = re.sub(r'const \[fbAccounts, setFbAccounts\] = useState\(\[.*?\]\);', 'const [fbAccounts, setFbAccounts] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[tiktokAccounts, setTiktokAccounts\] = useState\(\[.*?\]\);', 'const [tiktokAccounts, setTiktokAccounts] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[youtubeChannels, setYoutubeChannels\] = useState\(\[.*?\]\);', 'const [youtubeChannels, setYoutubeChannels] = useState([]);', content, flags=re.DOTALL)
content = re.sub(r'const \[shopeeStores, setShopeeStores\] = useState\(\[.*?\]\);', 'const [shopeeStores, setShopeeStores] = useState([]);', content, flags=re.DOTALL)

# 2. Update handleAddNewAccount and add state for realistic flow
state_addition = """  const [shopeeStores, setShopeeStores] = useState([]);

  // Mock OAuth Connection Flow
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState('');

  const handleAddNewAccount = (platformName) => {
    setConnectingPlatform(platformName);
    setIsConnecting(true);
    
    // Simulate OAuth delay
    setTimeout(() => {
      setIsConnecting(false);
      const newId = Date.now();
      
      if (activeTabPlatform === 'facebook') {
        setFbAccounts([...fbAccounts, {
          id: newId,
          accountName: 'Tài khoản Facebook Mới',
          pages: [
            { id: 'p' + newId, name: 'Fanpage Bán Hàng Mới Kết Nối', followers: '0 Follows', connected: true }
          ]
        }]);
      } else if (activeTabPlatform === 'tiktok') {
        setTiktokAccounts([...tiktokAccounts, {
          id: newId, name: '@tiktok_new_channel', type: 'TikTok Shop Affiliate', followers: '0', connected: true
        }]);
      } else if (activeTabPlatform === 'youtube') {
        setYoutubeChannels([...youtubeChannels, {
          id: newId, name: 'Kênh YouTube Mới', subs: '0 Subs', connected: true
        }]);
      } else if (activeTabPlatform === 'shopee') {
        setShopeeStores([...shopeeStores, {
          id: newId, name: 'Shopee Shop Mới', rating: '5.0/5★', connected: true
        }]);
      }
      
      alert(`✅ Đã kết nối thành công tài khoản ${platformName} qua hệ thống API chính thức!`);
    }, 2000);
  };"""

content = re.sub(r'  const \[shopeeStores, setShopeeStores\] = useState\(\[\]\);\n\n  const togglePageConnection.*?handleAddNewAccount = \(platformName\) => \{\n    alert\(`Đã mở cửa sổ Đăng Nhập OAuth 1-Chạm cho \$\{platformName\}! Vui lòng cấp quyền quản trị Page / Tài khoản.`\);\n  \};', state_addition + "\n\n  const togglePageConnection = (accId, pageId) => {\n    setFbAccounts(fbAccounts.map(acc => {\n      if (acc.id === accId) {\n        return {\n          ...acc,\n          pages: acc.pages.map(p => p.id === pageId ? { ...p, connected: !p.connected } : p)\n        };\n      }\n      return acc;\n    }));\n  };", content, flags=re.DOTALL)

with open('src/components/MultiAccountManager.jsx', 'w') as f:
    f.write(content)

