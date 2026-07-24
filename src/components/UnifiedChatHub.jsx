import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

export default function UnifiedChatHub({ isLive }) {

  const handleAiSuggestAnswer = (comment) => {
    if (!comment) return;
    const aiAnswer = "Dạ shop chào chị " + comment.user + "! Mẫu " + comment.productSuggested + " bên em đang có ưu đãi độc quyền trên live chỉ " + comment.price + "! Em đã tạo đơn tư vấn tự động cho chị rồi ạ. Chị nhắn inbox SĐT shop chốt gửi ngay hôm nay nha!";
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

  // Auto-simulate incoming live comments & AI Bot responses every 10 seconds when live
  React.useEffect(() => {
    if (!autoAiReplyEnabled) return;
    const interval = setInterval(() => {
      const sampleUsers = ["Ngọc Trinh", "Vũ Hoàng My", "Đặng Lê Nguyên", "Phan Hoàng Yến", "Trịnh Thảo Chi"];
      const sampleAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
      ];
      const sampleTexts = [
        "CHỐT 1 COMBO ĐẦM DỰ TIỆC V-LINE SĐT 0912345678 SHIP HÀ NỘI NHA SHOP",
        "Shop ơi cho mình hỏi đầm này chất vải lụa tơ tằm hay umi vậy ạ?",
        "Có được đổi trả nếu mặc không vừa size M không shop ơi?",
        "Đã dán voucher GIAM50K rồi nha shop, chuẩn bị đóng hàng giúp mình nha!",
        "Tư vấn cho mình cao 1m62 nặng 52kg nên mặc size S hay M với ạ?"
      ];

      const rUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
      const rText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const rAvatar = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
      const isBuy = rText.includes("CHỐT") || rText.includes("SĐT") || rText.includes("voucher");

      const newC = {
        id: "sim_" + Date.now(),
        platform: Math.random() > 0.5 ? "tiktok" : "facebook",
        platformIcon: Math.random() > 0.5 ? "🎵" : "📘",
        platformName: Math.random() > 0.5 ? "TikTok Live Pro" : "Facebook Fanpage VIP",
        user: rUser,
        avatar: rAvatar,
        time: "Vừa xong",
        text: rText,
        intent: isBuy ? "buy" : "question",
        intentLabel: isBuy ? "🔥 CHỐT ĐƠN TỰ ĐỘNG" : "❓ Hỏi Tư Vấn",
        intentColor: isBuy ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-black" : "text-amber-400 border-amber-500/40 bg-amber-500/10",
        productSuggested: isBuy ? "Combo V-Line Studio 4K" : "Váy Lụa Hàn Quốc",
        price: isBuy ? "699.000đ" : "499.000đ",
        isClosedOrder: isBuy
      };

      setComments(prev => [newC, ...prev.slice(0, 9)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [autoAiReplyEnabled]);

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
      isClosedOrder: isBuy
    };

    setComments(prev => [newSim, ...prev]);
    setCustomSimulateInput("");
    alert("🤖 AI CHATBOT ĐÃ TIẾP NHẬN BÌNH LUẬN THỬ NGHIỆM! AI tự động phân tích ý định: " + (isBuy ? "🔥 CHỐT ĐƠN THÀNH CÔNG!" : "❓ ĐÃ TẠO CÂU TRẢ LỜI MẪU TỰ ĐỘNG!"));
  };


  // Real-time Aggregated Comments Feed across Platforms
  const [comments, setComments] = useState([
    {
      id: 'c1',
      platform: 'tiktok',
      platformIcon: '🎵',
      platformName: 'TikTok Live Pro',
      user: 'Nguyễn Thanh Hằng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '10 giây trước',
      text: 'Shop ơi áo blazer màu be có size L không? Mình cao 1m65 55kg mặc vừa không ạ?',
      intent: 'question',
      intentLabel: '❓ Hỏi Size/Tư Vấn',
      intentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      productSuggested: 'Áo Blazer Hàn Quốc High-End',
      price: '499.000đ',
      isClosedOrder: false,
    },
    {
      id: 'c2',
      platform: 'facebook',
      platformIcon: '📘',
      platformName: 'Facebook Fanpage VIP',
      user: 'Trần Văn Mạnh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      time: '15 giây trước',
      text: 'CHỐT 2 CÁI ĐẦM DỰ TIỆC MÀU ĐỎ SIZE M - SĐT: 0988123456 - ĐỊA CHỈ: QUẬN 1 TPHCM',
      intent: 'buy',
      intentLabel: '🔥 CHỐT ĐƠN NGAY',
      intentColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-black',
      productSuggested: 'Đầm Dự Tiệc Luxury Red',
      price: '899.000đ',
      isClosedOrder: true,
    },
    {
      id: 'c3',
      platform: 'shopee',
      platformIcon: '🛍️',
      platformName: 'Shopee Live Mall',
      user: 'Lê Minh Anh',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      time: '28 giây trước',
      text: 'Mã giảm giá 50% áp dụng cho giỏ hàng số mấy vậy shop ơi?',
      intent: 'question',
      intentLabel: '❓ Hỏi Voucher',
      intentColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      productSuggested: 'Voucher GIAM50K',
      price: 'Freeship 0đ',
      isClosedOrder: false,
    },
    {
      id: 'c4',
      platform: 'youtube',
      platformIcon: '🔴',
      platformName: 'YouTube Channel 4K',
      user: 'Phạm Hoàng Nam (VIP Client)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      time: '42 giây trước',
      text: 'Livestream sắc nét quá! Đã ủng hộ shop 3 đơn hàng hôm nay rồi nha.',
      intent: 'vip',
      intentLabel: '👑 KHÁCH HÀNG VIP',
      intentColor: 'text-purple-400 border-purple-500/40 bg-purple-500/10 font-bold',
      productSuggested: 'Combo 3 Sản Phẩm VIP',
      price: '1.490.000đ',
      isClosedOrder: false,
    },
    {
      id: 'c5',
      platform: 'tiktok',
      platformIcon: '🎵',
      platformName: 'TikTok Live Pro',
      user: 'Đỗ Thảo Nhi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      time: '1 phút trước',
      text: 'Ship về Hà Nội mất mấy ngày vậy em?',
      intent: 'question',
      intentLabel: '❓ Vận Chuyển',
      intentColor: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
      productSuggested: 'Giao Hàng Hỏa Tốc',
      price: '2-3 Ngày',
      isClosedOrder: false,
    },
  ]);

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
        </div>
      </div>

      {/* 🤖 BÀN THỬ NGHIỆM CHỐT ĐƠN TỰ ĐỘNG CỦA AI CHATBOT (AI BOT TESTER SUITE) */}
      <div className="glass-panel p-5 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-[#100A14] to-black space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400 animate-bounce" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">🤖 BÀN GIẢ LẬP TEST AI CHATBOT CHỐT ĐƠN REAL-TIME</h3>
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
            <span>THỬ GIẢ LẬP AI TRẢ LỜI</span>
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

        {/* Right 1 Col: Real-time Live Metrics & AI Seller Status */}
        <div className="space-y-4">
          
          {/* Order Summary Widget */}
          <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-[#0A0A0A] to-black space-y-4 shadow-glow-emerald">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-400" /> THỐNG KÊ ĐƠN HÀNG REAL-TIME
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">LIVE ON AIR</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Tổng Đơn Đã Chốt</span>
                <span className="text-xl font-black text-emerald-400">148 Đơn</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Doanh Thu Tạm Tính</span>
                <span className="text-xl font-black text-amber-400">78.4 Triệu</span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Tỷ lệ chốt đơn tự động:</span>
                <span className="text-white font-bold">94.2%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[94%]" />
              </div>
            </div>
          </div>

          {/* AI Auto-Bot Live Activity Feed */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3 bg-black/60">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400 animate-pulse" /> NHẬT KÝ TỰ ĐỘNG CỦA AI CHỐT ĐƠN
            </h3>

            <div className="space-y-2 text-[11px] text-gray-300">
              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
                <span>🤖 AI đã phát 1,200 mã GIAM50K lên TikTok Live</span>
                <span className="text-[9px] text-gray-500">Vừa xong</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
                <span>📘 AI trả lời inbox tự động 18 khách trên Fanpage</span>
                <span className="text-[9px] text-gray-500">1 phút trước</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <span>🛍️ Đồng bộ tồn kho Shopee Live còn 12 sản phẩm</span>
                <span className="text-[9px] text-gray-500">3 phút trước</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
