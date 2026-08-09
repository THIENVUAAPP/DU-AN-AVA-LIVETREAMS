import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DANCE_CHARACTERS,
  DEFAULT_KEYWORD_RULES,
  GIFT_TIERS,
  GIFT_POINT_MAPPING,
  DANCE_SOUNDS,
  SCENE_BACKGROUNDS,
  DEFAULT_SETTINGS,
  REACTION_LINES,
  GIFT_THANK_LINES,
} from '../lib/danceFloorData';
import {
  matchTriggerRule,
  matchCharacterByCallName,
  pickReactionLine,
  convertGiftToPoints,
  resolveGiftTier,
  createCooldownState,
  canUserTrigger,
  recordUserTrigger,
  admitQueueToStage,
  buildUnifiedEvent,
} from '../lib/danceFloorEngine';
import { loadLiveChannels } from '../lib/platformChannels';
import { simulatedCustomers, simulatedAvatars, simulatedQuestions } from '../lib/aiSimulationData';

const RULES_KEY = 'avalive_dancefloor_rules';
const TIERS_KEY = 'avalive_dancefloor_tiers';
const SETTINGS_KEY = 'avalive_dancefloor_settings';
const CUSTOM_CHARACTERS_KEY = 'avalive_dancefloor_custom_characters';

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

