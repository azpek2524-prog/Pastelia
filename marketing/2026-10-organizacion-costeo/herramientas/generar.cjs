// Genera todo el kit a partir de contenido.cjs:
//   - carruseles/<id>.html (fuente) y salida/.../carruseles/<id>-slide-XX.png (1080×1350) + <id>-tira.png
//   - storyboards/*.html (fuente) y salida/.../storyboards/*.png (escenas 1080×1920, hoja completa y tarjetas finales)
//   - guiones/*.md y guiones/*.srt, captions/*.txt, calendario.md
// Uso (desde la raíz del repo): node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const { launch, routeFonts } = require('./navegador.cjs');
const C = require('../contenido.cjs');
const { contar } = require('./contar-palabras.cjs');

const BASE = path.resolve(__dirname, '..');
const SEMANA = 'semana-2026-10-05';
const SALIDA = path.join(BASE, 'salida', SEMANA);
const CAP = path.join(BASE, 'capturas');
const ROOT = path.resolve(BASE, '../..');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mk = (d) => fs.mkdirSync(d, { recursive: true });

// Todo el kit usa el diseño cacao (herramientas/diseno-cacao.cjs): fondos cacao casi negro con grano,
// texto crema en Nunito, acentos dorados y la app real capturada en modo oscuro (capturas/).
const { carruselHTML, crearDiseno, W: SW, H: SH } = require('./diseno-cacao.cjs');
const FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap" rel="stylesheet">';
const D = crearDiseno({ ROOT, capDir: CAP, rel: '../capturas/' });

// ─────────────────────────── Storyboards ───────────────────────────
// Cada escena es un cuadro 9:16 con: chips de escena, texto en pantalla (crema sobre barra cacao al 70 %,
// palabras clave en dorado), toma (teléfono con la app en modo oscuro o ilustración), subtítulo crema
// con sombra suave y, en las tomas reales, la descripción de lo que hay que grabar.
const CSS_SB = `${D.css}
body{background:#0E0907;padding:40px;display:flex;flex-direction:column;align-items:center;gap:40px}
.frame{width:1080px;height:1920px;position:relative;overflow:hidden;flex:none;color:#FFF4E6;background:radial-gradient(120% 60% at 50% 38%,#2A1C14 0%,#1C130E 46%,#120C08 100%)}
.chips{position:absolute;left:48px;top:48px;right:48px;display:flex;gap:14px;flex-wrap:wrap;z-index:14}
.chip{font:800 30px/1 'Nunito';padding:16px 24px;border-radius:999px;background:rgba(255,244,230,.08);border:2px solid rgba(255,244,230,.22);color:#FFF4E6}
.chip.d{background:#E7B676;border-color:#E7B676;color:#2A1D16}
.overlay{position:absolute;left:56px;right:56px;top:168px;z-index:14;text-align:center;font:900 64px/1.46 'Nunito';letter-spacing:-.01em;color:#FFF4E6}
.overlay span{background:rgba(26,18,13,.72);-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:.05em .34em;border-radius:.3em}
.overlay mark{background:none;color:#E7B676}
.sub{position:absolute;left:90px;right:90px;bottom:236px;z-index:14;text-align:center;font:900 52px/1.2 'Nunito';color:#FFF4E6;text-shadow:0 2px 16px rgba(0,0,0,.9),0 0 4px rgba(0,0,0,.7)}
.toma{position:absolute;left:56px;right:56px;bottom:40px;z-index:14;font:700 28px/1.4 'Nunito';color:rgba(255,244,230,.78);text-align:center;background:rgba(10,6,4,.6);border:1px solid rgba(231,182,118,.28);border-radius:22px;padding:18px 26px}
.crono{position:absolute;right:48px;top:420px;z-index:15;background:#1A120E;border:3px solid #E7B676;color:#FFF4E6;border-radius:28px;padding:18px 26px;font:900 46px/1 'Nunito';box-shadow:0 0 40px rgba(231,182,118,.35),0 20px 40px rgba(0,0,0,.5);display:flex;gap:14px;align-items:center}
.mesa{position:absolute;left:0;right:0;bottom:0;height:820px;z-index:1;background:repeating-linear-gradient(176deg,rgba(255,226,196,.035) 0 3px,rgba(0,0,0,0) 3px 26px),linear-gradient(180deg,#2B1A10 0%,#1B0F08 70%,#120A05 100%);box-shadow:0 -2px 0 rgba(255,226,196,.08)}
.panel{position:absolute;left:60px;width:960px;height:320px;border-radius:34px;overflow:hidden;z-index:4;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 0 0 2px rgba(231,182,118,.18)}
.reloj{position:absolute;left:190px;top:660px;width:700px;height:700px;border-radius:50%;z-index:5;background:radial-gradient(circle at 40% 35%,#3A2619,#1A0F09 70%);border:34px solid #E7B676;box-shadow:0 0 120px rgba(231,182,118,.4),inset 0 0 60px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font:900 84px/1 'Nunito';color:#FFF4E6;text-align:center}
.reloj:before{content:"";position:absolute;top:-130px;left:50%;width:110px;height:80px;margin-left:-55px;background:#E7B676;border-radius:20px}
.reloj:after{content:"";position:absolute;top:-62px;left:50%;width:36px;height:40px;margin-left:-18px;background:#C9914A}
.hoja{width:1600px;background:#1C130E;color:#FFF4E6;padding:80px;display:flex;flex-direction:column;gap:40px}
.hoja h1{font:900 64px/1.05 'Nunito';letter-spacing:-.02em}
.hoja .meta{font:800 28px/1.4 'Nunito';color:#E7B676;margin-bottom:14px}
.hoja .hook{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.hoja .hook div{background:#241811;border:1px solid rgba(231,182,118,.25);border-radius:22px;padding:24px;font:700 25px/1.4 'Nunito';color:rgba(255,244,230,.9)}
.hoja .hook b{display:block;font:800 22px/1 'Nunito';letter-spacing:.08em;text-transform:uppercase;color:#E7B676;margin-bottom:10px}
.esc{display:grid;grid-template-columns:300px 1fr;gap:40px;background:#241811;border:1px solid rgba(231,182,118,.2);border-radius:28px;padding:30px;align-items:start}
.esc img{width:300px;border-radius:18px;display:block}
.esc .t{font:800 24px/1 'Nunito';background:#E7B676;color:#2A1D16;display:inline-block;padding:10px 16px;border-radius:999px}
.esc h2{font:900 44px/1.1 'Nunito';margin:16px 0 14px}
.esc p{font:700 26px/1.42 'Nunito';margin-top:12px;color:rgba(255,244,230,.86)}.esc p b{color:#E7B676;font-weight:900}`;

