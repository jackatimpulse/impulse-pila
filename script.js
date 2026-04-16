(() => {
  const fill   = document.getElementById('progressFill');
  const hint   = document.getElementById('scrollHint');
  const nav    = document.querySelector('.nav');
  const panels = document.querySelectorAll('.panel');

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

  /* ── Panel entrance via IntersectionObserver ─────────────────────── */
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        panelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  panels.forEach(panel => panelObserver.observe(panel));

  /* ── Element-level scroll animations ────────────────────────────── */
  const elemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        elemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-anim]').forEach(el => elemObserver.observe(el));
})();
