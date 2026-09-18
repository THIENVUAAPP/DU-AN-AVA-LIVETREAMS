/**
 * Entry point overlay — khởi tạo i18n, canvas, socket client và HUD, ráp nối
 * toàn bộ luồng: state server → HP bar/leaderboard/vinh danh/hiệu ứng canvas.
 */

import { initI18n, getUiText } from './js/i18n.js';
import { BattlefieldRenderer } from './js/renderer/battlefieldRenderer.js';
import { createSocketClient } from './js/socket-client.js';
import { bindFactionTheme, updateHpBar, flashHpBar, showComebackBadge } from './js/hud/hpBar.js';
import { updateLeaderboard } from './js/hud/leaderboard.js';
import { showResultsScreen, hideResultsScreen } from './js/hud/resultsScreen.js';
import { showDonorSpotlight } from './js/hud/donorSpotlight.js';
import { audioManager } from './js/audio.js';

let themeConfig = null;
let featureFlags = { bossEffectEnabled: true, aoeEffectEnabled: true, confettiEnabled: true, danceEnabled: true };

function resizeCanvasToViewport() {
  const canvas = document.getElementById('battlefield-canvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function updateConnectionStatusBadge(status, isPaused, pauseReason) {
  const badge = document.getElementById('connection-status');
  const text = document.getElementById('connection-status-text');
  if (!badge || !text) return;

  const effectiveStatus = isPaused ? (pauseReason === 'schedule' ? 'outsideSchedule' : 'paused') : status;
  badge.dataset.status = effectiveStatus;
  const statusKeyByValue = {
    connecting: 'connectingStatus',
    connected: 'connectedStatus',
    reconnecting: 'reconnectingStatus',
    demo: 'demoModeStatus',
    paused: 'pausedStatus',
    outsideSchedule: 'outsideScheduleStatus',
  };
  text.textContent = getUiText(statusKeyByValue[effectiveStatus] || 'connectingStatus');

  const debugPanel = document.getElementById('debug-comment-panel');
  if (debugPanel) debugPanel.hidden = status !== 'demo';
}

function applyGiftEffectToRenderer(renderer, payload) {
  if (payload.userId) renderer.pulseFighter(payload.userId);

  if (payload.effect === 'aoeSkill') {
    if (featureFlags.aoeEffectEnabled) renderer.spawnAoe(payload.opponentFactionId, payload.factionId);
    audioManager.playSfx('aoe');
  } else if (payload.effect === 'summonBoss') {
    if (featureFlags.bossEffectEnabled) renderer.spawnBoss(payload.factionId);
    audioManager.playSfx('boss');
  } else {
    audioManager.playSfx('joinSmall');
  }

  if (payload.opponentDamage > 0) flashHpBar(payload.opponentFactionId);
  if (payload.ownFactionHeal > 0) flashHpBar(payload.factionId);
  if (payload.isComeback) showComebackBadge(payload.factionId);
  if (payload.spotlightDurationMs > 0) showDonorSpotlight(payload);

  if (featureFlags.danceEnabled && payload.danceStyleId && payload.userId) {
    renderer.startDance({
      userId: payload.userId,
      nickname: payload.donorNickname,
      factionId: payload.factionId,
      danceStyleId: payload.danceStyleId,
      durationMs: payload.danceDurationMs,
    });
  }
}

/** Chỉ hoạt động ở Demo Mode — cho phép tự gõ comment thử "xanh"/"đỏ" ngay
 * trên overlay mà không cần phòng TikTok LIVE thật đang mở. */
function setupDebugCommentPanel(socketClient) {
  const panel = document.getElementById('debug-comment-panel');
  const input = document.getElementById('debug-comment-input');
  const feedback = document.getElementById('debug-comment-feedback');
  if (!panel || !input || !feedback) return;

  panel.addEventListener('submit', (event) => {
    event.preventDefault();
    const comment = input.value.trim();
    if (!comment) return;
    socketClient.sendDebugComment(comment);
    input.value = '';
  });

  socketClient.onDebugCommentResult(({ comment, assignedFaction }) => {
    if (assignedFaction && themeConfig) {
      const lang = document.documentElement.lang === 'en' ? 'en' : 'vi';
      const factionName = themeConfig.factions[assignedFaction]?.name?.[lang] || assignedFaction;
      feedback.textContent = `"${comment}" → ${factionName}`;
    } else {
      feedback.textContent = `"${comment}" → không nhận diện phe`;
    }
  });
}

/** Chỉ chạy khi có ?simulate=1 trên URL — công cụ dev để xem hoạt ảnh canvas
 * độc lập với server/socket thật, không dùng khi chạy live. */
function startDevSimulation(renderer) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('simulate') !== '1') return;

  const fakeNames = ['vien_gamer', 'minh_tiktok', 'an_nguyen', 'hoa_le', 'duc_pham', 'linh_vu'];
  const fakeFighters = { blue: [], red: [] };

  setInterval(() => {
    const factionId = Math.random() < 0.5 ? 'blue' : 'red';
    const roll = Math.random();

    if (roll < 0.55) {
      const nickname = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const userId = `sim-${nickname}`;
      const list = fakeFighters[factionId];
      const existing = list.find((f) => f.userId === userId);
      if (existing) existing.score += Math.floor(Math.random() * 50);
      else list.push({ userId, nickname, score: Math.floor(Math.random() * 50) });
      list.sort((a, b) => b.score - a.score);
      renderer.syncFighters(factionId, list.slice(0, 24));
      renderer.pulseFighter(userId);
    } else if (roll < 0.75) {
      renderer.spawnAoe(factionId === 'blue' ? 'red' : 'blue', factionId);
    } else if (roll < 0.85) {
      renderer.spawnBoss(factionId);
    } else {
      const nickname = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const userId = `sim-${nickname}`;
      const danceStyleId = 1 + Math.floor(Math.random() * 20);
      const durationMs = 3000 + Math.floor(Math.random() * 7000);
      renderer.startDance({ userId, nickname, factionId, danceStyleId, durationMs });
    }
  }, 500);
}

