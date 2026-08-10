const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

let tiktokConnection = null;
let currentUsername = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`TikTok Live Connector Backend running on port ${PORT}`);
});
