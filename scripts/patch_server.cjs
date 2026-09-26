const fs = require('fs');

let code = fs.readFileSync('backend/server.cjs', 'utf8');

// 1. In both routes, calculate secMedia, secTrans, overlayImg, overlayTxt before template
const prepCode = `  const secMedia = (currentMasterLiveState && currentMasterLiveState.secondaryMediaUrl) || '';
  const secTrans = (currentMasterLiveState && currentMasterLiveState.secondaryMediaTransform) || { x: 2, y: 32, width: 47, height: 48, zIndex: 15 };
  const overlayImg = (currentMasterLiveState && currentMasterLiveState.overlayImage) || '';
  const overlayTxt = (currentMasterLiveState && currentMasterLiveState.overlayText) || '';
`;

// Insert prepCode in /live-stream route
if (!code.includes('const secMedia = (currentMasterLiveState && currentMasterLiveState.secondaryMediaUrl)')) {
  code = code.replace(
    "  const soundParam = req.query.sound !== '0';",
    prepCode + "  const soundParam = req.query.sound !== '0';"
  );
}

// 2. Fix the initial HTML template for pipContainer and banners
const oldLivePip = `    <!-- Lớp Video Phụ PiP (Picture-in-Picture) Xếp Chồng Từ Sequencer -->
    <div id="pipContainer" style="position: absolute; z-index: 25; pointer-events: none; display: none;">
      <video id="pipVideo" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.85);"></video>
      <img id="pipImage" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: none;" />
    </div>

    <!-- Lớp Banner Hình Ảnh Overlay -->
    <div id="overlayImageBanner" style="position: absolute; left: 10%; top: 12%; width: 80%; z-index: 30; text-align: center; pointer-events: none; display: none;">
      <img id="overlayImageContent" src="" alt="Banner Overlay" style="max-width: 100%; max-height: 25vh; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));" />
    </div>

    <!-- Lớp Tiêu Đề Chữ Overlay -->
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 35; text-align: center; pointer-events: none; display: none;">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);"></div>
    </div>`;

const newLivePip = `    <!-- Lớp Video Phụ PiP (Picture-in-Picture) Xếp Chồng Từ Sequencer -->
    <div id="pipContainer" style="position: absolute; left: \${secTrans.x}%; top: \${secTrans.y}%; width: \${secTrans.width}%; height: \${secTrans.height}%; z-index: \${secTrans.zIndex || 25}; pointer-events: none; display: \${secMedia ? 'block' : 'none'};">
      <video id="pipVideo" src="\${secMedia && !isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.85); display: \${secMedia && !isImageMediaHelper(secMedia) ? 'block' : 'none'};"></video>
      <img id="pipImage" src="\${secMedia && isImageMediaHelper(secMedia) ? (secMedia.startsWith('http') || secMedia.startsWith('/') ? secMedia : '/' + secMedia) : ''}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: \${secMedia && isImageMediaHelper(secMedia) ? 'block' : 'none'};" />
    </div>

    <!-- Lớp Banner Hình Ảnh Overlay -->
    <div id="overlayImageBanner" style="position: absolute; left: 10%; top: 12%; width: 80%; z-index: 30; text-align: center; pointer-events: none; display: \${overlayImg ? 'block' : 'none'};">
      <img id="overlayImageContent" src="\${overlayImg ? (overlayImg.startsWith('http') || overlayImg.startsWith('/') ? overlayImg : '/' + overlayImg) : ''}" alt="Banner Overlay" style="max-width: 100%; max-height: 25vh; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));" />
    </div>

    <!-- Lớp Tiêu Đề Chữ Overlay -->
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 35; text-align: center; pointer-events: none; display: \${overlayTxt ? 'block' : 'none'};">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);">\${overlayTxt}</div>
    </div>`;

code = code.replace(oldLivePip, newLivePip);

const oldWindowPip = `    <!-- Lớp Video Phụ PiP (Picture-in-Picture) Xếp Chồng Từ Sequencer -->
    <div id="pipContainer" style="position: absolute; z-index: 25; pointer-events: none; display: none;">
      <video id="pipVideo" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; border: 2px solid rgba(255,255,255,0.5); box-shadow: 0 10px 25px rgba(0,0,0,0.85);\"></video>
      <img id="pipImage" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: none;" />
    </div>

    <div id="overlayImageBanner" style="position: absolute; left: 10%; top: 12%; width: 80%; z-index: 30; text-align: center; pointer-events: none; display: none;">
      <img id="overlayImageContent" src="" alt="Banner Overlay" style="max-width: 100%; max-height: 25vh; object-fit: contain; border-radius: 12px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.8));" />
    </div>
    <div id="overlayTextBanner" style="position: absolute; left: 4%; top: 5%; width: 92%; z-index: 35; text-align: center; pointer-events: none; display: none;">
      <div id="overlayTextContent" style="display: inline-block; padding: 6px 14px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(2, 6, 23, 0.9); border: 1px solid #22d3ee; color: #22d3ee; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);"></div>
    </div>`;

