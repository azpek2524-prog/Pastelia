# Semana 1 · Arranque en Instagram ($0, orgánico) · 26 de octubre al 1 de noviembre de 2026

Fuentes del "Kit de contenido Pastelia" de la primera semana del perfil, en la paleta cacao. Son las 6 piezas que se publican antes de invitar a nadie, para que el perfil no esté vacío:

| Pieza | Qué es | Publicación | Palabra clave |
|---|---|---|---|
| `r1` | Reel (fijado 1): una cotización completa hasta el precio sugerido. Gancho A "¿Todavía cobras tus pasteles a ojo?" y gancho B para "Reel de prueba" | Martes 27 oct, 19:30 | COTIZA |
| `c1` | Carrusel (fijado 2): "Así se calcula un pastel de 20 porciones" ($210 + $180 + $120 + 40 % = $714, datos de ejemplo) | Miércoles 28 oct, 12:30 | COSTEO |
| `p1` | Carrusel de la historia (fijado 3): "No sabía cuánto cobrar, así que hice mi propia app", con guion de voz y `.srt` | Jueves 29 oct, 19:30 | PASTELIA |
| `r2` | Reel del Agente IA (beta): "Le pedí a una IA que cotizara mi pedido", ganchos A y B | Viernes 30 oct, 19:30 | AGENTE |
| `c2` | Carrusel: "Por esto no te queda nada" (tu tiempo, decoración, caja y base, gas y luz) | Sábado 31 oct, 09:30 | TIEMPO |
| `m1` | Meme: "¿Me lo dejas más barato? Es para mi mamá" contra el desglose real de la app | Domingo 1 nov, 19:30 | RESPETO |

**Página publicada:** https://claude.ai/artifact/PWJWNA4KDRrFyxBzNddyEb (privada; cada actualización del kit se publica en este mismo link). El kit del Bloque 01 sigue en su propio link.

**Google Drive:** los carruseles, el meme, los reels (MP4) y las portadas se suben a `Pastelia / 4. Posts - Semana 1 Arranque` (https://drive.google.com/drive/folders/1hHgwA86UZlz0dols1G1Ee42POWLtIjiE) con el botón "Subir a tu Drive" del kit. La página usa la conexión de Google Drive de la dueña en Claude (capacidad `mcp`, herramientas `create_file` y `search_files`), manda cada archivo a su carpeta y no duplica lo que ya está. En Drive no van documentos. Los IDs de las carpetas están en `drive.json`.

## Qué hay aquí

| Carpeta / archivo | Qué es |
|---|---|
| `contenido.cjs` | Todo el texto: slides (con su ciclo abierto y su diseño), guiones con ganchos A/B, captions, DM, perfil, playbook, calendario y datos por confirmar. **Si cambias un texto, cámbialo aquí.** |
| `capturas/` | Capturas reales de `index.html` en modo oscuro con datos de ejemplo. La 14 y la 15 son el Agente IA (beta) |
| `carruseles/` | HTML de cada carrusel y del meme, portada alterna de `p1` con marco para tu foto, y el guion de cada uno con conteo de palabras |
| `storyboards/` | HTML de las escenas de `r1` y `r2` (versión A y versión B) |
| `guiones/` | Guiones de los reels (`.md`) y subtítulos `.srt` (A y B de cada reel, y la voz de `p1`) |
| `captions/` | Caption de Instagram, respuesta por DM y texto alternativo de cada pieza (`.txt`) |
| `perfil-y-playbook/` | Textos del perfil, playbook orgánico, respuestas por DM y plantillas `.csv` de medición e invitaciones |
| `calendario.md` | Día, hora, pieza, red y palabra clave |
| `kit/` | Página del kit que se publica (`index.html`) y la lista de imágenes y videos que lleva (`archivos.json`) |
| `drive.json` | Carpetas de Google Drive a las que sube el botón del kit |
| `herramientas/` | Scripts para capturar la app, revisar textos y generar todo. `diseno-cacao.cjs` define el diseño (colores, goteo, tarjetas, gráficas y la composición de cada slide); `reels.cjs` y `app-local.cjs` graban los reels con la app real |

Los PNG, los ZIP y los MP4 se generan en `salida/` y **no se suben al repo** (están en `.gitignore`). Las capturas de `capturas/` sí se suben porque son la materia prima para volver a generar. Como `marketing/` está en `.assetsignore`, nada de esta carpeta se publica en Cloudflare.

## Diseño cacao

Fondo cacao casi negro (`#140D09` → `#241811`) con grano fino, titulares crema `#FFF4E6` en Fredoka, texto en Nunito, acentos dorados `#E7B676` y la app real en modo oscuro. Cada slide intermedio termina con un ciclo abierto en dorado al pie. Los íconos son SVG (casi todos salen del propio `index.html`), sin emojis en el diseño. No hay pasteles hechos con IA: donde va una foto real hay un marco marcado para tu foto.

## Reels en MP4

`reels.cjs` abre `index.html` en un iframe de 360×640 dentro de un escenario de 1080×1920, toca y escribe en la app de verdad (con toques visibles), mueve la cámara para que lo importante quede en la zona segura y encima pone los textos del storyboard y los subtítulos de los `.srt`. Cada cuadro se captura y ffmpeg arma el MP4 (H.264, 30 fps, audio en silencio para poner la música en Instagram). Salen dos versiones por reel: A para el perfil y B para "Reel de prueba".

- La libreta del gancho A de r1 y la notificación del gancho B de r2 son ilustraciones, no fotos.
- En r2 el servidor del Agente IA no responde desde el entorno de Claude: `app-local.cjs` contesta esas peticiones con la llamada a la herramienta `crear_pedido_directo`, sin texto del modelo. Lo que se ve es la tarjeta "Confirma el pedido" y los mensajes que escribe la propia app. Si la dueña graba su conversación real, se cambian esas escenas.

## Cómo regenerar (desde la raíz del repo)

```bash
export NODE_PATH=$(npm root -g)
H=marketing/2026-10-arranque-instagram/herramientas
node $H/capturar-app.cjs              # capturas de la app en modo oscuro (opcional; no modifica index.html)
node $H/contar-palabras.cjs           # límites de palabras, ciclos abiertos, un solo CTA, sin emojis ni "gratis"
node $H/generar.cjs                   # PNG, storyboards, guiones, captions y .srt (borra y rehace salida/)
node $H/generar.cjs --solo-textos     # solo los textos, sin volver a dibujar los PNG ni borrar los MP4
node $H/reels.cjs                     # los 4 reels en MP4 (r1-A, r1-B, r2-A, r2-B); unos 4 minutos
node $H/reels.cjs r1-A --muestras     # cuadros sueltos de un reel para revisarlo rápido
node $H/generar-kit.cjs               # página del kit y ZIP de la semana (en partes si pasa de 29 MB)
```

Después de `generar-kit.cjs`, la página se vuelve a publicar en el mismo link, con los MP4 y la capacidad `mcp` (Google Drive: `create_file`, `search_files`) para el botón de subida.

Necesita Node con Playwright y Chromium (vienen instalados en el entorno de Claude Code en la nube), `ffmpeg` para los reels y las tiras de los carruseles y, si está instalado, `pngquant` para comprimir los PNG (`apt-get install pngquant`); sin él, los PNG salen más pesados.
