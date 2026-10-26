// Arma la página "Kit de contenido Pastelia" (kit/index.html), el mapa de archivos para publicarla
// (kit/archivos.json) y el ZIP de la semana (salida/…zip). Correr después de generar.cjs.
// Uso: node marketing/2026-10-arranque-instagram/herramientas/generar-kit.cjs
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const C = require('../contenido.cjs');
const { contar } = require('./contar-palabras.cjs');
const { srt, escenasDe, altText, calendario, bioTexto, SALIDA, PERFIL } = require('./generar.cjs');

const BASE = path.resolve(__dirname, '..');
const ROOT = path.resolve(BASE, '../..');
const DRIVE = JSON.parse(fs.readFileSync(path.join(BASE, 'drive.json'), 'utf8'));
const ZIP = `pastelia-arranque-${C.SEMANA.id}.zip`;
const rel = (p) => path.relative(ROOT, p);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LOCKUP = fs.readFileSync(path.join(ROOT, 'pastelia-lockup.svg'), 'utf8').replace(/width="\d+" height="\d+"/, 'width="190" height="50" role="img" aria-label="Pastelia"').replace('fill="#4A342E">Pastelia', 'fill="currentColor">Pastelia');

// Archivos que se publican junto con la página (ruta publicada → ruta en el repo).
const archivos = {};
function img(carpeta, nombre) { const k = `img/${carpeta}/${nombre}`; archivos[k] = rel(path.join(SALIDA, carpeta, nombre)); return k; }
function archivo(carpeta, nombre) { const k = `descargas/${nombre}`; archivos[k] = rel(path.join(SALIDA, carpeta, nombre)); return k; }

let nCopia = 0;
function copiable(titulo, texto, extraClase) {
  const id = 'copia-' + (++nCopia);
  return `<div class="copiable ${extraClase || ''}"><div class="copiable-cab"><span>${esc(titulo)}</span><button type="button" class="btn" data-copiar="${id}">Copiar texto</button></div><pre id="${id}">${esc(texto)}</pre></div>`;
}
// Enlace real (abre el archivo); si el visor permite descargas, el script guarda el archivo.
function descargar(k, nombre, etiqueta, clase) { return `<a class="btn ${clase == null ? 'btn-sec' : clase}" href="${esc(k)}" target="_blank" rel="noopener" data-descargar="${esc(k)}" data-nombre="${esc(nombre)}">${esc(etiqueta || 'Descargar PNG')}</a>`; }
function diaCorto(dia) { const [d, n, , m] = dia.split(' '); return `${d.slice(0, 3)} ${n} ${m.slice(0, 3)}`; }
const tipoPieza = (p) => ({ video: 'Reel', carrusel: 'Carrusel', meme: 'Meme' }[p.tipo]);
function chips(p) {
  return `<div class="chips"><span class="chip chip-fecha">${esc(p.dia)} · ${esc(p.hora)}</span>${p.redes.map((r) => `<span class="chip">${esc(r)}</span>`).join('')}<span class="chip">${esc(p.formato)}</span><span class="chip chip-cta">CTA: ${esc(p.palabra)}</span></div>`;
}
function antes(p) { return `<div class="aviso"><h4>Antes de publicar</h4><ul>${p.antes.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>`; }
function captionYdm(p) {
  return `<h4>Caption para Instagram</h4>${copiable('Caption (con frases que la gente busca)', p.captions.instagram().trim())}
  <h4>Respuesta por DM a quien comente ${esc(p.palabra)}</h4>${copiable('Mensaje directo (pega tu link)', p.dm)}`;
}
function figura(k, nombre, alt, w, h, titulo, clase = '') {
  return `<figure class="${clase}"><img src="${k}" alt="${esc(alt)}" loading="lazy" width="${w}" height="${h}"><figcaption><b>${esc(titulo)}</b>${descargar(k, nombre)}</figcaption></figure>`;
}

function tablaGancho(v) {
  const g = v.escenas[0];
  return `<div class="hook"><div><span>Acción visual · 0–3 s</span>${esc(g.visual)}</div><div><span>Voz en off</span>${esc(g.voz)}</div><div><span>Texto en pantalla · zona segura</span>${esc(g.texto)}</div></div>`;
}

