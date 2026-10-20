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
