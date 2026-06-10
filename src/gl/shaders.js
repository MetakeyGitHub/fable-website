/**
 * All GLSL lives here. Three programs:
 *  - orb:        noise-displaced icosahedron with thin-film iridescence
 *  - particles:  GPU-animated star field orbiting the orb
 *  - backdrop:   fullscreen aurora gradient + vignette
 */

// ---------------------------------------------------------------- noise lib
const simplex3 = /* glsl */ `
  // Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// IQ cosine palette — the aurora colour ramp shared by all programs
const palette = /* glsl */ `
  vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.00, 0.33, 0.67)));
  }
  vec3 aurora(float t) {
    // bias the cosine palette toward violet → cyan → warm gold
    vec3 a = vec3(0.45, 0.40, 0.62);
    vec3 b = vec3(0.55, 0.45, 0.45);
    vec3 c = vec3(1.00, 1.00, 1.00);
    vec3 d = vec3(0.05, 0.30, 0.62);
    return a + b * cos(6.28318 * (c * t + d));
  }
`;

// ---------------------------------------------------------------- orb
export const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uPulse;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${simplex3}

  float displace(vec3 p) {
    float t = uTime * 0.25;
    float n = snoise(p * uFreq + vec3(t, t * 0.8, -t * 0.6));
    n += 0.45 * snoise(p * uFreq * 2.3 - vec3(t * 1.4, 0.0, t));
    // tap shockwave: a ring travelling outward from the "north" of the orb
    float wave = sin(p.y * 9.0 - uTime * 7.0) * uPulse * 0.22;
    return n * uAmp * 0.28 + wave;
  }

  void main() {
    vec3 pos = position + normal * displace(position);

    // recompute normals from displaced neighbours so lighting stays crisp
    float e = 0.08;
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 pT = position + tangent * e;
    vec3 pB = position + bitangent * e;
    pT += normal * displace(pT);
    pB += normal * displace(pB);
    vec3 newNormal = normalize(cross(pT - pos, pB - pos));

    vNoise = displace(position);
    vNormal = normalMatrix * newNormal;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const orbFragment = /* glsl */ `
  uniform float uHue;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${palette}

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);

    float fres = pow(1.0 - max(dot(n, v), 0.0), 1.8);

    // thin-film style banding driven by fresnel + surface noise
    vec3 irid = aurora(fres * 0.85 + vNoise * 1.4 + uHue);

    // deep, almost-black core so the rim glows like molten glass
    vec3 base = vec3(0.015, 0.014, 0.030);
    vec3 col = mix(base, irid, smoothstep(0.0, 1.0, fres) * 0.92 + 0.10);

    // two fake studio lights
    vec3 l1 = normalize(vec3(0.7, 0.9, 0.6));
    vec3 l2 = normalize(vec3(-0.8, -0.3, 0.4));
    float spec1 = pow(max(dot(reflect(-l1, n), v), 0.0), 28.0);
    float spec2 = pow(max(dot(reflect(-l2, n), v), 0.0), 60.0);
    col += spec1 * 0.55 * aurora(uHue + 0.15);
    col += spec2 * 0.35;

    // subtle inner shimmer
    col += aurora(uHue + vNoise * 0.5 + uTime * 0.02) * 0.05;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------- particles
export const particlesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uSpread;
  uniform float uScroll;

  attribute float aSeed;
  attribute float aRadius;

  varying float vSeed;
  varying float vAlpha;

  void main() {
    vSeed = aSeed;

    // each particle orbits at its own radius / speed / phase
    float speed = 0.05 + aSeed * 0.12;
    float angle = uTime * speed + aSeed * 6.28318;
    float r = aRadius * uSpread;

    vec3 p = position;
    float ca = cos(angle), sa = sin(angle);
    p = vec3(ca * p.x - sa * p.z, p.y, sa * p.x + ca * p.z) * r;

    // slow vertical breathing + scroll drift
    p.y += sin(uTime * 0.4 + aSeed * 12.0) * 0.25;
    p.y += uScroll * (0.5 + aSeed) * 1.5;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 40.0);
    vAlpha = twinkle * smoothstep(14.0, 4.0, -mvPos.z);

    float size = uSize * (0.4 + aSeed) * (1.0 / -mvPos.z) * 30.0;
    gl_PointSize = min(size, 22.0);
  }
`;

export const particlesFragment = /* glsl */ `
  uniform float uHue;

  varying float vSeed;
  varying float vAlpha;

  ${palette}

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float circle = smoothstep(0.5, 0.05, d);
    vec3 col = aurora(vSeed * 0.35 + uHue + 0.1);
    gl_FragColor = vec4(col, circle * vAlpha * 0.5);
    #include <colorspace_fragment>
  }
`;

// ---------------------------------------------------------------- backdrop
export const backdropVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const backdropFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHue;
  uniform vec2 uPointer;

  varying vec2 vUv;

  ${palette}

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;

    // deep space base
    vec3 col = mix(vec3(0.030, 0.028, 0.052), vec3(0.012, 0.012, 0.022), length(centered) * 1.6);

    // two drifting aurora glows, one follows the pointer a little
    vec2 g1 = vec2(0.30 + sin(uTime * 0.05) * 0.12, 0.72 + cos(uTime * 0.04) * 0.10);
    vec2 g2 = vec2(0.78 + cos(uTime * 0.06) * 0.10, 0.25 + sin(uTime * 0.05) * 0.12) + uPointer * 0.06;

    float d1 = smoothstep(0.75, 0.0, distance(uv, g1));
    float d2 = smoothstep(0.65, 0.0, distance(uv, g2));

    col += aurora(uHue) * d1 * d1 * 0.10;
    col += aurora(uHue + 0.45) * d2 * d2 * 0.085;

    // vignette
    col *= 1.0 - dot(centered, centered) * 0.9;

    // dither to kill gradient banding (crucial on OLED phones)
    col += (hash(uv * 821.0 + uTime) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
