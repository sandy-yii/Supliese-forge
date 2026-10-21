# Medición de las páginas en Next.js (Google Ads + GA4)

Código para que Google Ads y Google Analytics 4 cuenten cada contacto que llega desde las páginas:

| Contacto | Cómo se detecta | Evento en GA4 | Conversión en Google Ads |
|---|---|---|---|
| Formulario enviado | Se llama a `registrarFormulario()` cuando el servidor confirma el envío | `generate_lead` | Formulario (Principal) |
| Clic en WhatsApp | Automático: cualquier enlace `wa.me`, `api.whatsapp.com` o `whatsapp:` | `clic_whatsapp` | WhatsApp (Principal) |
| Clic en teléfono | Automático: cualquier enlace `tel:` | `clic_llamada` | Llamada desde la página (Secundaria) |
| Clic en correo | Automático: cualquier enlace `mailto:` | `clic_correo` | Opcional (Secundaria) |
| Visitas a páginas | Automático con la etiqueta de Google | `page_view` | No se usa como conversión |

Las llamadas que se hacen directo desde el anuncio no necesitan código: se miden en Google Ads con la acción "Llamadas desde anuncios" (duración mínima 60 segundos).

## Archivos

| Archivo | Para qué |
|---|---|
| `lib/medicion.ts` | Las funciones que registran cada contacto y lee los IDs de cada sitio |
| `components/GoogleTags.tsx` | Carga la etiqueta de Google para GA4 y Google Ads |
| `components/RastreoClics.tsx` | Detecta los clics en WhatsApp, teléfono y correo en todo el sitio |
| `ejemplos/app/layout.tsx` | Dónde poner los componentes si el sitio usa la carpeta `app/` |
| `ejemplos/pages/_app.tsx` | Dónde ponerlos si el sitio usa la carpeta `pages/` |
| `ejemplos/FormularioContacto.tsx` | Cómo registrar el formulario después de enviarlo |
| `.env.example` | Las variables que cambian en cada sitio |

## Paso 1 · Crear las conversiones en cada cuenta de Google Ads

Se hace en cada una de las cinco cuentas, porque cada página tiene la suya.

1. **Objetivos › Conversiones › Resumen › + Crear acción de conversión › Sitio web.**
2. Escribir el dominio del sitio y elegir **"Agregar una acción de conversión manualmente"**.
3. Crear estas acciones:

| Nombre | Categoría | Valor | Recuento | Objetivo |
|---|---|---|---|---|
| Formulario enviado | Enviar formulario de clientes potenciales | Mismo valor: 1 | Uno | **Principal** |
| Clic en WhatsApp | Contacto | Mismo valor: 1 | Uno | **Principal** |
| Clic en teléfono de la página | Contacto | Mismo valor: 1 | Uno | Secundaria |
| Clic en correo (opcional) | Contacto | Mismo valor: 1 | Uno | Secundaria |
| Llamadas desde anuncios | Llamada telefónica | Mismo valor: 1 | Uno, 60 s o más | **Principal** |

4. En cada acción: **Configurar etiqueta › Usar Google tag**. Google muestra algo como `send_to: 'AW-123456789/AbC-D_efG-h12_34'`:
   - `AW-123456789` va en `NEXT_PUBLIC_GADS_ID` (es el mismo para todas las acciones de esa cuenta).
   - Lo que va después de la diagonal es la **etiqueta** de esa acción y va en su variable: `NEXT_PUBLIC_GADS_LABEL_FORMULARIO`, `NEXT_PUBLIC_GADS_LABEL_WHATSAPP`, etc.
5. **Configuración de la cuenta › Etiquetado automático: activado.** Sin esto Google Ads no puede atribuir el contacto al anuncio.
6. **Conversiones › Configuración › Conversiones mejoradas para clientes potenciales: activar, con Google tag.** Usa el correo y el teléfono del formulario (cifrados) para atribuir mejor.

Lo que hoy cuenta aperturas de chat (en Servicio, "GA4 (web) Coudibot") debe pasar a **Secundaria**: si no, Google aprende a buscar gente que abre el chat y no clientes.

