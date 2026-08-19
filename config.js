/* ============================================================================
   Dama Nails Center — CONFIGURACIÓN DEL SITIO
   ----------------------------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para cambiar textos, precios,
   horarios, dirección y datos de contacto. No hace falta tocar app.js.

   Reglas importantes:
   - Si un campo se deja vacío ("" o []), la sección correspondiente
     simplemente NO se muestra. Nunca se enseña un "TODO" al visitante.
   - Los precios vacíos ("") se muestran como una etiqueta "Consultar".
   - El número de WhatsApp va SOLO en dígitos, con código de país y sin signos.
   ========================================================================== */

window.SITE_CONFIG = {

  /* --- Negocio ----------------------------------------------------------- */
  business: {
    name: 'Dama Nails Center',
    nameParts: { first: 'Dama', rest: 'Nails Center' }, // para el logotipo
    owner: 'Damarlyn Reyes',
    ownerShort: 'Dama',
    country: 'República Dominicana'
  },

  /* --- WhatsApp ---------------------------------------------------------- */
  whatsapp: {
    number: '18092600597',            // solo dígitos: código de país + número
    display: '+1 (809) 260-0597',     // como se ve en pantalla
    // Mensaje que se escribe solo cuando alguien pulsa un botón general:
    defaultMessage: 'Hola Dama 💅 Vi tu página web y quiero agendar una cita. ¿Qué disponibilidad tienes?',
    // Mensaje para los botones de cada servicio. {servicio} se reemplaza solo:
    serviceMessage: 'Hola Dama 💅 Quiero agendar una cita para *{servicio}*. ¿Qué disponibilidad tienes?'
  },

  /* --- Instagram --------------------------------------------------------- */
  instagram: {
    handle: '@dama_nails_center',
    url: 'https://www.instagram.com/dama_nails_center/'
  },

  /* --- Ubicación --------------------------------------------------------
     TODO: confirmar con Dama. Mientras estos campos estén vacíos, la tarjeta
     de ubicación no aparece en la página (no se muestra ningún placeholder).
     Ejemplo cuando se sepa:
       city: 'Santiago de los Caballeros',
       address: 'Calle Ejemplo #12, Sector Ejemplo',
       mapsUrl: 'https://maps.google.com/?q=...'
  ------------------------------------------------------------------------ */
  location: {
    city: '',
    address: '',
    mapsUrl: ''
  },

  /* --- Horario ----------------------------------------------------------
     TODO: confirmar con Dama. Array vacío = se muestra el aviso de WhatsApp.
     Ejemplo cuando se sepa:
       hours: [
         { days: 'Lunes a viernes', time: '9:00 a. m. – 6:00 p. m.' },
         { days: 'Sábado',          time: '9:00 a. m. – 4:00 p. m.' },
         { days: 'Domingo',         time: 'Cerrado' }
       ]
  ------------------------------------------------------------------------ */
  hours: [],

  /* --- Servicios --------------------------------------------------------
     TODO: confirmar precios y duraciones con Dama.
     price: ''    -> se muestra la etiqueta "Consultar"
     duration: '' -> no se muestra nada
     icon: nombre del ícono (hand, flower, nail, polish, french, gem,
           refresh, feather, sparkle). Si no existe, usa una estrellita.
  ------------------------------------------------------------------------ */
  services: [
    {
      id: 'manicure',
      name: 'Manicure clásico',
      description: 'Limado, cutículas y esmaltado prolijo. Manos limpias y listas para todo.',
      icon: 'hand',
      emoji: '💅',
      price: '',
      duration: ''
    },
    {
      id: 'pedicure',
      name: 'Pedicure',
      description: 'Cuidado completo de tus pies, con calma y mucho detalle.',
      icon: 'flower',
      emoji: '🌸',
      price: '',
      duration: ''
    },
    {
      id: 'acrilicas',
      name: 'Uñas acrílicas',
      description: 'Extensiones a tu medida: el largo, la forma y el acabado que tú quieras.',
      icon: 'nail',
      emoji: '✨',
      price: '',
      duration: ''
    },
    {
      id: 'gel',
      name: 'Gel / Esmaltado semipermanente',
      description: 'Color parejo y bien brillante que se mantiene lindo por semanas.',
      icon: 'polish',
      emoji: '🧴',
      price: '',
      duration: ''
    },
    {
      id: 'francesas',
      name: 'Francesas',
      description: 'La francesa clásica en blanco o en el color que se te antoje.',
      icon: 'french',
      emoji: '🤍',
      price: '',
      duration: ''
    },
    {
      id: 'nail-art',
      name: 'Nail art & pedrería',
      description: 'Mariposas, flores, foil dorado y cristales. Tú traes la idea, yo la hago.',
      icon: 'gem',
      emoji: '💎',
      price: '',
      duration: ''
    },
    {
      id: 'retoque',
      name: 'Retoque / relleno',
      description: 'Para mantener tu set fresco, parejo y como el primer día.',
      icon: 'refresh',
      emoji: '🔁',
      price: '',
      duration: ''
    },
    {
      id: 'retiro',
      name: 'Retiro de acrílico',
      description: 'Retiro cuidadoso, sin maltratar tu uña natural.',
      icon: 'feather',
      emoji: '🕊️',
      price: '',
      duration: ''
    }
  ],

  /* --- Fotos destacadas del hero ----------------------------------------
     Los ids salen de assets/img/gallery-data.js
  ------------------------------------------------------------------------ */
  hero: {
    tiles: ['16', '05', '03'],
    accent: '01'
  },

  /* --- Cómo reservar ----------------------------------------------------- */
  booking: {
    steps: [
      {
        title: 'Escríbeme por WhatsApp',
        text: 'Mándame un mensajito con lo que tienes en mente. Si traes una foto de referencia, mucho mejor.'
      },
      {
        title: 'Elegimos servicio y horario',
        text: 'Conversamos el diseño y buscamos el día y la hora que mejor te queden.'
      },
      {
        title: 'Llega y relájate',
        text: 'Tú solo te acomodas y dejas que yo me encargue del resto. Sales con las manos preciosas.'
      }
    ]
  },

  /* --- Sobre Dama -------------------------------------------------------- */
  about: {
    avatar: 'assets/img/dama.jpg',
    avatarAlt: 'Damarlyn Reyes, fundadora de Dama Nails Center',
    paragraphs: [
      'Hola, soy Damarlyn — pero todo el mundo me dice Dama. Hago uñas porque me encanta ese momento en que una clienta se mira las manos y sonríe.',
      'Trabajo con calma y mucho detalle: me gusta que cada uña quede pareja, limpia y bien terminada. Sea una francesa sencilla o un diseño lleno de mariposas y pedrería, la idea es que salgas sintiéndote linda.',
      'Escríbeme y conversamos sobre lo que quieres. Me encanta cuando llegan con fotos de inspiración.'
    ],
    signature: 'Dama'
  },

  /* --- SEO / metadatos --------------------------------------------------- */
  seo: {
    title: 'Dama Nails Center · Uñas acrílicas, francesas y nail art',
    description: 'Estudio de uñas de Damarlyn Reyes en República Dominicana. Acrílicas, gel, francesas, nail art y pedrería. Agenda tu cita por WhatsApp.',
    ogImage: 'assets/img/web/16.jpg'
  },

  /* --- Textos de la interfaz -------------------------------------------- */
  copy: {
    // Stickercito en el hero (arriba del botón de WhatsApp). enabled:false lo oculta.
    announcement: {
      enabled: true,
      text: 'Cafecito incluido',
      tail: 'para nuestras clientas, con cariño'
    },

    nav: {
      links: [
        { href: '#servicios', label: 'Servicios' },
        { href: '#galeria',   label: 'Galería' },
        { href: '#sobre',     label: 'Sobre Dama' },
        { href: '#reservar',  label: 'Reservar' }
      ],
      cta: 'Reservar',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú'
    },

    hero: {
      eyebrow: 'Estudio de uñas · República Dominicana',
      headline: ['Uñas lindas,', 'hechas con'],
      headlineAccent: 'amor',
      subline: 'Acrílicas, gel, francesas y nail art hechos con calma y mucho detalle. Tú traes la idea; yo me encargo de que tus manos queden preciosas.',
      ctaPrimary: 'Reservar por WhatsApp',
      ctaSecondary: 'Ver galería',
      trust: 'Atención personalizada · Cita por WhatsApp',
      badge: 'Diseños a tu medida'
    },

    marquee: [
      'Manicure clásico', 'Pedicure', 'Uñas acrílicas', 'Gel semipermanente',
      'Francesas', 'Nail art', 'Pedrería', 'Retoque', 'Diseños a tu medida', 'Cafecito incluido ☕'
    ],

    services: {
      eyebrow: 'Lo que hacemos',
      title: 'Servicios',
      subtitle: 'Desde un manicure sencillito hasta un set completo con diseño. Todo se conversa antes para que quede justo como lo imaginas.',
      priceAsk: 'Consultar',
      book: 'Reservar',
      bookAria: 'Reservar {servicio} por WhatsApp'
    },

    gallery: {
      eyebrow: 'Trabajos reales',
      title: 'Galería',
      subtitle: 'Cada set que ves aquí salió de estas manos. Toca una foto para verla en grande.',
      filterAll: 'Todas',
      filters: [
        { id: 'francesas', label: 'Francesas' },
        { id: 'nail-art',  label: 'Nail art' },
        { id: 'acrilicas', label: 'Acrílicas' },
        { id: 'color',     label: 'Color' },
        { id: 'pedrería',  label: 'Pedrería' }
      ],
      instagramCta: 'Ver más en Instagram',
      empty: 'Todavía no hay fotos en esta categoría.',
      openAria: 'Ver foto en grande: {alt}',
      lightbox: {
        label: 'Foto ampliada',
        close: 'Cerrar',
        prev: 'Foto anterior',
        next: 'Foto siguiente',
        counter: '{i} de {n}'
      }
    },

    about: {
      eyebrow: 'Quién te atiende',
      title: 'Sobre Dama',
      cta: 'Escríbeme por WhatsApp'
    },

    booking: {
      eyebrow: 'Así de fácil',
      title: 'Cómo reservar',
      subtitle: 'No hay formularios ni complicaciones. Todo se coordina por WhatsApp, de una vez.',
      cta: 'Reservar por WhatsApp',
      ctaTitle: '¿Lista para tus uñas nuevas?',
      ctaText: 'Escríbeme y coordinamos tu cita en un par de mensajes. Cuéntame qué diseño tienes en mente y buscamos el momento perfecto.',
      note: 'Te respondo lo antes posible.'
    },

    info: {
      eyebrow: 'Dónde y cuándo',
      title: 'Ubicación y horario',
      locationTitle: 'Ubicación',
      directions: 'Cómo llegar',
      hoursTitle: 'Horario',
      hoursEmpty: 'Escríbeme por WhatsApp para ver disponibilidad',
      whatsappTitle: 'WhatsApp',
      whatsappAction: 'Escribir ahora',
      instagramTitle: 'Instagram',
      instagramAction: 'Ver el perfil'
    },

    footer: {
      tagline: 'Uñas acrílicas, francesas y nail art hechos con cariño.',
      rights: '© 2026 Dama Nails Center',
      madeWith: 'Sitio hecho con 💗'
    },

    floating: {
      label: 'Escríbeme por WhatsApp'
    }
  }
};
