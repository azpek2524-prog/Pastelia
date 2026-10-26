// Genera todo el kit a partir de contenido.cjs, organizado por pieza (las mismas carpetas que en Drive):
//   salida/<semana>/01-Reel-Cotizacion/ … 06-Meme-Mama/ y Perfil-y-Playbook/
//   - Carruseles y meme: PNG 1080×1350 por slide, tira completa, guion .md, caption, texto alternativo y DM
//   - Reels: storyboard 9:16 por escena (variante A completa + inicio de la B), tarjeta final, portada del
//     Reel, storyboard completo, guion .md con la tabla de 3 componentes, subtítulos .srt (A y B), caption y DM
//   - Perfil y playbook: textos, portadas de historias destacadas, calendario, respuestas por DM y plantillas CSV
// Las fuentes (HTML, guiones, captions, perfil) quedan en el repo; los PNG solo en salida/ (no se suben).
// Uso (desde la raíz del repo): node marketing/2026-10-arranque-instagram/herramientas/generar.cjs [--solo-textos]
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const { launch, routeFonts } = require('./navegador.cjs');
const C = require('../contenido.cjs');
const { contar } = require('./contar-palabras.cjs');
const { carruselHTML, portadaConFotoHTML, crearDiseno, W: SW, H: SH, R, FUENTES } = require('./diseno-cacao.cjs');

const BASE = path.resolve(__dirname, '..');
const ROOT = path.resolve(BASE, '../..');
const SALIDA = path.join(BASE, 'salida', C.SEMANA.id);
const CAP = path.join(BASE, 'capturas');
const MATERIAL = path.resolve(BASE, '../material');
const PERFIL = 'Perfil-y-Playbook';
const SOLO_TEXTOS = process.argv.includes('--solo-textos');   // regenera textos sin volver a renderizar PNG

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mk = (d) => fs.mkdirSync(d, { recursive: true });
const D = crearDiseno({ ROOT, capDir: CAP, rel: '../capturas/', materialDir: MATERIAL });
const escenasDe = (p, v) => [...p.variantes[v].escenas, ...p.cuerpo];

// ─────────────────────────── Storyboards 9:16 ───────────────────────────
// Zona segura (ad-creative/short-form-video-specs): banda de 720×1200 centrada, de y=220 a y=1420.
// El texto en pantalla va arriba de la banda y los subtítulos abajo de la banda, nunca en los 500 px de abajo.
const ZONA = { x: 180, y: 220, w: 720, h: 1200 };
const CSS_SB = `${D.css}
body{background:#0E0907;padding:40px;display:flex;flex-direction:column;align-items:center;gap:40px}
.frame{width:1080px;height:1920px;position:relative;overflow:hidden;flex:none;color:#FFF4E6;background:radial-gradient(120% 60% at 50% 40%,#2A1C14 0%,#1C130E 46%,#120C08 100%)}
.chips{position:absolute;left:40px;top:36px;right:40px;display:flex;gap:12px;flex-wrap:wrap;z-index:16}
.chip{font:800 26px/1 'Nunito';padding:13px 20px;border-radius:999px;background:rgba(14,9,7,.78);border:2px solid rgba(255,244,230,.25);color:#FFF4E6}
.chip.d{background:#E7B676;border-color:#E7B676;color:#2A1D16}
.zona{position:absolute;left:${ZONA.x}px;top:${ZONA.y}px;width:${ZONA.w}px;height:${ZONA.h}px;border:3px dashed rgba(231,182,118,.55);border-radius:14px;z-index:15;pointer-events:none}
.zona span{position:absolute;right:10px;bottom:-40px;font:800 22px/1 'Nunito';color:rgba(231,182,118,.8)}
.overlay{position:absolute;left:${ZONA.x}px;width:${ZONA.w}px;top:${ZONA.y + 28}px;z-index:14;text-align:center;font:900 52px/1.44 'Nunito';letter-spacing:-.01em;color:#FFF4E6}
.overlay span{background:rgba(26,18,13,.78);-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:.04em .3em;border-radius:.3em}
.overlay mark{background:none;color:#E7B676}
.sub{position:absolute;left:${ZONA.x}px;width:${ZONA.w}px;bottom:${1920 - ZONA.y - ZONA.h + 30}px;z-index:14;text-align:center;font:900 46px/1.2 'Nunito';color:#FFF4E6;text-shadow:0 2px 16px rgba(0,0,0,.95),0 0 4px rgba(0,0,0,.8)}
.toma{position:absolute;left:48px;right:48px;bottom:36px;z-index:16;font:700 26px/1.4 'Nunito';color:rgba(255,244,230,.82);text-align:left;background:rgba(10,6,4,.78);border:1px solid rgba(231,182,118,.32);border-radius:20px;padding:16px 22px}
.toma b{color:#E7B676}
.pant{position:absolute;inset:0;overflow:hidden;z-index:2}
.pant img{position:absolute;max-width:none;display:block}
.sombra{position:absolute;inset:0;z-index:3;background:linear-gradient(180deg,rgba(14,9,7,.7) 0%,rgba(14,9,7,0) 22%,rgba(14,9,7,0) 66%,rgba(14,9,7,.82) 100%)}
.mesa{position:absolute;left:0;right:0;bottom:0;height:820px;z-index:1;background:repeating-linear-gradient(176deg,rgba(255,226,196,.035) 0 3px,rgba(0,0,0,0) 3px 26px),linear-gradient(180deg,#2B1A10 0%,#1B0F08 70%,#120A05 100%)}
.grabar{position:absolute;left:260px;top:330px;width:560px;height:1060px;z-index:5;border:5px dashed #E7B676;border-radius:80px;background:repeating-linear-gradient(135deg,rgba(231,182,118,.07) 0 18px,rgba(231,182,118,.02) 18px 36px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:60px;text-align:center}
.grabar b{font:600 54px/1.05 'Fredoka';color:#E7B676}
.grabar span{font:800 30px/1.35 'Nunito';color:rgba(255,244,230,.85)}
.hoja{width:1600px;background:#1C130E;color:#FFF4E6;padding:80px;display:flex;flex-direction:column;gap:34px}
.hoja h1{font:600 64px/1.05 'Fredoka'}
.hoja h3{font:900 30px/1 'Nunito';letter-spacing:.1em;text-transform:uppercase;color:#E7B676;margin-top:10px}
.hoja .meta{font:800 28px/1.4 'Nunito';color:#E7B676}
.hoja .hook{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.hoja .hook div{background:#241811;border:1px solid rgba(231,182,118,.25);border-radius:22px;padding:24px;font:700 25px/1.4 'Nunito';color:rgba(255,244,230,.9)}
.hoja .hook b{display:block;font:800 21px/1.2 'Nunito';letter-spacing:.06em;text-transform:uppercase;color:#E7B676;margin-bottom:10px}
.esc{display:grid;grid-template-columns:240px 1fr;gap:36px;background:#241811;border:1px solid rgba(231,182,118,.2);border-radius:28px;padding:26px;align-items:start}
.esc img{width:240px;border-radius:16px;display:block}
.esc .t{font:800 24px/1 'Nunito';background:#E7B676;color:#2A1D16;display:inline-block;padding:10px 16px;border-radius:999px}
.esc h2{font:600 40px/1.1 'Fredoka';margin:14px 0 10px}
.esc p{font:700 25px/1.42 'Nunito';margin-top:10px;color:rgba(255,244,230,.86)}.esc p b{color:#E7B676;font-weight:900}`;

