// Mouse-following glow for project cards
// Scoped, performant, and safe

document.querySelectorAll('.project').forEach(card => {
  let rafId = null;

  function updateGlow(event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  }

  card.addEventListener('mousemove', event => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      updateGlow(event);
      rafId = null;
    });
  });

  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});

const toggle = document.getElementById("flagshipToggle");
const hidden = document.getElementById("flagshipHidden");

if (toggle && hidden) {
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
}
