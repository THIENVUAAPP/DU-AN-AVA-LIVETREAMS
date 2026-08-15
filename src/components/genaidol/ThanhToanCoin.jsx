import React, { useState } from 'react';
import { 
  Check, Coins, Zap, AlertCircle, Sparkles, Crown, Rocket, 
  Clock, ShieldCheck, CheckCircle2, ChevronRight, Info, Layers, Calendar
} from 'lucide-react';
import { useToken } from './TokenContext';
import SepayQRModal from './SepayQRModal';

// ============================================================
// 1. 3 GÓI PHỤ NẠP THÊM TOKEN (Hạn Dùng 3 Tháng, x3 Giá & Thưởng +10% -> +20%)
// ============================================================
export const TOKEN_ADDON_PACKAGES = [
  {
    id: 'token_starter',
    name: 'Gói Token Khởi Nghiệp (Gói Phụ)',
    type: 'addon',
    tokens: 11000, // 10.000 + 10% thưởng = 11.000 Token
    baseTokens: 10000,
    bonusPercent: 10,
    price: 499000,
    durationMonths: 3,
    icon: Zap,
    color: 'blue',
    desc: 'Gói phụ bổ sung trải nghiệm AI và kịch bản nhanh',
    features: [
      '10.000 Token Gốc',
      'Tặng thưởng +10% (1.000 Token)',
      'Tổng nhận: 11.000 Token',
      'Hạn sử dụng: 3 Tháng (90 ngày)',
      'Dùng AI Gemini & ElevenLabs ~1.500 lượt thoại',
      'Sau 3 tháng không dùng hết sẽ tự động reset về 0'
    ],
    highlight: false,
    badge: 'THƯỞNG +10% TOKEN',
  },
  {
    id: 'token_growth',
    name: 'Gói Token Tăng Trưởng (Gói Phụ x3)',
    type: 'addon',
    tokens: 34500, // 30.000 + 15% thưởng = 34.500 Token
    baseTokens: 30000,
    bonusPercent: 15,
    price: 1497000, // 499.000 x 3
    durationMonths: 3,
    icon: Rocket,
    color: 'indigo',
    desc: 'Giá trị x3 lần — Đột phá đơn hàng & tương tác mạnh',
    features: [
      '30.000 Token Gốc (x3 giá trị)',
      'Tặng thưởng +15% (4.500 Token)',
      'Tổng nhận: 34.500 Token',
      'Hạn sử dụng: 3 Tháng (90 ngày)',
      'Dùng AI Gemini & ElevenLabs ~5.000 lượt thoại',
      'Ưu tiên băng thông đường truyền giọng nói AI',
      'Sau 3 tháng không dùng hết sẽ tự động reset về 0'
    ],
    highlight: true,
    badge: 'PHỔ BIẾN NHẤT +15%',
  },
  {
    id: 'token_vip',
    name: 'Gói Token Đột Phá VIP (Gói Phụ x9)',
    type: 'addon',
    tokens: 108000, // 90.000 + 20% thưởng = 108.000 Token
    baseTokens: 90000,
    bonusPercent: 20,
    price: 4491000, // 1.497.000 x 3
    durationMonths: 3,
    icon: Crown,
    color: 'amber',
    desc: 'Giá trị x9 lần — Dành cho Studio & Streamer VIP bán hàng',
    features: [
      '90.000 Token Gốc (x9 giá trị)',
      'Tặng thưởng +20% (18.000 Token)',
      'Tổng nhận: 108.000 Token',
      'Hạn sử dụng: 3 Tháng (90 ngày)',
      'Dùng AI Gemini & ElevenLabs ~16.000 lượt thoại',
      'Hỗ trợ kỹ thuật VIP 24/7 riêng biệt',
      'Sau 3 tháng không dùng hết sẽ tự động reset về 0'
    ],
    highlight: false,
    badge: 'SIÊU VIP +20% TOKEN',
  },
];

