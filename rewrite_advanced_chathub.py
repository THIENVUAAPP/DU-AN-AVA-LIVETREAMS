import re

with open('src/components/UnifiedChatHub.jsx', 'r') as f:
    content = f.read()

# 1. Update aiProducts initial state
old_products = """  const [aiProducts, setAiProducts] = useState([
    { id: 1, name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, chất lụa tơ tằm không nhăn.", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Đầm Dự Tiệc Luxury Red", price: "899.000đ", keywords: "đầm đỏ, dạ hội, tiệc", benefits: "Tôn da, eo thắt V-Line thon gọn.", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Váy Lụa Hàn Quốc", price: "399.000đ", keywords: "váy lụa, váy hè, lụa hàn", benefits: "Siêu mát, thấm hút mồ hôi.", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=150&q=80" }
  ]);"""

new_products = """  const [aiProducts, setAiProducts] = useState([
    { id: 1, name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, chất lụa tơ tằm không nhăn.", colors: "Đen, Be, Trắng", sizes: "M, L, XL", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Đầm Dự Tiệc Luxury Red", price: "899.000đ", keywords: "đầm đỏ, dạ hội, tiệc", benefits: "Tôn da, eo thắt V-Line thon gọn.", colors: "Đỏ đô, Đỏ tươi", sizes: "S, M, L", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Váy Lụa Hàn Quốc", price: "399.000đ", keywords: "váy lụa, váy hè, lụa hàn", benefits: "Siêu mát, thấm hút mồ hôi.", colors: "Vàng, Xanh lá", sizes: "S, M", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=150&q=80" }
  ]);
  
  const [customQuestions, setCustomQuestions] = useState(simulatedQuestions);
"""
content = content.replace(old_products, new_products)


# 2. Update AI Engine Effect
old_effect_start = """  // Dynamic AI Engine matching real dataset
  useEffect(() => {
    if (!autoAiReplyEnabled) return;
    const interval = setInterval(() => {
      const rUser = simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
      const rAvatar = simulatedAvatars[Math.floor(Math.random() * simulatedAvatars.length)];
      const rQuestionObj = simulatedQuestions[Math.floor(Math.random() * simulatedQuestions.length)];
      
      const textL = rQuestionObj.text.toLowerCase();"""

new_effect_start = """  // Dynamic AI Engine matching real dataset
  useEffect(() => {
    if (!autoAiReplyEnabled) return;
    const interval = setInterval(() => {
      const qsToUse = customQuestions.length > 0 ? customQuestions : simulatedQuestions;
      const rUser = simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
      const rAvatar = simulatedAvatars[Math.floor(Math.random() * simulatedAvatars.length)];
      const rQuestionObj = qsToUse[Math.floor(Math.random() * qsToUse.length)];
      
      const textL = rQuestionObj.text.toLowerCase();"""

content = content.replace(old_effect_start, new_effect_start)


old_effect_mid = """      // Match Service
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
      }"""

new_effect_mid = """      // Match Service
      const isService = textL.includes('địa chỉ') || textL.includes('ở đâu') || textL.includes('đổi trả') || textL.includes('bảo hành') || textL.includes('ship') || textL.includes('hotline');
      
      // Parse specific attributes
      const requestedSizeMatch = textL.match(/size\\s*([a-z0-9]+)/);
      const reqSize = requestedSizeMatch ? requestedSizeMatch[1].toUpperCase() : null;
      
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
        let consultText = `Dạ ${matchedProduct.name} (${matchedProduct.brand}) bên em ${matchedProduct.benefits}. Giá ưu đãi trên live chỉ ${matchedProduct.price}.`;
        
        if (reqSize) {
           const hasSize = matchedProduct.sizes.toUpperCase().includes(reqSize);
           if (hasSize) consultText = `Dạ mẫu ${matchedProduct.name} bên em ĐANG CÓ SẴN size ${reqSize} chị nhé! Giá ưu đãi ${matchedProduct.price}.`;
           else consultText = `Dạ mẫu ${matchedProduct.name} hiện tại size ${reqSize} đã hết, nhưng còn các size ${matchedProduct.sizes} ạ. Chị tham khảo nha!`;
        } else if (textL.includes('màu')) {
           consultText = `Dạ ${matchedProduct.name} bên em đang có sẵn các màu: ${matchedProduct.colors} ạ. Chị ưng màu nào thì để lại SĐT nha!`;
        }
        aiText = consultText;
      }"""

content = content.replace(old_effect_mid, new_effect_mid)

# Fix dependencies array in useEffect
content = content.replace("  }, [autoAiReplyEnabled, aiProducts, businessInfo]);", "  }, [autoAiReplyEnabled, aiProducts, businessInfo, customQuestions]);")


# 3. Replace the Tab contents in Modal
old_products_tab = """              {/* PRODUCTS TAB */}
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
              )}"""

new_products_tab = """              {/* PRODUCTS TAB */}
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
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <input type="text" value={prod.name} onChange={(e) => { const n = [...aiProducts]; n[i].name = e.target.value; setAiProducts(n); }} className="font-bold text-white text-sm bg-transparent border-b border-dashed border-white/20 focus:border-blue-400 focus:outline-none w-1/2" placeholder="Tên sản phẩm..." />
                          <div className="flex items-center gap-2">
                            <input type="text" value={prod.price} onChange={(e) => { const n = [...aiProducts]; n[i].price = e.target.value; setAiProducts(n); }} className="font-black text-emerald-400 text-sm bg-transparent border-b border-dashed border-emerald-400/30 focus:outline-none w-24 text-right" placeholder="Giá tiền..." />
                            <button onClick={() => { const n = aiProducts.filter((_, idx) => idx !== i); setAiProducts(n); }} className="p-1.5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono shrink-0">Từ khóa:</span>
                            <input type="text" value={prod.keywords} onChange={(e) => { const n = [...aiProducts]; n[i].keywords = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-blue-400" placeholder="VD: váy, đầm..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono shrink-0">Thương hiệu:</span>
                            <input type="text" value={prod.brand} onChange={(e) => { const n = [...aiProducts]; n[i].brand = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-pink-400" placeholder="Tên hãng..." />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono shrink-0">Màu sắc:</span>
                            <input type="text" value={prod.colors} onChange={(e) => { const n = [...aiProducts]; n[i].colors = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-400" placeholder="Đỏ, đen, xanh..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono shrink-0">Kích cỡ:</span>
                            <input type="text" value={prod.sizes} onChange={(e) => { const n = [...aiProducts]; n[i].sizes = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-indigo-400" placeholder="S, M, L..." />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">Lợi ích:</span>
                          <input type="text" value={prod.benefits} onChange={(e) => { const n = [...aiProducts]; n[i].benefits = e.target.value; setAiProducts(n); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-amber-400" placeholder="Mô tả nổi bật..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}"""
content = content.replace(old_products_tab, new_products_tab)


old_questions_tab = """              {/* QUESTIONS TAB */}
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
              )}"""

new_questions_tab = """              {/* QUESTIONS TAB */}
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
              )}"""
content = content.replace(old_questions_tab, new_questions_tab)

with open('src/components/UnifiedChatHub.jsx', 'w') as f:
    f.write(content)

