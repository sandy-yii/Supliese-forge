# Para Rodolfo y su Claude: puente páginas → Go High Level → Google Ads

**Fecha:** domingo 8 de noviembre de 2026 · **De:** Sandy (Atelback, Google Ads) · **Para:** Rodolfo y su sesión de Claude

> **Cómo usarlo:** léelo completo antes de tocar código. Sigue valiendo todo lo de `medicion/2026-11-04-contexto-para-el-claude-de-rodolfo.md` y `medicion/2026-11-04-formularios-por-correo-para-rodolfo.md` (direcciones, teléfonos, etiquetas, S8). Si algo de aquí choca con lo que ves en el repo de las páginas, no lo resuelvas solo: avísale a Sandy con una línea.
>
> El código está en `medicion/nextjs/puente-ghl/`. Es **código de referencia**: hay que copiarlo y adaptarlo (rutas de import, nombre del estado de cookies, la ruta de Resend).

---

## 1. Qué queremos y por qué

Hoy Google Ads solo sabe que alguien **tocó WhatsApp o mandó el formulario**. No sabe quién terminó **cotizando o comprando**. Por eso optimiza para traer gente que escribe, no gente que compra.

Go High Level ya tiene esa información: es donde se da seguimiento a cada cliente. El puente hace que:

1. Cada contacto que llega de un anuncio entre a Go High Level **con la huella de su clic** (`gclid`, `gbraid` o `wbraid`).
2. Cuando el contacto avanza en el seguimiento («Cotizado», «Vendido»), **Go High Level se lo avisa a Google Ads** con su acción nativa **«Add to Google Ads»**, que necesita esa huella.
3. Google aprende qué búsquedas y campañas traen compradores. Además, el tablero puede mostrar **contactos → cotizaciones → ventas** por campaña.

Sin la huella, «Add to Google Ads» falla con un error de GCLID faltante. Este código resuelve justamente eso.

---

## 2. Antes de construir: 4 respuestas que necesita Sandy

Contesta estas antes de escribir código. Si alguna sale «no», el plan cambia.

```
P1 · ¿Cada marca tiene su propia subcuenta (location) en Go High Level? (sí/no; si no, cómo están)
P2 · ¿El WhatsApp de cada vendedor está conectado a Go High Level y los mensajes entran ahí? (sí/no por marca)
P3 · ¿Qué etapas tiene el pipeline? (nombres exactos; ej. Nuevo, Contactado, Cotizado, Vendido, Perdido)
P4 · ¿El plan de Go High Level permite «Private Integrations» (tokens de API)? (sí/no)
```

- **Si P2 es «no»:** la parte de WhatsApp (folio) no sirve todavía. Se hace solo la del formulario.
- **Si P1 es «no»:** hay que separar por marca de otra forma (etiqueta o pipeline por marca). Avísale a Sandy antes.

---

## 3. Reglas

**Siguen igual:**
- No se tocan las direcciones de las páginas ni las etiquetas `AW-…/…`.
- **No crees acciones de conversión en Google Ads.** Las crea Sandy (sección 6).
- **Nada de datos de la persona hacia Google.** Esta regla es la decisión de privacidad del 3 nov.
  - La huella del clic no es un dato de la persona. Nombre, teléfono y correo sí lo son, y van **solo** a Go High Level y al correo del vendedor, nunca a Google.
- La huella solo se guarda si la persona dio **«Aceptar»** en cookies, igual que gtag. Sin aceptar, el formulario y el WhatsApp funcionan igual, solo sin huella.
- No se mandan pruebas a los vendedores en el sitio real (sección 8).

**Cambia una regla del 5 nov, con OK de Sandy.** El WhatsApp lleva un folio al final, **solo** cuando la persona vino de un anuncio y aceptó cookies:

```
Hola, vengo de la página de Kingstar. Me interesa información de lavadoras de alta capacidad.

Folio web: KS-7K3P9M
```

- **El resto del mensaje no cambia.** La frase «vengo de la página de [Marca]» sigue igual al principio, para que los vendedores sigan contando.
- **Sin anuncio o sin cookies,** el mensaje queda exactamente como hoy.
- El folio es un recibo corto, no la huella: no expone nada. Los vendedores no tienen que hacer nada con él.

---

## 4. Cómo funciona

```
Anuncio ──clic──► página (?gclid=…)
                    │  PuenteWhatsApp: lee la huella; al «Aceptar» la guarda 90 días en el navegador
                    │
      ┌─────────────┴──────────────┐
  FORMULARIO                    WHATSAPP
      │ campos ocultos              │ al tocar: agrega «Folio web: KS-XXXXXX» al mensaje
      │ con la huella               │ y manda folio→huella a /api/huella (se guarda 90 días en Upstash)
      ▼                             ▼
 /api/contacto                 El mensaje llega a Go High Level (WhatsApp conectado)
  ├─ correo (Resend, S8)            │ automatización A: «el mensaje trae Folio web» → webhook
  └─ Go High Level:                 ▼
     contacto + huella        /api/ghl/whatsapp: busca la huella del folio y se la pone al contacto
     + nota de origen               │
      └─────────────┬───────────────┘
                    ▼
     Contacto en Go High Level con gclid  +  nota «Origen: Anuncio de Google · campaña … · búsqueda …»
                    │  el vendedor lo mueve en el pipeline
                    ▼
     Automatización B: etapa «Cotizado» / «Vendido» → acción nativa «Add to Google Ads»
                    ▼
     Google Ads: «GHL · Cotización» / «GHL · Venta» (secundarias al inicio)
```

