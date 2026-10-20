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
