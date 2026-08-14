/**
 * Spotlight người tặng quà lớn: hiện avatar + tên trong spotlightDurationMs
 * rồi tự ẩn. Thuần ăn mừng — không dừng game, không hiệu ứng giật gân.
 */

let spotlightTimer = null;

export function showDonorSpotlight(payload) {
  if (!payload.spotlightDurationMs) return;

  const panel = document.getElementById('donor-spotlight');
  const avatar = document.getElementById('donor-spotlight-avatar');
  const nameEl = document.getElementById('donor-spotlight-name');

  if (payload.donorAvatarUrl) {
    avatar.src = payload.donorAvatarUrl;
    avatar.style.visibility = 'visible';
  } else {
    avatar.style.visibility = 'hidden';
  }
  nameEl.textContent = payload.donorNickname || '—';

  panel.classList.add('visible');
  clearTimeout(spotlightTimer);
  spotlightTimer = setTimeout(() => panel.classList.remove('visible'), payload.spotlightDurationMs);
}
