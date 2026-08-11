import React from 'react';
import { CreditCard, Wallet, Landmark, QrCode, DollarSign, History, Settings2, ShieldCheck, RefreshCw } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'PAY-112', orderId: 'ORD-8921', method: 'MOMO', amount: '450,000đ', status: 'SUCCESS', time: 'Vừa xong' },
  { id: 'PAY-111', orderId: 'ORD-8920', method: 'VNPAY', amount: '1,700,000đ', status: 'SUCCESS', time: '15 phút trước' },
  { id: 'PAY-110', orderId: 'ORD-8919', method: 'COD', amount: '280,000đ', status: 'PENDING', time: '1 giờ trước' },
  { id: 'PAY-109', orderId: 'ORD-8918', method: 'VISA', amount: '450,000đ', status: 'REFUNDED', time: '2 giờ trước' },
];

export default function PaymentModule() {
  return (
    <div className="flex flex-col h-full bg-[#0B0B14] text-white">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Payment & Finance
            </h1>
            <p className="text-xs text-gray-400">Quản lý Cổng thanh toán, Lịch sử giao dịch & Đối soát doanh thu</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 flex gap-6 custom-scrollbar">
        {/* Left: Transaction History */}
        <div className="w-2/3 glass-panel p-5 rounded-2xl border border-white/10 bg-black/40 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><History className="w-5 h-5 text-green-400" /> Lịch sử Giao dịch Realtime</h2>
            <button className="px-3 py-1.5 rounded bg-white/5 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition-colors">
              <RefreshCw className="w-3 h-3" /> Làm mới
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b border-white/10 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Mã GD</th>
                  <th className="pb-3 px-2">Mã Đơn</th>
                  <th className="pb-3 px-2">Phương thức</th>
                  <th className="pb-3 px-2 text-right">Số tiền</th>
                  <th className="pb-3 px-2 text-center">Trạng thái</th>
                  <th className="pb-3 px-2 text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYMENTS.map((pay) => (
                  <tr key={pay.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-bold text-gray-400 text-xs">{pay.id}</td>
                    <td className="py-3 px-2 text-blue-400 text-xs cursor-pointer hover:underline">{pay.orderId}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        pay.method === 'MOMO' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                        pay.method === 'VNPAY' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        pay.method === 'VISA' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                        'bg-gray-700/50 text-gray-300 border border-gray-600'
                      }`}>
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-gray-200">{pay.amount}</td>
                    <td className="py-3 px-2 text-center">
                      {pay.status === 'SUCCESS' && <span className="text-emerald-400 text-[10px] font-bold"><ShieldCheck className="w-3 h-3 inline mr-1" />Thành công</span>}
                      {pay.status === 'PENDING' && <span className="text-yellow-400 text-[10px] font-bold">Chờ thanh toán</span>}
                      {pay.status === 'REFUNDED' && <span className="text-red-400 text-[10px] font-bold">Đã hoàn tiền</span>}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500 text-[10px]">{pay.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Gateways & Config */}
        <div className="w-1/3 flex flex-col gap-4">
           {/* Summary */}
           <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-green-900/20 to-black">
             <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Doanh thu đã thu tiền (Hôm nay)</div>
             <div className="text-3xl font-black text-white flex items-center gap-2 mb-4">
               <DollarSign className="w-6 h-6 text-green-500" /> 25,400,000đ
             </div>
             <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(22,163,74,0.3)] transition-colors">
               Rút Tiền (Settlement)
             </button>
           </div>

           {/* Gateway Config */}
           <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/20 flex-1">
             <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Settings2 className="w-4 h-4 text-gray-400" /> Cấu hình Cổng Thanh Toán</h3>
             <div className="space-y-3">
               
               {/* MoMo */}
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-pink-500/30">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-pink-500/10 flex items-center justify-center"><Wallet className="w-4 h-4 text-pink-500" /></div>
                   <div>
                     <div className="text-xs font-bold text-gray-200">Ví MoMo</div>
                     <div className="text-[10px] text-gray-500">Đã kết nối</div>
                   </div>
                 </div>
                 <div className="w-8 h-4 rounded-full relative cursor-pointer bg-green-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                 </div>
               </div>

               {/* VNPay */}
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-blue-500/30">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center"><QrCode className="w-4 h-4 text-blue-500" /></div>
                   <div>
                     <div className="text-xs font-bold text-gray-200">VNPay QR</div>
                     <div className="text-[10px] text-gray-500">Đã kết nối</div>
                   </div>
                 </div>
                 <div className="w-8 h-4 rounded-full relative cursor-pointer bg-green-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                 </div>
               </div>

               {/* Bank Transfer */}
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-gray-700/50 flex items-center justify-center"><Landmark className="w-4 h-4 text-gray-400" /></div>
                   <div>
                     <div className="text-xs font-bold text-gray-200">Chuyển khoản NH</div>
                     <div className="text-[10px] text-gray-500">Thiết lập STK...</div>
                   </div>
                 </div>
                 <button className="text-[10px] px-2 py-1 bg-white/10 hover:bg-white/20 rounded">Cấu hình</button>
               </div>

               {/* COD */}
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-white/10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-gray-700/50 flex items-center justify-center"><Box className="w-4 h-4 text-gray-400" /></div>
                   <div>
                     <div className="text-xs font-bold text-gray-200">Thanh toán khi nhận (COD)</div>
                     <div className="text-[10px] text-gray-500">Mặc định</div>
                   </div>
                 </div>
                 <div className="w-8 h-4 rounded-full relative cursor-pointer bg-green-500">
                    <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white left-4.5 right-0.5" style={{ left: '18px' }} />
                 </div>
               </div>

             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
// Placeholder Box icon for COD
const Box = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
