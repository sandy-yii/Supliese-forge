# Contexto para la sesión de Claude de Rodolfo

**Al día:** martes 3 de noviembre de 2026 por la noche, hora de México.

**De:** Sandy (Atelback, Google Ads). **Para:** Rodolfo y su sesión de Claude (páginas de las 5 marcas).

**Para qué sirve:** que la sesión de Rodolfo sepa qué se hizo del lado de Google Ads y de Analytics, qué direcciones no se pueden mover y qué falta de cada lado.

> **Cómo usarlo:** léelo completo antes de tocar rutas, etiquetas o formularios. Si algo de aquí choca con lo que ves en el repo de las páginas, no lo cambies: avísale a Sandy con una línea.

---

## 1. Reglas que siguen vigentes

- **No cambies, renombres ni redirijas las direcciones de la sección 2.** Los anuncios llevan ahí. Si una deja de abrir o cambia, Google vuelve a revisar los anuncios y salen menos durante horas o días.
  - Si hace falta mover una, avisa antes. Sandy cambia los anuncios con un script primero y luego tú mueves la página.
- **No crees acciones de conversión nuevas ni cambies las etiquetas `AW-…/…`.** Si se duplican, cada contacto cuenta dos veces.
- **No mandes formularios de prueba** a los vendedores una vez que el correo esté en vivo. Antes de encenderlo (S8), sí: una prueba por vendedor, avisando.
- **Solo reseñas reales, con permiso.** Si no hay, nada. Tampoco logos ni cifras sin confirmar.
- **El teléfono del vendedor tiene que verse como texto** en la página de cada marca (sección 3). Google lo exige para aprobar el botón de llamada de los anuncios.
- **Nada de datos de la persona hacia Google.** Ni `user_data`, ni correo, ni teléfono en eventos o URLs.
- **Fechas:** en Google Ads, todo va en hora de México.

---

## 2. Direcciones a las que llevan los anuncios hoy

Todas tienen que responder 200 con https, sin redirigir a otra ruta.

| Marca | Página de la marca (portada) | Secciones con anuncios propios |
|---|---|---|
| Quick Laundry | https://supliese.com/ | /lavadoras-de-monedas · /lavadoras-para-negocio |
| Kingstar (cuenta CLM) | https://clmmexico.com/ | /lavadoras-alta-capacidad · /lavanderia-hotelera · /tunel-de-lavado · /mangles · /lavadoras-40-kg |
| Laundry Solutions (Servicio para Lavandería) | https://servicioparalavanderias.com/ | /reparacion-lavadoras-industriales · /mantenimiento |
| Girbau | https://girbauoccidente.com/ | (solo la portada) |
| Gamesail | https://gamesail.mx/ | /lavadoras-para-ropa · /lavadoras-por-capacidad · /secadoras-industriales · /hoteles-y-hospitales · /mangles |

- **Gamesail:** sus anuncios pasaron a las 5 secciones el 3 de noviembre en la noche. El script se ejecutó sin errores y Google los está revisando. Competencia y Marca se quedan en la portada.
- **Girbau:** todos sus anuncios, enlaces de sitio y grupos de recursos ya van a girbauoccidente.com desde el 3 de noviembre. Google sigue revisando la campaña de Máximo rendimiento.
  - **`girbaupro.com` no se toca** hasta que Sandy mande `S2 · Girbau · lista`.
- **Dominios viejos, con su 301 ya hecho (S1, cerrado):**
  - quicklaundry.store, kingstar.com.mx y laundrysolutions.store llevan a su dominio de siempre, con el mismo camino y conservando `gclid`.
  - kingstarmexico.com y laundrysolutions.com.mx llevan a su marca.
  - Los 301 se quedan así.

---

## 3. Teléfonos que tienen que verse en cada página

| Marca | Teléfono (botón de llamada de los anuncios) |
|---|---|
| Quick Laundry | 33 2601 2237 |
| Kingstar | 33 1564 1538 |
| Laundry Solutions | 33 1417 2994 (Sergio Cervantes) |
| Girbau | 33 2806 8994 |
| Gamesail | 33 1185 9797 (Silvia) |

El botón de llamada de Quick Laundry, Kingstar y Girbau sigue en revisión con soporte de Google. En Kingstar, soporte ya confirmó que la página cumple.

---

## 4. Medición

### Google Ads

Las etiquetas de cada sitio están en `medicion/nextjs/etiquetas-por-sitio.md`. Ahí los dominios todavía dicen .store y girbaupro.com: las etiquetas son las mismas en el dominio de siempre.

**Gamesail (cuenta 118-347-6484):** tiene `AW-18531600046` y estas cuatro acciones «AB ·»:

| Acción | Etiqueta |
|---|---|
| WhatsApp | `NPyqCLamzrEdEK6Nx4RF` |
| Formulario | `b-alCJLg1rEdEK6Nx4RF` |
| Teléfono de la página | `r456CNDP1rEdEK6Nx4RF` |
| Correo | `iPUqCLGkzrEdEK6Nx4RF` |

**Comprobado con Tag Assistant en gamesail.mx/mangles (3 nov, noche), aceptando las cookies:**
- Cargan juntos `AW-18531600046` y `G-PR1LFKMC7M`.
- `gcs=G111`.
- La conversión de WhatsApp (`NPyq…`) y la de teléfono (`r456…`) salieron hacia la cuenta correcta.
- `clic_whatsapp` y `clic_telefono` llegan a Analytics con `seccion=mangles`.
- No se envió ningún formulario.
- Esos 2 clics de prueba se descuentan del primer día de Gamesail.

### Google Analytics 4

La cuenta es **«Supliese» (414517882)** y la administra Atelback con gamesailmx@gmail.com.

