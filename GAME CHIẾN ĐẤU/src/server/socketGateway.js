/**
 * Ráp nối nguồn sự kiện (TikTokConnector hoặc DemoSimulator) với battleState
 * và đẩy trạng thái/hiệu ứng cho toàn bộ overlay client qua Socket.IO.
 * Cũng expose các hàm điều khiển thủ công (pause/resume/force end) và cập
 * nhật cài đặt runtime cho trang Admin gọi qua adminApi.js.
 */

import { resolveGiftTier, computeGiftImpact } from './giftResolver.js';
import { shouldApplyGiftEvent, getRepeatCount } from './streakGuard.js';
import { buildGiftEffectPayload } from './effectMapper.js';
import { resolveDanceForGift } from './danceResolver.js';
import { logger } from './logger.js';

function extractUser(rawUser) {
  const userId = rawUser?.userId ? String(rawUser.userId) : rawUser?.uniqueId;
  const nickname = rawUser?.nickname || rawUser?.uniqueId || null;
  const avatarUrl = rawUser?.profilePictureUrl || rawUser?.avatarThumb?.urlList?.[0] || null;
  return { userId, nickname, avatarUrl };
}

export function setupSocketGateway({ io, battleState, giftsConfig, themeConfig, source, env, ttsService }) {
  let connectionStatus = env.DEMO_MODE ? 'demo' : 'connecting';
  let matchResetTimer = null;
  let isPaused = false;
  let pauseReason = null; // 'manual' | 'schedule'
  let featureFlags = {
    bossEffectEnabled: true,
    aoeEffectEnabled: true,
    confettiEnabled: true,
    announcerEnabled: true,
    danceEnabled: true,
  };

  async function announceDonor(nickname) {
    if (!ttsService || !ttsService.isEnabled() || !featureFlags.announcerEnabled) return;
    try {
      const audioBuffer = await ttsService.synthesizeSpeech(`Cảm ơn ${nickname} đã tặng quà!`);
      if (!audioBuffer) return;
      io.emit('tts:announce', { audioBase64: audioBuffer.toString('base64'), mimeType: 'audio/mpeg' });
    } catch (error) {
      logger.error('Lỗi khi xướng tên người tặng quà (TTS)', error, { nickname });
    }
  }

  function broadcastState() {
    io.emit('state:update', { snapshot: battleState.getSnapshot(), connectionStatus, isPaused, pauseReason });
  }

  function scheduleMatchReset(delayOverrideMs) {
    if (matchResetTimer) clearTimeout(matchResetTimer);
    const delay = delayOverrideMs ?? themeConfig.battle.matchResetDelayMs;
    matchResetTimer = setTimeout(() => {
      matchResetTimer = null;
      battleState.resetMatch();
      broadcastState();
      io.emit('match:reset', {});
      logger.info('Trận mới đã bắt đầu (auto-reset)', {});
    }, delay);
  }

  function handleMatchEnd() {
    const results = battleState.getMatchResults();
    io.emit('match:ended', results);
    logger.info('Trận đấu kết thúc', { winnerFactionId: results?.winnerFactionId });
    scheduleMatchReset();
  }

  source.on('connected', (state) => {
    connectionStatus = env.DEMO_MODE ? 'demo' : 'connected';
    logger.info('Nguồn sự kiện đã kết nối', { roomId: state?.roomId, demoMode: env.DEMO_MODE });
    broadcastState();
  });

  source.on('disconnected', () => {
    connectionStatus = 'reconnecting';
    broadcastState();
  });

  source.on('connectionError', (error) => {
    logger.error('Lỗi kết nối từ nguồn sự kiện TikTok LIVE', error, {});
  });

  function handleChatComment(userId, comment, nickname, avatarUrl) {
    if (!userId || isPaused) return null;
    const assignedFaction = battleState.assignFactionByComment(userId, comment, nickname, avatarUrl);
    if (assignedFaction) broadcastState();
    return assignedFaction;
  }

  source.on('chat', (data) => {
    try {
      const { userId, nickname, avatarUrl } = extractUser(data.user);
      handleChatComment(userId, data.comment, nickname, avatarUrl);
    } catch (error) {
      logger.error('Lỗi khi xử lý sự kiện chat', error, { comment: data?.comment });
    }
  });

  source.on('like', (data) => {
    const { nickname } = extractUser(data.user);
    io.emit('viewer:activity', { type: 'like', nickname });
  });

  source.on('follow', (data) => {
    const { nickname } = extractUser(data.user);
    io.emit('viewer:activity', { type: 'follow', nickname });
  });

  source.on('share', (data) => {
    const { nickname } = extractUser(data.user);
    io.emit('viewer:activity', { type: 'share', nickname });
  });

  source.on('gift', (data) => {
    try {
      if (isPaused) return;
      if (!shouldApplyGiftEvent(data)) return; // đang giữa combo streak, chưa tới lúc áp dụng

      const { userId, nickname, avatarUrl } = extractUser(data.user);
      if (!userId) return;

      const diamondCount = data.giftDetails?.diamondCount ?? 0;
      const { tier } = resolveGiftTier(giftsConfig, diamondCount);
      if (!tier) {
        logger.warn('Không resolve được tier cho quà tặng', { diamondCount, giftId: data.giftId });
        return;
      }

      const repeatCount = getRepeatCount(data);
      const impact = computeGiftImpact(tier, repeatCount);
      const coinsSpent = diamondCount * repeatCount; // số xu TikTok thật đã tặng (đã gộp combo)
      const result = battleState.applyGiftImpact({ userId, nickname, avatarUrl, impact, coinsSpent });
      if (!result.applied) return;

      const dance = resolveDanceForGift(diamondCount);
      const payload = buildGiftEffectPayload({
        giftApplyResult: result,
        donorNickname: nickname,
        donorAvatarUrl: avatarUrl,
        tierId: tier.id,
        danceStyleId: dance.danceStyleId,
        danceDurationMs: dance.durationMs,
      });
      io.emit('gift:effect', payload);
      broadcastState();

      if (payload.spotlightDurationMs > 0 && nickname) {
        announceDonor(nickname); // fire-and-forget, tự bắt lỗi bên trong, không chặn luồng gift
      }

      if (result.matchEnded) handleMatchEnd();
    } catch (error) {
      logger.error('Lỗi khi xử lý sự kiện gift', error, { giftId: data?.giftId });
    }
  });

  io.on('connection', (socket) => {
    socket.emit('state:full', {
      snapshot: battleState.getSnapshot(),
      theme: themeConfig,
      connectionStatus,
      isPaused,
      pauseReason,
      featureFlags,
    });

    // Chỉ bật khi DEMO_MODE=true — cho phép tự gõ comment thử "xanh"/"đỏ"
    // ngay trên overlay mà không cần phòng TikTok LIVE thật đang mở.
    // Tắt hoàn toàn khi chạy live thật để không ai giả mạo comment được.
    if (env.DEMO_MODE) {
      socket.on('debug:sendComment', (payload) => {
        try {
          const comment = String(payload?.comment || '').slice(0, 200);
          const userId = `debug-${socket.id}`;
          const nickname = String(payload?.nickname || 'Ban').slice(0, 50);
          const assignedFaction = handleChatComment(userId, comment, nickname);
          socket.emit('debug:commentResult', { comment, assignedFaction });
        } catch (error) {
          logger.error('Lỗi khi xử lý comment test (debug:sendComment)', error, {});
        }
      });
    }
  });

  return {
    stop() {
      if (matchResetTimer) {
        clearTimeout(matchResetTimer);
        matchResetTimer = null;
      }
    },

    // === Điều khiển thủ công cho trang Admin (adminApi.js gọi vào đây) ===
    getStatus() {
      return {
        connectionStatus,
        isPaused,
        pauseReason,
        snapshot: battleState.getSnapshot(),
        ttsAvailable: Boolean(ttsService && ttsService.isEnabled()),
      };
    },
    pauseGame(reason = 'manual') {
      isPaused = true;
      pauseReason = reason;
      broadcastState();
      logger.info('Game đã tạm dừng', { reason });
    },
    resumeGame() {
      isPaused = false;
      pauseReason = null;
      broadcastState();
      logger.info('Game đã tiếp tục', {});
    },
    forceStartNewMatch() {
      if (matchResetTimer) {
        clearTimeout(matchResetTimer);
        matchResetTimer = null;
      }
      battleState.resetMatch();
      isPaused = false;
      pauseReason = null;
      broadcastState();
      io.emit('match:reset', {});
      logger.info('Admin đã bắt đầu trận mới thủ công', {});
    },
    forceEndMatch() {
      const ended = battleState.forceEndMatch();
      if (!ended) return false;
      handleMatchEnd();
      logger.info('Admin đã kết thúc trận thủ công', {});
      return true;
    },
    setCharacterScale(scale) {
      const parsed = Number(scale);
      if (!Number.isFinite(parsed) || parsed < 0.3 || parsed > 3) return false;
      themeConfig.battle.characterScale = parsed;
      io.emit('settings:update', { characterScale: parsed });
      return true;
    },
    setMatchResetDelayMs(ms) {
      const parsed = Number(ms);
      if (!Number.isFinite(parsed) || parsed < 1000 || parsed > 120000) return false;
      themeConfig.battle.matchResetDelayMs = parsed;
      return true;
    },
    setMaxHp(value) {
      return battleState.setMaxHp(value);
    },
    setComebackThreshold(percent) {
      return battleState.setComebackThreshold(percent);
    },
    setAudioSettings({ musicVolume, sfxVolume, muted }) {
      const payload = {};
      if (typeof musicVolume === 'number' && musicVolume >= 0 && musicVolume <= 1) payload.musicVolume = musicVolume;
      if (typeof sfxVolume === 'number' && sfxVolume >= 0 && sfxVolume <= 1) payload.sfxVolume = sfxVolume;
      if (typeof muted === 'boolean') payload.muted = muted;
      if (Object.keys(payload).length === 0) return false;
      io.emit('settings:update', payload);
      return true;
    },
    getFeatureFlags() {
      return { ...featureFlags };
    },
    setFeatureFlags({ bossEffectEnabled, aoeEffectEnabled, confettiEnabled, announcerEnabled, danceEnabled }) {
      if (typeof bossEffectEnabled === 'boolean') featureFlags.bossEffectEnabled = bossEffectEnabled;
      if (typeof aoeEffectEnabled === 'boolean') featureFlags.aoeEffectEnabled = aoeEffectEnabled;
      if (typeof confettiEnabled === 'boolean') featureFlags.confettiEnabled = confettiEnabled;
      if (typeof announcerEnabled === 'boolean') featureFlags.announcerEnabled = announcerEnabled;
      if (typeof danceEnabled === 'boolean') featureFlags.danceEnabled = danceEnabled;
      io.emit('settings:update', { featureFlags });
      return true;
    },
    setFactionAppearance(factionId, { name, color }) {
      if (!themeConfig.factions[factionId]) return false;
      const faction = themeConfig.factions[factionId];
      if (typeof name === 'string' && name.trim()) faction.name.vi = name.trim().slice(0, 30);
      if (typeof color === 'string' && /^#[0-9a-fA-F]{6}$/.test(color)) faction.color = color;
      io.emit('theme:update', themeConfig);
      return true;
    },
  };
}
