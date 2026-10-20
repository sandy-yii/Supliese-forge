# Girbau 860-582-6837 · crear y activar las campañas nuevas

Página de destino: https://girbauoccidente.com/ (sin parámetros; Google agrega el gclid solo).

## Camino rápido (con tu usuario administrador)

1. Dentro de la cuenta 860-582-6837 (no en una cuenta de administrador general): Herramientas > Acciones masivas > Secuencias de comandos > «+».
2. Pegar completo `campanas/salida/girbau/crear-campanas.js` y dar **Autorizar** con tu usuario.
3. **Vista previa.** No crea nada. El registro debe terminar en «VISTA PREVIA SIN ERRORES».
4. **Ejecutar.** Crea las 4 campañas en pausa, con fecha de inicio de hoy.
5. Pegar en la extensión `6-activar.txt` y después `7-conversiones.txt`, o hacer esos pasos a mano.

Con este camino no hacen falta los archivos 0 a 5.

## Camino con la extensión

Pegar en la extensión, uno por mensaje y en este orden:

| # | Archivo | Qué hace | ¿Cambia la cuenta? |
|---|---|---|---|
| 0 | `0-revisar.txt` | Revisa acceso, campañas, borradores, lista de negativas, Nerea, conversiones, etiquetado automático y pagos | No |
| 1 | `1-crear-parte-1-de-5.txt` | Crea la lista «AB · Negativas de la cuenta» (o completa la que ya exista) | Sí, solo crea |
| 2–5 | `2-crear-…` a `5-crear-…` | Crea una campaña por mensaje, en pausa | Sí, solo crea |
| 6 | `6-activar.txt` | Activa las 4 campañas, pausa en Nerea las 3 palabras de marca y propone pausar Máximo Rendimiento; espera tu SÍ | Sí, con tu OK |
| 7 | `7-conversiones.txt` | Crea las conversiones de la página y entrega el ID y las etiquetas para Rodolfo | Sí, solo crea |

Los archivos 1 a 5 son copia de `campanas/salida/girbau/prompt-extension/` (se generan con `python3 campanas/generar.py`). Si cambia el plan, se vuelven a copiar de ahí.