## Paso 2 · Crear GA4 en cada sitio

1. En analytics.google.com: **Administrar › Crear › Propiedad**, una por sitio, con zona horaria de México y moneda MXN.
2. **Flujos de datos › Web**, con el dominio del sitio. Dejar activada la **medición mejorada**, que también cuenta las visitas cuando la página cambia sin recargar.
3. Copiar el **ID de medición** (`G-…`) a `NEXT_PUBLIC_GA4_ID`.
4. Cuando lleguen los primeros eventos: **Administrar › Eventos** y marcar como **evento clave** `generate_lead`, `clic_whatsapp` y `clic_llamada`.
5. **Administrar › Vinculación de productos › Google Ads**: vincular la cuenta de esa marca, para tener audiencias y ver los datos de Analytics en Google Ads.

No importar a Google Ads los eventos clave de GA4 como Principal: Google Ads ya los cuenta con su propia etiqueta y se contarían dos veces. Si se importan, que sea como Secundaria.

## Paso 3 · Instalar en el sitio

1. Copiar `lib/medicion.ts` y la carpeta `components/` al proyecto, en la misma ubicación relativa (por ejemplo, `src/lib` y `src/components`).
2. Agregar `<GoogleTags />` y `<RastreoClics />` una sola vez:
   - Carpeta `app/`: en `app/layout.tsx`, como en `ejemplos/app/layout.tsx`.
   - Carpeta `pages/`: en `pages/_app.tsx`, como en `ejemplos/pages/_app.tsx`.
3. En el formulario, llamar `registrarFormulario({ correo, telefono, id })` **solo después** de que el envío salió bien (ver `ejemplos/FormularioContacto.tsx`). Si el sitio, en vez de eso, manda a una página de "gracias", se puede llamar ahí, dentro de un `useEffect`.
4. Si el botón de WhatsApp no es un enlace `<a>` (algunos botones flotantes usan `window.open`), agregar `registrar('whatsapp')` en su `onClick`.
5. Poner las variables de `.env.example` con los valores de ese sitio, en `.env.local` o en las variables del hosting, y volver a publicar. Las variables `NEXT_PUBLIC_` se leen al construir el sitio: después de cambiarlas hay que volver a desplegar.
6. Si el sitio ya tiene otra etiqueta de Google (`gtag.js` o Google Tag Manager) con los mismos IDs, quitar la anterior para no contar doble.

## Qué ID va en cada sitio

| Sitio | Cuenta de Google Ads | GA4 |
|---|---|---|
| https://www.supliese.com/ | Supliese Gomez / Quick Laundry 256-397-2201 | Propiedad de Supliese |
| https://girbaupro.com/ | Girbau 860-582-6837 | Propiedad de Girbau Occidente |
| https://kingstar.com.mx/ | CLM 993-525-8739 | Propiedad de CLM |
| https://laundrysolutions.store/ | Servicio para Lavandería 265-909-2662 | Propiedad de Servicio |
| https://gamesail-lavadoras.vercel.app/ | La cuenta nueva de Gamesail | Propiedad de Gamesail |

## Paso 4 · Probar

1. Abrir **tagassistant.google.com**, conectar el sitio y revisar que aparezcan el `G-…` y el `AW-…`.
2. Hacer clic en el botón de WhatsApp, en el teléfono, y enviar un formulario de prueba:
   - En Tag Assistant debe aparecer cada evento y su `conversion`.
   - En GA4, **Informes › Tiempo real**, deben verse `clic_whatsapp`, `clic_llamada` y `generate_lead`.
3. En Google Ads cada acción pasa de "Sin verificar" a "Registrando conversiones". Puede tardar hasta 24 horas.
4. Borrar o marcar los formularios de prueba para que no se confundan con clientes.

## Privacidad

Las conversiones mejoradas envían el correo y el teléfono del formulario cifrados a Google. El aviso de privacidad de cada sitio debe mencionar que se usan herramientas de Google para medir la publicidad.
