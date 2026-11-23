# 23 nov 2026 · Gamesail: Google volvió a prender Display

Leído con TrueClicks (solo lectura) a las 9:30 a.m.

- **Quién:** «Recomendaciones aplicadas automáticamente» de Google (`GOOGLE_ADS_RECOMMENDATIONS_SUBSCRIPTION`), el **sábado 21 nov a las 19:47**, en las 7 campañas de búsqueda de Gamesail. No fue una persona, la app del celular ni un script nuestro.
- **Otras cuentas:** Quick Laundry, Kingstar, Laundry Solutions y Girbau tienen Display apagado.
- **Efecto:** domingo 22, 70% de los clics de Gamesail fueron de banners. Hoy a las 9:30, 103 de 110 clics. Unos $740 en banners desde el sábado en la noche.
- **Leads:** el último aviso real de Gamesail en Resend fue el sábado 21 a las 17:13, antes de que se prendiera Display. Desde entonces hay 0 avisos, aunque Google cuenta 9 «conversiones» de Gamesail; la mayoría salen de banners.
- **Arreglo:** `salida/gamesail-apagar-display-otra-vez.js` (solo Gamesail, con Vista previa, candado y `DESHACER`). Además, a mano: Recomendaciones → Aplicar automáticamente → apagar «Expandir tu alcance con la Red de Display», y revisar esa pantalla en las 5 cuentas.
- Hoy es el único cambio de Gamesail. El «todo en uno» se corrió el domingo 22 a las 22:58.

## Ejecutado · 23 nov, ~9:40

- Display apagado en las 7 campañas de Gamesail (registro de Sandy: «APAGADO» en las 7, 0 errores).
- Comprobado con TrueClicks: las 7 siguen encendidas, con búsqueda de Google sí y Display no.
- Pendiente a mano: apagar «Aplicar automáticamente» en Recomendaciones (Gamesail y revisar las 5).
- Medir mañana: clics de Gamesail solo de búsqueda y avisos en Resend contra su promedio (jue 20 a sáb 21: 2 a 4 avisos al día).
- Deshacer el mismo día: `DESHACER = true` en el script.

## Recomendaciones automáticas (revisado ~9:50)

- Gamesail: «Expandir alcance con Display» (`DISPLAY_EXPANSION_OPT_IN`) seguía **ENCENDIDA** después de que Sandy dijo haberla apagado. Se prendió el **sáb 21 nov a las 9:52 a.m.**; Google la aplicó a las 19:47. Volver a revisar.
- Quick Laundry, Kingstar y Laundry Solutions: todas pausadas (la de Display, desde el 11 nov). Girbau: no tiene ninguna.
- **9:54: Sandy la apagó y guardó.** Comprobado con TrueClicks: `DISPLAY_EXPANSION_OPT_IN` = PAUSED. Las 5 cuentas quedan sin recomendaciones automáticas de Display.

## Aprobaciones del «todo en uno» (adelantado, 23 nov ~10:00)

- Anuncios encendidos: **todos aprobados** en las 5 cuentas (0 rechazados, 0 limitados, 0 en revisión).
- Botones, enlaces, textos destacados y fragmentos (cuenta y campaña): **todos aptos**. Lo único no apto es un logo viejo de Kingstar (agosto), que no es de este cambio.
- Con eso, la revisión del martes 24 ya está hecha.
