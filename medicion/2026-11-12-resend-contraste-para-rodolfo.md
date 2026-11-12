# Resend como registro de cada lead: pedido para Rodolfo

**Fecha:** 12 nov 2026
**Para:** Rodolfo
**De parte de:** Sandy

## Para qué sirve

Cada formulario, WhatsApp o llamada que llega queda registrado en Resend:

- a qué hora llegó,
- por qué medio llegó,
- qué decía el mensaje.

**Esto sustituye la petición a los vendedores de anotar la hora de llegada.** Ellos ya no tienen que anotar ni la hora ni el folio: eso sale de Resend.

En la hoja de los vendedores solo queda **lo que pasó con el lead**:

- si se contestó,
- si era cliente real,
- si cotizó o compró.

Con la hora exacta de cada lead podemos cruzarlo **uno por uno** con las conversiones de Google Ads, que también traen la hora:

| Si pasa esto | Quiere decir |
|---|---|
| Lead en Resend, pero no en el Excel | Llegó, pero nadie lo anotó o nadie lo contestó. |
| Conversión en Google sin lead en Resend cerca de esa hora | Tocaron el botón, pero no mandaron el mensaje. O Google cuenta algo que no es un contacto. |
| Lead en Resend sin conversión en Google | Vino de búsqueda orgánica o directa, o Google no lo midió. |

**Datos personales:** el contenido completo del mensaje se queda en Resend. A nosotros solo nos llega el registro de la sección 2, sin nombres, teléfonos ni correos.

---

## 1. Lo que cada aviso debe llevar

**Un lead = un `lead_id`.** Es el `transaction_id` de los formularios (sección 6 del documento del 4 nov), o el **folio del WhatsApp** (por ejemplo `QL-4821`).

Un mismo lead dispara varios correos: al vendedor, al asesor y la confirmación al cliente. Hay que contarlo una sola vez.

**Etiquetas (`tags`) en cada correo.** Solo letras, números, `_` y `-`:

| Etiqueta | Valores |
|---|---|
| `marca` | `ql`, `ks`, `ls`, `girbau`, `gamesail` |
| `canal` | `formulario`, `whatsapp`, `llamada`, `chatbot` |
| `origen` | ver la regla de abajo |
| `destino` | `vendedor`, `asesor`, `cliente` |
| `lead_id` | el `transaction_id` o el folio |

Regla para `origen`:

- `google_ads` si la visita trae `gclid`, `gbraid` o `wbraid`, o trae `utm_source=google` y `utm_medium=cpc`.
- `organico` si viene de un buscador sin anuncio.
- `directo` si no trae nada.
- `otro` en cualquier otro caso.

Para saber el origen hay que guardar estos datos al entrar a la página (en `sessionStorage`) y mandarlos junto con el formulario o el WhatsApp.

**El asunto con un código fijo al inicio**, por ejemplo:

> `[KS·WA·QL-4821] Nuevo contacto – Lavadoras alta capacidad`

Así se puede leer aunque se pierdan las etiquetas.

**La hora** es la del **primer mensaje del cliente**, en hora de México. Si una misma persona escribe varias veces el mismo día, es **un** lead. El chatbot va con `canal=chatbot` y no se suma como contacto.

---

## 2. El registro que necesitamos (un renglón por lead)

**Resend guarda el historial solo 30 días.** Por eso hay que copiar el registro todos los días, o en un mes perdemos el pasado.

**Opción A (recomendada):** una tarea diaria en Vercel (cron, 23:30 hora de México) que:

1. Lee los envíos del día con la API de Resend (`GET /emails`, paginado).
2. Se queda solo con `destino=vendedor`. Un renglón por `lead_id`.
3. Guarda los renglones en una hoja o en un CSV del repo, lo que te sea más fácil.

Esos renglones llevan estas columnas y nada más:

```
fecha_hora,marca,canal,origen,lead_id,pagina,producto,estado_envio
2026-11-12 10:42,ks,whatsapp,google_ads,KS-3107,/lavanderia-hotelera,lavadora 60 kg,entregado
2026-11-12 13:05,ks,formulario,organico,tx_8f2a91,/,mangle,entregado
2026-11-12 16:20,ks,llamada,google_ads,KS-3112,/tunel-de-lavado,,entregado
```

- `pagina`: la página desde donde escribió.
- `producto`: el equipo que pidió, si el mensaje lo dice. Solo el equipo, nada de la persona.
- `estado_envio`: `entregado`, `rebotado` o `fallido`. Un aviso que no llega es un lead que el vendedor nunca vio.

**Opción B:** un webhook de Resend (`email.sent` / `email.delivered`) que agregue el renglón al momento.

---

## 3. Preguntas para ti

1. **Llamadas:** ¿cómo llegan a Resend? ¿Con qué sistema? ¿Trae la hora de la llamada y si se contestó?
2. **¿Desde qué día exacto** sale cada marca por Resend, por cada canal (formulario, WhatsApp, llamada)? Antes de esa fecha no hay con qué cruzar.
3. **Antes de Resend, ¿a dónde llegaban los formularios y los WhatsApp?** Si esa bandeja o ese número existe, contar cuántos llegaron por mes en ago–oct es la mejor prueba de «antes vs ahora». Solo el conteo.
4. **¿Hoy el chatbot también manda aviso por Resend?** Antes, más de la mitad de los «contactos» de Quick Laundry eran conversaciones del chatbot.
5. **¿La cuenta de Resend es de Atelback?** Si se conecta a Claude, que sea con una clave solo para este uso. Desde Claude solo se va a **leer y contar**: nunca enviar, borrar ni crear nada.

Al terminar, contesta con una línea:

`S9 · resend registro por lead · etiquetas en vivo desde <fecha> · registro diario en <dónde>`
