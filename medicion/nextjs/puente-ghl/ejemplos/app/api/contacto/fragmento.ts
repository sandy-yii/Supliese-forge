// NO es una ruta completa: es lo que hay que AGREGAR a la ruta /api/contacto que ya existe (la de Resend, S8).
// No cambia nada del correo ni de la conversión «AB · Formulario enviado».
//
// 1) En el navegador, antes del fetch a /api/contacto:
//
//      import { agregarHuella } from '@/lib/huella'
//      const datos = new FormData(form)
//      agregarHuella(datos, consentido)   // consentido = la persona aceptó cookies
//      await fetch('/api/contacto', { method: 'POST', body: datos })
//
// 2) En la ruta /api/contacto, después de validar y de la trampa para robots, y en paralelo al correo:

import { huellaDesde } from '../../../../lib/huella'
import { contactoDeFormulario } from '../../../../lib/servidor/ghl'

export async function mandarAGoHighLevel(datos: FormData, marca: string): Promise<void> {
  if (!process.env.GHL_TOKEN) return // sitio sin puente todavía: no hace nada
  const huella = huellaDesde((campo) => datos.get(campo))
  try {
    await contactoDeFormulario(
      {
        nombre: String(datos.get('nombre') ?? ''),
        telefono: String(datos.get('telefono') ?? ''),
        correo: String(datos.get('correo') ?? '') || undefined,
        ciudad: String(datos.get('ciudad') ?? '') || undefined,
        interes: String(datos.get('interes') ?? '') || undefined,
        mensaje: String(datos.get('mensaje') ?? '') || undefined,
        marca,
        seccion: String(datos.get('seccion') ?? '') || undefined,
      },
      huella,
    )
  } catch (e) {
    // Si Go High Level falla, el correo al vendedor igual sale. Solo se registra el error, sin datos de la persona.
    console.error('[puente] formulario → GHL falló:', (e as Error).message)
  }
}

// Uso dentro de la ruta (ejemplo):
//
//   const [correo] = await Promise.allSettled([
//     enviarCorreoConResend(datos),          // lo que ya tienes
//     mandarAGoHighLevel(datos, 'Kingstar'), // nuevo
//   ])
//   // La respuesta al navegador (y la conversión) siguen dependiendo SOLO de que el correo salió bien.
//   if (correo.status !== 'fulfilled') return new Response(null, { status: 502 })
//   return Response.json({ ok: true })
