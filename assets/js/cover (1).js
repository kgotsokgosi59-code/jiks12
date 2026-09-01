/* cover.js — splash page. Two jobs:
   1. fit the composition to the screen so it fills a phone, an iPad and a laptop
   2. take the visitor through to home.html

   Accessibility: the auto-advance is cancelled by ANY interaction (click, key,
   scroll, touch, focus) and is skipped entirely for visitors who prefer reduced
   motion. The "Enter the site" link is a real link, so it works without JS —
   and so does the cover's sizing, which falls back to the clamp() values in
   cover.css if this script never runs. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- fit ----
     cover.css sizes everything from --cov / --cov-p / --cov-g (landscape,
     portrait, landscape-phone). Here we bisect for the largest multiplier
     whose content still fits the viewport, so the cover fills the screen on
     any device instead of sitting small in the middle. */
  var VARS = ['--cov', '--cov-p', '--cov-g'];
  var cover = document.querySelector('.cover');
  var inner = cover && document.querySelector('.cover-inner');

  function setScale(k) {
    for (var i = 0; i < VARS.length; i++) cover.style.setProperty(VARS[i], k);
  }

  function contentHeight() {
    return inner.getBoundingClientRect().height;
  }

  function overflows() {
    return document.documentElement.scrollHeight > window.innerHeight + 2 ||
           document.documentElement.scrollWidth > window.innerWidth;
  }

  function fit() {
    if (!cover || !inner) return;
    setScale(1);
    var cs = getComputedStyle(cover);
    var avail = window.innerHeight
              - parseFloat(cs.paddingTop || 0)
              - parseFloat(cs.paddingBottom || 0)
              - 8;                                  // small safety margin
    if (avail <= 0) { setScale(1); return; }

    var lo = 0.55, hi = 2.4, best = 1, lastH = -1;
    for (var i = 0; i < 10; i++) {
      var mid = (lo + hi) / 2;
      setScale(mid);
      var h = contentHeight();
      if (h <= avail && !overflows()) { best = mid; lo = mid; }
      else { hi = mid; }
      // the px caps in cover.css may already be reached; growing further is pointless
      if (Math.abs(h - lastH) < 0.5) break;
      lastH = h;
    }
    setScale(best);
  }

  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  // Anton loads from Google Fonts — its metrics differ from the fallback, so
  // measure again once the real face is in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  /* ------------------------------------------------------- auto-advance ---- */
  const target = cover && cover.getAttribute('data-cover-to');
  if (!target) return;

  const delay = parseInt(cover.getAttribute('data-cover-delay'), 10) || 5200;
  const bar = document.querySelector('[data-progress]');
  const note = document.querySelector('.cover-note');
  const enter = document.querySelector('.cover-enter');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let done = false;
  function go() {
    if (done) return;
    done = true;
    window.location.href = target;
  }

  function stop() {
    if (done) return;
    done = true;
    if (bar) bar.style.transform = 'scaleX(0)';
    if (note) note.textContent = 'Ready when you are.';
    if (enter) enter.focus();
  }

  if (reduce) {
    if (bar) bar.style.transform = 'scaleX(0)';
    if (note) note.textContent = 'Tap enter to continue.';
    if (enter) setTimeout(() => enter.focus(), 200);
    return;
  }

  ['click', 'keydown', 'wheel', 'touchstart', 'focusin', 'pointerdown'].forEach(ev => {
    window.addEventListener(ev, function handler(e) {
      // let the Enter button do its own navigation
      if (enter && enter.contains(e.target)) { window.removeEventListener(ev, handler); go(); return; }
      window.removeEventListener(ev, handler);
      stop();
    }, { passive: true });
  });

  const start = Date.now();
  (function tick() {
    if (done) return;
    const p = Math.min(1, (Date.now() - start) / delay);
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    if (p >= 1) { go(); return; }
    requestAnimationFrame(tick);
  })();
})();
