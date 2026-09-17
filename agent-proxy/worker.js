/*
 * Pastelia — Proxy del Agente IA (Cloudflare Worker) · Backend: Google Gemini
 * --------------------------------------------------------------------------
 * La app (index.html) NUNCA guarda la clave del modelo. Solo habla con este
 * proxy, que guarda la clave de Gemini como SECRETO del servidor y hace de
 * intermediario con la API de Google (Gemini).
 *
 * Despliegue rápido (dashboard de Cloudflare):
 *   1. Workers & Pages > Create > Worker > pega este archivo > Deploy.
 *   2. Settings > Variables and Secrets:
 *        - Secret  GEMINI_API_KEY  = tu clave de Google AI Studio (Gemini API).
 *        - (opcional) Variable ALLOWED_ORIGIN = https://tu-dominio  (recomendado
 *          en producción para que solo tu app pueda usar el proxy).
 *   3. Copia la URL del Worker (https://xxx.workers.dev) y pégala en index.html
 *      en la constante AGENT_PROXY_URL.
 *
 * Contrato (idéntico sin importar el modelo de atrás):
 *   POST { messages: [{role:'user'|'assistant', content:string}], context: string }
 *   ->   { reply: string }   (o  { error: string }  con código != 200)
 */

const MODEL = 'gemini-3.1-pro-preview';   // económico: 'gemini-3.1-flash' o 'gemini-3.1-flash-lite'
const THINKING_LEVEL = 'high';            // 'high' (default en Gemini 3) | 'low'. Menos pensamiento = más barato/rápido.
const MAX_OUTPUT_TOKENS = 2048;           // tope de la respuesta visible
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';

const BASE_SYSTEM = [
  'Eres el asistente de cotización de una pastelería, integrado en la app Pastelia.',
  'Ayudas a la dueña a cotizar pasteles y a resolver dudas de precios usando EXCLUSIVAMENTE los datos del negocio que se te entregan.',
  'Responde en español, breve y claro. No inventes precios, insumos ni tamaños que no estén en los datos; si falta información, dilo y sugiere qué registrar.',
  'Cuando estimes un costo, explica en una línea cómo lo calculaste: (insumos + mano de obra) escalados por el multiplicador del tamaño, más los extras (costo fijo), y al final el margen de ganancia.',
  'IMPORTANTE: SÍ tienes la capacidad de crear pedidos directamente en la app usando la herramienta crear_pedido_directo. Nunca digas que no puedes crear pedidos ni que la dueña debe hacerlo manualmente.',
  'Cuando el usuario confirme o pida generar un pedido y tengas al menos el nombre del cliente y el tamaño (idealmente también la receta/sabor, la fecha y los extras), LLAMA a la herramienta crear_pedido_directo con esos datos. Si falta el nombre del cliente o el tamaño, pídelos antes de llamar la herramienta.',
  'Usa los nombres de tamaños, recetas y extras EXACTAMENTE como aparecen en los datos del negocio.'
].join(' ');

// Herramienta (function calling) que el frontend ejecuta para crear el pedido en el state y guardarlo.
const TOOLS = [{
  functionDeclarations: [{
    name: 'crear_pedido_directo',
    description: 'Crea y guarda un pedido de pastel en la agenda de la pastelería con los datos indicados por el cliente. Úsala cuando el usuario confirme un pedido.',
    parameters: {
      type: 'object',
      properties: {
        nombre_cliente: { type: 'string', description: 'Nombre de la persona que hace el pedido.' },
        fecha_evento: { type: 'string', description: 'Fecha del evento/entrega en formato ISO YYYY-MM-DD. Si no se indica, déjalo vacío.' },
        nombre_receta: { type: 'string', description: 'Nombre de la receta o sabor del pastel (ej. "Red velvet", "Chocolate"). Usa una de las recetas guardadas si aplica.' },
        tamano: { type: 'string', description: 'Tamaño del pastel, EXACTAMENTE como aparece en los tamaños del negocio (ej. Bento, Petit, Chico, Mediano, Grande, Extra grande).' },
        extras: { type: 'array', items: { type: 'string' }, description: 'Extras de diseño solicitados, con el nombre exacto del catálogo (ej. ["Flores", "Topper"]). Vacío si no hay.' }
      },
      required: ['nombre_cliente', 'tamano']
    }
  }]
}];
const TOOL_CONFIG = { functionCallingConfig: { mode: 'AUTO' } };

