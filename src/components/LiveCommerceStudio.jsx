import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Globe, 
  Bot, 
  Video, 
  RefreshCw, 
  Send, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  DollarSign, 
  ShieldCheck,
  UserCheck,
  Mic,
  Upload,
  PhoneCall,
  Volume2,
  Plus,
  Tag,
  Flame,
  Zap,
  Layers,
  Sliders,
  Edit3,
  Trash2,
  Share2,
  TrendingUp,
  Clock,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  X,
  Play,
  Pause,
  Copy,
  MessageSquare,
  Package
} from 'lucide-react';

export default function LiveCommerceStudio({ isLive }) {
  // Independent Live Sessions State (Nhiều phiên live khác nhau độc lập)
  const [liveSessions, setLiveSessions] = useState([
    {
      id: 'session_1',
      title: '⚡ Phiên Live 01: Flash Sale Đón Tết (Kênh TikTok & FB)',
      platform: 'TikTok Shop & FB Fanpage',
      status: 'active',
      viewers: '5,420',
      bannerText: '🔥 MÃ GIẢM GIÁ 50% + FREESHIP TOÀN QUỐC DUY NHẤT TRÊN LIVE!',
      countdown: '14:59',
      pinnedProductId: 1,
      products: [
        { 
          id: 1, 
          name: 'Áo Khoác Chống Nước AvaLive Pro', 
          price: '1.490.000₫', 
          oldPrice: '2.500.000₫',
          stock: 42,
          sync: 'TikTok Shop & FB Fanpage',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80',
          badge: 'TOP 1 SELLER'
        },
        { 
          id: 2, 
          name: 'Tai Nghe Chống Ồn AI AvaTwin 2026', 
          price: '2.990.000₫', 
          oldPrice: '4.200.000₫',
          stock: 18,
          sync: 'Shopee Live Mall',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
          badge: 'HOT DEAL'
        },
        { 
          id: 3, 
          name: 'Đồng Hồ Thông Minh Quantum Pro', 
          price: '4.990.000₫', 
          oldPrice: '6.800.000₫',
          stock: 9,
          sync: 'TikTok + Shopee + FB',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          badge: 'LIMITED EDITION'
        }
      ]
    },
    {
      id: 'session_2',
      title: '💄 Phiên Live 02: Mỹ Phẩm Skincare Hàn Quốc (Shopee & IG)',
      platform: 'Shopee Live & Instagram',
      status: 'idle',
      viewers: '2,180',
      bannerText: '💄 SẮM BỘ KEM DƯỠNG SKINCARE HÀN QUỐC TẶNG VOUCHER 200K!',
      countdown: '29:59',
      pinnedProductId: 4,
      products: [
        { 
          id: 4, 
          name: 'Bộ Serum Skincare Hàn Quốc Luxe 5in1', 
          price: '890.000₫', 
          oldPrice: '1.600.000₫',
          stock: 65,
          sync: 'Shopee Live & Instagram',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
          badge: 'BEST K-BEAUTY'
        },
        { 
          id: 5, 
          name: 'Son Kem Mịn Mượt Velvet Rose 2026', 
          price: '350.000₫', 
          oldPrice: '650.000₫',
          stock: 120,
          sync: 'Shopee Mall',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
          badge: 'TRENDING'
        }
      ]
    }
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session_1');
  const activeSession = liveSessions.find(s => s.id === activeSessionId) || liveSessions[0];

  // Active Pinned Product ID
  const [pinnedProductId, setPinnedProductId] = useState(1);
  const pinnedProduct = activeSession.products.find(p => p.id === pinnedProductId) || activeSession.products[0];

  // Banner & Countdown State
  const [adBannerText, setAdBannerText] = useState(activeSession.bannerText);
  const [flashSaleCountdown, setFlashSaleCountdown] = useState(activeSession.countdown);

  // AI Assistant Config State
  const [consultantName, setConsultantName] = useState('Trần Quốc Thiên - Expert');
  const [selectedLang, setSelectedLang] = useState('vi');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  // Target Channel & Target Product Selector for Reply Box
  const [replyTargetPlatform, setReplyTargetPlatform] = useState('🎵 TikTok Shop');
  const [replyTargetProduct, setReplyTargetProduct] = useState(pinnedProduct ? pinnedProduct.name : 'Áo Khoác Chống Nước AvaLive Pro');

  // Product Add / Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  
  const [prodFormName, setProdFormName] = useState('');
  const [prodFormPrice, setProdFormPrice] = useState('');
  const [prodFormOldPrice, setProdFormOldPrice] = useState('');
  const [prodFormStock, setProdFormStock] = useState('50');
  const [prodFormSync, setProdFormSync] = useState('TikTok Shop & FB Fanpage');
  const [prodFormImage, setProdFormImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80');
  const [prodFormBadge, setProdFormBadge] = useState('HOT DEAL');

  // Add Session Modal State
  const [addSessionModalOpen, setAddSessionModalOpen] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [newSessionPlatform, setNewSessionPlatform] = useState('TikTok Shop & FB Fanpage');

  // Live Chat Comments Stream State (CLEAR PLATFORM + CLEAR PRODUCT CONTEXT)
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      user: 'Hùng Trần', 
      platform: '🎵 TikTok Shop', 
      productName: 'Áo Khoác Chống Nước AvaLive Pro', 
      text: 'Đã đặt mua 1 áo khoác size L nhé shop!', 
      time: '14:50', 
      isAi: false 
    },
    { 
      id: 2, 
      user: 'Thu Hà', 
      platform: '📘 FB Fanpage VIP 01', 
      productName: 'Tai Nghe Chống Ồn AI AvaTwin 2026', 
      text: 'Sản phẩm này có sẵn hàng giao ngay không ạ?', 
      time: '14:51', 
      isAi: false 
    },
    { 
      id: 3, 
      user: 'Khách Xem Live', 
      platform: '🛍️ Shopee Live Mall', 
      productName: 'Tai Nghe Chống Ồn AI AvaTwin 2026', 
      text: 'Tai nghe chống ồn bảo hành bao lâu vậy MC ơi?', 
      time: '14:52', 
      isAi: false 
    },
    { 
      id: 4, 
      user: 'Trần Quốc Thiên - Expert', 
      platform: '⚡ ĐỒNG BỘ 5 KÊNH', 
      productName: 'Tai Nghe Chống Ồn AI AvaTwin 2026', 
      text: 'Chào bạn! Tai nghe AI AvaTwin 2026 bảo hành 2 năm chính hãng 1 đổi 1. Hôm nay đang có voucher giảm 50% chỉ còn 2.990.000₫, bạn bấm vào giỏ hàng dưới màn hình MUA NGAY kẻo hết suất ưu đãi nhé!', 
      time: '14:52', 
      isAi: true 
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const languages = [
    { code: 'vi', name: 'Tiếng Việt (Giọng Clone Thật)', flag: '🇻🇳' },
    { code: 'en', name: 'Tiếng Anh (US Native)', flag: '🇺🇸' },
    { code: 'ja', name: 'Tiếng Nhật (Tokyo Accent)', flag: '🇯🇵' },
    { code: 'zh', name: 'Tiếng Trung (Mandarin)', flag: '🇨🇳' },
    { code: 'kr', name: 'Tiếng Hàn (Seoul Accent)', flag: '🇰🇷' },
  ];

  // Open Modal to Add Product
  const handleOpenAddProductModal = () => {
    setEditingProductId(null);
    setProdFormName('');
    setProdFormPrice('');
    setProdFormOldPrice('');
    setProdFormStock('50');
    setProdFormBadge('HOT DEAL');
    setProdFormImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80');
    setProductModalOpen(true);
  };

  // Open Modal to Edit Product
  const handleOpenEditProductModal = (e, prod) => {
    e.stopPropagation();
    setEditingProductId(prod.id);
    setProdFormName(prod.name);
    setProdFormPrice(prod.price);
    setProdFormOldPrice(prod.oldPrice);
    setProdFormStock(prod.stock.toString());
    setProdFormSync(prod.sync);
    setProdFormImage(prod.image);
    setProdFormBadge(prod.badge || 'HOT DEAL');
    setProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodFormName.trim() || !prodFormPrice.trim()) {
      alert("Vui lòng nhập tên sản phẩm và giá bán!");
      return;
    }

    if (editingProductId) {
      // EDIT EXISTING PRODUCT
      const updatedProducts = activeSession.products.map(p => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: prodFormName.trim(),
            price: prodFormPrice.trim(),
            oldPrice: prodFormOldPrice.trim() || p.oldPrice,
            stock: parseInt(prodFormStock) || p.stock,
            sync: prodFormSync,
            image: prodFormImage,
            badge: prodFormBadge
          };
        }
        return p;
      });

      setLiveSessions(liveSessions.map(s => s.id === activeSessionId ? { ...s, products: updatedProducts } : s));
      alert(`Đã cập nhật thông tin sản phẩm "${prodFormName}"!`);
    } else {
      // ADD NEW PRODUCT
      const newProd = {
        id: Date.now(),
        name: prodFormName.trim(),
        price: prodFormPrice.trim(),
        oldPrice: prodFormOldPrice.trim() || (parseFloat(prodFormPrice) * 1.5) + '₫',
        stock: parseInt(prodFormStock) || 50,
        sync: prodFormSync,
        image: prodFormImage,
        badge: prodFormBadge
      };

      const updatedProducts = [newProd, ...activeSession.products];
      setLiveSessions(liveSessions.map(s => s.id === activeSessionId ? { ...s, products: updatedProducts } : s));
      setPinnedProductId(newProd.id);
      alert(`Đã thêm sản phẩm mới "${newProd.name}" vào phiên live!`);
    }

    setProductModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (e, prodId) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi phiên live?")) {
      const updatedProducts = activeSession.products.filter(p => p.id !== prodId);
      setLiveSessions(liveSessions.map(s => s.id === activeSessionId ? { ...s, products: updatedProducts } : s));
      if (pinnedProductId === prodId && updatedProducts.length > 0) {
        setPinnedProductId(updatedProducts[0].id);
      }
    }
  };

  // Create New Independent Live Session
  const handleCreateNewSession = () => {
    if (!newSessionTitle.trim()) {
      alert("Vui lòng nhập tên phiên livestream mới!");
      return;
    }

    const newSession = {
      id: `session_${Date.now()}`,
      title: newSessionTitle.trim(),
      platform: newSessionPlatform,
      status: 'idle',
      viewers: '1,000',
      bannerText: '🔥 SỰ KIỆN LIVESTREAM BÁN HÀNG — GIẢM GIÁ KHỦNG HÔM NAY!',
      countdown: '15:00',
      pinnedProductId: Date.now() + 1,
      products: [
        { 
          id: Date.now() + 1, 
          name: 'Sản Phẩm Mẫu 01', 
          price: '990.000₫', 
          oldPrice: '1.500.000₫',
          stock: 50,
          sync: newSessionPlatform,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
          badge: 'HOT DEAL'
        }
      ]
    };

    setLiveSessions([newSession, ...liveSessions]);
    setActiveSessionId(newSession.id);
    setAddSessionModalOpen(false);
    setNewSessionTitle('');
    alert(`Đã tạo thành công Phiên Live độc lập mới: "${newSession.title}"!`);
  };

  // Delete Current Live Session
  const handleDeleteSession = (sessionId) => {
    if (liveSessions.length <= 1) {
      alert("Không thể xóa phiên live duy nhất!");
      return;
    }
    if (window.confirm("Bạn có chắc muốn xóa phiên livestream độc lập này?")) {
      const remaining = liveSessions.filter(s => s.id !== sessionId);
      setLiveSessions(remaining);
      setActiveSessionId(remaining[0].id);
    }
  };

  // Update Live Banner Announcement
  const handleUpdateAdBanner = () => {
    setLiveSessions(liveSessions.map(s => s.id === activeSessionId ? { ...s, bannerText: adBannerText } : s));
    alert("Đã cập nhật bảng chữ chạy quảng cáo Flash Sale trên luồng Live!");
  };

  // Send Manual Comment Reply
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: consultantName,
      platform: replyTargetPlatform,
      productName: replyTargetProduct,
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true
    };

    setChatMessages([...chatMessages, newMsg]);
    setInputMsg('');
  };

  // Multi-Channel Cart Sync Trigger
  const handleSyncAllChannels = () => {
    alert("🔄 ĐÃ ĐỒNG BỘ GIỎ HÀNG THÀNH CÔNG CHO 5 KÊNH: TikTok Shop, FB Fanpage, Shopee Live, Lazada & WooCommerce!");
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Main Studio Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] text-xs font-black mb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> HỆ THỐNG QUẢN LÝ LIVESTREAM BÁN HÀNG ĐỘT PHÁ
          </div>
          <h2 className="text-2xl font-black text-white">Trình Quản Lý Giỏ Hàng & Setup Quảng Cáo Live 1-Chạm</h2>
          <p className="text-xs text-gray-400 mt-1">Ghim sản phẩm linh hoạt, tự động chốt đơn AI, đồng bộ giỏ hàng TikTok, FB, Shopee & lồng tiếng đa ngôn ngữ.</p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddProductModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs shadow-glow-red transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM SẢN PHẨM MỚI</span>
          </button>

          <button
            onClick={handleSyncAllChannels}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-black text-xs shadow-glow-purple hover:opacity-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>🔄 ĐỒNG BỘ GIỎ HÀNG 5 KÊNH</span>
          </button>
        </div>
      </div>

      {/* INDEPENDENT LIVE SESSIONS SWITCHER BAR */}
      <div className="glass-panel p-4 rounded-3xl border border-white/15 bg-black/60 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <span className="text-xs font-black text-white flex items-center gap-1.5 whitespace-nowrap">
            <Layers className="w-4 h-4 text-amber-400" /> CÁC PHIÊN LIVE ĐỘC LẬP:
          </span>

          {liveSessions.map((session) => {
            const isCurrent = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSessionId(session.id);
                  setAdBannerText(session.bannerText);
                  setFlashSaleCountdown(session.countdown);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white border-transparent shadow-glow-red scale-105'
                    : 'bg-[#121216] text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{session.title.split(':')[0]}</span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddSessionModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>TẠO PHIÊN LIVE MỚI</span>
          </button>

          {liveSessions.length > 1 && (
            <button
              onClick={() => handleDeleteSession(activeSessionId)}
              className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-all cursor-pointer"
              title="Xóa phiên live này"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* FLASH SALE ADVERTISING BANNER SETUP & COUNTDOWN */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 bg-gradient-to-r from-red-950/20 via-[#121218] to-purple-950/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="text-xs font-black text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500 animate-bounce" />
            SETUP QUẢNG CÁO & BẢNG ĐIỆN FLASH SALE ON LIVE:
          </label>
          <div className="flex items-center gap-2 text-xs font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400 font-bold">COUNTDOWN:</span>
            <input 
              type="text" 
              value={flashSaleCountdown}
              onChange={(e) => setFlashSaleCountdown(e.target.value)}
              className="w-16 bg-black border border-amber-500/40 rounded-lg px-2 py-1 text-amber-400 font-bold text-center text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input 
            type="text" 
            value={adBannerText}
            onChange={(e) => setAdBannerText(e.target.value)}
            className="flex-1 bg-[#0A0A0A] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#EF4444]"
            placeholder="Nhập nội dung bảng chữ chạy quảng cáo Flash Sale trên màn hình..."
          />
          <button 
            onClick={handleUpdateAdBanner}
            className="px-5 py-3 rounded-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs shadow-glow-blue transition-all cursor-pointer whitespace-nowrap"
          >
            CẬP NHẬT LIVE
          </button>
        </div>
      </div>

      {/* MAIN LIVE COMMERCE CONTROL STAGE (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pinned Product Stage & Product List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* REAL-TIME PINNED DEAL CARD */}
          {pinnedProduct && (
            <div className="glass-panel p-6 rounded-3xl border border-[#EF4444]/50 bg-gradient-to-br from-[#EF4444]/15 via-[#121218] to-black space-y-4 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red animate-pulse">
                  <Zap className="w-3.5 h-3.5" /> ĐANG GHIM BÁN THỜI GIAN THỰC TRÊN STREAM
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">TỒN KHO LIVE: {pinnedProduct.stock} SP</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black flex-shrink-0 border border-white/20">
                  <img src={pinnedProduct.image} alt={pinnedProduct.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{pinnedProduct.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-purple-600 text-white">
                      {pinnedProduct.badge}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-[#EF4444] font-mono">{pinnedProduct.price}</span>
                    <span className="text-xs text-gray-500 line-through font-mono">{pinnedProduct.oldPrice}</span>
                  </div>

                  <p className="text-xs text-gray-400 font-mono">Đồng bộ Kênh: {pinnedProduct.sync}</p>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => alert(`🔥 ĐÃ ĐẨY DEAL HOT GIẢM 50% CHO SẢN PHẨM "${pinnedProduct.name}" TRÊN STREAM!`)}
                    className="px-6 py-3 rounded-2xl bg-[#EF4444] hover:bg-red-600 text-white font-black text-xs shadow-glow-red transition-all cursor-pointer whitespace-nowrap"
                  >
                    GHIM DEAL HOT NGAY
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS INVENTORY LIST */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                DANH SÁCH GIỎ HÀNG SẢN PHẨM SẴN SÀNG LIVE ({activeSession.products.length} SP)
              </h3>

              <button
                onClick={handleOpenAddProductModal}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>THÊM SP</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeSession.products.map((prod) => {
                const isPinned = prod.id === pinnedProductId;
                return (
                  <div
                    key={prod.id}
                    className={`glass-panel p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      isPinned 
                        ? 'border-[#EF4444] bg-[#EF4444]/10 shadow-glow-red' 
                        : 'border-white/10 bg-[#121218] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-white/20 flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{prod.name}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-black/60 text-purple-300 border border-purple-500/30">
                            {prod.badge}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5 text-xs font-mono">
                          <span className="text-[#EF4444] font-bold">{prod.price}</span>
                          <span className="text-gray-500 line-through text-[10px]">{prod.oldPrice}</span>
                          <span className="text-gray-400 text-[10px]"> Kho: {prod.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPinnedProductId(prod.id);
                          setReplyTargetProduct(prod.name);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isPinned
                            ? 'bg-[#EF4444] text-white shadow-glow-red'
                            : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/15'
                        }`}
                      >
                        {isPinned ? '📌 ĐANG GHIM LIVE' : '📌 GHIM SẢN PHẨM NÀY'}
                      </button>

                      <button
                        onClick={(e) => handleOpenEditProductModal(e, prod)}
                        className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-all cursor-pointer"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteProduct(e, prod.id)}
                        className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-all cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Sales Consultant & Auto Order Closing Chat */}
        <div className="space-y-6">
          
          {/* AI SALES CONSULTANT CONFIG BOX */}
          <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4 bg-black/60">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" /> CHUYÊN VIÊN TƯ VẤN AI TRẢ LỜI TỰ ĐỘNG
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">TÊN CHUYÊN VIÊN NÓI CHUYỆN THẦN THÁNH:</label>
                <input 
                  type="text" 
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">NGÔN NGỮ TỰ ĐỘNG BÁN HÀNG & PHẢN HỒI KÊNH:</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-1.5 font-bold cursor-pointer transition-all ${
                        selectedLang === lang.code
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/10 bg-[#121216] text-gray-400'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Reply Order Toggle */}
              <div className="p-3 rounded-2xl bg-[#121218] border border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white block">Tự Động Chốt Đơn Khi Có SĐT:</span>
                  <span className="text-[10px] text-gray-400">Tự nhắn tin chốt đơn khi khán giả comment</span>
                </div>
                <button
                  onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                    autoReplyEnabled ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {autoReplyEnabled ? 'BẬT AI' : 'TẮT AI'}
                </button>
              </div>
            </div>
          </div>

          {/* REAL-TIME LIVE STREAM CHAT STREAM (CLEAR PLATFORM + CLEAR PRODUCT CONTEXT) */}
          <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-4 bg-black/60 flex flex-col h-[420px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-spin" />
                KHÁN GIẢ COMMENT REAL-TIME
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">● CHAT MULTI-CHANNEL ACTIVE</span>
            </div>

            {/* Comment Stream Area with CLEAR PLATFORM & CLEAR PRODUCT BADGES */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`p-3 rounded-2xl text-left space-y-1.5 ${
                    msg.isAi 
                      ? 'bg-purple-900/30 border border-purple-500/40 text-purple-200 ml-2' 
                      : 'bg-[#121216] border border-white/10 text-gray-200'
                  }`}
                >
                  {/* Badges Bar: Channel Source & Product Target */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-black/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <Share2 className="w-2.5 h-2.5 text-cyan-400" />
                      {msg.platform}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-black/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 truncate max-w-[170px]">
                      <Package className="w-2.5 h-2.5 text-amber-400" />
                      {msg.productName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-black text-white flex items-center gap-1">
                      {msg.isAi && <Bot className="w-3 h-3 text-purple-400" />}
                      {msg.user}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Manual Reply Bar with Target Channel & Product Selection */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold">
                <span className="flex items-center gap-1 text-purple-300">
                  <span>📍 Đang trả lời trên:</span>
                  <select 
                    value={replyTargetPlatform}
                    onChange={(e) => setReplyTargetPlatform(e.target.value)}
                    className="bg-black text-white border border-white/15 rounded-lg px-2 py-0.5 text-[10px] font-bold focus:outline-none"
                  >
                    <option value="🎵 TikTok Shop">🎵 TikTok Shop</option>
                    <option value="📘 FB Fanpage VIP 01">📘 FB Fanpage VIP 01</option>
                    <option value="🛍️ Shopee Live Mall">🛍️ Shopee Live Mall</option>
                    <option value="🔴 YouTube 4K">🔴 YouTube 4K</option>
                    <option value="⚡ ĐỒNG BỘ 5 KÊNH">⚡ Đồng bộ tất cả 5 kênh</option>
                  </select>
                </span>
              </div>

              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-[#0A0A0A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  placeholder="Nhập câu trả lời comment trực tiếp..."
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-all shadow-glow-purple"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      {/* MODAL THÊM / SỬA SẢN PHẨM FLEXIBLE */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#EF4444]" />
                {editingProductId ? 'CHỈNH SỬA SẢN PHẨM LIVESTREAM' : 'THÊM SẢN PHẨM MỚI VÀO GIỎ HÀNG'}
              </h3>
              <button type="button" onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">TÊN SẢN PHẨM BÁN LIVESTREAM:</label>
                <input 
                  type="text" 
                  value={prodFormName}
                  onChange={(e) => setProdFormName(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="Ví dụ: Áo Khoác Chống Nước AvaLive Pro..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">GIÁ BÁN GIẢM (DEAL):</label>
                  <input 
                    type="text" 
                    value={prodFormPrice}
                    onChange={(e) => setProdFormPrice(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                    placeholder="1.490.000₫"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">GIÁ GỐC NIÊM YẾT:</label>
                  <input 
                    type="text" 
                    value={prodFormOldPrice}
                    onChange={(e) => setProdFormOldPrice(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                    placeholder="2.500.000₫"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">SỐ LƯỢNG TỒN KHO LIVE:</label>
                  <input 
                    type="number" 
                    value={prodFormStock}
                    onChange={(e) => setProdFormStock(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 font-mono text-xs text-white focus:outline-none focus:border-[#EF4444]"
                    placeholder="50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-300 block">HUY HIỆU BADGE (TAG):</label>
                  <select
                    value={prodFormBadge}
                    onChange={(e) => setProdFormBadge(e.target.value)}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  >
                    <option value="TOP 1 SELLER">TOP 1 SELLER</option>
                    <option value="HOT DEAL">HOT DEAL</option>
                    <option value="LIMITED EDITION">LIMITED EDITION</option>
                    <option value="FLASH SALE">FLASH SALE</option>
                    <option value="MUA 1 TẶNG 1">MUA 1 TẶNG 1</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">KÊNH ĐỒNG BỘ GIỎ HÀNG:</label>
                <input 
                  type="text" 
                  value={prodFormSync}
                  onChange={(e) => setProdFormSync(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="TikTok Shop, FB Fanpage, Shopee Live..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">LINK HÌNH ẢNH SẢN PHẨM:</label>
                <input 
                  type="text" 
                  value={prodFormImage}
                  onChange={(e) => setProdFormImage(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#EF4444]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-xs rounded-xl shadow-glow-red hover:opacity-90 transition-all cursor-pointer"
              >
                {editingProductId ? 'LƯU CẬP NHẬT SẢN PHẨM' : 'XÁC NHẬN THÊM SẢN PHẨM'}
              </button>
              <button 
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-3 bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL TẠO PHIÊN LIVE ĐỘC LẬP MỚI */}
      {addSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-md w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                TẠO PHIÊN LIVESTREAM BÁN HÀNG ĐỘC LẬP MỚI
              </h3>
              <button onClick={() => setAddSessionModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">TÊN PHIÊN LIVESTREAM MỚI:</label>
                <input 
                  type="text" 
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="Ví dụ: Phiên Live 04: Siêu Deal Mẹ & Bé Gia Dụng..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-300 block">KÊNH ĐỔI LIVE CHÍNH:</label>
                <select
                  value={newSessionPlatform}
                  onChange={(e) => setNewSessionPlatform(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="TikTok Shop & FB Fanpage">TikTok Shop & FB Fanpage</option>
                  <option value="Shopee Live & Instagram">Shopee Live & Instagram</option>
                  <option value="YouTube 4K Channel">YouTube 4K Channel</option>
                  <option value="Đa kênh TikTok + FB + Shopee + YT">Đa kênh TikTok + FB + Shopee + YT</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={handleCreateNewSession}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white font-black text-xs rounded-xl shadow-glow-orange hover:opacity-90 transition-all cursor-pointer"
              >
                XÁC NHẬN TẠO PHIÊN LIVE
              </button>
              <button 
                onClick={() => setAddSessionModalOpen(false)}
                className="px-4 py-3 bg-white/10 text-gray-300 hover:text-white rounded-xl font-bold text-xs cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
