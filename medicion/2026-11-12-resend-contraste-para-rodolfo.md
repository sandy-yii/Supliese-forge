# Resend como tercera fuente de leads: pedido para Rodolfo

**Fecha:** 12 nov 2026
**Para:** Rodolfo
**De parte de:** Sandy

## Para qué sirve

Hoy cada fuente dice un número distinto:

- **Google Ads** cuenta solo lo que vino de un anuncio, y con nuestra regla estricta.
- **El Excel de los vendedores** cuenta lo que ellos anotan.
- **Resend** sabe cuántos avisos de formulario y de WhatsApp salieron de verdad.

Queremos una tabla por marca y por día con los tres números lado a lado. Así sabremos dónde se pierde un lead:

| Si pasa esto | Quiere decir |
|---|---|
| Resend > Excel | El lead llegó, pero nadie lo anotó o nadie lo contestó. |
| Google > Resend | El clic en WhatsApp contó en Google, pero la persona no mandó el mensaje. |
| Resend > Google | Llegaron leads que no vienen de anuncios (orgánico, directo), o Google no los está midiendo. |

**Datos personales:** en el resumen solo van números. Nada de nombres, teléfonos ni correos de los clientes.

---

## 1. Lo que hay que agregar a cada envío de Resend

**Un lead = un `lead_id`.** Usa el mismo `transaction_id` que ya mandamos a Google (formularios, sección 6 del documento del 4 nov).

Un mismo lead dispara varios correos: al vendedor, al asesor y la confirmación al cliente. Si contamos correos y no leads, el número sale 2 o 3 veces más alto.

**Etiquetas (`tags`) en cada correo.** Solo letras, números, `_` y `-`:

| Etiqueta | Valores |
|---|---|
| `marca` | `ql`, `ks`, `ls`, `girbau`, `gamesail` |
| `tipo` | `formulario`, `whatsapp`, `chatbot` |
| `origen` | ver la regla de abajo |
| `destino` | `vendedor`, `asesor`, `cliente` |
| `lead_id` | el `transaction_id` |

Regla para `origen`:

- `google_ads` si la visita trae `gclid`, `gbraid` o `wbraid`, o trae `utm_source=google` y `utm_medium=cpc`.
- `organico` si viene de un buscador sin anuncio.
- `directo` si no trae nada.
- `otro` en cualquier otro caso.

Para saber el origen hay que guardar estos datos al entrar a la página (en `sessionStorage`) y mandarlos junto con el formulario.

**El asunto con un código fijo al inicio**, por ejemplo:

> `[KS·FORM] Nuevo contacto – Lavadoras alta capacidad`

Así se puede contar aunque se pierdan las etiquetas.

**WhatsApp:**

- Si el aviso sale cuando llega un mensaje real (no cuando alguien hace clic en el botón), etiquétalo `tipo=whatsapp`.
- Si una misma persona escribe varias veces el mismo día, que cuente **una** vez.
- Las conversaciones del chatbot van aparte, con `tipo=chatbot`, y no se suman como contacto.

---

## 2. El resumen diario (solo números)

**Resend guarda el historial solo 30 días.** Por eso hay que contar todos los días y guardar el conteo, o en un mes perdemos el pasado.

**Opción A (recomendada):** una tarea diaria en Vercel (cron, 23:30 hora de México) que:

1. Lee los envíos del día con la API de Resend (`GET /emails`, paginado).
2. Se queda solo con `destino=vendedor` y cuenta **leads únicos** por `lead_id`.
3. Agrupa por `marca × tipo × origen`.
4. Guarda una fila por día. Va en una hoja o en un CSV del repo, lo que te sea más fácil, y con solo números, por ejemplo:

```
fecha,marca,tipo,origen,leads
2026-11-12,ks,formulario,google_ads,2
2026-11-12,ks,whatsapp,google_ads,3
2026-11-12,ks,whatsapp,organico,1
```

**Opción B:** un webhook de Resend (`email.sent`) que sume en la misma tabla al momento.

**Errores:** cuenta también los envíos que rebotaron o fallaron (`bounced`, `failed`), en una columna aparte. Un aviso que no llega es un lead que el vendedor nunca vio.

---

## 3. Preguntas para ti

1. **¿Desde qué día exacto** sale cada marca por Resend, formularios y WhatsApp? Antes de esa fecha no hay con qué comparar.
2. **Antes de Resend, ¿a dónde llegaban los formularios y los WhatsApp?** ¿A qué correo o número? Si esa bandeja o ese número existe, contar cuántos llegaron por mes en ago–oct es la mejor prueba de «antes vs ahora». Solo el conteo, sin abrir datos personales.
3. **¿Hoy el chatbot también manda aviso por Resend?** Antes, más de la mitad de los «contactos» de Quick Laundry eran conversaciones del chatbot. Si los vendedores recibían esas conversaciones como leads y ahora ya no, eso solo explica parte de la sensación de «llegan menos».
4. **¿La cuenta de Resend es de Atelback?** Si se conecta a Claude, que sea con una clave solo para este uso. Desde Claude solo se va a **leer y contar**: nunca enviar, borrar ni crear nada.

Al terminar, contesta con una línea:

`S9 · resend contraste · etiquetas en vivo desde <fecha> · resumen diario en <dónde>`
