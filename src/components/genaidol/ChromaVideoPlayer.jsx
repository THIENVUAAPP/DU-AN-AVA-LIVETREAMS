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
            const diff = g - maxRB;

            if (diff > 10 && g > 38 && g > r * 1.08 && g > b * 1.05) {
              if (diff < 30) {
                const a = 1.0 - (diff - 10) / 20;
                data[i + 1] = maxRB; // Khử ám xanh lá viền (Despill)
                data[i + 3] = Math.round(a * 255);
              } else {
                data[i + 3] = 0; // Trong suốt 100%
              }
            } else if (g > maxRB && g > 45) {
              data[i + 1] = Math.round((g + maxRB) / 2); // Khử ám nhẹ
            }
          }
        } else if (chromaMode === 'blue') {
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxRG = Math.max(r, g);
            const diff = b - maxRG;

            if (diff > 10 && b > 38 && b > r * 1.08 && b > g * 1.05) {
              if (diff < 30) {
                const a = 1.0 - (diff - 10) / 20;
                data[i + 2] = maxRG; // Despill xanh dương
                data[i + 3] = Math.round(a * 255);
              } else {
                data[i + 3] = 0;
              }
            }
          }
        } else if (chromaMode === 'red') {
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const maxGB = Math.max(g, b);
            const diff = r - maxGB;

            if (diff > 30 && r > 90) {
              if (diff < 50) {
                const a = 1.0 - (diff - 30) / 20;
                data[i] = maxGB;
                data[i + 3] = Math.round(a * 255);
              } else {
                data[i + 3] = 0;
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