function overlayHTML(texto, p) {
  const claves = [...(p.claves || []), p.palabra].filter(Boolean);
  return texto.split(' · ').map((linea) => {
    let t = esc(linea).replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>');
    claves.forEach((c) => { t = t.replace(new RegExp(`(^|[^\\p{L}])(${c})(?![\\p{L}])`, 'giu'), '$1<mark>$2</mark>'); });
    return `<span>${t}</span>`;
  }).join('<br>');
}

// Pantalla de chats genérica (sin la interfaz de WhatsApp) con nombres y mensajes borrosos.
function chatsBorrosos(w) {
  const u = (f) => Math.round(w * f);
  const filas = Array.from({ length: 7 }, (_, k) => `<div style="display:flex;gap:${u(0.045)}px;align-items:center"><i style="flex:none;width:${u(0.15)}px;height:${u(0.15)}px;border-radius:50%;background:rgba(244,231,212,.28)"></i><span style="flex:1;display:flex;flex-direction:column;gap:${u(0.025)}px"><b style="height:${u(0.035)}px;width:${55 + ((k * 17) % 35)}%;border-radius:99px;background:rgba(244,231,212,.5)"></b><b style="height:${u(0.03)}px;width:${85 - ((k * 13) % 30)}%;border-radius:99px;background:rgba(244,231,212,.22)"></b></span></div>`).join('');
  return `<div style="position:absolute;inset:0;background:#1E1611"></div><div style="position:absolute;left:7%;right:7%;top:${u(0.2)}px;display:flex;flex-direction:column;gap:${u(0.06)}px;filter:blur(1.8px)">${filas}</div>`;
}

