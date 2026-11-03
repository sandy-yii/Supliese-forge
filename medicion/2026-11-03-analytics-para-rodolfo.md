# Para Rodolfo: Google Analytics propio, uno por sitio

2026-11-03 · De: Sandy · Para: Rodolfo · Responde a tu mensaje del 3 nov (versión «al día con todo lo de hoy»).

Gracias, todo anotado: los 301, los dos dominios viejos, `/lavadoras` y `/proveedores`, el $0 y el S7.

## 1. G-69R59Z71PV y G-26FWQ5PPVJ: ya no hace falta preguntar

Como nadie las administra de nuestro lado, **creamos nuestra propia cuenta de Google Analytics** (Supliese, 414517882, administrada por Atelback). Tiene **una propiedad por sitio**. Las dos viejas se quedan como están: no las quites ni las uses.

| Sitio | Propiedad | ID de medición |
|---|---|---|
| supliese.com | Quick Laundry · 562103316 | **G-TX7B6KS0JV** |
| clmmexico.com | Kingstar CLM · 562063611 | **G-Y70PPJ8EY9** |
| servicioparalavanderias.com | Laundry Solutions · 562097548 | **G-SQ8NJH4T0C** |
| girbauoccidente.com | Girbau Occidente · 562055435 | **G-V8XDCNQNLC** |
| gamesail.mx | Gamesail · 562069677 | **G-PR1LFKMC7M** |

Ya vienen con lo siguiente configurado:
- Google Signals apagado.
- La recogida de datos proporcionados por los usuarios, apagada.
- Retención de 14 meses.
- Medición mejorada encendida (vistas, desplazamiento, clics de salida, formularios, etc.).

**Si ves un G-01K86YDLR3 en algún lado, no lo uses**: se creó por error y se va a borrar.

## 2. Lo que te pido en cada sitio

- [ ] **Agregar su G- en la misma carga de `gtag` que ya tiene el AW de su marca.** Es decir, un `gtag('config', 'G-…')` junto al `gtag('config', 'AW-…')`. Así carga con las mismas reglas de cookies y no hace falta otro script.
- [ ] **Al aceptar cookies, `analytics_storage: 'granted'`.**
  - Hoy queda en `denied`: la prueba de Tag Assistant en girbauoccidente.com mostró `gcs=G110`. Con eso, Analytics casi no recibe datos.
  - `ad_user_data` puede seguir en `denied`.
  - Revisa que el aviso de cookies y el aviso de privacidad mencionen la medición de visitas (Google Analytics).
- [ ] **Nada de datos de la persona**: sin `user_data`, sin correo ni teléfono en eventos ni en la URL.
- [ ] **Los mismos tres contactos, también como eventos de Analytics** (en el mismo momento en que hoy mandas la conversión a Google Ads):

  | Evento GA4 | Cuándo |
  |---|---|
  | `generate_lead` | cuando el formulario se envía bien |
  | `clic_whatsapp` | al tocar cualquier botón de WhatsApp |
  | `clic_telefono` | al tocar el teléfono |

  Agrégales el parámetro `seccion` con la sección de la página (por ejemplo `mangles` o `lavadoras-para-negocio`). Así sabemos qué sección trae contactos.
- [ ] **No toques las conversiones de Google Ads**: las etiquetas AW y sus `send_to` se quedan igual.

**Cuando quede, mándame esta línea por sitio:**
`GA4 · dominio · G- instalado (sí/no) · analytics_storage al aceptar (granted/denied) · eventos (sí/no)`

La compruebo con Tag Assistant y con el informe en tiempo real de Analytics.

## 3. S8

Dime qué necesitas de mí para la «cuenta de envío» de los formularios: quién la crea, con qué correo y si tiene costo. No quiero que esto frene los formularios.

## Estado de las líneas S

```
S1 · cerrado (dominios viejos a su marca, 3 nov)
S2 · Quick Laundry, Kingstar, Laundry Solutions · cerrado · Girbau espera la aprobación de Google
S6 · las dos etiquetas viejas se quedan; la medición nueva es la de esta tabla
S7 · cerrado: el teléfono de Girbau funciona
S8 · pendiente: dime qué necesitas para la cuenta de envío
GA4 · nuevo: instalar los 5 G-
```
