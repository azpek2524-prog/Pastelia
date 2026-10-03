# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-10-03

> Fuente: borrador automático a partir del código y los documentos del repo (`index.html`, `manifest.webmanifest`, `ROADMAP-MVP.md`, `AUDITORIA-BOTONES.md`, `JEV.md`).
> Todavía no hay entrevista con clientes. Lo marcado como **[supuesto]** no sale del repo y hay que confirmarlo; lo marcado como **[por definir]** es una decisión pendiente del dueño.

## Product Overview
**One-liner:** Cotizador y administrador para reposteros: calcula cuánto cobrar por cada pastel con tus costos reales y lleva tus pedidos, anticipos y entregas en un solo lugar, con tu marca.
**What it does:** Calcula el costo de un pastel a partir de lo que te cuesta comprar cada insumo (costo por gramo o pieza), tus recetas guardadas, el tamaño (multiplicador y porciones), la mano de obra, los extras de diseño y tu margen. Da el precio sugerido y el precio por porción. La cotización se guarda como pedido en una agenda (Cotizado → Apartado → Entregado) con prepago (anticipo), saldo, "por cobrar" e ingresos del día, la semana y el mes. Genera un PDF de cotización con tu logo y color, y abre WhatsApp con el ticket para tu cliente.
**Product category:** Cotizador de pasteles / app para reposteros y pastelerías (así lo buscan: "cuánto cobrar por un pastel", "cómo costear un pastel", "app para pastelerías").
**Product type:** App web instalable (PWA) para celular y escritorio. Cuenta con correo o Google (Firebase). Los datos viven en el dispositivo (`localStorage`) y se respaldan con "Copia de seguridad" (exportar/restaurar).
**Business model:** [por definir] Hoy la app no tiene planes de pago. El roadmap plantea "Pastelia PRO": suscripción mensual con backend en la nube y un agente conectado a WhatsApp e Instagram.

### Qué se puede prometer hoy (y qué no)
| Estado | Funciones |
|---|---|
| **Listo** | Mis precios (costo por gramo/pieza), recetas reutilizables, tamaños editables (multiplicador y porciones), extras y margen, precio sugerido y por porción, agenda de pedidos con estados, prepago/saldo/por cobrar, "Cobrado + Entregado", ingresos día/semana/mes, PDF con marca, ticket de WhatsApp, Mi negocio (nombre, logo, color, teléfono, Instagram), modo claro/oscuro, copia de seguridad, inicio de sesión |
| **Beta** | Agente IA ("Tu asistente de cotización · beta"): pre-llena el cotizador desde un pedido escrito ("pastel para 20 personas") y puede guardar en la agenda. Mostrarlo como beta, no como función principal |
| **No prometer** | Que responde solo los DMs de WhatsApp/Instagram, datos en la nube o sincronización entre dispositivos, precio o planes (todo es roadmap) |

**Ticket de WhatsApp actual (una línea):** `Mi pastelería - Ticket | Cliente: … | Fecha: … | Pastel: Receta · Mediano 20p | Total: $…`. El anticipo aparece en el pedido y en el PDF, no en el ticket.

## Target Audience
**Target companies:** Reposteros caseros y pastelerías pequeñas (1 a 3 personas) que venden pasteles por encargo y toman pedidos por WhatsApp, Instagram y Facebook. Mercado inicial: México (precios en pesos) [supuesto: confirmar si también LatAm]. La bienvenida de la app dice "¡Bienvenida a Pastelia!": la mayoría de usuarias son mujeres [supuesto].
**Decision-makers:** La dueña o el dueño del negocio: usa la app, decide y paga.
**Primary use case:** Saber cuánto cobrar por cada pastel sin perder dinero y no perder de vista ningún pedido ni cobro.
**Jobs to be done:**
- "Dime cuánto cobrar por este pastel sin trabajar gratis."
- "Que no se me pase ninguna entrega ni ningún anticipo."
- "Verme profesional cuando le mando la cotización al cliente."
**Use cases:**
- Cotizar un pastel para 20 personas mientras el cliente espera respuesta en WhatsApp.
- Actualizar el precio de la mantequilla una vez y que todas las cotizaciones se recalculen.
- Apartar la fecha con un anticipo y ver cuánto falta por cobrar.
- Revisar en la mañana las entregas del día y los ingresos de la semana.
- Mandar un PDF con su logo para un evento (boda, XV años, empresa).

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Repostera casera que empieza [supuesto] | Vender sin perder dinero y que la tomen en serio | Cobra "a ojo" o copia precios de otras; no cuenta su tiempo, la caja ni el gas | Su precio real en segundos y una cotización que se ve profesional |
| Pastelería pequeña con pedidos cada semana [supuesto] | Orden, cobrar a tiempo, saber cuánto gana | Pedidos y anticipos regados entre la libreta y los chats; se le olvidan cobros | Agenda con lo que entrega hoy, lo que falta cobrar y lo que ya ganó |

