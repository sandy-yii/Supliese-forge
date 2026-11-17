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
