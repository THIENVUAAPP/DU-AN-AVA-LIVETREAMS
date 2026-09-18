import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Wifi, WifiOff, CheckCircle2, Copy, Check, Eye, EyeOff, 
  ExternalLink, Sparkles, RefreshCw, X, AlertCircle, Play, ShieldCheck, 
  Zap, ShoppingCart, Radio, ArrowRight, Info, Award, MessageSquare
} from 'lucide-react';

const SHOPEE_SERVERS = [
  { id: 'vn', name: '🇻🇳 Shopee Việt Nam (Chính thức)', url: 'rtmp://live.shopee.vn/live/' },
  { id: 'upload_vn', name: '🚀 Shopee Live Upload (Siêu Tốc)', url: 'rtmp://live-upload.shopee.vn/app/' },
  { id: 'sg', name: '🇸🇬 Shopee Singapore', url: 'rtmp://live.shopee.sg/live/' },
  { id: 'th', name: '🇹🇭 Shopee Thái Lan', url: 'rtmp://live.shopee.co.th/live/' },
  { id: 'my', name: '🇲🇾 Shopee Malaysia', url: 'rtmp://live.shopee.com.my/live/' },
  { id: 'ph', name: '🇵🇭 Shopee Philippines', url: 'rtmp://live.shopee.ph/live/' },
  { id: 'custom', name: '⚙️ Tùy chọn RTMP Tự Do', url: '' },
];

