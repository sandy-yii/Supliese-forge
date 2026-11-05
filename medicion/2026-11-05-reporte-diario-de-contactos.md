# Reporte diario de contactos: lo que dice Google contra lo que cuentan los vendedores

**Desde:** viernes 6 nov 2026 · **Acordado en:** la junta del 5 nov · **Lo arma:** Sandy, con los registros de Google Ads y el conteo de cada vendedor.

## Qué se reporta cada día

Por marca, del **día anterior completo**:

| | WhatsApp | Llamadas | Correo o formulario | Total |
|---|---|---|---|---|
| Google Ads | del script | del script (botón del anuncio + clic al teléfono de la página) | del script | |
| Vendedor | de su conteo | de su conteo | de su conteo | |
| Diferencia y por qué | | | | |

## Cómo se arma (todos los días, en la mañana)

1. **Correr el script.** En las 5 cuentas se corre `campanas/salida/cierre-del-dia-todas-las-cuentas.js` en Vista previa. Da «ayer» completo y «hoy» hasta la hora. Se copian las líneas `REPORTE ·` de ayer.
2. **Pedir el conteo.** Antes de las 10 de la mañana, cada vendedor manda su conteo del día anterior con el formato de abajo.
3. **Mandar todo a Claude.** Se le pasan los 5 registros y los 5 conteos, y arma el reporte del día con la comparación.

## Mensaje para los vendedores (lo reenvía el cliente una vez)

> Buen día. A partir de mañana, cada mañana antes de las 10 mándenme el conteo de ayer con este formato:
>
> **Conteo de ayer · [Marca] · [fecha]**
> WhatsApp nuevos: __ (de esos, con el mensaje «vengo de la página»: __)
> Llamadas nuevas: __ (de esos, cuántos dijeron que nos encontraron en Google: __)
> Correos o formularios: __
> De todos, ¿cuántos sí querían cotizar o comprar?: __
>
> «Nuevos» quiere decir personas que escriben o llaman por primera vez. No cuenten a clientes que ya atendían ni a proveedores. Si no llegó nada, pongan 0. Si pueden, en las llamadas pregunten «¿cómo nos encontró?».

## Por qué no coinciden los números (para explicarlo al cliente)

**Google puede marcar menos que el vendedor:**

- **Cookies.** Google solo cuenta a quien acepta las cookies de la página. Quien no las acepta escribe igual, pero Google no lo ve.
- **Llamadas marcadas a mano.** Si alguien ve el número y lo marca desde otro teléfono, Google no se entera. Mientras el botón de llamada no esté aprobado (QL, Girbau y Kingstar), la mayoría de las llamadas son de este tipo.
- **Contactos que no vienen del anuncio.** Búsqueda gratis de Google, Facebook, Maps, recomendaciones y clientes de siempre le llegan al vendedor, pero no son del anuncio.

**Google puede marcar más que el vendedor:**

- **WhatsApp que no se mandó.** Google cuenta el toque al botón de WhatsApp, aunque la persona no llegue a mandar el mensaje.
- **Llamadas que no se hicieron.** El «clic al teléfono de la página» es un toque al número; la persona puede no terminar la llamada.
- **Contactos de otro tipo o de otro día.** El vendedor puede contarlos en otro tipo o en otro día, o no contarlos si eran clientes que ya atendía.

**Se cuentan en otro tipo:**

- **El formulario hoy abre WhatsApp al enviar.** Google lo cuenta como «formulario», pero al vendedor le llega como **WhatsApp**. Hasta que Rodolfo encienda el correo (S8), para comparar se suma «WhatsApp + formulario» de Google contra «WhatsApp» del vendedor.

**Lo que ayuda a que coincidan:**

- **La frase «vengo de la página de [Marca]» en el WhatsApp.** Se le pidió a Rodolfo el 5 nov. Con ella el vendedor distingue los contactos de la página.
- **Las llamadas del botón del anuncio con su hora.** El script las da con hora, duración y si se contestaron, para buscarlas en el teléfono del vendedor.
- **El correo del formulario (S8).** Cada correo dirá si la persona llegó por un anuncio.

## Regla al presentarlo

- **Los números de Google no se maquillan ni se redondean hacia arriba.**
- **Si el vendedor cuenta menos que Google,** se dice tal cual y se revisa qué pasó: un WhatsApp que no se mandó, o un mensaje que no se contestó.
- **Si cuenta más,** se explica con lo de arriba.
