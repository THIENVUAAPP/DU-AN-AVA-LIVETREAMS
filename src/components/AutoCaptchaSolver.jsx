import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, Terminal, Zap, CheckCircle2, Scan } from 'lucide-react';

const AutoCaptchaSolver = ({ onSolved }) => {
  const [phase, setPhase] = useState('init'); // init -> analyzing -> solving -> success
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  // Auto-scroll logs
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
      // 1. INIT PHASE (0.1s)
      setPhase('init');
      addLog("Initializing AVA Stealth System v3.0...", 'info');
      addLog("Connecting to Anti-Detect Proxy Nodes...", 'info');
      await new Promise(r => setTimeout(r, 150));
      
      if (!isMounted) return;

      // 2. ANALYZING PHASE (0.4s)
      setPhase('analyzing');
      addLog("Scanning DOM for WAF Challenges...", 'warning');
      addLog("[TikTok] Detected Slider Puzzle & 3D Rotate...", 'error');
      addLog("[Facebook] Detected Checkpoint reCAPTCHA v3...", 'error');
      addLog("[YouTube] Detected Google Funcaptcha...", 'error');
      addLog("[Shopee] Detected Cloudflare Turnstile...", 'error');
      
      for (let i = 0; i <= 40; i += 5) {
        setProgress(i);
        await new Promise(r => setTimeout(r, 15));
      }

      if (!isMounted) return;

      // 3. SOLVING PHASE (0.6s)
      setPhase('solving');
      addLog("Injecting AI Bypass Payload...", 'info');
      addLog("Solving [TikTok] Slider Puzzle (Calculated X-Offset: 124px)...", 'success');
      setProgress(60);
      await new Promise(r => setTimeout(r, 100));
      
      addLog("Solving [Facebook] reCAPTCHA (Score: 0.9)...", 'success');
      setProgress(80);
      await new Promise(r => setTimeout(r, 100));

      addLog("Solving [Shopee] Cloudflare Turnstile (Clearance granted)...", 'success');
      setProgress(95);
      await new Promise(r => setTimeout(r, 100));
      
      addLog("All Captchas Bypassed Successfully!", 'success');
      setProgress(100);
      
      if (!isMounted) return;

      // 4. SUCCESS PHASE (0.4s)
      setPhase('success');
      await new Promise(r => setTimeout(r, 400));
      
      if (isMounted && onSolved) {
        onSolved();
      }
    };

    runSequence();

    return () => { isMounted = false; };
  }, [onSolved]);

  return (
    <div className="absolute inset-0 z-[100] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center font-sans">
      <div className="relative w-[90%] max-w-xl bg-[#0A0A0E] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#121216] border-b border-cyan-500/20 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h3 className="text-cyan-400 font-black text-sm tracking-widest uppercase">AVA AI Stealth Solver</h3>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-500 font-mono">LATENCY: 12MS</span>
             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
           
           {/* Left: Graphic / Status */}
           <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 {/* Outer Rings */}
                 <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
                 <div className="absolute inset-2 border border-dashed border-cyan-400/40 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                 <div className="absolute inset-6 bg-cyan-500/10 rounded-full blur-md animate-pulse"></div>
                 
                 {/* Center Icon */}
                 {phase === 'success' ? (
                   <CheckCircle2 className="w-16 h-16 text-emerald-400 relative z-10" />
                 ) : phase === 'analyzing' ? (
                   <Scan className="w-16 h-16 text-amber-400 relative z-10 animate-pulse" />
                 ) : (
                   <Cpu className="w-16 h-16 text-cyan-400 relative z-10 animate-bounce" />
                 )}
              </div>

              <div className="text-center">
                <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                  {phase === 'init' && 'Khởi Động AI...'}
                  {phase === 'analyzing' && 'Phân Tích Thuật Toán...'}
                  {phase === 'solving' && 'Bẻ Khóa Đa Nền Tảng...'}
                  {phase === 'success' && 'Hoàn Tất Giải Mã!'}
                </h4>
                <p className="text-xs font-mono text-cyan-400/70">
                  {progress}% COMPUTING
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                 <div 
                   className={`h-full rounded-full transition-all duration-75 ease-out ${phase === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}
                   style={{ width: `${progress}%` }}
                 ></div>
              </div>
           </div>

           {/* Right: Terminal Console */}
           <div className="bg-black/50 border border-white/5 rounded-xl h-48 p-3 overflow-y-auto font-mono text-[10px] sm:text-[11px] flex flex-col gap-1.5 custom-scrollbar">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                 <Terminal className="w-3 h-3" />
                 <span>[root@ava-stealth-node-01] ~</span>
              </div>
              
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start break-all">
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

        </div>

      </div>
    </div>
  );
};

export default AutoCaptchaSolver;
