# Girbau 860-582-6837 · crear y activar las campañas nuevas

Página de destino: https://girbaupro.com/ (sin parámetros; Google agrega el gclid solo).

## Camino rápido (con tu usuario administrador)

Los tres scripts de `campanas/salida/girbau/`, en orden: `crear-campanas.js`, `conversiones.js` y `activar.js`. Cada uno con Vista previa y después Ejecutar. Paso a paso en `campanas/activacion/GUIA-SCRIPTS.md`.

## Camino con la extensión

Pegar en la extensión, uno por mensaje y en este orden:

| # | Archivo | Qué hace | ¿Cambia la cuenta? |
|---|---|---|---|
| 0 | `0-revisar.txt` | Revisa acceso, campañas, borradores, lista de negativas, conversiones, etiquetado automático y pagos | No |
| 1 | `1-crear-parte-1-de-5.txt` | Crea la lista «AB · Negativas de la cuenta» (o completa la que ya exista) | Sí, solo crea |
| 2–5 | `2-crear-…` a `5-crear-…` | Crea una campaña por mensaje, en pausa | Sí, solo crea |
| 6 | `6-activar.txt` | Activa las 4 campañas con su presupuesto completo y pausa las dos de la agencia anterior; espera tu SÍ | Sí, con tu OK |
| 7 | `7-conversiones.txt` | Crea las conversiones de la página y entrega el ID y las etiquetas para Rodolfo | Sí, solo crea |

Los archivos 1 a 5 son copia de `campanas/salida/girbau/prompt-extension/` (se generan con `python3 campanas/generar.py`). Si cambia el plan, se vuelven a copiar de ahí.
