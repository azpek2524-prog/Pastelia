// Reels en MP4 (9:16 · 1080×1920 · 30 fps) hechos con la app REAL.
// Pastelia (index.html del repo) corre en un iframe de 360×640 dentro de un "escenario" de 1080×1920.
// Cada cuadro se arma con la app (la cámara la acerca o la mueve), los textos de marca del storyboard,
// los subtítulos (los mismos .srt del kit) y los toques en pantalla; se captura y ffmpeg lo convierte en
// MP4 con una pista de audio en silencio (la música o tu voz se ponen al publicar o en CapCut).
//
// Nada de pasteles hechos con IA. En r2 el servidor del Agente IA no es alcanzable desde el entorno de
// Claude: su respuesta se reproduce con el código de la propia app (app-local.cjs), sin textos del modelo.
//
// Uso (desde la raíz del repo):
//   node marketing/2026-10-arranque-instagram/herramientas/reels.cjs                 # los 4 reels
//   node marketing/2026-10-arranque-instagram/herramientas/reels.cjs r1-A r2-B       # algunos
//   node marketing/2026-10-arranque-instagram/herramientas/reels.cjs r1-A --muestras # cuadros sueltos (PNG) para revisar
// Salida: salida/<semana>/01-Reel-Cotizacion/r1-reel-A.mp4, r1-reel-B-prueba.mp4 (y lo mismo de r2 en 04-Reel-Agente-IA).

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { launch } = require('./navegador.cjs');
const { abrirApp, HOST } = require('./app-local.cjs');
const C = require('../contenido.cjs');
const { escenasDe, SALIDA, CAP, D, CSS_SB, overlayHTML, ilustracion } = require('./generar.cjs');
const { FUENTES, EJEMPLO } = require('./diseno-cacao.cjs');

const BASE = path.resolve(__dirname, '..');
const FPS = 30, W = 1080, H = 1920, ESC = 3;           // la app mide 360×640: ×3 llena el cuadro
const M = '#mobile ';
const CAM0 = { z: 0.86, fx: 180, fy: 0, ty: 450 };     // encuadre base: la app flota debajo del texto, sobre el fondo cacao
const MUESTRAS = process.argv.includes('--muestras');

const suave = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const entre = (a, b, u) => a + (b - a) * u;
const seg = (s) => { const [h, m, r] = s.trim().split(':'); const [ss, ms] = r.split(','); return +h * 3600 + +m * 60 + +ss + +ms / 1000; };
function leerSRT(f) {
  return fs.readFileSync(f, 'utf8').trim().split(/\n\s*\n/).map((b) => {
    const l = b.split('\n'); const [a, z] = l[1].split(' --> ').map(seg);
    return { a, z, texto: l.slice(2).join('\n') };
  });
}

