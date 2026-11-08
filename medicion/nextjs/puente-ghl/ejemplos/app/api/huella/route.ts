// POST /api/huella — lo llama <PuenteWhatsApp /> cuando alguien que vino de un anuncio toca WhatsApp.
// Guarda folio → huella 90 días. No recibe ni guarda datos de la persona.
// Ajusta las rutas de import a donde copies lib/.

import { FORMATO_FOLIO, huellaDesde, limpiarValor } from '../../../../lib/huella'
import { guardarFolio } from '../../../../lib/servidor/almacen'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  // Solo desde la propia página: el navegador manda Origin en los POST.
  const origen = req.headers.get('origin')
  if (origen && new URL(origen).host !== new URL(req.url).host) return new Response(null, { status: 403 })
  if (Number(req.headers.get('content-length') ?? 0) > 4000) return new Response(null, { status: 413 })

  let cuerpo: any
  try {
    cuerpo = JSON.parse(await req.text())
  } catch {
    return new Response(null, { status: 400 })
  }
  const folio = limpiarValor(cuerpo?.folio)
  const huella = huellaDesde((campo) => cuerpo?.huella?.[campo])
  if (!FORMATO_FOLIO.test(folio) || !huella) return new Response(null, { status: 400 })

  try {
    await guardarFolio(folio, huella)
  } catch (e) {
    console.error('[puente] no se pudo guardar el folio:', (e as Error).message)
    return new Response(null, { status: 500 })
  }
  return new Response(null, { status: 204 })
}
