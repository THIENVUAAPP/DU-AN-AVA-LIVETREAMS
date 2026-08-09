// GLSL cho pipeline Beauty Engine v2 — làm mịn da theo mask vùng da thật (giữ nét
// mắt/môi) + warp control-point cục bộ (to mắt / thon mặt V-line) dùng landmark thật.

export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_tex;
uniform vec2 u_texel;
uniform float u_faceDetected;
uniform vec2 u_leftEye;
uniform vec2 u_rightEye;
uniform float u_eyeRadius;
uniform vec2 u_cheekLeft;
uniform vec2 u_cheekRight;
uniform float u_cheekRadius;
uniform vec2 u_faceCenter;
uniform vec2 u_faceRadius;
uniform vec2 u_mouth;
uniform float u_mouthRadius;
uniform float u_eyeEnlarge;
uniform float u_vline;
uniform float u_skinSmooth;

vec2 bulge(vec2 uv, vec2 center, float radius, float strength) {
  if (strength <= 0.0001) return uv;
  vec2 delta = uv - center;
  float dist = length(delta);
  if (dist < radius && dist > 0.0001) {
    float pct = dist / radius;
    float newPct = pow(pct, 1.0 + strength * 1.6);
    delta = delta * (newPct / pct);
    return center + delta;
  }
  return uv;
}

vec2 pinch(vec2 uv, vec2 center, float radius, float strength) {
  if (strength <= 0.0001) return uv;
  vec2 delta = uv - center;
  float dist = length(delta);
  if (dist < radius && dist > 0.0001) {
    float pct = 1.0 - dist / radius;
    float factor = 1.0 + strength * pct * pct * 1.4;
    delta *= factor;
    return center + delta;
  }
  return uv;
}

float ellipseMask(vec2 uv, vec2 center, vec2 radius) {
  vec2 d = (uv - center) / max(radius, vec2(0.001));
  float r = length(d);
  return 1.0 - smoothstep(0.75, 1.05, r);
}

float circleExclude(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center) / max(radius, 0.001);
  return smoothstep(0.6, 1.1, d);
}

void main() {
  vec2 uv = v_uv;

  if (u_faceDetected > 0.5) {
    uv = bulge(uv, u_leftEye, u_eyeRadius, u_eyeEnlarge);
    uv = bulge(uv, u_rightEye, u_eyeRadius, u_eyeEnlarge);
    uv = pinch(uv, u_cheekLeft, u_cheekRadius, u_vline);
    uv = pinch(uv, u_cheekRight, u_cheekRadius, u_vline);
  }

  vec3 baseColor = texture(u_tex, uv).rgb;

  float skinMask = 0.0;
  if (u_faceDetected > 0.5 && u_skinSmooth > 0.01) {
    skinMask = ellipseMask(uv, u_faceCenter, u_faceRadius);
    skinMask *= circleExclude(uv, u_leftEye, u_eyeRadius * 1.3);
    skinMask *= circleExclude(uv, u_rightEye, u_eyeRadius * 1.3);
    skinMask *= circleExclude(uv, u_mouth, u_mouthRadius);
  }

  vec3 finalColor = baseColor;
  if (skinMask > 0.01) {
    // Multi-tap edge-preserving blur (xấp xỉ bilateral filter) — chỉ áp trong
    // vùng skinMask nên mắt/lông mày/môi luôn giữ nét.
    vec2 offsets[12];
    offsets[0]=vec2(1.0,0.0); offsets[1]=vec2(-1.0,0.0); offsets[2]=vec2(0.0,1.0); offsets[3]=vec2(0.0,-1.0);
    offsets[4]=vec2(0.7,0.7); offsets[5]=vec2(-0.7,0.7); offsets[6]=vec2(0.7,-0.7); offsets[7]=vec2(-0.7,-0.7);
    offsets[8]=vec2(1.4,0.4); offsets[9]=vec2(-1.4,0.4); offsets[10]=vec2(0.4,1.4); offsets[11]=vec2(-0.4,-1.4);

    float radiusPx = 3.0 + u_skinSmooth * 7.5;
    vec3 accum = baseColor;
    float weightSum = 1.0;
    for (int i = 0; i < 12; i++) {
      vec2 sampleUv = uv + offsets[i] * u_texel * radiusPx;
      vec3 c = texture(u_tex, sampleUv).rgb;
      float colorDist = distance(c, baseColor);
      float w = exp(-colorDist * colorDist * 22.0);
      accum += c * w;
      weightSum += w;
    }
    vec3 blurred = accum / weightSum;
    finalColor = mix(baseColor, blurred, clamp(u_skinSmooth * skinMask * 1.15, 0.0, 0.95));
  }

  outColor = vec4(finalColor, 1.0);
}`;