function ilustracion(nombre) {
  if (nombre === 'libreta-chats') {
    return D.brillo(540, 1050, 1300, 0.55) + `<div class="mesa"></div>` + D.libreta({ x: 80, y: 560, w: 660, rot: -8, modo: 'tachones' }) + D.telefono({ html: chatsBorrosos(410), w: 410, x: 600, y: 760, rot: 10, z: 6 });
  }
  if (nombre === 'agitar') {
    const panel1 = `<div class="panel" style="top:470px;background:#1E1611">${chatsBorrosos(960).replace('top:192px', 'top:40px')}</div>` + D.lupa({ x: 760, y: 560, w: 200, z: 7 });
    const panel2 = `<div class="panel" style="top:820px;background:${'#F4E7D4'};background-image:repeating-linear-gradient(180deg,transparent 0 58px,#DCC6A8 58px 61px)"><div style="position:absolute;left:150px;top:96px;font:italic 900 96px/1 'Nunito';color:#8B6B5A;transform:rotate(-4deg)">¿anticipo?<div style="position:absolute;left:-14px;right:-14px;top:50px;height:10px;border-radius:5px;background:#B5523B;transform:rotate(-3deg)"></div></div></div>`;
    const teclas = Array.from({ length: 16 }, (_, k) => `<i style="width:70px;height:70px;border-radius:50%;background:${k % 4 === 3 ? '#E7B676' : '#3A2A20'};box-shadow:${k % 4 === 3 ? '0 0 16px rgba(231,182,118,.45)' : 'none'}"></i>`).join('');
    const panel3 = `<div class="panel" style="top:1170px;background:#0E0907"><div style="position:absolute;left:90px;top:50px;font:900 70px/1 'Nunito';color:rgba(255,244,230,.85)">714 × 1.4</div><div style="position:absolute;right:110px;top:26px;display:grid;grid-template-columns:repeat(4,70px);gap:12px;transform:scale(.82);transform-origin:top right">${teclas}</div></div>` + D.luna({ x: 70, y: 1300, d: 120, z: 6 });
    return D.brillo(540, 900, 1200, 0.35) + panel1 + panel2 + panel3;
  }
  if (nombre === 'cierra-libreta') {
    return D.brillo(760, 900, 1200, 0.85, '#E7B676') + `<div class="mesa"></div>` + D.libreta({ x: 70, y: 820, w: 470, rot: -7, modo: 'cerrada', z: 4 }) + D.telefono({ src: '01-inicio.png', w: 430, x: 580, y: 520, rot: 6, brilloOro: true, z: 6 }) + D.destellos([[560, 600, 34], [1010, 1180, 26]]);
  }
  if (nombre === 'libreta-recetas') {
    return D.brillo(440, 760, 1200, 0.8, '#E7B676') + `<div class="mesa"></div>` + D.libreta({ x: 90, y: 600, w: 620, rot: -5, modo: 'receta', z: 4 }) + D.telefono({ src: '01-inicio.png', w: 340, x: 700, y: 980, rot: 14, z: 6 }) + D.destellos([[880, 760, 30], [140, 560, 24]]);
  }
  if (nombre === 'cronometro') return D.brillo(540, 900, 1200, 0.7, '#E7B676') + `<div class="reloj">[TU<br>TIEMPO]</div>` + D.destellos([[200, 560, 40], [900, 640, 30], [930, 1240, 34]]);
  return '';
}

function tarjetaFinal(p, chips) {
  return `<section class="frame" data-id="tarjeta">${chips || ''}${D.brillo(540, 1100, 1400, 0.55)}${D.goteo({ x: 0, w: 1080, semilla: p.id === 'v1' ? 21 : 27, z: 8 })}
  ${D.lockup(300, 560, 480)}
  <div class="txt" style="left:0;top:820px;width:1080px;text-align:center"><div class="pildora" style="margin-top:0;padding:56px 90px 64px"><span style="font-size:56px">Comenta</span><b style="font-size:168px">${esc(p.palabra)}</b><span style="font-size:56px">y te mando el link</span></div></div>
  ${D.pastel({ x: 360, y: 1420, w: 360 })}${D.destellos([[170, 1240, 40], [920, 1180, 30], [860, 1560, 26]])}<div class="grano"></div></section>`;
}

