// Genera todo el kit a partir de contenido.cjs:
//   - carruseles/*.html (fuente) y salida/.../carruseles/*.png (1080×1350)
//   - storyboards/*.html (fuente) y salida/.../storyboards/*.png (escenas 1080×1920, hoja completa y tarjetas finales)
//   - guiones/*.md y guiones/*.srt, captions/*.txt, calendario.md
// Uso (desde la raíz del repo): node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs
const fs = require('fs');
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
const LOCKUP = svgFile('pastelia-lockup.svg');
const LOCKUP_OSCURO = svgFile('pastelia-lockup-oscuro.svg');
const ICONO = svgFile('pastelia-icon.svg');

// Recorte de una captura: muestra el rectángulo [x0,y0,x1,y1] de la imagen a un ancho dado.
function recorte(archivo, rect, ancho, rel) {
  const { w, h } = pngSize(path.join(CAP, archivo));
  const [x0, y0, x1, y1] = rect || [0, 0, w, h];
  const s = ancho / (x1 - x0);
  return `<div class="recorte" style="width:${ancho}px;height:${Math.round((y1 - y0) * s)}px"><img src="${rel}${archivo}" style="width:${Math.round(w * s)}px;left:${Math.round(-x0 * s)}px;top:${Math.round(-y0 * s)}px" alt=""></div>`;
}

const FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">';
const TOKENS = `:root{--marron:#7B5B4B;--crema:#FFF4E6;--dorado:#E7B676;--tinta:#5A4236;--campo:#F5E7D0;--tinte:#F1E6CE;--blanco:#FFFFFF;--suave:rgba(90,66,54,.66);--display:'Fredoka','Nunito',system-ui,sans-serif;--texto:'Nunito',system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#CDBBA6;padding:40px;display:flex;flex-direction:column;align-items:center;gap:40px;font-family:var(--texto)}
.recorte{position:relative;overflow:hidden;flex:none}.recorte img{position:absolute;max-width:none;display:block}`;

