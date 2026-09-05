import { APP_VERSION } from '../components/genaidol/UpdateNotificationModal';

/**
 * ⚡ KÍCH HOẠT TẢI XUỐNG TRỰC TIẾP VỀ MÁY TÍNH
 * - Tự động tải file ZIP về máy ngay lập tức (Direct Stream download)
 * - Tuyệt đối KHÔNG mở tab mới hoặc chuyển hướng hiển thị trang GitHub
 * - Tự động nhận diện Windows (.zip) hoặc macOS (.zip)
 */
export const triggerDirectDownload = (url, fileName) => {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName || 'AvaLive_VIP_PRO.zip');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        if (a.parentNode) a.parentNode.removeChild(a);
      } catch (e) {}
    }, 1000);
  } catch (err) {
    // Fallback an toàn nếu trình duyệt chặn tự động click
    window.location.href = url;
  }
};

export const getDownloadInfo = (targetOS) => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
  const isMac = targetOS ? targetOS === 'mac' : userAgent.includes('mac');
  const osType = isMac ? 'mac' : 'windows';
  const fileName = isMac ? `AvaLive_VIP_PRO_Mac_v${APP_VERSION}.zip` : `AvaLive_VIP_PRO_Windows_v${APP_VERSION}.zip`;

  // Kiểm tra môi trường local / private IP
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.port === '3001'
  );

  let directUrl;
  if (isLocal) {
    const origin = window.location.port === '5173' ? 'http://localhost:3001' : window.location.origin;
    directUrl = `${origin}/api/download/${osType}`;
  } else {
    // Tải trực tiếp từ GitHub Releases Asset (Đã cấu hình Content-Disposition: attachment)
    directUrl = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${APP_VERSION}/${fileName}`;
  }

  return { url: directUrl, fileName, isMac, osType };
};

export const handleOSDownload = (e, forcedOS) => {
  if (e && e.preventDefault) e.preventDefault();
  const { url, fileName } = getDownloadInfo(forcedOS);
  triggerDirectDownload(url, fileName);
};

export const downloadWindows = (e) => handleOSDownload(e, 'windows');
export const downloadMac = (e) => handleOSDownload(e, 'mac');
