// SOLO SERVIDOR. Guarda la pareja folio → huella 90 días, para unir después el WhatsApp con su clic.
// Usa Upstash Redis por su API REST (se instala desde Vercel › Storage › Marketplace › Upstash).
// Acepta los nombres de variables que pone Vercel (KV_REST_API_*) o los de Upstash (UPSTASH_REDIS_REST_*).
// No guarda datos de la persona: solo el folio y la huella del clic.

import type { Huella } from '../huella'

const URL_KV = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? ''
const TOKEN_KV = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? ''
const NOVENTA_DIAS_S = 90 * 24 * 60 * 60

async function comando(args: (string | number)[]): Promise<unknown> {
  if (!URL_KV || !TOKEN_KV) throw new Error('Falta configurar el almacén (KV_REST_API_URL y KV_REST_API_TOKEN)')
  const r = await fetch(URL_KV, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN_KV}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Almacén respondió ${r.status}`)
  const json = (await r.json()) as { result?: unknown; error?: string }
  if (json.error) throw new Error(`Almacén: ${json.error}`)
  return json.result
}

// NX: si el folio ya existe no lo pisa (evita que alguien reescriba un folio ajeno).
export async function guardarFolio(folio: string, huella: Huella): Promise<boolean> {
  const r = await comando(['SET', `folio:${folio}`, JSON.stringify(huella), 'EX', NOVENTA_DIAS_S, 'NX'])
  return r === 'OK'
}

export async function leerFolio(folio: string): Promise<Huella | null> {
  const r = await comando(['GET', `folio:${folio}`])
  if (typeof r !== 'string') return null
  try {
    return JSON.parse(r) as Huella
  } catch {
    return null
  }
}
