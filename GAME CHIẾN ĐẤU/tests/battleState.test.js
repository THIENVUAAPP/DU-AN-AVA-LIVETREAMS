import test from 'node:test';
import assert from 'node:assert/strict';
import { BattleState } from '../src/server/battleState.js';

function makeThemeFixture(overrides = {}) {
  return {
    gameTitle: 'Test Game',
    factions: {
      blue: { id: 'blue', name: { vi: 'Xanh', en: 'Blue' }, color: '#00f', commentKeywords: ['xanh', 'blue'] },
      red: { id: 'red', name: { vi: 'Đỏ', en: 'Red' }, color: '#f00', commentKeywords: ['do', 'đỏ', 'red'] },
    },
    battle: {
      maxHpPerFaction: 100,
      comebackHpPercentThreshold: 30,
      comebackDamageMultiplier: 2,
      comebackHealMultiplier: 2,
      leaderboardTopCount: 3,
      resultsTopSupportersCount: 3,
      ...overrides,
    },
  };
}

test('HP khởi tạo bằng maxHp cho cả 2 phe', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.hp.blue, 100);
  assert.equal(state.hp.red, 100);
});

test('assignFactionByComment gán đúng phe theo từ khóa, kể cả không dấu', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.assignFactionByComment('u1', 'xanh'), 'blue');
  assert.equal(state.assignFactionByComment('u2', 'toi chon do nha'), 'red');
  assert.equal(state.assignFactionByComment('u3', 'đỏ'), 'red');
  assert.equal(state.assignFactionByComment('u4', 'blue'), 'blue');
  assert.equal(state.assignFactionByComment('u5', 'xin chào mọi người'), null);
});

test('getOrAutoAssignFaction tự cân bằng vào phe ít người hơn', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.assignFactionByComment('u2', 'xanh');
  // blue có 2 người, red có 0 -> viewer mới tự động vào red
  const autoAssigned = state.getOrAutoAssignFaction('u3');
  assert.equal(autoAssigned, 'red');
  // gọi lại lần 2 cho cùng user phải trả về phe đã gán, không đổi
  assert.equal(state.getOrAutoAssignFaction('u3'), 'red');
});

test('applyGiftImpact gây damage lên phe đối thủ và heal phe mình, có clamp', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  const result = state.applyGiftImpact({
    userId: 'u1',
    nickname: 'Nguoi Choi 1',
    impact: { opponentDamage: 30, ownFactionHeal: 10, summonCount: 1, effect: 'aoeSkill' },
  });
  assert.equal(result.applied, true);
  assert.equal(result.factionId, 'blue');
  assert.equal(result.opponentFactionId, 'red');
  assert.equal(state.hp.red, 70);
  assert.equal(state.hp.blue, 100); // đã full máu, heal không vượt max
});

test('damage clamp không xuống dưới 0', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 500, ownFactionHeal: 0 } });
  assert.equal(state.hp.red, 0);
});

test('comeback buff nhân đôi damage/heal khi phe dưới ngưỡng % HP', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.assignFactionByComment('u2', 'do');
  // đưa blue xuống dưới 30% (còn 20/100) bằng 1 cú damage lớn từ phe đỏ
  state.applyGiftImpact({ userId: 'u2', nickname: 'B', impact: { opponentDamage: 80, ownFactionHeal: 0 } });
  assert.equal(state.hp.blue, 20);

  // giờ u1 (phe blue, đang thua <30%) tặng quà -> phải được nhân hệ số comeback x2
  const result = state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 10, ownFactionHeal: 5 } });
  assert.equal(result.isComeback, true);
  assert.equal(result.opponentDamage, 20); // 10 * 2
  assert.equal(result.ownFactionHeal, 10); // 5 * 2
});

test('kết thúc trận khi 1 phe về 0 HP, xác định đúng phe thắng', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  const result = state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 200, ownFactionHeal: 0 } });
  assert.equal(result.matchEnded, true);
  assert.equal(state.matchEnded, true);
  assert.equal(state.winnerFactionId, 'blue');
});

test('applyGiftImpact sau khi trận đã kết thúc bị từ chối, không đổi HP', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 200 } });
  const hpAfterEnd = state.hp.red;
  const result = state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 50 } });
  assert.equal(result.applied, false);
  assert.equal(state.hp.red, hpAfterEnd);
});

test('getMatchResults trả về null trước khi kết thúc, đúng top supporter sau khi kết thúc', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.getMatchResults(), null);

  state.assignFactionByComment('u1', 'xanh');
  state.assignFactionByComment('u2', 'xanh');
  state.applyGiftImpact({ userId: 'u2', nickname: 'Nho', impact: { opponentDamage: 10 } });
  state.applyGiftImpact({ userId: 'u1', nickname: 'Lon', impact: { opponentDamage: 200 } });

  const results = state.getMatchResults();
  assert.equal(results.winnerFactionId, 'blue');
  assert.equal(results.mvp.userId, 'u1');
  assert.equal(results.winningTeam[0].userId, 'u1');
  assert.equal(results.winningTeamTotalCount, 2);
});

test('getFactionFighters sắp theo score giảm dần và cap đúng limit', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh'); // chỉ comment, chưa tặng quà -> score 0
  state.assignFactionByComment('u2', 'xanh');
  state.assignFactionByComment('u3', 'xanh');
  state.applyGiftImpact({ userId: 'u2', nickname: 'B', impact: { opponentDamage: 5, ownFactionHeal: 10 } });
  state.applyGiftImpact({ userId: 'u3', nickname: 'C', impact: { opponentDamage: 0, ownFactionHeal: 50 } });

  const fighters = state.getFactionFighters('blue');
  assert.equal(fighters.length, 3);
  assert.equal(fighters[0].userId, 'u3'); // score cao nhất đứng đầu
  assert.equal(fighters[1].userId, 'u2');
  assert.equal(fighters[2].userId, 'u1'); // score 0 (chỉ comment) đứng cuối

  const capped = state.getFactionFighters('blue', 2);
  assert.equal(capped.length, 2);
});

