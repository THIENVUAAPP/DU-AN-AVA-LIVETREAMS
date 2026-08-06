import React from 'react';
import { Lock, Crown, ArrowRight } from 'lucide-react';

export default function UpgradePrompt({ featureName, requiredPlan, setActiveTab }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in-up">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-purple-500/20 flex items-center justify-center mb-6 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
        <Lock className="w-12 h-12 text-amber-400" />
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4">Tính Năng Giới Hạn</h2>
      <p className="text-gray-400 text-lg max-w-xl mb-8">
        Chức năng <strong className="text-white">{featureName}</strong> yêu cầu hạng tài khoản từ <strong className="text-amber-400">{requiredPlan}</strong> trở lên. Vui lòng nâng cấp gói cước để mở khóa không giới hạn sức mạnh của Hệ Sinh Thái.
      </p>

      <button 
        onClick={() => setActiveTab('overview')}
        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center gap-2"
      >
        <Crown className="w-5 h-5" />
        XEM BẢNG GIÁ & NÂNG CẤP NGAY <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
