# Cambios de las páginas (18 al 22 nov) llevados a Google Ads

Fuente: nota de Rodolfo del 22 nov y sus mensajes del 20 nov. Las cuentas se revisaron el 23 nov con el conector TrueClicks, que solo lee.

## Lo que se encontró en las cuentas

### Urgente: teléfonos
| Cuenta | Dónde está el número viejo | Número nuevo |
|---|---|---|
| Girbau | Botón de llamada **33 2806 8994** en 6 campañas: Máximo rendimiento, Marca, Por capacidad, Servicio técnico, Smart Plus y «Nerea» (en pausa). Botón de **WhatsApp** con ese número en la cuenta y en Máximo rendimiento. | **33 5109 5680** (Teresa) |
| Quick Laundry | Botón de llamada **33 2601 2237** en la cuenta y en 6 campañas. Botón de **WhatsApp** con ese número en la cuenta, en «Campaña Search Marcas» y en «Modelo de Negocio» (en pausa). | **33 2806 8994** (Eduardo) |

El 33 2806 8994 que hoy tiene Girbau ahora es el número de Quick Laundry: sin el cambio, las llamadas de Girbau le llegan al vendedor de Quick Laundry.

### Enlaces de sitio
| Cuenta | Enlace | Problema | Reemplazo |
|---|---|---|---|
| Gamesail | «Sección De Equipos» → `#tamanos` | La sección ya no existe | «Nuestros Equipos» → `#equipos` |
| Gamesail | «Sección De Modelos» → `#modelos` | La sección ya no existe | «Ver Capacidades» → `#capacidades` |
| Kingstar | «12 Modelos» → `#modelos` | Ya no hay tabla de 12 modelos | «Secadoras a Gas · De 15 a 100 kg» → `#secadoras` |

Girbau y Quick Laundry: sus enlaces llevan a secciones que siguen existiendo.

### Textos de anuncios que ya no coinciden con la página
| Cuenta | Texto | Página hoy | Qué hacer |
|---|---|---|---|
| Gamesail (8 anuncios) | «Secadoras de 50 a 200 kg», «Secadora Industrial 130 / 200 kg», «secadoras de 50, 100, 130 y 200 kg» | Las secadoras van de 15 a 100 kg; los 200 kg solo están en la portada, sin documento | Anuncios **nuevos al lado**, con secadoras de 15 a 100 kg |
| Gamesail («Por capacidad») | «Precios de Lavadoras» | Ya no hay precios | Anuncio nuevo con «Pide tu Cotización» |
| Kingstar («Secadoras de alta capacidad») | «Secadoras de 100 a 200 kg», «de 50 a 200 kg» | Las secadoras llegan a 100 kg | Anuncio nuevo al lado |
| Girbau (Máximo rendimiento, 6 grupos) | «Precios De Fábrica Girbau», «Precio Lavadoras Industriales», «Precio Túnel De Lavado», «Secadoras En México Precios», «Encuentra Los Mejores Precios…», «Descubre El Precio…», «Lavadoras Girbau De 20 A 50 Kg» | Ya no hay precios; el inicio dice lavadoras de 9 a 32 kg | Agregar textos nuevos y luego quitar esos |
| Quick Laundry | «Precios de Equipo», «Excelentes Precios» | **Ahora sí** muestra «Desde … USD» | No se cambia |

Ningún anuncio activo usa códigos de modelo (SHS, XGQ, Giant, SPW12, etc.).

## Cuánto tiempo se frenan los leads

**Prácticamente nada.** Todo se hace agregando lo nuevo antes de quitar lo viejo:

| Cambio | Qué pasa mientras Google revisa | Tiempo de revisión (normal) |
|---|---|---|
| Botón de llamada y WhatsApp nuevos | Los anuncios siguen saliendo. Solo el **botón de llamada o de WhatsApp del anuncio** puede no aparecer un rato. La página, sus botones y los formularios no se tocan. | De minutos a unas horas; hasta 1 día hábil |
| Enlaces de sitio | Los anuncios siguen igual; el enlace nuevo aparece cuando se aprueba | Horas |
| Anuncios nuevos | Los viejos siguen saliendo hasta que se aprueben los nuevos; después se pausan los viejos | Hasta 1 día hábil |
| Textos de Máximo rendimiento | Los grupos siguen saliendo con los textos que ya tienen | Horas a 1 día |

## Botón de WhatsApp en los anuncios (revisado el 23 nov)

