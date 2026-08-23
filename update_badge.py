import sys

with open("src/components/genaidol/game/GameBanDoVietNam.jsx", "r") as f:
    content = f.read()

target = """  tex.needsUpdate = true;
  return tex;
}"""

replacement = """  tex.needsUpdate = true;
  return tex;
}

// Cache và tạo Badge Sprite 3D hiển thị Tên ID & Quà tặng của từng người xem cắm cờ
const donorBadgeTextureCache = new Map();
function getOrCreateDonorBadgeTexture(username, giftText) {
  const cacheKey = `${username || ''}_${giftText || ''}`;
  if (donorBadgeTextureCache.has(cacheKey)) {
    return donorBadgeTextureCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  // Nền badge
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.roundRect(10, 10, 620, 180, 40);
  ctx.fill();

  // Viền vàng kim
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Tên người dùng
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(username || 'Khán Giả', 320, 85);

  // Tên quà tặng và số lượng
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(giftText || '🇻🇳 Cờ Tổ Quốc', 320, 155);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  
  donorBadgeTextureCache.set(cacheKey, tex);
  if (donorBadgeTextureCache.size > 200) {
    const firstKey = donorBadgeTextureCache.keys().next().value;
    donorBadgeTextureCache.delete(firstKey);
  }
  
  return tex;
}"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open("src/components/genaidol/game/GameBanDoVietNam.jsx", "w") as f:
        f.write(content)
    print("Success: Inserted getOrCreateDonorBadgeTexture")
else:
    print("Failed to find target string")