function video(p) {
  const A = escenasDe(p, 'A'), B = p.variantes.B.escenas;
  const frames = (lista, v) => lista.map((e, k) => { const n = `${p.id}-${v}-escena-${k + 1}.png`; return figura(img(p.carpeta, n), n, `${v} · escena ${k + 1}: ${e.nombre}`, 1080, 1920, `${v} · ${e.t[0]}–${e.t[1]} s · ${e.nombre}`, 'frame'); }).join('');
  const tarjeta = `${p.id}-tarjeta-final-${p.palabra.toLowerCase()}-1080x1920.png`, portada = `${p.id}-portada-reel-1080x1920.png`, hoja = `${p.id}-storyboard-completo.png`;
  const kh = img(p.carpeta, hoja);
  return `<article class="pieza" id="${p.id}">
  <p class="eyebrow">Pieza ${p.n} · Reel${p.fijado ? ` · fijado ${p.fijado}` : ''} · ${esc(p.estructura)} · ${esc(p.duracion)}</p>
  <h3>${esc(p.titulo)}</h3>
  <p class="bajada-pieza">${esc(p.subtitulo)}</p>
  ${chips(p)}
  <h4>${esc(p.variantes.A.etiqueta)} — ${esc(p.variantes.A.angulo)}</h4>${tablaGancho(p.variantes.A)}
  <h4>${esc(p.variantes.B.etiqueta)} — ${esc(p.variantes.B.angulo)}</h4>${tablaGancho(p.variantes.B)}
  <h4>Puente (on-ramp, 3–15 s)</h4>
  <div class="puentes">${['A', 'B'].map((v) => `<div><b>Versión ${v}</b><ul>${p.variantes[v].escenas.slice(1).map((e) => `<li><span class="num">${e.t[0]}–${e.t[1]} s</span> ${esc(e.voz)} <small>Texto: ${esc(e.texto)}</small></li>`).join('')}<li><span class="num">${p.cuerpo[0].t[0]}–${p.cuerpo[0].t[1]} s</span> ${esc(p.cuerpo[0].voz)} <small>Igual en A y B</small></li></ul></div>`).join('')}</div>
  <h4>Guion completo (versión A)</h4>
  <div class="tabla-envoltura"><table class="guion"><thead><tr><th>Tiempo</th><th>Acción visual</th><th>Voz en off</th><th>Texto en pantalla</th></tr></thead><tbody>
  ${A.map((e) => `<tr><td class="num">${e.t[0]}–${e.t[1]} s<br><small>${esc(e.nombre)}</small></td><td>${esc(e.visual)}</td><td>${esc(e.voz)}</td><td>${esc(e.texto)}</td></tr>`).join('')}
  </tbody></table></div>
  <h4>Storyboard por escena</h4>
  <p class="ayuda">Sin clips todavía: estas escenas muestran qué grabar y dónde va cada texto. La línea punteada es la zona segura de 720×1200 (fuera de ella, Instagram tapa el texto). Las pantallas son capturas reales de la app con datos de ejemplo; donde dice "Graba aquí tu pantalla real" va tu grabación.</p>
  <div class="carril">${frames(A, 'A')}${frames(B, 'B')}</div>
  <div class="extras">
    ${figura(img(p.carpeta, tarjeta), tarjeta, `Tarjeta final ${p.palabra}`, 1080, 1920, 'Tarjeta final, lista para el Reel', 'mini')}
    ${figura(img(p.carpeta, portada), portada, `Portada del Reel ${p.id}`, 1080, 1920, 'Portada del Reel', 'mini')}
    <div class="col">
      <h4>Notas de producción</h4><ul>${p.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      <p>${descargar(kh, hoja, 'Descargar storyboard completo')}</p>
    </div>
  </div>
  <h4>Subtítulos (.srt)</h4>
  <p class="ayuda">Los archivos .srt vienen en el ZIP y en tu Drive. Tiempos aproximados: ajústalos al audio real en CapCut.</p>
  <div class="captions">${copiable(`${p.id}-subtitulos-A.srt`, srt(A), 'srt')}${copiable(`${p.id}-subtitulos-B.srt`, srt([...B, ...p.cuerpo]), 'srt')}</div>
  ${captionYdm(p)}
  ${antes(p)}
</article>`;
}

function carrusel(p) {
  const { filas } = contar();
  const slides = p.slides.map((s, i) => { const n = `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`; return figura(img(p.carpeta, n), n, `Slide ${i + 1}: ${s.titulo}`, 1080, 1350, `${i + 1} / ${p.slides.length}`, 'slide'); });
  if (p.fotoPortada) { const n = `${p.id}-slide-01-con-foto.png`; slides.splice(1, 0, figura(img(p.carpeta, n), n, 'Portada alterna con marco para tu foto', 1080, 1350, 'Portada alterna: con tu foto', 'slide')); }
  const tira = img(p.carpeta, `${p.id}-tira.png`);
  const voz = p.voz ? `<h4>Guion de voz en off (versión Reel opcional · ${esc(p.voz.duracion)})</h4><p class="ayuda">${esc(p.voz.nota)}</p>
  <div class="tabla-envoltura"><table class="guion"><thead><tr><th>Tiempo</th><th>Slide</th><th>Voz en off</th></tr></thead><tbody>${p.voz.escenas.map((e) => `<tr><td class="num">${e.t[0]}–${e.t[1]} s</td><td class="num">${e.slide}</td><td>${esc(e.voz)}</td></tr>`).join('')}</tbody></table></div>
  ${copiable(`${p.id}-subtitulos.srt`, srt(p.voz.escenas), 'srt')}` : '';
  return `<article class="pieza" id="${p.id}">
  <p class="eyebrow">Pieza ${p.n} · Carrusel${p.fijado ? ` · fijado ${p.fijado}` : ''} · ${esc(p.estructura)}</p>
  <h3>${esc(p.titulo)}</h3>
  ${chips(p)}
  <h4>Carrusel completo</h4>
  <p class="ayuda">Lienzo continuo: algunos elementos cruzan de un slide al siguiente para invitar a deslizar. Al pie de cada slide intermedio va el ciclo abierto en dorado.</p>
  <div class="tira"><img src="${tira}" alt="Carrusel ${esc(p.palabra)} completo" loading="lazy"></div>
  <div class="carril">${slides.join('')}</div>
  <h4>Slides, palabras y diseño</h4>
  <div class="tabla-envoltura"><table class="guion"><thead><tr><th>#</th><th>Texto que se ve</th><th>Palabras</th><th>Diseño</th></tr></thead><tbody>
  ${p.slides.map((s, i) => { const f = filas.find((x) => x.pieza === p.id && x.slide === i + 1); return `<tr><td class="num">${i + 1}</td><td>${esc([s.kicker, s.titulo, ...(s.extra || []), s.texto, s.nota, s.cta].filter(Boolean).join(' · '))}${s.loop ? `<br><small class="loop">Ciclo abierto: ${esc(s.loop)}</small>` : ''}</td><td class="num">${f.palabras} <small>(${esc(f.limite)}) ${f.cumple ? '✓' : '✗'}</small></td><td>${esc(s.visual)}</td></tr>`; }).join('')}
  </tbody></table></div>
  ${voz}
  <h4>Notas</h4><ul>${p.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  ${captionYdm(p)}
  <h4>Texto alternativo</h4>${copiable('Instagram → Configuración avanzada → Escribir texto alternativo', altText(p))}
  ${antes(p)}
</article>`;
}

