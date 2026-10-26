# Mensaje para Rodolfo

Listo para copiar y pegar. Se adjunta la guía `medicion/nextjs/Guia-medicion-landings.md` (trae todo el código) y, cuando los tengas, los datos de cada página (ver `medicion/README.md`, paso 1).

---

Hola Rodolfo, ¿cómo estás? Primero, gracias por las páginas nuevas: se ven muy bien y ya les está llegando tráfico de los anuncios.

Te escribo por un tema de medición. Al cambiar a las páginas nuevas, Google Ads dejó de recibir los avisos de cuándo alguien manda el formulario o le da clic al WhatsApp. Es normal en una migración: la etiqueta de Google vivía en las páginas anteriores y no pasó a las nuevas. Mientras no esté, Google no sabe qué anuncios traen clientes y no puede optimizar.

Te pido que la instales en las cinco páginas:

- quicklaundry.store
- kingstar.com.mx
- girbaupro.com
- laundrysolutions.store
- gamesail.mx

Te adjunto una guía con el código listo para Next.js. En resumen:

1. Copiar tres archivos (`lib/medicion.ts`, `components/GoogleTags.tsx` y `components/RastreoClics.tsx`). Son los mismos en las cinco páginas.
2. Poner `<GoogleTags />` y `<RastreoClics />` una vez en el layout principal.
3. En el formulario, llamar a `registrarFormulario()` solo cuando el envío salió bien (hay un ejemplo en la guía).
4. Los clics en WhatsApp y en el teléfono se cuentan solos si el botón es un enlace (`wa.me`, `api.whatsapp.com`, `tel:`). Si algún botón abre WhatsApp con JavaScript, agregar `registrar('whatsapp')` en su clic.
5. Poner las variables de cada página (te las paso yo, una lista por página) y volver a publicar.

Para que no te falte nada, te pido que me confirmes:

- Si alguna página ya tiene otra etiqueta de Google o Google Tag Manager, para no contar doble.
- Si cada página tiene formulario, y si al enviarlo se queda en la misma página o manda a una página de "gracias".
- Si el botón de WhatsApp es un enlace normal o abre con JavaScript.
- Que el teléfono que aparece en cada página sea el mismo que usamos en los anuncios (ayuda a que Google apruebe el botón de llamada):
  - Quick Laundry: 33 2601 2237
  - Kingstar (CLM): 33 1564 1538
  - Girbau: 33 2806 8994
  - Laundry Solutions: 33 1417 2994
  - Gamesail: 33 1185 9797
- Si ya hay una propiedad de Google Analytics para alguna página. Si no hay, no pasa nada: se puede instalar sin ella y la agregamos después.

Cuando publiques cada página, avísame y la pruebo desde mi celular. Al día siguiente reviso en Google Ads que ya esté contando.

Si te es más fácil, lo vemos en una llamada corta. ¡Gracias!
