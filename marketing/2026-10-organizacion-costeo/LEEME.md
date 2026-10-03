# Bloque 01 · Lanzamiento, organización y costeo (octubre 2026)

Fuentes del "Kit de contenido Pastelia" de la semana del 5 al 11 de octubre de 2026, en la paleta cacao:

| Pieza | Qué es | Palabra clave |
|---|---|---|
| `m1` | Manifiesto: post fundacional que presenta el perfil (se publica primero y se fija) | PASTELIA |
| `cA` | Carrusel opción A: "El error de $180 en cada pastel" (tu tiempo) | TIEMPO |
| `v1` | Video Problem-Solution, 30 s (libreta + WhatsApp vs. tu agenda) | AGENDA |
| `cB` | Carrusel opción B: "¿Y si tu competencia también cobra mal?" (costeo por gramo) | COSTEO |
| `v2` | Video Tutorial/Demo con cronómetro real | COTIZA |
| `cC` | Carrusel opción C: "El mensaje que te arruina el sábado" (orden y anticipos) | ORDEN |

**Página publicada:** https://claude.ai/artifact/UTvekWzAYnhiX2XshDNFtt (privada; cada actualización del kit se publica en este mismo link).

## Qué hay aquí

| Carpeta / archivo | Qué es |
|---|---|
| `contenido.cjs` | Todo el texto: slides (con su ciclo abierto y su diseño), guiones, captions, avisos y calendario. **Si cambias un texto, cámbialo aquí.** |
| `capturas/` | Capturas reales de la app en modo oscuro (corrida en modo local con datos de ejemplo) |
| `carruseles/` | HTML de cada carrusel (lienzo continuo que se corta en slides) y guion con conteo de palabras |
| `storyboards/` | HTML de las escenas de cada video |
| `guiones/` | Guiones de los videos (`.md`) y subtítulos (`.srt`) |
| `captions/` | Captions por red y respuesta por DM (`.txt`) |
| `calendario.md` | Día, pieza, red, hora sugerida y palabra clave |
| `kit/` | Página del kit que se publica (`index.html`) y la lista de imágenes que lleva (`archivos.json`) |
| `herramientas/` | Scripts para capturar, contar palabras y generar todo. `diseno-cacao.cjs` define el diseño (colores, goteo, pastel, libreta, teléfonos, tarjetas y la composición de cada slide) |

Los PNG, los ZIP y los MP4 se generan en `salida/` y **no se suben al repo** (están en `.gitignore`). Si el ZIP de la semana pasa de 29 MB, se parte en dos (carruseles y videos) para que quepa en el chat.

## Diseño cacao

Fondo cacao casi negro (`#140D09` → `#241811`) con grano fino, titulares crema `#FFF4E6` en Nunito Black, acentos dorados `#E7B676` y la app real en modo oscuro. Cada slide intermedio termina con un ciclo abierto en dorado al pie (frase a medias o pregunta + flecha) y lleva un elemento visual: gráfico, captura real o ilustración.

## Cómo regenerar (desde la raíz del repo)

```bash
export NODE_PATH=$(npm root -g)
node marketing/2026-10-organizacion-costeo/herramientas/capturar-app.cjs    # capturas de la app en modo oscuro (opcional)
node marketing/2026-10-organizacion-costeo/herramientas/contar-palabras.cjs # valida portada < 8 y cuerpo ≤ 25 palabras
node marketing/2026-10-organizacion-costeo/herramientas/generar.cjs         # PNG, storyboards, guiones, captions, .srt
node marketing/2026-10-organizacion-costeo/herramientas/generar-kit.cjs     # página del kit y ZIP de la semana
```

Necesita Node con Playwright y Chromium (vienen instalados en el entorno de Claude Code en la nube). Para comprimir los PNG usa `pngquant` si está instalado (`apt-get install pngquant`); sin él, los PNG salen más pesados.