// ─────────────────────────── Carruseles ───────────────────────────
const CSS_SLIDE = `${TOKENS}
.slide{width:1080px;height:1350px;position:relative;overflow:hidden;background:var(--crema);color:var(--tinta);display:flex;flex-direction:column;padding:92px 96px 64px}
.kicker{align-self:flex-start;background:var(--dorado);color:var(--tinta);font:800 30px/1 var(--texto);letter-spacing:.07em;text-transform:uppercase;padding:16px 26px 15px;border-radius:999px}
.titulo{font:600 90px/1.02 var(--display);letter-spacing:-.012em;margin-top:34px;text-wrap:balance}
.texto{font:700 46px/1.3 var(--texto);color:var(--marron);margin-top:30px;text-wrap:pretty}
.visual{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;margin-top:36px}
.nota{font:700 29px/1.3 var(--texto);color:var(--suave);margin-top:22px}
.pie{display:flex;align-items:center;justify-content:space-between;margin-top:34px;font:800 28px/1 var(--texto);color:var(--suave)}
.marca{display:flex;align-items:center;gap:14px;font:600 32px/1 var(--display);color:var(--tinta)}.marca i{width:46px;height:46px;display:block}
.papel{background:var(--blanco);border-radius:20px;box-shadow:0 34px 60px -34px rgba(90,66,54,.55),0 0 0 2px rgba(123,91,75,.08);overflow:hidden}
.oscura{background:linear-gradient(160deg,var(--tinta),var(--marron));color:var(--crema)}
.oscura .pie{color:rgba(255,244,230,.7)}
.desliza{width:84px;height:84px;border-radius:50%;background:var(--dorado);display:flex;align-items:center;justify-content:center}
.portada .titulo{font-size:118px;line-height:1;margin-top:10px}
.tags{flex:1;display:flex;align-items:center;justify-content:center;gap:56px}
.tag{width:360px;height:210px;border-radius:30px;background:var(--crema);position:relative;display:flex;align-items:center;justify-content:center;font:700 96px/1 var(--display);color:var(--tinta);box-shadow:0 30px 50px -30px rgba(0,0,0,.6)}
.tag:before{content:"";position:absolute;left:28px;top:50%;width:30px;height:30px;margin-top:-15px;border-radius:50%;background:var(--marron)}
.tag.b{transform:rotate(7deg)}.tag .tache{position:absolute;left:-30px;right:-30px;top:50%;height:18px;margin-top:-9px;background:var(--dorado);border-radius:9px;transform:rotate(-14deg)}
.pasteles{display:flex;gap:90px;align-items:flex-end}
.pastel{display:flex;flex-direction:column;align-items:center}
.vela{width:18px;height:64px;background:var(--tinta);border-radius:9px;position:relative}.vela:before{content:"";position:absolute;left:-7px;top:-34px;width:32px;height:40px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:var(--dorado)}
.piso1{width:230px;height:110px;background:var(--dorado);border-radius:26px 26px 8px 8px}.piso2{width:330px;height:150px;background:var(--marron);border-radius:22px 22px 10px 10px;margin-top:-2px}
.plato{width:400px;height:20px;background:var(--tinte);border-radius:10px}
.etq{margin-top:30px;font:700 64px/1 var(--display);background:var(--blanco);padding:22px 40px;border-radius:24px;box-shadow:0 20px 40px -26px rgba(90,66,54,.5)}.etq.dorada{outline:6px solid var(--dorado)}
.barras{width:100%;display:flex;flex-direction:column;gap:40px}
.barra .lab{font:800 36px/1 var(--texto);color:var(--tinta);margin-bottom:16px}
.barra .pista{height:110px;border-radius:24px;background:var(--tinte);position:relative;overflow:hidden}
.barra .lleno{position:absolute;left:0;top:0;bottom:0;border-radius:24px}
.hueco{position:absolute;top:0;bottom:0;background:repeating-linear-gradient(-45deg,var(--dorado) 0 18px,rgba(231,182,118,.45) 18px 36px)}
.formula{width:100%;display:flex;flex-direction:column;align-items:center;gap:14px}
.bloque{width:100%;padding:30px 44px;border-radius:26px;font:600 58px/1 var(--display);background:var(--blanco);box-shadow:0 18px 40px -30px rgba(90,66,54,.5)}
.bloque.c2{background:var(--campo)}.bloque.c3{background:var(--tinte)}.bloque.c4{background:var(--dorado)}
.mas{font:600 54px/1 var(--display);color:var(--marron)}
.suma{width:100%;display:flex;flex-direction:column;gap:18px}
.fila{display:flex;justify-content:space-between;align-items:center;background:var(--blanco);border-radius:26px;padding:30px 44px;font:800 44px/1 var(--texto);box-shadow:0 18px 40px -30px rgba(90,66,54,.5)}
.fila b{font:600 64px/1 var(--display)}
.precio{width:100%;border-radius:40px;padding:56px 64px;background:linear-gradient(150deg,var(--tinta),var(--marron));color:var(--crema)}
.precio .a{font:800 38px/1 var(--texto);opacity:.75}.precio .p{font:700 220px/1 var(--display);margin:18px 0 10px}.precio .z{font:800 46px/1 var(--texto);opacity:.85}
.prueba .visual img,.prueba .visual .recorte{border-radius:26px;box-shadow:0 40px 70px -36px rgba(90,66,54,.65)}
.cta{align-items:center;justify-content:center;text-align:center}
.cta .logo{width:520px;height:137px}
.cta .titulo{font-size:96px;margin-top:70px}
.boton{margin-top:70px;background:var(--dorado);color:var(--tinta);border-radius:36px;padding:44px 56px;font:600 64px/1.15 var(--display);text-wrap:balance}
.boton em{font-style:normal;display:block;font-size:104px;font-weight:700;letter-spacing:.02em}
.tres .grande{position:absolute;left:58px;top:-10px;font:700 640px/1 var(--display);color:var(--dorado)}
.tres .titulo{margin-top:440px;font-size:112px;position:relative}
.tres .pdf{position:absolute;right:-170px;bottom:-250px;width:820px;transform:rotate(-8deg);border-radius:18px;box-shadow:0 40px 80px -30px rgba(90,66,54,.6)}
.tres .pie{position:relative;margin-top:auto}`;

function pie(i, n, oscuro) {
  return `<div class="pie"><div class="marca"><i>${ICONO}</i><span${oscuro ? ' style="color:var(--crema)"' : ''}>Pastelia</span></div><div>${i} / ${n}</div></div>`;
}

