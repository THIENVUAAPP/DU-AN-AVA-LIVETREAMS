import * as THREE from "three";
import { gradientToHexPair } from "./colorPalette";
import { startChromaKeyLoop } from "../mediaSegmentation";

const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

function loadHeadTexture(url) {
  if (!url) return null;
  if (textureCache.has(url)) return textureCache.get(url);
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(url, texture);
  return texture;
}

// Nhân vật dựng từ video (phông xanh) — dùng đúng kỹ thuật chroma-key canvas đã có ở Sàn 2D
// (mediaSegmentation.js) rồi phát canvas đó làm texture video thật cho mặt nhân vật 3D, thay vì chỉ
// hiện quả cầu màu trơn như trước (video KHÔNG hiển thị gì trên Sàn 3D là lỗi đã xác nhận).
function createChromaKeyVideoTexture(mediaUrl, chromaKeyColor) {
  const video = document.createElement("video");
  video.src = mediaUrl;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.play().catch(() => {});
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const stopLoop = startChromaKeyLoop(video, canvas, chromaKeyColor || "#00FF00");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return {
    texture,
    stop: () => {
      stopLoop();
      video.pause();
      video.src = "";
    },
  };
}

// Dựng 1 hình nhân 3D dạng khối thấp-poly (phong cách kiểu Roblox) từ nguyên khối THREE.js — không
// cần asset 3D rig sẵn (mô hình anime cao cấp như ảnh mẫu AUMIX3D là asset thương mại riêng, không
// tự tạo bằng code được). Đủ để xoay/di chuyển tay chân thật theo 3 chiều, nhìn được từ mọi góc camera.
// Trả về { group, parts } — parts chứa các khớp (hips/head/arm/leg) để hàm điệu nhảy điều khiển.
export function buildHumanoidFigure(character) {
  let gradientStr = character.gradient || "from-pink-500 to-purple-600";
  
  // Nâng cấp: Đa dạng hóa màu sắc cho nhân vật AI Clone (Đám đông)
  if (character.id === 'char_default' || character.randomizeColor) {
    const colors = ['pink', 'purple', 'blue', 'emerald', 'red', 'orange', 'amber', 'cyan', 'fuchsia', 'indigo', 'rose', 'teal'];
    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];
    gradientStr = `from-${c1}-500 to-${c2}-600`;
  }
  
  const { from, to } = gradientToHexPair(gradientStr);
  const bodyColor = new THREE.Color(from);
  const limbColor = new THREE.Color(to);

  const group = new THREE.Group();
  group.name = `character_${character.id}`;

  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5, metalness: 0.15 });
  const limbMat = new THREE.MeshStandardMaterial({ color: limbColor, roughness: 0.5, metalness: 0.15 });

  const hasMedia = character.customTexture || (character.mediaType === "video" && character.mediaUrl) || (character.mediaType === "image" && character.mediaUrl);

  // Hông — gốc xoay cho cả người (nhún/xoay thân)
  const hips = new THREE.Group();
  hips.position.y = 0.95; 
  group.add(hips);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.42, 4, 8), bodyMat);
  torso.position.y = 0.28;
  hips.add(torso);

  // Đầu/Chân dung
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.72; 
  hips.add(headGroup);

  const headMat = new THREE.MeshStandardMaterial({ color: bodyColor.clone().lerp(new THREE.Color("#ffffff"), 0.3), roughness: 0.6 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), headMat);
  headGroup.add(head);

  let videoTexture = null;
  let stopVideo = null;
  let portrait = null; // Mặt nạ (Face mask)

  const faceWidth = 0.35;
  const faceHeight = 0.35;

  if (character.customTexture) {
    const headTexture = loadHeadTexture(character.customTexture);
    portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidth, faceHeight),
      new THREE.MeshBasicMaterial({ map: headTexture, transparent: true, side: THREE.DoubleSide })
    );
    portrait.position.z = 0.2;
    headGroup.add(portrait);
  } else if (character.mediaType === "video" && character.mediaUrl) {
    const videoResult = createChromaKeyVideoTexture(character.mediaUrl, character.chromaKeyColor);
    videoTexture = videoResult.texture;
    stopVideo = videoResult.stop;
    portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidth, faceHeight),
      new THREE.MeshBasicMaterial({ map: videoTexture, transparent: true, side: THREE.DoubleSide })
    );
    portrait.position.z = 0.2;
    headGroup.add(portrait);
  } else if (character.mediaType === "image" && character.mediaUrl) {
    const headTexture = loadHeadTexture(character.mediaUrl);
    portrait = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidth, faceHeight),
      new THREE.MeshBasicMaterial({ map: headTexture, transparent: true, side: THREE.DoubleSide })
    );
    portrait.position.z = 0.2;
    headGroup.add(portrait);
  }

  function buildLimb(isArm, side) {
    const pivot = new THREE.Group();
    const x = side === "left" ? -1 : 1;
    pivot.position.set(x * (isArm ? 0.28 : 0.12), isArm ? 0.5 : 0, 0);
    const length = isArm ? 0.36 : 0.42;
    
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(isArm ? 0.07 : 0.09, length, 4, 8), limbMat);
    mesh.position.y = -length / 2 - 0.07;
    pivot.add(mesh);
    
    // Điểm cuối chi (bàn tay/bàn chân) — dùng để vẽ trail ánh sáng chạy theo chuyển động.
    const tip = new THREE.Object3D();
    tip.position.y = -length - 0.14;
    pivot.add(tip);
    hips.add(pivot);
    return { pivot, tip };
  }

  const leftArm = buildLimb(true, "left");
  const rightArm = buildLimb(true, "right");
  const leftLeg = buildLimb(false, "left");
  const rightLeg = buildLimb(false, "right");
  leftLeg.pivot.position.y = -0.14;
  rightLeg.pivot.position.y = -0.14;

  group.castShadow = true;
  group.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = false;
    }
  });

  return {
    group,
    parts: { hips, headGroup, leftArm, rightArm, leftLeg, rightLeg, portrait },
    videoTexture,
    stopVideo,
  };
}

export function disposeHumanoidFigure(group) {
  group.traverse((obj) => {
    if (obj.isMesh) {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material?.dispose();
    }
  });
}
