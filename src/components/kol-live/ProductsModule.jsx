import React, { useState } from 'react';
import { Package, Search, Plus, Filter, Edit2, Trash2, Tag, Image as ImageIcon, CheckCircle2, Box } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 'P01', name: 'Combo Skincare Sáng Da', sku: 'SKC-01', price: '450,000đ', stock: 120, category: 'Mỹ phẩm' },
  { id: 'P02', name: 'Serum Phục Hồi B5', sku: 'SRM-B5', price: '280,000đ', stock: 45, category: 'Mỹ phẩm' },
  { id: 'P03', name: 'Set Váy Dạ Tweed', sku: 'FAS-TW01', price: '850,000đ', stock: 0, category: 'Thời trang' },
  { id: 'P04', name: 'Son Tint Bóng Môi', sku: 'LIP-09', price: '150,000đ', stock: 350, category: 'Trang điểm' },
];

export default function ProductsModule() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Product Management
            </h1>
            <p className="text-xs text-gray-400">Quản lý Kho sản phẩm Livestream: SKU, Biến thể, Giá, Danh mục</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left: Product List */}
        <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Danh Sách Sản Phẩm</h2>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">Total: 48</span>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input type="text" placeholder="Tìm tên, SKU..." className="pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-xs outline-none focus:border-blue-500 text-white" />
              </div>
              <button className="p-2 rounded-lg bg-black/60 border border-white/10 hover:bg-white/10">
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Ảnh</th>
                  <th className="pb-3 px-2">Tên sản phẩm</th>
                  <th className="pb-3 px-2">SKU</th>
                  <th className="pb-3 px-2">Phân loại</th>
                  <th className="pb-3 px-2">Giá niêm yết</th>
                  <th className="pb-3 px-2">Tồn kho</th>
                  <th className="pb-3 px-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PRODUCTS.map((prod) => (
                  <tr key={prod.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-2">
                      <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold text-gray-200">{prod.name}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{prod.sku}</td>
                    <td className="py-3 px-2"><span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-300">{prod.category}</span></td>
                    <td className="py-3 px-2 text-blue-400 font-bold">{prod.price}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${prod.stock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {prod.stock > 0 ? `${prod.stock} sẵn sàng` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="p-1.5 text-gray-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Add Product Form Placeholder */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 mb-4 cursor-pointer hover:bg-blue-500/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-blue-400">Tạo Sản Phẩm Mới</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1 overflow-auto custom-scrollbar">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-indigo-400" /> Chi tiết Sản phẩm</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Tên Sản Phẩm (Hiển thị Live)</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="Combo Skincare Sáng Da" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Mã SKU</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="SKC-01" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Barcode</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="893..." />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">Biến Thể (Variants)</label>
                <div className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Size M - Màu Đỏ</span>
                    <span className="text-blue-400">250,000đ</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Size L - Màu Đen</span>
                    <span className="text-blue-400">250,000đ</span>
                  </div>
                  <button className="text-xs text-indigo-400 mt-2 flex items-center gap-1"><Plus className="w-3 h-3" /> Thêm biến thể</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Giá Bán (VNĐ)</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="450,000" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Số Lượng Tồn Kho</label>
                  <input type="number" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-indigo-500 outline-none" defaultValue="120" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-2">Hình ảnh / Video hiển thị Livestream</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-600" />
                    </div>
                  ))}
                  <div className="aspect-square bg-indigo-500/20 rounded-lg border border-indigo-500/50 flex items-center justify-center cursor-pointer hover:bg-indigo-500/30">
                    <Plus className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
              </div>

              <button className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold flex items-center justify-center gap-2 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Lưu Sản Phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
