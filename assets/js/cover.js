/* cover.js — splash page: takes the visitor through to home.html.

   Accessibility: the auto-advance is cancelled by ANY interaction (click, key,
   scroll, touch, focus) and is skipped entirely for visitors who prefer reduced
   motion. The "Enter the site" link is a real link, so it works without JS. */
(function () {
  'use strict';
  const cover = document.querySelector('[data-cover-to]');
  if (!cover) return;

  const target = cover.getAttribute('data-cover-to');
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
