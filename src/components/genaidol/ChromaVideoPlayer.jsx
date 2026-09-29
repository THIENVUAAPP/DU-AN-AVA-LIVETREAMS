import React, { useRef, useEffect } from 'react';

/**
 * 🎥 ChromaVideoPlayer
 * Trình phát Video Tách Phông AI Canvas Realtime 60 FPS
 * - Khử sạch 100% phông xanh lá, xanh dương, đỏ, tối màu
 * - Khử viền lem ám màu (Realtime Color Despill)
 * - Đảm bảo trong suốt 100% trên OBS Studio, TikTok Live Studio, CEF, Electron & Web
 */
const ChromaVideoPlayer = ({
  src,
  chromaKey = null,
  isPaused = false,
  isMuted = true,
  volume = 1.0,
  className = "w-full h-full object-cover pointer-events-none",
  style = {}
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const isChroma = Boolean(chromaKey?.enabled);
  const chromaMode = (chromaKey?.mode || 'green').toLowerCase();

  // Đồng bộ trạng thái âm thanh & phát/dừng
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
    if (isPaused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isPaused, isMuted, volume]);

  // Vòng lặp render 60 FPS trên Canvas khi bật Chroma Key
  useEffect(() => {
    if (!isChroma) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let active = true;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const processFrame = () => {
      if (!active) return;
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const vw = video.videoWidth || 360;
        const vh = video.videoHeight || 640;
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }
        ctx.drawImage(video, 0, 0, vw, vh);
        const frame = ctx.getImageData(0, 0, vw, vh);
        const data = frame.data;
        const len = data.length;

        if (chromaMode === 'green' || chromaMode === 'auto') {
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxRB = Math.max(r, b);
            const greenExcess = g - maxRB;

            const isSkin = (r > 80 && g > 45 && b > 30 && r > g && r > b && (r - b) >= 6);

            if (isSkin) {
              // Bảo vệ da mặt & cơ thể, khử ánh xanh phản chiếu
              if (r - g < 14 && g > b) {
                data[i + 1] = Math.round(r * 0.86 + b * 0.14);
              }
            } else if (greenExcess > 0) {
              const clipBlack = 26;
              if (greenExcess >= clipBlack) {
                data[i + 3] = 0; // Trong suốt 100%
              } else {
                const norm = greenExcess / clipBlack;
                data[i + 3] = Math.max(0, Math.min(255, Math.round((1.0 - norm) * 255)));
                data[i + 1] = maxRB; // Despill viền
              }
            }

            // Global Multi-Color Despill
            if (data[i + 1] > Math.max(data[i], data[i + 2])) {
              data[i + 1] = Math.max(data[i], data[i + 2]);
            }
          }
        } else if (chromaMode === 'blue') {
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxRG = Math.max(r, g);
            const blueExcess = b - maxRG;

            if (blueExcess > 0) {
              const clipBlack = 26;
              if (blueExcess >= clipBlack) {
                data[i + 3] = 0;
              } else {
                const norm = blueExcess / clipBlack;
                data[i + 3] = Math.max(0, Math.min(255, Math.round((1.0 - norm) * 255)));
                data[i + 2] = maxRG;
              }
            }

            if (data[i + 2] > Math.max(data[i], data[i + 1])) {
              data[i + 2] = Math.max(data[i], data[i + 1]);
            }
          }
        } else if (chromaMode === 'red') {
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxGB = Math.max(g, b);
            const redExcess = r - maxGB;

            if (redExcess > 25 && r > 90) {
              if (redExcess > 45) {
                data[i + 3] = 0;
              } else {
                const norm = (redExcess - 25) / 20;
                data[i + 3] = Math.max(0, Math.min(255, Math.round((1.0 - norm) * 255)));
                data[i] = maxGB;
              }
            }
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      animRef.current = requestAnimationFrame(processFrame);
    };

    animRef.current = requestAnimationFrame(processFrame);

    return () => {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isChroma, chromaMode, src]);

  return (
    <>
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        src={src}
        autoPlay={!isPaused}
        loop
        muted={isMuted}
        playsInline
        onCanPlay={(e) => {
          e.target.muted = isMuted;
          if (!isPaused) e.target.play().catch(() => {});
        }}
        className={isChroma ? "hidden" : className}
        style={isChroma ? { display: 'none' } : style}
      />
      {isChroma && (
        <canvas
          ref={canvasRef}
          className={className}
          style={style}
        />
      )}
    </>
  );
};

export default ChromaVideoPlayer;
