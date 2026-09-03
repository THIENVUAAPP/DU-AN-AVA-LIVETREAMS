import { APP_VERSION } from '../components/genaidol/UpdateNotificationModal';

export const handleOSDownload = (e) => {
  if (e) e.preventDefault();
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  
  const fileName = isMac ? `AvaLive_VIP_PRO_Mac_v${APP_VERSION}.zip` : `AvaLive_VIP_PRO_Windows_v${APP_VERSION}.zip`;
  
  // Tải trực tiếp từ máy chủ web hiện tại (đã được tự động chép vào thư mục public/dist khi đóng gói)
  const fileUrl = `/${fileName}`;
  
  window.open(fileUrl, '_blank');
};
