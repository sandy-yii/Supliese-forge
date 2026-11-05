# Para Rodolfo: teléfono en formato +52 y verificación de Search Console

**Fecha:** 2026-11-04 · **De:** Sandy · **Para:** Rodolfo · **Prioridad:** alta, para hoy

> Este documento reemplaza la versión anterior de esta misma mañana. Ya no hace falta que agregues a nadie en Search Console: Sandy creó las propiedades con gamesailmx@gmail.com y solo falta que publiques las etiquetas de abajo.

## Por qué

Los botones de llamada de los anuncios de Quick Laundry, Kingstar y Girbau siguen rechazados por «número de teléfono no verificado». Soporte de Google respondió en dos casos (6-4979000042447 y 9-5942000041700), y lo que pide se resume en dos cosas:

1. **El número en formato internacional, como texto HTML** en el código que manda el servidor. Su sistema compara ese texto con el número del botón.
2. **Search Console vinculado** a cada cuenta de Google Ads. Es una prueba extra de que la página es del anunciante.

**Kingstar ya está en revisión.** Quick Laundry y Girbau se vuelven a mandar en cuanto publiques esto.

**Sobre el método de verificación:** el método «Google Analytics» no sirvió, porque gtag solo carga después de «Aceptar» y Google revisa sin aceptar cookies. **Eso está bien así; no lo cambies.** Por eso usamos la etiqueta HTML.

---

## 1. Teléfono en formato +52 en los cinco sitios

- [ ] Que se vea como **texto**: `+52 33 2601 2237`. Puede quedarse también el formato local donde ya está.
- [ ] Que tenga **enlace `tel:` internacional**: `<a href="tel:+523326012237">+52 33 2601 2237</a>`.
- [ ] Que esté en el **HTML del servidor**: que se vea con «Ver código fuente» y no dependa de JavaScript, de las cookies ni de una imagen. Como mínimo, en la cabecera o en el pie de página de todas las páginas.

| Sitio | Texto | Enlace |
|---|---|---|
| supliese.com | +52 33 2601 2237 | `tel:+523326012237` |
| clmmexico.com | +52 33 1564 1538 | `tel:+523315641538` |
| girbauoccidente.com | +52 33 2806 8994 | `tel:+523328068994` |
| servicioparalavanderias.com | +52 33 1417 2994 | `tel:+523314172994` |
| gamesail.mx | +52 33 1185 9797 | `tel:+523311859797` |

## 2. Etiqueta de verificación de Search Console en cada sitio

- [ ] Pon **cada línea en el `<head>` de su propio sitio**. Cada una es distinta: no las mezcles.
- [ ] Tiene que estar en el **HTML del servidor de la portada**, por ejemplo `https://supliese.com/`, **sin depender de las cookies**.
- [ ] **Déjala para siempre.** Si se quita, Search Console deja de estar verificado.
- [ ] Si te queda más cómodo, en Next.js con App Router puedes usar `metadata.verification.google` con el valor de `content`. El resultado es la misma etiqueta.

| Sitio | Etiqueta |
|---|---|
| supliese.com (Quick Laundry) | `<meta name="google-site-verification" content="I0QBGhTTy7pUkGUxwDwc2Opj2OXHrJTF6x_m8C7f6Fc" />` |
| clmmexico.com (Kingstar) | `<meta name="google-site-verification" content="6ZpYClU99ltHw7TzbdTMDgMHuVb8hijzDn6aNwr_hGk" />` |
| girbauoccidente.com (Girbau) | `<meta name="google-site-verification" content="D0FJSaiox7PHr2Xo7qui3QBuKwnCKw2G_42-3Ok-i94" />` |
| servicioparalavanderias.com (Laundry Solutions) | `<meta name="google-site-verification" content="PrZBxiE0NTrW0hix9voubRjme_lkSBCywRpQJeyDdZc" />` |
| gamesail.mx (Gamesail) | `<meta name="google-site-verification" content="-84Qb1hp4cu2KyF87JroNMP3zl9iaE3ipnE6lhLTUSw" />` |

## 3. Lo que no se toca

- [ ] Las direcciones de los anuncios: ninguna ruta se mueve.
- [ ] Las etiquetas AW y G- ni las reglas de cookies.
- [ ] El formulario sigue en modo WhatsApp hasta S8.

## 4. Cuando quede

Mándale a Sandy una línea por sitio:

`dominio · +52 visible en el código fuente (sí/no) · enlace tel:+52 (sí/no) · etiqueta google-site-verification en la portada (sí/no)`

Con eso Sandy da «Verificar» en Search Console, lo vincula en Google Ads y vuelve a mandar los botones de llamada a revisión. **Lo urgente es supliese.com y girbauoccidente.com**: si puedes, publica esos dos primero.

## 5 nov 2026: propietarios de Search Console

- direccion@atelbackia.com está agregado como **Propietario** en las 5 propiedades. Lo autorizó Sandy y lo hizo la extensión con gamesailmx@gmail.com.
- **Propiedades:** solo hay una por dominio, todas con prefijo de URL `https://dominio/`, sin versiones con www.
- **gamesail.mx:** direccion@atelbackia.com ya aparece como propietario «verificado». Esa cuenta había verificado el sitio por su lado.
- gamesailmx@gmail.com sigue como propietario verificado en las 5.
