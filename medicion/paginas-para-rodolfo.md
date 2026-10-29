# Pendientes de Rodolfo: landings y medición

Actualizado: 29 de octubre de 2026, por la tarde. Reemplaza la versión anterior de este documento.

## Respuesta sobre las etiquetas: la prueba con Tag Assistant ya está hecha

Prueba del 29 de octubre, de 4:41 a 4:47 p. m. En cada página: aceptar cookies, un clic en WhatsApp y un clic en el teléfono. Sandy también revisó a mano desde el celular que cada WhatsApp abre el chat del vendedor correcto.

| Página | Etiqueta | WhatsApp | Teléfono | Qué falta |
|---|---|---|---|---|
| girbaupro.com | AW-18232185431 ✅ | ✅ `KTrkCKmL9aMdENek5PVD` | ❌ no disparó nada | El enlace `tel:` no manda el evento (punto 1.2) |
| kingstar.com.mx | AW-17632937663 ✅ | ✅ `ZpzdCJH1-qMdEL-NhdhB` | ✅ `kj9uCKCg8aMdEL-NhdhB` | Carga una etiqueta ajena (punto 1.3) |
| quicklaundry.store | AW-11012403016 ✅ | ✅ `fmJJCO2Vq6QdEMjej4Mp` | ✅ `whSMCPKvoKQdEMjej4Mp` | Datos de conversiones avanzadas y una etiqueta UA vieja (puntos 1.4 y 1.5) |

En ninguna página apareció la etiqueta de otra de nuestras marcas.

**Conversiones avanzadas:** Sandy confirmó que **están apagadas en las 4 cuentas** (Quick Laundry, Kingstar, Girbau y Servicio).

## Ya está listo, gracias

- Teléfono escrito con `tel:` en los 5 sitios, y WhatsApp al vendedor de cada marca, sin el chat viejo.
- Secciones publicadas, con PageSpeed en celular de 83 a 100 y desplazamiento en 0:

  | Sección | Anuncios |
  |---|---|
  | laundrysolutions.store/reparacion-lavadoras-industriales | Ya llevan ahí (29 oct) |
  | kingstar.com.mx/lavadoras-alta-capacidad | Se conectan el 5 nov |
  | kingstar.com.mx/mangles | Se conectan el 5 nov |
  | quicklaundry.store/lavadoras-de-monedas | Se conectan el 5 nov |

  Las de Kingstar y Quick Laundry esperan a propósito: esas cuentas ya traen contactos y no queremos mover nada esta semana.
- Se queda como está:
  - la etiqueta solo carga si la persona acepta las cookies;
  - WhatsApp y Formulario son conversiones principales; teléfono y correo, secundarias;
  - en Girbau y Kingstar, el WhatsApp después del cotizador cuenta como Formulario.

## 1. Urgente: medición

- [ ] **1.1 Publicar la medición de laundrysolutions.store.** Las conversiones avanzadas ya están confirmadas como apagadas.
  - Al publicar, revisa con Tag Assistant que, al enviar el formulario, **no salga el correo de la persona** en la conversión.
  - Es lo que más urge: los anuncios de Servicio ya llevan a `/reparacion-lavadoras-industriales`, y sin etiqueta Google no ve ningún contacto.
- [ ] **1.2 girbaupro.com: el clic al teléfono no manda nada.** Debe mandar `AW-18232185431/ps85CLnf9aMdENek5PVD` en todos los enlaces `tel:`: el de la sección final («o llámanos al 33 2806 8994») y el del pie.
- [ ] **1.3 kingstar.com.mx: carga una etiqueta ajena, AW-10938286388**, que recibe las visitas.
  - No es de ninguna de nuestras cuentas: AW-11012403016 (Quick Laundry), AW-17632937663 (Kingstar), AW-18232185431 (Girbau), AW-10977798087 (Servicio) y AW-18531600046 (Gamesail).
  - Averigua de dónde viene (plantilla anterior, agencia anterior u otro script) y quítala si no es nuestra.
