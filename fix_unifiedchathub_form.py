import re

with open('src/components/UnifiedChatHub.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace the whole `flex-1 space-y-2` block for the product form.
# Let's find it.
old_block_regex = r'<div className="flex-1 space-y-2">.*?<div className="flex items-center gap-2">\s*<span className="px-2 py-0\.5 rounded bg-blue-500/20 text-blue-300 font-mono shrink-0">Bảo hành/Chi tiết:</span>.*?<\/div>\s*<\/div>\s*<\/div>'

new_block = """<div className="flex-1 space-y-3">
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
                          <input type="text" value={prod.warranty_details} onChange={(e) => { const n = [...aiProducts]; n[i].warranty_details = e.target.value; setAiProducts(n); }} className="w-full bg-[#121216] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 focus:bg-white/5 transition-all" placeholder="Mô tả các chi tiết bảo hành, thông số kỹ thuật dài hơn..." />
                        </div>
                      </div>
                    </div>"""

content = re.sub(old_block_regex, new_block, content, flags=re.DOTALL)

with open('src/components/UnifiedChatHub.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Form redesigned in UnifiedChatHub.jsx")
