import { APP_VERSION } from '../components/genaidol/UpdateNotificationModal';

/**
 * ⚡ KÍCH HOẠT TẢI XUỐNG TRỰC TIẾP VỀ MÁY TÍNH 100%
 * - Tự động tải file ZIP trực tiếp về máy tính (Direct Stream download)
 * - Tuyệt đối KHÔNG BAO GIỜ chuyển hướng hoặc nhảy sang trang web GitHub
 * - Sử dụng kỹ thuật iframe ẩn chuyên dụng kết hợp anchor download
 * - Tự động nhận diện hệ điều hành Windows (.zip) hoặc macOS (.zip)
 */
export const triggerDirectDownload = (url, fileName) => {
  try {
    const finalFileName = fileName || `AvaLive_VIP_PRO_v${APP_VERSION}.zip`;

    // Hiển thị thông báo tải về tức thì cho người dùng
    try {
      let toast = document.getElementById('avalive-download-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'avalive-download-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.zIndex = '999999';
        toast.style.padding = '14px 22px';
        toast.style.background = 'linear-gradient(135deg, #0f172a, #1e1b4b)';
        toast.style.color = '#fff';
        toast.style.borderRadius = '16px';
        toast.style.border = '1px solid rgba(6, 182, 212, 0.5)';
        toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(6, 182, 212, 0.3)';
        toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        toast.style.fontSize = '13px';
        toast.style.fontWeight = 'bold';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '10px';
        toast.style.transition = 'all 0.3s ease';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span style="font-size: 20px;">🚀</span> <div><div>Đang tải trực tiếp file cài đặt về máy tính!</div><div style="font-size: 11px; color: #38bdf8; font-weight: normal; margin-top: 2px;">${finalFileName}</div></div>`;
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
      setTimeout(() => {
        try {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px)';
        } catch (e) {}
      }, 5000);
    } catch (e) {}

    // 🛡️ CHỐNG TẢI TRÙNG LẶP: Khóa chống click đúp hoặc kích hoạt 2 file cùng lúc (Debounce Lock 2.5s)
    const now = Date.now();
    if (window._avalive_last_download_time && (now - window._avalive_last_download_time < 2500)) {
      console.log('⚡ Yêu cầu tải đã được xử lý gần đây, bỏ qua lệnh trùng lặp!');
      return;
    }
    window._avalive_last_download_time = now;

    // ✅ Kỹ thuật chuẩn xác: Sử dụng thẻ <a> duy nhất với thuộc tính download
    // Đảm bảo trình duyệt chỉ nhận diện DUY NHẤT 1 luồng tải về, tuyệt đối không bị tải 2 file cùng lúc!
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', finalFileName);
    a.setAttribute('rel', 'noopener noreferrer');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        if (a.parentNode) a.parentNode.removeChild(a);
      } catch (e) {}
    }, 2000);
  } catch (err) {
    console.error('Lỗi khi kích hoạt tải phần mềm:', err);
  }
};

export const getDownloadInfo = (targetOS) => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
  const isMac = targetOS ? targetOS === 'mac' : userAgent.includes('mac');
  const osType = isMac ? 'mac' : 'windows';
  const fileName = isMac ? `AvaLive_VIP_PRO_Mac_v${APP_VERSION}.zip` : `AvaLive_VIP_PRO_Windows_v${APP_VERSION}.zip`;

  // Xác định URL tải về:
  // Luôn ưu tiên endpoint nội bộ cùng host (/api/download-windows hoặc /api/download-mac)
  // để đảm bảo tính an toàn Same-Origin và kích hoạt download trực tiếp
  let directUrl = `/api/download-${osType}`;

  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'file:') {
      // Khi mở bằng file HTML cục bộ -> gọi trực tiếp backend localhost:3001
      directUrl = `http://localhost:3001/api/download-${osType}`;
    } else if (window.location.port === '5173') {
      // Khi chạy Vite dev server -> gọi trực tiếp backend localhost:3001
      directUrl = `http://localhost:3001/api/download-${osType}`;
    } else {
      // Khi chạy qua localhost:3001, TryCloudflare tunnel, domain riêng hoặc Vercel
      directUrl = `/api/download-${osType}`;
    }
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
