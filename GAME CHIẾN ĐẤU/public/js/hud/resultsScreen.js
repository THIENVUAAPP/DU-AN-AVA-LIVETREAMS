/**
 * Màn vinh danh đội chiến thắng kiểu bục nhận cúp: MVP (người ủng hộ nhiều
 * nhất) nổi bật với cúp, tên cả đội thắng hiển thị giữa màn hình, đếm ngược
 * tự reset. Thuần hiển thị/ăn mừng — không có thưởng/phạt thật.
 */

import { getUiText } from '../i18n.js';
import { createAvatarElement } from './avatar.js';

let countdownInterval = null;

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'vi';
}

export function showResultsScreen(results, themeConfig, resetDelayMs) {
  if (!results) return;
  const lang = currentLang();
  const winnerFaction = themeConfig.factions[results.winnerFactionId];
  const winnerName = winnerFaction?.name?.[lang] || results.winnerFactionId;
  const winnerColor = winnerFaction?.color || '#ffcc33';

  const badge = document.getElementById('ceremony-winner-badge');
  badge.textContent = `🏆 ${getUiText('ceremonyWinnerTitle')}: ${winnerName}`;
  badge.style.color = winnerColor;

  const mvpBlock = document.getElementById('ceremony-mvp-block');
  const mvpAvatarSlot = document.getElementById('ceremony-mvp-avatar-slot');
  mvpAvatarSlot.innerHTML = '';
  if (results.mvp) {
    mvpBlock.hidden = false;
    mvpAvatarSlot.appendChild(createAvatarElement(results.mvp.avatarUrl, results.mvp.nickname, winnerColor, 64));
    document.getElementById('ceremony-mvp-name').textContent = results.mvp.nickname;
    document.getElementById('ceremony-mvp-label-text').textContent = getUiText('ceremonyMvpLabel');
    document.getElementById('ceremony-mvp-score').textContent = `${results.mvp.score}`;
  } else {
    mvpBlock.hidden = true;
  }

  const teamListEl = document.getElementById('ceremony-team-list');
  teamListEl.innerHTML = '';
  for (const fighter of results.winningTeam || []) {
    const pill = document.createElement('span');
    pill.className = 'ceremony-member-pill';
    pill.appendChild(createAvatarElement(fighter.avatarUrl, fighter.nickname, winnerColor, 18));
    const nameSpan = document.createElement('span');
    nameSpan.textContent = fighter.nickname;
    pill.appendChild(nameSpan);
    teamListEl.appendChild(pill);
  }

  document.getElementById('ceremony-member-count').textContent =
    `${results.winningTeamTotalCount ?? 0} ${getUiText('ceremonyMemberCountSuffix')}`;

  const losingFactionId = Object.keys(themeConfig.factions).find((id) => id !== results.winnerFactionId);
  const losingFaction = themeConfig.factions[losingFactionId];
  document.getElementById('ceremony-losing-note').textContent =
    `${getUiText('ceremonyLosingSideLabel')}: ${losingFaction?.name?.[lang] || losingFactionId}`;

  document.getElementById('results-screen').classList.add('visible');

  let secondsLeft = Math.round(resetDelayMs / 1000);
  const countdownEl = document.getElementById('results-countdown-seconds');
  countdownEl.textContent = secondsLeft;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    secondsLeft -= 1;
    countdownEl.textContent = Math.max(secondsLeft, 0);
    if (secondsLeft <= 0) clearInterval(countdownInterval);
  }, 1000);
}

export function hideResultsScreen() {
  document.getElementById('results-screen').classList.remove('visible');
  clearInterval(countdownInterval);
  countdownInterval = null;
}
