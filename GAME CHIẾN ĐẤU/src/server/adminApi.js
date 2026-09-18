/**
 * REST API cho trang Admin (/admin): đăng nhập, điều khiển thủ công
 * (pause/resume/start/end trận), chỉnh cỡ nhân vật, cài đặt trận đấu/âm
 * thanh, và lịch tự động. Tất cả route trừ /login đều yêu cầu adminAuth.
 */

import { Router } from 'express';
import { logger } from './logger.js';

export function createAdminApi({ adminAuth, gateway, scheduler }) {
  const router = Router();

  router.post('/login', (req, res) => {
    const token = adminAuth.login(req.body?.password);
    if (!token) {
      res.status(401).json({ error: 'Sai mật khẩu' });
      return;
    }
    res.json({ token });
  });

  router.use(adminAuth.requireAuth);

  router.get('/status', (req, res) => {
    res.json(gateway.getStatus());
  });

  router.post('/pause', (req, res) => {
    gateway.pauseGame('manual');
    res.json({ ok: true });
  });

  router.post('/resume', (req, res) => {
    gateway.resumeGame();
    res.json({ ok: true });
  });

  router.post('/start-new-match', (req, res) => {
    gateway.forceStartNewMatch();
    res.json({ ok: true });
  });

  router.post('/end-match', (req, res) => {
    const ended = gateway.forceEndMatch();
    if (!ended) {
      res.status(400).json({ error: 'Trận đấu đã kết thúc rồi hoặc chưa có trận nào đang chạy' });
      return;
    }
    res.json({ ok: true });
  });

  router.post('/character-scale', (req, res) => {
    const ok = gateway.setCharacterScale(req.body?.scale);
    if (!ok) {
      res.status(400).json({ error: 'Giá trị cỡ nhân vật không hợp lệ (0.3 - 3)' });
      return;
    }
    res.json({ ok: true });
  });

  router.post('/match-settings', (req, res) => {
    const { maxHp, comebackThreshold, matchResetDelayMs } = req.body || {};
    const results = {};
    if (maxHp !== undefined) results.maxHp = gateway.setMaxHp(maxHp);
    if (comebackThreshold !== undefined) results.comebackThreshold = gateway.setComebackThreshold(comebackThreshold);
    if (matchResetDelayMs !== undefined) results.matchResetDelayMs = gateway.setMatchResetDelayMs(matchResetDelayMs);
    res.json({ ok: true, results });
  });

  router.post('/audio-settings', (req, res) => {
    const ok = gateway.setAudioSettings(req.body || {});
    res.json({ ok });
  });

  router.get('/feature-flags', (req, res) => {
    res.json(gateway.getFeatureFlags());
  });

  router.post('/feature-flags', (req, res) => {
    const ok = gateway.setFeatureFlags(req.body || {});
    res.json({ ok });
  });

  router.post('/faction-appearance', (req, res) => {
    const { factionId, name, color } = req.body || {};
    if (factionId !== 'blue' && factionId !== 'red') {
      res.status(400).json({ error: 'factionId phải là "blue" hoặc "red"' });
      return;
    }
    const ok = gateway.setFactionAppearance(factionId, { name, color });
    res.json({ ok });
  });

  router.get('/schedule', (req, res) => {
    res.json(scheduler.getSchedule());
  });

  router.post('/schedule', (req, res) => {
    const saved = scheduler.saveSchedule(req.body || {});
    if (!saved) {
      res.status(400).json({ error: 'Dữ liệu lịch không hợp lệ (giờ phải dạng HH:MM)' });
      return;
    }
    logger.info('Admin đã cập nhật lịch tự động', { schedule: saved });
    res.json({ ok: true, schedule: saved });
  });

  return router;
}
