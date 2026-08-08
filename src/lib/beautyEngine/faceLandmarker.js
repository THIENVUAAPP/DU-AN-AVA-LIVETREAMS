import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// File nhị phân WASM (~30MB+) được nạp qua CDN chính thức của Google thay vì
// commit thẳng vào repo (public/) — commit sẽ làm phình repo & thời gian
// deploy Vercel đáng kể. Đây là cách dùng chính thức/được Google tài liệu hóa
// cho package @mediapipe/tasks-vision, khác với cách cũ (toàn bộ thư viện nạp
// qua <script> global) — ở đây API JS được import chuẩn qua npm, chỉ riêng
// asset nhị phân nặng là tải từ CDN lúc runtime.
const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

let landmarkerPromise = null;

export function loadFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      return FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });
    })();
  }
  return landmarkerPromise;
}

// Chỉ số các landmark chủ chốt (trong bộ 468 điểm chuẩn của MediaPipe Face Mesh)
// dùng cho warp control-point — không cần toàn bộ 468 điểm cho việc warp,
// chỉ cần vài điểm neo then chốt của mắt/cằm/má.
export const LANDMARK_INDEX = {
  leftEyeCenter: 33,
  rightEyeCenter: 263,
  leftEyeOuter: 130,
  rightEyeOuter: 359,
  chinTip: 152,
  leftCheek: 234,
  rightCheek: 454,
  faceOvalTop: 10,
  mouthUpper: 13,
  mouthLower: 14,
};

export function detectLandmarks(landmarker, videoSource, timestampMs) {
  if (!landmarker) return null;
  const result = landmarker.detectForVideo(videoSource, timestampMs);
  if (!result?.faceLandmarks?.length) return null;
  return result.faceLandmarks[0]; // mảng 468 điểm {x, y, z} normalized 0..1
}
