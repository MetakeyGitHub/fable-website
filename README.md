# FABLE® — Digital Experience Agency

An immersive, mobile-first WebGL agency site built with **Three.js**, custom GLSL
shaders and [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll.
No frameworks, no asset downloads — every visual is generated in code.

## ✦ The experience

- **The orb** — an icosahedron displaced by layered simplex noise with a
  thin-film iridescence shader. It follows you down the page: every section is
  a keyframe (position, scale, noise amplitude/frequency, hue) and scroll
  interpolates the scene between them with smoothstep easing.
- **GPU particles** — an orbiting star field animated entirely in the vertex
  shader (zero per-frame CPU work).
- **Aurora backdrop** — a fullscreen gradient shader with drifting glows,
  vignette and per-pixel dithering to prevent banding on OLED screens.
- **Tap shockwave** — tap/click anywhere and a wave ripples through the orb.
- Word-by-word manifesto reveal, magnetic buttons, contextual cursor,
  fullscreen menu, marquee, animated counters, live clock.

## ✦ Mobile-first performance

- Adaptive resolution: a frame-time monitor steps the pixel ratio down
  (1.75 → 1) if the device can't hold ~60fps.
- LOD geometry: 48 icosahedron subdivisions on mobile vs 96 on desktop;
  500 particles vs 1300.
- Native touch momentum (Lenis `syncTouch: false`), `100svh`/`100dvh` units,
  safe-area insets, swipeable scroll-snap work carousel.
- Rendering pauses when the tab is hidden; antialiasing off on mobile
  (DPR supersampling covers it).
- Full `prefers-reduced-motion` support.
- ~150KB gzipped JS total — Three.js included.

## ✦ Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## ✦ Stack

[Vite](https://vitejs.dev) · [Three.js](https://threejs.org) · Lenis · vanilla JS · hand-written GLSL
