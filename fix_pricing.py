import re

with open("src/components/SalesLandingPage.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# I will replace the whole mapping block from `{plans.map((plan, i) => (` to `</RevealOnScroll>\n          ))}`
# First I need to find the exact block.

start_str = r"          \{plans\.map\(\(plan, i\) => \(\n            <RevealOnScroll key=\{i\} className=\{`relative rounded-\[2rem\] border bg-\[\#0d0d16\]"
end_str = r"            <\/RevealOnScroll>\n          \)\)\}"

pattern = start_str + r".*?" + end_str

new_block = """          {plans.map((plan, i) => (
            <RevealOnScroll key={i} className={`relative flex flex-col h-full rounded-[2rem] border bg-[#0B0B13]/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer active:scale-95 group ${plan.borderColor} ${plan.isPopular ? 'shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50 md:-translate-y-4' : 'hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20'}`} onClick={() => handlePurchase(plan)}>
              
              {/* Glassmorphism shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-5 rounded-bl-2xl shadow-[0_4px_15px_rgba(59,130,246,0.5)] z-10">
                  Phổ Biến
                </div>
              )}

              <div className="p-8 pb-6 text-center border-b border-white/5 relative z-10 flex flex-col items-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${plan.color} bg-opacity-10 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                   {plan.icon}
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-6 min-h-[32px] font-medium leading-relaxed">{plan.desc}</p>
                
                <div className="flex flex-col items-center justify-center min-h-[85px] w-full">
                  {plan.monthly === 0 ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         MIỄN PHÍ
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-semibold uppercase tracking-wider">Mãi mãi</div>
                     </>
                  ) : plan.name === 'TRỌN ĐỜI' ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ/tháng</span>
                       </div>
                     </>
                  ) : billingCycle === 'monthly' ? (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs font-medium">/tháng</div>
                     </>
                  ) : (
                     <>
                       <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} drop-shadow-sm`}>
                         {plan.monthly.toLocaleString()}đ
                       </span>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-gray-600 text-[11px] line-through decoration-red-500/50">{plan.oldMonthly.toLocaleString()}đ</span>
                         <span className="text-gray-500 text-xs font-medium">/tháng</span>
                       </div>
                       <div className="text-emerald-400 text-[10px] font-bold mt-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 whitespace-nowrap shadow-[0_0_10px_rgba(16,185,129,0.2)]">Thanh toán {plan.yearly.toLocaleString()}đ/năm</div>
                     </>
                  )}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handlePurchase(plan); }}
                  className={`w-full mt-6 py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r ${plan.color} shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 active:scale-95 uppercase tracking-wider`}
                >
                  {plan.btnText}
                </button>
              </div>

              <div className="p-8 space-y-4 bg-gradient-to-b from-transparent to-black/20 flex-1 relative z-10">
                {plan.features.map((feat, j) => (
                  <div className="flex items-start gap-3 group/feat" key={j}>
                    <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-gradient-to-br ${plan.color} shadow-sm group-hover/feat:scale-110 transition-transform`}>
                       <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover/feat:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          ))}"""

content = re.sub(pattern, new_block, content, flags=re.DOTALL)

with open("src/components/SalesLandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated pricing block")
