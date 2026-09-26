const fs = require('fs');

let code = fs.readFileSync('backend/server.cjs', 'utf8');

// Function strings to insert
const extraLayersHelper = `
      function renderMultiAvatarExtraLayers(config) {
        const container = document.getElementById('multiAvatarExtraLayers');
        if (!container) return;
        const layers = (config && Array.isArray(config.extraImageLayers)) ? config.extraImageLayers : [];
        if (layers.length === 0) {
          container.innerHTML = '';
          return;
        }

        layers.forEach(function(layer) {
          if (!layer.url) return;
          let layerEl = container.querySelector('[data-layer-id="' + layer.id + '"]');
          const resolvedUrl = resolveUrl(layer.url);
          const trans = layer.transform || { x: layer.x ?? 20, y: layer.y ?? 20, width: layer.width ?? 30, height: layer.height ?? 30 };
          const isLayerVid = layer.type === 'video' || (!isImage(resolvedUrl) && resolvedUrl.endsWith('.mp4'));
          const chromaClass = (layer.chromaKey && layer.chromaKey.enabled) ? (layer.chromaKey.mode === 'blue' ? 'chroma-blue-filter' : 'chroma-green-filter') : '';

          if (!layerEl) {
            layerEl = document.createElement('div');
            layerEl.setAttribute('data-layer-id', layer.id);
            layerEl.style.position = 'absolute';
            layerEl.style.transition = 'all 0.3s ease';
            layerEl.innerHTML = '<video autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;background:transparent;display:none;"></video><img style="width:100%;height:100%;object-fit:cover;background:transparent;display:none;" />';
            container.appendChild(layerEl);
          }

          layerEl.style.left = (trans.x ?? 0) + '%';
          layerEl.style.top = (trans.y ?? 0) + '%';
          layerEl.style.width = (trans.width ?? 30) + '%';
          layerEl.style.height = (trans.height ?? 30) + '%';
          layerEl.style.zIndex = trans.zIndex || 5;
          layerEl.style.borderRadius = (trans.borderRadius || layer.borderRadius || 0) + 'px';
          layerEl.style.opacity = (trans.opacity !== undefined ? trans.opacity : (layer.opacity !== undefined ? layer.opacity : 100)) / 100;
          layerEl.className = chromaClass;

          const v = layerEl.querySelector('video');
          const img = layerEl.querySelector('img');
          if (isLayerVid) {
            if (img) img.style.display = 'none';
            if (v) {
              v.style.display = 'block';
              if (!isSameMedia(v.src, resolvedUrl)) {
                v.src = resolvedUrl;
                v.play().catch(function() {});
              }
            }
          } else {
            if (v) v.style.display = 'none';
            if (img) {
              img.style.display = 'block';
              if (img.src !== resolvedUrl) img.src = resolvedUrl;
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const lid = child.getAttribute('data-layer-id');
          if (!layers.some(function(l) { return String(l.id) === String(lid); })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }
`;

