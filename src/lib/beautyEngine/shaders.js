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
uniform float u_rosyBlush;
uniform float u_eyeSparkle;
uniform float u_skinBright;

// Helper functions for warp
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
  return 1.0 - smoothstep(0.7, 1.1, r); // softer edges
}

float circleExclude(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center) / max(radius, 0.001);
  return smoothstep(0.5, 1.2, d); // Softer exclusion
}

// Blend modes
vec3 softLight(vec3 base, vec3 blend) {
  return mix(
    base - (1.0 - 2.0 * blend) * base * (1.0 - base),
    base + (2.0 * blend - 1.0) * (sqrt(base) - base),
    step(0.5, blend)
  );
}

void main() {
  vec2 uv = v_uv;

  // 1. Warp operations
  if (u_faceDetected > 0.5) {
    uv = bulge(uv, u_leftEye, u_eyeRadius, u_eyeEnlarge);
    uv = bulge(uv, u_rightEye, u_eyeRadius, u_eyeEnlarge);
    uv = pinch(uv, u_cheekLeft, u_cheekRadius, u_vline);
    uv = pinch(uv, u_cheekRight, u_cheekRadius, u_vline);
  }

  vec3 baseColor = texture(u_tex, uv).rgb;
  vec3 finalColor = baseColor;

  if (u_faceDetected > 0.5) {
    // 2. Skin bright (Trắng da Hàn Quốc)
    if (u_skinBright > 0.0) {
      float brightFactor = 1.0 + u_skinBright * 0.15; // Up to 1.15x brightness
      finalColor = finalColor * brightFactor;
      // Soft saturation boost for lively skin
      float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
      finalColor = mix(vec3(luminance), finalColor, 1.0 + u_skinBright * 0.25); 
    }

    // 3. Eye Sparkle (Mắt long lanh)
    if (u_eyeSparkle > 0.0) {
      float distLeftEye = distance(uv, u_leftEye) / max(u_eyeRadius, 0.001);
      float distRightEye = distance(uv, u_rightEye) / max(u_eyeRadius, 0.001);
      float eyeMask = (1.0 - smoothstep(0.3, 0.9, distLeftEye)) + (1.0 - smoothstep(0.3, 0.9, distRightEye));
      eyeMask = clamp(eyeMask, 0.0, 1.0);
      
      if (eyeMask > 0.0) {
        // Boost highlights and contrast specifically in the eyes
        vec3 sparkling = finalColor * (1.0 + u_eyeSparkle * 0.6); // brighten
        sparkling = mix(vec3(0.5), sparkling, 1.0 + u_eyeSparkle * 0.4); // contrast
        finalColor = mix(finalColor, sparkling, eyeMask);
      }
    }

    // 4. Rosy Blush (Má hồng baby)
    if (u_rosyBlush > 0.0) {
      float distLeftCheek = distance(uv, u_cheekLeft) / max(u_cheekRadius, 0.001);
      float distRightCheek = distance(uv, u_cheekRight) / max(u_cheekRadius, 0.001);
      
      // Elliptical blush shape for a natural look
      float leftCheekMask = 1.0 - smoothstep(0.2, 1.2, distLeftCheek);
      float rightCheekMask = 1.0 - smoothstep(0.2, 1.2, distRightCheek);
      float blushMask = clamp(leftCheekMask + rightCheekMask, 0.0, 1.0);
      
      if (blushMask > 0.0) {
        vec3 blushColor = vec3(0.98, 0.45, 0.55); // Baby pink
        vec3 blendedBlush = softLight(finalColor, blushColor);
        finalColor = mix(finalColor, blendedBlush, blushMask * u_rosyBlush * 0.85);
      }
    }

    // 5. Advanced Skin Polish (Bilateral Filter 24-samples)
    if (u_skinSmooth > 0.01) {
      float skinMask = ellipseMask(uv, u_faceCenter, u_faceRadius);
      // Exclude eyes and mouth smoothly
      skinMask *= circleExclude(uv, u_leftEye, u_eyeRadius * 1.4);
      skinMask *= circleExclude(uv, u_rightEye, u_eyeRadius * 1.4);
      skinMask *= circleExclude(uv, u_mouth, u_mouthRadius * 1.2);
      
      if (skinMask > 0.01) {
        float radiusPx = 2.0 + u_skinSmooth * 6.0;
        
        vec2 offsets[24];
        // Inner ring
        offsets[0]=vec2(1.0,0.0); offsets[1]=vec2(0.7,0.7); offsets[2]=vec2(0.0,1.0); offsets[3]=vec2(-0.7,0.7);
        offsets[4]=vec2(-1.0,0.0); offsets[5]=vec2(-0.7,-0.7); offsets[6]=vec2(0.0,-1.0); offsets[7]=vec2(0.7,-0.7);
        // Middle ring
        offsets[8]=vec2(2.0,0.0); offsets[9]=vec2(1.4,1.4); offsets[10]=vec2(0.0,2.0); offsets[11]=vec2(-1.4,1.4);
        offsets[12]=vec2(-2.0,0.0); offsets[13]=vec2(-1.4,-1.4); offsets[14]=vec2(0.0,-2.0); offsets[15]=vec2(1.4,-1.4);
        // Outer ring
        offsets[16]=vec2(3.0,0.0); offsets[17]=vec2(2.1,2.1); offsets[18]=vec2(0.0,3.0); offsets[19]=vec2(-2.1,2.1);
        offsets[20]=vec2(-3.0,0.0); offsets[21]=vec2(-2.1,-2.1); offsets[22]=vec2(0.0,-3.0); offsets[23]=vec2(2.1,-2.1);

        vec3 accum = finalColor;
        float weightSum = 1.0;
        float colorWeightSharpness = 30.0 - u_skinSmooth * 15.0; // Higher smooth = lower edge preservation = softer skin
        
        for (int i = 0; i < 24; i++) {
          vec2 sampleUv = uv + offsets[i] * u_texel * (radiusPx / 3.0);
          vec3 c = texture(u_tex, sampleUv).rgb;
          float colorDist = distance(c, finalColor);
          // Spatial weight is pre-baked into the concentric rings, we only need color weight
          float w = exp(-colorDist * colorDist * colorWeightSharpness);
          accum += c * w;
          weightSum += w;
        }
        vec3 blurred = accum / weightSum;
        
        // Blend back original texture slightly to preserve pores/details
        vec3 skinPolished = mix(blurred, finalColor, max(0.05, 0.15 - u_skinSmooth * 0.1)); 
        finalColor = mix(finalColor, skinPolished, clamp(u_skinSmooth * skinMask * 1.25, 0.0, 1.0));
      }
    }
  }

  outColor = vec4(finalColor, 1.0);
}`;
