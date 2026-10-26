// Diseño "cacao" del kit: lienzo continuo (N × 1080 por 1350) que se corta en slides.
// Fondos cacao casi negro con grano, titulares crema en Fredoka y texto en Nunito (CLAUDE.md), acentos
// dorados, goteo de chocolate, teléfonos y recortes de la app real en modo oscuro y, al pie de cada slide
// intermedio, el ciclo abierto en dorado. Regla visual del plan: ningún pastel ilustrado ni hecho con IA;
// solo capturas reales, tipografía, gráficas e íconos de línea (los mismos íconos de index.html).
// Los textos salen de contenido.cjs (los mismos que valida contar-palabras.cjs).
const fs = require('fs');
const path = require('path');

const W = 1080, H = 1350;
const C = {
  fondo0: '#140D09', fondo1: '#1C130E', fondo2: '#241811', superficie: '#1A120E',
  crema: '#FFF4E6', cremaPapel: '#F4E7D4', tinta: '#2A1D16', marron: '#7B5B4B',
  dorado: '#E7B676', contexto: '#8A6E5E'
};
const EJEMPLO = 'Datos de ejemplo';
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pngSize(f) { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
let uid = 0; const id = (p) => `${p}${++uid}`;
function azar(semilla) { let s = semilla; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

// Título con las partes "destacado" en oro.
function conOro(texto, destacado) {
  let h = esc(texto);
  (destacado || []).forEach((d) => { const e = esc(d); const i = h.indexOf(e); if (i >= 0) h = h.slice(0, i) + `<span class="oro">${e}</span>` + h.slice(i + e.length); });
  return h;
}

// Íconos de línea: los mismos de la app (var ICONS en index.html) + el del Agente IA y tres propios.
function iconosDeLaApp(ROOT) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const bloque = (html.match(/var ICONS=\{([\s\S]*?)\};/) || [])[1] || '';
  const out = {};
  for (const m of bloque.matchAll(/(\w+):'((?:[^'\\]|\\.)*)'/g)) out[m[1]] = m[2];
  out.sparkle = '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M18.5 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>';
  out.clock = '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>';
  out.flame = '<path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3 2-4.9 3.4-6.5.4 1.6 1.3 2.6 2.4 3 .2-2.9 1.3-5.5 3.6-7.4-.3 2.7.7 4.6 2 6.4 1 1.4 1.6 2.8 1.6 4.5C19 18.6 15.9 21 12 21Z"/><path d="M12 21c-1.5 0-2.6-1.1-2.6-2.6 0-1.5 1.2-2.4 2.1-3.4.4 1 1 1.5 1.7 1.7.2-.9.6-1.6 1.2-2.2.4 1.1 1.2 2 1.2 3.4 0 1.7-1.6 3.1-3.6 3.1Z"/>';
  out.bulb = '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2v.5h5V16c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/>';
  return out;
}