function corsHeaders(origin, allowed) {
  // Sin ALLOWED_ORIGIN configurado -> permite cualquier origen (funciona desde file:// y cualquier host).
  // Con ALLOWED_ORIGIN configurado -> restringe a ese dominio.
  const o = (allowed && allowed !== '*') ? allowed : '*';
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
    if (!env.GEMINI_API_KEY) return json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' }, 500, headers);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'JSON inválido' }, 400, headers); }

    const rawMessages = Array.isArray(body && body.messages) ? body.messages : null;
    if (!rawMessages || !rawMessages.length) return json({ error: 'Faltan mensajes' }, 400, headers);
    const context = (body && typeof body.context === 'string') ? body.context : '';

    // Saneo + traducción al formato Gemini: role 'assistant' -> 'model'; texto acotado; máx 20 turnos.
    const contents = rawMessages.slice(-20).map(function (m) {
      const role = (m && m.role === 'assistant') ? 'model' : 'user';
      const text = String(m && m.content != null ? m.content : '').slice(0, 4000);
      return { role: role, parts: [{ text: text }] };
    }).filter(function (c) { return c.parts[0].text; });
    if (!contents.length) return json({ error: 'Mensajes vacíos' }, 400, headers);

    const systemText = BASE_SYSTEM + (context ? ('\n\nDatos del negocio (usa solo esto):\n' + context.slice(0, 12000)) : '');

    const payload = {
      system_instruction: { parts: [{ text: systemText }] },
      contents: contents,
      tools: TOOLS,
      toolConfig: TOOL_CONFIG,
      generationConfig: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        thinkingConfig: { thinkingLevel: THINKING_LEVEL }
      }
    };

    let resp;
    try {
      resp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      return json({ error: 'No se pudo contactar al modelo: ' + e.message }, 502, headers);
    }

    const data = await resp.json().catch(function () { return null; });
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) ? data.error.message : ('Error ' + resp.status);
      return json({ error: msg }, resp.status, headers);
    }

    // Bloqueo por seguridad / prompt sin candidatos.
    if (data && data.promptFeedback && data.promptFeedback.blockReason) {
      return json({ error: 'Solicitud bloqueada por seguridad (' + data.promptFeedback.blockReason + ').' }, 200, headers);
    }

    const cand = data && Array.isArray(data.candidates) ? data.candidates[0] : null;
    const parts = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts : [];
    const reply = parts
      .filter(function (p) { return p && p.thought !== true && typeof p.text === 'string'; })
      .map(function (p) { return p.text; })
      .join('')
      .trim();

    // ¿El modelo pidió ejecutar una herramienta? (function calling)
    let toolCall = null;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] && parts[i].functionCall && parts[i].functionCall.name) {
        toolCall = { name: parts[i].functionCall.name, args: parts[i].functionCall.args || {} };
        break;
      }
    }

    if (toolCall) {
      // Si hay tool call, el frontend ejecuta la acción; el texto es opcional.
      return json({ reply: reply, toolCall: toolCall }, 200, headers);
    }
    if (!reply && cand && cand.finishReason === 'MAX_TOKENS') {
      return json({ error: 'La respuesta se cortó por el límite de tokens; sube MAX_OUTPUT_TOKENS o baja el nivel de pensamiento.' }, 200, headers);
    }
    return json({ reply: reply || '(sin respuesta)' }, 200, headers);
  }
};
