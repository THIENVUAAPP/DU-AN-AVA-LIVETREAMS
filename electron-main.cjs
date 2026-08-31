const { app, BrowserWindow } = require('electron');
const path = require('path');

// Khởi chạy Backend Server tích hợp
try {
  process.env.PORT = process.env.PORT || '3001';
  require('./backend/server.cjs');
} catch (err) {
  console.log('[AvaLive Desktop] Backend note:', err.message);
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'AvaLive VIP PRO - Livestream Studio AI',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false,
      webSecurity: false
    }
  });

  const loadApp = () => {
    win.loadURL('http://localhost:3001/desktop').catch(() => {
      setTimeout(() => {
        win.loadURL('http://localhost:3001/desktop').catch(() => {
          win.loadFile(path.join(__dirname, 'dist', 'index.html'));
        });
      }, 800);
    });
  };

  loadApp();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

