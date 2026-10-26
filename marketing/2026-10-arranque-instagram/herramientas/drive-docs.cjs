// Prepara los documentos que se guardan en Google Drive (Pastelia / 4. Posts - Semana 1 Arranque).
// Probado contra el importador de Google Docs (26 oct 2026):
//   - Texto plano → Doc: conserva todo tal cual (emojis, montos con "$", saltos de línea). Se usa para lo
//     que se copia a Instagram: captions, DM, texto alternativo, perfil y respuestas.
//   - Markdown → Doc: títulos, negritas y listas bien; las tablas pierden el formato del encabezado, así que
//     aquí las tablas se escriben como listas. Se usa para los documentos de lectura (guiones, playbook…).
//   - HTML → Doc: NO se usa: interpreta el texto entre dos "$" como fórmula y lo borra.
// Salida: salida/<semana>/drive/<carpeta>/<archivo> y drive/indice.json (título, carpeta y tipo de cada uno).
// Uso: node marketing/2026-10-arranque-instagram/herramientas/drive-docs.cjs [URL del kit]
const fs = require('fs');
const path = require('path');
const C = require('../contenido.cjs');
const { altText, SALIDA, PERFIL } = require('./generar.cjs');

const BASE = path.resolve(__dirname, '..');
const DRIVE = JSON.parse(fs.readFileSync(path.join(BASE, 'drive.json'), 'utf8'));
const KIT = process.argv[2] || '[link del kit]';
const OUT = path.join(SALIDA, 'drive');
const linea = (t) => t + '\n' + '-'.repeat(Math.min(t.length, 60));

// Markdown de los guiones → Markdown para Drive: tablas como listas y sin bloques de código (los textos para
// copiar van en el documento de texto plano "Caption y DM para copiar").
function mdParaDrive(md, p) {
  // Las secciones finales (caption, texto alternativo y DM) se reemplazan por una referencia al documento
  // de texto plano, que es el que se copia a Instagram.
  const corte = md.indexOf('\n## Caption (Instagram)');
  if (corte >= 0 && p.id) {
    const conAlt = md.includes('\n## Texto alternativo');
    md = md.slice(0, corte).replace('Va listo abajo, uno por slide.', `Va listo en el documento «${p.id} · Caption y DM para copiar», uno por slide.`)
      + `\n## Caption${conAlt ? ', texto alternativo' : ''} y respuesta por DM\nEstán en el documento «${p.id} · Caption y DM para copiar» de esta carpeta.\n`;
  }
  const L = md.split('\n'); const out = []; let i = 0;
  while (i < L.length) {
    const l = L[i];
    if (/^```/.test(l)) { i++; while (i < L.length && !/^```/.test(L[i])) i++; i++; out.push(`Está en el documento «${p.id} · Caption y DM para copiar» de esta carpeta.`); continue; }
    if (/^\|/.test(l)) {
      const filas = []; while (i < L.length && /^\|/.test(L[i])) filas.push(L[i++]);
      const celdas = (f) => f.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
      const [cab, , ...cuerpo] = filas; const h = celdas(cab), clave = h[0].toLowerCase();
      if (/^(tiempo|día|#)$/.test(clave)) {
        // Tablas por renglón (escenas, slides, días): título con la primera columna (+ escena, hora o slide).
        const dos = /^(escena|hora|slide)$/i.test(h[1] || '');
        cuerpo.forEach((f) => { const c = celdas(f); out.push(`- **${clave === '#' ? 'Slide ' + c[0] : c[0]}${dos ? ' · ' + (/slide/i.test(h[1]) ? 'slide ' : '') + c[1] : ''}**`); c.slice(dos ? 2 : 1).forEach((v, k) => out.push(`    - ${h[k + (dos ? 2 : 1)]}: ${v}`)); });
      } else {
        // Tablas de componentes (el gancho): cada columna en su renglón.
        cuerpo.forEach((f) => celdas(f).forEach((v, k) => out.push(`- **${h[k]}:** ${v}`)));
      }
      continue;
    }
    out.push(l.replace(/^- \[ \] /, '- ')); i++;
  }
  return out.join('\n');
}
const indice = [];
function guardar(carpeta, archivo, titulo, tipo, contenido) {
  const dir = path.join(OUT, carpeta); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, archivo), contenido);
  indice.push({ carpeta: carpeta || '(raíz)', carpetaId: DRIVE.carpetas[carpeta] || DRIVE.raiz.id, archivo: path.join(carpeta, archivo), titulo, tipo, bytes: Buffer.byteLength(contenido) });
}
const avisoImagenes = `**Imágenes (PNG):** en el Kit de contenido Pastelia (${KIT}) y en el ZIP que te mandé por el chat. Este documento tiene los textos.`;

