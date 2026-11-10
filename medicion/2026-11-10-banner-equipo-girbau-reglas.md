# Banner del equipo nuevo de Girbau: guía completa para Rodolfo y Sandy

**Fecha:** 10 nov 2026
**De:** Sandy (Atelback, Google Ads)
**Para:** Rodolfo (páginas y código) y el cliente
**En corto:** el cliente quiere anunciar un equipo nuevo de Girbau para lavanderías **sin crear campaña ni mover presupuesto**. Se pone un banner o sección en las páginas a donde ya llegan los anuncios. Esta guía dice cómo hacerlo para que:
1. no baje la cantidad de contactos;
2. Google no rechace páginas, anuncios ni botones;
3. podamos medir cuánta gente pregunta por el equipo.

---

## 0. Decisiones que ya están tomadas

| Tema | Decisión |
|---|---|
| Presupuesto | No se mueve. El banner solo lo ve la gente que ya llega por los anuncios actuales. |
| Campañas y anuncios | No se tocan. Las URL finales de los anuncios **no cambian**, así que ningún anuncio entra a revisión. |
| Dónde va | girbauoccidente.com (portada y sección de lavanderías) y las páginas de Quick Laundry de **emprendimiento** y **autoservicio**. Otras marcas, solo si el cliente lo pide. |
| Formato | Banner o sección **fija dentro de la página**. Nunca ventana emergente. |
| Medición | Con lo que ya existe. **No se crean etiquetas ni acciones de conversión nuevas.** |

---

## 1. Para Rodolfo: páginas y código

### 1.1 Dónde y cómo se ve

1. **Celular primero.** Cerca del 90% de los clics de las campañas son desde celular. Se diseña y se prueba primero en un ancho de 360–390 px.
2. **Posición:** **después** del bloque principal de cada página: título, texto principal y botón de WhatsApp principal. Si el cliente lo quiere arriba, solo como **franja delgada** (de 48 a 64 px de alto en celular) que no empuje el botón principal fuera de la primera pantalla.
3. **Lo que no se mueve:** el título (H1), el texto principal, el botón principal de WhatsApp y el de llamada de cada sección siguen en el mismo lugar y con el mismo texto.
4. **No usar:**
   - ventanas emergentes (modal, pop-up o «interstitial»);
   - barras fijas que tapen el botón de WhatsApp;
   - nada que aparezca solo a los X segundos y cubra el contenido.
5. **Accesible:**
   - texto alternativo (`alt`) en la imagen con el nombre del modelo;
   - contraste de texto suficiente;
   - botones de al menos 44 × 44 px;
   - el texto del banner como texto real en HTML, no solo dentro de la imagen.

### 1.2 Qué dice el banner

- **Título corto:** «Nuevo [modelo] Girbau para lavanderías».
- **Hasta 3 datos comprobables:** capacidad (kg), para qué tipo de lavandería y garantía del fabricante. Un dato de ahorro de agua o energía solo si viene de la ficha del fabricante.
- **Un solo botón:** «Pregunta por WhatsApp» o «Ver el equipo».
- **Precio:** solo si es el real y vigente. Si no, «Cotiza por WhatsApp».
- Las frases prohibidas están en la sección 3.

### 1.3 Enlaces y botones

**Botón de WhatsApp del banner.** Va al WhatsApp del vendedor de **esa** página, con mensaje ya escrito:

| Página | Número (el mismo de sus botones aprobados) | Mensaje ya escrito |
|---|---|---|
| girbauoccidente.com | Eduardo · 33 2806 8994 | `Hola, vengo de la página de Girbau (banner [modelo]). Me interesa información del [modelo].` |
| Quick Laundry (emprendimiento o autoservicio) | Liliana · 33 2601 2237 | `Hola, vengo de la página de Quick Laundry (banner Girbau [modelo]). Me interesa información del [modelo].` |

- Formato: `https://wa.me/52XXXXXXXXXX?text=<mensaje codificado con encodeURIComponent>`.
- **No usar otro número.** Si cambia un número, Google vuelve a revisar los botones de llamada que ya se aprobaron.

**Si el banner lleva a una página del equipo:**
- **Mejor en el mismo sitio:** `girbauoccidente.com/[modelo]` (por ejemplo `/girbau-hs-6017`). Desde Quick Laundry puede ir a esa página de Girbau, con un enlace normal (`<a href>`).
- **Prohibido redirigir solo** (sin clic): nada de `meta refresh`, `window.location` al cargar, redirecciones del servidor en las páginas de los anuncios, ni acortadores de enlaces.
- Enlaces en `https` y en la misma pestaña. Sin parámetros raros.

