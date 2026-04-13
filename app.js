
/* ─────────────────────────────────────────────────────────────────
   SAMAD REHAN — PORTFOLIO | app.js v3 — Smooth Edition
─────────────────────────────────────────────────────────────────*/
'use strict';

/* ── 1. NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  // Toggle scrolled class
  navbar.classList.toggle('scrolled', currentScroll > 50);

  // Hide/show navbar on scroll direction (subtle)
  if (currentScroll > lastScroll && currentScroll > 200) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  lastScroll = currentScroll;
}, { passive: true });

// Reset transform on page load
navbar.style.transform = 'translateY(0)';
navbar.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s, backdrop-filter 0.4s';

/* ── 2. HAMBURGER / MOBILE MENU ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link =>
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  })
);

/* ── 3. CUSTOM CURSOR ───────────────────────────────────────────── */
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice) {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let isActive = true;
  let mouseTimeout;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Pause animation when mouse is still
    clearTimeout(mouseTimeout);
    if (!isActive) {
      isActive = true;
      requestAnimationFrame(animateCursor);
    }
    mouseTimeout = setTimeout(() => { isActive = false; }, 100);
  });

  function animateCursor() {
    if (!isActive) return;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Enhanced hover effects
  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .skill-group, .cert-card, .stat-card, .contact-pill, .btn'
  );

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'var(--accent-4)';
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'var(--accent)';
      ring.classList.remove('hovering');
    });
  });
}

