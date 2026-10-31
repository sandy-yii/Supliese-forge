# Pendientes de Rodolfo: dominios, formularios, medición y secciones

Actualizado: 31 de octubre de 2026. Reemplaza las versiones anteriores de este documento.

**Quién hace qué:** Rodolfo programa las páginas, los dominios, los formularios y la medición en el sitio. Sandy maneja Google Ads: anuncios, presupuestos, botones y apelaciones. Los anuncios **no se pasan a ningún dominio hasta que Rodolfo confirme que ya muestra las páginas nuevas**. El script de Sandy revisa que la página abra y, si no abre, no cambia nada.

---

## 1. Hoy: regresar las páginas a los dominios de siempre

Decisión de la junta del 30 oct: las páginas nuevas se cuelgan en los dominios que el cliente siempre tuvo y que Google ya conoce.

| Página actual | Dominio de siempre | Vendedor (teléfono escrito en la página) |
|---|---|---|
| quicklaundry.store | **supliese.com** (agregar «Quick Laundry by Supliese») | Liliana · 33 2601 2237 |
| kingstar.com.mx | **clmmexico.com** | Jorge · 33 1564 1538 |
| girbaupro.com | **girbauoccidente.com** | Eduardo · 33 2806 8994 |
| laundrysolutions.store | **servicioparalavanderias.com** | Paulina · 33 1417 2994 |
| gamesail.mx | **¿Cuál es el de siempre?** Si no hay, se queda gamesail.mx | Silvia · 33 1185 9797 |

En cada dominio:
- [ ] **Las mismas direcciones que hoy**, para que los anuncios no apunten a algo que no existe:
  - supliese.com/lavadoras-de-monedas
  - clmmexico.com/lavadoras-alta-capacidad y clmmexico.com/mangles
  - servicioparalavanderias.com/reparacion-lavadoras-industriales
  - las anclas de la tabla del final
- [ ] **La misma etiqueta de Google Ads de su marca.** La etiqueta va con la marca, no con el dominio:

  | Marca | Etiqueta |
  |---|---|
  | Quick Laundry | AW-11012403016 |
  | Kingstar | AW-17632937663 |
  | Girbau | AW-18232185431 |
  | Laundry Solutions | AW-10977798087 |

  Nada de otras etiquetas: en los dominios viejos puede haber restos de la agencia anterior (otro AW-…, Universal Analytics, GTM viejo, el chat Coudibot). Quítalos.
- [ ] **HTTPS válido**, y una sola versión: con www o sin www. La otra redirige (301). **Dime la dirección exacta.** Hoy los scripts esperan `https://supliese.com/` (sin www), y así en los demás dominios.
- [ ] **Redirigir (301) lo viejo que tenía visitas** a la sección más parecida. Por ejemplo, `clmmexico.com/tunel` → la de túnel, y `landing.supliese.com` / `landing.servicioparalavanderias.com` → su página de inicio. Que nada quede en 404.
- [ ] **El teléfono del vendedor escrito como texto** con `tel:`, y el WhatsApp al vendedor. Google revisa el teléfono en el dominio al que lleva el anuncio para aprobar el botón de llamada.
- [ ] **Search Console:** que el dominio de siempre esté verificado (puede que el cliente ya lo tenga), con el sitemap nuevo enviado.
- [ ] **Los dominios .store / nuevos:** cuando Sandy avise que ya cambió los anuncios, recomiendo **redirigir (301) cada dirección al mismo camino en el dominio de siempre**, por ejemplo `quicklaundry.store/lavadoras-de-monedas` → `supliese.com/lavadoras-de-monedas`. Si se quedan las dos copias abiertas, Google ve contenido duplicado. Si prefieres dejarlas, ponles `canonical` al dominio de siempre.

**Cuando cada dominio esté listo, mándale a Sandy esta línea:**
`dominio · abre con https (sí/no) · dirección exacta (con o sin www) · teléfono visible (sí/no) · etiqueta AW de su marca (sí/no) · secciones que existen`

## 2. Formularios que llegan por correo (prioridad)

Antes, los formularios de las páginas viejas mandaban los datos a correos viejos. Ahora:

- [ ] Cada formulario manda el lead **por correo** además de WhatsApp.
- [ ] **Los destinatarios en un solo lugar por sitio** (una variable o un archivo de configuración), para cambiarlos en un minuto cuando el cliente confirme cuáles de sus 7 correos van en cada página.
- [ ] **Mientras el cliente no confirme**, mandarlos a un correo temporal que te pasa Sandy, para que **ningún lead se pierda**.
- [ ] Lo que lleva el correo:
  - nombre, teléfono, empresa, ciudad y equipo de interés;
  - mensaje;
  - **de qué página o sección vino**;
  - fecha y hora;
  - `gclid` en un campo oculto (sirve después para saber qué anuncio trajo cada venta; no se manda a Google).
- [ ] La conversión «AB · Formulario enviado» se dispara **solo cuando el envío salió bien**, no al dar clic en el botón.
- [ ] Protección contra spam (campo oculto tipo honeypot) y un mensaje de «Recibimos tus datos, te contactamos hoy».
- [ ] Ningún formulario manda el correo ni el teléfono de la persona a Google: el aviso de privacidad lo promete.
- [ ] Revisa que no quede activo ningún formulario viejo (de las páginas o de `landing.` en los dominios viejos) mandando a correos viejos.

Sandy revisa aparte los formularios de Google Ads (los que salen en el anuncio).

## 3. Medición (ya probada con Tag Assistant el 29 oct)

