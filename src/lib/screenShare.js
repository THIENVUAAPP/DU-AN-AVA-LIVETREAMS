// Chia sẻ màn hình (getDisplayMedia) — wrapper xử lý cả trường hợp user bấm Hủy
// và trường hợp user bấm nút "Dừng chia sẻ" gốc của trình duyệt (native stop button).

export async function startScreenShare() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Trình duyệt này không hỗ trợ chia sẻ màn hình (getDisplayMedia).');
  }
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { cursor: 'always' },
      audio: true,
    });
    return stream;
  } catch (err) {
    // User chủ động bấm "Hủy" ở popup chọn màn hình — không phải lỗi thật, không log lỗi.
    if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
      return null;
    }
    throw err;
  }
}

// Đăng ký callback khi user bấm nút "Dừng chia sẻ" gốc của trình duyệt
// (khác với việc người dùng tự bấm nút tắt trong app) — bắt buộc phải lắng nghe
// sự kiện này để tự động revert UI, tránh state "đang chia sẻ" bị treo.
export function onScreenShareNativeStop(stream, callback) {
  const track = stream?.getVideoTracks?.()[0];
  if (!track) return () => {};
  track.addEventListener('ended', callback);
  return () => track.removeEventListener('ended', callback);
}

export function stopScreenShare(stream) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}