// Update renderMultiAvatarCharacters to support exact positions, speaker detection and img vs video
const newMultiCharFunction = `
      function renderMultiAvatarCharacters(config, activeSpeakerId) {
        const container = document.getElementById('multiAvatarCharacters');
        if (!container) return;
        if (!config || !Array.isArray(config.avatars)) {
          container.innerHTML = '';
          return;
        }

        const avatars = config.avatars.filter(function(a) { return a.visible !== false && a.enabled !== false; });
        avatars.forEach(function(avatar, idx) {
          let charEl = container.querySelector('[data-char-id="' + avatar.id + '"]');
          const isSpeaking = activeSpeakerId ? activeSpeakerId === avatar.id : (avatar.isSpeakingNow || avatar.isSpeaking);
          const mediaToPlay = isSpeaking && avatar.talkVideo ? avatar.talkVideo : (avatar.idleVideo || avatar.mediaUrl || avatar.resolvedVidSrc || avatar.videoUrl);
          const resolvedMedia = resolveUrl(mediaToPlay);

          const transformOverride = (config.avatarTransforms && config.avatarTransforms[avatar.id]) || avatar.transform || {
            x: idx === 0 ? 10 : 55,
            y: 15,
            width: 40,
            height: 70
          };
          const chromaClass = (avatar.chromaKey && avatar.chromaKey.enabled) ? (avatar.chromaKey.mode === 'blue' ? 'chroma-blue-filter' : 'chroma-green-filter') : '';

          if (!charEl) {
            charEl = document.createElement('div');
            charEl.setAttribute('data-char-id', avatar.id);
            charEl.style.position = 'absolute';
            charEl.style.transition = 'all 0.3s ease';
            charEl.innerHTML = '<video autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;background:transparent;"></video><img style="width:100%;height:100%;object-fit:cover;background:transparent;display:none;" />';
            container.appendChild(charEl);
          }

          charEl.style.left = (transformOverride.x ?? 0) + '%';
          charEl.style.top = (transformOverride.y ?? 0) + '%';
          charEl.style.width = (transformOverride.width ?? 40) + '%';
          charEl.style.height = (transformOverride.height ?? 70) + '%';
          charEl.style.zIndex = transformOverride.zIndex || 10;
          charEl.className = chromaClass;

          const v = charEl.querySelector('video');
          const img = charEl.querySelector('img');
          if (resolvedMedia) {
            if (isImage(resolvedMedia)) {
              if (v) v.style.display = 'none';
              if (img) {
                img.style.display = 'block';
                if (img.src !== resolvedMedia) img.src = resolvedMedia;
              }
            } else {
              if (img) img.style.display = 'none';
              if (v) {
                v.style.display = 'block';
                if (!isSameMedia(v.src, resolvedMedia)) {
                  v.src = resolvedMedia;
                  v.play().catch(function() {});
                }
              }
            }
          }
        });

        Array.from(container.children).forEach(function(child) {
          const cid = child.getAttribute('data-char-id');
          if (!avatars.some(function(a) { return a.id === cid; })) {
            const v = child.querySelector('video');
            if (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch(e) {} }
            child.remove();
          }
        });
      }
` + extraLayersHelper;

// Replace old renderMultiAvatarCharacters in both routes
const oldCharRegex = /function renderMultiAvatarCharacters\(config, activeSpeakerId\) \{[\s\S]*?child\.remove\(\);\s*\}\s*\}\s*\}/g;
code = code.replace(oldCharRegex, newMultiCharFunction.trim());

// Update applyLiveState multiStage section to call both characters and extra layers
const oldMultiStageApply = `        // 4. Hiển thị Lớp Multi-Avatar (Nếu có nhân vật hợp lệ)
        if (hasValidAvatars) {
          if (multiStage) {
            multiStage.style.display = 'block';
            multiStage.style.background = 'transparent';
          }
          renderMultiAvatarCharacters(data.multiAvatarConfig, data.activeSpeakerId);
        } else {
          if (multiStage) multiStage.style.display = 'none';
        }`;

const newMultiStageApply = `        // 4. Hiển thị Lớp Multi-Avatar & Extra Layers (Đồng bộ 100% Sân Khấu Chính)
        if (hasValidAvatars || (data.multiAvatarConfig && Array.isArray(data.multiAvatarConfig.extraImageLayers) && data.multiAvatarConfig.extraImageLayers.length > 0)) {
          if (multiStage) {
            multiStage.style.display = 'block';
            multiStage.style.background = data.multiAvatarConfig?.backgroundColor || 'transparent';
          }
          renderMultiAvatarCharacters(data.multiAvatarConfig, data.activeSpeakerId);
          renderMultiAvatarExtraLayers(data.multiAvatarConfig);
        } else {
          if (multiStage) multiStage.style.display = 'none';
        }`;

code = code.split(oldMultiStageApply).join(newMultiStageApply);