| Sitio | Propiedad | ID de medición |
|---|---|---|
| supliese.com | Quick Laundry · 562103316 | G-TX7B6KS0JV |
| clmmexico.com | Kingstar CLM · 562063611 | G-Y70PPJ8EY9 |
| servicioparalavanderias.com | Laundry Solutions · 562097548 | G-SQ8NJH4T0C |
| girbauoccidente.com | Girbau Occidente · 562055435 | G-V8XDCNQNLC |
| gamesail.mx | Gamesail · 562069677 | G-PR1LFKMC7M |

- **Instalado por Rodolfo el 3 nov (PR #50) y cerrado:**
  - El G- carga en la misma llamada de `gtag` que el AW, solo después de «Aceptar».
  - Al aceptar se manda `analytics_storage: granted`.
  - Los eventos `generate_lead`, `clic_whatsapp` y `clic_telefono` llevan `seccion`.
- **Hecho por Sandy el 3 nov:** creó la dimensión personalizada **«Sección»** (alcance Evento, parámetro `seccion`) en las 5 propiedades. No hay que crearla otra vez.
  - Los datos por sección empiezan a verse en 24 a 48 horas.
- **Configuración de las propiedades:** Google Signals apagado, datos proporcionados por los usuarios apagados, retención de 14 meses.
- **No uses `G-01K86YDLR3`:** era una cuenta duplicada y ya está en la papelera.
- **S6, propiedades viejas `G-69R59Z71PV` y `G-26FWQ5PPVJ`:** siguen recibiendo visitas de Quick Laundry y Kingstar por la configuración de la etiqueta en Google, no por el código de las páginas. **No las quites del código**; se ve del lado de Google con el cliente.

---

## 5. Lo que se hizo en Google Ads (contexto)

| Cuándo | Qué |
|---|---|
| 2–3 nov | Quick Laundry, Kingstar y Laundry Solutions pasaron a su dominio de siempre. Girbau, a girbauoccidente.com. |
| 3 nov | Quick Laundry: se bloquearon búsquedas de marcas que no vende (Speed Queen, Wascomat, Electrolux, Primus y otras). |
| 3 nov | Reacomodo de presupuesto en Kingstar y Quick Laundry, sin gastar más. Se movió dinero hacia alta capacidad, lavandería hotelera y lavadoras de monedas, que traen contactos. |
| 3 nov | Gamesail encendida: 7 campañas a la mitad del presupuesto la primera semana ($324 al día). Pasa a completo jueves o viernes si las búsquedas salen limpias. |
| 3 nov, noche | Los anuncios de Gamesail pasaron a sus 5 secciones. |

**Revisión diaria:** cada mañana se revisa el gasto, los contactos, los anuncios rechazados, las búsquedas y que cada página abra con su teléfono visible. Los cambios de presupuesto se hacen una vez por semana, los lunes.

**Junta diaria con el cliente desde el 4 nov:** Sandy presenta el avance del día. Si algo cambia en las páginas, avísale el mismo día para incluirlo.

---

## 6. Estado de las líneas S

```
S1 · cerrado (dominios viejos con 301 a su marca)
S2 · Quick Laundry, Kingstar, Laundry Solutions · cerrado
S2 · Girbau · lista (4 nov): girbaupro.com ya puede redirigir (301) a girbauoccidente.com, mismo camino
S3 · ninguna que usemos
S4 · Gamesail · cerrado y comprobado con Tag Assistant (3 nov)
S5 · cerrado (2 nov)
S6 · propiedades viejas en Quick Laundry y Kingstar: lo ve Sandy con el cliente; no tocar el código
S7 · cerrado: el teléfono de Girbau funciona
S8 · pendiente: formularios por correo (Resend); «correo en vivo» apagado hasta la prueba con vendedores
GA4 · cerrado en las cinco (3 nov), dimensión «Sección» creada
```

---

## 7. Pendientes

### De Rodolfo

- [ ] **S8, formularios por correo:**
  1. Que el envío quede listo.
  2. Una prueba por vendedor, avisando antes.
  3. Encender «correo en vivo» en las 5 páginas.
  4. Mandar `S8 · formularios por correo · en vivo`.
  - Falta decir dónde está el DNS de supliese.com.
- [ ] **WhatsApp con mensaje ya escrito** según la sección. Ejemplo: «Hola, quiero precio de secadoras industriales de 100 kg».
- [ ] **DNS en Akky** (lo hace Rodolfo a mano).
- [ ] **Responder:** ¿a qué hora del 3 nov quedó bien el cotizador de gamesail.mx? Es para no contar esas horas en la revisión.

### Del cliente (los pregunta Sandy en la junta)

Afectan las páginas de Gamesail.

- [ ] **¿Tienen secadoras de 130 y 200 kg?** Si sí, mandarán el modelo y la ficha, y se agregan a /secadoras-industriales. Si no, Sandy las quita de los anuncios.
- [ ] **¿Tienen dobladora de ropa?** Mismo caso, en /mangles.
- [ ] **¿La lavadora de 30 kg es solo de barrera sanitaria (hospital)?** La página ya lo dice así; Sandy ajusta los anuncios según la respuesta.
- [ ] **Reseñas reales o logos de clientes con permiso.** Si llegan, se agregan.

---

## 8. Cómo contestar a Sandy

Una línea por tema, como hasta ahora:

```
S8 · formularios por correo · en vivo
GA4 · dominio · G- instalado (sí/no) · analytics_storage al aceptar (granted/denied) · eventos (sí/no)
Marca · dirección exacta · abre con https (sí/no) · teléfono visible (sí/no) · etiqueta AW (sí/no)
```
