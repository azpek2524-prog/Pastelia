// Carrusel estilo App Store: un solo lienzo continuo (N × 1080 por 1350) que se corta en slides.
// Fondos degradados por paleta, titulares en Nunito Black, teléfonos con la app real (capturada en
// el color de cada paleta) y tarjetas flotantes con recortes ampliados de la app.
// Los textos salen de contenido.cjs (los mismos que valida contar-palabras.cjs).
const fs = require('fs');
const path = require('path');

const W = 1080, H = 1350;
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function pngSize(f) { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }

function crearPlantilla({ ROOT, capDir, rel, paleta: P }) {
  const lockupBlanco = fs.readFileSync(path.join(ROOT, 'pastelia-lockup-oscuro.svg'), 'utf8').replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"');
  const cap = (f) => rel + f;

  // ── Piezas visuales ──
  function telefono({ src, w, x, y, rot = 0, ry = 0, z = 3 }) {
    const p = Math.round(w * 0.034), h = Math.round((w - 2 * p) * 2.1641 + 2 * p);
    const barra = Math.round(w * 0.105);
    return `<div class="tel" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};transform:perspective(3200px) rotateY(${ry}deg) rotate(${rot}deg);border-radius:${Math.round(w * 0.17)}px;padding:${p}px">
      <div class="pantalla" style="border-radius:${Math.round(w * 0.14)}px">
        <div class="estado" style="height:${barra}px;font-size:${Math.round(w * 0.04)}px;padding:0 ${Math.round(w * 0.09)}px"><b>9:41</b><i></i></div>
        <img src="${cap(src)}" alt="" style="top:${barra}px">
        <div class="isla" style="width:${Math.round(w * 0.3)}px;height:${Math.round(w * 0.082)}px;top:${Math.round(w * 0.026)}px"></div>
      </div></div>`;
  }
  // Recorte de una captura como tarjeta flotante. rect = [x0,y0,x1,y1] en px de la captura.
  function tarjeta({ src, rect, w, x, y, rot = 0, ry = 0, z = 4, radio = 26, papel = false }) {
    const { w: iw, h: ih } = pngSize(path.join(capDir, src));
    const [x0, y0, x1, y1] = rect || [0, 0, iw, ih];
    const s = w / (x1 - x0), h = Math.round((y1 - y0) * s);
    return `<div class="tarjeta${papel ? ' papel' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};border-radius:${radio}px;transform:perspective(3200px) rotateY(${ry}deg) rotate(${rot}deg)"><img src="${cap(src)}" alt="" style="width:${Math.round(iw * s)}px;left:${Math.round(-x0 * s)}px;top:${Math.round(-y0 * s)}px"></div>`;
  }
  function etiquetaPrecio({ x, y, w, rot = 0, tache = false, z = 3 }) {
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg)">
    <svg viewBox="-80 -40 600 360" width="100%" style="overflow:visible">
      <defs><linearGradient id="tg${x}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3ECEF"/></linearGradient></defs>
      <path d="M-60,-20 C-20,40 30,90 85,140" fill="none" stroke="${P.acento}" stroke-width="9" stroke-linecap="round"/>
      <path d="M95,34 H440 Q476,34 476,70 V236 Q476,272 440,272 H95 L22,153 Z" fill="rgba(0,0,0,.18)" stroke="rgba(0,0,0,.18)" stroke-width="26" stroke-linejoin="round"/>
      <path d="M95,20 H440 Q476,20 476,56 V222 Q476,258 440,258 H95 L22,139 Z" fill="url(#tg${x})" stroke="url(#tg${x})" stroke-width="26" stroke-linejoin="round"/>
      <path d="M100,30 H436 Q462,30 462,58" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      <circle cx="88" cy="139" r="19" fill="${P.c1}" opacity=".25"/><circle cx="88" cy="142" r="15" fill="rgba(0,0,0,.25)"/>
      <text x="290" y="182" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="118" fill="${P.tinta}">$ ???</text>
      ${tache ? `<rect x="40" y="122" width="460" height="34" rx="17" fill="${P.tinta}" transform="rotate(-12 270 139)"/>` : ''}
    </svg></div>`;
  }
  function pastel({ x, y, w, z = 2, rot = 0 }) {
    return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z};transform:rotate(${rot}deg)">
    <svg viewBox="0 0 360 420" width="100%">
      <defs>
        <linearGradient id="bz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E9B98C"/><stop offset=".45" stop-color="#F7D6B1"/><stop offset="1" stop-color="#D9A274"/></linearGradient>
        <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F4E9EE"/></linearGradient>
        <radialGradient id="fr" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FF8A8A"/><stop offset=".6" stop-color="#E5293F"/><stop offset="1" stop-color="#A3122A"/></radialGradient>
        <radialGradient id="ll" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFF6B0"/><stop offset=".55" stop-color="#FFC94A"/><stop offset="1" stop-color="#FF8A1F"/></radialGradient>
      </defs>
      <ellipse cx="180" cy="392" rx="168" ry="24" fill="rgba(0,0,0,.18)"/>
      <ellipse cx="180" cy="380" rx="170" ry="26" fill="#F7F1F4"/><ellipse cx="180" cy="372" rx="170" ry="24" fill="#FFFFFF"/>
      <rect x="34" y="232" width="292" height="140" rx="28" fill="url(#bz)"/>
      <path d="M34,262 Q34,232 62,232 H298 Q326,232 326,262 V276 Q312,276 310,296 Q306,312 296,296 Q292,276 270,280 Q258,282 256,304 Q252,322 242,304 Q236,284 214,284 Q196,286 192,312 Q188,330 176,312 Q170,284 148,284 Q130,284 126,300 Q122,316 112,300 Q106,280 84,282 Q66,284 62,300 Q58,312 50,298 Q46,280 34,280 Z" fill="url(#cr)"/>
      <rect x="84" y="128" width="192" height="118" rx="24" fill="url(#bz)"/>
      <path d="M84,152 Q84,128 108,128 H252 Q276,128 276,152 V166 Q264,168 262,184 Q258,198 250,184 Q246,166 226,170 Q214,172 212,190 Q208,206 200,190 Q194,172 176,172 Q160,174 158,194 Q154,210 146,194 Q142,174 124,176 Q108,178 106,192 Q102,204 96,190 Q92,172 84,172 Z" fill="url(#cr)"/>
      <rect x="171" y="62" width="18" height="70" rx="9" fill="#FFFFFF"/><rect x="171" y="80" width="18" height="10" fill="${P.c1}"/><rect x="171" y="104" width="18" height="10" fill="${P.c1}"/>
      <path d="M180,18 C196,38 196,56 180,64 C164,56 164,38 180,18 Z" fill="url(#ll)"/>
      <circle cx="128" cy="132" r="22" fill="url(#fr)"/><path d="M120,112 Q128,104 136,112 Q130,116 128,120 Q126,116 120,112 Z" fill="#2E9E57"/>
      <circle cx="236" cy="134" r="20" fill="url(#fr)"/><path d="M229,115 Q236,108 243,115 Q238,119 236,122 Q234,119 229,115 Z" fill="#2E9E57"/>
      <path d="M58,250 Q58,238 70,238" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
    </svg></div>`;
  }
  function textoSlide(i, s, { ancho = 912, top = 104, tam = 92 } = {}) {
    const x = i * W + 84;
    return `<div class="txt" style="left:${x}px;top:${top}px;width:${ancho}px">
      ${s.kicker ? `<span class="kicker">${esc(s.kicker)}</span>` : ''}
      <h2 class="tit" style="font-size:${tam}px">${esc(s.titulo)}</h2>
      ${s.texto && !s.ocultarTexto ? `<p class="cuerpo">${esc(s.texto)}</p>` : ''}
      ${s.nota && !s.notaAbajo ? `<p class="nota">${esc(s.nota)}</p>` : ''}</div>`;
  }
  function lockup(x, y, w = 330) { return `<div class="obj" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 0.263)}px;z-index:6">${lockupBlanco}</div>`; }
  function cta(i, s, palabra) {
    const [antes, despues] = s.cta.split(palabra);
    return `<div class="txt" style="left:${i * W + 84}px;top:250px;width:912px;text-align:center">
      <h2 class="tit" style="font-size:104px">${esc(s.titulo)}</h2>
      <div class="pildora"><span>${esc(antes.trim())}</span><b>${esc(palabra)}</b><span>${esc(despues.trim())}</span></div></div>`;
  }
  function aro({ x, y, w, h, r }) { return `<div class="aro" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px"></div>`; }
  function brillo(x, y, d, o = 0.32) { return `<div class="brillo" style="left:${x - d / 2}px;top:${y - d / 2}px;width:${d}px;height:${d}px;opacity:${o}"></div>`; }

  const css = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#222;font-family:'Nunito',system-ui,sans-serif}
  .lienzo{position:relative;height:${H}px;overflow:hidden;background:linear-gradient(100deg,${P.c1} 0%,${P.c2} 30%,${P.c1} 62%,${P.c2} 100%)}
  .brillo{position:absolute;border-radius:50%;background:radial-gradient(circle,${P.brillo} 0%,rgba(255,255,255,0) 68%);z-index:0}
  .aro{position:absolute;border:3px solid rgba(255,255,255,.22);z-index:0}
  .txt{position:absolute;z-index:8;color:#fff}
  .kicker{display:inline-block;font:900 26px/1 'Nunito';letter-spacing:.09em;text-transform:uppercase;background:rgba(255,255,255,.2);border:2px solid rgba(255,255,255,.35);padding:12px 20px 11px;border-radius:999px;margin-bottom:26px}
  .tit{font-family:'Nunito';font-weight:900;line-height:.98;letter-spacing:-.035em;text-wrap:balance;text-shadow:0 6px 30px rgba(0,0,0,.12)}
  .cuerpo{font:800 40px/1.25 'Nunito';margin-top:26px;opacity:.95;text-wrap:pretty;max-width:880px}
  .nota{font:800 26px/1.3 'Nunito';margin-top:18px;opacity:.8}
  .tel{position:absolute;background:linear-gradient(145deg,#3a3a3e,#0d0d0f 40%,#1b1b1f);box-shadow:0 70px 120px -40px rgba(0,0,0,.55),inset 0 0 0 2px rgba(255,255,255,.12)}
  .pantalla{position:relative;width:100%;height:100%;overflow:hidden;background:#FFF4E6}
  .pantalla img{position:absolute;left:0;width:100%;display:block}
  .estado{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;font-family:'Nunito';color:#1b1b1f;z-index:2}
  .estado i{width:18%;height:28%;border-radius:4px;background:linear-gradient(90deg,#1b1b1f 70%,rgba(27,27,31,.25) 70%)}
  .isla{position:absolute;left:50%;transform:translateX(-50%);background:#0b0b0d;border-radius:999px;z-index:3}
  .tarjeta{position:absolute;overflow:hidden;background:#fff;box-shadow:0 50px 90px -30px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.04)}
  .tarjeta img{position:absolute;max-width:none;display:block}
  .papel{box-shadow:0 60px 110px -30px rgba(0,0,0,.5)}
  .obj{position:absolute;filter:drop-shadow(0 40px 50px rgba(0,0,0,.28))}
  .blanca{position:absolute;z-index:5;background:#fff;border-radius:32px;box-shadow:0 50px 90px -34px rgba(0,0,0,.45);color:${P.tinta}}
  .fila{display:flex;justify-content:space-between;align-items:center;font:800 42px/1 'Nunito';padding:30px 40px}
  .fila b{font:900 62px/1 'Nunito';color:${P.c1};letter-spacing:-.02em}
  .mas{position:absolute;z-index:6;width:64px;height:64px;border-radius:50%;background:${P.tinta};color:#fff;font:900 44px/64px 'Nunito';text-align:center}
  .barra-lab{font:900 40px/1 'Nunito';margin-bottom:20px}
  .pista{height:104px;border-radius:24px;background:#F1EDF0;position:relative;overflow:hidden}
  .lleno{position:absolute;left:0;top:0;bottom:0;border-radius:24px}
  .rayas{position:absolute;top:0;bottom:0;background:repeating-linear-gradient(-45deg,${P.c1} 0 16px,rgba(255,255,255,0) 16px 32px);opacity:.55}
  .pildora{display:inline-flex;flex-direction:column;align-items:center;gap:14px;margin-top:64px;background:#fff;color:${P.tinta};border-radius:48px;padding:44px 64px 50px;box-shadow:0 50px 90px -34px rgba(0,0,0,.45)}
  .pildora span{font:800 44px/1.1 'Nunito'}
  .pildora b{font:900 132px/1 'Nunito';letter-spacing:-.02em;color:${P.c1}}
  .grande{position:absolute;z-index:7;font:900 560px/.8 'Nunito';letter-spacing:-.06em;color:#fff;text-shadow:0 20px 60px rgba(0,0,0,.15)}`;

  return { telefono, tarjeta, etiquetaPrecio, pastel, textoSlide, lockup, cta, aro, brillo, css };
}

// ── Composición de cada carrusel (coordenadas en el lienzo completo) ──
function composicion(p, T, P) {
  const S = p.slides, x = (i) => i * W, el = [];
  const add = (...a) => el.push(...a);
  if (p.id === 'c1') {
    // Ambiente: brillos y aros que cruzan de un slide a otro.
    add(T.brillo(1000, 1150, 1100), T.brillo(3400, 1250, 1300), T.brillo(5900, 1250, 1200), T.brillo(8200, 1200, 1300));
    add(T.aro({ x: 640, y: 980, w: 1500, h: 900, r: 450 }), T.aro({ x: 4700, y: -500, w: 1600, h: 900, r: 450 }), T.aro({ x: 7400, y: 900, w: 1700, h: 900, r: 450 }));
    // 1 · Portada
    add(T.textoSlide(0, S[0], { tam: 132, top: 120 }));
    add(T.etiquetaPrecio({ x: 30, y: 600, w: 660, rot: -9 }), T.etiquetaPrecio({ x: 690, y: 860, w: 660, rot: 11, tache: true }));
    add(T.lockup(84, 1230, 300));
    // 2 · El error fatal
    add(T.textoSlide(1, S[1]));
    add(T.pastel({ x: x(1) + 300, y: 690, w: 400 }), T.pastel({ x: x(1) + 690, y: 770, w: 340 }));
    // 3 · Trabajar gratis
    add(T.textoSlide(2, S[2]));
    add(`<div class="blanca" style="left:${x(2) + 84}px;top:640px;width:912px;padding:60px 52px">
      <div class="barra-lab">${S[2].etiquetas[0]}</div><div class="pista"><div class="lleno" style="width:56%;background:${P.c2};opacity:.55"></div><div class="rayas" style="left:56%;width:28%"></div></div>
      <div class="barra-lab" style="margin-top:56px">${S[2].etiquetas[1]}</div><div class="pista"><div class="lleno" style="width:84%;background:linear-gradient(90deg,${P.c1},${P.c2})"></div></div></div>`);
    // 4 · La fórmula (los bloques son el texto)
    add(T.textoSlide(3, { ...S[3], ocultarTexto: true }));
    S[3].texto.split(' + ').forEach((t, k) => {
      const y = 480 + k * 178;
      add(`<div class="blanca" style="left:${x(3) + 84}px;top:${y}px;width:620px;padding:36px 44px;font:900 54px/1 'Nunito';${k === 3 ? `background:${P.acento};` : ''}">${t.charAt(0).toUpperCase() + t.slice(1)}</div>`);
      if (k) add(`<div class="mas" style="left:${x(3) + 362}px;top:${y - 58}px">+</div>`);
    });
    // 5 · Costea por gramo: teléfono con Mis precios que entra desde el slide 4
    add(T.textoSlide(4, S[4]));
    add(T.telefono({ src: '02b-mis-precios.png', w: 520, x: x(4) - 170, y: 640, rot: 8 }));
    add(T.tarjeta({ src: '02b-mis-precios.png', rect: [40, 448, 1130, 668], w: 720, x: x(4) + 300, y: 850, rot: -5, radio: 38 }));
    // 6 · Costo $510
    add(T.textoSlide(5, { ...S[5], ocultarTexto: true, notaAbajo: true }));
    S[5].bloques.forEach(([a, b], k) => {
      const y = 470 + k * 176;
      add(`<div class="blanca" style="left:${x(5) + 84}px;top:${y}px;width:912px"><div class="fila"><span>${a}</span><b>${b}</b></div></div>`);
      if (k) add(`<div class="mas" style="left:${x(5) + 508}px;top:${y - 58}px">+</div>`);
    });
    add(`<div class="txt" style="left:${x(5) + 84}px;top:1010px;width:912px"><p class="cuerpo" style="margin:0">${S[5].texto}</p><p class="nota">${S[5].nota}</p></div>`);
    // 7 · Súmale tu ganancia
    add(T.textoSlide(6, { ...S[6], notaAbajo: true }));
    add(`<div class="blanca" style="left:${x(6) + 84}px;top:560px;width:912px;padding:56px 60px 60px">
      <div style="font:800 38px/1 'Nunito';opacity:.65">${S[6].etiqueta.arriba}</div>
      <div style="font:900 250px/1 'Nunito';letter-spacing:-.05em;margin:14px 0 6px;background:linear-gradient(100deg,${P.c1},${P.c2});-webkit-background-clip:text;color:transparent">${S[6].etiqueta.precio}</div>
      <div style="font:900 48px/1 'Nunito'">${S[6].etiqueta.abajo}</div></div>`);
    add(`<div class="txt" style="left:${x(6) + 84}px;top:1150px;width:912px"><p class="nota" style="margin:0">${S[6].nota}</p></div>`);
    // 8 · La prueba: teléfono con el cotizador + resumen ampliado
    add(T.textoSlide(7, S[7]));
    add(T.telefono({ src: '06-cotizar-paso3-costeo.png', w: 470, x: x(7) + 70, y: 520, rot: -7 }));
    add(T.tarjeta({ src: '07-resumen-en-vivo.png', w: 600, x: x(7) + 430, y: 690, rot: 4, radio: 40 }));
    // 9 · CTA
    add(T.lockup(x(8) + 375, 120, 330), T.cta(8, S[8], p.palabra));
    add(T.telefono({ src: '01-inicio.png', w: 440, x: x(8) + 560, y: 960, rot: 9, z: 2 }));
    add(T.pastel({ x: x(8) - 120, y: 1000, w: 320, rot: -6 }));
  }
  if (p.id === 'c2') {
    add(T.brillo(700, 1150, 1300), T.brillo(2600, 1250, 1200), T.brillo(4300, 1250, 1300), T.brillo(6000, 1250, 1100));
    add(T.aro({ x: -300, y: 700, w: 1600, h: 1000, r: 500 }), T.aro({ x: 2900, y: -400, w: 1500, h: 900, r: 450 }), T.aro({ x: 4900, y: 950, w: 1500, h: 900, r: 450 }));
    // 1 · Portada: "3" gigante y el PDF que cruza al slide 2
    const [tres, ...resto] = S[0].titulo.split(' ');
    add(`<div class="grande" style="left:58px;top:70px">${tres}</div>`);
    add(T.textoSlide(0, { titulo: resto.join(' ') }, { tam: 118, top: 520 }));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', w: 900, x: 560, y: 820, rot: -9, ry: -10, radio: 14, papel: true, z: 4 }));
    add(T.lockup(84, 1210));
    // 2 · Tu marca: lupa sobre el encabezado del PDF y el pie con el teléfono
    add(T.textoSlide(1, S[1]));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', rect: [150, 0, 2310, 560], w: 920, x: x(1) + 110, y: 680, rot: -3, radio: 26, z: 6 }));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', rect: [150, 2010, 2310, 2226], w: 820, x: x(1) + 200, y: 1040, rot: 2, radio: 22, z: 6 }));
    // 3 · Todo por escrito
    add(T.textoSlide(2, S[2]));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', rect: [1252, 231, 2280, 696], w: 660, x: x(2) + 70, y: 680, rot: -4, radio: 24 }));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', rect: [150, 1160, 2310, 1710], w: 960, x: x(2) + 90, y: 960, rot: 2, radio: 24, z: 5 }));
    // 4 · Números claros: teléfono con el paso "$ Total" y la tabla del PDF
    add(T.textoSlide(3, S[3]));
    add(T.telefono({ src: '08-cotizar-paso4-total.png', w: 480, x: x(3) + 560, y: 640, rot: 7 }));
    add(T.tarjeta({ src: '09-resumen-pedido-anticipo.png', rect: [0, 930, 1038, 1290], w: 560, x: x(3) + 70, y: 760, rot: -4, radio: 30, z: 6 }));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', rect: [150, 1795, 2310, 1995], w: 860, x: x(3) + 60, y: 1110, rot: -2, radio: 18, z: 7 }));
    // 5 · Las 3 juntas: el PDF completo
    add(T.textoSlide(4, { ...S[4], notaAbajo: true }));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', w: 900, x: x(4) + 90, y: 440, rot: -3, ry: -8, radio: 14, papel: true }));
    add(`<div class="txt" style="left:${x(4) + 84}px;top:1270px;width:912px;text-align:center"><p class="nota" style="margin:0">${S[4].nota}</p></div>`);
    // 6 · CTA
    add(T.lockup(x(5) + 375, 120, 330), T.cta(5, S[5], p.palabra));
    add(T.tarjeta({ src: '10-pdf-comprobante.png', w: 520, x: x(5) - 230, y: 1080, rot: 12, radio: 10, papel: true, z: 2 }));
    add(T.telefono({ src: '01-inicio.png', w: 440, x: x(5) + 580, y: 960, rot: 9, z: 2 }));
  }
  return el.join('\n');
}

function carruselProHTML({ p, paleta, ROOT, capDir, rel }) {
  const T = crearPlantilla({ ROOT, capDir, rel, paleta });
  const n = p.slides.length;
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · ${esc(paleta.nombre)}</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900;1000&display=swap" rel="stylesheet">
<style>${T.css}</style></head><body>
<div class="lienzo" style="width:${n * W}px">
${composicion(p, T, paleta)}
</div></body></html>`;
}

module.exports = { carruselProHTML, W, H };
