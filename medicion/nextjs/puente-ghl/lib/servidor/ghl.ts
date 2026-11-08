// SOLO SERVIDOR. Manda contactos y huellas a Go High Level (API v2) con un token de integración privada
// de la subcuenta de la marca. El token nunca va en el navegador ni en variables NEXT_PUBLIC_.
//
// Variables (ver .env.puente.example):
//   GHL_TOKEN         token de integración privada (pit-…) con permisos contacts.write y contacts.readonly
//   GHL_LOCATION_ID   ID de la subcuenta de la marca
//   GHL_CAMPOS        JSON con el ID de cada campo personalizado del contacto:
//                     {"gclid":"…","gbraid":"…","wbraid":"…","utm_campaign":"…","utm_term":"…","pagina":"…","fecha":"…","folio":"…"}
//   PUENTE_ETIQUETA_PRUEBA  opcional; en las vistas previas ponerle «prueba» para reconocer y borrar los contactos de prueba

import type { Huella } from '../huella'
import { CAMPOS_HUELLA } from '../huella'

const BASE = 'https://services.leadconnectorhq.com'
const VERSION = '2021-07-28'

function config() {
  const token = process.env.GHL_TOKEN ?? ''
  const locationId = process.env.GHL_LOCATION_ID ?? ''
  if (!token || !locationId) throw new Error('Falta GHL_TOKEN o GHL_LOCATION_ID')
  let campos: Record<string, string> = {}
  try {
    campos = JSON.parse(process.env.GHL_CAMPOS ?? '{}')
  } catch {
    throw new Error('GHL_CAMPOS no es un JSON válido')
  }
  return { token, locationId, campos, prueba: process.env.PUENTE_ETIQUETA_PRUEBA ?? '' }
}

async function ghl(ruta: string, metodo: 'POST' | 'PUT', cuerpo: unknown): Promise<any> {
  const { token } = config()
  const r = await fetch(`${BASE}${ruta}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: VERSION,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cuerpo),
    cache: 'no-store',
  })
  if (!r.ok) {
    // Solo el código y el inicio de la respuesta: nunca se registran datos de la persona.
    const texto = (await r.text()).slice(0, 200)
    throw new Error(`GHL ${metodo} ${ruta.replace(/\/[A-Za-z0-9]{15,}/g, '/…')} → ${r.status} ${texto}`)
  }
  return r.json().catch(() => ({}))
}

// Teléfono en formato +52XXXXXXXXXX, que es como Go High Level identifica y une contactos.
export function telefonoMx(telefono: string): string {
  const d = telefono.replace(/\D/g, '')
  if (telefono.trim().startsWith('+') && d.length >= 10) return '+' + d
  if (d.length === 10) return '+52' + d
  if (d.length === 12 && d.startsWith('52')) return '+' + d
  return ''
}

function camposPersonalizados(huella: Huella | null, folio?: string) {
  const { campos } = config()
  const lista: { id: string; field_value: string }[] = []
  if (huella) {
    for (const c of CAMPOS_HUELLA) {
      const v = huella[c]
      if (v && campos[c]) lista.push({ id: campos[c], field_value: v })
    }
  }
  if (folio && campos.folio) lista.push({ id: campos.folio, field_value: folio })
  return lista
}

function origenLegible(huella: Huella | null): string {
  if (!huella) return 'Búsqueda o directo'
  const partes = ['Anuncio de Google']
  if (huella.utm_campaign) partes.push(`campaña «${huella.utm_campaign}»`)
  if (huella.utm_term) partes.push(`búsqueda «${huella.utm_term}»`)
  if (huella.pagina) partes.push(`entró por ${huella.pagina}`)
  return partes.join(' · ')
}

// Agrega etiquetas sin borrar las que el contacto ya tenía (el upsert las reemplazaría).
async function agregarEtiquetas(contactId: string, etiquetas: string[]) {
  const { prueba } = config()
  const todas = [...etiquetas, ...(prueba ? [prueba] : [])].filter(Boolean)
  if (todas.length) await ghl(`/contacts/${contactId}/tags`, 'POST', { tags: todas })
}

async function agregarNota(contactId: string, texto: string) {
  await ghl(`/contacts/${contactId}/notes`, 'POST', { body: texto })
}

export type DatosFormulario = {
  nombre: string
  telefono: string
  correo?: string
  ciudad?: string
  interes?: string
  mensaje?: string
  marca: string
  seccion?: string
}

// Formulario de la página → contacto en Go High Level (lo crea o lo actualiza si ya existía por teléfono o correo).
export async function contactoDeFormulario(d: DatosFormulario, huella: Huella | null): Promise<string> {
  const { locationId } = config()
  const telefono = telefonoMx(d.telefono)
  const respuesta = await ghl('/contacts/upsert', 'POST', {
    locationId,
    name: d.nombre,
    ...(telefono ? { phone: telefono } : {}),
    ...(d.correo ? { email: d.correo.trim().toLowerCase() } : {}),
    ...(d.ciudad ? { city: d.ciudad } : {}),
    source: `Página ${d.marca} · formulario`,
    customFields: camposPersonalizados(huella),
  })
  const contactId: string = respuesta?.contact?.id
  if (!contactId) throw new Error('GHL no devolvió el ID del contacto')
  await agregarEtiquetas(contactId, ['pagina-formulario', huella ? 'anuncio-google' : 'sin-anuncio'])
  await agregarNota(
    contactId,
    [
      `Formulario de la página de ${d.marca}${d.seccion ? ` (${d.seccion})` : ''}.`,
      d.interes ? `Le interesa: ${d.interes}.` : '',
      d.mensaje ? `Mensaje: ${d.mensaje}` : '',
      `Origen: ${origenLegible(huella)}.`,
    ]
      .filter(Boolean)
      .join('\n'),
  )
  return contactId
}

// WhatsApp con folio → le pone la huella a ese contacto (que Go High Level ya creó al llegar el mensaje).
export async function huellaAContacto(contactId: string, huella: Huella, folio: string): Promise<void> {
  await ghl(`/contacts/${contactId}`, 'PUT', { customFields: camposPersonalizados(huella, folio) })
  await agregarEtiquetas(contactId, ['pagina-whatsapp', 'anuncio-google'])
  await agregarNota(contactId, `WhatsApp desde la página (folio ${folio}). Origen: ${origenLegible(huella)}.`)
}
