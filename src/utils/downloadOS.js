import { APP_VERSION } from '../components/genaidol/UpdateNotificationModal';

export const handleOSDownload = (e) => {
  if (e && e.preventDefault) e.preventDefault();
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  const osName = isMac ? 'Apple macOS' : 'Microsoft Windows';
  
  // Tải từ GitHub Releases - vì dung lượng >200MB không thể chứa trên Vercel
  const GITHUB_RELEASE_BASE = `https://github.com/THIENVUAAPP/DU-AN-AVA-LIVETREAMS/releases/download/v${APP_VERSION}`;
  
  const fileName = isMac ? `AvaLive_VIP_PRO_Mac_v${APP_VERSION}.zip` : `AvaLive_VIP_PRO_Windows_v${APP_VERSION}.zip`;
  const fileUrl = `${GITHUB_RELEASE_BASE}/${fileName}`;
  
  // Thông báo rõ ràng phiên bản đang tải về
  alert(`🚀 ĐANG BẮT ĐẦU TẢI XUỐNG AVALIVE LIVESTREAM VIP PRO\n\n📌 Phiên bản phần mềm: v${APP_VERSION} (Mới Nhất)\n💻 Hệ điều hành nhận diện: ${osName}\n📁 Tên file: ${fileName}\n\n👉 Trình duyệt sẽ tự động tải file ZIP về máy. Sau khi tải xong, hãy bấm chuột phải chọn 'Extract All' (Giải nén) để mở phần mềm sử dụng ngay nhé!`);
  
  window.open(fileUrl, '_blank');
};
