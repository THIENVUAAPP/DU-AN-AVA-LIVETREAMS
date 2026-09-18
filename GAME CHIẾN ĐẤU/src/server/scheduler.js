/**
 * Lịch tự động bật/tắt game theo khung giờ trong ngày. Đọc/ghi
 * config/schedule.json (có backup trước khi ghi đè). Khi ngoài giờ hoạt
 * động, game chuyển sang trạng thái tạm dừng (pauseReason: 'schedule') —
 * không ngắt kết nối TikTok LIVE, chỉ dừng xử lý gift/comment.
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { logger } from './logger.js';

const DEFAULT_SCHEDULE = { enabled: false, dailyStartTime: '08:00', dailyEndTime: '23:00' };
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function createScheduler({ schedulePath, gateway, checkIntervalMs = 60000 }) {
  let schedule = loadSchedule();
  let timer = null;
  let lastAppliedState = null;

  function loadSchedule() {
    try {
      if (existsSync(schedulePath)) {
        const parsed = JSON.parse(readFileSync(schedulePath, 'utf8'));
        return { ...DEFAULT_SCHEDULE, ...parsed };
      }
    } catch (error) {
      logger.error('Lỗi đọc config/schedule.json, dùng mặc định', error, {});
    }
    return { ...DEFAULT_SCHEDULE };
  }

  function isValidSchedule(candidate) {
    return (
      typeof candidate.enabled === 'boolean' &&
      TIME_PATTERN.test(candidate.dailyStartTime) &&
      TIME_PATTERN.test(candidate.dailyEndTime)
    );
  }

  function saveSchedule(newSchedule) {
    const merged = { ...schedule, ...newSchedule };
    if (!isValidSchedule(merged)) return null;

    schedule = merged;
    try {
      if (existsSync(schedulePath)) copyFileSync(schedulePath, `${schedulePath}.bak`);
      writeFileSync(schedulePath, JSON.stringify(schedule, null, 2), 'utf8');
    } catch (error) {
      logger.error('Lỗi ghi config/schedule.json', error, {});
    }
    applyNow();
    return schedule;
  }

  function isWithinSchedule(now = new Date()) {
    if (!schedule.enabled) return true;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseMinutes(schedule.dailyStartTime);
    const endMinutes = parseMinutes(schedule.dailyEndTime);

    if (startMinutes <= endMinutes) {
      return nowMinutes >= startMinutes && nowMinutes < endMinutes;
    }
    return nowMinutes >= startMinutes || nowMinutes < endMinutes; // lịch qua đêm
  }

  function applyNow() {
    const within = isWithinSchedule();
    const desiredState = within ? 'active' : 'outside';
    if (desiredState === lastAppliedState) return;
    lastAppliedState = desiredState;

    if (within) {
      gateway.resumeGame();
      logger.info('Trong khung giờ hoạt động — game tiếp tục', { schedule });
    } else {
      gateway.pauseGame('schedule');
      logger.info('Ngoài khung giờ hoạt động — game tạm dừng theo lịch', { schedule });
    }
  }

  return {
    getSchedule: () => schedule,
    saveSchedule,
    isWithinSchedule,
    start() {
      applyNow();
      timer = setInterval(applyNow, checkIntervalMs);
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    },
  };
}
