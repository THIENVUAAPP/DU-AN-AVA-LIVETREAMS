import React, { useState } from 'react';
import { Check, Coins, Zap, AlertCircle, Sparkles, Crown, Rocket } from 'lucide-react';
import { useToken } from './TokenContext';
import SepayQRModal from './SepayQRModal';

// ============================================================
// CÁC GÓI NẠP THÊM TOKEN PHỤ (3 Gói Giá trị x3, Tăng Thưởng 10% - 15% - 20%)
// ============================================================
export const TOKEN_ADDON_PACKAGES = [
  {
    id: 'token_starter',
    name: 'Gói Token Khởi Nghiệp',
    tokens: 11000, // 10.000 + 10% thưởng = 11.000 Token
    baseTokens: 10000,
    bonusPercent: 10,
    price: 499000,
    icon: Zap,
    color: 'blue',
    desc: 'Gói nạp phụ trải nghiệm AI mượt mà',
    features: ['10.000 Token Gốc', 'Tặng thêm +10% Token (1.000 Token)', 'Tổng nhận: 11.000 Token', 'Dùng AI Gemini & ElevenLabs ~1.500 lượt', 'Không giới hạn thời gian sử dụng'],
    highlight: false,
    badge: 'THƯỞNG +10%',
  },
  {
    id: 'token_growth',
    name: 'Gói Token Tăng Trưởng',
    tokens: 34500, // 30.000 + 15% thưởng = 34.500 Token
    baseTokens: 30000,
    bonusPercent: 15,
    price: 1497000, // 499.000 x 3
    icon: Rocket,
    color: 'indigo',
    desc: 'Giá trị x3 lần — Livestream liên tục cả tháng',
    features: ['30.000 Token Gốc (x3 Giá trị)', 'Tặng thêm +15% Token (4.500 Token)', 'Tổng nhận: 34.500 Token', 'Dùng AI Gemini & ElevenLabs ~5.000 lượt', 'Ưu tiên băng thông đường truyền AI'],
    highlight: true,
    badge: 'PHỔ BIẾN NHẤT +15%',
  },
  {
    id: 'token_vip',
    name: 'Gói Token Đột Phá VIP',
    tokens: 108000, // 90.000 + 20% thưởng = 108.000 Token
    baseTokens: 90000,
    bonusPercent: 20,
    price: 4491000, // 1.497.000 x 3
    icon: Crown,
    color: 'amber',
    desc: 'Giá trị x3 tiếp — Dành cho Studio & Streamer VIP',
    features: ['90.000 Token Gốc (x9 Giá trị)', 'Tặng thêm +20% Token (18.000 Token)', 'Tổng nhận: 108.000 Token', 'Dùng AI Gemini & ElevenLabs ~15.000 lượt', 'Hỗ trợ kỹ thuật VIP 24/7 riêng biệt'],
    highlight: false,
    badge: 'SIÊU VIP +20%',
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
              <Sparkles size={10} /> AvaLive Token Addon System
            </span>
            <h1 className="text-4xl font-black text-white mb-3 leading-tight">
              Nạp Thêm Token để<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Livestream Không Giới Hạn</span>
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed max-w-md">
              Token nạp phụ sử dụng linh hoạt cho AI Gemini, ElevenLabs TTS và Game Tương Tác. Thưởng thêm đến 20% Token, không bao giờ hết hạn.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Thanh toán VietQR SePay
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Thưởng thêm 10% - 20% Token
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-gray-300">
                <Check size={12} className="text-emerald-400" /> Token vĩnh viễn không hết hạn
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white">3 Gói Nạp Thêm Token Ưu Đãi</h2>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            🎁 Tặng Thêm Đến +20% Token
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOKEN_ADDON_PACKAGES.map(pkg => {
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
                  <div className="text-sm font-bold text-amber-400 mt-1 flex items-center gap-1.5">
                    <span>+{pkg.tokens.toLocaleString()} Token</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                      +{pkg.bonusPercent}% Thưởng
                    </span>
                  </div>
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
                  Nạp ngay • {pkg.price.toLocaleString()}đ
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          🔒 Thanh toán bảo mật qua cổng SePay VietQR (Techcombank 19035907828017) • Tự động cộng Token ngay sau 3 giây
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
