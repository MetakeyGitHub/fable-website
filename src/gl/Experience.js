import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  IcosahedronGeometry,
  PlaneGeometry,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Mesh,
  Points,
  AdditiveBlending,
  MathUtils,
  Clock,
} from 'three';

import {
  orbVertex,
  orbFragment,
  particlesVertex,
  particlesFragment,
  backdropVertex,
  backdropFragment,
} from './shaders.js';

const { lerp, clamp } = MathUtils;

/**
 * Scroll choreography — the scene state at key points of the page.
 * `at` is overall scroll progress (0..1). Everything in between is lerped.
 */
const KEYFRAMES = [
  { at: 0.0,  x: 0.0,  y: -0.2, scale: 1.00, amp: 1.20, freq: 1.5, hue: 0.00, spread: 1.00, rot: 0.15 }, // hero
  { at: 0.16, x: 1.5,  y: 0.1,  scale: 0.62, amp: 2.10, freq: 2.4, hue: 0.10, spread: 1.35, rot: 0.45 }, // marquee
  { at: 0.40, x: -1.6, y: 0.0,  scale: 0.80, amp: 0.70, freq: 3.6, hue: 0.28, spread: 1.10, rot: 0.25 }, // work
  { at: 0.62, x: 1.6,  y: -0.2, scale: 0.58, amp: 2.60, freq: 1.2, hue: 0.46, spread: 1.60, rot: 0.60 }, // services
  { at: 0.84, x: 0.0,  y: 0.0,  scale: 1.20, amp: 0.45, freq: 2.0, hue: 0.62, spread: 0.70, rot: 0.10 }, // manifesto
  { at: 1.0,  x: 0.0,  y: 0.15, scale: 0.92, amp: 2.50, freq: 2.8, hue: 0.78, spread: 2.20, rot: 0.80 }, // contact
];

