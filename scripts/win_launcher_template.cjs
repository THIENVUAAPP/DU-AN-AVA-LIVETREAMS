const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const exeDir = path.dirname(process.execPath);
try {
  process.chdir(exeDir);
} catch (e) {}

// 1. Kiểm tra nếu người dùng mở trực tiếp trong file ZIP chưa giải nén
const coreCjs = path.join(exeDir, 'system', 'core.cjs');
const nodeExe = path.join(exeDir, 'system', 'node_portable', 'node.exe');
const systemDir = path.join(exeDir, 'system');

if (!fs.existsSync(coreCjs)) {
  try {
    execSync('mshta "javascript:var sh=new ActiveXObject(\'WScript.Shell\'); sh.Popup(\'Vui lòng GIẢI NÉN (Chuột phải chọn Extract All...) toàn bộ file ZIP ra thư mục trước khi mở AvaLive_Studio.exe!\', 0, \'AvaLive Studio - Nhắc Nhở\', 48); close();"');
  } catch (e) {}
  process.exit(1);
}

// 2. Dọn dẹp tiến trình cũ trên cổng 3001 nếu có
try {
  const output = execSync('netstat -aon', { encoding: 'utf8' });
  for (const line of output.split('\n')) {
    if (line.includes(':3001') && line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        try {
          execSync(`taskkill /F /PID ${pid}`);
        } catch (e) {}
      }
    }
  }
} catch (e) {}

// 3. Khởi chạy Backend Core ngầm siêu tốc
const nodeBin = fs.existsSync(nodeExe) ? nodeExe : 'node';
try {
  const child = spawn(nodeBin, ['core.cjs'], {
    cwd: systemDir,
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  });
  child.unref();
} catch (e) {
  try {
    execSync(`start "" /min "${nodeBin}" core.cjs`, { cwd: systemDir, shell: 'cmd.exe' });
  } catch (e2) {}
}

// 4. Mở giao diện ngay lập tức 0ms
const targetUrl = 'http://localhost:3001';

function openBrowser() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge64 = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome86 = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const chromeLocal = path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe');
  const coccocLocal = path.join(process.env.LOCALAPPDATA || '', 'CocCoc\\Browser\\Application\\browser.exe');
  const coccoc64 = 'C:\\Program Files\\CocCoc\\Browser\\Application\\browser.exe';
  const coccoc86 = 'C:\\Program Files (x86)\\CocCoc\\Browser\\Application\\browser.exe';

  let launchedApp = false;
  if (fs.existsSync(edge64)) {
    try { spawn(edge64, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  } else if (fs.existsSync(edge)) {
    try { spawn(edge, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  } else if (fs.existsSync(chrome)) {
    try { spawn(chrome, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  } else if (fs.existsSync(chrome86)) {
    try { spawn(chrome86, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  } else if (fs.existsSync(chromeLocal)) {
    try { spawn(chromeLocal, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  } else if (fs.existsSync(coccocLocal)) {
    try { spawn(coccocLocal, [`--app=${targetUrl}`, '--start-maximized'], { detached: true, stdio: 'ignore' }).unref(); launchedApp = true; } catch (e) {}
  }

  if (!launchedApp) {
    try {
      execSync(`start "" "${targetUrl}"`, { shell: 'cmd.exe' });
    } catch (e) {
      try { execSync(`explorer "${targetUrl}"`); } catch (e2) {}
    }
  }

  setTimeout(() => {
    process.exit(0);
  }, 800);
}

// Kiểm tra polling server sẵn sàng trong tối đa 3 giây
let retries = 0;
const checkInterval = setInterval(() => {
  retries++;
  const req = http.get('http://127.0.0.1:3001/api/health', (res) => {
    clearInterval(checkInterval);
    openBrowser();
  });
  req.on('error', () => {
    if (retries >= 15) {
      clearInterval(checkInterval);
      openBrowser();
    }
  });
  req.setTimeout(300, () => req.destroy());
}, 200);
