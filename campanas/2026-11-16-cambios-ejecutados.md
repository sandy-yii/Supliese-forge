# Cambios ejecutados · lunes 16 nov 2026

| Hora | Cuentas | Cambio | Script | Resultado |
|---|---|---|---|---|
| ~9:45 | Kingstar (5), Laundry Solutions (2), Gamesail (6) | **Display apagado** en las 13 campañas de búsqueda «AB · …» | `campanas/salida/apagar-display-corto.js` (desde la cuenta de administrador) | Vista previa 9:40 con 13 campañas; Ejecutar sin errores, según Sandy |

**Por qué:** la app de Google Ads del celular (cuenta de trabajo) prendió Display el viernes 13 entre 23:17 y 00:22. En 2.5 días Display gastó unos $1,400 en páginas basura («Shein gratis», «vales de despensa», préstamos, Taboola, catálogos de maquinaria) y generó las ráfagas de avisos de medianoche en Resend.

**Hoy ya no se mueve nada más** en Kingstar, Laundry Solutions ni Gamesail (un cambio por cuenta al día).

**Se revisa mañana con `revision-completa-todas-las-cuentas.js`:**
- parte C: «Display apagado en todas ✅»;
- sección 7: casi sin clics de 12 a 6 a.m.;
- Resend: sin ráfagas de medianoche.

**Pendientes:**
- Girbau: 5 anuncios y 6 grupos de Máximo rendimiento rechazados por `girbauoccidente.com` caída. En espera del cliente; Sandy no cambia la página hasta que respondan.
- Correo del asesor de Kingstar sigue rebotando.
- Mar 17: negativas de compradores en Laundry Solutions, topes por clic en Kingstar, Gamesail por pasos; fotos pasan al miércoles 18.
- Quien tenga la app de Google Ads con la cuenta de trabajo: no aceptar recomendaciones desde la app.

# Cambios ejecutados · martes 17 nov 2026

| Hora | Cuenta | Cambio | Script | Resultado |
|---|---|---|---|---|
| ~9:50 | Quick Laundry | **Display apagado** en «AB · Equipo para lavandería» (socios se quedan prendidos: 2 clics, $4, 0 contactos en 7 días) | `campanas/salida/quick-laundry-display-revisar-y-apagar.js` | Ejecutado con éxito, según Sandy. Deshacer: `DESHACER = true`. |

**Por qué:** el historial muestra que la app de Google Ads del celular (gamesailmx) prendió Display en esa campaña el 4 nov (Display y socios) y otra vez el **lunes 16 a las 6:06 p.m.**, horas después de apagarlo en las otras cuentas. Entre medio, un script nuestro lo apagó el 9 nov. Display no alcanzó a gastar ($0).

**Pendiente urgente:** encontrar quién tiene la app con gamesailmx y que cierre sesión o no acepte recomendaciones.

| ~tarde | Girbau | **Apelación** «Destino no operativo» (la página `girbauoccidente.com` ya abre, revisado 14:10): 11 anuncios (5 campañas, incl. «Girbau Búsqueda \| Nerea», en pausa) y los 6 grupos de recursos de «Max Rendimiento - Girbau». Motivo: «He hecho cambios para cumplir las políticas». | Extensión Chrome, `prompt-extension/girbau-pedir-revision-anuncios-2026-11-17.txt` | Historial de apelaciones: 2 apelaciones «En curso». No se editó ni pausó nada. |

**Girbau, pendientes de la apelación:**
- 3 extensiones también rechazadas por «Destino no operativo» (no apeladas aún).
- 1 extensión de imagen rechazada por «Superposiciones gráficas o de texto» y 1 de nombre de empresa por «Irrelevancia del nombre de empresa»: se arreglan aparte (agregando una correcta, sin quitar nada).
- `girbau-cambiar-pagina-caida.js` ya no se usa: la página volvió.
- Miércoles 18: confirmar con «revision diaria» (rechazos) y el vaciado (impresiones de Girbau). Esta semana no se mueve nada más en Girbau; sus fotos pasan a la semana del 24.

