# Bloque 01 · Organización y costeo (octubre 2026)

Fuentes del "Kit de contenido Pastelia" de la semana del 5 al 11 de octubre de 2026: 2 videos (AGENDA, COTIZA) y 2 carruseles (COSTEO, ANTICIPO).

**Página publicada:** https://claude.ai/artifact/UTvekWzAYnhiX2XshDNFtt (privada; cada actualización del kit se publica en este mismo link).

## Qué hay aquí

| Carpeta / archivo | Qué es |
|---|---|
| `contenido.cjs` | Todo el texto: guiones, slides, captions, avisos y calendario. **Si cambias un texto, cámbialo aquí.** |
| `capturas/` | Capturas reales de la app (corrida en modo local con datos de ejemplo) |
| `carruseles/` | HTML de cada carrusel por paleta (estilo App Store, lienzo continuo) y guion con conteo de palabras |
| `storyboards/` | HTML de las escenas de cada video |
| `guiones/` | Guiones de los videos (`.md`) y subtítulos (`.srt`) |
| `captions/` | Captions por red y respuesta por DM (`.txt`) |
| `calendario.md` | Día, pieza, red, hora sugerida y palabra clave |
| `kit/` | Página del kit que se publica (`index.html`) y la lista de imágenes que lleva (`archivos.json`) |
| `herramientas/` | Scripts para capturar, contar palabras y generar todo. `paletas.cjs` define las 4 paletas y `carrusel-pro.cjs` el diseño de los carruseles |

Los PNG, los ZIP (uno por paleta) y los MP4 se generan en `salida/` y **no se suben al repo** (están en `.gitignore`).

Paletas en prueba: Fresa, Azul eléctrico, Mandarina y Menta. En cada una, las pantallas del teléfono son la app real capturada con ese color de marca (Mi negocio → color).

## Cómo regenerar (desde la raíz del repo)

```bash
export NODE_PATH=$(npm root -g)
node marketing/2026-10-organizacion-costeo/herramientas/capturar-app.cjs    # capturas base de la app (opcional)
# capturas de la app en el color de cada paleta (las usan los carruseles)
for p in fresa:#E23E68 azul:#2360EB mandarina:#EF5418 menta:#0B9873; do
  PASTELIA_COLOR="${p#*:}" PASTELIA_OUT="marketing/2026-10-organizacion-costeo/salida/capturas/${p%%:*}" \
    node marketing/2026-10-organizacion-costeo/herramientas/capturar-app.cjs
done
node marketing/2026-10-organizacion-costeo/herramientas/contar-palabras.cjs # valida portada < 8 y cuerpo ≤ 25 palabras
node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs         # PNG, storyboards, guiones, captions, .srt
node marketing/2026-10-organizacion-costeo/herramientas/generar-kit.cjs     # página del kit y un ZIP por paleta
```

Necesita Node con Playwright y Chromium (vienen instalados en el entorno de Claude Code en la nube).
