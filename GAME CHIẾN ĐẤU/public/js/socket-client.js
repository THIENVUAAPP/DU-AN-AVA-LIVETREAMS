/**
 * Bọc socket.io-client thành 1 API sự kiện rõ ràng cho game.js/HUD dùng,
 * tách rời khỏi chi tiết triển khai của thư viện socket.io.
 */

import { io } from '/socket.io/socket.io.esm.min.js';

export function createSocketClient() {
  const socket = io();

  return {
    onStateFull(handler) {
      socket.on('state:full', handler);
    },
    onStateUpdate(handler) {
      socket.on('state:update', handler);
    },
    onGiftEffect(handler) {
      socket.on('gift:effect', handler);
    },
    onMatchEnded(handler) {
      socket.on('match:ended', handler);
    },
    onMatchReset(handler) {
      socket.on('match:reset', handler);
    },
    onViewerActivity(handler) {
      socket.on('viewer:activity', handler);
    },
    onDebugCommentResult(handler) {
      socket.on('debug:commentResult', handler);
    },
    onSettingsUpdate(handler) {
      socket.on('settings:update', handler);
    },
    onThemeUpdate(handler) {
      socket.on('theme:update', handler);
    },
    onTtsAnnounce(handler) {
      socket.on('tts:announce', handler);
    },
    sendDebugComment(comment) {
      socket.emit('debug:sendComment', { comment });
    },
  };
}
