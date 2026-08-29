const { app, BrowserWindow } = require('electron');
const path = require('path');

// Vô hiệu hoá tăng tốc phần cứng (Hardware Acceleration) để cho phép OBS / TikTok Studio quay màn hình cửa sổ (Window Capture) không bị đen
app.disableHardwareAcceleration();

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
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
