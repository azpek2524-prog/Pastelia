// Arma la página "Kit de contenido Pastelia" (kit/index.html), el mapa de archivos para publicarla
// (kit/archivos.json) y los ZIP de la semana, uno por paleta (salida/…-<paleta>.zip). Correr después de generar.cjs.
// Uso: node marketing/2026-10-organizacion-costeo/herramientas/generar-kit.cjs
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const C = require('../contenido.cjs');
const { contar } = require('./contar-palabras.cjs');
const { subtitulos } = require('./generar.cjs');
const PALETAS = require('./paletas.cjs');

const BASE = path.resolve(__dirname, '..');
const ROOT = path.resolve(BASE, '../..');
const SEMANA = 'semana-2026-10-05';
const SALIDA = path.join(BASE, 'salida', SEMANA);
const ZIP = `pastelia-bloque01-${SEMANA}.zip`;
const rel = (p) => path.relative(ROOT, p);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LOCKUP = fs.readFileSync(path.join(ROOT, 'pastelia-lockup.svg'), 'utf8').replace(/width="\d+" height="\d+"/, 'width="190" height="50" role="img" aria-label="Pastelia"').replace('fill="#4A342E">Pastelia', 'fill="currentColor">Pastelia');

const archivos = {};
function img(sub, nombre) { const k = `img/${nombre}`; archivos[k] = rel(path.join(SALIDA, sub, nombre)); return k; }
function imgPaleta(pal, nombre) { const k = `img/${pal}/${nombre}`; archivos[k] = rel(path.join(SALIDA, 'carruseles', pal, nombre)); return k; }
const muestra = (pal) => `<i class="muestra" style="background:linear-gradient(135deg,${pal.c1},${pal.c2})"></i>`;
function selector() {
  return `<div class="selector" role="group" aria-label="Paleta de los carruseles">${PALETAS.map((pal, k) => `<button type="button" class="opcion" data-elegir-paleta="${pal.id}" aria-pressed="${k === 0}">${muestra(pal)}${esc(pal.nombre)}</button>`).join('')}</div>`;
}

let nCopia = 0;
function copiable(titulo, texto, extraClase) {
  const id = 'copia-' + (++nCopia);
  return `<div class="copiable ${extraClase || ''}"><div class="copiable-cab"><span>${esc(titulo)}</span><button type="button" class="btn" data-copiar="${id}">Copiar texto</button></div><pre id="${id}">${esc(texto)}</pre></div>`;
}
// Enlace real (abre el archivo en otra pestaña); si el visor permite descargas, el script guarda el archivo.
function descargar(k, nombre, etiqueta, clase) { return `<a class="btn ${clase == null ? 'btn-sec' : clase}" href="${esc(k)}" target="_blank" rel="noopener" data-descargar="${esc(k)}" data-nombre="${esc(nombre)}">${esc(etiqueta || 'Descargar PNG')}</a>`; }
function chips(p) {
  return `<div class="chips"><span class="chip chip-fecha">${esc(p.dia)} · ${esc(p.hora)}</span>${p.redes.map((r) => `<span class="chip">${esc(r)}</span>`).join('')}<span class="chip">${esc(p.formato)}</span><span class="chip chip-cta">CTA: ${esc(p.palabra)}</span></div>`;
}
function antes(p) {
  return `<div class="aviso"><h4>Antes de publicar</h4><ul>${p.antes.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>`;
}
function captions(p) {
  const nombres = { instagram: 'Instagram', tiktok: 'TikTok', facebook: 'Facebook' };
  return `<h4>Captions</h4><div class="captions">${Object.entries(p.captions).map(([r, fn]) => copiable(nombres[r], fn().trim())).join('')}</div>
  <h4>Respuesta por DM a quien comente ${esc(p.palabra)}</h4>${copiable('Mensaje directo (pega tu URL de prueba)', p.dm)}`;
}

