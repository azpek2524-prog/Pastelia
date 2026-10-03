// Cuenta las palabras visibles de cada slide (kicker, título, textos de gráficos y burbujas, texto, ciclo abierto, nota y CTA) y valida:
//   portada: menos de 8 palabras · cuerpo: máximo 25 · último slide: un solo CTA.
// Los símbolos sueltos (+ = · →) no cuentan como palabra; "$186" o "40%" sí.
// Uso: node marketing/2026-10-organizacion-costeo/herramientas/contar-palabras.cjs [--json]
const { piezas } = require('../contenido.cjs');

function palabras(txt) { return (txt || '').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)); }
function visibles(s) {
  return [s.kicker, s.titulo, ...(s.extra || []), s.texto, s.loop, s.nota, s.cta].filter(Boolean).join(' ');
}

function contar() {
  const filas = []; let ok = true;
  piezas.filter((p) => p.tipo === 'carrusel').forEach((p) => {
    p.slides.forEach((s, i) => {
      const n = palabras(visibles(s)).length;
      const esPortada = s.tipo === 'portada', esUltimo = i === p.slides.length - 1;
      const limite = esPortada ? 'menos de 8' : 'máx. 25';
      let cumple = esPortada ? n < 8 : n <= 25;
      if (esUltimo && (s.tipo !== 'cta' || !s.cta || (s.cta.match(/Comenta/g) || []).length !== 1)) cumple = false;
      if (!esUltimo && s.cta) cumple = false;
      if (!cumple) ok = false;
      filas.push({ pieza: p.id, slide: i + 1, tipo: s.tipo || 'cuerpo', palabras: n, limite, cumple, texto: visibles(s) });
    });
  });
  return { filas, ok };
}

if (require.main === module) {
  const { filas, ok } = contar();
  if (process.argv.includes('--json')) { console.log(JSON.stringify({ filas, ok }, null, 2)); }
  else {
    filas.forEach((f) => console.log(`${f.pieza} · slide ${String(f.slide).padStart(2)} · ${f.tipo.padEnd(7)} · ${String(f.palabras).padStart(2)} palabras (${f.limite}) ${f.cumple ? 'OK' : 'NO CUMPLE'}  | ${f.texto}`));
    console.log(ok ? '\nTodo cumple.' : '\nHay slides que no cumplen.');
  }
  process.exit(ok ? 0 : 1);
}

module.exports = { contar, palabras, visibles };