// ============================================================
// 2. 3 GÓI BẢN QUYỀN LIVESTREAM (Gói Tháng / Gói Năm)
// ============================================================
export const SUBSCRIPTION_PACKAGES = [
  {
    id: 'sub_starter',
    name: 'Gói Starter Pro (Bản Quyền)',
    type: 'subscription',
    priceMonthly: 490000,
    priceAnnual: 4900000,
    hours: '200 Giờ Live / tháng',
    multistream: '3 Kênh Multistream',
    res: 'Full HD 1080p',
    tokensIncluded: 15000,
    desc: 'Dành cho cá nhân & shop khởi nghiệp bán hàng',
    features: [
      'Thời lượng: 200 Giờ Live / tháng',
      '3 Luồng Livestream đồng thời (TikTok, Shopee, FB)',
      'Chất lượng Full HD 1080p mượt mà',
      'Bao gồm 15.000 Token AI mỗi tháng',
      'Đồng bộ 2 hệ giọng Voice Quản lý & Idol',
      'Kho kịch bản 1-chạm & tương tác phòng live'
    ],
    badge: 'KHỞI NGHIỆP',
    color: 'blue'
  },
  {
    id: 'sub_business',
    name: 'Gói Business Growth (Bản Quyền)',
    type: 'subscription',
    priceMonthly: 1490000,
    priceAnnual: 14900000,
    hours: '700 Giờ Live / tháng',
    multistream: '10 Kênh Multistream',
    res: '4K Ultra HD 60fps',
    tokensIncluded: 50000,
    popular: true,
    desc: 'Bán chạy nhất cho Doanh nghiệp & Chuỗi bán lẻ',
    features: [
      'Thời lượng: 700 Giờ Live / tháng (Gần 24/7)',
      '10 Luồng Livestream đa nền tảng cùng lúc',
      'Độ phân giải 4K 60fps siêu nét',
      'Bao gồm 50.000 Token AI mỗi tháng',
      'Auto-Trigger chốt đơn flash sale tự động',
      'Đổi giọng Voice & Nhân vật 3D không giới hạn',
      'Ưu tiên xử lý AI tốc độ cực nhanh'
    ],
    badge: 'BÁN CHẠY NHẤT',
    color: 'indigo'
  },
  {
    id: 'sub_enterprise',
    name: 'Gói Enterprise VIP (Bản Quyền)',
    type: 'subscription',
    priceMonthly: 4900000,
    priceAnnual: 49000000,
    hours: 'UNLIMITED 4.000 Giờ Live',
    multistream: '30+ Kênh Multistream',
    res: '4K Dedicated 10Gbps',
    tokensIncluded: 200000,
    desc: 'Giải pháp tối thượng cho Studio, MCN & Tập đoàn',
    features: [
      'Thời lượng: UNLIMITED 4.000 Giờ Live / tháng',
      '30+ Luồng Stream đồng thời không giới hạn',
      'Hạ tầng máy chủ riêng Dedicated 10Gbps',
      'Bao gồm 200.000 Token AI mỗi tháng',
      'Bảo hành vận hành phòng live 24/7',
      'Huấn luyện Clone giọng nói AI riêng biệt'
    ],
    badge: 'DOANH NGHIỆP VIP',
    color: 'amber'
  }
];

