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
  Monitor,
  Tv,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from "lucide-react";

/**
 * 👑 MODAL LIÊN KẾT TIKTOK LIVE STUDIO & OBS
 * - Cung cấp đồng thời Link Nội Bộ (Localhost 127.0.0.1:3001) siêu tốc 0ms delay và Link Cloudflare Quick Tunnel
 * - Hướng dẫn chi tiết khắc phục lỗi màn hình đen trong OBS / TikTok Studio khi Window Capture
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose, currentUser, onOpenLogin }) {
  const [copiedId, setCopiedId] = useState(null);
  const [tunnelData, setTunnelData] = useState(() => {
    try {
      const saved = localStorage.getItem('avalive_tunnel_data');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [tunnelLoading, setTunnelLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("window_capture");

  const handleOpenWindowCapture = () => {
    const width = 540;
    const height = 1040; // 80px dock & vạch cắt an toàn + 960px khung hình live 9:16
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    const captureUrl = `${window.location.origin}/live?mode=window_capture`;
    window.open(
      captureUrl,
      'avalive_window_capture_target',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
  };

  const fetchTunnelUrl = useCallback(async () => {
    try {
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
        if (data.status === 'active' && data.tunnelUrl) {
          try { localStorage.setItem('avalive_tunnel_data', JSON.stringify(data)); } catch (e) {}
        }
        if (data.status !== "active") {
          setTimeout(fetchTunnelUrl, 2500);
        }
      }
    } catch (err) {
      setTunnelLoading(false);
    }
  }, []);

  const handleRefreshTunnel = async () => {
    try {
      setTunnelLoading(true);
      const host = typeof window !== 'undefined' && window.location.origin.includes('http')
        ? window.location.origin
        : 'http://127.0.0.1:3001';
      try {
        await fetch(`${host}/api/refresh-tunnel`, { method: 'POST' });
      } catch (e) {
        await fetch('http://127.0.0.1:3001/api/refresh-tunnel', { method: 'POST' }).catch(() => {});
      }
      setTimeout(fetchTunnelUrl, 1500);
    } catch (e) {
      setTimeout(fetchTunnelUrl, 1500);
    }
  };

  useEffect(() => {
    fetchTunnelUrl();
    const interval = setInterval(fetchTunnelUrl, 6000);
    return () => clearInterval(interval);
  }, [fetchTunnelUrl]);

  if (!isOpen) return null;

  // Lấy link nội bộ máy tính (Localhost 127.0.0.1:3001) - 0ms delay, 60FPS mượt nhất
  const getLocalUrl = (path) => {
    const port = typeof window !== 'undefined' && window.location.port ? window.location.port : '3001';
    return `http://127.0.0.1:${port}/${path}`;
  };

  // Lấy link Cloudflare Tunnel
  const getTunnelUrl = (path) => {
    if (tunnelData?.projects?.[path]) {
      return tunnelData.projects[path];
    }
    if (tunnelData?.tunnelUrl) {
      return `${tunnelData.tunnelUrl}/${path}`;
    }
    return getLocalUrl(path);
  };

  const projects = [
    {
      id: "live",
      name: "MASTER LIVE TOÀN NĂNG (TỰ ĐỘNG ĐỔI THEO TAB BẠN ĐANG CHỌN)",
      tag: "KHUYÊN DÙNG ⭐",
      tagColor: "from-cyan-500 to-blue-600",
      icon: Radio,
      iconColor: "text-cyan-400",
      bgColor: "bg-[#0b1329]/90 border-cyan-500/40 hover:border-cyan-400/60",
      path: "live",
    },
    {
      id: "idol",
      name: "DỰ ÁN 1: LIVE AI IDOL & PHÁT VIDEO TRỰC TIẾP",
      tag: "HOT NHẤT 🔥",
      tagColor: "from-pink-500 to-rose-600",
      icon: MonitorPlay,
      iconColor: "text-pink-400",
      bgColor: "bg-[#1a0f14]/80 border-pink-500/30 hover:border-pink-500/50",
      path: "idol",
    },
    {
      id: "bando",
      name: "DỰ ÁN 2: GAME BẢN ĐỒ VIỆT NAM (63 TỈNH THÀNH)",
      tag: "CẮM CỜ 3D 🚩",
      tagColor: "from-amber-500 to-orange-600",
      icon: Map,
      iconColor: "text-amber-400",
      bgColor: "bg-[#1a150f]/80 border-amber-500/30 hover:border-amber-500/50",
      path: "bando",
    },
    {
      id: "battle",
      name: "DỰ ÁN 3: GAME CHIẾN ĐẤU PK (TIKTOK LIVE BATTLE)",
      tag: "HÚT QUÀ ⚔️",
      tagColor: "from-red-500 to-rose-600",
      icon: Swords,
      iconColor: "text-red-400",
      bgColor: "bg-[#1a0f0f]/80 border-red-500/30 hover:border-red-500/50",
      path: "battle",
    },
  ];

  const handleCopy = (url, id) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
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
              TRUNG TÂM PHÁT LUỒNG TIKTOK LIVE STUDIO & OBS
            </h2>
            <p className="text-[11px] text-cyan-300 font-bold">
              Hỗ trợ 2 phương thức: Bắt Cửa Sổ (Window Capture - 0ms) & Nguồn Trình Duyệt (Browser Source)
            </p>
          </div>
        </div>

        {/* === TAB CHUYỂN ĐỔI: WINDOW CAPTURE VS BROWSER SOURCE === */}
        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 gap-1.5">
          <button
            onClick={() => setActiveModalTab('window_capture')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeModalTab === 'window_capture'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4 text-yellow-300" />
            <span>🖥️ BẮT CỬA SỔ (WINDOW CAPTURE)</span>
            <span className="text-[9px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full font-extrabold hidden sm:inline">KHUYÊN DÙNG CHO WINDOWS</span>
          </button>

          <button
            onClick={() => setActiveModalTab('browser_source')}
            className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeModalTab === 'browser_source'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wifi className="w-4 h-4 text-cyan-300" />
            <span>🌐 NGUỒN TRÌNH DUYỆT (BROWSER SOURCE)</span>
          </button>
        </div>

        {activeModalTab === 'window_capture' ? (
          /* === TAB 1: WINDOW CAPTURE CHO TIKTOK LIVE STUDIO (KHUYÊN DÙNG) === */
          <div className="space-y-3.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#0e1322] to-black/80 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span>CỬA SỔ LIVE 9:16 TRỰC TIẾP — DỄ DÀNG 100% TRÊN MÁY WINDOWS</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  60 FPS • 0ms Delay • Siêu Nét
                </span>
              </div>

              <button
                onClick={handleOpenWindowCapture}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-cyan-300/40"
              >
                <Monitor className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span>🖥️ BẤM VÀO ĐÂY ĐỂ MỞ CỬA SỔ LIVE 9:16 (TIKTOK STUDIO)</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-yellow-400 font-black">
                    <span className="w-4 h-4 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px]">1</span>
                    <span>Mở Cửa Sổ Live</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Bấm nút ở trên. Cửa sổ Live 9:16 mang tên <b>[AvaLive VIP PRO]</b> sẽ hiện lên màn hình.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-black">
                    <span className="w-4 h-4 rounded-full bg-cyan-400/20 flex items-center justify-center text-[10px]">2</span>
                    <span>Mở TikTok Studio</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Trong TikTok Live Studio, bấm <b>Thêm Nguồn</b> → Chọn <b>Bắt Cửa Sổ (Window Capture)</b>.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                    <span className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center text-[10px]">3</span>
                    <span>Chọn AvaLive</span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Tại danh sách chọn: <b>[AvaLive VIP PRO] - Cửa Sổ Live 9:16</b> → Phát ngay lập tức 60FPS!
                  </p>
                </div>
              </div>
            </div>

            {/* ⚠️ HƯỚNG DẪN KHẮC PHỤC MÀN HÌNH ĐEN TRÊN OBS / TIKTOK LIVE STUDIO */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-xs space-y-1.5 shadow-lg shadow-amber-950/20">
              <div className="flex items-center gap-1.5 text-amber-300 font-black">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 animate-bounce" />
                <span>⚠️ MẸO QUAN TRỌNG NẾU BỊ MÀN HÌNH ĐEN TRÊN OBS / TIKTOK LIVE STUDIO:</span>
              </div>
              <p className="text-gray-200 text-[11.5px] leading-relaxed">
                Khi dùng <b>Bắt Cửa Sổ (Window Capture)</b> trong OBS hoặc TikTok Live Studio:
                <br />
                👉 Nhấp đúp vào nguồn <b>Bắt Cửa Sổ</b> → Tại mục <b>Phương thức chụp (Capture Method)</b>: Đổi từ <b>"Tự động / BitBlt"</b> sang <b>"Windows 10 (1903 trở lên)"</b> (Windows Graphics Capture).
                <br />
                👉 <b>Hình ảnh sẽ hiển thị ngay lập tức 100%</b>, không bao giờ bị đen hình hay đứng hình!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
              <p className="font-black flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ưu điểm vượt trội của Bắt Cửa Sổ (Window Capture) trên Windows:</span>
              </p>
              <p className="text-gray-300 leading-relaxed">
                • Không phụ thuộc mạng Internet, không lo bị chặn cổng hay lỗi URL.<br />
                • Tận dụng trực tiếp sức mạnh Card màn hình GPU (NVIDIA/Intel), video mượt 60FPS không giật lag.<br />
                • Video chạy bền bỉ 24/24, không bao giờ bị đứt kết nối hoặc tự động mất.
              </p>
            </div>
          </div>
        ) : (
          /* === TAB 2: NGUỒN TRÌNH DUYỆT (BROWSER SOURCE 1 LINK) === */
          <>
            {/* === TRẠNG THÁI TUNNEL === */}
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold ${
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
                    <p className="font-black">✅ CLOUDFLARE TUNNEL SẴN SÀNG — DÙNG ĐƯỢC TỪ MÁY TÍNH KHÁC</p>
                    <p className="font-normal text-emerald-400/80 mt-0.5 font-mono text-[10px]">{tunnelData.tunnelUrl}</p>
                  </div>
                  <button onClick={handleRefreshTunnel} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer" title="Cấp lại link mới">
                    <RefreshCw className={`w-3.5 h-3.5 ${tunnelLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </>
              ) : tunnelConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                  <div className="flex-1">
                    <p className="font-black">⏳ ĐANG KHỞI ĐỘNG CLOUDFLARE TUNNEL...</p>
                    <p className="font-normal text-yellow-400/80 mt-0.5">Đợi khoảng 5-15 giây. Bạn vẫn có thể dùng Link Máy Tính bên dưới ngay lập tức!</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-black">💡 DÙNG LINK MÁY TÍNH (127.0.0.1) ĐỂ PHÁT NGAY KHÔNG CẦN CHỜ TUNNEL</p>
                    <p className="font-normal text-yellow-400/80 mt-0.5">TikTok Live Studio chạy trên cùng máy tính này: Dùng link 127.0.0.1 là nhanh nhất 60FPS!</p>
                  </div>
                  <button onClick={handleRefreshTunnel} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer" title="Cấp lại link mới">
                    <RefreshCw className={`w-3.5 h-3.5 ${tunnelLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </>
              )}
            </div>

            {/* === DANH SÁCH DỰ ÁN === */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DANH SÁCH ĐƯỜNG LINK DÁN VÀO BROWSER SOURCE (TIKTOK STUDIO):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Kích thước chuẩn: 1080 × 1920
                </span>
              </div>

              {projects.map((proj) => {
                const Icon = proj.icon;
                const localUrl = getLocalUrl(proj.path);
                const cloudUrl = getTunnelUrl(proj.path);
                const isLocalCopied = copiedId === `${proj.id}_local`;
                const isCloudCopied = copiedId === `${proj.id}_cloud`;

                return (
                  <div key={proj.id} className={`p-3.5 rounded-2xl border transition-all ${proj.bgColor} space-y-2.5 relative shadow-lg`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-xl bg-black/50 border border-white/10">
                          <Icon className={`w-4 h-4 ${proj.iconColor}`} />
                        </div>
                        <span className="text-xs font-black text-white tracking-wide">{proj.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-white bg-gradient-to-r ${proj.tagColor}`}>
                        {proj.tag}
                      </span>
                    </div>

                    {/* LỰA CHỌN 1: LINK NỘI BỘ MÁY TÍNH (KHUYÊN DÙNG NHẤT CHO TIKTOK STUDIO CÙNG MÁY) */}
                    <div className="p-2.5 rounded-xl bg-black/70 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between text-[10.5px]">
                        <span className="font-black text-emerald-400 flex items-center gap-1">
                          <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                          <span>⭐ LINK MÁY TÍNH (Khuyên dùng nhất — 0ms Delay, Mượt 60FPS, Không Cần Mạng):</span>
                        </span>
                        <span className="text-[9.5px] text-gray-400">Dán vào TikTok Studio trên máy này</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <input
                          type="text"
                          readOnly
                          value={localUrl}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-black/90 text-emerald-300 text-xs font-mono font-bold focus:outline-none select-all"
                        />
                        <button
                          onClick={() => handleCopy(localUrl, `${proj.id}_local`)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md active:scale-95 ${
                            isLocalCopied ? "bg-emerald-600 text-white" : "bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40"
                          }`}
                        >
                          {isLocalCopied ? (
                            <><Check className="w-3.5 h-3.5" /><span>ĐÃ COPY</span></>
                          ) : (
                            <><Copy className="w-3.5 h-3.5" /><span>Sao Chép Link Này</span></>
                          )}
                        </button>
                        <a
                          href={localUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-0.5"
                          title="Mở tab mới xem thử"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem</span>
                        </a>
                      </div>
                    </div>

                    {/* LỰA CHỌN 2: LINK CLOUDFLARE TUNNEL (KHI MÁY KHÁC / ĐIỆN THOẠI KẾT NỐI) */}
                    {isTunnelActive && (
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span className="font-bold text-cyan-300 flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-cyan-400" />
                            <span>🌐 Link Cloudflare (Dùng khi TikTok Studio ở máy tính khác):</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={cloudUrl}
                            className="flex-1 px-2.5 py-1 rounded-lg border border-white/10 bg-black/60 text-cyan-300 text-[11px] font-mono select-all"
                          />
                          <button
                            onClick={() => handleCopy(cloudUrl, `${proj.id}_cloud`)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isCloudCopied ? "bg-cyan-600 text-white" : "bg-white/10 hover:bg-white/20 text-gray-300"
                            }`}
                          >
                            {isCloudCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{isCloudCopied ? "Đã Copy" : "Copy"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* === HƯỚNG DẪN KẾT NỐI NHANH === */}
        <div className="p-3 rounded-2xl bg-black/70 border border-white/15 text-xs shrink-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-[11.5px]">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0 animate-pulse" />
              <span>HƯỚNG DẪN DÁN VÀO TIKTOK LIVE STUDIO (CHỐNG LỖI ĐEN MÀN HÌNH 100%):</span>
            </div>
            <button onClick={onClose} className="px-3.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs cursor-pointer transition-all">
              Đóng
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-300">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-green-300">🌐 Cách dán vào TikTok Studio:</span>
              <p className="text-gray-400 leading-relaxed">
                Sao chép <b>Link Máy Tính (127.0.0.1)</b> ở trên → Thêm nguồn <b>Trình duyệt (Browser Source)</b> → Dán link vào → Nhập kích thước <b>1080 × 1920</b>.
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-cyan-300">🔄 Tự động đồng bộ thời gian thực:</span>
              <p className="text-gray-400 leading-relaxed">
                Hệ thống tự động cập nhật Realtime! Bất cứ khi nào bạn đổi video, chuyển tab hay bật tắt tiếng trên phần mềm, luồng phát cập nhật ngay lập tức!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
