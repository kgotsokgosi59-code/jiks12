/* nav.js — one job: mark the header as scrolled once the page moves.
   The mobile menu is a separate concern and lives in menu.js. */
(function () {
  'use strict';
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
