export const handleOSDownload = (e) => {
  if (e) e.preventDefault();
  // Xác định hệ điều hành
  const isMac = navigator.userAgent.toLowerCase().includes('mac');
  
  // Tên file tương ứng
  const fileName = isMac ? 'AvaLive_VIP_PRO_Mac.pkg' : 'AvaLive_VIP_PRO_Windows.zip';
  const fileUrl = `/${fileName}`;
  
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