### 1.4 Medición: qué ya funciona y qué NO hacer

- **`RastreoClics.tsx` ya cuenta solo cualquier enlace `wa.me`, `tel:` y `mailto:` de todo el sitio.** El botón de WhatsApp del banner se cuenta automáticamente como «AB · Clic en WhatsApp» en la cuenta de esa marca. **No hay que hacer nada para que cuente.**
- **NO** llamar `registrar()` a mano en el botón del banner, porque contaría doble.
- **NO** crear etiquetas ni acciones de conversión nuevas en Google Ads.
- **Opcional, para distinguirlo en GA4:** poner `data-origen="banner-girbau"` en el enlace y, en `RastreoClics.tsx`, pasar ese valor como parámetro del evento de GA4 (por ejemplo `origen`). Solo en GA4, no en la conversión de Google Ads.
- **Consentimiento:** se queda igual. `ad_user_data` en «denied» y sin mandar datos de personas.
- **Si el banner lleva de Quick Laundry a girbauoccidente.com:** el WhatsApp que toquen allá se cuenta en la cuenta de **Girbau**, no en la de Quick Laundry. Está bien, pero hay que saberlo para leer los números. El mensaje «(banner Girbau…)» nos dice de dónde vino.

### 1.5 Velocidad: que la página no se vuelva lenta

- Imagen en **WebP o AVIF**, de **máximo 150 KB**, con `next/image`, `width` y `height` definidos (para que la página no «brinque» al cargar) y `sizes` para celular.
- Si el banner queda debajo de la primera pantalla: `loading="lazy"`. **Nunca** convertir el banner en el elemento más grande de la primera pantalla.
- Sin video que se reproduzca solo y sin carruseles automáticos.
- **Probar con PageSpeed Insights en celular antes y después.** La calificación no debe bajar más de 5 puntos. Si baja, se aligera la imagen.

### 1.6 Si se hace una página o sección propia del equipo

- **Título de la página** (`<title>`): «[Modelo] Girbau para lavanderías | Girbau Occidente».
- **Meta description:** una frase con capacidad y para quién es.
- **Un solo H1** con el nombre del modelo.
- **Contenido mínimo:**
  - fotos reales;
  - ficha técnica (capacidad, medidas, consumo, voltaje);
  - para qué tipo de lavandería es;
  - garantía;
  - botones de WhatsApp y llamada (con los números de siempre);
  - enlace al aviso de privacidad.
- **Datos estructurados `Product`:**
  - **sin reseñas ni calificaciones inventadas** (ya hubo un aviso de Search Console por eso en Girbau);
  - `offers` con precio solo si es real; si no, sin `offers` o sin precio.
- Agregarla al **sitemap**, con `canonical` a sí misma y **sin `noindex`**. Avisarle a Sandy la URL para pedir la indexación en Search Console.
- Dirección, teléfono y nombre de la empresa **iguales** a los del resto del sitio.

### 1.7 Cómo publicarlo

1. Primero en **vista previa de Vercel**: revisión visual en celular y computadora.
2. **Tag Assistant solo en el dominio real**, nunca en `*.vercel.app`, como quedamos.
3. Ya publicado, probar en celular:
   - que el botón del banner abra WhatsApp con el mensaje correcto y al número correcto;
   - que el botón principal siga funcionando igual;
   - que el teléfono abra la llamada;
   - que la página cargue completa.
4. **No mandar formularios de prueba en los sitios reales:** cada envío le llega al vendedor como cliente.
5. Mandarle a Sandy esta línea:
   `BANNER · dominio · URL de cada página donde quedó · hora de publicación · enlace del banner (WhatsApp o página) · PageSpeed antes/después`

---

## 2. Para Sandy: Google Ads

### 2.1 Por qué no hay riesgo de frenar los contactos

- Google revisa un anuncio cuando cambia **el anuncio** (textos, URL final, recursos), **no** cuando cambia el contenido de la página.
- Las URL finales no cambian, así que los anuncios siguen corriendo sin pausa.
- Google sí revisa las páginas de vez en cuando. Solo marca algo si encuentra una infracción (sección 3). Si lo hace, se ve en el Administrador de políticas y se corrige en la página sin tocar campañas.

### 2.2 Lo que NO hay que hacer en las cuentas

