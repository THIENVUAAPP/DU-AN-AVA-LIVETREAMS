require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const cors = require('cors');
const { WebcastPushConnection } = require('tiktok-live-connector');

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

// ⚡ LƯU TRỮ VÀ ĐỒNG BỘ TRẠNG THÁI REALTIME CHO TIKTOK LIVE STUDIO & OBS
let currentMasterLiveState = {
  stage: 'bando', // Mặc định mở Game Bản Đồ nếu đang chạy game
  aspectRatio: '9:16',
  selectedCharacter: 0,
  characterName: 'AI Idol Lan Hương',
  mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80',
  isVideo: false,
  isConnected: true,
  isDarkMode: true,
  currentLang: 'vi',
  updatedAt: Date.now()
};

let currentBandoGameState = null;
let currentBattleGameState = null;

io.on('connection', (socket) => {
  console.log('Client connected to Realtime Server:', socket.id);

  // 1. Ngay khi client mới (TikTok Live Studio, OBS, Browser) kết nối -> Gửi ngay toàn bộ state mới nhất
  if (currentMasterLiveState) {
    socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  }
  if (currentBandoGameState) {
    socket.emit('bando_sync', currentBandoGameState);
  }
  if (currentBattleGameState) {
    socket.emit('battle_sync', currentBattleGameState);
  }

  // 2. Lắng nghe cập nhật Master Live State (Đổi cảnh giữa AI Idol / Bản Đồ / Chiến Đấu)
  socket.on('MASTER_LIVE_STATE_UPDATE', (data) => {
    if (!data) return;
    currentMasterLiveState = { ...currentMasterLiveState, ...data, updatedAt: Date.now() };
    io.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  });

  socket.on('REQUEST_MASTER_LIVE_STATE', () => {
    socket.emit('MASTER_LIVE_STATE_UPDATE', currentMasterLiveState);
  });

  // 3. Lắng nghe cập nhật Game Bản Đồ 3 Miền (Cắm cờ, Điểm số, BXH, Quà tặng)
  socket.on('bando_sync', (data) => {
    if (!data) return;
    currentBandoGameState = data;
    socket.broadcast.emit('bando_sync', data);
  });

  // 4. Lắng nghe cập nhật Game Chiến Đấu PK
  socket.on('battle_sync', (data) => {
    if (!data) return;
    currentBattleGameState = data;
    socket.broadcast.emit('battle_sync', data);
  });

  // 5. Lắng nghe sự kiện quà tặng / tương tác live
  socket.on('LIVE_EVENT', (data) => {
    io.emit('LIVE_EVENT', data);
  });

  socket.on('bando_event', (data) => {
    io.emit('bando_event', data);
  });

  socket.on('connect_tiktok', (username) => {
    if (!username) return;

    if (tiktokConnection) {
      if (currentUsername === username) {
        socket.emit('tiktok_connected', { username });
        return;
      }
      tiktokConnection.disconnect();
    }

    console.log(`Connecting to TikTok username: ${username}`);
    currentUsername = username;
    
    tiktokConnection = new WebcastPushConnection(username, {
      processInitialData: false,
      enableExtendedGiftInfo: true,
      enableWebsocketUpgrade: true,
      requestPollingIntervalMs: 2000,
      clientParams: {
        "app_language": "en-US",
        "device_platform": "web"
      }
    });

    tiktokConnection.connect().then(state => {
      console.info(`Connected to roomId ${state.roomId}`);
      io.emit('tiktok_connected', { username });
    }).catch(err => {
      console.error('Failed to connect', err);
      io.emit('tiktok_error', err.toString());
    });

    // Handle TikTok Events
    tiktokConnection.on('chat', data => {
      io.emit('tiktok_chat', {
        userId: data.userId,
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        comment: data.comment,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    tiktokConnection.on('gift', data => {
      if (data.giftType === 1 && !data.repeatEnd) {
        // Streak in progress => show only once
        return;
      }
      io.emit('tiktok_gift', {
        userId: data.userId,
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        giftId: data.giftId,
        giftName: data.giftName,
        diamondCount: data.diamondCount,
        repeatCount: data.repeatCount,
        profilePictureUrl: data.profilePictureUrl
      });
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
    });

    tiktokConnection.on('member', data => {
      io.emit('tiktok_member', {
        userId: data.userId,
        uniqueId: data.uniqueId,
        nickname: data.nickname,
        profilePictureUrl: data.profilePictureUrl
      });
    });

    tiktokConnection.on('streamEnd', (actionId) => {
      console.log('Stream ended');
      io.emit('tiktok_disconnected', 'Stream ended');
      tiktokConnection = null;
    });
  });

  socket.on('disconnect_tiktok', () => {
    if (tiktokConnection) {
      tiktokConnection.disconnect();
      tiktokConnection = null;
      currentUsername = null;
      io.emit('tiktok_disconnected', 'Disconnected by user');
      console.log('Disconnected from TikTok by user');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Endpoints cho CEF Polling / Fallback
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
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
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
