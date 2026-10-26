# Verificación por página

Para cada página, cuando Rodolfo avise que ya la publicó. Toma unos 10 minutos por página y no cambia nada en las cuentas.

## Día 1 · Prueba desde el celular

Usa los datos móviles (no el wifi de la oficina) y una ventana normal del navegador, no de incógnito.

1. **Entrar desde un anuncio.** Busca en Google una palabra de la campaña (por ejemplo, "lavadora industrial girbau") y entra por el anuncio. Si no sale, entra escribiendo la dirección y agrégale al final `?gclid=prueba` (por ejemplo, `girbaupro.com/?gclid=prueba`). No le des clic a tus propios anuncios muchas veces: con una vez basta.
2. **WhatsApp.** Toca el botón de WhatsApp. Debe abrir el chat con el número de la marca. Manda un mensaje que diga "PRUEBA, no contestar".
3. **Formulario.** Llénalo con tu nombre y "PRUEBA" en el mensaje. Al enviarlo debe salir el mensaje de "gracias" (o la página de gracias). Si sale un error, la prueba no cuenta.
4. **Teléfono de la página** (si tiene). Tócalo; basta con que abra la pantalla de marcar, no hace falta llamar.
5. Anota la hora de cada prueba en la tabla de abajo.
6. Avisa a quien recibe los formularios y los WhatsApp que llegaron pruebas, para que no las tomen como clientes.

## Día 2 · Revisar en Google Ads

Al día siguiente, en la cuenta de esa página:

1. **Objetivos › Conversiones › Resumen.** Busca «AB · Formulario enviado» y «AB · Clic en WhatsApp».
2. En la columna **Estado** deben decir **"Registrando conversiones"** (o "Activa"). Si dicen **"Sin verificar"** o **"Inactiva"**, la etiqueta todavía no llega: avisa a Rodolfo con la página y la hora de la prueba.
3. En **Todas las conversiones** debe aparecer al menos 1 en cada una. Las pruebas sin anuncio (con `?gclid=prueba`) pueden no sumar aquí, pero sí cambian el estado a "Registrando".
4. Opcional: corre en Vista previa `campanas/salida/datos-medicion-todas-las-cuentas.js`; en «ACCIONES DE CONVERSIÓN» debe salir la fecha de ayer en las acciones «AB ·».

## Botón de llamada de los anuncios

No depende de Rodolfo. Se revisa con el mismo script, en el bloque «BOTÓN DE LLAMADA»:

- Cada campaña «AB ·» debe tener el teléfono del plan y decir **aprobado**. Si dice **en revisión**, hay que esperar (de unas horas a un día). Si dice **RECHAZADO**, lo más común es que el número no aparezca en la página: pídele a Rodolfo que lo ponga.
- **Botón mostrado** en 0 con clics en la campaña: el botón no se está mostrando (está en revisión, rechazado, o los clics fueron fuera del horario de lunes a viernes de 9 a 18 h).
- **Informes de llamadas: NO** en «AJUSTES DE LA CUENTA»: sin eso, Google no cuenta las llamadas. Se activa a mano en **Administrador › Configuración de la cuenta › Informes de llamadas**, solo con tu OK para esa cuenta.

## Tabla de seguimiento

| Página | Rodolfo publicó | Prueba WhatsApp | Prueba formulario | Google Ads «Registrando» | Botón de llamada aprobado |
|---|---|---|---|---|---|
| quicklaundry.store (256-397-2201) | | | | | |
| kingstar.com.mx (CLM 993-525-8739) | | | | | |
| girbaupro.com (860-582-6837) | | | | | |
| laundrysolutions.store (Servicio 265-909-2662) | | | | | |
| gamesail.mx (cuenta nueva) | | | | | |

## Si algo no cuenta

| Lo que pasa | Qué le dices a Rodolfo |
|---|---|
| Ninguna acción pasa de "Sin verificar" | "En [página] Google Ads todavía no recibe la etiqueta. ¿Puedes revisar que las variables estén puestas y que se haya vuelto a publicar?" |
| WhatsApp sí, formulario no | "En [página] cuenta el WhatsApp pero no el formulario. Probé a las [hora] y salió el mensaje de gracias. ¿Puedes revisar dónde quedó `registrarFormulario()`?" |
| Formulario sí, WhatsApp no | "En [página] cuenta el formulario pero no el WhatsApp. ¿El botón abre con un enlace o con JavaScript?" |
| Todo cuenta doble | "Parece que en [página] quedó otra etiqueta de Google además de la nueva. ¿Puedes revisar si había Tag Manager u otra?" |