// Update PiP and Banner Transform positioning inside applyLiveState
const oldPipApply = `        // 4. Lớp Video Phụ PiP (Picture-in-Picture)
        if (pipContainer && pipVideo && pipImage) {
          const pipUrl = resolveUrl(data.secondaryMediaUrl);
          if (pipUrl) {
            const trans = data.secondaryMediaTransform || { x: 52, y: 28, width: 40, height: 48, zIndex: 25 };
            pipContainer.style.left = trans.x + '%';
            pipContainer.style.top = trans.y + '%';
            pipContainer.style.width = trans.width + '%';
            pipContainer.style.height = (trans.height || 25) + '%';
            pipContainer.style.display = 'block';`;

const newPipApply = `        // 4. Lớp Video Phụ PiP (Picture-in-Picture)
        if (pipContainer && pipVideo && pipImage) {
          const pipUrl = resolveUrl(data.secondaryMediaUrl);
          if (pipUrl) {
            const trans = data.secondaryMediaTransform || { x: 52, y: 28, width: 40, height: 48, zIndex: 25 };
            pipContainer.style.left = (trans.x ?? 52) + '%';
            pipContainer.style.top = (trans.y ?? 28) + '%';
            pipContainer.style.width = (trans.width ?? 40) + '%';
            pipContainer.style.height = (trans.height ?? 48) + '%';
            pipContainer.style.zIndex = trans.zIndex || 25;
            pipContainer.style.display = 'block';`;

code = code.split(oldPipApply).join(newPipApply);

// Update banner and title text transforms in applyLiveState
const oldBannerApply = `        // 5. Banner Hình Ảnh Overlay
        if (overlayImgEl && overlayImgContent) {
          const imgUrl = resolveUrl(data.overlayImage || data.bannerUrl || data.posterUrl);
          if (imgUrl) {
            overlayImgContent.src = imgUrl;
            overlayImgEl.style.display = 'block';
          } else {
            overlayImgEl.style.display = 'none';
          }
        }

        // 6. Tiêu Đề Chữ Overlay
        if (banner && content) {
          const txt = data.overlayText || data.title || data.stepTitle;
          if (txt && typeof txt === 'string' && txt.trim()) {
            content.innerText = txt.trim();
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        }`;

const newBannerApply = `        // 5. Banner Hình Ảnh Overlay (Đúng Tọa Độ Transform)
        if (overlayImgEl && overlayImgContent) {
          const imgUrl = resolveUrl(data.overlayImage || data.bannerUrl || data.posterUrl);
          if (imgUrl) {
            const trans = data.overlayImageTransform || { x: 10, y: 12, width: 80, height: 20, zIndex: 30 };
            overlayImgEl.style.left = (trans.x ?? 10) + '%';
            overlayImgEl.style.top = (trans.y ?? 12) + '%';
            overlayImgEl.style.width = (trans.width ?? 80) + '%';
            overlayImgEl.style.zIndex = trans.zIndex || 30;
            overlayImgContent.src = imgUrl;
            overlayImgEl.style.display = 'block';
          } else {
            overlayImgEl.style.display = 'none';
          }
        }

        // 6. Tiêu Đề Chữ Overlay (Đúng Tọa Độ Transform)
        if (banner && content) {
          const txt = data.overlayText || data.title || data.stepTitle;
          if (txt && typeof txt === 'string' && txt.trim()) {
            const trans = data.overlayTextTransform || { x: 4, y: 5, width: 92, zIndex: 35 };
            banner.style.left = (trans.x ?? 4) + '%';
            banner.style.top = (trans.y ?? 5) + '%';
            banner.style.width = (trans.width ?? 92) + '%';
            banner.style.zIndex = trans.zIndex || 35;
            content.innerText = txt.trim();
            banner.style.display = 'block';
          } else {
            banner.style.display = 'none';
          }
        }`;

code = code.split(oldBannerApply).join(newBannerApply);

fs.writeFileSync('backend/server.cjs', code);
console.log('✅ Đã cập nhật thành công toàn bộ hệ thống bố cục đa lớp cho server.cjs!');
