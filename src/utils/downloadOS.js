export const handleOSDownload = (e) => {
  if (e) e.preventDefault();
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  
  const fileName = isMac ? 'AvaLive_VIP_PRO_Mac.zip' : 'AvaLive_VIP_PRO_Windows.zip';
  const fileUrl = `/${fileName}`;
  
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
