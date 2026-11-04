# Para Rodolfo: formularios por correo (S8), todo lo que se necesita

**Fecha:** 2026-11-04 · **De:** Sandy · **Para:** Rodolfo y su Claude · **Prioridad:** alta, esta semana

Este documento reúne en un solo lugar lo que necesita el formulario: para qué es, cómo debe funcionar, cómo debe estar armado el HTML y qué medir. **Si algo de aquí choca con la guía anterior (`medicion/nextjs/README.md` y `Guia-medicion-landings.md`), manda este documento.** Sobre todo en lo de no mandar datos de la persona a Google.

---

## 0. Del lado de Google Ads ya está todo listo

No hay que crear ni cambiar nada en Google Ads para encender el correo.

| Qué | Estado | Cómo lo sabemos |
|---|---|---|
| La acción «AB · Formulario enviado» en las 5 cuentas | ✅ Existe. Es **principal** y cuenta **una por envío**. | Vaciado del 4 nov. Ya registró envíos en Quick Laundry (6), Girbau (3), Kingstar (2) y Laundry Solutions (1). |
| Gamesail | ✅ Existe. Dice «Inactiva» hasta el primer envío real, y es normal. | Revisión de objetivos, 3 nov |
| Formularios de Google dentro del anuncio (los viejos que mandaban a correos viejos) | ✅ No hay ninguno en ninguna cuenta | Vaciado del 4 nov, sección 3 |
| Las etiquetas de cada sitio | ✅ No cambian | Tabla de la sección 6 |
| Conversiones mejoradas o datos de la persona | ✅ **No se usan**. No hay que activar nada. | Decisión del 3 nov (privacidad) |

**Conclusión:** el formulario manda la misma conversión que hoy, solo que **cuando el correo sale bien**. Cuando lo enciendas, en Google Ads no cambia nada.

---

## 1. Para qué

- **Hoy el formulario abre WhatsApp al enviar** (modo WhatsApp, con el interruptor «correo en vivo» apagado). En computadora mucha gente no tiene WhatsApp abierto, así que el contacto se pierde aunque haya llenado todo.
- **Con el correo, ningún formulario se pierde.** Le llega al vendedor de la marca y a dirección, aunque la persona no tenga WhatsApp.
- **Los vendedores reportan cada lunes cuántos contactos les llegaron y cuántos eran buenos.** El correo les deja un registro fácil de contar.

---

## 2. A quién le llega

| Sitio | Para (vendedor) | Copia, en los cinco sitios |
|---|---|---|
| supliese.com | llopez@supliese.com · Liliana López | agomez@supliese.com · kgomez@supliese.com · pgomez@supliese.com · rmaravilla@supliese.com |
| clmmexico.com | asesor@clmmexico.com · Jorge Ruiz | (las mismas 4) |
| servicioparalavanderias.com | mantenimiento@supliese.com · Sergio Cervantes | (las mismas 4) |
| girbauoccidente.com | asesor@girbauoccidente.com · Eduardo Román | (las mismas 4) |
| gamesail.mx | smolina@supliese.com · Silvia Molina | (las mismas 4) |

- `leads.supliese@gmail.com` **no se usa**.
- **Responder a (`Reply-To`):** el correo de la persona, si lo dio. Así el vendedor le contesta directo con «Responder».
- **Remitente:** el de la cuenta de envío que configuraste en Resend, en el dominio de Atelback. El dominio necesita SPF, DKIM y DMARC para que no caiga en spam.

---

## 3. Cómo debe funcionar, paso a paso

1. La persona llena el formulario. En el navegador se valida antes de enviar: teléfono de 10 dígitos y correo con formato correcto si lo escribe.
2. **El envío va por `POST` a una ruta del servidor**, por ejemplo `/api/contacto`. **Nunca por `GET`, ni con los datos en la URL.**
3. **El servidor:**
   - vuelve a validar;
   - revisa la trampa para robots (sección 5);
   - limita el número de envíos por minuto desde una misma IP;
   - manda el correo con Resend.
