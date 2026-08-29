const { app, BrowserWindow } = require('electron');
const path = require('path');

// Tăng tốc phần cứng (Hardware Acceleration) được BẬT để đảm bảo game WebGL và Video mượt mà.
// KHUYẾN CÁO: Với OBS, hãy dùng tính năng Browser Source (Web Source) với link http://127.0.0.1:5173/idol
// thay vì Window Capture để có chất lượng tốt nhất và không bị đen màn hình.

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
