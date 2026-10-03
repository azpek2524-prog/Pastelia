// Genera todo el kit a partir de contenido.cjs:
//   - carruseles/*.html (fuente) y salida/.../carruseles/*.png (1080×1350)
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
function pngSize(f) { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
const svgFile = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"');
const LOCKUP_OSCURO = svgFile('pastelia-lockup-oscuro.svg');

const FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">';
const TOKENS = `:root{--marron:#7B5B4B;--crema:#FFF4E6;--dorado:#E7B676;--tinta:#5A4236;--campo:#F5E7D0;--tinte:#F1E6CE;--blanco:#FFFFFF;--suave:rgba(90,66,54,.66);--display:'Fredoka','Nunito',system-ui,sans-serif;--texto:'Nunito',system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#CDBBA6;padding:40px;display:flex;flex-direction:column;align-items:center;gap:40px;font-family:var(--texto)}
.recorte{position:relative;overflow:hidden;flex:none}.recorte img{position:absolute;max-width:none;display:block}`;

// ─────────────────────────── Carruseles ───────────────────────────
// Estilo App Store (herramientas/carrusel-pro.cjs), una versión por paleta (herramientas/paletas.cjs).
// Las pantallas de cada paleta se capturan con la app en ese color de marca:
//   PASTELIA_COLOR=<app> PASTELIA_OUT=salida/capturas/<paleta> node herramientas/capturar-app.cjs
const { carruselProHTML, W: SW, H: SH } = require('./carrusel-pro.cjs');
const PALETAS = require('./paletas.cjs');
const CAP_PALETAS = path.join(BASE, 'salida', 'capturas');

// ─────────────────────────── Storyboards ───────────────────────────
const CSS_SB = `${TOKENS}
.frame{width:1080px;height:1920px;position:relative;overflow:hidden;background:#2B201A;color:var(--crema)}
.frame.claro{background:var(--crema);color:var(--tinta)}
.chips{position:absolute;left:48px;top:48px;right:48px;display:flex;gap:14px;flex-wrap:wrap;z-index:5}
.chip{font:800 30px/1 var(--texto);padding:16px 24px;border-radius:999px;background:var(--crema);color:var(--tinta)}
.chip.d{background:var(--dorado)}
.overlay{position:absolute;left:60px;right:60px;top:150px;z-index:4;text-align:center;font:700 70px/1.12 var(--display);color:#fff;text-shadow:0 0 1px #2B201A,0 4px 0 #2B201A,0 -3px 0 #2B201A,3px 0 0 #2B201A,-3px 0 0 #2B201A,0 10px 30px rgba(0,0,0,.45);text-wrap:balance}
.overlay mark{background:none;color:var(--dorado)}
.sub{position:absolute;left:90px;right:90px;bottom:210px;z-index:4;text-align:center;font:900 50px/1.2 var(--texto);color:#fff;text-shadow:0 0 2px #000,0 3px 0 #1d1511,0 -2px 0 #1d1511,2px 0 0 #1d1511,-2px 0 0 #1d1511}
.telefono{position:absolute;left:50%;top:440px;width:580px;height:1256px;margin-left:-290px;border-radius:84px;background:#1d1511;padding:20px;box-shadow:0 40px 90px rgba(0,0,0,.5)}
.telefono .pantalla{width:100%;height:100%;border-radius:66px;overflow:hidden;background:var(--crema)}
.telefono img{width:100%;display:block}
.crono{position:absolute;right:40px;top:470px;z-index:6;background:var(--crema);color:var(--tinta);border-radius:28px;padding:20px 28px;font:700 46px/1 var(--display);box-shadow:0 18px 40px rgba(0,0,0,.4);display:flex;gap:14px;align-items:center}
.ilus{position:absolute;inset:450px 60px 400px;display:flex;align-items:center;justify-content:center}
.libreta{width:620px;height:820px;background:#FFF9EF;border-radius:20px;transform:rotate(-7deg);padding:70px 60px;background-image:repeating-linear-gradient(transparent 0 66px,#E9D9C1 66px 69px);box-shadow:0 30px 60px rgba(0,0,0,.45);position:relative}
.libreta .renglon{height:14px;border-radius:7px;background:#8B6B5A;margin:26px 0 40px;opacity:.75}
.libreta .tachado{position:relative}.libreta .tachado:after{content:"";position:absolute;left:-10px;right:-10px;top:4px;height:6px;background:#B5523B;transform:rotate(-3deg)}
.cel{position:absolute;right:30px;bottom:-30px;width:380px;height:720px;border-radius:52px;background:#1d1511;padding:14px;transform:rotate(9deg);box-shadow:0 30px 60px rgba(0,0,0,.5)}
.cel .p{width:100%;height:100%;border-radius:40px;background:#F6EEE3;padding:40px 24px;display:flex;flex-direction:column;gap:22px;filter:blur(1.4px)}
.chat{display:flex;gap:16px;align-items:center}.chat i{width:62px;height:62px;border-radius:50%;background:#CDB8A2;flex:none}.chat span{flex:1;display:flex;flex-direction:column;gap:10px}.chat b{height:14px;border-radius:7px;background:#9C8270;width:70%}.chat u{height:12px;border-radius:6px;background:#D6C6B6}
.panel3{display:flex;flex-direction:column;gap:30px;width:100%}
.mini{height:330px;border-radius:30px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.calc{display:grid;grid-template-columns:repeat(4,80px);gap:16px}.calc i{height:80px;border-radius:50%;background:#4A3A30}.calc i:nth-child(4n){background:var(--dorado)}
.reloj{width:640px;height:640px;border-radius:50%;background:var(--crema);border:34px solid var(--marron);display:flex;align-items:center;justify-content:center;font:700 92px/1 var(--display);color:var(--tinta);position:relative}
.reloj:before{content:"";position:absolute;top:-110px;left:50%;width:90px;height:70px;margin-left:-45px;background:var(--marron);border-radius:18px}
.toma{position:absolute;left:60px;right:60px;bottom:40px;z-index:4;font:700 30px/1.35 var(--texto);color:rgba(255,244,230,.8);text-align:center}
.final{background:linear-gradient(165deg,var(--tinta),var(--marron));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--crema)}
.final .logo{width:640px;height:168px}
.final .c{font:800 56px/1 var(--texto);margin-top:150px;opacity:.9}
.final .k{margin-top:36px;background:var(--dorado);color:var(--tinta);font:700 150px/1 var(--display);padding:40px 70px;border-radius:44px;letter-spacing:.02em}
.final .y{font:800 52px/1.2 var(--texto);margin-top:40px;opacity:.9}
.hoja{width:1600px;background:var(--crema);color:var(--tinta);padding:80px;display:flex;flex-direction:column;gap:40px}
.hoja h1{font:600 64px/1.05 var(--display)}
.hoja .meta{font:800 28px/1.4 var(--texto);color:var(--marron)}
.hoja .hook{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.hoja .hook div{background:var(--blanco);border-radius:22px;padding:24px;font:700 25px/1.4 var(--texto)}
.hoja .hook b{display:block;font:800 22px/1 var(--texto);letter-spacing:.08em;text-transform:uppercase;color:var(--marron);margin-bottom:10px}
.esc{display:grid;grid-template-columns:300px 1fr;gap:40px;background:var(--blanco);border-radius:28px;padding:30px;align-items:start}
.esc img{width:300px;border-radius:18px;display:block}
.esc .t{font:800 24px/1 var(--texto);background:var(--dorado);display:inline-block;padding:10px 16px;border-radius:999px}
.esc h2{font:600 44px/1.1 var(--display);margin:16px 0 14px}
.esc p{font:700 26px/1.42 var(--texto);margin-top:12px;color:var(--tinta)}.esc p b{color:var(--marron);font-weight:900}`;

function overlayHTML(texto, palabra) {
  let t = esc(texto).replace(/ · /g, '<br>');
  if (palabra) t = t.replace(new RegExp(palabra, 'g'), `<mark>${palabra}</mark>`);
  return t.replace(/\[([^\]]+)\]/g, '<mark>[$1]</mark>');
}

