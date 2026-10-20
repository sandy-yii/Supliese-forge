import Script from 'next/script'
import { GA4_ID, GADS_ID } from '../lib/medicion'

// Carga la etiqueta de Google una sola vez y la configura para GA4 y para Google Ads.
// Va una vez en el layout raíz (App Router) o en _app (Pages Router).
export default function GoogleTags() {
  const ids = [GA4_ID, GADS_ID].filter(Boolean)
  if (ids.length === 0) return null

  const config = [
    GA4_ID && `gtag('config', '${GA4_ID}');`,
    GADS_ID && `gtag('config', '${GADS_ID}', { allow_enhanced_conversions: true });`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} strategy="afterInteractive" />
      <Script id="google-tags" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${config}`}
      </Script>
    </>
  )
}
