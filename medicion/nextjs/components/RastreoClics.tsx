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
