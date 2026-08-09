import { useCallback } from 'react';
import { DANCE_STYLES, SCENE_BACKGROUNDS, OUTFITS, REACTION_LINES } from '../lib/danceFloorData';
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
      outfits: filterEnabled(OUTFITS, settings.disabledOutfitIds),
    });
    if (!combo.character) return;
    const line = pickReactionLine(combo.character.personality, 'Khán Giả', REACTION_LINES, REACTION_LINES.funny);
    pushReaction({ username: 'Auto Shuffle', characterName: combo.character.name, line, platform: 'system', personality: combo.character.personality });
    spawnCharacters({
      characterIds: [combo.character.id], danceIds: combo.dance ? [combo.dance.id] : [],
      effectId: combo.effect?.id, soundId: null, sceneIdToApply: combo.scene?.id,
      durationSeconds: 10, priority: 3, username: 'Tự Động', count: 1, reactionLine: line, outfitId: combo.outfit?.id,
    });
  }, [enabledCharacters, allEffects, settings.disabledDanceIds, settings.disabledEffectIds, settings.disabledSceneIds, spawnCharacters, pushReaction]);

  return { handleManualTrigger, handleManualGift, handleManualCombo, runAutoShuffle };
}