// Encuadre de cada captura en el Reel: zoom para que lo importante quede dentro de la zona segura.
const ENCUADRE = {
  '03-cotizar-paso1-cliente.png': { rect: [52, 180, 1118, 1440], ancho: 960 },
  '05-cotizar-paso2-extras.png': { rect: [60, 600, 1110, 2200], ancho: 740 },
  '06-cotizar-paso3-costeo.png': { rect: [52, 290, 1118, 1110], ancho: 980 },
  '02-agenda.png': { rect: [52, 150, 1118, 1440], ancho: 940 },
  '15-agente-ia-pedido-escrito.png': { recortes: [{ rect: R.agenteHeader, w: 900, y: 450 }, { rect: R.agenteBurbuja, w: 820, y: 630 }, { rect: R.agenteEntrada, w: 940, y: 1040, aro: true }] },
  '14-agente-ia.png': { recortes: [{ rect: R.agenteHeader, w: 1000, y: 660, aro: true }] }
};

function overlayHTML(texto, p) {
  const claves = [...(p.claves || []), p.palabra].filter(Boolean);
  return texto.split(' · ').map((linea) => {
    let t = esc(linea).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>');
    claves.forEach((c) => { t = t.replace(new RegExp(`(^|[^\\p{L}$])(${c.replace(/[$.*+?^()[\]{}|\\]/g, '\\$&')})(?![\\p{L}\\d])`, 'gu'), '$1<mark>$2</mark>'); });
    return `<span>${t}</span>`;
  }).join('<br>');
}

