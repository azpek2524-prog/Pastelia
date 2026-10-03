// Bloque 01 · Lanzamiento, organización y costeo — fuente única del contenido.
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
// - Mis precios de arranque: Mantequilla $186 / 1000 g => $0.186 por gramo. Al cambiar el precio de un
//   insumo, las cotizaciones nuevas lo usan (las recetas con ingredientes se costean con "Mis precios").
// - Mano de obra: fija en el código ($180 en Mediano, escala con el tamaño). No se puede editar.
// - Estados del pedido: Cotizado y Entregado (+ Pagado). "Apartado" ya no existe.
// - Inicio: "entregas para hoy", "Por cobrar" (suma el total de los pedidos no cobrados; no descuenta el
//   anticipo) y "Semana". El anticipo (prepago) queda en el pedido y en el PDF; el saldo se ve en "$ Total".
// - Ticket de WhatsApp: una línea; abre wa.me con el teléfono del cliente. El anticipo no va en el ticket.
// - Modo oscuro: existe (Mi negocio). Las capturas del marketing se toman en modo oscuro (look cacao).
//
// Respuestas del dueño (3 oct 2026):
// - URL: no hay link oficial ni landing; solo una URL de prueba. La app no tiene analítica, así que
//   la medición es por palabra clave (comentarios → DM → cuentas creadas), no por UTM.
// - Precio: no se menciona todavía (será suscripción mensual más adelante). Nada dice "gratis".
// - Mercado: México y Latinoamérica. Ejemplo en pesos mexicanos; horas del centro de México.
// - Frases reales de clientas: no hay todavía. No se usan testimonios.
// - Estética: fondos oscuros cacao, texto crema, acentos dorados (identidad de Pastelia).
//
// Slides: tipo (portada | cuerpo | prueba | cta), kicker, titulo, destacado (partes del título en dorado),
// texto, loop (el ciclo abierto que obliga a deslizar), nota, extra (textos dentro de gráficos o burbujas),
// cta y visual (el diseño exacto del slide). contar-palabras.cjs cuenta todo lo que se ve.
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

const FONDO = 'Fondo cacao casi negro (#140D09 → #241811) con grano fino y un brillo cálido';
const NOTA_CAPTURA = 'Datos de ejemplo';

