import React, { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Radio,
  Zap,
  X,
  Swords,
  Layers,
  MonitorPlay,
  Map,
  Lock,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
} from "lucide-react";

/**
 * 👑 MODAL LIÊN KẾT TIKTOK LIVE STUDIO
 * - Cloudflare Quick Tunnel: trycloudflare.com — không có trang cảnh báo IP
 * - TikTok Studio chấp nhận 100%, không bị lỗi Invalid URL
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose, currentUser, onOpenLogin }) {
  const [copiedId, setCopiedId] = useState(null);
  const [tunnelData, setTunnelData] = useState(null);
  const [tunnelLoading, setTunnelLoading] = useState(true);

  const fetchTunnelUrl = useCallback(async () => {
    try {
      setTunnelLoading(true);
      const host = typeof window !== 'undefined' && window.location.origin.includes('http')
        ? window.location.origin
        : 'http://127.0.0.1:3001';
      let res;
      try {
        res = await fetch(`${host}/api/tunnel-url`);
      } catch (e) {
        res = await fetch('http://127.0.0.1:3001/api/tunnel-url');
      }
      if (res && res.ok) {
        const data = await res.json();
        setTunnelData(data);
        setTunnelLoading(false);
        if (data.status !== "active") {
          setTimeout(fetchTunnelUrl, 2000);
        }
      } else {
        setTunnelLoading(false);
        setTimeout(fetchTunnelUrl, 3000);
      }
    } catch (err) {
      setTunnelLoading(false);
      setTimeout(fetchTunnelUrl, 3000);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTunnelUrl();
    }
  }, [isOpen, fetchTunnelUrl]);

  if (!isOpen) return null;

  const getProjectUrl = (path) => {
    if (tunnelData?.projects?.[path]) {
      return tunnelData.projects[path];
    }
    if (tunnelData?.tunnelUrl) {
      return `${tunnelData.tunnelUrl}/${path}`;
    }
    const host = typeof window !== 'undefined' && window.location.origin.includes('http')
      ? window.location.origin
      : 'http://127.0.0.1:3001';
    return `${host}/${path}`;
  };

  const projects = [
    {
      id: "idol",
      name: "DỰ ÁN 1: LIVE AI IDOL & VIDEO NỀN",
      tag: "HOT NHẤT",
      tagColor: "from-pink-500 to-rose-600",
      icon: MonitorPlay,
      iconColor: "text-pink-400",
      bgColor: "bg-[#1a0f14]/80 border-pink-500/20 hover:border-pink-500/40",
      path: "idol",
    },
    {
      id: "bando",
      name: "DỰ ÁN 2: GAME BẢN ĐỒ VIỆT NAM (63 TỈNH THÀNH)",
      tag: "CẮM CỜ 3D",
      tagColor: "from-amber-500 to-orange-600",
      icon: Map,
      iconColor: "text-amber-400",
      bgColor: "bg-[#1a150f]/80 border-amber-500/20 hover:border-amber-500/40",
      path: "bando",
    },
    {
      id: "battle",
      name: "DỰ ÁN 3: GAME CHIẾN ĐẤU PK (TIKTOK LIVE BATTLE)",
      tag: "HÚT QUÀ TẶNG",
      tagColor: "from-red-500 to-rose-600",
      icon: Swords,
      iconColor: "text-red-400",
      bgColor: "bg-[#1a0f0f]/80 border-red-500/20 hover:border-red-500/40",
      path: "battle",
    },
  ];

  const handleCopy = (url, id) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      // Fallback cho môi trường HTTP (VD: 127.0.0.1.nip.io)
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      } catch (err) {
        console.error('Lỗi copy:', err);
      }
      textArea.remove();
    }
  };

  const isTunnelActive = tunnelData?.status === "active" && tunnelData?.tunnelUrl;
  const tunnelConnecting = tunnelData?.status === "connecting" || (tunnelLoading && !tunnelData);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn select-none font-sans">
      <div className="glass-panel p-5 sm:p-7 rounded-[32px] border border-cyan-500/40 max-w-3xl w-full text-left space-y-4 shadow-2xl bg-[#090A10]/98 max-h-[92vh] flex flex-col relative">

        {/* Nút Đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3 pr-10">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">
              ĐƯỜNG LINK TIKTOK LIVE STUDIO (CHÍNH THỨC)
            </h2>
            <p className="text-[11px] text-cyan-300 font-bold">
              Link HTTPS Cloudflare (*.trycloudflare.com) — TikTok Studio nhận diện và phát video ngay lập tức!
            </p>
          </div>
        </div>

            {/* === TRẠNG THÁI TUNNEL === */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-xs font-bold ${
              isTunnelActive
                ? "bg-emerald-900/40 border-emerald-500/40 text-emerald-300"
                : tunnelConnecting
                ? "bg-yellow-900/40 border-yellow-500/40 text-yellow-300"
                : "bg-red-900/40 border-red-500/40 text-red-300"
            }`}>
              {isTunnelActive ? (
                <>
                  <Wifi className="w-4 h-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-black">✅ CLOUDFLARE TUNNEL ĐANG HOẠT ĐỘNG — KHÔNG CẦN NHẬP IP!</p>
                    <p className="font-normal text-emerald-400/80 mt-0.5 font-mono text-[10px]">{tunnelData.tunnelUrl}</p>
                  </div>
                  <button onClick={fetchTunnelUrl} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer" title="Làm mới">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : tunnelConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  <div className="flex-1">
                    <p className="font-black">⏳ ĐANG KHỞI ĐỘNG CLOUDFLARE TUNNEL...</p>
                    <p className="font-normal text-yellow-400/80 mt-0.5">Đợi khoảng 5-15 giây. Tự động cập nhật khi sẵn sàng.</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-black">❌ TUNNEL CHƯA SẴN SÀNG</p>
                    <p className="font-normal text-red-400/80 mt-0.5">Khởi động lại phần mềm và thử lại.</p>
                  </div>
                  <button onClick={fetchTunnelUrl} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            {/* === DANH SÁCH DỰ ÁN === */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <Layers className="w-3.5 h-3.5 text-gray-500" />
                <span>SAO CHÉP LINK CLOUDFLARE NÀY VÀO TIKTOK STUDIO (BROWSER SOURCE):</span>
              </div>

              {projects.map((proj) => {
                const Icon = proj.icon;
                const isCopied = copiedId === proj.id;
                const url = getProjectUrl(proj.path);
                const isLoading = !isTunnelActive && tunnelConnecting;

                return (
                  <div key={proj.id} className={`p-3 rounded-2xl border transition-all ${proj.bgColor} space-y-2 relative`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-black/40 border border-white/10">
                          <Icon className={`w-3.5 h-3.5 ${proj.iconColor}`} />
                        </div>
                        <span className="text-xs font-black text-white tracking-wide">{proj.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white bg-gradient-to-r ${proj.tagColor}`}>
                        {proj.tag}
                      </span>
                    </div>

                      {/* Input & Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-0.5">
                      <input
                        type="text"
                        readOnly
                        value={url}
                        className={`w-full sm:flex-1 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold focus:outline-none select-all transition-colors ${
                          isTunnelActive
                            ? "bg-black/70 border-emerald-500/30 text-emerald-300"
                            : "bg-black/40 border-yellow-500/30 text-yellow-300"
                        }`}
                      />

                      <div className="flex items-center gap-1.5 w-full sm:w-auto">
                        <button
                          onClick={() => handleCopy(url, proj.id)}
                          className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 ${
                            isCopied ? "bg-emerald-600 text-white" : "bg-white/15 hover:bg-white/25 text-white"
                          }`}
                        >
                          {isCopied ? (
                            <><Check className="w-3.5 h-3.5" /><span>ĐÃ SAO CHÉP</span></>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /><span>Sao chép</span></>
                          )}
                        </button>

                        <a
                          href={url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                          title="Mở tab mới xem thử"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* === HƯỚNG DẪN === */}
            <div className="p-3 rounded-2xl bg-black/70 border border-white/15 text-xs shrink-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-[11.5px]">
                  <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
                  <span>HƯỚNG DẪN KẾT NỐI TIKTOK LIVE STUDIO:</span>
                </div>
                <button onClick={onClose} className="px-3.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all">
                  Đóng
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-green-300">🌐 Cách dán vào TikTok Studio:</span>
                  <p className="text-gray-400 leading-relaxed">
                    Sao chép link ở trên → Thêm nguồn <b>Browser Source</b> trong TikTok Studio → Dán link vào → Kích thước <b>1080×1920</b>.
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-cyan-300">🔄 Tự động đồng bộ:</span>
                  <p className="text-gray-400 leading-relaxed">
                    Link đã tự động nhúng mã đường hầm để kết nối với máy tính này. Video/Âm thanh sẽ <b>đồng bộ lập tức</b> khi bạn bấm chạy trên phần mềm!
                  </p>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
}
