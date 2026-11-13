# Para Rodolfo: que Google Ads cuente los contactos que de verdad llegan (cookies)

**Fecha:** viernes 13 de noviembre de 2026 · **De:** Sandy (Atelback, Google Ads) · **Para:** Rodolfo y su Claude · **Prioridad:** alta

> Este documento **reemplaza y amplía** el pedido del 12 nov (`medicion/2026-11-12-cookies-y-conversiones-para-rodolfo.md`). Lo que pedía (S10) sigue igual, y se suman dos cosas: `url_passthrough` y revisar que los eventos no esperen a «Aceptar».
>
> Siguen vigentes las reglas de `2026-11-04-contexto-para-el-claude-de-rodolfo.md`: no se tocan direcciones, AW, G-, teléfonos ni el correo de Resend, y no se mandan datos de la persona a Google.

---

## 1. El problema, en corto

**Google Ads está viendo entre 1 de cada 3 y 1 de cada 2 contactos reales.**

| Día | Contactos que contó Google | Personas reales (Resend + llamadas) |
|---|---|---|
| 11 nov · Gamesail | 1 | 9 |
| 11 nov · Quick Laundry | 3 | 6 |
| 12 nov · las 5 marcas | 8 | ~17 |

- **La causa principal son las cookies.** Hoy `gtag` carga **solo después de que la persona toca «Aceptar»**. Quien rechaza, cierra el aviso o no lo toca **sí le llega al vendedor**, pero Google nunca se entera.
- **Por qué importa más de lo que parece:**
  - La puja automática de Google aprende con lo que ve. Si ve la mitad, cree que la campaña rinde la mitad. Entonces puja con miedo, gasta menos y **no deja crecer** las campañas que sí traen.
  - El costo por contacto que muestra Google sale más alto que el real. Eso le da argumentos al cliente para decir que «los leads están caros».
- **Un caso aparte:** en Gamesail, `/lavadoras-por-capacidad` lleva dos días con 0 contactos en Google y 2 a 3 en Resend. Eso huele a que **la conversión no se dispara en esa página**, no a cookies. Ver sección 5.

---

## 2. La estrategia: no quitar el aviso, medir mejor sin cookies

**Lo que decidimos:**
- **No quitamos el aviso de cookies.** Cargar todo sin pedir permiso subiría el conteo, pero rompe lo que dice el aviso de privacidad. Además, va contra la decisión del 3 nov de no mandar nada de la persona sin su permiso.
- **Lo que hacemos:** que Google reciba **un aviso anónimo, sin cookies**, cada vez que alguien se convierte aunque no haya aceptado. Con esos avisos, Google **estima** los contactos que no ve («conversiones modeladas») y los suma a sus números. Esto es el **modo de consentimiento avanzado** de Google.

| Opción | ¿Sube lo que ve Google? | Riesgo | Decisión |
|---|---|---|---|
| A · Quitar el aviso y cargar todo sin permiso | Sí, casi todo | Legal y de confianza: contradice el aviso de privacidad | ❌ No |
| **B · Consentimiento avanzado + `url_passthrough`** | Sí, por estimación de Google | Bajo: sin cookies ni datos de la persona sin permiso | ✅ **Ahora (Fase 1)** |
| **C · Aviso más claro, sin trucos** | Algo: acepta más gente | Ninguno, si «Rechazar» se ve igual de claro | ✅ **Ahora (Fase 1)** |
| D · Contacto desde el servidor (Resend → Google Ads) | Sí, el conteo real | Medio: más trabajo y hay que evitar contar doble | ⏸ **Fase 2**, solo si la Fase 1 no alcanza |

---

## 3. Fase 1 · Lo que pedimos ahora (S10)

### 3.1 Dato rápido antes de cambiar nada
De cada 100 visitas, por marca si se puede, solo conteos:
- cuántas tocan **«Aceptar»**;
- cuántas tocan **«Rechazar»**;
- cuántas **no tocan nada**.

Con eso sabremos cuánto se puede recuperar.

### 3.2 Modo de consentimiento avanzado (Consent Mode v2)
`gtag` carga **al abrir la página**, antes de que la persona decida, con todo en «denied». Al tocar «Aceptar» pasa a «granted», como hoy.

```js
// 1) ANTES de cargar gtag.js y antes de cualquier config
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',        // se queda en denied SIEMPRE: no mandamos datos de personas a Google
  ad_personalization: 'denied',
  wait_for_update: 500
});
// Sin cookies, pasa el identificador del clic del anuncio por la dirección al navegar entre páginas
gtag('set', 'url_passthrough', true);
gtag('js', new Date());
gtag('config', 'AW-XXXXXXXXXX');   // el de ESE sitio, sin cambios
gtag('config', 'G-XXXXXXXXXX');    // el de ESE sitio, sin cambios

// 2) Al tocar «Aceptar» (y al volver a entrar, si ya había aceptado antes):
gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
// ad_user_data y ad_personalization quedan como están hoy
```

**Detalles que importan:**
1. **Que los eventos no esperen a «Aceptar».** Las conversiones de WhatsApp, teléfono y formulario, y `generate_lead`, `clic_whatsapp` y `clic_telefono`, deben mandarse **siempre**.
   - Hoy el código puede tener un `if (aceptoCookies)` antes de `registrar(...)` o de cargar `RastreoClics`. **Ese filtro se quita:** con el modo avanzado, gtag ya decide solo si usa cookies o manda el aviso anónimo.
   - Sin este cambio, el modo avanzado no sirve de nada.
