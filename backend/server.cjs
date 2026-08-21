require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const https = require('https');
const cors = require('cors');

let TikTokConnector = null;
(async () => {
  try {
    const legacy = await import('tiktok-live-connector/legacy');
    TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
    console.log('[TikTok Connector] ✅ Loaded WebcastPushConnection (Legacy JSON stream engine)');
  } catch (e) {
    try {
      const mod = await import('tiktok-live-connector');
      TikTokConnector = mod.TikTokLiveConnection || mod.WebcastPushConnection || mod.default?.TikTokLiveConnection;
      console.log('[TikTok Connector] Loaded TikTokLiveConnection fallback');
    } catch (err) {
      console.error('[TikTok Connector] Failed to load connector module:', err);
    }
  }
})();

const app = express();
app.use(cors());
app.use(express.json()); // Để parse JSON body

// Tự động phục vụ frontend từ thư mục dist (nếu đã build)
const distPath = fs.existsSync(path.join(__dirname, '../dist'))
  ? path.join(__dirname, '../dist')
  : fs.existsSync(path.join(__dirname, './dist'))
  ? path.join(__dirname, './dist')
  : null;

if (distPath) {
  console.log(`[AvaLive Standalone] Phục vụ Frontend Static từ: ${distPath}`);
  app.use(express.static(distPath));
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

let tiktokConnection = null;
let currentUsername = null;
let autoReconnectTimer = null; // Tự động reconnect khi mất kết nối

// ⚡ LƯU TRỮ VÀ ĐỒNG BỘ TRẠNG THÁI REALTIME CHO TIKTOK LIVE STUDIO & OBS
let currentMasterLiveState = {
  stage: 'bando', // Mặc định mở Game Bản Đồ nếu đang chạy game
  aspectRatio: '9:16',
  characterId: 'char_1',
  characterName: 'Mèo 2k4',
  mediaUrl: '/idols/meo2k4.mp4',
  isVideo: true,
  isAudioMuted: false,
  isDarkMode: true,
  updatedAt: Date.now()
};

let currentBandoGameState = null;
let currentBattleGameState = null;

io.on('connection', (socket) => {
  console.log('Client connected to Live Hub:', socket.id);

  // 1. Ngay khi client mới (TikTok Live Studio, OBS, Browser) kết nối -> Gửi ngay toàn bộ state mới nhất
  socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  if (currentBandoGameState) {
    socket.emit('bando_sync', currentBandoGameState);
  }
  if (currentBattleGameState) {
    socket.emit('battle_sync', currentBattleGameState);
  }

  // 2. Lắng nghe cập nhật Master Live State từ giao diện điều khiển chính (Desktop App)
  socket.on('MASTER_LIVE_STATE_UPDATE', (state) => {
    if (state && typeof state === 'object') {
      currentMasterLiveState = { ...currentMasterLiveState, ...state, updatedAt: Date.now() };
      // Broadcast tới toàn bộ CEF Browser Source trên TikTok Live Studio & OBS
      io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
    }
  });

  socket.on('REQUEST_MASTER_LIVE_STATE', () => {
    socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  });

  // 3. Relay sự kiện Game Bản Đồ & Game Chiến Đấu
  socket.on('bando_sync', (state) => {
    currentBandoGameState = state;
    socket.broadcast.emit('bando_sync', state);
  });

  socket.on('battle_sync', (state) => {
    currentBattleGameState = state;
    socket.broadcast.emit('battle_sync', state);
  });

  socket.on('bando_event', (evt) => {
    io.emit('bando_event', evt);
    io.emit('LIVE_EVENT', evt);
  });

  socket.on('battle_event', (evt) => {
    io.emit('battle_event', evt);
    io.emit('LIVE_EVENT', evt);
  });

  socket.on('LIVE_EVENT', (evt) => {
    io.emit('LIVE_EVENT', evt);
  });

  // 4. TikTok Live Integration
  socket.on('get_tiktok_status', () => {
    socket.emit('tiktok_status', {
      connected: !!tiktokConnection && !!currentUsername,
      username: currentUsername,
      roomId: tiktokConnection?.roomId || null
    });
  });

  socket.on('disconnect_tiktok', () => {
    if (tiktokConnection) {
      try {
        tiktokConnection.disconnect();
      } catch (e) {}
      tiktokConnection = null;
    }
    currentUsername = '';
    io.emit('tiktok_disconnected', { message: 'Đã ngắt kết nối TikTok Live' });
    io.emit('tiktok_status', { connected: false, username: '', roomId: null });
  });

  socket.on('connect_tiktok', async (username, options = {}) => {
    const targetUser = username ? username.trim().replace(/^@/, '') : '';
    if (!targetUser) return;

    if (tiktokConnection) {
      if (currentUsername === targetUser && tiktokConnection.isConnected) {
        socket.emit('tiktok_connected', { username: targetUser, roomId: tiktokConnection.roomId });
        io.emit('tiktok_status', { connected: true, username: targetUser, roomId: tiktokConnection.roomId });
        return;
      }
      try {
        await tiktokConnection.disconnect();
      } catch (e) {}
      tiktokConnection = null;
    }

    if (!TikTokConnector) {
      try {
        const legacy = await import('tiktok-live-connector/legacy');
        TikTokConnector = legacy.WebcastPushConnection || legacy.default?.WebcastPushConnection;
      } catch (e) {
        const mod = await import('tiktok-live-connector');
        TikTokConnector = mod.TikTokLiveConnection || mod.WebcastPushConnection;
      }
    }

    currentUsername = targetUser;
    console.log(`[TikTok Live] 🚀 Connecting to TikTok channel: @${targetUser}`);

    try {
      tiktokConnection = new TikTokConnector(targetUser, {
        processInitialData: false,
        enableExtendedGiftInfo: true,
        sessionId: options.sessionId || process.env.TIKTOK_SESSION_ID || undefined
      });
    } catch (e) {
      console.error('[TikTok Live] Error instantiating TikTok connection:', e);
      socket.emit('tiktok_error', e.toString());
      return;
    }

    tiktokConnection.connect().then(state => {
      console.log(`[TikTok Live] ✅ Connected to TikTok Room ID: ${state?.roomId || 'ACTIVE'} (@${targetUser})`);
      io.emit('tiktok_connected', { username: targetUser, roomId: state?.roomId });
      io.emit('tiktok_status', { connected: true, username: targetUser, roomId: state?.roomId });
    }).catch(err => {
      console.error(`[TikTok Live] ❌ Failed to connect to @${targetUser}:`, err.message || err);
      io.emit('tiktok_error', err.toString());
      io.emit('tiktok_status', { connected: false, username: targetUser, error: err.toString() });
      tiktokConnection = null;
    });

    // Handle TikTok Events
    tiktokConnection.on('chat', data => {
      const chatPayload = {
        userId: String(data.userId || data.userDetails?.userId || data.uniqueId || ''),
        uniqueId: String(data.uniqueId || data.userDetails?.uniqueId || ''),
        nickname: String(data.nickname || data.userDetails?.nickname || data.uniqueId || 'Khán Giả'),
        comment: String(data.comment || ''),
        profilePictureUrl: String(data.profilePictureUrl || data.userDetails?.profilePictureUrls?.[0] || '')
      };
      io.emit('tiktok_chat', chatPayload);
      io.emit('LIVE_EVENT', {
        type: 'COMMENT',
        data: chatPayload
      });
    });

    // Lưu streak combo quà tặng để xử lý ngay tức thì từng lượt tặng
    const streakMap = new Map();

    tiktokConnection.on('gift', data => {
      try {
        const giftId = String(data.giftId || data.gift?.id || data.extendedGiftInfo?.id || 'rose');
        const giftName = String(data.giftName || data.gift?.name || data.extendedGiftInfo?.name || data.describe || 'Quà TikTok');
        const diamondCount = Number(data.diamondCount || data.extendedGiftInfo?.diamond_count || data.gift?.diamond_count || 1) || 1;
        const userId = String(data.userId || data.userDetails?.userId || data.uniqueId || 'tiktok_viewer');
        const uniqueId = String(data.uniqueId || data.userDetails?.uniqueId || '');
        const nickname = String(data.nickname || data.userDetails?.nickname || data.uniqueId || 'Khán Giả');
        const avatar = String(data.profilePictureUrl || data.userDetails?.profilePictureUrls?.[0] || '');

        const streakKey = `${userId}_${giftId}`;
        let count = 1;

        if (data.giftType === 1) {
          const prevCount = streakMap.get(streakKey) || 0;
          const currentCount = Number(data.repeatCount) || 1;
          count = Math.max(1, currentCount - prevCount);
          streakMap.set(streakKey, currentCount);

          if (data.repeatEnd) {
            streakMap.delete(streakKey);
          }
        } else {
          count = Number(data.repeatCount) || 1;
        }

        const giftPayload = {
          userId,
          uniqueId,
          nickname,
          username: nickname || uniqueId || 'Khán Giả',
          giftId,
          giftName,
          diamondCount,
          count,
          repeatCount: count,
          totalRepeatCount: data.repeatCount || count,
          profilePictureUrl: avatar,
          avatar
        };

        console.log(`[TikTok Gift] 🎁 ${nickname} (@${uniqueId}) tặng: ${giftName} x${count} (${diamondCount} xu)`);
        io.emit('tiktok_gift', giftPayload);
        
        // Chuyển đổi trực tiếp thành sự kiện cắm cờ bản đồ & game chiến đấu
        const giftEvent = {
          type: 'GIFT',
          data: giftPayload,
          timestamp: Date.now()
        };
        io.emit('bando_event', giftEvent);
        io.emit('LIVE_EVENT', giftEvent);
      } catch (err) {
        console.error('[TikTok Gift Error]:', err);
      }
    });

    tiktokConnection.on('like', data => {
      io.emit('tiktok_like', {
        userId: data.userId,
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        likeCount: data.likeCount,
        totalLikeCount: data.totalLikeCount,
        profilePictureUrl: data.profilePictureUrl
      });
      io.emit('LIVE_EVENT', {
        type: 'LIKE',
        data: {
          count: data.likeCount || 1,
          username: data.nickname || 'Khán Giả'
        }
      });
    });

    tiktokConnection.on('member', data => {
      io.emit('tiktok_member', {
        userId: data.userId,
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    tiktokConnection.on('streamEnd', () => {
      console.log(`[TikTok Live] 🛑 Stream ended for @${targetUser}`);
      tiktokConnection = null;
      io.emit('tiktok_stream_ended', { username: targetUser });
      io.emit('tiktok_status', { connected: false, username: targetUser, ended: true });
      // Tự động reconnect sau 30 giây (stream có thể restart)
      if (currentUsername) {
        console.log(`[TikTok Live] 🔄 Sẽ thử reconnect @${targetUser} sau 30 giây...`);
        if (autoReconnectTimer) clearTimeout(autoReconnectTimer);
        autoReconnectTimer = setTimeout(() => {
          if (currentUsername === targetUser && !tiktokConnection) {
            console.log(`[TikTok Live] 🔄 Đang thử reconnect @${targetUser}...`);
            io.emit('tiktok_status', { connected: false, username: targetUser, reconnecting: true });
            // Phát signal tới client để reconnect
            io.emit('REQUEST_RECONNECT_TIKTOK', { username: targetUser });
          }
        }, 30000);
      }
    });

    tiktokConnection.on('disconnected', () => {
      console.log(`[TikTok Live] ⚠️ Disconnected from @${targetUser}`);
      tiktokConnection = null;
      io.emit('tiktok_status', { connected: false, username: targetUser });
    });

    tiktokConnection.on('error', (err) => {
      console.error(`[TikTok Live] Error for @${targetUser}:`, err?.message || err);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Endpoints for TikTok Live Simulation & Status
app.get('/api/tiktok/status', (req, res) => {
  res.json({
    connected: !!tiktokConnection && !!currentUsername,
    username: currentUsername,
    roomId: tiktokConnection?.roomId || null
  });
});

// REST API để kết nối TikTok qua HTTP (không cần socket)
app.post('/api/tiktok/connect', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'Missing username' });
  // Emit socket event từ phía server để trigger connect_tiktok logic
  io.emit('REQUEST_CONNECT_TIKTOK', { username: username.trim().replace(/^@/, '') });
  res.json({ success: true, message: `Đang kết nối tới @${username}...` });
});

app.post('/api/tiktok/test-gift', (req, res) => {
  const { giftId, giftName, count, diamondCount, username, avatar, regionTarget } = req.body || {};
  const deltaCount = Number(count) || 1;
  const diaCount = Number(diamondCount) || 1;
  const name = username || 'Chiến Binh Áo Đỏ 🇻🇳';
  const gName = giftName || 'Hoa Hồng';
  const gId = giftId || 'rose';

  const giftPayload = {
    userId: 'test_user_' + Date.now(),
    uniqueId: 'test_user',
    nickname: name,
    username: name,
    giftId: String(gId),
    giftName: gName,
    diamondCount: diaCount,
    count: deltaCount,
    repeatCount: deltaCount,
    totalRepeatCount: deltaCount,
    profilePictureUrl: avatar || '',
    avatar: avatar || '',
    regionTarget: regionTarget || null
  };

  console.log(`[Test Gift] 🎁 ${name} tặng: ${gName} x${deltaCount} (${diaCount} xu)`);
  io.emit('tiktok_gift', giftPayload);

  const giftEvent = {
    type: 'GIFT',
    data: giftPayload,
    timestamp: Date.now()
  };
  io.emit('bando_event', giftEvent);
  io.emit('LIVE_EVENT', giftEvent);

  res.json({ success: true, gift: giftPayload });
});

// REST API Endpoints
app.get('/api/live-state', (req, res) => {
  res.json(currentMasterLiveState);
});

app.post('/api/live-state', (req, res) => {
  if (req.body) {
    currentMasterLiveState = { ...currentMasterLiveState, ...req.body, updatedAt: Date.now() };
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  }
  res.json({ success: true, state: currentMasterLiveState });
});

app.get('/api/bando-state', (req, res) => {
  res.json(currentBandoGameState || {});
});

app.post('/api/bando-state', (req, res) => {
  if (req.body) {
    currentBandoGameState = req.body;
    io.emit('bando_sync', req.body);
  }
  res.json({ success: true });
});

app.get('/api/battle-state', (req, res) => {
  res.json(currentBattleGameState || {});
});

app.post('/api/battle-state', (req, res) => {
  if (req.body) {
    currentBattleGameState = req.body;
    io.emit('battle_sync', req.body);
  }
  res.json({ success: true });
});

// TTS Proxy Endpoint: Phát giọng đọc trực tiếp độ trễ cực thấp
app.get('/api/tts', (req, res) => {
  const text = (req.query.text || '').toString().trim();
  const lang = (req.query.lang || 'vi').toString().trim();
  if (!text) {
    return res.status(400).send('Missing text parameter');
  }

  const encodedText = encodeURIComponent(text.slice(0, 200));
  const encodedLang = encodeURIComponent(lang.toLowerCase().startsWith('vi') ? 'vi' : (lang || 'vi'));
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${encodedLang}&client=tw-ob`;

  https.get(ttsUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'audio/mpeg'
    }
  }, (proxyRes) => {
    if (proxyRes.statusCode !== 200) {
      return res.status(proxyRes.statusCode).send('Failed to fetch TTS');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    proxyRes.pipe(res);
  }).on('error', (err) => {
    console.warn('TTS proxy error:', err);
    res.status(500).send('TTS error');
  });
});

// AI Generation Endpoint
app.post('/api/generate-script', async (req, res) => {
  try {
    const { brain, model, duration, topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Missing topic' });

    const prompt = `Viết kịch bản livestream bán hàng khoảng ${duration} phút về chủ đề: "${topic}".\nYêu cầu: Viết tự nhiên, cuốn hút, kích thích chốt đơn, có phần chào hỏi và tương tác với người xem. Không cần ghi chú hành động phức tạp.`;

    let generatedText = '';

    if (brain === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'Gemini API Error');
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } 
    else if (brain === 'chatgpt') {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is not set' });

      // Clean up model name (e.g., 'GPT-4o-mini (Siêu rẻ, Tối ưu)' -> 'gpt-4o-mini')
      let apiModel = 'gpt-4o-mini';
      if (model.includes('GPT-4o (')) apiModel = 'gpt-4o';
      if (model.toLowerCase().includes('gpt-3.5')) apiModel = 'gpt-3.5-turbo';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: apiModel,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'OpenAI API Error');
      generatedText = data.choices?.[0]?.message?.content || '';
    }
    else {
      return res.status(400).json({ error: 'Unsupported AI Brain' });
    }

    res.json({ script: generatedText });
  } catch (error) {
    console.error('AI Gen Error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
});

// SPA Fallback: Trả về index.html cho các route / overlay
if (distPath) {
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`\n===========================================================`);
  console.log(`🚀 HỆ THỐNG AVALIVE LIVESTREAM VIP PRO ĐANG HOẠT ĐỘNG!`);
  console.log(`🌐 Màn Hình Chính & Bảng Điều Khiển: http://localhost:${PORT}`);
  console.log(`🗺️ Link Overlay Game Bản Đồ (OBS/TikTok Studio): http://localhost:${PORT}/?overlay=bando`);
  console.log(`⚔️ Link Overlay Game Chiến Đấu (OBS/TikTok Studio): http://localhost:${PORT}/?overlay=battle`);
  console.log(`===========================================================\n`);
});
