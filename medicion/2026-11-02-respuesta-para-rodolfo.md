# Respuesta de Sandy a «los cinco dominios de siempre ya muestran su página nueva»

2026-11-02 · De: Sandy · Para: Rodolfo · Responde a `2026-11-02-para-sandy-dominios-conectados.md`.

Gracias. Las cinco líneas de comprobación coinciden con lo que esperábamos.

## 1. Formularios: correos de cada página (urgente)

El cliente ya confirmó los correos. **`leads.supliese@gmail.com` ya no se usa: quítalo.**

| Página | Para (vendedor) | Usa el correo |
|---|---|---|
| supliese.com (Quick Laundry) | `llopez@supliese.com` | Liliana López |
| servicioparalavanderias.com (Laundry Solutions) | `mantenimiento@supliese.com` | Sergio Cervantes |
| clmmexico.com (Kingstar México) | `asesor@clmmexico.com` | Jorge Ruiz |
| girbauoccidente.com (Girbau) | `asesor@girbauoccidente.com` | Eduardo Román |
| gamesail.mx (Gamesail) | `smolina@supliese.com` | Silvia Molina |

**Con copia (CC) en todos los leads de las cinco páginas:**
- `agomez@supliese.com`
- `kgomez@supliese.com`
- `pgomez@supliese.com`
- `rmaravilla@supliese.com`

Va en copia **todo** lead o mensaje que llegue al vendedor desde las páginas.

Lo demás de los formularios se queda como en el documento anterior:
- la marca y la sección en el asunto;
- en el correo: nombre, teléfono, empresa, ciudad, equipo de interés, mensaje, sección de origen, fecha y hora, y `gclid` en un campo oculto;
- «AB · Formulario enviado» solo cuando el envío salió bien;
- anti-spam;
- nada de datos personales a Google.

**Laundry Solutions es de Sergio Cervantes**: el correo, el teléfono y el WhatsApp. El número 33 1417 2994 es el de Sergio, así que el número no cambia. Donde diga «Paulina» (por ejemplo, en el texto junto al teléfono o en el mensaje de WhatsApp), cambia el nombre a Sergio.

## 2. Respuestas por número

Sandy pasa hoy los anuncios con un script por cuenta. El script cambia **todos** los anuncios (también los de campañas pausadas) y **todos** los enlaces de sitio a la dirección exacta de la columna `destino` de tu §5. Si la página no abre, no cambia nada. Así quedan S1 y S2:

```
S1 · Quick Laundry · no (después de S2 ningún anuncio ni enlace usa otro dominio)
S1 · Laundry Solutions · no
S1 · Kingstar México · no
S1 · Girbau · no
S2 · <marca> · lista            ← Sandy te manda una línea por cuenta en cuanto termine cada una
S3 · todas · ninguna que usemos
S4 · pendiente
S5 · hecho 2026-11-02 (abajo)
S6 · en parte (abajo): apagado en Girbau y Servicio; CLM y Quick Laundry necesitan al administrador de su etiqueta
S7 · en proceso (abajo)
```

**S3.** Las conversiones de formulario de las páginas viejas («Formulario Landing», «Envío de formulario», «Envio de Formulario», «Formulario de contacto…», «Clic WA», «Llamada Landing», etc.) ya no se usan. Los reportes y las campañas nuevas cuentan solo las acciones «AB ·». Que dejen de contar está bien.

**S4.** La cuenta de Gamesail (118-347-6484) sigue sin forma de pago. En cuanto se creen sus acciones «AB ·», te paso el AW y las etiquetas.

**S5. Direcciones que usaban los anuncios antes del 20 de octubre** (sacadas de los registros de las cuentas):

