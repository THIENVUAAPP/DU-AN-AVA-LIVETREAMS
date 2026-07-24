import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Zap, 
  ArrowRight,
  Check,
  Sparkles,
  RefreshCw,
  Award,
  Crown,
  ChevronLeft
} from "lucide-react";

export default function EnterprisePayment({ setActiveTab }) {
  const [selectedPlan, setSelectedPlan] = useState("business"); // default to popular Business plan
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly" | "annual"
  const [paymentStep, setPaymentStep] = useState("checkout"); // "checkout" | "thankyou"
  const [activePlanData, setActivePlanData] = useState(null);

  const plans = [
    { 
      id: "starter", 
      name: "Starter Pro", 
      priceVnd: billingCycle === "annual" ? "4.900.000₫" : "490.000₫", 
      priceNum: billingCycle === "annual" ? 4900000 : 490000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      hours: "⚡ 200 Giờ Live / tháng",
      channels: "3 Kênh Multistream",
      res: "Full HD 1080p",
      badge: "KHỞI NGHIỆP BÁN HÀNG",
      features: [
        "⚡ 200 Giờ Live Stream / tháng (~6.6h/ngày)",
        "🌐 Multistream 3 Luồng song song (TikTok, FB, YT)",
        "💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Phông nền AI 4K",
        "🚫 Gỡ bỏ 100% Logo thương hiệu ép buộc",
        "🎬 Restream Link Live & Nạp File Video 24/7",
        "⚡ Tự động bắt comment SĐT & nhắn tin chốt đơn"
      ] 
    },
    { 
      id: "business", 
      name: "Business Growth", 
      priceVnd: billingCycle === "annual" ? "14.900.000₫" : "1.490.000₫", 
      priceNum: billingCycle === "annual" ? 14900000 : 1490000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      popular: true,
      hours: "⚡ 700 Giờ Live / tháng",
      channels: "10 Kênh Multistream",
      res: "4K 60fps Ultra HD",
      badge: "BÁN CHẠY NHẤT",
      features: [
        "⚡ 700 Giờ Live / tháng (~100h live/ngày)",
        "🌐 Multistream 10 Luồng phát song song đa nền tảng",
        "🛍️ Auto Chốt Đơn AI + Kết nối GHTK / GHN / Viettel Post",
        "💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Phông nền AI 4K",
        "🎬 File Video Khủng Hàng Chục GB & Báo cáo doanh số",
        "📊 Báo cáo phân tích doanh số từng phiên live & sản phẩm"
      ] 
    },
    { 
      id: "enterprise", 
      name: "Enterprise VIP", 
      priceVnd: billingCycle === "annual" ? "49.000.000₫" : "4.900.000₫", 
      priceNum: billingCycle === "annual" ? 49000000 : 4900000,
      period: billingCycle === "annual" ? "/ năm (Tặng 2 tháng)" : "/ tháng",
      hours: "⚡ UNLIMITED 4.000 GIỜ LIVE/tháng",
      channels: "30+ Luồng Stream",
      res: "4K Dedicated 10Gbps",
      badge: "VIP TOÀN DIỆN 24/7",
      features: [
        "🚀 UNLIMITED 4.000 GIỜ LIVE/tháng (Phát 24/7 vô hạn)",
        "🌐 Multistream 30+ Luồng phát song song không giới hạn",
        "⚡ Dedicated RTMP Proxy Server 10Gbps siêu tốc",
        "🛍️ Auto Chốt Đơn + Kết nối GHTK / GHN / Viettel Post",
        "👥 Phân quyền nhân viên theo Gmail + White-Label Branding",
        "🔒 Cam kết Uptime 99.99% & Hỗ trợ kỹ thuật 1:1 24/7"
      ] 
    },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];

  const handleActivatePaymentSuccess = () => {
    const expiresDate = new Date(Date.now() + (billingCycle === "annual" ? 365 : 30) * 86400000).toLocaleDateString("vi-VN");
    const todayDate = new Date().toLocaleDateString("vi-VN");

    const planData = {
      planId: currentPlan.id,
      planName: currentPlan.name,
      price: currentPlan.priceVnd,
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-left py-4">

      {/* STEP 1: CHECKOUT VIEW (CHỈ HIỂN THỊ CỬA SỔ THANH TOÁN SEPAY QR) */}
      {paymentStep === "checkout" && (
        <div className="space-y-6 animate-fadeIn">

          {/* Header Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-950/40 via-[#0A0A0A] to-[#0A0A0A]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> SEPAY VIETQR AUTO PAYMENT 3S • BẢO MẬT 100%
              </div>
              <h2 className="text-2xl font-black text-white">Thanh Toán Dịch Vụ Livestream Tự Động</h2>
              <p className="text-xs text-gray-400 mt-1">
                Quét mã QR bằng App Ngân Hàng hoặc MoMo/ZaloPay. Hệ thống SePay sẽ tự động xác thực và mở khóa dịch vụ tức thì.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#121216] px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold shrink-0">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Mã Hóa Giao Dịch:</span>
              <span className="text-emerald-400 font-mono">AES-256 SSL</span>
            </div>
          </div>

          {/* Billing Cycle Switcher: Monthly vs Annual */}
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            <div className="bg-[#121218] p-1.5 rounded-2xl border border-emerald-500/40 flex items-center gap-2 shadow-glow-emerald">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#EF4444] text-white shadow-glow-red"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🗓️ THANH TOÁN HÀNG THÁNG
              </button>

              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span>⚡ MUA GÓI NĂM (TẶNG 2 THÁNG MIỄN PHÍ)</span>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[9px] font-black animate-pulse">
                  TIẾT KIỆM 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Selector Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSel = p.id === selectedPlan;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSel 
                      ? "bg-gradient-to-r from-emerald-950/60 to-black border-emerald-500 shadow-glow-emerald" 
                      : "bg-[#121218] border-white/10 hover:border-white/30"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block">{p.badge}</span>
                    <h4 className="text-sm font-black text-white">{p.name}</h4>
                    <p className="text-base font-black text-emerald-400">{p.priceVnd} <span className="text-[10px] text-gray-400 font-normal">{p.period}</span></p>
                  </div>
                  {isSel && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* MAIN DEDICATED SEPAY PAYMENT CARD */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-emerald-500/50 bg-[#0A0A0A]/95 shadow-2xl space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* LEFT COLUMN: SEPAY QR CODE IMAGE */}
              <div className="flex flex-col items-center justify-center space-y-3 p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl blur-lg opacity-70 animate-pulse" />
                  <img 
                    src="https://lh3.googleusercontent.com/d/17J5zf9Vb0JD3Gbbj-1BDyzXVCF6m8rq7"
                    alt="Mã QR Thanh Toán SePay Chính Thức"
                    className="relative w-64 h-64 object-contain rounded-2xl border-4 border-emerald-500 shadow-glow-emerald p-2 bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://drive.google.com/thumbnail?id=17J5zf9Vb0JD3Gbbj-1BDyzXVCF6m8rq7&sz=w1000";
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ĐANG CHỜ SEPAY XÁC NHẬN CHUYỂN KHOẢN (3s)...
                  </span>
                  <p className="text-[10px] text-gray-400 font-mono">Quét mã QR bằng App Ngân Hàng hoặc MoMo/ZaloPay</p>
                </div>
              </div>

              {/* RIGHT COLUMN: BANK TRANSACTION DETAILS */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase block">THÔNG TIN GÓI ĐANG THANH TOÁN:</span>
                  <h3 className="text-lg font-black text-white mt-0.5">{currentPlan.name}</h3>
                  <p className="text-base font-black text-emerald-400">{currentPlan.priceVnd} {currentPlan.period}</p>
                </div>

                <div className="space-y-2.5 bg-[#121216] p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Ngân Hàng Thụ Hưởng:</span>
                    <span className="text-white font-bold">MBBank (Ngân Hàng Quân Đội)</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Số Tài Khoản:</span>
                    <span className="text-emerald-400 font-black text-base">0988123456</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Chủ Tài Khoản:</span>
                    <span className="text-white font-bold">CONG TY CỔ PHẦN AVA STUDIO</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Số Tiền Thanh Toán:</span>
                    <span className="text-amber-400 font-black text-base">{currentPlan.priceVnd}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Nội Dung Chuyển Khoản:</span>
                    <span className="text-red-400 font-black text-base px-2.5 py-1 bg-red-500/20 rounded-lg border border-red-500/40">AVALIVE8912</span>
                  </div>
                </div>

                {/* Auto Confirm Button */}
                <button
                  onClick={handleActivatePaymentSuccess}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-glow-emerald transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>🚀 GIẢ LẬP SEPAY WEBHOOK CHUYỂN KHOẢN THÀNH CÔNG (XÁC NHẬN)</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}


      {/* STEP 2: THANK YOU & VIP CONFIRMATION VIEW (TRANG CẢM ƠN VÀ XÁC NHẬN TỰ ĐỘNG) */}
      {paymentStep === "thankyou" && activePlanData && (
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-[#0A0A0A] to-black shadow-2xl text-center space-y-6 animate-fadeIn">
          
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

          {/* Official VIP Subscription Receipt Card */}
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

            <div className="flex justify-between">
              <span className="text-gray-400">Quyền Lợi Đã Mở Khóa:</span>
              <span className="text-purple-400 font-bold">{activePlanData.hours} · {activePlanData.channels}</span>
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

            <button
              onClick={() => setPaymentStep("checkout")}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              🔄 Xem Lại Thông Tin Thanh Toán
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
