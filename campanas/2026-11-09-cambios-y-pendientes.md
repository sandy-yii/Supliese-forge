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