/* ── 4. THREE.JS GRADIENT MESH BACKGROUND ────────────────────────── */
(function initThreeBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Check for WebGL support
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    // Fallback: hide canvas and show solid background
    canvas.style.display = 'none';
    document.body.style.background = 'var(--bg)';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Shader material for gradient mesh
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec2 uv = vUv;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

      // Mouse influence
      vec2 mouse = uMouse * aspect;
      vec2 pos = uv * aspect;
      float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length(pos - mouse));

      // Animated noise
      float time = uTime * 0.15;
      float noise1 = snoise(vec3(uv * 1.5, time * 0.5));
      float noise2 = snoise(vec3(uv * 3.0 + 100.0, time * 0.3));
      float noise3 = snoise(vec3(uv * 2.0 + 200.0, time * 0.4));

      // Combine noise layers
      float combined = noise1 * 0.5 + noise2 * 0.25 + noise3 * 0.25;

      // Mouse reactive distortion
      combined += mouseInfluence * 0.2 * sin(time * 2.0 + combined * 10.0);

      // Color palette - teal, blue, pink/coral
      vec3 color1 = vec3(0.02, 0.02, 0.03);      // Dark base
      vec3 color2 = vec3(0.04, 0.08, 0.06);      // Teal tint
      vec3 color3 = vec3(0.03, 0.04, 0.08);      // Blue tint
      vec3 color4 = vec3(0.08, 0.03, 0.05);      // Pink tint

      // Gradient mixing based on position and noise
      float gradientY = smoothstep(0.0, 1.0, uv.y + combined * 0.3);
      float gradientX = smoothstep(0.0, 1.0, uv.x + noise1 * 0.2);

      vec3 baseColor = mix(color1, color2, gradientY);
      baseColor = mix(baseColor, color3, gradientX * 0.5 + noise2 * 0.3);
      baseColor = mix(baseColor, color4, mouseInfluence * 0.3 + noise3 * 0.2);

      // Add subtle accent glow
      float glow = smoothstep(0.4, 0.0, abs(combined - 0.2)) * 0.08;
      baseColor += vec3(0.04, 1.0, 0.63) * glow * (0.5 + mouseInfluence * 0.5);

      // Vignette
      float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.2);
      baseColor *= vignette * 0.3 + 0.7;

      gl_FragColor = vec4(baseColor, 1.0);
    }
  `;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Mouse tracking with smooth interpolation
  let targetMouse = { x: 0.5, y: 0.5 };
  let currentMouse = { x: 0.5, y: 0.5 };

  document.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
  }, { passive: true });

  // Handle resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }, { passive: true });

  // Animation loop with frame skipping for performance
  let frame = 0;
  function animate() {
    frame++;

    // Smooth mouse interpolation
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

    material.uniforms.uTime.value += 0.016;
    material.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── 5. HERO TYPED TEXT ─────────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const phrases = [
    'ML Engineer.',
    'LLM Systems Builder.',
    'RAG Pipeline Architect.',
    'MLOps Practitioner.',
    'GPU Inference Optimizer.',
  ];

  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 35, PAUSE = 2000;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();

/* ── 6. SCROLL REVEAL WITH STAGGER ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;

    // Add visible class with stagger based on element order
    const items = entry.target.querySelectorAll('.reveal-item');
    if (items.length > 0) {
      items.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('visible');
        }, i * 80);
      });
    } else {
      entry.target.classList.add('visible');
    }

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
  revealObserver.observe(el);
});

/* ── 7. ANIMATED COUNTERS ───────────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });

    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ── 8. TERMINAL TYPEWRITER ─────────────────────────────────────── */
(function initTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { type: 'prompt', text: 'whoami' },
    { type: 'out',    text: 'samad_rehan — ML Engineer · LLM Systems & MLOps' },
    { type: 'prompt', text: 'cat skills.txt | head -4' },
    { type: 'kv',     key: 'focus', val: 'LLM Systems, RAG, MLOps' },
    { type: 'kv',     key: 'cloud', val: 'AWS EC2 · S3 · ECR · Docker' },
    { type: 'kv',     key: 'stack', val: 'PyTorch · FastAPI · HuggingFace' },
    { type: 'kv',     key: 'lang',  val: 'Python · C++ · SQL' },
    { type: 'prompt', text: 'echo $STATUS' },
    { type: 'green',  text: '✓ Available for new roles — 2026' },
    { type: 'prompt', text: '' },
  ];

  let li = 0;
  let isTyping = false;

  function addLine() {
    if (li >= lines.length || isTyping) return;
    isTyping = true;

    const l = lines[li++];
    const span = document.createElement('span');
    span.classList.add('t-line');

    const delay = l.type === 'prompt' ? 400 : 150;

    if (l.type === 'prompt') {
      span.innerHTML = `<span class="t-prompt">❯</span> <span class="t-cmd">${l.text}</span>`;
    } else if (l.type === 'out') {
      span.innerHTML = `<span class="t-out">${l.text}</span>`;
    } else if (l.type === 'kv') {
      span.innerHTML = `<span class="t-out"> </span><span class="t-key">${l.key}</span><span class="t-out">: </span><span class="t-val">${l.val}</span>`;
    } else if (l.type === 'green') {
      span.innerHTML = `<span class="t-green">${l.text}</span>`;
    }

    body.appendChild(span);
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      isTyping = false;
      addLine();
    }, delay);
  }

  const termObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(addLine, 300);
      termObs.disconnect();
    }
  }, { threshold: 0.3 });

  termObs.observe(document.getElementById('about'));
})();

/* ── 9. ACTIVE NAV HIGHLIGHT ────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      links.forEach(a => {
        const href = a.getAttribute('href').slice(1);
        if (href === id) {
          a.style.color = 'var(--accent)';
          a.style.background = 'rgba(10, 255, 160, 0.08)';
        } else {
          a.style.color = '';
          a.style.background = '';
        }
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));
})();

/* ── 10. SMOOTH SCROLL OFFSET ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
    ) || 72;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

/* ── 11. SKILL GROUP MOUSE TRACKING ─────────────────────────────── */
document.querySelectorAll('.skill-group, .project-card').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  });
});

/* ── 12. MAGNETIC BUTTON EFFECT ─────────────────────────────────── */
document.querySelectorAll('.btn, .contact-pill').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    if (isTouchDevice) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── 13. PARALLAX HERO EFFECT ───────────────────────────────────── */
const heroContent = document.querySelector('.hero-content');
if (heroContent && !isTouchDevice) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    heroContent.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

/* ── 14. FOOTER REVEAL ON SCROLL ────────────────────────────────── */
const footer = document.querySelector('footer');
if (footer) {
  const footerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        footer.style.opacity = '1';
        footer.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  footer.style.opacity = '0';
  footer.style.transform = 'translateY(20px)';
  footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  footerObs.observe(footer);
}

console.log('🚀 Samad Rehan Portfolio — Loaded successfully');
