# Pendientes en las páginas · para Rodolfo

Lista de todo lo que hay que cambiar en las páginas (landing pages) para que los anuncios de Google funcionen y midan bien. Se va actualizando: lo nuevo se agrega abajo, en el **Registro**, con fecha.

Cuando termines algo, avísale a Sandra qué y en qué página, para que ella haga su parte en Google Ads.

| Marca | Página | Cuenta de Google Ads | Teléfono y WhatsApp del vendedor |
|---|---|---|---|
| Quick Laundry | https://quicklaundry.store/ | 256-397-2201 | **33 2601 2237** (Liliana) |
| Girbau | https://girbaupro.com/ | 860-582-6837 | **33 2806 8994** (Eduardo) |
| Kingstar (CLM) | https://kingstar.com.mx/ | 993-525-8739 | 33 1564 1538 |
| Laundry Solutions (Servicio) | https://laundrysolutions.store/ | 265-909-2662 | 33 1417 2994 |
| Gamesail | https://gamesail.mx/ | 118-347-6484 | 33 1185 9797 |

Los números de Kingstar, Laundry Solutions y Gamesail son los de tu lista del 21 oct. Si alguno cambió, avísale a Sandra.

---

## 1. URGENTE · Escribir el teléfono en la página

**Qué pasa:** Google **rechazó el botón de llamada** de los anuncios de Quick Laundry y de Girbau con el motivo «Número de teléfono sin verificar». Google solo muestra ese botón si el **mismo número** aparece escrito en la página a la que lleva el anuncio. Hoy no aparece, y por eso nadie puede llamar desde el anuncio.

**Qué hacer, en cada página:**
- [ ] Poner el número **como texto visible**, no solo como ícono, imagen o botón sin número. Formato: `33 2601 2237`.
- [ ] Que el número sea también un enlace para llamar: `<a href="tel:+523326012237">33 2601 2237</a>`.
- [ ] Ponerlo en el **pie de página** (así sale en toda la página) y en la sección de contacto. Arriba en el encabezado también ayuda.
- [ ] Que el número venga en el **HTML que manda el servidor**, para que Google lo lea sin ejecutar JavaScript. En Next.js eso es normal con componentes de servidor o páginas estáticas; solo evita que el número aparezca únicamente después de un `useEffect` o de abrir un modal.
- [ ] Usar exactamente el número de la tabla de arriba, el mismo del anuncio.

| Página | Texto | Enlace |
|---|---|---|
| quicklaundry.store | 33 2601 2237 | `tel:+523326012237` |
| girbaupro.com | 33 2806 8994 | `tel:+523328068994` |
| kingstar.com.mx | 33 1564 1538 | `tel:+523315641538` |
| laundrysolutions.store | 33 1417 2994 | `tel:+523314172994` |
| gamesail.mx | 33 1185 9797 | `tel:+523311859797` |

Quick Laundry y Girbau son las urgentes, porque ya están rechazadas. En las otras tres hazlo igual para que no les pase lo mismo.

**Después (lo hace Sandra):** pone la página como «URL de verificación» en el botón de llamada y pide revisión a Google.

---

## 2. El botón de WhatsApp de la página debe ir al vendedor

- [ ] Que todos los botones de WhatsApp (el flotante, el de la sección de contacto y el del encabezado) usen el número del vendedor de esa marca: `https://wa.me/523326012237` en Quick Laundry y `https://wa.me/523328068994` en Girbau.
- [ ] Que sean enlaces `<a href="https://wa.me/...">`. Si alguno se abre con `window.open`, hay que agregarle `registrar('whatsapp')` en su `onClick` (ver punto 3) para que se mida.
- [ ] Quitar el chat viejo (Coudibot) si todavía está en alguna página. Ya no se usa.

---

## 3. Instalar o revisar el código de medición de Google Ads

**Qué pasa:** en Quick Laundry, la conversión «AB · Clic en WhatsApp» lleva **0** en el último mes, aunque sí hubo conversaciones. Eso indica que el código de la página **no está instalado o no está mandando el clic**. Si no se mide, Google no aprende qué anuncios traen clientes.

**Qué hacer en cada página:**
- [ ] Instalar el código de `medicion/nextjs/` siguiendo `medicion/nextjs/README.md` (guía completa: `medicion/nextjs/Guia-medicion-landings.md`).
- [ ] Poner las variables de **ese** sitio, que están en `medicion/nextjs/etiquetas-por-sitio.md`, y **volver a publicar**. Las variables `NEXT_PUBLIC_` solo se leen al construir.
  - Nunca se pone la etiqueta de una cuenta en la página de otra marca.
  - **Gamesail:** todavía faltan sus etiquetas. Sandra te las pasa en cuanto cree las conversiones en la cuenta nueva.
- [ ] El formulario debe llamar `registrarFormulario(...)` **solo cuando el envío salió bien**.
- [ ] Si la página ya tenía otra etiqueta de Google (gtag o Google Tag Manager) de la página anterior, quitarla para no contar doble.
- [ ] Probar con **tagassistant.google.com**: abrir la página, dar clic en WhatsApp y en el teléfono, y enviar un formulario de prueba. Deben aparecer el `AW-…` y la conversión de cada clic. Avisarle a Sandra qué formulario de prueba fue, para no contarlo como cliente.

---

## 4. Anclas de los enlaces de sitio (recomendado)

Los enlaces de sitio de los anuncios llevan a secciones de la página con `#`. Si la sección no existe, la página abre arriba: funciona, pero el cliente no llega a lo que buscaba.

- [ ] Agregar el `id` a la sección que corresponda, por ejemplo `<section id="cotizar-maquinaria">`.

**Girbau (girbaupro.com):** `lavanderas-industriales`, `cotizar-maquinaria`, `conoce-nuestras-lavadoras`, `aseo-para-empresas`, `limpieza-profesional`, `proveedores-nacionales`

**Quick Laundry (quicklaundry.store):** `nuestros-paquetes`, `cotiza-tu-equipo-hoy`, `lg-lavadora-industrial`, `lavadoras-industriales`, `equipos-profesionales-mx`, `cobertura-nacional`

Las anclas de Kingstar, Laundry Solutions y Gamesail se agregan aquí cuando Sandra las saque de sus cuentas.

---

## 5. Aviso de privacidad

- [ ] El aviso de privacidad de cada página debe decir que se usan herramientas de Google para medir la publicidad. El formulario manda correo y teléfono cifrados a Google para medir mejor.

---

## Cómo avisar que quedó

Copia esta tabla, marca lo que hiciste y mándasela a Sandra:

| Página | 1. Teléfono escrito | 2. WhatsApp al vendedor | 3. Medición probada | 4. Anclas | 5. Privacidad |
|---|---|---|---|---|---|
| quicklaundry.store | | | | | |
| girbaupro.com | | | | | |
| kingstar.com.mx | | | | | |
| laundrysolutions.store | | | | | |
| gamesail.mx | | | | | |

---

## Registro

- **27 oct 2026:** se crea esta lista. Google rechazó el botón de llamada en Quick Laundry y Girbau porque el número no aparece en la página (punto 1). En Quick Laundry, el clic en WhatsApp de la página no está registrando conversiones (punto 3). En Google Ads ya no queda ningún enlace a las páginas viejas (supliese.com, landing.supliese.com, girbauoccidente.com).
