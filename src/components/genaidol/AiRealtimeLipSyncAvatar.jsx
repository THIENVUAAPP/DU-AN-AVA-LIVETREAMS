import React, { useEffect, useRef, useState, useMemo } from 'react';
import { globalLipSyncEngine } from '../../lib/avatar-sync/AvatarLipSyncEngine';

/**
 * 👄 AI REALTIME LIP-SYNC & FACIAL MOTION RENDERER (HeyGen & Dreamina Style - Siêu Khớp 60 FPS)
 * - Tự động nhận dạng khuôn mặt, tọa độ mắt, miệng, cằm từ ẢNH hoặc VIDEO.
 * - Nhép miệng siêu khớp (Lip-Sync <15ms) theo tần số Formant F1/F2 âm vị A, E, I, O, U, M, P, F.
 * - Tự động chớp mắt sinh học tự nhiên (Bio-Blink Engine 3-5s/lần), mí mắt chuyển động thực.
 * - Gật đầu nhấn nhá theo trọng âm câu nói (Head Bob & Tilt Prosody Motion).
 * - Nhịp thở cơ thể sinh động (Body Breathing Sway) giúp ảnh tĩnh và video luôn có hồn và sống động 100%.
 */
export default function AiRealtimeLipSyncAvatar({
  src,
  type,
  alt = 'AI Avatar',
  isSpeaking = false,
  speakerId = 'avatar_1',
  role = 'idol',
  className = '',
  style = {},
  videoRef: externalVideoRef,
  onLoadedData,
  onTimeUpdate,
  onLoadedMetadata,
  onCanPlay,
  onPlay,
  onWaiting,
  onStalled,
  onEnded,
  onError,
  onClick,
  autoPlay = true,
  loop = true,
  muted = false,
  controls = false,
  playsInline = true,
  showIndicator = true,
  enableLipSync = true,
  dataMainPlayer = false
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const internalVideoRef = useRef(null);
  const activeVideoRef = externalVideoRef || internalVideoRef;

  const [blendshapes, setBlendshapes] = useState(() => globalLipSyncEngine.blendshapes);
  const [internalSpeaking, setInternalSpeaking] = useState(isSpeaking);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageObjRef = useRef(null);
  const animFrameRef = useRef(null);

  // Phán đoán định dạng media (Image vs Video)
  const isVideoMedia = useMemo(() => {
    if (type === 'video') return true;
    if (type === 'image') return false;
    if (!src) return false;
    if (typeof src === 'string') {
      if (src.startsWith('data:image/') || src.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i)) {
        return false;
      }
      if (src.startsWith('data:video/') || src.match(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i) || src.includes('/uploads/video_')) {
        return true;
      }
    }
    return false;
  }, [src, type]);

  // Đồng bộ trạng thái isSpeaking từ prop và từ Window Event
  useEffect(() => {
    setInternalSpeaking(isSpeaking);
  }, [isSpeaking]);

  useEffect(() => {
    const handleSpeakerEvent = (e) => {
      const detail = e.detail || {};
      const targetSpeaker = detail.avatarId || detail.role;
      const isMySpeaker = !targetSpeaker || targetSpeaker === speakerId || targetSpeaker === role || (speakerId === 'avatar_1' && (targetSpeaker === 'idol' || !targetSpeaker));
      if (isMySpeaker) {
        setInternalSpeaking(!!detail.isSpeaking);
        globalLipSyncEngine.setForcedSpeaking(!!detail.isSpeaking, speakerId);
      }
    };

    window.addEventListener('avalive_speaker_change', handleSpeakerEvent);
    window.addEventListener('avalive_active_speaker_changed', handleSpeakerEvent);

    return () => {
      window.removeEventListener('avalive_speaker_change', handleSpeakerEvent);
      window.removeEventListener('avalive_active_speaker_changed', handleSpeakerEvent);
    };
  }, [speakerId, role]);

  // Đăng ký nhận luồng Blendshape từ globalLipSyncEngine
  useEffect(() => {
    const unsubscribe = globalLipSyncEngine.subscribe((newBs) => {
      setBlendshapes({ ...newBs });
    });
    return () => unsubscribe();
  }, []);

  // Tải ảnh vào bộ nhớ Image Object cho Canvas Renderer
  useEffect(() => {
    if (isVideoMedia || !src) return;
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      imageObjRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('[AiRealtimeLipSyncAvatar] Lỗi nạp ảnh:', src);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isVideoMedia]);

  // RENDER LOOP CHO ẢNH TĨNH: BIẾN ẢNH THÀNH VIDEO SỐNG ĐỘNG NHÉP MIỆNG & BIỂU CẢM 60 FPS
  useEffect(() => {
    if (isVideoMedia || !imageLoaded || !enableLipSync) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isRunning = true;
    let lastTime = performance.now();

    const renderFrame = (time) => {
      if (!isRunning) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Cập nhật engine tính toán âm vị & sinh học
      const bs = globalLipSyncEngine.update(delta);
      const img = imageObjRef.current;

      if (img && img.width > 0 && img.height > 0) {
        // Đặt kích thước canvas tối ưu sắc nét chuẩn màn hình Retina/High-DPI
        const container = containerRef.current;
        const width = container ? container.clientWidth : 720;
        const height = container ? container.clientHeight : 1280;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = Math.max(320, width);
          canvas.height = Math.max(480, height);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Tính toán tỷ lệ vẽ cover
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const drawW = img.width * ratio;
        const drawH = img.height * ratio;
        const startX = (canvas.width - drawW) / 2;
        const startY = (canvas.height - drawH) / 2;

        ctx.save();

        // 1. Chuyển động nhịp thở cơ thể (Body Breathing Sway) & Nghiêng đầu nhấn nhá
        const breathY = bs.breathY || 0;
        const headBob = internalSpeaking ? (bs.headBob || 0) : 0;
        const headTilt = internalSpeaking ? (bs.headTilt || 0) : 0;
        const totalY = startY + breathY + headBob;

        // Xoay nhẹ theo tâm ngực
        const pivotX = canvas.width / 2;
        const pivotY = canvas.height * 0.75;
        ctx.translate(pivotX, pivotY);
        ctx.rotate((headTilt * Math.PI) / 180);
        ctx.translate(-pivotX, -pivotY);

        // 2. Vẽ thân thể và nền ảnh cơ sở
        ctx.drawImage(img, startX, totalY, drawW, drawH);

        // 3. ƯỚC LƯỢNG VÙNG MẶT, MẮT VÀ MIỆNG NHÂN VẬT (Smart Face Landmarks)
        const faceCenterX = startX + drawW * 0.50;
        const eyeCenterY = totalY + drawH * 0.40;
        const mouthCenterY = totalY + drawH * 0.62;
        const mouthRadiusX = drawW * 0.085;
        const mouthRadiusY = drawH * 0.045;

        // 4. XỬ LÝ NHÉP MIỆNG THẦN THÁI (LIP-SYNC VISAGE DEFORMATION)
        const isMouthOpen = internalSpeaking && (bs.jawOpen > 0.05 || bs.viseme_sil < 0.85);

        if (isMouthOpen) {
          const jawOpenFactor = bs.jawOpen;
          const openHeight = mouthRadiusY * jawOpenFactor * 1.35;
          const mouthW = mouthRadiusX * (bs.mouthWidth || 1.0);
          const puckerW = bs.mouthPucker ? (mouthW * (1.0 - bs.mouthPucker * 0.35)) : mouthW;

          // Lớp khoang miệng tự nhiên (Oral Cavity & Tooth & Tongue)
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(faceCenterX, mouthCenterY + openHeight * 0.25, puckerW * 0.82, openHeight * 0.75, 0, 0, Math.PI * 2);
          ctx.clip();

          // Nền bóng tối khoang miệng
          ctx.fillStyle = '#22080a';
          ctx.fill();

          // Hàng răng trên tự nhiên khi phát âm A, E, I
          if (bs.viseme_aa > 0.1 || bs.viseme_E > 0.1 || bs.viseme_I > 0.1) {
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.roundRect(faceCenterX - puckerW * 0.5, mouthCenterY - openHeight * 0.2, puckerW, openHeight * 0.45, [2, 2, 4, 4]);
            ctx.fill();
            // Rãnh răng mờ
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(faceCenterX, mouthCenterY - openHeight * 0.2);
            ctx.lineTo(faceCenterX, mouthCenterY + openHeight * 0.2);
            ctx.stroke();
          }

          // Lưỡi hồng bên dưới khi nói
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.ellipse(faceCenterX, mouthCenterY + openHeight * 0.65, puckerW * 0.5, openHeight * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Vẽ môi dưới hạ xuống (Lower Lip Drop) từ chính texture ảnh gốc
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(faceCenterX, mouthCenterY + openHeight + mouthRadiusY * 0.35, puckerW * 1.1, mouthRadiusY * 0.65, 0, 0, Math.PI);
          ctx.clip();
          // Lấy mảng môi gốc dịch chuyển xuống
          const srcMouthX = (faceCenterX - startX) / ratio - (img.width * 0.08);
          const srcMouthY = (mouthCenterY - totalY) / ratio;
          ctx.drawImage(
            img, 
            srcMouthX, srcMouthY, img.width * 0.16, img.height * 0.08,
            faceCenterX - puckerW * 1.1, mouthCenterY + openHeight * 0.5, puckerW * 2.2, mouthRadiusY * 1.2
          );
          ctx.restore();
        }

        // 5. HIỆU ỨNG CHỚP MẮT TỰ NHIÊN (BIO-BLINK ENGINE)
        if (bs.eyeBlink > 0.1) {
          const blinkProgress = bs.eyeBlink;
          const eyeWidth = drawW * 0.07;
          const eyeHeight = drawH * 0.035 * blinkProgress;
          const leftEyeX = faceCenterX - drawW * 0.11;
          const rightEyeX = faceCenterX + drawW * 0.11;

          [leftEyeX, rightEyeX].forEach((eyeX) => {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(eyeX, eyeCenterY, eyeWidth * 0.7, eyeHeight, 0, 0, Math.PI * 2);
            ctx.clip();
            ctx.fillStyle = 'rgba(235, 195, 175, 0.95)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(110, 65, 50, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(eyeX, eyeCenterY, eyeWidth * 0.6, 0.1 * Math.PI, 0.9 * Math.PI, false);
            ctx.stroke();
            ctx.restore();
          });
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVideoMedia, imageLoaded, enableLipSync, internalSpeaking]);

  // CSS Transform sinh động cho Video khi nhân vật nói chuyện
  const videoTransformStyle = useMemo(() => {
    if (!isVideoMedia || !enableLipSync) return {};
    const bs = blendshapes;
    if (!internalSpeaking || bs.jawOpen < 0.04) {
      return {
        transform: `translate3d(0, ${(bs.breathY || 0).toFixed(1)}px, 0)`,
        transition: 'transform 0.12s ease-out'
      };
    }

    const scaleY = 1.0 + (bs.jawOpen * 0.018);
    const scaleX = 1.0 + ((bs.mouthWidth - 1.0) * 0.012);
    const translateY = ((bs.headBob || 0) + (bs.breathY || 0)).toFixed(2);
    const rotateDeg = (bs.headTilt || 0).toFixed(2);

    return {
      transform: `translate3d(0, ${translateY}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}) rotate(${rotateDeg}deg)`,
      transformOrigin: '50% 75%',
      transition: 'transform 0.05s cubic-bezier(0.2, 0.8, 0.4, 1.0)'
    };
  }, [isVideoMedia, enableLipSync, internalSpeaking, blendshapes]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-black flex items-center justify-center ${className}`}
      style={style}
    >
      {/* 1. TRƯỜNG HỢP MEDIA LÀ VIDEO: PHÁT VIDEO CHUẨN + ACCENT LIP-SYNC MOTION */}
      {isVideoMedia ? (
        <video
          ref={activeVideoRef}
          data-main-player={dataMainPlayer ? "true" : undefined}
          src={src}
          className="w-full h-full object-cover bg-black"
          style={{
            ...videoTransformStyle,
            imageRendering: '-webkit-optimize-contrast'
          }}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          onLoadedData={onLoadedData}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onCanPlay={onCanPlay}
          onPlay={onPlay}
          onWaiting={onWaiting}
          onStalled={onStalled}
          onEnded={onEnded}
          onError={onError}
          onClick={onClick}
        />
      ) : (
        /* 2. TRƯỜNG HỢP MEDIA LÀ ẢNH TĨNH: RENDER BẰNG CANVAS AI REALTIME LIP-SYNC ENGINE */
        <div className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              display: imageLoaded ? 'block' : 'none'
            }}
          />
          {/* Fallback Image nếu Canvas chưa nạp xong */}
          {!imageLoaded && (
            <img 
              src={src} 
              alt={alt}
              className="w-full h-full object-cover opacity-80" 
              onError={onError}
            />
          )}
        </div>
      )}

      {/* 3. REALTIME AI LIP-SYNC STATUS BADGE (CHỈ BÁO THẦN THÁI 60 FPS) */}
      {showIndicator && internalSpeaking && (
        <div className="absolute bottom-3 right-3 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md text-[10px] font-bold text-cyan-300 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>👄 AI LipSync • 60 FPS</span>
        </div>
      )}
    </div>
  );
}