const piezas = [
  // ─────────────────────────── MANIFIESTO ───────────────────────────
  {
    id: 'm1', tipo: 'carrusel', estructura: 'Manifiesto', etiqueta: 'Manifiesto',
    titulo: 'Horneas de día. Cuentas de noche.',
    fecha: '2026-10-05', dia: 'Lunes 5 de octubre', hora: '12:30',
    redes: ['Instagram (carrusel, fijado en el perfil)', 'Facebook (álbum)'], formato: '9 slides · 1080×1350 (4:5)',
    palabra: 'PASTELIA',
    slides: [
      { tipo: 'portada', titulo: 'Horneas de día. Cuentas de noche.', destacado: ['de noche.'],
        visual: `${FONDO}. Arriba, un goteo de chocolate brillante cae desde el borde. Luna dorada a la derecha con destellos. Titular crema enorme (Nunito Black 132 px) en cuatro líneas, en la mitad de abajo; "de noche." en dorado. Logo de Pastelia al pie.` },
      { titulo: 'Y no por gusto.', texto: 'Es que nadie te enseñó a ponerle precio a lo que haces con las manos.',
        loop: 'Así que haces lo que todos…',
        visual: `${FONDO}. Titular crema arriba, texto crema al 85 %. Abajo, libreta crema con renglones y precios tachados en rojo cacao; la libreta cruza al slide 3. Ciclo abierto en dorado al pie, con flecha →.` },
      { titulo: 'Cobras a ojo.', texto: 'Copias el precio de enfrente. Anotas pedidos en una libreta y anticipos en un chat.',
        loop: 'Y al final del mes…',
        visual: `${FONDO}. "Desorden" apagado (sin dorado): etiqueta de precio "$ ?" inclinada y sin color a la izquierda (la libreta del slide 2 asoma por el borde) y dos burbujas de chat sin texto a la derecha, en gris cacao con sombra. Ciclo abierto en dorado al pie.` },
      { titulo: '…no sabes si ganaste o solo trabajaste.', destacado: ['o solo trabajaste.'],
        texto: 'Esa duda es la razón por la que existe Pastelia.',
        loop: 'Porque creemos algo muy simple:',
        visual: `${FONDO}. Al centro, el ícono de Pastelia grande (300 px) "se enciende": halo dorado y rayos suaves. Titular crema arriba con "o solo trabajaste." en dorado.` },
      { titulo: 'Cobrar bien no es ser cara. Es ser profesional.', destacado: ['profesional.'],
        texto: 'Tu trabajo tiene un costo real y merece un precio justo.',
        loop: 'Por eso hacemos tres cosas:',
        visual: `${FONDO}. Slide tipográfico: comillas doradas gigantes arriba a la izquierda; titular crema 100 px con "profesional." en dorado. Abajo a la derecha, pastel de chocolate con frambuesas y hoja de oro sobre base dorada (placer visual).` },
      { kicker: '1', titulo: 'Tu precio real.', texto: 'Costeo por gramo y tu ganancia, mientras cotizas.',
        loop: 'Pero de nada sirve si olvidas el pedido…', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Número "1" dorado grande (250 px) arriba a la izquierda, encima del titular. Teléfono a la derecha con la app real en modo oscuro (paso Costeo). Tarjeta flotante a la izquierda con el "Resumen en vivo" ampliado ($714 · $35.70 por porción), borde dorado y sombra.` },
      { kicker: '2', titulo: 'Tu día en orden.', texto: 'Entregas de hoy y lo que tienes por cobrar, al abrir la app.',
        loop: 'Y para tu cliente…', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Número "2" dorado grande arriba a la izquierda, encima del titular. Teléfono a la izquierda con el Inicio de la app en modo oscuro. Tarjetas flotantes ampliadas: "2 entregas para hoy" y "Por cobrar", con borde dorado.` },
      { kicker: '3', titulo: 'Verte como lo que eres.', texto: 'Un PDF con tu logo y el ticket directo a su WhatsApp.',
        loop: 'Y esto apenas empieza.', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Número "3" dorado grande arriba a la izquierda, encima del titular. El comprobante PDF real (papel blanco) flotando inclinado, con sombra larga y un filo de luz dorada.` },
      { tipo: 'cta', titulo: 'Hornea con el corazón. Cobra con números.', destacado: ['Cobra con números.'], cta: 'Comenta PASTELIA y te mando el link',
        visual: `${FONDO}. Goteo de chocolate arriba que asoma desde el slide 8 (cierra igual que la portada). Logo de Pastelia, titular crema con "Cobra con números." en dorado y un botón cacao con borde dorado: "Comenta", PASTELIA en dorado grande y "y te mando el link".` }
    ],
    notas: [
      'Es el primer post del perfil: publícalo antes que todo lo demás y fíjalo arriba en Instagram (los tres puntos → Fijar en tu perfil).',
      'No cuenta una historia personal inventada: habla del dolor del oficio y de para qué existe Pastelia. Si quieres, en el Bloque 02 hacemos uno con tu historia real de cómo nació.',
      'Las pantallas son capturas reales de la app en modo oscuro, con datos de ejemplo.',
      'Si lo prefieres como Reel: usa los mismos 9 textos como texto en pantalla, 2–3 s cada uno, sobre B-roll oscuro (cocina de noche, libreta, celular). Te armo el guion si lo quieres.'
    ],
    antes: [
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).',
      'Después de publicarlo, fíjalo en tu perfil.'
    ],
    captions: {
      instagram: () => `Horneas de día. Cuentas de noche. 🌙

Y no por gusto: nadie te enseñó a ponerle precio a lo que haces con las manos. Así que cobras a ojo, copias el precio de enfrente y llevas pedidos y anticipos entre una libreta y un montón de chats.

Al final del mes queda la duda: ¿gané o solo trabajé?

Pastelia existe por esa duda. Y hace tres cosas:
1. Tu precio real: costeo por gramo con tus precios y tu ganancia, mientras cotizas.
2. Tu día en orden: lo que entregas hoy y lo que tienes por cobrar.
3. Verte profesional: PDF con tu logo y ticket directo al WhatsApp de tu cliente.

Cobrar bien no es ser cara. Es ser profesional.

En esta cuenta vas a aprender a costear, cobrar y organizar tus pedidos. Sin fórmulas raras.

Comenta PASTELIA y te mando el link para probarla.

${hashtags.instagram}`,
      facebook: () => `Horneas de día. Cuentas de noche.

Nadie te enseñó a ponerle precio a lo que haces con las manos. Por eso cobras a ojo, copias el precio de enfrente y llevas tus pedidos entre una libreta y un montón de chats. Y al final del mes no sabes si ganaste o solo trabajaste.

Pastelia existe por esa duda: te da tu precio real (costeo por gramo y tu ganancia), tu día en orden (lo que entregas hoy y lo que tienes por cobrar) y una cotización profesional (PDF con tu logo y ticket por WhatsApp).

Cobrar bien no es ser cara. Es ser profesional.

Comenta PASTELIA y te mando el link para probarla.`
    }
  },

  // ─────────────────────────── CARRUSEL · OPCIÓN A ───────────────────────────
  {
    id: 'cA', tipo: 'carrusel', estructura: 'Problem-Proof', etiqueta: 'Opción A',
    titulo: 'El error de $180 en cada pastel (tu tiempo)',
    fecha: '2026-10-06', dia: 'Martes 6 de octubre', hora: '12:30',
    redes: ['Instagram (carrusel)', 'Facebook (álbum)'], formato: '8 slides · 1080×1350 (4:5)',
    palabra: 'TIEMPO',
    slides: [
      { tipo: 'portada', titulo: 'El error de $180 en cada pastel', destacado: ['$180'],
        visual: `${FONDO}. Arriba, un goteo de chocolate que escurre desde el borde. Composición tipográfica: "El error de" en crema, "$180" gigante (330 px) en oro con brillo, "en cada pastel" en crema. Un hilo dorado sale del "0" y cruza al slide 2.` },
      { titulo: 'No es la harina. Tampoco la mantequilla.', texto: 'Es algo que usas en cada pastel…',
        loop: '…y nunca anotas en tu libreta.',
        visual: `${FONDO}. Libreta crema con lista de ingredientes: renglones con palomitas doradas y el último renglón vacío con un "?" dorado que brilla. Ciclo abierto en dorado al pie.` },
      { titulo: 'Tu tiempo.', texto: 'Batir, hornear, decorar, entregar. En un Mediano, Pastelia suma $180 de mano de obra.',
        loop: '¿Y si no lo cobras?', nota: NOTA_CAPTURA,
        visual: `${FONDO}. "Tu tiempo." gigante en crema. Recorte flotante de la app (modo oscuro) con las filas del costeo y un aro dorado sobre "Mano de obra $180"; detrás, el teléfono con el paso Costeo entra desde la derecha y cruza al slide 4.` },
      { titulo: 'Lo pagas tú.', texto: 'Haz la cuenta:', extra: ['10 × $180 = ?'],
        loop: 'si entregas 10 pasteles al mes…',
        visual: `${FONDO}. Ecuación enorme al centro: "10 × $180 =" en crema y un "?" dorado gigante que brilla. Ciclo abierto en dorado al pie.` },
      { titulo: '…son $1,800 de tu tiempo sin cobrar.', destacado: ['$1,800'], texto: 'Cada mes. Y el cliente ni se entera,',
        loop: 'porque solo ve…', nota: 'Ejemplo: Mediano, 10 pedidos al mes',
        visual: `${FONDO}. "$1,800" es la cifra protagonista: oro con brillo, 270 px, con destellos. El resto del titular en crema. Abajo, 10 pastelitos dorados en dos filas de 5 (los 10 pedidos del mes).` },
      { titulo: '…un precio. Este sí te paga:', extra: ['Insumos $210', 'Tu tiempo $180', 'Flores $120', 'Ganancia $204', '$714'],
        loop: '¿Lo haces a mano?', nota: 'Ejemplo: Mediano, 20 porciones',
        visual: `${FONDO}. Gráfico: una barra horizontal apilada parte el precio de $714 en 4. "Tu tiempo $180" en dorado (protagonista) y el resto en un solo tono cacao claro, separados por huecos de 2 px. Etiquetas directas debajo de cada parte. Total "$714" grande en crema arriba a la derecha. Abajo a la derecha, el pastel de chocolate con hoja de oro.` },
      { tipo: 'prueba', titulo: 'No: Pastelia lo calcula mientras cotizas.', texto: 'Tú eliges receta, tamaño y extras.',
        loop: '¿Quieres ver el tuyo?', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Teléfono grande a la izquierda con la app en modo oscuro (paso Costeo). Tarjeta flotante a la derecha con el "Resumen en vivo" ampliado ($714 · $35.70 por porción), borde y brillo dorados.` },
      { tipo: 'cta', titulo: 'Cobra tu tiempo desde el próximo pedido.', destacado: ['tu tiempo'], cta: 'Comenta TIEMPO y te mando el link',
        visual: `${FONDO}. Goteo de chocolate arriba. Logo, titular crema con "tu tiempo" en dorado, botón cacao con borde dorado y TIEMPO en dorado. Pastel de chocolate abajo a la izquierda.` }
    ],
    notas: [
      '$180 es la mano de obra que Pastelia suma en un pastel Mediano (valor fijo de la app). El 10 de "10 pasteles al mes" es una suposición para hacer la cuenta: cámbiala por tus pedidos reales si quieres.',
      'Gráfico de énfasis: solo "Tu tiempo" va en dorado; el resto en un tono neutro, con etiquetas directas. Los colores pasan contraste de 3:1 contra el fondo.',
      'Las pantallas son capturas reales de la app en modo oscuro, con datos de ejemplo.',
      'El carrusel es continuo: algunos elementos cruzan de un slide al siguiente, así que se publica en orden.'
    ],
    antes: [
      'La mano de obra ($180 en Mediano) es fija en la app hoy: el carrusel no promete que la puedas cambiar.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `El error de $180 que no está en tu libreta 👇

No es la harina. No es la mantequilla. Es tu tiempo: batir, hornear, decorar y entregar.

En un pastel Mediano, Pastelia suma $180 de mano de obra. Si no lo cobras, lo pagas tú. Con 10 pasteles al mes, son $1,800 de tu tiempo sin cobrar. Cada mes.

(Ejemplo con los valores de la app, en pesos mexicanos. Con tus números, cambia.)

En el último slide ves cómo se ve un precio que sí te paga.

Comenta TIEMPO y te mando el link.

${hashtags.instagram}`,
      facebook: () => `¿Cuánto vale tu tiempo en cada pastel?

Batir, hornear, decorar y entregar también es trabajo. En un pastel Mediano, Pastelia suma $180 de mano de obra al precio. Si no lo cobras, lo pagas tú: con 10 pasteles al mes son $1,800 de tu tiempo sin cobrar.

Ejemplo con los valores de la app, en pesos mexicanos: insumos $210 + tu tiempo $180 + flores $120 + ganancia $204 = $714.

Comenta TIEMPO y te mando el link para costear el tuyo.`
    }
  },

  // ───────────────────────────── VIDEO 1 ─────────────────────────────
  {
    id: 'v1', tipo: 'video', estructura: 'Problem-Solution', duracion: '30 s',
    titulo: 'Libreta + WhatsApp vs. tu agenda en Pastelia',
    fecha: '2026-10-07', dia: 'Miércoles 7 de octubre', hora: '19:30',
    redes: ['Instagram (Reel)', 'TikTok', 'Facebook (Reel)'], formato: 'Video 9:16 · 1080×1920',
    palabra: 'AGENDA', claves: ['anticipo', 'hoy', 'Por cobrar'],
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
      { t: [9, 11], nombre: 'Respira', tipoToma: 'real', ilustracion: 'cierra-libreta',
        visual: 'Corte seco y silencio de medio segundo: cierras la libreta de golpe. Mesa de madera oscura, una sola lámpara cálida. Tu celular con Pastelia en modo oscuro se enciende y su luz dorada te ilumina la cara.',
        voz: 'Ahora imagina tu día así.',
        texto: 'Ahora imagina esto…' },
      { t: [11, 17], nombre: 'Tu día en una pantalla', tipoToma: 'pantalla', captura: '01-inicio.png',
        visual: 'Grabación de pantalla en modo oscuro: Inicio con "2 entregas para hoy" y "Por cobrar". Zoom lento al 110 % sobre las entregas, viñeta oscura en los bordes.',
        voz: 'Abres Pastelia y ahí está: lo que entregas hoy y lo que tienes por cobrar.',
        texto: 'Entregas de hoy · Por cobrar' },
      { t: [17, 24], nombre: 'Cotiza sin calculadora', tipoToma: 'pantalla', captura: '06-cotizar-paso3-costeo.png',
        visual: 'Grabación de pantalla en modo oscuro, cortes al ritmo de la música: "+" → Nueva cotización → "Mediano · 20p" → el "Resumen en vivo" saca el precio → paso "$ Total": escribes el anticipo.',
        voz: '¿Te piden un pastel? Lo cotizas ahí mismo: el precio sale solo y el anticipo queda anotado.',
        texto: 'Precio al instante · Anticipo anotado' },
      { t: [24, 27], nombre: 'La libreta, para recetas', tipoToma: 'real', ilustracion: 'libreta-recetas',
        visual: 'B-roll cálido bajo la lámpara: abres la libreta en una página de receta; el celular descansa a un lado con la app encendida. Respiras y sonríes. Plano cerrado, fondo oscuro.',
        voz: 'Y tu libreta… vuelve a ser solo para tus recetas.',
        texto: 'Tu libreta, solo para recetas.' },
      { t: [27, 30], nombre: 'CTA', tipoToma: 'tarjeta',
        visual: 'Tarjeta final: fondo cacao con goteo de chocolate, logo de Pastelia y "Comenta AGENDA" con la palabra en dorado.',
        voz: 'Comenta AGENDA y te mando el link.',
        texto: 'Comenta AGENDA y te mando el link' }
    ],
    notas: [
      'Gancho y Agitar quedan igual. La segunda mitad cambia de energía a propósito: en "Ahora imagina esto…" corta la música medio segundo y vuelve más suave. Ese silencio es la transición.',
      'Look cacao: una sola lámpara cálida (2700–3000 K), sin luz de techo; fondo oscuro (mesa de madera oscura o tela negra). En la edición: sombras profundas, temperatura cálida y verdes/azules bajos.',
      'Texto en pantalla: Nunito Black (o una redondeada en negrita) en crema #FFF4E6, sobre una barra cacao #1A120D al 70 % con esquinas redondeadas. Palabras clave en dorado #E7B676: "anticipo", "hoy", "Por cobrar", "AGENDA".',
      'Subtítulos: crema con sombra suave (sin contorno negro), máximo 2 líneas de 3–5 palabras.',
      'Pantalla de Pastelia: activa el modo oscuro (Mi negocio), "No molestar" y el brillo al máximo; graba con datos de ejemplo, no de clientas reales.',
      'Chats: tu propio WhatsApp con nombres y fotos difuminados (CapCut → Efectos → Desenfoque). No muestres conversaciones de clientas reales.',
      'Tarjeta final: usa la imagen de tarjeta final del kit (1080×1920), 3 s.'
    ],
    antes: [
      'La agenda no muestra el anticipo de cada pedido: el anticipo se anota en la cotización (paso "$ Total") y sale en el PDF. Por eso la escena 5 lo enseña ahí.',
      '"Por cobrar" suma el total de los pedidos que no has marcado como cobrados; no descuenta anticipos. No digas "lo que te falta cobrar".',
      'Faltan tus clips: libreta, chats difuminados, calculadora de noche, libreta cerrándose, página de receta y la grabación de pantalla en modo oscuro. Mándamelos y edito el Reel.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `¿Tu agenda de pedidos es una libreta… y el WhatsApp? 📒💬

Buscar el anticipo entre chats, no acordarte qué entregas hoy y cotizar con la calculadora a medianoche cansa más que hornear.

Ahora imagina tu día así: abres Pastelia y ahí está lo que entregas hoy y lo que tienes por cobrar. ¿Te piden un pastel? Lo cotizas ahí mismo: el precio sale solo y el anticipo queda anotado.

Y tu libreta vuelve a ser solo para tus recetas. 🍫

Comenta AGENDA y te mando el link.

${hashtags.instagram}`,
      tiktok: () => `Libreta + WhatsApp = pedidos regados 😵‍💫 Ahora imagina abrir una app y ver lo que entregas hoy y lo que tienes por cobrar. Comenta AGENDA y te mando el link. ${hashtags.tiktok}`,
      facebook: () => `¿Todavía llevas tus pedidos en la libreta y en los chats de WhatsApp?

El anticipo se pierde entre mensajes, se te olvida qué entregas hoy y las cuentas se hacen a medianoche.

Ahora imagina tu día así: abres Pastelia y ves lo que entregas hoy y lo que tienes por cobrar. Te piden un pastel y lo cotizas ahí mismo: el precio sale solo y el anticipo queda anotado. Y tu libreta vuelve a ser solo para tus recetas.

Comenta AGENDA y te mando el link.`
    }
  },

  // ─────────────────────────── CARRUSEL · OPCIÓN B ───────────────────────────
  {
    id: 'cB', tipo: 'carrusel', estructura: 'Problem-Proof', etiqueta: 'Opción B',
    titulo: '¿Y si tu competencia también cobra mal?',
    fecha: '2026-10-08', dia: 'Jueves 8 de octubre', hora: '12:30',
    redes: ['Instagram (carrusel)', 'Facebook (álbum)'], formato: '8 slides · 1080×1350 (4:5)',
    palabra: 'COSTEO',
    slides: [
      { tipo: 'portada', titulo: '¿Y si tu competencia también cobra mal?', destacado: ['cobra mal?'],
        visual: `${FONDO}. Dos pasteles de chocolate idénticos en bases doradas, cada uno con una etiqueta "$ ?" colgando; una cadena dorada une las etiquetas y cruza al slide 2. Titular crema arriba con "cobra mal?" en dorado.` },
      { titulo: 'Tú copias su precio.', texto: 'Ella copió el de otra. Y esa otra… lo sacó de quién sabe dónde.',
        loop: '¿Ves el problema?',
        visual: `${FONDO}. La cadena dorada sigue en diagonal con tres etiquetas colgando: "$ ?", "$ ??" y "$ ???", cada una más borrosa y apagada. La cadena cruza al slide 3.` },
      { titulo: 'Nadie en esa cadena conoce TU costo.', destacado: ['TU'], texto: 'Ni tu mantequilla, ni tu receta, ni tus horas.',
        loop: 'Entonces, ¿de dónde sale un precio justo?',
        visual: `${FONDO}. La cadena llega y se rompe al centro: un eslabón dorado abierto con destellos. "TU" en dorado dentro del titular.` },
      { titulo: 'De costear por gramo. Tu libreta no puede.', destacado: ['por gramo.'], texto: 'Mantequilla a $186 el kilo = $0.186 por gramo.',
        loop: 'Y eso cambia todo cuando…', nota: 'Precio de ejemplo',
        visual: `${FONDO}. Teléfono a la derecha con "Mis precios" (app en modo oscuro). Tarjeta flotante grande a la izquierda con la fila "Mantequilla $186 / 1000 g" y el costo "$0.186/g" encerrado en un aro dorado.` },
      { titulo: '…sube la mantequilla.', destacado: ['sube'], texto: 'Cambias su precio una vez y tus cotizaciones nuevas salen con el precio nuevo.',
        loop: 'Y con un pastel completo…',
        visual: `${FONDO}. Recorte real de la app: la tarjeta "Editar insumo" (modo oscuro) con Precio 186, Cantidad 1000 y métrica g; una flecha dorada señala el campo Precio. Flecha dorada hacia arriba junto a "sube".` },
      { titulo: 'Un Mediano de 20 porciones:', extra: ['Insumos $210', 'Mano de obra $180', 'Flores $120', 'Ganancia 40% $204', '$714'],
        loop: '¿Y la de enfrente?', nota: 'Ejemplo en pesos',
        visual: `${FONDO}. Cuatro tarjetas crema apiladas como ticket (montos en cacao; la ganancia en dorado) que suman hacia abajo hasta "$714" en oro grande. A la derecha, pastel de chocolate con hoja de oro.` },
      { tipo: 'prueba', titulo: 'Ya no importa: tu precio sale de tus números.', destacado: ['tus números.'], texto: 'Pastelia lo calcula mientras cotizas.',
        loop: '¿Y el tuyo?', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Teléfono a la derecha con la app en modo oscuro (paso Costeo) y tarjeta flotante a la izquierda con el "Resumen en vivo" ampliado ($714 · $35.70 por porción). El goteo del CTA asoma arriba a la derecha.` },
      { tipo: 'cta', titulo: 'Rompe la cadena hoy.', destacado: ['la cadena'], cta: 'Comenta COSTEO y te mando el link',
        visual: `${FONDO}. Goteo de chocolate arriba, eslabón dorado roto como ícono, titular crema y botón cacao con borde dorado: COSTEO en dorado.` }
    ],
    notas: [
      'No se compara con el precio de ninguna pastelería real: la "cadena" es una pregunta, no un dato.',
      '$186 el kilo de mantequilla es el precio de arranque de la app; $714 sale de calc() con los valores de ejemplo (insumos $210, mano de obra $180, flores $120, margen 40 %).',
      'Al cambiar el precio de un insumo en Mis precios, las cotizaciones nuevas de recetas con ingredientes lo usan. Los pedidos ya guardados no cambian.',
      'Las pantallas son capturas reales de la app en modo oscuro, con datos de ejemplo.'
    ],
    antes: [
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `¿Y si tu competencia también cobra mal? 🤔

Tú copias su precio. Ella copió el de otra. Y esa otra lo sacó de quién sabe dónde. Nadie en esa cadena conoce TU costo.

La cadena se rompe costeando por gramo: mantequilla a $186 el kilo = $0.186 por gramo. Cuando sube, cambias su precio una vez y tus cotizaciones nuevas ya salen con el precio nuevo.

Ejemplo (pastel Mediano, 20 porciones, en pesos): insumos $210 + mano de obra $180 + flores $120 + 40 % de ganancia = $714.

Comenta COSTEO y te mando el link.

${hashtags.instagram}`,
      facebook: () => `¿Sabes de dónde salió el precio que copiaste?

Tú copias el de la pastelería de enfrente. Ella copió el de otra. Y nadie en esa cadena conoce tu costo: ni tu mantequilla, ni tu receta, ni tus horas.

La salida es costear por gramo con tus precios. Ejemplo con los valores de Pastelia, en pesos: un pastel Mediano de 20 porciones sale en $714 (insumos $210, mano de obra $180, flores $120 y 40 % de ganancia).

Comenta COSTEO y te mando el link.`
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
        visual: 'Tarjeta final: fondo cacao con goteo de chocolate, logo de Pastelia y "Comenta COTIZA" con la palabra en dorado.',
        voz: 'Comenta COTIZA y te mando el link para probarla.',
        texto: 'Comenta COTIZA y te mando el link' }
    ],
    notas: [
      'El tiempo NO se inventa: escribe en el gancho, en el texto y en el caption exactamente lo que marque tu cronómetro.',
      'Opción A (recomendada): graba con otra cámara el celular con Pastelia y, al lado, un cronómetro físico o en otra pantalla, en una sola toma sin cortes.',
      'Opción B: grabación de pantalla continua (sin cortes) y en CapCut pones un cronómetro que arranca en el toque a "Cotizar" y se detiene cuando aparece el ticket en WhatsApp.',
      'Si tu tiempo real no cabe en ~40 s, acelera el video (x1.5 o x2) con el cronómetro dentro del cuadro y escribe "acelerado x2 · cronómetro real". Así el número sigue siendo real.',
      'Antes de grabar: "Mi negocio" con tu logo y el modo oscuro activado, al menos 1 receta guardada (sin receta no se puede cotizar) y tus insumos en "Mis precios". Eso no cuenta en el cronómetro; por eso se aclara en pantalla.',
      'Look cacao: celular sobre mesa oscura con una lámpara cálida; texto en pantalla en crema sobre barra cacao al 70 % y el tiempo en dorado.',
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

  // ─────────────────────────── CARRUSEL · OPCIÓN C ───────────────────────────
  {
    id: 'cC', tipo: 'carrusel', estructura: 'Story / Problem-Solution', etiqueta: 'Opción C',
    titulo: 'El mensaje que te arruina el sábado',
    fecha: '2026-10-10', dia: 'Sábado 10 de octubre', hora: '09:30',
    redes: ['Instagram (carrusel)', 'Facebook (álbum)'], formato: '8 slides · 1080×1350 (4:5)',
    palabra: 'ORDEN',
    slides: [
      { tipo: 'portada', titulo: 'El mensaje que te arruina el sábado', destacado: ['sábado'],
        visual: `${FONDO}. Teléfono con pantalla de bloqueo oscura y una notificación de mensaje genérica (vidrio esmerilado, sin logos y con el texto borroso) que brilla en dorado; el teléfono sale por abajo. Titular crema arriba con "sábado" en dorado.` },
      { titulo: 'Sábado, 10 de la mañana.', extra: ['¡Hola! ¿A qué hora paso por mi pastel?'], texto: 'Y en tu libreta… nada.',
        loop: '¿Dónde quedó ese pedido?',
        visual: `${FONDO}. El mensaje revelado en una burbuja de chat crema genérica (sin colores de WhatsApp). Debajo, la libreta abierta con páginas vacías y una lupa dorada buscando.` },
      { titulo: 'En un chat de hace semanas,', texto: 'entre audios, stickers y mensajes de todos tus clientes.',
        loop: 'Y el anticipo… ¿sí te lo dio?',
        visual: `${FONDO}. Cascada de burbujas de chat sin texto que se pierden hacia abajo; una de ellas con borde dorado y un alfiler dorado (el pedido perdido).` },
      { titulo: 'No es desorden tuyo.', destacado: ['tuyo.'], texto: 'Es que una libreta no te dice qué entregas hoy. Ni quién te debe.',
        loop: 'Pero hay una pantalla que sí…',
        visual: `${FONDO} en penumbra. La libreta cerrada a la izquierda; desde la derecha entra la luz dorada del teléfono del slide 5, que cruza el borde.` },
      { titulo: '…te lo muestra al abrirla:', texto: 'tus entregas de hoy, tu semana y lo que tienes por cobrar.',
        loop: '¿Y el anticipo?', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Teléfono con el Inicio de la app en modo oscuro entrando desde el slide 4. Tarjetas flotantes ampliadas: "2 entregas para hoy" y "Por cobrar", con borde dorado.` },
      { titulo: 'Queda anotado.', texto: 'En el pedido y en el PDF que le mandas a tu cliente.',
        loop: 'Ahora sí, el sábado…', nota: NOTA_CAPTURA,
        visual: `${FONDO}. Recorte real de la app (modo oscuro) con "Total $714 · Prepago (anticipo) 357 · Saldo por cobrar $357" y, debajo, en papel blanco, el recorte del PDF con las columnas PREPAGO $357 y PRECIO $714; sombras largas y filo dorado.` },
      { titulo: '…ese mensaje ya no da miedo.', extra: ['¡Hola! ¿A qué hora paso por mi pastel?', '¡Listo! Te espero a las 10.'],
        loop: '¿Quieres sábados así?',
        visual: `${FONDO}. La burbuja del cliente del slide 2 y, debajo, tu respuesta en una burbuja dorada. Abajo, pastel de chocolate listo sobre base dorada (placer visual).` },
      { tipo: 'cta', titulo: 'Ordena tus pedidos esta semana.', destacado: ['esta semana.'], cta: 'Comenta ORDEN y te mando el link',
        visual: `${FONDO}. Goteo de chocolate arriba, logo, titular crema con "esta semana." en dorado y botón cacao con borde dorado: ORDEN en dorado.` }
    ],
    notas: [
      'La escena del sábado es una dramatización de un caso común, no un dato ni el caso de una clienta real.',
      'La agenda no avisa con notificaciones: muestra tus entregas y tus cobros al abrir la app. Por eso el copy dice "te lo muestra al abrirla".',
      'Las burbujas de chat son genéricas (crema y dorado), sin la interfaz ni los colores de WhatsApp.',
      'Las pantallas son capturas reales de la app en modo oscuro, con datos de ejemplo.'
    ],
    antes: [
      '"Por cobrar" suma el total de los pedidos que no has marcado como cobrados; no descuenta anticipos.',
      'Publícalo en sábado: el gancho habla de ese día.',
      'Pega tu URL de prueba en la respuesta por DM (o usa la de lista de espera).'
    ],
    captions: {
      instagram: () => `El mensaje que te arruina el sábado: "¡Hola! ¿A qué hora paso por mi pastel?" 😰

…y el pedido no está en tu libreta. Está en un chat de hace semanas, entre audios y stickers. ¿Y el anticipo? Quién sabe.

No es desorden tuyo: una libreta no te dice qué entregas hoy ni quién te debe.

Pastelia sí: al abrirla ves tus entregas de hoy, tu semana y lo que tienes por cobrar. Y el anticipo queda anotado en el pedido y en el PDF que le mandas a tu cliente.

Comenta ORDEN y te mando el link.

${hashtags.instagram}`,
      facebook: () => `Sábado, 10 de la mañana: "¡Hola! ¿A qué hora paso por mi pastel?"

Y ese pedido no está en tu libreta. Está en un chat de hace semanas, entre audios y stickers.

No es desorden tuyo: una libreta no te dice qué entregas hoy ni quién te debe. En Pastelia, al abrir la app ves tus entregas de hoy, tu semana y lo que tienes por cobrar, y el anticipo queda anotado en el pedido y en el PDF.

Comenta ORDEN y te mando el link.`
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
