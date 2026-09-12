# Roadmap y Estado del Proyecto: Pastelia Core

> Documento de estado actualizado el 12 de septiembre de 2026.
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

## 🚀 Plan de Acción Inmediato (Próxima sesión) — Etapa 2: Integración de Agente IA

**Objetivo principal:** iniciar la **Integración de Agente IA** en Pastelia.

Con la funcionalidad core cerrada, la Etapa 2 arranca preparando la interfaz para dar cabida al Agente IA y definiendo su punto de acceso dentro de la app.

### 1. Refactorización de UI para el Agente IA
- [ ] **Reubicar "Mis Precios":** mover el apartado actual de **"Mis Precios"** —hoy accesible desde la **esquina superior derecha en la vista móvil**— hacia el interior de la categoría **"Mi Negocio"**, junto a Tamaños, Personalización de marca, Apariencia y Respaldo (Backup).
- [ ] **Liberar la esquina superior derecha:** asignar el espacio que deja "Mis Precios" como el nuevo **botón / punto de acceso al "Agente IA"**.
- [ ] **Lógica del Agente IA por definir:** la lógica técnica y de implementación interna del Agente IA (proveedor del LLM, prompts, flujo de datos y conexión con el cotizador y la agenda) **aún está por definirse** y se especificará en su propia sesión de diseño.

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