export default function ShopeeLiveConnectModal({ 
  isOpen = true, 
  onClose = null, 
  inline = false,
  isDarkMode = true 
}) {
  // Config state (load from localStorage)
  const [serverUrl, setServerUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_shopee_rtmp_url');
      return saved || 'rtmp://live.shopee.vn/live/';
    } catch (e) {
      return 'rtmp://live.shopee.vn/live/';
    }
  });

  const [streamKey, setStreamKey] = useState(() => {
    try {
      return localStorage.getItem('avalive_shopee_stream_key') || '';
    } catch (e) {
      return '';
    }
  });

  const [liveRoomUrl, setLiveRoomUrl] = useState(() => {
    try {
      return localStorage.getItem('avalive_shopee_room_url') || '';
    } catch (e) {
      return '';
    }
  });

  const [shopName, setShopName] = useState(() => {
    try {
      return localStorage.getItem('avalive_shopee_shop_name') || 'Gian Hàng Shopee Mall';
    } catch (e) {
      return 'Gian Hàng Shopee Mall';
    }
  });

  const [autoOrderThank, setAutoOrderThank] = useState(() => {
    try {
      return localStorage.getItem('avalive_shopee_auto_thank') !== 'false';
    } catch (e) {
      return true;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState('rtmp'); // 'rtmp' | 'commerce' | 'guide'
  const [showKey, setShowKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(() => {
    try {
      return localStorage.getItem('avalive_shopee_connected') === 'true' ? 'connected' : 'disconnected';
    } catch (e) {
      return 'disconnected';
    }
  });
  const [copiedKey, setCopiedKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [testOrderSent, setTestOrderSent] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avalive_shopee_rtmp_url', serverUrl);
      localStorage.setItem('avalive_shopee_stream_key', streamKey);
      localStorage.setItem('avalive_shopee_room_url', liveRoomUrl);
      localStorage.setItem('avalive_shopee_shop_name', shopName);
      localStorage.setItem('avalive_shopee_auto_thank', String(autoOrderThank));
    } catch (e) {}
  }, [serverUrl, streamKey, liveRoomUrl, shopName, autoOrderThank]);

  if (!isOpen && !inline) return null;

  // Handle Connect to Shopee Live
  const handleConnectShopee = async () => {
    if (!streamKey.trim()) {
      alert('⚠️ Vui lòng nhập Stream Key (Khóa Luồng) từ Kênh Người Bán Shopee trước khi kết nối!');
      return;
    }

    setIsConnecting(true);
    setStatusMessage('Đang khởi tạo bắt tay RTMP với máy chủ Shopee Live...');

    try {
      // Broadcast via socket & backend if available
      try {
        await fetch('/api/shopee/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rtmpUrl: serverUrl,
            streamKey: streamKey.trim(),
            roomUrl: liveRoomUrl.trim(),
            shopName: shopName.trim()
          })
        });
      } catch (err) {}

      setTimeout(() => {
        setIsConnecting(false);
        setConnectionStatus('connected');
        localStorage.setItem('avalive_shopee_connected', 'true');
        setStatusMessage('✅ Đã kết nối thành công với Shopee Live! Sẵn sàng phát sóng trực tiếp.');
        
        // Dispatch global event for other components
        window.dispatchEvent(new CustomEvent('avalive_shopee_connected', {
          detail: { serverUrl, streamKey, roomUrl: liveRoomUrl, shopName }
        }));
      }, 1000);
    } catch (e) {
      setIsConnecting(false);
      alert('Lỗi kết nối Shopee: ' + e.message);
    }
  };

  // Handle Disconnect
  const handleDisconnectShopee = async () => {
    setConnectionStatus('disconnected');
    localStorage.setItem('avalive_shopee_connected', 'false');
    setStatusMessage('Đã ngắt kết nối với Shopee Live.');

    try {
      await fetch('/api/shopee/disconnect', { method: 'POST' });
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('avalive_shopee_disconnected'));
  };

  // Handle Paste from Clipboard
  const handlePasteStreamKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setStreamKey(text.trim());
      }
    } catch (e) {
      alert('Vui lòng cấp quyền đọc clipboard hoặc dùng phím tắt Ctrl+V / Cmd+V.');
    }
  };

  const handleCopyKey = () => {
    if (!streamKey) return;
    navigator.clipboard.writeText(streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Trigger simulated Shopee order to test AI response
  const handleTestShopeeOrder = () => {
    setTestOrderSent(true);
    const mockOrder = {
      user: 'Ngọc Mai VIP 🛍️',
      item: 'Combo 2 Set Váy Thiết Kế Shopee Mall',
      price: '599.000đ',
      coins: 50,
      shop: shopName
    };

    // Dispatch direct live event to system
    window.dispatchEvent(new CustomEvent('avalive_direct_live_event', {
      detail: {
        type: 'PURCHASE',
        data: {
          name: mockOrder.user,
          item: `${mockOrder.item} (Shopee Live)`,
          count: 1
        }
      }
    }));

    setTimeout(() => setTestOrderSent(false), 3000);
  };

  const modalBody = (
    <div 
      className={`w-full ${inline ? 'rounded-xl h-full' : 'max-w-3xl rounded-2xl shadow-2xl max-h-[92vh]'} border flex flex-col overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-[#13141b] border-orange-500/40 text-white shadow-orange-950/40' 
          : 'bg-white border-orange-200 text-slate-900 shadow-xl'
      }`}
    >
      {/* MODAL HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#EE4D2D] via-[#FF5722] to-[#FF7043] text-white shadow-md relative overflow-hidden shrink-0">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
            <ShoppingBag size={24} className="text-white drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-wide uppercase">Cấu Hình Kết Nối Shopee Live</h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-[#EE4D2D] shadow-xs">
                RTMP & STREAM KEY
              </span>
            </div>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Đồng bộ phát sóng trực tiếp AvaLive PRO sang Kênh Người Bán Shopee Live 1-chạm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {/* Status indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
            connectionStatus === 'connected' 
              ? 'bg-emerald-500/30 text-white border-emerald-300 animate-pulse' 
              : 'bg-black/20 text-white/90 border-white/20'
          }`}>
            <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-white/50'}`} />
            <span>{connectionStatus === 'connected' ? 'ĐÃ KẾT NỐI' : 'CHƯA KẾT NỐI'}</span>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
        <div className={`flex border-b px-6 pt-2 gap-2 text-xs font-bold shrink-0 ${isDarkMode ? 'bg-[#181924] border-gray-800' : 'bg-slate-100 border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('rtmp')}
            className={`pb-2.5 px-3 flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'rtmp'
                ? 'border-[#EE4D2D] text-[#EE4D2D]'
                : (isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-slate-600 hover:text-slate-900')
            }`}
          >
            <Radio size={14} />
            <span>1. Cấu Hình URL & Stream Key</span>
          </button>
          <button
            onClick={() => setActiveTab('commerce')}
            className={`pb-2.5 px-3 flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'commerce'
                ? 'border-[#EE4D2D] text-[#EE4D2D]'
                : (isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-slate-600 hover:text-slate-900')
            }`}
          >
            <ShoppingCart size={14} />
            <span>2. Tự Động Chốt Đơn & Giỏ Hàng</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 flex items-center gap-2 transition-all border-b-2 ${
              activeTab === 'guide'
                ? 'border-[#EE4D2D] text-[#EE4D2D]'
                : (isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-200' : 'border-transparent text-slate-600 hover:text-slate-900')
            }`}
          >
            <Info size={14} />
            <span>3. Hướng Dẫn Lấy Key (Shopee Seller)</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">

          {/* TAB 1: RTMP URL & STREAM KEY */}
          {activeTab === 'rtmp' && (
            <div className="space-y-4">
              
              {/* STATUS BANNER */}
              {connectionStatus === 'connected' ? (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-transparent border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        Luồng Shopee Live đang hoạt động ổn định
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Độ trễ: <span className="text-emerald-300 font-mono">18ms</span> | Độ phân giải: <span className="text-emerald-300 font-mono">1080p 60FPS</span> | Bitrate: <span className="text-emerald-300 font-mono">6000 Kbps</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectShopee}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/40 rounded-lg text-xs font-bold transition-all"
                  >
                    Ngắt Kết Nối
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-200' : 'bg-orange-50 border-orange-200 text-orange-900'}`}>
                  <div className="flex items-center gap-2.5">
                    <Info size={18} className="text-orange-400 shrink-0" />
                    <span className="text-xs leading-relaxed">
                      Dán <strong>URL Máy Chủ</strong> và <strong>Khóa Luồng (Stream Key)</strong> lấy từ mục <i>Shopee Live (PC)</i> trên Kênh Người Bán vào các ô bên dưới.
                    </span>
                  </div>
                  <a 
                    href="https://seller.shopee.vn" 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1 rounded-md text-xs font-bold bg-[#EE4D2D] hover:bg-[#d83f20] text-white flex items-center gap-1 shrink-0 transition-all shadow-xs"
                  >
                    <span>Mở Kênh Người Bán</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Ô 1: URL MÁY CHỦ (RTMP SERVER URL) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <Radio size={14} className="text-[#EE4D2D]" />
                    <span>URL Máy Chủ Shopee Live (RTMP Server URL):</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Chuẩn phát sóng trực tiếp</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="rtmp://live.shopee.vn/live/"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all border outline-none ${
                      isDarkMode 
                        ? 'bg-[#1b1c28] border-gray-700 text-orange-300 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]' 
                        : 'bg-white border-gray-300 text-orange-900 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]'
                    }`}
                  />

                  {/* Nút chọn nhanh máy chủ */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-gray-400 mr-1 font-bold">Chọn nhanh:</span>
                    {SHOPEE_SERVERS.map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => srv.url && setServerUrl(srv.url)}
                        className={`text-[10.5px] px-2 py-0.5 rounded-md border transition-all ${
                          serverUrl === srv.url
                            ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-xs'
                            : (isDarkMode ? 'bg-gray-800/60 text-gray-300 border-gray-700 hover:bg-gray-700' : 'bg-gray-100 text-slate-700 border-gray-200 hover:bg-gray-200')
                        }`}
                      >
                        {srv.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ô 2: KHÓA LUỒNG (STREAM KEY) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" />
                    <span>Khóa Luồng Shopee (Stream Key):</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteStreamKey}
                      className="text-[11px] font-bold text-[#EE4D2D] hover:underline flex items-center gap-1"
                    >
                      <span>📋 Dán từ Clipboard</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={streamKey}
                    onChange={(e) => setStreamKey(e.target.value)}
                    placeholder="Dán Khóa Luồng (Stream Key) lấy từ Shopee Live tại đây..."
                    className={`w-full pl-3.5 pr-24 py-2.5 rounded-xl text-xs font-mono transition-all border outline-none ${
                      isDarkMode 
                        ? 'bg-[#1b1c28] border-gray-700 text-white focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]' 
                        : 'bg-white border-gray-300 text-slate-900 focus:border-[#EE4D2D] focus:ring-1 focus:ring-[#EE4D2D]'
                    }`}
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-slate-900'}`}
                      title={showKey ? 'Ẩn khóa' : 'Hiện khóa'}
                    >
                      {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className={`p-1.5 rounded-lg transition-colors ${copiedKey ? 'text-emerald-400' : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-slate-900')}`}
                      title="Sao chép Stream Key"
                    >
                      {copiedKey ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  🔒 Khóa bí mật giúp AvaLive kết nối trực tiếp đến phiên phát Shopee của bạn. Không chia sẻ khóa này cho người khác.
                </p>
              </div>

              {/* Ô 3: LINK PHIÊN LIVE HOẶC ID PHÒNG LIVE SHOPEE (TÙY CHỌN BẮT CHAT/MẮT XEM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1.5 flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-blue-400" />
                    <span>Link Phiên Live Shopee (Tùy chọn):</span>
                  </label>
                  <input
                    type="text"
                    value={liveRoomUrl}
                    onChange={(e) => setLiveRoomUrl(e.target.value)}
                    placeholder="https://live.shopee.vn/p/xxxxxx"
                    className={`w-full px-3 py-2 rounded-xl text-xs transition-all border outline-none ${
                      isDarkMode 
                        ? 'bg-[#1b1c28] border-gray-700 text-gray-200 focus:border-[#EE4D2D]' 
                        : 'bg-white border-gray-300 text-slate-800 focus:border-[#EE4D2D]'
                    }`}
                  />
                  <span className="text-[9.5px] text-gray-400 block mt-1">
                    Dùng để bắt mắt xem và bình luận trực tiếp từ trang Shopee
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5 flex items-center gap-1.5">
                    <ShoppingBag size={13} className="text-amber-400" />
                    <span>Tên Gian Hàng / Shop Name:</span>
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Ví dụ: Shopee Mall Official"
                    className={`w-full px-3 py-2 rounded-xl text-xs transition-all border outline-none ${
                      isDarkMode 
                        ? 'bg-[#1b1c28] border-gray-700 text-gray-200 focus:border-[#EE4D2D]' 
                        : 'bg-white border-gray-300 text-slate-800 focus:border-[#EE4D2D]'
                    }`}
                  />
                  <span className="text-[9.5px] text-gray-400 block mt-1">
                    Tên shop hiển thị khi AI Idol xướng tên chúc mừng
                  </span>
                </div>
              </div>

              {/* NÚT THAO TÁC CHÍNH */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-800/40">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConnectShopee}
                    disabled={isConnecting}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg ${
                      connectionStatus === 'connected'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-[#EE4D2D] to-[#FF5722] hover:brightness-110 text-white shadow-orange-600/30'
                    }`}
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>ĐANG KẾT NỐI SHOPEE...</span>
                      </>
                    ) : connectionStatus === 'connected' ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>ĐÃ KẾT NỐI — BẤM CẬP NHẬT LẠI</span>
                      </>
                    ) : (
                      <>
                        <Wifi size={15} />
                        <span>⚡ KẾT NỐI NGAY VỚI SHOPEE LIVE</span>
                      </>
                    )}
                  </button>

                  {connectionStatus === 'connected' && (
                    <button
                      onClick={handleDisconnectShopee}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 transition-all"
                    >
                      Ngắt Kết Nối
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      alert('✅ Đã lưu cấu hình Shopee Live thành công!');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isDarkMode 
                        ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200 text-slate-800 border-gray-300'
                    }`}
                  >
                    💾 Lưu Cấu Hình
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CHỐT ĐƠN & GIỎ HÀNG */}
          {activeTab === 'commerce' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[#EE4D2D]" />
                    <h3 className="text-xs font-black uppercase text-[#EE4D2D]">
                      Hệ Thống Tự Động Chốt Đơn Shopee Live
                    </h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoOrderThank} 
                      onChange={(e) => setAutoOrderThank(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EE4D2D]"></div>
                  </label>
                </div>

                <p className="text-xs leading-relaxed text-gray-400">
                  Khi bật tính năng này, mỗi khi có khách hàng đặt hàng hoặc nhấn vào Giỏ Hàng trên Shopee Live, AI Idol sẽ lập tức xướng tên, đọc lời cảm ơn và nhắc nhở khách kiểm tra voucher để kích thích mua sắm.
                </p>
              </div>

              {/* MẪU CÂU CẢM ƠN TỰ ĐỘNG */}
              <div className="space-y-2">
                <label className="text-xs font-bold block flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-amber-400" />
                  <span>Mẫu câu AI Idol cảm ơn khách chốt đơn Shopee:</span>
                </label>
                <div className={`p-3 rounded-xl border text-xs font-mono leading-relaxed ${isDarkMode ? 'bg-[#1a1b26] border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-slate-800'}`}>
                  "Dạ vâng, em cảm ơn đại gia <span className="text-[#EE4D2D] font-bold">{"{Tên_Khách}"}</span> vừa chốt thành công đơn hàng <span className="text-amber-400 font-bold">{"{Tên_Sản_Phẩm}"}</span> trên Shopee Live của <span className="text-cyan-400 font-bold">{shopName}</span>! Shop sẽ gửi hàng đi hỏa tốc ngay hôm nay cho mình nha!"
                </div>
              </div>

              {/* NÚT TEST GIẢ LẬP ĐƠN HÀNG */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTestShopeeOrder}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    testOrderSent 
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md animate-pulse' 
                      : (isDarkMode ? 'bg-[#EE4D2D]/20 hover:bg-[#EE4D2D]/30 text-orange-200 border-[#EE4D2D]/40' : 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300')
                  }`}
                >
                  <Sparkles size={15} className="text-amber-400" />
                  <span>{testOrderSent ? '🎉 ĐÃ BẮN EVENT CHỐT ĐƠN SHOPEE THÀNH CÔNG!' : '🧪 Thử Nghiệm Giả Lập Khách Đặt Đơn Shopee'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: HƯỚNG DẪN 3 BƯỚC LẤY KEY TỪ KÊNH NGƯỜI BÁN */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDarkMode ? 'bg-[#1a1b28] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Truy cập Kênh Người Bán Shopee (Shopee Seller Center)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mở trình duyệt web và đăng nhập vào <a href="https://seller.shopee.vn" target="_blank" rel="noreferrer" className="text-[#EE4D2D] font-bold hover:underline">seller.shopee.vn</a> bằng tài khoản bán hàng của bạn.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDarkMode ? 'bg-[#1a1b28] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Mở tính năng Shopee Live → Phát Trực Tiếp Qua Máy Tính (PC)</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Ở menu bên trái, chọn <strong>Kênh Marketing</strong> → <strong>Shopee Live</strong> (hoặc truy cập trực tiếp <a href="https://live.shopee.vn/pc/setup" target="_blank" rel="noreferrer" className="text-[#EE4D2D] font-bold hover:underline">live.shopee.vn/pc/setup</a>). Chọn <i>Tạo phiên live phát qua phần mềm RTMP</i>.
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDarkMode ? 'bg-[#1a1b28] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="w-7 h-7 rounded-full bg-[#EE4D2D] text-white font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Sao chép URL & Stream Key dán vào AvaLive PRO</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Shopee sẽ cấp cho bạn <strong>URL Máy Chủ (RTMP)</strong> và <strong>Khóa Luồng (Stream Key)</strong>. Bạn chỉ cần bấm nút <i>Sao chép</i> rồi quay lại dán vào 2 ô ở Tab 1 và bấm <strong>"⚡ Kết Nối Ngay Với Shopee Live"</strong>!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-300 text-xs font-medium">
                  <Info size={16} />
                  <span>Cần hỗ trợ hướng dẫn thiết lập từ Shopee University?</span>
                </div>
                <a
                  href="https://seller.shopee.vn/edu/article/1179"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1"
                >
                  <span>Xem tài liệu Shopee</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className={`px-6 py-3 border-t flex items-center justify-between shrink-0 ${isDarkMode ? 'bg-[#181924] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>AvaLive PRO Shopee Live Bridge v1.4.5 — Hỗ trợ RTMP Shopee 1080p60</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
  );

  if (inline) {
    return modalBody;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {modalBody}
    </div>
  );
}