- **No cambiar URL finales** de anuncios ni de grupos.
- **No crear una acción de conversión para el banner.** Ya cuenta como «AB · Clic en WhatsApp». Una nueva contaría doble.
- **No agregar palabras clave del equipo Girbau en las campañas de Quick Laundry**, para no competir con la cuenta de Girbau por las mismas búsquedas.
- **No poner «Girbau» en los textos de anuncios de Quick Laundry** sin confirmar que el cliente puede usar la marca ahí. En la página sí, si lo distribuye. En el anuncio, Google puede restringir el uso de marcas de terceros.
- **No crear la campaña propia del equipo todavía.** Primero ver si el banner genera preguntas (sección 2.6).

### 2.3 Extra sin presupuesto: enlace dentro del anuncio

Cuando la página o sección del equipo esté publicada, se puede agregar un **enlace de sitio** («sitelink») en las campañas:
- **Girbau:** Marca Girbau y Por capacidad y sector.
- **Quick Laundry:** Emprendimiento, Autoservicio y Equipo para lavandería.

Cómo es:
- **Texto del enlace:** máximo 25 caracteres. Ejemplo: «Nuevo [modelo] Girbau».
- **Dos líneas de descripción:** máximo 35 caracteres cada una. Ejemplo: «Para lavanderías de 20 kg» / «Cotiza por WhatsApp».
- **URL final:** la página o sección del equipo. Tiene que ser distinta de la de los otros enlaces de la misma campaña.
- **Solo ese enlace entra a revisión**, unas horas o un día. Los anuncios siguen corriendo mientras tanto.
- **No sube el gasto:** solo se paga si le dan clic, con el mismo presupuesto diario.
- Se hace **por script**, con Vista previa y OK, cuenta por cuenta.
- **En Máximo rendimiento de Girbau, no por ahora.** Cambiar recursos ahí la pone a reaprender. Se evalúa después del viernes 13.

### 2.4 Si después se usan fotos del equipo en anuncios (recursos de imagen)

- **Sin texto, logos, marcos ni collages** encima de la foto. Así se rechazaron dos imágenes viejas de Quick Laundry, por «superposiciones gráficas o de texto».
- Foto real del equipo, nítida, bien iluminada y con el equipo centrado.
- Tamaños:

  | Formato | Recomendado | Mínimo |
  |---|---|---|
  | Horizontal (1.91:1) | 1200 × 628 | 600 × 314 |
  | Cuadrada (1:1) | 1200 × 1200 | 300 × 300 |
  | Vertical (4:5), opcional | 960 × 1200 | 480 × 600 |

  Máximo 5 MB.

### 2.5 Reglas de texto (aplican a la página Y a los anuncios)

Están en la sección 3. Son las mismas para Rodolfo y para Sandy.

### 2.6 Cómo medimos si el banner funciona

1. **Contactos del banner:** los vendedores ven «(banner Girbau…)» en el mensaje. Les pedimos anotarlo en la hoja.
2. **En Google Ads** se van a ver como «AB · Clic en WhatsApp» de la campaña que trajo a la persona. Por ejemplo, uno de Emprendimiento de Quick Laundry. Por eso el texto del mensaje es lo que los separa.
3. **Que no bajen los demás contactos:** comparar 7 días antes y 7 días después de publicar, en las campañas de esas páginas:
   - contactos por día;
   - costo por contacto;
   - porcentaje de clics que termina en contacto.

   Si baja más de 20%, se mueve el banner más abajo o se quita.
4. **Calidad de la página:** revisar en las palabras clave de esas campañas que la «Experiencia en la página de destino» no baje de «Promedio».
5. **Después de 3 a 4 semanas:** si el banner trae preguntas constantes del equipo, ahí se justifica proponer una campaña propia con presupuesto nuevo.

### 2.7 Vigilancia después de publicar

| Cuándo | Qué |
|---|---|
| Esa noche y la siguiente | Vaciado de contactos de la noche en Girbau y Quick Laundry |
| 24 a 48 horas después | Administrador de políticas de Girbau y Quick Laundry: que no aparezca nada nuevo, sobre todo «destino no disponible» o «declaraciones engañosas» |
| 7 días después | Comparación de la sección 2.6 |

---

## 3. Lo que NO se puede decir ni mostrar (página y anuncios)

### 3.1 Frases

