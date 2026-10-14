# Contact sheets — draw the screen before you build it

Every screen MmasiEjikeme Studios ships, drawn as a device frame with a stable
id (`<span class="sid">pub-home</span>`). Three sheets, one per surface and
device:

| Sheet | Surface | Device | Frame kind |
|---|---|---|---|
| `01-public-desktop.html` | Public site | 1440 × 900 laptop | full scrolling page |
| `02-public-mobile.html` | Public site | 390 × 844 phone | full scrolling page |
| `03-admin.html` | Studio admin | 1440 × 900 laptop | fixed viewport app |

The public site is one responsive product drawn on two devices; most phone
frames answer a desktop frame of the same name. The admin is desktop only.

## The rule: the mockup comes first

**A new screen is drawn here before it is built, and a reworked screen is
redrawn here before it is reworked.** Not after, and not "when there's time".

The frame is the artefact the Next.js build is checked against before it
exists. Build first and the site and the drawing each look reasonable and do
not match, and nobody finds out until the two are open side by side.

So the order is:

1. **Draw the frame** in the sheet for its surface. Give it a `sid`, a name and
   a one-line purpose.
2. **Build it** against the frame, in `src/app`.
3. **Add its route to `BUILT`** in `build-manifest.mjs` and re-run, which flips
   the manifest row from `omitted` to `implemented`.

## Two frame kinds

A website is a long scrolling page, not a single app screen, so a public frame
is drawn whole:

- **`.webframe`** (public pages) scales with the CSS `zoom` property, which
  takes the whole page down together and lets the frame's height follow the
  page. The header sits at the top; the footer at the bottom; everything
  between scrolls on the real site.
- **`.phone` / `.desk`** (overlay states and the admin) are one viewport,
  `overflow:hidden`, scaled with `transform: scale()` inside a fixed-size
  wrapper. An open lightbox, the video player and the mobile drawer are drawn
  this way because each is a viewport-locked state, not a scroll.

Content inside every frame is authored 1:1; the sheet scales the whole frame,
never the outline alone, so an action can never be clipped without the picture
showing it.

## One system, and where it lives

Every frame is drawn in `system.css` — the token set the built Next.js app
reads back as its styled-components theme (the `--mm-*` CSS custom properties
in `src/styles`). A frame's champagne `--gold-500` is the app's `--gold-500`;
its `.status` is the app's `.status`.

`system.css` is the vocabulary. A frame that invents its own colour, its own
type size or its own chip is a frame that cannot be compared to the screen it
draws. Add to `system.css` deliberately, in the same change as the frame that
needed it — never inline a one-off in a sheet.

Three axes are decoupled so a class means one thing:

- **Frame:** `.webframe`, `.phone`, `.desk` — the device and how it scales.
- **Theme:** `.dark` — the cinematic look; its absence is the editorial light.
  The public site ships a theme toggle, so both appear across the sheets.
- **Layout:** `.narrow` — the phone layout. Carried by every phone frame.

## The scripts, and when to run them

Run from the `design/mockups` directory after changing any sheet. Each takes an
optional list of sheets and checks every sheet when given none.

```
npm install                 # once — installs Playwright
npx playwright install chromium
node check-overflow.mjs     # nothing clips sideways; no fixed frame loses an action
node check-ease.mjs         # every empty and failure state has something to press
node build-manifest.mjs     # the manifest matches the sheets
node render-sheets.mjs      # the .png companions match the .html
```

Or `npm run check` for the three fast checks together.

`check-overflow.mjs` exists because fixed frames are `overflow:hidden`. A frame
that grew past its screen loses its primary action and nothing says so. Web
pages are checked for sideways bleed only — their height is the page.

`render-sheets.mjs` writes the checked-in `.png` beside each `.html`. Run it in
the same pass that changes a sheet — a PNG made once drifts behind its sheet
silently, and a reader who opens the picture instead of the page reports
finished work as missing. It fails rather than skips when Playwright or a
browser is absent.

## The rules a frame is checked against

From the studio blueprint (`mmasi_portof.md` §5–7):

- **The work leads.** Images are drawn as plates with grain and a vignette, so a
  frame reads as a photograph, never an empty box — and ships no binary.
- **The header is always visible,** including over an open lightbox or video
  player. A shared link opens that exact photo or reel with the studio
  navigation still in reach.
- **Every path to booking is one tap to WhatsApp.** The `.btn.wa` in WhatsApp
  green appears on the hero, on each service, in the lightbox, in the player,
  and as the inquiry builder's action. The number is `+234 814 709 9175`.
- **The inquiry builder shows its message before it sends it.** The live
  `.wapreview` is the exact text WhatsApp opens with, so nothing is retyped.
- **Status is a word and a colour, never a colour alone** — inquiry states
  (New, Under Review, Booked, Completed) carry both.
- **Every screen has a real empty state** that names the action that fills it,
  and a failure state with a reason and a fix.
- **Draw the awkward data** the real screen will meet: a caption long enough to
  wrap, a gallery category with nothing in it yet, a rejected upload, an
  inquiry with no project vision written.
- **Mobile is where the inquiries start.** Every button and reel player is
  drawn to work with a thumb, because most WhatsApp inquiries begin on a phone.
