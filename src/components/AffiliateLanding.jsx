import React from 'react';
import { 
  Award, 
  Sparkles, 
  Zap, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Copy,
  TrendingUp,
  QrCode,
  Globe,
  HeartHandshake
} from 'lucide-react';

export default function AffiliateLanding({ currentUser, setGoogleLoginModalOpen, setActiveTab }) {
  return (
    <div className="space-y-10 pb-20 pt-20">

      {/* STANDALONE WEBSITE HEADER (Chỉ hiện khi chưa đăng nhập để giống Trang Chủ) */}
      {!currentUser && (
        <header className="fixed top-0 left-0 right-0 z-[100] bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('overview')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#EF4444] via-[#8B5CF6] to-[#06B6D4] p-0.5 shadow-2xl group-hover:scale-105 transition-all">
                <img src="/official_logo.jpg" alt="AvaLive PRO" className="w-full h-full object-cover rounded-[10px] border border-white/40" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">
                AvaLive <span className="text-[#EF4444]">PRO</span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setActiveTab('overview')} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Trang Chủ</button>
              <button onClick={() => setActiveTab('overview')} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">Bảng Giá</button>
              <button onClick={() => setActiveTab('affiliate-landing')} className="text-sm font-bold text-white hover:text-[#8B5CF6] transition-colors flex items-center gap-1">
                <HeartHandshake className="w-4 h-4" /> Tiếp Thị 30%
              </button>
            </nav>

            <button 
              onClick={() => setGoogleLoginModalOpen(true)}
              className="px-5 py-2.5 bg-white hover:bg-gray-200 text-black font-black rounded-xl text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              ĐĂNG NHẬP <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 border border-white/15 bg-gradient-to-r from-[#121216] via-[#1E1E24] to-[#0A0A0A]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#EF4444]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-black">
            <Sparkles className="w-4 h-4 animate-spin" /> CHƯƠNG TRÌNH ĐỐI TÁC TIẾP THỊ LIÊN KẾT CAO CẤP 2026
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
            Nhận Ngay <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF4444] via-[#8B5CF6] to-[#3B82F6]">30% Hoa Hồng</span> Cho Mỗi Đơn Hàng Mua Gói AvaLive PRO
          </h1>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
            Trở thành đối tác chính thức của nền tảng Livestream AI hàng đầu Việt Nam & Toàn Cầu. Hưởng <strong className="text-[#EF4444]">30% hoa hồng (hưởng 1 lần duy nhất)</strong> ngay khi người dùng đăng ký nâng cấp gói qua SePay VietQR hoặc Stripe.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {currentUser ? (
              <button 
                onClick={() => setActiveTab('affiliate-dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-[#EF4444] to-[#8B5CF6] text-white font-black text-sm rounded-2xl shadow-glow-red hover:opacity-90 transition-all flex items-center gap-2"
              >
                ⚡ VÀO BẢNG QUẢN TRỊ AFF CỦA TÔI <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setGoogleLoginModalOpen(true)}
                className="px-8 py-4 bg-[#EF4444] hover:bg-red-600 text-white font-black text-sm rounded-2xl shadow-glow-red transition-all flex items-center gap-2"
              >
                🔑 ĐĂNG NHẬP GOOGLE ĐỂ LÀM TIẾP THỊ <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <a 
              href="#how-it-works"
              className="px-6 py-4 glass-panel text-gray-300 hover:text-white font-bold text-sm rounded-2xl border border-white/10"
            >
              Hướng Dẫn & Điều Khoản
            </a>
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/20 text-[#EF4444] flex items-center justify-center font-black text-xl">
            30%
          </div>
          <h3 className="text-sm font-extrabold text-white">Hoa Hồng 30% Cao Nhất</h3>
          <p className="text-xs text-gray-400">
            Hưởng 30% giá trị hóa đơn thực tế cho lần đăng ký gói đầu tiên của khách hàng.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center font-black text-xl">
            ⚡
          </div>
          <h3 className="text-sm font-extrabold text-white">Rút Tiền SePay 3s</h3>
          <p className="text-xs text-gray-400">
            Chuyển khoản tự động 24/7 về mọi ngân hàng Việt Nam ngay khi gửi yêu cầu.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/20 text-[#8B5CF6] flex items-center justify-center font-black text-xl">
            📊
          </div>
          <h3 className="text-sm font-extrabold text-white">Thống Kê Trực Tuyến</h3>
          <p className="text-xs text-gray-400">
            Bảng điều khiển riêng theo dõi chính xác từng lượt click, đăng ký & số dư hoa hồng.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl">
            🛡️
          </div>
          <h3 className="text-sm font-extrabold text-white">Đồng Bộ Hệ Thống Admin</h3>
          <p className="text-xs text-gray-400">
            Minh bạch 100%, đồng bộ trực tiếp với hệ thống quản trị tài chính & SePay Webhook.
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-white">Quy Trình 3 Bước Kiếm Tiền Tiếp Thị</h2>
          <p className="text-xs text-gray-400">Đơn giản, minh bạch và rút tiền về ATM ngân hàng tự động.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3 relative">
            <span className="text-4xl font-black text-[#EF4444]">01</span>
            <h4 className="text-base font-bold text-white">Đăng Nhập & Lấy Link Riêng</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Kết nối Google Gmail để mở khóa Bảng Quản Trị AFF Của Tôi và sao chép đường dẫn giới thiệu chứa mã định danh duy nhất của bạn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3 relative">
            <span className="text-4xl font-black text-[#3B82F6]">02</span>
            <h4 className="text-base font-bold text-white">Chia Sẻ Cho Khách Hàng</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Chia sẻ link cho các nhà bán hàng, chủ shop, streamer, doanh nghiệp cần livestream bán hàng tự động bằng MC AI.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216] border border-white/10 space-y-3 relative">
            <span className="text-4xl font-black text-[#8B5CF6]">03</span>
            <h4 className="text-base font-bold text-white">Nhận 30% & Rút Tiền SePay</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Khi khách hàng nâng cấp gói qua SePay VietQR / Stripe, bạn nhận ngay 30% tiền hoa hồng và gửi yêu cầu rút tiền về STK trong 3s.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