## Problems & Pain Points
**Core problem:** No saben su costo real, así que cobran "a ojo" o copiando a la competencia, y llevan precios, pedidos y anticipos en una libreta y en chats de WhatsApp.
**Why alternatives fall short:**
- Libreta: los precios se quedan viejos, no suma sola y se pierde.
- Excel o Sheets: incómodo en el celular, fórmulas que se rompen, no avisa entregas ni cobros.
- Calculadora + WhatsApp: hay que escribir la cotización a mano en cada chat.
- Copiar el precio de la competencia: no refleja tus insumos, tu receta ni tu tiempo.
**What it costs them:** Venden por debajo del costo (sin contar caja, base, gas, luz y su tiempo), pierden horas cotizando, se les pasan pedidos y anticipos.
**Emotional tension:** Miedo a cobrar "caro" y perder al cliente, culpa por cobrar su tiempo, estrés de hacer cuentas en la noche, ansiedad de que se pase una entrega.

## Competitive Landscape
[supuesto: falta investigar; usar `/competitor-profiling` con URLs reales]
**Direct:** Otras apps y cotizadores para reposteros — por investigar.
**Secondary:** Plantillas de Excel/Sheets de costeo y calculadoras que vienen con cursos de repostería — falla porque solo calculan: no guardan pedidos, cobros ni dan un documento para el cliente.
**Indirect:** Libreta + calculadora + WhatsApp, o copiar precios de otras pastelerías — falla porque no refleja tus costos y todo queda disperso.

## Differentiation
**Key differentiators:**
- Costeo real por gramo con tus propios precios, recetas reutilizables y tamaños con porciones (precio por porción incluido).
- De la cotización al cobro en un solo lugar: cotización → pedido en agenda → anticipo y saldo → entregado → ingresos.
- Marca blanca: tu logo, nombre y color en el PDF y en el ticket.
- Hecha para el celular, en español y con el vocabulario del oficio.
**How we do it differently:** No es un inventario genérico ni una hoja de cálculo: piensa en pasteles (recetas, tamaños, porciones, extras de decoración) y en cómo se vende por encargo (anticipo, fecha del evento, entrega o recoger).
**Why that's better:** Cotizas más rápido, cobras lo justo y no se te pasa nada.
**Why customers choose us:** [supuesto: confirmar con usuarias reales].

## Objections
| Objection | Response |
|-----------|----------|
| "Soy mala para la tecnología / se ve complicado" | Configuras tu marca en menos de un minuto y el precio se calcula solo mientras llenas los pasos |
| "Si cobro más, pierdo clientes" | El precio sale de tus costos; tú eliges el margen y ves el precio por porción para explicarlo |
| "Ya tengo mi libreta o mi Excel" | Cuando sube la mantequilla, Pastelia recalcula todo; además te dice qué entregas hoy y qué falta cobrar |
| "¿Y si pierdo mis datos?" | Copia de seguridad para exportar y restaurar. Ojo: hoy los datos viven en tu dispositivo, no en la nube |
| "¿Cuánto cuesta?" | [por definir] |

**Anti-persona:** Pastelerías grandes con punto de venta y varias sucursales; negocios que solo venden pan o pastel de vitrina sin encargo; quien no está dispuesta a capturar sus precios de insumos [supuesto].

