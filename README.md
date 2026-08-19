# Dama Nails Center — marketing site

A single-page static marketing site for **Dama Nails Center** (Damarlyn Reyes, Dominican Republic).
All visitor-facing copy is in Spanish. Bookings go to WhatsApp — there is no form and no backend.

**No build step, no bundler, no database.** It works two ways:

1. Double-click `index.html` (opens over `file://`)
2. Serve it from any static host, including GitHub Pages under a sub-path

React 18 and [htm](https://github.com/developit/htm) load from a CDN as plain UMD scripts, so there is
nothing to compile. Every internal path is relative (no leading `/`), which is what makes both
of the above work.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell: meta tags, fonts, CDN scripts, `#root` |
| `config.js` | **All business content.** The only file you normally edit |
| `assets/img/gallery-data.js` | The 19 photos: paths, alt text, tags, display order |
| `app.js` | React components (nav, hero, gallery, lightbox, …) |
| `styles.css` | All styling and animation |
| `assets/img/web/` | Web-sized photos (used in the lightbox) |
| `assets/img/thumb/` | Thumbnails (used in the gallery grid) |
| `assets/img/original/` | Full-res originals + `profile-150.jpg`. **Not used on the page** |
| `assets/img/manifest.json` | Backup record of the photo metadata (not loaded by the site) |
| `scripts/` | Scrape records + `VERIFY.md` browser checklist |
| `.nojekyll` | Stops GitHub Pages running Jekyll (see below) |

---

## Editing content — `config.js`

Open `config.js`. Everything the visitor reads lives there, with `// TODO: confirmar con Dama`
comments on the parts we do not know yet.

**The important rule:** empty values hide their section instead of showing a placeholder.
A visitor never sees "TODO" or "[address here]".

### Announcement bar ("Cafecito incluido")

The slim bar above the nav comes from `announcement` in `config.js`. Set `enabled: false` to hide it, or change `text` / `tail` (the tail is hidden on very small phones).

```js
announcement: { enabled: true, text: 'Cafecito incluido para nuestras clientas', tail: '— ven, siéntate y relájate' }
```

### Address / city

Currently empty, so the location card is hidden entirely.

```js
location: {
  city: 'Santiago de los Caballeros',
  address: 'Calle Ejemplo #12, Sector Ejemplo',
  mapsUrl: 'https://maps.google.com/?q=...'   // optional — adds a "Cómo llegar" link
}
```

Fill in any subset. The card appears as soon as one field has a value.

### Opening hours

Currently `hours: []`, so the site shows *"Escríbeme por WhatsApp para ver disponibilidad"*.
Add rows to replace that with a real schedule:

```js
hours: [
  { days: 'Lunes a viernes', time: '9:00 a. m. – 6:00 p. m.' },
  { days: 'Sábado',          time: '9:00 a. m. – 4:00 p. m.' },
  { days: 'Domingo',         time: 'Cerrado' }
]
```

### Prices

Every service has `price: ''`, which renders a **"Consultar"** pill. Put a string in to show a real price:

```js
{ id: 'acrilicas', name: 'Uñas acrílicas', price: 'RD$1,200', duration: '2 h', ... }
```

`duration` is optional — leave it `''` and nothing is shown.

### WhatsApp

```js
whatsapp: {
  number: '18092600597',        // digits only: country code + number, no +, spaces or dashes
  display: '+1 (809) 260-0597', // what the visitor sees
  defaultMessage: '...',        // prefilled text for the general buttons
  serviceMessage: 'Hola Dama 💅 Quiero agendar una cita para *{servicio}*. ...'
}
```

`{servicio}` is replaced automatically with the service name, so each service card's
"Reservar" button opens WhatsApp with the right message already typed. Text between
`*asterisks*` renders bold in WhatsApp.

---

## Adding or replacing photos

Three steps:

1. **Add the image files.** Put the web-sized version in `assets/img/web/` and a smaller
   version in `assets/img/thumb/`. Keep the same filename in both folders.
   - `web/` — max 1200px on the long edge, aim for 100–300 KB
   - `thumb/` — max 600px on the long edge

2. **Add an entry to `assets/img/gallery-data.js`.** The array order *is* the display order.

   ```js
   {
     id: '20',
     web:   'assets/img/web/20.jpg',
     thumb: 'assets/img/thumb/20.jpg',
     width: 960, height: 1200,        // real pixel size of the WEB file — prevents layout jump
     caption: 'Texto original de Instagram',
     alt: 'Uñas coffin rosadas con flores blancas',   // always write this, in Spanish
     tags: ['acrilicas', 'nail-art'],
     featured: false
   }
   ```

   - `alt` — a short Spanish description. Required for accessibility and SEO.
   - `tags` — any of `francesas`, `nail-art`, `acrilicas`, `color`, `pedrería`. These drive the
     filter chips above the gallery; a chip only appears if at least one photo uses that tag.
   - `featured: true` marks a photo as usable in the hero.

3. **To change the hero photos**, edit `hero` in `config.js` — it references the `id` values:

   ```js
   hero: { tiles: ['16', '05', '03'], accent: '01' }
   ```

   `tiles` are the three arch-shaped photos; `accent` is the small round one.

`assets/img/manifest.json` is a backup record of the same data. The site does not read it,
so updating it is optional — but keeping it in sync is handy if the gallery ever needs rebuilding.

---

## Deploying to GitHub Pages

1. Create a new repository on GitHub (public).
2. Push this folder to it:

   ```bash
   git remote add origin https://github.com/<user>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: *Deploy from a branch*
   - Branch: `main`, folder: `/ (root)`
   - Save.

4. Wait ~1 minute. The site appears at `https://<user>.github.io/<repo>/`.

The sub-path (`/<repo>/`) is why every path in this project is relative — absolute paths
starting with `/` would break there.

### `.nojekyll`

An empty `.nojekyll` file is included at the repo root. GitHub Pages otherwise runs the content
through Jekyll, which **ignores files and folders starting with `_` or `.`** and can silently drop
assets. `.nojekyll` turns that off and serves the files exactly as they are. Don't delete it.

### After deploying

In `index.html`, the `og:image` and canonical tags use a relative path. Once there is a real URL,
uncomment the canonical link near the top of `<head>` and set it. Social previews (WhatsApp,
Instagram, Facebook) generally want an **absolute** `og:image` URL, so update that too:

```html
<meta property="og:image" content="https://<user>.github.io/<repo>/assets/img/web/16.jpg">
```

---

## Previewing locally

Double-clicking `index.html` works. If you'd rather use a local server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Note that the CDN scripts (React, htm) and Google Fonts need an internet connection either way.

See `scripts/VERIFY.md` for a browser checklist.