function meme(p) {
  const n = `${p.id}-meme.png`, k = img(p.carpeta, n), s = p.slides[0];
  return `<article class="pieza" id="${p.id}">
  <p class="eyebrow">Pieza ${p.n} · Meme · ${esc(p.estructura)}</p>
  <h3>${esc(p.titulo)}</h3>
  ${chips(p)}
  <div class="meme">${figura(k, n, `Meme: ${s.titulo}. ${s.texto}`, 1080, 1350, 'Imagen lista para publicar', 'slide')}
    <div class="col"><h4>Diseño</h4><p>${esc(s.visual)}</p><h4>Notas</h4><ul>${p.notas.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
  ${captionYdm(p)}
  <h4>Texto alternativo</h4>${copiable('Instagram → Configuración avanzada → Escribir texto alternativo', altText(p))}
  ${antes(p)}
</article>`;
}

function perfil() {
  const pf = C.perfil;
  return `<section id="perfil">
  <h2>Perfil de Instagram</h2>
  <p class="bajada">Ármalo antes de publicar la primera pieza. Copia cada texto en Instagram → Editar perfil.</p>
  <ol class="pasos">${pf.pasos.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
  <div class="dos">
    <div><h4>Nombre (sale en las búsquedas)</h4>
      ${copiable(`Recomendado · ${pf.nombre.recomendado.length} caracteres`, pf.nombre.recomendado)}
      <p class="ayuda" style="margin-top:8px">${esc(pf.nombre.porque)}</p>
      ${pf.nombre.alternativas.map((a) => copiable(`Alternativa · ${a.texto.length} caracteres`, a.texto) + `<p class="ayuda" style="margin-top:6px">${esc(a.porque)}</p>`).join('')}
    </div>
    <div><h4>Presentación (bio)</h4>
      ${copiable(`Bio en 3 líneas · ${bioTexto().length} de 150 caracteres`, bioTexto())}
      <p class="ayuda" style="margin-top:8px">${esc(pf.bioPorque)}</p>
      <h4>Enlace</h4>
      ${copiable('Título del enlace (app abierta)', pf.enlace.titulo)}
      ${copiable('Título del enlace (lista de espera)', pf.enlace.tituloListaEspera)}
      <p class="ayuda" style="margin-top:8px">${esc(pf.enlace.nota)}</p>
    </div>
  </div>
  <h4>Historias destacadas: nombres y portadas</h4>
  <p class="ayuda">Portadas de 1080×1920 con los mismos íconos de la app; Instagram muestra el círculo del centro. Cada vez que publiques una pieza, compártela en tu historia y agrégala a su destacada.</p>
  <div class="destacadas">${pf.destacadas.map((d) => { const n = `destacada-${d.id}.png`, k = img(PERFIL, n); return `<figure><img src="${k}" alt="Portada de la destacada ${esc(d.nombre)}" loading="lazy" width="1080" height="1920"><figcaption><b>${esc(d.nombre)}</b><span>${esc(d.contenido)}</span>${descargar(k, n)}</figcaption></figure>`; }).join('')}</div>
</section>`;
}

