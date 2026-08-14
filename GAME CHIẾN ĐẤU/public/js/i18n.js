/**
 * Tải file i18n/{lang}.json và bind text tĩnh vào các phần tử HUD.
 * Ngôn ngữ chọn qua query string ?lang=vi|en, mặc định lấy từ server.
 */

let currentUi = null;

export function detectLang(defaultLang = 'vi') {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('lang');
  return requested === 'en' || requested === 'vi' ? requested : defaultLang;
}

async function fetchI18n(lang) {
  const response = await fetch(`/i18n/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Không tải được i18n cho ngôn ngữ "${lang}" (HTTP ${response.status})`);
  }
  return response.json();
}

function bindText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el && text) el.textContent = text;
}

function applyStaticI18n(ui) {
  bindText('connection-status-text', ui.connectingStatus);
  bindText('leaderboard-title-text', ui.leaderboardTitle);
  bindText('leaderboard-empty-text', ui.noSupportersYet);
  bindText('donor-spotlight-thanks-text', ui.donorSpotlightThanks);
  bindText('pick-side-hint-text', ui.pickSideHint);
  bindText('results-title-text', ui.resultsTitle);
  bindText('results-countdown-prefix-text', ui.nextMatchPrefix);
  bindText('results-countdown-suffix-text', ui.secondsSuffix);
  bindText('vs-label', ui.vsLabel);
}

export async function initI18n(defaultLang = 'vi') {
  const lang = detectLang(defaultLang);
  try {
    const data = await fetchI18n(lang);
    currentUi = data.ui;
  } catch (error) {
    console.error('[i18n] Lỗi tải ngôn ngữ, fallback về vi:', error);
    const fallback = await fetchI18n('vi');
    currentUi = fallback.ui;
  }
  document.documentElement.lang = lang;
  applyStaticI18n(currentUi);
  return currentUi;
}

export function getUiText(key) {
  return currentUi?.[key] ?? key;
}
