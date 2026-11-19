# Puente GoHighLevel → Google Ads (Gamesail)

Para: Rodolfo · De: Atelback · 19 nov 2026

Ya conectaste los números de Gamesail a GoHighLevel. Ahora falta que **Google Ads sepa qué clics terminaron en alguien que escribió, cotizó o compró**. Así Google aprende a buscar más gente como esa, y no solo gente que toca el botón.

Solo Gamesail por ahora. Si funciona, se pasa a las demás marcas una por una.

## El problema que hay que resolver

- Google identifica cada clic con un código: `gclid`, o `gbraid` / `wbraid` en iPhone. Ese código llega en la URL de la página.
- Con el botón directo a WhatsApp (`wa.me`), **el código se queda en la página** y el mensaje llega a GoHighLevel sin él. GoHighLevel sabe quién escribió, pero no de qué clic vino.
- Sin ese código, la acción «Add to Google Ads» de GoHighLevel queda en **Skipped**.

**La solución es un código corto en el mensaje de WhatsApp.** Une el clic con la conversación sin poner un formulario antes de WhatsApp, para no frenar leads.

## Paso 1 · Página gamesail.mx (Rodolfo)

1. Al tocar el botón de WhatsApp, la página genera un código por clic, por ejemplo `GS-4821`.
2. El código va al final del mensaje ya escrito: «Hola, quiero información de lavadoras industriales. (ref. GS-4821)».
3. En ese mismo clic la página guarda, **sin mandar correo**, el código junto con `gclid`, `gbraid` o `wbraid`, la sección y la hora. Puede ir por `/api/contacto` con un tipo nuevo, o por un endpoint aparte.
4. WhatsApp se sigue abriendo **primero**, como hoy. Nada de esto puede retrasarlo.
5. La ventanita opcional de nombre y teléfono se queda igual.

## Paso 2 · GoHighLevel (Rodolfo)

1. **Campos personalizados en el contacto:** `ref_clic`, `gclid`, `gbraid`, `wbraid` y `seccion`.
2. **Workflow «WhatsApp entrante Gamesail»:**
   - Disparador: primer mensaje de WhatsApp entrante.
   - Lee el código `ref. GS-xxxx` del texto.
   - Webhook a tu servidor, que responde con el `gclid`, `gbraid` o `wbraid` de ese código.
   - Escribe esos datos en el contacto.
   - Pone la etiqueta «Escribió por WhatsApp» y crea la oportunidad en el pipeline de Gamesail, en la etapa **«Escribió»**.
3. **Etapas del pipeline de Gamesail:** Escribió → Cotización enviada → Venta (con valor en MXN). Las mueve el vendedor. Para Gamesail, esto reemplaza la hoja de vendedores.
4. **Avisos a Resend:** opcional, un aviso «Escribió por WhatsApp · GS-4821 · sección». Con ese aviso Resend contaría solo a quien sí escribe.

## Paso 3 · Google Ads (nosotros, con script)

Creamos **3 acciones de conversión** de tipo «Importar de CRM, por clics» en Gamesail (118-347-6484):

| Acción | Cuándo cuenta | Valor |
|---|---|---|
| GHL · Escribió por WhatsApp | El workflow encontró el código | Sin valor |
| GHL · Cotización enviada | El vendedor mueve a esa etapa | Sin valor, o el monto cotizado |
| GHL · Venta | El vendedor marca venta | Monto de la venta en MXN |

- **Van como SECUNDARIAS** (sin incluir en «Conversiones»). Así **no cambian cómo puja Google** y no se reinicia el aprendizaje de las campañas. Las conversiones actuales de la página no se tocan.
- Se crean con script: Vista previa, el OK de Sandy y la forma de deshacerlo.

## Paso 4 · Conectar GoHighLevel con Google Ads

1. En GoHighLevel: **Settings → Integrations → Google**, conectar Google Ads **solo con la cuenta gamesailmx@gmail.com** y elegir la cuenta 118-347-6484.
2. **Workflows «Add to Google Ads»**, uno por etapa:
   - Etapa «Escribió» → acción GHL · Escribió por WhatsApp.
   - Etapa «Cotización enviada» → GHL · Cotización enviada.
   - Etapa «Venta» → GHL · Venta, con valor y moneda MXN.
3. Usar siempre el `gclid` del contacto.

## Por confirmar en la cuenta (antes de prometerlo)

- Si «Add to Google Ads» de GoHighLevel acepta `gbraid` y `wbraid` además de `gclid`. Si no, los clics de iPhone se mandan desde tu servidor con la API de Google Ads.
- Si «Add to Google Ads» se puede disparar con el **cambio de etapa** de la oportunidad. Si no, usar una etiqueta que ponga el vendedor.
- Si con los números conectados los vendedores **siguen usando WhatsApp en su celular** (coexistencia) y los mensajes llegan a los dos lados.

## Plazos y cuidados

- Google acepta la conversión hasta **90 días** después del clic. Una venta que tarda más ya no se puede mandar; por eso también se manda «Cotización enviada».
- **Guardar lo mínimo:** código, gclid, gbraid o wbraid, sección y hora. Nada del texto del mensaje.
- **Modo prueba:** con `?prueba=1`, que el código empiece con `PR-` y no se mande nada a Google.
- **Cómo lo probamos:** un clic de prueba, revisar que el contacto en GoHighLevel tenga el `gclid` y la sección, y 1 o 2 días después ver el diagnóstico de importaciones en Google Ads.

## Después

- Con **2 o 3 semanas** de datos, comparamos qué campañas y palabras traen gente que **escribe y cotiza**, no solo clics.
- Ahí decidimos con Sandy si «Escribió» o «Cotización enviada» pasa a **principal**. Ese es el cambio que hace que Google busque mejores clientes, y se hace con aviso y en un solo paso.
- Si en Gamesail sale bien, seguimos con Quick Laundry, Kingstar, Laundry Solutions y Girbau, **una por una**.

Gracias.
