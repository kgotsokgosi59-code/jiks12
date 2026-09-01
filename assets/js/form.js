/* form.js — front-end only. Wire this to Formspree / Netlify Forms / your own endpoint.
   The success message is a live region, so screen readers announce it without moving focus. */
(function () {
  'use strict';
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = form.querySelector('.form-ok');
      if (ok) ok.classList.add('show');
      form.reset();
    });
  });
})();