- [ ] **1.4 quicklaundry.store: las conversiones mandan datos de conversiones avanzadas**, tomados de `#aviso-privacidad` (parece el correo agomez@supliese.com).
  - En las cuentas está apagado, así que Google no los usa, pero el navegador los sigue mandando. Vienen de la etiqueta o de la página.
  - Revisa que no haya `user_data` ni recolección automática en la configuración de gtag.
- [ ] **1.5 quicklaundry.store: quitar Universal Analytics (UA-233360285-1).** Ya no funciona desde 2024.

## 2. Secciones que faltan (en orden de prioridad)

Cada sección lleva:
- la misma estructura que la página de inicio (encabezado, pie, aviso de cookies y **las mismas etiquetas de medición**);
- su propio `<title>`, su `meta description` y el H1 de abajo;
- de 2 a 4 párrafos de texto real (qué es, para quién, capacidades y beneficios) y fotos en WebP con `alt`;
- el teléfono del vendedor escrito con `tel:`, arriba y al final;
- WhatsApp con **mensaje ya escrito** (`wa.me/52…?text=…`);
- la velocidad en celular igual que las ya publicadas;
- nada de `noindex`, un `canonical` a su propia dirección y su lugar en el sitemap.xml.

**Las anclas (`#`) no sirven para esto:** Google califica la dirección sin el `#`, así que cada tipo de equipo necesita su propia dirección. Cuando una sección esté lista, manda la dirección exacta y confirma que abre igual con y sin diagonal final. Sandy cambia a dónde llevan los anuncios.

### 2.1 quicklaundry.store/lavadoras-para-negocio, la más importante

«Equipo para lavandería» trajo 4 de los 5 contactos de Quick Laundry el 28 de octubre. Aun así pierde el 76% de las búsquedas porque Google califica mal la página.

- **H1:** Lavadoras para negocio y lavandería: precios
- **`<title>`:** Lavadoras para negocio y lavandería | Precios | Quick Laundry
- **Lo que busca la gente:**
  - lavadoras para negocio de lavandería
  - lavadoras industriales para negocio
  - lavadora industrial precio
  - costo de lavadoras para lavandería
  - dónde comprar lavadoras industriales
  - lavadora industrial 30 kg precio
- **Contenido:**
  - Las palabras **«precio»** y **«costo»** tienen que aparecer en la página: con precios «desde» o con una sección «Pide el precio de tu equipo».
  - Capacidades en kg (20, 30 kg…).
  - Comercial contra semi industrial.
  - Para lavandería nueva o que crece.
- **WhatsApp:** Liliana, 33 2601 2237, con el mensaje «Hola, quiero el precio de lavadoras para mi negocio».

### 2.2 kingstar.com.mx/lavanderia-hotelera

- **H1:** Lavandería para hotel y hospital
- **`<title>`:** Lavandería para hotel y hospital | Lavadoras industriales 50 kg y más | Kingstar México
- **Lo que busca la gente:**
  - lavandería para hoteles y hospitales
  - lavadora para hotel
  - lavadora para hospital
  - lavandería hotelera
  - lavadora industrial 50 kg / precio
  - lavadora de 50 kilos
- **Contenido:**
  - Equipo completo para hotel u hospital: lavadoras, secadoras y mangle.
  - Capacidades de **50 kg y más**.
  - Proyectos de lavandería completa.
- **WhatsApp:** Jorge, 33 1564 1538, con el mensaje «Hola, quiero cotizar equipo para la lavandería de un hotel / hospital».

### 2.3 kingstar.com.mx/tunel-de-lavado

Esta campaña ya trajo un WhatsApp con solo 2 clics.

- **H1:** Túnel de lavado para lavandería industrial
- **`<title>`:** Túnel de lavado para ropa | Lavandería industrial | Kingstar México
- **Lo que busca la gente:**
  - túnel de lavado
  - cuánto vale un túnel de lavado
  - túnel de lavado para ropa
- **Contenido:**
  - Qué es y para quién es.
  - Capacidad por hora.
  - Que es **para ropa, no para autos**: llegan búsquedas de lavado de autos.
- **WhatsApp:** «Hola, quiero información de un túnel de lavado».