function playbook() {
  const pb = C.playbook;
  return `<section id="playbook">
  <h2>Playbook orgánico ($0)</h2>
  <h3 class="h3-sec">${esc(pb.rutina.titulo)}</h3>
  <ol class="rutina">${pb.rutina.pasos.map((x) => `<li><span class="num">Min ${esc(x.min)}</span>${esc(x.que)}</li>`).join('')}</ol>
  <p class="formula">${esc(pb.rutina.formula)}</p>
  <div class="dos">
    <div class="vs vs-no"><h4>Comentarios vacíos (evítalos)</h4><ul>${pb.rutina.vacios.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="vs vs-si"><h4>Comentarios útiles (adáptalos, no los copies)</h4><ul>${pb.rutina.utiles.map((u) => `<li><b>${esc(u.tipo)}:</b> ${esc(u.texto)}</li>`).join('')}</ul></div>
  </div>
  <ul class="reglas">${pb.rutina.reglas.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>

  <h3 class="h3-sec">${esc(pb.dms.titulo)}</h3>
  <p class="bajada">${esc(pb.dms.intro)}</p>
  <div class="estructuras">${pb.dms.estructuras.map((e) => `<div class="estructura"><b>${esc(e.nombre)}</b><p class="ayuda">${esc(e.cuando)}</p><ol>${e.pasos.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>${copiable('Ejemplo (cambia lo que está entre corchetes)', e.ejemplo)}</div>`).join('')}</div>
  <ul class="reglas">${pb.dms.notas.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  <div class="zip">${descargar(archivo(PERFIL, 'invitaciones-beta.csv'), 'pastelia-invitaciones-beta.csv', 'Descargar registro de invitaciones (CSV)', '')}</div>

  <h3 class="h3-sec">${esc(pb.ritmo.titulo)}</h3>
  <ul class="reglas">${pb.ritmo.puntos.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>

  <h3 class="h3-sec">${esc(pb.ads.titulo)}</h3>
  <p class="bajada">${esc(pb.ads.intro)}</p>
  <ul class="checklist">${pb.ads.condiciones.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
  <p class="formula">${esc(pb.ads.presupuesto)}</p>
</section>`;
}

function pagina() {
  const cal = calendario();
  const piezaHTML = (p) => (p.tipo === 'video' ? video(p) : p.tipo === 'meme' ? meme(p) : carrusel(p));
  return `<title>Kit de contenido Pastelia</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800;900&display=swap">
<style>
/* Layout: una columna de lectura con carriles horizontales para slides y escenas; marca de Pastelia (CLAUDE.md). */
:root{
  --fondo:#FFF4E6; --papel:#FFFFFF; --campo:#F5E7D0; --tinte:#F1E6CE;
  --tinta:#5A4236; --marron:#7B5B4B; --suave:#8A7062; --dorado:#E7B676; --dorado-tinta:#4A342E;
  --linea:rgba(123,91,75,.16); --aviso:#FBEBD2; --aviso-borde:#E7B676; --no:#B5523B; --si:#7B5B4B;
  --display:'Fredoka','Nunito',system-ui,sans-serif; --texto:'Nunito',system-ui,-apple-system,'Segoe UI',sans-serif; --mono:ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --fondo:#150E0A; --papel:#21170F; --campo:#2E2118; --tinte:#36281D;
  --tinta:#F6EADB; --marron:#E9D6C2; --suave:#BFA894; --dorado:#E7B676; --dorado-tinta:#2A1F17;
  --linea:rgba(246,234,219,.14); --aviso:#3A2C1C; --aviso-borde:#B98A4C; --no:#E39A7B; --si:#E7B676; color-scheme:dark }}
:root[data-theme="dark"]{
  --fondo:#150E0A; --papel:#21170F; --campo:#2E2118; --tinte:#36281D;
  --tinta:#F6EADB; --marron:#E9D6C2; --suave:#BFA894; --dorado:#E7B676; --dorado-tinta:#2A1F17;
  --linea:rgba(246,234,219,.14); --aviso:#3A2C1C; --aviso-borde:#B98A4C; --no:#E39A7B; --si:#E7B676; color-scheme:dark }
*{box-sizing:border-box}
body{background:var(--fondo);color:var(--tinta);font:600 16px/1.55 var(--texto);margin:0}
.envoltura{max-width:1080px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}
header.cab{display:flex;flex-direction:column;gap:14px;padding-block:8px 28px;border-bottom:1px solid var(--linea)}
header.cab svg{color:var(--tinta)}
h1{font:600 clamp(34px,6vw,56px)/1.02 var(--display);margin:0;letter-spacing:-.01em;text-wrap:balance}
h2{font:600 30px/1.1 var(--display);margin:0 0 16px;text-wrap:balance}
h3{font:600 clamp(26px,4vw,36px)/1.1 var(--display);margin:4px 0 14px;text-wrap:balance}
h3.h3-sec{font-size:24px;margin-top:30px}
h4{font:800 13px/1.2 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin:30px 0 12px}
.bajada{font-size:18px;color:var(--marron);max-width:65ch;margin:0}
.bajada-pieza{font-size:17px;color:var(--marron);margin:-6px 0 14px}
.eyebrow{font:800 13px/1.3 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin:0}
section{padding-block:36px;border-bottom:1px solid var(--linea)}
.indice{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.indice a{display:inline-block;padding:8px 14px;border-radius:999px;background:var(--campo);color:var(--tinta);text-decoration:none;font-weight:800;font-size:14px}
.indice a:focus-visible,.btn:focus-visible,a:focus-visible{outline:3px solid var(--dorado);outline-offset:2px}
.tabla-envoltura{overflow-x:auto;border:1px solid var(--linea);border-radius:14px;background:var(--papel)}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:12px 14px;border-bottom:1px solid var(--linea)}
thead th{font:800 12px/1.2 var(--texto);text-transform:uppercase;letter-spacing:.07em;color:var(--suave);background:var(--tinte)}
tbody tr:last-child td,tbody tr:last-child th{border-bottom:0}
td.num,.num{white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:800}
td small,li small{color:var(--suave);font-weight:700;display:block}
table.guion td{min-width:170px}table.guion td.num{min-width:0}
table.cal td:nth-child(3){min-width:230px}
.palabra{display:inline-block;font:700 15px/1 var(--display);letter-spacing:.04em;background:var(--dorado);color:var(--dorado-tinta);padding:6px 10px;border-radius:8px}
.confirmar{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.confirmar div{background:var(--aviso);border:1px solid var(--aviso-borde);border-radius:14px;padding:14px 16px;min-width:0}
.confirmar b{display:block;font:600 18px/1.2 var(--display);margin-bottom:4px}
.pieza{padding-block:40px;border-bottom:1px solid var(--linea)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{font:800 13px/1 var(--texto);padding:8px 12px;border-radius:999px;background:var(--campo);color:var(--tinta)}
.chip-fecha{background:var(--tinta);color:var(--fondo)}
.chip-cta{background:var(--dorado);color:var(--dorado-tinta)}
.hook{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.hook div{background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:14px 16px;min-width:0}
.hook span{display:block;font:800 12px/1.2 var(--texto);text-transform:uppercase;letter-spacing:.08em;color:var(--suave);margin-bottom:8px}
.puentes{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.puentes>div{background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:14px 16px;min-width:0}
.puentes ul{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-direction:column;gap:10px}
.puentes .num{display:inline-block;background:var(--campo);border-radius:6px;padding:2px 8px;margin-right:6px;font-size:13px}
.ayuda{color:var(--suave);margin:-4px 0 12px;font-size:15px;max-width:75ch}
.carril{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px}
.carril figure{margin:0;flex:none;scroll-snap-align:start;display:flex;flex-direction:column;gap:8px}
figure.frame{width:min(200px,46vw)}figure.slide{width:min(280px,72vw)}
.tira{overflow-x:auto;border-radius:12px;border:1px solid var(--linea);margin-bottom:14px;background:var(--campo)}
.tira img{display:block;height:300px;width:auto;max-width:none}
figure img{width:100%;height:auto;display:block;border-radius:12px;border:1px solid var(--linea);background:var(--campo)}
figcaption{display:flex;flex-direction:column;gap:6px;font-size:13px}
figcaption b{font-weight:800}
figcaption span{color:var(--suave)}
small.loop{color:var(--marron);font-style:italic}
.extras{display:grid;grid-template-columns:minmax(0,180px) minmax(0,180px) minmax(0,1fr);gap:20px;margin-top:20px;align-items:start}
figure.mini{margin:0;display:flex;flex-direction:column;gap:8px}
.col{min-width:0}.col h4{margin-top:0}
.meme{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:24px;align-items:start;margin-top:20px}
.meme figure{margin:0;display:flex;flex-direction:column;gap:8px}
.dos{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.dos>div{min-width:0}
.destacadas{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.destacadas figure{margin:0;display:flex;flex-direction:column;gap:8px;min-width:0}
.destacadas img{aspect-ratio:9/16;object-fit:cover}
ol.pasos,ol.rutina{padding-left:22px;margin:0 0 8px;display:flex;flex-direction:column;gap:6px;max-width:80ch}
ol.rutina .num{display:inline-block;background:var(--campo);border-radius:6px;padding:2px 8px;margin-right:8px;font-size:13px}
.vs{background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:14px 16px}
.vs h4{margin-top:0}
.vs-no h4{color:var(--no)}.vs-si h4{color:var(--si)}
.vs-no li{text-decoration:line-through;text-decoration-color:var(--no)}
.estructuras{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.estructura{background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:16px;min-width:0;display:flex;flex-direction:column;gap:6px}
.estructura>b{font:600 20px/1.2 var(--display)}
.estructura ol{padding-left:20px;margin:0}
ul.reglas,ul.checklist{padding-left:20px;margin:12px 0 0;display:flex;flex-direction:column;gap:6px;max-width:80ch}
ul.checklist{list-style:none;padding-left:0}
ul.checklist li{padding-left:34px;position:relative}
ul.checklist li:before{content:"";position:absolute;left:0;top:2px;width:20px;height:20px;border:2px solid var(--dorado);border-radius:6px}
ul{padding-left:20px;margin:0}li{margin:0}
.btn{appearance:none;border:0;cursor:pointer;font:800 13px/1 var(--texto);padding:10px 14px;border-radius:10px;background:var(--tinta);color:var(--fondo);align-self:flex-start;text-decoration:none;display:inline-block}
.btn-sec{background:var(--campo);color:var(--tinta)}
.btn[data-estado="ok"]{background:var(--dorado);color:var(--dorado-tinta)}
.captions{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
.copiable{background:var(--papel);border:1px solid var(--linea);border-radius:14px;overflow:hidden;min-width:0;margin-top:12px}
.captions .copiable{margin-top:0}
.copiable-cab{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px 10px 16px;background:var(--tinte);font-weight:800}
.copiable pre{margin:0;padding:14px 16px;white-space:pre-wrap;word-break:break-word;font:600 14.5px/1.55 var(--texto);max-height:360px;overflow:auto}
.srt pre{font:500 13px/1.45 var(--mono)}
.aviso{margin-top:24px;background:var(--aviso);border:1px solid var(--aviso-borde);border-radius:14px;padding:16px 18px}
.aviso h4{margin:0 0 8px;color:var(--tinta)}
.aviso ul{display:flex;flex-direction:column;gap:6px}
.formula{font:600 19px/1.4 var(--display);background:var(--papel);border:1px solid var(--linea);border-radius:14px;padding:16px 18px;margin:14px 0}
.zip{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:16px}
footer{padding-top:28px;color:var(--suave);font-size:14px}
footer a,.bajada a{color:var(--marron)}
@media (max-width:700px){.extras{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.extras .col{grid-column:1/-1}.meme{grid-template-columns:1fr}.meme figure{max-width:320px}}
@media (prefers-reduced-motion:no-preference){.carril{scroll-behavior:smooth}}
</style>

<div class="envoltura">
<header class="cab">
  ${LOCKUP}
  <p class="eyebrow">Plan de arranque en Instagram · ${esc(C.SEMANA.titulo)} · $0 orgánico</p>
  <h1>Kit de contenido Pastelia</h1>
  <p class="bajada">Seis piezas para que tu perfil no esté vacío antes de invitar a nadie: 2 reels, 3 carruseles y 1 meme, cada una con su palabra clave para medir cuál trae registros. Le hablamos a reposteras que no saben cuánto cobrar, no a quien compra pasteles. Capturas reales de la app, sin pasteles hechos con IA.</p>
  <p class="bajada">Todo está también en tu Drive: <a href="${esc(DRIVE.raiz.url)}" target="_blank" rel="noopener">Pastelia / ${esc(DRIVE.raiz.titulo)}</a>.</p>
  <ul class="indice"><li><a href="#confirmar">Por confirmar</a></li><li><a href="#calendario">Calendario</a></li><li><a href="#perfil">Perfil</a></li>${C.piezas.map((p) => `<li><a href="#${p.id}">${p.n} · ${tipoPieza(p)} ${esc(p.palabra)}</a></li>`).join('')}<li><a href="#playbook">Playbook</a></li><li><a href="#dm">Respuestas por DM</a></li><li><a href="#medir">Cómo medir</a></li><li><a href="#numeros">Números</a></li><li><a href="#material">Material</a></li></ul>
</header>

<section id="confirmar">
  <h2>Datos por confirmar</h2>
  <div class="confirmar">${C.porConfirmar.map((d) => `<div><b>${esc(d.campo)}</b>${esc(d.estado)}</div>`).join('')}</div>
</section>

<section id="calendario">
  <h2>Calendario de publicación</h2>
  <div class="tabla-envoltura"><table class="cal"><thead><tr><th>Día</th><th>Hora</th><th>Pieza</th><th>Red</th><th>Palabra clave</th></tr></thead><tbody>
  ${cal.map((f) => { const p = C.piezas.find((x) => f.pieza.startsWith(x.id + ' ')); return `<tr><td class="num">${esc(diaCorto(f.dia))}</td><td class="num">${esc(f.hora)}</td><td>${p ? `<a href="#${p.id}" style="color:inherit">${esc(f.pieza)}</a><br><small>${esc(tipoPieza(p))} · ${esc(p.estructura)}</small>` : esc(f.pieza)}</td><td>${esc(f.red)}</td><td>${f.palabra !== '—' ? `<span class="palabra">${esc(f.palabra)}</span>` : '—'}</td></tr>`; }).join('')}
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Horas sugeridas del centro de México; ajústalas con las estadísticas de tu cuenta. Si el Reel del martes no está listo, publica primero el carrusel c1 y mueve el Reel un día.</p>
  <p class="ayuda">El paquete de la semana va como archivo en el chat (${esc(ZIP)}${ZIP_PARTES > 1 ? ', en dos partes por tamaño' : ''}): PNG, captions y DM en .txt, guiones .md, subtítulos .srt, calendario y plantillas CSV. Sin MP4 todavía: faltan tus grabaciones.</p>
</section>

${perfil()}

${C.piezas.map(piezaHTML).join('\n')}

${playbook()}

<section id="dm">
  <h2>Respuestas rápidas por DM</h2>
  <div class="captions">${C.respuestasDM.map((r) => copiable(r.pregunta + (r.porConfirmar ? ' (por confirmar)' : ''), r.respuesta)).join('')}${copiable('Si todavía no quieres abrir la app (lista de espera)', C.dmListaEspera)}</div>
</section>

<section id="medir">
  <h2>Cómo medir qué pieza trae registros</h2>
  <p class="bajada">La app no tiene analítica, así que cada pieza usa su propia palabra clave. Cuenta tres cosas por palabra:</p>
  <div class="tabla-envoltura" style="margin-top:16px"><table><thead><tr><th>Palabra</th><th>Pieza</th><th>Comentarios con la palabra</th><th>DM enviados</th><th>Cuentas creadas</th></tr></thead><tbody>
  ${C.piezas.map((p) => `<tr><td><span class="palabra">${esc(p.palabra)}</span></td><td>${p.n} · ${esc(tipoPieza(p))} · ${esc(diaCorto(p.dia))}</td><td class="num">—</td><td class="num">—</td><td class="num">—</td></tr>`).join('')}
  </tbody></table></div>
  <ul class="reglas">
    <li>Contesta cada comentario con la palabra y manda el DM el mismo día.</li>
    <li>"Cuentas creadas": pregúntalo en el DM, o compara las altas nuevas en Firebase (Authentication) con los días en que mandaste cada link.</li>
    <li>Para los reels, anota también guardados y compartidos: son la señal de cuál podría ser tu primer anuncio.</li>
  </ul>
  <div class="zip">${descargar(archivo(PERFIL, 'medicion.csv'), 'pastelia-medicion-semana1.csv', 'Descargar plantilla de medición (CSV)', '')}</div>
</section>

<section id="numeros">
  <h2>De dónde salen los números</h2>
  <p class="formula">Precio = (insumos × multiplicador + mano de obra × multiplicador + extras) × (1 + margen)</p>
  <div class="tabla-envoltura"><table><tbody>
    <tr><th>Tamaño Mediano</th><td>Multiplicador 1.00 · 20 porciones (tamaños de arranque de la app)</td></tr>
    <tr><th>Insumos</th><td>$210: costo base de la app para un Mediano cuando la receta no tiene ingredientes capturados</td></tr>
    <tr><th>Mano de obra</th><td>$180 en Mediano, fija en el código (escala con el tamaño; hoy no se edita)</td></tr>
    <tr><th>Extras</th><td>Flores $120 (activo por defecto) · Topper $80 · los que tú agregues con nombre y precio</td></tr>
    <tr><th>Margen</th><td>40 % por defecto (editable en Mis precios)</td></tr>
    <tr><th>Resultado</th><td>Costo $510 · margen $204 · precio sugerido $714 · $35.70 por porción (pesos mexicanos)</td></tr>
    <tr><th>Costo por gramo</th><td>Mantequilla de arranque: $186 / 1000 g = $0.186 por gramo</td></tr>
    <tr><th>"Cobraste $510" (c2)</th><td>Es el costo del mismo pastel sin ganancia: $210 + $180 + $120. Caja, base, gas y luz van como "$ ?" porque la app no trae esos montos</td></tr>
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Verificado en index.html (función calc(), tamaños, extras, insumos y margen por defecto). Las capturas se tomaron con la app real corriendo en modo local y en modo oscuro, con datos de ejemplo, el 26 de octubre de 2026.</p>
</section>

<section id="material">
  <h2>Material que necesito de ti</h2>
  <div class="tabla-envoltura"><table><thead><tr><th>Para</th><th>Qué grabar o mandarme</th></tr></thead><tbody>
    <tr><td class="num">Reel COTIZA (r1)</td><td>Grabación de pantalla en modo oscuro de la cotización completa (Cotizar → 20 invitados → receta, Mediano · 20p, Flores → Costeo → Resumen en vivo). Para la versión A, 2 s de tu mano tachando un "$ ?" en tu libreta (cenital).</td></tr>
    <tr><td class="num">Reel AGENTE (r2)</td><td>Grabación de pantalla de la conversación real con el Agente IA (beta): el pedido escrito, la respuesta, "Confirma el pedido", "Confirmar y guardar" y la agenda. Para la versión B, 2 s de tu celular encendiéndose en una cocina oscura.</td></tr>
    <tr><td class="num">Historia (p1)</td><td>Opcional: una foto tuya vertical con luz natural para la portada alterna, y tu voz en off si quieres la versión Reel.</td></tr>
  </tbody></table></div>
  <p class="ayuda" style="margin-top:12px">Mándame los clips por el chat (o súbelos a "3. Mi material (fotos y videos)" en Drive o a marketing/material/ en el repo) y edito los Reels en 9:16 con subtítulos, textos de marca y tarjeta final, en MP4.</p>
</section>

<footer>Fuentes del kit en el repo: marketing/2026-10-arranque-instagram/ (contenido.cjs, HTML de slides y storyboards, guiones, captions, perfil y playbook). Paleta cacao con Fredoka y Nunito. Generado el 26 de octubre de 2026.</footer>
</div>

<script>
(function(){
  function marcar(btn, txt){ var o=btn.textContent; btn.textContent=txt; btn.setAttribute('data-estado','ok'); setTimeout(function(){ btn.textContent=o; btn.removeAttribute('data-estado'); }, 1800); }
  function seleccionar(el){ try{ var r=document.createRange(); r.selectNodeContents(el); var s=window.getSelection(); s.removeAllRanges(); s.addRange(r); }catch(e){} }
  document.addEventListener('click', function(ev){
    var b=ev.target.closest('[data-copiar]'); if(!b) return;
    var el=document.getElementById(b.getAttribute('data-copiar')); if(!el) return;
    var p; try{ p=navigator.clipboard.writeText(el.textContent); }catch(e){ p=Promise.reject(e); }
    p.then(function(){ marcar(b,'Copiado'); }, function(){ seleccionar(el); marcar(b,'Seleccionado: cópialo'); });
  });
  var descargas=null;
  try{ if(window.claude && window.claude.use){ window.claude.use('downloads').then(function(d){ descargas=d; }, function(){}); } }catch(e){}
  document.addEventListener('click', function(ev){
    var b=ev.target.closest('[data-descargar]'); if(!b || !descargas) return;   // sin descargas: el enlace abre el archivo
    ev.preventDefault();
    var url=b.getAttribute('data-descargar'), nombre=b.getAttribute('data-nombre');
    fetch(url).then(function(r){ if(!r.ok) throw new Error('http'); return r.blob(); })
      .then(function(blob){ return descargas.save({ filename:nombre, data:blob }); })
      .then(function(){ marcar(b,'Listo'); }, function(err){ var c=err&&err.code; if(c==='declined') return; if(c==='rate_limited'){ marcar(b,'Espera un momento'); return; } if(c==='unavailable'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'){ descargas=null; marcar(b,'Toca otra vez para abrirlo'); return; } marcar(b,'No se pudo, intenta de nuevo'); });
  });
})();
</script>`;
}

function leeme() {
  return `Pastelia · Plan de arranque en Instagram · ${C.SEMANA.titulo} ($0, orgánico)

Las carpetas son las mismas que en tu Drive (Pastelia / ${DRIVE.raiz.titulo}):

${C.piezas.map((p) => `${p.carpeta.padEnd(30)} ${p.id} · ${tipoPieza(p)} · ${p.titulo} · ${p.dia} ${p.hora} · CTA ${p.palabra}`).join('\n')}
${PERFIL.padEnd(30)} Perfil (nombre, bio, enlace), portadas de destacadas, playbook, calendario, respuestas por DM y plantillas CSV

En cada carpeta:
- Carruseles y meme: PNG 1080x1350 listos para Instagram, la "tira" con el carrusel completo, guion .md, caption, texto alternativo y DM (.txt).
- Reels: storyboard por escena (A = versión principal, B = gancho para "Reel de prueba"), tarjeta final y portada 1080x1920, storyboard completo, guion .md con la tabla de 3 componentes y subtítulos .srt (A y B).

Sin MP4 todavía: faltan tus grabaciones de pantalla. Mándamelas por el chat y edito los Reels.

Antes de publicar (datos por confirmar):
${C.porConfirmar.map((d) => '- ' + d.campo + ': ' + d.estado).join('\n')}
`;
}

// Un ZIP por semana. Si pasa de 29 MB (el chat acepta 30), se parte en dos: reels y perfil / carruseles y meme.
const LIMITE = 29 * 1048576;
const GRUPOS = { reels: ['01-', '04-', PERFIL, 'LEEME'], carruseles: ['02-', '03-', '05-', '06-', 'LEEME'] };
function empacar(out, grupo) {
  if (fs.existsSync(out)) fs.unlinkSync(out);
  execFileSync('python3', ['-c', `
import os, zipfile, sys, json
src, out, pref = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
raiz = os.path.basename(out)[:-4]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for d, _, fs_ in os.walk(src):
        for f in sorted(fs_):
            if f.endswith('.html'): continue
            p = os.path.join(d, f); r = os.path.relpath(p, src)
            if pref and not any(r.startswith(x) for x in pref): continue
            z.write(p, os.path.join(raiz, r))
`, SALIDA, out, JSON.stringify(grupo || [])]);
  return out;
}
function zips() {
  fs.writeFileSync(path.join(SALIDA, 'LEEME.txt'), leeme());
  const dir = path.dirname(SALIDA);
  fs.readdirSync(dir).filter((f) => f.endsWith('.zip')).forEach((f) => fs.unlinkSync(path.join(dir, f)));
  const uno = empacar(path.join(dir, ZIP), null);
  if (fs.statSync(uno).size <= LIMITE) return [uno];
  fs.unlinkSync(uno);
  return Object.entries(GRUPOS).map(([g, pref], i) => empacar(path.join(dir, ZIP.replace('.zip', `-parte${i + 1}-${g}.zip`)), pref));
}

fs.mkdirSync(path.join(BASE, 'kit'), { recursive: true });
const zs = zips();
const ZIP_PARTES = zs.length;
const html = pagina();
fs.writeFileSync(path.join(BASE, 'kit', 'index.html'), html);
fs.writeFileSync(path.join(BASE, 'kit', 'archivos.json'), JSON.stringify(archivos, null, 2) + '\n');
const faltan = Object.values(archivos).filter((f) => !fs.existsSync(path.join(ROOT, f)));
if (faltan.length) { console.error('Faltan archivos del kit:', faltan); process.exit(1); }
const peso = Object.values(archivos).reduce((a, f) => a + fs.statSync(path.join(ROOT, f)).size, 0);
console.log('kit/index.html', (html.length / 1024).toFixed(0) + ' KB ·', Object.keys(archivos).length, 'archivos (' + (peso / 1048576).toFixed(1) + ' MB) ·', zs.map((z) => path.basename(z) + ' ' + (fs.statSync(z).size / 1048576).toFixed(1) + ' MB').join(' · '));
