// Captura pantallas reales de Pastelia (index.html del repo) en un Chromium tamaño celular.
// La app corre en "modo local": se bloquea el CDN de Firebase, así no pide inicio de sesión
// y usa localStorage. Los datos se siembran como EJEMPLO (no son clientes reales).
//
// Uso (desde la raíz del repo):
//   node marketing/2026-10-organizacion-costeo/herramientas/capturar-app.cjs
// Salida: marketing/2026-10-organizacion-costeo/capturas/*.png y ticket-whatsapp.txt

const { launch, routeFonts } = require('./navegador.cjs');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
// PASTELIA_COLOR: color de marca de "Mi negocio" (la app deja elegir cualquiera). PASTELIA_OUT: carpeta de salida.
// PASTELIA_TEMA: "dark" (por defecto, el modo oscuro de la app: va con el look cacao del marketing) o "light".
const COLOR = process.env.PASTELIA_COLOR || '#7B5B4B';
const TEMA = process.env.PASTELIA_TEMA === 'light' ? 'light' : 'dark';
const OUT = process.env.PASTELIA_OUT ? path.resolve(process.env.PASTELIA_OUT) : path.resolve(__dirname, '../capturas');
const HOST = 'http://pastelia.test';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

// Totales calculados con la misma fórmula de calc(): (insumos*mult + 180*mult + extras) * 1.40
function total(mult) { return Math.round((210 * mult + 180 * mult + 120) * 1.4); }

// Fecha fija de la captura (lunes 5 oct 2026, 9:30 a. m. en CDMX) para que "hoy" cuadre con los pedidos.
const FECHA_CAPTURA = '2026-10-05T09:30:41.527-06:00';

// Logo genérico para mostrar dónde va TU logo en el PDF (no es marca de nadie).
const LOGO_EJEMPLO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="192" viewBox="0 0 240 192">'
  + '<rect x="4" y="4" width="232" height="184" rx="36" fill="#FFF4E6" stroke="#E7B676" stroke-width="6" stroke-dasharray="14 10"/>'
  + '<text x="120" y="96" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="40" fill="#7B5B4B">TU LOGO</text></svg>');

