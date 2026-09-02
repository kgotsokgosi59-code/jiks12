/* music.js — the background music bar, and nothing else.

   Rules this file follows:
   - NEVER autoplays. Audio only starts when the visitor presses play. Browsers
     block autoplay with sound anyway, and unexpected audio is hostile to screen
     reader users (WCAG 1.4.2).
   - Remembers the visitor's choice across pages (localStorage), so the music
     keeps playing as they move around the site instead of restarting.
   - Skips tracks whose file is missing and says so, rather than dead-ending.
   - Every control is a real <button> with a name; state is announced politely. */
(function () {
  "use strict";

  var bar = document.querySelector("[data-music]");
  var list = window.JIKS_PLAYLIST || [];
  if (!bar) return;

  var audio = bar.querySelector("audio");
  var toggle = bar.querySelector("[data-mb-toggle]");
  var prevBtn = bar.querySelector("[data-mb-prev]");
  var nextBtn = bar.querySelector("[data-mb-next]");
  var titleEl = bar.querySelector("[data-mb-title]");
  var statusEl = bar.querySelector("[data-mb-status]");
  var labelEl = bar.querySelector(".mb-label");

  var tracks = list.filter(function (t) {
    return t && t.file;
  });
  if (!audio || !toggle || !tracks.length) {
    // nothing to play: keep the bar out of the way entirely
    if (bar.parentNode) bar.parentNode.removeChild(bar);
    return;
  }

  var STORE = "jiks.music";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var index = 0;
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORE) || "{}");
  } catch (e) {
    saved = {};
  }

  document.documentElement.classList.add("has-musicbar");
  bar.hidden = false;

  function saveState() {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({
          i: index,
          t: audio.currentTime,
          playing: !audio.paused,
        }),
      );
    } catch (e) {
      /* private mode — just carry on */
    }
  }

  function current() {
    return tracks[index];
  }

  function describe() {
    var t = current();
    if (titleEl) titleEl.textContent = t.title + " — " + t.artist;
  }

  function setState(playing) {
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute(
      "aria-label",
      playing ? "Pause background music" : "Play background music",
    );
    if (labelEl) labelEl.textContent = playing ? "Pause" : "Play";
    bar.classList.toggle("playing", playing);
  }

  function say(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function load(i, keepTime) {
    index = (i + tracks.length) % tracks.length;
    var t = current();
    var resumeAt = keepTime ? saved.t : 0;
    audio.src = t.file;
    audio.load();
    describe();
    if (resumeAt) {
      audio.addEventListener("loadedmetadata", function once() {
        audio.removeEventListener("loadedmetadata", once);
        try {
          audio.currentTime = resumeAt;
        } catch (e) {
          /* ignore */
        }
      });
    }
  }

  function play() {
    var p = audio.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        // blocked, or the file isn't there — fall back to paused and say why
        setState(false);
        say("Press play to start the music.");
      });
    }
  }

  toggle.addEventListener("click", function () {
    if (audio.paused) {
      say("Playing " + current().title + ".");
      play();
    } else {
      audio.pause();
      say("Music paused.");
    }
  });

  audio.addEventListener("play", function () {
    setState(true);
    saveState();
  });
  audio.addEventListener("pause", function () {
    setState(false);
    saveState();
  });
  audio.addEventListener("ended", function () {
    load(index + 1, false);
    play();
  });

  var failures = 0;
  audio.addEventListener("error", function () {
    var missing = current().title;
    failures++;
    if (failures >= tracks.length) {
      // nothing on the list is actually there — take the bar away rather than
      // leaving a broken player on the page
      if (bar.parentNode) bar.parentNode.removeChild(bar);
      document.documentElement.classList.remove("has-musicbar");
      return;
    }
    bar.classList.add("mb-error");
    say("“" + missing + "” is not in assets/audio/music — skipping.");
    load(index + 1, false);
    if (!audio.paused) play();
  });

  if (prevBtn)
    prevBtn.addEventListener("click", function () {
      var was = !audio.paused;
      load(index - 1, false);
      if (was) play();
      say("Playing " + current().title + ".");
    });

  if (nextBtn)
    nextBtn.addEventListener("click", function () {
      var was = !audio.paused;
      load(index + 1, false);
      if (was) play();
      say("Playing " + current().title + ".");
    });

  window.addEventListener("pagehide", saveState);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) saveState();
  });

  // Restore where they left off. Never resumes on its own under reduced motion,
  // and if the browser blocks playback we simply stay paused.
  function start() {
    document.documentElement.classList.add("has-musicbar");
    bar.hidden = false;

    var startAt =
      typeof saved.i === "number" && saved.i < tracks.length ? saved.i : 0;
    load(startAt, true);
    setState(false);

    if (saved.playing && !reduce) {
      play();
    } else if (saved.playing && reduce) {
      say("Press play to resume the music.");
    }
  }

  // Only put the bar on the page if the music files are actually there.
  if (window.fetch) {
    fetch(tracks[0].file, { method: "HEAD" })
      .then(function (res) {
        if (res.ok) start();
        else if (bar.parentNode) bar.parentNode.removeChild(bar);
      })
      .catch(function () {
        start(); // opened from disk, or fetch blocked — let the audio element decide
      });
  } else {
    start();
  }
})();
