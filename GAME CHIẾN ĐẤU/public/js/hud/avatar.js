/**
 * Tạo phần tử avatar tròn dùng chung cho leaderboard + màn vinh danh. Có
 * avatar thật (từ TikTok) thì hiện ảnh, viền theo màu phe; không có (demo
 * mode, hoặc ảnh lỗi) thì fallback vòng tròn màu phe + chữ cái đầu tên —
 * không bao giờ để trống/vỡ ảnh.
 */

export function createAvatarElement(avatarUrl, nickname, factionColor, sizePx = 22) {
  const wrapper = document.createElement('span');
  wrapper.className = 'avatar-circle';
  wrapper.style.width = `${sizePx}px`;
  wrapper.style.height = `${sizePx}px`;
  wrapper.style.borderColor = factionColor || 'rgba(255,255,255,0.4)';

  function appendFallback() {
    const fallback = document.createElement('span');
    fallback.className = 'avatar-fallback';
    fallback.style.background = factionColor || '#555';
    fallback.style.fontSize = `${Math.max(9, sizePx * 0.5)}px`;
    fallback.textContent = String(nickname || '?').trim().charAt(0).toUpperCase() || '?';
    wrapper.appendChild(fallback);
  }

  if (avatarUrl) {
    const img = document.createElement('img');
    img.src = avatarUrl;
    img.alt = '';
    img.className = 'avatar-img';
    img.onerror = () => {
      img.remove();
      appendFallback();
    };
    wrapper.appendChild(img);
  } else {
    appendFallback();
  }

  return wrapper;
}
