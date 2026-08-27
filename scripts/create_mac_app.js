const fs = require('fs');
const path = require('path');

function createMacApp(targetDir, scriptPath, appName) {
  const appDir = path.join(targetDir, `${appName}.app`);
  const contentsDir = path.join(appDir, 'Contents');
  const macOsDir = path.join(contentsDir, 'MacOS');
  
  fs.mkdirSync(macOsDir, { recursive: true });
  
  const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>${appName}</string>
    <key>CFBundleIdentifier</key>
    <string>com.avalive.pro</string>
    <key>CFBundleName</key>
    <string>${appName}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.10</string>
</dict>
</plist>`;

  fs.writeFileSync(path.join(contentsDir, 'Info.plist'), plistContent);
  
  const executablePath = path.join(macOsDir, appName);
  fs.copyFileSync(scriptPath, executablePath);
  fs.chmodSync(executablePath, 0o755);
}

module.exports = createMacApp;
