# Pastelia — instrucciones para Claude Code

## El proyecto
- Pastelia es una PWA de una sola página: `index.html` (Vanilla JS + `localStorage`). Estado y siguientes pasos en `ROADMAP-MVP.md`; el clasificador de mensajes (Jev) en `JEV.md`.
- Responde en español. El dueño no es desarrollador experto: explica qué haces y por qué, no solo los comandos.
- `.agents/rules/pastelia_prompts.md` es para otro asistente que redacta prompts; no aplica a Claude Code.

## Publicación
- Cada push a `main` publica la app en Cloudflare (`.github/workflows/deploy.yml`) y sube **toda la carpeta**, salvo lo que esté en `.assetsignore`.
- Cualquier carpeta o archivo nuevo que no sea parte de la app (docs, marketing, herramientas) se agrega a `.assetsignore` antes de llegar a `main`.

## Marketing
- **Skills:** `.claude/skills/` (de `coreyhaines31/marketingskills`, versión fijada en `skills-lock.json`). Se invocan por nombre y sin prefijo: `/social`, `/copywriting`, `/ad-creative`, `/emails`, etc.
- **Contexto:** lee `.agents/product-marketing.md` antes de escribir cualquier pieza. Lo marcado como `[supuesto]` o `[por definir]` no se afirma como hecho: se pregunta o se marca "por confirmar" en la entrega. El contexto se actualiza con `/product-marketing`.
- **Veracidad:**
  - Solo se prometen funciones de la tabla "Qué se puede prometer hoy" del contexto; si hay duda, se verifica en `index.html`.
  - El Agente IA es beta.
  - Los números de ejemplo (costos, precios) se sacan de la app o de su código y se presentan como ejemplo.
  - Nunca se inventan métricas, testimonios, clientes ni tiempos.
- **Marca:** marrón `#7B5B4B`, crema `#FFF4E6`, dorado `#E7B676`, tinta `#5A4236`; Fredoka (títulos) y Nunito (texto). Los logos están en la raíz (`pastelia-lockup.svg`, `pastelia-icon*.svg`). Las capturas de la app deben ser de esta app, no de otros repos.
- **Look de marketing (cacao):** fondos oscuros cacao/café (`#140D09` → `#241811`), texto crema, acentos dorados y la app capturada en modo oscuro; titulares en Nunito Black. Nada de paletas claras ni de otros colores. Plantilla en `marketing/2026-10-organizacion-costeo/herramientas/diseno-cacao.cjs`.

## Formato de entrega: "Kit de contenido Pastelia"
Cuando pida contenido para redes (posts, reels, carruseles, calendarios, campañas o anuncios), la entrega siempre incluye:
1. **Página publicada** "Kit de contenido Pastelia". Por cada pieza lleva:
   - fecha, red y formato;
   - guion o slides;
   - caption por red con botón "Copiar texto";
   - avisos de "Antes de publicar" con los datos por confirmar.

   Cada actualización se publica en el mismo link.
2. **Carruseles diseñados:** cada slide en PNG de 1080×1350 con la identidad de marca, descargables desde el kit.
3. **Videos:**
   - Con mis clips o fotos: edita el Reel en 9:16, con subtítulos, textos de marca y tarjeta final, y entrégalo en MP4.
   - Sin material: pídemelo antes de editar y, mientras tanto, entrega un storyboard visual por escena.
4. **Paquete:** ZIP por semana con los PNG, los MP4 y los captions en `.txt`, enviado como archivo en el chat.
5. **Calendario** de publicación dentro del kit: día, pieza, red y palabra clave del CTA.

Las fuentes del kit (HTML de slides, guiones, captions) se guardan en `marketing/<AAAA-MM>-<tema>/`, que está excluido en `.assetsignore`. Los MP4 y los ZIP no se suben al repo. Mi material (fotos y clips) va en `marketing/material/` si lo subo al repo, o lo mando por el chat.
