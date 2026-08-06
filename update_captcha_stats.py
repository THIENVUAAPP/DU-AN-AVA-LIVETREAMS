import re

with open('src/components/UserProfile.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

state_injection = """  const [captchaConfig, setCaptchaConfig] = useState({
    imageBypass: true,
    cloudflareTurnstile: true,
    autoProxy: true,
    autoToken: true
  });
  
  // Captcha Stats State
  const [captchaStats, setCaptchaStats] = useState({
    totalSolved: 0,
    successRate: 0,
    responseTime: 0,
    logs: []
  });
"""
content = content.replace("  const [captchaConfig, setCaptchaConfig] = useState({\n    imageBypass: true,\n    cloudflareTurnstile: true,\n    autoProxy: true,\n    autoToken: true\n  });\n", state_injection)

# Replace the metrics:
content = content.replace(
    '<span className="text-2xl font-black text-white flex items-center gap-2">1,204,592 <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">+1,402 hnay</span></span>',
    '<span className="text-2xl font-black text-white flex items-center gap-2">{captchaStats.totalSolved.toLocaleString()} <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">+0 hnay</span></span>'
)
content = content.replace(
    '<span className="text-2xl font-black text-emerald-400">99.8%</span>',
    '<span className="text-2xl font-black text-emerald-400">{captchaStats.successRate.toFixed(1)}%</span>'
)
content = content.replace(
    '<span className="text-2xl font-black text-blue-400 flex items-baseline gap-1">450 <span className="text-sm font-normal text-gray-400">ms</span></span>',
    '<span className="text-2xl font-black text-blue-400 flex items-baseline gap-1">{captchaStats.responseTime} <span className="text-sm font-normal text-gray-400">ms</span></span>'
)

# Replace the logs mapping
old_logs = """{[
                              { time: 'Vừa xong', p: 'TikTok', type: 'Slider Puzzle', speed: '320ms', status: 'SUCCESS' },
                              { time: '12s trước', p: 'Facebook', type: 'reCAPTCHA v3', speed: '512ms', status: 'SUCCESS' },
                              { time: '45s trước', p: 'YouTube', type: 'Image Verify', speed: '840ms', status: 'SUCCESS' },
                              { time: '1m 20s trước', p: 'Shopee', type: 'Turnstile', speed: '120ms', status: 'SUCCESS' },
                              { time: '3m trước', p: 'TikTok', type: 'Rotate Image', speed: '1.2s', status: 'RETRY' },
                           ].map((log, i) => ("""
new_logs = """{captchaStats.logs.length === 0 ? (
                             <tr><td colSpan="5" className="text-center py-4 text-gray-500">Chưa có dữ liệu</td></tr>
                           ) : captchaStats.logs.map((log, i) => ("""
content = content.replace(old_logs, new_logs)

with open('src/components/UserProfile.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("UserProfile Captcha stats updated to 0!")
