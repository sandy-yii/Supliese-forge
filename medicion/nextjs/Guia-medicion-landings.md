# Medición de las landing pages · Google Ads + GA4 (Next.js)

Para Rodolfo. Todo lo necesario para que Google Ads y Google Analytics 4 cuenten los contactos que llegan desde las cinco páginas del grupo.

## ¿Es distinto para cada landing?

**El código es el mismo en las cinco.** Se copian los mismos 3 archivos y se agregan las mismas líneas al layout.

**Lo único que cambia en cada sitio son los IDs**, que van en variables de entorno (`.env.local` o las variables del hosting):

| Variable | Qué es | ¿Cambia por sitio? |
|---|---|---|
| `NEXT_PUBLIC_GA4_ID` | ID de medición de GA4 (`G-…`) | Sí, una propiedad por sitio |
| `NEXT_PUBLIC_GADS_ID` | ID de la cuenta de Google Ads (`AW-…`) | Sí, cada marca tiene su cuenta |
| `NEXT_PUBLIC_GADS_LABEL_FORMULARIO` | Etiqueta de la conversión "Formulario enviado" | Sí |
| `NEXT_PUBLIC_GADS_LABEL_WHATSAPP` | Etiqueta de "Clic en WhatsApp" | Sí |
| `NEXT_PUBLIC_GADS_LABEL_LLAMADA` | Etiqueta de "Clic en teléfono de la página" | Sí |
| `NEXT_PUBLIC_GADS_LABEL_CORREO` | Etiqueta de "Clic en correo" (opcional) | Sí |

Además, en cada sitio hay que revisar dos cosas que dependen de cómo está hecho:
- **El formulario:** dónde se confirma que se envió bien, para poner ahí `registrarFormulario()`.
- **El botón de WhatsApp:** si no es un enlace `<a href="https://wa.me/…">`, hay que agregar `registrar('whatsapp')` en su `onClick`.

### Valores por sitio

Los IDs y etiquetas se los pasamos nosotros cuando creemos las conversiones en cada cuenta de Google Ads.

| Sitio | Cuenta de Google Ads | `GA4_ID` | `GADS_ID` | Formulario | WhatsApp | Llamada |
|---|---|---|---|---|---|---|
| www.supliese.com | Quick Laundry 256-397-2201 | | | | | |
| supliese-girbau-lavadoras.vercel.app | Girbau 860-582-6837 | | | | | |
| kingstar.com.mx | CLM 993-525-8739 | | | | | |
| laundry-solutions-servicio.vercel.app | Servicio para Lavandería 265-909-2662 | | | | | |
| gamesail-lavadoras.vercel.app | Cuenta nueva de Gamesail | | | | | |

## Qué se mide

Código para que Google Ads y Google Analytics 4 cuenten cada contacto que llega desde las páginas:

| Contacto | Cómo se detecta | Evento en GA4 | Conversión en Google Ads |
|---|---|---|---|
| Formulario enviado | Se llama a `registrarFormulario()` cuando el servidor confirma el envío | `generate_lead` | Formulario (Principal) |
| Clic en WhatsApp | Automático: cualquier enlace `wa.me`, `api.whatsapp.com` o `whatsapp:` | `clic_whatsapp` | WhatsApp (Principal) |
| Clic en teléfono | Automático: cualquier enlace `tel:` | `clic_llamada` | Llamada desde la página (Secundaria) |
| Clic en correo | Automático: cualquier enlace `mailto:` | `clic_correo` | Opcional (Secundaria) |
| Visitas a páginas | Automático con la etiqueta de Google | `page_view` | No se usa como conversión |

Las llamadas que se hacen directo desde el anuncio no necesitan código: se miden en Google Ads con la acción "Llamadas desde anuncios" (duración mínima 60 segundos).

## Instalación en cada sitio

