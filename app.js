/* ─────────────────────────────────────────────────────────────────
   SAMAD REHAN — PORTFOLIO  |  app.js
   ─────────────────────────────────────────────────────────────────*/

'use strict';

/* ── 1. NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── 2. HAMBURGER / MOBILE MENU ─────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
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

/* ── 3. CUSTOM CURSOR ───────────────────────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .project-card, .skill-group, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '54px';
    ring.style.height = '54px';
    ring.style.borderColor = 'var(--accent-2)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = 'var(--accent)';
  });
});

/* ── 4. PARTICLE CANVAS ─────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r  = Math.random() * 1.5 + .5;
  }

  particles = Array.from({ length: COUNT }, () => new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99,102,241,.6)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${(1 - d / MAX_DIST) * .25})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 5. HERO TYPED TEXT ─────────────────────────────────────────── */
(function initTyped() {
  const el     = document.getElementById('heroTyped');
  const phrases = [
    'ML Engineer.',
    'LLM Systems Builder.',
    'RAG Pipeline Architect.',
    'MLOps Practitioner.',
    'GPU Inference Optimizer.',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 60, SPEED_DEL = 30, PAUSE = 1800;

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

/* ── 6. SCROLL REVEAL ───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // stagger children
    entry.target.querySelectorAll('.reveal-child').forEach((child, i) => {
      setTimeout(() => child.classList.add('visible'), i * 100);
    });
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 7. ANIMATED COUNTERS ───────────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = target / 60;
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { el.textContent = target; clearInterval(timer); return; }
        el.textContent = Math.floor(current);
      }, 16);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ── 8. TERMINAL TYPEWRITER ─────────────────────────────────────── */
(function initTerminal() {
  const body  = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'samad_rehan  # ML Engineer @ Augurs Technologies' },
    { type: 'prompt', text: 'cat skills.txt | head -4' },
    { type: 'kv',     key: 'focus',  val: 'LLM Systems, RAG, MLOps' },
    { type: 'kv',     key: 'cloud',  val: 'AWS EC2 · S3 · ECR · Docker' },
    { type: 'kv',     key: 'stack',  val: 'PyTorch · FastAPI · HuggingFace' },
    { type: 'kv',     key: 'lang',   val: 'Python · C++ · SQL' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'green',  text: '✓ Available for new roles — Feb 2026' },
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
    setTimeout(addLine, l.type === 'prompt' ? 320 : 140);
  }

  // Start once about section is visible
  const termObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { addLine(); termObs.disconnect(); }
  }, { threshold: 0.3 });
  termObs.observe(document.getElementById('about'));
})();

/* ── 9. ACTIVE NAV HIGHLIGHT ────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--text)'
          : '';
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ── 10. SMOOTH SCROLL OFFSET ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
