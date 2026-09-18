import re

with open("src/components/UserProfile.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the static plan block with dynamic realtime calculation
static_plan_block = r"""                   \{\/\* GÓI CƯỚC \(Mini\) \*\/\}
                   <div className="flex items-center justify-between p-3 bg=\[\#0A0A0E\] border border-white\/10 rounded-xl mt-2">.*?<\/div>\n                      <\/div>\n                   <\/div>"""

dynamic_plan_block = """                   {/* GÓI CƯỚC (Mini) */}
                   <div className="flex items-center justify-between p-3 bg-[#0A0A0E] border border-white/10 rounded-xl mt-2">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Package className="w-4 h-4 text-purple-400" /></div>
                         <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Gói hiện tại</p>
                            <p className="text-sm font-black text-white leading-tight">
                               {currentUser?.plan === 'VIP' ? <span className="text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">VIP</span> :
                                currentUser?.plan === 'PRO' ? <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">PRO</span> :
                                currentUser?.plan === 'STARTER' ? <span className="text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">STARTER</span> : 
                                <span className="text-gray-400">FREE</span>}
                            </p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Thời hạn</p>
                         <div className="text-xs font-bold text-white">
                            {(() => {
                               if (currentUser?.plan === 'FREE' || !currentUser?.plan_expires_at) return <span className="text-gray-500 text-[10px]">Vô thời hạn</span>;
                               const diff = new Date(currentUser.plan_expires_at).getTime() - new Date().getTime();
                               const days = Math.ceil(diff / (1000 * 3600 * 24));
                               return days > 0 ? <span className="text-emerald-400">{days} ngày</span> : <span className="text-red-500">Hết hạn</span>;
                            })()}
                         </div>
                      </div>
                   </div>"""

content = re.sub(static_plan_block, dynamic_plan_block, content, flags=re.DOTALL)

with open("src/components/UserProfile.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated UserProfile.jsx to dynamic realtime plan days")
