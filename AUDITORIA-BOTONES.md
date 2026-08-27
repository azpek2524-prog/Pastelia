# Auditoría de botones y enlaces — Pastelia

> Estado tras aplicar el diseño definitivo **al pie de la letra** (commit `306c380`).
> El diseño entregado es una maqueta **visual/estática**: solo la **navegación entre pantallas** está conectada. Todo lo demás son elementos de muestra sin lógica. Esta lista documenta qué falta cablear (sin corregir todavía, según lo pedido).

Fecha: 2026-08-27

---

## ✅ Lo que SÍ funciona (navegación)
Cambian de pantalla correctamente (atributo `data-go` / `data-nav`):

- **Menú lateral (escritorio):** "＋ Nueva cotización", Inicio, Agenda de pedidos, Recetas, Mis precios.
- **Barra inferior (móvil):** Inicio, Agenda, Recetas, Precios y el botón central **＋** (abre Cotizar).
- **Accesos rápidos:** "Cotizar" (Inicio) y "Precios" (Inicio, escritorio).
- **Enlaces "Ver agenda" / "Ver todas"** → van a Agenda.
- **"＋ Nuevo pedido"** (Agenda) y **"＋ Nueva / Nueva receta"** (Recetas) → van a Cotizar.
- **Flecha "‹"** (Cotizar, móvil) → vuelve a Inicio.

---

## ❌ Botones sin acción (no hacen nada al pulsar)

### Inicio
- **"PDF" / "Generar PDF"** (acceso rápido) — no genera nada.
- **"Ticket" / "Ticket WhatsApp"** (acceso rápido) — no hace nada.
- **Filas de "Entregas de hoy"** (Pastel Frida, Cupcakes, Número 30) — no abren el pedido.
- **Tarjetas de "Recetas favoritas"** (Chocoavellana, Limón & mora, Red velvet) — no abren la receta.

### Cotizar  ← *aquí está el problema que notaste ("no muestra las opciones correctas")*
- **Chips de paso** (1 Cliente / 2 Pastel / 3 Costeo / $ Total) — decorativos, no navegan entre pasos.
- **Chips de TAMAÑO** (Petit / Chico / Mediano / Grande / Bento) — **no se pueden seleccionar**.
- **"Cambiar"** (receta base) — no hace nada.
- **Chips de Extras** (Flores / Topper / + Añadir) — no se activan.
- **"Guardar" / "Guardar cotización"** — no guarda.
- **"📄 / 📄 PDF"** — no genera PDF.
- **"💬 / 💬 Ticket"** — no copia ticket de WhatsApp.

### Agenda
- **Filtros** (Activos / Todos / Apartados / Entregados) — no filtran.
- **Botones de cada pedido:** "💬 WhatsApp", "📄 PDF", "💵 Cobrar" — no hacen nada.
- **Tarjetas de pedido** — no se abren ni editan.

### Recetas
- **Tarjetas de receta** — no se abren ni se usan al cotizar.

### Precios
- **"💾 Guardar inventario"** — no guarda.
- **Filas de Extras de diseño** — no editables.

---

## ⚠️ Elementos que parecen campos/controles pero son texto fijo
No son editables (son `<div>` de muestra, no `<input>`):

- **Cotizar:** Nombre, Teléfono, Evento (datos "Marisol González / 55 1234 5678 / 13 ago").
- **Precios:** buscador "🔍 Buscar insumo…" y las filas de insumos (Mantequilla, Harina, Huevo, Chocolate) — **no se puede cambiar el precio**.
- **Inicio:** buscador "🔍 Buscar pedido, cliente…".
- **Resumen en vivo** (Cotizar): los montos ($210, $180, $714…) son fijos, **no se recalculan**.

---

## 📄 Funciones que existían en la versión anterior y no están en este diseño
(Para reconectar en la siguiente iteración — el código funcional sigue disponible en el historial de git, commit `e0b5783`.)

1. Cálculo automático del precio (costeo real por ingredientes + margen).
2. Guardado en el dispositivo (localStorage) con los datos reales de cada pastelería.
3. Recetas guardadas reales (cotización exprés con escalado por tamaño).
4. Generación del **PDF "Formulario de pedido de pastel"** (este diseño no incluye el formato imprimible).
5. Agenda real: estados del pedido, cobros, saldos y KPIs calculados.
6. Inventario editable ("Mis precios").
7. Copiar ticket de WhatsApp.
8. Los datos mostrados son de muestra fija (Azucena's Cake Studio, Marisol González, $1,240, $8,940…): aún no reflejan datos reales.

---

## Sugerencia para la siguiente iteración
El diseño ya quedó idéntico. El siguiente paso sería **cablear la funcionalidad sobre esta misma maqueta**, empezando por el orden de mayor impacto:
1. Cotizar (seleccionar tamaño/receta → cálculo del precio en vivo).
2. Guardar en agenda + estados/cobros.
3. Mis precios (inventario editable).
4. PDF del pedido + ticket de WhatsApp.