function ilustracion(nombre) {
  const chats = Array.from({ length: 8 }, () => '<div class="chat"><i></i><span><b></b><u></u></span></div>').join('');
  if (nombre === 'libreta-chats') {
    return `<div class="ilus"><div class="libreta">${[[0, 82], [1, 64], [0, 90], [1, 58], [0, 76], [0, 52], [1, 86], [0, 68]].map(([t, w]) => `<div class="renglon${t ? ' tachado' : ''}" style="width:${w}%"></div>`).join('')}</div><div class="cel"><div class="p">${chats}</div></div></div>`;
  }
  if (nombre === 'agitar') {
    return `<div class="ilus"><div class="panel3">
      <div class="mini" style="background:#F6EEE3"><div style="width:80%;display:flex;flex-direction:column;gap:18px;filter:blur(1.2px)">${chats.slice(0, chats.length / 2)}</div></div>
      <div class="mini" style="background:#FFF9EF;background-image:repeating-linear-gradient(transparent 0 56px,#E9D9C1 56px 59px)"><div style="font:italic 800 84px/1 var(--texto);color:#8B6B5A;transform:rotate(-4deg);position:relative">¿anticipo?<div style="position:absolute;left:-12px;right:-12px;top:44px;height:8px;background:#B5523B;transform:rotate(-4deg)"></div></div></div>
      <div class="mini" style="background:#15100C"><div class="calc">${'<i></i>'.repeat(16)}</div><div style="position:absolute;right:44px;top:34px;width:70px;height:70px;border-radius:50%;box-shadow:-18px 10px 0 0 var(--dorado)"></div></div></div></div>`;
  }
  if (nombre === 'cronometro') return '<div class="ilus"><div class="reloj">[TU TIEMPO]</div></div>';
  return '';
}

