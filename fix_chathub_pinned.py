import re

with open('src/components/UnifiedChatHub.jsx', 'r') as f:
    content = f.read()

# Replace the pinned product section with safe access
old_pinned = """          {/* PINNED PRODUCT */}
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
                      <span className="block text-[10px] font-bold text-amber-500/70 mb-0.5 uppercase tracking-wide">Khuyến mãi</span>
                      <strong className="text-sm font-black text-amber-400">{pinned.promotions}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <button className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black rounded-xl shadow-glow-pink transition-all flex items-center justify-center gap-2">
                      <Store className="w-4 h-4" /> ĐẨY DEAL NÀY LÊN ĐA NỀN TẢNG (PUSH DEAL)
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}"""

new_pinned = """          {/* PINNED PRODUCT */}
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
                        <span className="block text-[10px] font-bold text-amber-500/70 mb-0.5 uppercase tracking-wide">Khuyến mãi</span>
                        <strong className="text-sm font-black text-amber-400">{pinned.promotions}</strong>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <button className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black rounded-xl shadow-glow-pink transition-all flex items-center justify-center gap-2">
                        <Store className="w-4 h-4" /> ĐẨY DEAL NÀY LÊN ĐA NỀN TẢNG (PUSH DEAL)
                      </button>
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
          })()}"""

content = content.replace(old_pinned, new_pinned)

with open('src/components/UnifiedChatHub.jsx', 'w') as f:
    f.write(content)

