/* licence.js — the music credits & licensing panel.

   Two jobs, both small:
   1. Build the track table from window.JIKS_PLAYLIST, so the panel on the page
      always matches the playlist the player is actually using. One source of
      truth: change playlist.js, and both the player and the credits follow.
   2. Run the show/hide disclosure (aria-expanded, and keyboard-friendly for
      free because it is a real <button>).

   The panel content is also rendered by the build, so it is readable with
   JavaScript off — this file only enhances it. */
(function () {
  'use strict';

  var root = document.querySelector('[data-licence]');
  if (!root) return;

  var toggle = root.querySelector('[data-licence-toggle]');
  var panel = root.querySelector('[data-licence-panel]');
  var body = root.querySelector('[data-licence-body]');
  var list = window.JIKS_PLAYLIST || [];
  var meta = window.JIKS_LICENCE || {};

  /* ---------- 1. render the table ---------- */
  function cell(text, cls, label) {
    return '<td class="' + (cls || '') + '" data-lbl="' + label + '">' + (text || '&mdash;') + '</td>';
  }

  function row(t) {
    var lic = t.licence || {};
    var status = (lic.status || 'pending').toLowerCase();
    if (['cleared', 'pending', 'removed'].indexOf(status) === -1) status = 'pending';
    var label = status.charAt(0).toUpperCase() + status.slice(1);

    return '<tr>' +
      cell(t.title, 't-title', 'Track') +
      cell(t.artist, 't-artist', 'Credit') +
      cell(lic.owner, 't-owner', 'Licensed from') +
      cell(lic.type, 't-owner', 'Licence') +
      '<td data-lbl="Status"><span class="badge ' + status + '">' + label + '</span></td>' +
      cell(lic.term, 't-term', 'Territory &amp; term') +
      '</tr>';
  }

  if (body && list.length) {
    body.innerHTML =
      '<table class="lic-table">' +
        '<caption>Background music &mdash; licence record</caption>' +
        '<thead><tr>' +
          '<th scope="col">Track</th><th scope="col">Credit</th>' +
          '<th scope="col">Licensed from</th><th scope="col">Licence</th>' +
          '<th scope="col">Status</th><th scope="col">Territory &amp; term</th>' +
        '</tr></thead>' +
        '<tbody>' + list.map(row).join('') + '</tbody>' +
      '</table>';
  }

  if (meta.note) {
    var note = root.querySelector('[data-licence-note]');
    if (note) note.textContent = meta.note;
  }
  if (meta.reviewed) {
    var when = root.querySelector('[data-licence-reviewed]');
    if (when) when.textContent = 'Last reviewed ' + meta.reviewed + '.';
  }

  /* ---------- 2. disclosure ---------- */
  if (!toggle || !panel) return;

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });

  // open it automatically when someone follows a #music-licence link
  if (window.location.hash === '#music-licence') {
    toggle.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    panel.setAttribute('tabindex', '-1');
    panel.focus();
  }
})();
