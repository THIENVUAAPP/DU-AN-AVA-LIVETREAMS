const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const exeDir = path.dirname(process.execPath);
try {
  process.chdir(exeDir);
} catch (e) {}

// Kill any stale process on port 3001
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

// Start backend server
const nodeExe = path.join(exeDir, 'system', 'node_portable', 'node.exe');
const coreCjs = path.join(exeDir, 'system', 'core.cjs');
const systemDir = path.join(exeDir, 'system');

if (fs.existsSync(coreCjs)) {
  const nodeBin = fs.existsSync(nodeExe) ? nodeExe : 'node';
  const child = spawn(nodeBin, ['core.cjs'], {
    cwd: systemDir,
    detached: true,
    stdio: 'ignore',
    windowsHide: true
  });
  child.unref();
}

// Open application window in Chrome / Edge App Mode
setTimeout(() => {
  const url = 'http://localhost:3001/desktop';
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge64 = 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe';
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome86 = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
  const chromeLocal = path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe');

  if (fs.existsSync(edge)) {
    spawn(edge, [`--app=${url}`], { detached: true, stdio: 'ignore' }).unref();
  } else if (fs.existsSync(edge64)) {
    spawn(edge64, [`--app=${url}`], { detached: true, stdio: 'ignore' }).unref();
  } else if (fs.existsSync(chrome)) {
    spawn(chrome, [`--app=${url}`], { detached: true, stdio: 'ignore' }).unref();
  } else if (fs.existsSync(chrome86)) {
    spawn(chrome86, [`--app=${url}`], { detached: true, stdio: 'ignore' }).unref();
  } else if (fs.existsSync(chromeLocal)) {
    spawn(chromeLocal, [`--app=${url}`], { detached: true, stdio: 'ignore' }).unref();
  } else {
    try {
      execSync(`start "" "${url}"`, { shell: 'cmd.exe' });
    } catch (e) {}
  }
  process.exit(0);
}, 2000);
