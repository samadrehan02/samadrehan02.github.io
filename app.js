/* ─────────────────────────────────────────────────────────────────
   SAMAD REHAN — PORTFOLIO  |  app.js  v2
   ─────────────────────────────────────────────────────────────────*/

'use strict';

/* ── 1. CURSOR-REACTIVE LIVE BACKGROUND ────────────────────────── */
(function initBg() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let targetX = mouseX, targetY = mouseY;
  let lerpX = mouseX, lerpY = mouseY;

  // Orbs
  const orbs = [
    { x: 0.2, y: 0.3, r: 0.35, color: '#00c8ff', opacity: 0.12, speed: 0.0003 },
    { x: 0.8, y: 0.2, r: 0.3,  color: '#7b61ff', opacity: 0.1,  speed: 0.0004 },
    { x: 0.5, y: 0.8, r: 0.28, color: '#ff3cac', opacity: 0.08, speed: 0.00025 },
    { x: 0.1, y: 0.7, r: 0.2,  color: '#00c8ff', opacity: 0.06, speed: 0.0005 },
  ];
  let t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  function draw() {
    t += 1;
    // smooth lerp of cursor
    lerpX += (targetX - lerpX) * 0.06;
    lerpY += (targetY - lerpY) * 0.06;

    ctx.clearRect(0, 0, W, H);

    // Draw orbs that drift + follow cursor slightly
    orbs.forEach((orb, i) => {
      const angle = t * orb.speed * Math.PI * 2;
      const driftX = Math.sin(angle + i * 1.2) * 0.05;
      const driftY = Math.cos(angle * 0.7 + i) * 0.06;

      // Cursor pull: each orb attracted to cursor at different strengths
      const pull = 0.04 + i * 0.02;
      const cx = (orb.x + driftX + (lerpX / W - 0.5) * pull) * W;
      const cy = (orb.y + driftY + (lerpY / H - 0.5) * pull) * H;
      const radius = orb.r * Math.min(W, H);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, hexToRgba(orb.color, orb.opacity));
      grad.addColorStop(1, hexToRgba(orb.color, 0));

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Cursor glow
    const glowSize = 200;
    const glowGrad = ctx.createRadialGradient(lerpX, lerpY, 0, lerpX, lerpY, glowSize);
    glowGrad.addColorStop(0, 'rgba(0,200,255,0.07)');
    glowGrad.addColorStop(1, 'rgba(0,200,255,0)');
    ctx.beginPath();
    ctx.arc(lerpX, lerpY, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    requestAnimationFrame(draw);
  }
  draw();

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
})();

/* ── 2. NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── 3. HAMBURGER / MOBILE MENU ─────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link =>
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/* ── 4. CUSTOM CURSOR ───────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
}, { passive: true });

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

const hoverTargets = 'a, button, .project-card, .skill-group, .cert-card, .skill-tags span, .contact-pill, .social-link';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

/* ── 5. SPOTLIGHT on CARDS (mouse position tracking) ───────────── */
document.querySelectorAll('.project-card, .skill-group').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
  });
});

/* ── 6. HERO TYPED TEXT ─────────────────────────────────────────── */
(function initTyped() {
  const el      = document.getElementById('heroTyped');
  const phrases = [
    'ML Engineer.',
    'LLM Systems Builder.',
    'RAG Pipeline Architect.',
    'MLOps Practitioner.',
    'GPU Inference Optimizer.',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 55, SPEED_DEL = 28, PAUSE = 2000;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, PAUSE); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();

/* ── 7. SCROLL REVEAL ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    entry.target.querySelectorAll('.reveal-child').forEach((child, i) => {
      setTimeout(() => child.classList.add('visible'), i * 120);
    });
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 8. ANIMATED COUNTERS ───────────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = target / 70;
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); return; }
        el.textContent = Math.floor(current);
      }, 14);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });
const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ── 9. TERMINAL TYPEWRITER ─────────────────────────────────────── */
(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'samad_rehan  # ML Engineer · LLM Systems & MLOps' },
    { type: 'prompt', text: 'cat skills.txt | head -4' },
    { type: 'kv',     key: 'focus',  val: 'LLM Systems, RAG, MLOps' },
    { type: 'kv',     key: 'cloud',  val: 'AWS EC2 · S3 · ECR · Docker' },
    { type: 'kv',     key: 'stack',  val: 'PyTorch · FastAPI · HuggingFace' },
    { type: 'kv',     key: 'lang',   val: 'Python · C++ · SQL' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'green',  text: '✓ Available for new roles — 2026' },
    { type: 'prompt', text: '' },
  ];

  let li = 0;
  function addLine() {
    if (li >= lines.length) return;
    const l    = lines[li++];
    const span = document.createElement('span');
    span.classList.add('t-line');
    if (l.type === 'prompt') {
      span.innerHTML = `<span class="t-prompt">❯</span> <span class="t-cmd">${l.text}</span>`;
    } else if (l.type === 'out') {
      span.innerHTML = `<span class="t-out">${l.text}</span>`;
    } else if (l.type === 'kv') {
      span.innerHTML = `<span class="t-out">  </span><span class="t-key">${l.key}</span><span class="t-out">: </span><span class="t-val">${l.val}</span>`;
    } else if (l.type === 'green') {
      span.innerHTML = `<span class="t-green">${l.text}</span>`;
    }
    body.appendChild(span);
    body.scrollTop = body.scrollHeight;
    setTimeout(addLine, l.type === 'prompt' ? 300 : 130);
  }

  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { addLine(); termObs.disconnect(); }
  }, { threshold: 0.3 });
  termObs.observe(document.getElementById('about'));
})();

/* ── 10. ACTIVE NAV HIGHLIGHT ───────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--accent)'
          : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ── 11. SMOOTH SCROLL OFFSET ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 68;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── 12. SKILL TAG ripple click effect ──────────────────────────── */
document.querySelectorAll('.skill-tags span').forEach(tag => {
  tag.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:6px;height:6px;border-radius:50%;
      background:var(--accent);pointer-events:none;
      transform:translate(-50%,-50%) scale(0);
      animation:ripple-out .5s ease forwards;
    `;
    if (!document.querySelector('#ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple-out{to{transform:translate(-50%,-50%) scale(20);opacity:0}}';
      document.head.appendChild(s);
    }
    const rect = this.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

/* ── 13. PAGE LOAD ENTRANCE ─────────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
