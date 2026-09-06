import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
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
 * - Cung cấp ĐƯỜNG LINK CHUYỂN ĐỔI CLOUDFLARE HTTPS CÔNG KHAI 100% (Chấp nhận bởi TikTok Live Studio, không bị chặn Sandbox)
 * - Tự động đồng bộ toàn bộ video, âm thanh, game và hiệu ứng từ phần mềm sang luồng live
 */
export default function UniversalMasterOverlayModal({ isOpen, onClose, currentUser, onOpenLogin, activeMediaUrl }) {
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
  const [activeModalTab, setActiveModalTab] = useState("browser_source");

  const handleOpenWindowCapture = () => {
    // 🎯 ĐỘ PHÂN GIẢI CHUẨN CAO 1080P SẮC NÉT (CHO OBS / TIKTOK LIVE STUDIO CHỤP KHÔNG BỊ VỠ NÉT)
    const width = Math.min(608, window.screen.width);
    const height = Math.min(1080, window.screen.height);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);

    let activeUrl = '';
    let curTime = 0;
    try {
      const saved = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
      if (saved.mediaUrl) activeUrl = saved.mediaUrl;
      if (typeof saved.videoCurrentTime === 'number') curTime = saved.videoCurrentTime;
      if (!activeUrl) activeUrl = localStorage.getItem('avalive_user_locked_media') || '';
    } catch (e) {}

    try {
      const deskVid = document.querySelector('video');
      if (deskVid && typeof deskVid.currentTime === 'number' && deskVid.currentTime > 0) {
        curTime = deskVid.currentTime;
      }
    } catch (e) {}

    try {
      localStorage.removeItem('avalive_user_paused');
      localStorage.removeItem('avalive_window_capture_paused');
      localStorage.setItem('avalive_master_live_running', 'true');
    } catch (e) {}

    const timeQuery = curTime > 0 ? `&t=${Math.round(curTime * 100) / 100}` : '';
    const query = `${activeUrl ? `&v=${encodeURIComponent(activeUrl)}` : ''}${timeQuery}`;
    const captureUrl = `${window.location.origin}/idol?mode=window_capture${query}`;
    window.open(
      captureUrl,
      'avalive_window_capture_target',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes`
    );
  };

  // 🔄 FETCH TUNNEL URL TỪ BACKEND
  const fetchTunnelUrl = useCallback(async () => {
    try {
      const host = typeof window !== 'undefined' && window.location.origin.includes('http')
        ? window.location.origin
        : 'http://127.0.0.1:3001';
      let res;
      try {
        res = await fetch(`${host}/api/tunnel-url`);
      } catch (e) {
        try {
          res = await fetch('http://127.0.0.1:3001/api/tunnel-url');
        } catch (e2) {
          res = await fetch('http://127.0.0.1:3001/api/tunnel-status');
        }
      }
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.tunnelUrl) {
          setTunnelData(data);
          setTunnelLoading(false);
          try { localStorage.setItem('avalive_tunnel_data', JSON.stringify(data)); } catch (e) {}
        }
        if (data.status !== "active") {
          setTimeout(fetchTunnelUrl, 2000);
        }
      }
    } catch (err) {
      setTunnelLoading(false);
    }
  }, []);

  // ⚡ KẾT NỐI REALTIME SOCKET.IO ĐỂ NHẬN TUNNEL URL TỨC THÌ
  useEffect(() => {
    let socket = null;
    try {
      const host = typeof window !== 'undefined' && window.location.origin.includes('http')
        ? window.location.origin
        : 'http://127.0.0.1:3001';
      socket = io(host, { transports: ['websocket', 'polling'], timeout: 4000 });
      socket.on('TUNNEL_URL_UPDATE', (data) => {
        if (data && data.tunnelUrl) {
          setTunnelData(data);
          setTunnelLoading(false);
          try { localStorage.setItem('avalive_tunnel_data', JSON.stringify(data)); } catch (e) {}
        }
      });
    } catch (e) {}

    return () => {
      if (socket) socket.disconnect();
    };
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
    const interval = setInterval(fetchTunnelUrl, 5000);
    return () => clearInterval(interval);
  }, [fetchTunnelUrl]);

  if (!isOpen) return null;

  // 🌐 LẤY ĐƯỜNG LINK CHUYỂN ĐỔI CHÍNH THỨC CLOUDFLARE HTTPS CHO TIKTOK LIVE STUDIO:
  // TikTok Live Studio cấm hoàn toàn 127.0.0.1/localhost, bắt buộc phải dùng đường link Cloudflare HTTPS công khai
  const getProjectOverlayUrl = (path) => {
    let baseUrl = '';

    // 1. Ưu tiên số 1: Link Cloudflare Tunnel HTTPS chuyển đổi từ máy streamer (TikTok Live Studio chấp nhận 100%)
    if (tunnelData?.projects?.[path]) {
      baseUrl = tunnelData.projects[path];
    } else if (tunnelData?.tunnelUrl) {
      baseUrl = `${tunnelData.tunnelUrl.replace(/\/$/, '')}/${path}`;
    } else {
      // 2. Nếu đang chạy trên domain ngoài (HTTPS)
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      if (currentOrigin && !currentOrigin.includes('127.0.0.1') && !currentOrigin.includes('localhost')) {
        baseUrl = `${currentOrigin}/${path}`;
      } else {
        // Chưa có link tunnel đang cấp
        baseUrl = '';
      }
    }

    if (!baseUrl) return '';

    // Luôn gắn video media nếu có để TikTok Live Studio phát video ngay tức khắc từ frame đầu tiên
    let finalMedia = activeMediaUrl;
    if (!finalMedia) {
      try {
        const saved = JSON.parse(localStorage.getItem('avalive_master_live_state') || '{}');
        if (saved.mediaUrl) finalMedia = saved.mediaUrl;
        if (!finalMedia) finalMedia = localStorage.getItem('avalive_user_locked_media') || '';
      } catch (e) {}
    }

    let glue = baseUrl.includes('?') ? '&' : '?';
    if (finalMedia && typeof finalMedia === 'string' && (path === 'idol' || path === 'studio' || path === 'overlay')) {
       if (finalMedia.includes('/uploads/')) {
         finalMedia = finalMedia.substring(finalMedia.indexOf('/uploads/'));
       }
       baseUrl = `${baseUrl}${glue}v=${encodeURIComponent(finalMedia)}`;
       glue = '&';
    }

    let curTime = 0;
    try {
      const deskVid = document.querySelector('video');
      if (deskVid && typeof deskVid.currentTime === 'number' && deskVid.currentTime > 0) {
        curTime = deskVid.currentTime;
      }
    } catch (e) {}
    if (curTime > 0 && (path === 'idol' || path === 'studio' || path === 'overlay')) {
      baseUrl = `${baseUrl}${glue}t=${Math.round(curTime * 100) / 100}`;
      glue = '&';
    }

    const tunnelUrl = tunnelData?.tunnelUrl || '';
    if (tunnelUrl && !baseUrl.includes(tunnelUrl)) {
      baseUrl = `${baseUrl}${glue}backend=${encodeURIComponent(tunnelUrl)}`;
    }

    return baseUrl;
  };

  const projects = [
    {
      id: "idol",
      name: "DỰ ÁN 1: LIVE AI IDOL & PHÁT VIDEO TRỰC TIẾP",
      tag: "PHÁT VIDEO & IDOL 🎬",
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
    if (!url) {
      handleRefreshTunnel();
      return;
    }
    const doSetCopied = () => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    };

    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(doSetCopied).catch(() => fallbackCopy(url, doSetCopied));
    } else {
      fallbackCopy(url, doSetCopied);
    }
  };

  const fallbackCopy = (url, callback) => {
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
      if (callback) callback();
    } catch (err) {
      console.error('Lỗi copy:', err);
    }
    textArea.remove();
  };

  const handleOpenPreview = (url) => {
    if (!url) {
      alert('Đường truyền Cloudflare đang được khởi tạo, vui lòng đợi 2-3 giây rồi bấm lại!');
      handleRefreshTunnel();
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
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

            {/* 💡 HƯỚNG DẪN CHUYỂN TAB & ẨN CỬA SỔ KHÔNG BỊ MẤT LUỒNG TRÊN TIKTOK LIVE */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-2 shadow-lg">
              <div className="flex items-center gap-1.5 text-cyan-300 font-black text-[12px]">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span>💡 BÍ QUYẾT: CHUYỂN TAB & ẨN CỬA SỔ MÀ TIKTOK LIVE VẪN PHÁT 24/24:</span>
              </div>
              <div className="space-y-1.5 text-[11.5px] text-gray-200 leading-relaxed">
                <p>
                  <b className="text-amber-300">❌ Lưu ý Windows:</b> Tuyệt đối <b>không bấm nút Thu Nhỏ (Dấu trừ _)</b> trên thanh tiêu đề Windows, vì hệ điều hành Windows sẽ tự ngắt bộ nhớ GPU của cửa sổ thu nhỏ làm OBS / TikTok Studio bị đen hình.
                </p>
                <p>
                  <b className="text-emerald-300">✅ Cách 1 (Dùng Window Capture):</b> Bấm phím <b>H</b> (hoặc nút "Ẩn Điều Khiển") trên cửa sổ live để chuyển sang chế độ tràn viền 100%. Sau đó <b>để cửa sổ nằm phía sau các ứng dụng khác</b> (mở TikTok Studio, Chrome, Game đè lên trên). Cửa sổ vẫn phát 60FPS ngầm liên tục!
                </p>
                <p>
                  <b className="text-cyan-300">👑 Cách 2 (TIỆN LỢI NHẤT — DÙNG NGUỒN TRÌNH DUYỆT):</b> Bấm chọn tab <b>"🌐 NGUỒN TRÌNH DUYỆT"</b> ở trên → Sao chép <b>1 Đường Link Duy Nhất</b> dán vào TikTok Studio. <b>HOÀN TOÀN KHÔNG CẦN CỬA SỔ NÀO TRÊN MÀN HÌNH</b>, TikTok Studio tự nạp ngầm 100%, chuyển tab hoặc làm việc khác cực kỳ linh hoạt!
                </p>
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
          /* === TAB 2: NGUỒN TRÌNH DUYỆT (BROWSER SOURCE 1 LINK CLOUDFLARE HTTPS) === */
          <>
            {/* === THÔNG BÁO TRẠNG THÁI ĐƯỜNG TRUYỀN CLOUDFLARE HTTPS === */}
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold ${
              isTunnelActive
                ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                : tunnelConnecting
                ? "bg-yellow-950/50 border-yellow-500/50 text-yellow-300"
                : "bg-cyan-950/50 border-cyan-500/50 text-cyan-300"
            }`}>
              {isTunnelActive ? (
                <>
                  <Wifi className="w-5 h-5 shrink-0 text-emerald-400 animate-pulse" />
                  <div className="flex-1">
                    <p className="font-black text-white text-[12px]">
                      ✅ ĐƯỜNG LINK CHUYỂN ĐỔI CLOUDFLARE HTTPS ĐÃ SẴN SÀNG (TIKTOK STUDIO CHẤP NHẬN 100%)
                    </p>
                    <p className="font-normal text-emerald-400/90 mt-0.5 font-mono text-[10.5px]">
                      {tunnelData.tunnelUrl}
                    </p>
                  </div>
                  <button 
                    onClick={handleRefreshTunnel} 
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold" 
                    title="Cấp lại đường link mới nếu cần"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tunnelLoading ? 'animate-spin text-cyan-400' : ''}`} />
                    <span className="hidden sm:inline">Làm Mới</span>
                  </button>
                </>
              ) : (
                <>
                  <Loader2 className="w-5 h-5 shrink-0 animate-spin text-yellow-400" />
                  <div className="flex-1">
                    <p className="font-black text-yellow-300 text-[12px]">
                      ⏳ ĐANG CẤP ĐƯỜNG LINK CLOUDFLARE HTTPS BẢO MẬT (ĐỢI KHOẢNG 2-3 GIÂY)...
                    </p>
                    <p className="font-normal text-yellow-400/80 mt-0.5 text-[11px]">
                      Phần mềm đang tự động chuyển đổi sang đường link công khai an toàn cho TikTok Live Studio.
                    </p>
                  </div>
                  <button 
                    onClick={handleRefreshTunnel} 
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tunnelLoading ? 'animate-spin text-cyan-400' : ''}`} />
                    <span className="hidden sm:inline">Thử Lại</span>
                  </button>
                </>
              )}
            </div>

            {/* 🛡️ BANNER HƯỚNG DẪN 1 LINK DUY NHẤT */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-black/80 to-blue-950/50 border border-cyan-500/40 text-xs space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-300 font-black text-[12px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>⭐ MỖI DỰ ÁN SỬ DỤNG 1 ĐƯỜNG LINK CHUYỂN ĐỔI DUY NHẤT (CHỐNG LỖI TIKTOK 100%):</span>
              </div>
              <p className="text-gray-200 text-[11.5px] leading-relaxed">
                • <b>Chỉ cần sao chép đúng 1 đường link HTTPS bên dưới</b> dán vào nguồn <b>Trình duyệt (Browser / Link Source)</b> trong TikTok Live Studio hoặc OBS.<br />
                • TikTok Live Studio không cho chạy local bộ nhớ máy, đường link này được chuyển đổi công khai giúp TikTok Studio phát mượt mà 60FPS, không bao giờ bị chặn Sandbox!
              </p>
            </div>

            {/* === DANH SÁCH DỰ ÁN === */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
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
                const overlayUrl = getProjectOverlayUrl(proj.path);
                const isCopied = copiedId === proj.id;
                const hasUrl = Boolean(overlayUrl && overlayUrl.startsWith('http'));

                return (
                  <div key={proj.id} className={`p-4 rounded-2xl border transition-all ${proj.bgColor} space-y-3 relative shadow-lg`}>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-black/50 border border-white/10">
                          <Icon className={`w-4 h-4 ${proj.iconColor}`} />
                        </div>
                        <span className="text-sm font-black text-white tracking-wide">{proj.name}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white bg-gradient-to-r ${proj.tagColor}`}>
                        {proj.tag}
                      </span>
                    </div>

                    {/* 👑 1 ĐƯỜNG LINK DUY NHẤT CHUYÊN DÙNG PHÁT LIVE */}
                    <div className="p-3 rounded-xl bg-black/90 border-2 border-cyan-500/60 space-y-2 shadow-cyan-950/40 shadow-lg">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-black text-cyan-300 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                          <span>👑 ĐƯỜNG LINK CHUYỂN ĐỔI CHO TIKTOK LIVE STUDIO & OBS (HTTPS):</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          {hasUrl ? 'Cloudflare SSL • 60 FPS • Siêu Nét' : 'Đang Cấp Link...'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={hasUrl ? overlayUrl : "⏳ Đang kết nối đường truyền Cloudflare HTTPS (Đợi 2-3s)..."}
                          className={`flex-1 px-3 py-2 rounded-xl border bg-black text-xs font-mono font-bold focus:outline-none select-all shadow-inner ${
                            hasUrl ? 'border-cyan-500/50 text-cyan-200' : 'border-yellow-500/40 text-yellow-300/80 animate-pulse'
                          }`}
                        />

                        {/* NÚT SAO CHÉP LINK */}
                        <button
                          onClick={() => handleCopy(overlayUrl, proj.id)}
                          className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                            isCopied 
                              ? "bg-emerald-600 text-white shadow-emerald-500/30" 
                              : hasUrl
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/30 border border-cyan-400/50"
                              : "bg-yellow-600/50 hover:bg-yellow-600 text-yellow-100 border border-yellow-500/50"
                          }`}
                          title={hasUrl ? "Sao chép đường link dán vào TikTok Live Studio" : "Đang lấy link..."}
                        >
                          {isCopied ? (
                            <><Check className="w-4 h-4 text-white" /><span>ĐÃ SAO CHÉP!</span></>
                          ) : hasUrl ? (
                            <><Copy className="w-4 h-4" /><span>SAO CHÉP LINK</span></>
                          ) : (
                            <><Loader2 className="w-4 h-4 animate-spin" /><span>LẤY LINK</span></>
                          )}
                        </button>

                        {/* NÚT XEM THỬ */}
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(overlayUrl)}
                          className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            hasUrl
                              ? "bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white"
                              : "bg-white/5 text-gray-500 cursor-not-allowed"
                          }`}
                          title="Mở tab mới kiểm tra video đang phát"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Xem Thử</span>
                        </button>
                      </div>

                      <p className="text-[10.5px] text-cyan-300/90 leading-tight">
                        ⚡ <b>Đường link chuyển đổi HTTPS chính thức:</b> TikTok Live Studio chấp nhận 100% (không bao giờ bị chặn Sandbox). Tự động đồng bộ toàn bộ video, âm thanh, hiệu ứng AI Idol đang phát từ phần mềm sang luồng live siêu mượt 60FPS!
                      </p>
                    </div>
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
                Bấm nút <b>Sao Chép Link Này</b> ở trên → Mở TikTok Live Studio → Thêm nguồn <b>Trình duyệt (Browser Source)</b> → Dán đường link vào → Đặt kích thước <b>1080 × 1920</b>.
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
