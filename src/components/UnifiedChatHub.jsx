import React, { useState, useEffect } from 'react';
import { simulatedCustomers, simulatedAvatars, simulatedQuestions } from '../lib/aiSimulationData';

import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Filter, 
  ShoppingCart, 
  CheckCircle2, 
  User, 
  Radio, 
  Zap, 
  Bot, 
  Search, 
  Tag, 
  DollarSign, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Volume2,
  RefreshCw,
  Database,
  Image as ImageIcon,
  CheckSquare,
  Pin,
  ShoppingBag,
  Gift,
  Info,
  Store,
  HelpCircle,
  Edit,
  Trash2,
  PlusCircle,
  X
} from 'lucide-react';

export default function UnifiedChatHub({ isLive }) {

  const handleAiSuggestAnswer = (comment) => {
    if (!comment || !comment.text) return;
    
    const textL = comment.text.toLowerCase();
    let aiAnswer = '';
    
    // AI Intent Detection & Sales Scripting (Chốt sale, Xử lý từ chối)
    if (textL.includes('đắt') || textL.includes('cao') || textL.includes('giảm giá không')) {
       // Xử lý từ chối về giá (Objection Handling)
       aiAnswer = `Dạ shop chào chị ${comment.user}! Dạ mức giá này là hoàn toàn xứng đáng với chất lượng sản phẩm nhập khẩu trực tiếp ạ. Tuy nhiên trên Live hôm nay, shop đang tặng kèm Voucher freeship và quà tặng độc quyền. Chị an tâm chốt đơn nha!`;
    } else if (textL.includes('chất lượng') || textL.includes('tốt không') || textL.includes('bảo hành')) {
       // Xử lý nghi ngờ chất lượng
       aiAnswer = `Dạ chị ${comment.user} cứ yên tâm tuyệt đối ạ, hàng bên em cam kết chính hãng 100%, bảo hành 12 tháng 1 đổi 1. Chị nhắn tin SĐT để em lên đơn giữ ưu đãi nhé!`;
    } else if (textL.includes('size') || textL.includes('kích thước') || textL.includes('màu')) {
       // Tư vấn thông tin
       aiAnswer = `Dạ mẫu ${comment.productSuggested || 'này'} bên em đang đủ màu đủ size ạ. Chị cao nặng bao nhiêu để AI bên em tư vấn size chuẩn xác nhất nhé?`;
    } else if (textL.includes('chốt') || textL.includes('lấy') || textL.includes('mua') || textL.includes('sđt') || textL.includes('09')) {
       // Chốt sale (Closing)
       aiAnswer = `✅ Dạ em đã nhận thông tin chốt đơn của chị ${comment.user}. Hệ thống đã tự động lưu mã ưu đãi. Chị kiểm tra tin nhắn chờ để shop gửi xác nhận đơn hàng nha!`;
    } else {
       // Chăm sóc chung (General CSKH)
       aiAnswer = `Dạ shop chào chị ${comment.user}! Mẫu ${comment.productSuggested || 'hot hit'} bên em đang có ưu đãi độc quyền trên phiên live này. Chị ưng ý thì chốt đơn để lại SĐT ngay để không bỏ lỡ deal hời nha!`;
    }
    
    setReplyInput(aiAnswer);
  };

  const [activePlatformFilter, setActivePlatformFilter] = useState('all'); // 'all' | 'tiktok' | 'facebook' | 'youtube' | 'shopee'
  const [intentFilter, setIntentFilter] = useState('all');
  const [messageType, setMessageType] = useState('all'); // 'all' | 'buy' | 'question' | 'vip'
  const [replyInput, setReplyInput] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [autoAiReplyEnabled, setAutoAiReplyEnabled] = useState(true);

  const [customSimulateInput, setCustomSimulateInput] = useState("");
  const [simulatedAiLogs, setSimulatedAiLogs] = useState([]);
  const [showAiConfig, setShowAiConfig] = useState(false);

  const [aiConfigTab, setAiConfigTab] = useState('products'); // products | business | questions
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'AVA Fashion Official',
    phone: '0988.123.456',
    address: '123 Đường Số 1, Quận 1, TP.HCM',
    policy: 'Freeship đơn từ 500k. Lỗi 1 đổi 1 trong 7 ngày.'
  });

  const [aiProducts, setAiProducts] = useState([]);
  
  const [pinnedProductId, setPinnedProductId] = useState(2);
  const [cartItems, setCartItems] = useState([]); // array of product IDs

  
  const [customQuestions, setCustomQuestions] = useState(simulatedQuestions);





  const handleSimulateCustomComment = (e) => {
    e.preventDefault();
    if (!customSimulateInput.trim()) return;

    const isBuy = customSimulateInput.includes("chốt") || customSimulateInput.includes("CHỐT") || customSimulateInput.includes("SĐT") || customSimulateInput.includes("09");

    const newSim = {
      id: "sim_manual_" + Date.now(),
      platform: "tiktok",
      platformIcon: "🎵",
      platformName: "TikTok Live Pro",
      user: "Khách Hàng Thử Nghệ (Test User)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      time: "Vừa xong",
      text: customSimulateInput,
      intent: isBuy ? "buy" : "question",
      intentLabel: isBuy ? "🔥 CHỐT ĐƠN TỰ ĐỘNG" : "❓ Hỏi Tư Vấn",
      intentColor: isBuy ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-black" : "text-amber-400 border-amber-500/40 bg-amber-500/10",
      productSuggested: "Sản Phẩm Live Premium",
      price: "599.000đ",
      isClosedOrder: isBuy,
      aiReply: autoAiReplyEnabled ? {
        text: isBuy 
          ? `🤖 Cảm ơn bạn! Hệ thống AI đã tự động phân tích và chốt đơn thành công Sản Phẩm Live Premium (599.000đ). Vui lòng kiểm tra tin nhắn xác nhận!`
          : `🤖 Dạ mẫu Sản Phẩm Live Premium đang có sẵn, giá 599.000đ. Anh/chị chốt đơn thì nhắn trực tiếp SĐT vào đây để AI lên đơn tự động nhé!`,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=300&q=80',
        time: "Vừa xong"
      } : null
    };

    setComments(prev => [newSim, ...prev]);
    setCustomSimulateInput("");
    alert("🤖 AI CHATBOT ĐÃ TIẾP NHẬN BÌNH LUẬN THỬ NGHIỆM! AI tự động phân tích ý định: " + (isBuy ? "🔥 CHỐT ĐƠN THÀNH CÔNG!" : "❓ ĐÃ TẠO CÂU TRẢ LỜI MẪU TỰ ĐỘNG!"));
  };


  // Real-time Aggregated Comments Feed across Platforms
  const [comments, setComments] = useState([]);

  const handleQuickCloseOrder = (commentId) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isClosedOrder: true,
          intent: 'buy',
          intentLabel: '✅ ĐÃ CHỐT ĐƠN THÀNH CÔNG',
          intentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/20 font-black'
        };
      }
      return c;
    }));
    alert("🚀 AI đã tạo đơn hàng thành công và gửi xác nhận tự động tới khách hàng!");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    alert(`Đã phản hồi tới khách hàng: "${replyInput}"`);
    setReplyInput('');
  };

  const filteredComments = comments.filter(c => {
    const matchPlatform = activePlatformFilter === 'all' || c.platform === activePlatformFilter;
    const matchIntent = intentFilter === 'all' || c.intent === intentFilter;
    return matchPlatform && matchIntent;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#121218] via-[#0A0A0A] to-[#181020]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-glow-purple">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black mb-1.5 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> REAL-TIME CHAT HUB
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">Trung Tâm Chat Hub</h2>
          </div>
        </div>

        {/* AI Auto-Reply Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/60 px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-bold">
            <Bot className={`w-4 h-4 ${autoAiReplyEnabled ? 'text-purple-400 animate-bounce' : 'text-gray-500'}`} />
            <span className="text-gray-300">Trợ Lý AI Trả Lời & Chốt Đơn:</span>
            <button
              onClick={() => setAutoAiReplyEnabled(!autoAiReplyEnabled)}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                autoAiReplyEnabled
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              {autoAiReplyEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
            </button>
          </div>
          
          <button
            onClick={() => setShowAiConfig(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all rounded-xl border border-blue-400/30 shadow-glow-blue cursor-pointer"
          >
            <Database className="w-4 h-4 text-white" />
            <span className="text-xs font-black text-white">⚙️ Cài Đặt Dữ Liệu AI</span>
          </button>
        </div>
      </div>

      {/* 🤖 BÀN THỬ NGHIỆM CHỐT ĐƠN TỰ ĐỘNG CỦA AI CHATBOT (AI BOT TESTER SUITE) */}
      <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-[#100A14] to-black space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400 animate-bounce" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">🤖 TRỢ LÝ AI AUTO CHỐT ĐƠN & TƯ VẤN KHÁCH HÀNG REAL-TIME</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
            ● AI ENGINE ACTIVE 24/7
          </span>
        </div>

        <form onSubmit={handleSimulateCustomComment} className="flex gap-2">
          <input
            type="text"
            value={customSimulateInput}
            onChange={(e) => setCustomSimulateInput(e.target.value)}
            placeholder="Nhập câu bình luận thử nghiệm (Ví dụ: Cho mình mua 2 cái đầm đỏ SĐT 0988123456 nha shop)..."
            className="flex-1 bg-black/70 border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-black text-xs rounded-xl shadow-glow-purple transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Thử AI Trả Lời</span>
          </button>
        </form>
      </div>

      {/* Main Grid: Left Chat Stream, Right Quick Order & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Multistream Chat Stream & Filters */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/50">
            {/* Platform Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: '🌐 Tất Cả Kênh (5)', icon: '' },
                { id: 'tiktok', label: '🎵 TikTok (2)', icon: '' },
                { id: 'facebook', label: '📘 Facebook (1)', icon: '' },
                { id: 'shopee', label: '🛍️ Shopee (1)', icon: '' },
                { id: 'youtube', label: '🔴 YouTube (1)', icon: '' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePlatformFilter(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    activePlatformFilter === p.id
                      ? 'bg-purple-600 text-white shadow-glow-purple'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Intent Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="bg-black border border-white/15 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-200 focus:outline-none focus:border-purple-500"
              >
                <option value="all">Tất cả ý định (AI Intent)</option>
                <option value="buy">🔥 Ý định mua hàng (Chốt đơn)</option>
                <option value="question">❓ Câu hỏi / Tư vấn</option>
                <option value="vip">👑 Khách VIP / Thân thiết</option>
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {filteredComments.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCommentId(c.id)}
                className={`glass-panel p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedCommentId === c.id
                    ? 'border-purple-500 bg-purple-950/20 shadow-glow-purple'
                    : 'border-white/10 hover:border-white/20 bg-black/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img src={c.avatar} alt={c.user} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{c.user}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-gray-300 flex items-center gap-1">
                          <span>{c.platformIcon}</span>
                          <span>{c.platformName}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">{c.time}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] border ${c.intentColor}`}>
                    {c.intentLabel}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-gray-200 leading-relaxed font-medium pl-11 mb-3">
                  "{c.text}"
                </p>

                {/* Quick Action Footer */}
                <div className="pl-11 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>SP Gợi ý: <strong className="text-white">{c.productSuggested}</strong> ({c.price})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.isClosedOrder ? (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-[11px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Chốt Đơn
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickCloseOrder(c.id);
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-glow-emerald"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Chốt Đơn 1-Click</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* NESTED AI REPLY CARD */}
                {c.aiReply && autoAiReplyEnabled && (
                  <div className="mt-3 ml-11 pl-4 border-l-2 border-purple-500/30 relative">
                    {/* Decorative node */}
                    <div className="absolute w-2 h-2 rounded-full bg-purple-500 -left-[5px] top-4 shadow-[0_0_8px_#A855F7]"></div>
                    
                    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/10 rounded-2xl p-3 border border-purple-500/20 shadow-glow-purple-sm flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-purple-300">
                          <Bot className="w-4 h-4" />
                          <span className="text-[11px] font-black tracking-wide uppercase">AI Assistant Trả Lời Tự Động</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{c.aiReply.time}</span>
                      </div>
                      
                      <div className="flex gap-3 mt-1">
                        {c.aiReply.image && (
                          <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <img src={c.aiReply.image} alt="Product" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-xs text-gray-200 leading-relaxed font-medium">
                          {c.aiReply.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Reply Form */}
          <form onSubmit={handleSendReply} className="glass-panel p-3 rounded-2xl border border-white/15 bg-black/80 flex items-center gap-3">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Nhập câu trả lời gửi đến tất cả các kênh live..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-glow-purple"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Ngay</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: PINNED PRODUCT & CART */}
        <div className="space-y-4">
          
          {/* PINNED PRODUCT */}
          {(() => {
            const pinned = aiProducts.find(p => p.id === pinnedProductId) || aiProducts[0];
            return (
              <div className="glass-panel rounded-3xl border border-pink-500/40 bg-gradient-to-b from-pink-950/30 via-black to-black overflow-hidden shadow-glow-pink">
                <div className="bg-pink-600/20 border-b border-pink-500/30 p-3 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <h3 className="text-xs font-black text-pink-400 uppercase tracking-wider flex items-center gap-2 relative z-10">
                    <Pin className="w-4 h-4 animate-bounce" /> ĐANG GHIM SẢN PHẨM
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black animate-pulse relative z-10">HOT</span>
                </div>
                
                {pinned ? (
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-lg shrink-0">
                        <img src={pinned.img} alt={pinned.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase tracking-wider">{pinned.category} • {pinned.brand}</span>
                        <h4 className="text-sm font-black text-white leading-tight mt-1">{pinned.name}</h4>
                        <div className="text-lg font-black text-emerald-400 drop-shadow-sm">{pinned.price}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        <span className="block text-[10px] font-bold text-emerald-500/70 mb-0.5 uppercase tracking-wide">Tồn kho</span>
                        <strong className="text-sm font-black text-emerald-400">{pinned.stock}</strong> sản phẩm
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        <span className="block text-[10px] font-bold text-amber-500/70 mb-0.5 uppercase tracking-wide">Khuyến Mãi</span>
                        <strong className="font-bold">{pinned.promotions}</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex gap-2 items-start text-xs text-gray-300">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed"><strong>Chi tiết:</strong> {pinned.details}</span>
                      </div>
                      <div className="flex gap-2 items-start text-xs text-gray-300">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed"><strong>Lợi ích:</strong> {pinned.benefits}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center text-gray-500">
                    <ShoppingBag className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-xs font-bold text-center">CHƯA CÓ SẢN PHẨM NÀO ĐƯỢC GHIM.<br/>HÃY THÊM SẢN PHẨM VÀO KHO.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* SHOPPING CART (GIỎ HÀNG LIVE) */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 bg-black/60">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-400" /> GIỎ HÀNG TRONG LIVE
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black">{cartItems.length} MÓN</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {aiProducts.filter(p => cartItems.includes(p.id)).map(cp => (
                <div key={cp.id} className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors group relative overflow-hidden">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={cp.img} alt={cp.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h5 className="text-xs font-bold text-white truncate">{cp.name}</h5>
                    <div className="text-[11px] text-emerald-400 font-black">{cp.price}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5 truncate">{cp.promotions}</div>
                  </div>
                  <button onClick={() => setPinnedProductId(cp.id)} className="absolute right-0 top-0 bottom-0 px-3 bg-gradient-to-l from-blue-600 to-blue-500 text-white font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center shadow-[-10px_0_15px_rgba(0,0,0,0.5)]">
                    Ghim SP
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* AI KNOWLEDGE BASE DYNAMIC MODAL */}
      {showAiConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-4xl w-full text-left space-y-5 shadow-2xl bg-[#0A0A0E] animate-fadeIn max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-glow-blue">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Trung Tâm Dữ Liệu AI Bot</h3>
                  <p className="text-xs text-gray-400">AI sử dụng các dữ liệu này để tự động tư vấn và chốt đơn.</p>
                </div>
              </div>
              <button onClick={() => setShowAiConfig(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <button onClick={() => setAiConfigTab('products')} className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${aiConfigTab === 'products' ? 'bg-blue-600 text-white shadow-glow-blue' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <Database className="w-4 h-4" /> Danh Sách Sản Phẩm
              </button>
              <button onClick={() => setAiConfigTab('business')} className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${aiConfigTab === 'business' ? 'bg-emerald-600 text-white shadow-glow-emerald' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <Store className="w-4 h-4" /> Thông Tin Doanh Nghiệp
              </button>
              <button onClick={() => setAiConfigTab('questions')} className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${aiConfigTab === 'questions' ? 'bg-purple-600 text-white shadow-glow-purple' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
                <HelpCircle className="w-4 h-4" /> 100 Câu Hỏi Auto-Test
              </button>
            </div>

            {/* Tab Contents */}
            <div className="min-h-[300px]">
              
              {/* PRODUCTS TAB */}
              {aiConfigTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button onClick={() => {
                      const newProd = { id: Date.now(), name: "Sản phẩm mới", price: "0đ", keywords: "", benefits: "", colors: "", sizes: "", brand: "", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80" };
                      setAiProducts([newProd, ...aiProducts]);
                    }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                      <PlusCircle className="w-3.5 h-3.5" /> Thêm Sản Phẩm Khác
                    </button>
                  </div>
                  {aiProducts.map((prod, i) => (
                    <div key={prod.id} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div className="relative shrink-0">
                        <img src={prod.img} className="w-24 h-24 rounded-xl object-cover border border-white/10" alt="prod" />
                        <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer" onClick={() => {
                          const url = prompt("Nhập URL hình ảnh mới:", prod.img);
                          if(url) { const n = [...aiProducts]; n[i].img = url; setAiProducts(n); }
                        }}>
                          <ImageIcon className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start mb-1">
                          <input type="text" value={prod.name} onChange={(e) => { const n = [...aiProducts]; n[i].name = e.target.value; setAiProducts(n); }} className="font-black text-white text-base bg-transparent border-b border-dashed border-white/20 focus:border-emerald-400 focus:outline-none w-2/3 pb-1" placeholder="Nhập tên sản phẩm..." />
                          <div className="flex items-center gap-3">
                            <input type="text" value={prod.price} onChange={(e) => { const n = [...aiProducts]; n[i].price = e.target.value; setAiProducts(n); }} className="font-black text-emerald-400 text-base bg-transparent border-b border-dashed border-emerald-400/30 focus:outline-none w-28 text-right pb-1" placeholder="Giá bán..." />
                            <button onClick={() => { const n = aiProducts.filter((_, idx) => idx !== i); setAiProducts(n); }} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Từ khóa AI</label>
                            <input type="text" value={prod.keywords} onChange={(e) => { const n = [...aiProducts]; n[i].keywords = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: váy, đầm, áo thun..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Thương hiệu</label>
                            <input type="text" value={prod.brand} onChange={(e) => { const n = [...aiProducts]; n[i].brand = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: Nike, Adidas..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ngành hàng</label>
                            <input type="text" value={prod.category} onChange={(e) => { const n = [...aiProducts]; n[i].category = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: Thời trang, Mỹ phẩm..." />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phân loại màu sắc</label>
                            <input type="text" value={prod.colors} onChange={(e) => { const n = [...aiProducts]; n[i].colors = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: Đỏ, Đen, Trắng..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kích cỡ</label>
                            <input type="text" value={prod.sizes} onChange={(e) => { const n = [...aiProducts]; n[i].sizes = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: S, M, L, XL..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tồn kho</label>
                            <input type="text" value={prod.stock} onChange={(e) => { const n = [...aiProducts]; n[i].stock = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="Số lượng..." />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Điểm nổi bật / Lợi ích</label>
                            <input type="text" value={prod.benefits} onChange={(e) => { const n = [...aiProducts]; n[i].benefits = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="VD: Vải lụa mát, chống UV..." />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Chương trình khuyến mãi</label>
                            <input type="text" value={prod.promotions} onChange={(e) => { const n = [...aiProducts]; n[i].promotions = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-emerald-500/30 rounded-lg px-3 py-2 text-xs text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 focus:bg-emerald-500/10 transition-all" placeholder="VD: Giảm giá 50k, Mua 1 tặng 1..." />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bảo hành & Chi tiết kỹ thuật</label>
                          <input type="text" value={prod.details} onChange={(e) => { const n = [...aiProducts]; n[i].details = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="Mô tả các chi tiết bảo hành, thông số kỹ thuật dài hơn..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BUSINESS TAB */}
              {aiConfigTab === 'business' && (
                <div className="space-y-4 max-w-2xl mx-auto py-4">
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1 block">Tên Doanh Nghiệp / Shop</label>
                      <input type="text" value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1 block">Số Điện Thoại / Hotline</label>
                      <input type="text" value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1 block">Địa Chỉ Cửa Hàng / Kho</label>
                      <input type="text" value={businessInfo.address} onChange={e => setBusinessInfo({...businessInfo, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-bold mb-1 block">Chính Sách Giao Hàng & Đổi Trả</label>
                      <textarea value={businessInfo.policy} onChange={e => setBusinessInfo({...businessInfo, policy: e.target.value})} rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-emerald-400 focus:outline-none resize-none"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* QUESTIONS TAB */}
              {aiConfigTab === 'questions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-bold block">{customQuestions.length} Câu hỏi huấn luyện AI giả lập trên Live</span>
                      <span className="text-xs text-gray-400">Anh có thể thêm, sửa, xóa để điều hướng AI học những câu hỏi mới.</span>
                    </div>
                    <button onClick={() => {
                       const newQ = { text: "Câu hỏi mẫu mới", intent: "question" };
                       setCustomQuestions([newQ, ...customQuestions]);
                    }} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-glow-purple">
                      <PlusCircle className="w-3.5 h-3.5" /> Thêm Câu Hỏi
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {customQuestions.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-center gap-2 hover:border-purple-500/50 transition-colors">
                        <span className="text-gray-500 font-mono w-4 shrink-0">{i+1}.</span>
                        <input type="text" value={q.text} onChange={(e) => {
                           const n = [...customQuestions];
                           n[i].text = e.target.value;
                           setCustomQuestions(n);
                        }} className="flex-1 bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-400 focus:outline-none" />
                        <select value={q.intent} onChange={(e) => {
                           const n = [...customQuestions];
                           n[i].intent = e.target.value;
                           setCustomQuestions(n);
                        }} className="bg-black/50 border border-white/10 rounded px-1 py-0.5 text-[9px] font-black focus:outline-none">
                           <option value="question">HỎI</option>
                           <option value="buy">MUA</option>
                           <option value="vip">VIP</option>
                        </select>
                        <button onClick={() => {
                           const n = customQuestions.filter((_, idx) => idx !== i);
                           setCustomQuestions(n);
                        }} className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowAiConfig(false)} className="px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer">
                ĐÓNG
              </button>
              <button onClick={() => { alert("Đã cập nhật dữ liệu huấn luyện cho AI thành công!"); setShowAiConfig(false); }} className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white transition-all shadow-glow-blue flex items-center gap-2 cursor-pointer">
                <CheckSquare className="w-4 h-4" /> LƯU & HUẤN LUYỆN LẠI AI
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
