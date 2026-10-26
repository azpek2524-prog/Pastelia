// Abre Pastelia (index.html del repo) en un Chromium tamaño celular para grabar los reels.
// Igual que capturar-app.cjs: "modo local" (se bloquea el CDN de Firebase, la app usa localStorage),
// fecha fija (lunes 26 oct 2026) y datos de EJEMPLO sembrados (no son clientes reales).
//
// Agente IA (beta): su servidor (workers.dev) no es alcanzable desde el entorno de Claude. Si se pasa
// `agente`, esa función contesta las peticiones de la app a ese servidor con una llamada a la
// herramienta `crear_pedido_directo` SIN texto del modelo: lo que se ve en pantalla es la tarjeta
// "Confirma el pedido" y los mensajes que escribe la propia app.

const { routeFonts } = require('./navegador.cjs');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const HOST = 'http://pastelia.test';
const AGENTE_URL = 'https://pastelia-agent.azpek2524.workers.dev';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const FECHA_CAPTURA = '2026-10-26T09:30:41.527-06:00';

function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
// Totales con la misma fórmula de calc(): (insumos*mult + 180*mult + extras) * 1.40
function total(mult) { return Math.round((210 * mult + 180 * mult + 120) * 1.4); }

const LOGO_EJEMPLO = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="192" viewBox="0 0 240 192">'
  + '<rect x="4" y="4" width="232" height="184" rx="36" fill="#FFF4E6" stroke="#E7B676" stroke-width="6" stroke-dasharray="14 10"/>'
  + '<text x="120" y="96" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="40" fill="#7B5B4B">TU LOGO</text></svg>');

function seed(tema, color) {
  const hoy = new Date(2026, 9, 26), manana = new Date(2026, 9, 27), ayer = new Date(2026, 9, 25);
  const now = '2026-10-26T09:12:00';
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
    pastelia_theme: tema,
    pastelia_marca: JSON.stringify({ bakeryName: 'Tu pastelería', logoUrl: LOGO_EJEMPLO, primaryColor: color, telefono: '55 1234 5678', direccion: '', instagram: '', facebook: '' }),
    pastelia_recetas_seed_cleared: '1',
    // Receta sin lista de ingredientes: la app usa su costo base de insumos ($210 en Mediano).
    pastelia_recetas: JSON.stringify([{ id: 'rec_demo', nombre: 'Chocolate', grad: 'linear-gradient(135deg,#F3D9B0,#7B5B4B)', forma: 'Redondo', saborPan: 'Chocolate', rellenos: ['Ganache'], cobertura: 'Buttercream', detallesDiseno: '', ingredientesLista: [], insumos: 0, ingredientes: 0, precioPorcion: 0, photoBase64: '' }]),
    pastelia_pedidos: JSON.stringify(pedidos)
  };
}

// Toques visibles: un círculo crema con borde dorado donde se toca la pantalla (como "Mostrar toques" de Android).
const TOQUES = `
  window.__toque = (x, y) => {
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;z-index:2147483647;pointer-events:none;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;'
      + 'background:rgba(255,244,230,.38);border:2px solid rgba(231,182,118,.95);box-shadow:0 0 18px rgba(231,182,118,.6);'
      + 'left:' + x + 'px;top:' + y + 'px;transform:scale(.55);opacity:1;transition:transform .42s cubic-bezier(.2,.8,.2,1),opacity .5s ease .18s';
    document.documentElement.appendChild(d);
    requestAnimationFrame(() => requestAnimationFrame(() => { d.style.transform = 'scale(1)'; d.style.opacity = '0'; }));
    setTimeout(() => d.remove(), 900);
  };`;

// `ruta`: página que se abre (por defecto la app). `rutas(ctx)`: rutas extra del servidor local (p. ej. el escenario de los reels).
async function abrirApp(browser, { width = 360, height = 640, dsf = 3, tema = 'dark', color = '#7B5B4B', agente = null, ruta = '/index.html', rutas = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dsf, locale: 'es-MX', timezoneId: 'America/Mexico_City', isMobile: true, hasTouch: true, colorScheme: tema });
  await ctx.clock.setFixedTime(new Date(FECHA_CAPTURA));
  await ctx.addInitScript((d) => {
    if (!sessionStorage.getItem('__seeded')) { for (const k in d) localStorage.setItem(k, d[k]); sessionStorage.setItem('__seeded', '1'); }
    window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; };
    window.print = () => { window.__printed = true; };
    try { navigator.clipboard.writeText = async () => {}; } catch (e) {}
  }, seed(tema, color));
  await ctx.addInitScript(TOQUES);
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
  if (agente) {
    await ctx.route((url) => url.href.startsWith(AGENTE_URL), async (route) => {
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } });
      const cuerpo = JSON.parse(route.request().postData() || '{}');
      const respuesta = await agente(cuerpo);
      await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(respuesta) });
    });
  }
  if (rutas) await rutas(ctx);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(HOST + ruta, { waitUntil: 'networkidle' });
  await page.evaluate(() => Promise.all([document.fonts.ready, document.fonts.load('600 20px Fredoka'), document.fonts.load('700 20px Nunito')]));
  await page.waitForTimeout(500);
  return { ctx, page };
}

module.exports = { abrirApp, HOST, ROOT, AGENTE_URL, FECHA_CAPTURA };
