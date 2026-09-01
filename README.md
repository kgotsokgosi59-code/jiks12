# Jiks Academy — website

Static site. No build step, no dependencies, no framework. Every page is its own file.
Open `index.html`, or serve the folder: `python3 -m http.server 8000 --directory .`

`index.html` is a **cover page** (the logo splash that auto-advances into the site);
`home.html` is the real home page. `sitemap.html` lists every file in reading order.

## Pages (15 files, one per subject)

| File | What it is |
|---|---|
| `index.html` | **Cover page** — logo splash, "We back the builders", auto-advances after ~5s |
| `home.html` | Home — hero, beliefs, ventures, crew, Hector, services, contact CTA |
| `about.html` | Who we are, four commitments, stats, founding timeline |
| `ventures.html` | Index of the two movements |
| `east-rand-academy.html` | Movement 01 — full bio, promises, timeline |
| `daveyton-stance-society.html` | Movement 02 — full bio, engines, timeline |
| `crew.html` | Crew index — all three people, and the branch into their profiles |
| `hector.html` | MC & Motivational Speaker — full profile |
| `services.html` | The four disciplines in detail |
| `clients.html` | **Creative pipeline (5 stages) + client list for all three properties** |
| `contact.html` | Contact details + enquiry form |
| `sitemap.html` | **Every file on the site in reading order** + the folder diagram |
| `shadrack-makamu.html` | Profile — Head of Media & Visuals (crew branch) |
| `kgotso-matlakala.html` | Profile — Events & Operations Lead (crew branch) |
| `skhubuzo.html` | Profile — Talent Liaison & Community (crew branch) |

## Styles (3 files, one job each)

| File | Contents |
|---|---|
| `assets/css/base.css` | **Colour tokens, reset, typography, layout primitives** — change the theme here |
| `assets/css/components.css` | Nav, buttons, cards, marquee, stats, forms, footer |
| `assets/css/pages.css` | Page-specific: cover, hero, page heads, profiles, pager, site map, services, contact |

Nothing is bundled and there is no `main.css` in the site folder. If you ever want a
single stylesheet — one request instead of three, handy for a cheap host — set
`SINGLE_CSS = True` at the top of `build_site.py` and rebuild: the build then writes
`assets/css/main.css` and points every page at it. Switching it back to `False`
deletes the file again.

## Scripts (5 files, one job each)

| File | Does |
|---|---|
| `assets/js/nav.js` | Marks the header as scrolled. Nothing else. |
| `assets/js/menu.js` | Mobile menu: burger state, focus in/out, Escape to close, tab trap. |
| `assets/js/cover.js` | Cover page auto-advance and progress bar. |
| `assets/js/reveal.js` | Scroll reveals and the footer year. |
| `assets/js/form.js` | Contact form success message. |

## Cover page

`index.html`. Full-bleed hero, scrim, the logo on a light plate, "Jiks Academy" and
the tagline, then an **Enter the site** button plus a progress bar.

- After **5.2s** it advances to `home.html` on its own (`assets/js/cover.js`).
- **Any** interaction — click, key, scroll, touch, or focusing anything — cancels the
  auto-advance, so nobody who is actually reading gets bounced. The note under the
  button changes from the countdown wording to "READY WHEN YOU ARE."
- Under `prefers-reduced-motion` it does **not** auto-advance at all; focus is put on
  the Enter button and the note reads "TAP ENTER TO CONTINUE."
- The Enter button is a plain `<a href="home.html">`, so the page still works with
  JavaScript off.

## Navigation between the files

Four ways to move around, all generated from one list:

1. **Header** — the same eight links on every page.
2. **Breadcrumbs** — under every page head, back to Home.
3. **Previous / next band** (`.pager-band`) at the bottom of every main page. It
   walks the reading order and wraps at both ends:

```
home → about → ventures → east-rand-academy → daveyton-stance-society
     → crew → hector → services → clients → contact → sitemap → home
```

4. **Crew branch** — `crew.html` also offers the three profiles, and from there the
   chain runs `crew → Shadrack → Kgotso → Skhubuzo → back to crew`. The profiles use
   their own in-page pager for this, so no page ever shows two.

The reading order lives in `SITE_ORDER`, the branch in `CREW_BRANCH`, and the band is
built by `page_pager()` — all in `build_site.py`.