export class Experience {
  constructor(canvas, { isMobile, reducedMotion }) {
    this.canvas = canvas;
    this.isMobile = isMobile;
    this.reducedMotion = reducedMotion;

    this.scroll = 0;          // smoothed page progress 0..1
    this.pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    this.pulse = 0;
    this.running = true;

    // adaptive quality: step the pixel ratio down if frames get slow
    this.dprSteps = isMobile ? [1.75, 1.5, 1.25, 1] : [2, 1.75, 1.5, 1.25];
    this.dprIndex = 0;
    this.slowFrames = 0;

    this.clock = new Clock();

    this.initRenderer();
    this.initScene();
    this.bindEvents();
    this.resize();
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.dprSteps[0]));
  }

  initScene() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(42, 1, 0.1, 50);
    this.camera.position.z = 5;

    // --- backdrop: fullscreen quad, drawn behind everything
    this.backdrop = new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({
        vertexShader: backdropVertex,
        fragmentShader: backdropFragment,
        uniforms: {
          uTime: { value: 0 },
          uHue: { value: 0 },
          uPointer: { value: { x: 0, y: 0 } },
        },
        depthWrite: false,
        depthTest: false,
      })
    );
    this.backdrop.frustumCulled = false;
    this.backdrop.renderOrder = -1;
    this.scene.add(this.backdrop);

    // --- the orb: lower subdivision on mobile, identical silhouette
    const detail = this.isMobile ? 48 : 72;
    this.orb = new Mesh(
      new IcosahedronGeometry(1, detail),
      new ShaderMaterial({
        vertexShader: orbVertex,
        fragmentShader: orbFragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 1.2 },
          uFreq: { value: 1.5 },
          uHue: { value: 0 },
          uPulse: { value: 0 },
        },
      })
    );
    this.scene.add(this.orb);

    // --- particles
    const count = this.isMobile ? 500 : 1300;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const radii = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // random direction on a sphere shell (radius folded into aRadius)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.cos(phi) * 0.8;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta);
      seeds[i] = Math.random();
      radii[i] = 1.6 + Math.random() * 2.6;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
    geo.setAttribute('aRadius', new BufferAttribute(radii, 1));

    this.particles = new Points(
      geo,
      new ShaderMaterial({
        vertexShader: particlesVertex,
        fragmentShader: particlesFragment,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: this.isMobile ? 6 : 8 },
          uSpread: { value: 1 },
          uScroll: { value: 0 },
          uHue: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      })
    );
    this.scene.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener(
      'pointermove',
      (e) => {
        this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true }
    );

    // tap / click anywhere sends a shockwave through the orb
    window.addEventListener(
      'pointerdown',
      () => {
        this.pulse = 1;
      },
      { passive: true }
    );

    document.addEventListener('visibilitychange', () => {
      this.running = document.visibilityState === 'visible';
      if (this.running) this.clock.getDelta(); // swallow the gap
    });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.viewport = { w, h };
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /** progress: raw page scroll 0..1 (already smoothed by Lenis) */
  setScroll(progress) {
    this.scroll = clamp(progress, 0, 1);
  }

  /** interpolate the keyframe track at current scroll position */
  sampleKeyframes() {
    const p = this.scroll;
    let a = KEYFRAMES[0];
    let b = KEYFRAMES[KEYFRAMES.length - 1];
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (p >= KEYFRAMES[i].at && p <= KEYFRAMES[i + 1].at) {
        a = KEYFRAMES[i];
        b = KEYFRAMES[i + 1];
        break;
      }
    }
    const span = b.at - a.at || 1;
    let t = (p - a.at) / span;
    t = t * t * (3 - 2 * t); // smoothstep easing between keyframes

    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      scale: lerp(a.scale, b.scale, t),
      amp: lerp(a.amp, b.amp, t),
      freq: lerp(a.freq, b.freq, t),
      hue: lerp(a.hue, b.hue, t),
      spread: lerp(a.spread, b.spread, t),
      rot: lerp(a.rot, b.rot, t),
    };
  }

  update() {
    if (!this.running) return;

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    this.watchPerformance(dt);

    // smooth the pointer
    const ease = 1 - Math.exp(-4 * dt);
    this.pointer.x += (this.pointer.tx - this.pointer.x) * ease;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * ease;

    // decay the tap shockwave
    this.pulse = Math.max(0, this.pulse - dt * 1.4);

    const k = this.sampleKeyframes();
    const motion = this.reducedMotion ? 0.25 : 1;

    // on narrow screens keep the orb closer to centre so it stays in frame
    const xRange = this.isMobile ? 0.45 : 1;

    this.orb.position.x = k.x * xRange;
    this.orb.position.y = k.y + Math.sin(t * 0.6) * 0.06 * motion;
    this.orb.scale.setScalar(k.scale * (this.isMobile ? 0.8 : 1));

    this.orb.rotation.y = t * 0.1 * k.rot * motion + this.pointer.x * 0.35;
    this.orb.rotation.x = -this.pointer.y * 0.3 + t * 0.04 * motion;

    const orbU = this.orb.material.uniforms;
    orbU.uTime.value = t * motion;
    orbU.uAmp.value = k.amp * motion + (this.reducedMotion ? 0.3 : 0);
    orbU.uFreq.value = k.freq;
    orbU.uHue.value = k.hue;
    orbU.uPulse.value = this.pulse;

    const pU = this.particles.material.uniforms;
    pU.uTime.value = t * motion;
    pU.uSpread.value = k.spread;
    pU.uScroll.value = this.scroll;
    pU.uHue.value = k.hue;
    this.particles.position.copy(this.orb.position);

    const bU = this.backdrop.material.uniforms;
    bU.uTime.value = t * motion;
    bU.uHue.value = k.hue;
    bU.uPointer.value.x = this.pointer.x;
    bU.uPointer.value.y = this.pointer.y;

    // gentle camera parallax toward the pointer
    this.camera.position.x = this.pointer.x * 0.18 * motion;
    this.camera.position.y = this.pointer.y * 0.12 * motion;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  /** drop the resolution one step if we sustain slow frames */
  watchPerformance(dt) {
    if (dt > 1 / 40) this.slowFrames++;
    else this.slowFrames = Math.max(0, this.slowFrames - 2);

    if (this.slowFrames > 90 && this.dprIndex < this.dprSteps.length - 1) {
      this.dprIndex++;
      this.slowFrames = 0;
      this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, this.dprSteps[this.dprIndex])
      );
    }
  }
}