### 2.4 kingstar.com.mx/lavadoras-40-kg

- **H1:** Lavadoras y secadoras industriales de 20 a 45 kg
- **`<title>`:** Lavadora industrial 40 kg | Lavadoras y secadoras de 20 a 45 kg | Kingstar México
- **Lo que busca la gente:**
  - lavadora industrial 40 kg / precio
  - lavadora 40 kg
  - lavadora de 40 kilos
  - secadora industrial 40 kg
- **WhatsApp:** «Hola, quiero cotizar una lavadora industrial de 40 kg».

### 2.5 laundrysolutions.store/mantenimiento (después)

- **H1:** Mantenimiento preventivo y correctivo de lavadoras y secadoras industriales
- **Lo que busca la gente:**
  - mantenimiento de lavadoras industriales
  - mantenimiento preventivo lavadoras industriales
  - póliza de mantenimiento lavandería
- **Contenido:** pólizas, frecuencia de las visitas, qué incluye y zona que cubren.
- **WhatsApp:** Paulina, 33 1417 2994.

## 3. Mejoras para que lleguen más mensajes

- [ ] **Mensaje ya escrito en todos los botones de WhatsApp**, también en las páginas de inicio de los 5 sitios.
  - Varios clics a WhatsApp no terminan en mensaje: la persona abre el chat y no escribe.
  - Con el texto listo solo da enviar, y el vendedor sabe de qué página viene.
- [ ] **quicklaundry.store: la página de inicio se recorre sola al cargar.** En la prueba, un clic cayó en espacio vacío. Arréglalo como en las secciones.
- [ ] **Cuándo carga la etiqueta.** Ya puedes ajustarla, porque la prueba está hecha. Cuida que no se pierdan clics:
  - que `gtag.js` cargue async al terminar la página, no hasta que la persona haga algo;
  - que `gtag` / `dataLayer` estén en línea desde el inicio;
  - que el evento de WhatsApp y del teléfono se mande con `transport_type: 'beacon'` antes de abrir WhatsApp o marcar.

## 4. Para que Google encuentre las páginas

- [ ] Dar de alta los 5 sitios en **Google Search Console** (propiedad de dominio, verificada por DNS).
- [ ] Enviar el sitemap.xml de cada uno, con las secciones nuevas, y pedir su indexación.
- [ ] Revisar que ningún sitio tenga `noindex` y que el robots.txt no bloquee nada.
- [ ] Si las versiones viejas en vercel.app siguen abiertas, que redirijan (301) al dominio nuevo.
- [ ] Si la marca tiene ficha en Google Maps, que su sitio web sea el dominio nuevo.
- [ ] Mandarle a Sandy una captura de Search Console.

## 5. Preguntas

1. **Consentimiento al aceptar:** queda `ad_storage: granted`, pero `ad_user_data: denied` y `analytics_storage: denied` (gcs=G110). ¿Así lo quieres?
2. **GA4 de las páginas:** cargan G-26FWQ5PPVJ (Kingstar) y G-69R59Z71PV (Quick Laundry). ¿Son tuyos? Con `analytics_storage: denied` no reciben datos.

## 6. Gamesail (cuando se pueda)

- [ ] Conectar su medición en gamesail.mx cuando se creen sus acciones «AB ·» en la cuenta 118-347-6484. Sandy te pasa el AW y las etiquetas, incluida la de teléfono.

## Referencia: anclas que usan los enlaces de los anuncios

Las que no existan solo abren la página arriba; no rompen nada.

| Sitio | Anclas |
|---|---|
| kingstar.com.mx | `#lavadoras-y-secadoras` · `#tunel-de-lavado-clm` |
| laundrysolutions.store | `#cotizar-refacciones` · `#instalacion-y-refacciones` · `#mantenimiento-refacciones` · `#nuestros-equipos` · `#solicitar-mantenimiento` · `#solicitar-poliza-de-mtto` |
| girbaupro.com y quicklaundry.store | Ya están (incluidas `lavanderas-industriales` y `lavadoras-industriales`) |