function visualSlide(s, rel) {
  switch (s.ilustracion) {
    case 'dos-pasteles': {
      const pastel = (cls) => `<div class="pastel"><div class="vela"></div><div class="piso1"></div><div class="piso2"></div><div class="plato"></div><div class="etq ${cls}">$ ?</div></div>`;
      return `<div class="pasteles">${pastel('')}${pastel('dorada')}</div>`;
    }
    case 'barras':
      return `<div class="barras">
        <div class="barra"><div class="lab">${esc(s.etiquetas[0])}</div><div class="pista"><div class="lleno" style="width:58%;background:var(--campo);outline:4px solid var(--marron);outline-offset:-4px"></div><div class="hueco" style="left:58%;width:26%"></div></div></div>
        <div class="barra"><div class="lab">${esc(s.etiquetas[1])}</div><div class="pista"><div class="lleno" style="width:84%;background:var(--marron)"></div></div></div></div>`;
    case 'formula': {
      const partes = s.texto.split(' + ');
      return `<div class="formula">${partes.map((p, k) => `${k ? '<div class="mas">+</div>' : ''}<div class="bloque c${k + 1}">${esc(p.charAt(0).toUpperCase() + p.slice(1))}</div>`).join('')}</div>`;
    }
    case 'suma':
      return `<div class="suma">${s.bloques.map(([a, b]) => `<div class="fila"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('<div class="mas" style="text-align:center">+</div>')}</div>`;
    case 'etiqueta':
      return `<div class="precio"><div class="a">${esc(s.etiqueta.arriba)}</div><div class="p">${esc(s.etiqueta.precio)}</div><div class="z">${esc(s.etiqueta.abajo)}</div></div>`;
  }
  if (s.captura) {
    if (s.tipo === 'prueba') return `<img src="${rel}${s.captura.archivo}" style="max-width:100%;max-height:100%;display:block" alt="">`;
    const caja = (c) => `<div class="papel">${recorte(c.archivo, c.recorte, c.ancho || 888, rel)}</div>`;
    return caja(s.captura) + (s.captura2 ? caja(s.captura2) : '');
  }
  return '';
}

function slideHTML(p, s, i, n, rel) {
  const num = i + 1;
  if (s.tipo === 'portada' && p.id === 'c2') {
    const [tres, ...resto] = s.titulo.split(' ');
    return `<section class="slide tres" data-n="${num}"><div class="grande">${esc(tres)}</div><img class="pdf" src="${rel}${s.captura.archivo}" alt=""><div class="titulo">${esc(resto.join(' '))}</div><div class="pie"><div style="width:380px;height:100px">${LOCKUP}</div></div></section>`;
  }
  if (s.tipo === 'portada') {
    return `<section class="slide oscura portada" data-n="${num}"><div class="titulo">${esc(s.titulo)}</div>
      <div class="tags"><div class="tag">$ ???</div><div class="tag b">$ ???<div class="tache"></div></div></div>
      <div class="pie"><div style="width:380px;height:100px">${LOCKUP_OSCURO}</div><div class="desliza"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#5A4236" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div></div></section>`;
  }
  if (s.tipo === 'cta') {
    const [antes, despues] = s.cta.split(p.palabra);
    return `<section class="slide oscura cta" data-n="${num}"><div class="logo">${LOCKUP_OSCURO}</div><div class="titulo">${esc(s.titulo)}</div>
      <div class="boton">${esc(antes.trim())}<em>${esc(p.palabra)}</em>${esc(despues.trim())}</div></section>`;
  }
  const textoAbajo = s.ilustracion === 'suma';
  const textoVisible = s.ilustracion === 'formula' ? '' : s.texto;
  return `<section class="slide${s.tipo === 'prueba' ? ' prueba' : ''}" data-n="${num}">
    ${s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : ''}
    <div class="titulo">${esc(s.titulo)}</div>
    ${textoVisible && !textoAbajo ? `<div class="texto">${esc(textoVisible)}</div>` : ''}
    <div class="visual">${visualSlide(s, rel)}</div>
    ${textoAbajo ? `<div class="texto" style="margin-top:34px">${esc(s.texto)}</div>` : ''}
    ${s.nota ? `<div class="nota">${esc(s.nota)}</div>` : ''}
    ${pie(num, n)}</section>`;
}

function carruselHTML(p) {
  const rel = '../capturas/';
  return `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>${esc(p.id)} · ${esc(p.titulo)}</title>${FUENTES}<style>${CSS_SLIDE}</style></head><body>
${p.slides.map((s, i) => slideHTML(p, s, i, p.slides.length, rel)).join('\n')}
</body></html>`;
}

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
  const abrir = async (file) => {
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.evaluate(() => Promise.all([document.fonts.load('600 40px Fredoka'), document.fonts.load('800 40px Nunito')]).then(() => document.fonts.ready));
    const f = await page.evaluate(() => [document.fonts.check('600 40px Fredoka'), [...document.fonts].some((x) => x.family === 'Fredoka' && x.status === 'loaded')]);
    if (!f[1]) throw new Error('No cargó Fredoka en ' + file);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  };

  for (const p of C.piezas) {
    if (p.tipo === 'carrusel') {
      const f = path.join(BASE, 'carruseles', `${p.id}-${p.estructura.toLowerCase()}.html`);
      fs.writeFileSync(f, carruselHTML(p));
      await abrir(f);
      const n = await page.locator('section.slide').count();
      for (let i = 0; i < n; i++) {
        const out = path.join(SALIDA, 'carruseles', `${p.id}-slide-${String(i + 1).padStart(2, '0')}.png`);
        await page.locator('section.slide').nth(i).screenshot({ path: out });
      }
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
}

if (require.main === module) render().catch((e) => { console.error(e); process.exit(1); });
module.exports = { subtitulos, srt };