function seed() {
  const hoy = new Date(2026, 9, 5), manana = new Date(2026, 9, 6), ayer = new Date(2026, 9, 4);
  const now = '2026-10-05T09:12:00';
  const base = { telefono: '', tipoEntrega: 'recoge', direccion: '', invitados: 0, modo: 'receta', recetaId: 'rec_demo', receta: 'Chocolate',
    forma: 'Redondo', saborPan: 'Chocolate', rellenos: ['Ganache'], cobertura: 'Buttercream', detallesDiseno: '', mensajePastel: '', alergias: '',
    imagenRef: '', photo: '', ingredientes: [], extras: ['Flores'], envio: 0, creado: now, fechaPedido: iso(hoy) };
  const pedidos = [
    { ...base, id: 1001, cliente: 'Cliente ejemplo A', fechaEvento: iso(hoy), tamano: 'Mediano', porciones: 20, precio: total(1), prepago: 357, total: total(1), estado: 'Cotizado', pagado: false },
    { ...base, id: 1002, cliente: 'Cliente ejemplo B', fechaEvento: iso(hoy), tamano: 'Chico', porciones: 13, precio: total(0.65), prepago: 0, total: total(0.65), estado: 'Cotizado', pagado: false },
    { ...base, id: 1003, cliente: 'Cliente ejemplo C', fechaEvento: iso(manana), tamano: 'Grande', porciones: 28, precio: total(1.45), prepago: 480, total: total(1.45), estado: 'Cotizado', pagado: false },
    { ...base, id: 1004, cliente: 'Cliente ejemplo D', fechaEvento: iso(ayer), tamano: 'Petit', porciones: 9, precio: total(0.45), prepago: 0, total: total(0.45), estado: 'Entregado', pagado: true }
  ];
  return {
    pastelia_theme: TEMA,
    pastelia_marca: JSON.stringify({ bakeryName: 'Tu pastelería', logoUrl: LOGO_EJEMPLO, primaryColor: COLOR, telefono: '55 1234 5678', direccion: '', instagram: '', facebook: '' }),
    pastelia_recetas_seed_cleared: '1',
    // Receta sin lista de ingredientes: la app usa su costo base de insumos ($210 en Mediano).
    pastelia_recetas: JSON.stringify([{ id: 'rec_demo', nombre: 'Chocolate', grad: 'linear-gradient(135deg,#F3D9B0,#7B5B4B)', forma: 'Redondo', saborPan: 'Chocolate', rellenos: ['Ganache'], cobertura: 'Buttercream', detallesDiseno: '', ingredientesLista: [], insumos: 0, ingredientes: 0, precioPorcion: 0, photoBase64: '' }]),
    pastelia_pedidos: JSON.stringify(pedidos)
  };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, locale: 'es-MX', timezoneId: 'America/Mexico_City', isMobile: true, hasTouch: true, colorScheme: TEMA });
  await ctx.clock.setFixedTime(new Date(FECHA_CAPTURA));
  const data = seed();
  await ctx.addInitScript((d) => {
    if (!sessionStorage.getItem('__seeded')) { for (const k in d) localStorage.setItem(k, d[k]); sessionStorage.setItem('__seeded', '1'); }
    window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; };
    window.print = () => { window.__printed = true; };
    try { navigator.clipboard.writeText = async () => {}; } catch (e) {}
  }, data);
  await ctx.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.includes('gstatic.com/firebasejs')) return route.abort();           // sin Firebase => modo local
    if (url.startsWith(HOST)) {
      let p = decodeURIComponent(new URL(url).pathname); if (p === '/') p = '/index.html';
      const file = path.join(ROOT, p);
      if (fs.existsSync(file)) return route.fulfill({ status: 200, contentType: MIME[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
      return route.fulfill({ status: 404, body: '' });
    }
    return route.abort();
  });
  await routeFonts(ctx);                                                          // Fredoka y Nunito (Google Fonts)
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(HOST + '/index.html', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([document.fonts.load('600 20px Fredoka'), document.fonts.load('700 20px Nunito')]));
  const fuentes = await page.evaluate(() => [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))]);
  console.log('Fuentes cargadas:', fuentes);
  await page.waitForTimeout(600);

  const M = '#mobile ';
  const click = (sel) => page.evaluate((s) => { const el = document.querySelector(s); if (!el) throw new Error('no ' + s); el.click(); }, sel);
  const shot = async (name, sel) => {
    await page.waitForTimeout(350);
    if (sel) await page.locator(sel).first().screenshot({ path: path.join(OUT, name) });
    else await page.screenshot({ path: path.join(OUT, name) });
    console.log('ok', name);
  };
  const fill = async (field, value) => {
    const loc = page.locator(M + '[data-field="' + field + '"]').first();
    await loc.fill(String(value));
  };

  // 1) Inicio: entregas de hoy, por cobrar, semana
  await click(M + '[data-nav="inicio"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('01-inicio.png');

  // 2) Agenda
  await click(M + '[data-nav="agenda"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('02-agenda.png');

  // 2b) Mis precios (insumos de arranque de la app: costo por gramo o pieza)
  await click(M + '.pane[data-scr="mi-negocio"] [data-go="precios"], ' + M + '[data-go="precios"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('02b-mis-precios.png');

  // 2c) Editor de un insumo (la app pide precio, cantidad y unidad, y calcula el costo por gramo)
  await click(M + '[data-insumo="ins_mant"]');
  await page.waitForTimeout(300);
  await shot('11-editar-insumo.png');
  await page.evaluate(() => { const ov = [...document.querySelectorAll('body > div')].find((d) => d.style.zIndex === '9998'); ov.firstElementChild.setAttribute('data-cap', 'modal'); });
  await shot('11b-editar-insumo-tarjeta.png', '[data-cap="modal"]');
  await page.keyboard.press('Escape');

  // 3) Cotizador — paso 1: cliente
  await click(M + '[data-go="cotizar"]');
  await fill('nombre', 'Cliente de ejemplo');
  await fill('tel', '55 1234 5678');
  await fill('invitados', 20);
  await fill('fecha', '2026-10-17');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await shot('03-cotizar-paso1-cliente.png');

  // 4) Paso 2: pastel (receta, Mediano 20p, flores)
  await click(M + '[data-step-chip="2"]');
  await click(M + '[data-fchip="size"][data-val="Mediano"]');
  await fill('mensajePastel', 'Feliz cumpleaños');
  await fill('alergias', 'Sin nuez');
  await shot('04-cotizar-paso2-pastel.png');
  await page.locator(M + '[data-fchip="extra"]').first().scrollIntoViewIfNeeded();
  await shot('05-cotizar-paso2-extras.png');

  // 5) Paso 3: costeo + resumen en vivo
  await click(M + '[data-step-chip="3"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('06-cotizar-paso3-costeo.png');
  const panel = M + '.pane[data-scr="cotizar"] [data-action="guardar"]';
  await page.evaluate((s) => { document.querySelector(s).closest('div[style*="linear-gradient"]').setAttribute('data-cap', 'resumen'); }, panel);
  await shot('07-resumen-en-vivo.png', M + '[data-cap="resumen"]');

  // 6) Paso 4: total, anticipo y saldo
  await click(M + '[data-step-chip="4"]');
  await fill('prepago', 357);
  await page.locator(M + '[data-field="prepago"]').first().dispatchEvent('input');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot('08-cotizar-paso4-total.png');
  await page.evaluate(() => { const c = document.querySelector('#mobile [data-sum-saldo]').closest('div[style*="border-radius:24px"]'); c.setAttribute('data-cap', 'total'); });
  await shot('09-resumen-pedido-anticipo.png', M + '[data-cap="total"]');

  // 7) Ticket de WhatsApp (se captura el texto que la app abre en wa.me)
  await click(M + '.pane[data-scr="cotizar"] [data-action="ticket"]');
  const opened = await page.evaluate(() => window.__opened.slice(-1)[0] || '');
  const txt = decodeURIComponent((opened.split('text=')[1] || ''));
  fs.writeFileSync(path.join(OUT, 'ticket-whatsapp.txt'), txt + '\n');
  console.log('ticket:', txt);

  // 8) PDF (comprobante): se pinta el contenido de impresión y se captura con media=print
  await click(M + '.pane[data-scr="cotizar"] [data-action="pdf"]');
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 820, height: 1100 });
  await page.waitForTimeout(500);
  await page.locator('#pastelia-print').screenshot({ path: path.join(OUT, '10-pdf-comprobante.png') });
  console.log('ok 10-pdf-comprobante.png');
  await page.emulateMedia({ media: 'screen' });

  await browser.close();
})();