On top of that, **every page ends with the full index**: the footer carries all 15
files, numbered `01`–`15` in reading order, and `sitemap.html` lays out the same order
with a one-line note per file plus the folder diagram.

## Images

The badge is **dark artwork on white**, so wherever it sits on the dark site it gets a
light plate (`#f2f5fc`): see `.cover-plate`, `.mark.imgmark` and `.f-logo` in the CSS,
and the same plate is baked into `favicon.png`, `apple-touch-icon.png` and
`icon-192/512.png`.

```
assets/img/clients/           Real client logos (transparent, 170px tall, on light or dark plates)
assets/img/logo.png            Jiks Academy badge, transparent (512×517) — DARK artwork
assets/img/favicon.png         Favicon
assets/img/hero.jpg            Daveyton street / stance car
assets/img/academy.jpg         Studio session
assets/img/stance.jpg          Night stance meet
assets/img/hector.jpg          Hector on stage
assets/img/crowd.jpg           Live crowd
assets/img/crew/innocard…      innocent-card.jpg (full brand card) + innocent.jpg (photo crop)
assets/img/crew/kgotso.jpg     Kgotso Matlakala
```

## The colour scheme

Jet black carrying royal electric blue, set in `base.css`:

```css
--ink:#04060e;    /* deep jet black */
--ink-2:#080e24;  /* panels — blue-black */
--ink-3:#0e1738;  /* hover / elevated */
--blue:#2f5bff;   /* royal electric blue — primary accent */
--blue-2:#5b8cff; /* softer blue for text on dark */
--cyan:#5ce1ff;   /* electric highlight */
--royal:#1b2ea8;  /* deep royal, used to tint photography */
--bone:#e8eeff;   /* text */
```

The page background is three layered royal-blue radial glows over `--ink`.
Photography gets the `.tint` class, which lays `--royal` over the image in
`mix-blend-mode: color` — so every photo sits in the blue family. Remove `tint`
from any element to show a photo in its natural colour.

## Things to change before going live

1. **Contact details** — booking enquiries go to **`kgotsokgosi59@gmail.com`**
   (phone `+27 67 702 4063`). Both live in `build_site.py` as `EMAIL` / `PHONE` and
   appear on the contact page and in the footer of every page. Change them in one place.
2. **Contact form** — `assets/js/form.js` only shows a success message. Point it at
   Formspree, Netlify Forms or your own endpoint.
3. **Client logos** — `assets/img/clients/`. Sources:
   - `agsa.png` — AGSA logo SVG (Wikimedia), converted to PNG
   - `pepsico.png` — PepsiCo 2025 logo (seeklogo)
   - `amcu.png` — AMCU logo (Wikimedia)
   - `tut.png` — official TUT logo, `tut.ac.za/media/tshwane-interim/site-assets/images/tut-logo.svg`
   - `birchwood.png` — official Birchwood white logo from birchwoodhotel.co.za
   - `nwpl.png` — North West Provincial Legislature seal (Wikimedia)
   - `nwedu.png` — North West Department of Education & Sport Development logo
   - `addprop.png` — official AddProp logo from addprop.co.za

   Two of them are white marks (`birchwood`, `addprop`) so those tiles use the
   `dark-plate` class. All are trademarks of their owners — swap them if a client
   sends you an approved version.
4. **Client list** on `clients.html` — Hector's 8 clients are real (from his profile PDF).
   The 12 tiles for East Rand Academy and Daveyton Stance Society are **marked
   "Placeholder"** and are categories, not invented company names. Send real names and
   logos and they drop straight into those tiles.
4. **Crew roles** for Shadrack Makamu, Kgotso Matlakala and Skhubuzo are written to fit
   the movements — confirm or correct them.
4. **Innocent Tlhatlhedi (DJ ToxSA)** is listed as a **client** of East Rand Academy,
   not as crew — he founded both movements. His tile sits at the top of the ERA client
   list on `clients.html`.
5. **Skhubuzo** still has a silhouette placeholder. Drop a real photo into the
   `.silhouette` block on his page (replace the `<svg>` with an `<img>`), and swap the
   `SILHOUETTE` entry for him in `CREW_CARDS` inside `build_site.py`.
