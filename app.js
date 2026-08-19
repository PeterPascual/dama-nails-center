/* ============================================================================
   Dama Nails Center — aplicación (React 18 + htm, sin paso de compilación)
   ----------------------------------------------------------------------------
   Todos los textos del negocio salen de config.js.
   Las fotos salen de assets/img/gallery-data.js.
   Aquí solo vive la lógica y el marcado.
   ========================================================================== */

(function () {
  'use strict';

  if (!window.React || !window.ReactDOM || !window.htm) {
    console.error('[Dama] Faltan React, ReactDOM o htm. Revisa las etiquetas <script> de index.html.');
    return;
  }

  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var html = window.htm.bind(React.createElement);

  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;
  var useCallback = React.useCallback;

  var CFG = window.SITE_CONFIG || {};
  var C = CFG.copy || {};
  var PHOTOS = Array.isArray(window.GALLERY_DATA) ? window.GALLERY_DATA : [];

  var REDUCE = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Utilidades
     ---------------------------------------------------------------------- */

  // Reemplaza {clave} dentro de una plantilla de texto.
  function fill(tpl, vars) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] != null ? vars[k] : m;
    });
  }

  function waLink(message) {
    var w = CFG.whatsapp || {};
    var digits = String(w.number || '').replace(/\D/g, '');
    var text = message || w.defaultMessage || '';
    return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(text);
  }

  function serviceLink(name) {
    var w = CFG.whatsapp || {};
    return waLink(fill(w.serviceMessage, { servicio: name }));
  }

  function photoById(id) {
    for (var i = 0; i < PHOTOS.length; i++) {
      if (PHOTOS[i].id === id) return PHOTOS[i];
    }
    return null;
  }

  function has(v) {
    return typeof v === 'string' ? v.trim().length > 0 : !!v;
  }

  /* ------------------------------------------------------------------------
     Revelado al hacer scroll (un solo IntersectionObserver compartido)
     ---------------------------------------------------------------------- */
  var sharedObserver = null;

  function getObserver() {
    if (sharedObserver) return sharedObserver;
    if (!('IntersectionObserver' in window)) return null;
    sharedObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          sharedObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    return sharedObserver;
  }

  /* Red de seguridad: el contenido NUNCA debe quedarse invisible.
     Si hay elementos .reveal claramente dentro de la pantalla que el
     observador no marcó, asumimos que algo falló y lo mostramos todo. */
  function armRevealFailsafe() {
    if (REDUCE) return;

    var run = function () {
      if (document.hidden) return;
      var pending = document.querySelectorAll('.reveal:not(.is-in)');
      if (!pending.length) return;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var stuck = false;
      for (var i = 0; i < pending.length; i++) {
        var r = pending[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) { stuck = true; break; }
      }
      if (!stuck) return;
      for (var j = 0; j < pending.length; j++) pending[j].classList.add('is-in');
    };

    window.setTimeout(run, 2500);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) window.setTimeout(run, 2500);
    });
  }

  function useReveal() {
    var ref = useRef(null);
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      if (REDUCE) { el.classList.add('is-in'); return; }
      var obs = getObserver();
      if (!obs) { el.classList.add('is-in'); return; }
      obs.observe(el);
      return function () { obs.unobserve(el); };
    }, []);
    return ref;
  }

  function Reveal(props) {
    var ref = useReveal();
    var Tag = props.as || 'div';
    var style = Object.assign({}, props.style || {});
    if (props.delay) style['--rd'] = props.delay;
    return html`
      <${Tag} ref=${ref}
        className=${'reveal' + (props.className ? ' ' + props.className : '')}
        id=${props.id}
        style=${style}>${props.children}<//>`;
  }

  /* ------------------------------------------------------------------------
     Íconos (SVG en línea, 24x24)
     ---------------------------------------------------------------------- */
  var SPARK_D = 'M12 2.5C12.8 8.6 15.4 11.2 21.5 12 15.4 12.8 12.8 15.4 12 21.5 11.2 15.4 8.6 12.8 2.5 12 8.6 11.2 11.2 8.6 12 2.5Z';

  var ICONS = {
    whatsapp: function () {
      return html`<path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.87-7.01Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.19.2-.58.2-1.08.14-1.19-.06-.11-.22-.17-.47-.29Z"/>`;
    },
    instagram: function () {
      return html`<${React.Fragment}>
        <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor"/>
      <//>`;
    },
    arrow: function () {
      return html`<path d="M4.5 12h14m0 0-5.2-5.2M18.5 12l-5.2 5.2" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>`;
    },
    spark: function () {
      return html`<path fill="currentColor" d=${SPARK_D}/>`;
    },
    coffee: function () {
      return html`<${React.Fragment}>
        <path className="steam steam-1" d="M8.5 2.6c-.9 1 .9 1.9 0 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path className="steam steam-2" d="M12 2c-.9 1 .9 1.9 0 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path className="steam steam-3" d="M15.5 2.6c-.9 1 .9 1.9 0 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M4.5 9h13v5.2A5.3 5.3 0 0 1 12.2 19.5H9.8A5.3 5.3 0 0 1 4.5 14.2V9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M17.5 10.5h1.2a2.4 2.4 0 0 1 0 4.8h-1.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M5.5 21.5h11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <//>`;
    },
    heart: function () {
      return html`<path fill="currentColor" d="M12 20.6s-7.4-4.5-9.1-9.2C1.8 8.3 3.6 5.2 6.7 4.7c1.9-.3 3.7.6 5.3 2.3 1.6-1.7 3.4-2.6 5.3-2.3 3.1.5 4.9 3.6 3.8 6.7-1.7 4.7-9.1 9.2-9.1 9.2Z"/>`;
    },
    close: function () {
      return html`<path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>`;
    },
    chevronLeft: function () {
      return html`<path d="M14.8 5.2 8 12l6.8 6.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>`;
    },
    chevronRight: function () {
      return html`<path d="M9.2 5.2 16 12l-6.8 6.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>`;
    },
    expand: function () {
      return html`<path d="M9.5 4H4v5.5M14.5 4H20v5.5M14.5 20H20v-5.5M9.5 20H4v-5.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>`;
    },
    pin: function () {
      return html`<${React.Fragment}>
        <path d="M12 21.2s7-5.7 7-11.1a7 7 0 1 0-14 0c0 5.4 7 11.1 7 11.1Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <circle cx="12" cy="9.9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7"/>
      <//>`;
    },
    clock: function () {
      return html`<${React.Fragment}>
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M12 7.2V12l3.3 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <//>`;
    },
    hand: function () {
      return html`<path d="M8.4 12.4V5.5a1.6 1.6 0 0 1 3.2 0v5.9M11.6 11.4V4.4a1.6 1.6 0 0 1 3.2 0v7M14.8 11.6V6.7a1.6 1.6 0 0 1 3.2 0v8c0 3.5-2.4 6.1-5.9 6.1s-5.9-2.4-5.9-5.4V9.8a1.6 1.6 0 0 1 3.2 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>`;
    },
    flower: function () {
      return html`<${React.Fragment}>
        <circle cx="12" cy="6.6" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17.4" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="17.4" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="6.6" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <//>`;
    },
    nail: function () {
      return html`<${React.Fragment}>
        <path d="M7.7 10.6a4.4 4.4 0 0 1 8.8 0v7.2a3 3 0 0 1-3 3h-2.8a3 3 0 0 1-3-3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <circle cx="18.6" cy="5.4" r="1.6" fill="currentColor"/>
      <//>`;
    },
    polish: function () {
      return html`<${React.Fragment}>
        <rect x="9.9" y="2.6" width="4.2" height="4.6" rx="1.3" fill="currentColor"/>
        <path d="M10.5 9.4V7.2h3v2.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <rect x="7.2" y="9.4" width="9.6" height="11.4" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        <path d="M7.2 14.2h9.6" fill="none" stroke="currentColor" strokeWidth="1.6"/>
      <//>`;
    },
    french: function () {
      return html`<${React.Fragment}>
        <path d="M7.7 10.6a4.4 4.4 0 0 1 8.8 0v7.2a3 3 0 0 1-3 3h-2.8a3 3 0 0 1-3-3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        <path d="M7.7 12.5c2.9 1.9 5.9 1.9 8.8 0v-1.9a4.4 4.4 0 0 0-8.8 0Z" fill="currentColor"/>
      <//>`;
    },
    gem: function () {
      return html`<${React.Fragment}>
        <path d="M7.6 3.4h8.8l4 5.4L12 20.6 3.6 8.8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M3.6 8.8h16.8M9.2 3.4 7.4 8.8 12 20.6l4.6-11.8-1.8-5.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <//>`;
    },
    refresh: function () {
      return html`<${React.Fragment}>
        <path d="M4.8 11.2a7.4 7.4 0 0 1 12.5-4.4l2.1 2.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19.4 4.4v4.9h-4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.2 12.8a7.4 7.4 0 0 1-12.5 4.4l-2.1-2.1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M4.6 19.6v-4.9h4.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <//>`;
    },
    feather: function () {
      return html`<${React.Fragment}>
        <path d="M19.6 4.4c1.5 4.7-.5 9.1-4.2 11.1-2.7 1.4-5.7 1.2-7.7-.5L19.6 4.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M17.6 6.4 5.2 18.8M13.6 10.6H9.4M16 8.2h-4.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <//>`;
    }
  };

  function Icon(props) {
    var render = ICONS[props.name] || ICONS.spark;
    var size = props.size || 20;
    return html`
      <svg className=${props.className}
        width=${size} height=${size}
        viewBox="0 0 24 24"
        aria-hidden="true" focusable="false">${render()}</svg>`;
  }

  function SparkleDeco(props) {
    return html`
      <svg className=${'sparkle ' + (props.variant || '')}
        style=${{ '--d': props.delay || '0s' }}
        viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="currentColor" d=${SPARK_D}/>
      </svg>`;
  }

  /* ------------------------------------------------------------------------
     Navegación
     ---------------------------------------------------------------------- */
  function Brand(props) {
    var b = CFG.business || {};
    var parts = b.nameParts || { first: b.name || '', rest: '' };
    return html`
      <a className="brand" href="#top" aria-label=${b.name} onClick=${props.onClick}>
        <span className="brand-mark">${parts.first}</span>
        <span className="brand-rest">${parts.rest}</span>
      </a>`;
  }

  function Announcement() {
    var a = C.announcement || {};
    if (!a.enabled || !a.text) return null;
    return html`
      <div className="announce" role="note">
        <div className="container announce-inner">
          <span className="announce-cup" aria-hidden="true"><${Icon} name="coffee" size=${18} /></span>
          <span className="announce-text">
            <strong>${a.text}</strong>${a.tail ? html`<span className="announce-tail"> ${a.tail}</span>` : null}
          </span>
          <span className="announce-heart" aria-hidden="true"><${Icon} name="heart" size=${14} /></span>
        </div>
      </div>`;
  }

  function Nav() {
    var state = useState(false); var open = state[0]; var setOpen = state[1];
    var s2 = useState(false); var scrolled = s2[0]; var setScrolled = s2[1];

    var nav = C.nav || {};
    var links = nav.links || [];

    useEffect(function () {
      var onScroll = function () { setScrolled(window.pageYOffset > 10); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return function () { window.removeEventListener('scroll', onScroll); };
    }, []);

    useEffect(function () {
      if (!open) return;
      document.body.classList.add('no-scroll');
      var onKey = function (e) { if (e.key === 'Escape') setOpen(false); };
      var onResize = function () { if (window.innerWidth >= 940) setOpen(false); };
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', onResize);
      return function () {
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
      };
    }, [open]);

    var closeMenu = function () { setOpen(false); };

    // Desde el panel móvil: cerrar primero (quita body.no-scroll) y luego
    // desplazar. Si dejamos el salto de ancla por defecto, ocurre mientras el
    // body aún tiene overflow:hidden y el navegador no se mueve.
    var goTo = function (href) {
      return function (e) {
        if (!href || href.charAt(0) !== '#') { setOpen(false); return; }
        e.preventDefault();
        setOpen(false);
        document.body.classList.remove('no-scroll');
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            var target = href === '#top' ? document.body : document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
            if (window.history && window.history.replaceState) window.history.replaceState(null, '', href);
          });
        });
      };
    };

    return html`
      <header className=${'nav' + (scrolled || open ? ' is-scrolled' : '')}>
        <div className="container nav-inner">
          <${Brand} onClick=${closeMenu} />

          <nav className="nav-links" aria-label="Navegación principal">
            ${links.map(function (l) {
              return html`<a key=${l.href} className="nav-link" href=${l.href}>${l.label}</a>`;
            })}
          </nav>

          <a className="btn btn--sm nav-cta" href=${waLink()} target="_blank" rel="noopener noreferrer">
            <${Icon} name="whatsapp" size=${17} />${nav.cta}
          </a>

          <button type="button"
            className=${'nav-toggle' + (open ? ' is-open' : '')}
            aria-expanded=${open}
            aria-controls="menu-movil"
            aria-label=${open ? nav.closeMenu : nav.openMenu}
            onClick=${function () { setOpen(!open); }}>
            <span></span><span></span><span></span>
          </button>
        </div>

        ${open ? ReactDOM.createPortal(html`
          <div className="nav-sheet" id="menu-movil">
            <ul>
              ${links.map(function (l, i) {
                return html`
                  <li key=${l.href}>
                    <a className="nav-sheet-link" href=${l.href}
                      style=${{ '--d': (0.04 + i * 0.05) + 's' }}
                      onClick=${goTo(l.href)}>
                      ${l.label}<span aria-hidden="true">✦</span>
                    </a>
                  </li>`;
              })}
            </ul>
            <a className="btn btn--block" href=${waLink()} target="_blank" rel="noopener noreferrer" onClick=${closeMenu}>
              <${Icon} name="whatsapp" size=${18} />${(C.hero || {}).ctaPrimary}
            </a>
          </div>`, document.body) : null}
      </header>`;
  }

  /* ------------------------------------------------------------------------
     Hero
     ---------------------------------------------------------------------- */
  function Hero() {
    var h = C.hero || {};
    var heroCfg = CFG.hero || {};

    var picked = (heroCfg.tiles || []).map(photoById).filter(Boolean);
    if (picked.length < 3) {
      var featured = PHOTOS.filter(function (p) { return p.featured; });
      picked = picked.concat(featured).filter(function (p, i, arr) {
        return arr.indexOf(p) === i;
      }).slice(0, 3);
    }
    var accent = photoById(heroCfg.accent) || PHOTOS[PHOTOS.length - 1] || null;
    var lines = h.headline || [];
    var slots = ['a', 'b', 'c'];

    return html`
      <section className="hero" aria-labelledby="hero-titulo">
        <div className="container hero-inner">

          <div className="hero-copy">
            <p className="hero-eyebrow" data-anim style=${{ '--d': '0.05s' }}>
              <span className="dot" aria-hidden="true"></span>${h.eyebrow}
            </p>

            <h1 className="hero-title" id="hero-titulo">
              ${lines.map(function (line, i) {
                return html`<span key=${i} className="line" data-anim style=${{ '--d': (0.14 + i * 0.09) + 's' }}>${line}</span>`;
              })}
              <span className="line" data-anim style=${{ '--d': (0.14 + lines.length * 0.09) + 's' }}>
                <span className="accent-word">
                  ${h.headlineAccent}
                  <svg className="squiggle" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                    <path d="M7 15C58 4 104 20 152 11.5 200 3 252 6 293 14"/>
                  </svg>
                </span>
              </span>
            </h1>

            <p className="hero-sub" data-anim style=${{ '--d': '0.42s' }}>${h.subline}</p>

            <div className="hero-actions" data-anim style=${{ '--d': '0.52s' }}>
              <a className="btn btn--lg" href=${waLink()} target="_blank" rel="noopener noreferrer">
                <${Icon} name="whatsapp" size=${19} />${h.ctaPrimary}
              </a>
              <a className="btn btn--lg btn--ghost" href="#galeria">
                ${h.ctaSecondary}<${Icon} name="arrow" size=${17} />
              </a>
            </div>

            <p className="hero-trust" data-anim style=${{ '--d': '0.62s' }}>
              <${Icon} name="spark" size=${15} />${h.trust}
            </p>
          </div>

          <div className="hero-visual" data-anim style=${{ '--d': '0.1s' }}>
            <div className="cluster">
              <span className="cluster-blob" aria-hidden="true"></span>
              <span className="cluster-ring" aria-hidden="true"></span>

              ${slots.map(function (slot, i) {
                var p = picked[i];
                if (!p) return null;
                return html`
                  <div key=${slot} className=${'cluster-tile tile-' + slot} style=${{ '--d': (0.2 + i * 0.13) + 's' }}>
                    <img src=${i === 0 ? p.web : p.thumb} alt=${p.alt} width=${p.width} height=${p.height}
                      loading="eager" fetchpriority=${i === 0 ? 'high' : 'auto'} decoding="async" />
                  </div>`;
              })}

              ${accent ? html`
                <div className="cluster-accent" style=${{ '--d': '0.6s' }}>
                  <img src=${accent.thumb} alt=${accent.alt} width=${accent.width} height=${accent.height}
                    loading="eager" decoding="async" />
                </div>` : null}

              <span className="cluster-badge">
                <${Icon} name="spark" size=${13} />${h.badge}
              </span>

              <${SparkleDeco} variant="sparkle--1" delay="0.2s" />
              <${SparkleDeco} variant="sparkle--2" delay="1.4s" />
              <${SparkleDeco} variant="sparkle--3" delay="2.6s" />
            </div>
          </div>

        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Cinta de servicios
     ---------------------------------------------------------------------- */
  function Marquee() {
    var items = C.marquee || [];
    if (!items.length) return null;

    var group = function (key) {
      return html`
        <div className="marquee-group" key=${key}>
          ${items.map(function (label, i) {
            return html`
              <span className="marquee-item" key=${i}>
                ${label}<span className="sep" aria-hidden="true">✦</span>
              </span>`;
          })}
        </div>`;
    };

    return html`
      <div className="marquee-band">
        <div className="marquee" role="presentation" aria-hidden="true">
          <div className="marquee-track">${[group('a'), group('b')]}</div>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------------------
     Servicios
     ---------------------------------------------------------------------- */
  function ServiceCard(props) {
    var sv = props.service;
    var s = C.services || {};
    var hasPrice = has(sv.price);
    var hasDuration = has(sv.duration);

    return html`
      <${Reveal} className="svc-card" delay=${(props.index % 4) * 0.08 + 's'}>
        <span className="svc-icon"><${Icon} name=${sv.icon} size=${24} /></span>
        <h3 className="svc-name">${sv.name}</h3>
        <p className="svc-desc">${sv.description}</p>
        <div className="svc-meta">
          <span className=${'pill' + (hasPrice ? ' pill--solid' : '')}>
            ${hasPrice ? sv.price : s.priceAsk}
          </span>
          ${hasDuration ? html`<span className="pill pill--muted">${sv.duration}</span>` : null}
        </div>
        <a className="svc-book" href=${serviceLink(sv.name)} target="_blank" rel="noopener noreferrer"
          aria-label=${fill(s.bookAria, { servicio: sv.name })}>
          ${s.book}<${Icon} name="arrow" size=${16} />
        </a>
      <//>`;
  }

  function Services() {
    var s = C.services || {};
    var list = CFG.services || [];
    if (!list.length) return null;

    return html`
      <section className="section" id="servicios" aria-labelledby="servicios-titulo">
        <div className="container">
          <${Reveal} className="section-head section-head--center">
            <p className="eyebrow">${s.eyebrow}</p>
            <h2 className="section-title" id="servicios-titulo">${s.title}</h2>
            <p className="section-sub">${s.subtitle}</p>
          <//>
          <div className="svc-grid">
            ${list.map(function (sv, i) {
              return html`<${ServiceCard} key=${sv.id || i} service=${sv} index=${i} />`;
            })}
          </div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Galería + lightbox
     ---------------------------------------------------------------------- */
  function GalleryTile(props) {
    var ref = useReveal();
    var g = C.gallery || {};
    var p = props.photo;
    var i = props.index;

    return html`
      <div ref=${ref} className="gtile-wrap reveal" style=${{ '--rd': ((i % 8) * 0.05) + 's' }}>
        <button type="button"
          className=${'gtile' + (i % 3 === 0 ? ' gtile--arch' : '')}
          onClick=${function (e) { props.onOpen(i, e); }}
          aria-label=${fill(g.openAria, { alt: p.alt })}>
          <span className="gtile-frame">
            <img src=${p.thumb} alt=${p.alt} width=${p.width} height=${p.height}
              loading="lazy" decoding="async" />
            <span className="gtile-veil" aria-hidden="true">
              <span className="gtile-zoom"><${Icon} name="expand" size=${16} /></span>
            </span>
          </span>
        </button>
      </div>`;
  }

  function Lightbox(props) {
    var g = (C.gallery || {}).lightbox || {};
    var items = props.items;
    var index = props.index;
    var onClose = props.onClose;
    var onPrev = props.onPrev;
    var onNext = props.onNext;

    var st = useState(false); var exiting = st[0]; var setExiting = st[1];
    var rootRef = useRef(null);
    var closeRef = useRef(null);
    var touchX = useRef(null);

    var requestClose = useCallback(function () {
      if (REDUCE) { onClose(); return; }
      setExiting(true);
      window.setTimeout(onClose, 200);
    }, [onClose]);

    useEffect(function () {
      document.body.classList.add('no-scroll');
      return function () { document.body.classList.remove('no-scroll'); };
    }, []);

    useEffect(function () {
      if (closeRef.current) closeRef.current.focus();
    }, []);

    useEffect(function () {
      var onKey = function (e) {
        if (e.key === 'Escape') { e.preventDefault(); requestClose(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
        else if (e.key === 'Tab') {
          var root = rootRef.current;
          if (!root) return;
          var f = root.querySelectorAll('button, a[href]');
          if (!f.length) return;
          var first = f[0];
          var last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', onKey);
      return function () { document.removeEventListener('keydown', onKey); };
    }, [requestClose, onPrev, onNext]);

    var p = items[index];
    if (!p) return null;

    var onBackdrop = function (e) {
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-close') === 'true') {
        requestClose();
      }
    };
    var onTouchStart = function (e) { touchX.current = e.changedTouches[0].clientX; };
    var onTouchEnd = function (e) {
      if (touchX.current == null) return;
      var dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 55) { if (dx < 0) onNext(); else onPrev(); }
    };

    return html`
      <div ref=${rootRef}
        className=${'lb' + (exiting ? ' is-exit' : '')}
        role="dialog" aria-modal="true" aria-label=${g.label}
        data-close="true"
        onClick=${onBackdrop}
        onTouchStart=${onTouchStart}
        onTouchEnd=${onTouchEnd}>

        <button type="button" ref=${closeRef} className="lb-close"
          onClick=${requestClose} aria-label=${g.close}>
          <${Icon} name="close" size=${22} />
        </button>

        <div className="lb-stage" data-close="true">
          <figure className="lb-fig" key=${p.id}>
            <img className="lb-img" src=${p.web} alt=${p.alt}
              width=${p.width} height=${p.height} decoding="async" />
            <figcaption className="lb-cap">${p.caption || p.alt}</figcaption>
          </figure>
        </div>

        <div className="lb-bar">
          <button type="button" className="lb-nav" onClick=${onPrev} aria-label=${g.prev}>
            <${Icon} name="chevronLeft" size=${22} />
          </button>
          <p className="lb-count" aria-live="polite">
            ${fill(g.counter, { i: index + 1, n: items.length })}
          </p>
          <button type="button" className="lb-nav" onClick=${onNext} aria-label=${g.next}>
            <${Icon} name="chevronRight" size=${22} />
          </button>
        </div>
      </div>`;
  }

  function Gallery() {
    var g = C.gallery || {};
    var ig = CFG.instagram || {};

    var s1 = useState('todas'); var active = s1[0]; var setActive = s1[1];
    var s2 = useState(-1); var index = s2[0]; var setIndex = s2[1];
    var lastFocus = useRef(null);

    var filters = useMemo(function () {
      var base = [{ id: 'todas', label: g.filterAll }];
      var extra = (g.filters || []).filter(function (f) {
        return PHOTOS.some(function (p) { return (p.tags || []).indexOf(f.id) !== -1; });
      });
      return base.concat(extra);
    }, []);

    var items = useMemo(function () {
      if (active === 'todas') return PHOTOS;
      return PHOTOS.filter(function (p) { return (p.tags || []).indexOf(active) !== -1; });
    }, [active]);

    var open = function (i, e) {
      lastFocus.current = e && e.currentTarget ? e.currentTarget : null;
      setIndex(i);
    };
    var close = useCallback(function () {
      setIndex(-1);
      var el = lastFocus.current;
      if (el && typeof el.focus === 'function') {
        try { el.focus(); } catch (err) { /* nada */ }
      }
    }, []);
    var prev = useCallback(function () {
      setIndex(function (i) { return (i - 1 + items.length) % items.length; });
    }, [items.length]);
    var next = useCallback(function () {
      setIndex(function (i) { return (i + 1) % items.length; });
    }, [items.length]);

    var chooseFilter = function (id) {
      setIndex(-1);
      setActive(id);
    };

    if (!PHOTOS.length) return null;

    return html`
      <section className="section" id="galeria" aria-labelledby="galeria-titulo">
        <div className="container">
          <${Reveal} className="section-head section-head--center">
            <p className="eyebrow">${g.eyebrow}</p>
            <h2 className="section-title" id="galeria-titulo">${g.title}</h2>
            <p className="section-sub">${g.subtitle}</p>
          <//>

          ${filters.length > 1 ? html`
            <${Reveal} className="filters" as="div">
              ${filters.map(function (f) {
                return html`
                  <button type="button" key=${f.id}
                    className=${'chip' + (active === f.id ? ' is-active' : '')}
                    aria-pressed=${active === f.id}
                    onClick=${function () { chooseFilter(f.id); }}>${f.label}</button>`;
              })}
            <//>` : null}

          ${items.length ? html`
            <div className="masonry">
              ${items.map(function (p, i) {
                return html`<${GalleryTile} key=${p.id} photo=${p} index=${i} onOpen=${open} />`;
              })}
            </div>` : html`<p className="gal-empty">${g.empty}</p>`}

          ${has(ig.url) ? html`
            <div className="gal-foot">
              <a className="ig-link" href=${ig.url} target="_blank" rel="noopener noreferrer">
                <${Icon} name="instagram" size=${18} />${g.instagramCta}
              </a>
            </div>` : null}
        </div>

        ${index >= 0 ? html`
          <${Lightbox} items=${items} index=${index}
            onClose=${close} onPrev=${prev} onNext=${next} />` : null}
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Sobre Dama
     ---------------------------------------------------------------------- */
  function About() {
    var a = CFG.about || {};
    var c = C.about || {};
    var paras = a.paragraphs || [];

    return html`
      <section className="section" id="sobre" aria-labelledby="sobre-titulo">
        <div className="container">
          <${Reveal} className="about-card">
            <div className="about-grid">

              <div className="avatar-wrap">
                ${has(a.avatar) ? html`
                  <img className="avatar" src=${a.avatar} alt=${a.avatarAlt || ''}
                    width="150" height="150" loading="lazy" decoding="async" />` : null}
                <svg className="avatar-spark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d=${SPARK_D}/>
                </svg>
              </div>

              <div className="about-body">
                <p className="eyebrow">${c.eyebrow}</p>
                <h2 className="section-title about-title" id="sobre-titulo">${c.title}</h2>
                ${paras.map(function (t, i) {
                  return html`<p key=${i} className=${i === 0 ? 'lead' : ''}>${t}</p>`;
                })}
                ${has(a.signature) ? html`<div className="signature">${a.signature}</div>` : null}
                <div className="about-cta">
                  <a className="btn" href=${waLink()} target="_blank" rel="noopener noreferrer">
                    <${Icon} name="whatsapp" size=${18} />${c.cta}
                  </a>
                </div>
              </div>

            </div>
          <//>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Cómo reservar
     ---------------------------------------------------------------------- */
  function Booking() {
    var b = CFG.booking || {};
    var c = C.booking || {};
    var steps = b.steps || [];

    return html`
      <section className="section" id="reservar" aria-labelledby="reservar-titulo">
        <div className="container">
          <${Reveal} className="section-head section-head--center">
            <p className="eyebrow">${c.eyebrow}</p>
            <h2 className="section-title" id="reservar-titulo">${c.title}</h2>
            <p className="section-sub">${c.subtitle}</p>
          <//>

          <div className="steps">
            ${steps.map(function (s, i) {
              return html`
                <${Reveal} key=${i} className="step" delay=${(i * 0.12) + 's'}>
                  <span className="step-num" aria-hidden="true">${i + 1}</span>
                  <h3 className="step-title">${s.title}</h3>
                  <p className="step-text">${s.text}</p>
                <//>`;
            })}
          </div>

          <${Reveal} className="book-cta">
            <h3>${c.ctaTitle}</h3>
            <p>${c.ctaText}</p>
            <a className="btn btn--lg btn--light" href=${waLink()} target="_blank" rel="noopener noreferrer">
              <${Icon} name="whatsapp" size=${19} />${c.cta}
            </a>
            <span className="book-note">${c.note}</span>
          <//>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Ubicación / horario / contacto
     ---------------------------------------------------------------------- */
  function InfoCard(props) {
    return html`
      <${Reveal} className="info-card" delay=${(props.index * 0.08) + 's'}>
        <span className="info-icon"><${Icon} name=${props.icon} size=${22} /></span>
        <p className="info-title">${props.title}</p>
        ${props.children}
        ${props.action ? html`
          <a className="info-action" href=${props.action.href}
            target=${props.action.external ? '_blank' : null}
            rel=${props.action.external ? 'noopener noreferrer' : null}>
            ${props.action.label}<${Icon} name="arrow" size=${15} />
          </a>` : null}
      <//>`;
  }

  function Info() {
    var c = C.info || {};
    var loc = CFG.location || {};
    var hours = CFG.hours || [];
    var wa = CFG.whatsapp || {};
    var ig = CFG.instagram || {};

    var hasCity = has(loc.city);
    var hasAddress = has(loc.address);
    var hasMaps = has(loc.mapsUrl);
    var showLocation = hasCity || hasAddress || hasMaps;

    var cards = [];

    if (showLocation) {
      cards.push({
        key: 'loc',
        icon: 'pin',
        title: c.locationTitle,
        action: hasMaps ? { href: loc.mapsUrl, label: c.directions, external: true } : null,
        body: html`<${React.Fragment}>
          ${hasCity ? html`<p className="info-value">${loc.city}</p>` : null}
          ${hasAddress ? html`<p className="info-note">${loc.address}</p>` : null}
        <//>`
      });
    }

    cards.push({
      key: 'hours',
      icon: 'clock',
      title: c.hoursTitle,
      action: hours.length ? null : { href: waLink(), label: c.whatsappAction, external: true },
      body: hours.length
        ? html`<ul className="info-hours">
            ${hours.map(function (h, i) {
              return html`<li key=${i}><span>${h.days}</span><span>${h.time}</span></li>`;
            })}
          </ul>`
        : html`<p className="info-note">${c.hoursEmpty}</p>`
    });

    cards.push({
      key: 'wa',
      icon: 'whatsapp',
      title: c.whatsappTitle,
      action: { href: waLink(), label: c.whatsappAction, external: true },
      body: html`<p className="info-value">
        <a href=${waLink()} target="_blank" rel="noopener noreferrer">${wa.display}</a>
      </p>`
    });

    if (has(ig.url)) {
      cards.push({
        key: 'ig',
        icon: 'instagram',
        title: c.instagramTitle,
        action: { href: ig.url, label: c.instagramAction, external: true },
        body: html`<p className="info-value">
          <a href=${ig.url} target="_blank" rel="noopener noreferrer">${ig.handle}</a>
        </p>`
      });
    }

    var cols = Math.min(Math.max(cards.length, 2), 4);

    return html`
      <section className="section section--tight" id="ubicacion" aria-labelledby="ubicacion-titulo">
        <div className="container">
          <${Reveal} className="section-head section-head--center">
            <p className="eyebrow">${c.eyebrow}</p>
            <h2 className="section-title" id="ubicacion-titulo">${c.title}</h2>
          <//>
          <div className="info-grid" style=${{ '--cols': cols }}>
            ${cards.map(function (card, i) {
              return html`
                <${InfoCard} key=${card.key} icon=${card.icon} title=${card.title}
                  action=${card.action} index=${i}>${card.body}<//>`;
            })}
          </div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------------
     Pie de página + botón flotante
     ---------------------------------------------------------------------- */
  function Footer() {
    var f = C.footer || {};
    var wa = CFG.whatsapp || {};
    var ig = CFG.instagram || {};

    return html`
      <footer className="footer">
        <div className="container footer-inner">
          <${Brand} />
          <p className="footer-tag">${f.tagline}</p>

          <div className="footer-links">
            <a className="footer-link" href=${waLink()} target="_blank" rel="noopener noreferrer">
              <${Icon} name="whatsapp" size=${17} />${wa.display}
            </a>
            ${has(ig.url) ? html`
              <a className="footer-link" href=${ig.url} target="_blank" rel="noopener noreferrer">
                <${Icon} name="instagram" size=${17} />${ig.handle}
              </a>` : null}
          </div>

          <hr className="footer-rule" />

          <div className="footer-fine">
            <span>${f.rights}</span>
            <span>${f.madeWith}</span>
          </div>
        </div>
      </footer>`;
  }

  function FloatingWhatsApp() {
    var f = C.floating || {};
    return html`
      <a className="wa-float" href=${waLink()} target="_blank" rel="noopener noreferrer"
        aria-label=${f.label}>
        <span className="wa-pulse" aria-hidden="true"></span>
        <${Icon} name="whatsapp" size=${30} />
      </a>`;
  }

  /* ------------------------------------------------------------------------
     App
     ---------------------------------------------------------------------- */
  function App() {
    return html`
      <div className="page" id="top">
        <${Announcement} />
        <${Nav} />
        <main id="contenido">
          <${Hero} />
          <${Marquee} />
          <${Services} />
          <${Gallery} />
          <${About} />
          <${Booking} />
          <${Info} />
        </main>
        <${Footer} />
        <${FloatingWhatsApp} />
      </div>`;
  }

  /* ------------------------------------------------------------------------
     Arranque
     ---------------------------------------------------------------------- */

  // El título y la descripción también salen de config.js.
  var seo = CFG.seo || {};
  if (has(seo.title)) document.title = seo.title;
  if (has(seo.description)) {
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', seo.description);
  }

  var mount = document.getElementById('root');
  if (mount) {
    ReactDOM.createRoot(mount).render(html`<${App} />`);
    armRevealFailsafe();
  }
})();
