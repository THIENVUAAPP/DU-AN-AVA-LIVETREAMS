import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

// Cùng CDN/mô hình chính thức của Google đã dùng ổn định cho FaceLandmarker (xem
// lib/beautyEngine/faceLandmarker.js) — chỉ đổi sang model dáng người (Pose) để trích chuyển động.
const WASM_BASE_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

const SAMPLE_FPS = 10;
const MAX_DURATION_SECONDS = 12;

const POSE_INDEX = {
  leftShoulder: 11, rightShoulder: 12,
  leftWrist: 15, rightWrist: 16,
  leftHip: 23, rightHip: 24,
  leftAnkle: 27, rightAnkle: 28,
};

let landmarkerPromise = null;
function loadPoseLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      return PoseLandmarker.createFromOptions(filesetResolver, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
    })();
  }
  return landmarkerPromise;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Quy đổi 1 khung landmark thô (33 điểm chuẩn hoá 0..1 của BlazePose) sang góc khớp đơn giản khớp với
// trục xoay đã dùng trong danceMotions3D.js (arm .z = giơ tay, leg .x = đá chân, hips.position.y = nảy).
// Đây là ước lượng từ 1 camera 2D phẳng (không có độ sâu thật) nên chỉ gần giống chuyển động gốc, không
// tuyệt đối khớp 100% — minh bạch giới hạn kỹ thuật này thay vì giả vờ "sao chép hoàn hảo".
function landmarksToFrame(lm, baselineShoulderY) {
  const ls = lm[POSE_INDEX.leftShoulder];
  const rs = lm[POSE_INDEX.rightShoulder];
  const lw = lm[POSE_INDEX.leftWrist];
  const rw = lm[POSE_INDEX.rightWrist];
  const lh = lm[POSE_INDEX.leftHip];
  const rh = lm[POSE_INDEX.rightHip];
  const la = lm[POSE_INDEX.leftAnkle];
  const ra = lm[POSE_INDEX.rightAnkle];

  const shoulderMid = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 };
  const hipMid = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
  const refLen = Math.max(0.05, distance(shoulderMid, hipMid));

  const raise = (shoulder, wrist) => clamp(((shoulder.y - wrist.y) / refLen) * 1.6, -0.3, 2.4);
  const legSwing = (hip, ankle) => clamp(((ankle.x - hip.x) / refLen) * 0.7, -0.7, 0.7);

  return {
    leftArmZ: raise(ls, lw),
    rightArmZ: -raise(rs, rw),
    leftLegX: legSwing(lh, la),
    rightLegX: legSwing(rh, ra),
    hipsBounceY: clamp((baselineShoulderY - shoulderMid.y) / refLen, -0.3, 0.3) * 0.12,
  };
}

function seekVideo(video, time) {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}

// Trích xuất chuyển động thật từ video mẫu do người dùng tải lên — chạy PoseLandmarker (MediaPipe) hoàn
// toàn trên trình duyệt, KHÔNG upload video lên server nào. Giới hạn 12 giây đầu, lấy mẫu 10 khung/giây
// để vừa đủ mượt vừa không làm nặng máy khi phát lại vòng lặp trên nhân vật 3D.
export async function captureMotionFromVideo(file, onProgress) {
  const landmarker = await loadPoseLandmarker();
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.src = URL.createObjectURL(file);

  await new Promise((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error('Không đọc được video mẫu — hãy chọn file .mp4/.webm hợp lệ.'));
  });

  const durationSeconds = Math.min(video.duration || MAX_DURATION_SECONDS, MAX_DURATION_SECONDS);
  const sampleCount = Math.max(1, Math.floor(durationSeconds * SAMPLE_FPS));
  const frames = [];
  let baselineShoulderY = null;

  for (let i = 0; i < sampleCount; i++) {
    const t = i / SAMPLE_FPS;
    // eslint-disable-next-line no-await-in-loop
    await seekVideo(video, t);
    const result = landmarker.detectForVideo(video, performance.now());
    const lm = result?.landmarks?.[0];
    if (lm) {
      if (baselineShoulderY === null) {
        baselineShoulderY = (lm[POSE_INDEX.leftShoulder].y + lm[POSE_INDEX.rightShoulder].y) / 2;
      }
      frames.push({ t, ...landmarksToFrame(lm, baselineShoulderY) });
    }
    onProgress?.(Math.round(((i + 1) / sampleCount) * 100));
  }

  URL.revokeObjectURL(video.src);

  if (frames.length === 0) {
    throw new Error('Không nhận diện được dáng người trong video — hãy chọn video quay rõ toàn thân, đủ sáng.');
  }

  return { frames, durationSeconds: frames[frames.length - 1].t || durationSeconds };
}