6. **Kgotso's portrait** is a tall phone photo cropped by `object-position: center 20%`
   in `pages.css` — nudge that value if the crop misses.
7. **One client name in Hector's PDF wouldn't scan** ("The Ulf, UNISA, TUT…") and is
   left off his Recent Stages list.

## Accessibility

Audited against **WCAG 2.1 AA** with axe-core across all 15 pages — **0 violations**.
Re-run it any time with `python3 audit_a11y.py` (needs the local server running and
`pip install playwright`).

What's in place — and what to preserve if you edit the site:

- **Skip link** — first thing in the DOM, visible on focus, jumps to `<main id="main">`.
- **Landmarks** — `<header>`, `<nav aria-label>`, `<main>`, `<footer>`; breadcrumbs are
  `<nav aria-label="Breadcrumb">`; the current page link carries `aria-current="page"`.
- **Focus** — 3px cyan `:focus-visible` ring on everything, with a fallback for browsers
  without `:focus-visible`. Never remove an outline without replacing it.
- **Mobile menu** — burger reports `aria-expanded`, focus moves into the panel on open,
  Tab is trapped inside, Escape closes and returns focus to the burger. Closed, it is
  `visibility:hidden`, so its links stay out of the tab order.
- **Motion** — `prefers-reduced-motion` disables the marquee, reveals and transitions.
- **Colour** — every text/background pair meets 4.5:1 (most are 8:1+). Two deliberate
  choices: the CTA band paragraph is full white (88% white on blue is only 4.1:1) and
  placeholders are `#8fa0c6` at full opacity. Re-check contrast if you change
  `--bone-dim`, `--cyan` or `--blue`.
- **Images** — every `<img>` has an `alt`; decorative backgrounds use `alt=""`.
- **Decorative marks** — arrows, monograms, initials, stage numbers, the marquee and the
  scroll cue are `aria-hidden` so they aren't read out.
- **Forms** — every control has a `<label for>`, plus `autocomplete`, `aria-required`,
  and the success message is a `role="status" aria-live="polite"` region.
- **Headings** — exactly one `<h1>` per page, no skipped levels. Footer column headings
  are `<h2>` for exactly this reason; contact's "Where to find us" is `<h3>`.

Tested: keyboard-only walkthrough, axe semantics, and a 390px viewport.

## Browser support

Tested in **Chromium, Firefox and WebKit** at 1366px and 390px — run
`python3 browser_check.py` after the local server is up. All 15 pages load with no
console errors, no broken images and no collapsed layout in all three engines.

(The cover page is a splash screen with no site chrome, so the checker exempts it from
the nav/footer/email/height rules.)

Fallbacks written in for older browsers:

| Feature | Fallback |
|---|---|
| `aspect-ratio` | padding-hack sizing for avatars, thumbs and portraits |
| `backdrop-filter` | solid nav background, with `-webkit-` prefix where supported |
| `mix-blend-mode: color` | photo tint is off, not broken |
| `100svh` | `100vh` declared first |
| `inset` shorthand | longhand top/right/bottom/left |
| `-webkit-text-stroke` | outlined text falls back to a readable solid colour |
| `:focus-visible` | plain `:focus` ring where unsupported |
| `prefers-reduced-motion` | marquee, reveals and transitions all stop |

Also included for a proper install in Chrome and on phones: `site.webmanifest`
(add to home screen), `apple-touch-icon.png`, `icon-192/512.png`, `theme-color`,
and Open Graph + Twitter card tags so links preview properly when shared.

**Before launch:** set `SITE_URL` in `build_site.py` to the real domain — Open Graph
and manifest URLs need to be absolute. They fall back to relative paths until then.

## build_site.py

Sits one level up, outside the site folder. It regenerates all 15 pages from shared
nav/footer partials — handy for a nav change across every page. **If you edit the HTML
directly, don't re-run it** or it will overwrite your edits. Delete it if you'd rather
work page by page.

Three switches at the top: `SINGLE_CSS` (see Styles above), `SITE_ORDER` and
`CREW_BRANCH` (see Navigation above). `FILE_NOTES` holds the one-line description
each file gets on the site map.

> Gotcha when editing the generator: the emitted HTML contains real newlines. If you
> ever see a literal `\n` in a built page, a `\\n` slipped into `build_site.py` —
> grep the generated HTML for a backslash-n before trusting the output.
