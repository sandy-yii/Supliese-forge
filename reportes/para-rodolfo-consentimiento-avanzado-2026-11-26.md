# Para Rodolfo: modo de consentimiento avanzado de Google en las 5 páginas

**Fecha:** 26 nov 2026
**Pide:** Sandy

## El problema (comprobado el 25 y 26 de noviembre)

Hoy la etiqueta de Google (`gtag.js`) **solo se carga cuando la persona toca «Aceptar»** en el aviso de cookies. Si lo ignora o toca «Rechazar», `gtag` no existe en la página. Cuando esa persona toca WhatsApp o envía el formulario, el evento de conversión se queda en `dataLayer` y **nunca le llega a Google Ads**.

Lo probamos en celular (iPhone 13 emulado) en clmmexico.com, gamesail.mx y servicioparalavanderias.com: sin «Aceptar», `typeof gtag === 'undefined'` y no sale ninguna petición a Google. Con «Aceptar», el evento `conversion` sí se envía a la cuenta correcta (por ejemplo `AW-17632937663/…` en Kingstar y `AW-18531600046/…` en Gamesail).

**El efecto:** el 25 de noviembre hubo 9 leads, y Google Ads solo registró 4. En Kingstar hubo 4 WhatsApp y Google vio 1. Google puja creyendo que las campañas casi no convierten.

## Qué hay que hacer

Pasar las 5 páginas a **Consent Mode v2 en modo avanzado**:
- girbauoccidente.com
- clmmexico.com
- gamesail.mx
- supliese.com
- servicioparalavanderias.com

### 1. Cargar `gtag.js` siempre, con todo negado por defecto

Esto va **antes** de cualquier `gtag('config', …)`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);  // sin cookies: Google no guarda datos de anuncios
  gtag('set', 'url_passthrough', true);     // conserva el gclid al navegar entre páginas sin cookies
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXXX');          // el ID de Google Ads de cada marca (el que ya usan)
  gtag('config', 'G-XXXXXXXXXX');           // el de Analytics de cada marca (el que ya usan)
</script>
```

Si la persona ya había aceptado en otra visita (la preferencia guardada), hay que mandar el `update` a `granted` justo después del `default`.

### 2. Cuando toque «Aceptar»

```js
gtag('consent', 'update', {
  ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
});
```

### 3. Cuando toque «Rechazar» o lo ignore

No se hace nada: todo se queda en `denied`. Google solo recibe avisos sin cookies y con eso modela las conversiones.

### 4. Los eventos de conversión se quedan como están

El `gtag('event', 'conversion', { send_to: … })` de WhatsApp y del formulario se manda **siempre**, se haya aceptado o no. Google decide cómo enviarlo según el consentimiento.

## Lo que NO se cambia

- El flujo de WhatsApp primero y la ventanita opcional de datos.
- Los avisos por Resend a los vendedores.
- Los botones, los textos de venta y los formularios.

## Texto nuevo del aviso de cookies

**Hoy dice:**
> «Si las rechazas, no se cargan y la página funciona igual.»

**Propuesta:**
> «Si las rechazas, no guardamos cookies en tu navegador ni te mostramos anuncios personalizados. Google solo recibe un aviso anónimo, sin cookies, cuando alguien nos contacta desde un anuncio, para medir qué anuncios funcionan. La página funciona igual.»

En el aviso de privacidad de cada página va una línea con lo mismo.

## Cómo comprobar que quedó

1. Abrir la página en una ventana de incógnito, **sin tocar el aviso de cookies**.
2. En la consola: `typeof gtag` debe dar `"function"`.
3. Con [Tag Assistant](https://tagassistant.google.com/): conectar la página, tocar WhatsApp sin aceptar cookies y revisar que aparezca el evento `conversion`, con consentimiento «denied».
4. Repetir después de tocar «Aceptar»: el mismo evento, con «granted».
5. Avisarle a Sandy. Yo lo reviso desde aquí y en 3 a 7 días se debe notar en Google Ads: más contactos registrados por campaña.