---

## 5. Archivos (`medicion/nextjs/puente-ghl/`)

| Archivo | Dónde va | Qué hace |
|---|---|---|
| `lib/huella.ts` | navegador y servidor | Lee, valida y guarda la huella del clic; arma el folio |
| `components/PuenteWhatsApp.tsx` | layout raíz, una vez | Prepara y guarda la huella al «Aceptar»; agrega el folio a los enlaces de WhatsApp. `conFolio()` sirve para botones con `window.open` |
| `lib/servidor/almacen.ts` | solo servidor | Guarda folio → huella 90 días en Upstash Redis (REST) |
| `lib/servidor/ghl.ts` | solo servidor | Crea o actualiza el contacto en Go High Level (API v2), le pone campos, etiquetas y una nota de origen |
| `ejemplos/app/api/huella/route.ts` | ruta nueva | Recibe folio → huella del navegador |
| `ejemplos/app/api/ghl/whatsapp/route.ts` | ruta nueva | Webhook que llama Go High Level cuando llega un WhatsApp con folio |
| `ejemplos/app/api/contacto/fragmento.ts` | se agrega a la ruta de S8 | Manda el formulario a Go High Level en paralelo al correo |
| `.env.puente.example` | Vercel, por sitio | Variables |

**Ya revisado:** el código pasa `tsc --strict`. El folio y la limpieza de la huella se probaron con casos reales: nombres de campaña con «·», valores con HTML, URL de `wa.me` con acentos.

**No se probó contra Go High Level ni Upstash de verdad.** Eso es la sección 8.

### Instalación en cada sitio

1. Copia `lib/huella.ts`, `lib/servidor/` y `components/PuenteWhatsApp.tsx` respetando la ubicación relativa. Ajusta los imports.
2. En el layout raíz, junto a `<GoogleTags />` y `<RastreoClics />`, agrega `<PuenteWhatsApp consentido={…} />`, con el mismo estado que hoy decide si carga gtag.
3. Botones de WhatsApp que no son `<a>`: pasa la dirección por `conFolio(href, consentido)` antes de `window.open`.
4. **Formulario:**
   - En el navegador: `agregarHuella(datos, consentido)` antes del `fetch`.
   - En `/api/contacto`: `mandarAGoHighLevel(datos, marca)` en paralelo al correo, con `Promise.allSettled`. Ver `fragmento.ts`.
   - **La respuesta al navegador y la conversión «AB · Formulario enviado» siguen dependiendo solo del correo.**
   - **Modo WhatsApp del formulario** (mientras «correo en vivo» esté apagado): ese botón abre WhatsApp, así que el folio sale solo si es un `<a>` o si pasa por `conFolio()`.
5. Agrega las rutas `app/api/huella/route.ts` y `app/api/ghl/whatsapp/route.ts`.
6. Variables de `.env.puente.example` en Vercel, por sitio. Prefijos:
   - `QL` Quick Laundry
   - `KS` Kingstar
   - `LS` Laundry Solutions
   - `GB` Girbau
   - `GS` Gamesail
7. Upstash: Vercel › Storage › Marketplace › Upstash Redis. Un solo almacén sirve para los 5 sitios.

**Si un sitio no tiene `GHL_TOKEN`, el puente no hace nada y el sitio sigue como hoy.** Así se puede encender marca por marca.

---

## 6. Configuración en Go High Level (por subcuenta)

1. **Campos personalizados del contacto** (Settings › Custom Fields), tipo texto:
   - Google · gclid
   - Google · gbraid
   - Google · wbraid
   - UTM campaña
   - UTM término
   - Página de entrada
   - Fecha del clic
   - Folio web

   Copia sus IDs a `GHL_CAMPOS`.
2. **Token** (Settings › Private Integrations): «Puente páginas», con permisos **solo** `contacts.write` y `contacts.readonly`. Uno por subcuenta, en el Vercel de su sitio.
3. **Automatización A, «WhatsApp con folio»:**
   - Disparador: llega un mensaje de WhatsApp («Customer Replied», canal WhatsApp), con filtro «el mensaje contiene `Folio web:`».
   - Acción **Webhook**, POST a `https://<dominio>/api/ghl/whatsapp`.
   - Encabezado `x-puente-secreto`.
   - Datos personalizados: `contact_id = {{contact.id}}` y `mensaje = {{message.body}}`.
   - La primera vez, revisa en los registros de Vercel la línea `[puente] llegó con campos:` para confirmar los nombres.
