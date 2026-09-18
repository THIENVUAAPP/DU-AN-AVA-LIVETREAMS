import re

with open('src/components/MultiAccountManager.jsx', 'r') as f:
    content = f.read()

modal_ui = """      {isConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1C22] p-8 rounded-2xl border border-white/10 flex flex-col items-center max-w-sm w-full shadow-2xl">
            <RefreshCw className="w-12 h-12 text-[#3B82F6] animate-spin mb-4" />
            <h3 className="text-white font-bold text-lg text-center mb-2">Đang kết nối {connectingPlatform}...</h3>
            <p className="text-gray-400 text-xs text-center">Hệ thống đang chuyển hướng sang trang xác thực OAuth an toàn. Vui lòng không đóng cửa sổ này.</p>
          </div>
        </div>
      )}
      
      {/* Platform Switcher Tabs */}"""

content = content.replace('{/* Platform Switcher Tabs */}', modal_ui)

with open('src/components/MultiAccountManager.jsx', 'w') as f:
    f.write(content)