function escenaHTML(p, e, k) {
  const tipos = { real: 'Toma real', pantalla: 'Grabación de pantalla', tarjeta: 'Tarjeta final' };
  const chips = `<div class="chips"><div class="chip d">Escena ${k + 1} · ${e.t[0]}–${e.t[1]} s</div><div class="chip">${tipos[e.tipoToma]}</div></div>`;
  if (e.tipoToma === 'tarjeta') return tarjetaFinal(p, chips).replace('data-id="tarjeta"', `data-id="e${k + 1}"`);
  const crono = e.cronometro && e.ilustracion !== 'cronometro' ? `<div class="crono"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E7B676" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9M10 2h4M19 6l-1.5 1.5"/></svg>${esc(e.cronometro)}</div>` : '';
  const sub = subtitulos(e.voz)[0] || '';
  let cuerpo = '';
  if (e.tipoToma === 'pantalla' && /pdf/.test(e.captura)) cuerpo = D.brillo(540, 1000, 1300, 0.6) + D.tarjeta({ src: e.captura, w: 940, x: 70, y: 560, rot: -3, radio: 14, papel: true });
  else if (e.tipoToma === 'pantalla') cuerpo = D.brillo(540, 1100, 1300, 0.6) + D.telefono({ src: e.captura, w: 580, x: 250, y: 470, z: 5, brilloOro: true });
  else cuerpo = ilustracion(e.ilustracion) + `<div class="toma">${esc(e.visual)}</div>`;
  return `<section class="frame" data-id="e${k + 1}">${chips}<div class="overlay">${overlayHTML(e.texto, p)}</div>${cuerpo}${crono}<div class="sub">${esc(sub).replace('\n', '<br>')}</div><div class="grano"></div></section>`;
}

function storyboardHTML(p) {
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · storyboard</title>${FUENTES}<style>${CSS_SB}</style></head><body>
${p.escenas.map((e, k) => escenaHTML(p, e, k)).join('\n')}
${tarjetaFinal(p)}
</body></html>`;
}

function hojaHTML(p) {
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · hoja</title>${FUENTES}<style>${CSS_SB}</style></head><body>
<section class="hoja"><div><div class="meta">${esc(p.estructura)} · ${esc(p.duracion)} · ${esc(p.dia)} · ${esc(p.redes.join(', '))} · CTA: ${esc(p.palabra)}</div><h1>${esc(p.titulo)}</h1></div>
<div class="hook"><div><b>Visual hook</b>${esc(p.hook.visual)}</div><div><b>Verbal hook</b>${esc(p.hook.verbal)}</div><div><b>Text overlay</b>${esc(p.hook.texto)}</div></div>
${p.escenas.map((e, k) => `<div class="esc"><img src="${p.id}-escena-${k + 1}.png" alt=""><div><span class="t">${e.t[0]}–${e.t[1]} s</span><h2>${esc(e.nombre)}</h2><p><b>Visual:</b> ${esc(e.visual)}</p><p><b>Voz:</b> ${esc(e.voz)}</p><p><b>Texto en pantalla:</b> ${esc(e.texto)}</p></div></div>`).join('')}
</section></body></html>`;
}

