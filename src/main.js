import './style.css';
import Lenis from 'lenis';
import { Experience } from './gl/Experience.js';

const isMobile =
  matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.toggle('is-mobile', isMobile);

// ---------------------------------------------------------------- WebGL
const experience = new Experience(document.getElementById('webgl'), {
  isMobile,
  reducedMotion,
});

// ---------------------------------------------------------------- smooth scroll
const lenis = new Lenis({
  duration: reducedMotion ? 0 : 1.15,
  smoothWheel: !reducedMotion,
  syncTouch: false, // native momentum feels best on phones
});

lenis.on('scroll', ({ scroll, limit }) => {
  experience.setScroll(limit > 0 ? scroll / limit : 0);
});

// anchor links scroll through lenis so the orb choreography stays smooth
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    lenis.scrollTo(target, { offset: 0 });
  });
});

// ---------------------------------------------------------------- raf loop
function raf(time) {
  lenis.raf(time);
  experience.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ---------------------------------------------------------------- preloader
const preloader = document.getElementById('preloader');
const countEl = document.getElementById('preloaderCount');
const barEl = document.getElementById('preloaderBar');

{
  let progress = 0;
  let target = 30; // fake-but-honest: ramps while fonts/GL warm up
  let done = false;
  let finishedAt = 0;

  const finish = () => {
    target = 100;
    if (!finishedAt) finishedAt = performance.now();
  };

  // real signals: fonts ready + first GL frame painted + window load
  Promise.allSettled([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res, { once: true });
    }),
  ]).then(finish);
  setTimeout(finish, 2000); // never trap the user on slow networks

  const tick = () => {
    progress += (target - progress) * 0.16;
    const v = Math.round(progress);
    countEl.textContent = v;
    barEl.style.transform = `scaleX(${progress / 100})`;

    // time-based escape hatch: never let a slow GPU stall the lerp
    const overdue = finishedAt && performance.now() - finishedAt > 800;
    if ((progress > 99 || overdue) && !done) {
      done = true;
      countEl.textContent = 100;
      preloader.classList.add('is-done');
      document.body.classList.add('is-loaded');
      setTimeout(() => preloader.remove(), 1200);
      return;
    }
    if (!done) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------------- menu
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuOverlay.setAttribute('aria-hidden', String(!open));
  const word = menuToggle.querySelector('.header__menu-word');
  word.textContent = open ? word.dataset.open : word.dataset.closed;
  if (open) lenis.stop();
  else lenis.start();
}
const closeMenu = () => menuOpen && setMenu(false);

menuToggle.addEventListener('click', () => setMenu(!menuOpen));
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ---------------------------------------------------------------- reveals
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ---------------------------------------------------------------- manifesto: word-by-word scroll reveal
const manifesto = document.getElementById('manifesto');
if (manifesto) {
  const words = manifesto.textContent.trim().split(/\s+/);
  manifesto.innerHTML = words
    .map((w) => `<span class="mw"><span>${w}</span></span>`)
    .join(' ');
  const spans = manifesto.querySelectorAll('.mw > span');

  const updateManifesto = () => {
    const rect = manifesto.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the block enters from the bottom, 1 a bit past centre
    const p = Math.min(
      1,
      Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.7))
    );
    const lit = Math.floor(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('lit', i <= lit));
  };
  lenis.on('scroll', updateManifesto);
  updateManifesto();
}

// ---------------------------------------------------------------- stat counters
const statIo = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      statIo.unobserve(entry.target);
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const t0 = performance.now();
      const dur = reducedMotion ? 1 : 1400;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => statIo.observe(el));

// ---------------------------------------------------------------- clock
const clockEl = document.getElementById('clock');
const tickClock = () => {
  const d = new Date();
  clockEl.textContent =
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0');
};
tickClock();
setInterval(tickClock, 20_000);

// ---------------------------------------------------------------- desktop-only flourishes
if (!isMobile && !reducedMotion) {
  // custom cursor with contextual labels
  const cursor = document.getElementById('cursor');
  const label = document.getElementById('cursorLabel');
  let cx = -100, cy = -100, tx = -100, ty = -100;

  window.addEventListener(
    'pointermove',
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
    },
    { passive: true }
  );

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      label.textContent = el.dataset.cursor;
      cursor.classList.add('is-label');
    });
    el.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-label');
    });
  });

  const moveCursor = () => {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(moveCursor);
  };
  requestAnimationFrame(moveCursor);
  document.body.classList.add('has-cursor');

  // magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.35;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}