1. Copiar `lib/medicion.ts`, `components/GoogleTags.tsx` y `components/RastreoClics.tsx` al proyecto, respetando la ubicación relativa entre `lib/` y `components/` (por ejemplo, `src/lib` y `src/components`).
2. Agregar `<GoogleTags />` y `<RastreoClics />` **una sola vez**, en `app/layout.tsx` (carpeta `app/`) o en `pages/_app.tsx` (carpeta `pages/`).
3. En el formulario, llamar `registrarFormulario({ correo, telefono, id })` **solo después** de que el servidor confirmó el envío. Si el sitio redirige a una página de "gracias", se puede llamar ahí dentro de un `useEffect`.
4. Si el botón de WhatsApp no es un `<a>`, agregar `registrar('whatsapp')` en su `onClick`.
5. Poner las variables de ese sitio y **volver a desplegar**: las variables `NEXT_PUBLIC_` se leen al construir.
6. Si el sitio ya tiene otra etiqueta de Google (`gtag.js` o Google Tag Manager) con los mismos IDs, quitarla para no contar doble.
7. Probar con tagassistant.google.com (ver "Probar" más abajo) y avisarnos para revisar que Google Ads lo reciba.

## Código

### `lib/medicion.ts`

```ts
// Medición de contactos para Google Ads y Google Analytics 4.
// Cada sitio usa sus propios IDs; se configuran con variables de entorno (ver .env.example).

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

// Next.js solo incrusta las variables NEXT_PUBLIC_ cuando se leen escritas completas, como aquí.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? ''
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? ''

const ETIQUETAS = {
  formulario: process.env.NEXT_PUBLIC_GADS_LABEL_FORMULARIO ?? '',
  whatsapp: process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP ?? '',
  llamada: process.env.NEXT_PUBLIC_GADS_LABEL_LLAMADA ?? '',
  correo: process.env.NEXT_PUBLIC_GADS_LABEL_CORREO ?? '',
}

export type Contacto = keyof typeof ETIQUETAS

// Nombres de evento en GA4. generate_lead es el evento recomendado por Google para formularios.
const EVENTOS_GA4: Record<Contacto, string> = {
  formulario: 'generate_lead',
  whatsapp: 'clic_whatsapp',
  llamada: 'clic_llamada',
  correo: 'clic_correo',
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

// Teléfono en formato internacional (+52...), que es el que piden las conversiones mejoradas.
export function normalizarTelefono(telefono: string): string {
  const digitos = telefono.replace(/\D/g, '')
  if (telefono.trim().startsWith('+') && digitos.length >= 10) return '+' + digitos
  if (digitos.length === 10) return '+52' + digitos
  if (digitos.length === 12 && digitos.startsWith('52')) return '+' + digitos
  return ''
}

// Registra un contacto en GA4 y, si el sitio tiene la etiqueta configurada, como conversión de Google Ads.
export function registrar(tipo: Contacto, opciones: { transaccion?: string } = {}) {
  if (typeof window === 'undefined') return
  gtag('event', EVENTOS_GA4[tipo], { tipo_contacto: tipo, pagina: window.location.pathname })
  const etiqueta = ETIQUETAS[tipo]
  if (!GADS_ID || !etiqueta) return
  const conversion: Record<string, string> = { send_to: `${GADS_ID}/${etiqueta}` }
  // Con un identificador por envío, Google Ads no cuenta dos veces el mismo formulario.
  if (opciones.transaccion) conversion.transaction_id = opciones.transaccion
  gtag('event', 'conversion', conversion)
}

// Llamar SOLO cuando el formulario se envió con éxito (respuesta correcta del servidor).
// El correo y el teléfono se mandan para las conversiones mejoradas; gtag los cifra antes de enviarlos.
export function registrarFormulario(datos: { correo?: string; telefono?: string; id?: string } = {}) {
  const usuario: Record<string, string> = {}
  if (datos.correo) usuario.email = datos.correo.trim().toLowerCase()
  if (datos.telefono) {
    const telefono = normalizarTelefono(datos.telefono)
    if (telefono) usuario.phone_number = telefono
  }
  if (Object.keys(usuario).length > 0) gtag('set', 'user_data', usuario)
  registrar('formulario', { transaccion: datos.id })
}
```

### `components/GoogleTags.tsx`

```tsx
import Script from 'next/script'
import { GA4_ID, GADS_ID } from '../lib/medicion'

// Carga la etiqueta de Google una sola vez y la configura para GA4 y para Google Ads.
// Va una vez en el layout raíz (App Router) o en _app (Pages Router).
export default function GoogleTags() {
  const ids = [GA4_ID, GADS_ID].filter(Boolean)
  if (ids.length === 0) return null

  const config = [
    GA4_ID && `gtag('config', '${GA4_ID}');`,
    GADS_ID && `gtag('config', '${GADS_ID}', { allow_enhanced_conversions: true });`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="google-tags" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${config}`}
      </Script>
    </>
  )
}
```

### `components/RastreoClics.tsx`

```tsx
'use client'

