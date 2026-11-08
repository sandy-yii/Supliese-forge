// POST /api/ghl/whatsapp — lo llama la automatización de Go High Level cuando llega un WhatsApp con «Folio web:».
// Busca la huella de ese folio y se la pone al contacto. Ajusta las rutas de import a donde copies lib/.
//
// En la acción «Webhook» de la automatización:
//   Método POST · URL https://<dominio de la marca>/api/ghl/whatsapp
//   Encabezado  x-puente-secreto: <GHL_WEBHOOK_SECRETO>
//   Datos personalizados:  contact_id = {{contact.id}}   ·   mensaje = {{message.body}}
// La primera vez revisa en los registros de Vercel la línea «[puente] llegó» para confirmar que vienen esos campos.

import { timingSafeEqual } from 'node:crypto'
import { FOLIO_EN_MENSAJE } from '../../../../../lib/huella'
import { leerFolio } from '../../../../../lib/servidor/almacen'
import { huellaAContacto } from '../../../../../lib/servidor/ghl'

export const runtime = 'nodejs'

function secretoValido(recibido: string | null): boolean {
  const esperado = process.env.GHL_WEBHOOK_SECRETO ?? ''
  if (!esperado || !recibido) return false
  const a = Buffer.from(recibido)
  const b = Buffer.from(esperado)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Go High Level manda los «datos personalizados» dentro de customData; se aceptan también en la raíz.
function campo(cuerpo: any, ...nombres: string[]): string {
  for (const n of nombres) {
    const v = cuerpo?.customData?.[n] ?? cuerpo?.[n]
    if (typeof v === 'string' && v) return v
  }
  return ''
}

const ok = (motivo: string) => Response.json({ ok: motivo === 'listo', motivo })

export async function POST(req: Request) {
  if (!secretoValido(req.headers.get('x-puente-secreto'))) return new Response(null, { status: 401 })

  let cuerpo: any
  try {
    cuerpo = await req.json()
  } catch {
    return new Response(null, { status: 400 })
  }
  // Solo los nombres de los campos, nunca sus valores (traen datos de la persona).
  console.log('[puente] llegó con campos:', Object.keys(cuerpo ?? {}).join(','), '| customData:', Object.keys(cuerpo?.customData ?? {}).join(','))

  const contactId = campo(cuerpo, 'contact_id', 'contactId')
  const mensaje = campo(cuerpo, 'mensaje', 'message')
  const folio = mensaje.match(FOLIO_EN_MENSAJE)?.[1]?.toUpperCase()

  // Se responde 200 aunque no haya nada que hacer, para que Go High Level no reintente sin fin.
  if (!contactId) return ok('sin contact_id')
  if (!folio) return ok('el mensaje no trae folio')

  try {
    const huella = await leerFolio(folio)
    if (!huella) return ok('folio no encontrado o vencido')
    await huellaAContacto(contactId, huella, folio)
    return ok('listo')
  } catch (e) {
    console.error('[puente] error:', (e as Error).message)
    return new Response(null, { status: 500 }) // aquí sí conviene que reintente
  }
}
