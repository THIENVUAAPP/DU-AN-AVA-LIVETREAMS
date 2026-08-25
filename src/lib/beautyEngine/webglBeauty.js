import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders';
import { loadFaceLandmarker, detectLandmarks, LANDMARK_INDEX } from './faceLandmarker';

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Lỗi biên dịch shader: ${info}`);
  }
  return shader;
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Lỗi link WebGL program: ${info}`);
  }
  return program;
}

function createDisabledEngine(canvas) {
  return {
    canvas,
    render: () => {},
    isReady: () => false,
    hasFailed: () => true,
    destroy: () => {},
  };
}

const LANDMARK_DETECT_INTERVAL_MS = 60; // ~16fps detect — warp/blur vẫn vẽ 60fps bằng landmark đã cache

// Beauty Engine v2 — chạy độc lập, tự quản lý canvas WebGL offscreen riêng.
// Bên gọi (ProductionStudio) chỉ cần gọi render() mỗi frame rồi đọc .canvas
// khi isReady() === true; nếu không, phải tự fallback về pipeline CSS filter cũ.
export function createBeautyEngine({ onError } = {}) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });

  if (!gl) {
    onError?.(new Error('Trình duyệt không hỗ trợ WebGL2 — không thể chạy Beauty Engine v2.'));
    return createDisabledEngine(canvas);
  }

  let program;
  try {
    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
  } catch (err) {
    onError?.(err);
    return createDisabledEngine(canvas);
  }

  gl.useProgram(program);

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const uNames = [
    'u_tex', 'u_texel', 'u_faceDetected', 'u_leftEye', 'u_rightEye', 'u_eyeRadius',
    'u_cheekLeft', 'u_cheekRight', 'u_cheekRadius', 'u_faceCenter', 'u_faceRadius',
    'u_mouth', 'u_mouthRadius', 'u_eyeEnlarge', 'u_vline', 'u_skinSmooth',
    'u_rosyBlush', 'u_eyeSparkle', 'u_skinBright',
  ];
  const uniforms = {};
  uNames.forEach((n) => { uniforms[n] = gl.getUniformLocation(program, n); });

  let landmarker = null;
  let landmarkerFailed = false;
  loadFaceLandmarker().then((lm) => { landmarker = lm; }).catch((err) => {
    landmarkerFailed = true;
    onError?.(err);
  });

  let lastLandmarks = null;
  let lastDetectTime = 0;
  let ready = false;
  let destroyed = false;

  const detect = (videoEl, now) => {
    if (!landmarker || now - lastDetectTime < LANDMARK_DETECT_INTERVAL_MS) return;
    lastDetectTime = now;
    try {
      const pts = detectLandmarks(landmarker, videoEl, now);
      if (pts) lastLandmarks = pts;
    } catch {
      // Bỏ qua lỗi detect của 1 frame đơn lẻ (video chưa sẵn sàng...) — landmark
      // cũ vẫn được tái sử dụng, không làm gián đoạn render.
    }
  };

  const render = (videoEl, params) => {
    if (destroyed || !videoEl || videoEl.readyState < 2 || videoEl.videoWidth === 0) return;
    const W = videoEl.videoWidth, H = videoEl.videoHeight;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }

    const now = performance.now();
    detect(videoEl, now);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoEl);

    gl.useProgram(program);
    gl.uniform1i(uniforms.u_tex, 0);
    gl.uniform2f(uniforms.u_texel, 1 / W, 1 / H);

    if (lastLandmarks) {
      const L = LANDMARK_INDEX;
      const p = (i) => [lastLandmarks[i].x, lastLandmarks[i].y];
      const leftEye = p(L.leftEyeCenter);
      const rightEye = p(L.rightEyeCenter);
      const leftEyeOuter = p(L.leftEyeOuter);
      const chin = p(L.chinTip);
      const leftCheek = p(L.leftCheek);
      const rightCheek = p(L.rightCheek);
      const faceTop = p(L.faceOvalTop);
      const mouthU = p(L.mouthUpper);
      const mouthL = p(L.mouthLower);

      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const eyeRadius = Math.max(0.02, dist(leftEye, leftEyeOuter) * 2.4);
      const cheekRadius = Math.max(0.04, dist(leftCheek, chin) * 0.85);
      const faceCenter = [(leftCheek[0] + rightCheek[0]) / 2, (faceTop[1] + chin[1]) / 2];
      const faceRadius = [
        Math.max(0.05, Math.abs(rightCheek[0] - leftCheek[0]) / 2 * 1.05),
        Math.max(0.05, Math.abs(chin[1] - faceTop[1]) / 2 * 1.05),
      ];
      const mouth = [(mouthU[0] + mouthL[0]) / 2, (mouthU[1] + mouthL[1]) / 2];
      const mouthRadius = Math.max(0.03, dist(mouthU, mouthL) * 3.0);

      gl.uniform1f(uniforms.u_faceDetected, 1.0);
      gl.uniform2f(uniforms.u_leftEye, leftEye[0], leftEye[1]);
      gl.uniform2f(uniforms.u_rightEye, rightEye[0], rightEye[1]);
      gl.uniform1f(uniforms.u_eyeRadius, eyeRadius);
      gl.uniform2f(uniforms.u_cheekLeft, leftCheek[0], leftCheek[1]);
      gl.uniform2f(uniforms.u_cheekRight, rightCheek[0], rightCheek[1]);
      gl.uniform1f(uniforms.u_cheekRadius, cheekRadius);
      gl.uniform2f(uniforms.u_faceCenter, faceCenter[0], faceCenter[1]);
      gl.uniform2f(uniforms.u_faceRadius, faceRadius[0], faceRadius[1]);
      gl.uniform2f(uniforms.u_mouth, mouth[0], mouth[1]);
      gl.uniform1f(uniforms.u_mouthRadius, mouthRadius);
    } else {
      gl.uniform1f(uniforms.u_faceDetected, 0.0);
    }

    gl.uniform1f(uniforms.u_eyeEnlarge, params.eyeEnlarge ?? 0);
    gl.uniform1f(uniforms.u_vline, params.vline ?? 0);
    gl.uniform1f(uniforms.u_skinSmooth, params.skinSmooth ?? 0);
    gl.uniform1f(uniforms.u_rosyBlush, params.rosyBlush ?? 0);
    gl.uniform1f(uniforms.u_eyeSparkle, params.eyeSparkle ?? 0);
    gl.uniform1f(uniforms.u_skinBright, params.skinBright ?? 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    ready = true;
  };

  return {
    canvas,
    render,
    isReady: () => ready && !landmarkerFailed && !destroyed,
    // true chỉ khi frame gần nhất THỰC SỰ có landmark khuôn mặt để warp/mịn da —
    // isReady() chỉ nói lên WebGL context còn sống, không nói lên đã làm mịn da
    // frame này hay chưa (VD: chưa detect được mặt do góc nghiêng/thiếu sáng).
    // Bên gọi cần phân biệt 2 trạng thái này để không tắt nhầm fallback CSS.
    hasFace: () => !!lastLandmarks,
    hasFailed: () => landmarkerFailed,
    destroy: () => {
      destroyed = true;
      gl.deleteTexture(texture);
      gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
    },
  };
}
