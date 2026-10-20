// Ejemplo para Pages Router (carpeta pages/). Solo hay que agregar las líneas marcadas a su _app actual.
import type { AppProps } from 'next/app'
import GoogleTags from '../../components/GoogleTags' // ← agregar
import RastreoClics from '../../components/RastreoClics' // ← agregar

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTags /> {/* ← agregar */}
      <RastreoClics /> {/* ← agregar */}
    </>
  )
}