| Dirección vieja | ¿Está en tu §5? |
|---|---|
| `https://www.supliese.com/` · `https://supliese.com/` | ✅ |
| `https://supliese.com/landing/` · `https://landing.supliese.com/` | ✅ |
| `https://supliese.com/#Paquetes` · `#Contacto` · `#Catalogos` · `#nuestros-paquetes` · `#marcas` · `#faq` · `#contacto` | ✅ (es la portada) |
| `https://girbauoccidente.com/` y sus anclas `#why-girbau` · `#testimoniales` · `#sectores` · `#products` · `#productos` · `#contact` · `#contacto` | ✅ (es la portada) |
| `https://www.servicioparalavanderias.com/` | ✅ |
| **`https://www.servicioparalavanderias.com/landing/`** | ❌ **Falta: redirígela (301) a la portada** |
| `https://www.clmmexico.com/` · `https://www.clmmexico.com/tunel` · `https://clmmexico.com/mangles` | ✅ |
| **`https://www.clmmexico.com/contacto`** | ❌ **Falta: redirígela (301) a la portada** (en el mapa está `contacto.php`, no `/contacto`) |

**S6. Revisado en las 4 etiquetas el 2 nov.** Lo que encontramos cambia lo que pedías:

| Cuenta | Etiqueta | Destinos | Datos del usuario / detección automática |
|---|---|---|---|
| Girbau | «Girbau» | AW-18232185431 | ✅ **Apagado hoy** |
| Servicio para Lavandería | «Servicio para Lavanderia» | AW-10977798087 | ✅ **Apagado hoy** |
| CLM (Kingstar) | «Gamesail» (combinada), solo lectura | AW-10938286388 · G-26FWQ5PPVJ · AW-17632937663 | ❌ Sigue encendido (solo correo) |
| Supliese Gómez (Quick Laundry) | «Untitled tag» (combinada), solo lectura | G-69R59Z71PV · AW-11012403016 | ❌ Sigue encendido (solo correo) |

- **AW-10938286388 no es ajena: es la cuenta de Ads de Gamesail anterior (645-094-0317), del cliente.** La etiqueta de Kingstar está combinada con la de Gamesail, y por eso las visitas de clmmexico.com también le llegan a Gamesail. **No la quitamos por ahora**, para no arriesgar la medición de Kingstar.
- **G-26FWQ5PPVJ se llama «CLM» y G-69R59Z71PV se llama «https://gamesail.mx/»**: también parecen del cliente. Se quedan.
- **UA-233360285-1 no está en ninguna etiqueta de Google Ads.** Si sigue saliendo en supliese.com, viene del código de la página: **quítalo tú**.
- **En CLM y Supliese Gómez, la detección automática no se puede apagar desde Google Ads.** Esas etiquetas están en solo lectura; las administra otra cuenta (probablemente la propiedad de GA4 o un contenedor de Tag Manager). **¿Tú o el encargado de sistemas tienen acceso de administrador** a las propiedades de GA4 «CLM» (G-26FWQ5PPVJ) y «https://gamesail.mx/» (G-69R59Z71PV), o a un contenedor de Tag Manager con esas etiquetas? Desde ahí se apaga la detección automática.
  - Mientras tanto, de tu lado, confirma que en clmmexico.com y supliese.com no se mande `user_data` y que ningún correo visible (como el de `#aviso-privacidad`) quede donde Google lo detecte.

**S7.** Sandy repite hoy la prueba con Tag Assistant (aceptando cookies): el teléfono de girbauoccidente.com y la etiqueta de servicioparalavanderias.com. Te mando el resultado.

## 3. Lo que sigue de tu lado

1. Correos de los formularios con la copia a los 4 correos de arriba (§1).
2. Redirigir `servicioparalavanderias.com/landing/` y `clmmexico.com/contacto` (S5).
3. El 301 de los dominios comprados (`quicklaundry.store`, `laundrysolutions.store`, `kingstar.com.mx`, `girbaupro.com`), por cada `S2 · <marca> · lista` que te mande Sandy.
4. `kingstarmexico.com` y `laundrysolutions.com.mx` a su marca: con el S1 de arriba ya puedes moverlos.
5. Los pendientes del documento anterior: teléfono de Girbau en la etiqueta, WhatsApp con mensaje ya escrito, que la portada de supliese.com no se mueva al cargar, Search Console y reseñas solo reales.
