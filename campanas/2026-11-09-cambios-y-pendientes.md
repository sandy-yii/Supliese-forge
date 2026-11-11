# Cambios del 9 nov y lo que queda pendiente

**Fuente:** vista previa de `campanas/salida/cambios-del-9-nov-todas-las-cuentas.js`, corrida en las 5 cuentas entre las 16:18 y las 16:19.

## OK para Ejecutar hoy

| Cuenta | Paso 2 del presupuesto | Acciones viejas a secundarias | Apagar Display en búsqueda | Un contacto por clic |
|---|---|---|---|---|
| Laundry Solutions | sí | sí (11) | **sí** (2 campañas) | ya estaba en «Una» |
| Quick Laundry | sí (Emprendimiento $20 → $17) | sí (13) | **sí** (Equipo) | ya estaba en «Una» |
| Kingstar | sí (freno en Alta capacidad y Hotelera) | sí (8) | **NO todavía**: `HACER_DISPLAY = false` | ya estaba en «Una» |
| Girbau | solo el tope ($21 → $23) | solo se muestra | no tiene Display | solo se muestra |
| Gamesail | sí (Secadoras en espera) | no tiene | no tiene | ya estaba en «Una» |

### Lo que dio Display en 30 días (10 oct–8 nov)

| Cuenta | Display | Búsqueda | Decisión |
|---|---|---|---|
| Laundry Solutions | 282 clics · $1,042 · 4 contactos ($260 c/u) | 147 clics · $1,871 · 12 contactos ($156 c/u) | Se apaga: es más caro y se come el presupuesto de la búsqueda |
| Quick Laundry | 17 clics · $34 · 0 contactos | 449 clics · $3,957 · 79 contactos | Se apaga: no aporta nada |
| Kingstar | 369 clics · $1,915 · 11 contactos ($174 c/u) | 376 clics · $6,235 · 25 contactos ($249 c/u) | **Espera el conteo de Jorge** |

En Kingstar, Display sale **más barato por contacto que la búsqueda**. Pero esos contactos son de madrugada y el 5 nov Jorge anotó 1 contra 4 de Google.
- Si Jorge confirma que le llegan → Display se queda.
- Si no le llegan → se apaga.

## Hipótesis que NO se confirmó

Todas las acciones «AB · …» **ya cuentan «Una» por clic**. No hay toques repetidos.

Lo más probable es que los «contactos» de madrugada de Quick Laundry en el diagnóstico y en el script de horario sean de **«Local actions - Other engagements»**: 45 en 30 días, de la ficha de Google Maps. Esos scripts usan todas las conversiones, sin filtrar. Google no les da hora y los pone a las 0 h.

El **vaciado de cada noche sí filtra por tipo de contacto** (WhatsApp, llamada, formulario, correo) y no los incluye. Sus números siguen siendo los buenos.

## Metas que no cuentan (pendiente, viernes 13)

| Cuenta | Qué no cuenta en la columna «Conversiones» | Efecto |
|---|---|---|
| **Girbau** | Meta **Contacto**, que es donde está «AB · Clic en WhatsApp» | Máximo rendimiento aprende sin ver los WhatsApp. **Lo más importante.** |
| Kingstar | Meta **Envío de formulario**, que es donde está «AB · Formulario enviado» | Solo afecta el reporte, porque sus campañas son de maximizar clics |
| Gamesail | Meta **Llamada desde anuncios** y no hay acción de llamada | Las llamadas del botón no cuentan como conversión. Se ven en call_view. Falta crear «AB · Llamada desde el anuncio» |

Se arregla el **viernes 13** en un solo script de metas, junto con las acciones viejas y el conteo de Girbau, después del paso 3 del jueves 12.

## Resultado de la ejecución (9 nov, ~16:25; comprobado con vistas previas a las 16:26–16:27)

