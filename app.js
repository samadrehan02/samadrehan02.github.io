/* =========================================================
   SCROLL REVEAL (ONCE)
   ========================================================= */

(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });
})();

/* =========================================================
   PROJECT CARD INTERACTION
   - mouse-follow glow
   - subtle 3D tilt
   - hover-gated (no random glow)
   ========================================================= */

(() => {
  const cards = document.querySelectorAll(".project");

  cards.forEach(card => {
    let rafId = null;

    function update(event) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const nx = x / rect.width - 0.5;
      const ny = y / rect.height - 0.5;

      card.style.setProperty("--ry", `${nx * -4}deg`);
      card.style.setProperty("--rx", `${ny * 4}deg`);
    }

    card.addEventListener("mouseenter", () => {
    });

    card.addEventListener("mousemove", e => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update(e);
        rafId = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mx");
      card.style.removeProperty("--my");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
})();

/* =========================================================
   FLAGSHIP TOGGLE
   ========================================================= */

(() => {
  const toggle = document.getElementById("flagshipToggle");
  const hidden = document.getElementById("flagshipHidden");

  if (!toggle || !hidden) return;

  toggle.addEventListener("click", () => {
    const isOpen = hidden.classList.contains("open");

    toggle.classList.toggle("open");

    if (!isOpen) {
      hidden.classList.add("open");
      hidden.style.maxHeight = hidden.scrollHeight + "px";
    } else {
      hidden.style.maxHeight = hidden.scrollHeight + "px";
      requestAnimationFrame(() => {
        hidden.style.maxHeight = "0px";
        hidden.classList.remove("open");
      });
    }
  });
})();

/* =========================================================
   CUSTOM CURSOR (FOLLOW + INVERT)
   ========================================================= */

(() => {
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  // Disable on reduced motion or coarse pointers
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.matchMedia("(pointer: fine)").matches
  ) {
    cursor.style.display = "none";
    document.body.style.cursor = "auto";
    return;
  }

  let x = 0, y = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener("mousemove", e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animate() {
    x += (targetX - x) * 0.18;
    y += (targetY - y) * 0.18;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(animate);
  }

  animate();

  /* -----------------------------------------
     Cursor interaction states
     ----------------------------------------- */

  document.querySelectorAll("[data-cursor], a, .project, .flagship-toggle")
    .forEach(el => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
      });
    });
})();

/* =========================================================
   SECTION HEADER SCROLL EMPHASIS
   ========================================================= */

(() => {
  const headers = document.querySelectorAll("h2");
  if (!headers.length) return;

  function update() {
    const vh = window.innerHeight;

    headers.forEach(h => {
      const rect = h.getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / vh, 0), 1);
      h.style.setProperty("--accent-strength", progress.toFixed(2));
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* =========================================================
   MICRO CLICK FEEDBACK
   ========================================================= */

(() => {
  document.addEventListener("click", e => {
    const target = e.target.closest("a, .flagship-toggle");
    if (!target) return;

    target.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.96)" },
        { transform: "scale(1)" }
      ],
      {
        duration: 160,
        easing: "ease-out"
      }
    );
  });
})();
