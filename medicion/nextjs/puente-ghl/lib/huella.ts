// Huella del clic: el identificador que Google pone en la dirección cuando alguien llega desde un anuncio
// (gclid, gbraid o wbraid), más las utm de esa visita. Sirve para que Go High Level le diga después a Google Ads
// «este contacto, que vino de tu clic, cotizó o compró».
//
// No lleva datos de la persona: ni nombre, ni teléfono, ni correo.
// Este archivo funciona en el navegador y en el servidor (las funciones del navegador revisan `window`).

export type Huella = {
  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  pagina?: string // ruta por la que entró, por ejemplo /lavadoras-alta-capacidad
  fecha?: string // fecha y hora del clic, ISO
}

export const CAMPOS_HUELLA = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'pagina',
  'fecha',
] as const

const PARAMETROS_URL = CAMPOS_HUELLA.filter((c) => c !== 'pagina' && c !== 'fecha')

const CLAVE = 'ab_huella'
// Google Ads acepta conversiones de un clic hasta 90 días después; más vieja ya no sirve.
const VIGENCIA_MS = 90 * 24 * 60 * 60 * 1000

// Texto normal de máximo 300 caracteres (los nombres de campaña llevan «·»). Si trae caracteres de control
// o de HTML (< > " ' ` \) se descarta completo.
export function limpiarValor(valor: unknown): string {
  if (typeof valor !== 'string') return ''
  const v = valor.trim().slice(0, 300)
  return /^[^<>"'`\\\u0000-\u001f\u007f]*$/u.test(v) ? v : ''
}

export function tieneClic(h: Huella | null | undefined): h is Huella {
  return !!h && !!(h.gclid || h.gbraid || h.wbraid)
}

// Arma una huella con lo que venga (FormData del formulario, JSON del navegador). Descarta lo que no es válido.
export function huellaDesde(obtener: (campo: string) => unknown): Huella | null {
  const h: Huella = {}
  for (const campo of CAMPOS_HUELLA) {
    const v = limpiarValor(obtener(campo))
    if (v) h[campo] = v
  }
  return tieneClic(h) ? h : null
}

// ---------- Navegador ----------

let deEstaVisita: Huella | null = null

// 1) Al cargar la página: lee la huella de la dirección y la deja en memoria (todavía no la guarda).
export function prepararHuella(): void {
  if (typeof window === 'undefined') return
  const q = new URLSearchParams(window.location.search)
  const h = huellaDesde((campo) => q.get(campo))
  if (!h) return
  h.pagina = limpiarValor(window.location.pathname)
  h.fecha = new Date().toISOString()
  deEstaVisita = h
}

// 2) Cuando la persona acepta las cookies: guarda la huella 90 días. Un clic nuevo reemplaza al anterior,
//    porque Google le da el crédito al último clic.
export function guardarHuella(): void {
  if (typeof window === 'undefined' || !deEstaVisita) return
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...deEstaVisita, guardada: Date.now() }))
  } catch {
    // Navegador sin almacenamiento (modo privado estricto): se usa solo la de esta visita.
  }
}

// 3) Para mandarla con el contacto. Sin cookies aceptadas no hay huella.
export function leerHuella(consentido: boolean): Huella | null {
  if (typeof window === 'undefined' || !consentido) return null
  if (deEstaVisita) return deEstaVisita
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE) ?? 'null')
    if (!guardada || Date.now() - Number(guardada.guardada) > VIGENCIA_MS) {
      localStorage.removeItem(CLAVE)
      return null
    }
    return huellaDesde((campo) => guardada[campo])
  } catch {
    return null
  }
}

// Agrega la huella como campos ocultos al FormData del formulario, justo antes de mandarlo a /api/contacto.
export function agregarHuella(datos: FormData, consentido: boolean): void {
  const h = leerHuella(consentido)
  if (!h) return
  for (const campo of CAMPOS_HUELLA) {
    const v = h[campo]
    if (v) datos.set(campo, v)
  }
}

// ---------- Folio de WhatsApp ----------
// En WhatsApp la huella se queda en la página. El folio es un recibo corto que viaja en el mensaje
// y permite unir después el WhatsApp con su huella. Formato: prefijo de la marca + 6 caracteres, ej. QL-7K3P9M.

const ALFABETO = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // sin 0/O ni 1/I/L, para que no se confundan
export const FORMATO_FOLIO = /^[A-Z]{2}-[2-9A-HJKMNP-Z]{6}$/
export const FOLIO_EN_MENSAJE = /Folio web:\s*([A-Z]{2}-[2-9A-HJKMNP-Z]{6})/i

export function nuevoFolio(prefijo: string): string {
  const azar = new Uint32Array(6)
  crypto.getRandomValues(azar)
  let s = ''
  for (const n of azar) s += ALFABETO[n % ALFABETO.length]
  return `${prefijo.toUpperCase().slice(0, 2)}-${s}`
}