function tarjetaFinal(palabra, chips) {
  return `<section class="frame final" data-id="tarjeta">${chips || ''}<div class="logo">${LOCKUP_OSCURO}</div><div class="c">Comenta</div><div class="k">${esc(palabra)}</div><div class="y">y te mando el link</div></section>`;
}

function escenaHTML(p, e, k) {
  const rel = '../capturas/';
  const tipos = { real: 'Toma real', pantalla: 'Grabación de pantalla', tarjeta: 'Tarjeta final' };
  const chips = `<div class="chips"><div class="chip d">Escena ${k + 1} · ${e.t[0]}–${e.t[1]} s</div><div class="chip">${tipos[e.tipoToma]}</div></div>`;
  if (e.tipoToma === 'tarjeta') return tarjetaFinal(p.palabra, chips).replace('data-id="tarjeta"', `data-id="e${k + 1}"`);
  const crono = e.cronometro ? `<div class="crono"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5A4236" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 13V9M10 2h4M19 6l-1.5 1.5"/></svg>${esc(e.cronometro)}</div>` : '';
  const sub = subtitulos(e.voz)[0] || '';
  let cuerpo = '';
  if (e.tipoToma === 'pantalla') cuerpo = `<div class="telefono"><div class="pantalla"><img src="${rel}${e.captura}" alt=""></div></div>`;
  else cuerpo = ilustracion(e.ilustracion) + `<div class="toma">${esc(e.visual)}</div>`;
  return `<section class="frame" data-id="e${k + 1}">${chips}<div class="overlay">${overlayHTML(e.texto, p.palabra)}</div>${cuerpo}${crono}<div class="sub">${esc(sub).replace('\n', '<br>')}</div></section>`;
}

function storyboardHTML(p) {
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · storyboard</title>${FUENTES}<style>${CSS_SB}</style></head><body>
${p.escenas.map((e, k) => escenaHTML(p, e, k)).join('\n')}
${tarjetaFinal(p.palabra)}
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
  ['carruseles', 'storyboards', 'captions', 'guiones'].forEach((d) => mk(path.join(SALIDA, d)));

  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 1400 }, deviceScaleFactor: 1 });
  await routeFonts(ctx);
  const page = await ctx.newPage();
  const abrir = async (file, fuente = 'Fredoka') => {
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all(['600 40px Fredoka', '800 40px Nunito', '900 40px Nunito'].map((f) => document.fonts.load(f).catch(() => 0))).then(() => document.fonts.ready));
    const ok = await page.evaluate((fu) => [...document.fonts].some((x) => x.family === fu && x.status === 'loaded'), fuente);
    if (!ok) throw new Error('No cargó ' + fuente + ' en ' + file);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  };

  for (const p of C.piezas) {
    if (p.tipo === 'carrusel') {
      const n = p.slides.length;
      for (const pal of PALETAS) {
        const capDir = path.join(CAP_PALETAS, pal.id);
        if (!fs.existsSync(path.join(capDir, '10-pdf-comprobante.png'))) throw new Error(`Faltan las capturas de la paleta ${pal.id}: corre capturar-app.cjs con PASTELIA_COLOR=${pal.app} PASTELIA_OUT=${path.relative(ROOT, capDir)}`);
        const f = path.join(BASE, 'carruseles', `${p.id}-${pal.id}.html`);
        fs.writeFileSync(f, carruselProHTML({ p, paleta: pal, ROOT, capDir, rel: `../salida/capturas/${pal.id}/` }));
        const dir = path.join(SALIDA, 'carruseles', pal.id); mk(dir);
        await page.setViewportSize({ width: n * SW, height: SH });
        await abrir(f, 'Nunito');
        for (let i = 0; i < n; i++) await page.screenshot({ path: path.join(dir, `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`), clip: { x: i * SW, y: 0, width: SW, height: SH } });
        const tira = path.join(dir, `${p.id}-tira-completa.png`);
        await page.screenshot({ path: tira });
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tira, '-vf', `scale=${Math.min(n * 300, 2700)}:-1`, path.join(dir, `${p.id}-tira.png`)]);
        fs.unlinkSync(tira);
      }
      fs.writeFileSync(path.join(BASE, 'carruseles', `${p.id}-guion.md`), carruselMD(p));
      console.log('carrusel', p.id, n, 'slides ×', PALETAS.length, 'paletas');
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
}

if (require.main === module) render().catch((e) => { console.error(e); process.exit(1); });
module.exports = { subtitulos, srt };
