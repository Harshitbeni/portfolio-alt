export const GLSL300_VERT = /* glsl */ `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const WAVEFORM_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uStop0;
uniform vec3 uStop1;
uniform vec3 uStop2;
uniform vec3 uStop3;
uniform vec3 uStop4;
uniform vec3 uStop5;
uniform float uStopCount;
uniform float uCount;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaviness;
uniform float uThickness;
uniform float uGlow;
uniform float uTaper;
uniform float uSpread;
uniform float uHueShift;
uniform float uIntensity;
uniform float uOpacity;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

const float PI = 3.14159265;

vec3 sampleStops(float t) {
  float n = max(uStopCount, 1.0);
  float wrapped = fract(t);
  float scaled = wrapped * n;
  float idx = floor(scaled);
  float mixT = fract(scaled);
  int i0 = int(idx);
  int i1 = int(mod(idx + 1.0, n));
  vec3 a = uStop0;
  vec3 b = uStop0;
  if (i0 == 1) a = uStop1;
  if (i0 == 2) a = uStop2;
  if (i0 == 3) a = uStop3;
  if (i0 == 4) a = uStop4;
  if (i0 == 5) a = uStop5;
  if (i1 == 1) b = uStop1;
  if (i1 == 2) b = uStop2;
  if (i1 == 3) b = uStop3;
  if (i1 == 4) b = uStop4;
  if (i1 == 5) b = uStop5;
  return mix(a, b, mixT);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  uv /= max(uScale, 0.0001);

  float energy = clamp(0.06 + uIntensity * 0.94, 0.0, 1.0);
  float envelope = pow(max(cos(uv.x * PI * 1.28), 0.0), max(uTaper, 0.001));

  vec3 color = vec3(0.0);
  float strands = clamp(uCount, 1.0, 12.0);

  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    if (fi >= strands) break;

    float phase = fi * uSpread * 1.68;
    float freq = (2.05 + fi * 0.34) * uWaviness;
    float tempo = 1.38 + fi * 1.18;
    float clock = uTime * uSpeed;

    float wave = sin(uv.x * freq + clock * tempo + phase) * 0.61
      + sin(uv.x * freq * 1.09 - clock * tempo * 0.69 + phase * 1.68) * 0.39;

    float lift = wave * uAmplitude * envelope * (0.1 + 0.02 * energy);
    float dist = abs(uv.y - lift);
    float width = (0.0012 + 0.049 * energy) * (0.36 + envelope) * uThickness;
    float ribbon = width / (dist + width * 0.45);
    ribbon *= ribbon;

    float tone = fi / strands + uv.x * 0.29 + uTime * 0.038 + uHueShift;
    color += sampleStops(tone) * ribbon * envelope;
  }

  color *= 0.45 + 0.7 * energy;
  color = 1.0 - exp(-color * uGlow);

  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = max(mix(vec3(luma), color, uSaturation), 0.0);

  float alpha = clamp(max(max(color.r, color.g), color.b), 0.0, 1.0) * uOpacity;
  fragColor = vec4(color * uOpacity, alpha);
}
`;

export const GLASS_FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D uScene;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uRefraction;
uniform float uDispersion;

out vec4 fragColor;

vec2 toUv(vec2 p) {
  return p * (uResolution.y / uResolution) + 0.5;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  float dist = length(p);
  float radius = uRadius;
  float aa = fwidth(dist) * 1.5;
  float mask = 1.0 - smoothstep(radius - aa, radius + aa, dist);
  if (mask <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  float z = sqrt(max(radius * radius - dist * dist, 0.0)) / max(radius, 1e-4);
  float nd = dist / max(radius, 1e-4);
  vec2 dir = dist > 0.0 ? p / dist : vec2(0.0);
  float lens = smoothstep(0.84, 1.0, nd) * pow(nd, 6.0);
  vec2 warp = -dir * lens * uRefraction * 0.15;
  vec2 split = -dir * lens * uDispersion * 0.012;

  vec3 light;
  light.r = texture(uScene, toUv(p + warp - split)).r;
  light.g = texture(uScene, toUv(p + warp)).g;
  light.b = texture(uScene, toUv(p + warp + split)).b;

  float fresnel = pow(1.0 - z, 3.0);
  vec3 rim = vec3(fresnel * 0.18);
  vec2 lamp = normalize(vec2(-0.55, 0.6));
  float spec = pow(max(dot(p / max(radius, 1e-4), lamp), 0.0), 6.0);
  spec *= smoothstep(radius, radius * 0.55, dist) * 0.4;

  vec3 rgb = light + rim + vec3(spec);
  float glowA = clamp(max(max(rgb.r, rgb.g), rgb.b), 0.0, 1.0);
  float bodyA = 0.05 + fresnel * 0.05;
  float alpha = (glowA + bodyA * (1.0 - glowA)) * mask;
  fragColor = vec4(rgb * mask, alpha);
}
`;
