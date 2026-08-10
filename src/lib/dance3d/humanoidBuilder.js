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
  const { from, to } = gradientToHexPair(character.gradient || "from-pink-500 to-purple-600");
  const bodyColor = new THREE.Color(from);
  const limbColor = new THREE.Color(to);

  const group = new THREE.Group();
  group.name = `character_${character.id}`;

  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5, metalness: 0.15 });
  const limbMat = new THREE.MeshStandardMaterial({ color: limbColor, roughness: 0.5, metalness: 0.15 });

  // Hông — gốc xoay cho cả người (nhún/xoay thân)
  const hips = new THREE.Group();
  hips.position.y = 0.6; // Chibi lùn hơn
  group.add(hips);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.3, 4, 8), bodyMat);
  torso.position.y = 0.2;
  hips.add(torso);

  // Đầu Chibi to
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.55; 
  hips.add(headGroup);

  let videoTexture = null;
  let stopVideo = null;
  let portrait = null; 

  const headMat = new THREE.MeshStandardMaterial({ color: bodyColor.clone().lerp(new THREE.Color("#ffffff"), 0.3), roughness: 0.6 });
  const headSize = 0.45; // Đầu to chuẩn Chibi
  const headGeo = new THREE.BoxGeometry(headSize, headSize, headSize);
  
  let hasMappedFace = false;
  let faceTexture = null;

  if (character.customTexture) {
    faceTexture = loadHeadTexture(character.customTexture);
    hasMappedFace = true;
  } else if (character.mediaType === "video" && character.mediaUrl) {
    const videoResult = createChromaKeyVideoTexture(character.mediaUrl, character.chromaKeyColor);
    videoTexture = videoResult.texture;
    stopVideo = videoResult.stop;
    faceTexture = videoTexture;
    hasMappedFace = true;
  } else if (character.mediaType === "image" && character.mediaUrl) {
    faceTexture = loadHeadTexture(character.mediaUrl);
    hasMappedFace = true;
  }

  if (hasMappedFace && faceTexture) {
    // Vật liệu ốp mặt trước (index 4 trong BoxGeometry là front face)
    const faceMat = new THREE.MeshBasicMaterial({ map: faceTexture, transparent: true });
    // Thứ tự mảng vật liệu cho Box: right, left, top, bottom, front, back
    const materials = [
      headMat, // Right
      headMat, // Left
      headMat, // Top
      headMat, // Bottom
      faceMat, // FRONT (Mặt ghép ảnh)
      headMat  // Back
    ];
    const head = new THREE.Mesh(headGeo, materials);
    // Để ảnh xoay đúng chiều, có thể cần thiết lập UV hoặc lật ngang dọc tuỳ ảnh, 
    // nhưng mặc định front face của BoxGeometry hiển thị texture thẳng đứng.
    headGroup.add(head);
  } else {
    // Mặc định nếu không có ảnh, dùng khối cầu màu trơn
    const head = new THREE.Mesh(new THREE.SphereGeometry(headSize / 2, 16, 16), headMat);
    headGroup.add(head);
  }

  function buildLimb(isArm, side) {
    const pivot = new THREE.Group();
    const x = side === "left" ? -1 : 1;
    pivot.position.set(x * (isArm ? 0.22 : 0.1), isArm ? 0.35 : 0, 0); // Khớp nối hẹp lại
    const length = isArm ? 0.25 : 0.28; // Tay chân ngắn lại chuẩn Chibi
    
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(isArm ? 0.05 : 0.06, length, 4, 8), limbMat);
    mesh.position.y = -length / 2 - 0.05;
    pivot.add(mesh);
    
    // Điểm cuối chi (bàn tay/bàn chân) — dùng để vẽ trail ánh sáng chạy theo chuyển động.
    const tip = new THREE.Object3D();
    tip.position.y = -length - 0.1;
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
