import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_link = """                            <div className="col-span-1 md:col-span-2">
                              <div className="flex items-center text-xs font-bold text-emerald-700 mb-1">
                                <span>🔗 Link Mua Hàng (TikTok Shop / Shopee / Affiliate):</span>
                              </div>
                              <input 
                                type="text" 
                                value={prod.buyUrl || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'buyUrl', e.target.value)} 
                                placeholder="Dán đường link sản phẩm để khách click trực tiếp vào mua hàng"
                                className="border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs bg-emerald-50 focus:bg-white focus:outline-emerald-500 w-full" 
                              />
                            </div>"""

new_link = """                            <div>
                              <div className="flex items-center text-xs font-bold text-emerald-700 mb-1">
                                <span>🔗 Link Mua Hàng (TikTok Shop/Shopee):</span>
                              </div>
                              <input 
                                type="text" 
                                value={prod.buyUrl || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'buyUrl', e.target.value)} 
                                placeholder="Dán đường link mua hàng..."
                                className="border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs bg-emerald-50 focus:bg-white focus:outline-emerald-500 w-full" 
                              />
                            </div>
                            
                            <div>
                              <div className="flex items-center text-xs font-bold text-indigo-700 mb-1">
                                <span>🖼️ Link Ảnh Sản Phẩm (Hiển thị góc Live):</span>
                              </div>
                              <input 
                                type="text" 
                                value={prod.imageUrl || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'imageUrl', e.target.value)} 
                                placeholder="Dán link ảnh (.jpg, .png) hoặc tải lên..."
                                className="border border-indigo-300 rounded-lg px-2.5 py-1.5 text-xs bg-indigo-50 focus:bg-white focus:outline-indigo-500 w-full" 
                              />
                            </div>"""

content = content.replace(old_link, new_link)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
