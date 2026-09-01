export const handleOSDownload = (e) => {
  if (e) e.preventDefault();
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  
  // Tải từ GitHub Releases - ổn định, nhanh, không bị chặn bởi trình duyệt/antivirus
  const GITHUB_RELEASE_BASE = 'https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v2.2.0';
  
  const fileName = isMac ? 'AvaLive_VIP_PRO_Mac_v2.zip' : 'AvaLive_VIP_PRO_Windows_v2.zip';
  const fileUrl = `${GITHUB_RELEASE_BASE}/${fileName}`;
  
  // Mở tab mới để GitHub xử lý download trực tiếp - đáng tin cậy nhất
  window.open(fileUrl, '_blank');
};