| Cuenta | Paso 2 | Acciones viejas | Display | Lo que quedó sin cambiar |
|---|---|---|---|---|
| Laundry Solutions | ✅ Reparación $89, tope $17; chicas $3–4 | ✅ 6 de 11 | ✅ apagado en 2 | 4 «Local actions» y «Formulario de contacto - X»: Google no deja cambiarlas por script. Están en metas que no cuentan, o llevan 0 en el año |
| Quick Laundry | ✅ Emprendimiento $17 (su paso 1) | ✅ 9 de 13 | ✅ apagado en Equipo | 4 «Local actions»: metas que no cuentan |
| Kingstar | ✅ Túnel $73, 20 a 45 kg $21; freno en Alta capacidad y Hotelera | ✅ 4 de 8 | en espera (Jorge) | 3 «Local actions» y «Formulario de contacto - Enviar»: metas que no cuentan, o 0 en el año |
| Girbau | ✅ tope $23 (según Sandy, sin errores) | solo se mostró | no tiene | — |
| Gamesail | ✅ según Sandy, sin errores | no tiene | no tiene | — |

**Riesgo que se encontró:** la vista previa de Quick Laundry de las 16:27 proponía bajar Emprendimiento otra vez, de $17 a $13, el mismo día. La regla de «un paso por corrida» no impedía dos pasos si se corría dos veces el mismo día.

**Arreglo:** `reparto-por-pasos-todas-las-cuentas.js` ahora tiene un **candado**. Si el presupuesto o el tope ya cambió hoy (lo lee de `change_event`), no lo vuelve a mover. Ya está también en los scripts combinados.

## 11 nov: Display volvió a encenderse solo

- El historial de cambios muestra que **«Recommendations Auto-Apply»** (`GOOGLE_ADS_RECOMMENDATIONS_SUBSCRIPTION`), es decir, la aplicación automática de recomendaciones de Google, volvió a prender Display:
  - en las 2 campañas de Laundry Solutions, el 10 nov a las 19:42;
  - en las 5 de Kingstar (6 cambios).
- Lo habíamos apagado el 9 nov por script.
- Esto explica el martes de Kingstar: 129 clics a ~$5.5 y 0 contactos.
- **Arreglo:**
  1. Volver a apagar Display con `display-quien-lo-prende-y-apagar-todas-las-cuentas.js` (Ejecutar en Kingstar y Laundry Solutions).
  2. Desactivar la aplicación automática de recomendaciones en las 5 cuentas con la extensión: `campanas/salida/prompt-extension/apagar-aplicacion-automatica-recomendaciones-2026-11-11.txt`. No se puede por script.

## 11 nov: metas ejecutadas (adelantadas del viernes 13)

Según Sandy, se ejecutaron sin errores alrededor de las 8:55:
- **Girbau:** la meta «Contacto» (AB · Clic en WhatsApp) cuenta. Lead Calificado, Clic WhatsApp y Formulario de Contacto pasaron a secundarias.
- **Kingstar:** la meta «Envío de formulario» (AB · Formulario enviado) cuenta.
- **Gamesail:** la meta «Llamada desde anuncios» cuenta.

**Pendiente:**
- Gamesail: crear la acción «AB · Llamada desde el anuncio» con la extensión (`campanas/salida/prompt-extension/crear-accion-llamadas-gamesail-2026-11-11.txt`). Por script, Google la rechaza.
- Desactivar la aplicación automática de recomendaciones en las 5 cuentas (la extensión está en eso).
- Notas técnicas para los próximos scripts:
  - Las metas (`customerConversionGoalOperation`) solo se dejan cambiar con `AdsApp.mutate(op, { partialFailure: false })`.
  - Crear una acción `AD_CALL` por script da «The error code is not in this version».

## 11 nov: llamadas de Gamesail y aplicación automática (extensión)

- **Aplicación automática de recomendaciones: apagada en las 5 cuentas.**
  - Kingstar tenía «Red de Display» (se aplicó sola 6 veces).
  - Laundry Solutions, lo mismo (2 veces).
  - Quick Laundry tenía «Añade palabras clave nuevas» desde el 1 nov, sin aplicar todavía.
  - Girbau y Gamesail ya estaban apagadas.
- **Gamesail ya tenía una acción de llamadas desde anuncios:** «Cualificación de llamadas por IA», creada el 22 oct 2026.
  - Es principal, con valor 1, 60 segundos y ventana de 30 días. El nombre no se puede editar.
  - Se cambió el recuento de «Todas» a **«Una»**.
  - No se creó «AB · Llamada desde el anuncio»: habría contado doble. Con la meta de llamadas encendida hoy, esa acción ya cuenta las llamadas del botón.
  - Nota: el script de metas no la detectó porque no es de tipo AD_CALL.
