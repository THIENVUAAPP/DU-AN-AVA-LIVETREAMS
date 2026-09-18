import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Radio, 
  RefreshCw, 
  Globe, 
  Layers, 
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

export default function MultiAccountManager() {
  const [activeTabPlatform, setActiveTabPlatform] = useState('facebook'); // 'facebook' | 'tiktok' | 'youtube' | 'shopee'

  // Connected Facebook Accounts & Fanpages
  const [fbAccounts, setFbAccounts] = useState([]);

  // Connected TikTok Accounts
  const [tiktokAccounts, setTiktokAccounts] = useState([]);

  // Connected YouTube Channels
  const [youtubeChannels, setYoutubeChannels] = useState([]);

  // Connected Shopee Live Stores
  const [shopeeStores, setShopeeStores] = useState([]);

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
  };

  const togglePageConnection = (accId, pageId) => {
    setFbAccounts(fbAccounts.map(acc => {
      if (acc.id === accId) {
        return {
          ...acc,
          pages: acc.pages.map(p => p.id === pageId ? { ...p, connected: !p.connected } : p)
        };
      }
      return acc;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border-l-4 border-l-[#3B82F6]">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            🔗 Quản Lý Kết Nối Nhiều Tài Khoản & Nhiều Trang Fanpage
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Kết nối 1-chạm không giới hạn các Trang Facebook Fanpage, Tài khoản FB Cá Nhân, TikTok Shop, Kênh YouTube & Shopee Live.
          </p>
        </div>

        <button 
          onClick={() => handleAddNewAccount(activeTabPlatform.toUpperCase())}
          className="px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl shadow-glow-blue transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> KẾT NỐI THÊM PAGE / TÀI KHOẢN
        </button>
      </div>

            {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1C22] p-8 rounded-2xl border border-white/10 flex flex-col items-center max-w-sm w-full shadow-2xl">
            <RefreshCw className="w-12 h-12 text-[#3B82F6] animate-spin mb-4" />
            <h3 className="text-white font-bold text-lg text-center mb-2">Đang kết nối {connectingPlatform}...</h3>
            <p className="text-gray-400 text-xs text-center">Hệ thống đang chuyển hướng sang trang xác thực OAuth an toàn. Vui lòng không đóng cửa sổ này.</p>
          </div>
        </div>
      )}
      
      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 bg-[#121216] p-1.5 rounded-xl border border-white/10 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTabPlatform('facebook')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTabPlatform === 'facebook' ? 'bg-[#3B82F6] text-white shadow-glow-blue' : 'text-gray-400 hover:text-white'
          }`}
        >
          📘 FACEBOOK (PAGE & PROFILE)
        </button>

        <button
          onClick={() => setActiveTabPlatform('tiktok')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTabPlatform === 'tiktok' ? 'bg-[#EF4444] text-white shadow-glow-red' : 'text-gray-400 hover:text-white'
          }`}
        >
          🎵 TIKTOK SHOP & CREATORS
        </button>

        <button
          onClick={() => setActiveTabPlatform('youtube')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTabPlatform === 'youtube' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          🔴 YOUTUBE CHANNELS
        </button>

        <button
          onClick={() => setActiveTabPlatform('shopee')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTabPlatform === 'shopee' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
          }`}
        >
          🟠 SHOPEE LIVE STORES
        </button>
      </div>

      {/* Facebook Section: Multi-Account & Multi-Page Manager */}
      {activeTabPlatform === 'facebook' && (
        <div className="space-y-4">
          {fbAccounts.map((acc) => (
            <div key={acc.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-black">
                    📘
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{acc.accountName}</h3>
                    <p className="text-[11px] text-gray-400 font-mono">Đã quản trị {acc.pages.length} Fanpage Bán Hàng</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  ĐÃ XÁC THỰC OAUTH
                </span>
              </div>

              {/* Fanpage List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {acc.pages.map((p) => (
                  <div 
                    key={p.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                      p.connected ? 'bg-[#3B82F6]/10 border-[#3B82F6]' : 'bg-[#121216] border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{p.followers}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-bold ${p.connected ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {p.connected ? '● SẴN SÀNG PHÁT LIVE' : '○ TẮT PHÁT SÓNG'}
                      </span>

                      <button
                        onClick={() => togglePageConnection(acc.id, p.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          p.connected ? 'bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white' : 'bg-[#3B82F6] text-white'
                        }`}
                      >
                        {p.connected ? 'TẮT KẾT NỐI' : 'KẾT NỐI LẠI'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TikTok Section */}
      {activeTabPlatform === 'tiktok' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              🎵 TÀI KHOẢN TIKTOK SHOP & CREATOR ĐÃ KẾT NỐI
            </h3>
            <span className="text-xs text-gray-400 font-mono">{tiktokAccounts.length} Tài khoản active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tiktokAccounts.map((tt) => (
              <div key={tt.id} className="p-4 rounded-xl bg-[#121216] border border-[#EF4444]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{tt.name}</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">LIVE READY</span>
                </div>
                <p className="text-[11px] text-gray-400">{tt.type}</p>
                <p className="text-[10px] text-gray-500 font-mono">Followers: {tt.followers}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YouTube Section */}
      {activeTabPlatform === 'youtube' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            🔴 KÊNH YOUTUBE ĐÃ KẾT NỐI PHÁT SÓNG
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {youtubeChannels.map((yt) => (
              <div key={yt.id} className="p-4 rounded-xl bg-[#121216] border border-red-600/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{yt.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">{yt.subs}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">1-CHẠM READY</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopee Live Section */}
      {activeTabPlatform === 'shopee' && (
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            🟠 GIAN HÀNG SHOPEE LIVE ĐÃ KẾT NỐI
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shopeeStores.map((sp) => (
              <div key={sp.id} className="p-4 rounded-xl bg-[#121216] border border-amber-500/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{sp.name}</h4>
                  <p className="text-[10px] text-amber-400 font-mono">Đánh giá: {sp.rating}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">1-CHẠM READY</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
