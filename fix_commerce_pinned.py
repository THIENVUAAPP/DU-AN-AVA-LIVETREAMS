import re

with open('src/components/LiveCommerceStudio.jsx', 'r') as f:
    content = f.read()

# Replace the pinned product section with safe access
old_pinned = """          <div className="p-5 border-b border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
               <span className="text-xs font-mono text-emerald-400 font-bold">TỒN KHO LIVE: {pinnedProduct.stock} SP</span>
            </div>
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0 relative">
                  <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg">ĐANG GHIM</div>
                  <img src={pinnedProduct.image} alt={pinnedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-white">{pinnedProduct.name}</h3>
                    <div className="inline-block mt-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {pinnedProduct.badge}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                    <span className="text-2xl font-black text-[#EF4444] font-mono">{pinnedProduct.price}</span>
                    <span className="text-xs text-gray-500 line-through font-mono">{pinnedProduct.oldPrice}</span>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-400 font-mono">Đồng bộ Kênh: {pinnedProduct.sync}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => alert(`🔥 ĐÃ ĐẨY DEAL HOT GIẢM 50% CHO SẢN PHẨM "${pinnedProduct.name}" TRÊN STREAM!`)}"""

new_pinned = """          <div className="p-5 border-b border-white/10 relative overflow-hidden group">
            {pinnedProduct ? (
              <>
                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                   <span className="text-xs font-mono text-emerald-400 font-bold">TỒN KHO LIVE: {pinnedProduct.stock} SP</span>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0 relative">
                      <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg">ĐANG GHIM</div>
                      <img src={pinnedProduct.image} alt={pinnedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black text-white">{pinnedProduct.name}</h3>
                        <div className="inline-block mt-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {pinnedProduct.badge}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="text-2xl font-black text-[#EF4444] font-mono">{pinnedProduct.price}</span>
                        <span className="text-xs text-gray-500 line-through font-mono">{pinnedProduct.oldPrice}</span>
                    </div>
                    <div className="mt-1">
                      <p className="text-xs text-gray-400 font-mono">Đồng bộ Kênh: {pinnedProduct.sync}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button 
                        onClick={() => alert(`🔥 ĐÃ ĐẨY DEAL HOT GIẢM 50% CHO SẢN PHẨM "${pinnedProduct.name}" TRÊN STREAM!`)}"""

content = content.replace(old_pinned, new_pinned)

# Also need to close the `</>` for the ternary operator
# We need to find the end of the pinned product section.
old_buttons = """                    onClick={() => alert(`🔥 ĐÃ ĐẨY DEAL HOT GIẢM 50% CHO SẢN PHẨM "${pinnedProduct.name}" TRÊN STREAM!`)}
                    className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black rounded-lg shadow-glow-red transition-all flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" /> PUSH DEAL TỚI KHÁCH
                  </button>
                  <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all">
                    Bỏ Ghim
                  </button>
                </div>
              </div>
            </div>"""

new_buttons = """                    onClick={() => alert(`🔥 ĐÃ ĐẨY DEAL HOT GIẢM 50% CHO SẢN PHẨM "${pinnedProduct.name}" TRÊN STREAM!`)}
                    className="flex-1 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black rounded-lg shadow-glow-red transition-all flex items-center justify-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" /> PUSH DEAL TỚI KHÁCH
                  </button>
                  <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all">
                    Bỏ Ghim
                  </button>
                </div>
              </div>
            </div>
            </>
            ) : (
              <div className="w-full py-10 flex flex-col items-center justify-center text-gray-500">
                 <Package className="w-10 h-10 mb-2 opacity-30" />
                 <p className="text-xs font-bold">CHƯA CÓ SẢN PHẨM ĐƯỢC GHIM</p>
                 <button onClick={() => setProductModalOpen(true)} className="mt-3 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-glow-blue transition-all">THÊM SẢN PHẨM MỚI</button>
              </div>
            )}"""

content = content.replace(old_buttons, new_buttons)

with open('src/components/LiveCommerceStudio.jsx', 'w') as f:
    f.write(content)