code = code.replace(oldWindowPip, newLivePip);

// 3. Fix handlePlayPauseAction & updateDockUI & bindDockBtn in window-capture & live-stream
const oldHandlers = `      function updateDockUI() {
        const anyPaused = isStreamUserPaused || (vid && vid.paused);
        if (btnPlayPause) {
          btnPlayPause.innerHTML = anyPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng';
          btnPlayPause.style.background = anyPaused ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.15)';
          btnPlayPause.style.borderColor = anyPaused ? '#10b981' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = (!targetMuted && vid && !vid.muted) ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
          btnMuteUnmute.style.background = (!targetMuted && vid && !vid.muted) ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.15)';
          btnMuteUnmute.style.borderColor = (!targetMuted && vid && !vid.muted) ? '#06b6d4' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn Màn' : '📐 Vừa Khung';
        }
      }`;

const newHandlers = `      function updateDockUI() {
        const anyPaused = isStreamUserPaused;
        if (btnPlayPause) {
          btnPlayPause.innerHTML = anyPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng';
          btnPlayPause.style.background = anyPaused ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.15)';
          btnPlayPause.style.borderColor = anyPaused ? '#10b981' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnMuteUnmute) {
          btnMuteUnmute.innerHTML = !targetMuted ? '🔇 Tắt Tiếng' : '🔊 Bật Tiếng';
          btnMuteUnmute.style.background = !targetMuted ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.15)';
          btnMuteUnmute.style.borderColor = !targetMuted ? '#06b6d4' : 'rgba(255, 255, 255, 0.35)';
        }
        if (btnFitToggle) {
          btnFitToggle.innerHTML = currentFit === 'cover' ? '📐 Tràn Màn' : '📐 Vừa Khung';
        }
      }`;

code = code.replace(oldHandlers, newHandlers);

const oldPlayPauseAction = `      function handlePlayPauseAction(e) {
        if (!vid) return;
        if (isStreamUserPaused || vid.paused) {
          isStreamUserPaused = false;
          getAllVideos().forEach(function(v) {
            try { v.play().catch(function() {}); } catch(err) {}
          });
          safePlay();
        } else {
          isStreamUserPaused = true;
          getAllVideos().forEach(function(v) {
            try { v.pause(); } catch(err) {}
          });
        }
        updateDockUI();`;

const newPlayPauseAction = `      function handlePlayPauseAction(e) {
        isStreamUserPaused = !isStreamUserPaused;
        getAllVideos().forEach(function(v) {
          if (isStreamUserPaused) {
            try { v.pause(); } catch(err) {}
          } else {
            try { v.play().catch(function() {}); } catch(err) {}
          }
        });
        if (!isStreamUserPaused) {
          safePlay();
        }
        updateDockUI();`;

code = code.replace(oldPlayPauseAction, newPlayPauseAction);

// Fix bindDockBtn to be completely responsive
const oldBind = `      function bindDockBtn(el, actionFn) {
        if (!el) return;
        let lastAction = 0;
        function execute(e) {
          if (e) {
            try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
          }
          const now = Date.now();
          if (now - lastAction < 100) return;
          lastAction = now;
          actionFn(e);
        }
        el.addEventListener('pointerdown', execute, { passive: false });
        el.addEventListener('click', execute, { passive: false });
        el.addEventListener('touchend', execute, { passive: false });
      }`;

const newBind = `      function bindDockBtn(el, actionFn) {
        if (!el) return;
        let lastAction = 0;
        function execute(e) {
          if (e) {
            try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
          }
          const now = Date.now();
          if (now - lastAction < 80) return;
          lastAction = now;
          actionFn(e);
        }
        el.onpointerdown = execute;
        el.onclick = execute;
        el.ontouchend = execute;
      }`;

code = code.split(oldBind).join(newBind);

fs.writeFileSync('backend/server.cjs', code);
console.log('✅ Đã vá lỗi thành công cho backend/server.cjs!');
