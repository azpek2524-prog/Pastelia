// Plan de arranque en Instagram · Semana 1 ($0, orgánico) — fuente única del contenido.
// De aquí salen: slides (HTML y PNG), storyboards, guiones .md, subtítulos .srt, captions y DM .txt,
// perfil, playbook, calendario y la página "Kit de contenido Pastelia". Para cambiar un texto, cámbialo
// aquí y vuelve a generar (ver LEEME.md).
//
// Verificado en index.html (26 oct 2026):
// - calc(): precio = (insumos×mult + 180×mult + extras) × (1 + margen). Margen por defecto 40 %.
// - Mediano: multiplicador 1.00 y 20 porciones. Extras de arranque: Flores $120 (activo) y Topper $80.
// - Receta sin ingredientes capturados: la app usa $210 de insumos en Mediano.
//   => $210 + $180 + $120 = $510 de costo; margen $204; precio sugerido $714; $35.70 por porción.
// - Mano de obra: fija en el código ($180 en Mediano, escala con el tamaño). Se suma en cada cotización.
// - Mis precios: costo por gramo o pieza (Mantequilla $186 / 1000 g = $0.186/g).
// - Extras: se pueden añadir con nombre y precio ("+ Añadir" en el cotizador o "Añadir extra" en Mis
//   precios). La app dice: "Se suma al total cuando lo activas en una cotización". NO hay un campo propio
//   de gas, luz, caja ni base: se agregan como extras con el costo de cada quien.
// - Agente IA: pantalla "Tu asistente de cotización · beta". Manda el pedido a un servidor (Gemini). Cuando
//   tiene nombre del cliente y tamaño, la app muestra "Confirma el pedido" con "Precio estimado" calculado
//   con calc() y los datos del negocio; con "Confirmar y guardar" queda en la agenda. No contesta WhatsApp.
// - Inicio: "entregas para hoy", "Por cobrar" (total de pedidos no cobrados; no descuenta anticipos) y
//   "Semana". El anticipo queda en el pedido y en el PDF.
//
// Del dueño: plan "Plan de arranque en Instagram" y "Textos del perfil" (Google Drive, 26 oct 2026) y
// respuestas del 3 oct: sin link oficial (URL de prueba o lista de espera), sin analítica en la app
// (se mide por palabra clave), no se menciona precio ni "gratis", mercado México y Latinoamérica, sin
// testimonios todavía, look cacao. Cuenta: @heypastelia.
//
// Carruseles: tipo (portada | cuerpo | prueba | cta), kicker, titulo, destacado (en dorado), texto,
// loop (ciclo abierto al pie, en dorado), nota, extra (textos dentro de gráficos o burbujas), cta y visual.
// Videos: variantes A y B (gancho de 3 componentes + puente/on-ramp) y un cuerpo compartido.

const URL_APP = '[TU LINK]';
const HANDLE = '@heypastelia';
const SEMANA = { id: 'semana-2026-10-26', titulo: 'Semana 1 · del 26 de octubre al 1 de noviembre de 2026' };

const hashtags = '#reposteria #pasteleria #pastelesporencargo #reposteriacasera #emprendimiento';

const FONDO = 'Fondo cacao casi negro (#140D09 → #241811) con grano fino y un brillo cálido';
const EJEMPLO = 'Datos de ejemplo';

// Respuesta por DM a quien comenta la palabra clave. Va el link (app o lista de espera).
function dm(palabra, siguientePaso) {
  return `¡Hola! Gracias por comentar ${palabra}. Aquí está el link para probar Pastelia (beta): ${URL_APP}

${siguientePaso}

¿Me cuentas qué te pareció? Tu opinión me ayuda a mejorarla.`;
}
const dmListaEspera = 'Gracias por comentar. Pastelia todavía está en prueba con pocas reposteras. ¿Te anoto en la lista y te aviso por aquí en cuanto abra?';

