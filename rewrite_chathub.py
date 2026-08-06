import re

with open('src/components/UnifiedChatHub.jsx', 'r') as f:
    content = f.read()

# 1. Add imports for AI Data
import_str = "import { simulatedCustomers, simulatedAvatars, simulatedQuestions } from '../lib/aiSimulationData';\n"
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';\n" + import_str)

# 2. Add lucide-react icons needed
content = content.replace("CheckSquare,", "CheckSquare,\n  Store,\n  HelpCircle,\n  Edit,\n  Trash2,\n  PlusCircle,")

# 3. Add AI State
ai_state = """
  const [aiConfigTab, setAiConfigTab] = useState('products'); // products | business | questions
  
  const [businessInfo, setBusinessInfo] = useState({
    name: 'AVA Fashion Official',
    phone: '0988.123.456',
    address: '123 Đường Số 1, Quận 1, TP.HCM',
    policy: 'Freeship đơn từ 500k. Lỗi 1 đổi 1 trong 7 ngày.'
  });

  const [aiProducts, setAiProducts] = useState([
    { id: 1, name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, chất lụa tơ tằm không nhăn.", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Đầm Dự Tiệc Luxury Red", price: "899.000đ", keywords: "đầm đỏ, dạ hội, tiệc", benefits: "Tôn da, eo thắt V-Line thon gọn.", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Váy Lụa Hàn Quốc", price: "399.000đ", keywords: "váy lụa, váy hè, lụa hàn", benefits: "Siêu mát, thấm hút mồ hôi.", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=150&q=80" }
  ]);
"""
content = content.replace("const [showAiConfig, setShowAiConfig] = useState(false);", "const [showAiConfig, setShowAiConfig] = useState(false);\n" + ai_state)

# 4. Rewrite the useEffect interval logic
old_use_effect = """  // Auto-simulate incoming live comments & AI Bot responses every 10 seconds when live
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
        isClosedOrder: isBuy,
        aiReply: {
          text: isBuy 
            ? `Dạ AI đã tự động chốt đơn thành công ${rText.includes('V-LINE') ? 'Combo V-Line' : 'Sản phẩm'} cho chị ${rUser} ạ! Đơn hàng giá ${isBuy ? "699.000đ" : "499.000đ"} đã được lưu hệ thống. Chị vui lòng check inbox nhé!`
            : `Dạ chào chị ${rUser}, mẫu ${rText.includes('blazer') ? 'Áo Blazer' : 'Đầm V-Line'} bên em form cực đẹp, tôn dáng. Giá ưu đãi trên live chỉ ${isBuy ? "699.000đ" : "499.000đ"}. Chị nhắn SĐT để AI chốt đơn tự động luôn nha!`,
          image: isBuy 
            ? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80' 
            : 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80',
          time: "Vừa xong"
        }
      };

      setComments(prev => [newC, ...prev.slice(0, 9)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [autoAiReplyEnabled]);"""

new_use_effect = """  // Dynamic AI Engine matching real dataset
  useEffect(() => {
    if (!autoAiReplyEnabled) return;
    const interval = setInterval(() => {
      const rUser = simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
      const rAvatar = simulatedAvatars[Math.floor(Math.random() * simulatedAvatars.length)];
      const rQuestionObj = simulatedQuestions[Math.floor(Math.random() * simulatedQuestions.length)];
      
      const textL = rQuestionObj.text.toLowerCase();
      
      // Match Product
      let matchedProduct = null;
      for (const p of aiProducts) {
        const kws = p.keywords.split(',').map(k => k.trim().toLowerCase());
        if (kws.some(k => textL.includes(k))) {
          matchedProduct = p;
          break;
        }
      }
      if (!matchedProduct) matchedProduct = aiProducts[0]; // fallback

      // Match Service
      const isService = textL.includes('địa chỉ') || textL.includes('ở đâu') || textL.includes('đổi trả') || textL.includes('bảo hành') || textL.includes('ship') || textL.includes('hotline');
      
      let aiText = '';
      if (isService) {
        if (textL.includes('địa chỉ') || textL.includes('ở đâu')) aiText = `Dạ địa chỉ cửa hàng bên em là ${businessInfo.address}. Chị ghé qua tham quan nhé!`;
        else if (textL.includes('ship')) aiText = `Dạ ${businessInfo.policy}. Chị chốt đơn nhắn ngay SĐT nha!`;
        else if (textL.includes('hotline')) aiText = `Dạ tổng đài CSKH bên em là ${businessInfo.phone}.`;
        else aiText = `Dạ chính sách bên em là: ${businessInfo.policy}`;
      } else if (rQuestionObj.intent === 'buy') {
        aiText = `✅ AI đã chốt đơn thành công ${matchedProduct.name} cho chị ${rUser} ạ! Đơn hàng giá ${matchedProduct.price} đã được lưu tự động.`;
      } else if (rQuestionObj.intent === 'vip') {
        aiText = `Dạ shop cảm ơn khách VIP ${rUser} nhiều ạ! Nhớ áp dụng các mã giảm giá cho khách quen nha chị ❤️`;
      } else {
        aiText = `Dạ ${matchedProduct.name} bên em ${matchedProduct.benefits}. Giá ưu đãi trên live chỉ ${matchedProduct.price}. Anh/chị ưng thì chốt ngay SĐT nhé!`;
      }

      const newC = {
        id: "sim_" + Date.now(),
        platform: Math.random() > 0.5 ? "tiktok" : "facebook",
        platformIcon: Math.random() > 0.5 ? "🎵" : "📘",
        platformName: Math.random() > 0.5 ? "TikTok Live Pro" : "Facebook Fanpage VIP",
        user: rUser,
        avatar: rAvatar,
        time: "Vừa xong",
        text: rQuestionObj.text,
        intent: rQuestionObj.intent,
        intentLabel: rQuestionObj.intent === 'buy' ? "🔥 CHỐT ĐƠN TỰ ĐỘNG" : rQuestionObj.intent === 'vip' ? "👑 KHÁCH VIP" : "❓ Hỏi Tư Vấn",
        intentColor: rQuestionObj.intent === 'buy' ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-black" : rQuestionObj.intent === 'vip' ? "text-purple-400 border-purple-500/40 bg-purple-500/10 font-bold" : "text-amber-400 border-amber-500/40 bg-amber-500/10",
        productSuggested: matchedProduct.name,
        price: matchedProduct.price,
        isClosedOrder: rQuestionObj.intent === 'buy',
        aiReply: {
          text: aiText,
          image: matchedProduct.img,
          time: "Vừa xong"
        }
      };

      setComments(prev => [newC, ...prev.slice(0, 9)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [autoAiReplyEnabled, aiProducts, businessInfo]);"""