function crearDiseno({ ROOT, capDir, rel, materialDir }) {
  const svgArchivo = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"');
  const lockupClaro = svgArchivo('pastelia-lockup-oscuro.svg');
  const icono = svgArchivo('pastelia-icon.svg');
  const ICONOS = iconosDeLaApp(ROOT);
  const cap = (f) => rel + f;
  const iconoSVG = (nombre, tam, color = C.dorado, grosor = 1.6) => `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${ICONOS[nombre] || ''}</svg>`;

  // ── Ambiente ──
  const brillo = (x, y, d, o = 0.5, color = C.marron) => `<div class="brillo" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;opacity:${o};background:radial-gradient(circle,${color} 0%,rgba(0,0,0,0) 68%)"></div>`;
  function polvo(n, ancho, semilla, alto = H) {
    const r = azar(semilla); let h = '';
    for (let k = 0; k < n; k++) { const s = 2 + r() * 4; h += `<i style="left:${Math.round(r() * ancho)}px;top:${Math.round(r() * alto)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;opacity:${(0.12 + r() * 0.4).toFixed(2)}"></i>`; }
    return `<div class="polvo">${h}</div>`;
  }
  function destellos(lista) {
    return lista.map(([x, y, s, o = 1]) => `<svg class="obj" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;z-index:7;opacity:${o};filter:drop-shadow(0 0 ${Math.round(s / 3)}px rgba(231,182,118,.8))" viewBox="0 0 100 100"><path d="M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0 Z" fill="#F6DDAE"/></svg>`).join('');
  }

  // ── Goteo de chocolate desde el borde superior ──
  function goteo({ x, w, y = 0, base = 64, semilla = 3, z = 6 }) {
    const r = azar(semilla), g = id('g'), gotas = []; let cx = 50 + r() * 70;
    while (cx < w - 50) { const ancho = 44 + r() * 46, largo = 30 + r() * 190; gotas.push({ cx, ancho, largo }); cx += ancho + 40 + r() * 120; }
    let d = `M0,0 H${w} V${base}`;
    for (let k = gotas.length - 1; k >= 0; k--) {
      const { cx: c, ancho, largo } = gotas[k], xr = c + ancho / 2, xl = c - ancho / 2, f = base + largo;
      d += ` L${(xr + 16).toFixed(1)},${base} Q${xr.toFixed(1)},${base} ${xr.toFixed(1)},${base + 18} C${xr.toFixed(1)},${(base + largo * 0.62).toFixed(1)} ${(xr + 1).toFixed(1)},${f.toFixed(1)} ${c.toFixed(1)},${f.toFixed(1)} C${(xl - 1).toFixed(1)},${f.toFixed(1)} ${xl.toFixed(1)},${(base + largo * 0.62).toFixed(1)} ${xl.toFixed(1)},${base + 18} Q${xl.toFixed(1)},${base} ${(xl - 16).toFixed(1)},${base}`;
    }
    d += ` L0,${base} Z`;
    const brillos = gotas.map(({ cx: c, ancho, largo }) => `<path d="M${(c - ancho * 0.22).toFixed(1)},${base + 22} L${(c - ancho * 0.22).toFixed(1)},${(base + largo * 0.72).toFixed(1)}" stroke="rgba(255,232,206,.30)" stroke-width="${(ancho * 0.14).toFixed(1)}" stroke-linecap="round"/><ellipse cx="${(c - ancho * 0.12).toFixed(1)}" cy="${(base + largo - ancho * 0.18).toFixed(1)}" rx="${(ancho * 0.1).toFixed(1)}" ry="${(ancho * 0.14).toFixed(1)}" fill="rgba(255,240,222,.42)"/>`).join('');
    const alto = base + Math.max(...gotas.map((q) => q.largo)) + 20;
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${alto}px;z-index:${z};filter:drop-shadow(0 18px 22px rgba(0,0,0,.5))" viewBox="0 0 ${w} ${alto}">
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A3E26"/><stop offset=".45" stop-color="#4A2A19"/><stop offset="1" stop-color="#2E190F"/></linearGradient></defs>
      <path d="${d}" fill="url(#${g})"/><path d="M0,${base - 16} H${w}" stroke="rgba(255,226,196,.13)" stroke-width="10"/>${brillos}</svg>`;
  }

  // ── Libreta (renglones con tachones y "$ ?") ──
  function libreta({ x, y, w, rot = 0, z = 3, apagada = false }) {
    const ren = []; for (let yy = 150; yy <= 700; yy += 56) ren.push(yy);
    let cuerpo = '';
    ren.forEach((yy, i) => {
      const ancho = 200 + ((i * 97) % 200), n = Math.floor(ancho / 40);
      cuerpo += `<path d="M118,${yy - 14} q20,-16 40,0${' t40,0'.repeat(Math.max(n - 1, 1))}" stroke="#8B6B5A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`;
      if (i % 3 === 1) cuerpo += `<path d="M104,${yy - 16} L${130 + ancho},${yy - 26}" stroke="#B5523B" stroke-width="9" stroke-linecap="round"/>`;
      if (i % 4 === 2) cuerpo += `<text x="${150 + ancho}" y="${yy - 6}" font-family="Nunito" font-style="italic" font-weight="900" font-size="40" fill="#8B6B5A" transform="rotate(-6 ${150 + ancho} ${yy})">$ ?</text>`;
    });
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))${apagada ? ' saturate(.45) brightness(.72)' : ''}">
    <svg viewBox="0 0 600 760" width="100%" style="overflow:visible">
      <rect x="14" y="10" width="572" height="740" rx="20" fill="${C.cremaPapel}"/>
      ${ren.map((yy) => `<line x1="40" y1="${yy}" x2="560" y2="${yy}" stroke="#DCC6A8" stroke-width="3"/>`).join('')}
      <line x1="96" y1="40" x2="96" y2="740" stroke="#C76B5D" stroke-width="3" opacity=".7"/>
      ${[80, 160, 240, 320, 400, 480].map((xx) => `<rect x="${xx}" y="-6" width="16" height="44" rx="8" fill="#C9A066"/>`).join('')}
      ${cuerpo}</svg></div>`;
  }

  // ── Burbujas de chat genéricas (no imitan WhatsApp) ──
  function burbuja({ x, y, w, texto, tipo = 'cliente', esqueleto = false, z = 6, borde = false, rot = 0, tam = 40 }) {
    const fondo = tipo === 'respuesta' ? 'linear-gradient(135deg,#FBE3B4,#E7B676 55%,#C9914A)' : C.cremaPapel;
    const radio = tipo === 'respuesta' ? '40px 40px 10px 40px' : '40px 40px 40px 10px';
    const cont = esqueleto ? '<b style="width:86%"></b><b style="width:58%"></b>' : esc(texto);
    return `<div class="burbuja${esqueleto ? ' esq' : ''}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};background:${fondo};border-radius:${radio};transform:rotate(${rot}deg);font-size:${tam}px;${borde ? 'box-shadow:0 0 0 5px #E7B676,0 0 50px rgba(231,182,118,.55),0 30px 60px -20px rgba(0,0,0,.6);' : ''}">${cont}</div>`;
  }

  // ── Teléfono con una captura real (o una pantalla propia) ──
  function telefono({ src, html, w, x, y, rot = 0, ry = 0, z = 3, brilloOro = false }) {
    const p = Math.round(w * 0.034), h = Math.round((w - 2 * p) * 2.1641 + 2 * p), barra = Math.round(w * 0.105);
    const pantalla = html || `<div class="estado" style="height:${barra}px;font-size:${Math.round(w * 0.04)}px;padding:0 ${Math.round(w * 0.09)}px"><b>9:41</b><i></i></div><img src="${cap(src)}" alt="" style="top:${barra}px">`;
    return `<div class="tel" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};transform:perspective(3200px) rotateY(${ry}deg) rotate(${rot}deg);border-radius:${Math.round(w * 0.17)}px;padding:${p}px;${brilloOro ? 'box-shadow:0 0 120px rgba(231,182,118,.35),0 70px 120px -40px rgba(0,0,0,.8),inset 0 0 0 2px rgba(231,182,118,.35);' : ''}">
      <div class="pantalla" style="border-radius:${Math.round(w * 0.14)}px">${pantalla}
        <div class="isla" style="width:${Math.round(w * 0.3)}px;height:${Math.round(w * 0.082)}px;top:${Math.round(w * 0.026)}px"></div></div></div>`;
  }
  function notificacion(w) {
    return `<div style="position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 20%,#4A3022,#1A0F0A 70%)"></div>
      <div style="position:absolute;left:6%;right:6%;top:${Math.round(w * 0.62)}px;background:rgba(255,244,230,.14);border:2px solid rgba(255,244,230,.22);border-radius:${Math.round(w * 0.07)}px;padding:${Math.round(w * 0.045)}px;display:flex;gap:${Math.round(w * 0.04)}px;box-shadow:0 0 70px rgba(231,182,118,.55),0 0 0 3px rgba(231,182,118,.65)">
        <div style="flex:none;width:${Math.round(w * 0.14)}px;height:${Math.round(w * 0.14)}px;border-radius:${Math.round(w * 0.035)}px;background:linear-gradient(135deg,#7B5B4B,#3A2A22);display:flex;align-items:center;justify-content:center">${iconoSVG('chat', Math.round(w * 0.085), C.crema, 2)}</div>
        <div style="flex:1;display:flex;flex-direction:column;gap:${Math.round(w * 0.022)}px;justify-content:center">
          <b style="height:${Math.round(w * 0.032)}px;width:48%;border-radius:99px;background:rgba(255,244,230,.75)"></b>
          <b style="height:${Math.round(w * 0.026)}px;width:92%;border-radius:99px;background:rgba(255,244,230,.4);filter:blur(1.5px)"></b>
          <b style="height:${Math.round(w * 0.026)}px;width:70%;border-radius:99px;background:rgba(255,244,230,.4);filter:blur(1.5px)"></b></div></div>`;
  }

  // ── Recorte de una captura como tarjeta flotante, con aro dorado opcional ──
  function tarjeta({ src, rect, w, x, y, rot = 0, ry = 0, z = 5, radio = 28, papel = false, aro }) {
    const { w: iw, h: ih } = pngSize(path.join(capDir, src));
    const [x0, y0, x1, y1] = rect || [0, 0, iw, ih];
    const s = w / (x1 - x0), h = Math.round((y1 - y0) * s);
    const anillo = aro ? `<div class="aro-oro" style="left:${Math.round((aro[0] - x0) * s)}px;top:${Math.round((aro[1] - y0) * s)}px;width:${Math.round((aro[2] - aro[0]) * s)}px;height:${Math.round((aro[3] - aro[1]) * s)}px"></div>` : '';
    return `<div class="tarjeta${papel ? ' papel' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};border-radius:${radio}px;transform:perspective(3200px) rotateY(${ry}deg) rotate(${rot}deg)"><img src="${cap(src)}" alt="" style="width:${Math.round(iw * s)}px;left:${Math.round(-x0 * s)}px;top:${Math.round(-y0 * s)}px">${anillo}</div>`;
  }

  // ── Texto, nota "Datos de ejemplo", ciclo abierto y CTA ──
  const notaHTML = (n, extraStyle = '') => (n === EJEMPLO
    ? `<p class="ejemplo" style="${extraStyle}"><i></i>${esc(n)}</p>`
    : `<p class="nota" style="${extraStyle}">${esc(n)}</p>`);
  function texto(i, s, { top = 96, tam = 92, ancho = 912, alinear = 'left', x = 84, mostrarTexto = true, mostrarNota = true, kicker = false } = {}) {
    return `<div class="txt" style="left:${i * W + x}px;top:${top}px;width:${ancho}px;text-align:${alinear}">
      ${kicker && s.kicker ? `<p class="kicker">${esc(s.kicker)}</p>` : ''}
      <h2 class="tit" style="font-size:${tam}px">${conOro(s.titulo, s.destacado)}</h2>
      ${s.texto && mostrarTexto ? `<p class="cuerpo">${esc(s.texto)}</p>` : ''}
      ${s.nota && mostrarNota ? notaHTML(s.nota) : ''}</div>`;
  }
  function ciclo(i, s) {
    if (!s.loop) return '';
    return `<div class="velo" style="left:${i * W}px"></div>
      <div class="ciclo" style="left:${i * W + 84}px"><span>${esc(s.loop)}</span><i><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E7B676" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></i></div>`;
  }
  function numeroGigante(i, n, { x = 70, y = 64, tam = 250 } = {}) { return `<div class="gigante" style="left:${i * W + x}px;top:${y}px;font-size:${tam}px">${esc(n)}</div>`; }
  function lockup(x, y, w = 320) { return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 0.263)}px;z-index:8">${lockupClaro}</div>`; }
  function iconoBrillante(x, y, d) {
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:5;border-radius:${Math.round(d * 0.24)}px;box-shadow:0 0 0 3px rgba(231,182,118,.6),0 0 140px rgba(231,182,118,.55),0 0 300px rgba(231,182,118,.25)">${icono}</div>
      <div class="rayos" style="left:${x + d / 2 - 420}px;top:${y + d / 2 - 420}px"></div>`;
  }
  function pildoraCTA(palabra, ctaTexto, { escala = 1 } = {}) {
    const [antes, despues] = ctaTexto.split(palabra);
    return `<div class="pildora" style="transform:scale(${escala});transform-origin:top center"><span>${esc(antes.trim())}</span><b>${esc(palabra)}</b><span>${esc(despues.trim())}</span></div>`;
  }
  function cta(i, s, palabra, { top = 380, tam = 100 } = {}) {
    return `<div class="txt" style="left:${i * W + 84}px;top:${top}px;width:912px;text-align:center">
      <h2 class="tit" style="font-size:${tam}px">${conOro(s.titulo, s.destacado)}</h2>
      ${pildoraCTA(palabra, s.cta)}</div>`;
  }

  // ── c1 · las 4 partes del precio (monto oculto para invitar a deslizar) ──
  function partes(x, y, items) {
    return items.map((it, k) => `<div class="parte" style="left:${x}px;top:${y + k * 150}px"><span class="num">${k + 1}</span><span class="ico">${iconoSVG(it.icono, 50, C.marron, 1.8)}</span><b>${esc(it.label)}</b><i>$ —</i></div>`).join('');
  }

  // ── c2 · medidor "lo que te queda" (escala de −150 a $300; el cero es una línea dorada punteada) ──
  function medidor({ x, y, w, desde, hasta, negativo = 0 }) {
    const min = -150, max = 300, px = (v) => x + (v - min) / (max - min) * w, x0 = px(0), alto = 76;
    const relleno = hasta > 0 ? `<div style="position:absolute;left:${x0 - x}px;top:0;width:${px(hasta) - x0}px;height:${alto}px;border-radius:0 14px 14px 0;background:linear-gradient(180deg,#F6D9A4,#E7B676);box-shadow:0 0 40px rgba(231,182,118,.45)"></div>` : '';
    const ido = desde > hasta && desde > 0 ? `<div style="position:absolute;left:${px(Math.max(hasta, 0)) - x}px;top:0;width:${px(desde) - px(Math.max(hasta, 0))}px;height:${alto}px;background:repeating-linear-gradient(135deg,rgba(138,110,94,.55) 0 10px,rgba(138,110,94,.18) 10px 20px);border:2px solid rgba(138,110,94,.7);border-left:0"></div>` : '';
    const neg = negativo ? `<div style="position:absolute;left:${px(-negativo) - x}px;top:0;width:${x0 - px(-negativo)}px;height:${alto}px;border:4px dashed #C9714F;border-right:0;border-radius:14px 0 0 14px;background:repeating-linear-gradient(135deg,rgba(201,113,79,.28) 0 10px,rgba(201,113,79,.08) 10px 20px);display:flex;align-items:center;justify-content:center;font:700 44px/1 'Fredoka';color:#E9A585">?</div>` : '';
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${alto}px;z-index:6;border-radius:14px;background:rgba(255,244,230,.06);box-shadow:inset 0 0 0 2px rgba(255,244,230,.12)">
      ${ido}${relleno}${neg}<div style="position:absolute;left:${x0 - x - 3}px;top:-26px;width:0;height:${alto + 52}px;border-left:6px dotted ${C.dorado}"></div></div>`;
  }

  // ── c2 · cascada: de lo que cobraste a lo que te queda ──
  function cascada({ x, y, w, h, filas }) {
    const min = -130, max = 510, k = h / (max - min), yv = (v) => y + (max - v) * k, n = filas.length, gap = 26, cw = (w - gap * (n - 1)) / n;
    let acc = 0, html = '';
    filas.forEach((f, i) => {
      const cx = x + i * (cw + gap);
      let top, bottom, estilo;
      if (f.tipo === 'total') { top = yv(f.v); bottom = yv(0); acc = f.v; estilo = `background:linear-gradient(180deg,#FFF4E6,#E9D8C0)`; }
      else if (f.v != null) { top = yv(acc); bottom = yv(acc + f.v); acc += f.v; estilo = `background:${C.contexto}`; }
      else { const paso = 55; top = yv(Math.min(acc, 0)); bottom = yv(Math.min(acc, 0) - paso); acc = Math.min(acc, 0) - paso; estilo = `border:4px dashed ${C.dorado};background:repeating-linear-gradient(135deg,rgba(231,182,118,.22) 0 10px,rgba(231,182,118,.05) 10px 20px);box-shadow:0 0 34px rgba(231,182,118,.35)`; }
      html += `<div style="position:absolute;left:${cx}px;top:${top}px;width:${cw}px;height:${Math.max(bottom - top, 6)}px;border-radius:10px;${estilo}">${f.v == null ? `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 46px/1 'Fredoka';color:${C.dorado}">?</span>` : ''}</div>`;
      if (i < n - 1) html += `<div style="position:absolute;left:${cx + cw}px;top:${yv(f.v == null ? acc : acc)}px;width:${gap}px;border-top:3px dotted rgba(255,244,230,.4)"></div>`;
      html += `<div style="position:absolute;left:${cx - 8}px;top:${y + h + 18}px;width:${cw + 16}px;text-align:center"><div style="font:800 24px/1.15 'Nunito';color:rgba(255,244,230,.74)">${esc(f.label)}</div><div style="font:600 34px/1.2 'Fredoka';color:${f.v == null ? C.dorado : C.crema};margin-top:4px">${esc(f.monto)}</div></div>`;
    });
    return `<div class="obj" style="left:0;top:0;width:${x + w}px;height:${y + h + 120}px;z-index:6">
      <div style="position:absolute;left:${x - 20}px;top:${yv(0)}px;width:${w + 40}px;border-top:4px solid rgba(255,244,230,.55)"></div>
      <div style="position:absolute;left:${x + w - 210}px;top:${yv(0) - 44}px;font:800 26px/1 'Nunito';color:rgba(255,244,230,.55);text-align:right;width:210px">$0</div>
      ${html}</div>`;
  }

  // ── c2 · ticket de portada: renglones borrosos y "Te queda: $0" ──
  function ticket({ x, y, w, rot = -4 }) {
    const filas = [0.62, 0.48, 0.7, 0.55].map((f) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:20px"><b style="height:22px;width:${Math.round(f * 100)}%;border-radius:99px;background:rgba(42,29,22,.22);filter:blur(1.4px)"></b><b style="height:22px;width:18%;border-radius:99px;background:rgba(42,29,22,.3);filter:blur(1.4px)"></b></div>`).join('');
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:6;transform:rotate(${rot}deg);filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))">
      <div style="background:${C.cremaPapel};border-radius:22px 22px 0 0;padding:44px 48px 36px;display:flex;flex-direction:column;gap:30px">
        <div style="height:16px;width:40%;border-radius:99px;background:rgba(123,91,75,.45);margin:0 auto 6px"></div>${filas}
        <div style="border-top:4px dashed rgba(123,91,75,.45);padding-top:26px;display:flex;justify-content:space-between;align-items:baseline"><span style="font:800 44px/1 'Nunito';color:${C.tinta}">Te queda</span><span style="font:700 120px/.9 'Fredoka';background:linear-gradient(180deg,#D9A35C,#A9732F);-webkit-background-clip:text;background-clip:text;color:transparent">$0</span></div></div>
      <svg viewBox="0 0 520 26" preserveAspectRatio="none" style="display:block;width:100%;height:26px"><path d="M0,0 H520 V6 ${Array.from({ length: 13 }, (_, k) => `L${k * 40 + 20},26 L${k * 40 + 40},6`).join(' ')} L0,6 Z" fill="${C.cremaPapel}"/></svg></div>`;
  }

  // ── Ilustraciones de línea (sin pasteles) ──
  function circuloIcono(x, y, d, nombre, z = 6) {
    return `<div class="obj circulo" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:${z}">${iconoSVG(nombre, Math.round(d * 0.52), C.dorado, 1.5)}</div>`;
  }
  function cajaBase({ x, y, w }) {
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 0.8}px;z-index:6;filter:drop-shadow(0 0 24px rgba(231,182,118,.35))" viewBox="0 0 300 240" fill="none" stroke="${C.dorado}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M40 92 L150 46 L260 92 L150 138 Z"/><path d="M40 92 V180 L150 226 V138"/><path d="M260 92 V180 L150 226"/><path d="M40 92 L18 52 L128 8 L150 46"/><path d="M260 92 L282 52 L172 8 L150 46" opacity=".55"/>
      <ellipse cx="150" cy="196" rx="0" ry="0"/></svg>
      <svg class="obj" style="left:${x - w * 0.22}px;top:${y + w * 0.62}px;width:${w * 0.7}px;height:${w * 0.24}px;z-index:7" viewBox="0 0 210 72" fill="none" stroke="${C.dorado}" stroke-width="6"><ellipse cx="105" cy="30" rx="96" ry="24"/><path d="M9 30 V40 C9 53 52 64 105 64 C158 64 201 53 201 40 V30" opacity=".7"/></svg>`;
  }
  function insignia(x, y, txt) { return `<div class="insignia" style="left:${x}px;top:${y}px">${esc(txt)}</div>`; }

  // ── Marco para foto real (portada alterna de p1). Si existe marketing/material/<nombre>.jpg|png, la usa. ──
  function marcoFoto({ x, y, w, h, nombre }) {
    const foto = ['.jpg', '.jpeg', '.png', '.webp'].map((e) => path.join(materialDir || '', nombre + e)).find((f) => materialDir && fs.existsSync(f));
    if (foto) return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:5;border-radius:36px;overflow:hidden;box-shadow:0 0 0 4px ${C.dorado},0 50px 90px -30px rgba(0,0,0,.8)"><img src="file://${foto}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
    return `<div class="obj marco-foto" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:5">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="${C.dorado}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.4-2h5.8l1.4 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg>
      <b>Tu foto aquí</b><span>Foto real tuya, vertical y con luz natural.<br>Sin pasteles hechos con IA.</span></div>`;
  }

  const ruido = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .93  0 0 0 0 .86  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>');
  const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#000;font-family:'Nunito',system-ui,sans-serif}
  .lienzo{position:relative;height:${H}px;overflow:hidden;background:linear-gradient(180deg,${C.fondo1} 0%,${C.fondo0} 100%)}
  .grano{position:absolute;inset:0;z-index:20;pointer-events:none;opacity:.07;background-image:url("data:image/svg+xml,${ruido}");mix-blend-mode:screen}
  .brillo{position:absolute;border-radius:50%;z-index:0}
  .polvo i{position:absolute;border-radius:50%;background:#F6DDAE;z-index:1}
  .obj{position:absolute}
  .txt{position:absolute;z-index:10;color:${C.crema}}
  .tit{font-family:'Fredoka';font-weight:600;line-height:1.04;letter-spacing:-.01em;text-wrap:balance;text-shadow:0 8px 40px rgba(0,0,0,.45)}
  .oro{background:linear-gradient(180deg,#FCE6B8 10%,#E7B676 55%,#C08A43 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 6px 26px rgba(231,182,118,.28))}
  .kicker{font:900 30px/1 'Nunito';letter-spacing:.14em;text-transform:uppercase;color:${C.dorado};margin-bottom:26px}
  .cuerpo{font:800 40px/1.28 'Nunito';margin-top:26px;color:rgba(255,244,230,.84);text-wrap:pretty}
  .nota{font:700 26px/1.3 'Nunito';margin-top:18px;color:rgba(255,244,230,.55)}
  .ejemplo{display:inline-flex;align-items:center;gap:12px;margin-top:22px;font:800 26px/1 'Nunito';color:${C.dorado};background:rgba(231,182,118,.12);border:2px solid rgba(231,182,118,.7);border-radius:999px;padding:12px 22px 12px 16px}
  .ejemplo i{width:26px;height:26px;border-radius:50%;border:3px solid ${C.dorado};position:relative;flex:none}
  .ejemplo i:after{content:"i";position:absolute;inset:0;font:900 17px/20px 'Nunito';font-style:normal;text-align:center;color:${C.dorado}}
  .velo{position:absolute;top:1040px;width:${W}px;height:${H - 1040}px;z-index:9;background:linear-gradient(180deg,rgba(20,13,9,0) 0%,rgba(20,13,9,.88) 55%,rgba(20,13,9,.96) 100%)}
  .ciclo{position:absolute;top:1170px;width:912px;z-index:11;display:flex;align-items:center;justify-content:flex-end;gap:22px;font:italic 900 42px/1.12 'Nunito';color:${C.dorado};text-align:right}
  .ciclo i{flex:none;width:72px;height:72px;border-radius:50%;border:3px solid ${C.dorado};display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(231,182,118,.35)}
  .gigante{position:absolute;z-index:2;font-family:'Fredoka';font-weight:700;line-height:.8;letter-spacing:-.04em;background:linear-gradient(180deg,#FCE6B8 0%,#E7B676 45%,#8F5E26 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.92}
  .cifra{font-family:'Fredoka';font-weight:700;line-height:.9;letter-spacing:-.03em}
  .tel{position:absolute;background:linear-gradient(145deg,#2c2622,#0b0908 45%,#1a1613);box-shadow:0 70px 120px -40px rgba(0,0,0,.85),inset 0 0 0 2px rgba(231,182,118,.22)}
  .pantalla{position:relative;width:100%;height:100%;overflow:hidden;background:#201811}
  .pantalla img{position:absolute;left:0;width:100%;display:block}
  .estado{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;font-family:'Nunito';color:${C.crema};z-index:2}
  .estado i{width:18%;height:28%;border-radius:4px;background:linear-gradient(90deg,${C.crema} 70%,rgba(255,244,230,.3) 70%)}
  .isla{position:absolute;left:50%;transform:translateX(-50%);background:#050404;border-radius:999px;z-index:3}
  .tarjeta{position:absolute;overflow:hidden;background:#2C231D;box-shadow:0 50px 90px -30px rgba(0,0,0,.85),0 0 0 2px rgba(231,182,118,.45),0 0 70px rgba(231,182,118,.16)}
  .tarjeta img{position:absolute;max-width:none;display:block}
  .papel{background:#fff;box-shadow:0 60px 110px -30px rgba(0,0,0,.9),0 0 0 2px rgba(231,182,118,.5),0 0 90px rgba(231,182,118,.2)}
  .aro-oro{position:absolute;border:5px solid ${C.dorado};border-radius:22px;box-shadow:0 0 40px rgba(231,182,118,.7),inset 0 0 24px rgba(231,182,118,.25)}
  .burbuja{position:absolute;padding:30px 38px;font-family:'Nunito';font-weight:900;line-height:1.2;color:${C.tinta};box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
  .burbuja.esq{display:flex;flex-direction:column;gap:16px;padding:30px 34px;background:rgba(244,231,212,.16)!important;border:2px solid rgba(244,231,212,.18)}
  .burbuja.esq b{height:18px;border-radius:99px;background:rgba(244,231,212,.38)}
  .rayos{position:absolute;width:840px;height:840px;z-index:1;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(231,182,118,.16) 0deg 4deg,rgba(231,182,118,0) 4deg 18deg);-webkit-mask:radial-gradient(circle,#000 20%,transparent 68%);mask:radial-gradient(circle,#000 20%,transparent 68%)}
  .pildora{display:inline-flex;flex-direction:column;align-items:center;gap:12px;margin-top:64px;background:linear-gradient(180deg,#2E2019,#1E1510);border:3px solid ${C.dorado};color:${C.crema};border-radius:44px;padding:42px 70px 50px;box-shadow:0 0 80px rgba(231,182,118,.28),0 50px 90px -34px rgba(0,0,0,.8)}
  .pildora span{font:800 44px/1.1 'Nunito';color:rgba(255,244,230,.88)}
  .pildora b{font:700 128px/1 'Fredoka';letter-spacing:-.01em;background:linear-gradient(180deg,#FCE6B8 10%,#E7B676 55%,#C08A43 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
  .parte{position:absolute;z-index:6;width:780px;display:flex;align-items:center;gap:26px;background:${C.cremaPapel};color:${C.tinta};border-radius:30px;padding:24px 34px;box-shadow:0 30px 60px -24px rgba(0,0,0,.7)}
  .parte .num{flex:none;width:66px;height:66px;border-radius:50%;background:linear-gradient(180deg,#F6D9A4,#C9914A);color:${C.tinta};font:700 40px/66px 'Fredoka';text-align:center}
  .parte .ico{flex:none;width:58px;height:58px;display:flex;align-items:center;justify-content:center}
  .parte b{flex:1;font:900 48px/1 'Nunito'}
  .parte i{font:700 44px/1 'Fredoka';font-style:normal;color:rgba(42,29,22,.38)}
  .circulo{border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 40% 35%,#3A2619,#1A0F09 72%);box-shadow:0 0 0 3px rgba(231,182,118,.55),0 0 70px rgba(231,182,118,.28)}
  .insignia{position:absolute;z-index:8;font:900 40px/1 'Nunito';letter-spacing:.06em;color:${C.tinta};background:linear-gradient(135deg,#FBE3B4,#E7B676 55%,#C9914A);border-radius:999px;padding:16px 30px;box-shadow:0 0 40px rgba(231,182,118,.5)}
  .etiqueta-sec{position:absolute;z-index:10;font:900 30px/1 'Nunito';letter-spacing:.14em;text-transform:uppercase;color:${C.dorado}}
  .marco-foto{border-radius:36px;border:5px dashed ${C.dorado};background:repeating-linear-gradient(135deg,rgba(231,182,118,.08) 0 18px,rgba(231,182,118,.02) 18px 36px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;color:${C.crema}}
  .marco-foto b{font:600 64px/1 'Fredoka';color:${C.dorado}}
  .marco-foto span{font:800 30px/1.35 'Nunito';color:rgba(255,244,230,.72)}`;

  return { C, ICONOS, iconoSVG, brillo, polvo, destellos, goteo, libreta, burbuja, telefono, notificacion, tarjeta, notaHTML, texto, ciclo, numeroGigante, lockup, iconoBrillante, pildoraCTA, cta, partes, medidor, cascada, ticket, circuloIcono, cajaBase, insignia, marcoFoto, css };
}

