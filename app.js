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