function pantallaHTML(e) {
  const src = '../capturas/' + e.captura;
  const { w: iw, h: ih } = (() => { const b = fs.readFileSync(path.join(CAP, e.captura)); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; })();
  if (e.tarjetaCompleta) {
    const w = 860, h = Math.round(ih * w / iw);
    return D.brillo(540, 820, 1300, 0.6) + `<div class="tarjeta" style="left:${(1080 - w) / 2}px;top:${820 - h / 2}px;width:${w}px;height:${h}px;border-radius:44px;z-index:4"><img src="${src}" alt="" style="width:${w}px;left:0;top:0"></div>`;
  }
  const enc = ENCUADRE[e.captura] || { rect: [0, 0, iw, Math.round(iw * 1920 / 1080)], ancho: 1080 };
  if (enc.recortes) {
    return D.brillo(540, 820, 1300, 0.5) + enc.recortes.map((r) => {
      const [x0, y0, x1, y1] = r.rect, s = r.w / (x1 - x0), h = Math.round((y1 - y0) * s);
      return `<div class="tarjeta" style="left:${(1080 - r.w) / 2}px;top:${r.y}px;width:${r.w}px;height:${h}px;border-radius:30px;z-index:4${r.aro ? ';box-shadow:0 0 0 5px #E7B676,0 0 60px rgba(231,182,118,.6),0 40px 80px -30px rgba(0,0,0,.8)' : ''}"><img src="${src}" alt="" style="width:${Math.round(iw * s)}px;left:${Math.round(-x0 * s)}px;top:${Math.round(-y0 * s)}px"></div>`;
    }).join('');
  }
  const [x0, y0, x1, y1] = enc.rect, s = enc.ancho / (x1 - x0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return `<div class="pant"><img src="${src}" alt="" style="width:${Math.round(iw * s)}px;left:${Math.round(540 - cx * s)}px;top:${Math.round(830 - cy * s)}px"></div><div class="sombra"></div>`;
}

function ilustracion(nombre) {
  if (nombre === 'libreta-precio') {
    return D.brillo(540, 1050, 1300, 0.55) + '<div class="mesa"></div>' + D.libreta({ x: 90, y: 520, w: 640, rot: -8 })
      + `<svg class="obj" style="left:250px;top:760px;width:420px;height:160px;z-index:7" viewBox="0 0 420 160"><path d="M20 120 C120 60 240 40 400 30" stroke="#B5523B" stroke-width="16" stroke-linecap="round" fill="none"/></svg>`
      + D.telefono({ src: '03-cotizar-paso1-cliente.png', w: 400, x: 610, y: 800, rot: 10, z: 8, brilloOro: true });
  }
  if (nombre === 'noche-mensaje') {
    return D.brillo(760, 520, 900, 0.55, '#E7B676') + '<div class="mesa"></div>' + D.telefono({ html: D.notificacion(460), w: 460, x: 310, y: 520, rot: -4, brilloOro: true, z: 6 }) + D.destellos([[240, 520, 30], [880, 640, 26]]);
  }
  return '';
}

function grabarHTML(e) {
  const icono = '<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#E7B676" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 5h3"/><circle cx="12" cy="12.5" r="2.6" fill="#E7B676"/></svg>';
  return `<div class="grabar">${icono}<b>Graba aquí tu pantalla real</b><span>${esc(e.visual)}</span></div>`;
}

function zona() { return `<div class="zona"><span>zona segura 720×1200</span></div>`; }

function escenaHTML(p, e, k, v) {
  const tipos = { real: 'Toma real', pantalla: 'Grabación de pantalla', grabar: 'Graba tu pantalla', tarjeta: 'Tarjeta final' };
  const chips = `<div class="chips"><div class="chip d">${v} · Escena ${k + 1} · ${e.t[0]}–${e.t[1]} s</div><div class="chip">${tipos[e.tipoToma]}</div>${e.nombre ? `<div class="chip">${esc(e.nombre)}</div>` : ''}</div>`;
  if (e.tipoToma === 'tarjeta') return tarjetaFinal(p, chips + zona(), `${v}-e${k + 1}`);
  const sub = subtitulos(e.voz)[0] || '';
  let cuerpo = '';
  if (e.tipoToma === 'pantalla') cuerpo = pantallaHTML(e);
  else if (e.tipoToma === 'grabar') cuerpo = D.brillo(540, 860, 1300, 0.5) + grabarHTML(e);
  else cuerpo = ilustracion(e.ilustracion) + `<div class="toma"><b>Qué grabar:</b> ${esc(e.visual)}</div>`;
  return `<section class="frame" data-id="${v}-e${k + 1}">${chips}${cuerpo}${zona()}<div class="overlay">${overlayHTML(e.texto, p)}</div><div class="sub">${esc(sub).replace('\n', '<br>')}</div><div class="grano"></div></section>`;
}

function tarjetaFinal(p, extra = '', dataId = 'tarjeta') {
  return `<section class="frame" data-id="${dataId}">${extra}${D.brillo(540, 1000, 1400, 0.55)}${D.goteo({ x: 0, w: 1080, semilla: p.id === 'r1' ? 21 : 27, z: 8 })}
  ${D.lockup(300, 560, 480)}
  <div class="txt" style="left:0;top:800px;width:1080px;text-align:center">${D.pildoraCTA(p.palabra, `Comenta ${p.palabra} y te mando el link`).replace('margin-top:64px', 'margin-top:0')}</div>
  ${D.destellos([[200, 1260, 40], [900, 1200, 30], [820, 1500, 26]])}<div class="grano"></div></section>`;
}

// Portada del Reel (1080×1920): el gancho grande dentro del recorte 3:4 de la cuadrícula del perfil.
function portadaReel(p) {
  const destacado = { r1: ['a ojo?'], r2: ['una IA'] }[p.id] || [];
  const cap = p.id === 'r2' ? '15-agente-ia-pedido-escrito.png' : '06-cotizar-paso3-costeo.png';
  return `<section class="frame" data-id="portada">${D.brillo(540, 700, 1300, 0.6)}${D.goteo({ x: 0, w: 1080, semilla: p.id === 'r1' ? 31 : 37, z: 8 })}
  <div class="txt" style="left:110px;top:420px;width:860px;text-align:center"><h2 class="tit" style="font-size:112px">${(() => { let h = esc(p.titulo); destacado.forEach((d) => { h = h.replace(esc(d), `<span class="oro">${esc(d)}</span>`); }); return h; })()}</h2></div>
  ${p.id === 'r2' ? D.insignia(440, 330, 'beta') : ''}
  ${D.telefono({ src: cap, w: 470, x: 305, y: 1060, rot: 0, z: 5, brilloOro: true })}
  <div class="grano"></div></section>`;
}

function storyboardHTML(p) {
  const A = escenasDe(p, 'A').map((e, k) => escenaHTML(p, e, k, 'A')).join('\n');
  const B = p.variantes.B.escenas.map((e, k) => escenaHTML(p, e, k, 'B')).join('\n');
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · storyboard</title>${FUENTES}<style>${CSS_SB}</style></head><body>
${A}
${B}
${tarjetaFinal(p)}
${portadaReel(p)}
</body></html>`;
}

function tablaGancho(v) {
  const g = v.escenas[0];
  return `<div class="hook"><div><b>Acción visual (0–3 s)</b>${esc(g.visual)}</div><div><b>Voz en off</b>${esc(g.voz)}</div><div><b>Texto en pantalla · zona segura</b>${esc(g.texto)}</div></div>`;
}
function hojaHTML(p) {
  const fila = (e, k, v) => `<div class="esc"><img src="${p.id}-${v}-escena-${k + 1}.png" alt=""><div><span class="t">${v} · ${e.t[0]}–${e.t[1]} s</span><h2>${esc(e.nombre)}</h2><p><b>Visual:</b> ${esc(e.visual)}</p><p><b>Voz:</b> ${esc(e.voz)}</p><p><b>Texto en pantalla:</b> ${esc(e.texto)}</p></div></div>`;
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · hoja</title>${FUENTES}<style>${CSS_SB}</style></head><body>
<section class="hoja"><div><div class="meta">${esc(p.estructura)} · ${esc(p.duracion)} · ${esc(p.dia)} ${esc(p.hora)} · CTA: ${esc(p.palabra)}</div><h1>${esc(p.titulo)}</h1></div>
<h3>${esc(p.variantes.A.etiqueta)} — ${esc(p.variantes.A.angulo)}</h3>${tablaGancho(p.variantes.A)}
<h3>${esc(p.variantes.B.etiqueta)} — ${esc(p.variantes.B.angulo)}</h3>${tablaGancho(p.variantes.B)}
<h3>Versión A completa</h3>
${escenasDe(p, 'A').map((e, k) => fila(e, k, 'A')).join('')}
<h3>Versión B: cambia de 0 a 9 s (gancho y puente); el resto es igual</h3>
${p.variantes.B.escenas.map((e, k) => fila(e, k, 'B')).join('')}
</section></body></html>`;
}

// ─────────────────────────── Subtítulos (SRT) ───────────────────────────
// Máx. 2 líneas por subtítulo y hasta 5 palabras por línea. Corta en comas y puntos, nunca une
// dos oraciones en un mismo subtítulo y evita que una línea termine en palabras débiles ("y", "la", "con"…).
const DEBILES = new Set(['y', 'o', 'e', 'la', 'el', 'los', 'las', 'de', 'del', 'con', 'en', 'a', 'al', 'que', 'tu', 'tus', 'mi', 'mis', 'un', 'una', 'por', 'para', 'su', 'sus', 'lo', 'se', 'te', 'me', 'qué', 'no', 'veinte', 'treinta', 'cuarenta', 'cinco', 'setecientos', 'catorce', 'sin', 'si']);
function lineas(oracion) {
  const w = oracion.split(/\s+/).filter(Boolean), n = w.length;
  const best = [0], prev = [0];
  for (let j = 1; j <= n; j++) {
    best[j] = Infinity;
    for (let i = Math.max(0, j - 5); i < j; i++) {
      const len = j - i, ult = w[j - 1];
      let c = (5 - len) * (5 - len) * 0.6;
      if (j < n) { c += DEBILES.has(ult.toLowerCase().replace(/[^\p{L}]/gu, '')) ? 12 : 0; c += /[,;:]$/.test(ult) ? -4 : 2; if (/^agente$/i.test(ult) && /^IA\b/.test(w[j])) c += 12; }
      else if (len <= 2 && n > 3) c += 3;   // evita una última línea huérfana ("el link.")
      if (best[i] + c < best[j]) { best[j] = best[i] + c; prev[j] = i; }
    }
  }
  const out = []; for (let j = n; j > 0; j = prev[j]) out.unshift(w.slice(prev[j], j));
  return out;
}
function subtitulos(voz) {
  const cues = [];
  voz.split(/(?<=[.?!…])\s+/).forEach((o) => {
    const ls = lineas(o);
    for (let i = 0; i < ls.length; i += 2) cues.push(ls.slice(i, i + 2).map((l) => l.join(' ')).join('\n'));
  });
  return cues;
}
function ts(sec) { const ms = Math.round(sec * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, r = ms % 1000; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(r).padStart(3, '0')}`; }
function srt(escenas) {
  let n = 0; const out = [];
  escenas.forEach((e) => {
    const cues = subtitulos(e.voz); const total = cues.reduce((a, c) => a + c.split(/\s+/).length, 0);
    let t = e.t[0];
    cues.forEach((c) => { const d = (e.t[1] - e.t[0]) * c.split(/\s+/).length / total; out.push(`${++n}\n${ts(t)} --> ${ts(t + d - 0.04)}\n${c}\n`); t += d; });
  });
  return out.join('\n');
}

// ─────────────────────────── Textos: guiones, captions, alt, perfil, playbook ───────────────────────────
const md = (s) => String(s).replace(/\|/g, '\\|');

function guionVideoMD(p) {
  const gancho = (v) => { const g = p.variantes[v].escenas[0]; return `| ${md(g.visual)} | ${md(g.voz)} | ${md(g.texto)} |`; };
  const puente = (v) => p.variantes[v].escenas.slice(1).map((e) => `- **${e.t[0]}–${e.t[1]} s · ${e.nombre}:** ${e.visual} Voz: "${e.voz}" Texto: "${e.texto}"`).join('\n');
  const tabla = (escenas) => escenas.map((e) => `| ${e.t[0]}–${e.t[1]} s | ${md(e.nombre)} | ${md(e.visual)} | ${md(e.voz)} | ${md(e.texto)} |`).join('\n');
  return `# ${p.id} · ${p.titulo}

${p.subtitulo}

- **Estructura:** ${p.estructura} · **Duración:** ${p.duracion} · **Formato:** ${p.formato}
- **Publicación:** ${p.dia}, ${p.hora} (centro de México) · ${p.redes.join(', ')}
- **Palabra clave del CTA:** ${p.palabra}

## Gancho A (principal) — ${p.variantes.A.angulo}
Tres componentes que se complementan, sin repetirse (hook-system):

| Acción visual (0–3 s) | Voz en off | Texto en pantalla (zona segura 720×1200) |
|---|---|---|
${gancho('A')}

## Gancho B (para "Reel de prueba") — ${p.variantes.B.angulo}

| Acción visual (0–3 s) | Voz en off | Texto en pantalla (zona segura 720×1200) |
|---|---|---|
${gancho('B')}

## Puente (on-ramp, 3–15 s)
Cada gancho tiene su propio puente: continúa la promesa del gancho antes de entrar al paso a paso.

**Versión A**
${puente('A')}
- **${p.cuerpo[0].t[0]}–${p.cuerpo[0].t[1]} s · ${p.cuerpo[0].nombre} (igual en A y B):** ${p.cuerpo[0].visual} Voz: "${p.cuerpo[0].voz}"

**Versión B**
${puente('B')}

## Guion completo (versión A)
| Tiempo | Escena | Acción visual | Voz en off | Texto en pantalla |
|---|---|---|---|---|
${tabla(escenasDe(p, 'A'))}

## Versión B: cambia solo de 0 a 9 s
| Tiempo | Escena | Acción visual | Voz en off | Texto en pantalla |
|---|---|---|---|---|
${tabla(p.variantes.B.escenas)}

## Subtítulos
Archivos \`${p.id}-subtitulos-A.srt\` y \`${p.id}-subtitulos-B.srt\` (tiempos aproximados; ajústalos al audio real).

${escenasDe(p, 'A').map((e) => subtitulos(e.voz).map((c) => '> ' + c.replace('\n', ' / ')).join('\n')).join('\n')}

## Notas de producción
${p.notas.map((n) => '- ' + n).join('\n')}

## Antes de publicar
${p.antes.map((n) => '- [ ] ' + n).join('\n')}

## Caption (Instagram)
\`\`\`
${p.captions.instagram().trim()}
\`\`\`

## Respuesta por DM a quien comente ${p.palabra}
\`\`\`
${p.dm}
\`\`\`
`;
}

function altText(p) {
  return p.slides.map((s, i) => {
    let t = s.alt || '';   // "alt" en contenido.cjs: descripción escrita a mano cuando el diseño no se entiende solo con los textos
    const extra = (s.extra || []).filter((e) => !(s.titulo || '').toLowerCase().includes(e.toLowerCase()));   // sin repetir lo que ya dice el título
    if (!s.alt) [s.kicker, s.titulo, ...extra, s.texto, s.nota, s.cta].filter(Boolean).forEach((x) => { x = x.trim(); t = !t ? x : t + (/[.:?!…]["»”]?$/.test(t) ? ' ' : '. ') + x; });
    if (!/[.?!…]["»”]?$/.test(t)) t += '.';
    return `${p.slides.length > 1 ? `Slide ${i + 1}: ` : ''}${t}`;
  }).join('\n\n');
}

function guionCarruselMD(p) {
  const { filas } = contar();
  const voz = p.voz ? `
## Guion de voz en off (versión Reel opcional · ${p.voz.duracion})
${p.voz.nota}

| Tiempo | Slide | Voz en off |
|---|---|---|
${p.voz.escenas.map((e) => `| ${e.t[0]}–${e.t[1]} s | ${e.slide} | ${md(e.voz)} |`).join('\n')}

Subtítulos: \`${p.id}-subtitulos.srt\`.
` : '';
  return `# ${p.id} · ${p.titulo}

- **Estructura:** ${p.estructura} · **Formato:** ${p.formato}
- **Publicación:** ${p.dia}, ${p.hora} (centro de México) · ${p.redes.join(', ')}
- **Palabra clave del CTA:** ${p.palabra}

| # | Texto del slide | Palabras | Ciclo abierto | Diseño |
|---|---|---|---|---|
${p.slides.map((s, i) => { const f = filas.find((x) => x.pieza === p.id && x.slide === i + 1); return `| ${i + 1} | ${md([s.kicker, s.titulo, ...(s.extra || []), s.texto, s.nota, s.cta].filter(Boolean).join(' · '))} | ${f.palabras} (${f.limite}) | ${md(s.loop || '—')} | ${md(s.visual)} |`; }).join('\n')}
${voz}
## Notas
${p.notas.map((n) => '- ' + n).join('\n')}

## Antes de publicar
${p.antes.map((n) => '- [ ] ' + n).join('\n')}

## Caption (Instagram)
\`\`\`
${p.captions.instagram().trim()}
\`\`\`

## Texto alternativo (Instagram → Configuración avanzada)
\`\`\`
${altText(p)}
\`\`\`

## Respuesta por DM a quien comente ${p.palabra}
\`\`\`
${p.dm}
\`\`\`
`;
}

function bioTexto() { return C.perfil.bio.join('\n'); }
function perfilMD() {
  const pf = C.perfil;
  return `# Perfil de ${C.HANDLE} · Semana 1

## Pasos
${pf.pasos.map((x, i) => `${i + 1}. ${x}`).join('\n')}

## Nombre (aparece en las búsquedas)
**Recomendado:** \`${pf.nombre.recomendado}\` (${pf.nombre.recomendado.length} caracteres)
${pf.nombre.porque}

Alternativas:
${pf.nombre.alternativas.map((a) => `- \`${a.texto}\` (${a.texto.length} caracteres): ${a.porque}`).join('\n')}

## Presentación (bio, ${bioTexto().length} de 150 caracteres)
\`\`\`
${bioTexto()}
\`\`\`
${pf.bioPorque}

## Enlace
- Título: **${pf.enlace.titulo}** (o **${pf.enlace.tituloListaEspera}**)
- URL: ${pf.enlace.url}
- ${pf.enlace.nota}

## Historias destacadas
| Nombre | Qué va ahí | Portada |
|---|---|---|
${pf.destacadas.map((d) => `| ${d.nombre} | ${d.contenido} | destacada-${d.id}.png |`).join('\n')}

Las portadas son de 1080×1920; Instagram muestra el círculo del centro.

## Respuestas rápidas por DM
${C.respuestasDM.map((r) => `**${r.pregunta}**${r.porConfirmar ? ' (por confirmar)' : ''}\n\`\`\`\n${r.respuesta}\n\`\`\``).join('\n\n')}

Si todavía no quieres abrir la app:
\`\`\`
${C.dmListaEspera}
\`\`\`
`;
}

function playbookMD() {
  const pb = C.playbook;
  return `# Playbook orgánico · Semana 1 y siguientes ($0)

## ${pb.rutina.titulo}
${pb.rutina.pasos.map((p) => `- **Min ${p.min}:** ${p.que}`).join('\n')}

**Fórmula:** ${pb.rutina.formula}

**Comentarios vacíos (evítalos):** ${pb.rutina.vacios.join(' · ')}

**Comentarios útiles (ejemplos para adaptar, no para copiar):**
${pb.rutina.utiles.map((u) => `- *${u.tipo}:* "${u.texto}"`).join('\n')}

**Reglas:**
${pb.rutina.reglas.map((r) => '- ' + r).join('\n')}

## ${pb.dms.titulo}
${pb.dms.intro}

${pb.dms.estructuras.map((e) => `### ${e.nombre}
*Cuándo:* ${e.cuando}

${e.pasos.map((x, i) => `${i + 1}. ${x}`).join('\n')}

Ejemplo (cambia lo que está entre corchetes):
> ${e.ejemplo}`).join('\n\n')}

${pb.dms.notas.map((n) => '- ' + n).join('\n')}

## ${pb.ritmo.titulo}
${pb.ritmo.puntos.map((n) => '- ' + n).join('\n')}

## ${pb.ads.titulo}
${pb.ads.intro}
${pb.ads.condiciones.map((c, i) => `- [ ] ${i + 1}. ${c}`).join('\n')}

${pb.ads.presupuesto}
`;
}

function calendario() {
  const filas = [...C.piezas.map((p) => ({ fecha: p.fecha, dia: p.dia, hora: p.hora, pieza: `${p.id} · ${p.titulo}`, red: p.redes.join(', '), palabra: p.palabra })), ...C.calendarioExtra];
  return filas.sort((a, b) => a.fecha.localeCompare(b.fecha));
}
function calendarioMD() {
  return `# Calendario · ${C.SEMANA.titulo}

Horas sugeridas del centro de México (ajústalas con tus estadísticas). Una palabra clave por pieza para medir cuál trae registros. Si el Reel del martes no está listo, publica primero el carrusel c1 y mueve el Reel un día.

| Día | Hora | Pieza | Red | Palabra clave |
|---|---|---|---|---|
${calendario().map((f) => `| ${f.dia} | ${f.hora} | ${md(f.pieza)} | ${md(f.red)} | ${f.palabra} |`).join('\n')}
`;
}
const csv = (v) => `"${String(v).replace(/"/g, '""')}"`;
function medicionCSV() {
  return 'palabra,pieza,fecha_publicacion,comentarios_con_la_palabra,dm_enviados,cuentas_creadas,guardados,compartidos,notas\n'
    + C.piezas.map((p) => `${p.palabra},${csv(p.id + ' · ' + p.titulo)},${p.fecha},,,,,,`).join('\n') + '\n';
}
function invitacionesCSV() {
  return 'numero,cuenta,ciudad,por_que_ella,fecha_dm,estructura_usada,respondio,probo_la_app,acepto_reel_colaboracion,notas\n'
    + Array.from({ length: 20 }, (_, i) => `${i + 1},,,,,,,,,`).join('\n') + '\n';
}
function respuestasDMtxt() {
  return C.piezas.map((p) => `== ${p.palabra} (${p.id}) ==\n${p.dm}\n`).join('\n')
    + `\n== Lista de espera ==\n${C.dmListaEspera}\n\n== Preguntas frecuentes ==\n`
    + C.respuestasDM.map((r) => `${r.pregunta}${r.porConfirmar ? ' (por confirmar)' : ''}\n${r.respuesta}\n`).join('\n');
}

// Portadas de historias destacadas (1080×1920): ícono de la app en dorado dentro del círculo central.
function destacadaHTML(d) {
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8">${FUENTES}<style>${CSS_SB} body{padding:0}</style></head><body>
<section class="frame" data-id="destacada">${D.brillo(540, 960, 1200, 0.7)}${D.polvo(40, 1080, 91, 1920)}
<div class="obj circulo" style="left:190px;top:610px;width:700px;height:700px;z-index:5">${D.iconoSVG(d.icono, 330, '#E7B676', 1.3)}</div>
<div class="grano"></div></section></body></html>`;
}

// ─────────────────────────── Render ───────────────────────────
async function render() {
  const { ok } = contar();
  if (!ok) { console.error('Hay slides o textos que no cumplen. Corre contar-palabras.cjs y corrige contenido.cjs.'); process.exit(1); }
  ['carruseles', 'storyboards', 'guiones', 'captions', 'perfil-y-playbook'].forEach((d) => mk(path.join(BASE, d)));
  if (!SOLO_TEXTOS) fs.rmSync(SALIDA, { recursive: true, force: true });
  [...C.piezas.map((p) => p.carpeta), PERFIL].forEach((d) => mk(path.join(SALIDA, d)));

  const browser = SOLO_TEXTOS ? null : await launch();
  const ctx = browser && await browser.newContext({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
  if (ctx) await routeFonts(ctx);
  const page = ctx && await ctx.newPage();
  if (page) page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  const abrir = async (file) => {
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 40px Fredoka', '700 40px Fredoka', '800 40px Nunito', '900 40px Nunito', 'italic 900 40px Nunito'].map((f) => document.fonts.load(f).catch(() => 0))).then(() => document.fonts.ready));
    const faltan = await page.evaluate(() => ['Fredoka', 'Nunito'].filter((fu) => ![...document.fonts].some((x) => x.family === fu && x.status === 'loaded')));
    if (faltan.length) throw new Error('No cargaron las fuentes ' + faltan.join(', ') + ' en ' + file);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  };
  const escribir = (rel, txt, carpeta) => { fs.writeFileSync(path.join(BASE, rel), txt); if (carpeta) fs.copyFileSync(path.join(BASE, rel), path.join(SALIDA, carpeta, path.basename(rel))); };

  for (const p of C.piezas) {
    const dir = path.join(SALIDA, p.carpeta);
    if (p.slides) {
      const n = p.slides.length;
      const f = path.join(BASE, 'carruseles', `${p.id}.html`);
      fs.writeFileSync(f, carruselHTML({ p, ROOT, capDir: CAP, rel: '../capturas/', materialDir: MATERIAL }));
      if (page) {
      await page.setViewportSize({ width: n * SW, height: SH });
      await abrir(f);
      if (p.tipo === 'meme') await page.screenshot({ path: path.join(dir, `${p.id}-meme.png`), clip: { x: 0, y: 0, width: SW, height: SH } });
      else {
        for (let i = 0; i < n; i++) await page.screenshot({ path: path.join(dir, `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`), clip: { x: i * SW, y: 0, width: SW, height: SH } });
        const tira = path.join(dir, `${p.id}-tira-completa.png`);
        await page.screenshot({ path: tira });
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tira, '-vf', `scale=${Math.min(n * 300, 2700)}:-1`, path.join(dir, `${p.id}-tira.png`)]);
        fs.unlinkSync(tira);
      }
      if (p.fotoPortada) {
        const fp = path.join(BASE, 'carruseles', `${p.id}-portada-con-foto.html`);
        fs.writeFileSync(fp, portadaConFotoHTML({ p, ROOT, capDir: CAP, rel: '../capturas/', materialDir: MATERIAL }));
        await page.setViewportSize({ width: SW, height: SH });
        await abrir(fp);
        await page.screenshot({ path: path.join(dir, `${p.id}-slide-01-con-foto.png`), clip: { x: 0, y: 0, width: SW, height: SH } });
      }
      }
      escribir(`carruseles/${p.id}-guion.md`, guionCarruselMD(p), p.carpeta);
      escribir(`captions/${p.id}-texto-alternativo.txt`, altText(p) + '\n', p.carpeta);
      if (p.voz) escribir(`guiones/${p.id}-subtitulos.srt`, srt(p.voz.escenas), p.carpeta);
      console.log(p.tipo, p.id, n, 'slides');
    } else {
      const f = path.join(BASE, 'storyboards', `${p.id}-storyboard.html`);
      fs.writeFileSync(f, storyboardHTML(p));
      const A = escenasDe(p, 'A'), B = p.variantes.B.escenas;
      if (page) {
      await page.setViewportSize({ width: 1200, height: 2000 });
      await abrir(f);
      for (let k = 0; k < A.length; k++) await page.locator(`section[data-id="A-e${k + 1}"]`).screenshot({ path: path.join(dir, `${p.id}-A-escena-${k + 1}.png`) });
      for (let k = 0; k < B.length; k++) await page.locator(`section[data-id="B-e${k + 1}"]`).screenshot({ path: path.join(dir, `${p.id}-B-escena-${k + 1}.png`) });
      await page.locator('section[data-id="tarjeta"]').screenshot({ path: path.join(dir, `${p.id}-tarjeta-final-${p.palabra.toLowerCase()}-1080x1920.png`) });
      await page.locator('section[data-id="portada"]').screenshot({ path: path.join(dir, `${p.id}-portada-reel-1080x1920.png`) });
      const hoja = path.join(dir, `${p.id}-hoja.html`);
      fs.writeFileSync(hoja, hojaHTML(p));
      await page.setViewportSize({ width: 1700, height: 2000 });
      await abrir(hoja);
      await page.locator('section.hoja').screenshot({ path: path.join(dir, `${p.id}-storyboard-completo.png`) });
      fs.unlinkSync(hoja);
      }
      escribir(`guiones/${p.id}-guion.md`, guionVideoMD(p), p.carpeta);
      escribir(`guiones/${p.id}-subtitulos-A.srt`, srt(escenasDe(p, 'A')), p.carpeta);
      escribir(`guiones/${p.id}-subtitulos-B.srt`, srt([...B, ...p.cuerpo]), p.carpeta);
      console.log('video', p.id, A.length, 'escenas A +', B.length, 'B');
    }
    escribir(`captions/${p.id}-caption-instagram.txt`, p.captions.instagram().trim() + '\n', p.carpeta);
    escribir(`captions/${p.id}-dm-respuesta.txt`, p.dm + '\n', p.carpeta);
  }

  // Perfil y playbook
  for (const d of (page ? C.perfil.destacadas : [])) {
    const f = path.join(BASE, 'perfil-y-playbook', `destacada-${d.id}.html`);
    fs.writeFileSync(f, destacadaHTML(d).replace(/\.\.\/capturas\//g, '../capturas/'));
    await page.setViewportSize({ width: 1080, height: 1920 });
    await abrir(f);
    await page.locator('section.frame').screenshot({ path: path.join(SALIDA, PERFIL, `destacada-${d.id}.png`) });
    fs.unlinkSync(f);
  }
  escribir('perfil-y-playbook/perfil-instagram.md', perfilMD(), PERFIL);
  escribir('perfil-y-playbook/playbook-organico.md', playbookMD(), PERFIL);
  escribir('perfil-y-playbook/respuestas-dm.txt', respuestasDMtxt(), PERFIL);
  escribir('perfil-y-playbook/medicion.csv', medicionCSV(), PERFIL);
  escribir('perfil-y-playbook/invitaciones-beta.csv', invitacionesCSV(), PERFIL);
  escribir('calendario.md', calendarioMD(), PERFIL);
  if (browser) { await browser.close(); comprimir(); }
}

// El grano de los fondos hace pesados los PNG. pngquant (si está instalado) los reduce sin diferencia
// visible, para que el ZIP de la semana quepa en el chat. Si no está, se quedan como están.
function comprimir() {
  try { execFileSync('pngquant', ['--version'], { stdio: 'ignore' }); } catch (e) { console.log('pngquant no está instalado: los PNG quedan sin comprimir'); return; }
  let antes = 0, despues = 0;
  const pngs = []; (function walk(d) { fs.readdirSync(d, { withFileTypes: true }).forEach((x) => { const f = path.join(d, x.name); if (x.isDirectory()) walk(f); else if (f.endsWith('.png')) pngs.push(f); }); })(SALIDA);
  for (const file of pngs) {
    antes += fs.statSync(file).size;
    try { execFileSync('pngquant', ['--quality=80-98', '--speed', '1', '--force', '--skip-if-larger', '--output', file, file]); } catch (e) { /* calidad no alcanzada: se queda el original */ }
    despues += fs.statSync(file).size;
  }
  console.log(`PNG comprimidos (${pngs.length}): ${(antes / 1048576).toFixed(1)} MB → ${(despues / 1048576).toFixed(1)} MB`);
}

if (require.main === module) render().catch((e) => { console.error(e); process.exit(1); });
module.exports = { subtitulos, srt, escenasDe, altText, calendario, bioTexto, SALIDA, PERFIL, CAP, D, CSS_SB, overlayHTML, ilustracion };
