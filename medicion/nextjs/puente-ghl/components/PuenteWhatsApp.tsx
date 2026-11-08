'use client'

// Va una vez en el layout raíz, junto a <GoogleTags /> y <RastreoClics />. No cambia cómo se miden los botones.
//
// Qué hace:
// 1. Al cargar, lee la huella del clic del anuncio (si la persona vino de un anuncio).
// 2. Cuando la persona acepta las cookies, la guarda 90 días.
// 3. Si la persona vino de un anuncio y toca un enlace de WhatsApp, agrega al final del mensaje ya escrito
//    «Folio web: QL-7K3P9M» y manda al servidor la pareja folio → huella. Sin anuncio o sin cookies aceptadas,
//    el mensaje queda exactamente igual que hoy.
//
// `consentido` es el mismo estado que hoy decide si carga gtag (la persona dio «Aceptar»).

import { useEffect, useRef } from 'react'
import { FOLIO_EN_MENSAJE, guardarHuella, leerHuella, nuevoFolio, prepararHuella } from '../lib/huella'

const WHATSAPP = /^(https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\/|whatsapp:)/i
const PREFIJO = process.env.NEXT_PUBLIC_PREFIJO_FOLIO ?? ''

// Para botones que abren WhatsApp con window.open en vez de un enlace <a>: pasar la dirección por aquí.
export function conFolio(href: string, consentido: boolean): string {
  if (!PREFIJO || !WHATSAPP.test(href)) return href
  const huella = leerHuella(consentido)
  if (!huella) return href
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return href
  }
  const texto = url.searchParams.get('text') ?? ''
  if (FOLIO_EN_MENSAJE.test(texto)) return href // ya trae folio
  const folio = nuevoFolio(PREFIJO)
  const nuevoTexto = `${texto}${texto ? '\n\n' : ''}Folio web: ${folio}`
  // Se arma a mano con encodeURIComponent: searchParams escribe los espacios como «+» y no todos los
  // WhatsApp lo leen como espacio.
  url.searchParams.delete('text')
  const base = url.toString()
  const conTexto = `${base}${base.includes('?') ? '&' : '?'}text=${encodeURIComponent(nuevoTexto)}`
  const cuerpo = new Blob([JSON.stringify({ folio, huella })], { type: 'application/json' })
  // sendBeacon sobrevive aunque la página se cierre al abrir WhatsApp.
  if (!navigator.sendBeacon?.('/api/huella', cuerpo)) {
    fetch('/api/huella', { method: 'POST', body: cuerpo, keepalive: true }).catch(() => {})
  }
  return conTexto
}

export default function PuenteWhatsApp({ consentido }: { consentido: boolean }) {
  const consentidoRef = useRef(consentido)
  consentidoRef.current = consentido

  useEffect(() => {
    prepararHuella()
  }, [])

  useEffect(() => {
    if (consentido) guardarHuella()
  }, [consentido])

  useEffect(() => {
    function alHacerClic(evento: MouseEvent) {
      if (!(evento.target instanceof Element)) return
      const enlace = evento.target.closest('a[href]')
      if (!enlace) return
      const href = enlace.getAttribute('href') ?? ''
      if (!WHATSAPP.test(href)) return
      const nuevo = conFolio(href, consentidoRef.current)
      // Se cambia antes de que el navegador siga el enlace, así WhatsApp abre ya con el folio.
      if (nuevo !== href) enlace.setAttribute('href', nuevo)
    }
    document.addEventListener('click', alHacerClic, { capture: true })
    return () => document.removeEventListener('click', alHacerClic, { capture: true })
  }, [])

  return null
}
