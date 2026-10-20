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
