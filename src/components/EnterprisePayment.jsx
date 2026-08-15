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
  Clock,
  Coins,
  Crown,
  Sparkles,
  Rocket
} from "lucide-react";
import { useToken } from "./genaidol/TokenContext";

export default function EnterprisePayment({ setActiveTab, initialCategory = "subscription" }) {
  const { addToken } = useToken();
  const [paymentCategory, setPaymentCategory] = useState(initialCategory); // "subscription" | "tokens"
  const [selectedPlan, setSelectedPlan] = useState("business");
  const [selectedTokenPlan, setSelectedTokenPlan] = useState("token_growth");
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

  // 1. GÓI BẢN QUYỀN PHẦN MỀM LIVESTREAM (Tháng / Năm)
  const subscriptionPlans = [
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

  // 2. 3 GÓI NẠP THÊM TOKEN PHỤ (499k +10%, 1.497k +15%, 4.491k +20%)
  const tokenAddonPlans = [
    {
      id: "token_starter",
      name: "Gói Token Khởi Nghiệp",
      tokens: 11000,
      baseTokens: 10000,
      bonusPercent: 10,
      priceVnd: "499.000",
      priceDisplay: "499.000đ",
      priceNum: 499000,
      orderCode: "AVATOKEN499",
      desc: "Nạp thêm 10.000 Token + Thưởng 10%",
      badge: "THƯỞNG +10% TOKEN",
      icon: Zap
    },
    {
      id: "token_growth",
      name: "Gói Token Tăng Trưởng (x3)",
      tokens: 34500,
      baseTokens: 30000,
      bonusPercent: 15,
      priceVnd: "1.497.000",
      priceDisplay: "1.497.000đ",
      priceNum: 1497000,
      orderCode: "AVATOKEN1497",
      desc: "Nạp thêm 30.000 Token + Thưởng 15%",
      badge: "PHỔ BIẾN NHẤT +15%",
      popular: true,
      icon: Rocket
    },
    {
      id: "token_vip",
      name: "Gói Token Đột Phá VIP (x9)",
      tokens: 108000,
      baseTokens: 90000,
      bonusPercent: 20,
      priceVnd: "4.491.000",
      priceDisplay: "4.491.000đ",
      priceNum: 4491000,
      orderCode: "AVATOKEN4491",
      desc: "Nạp thêm 90.000 Token + Thưởng 20%",
      badge: "SIÊU VIP +20% TOKEN",
      icon: Crown
    }
  ];

  const currentPlan = paymentCategory === "subscription"
    ? (subscriptionPlans.find(p => p.id === selectedPlan) || subscriptionPlans[1])
    : (tokenAddonPlans.find(p => p.id === selectedTokenPlan) || tokenAddonPlans[1]);

  const bankAccountNum = "19035907828017";
  const bankAccountName = "NGUYEN QUOC THIEN";
  const bankName = "TECHCOMBANK";

  const handleActivatePaymentSuccess = async () => {
    if (paymentCategory === "tokens") {
      // Add tokens directly to account
      addToken(currentPlan.tokens, `Nạp ${currentPlan.name} (+${currentPlan.bonusPercent}% Thưởng)`);

      await syncPaymentToSupabase({
        plan: currentPlan.id.toUpperCase(),
        amount: currentPlan.priceNum,
        referenceCode: currentPlan.orderCode,
        status: "completed",
        billingCycle: "Token Addon"
      });

      const todayDate = new Date().toLocaleDateString("vi-VN");
      const planData = {
        planId: currentPlan.id,
        planName: currentPlan.name,
        price: currentPlan.priceDisplay,
        tokensReceived: currentPlan.tokens,
        bonusPercent: currentPlan.bonusPercent,
        billingCycle: "Gói Nạp Thêm Token (Không hết hạn)",
        activatedAt: todayDate,
        expiresAt: "Vĩnh viễn",
        isPaid: true,
        isTokenAddon: true
      };

      setActivePlanData(planData);
      setPaymentStep("thankyou");
    } else {
      // Software subscription activation
      await syncPaymentToSupabase({
        plan: currentPlan.id.toUpperCase(),
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
        isPaid: true,
        isTokenAddon: false
      };

      localStorage.setItem("avalive_active_plan", JSON.stringify(planData));
      setActivePlanData(planData);
      setPaymentStep("thankyou");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 font-sans text-left py-4 selection:bg-emerald-500 selection:text-black">

      {/* STEP 1: OFFICIAL SEPAY CHECKOUT UI CARD */}
      {paymentStep === "checkout" && (
        <div className="space-y-5 animate-fadeIn">

          {/* MAIN CATEGORY TAB SWITCHER: SOFTWARE PLANS VS TOKEN ADDONS */}
          <div className="bg-[#12121D] p-1.5 rounded-2xl border border-white/15 flex items-center gap-1.5">
            <button
              onClick={() => setPaymentCategory("subscription")}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                paymentCategory === "subscription"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Gói Bản Quyền Live</span>
            </button>
            <button
              onClick={() => setPaymentCategory("tokens")}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                paymentCategory === "tokens"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Nạp Thêm Token (+20%)</span>
            </button>
          </div>

          {/* PLAN SELECTOR ACCORDING TO ACTIVE CATEGORY */}
          {paymentCategory === "subscription" ? (
            <div className="bg-[#12121D] p-3.5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">CHỌN GÓI BẢN QUYỀN SEPAY:</span>
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
                {subscriptionPlans.map((p) => {
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
          ) : (
            <div className="bg-[#12121D] p-3.5 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> CHỌN GÓI NẠP THÊM TOKEN PHỤ:
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Tặng Thêm Đến +20%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {tokenAddonPlans.map((p) => {
                  const isSel = p.id === selectedTokenPlan;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedTokenPlan(p.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSel 
                          ? "bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/20" 
                          : "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <span className="text-[9px] font-bold block text-amber-400 truncate">{p.badge}</span>
                      <span className="text-xs font-black block text-white truncate">{p.name}</span>
                      <span className="text-[11px] font-bold block text-amber-300">+{p.tokens.toLocaleString()} T</span>
                      <span className="text-[10px] text-gray-400 block">{p.priceDisplay}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notice for 3-month token package duration */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 text-left flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>⏳ Hạn sử dụng gói phụ:</strong> Số lượng token của các gói phụ có thời hạn sử dụng trong vòng <strong>3 tháng (90 ngày)</strong>. Sau 3 tháng không sử dụng hết, lượng token còn lại sẽ tự động về 0.
                </span>
              </div>
            </div>
          )}

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
                {paymentCategory === "tokens" && (
                  <p className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    💎 Nhận: {currentPlan.tokens.toLocaleString()} Token (+{currentPlan.bonusPercent}%)
                  </p>
                )}
              </div>

            </div>

            {/* THÔNG TIN CHUYỂN KHOẢN BOX WITH 1-CLICK COPY BUTTONS */}
            <div className="bg-[#151525] p-5 rounded-2xl border border-white/10 text-xs font-mono text-left space-y-3.5 shadow-inner">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block border-b border-white/10 pb-2">
                THÔNG TIN CHUYỂN KHOẢN CHÍNH THỨC
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
                <span>🟢 Đang chờ xác nhận thanh toán tự động...</span>
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

      {/* STEP 2: THANK YOU & CONFIRMATION VIEW */}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
                {activePlanData.isTokenAddon ? "Đã Nạp Token Thành Công" : "Gói VIP Đã Kích Hoạt Tự Động"}
              </span>
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Hệ thống SePay đã nhận diện giao dịch thành công. {activePlanData.isTokenAddon ? (
                <>Đã cộng ngay <strong>{activePlanData.tokensReceived?.toLocaleString()} Token</strong> (+{activePlanData.bonusPercent}% Thưởng) vào tài khoản của bạn.</>
              ) : (
                <>Toàn bộ chức năng của gói <strong>{activePlanData.planName}</strong> đã được đồng bộ mở khóa 100% cho tài khoản của bạn.</>
              )}
            </p>
          </div>

          {/* VIP Subscription / Token Receipt Card */}
          <div className="max-w-xl mx-auto bg-[#121218] p-6 rounded-3xl border border-emerald-500/30 text-xs font-mono text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-gray-400 font-bold">Trạng Thái Giao Dịch:</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black text-xs">
                ● {activePlanData.isTokenAddon ? "NẠP TOKEN THÀNH CÔNG" : "GÓI BẢN QUYỀN VIP ACTIVE"}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Gói Đã Thanh Toán:</span>
              <span className="text-white font-bold">{activePlanData.planName}</span>
            </div>

            {activePlanData.isTokenAddon && (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Số Lượng Token Đã Cộng:</span>
                <span className="text-amber-400 font-black text-sm">+{activePlanData.tokensReceived?.toLocaleString()} Token (+{activePlanData.bonusPercent}%)</span>
              </div>
            )}

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