const colorMap = {
  blue: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-500/40', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
  indigo: { bg: 'from-indigo-500 to-purple-600', border: 'border-indigo-500/50', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' },
  amber: { bg: 'from-amber-500 to-orange-500', border: 'border-amber-500/50', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
};

export default function ThanhToanCoin({ initialTab = 'tokens', onClose }) {
  const { balance } = useToken();
  const [activeTab, setActiveTab] = useState(initialTab); // 'tokens' | 'subscription' | 'all'
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [selectedPkg, setSelectedPkg] = useState(null);

  const balanceColor = balance === 0 ? 'text-red-400' : balance < 200 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-[#0d0d16] via-[#121220] to-[#181828] text-white p-5 sm:p-7 overflow-y-auto">
      
      <div className="max-w-5xl mx-auto space-y-7">
        
        {/* ==================== 1. TOP HEADER & BALANCE ==================== */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black border border-amber-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={11} /> Cổng Thanh Toán & Bảng Giá AvaLive
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20">
                ⚡ Tự Động Kích Hoạt 3 Giây
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Bảng Giá & Gói Nạp <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500">Token Livestream AI</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Chọn mua <strong>3 Gói Phụ Nạp Thêm Token</strong> (hạn dùng 3 tháng, thưởng đến +20%) hoặc <strong>3 Gói Bản Quyền</strong> phát live liên tục 24/7.
            </p>
          </div>

          {/* Balance card */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl flex items-center justify-between gap-4 shrink-0">
            <div>
              <p className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Coins size={15} className="text-amber-400" /> Số Dư Token Hiện Tại
              </p>
              <div className={`text-3xl sm:text-4xl font-black tracking-tight mt-1 ${balanceColor}`}>
                {balance.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-400">Token AvaLive sẵn sàng dùng</p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-gray-300 block">
                Techcombank
              </span>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                QR 24/7 SePay
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 2. TAB SWITCHER ==================== */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-black/40 border border-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'tokens'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap size={14} /> 3 Gói Phụ Nạp Thêm Token (+20% Thưởng • Hạn 3 Tháng)
            </button>
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'subscription'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Crown size={14} /> 3 Gói Bản Quyền Livestream (Tháng / Năm)
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white/20 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} /> Tất Cả Các Gói
            </button>
          </div>

          {/* Nếu đang ở tab Subscription -> hiện nút chuyển Tháng / Năm */}
          {(activeTab === 'subscription' || activeTab === 'all') && (
            <div className="flex items-center gap-2 bg-black/40 border border-gray-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-500 text-black font-extrabold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>Trả Theo Năm</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-black uppercase">Tặng 2 Tháng</span>
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Trả Từng Tháng
              </button>
            </div>
          )}
        </div>

        {/* ==================== 3. KHU VỰC 3 GÓI PHỤ NẠP THÊM TOKEN ==================== */}
        {(activeTab === 'tokens' || activeTab === 'all') && (
          <div className="space-y-4">
            
            {/* Banner Lưu ý về Hạn dùng 3 tháng của Gói phụ theo đúng yêu cầu */}
            <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-start gap-3 text-xs text-amber-200">
              <Clock size={20} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5">
                  ⏳ Quy định & Thời hạn sử dụng của 3 Gói Phụ Nạp Thêm Token:
                </strong>
                <span>
                  Các <strong>Gói Phụ</strong> được thiết kế để nạp thêm linh hoạt cho phiên live. 
                  Số lượng token của gói phụ có hạn sử dụng trong vòng <strong>3 tháng (90 ngày)</strong> kể từ thời điểm nạp. 
                  Sau 3 tháng, nếu không sử dụng hết thì lượng token gói phụ này sẽ tự động reset về 0. 
                  Mỗi cấp gói phụ nhân 3 số tiền và tăng thưởng thêm từ <strong>+10% ➔ +15% ➔ +20% Token</strong>.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-400" />
                3 GÓI PHỤ NẠP THÊM TOKEN (HẠN DÙNG 3 THÁNG)
              </h2>
              <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                🎁 Thưởng Thêm Đến +20% Token
              </span>
            </div>

            {/* Grid 3 Gói Phụ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TOKEN_ADDON_PACKAGES.map(pkg => {
                const c = colorMap[pkg.color];
                const Icon = pkg.icon;

                return (
                  <div
                    key={pkg.id}
                    className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all group ${
                      pkg.highlight
                        ? 'bg-gradient-to-b from-indigo-950/70 via-[#161630] to-[#121224] border-indigo-500/60 shadow-2xl shadow-indigo-950/50 scale-[1.02]'
                        : 'bg-[#151522] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.8 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black rounded-full shadow-lg whitespace-nowrap">
                        {pkg.badge}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg`}>
                          <Icon size={20} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 flex items-center gap-1">
                          <Calendar size={11} /> Hạn 3 Tháng
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white mb-1">{pkg.name}</h3>
                      <p className="text-[11px] text-gray-400 mb-3">{pkg.desc}</p>

                      <div className="p-3 rounded-xl bg-black/40 border border-gray-800/80 mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">{pkg.price.toLocaleString()}</span>
                          <span className="text-gray-400 text-xs font-bold">VNĐ</span>
                        </div>
                        <div className="text-xs font-bold text-amber-400 mt-1 flex items-center justify-between">
                          <span>Nhận: <strong>{pkg.tokens.toLocaleString()} Token</strong></span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                            +{pkg.bonusPercent}% Thưởng
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-5">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <Check size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedPkg(pkg)}
                      className={`w-full py-3 font-extrabold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                        pkg.highlight
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-black shadow-orange-500/20'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
                      }`}
                    >
                      <Zap size={14} fill="currentColor" /> NẠP GÓI NÀY NGAY • {pkg.price.toLocaleString()}đ
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 4. KHU VỰC 3 GÓI BẢN QUYỀN LIVESTREAM ==================== */}
        {(activeTab === 'subscription' || activeTab === 'all') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-t border-gray-800 pt-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Crown size={18} className="text-yellow-400" />
                3 GÓI BẢN QUYỀN PHẦN MỀM LIVESTREAM (GÓI CHÍNH)
              </h2>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                ⚡ Livestream 24/7 Tự Động
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SUBSCRIPTION_PACKAGES.map(sub => {
                const isYearly = billingCycle === 'annual';
                const price = isYearly ? sub.priceAnnual : sub.priceMonthly;
                const periodLabel = isYearly ? '/ năm (Tặng 2 tháng)' : '/ tháng';

                return (
                  <div
                    key={sub.id}
                    className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      sub.popular
                        ? 'bg-gradient-to-b from-purple-950/60 via-[#18182e] to-[#131322] border-purple-500/60 shadow-2xl scale-[1.02]'
                        : 'bg-[#151522] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {sub.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg whitespace-nowrap">
                        {sub.badge}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                          <Crown size={18} />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-emerald-400">
                          {sub.hours}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white mb-1">{sub.name}</h3>
                      <p className="text-[11px] text-gray-400 mb-3">{sub.desc}</p>

                      <div className="p-3 rounded-xl bg-black/40 border border-gray-800/80 mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">{price.toLocaleString()}</span>
                          <span className="text-gray-400 text-xs font-bold">VNĐ</span>
                          <span className="text-[10px] text-gray-500 ml-1">{periodLabel}</span>
                        </div>
                        <div className="text-[11px] text-blue-400 font-bold mt-1">
                          Bao gồm: <strong>+{sub.tokensIncluded.toLocaleString()} Token/tháng</strong>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-5">
                        {sub.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <Check size={13} className="text-blue-400 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setSelectedPkg({
                        id: sub.id,
                        name: sub.name,
                        price: price,
                        tokens: sub.tokensIncluded,
                        bonusPercent: 10,
                        type: 'subscription'
                      })}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                      <Crown size={14} /> ĐĂNG KÝ BẢN QUYỀN • {price.toLocaleString()}đ
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 5. FOOTER ASSURANCE ==================== */}
        <div className="p-4 rounded-xl bg-black/40 border border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Thanh toán tự động qua SePay VietQR (Techcombank) • Kích hoạt tài khoản và cộng Token tức thì trong 3 giây.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">Hỗ trợ: 098.xxx.xxxx</span>
          </div>
        </div>

      </div>

      {/* ==================== SEPAY VIETQR PAYMENT MODAL ==================== */}
      {selectedPkg && (
        <SepayQRModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onSuccess={() => {
            setSelectedPkg(null);
          }}
        />
      )}

    </div>
  );
}
