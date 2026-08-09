import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DANCE_STYLES,
  SCENE_BACKGROUNDS,
  DEFAULT_KEYWORD_RULES,
  GIFT_TIERS,
  GIFT_POINT_MAPPING,
  DANCE_SOUNDS,
  DEFAULT_SETTINGS,
  REACTION_LINES,
  GIFT_THANK_LINES,
  AUTO_REPLY_RULES,
  COMMENTARY_STYLES,
  SOUND_DANCE_SUGGESTIONS,
  DANCE_MODE_SIZES,
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
  assignCharacterForUser,
  suggestDanceForSound,
  platformFromChannelId,
} from '../lib/danceFloorEngine';
import { loadLiveChannels } from '../lib/platformChannels';
import { speakLine } from '../lib/voiceEngine';
import { useAiReplyTrigger } from './useAiReplyTrigger';
import { simulatedCustomers, simulatedAvatars, simulatedQuestions } from '../lib/aiSimulationData';
import { useCustomLibraryItems } from './useCustomLibraryItems';
import { useDanceFloorManualActions } from './useDanceFloorManualActions';
import { useBackgroundMusicPlaylist } from './useBackgroundMusicPlaylist';
import { loadJSON, saveJSON } from '../lib/localStorageJson';

const RULES_KEY = 'avalive_dancefloor_rules';
const TIERS_KEY = 'avalive_dancefloor_tiers';
const SETTINGS_KEY = 'avalive_dancefloor_settings';
const AUTO_REPLY_KEY = 'avalive_dancefloor_auto_replies';
const BROADCAST_CHANNEL_NAME = 'avalive_dancefloor_stage';
const LIBRARY_SETTING_KEY = {
  character: 'disabledCharacterIds',
  dance: 'disabledDanceIds',
  effect: 'disabledEffectIds',
  scene: 'disabledSceneIds',
  sound: 'disabledSoundIds',
};

