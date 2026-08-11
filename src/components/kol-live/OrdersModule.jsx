import React, { useState } from 'react';
import { Receipt, Search, Filter, Printer, Download, Clock, CheckCircle, Package, XCircle, AlertTriangle } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 'ORD-8921', customer: 'Nguyễn Thị Hương', items: 'Combo Skincare (x1)', total: '450,000đ', status: 'pending', time: 'Vừa xong', source: 'TikTok' },
  { id: 'ORD-8920', customer: 'Trần Văn Mạnh', items: 'Set Váy Dạ Tweed (x2)', total: '1,700,000đ', status: 'packing', time: '15 phút trước', source: 'Facebook' },
  { id: 'ORD-8919', customer: 'Lê Hoa', items: 'Serum Phục Hồi B5 (x1)', total: '280,000đ', status: 'shipped', time: '1 giờ trước', source: 'TikTok' },
  { id: 'ORD-8918', customer: 'Khách Ẩn Danh', items: 'Son Tint Bóng Môi (x3)', total: '450,000đ', status: 'cancelled', time: '2 giờ trước', source: 'Web' },
];

export default function OrdersModule() {
  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Order Management
            </h1>
            <p className="text-xs text-gray-400">Quản lý Đơn hàng, Trạng thái Giao hàng & In vận đơn</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 custom-scrollbar">
        
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 flex-shrink-0">
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
             <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Chờ Xác Nhận</div>
             <div className="text-2xl font-black text-white flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-500" /> 145</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
             <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Đang Đóng Gói</div>
             <div className="text-2xl font-black text-white flex items-center gap-2"><Package className="w-5 h-5 text-blue-500" /> 89</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
             <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Đang Giao Hàng</div>
             <div className="text-2xl font-black text-white flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> 210</div>
          </div>
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
             <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Hoàn/Hủy Đơn</div>
             <div className="text-2xl font-black text-white flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /> 12</div>
          </div>
        </div>

        {/* Order List */}
        <div className="flex-1 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Danh sách Đơn hàng (Realtime)</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold animate-pulse">LIVE SYNC</span>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input type="text" placeholder="Tìm Mã đơn, Tên KH..." className="pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-lg text-xs outline-none focus:border-yellow-500 text-white" />
              </div>
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold flex items-center gap-2 transition-colors">
                <Printer className="w-4 h-4" /> In Vận Đơn Hàng Loạt (145)
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Mã Đơn</th>
                  <th className="pb-3 px-2">Thời gian</th>
                  <th className="pb-3 px-2">Khách hàng</th>
                  <th className="pb-3 px-2">Sản phẩm</th>
                  <th className="pb-3 px-2">Tổng tiền</th>
                  <th className="pb-3 px-2">Nguồn</th>
                  <th className="pb-3 px-2">Trạng thái</th>
                  <th className="pb-3 px-2 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-bold text-gray-200">{order.id}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{order.time}</td>
                    <td className="py-3 px-2 text-gray-300">{order.customer}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs truncate max-w-[200px]">{order.items}</td>
                    <td className="py-3 px-2 text-yellow-400 font-bold">{order.total}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-gray-300 border border-white/10">{order.source}</span>
                    </td>
                    <td className="py-3 px-2">
                      {order.status === 'pending' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Chờ xác nhận</span>}
                      {order.status === 'packing' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">Đang gói hàng</span>}
                      {order.status === 'shipped' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Đang giao</span>}
                      {order.status === 'cancelled' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">Đã hủy</span>}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-[10px] px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors mr-1">Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
