import React, { useState, useEffect, useRef } from "react";
import { 
  GripVertical, ChevronDown, Check, HelpCircle, X, ExternalLink, Copy, CheckCheck, Play, Square, Zap, Target, Pin, AlertTriangle
} from "lucide-react";
import autoPinProductService from "../utils/autoPinProductService";

const toast = {
  success: (message) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("avalive_toast", { detail: { type: "success", message } }));
    }
  },
  error: (message) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("avalive_toast", { detail: { type: "error", message } }));
    }
  },
  info: (message) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("avalive_toast", { detail: { type: "info", message } }));
    }
  }
};

const AUTO_GHIM_MODES = [
  { id: "random", labelVi: "Ghim Random Tổng Thể", labelEn: "Random All Products", icon: Zap },
  { id: "specific", labelVi: "Ghim Chỉ Định (Nhiều Mã)", labelEn: "Specific Codes (Multiple)", icon: Target },
  { id: "fixed", labelVi: "Ghim 1 Mã Cố Định", labelEn: "Fixed 1 Product Code", icon: Pin }
];

const AutoCaptchaSolver = ({ setActiveTab, onClose, onSolved, isEmbedded = false }) => {
  // Config & State persisted in localStorage
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("avalive_auto_ghim_lang") || "VI"; } catch (e) { return "VI"; }
  });
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("avalive_auto_ghim_mode") || "specific"; } catch (e) { return "specific"; }
  });
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  
  const [specificCodes, setSpecificCodes] = useState(() => {
    try { return localStorage.getItem("avalive_auto_ghim_codes") || "1, 2, 3"; } catch (e) { return "1, 2, 3"; }
  });
  const [fixedCode, setFixedCode] = useState(() => {
    try { return localStorage.getItem("avalive_auto_ghim_fixed") || "1"; } catch (e) { return "1"; }
  });
  
  const [minInterval, setMinInterval] = useState(() => {
    try { return parseInt(localStorage.getItem("avalive_auto_ghim_min_sec"), 10) || 30; } catch (e) { return 30; }
  });
  const [maxInterval, setMaxInterval] = useState(() => {
    try { return parseInt(localStorage.getItem("avalive_auto_ghim_max_sec"), 10) || 60; } catch (e) { return 60; }
  });

  const [isRunning, setIsRunning] = useState(() => {
    try { return localStorage.getItem("avalive_auto_ghim_running") === "true"; } catch (e) { return false; }
  });
  const [currentPinnedCode, setCurrentPinnedCode] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [totalPinnedCount, setTotalPinnedCount] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const timerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const dropdownRef = useRef(null);
  const currentSpecificIndexRef = useRef(0);

  // Save config changes
  useEffect(() => {
    try {
      localStorage.setItem("avalive_auto_ghim_lang", lang);
      localStorage.setItem("avalive_auto_ghim_mode", mode);
      localStorage.setItem("avalive_auto_ghim_codes", specificCodes);
      localStorage.setItem("avalive_auto_ghim_fixed", fixedCode);
      localStorage.setItem("avalive_auto_ghim_min_sec", String(minInterval));
      localStorage.setItem("avalive_auto_ghim_max_sec", String(maxInterval));
      localStorage.setItem("avalive_auto_ghim_running", String(isRunning));
    } catch (e) {}
  }, [lang, mode, specificCodes, fixedCode, minInterval, maxInterval, isRunning]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsModeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (setActiveTab) {
      setActiveTab("broadcast");
      return;
    }
  };

  // Perform single pin action
  const executePin = (targetCode) => {
    setCurrentPinnedCode(targetCode);
    setTotalPinnedCount(prev => prev + 1);

    // Pin via service
    try {
      autoPinProductService.pinProductByCode(targetCode, "Auto Ghim Pro (shop.tiktok.com)");
    } catch (e) {}

    // Dispatch global event for listeners (OBS, Window Capture, Livestream overlay)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("avalive:auto_ghim_cycle", {
        detail: {
          code: targetCode,
          mode,
          timestamp: Date.now()
        }
      }));
    }

    toast.info(lang === "VI" ? "📌 Đã tự động ghim sản phẩm mã #" + targetCode : "📌 Auto pinned product code #" + targetCode);
  };

  // Auto Ghim Loop Management
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setCountdown(0);
      return;
    }

    const runCycle = () => {
      // Determine next code based on mode
      let nextCode = "1";
      if (mode === "fixed") {
        nextCode = fixedCode.trim() || "1";
      } else if (mode === "specific") {
        const codes = specificCodes.split(/[,;\s]+/).map(c => c.trim()).filter(Boolean);
        if (codes.length > 0) {
          const idx = currentSpecificIndexRef.current % codes.length;
          nextCode = codes[idx];
          currentSpecificIndexRef.current = idx + 1;
        } else {
          nextCode = "1";
        }
      } else {
        // Random 1..10
        const randNum = Math.floor(Math.random() * 10) + 1;
        nextCode = String(randNum);
      }

      executePin(nextCode);

      // Calculate next random delay between minInterval and maxInterval
      const minS = Math.max(5, parseInt(minInterval, 10) || 30);
      const maxS = Math.max(minS, parseInt(maxInterval, 10) || 60);
      const nextDelaySec = Math.floor(Math.random() * (maxS - minS + 1)) + minS;

      setCountdown(nextDelaySec);

      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = setTimeout(runCycle, nextDelaySec * 1000);
    };

    // Execute immediately on start
    runCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isRunning, mode, specificCodes, fixedCode, minInterval, maxInterval]);

  const toggleRunning = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState) {
      toast.success(lang === "VI" ? "🚀 BẮT ĐẦU AUTO GHIM TIKTOK SHOP THÀNH CÔNG!" : "🚀 AUTO PIN STARTED SUCCESSFULLY!");
    } else {
      toast.info(lang === "VI" ? "⏹ Đã dừng Auto Ghim." : "⏹ Auto Pin Stopped.");
    }
  };

  // Copy TikTok Shop Injection Script
  const handleCopyScript = () => {
    const script = `// AVA AUTO GHIM TIKTOK SHOP SCRIPT (shop.tiktok.com)
(function autoPinTikTokShop() {
  console.log("%c[AVA AUTO GHIM PRO] Đã kết nối với TikTok Shop Streamer!", "color: #ff2e4d; font-size: 14px; font-weight: bold;");
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "AVALIVE_PIN_PRODUCT") {
      const pinButtons = document.querySelectorAll("button, div[role=\"button\"]");
      for (const btn of pinButtons) {
        if (btn.innerText && (btn.innerText.includes("Ghim") || btn.innerText.includes("Pin"))) {
          btn.click();
          break;
        }
      }
    }
  });
})();`;
    navigator.clipboard.writeText(script).then(() => {
      setCopiedScript(true);
      toast.success(lang === "VI" ? "📋 Đã copy Script Auto Ghim! Dán vào Console của tab shop.tiktok.com." : "📋 Copied Auto Pin Script for shop.tiktok.com!");
      setTimeout(() => setCopiedScript(false), 3000);
    });
  };

  const currentModeObj = AUTO_GHIM_MODES.find(m => m.id === mode) || AUTO_GHIM_MODES[1];
  const CurrentIcon = currentModeObj.icon;

  return (
    <div className={"w-full flex items-center justify-center font-sans select-none " + (isEmbedded ? "p-0" : "p-3")}>
      {/* CARD CONTAINER - EXACT MATCH PHOTO 1 */}
      <div className="w-full max-w-[390px] bg-[#1a1a24] text-white rounded-[22px] border border-[#2e2e3d] shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden relative p-4 space-y-4">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab opacity-75" />
            <h3 className="text-[#ff2e4d] font-black text-base tracking-wider uppercase drop-shadow-[0_0_8px_rgba(255,46,77,0.4)]">
              AUTO GHIM PRO
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* LANGUAGE SWITCHER */}
            <button
              type="button"
              onClick={() => setLang(prev => prev === "VI" ? "EN" : "VI")}
              className="px-2.5 py-0.5 rounded-full bg-[#272736] border border-[#3b3b4f] text-[11px] font-black text-gray-200 hover:text-white hover:border-[#ff2e4d]/60 transition-all cursor-pointer shadow-sm"
              title="Change Language"
            >
              [ {lang} ]
            </button>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={handleClose}
              className="w-6 h-6 rounded-full bg-[#272736] hover:bg-[#ff2e4d] hover:text-white text-gray-400 flex items-center justify-center transition-all cursor-pointer text-xs font-bold"
              title="Đóng / Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* MODE SELECTOR DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsModeDropdownOpen(prev => !prev)}
            className="w-full bg-[#121218] border border-[#313142] hover:border-[#ff2e4d]/70 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-gray-100 transition-all cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <CurrentIcon className="w-4 h-4 text-[#ff2e4d] shrink-0" />
              <span className="truncate">{lang === "VI" ? currentModeObj.labelVi : currentModeObj.labelEn}</span>
            </div>
            <ChevronDown className={"w-4 h-4 text-gray-400 transition-transform " + (isModeDropdownOpen ? "rotate-180 text-[#ff2e4d]" : "")} />
          </button>

          {isModeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#14141d] border border-[#38384d] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
              {AUTO_GHIM_MODES.map((m) => {
                const IconComponent = m.icon;
                const isSelected = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMode(m.id);
                      setIsModeDropdownOpen(false);
                    }}
                    className={"w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer " + (
                      isSelected ? "bg-[#ff2e4d]/15 text-[#ff2e4d]" : "text-gray-200 hover:bg-[#20202e]"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={"w-4 h-4 " + (isSelected ? "text-[#ff2e4d]" : "text-gray-400")} />
                      <span>{lang === "VI" ? m.labelVi : m.labelEn}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#ff2e4d]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CONDITIONAL INPUT: SPECIFIC CODES (NHIỀU MÃ) */}
        {mode === "specific" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-300">
                {lang === "VI" ? "Danh sách mã cần ghim (cách nhau bởi dấu phẩy):" : "List of product codes (comma-separated):"}
              </label>
              <div className="relative group">
                <HelpCircle 
                  className="w-3.5 h-3.5 text-gray-400 hover:text-gray-200 cursor-help"
                  onMouseEnter={() => setActiveTooltip("codes")}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
                {activeTooltip === "codes" && (
                  <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-black/95 text-[10px] text-gray-200 p-2 rounded-lg border border-white/20 shadow-xl z-50">
                    {lang === "VI" ? "Nhập số thứ tự hoặc mã sản phẩm phân cách bằng dấu phẩy (Ví dụ: 1, 2, 3)." : "Enter product indexes or codes separated by comma (e.g. 1, 2, 3)."}
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              value={specificCodes}
              onChange={(e) => setSpecificCodes(e.target.value)}
              placeholder="1, 2, 3"
              className="w-full bg-[#121218] border border-[#313142] focus:border-[#ff2e4d] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none transition-all shadow-inner"
            />
          </div>
        )}

        {/* CONDITIONAL INPUT: FIXED CODE (1 MÃ CỐ ĐỊNH) */}
        {mode === "fixed" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-gray-300">
                {lang === "VI" ? "Mã sản phẩm cố định:" : "Fixed product code:"}
              </label>
              <div className="relative group">
                <HelpCircle 
                  className="w-3.5 h-3.5 text-gray-400 hover:text-gray-200 cursor-help"
                  onMouseEnter={() => setActiveTooltip("fixed")}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
                {activeTooltip === "fixed" && (
                  <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-black/95 text-[10px] text-gray-200 p-2 rounded-lg border border-white/20 shadow-xl z-50">
                    {lang === "VI" ? "Nhập mã sản phẩm duy nhất cần ghim liên tục (Ví dụ: 1)." : "Enter the single product code to keep pinned (e.g. 1)."}
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              value={fixedCode}
              onChange={(e) => setFixedCode(e.target.value)}
              placeholder="1"
              className="w-full bg-[#121218] border border-[#313142] focus:border-[#ff2e4d] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none transition-all shadow-inner"
            />
          </div>
        )}

        {/* INTERVAL INPUTS (THỜI GIAN LUÂN PHIÊN GIÂY) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-300">
              {lang === "VI" ? "Thời gian luân phiên (Giây):" : "Rotation Interval (Seconds):"}
            </label>
            <div className="relative group">
              <HelpCircle 
                className="w-3.5 h-3.5 text-gray-400 hover:text-gray-200 cursor-help"
                onMouseEnter={() => setActiveTooltip("interval")}
                onMouseLeave={() => setActiveTooltip(null)}
              />
              {activeTooltip === "interval" && (
                <div className="absolute right-0 bottom-full mb-1.5 w-52 bg-black/95 text-[10px] text-gray-200 p-2 rounded-lg border border-white/20 shadow-xl z-50">
                  {lang === "VI" ? "Khoảng thời gian ngẫu nhiên (Min - Max) giữa mỗi lần ghim sản phẩm." : "Random time range (Min - Max) between each pin action."}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="5"
              max="3600"
              value={minInterval}
              onChange={(e) => setMinInterval(parseInt(e.target.value, 10) || 5)}
              className="w-full bg-[#121218] border border-[#313142] focus:border-[#ff2e4d] rounded-xl px-3 py-2 text-xs text-center text-white font-mono font-bold focus:outline-none transition-all shadow-inner"
              placeholder="30"
            />
            <input
              type="number"
              min="5"
              max="3600"
              value={maxInterval}
              onChange={(e) => setMaxInterval(parseInt(e.target.value, 10) || 10)}
              className="w-full bg-[#121218] border border-[#313142] focus:border-[#ff2e4d] rounded-xl px-3 py-2 text-xs text-center text-white font-mono font-bold focus:outline-none transition-all shadow-inner"
              placeholder="60"
            />
          </div>
        </div>

        {/* BIG START / STOP BUTTON */}
        <button
          type="button"
          onClick={toggleRunning}
          className={"w-full py-3 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 " + (
            isRunning
              ? "bg-[#2b2b3b] hover:bg-[#38384d] text-amber-300 border border-amber-500/30"
              : "bg-gradient-to-r from-[#ff2e4d] to-[#ff0033] hover:from-[#ff1a3d] hover:to-[#e60026] text-white shadow-[0_4px_15px_rgba(255,46,77,0.4)]"
          )}
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{lang === "VI" ? "⏹ DỪNG AUTO" : "⏹ STOP AUTO"}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-white" />
              <span>{lang === "VI" ? "▶ BẮT ĐẦU" : "▶ START"}</span>
            </>
          )}
        </button>

        {/* STATUS TEXT */}
        <div className="text-center">
          {isRunning ? (
            <p className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                {lang === "VI"
                  ? "Đang Auto Ghim TikTok Shop... (Mã #" + (currentPinnedCode || "1") + " • Còn " + countdown + "s • " + totalPinnedCount + " lần)"
                  : "Auto Pin Active... (Code #" + (currentPinnedCode || "1") + " • " + countdown + "s left • " + totalPinnedCount + " pins)"}
              </span>
            </p>
          ) : (
            <p className="text-[11px] font-medium text-gray-400">
              {lang === "VI" ? "Đã dừng Auto." : "Auto Pin Stopped."}
            </p>
          )}
        </div>

        {/* NOTICE BOX */}
        <div className="bg-[#242013] border border-[#524419] rounded-xl p-2.5 flex items-start gap-2 text-amber-300/90 text-[10px] leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {lang === "VI"
              ? "⚠️ Lưu ý: Tiện ích chỉ ghim được các Sản phẩm đang hiển thị trên màn hình."
              : "⚠️ Note: Utility can only pin products currently visible on screen."}
          </span>
        </div>

        {/* QUICK LINK & SCRIPT ACTIONS */}
        <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#2a2a38]">
          <a
            href="https://shop.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Mở shop.tiktok.com"
          >
            <ExternalLink className="w-3 h-3 text-[#ff2e4d]" />
            <span>shop.tiktok.com</span>
          </a>

          <button
            type="button"
            onClick={handleCopyScript}
            className="text-[10px] font-bold text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy Script Auto Ghim cho shop.tiktok.com"
          >
            {copiedScript ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
            <span>{copiedScript ? (lang === "VI" ? "Đã copy Script!" : "Copied!") : (lang === "VI" ? "Copy Script Ghim" : "Copy Script")}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AutoCaptchaSolver;
