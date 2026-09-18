/**
 * Thanh HP tổng 2 phe + tên/màu phe theo theme.json + comeback badge nhẹ.
 */

import { getUiText } from '../i18n.js';

const comebackBadgeTimers = { blue: null, red: null };

function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'vi';
}

export function bindFactionTheme(themeConfig) {
  const { factions, gameTitle } = themeConfig;
  const lang = currentLang();

  document.documentElement.style.setProperty('--faction-blue-color', factions.blue.color);
  document.documentElement.style.setProperty('--faction-red-color', factions.red.color);

  document.getElementById('faction-name-blue').textContent = factions.blue.name[lang] || factions.blue.name.vi;
  document.getElementById('faction-name-red').textContent = factions.red.name[lang] || factions.red.name.vi;
  document.getElementById('game-title-text').textContent = gameTitle;
  document.title = `${gameTitle} — TikTok LIVE Overlay`;
}

export function updateHpBar(snapshot) {
  const { hp, maxHp } = snapshot;
  const bluePercent = Math.max(0, Math.min(100, (hp.blue / maxHp) * 100));
  const redPercent = Math.max(0, Math.min(100, (hp.red / maxHp) * 100));

  document.getElementById('hp-fill-blue').style.width = `${bluePercent}%`;
  document.getElementById('hp-fill-red').style.width = `${redPercent}%`;
  document.getElementById('hp-value-blue').textContent = `${Math.round(hp.blue)} / ${maxHp}`;
  document.getElementById('hp-value-red').textContent = `${Math.round(hp.red)} / ${maxHp}`;
}

export function flashHpBar(factionId) {
  const fill = document.getElementById(`hp-fill-${factionId}`);
  if (!fill) return;
  fill.classList.add('flash');
  setTimeout(() => fill.classList.remove('flash'), 220);
}

export function showComebackBadge(factionId) {
  const label = document.getElementById(`faction-name-${factionId}`);
  if (!label || label.querySelector('.comeback-badge')) return;

  const badge = document.createElement('span');
  badge.className = 'comeback-badge';
  badge.textContent = `⚡ ${getUiText('comebackBadge')}`;
  label.appendChild(badge);

  clearTimeout(comebackBadgeTimers[factionId]);
  comebackBadgeTimers[factionId] = setTimeout(() => badge.remove(), 3000);
}