## Switching Dynamics
**Push:** Darse cuenta de que trabajó gratis, olvidar un pedido o un anticipo, cotizar a mano en cada chat.
**Pull:** Tener el precio en segundos, verse profesional, saber cuánto ganó en la semana.
**Habit:** "Siempre lo he hecho en mi libreta", "así cobra todo mundo", WhatsApp como agenda.
**Anxiety:** Que capturar los insumos tarde mucho, que la app le diga un precio más alto que el de su competencia, perder sus datos.

## Customer Language
[supuesto: todavía no hay frases textuales de clientes; validar con entrevistas, comentarios y DMs]
**How they describe the problem:**
- "¿Cuánto cobro por un pastel de 20 personas?"
- "Cobro a ojo."
- "Al final no me queda nada."
- "Sale como en 900, más o menos."
**How they describe us:**
- [pendiente]
**Words to use:** costear, cotizar, insumos, receta, porciones, anticipo, apartar la fecha, pedido, entrega, por cobrar, ganancia, tu tiempo, tu pastelería.
**Words to avoid:** jerga de software (SaaS, dashboard, ERP, onboarding), anglicismos innecesarios, "barato", promesas de "sin esfuerzo" o "100% automático".
**Glossary:**
| Term | Meaning |
|------|---------|
| Mis precios / insumos | Lo que te cuesta comprar cada ingrediente o material; la app saca el costo por gramo o pieza |
| Receta | Ingredientes y cantidades de un pastel, reutilizables al cotizar |
| Tamaño | Bento, Petit, Chico, Mediano, Grande, Extra grande; cada uno con multiplicador (Mediano = 1.00) y porciones (Mediano = 20) |
| Extras | Decoración que suma al precio (flores, topper) |
| Margen | Porcentaje de ganancia sobre el costo |
| Precio sugerido / por porción | Precio final de la cotización y cuánto sale cada porción |
| Prepago (anticipo) / saldo | Lo que el cliente adelanta para apartar y lo que falta pagar |
| Por cobrar | Total pendiente de cobro en la agenda |
| Cotizado → Apartado → Entregado | Estados del pedido |
| Mi negocio | Nombre, logo, color y contacto que salen en la app, el PDF y el ticket |

## Brand Voice
**Tone:** Cálido, cercano y práctico. Tutea. Español de México.
**Style:** Frases cortas y claras, ejemplos con pesos y pasteles reales, cero tecnicismos. Habla del oficio con respeto: cobrar bien no es ser cara.
**Personality:** Cálida, ordenada, honesta, práctica, orgullosa del oficio.
**Identidad visual:** Marrón `#7B5B4B` (primario), Crema `#FFF4E6` (fondo), Dorado `#E7B676` (acento), tinta `#5A4236`. Tipografías Fredoka (títulos) y Nunito (texto). Logos en la raíz del repo: `pastelia-lockup.svg`, `pastelia-lockup-oscuro.svg`, `pastelia-icon*.svg`. En la interfaz de la app no se usan emojis.

## Proof Points
**Metrics:** Ninguna todavía. No inventar cifras de usuarios, ahorro de tiempo ni ventas.
**Customers:** [pendiente]
**Testimonials:** [pendiente]
**Value themes:**
| Theme | Proof |
|-------|-------|
| Cobrar lo justo | Costeo por gramo con tus precios; demo en vivo de una cotización (ej. pastel Mediano de 20 porciones) |
| Orden | Agenda con entregas de hoy, por cobrar e ingresos de la semana |
| Verse profesional | PDF y ticket con tu logo y color |

## Goals
**Business goal:** Conseguir usuarias y usuarios (adquisición).
**Conversion action:** Crear cuenta en Pastelia (correo o Google), configurar "Mi negocio" y hacer la primera cotización. [por confirmar: URL pública de la app para los links y UTMs]
**Current metrics:** [pendiente]

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-10-03) — Initial context, borrador desde el código y los documentos del repo; pendiente validar supuestos con el dueño.