| Cuenta | ¿Lo tiene? | ¿Sale? (16 al 22 nov) | Número |
|---|---|---|---|
| Kingstar | Sí, en toda la cuenta | Sí: 619 veces, 62 clics | Jorge, correcto |
| Quick Laundry | Sí, en la cuenta y en 2 campañas | Sí: 310 veces, 42 clics | **Viejo**: se cambia con el script de teléfonos |
| Laundry Solutions | Sí, en toda la cuenta | Sí: 239 veces, 26 clics | Sergio, correcto |
| Girbau | Sí, en la cuenta y en Máximo rendimiento | Sí: 101 veces, 17 clics | **Viejo**: se cambia con el script de teléfonos |
| Gamesail | Sí, desde el 3 nov, «apto» | **Nunca ha salido** (0 veces en 4 semanas) | Silvia, correcto |

El botón de Gamesail está igual que el de Kingstar, que sí sale. Google no da el motivo en los datos. Hay que revisarlo en la pantalla de Google Ads: Recursos → Mensajes.

## Calendario (excepción autorizada por Sandy el 23 nov: hoy va todo lo que agrega)

Un solo script para las 5 cuentas: `campanas/salida/todo-en-uno-23-nov.js` (se pega en la cuenta de administrador).

| Día | Girbau | Quick Laundry | Gamesail | Kingstar | Laundry Solutions |
|---|---|---|---|---|---|
| **Lun 23** (todo en uno) | Teléfono y WhatsApp; textos destacados y fragmento; textos nuevos en Máximo rendimiento | Teléfono y WhatsApp | Enlaces; textos destacados y fragmento; anuncios nuevos (secadoras 15–100 kg, sin «precios») | Enlace; anuncio nuevo de secadoras | Textos destacados y fragmento |
| Mar 24 | Revisar aprobaciones | Revisar que el botón nuevo esté aprobado | Revisar aprobaciones | Revisar aprobaciones | — |
| Mié 25 | — | «Autoservicio» tope $14 → $16 | — | «Hotelera» presupuesto +20% | «Servicio técnico» presupuesto +20% |
| Jue 26 | Quitar de Máximo rendimiento los textos con «precio», «20 a 50 kg» y «garantía» (si lo nuevo ya está aprobado) | — | Pausar los anuncios viejos que ya tengan reemplazo aprobado y no hayan traído contactos | Pausar el anuncio viejo de secadoras (igual) | — |

Presupuestos y topes, y quitar o pausar, quedaron fuera del lunes por decisión de Sandy.

Los scripts sueltos del lunes (`cambiar-telefonos-…`, `enlaces-nuevos-…`, `textos-destacados-…`) quedan como respaldo; el de todo en uno hace lo mismo y además los anuncios nuevos y los textos de Máximo rendimiento.

## Pendientes de Rodolfo (no son de Google Ads)

- Teléfono de las fichas de Google Maps: lo cambia él.
- Igualar palabras clave con las páginas: espera la versión final de Pau.
- GoHighLevel de Girbau y Laundry Solutions: falta verificarlos en Meta.

## Girbau Máximo rendimiento y enlace (ejecutado el 22 nov en la noche, hora de México)

Lo revisé después con TrueClicks:
- **Enlace «Conoce Nuestras Lavadoras»:** ahora dice «Lavadoras De 9 A 32 Kg» en Nerea y en Máximo rendimiento. El de «15 a 110 kg» ya no está.
- **Títulos:** ningún grupo tiene ya títulos con «precio». Los 6 grupos tienen «Pide Tu Cotización Girbau», «Distribuidor Exclusivo Girbau» y «Cotiza Por WhatsApp».
- **Descripciones de «Lavadoras industriales»:** ya no tienen «20 a 50 kg», «precios» ni «garantía». Tienen 3 descripciones.
- **Descripciones de los otros 5 grupos:** el cambio salió a medias, y eso explica los 20 errores. En cada grupo sí salieron «… De 20 A 50 Kg …» y «Maquinaria De Lavado Industrial … Pide Tu Presupuesto Hoy.», con 0 impresiones en esos grupos. Las descripciones nuevas no entraron. Cada grupo quedó con 5 descripciones.
- **Lo que queda pendiente:** «Descubre El Precio De Nuestros Túneles…» (Túnel) y «…Con Garantía De Fabrica» (Proveedores).
- **Lección:** `AdsApp.mutateAll` sin `partialFailure` **no** fue todo o nada al ejecutar en grupos de recursos. En scripts futuros hay que comprobar el resultado y no fiarse de que sea atómico.
