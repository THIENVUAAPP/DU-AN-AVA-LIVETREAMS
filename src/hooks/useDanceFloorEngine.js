import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DANCE_CHARACTERS,
  DANCE_STYLES,
  DANCE_EFFECTS,
  SCENE_BACKGROUNDS,
  OUTFITS,
  DEFAULT_KEYWORD_RULES,
  GIFT_TIERS,
  GIFT_POINT_MAPPING,
  DANCE_SOUNDS,
  DEFAULT_SETTINGS,
  REACTION_LINES,
  GIFT_THANK_LINES,
  AUTO_REPLY_RULES,
  COMMENTARY_STYLES,
} from '../lib/danceFloorData';
import {
  matchTriggerRule,
  matchCharacterByCallName,
  matchAutoReply,
  pickReactionLine,
  convertGiftToPoints,
  resolveGiftTier,
  createCooldownState,
  canUserTrigger,
  recordUserTrigger,
  admitQueueToStage,
  buildUnifiedEvent,
  isWithinSchedule,
  filterEnabled,
  buildRandomCombo,
} from '../lib/danceFloorEngine';
import { loadLiveChannels } from '../lib/platformChannels';
import { speakLine } from '../lib/voiceEngine';
import { simulatedCustomers, simulatedAvatars, simulatedQuestions } from '../lib/aiSimulationData';
import { useYouTubeLiveChatBridge } from './useYouTubeLiveChatBridge';

const RULES_KEY = 'avalive_dancefloor_rules';
const TIERS_KEY = 'avalive_dancefloor_tiers';
const SETTINGS_KEY = 'avalive_dancefloor_settings';
const CUSTOM_CHARACTERS_KEY = 'avalive_dancefloor_custom_characters';
const AUTO_REPLY_KEY = 'avalive_dancefloor_auto_replies';
const BROADCAST_CHANNEL_NAME = 'avalive_dancefloor_stage';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`loadJSON(${key}) lỗi:`, e);
  }
  return fallback;
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`saveJSON(${key}) lỗi:`, e);
  }
}
function platformFromChannelId(id) {
  if (!id) return 'tiktok';
  if (id.startsWith('tiktok')) return 'tiktok';
  if (id.startsWith('youtube')) return 'youtube';
  if (id.startsWith('facebook')) return 'facebook';
  return 'tiktok';
}
const LIBRARY_SETTING_KEY = {
  character: 'disabledCharacterIds',
  dance: 'disabledDanceIds',
  effect: 'disabledEffectIds',
  scene: 'disabledSceneIds',
};

