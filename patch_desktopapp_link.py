import re
with open('src/components/genaidol/DesktopAppUI.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """          {/* 1 Nút Chuyển Tỷ Lệ Khung Hình Toàn Cục DUY NHẤT CHO TOÀN BỘ HỆ THỐNG: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}"""
replacement = """          {/* NÚT LẤY LINK TIKTOK LIVE STUDIO */}
          <button
            onClick={() => setShowOverlayModal(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white border border-teal-300 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Lấy Link Liên Kết TikTok Live Studio & OBS (Sân Khấu Chính)"
          >
            <ExternalLink size={11} className="text-white" />
            <span className="whitespace-nowrap uppercase">Link TikTok Live</span>
          </button>

          {/* 1 Nút Chuyển Tỷ Lệ Khung Hình Toàn Cục DUY NHẤT CHO TOÀN BỘ HỆ THỐNG: 9:16 (TikTok Dọc) vs 16:9 (OBS Ngang) */}"""

if target in content:
    content = content.replace(target, replacement)
    print("Patched DesktopAppUI successfully!")
else:
    print("Target not found in DesktopAppUI!")

with open('src/components/genaidol/DesktopAppUI.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
