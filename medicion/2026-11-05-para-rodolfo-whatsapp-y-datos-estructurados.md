# Para Rodolfo: mensaje de WhatsApp ya escrito y datos estructurados de Girbau

**Fecha:** 2026-11-05 · **De:** Sandy · **Para:** Rodolfo y su Claude

Son dos temas:

1. **WhatsApp con mensaje ya escrito.** Es urgente: lo necesitamos para el reporte diario que pidió el cliente.
2. **Un aviso de Search Console en girbauoccidente.com.** Puede esperar.

---

## 1. WhatsApp con mensaje ya escrito (urgente)

### Por qué ahora

En la junta del 5 nov me comprometí con el cliente a dar todos los días cuántos contactos llegaron por WhatsApp, cuántos por llamada y cuántos por correo o formulario. Lo vamos a comparar con lo que cuenta cada vendedor, porque hoy los números no coinciden.

Para que el vendedor sepa qué WhatsApp vienen de la página, el mensaje tiene que llegarle ya escrito y con una frase fija al principio.

### Qué se necesita

Todos los botones y enlaces de WhatsApp de las 5 páginas deben abrir `wa.me/<número>?text=<mensaje>`. El mensaje empieza siempre con la misma frase.

| De dónde se abre | Mensaje (va en `text`, codificado con `encodeURIComponent`) |
|---|---|
| Botón de WhatsApp de una sección | `Hola, vengo de la página de [Marca]. Me interesa información de [tema de la sección].` |
| Botón de WhatsApp de la portada | `Hola, vengo de la página de [Marca]. Quiero información.` |
| Formulario (modo WhatsApp, mientras no esté el correo) | `Hola, vengo de la página de [Marca] (formulario). Soy [nombre], me interesa [qué necesita], en [ciudad].` |
| Botón de WhatsApp después del cotizador (Kingstar y Girbau) | `Hola, vengo de la página de [Marca] (cotizador). …` y lo que ya mande el cotizador |

**Ejemplos:**

- `Hola, vengo de la página de Gamesail. Me interesa información de secadoras industriales.`
- `Hola, vengo de la página de Kingstar. Me interesa información de lavadoras de alta capacidad.`

**Reglas:**

- **La frase «vengo de la página de [Marca]» va igual en todos.** Es la que los vendedores van a buscar para contar.
- **«(formulario)»** solo en el formulario, para que el vendedor distinga un formulario de un botón.
- **El tema es el de la sección**, con palabras normales. Nada de rutas, códigos, `gclid` ni nada que parezca rastreo.
- **No cambies cómo se miden los botones.** Cada uno sigue mandando su conversión y su evento a Analytics, solo con cookies aceptadas. Tampoco cambian el número ni la etiqueta.
- **No metas datos de la persona en ningún evento.** El nombre y la ciudad solo van en el texto del WhatsApp, que es lo que la persona le manda al vendedor.

### Cuando quede

Una línea por sitio:

`WA · dominio · mensaje ya escrito (sí/no) · frase «vengo de la página» (sí/no) · formulario con «(formulario)» (sí/no)`

---

## 2. Search Console: aviso de datos estructurados en girbauoccidente.com (puede esperar)

### Qué llegó

Search Console mandó este aviso: «Datos estructurados de Fragmentos de productos: Debe especificarse "offers", "review" o "aggregateRating"».

Significa que la página tiene marcado de producto (JSON-LD `@type: Product`) sin precio, sin reseñas y sin calificación. Por eso Google no puede mostrar ese producto con estrellas o precio en la búsqueda.

**No afecta los anuncios, la aprobación del botón de llamada ni la posición normal en Google.** Solo quita la posibilidad de salir con ese formato especial.

### Qué hacer (en este orden)

1. Busca los bloques `Product` en girbauoccidente.com. Revisa también las otras 4 páginas: es probable que tengan el mismo patrón y que el aviso llegue después.
2. **Si el cliente tiene un precio real o un «desde $…» que se pueda publicar,** agrega `offers` con ese precio:
   - `@type: Offer` o `AggregateOffer`;
   - `priceCurrency: "MXN"`;
   - `price`, o `lowPrice` y `highPrice`;
   - `availability`.

   Ese precio lo tiene que confirmar el cliente. Lo pido yo.
3. **Si no hay precio publicable** (es lo más probable por ahora), quita `@type: Product` de esos bloques. Deja el marcado de la empresa (`Organization` o `LocalBusiness`) con nombre, teléfono +52 y dirección.
4. **Nunca agregues `review` ni `aggregateRating` inventados.** Solo con reseñas reales y con permiso, como siempre.
5. Publica y avísame. Yo le pido a Search Console que lo vuelva a validar.

### Lo que no se toca

Las direcciones, el teléfono +52 con `tel:`, la etiqueta de verificación de Search Console, el AW, el G- y las reglas de cookies.

### Cuando quede

`SC · girbauoccidente.com · Product con offers reales / Product quitado · otras páginas revisadas (sí/no)`
