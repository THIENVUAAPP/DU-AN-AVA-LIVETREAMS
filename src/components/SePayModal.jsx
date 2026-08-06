import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Copy, RefreshCw, Clock, X, Scan } from 'lucide-react';
import { syncPaymentToSupabase, supabase } from '../lib/supabaseClient';

export default function SePayModal({ isOpen, onClose, plan, billingCycle, currentUser, onSuccess }) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [copiedField, setCopiedField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
  const priceDisplay = price.toLocaleString() + '₫';
  const orderCode = `AVA${Math.floor(Math.random() * 90000) + 10000}`;
  
  // URL tạo mã QR VietQR (Cổng SePay / VietQR)
  const bankAccount = "19036789012345";
  const bankName = "Techcombank";
  const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bankName}&amount=${price}&des=${orderCode}`;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsVerifying(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    // Sync to Supabase
    await syncPaymentToSupabase({
      plan: plan.name.replace('Gói ', ''),
      amount: price,
      referenceCode: orderCode,
      status: 'completed',
      email: currentUser?.email
    });
    
    setIsVerifying(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121216] border border-[#3f3f46] rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white">
           <X className="w-6 h-6" />
        </button>

        {/* Left Side: Order Details */}
        <div className="w-full md:w-2/5 bg-[#0a0a0f] p-8 border-r border-[#3f3f46] flex flex-col justify-between">
           <div>
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase mb-6">
                <ShieldCheck className="w-4 h-4" /> BẢO MẬT SSL
             </div>
             <h3 className="text-2xl font-black text-white mb-2">Thanh Toán</h3>
             <p className="text-gray-400 text-sm mb-6">Bạn đang nâng cấp lên gói dịch vụ cao cấp của AvaLive.</p>
             
             <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
                <div className="text-xs text-gray-400 mb-1">Gói dịch vụ</div>
                <div className="text-lg font-black text-white mb-3">{plan.name} <span className="text-sm font-normal text-gray-400">({billingCycle === 'yearly' ? 'Năm' : 'Tháng'})</span></div>
                
                <div className="text-xs text-gray-400 mb-1">Tài khoản</div>
                <div className="text-sm font-medium text-white break-all">{currentUser?.email}</div>
             </div>
           </div>

           <div>
              <div className="flex justify-between items-center text-gray-400 text-sm mb-2">
                <span>Tổng phụ</span>
                <span>{priceDisplay}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
                <span>Thuế VAT (10%)</span>
                <span>0₫</span>
              </div>
              <div className="h-px bg-white/10 mb-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-bold">Thành tiền</span>
                <span className="text-3xl font-black text-[#00f2fe]">{priceDisplay}</span>
              </div>
           </div>
        </div>

        {/* Right Side: QR Code & Bank Info */}
        <div className="w-full md:w-3/5 p-8 flex flex-col items-center">
           <div className="flex items-center gap-2 text-amber-400 mb-6 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
              <Clock className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-bold">Thời gian giữ giá: <span className="font-mono">{formatTimer(timeLeft)}</span></span>
           </div>

           <div className="bg-white p-2 rounded-2xl shadow-xl mb-6 relative group">
              <img src={qrUrl} alt="VietQR" className="w-48 h-48 rounded-xl" />
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Scan className="w-10 h-10 text-white" />
              </div>
           </div>

           <div className="w-full space-y-3 mb-8">
              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Ngân hàng</span>
                   <span className="text-sm font-medium text-white">{bankName}</span>
                 </div>
              </div>
              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Số tài khoản</span>
                   <span className="text-sm font-bold text-[#00f2fe]">{bankAccount}</span>
                 </div>
                 <button onClick={() => copyToClipboard(bankAccount, 'stk')} className="text-gray-400 hover:text-white flex items-center gap-1">
                   {copiedField === 'stk' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>
              <div className="flex justify-between items-center bg-[#1c1c22] p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Nội dung chuyển khoản</span>
                   <span className="text-sm font-bold text-amber-400">{orderCode}</span>
                 </div>
                 <button onClick={() => copyToClipboard(orderCode, 'nd')} className="text-gray-400 hover:text-white flex items-center gap-1">
                   {copiedField === 'nd' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                 </button>
              </div>
           </div>

           <button 
             onClick={handleSimulatePayment}
             disabled={isVerifying}
             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
             {isVerifying ? 'ĐANG KIỂM TRA GIAO DỊCH...' : 'TÔI ĐÃ CHUYỂN KHOẢN (SIMULATE)'}
           </button>
           
           <p className="text-center text-[10px] text-gray-500 mt-4 flex items-center justify-center gap-1">
             <Lock className="w-3 h-3" /> Giao dịch được bảo mật bởi SePay Vietnam
           </p>
        </div>

      </div>
    </div>
  );
}