content = content.replace(old_use_effect, new_use_effect)


# 5. Rewrite the modal section
old_modal = """      {/* AI KNOWLEDGE BASE MODAL */}
      {showAiConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/20 max-w-3xl w-full text-left space-y-5 shadow-2xl bg-[#0A0A0E] animate-fadeIn max-h-[85vh] overflow-y-auto no-scrollbar">
            
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Kho Dữ Liệu Sản Phẩm & AI Training</h3>
                  <p className="text-xs text-gray-400">AI sử dụng danh sách này để tự động nhận diện bình luận, báo giá và tư vấn.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAiConfig(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, chất lụa tơ tằm không nhăn, che khuyết điểm bụng.", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
                { name: "Đầm Dự Tiệc Luxury Red", price: "899.000đ", keywords: "đầm đỏ, váy dạ hội, tiệc", benefits: "Màu đỏ tôn da nổi bật, eo thắt V-Line giúp eo trông thon gọn ngay lập tức.", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80" },
                { name: "Váy Lụa Hàn Quốc Mùa Hè", price: "399.000đ", keywords: "váy lụa, váy hè, váy đi biển", benefits: "Siêu mát, thấm hút mồ hôi, dễ dàng phối với túi xách và mũ cói.", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=150&q=80" }
              ].map((prod, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors">
                  <img src={prod.img} className="w-20 h-20 rounded-xl object-cover border border-white/10" alt="prod" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                      <span className="font-black text-emerald-400 text-sm">{prod.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Từ khóa nhận diện:</span>
                      <span className="text-gray-300">{prod.keywords}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-start gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      <span>{prod.benefits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button 
                onClick={() => setShowAiConfig(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                ĐÓNG
              </button>
              <button 
                onClick={() => {
                  alert("Đã cập nhật dữ liệu huấn luyện cho AI thành công!");
                  setShowAiConfig(false);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-glow-blue flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" /> LƯU & HUẤN LUYỆN LẠI AI
              </button>
            </div>
          </div>
        </div>
      )}"""

new_modal = """      {/* AI KNOWLEDGE BASE DYNAMIC MODAL */}
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
                    <button onClick={() => alert("Chức năng thêm sản phẩm mới (Mở form nhập).")} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer">
                      <PlusCircle className="w-3.5 h-3.5" /> Thêm Sản Phẩm Khác
                    </button>
                  </div>
                  {aiProducts.map((prod, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                      <div className="relative">
                        <img src={prod.img} className="w-24 h-24 rounded-xl object-cover border border-white/10" alt="prod" />
                        <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer" onClick={() => alert("Thay đổi ảnh sản phẩm")}>
                          <ImageIcon className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <input type="text" value={prod.name} onChange={(e) => { const n = [...aiProducts]; n[i].name = e.target.value; setAiProducts(n); }} className="font-bold text-white text-sm bg-transparent border-b border-dashed border-white/20 focus:border-blue-400 focus:outline-none w-1/2" />
                          <div className="flex items-center gap-2">
                            <input type="text" value={prod.price} onChange={(e) => { const n = [...aiProducts]; n[i].price = e.target.value; setAiProducts(n); }} className="font-black text-emerald-400 text-sm bg-transparent border-b border-dashed border-emerald-400/30 focus:outline-none w-24 text-right" />
                            <button onClick={() => alert("Đã xóa sản phẩm")} className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono shrink-0">Từ khóa (phẩy ,):</span>
                          <input type="text" value={prod.keywords} onChange={(e) => { const n = [...aiProducts]; n[i].keywords = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">Lợi ích/Tính năng:</span>
                          <input type="text" value={prod.benefits} onChange={(e) => { const n = [...aiProducts]; n[i].benefits = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-amber-400" />
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
                    <span className="text-sm text-gray-300 font-bold">100 Câu hỏi lấy ngẫu nhiên từ aiSimulationData.js để Test AI</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-black">AI sẽ tự động học các câu hỏi này</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                    {simulatedQuestions.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-gray-500 font-mono w-4">{i+1}.</span>
                        <span>{q.text}</span>
                        {q.intent === 'buy' && <span className="ml-auto px-1.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black">BUY</span>}
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
      )}"""

content = content.replace(old_modal, new_modal)

with open('src/components/UnifiedChatHub.jsx', 'w') as f:
    f.write(content)