// Toàn bộ orchestration của "Sàn Nhảy TikTok": state, pipeline Ingestion→Gọi Tên/Rule→Auto-Reply→
// Gift-Tier→Queue→Render, mô phỏng realtime, cầu nối YouTube thật, giọng đọc, Auto-Shuffle, lịch 24/7,
// và đồng bộ sang cửa sổ Overlay qua BroadcastChannel. Tách khỏi JSX để mỗi file dưới 500 dòng.
export function useDanceFloorEngine() {
  const [rules, setRules] = useState(() => loadJSON(RULES_KEY, DEFAULT_KEYWORD_RULES));
  const [giftTiers, setGiftTiers] = useState(() => loadJSON(TIERS_KEY, GIFT_TIERS));
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) }));
  const [customCharacters, setCustomCharacters] = useState(() => loadJSON(CUSTOM_CHARACTERS_KEY, []));
  const [autoReplyRules, setAutoReplyRules] = useState(() => loadJSON(AUTO_REPLY_KEY, AUTO_REPLY_RULES));
  // Nhạc thật do admin tải lên (mp3 trend, cả bài) — chỉ giữ trong phiên hiện tại (blob URL không
  // sống sót qua lần tải lại trang và file nhạc quá lớn để lưu localStorage).
  const [customSounds, setCustomSounds] = useState([]);

  const allCharacters = useMemo(() => [...DANCE_CHARACTERS, ...customCharacters], [customCharacters]);
  const allSounds = useMemo(() => [...DANCE_SOUNDS, ...customSounds], [customSounds]);
  const enabledCharacters = useMemo(
    () => filterEnabled(allCharacters, settings.disabledCharacterIds),
    [allCharacters, settings.disabledCharacterIds]
  );

  const [instances, setInstances] = useState([]);
  const [effectTriggers, setEffectTriggers] = useState([]);
  const [sceneId, setSceneId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reactionFeed, setReactionFeed] = useState([]);

  const [connectedChannels, setConnectedChannels] = useState(() => loadLiveChannels());
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);

  const [commentsPerMin, setCommentsPerMin] = useState(0);
  const [triggersPerMin, setTriggersPerMin] = useState(0);

  const cooldownStateRef = useRef(createCooldownState());
  const commentTimestampsRef = useRef([]);
  const triggerTimestampsRef = useRef([]);
  const audioCtxRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  useEffect(() => saveJSON(RULES_KEY, rules), [rules]);
  useEffect(() => saveJSON(TIERS_KEY, giftTiers), [giftTiers]);
  useEffect(() => saveJSON(SETTINGS_KEY, settings), [settings]);
  useEffect(() => saveJSON(AUTO_REPLY_KEY, autoReplyRules), [autoReplyRules]);
  // Video nhân vật (isSessionOnly) dùng blob URL, không sống sót qua lần tải lại trang → không lưu.
  useEffect(() => saveJSON(CUSTOM_CHARACTERS_KEY, customCharacters.filter((c) => !c.isSessionOnly)), [customCharacters]);

  // Đồng bộ kênh đã kết nối từ tab "Restream Đa Nền Tảng" — cùng 1 SPA nên localStorage không tự bắn
  // sự kiện 'storage' cùng tab, phải poll định kỳ để bắt trạng thái kết nối mới nhất.
  useEffect(() => {
    const interval = setInterval(() => setConnectedChannels(loadLiveChannels()), 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const connectedIds = connectedChannels.filter((c) => c.status === 'connected').map((c) => c.id);
    setSelectedChannelIds((prev) => {
      const stillValid = prev.filter((id) => connectedIds.includes(id));
      return stillValid.length > 0 ? stillValid : connectedIds;
    });
  }, [connectedChannels]);

  // Dọn nhân vật hết giờ + cập nhật thống kê realtime mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setInstances((prev) => prev.filter((inst) => now - inst.startTime < inst.durationMs));
      commentTimestampsRef.current = commentTimestampsRef.current.filter((t) => now - t < 60000);
      triggerTimestampsRef.current = triggerTimestampsRef.current.filter((t) => now - t < 60000);
      setCommentsPerMin(commentTimestampsRef.current.length);
      setTriggersPerMin(triggerTimestampsRef.current.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cửa Sổ Overlay Trong Suốt lắng nghe kênh này để phản chiếu đúng sàn diễn thời gian thực.
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return undefined;
    broadcastChannelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    return () => broadcastChannelRef.current?.close();
  }, []);
  useEffect(() => {
    broadcastChannelRef.current?.postMessage({
      instances, effectTriggers, sceneId, maxSlots: settings.maxSlots,
      customBackgroundImage: settings.customBackgroundImage, allCharacters,
    });
  }, [instances, effectTriggers, sceneId, settings.maxSlots, settings.customBackgroundImage, allCharacters]);

  const playSound = useCallback(
    (soundId) => {
      if (!settings.soundEnabled) return;
      const customSound = customSounds.find((s) => s.id === soundId);
      if (customSound) {
        try {
          new Audio(customSound.audioUrl).play().catch((e) => console.error('Phát nhạc tải lên lỗi:', e));
        } catch (e) {
          console.error('playSound (custom) lỗi:', e);
        }
        return;
      }
      const sound = DANCE_SOUNDS.find((s) => s.id === soundId);
      if (!sound) return;
      try {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = sound.waveform;
        osc.frequency.value = sound.frequency;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } catch (e) {
        console.error('playSound lỗi:', e);
      }
    },
    [settings.soundEnabled, customSounds]
  );

  const addCustomSound = useCallback((file) => {
    setCustomSounds((prev) => [...prev, { id: `custom_sound_${Date.now()}`, name: file.name, audioUrl: URL.createObjectURL(file), isSessionOnly: true }]);
  }, []);

  const pushReaction = useCallback(
    (entry) => {
      setReactionFeed((prev) =>
        [{ id: `rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now(), ...entry }, ...prev].slice(0, 30)
      );
      if (settings.voiceEnabled && entry.line) speakLine(entry.line, entry.personality || 'funny');
    },
    [settings.voiceEnabled]
  );

  // Chọn câu "giọng người dẫn" (auto-reply/gift-thank) — chịu ảnh hưởng của Phong Cách Bình Luận
  // phiên hiện tại, KHÔNG đổi tính cách gốc của từng nhân vật cụ thể.
  const pickAnnouncerLine = useCallback(
    (genericPool, username) => {
      const style = COMMENTARY_STYLES.find((s) => s.id === settings.commentaryStyleId);
      if (style?.biasPersonalities?.length > 0 && Math.random() < 0.6) {
        const personality = style.biasPersonalities[Math.floor(Math.random() * style.biasPersonalities.length)];
        return { line: pickReactionLine(personality, username, REACTION_LINES, genericPool), personality };
      }
      return { line: pickReactionLine('__generic__', username, {}, genericPool), personality: 'funny' };
    },
    [settings.commentaryStyleId]
  );

  const spawnCharacters = useCallback(
    ({ characterIds, danceIds, effectId, soundId, sceneIdToApply, durationSeconds, priority, username, count, reactionLine, outfitId }) => {
      const now = Date.now();
      let resolvedSoundId = soundId;

      if (count > 0 && characterIds && characterIds.length > 0) {
        const newInstances = Array.from({ length: count }).map((_, i) => {
          const characterId = characterIds[Math.floor(Math.random() * characterIds.length)];
          return {
            instanceId: `inst_${now}_${Math.random().toString(36).slice(2, 8)}_${i}`,
            characterId,
            danceId: danceIds && danceIds.length > 0 ? danceIds[Math.floor(Math.random() * danceIds.length)] : null,
            outfitId: outfitId || OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id,
            username,
            startTime: now,
            durationMs: durationSeconds * 1000,
            priority,
            enqueuedAt: now + i,
            reactionLine: reactionLine || '',
          };
        });
        if (!resolvedSoundId) {
          const firstCharacter = allCharacters.find((c) => c.id === newInstances[0].characterId);
          resolvedSoundId = firstCharacter?.signatureSoundId || null;
        }
        setInstances((prev) => {
          const { instances: next } = admitQueueToStage(newInstances, prev, settings.maxSlots, now);
          return next;
        });
      }

      if (effectId) setEffectTriggers((prev) => [...prev.slice(-40), { id: `fx_${now}_${Math.random().toString(36).slice(2, 6)}`, effectId }]);
      if (sceneIdToApply) setSceneId(sceneIdToApply);
      if (resolvedSoundId) playSound(resolvedSoundId);
    },
    [settings.maxSlots, playSound, allCharacters]
  );

  const processEvent = useCallback(
    (event) => {
      const now = Date.now();

      if (event.type === 'gift') {
        const points = convertGiftToPoints(event.platform, event.message, event.value, GIFT_POINT_MAPPING);
        setLeaderboard((prev) => {
          const existing = prev.find((l) => l.userId === event.userId);
          const updated = existing
            ? prev.map((l) => (l.userId === event.userId ? { ...l, points: l.points + points } : l))
            : [...prev, { userId: event.userId, username: event.username, points }];
          return updated.sort((a, b) => b.points - a.points).slice(0, 8);
        });

        const tier = resolveGiftTier(points, giftTiers);
        const tierCharacterIds = tier.characterIds.filter((id) => !settings.disabledCharacterIds.includes(id));
        const finalCharacterIds = tierCharacterIds.length > 0 ? tierCharacterIds : tier.characterIds;
        const guessedCharacter = allCharacters.find((c) => c.id === finalCharacterIds[0]);
        const { line: thankLine, personality: thankPersonality } = pickAnnouncerLine(GIFT_THANK_LINES, event.username);
        triggerTimestampsRef.current.push(now);
        pushReaction({ username: event.username, characterName: guessedCharacter?.name || tier.name, line: thankLine, platform: event.platform, personality: thankPersonality });

        spawnCharacters({
          characterIds: finalCharacterIds,
          danceIds: tier.danceIds,
          effectId: tier.effectIds[Math.floor(Math.random() * tier.effectIds.length)],
          soundId: tier.soundId,
          sceneIdToApply: tier.customization?.sceneChoice ? SCENE_BACKGROUNDS[Math.floor(Math.random() * SCENE_BACKGROUNDS.length)].id : null,
          durationSeconds: tier.durationSeconds,
          priority: 10, // Gift luôn có độ ưu tiên cao nhất, thắng mọi comment thường
          username: event.username,
          count: 1,
          reactionLine: thankLine,
        });
        return;
      }

      if (event.type !== 'comment') return;
      commentTimestampsRef.current.push(now);

      // 1) Gọi tên nhân vật trực tiếp — ưu tiên trước bảng luật từ khoá tâm trạng
      const calledCharacter = matchCharacterByCallName(event.message, enabledCharacters);
      if (calledCharacter) {
        const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, settings.cooldownSecondsDefault, settings.maxTriggersPerUserPerMinute);
        if (!cooldownCheck.allowed) return;
        recordUserTrigger(cooldownStateRef.current, event.userId, now);
        triggerTimestampsRef.current.push(now);

        const line = pickReactionLine(calledCharacter.personality, event.username, REACTION_LINES, REACTION_LINES.funny);
        pushReaction({ username: event.username, characterName: calledCharacter.name, line, platform: event.platform, personality: calledCharacter.personality });

        spawnCharacters({
          characterIds: [calledCharacter.id], danceIds: null, effectId: null, soundId: null, sceneIdToApply: null,
          durationSeconds: 8, priority: 3, username: event.username, count: 1, reactionLine: line,
        });
        return;
      }

      // 2) Bảng luật từ khoá tâm trạng (hey/fire/vip...)
      const rule = matchTriggerRule(event.message, rules, event.platform);
      if (rule) {
        const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, rule.cooldownSec, settings.maxTriggersPerUserPerMinute);
        if (!cooldownCheck.allowed) return;
        recordUserTrigger(cooldownStateRef.current, event.userId, now);
        triggerTimestampsRef.current.push(now);

        const ruleCharacter = allCharacters.find((c) => c.id === rule.characterId);
        const ruleLine = pickReactionLine(ruleCharacter?.personality || 'funny', event.username, REACTION_LINES, REACTION_LINES.funny);
        pushReaction({ username: event.username, characterName: ruleCharacter?.name || `Hiệu ứng "${rule.keyword.toUpperCase()}"`, line: ruleLine, platform: event.platform, personality: ruleCharacter?.personality || 'funny' });

        spawnCharacters({
          characterIds: rule.spawnsCharacter && rule.characterId ? [rule.characterId] : [],
          danceIds: rule.danceId ? [rule.danceId] : [],
          effectId: rule.effectId, soundId: rule.soundId, sceneIdToApply: rule.sceneId,
          durationSeconds: rule.duration, priority: rule.priority, username: event.username,
          count: rule.spawnsCharacter ? rule.spawnCount || 1 : 0,
          reactionLine: rule.spawnsCharacter ? ruleLine : '',
        });
        return;
      }

      // 3) Trò chuyện tự động theo mẫu câu hỏi — không sinh nhân vật, chỉ trả lời
      const autoReply = matchAutoReply(event.message, autoReplyRules);
      if (autoReply) {
        const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, settings.cooldownSecondsDefault, settings.maxTriggersPerUserPerMinute);
        if (!cooldownCheck.allowed) return;
        recordUserTrigger(cooldownStateRef.current, event.userId, now);
        const { line, personality } = pickAnnouncerLine([autoReply], event.username);
        pushReaction({ username: event.username, characterName: 'MC AI Dẫn Chương Trình', line, platform: event.platform, personality });
      }
    },
    [rules, giftTiers, autoReplyRules, settings.maxTriggersPerUserPerMinute, settings.cooldownSecondsDefault, settings.disabledCharacterIds, spawnCharacters, allCharacters, enabledCharacters, pushReaction, pickAnnouncerLine]
  );

  const handleManualTrigger = useCallback(
    (text) => {
      const idx = Math.floor(Math.random() * simulatedCustomers.length);
      processEvent(buildUnifiedEvent({
        platform: platformFromChannelId(selectedChannelIds[0]), type: 'comment',
        userId: `test_${simulatedCustomers[idx]}`, username: simulatedCustomers[idx],
        avatar: simulatedAvatars[idx % simulatedAvatars.length], message: text,
      }));
    },
    [selectedChannelIds, processEvent]
  );

  const handleManualGift = useCallback(
    (points) => {
      const idx = Math.floor(Math.random() * simulatedCustomers.length);
      processEvent(buildUnifiedEvent({
        platform: platformFromChannelId(selectedChannelIds[0]), type: 'gift',
        userId: `test_gift_${simulatedCustomers[idx]}`, username: simulatedCustomers[idx],
        avatar: simulatedAvatars[idx % simulatedAvatars.length], message: '__test_gift__', value: points,
      }));
    },
    [selectedChannelIds, processEvent]
  );

  const runAutoShuffle = useCallback(() => {
    const combo = buildRandomCombo({
      characters: enabledCharacters,
      danceStyles: filterEnabled(DANCE_STYLES, settings.disabledDanceIds),
      effects: filterEnabled(DANCE_EFFECTS, settings.disabledEffectIds),
      scenes: filterEnabled(SCENE_BACKGROUNDS, settings.disabledSceneIds),
      outfits: OUTFITS,
    });
    if (!combo.character) return;
    const line = pickReactionLine(combo.character.personality, 'Khán Giả', REACTION_LINES, REACTION_LINES.funny);
    pushReaction({ username: 'Auto Shuffle', characterName: combo.character.name, line, platform: 'system', personality: combo.character.personality });
    spawnCharacters({
      characterIds: [combo.character.id], danceIds: combo.dance ? [combo.dance.id] : [],
      effectId: combo.effect?.id, soundId: null, sceneIdToApply: combo.scene?.id,
      durationSeconds: 10, priority: 3, username: 'Tự Động', count: 1, reactionLine: line, outfitId: combo.outfit?.id,
    });
  }, [enabledCharacters, settings.disabledDanceIds, settings.disabledEffectIds, settings.disabledSceneIds, spawnCharacters, pushReaction]);

  // Chế độ mô phỏng — chạy full pipeline thật trên dữ liệu giả lập cho TikTok/Facebook (chưa có API
  // công khai). Tôn trọng Lịch Hoạt Động 24/7 nếu admin bật giới hạn khung giờ.
  useEffect(() => {
    if (!settings.simulationEnabled || selectedChannelIds.length === 0) return undefined;
    const interval = setInterval(() => {
      if (settings.scheduleEnabled && !isWithinSchedule(Date.now(), settings.scheduleStartHour, settings.scheduleEndHour)) return;
      const channelId = selectedChannelIds[Math.floor(Math.random() * selectedChannelIds.length)];
      const platform = platformFromChannelId(channelId);
      const idx = Math.floor(Math.random() * simulatedCustomers.length);
      const username = simulatedCustomers[idx];
      const avatar = simulatedAvatars[idx % simulatedAvatars.length];

      if (Math.random() < 0.15) {
        const giftPool = GIFT_POINT_MAPPING.filter((g) => g.platform === platform);
        const gift = giftPool.length > 0 ? giftPool[Math.floor(Math.random() * giftPool.length)] : { giftName: 'Quà Ngẫu Nhiên', pointValue: Math.floor(Math.random() * 500) };
        processEvent(buildUnifiedEvent({ platform, type: 'gift', userId: `sim_${username}`, username, avatar, message: gift.giftName, value: gift.pointValue }));
      } else {
        const roll = Math.random();
        let text;
        if (roll < 0.3 && enabledCharacters.length > 0) {
          const character = enabledCharacters[Math.floor(Math.random() * enabledCharacters.length)];
          text = character.callNames?.[0] || character.name;
        } else if (roll < 0.6) {
          text = rules[Math.floor(Math.random() * rules.length)].keyword;
        } else {
          text = simulatedQuestions[Math.floor(Math.random() * simulatedQuestions.length)].text;
        }
        processEvent(buildUnifiedEvent({ platform, type: 'comment', userId: `sim_${username}`, username, avatar, message: text }));
      }
    }, settings.simulationIntervalMs);
    return () => clearInterval(interval);
  }, [settings.simulationEnabled, settings.simulationIntervalMs, settings.scheduleEnabled, settings.scheduleStartHour, settings.scheduleEndHour, selectedChannelIds, rules, enabledCharacters, processEvent]);

  const { ytBridge, handleYtConnect, handleYtDisconnect } = useYouTubeLiveChatBridge(processEvent);

  const toggleChannel = useCallback((id) => {
    setSelectedChannelIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  const addCustomCharacter = useCallback((character) => setCustomCharacters((prev) => [...prev, character]), []);
  const deleteCustomCharacter = useCallback((id) => setCustomCharacters((prev) => prev.filter((c) => c.id !== id)), []);

  const toggleLibraryItem = useCallback((category, id) => {
    const key = LIBRARY_SETTING_KEY[category];
    if (!key) return;
    setSettings((prev) => {
      const list = prev[key] || [];
      return { ...prev, [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
  }, []);

  const setCustomBackgroundImage = useCallback((dataUrl) => {
    setSettings((prev) => ({ ...prev, customBackgroundImage: dataUrl }));
  }, []);

  return {
    rules, setRules,
    giftTiers, setGiftTiers,
    settings, setSettings,
    autoReplyRules, setAutoReplyRules,
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter,
    allSounds, addCustomSound,
    setCustomBackgroundImage,
    instances, effectTriggers, sceneId, leaderboard, reactionFeed,
    connectedChannelList: connectedChannels.filter((c) => c.status === 'connected'),
    selectedChannelIds, toggleChannel,
    ytBridge, handleYtConnect, handleYtDisconnect,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift,
    playSound, runAutoShuffle, toggleLibraryItem,
  };
}