async function main() {
  await initI18n('vi');

  const canvas = document.getElementById('battlefield-canvas');
  const renderer = new BattlefieldRenderer(canvas);
  resizeCanvasToViewport();
  window.addEventListener('resize', resizeCanvasToViewport);
  renderer.start();
  startDevSimulation(renderer);

  await audioManager.loadConfig();
  audioManager.startBackgroundMusic();

  const socketClient = createSocketClient();
  setupDebugCommentPanel(socketClient);

  socketClient.onStateFull(({ snapshot, theme, connectionStatus, isPaused, pauseReason, featureFlags: incomingFlags }) => {
    themeConfig = theme;
    if (incomingFlags) featureFlags = incomingFlags;
    bindFactionTheme(themeConfig);
    renderer.setFactionColor('blue', themeConfig.factions.blue.color);
    renderer.setFactionColor('red', themeConfig.factions.red.color);
    renderer.setCharacterScale(themeConfig.battle.characterScale || 1);
    updateHpBar(snapshot);
    updateLeaderboard(snapshot, themeConfig);
    renderer.syncFighters('blue', snapshot.fighters?.blue);
    renderer.syncFighters('red', snapshot.fighters?.red);
    updateConnectionStatusBadge(connectionStatus, isPaused, pauseReason);
  });

  socketClient.onThemeUpdate((theme) => {
    themeConfig = theme;
    bindFactionTheme(themeConfig);
    renderer.setFactionColor('blue', themeConfig.factions.blue.color);
    renderer.setFactionColor('red', themeConfig.factions.red.color);
  });

  socketClient.onStateUpdate(({ snapshot, connectionStatus, isPaused, pauseReason }) => {
    updateHpBar(snapshot);
    if (themeConfig) updateLeaderboard(snapshot, themeConfig);
    renderer.syncFighters('blue', snapshot.fighters?.blue);
    renderer.syncFighters('red', snapshot.fighters?.red);
    updateConnectionStatusBadge(connectionStatus, isPaused, pauseReason);
  });

  socketClient.onGiftEffect((payload) => {
    if (!payload) return;
    applyGiftEffectToRenderer(renderer, payload);
  });

  socketClient.onMatchEnded((results) => {
    if (!themeConfig || !results) return;
    const resetDelayMs = themeConfig.battle.matchResetDelayMs;
    showResultsScreen(results, themeConfig, resetDelayMs);
    if (featureFlags.confettiEnabled) renderer.celebrateVictory(results.winnerFactionId);
    audioManager.playSfx('victory');
  });

  socketClient.onMatchReset(() => {
    hideResultsScreen();
    renderer.resetBattlefield();
  });

  socketClient.onTtsAnnounce(({ audioBase64, mimeType }) => {
    audioManager.playAnnouncerClip(audioBase64, mimeType);
  });

  socketClient.onSettingsUpdate((settings) => {
    if (typeof settings.characterScale === 'number') {
      renderer.setCharacterScale(settings.characterScale);
    }
    if (typeof settings.musicVolume === 'number') audioManager.setMusicVolume(settings.musicVolume);
    if (typeof settings.sfxVolume === 'number') audioManager.setSfxVolume(settings.sfxVolume);
    if (typeof settings.muted === 'boolean') audioManager.setMuted(settings.muted);
    if (settings.featureFlags) featureFlags = { ...featureFlags, ...settings.featureFlags };
  });
}

main().catch((error) => {
  console.error('[game.js] Lỗi khởi tạo overlay:', error);
});