4. **Conectar Google Ads en la subcuenta** (Settings › Integrations › Google). **Hazlo junto con Sandy:** tiene que ser la cuenta de esa marca, y nada se conecta sin su OK, cuenta por cuenta.

| Marca | Cuenta de Google Ads |
|---|---|
| Quick Laundry | 256-397-2201 |
| Kingstar | CLM 993-525-8739 |
| Laundry Solutions | 265-909-2662 |
| Girbau | 860-582-6837 |
| Gamesail | 118-347-6484 |

5. **Automatización B, «Avisar a Google Ads»:** se arma **después** de que Sandy cree las acciones (abajo).
   - Disparador: «Pipeline Stage Changed» a «Cotizado».
   - Condición: el campo «Google · gclid», «gbraid» o «wbraid» no está vacío.
   - Acción **Add to Google Ads** con la conversión «GHL · Cotización».
   - Lo mismo para «Vendido» → «GHL · Venta», con el valor de la oportunidad si lo tienen.
   - El nombre de la conversión tiene que ser **idéntico** al de Google Ads.

**Lo que hace Sandy en Google Ads** (con su OK, cuenta por cuenta): crea «GHL · Cotización» y «GHL · Venta» como acciones de **importación de clics**, **secundarias** al inicio. Pasan a principales cuando haya volumen (unas 30 al mes por cuenta), para no confundir al algoritmo.

---

## 7. Tres cosas que hay que comprobar antes de encender la automatización B

1. **¿De dónde toma el GCLID la acción «Add to Google Ads»?** Puede leer nuestro campo personalizado o solo la atribución interna de Go High Level. La documentación no lo deja claro.
   - **Cómo probarlo:** en un contacto de prueba, pon en «Google · gclid» el texto `PRUEBA_NO_ES_REAL` y dispara la acción a mano. Google lo va a rechazar, y el registro de ejecución dirá con qué valor lo intentó o si «no hay GCLID».
   - **Si no lee nuestro campo:** detente y avísale a Sandy. El plan B es subir las conversiones desde nuestro servidor con la API de Google Ads, y eso **no está construido**.
2. **¿La acción manda correo o teléfono a Google?** Eso sería «conversiones mejoradas». Si los manda y no se puede apagar, **detente y avísale a Sandy** antes de encenderla: choca con la decisión de privacidad del 3 nov.
3. **Los nombres de campos del webhook** de la automatización A (ver la sección 6, punto 3).

---

## 8. Pruebas

1. **Todo en una vista previa de Vercel**, con `PUENTE_ETIQUETA_PRUEBA=prueba` y gtag apagado, como en S8. Así nada cuenta en Google Ads.
2. Abre la vista previa con `?gclid=PRUEBA_NO_ES_REAL&utm_campaign=Prueba&utm_term=prueba` y da «Aceptar». Revisa:
   - **WhatsApp:** el mensaje que abre termina en `Folio web: XX-XXXXXX`.
   - **Sin el `?gclid` o sin «Aceptar»:** el mensaje sale igual que hoy.
   - **Formulario:** en Go High Level aparece el contacto, con los campos, las etiquetas `pagina-formulario`, `anuncio-google` y `prueba`, y la nota de origen.
   - **WhatsApp de punta a punta:** se manda desde un teléfono de Atelback a un número de prueba conectado a Go High Level, **no al vendedor**. El contacto debe quedar con la huella y la nota «WhatsApp desde la página (folio …)».
3. **No muevas contactos de prueba a «Cotizado» ni «Vendido»** mientras la automatización B esté encendida. Bórralos al terminar (filtro: etiqueta `prueba`).
4. Ya en vivo, Sandy revisa en la revisión diaria que «GHL · Cotización» empiece a registrar.

---

## 9. Seguridad

- El token de Go High Level, el secreto del webhook y el de Upstash son **solo de servidor**. Nunca van con `NEXT_PUBLIC_`, en el repo ni en mensajes.
- El webhook rechaza todo lo que no traiga `x-puente-secreto`; la comparación es de tiempo constante.
- `/api/huella`:
  - solo acepta POST desde el propio dominio, de menos de 4 KB y con folio y huella válidos;
  - no guarda datos de la persona;
  - no reescribe un folio que ya existe.
- Los registros (`console.log`) **nunca** llevan nombre, teléfono, correo ni el texto del mensaje: solo nombres de campos y códigos de error.
- Los folios y huellas se borran solos a los 90 días.
- **Aviso de privacidad de cada sitio:** agrega que los datos del formulario o del WhatsApp se registran en el sistema de seguimiento de clientes de la marca, y que con las cookies aceptadas se usa un identificador del clic del anuncio para medir la publicidad.

---

## 10. Cómo contestar a Sandy

```
P1 · … / P2 · … / P3 · … / P4 · …                       (antes de empezar)
PUENTE · marca · formulario→GHL (sí/no) · folio WhatsApp (sí/no) · webhook A (sí/no) · prueba borrada (sí/no)
PUENTE · Add to Google Ads lee nuestro campo (sí/no) · manda correo/teléfono a Google (sí/no)
```
