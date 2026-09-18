import re

with open('src/components/UnifiedChatHub.jsx', 'r') as f:
    content = f.read()

# 1. Update aiProducts initial state
old_products = """  const [aiProducts, setAiProducts] = useState([
    { id: 1, name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, chất lụa tơ tằm không nhăn.", colors: "Đen, Be, Trắng", sizes: "M, L, XL", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Đầm Dự Tiệc Luxury Red", price: "899.000đ", keywords: "đầm đỏ, dạ hội, tiệc", benefits: "Tôn da, eo thắt V-Line thon gọn.", colors: "Đỏ đô, Đỏ tươi", sizes: "S, M, L", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Váy Lụa Hàn Quốc", price: "399.000đ", keywords: "váy lụa, váy hè, lụa hàn", benefits: "Siêu mát, thấm hút mồ hôi.", colors: "Vàng, Xanh lá", sizes: "S, M", brand: "AVA Luxury", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=150&q=80" }
  ]);"""

new_products = """  const [aiProducts, setAiProducts] = useState([
    { id: 1, name: "Áo Blazer Hàn Quốc High-End", price: "499.000đ", keywords: "blazer, áo khoác, vest", benefits: "Form suông thanh lịch, không nhăn.", colors: "Đen, Be", sizes: "M, L", brand: "AVA Luxury", stock: "50", promotions: "Giảm 50K", category: "Thời trang", details: "Chất lụa tơ tằm, bảo hành form áo 6 tháng", img: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "iPhone 15 Pro Max 256GB", price: "29.990.000đ", keywords: "iphone, điện thoại, apple", benefits: "Camera xịn, mượt mà", colors: "Titan Tự Nhiên, Titan Đen", sizes: "256GB", brand: "Apple", stock: "10", promotions: "Tặng củ sạc 20W", category: "Điện tử", details: "Bảo hành 1 đổi 1 trong 12 tháng tại Apple Store", img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=150&q=80" },
    { id: 3, name: "Sữa Rửa Mặt Cerave", price: "350.000đ", keywords: "sữa rửa mặt, cerave, rửa mặt", benefits: "Sạch sâu, không khô da", colors: "Xanh lá", sizes: "236ml", brand: "Cerave", stock: "100", promotions: "Freeship", category: "Mỹ phẩm", details: "Dùng cho da dầu mụn, hạn sử dụng 2027", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=150&q=80" }
  ]);
  
  const [pinnedProductId, setPinnedProductId] = useState(2);
  const [cartItems, setCartItems] = useState([1, 3]); // array of product IDs
"""
content = content.replace(old_products, new_products)

# 2. Icon imports
content = content.replace("CheckSquare,", "CheckSquare,\n  Pin,\n  ShoppingBag,\n  Gift,\n  Info,")


# 3. AI engine effect
old_ai_logic = """        let consultText = `Dạ ${matchedProduct.name} (${matchedProduct.brand}) bên em ${matchedProduct.benefits}. Giá ưu đãi trên live chỉ ${matchedProduct.price}.`;
        
        if (reqSize) {
           const hasSize = matchedProduct.sizes.toUpperCase().includes(reqSize);
           if (hasSize) consultText = `Dạ mẫu ${matchedProduct.name} bên em ĐANG CÓ SẴN size ${reqSize} chị nhé! Giá ưu đãi ${matchedProduct.price}.`;
           else consultText = `Dạ mẫu ${matchedProduct.name} hiện tại size ${reqSize} đã hết, nhưng còn các size ${matchedProduct.sizes} ạ. Chị tham khảo nha!`;
        } else if (textL.includes('màu')) {
           consultText = `Dạ ${matchedProduct.name} bên em đang có sẵn các màu: ${matchedProduct.colors} ạ. Chị ưng màu nào thì để lại SĐT nha!`;
        }
        aiText = consultText;"""