4. **Si el correo sale bien (respuesta 2xx):**
   - En la misma página aparece el mensaje «¡Listo! [Vendedor] te contacta en breve», sin redirigir a otra página.
   - Se registra la conversión **una sola vez**, con un `transaction_id` único de ese envío (sección 6).
   - Se ofrece, opcional, «¿Prefieres WhatsApp? Escríbenos». Si la persona lo toca, cuenta como **WhatsApp**, no como otro formulario.
5. **Si el correo falla:**
   - Aparece un mensaje amable y el botón «Enviar por WhatsApp», con el mensaje ya escrito con lo que llenó (nombre, equipo, ciudad).
   - Si lo abre, se cuenta **un** «Formulario enviado» con el mismo `transaction_id`. Es la regla de hoy: se cuenta cuando el envío sale bien **o** cuando se abre el WhatsApp de respaldo, pero nunca las dos cosas.
   - El error se registra en el servidor para revisarlo.
6. **El interruptor «correo en vivo» se queda por sitio.** Si un sitio tiene problemas, se apaga solo ese y vuelve al modo WhatsApp.

---

## 4. Qué lleva el correo

**Asunto:** `[Marca] Nuevo contacto · sección · Nombre`.
Por ejemplo: `[Kingstar] Nuevo contacto · lavadoras-alta-capacidad · Juan Pérez`.

**Cuerpo, en este orden:**

1. Nombre
2. Teléfono / WhatsApp, como enlace `tel:` y enlace `wa.me`, para que el vendedor toque y llame
3. Correo, si lo dio
4. Ciudad o estado
5. Qué necesita (equipo o servicio)
6. Mensaje
7. Marca y sección: la dirección de la página desde la que se envió
8. Fecha y hora en hora de México (`America/Mexico_City`)
9. **Origen:** «Anuncio de Google» si la visita trajo `gclid` o `utm_source=google` con `utm_medium=cpc`; si no, «Búsqueda o directo». Solo esa palabra: no el `gclid` completo ni datos de la cookie.

**Nada más:** ni IP ni datos del navegador.

---

## 5. El HTML del formulario

Revisa que el formulario de cada sitio cumpla esto. Si ya lo cumple, no lo cambies.

### Campos

| Campo | `name` | Tipo y atributos | ¿Obligatorio? |
|---|---|---|---|
| Nombre | `nombre` | `type="text"` · `autocomplete="name"` | Sí |
| Teléfono / WhatsApp | `telefono` | `type="tel"` · `inputmode="tel"` · `autocomplete="tel"` · 10 dígitos | Sí |
| Correo | `correo` | `type="email"` · `autocomplete="email"` | No |
| Ciudad o estado | `ciudad` | `type="text"` · `autocomplete="address-level2"` | No |
| Qué necesita | `interes` | `<select>` con los equipos o servicios de **esa marca** (por ejemplo, en Gamesail: lavadoras para ropa, por capacidad, secadoras, hoteles y hospitales, mangles, otro) | Sí |
| Mensaje | `mensaje` | `<textarea>` | No |

**Pocos campos:** cada campo de más hace que menos gente termine el formulario. No agregues campos nuevos.

### Lo demás

- **Cada campo con su `<label>` visible.** No basta con el texto de ejemplo dentro del campo.
- **Campos ocultos:**
  - `marca`;
  - `seccion`: la dirección de la página, igual que el parámetro de Analytics;
  - `origen`: «anuncio» o «directo», calculado en el navegador con el `gclid` o los `utm` de la URL de entrada.
