import re

with open('src/components/UserProfile.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add a missing icon for Captcha if not imported. I see Zap and Sparkles are imported. 
# We'll use Sparkles or a generic icon already imported like ShieldCheck.
# But let's add `Bot` and `Activity` to lucide-react imports if we can, or just use what's there. 
# I see Zap is imported. We will use Zap.

# 1. Insert the Tab button
captcha_btn = """
        <button
          onClick={() => setActiveTab('captcha')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'captcha' ? 'bg-amber-600 text-white shadow-glow-amber' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>🤖 GIẢI MÃ CAPTCHA AI</span>
        </button>
      </div>"""
content = re.sub(r'<span>🛡️ PHÂN QUYỀN NHÂN VIÊN<\/span>\s*<\/button>\s*<\/div>', f'<span>🛡️ PHÂN QUYỀN NHÂN VIÊN</span>\n        </button>\n{captcha_btn}', content)

# 2. Add some state for captcha config inside the component
# I will find `const [userInvoices] = useState([]);`
captcha_state = """  const [userInvoices] = useState([]);
  
  // Captcha Config State
  const [captchaConfig, setCaptchaConfig] = useState({
    imageBypass: true,
    cloudflareTurnstile: true,
    autoProxy: true,
    autoToken: true
  });
"""
content = content.replace('  const [userInvoices] = useState([]);', captcha_state)

# 3. Insert the Content
captcha_content = """

      {/* Tab Captcha Solver */}
      {activeTab === 'captcha' && (
        <div className="space-y-6 animate-fade-in pb-10">
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" /> BẢNG ĐIỀU KHIỂN GIẢI MÃ CAPTCHA AI
                </h3>
                <p className="text-xs text-gray-400 mt-1">Hệ thống AI tự động vượt Captcha, chống khóa luồng Livestream trên đa nền tảng.</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
                 SYSTEM ACTIVE 100%
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121216] border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Tổng Số Đã Giải Mật</span>
                <span className="text-2xl font-black text-white flex items-center gap-2">1,204,592 <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">+1,402 hnay</span></span>
              </div>
              <div className="bg-[#121216] border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Tỷ Lệ Thành Công</span>
                <span className="text-2xl font-black text-emerald-400">99.8%</span>
              </div>
              <div className="bg-[#121216] border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Tốc Độ Phản Hồi</span>
                <span className="text-2xl font-black text-blue-400 flex items-baseline gap-1">450 <span className="text-sm font-normal text-gray-400">ms</span></span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-1 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2">Cấu Hình Chiến Thuật AI</h4>
                  <div className="space-y-3">
                     {[
                       { id: 'imageBypass', label: 'Giải mã Ảnh / Slider Captcha' },
                       { id: 'cloudflareTurnstile', label: 'Vượt tường lửa Cloudflare v3' },
                       { id: 'autoProxy', label: 'Anti-Fingerprint (Thay Proxy liên tục)' },
                       { id: 'autoToken', label: 'Auto-Submit Token (Chống kẹt luồng)' }
                     ].map(cfg => (
                        <div key={cfg.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                           <span className="text-xs text-gray-300 font-bold">{cfg.label}</span>
                           <button 
                             onClick={() => setCaptchaConfig(prev => ({...prev, [cfg.id]: !prev[cfg.id]}))}
                             className={`relative w-10 h-5 rounded-full transition-all ${captchaConfig[cfg.id] ? 'bg-amber-500' : 'bg-gray-700'}`}
                           >
                             <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${captchaConfig[cfg.id] ? 'left-[22px]' : 'left-[2px]'}`}></div>
                           </button>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2">Lịch Sử Giải Mã Real-time</h4>
                  <div className="bg-[#121216] rounded-xl border border-white/10 overflow-hidden">
                     <table className="w-full text-left text-xs text-gray-400">
                        <thead className="bg-white/5 text-[10px] uppercase tracking-wider">
                           <tr>
                             <th className="px-4 py-3 font-bold">Thời Gian</th>
                             <th className="px-4 py-3 font-bold">Nền Tảng</th>
                             <th className="px-4 py-3 font-bold">Loại Captcha</th>
                             <th className="px-4 py-3 font-bold">Tốc Độ</th>
                             <th className="px-4 py-3 font-bold text-right">Trạng Thái</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono">
                           {[
                              { time: 'Vừa xong', p: 'TikTok', type: 'Slider Puzzle', speed: '320ms', status: 'SUCCESS' },
                              { time: '12s trước', p: 'Facebook', type: 'reCAPTCHA v3', speed: '512ms', status: 'SUCCESS' },
                              { time: '45s trước', p: 'YouTube', type: 'Image Verify', speed: '840ms', status: 'SUCCESS' },
                              { time: '1m 20s trước', p: 'Shopee', type: 'Turnstile', speed: '120ms', status: 'SUCCESS' },
                              { time: '3m trước', p: 'TikTok', type: 'Rotate Image', speed: '1.2s', status: 'RETRY' },
                           ].map((log, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                 <td className="px-4 py-3">{log.time}</td>
                                 <td className="px-4 py-3 font-bold text-white">{log.p}</td>
                                 <td className="px-4 py-3">{log.type}</td>
                                 <td className="px-4 py-3 text-blue-400">{log.speed}</td>
                                 <td className="px-4 py-3 text-right">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                       {log.status}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
"""

content = re.sub(r'(<\/div>\s*<\/div>\s*)$', captcha_content + r'\1', content)

with open('src/components/UserProfile.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Captcha Tab Added!")
