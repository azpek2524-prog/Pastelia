/*
 * Pastelia — Proxy del Agente IA (Cloudflare Worker) · Backend: Google Gemini + Jev (TypeSafe)
 * --------------------------------------------------------------------------
 * La app (index.html) NUNCA guarda las claves. Solo habla con este proxy, que
 * guarda las claves como SECRETOS del servidor y hace de intermediario.
 *
 * Rutas:
 *   POST /         -> Chat del Agente IA.  { messages, context } -> { reply, toolCall }
 *   POST /triage   -> Triage de mensajes.  { mensaje, context }  -> { intencion, urgencia, ... }
 *
 * Despliegue rápido (dashboard de Cloudflare):
 *   1. Workers & Pages > Create > Worker > pega este archivo > Deploy.
 *   2. Settings > Variables and Secrets:
 *        - Secret  GEMINI_API_KEY    = clave de Google AI Studio (Gemini API).
 *        - Secret  TYPESAFE_API_KEY  = clave de TypeSafe (para Jev, ruta /triage).
 *        - (opcional) Variable ALLOWED_ORIGIN = https://tu-dominio  (recomendado
 *          en producción para que solo tu app pueda usar el proxy).
 *   3. Copia la URL del Worker (https://xxx.workers.dev) y pégala en index.html
 *      en la constante AGENT_PROXY_URL.
 *
 * Arquitectura del triage (ver JEV.md): Jev JUZGA (clasifica intención, fecha,
 * urgencia), el CÓDIGO enruta, y Gemini REDACTA el texto de la respuesta.
 */

const MODEL = 'gemini-3.1-pro-preview';   // económico: 'gemini-3.1-flash' o 'gemini-3.1-flash-lite'
const THINKING_LEVEL = 'high';            // 'high' (default en Gemini 3) | 'low'. Menos pensamiento = más barato/rápido.
const MAX_OUTPUT_TOKENS = 2048;           // tope de la respuesta visible
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';

const BASE_SYSTEM = [
  'Eres el asistente de cotizacion de una pasteleria, integrado en la app Pastelia.',
  'Ayudas a la duena a cotizar pasteles y a resolver dudas de precios usando EXCLUSIVAMENTE los datos del negocio que se te entregan.',
  'Responde en espanol, breve y claro. No inventes precios, insumos ni tamanos que no esten en los datos; si falta informacion, dilo y sugiere que registrar.',
  'Cuando estimes un costo, explica en una linea como lo calculaste: (insumos + mano de obra) escalados por el multiplicador del tamano, mas los extras (costo fijo), y al final el margen de ganancia.',
  'IMPORTANTE: SI tienes la capacidad de crear pedidos directamente en la app usando la herramienta crear_pedido_directo. Nunca digas que no puedes crear pedidos ni que la duena debe hacerlo manualmente.',
  'En cuanto tengas al menos el nombre del cliente y el tamano (idealmente tambien la receta/sabor, la fecha y los extras), LLAMA a la herramienta crear_pedido_directo con esos datos. NO pidas confirmacion por texto: la app mostrara un resumen con el precio estimado y la duena confirmara o cancelara ahi. Si falta el nombre del cliente o el tamano, pidelos primero (esos si por texto).',
  'Usa los nombres de tamanos, recetas y extras EXACTAMENTE como aparecen en los datos del negocio.'
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

// ===== Jev (TypeSafe) — clasificador de mensajes de clientes =====
// Contrato REST derivado del SDK oficial @typesafe-ai/sdk (POST /v1/systemone,
// Authorization: Bearer). Los primitivos se serializan como { type, instructions, criteria }.
const TYPESAFE_URL = 'https://api.typesafe.ai/v1/systemone';
const JEV_QUESTIONS = {
  intencion: {
    type: 'choice',
    instructions: '¿Qué quiere principalmente el cliente con este mensaje?',
    criteria: {
      cotizacion: 'Pide precio, quiere encargar o cotizar un pastel o producto.',
      duda: 'Pregunta información (sabores, horarios, ubicación, disponibilidad) sin pedir precio ni encargar.',
      pago: 'Quiere pagar, pregunta cómo/dónde pagar, o manda un comprobante de pago.',
      queja: 'Reclama o reporta un problema con un pedido, un cobro o el servicio.'
    }
  },
  menciona_fecha: {
    type: 'noul',
    instructions: '¿El mensaje menciona una fecha, un día o un plazo para el pedido o la entrega?'
  },
  urgencia: {
    type: 'score',
    instructions: '¿Qué tan urgente es atender este mensaje?',
    criteria: [
      'Nada urgente: solo curiosea o hace una pregunta general sin prisa.',
      'Media: quiere respuesta hoy, pero sin una fecha límite muy cercana.',
      'Alta: lo necesita muy pronto, es para una fecha inminente, o está molesto.'
    ]
  }
};

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

// Llama a Gemini y devuelve { reply, toolCall } o { error, status }. Compartida por
// el chat (/) y por el triage (/triage) para no duplicar la integración del modelo.
async function callGemini(env, contents, context) {
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
    return { error: 'No se pudo contactar al modelo: ' + e.message, status: 502 };
  }

  const data = await resp.json().catch(function () { return null; });
  if (!resp.ok) {
    const msg = (data && data.error && data.error.message) ? data.error.message : ('Error ' + resp.status);
    return { error: msg, status: resp.status };
  }
  if (data && data.promptFeedback && data.promptFeedback.blockReason) {
    return { error: 'Solicitud bloqueada por seguridad (' + data.promptFeedback.blockReason + ').', status: 200 };
  }

  const cand = data && Array.isArray(data.candidates) ? data.candidates[0] : null;
  const parts = cand && cand.content && Array.isArray(cand.content.parts) ? cand.content.parts : [];

  let toolCall = null;
  const reply = parts
    .filter(function (p) {
      if (p.functionCall) toolCall = { name: p.functionCall.name, args: p.functionCall.args };
      return p && p.thought !== true && typeof p.text === 'string';
    })
    .map(function (p) { return p.text; })
    .join('')
    .trim();

  if (!reply && !toolCall && cand && cand.finishReason === 'MAX_TOKENS') {
    return { error: 'La respuesta se cortó por el límite de tokens; sube MAX_OUTPUT_TOKENS o baja el nivel de pensamiento.', status: 200 };
  }

  return { reply: reply || '(sin respuesta)', toolCall: toolCall };
}

