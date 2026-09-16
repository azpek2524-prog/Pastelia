# Roadmap y Estado del Proyecto: Pastelia Core

> Documento de estado actualizado el 16 de septiembre de 2026.
> **Propósito:** Mantener el registro exacto de dónde nos quedamos para retomar el desarrollo sin perder contexto.

## Estado Actual — Funcionalidad Core 100% Terminada

> **Etapa 1 concluida.** La funcionalidad central de la aplicación (MVP) está **100% terminada y validada**. Pastelia opera de forma completa como PWA de una sola página (Vanilla JS + `localStorage`, sin librerías externas) para cotizar, agendar y gestionar pedidos con marca blanca.

Se ejecutó exitosamente el **Refactor Ultracode** con las siguientes implementaciones integradas y validadas:
1. Parche de reactividad en el Dashboard (actualización instantánea al registrar pagos/entregas).
2. Compresión de imágenes vía HTML5 Canvas para Logo, Cotizador y Recetas, solucionando los errores de cuota en `localStorage`.
3. Expansión de campos en "Mi negocio" (Nombre y Título del dueño) y reubicación del modo Dark/Light.
4. Cobertura total de variables CSS (colores oficiales) para la funcionalidad de Marca Blanca.
5. Reemplazo exitoso de emojis por subida de fotos (comprimidas) en la sección de Recetas.
6. Optimización y limpieza del formato del Ticket de exportación para WhatsApp.
7. Incorporación de acción rápida "Cobrado + Entregado" en la Agenda.
8. Nuevas métricas y minigráfico en HTML/CSS nativo para Ingreso Diario y Semanal en el Dashboard.
9. **Configuración dinámica y personalizable de tamaños de pasteles:** cada pastelería puede editar desde "Mi negocio" el **nombre**, el **multiplicador** (que escala insumos y mano de obra) y las **porciones** de cada tamaño, con alta, baja y restablecer a valores por defecto. Todo respaldado en `localStorage` (`pastelia_sizes`) y consumido en vivo por la función `calc()`, para reflejar correctamente los precios de diferentes pastelerías.

---

## 🚀 Plan de Acción Inmediato (Próxima sesión) — Etapa 2: Agente IA (Tool-Use)

**Objetivo principal:** Implementar **Tool-Use (Function Calling)** para el Agente IA.

La Fase 1 (Rebanada 1) ya está completada: El Agente IA tiene su interfaz en la app, se conecta exitosamente a través de un proxy en Cloudflare Worker usando Gemini 3.1 Pro, y recibe el contexto del negocio (insumos, tamaños, etc.) para conversar.

**Siguientes pasos (Rebanadas 2 y 3):**
Darle al Agente la capacidad de interactuar activamente con Pastelia:
- [ ] **Llenar Cotizador Automáticamente:** Definir las herramientas (tools) en el proxy de Gemini para que el Agente pueda interpretar la solicitud del cliente (ej. "pastel para 20 personas") y pre-llenar los campos del cotizador en la app.
- [ ] **Guardar en la Agenda:** Permitir que el Agente guarde un pedido confirmado directamente en la agenda de pedidos.
- [ ] **Límites / Anti-abuso:** Implementar validaciones en el Worker (CORS origin o token) antes de un lanzamiento a producción.

### Historial de la Etapa 2.1 (completado)
- [x] **Refactor de UI:** "Mis Precios" reubicado a "Mi Negocio". Botón del Agente IA anclado en la esquina inferior derecha.
- [x] **Backend Proxy:** Cloudflare Worker desplegado y funcional con clave API de Gemini protegida. URL del proxy vinculada en `index.html`.


### Historial de la Etapa 1 (completado)

#### Conexiones y "Cables" Finales
- [x] **Inventario Dinámico:** el cotizador toma los precios directamente del array de `pastelia_insumos` y no de costos base fijos.
- [x] **Recetario Dinámico:** al guardar una receta nueva, aparece inmediatamente en el desplegable de cotización.

#### Seguridad y Exportación
- [x] **Sistema de Backup:** botones para Exportar/Importar los datos de `localStorage` como un archivo `.json` para evitar pérdida de datos si se borra la caché.

---

## 🔮 Visión a Futuro: Pastelia PRO (SaaS)

* **Arquitectura:** Migrar a aplicación Full-Stack (Backend en Node/Python + Base de Datos Real).
* **Agente IA:** Conectar un Agente a las APIs de WhatsApp e Instagram que atienda DMs, cotice de forma autónoma, y guarde los pedidos automáticamente en la agenda.
* **Modelo de Negocio:** Suscripción mensual para cubrir costos de servidor y tokens del LLM.
