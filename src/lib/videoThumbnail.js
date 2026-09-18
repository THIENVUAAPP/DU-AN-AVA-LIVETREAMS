// Chụp 1 khung hình đại diện (poster) từ video để làm thumbnail xem trước — dùng chung cho Thư Viện
// Video Nền Vũ Trường và hàng đợi Video Nhảy Mẫu, để "video nào cũng có thumbnail dễ nhận biết".
export function captureVideoThumbnail(file, seekSeconds = 0.5) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    const cleanup = () => URL.revokeObjectURL(video.src);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(seekSeconds, Math.max(0, (video.duration || 1) - 0.1));
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 320 / Math.max(video.videoWidth, video.videoHeight));
        canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
        canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(err);
      }
    };
    video.onerror = () => {
      cleanup();
      reject(new Error('Không đọc được video để tạo thumbnail.'));
    };
  });
}