// ─────────────────────────── Subtítulos (SRT) ───────────────────────────
// Máx. 2 líneas por subtítulo y hasta 5 palabras por línea. Corta en comas y puntos, nunca une
// dos oraciones en un mismo subtítulo y evita que una línea termine en palabras débiles ("y", "la", "con"…).
const DEBILES = new Set(['y', 'o', 'e', 'la', 'el', 'los', 'las', 'de', 'del', 'con', 'en', 'a', 'al', 'que', 'tu', 'tus', 'un', 'una', 'por', 'para', 'su', 'sus', 'lo', 'se', 'te', 'qué']);
// Elige los cortes de línea con menor "costo": líneas cortas, cortes a media frase y
// líneas que terminan en palabra débil cuestan más; cortar después de una coma cuesta menos.
function lineas(oracion) {
  const w = oracion.split(/\s+/).filter(Boolean), n = w.length;
  const best = [0], prev = [0];
  for (let j = 1; j <= n; j++) {
    best[j] = Infinity;
    for (let i = Math.max(0, j - 5); i < j; i++) {
      const len = j - i, ult = w[j - 1];
      let c = (5 - len) * (5 - len) * 0.6;
      if (j < n) { c += DEBILES.has(ult.toLowerCase().replace(/[^\p{L}]/gu, '')) ? 12 : 0; c += /[,;:]$/.test(ult) ? -4 : 2; }
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
function srt(p) {
  let n = 0; const out = [];
  p.escenas.forEach((e) => {
    const cues = subtitulos(e.voz); const total = cues.reduce((a, c) => a + c.split(/\s+/).length, 0);
    let t = e.t[0];
    cues.forEach((c) => { const d = (e.t[1] - e.t[0]) * c.split(/\s+/).length / total; out.push(`${++n}\n${ts(t)} --> ${ts(t + d - 0.04)}\n${c}\n`); t += d; });
  });
  return out.join('\n');
}

// ─────────────────────────── Guiones, captions, calendario ───────────────────────────
function guionMD(p) {
  return `# ${p.titulo}

- **Estructura:** ${p.estructura} · **Duración:** ${p.duracion} · **Formato:** ${p.formato}
- **Publicación:** ${p.dia}, ${p.hora} · ${p.redes.join(', ')}
- **Palabra clave del CTA:** ${p.palabra}

## Gancho del primer segundo
| Visual hook | Verbal hook | Text overlay |
|---|---|---|
| ${p.hook.visual} | ${p.hook.verbal} | ${p.hook.texto} |

## Guion
| Tiempo | Escena | Visual | Voz | Texto en pantalla |
|---|---|---|---|---|
${p.escenas.map((e) => `| ${e.t[0]}–${e.t[1]} s | ${e.nombre} | ${e.visual} | ${e.voz} | ${e.texto} |`).join('\n')}

## Subtítulos
Archivo: \`${p.id}-subtitulos.srt\` (tiempos aproximados; ajústalos al audio real).

${p.escenas.map((e) => subtitulos(e.voz).map((c) => '> ' + c.replace('\n', ' / ')).join('\n')).join('\n')}

## Notas de producción
${p.notas.map((n) => '- ' + n).join('\n')}

## Antes de publicar
${p.antes.map((n) => '- [ ] ' + n).join('\n')}
`;
}

function carruselMD(p) {
  const { filas } = contar();
  return `# ${p.titulo}

- **Estructura:** ${p.estructura} · **Formato:** ${p.formato}
- **Publicación:** ${p.dia}, ${p.hora} · ${p.redes.join(', ')}
- **Palabra clave del CTA:** ${p.palabra}

| # | Texto del slide | Palabras | Visual |
|---|---|---|---|
${p.slides.map((s, i) => { const f = filas.find((x) => x.pieza === p.id && x.slide === i + 1); return `| ${i + 1} | ${f.texto} | ${f.palabras} (${f.limite}) | ${s.visual} |`; }).join('\n')}

## Notas
${p.notas.map((n) => '- ' + n).join('\n')}

## Antes de publicar
${p.antes.map((n) => '- [ ] ' + n).join('\n')}
`;
}

function calendarioMD() {
  const orden = [...C.piezas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return `# Calendario · Bloque 01 (semana del 5 al 11 de octubre de 2026)

Horas sugeridas, del centro de México (ajústalas con tus estadísticas). Mercado: México y Latinoamérica. Una palabra clave por pieza para medir cuál trae registros.

| Día | Pieza | Red | Hora | Palabra clave |
|---|---|---|---|---|
${orden.map((p) => `| ${p.dia} | ${p.titulo} (${p.estructura}) | ${p.redes.join(', ')} | ${p.hora} | ${p.palabra} |`).join('\n')}
`;
}

// ─────────────────────────── Render ───────────────────────────
async function render() {
  const { ok } = contar();
  if (!ok) { console.error('Hay slides que no cumplen el conteo de palabras. Corrige contenido.cjs.'); process.exit(1); }
  ['carruseles', 'storyboards', 'guiones', 'captions'].forEach((d) => mk(path.join(BASE, d)));
  // La salida se regenera completa para que no queden PNG de versiones anteriores.
  fs.rmSync(SALIDA, { recursive: true, force: true });
  ['carruseles', 'storyboards', 'captions', 'guiones'].forEach((d) => mk(path.join(SALIDA, d)));

  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
  await routeFonts(ctx);
  const page = await ctx.newPage();
  const abrir = async (file, fuente = 'Nunito') => {
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['800 40px Nunito', '900 40px Nunito', 'italic 900 40px Nunito'].map((f) => document.fonts.load(f).catch(() => 0))).then(() => document.fonts.ready));
    const ok = await page.evaluate((fu) => [...document.fonts].some((x) => x.family === fu && x.status === 'loaded'), fuente);
    if (!ok) throw new Error('No cargó ' + fuente + ' en ' + file);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  };

  for (const p of C.piezas) {
    if (p.tipo === 'carrusel') {
      const n = p.slides.length;
      const f = path.join(BASE, 'carruseles', `${p.id}.html`);
      fs.writeFileSync(f, carruselHTML({ p, ROOT, capDir: CAP, rel: '../capturas/' }));
      const dir = path.join(SALIDA, 'carruseles');
      await page.setViewportSize({ width: n * SW, height: SH });
      await abrir(f);
      for (let i = 0; i < n; i++) await page.screenshot({ path: path.join(dir, `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`), clip: { x: i * SW, y: 0, width: SW, height: SH } });
      const tira = path.join(dir, `${p.id}-tira-completa.png`);
      await page.screenshot({ path: tira });
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tira, '-vf', `scale=${Math.min(n * 300, 2700)}:-1`, path.join(dir, `${p.id}-tira.png`)]);
      fs.unlinkSync(tira);
      fs.writeFileSync(path.join(BASE, 'carruseles', `${p.id}-guion.md`), carruselMD(p));
      console.log('carrusel', p.id, n, 'slides');
    } else {
      const f = path.join(BASE, 'storyboards', `${p.id}-storyboard.html`);
      fs.writeFileSync(f, storyboardHTML(p));
      await page.setViewportSize({ width: 1200, height: 2000 });
      await abrir(f);
      const n = p.escenas.length;
      for (let k = 0; k < n; k++) await page.locator(`section[data-id="e${k + 1}"]`).screenshot({ path: path.join(SALIDA, 'storyboards', `${p.id}-escena-${k + 1}.png`) });
      await page.locator('section[data-id="tarjeta"]').screenshot({ path: path.join(SALIDA, 'storyboards', `${p.id}-tarjeta-final-${p.palabra.toLowerCase()}-1080x1920.png`) });
      const hoja = path.join(SALIDA, 'storyboards', `${p.id}-hoja.html`);
      fs.writeFileSync(hoja, hojaHTML(p));
      await page.setViewportSize({ width: 1700, height: 2000 });
      await abrir(hoja);
      await page.locator('section.hoja').screenshot({ path: path.join(SALIDA, 'storyboards', `${p.id}-storyboard-completo.png`) });
      fs.unlinkSync(hoja);
      fs.writeFileSync(path.join(BASE, 'guiones', `${p.id}-guion.md`), guionMD(p));
      fs.writeFileSync(path.join(BASE, 'guiones', `${p.id}-subtitulos.srt`), srt(p));
      fs.copyFileSync(path.join(BASE, 'guiones', `${p.id}-subtitulos.srt`), path.join(SALIDA, 'guiones', `${p.id}-subtitulos.srt`));
      fs.copyFileSync(path.join(BASE, 'guiones', `${p.id}-guion.md`), path.join(SALIDA, 'guiones', `${p.id}-guion.md`));
      console.log('video', p.id, n, 'escenas');
    }
    for (const [red, fn] of Object.entries(p.captions)) {
      const txt = fn().trim() + '\n';
      fs.writeFileSync(path.join(BASE, 'captions', `${p.id}-${red}.txt`), txt);
      fs.writeFileSync(path.join(SALIDA, 'captions', `${p.id}-${red}.txt`), txt);
    }
    fs.writeFileSync(path.join(BASE, 'captions', `${p.id}-dm-respuesta.txt`), p.dm + '\n');
    fs.writeFileSync(path.join(SALIDA, 'captions', `${p.id}-dm-respuesta.txt`), p.dm + '\n');
    if (p.tipo === 'carrusel') fs.copyFileSync(path.join(BASE, 'carruseles', `${p.id}-guion.md`), path.join(SALIDA, 'guiones', `${p.id}-guion.md`));
  }
  fs.writeFileSync(path.join(BASE, 'calendario.md'), calendarioMD());
  fs.copyFileSync(path.join(BASE, 'calendario.md'), path.join(SALIDA, 'calendario.md'));
  await browser.close();
  comprimir();
}

// El grano de los fondos hace pesados los PNG. pngquant (si está instalado) los reduce ~60 % sin
// diferencia visible, para que el ZIP de la semana quepa en el chat. Si no está, se quedan como están.
function comprimir() {
  try { execFileSync('pngquant', ['--version'], { stdio: 'ignore' }); } catch (e) { console.log('pngquant no está instalado: los PNG quedan sin comprimir'); return; }
  let antes = 0, despues = 0;
  for (const d of ['carruseles', 'storyboards']) {
    for (const f of fs.readdirSync(path.join(SALIDA, d)).filter((x) => x.endsWith('.png'))) {
      const file = path.join(SALIDA, d, f); antes += fs.statSync(file).size;
      try { execFileSync('pngquant', ['--quality=80-98', '--speed', '1', '--force', '--skip-if-larger', '--output', file, file]); } catch (e) { /* calidad no alcanzada: se queda el original */ }
      despues += fs.statSync(file).size;
    }
  }
  console.log(`PNG comprimidos: ${(antes / 1048576).toFixed(1)} MB → ${(despues / 1048576).toFixed(1)} MB`);
}

if (require.main === module) render().catch((e) => { console.error(e); process.exit(1); });
module.exports = { subtitulos, srt };
