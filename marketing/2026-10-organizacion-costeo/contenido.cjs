// Bloque 01 · Organización y costeo — fuente única del contenido.
// De aquí salen: slides (HTML y PNG), storyboards, guiones .md, captions .txt, subtítulos .srt
// y la página "Kit de contenido Pastelia". Para cambiar un texto, cámbialo aquí y vuelve a generar:
//   node marketing/2026-10-organizacion-costeo/herramientas/contar-palabras.cjs
//   node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs
//
// Verificado en index.html (oct 2026):
// - calc(): precio = (insumos×mult + 180×mult + extras) × (1 + margen). Margen por defecto 40 %.
// - Tamaño Mediano: multiplicador 1.00, 20 porciones. Extras por defecto: Flores $120 (activo), Topper $80.
// - Costo base de insumos de una receta sin lista de ingredientes: $210 (Mediano).
//   => $210 + $180 + $120 = $510 de costo; margen $204; precio sugerido $714; $35.70 por porción.
// - Mis precios de arranque: Mantequilla $186 / 1000 g => $0.186 por gramo.
// - Mano de obra: fija en el código ($180 en Mediano, escala con el tamaño). No se puede editar.
// - Estados del pedido: Cotizado y Entregado (+ Pagado). "Apartado" ya no existe.
// - "Por cobrar" suma el total de los pedidos no cobrados (no descuenta el anticipo).
// - El anticipo (prepago) y el saldo se ven en el paso "$ Total"; el PDF muestra PREPAGO, PRECIO, ENVÍO y TOTAL.
// - Ticket de WhatsApp: una línea; abre wa.me con el teléfono del cliente. El anticipo no va en el ticket.

// Respuestas del dueño (3 oct 2026):
// - URL: no hay link oficial ni landing; solo una URL de prueba. La app no tiene analítica, así que
//   la medición es por palabra clave (comentarios → DM → cuentas creadas), no por UTM.
// - Precio: no se menciona todavía (será suscripción mensual más adelante). Nada dice "gratis".
// - Mercado: México y Latinoamérica. Ejemplo en pesos mexicanos; horas del centro de México.
// - Frases reales de clientas: no hay todavía. No se usan testimonios.
const URL_PRUEBA = '[TU URL DE PRUEBA]';

const hashtags = {
  instagram: '#reposteria #pasteleria #pastelesporencargo #reposteriacasera #emprendimiento',
  tiktok: '#reposteria #pasteleria #pastelesporencargo #emprendimiento'
};

function dm() {
  return `¡Hola! Gracias por comentar. Aquí está el link para probar Pastelia: ${URL_PRUEBA}

Crea tu cuenta con tu correo o con Google, llena "Mi negocio" (nombre, logo y color) y guarda tu primera receta. Con eso ya puedes hacer tu primera cotización.

¿Me cuentas qué te pareció? Tu opinión nos ayuda a mejorarla.`;
}

const dmListaEspera = `¡Gracias por comentar! Pastelia todavía está en prueba. ¿Te aviso por aquí en cuanto abra?`;