import { useEffect } from 'react'
import { registrar } from '../lib/medicion'

const WHATSAPP = /^(https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/|whatsapp:)/i

// Escucha los clics en todo el sitio: cualquier enlace tel:, de WhatsApp o mailto: cuenta como contacto,
// sin tener que tocar cada botón. Va una vez en el layout raíz, junto a <GoogleTags />.
export default function RastreoClics() {
  useEffect(() => {
    function alHacerClic(evento: MouseEvent) {
      if (!(evento.target instanceof Element)) return
      const enlace = evento.target.closest('a[href]')
      if (!enlace) return
      const href = enlace.getAttribute('href') ?? ''
      if (/^tel:/i.test(href)) registrar('llamada')
      else if (WHATSAPP.test(href)) registrar('whatsapp')
      else if (/^mailto:/i.test(href)) registrar('correo')
    }
    document.addEventListener('click', alHacerClic, { capture: true })
    return () => document.removeEventListener('click', alHacerClic, { capture: true })
  }, [])

  return null
}
```

### Dónde van: carpeta `app/` (`app/layout.tsx`)

```tsx
// Ejemplo para App Router (carpeta app/). Solo hay que agregar las dos líneas marcadas a su layout actual.
import type { ReactNode } from 'react'
import GoogleTags from '../../components/GoogleTags' // ← agregar
import RastreoClics from '../../components/RastreoClics' // ← agregar

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <GoogleTags /> {/* ← agregar */}
        <RastreoClics /> {/* ← agregar */}
      </body>
    </html>
  )
}
```

### Dónde van: carpeta `pages/` (`pages/_app.tsx`)

```tsx
// Ejemplo para Pages Router (carpeta pages/). Solo hay que agregar las líneas marcadas a su _app actual.
import type { AppProps } from 'next/app'
import GoogleTags from '../../components/GoogleTags' // ← agregar
import RastreoClics from '../../components/RastreoClics' // ← agregar

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTags /> {/* ← agregar */}
      <RastreoClics /> {/* ← agregar */}
    </>
  )
}
```

### Ejemplo de formulario

```tsx
'use client'

// Ejemplo de cómo registrar el formulario. Lo importante es llamar a registrarFormulario()
// solo después de que el servidor confirmó el envío, nunca al hacer clic en "Enviar".
import { useState, type FormEvent } from 'react'
import { registrarFormulario } from '../lib/medicion'

export default function FormularioContacto() {
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | 'error'>('listo')

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const datos = new FormData(evento.currentTarget)
    setEstado('enviando')
    try {
      const respuesta = await fetch('/api/contacto', { method: 'POST', body: datos }) // su endpoint actual
      if (!respuesta.ok) throw new Error(String(respuesta.status))
      registrarFormulario({
        correo: String(datos.get('correo') ?? ''),
        telefono: String(datos.get('telefono') ?? ''),
        id: crypto.randomUUID(),
      })
      setEstado('enviado')
    } catch {
      setEstado('error')
    }
  }

  return (
    <form onSubmit={enviar}>
      <input id="nombre" name="nombre" required />
      <input id="correo" name="correo" type="email" />
      <input id="telefono" name="telefono" type="tel" required />
      <button type="submit" disabled={estado === 'enviando'}>Solicitar cotización</button>
      {estado === 'enviado' && <p>Gracias, un asesor te contactará pronto.</p>}
      {estado === 'error' && <p>No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.</p>}
    </form>
  )
}
```

### `.env.example`

```bash
# Copiar a .env.local (o a las variables del hosting, p. ej. Vercel) con los valores de CADA sitio.
# Cada página tiene su propia cuenta de Google Ads y su propia propiedad de GA4: no se comparten.

