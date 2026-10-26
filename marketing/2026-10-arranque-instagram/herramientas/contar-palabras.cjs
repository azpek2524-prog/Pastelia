// Cuenta las palabras visibles de cada slide (kicker, título, textos de gráficos y burbujas, texto, ciclo
// abierto, nota y CTA) y valida las reglas del kit:
//   portada: título de máximo 10 palabras (el gancho) · cuerpo: máximo 25 palabras visibles
//   slides intermedios: ciclo abierto en dorado al pie · último slide: un solo CTA ("Comenta …")
//   meme: máximo 30 palabras y sin CTA en la imagen (va en el caption)
//   en ningún diseño: emojis · en ningún texto: "gratis", "100% automático" ni "sin esfuerzo"
// Los símbolos sueltos (+ − = · → ?) no cuentan como palabra; "$186" o "40%" sí.
// Uso: node marketing/2026-10-arranque-instagram/herramientas/contar-palabras.cjs [--json]
const { piezas } = require('../contenido.cjs');

function palabras(txt) { return (txt || '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)); }
function visibles(s) {
  return [s.kicker, s.titulo, ...(s.extra || []), s.texto, s.loop, s.nota, s.cta].filter(Boolean).join(' ');
}
const EMOJI = /\p{Extended_Pictographic}/u;
const PROHIBIDO = /gratis|100\s?% autom|sin esfuerzo/i;

function contar() {
  const filas = []; let ok = true;
  piezas.filter((p) => p.slides).forEach((p) => {
    p.slides.forEach((s, i) => {
      const txt = visibles(s), n = palabras(txt).length;
      const esPortada = s.tipo === 'portada', esUltimo = i === p.slides.length - 1, esMeme = p.tipo === 'meme';
      const problemas = [];
      let limite;
      if (esMeme) {
        limite = 'máx. 30';
        if (n > 30) problemas.push('más de 30 palabras');
        if (s.cta) problemas.push('el CTA del meme va en el caption');
      } else if (esPortada) {
        limite = 'título máx. 10';
        if (palabras(s.titulo).length > 10) problemas.push('título de portada con más de 10 palabras');
      } else {
        limite = 'máx. 25';
        if (n > 25) problemas.push('más de 25 palabras');
      }
      if (!esMeme && !esPortada && !esUltimo && !s.loop) problemas.push('falta el ciclo abierto');
      if (!esMeme && esUltimo && (s.tipo !== 'cta' || !s.cta || (s.cta.match(/Comenta/g) || []).length !== 1)) problemas.push('el último slide necesita un solo CTA');
      if (!esMeme && !esUltimo && s.cta) problemas.push('CTA antes del último slide');
      if (EMOJI.test(txt)) problemas.push('emoji en el diseño');
      if (PROHIBIDO.test(txt)) problemas.push('palabra prohibida');
      if (problemas.length) ok = false;
      filas.push({ pieza: p.id, slide: i + 1, tipo: s.tipo || 'cuerpo', palabras: n, titulo: palabras(s.titulo).length, limite, cumple: !problemas.length, problemas, texto: txt });
    });
  });
  // Captions, guiones y DM: sin "gratis" ni promesas de "100 % automático".
  piezas.forEach((p) => {
    const textos = [...Object.values(p.captions || {}).map((f) => f()), p.dm, ...((p.cuerpo || []).map((e) => e.voz + ' ' + e.texto))];
    Object.values(p.variantes || {}).forEach((v) => v.escenas.forEach((e) => textos.push(e.voz + ' ' + e.texto)));
    textos.forEach((t) => { if (PROHIBIDO.test(t)) { ok = false; filas.push({ pieza: p.id, slide: '-', tipo: 'texto', palabras: 0, limite: '-', cumple: false, problemas: ['palabra prohibida en caption/guion/DM'], texto: t.slice(0, 80) }); } });
  });
  return { filas, ok };
}

if (require.main === module) {
  const { filas, ok } = contar();
  if (process.argv.includes('--json')) { console.log(JSON.stringify({ filas, ok }, null, 2)); }
  else {
    filas.forEach((f) => console.log(`${f.pieza} · slide ${String(f.slide).padStart(2)} · ${String(f.tipo).padEnd(7)} · ${String(f.palabras).padStart(2)} palabras (${f.limite}) ${f.cumple ? 'OK' : 'NO CUMPLE: ' + f.problemas.join(', ')}  | ${f.texto}`));
    console.log(ok ? '\nTodo cumple.' : '\nHay slides o textos que no cumplen.');
  }
  process.exit(ok ? 0 : 1);
}
module.exports = { contar, palabras, visibles };