WhatsApp se cuenta bien en las 3 páginas medidas. Falta:

- [ ] **Publicar la medición de Laundry Solutions.** Sandy confirmó que las conversiones avanzadas están **apagadas en las 4 cuentas**. Al publicar, revisa con Tag Assistant que, al enviar el formulario, no salga el correo de la persona.
- [ ] **Girbau, teléfono:** el clic en `tel:` no manda nada. Debe mandar `AW-18232185431/ps85CLnf9aMdENek5PVD`, en el teléfono de la sección final y en el del pie.
- [ ] **Kingstar: quitar AW-10938286388.** No es de ninguna de nuestras cuentas y recibe las visitas. Ojo, que no se vaya a clmmexico.com.
- [ ] **Quick Laundry: quitar Universal Analytics (UA-233360285-1)** y revisar que la etiqueta no lea datos de la página: no `user_data` y no recolección automática. Hoy toma el correo de `#aviso-privacidad`.
- [ ] **Pregunta:** al aceptar cookies queda `ad_user_data` y `analytics_storage` en `denied`. ¿Así lo quieres? Los GA4 (G-26FWQ5PPVJ, G-69R59Z71PV), ¿son tuyos?

## 4. Secciones que faltan (en el dominio de siempre)

Cada una con:
- su `<title>`, su `meta description` y el H1 de abajo;
- 2 a 4 párrafos de texto real y fotos en WebP con `alt`;
- teléfono escrito y WhatsApp con mensaje ya escrito;
- la misma etiqueta;
- su lugar en el sitemap.

Las anclas `#` no cuentan para Google: cada una necesita su propia dirección.

| Prioridad | Dirección | H1 | Lo que busca la gente |
|---|---|---|---|
| 1 | supliese.com/lavadoras-para-negocio | Lavadoras para negocio y lavandería: precios | lavadoras para negocio de lavandería · lavadora industrial precio · costo de lavadoras para lavandería · dónde comprar lavadoras industriales · lavadora industrial 30 kg precio |
| 2 | clmmexico.com/lavanderia-hotelera | Lavandería para hotel y hospital | lavandería para hoteles y hospitales · lavadora para hotel · lavandería hotelera · lavadora industrial 50 kg |
| 3 | clmmexico.com/tunel-de-lavado | Túnel de lavado para lavandería industrial | túnel de lavado · cuánto vale un túnel de lavado (que diga que es **para ropa, no para autos**) |
| 4 | clmmexico.com/lavadoras-40-kg | Lavadoras y secadoras industriales de 20 a 45 kg | lavadora industrial 40 kg precio · lavadora de 40 kilos |
| 5 | servicioparalavanderias.com/mantenimiento | Mantenimiento preventivo y correctivo de lavadoras y secadoras industriales | mantenimiento de lavadoras industriales · póliza de mantenimiento |

Notas:
- En **lavadoras-para-negocio**, las palabras «precio» y «costo» tienen que aparecer. De ahí vienen la mayoría de los contactos de Quick Laundry.
- Los «productos estrella» que va a definir Pau entran en estas secciones (por ejemplo, «lavadora industrial de 30 kilos»).

## 5. Para que lleguen más mensajes

- [ ] **WhatsApp con mensaje ya escrito** en todos los botones, por ejemplo «Hola, quiero el precio de lavadoras para mi negocio». Varios abren el chat y no escriben.
- [ ] Que la página de inicio de Quick Laundry no se recorra sola al cargar.
- [ ] Si ajustas cuándo carga la etiqueta:
  - `gtag.js` async al terminar la página;
  - `gtag` / `dataLayer` en línea desde el inicio;
  - eventos con `transport_type: 'beacon'` antes de abrir WhatsApp o marcar.

## 6. Reseñas: con cuidado, para no poner en riesgo las cuentas de Google Ads

- [ ] **Solo testimonios reales**, con permiso del cliente (nombre o empresa, ciudad y equipo).
  - Google Ads revisa las páginas de destino. Las reseñas inventadas cuentan como «información engañosa» y pueden **suspender la cuenta de anuncios completa**, además del riesgo con PROFECO.
  - Mientras no haya reales, mejor poner logos de clientes (con permiso), años en el mercado y garantías verdaderas.
- [ ] **El QR para reseñas de Google está bien**, pero **sin cupón ni premio a cambio**. Google prohíbe incentivar reseñas y puede borrarlas o castigar la ficha. Lo que sí se puede: pedirla a todos los clientes por igual al terminar el servicio.

## 7. Gamesail

- [ ] Confirmar su dominio de siempre.
- [ ] Conectar su medición cuando se creen sus acciones «AB ·» en la cuenta 118-347-6484 (Sandy te pasa el AW y las etiquetas).

## Referencia: anclas que usan los enlaces de los anuncios

Deben existir también en el dominio de siempre. Las que no existan solo abren arriba.

| Sitio | Anclas |
|---|---|
| clmmexico.com (hoy kingstar.com.mx) | `#lavadoras-y-secadoras` · `#tunel-de-lavado-clm` |
| servicioparalavanderias.com (hoy laundrysolutions.store) | `#cotizar-refacciones` · `#instalacion-y-refacciones` · `#mantenimiento-refacciones` · `#nuestros-equipos` · `#solicitar-mantenimiento` · `#solicitar-poliza-de-mtto` |
| girbauoccidente.com y supliese.com | Las mismas que ya pusiste en girbaupro.com y quicklaundry.store (incluidas `lavanderas-industriales` y `lavadoras-industriales`) |
