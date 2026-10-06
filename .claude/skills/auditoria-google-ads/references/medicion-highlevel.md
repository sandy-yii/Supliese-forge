# Cadena de medición: Google Ads + CRM (HighLevel), WhatsApp y llamadas

Úsalo cuando el cliente tenga CRM o reciba prospectos por WhatsApp o por teléfono. Los datos son de la documentación oficial de Google Ads y de HighLevel, revisada en octubre de 2026. Los puntos marcados **por confirmar** hay que probarlos en la cuenta antes de prometerlos.

## La cadena

**Búsqueda → clic → página → acción (formulario, chat, WhatsApp, llamada) → conversación → cita u oportunidad → venta → el dato regresa a Google Ads.**

- **Google Ads** ve bien la primera mitad: la búsqueda, el clic y la acción en la página.
- **El CRM** ve la segunda mitad.
- **El `gclid`** une las dos mitades. Es el código que Google agrega a la URL de cada clic; en iPhone llega `gbraid` o `wbraid`. Si el CRM lo guarda en el contacto, puede avisarle a Google después qué clic se volvió venta.

## Qué ve cada uno

| Acto del lead | Google Ads solo | HighLevel | ¿Regresa a Google? |
|---|---|---|---|
| Clic en el anuncio | Sí | Guarda `gclid`, UTM, URL y referente en el contacto (primera y última atribución) | — |
| Navega la página | Con etiqueta de Google | Páginas vistas con su script de rastreo, incluso de visitantes anónimos | No |
| Formulario | Con etiqueta | Sí, con atribución | **Sí** |
| Chat del sitio | Solo el clic | Atribución solo si el visitante deja sus datos | Sí, si dejó datos |
| WhatsApp | Solo el clic en el botón | Ve los mensajes si el número está conectado a HighLevel | **Solo si antes se identificó** |
| Llamada | Llamadas desde el anuncio, con duración mínima | Llamadas al *number pool*, con palabra clave (`?keyword={keyword}` en la URL) | Sí |
| Cita, oportunidad, venta | No | Sí, con valor | **Sí, con valor y moneda** |

**El envío a Google:** el workflow "Add to Google Ads" de HighLevel manda la conversión con valor y moneda.

- Requiere que la conversión ya exista en Google Ads.
- Requiere el `gclid` en el contacto. Si falta, la acción queda como *Skipped*.

## Límites que cambian el diseño

1. **El hueco de WhatsApp.** Con un enlace directo (`wa.me`), el lead escribe sin dejar datos y el `gclid` se queda en el navegador, así que no se puede ligar a su clic. La solución documentada es el widget de WhatsApp de HighLevel con un formulario corto antes (nombre y teléfono): guarda la atribución y luego abre WhatsApp.
2. **Plazos.** Google acepta conversiones con `gclid` hasta **90 días** después del clic, y con datos del usuario (conversiones mejoradas para leads) hasta **63 días**. En ciclos largos, manda una etapa intermedia (por ejemplo, "cotización enviada") dentro del plazo.
3. **iPhone.** `gbraid` y `wbraid` solo funcionan con recuento "cada una".
4. **No contar doble.** Si la etiqueta de Google y el CRM cuentan el mismo formulario, solo uno es principal. Lo recomendable es que lo principal venga del CRM (prospecto calificado y venta) y que las acciones de página (clic en WhatsApp, apertura de chat) sean secundarias.
5. **Google no ve las conversaciones,** solo el evento con su valor.
6. **Ventana de 24 h de WhatsApp.** Pasadas 24 h sin respuesta del cliente, solo se pueden mandar plantillas aprobadas. Los enlaces dentro de las plantillas deben ser *Trigger Links* de HighLevel para quedar registrados.

## Por confirmar en cada cuenta

- Si "Add to Google Ads" se puede disparar con el cambio de etapa de la oportunidad. Existe una petición abierta de usuarios en HighLevel.
- Si HighLevel envía correo o teléfono cifrado (conversiones mejoradas para leads).
- Qué parámetros de la URL llenan los campos "UTM Keyword" y "UTM Match Type". Se verifica con una prueba: abrir la página con `?gclid=PRUEBA123`, llenar el formulario y revisar el contacto.

## Fuentes

- HighLevel:
  - [Add to Google Ads](https://help.gohighlevel.com/support/solutions/articles/155000003368-workflow-action-add-to-google-ads)
  - [Attribution Source](https://help.gohighlevel.com/support/solutions/articles/48001219997-understanding-attribution-source)
  - [External Tracking](https://help.gohighlevel.com/support/solutions/articles/155000007809-analytics-for-external-tracking)
  - [Widget de WhatsApp](https://help.gohighlevel.com/support/solutions/articles/155000002269-chat-widget-send-your-leads-to-whatsapp-chat)
  - [Chat Widget Attribution](https://help.gohighlevel.com/support/solutions/articles/48001175057-chat-widget-attribution)
  - [Trigger Links en WhatsApp](https://help.gohighlevel.com/support/solutions/articles/155000006279-how-to-setup-and-use-trigger-links-in-whatsapp-templates)
  - [Number Pool](https://help.gohighlevel.com/support/solutions/articles/48000981393-how-to-set-up-call-tracking-number-pool-)
- Google Ads:
  - [Importación con GCLID](https://support.google.com/google-ads/answer/7012522)
  - [FAQ de importación offline](https://support.google.com/google-ads/answer/10029210)
  - [Conversiones mejoradas para leads](https://support.google.com/google-ads/answer/11021502)
  - [Conversiones de llamadas](https://support.google.com/google-ads/answer/6100664)