function video(p) {
  const frames = p.escenas.map((e, k) => {
    const nombre = `${p.id}-escena-${k + 1}.png`; const key = img('storyboards', nombre);
    return `<figure class="frame"><img src="${key}" alt="Escena ${k + 1}: ${esc(e.nombre)}" loading="lazy" width="1080" height="1920"><figcaption><b>${e.t[0]}–${e.t[1]} s · ${esc(e.nombre)}</b>${descargar(key, nombre)}</figcaption></figure>`;
  }).join('');
  const tarjeta = `${p.id}-tarjeta-final-${p.palabra.toLowerCase()}-1080x1920.png`, kt = img('storyboards', tarjeta);
  const hoja = `${p.id}-storyboard-completo.png`, kh = img('storyboards', hoja);
  const srt = fs.readFileSync(path.join(BASE, 'guiones', `${p.id}-subtitulos.srt`), 'utf8');
  return `<article class="pieza" id="${p.id}">
  <p class="eyebrow">Video · ${esc(p.estructura)} · ${esc(p.duracion)}</p>
  <h3>${esc(p.titulo)}</h3>
  ${chips(p)}
  <div class="hook"><div><span>Visual hook</span>${esc(p.hook.visual)}</div><div><span>Verbal hook</span>${esc(p.hook.verbal)}</div><div><span>Text overlay</span>${esc(p.hook.texto)}</div></div>
  <h4>Guion</h4>
  <div class="tabla-envoltura"><table class="guion"><thead><tr><th>Tiempo</th><th>Visual</th><th>Voz</th><th>Texto en pantalla</th></tr></thead><tbody>
  ${p.escenas.map((e) => `<tr><td class="num">${e.t[0]}–${e.t[1]} s<br><small>${esc(e.nombre)}</small></td><td>${esc(e.visual)}</td><td>${esc(e.voz)}</td><td>${esc(e.texto)}</td></tr>`).join('')}
  </tbody></table></div>
  <h4>Storyboard por escena</h4>
  <p class="ayuda">Sin clips todavía: estas escenas muestran qué grabar. Las pantallas son capturas reales de la app con datos de ejemplo.</p>
  <div class="carril">${frames}</div>
  <div class="extras">
    <figure class="mini"><img src="${kt}" alt="Tarjeta final ${esc(p.palabra)}" loading="lazy" width="1080" height="1920"><figcaption><b>Tarjeta final lista para el Reel</b>${descargar(kt, tarjeta)}</figcaption></figure>
    <div class="col">
      <h4>Notas de producción</h4><ul>${p.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      <p>${descargar(kh, hoja, 'Descargar storyboard completo')}</p>
    </div>
  </div>
  ${copiable('Subtítulos (.srt, tiempos aproximados)', srt, 'srt')}
  ${captions(p)}
  ${antes(p)}
</article>`;
}

function carrusel(p) {
  const { filas } = contar();
  const paneles = PALETAS.map((pal, k) => {
    const slides = p.slides.map((s, i) => {
      const nombre = `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`; const key = imgPaleta(pal.id, nombre);
      return `<figure class="slide"><img src="${key}" alt="Slide ${i + 1}, paleta ${esc(pal.nombre)}" loading="lazy" width="1080" height="1350"><figcaption><b>${i + 1} / ${p.slides.length}</b>${descargar(key, `${p.id}-${pal.id}-slide-${String(i + 1).padStart(2, '0')}.png`)}</figcaption></figure>`;
    }).join('');
    const tira = imgPaleta(pal.id, `${p.id}-tira.png`);
    return `<div class="panel-paleta" data-paleta="${pal.id}"${k ? ' hidden' : ''}>
      <p class="ayuda">Tira completa: así se ve el carrusel continuo al deslizar.</p>
      <div class="tira"><img src="${tira}" alt="Carrusel completo, paleta ${esc(pal.nombre)}" loading="lazy"></div>
      <div class="carril carril-slides">${slides}</div></div>`;
  }).join('');
  return `<article class="pieza" id="${p.id}">
  <p class="eyebrow">Carrusel · ${esc(p.estructura)}</p>
  <h3>${esc(p.titulo)}</h3>
  ${chips(p)}
  ${selector()}
  ${paneles}
  <h4>Slides, palabras y visual</h4>
  <div class="tabla-envoltura"><table class="guion"><thead><tr><th>#</th><th>Texto</th><th>Palabras</th><th>Visual</th></tr></thead><tbody>
  ${p.slides.map((s, i) => { const f = filas.find((x) => x.pieza === p.id && x.slide === i + 1); return `<tr><td class="num">${i + 1}</td><td>${esc(f.texto)}</td><td class="num">${f.palabras} <small>(${esc(f.limite)}) ${f.cumple ? '✓' : '✗'}</small></td><td>${esc(s.visual)}</td></tr>`; }).join('')}
  </tbody></table></div>
  <h4>Notas</h4><ul>${p.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  ${captions(p)}
  ${antes(p)}
</article>`;
}

