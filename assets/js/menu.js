/* menu.js — the mobile menu, and only the mobile menu.
   - burger reports open/closed state (aria-expanded, aria-label)
   - the closed menu is kept out of the tab order (visibility:hidden in CSS + aria-hidden here)
   - focus moves into the panel on open and back to the burger on close
   - Escape closes it, Tab is trapped inside it while it is open
*/
(function () {
  'use strict';
  const burger = document.querySelector('.burger');
  const mobile = document.querySelector('.mobile');
  if (!burger || !mobile) return;

  const firstLink = mobile.querySelector('a');

  function setMenu(open) {
    burger.classList.toggle('open', open);
    mobile.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      // wait for the visibility flip to land before moving focus in
      requestAnimationFrame(function () { firstLink.focus(); });
    } else {
      burger.focus();
    }
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  mobile.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  // keep focus inside the panel while it is open
  mobile.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || burger.getAttribute('aria-expanded') !== 'true') return;
    const items = mobile.querySelectorAll('a, button');
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