// Toàn bộ orchestration của "Sàn Nhảy TikTok": state, pipeline Ingestion→Gọi Tên/Rule→Auto-Reply→
// Gift-Tier→Queue→Render, mô phỏng realtime, cầu nối YouTube thật, giọng đọc, Auto-Shuffle, lịch 24/7,
// và đồng bộ sang cửa sổ Overlay qua BroadcastChannel. Tách khỏi JSX để mỗi file dưới 500 dòng.
// Nhân vật/hiệu ứng/âm thanh tuỳ chỉnh nằm trong useCustomLibraryItems (tách riêng cùng lý do).
export function useDanceFloorEngine() {
  const [rules, setRules] = useState(() => loadJSON(RULES_KEY, DEFAULT_KEYWORD_RULES));
  const [giftTiers, setGiftTiers] = useState(() => loadJSON(TIERS_KEY, GIFT_TIERS));
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) }));
  const [autoReplyRules, setAutoReplyRules] = useState(() => loadJSON(AUTO_REPLY_KEY, AUTO_REPLY_RULES));

  const {
    customCharacters, allCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    customEffects, allEffects, addCustomEffect, deleteCustomEffect,
    customSounds, allSounds, addCustomSound, deleteCustomSound,
    customDanceStyles, allDanceStyles, addCustomDanceStyle, deleteCustomDanceStyle,
    backgroundVideos, addBackgroundVideo, deleteBackgroundVideo,
    activeBackgroundVideoId, setActiveBackgroundVideoId,
  } = useCustomLibraryItems();

  const enabledCharacters = useMemo(
    () => filterEnabled(allCharacters, settings.disabledCharacterIds),
    [allCharacters, settings.disabledCharacterIds]
  );
  const enabledNormalCharacters = useMemo(() => enabledCharacters.filter((c) => c.tier !== 'vip'), [enabledCharacters]);
  const enabledVipCharacters = useMemo(() => enabledCharacters.filter((c) => c.tier === 'vip'), [enabledCharacters]);

  // Playlist nhạc nền — chỉ gồm bài nhạc THẬT đã tải lên (mp3 hoặc audio trích từ video), đang bật tick
  // dùng; hết bài tự động qua bài kế tiếp, làm nhạc nền xuyên suốt phiên live cho nhân vật nhảy theo.
  const enabledCustomSounds = useMemo(
    () => filterEnabled(customSounds, settings.disabledSoundIds),
    [customSounds, settings.disabledSoundIds]
  );
  const musicPlaylist = useBackgroundMusicPlaylist(enabledCustomSounds, settings.musicLoopMode);

  const [instances, setInstances] = useState([]);
  const [effectTriggers, setEffectTriggers] = useState([]);
  const [sceneId, setSceneId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [reactionFeed, setReactionFeed] = useState([]);
  const [giftShowcase, setGiftShowcase] = useState(null);
  const [commentFeed, setCommentFeed] = useState([]);

  const [connectedChannels, setConnectedChannels] = useState(() => loadLiveChannels());
  const [selectedChannelIds, setSelectedChannelIds] = useState([]);

  const [commentsPerMin, setCommentsPerMin] = useState(0);
  const [triggersPerMin, setTriggersPerMin] = useState(0);

  const cooldownStateRef = useRef(createCooldownState());
  const commentTimestampsRef = useRef([]);
  const triggerTimestampsRef = useRef([]);
  const audioCtxRef = useRef(null);
  const broadcastChannelRef = useRef(null);
  // Nhân vật đại diện cố định cho từng người xem trong phiên (Thường mặc định, nâng VIP khi tặng quà).
  const userCharacterAssignmentsRef = useRef(new Map());
  const userTiersRef = useRef(new Map());
  // Người xem đã từng bình luận trong phiên — dùng để nhận biết "người mới vào" (chỉ chào 1 lần/người).
  const seenUserIdsRef = useRef(new Set());

  useEffect(() => saveJSON(RULES_KEY, rules), [rules]);
  useEffect(() => saveJSON(TIERS_KEY, giftTiers), [giftTiers]);
  useEffect(() => saveJSON(SETTINGS_KEY, settings), [settings]);
  useEffect(() => saveJSON(AUTO_REPLY_KEY, autoReplyRules), [autoReplyRules]);

  // Bảng "WOW" siêu to hiện vài giây rồi tự tắt mỗi khi có quà tặng — không cần dọn thủ công.
  useEffect(() => {
    if (!giftShowcase) return undefined;
    const timer = setTimeout(() => setGiftShowcase(null), 5000);
    return () => clearTimeout(timer);
  }, [giftShowcase]);

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
      customBackgroundImage: settings.customBackgroundImage, allCharacters, allEffects,
    });
  }, [instances, effectTriggers, sceneId, settings.maxSlots, settings.customBackgroundImage, allCharacters, allEffects]);

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

  const pushReaction = useCallback(
    (entry) => {
      setReactionFeed((prev) =>
        [{ id: `rx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, timestamp: Date.now(), ...entry }, ...prev].slice(0, 30)
      );
      if (!settings.voiceEnabled || !entry.line) return;
      // Có giọng đọc AI riêng (Gemini TTS) thì phát đúng file đó; không thì dùng Web Speech API như cũ.
      if (entry.audioUrl) {
        new Audio(entry.audioUrl).play().catch((err) => console.error('Phát giọng đọc AI lỗi:', err));
      } else {
        speakLine(entry.line, entry.personality || 'funny');
      }
    },
    [settings.voiceEnabled]
  );

  // Gọi Gemini AI để có câu thoại "siêu tự nhiên, hài hước" — CHỈ dùng cho quà tặng & người bình luận
  // mới (đúng phạm vi yêu cầu, không tốn hạn mức miễn phí cho mọi bình luận thường). Luôn có fallback:
  // nếu API lỗi/hết hạn mức/chưa cấu hình key, câu thoại local (REACTION_LINES/GIFT_THANK_LINES) đã
  // hiện ngay từ trước đó vẫn đứng vững — đây chỉ là 1 lời chào/cảm ơn AI "cộng thêm" đến sau vài giây.
  const triggerAiReply = useAiReplyTrigger(pushReaction);

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
    ({ characterIds, danceIds, effectId, soundId, sceneIdToApply, durationSeconds, priority, username, count, reactionLine, sizeScale }) => {
      const now = Date.now();
      let resolvedSoundId = soundId;

      if (count > 0 && characterIds && characterIds.length > 0) {
        // Nhiều nhân vật sinh cùng lượt (spawnCount>1 hoặc chế độ nhảy đôi/3/nhóm) → gán chung groupId
        // để Sàn 3D xếp đội hình gần nhau + đồng bộ pha nhảy, tạo hiệu ứng nhảy nhóm thật.
        const groupId = count > 1 ? `group_${now}_${Math.random().toString(36).slice(2, 6)}` : null;
        const sharedDanceId = danceIds && danceIds.length > 0 ? danceIds[Math.floor(Math.random() * danceIds.length)] : null;
        const newInstances = Array.from({ length: count }).map((_, i) => {
          const characterId = characterIds[Math.floor(Math.random() * characterIds.length)];
          return {
            instanceId: `inst_${now}_${Math.random().toString(36).slice(2, 8)}_${i}`,
            characterId,
            danceId: groupId ? sharedDanceId : (danceIds && danceIds.length > 0 ? danceIds[Math.floor(Math.random() * danceIds.length)] : null),
            groupId,
            sizeScale: sizeScale || settings.characterSizeScale,
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
    [settings.maxSlots, settings.characterSizeScale, playSound, allCharacters]
  );

  const processEvent = useCallback(
    (event) => {
      const now = Date.now();

      if (event.type === 'gift') {
        // Tặng quà là điều kiện DUY NHẤT để mở khoá nhóm nhân vật VIP cho người xem này (áp dụng
        // từ lần bình luận kế tiếp trở đi thông qua assignCharacterForUser).
        userTiersRef.current.set(event.userId, 'vip');

        const points = convertGiftToPoints(event.platform, event.message, event.value, GIFT_POINT_MAPPING);
        setLeaderboard((prev) => {
          const existing = prev.find((l) => l.userId === event.userId);
          const updated = existing
            ? prev.map((l) => (l.userId === event.userId ? { ...l, points: l.points + points } : l))
            : [...prev, { userId: event.userId, username: event.username, points }];
          return updated.sort((a, b) => b.points - a.points).slice(0, 8);
        });

        const tier = resolveGiftTier(points, giftTiers);
        // Chỉ dùng characterIds cấu hình sẵn nếu nhân vật đó THẬT SỰ còn tồn tại (đã tải lên) — nếu
        // không (vd sau khi xoá hết nhân vật demo, hoặc admin chưa gán nhân vật cho cấp quà này) thì
        // tự lấy từ đúng hạng nhân vật admin đã tải lên (cấp quà cao → ưu tiên nhóm VIP).
        const validTierCharacterIds = tier.characterIds.filter(
          (id) => !settings.disabledCharacterIds.includes(id) && allCharacters.some((c) => c.id === id)
        );
        const fallbackPool = (tier.level >= 3 ? enabledVipCharacters : enabledNormalCharacters);
        const finalCharacterIds =
          validTierCharacterIds.length > 0
            ? validTierCharacterIds
            : (fallbackPool.length > 0 ? fallbackPool : enabledCharacters).map((c) => c.id);
        const guessedCharacter = allCharacters.find((c) => c.id === finalCharacterIds[0]);
        const { line: thankLine, personality: thankPersonality } = pickAnnouncerLine(GIFT_THANK_LINES, event.username);
        triggerTimestampsRef.current.push(now);
        pushReaction({ username: event.username, characterName: guessedCharacter?.name || tier.name, line: thankLine, platform: event.platform, personality: thankPersonality });
        triggerAiReply({ kind: 'gift', username: event.username, characterName: guessedCharacter?.name || tier.name, giftName: tier.name, personality: thankPersonality });
        setGiftShowcase({ id: now, username: event.username, giftName: tier.name, characterName: guessedCharacter?.name || tier.name, character: guessedCharacter || null });

        spawnCharacters({
          characterIds: finalCharacterIds,
          danceIds: tier.danceIds,
          effectId: tier.effectIds[Math.floor(Math.random() * tier.effectIds.length)],
          soundId: tier.soundId,
          sceneIdToApply: tier.customization?.sceneChoice ? SCENE_BACKGROUNDS[Math.floor(Math.random() * SCENE_BACKGROUNDS.length)].id : null,
          durationSeconds: tier.durationSeconds,
          priority: 10, // Gift luôn có độ ưu tiên cao nhất, thắng mọi comment thường
          username: event.username,
          count: DANCE_MODE_SIZES[tier.danceMode] || 1,
          reactionLine: thankLine,
        });
        return;
      }

      if (event.type !== 'comment') return;
      commentTimestampsRef.current.push(now);

      // Đổ MỌI bình luận thô về đây, kể cả bình luận không trúng luật/bị cooldown chặn — người dùng
      // cần thấy dòng chat thật đang chảy trên sàn, không chỉ những dòng sinh ra nhân vật.
      setCommentFeed((prev) =>
        [{ id: `cmt_${now}_${Math.random().toString(36).slice(2, 8)}`, timestamp: now, username: event.username, avatar: event.avatar, message: event.message, platform: event.platform }, ...prev].slice(0, 40)
      );

      // Một lượt cooldown duy nhất cho mỗi bình luận — dù đường xử lý nào được chọn bên dưới, người
      // spam vẫn bị chặn đều, tránh vừa gọi tên vừa được gán nhân vật mặc định trong cùng 1 giây.
      const cooldownCheck = canUserTrigger(cooldownStateRef.current, event.userId, now, settings.cooldownSecondsDefault, settings.maxTriggersPerUserPerMinute);
      if (!cooldownCheck.allowed) return;
      recordUserTrigger(cooldownStateRef.current, event.userId, now);
      triggerTimestampsRef.current.push(now);

      // Người mới vào lần đầu bình luận trong phiên — chào mừng bằng AI (chỉ 1 lần/người, không tính
      // cooldown vì đây là câu chào riêng biệt, không phải trigger sinh nhân vật).
      const isNewViewer = !seenUserIdsRef.current.has(event.userId);
      seenUserIdsRef.current.add(event.userId);

      // 1) Gọi tên nhân vật trực tiếp — ưu tiên trước bảng luật từ khoá tâm trạng
      const calledCharacter = matchCharacterByCallName(event.message, enabledCharacters);
      // 2) Bảng luật từ khoá tâm trạng (hey/fire/vip...) — chỉ xét khi không gọi tên trực tiếp
      const rule = !calledCharacter ? matchTriggerRule(event.message, rules, event.platform) : null;
      let welcomeCharacterName = null;

      if (calledCharacter) {
        welcomeCharacterName = calledCharacter.name;
        const line = pickReactionLine(calledCharacter.personality, event.username, REACTION_LINES, REACTION_LINES.funny);
        pushReaction({ username: event.username, characterName: calledCharacter.name, line, platform: event.platform, personality: calledCharacter.personality });
        spawnCharacters({
          characterIds: [calledCharacter.id], danceIds: null, effectId: null, soundId: null, sceneIdToApply: null,
          durationSeconds: 8, priority: 3, username: event.username, count: 1, reactionLine: line,
        });
      } else if (rule) {
        // Nhân vật cấu hình sẵn cho luật này có thể không còn tồn tại (đã xoá/chưa được gán) — tự thay
        // bằng 1 nhân vật admin đã tải lên bất kỳ để luật vẫn hoạt động thay vì lặng lẽ không hiện gì.
        let ruleCharacter = allCharacters.find((c) => c.id === rule.characterId);
        if (!ruleCharacter && rule.spawnsCharacter && enabledCharacters.length > 0) {
          ruleCharacter = enabledCharacters[Math.floor(Math.random() * enabledCharacters.length)];
        }
        const willSpawn = rule.spawnsCharacter && !!ruleCharacter;
        welcomeCharacterName = ruleCharacter?.name || null;
        const ruleLine = pickReactionLine(ruleCharacter?.personality || 'funny', event.username, REACTION_LINES, REACTION_LINES.funny);
        pushReaction({ username: event.username, characterName: ruleCharacter?.name || `Hiệu ứng "${rule.keyword.toUpperCase()}"`, line: ruleLine, platform: event.platform, personality: ruleCharacter?.personality || 'funny' });
        spawnCharacters({
          characterIds: willSpawn ? [ruleCharacter.id] : [],
          danceIds: rule.danceId ? [rule.danceId] : [],
          effectId: rule.effectId, soundId: rule.soundId, sceneIdToApply: rule.sceneId,
          durationSeconds: rule.duration, priority: rule.priority, username: event.username,
          count: willSpawn ? rule.spawnCount || 1 : 0,
          reactionLine: willSpawn ? ruleLine : '',
        });
      } else {
        // 3) Không khớp gì đặc biệt → mỗi người bình luận vẫn có 1 nhân vật đại diện riêng, cố định
        // suốt phiên (Thường mặc định, tự nâng lên nhóm VIP ngay khi họ tặng quà).
        const assigned = assignCharacterForUser(event.userId, userCharacterAssignmentsRef.current, userTiersRef.current, enabledNormalCharacters, enabledVipCharacters);
        if (assigned) {
          welcomeCharacterName = assigned.name;
          const line = pickReactionLine(assigned.personality, event.username, REACTION_LINES, REACTION_LINES.funny);
          pushReaction({ username: event.username, characterName: assigned.name, line, platform: event.platform, personality: assigned.personality });
          spawnCharacters({
            characterIds: [assigned.id], danceIds: null, effectId: null, soundId: null, sceneIdToApply: null,
            durationSeconds: 8, priority: 1, username: event.username, count: 1, reactionLine: line,
          });
        }
      }

      if (isNewViewer) {
        triggerAiReply({ kind: 'welcome', username: event.username, characterName: welcomeCharacterName, personality: 'funny' });
      }

      // 4) Trò chuyện tự động theo mẫu câu hỏi — lớp phản hồi độc lập, cộng thêm dù đã xử lý ở trên
      const autoReply = matchAutoReply(event.message, autoReplyRules);
      if (autoReply) {
        const { line, personality } = pickAnnouncerLine([autoReply], event.username);
        pushReaction({ username: event.username, characterName: 'MC AI Dẫn Chương Trình', line, platform: event.platform, personality });
      }
    },
    [rules, giftTiers, autoReplyRules, settings.maxTriggersPerUserPerMinute, settings.cooldownSecondsDefault, settings.disabledCharacterIds, spawnCharacters, allCharacters, enabledCharacters, enabledNormalCharacters, enabledVipCharacters, pushReaction, pickAnnouncerLine, triggerAiReply]
  );

  const { handleManualTrigger, handleManualGift, handleManualCombo, handleManualHighlight, runAutoShuffle } = useDanceFloorManualActions({
    processEvent, spawnCharacters, pushReaction, allCharacters, enabledCharacters, allEffects, settings, selectedChannelIds,
  });

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

  const toggleChannel = useCallback((id) => {
    setSelectedChannelIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }, []);

  const suggestDance = useCallback(
    (soundId) => {
      const enabledDanceStyles = filterEnabled(DANCE_STYLES, settings.disabledDanceIds);
      return suggestDanceForSound(soundId, SOUND_DANCE_SUGGESTIONS, enabledDanceStyles.length > 0 ? enabledDanceStyles : DANCE_STYLES);
    },
    [settings.disabledDanceIds]
  );

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
    allCharacters, customCharacters, addCustomCharacter, deleteCustomCharacter, editCustomCharacter,
    enabledNormalCharacters, enabledVipCharacters,
    allEffects, customEffects, addCustomEffect, deleteCustomEffect,
    allSounds, addCustomSound, deleteCustomSound,
    allDanceStyles, customDanceStyles, addCustomDanceStyle, deleteCustomDanceStyle,
    backgroundVideos, addBackgroundVideo, deleteBackgroundVideo, activeBackgroundVideoId, setActiveBackgroundVideoId,
    setCustomBackgroundImage,
    instances, effectTriggers, sceneId, leaderboard, reactionFeed, commentFeed, giftShowcase,
    connectedChannelList: connectedChannels.filter((c) => c.status === 'connected'),
    selectedChannelIds, toggleChannel,
    commentsPerMin, triggersPerMin,
    handleManualTrigger, handleManualGift, handleManualCombo, handleManualHighlight,
    playSound, runAutoShuffle, toggleLibraryItem, suggestDance, musicPlaylist,
  };
}
