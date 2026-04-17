(() => {
  const fill   = document.getElementById('progressFill');
  const hint   = document.getElementById('scrollHint');
  const nav    = document.querySelector('.nav');

  let hintHidden = false;

  /* ── Progress bar & nav ──────────────────────────────────────────── */
  function onScroll() {
    const scrollY   = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = maxScroll > 0 ? (scrollY / maxScroll) * 100 + '%' : '0%';
    nav.classList.toggle('scrolled', scrollY > 10);

    if (!hintHidden && scrollY > 60) {
      hint.classList.add('hidden');
      hintHidden = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
