(() => {
  const fill    = document.getElementById('progressFill');
  const hint    = document.getElementById('scrollHint');
  const nav     = document.querySelector('.nav');
  const panels  = document.querySelectorAll('.panel');

  let hintHidden = false;

  /* ── Progress & visibility ───────────────────────────────────────── */
  function onScroll() {
    const scrollY  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

    fill.style.width = pct + '%';
    nav.classList.toggle('scrolled', scrollY > 10);

    if (!hintHidden && scrollY > 60) {
      hint.classList.add('hidden');
      hintHidden = true;
    }

    updateVisibility();
  }

  function updateVisibility() {
    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      panel.classList.toggle('visible', inView);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateVisibility();
  onScroll();
})();