| ~16:00 | Laundry Solutions | **18 negativas EXACTAS de compradores** (13 en «Reparación y mantenimiento», 5 en «Servicio técnico industrial»). $590 en 30 días sin contactos. Se quedan: «reparacion de lavadoras industriales», «unimac mexico» (trajo contacto), «unimac lavadora». | `campanas/salida/negativas-compradores-laundry-solutions.js` (versión corta ASCII) | Ejecutado con éxito, según Sandy. |

Deshacer Laundry Solutions (pegar en `LISTA_DESHACER` y Ejecutar):
`['lavadoras industriales', 'lavadora industrial', 'lavadora y secadora industrial precio', 'lavadoras industriales para negocio', 'lavadoras industriales para lavandería', 'lavadoras industriales precios', 'lorsa cdmx lavadoras industriales fracc industrial san antonio', 'lavadora para lavanderia', 'lavadoras para lavanderia', 'grupo lorsa', 'precio de lavadora industrial', 'lavadora industrial uso rudo', 'lavadora de ropa industrial', 'centro de lavado industrial', 'lavadora industrial para lavanderia', 'precio de una lavadora industrial']`

Medir: semana del 17 al 23 contra la semana anterior (contactos de Laundry Solutions en Google y Resend, mismo gasto).

# Cambios ejecutados · miércoles 18 nov 2026

| Hora | Cuenta | Cambio | Script | Resultado |
|---|---|---|---|---|
| ~16:20 | Kingstar | Tope por clic de «AB · Lavandería hotelera e institucional» **$18 → $21** (+17%). Mangles no pasó el candado (22% por puja en 7 días). | `campanas/salida/kingstar-subir-tope-hoteles-y-mangles.js` | **Aplicado** (confirmado a las 23:06: «tope actual: $21»). Deshacer: `var DESHACER = {'AB · Lavandería hotelera e institucional': 18};` |
| ~23:00 | Girbau | **3 anuncios nuevos** (copia con ruta distinta) al lado de los rechazados por «destino no operativo»: Marca Girbau › Girbau, Por capacidad y sector › Capacidad y › Sector. La página `girbauoccidente.com/` abre (200 desde Google) y otros 2 anuncios con la misma página ya estaban aprobados. | `campanas/salida/girbau-copiar-anuncios-rechazados.js` | 3 creados con éxito, según Sandy. Deshacer: la lista «PARA DESHACER» del registro (pendiente de copiar aquí). |

**Siguiente en Girbau (cuando los anuncios nuevos estén aprobados):** fotos a Por capacidad y sector, Smart Plus y Servicio técnico (`fotos-a-campanas-sin-fotos-todas-las-cuentas.js`, solo Girbau).

# Cambios ejecutados · jueves 19 nov 2026

| Hora | Cuenta | Cambio | Script | Resultado |
|---|---|---|---|---|
| ~10:05 | Gamesail | Tope por clic de «AB · Lavadoras para ropa y sábanas» **$14 → $16** (+14%). Vista previa: pierde 54% por puja y 20% por presupuesto en 7 días; 24 contactos en 14 días. | `campanas/salida/gamesail-subir-tope-lavadoras-para-ropa.js` | Ejecutado sin errores, según Sandy. Deshacer: `var DESHACER = {'AB · Lavadoras para ropa y sábanas': 14};` |

Medir el viernes 20: contactos de Gamesail (Google y Resend) y gasto contra el promedio de la marca. Riesgo dicho: con 20% perdido por presupuesto, el dinero del día puede acabarse un poco antes (mismos contactos, clic hasta $2 más caro).
No se aplicó `empujon-de-hoy-una-por-cuenta.js` (Sandy prefirió un solo cambio).
