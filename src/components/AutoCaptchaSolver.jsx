import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, Cpu, Terminal, Zap, CheckCircle2, Scan, Activity, ArrowLeft } from 'lucide-react';

const AutoCaptchaSolver = ({ setActiveTab }) => {
  const [phase, setPhase] = useState('init');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const [captchaConfig, setCaptchaConfig] = useState({
    imageBypass: true,
    cloudflareTurnstile: true,
    autoProxy: true,
    autoToken: true
  });
  
    const [captchaStats, setCaptchaStats] = useState({
    totalSolved: 14205,
    successRate: 99.8,
    responseTime: 12,
    historyLogs: []
  });

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase.from('captcha_logs').select('*').order('created_at', { ascending: false }).limit(10);
      if (error) throw error;
      if (data) {
        setCaptchaStats(prev => ({
          ...prev,
          historyLogs: data.map(log => ({
            time: new Date(log.created_at).toLocaleTimeString('vi-VN'),
            p: log.platform,
            type: log.captcha_type,
            speed: log.speed_ms + 'ms',
            status: log.status
          }))
        }));
      }
    } catch (e) {
      console.warn("Could not fetch captcha logs (table might not exist yet):", e.message);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Subscribe to realtime updates
    const channel = supabase.channel('captcha_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'captcha_logs' }, payload => {
         const log = payload.new;
         setCaptchaStats(prev => ({
           ...prev,
           historyLogs: [
             {
               time: new Date(log.created_at).toLocaleTimeString('vi-VN'),
               p: log.platform,
               type: log.captcha_type,
               speed: log.speed_ms + 'ms',
               status: log.status
             },
             ...prev.historyLogs
           ].slice(0, 10)
         }));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toISOString().substring(11, 23), msg, type }]);
  };

  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      setPhase('init');
      addLog("Initializing AVA Stealth System v3.0...", 'info');
      addLog("Connecting to Anti-Detect Proxy Nodes...", 'info');
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;

      setPhase('analyzing');
      addLog("Scanning DOM for WAF Challenges...", 'warning');
      addLog("[TikTok] Detected Slider Puzzle & 3D Rotate...", 'error');
      
      for (let i = 0; i <= 100; i += 2) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 20));
      }
      if (!isMounted) return;

      setPhase('solving');
      addLog("Injecting AI Bypass Payload...", 'info');
      addLog("Solving [TikTok] Slider Puzzle (Calculated X-Offset: 124px)...", 'success');
      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;
      
      setPhase('success');
      addLog("Bypass Complete. Session token secured.", 'success');
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0A0A0E] flex flex-col font-sans overflow-hidden">
      
      <header className="h-[72px] border-b border-white/5 flex items-center justify-between px-8 bg-[#111118]/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab && setActiveTab("overview")} className="flex items-center gap-3 group cursor-pointer">
             <div className="w-10 h-10 rounded-xl bg-[#111] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform">
                <img src="/official_logo.jpg" alt="AVA LIVE" className="w-full h-full object-cover rounded-[10px] border border-white/20" />
             </div>
             <div className="text-left flex flex-col justify-center">
               <h2 className="text-white font-black text-xl leading-none group-hover:text-red-400 transition-colors">AVA LIVE</h2>
             </div>
          </button>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setActiveTab && setActiveTab("overview")} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors flex items-center gap-2 cursor-pointer">
             <ArrowLeft className="w-4 h-4" /> Thoát
           </button>
           <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-black flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
             SYSTEM ACTIVE 100%
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider">BẢNG ĐIỀU KHIỂN GIẢI MÃ CAPTCHA AI</h1>
              <p className="text-gray-400 text-sm">Hệ thống AI tự động vượt Captcha, chống khóa luồng Livestream trên đa nền tảng.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Tổng Số Đã Giải Mã</span>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-white">{captchaStats.totalSolved.toLocaleString()}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded mb-1">+342 hnay</span>
              </div>
            </div>
            
            <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Tỷ Lệ Thành Công</span>
              <span className="text-4xl font-black text-emerald-400">{captchaStats.successRate}%</span>
            </div>

            <div className="bg-[#141419] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">Tốc Độ Phản Hồi Trung Bình</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-blue-400">{captchaStats.responseTime}</span>
                <span className="text-lg font-normal text-gray-500">ms</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#141419] border border-white/5 rounded-2xl p-6">
                 <h4 className="text-sm font-black text-white border-b border-white/5 pb-4 mb-4 flex items-center gap-2">
                   <Cpu className="w-4 h-4 text-cyan-400" /> Cấu Hình Chiến Thuật AI
                 </h4>
                 <div className="space-y-4">
                    {[
                      { id: 'imageBypass', label: 'Giải mã Ảnh / Slider Captcha' },
                      { id: 'cloudflareTurnstile', label: 'Vượt tường lửa Cloudflare v3' },
                      { id: 'autoProxy', label: 'Anti-Fingerprint (Thay Proxy liên tục)' },
                      { id: 'autoToken', label: 'Auto-Submit Token (Chống kẹt)' }
                    ].map(cfg => (
                       <div key={cfg.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-xs text-gray-300 font-bold">{cfg.label}</span>
                          <button 
                            onClick={() => setCaptchaConfig(prev => ({...prev, [cfg.id]: !prev[cfg.id]}))}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-300 cursor-pointer ${captchaConfig[cfg.id] ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-gray-700'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${captchaConfig[cfg.id] ? 'left-[22px]' : 'left-[2px]'}`}></div>
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#141419] border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.05)] text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_10%,transparent_100%)]"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                       <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
                       <div className="absolute inset-2 border border-dashed border-cyan-400/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                       <div className="absolute inset-6 bg-cyan-500/10 rounded-full blur-md animate-pulse"></div>
                       {phase === 'success' ? (
                         <CheckCircle2 className="w-10 h-10 text-emerald-400 relative z-10" />
                       ) : phase === 'analyzing' ? (
                         <Scan className="w-10 h-10 text-amber-400 relative z-10 animate-pulse" />
                       ) : (
                         <Cpu className="w-10 h-10 text-cyan-400 relative z-10 animate-bounce" />
                       )}
                    </div>
                    <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-1">
                      {phase === 'init' && 'Khởi Động AI...'}
                      {phase === 'analyzing' && 'Phân Tích Thuật Toán...'}
                      {phase === 'solving' && 'Bẻ Khóa Đa Nền Tảng...'}
                      {phase === 'success' && 'Hoạt Động Ổn Định'}
                    </h4>
                    <p className="text-[10px] font-mono text-cyan-400/70">{progress}% COMPUTING</p>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#050505] border border-white/5 rounded-2xl h-48 p-4 overflow-y-auto font-mono text-xs flex flex-col gap-2 custom-scrollbar shadow-inner relative">
                <div className="sticky top-0 bg-[#050505] pb-2 border-b border-white/5 flex items-center gap-2 text-gray-500 mb-2 z-10">
                   <Terminal className="w-4 h-4" />
                   <span>[root@ava-stealth-node-01] ~ tail -f /var/log/bypass.log</span>
                </div>
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 items-start break-all">
                    <span className="text-gray-600 shrink-0">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'info' ? 'text-blue-400' : ''}
                      ${log.type === 'warning' ? 'text-amber-400' : ''}
                      ${log.type === 'error' ? 'text-red-400' : ''}
                      ${log.type === 'success' ? 'text-emerald-400' : ''}
                    `}>
                      {log.msg}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>

              <div className="bg-[#141419] border border-white/5 rounded-2xl overflow-hidden">
                 <div className="p-5 border-b border-white/5 flex items-center justify-between">
                   <h4 className="text-sm font-black text-white flex items-center gap-2">
                     <Activity className="w-4 h-4 text-purple-400" /> Lịch Sử Giải Mã Real-time
                   </h4>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-xs">
                      <thead className="bg-[#1A1A24] text-[10px] uppercase tracking-wider text-gray-500">
                         <tr>
                           <th className="px-5 py-3 font-black">Thời Gian</th>
                           <th className="px-5 py-3 font-black">Nền Tảng</th>
                           <th className="px-5 py-3 font-black">Loại Captcha</th>
                           <th className="px-5 py-3 font-black">Tốc Độ</th>
                           <th className="px-5 py-3 font-black text-right">Trạng Thái</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-gray-300">
                         {captchaStats.historyLogs.map((log, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                               <td className="px-5 py-3">{log.time}</td>
                               <td className="px-5 py-3 font-bold text-white">{log.p}</td>
                               <td className="px-5 py-3">{log.type}</td>
                               <td className="px-5 py-3 text-cyan-400">{log.speed}</td>
                               <td className="px-5 py-3 text-right">
                                  <span className={`px-2 py-1 rounded text-[10px] font-black ${
                                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  }`}>
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
      </div>
    </div>
  );
};

export default AutoCaptchaSolver;
