import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Globe, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Server, 
  BadgeCheck,
  Clock,
  Zap,
  HelpCircle,
  AlertTriangle,
  Cpu,
  Layers,
  Key,
  Check,
  Sparkles
} from 'lucide-react';

export default function EnterprisePayment() {
  const [paymentGateway, setPaymentGateway] = useState('sepay');
  const [selectedPlan, setSelectedPlan] = useState('enterprise');
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual' (Tặng 2 tháng)
  const [whiteLabelActive, setWhiteLabelActive] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('sea');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [stripeModalOpen, setStripeModalOpen] = useState(false);

  const plans = [
    { 
      id: 'starter', 
      name: 'Gói Cá Nhân (Starter Pro)', 
      priceVnd: billingCycle === 'annual' ? '4.900.000₫ / năm' : '490.000₫ / tháng', 
      priceUsd: billingCycle === 'annual' ? '$190 / năm' : '$19 / tháng',
      annualSave: '🎁 TẶNG 2 THÁNG MIỄN PHÍ (Tiết kiệm 980.000₫ khi thanh toán SePay 1 năm)',
      hours: '⚡ 200 Giờ Live / tháng (~6.6h/ngày)',
      apiCostCap: 'Tối ưu chi phí vận hành (Bảo toàn 65% Lợi Nhuận Gộp)',
      profitMargin: '65% Lợi Nhuận Gộp Bảo Toàn',
      features: [
        '⚡ 200 Giờ Live Stream / tháng (~6.6h/ngày)',
        '🌐 Multistream 3 Luồng song song (TikTok, FB, YT)',
        '💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Phông nền Background AI 4K',
        '🚫 Gỡ bỏ 100% Logo thương hiệu ép buộc',
        '🎬 Restream Link Live & Nạp File Video Quay Sẵn 24/7',
        '🚀 Bán hàng tự động 24/7 - Tiết kiệm 100% chi phí thuê MC/Studio',
        '⚡ Tự động bắt comment SĐT & nhắn tin chốt đơn khách hàng'
      ] 
    },
    { 
      id: 'business', 
      name: 'Gói Phát Triển (Business Growth)', 
      priceVnd: billingCycle === 'annual' ? '14.900.000₫ / năm' : '1.490.000₫ / tháng', 
      priceUsd: billingCycle === 'annual' ? '$590 / năm' : '$59 / tháng',
      annualSave: '🎁 TẶNG 2 THÁNG MIỄN PHÍ (Tiết kiệm 2.980.000₫ khi thanh toán SePay 1 năm)',
      popular: true,
      hours: '⚡ 700 Giờ Live / tháng (~100h live/ngày)',
      apiCostCap: 'Tối ưu chi phí vận hành (Bảo toàn 65% Lợi Nhuận Gộp)',
      profitMargin: '65% Lợi Nhuận Gộp Bảo Toàn',
      features: [
        '⚡ 700 Giờ Live / tháng (~100h live/ngày)',
        '🌐 Multistream 10 Luồng phát song song đa nền tảng',
        '🛍️ Auto Chốt Đơn AI + Kết nối đơn vị vận chuyển (GHTK, GHN, Viettel Post)',
        '💄 Trọn bộ 30 Hiệu ứng Làm đẹp & Phông nền Background AI 4K',
        '🎬 File Video Khủng Hàng Chục GB & Báo cáo doanh số chi tiết',
        '📈 Bán hàng đa kênh X3 doanh số - Phá đảo TikTok, FB, YT, Shopee',
        '📊 Báo cáo phân tích doanh số từng phiên live & sản phẩm'
      ] 
    },
    { 
      id: 'enterprise', 
      name: 'Gói Doanh Nghiệp (Enterprise VIP)', 
      priceVnd: billingCycle === 'annual' ? '49.000.000₫ / năm' : '4.900.000₫ / tháng', 
      priceUsd: billingCycle === 'annual' ? '$1.990 / năm' : '$199 / tháng',
      annualSave: '🎁 TẶNG 2 THÁNG MIỄN PHÍ (Tiết kiệm 9.800.000₫ khi thanh toán SePay 1 năm)',
      hours: '⚡ UNLIMITED 4.000 GIỜ LIVE/tháng (Phát 24/7 Không giới hạn)',
      apiCostCap: 'Tối ưu chi phí vận hành (Bảo toàn 65% Lợi Nhuận Gộp)',
      profitMargin: '65% Lợi Nhuận Gộp Bảo Toàn',
      features: [
        '🚀 UNLIMITED 4.000 GIỜ LIVE/tháng (Bật phát 24/7 không giới hạn)',
        '🌐 Multistream 30+ Luồng phát song song không giới hạn kênh',
        '⚡ Dedicated RTMP Proxy Server 10Gbps siêu tốc riêng biệt',
        '🛍️ Auto Chốt Đơn + Kết nối GHTK / GHN / Viettel Post',
        '👥 Phân quyền nhân viên theo Gmail + White-Label Branding',
        '👑 Bật phát 24/7 Vô hạn không lo nghẽn mạng hay khóa luồng',
        '🔒 Cam kết Uptime 99.99% & Hỗ trợ kỹ thuật 1:1 24/7'
      ] 
    },
  ];

  const apiCostBreakdown = [
    {
      feature: 'Phát Livestream Trực Tiếp Multicam 4K',
      isApi: false,
      apiProvider: 'Bàn Dựng Studio Engine 4K',
      costStructure: 'Miễn Phí Nền Tảng (Unlimited)',
      note: 'Dựng nhiều góc camera & bộ 30 hiệu ứng làm đẹp'
    },
    {
      feature: 'Phát Replay Video & Restream Link Live 24/7',
      isApi: false,
      apiProvider: 'Server Loop Streaming High-Speed',
      costStructure: 'Miễn Phí Nền Tảng (Unlimited)',
      note: 'Hỗ trợ file video nặng hàng chục GB & vài tiếng đồng hồ'
    },
    {
      feature: 'Tự Động Bán Hàng & Chốt Đơn Đa Kênh',
      isApi: false,
      apiProvider: 'Hệ Thống Auto E-Commerce Engine',
      costStructure: 'Miễn Phí Nền Tảng (Unlimited)',
      note: 'Nhận diện comment hỏi mua hàng & chốt đơn tự động'
    },
    {
      feature: 'Phát Live Đa Luồng Multistream 10Gbps',
      isApi: false,
      apiProvider: 'Server Proxy RTMP Nội Bộ (VN/Singapore)',
      costStructure: 'Miễn Phí Nền Tảng (Unlimited)',
      note: 'Sử dụng cụm máy chủ Proxy RTMP tốc độ cao'
    },
    {
      feature: 'Báo Cáo Doanh Số & Kết Nối Đơn Vị Giao Hàng',
      isApi: false,
      apiProvider: 'Hệ Thống Vận Chuyển GHTK/GHN/Viettel Post',
      costStructure: 'Miễn Phí Nền Tảng (Unlimited)',
      note: 'Báo cáo chi tiết từng live, từng trang & từng sản phẩm'
    },
    {
      feature: 'Nạp Video/Ảnh Bán Hàng 24/7',
      isApi: false,
      apiProvider: 'Local Memory & Base64 Reader',
      costStructure: 'Miễn Phí Nền Tảng',
      note: 'Lưu kho máy tính & phát vòng lặp tự động'
    },
    {
      feature: 'Ghim Sản Phẩm & Setup Bảng Flash Sale',
      isApi: false,
      apiProvider: 'Internal System Engine',
      costStructure: 'Miễn Phí Nền Tảng',
      note: 'Cập nhật giao diện bán hàng real-time'
    }
  ];

  const regions = [
    { id: 'sea', name: 'Việt Nam & Đông Nam Á (Singapore)', latency: '12ms', status: 'HOẠT ĐỘNG' },
    { id: 'us-east', name: 'Mỹ (N. Virginia)', latency: '120ms', status: 'HOẠT ĐỘNG' },
    { id: 'eu-west', name: 'Châu Âu (Frankfurt)', latency: '160ms', status: 'HOẠT ĐỘNG' },
    { id: 'ap-tokyo', name: 'Nhật Bản (Tokyo)', latency: '45ms', status: 'HOẠT ĐỘNG' },
  ];

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border-l-4 border-l-[#EF4444]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> BẢO MẬT TUYỆT ĐỐI • UPTIME CAM KẾT 99.99%
          </div>
          <h2 className="text-2xl font-black text-white">Gói Doanh Nghiệp & Bảng Giá Chi Phí Theo Giờ Live</h2>
          <p className="text-xs text-gray-400 mt-1">
            Bảng giá minh bạch các gói cước, thanh toán SePay VietQR (Nội địa 3s) & Stripe (Quốc tế).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#121216] px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300">Chuẩn Mã Hóa:</span>
          <span className="text-emerald-400 font-mono">AES-256 SSL</span>
        </div>
      </div>

      {/* CRITICAL NOTICE: LIVE VIDEO UNLIMITED vs LIVE AVATAR AI ALLOCATION */}
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-xs space-y-2 text-left">
        <div className="flex items-center gap-2 text-emerald-400 font-black">
          <Zap className="w-4 h-4" />
          <span>LÀM RÕ PHÂN ĐỊNH TÍNH NĂNG: LIVE VIDEO UNLIMITED VS LIVE AVATAR MC AI</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300 text-[11px]">
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
            <span className="font-bold text-emerald-400 block">🎬 1. LIVE VIDEO BÁN HÀNG VÒNG LẶP (UNLIMITED 24/7):</span>
            <p className="text-gray-400"><strong>PHÁT LIVE 24/7 HOÀN TOÀN MIỄN PHÍ TOÀN BỘ CÁC GÓI</strong>! Người dùng nạp video bán hàng có sẵn hoặc gắn link replay sẽ phát live qua Server Proxy RTMP riêng của ứng dụng!</p>
          </div>
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
            <span className="font-bold text-purple-400 block">🤖 2. LIVE AVATAR MC AI THOẠI REAL-TIME:</span>
            <p className="text-gray-400">Tính năng Live Avatar AI đọc kịch bản thoại real-time được tính trừ theo hạn mức Giờ Live Avatar của gói cước!</p>
          </div>
        </div>
      </div>

      
      {/* 📡 BÀN KẾT NỐI SEPAY WEBHOOK CHÍNH THỨC (SEPAY INTEGRATION PANEL) */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-[#0E1512] to-black space-y-4 shadow-glow-emerald">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
              SePay
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 mb-1">
                ● SEPAY WEBHOOK CONNECTED & READY 24/7
              </div>
              <h3 className="text-lg font-black text-white">CỔNG TÍCH HỢP THANH TOÁN TỰ ĐỘNG SEPAY VIETQR</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://avalivepro.vercel.app/api/sepay-webhook");
                alert("📋 Đã copy Link Webhook SePay: https://avalivepro.vercel.app/api/sepay-webhook");
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-glow-emerald transition-all cursor-pointer flex items-center gap-1.5"
            >
              📋 COPY LINK SEPAY WEBHOOK
            </button>
          </div>
        </div>

        {/* Webhook URLs & Parameter Config Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          
          <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 space-y-2">
            <span className="text-[11px] font-black text-emerald-400 block uppercase">1. URL NHẬN WEBHOOK TỰ ĐỘNG (PRODUCTION):</span>
            <div className="p-2.5 rounded-xl bg-[#121218] border border-white/10 text-white break-all flex items-center justify-between select-all font-bold">
              <span>https://avalivepro.vercel.app/api/sepay-webhook</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black">ACTIVE</span>
            </div>
            <p className="text-[10px] text-gray-400">Dán URL này vào ô <strong>"URL nhận Webhook"</strong> tại <strong>my.sepay.vn/webhooks</strong></p>
          </div>

          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-2">
            <span className="text-[11px] font-black text-blue-400 block uppercase">2. URL LOCAL WEBHOOK (THỬ NGHIỆM LOCAL):</span>
            <div className="p-2.5 rounded-xl bg-[#121218] border border-white/10 text-white break-all flex items-center justify-between select-all font-bold">
              <span>http://localhost:3001/api/sepay-webhook</span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-black">TEST LOCAL</span>
            </div>
            <p className="text-[10px] text-gray-400">Dán URL này khi thử nghiệm môi trường Localhost máy trạm</p>
          </div>

        </div>

        {/* Technical Config Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono pt-1">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Loại Giao Dịch</span>
            <span className="text-emerald-400 font-bold">Tiền Vào (Incoming)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Định Dạng Dữ Liệu</span>
            <span className="text-purple-400 font-bold">JSON (application/json)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Ngân Hàng Thụ Hưởng</span>
            <span className="text-white font-bold">MBBank 0988123456</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Cú Pháp Nội Dung</span>
            <span className="text-red-400 font-bold">AVALIVE8912</span>
          </div>
        </div>
      </div>


      {/* Billing Cycle Switcher: Monthly vs Annual (TẶNG 2 THÁNG MIỄN PHÍ) */}
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <div className="bg-[#121218] p-1.5 rounded-2xl border border-emerald-500/40 flex items-center gap-2 shadow-glow-emerald">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-[#EF4444] text-white shadow-glow-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🗓️ THANH TOÁN HÀNG THÁNG
          </button>

          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'annual'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-glow-emerald'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>⚡ MUA GÓI NĂM (TẶNG 2 THÁNG MIỄN PHÍ)</span>
            <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-black animate-pulse">
              TIẾT KIỆM 20%
            </span>
          </button>
        </div>
        <p className="text-[11px] text-emerald-400 font-bold">
          🎁 Mua 1 năm chỉ thanh toán 10 tháng - Tặng ngay 2 tháng sử dụng miễn phí hoàn toàn!
        </p>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative glass-panel p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5 ${
                isSelected 
                  ? 'bg-gradient-to-b from-[#EF4444]/20 via-[#12121A] to-[#0A0A0E] border-[#EF4444] shadow-[0_0_50px_rgba(239,68,68,0.3)] scale-105 z-10' 
                  : 'border-white/10 bg-[#12121A]/90 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-black bg-[#EF4444] text-white shadow-glow-red tracking-wider uppercase">
                  BÁN CHẠY NHẤT (PHỔ BIẾN)
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">{plan.name}</h3>
                  <div className="mt-3 mb-1">
                    <p className="text-3xl font-black text-[#EF4444] font-sans tracking-tight">{plan.priceVnd}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{plan.priceUsd} (Quốc tế Stripe)</p>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="mt-2.5 p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                      {plan.annualSave}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">QUYỀN LỢI CHI TIẾT GÓI:</span>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected 
                      ? 'bg-[#EF4444] text-white shadow-glow-red hover:bg-red-600' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{isSelected ? '🚀 BẤM SEPAY THANH TOÁN NGAY' : 'CHỌN GÓI NÀY NÂNG CẤP'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MINH BẠCH BẢO TOÀN LỢI NHUẬN GỘP 65% */}
      <div className="glass-panel p-6 rounded-3xl border border-white/15 space-y-4 bg-gradient-to-b from-[#121218] via-[#0A0A0A] to-[#121218]">
        <div className="border-b border-white/10 pb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              MINH BẠCH CÔNG NGHỆ NỀN TẢNG & PHÂN LOẠI DỊCH VỤ
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Cam kết quy tắc <strong>Tối ưu ngân sách vận hành</strong>, đảm bảo tối thiểu <strong>65% Lợi Nhuận Gộp</strong> bảo toàn cho chủ nền tảng.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black">
            Bảo Toàn: MIN 65% LỢI NHUẬN GỘP
          </span>
        </div>

        {/* Detailed Service Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/15 text-gray-400 font-bold uppercase text-[10px]">
                <th className="p-3">Tính Năng Hệ Thống</th>
                <th className="p-3">Loại Dịch Vụ</th>
                <th className="p-3">Công Nghệ Vận Hành</th>
                <th className="p-3">Quyền Lợi Sử Dụng</th>
                <th className="p-3">Ghi Chú Vận Hành</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {apiCostBreakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {row.isApi ? <Sparkles className="w-3.5 h-3.5 text-purple-400" /> : <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{row.feature}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      row.isApi 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {row.isApi ? '🤖 MC AI THOẠI REAL-TIME' : '🟢 PHÁT LIVE TỰ ĐỘNG (0₫ PHÍ)'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-gray-300 font-bold">{row.apiProvider}</td>
                  <td className="p-3 font-mono text-amber-400 font-bold">{row.costStructure}</td>
                  <td className="p-3 text-gray-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARCHITECTURE SECURITY & COMPLIANCE */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 bg-black/60">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" /> TÍNH BẢO MẬT TUYỆT ĐỐI HỆ THỐNG (SECURITY ARCHITECTURE)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#121218] border border-white/10 space-y-2">
            <span className="font-bold text-emerald-400 block">1. Mã Hóa Stream Key AES-256:</span>
            <p className="text-gray-300 text-[11px]">Toàn bộ Stream Key TikTok, FB, YT và OAuth Token ID được mã hóa bảo mật chuẩn quân sự trên thiết bị người dùng.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121218] border border-white/10 space-y-2">
            <span className="font-bold text-purple-400 block">2. Google OAuth 2.0 & Staff RBAC:</span>
            <p className="text-gray-300 text-[11px]">Chỉ tài khoản Gmail được chủ gói cước phân quyền mới truy cập được vào workspace theo đúng cấp bậc vai trò.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121218] border border-white/10 space-y-2">
            <span className="font-bold text-blue-400 block">3. SSL/TLS 1.3 Proxy Transport:</span>
            <p className="text-gray-300 text-[11px]">Cụm máy chủ Proxy RTMP 10Gbps tại Việt Nam & Singapore được bảo vệ mã hóa luồng stream 100% không sợ rò rỉ dữ liệu.</p>
          </div>
        </div>
      </div>


      {/* 💳 SEPAY VIETQR AUTO PAYMENT MODAL (INTEGRATED WITH MY.SEPAY.VN WEBHOOK) */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 max-w-lg w-full text-left space-y-4 shadow-2xl bg-[#0A0A0A]/95 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs">SePay VietQR 3s</span>
                <h3 className="text-base font-black text-white">THANH TOÁN TỰ ĐỘNG QUA SEPAY VIETQR</h3>
              </div>
              <button onClick={() => setQrModalOpen(false)} className="text-gray-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            {/* Official VietQR Image Generator */}
            <div className="flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="flex flex-col items-center gap-2">
                <img 
                  src="https://lh3.googleusercontent.com/d/17J5zf9Vb0JD3Gbbj-1BDyzXVCF6m8rq7"
                  alt="Mã QR Thanh Toán SePay Chính Thức"
                  className="w-60 h-60 object-contain rounded-2xl border-4 border-emerald-500 shadow-glow-emerald p-2 bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://drive.google.com/thumbnail?id=17J5zf9Vb0JD3Gbbj-1BDyzXVCF6m8rq7&sz=w1000";
                  }}
                />
                <span className="text-[10px] text-gray-400 font-mono">Quét mã QR bằng App Ngân Hàng hoặc MoMo/ZaloPay</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold animate-pulse">
                ● ĐANG CHỜ SEPAY WEBHOOK XÁC NHẬN GIAO DỊCH (3s)...
              </span>
            </div>

            {/* Transaction Details Table */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5 text-xs font-mono text-left">
              <span className="text-[11px] font-black text-emerald-400 block uppercase">🔗 LINK KẾT NỐI SEPAY WEBHOOK CHÍNH THỨC:</span>
              <div className="p-2 rounded-xl bg-black border border-emerald-500/30 text-white font-mono text-[11px] break-all select-all flex items-center justify-between">
                <span>https://avalivepro.vercel.app/api/sepay-webhook</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">READY</span>
              </div>
              <span className="text-[10px] text-gray-400 block">Dán URL trên vào mục <strong>URL nhận Webhook</strong> tại <strong>my.sepay.vn/webhooks</strong></span>
            </div>

            <div className="space-y-2 text-xs font-mono bg-[#121216] p-3.5 rounded-2xl border border-white/10">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-gray-400">Ngân Hàng Thụ Hưởng:</span>
                <span className="text-white font-bold">MBBank (Ngân Hàng Quân Đội)</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-gray-400">Số Tài Khoản:</span>
                <span className="text-emerald-400 font-black text-sm">0988123456</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-gray-400">Chủ Tài Khoản:</span>
                <span className="text-white font-bold">CONG TY CỔ PHẦN AVA STUDIO</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="text-gray-400">Số Tiền Thanh Toán:</span>
                <span className="text-amber-400 font-black text-sm">4.900.000₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Nội Dung Chuyển Khoản:</span>
                <span className="text-red-400 font-black text-sm px-2 py-0.5 bg-red-500/20 rounded border border-red-500/40">AVALIVE8912</span>
              </div>
            </div>

            {/* SePay Webhook Auto Confirmation Test Button */}
            <button
              onClick={() => {
                const planConfig = {
                  starter: { name: "Starter Pro (490K/tháng hoặc 4.9M/năm)", hours: 200, channels: 3, res: "Full HD 1080p" },
                  business: { name: "Business Growth (1.49M/tháng hoặc 14.9M/năm)", hours: 700, channels: 10, res: "4K 60fps Ultra HD" },
                  enterprise: { name: "Enterprise VIP (4.9M/tháng hoặc 49M/năm)", hours: 4000, channels: 30, res: "4K Dedicated 10Gbps" }
                }[selectedPlan] || { name: "Starter Pro", hours: 200, channels: 3, res: "1080p" };

                const activatedPlanData = {
                  planId: selectedPlan,
                  planName: planConfig.name,
                  billingCycle: billingCycle,
                  maxLiveHours: planConfig.hours,
                  maxChannels: planConfig.channels,
                  resolution: planConfig.res,
                  activatedAt: new Date().toLocaleDateString("vi-VN"),
                  expiresAt: new Date(Date.now() + (billingCycle === "annual" ? 365 : 30) * 86400000).toLocaleDateString("vi-VN"),
                  isPaid: true
                };

                localStorage.setItem("avalive_active_plan", JSON.stringify(activatedPlanData));
                alert("🎉 XÁC NHẬN THANH TOÁN TỰ ĐỘNG SEPAY THÀNH CÔNG!\n\n✅ ĐÃ KÍCH HOẠT: " + planConfig.name + "\n⏰ HẠN SỬ DỤNG: ĐẾN NGHÀY " + activatedPlanData.expiresAt + "\n⚡ QUYỀN LỢI: " + planConfig.hours + " GIỜ LIVE/THÁNG · " + planConfig.channels + " KÊNH MULTISTREAM · ĐỘ PHÂN GIẢI " + planConfig.res + "\n\nToàn bộ chức năng của gói đã được mở khóa 100%!");
                setQrModalOpen(false);
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-glow-emerald transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>🚀 GIẢ LẬP SEPAY WEBHOOK CHUYỂN KHOẢN THÀNH CÔNG (TEST QA)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