2. **`url_passthrough: true`.** Sin cookies, Google no puede recordar de qué anuncio vino la persona al pasar a otra página del sitio. Esta opción le pega el identificador del clic a la dirección mientras navega.
   - **Revisa que no rompa nada:** que las secciones abran bien con parámetros extra y que el formulario no falle.
   - **No actives `ads_data_redaction`:** borra justo ese identificador y le quita a Google con qué estimar.
3. **Recordar la decisión.** Si la persona ya aceptó en otra visita, manda el `update` a «granted» en cuanto cargue la página.
4. **Una sola etiqueta.** Que no quede otra copia de gtag ni de Tag Manager cargando los mismos AW o G-, porque contaría doble (S6 sigue como estaba).

### 3.3 Aviso de cookies más claro, sin trucos
- **Que no tape la página ni los botones de WhatsApp y teléfono.** Que sea una barra abajo, no una ventana en medio.
- **«Aceptar» y «Rechazar» del mismo tamaño y igual de visibles.** Nada de esconder el rechazo: además de ser mala práctica, hace desconfiar.
- **Texto corto y claro**, por ejemplo: «Usamos cookies para saber qué anuncios te trajeron aquí y mejorar la página.» Con un enlace al aviso de privacidad.
- **El aviso de privacidad** debe mencionar que se miden los anuncios con herramientas de Google, con y sin cookies.

### 3.4 Cómo comprobarlo (Tag Assistant)
En una vista previa de Vercel, con la conversión de prueba apagada, como en S8:

| Prueba | Debe pasar |
|---|---|
| Abrir la página sin tocar el aviso | gtag carga; el ping trae `gcs=G100` |
| Tocar WhatsApp **sin aceptar** | sale la conversión de WhatsApp (ping sin cookies, con `gcs=G100`) |
| Aceptar y tocar WhatsApp | sale con `gcs=G111`, igual que hoy |
| Entrar con `?gclid=PRUEBA` sin aceptar y pasar a otra sección | la dirección conserva el `gclid` (`url_passthrough`) |
| Volver a entrar después de aceptar | el `update` a granted sale al cargar, sin pedir otra vez |
| Formulario | el correo sale igual que hoy (Resend no cambia) |

### 3.5 Respuesta
```
S10 · <marca> · consentimiento avanzado (sí/no) · eventos sin esperar «Aceptar» (sí/no) · url_passthrough (sí/no) · aviso nuevo (sí/no) · en vivo desde <fecha y hora>
S10 · aceptan X de cada 100 · rechazan Y · no tocan Z   (por marca si se puede)
```

---

## 4. Qué esperar (para no prometer de más)

- **Las conversiones estimadas tardan en aparecer** unos días después de activarlo, y Google las mezcla en las mismas columnas de conversiones. No salen separadas.
- **Google solo estima cuando hay suficiente tráfico.** Según su documentación (no lo pude verificar hoy), pide del orden de cientos de clics por semana en cada sitio. Con nuestro volumen:
  - el 12 nov, Gamesail tuvo ~96 clics al día y las demás marcas entre 12 y 54;
  - **es posible que solo Gamesail, y quizá Girbau, alcancen a recibir estimación.**
- **Aun sin estimación, ganamos:**
  - los eventos llegan a Analytics sin cookies;
  - con `url_passthrough` el anuncio sigue atribuido al navegar entre páginas;
  - quien acepta tarde sigue contando.
- **Cómo lo medimos:** Sandy sigue el «empate» diario (Google contra Resend). Si en 2 semanas Google sigue viendo menos de la mitad, pasamos a la Fase 2.

---

## 5. Aparte: Gamesail `/lavadoras-por-capacidad`

Dos días seguidos sin contactos en Google y con 2 a 3 en Resend, mientras «Para ropa» sí cuenta. Revisa en esa sección:
- que el botón de WhatsApp sea un enlace `wa.me` o llame a `registrar('whatsapp')`;
- que el formulario llame a la conversión cuando el correo sale bien;
- en Tag Assistant, aceptando cookies, que salga la conversión hacia `AW-18531600046`.

Respuesta: `S11 · Gamesail · por-capacidad · conversión WhatsApp (sí/no) · formulario (sí/no) · qué estaba mal`

---

## 6. Fase 2 (no construir todavía): el contacto desde el servidor

Solo si la Fase 1 no alcanza. Es para dejarlo pensado.

- Cuando el formulario sale bien en Resend, el servidor ya sabe que hubo un contacto real. Con `url_passthrough`, además, la dirección puede traer el identificador del clic (`gclid`) aunque no haya cookies.
- El servidor guardaría ese `gclid` junto al envío. Después se sube a Google Ads como conversión **desde el servidor**: directo, o con el puente de Go High Level (`claude/puente-ghl`).
- **Cuidado:**
  - Habría que pasar la conversión de la página a **secundaria** para no contar doble.
  - Es una decisión de privacidad que toma Sandy: no lleva datos de la persona, pero usa el identificador del anuncio sin cookies.
  - **No se construye sin su OK.**

---

## 7. Lo que no se toca

Las direcciones, los AW y sus etiquetas, los G-, el +52, Search Console, el correo de Resend y quién recibe los formularios. `ad_user_data` sigue en «denied».