const piezas = [
  // ───────────────────────────── VIDEO 1 ─────────────────────────────
  {
    id: 'v1', tipo: 'video', estructura: 'Problem-Solution', duracion: '27 s',
    titulo: 'Libreta + WhatsApp vs. tu agenda en Pastelia',
    fecha: '2026-10-05', dia: 'Lunes 5 de octubre', hora: '19:30',
    redes: ['Instagram (Reel)', 'TikTok', 'Facebook (Reel)'], formato: 'Video 9:16 · 1080×1920',
    palabra: 'AGENDA',
    hook: {
      visual: 'Plano cenital: tu libreta de pedidos llena de tachones y post-its. En el mismo segundo, tu mano entra con el celular haciendo scroll rápido en los chats (nombres difuminados).',
      verbal: '¿Tu agenda de pedidos es una libreta… y el WhatsApp?',
      texto: '¿Tu agenda = libreta + WhatsApp?'
    },
    escenas: [
      { t: [0, 2], nombre: 'Gancho', tipoToma: 'real', ilustracion: 'libreta-chats',
        visual: 'Cenital de la libreta con tachones + celular con scroll rápido de chats (nombres difuminados). Todo en el primer segundo, sin intro.',
        voz: '¿Tu agenda de pedidos es una libreta… y el WhatsApp?',
        texto: '¿Tu agenda = libreta + WhatsApp?' },
      { t: [2, 9], nombre: 'Agitar', tipoToma: 'real', ilustracion: 'agitar',
        visual: 'Cortes de 1–2 s: el dedo busca un chat sin encontrarlo; primer plano de la libreta con "¿anticipo?" escrito y tachado; la calculadora del celular de noche, con poca luz.',
        voz: 'Buscas el anticipo entre chats, no te acuerdas qué entregas hoy, y cotizas con la calculadora a medianoche.',
        texto: '¿Ya me dio el anticipo? · ¿Qué entrego hoy? · Cuentas a medianoche' },
      { t: [9, 15], nombre: 'Solución: tu día', tipoToma: 'pantalla', captura: '01-inicio.png',
        visual: 'Grabación de pantalla de Pastelia: Inicio con "entregas para hoy" y "Por cobrar"; tocas Agenda y se ven las tarjetas de pedidos.',
        voz: 'En Pastelia abres la app, ves qué entregas hoy y qué pedidos tienes por cobrar.',
        texto: 'Entregas de hoy · Por cobrar' },
      { t: [15, 23], nombre: 'Solución: cotizar', tipoToma: 'pantalla', captura: '09-resumen-pedido-anticipo.png',
        visual: 'Tocas "+" → Nueva cotización. Paso 2: "Mediano · 20p". Paso "$ Total": escribes el anticipo y aparece "Saldo por cobrar".',
        voz: 'Y cotizas en la misma app: el precio se calcula solo y el anticipo queda anotado, con su saldo.',
        texto: 'Precio al momento · Anticipo + saldo' },
      { t: [23, 27], nombre: 'CTA', tipoToma: 'tarjeta',
        visual: 'Tarjeta final de marca: logo Pastelia sobre marrón, palabra AGENDA en botón dorado.',
        voz: 'Comenta AGENDA y te mando el link.',
        texto: 'Comenta AGENDA y te mando el link' }
    ],
    notas: [
      'Graba en vertical 9:16, a 1080×1920. Luz de ventana de lado; nada de luz cenital dura sobre la libreta.',
      'Los 3 ganchos (visual, voz y texto) entran en el primer segundo. Nada de "Hola, soy…".',
      'Chats: usa tu propio WhatsApp con nombres y fotos difuminados (CapCut → Efectos → Desenfoque, o tapa con un sticker). No muestres conversaciones de clientas reales.',
      'Pantalla de Pastelia: activa "No molestar", sube el brillo y graba con datos de ejemplo (no de clientas reales). Las capturas del storyboard son de la app real con datos de ejemplo.',
      'Subtítulos: máximo 2 líneas de 3–5 palabras; resalta en dorado #E7B676 "AGENDA", "anticipo" y "por cobrar". Texto en Fredoka; si CapCut no la tiene, usa una redondeada en negrita con contorno.',
      'Música: tema de la biblioteca de Instagram/TikTok, bajita debajo de la voz (ducking). La voz manda.',
      'Tarjeta final: usa pastelia-lockup-oscuro.svg sobre marrón #7B5B4B, 2–3 s.'
    ],
    antes: [
      'La agenda no muestra el anticipo de cada pedido: el anticipo y el saldo se ven en el paso "$ Total" de la cotización y en el PDF. Por eso el guion lo enseña ahí.',
      '"Por cobrar" suma el total de los pedidos que no has marcado como cobrados; no descuenta anticipos. No digas "lo que te falta cobrar".',
      'Faltan tus clips: libreta, chats difuminados, calculadora de noche y la grabación de pantalla. Mándamelos por el chat y edito el Reel con subtítulos y tarjeta final.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `¿Tu agenda de pedidos es una libreta… y el WhatsApp? 📒💬

Buscar el anticipo entre chats, no acordarte qué entregas hoy y hacer cuentas a medianoche cansa más que hornear.

En Pastelia abres la app y ves:
• Tus entregas de hoy
• Los pedidos que tienes por cobrar
• Tu cotización con anticipo y saldo, en la misma app

Comenta AGENDA y te mando el link 🎂

${hashtags.instagram}`,
      tiktok: () => `Libreta + WhatsApp = pedidos regados 😵‍💫 Así se ve tu día en Pastelia: entregas de hoy, por cobrar y tu cotización con anticipo. Comenta AGENDA y te mando el link. ${hashtags.tiktok}`,
      facebook: () => `¿Todavía llevas tus pedidos en la libreta y en los chats de WhatsApp?

Pasa seguido: el anticipo se pierde entre mensajes, se te olvida qué entregas hoy y las cuentas se hacen a medianoche.

Pastelia junta todo en tu celular: abres la app y ves tus entregas de hoy y los pedidos por cobrar. Y ahí mismo cotizas: el precio se calcula solo y el anticipo queda anotado con su saldo.

¿Quieres probarla? Comenta AGENDA y te mando el link.`
    }
  },

  // ───────────────────────────── VIDEO 2 ─────────────────────────────
  {
    id: 'v2', tipo: 'video', estructura: 'Tutorial / Demo', duracion: '≈ 50–55 s (depende de tu tiempo real)',
    titulo: 'Cotiza un pastel para 20 personas, con cronómetro',
    fecha: '2026-10-09', dia: 'Viernes 9 de octubre', hora: '19:30',
    redes: ['Instagram (Reel)', 'TikTok', 'Facebook (Reel)'], formato: 'Video 9:16 · 1080×1920',
    palabra: 'COTIZA',
    hook: {
      visual: 'El resultado primero: el PDF con tu logo en pantalla y, al lado, el cronómetro detenido en tu tiempo real.',
      verbal: 'Pastel para 20 personas: cotizado, en PDF y en WhatsApp. Con cronómetro.',
      texto: 'Pastel para 20 ⏱ [TU TIEMPO REAL]'
    },
    escenas: [
      { t: [0, 3], nombre: 'Gancho (resultado primero)', tipoToma: 'pantalla', captura: '10-pdf-comprobante.png', cronometro: '[TU TIEMPO]',
        visual: 'El PDF con tu logo ya listo y el cronómetro detenido en tu tiempo real, los dos en cuadro desde el primer segundo.',
        voz: 'Pastel para 20 personas: cotizado, en PDF y en WhatsApp. Con cronómetro.',
        texto: 'Pastel para 20 ⏱ [TU TIEMPO REAL]' },
      { t: [3, 6], nombre: 'Mapa de pasos', tipoToma: 'pantalla', captura: '03-cotizar-paso1-cliente.png', cronometro: '0:00',
        visual: 'Tocas "Cotizar" y arranca el cronómetro. Se ven los 4 pasos arriba: 1 Cliente · 2 Pastel · 3 Costeo · $ Total.',
        voz: 'Son cuatro pasos. Arranco el cronómetro.',
        texto: '4 pasos · cronómetro real, sin cortes' },
      { t: [6, 14], nombre: 'Paso 1 · Cliente', tipoToma: 'pantalla', captura: '03-cotizar-paso1-cliente.png', cronometro: 'corriendo',
        visual: 'Escribes nombre, teléfono, 20 invitados y la fecha del evento.',
        voz: 'Uno: nombre, teléfono y fecha del evento.',
        texto: 'Paso 1: Cliente' },
      { t: [14, 23], nombre: 'Paso 2 · Pastel', tipoToma: 'pantalla', captura: '04-cotizar-paso2-pastel.png', cronometro: 'corriendo',
        visual: 'Receta guardada → tocas "Mediano · 20p" → bajas a Extras y tocas Flores.',
        voz: 'Dos: tu receta, tamaño Mediano de 20 porciones, y las flores.',
        texto: 'Paso 2: Pastel · Mediano 20p' },
      { t: [23, 31], nombre: 'Paso 3 · Costeo', tipoToma: 'pantalla', captura: '06-cotizar-paso3-costeo.png', cronometro: 'corriendo',
        visual: 'Se ve "Costo del pedido" y el "Resumen en vivo": precio sugerido y precio por porción.',
        voz: 'Tres: el precio sale solo, con tus insumos, la mano de obra, los extras y tu margen.',
        texto: 'Paso 3: precio sugerido · y por porción' },
      { t: [31, 37], nombre: 'Paso 4 · $ Total', tipoToma: 'pantalla', captura: '09-resumen-pedido-anticipo.png', cronometro: 'corriendo',
        visual: 'Escribes el anticipo y aparece el "Saldo por cobrar".',
        voz: 'Cuatro: pones el anticipo y ves el saldo.',
        texto: 'Paso 4: anticipo → saldo' },
      { t: [37, 45], nombre: 'PDF y ticket', tipoToma: 'pantalla', captura: '10-pdf-comprobante.png', cronometro: 'se detiene',
        visual: 'Tocas PDF → comprobante con tu logo. Tocas el botón de ticket → se abre WhatsApp con el ticket listo. Ahí detienes el cronómetro.',
        voz: 'PDF con tu logo… y el ticket directo al WhatsApp de tu cliente.',
        texto: 'PDF con tu logo · Ticket a WhatsApp' },
      { t: [45, 50], nombre: 'Resultado', tipoToma: 'real', ilustracion: 'cronometro', cronometro: '[TU TIEMPO]',
        visual: 'Primer plano del cronómetro detenido.',
        voz: 'Todo en [di tu tiempo real].',
        texto: '⏱ [TU TIEMPO REAL] · con receta y precios ya guardados' },
      { t: [50, 54], nombre: 'CTA', tipoToma: 'tarjeta',
        visual: 'Tarjeta final de marca con la palabra COTIZA.',
        voz: 'Comenta COTIZA y te mando el link para probarla.',
        texto: 'Comenta COTIZA y te mando el link' }
    ],
    notas: [
      'El tiempo NO se inventa: escribe en el gancho, en el texto y en el caption exactamente lo que marque tu cronómetro.',
      'Opción A (recomendada): graba con otra cámara el celular con Pastelia y, al lado, un cronómetro físico o en otra pantalla, en una sola toma sin cortes.',
      'Opción B: grabación de pantalla continua (sin cortes) y en CapCut pones un cronómetro que arranca en el toque a "Cotizar" y se detiene cuando aparece el ticket en WhatsApp.',
      'Si tu tiempo real no cabe en ~40 s, acelera el video (x1.5 o x2) con el cronómetro dentro del cuadro y escribe "acelerado x2 · cronómetro real". Así el número sigue siendo real.',
      'Antes de grabar: "Mi negocio" con tu logo, al menos 1 receta guardada (sin receta no se puede cotizar) y tus insumos en "Mis precios". Eso no cuenta en el cronómetro; por eso se aclara en pantalla.',
      'El campo "invitados" no elige el tamaño solo: toca "Mediano · 20p" a mano.',
      'PDF: en el celular se abre la ventana de imprimir/compartir; elige "Guardar como PDF". Muéstralo 1–2 s.',
      'Ticket: abre WhatsApp con el número del cliente. Para la demo usa tu propio número de prueba; no muestres chats de clientas reales.',
      'Tus números saldrán de tu receta y tus precios, no los del ejemplo. Está bien: el texto en pantalla no fija un precio.'
    ],
    antes: [
      'Reemplaza [TU TIEMPO REAL] en el gancho, en la escena "Resultado", en los subtítulos y en el caption con lo que marque el cronómetro.',
      'Graba con receta, logo e insumos ya cargados y deja visible "con receta y precios ya guardados".',
      'Faltan tus clips (grabación de la demo y del cronómetro). Mándamelos y edito el Reel en 9:16 con subtítulos y tarjeta final.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `¿Cuánto tardas en cotizar un pastel para 20 personas? ⏱

Lo medimos con cronómetro real, sin cortes: [TU TIEMPO REAL] desde "Cotizar" hasta el ticket en WhatsApp (con la receta y los precios ya guardados).

1. Cliente: nombre, teléfono y fecha
2. Pastel: tu receta, Mediano de 20 porciones y extras
3. Costeo: el precio sale solo, con precio por porción
4. Total: anticipo y saldo
Y listo: PDF con tu logo o ticket directo a WhatsApp.

Comenta COTIZA y te mando el link para probarla.

${hashtags.instagram}`,
      tiktok: () => `Pastel para 20 personas: cotizado, PDF y WhatsApp en [TU TIEMPO REAL] ⏱ (cronómetro real, sin cortes). Comenta COTIZA y te mando el link. ${hashtags.tiktok}`,
      facebook: () => `Hicimos la prueba con cronómetro: un pastel Mediano para 20 personas, desde que tocas "Cotizar" hasta que el ticket sale por WhatsApp.

Resultado: [TU TIEMPO REAL], sin cortes (con la receta y los precios ya guardados).

Son 4 pasos: cliente, pastel, costeo y total. El precio se calcula solo, ves cuánto sale por porción, anotas el anticipo y mandas el PDF con tu logo o el ticket por WhatsApp.

Si quieres probarla, comenta COTIZA y te mando el link.`
    }
  },

  // ─────────────────────────── CARRUSEL 1 ───────────────────────────
  {
    id: 'c1', tipo: 'carrusel', estructura: 'Problem-Proof',
    titulo: 'El error de cobrar lo que cobra la competencia',
    fecha: '2026-10-07', dia: 'Miércoles 7 de octubre', hora: '12:30',
    redes: ['Instagram (carrusel)', 'Facebook (álbum)'], formato: '9 slides · 1080×1350 (4:5)',
    palabra: 'COSTEO',
    slides: [
      { tipo: 'portada', titulo: '¿Cobras lo que cobra la de enfrente?',
        visual: 'Fondo marrón. Dos etiquetas de precio iguales con "$ ???"; la de la derecha tachada en dorado.' },
      { kicker: 'El error fatal', titulo: 'Copiar el precio de otra pastelería',
        texto: 'Su precio sale de sus insumos, su receta y su tiempo. No de los tuyos.',
        visual: 'Dos pasteles iguales lado a lado; cada uno con su propia etiqueta de costo con signo de interrogación.', ilustracion: 'dos-pasteles' },
      { kicker: 'Lo que te cuesta', titulo: 'Trabajar gratis',
        texto: 'Si ese precio no cubre tu costo, cada pastel que vendes sale de tu bolsa.',
        etiquetas: ['Precio copiado', 'Tu costo'],
        visual: 'Dos barras: "Precio copiado" más corta que "Tu costo"; la diferencia marcada en dorado.', ilustracion: 'barras' },
      { kicker: 'La fórmula', titulo: 'Tu precio real',
        texto: 'Insumos + mano de obra + extras + tu ganancia',
        visual: 'Cuatro bloques apilados que forman una etiqueta de precio.', ilustracion: 'formula' },
      { kicker: 'Paso 1', titulo: 'Costea por gramo',
        texto: 'Mantequilla a $186 el kilo = $0.186 por gramo. Lo mismo con cada insumo.',
        nota: 'Precios de ejemplo en pesos mexicanos',
        visual: 'Captura real de "Mis precios" recortada a la fila de Mantequilla: $186 / 1000 g → $0.186/g.',
        captura: { archivo: '02b-mis-precios.png', recorte: [40, 30, 1130, 232], ancho: 888 }, captura2: { archivo: '02b-mis-precios.png', recorte: [40, 448, 1130, 668], ancho: 888 } },
      { kicker: 'Ejemplo · Mediano, 20 porciones', titulo: 'Costo: $510',
        bloques: [['Insumos', '$210'], ['Mano de obra', '$180'], ['Flores', '$120']],
        texto: 'Eso cuesta hacerlo, antes de ganar un peso.',
        nota: 'En pesos mexicanos',
        visual: 'Tres bloques (insumos $210, mano de obra $180, flores $120) que suman $510.', ilustracion: 'suma' },
      { kicker: 'Paso 2', titulo: 'Súmale tu ganancia',
        texto: 'Margen de 40%: $204.',
        etiqueta: { arriba: 'Precio sugerido', precio: '$714', abajo: '$35.70 por porción' },
        nota: 'Tú eliges tu margen.',
        visual: 'Etiqueta de precio grande: $714, y abajo $35.70 por porción.', ilustracion: 'etiqueta' },
      { tipo: 'prueba', kicker: 'La prueba', titulo: 'Así lo calcula Pastelia',
        nota: 'Captura real de la app · datos de ejemplo',
        visual: 'Captura real del "Resumen en vivo" del cotizador: insumos $210, mano de obra $180, extras $120, margen 40% $204, precio sugerido $714, $35.70 por porción.',
        captura: { archivo: '07-resumen-en-vivo.png' } },
      { tipo: 'cta', titulo: '¿Quieres saber tu precio real?', cta: 'Comenta COSTEO y te mando el link',
        visual: 'Logo Pastelia y la palabra COSTEO en botón dorado.' }
    ],
    notas: [
      'Los números son un ejemplo con los valores de arranque de la app (calc(), tamaño Mediano, margen 40 %). Con tus precios y tu receta cambian.',
      'El slide de prueba es una captura real de la app (corrida en modo local con datos de ejemplo). Si prefieres tomarla en tu celular, ve a Cotizar con una receta, Mediano · 20p y Flores, margen 40 %, y captura el "Resumen en vivo": debe dar los mismos números solo si tu receta cuesta $210 de insumos.',
      'No se compara con el precio de ninguna pastelería real. El slide 3 es una condición ("si ese precio no cubre tu costo"), no un dato.'
    ],
    antes: [
      'El $210 de insumos es el costo base que la app usa para un Mediano cuando la receta no tiene ingredientes capturados. Es un ejemplo, no el costo de una receta real.',
      'La mano de obra ($180 en Mediano) es fija en la app hoy: el carrusel no promete que la puedas cambiar.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `¿Cobras lo que cobra la pastelería de enfrente? Ese error te puede salir caro 👇

Su precio sale de SUS insumos, SU receta y SU tiempo. Si ese precio no cubre tu costo, cada pastel sale de tu bolsa.

En el ejemplo (pastel Mediano, 20 porciones, en pesos mexicanos):
• Insumos $210 + mano de obra $180 + flores $120 = $510 de costo
• Margen de 40 %: $204
• Precio sugerido: $714, o $35.70 por porción

Son números de ejemplo con los valores de arranque de Pastelia. Con tus precios, cambian.

Comenta COSTEO y te mando el link para costear tu pastel.

${hashtags.instagram}`,
      facebook: () => `¿Cuánto cobras por un pastel para 20 personas? Si la respuesta es "lo que cobra la de enfrente", este carrusel es para ti.

El precio de otra pastelería sale de sus insumos, su receta y su tiempo. No de los tuyos.

Ejemplo con los valores de arranque de Pastelia, en pesos mexicanos, pastel Mediano de 20 porciones: hacerlo cuesta $510 (insumos $210, mano de obra $180 y flores $120) antes de ganar un peso. Con 40 % de margen, el precio sugerido es $714, o $35.70 por porción.

Comenta COSTEO y te mando el link para que costees el tuyo.`
    }
  },

  // ─────────────────────────── CARRUSEL 2 ───────────────────────────
  {
    id: 'c2', tipo: 'carrusel', estructura: 'Value-Stack',
    titulo: '3 claves de una cotización que cobra el anticipo',
    fecha: '2026-10-11', dia: 'Domingo 11 de octubre', hora: '11:00',
    redes: ['Instagram (carrusel)', 'Facebook (álbum)'], formato: '6 slides · 1080×1350 (4:5)',
    palabra: 'ANTICIPO',
    slides: [
      { tipo: 'portada', titulo: '3 claves para cobrar el anticipo',
        visual: 'Fondo crema. Un "3" enorme en dorado y, detrás, el comprobante PDF inclinado.',
        captura: { archivo: '10-pdf-comprobante.png' } },
      { kicker: 'Clave 1', titulo: 'Tu marca',
        texto: 'Logo, nombre, teléfono e Instagram en tu PDF. Tu cliente sabe con quién trata.',
        visual: 'Recorte del encabezado del PDF: logo, "Comprobante de pedido" y nombre de la pastelería; abajo, el pie con el teléfono.',
        captura: { archivo: '10-pdf-comprobante.png', recorte: [150, 0, 2310, 700], ancho: 960 }, captura2: { archivo: '10-pdf-comprobante.png', recorte: [150, 2010, 2310, 2226], ancho: 960 } },
      { kicker: 'Clave 2', titulo: 'Todo por escrito',
        texto: 'Fecha del evento, porciones, sabor, relleno, cobertura, mensaje y alergias. Adiós al "yo entendí otra cosa".',
        visual: 'Recorte del PDF: sabor, relleno, cobertura, tamaño y porciones, mensaje y alergias.',
        captura: { archivo: '10-pdf-comprobante.png', recorte: [1252, 231, 2280, 696], ancho: 620 }, captura2: { archivo: '10-pdf-comprobante.png', recorte: [150, 1160, 2310, 1710], ancho: 960 } },
      { kicker: 'Clave 3', titulo: 'Números claros',
        texto: 'Anticipo, precio, envío y total, separados. Tu cliente sabe cuánto paga hoy; tú ves el saldo.',
        visual: 'Recorte de la tabla PREPAGO · PRECIO · ENVÍO · TOTAL del PDF y, debajo, "Saldo por cobrar $357" de la app.',
        captura: { archivo: '10-pdf-comprobante.png', recorte: [150, 1795, 2310, 1995], ancho: 960 }, captura2: { archivo: '09-resumen-pedido-anticipo.png', recorte: [0, 930, 1038, 1290], ancho: 640 } },
      { tipo: 'prueba', kicker: 'Las 3 juntas', titulo: 'Así sale tu PDF en Pastelia',
        nota: 'Captura real · datos de ejemplo',
        visual: 'Captura completa del comprobante PDF generado por la app con datos de ejemplo.',
        captura: { archivo: '10-pdf-comprobante.png' } },
      { tipo: 'cta', titulo: '¿Quieres tu PDF con tu logo?', cta: 'Comenta ANTICIPO y te mando el link',
        visual: 'Logo Pastelia y la palabra ANTICIPO en botón dorado.' }
    ],
    notas: [
      'El PDF se llama "Comprobante de pedido" en la app. Muestra PREPAGO (anticipo), PRECIO, ENVÍO y TOTAL; el saldo por cobrar se ve en la app, en el paso "$ Total".',
      '"TU LOGO" es un marcador para enseñar dónde va el logo de la pastelería. Anticipo de $357 = 50 % de $714, solo como ejemplo: cada quien decide su anticipo.',
      'El cliente y el teléfono del PDF son de ejemplo (el teléfono es el mismo marcador que usa la app).'
    ],
    antes: [
      'Ojo con la promesa: el carrusel da consejos para que el cliente confíe; no promete que te paguen más rápido ni da cifras.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `Una cotización por chat se pierde entre mensajes. Una con tu marca, todo por escrito y números claros le da a tu cliente la confianza para dejar el anticipo.

Las 3 claves:
1. Tu marca: logo, nombre, teléfono e Instagram
2. Todo por escrito: fecha, porciones, sabor, relleno, cobertura, mensaje y alergias
3. Números claros: anticipo, precio, envío y total

Pastelia arma ese PDF desde tu cotización, con tu logo.

Comenta ANTICIPO y te mando el link.

${hashtags.instagram}`,
      facebook: () => `¿Te ha pasado que mandas el precio por WhatsApp y el cliente nunca deja el anticipo?

Una cotización que da confianza tiene 3 cosas:
1. Tu marca (logo, nombre, teléfono e Instagram)
2. Todo por escrito: fecha del evento, porciones, sabor, relleno, cobertura, mensaje y alergias
3. Números claros: anticipo, precio, envío y total

En Pastelia ese PDF sale de tu cotización, con tu logo. Comenta ANTICIPO y te mando el link.`
    }
  }
];

// DM que mandas a quien comente la palabra clave de cada pieza.
piezas.forEach((p) => { p.dm = dm(); });

const porConfirmar = [
  { campo: 'Mercado', estado: 'Confirmado: México y Latinoamérica. El ejemplo está en pesos mexicanos y las horas son del centro de México. Donde dicen "torta" en vez de "pastel", conviene adaptar el texto.' },
  { campo: 'Precio de Pastelia', estado: 'Confirmado: no se menciona. Será suscripción mensual más adelante; ningún texto dice "gratis".' },
  { campo: 'URL para los CTA', estado: 'Por confirmar: no hay link oficial ni landing, solo la URL de prueba. El DM lleva [TU URL DE PRUEBA]; pégala antes de responder. Si todavía no quieres abrir la prueba, usa la respuesta de lista de espera.' },
  { campo: 'Frases reales de clientas', estado: 'Confirmado: no hay todavía, así que no se usa ningún testimonio. El DM pide opinión para juntar frases reales para el Bloque 02.' }
];

module.exports = { URL_PRUEBA, piezas, porConfirmar, dmListaEspera };