function diaCorto(dia) { const [d, n, , m] = dia.split(' '); return `${d.slice(0, 3)} ${n} ${m.slice(0, 3)}`; }

function pagina() {
  const orden = [...C.piezas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const planillaKey = 'descargas/pastelia-bloque01-medicion.csv'; archivos[planillaKey] = rel(path.join(SALIDA, 'medicion.csv'));
  return `<title>Kit de contenido Pastelia</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800;900&display=swap">
<style>
/* Layout: una columna de lectura con carriles horizontales para slides y escenas; la marca de Pastelia (CLAUDE.md). */
:root{
  --fondo:#FFF4E6; --papel:#FFFFFF; --campo:#F5E7D0; --tinte:#F1E6CE;
  --tinta:#5A4236; --marron:#7B5B4B; --suave:#8A7062; --dorado:#E7B676; --dorado-tinta:#5A4236;
  --linea:rgba(123,91,75,.16); --aviso:#FBEBD2; --aviso-borde:#E7B676;
  --display:'Fredoka','Nunito',system-ui,sans-serif; --texto:'Nunito',system-ui,-apple-system,'Segoe UI',sans-serif; --mono:ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --fondo:#1C1511; --papel:#271E18; --campo:#33281F; --tinte:#3A2E25;
  --tinta:#F6EADB; --marron:#E9D6C2; --suave:#BFA894; --dorado:#E7B676; --dorado-tinta:#2A1F17;
  --linea:rgba(246,234,219,.14); --aviso:#3A2C1C; --aviso-borde:#B98A4C; color-scheme:dark }}
:root[data-theme="dark"]{
  --fondo:#1C1511; --papel:#271E18; --campo:#33281F; --tinte:#3A2E25;
  --tinta:#F6EADB; --marron:#E9D6C2; --suave:#BFA894; --dorado:#E7B676; --dorado-tinta:#2A1F17;
  --linea:rgba(246,234,219,.14); --aviso:#3A2C1C; --aviso-borde:#B98A4C; color-scheme:dark }
*{box-sizing:border-box}
body{background:var(--fondo);color:var(--tinta);font:600 16px/1.55 var(--texto);margin:0}
.envoltura{max-width:1080px;margin:0 auto;padding-inline:20px;padding-block:28px 64px}
header.cab{display:flex;flex-direction:column;gap:14px;padding-block:8px 28px;border-bottom:1px solid var(--linea)}
header.cab svg{color:var(--tinta)}
h1{font:600 clamp(34px,6vw,56px)/1.02 var(--display);margin:0;letter-spacing:-.01em;text-wrap:balance}
h2{font:600 30px/1.1 var(--display);margin:0 0 16px;text-wrap:balance}
h3{font:600 clamp(26px,4vw,36px)/1.1 var(--display);margin:4px 0 14px;text-wrap:balance}
h4{font:800 13px/1.2 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin:30px 0 12px}
.bajada{font-size:18px;color:var(--marron);max-width:62ch;margin:0}
.eyebrow{font:800 13px/1 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin:0}
section{padding-block:36px;border-bottom:1px solid var(--linea)}
.indice{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.indice a{display:inline-block;padding:8px 14px;border-radius:999px;background:var(--campo);color:var(--tinta);text-decoration:none;font-weight:800;font-size:14px}
.indice a:focus-visible,.btn:focus-visible,summary:focus-visible{outline:3px solid var(--dorado);outline-offset:2px}
.tabla-envoltura{overflow-x:auto;border:1px solid var(--linea);border-radius:14px;background:var(--papel)}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:12px 14px;border-bottom:1px solid var(--linea)}
thead th{font:800 12px/1.2 var(--texto);text-transform:uppercase;letter-spacing:.07em;color:var(--suave);background:var(--tinte)}
tbody tr:last-child td,tbody tr:last-child th{border-bottom:0}
td.num{white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:800}
td small{color:var(--suave);font-weight:700}
table.guion td{min-width:180px}
table.guion td.num{min-width:0}
table.cal td:nth-child(2){min-width:220px}table.cal td:nth-child(3){min-width:170px}
.palabra{display:inline-block;font:700 15px/1 var(--display);letter-spacing:.04em;background:var(--dorado);color:var(--dorado-tinta);padding:6px 10px;border-radius:8px}
.confirmar{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.confirmar div{background:var(--aviso);border:1px solid var(--aviso-borde);border-radius:14px;padding:14px 16px;min-width:0}
.confirmar b{display:block;font:600 18px/1.2 var(--display);margin-bottom:4px}
.pieza{padding-block:40px;border-bottom:1px solid var(--linea)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font:800 13px/1 var(--texto);padding:8px 12px;border-radius:999px;background:var(--campo);color:var(--tinta)}
.chip-fecha{background:var(--tinta);color:var(--fondo)}
.chip-cta{background:var(--dorado);color:var(--dorado-tinta)}
.hook{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:20px}
.hook div{background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:14px 16px;min-width:0}
.hook span{display:block;font:800 12px/1 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin-bottom:8px}
.ayuda{color:var(--suave);margin:-4px 0 12px;font-size:15px}
.carril{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px}
.carril figure{margin:0;flex:none;scroll-snap-align:start;display:flex;flex-direction:column;gap:8px}
.frame{width:min(200px,46vw)}.slide{width:min(280px,72vw)}
.selector{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 14px}
.opcion{appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font:800 14px/1 var(--texto);padding:9px 14px 9px 9px;border-radius:999px;border:2px solid var(--linea);background:var(--papel);color:var(--tinta)}
.opcion[aria-pressed="true"]{border-color:var(--tinta)}
.opcion:focus-visible{outline:3px solid var(--dorado);outline-offset:2px}
.muestra{display:inline-block;width:22px;height:22px;border-radius:50%;flex:none}
.tira{overflow-x:auto;border-radius:12px;border:1px solid var(--linea);margin-bottom:14px;background:var(--campo)}
.tira img{display:block;height:300px;width:auto;max-width:none}
.paletas{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.paleta{background:var(--papel);border:1px solid var(--linea);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
.paleta .portadas{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.paleta .portadas img{width:100%;height:auto;display:block;border-radius:8px}
.paleta h3{font-size:22px;margin:0;display:flex;align-items:center;gap:8px}
.paleta .hex{font:500 12px/1.4 var(--mono);color:var(--suave)}
.carril img,.mini img{width:100%;height:auto;display:block;border-radius:12px;border:1px solid var(--linea);background:var(--campo)}
figcaption{display:flex;flex-direction:column;gap:6px;font-size:13px}
figcaption b{font-weight:800}
.extras{display:grid;grid-template-columns:minmax(0,200px) minmax(0,1fr);gap:24px;margin-top:20px;align-items:start}
.mini{margin:0;display:flex;flex-direction:column;gap:8px}
.col{min-width:0}
.col h4{margin-top:0}
ul{padding-left:20px;margin:0}li{margin:6px 0}
.btn{appearance:none;border:0;cursor:pointer;font:800 13px/1 var(--texto);padding:10px 14px;border-radius:10px;background:var(--tinta);color:var(--fondo);align-self:flex-start;text-decoration:none;display:inline-block}
.btn-sec{background:var(--campo);color:var(--tinta)}
.btn[data-estado="ok"]{background:var(--dorado);color:var(--dorado-tinta)}
.captions{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.copiable{background:var(--papel);border:1px solid var(--linea);border-radius:14px;overflow:hidden;min-width:0;margin-top:12px}
.captions .copiable{margin-top:0}
.copiable-cab{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px 10px 16px;background:var(--tinte);font-weight:800}
.copiable pre{margin:0;padding:14px 16px;white-space:pre-wrap;word-break:break-word;font:600 14.5px/1.55 var(--texto);max-height:360px;overflow:auto}
.srt pre{font:500 13px/1.45 var(--mono)}
details.links{margin-top:12px}details summary{cursor:pointer;font-weight:800;color:var(--marron)}
details .tabla-envoltura{margin-top:10px}
code{font:500 13px/1.4 var(--mono);word-break:break-all}
.aviso{margin-top:24px;background:var(--aviso);border:1px solid var(--aviso-borde);border-radius:14px;padding:16px 18px}
.aviso h4{margin:0 0 8px;color:var(--tinta)}
.formula{font:600 20px/1.4 var(--display);background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:16px 18px;margin:0 0 14px}
.zip{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:16px}
footer{padding-top:28px;color:var(--suave);font-size:14px}
@media (max-width:640px){.extras{grid-template-columns:1fr}.mini{max-width:220px}}
@media (prefers-reduced-motion:no-preference){.carril{scroll-behavior:smooth}}
</style>

<div class="envoltura">
<header class="cab">
  ${LOCKUP}
  <p class="eyebrow">Bloque 01 · Organización y costeo · semana del 5 al 11 de octubre de 2026</p>
  <h1>Kit de contenido Pastelia</h1>
  <p class="bajada">Objetivo: conseguir usuarias atacando dos dolores, organizarse con libreta y WhatsApp, y no saber cuánto cobrar. Dos videos y dos carruseles, cada uno con su palabra clave para medir cuál trae registros.</p>
  <ul class="indice">${orden.map((p) => `<li><a href="#${p.id}">${esc(p.dia.split(' ')[0])} · ${esc(p.tipo === 'video' ? 'Video' : 'Carrusel')} ${esc(p.palabra)}</a></li>`).join('')}<li><a href="#calendario">Calendario</a></li><li><a href="#paletas">Paletas</a></li><li><a href="#medir">Cómo medir</a></li><li><a href="#numeros">Números</a></li><li><a href="#material">Material</a></li></ul>
</header>

<section id="confirmar">
  <h2>Datos por confirmar</h2>
  <div class="confirmar">${C.porConfirmar.map((d) => `<div><b>${esc(d.campo)}</b>${esc(d.estado)}</div>`).join('')}</div>
</section>

<section id="calendario">
  <h2>Calendario de publicación</h2>
  <div class="tabla-envoltura"><table class="cal"><thead><tr><th>Día</th><th>Pieza</th><th>Red</th><th>Hora (centro de México)</th><th>Palabra clave</th></tr></thead><tbody>
  ${orden.map((p) => `<tr><td class="num">${esc(diaCorto(p.dia))}</td><td><a href="#${p.id}" style="color:inherit">${esc(p.titulo)}</a><br><small>${esc(p.tipo === 'video' ? 'Video' : 'Carrusel')} · ${esc(p.estructura)}</small></td><td>${esc(p.redes.join(', '))}</td><td class="num">${esc(p.hora)}</td><td><span class="palabra">${esc(p.palabra)}</span></td></tr>`).join('')}
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Horas sugeridas; ajústalas con las estadísticas de tus cuentas.</p>
  <p class="ayuda">El ZIP de la semana va como archivo en el chat, uno por paleta (${esc(ZIP.replace('.zip', '-<paleta>.zip'))}): PNG, captions .txt, guiones, subtítulos .srt, calendario y plantilla de medición. Sin MP4 todavía: faltan tus clips.</p>
</section>

<section id="paletas">
  <h2>Elige la paleta de los carruseles</h2>
  <p class="bajada">Mismo texto y mismas capturas reales en cuatro paletas. En cada una, el teléfono muestra la app con ese color de marca, que tú cambias en Mi negocio. Dime cuál te gusta y la dejo como la paleta de marketing.</p>
  <div class="paletas" style="margin-top:18px">${PALETAS.map((pal) => `<div class="paleta"><h3>${muestra(pal)}${esc(pal.nombre)}</h3>
    <div class="portadas"><img src="${imgPaleta(pal.id, 'c1-slide-01.png')}" alt="Portada COSTEO en ${esc(pal.nombre)}" loading="lazy" width="1080" height="1350"><img src="${imgPaleta(pal.id, 'c2-slide-01.png')}" alt="Portada ANTICIPO en ${esc(pal.nombre)}" loading="lazy" width="1080" height="1350"></div>
    <span class="hex">${esc(pal.c1)} → ${esc(pal.c2)} · app ${esc(pal.app)}</span>
    <button type="button" class="btn btn-sec" data-elegir-paleta="${pal.id}">Ver los carruseles en ${esc(pal.nombre)}</button></div>`).join('')}</div>
</section>

<section id="medir">
  <h2>Cómo medir qué pieza trae registros</h2>
  <p class="bajada">Todavía no hay landing ni analítica en la app, así que cada pieza usa su propia palabra clave. Cuenta tres cosas por palabra:</p>
  <div class="tabla-envoltura" style="margin-top:16px"><table><thead><tr><th>Palabra</th><th>Pieza</th><th>Comentarios con la palabra</th><th>DM enviados</th><th>Cuentas creadas</th></tr></thead><tbody>
  ${orden.map((p) => `<tr><td><span class="palabra">${esc(p.palabra)}</span></td><td>${esc(p.tipo === 'video' ? 'Video' : 'Carrusel')} · ${esc(diaCorto(p.dia))}</td><td class="num">—</td><td class="num">—</td><td class="num">—</td></tr>`).join('')}
  </tbody></table></div>
  <ul style="margin-top:14px">
    <li>Responde cada comentario con la palabra y manda el DM el mismo día.</li>
    <li>"Cuentas creadas": pregunta en el DM si ya se registró, o compara las altas nuevas en Firebase (Authentication) con los días en que mandaste cada link.</li>
    <li>Al final de la semana, la palabra con más cuentas creadas te dice qué tema repetir en el Bloque 02.</li>
  </ul>
  <div class="zip">${descargar(planillaKey, 'pastelia-bloque01-medicion.csv', 'Descargar plantilla (CSV)', '')}</div>
  ${copiable('Respuesta alternativa si todavía no quieres abrir la prueba', C.dmListaEspera)}
</section>

${orden.map((p) => (p.tipo === 'video' ? video(p) : carrusel(p))).join('\n')}

<section id="numeros">
  <h2>De dónde salen los números</h2>
  <p class="formula">Precio = (insumos × multiplicador + mano de obra × multiplicador + extras) × (1 + margen)</p>
  <div class="tabla-envoltura"><table><tbody>
    <tr><th>Tamaño Mediano</th><td>Multiplicador 1.00 · 20 porciones (tamaños de arranque de la app)</td></tr>
    <tr><th>Insumos</th><td>$210: costo base de la app para un Mediano cuando la receta no tiene ingredientes capturados</td></tr>
    <tr><th>Mano de obra</th><td>$180 en Mediano, fija en el código (escala con el tamaño; hoy no se edita)</td></tr>
    <tr><th>Extras</th><td>Flores $120 (activo por defecto) · Topper $80</td></tr>
    <tr><th>Margen</th><td>40 % por defecto (editable en Mis precios)</td></tr>
    <tr><th>Resultado</th><td>Costo $510 · margen $204 · precio sugerido $714 · $35.70 por porción (pesos mexicanos)</td></tr>
    <tr><th>Costo por gramo</th><td>Mantequilla de arranque: $186 / 1000 g = $0.186 por gramo</td></tr>
    <tr><th>Anticipo del ejemplo</th><td>$357 (50 % de $714), solo como ejemplo · saldo por cobrar $357</td></tr>
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Verificado en index.html (función calc(), tamaños, insumos y margen por defecto). Las capturas se tomaron con la app real corriendo en modo local, con datos de ejemplo.</p>
</section>

<section id="material">
  <h2>Material que necesito de ti</h2>
  <div class="tabla-envoltura"><table><thead><tr><th>Para</th><th>Qué grabar o capturar en tu celular</th></tr></thead><tbody>
    <tr><td class="num">Video AGENDA</td><td>Tu libreta con tachones (cenital) · scroll de tus chats con nombres difuminados · calculadora del celular de noche · grabación de pantalla: Inicio → Agenda → "+" → paso 2 (Mediano · 20p) → paso "$ Total" con anticipo.</td></tr>
    <tr><td class="num">Video COTIZA</td><td>Una sola toma sin cortes de la cotización completa (Cotizar → 4 pasos → PDF → ticket en WhatsApp) con un cronómetro real en cuadro. Antes: logo en Mi negocio, 1 receta guardada e insumos en Mis precios.</td></tr>
    <tr><td class="num">Opcional</td><td>Si quieres que el PDF del carrusel ANTICIPO lleve un logo real en lugar de "TU LOGO", mándame una captura del PDF desde tu cuenta con los mismos datos.</td></tr>
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Mándame los clips por el chat (o súbelos a marketing/material/) y edito los Reels en 9:16 con subtítulos, textos de marca y tarjeta final, en MP4.</p>
</section>

<footer>Fuentes del kit en el repo: marketing/2026-10-organizacion-costeo/ (contenido.cjs, HTML de slides y storyboards, guiones, captions). Generado el 3 de octubre de 2026.</footer>
</div>

<script>
(function(){
  function marcar(btn, txt){ var o=btn.textContent; btn.textContent=txt; btn.setAttribute('data-estado','ok'); setTimeout(function(){ btn.textContent=o; btn.removeAttribute('data-estado'); }, 1800); }
  function seleccionar(el){ try{ var r=document.createRange(); r.selectNodeContents(el); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }catch(e){} }
  document.addEventListener('click', function(ev){
    var b=ev.target.closest('[data-copiar]'); if(!b) return;
    var el=document.getElementById(b.getAttribute('data-copiar')); if(!el) return;
    var p; try{ p=navigator.clipboard.writeText(el.textContent); }catch(e){ p=Promise.reject(e); }
    p.then(function(){ marcar(b,'Copiado'); }, function(){ seleccionar(el); marcar(b,'Seleccionado: copia con Ctrl+C'); });
  });
  function elegir(id, desplazar){
    document.querySelectorAll('.panel-paleta').forEach(function(p){ p.hidden = p.getAttribute('data-paleta')!==id; });
    document.querySelectorAll('.opcion').forEach(function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-elegir-paleta')===id)); });
    try{ localStorage.setItem('pastelia-kit-paleta', id); }catch(e){}
    if(desplazar){ var c=document.getElementById('c1'); if(c) c.scrollIntoView({behavior:'smooth', block:'start'}); }
  }
  document.addEventListener('click', function(ev){
    var b=ev.target.closest('[data-elegir-paleta]'); if(!b) return;
    elegir(b.getAttribute('data-elegir-paleta'), !b.classList.contains('opcion'));
  });
  try{ var guardada=localStorage.getItem('pastelia-kit-paleta'); if(guardada && document.querySelector('.panel-paleta[data-paleta="'+guardada+'"]')) elegir(guardada, false); }catch(e){}
  var descargas=null;
  try{ if(window.claude && window.claude.use){ window.claude.use('downloads').then(function(d){ descargas=d; }, function(){}); } }catch(e){}
  document.addEventListener('click', function(ev){
    var b=ev.target.closest('[data-descargar]'); if(!b || !descargas) return;   // sin descargas: el enlace abre el archivo
    ev.preventDefault();
    var url=b.getAttribute('data-descargar'), nombre=b.getAttribute('data-nombre');
    fetch(url).then(function(r){ if(!r.ok) throw new Error('http'); return r.blob(); })
      .then(function(blob){ return descargas.save({ filename:nombre, data:blob }); })
      .then(function(){ marcar(b,'Listo'); }, function(err){ var c=err&&err.code; if(c==='declined') return; if(c==='unavailable'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'){ descargas=null; marcar(b,'Toca otra vez para abrirlo'); return; } marcar(b,'No se pudo, intenta de nuevo'); });
  });
})();
</script>`;
}

function medicion() {
  const orden = [...C.piezas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  return 'palabra,pieza,fecha_publicacion,comentarios,dm_enviados,cuentas_creadas,notas\n'
    + orden.map((p) => `${p.palabra},"${p.titulo}",${p.fecha},,,,`).join('\n') + '\n';
}

function leeme() {
  return `Pastelia · Bloque 01 · Organización y costeo
Semana del 5 al 11 de octubre de 2026

carruseles/   PNG 1080x1350 listos para Instagram y Facebook, una carpeta por paleta (fresa, azul, mandarina, menta).
              c1 = COSTEO, c2 = ANTICIPO. La "tira" muestra el carrusel completo.
storyboards/  Escenas 1080x1920 de los videos, storyboard completo y tarjetas finales (v1 = AGENDA, v2 = COTIZA)
captions/     Captions por red (.txt) y respuesta por DM para cada palabra clave (pega tu URL de prueba)
guiones/      Guiones con tiempos, notas de producción y subtítulos .srt
calendario.md Día, pieza, red, hora sugerida (centro de México) y palabra clave
medicion.csv  Plantilla para contar comentarios, DM y cuentas creadas por palabra clave

Sin MP4 todavía: faltan tus clips. Mándalos por el chat y edito los Reels.

Antes de publicar (datos por confirmar):
${C.porConfirmar.map((d) => '- ' + d.campo + ': ' + d.estado).join('\n')}
`;
}

// Un ZIP por paleta (el chat acepta hasta 30 MB): todo lo de la semana + los carruseles de esa paleta.
function zips() {
  fs.writeFileSync(path.join(SALIDA, 'LEEME.txt'), leeme());
  fs.writeFileSync(path.join(SALIDA, 'medicion.csv'), medicion());
  const salidas = [];
  for (const pal of PALETAS) {
    const out = path.join(BASE, 'salida', ZIP.replace('.zip', `-${pal.id}.zip`));
    if (fs.existsSync(out)) fs.unlinkSync(out);
    execFileSync('python3', ['-c', `
import os, zipfile, sys
src, out, pal = sys.argv[1], sys.argv[2], sys.argv[3]
raiz = os.path.basename(src) + '-' + pal
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for d, _, fs_ in os.walk(src):
        r = os.path.relpath(d, src).split(os.sep)
        if r[0] == 'carruseles' and len(r) > 1 and r[1] != pal: continue
        for f in sorted(fs_):
            if f.endswith('.html'): continue
            p = os.path.join(d, f); z.write(p, os.path.join(raiz, os.path.relpath(p, src)))
`, SALIDA, out, pal.id]);
    salidas.push(out);
  }
  const vieja = path.join(BASE, 'salida', ZIP); if (fs.existsSync(vieja)) fs.unlinkSync(vieja);
  return salidas;
}

const html = pagina();
fs.mkdirSync(path.join(BASE, 'kit'), { recursive: true });
fs.writeFileSync(path.join(BASE, 'kit', 'index.html'), html);
const zs = zips();
fs.writeFileSync(path.join(BASE, 'kit', 'archivos.json'), JSON.stringify(archivos, null, 2) + '\n');
console.log('kit/index.html', (html.length / 1024).toFixed(0) + ' KB ·', Object.keys(archivos).length, 'archivos ·', zs.map((z) => path.basename(z) + ' ' + (fs.statSync(z).size / 1048576).toFixed(1) + ' MB').join(' · '));
