/**
 * Bảng "Top Ủng Hộ" real-time — thuần ghi nhận đóng góp, không kèm hối thúc.
 */

import { getUiText } from '../i18n.js';
import { createAvatarElement } from './avatar.js';

export function updateLeaderboard(snapshot, themeConfig) {
  const list = document.getElementById('leaderboard-list');
  const { leaderboard } = snapshot;
  list.innerHTML = '';

  if (!leaderboard.length) {
    const empty = document.createElement('li');
    empty.className = 'leaderboard-empty';
    empty.textContent = getUiText('noSupportersYet');
    list.appendChild(empty);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'leaderboard-item fade-in';

    const rank = document.createElement('span');
    rank.className = 'leaderboard-rank';
    rank.textContent = `#${index + 1}`;

    const factionColor = themeConfig.factions[entry.factionId]?.color || '#ffffff';
    const avatar = createAvatarElement(entry.avatarUrl, entry.nickname, factionColor, 22);

    const name = document.createElement('span');
    name.className = 'leaderboard-name';
    name.textContent = entry.nickname;

    const score = document.createElement('span');
    score.className = 'leaderboard-score';
    score.textContent = entry.score;

    item.append(rank, avatar, name, score);
    list.appendChild(item);
  });
}
