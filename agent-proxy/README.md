# Agente IA — Proxy (Cloudflare Worker)

Este proxy es el intermediario entre la app **Pastelia** (`index.html`) y la API de Claude (Anthropic).

**Por qué existe:** la clave del modelo la manejamos nosotros, no los clientes. Una clave centralizada **no puede** vivir en el navegador (cualquiera podría verla en el código fuente y gastar en nuestra cuenta). Por eso vive aquí, como *secreto del servidor*. La app solo conoce la **URL** del proxy, que no es sensible.

```
[ App / index.html ]  --POST-->  [ Cloudflare Worker (esta clave) ]  --->  [ API de Claude ]
     (sin clave)                        (guarda ANTHROPIC_API_KEY)
```

## Despliegue (dashboard, sin instalar nada)

1. Entra a **Cloudflare → Workers & Pages → Create → Worker**.
2. Reemplaza el código por el de [`worker.js`](./worker.js) y pulsa **Deploy**.
3. En **Settings → Variables and Secrets** agrega:
   - **Secret** `ANTHROPIC_API_KEY` = tu clave de Anthropic (`sk-ant-...`).
   - *(Opcional, recomendado en producción)* **Variable** `ALLOWED_ORIGIN` = el dominio de tu app (p. ej. `https://tupasteleria.com`). Restringe quién puede usar el proxy.
4. Copia la URL del Worker (algo como `https://pastelia-agente.tucuenta.workers.dev`).
5. En `index.html`, pega esa URL en la constante:
   ```js
   var AGENT_PROXY_URL = 'https://pastelia-agente.tucuenta.workers.dev';
   ```
6. Recarga la app y abre el botón **Agente IA** (esquina inferior derecha).

## Contrato de la API

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

## Modelo y costo

- Por defecto usa `claude-opus-5` (el más capaz). **Nosotros pagamos** el consumo de todos los clientes.
- Para reducir costo/latencia, cambia la constante `MODEL` en `worker.js` a `claude-sonnet-5` o `claude-haiku-4-5` y vuelve a desplegar.
- `MAX_TOKENS` limita el largo de cada respuesta (por defecto 1024).

## Pendientes (siguientes rebanadas)

- **Límites por cliente / anti-abuso:** hoy cualquiera con la URL puede consumir tokens. Antes de un lanzamiento real conviene agregar `ALLOWED_ORIGIN` y/o un token compartido y límite de uso.
- **Tool-use:** que el agente llene el cotizador y guarde el pedido en la agenda (Rebanadas 2 y 3).
