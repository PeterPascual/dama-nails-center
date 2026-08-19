# Browser verification checklist

Notes on what was already checked automatically, and what still needs a human with eyes on it.

## Already verified programmatically

These were checked against the live DOM in a real Chromium instance (served over
`http://127.0.0.1:8931`), so they should not need re-testing:

- No console errors or warnings on load.
- All 19 gallery tiles render; all 24 `<img>` elements have non-empty Spanish `alt` text;
  no broken image paths.
- Google Fonts (Fraunces + Karla) actually load and apply.
- All 17 `wa.me` links are `https://wa.me/18092600597?text=…` and correctly percent-encoded
  (accents, `¿`, and the 💅 emoji all survive the round trip).
- Service buttons inject the right service name — e.g. `…para *Pedicure*…`.
- Filter chips: each returns exactly the expected subset in the expected order
  (Todas 19 / Francesas 10 / Nail art 16 / Acrílicas 10 / Color 6 / Pedrería 10),
  only one chip active at a time, `aria-pressed` correct.
- Lightbox: opens on the right photo, `role="dialog"` + `aria-modal="true"`, focus moves to the
  close button, body scroll locks, `←`/`→` navigate and wrap around, counter reads "3 de 19",
  `Esc` and backdrop click both close, body unlocks, focus returns to the tile that opened it.
- Mobile menu: opens/closes, `aria-expanded` and `aria-label` flip, `aria-controls` matches the
  panel id, body locks, `Esc` closes, links are 60px tall.
- No horizontal overflow at 375px or 1280px.
- Every tap target (`<a>`, `<button>`) is at least 44×44px.
- Every `#anchor` link resolves to an element that exists.
- Colour contrast passes WCAG AA on all body/UI text, including against the lightest point of
  the CTA gradient (worst case). Lowest passing ratio is 4.8:1.
- No English, no "TODO", no `[placeholder]`, no `undefined`/`NaN` in any visible text or
  `alt`/`aria-label`/`title` attribute.
- Location card correctly hidden (empty config); hours correctly fall back to
  "Escríbenos por WhatsApp para disponibilidad"; all prices show the "Consultar" pill.

## Please check by eye

The browser pane could not composite frames in this environment, so **nothing below was seen
visually** — this is the part that genuinely needs you.

### 1. Open `index.html` by double-clicking it (`file://`)

This is the one requirement that could not be tested at all: the tooling snapshots `file://`
URLs instead of loading them. Confirm:

- [ ] The page renders fully — not a blank white screen.
- [ ] Photos appear in the hero and the gallery.
- [ ] Fonts look like a soft serif (headings) + clean sans (body), not Times/Arial fallbacks.
- [ ] The lightbox opens when you click a gallery photo.

If the page is blank, check the console — most likely the CDN scripts were blocked
(needs an internet connection).

### 2. Layout and composition

- [ ] **Hero photo cluster** — three arch-topped tiles plus a small round orange one, slightly
      rotated and overlapping. Check nothing is awkwardly clipped or colliding with the
      "Diseños a tu medida" badge at ~375px, ~768px and ~1280px wide.
- [ ] **Hand-drawn squiggle** under the word *amor* — should sit just under the word and roughly
      match its width, not float away from it. Different font rendering could shift this.
- [ ] **Marquee ribbon** — tilted band of service names below the hero. Should span edge to edge
      with no white gap at either end, and scroll smoothly.
- [ ] **Gallery masonry** — 2 columns on mobile, 3 at tablet, 4 on desktop. Every third tile has
      an arch top; the rest are rounded rectangles. Check the rhythm looks intentional.
- [ ] **Footer scallop** — the cream scalloped edge along the top of the dark footer should line
      up cleanly with no seam.

### 3. Animation

- [ ] Hero elements stagger in on load (eyebrow → headline lines → subline → buttons).
- [ ] Sections and cards fade/rise as you scroll to them. **Nothing should stay invisible.**
- [ ] Hover a service card and a gallery tile — both should lift smoothly.
- [ ] The floating WhatsApp button pulses gently.
- [ ] Sparkles in the hero twinkle subtly — they should read as decoration, not distraction.
- [ ] Scrolling stays smooth (60fps) on a real phone.

### 4. Reduced motion

Turn on **Settings → Accessibility → Display → Reduce motion** (macOS/iOS), or in Chrome DevTools:
*Rendering → Emulate CSS prefers-reduced-motion: reduce*. Then reload:

- [ ] All content is immediately visible (no elements stuck at opacity 0).
- [ ] The marquee stops scrolling.
- [ ] The WhatsApp pulse stops.
- [ ] Anchor links jump instead of smooth-scrolling.

### 5. On a real phone

Most visitors arrive from Instagram or WhatsApp, so test in those in-app browsers:

- [ ] Tap the WhatsApp button — it should open WhatsApp with the Spanish message prefilled,
      accents and emoji intact.
- [ ] Tap a service's "Reservar" — the message should name that service in bold.
- [ ] The floating button doesn't cover anything important, and clears the home indicator
      on a notched iPhone.
- [ ] Sticky nav stays put and doesn't jitter while scrolling.

### 6. Keyboard only

- [ ] Tab from the top: the "Saltar al contenido" skip link appears first.
- [ ] Focus rings are clearly visible everywhere, including on the dark footer.
- [ ] Open the lightbox with Enter, navigate with arrows, close with Esc — focus should return
      to the photo you opened.
- [ ] Tab inside the lightbox cycles between close/prev/next and never escapes behind it.

### 7. Social preview

After deploying, paste the URL into WhatsApp and check the preview card shows the title,
description and a photo. If the image is missing, set `og:image` to an **absolute** URL —
see the README.