new_ai_logic = """        let consultText = `Dạ ${matchedProduct.name} (${matchedProduct.brand}) bên em ${matchedProduct.benefits}. Giá ưu đãi trên live chỉ ${matchedProduct.price}.`;
        
        if (reqSize) {
           const hasSize = matchedProduct.sizes.toUpperCase().includes(reqSize);
           if (hasSize) consultText = `Dạ mẫu ${matchedProduct.name} bên em ĐANG CÓ SẴN size ${reqSize} chị nhé! Giá ưu đãi ${matchedProduct.price}.`;
           else consultText = `Dạ mẫu ${matchedProduct.name} hiện tại size ${reqSize} đã hết, nhưng còn các size ${matchedProduct.sizes} ạ. Chị tham khảo nha!`;
        } else if (textL.includes('màu')) {
           consultText = `Dạ ${matchedProduct.name} bên em đang có sẵn các màu: ${matchedProduct.colors} ạ. Chị ưng màu nào thì để lại SĐT nha!`;
        } else if (textL.includes('bảo hành') || textL.includes('hạn sử dụng')) {
           consultText = `Dạ thông tin chi tiết: ${matchedProduct.details}. Chị yên tâm chốt đơn nha!`;
        } else if (textL.includes('tồn kho') || textL.includes('còn hàng không')) {
           consultText = `Dạ mã ${matchedProduct.name} bên em hiện chỉ còn đúng ${matchedProduct.stock} sản phẩm thôi ạ, ${matchedProduct.promotions}. Chị nhanh tay chốt nhé!`;
        } else if (textL.includes('khuyến mãi') || textL.includes('voucher') || textL.includes('quà')) {
           consultText = `Dạ mã này đang có ưu đãi cực hot: ${matchedProduct.promotions}. Anh/chị chốt đơn liền nha!`;
        }
        aiText = consultText;"""

content = content.replace(old_ai_logic, new_ai_logic)


# 4. Replace Right Column UI
old_right_col = """        {/* Right 1 Col: Real-time Live Metrics & AI Seller Status */}
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

        </div>"""

new_right_col = """        {/* Right 1 Col: PINNED PRODUCT & CART */}
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

        </div>"""
content = content.replace(old_right_col, new_right_col)


# 5. Update Modal Inputs to handle new fields
old_grid_cols = """                        <div className="grid grid-cols-2 gap-2 text-xs">
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
                        </div>"""

new_grid_cols = """                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono shrink-0">Từ khóa:</span>
                            <input type="text" value={prod.keywords} onChange={(e) => { const n = [...aiProducts]; n[i].keywords = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-blue-400" placeholder="váy, đầm..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono shrink-0">Hãng:</span>
                            <input type="text" value={prod.brand} onChange={(e) => { const n = [...aiProducts]; n[i].brand = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-pink-400" placeholder="Tên hãng..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-300 font-mono shrink-0">Ngành:</span>
                            <input type="text" value={prod.category} onChange={(e) => { const n = [...aiProducts]; n[i].category = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-gray-400" placeholder="Mỹ phẩm..." />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="col-span-2 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono shrink-0">Màu sắc:</span>
                            <input type="text" value={prod.colors} onChange={(e) => { const n = [...aiProducts]; n[i].colors = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-purple-400" placeholder="Đỏ, đen..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono shrink-0">Size:</span>
                            <input type="text" value={prod.sizes} onChange={(e) => { const n = [...aiProducts]; n[i].sizes = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-indigo-400" placeholder="S, M..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono shrink-0">Tồn kho:</span>
                            <input type="text" value={prod.stock} onChange={(e) => { const n = [...aiProducts]; n[i].stock = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-emerald-400" placeholder="100..." />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">Lợi ích:</span>
                            <input type="text" value={prod.benefits} onChange={(e) => { const n = [...aiProducts]; n[i].benefits = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-amber-400" placeholder="Siêu mát..." />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono shrink-0">Voucher:</span>
                            <input type="text" value={prod.promotions} onChange={(e) => { const n = [...aiProducts]; n[i].promotions = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-pink-400" placeholder="Giảm 50k..." />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                           <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono shrink-0">Bảo hành/Chi tiết:</span>
                           <input type="text" value={prod.details} onChange={(e) => { const n = [...aiProducts]; n[i].details = e.target.value; setAiProducts(n); }} className="flex-1 w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 focus:outline-none focus:border-blue-400" placeholder="Chi tiết kỹ thuật, hạn sử dụng, quyền lợi..." />
                        </div>"""

content = content.replace(old_grid_cols, new_grid_cols)


with open('src/components/UnifiedChatHub.jsx', 'w') as f:
    f.write(content)

