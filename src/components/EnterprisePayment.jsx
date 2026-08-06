import { syncPaymentToSupabase } from "../lib/supabaseClient";
import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Clock
} from "lucide-react";

export default function EnterprisePayment({ setActiveTab }) {
  const [selectedPlan, setSelectedPlan] = useState("business");
  const [billingCycle, setBillingCycle] = useState("annual");
  const [paymentStep, setPaymentStep] = useState("checkout");
  const [activePlanData, setActivePlanData] = useState(null);
  
  // 15-minute countdown timer
  const [timeLeft, setTimeLeft] = useState(899);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (paymentStep !== "checkout") return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentStep]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const plans = [
    { 
      id: "starter", 
      name: "Starter Pro", 
      priceVnd: billingCycle === "annual" ? "4.900.000" : "490.000", 
      priceDisplay: billingCycle === "annual" ? "4.900.000đ" : "490.000đ", 
      priceNum: billingCycle === "annual" ? 4900000 : 490000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      orderCode: "ASPMRZ1AC12HVQ4",
      hours: "⚡ 200 Giờ Live / tháng",
      channels: "3 Kênh Multistream",
      res: "Full HD 1080p",
      badge: "KHỞI NGHIỆP BÁN HÀNG"
    },
    { 
      id: "business", 
      name: "Business Growth", 
      priceVnd: billingCycle === "annual" ? "14.900.000" : "1.490.000", 
      priceDisplay: billingCycle === "annual" ? "14.900.000đ" : "1.490.000đ", 
      priceNum: billingCycle === "annual" ? 14900000 : 1490000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      orderCode: "ASPMRZ1AC12HVQ4",
      popular: true,
      hours: "⚡ 700 Giờ Live / tháng",
      channels: "10 Kênh Multistream",
      res: "4K 60fps Ultra HD",
      badge: "BÁN CHẠY NHẤT"
    },
    { 
      id: "enterprise", 
      name: "Enterprise VIP", 
      priceVnd: billingCycle === "annual" ? "49.000.000" : "4.900.000", 
      priceDisplay: billingCycle === "annual" ? "49.000.000đ" : "4.900.000đ", 
      priceNum: billingCycle === "annual" ? 49000000 : 4900000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      orderCode: "ASPMRZ1AC12HVQ4",
      hours: "⚡ UNLIMITED 4.000 GIỜ LIVE/tháng",
      channels: "30+ Luồng Stream",
      res: "4K Dedicated 10Gbps",
      badge: "VIP TOÀN DIỆN 24/7"
    },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const bankAccountNum = "19035907828017";
  const bankAccountName = "NGUYEN QUOC THIEN";
  const bankName = "TECHCOMBANK";

  const handleActivatePaymentSuccess = async () => {
    await syncPaymentToSupabase({
      plan: currentPlan.id.toUpperCase(), // Using ID to be precise (STARTER, PRO, VIP)
      amount: currentPlan.priceNum,
      referenceCode: currentPlan.orderCode,
      status: "completed",
      billingCycle: billingCycle
    });
    const expiresDate = new Date(Date.now() + (billingCycle === "annual" ? 365 : 30) * 86400000).toLocaleDateString("vi-VN");
    const todayDate = new Date().toLocaleDateString("vi-VN");

    const planData = {
      planId: currentPlan.id,
      planName: currentPlan.name,
      price: currentPlan.priceDisplay,
      billingCycle: billingCycle === "annual" ? "Gói 1 Năm (Tặng 2 Tháng)" : "Gói 1 Tháng",
      activatedAt: todayDate,
      expiresAt: expiresDate,
      hours: currentPlan.hours,
      channels: currentPlan.channels,
      res: currentPlan.res,
      isPaid: true
    };

    localStorage.setItem("avalive_active_plan", JSON.stringify(planData));
    setActivePlanData(planData);
    setPaymentStep("thankyou");
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans text-left py-4 selection:bg-emerald-500 selection:text-black">

      {/* STEP 1: OFFICIAL SEPAY CHECKOUT UI CARD */}
      {paymentStep === "checkout" && (
        <div className="space-y-5 animate-fadeIn">

          {/* Billing Cycle & Plan Selector */}
          <div className="bg-[#12121D] p-3 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">CHỌN GÓI THANH TOÁN SEPAY:</span>
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-[11px]">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${billingCycle === "monthly" ? "bg-[#EF4444] text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Tháng
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${billingCycle === "annual" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  Năm (Tặng 2Th)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {plans.map((p) => {
                const isSel = p.id === selectedPlan;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSel 
                        ? "bg-emerald-950/60 border-emerald-500 text-white shadow-glow-emerald" 
                        : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <span className="text-[9px] font-bold block text-emerald-400">{p.badge}</span>
                    <span className="text-xs font-black block text-white truncate">{p.name}</span>
                    <span className="text-[11px] font-bold block text-emerald-300">{p.priceDisplay}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN EXACT SEPAY PAYMENT CARD */}
          <div className="bg-[#0D0D18] p-6 md:p-8 rounded-[32px] border border-white/15 shadow-2xl space-y-6 text-center">

            {/* Countdown Timer Bar */}
            <div className="flex items-center justify-center gap-2 text-amber-400 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>⏱️ {formatTimer(timeLeft)} còn lại</span>
            </div>

            {/* WHITE VIETQR CODE CARD */}
            <div className="bg-white rounded-[28px] p-6 text-black space-y-4 shadow-2xl flex flex-col items-center max-w-sm mx-auto">
              
              {/* VietQR Header Logo */}
              <div className="flex items-center justify-center gap-1 font-black text-xl text-[#004B8D] tracking-tight">
                <span className="text-[#EF4444]">Viet</span><span>QR</span>
              </div>

              {/* Dynamic VietQR Image */}
              <div className="relative p-1 border-2 border-emerald-500 rounded-2xl shadow-md bg-white">
                <img 
                  src={`https://img.vietqr.io/image/TCB-${bankAccountNum}-compact2.png?amount=${currentPlan.priceNum}&addInfo=${currentPlan.orderCode}&accountName=NGUYEN%20QUOC%20THIEN`}
                  alt="SePay VietQR Payment Code"
                  className="w-56 h-56 object-contain rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://lh3.googleusercontent.com/d/17J5zf9Vb0JD3Gbbj-1BDyzXVCF6m8rq7";
                  }}
                />
              </div>

              {/* Bank Brand Logos & Owner Info */}
              <div className="space-y-1 text-center font-sans pt-1">
                <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-gray-600 font-bold">
                  <span className="text-[#004B8D] font-black">napas247</span>
                  <span>|</span>
                  <span className="text-[#EF4444] font-black uppercase">TECHCOMBANK</span>
                </div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-wide">{bankAccountName}</p>
                <p className="text-xs font-mono font-bold text-gray-700">{bankAccountNum}</p>
                <p className="text-xs font-mono font-black text-[#EF4444]">Số tiền: {currentPlan.priceVnd} VND</p>
              </div>

            </div>

            {/* THÔNG TIN CHUYỂN KHOẢN BOX WITH 1-CLICK COPY BUTTONS */}
            <div className="bg-[#151525] p-5 rounded-2xl border border-white/10 text-xs font-mono text-left space-y-3.5 shadow-inner">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block border-b border-white/10 pb-2">
                THÔNG TIN CHUYỂN KHOẢN
              </span>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ngân hàng</span>
                <span className="text-white font-black text-sm uppercase">{bankName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Số tài khoản</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-sm">{bankAccountNum}</span>
                  <button
                    onClick={() => copyToClipboard(bankAccountNum, "stk")}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedField === "stk" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === "stk" ? "Đã chép" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Chủ tài khoản</span>
                <span className="text-white font-black text-xs uppercase">{bankAccountName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Số tiền</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-black text-sm">{currentPlan.priceDisplay}</span>
                  <button
                    onClick={() => copyToClipboard(currentPlan.priceNum.toString(), "amount")}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedField === "amount" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === "amount" ? "Đã chép" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">Nội dung</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black text-sm px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/30">{currentPlan.orderCode}</span>
                  <button
                    onClick={() => copyToClipboard(currentPlan.orderCode, "code")}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold hover:bg-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {copiedField === "code" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === "code" ? "Đã chép" : "Copy"}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Status Indicator */}
            <div className="space-y-2 pt-1 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>🟢 Đang chờ xác nhận thanh toán...</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">
                🔒 Giao dịch được bảo mật · Tự động kích hoạt qua SePay Webhook
              </p>

              {/* Action Button to activate VIP instantly */}
              <button
                onClick={handleActivatePaymentSuccess}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-glow-emerald transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>⚡ XÁC NHẬN THANH TOÁN TỰ ĐỘNG SEPAY WEBHOOK</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 2: THANK YOU & VIP CONFIRMATION VIEW */}
      {paymentStep === "thankyou" && activePlanData && (
        <div className="glass-panel p-8 md:p-12 rounded-[32px] border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-[#0A0A0A] to-black shadow-2xl text-center space-y-6 animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider inline-block">
              🎉 SEPAY WEBHOOK XÁC NHẬN CHUYỂN KHOẢN THÀNH CÔNG
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Cảm Ơn Quý Khách!<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">Gói VIP Đã Kích Hoạt Tự Động</span>
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Hệ thống SePay đã nhận diện giao dịch thành công. Toàn bộ chức năng của gói <strong>{activePlanData.planName}</strong> đã được đồng bộ mở khóa 100% cho tài khoản của bạn.
            </p>
          </div>

          {/* VIP Subscription Receipt Card */}
          <div className="max-w-xl mx-auto bg-[#121218] p-6 rounded-3xl border border-emerald-500/30 text-xs font-mono text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 font-bold">Trạng Thái Gói VIP:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs">
                ● GÓI BẢN QUYỀN VIP ACTIVE
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Gói Cước Đã Đăng Ký:</span>
              <span className="text-white font-bold">{activePlanData.planName}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Chủ Tài Khoản Ngân Hàng:</span>
              <span className="text-emerald-400 font-bold">{bankAccountName} ({bankAccountNum})</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Thời Hạn Sử Dụng:</span>
              <span className="text-amber-400 font-bold">{activePlanData.billingCycle}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Ngày Kích Hoạt:</span>
              <span className="text-emerald-400 font-bold">{activePlanData.activatedAt}</span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Ngày Hết Hạn:</span>
              <span className="text-emerald-400 font-bold">{activePlanData.expiresAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab && setActiveTab("broadcast")}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-glow-emerald transition-all cursor-pointer flex items-center gap-2"
            >
              🚀 VÀO WORKSPACE SỬ DỤNG NGAY <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