fs.rmSync(OUT, { recursive: true, force: true });
for (const p of C.piezas) {
  const md = fs.readFileSync(path.join(BASE, p.tipo === 'video' ? 'guiones' : 'carruseles', `${p.id}-guion.md`), 'utf8');
  const nombre = p.tipo === 'video' ? 'Guion, ganchos A y B y storyboard' : p.tipo === 'meme' ? 'Meme: texto y diseño' : 'Slides, diseño y guion';
  guardar(p.carpeta, `${p.id}-guion.md`, `${p.id} · ${nombre}`, 'text/markdown', avisoImagenes + '\n\n' + mdParaDrive(md, p));
  const txt = [`${p.id} · CAPTION Y DM PARA COPIAR`, `${p.dia}, ${p.hora} · ${p.redes.join(', ')} · Palabra clave: ${p.palabra}`, '',
    linea('CAPTION (INSTAGRAM)'), p.captions.instagram().trim(), ''];
  if (p.slides) txt.push(linea('TEXTO ALTERNATIVO (Configuración avanzada → Escribir texto alternativo)'), altText(p), '');
  txt.push(linea(`RESPUESTA POR DM A QUIEN COMENTE ${p.palabra}`), p.dm, '');
  guardar(p.carpeta, `${p.id}-caption-y-dm.txt`, `${p.id} · Caption y DM para copiar`, 'text/plain', txt.join('\n'));
  const srts = p.tipo === 'video' ? [`${p.id}-subtitulos-A.srt`, `${p.id}-subtitulos-B.srt`] : p.voz ? [`${p.id}-subtitulos.srt`] : [];
  srts.forEach((s) => guardar(p.carpeta, s, s, 'srt', fs.readFileSync(path.join(BASE, 'guiones', s), 'utf8')));
}
const pp = (f) => fs.readFileSync(path.join(BASE, f), 'utf8');
const pf = C.perfil;
guardar(PERFIL, 'perfil-instagram.txt', 'Textos del perfil de Instagram (Semana 1)', 'text/plain', [
  `PERFIL DE ${C.HANDLE} · SEMANA 1`, 'Copia cada texto en Instagram → Editar perfil.', '',
  linea('PASOS'), ...pf.pasos.map((x, i) => `${i + 1}) ${x}`), '',
  linea(`NOMBRE RECOMENDADO (${pf.nombre.recomendado.length} caracteres, sale en las búsquedas)`), pf.nombre.recomendado, pf.nombre.porque, '',
  ...pf.nombre.alternativas.flatMap((a) => [linea(`ALTERNATIVA (${a.texto.length} caracteres)`), a.texto, a.porque, '']),
  linea(`PRESENTACIÓN / BIO (${pf.bio.join('\n').length} de 150 caracteres)`), ...pf.bio, pf.bioPorque, '',
  linea('ENLACE'), `Título si la app ya está abierta: ${pf.enlace.titulo}`, `Título si usas lista de espera: ${pf.enlace.tituloListaEspera}`, `URL: ${pf.enlace.url}`, pf.enlace.nota, '',
  linea('HISTORIAS DESTACADAS (nombre · qué va · portada)'), ...pf.destacadas.map((d) => `${d.nombre} · ${d.contenido} · destacada-${d.id}.png (en el kit y en el ZIP)`), ''].join('\n'));
guardar(PERFIL, 'respuestas-dm.txt', 'Respuestas por DM (palabras clave y preguntas)', 'text/plain', [
  'RESPUESTAS POR DM', '', ...C.piezas.flatMap((p) => [linea(`${p.palabra} (${p.id})`), p.dm, '']),
  linea('LISTA DE ESPERA (si todavía no abres la app)'), C.dmListaEspera, '',
  ...C.respuestasDM.flatMap((r) => [linea(r.pregunta + (r.porConfirmar ? ' (por confirmar)' : '')), r.respuesta, ''])].join('\n'));
// Las casillas "- [ ] 1." se vuelven lista numerada: el importador de Docs no garantiza las casillas.
guardar(PERFIL, 'playbook-organico.md', 'Playbook orgánico (Semana 1 y siguientes)', 'text/markdown', pp('perfil-y-playbook/playbook-organico.md').replace(/^- \[ \] (\d+\.) /gm, '$1 '));
guardar(PERFIL, 'calendario.md', 'Calendario de publicación (Semana 1)', 'text/markdown', mdParaDrive(pp('calendario.md'), { id: '' }));
guardar(PERFIL, 'medicion.csv', 'Medición por palabra clave (Semana 1)', 'text/csv', pp('perfil-y-playbook/medicion.csv'));
guardar(PERFIL, 'invitaciones-beta.csv', 'Registro de invitaciones a la beta', 'text/csv', pp('perfil-y-playbook/invitaciones-beta.csv'));

const leeme = `# Kit de contenido Pastelia · Semana 1 del arranque en Instagram

**Página del kit** (slides, storyboards, botones "Copiar texto" y descargas): ${KIT}

**Paquete con todos los PNG, .srt y .txt:** el ZIP que te mandé por el chat, en dos partes (reels y perfil / carruseles y meme).

## Qué hay en cada carpeta
${C.piezas.map((p) => `- **${p.carpeta}:** ${p.id} · ${p.titulo} · ${p.dia}, ${p.hora} · palabra clave ${p.palabra}`).join('\n')}
- **${PERFIL}:** textos del perfil, playbook, calendario, respuestas por DM y plantillas (Sheets) de medición e invitaciones.

En cada carpeta de pieza: el guion o los slides con su diseño (lectura), el caption y el DM en texto plano para copiar y, en los reels y la historia, los subtítulos .srt.

## Por qué las imágenes no están en Drive
El conector de Drive que uso solo recibe archivos escritos dentro de mi mensaje. Los 58 PNG pesan unos 30 MB, así que no es práctico subirlos uno por uno. Están completos en el kit y en el ZIP; si los quieres aquí, descomprime el ZIP y arrastra cada carpeta a la del mismo nombre.

## Datos por confirmar antes de publicar
${C.porConfirmar.map((d) => `- **${d.campo}:** ${d.estado}`).join('\n')}
`;
guardar('', '00-LEEME.md', '00 · LEEME · Kit Semana 1', 'text/markdown', leeme);

fs.writeFileSync(path.join(OUT, 'indice.json'), JSON.stringify(indice, null, 2) + '\n');
console.log(indice.length, 'archivos para Drive ·', (indice.reduce((a, x) => a + x.bytes, 0) / 1024).toFixed(0), 'KB');
indice.forEach((x) => console.log(String(x.bytes).padStart(6), x.tipo.padEnd(13), x.archivo, '→', x.titulo));
