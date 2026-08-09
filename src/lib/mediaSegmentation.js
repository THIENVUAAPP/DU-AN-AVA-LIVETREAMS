// Xử lý ảnh/video nhân vật do người dùng tải lên — tách nền để dùng làm "nhân vật thật" trên sàn nhảy.
//
// Ảnh: dùng lại đúng công cụ MediaPipe Selfie Segmentation đã load sẵn toàn cục trong index.html
// (window.SelfieSegmentation — cùng công nghệ ProductionStudio.jsx đang dùng để tách nền camera live),
// xử lý 1 lần (one-shot) ra ảnh PNG nền trong suốt.
//
// Video: segmentation AI theo thời gian thực cho nhiều nhân vật cùng lúc quá nặng cho trình duyệt,
// nên dùng kỹ thuật phông xanh/phông xanh dương (chroma key) cổ điển — xử lý từng khung hình bằng
// Canvas 2D, nhẹ và ổn định hơn nhiều so với chạy lại model AI mỗi frame.

function drawScaledToCanvas(source, sourceWidth, sourceHeight, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
  const w = Math.max(1, Math.round(sourceWidth * scale));
  const h = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(source, 0, 0, w, h);
  return canvas;
}

// Trả về Promise<string> (data URL PNG nền trong suốt, giới hạn cạnh dài ~480px để nhẹ localStorage).
export function segmentImageToCutout(imageFile, maxSize = 480) {
  return new Promise((resolve, reject) => {
    if (!window.SelfieSegmentation) {
      reject(new Error("Chưa tải xong công cụ tách nền AI, vui lòng thử lại sau vài giây."));
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    img.onload = () => {
      try {
        const scaledSource = drawScaledToCanvas(img, img.width, img.height, maxSize);
        const seg = new window.SelfieSegmentation({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });
        seg.setOptions({ modelSelection: 0, selfieMode: false });
        seg.onResults((results) => {
          try {
            const W = results.image.width;
            const H = results.image.height;
            const outCanvas = document.createElement("canvas");
            outCanvas.width = W;
            outCanvas.height = H;
            const ctx = outCanvas.getContext("2d");
            ctx.drawImage(results.segmentationMask, 0, 0, W, H);
            ctx.globalCompositeOperation = "source-in";
            ctx.drawImage(results.image, 0, 0, W, H);
            ctx.globalCompositeOperation = "source-over";
            URL.revokeObjectURL(objectUrl);
            resolve(outCanvas.toDataURL("image/png"));
          } catch (err) {
            URL.revokeObjectURL(objectUrl);
            reject(err);
          }
        });
        seg.send({ image: scaledSource });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Không đọc được file ảnh đã chọn."));
    };
    img.src = objectUrl;
  });
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// Vòng lặp chroma-key thời gian thực: vẽ video vào canvas mỗi khung hình, xoá alpha các pixel gần màu
// khoá (mặc định xanh lá #00FF00). Trả về hàm cleanup() để dừng khi nhân vật rời sàn/component unmount.
export function startChromaKeyLoop(videoEl, canvasEl, keyColorHex = "#00FF00", tolerance = 70) {
  const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
  const keyRgb = hexToRgb(keyColorHex);
  let rafId = null;
  let stopped = false;

  function frame() {
    if (stopped) return;
    if (videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
      if (canvasEl.width !== videoEl.videoWidth || canvasEl.height !== videoEl.videoHeight) {
        canvasEl.width = videoEl.videoWidth;
        canvasEl.height = videoEl.videoHeight;
      }
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
      const frameData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
      const data = frameData.data;
      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - keyRgb.r;
        const dg = data[i + 1] - keyRgb.g;
        const db = data[i + 2] - keyRgb.b;
        if (Math.sqrt(dr * dr + dg * dg + db * db) < tolerance) data[i + 3] = 0;
      }
      ctx.putImageData(frameData, 0, 0);
    }
    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
  return () => {
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
}
