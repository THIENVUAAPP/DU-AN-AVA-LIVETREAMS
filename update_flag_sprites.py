import sys

with open("src/components/genaidol/game/GameBanDoVietNam.jsx", "r") as f:
    content = f.read()

target = """          const fPlane = new THREE.Mesh(flagGeo, flagPlaneMat);
          fPlane.position.set(2.1, 5.4, 0);

          poleGroup.add(pMesh);
          poleGroup.add(sMesh);
          poleGroup.add(fPlane);

          poleGroup.position.set(p.wx, 0, p.wz);"""

replacement = """          const fPlane = new THREE.Mesh(flagGeo, flagPlaneMat);
          fPlane.position.set(2.1, 5.4, 0);

          poleGroup.add(pMesh);
          poleGroup.add(sMesh);
          poleGroup.add(fPlane);
          
          // Gắn 3D Sprite bảng tên người dùng & quà tặng ngay trên đỉnh cột cờ 3D
          const giftText = p.giftName ? `🎁 ${p.giftName} (+${p.count || 1} Ô)` : `🇻🇳 +${p.count || 1} Ô Cờ`;
          const badgeTex = getOrCreateDonorBadgeTexture(p.username, giftText);
          if (badgeTex) {
            const badgeSpriteMat = new THREE.SpriteMaterial({ map: badgeTex, depthTest: false, transparent: true });
            const badgeSprite = new THREE.Sprite(badgeSpriteMat);
            badgeSprite.position.set(0, 10.2, 0);
            badgeSprite.scale.set(10.5, 3.3, 1);
            poleGroup.add(badgeSprite);
          }

          poleGroup.position.set(p.wx, 0, p.wz);"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open("src/components/genaidol/game/GameBanDoVietNam.jsx", "w") as f:
        f.write(content)
    print("Success: Updated flag sprite logic")
else:
    print("Failed to find target string for flag sprites")
