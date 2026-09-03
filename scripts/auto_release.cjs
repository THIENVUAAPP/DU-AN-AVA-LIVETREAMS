const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Get GitHub Token from Git Remote Origin
function getGitHubToken() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { cwd: rootDir, encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/https:\/\/([a-zA-Z0-9_]+)@github\.com/);
    if (match && match[1]) {
      return match[1];
    }
  } catch (e) {
    console.warn('⚠️ Could not extract token from git remote:', e.message);
  }
  return process.env.GITHUB_TOKEN || '';
}

const GITHUB_TOKEN = getGitHubToken();
const REPO_OWNER = 'THIENVUAAPP';
const REPO_NAME = 'DU-AN-AVA-LIVETREAMS';

// 2. Read App Version
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;
const tagName = `v${version}`;
const releaseName = `Bản cập nhật v${version}`;

console.log(`\n===========================================================`);
console.log(`🚀 TỰ ĐỘNG PHÁT HÀNH BẢN CẬP NHẬT GITHUB: ${tagName}`);
console.log(`===========================================================\n`);

// 3. Make sure package:zip is built
console.log(`[1/3] Đang đóng gói bản ZIP độc lập cho Windows & Mac...`);
try {
  execSync('npm run package:zip', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Lỗi đóng gói zip:', err);
  process.exit(1);
}

const releaseDir = path.join(rootDir, 'release_zips');
const winZipFileName = `AvaLive_VIP_PRO_Windows_v${version}.zip`;
const macZipFileName = `AvaLive_VIP_PRO_Mac_v${version}.zip`;
const winZipFilePath = path.join(releaseDir, winZipFileName);
const macZipFilePath = path.join(releaseDir, macZipFileName);

if (!fs.existsSync(winZipFilePath) || !fs.existsSync(macZipFilePath)) {
  console.error('❌ Không tìm thấy các file zip vừa tạo!');
  process.exit(1);
}

// 4. Create or Get GitHub Release
function apiRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function uploadReleaseAsset(uploadUrlTemplate, filePath, fileName) {
  const uploadUrl = uploadUrlTemplate.replace(/\{.*?\}$/, '') + `?name=${encodeURIComponent(fileName)}`;
  const parsedUrl = new URL(uploadUrl);
  const fileStats = fs.statSync(filePath);
  const fileSizeInMB = (fileStats.size / (1024 * 1024)).toFixed(1);

  console.log(`   -> Đang tải lên: ${fileName} (${fileSizeInMB} MB)...`);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'User-Agent': 'NodeJS-AutoRelease',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/zip',
        'Content-Length': fileStats.size
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`   ✅ Tải lên thành công: ${fileName}!`);
          resolve(body);
        } else {
          console.error(`   ❌ Tải lên thất bại [${res.statusCode}]:`, body);
          reject(new Error(`Failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(req);
  });
}

async function runRelease() {
  console.log(`\n[2/3] Đang tạo Release ${tagName} trên GitHub...`);

  // Check existing releases
  const checkRes = await apiRequest({
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/${tagName}`,
    method: 'GET',
    headers: {
      'User-Agent': 'NodeJS-AutoRelease',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  let release = null;
  if (checkRes.statusCode === 200) {
    console.log(`   ℹ️ Release ${tagName} đã tồn tại sẵn. Đang cập nhật assets...`);
    release = checkRes.data;
  } else {
    // Create new release
    const createRes = await apiRequest({
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
      method: 'POST',
      headers: {
        'User-Agent': 'NodeJS-AutoRelease',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    }, {
      tag_name: tagName,
      target_commitish: 'main',
      name: releaseName,
      body: `🚀 **AvaLive Livestream VIP PRO - ${releaseName}**\n\n- Tự động phát hành từ hệ thống Antigravity AI\n- Bản cài đặt Standalone Windows & Mac tích hợp sẵn Node Portable và Core bảo mật.\n\nNgười dùng có thể tải trực tiếp file ZIP về giải nén và sử dụng ngay lập tức.`,
      draft: false,
      prerelease: false
    });

    if (createRes.statusCode !== 201) {
      console.error('❌ Lỗi tạo release trên GitHub:', createRes.data);
      process.exit(1);
    }
    release = createRes.data;
    console.log(`   ✅ Đã tạo thành công GitHub Release: ${releaseName} (ID: ${release.id})`);
  }

  // Delete duplicate assets if already exist in this release
  if (Array.isArray(release.assets)) {
    for (const asset of release.assets) {
      if (asset.name === winZipFileName || asset.name === macZipFileName) {
        console.log(`   🗑️ Đang xóa asset cũ đã có trên release: ${asset.name}...`);
        await apiRequest({
          hostname: 'api.github.com',
          path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/assets/${asset.id}`,
          method: 'DELETE',
          headers: {
            'User-Agent': 'NodeJS-AutoRelease',
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
      }
    }
  }

  console.log(`\n[3/3] Đang tự động đẩy các file ZIP lên GitHub Releases...`);
  await uploadReleaseAsset(release.upload_url, winZipFilePath, winZipFileName);
  await uploadReleaseAsset(release.upload_url, macZipFilePath, macZipFileName);

  console.log(`\n===========================================================`);
  console.log(`🎉 PHÁT HÀNH HOÀN TẤT 100%! NGƯỜI DÙNG CÓ THỂ TẢI NGAY LẬP TỨC.`);
  console.log(`🔗 Link Release: https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${tagName}`);
  console.log(`===========================================================\n`);
}

runRelease().catch(err => {
  console.error('❌ Lỗi phát hành:', err);
  process.exit(1);
});
