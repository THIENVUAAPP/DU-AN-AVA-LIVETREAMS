import React, { useState } from 'react';
import { Boxes, Search, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Barcode } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: 'SKC-01', name: 'Combo Skincare Sáng Da', inStock: 120, incoming: 50, reserved: 12, alert: false },
  { id: 'SRM-B5', name: 'Serum Phục Hồi B5', inStock: 45, incoming: 0, reserved: 30, alert: true }, // sắp hết
  { id: 'FAS-TW01', name: 'Set Váy Dạ Tweed (Size M)', inStock: 0, incoming: 100, reserved: 0, alert: true }, // hết hàng
  { id: 'LIP-09', name: 'Son Tint Bóng Môi', inStock: 350, incoming: 0, reserved: 15, alert: false },
];

export default function InventoryModule() {
  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Inventory & Warehouse
            </h1>
            <p className="text-xs text-gray-400">Quản lý Kho, Nhập/Xuất, Cảnh báo tồn kho & Quét mã vạch</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left: Inventory List */}
        <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Danh sách Tồn Kho</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input type="text" placeholder="Tìm theo SKU, Barcode..." className="pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-xs outline-none focus:border-cyan-500 text-white" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">SKU</th>
                  <th className="pb-3 px-2">Tên sản phẩm</th>
                  <th className="pb-3 px-2 text-right">Tồn kho</th>
                  <th className="pb-3 px-2 text-right">Đang về (Nhập)</th>
                  <th className="pb-3 px-2 text-right">Đã giữ (Chờ giao)</th>
                  <th className="pb-3 px-2 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${item.alert ? 'bg-red-500/5' : ''}`}>
                    <td className="py-3 px-2 font-bold text-gray-300 text-xs">{item.id}</td>
                    <td className="py-3 px-2 text-gray-200">{item.name}</td>
                    <td className={`py-3 px-2 text-right font-bold ${item.inStock === 0 ? 'text-red-500' : 'text-cyan-400'}`}>{item.inStock}</td>
                    <td className="py-3 px-2 text-right text-yellow-500">{item.incoming}</td>
                    <td className="py-3 px-2 text-right text-gray-400">{item.reserved}</td>
                    <td className="py-3 px-2 text-center">
                      {item.alert ? (
                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center gap-1 w-fit mx-auto">
                          <AlertTriangle className="w-3 h-3" /> {item.inStock === 0 ? 'Hết hàng' : 'Sắp hết'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Đủ hàng
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button className="glass-panel p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-2">
              <ArrowDownToLine className="w-6 h-6 text-emerald-400" />
              <span className="text-sm font-bold text-gray-300">Nhập Kho (In)</span>
            </button>
            <button className="glass-panel p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 transition-colors flex flex-col items-center justify-center gap-2">
              <ArrowUpFromLine className="w-6 h-6 text-red-400" />
              <span className="text-sm font-bold text-gray-300">Xuất Kho (Out)</span>
            </button>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Barcode className="w-4 h-4 text-cyan-400" /> Quét Barcode / QR</h3>
             <div className="aspect-video bg-black/60 border border-white/5 rounded-xl mb-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full h-0.5 bg-cyan-500/50 absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse" />
                <span className="text-gray-600 text-xs mt-8">Đưa mã vạch vào camera...</span>
             </div>
             <p className="text-[10px] text-gray-400 text-center mb-4">Hệ thống sẽ tự động nhận diện SKU và cập nhật số lượng nhập/xuất kho.</p>
             <div className="flex gap-2">
               <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Nhập thủ công</button>
               <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">Kiểm kê nhanh</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
