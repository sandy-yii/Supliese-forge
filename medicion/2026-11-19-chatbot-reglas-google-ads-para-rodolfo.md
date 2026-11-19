# Chatbot en las páginas: reglas de Google Ads y cuidados para no frenar leads

Para: Rodolfo · De: Atelback · 19 nov 2026

Las 5 páginas reciben tráfico pagado de Google Ads. Un chatbot no va contra las políticas de Google, pero **la página de destino sí está sujeta a sus reglas**, y la experiencia en la página afecta cuánto pagamos por clic. Lista para revisar antes de publicarlo.

Nota: estas son las políticas tal como las conocemos hoy. Antes de publicar, vale la pena revisar las páginas oficiales de Políticas de Google Ads («Requisitos de destino», «Recopilación y uso de datos», «Prácticas comerciales inaceptables» y «Tergiversación»), porque Google las actualiza.

## 1. Requisitos de destino (si fallan, Google rechaza los anuncios)

- **La página tiene que abrir siempre.** Si el chatbot rompe la carga o da error, Google marca «Destino no operativo» y detiene los anuncios. Es lo que le pasó a Girbau el 14 nov: varios días en cero.
- **Que Google pueda leer la página.** El contenido principal no puede depender del chatbot ni quedar escondido detrás de él.
- **Sin ventanas que bloqueen la página.** El chat no se abre solo a pantalla completa ni tapa el contenido al entrar. Una burbuja en la esquina sí está bien.
- **Que no rompa el botón de «atrás»** ni redirija a otra página o dominio.
- **Mismo dominio y HTTPS.** Si el proveedor del chatbot abre otra URL, que sea dentro de un iframe en la misma página, no una redirección.

## 2. Recopilación de datos personales (si pide nombre, teléfono o correo)

- **HTTPS obligatorio** (ya lo tienen).
- **Aviso de privacidad visible** dentro del chat o con enlace junto al formulario. En México lo pide además la LFPDPPP.
- **Que no pida datos sensibles:** salud, finanzas, número de tarjeta, CURP, contraseñas. Google lo prohíbe en páginas de anuncios si no hay una razón y un manejo especial.
- **Decir para qué se usan los datos:** «para que un asesor te contacte».

## 3. Lo que dice el chatbot también cuenta como contenido de la página

- **Nada de promesas falsas ni datos inventados.** Precios, existencias, tiempos de entrega o garantías que no sean reales pueden caer en «Tergiversación». Si es un chatbot con IA, que no invente precios: que diga «un asesor te cotiza».
- **Que no mencione otras marcas como propias.** Cada página habla solo de su marca: Gamesail de Gamesail, Kingstar de Kingstar, etc.
- **Datos del negocio verificables:** nombre, contacto y forma de comunicarse con una persona.

## 4. Velocidad y experiencia en la página (afecta el costo por clic)

Google califica cada palabra clave del 1 al 10, y uno de los 3 criterios es la **experiencia en la página de destino**. Una página lenta en celular sube el costo por clic y baja los contactos.

- **Cargar el script del chatbot después de que la página ya cargó**, en diferido o al interactuar. Que no bloquee el contenido.
- **Medir antes y después** con PageSpeed Insights en celular: LCP, CLS e INP. Que no empeoren de forma notable.
- **Que no mueva el contenido al aparecer.** Una burbuja que empuja la página sube el CLS.

## 5. Cuidados nuestros para no frenar leads (más allá de Google)

- **No tapar los botones de WhatsApp ni de llamar en el celular.** Hoy casi todos los leads llegan por el botón verde de WhatsApp. La burbuja va donde no lo tape, o se esconde mientras el botón está visible.
- **El chatbot lleva al mismo WhatsApp y teléfono de cada marca** y usa el mensaje ya escrito con el código `ref.` (ver el mensaje del 19 nov sobre el código en WhatsApp).
- **Aviso por Resend para cada lead del chatbot**, con canal «chatbot», marca, sección y origen (gclid/gbraid/wbraid), al mismo correo y copias que los demás avisos. Que no use los correos que hoy rebotan.
- **Modo prueba:** con `?prueba=1` no manda avisos reales.
- **Horario:** sirve sobre todo de noche y en fin de semana. Que deje claro cuándo contestará una persona.

## 6. Medición en Google Ads (para no desordenar las pujas)

- **Conversión aparte: «Chatbot - lead»**, configurada como **secundaria** (sin incluir en «Conversiones»). Así Google no cambia la forma de pujar ni se reinicia el aprendizaje de las campañas.
- Solo cuenta cuando el chatbot **obtiene nombre y teléfono**, no cuando alguien abre la burbuja.
- **No cambiar** las conversiones principales actuales (WhatsApp, formulario, llamada) al instalar el chatbot.
- **Consentimiento de cookies:** que el chatbot respete el mismo banner y Consent Mode que ya tiene la página.
- Cuando tengamos datos de algunas semanas, decidimos juntos si pasa a principal.

## 7. Cómo publicarlo sin riesgo

1. **Primero en una sola marca**, por ejemplo Laundry Solutions o Gamesail.
2. **Probar en celular** (Android y iPhone): que los botones de WhatsApp y llamar se vean y funcionen, que la página cargue rápido y que el aviso de Resend llegue.
3. **Avisarnos el día y la hora de publicación**, para no hacer cambios en Google Ads esa misma semana en esa marca y poder medir.
4. **Medir de 3 a 5 días** contra el promedio de esa marca. Si bajan los WhatsApp o las llamadas, se quita.
5. **Tener un interruptor** para apagarlo en minutos sin volver a publicar todo el sitio.
6. Si sale bien, pasarlo a las demás marcas **una por una**.

Gracias.
