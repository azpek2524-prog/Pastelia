# Agente IA — Proxy (Cloudflare Worker) · Backend: Google Gemini

Este proxy es el intermediario entre la app **Pastelia** (`index.html`) y la API de **Gemini** (Google).

**Por qué existe:** la clave del modelo la manejamos nosotros, no los clientes. Una clave centralizada **no puede** vivir en el navegador (cualquiera podría verla en el código fuente y gastar en nuestra cuenta). Por eso vive aquí, como *secreto del servidor*. La app solo conoce la **URL** del proxy, que no es sensible.

```
[ App / index.html ]  --POST-->  [ Cloudflare Worker (esta clave) ]  --->  [ API de Gemini ]
     (sin clave)                        (guarda GEMINI_API_KEY)
```

> El contrato de la app (`POST {messages, context} -> {reply}`) es el mismo sin importar el modelo de atrás. Cambiar de Gemini a otro proveedor solo toca este archivo, nunca `index.html`.

## Despliegue (dashboard, sin instalar nada)

1. Entra a **Cloudflare → Workers & Pages → Create → Worker**.
2. Reemplaza el código por el de [`worker.js`](./worker.js) y pulsa **Deploy**.
3. En **Settings → Variables and Secrets** agrega:
   - **Secret** `GEMINI_API_KEY` = tu clave de **Google AI Studio** (Gemini API).
   - *(Opcional, recomendado en producción)* **Variable** `ALLOWED_ORIGIN` = el dominio de tu app (p. ej. `https://tupasteleria.com`). Restringe quién puede usar el proxy.
4. Copia la URL del Worker (algo como `https://pastelia-agente.tucuenta.workers.dev`).
5. En `index.html`, pega esa URL en la constante:
   ```js
   var AGENT_PROXY_URL = 'https://pastelia-agente.tucuenta.workers.dev';
   ```
6. Recarga la app y abre el botón **Agente IA** (esquina inferior derecha).

## Modelo, pensamiento y costo

- Modelo por defecto: **`gemini-3.1-pro-preview`** con **pensamiento `high`** (`thinkingConfig.thinkingLevel`), tal como se pidió.
- **Nota de costo:** *Pro* es el nivel más caro y *High thinking* aumenta tokens y latencia. Si el objetivo es economía, cambia `MODEL` a **`gemini-3.1-flash`** o **`gemini-3.1-flash-lite`** y/o baja `THINKING_LEVEL` a `low` en `worker.js`, y vuelve a desplegar.
- `MAX_OUTPUT_TOKENS` (2048) limita la respuesta visible. Con pensamiento alto, si notas respuestas cortadas, súbelo o baja el nivel de pensamiento.
- **Nosotros pagamos** el consumo de todos los clientes.

## Detalles técnicos de la llamada

- Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/<MODEL>:generateContent`
- Autenticación: header `x-goog-api-key: <GEMINI_API_KEY>`
- El Worker traduce el contrato de la app al formato Gemini: `role:'assistant'` → `role:'model'`, el contexto del negocio va en `system_instruction`, y extrae el texto de `candidates[0].content.parts` (ignorando las partes de razonamiento).

## Contrato de la API (app ↔ proxy)

**Request** `POST /`
```json
{
  "messages": [{ "role": "user", "content": "Cotiza un pastel de chocolate para 20 personas" }],
  "context": "Negocio: ...\nTamaños: ...\nInsumos: ..."
}
```

**Response** `200`
```json
{ "reply": "Texto de la respuesta del asistente" }
```
En caso de error devuelve un código distinto de 200 con `{ "error": "..." }`.

## Pendientes (siguientes rebanadas)

- **Límites por cliente / anti-abuso:** hoy cualquiera con la URL puede consumir tokens. Antes de un lanzamiento real conviene agregar `ALLOWED_ORIGIN` y/o un token compartido y límite de uso.
- **Tool-use:** que el agente llene el cotizador y guarde el pedido en la agenda (Rebanadas 2 y 3).