// Recortes (px de las capturas a 1170 de ancho, modo oscuro). Verificados contra las capturas del 26 oct.
const R = {
  costeoFilas: [66, 540, 1104, 935], insumosFila: [74, 566, 1096, 642], manoDeObra: [74, 656, 1096, 732],
  extrasFila: [74, 746, 1096, 822], margenFila: [74, 836, 1096, 912], precioSugerido: [74, 968, 1096, 1058],
  manteq: [40, 448, 1130, 668], manteqCosto: [838, 498, 1060, 612],
  entregasHoy: [30, 220, 640, 440], porCobrar: [50, 770, 580, 1000],
  extrasLista: [50, 990, 1120, 1570], floresFila: [60, 1095, 1110, 1230], margenCard: [50, 1590, 1120, 1830], margen40: [762, 1640, 994, 1768],
  agenteHeader: [20, 30, 1150, 180], agenteBurbuja: [30, 250, 1010, 585], agenteEntrada: [30, 2092, 1150, 2205],
  manoResumen: [40, 215, 1000, 280]
};

function composicion(p, D) {
  const S = p.slides, x = (i) => i * W, el = [];
  const add = (...a) => el.push(...a);
  const ambiente = (semilla) => { for (let i = 0; i < S.length; i++) add(D.brillo(x(i) + (i % 2 ? 860 : 220), i % 2 ? 1180 : 260, 1100, 0.42)); add(D.polvo(S.length * 26, S.length * W, semilla)); };

  if (p.id === 'c1') {
    ambiente(51);
    // 1 · Portada: titular, $714 en oro (dato de ejemplo) y el teléfono con el costeo real cruzando al slide 2
    add(D.goteo({ x: 0, w: W, semilla: 6, z: 9 }));
    add(`<div class="txt" style="left:84px;top:300px;width:912px"><h2 class="tit" style="font-size:112px">${conOro(S[0].titulo, S[0].destacado)}</h2></div>`);
    add(`<div class="txt" style="left:84px;top:700px;width:640px"><div class="cifra oro" style="font-size:250px">$714</div>${D.notaHTML(S[0].nota, 'margin-top:28px')}</div>`);
    add(D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 460, x: 720, y: 640, rot: 8, brilloOro: true }), D.lockup(84, 1232, 290));
    // 2 · A ojo, algo se queda fuera
    add(D.texto(1, S[1]), D.libreta({ x: x(1) + 440, y: 610, w: 560, rot: -6 }), D.ciclo(1, S[1]));
    // 3 · Las 4 partes (montos ocultos)
    add(D.texto(2, S[2], { mostrarTexto: false }));
    add(D.partes(x(2) + 150, 330, [{ label: S[2].extra[0], icono: 'jar' }, { label: S[2].extra[1], icono: 'whisk' }, { label: S[2].extra[2], icono: 'bow' }, { label: S[2].extra[3], icono: 'coin' }]), D.ciclo(2, S[2]));
    // 4 · Insumos $210: Mis precios + fila del costeo
    add(D.numeroGigante(3, S[3].kicker), D.texto(3, S[3], { top: 300 }));
    add(D.telefono({ src: '02b-mis-precios.png', w: 390, x: x(3) + 650, y: 660, rot: 7 }), D.tarjeta({ src: '06-cotizar-paso3-costeo.png', rect: R.costeoFilas, w: 700, x: x(3) + 70, y: 790, rot: -3, radio: 26, aro: R.insumosFila, z: 6 }), D.ciclo(3, S[3]));
    // 5 · Mano de obra $180: el teléfono cruza al slide 6
    add(D.numeroGigante(4, S[4].kicker), D.texto(4, S[4], { top: 300 }));
    add(D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 440, x: x(4) + 790, y: 600, rot: 8, z: 3 }), D.tarjeta({ src: '06-cotizar-paso3-costeo.png', rect: R.costeoFilas, w: 780, x: x(4) + 70, y: 760, rot: -3, radio: 26, aro: R.manoDeObra, z: 6 }), D.ciclo(4, S[4]));
    // 6 · Extras $120: lista real de Extras de diseño
    add(D.numeroGigante(5, S[5].kicker), D.texto(5, S[5], { top: 300 }));
    add(D.tarjeta({ src: '12-extras-mis-precios.png', rect: R.extrasLista, w: 660, x: x(5) + 300, y: 690, rot: 3, radio: 30, aro: R.floresFila }), D.ciclo(5, S[5]));
    // 7 · Margen 40%: tarjeta del margen + fila del costeo
    add(D.numeroGigante(6, S[6].kicker), D.texto(6, S[6], { top: 300 }));
    add(D.tarjeta({ src: '12-extras-mis-precios.png', rect: R.margenCard, w: 700, x: x(6) + 70, y: 690, rot: -2, radio: 30, aro: R.margen40 }), D.tarjeta({ src: '06-cotizar-paso3-costeo.png', rect: R.costeoFilas, w: 600, x: x(6) + 400, y: 880, rot: 3, radio: 26, aro: R.margenFila, z: 6 }), D.ciclo(6, S[6]));
    // 8 · Resultado + CTA: el Resumen en vivo real
    add(D.goteo({ x: x(7) - 120, w: W + 120, semilla: 14 }));
    add(`<div class="txt" style="left:${x(7) + 84}px;top:270px;width:912px;text-align:center"><h2 class="tit" style="font-size:92px">${conOro(S[7].titulo, S[7].destacado)}</h2>${D.notaHTML(S[7].nota)}</div>`);
    add(D.tarjeta({ src: '07-resumen-en-vivo.png', w: 500, x: x(7) + 290, y: 552, rot: -2, radio: 34 }));
    add(`<div class="txt" style="left:${x(7) + 84}px;top:1032px;width:912px;text-align:center">${D.pildoraCTA(p.palabra, S[7].cta, { escala: 0.78 }).replace('margin-top:64px', '')}</div>`);
  }

  if (p.id === 'p1') {
    ambiente(61);
    // 1 · Portada tipográfica (versión solo texto; la versión con foto se arma aparte)
    add(`<div class="obj" style="left:56px;top:40px;z-index:1;font:700 380px/1 'Fredoka';color:#E7B676;opacity:.3">“</div>`);
    add(`<div class="txt" style="left:84px;top:320px;width:912px"><p class="kicker">${esc(S[0].kicker)}</p><h2 class="tit" style="font-size:124px">${conOro(S[0].titulo, S[0].destacado)}</h2></div>`);
    add(D.libreta({ x: 690, y: 980, w: 520, rot: -9, apagada: true }), D.destellos([[930, 300, 40], [150, 1120, 22]]), D.lockup(84, 1232, 290));
    // 2 · Cobraba a ojo (la libreta cruza al slide 3)
    add(D.texto(1, S[1], { tam: 128 }), D.libreta({ x: x(1) + 560, y: 620, w: 580, rot: -5 }), D.ciclo(1, S[1]));
    // 3 · Libreta y WhatsApp: burbujas genéricas
    add(D.texto(2, S[2]));
    [[360, 640, 560, 'cliente', false], [470, 790, 500, 'respuesta', false], [330, 930, 600, 'cliente', true]].forEach(([bx, by, bw, t, b]) => add(D.burbuja({ x: x(2) + bx, y: by, w: bw, esqueleto: true, tipo: t, borde: b, z: b ? 8 : 6 })));
    add(D.ciclo(2, S[2]));
    // 4 · Saber mis costos: gramo, tiempo y ganancia
    add(D.texto(3, S[3], { tam: 84 }));
    [['jar', 150], ['clock', 430], ['coin', 710]].forEach(([ic, cx]) => add(D.circuloIcono(x(3) + cx, 720, 220, ic)));
    add(D.ciclo(3, S[3]));
    // 5 · El cotizador por gramo: Mis precios real
    add(D.texto(4, S[4]), D.telefono({ src: '02b-mis-precios.png', w: 400, x: x(4) + 640, y: 640, rot: 7 }));
    add(D.tarjeta({ src: '02b-mis-precios.png', rect: R.manteq, w: 700, x: x(4) + 60, y: 790, rot: -3, radio: 34, aro: R.manteqCosto }), D.ciclo(4, S[4]));
    // 6 · La agenda: Inicio real con entregas de hoy y por cobrar
    add(D.texto(5, S[5]), D.telefono({ src: '01-inicio.png', w: 420, x: x(5) + 60, y: 650, rot: -7 }));
    add(D.tarjeta({ src: '01-inicio.png', rect: R.entregasHoy, w: 500, x: x(5) + 490, y: 690, rot: 4, radio: 30 }), D.tarjeta({ src: '01-inicio.png', rect: R.porCobrar, w: 410, x: x(5) + 560, y: 930, rot: -3, radio: 30 }), D.ciclo(5, S[5]));
    // 7 · Está en beta: ícono con halo y etiqueta beta
    add(D.texto(6, S[6]), D.iconoBrillante(x(6) + 390, 650, 300), D.insignia(x(6) + 610, 610, S[6].extra[0]), D.ciclo(6, S[6]));
    // 8 · CTA
    add(D.goteo({ x: x(7) - 120, w: W + 120, semilla: 16 }), D.lockup(x(7) + 380, 270, 320), D.cta(7, S[7], p.palabra, { top: 440 }));
  }

  if (p.id === 'c2') {
    ambiente(71);
    // 1 · Portada: titular y ticket "Te queda: $0"
    add(D.goteo({ x: 0, w: W, semilla: 8, z: 9 }));
    add(`<div class="txt" style="left:84px;top:300px;width:912px"><h2 class="tit" style="font-size:140px">${conOro(S[0].titulo, S[0].destacado)}</h2></div>`);
    add(D.ticket({ x: 470, y: 760, w: 520, rot: -4 }), D.lockup(84, 1232, 290));
    // 2 · "Me quedan $300": la cuenta que hacemos a ojo
    add(D.texto(1, S[1], { tam: 110 }));
    const [izq, der] = S[1].extra[0].split('=');
    add(`<div class="txt" style="left:${x(1) + 84}px;top:700px;width:912px;text-align:center"><div class="cifra" style="font-size:112px;color:#FFF4E6">${esc(izq.trim())} = <span class="oro">${esc(der.trim())}</span></div></div>`);
    add(D.ciclo(1, S[1]));
    // 3–6 · Los 4 costos: medidor de lo que te queda
    const pasos = [{ i: 2, desde: 300, hasta: 120 }, { i: 3, desde: 120, hasta: 0 }, { i: 4, desde: 0, hasta: 0, negativo: 70, ilus: 'caja' }, { i: 5, desde: 0, hasta: 0, negativo: 130, ilus: 'gas' }];
    pasos.forEach(({ i, desde, hasta, negativo, ilus }) => {
      add(D.numeroGigante(i, S[i].kicker), D.texto(i, S[i], { top: 300, ancho: ilus ? 640 : 912 }));
      const [et, ...monto] = S[i].extra[0].split(' ');
      add(`<div class="txt" style="left:${x(i) + 84}px;top:770px;width:912px;display:flex;align-items:baseline;gap:20px"><span style="font:800 44px/1 'Nunito';color:rgba(255,244,230,.75)">${esc(et)}</span><span class="cifra ${hasta > 0 ? 'oro' : ''}" style="font-size:96px;${hasta > 0 ? '' : 'color:#E9A585'}">${esc(monto.join(' '))}</span></div>`);
      add(D.medidor({ x: x(i) + 84, y: 900, w: 912, desde, hasta, negativo }));
      if (ilus === 'caja') add(D.cajaBase({ x: x(i) + 780, y: 330, w: 230 }));
      if (ilus === 'gas') { add(D.circuloIcono(x(i) + 760, 300, 200, 'flame')); add(D.circuloIcono(x(i) + 840, 520, 150, 'bulb')); }
      add(D.ciclo(i, S[i]));
    });
    // 7 · Cascada: de lo que cobraste a lo que te queda
    add(D.texto(6, S[6], { tam: 88 }));
    const ex = S[6].extra.map((e) => { const m = e.match(/^(.*?)\s((?:−?\$)\s?\S+)$/); return m ? { label: m[1], monto: m[2] } : { label: e, monto: '' }; });
    add(D.cascada({ x: x(6) + 84, y: 430, w: 912, h: 500, filas: [
      { ...ex[0], tipo: 'total', v: 510 }, { ...ex[1], v: -210 }, { ...ex[2], v: -180 }, { ...ex[3], v: -120 }, { ...ex[4], v: null }, { ...ex[5], v: null }] }));
    add(D.ciclo(6, S[6]));
    // 8 · En Pastelia: la ventana real "Nuevo extra" sobre la lista de extras
    add(D.texto(7, S[7]));
    add(D.tarjeta({ src: '13-nuevo-extra-tarjeta.png', w: 560, x: x(7) + 450, y: 500, rot: 2, radio: 36, z: 5 }), D.tarjeta({ src: '12-extras-mis-precios.png', rect: R.extrasLista, w: 540, x: x(7) + 60, y: 790, rot: -3, radio: 30, z: 7 }), D.ciclo(7, S[7]));
    // 9 · CTA
    add(D.goteo({ x: x(8) - 120, w: W + 120, semilla: 18 }), D.lockup(x(8) + 380, 270, 320), D.cta(8, S[8], p.palabra, { top: 440 }));
  }

  if (p.id === 'm1') {
    const s = S[0];
    add(D.brillo(260, 300, 1100, 0.45), D.brillo(860, 1100, 1100, 0.4), D.polvo(30, W, 81));
    add(`<div class="etiqueta-sec" style="left:84px;top:84px">${esc(s.extra[0])}</div>`);
    add(D.burbuja({ x: 84, y: 136, w: 860, texto: s.titulo, tam: 62 }));
    add(`<div class="etiqueta-sec" style="left:84px;top:470px">${esc(s.extra[1])}</div>`);
    add(D.tarjeta({ src: '07-resumen-en-vivo.png', w: 540, x: 84, y: 520, rot: -2, radio: 34, aro: R.manoResumen }));
    add(`<div class="txt" style="left:690px;top:560px;width:330px">${D.notaHTML(s.nota, 'margin:0')}</div>`);
    add(`<svg class="obj" style="left:640px;top:660px;width:300px;height:230px;z-index:7;filter:drop-shadow(0 0 14px rgba(231,182,118,.6))" viewBox="0 0 300 230" fill="none" stroke="#E7B676" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M270 20 C250 120 160 170 40 190"/><path d="M78 160 L36 191 L82 214"/></svg>`);
    add(`<div class="txt" style="left:84px;top:1080px;width:912px"><h2 class="tit" style="font-size:60px;line-height:1.12">${conOro(s.texto, s.destacadoTexto)}</h2></div>`);
    add(D.lockup(84, 1262, 220), `<div class="txt" style="right:84px;top:1272px;font:800 32px/1 'Nunito';color:rgba(255,244,230,.7)">${esc(s.extra[2])}</div>`);
  }
  return el.join('\n');
}

const FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap" rel="stylesheet">';

function carruselHTML({ p, ROOT, capDir, rel, materialDir }) {
  const D = crearDiseno({ ROOT, capDir, rel, materialDir });
  const n = p.slides.length;
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · ${esc(p.titulo)}</title>
${FUENTES}
<style>${D.css}</style></head><body>
<div class="lienzo" style="width:${n * W}px">
${composicion(p, D)}
<div class="grano"></div>
</div></body></html>`;
}

// Portada alterna de p1 con marco para foto real (1 slide).
function portadaConFotoHTML({ p, ROOT, capDir, rel, materialDir }) {
  const D = crearDiseno({ ROOT, capDir, rel, materialDir });
  const s = p.slides[0];
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · portada con foto</title>
${FUENTES}
<style>${D.css}</style></head><body>
<div class="lienzo" style="width:${W}px">
${D.brillo(220, 260, 1100, 0.42)}${D.polvo(26, W, 63)}
${D.marcoFoto({ x: 84, y: 84, w: 912, h: 560, nombre: p.fotoPortada })}
<div class="txt" style="left:84px;top:690px;width:912px"><p class="kicker">${esc(s.kicker)}</p><h2 class="tit" style="font-size:92px">${conOro(s.titulo, s.destacado)}</h2></div>
${D.lockup(84, 1232, 290)}
<div class="grano"></div>
</div></body></html>`;
}

module.exports = { carruselHTML, portadaConFotoHTML, crearDiseno, composicion, W, H, C, R, FUENTES, EJEMPLO };
