// Engine thuần logic cho "Sàn Nhảy TikTok" — tách rời hoàn toàn khỏi UI/render,
// theo đúng nguyên tắc Ingestion → Rule Engine → Queue → Render trong live-studio-dance-floor-plan.md.
// Không phụ thuộc React, có thể unit-test độc lập.

// Bỏ dấu tiếng Việt + lowercase + trim, để "Hây"/"hay"/"Hey"/"heyyy" đều khớp được.
export function normalizeText(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Tìm luật khớp có priority cao nhất trong 1 bình luận (1 comment có thể chỉ trigger 1 luật để tránh spam hiệu ứng).
export function matchTriggerRule(message, rules, platform) {
  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) return null;

  const words = normalizedMessage.split(" ");
  const candidates = rules.filter((rule) => {
    if (!rule.enabled) return false;
    if (rule.platform !== "all" && rule.platform !== platform) return false;
    const normalizedKeyword = normalizeText(rule.keyword);
    if (!normalizedKeyword) return false;
    if (normalizedKeyword.includes(" ")) {
      return normalizedMessage.includes(normalizedKeyword);
    }
    // Chấp nhận biến thể kéo dài chữ, vd "heyyy" khớp "hey"
    return words.some((w) => w === normalizedKeyword || w.startsWith(normalizedKeyword));
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.priority - a.priority || b.keyword.length - a.keyword.length);
  return candidates[0];
}

// "Gọi tên" nhân vật trực tiếp — bình luận trùng tên hoặc biệt danh (callNames) của 1 nhân vật cụ thể
// sẽ triệu hồi đúng nhân vật đó lên sàn, tách biệt với bảng luật từ khoá theo tâm trạng (hey/fire/vip...).
export function matchCharacterByCallName(message, characters) {
  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) return null;
  const words = normalizedMessage.split(" ");

  return (
    characters.find((character) => {
      const aliases = [character.name, ...(character.callNames || [])]
        .map(normalizeText)
        .filter(Boolean);
      return aliases.some((alias) =>
        alias.includes(" ") ? normalizedMessage.includes(alias) : words.includes(alias)
      );
    }) || null
  );
}

// Chọn ngẫu nhiên 1 câu phản hồi hài hước theo "giọng" tính cách nhân vật — chạy tức thời, không
// gọi AI, để giữ độ trễ thấp trên đường xử lý realtime.
export function pickReactionLine(personality, username, linesByPersonality, fallbackLines) {
  const pool = linesByPersonality[personality] || fallbackLines || [];
  if (pool.length === 0) return "";
  const template = pool[Math.floor(Math.random() * pool.length)];
  return template.replace(/\{username\}/g, username || "bạn");
}

// Trò chuyện tự động theo mẫu câu hỏi — lớp phản hồi độc lập với việc sinh nhân vật, áp dụng cho MỌI
// bình luận khớp mẫu (kể cả khi không trigger từ khoá/gọi tên nào). Không phải AI sinh mới theo từng
// câu, mà khớp theo danh sách mẫu câu admin cấu hình được (xem AUTO_REPLY_RULES / Auto-Reply Panel).
export function matchAutoReply(message, autoReplyRules) {
  const normalizedMessage = normalizeText(message);
  if (!normalizedMessage) return null;

  const matched = autoReplyRules.find((rule) => {
    if (!rule.enabled) return false;
    return (rule.matchKeywords || []).some((kw) => normalizedMessage.includes(normalizeText(kw)));
  });
  if (!matched || matched.replyTemplates.length === 0) return null;

  return matched.replyTemplates[Math.floor(Math.random() * matched.replyTemplates.length)];
}

// Quy đổi 1 sự kiện quà tặng của nền tảng bất kỳ về "điểm sàn nhảy" nội bộ.
export function convertGiftToPoints(platform, giftName, rawValue, mapping) {
  const found = mapping.find(
    (m) => m.platform === platform && m.giftName === giftName
  );
  if (found) return found.pointValue;
  // Không có trong bảng quy đổi → dùng giá trị thô làm điểm (không âm thầm quy về 0, tránh mất dữ liệu quà)
  return Number(rawValue) > 0 ? Number(rawValue) : 0;
}

// Tìm tier cao nhất mà điểm tích luỹ đạt được.
export function resolveGiftTier(points, tiers) {
  const sorted = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find((tier) => points >= tier.minPoints) || sorted[sorted.length - 1];
}

