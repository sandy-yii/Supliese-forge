---
name: auditoria-google-ads
description: Auditoría completa de cuentas de Google Ads (una o varias del mismo cliente) y plan de reestructura basado en sus datos — medición y conversiones, presupuesto por campaña, concordancias, términos de búsqueda, negativas, competencia, canibalización entre cuentas, segmentación, anuncios rechazados y llamadas — con un analizador que procesa las exportaciones CSV de la interfaz (en español o inglés) o de un script de extracción de solo lectura. Úsala siempre que alguien pida auditar, revisar, diagnosticar o "ver qué hizo mal la agencia anterior" en Google Ads, preparar un plan de palabras clave y presupuesto a partir de datos reales, revisar por qué sube el costo por conversión, repartir territorio entre varias cuentas, o subir informes de términos de búsqueda, palabras clave, campañas o historial de cambios, aunque no diga "auditoría". También para Google Ads audits in English.
---

# Auditoría de Google Ads

Esta skill convierte las exportaciones de una o varias cuentas de Google Ads en:

- un diagnóstico con cifras verificables;
- un plan de reestructura que el cliente pueda aprobar.

Nace de un caso real: cinco cuentas de un mismo grupo, con medición inflada, presupuesto repartido al revés y cuentas que competían entre sí. `references/caso-supliese.md` resume ese caso y lo que la primera auditoría no revisó.

La regla central es **separar lo medido de lo estimado**. Un cliente que duda del método (por ejemplo, "¿de verdad solo se cobra el clic?") confía cuando cada cifra se puede rastrear hasta un informe. La confianza se cae con un número inventado o un porcentaje sacado sin decir de dónde.

## Límites de seguridad

La auditoría es **solo lectura**:

- No pausar, activar, editar ni borrar nada en las cuentas, aunque se tenga acceso de administrador y aunque parezca obvio. Cada cambio lo autoriza el cliente, cuenta por cuenta.
- Si se navega la cuenta con la extensión de Chrome u otro navegador, el encargo debe incluir este texto: *"No modifiques, pauses, actives ni edites absolutamente nada dentro de las cuentas. Solo navegar, configurar vistas, descargar y capturar. Si algo te pide confirmar un cambio, detente y pregúntame."*
- En el plan, lo viejo se **pausa, nunca se borra**: pausar se revierte y conserva el historial.
- Los correos de usuarios que aparecen en el historial de cambios son datos del cliente. Úsalos para el diagnóstico de gestión y no los copies a lugares públicos.

## Flujo de trabajo

### 1. Alcance

Antes de pedir datos, aclara lo que los números no dicen:

- Las cuentas y sus IDs, y qué acceso hay en cada una (administrador, lectura o ninguno).
- El periodo. Conviene el mismo en todas las cuentas; si no se puede, decláralo.
- Qué vende cada cuenta y a quién, y si comparten producto o zona. De eso depende el reparto de territorio.
- **Qué cuenta como cliente real** para el negocio: prospecto calificado, llamada de cierta duración, venta. Si existe un CRM, cuál es y quién lo lleva.
- Hay algo que no se puede preguntar en la primera junta y se descubre en los datos: si lo que hoy se cuenta como conversión de verdad lo es.

### 2. Datos

Hay dos caminos. Los dos se detallan en `references/exportaciones.md`.

- **Exportaciones de la interfaz.** Términos de búsqueda, palabras clave, campañas (mensual), grupos, historial de cambios, acciones de conversión, entre otras. Una carpeta por cuenta.
- **Script de extracción** (`assets/extraccion-google-ads.js`). Se pega en Google Ads > Scripts y vuelca 19 informes de todas las cuentas de un MCC a una hoja. Incluye lo que la interfaz esconde: negativas ya cargadas, anuncios rechazados, tipo de segmentación geográfica, redes, páginas de destino y llamadas. Solo consulta; no cambia nada.

Pide **las dos cosas cuando se pueda**: el script cubre la configuración, y la interfaz cubre el historial de cambios largo (la API solo da 30 días).

### 3. Análisis automático

1. Copia `assets/config-ejemplo-lavanderia.json` y adáptalo al giro del cliente: marcas propias, competidores, temas de intención y patrones de negativas.
2. Para armar los temas, mira primero los 50 términos con más gasto. Los temas buenos separan intenciones que convierten distinto (precio, capacidad, sector, marca, servicio), no solo productos.
3. Corre el analizador:

