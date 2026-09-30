import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, SwitchCamera, Video, Wifi, Sparkles, CheckCircle2, 
  ShieldCheck, RefreshCw, Zap, Lock, Eye, AlertCircle, Maximize2 
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function PhoneCamStreamer() {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' | 'environment'
  const [quality, setQuality] = useState('1080p'); // '720p' | '1080p' | '4k'
  const [status, setStatus] = useState('connecting'); // 'connecting' | 'streaming' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionId, setSessionId] = useState('');

  const videoRef = useRef(null);
  const channelRef = useRef(null);
  const frameIntervalRef = useRef(null);

  // Lấy sessionId từ URL query ?session=AVA_CAM_XXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('session') || params.get('s') || 'AVA_CAM_DEFAULT';
    setSessionId(sid);
  }, []);

  // Khởi tạo camera trên điện thoại
  const startCamera = async () => {
    try {
      setStatus('connecting');
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }

      let width = 1920;
      let height = 1080;
      if (quality === '4k') {
        width = 3840; height = 2160;
      } else if (quality === '720p') {
        width = 1280; height = 720;
      }

      const constraints = {
        audio: false,
        video: {
          facingMode: facingMode,
          width: { ideal: width },
          height: { ideal: height },
          frameRate: { ideal: 60, min: 30 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus('streaming');
      setErrorMessage('');
    } catch (err) {
      console.error('[PhoneCam] Camera error:', err);
      // Fallback đơn giản hơn
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setStatus('streaming');
        setErrorMessage('');
      } catch (e) {
        setStatus('error');
        setErrorMessage('Không thể mở Camera. Vui lòng cho phép quyền truy cập Camera trên trình duyệt điện thoại.');
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [facingMode, quality]);

  // Kết nối Supabase Realtime Channel để stream khung hình
  useEffect(() => {
    if (!sessionId) return;

    const channelName = `phone_cam_${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: false } }
    });

    channel
      .on('broadcast', { event: 'DESKTOP_READY' }, () => {
        console.log('[PhoneCam] Desktop is listening, streaming active');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[PhoneCam] Subscribed to broadcast channel:', channelName);
          channel.send({
            type: 'broadcast',
            event: 'PHONE_JOINED',
            payload: { timestamp: Date.now(), quality, facingMode }
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [sessionId, quality, facingMode]);

  // Vòng lặp nén và gửi frame siêu tốc (Real-time Broadcast Stream 30FPS)
  useEffect(() => {
    if (status !== 'streaming' || !sessionId) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const sendFrame = () => {
      const video = videoRef.current;
      const channel = channelRef.current;
      if (!video || !channel || video.readyState < 2) return;

      const targetW = 640;
      const targetH = 360;
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.drawImage(video, 0, 0, targetW, targetH);
      const frameData = canvas.toDataURL('image/jpeg', 0.55);

      channel.send({
        type: 'broadcast',
        event: 'PHONE_FRAME',
        payload: {
          image: frameData,
          timestamp: Date.now(),
          facingMode
        }
      }).catch(() => {});
    };

    const interval = setInterval(sendFrame, 1000 / 30);
    frameIntervalRef.current = interval;

    return () => clearInterval(interval);
  }, [status, sessionId, facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-between font-sans overflow-hidden select-none">
      
      {/* 🌟 Header Top Bar */}
      <div className="w-full z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="text-xs font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <Zap size={12} /> AVA LIVE PRO CAM
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Mã kết nối: <span className="text-cyan-400 font-bold">{sessionId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Wifi size={10} /> 60 FPS
          </span>
          <button
            onClick={() => {
              if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
              }
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* 📹 Main Video Preview Viewport */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        {/* Thông báo trạng thái đè trực tiếp */}
        {status === 'streaming' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
            <CheckCircle2 size={12} /> Đang truyền trực tiếp vào Máy Tính
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-30 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle size={40} className="text-rose-500" />
            <div className="text-base font-bold text-white">Yêu cầu quyền truy cập Camera</div>
            <p className="text-xs text-gray-400 max-w-xs">{errorMessage}</p>
            <button
              onClick={startCamera}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2"
            >
              <RefreshCw size={14} /> Thử Lại
            </button>
          </div>
        )}
      </div>

      {/* 🎛️ Bottom Control Bar */}
      <div className="w-full z-20 p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-md flex items-center justify-around">
        
        {/* Nút Chọn Độ Phân Giải */}
        <button
          onClick={() => {
            const nextQ = quality === '1080p' ? '4k' : quality === '4k' ? '720p' : '1080p';
            setQuality(nextQ);
          }}
          className="flex flex-col items-center gap-1 text-gray-300 hover:text-white"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-mono text-[11px] font-black text-cyan-400 border border-white/10">
            {quality.toUpperCase()}
          </div>
          <span className="text-[10px] text-gray-400">Độ Phân Giải</span>
        </button>

        {/* Nút Đổi Camera Trước / Sau */}
        <button
          onClick={toggleCamera}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-2xl shadow-emerald-500/40 active:scale-90 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-black/40 hover:bg-black/20 flex items-center justify-center backdrop-blur-sm">
            <SwitchCamera size={26} className="text-white" />
          </div>
        </button>

        {/* Nút Làm Mới Kết Nối */}
        <button
          onClick={startCamera}
          className="flex flex-col items-center gap-1 text-gray-300 hover:text-white"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-200 border border-white/10">
            <RefreshCw size={18} />
          </div>
          <span className="text-[10px] text-gray-400">Làm Mới</span>
        </button>

      </div>
    </div>
  );
}
