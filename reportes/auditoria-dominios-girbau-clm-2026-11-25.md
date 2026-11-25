# Auditoría: resultado «clmmexico.com» con la página de Girbau · 25 nov 2026

**Pregunta:** en Google aparece un resultado con la dirección `www.girbauoccidente.com.clmmexico.com`, con el título «Girbau México — Soluciones de Lavandería 360°». ¿Viene de una campaña, actual o vieja?

**Respuesta: no.** Ninguna campaña de Girbau ni de Kingstar, activa, pausada o vieja, ha llevado tráfico a ese subdominio. Es un resultado orgánico (sin «Patrocinado») causado por la configuración del dominio.

## Qué se revisó (conector TrueClicks, solo lectura)

| Revisión | Girbau (860-582-6837) | Kingstar (993-525-8739) |
|---|---|---|
| Páginas a las que llegaron los clics de anuncios, del 1 ene 2025 al 25 nov 2026 | girbauoccidente.com, girbaupro.com (hasta el 3 nov) y una prueba en vercel.app (0 clics). **Ningún clic a clmmexico.com** | clmmexico.com, www.clmmexico.com, kingstar.com.mx (redirige a clmmexico.com) y una prueba en vercel.app. **Ningún clic a una dirección de Girbau** |
| Anuncios activos | Todos a girbauoccidente.com | — |
| Grupos de Máximo rendimiento (6) | Todos a girbauoccidente.com | — |
| Enlaces de sitio | Todos a girbauoccidente.com | Todos a clmmexico.com |
| Plantillas de seguimiento y sufijos (cuenta y campañas, incluidas las pausadas) | Vacíos | Vacíos |

## Causa probable

En la configuración del dominio clmmexico.com existe el subdominio `www.girbauoccidente.com`. Ese error suele pasar cuando, al conectar el dominio de Girbau, se escribe el nombre en el panel equivocado. Hay tres datos que lo apoyan:
- Las 5 páginas de las marcas están en el mismo servidor.
- Por eso el subdominio muestra Girbau.
- El título del resultado es de una versión vieja de la página.

No se pudo abrir el subdominio desde este entorno, porque la red lo bloquea.

## Hallazgo extra

**girbaupro.com** sigue mostrando la página completa de Girbau, en lugar de redirigir a girbauoccidente.com. Kingstar sí lo hace bien: kingstar.com.mx redirige a clmmexico.com. Los anuncios de Girbau usaron girbaupro.com en octubre y hasta el 3 de noviembre (437 clics); hoy ya no lo usa ninguno.

## Qué tiene que hacer Rodolfo

1. Borrar el registro `www.girbauoccidente.com` en los DNS de clmmexico.com, o redirigirlo con 301 a `https://girbauoccidente.com/`.
2. Revisar que clmmexico.com no tenga un comodín (`*.clmmexico.com`).
3. Hacer que girbaupro.com (con y sin www) redirija con 301 a `https://girbauoccidente.com/`.
4. Revisar que las direcciones de prueba en vercel.app no estén indexadas. Si lo están, redirigirlas o marcarlas como «noindex».
5. Pedir en Search Console que se quite el resultado viejo.

Ninguno de estos pasos toca los anuncios ni frena leads.