- **Trampa para robots:** un campo extra escondido con CSS, por ejemplo `name="empresa_web"`, con `tabindex="-1"` y `autocomplete="off"`. Si llega lleno, el servidor descarta el envío sin avisar. Agrega también un tiempo mínimo: si se envía en menos de 3 segundos después de cargar, se descarta. **No pongas reCAPTCHA visible**, porque baja los envíos reales.
- **Aviso de privacidad:** una línea junto al botón, por ejemplo «Al enviar aceptas el [aviso de privacidad](…)», con enlace al aviso de ese sitio. El aviso debe decir que los datos del formulario se usan para contactar y cotizar, y que llegan al vendedor de la marca.
- **El botón:** hoy dice «Enviar por WhatsApp». Con el correo en vivo debe decir **«Enviar»** o **«Solicitar cotización»**. Mientras se envía, se desactiva para que no se mande dos veces.
- **Mensaje de éxito y de error** dentro de un contenedor con `aria-live="polite"`.
- **Sin redirección a una página de «gracias» con datos en la URL.** Si algún sitio ya tiene página de «gracias», que no lleve parámetros con datos de la persona.
- **Kingstar y Girbau, el cotizador:** se queda como lo dejaste. El botón de WhatsApp después del cotizador cuenta como WhatsApp.

---

## 6. Medición

**Lo que se manda cuando el envío sale bien, y nada más:**

```js
// Google Ads: la etiqueta «AB · Formulario enviado» de ESE sitio, con un id único del envío
gtag('event', 'conversion', {
  send_to: 'AW-XXXXXXXXXX/ETIQUETA_FORMULARIO',
  transaction_id: idDelEnvio   // por ejemplo crypto.randomUUID(), el mismo que usa el WhatsApp de respaldo
});
// Google Analytics
gtag('event', 'generate_lead', { seccion: 'lavadoras-alta-capacidad' });
```

- **Sin `user_data`, sin correo y sin teléfono en ningún evento, en `dataLayer` ni en la URL.**
  - Si en el código queda `registrarFormulario({ correo, telefono })` de la guía anterior, cámbialo para que no mande esos datos.
  - `ad_user_data` se queda en `denied`. Eso además evita que la detección automática de las etiquetas viejas de Quick Laundry y Kingstar (S6) tome el correo del formulario.
- **Solo con cookies aceptadas,** como hoy. Si la persona no aceptó, el correo igual sale al vendedor; solo no se mide.

| Sitio | AW | Etiqueta «AB · Formulario enviado» |
|---|---|---|
| supliese.com | AW-11012403016 | GXpQCICiqaQdEMjej4Mp |
| clmmexico.com | AW-17632937663 | ZVekCNiP-qMdEL-NhdhB |
| girbauoccidente.com | AW-18232185431 | DlNhCJvG7KMdENek5PVD |
| servicioparalavanderias.com | AW-10977798087 | 4OIPCNHR-6MdEMfPz_Io |
| gamesail.mx | AW-18531600046 | b-alCJLg1rEdEK6Nx4RF |

---

## 7. Prueba antes de encender (una sola vez por vendedor)

1. **Prueba en una versión de vista previa de Vercel, no en el sitio real**, y con la conversión **apagada** en esa vista previa: sin `gtag` o con un interruptor. Así las pruebas no cuentan como contactos en Google Ads.
2. Avisa a cada vendedor y manda **una** prueba por sitio. Confirma con cada uno que llegó a **su bandeja de entrada** (y no a spam), y que llegaron las **4 copias**.
3. Si cae en spam, que lo marquen como «no es spam» y que agreguen el remitente a sus contactos.
4. Cuando los 5 confirmen, enciende «correo en vivo» en cada sitio y publica.
5. **Después de encenderlo, no se mandan pruebas en el sitio real.** Cada envío es un cliente.

---

## 8. Lo que no se toca

- Las direcciones de las páginas y de las secciones, porque los anuncios llevan ahí.
- El teléfono +52, la etiqueta de Search Console, el AW, el G- y las reglas de cookies.
- Los botones de WhatsApp y teléfono, y cómo se miden.

---

## 9. Cuando quede

Mándale a Sandy una línea por sitio:

`S8 · dominio · correo en vivo (sí/no) · prueba recibida por el vendedor (sí/no) · 4 copias recibidas (sí/no) · conversión solo al enviar bien (sí/no) · sin datos de la persona a Google (sí/no)`

Y al final: `S8 · formularios por correo · en vivo`.

**Una pregunta antes de empezar:** ¿qué falta para la cuenta de envío? La clave de Resend en Vercel y el DNS del dominio del remitente. Si necesitas algo de Sandy o del cliente, dilo aquí.
