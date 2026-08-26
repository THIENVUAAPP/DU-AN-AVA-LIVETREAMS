import React from 'react';
import { 
  Download, Sparkles, ShieldCheck, CheckCircle2, Terminal, Monitor, 
  Apple, Laptop, Radio, Cpu, Zap, ArrowRight, PlayCircle
} from 'lucide-react';

export default function KOLLiveDashboard() {
  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/Livestream_AI_Software.zip';
    link.download = 'AvaLive_VIP_PRO_Full_Package_MacWin.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[85vh] bg-[#07090E] text-white font-sans flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background Glow Aura */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10 text-center">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-purple-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-lg">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>BẢN QUYỀN PHẦN MỀM ĐỘC QUYỀN AVALIVE VIP PRO</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
            Tải Phần Mềm AvaLive Studio
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Phần mềm hoạt động độc lập trên máy tính Mac & Windows. Giải nén là sử dụng ngay 100% tất cả tính năng Studio 4K, AI Idol, Game Bản Đồ 63 Tỉnh & Kết Nối Trực Tiếp OBS Studio.
          </p>
        </div>

        {/* Big Glow Download CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#101426]/90 to-[#0c0f1d]/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/70 backdrop-blur-2xl space-y-6 relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={triggerDownload}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3 cursor-pointer border border-cyan-300/40 animate-pulse"
            >
              <Download className="w-6 h-6" />
              <span>TẢI BẢN ZIP TRỌN GÓI (MAC & WIN)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300 font-medium">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Dung lượng siêu nhẹ (~43.25 MB)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Không cần đăng nhập (0-Login)
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400">
              <CheckCircle2 className="w-4 h-4 text-yellow-400" /> Tự động trừ Token theo gói
            </span>
          </div>
        </div>

        {/* 3-Step Simple Launch Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Mac Guide Card */}
          <div className="p-6 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-sm">
              <Apple className="w-5 h-5 text-cyan-400" />
              <span>Dành cho Máy Mac (macOS / MacBook)</span>
            </div>
            <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Giải nén file ZIP vừa tải về.</li>
              <li>Nhấp đúp chuột vào file: <code className="text-cyan-300 font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">Chay_App_Mac_Linux.command</code></li>
              <li>Hệ thống sẽ tự động bật máy chủ và mở màn hình Studio dùng ngay.</li>
            </ol>
          </div>

          {/* Windows Guide Card */}
          <div className="p-6 rounded-2xl bg-[#0D101A] border border-white/10 hover:border-blue-500/40 transition-all space-y-3">
            <div className="flex items-center gap-2.5 text-blue-300 font-bold text-sm">
              <Monitor className="w-5 h-5 text-blue-400" />
              <span>Dành cho Máy tính Windows (PC / Laptop)</span>
            </div>
            <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Giải nén file ZIP vừa tải về.</li>
              <li>Nhấp đúp chuột vào file: <code className="text-yellow-300 font-mono bg-yellow-950/60 px-1.5 py-0.5 rounded border border-yellow-800/40">Chay_App_Windows.bat</code></li>
              <li>Ứng dụng sẽ tự động mở và sẵn sàng livestream ngay lập tức.</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}
