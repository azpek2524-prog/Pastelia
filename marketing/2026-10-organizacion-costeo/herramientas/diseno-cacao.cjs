// Diseño "cacao" de los carruseles: lienzo continuo (N × 1080 por 1350) que se corta en slides.
// Fondos oscuros cacao con grano, titulares crema (Nunito Black), acentos dorados, goteo de
// chocolate, pastel con hoja de oro, teléfonos con la app real en modo oscuro, tarjetas flotantes
// con recortes ampliados de la app y, al pie de cada slide, el ciclo abierto en dorado.
// Los textos salen de contenido.cjs (los mismos que valida contar-palabras.cjs).
const fs = require('fs');
const path = require('path');

const W = 1080, H = 1350;
const C = {
  fondo0: '#140D09', fondo1: '#1C130E', fondo2: '#241811', superficie: '#1A120E',
  crema: '#FFF4E6', cremaPapel: '#F4E7D4', tinta: '#2A1D16', marron: '#7B5B4B',
  dorado: '#E7B676', contexto: '#8A6E5E'
};
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

function crearDiseno({ ROOT, capDir, rel }) {
  const svgArchivo = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"');
  const lockupClaro = svgArchivo('pastelia-lockup-oscuro.svg');
  const icono = svgArchivo('pastelia-icon.svg');
  const cap = (f) => rel + f;

  // ── Ambiente ──
  const brillo = (x, y, d, o = 0.5, color = C.marron) => `<div class="brillo" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;opacity:${o};background:radial-gradient(circle,${color} 0%,rgba(0,0,0,0) 68%)"></div>`;
  function polvo(n, ancho, semilla) {
    const r = azar(semilla); let h = '';
    for (let k = 0; k < n; k++) { const s = 2 + r() * 4; h += `<i style="left:${Math.round(r() * ancho)}px;top:${Math.round(r() * H)}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;opacity:${(0.12 + r() * 0.4).toFixed(2)}"></i>`; }
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

  // ── Pastel de chocolate con frambuesas y hoja de oro sobre base dorada ──
  function pastel({ x, y, w, z = 3, rot = 0 }) {
    const k = id('p');
    const frente = (cx) => 190 + 26 * Math.sqrt(Math.max(0, 1 - ((cx - 200) / 140) ** 2));
    const r = azar(7); let gotas = '';
    for (let cx = 78; cx <= 322; cx += 26 + r() * 14) { const ancho = 16 + r() * 10, largo = 18 + r() * 64, top = frente(cx) - 4; gotas += `<path d="M${cx - ancho / 2},${top} C${cx - ancho / 2},${top + largo * 0.7} ${cx - ancho / 2 + 1},${top + largo} ${cx},${top + largo} C${cx + ancho / 2 - 1},${top + largo} ${cx + ancho / 2},${top + largo * 0.7} ${cx + ancho / 2},${top} Z" fill="url(#${k}gn)"/><ellipse cx="${cx - ancho * 0.15}" cy="${top + largo - ancho * 0.2}" rx="${ancho * 0.12}" ry="${ancho * 0.18}" fill="rgba(255,236,214,.35)"/>`; }
    const frambuesa = (cx, cy) => `<g><circle cx="${cx}" cy="${cy}" r="17" fill="url(#${k}fr)"/>${[[-7, -6], [5, -8], [9, 3], [-2, 7], [-9, 4], [2, -1]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="4.2" fill="rgba(255,150,160,.35)"/>`).join('')}</g>`;
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 40px 46px rgba(0,0,0,.55))">
    <svg viewBox="0 0 400 470" width="100%">
      <defs>
        <linearGradient id="${k}cu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#24120A"/><stop offset=".38" stop-color="#6B412B"/><stop offset=".55" stop-color="#5A3422"/><stop offset="1" stop-color="#1E0F08"/></linearGradient>
        <radialGradient id="${k}to" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="#6E432C"/><stop offset="1" stop-color="#2A150C"/></radialGradient>
        <linearGradient id="${k}gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A2818"/><stop offset="1" stop-color="#2A150C"/></linearGradient>
        <linearGradient id="${k}or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset=".5" stop-color="#E7B676"/><stop offset="1" stop-color="#A9732F"/></linearGradient>
        <radialGradient id="${k}fr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FF7A8A"/><stop offset=".6" stop-color="#C7263F"/><stop offset="1" stop-color="#6E0C1F"/></radialGradient>
      </defs>
      <ellipse cx="200" cy="448" rx="78" ry="12" fill="url(#${k}or)"/><path d="M176,382 L224,382 L246,446 L154,446 Z" fill="url(#${k}or)"/>
      <ellipse cx="200" cy="384" rx="190" ry="30" fill="#8F5E26"/><ellipse cx="200" cy="376" rx="190" ry="28" fill="url(#${k}or)"/>
      <path d="M60,190 L60,360 A140,24 0 0 0 340,360 L340,190 Z" fill="url(#${k}cu)"/>
      <rect x="128" y="200" width="16" height="150" rx="8" fill="rgba(255,226,196,.08)"/>
      <ellipse cx="200" cy="190" rx="140" ry="26" fill="url(#${k}to)"/>
      ${gotas}
      <ellipse cx="170" cy="180" rx="60" ry="9" fill="rgba(255,236,214,.12)"/>
      ${frambuesa(150, 168)}${frambuesa(250, 166)}${frambuesa(205, 178)}
      <path d="M182,150 L214,128 L236,156 L206,170 Z" fill="url(#${k}or)"/><path d="M196,150 L222,140" stroke="rgba(255,255,255,.6)" stroke-width="2"/>
      <path d="M262,118 L276,174 L246,170 Z" fill="#2A150C"/><path d="M265,124 L270,160" stroke="rgba(255,236,214,.3)" stroke-width="2"/>
    </svg></div>`;
  }

  function pastelito({ x, y, w, o = 1 }) {
    const k = id('q');
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${w}px;z-index:5;opacity:${o};filter:drop-shadow(0 0 18px rgba(231,182,118,.35))" viewBox="0 0 100 100"><defs><linearGradient id="${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset=".55" stop-color="#E7B676"/><stop offset="1" stop-color="#A9732F"/></linearGradient></defs>
      <rect x="47" y="12" width="6" height="16" rx="3" fill="url(#${k})"/><path d="M50 2 C54 7 54 11 50 13 C46 11 46 7 50 2 Z" fill="#FCE6B8"/>
      <rect x="28" y="30" width="44" height="22" rx="7" fill="url(#${k})"/><rect x="16" y="54" width="68" height="28" rx="8" fill="url(#${k})"/><rect x="8" y="84" width="84" height="8" rx="4" fill="url(#${k})" opacity=".8"/></svg>`;
  }

  // ── Libreta (renglones, tachones, palomitas, receta, vacía o cerrada) ──
  function libreta({ x, y, w, rot = 0, modo = 'tachones', z = 3, apagada = false }) {
    const k = id('l'); const ren = []; for (let yy = 150; yy <= 700; yy += 56) ren.push(yy);
    let cuerpo = '';
    if (modo === 'cerrada') {
      return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))${apagada ? ' saturate(.5) brightness(.8)' : ''}">
      <svg viewBox="0 0 600 760" width="100%"><defs><linearGradient id="${k}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4A3428"/><stop offset="1" stop-color="#22160F"/></linearGradient></defs>
      <rect x="14" y="10" width="572" height="740" rx="26" fill="url(#${k}c)"/><rect x="14" y="10" width="40" height="740" rx="18" fill="rgba(0,0,0,.25)"/>
      <rect x="430" y="10" width="26" height="740" fill="#B9823F" opacity=".85"/><rect x="434" y="10" width="6" height="740" fill="rgba(255,240,210,.35)"/>
      <rect x="160" y="300" width="220" height="90" rx="14" fill="none" stroke="rgba(231,182,118,.45)" stroke-width="4"/></svg></div>`;
    }
    ren.forEach((yy, i) => {
      if (modo === 'tachones') {
        const ancho = 200 + ((i * 97) % 200), n = Math.floor(ancho / 40);
        cuerpo += `<path d="M118,${yy - 14} q20,-16 40,0${' t40,0'.repeat(Math.max(n - 1, 1))}" stroke="#8B6B5A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>`;
        if (i % 3 === 1) cuerpo += `<path d="M104,${yy - 16} L${130 + ancho},${yy - 26}" stroke="#B5523B" stroke-width="9" stroke-linecap="round"/>`;
        if (i % 4 === 2) cuerpo += `<text x="${150 + ancho}" y="${yy - 6}" font-family="Nunito" font-style="italic" font-weight="900" font-size="40" fill="#8B6B5A" transform="rotate(-6 ${150 + ancho} ${yy})">$ ?</text>`;
      } else if (modo === 'receta') {
        if (i === 0) {
          cuerpo += `<rect x="118" y="${yy - 34}" width="290" height="20" rx="10" fill="#7B5B4B" opacity=".85"/>`;
          cuerpo += `<g transform="translate(452 ${yy - 96})" stroke="#8B6B5A" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 86 H104 M16 86 V50 H94 V86 M30 50 V28 H80 V50 M55 28 V12"/><path d="M55 4 C59 8 59 11 55 13 C51 11 51 8 55 4 Z" fill="#B9823F" stroke="none"/></g>`;
        } else if (i < 9) {
          const g = (i * 37) % 40;
          cuerpo += `<circle cx="128" cy="${yy - 18}" r="7" fill="#B9823F"/><rect x="150" y="${yy - 24}" width="${150 + ((i * 71) % 170)}" height="12" rx="6" fill="#8B6B5A" opacity=".6"/><rect x="${480 - g}" y="${yy - 24}" width="${60 + g}" height="12" rx="6" fill="#B9823F" opacity=".55"/>`;
        }
      } else if (modo === 'palomitas') {
        if (i < 7) {
          cuerpo += `<path d="M114,${yy - 18} l12,12 l22,-26" stroke="#B9823F" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="170" y="${yy - 24}" width="${170 + ((i * 83) % 200)}" height="12" rx="6" fill="#8B6B5A" opacity=".6"/>`;
        } else if (i === 7) {
          cuerpo += `<circle cx="132" cy="${yy - 18}" r="16" fill="none" stroke="#C9A066" stroke-width="5" stroke-dasharray="6 6"/><text x="300" y="${yy + 30}" font-family="Nunito" font-weight="900" font-size="150" fill="url(#${k}o)" text-anchor="middle" style="filter:drop-shadow(0 0 18px rgba(231,182,118,.8))">?</text>`;
        }
      }
    });
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))${apagada ? ' saturate(.45) brightness(.72)' : ''}">
    <svg viewBox="0 0 600 760" width="100%" style="overflow:visible"><defs><linearGradient id="${k}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset="1" stop-color="#C98E45"/></linearGradient></defs>
      <rect x="14" y="10" width="572" height="740" rx="20" fill="${C.cremaPapel}"/>
      ${ren.map((yy) => `<line x1="40" y1="${yy}" x2="560" y2="${yy}" stroke="#DCC6A8" stroke-width="3"/>`).join('')}
      <line x1="96" y1="40" x2="96" y2="740" stroke="#C76B5D" stroke-width="3" opacity=".7"/>
      ${[80, 160, 240, 320, 400, 480].map((xx) => `<rect x="${xx}" y="-6" width="16" height="44" rx="8" fill="#C9A066"/>`).join('')}
      ${cuerpo}</svg></div>`;
  }

  // ── Burbujas de chat genéricas (no imitan WhatsApp) ──
  function burbuja({ x, y, w, texto, tipo = 'cliente', esqueleto = false, z = 6, borde = false, rot = 0 }) {
    const fondo = tipo === 'respuesta' ? 'linear-gradient(135deg,#FBE3B4,#E7B676 55%,#C9914A)' : C.cremaPapel;
    const radio = tipo === 'respuesta' ? '40px 40px 10px 40px' : '40px 40px 40px 10px';
    const cont = esqueleto ? `<b style="width:86%"></b><b style="width:58%"></b>` : esc(texto);
    return `<div class="burbuja${esqueleto ? ' esq' : ''}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};background:${fondo};border-radius:${radio};transform:rotate(${rot}deg);${borde ? 'box-shadow:0 0 0 5px #E7B676,0 0 50px rgba(231,182,118,.55),0 30px 60px -20px rgba(0,0,0,.6);' : ''}">${cont}</div>`;
  }

  // ── Etiqueta de precio, cadena dorada, eslabón roto, lupa ──
  function etiqueta({ x, y, w, rot = 0, texto = '$ ?', z = 4, borroso = 0, apagada = false }) {
    const k = id('t');
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.55))${borroso ? ` blur(${borroso}px)` : ''}${apagada ? ' saturate(.4) brightness(.75)' : ''}">
    <svg viewBox="0 0 520 300" width="100%"><defs><linearGradient id="${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E6"/><stop offset="1" stop-color="#E9D8C0"/></linearGradient></defs>
      <path d="M95,24 H470 Q500,24 500,54 V246 Q500,276 470,276 H95 L18,150 Z" fill="url(#${k})" stroke="url(#${k})" stroke-width="20" stroke-linejoin="round"/>
      <path d="M100,34 H466 Q488,34 488,58" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>
      <circle cx="88" cy="150" r="18" fill="${C.fondo1}"/><circle cx="88" cy="150" r="18" fill="none" stroke="#C9A066" stroke-width="5"/>
      <text x="300" y="194" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="120" fill="${C.tinta}">${esc(texto)}</text></svg></div>`;
  }
  function cadena({ x1, y1, x2, y2, z = 3, paso = 58 }) {
    const k = id('c'), dx = x2 - x1, dy = y2 - y1, largo = Math.hypot(dx, dy), ang = Math.atan2(dy, dx) * 180 / Math.PI, n = Math.floor(largo / paso);
    const minx = Math.min(x1, x2) - 60, miny = Math.min(y1, y2) - 60, ancho = Math.abs(dx) + 120, alto = Math.abs(dy) + 120;
    let es = '';
    for (let i = 0; i <= n; i++) { const t = i / Math.max(n, 1), cx = x1 + dx * t - minx, cy = y1 + dy * t - miny; es += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${i % 2 ? 36 : 38}" ry="${i % 2 ? 9 : 19}" transform="rotate(${ang.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})" fill="none" stroke="url(#${k})" stroke-width="${i % 2 ? 10 : 9}"/>`; }
    return `<svg class="obj" style="left:${minx}px;top:${miny}px;width:${ancho}px;height:${alto}px;z-index:${z};filter:drop-shadow(0 14px 16px rgba(0,0,0,.55))" viewBox="0 0 ${ancho} ${alto}"><defs><linearGradient id="${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset=".5" stop-color="#E7B676"/><stop offset="1" stop-color="#9C6A2C"/></linearGradient></defs>${es}</svg>`;
  }
  function eslabonRoto({ x, y, w, z = 5 }) {
    const k = id('e');
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 0.62}px;z-index:${z};filter:drop-shadow(0 0 30px rgba(231,182,118,.45)) drop-shadow(0 20px 26px rgba(0,0,0,.55))" viewBox="0 0 400 248"><defs><linearGradient id="${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset=".5" stop-color="#E7B676"/><stop offset="1" stop-color="#9C6A2C"/></linearGradient></defs>
      <path d="M150,70 A70,52 0 1 0 150,178" fill="none" stroke="url(#${k})" stroke-width="26" stroke-linecap="round"/>
      <path d="M250,70 A70,52 0 1 1 250,178" fill="none" stroke="url(#${k})" stroke-width="26" stroke-linecap="round"/>
      <path d="M182,96 L202,84 M178,124 L206,124 M182,152 L202,164" stroke="#F6DDAE" stroke-width="7" stroke-linecap="round"/></svg>`;
  }
  function lupa({ x, y, w, z = 6, rot = -18 }) {
    const k = id('u');
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${w}px;z-index:${z};transform:rotate(${rot}deg);filter:drop-shadow(0 24px 30px rgba(0,0,0,.6))" viewBox="0 0 200 200"><defs><linearGradient id="${k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset=".5" stop-color="#E7B676"/><stop offset="1" stop-color="#9C6A2C"/></linearGradient></defs>
      <circle cx="82" cy="82" r="58" fill="rgba(255,244,230,.12)" stroke="url(#${k})" stroke-width="16"/><path d="M126,126 L182,182" stroke="url(#${k})" stroke-width="22" stroke-linecap="round"/><path d="M52,62 A40,40 0 0 1 82,40" stroke="rgba(255,255,255,.7)" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
  }
  function luna({ x, y, d, z = 2 }) {
    const k = id('m');
    return `<svg class="obj" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:${z};filter:drop-shadow(0 0 60px rgba(231,182,118,.55))" viewBox="0 0 100 100"><defs><linearGradient id="${k}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FCE6B8"/><stop offset="1" stop-color="#C98E45"/></linearGradient><mask id="${k}"><rect width="100" height="100" fill="#fff"/><circle cx="66" cy="38" r="40" fill="#000"/></mask></defs><circle cx="50" cy="50" r="44" fill="url(#${k}g)" mask="url(#${k})"/></svg>`;
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
      <svg style="position:absolute;left:50%;top:${Math.round(w * 0.2)}px;transform:translateX(-50%);width:${Math.round(w * 0.11)}px" viewBox="0 0 24 28" fill="none" stroke="rgba(255,244,230,.7)" stroke-width="2.2" stroke-linecap="round"><path d="M7 12V8a5 5 0 0 1 10 0v4"/><rect x="4" y="12" width="16" height="13" rx="3" fill="rgba(255,244,230,.12)"/></svg>
      <div style="position:absolute;left:6%;right:6%;top:${Math.round(w * 0.62)}px;background:rgba(255,244,230,.14);backdrop-filter:blur(14px);border:2px solid rgba(255,244,230,.22);border-radius:${Math.round(w * 0.07)}px;padding:${Math.round(w * 0.045)}px;display:flex;gap:${Math.round(w * 0.04)}px;box-shadow:0 0 70px rgba(231,182,118,.55),0 0 0 3px rgba(231,182,118,.65)">
        <div style="flex:none;width:${Math.round(w * 0.14)}px;height:${Math.round(w * 0.14)}px;border-radius:${Math.round(w * 0.035)}px;background:linear-gradient(135deg,#7B5B4B,#3A2A22);display:flex;align-items:center;justify-content:center"><svg width="60%" viewBox="0 0 24 24" fill="none" stroke="#FFF4E6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5h14A1.5 1.5 0 0 1 20.5 7v7A1.5 1.5 0 0 1 19 15.5H10l-4 3.2V15.5H5A1.5 1.5 0 0 1 3.5 14V7A1.5 1.5 0 0 1 5 5.5Z"/></svg></div>
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

  // ── Barra apilada de énfasis: una parte en dorado, el resto en un tono neutro ──
  function barraEnfasis({ x, y, w, partes, total }) {
    const suma = partes.reduce((a, p) => a + p.valor, 0), gap = 2, alto = 64; let acc = 0;
    const segs = partes.map((p, k) => {
      const ancho = (w - gap * (partes.length - 1)) * p.valor / suma, x0 = acc; acc += ancho + gap;
      const ultimo = k === partes.length - 1;
      return { ...p, x0, ancho, radio: ultimo ? '0 8px 8px 0' : '0' };
    });
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:6">
      <div style="display:flex;justify-content:flex-end;align-items:baseline;gap:18px;margin-bottom:26px"><span style="font:800 34px/1 'Nunito';color:rgba(255,244,230,.7)">Total</span><span style="font:900 120px/0.9 'Nunito';letter-spacing:-.04em;color:${C.crema}">${esc(total)}</span></div>
      <div style="position:relative;height:${alto}px">${segs.map((s) => `<div style="position:absolute;left:${s.x0.toFixed(1)}px;width:${s.ancho.toFixed(1)}px;top:0;bottom:0;background:${s.enfasis ? `linear-gradient(180deg,#F6D9A4,${C.dorado})` : C.contexto};border-radius:${s.radio};${s.enfasis ? 'box-shadow:0 0 40px rgba(231,182,118,.45)' : ''}"></div>`).join('')}</div>
      <div style="position:relative;height:120px;margin-top:22px">${segs.map((s) => `<div style="position:absolute;left:${s.x0.toFixed(1)}px;width:${Math.max(s.ancho, 150).toFixed(1)}px;top:0">
        <div style="display:flex;align-items:center;gap:10px;font:800 28px/1.1 'Nunito';color:${s.enfasis ? C.crema : 'rgba(255,244,230,.72)'}"><i style="flex:none;width:16px;height:16px;border-radius:50%;background:${s.enfasis ? C.dorado : C.contexto}"></i>${esc(s.etiqueta)}</div>
        <div style="font:900 ${s.enfasis ? 52 : 42}px/1.1 'Nunito';color:${C.crema};margin-top:8px;letter-spacing:-.02em">${esc(s.monto)}</div></div>`).join('')}</div></div>`;
  }

  // ── Texto, ciclo abierto, CTA ──
  function texto(i, s, { top = 96, tam = 92, ancho = 912, alinear = 'left', x = 84, mostrarTexto = true, mostrarNota = true } = {}) {
    return `<div class="txt" style="left:${i * W + x}px;top:${top}px;width:${ancho}px;text-align:${alinear}">
      <h2 class="tit" style="font-size:${tam}px">${conOro(s.titulo, s.destacado)}</h2>
      ${s.texto && mostrarTexto ? `<p class="cuerpo">${esc(s.texto)}</p>` : ''}
      ${s.nota && mostrarNota ? `<p class="nota">${esc(s.nota)}</p>` : ''}</div>`;
  }
  function ciclo(i, s) {
    if (!s.loop) return '';
    return `<div class="velo" style="left:${i * W}px"></div>
      <div class="ciclo" style="left:${i * W + 84}px"><span>${esc(s.loop)}</span><i><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E7B676" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></i></div>`;
  }
  function numeroGigante(i, n, { x = 640, y = 40, tam = 420 } = {}) { return `<div class="gigante" style="left:${i * W + x}px;top:${y}px;font-size:${tam}px">${esc(n)}</div>`; }
  function lockup(x, y, w = 320) { return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 0.263)}px;z-index:8">${lockupClaro}</div>`; }
  function iconoBrillante(x, y, d) {
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${d}px;height:${d}px;z-index:5;border-radius:${Math.round(d * 0.24)}px;box-shadow:0 0 0 3px rgba(231,182,118,.6),0 0 140px rgba(231,182,118,.55),0 0 300px rgba(231,182,118,.25)">${icono}</div>
      <div class="rayos" style="left:${x + d / 2 - 420}px;top:${y + d / 2 - 420}px"></div>`;
  }
  function cta(i, s, palabra, { top = 380 } = {}) {
    const [antes, despues] = s.cta.split(palabra);
    return `<div class="txt" style="left:${i * W + 84}px;top:${top}px;width:912px;text-align:center">
      <h2 class="tit" style="font-size:100px">${conOro(s.titulo, s.destacado)}</h2>
      <div class="pildora"><span>${esc(antes.trim())}</span><b>${esc(palabra)}</b><span>${esc(despues.trim())}</span></div></div>`;
  }

  const ruido = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .93  0 0 0 0 .86  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`);
  const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#000;font-family:'Nunito',system-ui,sans-serif}
  .lienzo{position:relative;height:${H}px;overflow:hidden;background:linear-gradient(180deg,${C.fondo1} 0%,${C.fondo0} 100%)}
  .grano{position:absolute;inset:0;z-index:20;pointer-events:none;opacity:.07;background-image:url("data:image/svg+xml,${ruido}");mix-blend-mode:screen}
  .brillo{position:absolute;border-radius:50%;z-index:0}
  .polvo i{position:absolute;border-radius:50%;background:#F6DDAE;z-index:1}
  .obj{position:absolute}
  .txt{position:absolute;z-index:10;color:${C.crema}}
  .tit{font-family:'Nunito';font-weight:900;line-height:1;letter-spacing:-.035em;text-wrap:balance;text-shadow:0 8px 40px rgba(0,0,0,.45)}
  .oro{background:linear-gradient(180deg,#FCE6B8 10%,#E7B676 55%,#C08A43 100%);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 6px 26px rgba(231,182,118,.28))}
  .cuerpo{font:800 40px/1.28 'Nunito';margin-top:26px;color:rgba(255,244,230,.84);text-wrap:pretty}
  .nota{font:700 26px/1.3 'Nunito';margin-top:18px;color:rgba(255,244,230,.55)}
  .velo{position:absolute;top:1040px;width:${W}px;height:${H - 1040}px;z-index:9;background:linear-gradient(180deg,rgba(20,13,9,0) 0%,rgba(20,13,9,.88) 55%,rgba(20,13,9,.96) 100%)}
  .ciclo{position:absolute;top:1170px;width:912px;z-index:11;display:flex;align-items:center;justify-content:flex-end;gap:22px;font:italic 900 42px/1.12 'Nunito';color:${C.dorado};text-align:right}
  .ciclo i{flex:none;width:72px;height:72px;border-radius:50%;border:3px solid ${C.dorado};display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(231,182,118,.35)}
  .gigante{position:absolute;z-index:2;font-family:'Nunito';font-weight:900;line-height:.8;letter-spacing:-.06em;background:linear-gradient(180deg,#FCE6B8 0%,#E7B676 45%,#8F5E26 100%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.92}
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
  .burbuja{position:absolute;padding:30px 38px;font:900 40px/1.2 'Nunito';color:${C.tinta};box-shadow:0 30px 60px -20px rgba(0,0,0,.6)}
  .burbuja.esq{display:flex;flex-direction:column;gap:16px;padding:30px 34px;background:rgba(244,231,212,.16)!important;border:2px solid rgba(244,231,212,.18)}
  .burbuja.esq b{height:18px;border-radius:99px;background:rgba(244,231,212,.38)}
  .rayos{position:absolute;width:840px;height:840px;z-index:1;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(231,182,118,.16) 0deg 4deg,rgba(231,182,118,0) 4deg 18deg);-webkit-mask:radial-gradient(circle,#000 20%,transparent 68%);mask:radial-gradient(circle,#000 20%,transparent 68%)}
  .pildora{display:inline-flex;flex-direction:column;align-items:center;gap:12px;margin-top:70px;background:linear-gradient(180deg,#2E2019,#1E1510);border:3px solid ${C.dorado};color:${C.crema};border-radius:44px;padding:44px 70px 52px;box-shadow:0 0 80px rgba(231,182,118,.28),0 50px 90px -34px rgba(0,0,0,.8)}
  .pildora span{font:800 44px/1.1 'Nunito';color:rgba(255,244,230,.88)}
  .pildora b{font:900 132px/1 'Nunito';letter-spacing:-.02em;background:linear-gradient(180deg,#FCE6B8 10%,#E7B676 55%,#C08A43 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
  .ecuacion{position:absolute;z-index:6;display:flex;align-items:center;justify-content:center;gap:26px;font:900 128px/1 'Nunito';color:${C.crema};letter-spacing:-.03em}
  .ecuacion .q{font-size:330px;line-height:.8;background:linear-gradient(180deg,#FCE6B8,#E7B676 55%,#B37A35);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 40px rgba(231,182,118,.6))}
  .bloque{position:absolute;z-index:6;display:flex;justify-content:space-between;align-items:center;background:${C.cremaPapel};color:${C.tinta};border-radius:24px;padding:24px 34px;font:800 36px/1 'Nunito';box-shadow:0 30px 60px -24px rgba(0,0,0,.7)}
  .bloque b{font:900 50px/1 'Nunito';letter-spacing:-.02em}
  .bloque.oro{background:linear-gradient(135deg,#FBE3B4,#E7B676 55%,#C9914A)}
  .mas{position:absolute;z-index:7;width:54px;height:54px;border-radius:50%;background:${C.fondo1};border:3px solid ${C.dorado};color:${C.dorado};font:900 38px/48px 'Nunito';text-align:center}`;

  return { brillo, polvo, destellos, goteo, pastel, pastelito, libreta, burbuja, etiqueta, cadena, eslabonRoto, lupa, luna, telefono, notificacion, tarjeta, barraEnfasis, texto, ciclo, numeroGigante, lockup, iconoBrillante, cta, css };
}

// Recortes (px de las capturas a 1170 de ancho, modo oscuro).
const R = {
  costeoFilas: [66, 590, 1104, 905], manoDeObra: [74, 676, 1096, 742],
  manteq: [40, 448, 1130, 668], manteqCosto: [838, 498, 1060, 612],
  entregasHoy: [30, 220, 640, 440], porCobrar: [50, 770, 580, 1000],
  anticipo: [0, 930, 1038, 1290], pdfPrepago: [205, 1790, 1292, 2000]
};

function composicion(p, D) {
  const S = p.slides, x = (i) => i * W, el = [];
  const add = (...a) => el.push(...a);
  const ambiente = (semilla) => { for (let i = 0; i < S.length; i++) add(D.brillo(x(i) + (i % 2 ? 860 : 220), i % 2 ? 1180 : 260, 1100, 0.42)); add(D.polvo(S.length * 26, S.length * W, semilla)); };

  if (p.id === 'm1') {
    ambiente(11);
    // 1 · Portada
    add(D.goteo({ x: 0, w: W, semilla: 5 }), D.luna({ x: 700, y: 280, d: 230 }), D.destellos([[650, 300, 46], [960, 560, 30], [620, 560, 22]]));
    add(`<div class="txt" style="left:84px;top:610px;width:960px"><h2 class="tit" style="font-size:132px;line-height:1.02">Horneas<br>de día.<br>Cuentas<br><span class="oro">de noche.</span></h2></div>`, D.lockup(84, 1210, 300));
    // 2 · Y no por gusto
    add(D.texto(1, S[1]), D.libreta({ x: x(1) + 500, y: 560, w: 620, rot: -6, modo: 'tachones' }), D.ciclo(1, S[1]));
    // 3 · Cobras a ojo
    add(D.texto(2, S[2]), D.etiqueta({ x: x(2) + 110, y: 700, w: 400, rot: -18, apagada: true }));
    add(D.burbuja({ x: x(2) + 520, y: 660, w: 400, esqueleto: true }), D.burbuja({ x: x(2) + 600, y: 830, w: 360, esqueleto: true, tipo: 'respuesta' }), D.ciclo(2, S[2]));
    // 4 · La duda → Pastelia
    add(D.texto(3, S[3]), D.iconoBrillante(x(3) + 390, 650, 300), D.ciclo(3, S[3]));
    // 5 · Cobrar bien no es ser cara
    add(`<div class="obj" style="left:${x(4) + 60}px;top:30px;z-index:1;font:900 360px/1 'Nunito';color:#E7B676;opacity:.35">“</div>`);
    add(D.texto(4, S[4], { top: 200, tam: 100 }), D.pastel({ x: x(4) + 600, y: 700, w: 420 }), D.ciclo(4, S[4]));
    // 6 · 1 · Tu precio real
    add(D.numeroGigante(5, S[5].kicker, { x: 70, y: 70, tam: 250 }), D.texto(5, S[5], { top: 300 }));
    add(D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 430, x: x(5) + 610, y: 610, rot: 7 }), D.tarjeta({ src: '07-resumen-en-vivo.png', w: 540, x: x(5) + 70, y: 700, rot: -4, radio: 36 }), D.ciclo(5, S[5]));
    // 7 · 2 · Tu día en orden
    add(D.numeroGigante(6, S[6].kicker, { x: 70, y: 70, tam: 250 }), D.texto(6, S[6], { top: 300 }));
    add(D.telefono({ src: '01-inicio.png', w: 430, x: x(6) + 60, y: 640, rot: -7 }), D.tarjeta({ src: '01-inicio.png', rect: R.entregasHoy, w: 520, x: x(6) + 480, y: 690, rot: 4, radio: 30 }), D.tarjeta({ src: '01-inicio.png', rect: R.porCobrar, w: 420, x: x(6) + 540, y: 930, rot: -3, radio: 30 }), D.ciclo(6, S[6]));
    // 8 · 3 · Verte como lo que eres
    add(D.numeroGigante(7, S[7].kicker, { x: 70, y: 70, tam: 250 }), D.texto(7, S[7], { top: 300 }));
    add(D.tarjeta({ src: '10-pdf-comprobante.png', w: 820, x: x(7) + 130, y: 660, rot: -5, ry: -8, radio: 12, papel: true }), D.ciclo(7, S[7]));
    // 9 · CTA
    add(D.goteo({ x: x(8) - 120, w: W + 120, semilla: 9 }), D.lockup(x(8) + 380, 270, 320), D.cta(8, S[8], p.palabra, { top: 420 }));
    add(D.destellos([[x(8) + 140, 1180, 36], [x(8) + 940, 1120, 28]]));
  }

  if (p.id === 'cA') {
    ambiente(21);
    // 1 · Portada tipográfica con el $180 en oro y goteo encima
    add(D.goteo({ x: 0, w: W, semilla: 4, z: 9 }));
    add(`<div class="txt" style="left:84px;top:300px;width:912px"><h2 class="tit" style="font-size:112px">El error de</h2>
      <div style="font:900 330px/.9 'Nunito';letter-spacing:-.06em;margin:6px 0 4px" class="oro">$180</div>
      <h2 class="tit" style="font-size:112px">en cada pastel</h2></div>`);
    add(D.destellos([[880, 470, 44], [140, 700, 26], [960, 860, 30]]), D.lockup(84, 1230, 300));
    add(`<svg class="obj" style="left:760px;top:640px;width:520px;height:200px;z-index:4" viewBox="0 0 520 200"><path d="M0,40 C160,40 220,160 520,150" stroke="#E7B676" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/></svg>`);
    // 2 · No es la harina
    add(D.texto(1, S[1], { tam: 84 }), D.libreta({ x: x(1) + 280, y: 500, w: 520, rot: -4, modo: 'palomitas' }), D.ciclo(1, S[1]));
    // 3 · Tu tiempo: filas del costeo con aro en "Mano de obra $180"; el teléfono cruza al slide 4
    add(D.texto(2, S[2], { tam: 150 }));
    add(D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 440, x: x(2) + 780, y: 560, rot: 8, z: 3 }));
    add(D.tarjeta({ src: '06-cotizar-paso3-costeo.png', rect: R.costeoFilas, w: 800, x: x(2) + 70, y: 760, rot: -3, radio: 26, aro: R.manoDeObra, z: 6 }), D.ciclo(2, S[2]));
    // 4 · Lo pagas tú: 10 × $180 = ?
    add(D.texto(3, S[3]), `<div class="ecuacion" style="left:${x(3) + 170}px;top:560px;width:${W - 220}px;height:420px;font-size:112px"><span>10 × $180 =</span><span class="q">?</span></div>`, D.ciclo(3, S[3]));
    // 5 · $1,800
    add(`<div class="txt" style="left:${x(4) + 84}px;top:160px;width:912px"><h2 class="tit" style="font-size:84px">…son</h2>
      <div class="oro" style="font:900 270px/.9 'Nunito';letter-spacing:-.06em;margin:10px 0 18px">$1,800</div>
      <h2 class="tit" style="font-size:84px">de tu tiempo sin cobrar.</h2><p class="cuerpo">${esc(S[4].texto)}</p><p class="nota">${esc(S[4].nota)}</p></div>`);
    add(D.destellos([[x(4) + 900, 260, 50], [x(4) + 150, 140, 28], [x(4) + 980, 520, 22]]), D.ciclo(4, S[4]));
    for (let k = 0; k < 10; k++) add(D.pastelito({ x: x(4) + 84 + (k % 5) * 186, y: 790 + Math.floor(k / 5) * 150, w: 120, o: 0.92 }));
    // 6 · Gráfico de énfasis: tu tiempo en dorado
    add(D.texto(5, S[5], { mostrarNota: false }));
    add(D.barraEnfasis({ x: x(5) + 84, y: 470, w: 912, total: '$714', partes: [
      { etiqueta: 'Insumos', monto: '$210', valor: 210 }, { etiqueta: 'Tu tiempo', monto: '$180', valor: 180, enfasis: true },
      { etiqueta: 'Flores', monto: '$120', valor: 120 }, { etiqueta: 'Ganancia', monto: '$204', valor: 204 }] }));
    add(`<div class="txt" style="left:${x(5) + 84}px;top:880px;width:600px"><p class="nota" style="margin:0">${esc(S[5].nota)}</p></div>`);
    add(D.pastel({ x: x(5) + 700, y: 860, w: 300, z: 2 }), D.ciclo(5, S[5]));
    // 7 · Prueba
    add(D.texto(6, S[6]), D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 460, x: x(6) + 60, y: 560, rot: -6 }), D.tarjeta({ src: '07-resumen-en-vivo.png', w: 560, x: x(6) + 450, y: 690, rot: 4, radio: 36 }), D.ciclo(6, S[6]));
    // 8 · CTA
    add(D.goteo({ x: x(7) - 120, w: W + 120, semilla: 12 }), D.lockup(x(7) + 380, 260, 320), D.cta(7, S[7], p.palabra, { top: 400 }), D.pastel({ x: x(7) + 40, y: 1040, w: 260, rot: -6 }));
  }

  if (p.id === 'cB') {
    ambiente(31);
    // 1 · Portada: dos pasteles con etiquetas "$ ?" unidas por una cadena que cruza al slide 2
    add(D.texto(0, S[0], { tam: 112, top: 110 }));
    add(D.pastel({ x: 40, y: 600, w: 440 }), D.pastel({ x: 520, y: 640, w: 410 }));
    add(D.cadena({ x1: 210, y1: 1110, x2: 1400, y2: 1000 }), D.etiqueta({ x: 120, y: 1080, w: 280, rot: -8, z: 5 }), D.etiqueta({ x: 640, y: 1030, w: 280, rot: 7, z: 5 }));
    // 2 · La cadena de precios copiados
    add(D.texto(1, S[1]));
    add(D.cadena({ x1: x(1) + 300, y1: 970, x2: x(2) + 420, y2: 820 }));
    add(D.etiqueta({ x: x(1) + 150, y: 700, w: 280, rot: -10, texto: '$ ?' }), D.etiqueta({ x: x(1) + 450, y: 640, w: 270, rot: 6, texto: '$ ??', borroso: 2, apagada: true }), D.etiqueta({ x: x(1) + 740, y: 590, w: 260, rot: -4, texto: '$ ???', borroso: 5, apagada: true }), D.ciclo(1, S[1]));
    // 3 · Se rompe la cadena
    add(D.texto(2, S[2]), D.eslabonRoto({ x: x(2) + 360, y: 650, w: 360 }), D.destellos([[x(2) + 540, 640, 50], [x(2) + 330, 860, 28], [x(2) + 760, 820, 34]]), D.ciclo(2, S[2]));
    // 4 · Costear por gramo
    add(D.texto(3, S[3]), D.telefono({ src: '02b-mis-precios.png', w: 430, x: x(3) + 610, y: 560, rot: 7 }));
    add(D.tarjeta({ src: '02b-mis-precios.png', rect: R.manteq, w: 720, x: x(3) + 60, y: 760, rot: -3, radio: 34, aro: R.manteqCosto }), D.ciclo(3, S[3]));
    // 5 · Sube la mantequilla: editor de insumo real
    add(D.texto(4, S[4]), `<svg class="obj" style="left:${x(4) + 560}px;top:92px;width:90px;height:110px;z-index:11" viewBox="0 0 24 30"><path d="M12 28V4M4 12l8-8 8 8" stroke="#E7B676" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    add(D.tarjeta({ src: '11b-editar-insumo-tarjeta.png', w: 560, x: x(4) + 260, y: 520, rot: -2, radio: 34 }));
    add(`<svg class="obj" style="left:${x(4) + 80}px;top:760px;width:250px;height:140px;z-index:7;filter:drop-shadow(0 0 16px rgba(231,182,118,.6))" viewBox="0 0 250 140"><path d="M10,120 C80,120 140,90 210,40" stroke="#E7B676" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M180,30 L218,34 L208,72" stroke="#E7B676" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, D.ciclo(4, S[4]));
    // 6 · Un Mediano de 20 porciones: ticket que suma
    add(D.texto(5, S[5], { mostrarNota: false }));
    const filas = [['Insumos', '$210'], ['Mano de obra', '$180'], ['Flores', '$120'], ['Ganancia 40%', '$204']];
    filas.forEach(([a, b], k) => { const y = 330 + k * 128; add(`<div class="bloque${k === 3 ? ' oro' : ''}" style="left:${x(5) + 84}px;top:${y}px;width:600px"><span>${a}</span><b>${b}</b></div>`); if (k) add(`<div class="mas" style="left:${x(5) + 357}px;top:${y - 40}px">+</div>`); });
    add(`<div class="txt" style="left:${x(5) + 84}px;top:860px;width:620px"><div style="display:flex;align-items:baseline;gap:20px"><span style="font:900 80px/1 'Nunito';color:rgba(255,244,230,.7)">=</span><span class="oro" style="font:900 200px/.9 'Nunito';letter-spacing:-.05em">$714</span></div><p class="nota">${esc(S[5].nota)}</p></div>`);
    add(D.pastel({ x: x(5) + 690, y: 520, w: 360 }), D.ciclo(5, S[5]));
    // 7 · Prueba
    add(D.texto(6, S[6]), D.telefono({ src: '06-cotizar-paso3-costeo.png', w: 450, x: x(6) + 570, y: 560, rot: 6 }), D.tarjeta({ src: '07-resumen-en-vivo.png', w: 560, x: x(6) + 70, y: 700, rot: -4, radio: 36 }), D.ciclo(6, S[6]));
    // 8 · CTA
    add(D.goteo({ x: x(7) - 120, w: W + 120, semilla: 15 }), D.eslabonRoto({ x: x(7) + 410, y: 240, w: 260 }), D.cta(7, S[7], p.palabra, { top: 480 }));
  }

  if (p.id === 'cC') {
    ambiente(41);
    // 1 · Portada: notificación en pantalla de bloqueo
    add(D.texto(0, S[0], { tam: 116, top: 100 }));
    add(D.telefono({ html: D.notificacion(560), w: 560, x: 260, y: 470, rot: -4, brilloOro: true }));
    add(D.destellos([[200, 560, 30], [930, 700, 40], [880, 1080, 24]]));
    // 2 · El mensaje revelado + libreta vacía
    add(D.texto(1, S[1], { mostrarTexto: false }));
    add(D.burbuja({ x: x(1) + 84, y: 330, w: 760, texto: S[1].extra[0] }));
    add(`<div class="txt" style="left:${x(1) + 84}px;top:530px;width:912px"><p class="cuerpo" style="margin:0;font-size:46px">${esc(S[1].texto)}</p></div>`);
    add(D.libreta({ x: x(1) + 320, y: 640, w: 480, rot: 4, modo: 'vacia' }), D.lupa({ x: x(1) + 640, y: 780, w: 250 }), D.ciclo(1, S[1]));
    // 3 · Cascada de chats; uno con borde dorado
    add(D.texto(2, S[2]));
    [[84, 560, 520, 'cliente'], [480, 670, 500, 'respuesta'], [140, 790, 560, 'cliente'], [520, 905, 460, 'respuesta'], [84, 1015, 600, 'cliente']].forEach(([bx, by, bw, t], k) => add(D.burbuja({ x: x(2) + bx, y: by, w: bw, esqueleto: true, tipo: t, borde: k === 2, z: k === 2 ? 8 : 6 })));
    add(`<svg class="obj" style="left:${x(2) + 640}px;top:760px;width:80px;height:80px;z-index:9;filter:drop-shadow(0 0 14px rgba(231,182,118,.8))" viewBox="0 0 24 24"><path d="M12 21s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10Z" fill="#E7B676"/><circle cx="12" cy="11" r="2.4" fill="#1C130E"/></svg>`, D.ciclo(2, S[2]));
    // 4 · No es desorden tuyo: libreta cerrada y luz dorada que entra desde el slide 5
    add(D.texto(3, S[3]), D.libreta({ x: x(3) + 70, y: 640, w: 400, rot: -8, modo: 'cerrada' }), D.brillo(x(4), 900, 900, 0.9, '#E7B676'), D.ciclo(3, S[3]));
    // 5 · El Inicio de la app; el teléfono cruza al slide 4
    add(D.texto(4, S[4]));
    add(D.telefono({ src: '01-inicio.png', w: 460, x: x(4) - 170, y: 560, rot: -6, brilloOro: true }));
    add(D.tarjeta({ src: '01-inicio.png', rect: R.entregasHoy, w: 540, x: x(4) + 430, y: 640, rot: 4, radio: 30 }), D.tarjeta({ src: '01-inicio.png', rect: R.porCobrar, w: 440, x: x(4) + 500, y: 910, rot: -3, radio: 30 }), D.ciclo(4, S[4]));
    // 6 · Queda anotado: anticipo y tabla del PDF
    add(D.texto(5, S[5]), D.tarjeta({ src: '09-resumen-pedido-anticipo.png', rect: R.anticipo, w: 820, x: x(5) + 70, y: 440, rot: -3, radio: 34 }));
    add(D.tarjeta({ src: '10-pdf-comprobante.png', rect: R.pdfPrepago, w: 880, x: x(5) + 130, y: 810, rot: 2.5, radio: 18, papel: true, z: 7 }), D.ciclo(5, S[5]));
    // 7 · Ya no da miedo: cliente + respuesta dorada + pastel listo
    add(D.texto(6, S[6]));
    add(D.burbuja({ x: x(6) + 84, y: 330, w: 760, texto: S[6].extra[0] }), D.burbuja({ x: x(6) + 300, y: 540, w: 690, texto: S[6].extra[1], tipo: 'respuesta' }));
    add(D.pastel({ x: x(6) + 320, y: 680, w: 420 }), D.destellos([[x(6) + 280, 760, 30], [x(6) + 820, 740, 36]]), D.ciclo(6, S[6]));
    // 8 · CTA
    add(D.goteo({ x: x(7) - 120, w: W + 120, semilla: 18 }), D.lockup(x(7) + 380, 270, 320), D.cta(7, S[7], p.palabra, { top: 420 }));
  }
  return el.join('\n');
}

function carruselHTML({ p, ROOT, capDir, rel }) {
  const D = crearDiseno({ ROOT, capDir, rel });
  const n = p.slides.length;
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · ${esc(p.titulo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,700;0,800;0,900;1,800;1,900&display=swap" rel="stylesheet">
<style>${D.css}</style></head><body>
<div class="lienzo" style="width:${n * W}px">
${composicion(p, D)}
<div class="grano"></div>
</div></body></html>`;
}

module.exports = { carruselHTML, crearDiseno, W, H, C };
