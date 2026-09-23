import 'dotenv/config';
import { TypeSafeClient, noul, choice, score } from '@typesafe-ai/sdk';
import fs from 'fs';

const client = new TypeSafeClient(); // Lee TYPESAFE_API_KEY desde .env

async function main() {
  const args = process.argv.slice(2);
  const input = args.join(' ');

  if (!input) {
    console.error('❌ Por favor, proporciona una idea, descripción de mejora o contexto a evaluar.');
    console.error('Ejemplo: node jev.mjs "Refactorizar el cotizador para usar web workers"');
    process.exit(1);
  }

  console.log(`🤖 Jev está analizando la propuesta...\n"${input}"\n`);

  try {
    const { answers, model, usage } = await client.systemOne({
      state: {
        propuesta_proyecto: input,
        contexto_actual: "Pastelia es una PWA de cotización de pasteles. MVP completado usando localStorage (Vanilla JS). Futuro: SaaS Full-Stack con Backend en Node/Python y bases de datos reales."
      },
      questions: {
        tipo_accion: choice('¿Qué tipo de iniciativa es esta propuesta?', {
          refactor: 'Mejora interna de código sin cambiar funcionalidad (ej. limpiar código, optimizar).',
          feature: 'Nueva funcionalidad para el usuario.',
          bugfix: 'Corrección de un error o problema existente.',
          arquitectura: 'Cambio importante en la infraestructura (bases de datos, proxy, integraciones externas como Meta API).'
        }),
        impacto: score('¿Qué tanto valor estratégico aporta esta propuesta al proyecto (0 al 1)?', [
          '0 - Ningún valor real / Innecesario',
          '0.5 - Valor medio / Nice to have',
          '1 - Crítico o altísimo valor para el modelo SaaS'
        ]),
        complejidad: score('¿Qué tan compleja es de implementar (0 al 1)?', [
          '0 - Trivial, toma un par de horas como máximo',
          '0.5 - Moderada, toma varios días',
          '1 - Muy compleja, requiere semanas o un rediseño profundo'
        ]),
        requiere_backend: noul('¿Esta iniciativa OBLIGA a dejar el localStorage y depender de un backend/base de datos real en la nube?')
      },
    });

    console.log('📊 RESULTADOS DE LA AUDITORÍA DE JEV:');
    console.log('--------------------------------------------------');
    console.log(`🏷️  Tipo de Acción:   ${answers.tipo_accion.choice.toUpperCase()} (Confianza: ${(answers.tipo_accion.confidence * 100).toFixed(1)}%)`);
    console.log(`🚀 Impacto (0-10):   ${(answers.impacto.score * 10).toFixed(1)}/10`);
    console.log(`🧠 Complejidad(0-10):${(answers.complejidad.score * 10).toFixed(1)}/10`);
    console.log(`💾 Requiere Backend: ${answers.requiere_backend.noul >= 0.5 ? 'SÍ 🔴' : 'NO 🟢'} (Probabilidad: ${(answers.requiere_backend.noul * 100).toFixed(1)}%)`);
    console.log('--------------------------------------------------');
    
    const impactoNum = answers.impacto.score * 10;
    const complejidadNum = answers.complejidad.score * 10;
    
    console.log('💡 RECOMENDACIÓN ESTRATÉGICA:');
    if (impactoNum >= 7 && complejidadNum <= 4) {
      console.log('✅ QUICK WIN: Alto impacto y baja complejidad. ¡Impleméntalo de inmediato!');
    } else if (impactoNum >= 7 && complejidadNum > 4) {
      console.log('📈 PROYECTO ESTRATÉGICO: Alto impacto pero requiere esfuerzo. Planifícalo paso a paso.');
    } else if (impactoNum < 7 && complejidadNum <= 4) {
      console.log('🛠️ TAREA DE MANTENIMIENTO: Fácil de hacer, pero no es prioridad urgente.');
    } else {
      console.log('⚠️ POZO DE TIEMPO: Baja prioridad y mucha complejidad. Reevalúa si realmente se necesita ahora.');
    }

    console.log(`\n(Tokens usados: In ${usage.input_tokens} | Out ${usage.output_tokens} | Model: ${model})`);

  } catch (error) {
    console.error('❌ Ocurrió un error al consultar a Jev:', error.message);
  }
}

main();