| No decir | Por qué | Decir en su lugar |
|---|---|---|
| «El mejor», «el número 1», «el más barato de México», «el más eficiente del mercado» | Superlativos que no se pueden comprobar: Google los rechaza como engañosos | «Lavadora de 20 kg para lavanderías», «hasta X% menos agua», con el dato del fabricante |
| «Garantizado», «resultados asegurados», «recupera tu inversión en X meses» | Promesas de resultado | «Garantía de X años del fabricante» (si es real) |
| «Gratis», «sin costo», «regalo» | Solo si de verdad no cuesta y sin condiciones escondidas | «Instalación incluida» (si es real) |
| «Oferta por tiempo limitado», «últimas piezas», «solo hoy» | Urgencia falsa; si se pone, debe ser verdad y decir hasta cuándo | «Precio válido hasta el 30 nov 2026» (si es real) |
| «Meses sin intereses», «financiamiento», «crédito aprobado» | Ofertas financieras: necesitan condiciones claras (plazo, tasa, banco) | Quitarlo, o ponerlo con todas las condiciones |
| «Distribuidor oficial», «certificado por Girbau» | Solo si se puede comprobar | «Distribuidor Girbau en Occidente» (si es real) |
| Precios distintos a lo que cobra el vendedor | Precio engañoso | El precio real, o «Cotiza por WhatsApp» |
| «Mejor que Speed Queen», «más barato que Electrolux» | Marcas de terceros y comparaciones que no se pueden comprobar | Hablar solo del equipo propio |
| MAYÚSCULAS COMPLETAS, «!!!», emojis en exceso | Estilo que Google rechaza en anuncios | Texto normal |

### 3.2 Lo que no debe aparecer en la página

- **Ventanas emergentes** o capas que tapen el contenido o sean difíciles de cerrar.
- **Redirecciones automáticas:** que la página mande sola a otro lado. Un enlace que la persona decide tocar **sí** está permitido.
- **Contadores de tiempo falsos** o mensajes como «3 personas están viendo esto».
- **Reseñas, testimonios, calificaciones o logos de clientes inventados.** Solo reales y con permiso, también en los datos estructurados.
- **Logos de marcas** que el cliente no distribuye.
- **Botones engañosos:** que digan «Descargar» o «Ver precio» y hagan otra cosa.
- **Números de teléfono distintos** a los de los botones de llamada aprobados.
- **Formularios que pidan datos de más** (INE, CURP, datos bancarios). Todo formulario nuevo lleva el aviso de privacidad visible.
- **Enlaces rotos**, secciones vacías o «Próximamente».
- **Que la parte de arriba de la página deje de hablar de lo que dice el anuncio.**

---

## 4. Lista para antes de publicar

**Rodolfo**
- [ ] Banner después del bloque principal (o franja delgada arriba) y sin ventana emergente
- [ ] H1, texto principal y botones principales sin cambios
- [ ] Botón de WhatsApp del banner con el número de esa página y el mensaje «(banner Girbau [modelo])»
- [ ] Sin redirecciones automáticas; enlaces https en la misma pestaña
- [ ] Imagen WebP o AVIF de máximo 150 KB, con `width`/`height` y `lazy` si va abajo
- [ ] Sin frases de la sección 3
- [ ] PageSpeed en celular antes y después (no baja más de 5 puntos)
- [ ] Probado en celular: WhatsApp del banner, WhatsApp principal, llamada y carga completa
- [ ] Si hay página nueva: title, H1, ficha, `Product` sin reseñas inventadas, sitemap y canonical
- [ ] Línea `BANNER · …` mandada a Sandy

**Sandy**
- [ ] No se cambiaron URL finales ni se crearon acciones de conversión
- [ ] Vaciado esa noche y la siguiente
- [ ] Administrador de políticas a las 24–48 horas
- [ ] Comparación de 7 días antes y después
- [ ] Si la página del equipo está lista: enlace de sitio por script (Vista previa, luego OK)
- [ ] Pedir la indexación de la página nueva en Search Console

---

## 5. Lo que necesitamos del cliente

1. Modelo exacto del equipo y para qué tipo de lavandería es.
2. 2 o 3 fotos reales del equipo **sin texto encima**, en buena resolución (mínimo 1200 px por lado).
3. Ficha técnica: capacidad, medidas, consumo, voltaje y garantía.
4. Precio o rango real y hasta cuándo es válido, o «solo cotización».
5. En qué páginas lo quieren: Girbau y Quick Laundry, o también otras.
6. Confirmar si pueden usar la marca Girbau en las páginas y anuncios de Quick Laundry.
