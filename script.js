(() => {
  const track     = document.getElementById('scrollTrack');
  const fill      = document.getElementById('progressFill');
  const hint      = document.getElementById('scrollHint');
  const nav       = document.querySelector('.nav');
  const panels    = document.querySelectorAll('.panel');

  let currentX    = 0;
  let targetX     = 0;
  let maxScroll   = 0;
  let raf         = null;
  let hintHidden  = false;

  /* ── Compute max scroll ──────────────────────────────────────────── */
  function getMaxScroll() {
    return track.scrollWidth - window.innerWidth;
  }

  function onResize() {
    maxScroll = getMaxScroll();
    clamp();
    apply(true);
    updateVisibility();
  }

  /* ── Smooth lerp loop ────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    currentX = lerp(currentX, targetX, 0.09);

    if (Math.abs(targetX - currentX) < 0.5) {
      currentX = targetX;
    }

    apply(false);
    updateProgress();
    updateVisibility();

    raf = requestAnimationFrame(tick);
  }

  function apply(instant) {
    const x = instant ? targetX : currentX;
    track.style.transform = `translateX(${-x}px)`;
  }

  /* ── Progress & visibility ───────────────────────────────────────── */
  function updateProgress() {
    const pct = maxScroll > 0 ? (currentX / maxScroll) * 100 : 0;
    fill.style.width = pct + '%';

    // Nav border
    nav.classList.toggle('scrolled', currentX > 10);

    // Hide scroll hint after first meaningful scroll
    if (!hintHidden && currentX > 60) {
      hint.classList.add('hidden');
      hintHidden = true;
    }
  }

  function updateVisibility() {
    panels.forEach((panel) => {
      const rect   = panel.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const inView = center > -rect.width * 0.3 && center < window.innerWidth + rect.width * 0.3;
      panel.classList.toggle('visible', inView);
    });
  }

  /* ── Input handling ──────────────────────────────────────────────── */
  function clamp() {
    targetX = Math.max(0, Math.min(targetX, maxScroll));
  }

  // Wheel — convert vertical wheel to horizontal scroll
  window.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Support both vertical and horizontal wheel events
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    // Normalise for different deltaMode values
    let step = delta;
    if (e.deltaMode === 1) step *= 24;   // line mode
    if (e.deltaMode === 2) step *= 300;  // page mode

    targetX += step;
    clamp();
  }, { passive: false });

  // Touch support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchPrevX  = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchPrevX  = touchStartX;
    currentX    = targetX; // snap lerp on new touch
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const dx = touchPrevX - e.touches[0].clientX;
    const dy = Math.abs(touchStartY - e.touches[0].clientY);
    const dxAbs = Math.abs(e.touches[0].clientX - touchStartX);

    // Only hijack if more horizontal than vertical
    if (dxAbs > dy) {
      e.preventDefault();
      targetX += dx;
      clamp();
    }
    touchPrevX = e.touches[0].clientX;
  }, { passive: false });

  // Keyboard arrow keys
  window.addEventListener('keydown', (e) => {
    const step = window.innerWidth * 0.85;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetX += step;
      clamp();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetX -= step;
      clamp();
    }
  });

  /* ── Init ────────────────────────────────────────────────────────── */
  window.addEventListener('resize', onResize);
  onResize();
  updateVisibility();
  requestAnimationFrame(tick);
})();
