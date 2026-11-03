# Respuesta de Sandy a tu comparación de las dos páginas contra lo que está en vivo

2026-11-03 · De: Sandy · Para: Rodolfo · Responde a tu revisión del 3 nov (las 7 diferencias).

Gracias, la revisión sirvió. Van las respuestas en el mismo orden y, al final, las líneas S que faltaban.

## 1. Girbau: el anuncio de prueba va a la portada, sin ruta

La URL final del anuncio «Girbau Búsqueda | Nerea › Barreras sanitarias» es exactamente **`https://girbauoccidente.com/`**, sin ruta. El script tampoco usa rutas en Girbau: todos los anuncios van a `https://girbauoccidente.com/` y los enlaces de sitio a la portada con su ancla (`#…`).

Así que los 404 de `/barreras-sanitarias`, `/barrera-sanitaria` y `/nerea` no son la causa. En el detalle de la política, Google marca su última revisión del destino **el 29 de octubre, en iPhone**, antes de que conectaras el dominio el 1 de noviembre. La apelación del 2 nov pide que lo revise de nuevo. Con tu comprobación de hoy (200, DNS solo a Vercel, http y www bien) tiene buenas razones para salir.

- **No redirijas `girbaupro.com` todavía.** Los anuncios de Girbau siguen ahí hasta que Google apruebe. Te mando `S2 · Girbau · lista` cuando pasen.
- Corrige de todos modos `/lavadoras` y `/proveedores` sin diagonal (que redirijan igual que con diagonal), por las visitas viejas.

## 2. Los 301 de los dominios comprados: ya puedes hacerlos en tres marcas

Perdón, faltaba mandarte las líneas. Ya ningún anuncio ni enlace de sitio de esas cuentas usa el dominio comprado (lo revisé con la extensión el 3 nov):

```
S2 · Quick Laundry · lista        → quicklaundry.store  a supliese.com, mismo camino
S2 · Kingstar México · lista      → kingstar.com.mx     a clmmexico.com, mismo camino
S2 · Laundry Solutions · lista    → laundrysolutions.store a servicioparalavanderias.com, mismo camino
S2 · Girbau · todavía no          → girbaupro.com se queda como está
```

## 3. `/landing/` y `/contacto`

Tienes razón, ya están desde el 2 nov. Lo quité de pendientes.

## 4. El UA de supliese.com

De acuerdo: no es de tu código, viene de la etiqueta de Google. Va con el punto de «la etiqueta la administra otra cuenta» y ya no te lo pido. Sigue en pie la pregunta: ¿sabes quién es administrador de las propiedades de GA4 «https://gamesail.mx/» (G-69R59Z71PV) y «CLM» (G-26FWQ5PPVJ), o de un Tag Manager con esas etiquetas? Si no sabes, se lo pregunto al cliente.

## 5. El teléfono de Girbau

La etiqueta es la correcta: `ps85CLnf9aMdENek5PVD` es **«AB · Clic en teléfono de la página»** de la cuenta 860-582-6837 (salió del registro de cuando se crearon las conversiones, el 26 oct). No cambies nada. Repito la prueba con Tag Assistant aceptando cookies y te paso el resultado (S7).

## 6. Tu `docs/decisiones.md`

Corrígelo así: **«2-nov: $0 de aumento. Se movió dinero entre las campañas nuevas, dentro del tope mensual de cada cuenta. Las campañas anteriores no se tocan; usar su presupuesto necesita autorización del cliente.»**

## 7. Lo menor

- Corregí en la página del cliente lo de los formularios: cuentan cuando el envío sale bien o cuando la persona abre el WhatsApp de respaldo.
- Corregí en el control interno la fecha de la etiqueta de Laundry Solutions (código desde el 26 oct, en servicioparalavanderias.com desde el 31 oct).
- `kingstarmexico.com` y `laundrysolutions.com.mx`: con el S1 de abajo ya puedes moverlos a su marca.

## Las líneas S que no te habían llegado

```
S1 · Quick Laundry · no
S1 · Laundry Solutions · no
S1 · Kingstar México · no
S1 · Girbau · no
   (ningún anuncio ni enlace usa kingstarmexico.com ni laundrysolutions.com.mx)
S3 · todas · ninguna que usemos
   (las conversiones de formulario de las páginas viejas ya no se usan; solo cuentan las «AB ·»)
S5 · hecho (tú lo cerraste el 2 nov con /landing/ y /contacto)
S6 · en parte: apagado en Girbau y Servicio; Kingstar y Quick Laundry necesitan al administrador de su etiqueta
S7 · en proceso: repito Tag Assistant aceptando cookies
S8 · espero tu «S8 · formularios por correo · en vivo»
```
