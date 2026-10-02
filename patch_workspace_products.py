import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update handleAddProduct to include new fields
old_add = """      const newProduct = { 
        id: nextId, 
        active: true, 
        productName: `Sản phẩm mới ${nextId}`, 
        keywords: '', 
        priceInfo: '',
        videoFolder: '', 
        videoUrl: '',
        supportVideoFolder: '', 
        useAi: true, 
        useTTS: true, 
        ttsVoiceRole: 'idol', 
        muteSourceVideo: true, 
        aiPrompt: '' 
      };"""

new_add = """      const newProduct = { 
        id: nextId, 
        active: true, 
        productName: `Sản phẩm mới ${nextId}`, 
        keywords: '', 
        priceInfo: '',
        oldPrice: '',
        buyUrl: '',
        imageUrl: '',
        videoFolder: '', 
        videoUrl: '',
        supportVideoFolder: '', 
        useAi: true, 
        useTTS: true, 
        ttsVoiceRole: 'idol', 
        muteSourceVideo: true, 
        aiPrompt: '' 
      };"""
content = content.replace(old_add, new_add)

# 2. Add new handler functions below handleDeleteProduct
old_delete = """  const handleDeleteProduct = (id) => {
    if (!window.confirm(`Xác nhận xóa sản phẩm / mã hàng #${id}?`)) return;
    setEventConfigs(prev => {
      const targetEvent = 'checkout';
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: (prev[targetEvent]?.checkoutProducts || []).filter(p => p.id !== id)
        }
      };
    });
    toast.success(`Đã xóa sản phẩm #${id}`);
  };"""

new_delete = old_delete + """

  const handleDuplicateProduct = (prodToCopy) => {
    setEventConfigs(prev => {
      const targetEvent = 'checkout';
      const currentProducts = prev[targetEvent]?.checkoutProducts || [];
      const nextId = currentProducts.length > 0 ? Math.max(...currentProducts.map(p => p.id)) + 1 : 1;
      const newProduct = { ...prodToCopy, id: nextId, productName: prodToCopy.productName + ' (Copy)' };
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: [...currentProducts, newProduct]
        }
      };
    });
    toast.success(`Đã nhân bản sản phẩm thành Mã #${nextId}`);
  };

  const handleMoveProduct = (id, direction) => {
    setEventConfigs(prev => {
      const targetEvent = 'checkout';
      const currentProducts = [...(prev[targetEvent]?.checkoutProducts || [])];
      const index = currentProducts.findIndex(p => p.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index > 0) {
        [currentProducts[index - 1], currentProducts[index]] = [currentProducts[index], currentProducts[index - 1]];
      } else if (direction === 'down' && index < currentProducts.length - 1) {
        [currentProducts[index], currentProducts[index + 1]] = [currentProducts[index + 1], currentProducts[index]];
      }
      return {
        ...prev,
        [targetEvent]: {
          ...prev[targetEvent],
          checkoutProducts: currentProducts
        }
      };
    });
  };
"""
content = content.replace(old_delete, new_delete)

# 3. Add buttons for Duplicate, Move Up, Move Down
old_buttons = """                            <button 
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-300 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer"
                            >
                              Xóa
                            </button>"""

new_buttons = """                            <button 
                              onClick={() => handleMoveProduct(prod.id, 'up')}
                              className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer bg-white"
                              title="Di chuyển lên"
                            >
                              ⬆️
                            </button>
                            <button 
                              onClick={() => handleMoveProduct(prod.id, 'down')}
                              className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer bg-white"
                              title="Di chuyển xuống"
                            >
                              ⬇️
                            </button>
                            <button 
                              onClick={() => handleDuplicateProduct(prod)}
                              className="text-xs text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-300 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer bg-blue-50"
                              title="Nhân bản ô sản phẩm này"
                            >
                              📄 Nhân bản
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="text-xs text-red-500 hover:text-white hover:bg-red-500 border border-red-300 px-2 py-0.5 rounded-md transition-colors font-semibold cursor-pointer bg-red-50"
                            >
                              Xóa
                            </button>"""
content = content.replace(old_buttons, new_buttons)

# 4. Modify Price inputs and add Buy URL and Image URL
old_price = """                            <div>
                              <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                                <span>💰 Giá niêm yết & Giá Flash Sale:</span>
                                <HelpTooltip helpKey="productPrice" />
                              </div>
                              <input 
                                type="text" 
                                value={prod.priceInfo || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'priceInfo', e.target.value)} 
                                placeholder="Ví dụ: Giá gốc 1.850.000đ - Giá live 890.000đ"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>"""

new_price = """                            <div>
                              <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                                <span>💰 Giá bán / Flash Sale:</span>
                                <HelpTooltip helpKey="productPrice" />
                              </div>
                              <input 
                                type="text" 
                                value={prod.priceInfo || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'priceInfo', e.target.value)} 
                                placeholder="Ví dụ: 890.000đ"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full" 
                              />
                            </div>
                            
                            <div>
                              <div className="flex items-center text-xs font-bold text-gray-700 mb-1">
                                <span>🏷️ Giá gốc (Gạch ngang):</span>
                              </div>
                              <input 
                                type="text" 
                                value={prod.oldPrice || ''} 
                                onChange={(e) => handleProductChange(prod.id, 'oldPrice', e.target.value)} 
                                placeholder="Ví dụ: 1.850.000đ"
                                className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-blue-500 w-full text-gray-500 line-through" 
                              />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2">
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
content = content.replace(old_price, new_price)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
