Hola Rodo. Te escribo para ver cómo saber **quién sí manda mensaje por WhatsApp**, no solo quién toca el botón.

Hoy el aviso de Resend sale cuando alguien toca el botón de WhatsApp («Abrieron WhatsApp sin dejar datos»). No sabemos si después mandó el mensaje. Ejemplo: el miércoles 18 hubo ~24 avisos y en la hoja de vendedores quedaron 3. Queremos contar solo a los que escriben y saber de qué anuncio vino cada uno.

Te propongo dos opciones. ¿Me dices cuánto tardarías en cada una y si ves algún problema?

## Antes de todo: correos que rebotan (urgente)

`asesor@girbauoccidente.com` y `asesor@clmmexico.com` rebotan todos los avisos. Ayer fueron 12, incluido un contacto de Girbau con nombre y teléfono.
- ¿Se puede mandar los avisos de esas dos marcas a otro correo que sí funcione, mientras el cliente arregla los buzones?
- ¿Y que, si un aviso rebota, se reenvíe solo a un correo de respaldo del equipo?

## Opción 1: código en el mensaje de WhatsApp (la más rápida)

- Al tocar el botón, se genera un código corto por clic, por ejemplo `GS-4821` (marca y 4 caracteres).
- El código va al final del mensaje ya escrito: «Hola, vengo de la página de Gamesail… (ref. GS-4821)».
- El mismo código sale en el aviso de Resend y se guarda junto con el gclid/gbraid/wbraid del clic. Así después podemos decirle a Google qué clics terminaron en cliente.
- Los vendedores anotan el código en la hoja cuando la persona escribe. Así sabemos quién sí escribió y de qué anuncio y página llegó.

## Opción 2: WhatsApp conectado a la plataforma oficial de Meta (la más exacta)

- Conectar el número de cada marca a la API de WhatsApp Cloud.
- Cuando entra un mensaje, el webhook lee el código `ref.` del texto y manda un aviso por Resend: «Escribió por WhatsApp · GS-4821 · hora». Así contamos solo a los que escriben, sin depender de la hoja.
- Lo que hay que confirmar:
  - ¿Los vendedores pueden seguir usando la app de WhatsApp en su celular mientras el número está conectado? Meta lo permite para números de WhatsApp Business («coexistencia»), pero hay que ver si aplica a estos números y si hoy usan WhatsApp normal o Business.
  - El costo. Los mensajes que inicia el cliente normalmente no se cobran, pero hay que confirmarlo con la tarifa actual de Meta.
  - Guardar lo mínimo: código, marca y hora. No el texto ni el teléfono del cliente.

## Pendientes de antes (por si se pueden hacer juntos)

- **Modo prueba** con `?prueba=1`, para que sus pruebas no lleguen como avisos reales.
- Que «Origen» reconozca también `gbraid` y `wbraid` (clics de iPhone), además de `gclid`.

Gracias.
