# 19 nov 2026 · Girbau Máximo rendimiento (solo lectura) y textos destacados

Datos leídos con el conector TrueClicks (solo lectura). No se movió nada en ninguna cuenta.

## 1. Girbau · «Max Rendimiento - Girbau»: a dónde se va el dinero

**Qué pasó:** hasta la semana del 12 oct, entre 75 y 84% del gasto iba a búsquedas de Google. Desde la semana del 26 oct casi todo se va a banners (Display): 86%, 99% y 87% en las semanas del 26 oct, 2 nov y 9 nov.

**Por qué (lo más probable):**
1. El 20 oct entraron las campañas de búsqueda «AB · …». Cuando una campaña de búsqueda tiene la palabra, Google le da esa búsqueda a ella y no a Máximo rendimiento. Eso es normal y no es malo.
2. La caída de `girbauoccidente.com` (rechazos por «destino no operativo», apelación del 17 nov) frenó todavía más sus anuncios.

**Dónde salen esos banners** (impresiones del 26 oct al 18 nov): app de X (Twitter), taboolanews.com, iniicio.com, lsmagazineimg.com, weather.com, apexnews-latam.com, juegos para niños (Pou, Baby Panda). Es el mismo tipo de sitio basura que el 16 nov se apagó en las otras cuentas.

**Conversiones de la campaña** (20 oct al 18 nov, 12 en total):
- 20 oct a 16 nov: 4 sueltas (1 «Conversación», 2 formularios a las 7 a.m. y a las 12 a.m., 1 WhatsApp).
- **17 nov, 9 p.m. y 11 p.m.: 6 clics de WhatsApp en dos horas, desde banners.** Se parece a las ráfagas de noche que trajo Display en otras cuentas. **Hay que comparar con Resend o WhatsApp** si de verdad llegaron 6 personas esa noche.
- 18 nov: 2 clics de WhatsApp (8 a.m. y 1 p.m.).

**Propuesta (para la semana del 24 nov; esta semana no se mueve nada en Girbau):**
- Primero Sandy revisa en Resend/WhatsApp los contactos de Girbau del 17 nov de 9 a 11 p.m.
- Si **no** fueron personas reales: **un solo** cambio chico, excluir a nivel cuenta los sitios y apps basura de la lista de arriba (con script, Vista previa y forma de deshacer). No se pausa la campaña ni se toca su presupuesto ni su puja.
- Si **sí** fueron personas reales: no se toca nada y se vuelve a medir en una semana.

## 2. Textos destacados

- TrueClicks: Gamesail, Quick Laundry, Laundry Solutions y Girbau no tienen textos destacados a nivel cuenta. Kingstar sí tiene 7.
- El script del 12 nov (`anuncios-y-extensiones-nuevos-todas-las-cuentas.js`) nunca se corrió. Además juntaba varios cambios a la vez (anuncios, fragmentos, enlaces y una pausa).
- Nuevo script **solo de textos destacados**: `salida/textos-destacados-3-cuentas.js` (Gamesail, Quick Laundry y Laundry Solutions). Usa los mismos textos que se revisaron el 12 nov, solo agrega, se salta una cuenta si ya tuvo un cambio hoy y tiene `DESHACER = true`.
- Girbau va la semana del 24 nov, separado de lo de Máximo rendimiento, que es otro día.
- Se mide del 20 al 26 nov contra la semana anterior: contactos (Google y Resend) y porcentaje de clics por cuenta.

- 19 nov: por indicación de Sandy, se quitó «Antes Supliese» de los textos de Quick Laundry (quedan 5).

## Ejecutado · 19 nov, ~14:00

| Cuenta | Resultado | Comprobado con TrueClicks |
|---|---|---|
| Quick Laundry | 5 textos destacados agregados | Sí, los 5 en revisión de Google |
| Laundry Solutions | 6 textos destacados agregados | Sí, los 6 en revisión de Google |
| Gamesail | **No se agregó nada:** el candado de «un cambio por cuenta al día» la saltó, porque a las 10:03 un script ya había cambiado el tope de puja por clic de una campaña | Sin textos destacados |

- **Gamesail: correr el mismo script mañana, 20 nov.** Quick Laundry y Laundry Solutions solo dirán «ya tiene» y no cambian nada.
- Deshacer el mismo día: `DESHACER = true` y Ejecutar.
- Medir del 20 al 26 nov contra la semana anterior.
