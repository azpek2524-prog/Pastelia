# CLAUDE.md

> Contexto para Claude Code trabajando en este proyecto. Léelo antes de empezar.
> Desarrollador de nivel básico (no experto): explica lo que haces y por qué, no solo
> comandos. Responde en español. Entorno: Windows + VS Code + PowerShell.

## Sobre el proyecto: Pastelia

Pastelia (o Pasteli) es una app **cotizadora y administradora para pastelerías**, con
conexión a mensajes de redes sociales para cerrar pedidos, cobrar y responder dudas.
Idea central: cuando llega un mensaje de un cliente, el sistema **decide** qué quiere
(cotización / duda / pago / queja), si menciona fecha, qué tan urgente es, etc., y el
**código enruta** según esas decisiones.

## Cómo repartimos el trabajo de IA (arquitectura)

- **Jev (TypeSafe)** = el "if inteligente". Recibe un `state` (texto o JSON) + `questions`
  tipadas y devuelve **juicios con probabilidades**. Se usa para **clasificar y decidir**.
  **NO escribe texto y NO hace matemáticas ni fechas.**
- **Un LLM aparte** = escribe el **texto** de respuesta al cliente.
- **El código normal** = precios, fechas exactas, sumas y ejecutar acciones.

## Jev — configuración que YA FUNCIONA (no cambiar sin motivo)

- Paquete: **`@typesafe-ai/sdk`** (requiere **Node ≥ 20**). Instalar: `npm install @typesafe-ai/sdk`.
- API key en la variable **`TYPESAFE_API_KEY`**, dentro de un archivo **`.env`** (ignorado por git).
  - ⚠️ NO es `AI_GATEWAY_API_KEY`. Esa era la vía de **Vercel AI Gateway**, que **no** funcionó
    para Jev. Se usa el **SDK directo** de TypeSafe (`api.typesafe.ai`), no el gateway de Vercel.
- Para que funcionen los `import`: el `package.json` debe tener **`"type": "module"`**,
  **o** usar archivos con extensión **`.mjs`**.

### Cómo llamar a Jev

```js
import 'dotenv/config';
import { TypeSafeClient, noul, choice, score } from '@typesafe-ai/sdk';

const client = new TypeSafeClient(); // lee TYPESAFE_API_KEY del .env automáticamente

const { answers, model, usage } = await client.systemOne({
  state: { mensaje_cliente: 'texto del cliente...' },
  questions: {
    intencion: choice('¿Qué quiere principalmente el cliente?', {
      cotizacion: 'Pide precio o quiere encargar un producto',
      duda:       'Pregunta info (sabores, horarios) sin pedir precio',
      pago:       'Quiere pagar o manda comprobante',
      queja:      'Reclama por un problema con su pedido',
    }),
    menciona_fecha: noul('¿El mensaje menciona una fecha o día para el pedido?'),
    urgencia: score('¿Qué tan urgente es atender este mensaje?', [
      'Nada urgente: solo curiosea',
      'Media: quiere respuesta hoy, sin fecha límite cercana',
      'Alta: lo necesita muy pronto o está molesto',
    ]),
  },
});

// El código decide qué hacer con las respuestas de Jev:
// answers.intencion.choice  -> 'cotizacion' | 'duda' | 'pago' | 'queja'
// answers.menciona_fecha.noul (0–1)  -> si >= 0.5, el código extrae la fecha exacta
// answers.urgencia.score  -> nivel (puede ser decimal)
```

### Los 3 primitivos y dónde queda cada respuesta

| Primitivo | Para | Respuesta |
|---|---|---|
| `noul(instr)` | sí / no | `answers.x.noul` = probabilidad de "sí" (0–1). **Sin** confidence aparte. |
| `choice(instr, { label: desc })` | elegir **una** opción | `answers.x.choice`, `answers.x.confidence`, `answers.x.probabilities` |
| `score(instr, [nivel0, nivel1, ...])` | **nivel** en una escala (≥2 niveles) | `answers.x.score` (puede ser decimal), `.confidence`, `.legend`, `.probabilities` |

Además, la respuesta trae `model` (modelo usado) y `usage` (`{ input_tokens, output_tokens }`).

## Reglas de oro al diseñar con Jev

1. **Jev juzga; el código actúa.** Precios, fechas exactas y sumas van en código.
2. **Varias preguntas independientes en UNA sola llamada** → corren en paralelo (más barato/rápido).
3. **Da buen contexto:** usa objetos JSON con campos nombrados en `state`.
4. **Define bien cada opción** en los criterios (qué significa cada label / nivel).
5. **Los umbrales (`>= 0.5`, etc.) se calibran con datos reales**, no son fijos.
6. El tipo garantiza la forma, no la verdad: valida con casos representativos.

## Seguridad

- La API key vive **solo** en `.env` (nunca en la terminal, ni en el código, ni en capturas).
- `.env` y `.env.local` deben estar en `.gitignore`.
- Si una key se expuso alguna vez, **regenérala** en TypeSafe y actualiza `.env`.

## Estado actual y próximos pasos

- ✅ Jev configurado y respondiendo (probado con una pregunta `noul`).
- ⏳ Regenerar la key de TypeSafe que se expuso en capturas durante el setup inicial.
- ⏳ Integrar el clasificador de mensajes (el "triage" de arriba) en Pastelia y conectarlo al ruteo.
- ⏳ Higiene de git: confirmar `.gitignore` y subir el proyecto **sin** la key.

## Referencias

- Docs oficiales (fuente de verdad): https://docs.typesafe.ai
  — revisar `sdk/javascript`, `primitives` (noul / choice / score) y los *cookbooks*.
