import { APP_VERSION } from '../components/genaidol/UpdateNotificationModal';

export const handleOSDownload = (e) => {
  if (e) e.preventDefault();
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  
  // Tải từ GitHub Releases - vì dung lượng >200MB không thể chứa trên Vercel
  const GITHUB_RELEASE_BASE = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${APP_VERSION}`;
  
  const fileName = isMac ? `AvaLive_VIP_PRO_Mac_v${APP_VERSION}.zip` : `AvaLive_VIP_PRO_Windows_v${APP_VERSION}.zip`;
  const fileUrl = `${GITHUB_RELEASE_BASE}/${fileName}`;
  
  window.open(fileUrl, '_blank');
};
