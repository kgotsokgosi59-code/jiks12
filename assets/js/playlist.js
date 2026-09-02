/* playlist.js — the background music track list. DATA ONLY, no logic.

   Every track carries a `licence` record, because the player will only play
   tracks whose status is "cleared". A track with a file but no licence is
   treated as not cleared and is skipped — the licence is enforced here, not
   just written down.

     status:  "cleared"  -> plays        (licence held, evidence filed)
              "pending"  -> skipped      (wanted, not licensed yet)
              "removed"  -> skipped      (licence withdrawn or expired)
     owner:   who granted the licence (label / publisher / library)
     type:    the licence you hold (e.g. "Royalty-free library — web use")
     term:    territory and period, e.g. "Worldwide, 1 year from 2026-03-01"

   HOW TO ADD MUSIC
   1. Put your licensed MP3 in  assets/audio/music/
   2. Fill in `file` with its path
   3. Fill in the `licence` record from your invoice or certificate
   4. Set status to "cleared" — only then will it play.

   Use music you have the rights to. Buying a download does not licence it for
   web use: you need the recording (label) and the song (publisher). See
   audio-licensing/README.md for how to clear tracks properly. */
window.JIKS_PLAYLIST = [
  { title: "Abalele",     artist: "Kabza De Small & DJ Maphorisa ft. Ami Faku",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Asibe Happy", artist: "Kabza De Small, DJ Maphorisa & Ami Faku",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "iMitha",      artist: "Kabza De Small & DJ Maphorisa ft. Nokwazi",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Khusela",     artist: "Kabza De Small & DJ Maphorisa ft. Msaki",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Sponono",     artist: "Kabza De Small & DJ Maphorisa",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Umshove",     artist: "Kabza De Small",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Lorch",       artist: "Kabza De Small & DJ Maphorisa",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } },

  { title: "Bab' Motha",  artist: "Kabza De Small",
    file: "", licence: { status: "pending", owner: "", type: "", term: "" } }
];

/* The licence summary shown in the credits panel on the About page. */
window.JIKS_LICENCE = {
  reviewed: "",                       // e.g. "1 March 2026"
  contact: "kgotsokgosi59@gmail.com", // rights and takedown enquiries
  note: "Nothing plays on this site until its licence is cleared. Titles listed " +
        "without a cleared licence are a wish list, not a playlist."
};