```bash
python scripts/auditar.py --datos <carpeta> --config <config.json> --salida <carpeta-salida>
```

**Qué entrega:**

- `informe.md`, con las cifras por cuenta y la canibalización entre cuentas.
- `hallazgos.json`, con los mismos datos estructurados.
- `negativas_a_revisar.csv`, `keywords_candidatas.csv` y `canibalizacion_cuentas.csv`.

**Antes de usar las cifras:**

- Revisa la línea "Archivos que el análisis automático no usa". Si ahí aparece un informe importante, el formato cambió: ajusta los alias de columnas en `ALIAS`, dentro del script.
- Compara el gasto total contra lo que muestra la interfaz. Si no cuadra, algo se leyó mal (separador decimal, filas de totales). No sigas hasta que cuadre.

### 4. Revisión con criterio

El script mide; el criterio lo pones tú. Recorre `references/checklist.md` en su orden: **medición primero**, porque si la conversión está mal definida, todos los CPA del informe están mal y cualquier reasignación se apoya en arena.

**Reglas de lectura que evitan errores comunes:**

- **Un CPA con menos de 5 conversiones (marcado ⚠) no basta** para subir ni bajar una línea por sí solo. Dilo como "muestra chica".
- **Los porcentajes de términos son sobre el gasto visible.** El informe de términos oculta las búsquedas de bajo volumen, y la columna "Términos visibles" dice cuánto cubre.
- **El CPA reportado no es el costo por cliente** si la conversión principal es un clic o una apertura de chat. Cuando haya CRM, calcula el costo por prospecto calificado real y pon los dos números lado a lado.
- **Separa marca propia de genérico.** La marca convierte barato y maquilla el promedio.
- **Una negativa candidata no es una negativa decidida.** Que un término gastara sin convertir puede deberse a cómo Google reparte conversiones entre variantes. Antes de excluirlo, revisa su intención.

### 5. Varias cuentas: territorio

Si el cliente tiene más de una cuenta, la canibalización suele ser el hallazgo más caro. El script calcula, para cada par de cuentas, los términos idénticos y el gasto que cada una pone en ellos.

La explicación correcta para el cliente:

- **Si Google trata las cuentas como anunciantes distintos,** se suben el CPC entre ellas.
- **Si las trata como el mismo negocio,** su política de "ventaja injusta" solo deja salir un anuncio por subasta y Google elige cuál.

En ambos casos la solución es **asignar cada intención a una sola cuenta** y que las demás la carguen como negativa. El reparto (por producto, por zona, por capacidad o por tipo de comprador) es una decisión comercial del cliente: preséntalo como opciones, no como hecho.

### 6. Del diagnóstico al plan

Sigue `references/plan-y-presentacion.md`. Ahí están:

- las reglas de reasignación de presupuesto;
- el arranque en paralelo;
- la puja inicial;
- las etiquetas *Plan* y *Opción* para las palabras clave;
- la estructura de seis decisiones para la junta con el cliente.

Para la cadena de medición con un CRM (HighLevel u otro), WhatsApp y llamadas, lee `references/medicion-highlevel.md`.

### 7. Entregables

Por defecto, entrega lo siguiente y ajústalo a lo que pida la persona:

1. **Resumen ejecutivo.** Una página por cuenta: dónde están parados, qué estuvo bien, los hallazgos ordenados por dinero, qué proponemos.
2. **Hallazgos con evidencia.** Cada uno con su cifra, el informe del que sale y el periodo.
3. **Plan por cuenta.** Incluye:
   - el presupuesto actual contra el propuesto;
   - las palabras clave por campaña, con su origen (*Plan* = sale del análisis; *Opción* = sugerencia sin historial);
   - las negativas y el territorio;
   - la medición;
   - el calendario por semana.
4. **Lista de pendientes.** Lo que falta de datos y lo que debe decidir el cliente.

**Escribe para quien decide, no para quien opera:**

- Frases cortas, cifras en la moneda local, sin jerga sin explicar ("CPA" la primera vez es "costo por conversión").
- Cuando un número es estimación (por ejemplo, "con este cambio habría habido unas 6 conversiones más"), escribe **estimado** y di de qué supuesto sale.