// Toàn bộ orchestration của "Sàn Nhảy TikTok": state, pipeline Ingestion→Rule/Call-name→Gift-Tier→
// Queue→Render, mô phỏng realtime, cầu nối YouTube thật. Tách khỏi JSX để DanceFloorStudio.jsx
// chỉ còn nhiệm vụ hiển thị (giữ mỗi file dưới 500 dòng theo chuẩn code sạch).
export function useDanceFloorEngine() {
  const [rules, setRules] = useState(() => loadJSON(RULES_KEY, DEFAULT_KEYWORD_RULES));
  const [giftTiers, setGiftTiers] = useState(() => loadJSON(TIERS_KEY, GIFT_TIERS));
  const [settings, setSettings] = useState(() => loadJSON(SETTINGS_KEY, DEFAULT_SETTINGS));
  const [customCharacters, setCustomCharacters] = useState(() => loadJSON(CUSTOM_CHARACTERS_KEY, []));

  const allCharacters = useMemo(() => [...DANCE_CHARACTERS, ...customCharacters], [customCharacters]);

  const [instances, setInstances] = useState([]);
  const [effectTriggers, setEffectTriggers] = useState([]);
  const [sceneId, setSceneId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reactionFeed, setReactionFeed] = useState([]);

  const [connectedChannels, setConnectedChannels] = useState(() => loadLiveChannels());
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);
  const [ytBridge, setYtBridge] = useState({ connected: false, connecting: false, liveChatId: '', lastError: null });

  const [commentsPerMin, setCommentsPerMin] = useState(0);
  const [triggersPerMin, setTriggersPerMin] = useState(0);

  const cooldownStateRef = useRef(createCooldownState());
  const commentTimestampsRef = useRef([]);
  const triggerTimestampsRef = useRef([]);
  const audioCtxRef = useRef(null);
  const ytTimeoutRef = useRef(null);

  useEffect(() => saveJSON(RULES_KEY, rules), [rules]);
  useEffect(() => saveJSON(TIERS_KEY, giftTiers), [giftTiers]);
  useEffect(() => saveJSON(SETTINGS_KEY, settings), [settings]);
  useEffect(() => saveJSON(CUSTOM_CHARACTERS_KEY, customCharacters), [customCharacters]);

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

  const playSound = useCallback(
    (soundId) => {
      if (!settings.soundEnabled) return;
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
    [settings.soundEnabled]
  );

  const pushReaction = useCallback((entry) => {
    setReactionFeed((prev) =>
      [{ id: `rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now(), ...entry }, ...prev].slice(0, 30)
    );
  }, []);

  const spawnCharacters = useCallback(
    ({ characterIds, danceIds, effectId, soundId, sceneIdToApply, durationSeconds, priority, username, count, reactionLine }) => {
      const now = Date.now();
      let resolvedSoundId = soundId;

      if (count > 0 && characterIds && characterIds.length > 0) {
        const newInstances = Array.from({ length: count }).map((_, i) => {
          const characterId = characterIds[Math.floor(Math.random() * characterIds.length)];
          return {
            instanceId: `inst_${now}_${Math.random().toString(36).slice(2, 8)}_${i}`,
            characterId,
            danceId: danceIds && danceIds.length > 0 ? danceIds[Math.floor(Math.random() * danceIds.length)] : null,
            username,
            startTime: now,
            durationMs: durationSeconds * 1000,
            priority,
            enqueuedAt: now + i,
            reactionLine: reactionLine || '',
          };
        });
        // Ưu tiên nhạc do luật/tier chỉ định; nếu không có thì dùng nhạc hiệu riêng của nhân vật đầu tiên
        // được sinh ra — mỗi nhân vật/loại quà có "chất riêng" thay vì dùng chung 1 bản nhạc.
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
        const guessedCharacterId = tier.characterIds[Math.floor(Math.random() * tier.characterIds.length)];
        const guessedCharacter = allCharacters.find((c) => c.id === guessedCharacterId);
        const thankLine = pickReactionLine('gift', event.username, {}, GIFT_THANK_LINES);
        triggerTimestampsRef.current.push(now);
        pushReaction({ username: event.username, characterName: guessedCharacter?.name || tier.name, line: thankLine, platform: event.platform });

        spawnCharacters({
          characterIds: tier.characterIds,
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
      const calledCharacter = matchCharacterByCallName(event.message, allCharacters);
      if (calledCharacter) {
        const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, settings.cooldownSecondsDefault, settings.maxTriggersPerUserPerMinute);
        if (!cooldownCheck.allowed) return;
        recordUserTrigger(cooldownStateRef.current, event.userId, now);
        triggerTimestampsRef.current.push(now);

        const line = pickReactionLine(calledCharacter.personality, event.username, REACTION_LINES, REACTION_LINES.funny);
        pushReaction({ username: event.username, characterName: calledCharacter.name, line, platform: event.platform });

        spawnCharacters({
          characterIds: [calledCharacter.id],
          danceIds: null,
          effectId: null,
          soundId: null,
          sceneIdToApply: null,
          durationSeconds: 8,
          priority: 3,
          username: event.username,
          count: 1,
          reactionLine: line,
        });
        return;
      }

      // 2) Bảng luật từ khoá tâm trạng (hey/fire/vip...)
      const rule = matchTriggerRule(event.message, rules, event.platform);
      if (!rule) return;

      const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, rule.cooldownSec, settings.maxTriggersPerUserPerMinute);
      if (!cooldownCheck.allowed) return;
      recordUserTrigger(cooldownStateRef.current, event.userId, now);
      triggerTimestampsRef.current.push(now);

      const ruleCharacter = allCharacters.find((c) => c.id === rule.characterId);
      const ruleLine = pickReactionLine(ruleCharacter?.personality || 'funny', event.username, REACTION_LINES, REACTION_LINES.funny);
      pushReaction({ username: event.username, characterName: ruleCharacter?.name || `Hiệu ứng "${rule.keyword.toUpperCase()}"`, line: ruleLine, platform: event.platform });

      spawnCharacters({
        characterIds: rule.spawnsCharacter && rule.characterId ? [rule.characterId] : [],
        danceIds: rule.danceId ? [rule.danceId] : [],
        effectId: rule.effectId,
        soundId: rule.soundId,
        sceneIdToApply: rule.sceneId,
        durationSeconds: rule.duration,
        priority: rule.priority,
        username: event.username,
        count: rule.spawnsCharacter ? rule.spawnCount || 1 : 0,
        reactionLine: rule.spawnsCharacter ? ruleLine : '',
      });
    },
    [rules, giftTiers, settings.maxTriggersPerUserPerMinute, settings.cooldownSecondsDefault, spawnCharacters, allCharacters, pushReaction]
  );

  const handleManualTrigger = useCallback(
    (text) => {
      const idx = Math.floor(Math.random() * simulatedCustomers.length);
      processEvent(
        buildUnifiedEvent({
          platform: platformFromChannelId(selectedChannelIds[0]),
          type: 'comment',
          userId: `test_${simulatedCustomers[idx]}`,
          username: simulatedCustomers[idx],
          avatar: simulatedAvatars[idx % simulatedAvatars.length],
          message: text,
        })
      );
    },
    [selectedChannelIds, processEvent]
  );

  const handleManualGift = useCallback(
    (points) => {
      const idx = Math.floor(Math.random() * simulatedCustomers.length);
      processEvent(
        buildUnifiedEvent({
          platform: platformFromChannelId(selectedChannelIds[0]),
          type: 'gift',
          userId: `test_gift_${simulatedCustomers[idx]}`,
          username: simulatedCustomers[idx],
          avatar: simulatedAvatars[idx % simulatedAvatars.length],
          message: '__test_gift__',
          value: points,
        })
      );
    },
    [selectedChannelIds, processEvent]
  );

  // Chế độ mô phỏng — chạy full pipeline thật (Ingestion→Rule/Call-name→Queue→Render) trên dữ liệu
  // giả lập, vì TikTok/Facebook chưa cấp API bình luận Live công khai cho bên thứ ba. YouTube dùng
  // cầu nối thật bên dưới thay vì mô phỏng.
  useEffect(() => {
    if (!settings.simulationEnabled || selectedChannelIds.length === 0) return;
    const interval = setInterval(() => {
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
        if (roll < 0.3) {
          const character = allCharacters[Math.floor(Math.random() * allCharacters.length)];
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
  }, [settings.simulationEnabled, settings.simulationIntervalMs, selectedChannelIds, rules, allCharacters, processEvent]);

  // Cầu nối YouTube Live Chat API thật — REST công khai gọi trực tiếp từ trình duyệt bằng API Key.
  const pollYouTubeChat = useCallback(
    async (apiKey, liveChatId, pageToken) => {
      try {
        const url = new URL('https://www.googleapis.com/youtube/v3/liveChat/messages');
        url.searchParams.set('liveChatId', liveChatId);
        url.searchParams.set('part', 'snippet,authorDetails');
        url.searchParams.set('key', apiKey);
        if (pageToken) url.searchParams.set('pageToken', pageToken);

        const res = await fetch(url.toString());
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody?.error?.message || `Lỗi HTTP ${res.status}`);
        }
        const data = await res.json();

        (data.items || []).forEach((item) => {
          const snippet = item.snippet;
          const author = item.authorDetails;
          if (snippet.superChatDetails) {
            processEvent(
              buildUnifiedEvent({
                platform: 'youtube', type: 'gift', userId: author.channelId, username: author.displayName,
                avatar: author.profileImageUrl, message: `Super Chat ${snippet.superChatDetails.amountDisplayString || ''}`,
                value: Math.round((snippet.superChatDetails.amountMicros || 0) / 10000),
                timestamp: Date.parse(snippet.publishedAt),
              })
            );
          } else if (snippet.displayMessage) {
            processEvent(
              buildUnifiedEvent({
                platform: 'youtube', type: 'comment', userId: author.channelId, username: author.displayName,
                avatar: author.profileImageUrl, message: snippet.displayMessage, timestamp: Date.parse(snippet.publishedAt),
              })
            );
          }
        });

        setYtBridge({ connected: true, connecting: false, liveChatId, lastError: null });
        ytTimeoutRef.current = setTimeout(
          () => pollYouTubeChat(apiKey, liveChatId, data.nextPageToken),
          Math.max(data.pollingIntervalMillis || 5000, 3000)
        );
      } catch (err) {
        console.error('pollYouTubeChat lỗi:', err);
        setYtBridge({ connected: false, connecting: false, liveChatId, lastError: err.message || 'Không thể kết nối YouTube Live Chat.' });
      }
    },
    [processEvent]
  );

  const handleYtConnect = useCallback(
    (apiKey, liveChatId) => {
      setYtBridge({ connected: false, connecting: true, liveChatId, lastError: null });
      pollYouTubeChat(apiKey, liveChatId, null);
    },
    [pollYouTubeChat]
  );

  const handleYtDisconnect = useCallback(() => {
    if (ytTimeoutRef.current) clearTimeout(ytTimeoutRef.current);
    setYtBridge({ connected: false, connecting: false, liveChatId: '', lastError: null });
  }, []);

  useEffect(() => () => { if (ytTimeoutRef.current) clearTimeout(ytTimeoutRef.current); }, []);

  const toggleChannel = useCallback((id) => {
    setSelectedChannelIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  const addCustomCharacter = useCallback((character) => {
    setCustomCharacters((prev) => [...prev, character]);
  }, []);

  const deleteCustomCharacter = useCallback((id) => {
    setCustomCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    rules, setRules,
    giftTiers, setGiftTiers,
    settings, setSettings,
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter,
    instances, effectTriggers, sceneId, leaderboard, reactionFeed,
    connectedChannelList: connectedChannels.filter((c) => c.status === 'connected'),
    selectedChannelIds, toggleChannel,
    ytBridge, handleYtConnect, handleYtDisconnect,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift,
    playSound,
  };
}
