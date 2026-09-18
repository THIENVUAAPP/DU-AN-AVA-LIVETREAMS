/**
 * Composition root — ráp nối toàn bộ backend: đọc config, khởi tạo
 * BattleState, chọn nguồn sự kiện (TikTok LIVE thật hoặc DemoSimulator),
 * serve overlay tĩnh + trang Admin, và mở Socket.IO để đẩy trạng thái
 * real-time. Cũng khởi động lịch tự động bật/tắt game theo giờ.
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { Server } from 'socket.io';

import { env } from './src/server/env.js';
import { logger } from './src/server/logger.js';
import { BattleState } from './src/server/battleState.js';
import { TikTokConnector } from './src/server/tiktokConnector.js';
import { DemoSimulator } from './src/server/demoSimulator.js';
import { setupSocketGateway } from './src/server/socketGateway.js';
import { createAdminAuth } from './src/server/adminAuth.js';
import { createAdminApi } from './src/server/adminApi.js';
import { createScheduler } from './src/server/scheduler.js';
import { createTtsService } from './src/server/ttsService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readJsonConfig(relativePath) {
  const fullPath = join(__dirname, relativePath);
  try {
    return JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (error) {
    logger.error(`Không đọc được file config bắt buộc: ${relativePath}`, error, {});
    throw error;
  }
}

const themeConfig = readJsonConfig('config/theme.json');
const giftsConfig = readJsonConfig('config/gifts.json');
const audioConfig = readJsonConfig('config/audio.json');

const battleState = new BattleState(themeConfig);

const source = env.DEMO_MODE
  ? new DemoSimulator()
  : new TikTokConnector(env.TIKTOK_USERNAME);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/i18n', express.static(join(__dirname, 'i18n')));
app.get('/config/theme.json', (req, res) => res.json(themeConfig));
app.get('/config/audio.json', (req, res) => res.json(audioConfig));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const ttsService = createTtsService({
  apiKey: env.ELEVENLABS_API_KEY,
  voiceId: env.ELEVENLABS_VOICE_ID,
  enabled: env.TTS_ENABLED,
});

const gateway = setupSocketGateway({ io, battleState, giftsConfig, themeConfig, source, env, ttsService });

const adminAuth = createAdminAuth(env.ADMIN_PASSWORD);
const scheduler = createScheduler({
  schedulePath: join(__dirname, 'config/schedule.json'),
  gateway,
});

app.use('/admin/api', createAdminApi({ adminAuth, gateway, scheduler }));
app.use('/admin', express.static(join(__dirname, 'admin')));

source.start();
scheduler.start();

httpServer.listen(env.PORT, () => {
  logger.info('Server đang chạy', {
    port: env.PORT,
    demoMode: env.DEMO_MODE,
    overlayUrl: `http://localhost:${env.PORT}`,
    adminUrl: `http://localhost:${env.PORT}/admin`,
  });
});

function shutdown(signal) {
  logger.info('Đang tắt server...', { signal });
  scheduler.stop();
  gateway.stop();
  source.stop();
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
