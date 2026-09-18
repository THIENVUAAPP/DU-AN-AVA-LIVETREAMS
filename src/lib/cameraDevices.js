// Quản lý danh sách & mở/đóng camera vật lý thật qua deviceId (không mô phỏng)

export async function listVideoInputDevices() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === 'videoinput');
  } catch (e) {
    console.error('Lỗi khi liệt kê camera:', e);
    return [];
  }
}

export async function openCameraStream(deviceId) {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Trình duyệt không hỗ trợ getUserMedia');
  }

  const constraintTiers = [];

  if (deviceId) {
    constraintTiers.push({
      video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    constraintTiers.push({
      video: { deviceId: deviceId },
      audio: false,
    });
  }

  constraintTiers.push(
    { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: { facingMode: 'user' }, audio: false },
    { video: true, audio: false }
  );

  let lastError = null;
  for (const constraints of constraintTiers) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (stream && stream.getVideoTracks().length > 0) {
        return stream;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Không thể khởi động luồng Camera vật lý');
}

export function closeCameraStream(stream) {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch (e) {
        console.error('Lỗi dừng track camera:', e);
      }
    });
  } catch (e) {
    console.error('Lỗi đóng stream:', e);
  }
}

