# Bloque 01 · Organización y costeo (octubre 2026)

Fuentes del "Kit de contenido Pastelia" de la semana del 5 al 11 de octubre de 2026: 2 videos (AGENDA, COTIZA) y 2 carruseles (COSTEO, ANTICIPO).

**Página publicada:** https://claude.ai/artifact/UTvekWzAYnhiX2XshDNFtt (privada; cada actualización del kit se publica en este mismo link).

## Qué hay aquí

| Carpeta / archivo | Qué es |
|---|---|
| `contenido.cjs` | Todo el texto: guiones, slides, captions, avisos y calendario. **Si cambias un texto, cámbialo aquí.** |
| `capturas/` | Capturas reales de la app (corrida en modo local con datos de ejemplo) |
| `carruseles/` | HTML de los slides y guion de cada carrusel con conteo de palabras |
| `storyboards/` | HTML de las escenas de cada video |
| `guiones/` | Guiones de los videos (`.md`) y subtítulos (`.srt`) |
| `captions/` | Captions por red y respuesta por DM (`.txt`) |
| `calendario.md` | Día, pieza, red, hora sugerida y palabra clave |
| `kit/` | Página del kit que se publica (`index.html`) y la lista de imágenes que lleva (`archivos.json`) |
| `herramientas/` | Scripts para capturar, contar palabras y generar todo |

Los PNG, el ZIP y los MP4 se generan en `salida/` y **no se suben al repo** (están en `.gitignore`).

## Cómo regenerar (desde la raíz del repo)

```bash
export NODE_PATH=$(npm root -g)
node marketing/2026-10-organizacion-costeo/herramientas/capturar-app.cjs    # capturas de la app (opcional)
node marketing/2026-10-organizacion-costeo/herramientas/contar-palabras.cjs # valida portada < 8 y cuerpo ≤ 25 palabras
node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs         # PNG, storyboards, guiones, captions, .srt
node marketing/2026-10-organizacion-costeo/herramientas/generar-kit.cjs     # página del kit y ZIP de la semana
```

Necesita Node con Playwright y Chromium (vienen instalados en el entorno de Claude Code en la nube).