# GA4 › Administrar › Flujos de datos › Web › "ID de medición"
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Google Ads › Objetivos › Conversiones › (acción) › Configurar etiqueta › Usar Google tag
# "AW-123456789/AbC-D_efG-h12_34" → el ID es lo de antes de la diagonal y la etiqueta lo de después.
NEXT_PUBLIC_GADS_ID=AW-000000000
NEXT_PUBLIC_GADS_LABEL_FORMULARIO=
NEXT_PUBLIC_GADS_LABEL_WHATSAPP=
NEXT_PUBLIC_GADS_LABEL_LLAMADA=
# Opcional
NEXT_PUBLIC_GADS_LABEL_CORREO=
```

## Configuración en Google (la hacemos nosotros)

Referencia de lo que configuramos del lado de Google Ads y GA4, para que Rodolfo sepa de dónde salen los IDs.

### Paso 1 · Crear las conversiones en cada cuenta de Google Ads

Se hace en cada una de las cinco cuentas, porque cada página tiene la suya.

1. **Objetivos › Conversiones › Resumen › + Crear acción de conversión › Sitio web.**
2. Escribir el dominio del sitio y elegir **"Agregar una acción de conversión manualmente"**.
3. Crear estas acciones:

| Nombre | Categoría | Valor | Recuento | Objetivo |
|---|---|---|---|---|
| Formulario enviado | Enviar formulario de clientes potenciales | Mismo valor: 1 | Uno | **Principal** |
| Clic en WhatsApp | Contacto | Mismo valor: 1 | Uno | **Principal** |
| Clic en teléfono de la página | Contacto | Mismo valor: 1 | Uno | Secundaria |
| Clic en correo (opcional) | Contacto | Mismo valor: 1 | Uno | Secundaria |
| Llamadas desde anuncios | Llamada telefónica | Mismo valor: 1 | Uno, 60 s o más | **Principal** |

4. En cada acción: **Configurar etiqueta › Usar Google tag**. Google muestra algo como `send_to: 'AW-123456789/AbC-D_efG-h12_34'`:
   - `AW-123456789` va en `NEXT_PUBLIC_GADS_ID` (es el mismo para todas las acciones de esa cuenta).
   - Lo que va después de la diagonal es la **etiqueta** de esa acción y va en su variable: `NEXT_PUBLIC_GADS_LABEL_FORMULARIO`, `NEXT_PUBLIC_GADS_LABEL_WHATSAPP`, etc.
5. **Configuración de la cuenta › Etiquetado automático: activado.** Sin esto Google Ads no puede atribuir el contacto al anuncio.
6. **Conversiones › Configuración › Conversiones mejoradas para clientes potenciales: activar, con Google tag.** Usa el correo y el teléfono del formulario (cifrados) para atribuir mejor.

Lo que hoy cuenta aperturas de chat (en Servicio, "GA4 (web) Coudibot") debe pasar a **Secundaria**: si no, Google aprende a buscar gente que abre el chat y no clientes.

### Paso 2 · Crear GA4 en cada sitio

1. En analytics.google.com: **Administrar › Crear › Propiedad**, una por sitio, con zona horaria de México y moneda MXN.
2. **Flujos de datos › Web**, con el dominio del sitio. Dejar activada la **medición mejorada**, que también cuenta las visitas cuando la página cambia sin recargar.
3. Copiar el **ID de medición** (`G-…`) a `NEXT_PUBLIC_GA4_ID`.
4. Cuando lleguen los primeros eventos: **Administrar › Eventos** y marcar como **evento clave** `generate_lead`, `clic_whatsapp` y `clic_llamada`.
5. **Administrar › Vinculación de productos › Google Ads**: vincular la cuenta de esa marca, para tener audiencias y ver los datos de Analytics en Google Ads.

No importar a Google Ads los eventos clave de GA4 como Principal: Google Ads ya los cuenta con su propia etiqueta y se contarían dos veces. Si se importan, que sea como Secundaria.

### Paso 3 · Probar

1. Abrir **tagassistant.google.com**, conectar el sitio y revisar que aparezcan el `G-…` y el `AW-…`.
2. Hacer clic en el botón de WhatsApp, en el teléfono, y enviar un formulario de prueba:
   - En Tag Assistant debe aparecer cada evento y su `conversion`.
   - En GA4, **Informes › Tiempo real**, deben verse `clic_whatsapp`, `clic_llamada` y `generate_lead`.
3. En Google Ads cada acción pasa de "Sin verificar" a "Registrando conversiones". Puede tardar hasta 24 horas.
4. Borrar o marcar los formularios de prueba para que no se confundan con clientes.

## Privacidad

Las conversiones mejoradas envían el correo y el teléfono del formulario cifrados a Google. El aviso de privacidad de cada sitio debe mencionar que se usan herramientas de Google para medir la publicidad.
