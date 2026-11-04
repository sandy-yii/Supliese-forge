# Para Rodolfo: Search Console para los botones de llamada

**Fecha:** 2026-11-04 · **De:** Sandy · **Para:** Rodolfo · **Prioridad:** alta (hoy, si se puede)

## Por qué

Los botones de llamada de los anuncios de Quick Laundry, Kingstar y Girbau siguen rechazados por «número de teléfono no verificado». Soporte de Google (caso 6-4979000042447) ya revisó clmmexico.com y confirmó que la página cumple. Para que su sistema valide las páginas, nos pide **vincular Search Console** de cada dominio a su cuenta de Google Ads.

Para vincularlo, la cuenta **gamesailmx@gmail.com** tiene que ser **propietaria** de cada sitio en Search Console. Esa es la cuenta con la que se manejan los anuncios.

## Sitios

Por orden de urgencia:

1. supliese.com (Quick Laundry)
2. clmmexico.com (Kingstar)
3. girbauoccidente.com (Girbau)
4. servicioparalavanderias.com (Laundry Solutions)
5. gamesail.mx (Gamesail)

Los botones de Laundry Solutions y Gamesail no están rechazados. Aun así conviene dejar los cinco de una vez, porque así Google tiene a qué remitirse si algún otro botón vuelve a quedar rechazado.

## Qué te pido

**Si ya tienes alguno verificado en Search Console:**
- [ ] Ve a Configuración > Usuarios y permisos > Agregar usuario.
- [ ] Agrega `gamesailmx@gmail.com` con permiso **Propietario**. Si no te deja ponerlo como propietario, ve a «Propietarios verificados», agrégalo desde ahí y avísame.

**Si alguno no está verificado:**
- [ ] Usa la opción que te sea más rápida:
  - **Propiedad de dominio**, con un registro TXT en el DNS. Cubre www, sin www, http y https.
  - **Prefijo de URL**, con la etiqueta `<meta name="google-site-verification" …>` en el `<head>`, publicada en Vercel.
- [ ] Verifícalo y agrega a `gamesailmx@gmail.com` como **Propietario**.

**En cualquiera de los dos casos:**
- [ ] No cambies las páginas ni el teléfono visible.
- [ ] Si quieres, aprovecha para enviar el sitemap de cada sitio. No es necesario para los botones.

## Cuando quede

Mándame una línea por sitio:

`Search Console · dominio · tipo (dominio / prefijo) · gamesailmx propietario (sí/no)`

Con eso vinculo Search Console en cada cuenta de Google Ads y le pedimos a Google que vuelva a revisar los botones.
