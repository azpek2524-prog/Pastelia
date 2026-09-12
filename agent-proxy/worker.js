/*
 * Pastelia — Proxy del Agente IA (Cloudflare Worker)
 * ---------------------------------------------------
 * La app (index.html) NUNCA guarda la clave del modelo. Solo habla con este
 * proxy, que guarda la clave de Anthropic como SECRETO del servidor y hace de
 * intermediario con la API de Claude.
 *
 * Despliegue rápido (dashboard de Cloudflare):
 *   1. Workers & Pages > Create > Worker > pega este archivo > Deploy.
 *   2. Settings > Variables and Secrets:
 *        - Secret  ANTHROPIC_API_KEY  = tu clave de Anthropic (sk-ant-...).
 *        - (opcional) Variable ALLOWED_ORIGIN = https://tu-dominio  (recomendado
 *          en producción para que solo tu app pueda usar el proxy).
 *   3. Copia la URL del Worker (https://xxx.workers.dev) y pégala en index.html
 *      en la constante AGENT_PROXY_URL.
 *
 * Contrato:
 *   POST { messages: [{role:'user'|'assistant', content:string}], context: string }
 *   ->   { reply: string }   (o  { error: string }  con código != 200)
 */

const MODEL = 'claude-opus-5';   // el mas capaz. Para bajar costo/latencia: 'claude-sonnet-5' o 'claude-haiku-4-5'.
const MAX_TOKENS = 1024;
const ANTHROPIC_VERSION = '2023-06-01';

const BASE_SYSTEM = [
  'Eres el asistente de cotización de una pastelería, integrado en la app Pastelia.',
  'Ayudas a la dueña a cotizar pasteles y a resolver dudas de precios usando EXCLUSIVAMENTE los datos del negocio que se te entregan.',
  'Responde en español, breve y claro. No inventes precios, insumos ni tamaños que no estén en los datos; si falta información, dilo y sugiere qué registrar.',
  'Cuando estimes un costo, explica en una línea cómo lo calculaste: (insumos + mano de obra) escalados por el multiplicador del tamaño, más los extras (costo fijo), y al final el margen de ganancia.'
].join(' ');

function corsHeaders(origin, allowed) {
  const o = (allowed && allowed !== '*') ? allowed : (origin || '*');
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ 'Content-Type': 'application/json' }, headers)
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405, headers);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'Falta configurar ANTHROPIC_API_KEY en el servidor.' }, 500, headers);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'JSON inválido' }, 400, headers); }

    const rawMessages = Array.isArray(body && body.messages) ? body.messages : null;
    if (!rawMessages || !rawMessages.length) return json({ error: 'Faltan mensajes' }, 400, headers);
    const context = (body && typeof body.context === 'string') ? body.context : '';

    // Saneo: solo role user/assistant y contenido de texto acotado; máximo 20 turnos.
    const messages = rawMessages.slice(-20).map(function (m) {
      return {
        role: (m && m.role === 'assistant') ? 'assistant' : 'user',
        content: String(m && m.content != null ? m.content : '').slice(0, 4000)
      };
    }).filter(function (m) { return m.content; });
    if (!messages.length) return json({ error: 'Mensajes vacíos' }, 400, headers);

    const system = BASE_SYSTEM + (context ? ('\n\nDatos del negocio (usa solo esto):\n' + context.slice(0, 12000)) : '');

    let resp;
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': ANTHROPIC_VERSION
        },
        body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, system: system, messages: messages })
      });
    } catch (e) {
      return json({ error: 'No se pudo contactar al modelo: ' + e.message }, 502, headers);
    }

    const data = await resp.json().catch(function () { return null; });
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) ? data.error.message : ('Error ' + resp.status);
      return json({ error: msg }, resp.status, headers);
    }

    const reply = (data && Array.isArray(data.content))
      ? data.content.filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('\n').trim()
      : '';
    return json({ reply: reply || '(sin respuesta)' }, 200, headers);
  }
};