// --- Chống spam / cooldown theo user ---
// cooldownState: { lastTriggerAt: Map<userId, timestamp>, triggersInWindow: Map<userId, number[]> }
export function createCooldownState() {
  return { lastTriggerAt: new Map(), triggersInWindow: new Map() };
}

export function canUserTrigger(state, userId, now, cooldownSec, maxPerMinute) {
  const last = state.lastTriggerAt.get(userId) || 0;
  if (now - last < cooldownSec * 1000) {
    return { allowed: false, reason: "cooldown" };
  }
  const windowStart = now - 60000;
  const history = (state.triggersInWindow.get(userId) || []).filter((t) => t > windowStart);
  if (history.length >= maxPerMinute) {
    return { allowed: false, reason: "rate_limit" };
  }
  return { allowed: true };
}

export function recordUserTrigger(state, userId, now) {
  state.lastTriggerAt.set(userId, now);
  const windowStart = now - 60000;
  const history = (state.triggersInWindow.get(userId) || []).filter((t) => t > windowStart);
  history.push(now);
  state.triggersInWindow.set(userId, history);
}

// --- Quản lý sàn diễn (State Manager) ---
// instance: { instanceId, slotIndex, userId, username, characterId, danceId, effectId, startTime, durationMs, priority }

export function removeExpiredInstances(instances, now) {
  return instances.filter((inst) => now - inst.startTime < inst.durationMs);
}

// Nhận hàng đợi (đã có priority), cấp slot còn trống; nếu hết slot mà item ưu tiên cao hơn
// nhân vật đang chiếm slot có priority thấp nhất → đẩy nhân vật đó ra sớm (ưu tiên VIP/gift).
export function admitQueueToStage(queue, currentInstances, maxSlots, now) {
  const alive = removeExpiredInstances(currentInstances, now);
  const evicted = [];
  const admitted = [];
  let working = [...alive];

  const sortedQueue = [...queue].sort(
    (a, b) => b.priority - a.priority || a.enqueuedAt - b.enqueuedAt
  );

  for (const item of sortedQueue) {
    if (working.length < maxSlots) {
      working.push(item);
      admitted.push(item);
      continue;
    }
    const lowestPriorityInstance = [...working].sort((a, b) => a.priority - b.priority)[0];
    if (lowestPriorityInstance && item.priority > lowestPriorityInstance.priority) {
      working = working.filter((w) => w.instanceId !== lowestPriorityInstance.instanceId);
      evicted.push(lowestPriorityInstance);
      working.push(item);
      admitted.push(item);
    }
    // Nếu không đủ ưu tiên để chen vào → item bị bỏ qua (không spawn), không đưa vào hàng đợi vô hạn để tránh dồn ứ.
  }

  return { instances: working, admitted, evicted };
}

// --- Trợ giúp cho Auto-Shuffle / Lịch 24-7 / Tick kích hoạt thư viện ---

// Có đang trong khung giờ hoạt động cho phép không (hỗ trợ khung qua đêm, vd 22h → 6h sáng).
export function isWithinSchedule(now, startHour, endHour) {
  const hour = new Date(now).getHours();
  if (startHour <= endHour) return hour >= startHour && hour <= endHour;
  return hour >= startHour || hour <= endHour;
}

// Lọc bỏ các item admin đã tick TẮT khỏi thư viện (không dùng trong mô phỏng/auto-shuffle/gọi tên).
export function filterEnabled(list, disabledIds) {
  if (!disabledIds || disabledIds.length === 0) return list;
  return list.filter((item) => !disabledIds.includes(item.id));
}

// Sinh 1 tổ hợp ngẫu nhiên (nhân vật/điệu nhảy/hiệu ứng/bối cảnh/trang phục) cho Auto-Shuffle 1-chạm.
export function buildRandomCombo({ characters, danceStyles, effects, scenes, outfits }) {
  const pick = (arr) => (arr && arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null);
  return {
    character: pick(characters),
    dance: pick(danceStyles),
    effect: pick(effects),
    scene: pick(scenes),
    outfit: pick(outfits),
  };
}

// Xây dựng 1 UnifiedLiveEvent chuẩn hoá từ dữ liệu thô của adapter bất kỳ.
export function buildUnifiedEvent({ platform, type, userId, username, avatar, message, value, timestamp }) {
  return {
    id: `${platform}_${type}_${userId || "anon"}_${timestamp || Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    platform,
    type,
    userId: userId || `${platform}_guest_${Math.random().toString(36).slice(2, 8)}`,
    username: username || "Khách Xem",
    avatar: avatar || null,
    message: message || "",
    value: value || 0,
    timestamp: timestamp || Date.now(),
  };
}