// Llama a Jev (TypeSafe) para clasificar un mensaje. Devuelve { answers, usage } o { error, status }.
async function runTriage(env, mensaje, context) {
  const body = {
    state: {
      mensaje_cliente: String(mensaje).slice(0, 4000),
      contexto_negocio: context ? String(context).slice(0, 8000) : ''
    },
    questions: JEV_QUESTIONS
  };

  let resp;
  try {
    resp = await fetch(TYPESAFE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + env.TYPESAFE_API_KEY
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    return { error: 'No se pudo contactar a Jev: ' + e.message, status: 502 };
  }

  const data = await resp.json().catch(function () { return null; });
  if (!resp.ok) {
    const msg = (data && data.error && (data.error.message || data.error)) || (data && data.message) || ('Error ' + resp.status);
    return { error: String(msg), status: resp.status };
  }
  return { answers: (data && data.answers) ? data.answers : {}, usage: (data && data.usage) || null };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return json({ error: 'Método no permitido' }, 405, headers);

    // Validación anti-abuso (ROADMAP Rebanada 3): si hay ALLOWED_ORIGIN, exige que el
    // origen coincida. Aplica a todas las rutas.
    if (env.ALLOWED_ORIGIN && origin && !origin.includes(env.ALLOWED_ORIGIN) && env.ALLOWED_ORIGIN !== '*') {
      return json({ error: 'Origen no autorizado' }, 403, headers);
    }

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'JSON inválido' }, 400, headers); }

    const path = (function () { try { return new URL(request.url).pathname; } catch (e) { return '/'; } })();

    // ============================================================
    // Rebanada 1 — Triage de mensajes: Jev clasifica -> el código enruta -> Gemini redacta.
    // ============================================================
    if (path.endsWith('/triage')) {
      if (!env.TYPESAFE_API_KEY) return json({ error: 'Falta configurar TYPESAFE_API_KEY en el servidor.' }, 500, headers);
      const mensaje = (body && typeof body.mensaje === 'string') ? body.mensaje.trim() : '';
      const context = (body && typeof body.context === 'string') ? body.context : '';
      if (!mensaje) return json({ error: 'Falta el mensaje del cliente' }, 400, headers);

      const t = await runTriage(env, mensaje, context);
      if (t.error) return json({ error: 'Jev: ' + t.error }, t.status || 502, headers);

      const a = t.answers || {};
      const intencion = (a.intencion && a.intencion.choice) ? a.intencion.choice : 'duda';
      const confianza = (a.intencion && typeof a.intencion.confidence === 'number') ? a.intencion.confidence : null;
      const mencionaFecha = (a.menciona_fecha && typeof a.menciona_fecha.noul === 'number') ? a.menciona_fecha.noul : 0;
      const urgencia = (a.urgencia && typeof a.urgencia.score === 'number') ? a.urgencia.score : 0;

      // El código enruta: en cotización o cuando menciona fecha, Gemini redacta la
      // respuesta y puede proponer crear el pedido. En otros casos también redacta un
      // borrador para que la dueña conteste, pero la etiqueta ayuda a priorizar.
      let respuesta = '';
      let toolCall = null;
      let aviso = null;
      if (env.GEMINI_API_KEY) {
        const g = await callGemini(env, [{ role: 'user', parts: [{ text: mensaje }] }], context);
        if (g.error) { aviso = g.error; } else { respuesta = g.reply; toolCall = g.toolCall || null; }
      } else {
        aviso = 'GEMINI_API_KEY no está configurada: se devuelve solo la clasificación de Jev (sin respuesta redactada).';
      }

      return json({
        intencion: intencion,
        confianza: confianza,
        menciona_fecha: mencionaFecha,
        urgencia: urgencia,
        respuesta_sugerida: respuesta,
        toolCall: toolCall,
        aviso: aviso,
        usage: t.usage || null
      }, 200, headers);
    }

    // ============================================================
    // Chat del Agente IA (contrato existente, sin cambios).
    // ============================================================
    if (!env.GEMINI_API_KEY) return json({ error: 'Falta configurar GEMINI_API_KEY en el servidor.' }, 500, headers);

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

    const g = await callGemini(env, contents, context);
    if (g.error) return json({ error: g.error }, g.status || 502, headers);
    return json({ reply: g.reply, toolCall: g.toolCall || null }, 200, headers);
  }
};
