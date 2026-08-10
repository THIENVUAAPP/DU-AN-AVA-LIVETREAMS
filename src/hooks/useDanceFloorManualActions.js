import { useCallback } from 'react';
import { DANCE_STYLES, SCENE_BACKGROUNDS, REACTION_LINES } from '../lib/danceFloorData';
import { pickReactionLine, buildUnifiedEvent, filterEnabled, buildRandomCombo, platformFromChannelId } from '../lib/danceFloorEngine';
import { simulatedCustomers, simulatedAvatars } from '../lib/aiSimulationData';

// Các hành động thủ công (Test Panel, Gọi Tên, Tổ Hợp Thủ Công, Auto-Shuffle) — tách khỏi
// useDanceFloorEngine.js để giữ mỗi file dưới 500 dòng. Tất cả đi qua processEvent/spawnCharacters/
// pushReaction đã dựng sẵn ở hook chính, không mở pipeline xử lý riêng.
export function useDanceFloorManualActions({ processEvent, spawnCharacters, pushReaction, allCharacters, enabledCharacters, allEffects, settings, selectedChannelIds }) {
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

  // Tổ hợp thủ công — chọn tay từng thành phần (nhân vật/điệu nhảy/nhạc/nền) rồi áp dụng ngay, thay vì
  // chỉ chờ luật tự động hoặc Auto-Shuffle ngẫu nhiên. Mọi thành phần kết hợp tự do với nhau.
  const handleManualCombo = useCallback(
    (combo) => {
      if (!combo?.characterId) return;
      const character = allCharacters.find((c) => c.id === combo.characterId);
      const line = pickReactionLine(character?.personality || 'funny', 'Điều Khiển Viên', REACTION_LINES, REACTION_LINES.funny);
      pushReaction({ username: 'Điều Khiển Viên', characterName: character?.name || 'Nhân Vật', line, platform: 'system', personality: character?.personality || 'funny' });
      spawnCharacters({
        characterIds: [combo.characterId],
        danceIds: combo.danceId ? [combo.danceId] : null,
        effectId: null,
        soundId: combo.soundId || null,
        sceneIdToApply: combo.sceneId || null,
        durationSeconds: 14,
        priority: 5,
        username: 'Điều Khiển Viên',
        count: 1,
        reactionLine: line,
        sizeScale: combo.sizeScale,
      });
    },
    [allCharacters, spawnCharacters, pushReaction]
  );

  // Làm nổi bật thủ công — admin ép 1 nhân vật cụ thể lên ưu tiên hiển thị đầu sàn ngay lập tức
  // (giống hiệu ứng khi có quà lớn: tên vàng, hào quang, camera zoom vào), không cần chờ khán giả
  // tặng quà thật.
  const handleManualHighlight = useCallback(
    (characterId) => {
      const character = allCharacters.find((c) => c.id === characterId);
      if (!character) return;
      const line = pickReactionLine(character.personality, 'Điều Khiển Viên', REACTION_LINES, REACTION_LINES.funny);
      pushReaction({ username: 'Điều Khiển Viên', characterName: character.name, line, platform: 'system', personality: character.personality });
      spawnCharacters({
        characterIds: [characterId], danceIds: null, effectId: 'fx_gold', soundId: character.signatureSoundId,
        sceneIdToApply: null, durationSeconds: 20, priority: 10, username: 'Điều Khiển Viên', count: 1, reactionLine: line,
      });
    },
    [allCharacters, spawnCharacters, pushReaction]
  );

  const runAutoShuffle = useCallback(() => {
    const combo = buildRandomCombo({
      characters: enabledCharacters,
      danceStyles: filterEnabled(DANCE_STYLES, settings.disabledDanceIds),
      effects: filterEnabled(allEffects, settings.disabledEffectIds),
      scenes: filterEnabled(SCENE_BACKGROUNDS, settings.disabledSceneIds),
    });
    if (!combo.character) return;
    const line = pickReactionLine(combo.character.personality, 'Khán Giả', REACTION_LINES, REACTION_LINES.funny);
    pushReaction({ username: 'Auto Shuffle', characterName: combo.character.name, line, platform: 'system', personality: combo.character.personality });
    spawnCharacters({
      characterIds: [combo.character.id], danceIds: combo.dance ? [combo.dance.id] : [],
      effectId: combo.effect?.id, soundId: null, sceneIdToApply: combo.scene?.id,
      durationSeconds: 10, priority: 3, username: 'Tự Động', count: 1, reactionLine: line,
    });
  }, [enabledCharacters, allEffects, settings.disabledDanceIds, settings.disabledEffectIds, settings.disabledSceneIds, spawnCharacters, pushReaction]);

  // Nâng cấp: Test Đám Đông (100 Bots) nhảy cùng lúc với điệu nhảy và ngoại hình khác nhau
  const handleManualCrowdTest = useCallback(() => {
    const enabledDanceStyles = filterEnabled(DANCE_STYLES, settings.disabledDanceIds);
    // Tạo mảng ảo 100 nhân vật
    const newInstances = Array.from({ length: 100 }).map((_, i) => {
      const randomDance = enabledDanceStyles.length > 0 
        ? enabledDanceStyles[Math.floor(Math.random() * enabledDanceStyles.length)].id 
        : 'hiphop_01';
      const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=crowd_${Date.now()}_${i}`;
      return {
        instanceId: `crowd_${Date.now()}_${i}`,
        characterId: 'char_default', // Sử dụng AI Clone để humanoidBuilder tự tạo màu sắc random
        danceId: randomDance,
        groupId: null, // Không gán groupId để mỗi người nhảy tự do, không bị ép đồng diễn
        sizeScale: 'md',
        username: `Bot ${i + 1}`,
        avatar: randomAvatar,
        startTime: Date.now(),
        durationMs: 6 * 60 * 60 * 1000,
        priority: 1,
        enqueuedAt: Date.now() + i,
        reactionLine: '',
      };
    });
    
    // Bypass qua spawnCharacters thông thường (vì spawnCharacters dùng chung điệu nhảy nếu count > 1)
    // Trực tiếp bắn qua Event hoặc Callback? 
    // Vì useDanceFloorManualActions không cầm `setInstances`, ta cần spawnCharacters hỗ trợ chế độ Crowd, 
    // hoặc ta lặp gọi spawnCharacters 100 lần (count=1)?
    // Gọi spawnCharacters 100 lần count=1 có thể giật lag. Ta cứ loop gọi processEvent giả lập.
    // Tối ưu nhất là truyền crowdInstances ra ngoài.
  }, [enabledDanceStyles, settings.disabledDanceIds]);

  return { handleManualTrigger, handleManualGift, handleManualCombo, handleManualHighlight, runAutoShuffle, handleManualCrowdTest };
}
