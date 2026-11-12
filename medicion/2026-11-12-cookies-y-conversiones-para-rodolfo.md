# Cookies y conversiones que Google no ve: pedido para Rodolfo

**Fecha:** 12 nov 2026

## Qué vimos

El 11 nov, en Gamesail, Resend avisó 9 leads y Google contó solo 1. En Quick Laundry, Google vio 3 de 6.

Hoy `gtag` carga **solo después de que la persona toca «Aceptar»** en el aviso de cookies. Quien no acepta, o cierra el aviso sin tocarlo:

- **sí le llega al vendedor** (el correo sale igual);
- **pero Google nunca se entera** de ese contacto.

Por eso Google cuenta menos de lo que llega. Además:

- La puja automática aprende solo con quien acepta cookies. Por eso cree que las campañas rinden menos de lo que de verdad rinden.
- El costo por contacto que vemos en Google sale más alto de lo real.

## Lo que pedimos

1. **Dato rápido:** de cada 100 visitas, ¿cuántas tocan «Aceptar», cuántas «Rechazar» y cuántas no tocan nada? Por marca, si se puede. Solo conteos.
2. **Modo de consentimiento avanzado de Google (Consent Mode v2):**
   - Que `gtag` cargue al abrir la página, con todo en «denied» por defecto (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`).
   - Al tocar «Aceptar», que pase a «granted» como hoy.
   - Así, sin cookies, Google recibe un aviso anónimo y puede **estimar** los contactos de quien no aceptó (conversiones modeladas).
   - No se guardan cookies ni se mandan datos de la persona sin su permiso.
   - `ad_user_data` se queda en «denied» como hasta hoy: no mandamos datos de personas a Google.
3. **Revisar con Tag Assistant:**
   - sin aceptar, debe salir el ping con `gcs=G100`;
   - aceptando, el ping con `G111`.
4. **No cambiar:** el texto del aviso de cookies y privacidad (solo revisar que mencione la medición de anuncios), las etiquetas AW, los eventos ni el correo de Resend.

Al terminar, contesta con una línea:

`S10 · consentimiento avanzado · en vivo desde <fecha> · aceptan X de cada 100`