test('người chỉ comment (chưa tặng quà) vẫn có mặt trong fighters với score 0', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh', 'NguoiMoiXem');
  assert.equal(state.fighters.get('u1').score, 0);
  assert.equal(state.fighters.get('u1').nickname, 'NguoiMoiXem');
  assert.equal(state._factionCounts().blue, 1);
});

test('forceEndMatch kết thúc ngay, phe nhiều HP hơn thắng', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 40 } });
  // blue=100, red=60 -> blue phải thắng khi force end
  const ended = state.forceEndMatch();
  assert.equal(ended, true);
  assert.equal(state.matchEnded, true);
  assert.equal(state.winnerFactionId, 'blue');
  assert.equal(state.hp.red, 0);
});

test('forceEndMatch không làm gì nếu trận đã kết thúc rồi', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 200 } });
  assert.equal(state.matchEnded, true);
  assert.equal(state.forceEndMatch(), false);
});

test('setMaxHp cập nhật maxHp và clamp HP hiện tại không vượt quá', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.setMaxHp(50), true);
  assert.equal(state.maxHp, 50);
  assert.equal(state.hp.blue, 50); // đã bị clamp từ 100 xuống 50
  assert.equal(state.setMaxHp(-10), false); // giá trị không hợp lệ bị từ chối
  assert.equal(state.setMaxHp('abc'), false);
});

test('setComebackThreshold cập nhật ngưỡng, từ chối giá trị ngoài 0-100', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.setComebackThreshold(50), true);
  assert.equal(state.comebackThresholdPercent, 50);
  assert.equal(state.setComebackThreshold(150), false);
  assert.equal(state.setComebackThreshold(-1), false);
});

test('reset clears toàn bộ per-match maps và HP về max', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 200 } });
  assert.equal(state.matchEnded, true);

  state.resetMatch();
  assert.equal(state.matchEnded, false);
  assert.equal(state.winnerFactionId, null);
  assert.equal(state.hp.blue, 100);
  assert.equal(state.hp.red, 100);
  assert.equal(state.fighters.size, 0);
  assert.equal(state.getMatchResults(), null);
});

test('input không hợp lệ (thiếu userId/impact) không throw, không applied', () => {
  const state = new BattleState(makeThemeFixture());
  assert.equal(state.applyGiftImpact({ userId: null, impact: { opponentDamage: 10 } }).applied, false);
  assert.equal(state.applyGiftImpact({ userId: 'u1', impact: null }).applied, false);
});

test('avatarUrl được lưu qua comment và qua gift, giữ nguyên nếu lần sau không truyền', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh', 'NguoiA', 'https://example.com/avatar-a.jpg');
  assert.equal(state.fighters.get('u1').avatarUrl, 'https://example.com/avatar-a.jpg');

  // tặng quà lần sau không kèm avatar mới -> giữ nguyên avatar cũ, không bị xoá
  state.applyGiftImpact({ userId: 'u1', nickname: 'NguoiA', impact: { opponentDamage: 10 } });
  assert.equal(state.fighters.get('u1').avatarUrl, 'https://example.com/avatar-a.jpg');

  // gift kèm avatar mới -> cập nhật
  state.applyGiftImpact({ userId: 'u1', nickname: 'NguoiA', avatarUrl: 'https://example.com/new.jpg', impact: { opponentDamage: 5 } });
  assert.equal(state.fighters.get('u1').avatarUrl, 'https://example.com/new.jpg');
});

test('fighter mới không có avatarUrl thì mặc định null, không throw', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  assert.equal(state.fighters.get('u1').avatarUrl, null);
});

test('điểm leaderboard tính theo coinsSpent (xu TikTok thật), không theo damage/heal', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  // damage/heal chỉ 5, nhưng quà thật trị giá 5000 xu -> điểm phải là 5000, không phải 5
  state.applyGiftImpact({
    userId: 'u1',
    nickname: 'A',
    coinsSpent: 5000,
    impact: { opponentDamage: 3, ownFactionHeal: 2 },
  });
  assert.equal(state.fighters.get('u1').score, 5000);
  assert.equal(state.hp.red, 97); // HP vẫn tính theo damage/heal như cũ, không đổi
});

test('điểm cộng dồn đúng qua nhiều lần tặng quà theo coinsSpent', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', coinsSpent: 100, impact: { opponentDamage: 1 } });
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', coinsSpent: 250, impact: { opponentDamage: 1 } });
  assert.equal(state.fighters.get('u1').score, 350);
});

test('thiếu coinsSpent (hoặc =0) fallback về damage+heal như cũ, không throw', () => {
  const state = new BattleState(makeThemeFixture());
  state.assignFactionByComment('u1', 'xanh');
  state.applyGiftImpact({ userId: 'u1', nickname: 'A', impact: { opponentDamage: 30, ownFactionHeal: 10 } });
  assert.equal(state.fighters.get('u1').score, 40);

  state.applyGiftImpact({ userId: 'u1', nickname: 'A', coinsSpent: 0, impact: { opponentDamage: 5 } });
  assert.equal(state.fighters.get('u1').score, 45); // 40 + fallback 5
});