// ─────────────────────────── Escenario ───────────────────────────
const REBOBINAR = '<svg width="260" height="260" viewBox="0 0 24 24" fill="#E7B676" style="filter:drop-shadow(0 0 30px rgba(231,182,118,.7))"><path d="M11 6v12L2.5 12z"/><path d="M21.5 6v12L13 12z"/></svg>';
function escenarioHTML() {
  const textos = CSS_SB.split('\n').filter((l) => /^\.(overlay|sub|sombra|mesa)\b/.test(l)).join('\n');
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=${W}, initial-scale=1">${FUENTES}
<style>${D.css}
${textos}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#140D09}
#cuadro{position:absolute;inset:0;overflow:hidden;background:radial-gradient(120% 70% at 50% 42%,#2E1F16 0%,#1C130E 48%,#120C08 100%)}
#brillo{position:absolute;left:-200px;top:240px;width:1480px;height:1480px;border-radius:50%;background:radial-gradient(circle,rgba(123,91,75,.5) 0%,rgba(0,0,0,0) 66%)}
#cam{position:absolute;left:0;top:0;width:360px;height:640px;transform-origin:0 0;z-index:2;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1.2px rgba(231,182,118,.55),0 0 36px rgba(231,182,118,.28),0 28px 60px rgba(0,0,0,.65)}
#app{width:360px;height:640px;border:0;display:block;background:#1C130E}
.sub span{background:rgba(14,9,7,.8);-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:.05em .34em;border-radius:.28em}
.sub{line-height:1.42}
#ilus{position:absolute;inset:0;z-index:6;display:none;overflow:hidden;background:radial-gradient(120% 60% at 50% 40%,#2A1C14 0%,#1C130E 46%,#120C08 100%)}
#ilus .escena{position:absolute;inset:0;transform-origin:50% 56%}
#ilus img.fin{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:50% 45%}
#velo{position:absolute;inset:0;z-index:7;opacity:0;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(180deg,rgba(255,244,230,.06) 0 3px,rgba(0,0,0,0) 3px 10px),rgba(14,9,7,.58)}
#titulo{transition:none}
#nota{position:absolute;left:0;right:0;top:1190px;z-index:13;display:flex;justify-content:center;opacity:0}
#nota .ejemplo{margin:0;font-size:30px;background:rgba(20,13,9,.82)}
#toques{position:absolute;inset:0;z-index:12;pointer-events:none}
#toques i{position:absolute;width:150px;height:150px;margin:-75px 0 0 -75px;border-radius:50%;background:rgba(255,244,230,.28);border:6px solid rgba(231,182,118,.95);box-shadow:0 0 50px rgba(231,182,118,.6)}
</style></head><body><div id="cuadro"><div id="brillo"></div>
<div id="cam"><iframe id="app" src="/index.html"></iframe></div>
<div id="ilus"></div>
<div id="velo">${REBOBINAR}</div>
<div class="overlay" id="titulo"></div>
<div id="nota">${D.notaHTML(EJEMPLO)}</div>
<div class="sub" id="sub"></div>
<div id="toques"></div>
</div>
<script>
const $ = (s) => document.querySelector(s);
const suave = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
let antes = {};
// Animaciones de las ilustraciones (p: avance 0–1 del tramo; t: segundos desde que empezó)
const ANIMA = {
  libreta(el, p, t) {
    el.querySelector('.escena').style.transform = 'scale(' + (1 + 0.06 * p) + ')';
    const trazo = el.querySelector('.trazo path');
    if (trazo) { trazo.style.strokeDasharray = 470; trazo.style.strokeDashoffset = 470 * (1 - suave((t - 0.2) / 0.55)); }
  },
  noche(el, p, t) {
    el.querySelector('.escena').style.transform = 'scale(' + (1 + 0.05 * p) + ')';
    const tel = el.querySelector('.tel'); const e = 0.55 + 0.45 * suave(t / 0.4);
    if (tel) { tel.style.opacity = e; tel.style.translate = '0 ' + Math.round(60 * (1 - e)) + 'px'; }
  },
  tarjeta(el, p, t) {
    const img = el.querySelector('img.fin');
    img.style.opacity = suave(t / 0.3); img.style.transform = 'scale(' + (1 + 0.04 * p) + ')';
  }
};
window.E = { aplicar(s) {
  if (s.cam !== antes.cam) $('#cam').style.transform = s.cam;
  if (s.filtro !== antes.filtro) $('#cam').style.filter = s.filtro;
  const il = $('#ilus');
  if (s.ilus) {
    if (s.ilus.html != null) { il.innerHTML = s.ilus.html; il.style.background = s.ilus.tipo === 'tarjeta' ? 'transparent' : ''; }
    il.style.display = 'block';
    ANIMA[s.ilus.tipo](il, s.ilus.p, s.ilus.t);
  } else if (antes.ilus) il.style.display = 'none';
  $('#velo').style.opacity = s.velo;
  $('#velo').style.transform = 'translateY(' + s.veloDy + 'px)';
  const ti = $('#titulo');
  if (s.titulo.html !== antes.tituloHtml) ti.innerHTML = s.titulo.html;
  ti.style.opacity = s.titulo.o; ti.style.transform = 'translateY(' + s.titulo.dy + 'px)';
  const sub = $('#sub');
  if (s.sub.texto !== antes.subTexto) sub.innerHTML = s.sub.texto;
  sub.style.opacity = s.sub.o; sub.style.transform = 'scale(' + s.sub.e + ')';
  $('#nota').style.opacity = s.nota;
  $('#toques').innerHTML = s.toques.map((q) => '<i style="left:' + q.x + 'px;top:' + q.y + 'px;opacity:' + q.o + ';transform:scale(' + q.e + ')"></i>').join('');
  antes = { cam: s.cam, filtro: s.filtro, ilus: !!s.ilus, tituloHtml: s.titulo.html, subTexto: s.sub.texto };
} };
</script></body></html>`;
}

// Ayudas dentro de la app (iframe): buscar elementos visibles, hojas de texto y el contenedor que se desplaza.
const AYUDAS = () => {
  const visible = (e) => e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  window.__el = (sel, texto) => [...document.querySelectorAll(sel)].find((e) => visible(e) && (!texto || e.textContent.includes(texto)));
  // Elemento más chico cuyo texto propio empieza con `texto` (n: cuál de los visibles).
  // n < 0 cuenta desde el final (-1: el último visible).
  window.__hoja = (texto, n = 0) => {
    const t = texto.toLowerCase();
    const l = [...document.querySelectorAll('#mobile *')].filter((e) => visible(e) && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim().toLowerCase().startsWith(t)));
    return n < 0 ? l[l.length + n] : l[n];
  };
  window.__scr = () => [...document.querySelectorAll('#mobile .scr')].find((e) => visible(e));
  window.__rect = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, top: r.top, bottom: r.bottom, h: r.height }; };
};

// ─────────────────────────── Línea de tiempo ───────────────────────────
// Un reel = eventos de la app (tocar, escribir, desplazar), movimientos de cámara, ilustraciones y textos.
const ev = (t, f) => ({ t, f });
// objetivo: { sel, texto } | { hoja, n }
const buscar = (o) => (o.hoja != null ? `__hoja(${JSON.stringify(o.hoja)}, ${o.n || 0})` : `__el(${JSON.stringify(o.sel)}, ${JSON.stringify(o.texto || '')})`);
function tocar(t, o, { marca = true } = {}) {
  return [ev(t, async (A) => {
    const r = await A.app.evaluate(`__rect(${buscar(o)})`);
    if (!r) throw new Error('No encontré ' + JSON.stringify(o));
    if (marca) A.toques.push({ t: A.t, x: r.x, y: r.y });
    await A.app.evaluate(`(${buscar(o)}).click()`);
  })];
}
function escribir(t, o, texto, cps = 15) {
  const evs = [...tocar(t, o), ev(t + 0.01, (A) => A.app.evaluate(`(${buscar(o)}).focus()`))];
  [...texto].forEach((ch, i) => evs.push(ev(t + 0.12 + i / cps, (A) => A.page.keyboard.type(ch))));
  return evs;
}
const llenar = (t, sel, valor) => [ev(t, async (A) => { const l = A.app.locator(sel).first(); await l.fill(valor); await l.evaluate((e) => e.blur()); })];
const soltarAgente = (t) => [ev(t, (A) => A.soltar())];
// Desplazamiento del contenedor .scr: hasta `y` (px) o hasta dejar un elemento a `margen` px del borde superior.
function desplazar(t0, t1, destino) {
  return [ev(t0, async (A) => {
    const ini = await A.app.evaluate('__scr() ? __scr().scrollTop : 0');
    let fin = destino.y;
    if (fin == null) fin = await A.app.evaluate(`(() => { const s = __scr(), e = ${buscar(destino)}; return s.scrollTop + e.getBoundingClientRect().top - s.getBoundingClientRect().top - ${destino.margen || 0}; })()`);
    A.scrolls.push({ t0, t1, ini, fin });
  })];
}
// Cámara: { z, fy, ty } o { z, foco: objetivo, ty }; fx se toma del foco (o 180).
const cam = (t0, t1, fin) => ({ t0, t1, fin });

function encuadre(c) {
  const S = ESC * c.z, ancho = 360 * S;
  let tx;
  if (ancho <= W) tx = (W - ancho) / 2 + S * c.fx;
  else { tx = W / 2; const izq = tx - S * c.fx; if (izq > 0) tx -= izq; if (izq + ancho < W) tx += W - (izq + ancho); }
  return { S, x0: tx - S * c.fx, y0: c.ty - S * c.fy };
}
const camCSS = (c) => { const e = encuadre(c); return `translate(${e.x0.toFixed(2)}px,${e.y0.toFixed(2)}px) scale(${e.S.toFixed(4)})`; };
function camaraEn(movs, t) {
  let cur = { ...CAM0 };
  for (const m of movs) {
    if (m.t0 > t || !m.res) break;
    const u = m.t1 > m.t0 ? suave((t - m.t0) / (m.t1 - m.t0)) : 1;
    const ini = cur;
    cur = { z: entre(ini.z, m.res.z, u), fx: entre(ini.fx, m.res.fx, u), fy: entre(ini.fy, m.res.fy, u), ty: entre(ini.ty, m.res.ty, u) };
    if (t < m.t1) break;
  }
  return cur;
}

// ─────────────────────────── Los 4 reels ───────────────────────────
const pieza = (id) => C.piezas.find((p) => p.id === id);
const nombres = { A: 'reel-A', B: 'reel-B-prueba' };
const ENC = {
  // Lo importante queda entre el texto de arriba (y≈250–430) y los subtítulos (y≈1270–1390).
  chat: { z: 1.0, fx: 180, fy: 500, ty: 1000 },   // últimos mensajes y la caja de texto del Agente IA
  nav: { z: 0.86, fx: 180, fy: 640, ty: 1400 },   // barra de abajo de la app (Inicio, Agenda, Agente IA)
  enviado: { z: 1.0, fx: 180, foco: { hoja: 'Pastel para 20 personas' }, ty: 700 },   // el mensaje enviado y lo que llega abajo
  tarjeta: { z: 0.95, fx: 180, foco: { hoja: 'Confirma el pedido' }, fyMas: 110, ty: 840 },   // "Confirma el pedido" completa
};

function cuerpoR1() {
  return {
    eventos: [
      ...tocar(9.3, { sel: M + '[data-step-chip="2"]' }),
      ...desplazar(11.0, 11.7, { hoja: 'Tamaño', margen: 12 }),
      ...tocar(12.1, { sel: M + '[data-fchip="size"][data-val="Mediano"]' }),
      ...desplazar(12.6, 13.2, { hoja: 'Extras de diseño', margen: 12 }),
      ...tocar(13.5, { sel: M + '[data-fchip="extra"]', texto: 'Flores' }),
      ...tocar(15.2, { sel: M + '[data-step-chip="3"]' }),
      ...desplazar(15.25, 15.3, { y: 0 }),
      ...desplazar(22.0, 22.6, { hoja: 'Resumen en vivo', n: -1, margen: 4 }),
    ],
    camara: [
      cam(9.0, 9.4, { ...CAM0 }),
      cam(9.9, 10.7, { z: 1.0, fx: 180, foco: { hoja: 'Chocolate' }, ty: 760 }),
      cam(10.9, 11.4, { ...CAM0 }),
      cam(13.7, 14.6, { z: 1.0, fx: 180, foco: { hoja: 'Extras (flores)' }, ty: 900 }),
      cam(15.0, 15.3, { ...CAM0 }),
      cam(16.0, 19.4, { z: 1.08, fx: 180, foco: { hoja: 'Mano de obra' }, ty: 860 }),
      cam(22.0, 22.4, { ...CAM0 }),
      cam(22.6, 23.8, { z: 1.0, fx: 180, foco: { hoja: '$714', n: -1 }, ty: 860 }),
    ],
  };
}
function cuerpoR2() {
  const ENTRADA = { sel: M + '[data-agent-input]' };
  return {
    eventos: [
      ...escribir(9.5, ENTRADA, 'Para Cliente de ejemplo, el 7 de noviembre, de chocolate con flores', 19),
      ...tocar(13.6, { sel: M + '[data-agent-send]' }),
      ...soltarAgente(14.7),
      ...tocar(22.3, { sel: M + '[data-agent-confirm]' }),
      ...tocar(23.55, { sel: M + '[data-nav="agenda"]' }),
      ...desplazar(23.9, 24.5, { hoja: 'Cliente de ejemplo', margen: 70 }),
      ...tocar(26.2, { sel: M + '[data-nav="agente"]' }),
    ],
    camara: [
      cam(9.0, 9.3, ENC.chat),
      cam(13.7, 14.2, { z: 1.0, fx: 180, foco: { hoja: 'Para Cliente de ejemplo' }, ty: 640 }),
      cam(15.0, 15.6, ENC.tarjeta),
      cam(17.0, 19.6, { z: 1.3, fx: 210, foco: { hoja: 'Precio estimado' }, ty: 900 }),
      cam(20.4, 21.4, ENC.tarjeta),
      cam(23.2, 23.5, ENC.nav),
      cam(23.8, 24.2, { ...CAM0 }),
      cam(24.5, 25.6, { z: 1.0, fx: 180, foco: { hoja: 'Cliente de ejemplo' }, ty: 800 }),
      cam(25.8, 26.1, ENC.nav),
      cam(26.4, 27.4, { z: 1.4, fx: 165, foco: { hoja: 'Tu asistente de cotización' }, ty: 700 }),
    ],
  };
}

const REELS = {
  'r1-A': () => {
    const c = cuerpoR1(), N = { sel: M + '[data-field="nombre"]' }, I = { sel: M + '[data-field="invitados"]' };
    return {
      pieza: 'r1', variante: 'A', duracion: 31,
      preparar: prepararR1(false),
      ilus: [{ desde: 0, hasta: 1.5, tipo: 'libreta' }, { desde: 27, hasta: 31, tipo: 'tarjeta' }],
      eventos: [
        ...escribir(3.3, N, 'Cliente de ejemplo', 15),
        ...escribir(5.0, I, '20', 8),
        ...tocar(5.8, { sel: M + '[data-field="fecha"]' }), ...llenar(5.95, M + '[data-field="fecha"]', '2026-11-07'),
        ...c.eventos,
      ],
      camara: [
        cam(1.5, 3.0, { z: 0.9, fx: 180, fy: 0, ty: 450 }),
        cam(3.0, 3.3, { ...CAM0 }),
        cam(5.3, 5.7, { z: 0.86, fx: 180, fy: 0, ty: 300 }),
        cam(6.6, 8.4, { z: 1.05, foco: I, ty: 820 }),
        ...c.camara,
      ],
    };
  },
  'r1-B': () => {
    const c = cuerpoR1(), N = { sel: M + '[data-field="nombre"]' }, I = { sel: M + '[data-field="invitados"]' };
    return {
      pieza: 'r1', variante: 'B', duracion: 31,
      preparar: prepararR1(true),
      ilus: [{ desde: 27, hasta: 31, tipo: 'tarjeta' }],
      velo: [3.0, 4.2],
      eventos: [
        // "Rebobinar": la app regresa por sus pantallas y queda una cotización nueva, en blanco.
        ...tocar(3.15, { sel: M + '[data-step-chip="2"]' }, { marca: false }),
        ...tocar(3.3, { sel: M + '[data-fchip="extra"]', texto: 'Flores' }, { marca: false }),
        ...tocar(3.45, { sel: M + '[data-step-chip="1"]' }, { marca: false }),
        ...llenar(3.55, M + '[data-field="nombre"]', ''), ...llenar(3.56, M + '[data-field="invitados"]', ''), ...llenar(3.57, M + '[data-field="fecha"]', ''),
        ...tocar(3.75, { sel: M + '[data-nav="inicio"]' }, { marca: false }),
        ...tocar(4.6, { sel: M + '[data-go="cotizar"]', texto: 'Cotizar' }),
        ...escribir(5.2, N, 'Cliente de ejemplo', 16),
        ...escribir(6.8, I, '20', 8),
        ...tocar(7.4, { sel: M + '[data-field="fecha"]' }), ...llenar(7.55, M + '[data-field="fecha"]', '2026-11-07'),
        ...c.eventos,
      ],
      camara: [
        cam(0.0, 0.0, { z: 1.0, fx: 180, foco: { hoja: 'Resumen en vivo', n: -1 }, fyMas: 125, ty: 850 }),
        cam(0.5, 1.4, { z: 1.12, fx: 170, foco: { hoja: '$35.70' }, ty: 880 }),
        cam(3.0, 3.0, { ...CAM0 }),
        cam(6.9, 7.3, { z: 0.86, fx: 180, fy: 0, ty: 300 }),
        cam(7.8, 8.7, { z: 1.05, foco: I, ty: 820 }),
        ...c.camara,
      ],
    };
  },
  'r2-A': () => {
    const c = cuerpoR2(), ENTRADA = { sel: M + '[data-agent-input]' };
    return {
      pieza: 'r2', variante: 'A', duracion: 32, agente: true,
      preparar: async (A) => { await A.app.evaluate(`__el(${JSON.stringify(M + '[data-nav="agente"]')}).click()`); await A.esperar(400); },
      ilus: [{ desde: 29, hasta: 32, tipo: 'tarjeta' }],
      nota: [[15, 22.3]],
      eventos: [
        ...escribir(0.3, ENTRADA, 'Pastel para 20 personas', 15),
        ...tocar(2.25, { sel: M + '[data-agent-send]' }),
        ...soltarAgente(4.0),
        ...c.eventos,
      ],
      camara: [
        cam(0, 0, ENC.chat),
        cam(2.35, 2.8, ENC.enviado),
        cam(4.4, 8.6, { z: 1.08, fx: 180, foco: { hoja: 'Para registrar el pedido' }, ty: 820 }),
        ...c.camara,
      ],
    };
  },
  'r2-B': () => {
    const c = cuerpoR2(), ENTRADA = { sel: M + '[data-agent-input]' };
    return {
      pieza: 'r2', variante: 'B', duracion: 32, agente: true,
      preparar: async () => {},
      ilus: [{ desde: 0, hasta: 3, tipo: 'noche' }, { desde: 29, hasta: 32, tipo: 'tarjeta' }],
      nota: [[15, 22.3]],
      eventos: [
        ...tocar(3.4, { sel: M + '[data-nav="agente"]' }),
        ...escribir(4.4, ENTRADA, 'Pastel para 20 personas', 15),
        ...tocar(6.4, { sel: M + '[data-agent-send]' }),
        ...soltarAgente(7.6),
        ...c.eventos,
      ],
      camara: [
        cam(3.0, 3.0, ENC.nav),
        cam(3.8, 4.2, ENC.chat),
        cam(6.5, 6.95, ENC.enviado),
        cam(7.8, 8.8, { z: 1.08, fx: 180, foco: { hoja: 'Para registrar el pedido' }, ty: 820 }),
        ...c.camara,
      ],
    };
  },
};

// r1: Flores viene activo por defecto; se apaga antes de grabar para que en el paso 2 se vea cómo se activa.
function prepararR1(completo) {
  return async (A) => {
    const clic = (sel, texto) => A.app.evaluate(`__el(${JSON.stringify(sel)}, ${JSON.stringify(texto || '')}).click()`);
    await clic(M + '[data-go="cotizar"]', 'Cotizar'); await A.esperar(300);
    await clic(M + '[data-step-chip="2"]'); await A.esperar(200);
    if (!completo) { await clic(M + '[data-fchip="extra"]', 'Flores'); await A.esperar(150); }
    await clic(M + '[data-step-chip="1"]'); await A.esperar(200);
    if (completo) {
      await A.app.locator(M + '[data-field="nombre"]').first().fill('Cliente de ejemplo');
      await A.app.locator(M + '[data-field="invitados"]').first().fill('20');
      await A.app.locator(M + '[data-field="fecha"]').first().fill('2026-11-07');
      await clic(M + '[data-step-chip="3"]'); await A.esperar(250);
      await A.app.evaluate(`(() => { const s = __scr(), e = __hoja('Resumen en vivo', -1); s.scrollTop += e.getBoundingClientRect().top - s.getBoundingClientRect().top - 60; })()`);
    }
    await A.esperar(250);
  };
}

// Respuestas del Agente IA (ver app-local.cjs): solo la llamada a la herramienta, sin texto del modelo.
// 1) Con "Pastel para 20 personas" todavía falta el nombre del cliente: la app lo pide con su propio mensaje.
// 2) Con el nombre, la fecha, el sabor y las flores, la app arma la tarjeta "Confirma el pedido".
const RESPUESTAS_AGENTE = [
  { toolCall: { name: 'crear_pedido_directo', args: { tamano: 'Mediano' } } },
  { toolCall: { name: 'crear_pedido_directo', args: { nombre_cliente: 'Cliente de ejemplo', nombre_receta: 'Chocolate', tamano: 'Mediano', extras: ['Flores'], fecha_evento: '2026-11-07' } } },
];

// ─────────────────────────── Render ───────────────────────────
async function grabar(browser, id) {
  const def = REELS[id]();
  const p = pieza(def.pieza);
  const escenas = escenasDe(p, def.variante);
  const subs = leerSRT(path.join(BASE, 'guiones', `${p.id}-subtitulos-${def.variante}.srt`));
  const N = Math.round(def.duracion * FPS);
  const carpeta = path.join(SALIDA, p.carpeta);
  const salida = path.join(carpeta, `${p.id}-${nombres[def.variante]}.mp4`);
  const tarjeta = `/__salida/${p.carpeta}/${p.id}-tarjeta-final-${p.palabra.toLowerCase()}-1080x1920.png`;

  // Agente: cada respuesta espera a que la línea de tiempo la suelte (así se ve "Escribiendo…").
  const cola = RESPUESTAS_AGENTE.map((r) => { let soltar; const listo = new Promise((ok) => { soltar = ok; }); return { r, listo, soltar }; });
  let pedidas = 0, soltadas = 0;
  const agente = def.agente ? async () => { const q = cola[Math.min(pedidas++, cola.length - 1)]; await q.listo; return q.r; } : null;

  const { ctx, page } = await abrirApp(browser, {
    width: W, height: H, dsf: 1, agente, ruta: '/__escenario',
    rutas: async (c) => {
      await c.route(HOST + '/__escenario', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: escenarioHTML() }));
      await c.route(HOST + '/capturas/**', (r) => r.fulfill({ path: path.join(CAP, decodeURIComponent(new URL(r.request().url()).pathname.replace('/capturas/', ''))) }));
      await c.route(HOST + '/__salida/**', (r) => r.fulfill({ path: path.join(SALIDA, decodeURIComponent(new URL(r.request().url()).pathname.replace('/__salida/', ''))) }));
    },
  });
  await page.waitForFunction(() => { const d = document.querySelector('#app').contentDocument; return d && d.readyState === 'complete' && d.querySelector('#mobile'); });
  const app = page.frames().find((f) => f.url().endsWith('/index.html'));
  await app.waitForLoadState('networkidle');
  await app.evaluate(() => Promise.all([document.fonts.ready, document.fonts.load('600 20px Fredoka'), document.fonts.load('800 20px Nunito')]));
  await app.addStyleTag({ content: '::-webkit-scrollbar{display:none} *{caret-color:#E7B676}' });
  await app.evaluate(AYUDAS);
  await page.evaluate(() => Promise.all([document.fonts.load('900 52px Nunito'), document.fonts.load('600 40px Fredoka')]));

  const A = { page, app, toques: [], scrolls: [], t: 0, esperar: (ms) => page.waitForTimeout(ms), soltar: () => cola[soltadas++].soltar() };
  await def.preparar(A);

  const eventos = [...def.eventos].sort((a, b) => a.t - b.t);
  const movs = [...def.camara].sort((a, b) => a.t0 - b.t0);
  const ilusHTML = {
    libreta: () => `<div class="escena">${ilustracion('libreta-precio').replace('<svg class="obj" style="left:250px;top:760px', '<svg class="obj trazo" style="left:250px;top:760px')}</div>`,
    noche: () => `<div class="escena">${ilustracion('noche-mensaje')}</div>`,
    tarjeta: () => `<img class="fin" src="${tarjeta}" alt="">`,
  };

  let ff = null, dirMuestras = null;
  if (MUESTRAS) { dirMuestras = path.join(BASE, 'salida', 'muestras-reels', id); fs.rmSync(dirMuestras, { recursive: true, force: true }); fs.mkdirSync(dirMuestras, { recursive: true }); }
  else {
    ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-map', '0:v', '-map', '1:a', '-shortest',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-maxrate', '3500k', '-bufsize', '7000k', '-pix_fmt', 'yuv420p',
      '-profile:v', 'high', '-level', '4.1', '-r', String(FPS), '-g', String(FPS * 2), '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', salida],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  const terminado = ff && new Promise((ok, mal) => ff.on('close', (c) => (c === 0 ? ok() : mal(new Error('ffmpeg salió con ' + c)))));

  let ilusActual = null, k = 0;
  const paso = MUESTRAS ? 3 : 1;   // en muestras se avanza de 0.1 s en 0.1 s
  for (let f = 0; f < N; f += paso) {
    const t = f / FPS; A.t = t;
    while (k < eventos.length && eventos[k].t <= t + 1e-6) { await eventos[k].f(A); k++; }
    // Cámara: resuelve el foco de los movimientos que empiezan ahora.
    for (const m of movs) {
      if (m.t0 > t + 1e-6 || m.res) continue;
      const fin = { ...m.fin };
      if (fin.foco) {
        const r = await app.evaluate(`__rect(${buscar(fin.foco)})`);
        if (!r) throw new Error(`${id}: no encontré el foco ${JSON.stringify(fin.foco)} en t=${t.toFixed(2)}`);
        fin.fx = m.fin.fx ?? r.x; fin.fy = r.y + (fin.fyMas || 0);
      }
      m.res = { z: fin.z, fx: fin.fx ?? 180, fy: fin.fy, ty: fin.ty };
    }
    const c = camaraEn(movs, t);
    // Desplazamientos del contenedor de la app
    const sc = A.scrolls.filter((s) => s.t0 <= t + 1e-6).pop();
    if (sc) { const y = entre(sc.ini, sc.fin, sc.t1 > sc.t0 ? suave((t - sc.t0) / (sc.t1 - sc.t0)) : 1); await app.evaluate((y) => { const s = __scr(); if (s) s.scrollTop = y; }, y); }
    // Ilustración activa
    const il = def.ilus.find((x) => t >= x.desde && t < x.hasta);
    let ilus = null;
    if (il) {
      ilus = { tipo: il.tipo, p: (t - il.desde) / (il.hasta - il.desde), t: t - il.desde };
      if (ilusActual !== il) { ilus.html = ilusHTML[il.tipo](); ilusActual = il; }
    } else ilusActual = null;
    // Texto en pantalla de la escena (no en la tarjeta final, que ya lo trae)
    const e = escenas.find((x) => t >= x.t[0] && t < x.t[1]);
    const titulo = { html: '', o: 0, dy: 0 };
    if (e && e.tipoToma !== 'tarjeta') { const u = e.t[0] === 0 ? 1 : suave((t - e.t[0]) / 0.22); titulo.html = overlayHTML(e.texto, p); titulo.o = u; titulo.dy = Math.round(26 * (1 - u)); }
    // Subtítulo
    const s = subs.find((x) => t >= x.a && t < x.z);
    const sub = s ? { texto: s.texto.split('\n').map((l) => `<span>${l}</span>`).join('<br>'), o: suave((t - s.a) / 0.08), e: 0.94 + 0.06 * suave((t - s.a) / 0.12) } : { texto: '', o: 0, e: 1 };
    // Velo de "rebobinar"
    let velo = 0, veloDy = 0, filtro = '';
    if (def.velo && t >= def.velo[0] && t < def.velo[1]) {
      const [a, b] = def.velo; velo = Math.min(suave((t - a) / 0.12), suave((b - t) / 0.2));
      veloDy = ((f * 37) % 13) - 6; filtro = `blur(${(1.6 * velo).toFixed(2)}px) saturate(${(1 - 0.5 * velo).toFixed(2)})`;
    }
    const nota = (def.nota || []).some(([a, b]) => t >= a && t < b) ? 1 : 0;
    const toques = A.toques.filter((q) => t >= q.t && t < q.t + 0.6).map((q) => {
      const u = (t - q.t) / 0.6, en = encuadre(c);
      return { x: Math.round(en.x0 + en.S * q.x), y: Math.round(en.y0 + en.S * q.y), e: (0.55 + 0.45 * suave(u / 0.7)).toFixed(3), o: (1 - suave((u - 0.3) / 0.7)).toFixed(3) };
    });
    await page.evaluate((st) => window.E.aplicar(st), { cam: camCSS(c), filtro, ilus, velo, veloDy, titulo, sub, nota, toques });
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (MUESTRAS) fs.writeFileSync(path.join(dirMuestras, `${t.toFixed(1).padStart(4, '0')}s.jpg`), buf);
    else if (!ff.stdin.write(buf)) await new Promise((ok) => ff.stdin.once('drain', ok));
  }
  if (k < eventos.length) console.log(`${id}: ${eventos.length - k} eventos quedaron fuera del tiempo`);
  if (ff) { ff.stdin.end(); await terminado; }
  await ctx.close();
  console.log(MUESTRAS ? `${id}: muestras en ${path.relative(process.cwd(), dirMuestras)}` : `${id}: ${path.relative(process.cwd(), salida)} · ${(fs.statSync(salida).size / 1048576).toFixed(1)} MB`);
}

async function main() {
  const pedidos = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const ids = pedidos.length ? pedidos : Object.keys(REELS);
  const browser = await launch();
  // Dos a la vez: cada reel corre en su propio contexto del navegador.
  const cola = [...ids];
  await Promise.all([0, 1].map(async () => { while (cola.length) { const id = cola.shift(); const t0 = Date.now(); await grabar(browser, id); console.log(`   (${((Date.now() - t0) / 1000).toFixed(0)} s)`); } }));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