const piezas = [
  // ─────────────────────────── 1 · REEL COTIZACIÓN (FIJADO 1) ───────────────────────────
  {
    id: 'r1', n: 1, tipo: 'video', carpeta: '01-Reel-Cotizacion', fijado: 1,
    estructura: 'Problem-Solution / Demo con grabación de pantalla', duracion: '≈ 31 s',
    titulo: '¿Todavía cobras tus pasteles a ojo?', subtitulo: 'Una cotización completa en Pastelia, hasta el precio sugerido',
    fecha: '2026-10-27', dia: 'Martes 27 de octubre', hora: '19:30',
    redes: ['Instagram (Reel, fijado 1)'], formato: 'Video 9:16 · 1080×1920 · ≈ 31 s',
    palabra: 'COTIZA', claves: ['a ojo', '20 porciones', '$714', '$35.70', 'Mano de obra'],
    variantes: {
      A: {
        etiqueta: 'Gancho A · principal', angulo: 'Hábito: cobrar a ojo (te nombra el problema)',
        escenas: [
          { t: [0, 3], nombre: 'Gancho A', tipoToma: 'real', ilustracion: 'libreta-precio',
            visual: 'Plano cenital: tu mano tacha un "$ ?" escrito en la libreta y, en el mismo segundo, deja encima el celular con Pastelia abierta en "Nueva cotización".',
            voz: 'Te enseño de dónde sale el precio de un pastel para 20.',
            texto: '¿Todavía cobras tus pasteles a ojo?' },
          { t: [3, 9], nombre: 'Puente A (on-ramp)', tipoToma: 'pantalla', captura: '03-cotizar-paso1-cliente.png',
            visual: 'Grabación de pantalla en modo oscuro: tocas "Cotizar" y llenas el paso 1 con 20 invitados y la fecha del evento.',
            voz: 'A ojo, casi siempre se queda algo fuera. Aquí empiezo por el pedido: veinte invitados.',
            texto: 'Sin adivinar · paso 1: el pedido' }
        ]
      },
      B: {
        etiqueta: 'Gancho B · Reel de prueba', angulo: 'La pregunta que buscan en Instagram (el resultado primero)',
        escenas: [
          { t: [0, 3], nombre: 'Gancho B', tipoToma: 'pantalla', captura: '07-resumen-en-vivo.png', tarjetaCompleta: true,
            visual: 'El resultado primero: el "Resumen en vivo" con $714 ya calculado y un zoom rápido a "$35.70 por porción".',
            voz: 'Este precio sale de cuatro números. Te los enseño.',
            texto: '¿Cuánto cobrar por un pastel de 20 porciones?' },
          { t: [3, 9], nombre: 'Puente B (on-ramp)', tipoToma: 'pantalla', captura: '03-cotizar-paso1-cliente.png',
            visual: 'Efecto "rebobinar" de CapCut hasta "Nueva cotización"; tocas "Cotizar" y escribes 20 invitados.',
            voz: 'Insumos, tu tiempo, la decoración y tu ganancia. Empiezo desde cero: veinte invitados.',
            texto: '4 números · ninguno a ojo' }
        ]
      }
    },
    cuerpo: [
      { t: [9, 15], nombre: 'Paso 2 · el pastel', tipoToma: 'pantalla', captura: '05-cotizar-paso2-extras.png',
        visual: 'Paso 2: eliges tu receta, tocas "Mediano · 20p" y activas "Flores" en Extras de diseño.',
        voz: 'Mi receta de chocolate, tamaño mediano de veinte porciones y flores.',
        texto: 'Receta · Mediano 20p · Flores' },
      { t: [15, 22], nombre: 'Paso 3 · el costeo', tipoToma: 'pantalla', captura: '06-cotizar-paso3-costeo.png',
        visual: 'Paso 3 "Costeo": aparecen las filas. Zoom lento a "Mano de obra $180".',
        voz: 'Pastelia suma mis insumos, mi mano de obra, las flores y mi ganancia del cuarenta por ciento.',
        texto: 'Insumos $210 · Mano de obra $180 · Flores $120 · Margen 40% $204' },
      { t: [22, 27], nombre: 'Resultado', tipoToma: 'pantalla', captura: '07-resumen-en-vivo.png', tarjetaCompleta: true,
        visual: '"Resumen en vivo": zoom al precio sugerido y al precio por porción.',
        voz: 'Precio sugerido: setecientos catorce pesos. Treinta y cinco setenta por porción.',
        texto: '$714 · $35.70 por porción · Datos de ejemplo' },
      { t: [27, 31], nombre: 'CTA', tipoToma: 'tarjeta',
        visual: 'Tarjeta final: fondo cacao con goteo de chocolate, logo de Pastelia y "Comenta COTIZA" con la palabra en dorado.',
        voz: 'Comenta COTIZA y te mando el link para probarla.',
        texto: 'Comenta COTIZA y te mando el link' }
    ],
    notas: [
      'Para que salga $714 igual que en el guion: receta sin ingredientes capturados (la app usa $210 de insumos), tamaño Mediano, extra Flores activo y margen 40 %. Con tu receta real el número cambia y está bien: el texto en pantalla dice "Datos de ejemplo".',
      'Graba la pantalla en modo oscuro (Mi negocio), con "No molestar" y el brillo al máximo. Usa datos de ejemplo, nunca clientas reales.',
      'Gancho A: la toma de la libreta dura 1–2 s y corta seco a la pantalla; el texto del gancho entra desde el primer cuadro.',
      'Ritmo: cortes cada 1–2 s al ritmo de la música. Zoom (110–120 %) a la fila que nombra la voz.',
      'Texto en pantalla dentro de la zona segura de 720×1200 (centro del cuadro): crema #FFF4E6 sobre barra cacao al 70 %, palabras clave en dorado #E7B676.',
      'Subtítulos: máximo 2 líneas de 3–5 palabras, dentro de la zona segura (abajo del centro, nunca en los 500 px de abajo).',
      'Audio: si usas una canción en tendencia, ponla desde Instagram al publicar (no la pegues en CapCut).',
      'Tarjeta final: usa la imagen del kit (1080×1920), 3–4 s.'
    ],
    antes: [
      'Graba la pantalla de la cotización completa y la toma de la libreta: mándamelas y edito el Reel en MP4 con subtítulos y tarjeta final.',
      'Publica la versión A en tu perfil y fíjala. La B súbela como "Reel de prueba" (te explico en el playbook).',
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`
    ],
    captions: {
      instagram: () => `¿Cuánto cobrar por un pastel de 20 porciones? Así lo saco con números, no a ojo 👇

Cómo costear un pastel en Pastelia, paso a paso:
1. El pedido: 20 invitados y la fecha.
2. El pastel: tu receta, tamaño Mediano (20 porciones) y la decoración.
3. El costeo: insumos $210 + mano de obra $180 + flores $120 + margen 40 % ($204).
= Precio sugerido $714, o $35.70 por porción.

(Datos de ejemplo de la app, en pesos mexicanos. Con tu receta y tus precios, tu número cambia.)

A ojo casi siempre se queda algo fuera: tu tiempo, la decoración o tu ganancia.

Comenta COTIZA y te mando el link para probarla.

${hashtags}`
    },
    dm: dm('COTIZA', 'Crea tu cuenta con tu correo o con Google, llena "Mi negocio" y guarda tu receta más pedida. Con eso ya puedes cotizar tu primer pastel.')
  },

  // ─────────────────────────── 2 · CARRUSEL CÁLCULO 20 PORCIONES (FIJADO 2) ───────────────────────────
  {
    id: 'c1', n: 2, tipo: 'carrusel', carpeta: '02-Carrusel-Calculo-20p', fijado: 2,
    estructura: 'Demo Walkthrough / Problem-Proof', etiqueta: 'Carrusel',
    titulo: 'Así se calcula un pastel de 20 porciones',
    fecha: '2026-10-28', dia: 'Miércoles 28 de octubre', hora: '12:30',
    redes: ['Instagram (carrusel, fijado 2)'], formato: '8 slides · 1080×1350 (4:5)',
    palabra: 'COSTEO',
    slides: [
      { tipo: 'portada', titulo: 'Así se calcula un pastel de 20 porciones', destacado: ['20 porciones'], extra: ['$714'], nota: EJEMPLO,
        visual: `${FONDO}. Goteo de chocolate arriba. Titular crema grande con "20 porciones" en dorado. Abajo, "$714" gigante en oro con la etiqueta "Datos de ejemplo" y el teléfono con el paso Costeo real entrando por la derecha (cruza al slide 2).` },
      { titulo: 'A ojo, algo se queda fuera.', texto: 'Copias el precio de enfrente o redondeas. Tu tiempo y tu ganancia no entran.',
        loop: 'Se calcula en partes…',
        visual: `${FONDO}. Libreta crema con precios tachados en rojo cacao y un "$ ?" (ilustración vectorial, sin pasteles). Ciclo abierto en dorado al pie.` },
      { titulo: 'El precio tiene 4 partes:', extra: ['Insumos', 'Mano de obra', 'Extras', 'Margen'],
        loop: 'Empecemos por la receta…',
        visual: `${FONDO}. Cuatro tarjetas apiladas como ticket, numeradas 1–4 en círculos dorados, con los íconos de la app (frasco, batidor, moño y moneda) y el monto oculto ("$ —"), para que el lector deslice.` },
      { kicker: '1', titulo: 'Insumos: $210', destacado: ['$210'], texto: 'Lo que usas de tu receta, con tus precios por gramo, escalado al tamaño.', nota: EJEMPLO,
        loop: 'Lo que casi nadie cobra…',
        visual: `${FONDO}. Número "1" dorado grande. Teléfono con "Mis precios" real (costo por gramo) y, encima, el recorte real de la fila "Insumos $210" del costeo con aro dorado.` },
      { kicker: '2', titulo: 'Mano de obra: $180', destacado: ['$180'], texto: 'Tu tiempo de batir, hornear y decorar. Pastelia lo suma siempre.', nota: EJEMPLO,
        loop: 'Luego, lo que lo hace bonito…',
        visual: `${FONDO}. Número "2" dorado. Recorte real de las filas del costeo con aro dorado en "Mano de obra $180"; el teléfono con el paso Costeo detrás.` },
      { kicker: '3', titulo: 'Extras: $120', destacado: ['$120'], texto: 'Las flores de este ejemplo. Topper, piso extra o lo que tú agregues.', nota: EJEMPLO,
        loop: 'Y falta lo más importante…',
        visual: `${FONDO}. Número "3" dorado. Recorte real de "Extras de diseño" (Flores $120, Topper $80, Añadir extra) y la fila "Extras (flores) $120" con aro dorado.` },
      { kicker: '4', titulo: 'Margen 40%: $204', destacado: ['$204'], texto: 'Tu ganancia sobre los $510 de costo. Tú eliges el porcentaje.', nota: EJEMPLO,
        loop: 'Ahora, súmalo todo…',
        visual: `${FONDO}. Número "4" dorado. Recorte real de "Margen de ganancia · 40 %" y de la fila "Margen 40% $204" con aro dorado.` },
      { tipo: 'cta', titulo: '$714, o $35.70 por porción.', destacado: ['$714,'], nota: EJEMPLO, cta: 'Comenta COSTEO y te mando el link',
        visual: `${FONDO}. Goteo arriba. El "Resumen en vivo" real ampliado ($714 · $35.70 por porción) con borde dorado; titular crema con "$714," en dorado, etiqueta "Datos de ejemplo" y el botón cacao con borde dorado: COSTEO en dorado.` }
    ],
    notas: [
      'Todos los números salen de la función calc() de index.html con los valores de arranque de la app. Están marcados como "Datos de ejemplo".',
      'Las pantallas son capturas reales de Pastelia en modo oscuro (modo local, datos de ejemplo). No hay fotos ni ilustraciones de pasteles.',
      'El carrusel es continuo: el teléfono de la portada cruza al slide 2. Publica los slides en orden.',
      'Texto alternativo: Instagram → Configuración avanzada → Escribir texto alternativo. Va listo abajo, uno por slide.'
    ],
    antes: [
      'Revisa que el titular de la portada no se corte en la vista de cuadrícula (4:5).',
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`,
      'Después de publicarlo, fíjalo en tu perfil.'
    ],
    captions: {
      instagram: () => `Cómo costear un pastel de 20 porciones (y no cobrarlo a ojo) 👇

El precio de un pastel tiene 4 partes:
1. Insumos: $210. Sale de tu receta y de lo que pagas por cada insumo.
2. Mano de obra: $180. Es tu tiempo.
3. Extras: $120. Las flores de este ejemplo.
4. Margen 40 %: $204. Tu ganancia sobre $510 de costo.
Total: $714, o $35.70 por porción.

Datos de ejemplo de Pastelia, en pesos mexicanos. Con tus precios, tu número cambia: por eso conviene sacarlo con tus costos y no copiar el de enfrente.

Guárdalo para tu próxima cotización.

Comenta COSTEO y te mando el link.

${hashtags}`
    },
    dm: dm('COSTEO', 'Crea tu cuenta con tu correo o con Google y empieza por "Mis precios": pon lo que pagas por tu mantequilla, harina, huevo y chocolate. La app saca el costo por gramo.')
  },

  // ─────────────────────────── 3 · CARRUSEL FUNDADOR (FIJADO 3) ───────────────────────────
  {
    id: 'p1', n: 3, tipo: 'carrusel', carpeta: '03-Post-Historia-Beta', fijado: 3,
    estructura: "Founder Hero's Journey", etiqueta: 'Historia',
    titulo: 'No sabía cuánto cobrar, así que hice mi propia app',
    fecha: '2026-10-29', dia: 'Jueves 29 de octubre', hora: '19:30',
    redes: ['Instagram (carrusel, fijado 3)', 'Opcional: Reel con voz en off'], formato: '8 slides · 1080×1350 (4:5) + guion de voz en off',
    palabra: 'PASTELIA', fotoPortada: 'fundador',
    slides: [
      { tipo: 'portada', kicker: 'La historia de Pastelia', titulo: 'No sabía cuánto cobrar, así que hice mi propia app', destacado: ['mi propia app'],
        visual: `${FONDO}. Portada tipográfica editorial: comillas doradas grandes, titular crema en cuatro líneas con "mi propia app" en dorado y el logo al pie. Versión alterna con un marco punteado dorado para TU foto real.` },
      { titulo: 'Cobraba a ojo.', texto: 'Le ponía el precio que me parecía justo, sin saber si de verdad ganaba.',
        loop: 'Y los pedidos…',
        visual: `${FONDO}. Titular crema grande. Libreta crema con precios tachados y un "$ ?" (ilustración vectorial). Ciclo abierto en dorado al pie.` },
      { titulo: '…vivían en una libreta y en WhatsApp.', destacado: ['WhatsApp.'], texto: 'Fechas, anticipos y cambios, regados entre chats.',
        loop: 'Hasta que me cayó el veinte:',
        visual: `${FONDO}. La libreta del slide 2 asoma por la izquierda; a la derecha, burbujas de chat genéricas sin texto (no imitan WhatsApp), una con borde dorado.` },
      { titulo: 'Cobrar bien no era subir precios. Era saber mis costos.', destacado: ['Era saber mis costos.'], texto: 'Cuánto me cuesta cada gramo, cuánto vale mi tiempo y cuánto quiero ganar.',
        loop: 'Así nació…',
        visual: `${FONDO}. Slide tipográfico: tres íconos de línea dorados (frasco, reloj y moneda) en fila, uno por cada pregunta.` },
      { titulo: '…el cotizador por gramo.', destacado: ['por gramo.'], texto: 'Pones lo que pagas por cada insumo y sale el costo por gramo.', nota: EJEMPLO,
        loop: 'Y para los pedidos regados…',
        visual: `${FONDO}. Teléfono con "Mis precios" real y, flotando, el recorte de "Mantequilla $186 / 1000 g" con aro dorado en "$0.186/g".` },
      { titulo: '…la agenda.', destacado: ['la agenda.'], texto: 'Lo que entregas hoy y lo que tienes por cobrar, al abrir la app.', nota: EJEMPLO,
        loop: 'Y ahora, la parte que falta:',
        visual: `${FONDO}. Teléfono con el Inicio real y tarjetas flotantes ampliadas: "2 entregas para hoy" y "Por cobrar", con borde dorado.` },
      { titulo: 'Está en beta y la quiero hacer contigo.', destacado: ['contigo.'], texto: 'Pruébala con tus pedidos reales y dime qué le falta.', extra: ['beta'],
        loop: '¿Te animas?',
        visual: `${FONDO}. Ícono de Pastelia al centro con halo dorado y una etiqueta "beta" en dorado.` },
      { tipo: 'cta', titulo: 'Ayúdame a hacerla mejor.', destacado: ['mejor.'], cta: 'Comenta PASTELIA y te mando el link',
        visual: `${FONDO}. Goteo de chocolate arriba, logo, titular crema con "mejor." en dorado y el botón cacao con borde dorado: PASTELIA en dorado.` }
    ],
    voz: {
      duracion: '≈ 41 s',
      nota: 'Versión Reel opcional: los 8 slides en un video 9:16 (cada slide sobre fondo cacao, 4–6 s) con tu voz en off. Graba tu voz con el celular cerca, en un cuarto sin eco; o usa la voz de texto a voz de CapCut.',
      escenas: [
        { t: [0, 4], slide: 1, voz: 'No sabía cuánto cobrar por mis pasteles… así que hice mi propia app.' },
        { t: [4, 9], slide: 2, voz: 'Cobraba a ojo: le ponía el precio que me parecía justo, sin saber si de verdad ganaba.' },
        { t: [9, 14], slide: 3, voz: 'Y los pedidos vivían en una libreta y en WhatsApp: fechas, anticipos y cambios, regados entre chats.' },
        { t: [14, 20], slide: 4, voz: 'Hasta que me cayó el veinte: cobrar bien no era subir precios. Era saber mis costos.' },
        { t: [20, 26], slide: 5, voz: 'Así nació el cotizador por gramo: pones lo que pagas por cada insumo y sale el costo por gramo.' },
        { t: [26, 31], slide: 6, voz: 'Y la agenda: lo que entregas hoy y lo que tienes por cobrar, en cuanto abres la app.' },
        { t: [31, 37], slide: 7, voz: 'Pastelia está en beta, y la quiero hacer contigo. Pruébala con tus pedidos reales y dime qué le falta.' },
        { t: [37, 41], slide: 8, voz: 'Comenta PASTELIA y te mando el link.' }
      ]
    },
    notas: [
      'Es tu historia: escribí solo lo que me diste (cobrar a ojo, pedidos en libreta y WhatsApp, por qué nacieron el cotizador por gramo y la agenda, invitación a la beta). No agregué fechas, cifras ni anécdotas.',
      'La primera persona no lleva adjetivos con género ("cansada/cansado"), así que sirve tal cual.',
      'Portada en dos versiones: solo texto (lista para publicar) y con marco para tu foto real. Si me mandas una foto tuya (o la subes a "3. Mi material"), la pongo en el marco.',
      'Las pantallas son capturas reales de la app en modo oscuro, con datos de ejemplo.'
    ],
    antes: [
      'Lee los slides 1 a 7 y confirma que cada frase es cierta para ti. Si algo no pasó así, dímelo y lo cambio: no publiques una historia que no pasó.',
      'Si quieres la portada con tu foto, mándamela (vertical, con luz natural, sin filtros).',
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`,
      'Después de publicarlo, fíjalo en tu perfil.'
    ],
    captions: {
      instagram: () => `No sabía cuánto cobrar por un pastel, así que hice mi propia app.

Cobraba a ojo. Y los pedidos vivían en una libreta y en WhatsApp: fechas, anticipos y cambios, regados entre chats.

Hasta que me cayó el veinte: cobrar bien no era subir precios, era saber mis costos. Cuánto me cuesta cada gramo, cuánto vale mi tiempo y cuánto quiero ganar.

Así nació Pastelia: un cotizador por gramo con tus propios precios y una agenda con lo que entregas hoy y lo que tienes por cobrar.

Está en beta y la quiero hacer contigo. Pruébala con tus pedidos reales y dime qué le falta.

Comenta PASTELIA y te mando el link.

${hashtags}`
    },
    dm: dm('PASTELIA', 'Gracias por leer la historia. Crea tu cuenta con tu correo o con Google, llena "Mi negocio" y haz tu primera cotización con un pedido real.')
  },

  // ─────────────────────────── 4 · REEL AGENTE IA (BETA) ───────────────────────────
  {
    id: 'r2', n: 4, tipo: 'video', carpeta: '04-Reel-Agente-IA',
    estructura: 'Demo con grabación de pantalla (función beta)', duracion: '≈ 32 s',
    titulo: 'Le pedí a una IA que cotizara mi pedido', subtitulo: 'El Agente IA de Pastelia, en beta',
    fecha: '2026-10-30', dia: 'Viernes 30 de octubre', hora: '19:30',
    redes: ['Instagram (Reel)'], formato: 'Video 9:16 · 1080×1920 · ≈ 32 s',
    palabra: 'AGENTE', claves: ['IA', 'beta', 'TUS', 'tus costos', 'agenda'],
    variantes: {
      A: {
        etiqueta: 'Gancho A · principal', angulo: 'Experimento: ¿la IA cotiza con mis costos?',
        escenas: [
          { t: [0, 3], nombre: 'Gancho A', tipoToma: 'pantalla', captura: '15-agente-ia-pedido-escrito.png',
            visual: 'Grabación de pantalla: en el chat del Agente IA escribes "Pastel para 20 personas"; arriba se lee "Tu asistente de cotización · beta".',
            voz: 'Le escribí solo esto: pastel para veinte personas.',
            texto: 'Le pedí a una IA que cotizara mi pedido' },
          { t: [3, 9], nombre: 'Puente A (on-ramp)', tipoToma: 'grabar',
            visual: 'Envías el mensaje y se ve la respuesta REAL del agente (lo que conteste en ese momento).',
            voz: 'No usa precios de internet: usa mis insumos, mis tamaños y mi margen.',
            texto: 'Con TUS costos · no precios de internet' }
        ]
      },
      B: {
        etiqueta: 'Gancho B · Reel de prueba', angulo: 'POV: te piden precio de noche (situación del oficio)',
        escenas: [
          { t: [0, 3], nombre: 'Gancho B', tipoToma: 'real', ilustracion: 'noche-mensaje',
            visual: 'Toma real de noche: cocina en penumbra con una sola luz cálida; tu celular se enciende con un mensaje (texto borroso, sin nombres).',
            voz: 'En vez de sacar la calculadora…',
            texto: 'POV: te piden precio a las 11 p. m.' },
          { t: [3, 9], nombre: 'Puente B (on-ramp)', tipoToma: 'pantalla', captura: '15-agente-ia-pedido-escrito.png',
            visual: 'Abres Pastelia → "Agente IA" y escribes "Pastel para 20 personas", tal cual te llegó el mensaje.',
            voz: '…se lo escribo al Agente IA de Pastelia, tal cual me llegó.',
            texto: 'Agente IA · beta' }
        ]
      }
    },
    cuerpo: [
      { t: [9, 15], nombre: 'Los datos que falten', tipoToma: 'grabar',
        visual: 'La conversación real sigue: le das el nombre del cliente y la fecha (si no los pusiste en el primer mensaje).',
        voz: 'Le doy el nombre del cliente y la fecha.',
        texto: 'Le das los datos que falten' },
      { t: [15, 22], nombre: 'Confirma el pedido', tipoToma: 'grabar',
        visual: 'Aparece la tarjeta "Confirma el pedido": cliente, pastel, tamaño, extras, fecha y "Precio estimado". Zoom al precio.',
        voz: 'Y me arma la cotización con el precio estimado, con mis costos.',
        texto: 'Precio estimado con tus costos' },
      { t: [22, 26], nombre: 'Queda en la agenda', tipoToma: 'pantalla', captura: '02-agenda.png',
        visual: 'Tocas "Confirmar y guardar" → "¡Listo! El pedido ya está en tu agenda". Corte a la Agenda con el pedido nuevo (graba la tuya).',
        voz: 'Yo reviso, confirmo… y queda en mi agenda.',
        texto: 'Tú confirmas · queda en tu agenda' },
      { t: [26, 29], nombre: 'Es beta', tipoToma: 'pantalla', captura: '14-agente-ia.png',
        visual: 'Zoom al encabezado "Agente IA · Tu asistente de cotización · beta".',
        voz: 'Ojo: está en beta. Revisa siempre el precio antes de confirmar.',
        texto: 'Es beta: revisa el precio antes de guardar' },
      { t: [29, 32], nombre: 'CTA', tipoToma: 'tarjeta',
        visual: 'Tarjeta final: fondo cacao con goteo de chocolate, logo de Pastelia y "Comenta AGENTE" con la palabra en dorado.',
        voz: 'Comenta AGENTE y te mando el link.',
        texto: 'Comenta AGENTE y te mando el link' }
    ],
    notas: [
      'La conversación se graba REAL, en tu celular: no la actuamos ni la armamos en edición. Si el agente contesta algo raro, vuelve a intentarlo o no publiques esa toma.',
      'Las escenas marcadas "Graba aquí tu pantalla" no tienen captura porque en mi entorno de trabajo el servidor del agente no está disponible. Las demás son capturas reales de la app.',
      'Escribe el pedido como te llega por WhatsApp. Si en el primer mensaje pones nombre y fecha ("Pastel de chocolate para 20 personas, a nombre de Cliente de ejemplo, para el 7 de noviembre"), el agente puede ir directo a "Confirma el pedido".',
      'Usa un nombre de prueba ("Cliente de ejemplo"), nunca el de una clienta real, y borra ese pedido de tu agenda después de grabar.',
      'La leyenda "beta" debe verse al menos una vez (escena "Es beta").',
      'Gancho B: la toma de noche es una dramatización (POV), no un mensaje real de una clienta. Nombres y texto del mensaje, borrosos.',
      'Texto en pantalla y subtítulos dentro de la zona segura de 720×1200; crema sobre barra cacao al 70 % y palabras clave en dorado.'
    ],
    antes: [
      'Prueba el Agente IA en tu cuenta antes de grabar y confirma que responde (desde mi entorno no pude conectarme a su servidor).',
      'Costo: el agente usa Gemini Pro con "pensamiento alto" y hoy no tiene límite por usuaria (agent-proxy/README.md). Antes de invitar a muchas personas a probarlo, revisa ese costo o cámbialo a Flash.',
      'Mándame la grabación de la conversación completa y edito el Reel en MP4 con subtítulos y tarjeta final.',
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`
    ],
    captions: {
      instagram: () => `Le pedí a una IA que cotizara mi pedido: "pastel para 20 personas".

¿No sabes cuánto cobrar por un pastel para 20 personas a las 11 de la noche? El Agente IA de Pastelia (en beta) arma la cotización con tus insumos, tus tamaños y tu margen. Te muestra el precio estimado y tú decides si lo guardas en tu agenda.

Es beta: revisa siempre el precio antes de confirmar. Y si prefieres hacerlo tú, el cotizador paso a paso te enseña cómo costear un pastel.

Comenta AGENTE y te mando el link para probarlo.

${hashtags}`
    },
    dm: dm('AGENTE', 'Crea tu cuenta con tu correo o con Google, guarda una receta y abre "Agente IA" (abajo a la derecha). Escríbele un pedido como te llega por WhatsApp. Está en beta: revisa el precio antes de confirmar.')
  },

  // ─────────────────────────── 5 · CARRUSEL COSTOS OLVIDADOS ───────────────────────────
  {
    id: 'c2', n: 5, tipo: 'carrusel', carpeta: '05-Carrusel-Costos-Olvidados',
    estructura: 'Hack List / Problem-Proof', etiqueta: 'Carrusel',
    titulo: 'Por esto no te queda nada',
    fecha: '2026-10-31', dia: 'Sábado 31 de octubre', hora: '09:30',
    redes: ['Instagram (carrusel)'], formato: '9 slides · 1080×1350 (4:5)',
    palabra: 'TIEMPO',
    slides: [
      { tipo: 'portada', titulo: 'Por esto no te queda nada', destacado: ['nada'], extra: ['Te queda', '$0'],
        alt: 'Por esto no te queda nada. Abajo, un ticket con renglones borrosos que termina en «Te queda: $0».',
        visual: `${FONDO}. Goteo arriba. Titular crema enorme con "nada" en dorado. Abajo, un ticket crema con renglones borrosos y la última línea "Te queda: $0" en dorado.` },
      { titulo: '"Me quedan $300."', destacado: ['$300.'], texto: 'Cobraste $510 y gastaste $210 en insumos. Pero faltan 4 costos.', extra: ['$510 − $210 = $300'], nota: EJEMPLO,
        loop: 'El primero eres tú…',
        visual: `${FONDO}. Ecuación grande "$510 − $210 = $300" con el $300 en oro y, debajo, el medidor dorado "Te queda" lleno hasta $300.` },
      { kicker: '1', titulo: 'Tu tiempo: −$180', destacado: ['−$180'], texto: 'Batir, hornear, decorar y entregar también es trabajo.', extra: ['Quedan $120'],
        loop: 'El segundo se ve bonito…',
        visual: `${FONDO}. Número "1" dorado. Medidor "Te queda" que baja de $300 a $120: el tramo de $180 se va en cacao rayado.` },
      { kicker: '2', titulo: 'Decoración: −$120', destacado: ['−$120'], texto: 'Flores, topper o letrero: si no lo cobras aparte, sale de tu ganancia.', extra: ['Quedan $0'],
        loop: 'Y todavía falta…',
        visual: `${FONDO}. Número "2" dorado. El medidor llega a $0.` },
      { kicker: '3', titulo: 'Caja y base: −$ ?', destacado: ['−$ ?'], texto: '¿Cuánto te cuestan? Si no lo sabes, lo estás regalando.', extra: ['Quedan menos de $0'],
        loop: 'Y lo que nadie ve…',
        visual: `${FONDO}. Número "3" dorado. Ilustración de línea dorada de una caja abierta y una base redonda (sin pastel). El medidor cruza abajo de $0.` },
      { kicker: '4', titulo: 'Gas y luz: −$ ?', destacado: ['−$ ?'], texto: 'Horno, batidora y refri trabajan para cada pastel, aunque se paguen en otro recibo.', extra: ['Quedan menos de $0'],
        loop: '¿Cuánto ganaste, entonces?',
        visual: `${FONDO}. Número "4" dorado. Íconos de línea dorados de flama y foco. El medidor sigue bajando.` },
      { tipo: 'prueba', titulo: 'Ganancia real: menos de $0.', destacado: ['menos de $0.'], nota: EJEMPLO,
        extra: ['Cobraste $510', 'Insumos −$210', 'Tiempo −$180', 'Decoración −$120', 'Caja y base −$ ?', 'Gas y luz −$ ?'],
        loop: 'Así se arregla…',
        visual: `${FONDO}. Gráfica de cascada nativa (SVG): barra de $510 en crema y escalones que bajan en tono cacao hasta $0; caja/base y gas/luz punteados, abajo de cero. Solo el resultado va en dorado.` },
      { titulo: 'En Pastelia, cada costo suma.', destacado: ['cada costo suma.'], texto: 'Tu tiempo ya viene incluido. Caja, base, gas y luz los agregas como extras.',
        loop: '¿Y en tu próximo pedido?',
        visual: `${FONDO}. Captura real de la ventana "Nuevo extra" ("Se suma al total cuando lo activas en una cotización", con "Caja y base" escrito) sobre el recorte real de "Extras de diseño".` },
      { tipo: 'cta', titulo: 'Tu tiempo también se cobra.', destacado: ['se cobra.'], cta: 'Comenta TIEMPO y te mando el link',
        visual: `${FONDO}. Goteo arriba, logo, titular crema con "se cobra." en dorado y el botón cacao con borde dorado: TIEMPO en dorado.` }
    ],
    notas: [
      '$510, $210, $180 y $120 son los valores de arranque de la app (insumos, mano de obra y flores de un Mediano). "Cobraste $510" es un ejemplo: es justo el costo de ese pastel sin ganancia.',
      'Caja, base, gas y luz quedan como "$ ?" porque la app no trae esos montos y no los invento. Si me das tus costos reales, regenero el carrusel con tus números.',
      'Pastelia no tiene un campo propio para gas, luz, caja ni base: se dan de alta como extras (nombre y precio) y se activan en cada cotización. El slide 8 lo dice así y muestra la pantalla real.',
      'Gráficas nativas: solo el resultado va en dorado; lo demás en tonos cacao, con etiquetas directas.',
      'Sin fotos ni ilustraciones de pasteles: caja y base van en dibujo de línea.'
    ],
    antes: [
      'Opcional: dime cuánto te cuestan la caja, la base y el gas/luz por pastel y cambio los "$ ?" por tus números.',
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`
    ],
    captions: {
      instagram: () => `Por esto no te queda nada: 4 costos que casi nadie cobra en sus pasteles 👇

Ejemplo: cobras $510 por un pastel de 20 porciones y gastaste $210 en insumos. "Me quedan $300", piensas.
– Tu tiempo (mano de obra): $180. Quedan $120.
– Decoración (flores): $120. Quedan $0.
– Caja y base: $ ?
– Gas y luz: $ ?
Resultado: menos de $0. Y tu tiempo, pagado a medias.

Cómo costear un pastel sin que se te escape nada: en Pastelia tu mano de obra ya viene incluida, y la decoración, la caja, la base, el gas y la luz los das de alta como extras con tu costo. Así entran en el precio y tu ganancia va encima.

(Valores de ejemplo de la app, en pesos mexicanos.)

Comenta TIEMPO y te mando el link.

${hashtags}`
    },
    dm: dm('TIEMPO', 'Crea tu cuenta con tu correo o con Google. En "Mis precios" → "Añadir extra" da de alta tu caja y base y tu gas y luz con lo que te cuestan por pastel; actívalos en cada cotización y se suman al precio.')
  },

  // ─────────────────────────── 6 · MEME ───────────────────────────
  {
    id: 'm1', n: 6, tipo: 'meme', carpeta: '06-Meme-Mama',
    estructura: 'Meme de oficio (contraste: regateo vs. desglose real)', etiqueta: 'Meme',
    titulo: '¿Me lo dejas más barato? Es para mi mamá',
    fecha: '2026-11-01', dia: 'Domingo 1 de noviembre', hora: '19:30',
    redes: ['Instagram (post de una imagen)'], formato: '1 imagen · 1080×1350 (4:5)',
    palabra: 'RESPETO',
    slides: [
      { tipo: 'meme', titulo: '¿Me lo dejas más barato? Es para mi mamá', extra: ['Cliente', 'Mi cotización', HANDLE],
        texto: 'Con todo respeto: la mantequilla no sabe que es para tu mamá.', destacadoTexto: ['la mantequilla'], nota: EJEMPLO,
        alt: `Meme. Arriba, la burbuja de chat de «Cliente»: «¿Me lo dejas más barato? Es para mi mamá». En medio, «Mi cotización»: el resumen real de Pastelia con insumos $210, mano de obra $180 (resaltada), extras (flores) $120 y margen 40 % $204, que dan un precio sugerido de $714, o $35.70 por porción (datos de ejemplo). Abajo: «Con todo respeto: la mantequilla no sabe que es para tu mamá». Firma ${HANDLE}.`,
        visual: `${FONDO}. Arriba, "Cliente" y una burbuja de chat crema genérica (no imita WhatsApp) con el regateo. En medio, "Mi cotización" y el "Resumen en vivo" real de Pastelia ($714) con aro dorado en "Mano de obra $180". Abajo, el remate en crema con "la mantequilla" en dorado y ${HANDLE} con el logo.` }
    ],
    notas: [
      'Es una situación común del oficio, no el chat de una clienta real.',
      'El desglose es la captura real de la app con datos de ejemplo ($714).',
      'Formato de una sola imagen: el CTA va en el caption, no en la imagen. El logo y @heypastelia van chiquitos para que, si lo comparten, se sepa de dónde salió.'
    ],
    antes: [
      `Pega tu link en la respuesta por DM (${URL_APP}) o usa la respuesta de lista de espera.`,
      'Responde los comentarios con humor y sin pelear con nadie: el chiste es sobre el regateo, no sobre las mamás.'
    ],
    captions: {
      instagram: () => `"¿Me lo dejas más barato? Es para mi mamá."
Con todo respeto: la mantequilla no sabe que es para tu mamá.

Si alguna vez te lo pidieron, sabes cómo se siente. Cobrar bien no es ser cara: es saber cuánto cuesta lo que haces. Si no sabes cuánto cobrar por un pastel, empieza por tus costos: insumos, tu tiempo, la decoración y tu ganancia.

Etiqueta a la repostera que necesita ver esto.

¿Te ha pasado? Comenta RESPETO y te mando el link para cotizar con tus números.

${hashtags}`
    },
    dm: dm('RESPETO', 'Crea tu cuenta con tu correo o con Google y haz la cotización de tu pastel más pedido. Así, cuando te pidan descuento, sabes exactamente hasta dónde puedes bajar.')
  }
];

// ─────────────────────────── Perfil de Instagram ───────────────────────────
const perfil = {
  pasos: [
    'Cambia la cuenta a profesional: Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional → Empresa.',
    'Foto de perfil: "Foto de perfil Pastelia.png" (carpeta "1. Perfil de Instagram" de tu Drive).',
    'Nombre, presentación y enlace: cópialos de aquí abajo (Editar perfil).',
    'Historias destacadas: cuando publiques cada pieza, compártela en tu historia y agrégala a su destacada con la portada del kit.',
    'Fija r1, c1 y p1 (menú de los tres puntos → Fijar en tu perfil). La última que fijes suele quedar primero: fija p1, luego c1 y al final r1. Si el orden no queda, desfija y vuelve a fijar.'
  ],
  nombre: {
    recomendado: 'Pastelia | Costeo de pasteles',
    porque: 'El nombre es lo que Instagram usa para buscar. "Costeo de pasteles" es justo el tema de tus primeros posts y lo que una repostera escribe cuando no sabe cuánto cobrar.',
    alternativas: [
      { texto: 'Pastelia | Cotiza tus pasteles', porque: 'El que ya tienes en el documento del perfil: habla de la acción.' },
      { texto: 'Pastelia | App para reposteras', porque: 'Dice para quién es; sirve si te buscan como "app".' }
    ]
  },
  bio: ['Para reposteras: cuánto cobrar por cada pastel con tus costos reales.', 'Cotiza y lleva tus pedidos y anticipos en un solo lugar.', 'Únete a la beta ↓'],
  bioPorque: 'Línea 1: para quién es y la frase que buscan ("cuánto cobrar por cada pastel"). Línea 2: lo que hace la app hoy. Línea 3: la acción, que apunta al enlace.',
  enlace: {
    titulo: 'Prueba Pastelia (beta)',
    tituloListaEspera: 'Lista de espera de Pastelia',
    url: URL_APP,
    nota: 'Si cualquiera ya puede crear cuenta: link directo a la app con el título "Prueba Pastelia (beta)". Si todavía no: un Google Form de lista de espera (nombre, WhatsApp o correo, ciudad y cuántos pasteles vende al mes) con el título "Lista de espera de Pastelia".'
  },
  destacadas: [
    { id: 'cotiza', nombre: 'Cotiza', icono: 'receipt', contenido: 'El Reel de la cotización (r1) y el carrusel de las 4 partes del precio (c1).' },
    { id: 'costeo', nombre: 'Costeo', icono: 'coin', contenido: 'Costos olvidados (c2) y tips de costeo por gramo.' },
    { id: 'agente', nombre: 'Agente IA', icono: 'sparkle', contenido: 'El Reel del agente (r2) y avances de la beta.' },
    { id: 'agenda', nombre: 'Agenda', icono: 'calendar', contenido: 'Entregas de hoy, por cobrar y anticipos (más adelante).' },
    { id: 'beta', nombre: 'Beta', icono: 'chat', contenido: 'La historia (p1), cómo unirte y lo que vas mejorando con las beta testers.' }
  ]
};

// ─────────────────────────── Playbook orgánico ───────────────────────────
const playbook = {
  rutina: {
    titulo: 'Rutina diaria de 15 minutos',
    pasos: [
      { min: '0–3', que: 'Busca 5 reels recientes de reposteras: en la lupa escribe "pasteles por encargo", "repostería casera" o "cuánto cobrar pastel", o entra a #pastelesporencargo y #reposteriacasera. Elige cuentas que sí contestan sus comentarios.' },
      { min: '3–12', que: 'Deja 5 comentarios útiles, uno por reel: algo concreto que viste + una pregunta de oficio o un tip de costeo. Sin links y sin "prueba mi app".' },
      { min: '12–15', que: 'Contesta todos los comentarios y mensajes de tus posts, y manda el DM con el link a quien comentó la palabra clave.' }
    ],
    formula: '[Algo concreto que viste en su video] + [una pregunta de oficio o un tip útil]',
    vacios: ['"Qué bonito 😍"', '"Wow, me encanta"', '"Hermoso trabajo 👏"', '"Sígueme y te sigo"', '"Pásate por mi perfil"'],
    utiles: [
      { tipo: 'Pregunta de técnica', texto: 'Ese filo del buttercream quedó muy parejo. ¿Lo enfrías entre capas o usas espátula caliente?' },
      { tipo: 'Pregunta de precio', texto: 'Para un pastel de este tamaño, ¿el topper lo cobras aparte o va incluido? Siempre es la duda.' },
      { tipo: 'Tip de costeo', texto: 'Un tip que ayuda: saca el costo por gramo de la mantequilla. Es de lo que más sube y casi nadie lo actualiza.' },
      { tipo: 'Pregunta de pedidos', texto: 'Qué buena idea mostrar la entrega. ¿Pides anticipo para apartar la fecha o cobras todo al final?' },
      { tipo: 'Reconocer el trabajo', texto: 'Se nota todo el tiempo de decoración. Ojalá tus clientas sepan que ese tiempo también se cobra.' }
    ],
    reglas: [
      'Nunca el mismo comentario dos veces: Instagram lo nota y la persona también.',
      'Habla como ella: si dice "torta", tú dices "torta".',
      'No menciones Pastelia en comentarios a cuentas que no conoces. Si te preguntan qué haces, ahí sí.',
      'Constancia sobre cantidad: 5 comentarios buenos todos los días valen más que 30 un solo día.'
    ]
  },
  dms: {
    titulo: '3 estructuras de mensaje directo para invitar a 20 reposteras',
    intro: 'Son estructuras, no plantillas: cambia cada hueco [entre corchetes] con algo real de su perfil. Manda 3 o 4 al día, una por una. Empieza la semana 2, cuando ya estén publicados los 6 posts.',
    estructuras: [
      { nombre: '1 · "Vi tu trabajo"', cuando: 'Primer contacto con alguien que no te conoce.',
        pasos: ['Saludo con su nombre', 'Algo concreto de un post reciente suyo', 'Una pregunta sobre cómo cotiza', 'Qué es Pastelia en una línea (y que está en beta)', 'Pregunta de permiso, sin presión'],
        ejemplo: 'Hola, [nombre]. Vi tu [pastel de dos pisos con flores] y me encantó [cómo combinaste los tonos]. Una pregunta: ¿cómo calculas el precio de uno así? Estoy haciendo Pastelia, una app para cotizar con tus costos reales, y está en beta. ¿Te late probarla con uno de tus pedidos y decirme qué le falta?' },
      { nombre: '2 · "Te ayudo primero"', cuando: 'Cuentas que comentan que no saben cuánto cobrar o que cobran poco.',
        pasos: ['Saludo y por qué le escribes', 'Ofreces algo útil y concreto', 'Cómo lo harían (su receta y sus precios)', 'Lo único que pides: su opinión', 'Salida fácil'],
        ejemplo: 'Hola, [nombre]. Vi que comentaste [que nunca sabes cuánto cobrar]. Si quieres, te ayudo a sacar el costo real de [tu pastel más pedido] con tu receta y tus precios, en Pastelia (está en beta). A cambio solo te pido tu opinión. Si no es buen momento, no pasa nada.' },
      { nombre: '3 · "Hagamos un reel"', cuando: 'Beta testers que ya probaron la app y les gustó.',
        pasos: ['Agradece algo concreto de su prueba', 'Propón el reel: cómo cotiza un pedido suyo', 'Explica "Invitar colaborador": sale en su perfil y en el tuyo', 'Qué le ofreces: acceso a la beta y ayuda con sus precios', 'Siguiente paso concreto (día y guion corto)'],
        ejemplo: 'Hola, [nombre]. Gracias por probar Pastelia y por [tu idea de agregar envíos]. ¿Te late hacer un reel en colaboración mostrando cómo cotizas [tu pastel de 20 porciones]? Con "Invitar colaborador" sale en tu perfil y en el mío. Yo te ayudo con tus precios y te mando un guion de 30 segundos. ¿Te queda [el jueves]?' }
    ],
    notas: [
      'El intercambio es acceso a la beta y ayuda con sus precios a cambio de un reel en colaboración. No ofrezcas meses gratis a futuro hasta decidir el precio de Pastelia.',
      'Lleva el registro en la plantilla de invitaciones (CSV) para no escribirle dos veces a la misma persona.',
      'Si no contesta en 5 días, un solo seguimiento corto. Si tampoco, la dejas en paz.'
    ]
  },
  ritmo: {
    titulo: 'Después de la semana 1: ritmo semanal',
    puntos: [
      '2 reels y 1 carrusel por semana. Ejemplo: reel el martes, carrusel el jueves y reel el sábado.',
      'Ganchos A/B: cada reel nuevo, prueba un segundo gancho como "Reel de prueba" (en la pantalla de compartir, si te aparece la opción). Ese reel lo ve primero gente que no te sigue; a las 24–72 h compara reproducciones, tiempo de visualización y guardados, y comparte en tu perfil el que gane.',
      'Stories 3 o 4 días por semana cuando ya tengas seguidores (antes nadie las ve): encuesta "¿Cuánto cobrarías por este pastel?" con foto de un pastel real tuyo o de una beta tester con su permiso, avances de la app e invitación a la beta.',
      'Cada viernes revisa la tabla de palabras clave: qué pieza trajo más comentarios, DM y cuentas creadas. Repite el tema que gane.',
      'Cuando una beta tester acepte, publica el reel en colaboración (opción "Invitar colaborador").'
    ]
  },
  ads: {
    titulo: 'Cuándo lanzar ads (semana 4 a 6)',
    intro: 'Todavía no. Revísalo en 4 a 6 semanas y solo cuando se cumplan las tres condiciones:',
    condiciones: [
      'Hay un link que funciona para registrarse o anotarse.',
      'Tienes 2 o 3 reels que rinden claramente más que el resto (guardados, compartidos, gente pidiendo el link). Ese reel es tu primer anuncio.',
      'En la beta, al menos 10 a 20 reposteras usan la app cada semana.'
    ],
    presupuesto: 'Primera prueba: $70 a $100 MXN al día durante 7 a 10 días (de $490 a $1,000 MXN en total), midiendo cuánto cuesta cada registro.'
  }
};

// Respuestas rápidas por DM a preguntas frecuentes (todas verificadas contra la app).
const respuestasDM = [
  { pregunta: '¿Cuánto cuesta?', respuesta: 'Ahorita está en beta y todavía no defino el precio. Cuando lo tenga, te aviso por aquí. Mientras, me ayudaría mucho tu opinión.', porConfirmar: true },
  { pregunta: '¿Funciona en mi celular?', respuesta: 'Sí. Se abre en el navegador del celular y la puedes instalar como app en tu pantalla de inicio. También funciona en computadora.' },
  { pregunta: '¿Y si pierdo mis datos?', respuesta: 'En la app tienes "Copia de seguridad": exportas tus datos a un archivo y los restauras cuando quieras. Te recomiendo hacer una copia cada semana.', porConfirmar: true },
  { pregunta: '¿Contesta sola mis mensajes de WhatsApp?', respuesta: 'No. El Agente IA (beta) te ayuda a cotizar dentro de la app; tus chats los sigues contestando tú. Lo que sí hace la app es abrir WhatsApp con el ticket listo para tu cliente.' },
  { pregunta: '¿Tengo que capturar todos mis ingredientes?', respuesta: 'Con tus insumos principales basta para empezar (mantequilla, harina, huevo, chocolate…). Pones lo que pagas y la app saca el costo por gramo o pieza.' }
];

const calendarioExtra = [
  { fecha: '2026-10-26', dia: 'Lunes 26 de octubre', hora: '—', pieza: 'Perfil listo (nombre, bio, foto, enlace) y grabar las pantallas de los 2 reels', red: 'Instagram', palabra: '—' },
  { fecha: '2026-11-02', dia: 'Lunes 2 de noviembre', hora: '—', pieza: 'Empiezan los DM 1 a 1 (3 o 4 al día) y sigue la rutina de 15 minutos', red: 'Instagram (DM)', palabra: '—' }
];

const porConfirmar = [
  { campo: 'Link de la app', estado: 'Por confirmar: ¿cualquiera ya puede crear cuenta (link directo) o usas lista de espera (Google Form)? Los DM llevan [TU LINK]; pégalo antes de responder.' },
  { campo: 'Tu historia (p1)', estado: 'Por confirmar: lee los slides y confirma que cada frase es cierta para ti. No agregué fechas, cifras ni anécdotas.' },
  { campo: 'Agente IA (r2)', estado: 'Por confirmar: que responde en tu cuenta antes de grabar, y el costo de Gemini Pro sin límite por usuaria antes de invitar a mucha gente a usarlo.' },
  { campo: 'Dónde se guardan los datos', estado: 'Por confirmar: tu contexto de marketing dice "en tu dispositivo, no en la nube", pero index.html ya guarda pedidos, recetas y catálogo en Firebase cuando la persona inicia sesión (modo nube). Mientras lo confirmas, la respuesta "¿Y si pierdo mis datos?" solo habla de la copia de seguridad y no promete nube.' },
  { campo: 'Caja, base, gas y luz (c2)', estado: 'Opcional: la app no trae esos montos, así que van como "$ ?". Si me das tus costos, regenero con tus números.' },
  { campo: 'Fotos reales', estado: 'La carpeta "3. Mi material" está vacía. No hay ni habrá pasteles hechos con IA: p1 trae una portada alterna con marco para tu foto.' },
  { campo: 'Precio de Pastelia', estado: 'Confirmado (3 oct): no se menciona y nada dice "gratis". Si te preguntan, usa la respuesta rápida "¿Cuánto cuesta?".' },
  { campo: 'Mercado', estado: 'Confirmado (3 oct): México y Latinoamérica. Ejemplos en pesos mexicanos y horas del centro de México.' },
  { campo: 'Palabras clave', estado: 'Si ya publicaste piezas del Bloque 01 con COSTEO, COTIZA, PASTELIA o TIEMPO, separa la medición por fecha.' }
];

module.exports = { URL_APP, HANDLE, SEMANA, hashtags, piezas, perfil, playbook, respuestasDM, calendarioExtra, porConfirmar, dmListaEspera };
