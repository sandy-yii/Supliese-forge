# Vaciado martes 17 nov 2026 (día completo) · primer día sin Display · corrido el miércoles 18 a las 10:02

| Marca | Google contactos | Resend personas | Impresiones | Clics | Gasto | Clics de 12 a 6 a.m. | Lunes 16 (Google · gasto) |
|---|---|---|---|---|---|---|---|
| Kingstar | **6** | 6–7 | 203 | 31 | $222 | 2 (búsqueda) | 3 · $358 |
| Girbau | 5 | ~10–15 (19 avisos, 1 con datos) | 2,669 | 120 | $233 | 0 | 0 · $0 |
| Quick Laundry | 3 | 8–9 | 200 | 37 | $362 | 1 (búsqueda) | 2 · $347 |
| Laundry Solutions | 1 | 0 | 52 | 8 | $80 | 0 | 1 · $106 |
| Gamesail | **0** | 2 | 480 | 46 | $236 | 0 | 5 · $502 |
| **Suma** | **15** | **~27–33** | | | **$1,133** | 3 | 11 · $1,313 |

- Sin robots: 3 clics de madrugada en todas las cuentas, todos de búsqueda. Display apagado en todas ✅.
- Costo por contacto en Google: ~$76 (lunes ~$119).
- **Kingstar:** 6 contactos con $222. «Lavandería hotelera e institucional» 3 («lavadora industrial 50 kg precio»). Ciudades de todo el país. Gastó menos que su presupuesto: ahora la frena la puja o las búsquedas, no el dinero.
- **Girbau:** solo salió Máximo rendimiento (las campañas de búsqueda no tuvieron impresiones: revisar si siguen en revisión). Clics baratos ($1.94) y muchas impresiones: parte puede ser fuera de la búsqueda. Contacto en Tlaquepaque, Jal.
- **Laundry Solutions:** casi no sale (52 impresiones). Contacto desde Fresnillo, Zac. (¿zona de servicio?).
- **Gamesail:** 0 en Google. Sin Display, sus impresiones bajaron de 3,041 a 480. Sus contactos de Google del lunes fueron casi todos en horas con Display. Riesgo: parte de sus leads reales venía de Display. Se mide un día más antes de decidir.
- Diagnóstico de puja vs presupuesto: `campanas/salida/por-que-salen-poco-kingstar-ls-gamesail.js` (solo lee).

# Vaciado miércoles 18 nov (hasta las 22:39)

| Marca | Google contactos | Resend personas | Gasto | Nota |
|---|---|---|---|---|
| Gamesail | 4 (+1 llamada del anuncio NO contestada, 15:08, secadoras) | 9 (4 con datos) | $392 | «lavadoras industriales precios» trajo formulario, llamada y WhatsApp (CDMX, 19 h) |
| Laundry Solutions | 2 (llamada y correo, Toluca, Servicio técnico) | 1 | $71 | La llamada está en la hoja: servicio a 3 equipos industriales |
| Girbau | 2 (Máximo rendimiento) | 10 | $234 | 4 clics de madrugada en YouTube/Discover ($5) |
| Kingstar | 1 (hotelera, «lavadora industrial 50 kg precio», 17 h) | 2 | $248 | Tope de hotelera $18 → $21 a las ~16:20 (falta el registro de Ejecutar) |
| Quick Laundry | 1 (Emprendimiento) | 2 | $316 | «Equipo para lavandería» $246 y 0 contactos hoy; pierde ~90% por presupuesto |
| **Suma** | **10** | **~24** | **$1,261** | |

## Jueves 19 nov: ya no sale el aviso «Abrieron WhatsApp sin dejar datos»

- Desde ~00:07 (pruebas de Rodolfo) no hay ningún aviso «Abrieron WhatsApp sin dejar datos» en ninguna marca. El último fue el miércoles 23:29 (Quick Laundry).
- Revisado el código de las 5 páginas (11:15): el botón de WhatsApp abre WhatsApp primero, cuenta la conversión en Google y ofrece la ventanita opcional. **Solo manda aviso por Resend si la persona deja nombre y teléfono** (o llena el formulario). Igual en las 5 páginas; `/api/contacto` responde en las 5.
- Además, desde las 8:53 cada aviso sale en correos separados (vendedor + 4 copias).
- **Consecuencia:** desde el jueves, Resend cuenta solo contactos con datos. No se puede comparar con lunes a miércoles (ahí ~2/3 eran «abrieron WhatsApp»). Para el conteo diario: conversiones de Google (`como-van-hoy-5-cuentas.js`) + hoja de vendedores.
- **Confirmado por Sandy (11:25): fue a propósito**, porque esos avisos eran de gente que no mandaba mensaje.
- Hasta las 11:11: 1 aviso real (Quick Laundry, formulario 9:43). Google contaba 4 contactos a las 9:56.
