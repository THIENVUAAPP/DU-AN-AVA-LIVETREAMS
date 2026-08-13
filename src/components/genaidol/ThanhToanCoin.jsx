import React, { useState } from 'react';
import { Check, Coins, Zap, AlertCircle, Sparkles, Crown, Rocket } from 'lucide-react';
import { useToken } from './TokenContext';
import SepayQRModal from './SepayQRModal';

// ============================================================
// CÁC GÓI TOKEN (Anh chỉnh giá & số token ở đây)
// ============================================================
const TOKEN_PACKAGES = [
  {
    id: 'starter',
    name: 'Gói Khởi Đầu',
    tokens: 1000,
    price: 99000,
    icon: Zap,
    color: 'blue',
    desc: 'Phù hợp để trải nghiệm AvaLive AI',
    features: ['1.000 Token AvaLive', 'Dùng AI Gemini ~200 phiên', 'Dùng ElevenLabs TTS ~50.000 ký tự'],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Gói Pro',
    tokens: 5000,
    price: 399000,
    icon: Rocket,
    color: 'indigo',
    desc: 'Livestream không giới hạn cả tuần',
    features: ['5.000 Token AvaLive', 'Dùng AI Gemini ~1.000 phiên', 'Dùng ElevenLabs TTS ~250.000 ký tự', 'Tặng thêm 10% Token'],
    highlight: true,
    badge: 'PHỔ BIẾN',
  },
  {
    id: 'vip',
    name: 'Gói VIP',
    tokens: 15000,
    price: 999000,
    icon: Crown,
    color: 'amber',
    desc: 'Dành cho streamer chuyên nghiệp',
    features: ['15.000 Token AvaLive', 'Dùng AI Gemini ~3.000 phiên', 'Dùng ElevenLabs TTS ~750.000 ký tự', 'Tặng thêm 20% Token', 'Hỗ trợ kỹ thuật ưu tiên'],
    highlight: false,
  },
];

const colorMap = {
  blue: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-700 border-blue-200', btn: 'bg-blue-600 hover:bg-blue-500', icon: 'text-blue-500' },
  indigo: { bg: 'from-indigo-500 to-purple-600', light: 'bg-indigo-50 text-indigo-700 border-indigo-200', btn: 'bg-indigo-600 hover:bg-indigo-500', icon: 'text-indigo-500' },
  amber: { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50 text-amber-700 border-amber-200', btn: 'bg-amber-500 hover:bg-amber-400', icon: 'text-amber-500' },
};

export default function ThanhToanCoin({ onClose }) {
  const { balance } = useToken();
  const [selectedPkg, setSelectedPkg] = useState(null);

  const balanceColor = balance === 0 ? 'text-red-400' : balance < 200 ? 'text-orange-400' : 'text-emerald-400';

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] text-white p-6 overflow-y-auto">
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-10">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black mb-4 border border-amber-500/20 uppercase tracking-widest">
              <Sparkles size={10} /> AvaLive Token System
            </span>
            <h1 className="text-4xl font-black text-white mb-3 leading-tight">
              Nạp Token để<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Livestream không ngừng</span>
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed max-w-md">
              Token được sử dụng khi AI Gemini và ElevenLabs xử lý phiên live. Mua một lần, dùng mãi không hết hạn theo gói.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Thanh toán qua SePay
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Cộng token tự động
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Token không hết hạn
              </div>
            </div>
          </div>

          {/* Balance card */}
          <div className="w-full lg:w-72 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm font-bold text-blue-300 mb-2">💎 Số dư Token hiện tại</p>
            <div className={`text-5xl font-black mb-1 ${balanceColor}`}>{balance.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Token AvaLive</p>
            {balance < 200 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 rounded-lg px-3 py-2 border border-orange-500/20">
                <AlertCircle size={13} /> Số dư sắp hết, hãy nạp thêm!
              </div>
            )}
          </div>
        </div>

        {/* Packages */}
        <h2 className="text-xl font-black text-white mb-5">Chọn gói Token phù hợp</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOKEN_PACKAGES.map(pkg => {
            const c = colorMap[pkg.color];
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-6 border transition-all cursor-pointer group ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-indigo-900/60 to-purple-900/40 border-indigo-500/50 shadow-xl shadow-indigo-900/30'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/8'
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-full shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>

                <h3 className="text-lg font-black text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{pkg.desc}</p>

                <div className="mb-4">
                  <span className="text-3xl font-black text-white">{pkg.price.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm">đ</span>
                  <div className="text-sm font-bold text-amber-400 mt-1">+{pkg.tokens.toLocaleString()} Token</div>
                </div>

                <ul className="space-y-2 mb-5">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={13} className="text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full py-3 bg-gradient-to-r ${c.bg} hover:opacity-90 text-white font-black rounded-xl shadow-md transition-all text-sm`}
                >
                  Mua ngay • {pkg.price.toLocaleString()}đ
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          🔒 Thanh toán được bảo mật qua cổng SePay • VietQR • Hỗ trợ tất cả ngân hàng Việt Nam
        </p>
      </div>

      {/* SePay Modal */}
      {selectedPkg && (
        <SepayQRModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
          onSuccess={() => setSelectedPkg(null)}
        />
      )}
    </div>
  );
}
