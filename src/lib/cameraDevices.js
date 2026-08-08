// Quản lý danh sách & mở/đóng camera vật lý thật qua deviceId (không mô phỏng)

export async function listVideoInputDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === 'videoinput');
}

export async function openCameraStream(deviceId) {
  return navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: { exact: deviceId },
      width: { ideal: 640 },
      height: { ideal: 360 },
    },
    audio: false,
  });
}

export function closeCameraStream(stream) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}
