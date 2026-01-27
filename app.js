/* =========================================================
   SCROLL REVEAL (once, intent-based)
   ========================================================= */

(() => {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    revealObserver.observe(el);
  });
})();

/* =========================================================
   PROJECT CARD INTERACTION
   - mouse-follow glow (existing behavior)
   - subtle 3D tilt (research-inspection feel)
   ========================================================= */

(() => {
  const projects = document.querySelectorAll(".project");

  projects.forEach(card => {
    let rafId = null;

    function updateInteraction(event) {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Glow position
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);

      // Normalized values for tilt
      const nx = (x / rect.width) - 0.5;
      const ny = (y / rect.height) - 0.5;

      card.style.setProperty("--ry", `${nx * -3}deg`);
      card.style.setProperty("--rx", `${ny * 3}deg`);
    }

    card.addEventListener("mousemove", event => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        updateInteraction(event);
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
   - height animation
   - chevron rotation
   - stagger handled in CSS
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
   SECTION HEADER SCROLL EMPHASIS
   - subtle reading context
   ========================================================= */

(() => {
  const headers = document.querySelectorAll("h2");
  if (!headers.length) return;

  function updateHeaderFocus() {
    const vh = window.innerHeight;

    headers.forEach(h => {
      const rect = h.getBoundingClientRect();
      const progress = 1 - Math.min(Math.max(rect.top / vh, 0), 1);
      h.style.setProperty("--accent-strength", progress.toFixed(2));
    });
  }

  window.addEventListener("scroll", updateHeaderFocus, { passive: true });
  updateHeaderFocus();
})();

/* =========================================================
   MICRO CLICK FEEDBACK
   - tactile, short, non-distracting
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

/* =========================================================
   REDUCED MOTION SAFETY NET
   ========================================================= */

(() => {
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("reduced-motion");

  document.querySelectorAll(".project").forEach(card => {
    card.style.transform = "none";
    card.style.transition = "none";
  });
})();
