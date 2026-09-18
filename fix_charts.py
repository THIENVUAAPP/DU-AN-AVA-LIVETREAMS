import re

with open("src/components/AdminDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix Line Chart Panel
line_chart_pattern = r'2\.450\.789\.000₫.*?18\.6% so với kỳ trước'
replacement_line_chart = '{formatVND(totalRevenue)} \n                    <span className="text-sm text-emerald-500 font-bold flex items-center mb-1"><ArrowUpRight className="w-4 h-4 mr-0.5"/> +0% so với kỳ trước'
content = re.sub(line_chart_pattern, replacement_line_chart, content, flags=re.DOTALL)

# Fix Donut Chart Center Value
donut_center_pattern = r'<span className="text-2xl font-black text-white">2\.45B</span>'
donut_center_replacement = '<span className="text-2xl font-black text-white">{totalRevenue > 0 ? (totalRevenue / 1000000).toFixed(1) + "M" : "0"}</span>'
content = content.replace(donut_center_pattern, donut_center_replacement)

# Fix Donut Chart Legend
donut_legend_pattern = r'<div className="w-full mt-8 space-y-3">.*?</div>\n              </div>'
donut_legend_replacement = """<div className="w-full mt-8 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-gray-300 font-medium">Gói thành viên</span></div>
                      <div className="text-right"><div className="font-bold text-white">{totalRevenue > 0 ? '100%' : '0%'}</div><div className="text-[10px] text-gray-500">{formatVND(totalRevenue)}</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-gray-300 font-medium">Ứng dụng / Sản phẩm</span></div>
                      <div className="text-right"><div className="font-bold text-white">0%</div><div className="text-[10px] text-gray-500">0đ</div></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-gray-300 font-medium">Nạp tiền / Credits</span></div>
                      <div className="text-right"><div className="font-bold text-white">0%</div><div className="text-[10px] text-gray-500">0đ</div></div>
                    </div>
                 </div>
              </div>"""
content = re.sub(donut_legend_pattern, donut_legend_replacement, content, flags=re.DOTALL)

with open("src/components/AdminDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
